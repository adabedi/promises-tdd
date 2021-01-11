const { it } = require("@jest/globals");
const { expect } = require("@jest/globals");

import { exception } from "console";
import MyPromise from "./index";
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
  const value = ":)";
  const promise = new MyPromise((fulfill, reject) => {
    fulfill(value);
  });
  expect(promise.state).toBe("FULFILLED");
});

it("Transitions into REJECTED with REASON", () => {
  const reason = ":(";
  const promise = new MyPromise((fulfill, reject) => {
    reject(reason);
  });
  expect(promise.state).toBe("REJECTED");
});

it("should have a .then method", () => {
  const promise = new MyPromise(() => {});
  expect(typeof promise.then).toBe("function");
});

it("should call the onFulfilled method when a promise is in a FULFILLED state", () => {
  const value = "FULFILLED";
  const onFulfilled = jest.fn();
  const promise = new MyPromise((fulfill, reject) => {
    fulfill(value);
  }).then(onFulfilled);
  expect(onFulfilled.mock.calls.length).toBe(1);
  expect(onFulfilled.mock.calls[0][0]).toBe(value);
});

it("transitions to the REJECTED state with a `reason`", () => {
  const reason = ":(";
  const onRejected = jest.fn();
  const promise = new MyPromise((fulfill, reject) => {
    reject(reason);
  }).then(null, onRejected);
  expect(onRejected.mock.calls.length).toBe(1);
  expect(onRejected.mock.calls[0][0]).toBe(reason);
});
