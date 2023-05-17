import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  render () {
    // emit
    return h('div', {}, [
      h('div', {}, 'App'),
      h(Foo, {
        // 注册一致 on + event
        onAdd (a, b) {
          console.log('on-add', a, b)
        },
        // add-foo -> addFoo
        onAddFoo() {
          console.log('onAddFoo')
        }
      })
    ])
  },
  setup () {
    return {}
  }
}
