import React, { Component } from 'react';
// import SortableTree from 'react-sortable-tree';
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';

class Tree extends Component {

  componentDidMount() {
  }

  onChange(treeData) {
    this.props.onChange(treeData)
  }

  render() {
    return (
      <div className='treeContainer'>
        <SortableTree
          treeData={this.props.treeData}
          onChange={treeData => this.onChange(treeData)}
          theme={FileExplorerTheme}
          generateNodeProps={rowInfo => ({
              icons: rowInfo.node.isDirectory
                ? [
                    <div
                      style={{
                        borderLeft: 'solid 8px gray',
                        borderBottom: 'solid 10px gray',
                        marginRight: 10,
                        width: 16,
                        height: 12,
                        filter: rowInfo.node.expanded
                          ? 'drop-shadow(1px 0 0 gray) drop-shadow(0 1px 0 gray) drop-shadow(0 -1px 0 gray) drop-shadow(-1px 0 0 gray)'
                          : 'none',
                        borderColor: rowInfo.node.expanded ? 'white' : 'gray',
                      }}
                    />,
                  ]
                : [
                    <div
                      style={{
                        border: 'solid 1px black',
                        fontSize: 8,
                        textAlign: 'center',
                        marginRight: 10,
                        width: 12,
                        height: 16,
                      }}
                    >
                      F
                    </div>,
                  ],
            })}
        />
      </div>
    );
  }
}

export { Tree }
