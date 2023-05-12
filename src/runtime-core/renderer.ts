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
  console.log(vnode.type)
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
  const el = document.createElement(vnode.type)
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

function mountComponent (vnode, container) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect (instance: any, container) {
  const subTree = instance.render()
  // vnode -> patch
  // vnode -> element -> mountElement

  patch(subTree, container)
}


