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