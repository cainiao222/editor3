import React from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import EditCode from 'slate-edit-code'
import EditTable from 'slate-edit-table'
import EditList from 'slate-edit-list'

import { SeafileAPI } from 'seafile-js';

import { Tree } from './tree';
import { serverConfig } from './config'


const repoID = serverConfig.repoID;
const filePath = "/test.md";
const fileName = "test.md";

const seafileAPI = new SeafileAPI(serverConfig.server, serverConfig.username, serverConfig.password);


const { State } = require('markup-it');
const markdown = require('markup-it/lib/markdown');

const state = State.create(markdown);
const document = state.deserializeToDocument('Hello *World*  **WORLD** _FOLD_ `block`\n## header3');


const initialValue = Value.create({document: document})
const DEFAULT_NODE = 'paragraph'



function updateFile(uploadLink, filePath, fileName, content) {
  var formData = new FormData();
  formData.append("target_file", filePath);
  formData.append("filename", fileName);
  var blob = new Blob([content], { type: "text/plain"});
  formData.append("file", blob);
  var request = new XMLHttpRequest();
  request.open("POST", uploadLink);
  request.send(formData);
}

/**
 * A change function to standardize inserting images.
 *
 * @param {Change} change
 * @param {String} src
 * @param {Range} target
 */
function insertImage(change, src, target) {
  if (target) {
    change.select(target)
  }

  change.insertInline({
    type: 'image',
    isVoid: true,
    data: { src },
  })
}


const editCode = EditCode()
const editTable = EditTable()
const editList = EditList()

function MyPlugin(options) {
  return {

    /**
    * On return, if at the end of a node type that should not be extended,
    * create a new paragraph below it.
    *
    * @param {Event} event
    * @param {Change} change
    */

    onEnter(event, change) {
      const { value } = change
      if (value.isExpanded) return

      const { startBlock, startOffset, endOffset } = value
      /*
      if (startOffset === 0 && startBlock.text.length === 0)
        return this.onBackspace(event, change)
      */
      //console.log(startBlock)
      if (endOffset !== startBlock.text.length) return

      /* enter code block if put ``` */
      if (startBlock.text === '```') {
        event.preventDefault()
        editCode.changes.wrapCodeBlockByKey(change, startBlock.key)
        // move the cursor to the start of new code block
        change.collapseToStartOf(change.value.document.getDescendant(startBlock.key))
        // remove string '```'
        change.deleteForward(3)
        return true
      }

      // create a paragraph node after 'enter' after a header line
      if (
        startBlock.type !== 'header_one' &&
        startBlock.type !== 'header_two' &&
        startBlock.type !== 'header_three' &&
        startBlock.type !== 'header_four' &&
        startBlock.type !== 'header_five' &&
        startBlock.type !== 'header_six' &&
        startBlock.type !== 'block-quote'
      ) {
        return;
      }

      event.preventDefault()
      change.splitBlock().setBlocks('paragraph')
      return true
    },

    onKeyDown(event, change, editor) {
      switch (event.key) {
      case 'Enter':
        return this.onEnter(event, change)

      }
    }

  }
}

const plugins = [
  editCode,
  editTable,
  editList,
  MyPlugin(),
]


class SeafileEditor extends React.Component {

  state = {
    value: initialValue,
  }

  componentDidMount() {
    seafileAPI.login().then((response) => {

      seafileAPI.getFileDownloadLink(repoID, filePath).then((response) => {
        seafileAPI.getFileContent(response.data).then((response) => {
          const state = State.create(markdown);
          const document = state.deserializeToDocument(response.data);
          const value = Value.create({document: document})
          this.setState({
            value: value,
          })
        })
      })

    })
  }

  /**
  * Check if the current selection has a mark with `type` in it.
  *
  * @param {String} type
  * @return {Boolean}
  */

  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type === type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const { value } = this.state
    return value.blocks.some(node => node.type === type)
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
      return 'list_item'
      case '>':
      return 'block-quote'
      case '#':
      return 'header_one'
      case '##':
      return 'header_two'
      case '###':
      return 'header_three'
      case '####':
      return 'header_four'
      case '#####':
      return 'header_five'
      case '######':
      return 'header_six'
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
    if (type === 'list_item' && startBlock.type === 'list_item') return
    event.preventDefault()

    change.setBlocks(type)

    if (type === 'list_item') {
      change.wrapBlock('ul_list')
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
    return;
    /*
    const { value } = change
    if (value.isExpanded) return
    if (value.startOffset !== 0) return

    const { startBlock } = value
    console.log(startBlock.type)
    if (startBlock.type !== 'paragraph') return


    event.preventDefault()
    change.setBlocks('paragraph')

    const { document } = value
    if (startBlock.type === 'list-item') {
      const pNode = document.getParent(startBlock.key)
      // unwrap the parent 'numbered-list' or 'bulleted-list'
      change.unwrapBlock(pNode.type)
    }

    return true
    */
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
    if (type !== 'ol_list' && type !== 'ul_list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list_item')

      if (isList) {
        change
        .setBlocks(isActive ? DEFAULT_NODE : type)
        .unwrapBlock('ul_list')
        .unwrapBlock('ol_list')
      } else {
        change.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list_item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        change
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock('ol_list')
        .unwrapBlock('ul_list')
      } else if (isList) {
        change
        .unwrapBlock(
          type === 'ul_list' ? 'ol_list' : 'ul_list'
        )
        .wrapBlock(type)
      } else {
        change.setBlocks('list_item').wrapBlock(type)
      }
    }

    this.onChange(change)
  }

  /**
   * Toggle inline code or code block
   *
   * @param {Event} event
   */
  onToggleCode(event) {
    event.preventDefault()
    const { value } = this.state
    const { selection } = value
    const change = value.change()
    if (selection.isCollapsed) {
      // if selection is collapsed
      editCode.changes.toggleCodeBlock(change)
    } else {
      change.toggleMark('CODE')
    }
    this.onChange(change)
  }

  /**
   * Add table
   *
   * @param {Event} event
   */
  onAddTable(event) {
    event.preventDefault()
    const { value } = this.state
    const { selection } = value
    const change = value.change()
    if (editTable.utils.isSelectionInTable(value)) {
      editTable.changes.removeTable(change)
    } else {
      editTable.changes.insertTable(change, 2, 2)
      // need to set table align, otherwise markup-it will throw error
      editTable.changes.setColumnAlign(change, "left", 0)
      editTable.changes.setColumnAlign(change, "left", 1)
    }
    this.onChange(change)
  }


  /**
   * Add image
   *
   * @param {Event} event
   */
  onAddImage(event) {
    event.preventDefault()
    const src = window.prompt('Enter the URL of the image:')
    if (!src) return

    const { value } = this.state
    const change = value.change().call(insertImage, src)

    this.onChange(change)
  }

  /**
   * Save content
   *
   * @param {Event} event
   */
  onSave(event) {
    const { value } = this.state;

    const str = state.serializeDocument(value.document);
    //console.log(str);
    seafileAPI.getUpdateLink(repoID, "/").then((response) => {
      updateFile(response.data, filePath, fileName, str);
    });
  }

     

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    const { attributes, children, node } = props
    let textAlign;

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'ul_list':
        return <ul {...attributes}>{children}</ul>
      case 'header_one':
        return <h1 {...attributes}>{children}</h1>
      case 'header_two':
        return <h2 {...attributes}>{children}</h2>
      case 'list_item':
        return <li {...attributes}>{children}</li>
      case 'ol_list':
        return <ol {...attributes}>{children}</ol>
      case 'image':
        return <img src={node.data.get('src')} alt={node.data.get('')}/>
      case 'code_block':
        return (
          <div className="code" {...attributes}>
          {children}
          </div>
        );
      case 'code_line':
        return <pre {...attributes}>{children}</pre>;
      case 'table':
        return (
          <table>
            <tbody {...attributes}>{children}</tbody>
          </table>
        );
      case 'table_row':
        return <tr {...attributes}>{children}</tr>;
      case 'table_cell':
        textAlign = node.get('data').get('textAlign');
        textAlign = ['left', 'right', 'center'].indexOf(textAlign) === -1
            ? 'left' : textAlign;
        return (
          <td style={{ textAlign }} {...attributes}>
          {children}
          </td>
        );
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
        <div className="topbar ">
          <div>SeafileEditor</div>
          {this.renderToolbar()}
          </div>
        <div className="container-fluid">
          <div className="row">
            <div className="left-panel col-md-2">
              <Tree />
            </div>
            <div className="editor gitbook-markdown-body right-panel col-md-10">
              <Editor
                value={this.state.value}
                plugins={plugins}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                renderNode={this.renderNode}
                renderMark={this.renderMark}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderToolbar = () => {

    const onSave = event => this.onSave(event)
    const onToggleCode = event => this.onToggleCode(event)
    const onAddTable = event => this.onAddTable(event)
    const onAddImage = event => this.onAddImage(event)
    return (
      <div className="menu toolbar-menu">
      {this.renderMarkButton('BOLD', 'format_bold')}
      {this.renderMarkButton('ITALIC', 'format_italic')}
      {this.renderMarkButton('UNDERLINED', 'format_underlined')}
      {this.renderBlockButton('header_one', 'looks_one')}
      {this.renderBlockButton('header_two', 'looks_two')}
      {this.renderBlockButton('block-quote', 'format_quote')}
      {this.renderBlockButton('ol_list', 'format_list_numbered')}
      {this.renderBlockButton('ul_list', 'format_list_bulleted')}
      <span className="button" onMouseDown={onToggleCode} data-active="true">
          <span className="material-icons">code</span>
      </span>
      <span className="button" onMouseDown={onAddTable} data-active="true">
          <span className="material-icons">grid_on</span>
      </span>
      <span className="button" onMouseDown={onAddImage} data-active="true">
          <span className="material-icons">image</span>
      </span>
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

export { SeafileEditor };
