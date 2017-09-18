var utils = require('./utils'),
	extend = utils.extend,
	log = utils.log,
	Emitter = require('./emitter'),
    makeHash = utils.hash,
    def = utils.defProtected,
    Observer = require('./observer'),
    hasOwn = Object.prototype.hasOwnProperty,
    Binding = require('./binding')

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
        }
    }
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
    // TODO
}

module.exports = Compiler