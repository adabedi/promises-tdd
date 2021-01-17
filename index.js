// import { call } from "function-bind";
// import { getHandler } from './utils';

// const PENDING = "PENDING";
// const FULFILLED = "FULFILLED";
// const REJECTED = "REJECTED";

// export default class MyPromise {
//   constructor(executor) {
//     this.state = PENDING;
//     this.queue = [];

//     this.onResolve = this.onResolve.bind(this);
//     this.fulfill = this.fulfill.bind(this);
//     this.reject = this.reject.bind(this);
//     this.handle = this.handle.bind(this);
//     this.handleResolved = this.handleResolved.bind(this);


//     this.onResolve(this,executor);
//     this.then = function then(onFulfilled, onRejected) {
//       this.handle(this, { onFulfilled, onRejected })
//     };

//   }

//   fulfill(promise, value) {
//     promise.state = FULFILLED;
//     promise.value = value;
//   }
//   reject(promise, reason) {
//     promise.state = REJECTED;
//     promise.value = reason;
//   }

//   handleResolved(promise, handler) {
//     // if (promise.state === FULFILLED) {
//     //   return onFulfilled(promise.value);
//     // }

//     // onRejected(promise.value);
//     const cb = promise.state === FULFILLED ? handler.onFulfilled : handler.onRejected
//   cb(promise.value)
//   if(promise.state === FULFILLED){
//    return handler.onFulfilled(promise.value)
//   } else {
// return     handler.onRejected(promise.value)

//   }
//   }
  
//   handle(promise, handler) {
//     // const handlerShape = getHandler(handler)
//     // const {name, method} = handlerShape
//     if (promise.state === PENDING) {
//       promise.queue.push(handler)
//     } else {
//       // execute 
//       promise.handleResolved(promise, handler)
//     }
//   }

//   onResolve(promise, executor) {
//     let called = false;
//     function onFulfill(value) {
//       if (called) return;
//       called = true;
//       promise.fulfill(promise, value);
//     }
//     function onReject(reason) {
//       if (called) return;
//       called = true;
//       promise.reject(promise, reason);
//     }
//     try {
//       executor(onFulfill, onReject);
//     } catch (error) {
//       onReject(error);
//     }
//   }


// }
// possible states
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
  constructor(executor) {
    this.state = PENDING
    this.called = false
    // value | reason = `value` 

    this.queue = []


    // call immediately
    this.doResolve(executor)
  }

  then(onFulfilled, onRejected){
    // this.handleResolved( onFulfilled, onRejected)

    this.handle({ onFulfilled, onRejected })
  }
   fulfill( value){
    this.state = FULFILLED
    this.value = value
    this.finale()

  }
  
  // reject with `reason`
   reject( reason) {
    this.state = REJECTED
    this.value = reason
    this.finale()

  }
  
  handle(handler){
    if(this.state === PENDING){
      return this.queue.push(handler)
    } 
    this.handleResolved(handler)
  }

  finale() {
    const length = this.queue.length
    for (let i = 0; i < length; i += 1) {
      this.handle(this.queue[i])
    }
  }

   doResolve(executor) {
   const onFulfilled = (value)=>{
     if(this.called) return;
     this.called = true
     this.fulfill(value)
    }

    const onRejected = (reason) => {
      if(this.called) return;
      this.called = true
      this.reject(reason)
    }
try {
  executor(onFulfilled
    , onRejected)
} catch (error) {
  onRejected(error)
}
  }


  handleResolved({onFulfilled, onRejected}) {
    this.state === FULFILLED ? onFulfilled(this.value) : onRejected(this.value)
  }
}

 


module.exports = MyPromise;