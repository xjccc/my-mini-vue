import { hasChanged, isObject } from "../shared"
import { isTracking, track, trackEffect, triggerEffects } from "./effect"
import { reactive } from "./reactive"

class RefImpl {
  _value:any
  _rawValue
  public dep
  constructor(value){
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }
  get value(){
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

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

function trackRefValue(ref){
  if (isTracking()) {
    trackEffect(ref.dep)
  }
}

export function ref (value) {
  return new RefImpl(value)
}