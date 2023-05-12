// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
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

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
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
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"37pvV":[function(require,module,exports) {
/* eslint-disable */ var _esRegexpFlagsJs = require("core-js/modules/es.regexp.flags.js");
var _esTypedArraySetJs = require("core-js/modules/es.typed-array.set.js");
var _login = require("./login");
var _leafletMap = require("./leafletMap");
var _account = require("./account");
var _booking = require("./booking");
// DOM Elements
const loginForm = document.querySelector(".login-form form");
const accSettingsForm = document.querySelector(".form-user-data");
const accPasswordForm = document.querySelector(".form-user-settings");
const emailForm = document.querySelector(".email-form form");
const reviewForm = document.querySelector(".review-form form");
const map = document.getElementById("map");
//tabs
const sideNav = document.querySelector(".side-nav");
const sideNavBtns = document.querySelectorAll(".side-nav__item");
const userTabs = document.querySelectorAll(".user-tab");
const btnLogOut = document.querySelector(".nav__el--logout");
const btnBookTour = document.getElementById("bookTourBtn");
// --- Delegation ---
// Login form
if (loginForm) loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    (0, _login.login)(email, password);
});
// Password forgot email form
if (emailForm) emailForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = e.target.elements.email.value;
    (0, _account.forgotPassword)(email);
});
// Settings form
if (accSettingsForm) accSettingsForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", e.target.elements.name.value);
    formData.append("email", e.target.elements.email.value);
    formData.append("photo", e.target.elements.photo.files[0]);
    (0, _account.updateSettings)(formData);
});
// Password form
if (accPasswordForm) accPasswordForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const passwordCurrent = e.target.elements.passwordCurrent.value;
    const password = e.target.elements.password.value;
    const passwordConfirm = e.target.passwordConfirm.value;
    (0, _account.updateSettings)({
        passwordCurrent,
        password,
        passwordConfirm
    }, "update-password");
});
// Review form
if (reviewForm) {
    const ratingEl = document.getElementById("ratingValue");
    reviewForm.querySelector("#rating").addEventListener("input", (e)=>{
        ratingEl.textContent = e.target.value;
    });
}
if (sideNav) sideNav.addEventListener("click", (e)=>{
    // Get the target
    const target = e.target.closest(".side-nav__item");
    if (!target) return;
    const id = target.dataset.id;
    // Remove all active states
    sideNavBtns.forEach((btn, i)=>{
        btn.classList.remove(`side-nav--active`);
        userTabs[i].classList.remove(`user-tab--active`);
    });
    // Add active state to a btn and tab
    document.querySelector(`.side-nav__item--${id}`).classList.add("side-nav--active");
    document.querySelector(`.user-tab--${id}`).classList.add("user-tab--active");
});
// Map display
if (map) {
    const locations = JSON.parse(map.dataset.locations);
    (0, _leafletMap.displayMap)(locations);
}
// Log out btn
if (btnLogOut) btnLogOut.addEventListener("click", (0, _login.logout));
// Book tour btn
if (btnBookTour) btnBookTour.addEventListener("click", (e)=>{
    e.target.textContent = "Proccessing...";
    const tourId = e.target.dataset.tourid;
    (0, _booking.bookTour)(tourId);
});

},{"core-js/modules/es.regexp.flags.js":"8LAvP","core-js/modules/es.typed-array.set.js":"fzd8u","./login":"bmyUV","./leafletMap":"cS1V9","./account":"7QBDR","./booking":"3u4xF"}],"8LAvP":[function(require,module,exports) {
var global = require("441acfa46e2b1ecd");
var DESCRIPTORS = require("81b2e8bbcba588d1");
var defineBuiltInAccessor = require("c6275bee23f4f5cc");
var regExpFlags = require("3a4bfd1692331267");
var fails = require("2c6f40bac1fdd3f1");
// babel-minify and Closure Compiler transpiles RegExp('.', 'd') -> /./d and it causes SyntaxError
var RegExp = global.RegExp;
var RegExpPrototype = RegExp.prototype;
var FORCED = DESCRIPTORS && fails(function() {
    var INDICES_SUPPORT = true;
    try {
        RegExp(".", "d");
    } catch (error) {
        INDICES_SUPPORT = false;
    }
    var O = {};
    // modern V8 bug
    var calls = "";
    var expected = INDICES_SUPPORT ? "dgimsy" : "gimsy";
    var addGetter = function(key, chr) {
        // eslint-disable-next-line es/no-object-defineproperty -- safe
        Object.defineProperty(O, key, {
            get: function() {
                calls += chr;
                return true;
            }
        });
    };
    var pairs = {
        dotAll: "s",
        global: "g",
        ignoreCase: "i",
        multiline: "m",
        sticky: "y"
    };
    if (INDICES_SUPPORT) pairs.hasIndices = "d";
    for(var key in pairs)addGetter(key, pairs[key]);
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var result = Object.getOwnPropertyDescriptor(RegExpPrototype, "flags").get.call(O);
    return result !== expected || calls !== expected;
});
// `RegExp.prototype.flags` getter
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
if (FORCED) defineBuiltInAccessor(RegExpPrototype, "flags", {
    configurable: true,
    get: regExpFlags
});

},{"441acfa46e2b1ecd":"2nPtN","81b2e8bbcba588d1":"bVi61","c6275bee23f4f5cc":"9Yv6O","3a4bfd1692331267":"ahJZr","2c6f40bac1fdd3f1":"j7GFq"}],"2nPtN":[function(require,module,exports) {
var check = function(it) {
    return it && it.Math == Math && it;
};
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports = // eslint-disable-next-line es/no-global-this -- safe
check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || // eslint-disable-next-line no-restricted-globals -- safe
check(typeof self == "object" && self) || check(typeof global == "object" && global) || // eslint-disable-next-line no-new-func -- fallback
function() {
    return this;
}() || this || Function("return this")();

},{}],"bVi61":[function(require,module,exports) {
var fails = require("3977b06dffe2bc3");
// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function() {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, {
        get: function() {
            return 7;
        }
    })[1] != 7;
});

},{"3977b06dffe2bc3":"j7GFq"}],"j7GFq":[function(require,module,exports) {
module.exports = function(exec) {
    try {
        return !!exec();
    } catch (error) {
        return true;
    }
};

},{}],"9Yv6O":[function(require,module,exports) {
var makeBuiltIn = require("5d44e113154719f0");
var defineProperty = require("4a96b5cfc53eabe7");
module.exports = function(target, name, descriptor) {
    if (descriptor.get) makeBuiltIn(descriptor.get, name, {
        getter: true
    });
    if (descriptor.set) makeBuiltIn(descriptor.set, name, {
        setter: true
    });
    return defineProperty.f(target, name, descriptor);
};

},{"5d44e113154719f0":"jTn61","4a96b5cfc53eabe7":"jDtrp"}],"jTn61":[function(require,module,exports) {
var uncurryThis = require("4cb5006ff7285176");
var fails = require("df0724097e3569d1");
var isCallable = require("f87d02cb6269e390");
var hasOwn = require("8222a39c07bdcfe3");
var DESCRIPTORS = require("37a5e0d753b7947b");
var CONFIGURABLE_FUNCTION_NAME = require("35639add5dc21b6d").CONFIGURABLE;
var inspectSource = require("c11b2286f3f81160");
var InternalStateModule = require("f30bbb47a74c4277");
var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis("".slice);
var replace = uncurryThis("".replace);
var join = uncurryThis([].join);
var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function() {
    return defineProperty(function() {}, "length", {
        value: 8
    }).length !== 8;
});
var TEMPLATE = String(String).split("String");
var makeBuiltIn = module.exports = function(value, name, options) {
    if (stringSlice($String(name), 0, 7) === "Symbol(") name = "[" + replace($String(name), /^Symbol\(([^)]*)\)/, "$1") + "]";
    if (options && options.getter) name = "get " + name;
    if (options && options.setter) name = "set " + name;
    if (!hasOwn(value, "name") || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
        if (DESCRIPTORS) defineProperty(value, "name", {
            value: name,
            configurable: true
        });
        else value.name = name;
    }
    if (CONFIGURABLE_LENGTH && options && hasOwn(options, "arity") && value.length !== options.arity) defineProperty(value, "length", {
        value: options.arity
    });
    try {
        if (options && hasOwn(options, "constructor") && options.constructor) {
            if (DESCRIPTORS) defineProperty(value, "prototype", {
                writable: false
            });
        } else if (value.prototype) value.prototype = undefined;
    } catch (error) {}
    var state = enforceInternalState(value);
    if (!hasOwn(state, "source")) state.source = join(TEMPLATE, typeof name == "string" ? name : "");
    return value;
};
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
    return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, "toString");

},{"4cb5006ff7285176":"5MM5X","df0724097e3569d1":"j7GFq","f87d02cb6269e390":"lM7TE","8222a39c07bdcfe3":"3uBzP","37a5e0d753b7947b":"bVi61","35639add5dc21b6d":"gf3q1","c11b2286f3f81160":"b1w0f","f30bbb47a74c4277":"5ftcE"}],"5MM5X":[function(require,module,exports) {
var NATIVE_BIND = require("b58c5bbb928f903a");
var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);
module.exports = NATIVE_BIND ? uncurryThisWithBind : function(fn) {
    return function() {
        return call.apply(fn, arguments);
    };
};

},{"b58c5bbb928f903a":"gafki"}],"gafki":[function(require,module,exports) {
var fails = require("9cb0bfce45ae065d");
module.exports = !fails(function() {
    // eslint-disable-next-line es/no-function-prototype-bind -- safe
    var test = (function() {}).bind();
    // eslint-disable-next-line no-prototype-builtins -- safe
    return typeof test != "function" || test.hasOwnProperty("prototype");
});

},{"9cb0bfce45ae065d":"j7GFq"}],"lM7TE":[function(require,module,exports) {
var $documentAll = require("d500a63243cdfd21");
var documentAll = $documentAll.all;
// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function(argument) {
    return typeof argument == "function" || argument === documentAll;
} : function(argument) {
    return typeof argument == "function";
};

},{"d500a63243cdfd21":"6Pdw7"}],"6Pdw7":[function(require,module,exports) {
var documentAll = typeof document == "object" && document.all;
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll == "undefined" && documentAll !== undefined;
module.exports = {
    all: documentAll,
    IS_HTMLDDA: IS_HTMLDDA
};

},{}],"3uBzP":[function(require,module,exports) {
var uncurryThis = require("b495b72105a223c0");
var toObject = require("9aa114d58c91b67a");
var hasOwnProperty = uncurryThis({}.hasOwnProperty);
// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty(toObject(it), key);
};

},{"b495b72105a223c0":"5MM5X","9aa114d58c91b67a":"5VBIn"}],"5VBIn":[function(require,module,exports) {
var requireObjectCoercible = require("55464f981db0cc9d");
var $Object = Object;
// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function(argument) {
    return $Object(requireObjectCoercible(argument));
};

},{"55464f981db0cc9d":"bNALV"}],"bNALV":[function(require,module,exports) {
var isNullOrUndefined = require("35a17e2294ec609d");
var $TypeError = TypeError;
// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function(it) {
    if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
    return it;
};

},{"35a17e2294ec609d":"9a1wR"}],"9a1wR":[function(require,module,exports) {
// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function(it) {
    return it === null || it === undefined;
};

},{}],"gf3q1":[function(require,module,exports) {
var DESCRIPTORS = require("7d18bfdddaab99f3");
var hasOwn = require("3bcae1a99f92d97a");
var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
var EXISTS = hasOwn(FunctionPrototype, "name");
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() {}).name === "something";
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || DESCRIPTORS && getDescriptor(FunctionPrototype, "name").configurable);
module.exports = {
    EXISTS: EXISTS,
    PROPER: PROPER,
    CONFIGURABLE: CONFIGURABLE
};

},{"7d18bfdddaab99f3":"bVi61","3bcae1a99f92d97a":"3uBzP"}],"b1w0f":[function(require,module,exports) {
var uncurryThis = require("8fd341260415bc6e");
var isCallable = require("ed316a4a94963104");
var store = require("f5f48eaa861ae118");
var functionToString = uncurryThis(Function.toString);
// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) store.inspectSource = function(it) {
    return functionToString(it);
};
module.exports = store.inspectSource;

},{"8fd341260415bc6e":"5MM5X","ed316a4a94963104":"lM7TE","f5f48eaa861ae118":"6la10"}],"6la10":[function(require,module,exports) {
var global = require("3fc98123dbc3daa9");
var defineGlobalProperty = require("6e0cadd10bbca705");
var SHARED = "__core-js_shared__";
var store = global[SHARED] || defineGlobalProperty(SHARED, {});
module.exports = store;

},{"3fc98123dbc3daa9":"2nPtN","6e0cadd10bbca705":"eR3Qy"}],"eR3Qy":[function(require,module,exports) {
var global = require("ad94acc0e94532b9");
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
module.exports = function(key, value) {
    try {
        defineProperty(global, key, {
            value: value,
            configurable: true,
            writable: true
        });
    } catch (error) {
        global[key] = value;
    }
    return value;
};

},{"ad94acc0e94532b9":"2nPtN"}],"5ftcE":[function(require,module,exports) {
var NATIVE_WEAK_MAP = require("6a90d729dd66d10f");
var global = require("8cfb4a78438484b4");
var isObject = require("ada70b57a2ce8176");
var createNonEnumerableProperty = require("88c5724d5987590a");
var hasOwn = require("3fb58ba1354c0445");
var shared = require("fe8b8794425756f");
var sharedKey = require("b0da138cc164eb89");
var hiddenKeys = require("c69e6a96ac74ed2d");
var OBJECT_ALREADY_INITIALIZED = "Object already initialized";
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;
var enforce = function(it) {
    return has(it) ? get(it) : set(it, {});
};
var getterFor = function(TYPE) {
    return function(it) {
        var state;
        if (!isObject(it) || (state = get(it)).type !== TYPE) throw TypeError("Incompatible receiver, " + TYPE + " required");
        return state;
    };
};
if (NATIVE_WEAK_MAP || shared.state) {
    var store = shared.state || (shared.state = new WeakMap());
    /* eslint-disable no-self-assign -- prototype methods protection */ store.get = store.get;
    store.has = store.has;
    store.set = store.set;
    /* eslint-enable no-self-assign -- prototype methods protection */ set = function(it, metadata) {
        if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
        metadata.facade = it;
        store.set(it, metadata);
        return metadata;
    };
    get = function(it) {
        return store.get(it) || {};
    };
    has = function(it) {
        return store.has(it);
    };
} else {
    var STATE = sharedKey("state");
    hiddenKeys[STATE] = true;
    set = function(it, metadata) {
        if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
        metadata.facade = it;
        createNonEnumerableProperty(it, STATE, metadata);
        return metadata;
    };
    get = function(it) {
        return hasOwn(it, STATE) ? it[STATE] : {};
    };
    has = function(it) {
        return hasOwn(it, STATE);
    };
}
module.exports = {
    set: set,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor
};

},{"6a90d729dd66d10f":"bn6ZV","8cfb4a78438484b4":"2nPtN","ada70b57a2ce8176":"9kPRS","88c5724d5987590a":"jPPLX","3fb58ba1354c0445":"3uBzP","fe8b8794425756f":"6la10","b0da138cc164eb89":"4Wsr8","c69e6a96ac74ed2d":"WqaLh"}],"bn6ZV":[function(require,module,exports) {
var global = require("96025ef0e79cb914");
var isCallable = require("ad821408b8dc2e2a");
var WeakMap = global.WeakMap;
module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));

},{"96025ef0e79cb914":"2nPtN","ad821408b8dc2e2a":"lM7TE"}],"9kPRS":[function(require,module,exports) {
var isCallable = require("bca3679cf2f18d2b");
var $documentAll = require("a92f0a783f3d41df");
var documentAll = $documentAll.all;
module.exports = $documentAll.IS_HTMLDDA ? function(it) {
    return typeof it == "object" ? it !== null : isCallable(it) || it === documentAll;
} : function(it) {
    return typeof it == "object" ? it !== null : isCallable(it);
};

},{"bca3679cf2f18d2b":"lM7TE","a92f0a783f3d41df":"6Pdw7"}],"jPPLX":[function(require,module,exports) {
var DESCRIPTORS = require("53d80e0ad0646fa7");
var definePropertyModule = require("ab8f92fda9ff0fe0");
var createPropertyDescriptor = require("87434a30bfe9a2a4");
module.exports = DESCRIPTORS ? function(object, key, value) {
    return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function(object, key, value) {
    object[key] = value;
    return object;
};

},{"53d80e0ad0646fa7":"bVi61","ab8f92fda9ff0fe0":"jDtrp","87434a30bfe9a2a4":"jYKm8"}],"jDtrp":[function(require,module,exports) {
var DESCRIPTORS = require("3e02b4865f6b9054");
var IE8_DOM_DEFINE = require("c09f4f741846c493");
var V8_PROTOTYPE_DEFINE_BUG = require("86bae5895ee73946");
var anObject = require("5129d2c2290fbb82");
var toPropertyKey = require("9830c633c42a5ff");
var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = "enumerable";
var CONFIGURABLE = "configurable";
var WRITABLE = "writable";
// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPropertyKey(P);
    anObject(Attributes);
    if (typeof O === "function" && P === "prototype" && "value" in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
        var current = $getOwnPropertyDescriptor(O, P);
        if (current && current[WRITABLE]) {
            O[P] = Attributes.value;
            Attributes = {
                configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
                enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
                writable: false
            };
        }
    }
    return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPropertyKey(P);
    anObject(Attributes);
    if (IE8_DOM_DEFINE) try {
        return $defineProperty(O, P, Attributes);
    } catch (error) {}
    if ("get" in Attributes || "set" in Attributes) throw $TypeError("Accessors not supported");
    if ("value" in Attributes) O[P] = Attributes.value;
    return O;
};

},{"3e02b4865f6b9054":"bVi61","c09f4f741846c493":"e7LRg","86bae5895ee73946":"62zAL","5129d2c2290fbb82":"bb9bF","9830c633c42a5ff":"jGbOd"}],"e7LRg":[function(require,module,exports) {
var DESCRIPTORS = require("73a0f0adb0e0094f");
var fails = require("2cf8156eebe06001");
var createElement = require("c139008bbe28e480");
// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function() {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty(createElement("div"), "a", {
        get: function() {
            return 7;
        }
    }).a != 7;
});

},{"73a0f0adb0e0094f":"bVi61","2cf8156eebe06001":"j7GFq","c139008bbe28e480":"9sTDx"}],"9sTDx":[function(require,module,exports) {
var global = require("b8f4c2a73da03332");
var isObject = require("37608f5763ff9fee");
var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);
module.exports = function(it) {
    return EXISTS ? document.createElement(it) : {};
};

},{"b8f4c2a73da03332":"2nPtN","37608f5763ff9fee":"9kPRS"}],"62zAL":[function(require,module,exports) {
var DESCRIPTORS = require("1ad011f1f5d085de");
var fails = require("a9070e62fa18a222");
// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function() {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty(function() {}, "prototype", {
        value: 42,
        writable: false
    }).prototype != 42;
});

},{"1ad011f1f5d085de":"bVi61","a9070e62fa18a222":"j7GFq"}],"bb9bF":[function(require,module,exports) {
var isObject = require("f0229a90ef87a518");
var $String = String;
var $TypeError = TypeError;
// `Assert: Type(argument) is Object`
module.exports = function(argument) {
    if (isObject(argument)) return argument;
    throw $TypeError($String(argument) + " is not an object");
};

},{"f0229a90ef87a518":"9kPRS"}],"jGbOd":[function(require,module,exports) {
var toPrimitive = require("743e3c5e6896ff04");
var isSymbol = require("f37d02390ccca064");
// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function(argument) {
    var key = toPrimitive(argument, "string");
    return isSymbol(key) ? key : key + "";
};

},{"743e3c5e6896ff04":"2q3Yz","f37d02390ccca064":"iz5IK"}],"2q3Yz":[function(require,module,exports) {
var call = require("5762c197b833cf66");
var isObject = require("a75dd549e9e7bffc");
var isSymbol = require("17ac39a8b03c8d64");
var getMethod = require("737b651b39d7e3d9");
var ordinaryToPrimitive = require("f42d8a7ec7f7bc0c");
var wellKnownSymbol = require("435d1c2c2db41779");
var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");
// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function(input, pref) {
    if (!isObject(input) || isSymbol(input)) return input;
    var exoticToPrim = getMethod(input, TO_PRIMITIVE);
    var result;
    if (exoticToPrim) {
        if (pref === undefined) pref = "default";
        result = call(exoticToPrim, input, pref);
        if (!isObject(result) || isSymbol(result)) return result;
        throw $TypeError("Can't convert object to primitive value");
    }
    if (pref === undefined) pref = "number";
    return ordinaryToPrimitive(input, pref);
};

},{"5762c197b833cf66":"hsxXH","a75dd549e9e7bffc":"9kPRS","17ac39a8b03c8d64":"iz5IK","737b651b39d7e3d9":"8YR4l","f42d8a7ec7f7bc0c":"gi51z","435d1c2c2db41779":"h5w6J"}],"hsxXH":[function(require,module,exports) {
var NATIVE_BIND = require("f34bbcd964dc3a74");
var call = Function.prototype.call;
module.exports = NATIVE_BIND ? call.bind(call) : function() {
    return call.apply(call, arguments);
};

},{"f34bbcd964dc3a74":"gafki"}],"iz5IK":[function(require,module,exports) {
var getBuiltIn = require("683c86ca98178cec");
var isCallable = require("6182a1048221c791");
var isPrototypeOf = require("29b84c401c007e31");
var USE_SYMBOL_AS_UID = require("9f0525e4bb76c6b6");
var $Object = Object;
module.exports = USE_SYMBOL_AS_UID ? function(it) {
    return typeof it == "symbol";
} : function(it) {
    var $Symbol = getBuiltIn("Symbol");
    return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};

},{"683c86ca98178cec":"4jAHk","6182a1048221c791":"lM7TE","29b84c401c007e31":"hhXz4","9f0525e4bb76c6b6":"4vNnp"}],"4jAHk":[function(require,module,exports) {
var global = require("425c570f525a13cd");
var isCallable = require("517b9cf62c6b564d");
var aFunction = function(argument) {
    return isCallable(argument) ? argument : undefined;
};
module.exports = function(namespace, method) {
    return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};

},{"425c570f525a13cd":"2nPtN","517b9cf62c6b564d":"lM7TE"}],"hhXz4":[function(require,module,exports) {
var uncurryThis = require("623d0feda9e64366");
module.exports = uncurryThis({}.isPrototypeOf);

},{"623d0feda9e64366":"5MM5X"}],"4vNnp":[function(require,module,exports) {
/* eslint-disable es/no-symbol -- required for testing */ var NATIVE_SYMBOL = require("e6ed8d4e6e70d9d1");
module.exports = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == "symbol";

},{"e6ed8d4e6e70d9d1":"fqotW"}],"fqotW":[function(require,module,exports) {
/* eslint-disable es/no-symbol -- required for testing */ var V8_VERSION = require("e8060497b1857ebe");
var fails = require("f2e35ea050414fd9");
var global = require("42aa923b0ee1926e");
var $String = global.String;
// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function() {
    var symbol = Symbol();
    // Chrome 38 Symbol has incorrect toString conversion
    // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
    // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
    // of course, fail.
    return !$String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

},{"e8060497b1857ebe":"3bKIq","f2e35ea050414fd9":"j7GFq","42aa923b0ee1926e":"2nPtN"}],"3bKIq":[function(require,module,exports) {
var global = require("a35d5b89a53ff2a6");
var userAgent = require("1a2eaee6a616562f");
var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;
if (v8) {
    match = v8.split(".");
    // in old Chrome, versions of V8 isn't V8 = Chrome / 10
    // but their correct versions are not interesting for us
    version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}
// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
    match = userAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
        match = userAgent.match(/Chrome\/(\d+)/);
        if (match) version = +match[1];
    }
}
module.exports = version;

},{"a35d5b89a53ff2a6":"2nPtN","1a2eaee6a616562f":"k7sJ6"}],"k7sJ6":[function(require,module,exports) {
module.exports = typeof navigator != "undefined" && String(navigator.userAgent) || "";

},{}],"8YR4l":[function(require,module,exports) {
var aCallable = require("b91e0559dd041bfd");
var isNullOrUndefined = require("349f8e4b32f73699");
// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function(V, P) {
    var func = V[P];
    return isNullOrUndefined(func) ? undefined : aCallable(func);
};

},{"b91e0559dd041bfd":"9tRkr","349f8e4b32f73699":"9a1wR"}],"9tRkr":[function(require,module,exports) {
var isCallable = require("4ca1aa398cfe4a63");
var tryToString = require("13ecfd06705efa34");
var $TypeError = TypeError;
// `Assert: IsCallable(argument) is true`
module.exports = function(argument) {
    if (isCallable(argument)) return argument;
    throw $TypeError(tryToString(argument) + " is not a function");
};

},{"4ca1aa398cfe4a63":"lM7TE","13ecfd06705efa34":"4GAUc"}],"4GAUc":[function(require,module,exports) {
var $String = String;
module.exports = function(argument) {
    try {
        return $String(argument);
    } catch (error) {
        return "Object";
    }
};

},{}],"gi51z":[function(require,module,exports) {
var call = require("24fedaac67f63b4e");
var isCallable = require("638703d145bb93f6");
var isObject = require("acd9f5544af79831");
var $TypeError = TypeError;
// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function(input, pref) {
    var fn, val;
    if (pref === "string" && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
    if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
    if (pref !== "string" && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
    throw $TypeError("Can't convert object to primitive value");
};

},{"24fedaac67f63b4e":"hsxXH","638703d145bb93f6":"lM7TE","acd9f5544af79831":"9kPRS"}],"h5w6J":[function(require,module,exports) {
var global = require("ace6bbd4fdd2197c");
var shared = require("7736a72f5483b7b7");
var hasOwn = require("8e28849bc18f1157");
var uid = require("e0182833af65512e");
var NATIVE_SYMBOL = require("74f9ab538a9aa9ae");
var USE_SYMBOL_AS_UID = require("55a1777cae4478d5");
var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared("wks");
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol["for"] || Symbol : Symbol && Symbol.withoutSetter || uid;
module.exports = function(name) {
    if (!hasOwn(WellKnownSymbolsStore, name)) WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name) ? Symbol[name] : createWellKnownSymbol("Symbol." + name);
    return WellKnownSymbolsStore[name];
};

},{"ace6bbd4fdd2197c":"2nPtN","7736a72f5483b7b7":"42Mdu","8e28849bc18f1157":"3uBzP","e0182833af65512e":"hHu4m","74f9ab538a9aa9ae":"fqotW","55a1777cae4478d5":"4vNnp"}],"42Mdu":[function(require,module,exports) {
var IS_PURE = require("71d4c49ef0b2f23f");
var store = require("b4911906927dc378");
(module.exports = function(key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
})("versions", []).push({
    version: "3.30.2",
    mode: IS_PURE ? "pure" : "global",
    copyright: "\xa9 2014-2023 Denis Pushkarev (zloirock.ru)",
    license: "https://github.com/zloirock/core-js/blob/v3.30.2/LICENSE",
    source: "https://github.com/zloirock/core-js"
});

},{"71d4c49ef0b2f23f":"feJT0","b4911906927dc378":"6la10"}],"feJT0":[function(require,module,exports) {
module.exports = false;

},{}],"hHu4m":[function(require,module,exports) {
var uncurryThis = require("6fb7df7a6e03535d");
var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);
module.exports = function(key) {
    return "Symbol(" + (key === undefined ? "" : key) + ")_" + toString(++id + postfix, 36);
};

},{"6fb7df7a6e03535d":"5MM5X"}],"jYKm8":[function(require,module,exports) {
module.exports = function(bitmap, value) {
    return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value
    };
};

},{}],"4Wsr8":[function(require,module,exports) {
var shared = require("b94a8bb994eb096a");
var uid = require("1947c4b1ee7e452e");
var keys = shared("keys");
module.exports = function(key) {
    return keys[key] || (keys[key] = uid(key));
};

},{"b94a8bb994eb096a":"42Mdu","1947c4b1ee7e452e":"hHu4m"}],"WqaLh":[function(require,module,exports) {
module.exports = {};

},{}],"ahJZr":[function(require,module,exports) {
"use strict";
var anObject = require("c10fe5d72c894db4");
// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function() {
    var that = anObject(this);
    var result = "";
    if (that.hasIndices) result += "d";
    if (that.global) result += "g";
    if (that.ignoreCase) result += "i";
    if (that.multiline) result += "m";
    if (that.dotAll) result += "s";
    if (that.unicode) result += "u";
    if (that.unicodeSets) result += "v";
    if (that.sticky) result += "y";
    return result;
};

},{"c10fe5d72c894db4":"bb9bF"}],"fzd8u":[function(require,module,exports) {
"use strict";
var global = require("2c8c4425e949c756");
var call = require("1b21da0485e85ab2");
var ArrayBufferViewCore = require("a5c97b4acf2b645c");
var lengthOfArrayLike = require("824c2377a13c2e30");
var toOffset = require("fbb302bbb2d7148f");
var toIndexedObject = require("a4df00a4d9f2b");
var fails = require("e9a0b6559b776135");
var RangeError = global.RangeError;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS = !fails(function() {
    // eslint-disable-next-line es/no-typed-arrays -- required for testing
    var array = new Uint8ClampedArray(2);
    call($set, array, {
        length: 1,
        0: 3
    }, 1);
    return array[1] !== 3;
});
// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS && fails(function() {
    var array = new Int8Array(2);
    array.set(1);
    array.set("2", 1);
    return array[0] !== 0 || array[1] !== 2;
});
// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod("set", function set(arrayLike /* , offset */ ) {
    aTypedArray(this);
    var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
    var src = toIndexedObject(arrayLike);
    if (WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS) return call($set, this, src, offset);
    var length = this.length;
    var len = lengthOfArrayLike(src);
    var index = 0;
    if (len + offset > length) throw RangeError("Wrong length");
    while(index < len)this[offset + index] = src[index++];
}, !WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);

},{"2c8c4425e949c756":"2nPtN","1b21da0485e85ab2":"hsxXH","a5c97b4acf2b645c":"4aqQb","824c2377a13c2e30":"1Ddpk","fbb302bbb2d7148f":"414Yk","a4df00a4d9f2b":"5VBIn","e9a0b6559b776135":"j7GFq"}],"4aqQb":[function(require,module,exports) {
"use strict";
var NATIVE_ARRAY_BUFFER = require("792d1eba907d706f");
var DESCRIPTORS = require("1cbd022dfc03cb74");
var global = require("f0325cda1ba536ec");
var isCallable = require("2e5c15bd846b67e");
var isObject = require("5e9d10682d2128b6");
var hasOwn = require("ae897003401701ce");
var classof = require("fcaae3e044fb336e");
var tryToString = require("fd8478ca4acc6234");
var createNonEnumerableProperty = require("edf8bb985e084e7f");
var defineBuiltIn = require("d81a24efd4e74fab");
var defineBuiltInAccessor = require("910439f1d67f0bcd");
var isPrototypeOf = require("62f4b4cccfe051e2");
var getPrototypeOf = require("b5ce636b4a7ec59c");
var setPrototypeOf = require("18de9e7fd1fecd9");
var wellKnownSymbol = require("fbefe40e3f366675");
var uid = require("82dcb82f05461182");
var InternalStateModule = require("aa6c4b5e9f206bb8");
var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = global.TypeError;
var TO_STRING_TAG = wellKnownSymbol("toStringTag");
var TYPED_ARRAY_TAG = uid("TYPED_ARRAY_TAG");
var TYPED_ARRAY_CONSTRUCTOR = "TypedArrayConstructor";
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== "Opera";
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;
var TypedArrayConstructorsList = {
    Int8Array: 1,
    Uint8Array: 1,
    Uint8ClampedArray: 1,
    Int16Array: 2,
    Uint16Array: 2,
    Int32Array: 4,
    Uint32Array: 4,
    Float32Array: 4,
    Float64Array: 8
};
var BigIntArrayConstructorsList = {
    BigInt64Array: 8,
    BigUint64Array: 8
};
var isView = function isView(it) {
    if (!isObject(it)) return false;
    var klass = classof(it);
    return klass === "DataView" || hasOwn(TypedArrayConstructorsList, klass) || hasOwn(BigIntArrayConstructorsList, klass);
};
var getTypedArrayConstructor = function(it) {
    var proto = getPrototypeOf(it);
    if (!isObject(proto)) return;
    var state = getInternalState(proto);
    return state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor(proto);
};
var isTypedArray = function(it) {
    if (!isObject(it)) return false;
    var klass = classof(it);
    return hasOwn(TypedArrayConstructorsList, klass) || hasOwn(BigIntArrayConstructorsList, klass);
};
var aTypedArray = function(it) {
    if (isTypedArray(it)) return it;
    throw TypeError("Target is not a typed array");
};
var aTypedArrayConstructor = function(C) {
    if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
    throw TypeError(tryToString(C) + " is not a typed array constructor");
};
var exportTypedArrayMethod = function(KEY, property, forced, options) {
    if (!DESCRIPTORS) return;
    if (forced) for(var ARRAY in TypedArrayConstructorsList){
        var TypedArrayConstructor = global[ARRAY];
        if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
            delete TypedArrayConstructor.prototype[KEY];
        } catch (error) {
            // old WebKit bug - some methods are non-configurable
            try {
                TypedArrayConstructor.prototype[KEY] = property;
            } catch (error2) {}
        }
    }
    if (!TypedArrayPrototype[KEY] || forced) defineBuiltIn(TypedArrayPrototype, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
};
var exportTypedArrayStaticMethod = function(KEY, property, forced) {
    var ARRAY, TypedArrayConstructor;
    if (!DESCRIPTORS) return;
    if (setPrototypeOf) {
        if (forced) for(ARRAY in TypedArrayConstructorsList){
            TypedArrayConstructor = global[ARRAY];
            if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
                delete TypedArrayConstructor[KEY];
            } catch (error) {}
        }
        if (!TypedArray[KEY] || forced) // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
        try {
            return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
        } catch (error) {}
        else return;
    }
    for(ARRAY in TypedArrayConstructorsList){
        TypedArrayConstructor = global[ARRAY];
        if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) defineBuiltIn(TypedArrayConstructor, KEY, property);
    }
};
for(NAME in TypedArrayConstructorsList){
    Constructor = global[NAME];
    Prototype = Constructor && Constructor.prototype;
    if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
    else NATIVE_ARRAY_BUFFER_VIEWS = false;
}
for(NAME in BigIntArrayConstructorsList){
    Constructor = global[NAME];
    Prototype = Constructor && Constructor.prototype;
    if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}
// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
    // eslint-disable-next-line no-shadow -- safe
    TypedArray = function TypedArray() {
        throw TypeError("Incorrect invocation");
    };
    if (NATIVE_ARRAY_BUFFER_VIEWS) {
        for(NAME in TypedArrayConstructorsList)if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
    }
}
if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
    TypedArrayPrototype = TypedArray.prototype;
    if (NATIVE_ARRAY_BUFFER_VIEWS) {
        for(NAME in TypedArrayConstructorsList)if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
    }
}
// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
    TYPED_ARRAY_TAG_REQUIRED = true;
    defineBuiltInAccessor(TypedArrayPrototype, TO_STRING_TAG, {
        configurable: true,
        get: function() {
            return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
        }
    });
    for(NAME in TypedArrayConstructorsList)if (global[NAME]) createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
}
module.exports = {
    NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
    TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
    aTypedArray: aTypedArray,
    aTypedArrayConstructor: aTypedArrayConstructor,
    exportTypedArrayMethod: exportTypedArrayMethod,
    exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
    getTypedArrayConstructor: getTypedArrayConstructor,
    isView: isView,
    isTypedArray: isTypedArray,
    TypedArray: TypedArray,
    TypedArrayPrototype: TypedArrayPrototype
};

},{"792d1eba907d706f":"jjWVK","1cbd022dfc03cb74":"bVi61","f0325cda1ba536ec":"2nPtN","2e5c15bd846b67e":"lM7TE","5e9d10682d2128b6":"9kPRS","ae897003401701ce":"3uBzP","fcaae3e044fb336e":"gjYOW","fd8478ca4acc6234":"4GAUc","edf8bb985e084e7f":"jPPLX","d81a24efd4e74fab":"6OBYo","910439f1d67f0bcd":"9Yv6O","62f4b4cccfe051e2":"hhXz4","b5ce636b4a7ec59c":"gr83v","18de9e7fd1fecd9":"iBQWH","fbefe40e3f366675":"h5w6J","82dcb82f05461182":"hHu4m","aa6c4b5e9f206bb8":"5ftcE"}],"jjWVK":[function(require,module,exports) {
// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != "undefined" && typeof DataView != "undefined";

},{}],"gjYOW":[function(require,module,exports) {
var TO_STRING_TAG_SUPPORT = require("734fed3f3cdd5468");
var isCallable = require("793eecf25ece94d7");
var classofRaw = require("9b2037ed9f2dbe00");
var wellKnownSymbol = require("8daf083e8b37de22");
var TO_STRING_TAG = wellKnownSymbol("toStringTag");
var $Object = Object;
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function() {
    return arguments;
}()) == "Arguments";
// fallback for IE11 Script Access Denied error
var tryGet = function(it, key) {
    try {
        return it[key];
    } catch (error) {}
};
// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function(it) {
    var O, tag, result;
    return it === undefined ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O) : (result = classofRaw(O)) == "Object" && isCallable(O.callee) ? "Arguments" : result;
};

},{"734fed3f3cdd5468":"bMdY3","793eecf25ece94d7":"lM7TE","9b2037ed9f2dbe00":"cTc4U","8daf083e8b37de22":"h5w6J"}],"bMdY3":[function(require,module,exports) {
var wellKnownSymbol = require("e9928ffb9956e561");
var TO_STRING_TAG = wellKnownSymbol("toStringTag");
var test = {};
test[TO_STRING_TAG] = "z";
module.exports = String(test) === "[object z]";

},{"e9928ffb9956e561":"h5w6J"}],"cTc4U":[function(require,module,exports) {
var uncurryThis = require("4efd8c2181eb9bfd");
var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis("".slice);
module.exports = function(it) {
    return stringSlice(toString(it), 8, -1);
};

},{"4efd8c2181eb9bfd":"5MM5X"}],"6OBYo":[function(require,module,exports) {
var isCallable = require("d073c3aeca0ffaf2");
var definePropertyModule = require("5998ca5653c96fd");
var makeBuiltIn = require("f36bfb138a1bb915");
var defineGlobalProperty = require("75eac283f8ed4c83");
module.exports = function(O, key, value, options) {
    if (!options) options = {};
    var simple = options.enumerable;
    var name = options.name !== undefined ? options.name : key;
    if (isCallable(value)) makeBuiltIn(value, name, options);
    if (options.global) {
        if (simple) O[key] = value;
        else defineGlobalProperty(key, value);
    } else {
        try {
            if (!options.unsafe) delete O[key];
            else if (O[key]) simple = true;
        } catch (error) {}
        if (simple) O[key] = value;
        else definePropertyModule.f(O, key, {
            value: value,
            enumerable: false,
            configurable: !options.nonConfigurable,
            writable: !options.nonWritable
        });
    }
    return O;
};

},{"d073c3aeca0ffaf2":"lM7TE","5998ca5653c96fd":"jDtrp","f36bfb138a1bb915":"jTn61","75eac283f8ed4c83":"eR3Qy"}],"gr83v":[function(require,module,exports) {
var hasOwn = require("332907c808a9a59");
var isCallable = require("cfe052b031e74967");
var toObject = require("cd0dca7c06f7fcee");
var sharedKey = require("3e114efed2469484");
var CORRECT_PROTOTYPE_GETTER = require("cf1cc495beca7c03");
var IE_PROTO = sharedKey("IE_PROTO");
var $Object = Object;
var ObjectPrototype = $Object.prototype;
// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function(O) {
    var object = toObject(O);
    if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
    var constructor = object.constructor;
    if (isCallable(constructor) && object instanceof constructor) return constructor.prototype;
    return object instanceof $Object ? ObjectPrototype : null;
};

},{"332907c808a9a59":"3uBzP","cfe052b031e74967":"lM7TE","cd0dca7c06f7fcee":"5VBIn","3e114efed2469484":"4Wsr8","cf1cc495beca7c03":"71hHN"}],"71hHN":[function(require,module,exports) {
var fails = require("a0757643bc18f2b5");
module.exports = !fails(function() {
    function F() {}
    F.prototype.constructor = null;
    // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
    return Object.getPrototypeOf(new F()) !== F.prototype;
});

},{"a0757643bc18f2b5":"j7GFq"}],"iBQWH":[function(require,module,exports) {
/* eslint-disable no-proto -- safe */ var uncurryThisAccessor = require("216384f91ffc0d71");
var anObject = require("c2278c0dfa4b55bf");
var aPossiblePrototype = require("db00c3f2b3c6052f");
// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;
    try {
        setter = uncurryThisAccessor(Object.prototype, "__proto__", "set");
        setter(test, []);
        CORRECT_SETTER = test instanceof Array;
    } catch (error) {}
    return function setPrototypeOf(O, proto) {
        anObject(O);
        aPossiblePrototype(proto);
        if (CORRECT_SETTER) setter(O, proto);
        else O.__proto__ = proto;
        return O;
    };
}() : undefined);

},{"216384f91ffc0d71":"7qQeY","c2278c0dfa4b55bf":"bb9bF","db00c3f2b3c6052f":"5NfZF"}],"7qQeY":[function(require,module,exports) {
var uncurryThis = require("e2ee50cbdad573ea");
var aCallable = require("7168d63960894269");
module.exports = function(object, key, method) {
    try {
        // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
        return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
    } catch (error) {}
};

},{"e2ee50cbdad573ea":"5MM5X","7168d63960894269":"9tRkr"}],"5NfZF":[function(require,module,exports) {
var isCallable = require("6c9c13781d9b22af");
var $String = String;
var $TypeError = TypeError;
module.exports = function(argument) {
    if (typeof argument == "object" || isCallable(argument)) return argument;
    throw $TypeError("Can't set " + $String(argument) + " as a prototype");
};

},{"6c9c13781d9b22af":"lM7TE"}],"1Ddpk":[function(require,module,exports) {
var toLength = require("906a00cc31e4a007");
// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function(obj) {
    return toLength(obj.length);
};

},{"906a00cc31e4a007":"5i3uE"}],"5i3uE":[function(require,module,exports) {
var toIntegerOrInfinity = require("3decf81ad7d26de5");
var min = Math.min;
// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function(argument) {
    return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"3decf81ad7d26de5":"kFC8n"}],"kFC8n":[function(require,module,exports) {
var trunc = require("24405b3bc1fc37fb");
// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function(argument) {
    var number = +argument;
    // eslint-disable-next-line no-self-compare -- NaN check
    return number !== number || number === 0 ? 0 : trunc(number);
};

},{"24405b3bc1fc37fb":"71OfG"}],"71OfG":[function(require,module,exports) {
var ceil = Math.ceil;
var floor = Math.floor;
// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
    var n = +x;
    return (n > 0 ? floor : ceil)(n);
};

},{}],"414Yk":[function(require,module,exports) {
var toPositiveInteger = require("34c33124652c2b7f");
var $RangeError = RangeError;
module.exports = function(it, BYTES) {
    var offset = toPositiveInteger(it);
    if (offset % BYTES) throw $RangeError("Wrong offset");
    return offset;
};

},{"34c33124652c2b7f":"7quSW"}],"7quSW":[function(require,module,exports) {
var toIntegerOrInfinity = require("a81baae6cd2ac40");
var $RangeError = RangeError;
module.exports = function(it) {
    var result = toIntegerOrInfinity(it);
    if (result < 0) throw $RangeError("The argument can't be less than 0");
    return result;
};

},{"a81baae6cd2ac40":"kFC8n"}],"bmyUV":[function(require,module,exports) {
/* eslint-disable */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "login", ()=>login);
parcelHelpers.export(exports, "logout", ()=>logout);
var _alerts = require("./alerts");
const login = async (email, password)=>{
    try {
        const result = await axios({
            method: "POST",
            url: "http://localhost:3000/api/v1/users/login",
            data: {
                email,
                password
            }
        });
        if (result.data.status === "success") {
            (0, _alerts.showAlert)("success", "Logged in successfully!");
            setTimeout(()=>{
                location.assign("/");
            }, 1000);
        }
    } catch (err) {
        (0, _alerts.showAlert)("error", err.response.data.message);
    }
};
const logout = async ()=>{
    try {
        const result = await axios({
            method: "GET",
            url: "http://localhost:3000/api/v1/users/logout"
        });
        console.log(result);
        if (result.data.status === "success") {
            (0, _alerts.showAlert)("success", "Logged out successfully!");
            setTimeout(()=>{
                location.assign("/");
            }, 1000);
        }
    } catch (err) {
        console.log(err);
        (0, _alerts.showAlert)("error", "Error! Try to log out in a while...");
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"4SuGQ","./alerts":"lK4lN"}],"4SuGQ":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"lK4lN":[function(require,module,exports) {
/* eslint-disable */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "showAlert", ()=>showAlert);
const hideAlert = ()=>{
    document.querySelector(".alert").remove();
};
const showAlert = (type, msg)=>{
    document.querySelector("body").insertAdjacentHTML("afterbegin", `<div class="alert alert--${type}">${msg}</div>`);
    setTimeout(()=>{
        hideAlert();
    }, 4000);
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"4SuGQ"}],"cS1V9":[function(require,module,exports) {
/* eslint-disable */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "displayMap", ()=>displayMap);
const displayMap = (locations)=>{
    var map = L.map("map", {
        style: "mapbox://styles/mapbox/light-v10",
        zoomControl: false,
        scrollWheelZoom: false
    }).setView([
        51.5,
        -0.09
    ], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        id: "mapbox/streets-v11"
    }).addTo(map);
    var icon = L.icon({
        iconUrl: "/img/pin.png",
        iconSize: [
            32,
            40
        ],
        iconAnchor: [
            16,
            45
        ],
        popupAnchor: [
            0,
            -50
        ]
    });
    console.log(locations);
    const markers = [];
    locations.forEach((location)=>{
        const [lng, lat] = location.coordinates;
        L.marker([
            lat,
            lng
        ], {
            icon
        }).addTo(map).bindPopup(`${location.day} | ${location.description}`, {
            autoClose: false,
            className: "mapPopup"
        }).openPopup();
        markers.push([
            lat,
            lng
        ]);
    });
    const bounds = new L.LatLngBounds(markers).pad(0.7);
    map.fitBounds(bounds);
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"4SuGQ"}],"7QBDR":[function(require,module,exports) {
/* eslint-disable  */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "updateSettings", ()=>updateSettings);
parcelHelpers.export(exports, "forgotPassword", ()=>forgotPassword);
var _alerts = require("./alerts");
const updateSettings = async (data, type)=>{
    //type = update-password, reset-password
    try {
        const url = type === "update-password" ? "http://localhost:3000/api/v1/users/updatePassword" : "http://localhost:3000/api/v1/users/updateMe";
        const result = await axios({
            method: "PATCH",
            url,
            data
        });
        if (result.data.status === "success") {
            (0, _alerts.showAlert)("success", "Settings saved successfully!");
            setTimeout(()=>{
                location.reload(true);
            }, 1000);
        }
    } catch (err) {
        console.log(err);
        (0, _alerts.showAlert)("error", "Something went wrong");
    }
};
const forgotPassword = async (email)=>{
    try {
        const result = await axios({
            method: "POST",
            url: "http://localhost:3000/api/v1/users/forgotPassword",
            data: {
                email
            }
        });
        if (result.data.status === "success") {
            (0, _alerts.showAlert)("success", "Your password reset token sent successfully! Check your email.");
            setTimeout(()=>{
                location.reload(true);
            }, 1000);
        }
    } catch (err) {
        (0, _alerts.showAlert)("error", "Something went wrong");
    }
};

},{"./alerts":"lK4lN","@parcel/transformer-js/src/esmodule-helpers.js":"4SuGQ"}],"3u4xF":[function(require,module,exports) {
/* eslint-disable */ var _alerts = require("./alerts");
const stripe = Stripe("pk_test_51N6HIVDk98Av3NqoQ96WSALP7U5WhUpyL4KL2hXdGOjdOiZ5zZcH3mZ9oHl4zxXorShqgCUEYYBGZEK2JhP5Jggj00rX8x2LMi");
exports.bookTour = async (id)=>{
    try {
        const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${id}`);
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        (0, _alerts.showAlert)("error", err.response.data.message);
    }
};

},{"./alerts":"lK4lN"}]},["37pvV"], "37pvV", "parcelRequire11c7")

//# sourceMappingURL=index.js.map
