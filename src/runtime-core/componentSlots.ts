import { ShapeFlags } from "../shared/ShapeFlags"

export function initSlots (instance, children) {
  // slots
  const {vnode} = instance
  // 添加slots判断 崩了？
  // if (vnode.shapFlag & ShapeFlags.SLOT_CHILDREN) {
    nomalizeObjectSlots(children, instance.slots)
  // }
}
function nomalizeObjectSlots (children, slots) {
  for (const key in children) {
    const value = children[key]
    // slot
    slots[key] = (props) => nomalizeSlotValue(value(props))
  }
}

function nomalizeSlotValue (value) {
  return Array.isArray(value) ? value : [value]
}