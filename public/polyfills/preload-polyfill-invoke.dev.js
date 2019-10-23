var preload_polyfill_invoke = (function () {
  'use strict';

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

  var activateStylesheet = function activateStylesheet(link) {
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("media", "all");
    link.setAttribute("preloaded", "true");
    link.removeAttribute("as");
  };
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

  var setNonCriticalAsync = true;

  var processLink = function processLink(link, isAsync, resolve) {
    if (link.getAttribute("preloaded") === "true") {
      processScript(link, isAsync, resolve);
    } else if (link.getAttribute("preloaded") === "error") {
      resolve();
    } else {
      setTimeout(function () {
        processLink(link, isAsync, resolve);
      }, 10);
    }
  };

  var invokeCriticalLinkResources = function invokeCriticalLinkResources(preloads) {
    var promises = [];

    while (preloads.length) {
      promises.push(new Promise(function (resolve) {
        processLink(preloads.shift(), false, resolve);
      }));
    }

    return Promise.all(promises);
  };

  var invokeNonCriticalLinkResources = function invokeNonCriticalLinkResources(preloads) {
    var promises = [];

    while (preloads.length) {
      promises.push(new Promise(function (resolve) {
        processLink(preloads.shift(), setNonCriticalAsync, resolve);
      }));
    }

    return Promise.all(promises);
  };

  var perfLog = function perfLog() {
    if (window.performance && window.performance.now) {
      console.log(window.performance.now());
    }
  };

  var invokePreloads = function invokePreloads() {
    perfLog();
    var preloads = getPreloads("link[rel='preload'][as='script']");
    var preload,
        criticals = [],
        noncriticals = [];

    while ((preload = preloads.shift()) !== undefined) {
      if (!skipNonMatchingModules(preload)) {
        if (preload.hasAttribute("critical")) {
          criticals.push(preload);
        } else {
          noncriticals.push(preload);
        }
      }
    }

    setNonCriticalAsync = criticals.length === 0;
    console.log("check for invokable preload invocations", criticals, noncriticals); // first comes the criticals

    invokeCriticalLinkResources(criticals).then(function () {
      return invokeNonCriticalLinkResources(noncriticals);
    }).then(function () {
      document.dispatchEvent(new CustomEvent("AllScriptsExecuted"));
      perfLog();
    });
  };

  document.addEventListener("DOMContentLoaded", invokePreloads);
  var invoke = (function (element) {
    var preload;
    var preloads = getPreloads("link[rel='preload']", element);

    while ((preload = preloads.shift()) !== undefined) {
      if (preload.getAttribute("as") === "script") {
        if (!skipNonMatchingModules(preload)) {
          processScript(preload, false);
        }
      } else if (preload.getAttribute("as") === "style") {
        processCss(preload);
      } else {
        console.error("unprocessable preload found", preload);
      }
    }
  });

  return invoke;

}());
