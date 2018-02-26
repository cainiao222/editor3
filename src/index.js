// Import React!
import React from 'react';
import ReactDOM from 'react-dom';
import { SeafileEditor } from './seafile-editor';

import './index.css';
 
class App extends React.Component {

  render() {
    return (
      <SeafileEditor />
    )
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
