;(function(){
'use strict';

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    throwError()
    return
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  function throwError () {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.exts = [
    '',
    '.js',
    '.json',
    '/index.js',
    '/index.json'
 ];

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  for (var i = 0; i < 5; i++) {
    var fullPath = path + require.exts[i];
    if (require.modules.hasOwnProperty(fullPath)) return fullPath;
    if (require.aliases.hasOwnProperty(fullPath)) return require.aliases[fullPath];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {

  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' === path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }
  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throwError()
    return
  }
  require.aliases[to] = from;

  function throwError () {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' === c) return path.slice(1);
    if ('.' === c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = segs.length;
    while (i--) {
      if (segs[i] === 'deps') {
        break;
      }
    }
    path = segs.slice(0, i + 2).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-emitter/index.js", function(exports, require, module){
/**
 * Expose 'Emitter'.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new 'Emitter'.
 *
 * @api public
 */
function Emitter (obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin (obj) {
  for (var key in Emitter.prototype) {
    object[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

 Emitter.prototype.on = 
 Emitter.prototype.addEventListener = function (event, fn) {
 	this._callbacks = this._callbacks || {}
 	;(this._callbacks['$' + event] = this._callbacks['$' + event] || [])
 		.push(fn);
 	return this;
 }


 /**
  * Emit `event` with the given args.
  *
  * @param {String} event
  * @param {Mixed} ...
  * @return {Emitter}
  */
 Emitter.prototype.emit = function (event) {
 	this._callbacks = this._callbacks || {}
 	// ["set", "todos", Array(4), callee: (...), Symbol(Symbol.iterator): ƒ]
 	// console.log(arguments)
 	var args = [].slice.call(arguments, 1),
    callbacks = this._callbacks['$' + event]
 	// ["todos", Array(4)]
 	// console.log(args)
  if (callbacks) {
    callbacks = callbacks.slice(0)
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args)
    }
  }
  return this
 }

});
require.register("vue/src/main.js", function(exports, require, module){
var ViewModel = require('./viewmodel'),
	directives = require('./directives')

/**
 * Allow user to register/retrieve a directive definition
 */
ViewModel.directive = function (id, fn) {
	// ViewModel.directive = function (id, fn) {
	// console.log(directives)
	if (!fn) return directives[id] 
	directives[id] = fn
	return this
}

module.exports = ViewModel
});
require.register("vue/src/emitter.js", function(exports, require, module){
// shiv to make this work for Component, Browserify and Node at the same time.
var Emitter,
    componentEmitter = 'emitter'

try {
    // Requiring without a string literal will make browserify
    // unable to parse the dependency, thus preventing it from
    // stopping the compilation after a failed lookup.
    Emitter = require(componentEmitter)
} catch (e) {
    Emitter = require('events').EventEmitter
    Emitter.prototype.off = function () {
        var method = arguments.length > 1
            ? this.removeListener
            : this.removeAllListeners
        return method.apply(this, arguments)
    }
}

module.exports = Emitter
});
require.register("vue/src/config.js", function(exports, require, module){
var prefix = 'v',
    specialAttributes = [
        'pre',
        'text',
        'repeat',
        'partial',
        'component',
        'component-id',
        'transition'
    ],
    config = module.exports = {

        async       : true,
        debug       : false,
        silent      : false,
        enterClass  : 'v-enter',
        leaveClass  : 'v-leave',
        attrs       : {},

        get prefix () {
            return prefix
        },
        set prefix (val) {
            prefix = val
            updatePrefix()
        }
        
    }

function updatePrefix () {
    specialAttributes.forEach(function (attr) {
        config.attrs[attr] = prefix + '-' + attr
    })
}

updatePrefix()
});
require.register("vue/src/utils.js", function(exports, require, module){
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
     },
     /**
      * get an attribute and remove it
      */
     attr: function (el, type, noRemove) {
        var attr = attrs[type],
            val = el.getAttribute(attr)
        if (!noRemove && val != null) el.removeAttribute(attr)
        return val
     }
}
});
require.register("vue/src/compiler.js", function(exports, require, module){
console.log('test')
var utils = require('./utils'),
	extend = utils.extend,
	log = utils.log,
	Emitter = require('./emitter'),
    makeHash = utils.hash,
    def = utils.defProtected,
    Observer = require('./observer'),
    hasOwn = Object.prototype.hasOwnProperty,
    Binding = require('./binding'),
    config = require('./config'),
    TextParser = require('./text-parser'),
    slice = Array.prototype.slice

// {processOptions: ƒ, extend: ƒ}
// console.log(utils)
function Compiler (vm, options) {
    var compiler = this
    // indicate that we are intiating this instance
    // so we should not run any transitions
    compiler.init = true

    // process and extend options
    options = compiler.options = options || makeHash()
    utils.processOptions(options)

    // copy data, methods & compiler options
    var data = compiler.data = options.data || {}
    extend(vm, data, true)
    extend(vm, options.methods, true)
    extend(compiler, options.compilerOptions)

    // initialize element
    var el = compiler.setupElement(options)
    log('nnew VM instance:', el.tagName, '\n')

    // set compiler properties
    compiler.vm = vm
    compiler.dirs = []
    compiler.exps = []
    compiler.computed = []
    compiler.childCompilers = []
    compiler.emitter = new Emitter()

    // inherit parent bindings
    var parent = compiler.parentCompiler
    compiler.bindings = parent
        ? Object.create(parent.bindings)
        : makeHash()
    compiler.rootCompiler = parent
        ? getRoot(parent)
        : compiler
    def(vm, '$', makeHash())
    def(vm, '$el', el)
    def(vm, '$compiler', compiler)
    def(vm, '$root', compiler.rootCompiler.vm)

    // set parent VM
    // and register child id on parent
    var childId = utils.attr(el, 'component-id')
    if (parent) {
        // tod...
    }

    // setup observer
    compiler.setupOberver()

    // beforeCompiler hook
    compiler.execHook('beforeCompile', 'created')

    // the user might have set some props on the vm
    // so copy it back to the data ...
    extend(data, vm)

    // observe the data
    Observer.observe(data, '', compiler.observer)

    // for repeated items, create an index binding
    // which should be inenumerable but configurable
    if (compiler.repeat) {
        // tod...
    }

    // allow the $data object to be swapped
    Object.defineProperty(vm, '$data', {
        enumerable: false,
        get: function () {
            // tod...
        },
        set: function (newData) {
            // tod...
        }
    })

    // now parse the DOM, during which we will create necessary bindings
    // and bind the parsed directives
    compiler.compile(el, true)
}
var CompilerProto = Compiler.prototype

/**
 * Initialize the VM/Compiler's element.
 * Fill it in with the template if necessary. 
 */
CompilerProto.setupElement = function (options) {
	// create the node first
	var el = this.el = typeof options.el === 'string'
		? document.querySelector(options.el)
		: options.el || document.createElement(options.tagName || 'div')

	var template = options.template
	if (template) {
		// tod...
	}

	// apply element options
	if (options.id) el.id = options.id
	if (options.className) el.className = options.className
	var attrs = options.attributes
	if (attrs) {
		// tod...
	}

	return el
}
/**
 * Setup observer.
 * The observer listens for get/set/mutate events on all VM
 * values/objects and trigger corresponding binding updates.
 */
CompilerProto.setupOberver = function () {
    var compiler = this,
        bindings = compiler.bindings,
        observer = compiler.observer = new Emitter()

    // a hash to hold event proxies for each root level key
    // so they can be referenced and removed later
    observer.proxies = makeHash()

    // add own listeners which trigger binding updates
    observer
        .on('get', function (key) {
            // tod...
        })
        .on('set', function (key, val){
            observer.emit('chagne:' + key, val)
            check(key)
            bindings[key].update(val)
        })
        .on('mutate', function (key, val, mutation){
            // tod...
        })
    function check (key) {
        if (!hasOwn.call(bindings, key)) {
            compiler.createBinding(key)
        }
    }
}

/**
 * Excute a user hook
 */
CompilerProto.execHook = function (id, alt) {
    var opts = this.options,
        hook = opts[id] || opts[alt]
    if (hook) {
        hook.call(this.vm, opts)
    }
}

/**
 * Create binding and attach getter/setter for a key to the viewmodel object
 */
CompilerProto.createBinding = function (key, isExp, isFn) {
    var compiler = this,
        bindings = compiler.bindings,
        binding = new Binding(compiler, key, isExp, isFn)
    if (isExp) {
        // tod...
    } else {
        log(' created binding: ' + key)
        bindings[key] = binding
        // make sure the key exists in the object so it can be observerd
        // by the Observer!
        if (binding.root) {
            // this is a root level binding.we need to define getter/setter for it.
            compiler.define(key, binding)
        } else {
            // ensure path in data so it can be observerd
            Observer.ensurePath(compiler.data, key)
            var parentKey = key.slice(0, key.lastIndexOf('.'))
            if (!hasOwn.call(bindings, parentKey)) {
                // tod...
            }
        }
    }
    return binding
}

/**
 * Defines the getter/stter for a root-level binding on the VM
 * and observe the initial value
 */
CompilerProto.define = function (key, binding) {
    log('  defined root binding: ' + key)
    var compiler = this,
        data     = compiler.data,
        vm       = compiler.vm,
        ob       = data.__observer__
    
    if (!(key in data)) {
        // todo...
    }

    // if the data object is already observed, but the key
    // is not observed, we need to add it to the observed keys
    if (ob && !(key in ob.values)) {
        // tod...
    }
    
    var value = binding.value = data[key]
    if (utils.typeOf(value) === 'Object' && value.$get) {
        // tod...
    }

    Object.defineProperty(vm, key, {
        enumerable: !binding.isComputed,
        get: binding.isComputed
            ? function () {
                return compiler.data[key].$get()
            }
            : function () {
                return compiler.data[key]
            },
        set: binding.isComputed
            ? function (val) {
                if (compiler.data[key].$set) {
                    compiler.data[key].$set(val)
                }
            }
            : function (val) {
                compiler.data[key] = val
            }
    })
}
/**
 * Compile a DOM node(recursive)
 */
CompilerProto.compile = function (node, root) {
    var compiler = this,
        nodeType = node.nodeType,
        tagName  = node.tagName

    if (nodeType === 1 && tagName !== 'SCRIPT') { // a normal node

        // skip anything with v-pre
        if (utils.attr(node, 'pre') !== null) return

        // special attributes to check
        var repeatExp,
            componentExp,
            partialId,
            directive

        // It is important that we access these attributes
        // procedurally because the order matters.
        //
        // `utils.attr` removes the attribute once it gets the
        // value, so we should not access them all at once.

        // v-repeat has the highest priority
        // and we need to preserve all other attributes for it.
        /* jshint boss: true */
        if (repeatExp = utils.attr(node, 'repeat')) {

            // tod...

        // v-component has 2nd highest priority
        } else if (!root && (componentExp = utils.attr(node, 'component'))) {

            // tod...

        } else {
            
            // check transition property
            node.vue_trans = utils.attr(node, 'transition')
            
            // replace innerHTML with partial
            partialId = utils.attr(node, 'partial')
            if (partialId) {
                // tod...
            }

            // finally, only normal directives left!
            compiler.compileNode(node)
        }
    } else if (nodeType === 3) { // text node

        compiler.compileTextNode(node)

    }
}

/**
 *  Compile a normal node
 */
CompilerProto.compileNode = function (node) {
    var i, j,
        attrs = node.attributes,
        prefix = config.prefix + '-'
    // parse if has attributes
    if (attrs && attrs.length) {
        var attr, isDirective, exps, exp, directive
        // loop through all attributes
        i = attrs.length
        while (i--) {
            attr = attrs[i]
            isDirective = false

            if (attr.name.indexOf(prefix) === 0) {
                // tod...
            } else {
                // non directive attribute, check interpolation tags
                exp = TextParser.parseAttr(attr.value)
                if (exp) {
                    // tod...
                }
            }

            if (isDirective) node.removeAttribute(attr.name)
        }
    }
    
    // recursively compile childNodes
    // todo 这里debug没有结束
    if (node.childNodes.length) {
        var nodes = slice.call(node.childNodes)
        for (i = 0, j = nodes.length; i < j; i++) {
            this.compile(nodes[i])
        }
    }
}
/**
 *  Compile a text node
 */
CompilerProto.compileTextNode = function (node) {
    var tokens = TextParser.parse(node.nodeValue)
    if (!tokens) return
    // tod...
}

module.exports = Compiler
});
require.register("vue/src/viewmodel.js", function(exports, require, module){
var Compiler = require('./compiler')
function ViewModel (options) {
    // console.log(1)
    // console.log(Compiler)
    new Compiler(this, options)
}
// console.log(ViewModel)
module.exports = ViewModel
});
require.register("vue/src/binding.js", function(exports, require, module){
var id = 0
var batcher = require('./batcher')


function Binding (compiler, key, isExp, isFn) {
	this.id = id++
	this.value = undefined
	this.isExp = !!isExp
	this.isFn = isFn
	this.root = !this.isExp && key.indexOf('.') === -1
	this.compiler = compiler
	this.key = key
	this.instances = []
	this.subs = []
	this.deps = []
	this.unbound = false
}

var BindingProto = Binding.prototype
BindingProto.update = function (value) {
	this.value = value
	batcher.queue(this, 'update')
}
module.exports = Binding
});
require.register("vue/src/observer.js", function(exports, require, module){
var ViewModel,
	utils = require('./utils'),
	Emitter = require('./emitter'),

	// cache methods
	typeOf = utils.typeOf,
	def = utils.defProtected,

	// types
	OBJECT = 'Object',
	ARRAY = 'Array'
/**
 * check if a value is watchable
 */
function isWatchable (obj) {
	ViewModel = ViewModel || require('./viewmodel')
	var type = typeOf(obj)
	return (type === OBJECT || type === ARRAY) && !(obj instanceof ViewModel)
}

/**
 * Watch an Object, recursive
 */
function watchObject (obj) {
	for (var key in obj) {
		convert(obj, key)
	}
}

/**
 * Define an accessors for a property ob an object
 * so it emits get/set events.
 * Then watch the valueitself.
 */
function convert (obj, key) {
	var keyPrefix = key.charAt(0)
	if ((keyPrefix === '$' || keyPrefix === '_') && key !== '$index') {
		// tod...
	}
	// emit set ob bind
	// this means when an object is observed it will emit
	// a first batch of set events
	var observer = obj.__observer__,
		values = observer.values,
		val = values[key] = obj[key]
	observer.emit('set', key, val)
	
	if (Array.isArray(val)) {
		observer.emit('set', key + '.length', val.length)
	}
	Object.defineProperty(obj, key, {
	    get: function () {
	    	// tod...
	    },
	    set: function (newVal) {
	    	// tod...
	    }
	})
	observe(val, key, observer)
}

/**
 * Observe an object with a given path,
 * and proxy get/set/mutate events to the provided observer
 * 
 */
// obj = {todos: Array(4), allDone: {…}, updateFilter: ƒ, addTodo: ƒ, removeTodo: ƒ, …}, rawPath = "", observer = Emitter {proxies: {…}, _callbacks: {…}}
function observe (obj, rawPath, observer) {
    if (!isWatchable(obj)) return
    var path = rawPath ? rawPath + '.' : '',
		ob,
		alreadyConverted = !! obj.__observer__
	if (!alreadyConverted) {
		def(obj, '__observer__', new Emitter())
	}
	ob = obj.__observer__
	ob.values = ob.values || utils.hash()
	observer.proxies = observer.proxies || {}
	var proxies = observer.proxies[path] = {
		get: function () {
			// tod..
		},
		set: function (key, val) {
			observer.emit('set', path + key, val)
		},
		mutate: function () {
			// tod...
		}
	}
	ob
		.on('get', proxies.get)
		.on('set', proxies.set)
		.on('mutate', proxies.mutate)
	if (alreadyConverted) {
		// tod...
	} else {
		var type = typeOf(obj)
		if (type === OBJECT) {
			watchObject(obj)
		} else if (type === ARRAY) {
			watchArray(obj)
		}
	}
}
/**
 * walk along a path and make sure it can be accessed
 * and enumerated in that object
 */
function ensurePath (obj, key) {
	var path = key.split('.'), sec
	for (var i = 0, d = path.length - 1; i < d; i++) {
	    sec = path[i]
	    if (!obj[sec]) {
	        // tod...
	    }
	    obj = obj[sec]
	}
	if (typeOf(obj) === OBJECT) {
	    // tod...
	}
}

/**
 * Watch an Array,overload mutation methods
 * and add augmentations by intercepting the prototype chain
 */

function watchArray (arr, path) {
	var observer = arr.__observer__
	if (!observer) {
		// tod...
	}
}

module.exports = {
    observe: observe,
    ensurePath: ensurePath
}
});
require.register("vue/src/directive.js", function(exports, require, module){
var utils      = require('./utils'),
    directives = require('./directives'),
    filters    = require('./filters'),

    // Regexes!

    // regex to split multiple directive expressions
    // split by commas, but ignore commas within quotes, parens and escapes.
    SPLIT_RE        = /(?:['"](?:\\.|[^'"])*['"]|\((?:\\.|[^\)])*\)|\\.|[^,])+/g,

    // match up to the first single pipe, ignore those within quotes.
    KEY_RE          = /^(?:['"](?:\\.|[^'"])*['"]|\\.|[^\|]|\|\|)+/,

    ARG_RE          = /^([\w- ]+):(.+)$/,
    FILTERS_RE      = /\|[^\|]+/g,
    FILTER_TOKEN_RE = /[^\s']+|'[^']+'/g,
    NESTING_RE      = /^\$(parent|root)\./,
    SINGLE_VAR_RE   = /^[\w\.\$]+$/

/**
 *  Directive class
 *  represents a single directive instance in the DOM
 */
function Directive (definition, expression, rawKey, compiler, node) {

    this.compiler = compiler
    this.vm       = compiler.vm
    this.el       = node

    var isSimple  = expression === ''

    // mix in properties from the directive definition
    if (typeof definition === 'function') {
        this[isSimple ? 'bind' : '_update'] = definition
    } else {
        for (var prop in definition) {
            if (prop === 'unbind' || prop === 'update') {
                this['_' + prop] = definition[prop]
            } else {
                this[prop] = definition[prop]
            }
        }
    }

    // empty expression, we're done.
    if (isSimple) {
        this.isSimple = true
        return
    }

    this.expression = expression.trim()
    this.rawKey     = rawKey
    
    parseKey(this, rawKey)

    this.isExp = !SINGLE_VAR_RE.test(this.key) || NESTING_RE.test(this.key)
    
    var filterExps = this.expression.slice(rawKey.length).match(FILTERS_RE)
    if (filterExps) {
        this.filters = []
        var i = 0, l = filterExps.length, filter
        for (; i < l; i++) {
            filter = parseFilter(filterExps[i], this.compiler)
            if (filter) this.filters.push(filter)
        }
        if (!this.filters.length) this.filters = null
    } else {
        this.filters = null
    }
}

var DirProto = Directive.prototype

/**
 *  parse a key, extract argument and nesting/root info
 */
function parseKey (dir, rawKey) {
    var key = rawKey
    if (rawKey.indexOf(':') > -1) {
        var argMatch = rawKey.match(ARG_RE)
        key = argMatch
            ? argMatch[2].trim()
            : key
        dir.arg = argMatch
            ? argMatch[1].trim()
            : null
    }
    dir.key = key
}

/**
 *  parse a filter expression
 */
function parseFilter (filter, compiler) {

    var tokens = filter.slice(1).match(FILTER_TOKEN_RE)
    if (!tokens) return
    tokens = tokens.map(function (token) {
        return token.replace(/'/g, '').trim()
    })

    var name = tokens[0],
        apply = compiler.getOption('filters', name) || filters[name]
    if (!apply) {
        utils.warn('Unknown filter: ' + name)
        return
    }

    return {
        name  : name,
        apply : apply,
        args  : tokens.length > 1
                ? tokens.slice(1)
                : null
    }
}

/**
 *  called when a new value is set 
 *  for computed properties, this will only be called once
 *  during initialization.
 */
DirProto.update = function (value, init) {
    if (!init && value === this.value) return
    this.value = value
    this.apply(value)
}

/**
 *  -- computed property only --
 *  called when a dependency has changed
 */
DirProto.refresh = function (value) {
    // pass element and viewmodel info to the getter
    // enables context-aware bindings
    if (value) this.value = value

    if (this.isFn) {
        value = this.value
    } else {
        value = this.value.$get()
        if (value !== undefined && value === this.computedValue) return
        this.computedValue = value
    }
    this.apply(value)
}

/**
 *  Actually invoking the _update from the directive's definition
 */
DirProto.apply = function (value) {
    this._update(
        this.filters
            ? this.applyFilters(value)
            : value
    )
}

/**
 *  pipe the value through filters
 */
DirProto.applyFilters = function (value) {
    var filtered = value, filter
    for (var i = 0, l = this.filters.length; i < l; i++) {
        filter = this.filters[i]
        filtered = filter.apply.call(this.vm, filtered, filter.args)
    }
    return filtered
}

/**
 *  Unbind diretive
 *  @ param {Boolean} update
 *    Sometimes we call unbind before an update (i.e. not destroy)
 *    just to teardown previous stuff, in that case we do not want
 *    to null everything.
 */
DirProto.unbind = function (update) {
    // this can be called before the el is even assigned...
    if (!this.el) return
    if (this._unbind) this._unbind(update)
    if (!update) this.vm = this.el = this.binding = this.compiler = null
}

// exposed methods ------------------------------------------------------------

/**
 *  split a unquoted-comma separated expression into
 *  multiple clauses
 */
Directive.split = function (exp) {
    return exp.indexOf(',') > -1
        ? exp.match(SPLIT_RE) || ['']
        : [exp]
}

/**
 *  make sure the directive and expression is valid
 *  before we create an instance
 */
Directive.parse = function (dirname, expression, compiler, node) {
    // var dirname = 'text',
    //     expression = 'abc',
    //     compiler = {
    //             options: {},
    //             getOption: function () {},
    //             vm: {
    //                 constructor: {}
    //             }
    //         }
    var dir = compiler.getOption('directives', dirname) || directives[dirname]
    if (!dir) return utils.warn('unknown directive: ' + dirname)

    var rawKey
    if (expression.indexOf('|') > -1) {
        var keyMatch = expression.match(KEY_RE)
        if (keyMatch) {
            rawKey = keyMatch[0].trim()
        }
    } else {
        rawKey = expression.trim()
    }
    
    // have a valid raw key, or be an empty directive
    return (rawKey || expression === '')
        ? new Directive(dir, expression, rawKey, compiler, node)
        : utils.warn('invalid directive expression: ' + expression)
}

module.exports = Directive
});
require.register("vue/src/exp-parser.js", function(exports, require, module){
var utils = require('./utils'),
    hasOwn = Object.prototype.hasOwnProperty

// Variable extraction scooped from https://github.com/RubyLouvre/avalon

var KEYWORDS =
        // keywords
        'break,case,catch,continue,debugger,default,delete,do,else,false' +
        ',finally,for,function,if,in,instanceof,new,null,return,switch,this' +
        ',throw,true,try,typeof,var,void,while,with,undefined' +
        // reserved
        ',abstract,boolean,byte,char,class,const,double,enum,export,extends' +
        ',final,float,goto,implements,import,int,interface,long,native' +
        ',package,private,protected,public,short,static,super,synchronized' +
        ',throws,transient,volatile' +
        // ECMA 5 - use strict
        ',arguments,let,yield' +
        // allow using Math in expressions
        ',Math',
        
    KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g'),
    REMOVE_RE   = /\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|'[^']*'|"[^"]*"|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g,
    SPLIT_RE    = /[^\w$]+/g,
    NUMBER_RE   = /\b\d[^,]*/g,
    BOUNDARY_RE = /^,+|,+$/g

/**
 *  Strip top level variable names from a snippet of JS expression
 */
function getVariables (code) {
    code = code
        .replace(REMOVE_RE, '')
        .replace(SPLIT_RE, ',')
        .replace(KEYWORDS_RE, '')
        .replace(NUMBER_RE, '')
        .replace(BOUNDARY_RE, '')
    return code
        ? code.split(/,+/)
        : []
}

/**
 *  A given path could potentially exist not on the
 *  current compiler, but up in the parent chain somewhere.
 *  This function generates an access relationship string
 *  that can be used in the getter function by walking up
 *  the parent chain to check for key existence.
 *
 *  It stops at top parent if no vm in the chain has the
 *  key. It then creates any missing bindings on the
 *  final resolved vm.
 */
function getRel (path, compiler) {
    var rel = '',
        vm  = compiler.vm,
        dot = path.indexOf('.'),
        key = dot > -1
            ? path.slice(0, dot)
            : path
    while (true) {
        if (
            hasOwn.call(vm.$data, key) ||
            hasOwn.call(vm, key)
        ) {
            break
        } else {
            if (vm.$parent) {
                vm = vm.$parent
                rel += '$parent.'
            } else {
                break
            }
        }
    }
    compiler = vm.$compiler
    if (
        !hasOwn.call(compiler.bindings, path) &&
        path.charAt(0) !== '$'
    ) {
        compiler.createBinding(path)
    }
    return rel
}

/**
 *  Create a function from a string...
 *  this looks like evil magic but since all variables are limited
 *  to the VM's data it's actually properly sandboxed
 */
function makeGetter (exp, raw) {
    /* jshint evil: true */
    var fn
    try {
        fn = new Function(exp)
    } catch (e) {
        utils.warn('Invalid expression: ' + raw)
    }
    return fn
}

/**
 *  Escape a leading dollar sign for regex construction
 */
function escapeDollar (v) {
    return v.charAt(0) === '$'
        ? '\\' + v
        : v
}

module.exports = {

    /**
     *  Parse and return an anonymous computed property getter function
     *  from an arbitrary expression, together with a list of paths to be
     *  created as bindings.
     */
    parse: function (exp, compiler) {
        // extract variable names
        var vars = getVariables(exp)
        if (!vars.length) {
            return makeGetter('return ' + exp, exp)
        }
        vars = utils.unique(vars)
        var accessors = '',
            // construct a regex to extract all valid variable paths
            // ones that begin with "$" are particularly tricky
            // because we can't use \b for them
            pathRE = new RegExp(
                "[^$\\w\\.](" +
                vars.map(escapeDollar).join('|') +
                ")[$\\w\\.]*\\b", 'g'
            ),
            body = ('return ' + exp).replace(pathRE, function (path) {
                // keep track of the first char
                var c = path.charAt(0)
                path = path.slice(1)
                var val = 'this.' + getRel(path, compiler) + path
                accessors += val + ';'
                // don't forget to put that first char back
                return c + val
            })
        body = accessors + body
        return makeGetter(body, exp)
    }
}
});
require.register("vue/src/text-parser.js", function(exports, require, module){
var BINDING_RE = /\{\{(.+?)\}\}/

/**
 *  Parse a piece of text, return an array of tokens
 */
function parse (text) {
    if (!BINDING_RE.test(text)) return null
    var m, i, tokens = []
    /* jshint boss: true */
    while (m = text.match(BINDING_RE)) {
        i = m.index
        if (i > 0) tokens.push(text.slice(0, i))
        tokens.push({ key: m[1].trim() })
        text = text.slice(i + m[0].length)
    }
    if (text.length) tokens.push(text)
    return tokens
}

/**
 *  Parse an attribute value with possible interpolation tags
 *  return a Directive-friendly expression
 */
function parseAttr (attr) {
    var tokens = parse(attr)
    if (!tokens) return null
    var res = [], token
    for (var i = 0, l = tokens.length; i < l; i++) {
        token = tokens[i]
        res.push(token.key || ('"' + token + '"'))
    }
    return res.join('+')
}

exports.parse = parse
exports.parseAttr = parseAttr
});
require.register("vue/src/deps-parser.js", function(exports, require, module){
var Emitter  = require('./emitter'),
    utils    = require('./utils'),
    observer = new Emitter()

/**
 *  Auto-extract the dependencies of a computed property
 *  by recording the getters triggered when evaluating it.
 */
function catchDeps (binding) {
    if (binding.isFn) return
    utils.log('\n- ' + binding.key)
    var got = utils.hash()
    observer.on('get', function (dep) {
        var has = got[dep.key]
        if (has && has.compiler === dep.compiler) return
        got[dep.key] = dep
        utils.log('  - ' + dep.key)
        binding.deps.push(dep)
        dep.subs.push(binding)
    })
    binding.value.$get()
    observer.off('get')
}

module.exports = {

    /**
     *  the observer that catches events triggered by getters
     */
    observer: observer,

    /**
     *  parse a list of computed property bindings
     */
    parse: function (bindings) {
        utils.log('\nparsing dependencies...')
        observer.active = true
        bindings.forEach(catchDeps)
        observer.active = false
        utils.log('\ndone.')
    }
    
}
});
require.register("vue/src/filters.js", function(exports, require, module){
var keyCodes = {
    enter    : 13,
    tab      : 9,
    'delete' : 46,
    up       : 38,
    left     : 37,
    right    : 39,
    down     : 40,
    esc      : 27
}

module.exports = {

    /**
     *  'abc' => 'Abc'
     */
    capitalize: function (value) {
        if (!value && value !== 0) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
    },

    /**
     *  'abc' => 'ABC'
     */
    uppercase: function (value) {
        return (value || value === 0)
            ? value.toString().toUpperCase()
            : ''
    },

    /**
     *  'AbC' => 'abc'
     */
    lowercase: function (value) {
        return (value || value === 0)
            ? value.toString().toLowerCase()
            : ''
    },

    /**
     *  12345 => $12,345.00
     */
    currency: function (value, args) {
        if (!value && value !== 0) return ''
        var sign = (args && args[0]) || '$',
            s = Math.floor(value).toString(),
            i = s.length % 3,
            h = i > 0 ? (s.slice(0, i) + (s.length > 3 ? ',' : '')) : '',
            f = '.' + value.toFixed(2).slice(-2)
        return sign + h + s.slice(i).replace(/(\d{3})(?=\d)/g, '$1,') + f
    },

    /**
     *  args: an array of strings corresponding to
     *  the single, double, triple ... forms of the word to
     *  be pluralized. When the number to be pluralized
     *  exceeds the length of the args, it will use the last
     *  entry in the array.
     *
     *  e.g. ['single', 'double', 'triple', 'multiple']
     */
    pluralize: function (value, args) {
        return args.length > 1
            ? (args[value - 1] || args[args.length - 1])
            : (args[value - 1] || args[0] + 's')
    },

    /**
     *  A special filter that takes a handler function,
     *  wraps it so it only gets triggered on specific keypresses.
     */
    key: function (handler, args) {
        if (!handler) return
        var code = keyCodes[args[0]]
        if (!code) {
            code = parseInt(args[0], 10)
        }
        return function (e) {
            if (e.keyCode === code) {
                handler.call(this, e)
            }
        }
    }
}
});
require.register("vue/src/transition.js", function(exports, require, module){
var endEvent   = sniffTransitionEndEvent(),
    config     = require('./config'),
    enterClass = config.enterClass,
    leaveClass = config.leaveClass,
    // exit codes for testing
    codes = {
        CSS_E     : 1,
        CSS_L     : 2,
        JS_E      : 3,
        JS_L      : 4,
        CSS_SKIP  : -1,
        JS_SKIP   : -2,
        JS_SKIP_E : -3,
        JS_SKIP_L : -4,
        INIT      : -5,
        SKIP      : -6
    }

/**
 *  stage:
 *    1 = enter
 *    2 = leave
 */
var transition = module.exports = function (el, stage, cb, compiler) {

    var changeState = function () {
        cb()
        compiler.execHook(stage > 0 ? 'enteredView' : 'leftView')
    }

    if (compiler.init) {
        changeState()
        return codes.INIT
    }

    var transitionId = el.vue_trans

    if (transitionId) {
        return applyTransitionFunctions(
            el,
            stage,
            changeState,
            transitionId,
            compiler
        )
    } else if (transitionId === '') {
        return applyTransitionClass(
            el,
            stage,
            changeState
        )
    } else {
        changeState()
        return codes.SKIP
    }

}

transition.codes = codes

/**
 *  Togggle a CSS class to trigger transition
 */
function applyTransitionClass (el, stage, changeState) {

    if (!endEvent) {
        changeState()
        return codes.CSS_SKIP
    }

    var classList         = el.classList,
        lastLeaveCallback = el.vue_trans_cb

    if (stage > 0) { // enter

        // cancel unfinished leave transition
        if (lastLeaveCallback) {
            el.removeEventListener(endEvent, lastLeaveCallback)
            el.vue_trans_cb = null
        }

        // set to hidden state before appending
        classList.add(enterClass)
        // append
        changeState()
        // force a layout so transition can be triggered
        /* jshint unused: false */
        var forceLayout = el.clientHeight
        // trigger transition
        classList.remove(enterClass)
        return codes.CSS_E

    } else { // leave

        // trigger hide transition
        classList.add(leaveClass)
        var onEnd = function (e) {
            if (e.target === el) {
                el.removeEventListener(endEvent, onEnd)
                el.vue_trans_cb = null
                // actually remove node here
                changeState()
                classList.remove(leaveClass)
            }
        }
        // attach transition end listener
        el.addEventListener(endEvent, onEnd)
        el.vue_trans_cb = onEnd
        return codes.CSS_L
        
    }

}

function applyTransitionFunctions (el, stage, changeState, functionId, compiler) {

    var funcs = compiler.getOption('transitions', functionId)
    if (!funcs) {
        changeState()
        return codes.JS_SKIP
    }

    var enter = funcs.enter,
        leave = funcs.leave

    if (stage > 0) { // enter
        if (typeof enter !== 'function') {
            changeState()
            return codes.JS_SKIP_E
        }
        enter(el, changeState)
        return codes.JS_E
    } else { // leave
        if (typeof leave !== 'function') {
            changeState()
            return codes.JS_SKIP_L
        }
        leave(el, changeState)
        return codes.JS_L
    }

}

/**
 *  Sniff proper transition end event name
 */
function sniffTransitionEndEvent () {
    var el = document.createElement('vue'),
        defaultEvent = 'transitionend',
        events = {
            'transition'       : defaultEvent,
            'mozTransition'    : defaultEvent,
            'webkitTransition' : 'webkitTransitionEnd'
        }
    for (var name in events) {
        if (el.style[name] !== undefined) {
            return events[name]
        }
    }
}
});
require.register("vue/src/batcher.js", function(exports, require, module){

var config = require('./config'),
	utils  = require('./utils'),
	queue, has, waiting

reset()

exports.queue = function (binding, method) {
	if (!config.async) {
		// tod...
	}
	if (!has[binding.id]) {
		queue.push({
			binding: binding,
			method: method
		})
		has[binding.id] = true
		if(!waiting) {
			waiting = true
			utils.nextTick(flush)
		}
	}
}

function flush () {
	// tod...
}

function reset () {
	queue = []
	has = utils.hash()
	waiting = false
}
});
require.register("vue/src/directives/index.js", function(exports, require, module){
var utils      = require('../utils'),
    transition = require('../transition')

module.exports = {

    on        : require('./on'),
    repeat    : require('./repeat'),
    model     : require('./model'),
    'if'      : require('./if'),
    component : require('./component'),

    attr: function (value) {
        this.el.setAttribute(this.arg, value)
    },

    text: function (value) {
        this.el.textContent = utils.toText(value)
    },

    html: function (value) {
        this.el.innerHTML = utils.toText(value)
    },

    visible: function (value) {
        this.el.style.visibility = value ? '' : 'hidden'
    },

    show: function (value) {
        var el = this.el,
            target = value ? '' : 'none',
            change = function () {
                el.style.display = target
            }
        transition(el, value ? 1 : -1, change, this.compiler)
    },

    'class': function (value) {
        if (this.arg) {
            this.el.classList[value ? 'add' : 'remove'](this.arg)
        } else {
            if (this.lastVal) {
                this.el.classList.remove(this.lastVal)
            }
            if (value) {
                this.el.classList.add(value)
                this.lastVal = value
            }
        }
    },

    style: {
        bind: function () {
            this.arg = convertCSSProperty(this.arg)
        },
        update: function (value) {
            this.el.style[this.arg] = value
        }
    }
}

/**
 *  convert hyphen style CSS property to Camel style
 */
var CONVERT_RE = /-(.)/g
function convertCSSProperty (prop) {
    if (prop.charAt(0) === '-') prop = prop.slice(1)
    return prop.replace(CONVERT_RE, function (m, char) {
        return char.toUpperCase()
    })
}
});
require.register("vue/src/directives/if.js", function(exports, require, module){
var config = require('../config'),
    transition = require('../transition')

module.exports = {

    bind: function () {
        this.parent = this.el.parentNode
        this.ref = document.createComment(config.prefix + '-if-' + this.key)
        this.el.vue_ref = this.ref
    },

    update: function (value) {

        var el       = this.el

        if (!this.parent) { // the node was detached when bound
            if (!el.parentNode) {
                return
            } else {
                this.parent = el.parentNode
            }
        }

        // should always have this.parent if we reach here
        var parent   = this.parent,
            ref      = this.ref,
            compiler = this.compiler

        if (!value) {
            transition(el, -1, remove, compiler)
        } else {
            transition(el, 1, insert, compiler)
        }

        function remove () {
            if (!el.parentNode) return
            // insert the reference node
            var next = el.nextSibling
            if (next) {
                parent.insertBefore(ref, next)
            } else {
                parent.appendChild(ref)
            }
            parent.removeChild(el)
        }

        function insert () {
            if (el.parentNode) return
            parent.insertBefore(el, ref)
            parent.removeChild(ref)
        }
    },

    unbind: function () {
        this.el.vue_ref = null
    }
}
});
require.register("vue/src/directives/repeat.js", function(exports, require, module){
var Observer   = require('../observer'),
    Emitter    = require('../emitter'),
    utils      = require('../utils'),
    config     = require('../config'),
    transition = require('../transition'),
    ViewModel // lazy def to avoid circular dependency

/**
 *  Mathods that perform precise DOM manipulation
 *  based on mutator method triggered
 */
var mutationHandlers = {

    push: function (m) {
        var i, l = m.args.length,
            base = this.collection.length - l
        for (i = 0; i < l; i++) {
            this.buildItem(m.args[i], base + i)
        }
    },

    pop: function () {
        var vm = this.vms.pop()
        if (vm) vm.$destroy()
    },

    unshift: function (m) {
        var i, l = m.args.length
        for (i = 0; i < l; i++) {
            this.buildItem(m.args[i], i)
        }
    },

    shift: function () {
        var vm = this.vms.shift()
        if (vm) vm.$destroy()
    },

    splice: function (m) {
        var i, l,
            index = m.args[0],
            removed = m.args[1],
            added = m.args.length - 2,
            removedVMs = this.vms.splice(index, removed)
        for (i = 0, l = removedVMs.length; i < l; i++) {
            removedVMs[i].$destroy()
        }
        for (i = 0; i < added; i++) {
            this.buildItem(m.args[i + 2], index + i)
        }
    },

    sort: function () {
        var vms = this.vms,
            col = this.collection,
            l = col.length,
            sorted = new Array(l),
            i, j, vm, data
        for (i = 0; i < l; i++) {
            data = col[i]
            for (j = 0; j < l; j++) {
                vm = vms[j]
                if (vm.$data === data) {
                    sorted[i] = vm
                    break
                }
            }
        }
        for (i = 0; i < l; i++) {
            this.container.insertBefore(sorted[i].$el, this.ref)
        }
        this.vms = sorted
    },

    reverse: function () {
        var vms = this.vms
        vms.reverse()
        for (var i = 0, l = vms.length; i < l; i++) {
            this.container.insertBefore(vms[i].$el, this.ref)
        }
    }
}

module.exports = {

    bind: function () {

        var self = this,
            el   = self.el,
            ctn  = self.container = el.parentNode

        // extract child VM information, if any
        ViewModel       = ViewModel || require('../viewmodel')
        var componentId = utils.attr(el, 'component')
        self.ChildVM    = self.compiler.getOption('components', componentId) || ViewModel

        // extract transition information
        self.hasTrans   = el.hasAttribute(config.attrs.transition)

        // create a comment node as a reference node for DOM insertions
        self.ref = document.createComment(config.prefix + '-repeat-' + self.key)
        ctn.insertBefore(self.ref, el)
        ctn.removeChild(el)

        self.initiated = false
        self.collection = null
        self.vms = null
        self.mutationListener = function (path, arr, mutation) {
            var method = mutation.method
            mutationHandlers[method].call(self, mutation)
            if (method !== 'push' && method !== 'pop') {
                self.updateIndexes()
            }
        }

    },

    update: function (collection) {

        this.unbind(true)
        // attach an object to container to hold handlers
        this.container.vue_dHandlers = utils.hash()
        // if initiating with an empty collection, we need to
        // force a compile so that we get all the bindings for
        // dependency extraction.
        if (!this.initiated && (!collection || !collection.length)) {
            this.buildItem()
            this.initiated = true
        }
        collection = this.collection = collection || []
        this.vms = []

        // listen for collection mutation events
        // the collection has been augmented during Binding.set()
        if (!collection.__observer__) Observer.watchArray(collection, null, new Emitter())
        collection.__observer__.on('mutate', this.mutationListener)

        // create child-vms and append to DOM
        if (collection.length) {
            for (var i = 0, l = collection.length; i < l; i++) {
                this.buildItem(collection[i], i)
            }
        }
    },

    /**
     *  Create a new child VM from a data object
     *  passing along compiler options indicating this
     *  is a v-repeat item.
     */
    buildItem: function (data, index) {

        var node    = this.el.cloneNode(true),
            ctn     = this.container,
            ref, item

        // append node into DOM first
        // so v-if can get access to parentNode
        if (data) {
            ref = this.vms.length > index
                ? this.vms[index].$el
                : this.ref
            // make sure it works with v-if
            if (!ref.parentNode) ref = ref.vue_ref
            // process transition info before appending
            node.vue_trans = utils.attr(node, 'transition', true)
            transition(node, 1, function () {
                ctn.insertBefore(node, ref)
            }, this.compiler)
        }

        item = new this.ChildVM({
            el: node,
            data: data,
            compilerOptions: {
                repeat: true,
                repeatIndex: index,
                repeatCollection: this.collection,
                parentCompiler: this.compiler,
                delegator: ctn
            }
        })

        if (!data) {
            // this is a forced compile for an empty collection.
            // let's remove it...
            item.$destroy()
        } else {
            this.vms.splice(index, 0, item)
        }
    },

    /**
     *  Update index of each item after a mutation
     */
    updateIndexes: function () {
        var i = this.vms.length
        while (i--) {
            this.vms[i].$data.$index = i
        }
    },

    unbind: function () {
        if (this.collection) {
            this.collection.__observer__.off('mutate', this.mutationListener)
            var i = this.vms.length
            while (i--) {
                this.vms[i].$destroy()
            }
        }
        var ctn = this.container,
            handlers = ctn.vue_dHandlers
        for (var key in handlers) {
            ctn.removeEventListener(handlers[key].event, handlers[key])
        }
        ctn.vue_dHandlers = null
    }
}
});
require.register("vue/src/directives/on.js", function(exports, require, module){
var utils = require('../utils')

function delegateCheck (el, root, identifier) {
    while (el && el !== root) {
        if (el[identifier]) return el
        el = el.parentNode
    }
}

module.exports = {

    isFn: true,

    bind: function () {
        if (this.compiler.repeat) {
            // attach an identifier to the el
            // so it can be matched during event delegation
            this.el[this.expression] = true
            // attach the owner viewmodel of this directive
            this.el.vue_viewmodel = this.vm
        }
    },

    update: function (handler) {
        this.unbind(true)
        if (typeof handler !== 'function') {
            return utils.warn('Directive "on" expects a function value.')
        }

        var compiler = this.compiler,
            event    = this.arg,
            ownerVM  = this.binding.compiler.vm

        if (compiler.repeat &&
            // do not delegate if the repeat is combined with an extended VM
            !this.vm.constructor.super &&
            // blur and focus events do not bubble
            event !== 'blur' && event !== 'focus') {

            // for each blocks, delegate for better performance
            // focus and blur events dont bubble so exclude them
            var delegator  = compiler.delegator,
                identifier = this.expression,
                dHandler   = delegator.vue_dHandlers[identifier]

            if (dHandler) return

            // the following only gets run once for the entire each block
            dHandler = delegator.vue_dHandlers[identifier] = function (e) {
                var target = delegateCheck(e.target, delegator, identifier)
                if (target) {
                    e.el = target
                    e.targetVM = target.vue_viewmodel
                    handler.call(ownerVM, e)
                }
            }
            dHandler.event = event
            delegator.addEventListener(event, dHandler)

        } else {

            // a normal, single element handler
            var vm = this.vm
            this.handler = function (e) {
                e.el = e.currentTarget
                e.targetVM = vm
                handler.call(ownerVM, e)
            }
            this.el.addEventListener(event, this.handler)

        }
    },

    unbind: function (update) {
        this.el.removeEventListener(this.arg, this.handler)
        this.handler = null
        if (!update) this.el.vue_viewmodel = null
    }
}
});
require.register("vue/src/directives/model.js", function(exports, require, module){
var utils = require('../utils'),
    isIE9 = navigator.userAgent.indexOf('MSIE 9.0') > 0

module.exports = {

    bind: function () {

        var self = this,
            el   = self.el,
            type = el.type,
            tag  = el.tagName

        self.lock = false

        // determine what event to listen to
        self.event =
            (self.compiler.options.lazy ||
            tag === 'SELECT' ||
            type === 'checkbox' || type === 'radio')
                ? 'change'
                : 'input'

        // determine the attribute to change when updating
        var attr = self.attr = type === 'checkbox'
            ? 'checked'
            : (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA')
                ? 'value'
                : 'innerHTML'

        if (self.filters) {
            var compositionLock = false
            this.cLock = function () {
                compositionLock = true
            }
            this.cUnlock = function () {
                compositionLock = false
            }
            el.addEventListener('compositionstart', this.cLock)
            el.addEventListener('compositionend', this.cUnlock)
        }

        // attach listener
        self.set = self.filters
            ? function () {
                if (compositionLock) return
                // if this directive has filters
                // we need to let the vm.$set trigger
                // update() so filters are applied.
                // therefore we have to record cursor position
                // so that after vm.$set changes the input
                // value we can put the cursor back at where it is
                var cursorPos
                try {
                    cursorPos = el.selectionStart
                } catch (e) {}
                self.vm.$set(self.key, el[attr])
                // since updates are async
                // we need to reset cursor position async too
                utils.nextTick(function () {
                    if (cursorPos !== undefined) {
                        el.setSelectionRange(cursorPos, cursorPos)
                    }
                })
            }
            : function () {
                // no filters, don't let it trigger update()
                self.lock = true
                self.vm.$set(self.key, el[attr])
                utils.nextTick(function () {
                    self.lock = false
                })
            }
        el.addEventListener(self.event, self.set)

        // fix shit for IE9
        // since it doesn't fire input on backspace / del / cut
        if (isIE9) {
            self.onCut = function () {
                // cut event fires before the value actually changes
                utils.nextTick(function () {
                    self.set()
                })
            }
            self.onDel = function (e) {
                if (e.keyCode === 46 || e.keyCode === 8) {
                    self.set()
                }
            }
            el.addEventListener('cut', self.onCut)
            el.addEventListener('keyup', self.onDel)
        }
    },

    update: function (value) {
        if (this.lock) return
        /* jshint eqeqeq: false */
        var self = this,
            el   = self.el
        if (el.tagName === 'SELECT') { // select dropdown
            // setting <select>'s value in IE9 doesn't work
            var o = el.options,
                i = o.length,
                index = -1
            while (i--) {
                if (o[i].value == value) {
                    index = i
                    break
                }
            }
            o.selectedIndex = index
        } else if (el.type === 'radio') { // radio button
            el.checked = value == el.value
        } else if (el.type === 'checkbox') { // checkbox
            el.checked = !!value
        } else {
            el[self.attr] = utils.toText(value)
        }
    },

    unbind: function () {
        var el = this.el
        el.removeEventListener(this.event, this.set)
        if (this.filters) {
            el.removeEventListener('compositionstart', this.cLock)
            el.removeEventListener('compositionend', this.cUnlock)
        }
        if (isIE9) {
            el.removeEventListener('cut', this.onCut)
            el.removeEventListener('keyup', this.onDel)
        }
    }
}
});
require.register("vue/src/directives/component.js", function(exports, require, module){
var utils = require('../utils')

module.exports = {

    bind: function () {
        if (this.isSimple) {
            this.build()
        }
    },

    update: function (value) {
        if (!this.component) {
            this.build(value)
        } else {
            this.component.$data = value
        }
    },

    build: function (value) {
        var Ctor = this.compiler.getOption('components', this.arg)
        if (!Ctor) utils.warn('unknown component: ' + this.arg)
        var options = {
            el: this.el,
            data: value,
            compilerOptions: {
                parentCompiler: this.compiler
            }
        }
        this.component = new Ctor(options)
    },

    unbind: function () {
        this.component.$destroy()
    }

}
});
require.alias("component-emitter/index.js", "vue/deps/emitter/index.js");
require.alias("component-emitter/index.js", "emitter/index.js");

require.alias("vue/src/main.js", "vue/index.js");
if (typeof exports == 'object') {
  module.exports = require('vue');
} else if (typeof define == 'function' && define.amd) {
  define(function(){ return require('vue'); });
} else {
  window['Vue'] = require('vue');
}})();