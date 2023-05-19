import { createVNode } from "../vnode";

export function renderSlots (slots, name, props) {
  // 创建虚拟节点
  const slot = slots[name]
  if (slot) {
    if (typeof slot === 'function') {
      return createVNode('div', {}, slot(props))
    }
  }
}