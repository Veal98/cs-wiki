# 🍭 JSON 详解

---

## 1. 什么是 JSON 

- JSON 指的是 **JavaScript 对象表示法**（**J**ava**S**cript **O**bject **N**otation）
- JSON 是**轻量级的文本数据交换格式**
- JSON 独立于语言：JSON 使用 Javascript 语法来描述数据对象，但是 JSON 仍然独立于语言和平台。JSON 解析器和 JSON 库支持许多不同的编程语言。 目前非常多的动态（PHP，JSP，.NET）编程语言都支持 JSON
- JSON 具有自我描述性，更易理解

## 2. JSON 与 JavaScript

📜 JSON 文本格式在语法上与创建 JavaScript 对象的代码相同。由于这种相似性，无需解析器，JavaScript 程序能够使用内建的 `eval()` 函数，用 JSON 数据来生成原生的 JavaScript 对象。

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>CS-Wiki</title>
</head>
<body>
<h2>JavaScript 创建 JSON 对象</h2>
<p>
网站名称: <span id="jname"></span><br /> 
网站地址: <span id="jurl"></span><br /> 
网站 slogan: <span id="jslogan"></span><br /> 
</p>
<script>
var JSONObject= {
	"name":"CS-Wiki",
	"url":"https://gitee.com/veal98/CS-Wiki", 
	"slogan":"🎉 用清晰的脉络总结 Java 和 AI 相关的知识点，便于构建完善的知识体系"
};
document.getElementById("jname").innerHTML=JSONObject.name 
document.getElementById("jurl").innerHTML=JSONObject.url 
document.getElementById("jslogan").innerHTML=JSONObject.slogan 
</script>

</body>
</html>
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200901215515.png" style="zoom:50%;" />

## 3. JSON 语法规则

**JSON 语法是 JavaScript 对象表示语法的子集**：

- 数据在名称/值对中
- 数据由逗号分隔
- 大括号保存对象
- 中括号保存数组

### ① JSON 名称/值对

JSON 数据的书写格式是：名称/值对。

名称/值对包括字段名称（在双引号中），后面写一个冒号，然后是值：

```json
"name" : "菜鸟教程"
```

这很容易理解，等价于这条 JavaScript 语句：

```json
name = "菜鸟教程"
```

### ② JSON 值

JSON 值可以是：

- 数字（整数或浮点数）
- 字符串（在双引号中）
- 逻辑值（true 或 false）
- 数组（在中括号中）
- 对象（在大括号中）
- null

### ③ JSON 数字

JSON 数字可以是整型或者浮点型：

```json
{ "age":30 }
```

### ④ JSON 对象

JSON 对象在大括号（`{}`）中书写：

对象可以包含多个名称/值对：

```json
{ 
    "name":"hello" , 
    "url":"www.baidu.com" 
}
```

这一点也容易理解，与这条 JavaScript 语句等价：

```json
{ "name":"hello" , "url":"www.baidu.com" }
```

### ⑤ JSON 数组

JSON 数组在中括号中书写：

数组可包含多个对象：

```json
{ 
    "sites": [ 
        { 
            "name":"hello" , 
            "url":"www.baidu.com" 
        },  
        { 
            "name":"google" , 
         	"url":"www.google.com" 
        },  
        { 
            "name":"微博" , 
         	"url":"www.weibo.com" 
        } 
    ]
}
```

在上面的例子中，对象 "`sites`" 是包含三个对象的数组。

### ⑥ JSON 布尔值

JSON 布尔值可以是 true 或者 false：

```json
{ "flag":true }
```

### ⑦ JSON null

JSON 可以设置 null 值：

```json
{ "runoob":null }
```

### ⑧ JSON 使用 JavaScript 语法

因为 JSON 使用 JavaScript 语法，所以无需额外的软件就能处理 JavaScript 中的 JSON。

通过 JavaScript，您可以创建一个对象数组，并像这样进行赋值：

```json
var sites = [    
    { 
        "name":"hello" , 
     	"url":"www.baidu.com" 
    },     
    { 
        "name":"google" , 
        "url":"www.google.com" 
    },     
    { 
        "name":"微博" , 
        "url":"www.weibo.com" 
    } 
];
```

可以像这样访问 JavaScript 对象数组中的第一项（索引从 0 开始）：

```json
sites[0].name;
```

返回的内容是：baidu

可以像这样修改数据：

```json
sites[0].name="hello";
```



## 4. JSON 和 XML

xml：

```xml
<sites>
  <site>
    <name>菜鸟教程</name> <url>www.runoob.com</url>
  </site>
  <site>
    <name>google</name> <url>www.google.com</url>
  </site>
  <site>
    <name>微博</name> <url>www.weibo.com</url>
  </site>
</sites>
```

json:

```js
{
    "sites": [
        { "name":"菜鸟教程" , "url":"www.runoob.com" }, 
        { "name":"google" , "url":"www.google.com" }, 
        { "name":"微博" , "url":"www.weibo.com" }
    ]
}
```

**与 XML 相同之处**：

- <u>JSON 是纯文本</u>
- JSON 具有"自我描述性"（人类可读）
- JSON 具有层级结构（值中存在值）
- JSON 可通过 JavaScript 进行解析
- JSON 数据可使用 AJAX 进行传输

**与 XML 不同之处**：

- 没有结束标签
- 更短
- 读写的速度更快
- 能够使用内建的 JavaScript `eval()` 方法进行解析
- 使用数组
- 不使用保留字

⭐ **最大的不同是**：XML 需要使用 XML 解析器来解析，JSON 可以使用标准的 JavaScript 函数来解析。

- `JSON.parse()`: 将一个 JSON 字符串转换为 JavaScript 对象。
- `JSON.stringify()`: 将 JavaScript 值转换为 JSON 字符串。

❓ **为什么使用 JSON？**

对于 AJAX 应用程序来说，JSON 比 XML 更快更易使用：

- <u>使用 XML</u>：
  - 读取 XML 文档
  - 使用 XML DOM 来循环遍历文档
  - 读取值并存储在变量中

- <u>使用 JSON</u>：

  - 读取 JSON 字符串
  - 用 eval() 处理 JSON 字符串

## 5. JSON 对象详解

### ① 对象语法

```json
{ 
    "name":"hello" , 
    "url":"www.baidu.com" 
}
```

JSON 对象使用在大括号({})中书写。

对象可以包含多个 **key/value（键/值）**对。

key 必须是字符串，value 可以是合法的 JSON 数据类型（字符串, 数字, 对象, 数组, 布尔值或 null）。

- **key 和 value 中使用冒号(`:`)分割。**

- **每个 key/value 对使用逗号(`,`)分割。**

### ② 访问对象值

使用点号（`.`）来访问对象的值：

```js
var myObj, x;
myObj = { 
    "name":"hello" , 
    "url":"www.baidu.com" 
};
x = myObj.name;
```

也可以使用中括号（`[]`）来访问对象的值：

```js
var myObj, x;
myObj = { 
    "name":"hello" , 
    "url":"www.baidu.com" 
};
x = myObj["name"];
```

### ③ 循环对象

使用 `for-in` 来循环对象的属性：

```js
<p>使用 for-in 来循环对象的属性:</p>

<p id="demo"></p>

<script>
var myObj = { 
    "name":"hello" , 
    "url":"www.baidu.com" 
};
for (x in myObj) {
    document.getElementById("demo").innerHTML += x + "<br>";
}
</script>
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200901223050.png" style="zoom:50%;" />

在 for-in 循环对象的属性时，使用中括号（`[]`）来访问属性的值：

```js
for (x in myObj) {
    document.getElementById("demo").innerHTML += myObj[x] + "<br>";
}
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200901223206.png" style="zoom:50%;" />

### ④ 嵌套 JSON 对象

JSON 对象中可以包含另外一个 JSON 对象：

```js
myObj = {
    "name":"baidu",
    "alexa":10000,
    "sites": {
        "site1":"www.baidu.com",
        "site2":"m.baidu.com",
        "site3":"c.baidu.com"
    }
}
```

你可以使用点号(`.`)或者中括号(`[]`)来访问嵌套的 JSON 对象：

```js
x = myObj.sites.site1;
// 或者
x = myObj.sites["site1"];
```

### ⑤ 修改

以下两种写法都是修改属性的值：

```js
myObj.sites.site1 = "www.google.com"; // 修改属性的值

myObj.sites["site1"] = "www.google.com"; // 修改属性的值
```

### ⑥ 删除

以下两种写法效果相同：

```js
delete myObj.sites.site1;

delete myObj.sites["site1"]
```

## 6. JSON 数组详解

### ① 数组语法

JSON 数组在中括号中书写：

```js
[ "Google", "Baidu", "Taobao" ]
```

JSON 中数组值必须是合法的 JSON 数据类型（字符串, 数字, 对象, 数组, 布尔值或 null）。

JavaScript 中，数组值可以是以上的 JSON 数据类型，也可以是 JavaScript 的表达式，包括函数，日期，及 *undefined*。

### ② JSON 对象中的数组

对象属性的值可以是一个数组：

```js
myObj = {
	"name":"网站",
	"num":3,
	"sites":[ "Google", "Runoob", "Taobao" ]
}
```

使用索引值来访问数组：

```js
x = myObj.sites[0];
```

### ③ 循环数组

使用 for-in 来访问数组：

```js
for (i in myObj.sites) {
    x += myObj.sites[i];
}
```

也可以使用 for 循环：

```js
for (i = 0; i < myObj.sites.length; i++) {
    x += myObj.sites[i];
}
```

### ④ 嵌套 JSON  对象中的数组

JSON 对象中数组可以包含另外一个数组，或者另外一个 JSON 对象：

```js
myObj = {
    "name":"网站",
    "num":3,
    "sites": [
        { 
            "name":"Google", 
            "info": [ 
                "Android", 
                "Google 搜索", 
                "Google 翻译" 
            ] 
        },
        { 
            "name":"num", 
            "info":[ 
                "1", 
                "2", 
                "3" 
            ] 
        },
        { 
            "name":"Taobao", 
            "info":[ 
                "淘宝", 
                "网购" 
            ] 
        }
    ]
}
```

使用 for-in 来循环访问每个数组：

```js
for (i in myObj.sites) {
    x += myObj.sites[i].name;
    for (j in myObj.sites[i].info) {
        x += myObj.sites[i].info[j] + "<br>";
    }
}
```

### ⑤ 修改

```js
myObj.sites[1] = "Github";
```

### ⑥ 删除

```js
delete myObj.sites[1];
```

## 7. JSON.parse()

JSON 通常用于与服务端交换数据。

在接收服务器数据时一般是字符串。

我们可以**使用 `JSON.parse()` 方法将数据转换为 JavaScript 对象**。

### ① 语法

```js
JSON.parse(text[, reviver])
```

参数说明：

- `text`:**必需**， 一个有效的 JSON 字符串。
- `reviver`: **可选**，一个转换结果的函数， 将为对象的每个成员调用此函数。

### ② 示例

例如我们从服务器接收了以下数据：

```json
{ "name":"hello", "alexa":10000, "site":"www.hello.com" }
```

使用 `JSON.parse()` 方法处理以上数据，将其转换为 JavaScript 对象：

```js
var obj = JSON.parse('{ "name":"hello", "alexa":10000, "site":"www.hello.com" }');
```

🚨 **注意**：解析前要确保你的数据是标准的 JSON 格式，否则会解析出错。

## 8. JSON.stringify()

JSON 通常用于与服务端交换数据。

在向服务器发送数据时一般是字符串。

我们可以**使用 `JSON.stringify()` 方法将 JavaScript 对象转换为字符串**。

### ① 语法

```js
JSON.stringify(value[, replacer[, space]])
```

**参数说明：**

- `value`:

  必需， 要转换的 JavaScript 值（通常为对象或数组）。

- `replacer`:

  可选。用于转换结果的函数或数组。

  如果 replacer 为函数，则 JSON.stringify 将调用该函数，并传入每个成员的键和值。使用返回值而不是原始值。如果此函数返回 undefined，则排除成员。根对象的键是一个空字符串：""。

  如果 replacer 是一个数组，则仅转换该数组中具有键值的成员。成员的转换顺序与键在数组中的顺序一样。当 value 参数也为数组时，将忽略 replacer 数组。

- `space`:

  可选，文本添加缩进、空格和换行符，如果 space 是一个数字，则返回值文本在每个级别缩进指定数目的空格，如果 space 大于 10，则文本缩进 10 个空格。space 也可以使用非数字，如：\t。

### ② 示例

例如我们向服务器发送以下数据：

```js
var obj = { "name":"hello", "alexa":10000, "site":"www.hello.com"};
```

我们使用 `JSON.stringify()` 方法处理以上数据，将其转换为字符串：

```js
var myJSON = JSON.stringify(obj);
```

## 📚 References

- [JSON教程 — 菜鸟教程](https://www.runoob.com/json/json-syntax.html)

