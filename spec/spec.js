const taskTask = require('..')
const la = require('lazy-ass')
const is = require('check-more-types')
const Task = require('data.task')

const addTask = (a, b) => new Task((reject, resolve) => resolve(a + b))
const doubleTask = x => new Task((reject, resolve) => resolve(x * 2))

/* global describe, it */
describe('add task', () => {
  it('adds numbers', done => {
    addTask(2, 3)
      .fork(
        err => la(false, err),
        sum => {
          la(sum === 5, 'wrong sum', sum)
          done()
        }
      )
  })

  it('has map method', () => {
    const add2to3 = addTask(2, 3)
    la(is.fn(add2to3.map))
  })

  it('can map', done => {
    const add2to3 = addTask(2, 3)
    add2to3.map(x => {
      la(x === 5, x)
      return x + 3
    }).fork(
      err => la(false, err),
      result => {
        la(result === 8, 'wrong result', result)
        done()
      }
    )
  })

  it('can map several times', done => {
    const add2to3 = addTask(2, 3)
    add2to3
      .map(x => {
        la(x === 5, x)
        return x + 3
      })
      .map(x => {
        la(x === 8, x)
        return x - 1
      })
      .fork(
        err => la(false, err),
        result => {
          la(result === 7, 'wrong result', result)
          done()
        }
      )
  })
})

describe('normal Tasks', () => {
  it('has double map', () => {
    const double3 = doubleTask(3)
    la(is.fn(double3.map))
  })

  it('can be chained', done => {
    const double3 = doubleTask(3)
    addTask(2, 3).chain(sum => double3.map(doubled => sum * doubled))
      .fork(
        err => la(false, err),
        result => {
          la(result === 30, 'wrong result', result)
          done()
        }
      )
  })

  it('can compare task results', done => {
    const larger = (a, b) => a > b ? a : b
    const add2to3 = addTask(2, 3)
    const double5 = doubleTask(5)
    const largerTask = add2to3.chain(sum => double5.map(doubled => larger(sum, doubled)))
    largerTask.fork(
      err => la(false, err),
      result => {
        la(result === 10, 'wrong result', result)
        done()
      }
    )
  })
})

describe('task-task', () => {
  it('is a function', () => {
    la(is.fn(taskTask))
  })

  it('can combine two add tasks using operation', done => {
    const add2to3 = addTask(2, 3)
    const add10to1 = addTask(10, 1)
    const addSums = taskTask(add2to3, add10to1, (a, b) => a + b)
    addSums
      .fork(
        err => la(false, err),
        result => {
          la(result === 16, 'wrong result', result)
          done()
        }
      )
  })

  it('can compare task results', done => {
    const larger = (a, b) => a > b ? a : b
    const add2to3 = addTask(2, 3)
    const double5 = doubleTask(5)
    const largerTask = taskTask(add2to3, double5, larger)
    largerTask.fork(
      err => la(false, err),
      result => {
        la(result === 10, 'wrong result', result)
        done()
      }
    )
  })

  it('can combine add with double', done => {
    const add2to3 = addTask(2, 3)
    const double5 = doubleTask(5)
    const compareTask = taskTask(add2to3, double5, (a, b) => a > b)
    compareTask
      .fork(
        err => la(false, err),
        result => {
          la(result === false, 'wrong result', result)
          done()
        }
      )
  })
})
