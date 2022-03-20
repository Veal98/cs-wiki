# ⏰ SpringBoot 前后端数据交互的几种常用方式

---

## 1. 用于获取参数的几种常用注解

`@PathVariable`： **获取 URL 后所携带的参数**，即 `url/{param}` 这种形式。也就是一般我们使用的 GET，DELETE，PUT方法会使用到的

`@RequestParam`：一般我们使用该注解来获取多个参数，在（）内写入需要获取参数的参数名即可，一般在PUT，POST中比较常用。比如 `@RequestParam("name")` 表示接收前端传过来的参数 `name`

`@RequestBody`：该注解和 `@RequestParam` 殊途同归，我们使用该注解将所有参数转换，在代码部分在一个个取出来。比如 `@RequestBody User user` 表示利用 `User` 类接受前端传过来的参数。

还有 `@RequestHeader` 来获取头信息里的值，`@CookieValue`来获取 Cookie 值等等

⭐ 现在大多数互联网项目都是采用**前后端分离**的方式开发，**前端**人员负责页面展示和数据获取，**后端**负责业务逻辑处理和接口封装。**前后端之间的交互通常使用 JSON 数据，一般来说后端使用  `@RequestBody` 注解来获取前端传过来的 JSON 数据。**

## 2. 请求参数类型

前端传送过来的参数无非以下 3 种类型：

- **请求路径参数**：比如说 `url/{id}` 或者 `url?name=123` 这种形式
- **Body 参数**
- **请求头参数以及 Cookie**

## 3. 针对不同的请求参数类型采用不同的注解

### ① 请求路径参数

#### Ⅰ get 请求，url 路径传参 `url?name=123`

get 请求一般通过 url 传参，如：http://localhost:8080/hello?name=123

后端要获取到 url 携带的参数 name，可以使用 `@RequestParam` 注解：

```java
@RestController
public class HelloController {
    
    @GetMapping(value="/hello")
    public String sayHello(@RequestParam("name") String name){
        return "name:"+name;
    }
}
```

#### Ⅱ get 请求，url 路径参数 `url/{id}`

如：http://localhost:8080/hello/1/jack

后端可以使用 `@PathVariable` 接收路径参数 1 和 jack

```java
@RestController
public class HelloController {
    
    @GetMapping(value="/hello/{id}/{name}")
    public String sayHello(@PathVariable("id") Integer id, 
                           @PathVariable("name") String name){
        return "id:"+id+" name:"+name;
    }
}
```

### ② Body 参数

一般来说，前端发送过来的数据采用的都是 JSON 格式，后端可以使用 `@RequestBody ` 进行接收。

比如说，前端发送过来的数据如下：

![](https://gitee.com/veal98/images/raw/master/img/20200822154522.png)

假如说有个 `Person` 类的属性也是 `name`、`age`、`hobby`，那么就可以使用 `Person` 类接收该数据：

```java
@PostMapping(path = "/demo1")
public void demo1(@RequestBody Person person) {
    System.out.println(person.getName());
    System.out.println(person.getAge());
}
```

当然，也可以使用 `Map` 进行接收：

```java
@PostMapping(path = "/demo1")
public void demo1(@RequestBody Map<String, String> map) {
    System.out.println(map.get("name"));
}
```

🚨 **注意：使用 `@RequestBody` 注解接收参数的时候，从名称上来看也就是说要读取的数据在请求体里，前端必须指定请求 JSON 数据的`Content-Type` 必须要为 `application/json`，所以要发 POST 请求，因为 Ajax 使用的POST，并且发送的是 JSON 对象**。比如 👇 

```html
<head>
    <title>Title</title>

    <script type = "text/javascript">

        $(function(){
            $("#testJson").click(function(){
                $.ajax({
                    type: "post",
                    url: "/demo1",
                    contentType: "application/json; charset= utf-8",
                    data: '{"name":"小黑", "age":20, "hobby":"basketball"}',
                    dataType: "json",
                    success:function(data){
                        alert(data);
                        // alert(data.age);
                    }
                });
            });
        });
    </script>
</head>

<body>
    <button id = "testJson">测试 ajax 请求 json 和响应 json</button>
</body>
```

> 💡 对于 Vue 来说，可以直接简单的使用 `axios` 来完成 JSON 数据的发送

### ③ 请求头参数以及 Cookie

后端可以通过 `HttpServletRequest` 获取请求头的内容，如：

![](https://gitee.com/veal98/images/raw/master/img/20200822160034.png)

```java
@GetMapping("/demo3")
public void demo3(HttpServletRequest request) {
    System.out.println(request.getHeader("myHeader"));
    for (Cookie cookie : request.getCookies()) {
        if ("myCookie".equals(cookie.getName())) {
            System.out.println(cookie.getValue());
        }
    }
}
```

也可以通过 `@RequestValue` 和 `@CookieValue` 注解来获取：

```java
@GetMapping("/demo3")
public void demo3(@RequestHeader(name = "myHeader") String myHeader,
        		 @CookieValue(name = "myCookie") String myCookie) {
    System.out.println("myHeader=" + myHeader);
    System.out.println("myCookie=" + myCookie);
}
```

## 📚 References

- [SpringBoot实现前后端数据交互、json数据交互、Controller接收参数的几种常用方式](https://blog.csdn.net/qq_20957669/article/details/89227840)
- [SpringBoot Controller接收参数的几种常用方式](https://blog.csdn.net/suki_rong/article/details/80445880?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase)