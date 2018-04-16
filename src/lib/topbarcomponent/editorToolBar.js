import React from 'react'

class DropDownBox extends React.Component {
  render() {
    return (
      <div className={"dropdown"}>
        <button type={"button"} className={"btn btn-secondary dropdown-toggle"} data-toggle={"dropdown"}>Set align</button>
        <div className={'dropdown-menu'}>
          <a className={"dropdown-item"} onMouseDown={e => this.props.onSetAlign(e, 'left')}>Left</a>
          <a className={"dropdown-item"} onMouseDown={e => this.props.onSetAlign(e, 'center')}>Center</a>
          <a className={"dropdown-item"} onMouseDown={e => this.props.onSetAlign(e, 'right')}>Right</a>
        </div>
      </div>
    )
  }
}

class ButtonContainer extends React.Component {
  render() {
    return (
      <div className={"btn-group"} role={"group"}>
        {this.props.children}
      </div>
    )
  }
}

class Button extends React.Component{
  render() {
    return (
      <button type={"button"} onMouseDown={this.props.onMouseDown} className={"btn btn-secondary btn-active"} data-active={this.props.isActive? this.props.isActive: false}>
        {this.props.children? this.props.children : <i className={this.props.type}></i>}
      </button>
    )
  }
}

class MarkButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
        {this.props.renderMarkButton('BOLD', 'fe fe-bold')}
        {this.props.renderMarkButton('ITALIC', 'fe fe-italic')}
        {this.props.renderMarkButton('UNDERLINED', 'fe fe-underline')}
      </ButtonContainer>
    )
  }
}

class HeaderButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
        {this.props.renderBlockButton('header_one', 'fe fe-airplay')}
        {this.props.renderBlockButton('header_two', 'fe fe-alert-circle')}
      </ButtonContainer>
    )
  }
}

class BlockButton extends React.Component {
  render() {
    return (
      <div className={"btn-group"} role={"group"}>
        {this.props.renderBlockButton('block-quote', 'fe fe-box')}
        {this.props.renderBlockButton('ol_list', 'fe fe-list')}
        {this.props.renderBlockButton('ul_list', 'fe fe-menu')}
      </div>
    )
  }
}

class CodeButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
        <Button type={'fe fe-code'} onMouseDown={this.props.onToggleCode} isActive={this.props.isCodeActive}></Button>
      </ButtonContainer>
    )
  }
}

class ImageButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
        <Button type={'fe fe-image'} onMouseDown={this.props.onAddImage} isActive={this.props.isImageActive}></Button>
      </ButtonContainer>
    )
  }
}

class SaveButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
        <Button type={'fe fe-save'} onMouseDown={this.props.onSave} isActive={this.props.isImageActive}></Button>
      </ButtonContainer>
    )
  }
}

class TableToolBar extends React.Component {
  render() {
    return (
      <div className={'tableToolBar'}>
        <ButtonContainer>
          <Button onMouseDown={this.props.onRemoveTable}>{'Remove table'}</Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button type={'fe fe-plus'} onMouseDown={this.props.onInsertColumn}></Button>
          <Button>{'Column'}</Button>
          <Button type={'fe fe-minus'} onMouseDown={this.props.onRemoveColumn}></Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button type={'fe fe-plus'} onMouseDown={this.props.onInsertRow}></Button>
          <Button>{'Row'}</Button>
          <Button type={'fe fe-minus'} onMouseDown={this.props.onRemoveRow}></Button>
        </ButtonContainer>
        <DropDownBox onSetAlign={this.props.onSetAlign}/>
      </div>
    )
  }
}

export { MarkButton, HeaderButton, BlockButton, CodeButton, ImageButton, SaveButton, TableToolBar, Button }