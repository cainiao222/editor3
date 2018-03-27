// Import React!
import React from 'react';
import ReactDOM from 'react-dom';
import { SeafileEditor } from './lib/seafile-editor';

import 'gitbook-markdown-css/css/gitbook-markdown.css';
import './index.css';

import { serverConfig } from './config'
import { SeafileAPI } from 'seafile-js';

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

 
class App extends React.Component {

  state = {
    value: initialValue,
    treeData: [ ],
    isTreeDataLoaded: false,
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

      seafileAPI.listDir(repoID, dirPath).then((response) => {
        console.log(response.data);
        var children = response.data.map((item) => {
          return {
            title: item.name
          }
        })
        var td = [ { title: '/', children: children }]
        this.setState({
          isTreeDataLoaded: true,
          treeData: td
        })
      })

    })
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onSave = (event) => {
    const { value } = this.state
    console.log(value)
    const str = state.serializeDocument(value.document)
    //console.log(str);
    seafileAPI.getUpdateLink(repoID, "/").then((response) => {
      updateFile(response.data, filePath, fileName, str)
    })
  }

  onTreeChange = (treeData) => {
    this.setState({ treeData })
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
        />
      </div>
    )
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
