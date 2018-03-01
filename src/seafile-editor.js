import React from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';

const { State } = require('markup-it');
const markdown = require('markup-it/lib/markdown');

const state = State.create(markdown);
const document = state.deserializeToDocument('Hello *World*  **WORLD** _FOLD_ `block`\n');



const initialValue = Value.create({document: document})
const DEFAULT_NODE = 'paragraph'


class SeafileEditor extends React.Component {

    state = {
        value: initialValue,
    }

    /**
     * Check if the current selection has a mark with `type` in it.
     *
     * @param {String} type
     * @return {Boolean}
     */

    hasMark = type => {
        const { value } = this.state
        return value.activeMarks.some(mark => mark.type == type)
    }

    /**
     * Check if the any of the currently selected blocks are of `type`.
     *
     * @param {String} type
     * @return {Boolean}
     */

    hasBlock = type => {
        const { value } = this.state
        return value.blocks.some(node => node.type == type)
    }
     
    onChange = ({ value }) => {
        this.setState({ value })
    }

    /**
     * When a mark button is clicked, toggle the current mark.
     *
     * @param {Event} event
     * @param {String} type
    */

    onClickMark = (event, type) => {
        event.preventDefault()
        const { value } = this.state
        const change = value.change().toggleMark(type)
        this.onChange(change)
    }

    /**
     * When a block button is clicked, toggle the block type.
     *
     * @param {Event} event
     * @param {String} type
     */

    onClickBlock = (event, type) => {
        event.preventDefault()
        const { value } = this.state
        const change = value.change()
        const { document } = value

        // Handle everything but list buttons.
        if (type != 'bulleted-list' && type != 'numbered-list') {
            const isActive = this.hasBlock(type)
            const isList = this.hasBlock('list-item')

            if (isList) {
                change
                    .setBlocks(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else {
                change.setBlocks(isActive ? DEFAULT_NODE : type)
            }
        } else {

            // Handle the extra wrapping required for list buttons.
            const isList = this.hasBlock('list-item')
            const isType = value.blocks.some(block => {
                return !!document.getClosest(block.key, parent => parent.type == type)
            })

            if (isList && isType) {
                change
                    .setBlocks(DEFAULT_NODE)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list')
            } else if (isList) {
                change
                    .unwrapBlock(
                        type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
                    )
                    .wrapBlock(type)
            } else {
                change.setBlocks('list-item').wrapBlock(type)
            }
        }

        this.onChange(change)
    }

     

    /**
     * Render a Slate node.
     *
     * @param {Object} props
     * @return {Element}
     */

    renderNode = props => {
        const { attributes, children, node } = props
        switch (node.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        }
    }

    renderMark = props => {
        const { children, mark } = props
        switch (mark.type) {
        case 'BOLD':
            return <strong>{children}</strong>
        case 'CODE':
            return <code>{children}</code>
        case 'ITALIC':
            return <em>{children}</em>
        case 'UNDERLINED':
            return <u>{children}</u>
        case 'TITLE': {
            return (
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    margin: '20px 0 10px 0',
                    display: 'inline-block',
                  }}
                >
                {children}
                </span>
            )
          }
        case 'punctuation': {
            return <span style={{ opacity: 0.2 }}>{children}</span>
          }
        case 'list': {
            return (
                <span
                  style={{
                    paddingLeft: '10px',
                    lineHeight: '10px',
                    fontSize: '20px',
                  }}
                 >
                 {children}
                 </span>
             )
           }
         case 'hr': {
             return (
                 <span
                   style={{
                     borderBottom: '2px solid #000',
                     display: 'block',
                     opacity: 0.2,
                   }}
                 >
                 {children}
                 </span>
             )
           }
       }
    }

    render() {
        return (
            <div>
                <div className="topbar">
                    <div>SeafileEditor</div>
                    {this.renderToolbar()}
                </div>
                <div>
                    <div className="leftNav">
                        <div className="leftNavTabHeader" />
                        <div className="leftNavContent" />
                    </div>
                    <div className="editor">
                        <Editor
                            value={this.state.value}
                            onChange={this.onChange}
                            onKeyDown={this.onKeyDown}
                            renderNode={this.renderNode}
                            renderMark={this.renderMark}
                        />
                    </div>
                </div>
            </div>
        )
    }

    renderToolbar = () => {
        return (
            <div className="menu toolbar-menu">
            {this.renderMarkButton('BOLD', 'format_bold')}
            {this.renderMarkButton('ITALIC', 'format_italic')}
            {this.renderMarkButton('UNDERLINED', 'format_underlined')}
            {this.renderMarkButton('CODE', 'code')}
            {this.renderBlockButton('heading-one', 'looks_one')}
            {this.renderBlockButton('heading-two', 'looks_two')}
            {this.renderBlockButton('block-quote', 'format_quote')}
            {this.renderBlockButton('numbered-list', 'format_list_numbered')}
            {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
            </div>
        )
    }


    renderMarkButton = (type, icon) => {
        const isActive = this.hasMark(type)
        const onMouseDown = event => this.onClickMark(event, type)
        return (
            // eslint-disable-next-line react/jsx-no-bind
            <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
                <span className="material-icons">{icon}</span>
            </span>
        )
    }


    /**
     * Render a block-toggling toolbar button.
     *
     * @param {String} type
     * @param {String} icon
     * @return {Element}
     */
    renderBlockButton = (type, icon) => {
        const isActive = this.hasBlock(type)
        const onMouseDown = event => this.onClickBlock(event, type)

        return (
            // eslint-disable-next-line react/jsx-no-bind
            <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
                <span className="material-icons">{icon}</span>
            </span>
        )
    }
};

export { SeafileEditor };
