import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transform(root, options = {}) {
  const context = createTransformContext(root, options)
  // 1. 深度优先搜索
  tranverseNode(root, context)
  // root.codegenNode
  createRootCodegen(root)

  root.helpers = [...context.helpers.keys()]
}

function tranverseNode(node: any, context) {
  const nodeTransforms = context.nodeTransforms
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform(node)
  }

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING)
      break;
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      tranversChildren(node, context);
      break

    default:
      break;
  }

}
function tranversChildren(node, context) {
  const children = node.children;
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    tranverseNode(node, context);
  }
}
function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(key) {
      context.helpers.set(key, 1)
    }
  }
  return context
}
function createRootCodegen(root: any) {
  root.codegenNode = root.children[0]
}

