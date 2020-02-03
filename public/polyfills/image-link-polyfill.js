/**
 * 
 *
 * @param {HTMLImageElement|HTMLLinkElement} element
 * @returns HTMLImageElement|HTMLLinkElement
 */
var imageLinkPolyfill = (function () {
    var linkLoadStartSupport;
    var imgLoadStartSupport;
    var linkLoadStartSupport;
    var testImg;
    var testLink;
    var linkPolyfill = function linkPolyfill(element) {
        var img = new Image();

        img.onload = function (event) {
            if (dev) console.log(element.tagName, 'dispatch load')
            element.dispatchEvent(new CustomEvent("load", event));
        };

        img.onloadstart = function (event) {
            if (dev) console.log(element.tagName, 'dispatch loadstart')
            element.dispatchEvent(new CustomEvent("loadstart", event));
        };

        img.onerror = function (event) {
            if (dev) console.log(element.tagName, 'dispatch error')
            element.dispatchEvent(new CustomEvent("error", event));
        };
        img.src = element.href;
        return img;
    };
    var loadImage = function loadImage(element, src){
        if (src && element.tagName === 'LINK') element.href = src
        else if (src && element.tagName === 'IMG') element.src = src
        if (!linkSupport && element.tagName === 'LINK') element = linkPolyfill(element)
        if (
            (element.tagName === 'LINK' && !linkLoadStartSupport)
            || (element.tagName === 'IMG' && !imgLoadStartSupport)
        ) element.dispatchEvent(new CustomEvent("loadstart", event));
        return element
    }
    // create a <img> and see if onloadstart gets called automatically by the browser
    try{
        testImg = new Image();
        testImg.onloadstart = function () { imgLoadStartSupport = true; };
        testImg.onload = function () { testImg = null };
        testImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
    } catch(error) {
        imgLoadStartSupport = false
        if (dev) console.log('no <img> Support', error)
    }
    // do the same for <link> tags
    try {
        testLink = document.createElement("link");
        if (!testLink.relList.supports("preload")) throw Error;
        if (dev) console.log('has <link> support', error)
        linkSupport = true;
        testLink.onloadstart = function () { linkLoadStartSupport = true; };
        testLink.onload = function () { testLink = null };
        testLink.href = testImg.src
    } catch (error) {
        linkSupport = false
        linkLoadStartSupport = false;
        if (dev) console.log('no <link> Support', error)
    }
    return loadImage
});