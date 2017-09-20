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
	// todo
	batcher.queue(this, 'update')
}
module.exports = Binding