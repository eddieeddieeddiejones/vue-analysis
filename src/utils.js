var config = require('./config'),
    join = Array.prototype.toString,
    attrs = config.attrs

// 这里为什么这么写？？？？？？？
// PhantomJS doesn't support rAF, yet it has the global
// variable exposed. Use setTimeout so tests can work.
var defer = navigator.userAgent.indexOf('PhantomJS') > -1
    ? window.setTimeout
    : (window.webkitRequestAnimationFrame ||
        window.requestAnimationFrame ||
        window.setTimeout)

/**
 * create a prototype-less object
 * which is a better hash/map
 */
function makeHash () {
    return Object.create(null)
}

var utils = module.exports = {
    hash: makeHash,
    /**
     * convert certain option values to the desired format.
     */
     processOptions: function (options) {
        var components = options.components,
            partials = options.partials,
            template = options.template,
            key
        if (components) {
            // TODO
        }
        if (partials) {
            // todo
        }
        if (template) {
            // todo
        }
     },

     /**
      * simple extend
      */
     extend: function (obj, ext, protective) {
        for (var key in ext) {
            if (protective && obj[key]) continue
            obj[key] = ext[key]
        } 
     },
     /**
      * log for debugging
      */
     log: function () {
        if (config.debug && console) {
            console.log(join.call(arguments, ' '))
        }
     },
     /**
      * define an innumerable property
      * this avoids it being included in JSON.stringify
      * or for ... in loops
      */
     defProtected: function (obj, key, val, innumerable, configurable) {
        if (obj.hasOwnProperty(key)) return
        Object.defineProperty(obj, key, {
            value: val,
            innumerable: !!innumerable,
            configurable: !!configurable
        })
     },
     /**
      * get an attribute and remove it
      */
     attr: function (el, type, noRemove) {
        var attr = attrs[type],
            val = el.getAttribute(attr)
        if(!noRemove && val != null) el.removeAttribute(attr)
        return val
     },
     /**
      * Accurate type check
      * internal use only, so no need to check for NaN
      */
     typeOf: function (obj) {
        return toString.call(obj).slice(8, -1)
     },

     /**
      * used to defer batch updates
      */
     nextTick: function (cb) {
        defer(cb, 0)
     }
}