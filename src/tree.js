import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import { SeafileAPI } from 'seafile-js';
import { serverConfig } from './config'


const repoID = serverConfig.repoID;
const dirPath = "/"

const seafileAPI = new SeafileAPI(serverConfig.server, serverConfig.username, serverConfig.password);


class Tree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [ ],
      error: null,
      isLoaded: false,
    };
  }

  componentDidMount() {
    seafileAPI.login().then((response) => {
      seafileAPI.listDir(repoID, dirPath).then((response) => {
        console.log(response.data);
        var children = response.data.map((item) => {
          return {
            title: item.name
          }
        })
        var td = [ { title: '/', children: children }]
        this.setState({
          isLoaded: true,
          treeData: td
        })
      })
    })
  }

  render() {
    return (
      <div style={{ height: 400 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
          theme={FileExplorerTheme}
        />
      </div>
    );
  }
}

export { Tree };
