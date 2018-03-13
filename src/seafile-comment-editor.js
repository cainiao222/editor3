import React from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';


const { State } = require('markup-it');
const markdown = require('markup-it/lib/markdown');

const state = State.create(markdown);
const document = state.deserializeToDocument('Hello *World*  **WORLD** _FOLD_ `block`\n');


const initialValue = Value.create({document: document})
const DEFAULT_NODE = 'paragraph'


class SeafileCommentEditor extends React.Component {

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
  * Get the block type for a series of auto-markdown shortcut `chars`.
  *
  * @param {String} chars
  * @return {String} block
  */
  getType = chars => {
    switch (chars) {
      case '*':
      case '-':
      case '+':
      return 'list-item'
      case '>':
      return 'block-quote'
      default:
      return null
    }
  }

  /**
  * On key down, check for our specific key shortcuts.
  *
  * @param {Event} event
  * @param {Change} change
  */
  onKeyDown = (event, change) => {
    switch (event.key) {
      case ' ':
        return this.onSpace(event, change)
      case 'Backspace':
        return this.onBackspace(event, change)
      case 'Enter':
        return this.onEnter(event, change)
    }
  }

  /**
  * On space, if it was after an auto-markdown shortcut, convert the current
  * node into the shortcut's corresponding type.
  *
  * @param {Event} event
  * @param {Change} change
  */

  onSpace = (event, change) => {
    const { value } = change
    if (value.isExpanded) return

    const { startBlock, startOffset } = value
    const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '')
    const type = this.getType(chars)

    if (!type) return
    if (type == 'list-item' && startBlock.type == 'list-item') return
    event.preventDefault()

    change.setBlocks(type)

    if (type == 'list-item') {
      change.wrapBlock('bulleted-list')
    }

    change.extendToStartOf(startBlock).delete()
    return true
  }

  /**
  * On backspace, if at the start of a non-paragraph, convert it back into a
  * paragraph node.
  *
  * @param {Event} event
  * @param {Change} change
  */

  onBackspace = (event, change) => {
    const { value } = change
    if (value.isExpanded) return
    if (value.startOffset != 0) return

    const { startBlock } = value
    if (startBlock.type == 'paragraph') return

    event.preventDefault()
    change.setBlocks('paragraph')

    const { document } = value
    if (startBlock.type == 'list-item') {
      const pNode = document.getParent(startBlock.key)
      // unwrap the parent 'numbered-list' or 'bulleted-list'
      change.unwrapBlock(pNode.type)
    }

    return true
  }

  /**
  * On return, if at the end of a node type that should not be extended,
  * create a new paragraph below it.
  *
  * @param {Event} event
  * @param {Change} change
  */

  onEnter = (event, change) => {
    const { value } = change
    if (value.isExpanded) return

    const { startBlock, startOffset, endOffset } = value
    if (startOffset == 0 && startBlock.text.length == 0)
      return this.onBackspace(event, change)
    if (endOffset != startBlock.text.length) return

    if (
      startBlock.type != 'header_one' &&
      startBlock.type != 'header_two' &&
      startBlock.type != 'header_three' &&
      startBlock.type != 'header_four' &&
      startBlock.type != 'header_five' &&
      startBlock.type != 'header_six' &&
      startBlock.type != 'block-quote'
    ) {
      return
    }

    event.preventDefault()
    change.splitBlock().setBlocks('paragraph')
    return true
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
     * Save content
     *
     * @param {Event} event
     */
    onSave(event) {
      const { value } = this.state

      const content = JSON.stringify(value.toJSON())
      console.log(content)
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
    }
  }

  render() {
    return (
      <div>
        <div className="topbar ">
          <div>SeafileEditor</div>
          {this.renderToolbar()}
          </div>
        <div>
          <div className="editor gitbook-markdown-body">
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

    const onSave = event => this.onSave(event)
    return (
      <div className="menu toolbar-menu">
      {this.renderMarkButton('BOLD', 'format_bold')}
      {this.renderMarkButton('ITALIC', 'format_italic')}
      {this.renderMarkButton('UNDERLINED', 'format_underlined')}
      {this.renderBlockButton('block-quote', 'format_quote')}
      {this.renderBlockButton('numbered-list', 'format_list_numbered')}
      {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
      <span className="button" onMouseDown={onSave} data-active="true">
          <span className="material-icons">save</span>
      </span>
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

export { SeafileCommentEditor };
