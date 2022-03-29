import { extend, isObject } from '../shared'
import { track, trigger } from './effect'
import { reactive, ReactiveFlags, readonly } from './reactive'

const get = createGet()
const set = createSet()

const readonlyGet = createGet(true)
const shallowReadonlyGet = createGet(true, true)

function createGet (isReadonly: boolean = false, shallow = false) {
  return function get (target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)
    // 如果是shallow状态，直接返回
    if (shallow) {
      return res
    }
    // 看看res是不是object

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

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

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})
