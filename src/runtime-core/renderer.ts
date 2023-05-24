import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { createAppApi } from './createApp'
import { Fragment, Text } from './vnode'

export function createRenderer (options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert
  } = options
  function render (vnode, container) {
    // 调用patch方法
    patch(vnode, container, null)
  }

  function patch (vnode, container, parentComponent) {
    // 处理组件
    // 判断是不是element类型
    // 是element应该处理element
    // 如何区分是element、还是component？
    // ShapeFlags
    // vnode -> flag
    const { type, shapeFlag } = vnode

    // Fragment -> 只渲染children
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break
      case Text:
        processText(vnode, container)
        break

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 组件就应该处理组件类型
          processComponent(vnode, container, parentComponent)
        }
    }
  }

  function processFragment (vnode, container, parentComponent) {
    mountChildren(vnode, container, parentComponent)
  }

  function processText (vnode, container) {
    const { children } = vnode
    const textNode = (vnode.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processElement (vnode: any, container: any, parentComponent) {
    // 初始化
    mountElement(vnode, container, parentComponent)
    // 更新
  }

  function mountElement (vnode, container, parentComponent) {
    // canvase
    // new Element()
    const el = (vnode.el = createElement(vnode.type))
    // string \ array 类型的vnode.children
    const { children, shapeFlag } = vnode
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }
    // props -> attribute
    const { props } = vnode
    for (const key in props) {
      const val = props[key]
      // 具体click逻辑 -> 通用
      // on + event name
      // const isOn = (key: string) => /^on[A-Z]/.test(key)
      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase()
      //   el.addEventListener(event, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
      patchProp(el, key, val)
    }
    // canvas
    // el.x = 10

    // container.append(el)
    // canvas -> addChild
    insert(el, container)
  }

  function mountChildren (vnode, container, parentComponent) {
    vnode.children.forEach(v => patch(v, container, parentComponent))
  }

  function processComponent (vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent)
  }

  function mountComponent (initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect (instance: any, initialVNode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)
    // vnode -> patch
    // vnode -> element -> mountElement

    patch(subTree, container, instance)

    // 所有element mounted 之后，进行el
    initialVNode.el = subTree.el
  }

  return {
    createApp: createAppApi(render)
  }
}
