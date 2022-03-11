import { extend } from '../shared'

class ReactiveEffect {
  private _fn: any
  deps = []
  // 用户调用stop清空的状态，防止多次调用
  active = true
  onStop?: () => void
  constructor (fn, public scheduler?) {
    this._fn = fn
  }
  run () {
    activeEffect = this
    return this._fn()
  }
  stop () {
    if (this.active) {
      cleanupEffect(this)
      this.active = false
      if (this.onStop) {
        this.onStop()
      }
    }
  }
}

export function cleanupEffect (effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}

const targetMap = new Map()
export function track (target, key) {
  // set 存储
  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  if (!activeEffect) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger (target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

let activeEffect
export function effect (fn, options: any = {}) {
  // fn()
  const _effect = new ReactiveEffect(fn, options.scheduler)
  // options
  // Object.assign(_effect, options)
  // extends
  extend(_effect, options)
  _effect.run()
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop (runner: any) {
  runner.effect.stop()
}
