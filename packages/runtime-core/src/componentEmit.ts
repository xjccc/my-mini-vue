import { camelize, toHandlerKey } from "@guide-mini-vue/shared";

export function emit (instance, event, ...args) {
  console.log('emit function', event);
  // instance.props -> emit event
  const {props} = instance

  // TPP ?
  // 先去写一个特定行为 -> 重构成通用行为
  // 传入add -> Add
  // add-foo -> addFoo

  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName]
  handler && handler(...args)
}