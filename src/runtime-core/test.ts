const ShapeFlags = {
  element: 0,
  stateful_component: 0,
  text_children: 0,
  array_children: 0
}

// vnode -> stateful_component -> 设置成1
// 1. 可以设置 修改
// ShapeFlags.stateful_component = 1

// 2. 查找
// if(ShapeFlags.element)

// 形式不够高效 -> 位运算来解决

// 0000
// 0001 -> element
// 0010 -> stateful
// 0100 -> text_children
// 1000 -> array_children
// 1010 -> array_children && stateful

// | (两位都是0，才为0)
// & (两位都是1，才是1)

// 修改
// 0000 | 0001 -> 0001
// 0001

// 查找 & 
// 0001 & 0001 -> 0001
// 0010 & 0001 -> 0000