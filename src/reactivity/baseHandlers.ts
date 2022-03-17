import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'

const get = createGet()
const set = createSet()

const readonlyGet = createGet(true)

function createGet (isReadonly: boolean = false) {
  return function get (target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)
    if (!isReadonly) {
      // TODO 依赖收集
      track(target, key)
    }
    return res
  }
}

function createSet () {
  return function set (target, key, value) {
    const res = Reflect.set(target, key, value)
    // TODO 触发依赖
    trigger(target, key)
    return res
  }
}
export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: (target, key, value) => {
    console.warn(`key: ${key}, 只读属性，${target}不能被修改`)
    return true
  }
}
