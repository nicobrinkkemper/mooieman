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
})({"graphql/schema.ts":[function(require,module,exports) {
"use strict";

var __makeTemplateObject = this && this.__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var apollo_server_express_1 = require("apollo-server-express");

var schema = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Query {\n    \"A simple type for getting started!\"\n    hello: String\n    \n    \"Get a mooieman\"\n    mooieman: String\n\n    \"Get a fraaievrouw\"\n    fraaievrouw: String\n\n    \"Get the amount of mooiemannen or fraaievrouwen\"\n    count: String\n\n    \"Get all the files of type mooieman or fraaievrouw\"\n    files: String\n    \n  }\n"], ["\n  type Query {\n    \"A simple type for getting started!\"\n    hello: String\n    \n    \"Get a mooieman\"\n    mooieman: String\n\n    \"Get a fraaievrouw\"\n    fraaievrouw: String\n\n    \"Get the amount of mooiemannen or fraaievrouwen\"\n    count: String\n\n    \"Get all the files of type mooieman or fraaievrouw\"\n    files: String\n    \n  }\n"])));
exports.default = schema;
var templateObject_1;
},{}],"graphql/resolvers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var resolverFunctions = function (_a) {
  var fileService = _a.fileService;
  return {
    Query: {
      hello: function () {
        return 'world';
      },
      mooieman: function () {
        return 'mooieman';
      },
      fraaievrouw: function () {
        return 'fraaievrouw';
      },
      count: function () {
        return 'count';
      },
      files: function () {
        return fileService.getFiles();
      }
    }
  };
};

exports.default = resolverFunctions;
},{}],"graphql/server.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var express = require("express");

var apollo_server_express_1 = require("apollo-server-express");

var schema_1 = __importDefault(require("./schema"));

var resolvers_1 = __importDefault(require("./resolvers"));

function gqlServer(dependencies) {
  if (dependencies === void 0) {
    dependencies = {};
  }

  var app = express();
  var apolloServer = new apollo_server_express_1.ApolloServer({
    typeDefs: schema_1.default,
    resolvers: resolvers_1.default(dependencies),
    // Enable graphiql gui
    introspection: true,
    playground: true
  });
  apolloServer.applyMiddleware({
    app: app,
    path: '/',
    cors: true
  });
  return app;
}

exports.default = gqlServer;
},{"./schema":"graphql/schema.ts","./resolvers":"graphql/resolvers.ts"}],"tools/type-checks.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.typeOf = function (val) {
  return Object.prototype.toString.call(val);
};

exports.typeError = function (name, fallbackType, valType, msg) {
  return new TypeError("" + (msg ? "\n(" + msg + ")" : '') + name + " should be of type " + fallbackType + ", but is: " + valType);
};

exports.typeCHeck = function (obj) {
  return function (name, fallback) {
    if (!obj.hasOwnProperty(name)) return fallback;else if (!obj[name]) return undefined; // allow the disabling of some features by explicitly setting it to some falsey value

    throw exports.typeError(name, exports.typeOf(fallback) + " or falsey", exports.typeOf(obj[name]));
  };
}; // loose properties may be set to a falsey value to disable a specific feature, but must not differ in type otherwise


exports.typeCheckFalsey = function (obj) {
  return function (name, fallback) {
    if (!obj.hasOwnProperty(name)) return fallback;else if (!obj[name]) return undefined; // allow the disabling of some features by explicitly setting it to some falsey value

    throw exports.typeError(name, exports.typeOf(fallback) + " or falsey", exports.typeOf(obj[name]));
  };
}; // strict properties may be set, but must share the type with the fallback property.


exports.typeCheckStrict = function (obj) {
  return function (name, fallback) {
    if (obj.hasOwnProperty(name)) {
      if (exports.typeOf(fallback) === exports.typeOf(obj[name])) return obj[name]; // this value will do
      else throw exports.typeError(name, exports.typeOf(fallback), exports.typeOf(obj[name]));
    }

    return fallback;
  };
}; // required properties must share it's type with the fallback property and must always be set


exports.typeCheckRequire = function (obj) {
  return function (name, fallback) {
    if (obj.hasOwnProperty(name)) if (exports.typeOf(fallback) === exports.typeOf(obj[name])) return obj[name]; // this value will do

    throw exports.typeError(name, exports.typeOf(fallback), exports.typeOf(obj[name]));
  };
};
},{}],"functional-firebase-admin/core/image.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var type_checks_1 = require("~tools/type-checks");

var ramda_1 = require("ramda");

var io_ts_1 = require("io-ts");

var Version = io_ts_1.type({
  md5: io_ts_1.string,
  fileName: io_ts_1.string,
  filePath: io_ts_1.string,
  fileMime: io_ts_1.string,
  ext: io_ts_1.string,
  width: io_ts_1.number,
  height: io_ts_1.number,
  upload: io_ts_1.object
});

var validateVersion = function (mode) {
  if (mode === void 0) {
    mode = type_checks_1.typeCheckRequire;
  }

  return function (data) {
    var strictness = mode(data);
    strictness('md5', '');
    strictness('fileName', '');
    strictness('filePath', '');
    strictness('fileMime', '');
    strictness('ext', '');
    return data;
  };
};

var validateImage = function (mode) {
  if (mode === void 0) {
    mode = type_checks_1.typeCheckRequire;
  }

  var ver = validateVersion(mode);
  return function (data) {
    ver(data);
    var strictness = mode(data);
    strictness('originalFileName', '');
    strictness('originalFilePath', '');
    strictness('originalFileMime', '');
    return data;
  };
};

var validateCreateImage = validateImage();
var validatePartialImage = validateImage(type_checks_1.typeCheckStrict);
var validateCreateVersion = validateVersion();
var validatePartialVersion = validateVersion(type_checks_1.typeCheckStrict);
var pipeWhileNotNil = ramda_1.pipeWith(function (f, res) {
  return ramda_1.isNil(res) ? res : f(res);
});

var handleStream = function (bucket) {
  return function (image) {
    return __awaiter(void 0, void 0, Promise, function () {
      var writeStream, upload, restImage;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            writeStream = bucket(image.filePath).createWriteStream({
              contentType: image.fileMime
            });
            upload = image.upload, restImage = __rest(image, ["upload"]);
            if (Buffer.isBuffer(upload)) writeStream.end(upload);else if (typeof upload.read === 'function') writeStream.pipe(upload);else throw new TypeError('no upload');
            return [4
            /*yield*/
            , new Promise(function (resolve, reject) {
              writeStream.on('finish', resolve);
              writeStream.on('error', reject);
              writeStream.on('info', function (info) {
                console.log('info', Object.keys(info));
                if (info.width) image.width = info.width;
                if (info.height) image.height = info.height;
              });
            })];

          case 1:
            _a.sent();

            return [2
            /*return*/
            , restImage];
        }
      });
    });
  };
};

exports.getCount = function (bucket) {
  return function (crud) {
    return function (data) {
      return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;

        return __generator(this, function (_c) {
          switch (_c.label) {
            case 0:
              _a = [__assign({}, data)];
              _b = {};
              return [4
              /*yield*/
              , crud.getCount()];

            case 1:
              return [2
              /*return*/
              , __assign.apply(void 0, _a.concat([(_b.number = _c.sent(), _b)]))];
          }
        });
      });
    };
  };
};

exports.create = function (bucket) {
  return function (crud) {
    return ramda_1.pipe(exports.getCount(bucket)(crud), ramda_1.then(ramda_1.pipe(validateCreateImage, handleStream(bucket), crud.create)));
  };
};

exports.createVersion = function (bucket) {
  return function (crud) {
    return ramda_1.pipe(validateCreateVersion, handleStream(bucket));
  };
};

exports.read = function (bucket) {
  return function (crud) {
    return pipeWhileNotNil([crud.read, ramda_1.then(ramda_1.pipe(validatePartialImage, function (image) {
      return __assign({
        file: bucket(image.type + "/" + image.type + image.number + "." + (image.ext || 'webp'))
      }, image);
    }))]);
  };
};

exports.update = function (bucket) {
  return function (crud) {
    return ramda_1.pipe(validatePartialImage, crud.update);
  };
};

var remove = function (bucket) {
  return function (crud) {
    return crud.delete;
  };
};

exports.delete = remove;
exports.default = exports.read;
},{"~tools/type-checks":"tools/type-checks.ts"}],"functional-firebase-admin/core/crud.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var firestore_1 = require("@google-cloud/firestore");

var ramda_1 = require("ramda");

exports.getCount = function (Stats) {
  return function (Doc) {
    return ramda_1.pipe(Stats(Doc.parent.id).get, ramda_1.then(function (v) {
      return Number(v.get('count'));
    }));
  };
};

var addCreatedTimestamp = function (data) {
  return __assign(__assign({}, data), {
    created: firestore_1.Timestamp.now()
  });
};

exports.create = function (Stats) {
  return function (Doc) {
    return ramda_1.pipe(addCreatedTimestamp, Doc.create, ramda_1.then(function (WriteResult) {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4
              /*yield*/
              , Stats(Doc.parent.id).incrementField('count', 1)];

            case 1:
              _a.sent();

              return [2
              /*return*/
              , WriteResult];
          }
        });
      });
    }));
  };
};

exports.read = function (_) {
  return function (Doc) {
    return ramda_1.pipe(Doc.get, ramda_1.then(function (v) {
      return v.data();
    }));
  };
};

var addUpdatedimestamp = function (data) {
  return __assign(__assign({}, data), {
    updated: firestore_1.Timestamp.now()
  });
};

exports.update = function (_) {
  return function (Doc) {
    return ramda_1.pipe(addUpdatedimestamp, function (data) {
      return Doc.update(data);
    });
  };
};

var remove = function (Stats) {
  return function (Doc) {
    return ramda_1.pipe(Doc.delete, ramda_1.then(function (WriteResult) {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4
              /*yield*/
              , Stats(Doc.parent.id).incrementField('count', -1)];

            case 1:
              _a.sent();

              return [2
              /*return*/
              , WriteResult];
          }
        });
      });
    }));
  };
};

exports.delete = remove;

var subDoc = function (Doc) {
  return function (documentPath, collectionPath) {
    return Doc(collectionPath)(documentPath);
  };
};

exports.newCrud = function (Stats) {
  return function (Doc) {
    return {
      getCount: exports.getCount(Stats)(Doc),
      create: exports.create(Stats)(Doc),
      delete: remove(Stats)(Doc),
      update: exports.update(Stats)(Doc),
      read: exports.read(Stats)(Doc),
      sub: exports.sub(Stats)(Doc)
    };
  };
};

exports.sub = function (Stats) {
  return function (Doc) {
    return ramda_1.pipe(subDoc(Doc), exports.newCrud(Stats));
  };
};

exports.default = exports.read;
},{}],"functional-firebase-admin/core/firestore/doc.ts":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.get = function (doc) {
  return function () {
    return doc.get();
  };
};

exports.set = function (doc) {
  return function (data, options) {
    return doc.set(data, options);
  };
};

exports.create = function (doc) {
  return function (data) {
    return doc.create(data);
  };
};

function _update(doc) {
  return function (field, value) {
    var moreFieldsOrPrecondition = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      moreFieldsOrPrecondition[_i - 2] = arguments[_i];
    }

    if (!value) return doc.update(field);
    if (!moreFieldsOrPrecondition.length) return doc.update(field, value);
    if (typeof field === 'string') return doc.update.apply(doc, __spreadArrays([field, value], moreFieldsOrPrecondition));
    return doc.update(field, value);
  };
}

exports.update = _update;

var remove = function (doc) {
  return function (precondition) {
    return doc.delete(precondition);
  };
};

exports.delete = remove;

exports.collection = function (doc) {
  return function (collectionPath) {
    return doc.collection(collectionPath);
  };
};

exports.listCollections = function (doc) {
  return function () {
    return doc.listCollections();
  };
};

exports.isEqual = function (doc) {
  return function (other) {
    return doc.isEqual(other);
  };
};

exports.onSnapshot = function (doc) {
  return function (onNext, onError) {
    return doc.onSnapshot(onNext, onError);
  };
};

exports.id = function (doc) {
  return doc.id;
};

exports.firestore = function (doc) {
  return doc.firestore;
};

exports.parent = function (doc) {
  return doc.parent;
};

exports.path = function (doc) {
  return doc.path;
};

exports.default = exports.collection;
},{}],"functional-firebase-admin/core/firestore/collection.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.doc = function (collection) {
  return function (documentPath) {
    if (documentPath) return collection.doc(documentPath);
    return collection.doc();
  };
};

exports.add = function (collection) {
  return function (data) {
    return collection.add(data);
  };
}; // we force a string for documentPath


exports.where = function (collection) {
  return function (fieldPath, opStr, value) {
    return collection.where(fieldPath, opStr, value);
  };
};

exports.select = function (collection) {
  return function () {
    var field = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      field[_i] = arguments[_i];
    }

    return collection.select.apply(collection, field);
  };
};

exports.offset = function (collection) {
  return function (offset) {
    return collection.offset(offset);
  };
};

exports.limit = function (collection) {
  return function (limit) {
    return collection.limit(limit);
  };
};

exports.startAt = function (collection) {
  return function () {
    var fieldValues = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      fieldValues[_i] = arguments[_i];
    }

    return collection.startAt.apply(collection, fieldValues);
  };
};

exports.startAfter = function (collection) {
  return function () {
    var fieldValues = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      fieldValues[_i] = arguments[_i];
    }

    return collection.startAfter.apply(collection, fieldValues);
  };
};

exports.endAt = function (collection) {
  return function () {
    var fieldValues = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      fieldValues[_i] = arguments[_i];
    }

    return collection.endAt.apply(collection, fieldValues);
  };
};

exports.endBefore = function (collection) {
  return function () {
    var fieldValues = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      fieldValues[_i] = arguments[_i];
    }

    return collection.endBefore.apply(collection, fieldValues);
  };
};

exports.onSnapshot = function (collection) {
  return function (onNext, onError) {
    return collection.onSnapshot(onNext, onError);
  };
};

exports.isEqual = function (collection) {
  return function (other) {
    return collection.isEqual(other);
  };
};

exports.orderBy = function (collection) {
  return function (fieldPath, directionStr) {
    return collection.orderBy(fieldPath, directionStr);
  };
};

exports.stream = function (collection) {
  return function () {
    return collection.stream();
  };
};

exports.get = function (collection) {
  return function () {
    return collection.get();
  };
};

exports.listDocuments = function (collection) {
  return function () {
    return collection.listDocuments();
  };
};

exports.id = function (collection) {
  return collection.id;
};

exports.parent = function (collection) {
  return collection.parent;
};

exports.path = function (collection) {
  return collection.path;
};

exports.firestore = function (collection) {
  return collection.firestore;
};

exports.default = exports.doc;
},{}],"functional-firebase-admin/core/firestore/snapshot.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.data = function (snapshot) {
  return function () {
    return snapshot.data();
  };
};

exports.get = function (snapshot) {
  return function (fieldPath) {
    return snapshot.get(fieldPath);
  };
};

exports.isEqual = function (snapshot) {
  return function (other) {
    return snapshot.isEqual(other);
  };
};

exports.exists = function (snapshot) {
  return snapshot.exists;
};

exports.updateTime = function (snapshot) {
  return snapshot.updateTime;
};

exports.readTime = function (snapshot) {
  return snapshot.readTime;
};

exports.createTime = function (snapshot) {
  return snapshot.createTime;
};

exports.id = function (snapshot) {
  return snapshot.id;
};

exports.ref = function (snapshot) {
  return snapshot.ref;
};

exports.default = exports.data;
},{}],"functional-firebase-admin/core/firestore/firestore.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.collection = function (firestore) {
  return function (collectionPath) {
    return firestore.collection(collectionPath);
  };
};

exports.settings = function (firestore) {
  return function (settings) {
    return firestore.settings(settings);
  };
};

exports.doc = function (firestore) {
  return function (documentPath) {
    return firestore.doc(documentPath);
  };
};

exports.collectionGroup = function (firestore) {
  return function (collectionId) {
    return firestore.collectionGroup(collectionId);
  };
};

exports.getAll = function (firestore) {
  return function () {
    var documentRefsOrReadOptions = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      documentRefsOrReadOptions[_i] = arguments[_i];
    }

    return firestore.getAll.apply(firestore, documentRefsOrReadOptions);
  };
};

exports.listCollections = function (firestore) {
  return function () {
    return firestore.listCollections();
  };
};

exports.runTransaction = function (firestore) {
  return function (updateFunction, transactionOptions) {
    return firestore.runTransaction(updateFunction, transactionOptions);
  };
};

exports.batch = function (firestore) {
  return function () {
    return firestore.batch();
  };
};

exports.default = exports.collection;
},{}],"functional-firebase-admin/core/attachToDefault.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function attachToDefault(spec) {
  return Object.assign(spec.default, spec);
}

exports.attachToDefault = attachToDefault;
exports.default = attachToDefault;
},{}],"functional-firebase-admin/core/firestore/index.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var doc = __importStar(require("./doc"));

exports.doc = doc;

var collection = __importStar(require("./collection"));

exports.collection = collection;

var snapshot = __importStar(require("./snapshot"));

exports.snapshot = snapshot;

var firestore = __importStar(require("./firestore"));

exports.firestore = firestore;

var ramda_1 = require("ramda");

var attachToDefault_1 = __importDefault(require("../attachToDefault"));

exports.Snapshot = ramda_1.pipe(ramda_1.applySpec(snapshot), attachToDefault_1.default);
exports.Doc = ramda_1.pipe(ramda_1.applySpec(doc), function (spec) {
  return __assign(__assign({}, spec), {
    default: ramda_1.pipe(spec.default, exports.Collection)
  });
}, attachToDefault_1.default);
exports.Collection = ramda_1.pipe(ramda_1.applySpec(collection), function (spec) {
  return __assign(__assign({}, spec), {
    default: ramda_1.pipe(spec.default, exports.Doc)
  });
}, attachToDefault_1.default);
exports.Firestore = ramda_1.pipe(ramda_1.applySpec(firestore), function (spec) {
  return __assign(__assign({}, spec), {
    default: ramda_1.pipe(spec.default, exports.Collection)
  });
}, attachToDefault_1.default);
exports.default = exports.Firestore;
},{"./doc":"functional-firebase-admin/core/firestore/doc.ts","./collection":"functional-firebase-admin/core/firestore/collection.ts","./snapshot":"functional-firebase-admin/core/firestore/snapshot.ts","./firestore":"functional-firebase-admin/core/firestore/firestore.ts","../attachToDefault":"functional-firebase-admin/core/attachToDefault.ts"}],"functional-firebase-admin/core/storage/service-object.ts":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _create(serviceObject) {
  return function (options, callback) {
    if (!options) return serviceObject.create();
    if (!callback) return serviceObject.create(options);
    return serviceObject.create(options, callback);
  };
}

exports._create = _create;

function _request(serviceObject) {
  return function (reqOpts, callback) {
    if (!callback) return serviceObject.request(reqOpts);
    return serviceObject.request(reqOpts, callback);
  };
}

exports._request = _request;

function _delete(serviceObject) {
  return function (options, callback) {
    if (!callback) return serviceObject.delete(callback);
    return serviceObject.delete(options, callback);
  };
}

exports._delete = _delete;

function _exists(serviceObject) {
  return function (options, callback) {
    if (!callback) return serviceObject.exists(options);
    return serviceObject.exists(options, callback);
  };
}

exports._exists = _exists;

function _get(serviceObject) {
  return function (options, callback) {
    if (!callback) return serviceObject.get(options);
    return serviceObject.get(options, callback);
  };
}

exports._get = _get;

function _getMetadata(serviceObject) {
  return function (options, callback) {
    if (!callback) return serviceObject.getMetadata(options);
    return serviceObject.getMetadata(options, callback);
  };
}

exports._getMetadata = _getMetadata;

function _setMetadata(serviceObject) {
  return function (metadata, options, callback) {
    if (!options) return serviceObject.setMetadata(metadata);
    if (!callback) return serviceObject.setMetadata(metadata, options);
    return serviceObject.setMetadata(metadata, options, callback);
  };
}

exports._setMetadata = _setMetadata;

exports._metadata = function (serviceObject) {
  return serviceObject.metadata;
};

exports._baseUrl = function (serviceObject) {
  return serviceObject.baseUrl;
};

exports._parent = function (serviceObject) {
  return serviceObject.parent;
};

exports._id = function (serviceObject) {
  return serviceObject.id;
};

exports._requestStream = function (serviceObject) {
  return function (reqOpts) {
    return serviceObject.requestStream(reqOpts);
  };
};

exports._addListener = function (serviceObject) {
  return function (event, listener) {
    return serviceObject.addListener(event, listener);
  };
};

exports._on = function (serviceObject) {
  return function (event, listener) {
    return serviceObject.on(event, listener);
  };
};

exports._once = function (serviceObject) {
  return function (event, listener) {
    return serviceObject.once(event, listener);
  };
};

exports._prependListener = function (serviceObject) {
  return function (event, listener) {
    return serviceObject.prependListener(event, listener);
  };
};

exports._prependOnceListener = function (serviceObject) {
  return function (event, listener) {
    return serviceObject.prependOnceListener(event, listener);
  };
};

exports._removeListener = function (serviceObject) {
  return function (event, listener) {
    return serviceObject.removeListener(event, listener);
  };
};

exports._off = function (serviceObject) {
  return function (event, listener) {
    return serviceObject.off(event, listener);
  };
};

exports._removeAllListeners = function (serviceObject) {
  return function (event) {
    return serviceObject.removeAllListeners(event);
  };
};

exports._setMaxListeners = function (serviceObject) {
  return function (n) {
    return serviceObject.setMaxListeners(n);
  };
};

exports._getMaxListeners = function (serviceObject) {
  return function () {
    return serviceObject.getMaxListeners();
  };
};

exports._listeners = function (serviceObject) {
  return function (event) {
    return serviceObject.listeners(event);
  };
};

exports._rawListeners = function (serviceObject) {
  return function (event) {
    return serviceObject.rawListeners(event);
  };
};

exports._emit = function (serviceObject) {
  return function (event) {
    var args = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }

    return serviceObject.emit.apply(serviceObject, __spreadArrays([event], args));
  };
};

exports._eventNames = function (serviceObject) {
  return function () {
    return serviceObject.eventNames();
  };
};

exports._listenerCount = function (serviceObject) {
  return function (type) {
    return serviceObject.listenerCount(type);
  };
};
},{}],"functional-firebase-admin/core/storage/file.ts":[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var serviceObject = __importStar(require("./service-object"));

exports.createWriteStream = function (file) {
  return function (options) {
    if (!options) return file.createWriteStream();
    return file.createWriteStream(options);
  };
};

exports.createReadStream = function (file) {
  return function (options) {
    return file.createReadStream(options);
  };
};

exports.default = exports.createReadStream;
exports.request = serviceObject._request;
var remove = serviceObject._delete;
exports.delete = remove;
exports.create = serviceObject._create;
exports.exists = serviceObject._exists;
exports.get = serviceObject._get;
exports.getMetadata = serviceObject._getMetadata;
exports.setMetadata = serviceObject._setMetadata;
exports.metadata = serviceObject._metadata;
exports.baseUrl = serviceObject._baseUrl;
exports.id = serviceObject._id;
exports.requestStream = serviceObject._requestStream;
exports.addListener = serviceObject._addListener;
exports.on = serviceObject._on;
exports.once = serviceObject._once;
exports.prependListener = serviceObject._prependListener;
exports.prependOnceListener = serviceObject._prependOnceListener;
exports.removeListener = serviceObject._removeListener;
exports.off = serviceObject._off;
exports.removeAllListeners = serviceObject._removeAllListeners;
exports.setMaxListeners = serviceObject._setMaxListeners;
exports.getMaxListeners = serviceObject._getMaxListeners;
exports.listeners = serviceObject._listeners;
exports.rawListeners = serviceObject._rawListeners;
exports.emit = serviceObject._emit;
exports.eventNames = serviceObject._eventNames;
exports.listenerCount = serviceObject._listenerCount;

exports.parent = function (serviceObject) {
  return serviceObject.parent;
};

function _copy(file) {
  return function (destination, options, callback) {
    if (!options) return file.copy(destination);
    if (!callback) return file.copy(destination, options);
    return file.copy(destination, options, callback);
  };
}

exports.copy = _copy;

function _createResumableUpload(file) {
  return function (options, callback) {
    if (!options) return file.createResumableUpload();
    if (!callback) return file.createResumableUpload(options);
    return file.createResumableUpload(options, callback);
  };
}

exports.createResumableUpload = _createResumableUpload;

exports.deleteResumableCache = function (file) {
  return function () {
    return file.deleteResumableCache();
  };
};

function _download(file) {
  return function (options, callback) {
    if (!options) return file.download();
    if (!callback) return file.download(options);
    return file.download(options, callback);
  };
}

exports.download = _download;

exports.setEncryptionKey = function (file) {
  return function (encryptionKey) {
    if (typeof encryptionKey === 'string') return file.setEncryptionKey(encryptionKey);
    return file.setEncryptionKey(encryptionKey);
  };
};

function _getExpirationDate(file) {
  return function (callback) {
    if (!callback) return file.getExpirationDate();
    return file.getExpirationDate(callback);
  };
}

exports.getExpirationDate = _getExpirationDate;

function _getSignedPolicy(file) {
  return function (options, callback) {
    if (!callback) return file.getSignedPolicy(options);
    return file.getSignedPolicy(options, callback);
  };
}

exports.getSignedPolicy = _getSignedPolicy;

function _getSignedUrl(file) {
  return function (cfg, callback) {
    if (!callback) return file.getSignedUrl(cfg);
    return file.getSignedUrl(cfg, callback);
  };
}

exports.getSignedUrl = _getSignedUrl;

function _isPublic(file) {
  return function (callback) {
    if (!callback) return file.isPublic();
    return file.isPublic(callback);
  };
}

exports.isPublic = _isPublic;

function _makePrivate(file) {
  return function (options, callback) {
    if (!options) return file.makePrivate();
    if (!callback) return file.makePrivate(options);
    return file.makePrivate(options, callback);
  };
}

exports.makePrivate = _makePrivate;

function _makePublic(file) {
  return function (callback) {
    if (!callback) return file.makePublic();
    return file.makePublic(callback);
  };
}

exports.makePublic = _makePublic;

function _move(file) {
  return function (destination, options, callback) {
    if (!options) return file.move(destination);
    if (!callback) return file.move(destination, options);
    return file.move(destination, options, callback);
  };
}

exports.move = _move;

function _rotateEncryptionKey(file) {
  return function (options, callback) {
    if (!options) return file.rotateEncryptionKey();
    if (!callback) return file.rotateEncryptionKey(options);
    return file.rotateEncryptionKey(options, callback);
  };
}

exports.rotateEncryptionKey = _rotateEncryptionKey;

function _save(file) {
  return function (data, options, callback) {
    if (!options) return file.save(data);
    if (!callback) return file.save(data, options);
    return file.save(data, options, callback);
  };
}

exports.save = _save;

function _setStorageClass(file) {
  return function (storageClass, options, callback) {
    if (!options) return file.setStorageClass(storageClass);
    if (!callback) return file.setStorageClass(storageClass, options);
    return file.setStorageClass(storageClass, options, callback);
  };
}

exports.setStorageClass = _setStorageClass;

exports.setUserProject = function (file) {
  return function (userProject) {
    return file.setUserProject(userProject);
  };
};

exports.startResumableUpload_ = function (file) {
  return function (dup, options) {
    return file.startResumableUpload_(dup, options);
  };
};

exports.startSimpleUpload_ = function (file) {
  return function (dup, options) {
    return file.startSimpleUpload_(dup, options);
  };
};

exports.acl = function (file) {
  return file.acl;
};

exports.bucket = function (file) {
  return file.bucket;
};

exports.storage = function (file) {
  return file.storage;
};

exports.kmsKeyName = function (file) {
  return file.kmsKeyName;
};

exports.userProject = function (file) {
  return file.userProject;
};

exports.name = function (file) {
  return file.name;
};

exports.generation = function (file) {
  return file.generation;
};
},{"./service-object":"functional-firebase-admin/core/storage/service-object.ts"}],"functional-firebase-admin/core/storage/bucket.ts":[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var serviceObject = __importStar(require("./service-object"));

exports.file = function (bucket) {
  return function (name, options) {
    if (!options) return bucket.file(name);
    return bucket.file(name, options);
  };
};

exports.default = exports.file;
exports.request = serviceObject._request;
var remove = serviceObject._delete;
exports.delete = remove;
exports.create = serviceObject._create;
exports.exists = serviceObject._exists;
exports.get = serviceObject._get;
exports.getMetadata = serviceObject._getMetadata;
exports.setMetadata = serviceObject._setMetadata;
exports.metadata = serviceObject._metadata;
exports.baseUrl = serviceObject._baseUrl;
exports.parent = serviceObject._parent;
exports.id = serviceObject._id;
exports.requestStream = serviceObject._requestStream;
exports.addListener = serviceObject._addListener;
exports.on = serviceObject._on;
exports.once = serviceObject._once;
exports.prependListener = serviceObject._prependListener;
exports.prependOnceListener = serviceObject._prependOnceListener;
exports.removeListener = serviceObject._removeListener;
exports.off = serviceObject._off;
exports.removeAllListeners = serviceObject._removeAllListeners;
exports.setMaxListeners = serviceObject._setMaxListeners;
exports.getMaxListeners = serviceObject._getMaxListeners;
exports.listeners = serviceObject._listeners;
exports.rawListeners = serviceObject._rawListeners;
exports.emit = serviceObject._emit;
exports.eventNames = serviceObject._eventNames;
exports.listenerCount = serviceObject._listenerCount;

exports.name = function (bucket) {
  return bucket.name;
};

exports.storage = function (bucket) {
  return bucket.storage;
};

exports.userProject = function (bucket) {
  return bucket.userProject;
};

exports.acl = function (bucket) {
  return bucket.acl;
};

exports.iam = function (bucket) {
  return bucket.iam;
};

exports.getFilesStream = function (bucket) {
  return bucket.getFilesStream;
};

function _addLifecycleRule(bucket) {
  return function (rule, options, callback) {
    if (!options) return bucket.addLifecycleRule(rule);
    if (!callback) return bucket.addLifecycleRule(rule, options);
    return bucket.addLifecycleRule(rule, options, callback);
  };
}

exports.addLifecycleRule = _addLifecycleRule;

function _combine(bucket) {
  return function (sources, destination, options, callback) {
    if (!options) return bucket.combine(sources, destination);
    if (!callback) return bucket.combine(sources, destination, options);
    return bucket.combine(sources, destination, options, callback);
  };
}

exports.combine = _combine;

function _createChannel(bucket) {
  return function (id, config, options, callback) {
    if (!options) return bucket.createChannel(id, config);
    if (!callback) return bucket.createChannel(id, config, options);
    return bucket.createChannel(id, config, options, callback);
  };
}

exports.createChannel = _createChannel;

function _createNotification(bucket) {
  return function (topic, options, callback) {
    if (!options) return bucket.createNotification(topic);
    if (!callback) return bucket.createNotification(topic, options);
    return bucket.createNotification(topic, options, callback);
  };
}

exports.createNotification = _createNotification;

function _deleteFiles(bucket) {
  return function (query, callback) {
    if (!callback) return bucket.deleteFiles(query);
    return bucket.deleteFiles(query, callback);
  };
}

exports.deleteFiles = _deleteFiles;

function _deleteLabels(bucket) {
  return function (labels, callback) {
    if (!callback) return bucket.deleteLabels(labels);
    return bucket.deleteLabels(labels, callback);
  };
}

exports.deleteLabels = _deleteLabels;

function _disableRequesterPays(bucket) {
  return function (callback) {
    if (!callback) return bucket.disableRequesterPays();
    return bucket.disableRequesterPays(callback);
  };
}

exports.disableRequesterPays = _disableRequesterPays;

function _enableLogging(bucket) {
  return function (config, callback) {
    if (!callback) return bucket.enableLogging(config);
    return bucket.enableLogging(config, callback);
  };
}

exports.enableLogging = _enableLogging;

function _enableRequesterPays(bucket) {
  return function (callback) {
    if (!callback) return bucket.enableRequesterPays();
    return bucket.enableRequesterPays(callback);
  };
}

exports.enableRequesterPays = _enableRequesterPays;

function _getFiles(bucket) {
  return function (query, callback) {
    if (!callback) return bucket.getFiles(query);
    return bucket.getFiles(query, callback);
  };
}

exports.getFiles = _getFiles;

function _getLabels(bucket) {
  return function (options, callback) {
    if (!callback) return bucket.getLabels(options);
    bucket.getLabels(options, callback);
  };
}

exports.getLabels = _getLabels;

function _getNotifications(bucket) {
  return function (options, callback) {
    if (!options) return bucket.getNotifications();
    if (!callback) return bucket.getNotifications(options);
    bucket.getNotifications(options, callback);
  };
}

exports.getNotifications = _getNotifications;

function _lock(bucket) {
  return function (metageneration, callback) {
    if (!callback) return bucket.lock(metageneration);
    bucket.lock(metageneration, callback);
  };
}

exports.lock = _lock;

function _makePrivate(bucket) {
  return function (options, callback) {
    if (!options) return bucket.makePrivate();
    if (!callback) return bucket.makePrivate(options);
    bucket.makePrivate(options, callback);
  };
}

exports.makePrivate = _makePrivate;

function _makePublic(bucket) {
  return function (options, callback) {
    if (!options) return bucket.makePublic();
    if (!callback) return bucket.makePublic(options);
    bucket.makePublic(options, callback);
  };
}

exports.makePublic = _makePublic;

exports.notification = function (bucket) {
  return function (id) {
    return bucket.notification(id);
  };
};

function _removeRetentionPeriod(bucket) {
  return function (callback) {
    if (!callback) return bucket.removeRetentionPeriod();
    return bucket.removeRetentionPeriod(callback);
  };
}

exports.removeRetentionPeriod = _removeRetentionPeriod;

function _setLabels(bucket) {
  return function (labels, options, callback) {
    if (!options) return bucket.setLabels(labels);
    if (!callback) return bucket.setLabels(labels, options);
    return bucket.setLabels(labels, options, callback);
  };
}

exports.setLabels = _setLabels;

function _setRetentionPeriod(bucket) {
  return function (duration, callback) {
    if (!callback) return bucket.setRetentionPeriod(duration);
    bucket.setRetentionPeriod(duration, callback);
  };
}

exports.setRetentionPeriod = _setRetentionPeriod;

function _setStorageClass(bucket) {
  return function (storageClass, options, callback) {
    if (!options) return bucket.setStorageClass(storageClass);
    if (!callback) return bucket.setStorageClass(storageClass, options);
    return bucket.setStorageClass(storageClass, options, callback);
  };
}

exports.setStorageClass = _setStorageClass;

exports.setUserProject = function (bucket) {
  return function (userProject) {
    return bucket.setUserProject(userProject);
  };
};

function _upload(bucket) {
  return function (pathString, options, callback) {
    if (!options) return bucket.upload(pathString);
    if (!callback) return bucket.upload(pathString, options);
    return bucket.upload(pathString, options, callback);
  };
}

exports.upload = _upload;

function _makeAllFilesPublicPrivate_(bucket) {
  return function (options) {
    return bucket.makeAllFilesPublicPrivate_(options);
  };
}

exports.makeAllFilesPublicPrivate_ = _makeAllFilesPublicPrivate_;

exports.getId = function (bucket) {
  return function () {
    return bucket.getId();
  };
};
},{"./service-object":"functional-firebase-admin/core/storage/service-object.ts"}],"functional-firebase-admin/core/storage/storage.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.app = function (storage) {
  return storage.app;
};

exports.bucket = function (storage) {
  return function (name) {
    if (!name) return storage.bucket();
    return storage.bucket(name);
  };
};

exports.default = exports.bucket;
},{}],"functional-firebase-admin/core/storage/index.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var file = __importStar(require("./file"));

exports.file = file;

var bucket = __importStar(require("./bucket"));

exports.bucket = bucket;

var storage = __importStar(require("./storage"));

exports.storage = storage;

var ramda_1 = require("ramda");

var attachToDefault_1 = __importDefault(require("../attachToDefault"));

exports.File = ramda_1.pipe(ramda_1.applySpec(file), attachToDefault_1.default);
exports.Bucket = ramda_1.pipe(ramda_1.applySpec(bucket), function (_a) {
  var name = _a.name,
      spec = __rest(_a, ["name"]);

  return __assign(__assign({}, spec), {
    default: ramda_1.pipe(spec.default, exports.File)
  });
}, attachToDefault_1.default);
exports.Storage = ramda_1.pipe(ramda_1.applySpec(storage), function (spec) {
  return __assign(__assign({}, spec), {
    default: ramda_1.pipe(spec.default, exports.Bucket)
  });
}, attachToDefault_1.default);
exports.default = exports.Storage;
},{"./file":"functional-firebase-admin/core/storage/file.ts","./bucket":"functional-firebase-admin/core/storage/bucket.ts","./storage":"functional-firebase-admin/core/storage/storage.ts","../attachToDefault":"functional-firebase-admin/core/attachToDefault.ts"}],"functional-firebase-admin/core/extendedApp.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var firestore_1 = __importDefault(require("./firestore"));

var storage_1 = __importDefault(require("./storage"));

var ramda_1 = require("ramda");
/**
 * Returns functions of firebase.app that can either be chained by key reference or called directly
 * The difference between this one and mappedApp is that this works without mapping all the functions of firebase admin
 * to a actual function but instead uses the original object, making it more future proof but less deterministic.
 */


var App = function (FirebaseApp) {
  return Object.assign(function () {
    return firestore_1.default(FirebaseApp.firestore());
  }, ramda_1.omit(['name'], FirebaseApp), {
    firestore: function () {
      return firestore_1.default(FirebaseApp.firestore());
    },
    storage: function () {
      return storage_1.default(FirebaseApp.storage());
    }
  });
};

exports.default = App;
},{"./firestore":"functional-firebase-admin/core/firestore/index.ts","./storage":"functional-firebase-admin/core/storage/index.ts"}],"functional-firebase-admin/core/index.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ramda_1 = require("ramda");

var image = __importStar(require("./image"));

var crud = __importStar(require("./crud"));

var extendedApp_1 = __importDefault(require("./extendedApp")); // or
// import App from './mapped'


exports.Image = ramda_1.applySpec(image);
exports.default = ramda_1.pipe(extendedApp_1.default, function (app) {
  var File = app.storage()();
  var collection = app.firestore();
  var Stats = collection('stats');
  return __assign(__assign({}, app), {
    Stats: Stats,
    Image: ramda_1.pipe(collection('images'), crud.newCrud(Stats), ramda_1.applySpec(ramda_1.applySpec(image)(File)))
  });
});
},{"./image":"functional-firebase-admin/core/image.ts","./crud":"functional-firebase-admin/core/crud.ts","./extendedApp":"functional-firebase-admin/core/extendedApp.ts"}],"tools/errors.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
var STATUS_CODES = {
  '404': 'NotFound',
  '500': 'InternalServerError'
};

exports.HTTPError =
/** @class */
function (_super) {
  __extends(HTTPError, _super);

  function HTTPError(code, message, extras) {
    var _this = _super.call(this, message || STATUS_CODES[code]) || this;

    _this.extras = extras || {};
    _this.statusCode = code;
    return _this;
  }

  return HTTPError;
}(Error);

exports.default = exports.HTTPError;
},{}],"tools/numbers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.stringToNumberOrRandom = function (input, max) {
  var int = parseInt(Object.values(input).join('').replace(/\D/g, '')); // may only be a integer

  if (isNaN(int) || int > max) return exports.getRandomInt(1, max); // random fallbackk

  return int;
};

exports.getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.getRandom = function (min, max) {
  return Math.random() * (max - min) + min;
};

exports.getRandomPaddedInt = function (min, max, pad) {
  if (pad === void 0) {
    pad = 4;
  }

  return String(exports.getRandomInt(min, max)).padStart(pad, '0');
};
},{}],"contants.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dev = Boolean(process.env.FUNCTIONS_EMULATOR);
exports.location = 'us-central1';
exports.FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG || '');
exports.IMAGE_VERSIONS = [{
  type: 'x3',
  width: 1800,
  height: 2400
}, {
  type: 'x2',
  width: 1200,
  height: 1600
}, {
  type: 'x1',
  width: 600,
  height: 800
}, {
  type: 'thumb',
  width: 400,
  height: 250
}];
},{}],"tools/uploadBusboy.ts":[function(require,module,exports) {
"use strict";
/**
 * This file is a standalone utility for uploading files with the uploadBusboy library.
 * Busboy is a parser that reads all uploaded files. Through configuration it is possible
 * to
 *
 *
 * Notes for reading this code:
 * - Every function is extensively typed. Each function respects it's definition written above it without unneccerary typecasting.
 * - Types from the config object should and will be reflected wherever you'd expect. This did require a lot of explaining to typescript. This is fine, because
 *      it means explicit type output for end-users of this utility. This is useful when configuring this utility. For example, all return types of the functions
 *      assigned to `onFile` will be reflected.
 *  @example
 *  ```
 *  const uploadBusboy = createUploadBusboy(request,{
        onFile: {
            test: ()=>({
                thisisresolved:new Promise(resolve=>resolve('some value'))
            })
        }
    })
    await uploadBusboy((c)=>{
        console.log(c)
        // ^ hover over this variable, and see:
        //                  v notice here, all values are wrapped with `resolved`, which unpacks Promises
        // (parameter) c: resolved<Promise<{
        //     thisisresolved: Promise<string>;
        // }> & {
        //     destination: Promise<string>;
        // } & {
        //     buffer: Promise<Buffer>;
        // } & {
        //     fieldname: string;
        //     file: NodeJS.ReadableStream;
        //     filename: string;
        //     encoding: string;
        //     mimetype: string;
        // }>
    });

 *  ```
 *
 * - HOC (Higher Order Functions) are prefixed with 'create'
 * - Every function has a comment, these should show up when hovering over these types with something like vscode
 * - The only (non-native) dependency is `busboy`
 */

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Returns a function that recursively calls all functions in a array -with the same arguments- and combines results */

var _createUnifiedFunction = function () {
  var fns = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    fns[_i] = arguments[_i];
  }

  return fns.reduce(function (prev, creator) {
    return function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return Object.assign(prev.apply(void 0, args), creator.apply(void 0, args));
    };
  }, function () {
    return {};
  });
};
/** Merge two objects and cast to a more readable type definition (seen when hovering over things) */


var _merge = function (y, x) {
  return Object.assign(y, x);
};
/**
 * Upgrades a function to store and list all previous results.
 *
 * @remarks
 * The upgraded function will behave like the original when called with arguments, but will list a object
 * containing all previous results when called without arguments. Each result
 * will be keyed by their first argument, which must always be a string. A key can have multiple
 * results, which is why all results are stored in a array.
 * ```ts
 * const create = (fieldname,value)=>({[fieldname]:value})
 * const myStore = _createStore(create)
 * myStore('A','some')
 * myStore('B','values')
 * console.log(myStore('A','thing')) // {A:'thing'}
 * console.log(myStore()) // { A: [{A:'some'},{A:'thing'}], B: [{B:'values'}] }
 * ```
 */


var _createStore = function (func, obj) {
  if (obj === void 0) {
    obj = {};
  }

  return function () {
    var _a;

    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    if (!args.length || !obj) return obj;
    var r = func.apply(void 0, args);
    obj = __assign(__assign({}, obj), (_a = {}, _a[args[0]] = __spreadArrays(obj[args[0]] || [], [r]), _a));
    return r;
  };
};

var _wrapFunctionObject = function (func, obj) {
  return Object.entries(obj).reduce(function (prev, _a) {
    var _b;

    var key = _a[0],
        value = _a[1];
    return Object.assign(prev, (_b = {}, _b[key] = func(value), _b));
  }, {});
};

var _wrapStore = function (obj) {
  return _wrapFunctionObject(_createStore, obj);
};

var _files = function (fieldname, file, filename, encoding, mimetype) {
  return {
    fieldname: fieldname,
    file: file,
    filename: filename,
    encoding: encoding,
    mimetype: mimetype
  };
};

var _fileWritesCreate = function () {
  var createWriteStream = require('fs').createWriteStream;

  var join = require('path').join;

  var tmpdir = require('os').tmpdir;

  return function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    return {
      destination: new Promise(function (resolve, reject) {
        var destination = join(tmpdir(args[0]), args[3]);
        var writeStream = createWriteStream(destination);
        args[1].pipe(writeStream);
        args[1].on('end', function () {
          writeStream.end();
        });
        writeStream.on('finish', function () {
          return resolve(destination);
        });
        writeStream.on('error', reject);
      })
    };
  };
};

var _fileBuffers = function (_, file) {
  return {
    buffer: new Promise(function (resolve, reject) {
      var imgResponse = [];
      file.on('store', function (store) {
        imgResponse.push(store);
      });
      file.on('end', function () {
        resolve(Buffer.concat(imgResponse));
      });
      file.on('error', reject);
    })
  };
};
/** Turns field arguments in to a object with named keys */


var _fields = function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
  return {
    fieldname: fieldname,
    val: val,
    fieldnameTruncated: fieldnameTruncated,
    valTruncated: valTruncated,
    encoding: encoding,
    mimetype: mimetype
  };
};

function isFunctionObject(o) {
  return typeof o === 'object' && Object.values(o).findIndex(function (func) {
    return typeof func !== 'function';
  }) === -1;
}
/** `createUploadBusboy config property 'onFile|utils|onField' should be a object that only contains functions` */


var fnsOnlyErr = function (name) {
  return new Error("createUploadBusboy config property '" + name + "' should be a object that only contains functions");
};
/** Assigns all the default functions to the config object */


var _mergeConfig = function (config) {
  if (config === void 0) {
    config = {};
  }

  if (!isFunctionObject(config.onFile)) throw fnsOnlyErr('onFile');
  if (!isFunctionObject(config.onField)) throw fnsOnlyErr('onField');
  return {
    onField: _merge({
      fields: _fields
    }, config.onField || {}),
    onFile: _merge({
      fileWrites: _fileWritesCreate(),
      fileBuffers: _fileBuffers,
      files: _files
    }, config.onFile || {})
  };
};
/** creates a new instance of busboy class */


var _newBusboy = function (busboyConfig) {
  return new (require('busboy'))(busboyConfig);
};

var resolver = function (obj) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _i, key, _c, _d;

    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          _a = [];

          for (_b in obj) _a.push(_b);

          _i = 0;
          _e.label = 1;

        case 1:
          if (!(_i < _a.length)) return [3
          /*break*/
          , 4];
          key = _a[_i];
          if (!(obj.hasOwnProperty(key) && typeof obj[key].then === 'function')) return [3
          /*break*/
          , 3];
          _c = obj;
          _d = key;
          return [4
          /*yield*/
          , obj[key]];

        case 2:
          _c[_d] = _e.sent();
          _e.label = 3;

        case 3:
          _i++;
          return [3
          /*break*/
          , 1];

        case 4:
          return [2
          /*return*/
          , obj];
      }
    });
  });
};
/** Creates the api facing the end-user of this utility.
 *  The api/interface is actually just a function, but also has utility-functions attached to it; think "callable object"
 */


var _createApi = function (request, config) {
  /** mc is the combination of default configuration and the configuration of a end-user of this utility*/
  var mc = _mergeConfig(config);
  /** Basically does `new Busboy`, so unless you have a good reason the default should be desired.  */

  /** The busboy instance */


  var busboy = _newBusboy({
    headers: request.headers
  });
  /** All the onFile functions wrapped with store (default: files,fileWrites,fileBuffers) */


  var onFileSubStores = _wrapStore(mc.onFile);
  /** All the onField functions wrapped with store (default: fields) */


  var onFieldSubStores = _wrapStore(mc.onField);
  /** `handleOnFile` is a function that calls, merges and stores results of all file functions.
   * When `handleOnFile` is called with arguments: all substores will be called with these same arguments and the results will be merged to one object.
   * When `handleOnFile` is called without arguments: all the previous (merged) results will be returned as a array.
  */


  var handleOnFile = _createStore(_createUnifiedFunction.apply(void 0, Object.values(onFileSubStores)));
  /** `handleOnField` is a function that calls, merges and stores results of all field functions. */


  var handleOnField = _createStore(_createUnifiedFunction.apply(void 0, Object.values(onFieldSubStores)));
  /** `start` is the function that puts everything in motion. */


  var start = function (cb) {
    return __awaiter(void 0, void 0, void 0, function () {
      var filePromises, handler, promise;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            filePromises = [];
            handler = typeof cb === 'function' ? function (done) {
              return filePromises.push(done.then(cb));
            } : function (done) {
              return filePromises.push(done);
            };
            promise = new Promise(function (resolve, reject) {
              busboy.on('finish', resolve);
              busboy.on('partsLimit', reject);
              busboy.on('filesLimit', reject);
              busboy.on('fieldsLimit', reject);
            });
            if (handleOnField()) busboy.on('field', handleOnField);
            if (handleOnFile()) busboy.on('file', function () {
              var args = [];

              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }

              handler(resolver(handleOnFile.apply(void 0, args)));
            });
            busboy.end(request.rawBody); // start busboy

            return [4
            /*yield*/
            , promise];

          case 1:
            _a.sent();

            return [2
            /*return*/
            , Promise.all(filePromises)];
        }
      });
    });
  };

  return Object.assign(start, __assign(__assign(__assign({}, onFileSubStores), onFieldSubStores), {
    busboy: busboy,
    onFile: handleOnFile,
    onField: handleOnField,
    start: start
  }));
};
/**
 * Configures a function that can be used to process incomming uploaded files
 *
 * @note This is a alias for `_createApi` @see _createApi
 *
 * @param request   the request object containing atleast rawBody (any) and headers (object)
 * @param config    a optional configuration object. @see Config
 */


exports.createUploadBusboy = _createApi;
exports.default = exports.createUploadBusboy;
},{}],"tools/ascii.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var asciify = require("asciify-image");

exports.logAscii = function (img, msg) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;

    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          console.log(msg);
          _b = (_a = console).log;
          return [4
          /*yield*/
          , asciify(img, {
            fit: 'box',
            width: 16,
            height: 16
          })];

        case 1:
          _b.apply(_a, [_c.sent()]);

          return [2
          /*return*/
          ];
      }
    });
  });
};
},{}],"models/photos.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var sharp = require("sharp");

var _contants_1 = require("~contants");

var image_size_1 = require("image-size");

var crypto_1 = require("crypto");

var automl = require("@google-cloud/automl");

var _contants_2 = require("~contants");

var ascii_1 = require("~tools/ascii");

var core_1 = __importDefault(require("~functional-firebase-admin/core"));

var firebase_admin_1 = require("firebase-admin");

var _a = core_1.default(firebase_admin_1.app()),
    firestore = _a.firestore,
    storage = _a.storage,
    Image = _a.Image,
    Stats = _a.Stats;

var collection = firestore();
var defaultBucket = storage()();
var predictionClient = new automl.v1beta1.PredictionServiceClient();
var project = _contants_2.FIREBASE_CONFIG.projectId;
var automl_model = {
  'mooiemanOrFraaievrouw': 'ICN4428727672790743256'
};

function analysePhoto(b64img, type) {
  return new Promise(function (resolve, reject) {
    var payload = {
      "image": {
        "imageBytes": b64img
      }
    };
    var reqBody = {
      name: predictionClient.modelPath(project, _contants_2.location, automl_model[type]),
      payload: payload
    };
    predictionClient.predict(reqBody).then(function (responses) {
      console.log('Got a prediction from AutoML API!');
      resolve(responses);
      return responses;
    }).catch(function (err) {
      console.log('AutoML API Error: ', err);
      reject(err);
    });
  });
}

exports.analysePhoto = analysePhoto;

var sharpClone = function (tobeCloned, version) {
  return Object.assign(tobeCloned.clone().resize(version.width, version.height, {
    fit: 'inside',
    withoutEnlargement: true
  }), version);
};

var generateImageVersions = function (baseSharp) {
  var maxVersion = _contants_1.IMAGE_VERSIONS[0],
      smallerVersions = _contants_1.IMAGE_VERSIONS.slice(1);

  return smallerVersions.reduce(function (_a, version) {
    var prev = _a[0],
        rest = _a.slice(1);

    return __spreadArrays([sharpClone(prev, version), prev], rest);
  }, [sharpClone(baseSharp, maxVersion)] // we start with the biggest
  );
};

exports.create = function (file, modelType) {
  if (modelType === void 0) {
    modelType = 'mooiemanOrFraaievrouw';
  }

  return __awaiter(void 0, void 0, void 0, function () {
    var buffer, filename, mimetype, md5, _a, _b, width, _c, height, _d, ext, versions, snapshot, automlResponse, _e, payload, type, count, _f, baseImg, mainUpload;

    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          buffer = file.buffer, filename = file.filename, mimetype = file.mimetype;
          md5 = crypto_1.createHash('md5').update(buffer).digest("hex");
          _a = image_size_1.imageSize(buffer), _b = _a.width, width = _b === void 0 ? 0 : _b, _c = _a.height, height = _c === void 0 ? 0 : _c, _d = _a.type, ext = _d === void 0 ? 'jpg' : _d;
          versions = generateImageVersions(sharp(buffer).rotate());
          return [4
          /*yield*/
          , collection('images')(md5).get()];

        case 1:
          snapshot = _g.sent();
          if (snapshot.exists) throw new Error("This image has already been fromFileed: " + snapshot.get('normal'));
          _e = analysePhoto;
          return [4
          /*yield*/
          , versions[2].toBuffer()];

        case 2:
          return [4
          /*yield*/
          , _e.apply(void 0, [_g.sent().toString('base64'), modelType])];
        // use the 600 version to predict mooieman or fraaievrouw

        case 3:
          automlResponse = _g.sent()[// use the 600 version to predict mooieman or fraaievrouw
          0];
          payload = automlResponse.payload[0];
          type = payload.displayName === 'mooieman' || payload.displayName === 'fraaievrouw' ? payload.displayName : 'none';
          return [4
          /*yield*/
          , Stats(type)('count').get()];

        case 4:
          count = _g.sent();
          if (!_contants_1.dev) return [3
          /*break*/
          , 7];
          _f = ascii_1.logAscii;
          return [4
          /*yield*/
          , versions[3].toBuffer()];

        case 5:
          return [4
          /*yield*/
          , _f.apply(void 0, [_g.sent(), payload.displayName + " (" + payload.classification.score + ")"])];
        // use the thumb to generate a ascii for the developer

        case 6:
          _g.sent(); // use the thumb to generate a ascii for the developer


          _g.label = 7;

        case 7:
          baseImg = {
            md5: md5,
            originalFilePath: type + "/" + md5 + "." + ext,
            originalFileName: "" + filename,
            originalFileMime: mimetype,
            originalWidth: width,
            originalHeight: height,
            type: type,
            score: payload.classification.score
          };
          mainUpload = Image(md5).create(__assign(__assign({}, baseImg), {
            fileName: md5,
            filePath: type + "/" + md5 + "." + ext,
            fileMime: mimetype,
            upload: buffer,
            width: width,
            height: height,
            ext: ext
          }));
          return [4
          /*yield*/
          , Promise.all(versions.map(function (version) {
            return Image(md5).createVersion({
              filePath: type + "/" + (type + String(count).padStart(4, '0')) + ".webp",
              fileMime: 'image/webp',
              width: version.width,
              height: version.height,
              upload: version.webp()
            });
          }))];

        case 8:
          _g.sent();

          return [4
          /*yield*/
          , mainUpload];

        case 9:
          _g.sent();

          return [2
          /*return*/
          , 'hi'];
      }
    });
  });
};

exports.default = exports.create;
},{"~contants":"contants.ts","~tools/ascii":"tools/ascii.ts","~functional-firebase-admin/core":"functional-firebase-admin/core/index.ts"}],"functions.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var firebase_functions_1 = require("firebase-functions");

var server_1 = __importDefault(require("~graphql/server"));

var core_1 = __importDefault(require("~functional-firebase-admin/core"));

var admin = require("firebase-admin");

var express = require("express");

var errors_1 = __importDefault(require("~tools/errors"));

var numbers_1 = require("~tools/numbers");

var _contants_1 = require("~contants");

var uploadBusboy_1 = require("~tools/uploadBusboy");

var ascii_1 = require("~tools/ascii");

var photos_1 = require("~models/photos"); // import mime from 'mime-types'


var app = express();
admin.initializeApp(_contants_1.FIREBASE_CONFIG);

var _a = core_1.default(admin.app()),
    firestore = _a.firestore,
    storage = _a.storage;

var collection = firestore();

var _b = core_1.default(admin.app()),
    Image = _b.Image,
    Stats = _b.Stats;

var defaultBucket = storage()();
app.get('/count/:type', function (request, response) {
  return __awaiter(void 0, void 0, void 0, function () {
    var type, snapshot, data, e_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3,, 4]);

          type = request.params.type;
          console.log('type', type);
          return [4
          /*yield*/
          , Stats(type).get()];

        case 1:
          snapshot = _a.sent();
          if (!snapshot.exists) throw new errors_1.default(404, type + " stats not found");
          return [4
          /*yield*/
          , snapshot.data()];

        case 2:
          data = _a.sent();
          if (!data || !data.count) throw new errors_1.default(404, type + " count not found");
          response.json(data.count);
          return [3
          /*break*/
          , 4];

        case 3:
          e_1 = _a.sent();
          if (_contants_1.dev) console.log("error " + Object.values(request.params).join('/'));
          if (_contants_1.dev) console.trace(e_1);
          if (typeof e_1.statusCode === 'number') response.status(e_1.statusCode).json(e_1.message);
          return [3
          /*break*/
          , 4];

        case 4:
          return [2
          /*return*/
          , response.send()];
      }
    });
  });
});
;
app.get('/:type(mooieman|fraaievrouw)/:id(\\d+)?', function (request, response) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, id, imgResponse, snapshot, data, createReadStream, readStream_1, e_2;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _a = request.params, type = _a.type, id = _a.id;
          imgResponse = [];
          _b.label = 1;

        case 1:
          _b.trys.push([1, 8,, 9]);

          if (!(!id || isNaN(parseInt(id)))) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , Stats(type).get()];

        case 2:
          snapshot = _b.sent();
          if (!snapshot.exists) throw new errors_1.default(404, type + "/" + id + " not found");
          data = snapshot.data();
          if (!data || !data.count) throw new errors_1.default(404, type + "/" + id + " count not found");
          id = String(numbers_1.getRandomInt(1, data.count));
          _b.label = 3;

        case 3:
          return [4
          /*yield*/
          , defaultBucket(type + "/" + type + id.padStart(4, '0') + ".jpg")];

        case 4:
          createReadStream = _b.sent();
          console.log(Object.keys(createReadStream));
          if (!createReadStream.exists()) throw new errors_1.default(404, type + " image not found");
          readStream_1 = createReadStream();
          if (!readStream_1) throw new errors_1.default(404, type + " stream not found");
          if (_contants_1.dev) readStream_1.on('data', function (data) {
            return imgResponse.push(data);
          });
          return [4
          /*yield*/
          , new Promise(function (resolve, reject) {
            return readStream_1.on('response', function (resp) {
              return response.setHeader('Content-Type', resp.headers['content-type']);
            }).on('error', reject).on('end', resolve).pipe(response);
          })];

        case 5:
          _b.sent();

          if (!_contants_1.dev) return [3
          /*break*/
          , 7];
          return [4
          /*yield*/
          , ascii_1.logAscii(Buffer.concat(imgResponse), "Downloaded " + type + "/" + id)];

        case 6:
          _b.sent();

          _b.label = 7;

        case 7:
          return [3
          /*break*/
          , 9];

        case 8:
          e_2 = _b.sent();
          if (_contants_1.dev) console.log("error " + Object.values(request.params).join('/'));
          if (_contants_1.dev) console.trace(e_2);
          if (typeof e_2.statusCode === 'number') response.status(e_2.statusCode).json(e_2.message);
          return [3
          /*break*/
          , 9];

        case 9:
          return [2
          /*return*/
          , response.send()];
      }
    });
  });
});
app.post('/upload', function (request, response) {
  return __awaiter(void 0, void 0, void 0, function () {
    var uploadBusboy, r, e_3;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2,, 3]);

          uploadBusboy = uploadBusboy_1.createUploadBusboy(request, {
            onFile: {
              jimfn: function () {
                return {
                  jim: 'jim'
                };
              }
            }
          });
          return [4
          /*yield*/
          , uploadBusboy(function (upload) {
            photos_1.create(upload.jim);
            return upload;
          })];

        case 1:
          r = _a.sent();
          console.log(r);
          console.log('done');
          response.json(Object.values(uploadBusboy.files()).flat().map(function (_a) {
            var file = _a.file,
                other = __rest(_a, ["file"]);

            return other;
          }));
          return [3
          /*break*/
          , 3];

        case 2:
          e_3 = _a.sent();
          if (_contants_1.dev) console.log("error " + Object.values(request.params).join('/'), e_3.message);
          if (_contants_1.dev) console.trace(e_3);
          if (typeof e_3.statusCode === 'number') response.status(e_3.statusCode).json(e_3.message);
          return [3
          /*break*/
          , 3];

        case 3:
          return [2
          /*return*/
          , response.send()];
      }
    });
  });
}); // http://localhost:5001/mooie-man/us-central/graphql/
// https://us-central1-mooie-man.cloudfunctions.net/graphql/

exports.graphql = firebase_functions_1.https.onRequest(server_1.default({})); // http://localhost:5001/mooie-man/us-central/count/
// https://us-central1-mooie-man.cloudfunctions.net/count/

exports.count = firebase_functions_1.https.onRequest(app); // http://localhost:5001/mooie-man/us-central/mooieman/
// https://us-central1-mooie-man.cloudfunctions.net/mooieman/

exports.mooieman = firebase_functions_1.https.onRequest(app); // http://localhost:5001/mooie-man/us-central/fraaievrouw/
// https://us-central1-mooie-man.cloudfunctions.net/fraaievrouw/

exports.fraaievrouw = firebase_functions_1.https.onRequest(app); // http://localhost:5001/mooie-man/us-central/manualUpload/
// https://us-central1-mooie-man.cloudfunctions.net/manualUpload/

exports.upload = firebase_functions_1.https.onRequest(app);
exports.uploadFinalize = firebase_functions_1.storage.object().onFinalize(function (event) {
  console.log('uploadFinalize');
});
},{"~graphql/server":"graphql/server.ts","~functional-firebase-admin/core":"functional-firebase-admin/core/index.ts","~tools/errors":"tools/errors.ts","~tools/numbers":"tools/numbers.ts","~contants":"contants.ts","~tools/uploadBusboy":"tools/uploadBusboy.ts","~tools/ascii":"tools/ascii.ts","~models/photos":"models/photos.ts"}]},{},["functions.ts"], null)
//# sourceMappingURL=/functions.js.map