import { render } from "./renderer"
import { createVNode } from "./vnode"

export function createApp (rootComponent) {
  return {
    mount (rootContainer) {
      // 先转换为vnode
      // 所有操作都会基于虚拟节点
      // component -> vnode
      const vnode = createVNode(rootComponent)
      render(vnode, rootContainer)
    }
  }
}

