// Import React!
import React from 'react';
import ReactDOM from 'react-dom';
import { SeafileCommentEditor } from './seafile-comment-editor';

import 'gitbook-markdown-css/css/gitbook-markdown.css';
import './index.css';

 
class App extends React.Component {

  render() {
    return (
      <div className="EditorDemo">
        <SeafileCommentEditor />
      </div>
    )
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
