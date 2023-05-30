import { effect } from '../reactivity/effect'
import { EMPTY_OBJECT } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { createAppApi } from './createApp'
import { Fragment, Text } from './vnode'

export function createRenderer (options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options
  function render (vnode, container) {
    // 调用patch方法
    patch(null, vnode, container, null)
  }

  function patch (n1, n2, container, parentComponent) {
    // 处理组件
    // 判断是不是element类型
    // 是element应该处理element
    // 如何区分是element、还是component？
    // ShapeFlags
    // vnode -> flag
    const { type, shapeFlag } = n2

    // Fragment -> 只渲染children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 组件就应该处理组件类型
          processComponent(n1, n2, container, parentComponent)
        }
    }
  }

  function processFragment (n1, n2, container, parentComponent) {
    mountChildren(n2.children, container, parentComponent)
  }

  function processText (n1, n2, container) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processElement (n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      // 初始化
      mountElement(n2, container, parentComponent)
    } else {
      // 更新
      patchElement(n1, n2, container, parentComponent)
    }
  }
  function patchElement (n1, n2, container, parentComponent) {
    console.log(n1, n2)
    // props
    const oldProps = n1.props || EMPTY_OBJECT
    const newProps = n2.props || EMPTY_OBJECT
    const el = (n2.el = n1.el)
    patchChildren(n1, n2, el, parentComponent)
    patchProps(el, oldProps, newProps)
    // children
  }

  function patchChildren(n1, n2, container, parentComponent){
    const prevShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag
    const c1 = n1.children
    const c2 = n2.children
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 把老的children清空
        unmountChildren(n1.children)
      }
      if (c1 !== c2) {
        // 2. 设置text
        hostSetElementText(container, c2)
      }
    } else {
      // new array
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "")
        mountChildren(c2, container, parentComponent)
      }
    }
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      hostRemove(el)
    }
  }

  function patchProps (el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        if (Object.prototype.hasOwnProperty.call(newProps, key)) {
          const prevProp = oldProps[key]
          const nextProp = newProps[key]
          if (prevProp !== nextProp) {
            hostPatchProp(el, key, prevProp, nextProp)
          }
        }
      }
      if (oldProps !== EMPTY_OBJECT) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  function mountElement (vnode, container, parentComponent) {
    // canvase
    // new Element()
    const el = (vnode.el = hostCreateElement(vnode.type))
    // string \ array 类型的vnode.children
    const { children, shapeFlag } = vnode
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent)
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
      hostPatchProp(el, key, null, val)
    }
    // canvas
    // el.x = 10

    // container.append(el)
    // canvas -> addChild
    hostInsert(el, container)
  }

  function mountChildren (children, container, parentComponent) {
    children.forEach(v => patch(null, v, container, parentComponent))
  }

  function processComponent (n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent (initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect (instance: any, initialVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        console.log(subTree)

        // vnode -> patch
        // vnode -> element -> mountElement

        patch(null, subTree, container, instance)

        // 所有element mounted 之后，进行el
        initialVNode.el = subTree.el
        instance.isMounted = true
      } else {
        console.log('update')
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree

        patch(prevSubTree, subTree, container, instance)
      }
    })
  }

  return {
    createApp: createAppApi(render)
  }
}
