# vue-analysis
vue源码分析


git reset --hard commit-id

## rename

commitName：rename，最开始的idea demo，
vue源码commit_id： c56a910
值得重写系数*****

### 重点
explorations/getset.html


### demo文件夹下有些例子
```js
// 根据属性寻找元素
var dom = document.querySelectorAll('[h="haha"]')
console.log(dom) // [div]
```

```js
var obj = {}
var target = [1, 2]
// debugger
Object.defineProperty(obj, 'a', {
  set: function (newVal) {
      console.log('set')
  },
  get: function () {
      // 不能这么写，这样会递归，无限循环
      // return obj['a']
      // console.log('get')
      return target
  }
})

obj['a'] = 1 // set
console.log(obj['a']) // get
```
### 思路

正则匹配=>添加自定义属性作标记=>定义一个对象作为仓库，遍历添加get、set属性=>遍历设置值，触发set

## naive imploementation

commitName：naive imploementation
五脏俱全的vue库demo,实现了sd-text、filter等
vue源码commit_id： a5e27b11
值得重写系数****

### start
- `npm install -g grunt-cli`
- vue-analysis 文件夹下 `grunt watch --force`
- 打开`dev.html`
- `demo`文件夹下是分析代码遇到不清楚的地方，所以整理了一些demo，看`src/`内代码前可以先看这个

### 重点
src/


### demo文件夹下有些例子
```js
// map
var arr = [1, 2]
// IE12+浏览器可以直接支持箭头函数
var newArr = arr.map(item => {
 return {
  a: item
 } 
})
// [Object, Object]
console.log(newArr)
```

```js
var obj = {}
var target = [1, 2]
// debugger
Object.defineProperty(obj, 'a', {
  set: function (newVal) {
      console.log('set')
  },
  get: function () {
      // 不能这么写，这样会递归，无限循环
      // return obj['a']
      // console.log('get')
      return target
  }
})

obj['a'] = 1 // set
console.log(obj['a']) // get
```

```js
// call
var namedNodeMap = {
  0: {
    'name': 'sd-text',
    'value': 'msg | capitalize'
  }, 
  length: 1
}
var returnValue = [].map.call(namedNodeMap, function (attr) {
  return {
    name: attr.name,
    value: attr.value
  }
})
// [Object]
console.log(returnValue)
```

```js
// objetct.defineProperty
function Archiver() {
  var temperature = null;
  var archive = [];

  Object.defineProperty(this, 'temperature', {
    get: function() {
      console.log('get!');
      return temperature;
    },
    set: function(value) {
      temperature = value;
      archive.push({ val: temperature });
    }
  });

  this.getArchive = function() { return archive; };
}
var arc = new Archiver();
arc.temperature; // 'get!'
arc.temperature = 11;
arc.temperature = 13;
arc.getArchive(); // [{ val: 11 }, { val: 13 }]
```

### 思路
根据directive.js文件中的key,结合node，生成一个个具体的diretive对象=>根据key给dom绑定directive，也就是给Seed对象中的key添加set、get方法。=>遍历scope中的键值对，触发set、get方法。

## V 0.7.3
### TODO
- 了解下cookie


