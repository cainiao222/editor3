import { Node } from './node'

class Tree {

  constructor() {
    this.root = null;
  }

  copy() {
    var t = new Tree();
    if (this.root)
      t.root = this.root.copy();
    return t;
  }

  setRoot(dir) {
    this.root = dir;
  }

  addChildToNode(node, child) {
    child.parent = node;
    node.children.push(child);
    return child;
  }

  addChild(node, child, insertIndex) {
    if (!(child instanceof Node)) {
      throw new TypeError('Child must be of type Node.');
    }
    if (insertIndex < 0 || insertIndex > node.children.length) {
      throw new Error('Invalid index.');
    }

    child.parent = node;
    node.children.splice(insertIndex, 0, child);
  }


  /*
  * parse tree from javascript object
  */
  parse(model) {
    var node = new Node({
      name: model.name,
      type: model.type,
      isExpanded: model.isExpanded
    });
    this.root = node;
    for (let child of model.children) {
      this.addChildToNode(node, this.parseNode(child));
    }
  }

  parseNode(model) {
    var node = new Node({
      name: model.name,
      type: model.type,
      isExpanded: model.isExpanded
    });
    if (model.children instanceof Array) {
      for (let child of model.children) {
        this.addChildToNode(node, this.parseNode(child));
      }
    }
    return node;
  }


}

export default Tree;
