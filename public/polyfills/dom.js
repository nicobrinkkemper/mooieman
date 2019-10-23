"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPreloads = exports.skipNonMatchingModules = exports.processCss = exports.setLoaded = exports.processScript = void 0;

var processScript = function processScript(link, isAsync, resolve) {
  var script = document.createElement("script");
  script.async = isAsync;
  script.onload = resolve;
  script.onerror = resolve;
  script.setAttribute("src", link.href);

  if (link.integrity) {
    script.integrity = link.integrity;
  } // if the preload resource has a crossorigin attribute, the generated script should have one aswell, otherwise we get a different resource
  // see https://bugs.chromium.org/p/chromium/issues/detail?id=678429


  if (link.hasAttribute("crossorigin")) {
    script.setAttribute("crossorigin", link.getAttribute("crossorigin"));
  }

  if (link.insertAdjacentElement) {
    link.insertAdjacentElement("afterend", script);
  } else {
    link.parentNode.appendChild(script);
  }

  return script;
};

exports.processScript = processScript;

var activateStylesheet = function activateStylesheet(link) {
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("media", "all");
  link.setAttribute("preloaded", "true");
  link.removeAttribute("as");
};

var setLoaded = function setLoaded(element) {
  var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  element.setAttribute("preloaded", !!error ? "error" : "true");
  element.removeEventListener("load", window.invokePreload.onLoad);
  element.removeAttribute("onload");
  element.removeAttribute("onerror");
  element.onload = null;
  console.log("".concat(error ? "error when preloading" : "successfully preloaded", " \"").concat(element.href, "\""));
};

exports.setLoaded = setLoaded;

var processCss = function processCss(link) {
  if ([].map.call(document.styleSheets, function (stylesheet) {
    return stylesheet.media.mediaText === "all" ? stylesheet.href : null;
  }).indexOf(link.href) === -1) {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(function () {
        return activateStylesheet(link);
      });
    } else {
      activateStylesheet(link);
    }
  }

  link.removeAttribute("onload");
  return link;
};

exports.processCss = processCss;

var checkEs6 = function checkEs6() {
  try {
    new Function("(a = 0) => a");
    console.log("ES6 capable browser");
    return true;
  } catch (e) {
    console.log("ES5 capable browser");
    return false;
  }
};

var ES6 = checkEs6();
/**
 * this skips type="module" for browsers that dont understand es6
 * and skips nomodule for browsers that understand es6
 */

var skipNonMatchingModules = function skipNonMatchingModules(element) {
  if ((element.getAttribute("as") === "script" || element.getAttribute("as") === "worker") && (element.getAttribute("rel") === "nomodule" || element.hasAttribute("module"))) {
    //check for type="module" / nomodule (load es6 or es5) depending on browser capabilties
    var nm = element.getAttribute("rel") === "nomodule";
    var m = element.hasAttribute("module");

    if (m && !ES6 || nm && ES6) {
      return true;
    }
  }

  return false;
};

exports.skipNonMatchingModules = skipNonMatchingModules;

var getPreloads = function getPreloads(selector) {
  var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var preloads = element.querySelectorAll(selector);
  var uniquePreloads = [],
      seenUrls = [];

  for (var i = 0, len = preloads.length; i < len; ++i) {
    var preload = preloads[i];

    if (seenUrls.indexOf(preload.href) === -1) {
      seenUrls.push(preload.href);
      uniquePreloads.push(preload);
    }
  }

  return uniquePreloads;
};

exports.getPreloads = getPreloads;