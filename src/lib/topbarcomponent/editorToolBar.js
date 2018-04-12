import React from 'react'

import '../../css/dropbox.css'

class DropDownBox extends React.Component {
    state = {
      isShowAlignOption:false
    }

    listToggle1 = () => {
      var a= this.state.isShowAlignOption;
        this.setState ({
          isShowAlignOption:!a
        });
    };

    isShowList() {
      if(this.state.isShowAlignOption) {
        return(
          <div id='align-option' className={'align-option-container'}>
            <ul>
              <li onMouseDown={e => this.props.onSetAlign(e, 'left')}>Left</li>
                <li onMouseDown={e => this.props.onSetAlign(e, 'center')}>Center</li>
                <li onMouseDown={e => this.props.onSetAlign(e, 'right')}>Right</li>
            </ul>
          </div>
        )
      }
    }

    render() {
      return (
        <div className={'dropContainer'}>
          <button onClick={this.listToggle1} className={'dropHead'}><span>Set align</span><span className={'triangle'}></span></button>
          {this.isShowList()}
        </div>
      )
    }
}

class MarkButton extends React.Component {
  render() {
    return (
      <div className={'markButton'}>
        {this.props.renderMarkButton('BOLD', 'format_bold')}
        {this.props.renderMarkButton('ITALIC', 'format_italic')}
        {this.props.renderMarkButton('UNDERLINED', 'format_underlined')}
      </div>
    )
  }
}

class HeaderButton extends React.Component {

  render() {
    return (
      <div className={'headButton'}>
        {this.props.renderBlockButton('header_one', 'looks_one')}
        {this.props.renderBlockButton('header_two', 'looks_two')}
      </div>
    )
  }
}

class BlockButton extends React.Component {
  render() {
    return(
      <div className={'blockButton'}>
        {this.props.renderBlockButton('block-quote', 'format_quote')}
        {this.props.renderBlockButton('ol_list', 'format_list_numbered')}
        {this.props.renderBlockButton('ul_list', 'format_list_bulleted')}
      </div>
    )
  }
}

class CodeButton extends React.Component {
  render() {
    return(
      <div className={'CodeButton'}>
        <button className="button" onMouseDown={this.props.onToggleCode} data-active="true">
          <span className="material-icons">code</span>
        </button>
      </div>
    )
  }
}

class ImageButton extends React.Component {
  render() {
    return (
      <div className={'ImageButton'}>
        <button className="button" onMouseDown={this.props.onAddImage} data-active="true">
          <span className="material-icons">image</span>
        </button>
      </div>
    )
  }
}

class SaveButton extends React.Component {
  render(){
    return (
      <div className={'SaveButton'}>
        <button className="button" onMouseDown={this.props.onSave} data-active="true">
          <span className="material-icons">save</span>
        </button>
      </div>
    )
  }
}

class TableToolBar extends React.Component {
  render(){
    return (
      <div className={'tableToolBar'}>
        <div className={'removeTable'}><button onMouseDown={this.props.onRemoveTable}>Remove table</button></div>
          <div className={'setMargin columnContainer'}>
            <button className={'symbol'} onMouseDown={this.props.onInsertColumn}>+</button>
            <button>Column</button>
            <button className={'symbol'}  onMouseDown={this.props.onRemoveColumn}>-</button>
          </div>
          <div className={'setMargin rowContainer'}>
            <button className={'symbol'}  onMouseDown={this.props.onInsertRow}>+</button>
            <button>Row</button>
            <button className={'symbol'}  onMouseDown={this.props.onRemoveRow}>-</button>
          </div>
          <DropDownBox onSetAlign={this.props.onSetAlign}/>
      </div>
    )
  }
}

export { MarkButton,HeaderButton,BlockButton,CodeButton,ImageButton,SaveButton,TableToolBar }