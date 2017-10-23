# vue-analysis
vue源码分析
vue源码，v0.7.3之前的源码看过了。后面的没看。v0.7.3的源码没看完
研究源码，我最重要的收获是更善于debug代码了

## 技巧、心得
- lv https://unpkg.com/vue@2.4.1
可以看整体结构
- 如何从历史提交一个一个看源码？
这是phodal的经验
http://mp.weixin.qq.com/s?__biz=MjM5Mjg4NDMwMA==&mid=2652973508&idx=1&sn=1281837abb0530893f8b42e05ea35a7e#rd
- 回滚到某一提交
git reset --hard commit-id
- 拷贝一份代码，自己写一遍，这么做可以避免分支切来切去
- 做记录把需要重新写一遍的commitid记下来，下一次提交放心大胆的删除。
- git reset --hard id 能清空暂存区
- qit clean --nfd 丢弃未提交的内容
- [debug js代码](http://www.zsoltnagy.eu/javascript-debugging-tips-and-tricks/)

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
- demo文件夹下有从源码中拆出来的小demo，很多
- 0.7.3版本的代码，我本来打算写一遍的，写了85%，最后调试去找哪句代码没写，不好找，放弃了。`00-记录.md`文件进度记录了我的完成经历
- 如果下次接着做，可以试着根据单元测试文件修补代码。


### 打开步骤(0.7.3)
- 打开sourceTree，打开cmder
- npm install -g grunt-cli
  没安装过需要安装需要安装
- vue，最早的release
https://github.com/vuejs/vue/releases?after=v0.7.5
- 在公司
cd F:\04-LearnSomething\05_vue\07_sourceCodeAnalysis\vue-analysis
（这个每个人的文件存放地址不同，需要根据个人情况修改）
- 我要写的代码在这里，我是在这个文件夹下写代码的（这个没有上传到github上）
cd F:\04-LearnSomething\05_vue\07_sourceCodeAnalysis\vue-0.7.3-myTry
grunt watch
热加载，开始写代码
grunt test
单元测试，和功能测试
- 注意：component-emitter/文件夹下代码变更不会触发热更新
- examples/todomvc/index.html，双击这个文件看效果
  每次修改代码保存后，F5刷新浏览器网页，就能看到改动效果


## 其他

### 值得再写一遍的
-  rename，最开始的idea demo，源代码commit_id 871ed912代码能看懂，值得重写系数5星
- naive imploementation， 五脏俱全的vue库，代码看的比较，看的不太懂，困难写了一遍，原始代码commit_id a5e27b11。值得重写系数2星
- filter value should not be written ,代码看懂了，重写了一遍。原始代码commit_id: 3eb7f6fc。值得重写系数4星
- 0.6.0 - rename to VueJS ,代码看懂了，重写一遍，没写完。commit_id: 218557cd。值得重写系数3星
- 0.6.0 - rename to VueJS ,代码看懂了，重写一遍，没写完。commit_id: 218557cd。值得重写系数3星
