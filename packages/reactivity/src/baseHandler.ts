import { extend, isObject } from "@guide-mini-vue/shared"
import { track, trigger } from "./effect"
import { ReactiveFlags, reactive, readonly } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)


function createGetter (isReadonly = false, shallow = false) {
  return function get (target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key)

    if (shallow) {
      return res 
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    if (!isReadonly) {
      track(target, key)
    }

    return res
  }
}

function createSetter () {
  return function set (target, key, value) {
    const res = Reflect.set(target, key, value)
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
    console.warn(`target: ${target}, key: ${key}, value: ${value} is readonly`)
    return true
  }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})