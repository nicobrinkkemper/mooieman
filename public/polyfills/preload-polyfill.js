var preload_polyfill = (function () {
  'use strict';

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
      return true;
    } catch (e) {
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

  var TIMEOUT = 3000;
  /**
   * called when a preload is loaded
   */

  var onLoad = function onLoad(event, element) {
    //immediate invoke css
    if (element.getAttribute("as") === "style") {
      setLoaded(element);
      processCss(element);
      return;
    }

    setLoaded(element);
    element.dispatchEvent(new CustomEvent("load", event));
  };

  var onError = function onError(event, element) {
    setLoaded(element, true);
  };

  var timeoutPromise = function timeoutPromise(ms, promise) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        return reject(new Error("timeout"));
      }, ms);
      promise.then(resolve, reject);
    });
  };

  var loadWithFetch = function loadWithFetch(element) {
    var options = {
      method: "GET",
      mode: "cors",
      cache: "force-cache"
    };
    timeoutPromise(TIMEOUT, fetch(element.href, options)).then(function (response) {
      if (response.ok) {
        onLoad(null, element);
      } else {
        onError(null, element);
      }
    }).catch(function () {
      return onError(null, element);
    });
  };
  /**
   * load preload with non-blocking xhr
   */


  var loadWithXhr = function loadWithXhr(element) {
    if (window.fetch) {
      return loadWithFetch(element);
    }

    var request = new XMLHttpRequest();
    request.addEventListener("load", function (event) {
      if (request.status >= 200 && request.status < 300) {
        onLoad(event, element);
      } else {
        onError(event, element);
      }
    });
    request.open("GET", element.href, true);
    request.timeout = TIMEOUT;
    request.send();
  };

  var loadImage = function loadImage(element) {
    var img = new Image();

    img.onload = function (event) {
      return onLoad(event, element);
    };

    img.onerror = function (event) {
      return onError(event, element);
    };

    img.src = element.href;
  };

  var loadStyle = function loadStyle(element) {
    element.onload = function (event) {
      return onLoad(event, element);
    };

    element.onerror = function (event) {
      return onError(event, element);
    };

    element.media = "none";
    element.type = "text/css";
    element.rel = "stylesheet";
  };

  var loadFont = function loadFont(element) {
    if (!document.fonts) {
      return loadWithXhr(element);
    } //TODO adding ttf ... to fontfaceset


    if (!element.hasAttribute("name")) {
      return loadWithXhr(element);
    }

    var f = new FontFace(element.getAttribute("name"), "url(".concat(element.href, ")"), {
      weight: element.getAttribute("weight") || "normal",
      style: "normal"
    });
    f.load(element.href).then(function (loadedFace) {
      document.fonts.add(loadedFace);
      onLoad(null, element);
    }).catch(function () {});
  };

  var loadScript = function loadScript(element) {
    if (element.getAttribute("rel") === "nomodule") {
      element.setAttribute("rel", "preload");
    }

    return loadWithXhr(element);
  };

  var load = function load(element) {
    switch (element.getAttribute("as")) {
      case "script":
        loadScript(element);
        break;

      case "image":
        loadImage(element);
        break;

      case "style":
        loadStyle(element);
        break;

      case "font":
        loadFont(element);
        break;

      default:
        loadWithXhr(element);
    }
  };

  var processed = [];
  /**
   * filters all [rel="preload"] from actual mutations and invokes "preloadLinkByElement"
   */

  var preloadLinkByMutation = function preloadLinkByMutation(mutations) {
    for (var i = 0, len = mutations.length; i < len; i++) {
      var addedNodes = mutations[i].addedNodes;

      for (var j = 0, _len = addedNodes.length; j < _len; j++) {
        var element = addedNodes[j];

        if (element.nodeName === "LINK" && element.hasAttribute("rel") && (element.getAttribute("rel") === "preload" || element.getAttribute("rel") === "nomodule")) {
          preloadLinkByElement(element);
        }
      }
    }
  };
  /**
   * do the background fetching for a [rel="preload"]
   */


  var preloadLinkByElement = function preloadLinkByElement(element) {
    if (processed.indexOf(element.href) !== -1) {
      return;
    }

    if (skipNonMatchingModules(element)) {
      return;
    }

    load(element);
    processed.push(element.href);
  };
  /**
   * watch for preload elements to come after loading this script
   */


  var observeMutations = function observeMutations() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'link[rel="preload"]';

    // preload link[rel="preload"] by mutation
    if (window.MutationObserver) {
      var observer = new MutationObserver(function (mutations) {
        return preloadLinkByMutation(mutations);
      }).observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      document.addEventListener("DOMContentLoaded", function () {
        if (observer) {
          observer.disconnect();
        }
      });
    } else {
      var searchInterval = setInterval(function () {
        if (document.readyState == "complete") {
          clearInterval(searchInterval);
          scanPreloads(selector);
        }
      }, 50);
    }
  };
  /**
   * scan and preload resources
   */


  var scanPreloads = function scanPreloads() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'link[rel="preload"]';
    // preload link[rel="preload"] by selector
    var preloads = getPreloads(selector);
    var link;

    while ((link = preloads.shift()) !== undefined) {
      preloadLinkByElement(link);
    }
  };
  var polyfill = function polyfill(selector) {
    scanPreloads(selector);
    observeMutations(selector);
  };

  /**
   * entrypoint, also binds DOMContentLoaded to the invocation of preloaded scripts
   */

  var preloadPolyfill = function preloadPolyfill() {
    try {
      if (!document.createElement("link").relList.supports("preload")) {
        throw Error;
      }
    } catch (error) {
      polyfill('link[rel="preload"]');
    }
  };

  var polyfill$1 = preloadPolyfill();

  return polyfill$1;

}());
