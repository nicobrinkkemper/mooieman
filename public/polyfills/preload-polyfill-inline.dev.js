(function () {
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
    console.log("".concat(error ? "error when preloading" : "successfully preloaded", " \"").concat(element.href, "\""));
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

  window.invokePreload = window.invokePreload || {};
  invokePreload.onLoad = setLoaded;
  invokePreload.onScriptLoad = setLoaded;

  invokePreload.onScriptError = function (link) {
    return setLoaded(link, true);
  };

  invokePreload.onStyleLoad = processCss;

}());
