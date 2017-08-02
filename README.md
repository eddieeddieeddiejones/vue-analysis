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


