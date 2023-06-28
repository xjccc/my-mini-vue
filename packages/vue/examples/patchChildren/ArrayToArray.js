import { h, ref } from '../../dist/guide-mini-vue.esm.js'
// 1. 左侧对比
// const prevChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'C'}, "C"),
// ]
// const nextChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'D'}, "D"),
//   h('p', {key: 'E'}, "E"),
// ]
// 2. 右侧对比
// a (b c)
// d e (b c)
// const prevChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'C'}, "C"),
// ]
// const nextChildren = [
//   h('p', {key: 'D'}, "D"),
//   h('p', {key: 'E'}, "E"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'C'}, "C"),
// ]

// 3. 新的比老的长
// a b
// a b c
// e1 -> 1   e2 -> 2  i -> 2
// 左侧
// const prevChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
// ]
// const nextChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'C'}, "C"),
//     h('p', {key: 'D'}, "D"),
// ]

// 右侧
// a b
// d c a b
// i -> 0 e1 -> -1 e2 -> 0
// const prevChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
// ]
// const nextChildren = [
//   h('p', {key: 'D'}, "D"),
//   h('p', {key: 'C'}, "C"),
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
// ]

// 4. 老的比新的长
// 删除老的
// a b c
// a b
// i -> 2 e1 -> 2 e2 -> 1
// const nextChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
// ]
// const prevChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'C'}, "C"),
// ]

// 右侧
// a b c
// b c
// i -> 0 e1 -> 0 e2 -> -1
// const prevChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'C'}, "C"),
// ]
// const nextChildren = [
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'C'}, "C"),
// ]

// 5. 对比中间部分
// 删除老的 （在老的里面存在，新的里面不存在）
// 5.1
// a b c d f g
// a b e c f g
// D 节点在新的里面没有 - 需要删除
// C节点 props 也发生变化 - 需要patch
// const prevChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'C', id: "c-prev"}, "C"),
//   h('p', {key: 'D'}, "D"),
//   h('p', {key: 'F'}, "F"),
//   h('p', {key: 'G'}, "G"),
// ]

// const nextChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'E'}, "E"),
//   h('p', {key: 'C', id: "c-next"}, "C"),
//   h('p', {key: 'F'}, "F"),
//   h('p', {key: 'G'}, "G"),
// ]

// 5.1.1
// a b c e d f g
// a b e c f g
// 中间部分，老的比新的多，那么多出来的可以直接循环的时候干掉
// const prevChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'C', id: "c-prev"}, "C"),
//   h('p', {key: 'E'}, "E"),
//   h('p', {key: 'D'}, "D"),
//   h('p', {key: 'F'}, "F"),
//   h('p', {key: 'G'}, "G"),
// ]

// const nextChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'E'}, "E"),
//   h('p', {key: 'C', id: "c-next"}, "C"),
//   h('p', {key: 'F'}, "F"),
//   h('p', {key: 'G'}, "G"),
// ]
// 2 移动 （节点存在于新的和老的里面，但是位置变了）
// 2.1
// a b c d e f g
// a b e c d f g
// 最长子序列[1, 2]
// const prevChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'C', id: "c-prev"}, "C"),
//   h('p', {key: 'D'}, "D"),
//   h('p', {key: 'E'}, "E"),
//   h('p', {key: 'F'}, "F"),
//   h('p', {key: 'G'}, "G"),
// ]

// const nextChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'E'}, "E"),
//   h('p', {key: 'C', id: "c-next"}, "C"),
//   h('p', {key: 'D'}, "D"),
//   h('p', {key: 'F'}, "F"),
//   h('p', {key: 'G'}, "G"),
// ]

// 3. 创建新节点
// a b c e f g
// a b e c d f g
// d节点在老节点中不存在，新的里面存在，所以需要创建
// const prevChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'C', id: "c-prev"}, "C"),
//   h('p', {key: 'E'}, "E"),
//   h('p', {key: 'F'}, "F"),
//   h('p', {key: 'G'}, "G"),
// ]

// const nextChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'E'}, "E"),
//   h('p', {key: 'C', id: "c-next"}, "C"),
//   h('p', {key: 'D'}, "D"),
//   h('p', {key: 'F'}, "F"),
//   h('p', {key: 'G'}, "G"),
// ]

// 综合例子
// a b c d e z f g
// a b d c y e f g
// const prevChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'C', id: "c-prev"}, "C"),
//   h('p', {key: 'D'}, "D"),
//   h('p', {key: 'E'}, "E"),
//   h('p', {key: 'Z'}, "Z"),
//   h('p', {key: 'F'}, "F"),
//   h('p', {key: 'G'}, "G"),
// ]

// const nextChildren = [
//   h('p', {key: 'A'}, "A"),
//   h('p', {key: 'B'}, "B"),
//   h('p', {key: 'D'}, "D"),
//   h('p', {key: 'C', id: "c-next"}, "C"),
//   h('p', {key: 'Y'}, "Y"),
//   h('p', {key: 'E'}, "E"),
//   h('p', {key: 'F'}, "F"),
//   h('p', {key: 'G'}, "G"),
// ]

// fix c节点应该是move，不是删除后，重新创建

const prevChildren = [
  h('p', {key: 'A'}, "A"),
  h('p', {}, "C"),
  h('p', {key: 'B'}, "B"),
  h('p', {key: 'D'}, "D")
]

const nextChildren = [
  h('p', {key: 'A'}, "A"),
  h('p', {key: 'B'}, "B"),
  h('p', {}, "C"),
  h('p', {key: 'D'}, "D")
]

export default {
  name: 'ArrayToText',
  setup () {
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange
    }
  },
  render () {
   const self = this
   return self.isChange === true ? h('div', {}, nextChildren) : h('div', {}, prevChildren) 
  }
}
