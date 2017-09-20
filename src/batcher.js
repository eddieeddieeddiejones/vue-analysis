
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