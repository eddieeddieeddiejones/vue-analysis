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