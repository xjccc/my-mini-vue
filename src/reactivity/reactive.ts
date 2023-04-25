import { track, trigger } from "./effect"

export function reactive (raw) {
  return new Proxy(raw, {
    get(target, key) {
      // target {foo: 1}
      // key : foo
      const res = Reflect.get(target, key)
      track(target, key)

      return res
    },
    set (target, key, value) {
      const res = Reflect.set(target, key, value)
      trigger(target, key)
      return res
    }
  })
}