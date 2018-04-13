import React from 'react';
import TreeNodeView from './tree-node-view';

class TreeView extends React.Component {

  static defaultProps = {
    paddingLeft: 20
  };


  constructor(props) {
    super(props);
    this.state = this.init(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.init(nextProps));
  }

  init = (props) => {
    const tree = this.props.tree.copy();

    return {
      tree: tree,
      dragging: {
        id: null,
        x: null,
        y: null,
        w: null,
        h: null
      }
    };
  }


  render() {
    const tree = this.state.tree;
    if (!tree.root) {
      return <div>Empty</div>
    }

    return (
      <div className="tree-view tree">
        <TreeNodeView
          tree={tree}
          node={tree.root}
          paddingLeft={20}
          onCollapse={this.toggleCollapse}
        />
      </div>
    );
  }

  change = (tree) => {
    /*
    this._updated = true;
    if (this.props.onChange) this.props.onChange(tree.obj);
    */
  }

  toggleCollapse = (node) => {
    const tree = this.state.tree;
    node.isExpanded = !node.isExpanded;

    this.setState({
      tree: tree
    });

    this.change(tree);
  }

}

export default TreeView;
