import { hasChanged, isObject } from '../shared'
import { isTracking, trackEffect, triggerEffect } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  private _rawValue: any
  public dep
  public __v_isRef = true
  constructor (value) {
    this._rawValue = value
    this._value = convert(value)
    // 是对象->reactive
    // 1. 看看value是否是对象

    this.dep = new Set()
  }
  get value () {
    trackRefValue(this)
    return this._value
  }

  set value (newValue) {
    // 一定先去修改值，再进行trigger
    // 如果是对象，应该是普通对象对比
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffect(this.dep)
    }
  }
}

function convert (value) {
  return isObject(value) ? reactive(value) : value
}

function trackRefValue (ref) {
  if (isTracking()) {
    trackEffect(ref.dep)
  }
}

export function ref (value) {
  return new RefImpl(value)
}

export function isRef (ref) {
  return !!ref.__v_isRef
}

export function unRef (ref) {
  // 看看是不是ref对象
  // 是ref对象 -> .value
  return isRef(ref) ? ref.value : ref
}
