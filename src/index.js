// Import React!
import React from 'react';
import ReactDOM from 'react-dom';
import { SeafileEditor } from './seafile-editor';

import 'gitbook-markdown-css/css/gitbook-markdown.css';
import './index.css';

 
class App extends React.Component {

  render() {
    return (
      <div>
        <SeafileEditor />
      </div>
    )
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
