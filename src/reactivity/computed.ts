import { ReactiveEffect } from './effect'

class ComputedImpl {
  private _getter: any
  private _dirty: boolean = true
  private _value: any
  private _effect: ReactiveEffect
  constructor (getter) {
    this._getter = getter

    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
      }
    })
  }
  get value () {
    // get value -> dirty true
    // 当依赖响应式值发生改变
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed (getter) {
  return new ComputedImpl(getter)
}
