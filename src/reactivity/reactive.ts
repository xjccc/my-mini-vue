import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function reactive (raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly (raw) {
  return createActiveObject(raw, readonlyHandlers)
}

function createActiveObject (raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}

export function isReactive (value) {
  // 只要触发get证明是reactive的 -> baseHandlers
  // return value['is_reactive']
  // 如果不是reactive的，没有挂载ReactiveFlags.IS_REACTIVE
  // 所以返回的是undefined，!!转换为boolean就可以判断非
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly (value) {
  return !!value[ReactiveFlags.IS_READONLY]
}
