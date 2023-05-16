import { ShapeFlags } from '../shared/ShapeFlags'
import { isObject } from '../shared/index'
import { createComponentInstance, setupComponent } from './component'

export function render (vnode, container) {
  // 调用patch方法
  patch(vnode, container)
}

function patch (vnode, container) {
  // 处理组件
  // 判断是不是element类型
  // 是element应该处理element
  // 如何区分是element、还是component？
  // ShapeFlags
  // vnode -> flag
  const { shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container)
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    // 组件就应该处理组件类型
    processComponent(vnode, container)
  }
}

function processElement (vnode: any, container: any) {
  // 初始化
  mountElement(vnode, container)
  // 更新
}

function mountElement (vnode, container) {
  const el = (vnode.el = document.createElement(vnode.type))
  // string \ array 类型的vnode.children
  const { children, shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  } else if (shapeFlag & ShapeFlags.ELEMENT) {
    el.textContent = children
  }
  // props -> attribute
  const { props } = vnode
  for (const key in props) {
    const val = props[key]
    // 具体click逻辑 -> 通用
    // on + event name
    const isOn = (key: string) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }
  container.append(el)
}

function mountChildren (vnode, container) {
  vnode.children.forEach(v => patch(v, container))
}

function processComponent (vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent (initialVNode, container) {
  const instance = createComponentInstance(initialVNode)
  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect (instance: any, initialVNode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  // vnode -> patch
  // vnode -> element -> mountElement

  patch(subTree, container)

  // 所有element mounted 之后，进行el
  initialVNode.el = subTree.el
}
