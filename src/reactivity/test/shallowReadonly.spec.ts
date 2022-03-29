import { isReactive, isReadonly, shallowReadonly } from '../reactive'

describe('shallowReadonly', () => {
  test('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo: 1 } })
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
    props.n.foo = 2
    expect(props.n.foo).toBe(2)
    expect(isReactive(props.n)).toBe(false)
  })

  it('warn to be set', () => {
    console.warn = jest.fn()
    const obj = shallowReadonly({
      age: 10
    })
    obj.age = 11
    expect(console.warn).toBeCalled()
  })
})
