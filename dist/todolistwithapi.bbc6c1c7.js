// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],"app.mjs":[function(require,module,exports) {
console.log('app is here');
},{}],"../Users/owner/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../Users/owner/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../Users/owner/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"main.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../Users/owner/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.mjs":[function(require,module,exports) {
"use strict";

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

require("./app.mjs");

require("./main.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var application = document.querySelector('#app-contents');
var loadingEl = document.querySelector('#loading');
var updateInput = document.querySelector('#todos--update-input');
var todosUpdateCancelButton = document.querySelector('.todos--update-cancel-button');
var updateForm = document.querySelector('#todos--update-form');
var todoFormEl = document.querySelector('#todo-form');
var todosInputEl = document.querySelector('#todos-input');
var todosCountEl = document.querySelector('.todos-count');
var todosCountWrapper = document.querySelector('.todos-count-wrapper');
var loading = true;
var orderNumber = 0;
var API_URL = 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos';
var API_KEY = 'FcKdtJs202204';
var USER_NAME = 'KimMyungSeong';
var testArray = [];
todoFormEl.addEventListener('submit', function (e) {
  return onSubmitTodo(e, todosInputEl.value);
});
todosInputEl.addEventListener('focus', onFocusPlaceholder);
todosInputEl.addEventListener('blur', onBlurPlaceholder);

function onInit() {
  return _onInit.apply(this, arguments);
}

function _onInit() {
  _onInit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee() {
    return _regeneratorRuntime.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getTodo();

          case 2:
            renderTodos(todos);
            countTodos(todos);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _onInit.apply(this, arguments);
}

function getTodo() {
  return _getTodo.apply(this, arguments);
}

function _getTodo() {
  _getTodo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee2() {
    var response;
    return _regeneratorRuntime.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            toggleLoading(true);
            _context2.prev = 1;
            _context2.next = 4;
            return request({
              method: 'GET'
            });

          case 4:
            response = _context2.sent;
            todos = [];
            response.data.forEach(function (item) {
              return todos.push(item);
            });
            return _context2.abrupt("return", response);

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](1);
            alert(_context2.t0);

          case 13:
            _context2.prev = 13;
            toggleLoading(false);
            return _context2.finish(13);

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 10, 13, 16]]);
  }));
  return _getTodo.apply(this, arguments);
}

function postTodo(_x, _x2) {
  return _postTodo.apply(this, arguments);
}

function _postTodo() {
  _postTodo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee3(todosValue, orderNumber) {
    var response;
    return _regeneratorRuntime.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            toggleLoading(true);
            _context3.prev = 1;
            _context3.next = 4;
            return request({
              method: 'POST',
              data: {
                title: todosValue,
                order: orderNumber
              }
            });

          case 4:
            response = _context3.sent;
            todos.push(response.data);
            return _context3.abrupt("return", response);

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](1);
            alert(_context3.t0);

          case 12:
            _context3.prev = 12;
            toggleLoading(false);
            readTodo();
            return _context3.finish(12);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 9, 12, 16]]);
  }));
  return _postTodo.apply(this, arguments);
}

function onFocusPlaceholder() {
  todosInputEl.setAttribute('placeholder', "?????? ????????? ?????? ???!");
}

function onBlurPlaceholder() {
  todosInputEl.setAttribute('placeholder', "?????? ????????? ?????? ???");
}

function countTodos(todos) {
  if (todos.length > 0) {
    todosCountEl.textContent = todos.length;
    todosCountWrapper.style.display = 'block';
  }

  if (todos.length === 0) {
    todosCountWrapper.style.display = 'none';
  }
}

function toggleLoading(isLoading) {
  if (isLoading) {
    loadingEl.style.display = 'block';
    application.style.display = 'none';
  } else {
    loadingEl.style.display = 'none';
    application.style.display = 'block';
  }
} // validate


function sameTodoValidation(array, value) {
  var isValid = array.some(function (item) {
    return item.title === value;
  });
  return isValid;
} // create Todo


function createTodo(_x3) {
  return _createTodo.apply(this, arguments);
}

function _createTodo() {
  _createTodo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee4(todosValue) {
    return _regeneratorRuntime.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!sameTodoValidation(todos, todosValue)) {
              postTodo(todosValue, todos.length + 1);
            } else {
              alert("????????? Todo??? ???????????????!");
            }

            readTodo();

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _createTodo.apply(this, arguments);
}

function deleteTodo(_x4) {
  return _deleteTodo.apply(this, arguments);
}

function _deleteTodo() {
  _deleteTodo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee5(e) {
    var value, response;
    return _regeneratorRuntime.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            value = e.target.value;
            _context5.prev = 1;
            todos = todos.filter(function (item) {
              return item.id !== value;
            });
            _context5.next = 5;
            return request({
              url: "".concat(API_URL, "/").concat(value),
              method: 'DELETE'
            });

          case 5:
            response = _context5.sent;
            return _context5.abrupt("return", response);

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](1);
            alert(_context5.t0);

          case 12:
            _context5.prev = 12;
            readTodo();
            return _context5.finish(12);

          case 15:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 9, 12, 15]]);
  }));
  return _deleteTodo.apply(this, arguments);
}

function readTodo() {
  renderTodos(todos);
  countTodos(todos);
}

function onSubmitTodo(e, todosValue) {
  e.preventDefault();

  if (todosValue.length < 10) {
    alert('?????? ????????? ????????? ?????? ?????? ????????? ???????????????(10??? ?????? ??????)');
    return;
  }

  createTodo(todosValue);
  readTodo();
  todosInputEl.value = '';
  todosInputEl.focus();
}

var todoList = document.querySelector('.todos--list');

function countTodoListChildNode() {
  if (!todoList.childElementCount) {
    todoList.innerHTML = "<div>\uC544\uBB34 \uACC4\uD68D\uB3C4 \uC5C6\uC2B5\uB2C8\uB2E4...</div>";
  }
}

var todos = [];

function request(_x5) {
  return _request.apply(this, arguments);
}

function _request() {
  _request = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee6(_ref) {
    var _ref$url, url, _ref$method, method, _ref$data, data, response;

    return _regeneratorRuntime.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _ref$url = _ref.url, url = _ref$url === void 0 ? API_URL : _ref$url, _ref$method = _ref.method, method = _ref$method === void 0 ? "" : _ref$method, _ref$data = _ref.data, data = _ref$data === void 0 ? {} : _ref$data;
            _context6.next = 3;
            return axios({
              url: url,
              method: method,
              headers: {
                "content-type": "application/json",
                apikey: API_KEY,
                username: USER_NAME
              },
              data: data
            });

          case 3:
            response = _context6.sent;
            return _context6.abrupt("return", response);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _request.apply(this, arguments);
}

function putTodo(_x6) {
  return _putTodo.apply(this, arguments);
} //change done property


function _putTodo() {
  _putTodo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee7(item) {
    var id, title, order, done, response;
    return _regeneratorRuntime.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            toggleLoading(true);
            id = item.id, title = item.title, order = item.order, done = item.done;
            _context7.prev = 2;
            _context7.next = 5;
            return request({
              url: "".concat(API_URL, "/").concat(id),
              method: 'PUT',
              data: {
                title: title,
                order: order,
                done: !done
              }
            });

          case 5:
            response = _context7.sent;
            return _context7.abrupt("return", response);

          case 9:
            _context7.prev = 9;
            _context7.t0 = _context7["catch"](2);
            alert(_context7.t0);

          case 12:
            _context7.prev = 12;
            toggleLoading(true);
            getTodo();
            return _context7.finish(12);

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[2, 9, 12, 16]]);
  }));
  return _putTodo.apply(this, arguments);
}

function onToggleDone(_x7) {
  return _onToggleDone.apply(this, arguments);
} //PUT change comment


function _onToggleDone() {
  _onToggleDone = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee8(e) {
    var value, currentItem;
    return _regeneratorRuntime.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            value = e.target.value;
            currentItem = todos.find(function (item) {
              return item.id === value;
            });

            try {
              putTodo(currentItem);
            } catch (err) {
              alert(err);
            } finally {
              readTodo();
            }

          case 3:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _onToggleDone.apply(this, arguments);
}

var showUpdateInput = false;

function onToggleUpdateInput(elems) {
  var bool = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  console.log('toggle!');
  showUpdateInput = bool;

  if (showUpdateInput) {
    elems.style.display = '';
    elems.style.display = 'block';
  } else if (!showUpdateInput) {
    elems.style.display = '';
    elems.style.display = 'none';
  }
}

var updateInputBox = document.querySelector('.todos--update-input-box');

function onSubmitUpdateTodo(_x8, _x9) {
  return _onSubmitUpdateTodo.apply(this, arguments);
}

function _onSubmitUpdateTodo() {
  _onSubmitUpdateTodo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee9(e, value) {
    return _regeneratorRuntime.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            e.preventDefault();
            console.log(value);
            _context9.prev = 2;
            _context9.next = 5;
            return axios({
              url: "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/".concat(value),
              method: 'PUT',
              headers: {
                "content-type": 'application/json',
                apikey: API_KEY,
                username: USER_NAME
              },
              data: {
                "title": updateInput.value,
                "order": orderNumber,
                "done": false
              }
            });

          case 5:
            _context9.next = 10;
            break;

          case 7:
            _context9.prev = 7;
            _context9.t0 = _context9["catch"](2);
            alert(_context9.t0);

          case 10:
            _context9.prev = 10;
            readTodo();
            return _context9.finish(10);

          case 13:
            onToggleUpdateInput(updateInputBox, false);

          case 14:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[2, 7, 10, 13]]);
  }));
  return _onSubmitUpdateTodo.apply(this, arguments);
}

function changeTodoTitle(_x10) {
  return _changeTodoTitle.apply(this, arguments);
}

function _changeTodoTitle() {
  _changeTodoTitle = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee10(e) {
    var value;
    return _regeneratorRuntime.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            value = e.target.value; // value == todo.id

            todosUpdateCancelButton.addEventListener('click', function () {
              onToggleUpdateInput(updateInputBox, false);
            });
            updateForm.addEventListener('submit', function (e) {
              return onSubmitUpdateTodo(e, value);
            });
            document.body.append(updateInputBox);
            onToggleUpdateInput(updateInputBox);
            readTodo();

          case 6:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _changeTodoTitle.apply(this, arguments);
}

function renderTodos(todos) {
  var str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "??????";
  var todoElements = todos.map(function (todo) {
    return (
      /* html */
      "\n  <li class=\"todo\">\n    <div class=\"todos--title\">".concat(todo.title, "</div>\n      <span>(").concat(todo.updatedAt.substr(2, 2), "-").concat(todo.updatedAt.substr(5, 2), "-").concat(todo.updatedAt.substr(8, 2), " ").concat(todo.updatedAt.substr(11, 2), ":").concat(todo.updatedAt.substr(14, 2), "\uBD84 ").concat(str, ")</span>\n    <div class=\"todos--button-wrapper\">\n      <div>\n       <button class=\"todos--delete-button\" value=").concat(todo.id, ">\uC0AD\uC81C\uD558\uAE30</button>\n        <button class=\"todos--update-button\" value=").concat(todo.id, ">\uD0C0\uD611\uD558\uAE30</button>\n     </div>\n  </div>\n    <div>").concat(todo.done === false ? "?????? ???????" : "????????????!????", "\n      <button class='todos--done-toggle-button' value=").concat(todo.id, ">\uCCB4\uD06C</button>\n    </div>\n  </li>\n  ")
    );
  });
  var todoTitles = todoElements.join('');
  todoList.innerHTML = todoTitles;
  application.append(todoList);
  var doneToggleButtons = document.querySelectorAll('.todos--done-toggle-button');
  doneToggleButtons.forEach(function (doneToggleButton) {
    return doneToggleButton.addEventListener('click', onToggleDone);
  });
  countTodoListChildNode();
  loadButtons();
}

var showAllListButton = document.querySelector('#todos--remote-show-Alllist-button');

function showAllList(e) {
  readTodo();
}

var deleteDoneListButton = document.querySelector('#todos--remote-remove-donelist-button');

function deleteDoneList(_x11) {
  return _deleteDoneList.apply(this, arguments);
}

function _deleteDoneList() {
  _deleteDoneList = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.default.mark(function _callee11(e) {
    var doneTodo, todosIdArray;
    return _regeneratorRuntime.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            try {
              doneTodo = todos.filter(function (todo) {
                return todo.done === true;
              });
              todosIdArray = [];
              doneTodo.map(function (item) {
                return todosIdArray.push(item.id);
              });
              todosIdArray.forEach(function (todoId) {
                return axios({
                  url: "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/".concat(todoId),
                  method: 'DELETE',
                  headers: {
                    'content-type': 'application/json',
                    'apikey': 'FcKdtJs202204',
                    'username': 'KimMyungSeong'
                  }
                });
              });
            } catch (err) {
              alert(err);
            } finally {
              readTodo();
            }

          case 1:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _deleteDoneList.apply(this, arguments);
}

function loadButtons() {
  var deleteButtonEls = document.querySelectorAll('.todos--delete-button');

  var todosHandleEls = _toConsumableArray(document.querySelectorAll('.todos--button-wrapper'));

  var updateButtonEls = _toConsumableArray(document.querySelectorAll('.todos--update-button'));

  showAllListButton.addEventListener('click', showAllList);
  deleteDoneListButton.addEventListener('click', deleteDoneList);
  deleteButtonEls.forEach(function (deleteButtonEl) {
    return deleteButtonEl.addEventListener('click', deleteTodo);
  });
  updateButtonEls.forEach(function (updateButtonEl) {
    return updateButtonEl.addEventListener('click', changeTodoTitle);
  });
}

var showDoneListButton = document.querySelector('#todos--remote-show-donelist-button');
var showProgressingListButton = document.querySelector('#todos--remote-show-progressinglist-button'); //sort by data.done value

function onToggleList(bool) {
  var filteredFalseData = todos.filter(function (item) {
    return item.done === bool;
  });
  console.log(filteredFalseData);
  todoList.innerHTML = '';
  renderTodos(filteredFalseData, "??????");
}

showDoneListButton.addEventListener('click', function () {
  return onToggleList(true);
});
showProgressingListButton.addEventListener('click', function () {
  return onToggleList(false);
});
onInit();
},{"regenerator-runtime":"node_modules/regenerator-runtime/runtime.js","./app.mjs":"app.mjs","./main.css":"main.css"}],"../Users/owner/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58999" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ??? Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] ????  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">????</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../Users/owner/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.mjs"], null)
//# sourceMappingURL=/todolistwithapi.bbc6c1c7.js.map