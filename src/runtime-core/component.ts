import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { PublicInstanceProxyHandler } from './componentPublicInstance'

export function createComponentInstance (vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: (event) => {}
  }
  component.emit = emit.bind(null, component)
  return component
}

export function setupComponent (instance) {
  // TODO
  initProps(instance, instance.vnode.props)
  // initSlots
  setupStatefulComponent(instance)
}

function setupStatefulComponent (instance: any) {
  const Component = instance.type

  // ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandler)

  const { setup } = Component
  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })
    handleSetupResult(instance, setupResult)
  }
}
function handleSetupResult (instance, setupResult: any) {
  // function Object
  // TODO function
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}

function finishComponentSetup (instance: any) {
  const Component = instance.type
  if (Component.render) {}
  instance.render = Component.render
}
