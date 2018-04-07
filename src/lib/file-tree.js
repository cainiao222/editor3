import React from 'react';
import TreeView from '../tree-view/tree-view';

class FileTree extends React.Component {

  render() {
    return (
      <div className='treeContainer'>
        <TreeView
          tree={this.props.treeData}
        />
      </div>
    )
  }

}

export default FileTree;
