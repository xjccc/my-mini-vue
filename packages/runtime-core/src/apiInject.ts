import { getCurrentInstance } from "./component";

export function provide (key, value) {
  // 存？
  // key value
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    let {provides} = currentInstance
    // 使用后，需要改写原型指向，向上查找原型链
    const parentProvides = currentInstance.parent.provides
    // 每次都是init
    // 初始化执行 只一次
    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    provides[key] = value
  }

}

export function inject(key, defaultValue) {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    const {parent} = currentInstance
    const parentProvides = parent.provides
    if (key in parentProvides) {
      return parentProvides[key]
    } else if (defaultValue) {
      if (typeof defaultValue === 'function') {
        return defaultValue()
      }
      return defaultValue
    }
  }
}