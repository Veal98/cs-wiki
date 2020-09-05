# 👔 AJAX 详解

---

## 1. AJAX 简介

`AJAX = Asynchronous JavaScript and XML`（**异步**的 JavaScript 和 XML）。

AJAX 不是新的编程语言，而是一种使用现有标准的新方法。

**AJAX 最大的优点是在不重新加载整个页面的情况下，可以与服务器交换数据并更新部分网页内容**。

<u>AJAX 不需要任何浏览器插件，但需要用户允许 JavaScript 在浏览器上执行。</u>

🚩 **AJAX 是一种用于创建快速动态网页的技术**：

- 通过在后台与服务器进行少量数据交换，AJAX 可以使网页实现**异步更新**。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新。

  💬 比如：当我们在百度的搜索框输入关键字时，JavaScript 会把这些字符发送到服务器，然后服务器会返回一个搜索建议的列表。

- 传统的网页（不使用 AJAX）如果需要更新内容，必需重载整个网页。

## 2. AJAX 实例

先上一个小示例：

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script>
function loadXMLDoc()
{
	var xmlhttp;
	if (window.XMLHttpRequest)
	{
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
		}
	}
	xmlhttp.open("GET","/try/ajax/ajax_info.txt",true);
	xmlhttp.send();
}
</script>
</head>
<body>

<div id="myDiv"><h2>使用 AJAX 修改该文本内容</h2></div>
<button type="button" onclick="loadXMLDoc()">修改内容</button>

</body>
</html>
```

<img src="https://gitee.com/veal98/images/raw/master/img/1.gif" style="zoom: 67%;" />

上面的 AJAX 应用程序包含一个 div 和一个按钮。

**div 部分用于显示来自服务器的信息**。当按钮被点击时，它负责调用名为 `loadXMLDoc()` 的函数

下面我们来详细学习 AJAX 的工作原理 👇

## 3. AJAX 工作原理

AJAX是基于现有的Internet标准，并且联合使用它们：

- XMLHttpRequest 对象 (异步的与服务器交换数据)
- JavaScript/DOM (信息显示/交互)
- CSS (给数据定义样式)
- XML (作为转换数据的格式)

💡 **AJAX 应用程序与浏览器和平台无关**

![](https://gitee.com/veal98/images/raw/master/img/20200905102046.png)

### ① 创建 XMLHttpRequest 对象

**`XMLHttpRequest` 是 AJAX 的基础**。

所有现代浏览器（IE7+、Firefox、Chrome、Safari 以及 Opera）均内建 **`XMLHttpRequest` 对象**。（IE5 和 IE6 使用 `ActiveXObject`）

⭐ **`XMLHttpRequest` 用于在后台与服务器之间交换数据**。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新。

创建 `XMLHttpRequest` 对象的语法：

```js
variable=new XMLHttpRequest();
```

老版本的 Internet Explorer （IE5 和 IE6）使用 `ActiveXObject` 对象：

```js
variable=new ActiveXObject("Microsoft.XMLHTTP");
```

为了应对所有的现代浏览器，包括 IE5 和 IE6，请检查浏览器是否支持 `XMLHttpRequest` 对象。如果支持，则创建 `XMLHttpRequest` 对象。如果不支持，则创建 `ActiveXObject` ：

```js
var xmlhttp;
if (window.XMLHttpRequest)
{
    //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xmlhttp=new XMLHttpRequest();
}
else
{
    // IE6, IE5 浏览器执行代码
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}
```

### ② 向服务器发送请求

如需将请求发送到服务器，我们使用 `XMLHttpRequest` 对象的 `open()` 和 `send()` 方法：

```js
xmlhttp.open("GET","ajax_info.txt",true);
xmlhttp.send();
```

| 方法                     | 描述                                                         |
| :----------------------- | :----------------------------------------------------------- |
| `open(method,url,async)` | **规定请求的类型、URL 以及是否异步处理请求**。<br> `method`：请求的类型；GET 或 POST <br/> `url`：服务器上文件的地址。该文件可以是任何类型的文件，比如 .txt 和 .xml，或者服务器脚本文件，比如 .asp 和 .php <br/> `async`：true（异步）或 false（同步）。`XMLHttpRequest` 对象**如果要用于 AJAX 的话，其 async 参数必须设置为 true** |
| `send(string)`           | 将请求发送到服务器。<br/> `string`：仅用于 POST 请求         |

#### Ⅰ GET 请求

如果您希望通过 GET 方法发送信息，请向 URL 添加信息：

```js
xmlhttp.open("GET","/try/ajax/demo_get2.php?fname=Henry&lname=Ford",true);
xmlhttp.send();
```

#### Ⅱ POST 请求

如果需要像 HTML 表单那样 POST 数据，请使用 `setRequestHeader()` 来添加 HTTP 头。然后在 `send()` 方法中规定您希望发送的数据：

| 方法                             | 描述                                                         |
| :------------------------------- | :----------------------------------------------------------- |
| `setRequestHeader(header,value)` | 向请求添加 HTTP 头。<br>`header`: 规定头的名称<br/>`value`: 规定头的值 |

```js
xmlhttp.open("POST","/try/ajax/demo_post2.php",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send("fname=Henry&lname=Ford");
```

### ③ 服务器响应

#### Ⅰ 获取服务器响应

如需获得来自服务器的响应，请使用 `XMLHttpRequest` 对象的 `responseText` 或 `responseXML` 属性。

| 属性           | 描述                       |
| :------------- | :------------------------- |
| `responseText` | 获得字符串形式的响应数据。 |
| `responseXML`  | 获得 XML 形式的响应数据。  |

如果来自服务器的响应并非 XML，使用 `responseText` 属性，返回字符串形式的响应：

```js

document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
```

如果来自服务器的响应是 XML，而且需要作为 XML 对象进行解析，请使用 `responseXML` 属性：

假设请求 [cd_catalog.xml](https://www.runoob.com/try/demo_source/cd_catalog.xml)，并解析响应：

```js
xmlDoc=xmlhttp.responseXML;
txt="";
x=xmlDoc.getElementsByTagName("ARTIST");
for (i=0;i<x.length;i++)
{
    txt=txt + x[i].childNodes[0].nodeValue + "<br>";
}
document.getElementById("myDiv").innerHTML=txt;
```

#### Ⅱ onreadystatechange 事件

当请求被发送到服务器时，我们需要执行一些基于响应的任务。

每当 `readyState` 改变时，就会触发 `onreadystatechange` 事件。

`readyState` 属性存有 `XMLHttpRequest` 的状态信息。

下面是 `XMLHttpRequest` 对象的三个重要的属性：

| 属性                 | 描述                                                         |
| :------------------- | :----------------------------------------------------------- |
| `onreadystatechange` | 存储函数（或函数名），每当 readyState 属性改变时，就会调用该函数。 |
| `readyState`         | 存有 XMLHttpRequest 的状态。从 0 到 4 发生变化。<br> 0: 请求未初始化<br/> 1: 服务器连接已建立<br/> 2: 请求已接收3: 请求处理中<br/> 4: 请求已完成，且响应已就绪 |
| `status`             | 200: "OK" <br/> 404: 未找到页面                              |

在 `onreadystatechange` 事件中，我们规定当服务器响应已做好被处理的准备时所执行的任务。

当 readyState 等于 4 且状态为 200 时，表示响应已就绪：

```js
xmlhttp.onreadystatechange=function()
{
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
    }
}
```

#### ③ 回调函数

**回调函数是一种以参数形式传递给另一个函数的函数**。

如果您的网站上存在多个 AJAX 任务，那么您应该为创建 `XMLHttpRequest` 对象编写一个*标准*的函数，并为每个 AJAX 任务调用该函数。

该函数调用应该包含 URL 以及发生 `onreadystatechange` 事件时执行的任务（每次调用可能不尽相同）：

```js
var xmlhttp;
function loadXMLDoc(url,cfunc)
{
if (window.XMLHttpRequest)
  {// IE7+, Firefox, Chrome, Opera, Safari 代码
  xmlhttp=new XMLHttpRequest();
  }
else
  {// IE6, IE5 代码
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=cfunc;
xmlhttp.open("GET",url,true);
xmlhttp.send();
}

// 回调函数
function myFunction()
{
	loadXMLDoc("/try/ajax/ajax_info.txt",function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
		}
	});
}
```

## 4. Jquery 中使用 AJAX 完成前后端交互

jquery 中封装了一个函数 `ajax()`，我们可以直接用这个函数来执行 AJAX 请求。

### ① ajax 常用参数

常用参数：																																																																																																											

- `url` 请求地址
- `type` 请求方式，默认是'GET'，常用的还有'POST'
- `dataType` 设置返回的数据格式，常用的是'json'格式，也可以设置为'html'
- `data` 设置发送给服务器的数据
- `success` 设置请求成功后的回调函数
- `error` 设置请求失败后的回调函数
- `async` 设置是否异步，默认值是'true'，表示异步

### ② $.ajax 三种写法

- 以前的写法：

  ```js
  $.ajax({
      url: '/change_data',
      type: 'GET',
      dataType: 'json',
      data:{'code':300268}
      success:function(dat){
          alert(dat.name);
      },
      error:function(){
          alert('服务器超时，请重试！');
      }
  });
  ```

- 新的写法（推荐）

  ```js
  $.ajax({
      url: '/change_data',
      type: 'GET',
      dataType: 'json',
      data:{'code':300268}
  })
  .done(function(dat) {
      alert(dat.name);
  })
  .fail(function() {
      alert('服务器超时，请重试！');
  });
  ```

- 简写方式：

  `$.ajax `按照请求方式可以简写成 `$.get`  或者​` $.post` 方式，但是这种方法没有请求失败执行的回调函数

  ```js
  $.get("/change_data", {'code':300268},
    function(dat){
      alert(dat.name);
  });
  
  $.post("/change_data", {'code':300268},
    function(dat){
      alert(dat.name);
  });
  ```

## 📚 References

- [AJAX 教程 — 菜鸟教程](https://www.runoob.com/ajax/ajax-tutorial.html)
- [使用ajax实现前后端数据交互](https://www.cnblogs.com/yanguhung/p/10145762.html)