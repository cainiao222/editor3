import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';


class Tree extends Component {

  componentDidMount() {
  }

  onChange(treeData) {
    this.props.onChange(treeData)
  }

  render() {
    return (
      <div style={{ height: 400 }}>
        <SortableTree
          treeData={this.props.treeData}
          onChange={treeData => this.onChange(treeData)}
          theme={FileExplorerTheme}
        />
      </div>
    );
  }
}

export { Tree }
