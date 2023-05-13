import { h } from '../../lib/guide-mini-vue.esm.js'

window.self = null

export const App = {
  render () {
    window.self = this
    return h('div', { id: 'root', class: ['red', 'test'] }, 
    // string
    // setupState 获取msg
    // this.$el -> get root element
    'hi' + this.msg
    // Array
    // [h('p', {class: ['red', 'aa']}, "child-p"), h('p', {class:'green'}, 'child-p2')]
    )
  },
  setup () {
    return {
      msg: 'mini-vue-haha'
    }
  }
}
