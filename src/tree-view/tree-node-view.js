import React from 'react';

class TreeNodeView extends React.Component {

  renderCollapse = () => {
    const { node } = this.props;

    if (node.hasChildren()) {
      const { isExpanded } = node;

      return (
        <span
          className={isExpanded ? 'collapse-node caret-down' : 'collapse-node caret-right'}
          onMouseDown={e => e.stopPropagation()}
          onClick={this.handleCollapse}
        />
      );
    }

    return null;
  }

  renderChildren = () => {
    const { node, tree } = this.props;

    if (node.children && node.children.length) {
      const childrenStyles = {
        paddingLeft: this.props.paddingLeft
      };

      /*
        the `key` property is needed. Otherwise there is a warning in the console
      */
      return (
        <div className="children" style={childrenStyles}>
          {node.children.map(child => {
            return (
              <TreeNodeView
                tree={tree}
                node={child}
                key={child.path()}
                paddingLeft={this.props.paddingLeft}
                onCollapse={this.props.onCollapse}
              />
            );
          })}
        </div>
      );
    }

    return null;
  }

  render() {
    const { node } = this.props;
    const styles = {};

    return (
      <div
        className="tree-node"
        style={styles}
      >
        <div className="tree-node-inner">
          {this.renderCollapse()}
          <span>{node.name}</span>
        </div>
        {node.isExpanded ? this.renderChildren() : null}
      </div>
    );
  }

  handleCollapse = e => {
    e.stopPropagation();
    const node = this.props.node;

    if (this.props.onCollapse) {
      this.props.onCollapse(node);
    }
  }

}

export default TreeNodeView;
