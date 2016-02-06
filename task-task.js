function taskTask (firstTask, secondTask, op) {
  return firstTask.chain(function (firstValue) {
    return secondTask.map(function (secondValue) {
      return op(firstValue, secondValue)
    })
  })
}

module.exports = taskTask
