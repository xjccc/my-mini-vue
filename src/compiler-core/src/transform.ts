export function transform (root, options) {
  const context = createTransformContext(root, options)
  // 1. 深度优先搜索
  tranverseNode(root, context)
  // 2. 修改text的content
}

function tranverseNode(node: any, context) {
  const nodeTransforms = context.nodeTransforms
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform(node)
  }
  tranversChildren(node, context);
}
function tranversChildren(node, context) {
  const children = node.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      tranverseNode(node, context);
    }
  }
}
function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || []
  }
  return context
}
