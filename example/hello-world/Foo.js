import { h } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup (props) {
    // props.count
    console.log(props, 666)
    // props -> readonly
  },
  render () {
    return h('div', {}, 'foo: ' + this.count)
  }
}