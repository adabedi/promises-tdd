const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

export default class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.onResolve = this.onResolve.bind(this);
    this.fulfill = this.fulfill.bind(this);
    this.reject = this.reject.bind(this);
    this.onResolve(this, executor);
    this.then = function then(onFulfilled, onRejected) {
      console.log(typeof onRejected, typeof onFulfilled);

      this.handleResolved(this, onFulfilled, onRejected);
    };
    this.handleResolved = this.handleResolved.bind(this);
  }

  fulfill(promise, value) {
    promise.state = FULFILLED;
    promise.value = value;
  }
  reject(promise, reason) {
    promise.state = REJECTED;
    promise.value = reason;
  }

  onResolve(promise, executor) {
    function onFulfill(value) {
      promise.fulfill(promise, value);
    }
    function onReject(reason) {
      promise.reject(promise, reason);
    }
    executor(onFulfill, onReject);
  }

  handleResolved(promise, onFulfilled, onRejected) {
    if (promise.state === FULFILLED) {
      return onFulfilled(promise.value);
    }
    onRejected(promise.value);
  }
}
