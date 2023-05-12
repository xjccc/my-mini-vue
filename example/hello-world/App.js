import { h } from '../../lib/guide-mini-vue.esm.js'

export const App = {
  render () {
    return h('div', { id: 'root', class: 'test' }, 
    // string
    // 'hi' + this.msg
    // Array
    [h('p', {class: ['red', 'aa']}, "child-p"), h('p', {class:'green'}, 'child-p2')]
    )
  },
  setup () {
    return {
      msg: 'mini-vue'
    }
  }
}
