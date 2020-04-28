> 本文主要讲解 JSP + Servlet

---

# 一、Servlet 

## 1. Servlet 功能

在Java Web程序中，**Servlet**主要负责接收用户请求 `HttpServletRequest`, 在`doGet()`,`doPost()`中做相应的处理，并将回应`HttpServletResponse`反馈给用户。

**Servlet** 可以设置初始化参数，供Servlet内部使用。一个Servlet类只会有一个实例，在它初始化时调用`init()`方法，销毁时调用`destroy()`方法**。**每个 Servlet 都需要在 web.xml 中注册配置，**一个Servlet可以设置多个 URL 访问**。**Servlet 不是线程安全的**，因此要谨慎使用类变量。

## 2. Servlet 接口中的方法与生命周期

Servlet接口定义了5个方法，其中**前三个方法与Servlet生命周期相关**：

- `void init(ServletConfig config) throws ServletException`
- `void service(ServletRequest req, ServletResponse resp) throws ServletException, java.io.IOException`
- `void destroy()`
- `java.lang.String getServletInfo()`
- `ServletConfig getServletConfig()`

**生命周期**： 

- Web 容器加载 Servlet 并将其实例化后，Servlet 生命周期开始**，容器运行其** `init()`方法 **进行Servlet 的初始化；**
- **请求到达时调用Servlet的** `service()` 方法**，service() 方法会根据需要调用与请求对应的** doGet 或doPost **等方法；**
- **当服务器关闭或项目被卸载时服务器会将Servlet实例销毁，此时会调用Servlet的** `destroy()` 方法。
- **init方法和destroy方法只会执行一次，service方法客户端每次请求Servlet都会执行**。Servlet中有时会用到一些需要初始化与销毁的资源，因此可以把初始化资源的代码放入init方法中，销毁资源的代码放入destroy方法中，这样就不需要每次处理客户端的请求都要初始化与销毁资源。

## 3. GET 和 POST 请求的区别

- GET在浏览器回退时是无害的，而POST会再次提交请求。
- GET产生的URL地址可以被Bookmark，而POST不可以。
- GET请求会被浏览器主动cache，而POST不会，除非手动设置。
- GET请求只能进行url编码，而POST支持多种编码方式。
- GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留。
- **GET请求在URL中传送的参数是有长度限制的，而POST没有。**
- **对参数的数据类型，GET只接受ASCII字符，而POST没有限制。**
- **GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息。**
- **GET参数通过URL传递，POST放在 Request body 中。**

其实本质上 get / post 的都是 TCP 连接，并无差别，但是由于 HTTP 协议的规定和浏览器/服务器的限制，导致他们在应用过程中有些不同。

**GET 和 POST 还有一个重大区别：GET 产生一个 TCP 数据包，POST 产生两个 TCP 数据包**

- 对于GET方式的请求，浏览器会把 http header 和 data 一并发送出去，服务器响应 200（客户端请求成功）；
- 而对于POST，浏览器先发送 header，服务器响应 100 （表示请求已接收，继续处理），浏览器再发送 data，服务器响应200 ok（客户端请求成功）。（不过并不是所有的浏览器在 POST 中都会发送两次包， Firefox 就只发送一次）

也就是说，GET只需要汽车跑一趟就把货送到了，而POST得跑两趟，第一趟，先去和服务器打个招呼“嗨，我等下要送一批货来，你们打开门迎接我”，然后再回头把货送过去。

<img src="https://gitee.com/veal98/images/raw/master/img/20200428144014.png" style="zoom:80%;" />

## 4. 什么情况下调用doGet()和doPost()

`form` 标签里的 method 的属性为 get 时调用 doGet()，为 post 时调用 doPost()。

## 5. 转发(Forward)和重定向(Redirect)的区别

**转发是服务器行为，重定向是客户端行为。**

**转发（Forward）** 通过RequestDispatcher 对象的 forward（HttpServletRequest request,HttpServletResponse response）方法实现的。RequestDispatcher 可以通过 HttpServletRequest 的 getRequestDispatcher() 方法获得。例如下面的代码就是跳转到 login_success.jsp 页面。

```java
request.getRequestDispatcher("login_success.jsp").forward(request, response);
```

**重定向（Redirect）** 是利用服务器返回的状态码来实现的。客户端浏览器请求服务器的时候，服务器会返回一个状态码。服务器通过 `HttpServletResponse` 的 `setStatus(int status)` 方法设置状态码。如果服务器返回 301 (永久重定向) 或者 302（临时重定向），则浏览器会到新的网址重新请求该资源。

```cpp
response.sendRedirect("test.jsp");
```

- **从地址栏显示来说**

  - **forward** 是服务器请求资源,服务器直接访问目标地址的URL,把那个URL的响应内容读取过来,然后把这些内容再发给浏览器. 浏览器根本不知道服务器发送的内容从哪里来的, 所以**它的地址栏还是原来的地址.** 

  - **redirect** 是服务端根据逻辑,发送一个状态码,告诉浏览器重新去请求那个地址。所以**地址栏显示的是新的URL.**

- **从数据共享来说**

  - **forward : 转发页面和转发到的页面可以共享request里面的数据**. 

  - redirect:不能共享数据.

- **从运用地方来说**

  - forward:一般用于用户登陆的时候,根据角色转发到相应的模块. 

  - redirect:一般用于用户注销登陆时返回主页面和跳转到其它的网站等

- **从效率来说**

  - forward:高.

  - redirect:低.

# 二、JSP

## 1. JSP 和 Servlet 的关系

- **Servlet是一个特殊的Java程序**，它运行于服务器的JVM中，能够依靠服务器的支持向浏览器提供显示内容。
- **JSP本质上是Servlet的一种简易形式**，JSP会被服务器处理成一个类似于Servlet的Java程序，可以简化页面内容的生成。
- Servlet 和JSP 最主要的不同点在于，Servlet的应用逻辑是在Java文件中，并且完全从表示层中的HTML分离开来。而 JSP 的情况是Java 和 HTML可以组合成一个扩展名为.jsp的文件。有人说，**Servlet就是在Java中写HTML，而JSP就是在HTML中写Java代码**，当然这个说法是很片面且不够准确的。
- JSP 侧重于视图，Servlet 更侧重于控制逻辑，在 MVC 架构模式中，JSP 适合充当视图（view）而Servlet适合充当控制器（controller）。

## 2. JSP 九大内置对象

JSP中一共预先定义了9个内置对象：内置对象，又叫做隐含对象，不需要预先声明就可以在脚本代码和表达式中随意使用

- `request`：代表客户端的请求。request包含客户端的信息以及请求的信息，如请求那个文件，附带的地址参数等。**request对象的作用域为一次请求，每次客户端的请求都会产生一个request实例**

  request 对象的常用方法：

  - **object getAttribute(String name)** 　返回指定属性的属性值
  - **void setAttribute(String key, Object obj)** 　设置属性的属性值
  - **void setCharacterEncoding(“utf-8”)** 　设置接受参数的字符集
  - **String getParameter(String name)** 　返回 name 指定参数的参数值
  - **String getParameterValues(String name)**  返回具有相同参数名称的数值的集合，返回String类型的数组
  - **void getRequestDispatcher(String uripath)** 页面的转发，地址不会发生改变，因为针对客户端来说只发生了一次请求

- `response`：代表客户端的响应。服务器端的任何输出都通过response对象发送到客户端浏览器。**response 只在JSP页面内有效，每次服务器端都会响应一个response实例**

  response 对象的常用方法：

  - **sendRedirect(java.lang.String location)** 　重定向客户端的请求

- `pageContext`：通过pageContext能够获取到JSP中的资源；

  pageContext 对象的常用方法：

  - **ServletRequest getRequest()** 　 返回request对象
  - **ServletResponse getResponse()** 　 返回response对象
  -  **void setAttribute(String name,Object attribute)** 　　设置属性及属性值 ，在page范围内有效
  - **public Object getAttribute(String name)** 　取属性的值
  -  **public Object findAttribute(String name)** 　寻找一属性,返回起属性值或NULL
  - **void include(String relativeUrlPath)** 　 在当前位置包含另一文件

- `session`：session与cookie是记录客户访问信息的两种机制，session是用于服务器端保存用户信息，cookie用于在客户端保存用户信息。

  **Servlet中通过 `request.getSession() `来获取session对象，而JSP中可以直接使用**。如果JSP中配置了 `<%@page session=”false”%>`, 则session不可用。<u>每个用户对应一个session对象</u>
  session 对象的常用方法：	

  - **void setAttribute(String key,Object obj)** 　设置Session的属性
  - **Object getAttribute(String name)**    返回session中属性名为name的对象
  - **public String getId()** 返回SESSION创建时JSP引擎为它设的唯一ID号 （常用）

- `application`：封装服务器运行环境的对象；**Servlet中application对象需要通过`ServletConfig.getServletContext()` 来获取**。<u>整个Web应用程序对应一个application对象</u>

  application 对象的常用方法：

  - **Object getAttribute(String name)**　　返回application中属性为name的对象
  - **void setAttribute(String name,Object value)**　　设置application属性

- `out`：输出服务器响应的输出流对象；

- `config`：Web应用的配置对象；

- `page`：代表当前JSP页面本身（相当于Java 程序中的 this）；

  page 的常用方法：

  - **class getClass（String ClassName）**  返回此Object的类 （常用）

- `exception`：封装页面抛出异常的对象。

## 3. request.getAttribute() 和 request.getParameter()有何区别

**从获取方向来看：**

- `getParameter()`是获取 POST/GET 传递的参数值；

- `getAttribute()`是获取对象容器中的数据值；

**从用途来看：**

- `getParameter()`用于客户端重定向时，即点击了链接或提交按扭时传值用，即用于在用表单或url重定向传值时接收数据用。

- `getAttribute()` 用于服务器端重定向时，即在 sevlet 中使用了 forward 函数。 **getAttribute 只能收到程序用 setAttribute 传过来的值。**

- 另外，可以用 `setAttribute()`,`getAttribute()` 发送接收对象.而 `getParameter()` 显然只能传字符串。 `setAttribute()` 是应用服务器把这个对象放在该页面所对应的一块内存中去，当你的页面服务器重定向到另一个页面时，应用服务器会把这块内存拷贝另一个页面所对应的内存中。这样`getAttribute()`就能取得你所设下的值，当然这种方法可以传对象。

**总结：**

- `getParameter()`返回的是String,用于读取提交的表单中的值;（获取之后会根据实际需要转换为自己需要的相应类型，比如整型，日期类型啊等等）

- `getAttribute()`返回的是Object，需进行转换,可用`setAttribute()`设置成任意对象，使用很灵活，可随时用

## 4. JSP 四大作用域

SP中的四种作用域包括 page、request、session和application，具体来说：

- **page**代表与<u>一个页面</u>相关的对象和属性。
- **request** 代表与Web客户机发出的<u>一个请求</u>相关的对象和属性。一个请求可能跨越多个页面，涉及多个Web组件；需要在页面显示的临时数据可以置于此作用域。
- **session** 代表与某个用户与服务器建立的一次会话相关的对象和属性。<u>跟某个用户相关的数据应该放在用户自己的session中。</u>
- **application**代表与<u>整个Web应用程序</u>相关的对象和属性，它实质上是跨越整个Web应用程序，包括多个页面、请求和会话的一个全局作用域。

## 5. 实现会话跟踪的技术有哪些

### ① 使用 Cookie

向客户端发送Cookie

```java
Cookie c =new Cookie("name","value"); //创建Cookie 
c.setMaxAge(60*60*24); //设置最大时效，此处设置的最大时效为一天
response.addCookie(c); //把Cookie放入到HTTP响应中Copy to clipboardErrorCopied
```

从客户端读取Cookie

```java
String name ="name"; 
Cookie[]cookies =request.getCookies(); 
if(cookies !=null){ 
   for(int i= 0;i<cookies.length;i++){ 
    Cookie cookie =cookies[i]; 
    if(name.equals(cookis.getName())) 
    //something is here. 
    //you can get the value 
    cookie.getValue(); 

   }
 }
```

**优点:** 数据可以持久保存，不需要服务器资源，简单，基于文本的Key-Value

**缺点:** 大小受到限制，用户可以禁用Cookie功能，由于保存在本地，有一定的安全风险。

### ② URL 重写

在URL中添加用户会话的信息作为请求的参数，或者**将唯一的 Session ID 添加到 URL 结尾以标识一个会话**。

**优点：** 在Cookie被禁用的时候依然可以使用

**缺点：** 必须对网站的URL进行编码，所有页面必须动态生成，不能用预先记录下来的URL进行访问。

### ③ 隐藏的表单域

```html
<input type="hidden" name ="session" value="..."/>Copy to clipboardErrorCopied
```

**优点：** Cookie被禁时可以使用

**缺点：** 所有页面必须是表单提交之后的结果。

### ④ Session

在所有会话跟踪技术中，HttpSession对象是最强大也是功能最多的。

- 当用户第一次访问Servlet时,服务器端会给用户创建一个独立的Session
- 并且生成一个SessionID,**这个SessionID在响应浏览器的时候会被装进cookie中,从而被保存到浏览器中**
- **当用户再一次访问Servlet时,请求中会携带着cookie中的SessionID去访问**
- 服务器会根据这个SessionID去查看是否有对应的Session对象
- 有就拿出来使用; 没有就创建一个Session(相当于用户第一次访问)

## 6. Cookie 和 Session 的区别

**Cookie 和 Session都是用来跟踪浏览器用户身份的会话方式**，但是两者的应用场景不太一样。

- `Cookie` 一般用来**保存用户信息，存储在客户端（浏览器）** 比如:
  ① 我们在 Cookie 中保存已经登录过得用户信息，下次访问网站的时候页面可以自动帮你登录的一些基本信息给填了； 
  ② 一般的网站都会有保持登录也就是说下次你再访问网站的时候就不需要重新登录了，这是因为用户登录的时候我们可以存放了一个 Token 在 Cookie 中，下次登录的时候只需要根据 Token 值来查找用户即可(为了安全考虑，重新登录一般要将 Token 重写)； 
  ③ 登录一次网站后访问网站其他页面不需要重新登录。
- `Session` 的主要作用就是**通过服务端记录用户的状态**。 典型的场景是购物车，当你要添加商品到购物车的时候，系统不知道是哪个用户操作的，因为 **HTTP 协议是无状态的**。服务端给特定的用户创建特定的 Session 之后就可以通过 Session ID 标识这个用户并且跟踪这个用户了。



**Cookie 存储在客户端（浏览器）中，而Session存储在服务器上，相对来说 Session 安全性更高**。如果要在 Cookie 中存储一些敏感信息，不要直接写入 Cookie 中，最好能将 Cookie 信息加密然后使用到的时候再去服务器端解密。