import React from 'react';
import { Editor } from 'slate-react';
import EditCode from 'slate-edit-code'
import EditTable from 'slate-edit-table'
import EditList from 'slate-edit-list'
import InsertImages from 'slate-drop-or-paste-images'
//import { Tree } from './tree';
import FileTree from './file-tree';
import { Image } from './image';
import { Inline } from 'slate';
import AddImageDialog from './add-image-dialog';
import { IconButton, TableToolBar, Button, ButtonGroup } from "./topbarcomponent/editorToolBar";
const DEFAULT_NODE = 'paragraph';
const editCode = EditCode();
const editTable = EditTable();
const editList = EditList({
  types: ["ordered_list", "unordered_list"]
});
/*
  When an image is pasted or dropped, insertImage() will be called.
  insertImage creates an image node with `file` stored in `data`.
*/
const insertImages = InsertImages({
  extensions: ['png'],
  insertImage: (change, file, editor) => {
    var node = Inline.create({
      type: 'image',
      isVoid: true,
      data: {
        file: file
      }
    })
    // schedule image uploading
    editor.props.uploadImage(file).then((imageURL) => {
      // change the node property after image uploaded
      const change2 = editor.props.value.change();
      change2.setNodeByKey(node.key, {
        data: {
          src: imageURL
        }
      });
      editor.props.onChange(change2);
    })
    return change.insertInline(node);
  }
});

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
  editTable,
  editList,
  insertImages,
  MyPlugin(),
]


class SeafileEditor extends React.Component {

  state = {
      showAddImageDialog: false,
      isSelectedImage:false
  };

  componentDidMount() {

  }

  /**
  * Check if the current selection has a mark with `type` in it.
  *
  * @param {String} type
  * @return {Boolean}
  */
  hasMark = type => {
    const value = this.props.value
    return value.activeMarks.some(mark => mark.type === type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const value = this.props.value
    return value.blocks.some( node => node.type === type)
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
      change.wrapBlock('unordered_list')
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
    const value = this.props.value;
    const change = value.change().toggleMark(type)
    this.props.onChange(change)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */
  onClickBlock = (event, type) => {
    event.preventDefault()
    const value = this.props.value;
    const change = value.change()
    const { document } = value
    // Handle everything but list buttons.
    if (type !== 'ordered_list' && type !== 'unordered_list') {
      const isActive = this.hasBlock(type);
      change.setBlocks(isActive ? DEFAULT_NODE : type)
    } else {
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      });

      if (isType) {
        editList.changes.unwrapList(change);
      } else {
        editList.changes.wrapInList(editList.changes.unwrapList(change), type);
      }
    }

    this.props.onChange(change);
  }

  /**
   * Toggle inline code or code block
   *
   * @param {Event} event
   */
  onToggleCode = (event) => {
    event.preventDefault()
    const value = this.props.value
    const { selection } = value
    const change = value.change()
    if (selection.isCollapsed) {
      // if selection is collapsed
      editCode.changes.toggleCodeBlock(change)
    } else {
      change.toggleMark('CODE')
    }

    this.props.onChange(editCode.changes.toggleCodeBlock(change))
  }

  /**
   * Add table
   *
   * @param {Event} event
   */
  onAddTable(event) {
    event.preventDefault()
    const value = this.props.value
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
    this.props.onChange(change)
  }

  onInsertImage = (url) => {
    const change = this.props.value.change().insertInline({
      type: 'image',
      isVoid: true,
      data: { src: url },
    });
    this.props.onChange(change);
  }

  toggleImageDialog = () => {
    this.setState({
      showAddImageDialog: !this.state.showAddImageDialog
    });
  }

  /**
   * Add image
   *
   * @param {Event} event
   */
  onAddImage = (event) => {
    event.preventDefault()

    this.toggleImageDialog();

    /*
    const src = window.prompt('Enter the URL of the image:')
    if (!src) return

    const { value } = this.state
    const change = value.change().call(insertImage, src)

    this.props.onChange(change)
    */
  }

  /**
   * Save content
   *
   * @param {Event} event
   */
  onSave = (event) => {
    this.props.onSave(event)
  }
     
  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
    /*
       props contains  { attributes, children, node, isSelected, editor, parent, key }
    */
    const { attributes, children, node, isSelected } = props
    let textAlign;
    switch (node.type) {
      case 'paragraph':
        return <p {...attributes}>{children}</p>
      case 'blockquote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'header_one':
        return <h1 {...attributes}>{children}</h1>
      case 'header_two':
        return <h2 {...attributes}>{children}</h2>
      case 'header_three':
        return <h3 {...attributes}>{children}</h3>
      case 'header_four':
        return <h4 {...attributes}>{children}</h4>
      case 'header_five':
        return <h5 {...attributes}>{children}</h5>
      case 'header_six':
        return <h6 {...attributes}>{children}</h6>
      case 'list_item':
        return <li {...attributes}>{children}</li>
      case 'unordered_list':
        return <ul {...attributes}>{children}</ul>
      case 'ordered_list':
        return <ol {...attributes}>{children}</ol>
      case 'image':
        return <Image {...props}/>
      case 'code_block':
        return (
          <pre className="code" {...attributes}>
          {children}
          </pre>
        );
      case 'code_line':
        return <span>{children}</span>;
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
      case 'link':
        var href = node.get('data').get('href');
        console.log(node.get('data').get('href'));
        return (
          <a href={ href }>{children}</a>
        );
    }
  }

  renderMark = props => {
    const { children, mark, node } = props
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

  hasSelectImage (value) {
    /*
    * get image obj when selected,has not found a better way
    * */
    let imageObj=value.inlines.toJSON()[0];
    if(imageObj&&imageObj.type==='image') {
      return true
    }
    return false
  }

  render() {
    const  value  = this.props.value;
    const isTableActive = editTable.utils.isSelectionInTable(value);
    const isImageActive = this.hasSelectImage(value);
    const isCodeActive = editCode.utils.isInCodeBlock(value);
    return (
      <div className='seafile-editor'>
        <div className="seafile-editor-topbar">
          <div className="title"><img src={ require('../assets/seafile-logo.png') } alt=""/></div>
            {this.renderToolbar(isTableActive, isImageActive, isCodeActive)}
        </div>
        <div className="seafile-editor-main row">
            <div className="seafile-editor-left-panel col-3">
              <FileTree
                treeData={this.props.treeData}
                isLoaded={this.props.isTreeDataLoaded}
                onChange={this.props.onTreeChange}
              />
            </div>
            <div className="seafile-editor-right-panel col-9">
              <div className="editor-container">
              <div className="editor article">
                <Editor
                    value={this.props.value}
                    plugins={plugins}
                    onChange={this.props.onChange}
                    onKeyDown={this.onKeyDown}
                    renderNode={this.renderNode}
                    renderMark={this.renderMark}
                    onDrop={this.onDrop}
                    uploadImage={this.props.uploadImage}
                    getImageURL={this.props.getImageURL}
                />
              </div>
              </div>
          </div>
        </div>
      </div>
    )
  }

  renderToolbar = (isTableActive, isImageActive, isCodeActive) => {
    return (
      <div className="menu toolbar-menu">
        <ButtonGroup>
          {this.renderMarkButton("BOLD", "fa fa-bold")}
          {this.renderMarkButton('ITALIC', 'fa fa-italic')}
          {this.renderMarkButton('UNDERLINED', 'fa fa-underline')}
        </ButtonGroup>
        { isTableActive === false &&
          <ButtonGroup>
            {this.renderBlockButton('header_one', 'fa fa-h1')}
            {this.renderBlockButton('header_two', 'fa fa-h2')}
          </ButtonGroup>
        }
        { isTableActive === false &&
          <div className={"btn-group"} role={"group"}>
            {this.renderBlockButton('block-quote', 'fa fa-quote-left')}
            {this.renderBlockButton('ordered_list', 'fa fa-list-ol')}
            {this.renderBlockButton('unordered_list', 'fa fa-list-ul')}
          </div>
        }
        { isTableActive === false &&
          <IconButton icon="fa fa-code" onMouseDown={this.onToggleCode} isActive={isCodeActive}/>
        }
        {isTableActive ? this.renderTableToolbar() : this.renderAddTableButton()}
        <IconButton icon="fa fa-image" onMouseDown={this.onAddImage} isActive={isImageActive}/>
        <IconButton icon="fa fa-save" onMouseDown={this.onSave} />
        <AddImageDialog
          showAddImageDialog={this.state.showAddImageDialog}
          toggleImageDialog={this.toggleImageDialog}
          onInsertImage={this.onInsertImage}
        />
      </div>
    )
  }

  renderAddTableButton = () => {
    const onAddTable = event => this.onAddTable(event);
    return(
      <ButtonGroup>
        <IconButton icon={'fa fa-table'} onMouseDown={onAddTable}/>
      </ButtonGroup>
    )
  };

  renderTableToolbar = () => {
    return (
      <TableToolBar
        onRemoveTable={this.onRemoveTable}
        onInsertColumn={this.onInsertColumn}
        onRemoveColumn={this.onRemoveColumn}
        onInsertRow={this.onInsertRow}
        onRemoveRow={this.onRemoveRow}
        onSetAlign={this.onSetAlign}
      />
    )
  }

  onInsertColumn = event => {
    event.preventDefault();
    this.props.onChange(editTable.changes.insertColumn(this.props.value.change()))
  };

  onInsertRow = event => {
    event.preventDefault();
    this.props.onChange(editTable.changes.insertRow(this.props.value.change()));
  };

  onRemoveColumn = event => {
    event.preventDefault();
    this.props.onChange(editTable.changes.removeColumn(this.props.value.change()));
  };

  onRemoveRow = event => {
    event.preventDefault();
    this.props.onChange( editTable.changes.removeRow(this.props.value.change()));
  };

  onRemoveTable = event => {
    event.preventDefault();
    this.props.onChange( editTable.changes.removeTable(this.props.value.change()));
  };

  onSetAlign = (event, align) => {
    event.preventDefault();
    this.props.onChange(editTable.changes.setColumnAlign(this.props.value.change(),align));
  };

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);
    const onMouseDown = event => this.onClickMark(event, type);
    return (
      // eslint-disable-next-line react/jsx-no-bind
      <IconButton onMouseDown={onMouseDown} isActive={isActive} icon={icon}></IconButton>
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
    let isActive = this.hasBlock(type);
    const Block = editList.utils.getCurrentList(this.props.value);
    isActive = Block ? Block.type === type : isActive;
    const onMouseDown = event => this.onClickBlock(event, type);
    return (
      // eslint-disable-next-line react/jsx-no-bind
      <IconButton onMouseDown={onMouseDown} isActive={isActive} icon={icon}></IconButton>
    )
  }

}

export { SeafileEditor };
