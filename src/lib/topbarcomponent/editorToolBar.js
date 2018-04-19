import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

class DropDownBox extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      dropdownOpen:false
    }
  }

  toggle= ()=> {
    this.setState({
      dropdownOpen:!this.state.dropdownOpen
    });
  }

  render() {
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle>
          Set align
        </DropdownToggle>
        <DropdownMenu className={'drop-list'}>
          <DropdownItem onMouseDown={e => this.props.onSetAlign(e, 'left')}>Left</DropdownItem>
          <DropdownItem onMouseDown={e => this.props.onSetAlign(e, 'center')}>Center</DropdownItem>
          <DropdownItem onMouseDown={e => this.props.onSetAlign(e, 'right')}>Right</DropdownItem>
        </DropdownMenu>
      </Dropdown>
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

class Button extends React.Component {
  render() {
    return (
      <button type={"button"} onMouseDown={this.props.onMouseDown}
        className={"btn btn-icon btn-secondary btn-active"} data-active={ this.props.isActive ? this.props.isActive : false }>
        { this.props.children ? this.props.children :
          <i className={this.props.type}></i> }
      </button>
    )
  }
}

class MarkButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
        {this.props.renderMarkButton('BOLD', 'fa fa-bold')}
        {this.props.renderMarkButton('ITALIC', 'fa fa-italic')}
        {this.props.renderMarkButton('UNDERLINED', 'fa fa-underline')}
      </ButtonContainer>
    )
  }
}

class HeaderButton extends React.Component {
  render() {
    if (this.props.isShow.isTableActive) {
      return null
    }
    return (
      <ButtonContainer>
        {this.props.renderBlockButton('header_one', 'fa fa-h1')}
        {this.props.renderBlockButton('header_two', 'fa fa-h2')}
      </ButtonContainer>
    )
  }
}

class BlockButton extends React.Component {
  render() {
    if (this.props.isShow.isTableActive) {
      return null
    }
    return (
      <div className={"btn-group"} role={"group"}>
        {this.props.renderBlockButton('block-quote', 'fa fa-quote-left')}
        {this.props.renderBlockButton('ordered_list', 'fa fa-list-ol')}
        {this.props.renderBlockButton('unordered_list', 'fa fa-list-ul')}
      </div>
    )
  }
}

class CodeButton extends React.Component {
  render() {
    if (this.props.isShow.isTableActive) {
      return null
    }
    return (
      <ButtonContainer>
        <Button type={'fa fa-code'} onMouseDown={this.props.onToggleCode} isActive={this.props.isCodeActive}/>
      </ButtonContainer>
    )
  }
}

class ImageButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
        <Button type={'fa fa-image'} onMouseDown={this.props.onAddImage} isActive={this.props.isImageActive}/>
      </ButtonContainer>
    )
  }
}

class SaveButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
        <Button type={'fa fa-save'} onMouseDown={this.props.onSave} isActive={this.props.isActiveImage}/>
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
          <Button onMouseDown={this.props.onInsertColumn}>+</Button>
          <Button>{'Column'}</Button>
          <Button onMouseDown={this.props.onRemoveColumn}>-</Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button onMouseDown={this.props.onInsertRow}>+</Button>
          <Button>{'Row'}</Button>
          <Button onMouseDown={this.props.onRemoveRow}>-</Button>
        </ButtonContainer>
        <DropDownBox onSetAlign={this.props.onSetAlign}/>
      </div>
    )
  }
}

export { MarkButton, HeaderButton, BlockButton, CodeButton, ImageButton, SaveButton, TableToolBar, Button, ButtonContainer }
