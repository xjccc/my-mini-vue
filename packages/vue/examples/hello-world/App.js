import { h } from '../../dist/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'
window.self = null

export const App = {
  render () {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'test'],
        onClick () {
          console.log(111)
        },
        onMousedown () {
          console.log('mouse down')
        }
      },
      // string
      // setupState 获取msg
      // this.$el -> get root element
      // 'hi' + this.msg
      // Array
      // [h('p', {class: ['red', 'aa']}, "child-p"), h('p', {class:'green'}, 'child-p2')]
      [h('div', {}, 'hi' + this.msg), h(Foo, { count: 1 })]
    )
  },
  setup () {
    return {
      msg: 'mini-vue-haha'
    }
  }
}
