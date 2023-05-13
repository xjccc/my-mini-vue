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
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    // 组件就应该处理组件类型
    processComponent(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  // 初始化
  mountElement(vnode, container)
  // 更新
}

function mountElement (vnode, container) {
  const el = (vnode.el = document.createElement(vnode.type))
  // string \ array 类型的vnode.children
  const { props, children } = vnode
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el)
  }
  // props -> attribute
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
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
  const {proxy} = instance
  const subTree = instance.render.call(proxy)
  // vnode -> patch
  // vnode -> element -> mountElement

  patch(subTree, container)

  // 所有element mounted 之后，进行el
  initialVNode.el = subTree.el
}


