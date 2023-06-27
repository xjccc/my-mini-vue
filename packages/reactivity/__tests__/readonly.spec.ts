import { readonly, isReadonly, isProxy } from '../src/reactive'
describe('readonly', () => {
  it('happy path', () => {
    // no set
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(wrapped.bar)).toBe(true)
    expect(isReadonly(original.bar)).toBe(false)
    expect(isProxy(wrapped)).toBe(true)
  })

  it('warn to be set', () => {
    console.warn = vi.fn()
    const obj = readonly({
      age: 10
    })
    obj.age = 11
    expect(console.warn).toBeCalled()
  })
})
