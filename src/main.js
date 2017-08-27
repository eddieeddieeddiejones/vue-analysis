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