export * from './toDisplayString'
export * from './ShapeFlags'

export const extend = Object.assign

export const EMPTY_OBJECT = {}

export const isObject = val => {
  return val !== null && typeof val === 'object'
}

export const isString = val => typeof val === 'string'

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue)
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : ''
  })
}
export const toHandlerKey = (str: string) => {
  return str ? 'on' + capitalize(str) : ''
}