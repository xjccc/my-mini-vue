import { ShapeFlags } from "@guide-mini-vue/shared"

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export {
  createVNode as createElementVNode
}

export function createVNode (type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    component: null,
    key: props && props.key,
    shapeFlag: getShapeFlag(type),
    el: null
  }
  // children
  if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }
  

  // slots children 组件 + children object
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === 'object') {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }

  return vnode
}

export function createTextVNode (text) {
  return createVNode(Text, {}, text)
}

function getShapeFlag (type) {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}
