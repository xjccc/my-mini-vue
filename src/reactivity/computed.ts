import { ReactiveEffect } from "./effect"

class ComputedRefImpl {
  public _getter
  public _dirty = true
  public _value
  _effect: any
  constructor (getter) {
    this._getter = getter
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
      }
    })
  }
  get value () {
    // 当依赖的响应式对象的值变化的时候。dirty应该是true
    // effect收集
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed (getter) {
  return new ComputedRefImpl(getter)
}
