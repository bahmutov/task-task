# task-task
> Postfix Task combinator without boilerplate

[![NPM][task-task-icon] ][task-task-url]

[![Build status][task-task-ci-image] ][task-task-ci-url]
[![semantic-release][semantic-image] ][semantic-url]

## Install

    npm install --save @bahmutov/task-task

## Use

Suppose we have two functions, one that adds two numbers, and another
one that doubles a given number. 

```js
const add = (a, b) => a + b
const double = x => x * 2
```

Instead of calling them directly, we can return Task objects.

```js
const addTask = (a, b) => new Task((reject, resolve) => resolve(add(a, b)))
const doubleTask = x => new Task((reject, resolve) => resolve(double(x)))
```

Let us create concrete task, for example to add number 2 to number 3

```js
const add2to3 = addTask(2, 3)
```

The beautify of Task objects is that we nothing is executed yet. We can append other
operations to the task before executing it.

```js
addTask(2, 3)           // nothing is executed yet
    .map(x => x - 1)    // nothing is executed yet
    .map(x => `2 + 3 - 1 = ${x}`) // nothing is executed yet
    .fork( // now runs all steps
        console.error,
        console.log
    )
// prints "2 + 3 - 1 = 4"
```

It is simple to transform task's result with another sync function before it runs,
but how about combining results of two tasks?

Imagine we want to compare the sum of the add task with the doubled result of the double task
and see if the sum is larger. The way to make a derived task from two tasks is to use `chain`
method

```js
const larger = (a, b) => a > b ? a : b
const add2to3 = addTask(2, 3)
const double5 = doubleTask(5)
const largerTask = add2to3.chain(sum => double5.map(doubled => larger(sum, doubled)))
largerTask.fork(..., ...)
```

The `chain` method grabs the result from the first task (its instance object),
then grabs the result of the second task (using `.map` method) and finally runs
the operator function on the two values. The returned result is automatically
wrapped in the Task instance. We can write this as

```js
function op(a, b) { ... }
const outputTask = task1.chain(value1 => task2.map(value2 => op(value1, value2)))
```

This is too long, and too much boilerplate. This is where `task-task` comes in handy.


## How is this different from a Promise?

[Difference between a Promise and a Task](https://glebbahmutov.com/blog//difference-between-promise-and-task/)

## Related

* [data.task](https://www.npmjs.com/package/data.task)
* [taskify](https://github.com/bahmutov/taskify)
* [From callbacks to Tasks]()

### Small print

Author: Gleb Bahmutov &copy; 2016

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/task-task/issues) on Github

## MIT License

Copyright (c) 2016 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[task-task-icon]: https://nodei.co/npm/@bahmutov/task-task.png?downloads=true
[task-task-url]: https://npmjs.org/package/@bahmutov/task-task
[task-task-ci-image]: https://travis-ci.org/bahmutov/task-task.png?branch=master
[task-task-ci-url]: https://travis-ci.org/bahmutov/task-task
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
