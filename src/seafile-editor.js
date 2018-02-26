import React from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.',
              },
            ],
          },
        ],
      },
    ],
  },
})


// Define a React component renderer for our code blocks.
function CodeNode(props) {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

class SeafileEditor extends React.Component {

    state = {
      value: initialValue,
    }
     
    onChange = ({ value }) => {
      this.setState({ value })
    }
     
    onKeyDown = (event, change) => {
      if (event.key != '`' || !event.ctrlKey) return
     
      event.preventDefault()
     
      // Determine whether any of the currently selected blocks are code blocks.
      const isCode = change.value.blocks.some(block => block.type == 'code')
     
      // Toggle the block type depending on `isCode`.
      change.setBlocks(isCode ? 'paragraph' : 'code')
      return true
    }

    // Add a `renderNode` method to render a `CodeNode` for code blocks.
    renderNode = props => {
        switch (props.node.type) {
            case 'code':
            return <CodeNode {...props} />
        }
    }

    render() {
        return (
            <Editor
                value={this.state.value}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                renderNode={this.renderNode}
            />
        )
    }

    renderToolbar = () => {
      return (
      <div className="menu toolbar-menu">
        {this.renderMarkButton('bold', 'format_bold')}
        {this.renderMarkButton('italic', 'format_italic')}
        {this.renderMarkButton('underlined', 'format_underlined')}
        {this.renderMarkButton('code', 'code')}
        {this.renderBlockButton('heading-one', 'looks_one')}
        {this.renderBlockButton('heading-two', 'looks_two')}
        {this.renderBlockButton('block-quote', 'format_quote')}
        {this.renderBlockButton('numbered-list', 'format_list_numbered')}
        {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
      </div>
      )
    }


  renderMarkButton = (type, icon) => {
    return (
      // eslint-disable-next-line react/jsx-no-bind
      <span className="button">
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

    return (
      // eslint-disable-next-line react/jsx-no-bind
      <span className="button">
        <span className="material-icons">{icon}</span>
      </span>
    )
    }
};

export { SeafileEditor };
