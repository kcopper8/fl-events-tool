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
})({"traverse.js":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var widthObjectPath = function widthObjectPath(obj, callback, objectPath) {
  if (objectPath && obj) {
    callback(obj, objectPath);
  }

  if (obj && _typeof(obj) === 'object') {
    for (var key in obj) {
      var nextLevelKey = key;

      if (objectPath) {
        nextLevelKey = [objectPath, key].join('.');
      }

      widthObjectPath(obj[key], callback, nextLevelKey);
    }
  }
};

exports.widthObjectPath = widthObjectPath;
},{}],"node_modules/object-path/index.js":[function(require,module,exports) {
var define;
(function (root, factory) {
  'use strict';
  /*istanbul ignore next:cant test*/

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.objectPath = factory();
  }
})(this, function () {
  'use strict';

  var toStr = Object.prototype.toString;

  function hasOwnProperty(obj, prop) {
    if (obj == null) {
      return false;
    } //to handle objects with null prototypes (too edge case?)


    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  function isEmpty(value) {
    if (!value) {
      return true;
    }

    if (isArray(value) && value.length === 0) {
      return true;
    } else if (typeof value !== 'string') {
      for (var i in value) {
        if (hasOwnProperty(value, i)) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  function toString(type) {
    return toStr.call(type);
  }

  function isObject(obj) {
    return typeof obj === 'object' && toString(obj) === "[object Object]";
  }

  var isArray = Array.isArray || function (obj) {
    /*istanbul ignore next:cant test*/
    return toStr.call(obj) === '[object Array]';
  };

  function isBoolean(obj) {
    return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
  }

  function getKey(key) {
    var intKey = parseInt(key);

    if (intKey.toString() === key) {
      return intKey;
    }

    return key;
  }

  function factory(options) {
    options = options || {};

    var objectPath = function (obj) {
      return Object.keys(objectPath).reduce(function (proxy, prop) {
        if (prop === 'create') {
          return proxy;
        }
        /*istanbul ignore else*/


        if (typeof objectPath[prop] === 'function') {
          proxy[prop] = objectPath[prop].bind(objectPath, obj);
        }

        return proxy;
      }, {});
    };

    function hasShallowProperty(obj, prop) {
      return options.includeInheritedProps || typeof prop === 'number' && Array.isArray(obj) || hasOwnProperty(obj, prop);
    }

    function getShallowProperty(obj, prop) {
      if (hasShallowProperty(obj, prop)) {
        return obj[prop];
      }
    }

    function set(obj, path, value, doNotReplace) {
      if (typeof path === 'number') {
        path = [path];
      }

      if (!path || path.length === 0) {
        return obj;
      }

      if (typeof path === 'string') {
        return set(obj, path.split('.').map(getKey), value, doNotReplace);
      }

      var currentPath = path[0];
      var currentValue = getShallowProperty(obj, currentPath);

      if (path.length === 1) {
        if (currentValue === void 0 || !doNotReplace) {
          obj[currentPath] = value;
        }

        return currentValue;
      }

      if (currentValue === void 0) {
        //check if we assume an array
        if (typeof path[1] === 'number') {
          obj[currentPath] = [];
        } else {
          obj[currentPath] = {};
        }
      }

      return set(obj[currentPath], path.slice(1), value, doNotReplace);
    }

    objectPath.has = function (obj, path) {
      if (typeof path === 'number') {
        path = [path];
      } else if (typeof path === 'string') {
        path = path.split('.');
      }

      if (!path || path.length === 0) {
        return !!obj;
      }

      for (var i = 0; i < path.length; i++) {
        var j = getKey(path[i]);

        if (typeof j === 'number' && isArray(obj) && j < obj.length || (options.includeInheritedProps ? j in Object(obj) : hasOwnProperty(obj, j))) {
          obj = obj[j];
        } else {
          return false;
        }
      }

      return true;
    };

    objectPath.ensureExists = function (obj, path, value) {
      return set(obj, path, value, true);
    };

    objectPath.set = function (obj, path, value, doNotReplace) {
      return set(obj, path, value, doNotReplace);
    };

    objectPath.insert = function (obj, path, value, at) {
      var arr = objectPath.get(obj, path);
      at = ~~at;

      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }

      arr.splice(at, 0, value);
    };

    objectPath.empty = function (obj, path) {
      if (isEmpty(path)) {
        return void 0;
      }

      if (obj == null) {
        return void 0;
      }

      var value, i;

      if (!(value = objectPath.get(obj, path))) {
        return void 0;
      }

      if (typeof value === 'string') {
        return objectPath.set(obj, path, '');
      } else if (isBoolean(value)) {
        return objectPath.set(obj, path, false);
      } else if (typeof value === 'number') {
        return objectPath.set(obj, path, 0);
      } else if (isArray(value)) {
        value.length = 0;
      } else if (isObject(value)) {
        for (i in value) {
          if (hasShallowProperty(value, i)) {
            delete value[i];
          }
        }
      } else {
        return objectPath.set(obj, path, null);
      }
    };

    objectPath.push = function (obj, path
    /*, values */
    ) {
      var arr = objectPath.get(obj, path);

      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }

      arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
    };

    objectPath.coalesce = function (obj, paths, defaultValue) {
      var value;

      for (var i = 0, len = paths.length; i < len; i++) {
        if ((value = objectPath.get(obj, paths[i])) !== void 0) {
          return value;
        }
      }

      return defaultValue;
    };

    objectPath.get = function (obj, path, defaultValue) {
      if (typeof path === 'number') {
        path = [path];
      }

      if (!path || path.length === 0) {
        return obj;
      }

      if (obj == null) {
        return defaultValue;
      }

      if (typeof path === 'string') {
        return objectPath.get(obj, path.split('.'), defaultValue);
      }

      var currentPath = getKey(path[0]);
      var nextObj = getShallowProperty(obj, currentPath);

      if (nextObj === void 0) {
        return defaultValue;
      }

      if (path.length === 1) {
        return nextObj;
      }

      return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
    };

    objectPath.del = function del(obj, path) {
      if (typeof path === 'number') {
        path = [path];
      }

      if (obj == null) {
        return obj;
      }

      if (isEmpty(path)) {
        return obj;
      }

      if (typeof path === 'string') {
        return objectPath.del(obj, path.split('.'));
      }

      var currentPath = getKey(path[0]);

      if (!hasShallowProperty(obj, currentPath)) {
        return obj;
      }

      if (path.length === 1) {
        if (isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      } else {
        return objectPath.del(obj[currentPath], path.slice(1));
      }

      return obj;
    };

    return objectPath;
  }

  var mod = factory();
  mod.create = factory;
  mod.withInheritedProps = factory({
    includeInheritedProps: true
  });
  return mod;
});
},{}],"keepingLevelTool.js":[function(require,module,exports) {
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var traverse = require('./traverse');

var objectPath = require('object-path');

function makeSameBaseCollection(obj) {
  if (obj && _typeof(obj) === 'object') {
    if (obj instanceof Array) {
      return [];
    } else {
      return {};
    }
  }

  return undefined;
}

function isEmptyCollection(obj) {
  return !obj || obj.length === 0 || Object.keys(obj).length === 0;
}

var targetProperties = ['Description', 'Teaser', 'Name', 'Id', 'ButtonText'];

exports.extractText = function extractText(obj) {
  if (obj && _typeof(obj) === 'object') {
    var newCurrent = makeSameBaseCollection(obj);

    for (var key in obj) {
      var child = extractText(obj[key]);

      if (child) {
        newCurrent[key] = child;
      }
    }

    if (obj.Id && obj.Description) {
      targetProperties.forEach(function (property) {
        newCurrent[property] = obj[property];
      });
    }

    if (isEmptyCollection(newCurrent)) {
      return undefined;
    }

    return newCurrent;
  }
};

exports.mergeText = function (original, toMerge) {
  var result = JSON.parse(JSON.stringify(original));
  traverse.widthObjectPath(toMerge, function (obj, path) {
    if (_typeof(obj) != 'object') {
      objectPath.set(result, path, obj);
    }
  });
  return result;
};
},{"./traverse":"traverse.js","object-path":"node_modules/object-path/index.js"}],"extractTextForTranslate.js":[function(require,module,exports) {
var traverse = require('./traverse');

module.exports = function extractTextForTranslate(events) {
  var targetProperties = ['Description', 'Teaser', 'Name'];
  var result = {};

  var callback = function callback(obj, objectPath) {
    if (obj.Id) {
      targetProperties.forEach(function (property) {
        if (obj[property]) {
          var address = [obj.Id, objectPath, property].join('-');

          if (result[address]) {
            throw new Error('Same Address, must be invalid events.json');
          }

          result[address] = obj[property];
        }
      });
    }
  };

  traverse.widthObjectPath(events, callback);
  return result;
};
},{"./traverse":"traverse.js"}],"validateEvents.js":[function(require,module,exports) {
var extractTextForTranslate = require('./extractTextForTranslate');

exports.isValidEvents = function (events) {
  // 874 개의 array
  if (!(events instanceof Array)) {
    return 'not_array';
  }

  if (events.length != 874) {
    return 'invalid_length';
  }

  var extracted = extractTextForTranslate(events);

  if (Object.keys(extracted).length != 26723) {
    return 'invalid_depth';
  }
};
},{"./extractTextForTranslate":"extractTextForTranslate.js"}],"index.js":[function(require,module,exports) {
var keepingLevelTool = require("./keepingLevelTool");

var validateEvents = require("./validateEvents");

var beforeUrl;

function startDownload(linkEl, filename, content) {
  var blob = new Blob([content], {
    type: 'application/json'
  });

  if (beforeUrl) {
    URL.revokeObjectURL(beforeUrl);
    beforeUrl = undefined;
  }

  beforeUrl = URL.createObjectURL(blob);
  linkEl.href = beforeUrl;
  linkEl.download = filename;
  linkEl.click();
}

function initExtractor() {
  var sourceSelector = '#source';
  var downloadSelector = '#download';
  var file = document.querySelector(sourceSelector);

  file.onchange = function () {
    var fileList = file.files;

    if (fileList.length < 1) {
      console.log('no file');
      return;
    } // 읽기


    var reader = new FileReader();
    reader.readAsText(fileList[0]); //로드 한 후

    reader.onload = function () {
      var linkEl = document.querySelector(downloadSelector);
      var sourceJSON = JSON.parse(reader.result);

      if (validateEvents.isValidEvents(sourceJSON)) {
        var ret = confirm('업로드한 파일이 원본 events.json 파일과 데이터 갯수가 다릅니다. 추출을 계속하시겠습니까?');

        if (!ret) {
          file.value = '';
          return;
        }
      }

      var extracted = keepingLevelTool.extractText(sourceJSON);
      startDownload(linkEl, "new_events_" + Date.now() + ".json", JSON.stringify(extracted, undefined, 4));
      file.value = '';
    };
  };
}

initExtractor();

function initMerger() {
  var sourceSelector = '#merge_source';
  var translatedSelector = '#merge_translated';
  var downloadSelector = '#merge_download';
  var sourceFileObj = undefined;
  var translatedFileObj = undefined;
  var sourceFile = document.querySelector(sourceSelector);
  var translatedFile = document.querySelector(translatedSelector);

  function mergeTwoFile() {
    if (!sourceFileObj || !translatedFileObj) {
      console.log('not yet', sourceFileObj, translatedFileObj);
      return;
    }

    var resultObj = keepingLevelTool.mergeText(sourceFileObj, translatedFileObj);

    if (validateEvents.isValidEvents(resultObj)) {
      var ret = confirm('병합 결과 파일이 원본 events.json 파일과 데이터 갯수가 다릅니다. 번역본 파일의 형식이 변경되었을 가능성이 있습니다. 병합한 파일을 다운로드하시겠습니까?');

      if (!ret) {
        sourceFileObj = undefined;
        sourceFile.value = '';
        translatedFileObj = undefined;
        translatedFile.value = '';
        return;
      }
    }

    var linkEl = document.querySelector(downloadSelector);
    startDownload(linkEl, "merged_events_" + Date.now() + ".json", JSON.stringify(resultObj, undefined, 4));
    sourceFileObj = undefined;
    sourceFile.value = '';
    translatedFileObj = undefined;
    translatedFile.value = '';
  }

  sourceFile.onchange = function () {
    var fileList = sourceFile.files;

    if (fileList.length < 1) {
      console.log('no file');
      return;
    } // 읽기


    var reader = new FileReader();
    reader.readAsText(fileList[0]);

    reader.onload = function () {
      sourceFileObj = JSON.parse(reader.result);

      if (validateEvents.isValidEvents(sourceFileObj)) {
        var ret = confirm('업로드한 파일이 원본 events.json 파일과 데이터 갯수가 다릅니다. 병합을 계속하시겠습니까?');

        if (!ret) {
          sourceFileObj = undefined;
          sourceFile.value = '';
          return;
        }
      }

      mergeTwoFile();
    };
  };

  translatedFile.onchange = function () {
    var fileList = translatedFile.files;

    if (fileList.length < 1) {
      console.log('no file');
      return;
    } // 읽기


    var reader = new FileReader();
    reader.readAsText(fileList[0]);

    reader.onload = function () {
      translatedFileObj = JSON.parse(reader.result);
      mergeTwoFile();
    };
  };
}

initMerger();
},{"./keepingLevelTool":"keepingLevelTool.js","./validateEvents":"validateEvents.js"}],"../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "9589" + '/');

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
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
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
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
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
},{}]},{},["../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/fl-events.e31bb0bc.js.map