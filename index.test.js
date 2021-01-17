const { it } = require("@jest/globals");
const { expect } = require("@jest/globals");

import { exception } from "console";
import MyPromise from "./index";

const VALUE = ":)";
const REASON = ":(";

it("recive exectutor func in constructor, call it", () => {
  const executor = jest.fn();
  const promise = new MyPromise(executor);

  expect(executor.mock.calls.length).toBe(1);

  expect(typeof executor.mock.calls[0][0]).toBe("function");
  expect(typeof executor.mock.calls[0][1]).toBe("function");
});

it("Is PENDING on the beginning", () => {
  const promise = new MyPromise(function executor(fulfill, reject) {});
  expect(promise.state).toBe("PENDING");
});

it("Transitions into FULFILLED with VALUE", () => {
  const promise = new MyPromise((fulfill, reject) => {
    fulfill(VALUE);
  });
  expect(promise.state).toBe("FULFILLED");
});

it("Transitions into REJECTED with REASON", () => {
  const promise = new MyPromise((fulfill, reject) => {
    reject(REASON);
  });
  expect(promise.state).toBe("REJECTED");
});

it("should have a .then method", () => {
  const promise = new MyPromise(() => {});
  expect(typeof promise.then).toBe("function");
});

it("should call the onFulfilled method when a promise is in a FULFILLED state", () => {
  const onFulfilled = jest.fn();
  const promise = new MyPromise((fulfill, reject) => {
    fulfill(VALUE);
  }).then(onFulfilled);
  expect(onFulfilled.mock.calls.length).toBe(1);
  expect(onFulfilled.mock.calls[0][0]).toBe(VALUE);
});

it("transitions to the REJECTED state with a `reason`", () => {
  const onRejected = jest.fn();
  const promise = new MyPromise((fulfill, reject) => {
    reject(REASON);
  }).then(null, onRejected);
  expect(onRejected.mock.calls.length).toBe(1);
  expect(onRejected.mock.calls[0][0]).toBe(REASON);
});

it("No change state of fulfilled promise", () => {
  const onFulfilled = jest.fn();
  const onRejected = jest.fn();
  const promise = new MyPromise((fulfill, reject) => {
    fulfill(VALUE);
    reject(REASON);
  });
  promise.then(onFulfilled, onRejected);

  expect(onFulfilled.mock.calls.length).toBe(1);
  expect(onRejected.mock.calls.length).toBe(0);
  expect(onFulfilled.mock.calls[0][0]).toBe(VALUE);
  expect(promise.state === "FULFILLED");
});

it("No change state of rejected promise", () => {
  const onFulfilled = jest.fn();
  const onRejected = jest.fn();
  const promise = new MyPromise((fulfill, reject) => {
    reject(REASON);
    fulfill(VALUE);
  });
  promise.then(onFulfilled, onRejected);

  expect(onFulfilled.mock.calls.length).toBe(0);
  expect(onRejected.mock.calls.length).toBe(1);
  expect(onRejected.mock.calls[0][0]).toBe(REASON);
  expect(promise.state === "REJECTED");
});

it("If executor fails, promise should be REJECTED", () => {
  const onFulfilled = jest.fn();
  const onRejected = jest.fn();
  const promise = new MyPromise((fulfill, reject) => {
    throw REASON;
  });
  promise.then(null, onRejected);

  expect(onRejected.mock.calls.length).toBe(1);
  expect(onFulfilled.mock.calls.length).toBe(0);
  expect(onRejected.mock.calls[0][0]).toBe(REASON);
  expect(promise.state === "REJECTED");
});


it("When the promise is not fulfilled immediately, the callbacks shuld be queue", done => {
  const promise = new MyPromise((fulfill, reject) => {
    setTimeout(fulfill, 1, VALUE)
  })
  const onFulfilled = jest.fn()

  promise.then(onFulfilled)

  setTimeout(() => {
    expect(onFulfilled.mock.calls.length).toBe(1);
    expect(onFulfilled.mock.calls[0][0]).toBe(VALUE);
  }, 5)

  expect(onFulfilled.mock.calls.length).toBe(0)

  setTimeout(function () {
    // should have been called twice
    expect(onFulfilled.mock.calls.length).toBe(2)
    expect(onFulfilled.mock.calls[1][0]).toBe(reason)
    done()
  }, 10)

})

it('should queue callbacks when the promise is not rejected immediately', done => {
  const reason = 'I failed :('
  const promise = new MyPromise((fulfill, reject) => {
    setTimeout(reject, 1, reason)
  })

  const onRejected = jest.fn()

  promise.then(null, onRejected)
  setTimeout(() => {
    // should have been called once
    expect(onRejected.mock.calls.length).toBe(1)
    expect(onRejected.mock.calls[0][0]).toBe(reason)
    promise.then(null, onRejected)
  }, 5)

  // should not be called immediately
  expect(onRejected.mock.calls.length).toBe(0)

  setTimeout(function () {
    // should have been called twice
    expect(onRejected.mock.calls.length).toBe(2)
    expect(onRejected.mock.calls[1][0]).toBe(reason)
    done()
  }, 10)
})