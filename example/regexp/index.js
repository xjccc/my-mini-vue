// 有限状态机
// /abc/.test("lllabc")
// /ab[cd]/.test()
function test (string) {
  let startIndex
  let endIndex
  let i
  function waitForA (char) {
    if (char === 'a') {
      startIndex = i
      return waitForB
    }
    return waitForA
  }
  function waitForB (char) {
    if (char === 'b') {
      return waitForC
    }
    return waitForB
  }
  function waitForC (char) {
    if (char === 'c' || char === 'd') {
      endIndex = i
      return end
    }
    return waitForA
  }
  function end () {
    return end
  }
  let currentState = waitForA
  for (i = 0; i < string.length; i++) {
    let nextState = currentState(string[i])
    currentState = nextState
    if (currentState === end) {
      console.log(startIndex, endIndex);
      currentState = waitForA
    }
  }
}

console.log(test("dabddabcd"));