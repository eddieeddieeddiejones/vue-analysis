var Compiler = require('./compiler')
function ViewModel (options) {
    // console.log(1)
    // console.log(Compiler)
    new Compiler(this, options)
}
// console.log(ViewModel)
module.exports = ViewModel