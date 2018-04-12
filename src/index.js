// Import React!
import React from 'react';
import ReactDOM from 'react-dom';
import { SeafileEditor } from './lib/seafile-editor';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import './index.css';

import { serverConfig } from './config'
import { SeafileAPI } from 'seafile-js';
import 'whatwg-fetch'

import Tree from './tree-view/tree';

import { Value } from 'slate';
const { State } = require('markup-it');
const markdown = require('markup-it/lib/markdown');
const repoID = serverConfig.repoID;
const filePath = "/test.md";
const fileName = "test.md";
const dirPath = "/"
const seafileAPI = new SeafileAPI(serverConfig.server, serverConfig.username, serverConfig.password);

// create initialValue
const state = State.create(markdown);
const slate_document = state.deserializeToDocument('Hello *World*  **WORLD** _FOLD_ `block`\n## header3');
const initialValue = Value.create({document: slate_document})

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

function getImageFileNameWithTimestamp() {
  var d = Date.now();
  return "image-" + d.toString() + ".png";
}

class App extends React.Component {

  state = {
    value: initialValue,
    treeData: new Tree(),
    isTreeDataLoaded: false,
  }

  componentDidMount() {
    seafileAPI.login().then((response) => {
      seafileAPI.getFileDownloadLink(repoID, filePath).then((response) => {
        const url = response.data;
        fetch(url).then(function(response) {
          return response.text();
        }).then((body) => {
          const state = State.create(markdown);
          const document = state.deserializeToDocument(body);
          const value = Value.create({document: document})
          this.setState({
            value: value,
          })
        })
      })

      seafileAPI.listDir(repoID, dirPath).then((response) => {
        // load the files and folder at the root of the library
        var children = response.data.map((item) => {
          return {
            name: item.name,
            type: item.type === 'dir' ? 'dir' : 'file',
            isExpanded: item.type === 'dir' ? true : false,
          }
        })
        // construct the tree object
        var treeObject = {
          name: '/',
          type: 'dir',
          isExpanded: true,
          children: children
        }
        // parse the tree object to internal representation
        var treeData = new Tree();
        treeData.parse(treeObject);

        this.setState({
          isTreeDataLoaded: true,
          treeData: treeData
        })

      })

    })

    // for testing
    /*
    var treeData = new Tree();
    var t = {
      name: "/",
      isExpanded: true,
      type: "dir",
      children: [
        {
          name: "test.md",
          type: "file"
        },
        {
          name: "images",
          type: "dir",
          isExpanded: true,
          children: [
            {
              name: "screenshot.png",
              type: "file"
            }
          ]
        }
      ]
    }
    treeData.parse(t);
    this.setState({
      isTreeDataLoaded: true,
      treeData: treeData
    })
    */
  }

  onChange = ({ value }) => {
    this.setState({ value });
  }

  onSave = (event) => {
    const { value } = this.state;
    const str = state.serializeDocument(value.document);
    seafileAPI.getUpdateLink(repoID, "/").then((response) => {
      updateFile(response.data, filePath, fileName, str)
    })
  }

  onTreeChange = (treeData) => {
    this.setState({ treeData })
  }

  uploadImage = (imageFile) => {
    return seafileAPI.getUploadLink(repoID, "/").then((response) => {
      const uploadLink = response.data + "?ret-json=1";
      // change image file name
      var name = getImageFileNameWithTimestamp();
      var blob = imageFile.slice(0, -1, 'image/png');
      var newFile = new File([blob], name, {type: 'image/png'});
      var formData = new FormData();
      formData.append("parent_dir", "/");
      formData.append("relative_path", "images");
      formData.append("file", newFile);
      // upload the image
      return fetch(uploadLink, {
        method: "POST",
        body: formData
      })
    }).then((response) => {
      return response.json();
    }).then((json) => {
      // The returned json is a list of uploaded files, need to get the first one
      var filename = json[0].name;
      return this.getImageURL(filename);
    });
  }

  getImageURL = (fileName) => {
    var url = serverConfig.server + "/lib/" + repoID + "/file/images/" + fileName + "?raw=1";
    console.log(url);
    return url;
  }

  render() {
    return (
      <div className="EditorDemo">
        <SeafileEditor
          value={this.state.value}
          onChange={this.onChange}
          onSave={this.onSave}
          treeData={this.state.treeData}
          isTreeDataLoaded={this.state.isTreeDataLoaded}
          onTreeChange={this.onTreeChange}
          uploadImage={this.uploadImage}
          getImageURL={this.getImageURL}
        />
      </div>
    )
  }

}

App = DragDropContext(HTML5Backend)(App)
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
