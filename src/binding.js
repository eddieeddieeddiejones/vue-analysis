var id = 0


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

module.exports = Binding