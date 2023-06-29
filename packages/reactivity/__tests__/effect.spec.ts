import { reactive } from '../src/reactive'
import { effect, stop } from '../src/effect'
describe('effect', () => {
  it('happy path', () => {
    const user = reactive({ age: 10, name: 2 })
    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11)
    // update
    user.age++
    expect(nextAge).toBe(12)
  })

  it('should return runner when call effect', () => {
    // 1. effect -> function (runner) -> fn -> return
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe('foo')
  })

  it('scheduler', () => {
    let dummy
    let run
    const scheduler = vi.fn(() => {
      run = runner
    })
    const obj = reactive({foo: 1})
    const runner = effect(() => {
      dummy = obj.foo
    }, {scheduler})
    expect(scheduler).not.toBeCalled()
    expect(dummy).toBe(1)
    obj.foo++
    expect(scheduler).toBeCalledTimes(1)
    expect(dummy).toBe(1)
    run()
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy
    const obj = reactive({prop: 1})
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    // obj.prop = 3
    // 涉及 get \ set 又会重新收集依赖
    // obj.prop = obj.prop + 1
    obj.prop++
    expect(dummy).toBe(2)
    runner()
    expect(dummy).toBe(3)
  })
  it('onStop', () => {
    const obj = reactive({
      foo: 1
    })
    const onStop = vi.fn()
    let dummy
    const runner = effect(() => {
      dummy = obj.foo
    },{
      onStop
    })
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})