import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  render () {
    const app = h('div', {}, "App")
    // 单值的slots
    // const foo = h(Foo, {}, h('p', {}, '123'))
    // 数组形式的slots
    // const foo = h(Foo, {}, [h('p', {}, '123'), h('p', {}, '456')])
    // 获取对应位置 -> 数据结构转换成object
    // 具名插槽
    const foo = h(Foo, {}, {
      header: ({age}) => h('p', {}, "header" + age),
      footer: () => h('p', {}, 'footer')
    })
    return h('div', {}, [app, foo])
  },
  setup () {
    return {}
  }
}
