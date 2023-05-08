import { hasChanged, isObject } from '../shared'
import { isTracking, trackEffect, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImpl {
  _value: any
  _rawValue
  public __v_isRef = true
  public dep
  constructor (value) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }
  get value () {
    trackRefValue(this)
    return this._value
  }
  set value (newValue) {
    // reactive对象，就会是proxy
    if (!hasChanged(newValue, this._rawValue)) return
    this._rawValue = newValue
    this._value = convert(newValue)

    triggerEffects(this.dep)
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
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key){
      // get -> age(ref) 那么就返回.value
      // 如果不是ref -> target
      return unRef(Reflect.get(target, key))
    },
    set(target, key, newValue){
      // set -> ref .value
      if (isRef(target[key]) && !isRef(newValue)) {
       return (target[key].value = newValue)
      } else {
        return Reflect.set(target, key, newValue)
      }
    }
  })
}