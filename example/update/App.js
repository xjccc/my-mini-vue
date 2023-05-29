import { h, ref } from '../../lib/guide-mini-vue.esm.js'
export const App = {
  name: 'App',
  setup () {
    const count = ref(0)
    const onClick = () => {
      count.value++
    }
    const props = ref({
      foo: 'foo',
      bar: 'bar'
    })
    const onChangeProps1 = () => {
      props.value.foo = 'new-foo'
    }

    const onChangeProps2 = () => {
      props.value.foo = undefined
    }

    const onChangeProps3 = () => {
      props.value = {
        foo: 'foo'
      }
    }

    return {
      count,
      props,
      onClick,
      onChangeProps1,
      onChangeProps2,
      onChangeProps3
    }
  },
  render () {
    return h(
      'div',
      {
        id: 'root',
        ...this.props
      },
      [
        h('div', {}, 'count' + this.count),
        h(
          'button',
          {
            onClick: this.onClick
          },
          'click'
        ),
        h(
          'button',
          {
            onClick: this.onChangeProps1
          },
          'changeProps - 值改变了 - 修改'
        ),
        h(
          'button',
          {
            onClick: this.onChangeProps2
          },
          'changeProps - 值变成undefined - 删除'
        ),
        h(
          'button',
          {
            onClick: this.onChangeProps3
          },
          'changeProps - bar没有了 - 删除'
        )
      ]
    )
  }
}
