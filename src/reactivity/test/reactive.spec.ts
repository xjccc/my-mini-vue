import { reactive, isReactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(original.foo).toBe(1)

    //
    expect(isReactive(observed)).toBe(true)
    // 如果不是reactive的话。不会调用get
    expect(isReactive(original)).toBe(false)
  })
})
