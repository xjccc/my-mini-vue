import { computed } from '../computed'
import { reactive } from '../reactive'

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({ age: 1 })
    const cValue = computed(() => user.age)
    expect(cValue.value).toBe(1)
  })

  it('should be lazy', () => {
    const value = reactive({ age: 1 })
    const getter = vi.fn(() => {
      return value.age
    })
    const cValue = computed(getter)

    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)

    expect(getter).toHaveBeenCalledTimes(1)

    // // should not computed again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    value.age = 2 // set 时候会触发trigger -> effect -> get 重新执行
    expect(getter).toHaveBeenCalledTimes(1)

    // // now it should compute
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    // // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })

  it('computed function ', () => {
    const value = reactive({ age: 1 })
    const getter = vi.fn(() => {
      return val => value.age * val
    })
    const cValue = computed(getter)

    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value(1)).toBe(1)

    expect(getter).toHaveBeenCalledTimes(1)

    // should not computed again
    expect(cValue.value(2)).toBe(2)
    expect(getter).toHaveBeenCalledTimes(1)
    const nAge = cValue.value(3)
    expect(nAge).toBe(3)
    expect(getter).toHaveBeenCalledTimes(1)
  })
})
