# 概述

---



<img src="https://gitee.com/veal98/images/raw/master/img/20200517230217.png" style="zoom:80%;" />

- SpringMVC 是一种基于 Java 的实现 MVC 设计模型的请求驱动类型的轻量级 Web 框架，属于 Spring FrameWork 的后续产品，已经融合在 Spring Web Flow 里面。
- Spring 框架提供了构建 Web 应用程序的全功 能 MVC 模块。使用 Spring 可插入的 MVC 架构，从而在使用 Spring 进行 WEB 开发时，可以选择使用 Spring 的 Spring MVC 框架或集成其他 MVC 开发框架，如 Struts1(现在一般不用)，Struts2 等。
- SpringMVC 已经成为目前最主流的 MVC 框架之一，并且随着 Spring3.0 的发布，全面超越 Struts2，成 为最优秀的 MVC 框架。 它通过一套注解，让一个简单的 Java 类成为处理请求的控制器，而无须实现任何接口。同时它还支持 RESTful 编程风格的请求。

![](https://gitee.com/veal98/images/raw/master/img/20200517221650.png)

<br>



# 一、SpringMVC 入门案例

---



入门案例的需求：实现 jsp 界面点击超链接，发送请求，成功转发到指定的 jsp 界面

## 1. 环境搭建

### Ⅰ 创建基于 Maven 的 web 工程

![img](https://img-blog.csdnimg.cn/20200320111058465.png)

### Ⅱ 创建文件夹 java、resource

创建两个文件夹 ：**java 存放源码、resources 存放资源**

![img](https://img-blog.csdnimg.cn/20200320112045711.png)

![img](https://img-blog.csdnimg.cn/20200320112124350.png)

### Ⅲ 导入依赖

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <spring.version>5.0.2.RELEASE</spring.version> <!--版本锁定-->
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>${spring.version}</version>
    </dependency>

    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-web</artifactId>
      <version>${spring.version}</version>
    </dependency>

    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>${spring.version}</version>
    </dependency>

    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>servlet-api</artifactId>
      <version>2.5</version>
      <scope>provided</scope>
    </dependency>

    <dependency>
      <groupId>javax.servlet.jsp</groupId>
      <artifactId>jsp-api</artifactId>
      <version>2.0</version>
      <scope>provided</scope>
    </dependency>
  </dependencies>
```

### Ⅳ 配置文件准备

在 web.xml 中配置核心控制器 `DispatcherServlet`

```xml
  <servlet>
    <servlet-name>dispatcherServlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>dispatcherServlet</servlet-name>
    <url-pattern>/</url-pattern>
  </servlet-mapping>
```

创建spingmvc.xml 配置文件

![img](https://img-blog.csdnimg.cn/20200320113201770.png)

### Ⅴ 配置Tomcat服务器

可参考这篇博客：👉 [（详细图示）IDEA 配置Tomcat服务器和发布web项目](https://blog.csdn.net/sinat_34104446/article/details/85337513)

## 2. 编写代码

### Ⅰ springmvc.xml 配置 IoC 和视图解析器

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
       http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/mvc
       http://www.springframework.org/schema/mvc/spring-mvc.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd">

    <!--开启注解扫描-->
    <context:component-scan base-package="com.smallbeef"></context:component-scan>

    <!--视图解析器
    prefix 前缀: 去 /WEB-INF/pages/ 路径下找资源，与Controller的return语句中的路径构成完整路径名
    suffix 后缀: 匹配.jsp为后缀的文件-->
    <bean id = "internalResourceViewResolver" class = "org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/pages/"></property>
        <property name="suffix" value=".jsp"></property>
    </bean>

    <!--开启SpringMVC对注解的支持-->
    <mvc:annotation-driven></mvc:annotation-driven>
</beans>
```



### Ⅱ 将 springmvc.xml 加载进 web.xml

```xml
	<servlet>
    <servlet-name>dispatcherServlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>classpath:springmvc.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
  </servlet>
```



### Ⅲ 前端界面

- `index.jsp`

  ```jsp
  <%@ page contentType="text/html;charset=UTF-8" language="java" %>
  <html>
  <head>
      <title>Titl</title>
  </head>
  <body>
      <h3>入门SpringMVC案例</h3>
  
      <a href="/hello">hello</a>
  </body>
  </html>
  ```



- 跳转界面 `success.jsp`

  ```jsp
  <%@ page contentType="text/html;charset=UTF-8" language="java" %>
  <html>
  <head>
      <title>Title</title>
  </head>
  <body>
      <h1>Success!</h1>
  </body>
  </html>
  ```



### Ⅳ 控制器类

```java
//控制器类
@Controller
public class HelloController {

    /*请求映射*/
    @RequestMapping(path = "/hello")
    public String sayHello(){
        System.out.println("Hello SpringMVC");
        return "success"; //返回名为success的jsp文件
    }
}
```



**整个项目结构如下：**

![img](https://img-blog.csdnimg.cn/2020032012125352.png)



<br>



# 二、案例的执行过程及相关组件

---



## 1. 执行过程

![](https://gitee.com/veal98/images/raw/master/img/20200517232439.png)

## 2. 相关组件

### ① DispatcherServlet：前端控制器

用户请求到达前端控制器，它就相当于 MVC模式中的 C， DispatcherServlet 是整个流程控制的中心 ，由 它调用其它组件处理用户的请求，DispatcherServlet 的存在降低了组件之间的耦合性。

DispatcherServlet 在` web.xml` 中进行配置

```xml
<servlet>
    <servlet-name>dispatcherServlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>classpath:springmvc.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>
```

- `load-on-startup`：表示启动容器时初始化该 Servlet
- `contextConfigLocation`：表示 SpringMVC 配置文件的路径
- `url-pattern`：表示将哪些请求交给 Spring Web MVC 处理。`'/'` 是用来定义默认 servlet 映射的。也可以如 `'*.html'` 表示拦截所有以 html 为扩展名的请求

### ② HandlerMapping：处理器映射器

HandlerMapping 负责根据用户请求找到 Handler 即处理器(Controller) ，SpringMVC 提供了不同的映射器实现不同的 映射方式，例如：配置文件方式，实现接口方式，注解方式等。

### ③ Handler：处理器(Controller)

它就是我们开发中要编写的具体业务控制器。由 DispatcherServlet 把用户请求转发到 Handler。 由 Handler 对具体的用户请求进行处理。

### ④ HandlAdapter：处理器适配器

通过 HandlerAdapter 对处理器进行执行，这是适配器模式的应用，通过扩展适配器可以对更多类型的处理 器进行执行。

### ⑤ View Resolver：视图解析器

View Resolver 负责将处理结果生成 View 视图 ，View Resolver 首先根据逻辑视图名解析成物理视图名 即具体的页面地址，再生成 View 视图对象，最后对 View 进行渲染 将处理结果通过页面展示给用户 。

### < mvc:annotation-driven >说明

在 SpringMVC 的各个组件中，处理器映射器、处理器适配器、视图解析器称为 SpringMVC 的三大组件。

但是在案例中，我们并没有配置 HandlerMapping 和 HandlAdapter

因为使用 `< mvc:annotation-driven >` 就会自动加载 RequestMappingHandlerMapping （处理映射器）和 RequestMappingHandlerAdapter （ 处 理 适 配 器 ） ， 可在 SpringMVC.xml 配 置 文 件 中 使 用 < mvc:annotation-driven > 替代处理器和适配器的配置。

<br>



# 三、@RequestMapping 详解 

---



## 1. 作用

@RequestMapping： 请求映射

**用于建立请求 URL 和处理请求方法之间的对应关系。**

若 @RequestMapping 出现在类上，则类中的所有方法的 url 都必须加上该前缀

比如 以下代码中 findAccount() 的 前端请求 url 就是 `/account/findAccount`

```java
@Controller("accountController") 
@RequestMapping("/account") 
public class AccountController { 
	@RequestMapping("/findAccount")  
	public String findAccount() {   
		System.out.println("查询了账户。。。。");   
		return "success";  
	} 
} 
```

## 2. 属性

- `path` ：指定请求路径的url 

- `value`  ：value属性和path属性是一样的 

- `mthod` ：指定该方法的请求方式 POST/GET/PUT......

  ```java
  @RequestMapping(value="/saveAccount",method=RequestMethod.POST) 
  ```

  > a标签的请求方式是固定不变的，是GET类型

- `params`  ：指定限制请求参数的条件 

  ```java
  @RequestMapping(value="/removeAccount",params= {"accountName","money>100"}) 
  
  ——————————————————————————————————————————
  
  <a href="account/removeAccount?accountName=aaa&money>100">删除账户，金额 100</a> <br/> 
  
  <a href="account/removeAccount?accountName=aaa&money>150">删除账户，金额 150</a> 
  ```

  注意： 

  当我们点击第一个超链接时,可以访问成功。 

  当我们点击第二个超链接时，无法访问。

- `headers`  发送的请求中必须包含的请求头

<br>



# 四、ModelAndView 详解

---



## 1. 概述

对于 MVC 框架，控制器Controller执行业务逻辑，用于产生模型数据 Model ，而视图 View 用于渲染模型数据。
**使用 Model 和 ModelAndView 这两个类在 Spring 的视图解析时作用以及区别：**

- **Model只是用来传输数据的，并不会进行业务的寻址。ModelAndView 却是可以进行业务寻址的**，就是设置对应的要请求的静态文件，这里的静态文件指的是类似jsp的文件
- Model是每一次请求可以自动创建，但是ModelAndView 是需要我们自己去new的

## 2. Model

**Model 是每次请求中都存在的默认参数**，利用其 `addAttribute()` 方法即可将服务器的值传递到 jsp 页面中，可在 jsp 界面通过 EL 表达式获取传值

**示例代码**：

```java
@RequestMapping("listCategory2")
public String listCategory2(Model model) {
    // 接收查询的信息
    List<Category> cs2= categoryService.list();
    // 封装了查询的数据
    model.addAttribute("test", cs2);
    //重要！！需要给出返回model跳转的路径
    return "success";
}
```

```jsp
<!-- 获取值的时候，对应的是addAttribute的第一个参数！取了个别名为c-->
    <c:forEach items="${test }" var="c" >
        <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
        </tr>
    </c:forEach>
```

## 3. ModelMap

`ModelMap`：ModelMap 对象主要用于传递控制方法处理数据到结果页面，也就是说我们把结果页面上需要的数据放到 ModelMap 对象中即可，
他的作用类似于 request 对象的 setAttribute 方法的作用: 用来在一个请求过程中传递处理的数据。
ModelMap 或者 Model 通过 addAttribute 方法向页面传递参数.

```java
public ModelMap addAttribute(String attributeName, Object attributeValue){...}
public ModelMap addAttribute(Object attributeValue){...}
public ModelMap addAllAttributes(Collection<?> attributeValues) {...}
public ModelMap addAllAttributes(Map<String, ?> attributes){...}
```

## 4. ModelAndView

使用ModelAndView类用来存储处理完后的结果数据，以及显示该数据的视图。ModelAndView 中的Model代表模型，View代表视图，这个名字就很好地解释了该类的作用

**添加模型数据** :

- `ModelAndView addObject(String attributeName, Object attributeValue)`

- `ModelAndView addAllObject(Map<String, ?> modelMap)`

**设置视图**：

- `void setView(View view)` 

- `void setViewName(String viewName)`

**示例代码**：

```java
	@RequestMapping("listCategory")
    public ModelAndView listCategory(){
        //创建一个模型视图对象
        ModelAndView mav = new ModelAndView();
        //获取到查询的数据
        List<Category> cs= categoryService.list();

        //将数据放置到ModelAndView对象view中
        mav.addObject("cs_model", cs);
        // 放入jsp路径
        mav.setViewName("listCategory");
         //返回ModelAndView对象mav
        return mav;
    }
```

同样在 jsp 界面通过 EL 表达式获取传值

<br>



# 五、Controller 的返回值

---



## 1. 返回 ModelAndView

```java
  /**     
  * 返回ModelAndView对象     
  * 可以传入视图的名称（即跳转的页面），还可以传入对象。     
  * @return     
  * @throws Exception     
  */    
  @RequestMapping(value="/findAll")    
  public ModelAndView findAll() throws Exception {        
  	 ModelAndView mv = new ModelAndView();        
             
  	 // 模拟从数据库中查询所有的用户信息        
  	 List<User> users = new ArrayList<>();        
  	 User user1 = new User();        
  	 user1.setUsername("张三");        
  	 user1.setPassword("123");                
  	 User user2 = new User();        
  	 user2.setUsername("赵四");        
  	 user2.setPassword("456"); 
  	 users.add(user1);        
  	 users.add(user2);       
  	 
  	 // 添加对象        
  	 mv.addObject("users", users);    
  	 // 跳转到list.jsp的页面        
  	 mv.setViewName("list");               
  	 return mv;    
 } 
```

jsp 界面通过 EL 表达式取值

```jsp
 <h3>查询所有的数据</h3>    
 <c:forEach items="${ users }" var="user">        
 	${ user.username }    
 </c:forEach>
```



## 2. 返回 void

由于默认的 Maven 项目中 没有 servlet，所以需要额外添加一个依赖

```xml
<dependency>
	<groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>4.0.1</version>
</dependency>
```

- 通过 `HttpServletRequest` 做服务端跳转

  ```java
  @RequstMapping
  public void hello(HttpServletRequest req,HttpServletResponse resp){
      req.getRequestDispatcher("/hello.jsp").forward(req,resp);
  }
  ```

- 通过 `HttpServletResponse `做重定向

  **重定向无法访问 WEB-INF 路径下的资源**

  ```java
  @RequstMapping
  public void hello(HttpServletRequest req,HttpServletResponse resp){
      resp.sendRedirct(request.getContextPath()+"/hello.jsp");
  }
  ```

- 通过 `HttpServletResponse `给出相应

  这种方式，既可以返回 JSON，也可以返回普通字符串

  ```java
  @RequstMapping
  public void hello(HttpServletRequest req,HttpServletResponse resp){
      resp.setContentType("text/html;charset=utf-8");
      PrintWriter out = resp.getWriter();
      out.write("hello");
      out.flush();
      out.close();
  }
  ```

  

## 3. 返回字符串

- **返回逻辑视图名**

  ```java
  @RequestMapping
  public String hello(Model model){
      model.addAttribute("username","xiaowu");
      return "success"; //去查找一个名为 success 的视图
  }
  ```

- **服务端跳转：请求转发**

  `forward `后面跟上跳转的路径

  ```java
  @RequestMapping
  public String hello(){
      return "forward:/success.jsp";
  }
  ```

- **客户端跳转：重定向**

  ```java
@RequestMapping
  public String hello(){
      return "redirect:/success";
  }
  ```
  
- **返回字符串**

  上面三个返回的字符串都是有特殊含义的，如果一定要返回一个字符串，需要额外添加一个注解 `@ResponseBody`，表示当前方法的返回值就是要展示出来的返回值，没有特殊含义

  ```java
  @RequestMapping
  @ResponseBody
  public String hello(){
      return "I love China";
  }
  ```

  如果返回中文字符串，是会乱码的，需要在 @RequestMapping 中添加 produces 属性解决

  ```java
  @RequestMapping(produces = "text/html;charset = utf-8")
  ```

  

<br>



# 六、请求参数的绑定

---



## 1. 绑定基本数据类型

```java
@Controller
public class HelloController {

    /*请求映射*/
    @RequestMapping(path = "/hello")
    public String sayHello(String username, Double password, Boolean ispublic){
        System.out.println(username);
        System.out.println(password);
        System.out.println(ispublic);
        return "success"; //返回名为success的jsp文件
    }
}
```

a 标签请求中带上**和控制器参数名一样**的参数，并赋值

```html
<a href="/hello?username=123&password=1234&ispublic=true">hello</a>
```

## 2. 绑定实体类型

实体类：

```java
public class Account implements Serializable {
    private String username;
    private String password;
    private Double money;

    public String getUsername() {
        return username;
    }

    public void setUsername(String usernmae) {
        this.username = usernmae;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Double getMoney() {
        return money;
    }

    public void setMoney(Double money) {
        this.money = money;
    }

    @Override
    public String toString() {
        return "Account{" +
                "usernmae='" + username + '\'' +
                ", password='" + password + '\'' +
                ", money=" + money +
                '}';
    }
}

```



**form 表单中 name 的名称要和 JavaBean 对象的属性名对应**

```html
 <form action = "/hello">
        姓名：<input type="text" name="username" /><br/>
        密码：<input type="text" name="password" /><br/>
        金额：<input type="text" name="money" /><br/>
        <input type="submit" value="提交" />
    </form>
```



**控制器类传入该实体类对象**

```java
//控制器类
@Controller
public class HelloController {

    /*请求映射*/
    @RequestMapping(path = "/hello")
    public String sayHello(Account account){
        System.out.println(account); //会调用account的toString方法
        return "success"; //返回名为success的jsp文件
    }
}
```

![img](https://img-blog.csdnimg.cn/20200321215422717.png)

输出结果：

> Account{username='123', password='123', money=123.0}



🥇 **如果该类中嵌入了一个其他类**

```java
public class Account implements Serializable{
    private String username;
    private String password;
    private Double money;
    private User user;
    
-----------------------------------------
    
public class User implements Serializable {
    private String uname;
    private Integer age;
```

通过 `user.uname` 访问该嵌入类的属性。控制器类代码同上

```html
用户姓名：<input type="text" name="user.uname" /> <br/>
用户年龄：<input type="text" name="user.age" /> <br/>
```



![img](https://img-blog.csdnimg.cn/2020032122053774.png)

> 🚨 此处输入中文可能会乱码，参考下一节 **<u>七、配置解决中文乱码的过滤器</u>**



输出结果：

> Account{username='123', password='123', money=123.0, user=User{uname='123', age=123}}



## 3. 绑定集合类型

```java
public class Account implements Serializable{
    private String username;
    private String password;
    private Double money;

    private List<User> list;
    private Map<String,User> map;

-----------------------------------------
    
public class User implements Serializable {
    private String uname;
    private Integer age;
```

将用户属性封装进 list 对象和 map 对象。控制器类代码同上

> 此处 map 中的 key 命名为 first ，自己随意命名

```html
用户姓名：<input type="text" name="list[0].uname" /><br/>
用户年龄：<input type="text" name="list[0].age" /><br/>

用户姓名：<input type="text" name="map['first'].uname" /><br/>
用户年龄：<input type="text" name="map['first'].age" /><br/>
```


<img src="https://img-blog.csdnimg.cn/20200321222545441.png" alt="img" style="zoom:80%;" />

输出结果：

> Account{username='231', password='12', money=123.0, list=[User{uname='嘿嘿', age=123}], map={first=User{uname='呵呵', age=321}}}



## 4. 绑定自定义类型

**表单提交的任何数据类型全部都是字符串类型**，但是后台定义 Integer 类型，数据也可以封装上，因为 **Spring 框架内部会默认进行数据类型转换**

比如：日期 Date 的格式如果为 2000/11/11 则可正确封装，但是如果不是这个格式（比如 2000-11-11），就会出错。

如果想自定义数据类型转换，需要实现 `Converter` 的接口

- **定义一个类，实现 Converter 接口，该接口有两个泛型**

  ```java
  // 将一个 Date 类型转换为 String 类型
  @Component
  public class StringToDateConverter implements Converter<String, Date> {
      /**
       * @param source 传进来的字符串
       * @return
       */
      @Override
      public Date convert(String source) {
          DateFormat format = null;
          try {
              if(StringUtils.isEmpty(source)) {
                  throw new NullPointerException("请输入要转换的日期");
              }
              format = new SimpleDateFormat("yyyy-MM-dd");
              Date date = format.parse(source); //字符串转日期类型
              return date;
          } catch (Exception e) {
              throw new RuntimeException("输入日期有误");
          }
  
      }
  }
  ```

- **在 Spring 配置文件中配置类型转换器**

  ```xml
  <!--配置自定义类型转换器-->
  <bean id = "conversionServiceFactoryBean" class = "org.springframework.context.support.ConversionServiceFactoryBean">
      <property name="converters">
           <set>
                <bean class="com.smallbeef.utils.StringToDateConverter"></bean>
           </set>
      </property>
  </bean>
  <!--开启SpringMVC对注解的支持-->
  <mvc:annotation-driven conversion-service="conversionServiceFactoryBean"></mvc:annotation-driven>
  ```

  配置完成后，在服务器端就可以接收到前端传过来的 2000-11-11 这种格式的日期参数了



## 5. 使用 Servlet 原生的 API 对象作为方法参数

SpringMVC 还支持使用原始 ServletAPI 对象作为控制器方法的参数。
支持原始 ServletAPI 对象有： 

- HttpServletRequest  
- HttpServletResponse 
- HttpSession 
- java.security.Principal 
- Locale 
- InputStream  
- OutputStream  
- Reader  
- Writer 



我们可以把上述对象，直接写在控制器方法的参数中使用。

```java
@RequestMapping("/testServletAPI") 
public String testServletAPI(HttpServletRequest request, 
							HttpServletResponse response,
							HttpSession session) {  
       System.out.println(request);  
       System.out.println(response);  
       System.out.println(session);  
       return "success"; 
} 
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200518221216.png" style="zoom:80%;" />

<br>



# 七、配置解决中文乱码的过滤器

---



在 web.xml中 配置过滤器

```java
 <!--配置解决中文乱码的过滤器-->
  <filter>
    <filter-name>characterEncodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <!--传入初始化参数，解决哪个字符集乱码问题-->
    <init-param>
      <param-name>encoding</param-name>
      <param-value>UTF-8</param-value>
    </init-param>
  </filter>
  <filter-mapping>
    <filter-name>characterEncodingFilter</filter-name>
    <!--拦截什么网址，此处设置全部拦截-->
    <url-pattern>/*</url-pattern>
  </filter-mapping>
```

<br>



# 八、常用注解

---



## 1. RequestParam

**作用：**  把请求中指定名称的参数给控制器中的形参赋值。 

**属性：**  

- `value`：请求参数中的名称。  
- `required`：请求参数中是否必须提供此参数。默认值：true。表示必须提供，如果不提供将报错。 

示例代码如下：

```java
@RequestMapping("/useRequestParam") 
public String useRequestParam(@RequestParam("name")String username,      
             				@RequestParam(value="age",required=false)Integer age){  	
		System.out.println(username+","+age);  
		return "success"; 
}
```

则前端参数名称必须为name、age(由于设置了 `required=false` ，所以该参数可不提供)

```html
<a href="/useRequestParam?name=test">requestParam 注解</a> 
```

## 2. RequestBody

**作用：**用于获取请求体内容。直接使用得到是 key=value&key=value...结构的数据。  

(get 请求方式不适用。因为get请求会直接把参数放在地址 url 上 )

**属性：**  

- `required`：是否必须有请求体。默认值是：true

  当取值为 true 时,get 请求方式会报错。如果取值 为 false，get 请求得到是 null

示例代码如下：

```java
@RequestMapping("/useRequestBody") 
public String useRequestBody(@RequestBody(required=false) String body){  	
	System.out.println(body);  
	return "success"; 
}
```

```html
post 请求 jsp代码： 
<form action="springmvc/useRequestBody" method="post"> 
 用户名称：<input type="text" name="username" ><br/>  
 用户密码：<input type="password" name="password" ><br/>  
 用户年龄：<input type="text" name="age" ><br/> 
 <input type="submit" value=" 保存 "> </form> 
------------------------------------------------------------------------------------
get 请求 jsp代码： 
<a href="springmvc/useRequestBody?body=test">requestBody 注解 get 请求</a> 
```

<img src="https://img-blog.csdnimg.cn/20200322112818799.png" alt="img" style="zoom:80%;" />

## 3. PathVaribale

**作用：**用于绑定 url 中的占位符。例如：请求 url 中 `/delete/{id}`，这个 `{id}` 就是 url 占位符。  

url 支持占位符是 Spring3.0 之后加入的。是 SpingMVC 支持 rest 风格 URL（见下一节 **<u>九、RESTful</u>**）的一个重要标志。 

**属性：**  

- value：用于指定 url 中占位符名称。 
- required：是否必须提供占位符

示例代码如下：

```java
@RequestMapping("/usePathVariable/{sid}") 
public String usePathVariable(@PathVariable("sid") Integer id){  
	System.out.println(id);  
	return "success"; 
} 
```

路径上的名称 `@RequestMapping("/usePathVariable/{sid}") ` 和注解中的名称 `@PathVariable("sid")` 要一致，和参数名称 `Integer id` 无关。

前端传参

```html
<a href="/usePathVariable/100">pathVariable 注解</a> 
```

##  4. RequestHeader 

作用：用于获取请求消息头。 

属性：

- `value`：提供消息头名称  
- `required`：是否必须有此消息头 

示例代码如下：

```java
@RequestMapping("/useRequestHeader") 
public String useRequestHeader(@RequestHeader(value="Accept-Language",          	
								required=false)String requestHeader){  
	System.out.println(requestHeader);  
	return "success"; 
}
```

## 5. CookieValue

**作用：**用于把指定 cookie 名称的值传入控制器方法参数。 

**属性：**  

- `value`：指定 cookie 的名称。  
- `required`：是否必须有此 cookie。 

```java
@RequestMapping("/useCookieValue") 
public String useCookieValue(@CookieValue(value="JSESSIONID",required=false) String 	
cookieValue){  
	System.out.println(cookieValue);  
	return "success"; 
}
```

## 6. ModelAttribute

### ① 概述

**作用：**

该注解是 SpringMVC4.3 版本以后新加入的。它可以用于修饰方法和参数。

@ModelAttribute 注解作用在方法上或者方法的参数上，**表示将被注解的方法的返回值或者是被注解的参数作为Model的属性加入到Model中，然后Spring框架自会将这个Model传递给ViewResolver**。Model的生命周期只有一个http请求的处理过程，请求处理完后，Model就销毁了。

 - **出现在方法上，表示当前方法会在控制器的方法执行之前，先执行**。 它可以修饰没有返回值的方法，也可以修饰有具体返回值的方法。  
 - **出现在参数上，获取指定的数据给参数赋值**。 



**属性：** 

- `value`：用于获取数据的 key。key 可以是 POJO(简单Java对象，实际就是普通JavaBean) 的属性名称，也可以是 map 结构的 key。 



**应用场景：**

**当表单提交数据不是完整的实体类数据时，保证没有提交数据的字段使用数据库对象原来的数据。**  

例如：   我们在编辑一个用户时，用户有一个创建信息字段，该字段的值是不允许被修改的。在提交表单数据是肯定没有此字段的内容，一旦更新会把该字段内容置为 null，此时就可以使用此注解解决问题。 



**示例代码**：

```html
<a href="springmvc/testModelAttribute?username=test">测试 modelattribute</a>
```

```java
/** 
  * 被 ModelAttribute 修饰的方法,该方法会在控制器方法执行之前执行
  * @param user   
  * */  
  @ModelAttribute  
  public void showModel(User user) {   //直接获取前端传过来的值
  	System.out.println("执行了 showModel 方法"+user.getUsername());  
  } 
   /** 
  * 接收请求的方法   
  * @param user   
  * @return   
  */  
  @RequestMapping("/testModelAttribute")  
  public String testModelAttribute(User user) {   
  	System.out.println("执行了控制器的方法"+user.getUsername());   
  	return "success";  
  } 
```

<img src="https://img-blog.csdnimg.cn/20200322133318514.png" alt="在这里插入图片描述" style="zoom:80%;" />



###  ② 修饰方法带返回值 

需求：修改用户信息，要求用户的密码不能修改 

示例代码如下：

```html
<!-- 修改用户信息 
     没有用户密码项--> 
<form action="/updateUser" method="post"> 
 用户名称：<input type="text" name="username" ><br/>  
 用户年龄：<input type="text" name="age" ><br/>  
 <input type="submit" value=" 保存 "> </form> 
```

```java
/** 
 * 模拟去数据库查询  
 * @param username  用户输入的用户名
 * @return  
 */ 
 private User findUserByName(String username) {  
 	User user = new User();  
 	user.setUsername(username); 
 	user.setAge(19);  //假设数据库中该用户年龄为19
 	user.setPassword("123456");  //假设数据库中该用户密码为123456
 	return user; 
}

@ModelAttribute 
public User showModel(String username) {  //直接获取前端传递过来的username
	//模拟去数据库查询  
	User abc = findUserByName(username); 
 	System.out.println("执行了 showModel 方法" + abc);  
 	return abc; 
}

/** 
 * 模拟修改用户方法  
 * @param user  该user为ModelAttribute返回的user对象abc
 * @return  
 */ 
@RequestMapping("/updateUser") 
public String testModelAttribute(User user) { //接收ModeleAttribute返回的user对象并根据前端传值进行修改
	System.out.println("控制器中处理请求的方法：修改用户："+user);  
	return "success"; 
} 
```

<img src="https://img-blog.csdnimg.cn/20200322143857102.png" alt="img" style="zoom:80%;" />
修改了年龄，password不变

> 执行了showModel方法User{username='das', age=19, password='123456'}
> 控制器修改用户User{username='das', age=12, password='123456'}



### ③ 修饰方法不带返回值 + 修饰参数

```java
/** 
 * 查询数据库中用户信息  
 * 无返回值，将user对象存入map中
 * @param user  
 */ 
 @ModelAttribute 
 public void showModel(String username,Map<String,User> map) { 
 	//模拟去数据库查询  
 	User user = findUserByName(username); 
 	System.out.println("执行了 showModel 方法"+user);  
 	map.put("abc",user); 
 } 
 
 /** 
 * 模拟修改用户方法  
 * @param user 直接用ModelAttrubute封装在map中的user对象
 * @return  
 */ 
 @RequestMapping("/updateUser") 
 public String testModelAttribute(@ModelAttribute("abc")User user) {  
 	System.out.println("控制器中处理请求的方法：修改用户："+user);  
 	return "success"; 
 }
```

## 7. SessionAttribute

这个注解只能标注在类上，用于在**多个请求之间**传递参数，类似于`Session`的`Attribute`。

**但不完全一样**：一般来说`@SessionAttribute`设置的参数只用于**暂时的**传递，而不是长期的保存，长期保存的数据还是要放到`Session`中。（比如重定向之间暂时传值，用这个注解就很方便）

官方解释：当用`@SessionAttribute`标注的`Controller`向其模型Model添加属性时，将根据该注解指定的名称/类型检查这些属性，**若匹配上了就顺带也会放进Session里**。匹配上的将一直放在`Sesson`中，直到你调用了`SessionStatus.setComplete()`方法就消失了

**属性**：  

- `value`：用于指定存入的属性名称  

- `type`：用于指定存入的数据类型。 和value中顺序要对应上

  所以可以这样写：
  `@SessionAttributes(types = {User.class,Integer.class},value={“attr1”,”attr2”})`

**示例代码** ：

```java
<a href="/testPut">存入 SessionAttribute</a> <hr/> 
<a href="/testGet">取出 SessionAttribute</a> <hr/> 
<a href="/testClean">清除 SessionAttribute</a> 
```

```java
@Controller
@SessionAttributes(value ={"username","password"},types={Integer.class})  
public class SessionAttributeController {    
 
  @RequestMapping("/testPut")    
  public String testPut(Model model){    
  	//下面的代码将Model中的参数保存到了session中       
  	model.addAttribute("username", "泰斯特");           		
  	model.addAttribute("password","123456");           
  	model.addAttribute("age", 31);   
    //跳转之前将 username 和 password 保存到 session 中
    //因为注解 @SessionAttribute 中有这几个参数           
    return "success";       
  }               

	@RequestMapping("/testGet")       
	public String testGet(ModelMap model){           
	   System.out.println(model.get("username")+";"
	         +model.get("password")+";"+model.get("age"));           
	   return "success";       
	 }   
             
    @RequestMapping("/testClean")        
    public String complete(SessionStatus sessionStatus){       
    	sessionStatus.setComplete();            
    	return "success";        
    }   
}	 
```

<br>



# 九、RESTful

---



>  REST 风格 URL 

**什么是 rest：**  

- `REST（英文：Representational State Transfer，简称 REST）` 描述了一个架构样式的网络系统， 比如 web 应用程序。它首次出现在 2000 年 Roy Fielding 的博士论文中，他是 HTTP 规范的主要编写者之 一。在目前主流的三种 Web 服务交互方案中，REST 相比于 SOAP（Simple Object Access protocol，简单 对象访问协议）以及 XML-RPC 更加简单明了，无论是对 URL 的处理还是对 Payload 的编码，REST 都倾向于用更 加简单轻量的方法设计和实现。值得注意的是 REST 并没有一个明确的标准，而更像是一种设计的风格。  
- 它本身并没有什么实用性，其核心价值在于如何设计出符合 REST 风格的网络接口。 

**restful 的优点:**

它结构清晰、符合标准、易于理解、扩展方便，所以正得到越来越多网站的采用。 

**restful 的特性：** 

- `资源（Resources）`：网络上的一个实体，或者说是网络上的一个具体信息。  它可以是一段文本、一张图片、一首歌曲、一种服务，总之就是一个具体的存在。可以用一个 URI（统一 资源定位符）指它，每种资源对应一个特定的 URI 。要 获取这个资源，访问它的 URI 就可以，因此 URI 即为每一个资源的独一无二的识别符。 

- `表现层（Representation）`：把资源具体呈现出来的形式，叫做它的表现层（Representation）。 比如，文本可以用 txt 格式表现，也可以用 HTML 格式、XML 格式、JSON 格式表现，甚至可以采用二进制格式。 

- `状态转化（State Transfer）`：每发出一个请求，就代表了客户端和服务器的一次交互过程。 
  HTTP 协议，是一个无状态协议，即所有的状态都保存在服务器端。因此，如果客户端想要操作服务器，必须通过某种手段，让服务器端发生“状态转化”（State Transfer）。而这种转化是建立在表现层之上的，所以就是 “表现层状态转化”。

  **具体说，就是 HTTP 协议里面，四个表示操作方式的动词：GET、POST、PUT、DELETE。它们分别对应四种基本操作：GET 用来获取资源，POST 用来新建资源，PUT 用来更新资源，DELETE 用来删除资源。**

一般的 url 路径：每个方法对应不同的 url 路径

```java
@RequeMapping("/user/delete")
public void delete(){
}

@RequeMapping("/user/findAll")
public void findAll(){
}

@RequeMapping("/user/add")
public void add(){
}
```

RESTful 风格的路径

```java
@RequeMapping(value = "/user", method = RequestMethod.DELETE)
public void delete(){  // DELETE
}

@RequeMapping(value = "/user",method = RequestMethod.GET)
public void findAll(){ // GET
}

@RequeMapping(value = "/user/{id}",method = RequestMethod.GET)
public void findById(@PathVariable("id") String id){ // GET
}

@RequeMapping(value = "/user",method = RequestMethod.POST)
public void add(){	// POst
}
```

所有方法的路径都是一样的，通过发送的请求方式 get/post/delete/put 来确定使用哪个方法，如果两个方法的请求方式是相同的，则根据所带参数来判断调用哪个方法，比如上述代码中的 findAll 和 findById 方法

<br>



# 十、@ResponseBody 响应 json 数据 

---

需求：  使用@ResponseBody 注解实现将 controller 方法返回对象转换为 json 响应给客户端

## 1. 资源准备
首先需要导入 `jquery.min.js` 框架文件以及 `jackson` 的 依赖

<img src="https://img-blog.csdnimg.cn/20200324105911460.png" alt="在这里插入图片描述" style="zoom:80%;" />

导入jackson依赖（Springmvc 默认用 MappingJacksonHttpMessageConverter 对 json 数据进行转换，需要加入 jackson 的包。 ）

```xml
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-annotations</artifactId>
      <version>2.10.2</version>
    </dependency>
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.10.2</version>
    </dependency>
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-core</artifactId>
      <version>2.10.2</version>
    </dependency>
```

DispatcherServlet 会拦截到所有的资源，导致一个问题就是静态资源（img、css、js）也会被拦截到，从而不能被使用。解决该问题的就是需要配置静态资源不进行拦截，在 `springmvc.xml` 配置文件添加如下配置 ：

```xml
    <!-- 设置静态资源不过滤 -->
    <mvc:resources location="/css/" mapping="/css/**"/>  <!-- 样式 -->
    <mvc:resources location="/images/" mapping="/images/**"/>  <!-- 图片 -->
    <mvc:resources location="/js/" mapping="/js/**"/>  <!-- javascript -->
```

- location 元素表示 webapp 目录下的包下的所有文件 
- mapping 元素表示以 /static 开头的所有请求路径，如 /static/a 或者/static/a/b

**前端 jsp**
```html
<head>
    <title>Title</title>

    <srcipt src = "js/jquery.min.js"></srcipt>
    <script type = "text/javascript">

        $(function(){
            $("#testJson").click(function(){
                $.ajax({
                    type: "post",
                    url: "/testResponseJson",
                    contentType: "application/json; charset= utf-8",
                    data: '{"uname":"小黑", "age":20, "password":"123"}',
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

## 2. 获取请求体数据

使用@RequestBody获取请求体数据

```java
@Controller
public class HelloController {
    @RequestMapping("/testResponseJson")
    public void testResponseJson(@RequestBody String body){
        System.out.println("test方法执行了"+body);
    }
}
```
## 3. json 字符串 —> JavaBean 的对象

使用 `@RequestBody` 把 json 的字符串转换成 JavaBean 的对象

```java
//控制器类
@Controller
public class HelloController {
    @RequestMapping("/testResponseJson")
    public void testResponseJson(@RequestBody User user){
        System.out.println("test方法执行了"+ user);
    }
}

```
## 4. JavaBean 对象 —> json 字符串

使用 `@ResponseBody` 把 JavaBean 对象转换成 json 字符串

```java
//控制器类
@Controller
public class HelloController {
    @RequestMapping("/testResponseJson")
    public @ResponseBody User testResponseJson(@RequestBody User user){
        System.out.println("test方法执行了"+ user);
        user.setAge(21);
        return user;
    }
}
```

<br>



# 十一、文件上传

---



## 1. 传统方式的文件上传

传统方式的文件上传，指的是我们上传的文件和访问的应用存在于同一台服务器上。 并且上传完成之后，浏览器可能跳转。

### ① 导入依赖

```java
  <dependency>
      <groupId>commons-fileupload</groupId>
      <artifactId>commons-fileupload</artifactId>
      <version>1.3.1</version>
    </dependency>

    <dependency>
      <groupId>commons-io</groupId>
      <artifactId>commons-io</artifactId>            
      <version>2.4</version>        
    </dependency>
```

### ② Jsp界面

```html
<form action="/fileupload" method="post" enctype="multipart/form-data">
        <input type="file" name = "upload"/>
        <br/>
        <input type="submit" value="上传文件">
</form>
```

### ③ Controller控制器

```java
//控制器类
@Controller
public class FileController {

    @RequestMapping("/fileupload")
    public String fileupload(HttpServletRequest request) throws Exception {
        // 先获取到要上传的文件目录
        String realPath = request.getSession().getServletContext().getRealPath("/uploads");
        // 创建File对象，一会向该路径下上传文件
        File file = new File(realPath);
        // 判断路径是否存在，如果不存在，创建该路径
        if(!file.exists()){
            file.mkdirs();
        }
        // 创建磁盘文件项工厂
        DiskFileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload servletFileUpload = new ServletFileUpload(factory);
        // 解析request对象
        List<FileItem> list = servletFileUpload.parseRequest(request);
        // 遍历
        for(FileItem fileItem : list){
            // 判断文件项是普通字段，还是上传的文件
            if(fileItem.isFormField()){

            }
            // 上传文件项
            else{
                // 获取到上传文件的名称
                String filname = fileItem.getName();
                // 上传文件
                fileItem.write(new File(file,filname));
                // 删除临时文件
                fileItem.delete();
            }
        }
        return "success";
    }
}
```

### ④ 运行结果

文件会上传到 `target` 目录下的 uploads 文件夹

<img src="https://img-blog.csdnimg.cn/20200325102730442.png" alt="img" style="zoom:80%;" />

## 2. SpringMVC传统方式的文件上传 
同样需要导入上一步的pom依赖文件

原理如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200325103627616.png)

### ① 配置文件解析器 CommonsMultipartResolve

`springmvc.xml`

```xml
 <!-- 配置文件上传解析器 -->
    <bean id="multipartResolver"
        class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
            <!-- 设置上传文件的最大尺寸为 5MB -->
            <property name="maxUploadSize">   
                <value>5242880</value>
            </property>
    </bean>
```

**注意：**  文件上传的解析器 id 是固定的，不能起别的名称，否则无法实现请求参数的绑定。（不光是文件，其他 字段也将无法绑定） 

### ② Jsp界面

```html
<form action="/fileUpload2" method="post" enctype="multipart/form-data">
        名称：<input type="text" name="picname"/><br/>
        图片：<input type="file" name="uploadFile"/><br/>
        <input type="submit" value=" 上传 "/> 
    </form>
```

### ③ Controller控制器

```java
@RequestMapping("/fileUpload2")
    // 参数picname、uploadFile要和jsp界面的name一致
    public String FileUpload2(String picname, MultipartFile uploadFile, HttpServletRequest request) throws IOException {
        // 1. 定义文件名
        String fileName = "";
        // 获取原始文件名
        String uploadFileName = uploadFile.getOriginalFilename();
        // 截取文件扩展名
        String extendName = uploadFileName.substring(uploadFileName.lastIndexOf(".") + 1, uploadFileName.length());
        // 把文件加上随机数，防止文件重复
        String uuid = UUID.randomUUID().toString().replace("-","").toUpperCase();
        // 判断是否输入了文件名
        if(!StringUtils.isEmpty(picname)){
            fileName = uuid + "_" + picname + "." + extendName;
        }
        else{
            fileName = uuid + "_" + uploadFileName;
        }
        System.out.println(fileName);

        // 2. 获取到要上传的文件目录
        String realPath = request.getSession().getServletContext().getRealPath("/uploads");
        // 3. 创建File对象，一会向该路径下上传文件
        File file = new File(realPath);
        // 判断路径是否存在，如果不存在，创建该路径
        if(!file.exists()){
            file.mkdirs();
        }

        // 4. 使用 MulitpartFile 接口中方法，把上传的文件写到指定位置
        uploadFile.transferTo(new File(file, fileName));
        return "success";
    }
```

### ④ 运行结果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200325110039273.png)



<img src="https://img-blog.csdnimg.cn/20200325110124710.png" alt="在这里插入图片描述" style="zoom:80%;" />

## 3. SpringMVC 跨服务器方式的文件上传
<img src="https://gitee.com/veal98/images/raw/master/img/20200518220308.png" style="zoom:80%;" />

**此处我们用两个 Tomcat 服务器模拟应用服务器和图片服务器**



### ① 新建一个Tomcat服务器存储图片
新建一个 fileuploadserver web工程

![img](https://img-blog.csdnimg.cn/20200325111507155.png)

在webapp 下创建uploads文件夹用来存储图片

![img](https://img-blog.csdnimg.cn/20200325111829659.png)

**同时需要在target目录下创建uploads文件夹**（这一步很重要，不做的话会报409错误）

![img](https://img-blog.csdnimg.cn/20200325114347381.png)

Tomcat 服务器配置，注意修改端口号

![img](https://img-blog.csdnimg.cn/2020032511245233.png)

![img](https://img-blog.csdnimg.cn/20200325121214186.png)



**还需要在web.xml中修改serlvet权限，servlet默认权限是只读** (这步不做会报405错误)

```xml
<web-app>

  <display-name>Archetype Created Web Application</display-name>

  <servlet>
    <servlet-name>default</servlet-name>
    <servlet-class>org.apache.catalina.servlets.DefaultServlet</servlet-class>
    <init-param>
      <param-name>debug</param-name>
      <param-value>0</param-value>
    </init-param>
    <init-param>
      <param-name>readonly</param-name>
      <param-value>false</param-value>
    </init-param>
    <init-param>
      <param-name>listings</param-name>
      <param-value>false</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
  </servlet>
</web-app>
```

> `org.apache.catalina.servlets.DefaultServlet` 会爆红，不用理会，我们只需要能够修改权限就可以了

OK，至此，图片服务器 fileupload 的配置完毕，接下来开始应用服务器 springmvc 的配置和代码编写
### ② 导入依赖

```xml
<dependency>
      <groupId>com.sun.jersey</groupId>
      <artifactId>jersey-core</artifactId>
      <version>1.18.1</version>
    </dependency>
    
    <dependency>
      <groupId>com.sun.jersey</groupId>            
      <artifactId>jersey-client</artifactId>            
      <version>1.18.1</version>        
    </dependency>
```

### ③ Jsp界面

```java
<form action="/fileUpload3" method="post" enctype="multipart/form-data">
        图片：<input type="file" name="uploadFile"/><br/>
        <input type="submit" value=" 上传 "/>
</form>
```

### ④ Controller控制器

```java
 @RequestMapping(value = "/fileUpload3")
    // 参数picname、uploadFile要和jsp界面的name一致
    public String FileUpload3(MultipartFile uploadFile) throws IOException {
        System.out.println("SpringMVC跨服务器方式的文件上传......");
        //定义图片服务器的请求路径
        String path = "http://localhost:9090/uploads/";
        //获取到上传文件的名称
        String filename = uploadFile.getOriginalFilename();
        // 把文件加上随机数，防止文件重复
        String uuid = UUID.randomUUID().toString().replace("-", "").toUpperCase();
        // 文件名称唯一化
        filename = uuid + "_" + filename;

        //向图片服务器上传文件
        // 1. 创建客户端对象
        Client client = Client.create();
        // 2. 连接图片服务器
        WebResource resource = client.resource(path + filename);
        // 3. 上传文件
        resource.put(uploadFile.getBytes());

        return "success";
    }
```

### ⑤ 运行结果
最终图片保存在 图片服务器 的 target 文件夹下的 uploads 中

![img](https://img-blog.csdnimg.cn/20200325121428874.png)

<br>



# 📚 References

---



- 🐟 [视频 - SpringMVC教程IDEA版-3天-2018黑马SSM-03](https://www.bilibili.com/video/av47953244/)

  **课程配套百度网盘资源：**

  链接：https://pan.baidu.com/s/1uXeLJz3xkwgj2UbqwPVKiw

  提取码：j7hm

- 🥦 [Model、ModelMap和ModelAndView的使用详解](https://blog.csdn.net/ITBigGod/article/details/79685610?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase)

- 🥝 公众号 江南一点雨 相关教程