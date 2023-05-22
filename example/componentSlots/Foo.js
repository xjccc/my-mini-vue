import { h, renderSlots } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup (props, { emit }) {
    return {}
  },
  render () {
    const foo = h('p', {}, 'foo')
    // Foo组件的vnode.children
    // children 是vnode 不能是数组
    // renderSlots
    //  根据位置渲染 -> 具名插槽
    // 1. 获取到渲染的元素
    // 2. 获取到渲染的位置
    // 作用域插槽
    const age = 18
    return h('div', {}, [
      renderSlots(this.$slots, 'header', {
        age
      }),
      foo,
      renderSlots(this.$slots, 'footer')
    ])
  }
}
