var prefix = 'sd',
    Directives = require('./directives'),
    Filters = require('./filters'),
    selector = Object.keys(Directives).map(function (d) {
      return '[' + prefix + '-' + d + ']'
    })
// ["[sd-text]", "[sd-show]", "[sd-class]", "[sd-on]"]
// console.log(Directive)

function Seed (opts) {
  var self = this,
    root = this.el = document.getElementById(opts.id),
    els = root.querySelectorAll(selector),
    bindings = {}  // 收集了directives

  self.scope = {} // external interface

  // process node for directives
  ;[].forEach.call(els, processNode)
  processNode(root)

  // initialize all variables by invoking setters
  for (var key in bindings) {
    self.scope[key] = opts.scope[key]
  }

  function processNode (el) { // 处理node
    cloneAttributes(el.attributes).forEach(function (attr) {
      var directive = parseDirective(attr)
      if (directive) {
        bindDirective(self, el, bindings, directive)
      }
    })
    // console.log(cloneAttributes(el.attributes))
  }
}

function cloneAttributes (attributes) { // 克隆属性，返回一个新的对象
  // NamedNodeMap {0: sd-text, length: 1} ...
  // console.log(attributes)
  return [].map.call(attributes, function (attr) {
    return {
      name: attr.name,
      value: attr.value
    }
  })
}

// 如果directives.js中有这个directive, 那么解析这个node
function parseDirective (attr) {
  if (attr.name.indexOf(prefix) === -1) return

  // parse directive name and argument
  var noprefix = attr.name.slice(prefix.length + 1),
    argIndex = noprefix.indexOf('-'),
    dirname = argIndex === -1
      ? noprefix
      : noprefix.slice(0, argIndex),
    def = Directives[dirname],
    arg = argIndex === -1
      ? null
      : noprefix.slice(argIndex + 1)
  // parse scope vaiable key and pipe filters
  var exp = attr.value,
    pipeIndex = exp.indexOf('|'),
    key = pipeIndex === -1
      ? exp.trim()
      : exp.slice(0, pipeIndex).trim(),
    filters = pipeIndex === -1
      ? null
      : exp.slice(pipeIndex + 1).split('|').map(function (filter) {
        return filter.trim()
      })
  return def
    ? {
      attr: attr,
      key: key,
      filters: filters,
      defination: def,
      argument: arg,
      update: typeof def === 'function'
        ? def
        : def.update
    }
    : null
}

// seed = Seed {el: div#test, scope: Object}, el = p, bindings = Object {msg: Object}, directive = Object {attr: Object, key: "msg", filters: Array(1), 
// 给dom绑定directive
function bindDirective (seed, el, bindings, directive) {
  el.removeAttribute(directive.attr.name)
  var key = directive.key,
    binding = bindings[key]
  // console.log(binding) // undefined
  // console.log(key)
  if (!binding) {
    bindings[key] = binding = {
      value: undefined,
      directives: []
    }
  }
  directive.el = el
  binding.directives.push(directive)
  // invoke bind hook if exists
  if (directive.bind) {
    directive.bind(el, binding.value)
  }
  // console.log(seed) // {}
  if (!seed.scope.hasOwnProperty(key)) {
    bindAccessors(seed, key, binding)
  }
}

// seed = Seed {el: div#test, scope: Object}, key = "msg", binding = Object {value: undefined, directives: Array(1)}
// 给seed对象添加set、get方法
function bindAccessors (seed, key, binding) {
  Object.defineProperty(seed.scope, key, {
    get: function () {
      return binding.value
    },
    set: function (value) {
      binding.value = value
      binding.directives.forEach(function (directive) {
        if(value && directive.filters) {  // value= function changeMessage()， directive.filters = [".button"]
          value = applyFilters(value, directive)
        }
        directive.update( // function text(el, value)
          directive.el,
          value, // seed.scope中的值
          directive.argument, // 'red'、null、'click' 
          directive, // Obj
          seed // Seed {el: div#test, scope:Object}
        )
      })
    }
  })
}
// value = "hello", directive = Object {attr: Object, key: "msg", filters: Array(1), argument: null, definition: function…}
// 执行过滤
function applyFilters (value, directive) {
  if (directive.defination.customFilter) {
    return directive.defination.customFilter(value, directive.filters)
  } else {
    directive.filters.forEach(function (filter) {
      if (Filters[filter]) {
        value = Filters[filter](value)
      }
    })
    return value
  }
}

module.exports = {
  create: function (opts) {
    return new Seed(opts)
  }
}