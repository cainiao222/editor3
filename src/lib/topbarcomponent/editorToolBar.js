import React from 'react'
<<<<<<< HEAD
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
=======

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
>>>>>>> reimplement layout
    )
  }
}

<<<<<<< HEAD
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
        {this.props.children? this.props.children: <span className={"material-icons"}>{this.props.type}</span>}
=======
class Button extends React.Component{
  render() {
    return (
      <button type={"button"} onMouseDown={this.props.onMouseDown} className={"btn btn-secondary btn-active"} data-active={this.props.isActive? this.props.isActive: false}>
        {this.props.children? this.props.children : <i className={this.props.type}></i>}
>>>>>>> reimplement layout
      </button>
    )
  }
}

class MarkButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
<<<<<<< HEAD
        {this.props.renderMarkButton('BOLD', 'format_bold')}
        {this.props.renderMarkButton('ITALIC', 'format_italic')}
        {this.props.renderMarkButton('UNDERLINED', 'format_underlined')}
=======
        {this.props.renderMarkButton('BOLD', 'fe fe-bold')}
        {this.props.renderMarkButton('ITALIC', 'fe fe-italic')}
        {this.props.renderMarkButton('UNDERLINED', 'fe fe-underline')}
>>>>>>> reimplement layout
      </ButtonContainer>
    )
  }
}

class HeaderButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
<<<<<<< HEAD
        {this.props.renderBlockButton('header_one', 'looks_one')}
        {this.props.renderBlockButton('header_two', 'looks_two')}
=======
        {this.props.renderBlockButton('header_one', 'fe fe-airplay')}
        {this.props.renderBlockButton('header_two', 'fe fe-alert-circle')}
>>>>>>> reimplement layout
      </ButtonContainer>
    )
  }
}

class BlockButton extends React.Component {
  render() {
    return (
      <div className={"btn-group"} role={"group"}>
<<<<<<< HEAD
        {this.props.renderBlockButton('block-quote', 'format_quote')}
        {this.props.renderBlockButton('ol_list', 'format_list_numbered')}
        {this.props.renderBlockButton('ul_list', 'format_list_bulleted')}
=======
        {this.props.renderBlockButton('block-quote', 'fe fe-box')}
        {this.props.renderBlockButton('ol_list', 'fe fe-list')}
        {this.props.renderBlockButton('ul_list', 'fe fe-menu')}
>>>>>>> reimplement layout
      </div>
    )
  }
}

class CodeButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
<<<<<<< HEAD
        <Button type={'code'} onMouseDown={this.props.onToggleCode} isActive={this.props.isCodeActive}/>
=======
        <Button type={'fe fe-code'} onMouseDown={this.props.onToggleCode} isActive={this.props.isCodeActive}></Button>
>>>>>>> reimplement layout
      </ButtonContainer>
    )
  }
}

class ImageButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
<<<<<<< HEAD
        <Button type={'image'} onMouseDown={this.props.onAddImage} isActive={this.props.isImageActive}/>
=======
        <Button type={'fe fe-image'} onMouseDown={this.props.onAddImage} isActive={this.props.isImageActive}></Button>
>>>>>>> reimplement layout
      </ButtonContainer>
    )
  }
}

class SaveButton extends React.Component {
  render() {
    return (
      <ButtonContainer>
<<<<<<< HEAD
        <Button type={'save'} onMouseDown={this.props.onSave} isActive={this.props.isImageActive}/>
=======
        <Button type={'fe fe-save'} onMouseDown={this.props.onSave} isActive={this.props.isImageActive}></Button>
>>>>>>> reimplement layout
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
<<<<<<< HEAD
          <Button onMouseDown={this.props.onInsertColumn}>+</Button>
          <Button>{'Column'}</Button>
          <Button onMouseDown={this.props.onRemoveColumn}>-</Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button onMouseDown={this.props.onInsertRow}>+</Button>
          <Button>{'Row'}</Button>
          <Button onMouseDown={this.props.onRemoveRow}>-</Button>
=======
          <Button type={'fe fe-plus'} onMouseDown={this.props.onInsertColumn}></Button>
          <Button>{'Column'}</Button>
          <Button type={'fe fe-minus'} onMouseDown={this.props.onRemoveColumn}></Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button type={'fe fe-plus'} onMouseDown={this.props.onInsertRow}></Button>
          <Button>{'Row'}</Button>
          <Button type={'fe fe-minus'} onMouseDown={this.props.onRemoveRow}></Button>
>>>>>>> reimplement layout
        </ButtonContainer>
        <DropDownBox onSetAlign={this.props.onSetAlign}/>
      </div>
    )
  }
}

<<<<<<< HEAD
export { MarkButton, HeaderButton, BlockButton, CodeButton, ImageButton, SaveButton, TableToolBar, Button, ButtonContainer }
=======
export { MarkButton, HeaderButton, BlockButton, CodeButton, ImageButton, SaveButton, TableToolBar, Button }
>>>>>>> reimplement layout
