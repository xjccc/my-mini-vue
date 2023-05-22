import { Fragment, createVNode } from "../vnode";

export function renderSlots (slots, name, props) {
  // 创建虚拟节点
  const slot = slots[name]
  if (slot) {
    if (typeof slot === 'function') {
      // children 不可以有数组的
      // 只需要把children渲染，不需要渲染单独的div
      return createVNode(Fragment, {}, slot(props))
    }
  }
}