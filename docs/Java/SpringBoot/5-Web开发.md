# 📥 Spring Boot 与 Web 开发

---

## 1. 简介

Web 开发过程简介：

- 创建 SpringBoot 应用，选中我们需要的模块

- SpringBoot 已经默认将这些场景配置好了，只需要在配置文件中指定少量配置就可以运行起来

- 编写业务代码

## 2. SpringBoot 静态资源处理

### ① 静态资源处理

SpringBoot 对于静态资源放置的位置，是有规定的。

```java
@ConfigurationProperties(prefix = "spring.resources", ignoreUnknownFields = false)
public class ResourceProperties implements ResourceLoaderAware {
  //可以设置和静态资源有关的参数，缓存时间等
```

SpringBoot 中，SpringMVC 的 web 配置都在 `WebMvcAutoConfiguration `这个配置类里面，其中有很多配置类方法：

![](https://gitee.com/veal98/images/raw/master/img/20200703145014.png)

#### Ⅰ 静态资源映射规则

`WebMvcAutoConfiguration `类中有一个方法：`addResourceHandlers `添加资源处理

```java
// 添加资源处理
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    if (!this.resourceProperties.isAddMappings()) {
        logger.debug("Default resource handling disabled");
        return;
    }
    Integer cachePeriod = this.resourceProperties.getCachePeriod();
    if (!registry.hasMappingForPattern("/webjars/**")) {
        customizeResourceHandlerRegistration(
                registry.addResourceHandler("/webjars/**")
                        .addResourceLocations(
                                "classpath:/META-INF/resources/webjars/")
                .setCachePeriod(cachePeriod));
    }
    String staticPathPattern = this.mvcProperties.getStaticPathPattern();
    //静态资源文件夹映射
    if (!registry.hasMappingForPattern(staticPathPattern)) {
        customizeResourceHandlerRegistration(
                registry.addResourceHandler(staticPathPattern)
                        .addResourceLocations(
                                this.resourceProperties.getStaticLocations())
                .setCachePeriod(cachePeriod));
    }
}
```

读一下源代码：所有的 `/webjars/**` ， 都需要去 `classpath:/META-INF/resources/webjars/ `找对应的资源。

❓ **什么是 `webjars` 呢？**

`Webjars `本质就是以 `jar `包的方式引入我们的静态资源 ， 我们以前要导入一个静态资源文件，直接导入即可。使用 SpringBoot 需要使用 `Webjars`：

比如要使用 jQuery，我们只要引入 jQuery 对应版本的 pom 依赖即可：

```xml
<dependency>
    <groupId>org.webjars</groupId> 
    <!--在访问的时候只需要写webjars下面资源的名称即可-->
    <artifactId>jquery</artifactId> 
    <version>3.4.1</version>
</dependency>
```

导入完毕，查看 `webjars `目录结构，并访问 `Jquery.js`文件：

<img src="https://gitee.com/veal98/images/raw/master/img/20200703143112.png" style="zoom: 50%;" />

访问：只要是静态资源，SpringBoot 就会去对应的路径寻找资源，我们可以在这里访问：`http://localhost:8080/webjars/jquery/3.4.1/jquery.js`

#### Ⅱ 静态资源文件夹

❓ 那我们项目中要是使用自己的静态资源该怎么导入呢？我们看 `addResourceHandlers ` 中的这行代码：

```java
String staticPathPattern = this.mvcProperties.getStaticPathPattern();
if (!registry.hasMappingForPattern(staticPathPattern)) {
    this.customizeResourceHandlerRegistration(registry.addResourceHandler(new String[]{staticPathPattern}).addResourceLocations(WebMvcAutoConfiguration.getResourceLocations(this.resourceProperties.getStaticLocations())).setCachePeriod(this.getSeconds(cachePeriod)).setCacheControl(cacheControl));
}
```

我们去找 `staticPathPattern `发现第二种映射规则 ：<u>`/**` , 访问当前的项目任意资源</u>，它会去找 `ResourceProperties `这个类，📑 我们可以点进去看一下源码：

```java
// 进入方法
public String[] getStaticLocations() {
    return this.staticLocations;
}
// 找到对应的值
private String[] staticLocations = CLASSPATH_RESOURCE_LOCATIONS;

// 找到路径
private static final String[] CLASSPATH_RESOURCE_LOCATIONS = { 
    "classpath:/META-INF/resources/",
  "classpath:/resources/", 
    "classpath:/static/", 
    "classpath:/public/" 
};
```

可以看出，以下四个目录存放的静态资源可以被我们识别（静态资源文件夹）：

- "`classpath:/META-INF/resources/`", 

- "`classpath:/resources/`",
- "`classpath:/static/`", 
- "`classpath:/public/`" 

**我们可以在 `resources `根目录下新建对应的文件夹，存放我们的静态文件**。

比如我们访问 `http://localhost:8080/abc.js` , 他就会去这些静态资源文件夹中寻找对应的静态资源文件 `abc.js`

#### Ⅲ 自定义静态资源路径

我们也可以自己通过配置文件来指定一下，哪些文件夹是需要我们放静态资源文件的，在`application.properties` 中配置：

```properties
spring.resources.static-locations=classpath:/coding/,classpath:/kuang/
```

**一旦自己定义了静态文件夹的路径，原来的自动配置就都会失效了**。

### ② 首页处理

静态资源文件夹说完后，我们继续看 `WebMvcAutoConfiguration ` 的源码。可以看到一个欢迎页的映射，就是我们的首页：

```java
//配置欢迎页映射
 @Bean
public WelcomePageHandlerMapping welcomePageHandlerMapping(ApplicationContext applicationContext, FormattingConversionService mvcConversionService, ResourceUrlProvider mvcResourceUrlProvider) {
    WelcomePageHandlerMapping welcomePageHandlerMapping = new WelcomePageHandlerMapping(new TemplateAvailabilityProviders(applicationContext), applicationContext, this.getWelcomePage(), this.mvcProperties.getStaticPathPattern());
    welcomePageHandlerMapping.setInterceptors(this.getInterceptors(mvcConversionService, mvcResourceUrlProvider));
    welcomePageHandlerMapping.setCorsConfigurations(this.getCorsConfigurations());
    return welcomePageHandlerMapping;
}

private Optional<Resource> getWelcomePage() {
    String[] locations = WebMvcAutoConfiguration.getResourceLocations(this.resourceProperties.getStaticLocations());
    // ::是java8 中新引入的运算符
    // Class::function的时候function是属于Class的，应该是静态方法。
    // this::function的funtion是属于这个对象的。
    // 简而言之，就是一种语法糖而已，是一种简写
    return Arrays.stream(locations).map(this::getIndexHtml).filter(this::isReadable).findFirst();
}
```

欢迎页即静态资源文件夹下的所有 `index.html 页面`都被 `/**` 映射。

<u>比如我访问  `http://localhost:8080/` ，就会默认去找静态资源文件夹下的 `index.html`</u>

### ③ 网站图标

与其他静态资源一样，Spring Boot 在配置的静态内容位置中查找 `favicon.ico`。如果存在这样的文件，它将自动用作应用程序的 `favicon`。

- 关闭SpringBoot默认图标

  ```properties
  #关闭默认图标
  spring.mvc.favicon.enabled=false
  ```

- 放一个图标文件并命名为 `favicon.ico` 在静态资源文件夹下（比如放在 public 目录下）

- 清除浏览器缓存，刷新网页，发现图标已经变成自己的了

## 3. Thymeleaf 模板引擎

前端交给我们的页面，是html页面。如果是我们以前开发，我们需要把他们转成jsp页面，jsp好处就是当我们查出一些数据转发到JSP页面以后，我们可以用 jsp 轻松实现数据的显示，及交互等。

但是 **SpringBoot 默认是不支持jsp的**

那不支持jsp，如果我们直接用纯静态页面的方式，那给我们开发会带来非常大的麻烦，怎么办呢？

**SpringBoot 推荐使用模板引擎：**

其实jsp就是一个模板引擎，还有用的比较多的 freemarker，包括 SpringBoot 给我们推荐的 Thymeleaf，模板引擎有非常多，但再多的模板引擎，他们的思想都是一样的：

![](https://gitee.com/veal98/images/raw/master/img/20200703150258.png)

模板引擎的作用就是我们来写一个页面模板，比如我们写一些表达式获取动态的值。而这些值，从哪来呢？就是我们在后台封装的一些数据。然后把这个模板和这个数据交给我们模板引擎，模板引擎按照我们的数据解析表达式、填充到我们指定的位置，然后把这个数据最终生成一个我们想要的内容写出去，这就是模板引擎，不管是jsp还是其他模板引擎，都是这个思想。

只不过不同模板引擎之间，他们语法有点不一样。以下主要来介绍一下 SpringBoot 给我们推荐的 Thymeleaf模板引擎，它是一个高级语言的模板引擎，语法更简单，功能更强大。

### ① 引入 Thymeleaf

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

### ② Thymeleaf 分析

我们首先得按照 SpringBoot 的自动配置原理看一下我们这个Thymeleaf 的自动配置规则，在按照那个规则，我们进行使用。

我们去找一下Thymeleaf的自动配置类：`ThymeleafProperties`

```java
@ConfigurationProperties(
    prefix = "spring.thymeleaf"
)
public class ThymeleafProperties {
    private static final Charset DEFAULT_ENCODING;
    public static final String DEFAULT_PREFIX = "classpath:/templates/";
    public static final String DEFAULT_SUFFIX = ".html";
    private boolean checkTemplate = true;
    private boolean checkTemplateLocation = true;
    private String prefix = "classpath:/templates/";
    private String suffix = ".html";
    private String mode = "HTML";
    private Charset encoding;
```

只要我们把 HTML 页面放在 `classpath:/templates/` 下，thymeleaf 就能自动渲染。

### ③ Hello World

导入 thymeleaf 的命名空间的约束，方便提示

```xml
<xmlns:th="http://www.thymeleaf.org">
```

`test.html`

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h1>成功！</h1>
    <!--th:text 将div里面的文本内容设置为 -->
    <div th:text="${msg}">这里显示欢迎信息</div>
</body>
</html>
```

`controller`

```java
@Controller
public class TestController {

    @RequestMapping("/t1")
    public String test1(Model model){
        model.addAttribute("msg","Hello,Thymeleaf");
        //classpath:/templates/test.html
        return "test";
    }
}
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200703153356.png" style="zoom:80%;" />

目录结构：

![](https://gitee.com/veal98/images/raw/master/img/20200703153229.png)

### ④ 语法规则

#### Ⅰ th:attr 标签

**我们可以使用任意的 th:attr 来替换Html中原生属性的值**

比如 `th:text`：改变当前元素里面的文本内容

![](https://gitee.com/veal98/images/raw/master/img/20200703153740.png)

#### Ⅱ 表达式

```properties

Simple expressions:（表达式语法）
Variable Expressions: ${...}：获取变量值；OGNL；
    1）、获取对象的属性、调用方法
    2）、使用内置的基本对象：#18
         #ctx : the context object.
         #vars: the context variables.
         #locale : the context locale.
         #request : (only in Web Contexts) the HttpServletRequest object.
         #response : (only in Web Contexts) the HttpServletResponse object.
         #session : (only in Web Contexts) the HttpSession object.
         #servletContext : (only in Web Contexts) the ServletContext object.

    3）、内置的一些工具对象：
　　　　　　#execInfo : information about the template being processed.
　　　　　　#uris : methods for escaping parts of URLs/URIs
　　　　　　#conversions : methods for executing the configured conversion service (if any).
　　　　　　#dates : methods for java.util.Date objects: formatting, component extraction, etc.
　　　　　　#calendars : analogous to #dates , but for java.util.Calendar objects.
　　　　　　#numbers : methods for formatting numeric objects.
　　　　　　#strings : methods for String objects: contains, startsWith, prepending/appending, etc.
　　　　　　#objects : methods for objects in general.
　　　　　　#bools : methods for boolean evaluation.
　　　　　　#arrays : methods for arrays.
　　　　　　#lists : methods for lists.
　　　　　　#sets : methods for sets.
　　　　　　#maps : methods for maps.
　　　　　　#aggregates : methods for creating aggregates on arrays or collections.
　　　　　　
==================================================================================

  Selection Variable Expressions: *{...}：选择表达式：和${}在功能上是一样；
  Message Expressions: #{...}：获取国际化内容
  Link URL Expressions: @{...}：定义URL；
  Fragment Expressions: ~{...}：片段引用表达式

Literals（字面量）
      Text literals: 'one text' , 'Another one!' ,…
      Number literals: 0 , 34 , 3.0 , 12.3 ,…
      Boolean literals: true , false
      Null literal: null
      Literal tokens: one , sometext , main ,…
      
Text operations:（文本操作）
    String concatenation: +
    Literal substitutions: |The name is ${name}|
    
Arithmetic operations:（数学运算）
    Binary operators: + , - , * , / , %
    Minus sign (unary operator): -
    
Boolean operations:（布尔运算）
    Binary operators: and , or
    Boolean negation (unary operator): ! , not
    
Comparisons and equality:（比较运算）
    Comparators: > , < , >= , <= ( gt , lt , ge , le )
    Equality operators: == , != ( eq , ne )
    
Conditional operators:条件运算（三元运算符）
    If-then: (if) ? (then)
    If-then-else: (if) ? (then) : (else)
    Default: (value) ?: (defaultvalue)
    
Special tokens:
    No-Operation: _
```

💬 举个例子：

```java
@RequestMapping("/t2")
public String test2(Map<String,Object> map){
    //存入数据
    map.put("msg","<h1>Hello</h1>");
    map.put("users", Arrays.asList("qinjiang","kuangshen"));
    //classpath:/templates/test.html
    return "test";
}
```

```html

<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>狂神说</title>
</head>
<body>
<h1>测试页面</h1>

<div th:text="${msg}"></div>
<!--不转义-->
<div th:utext="${msg}"></div>

<!--遍历数据-->
<!--th:each每次遍历都会生成当前这个标签-->
<h4 th:each="user :${users}" th:text="${user}"></h4>

<h4>
    <!--行内写法：官网-->
    <span th:each="user:${users}">[[${user}]]</span>
</h4>

</body>
</html>
```

## 4. SpringMVC 自动配置

在进行 Web 项目编写前，我们还需要知道一个东西，就是 SpringBoot对我们的 SpringMVC 还做了哪些配置，包括如何扩展，如何定制。只有把这些都搞清楚了，我们在之后使用才会更加得心应手。

[官方文档](https://docs.spring.io/spring-boot/docs/1.5.10.RELEASE/reference/htmlsingle/#boot-features-developing-web-applications) 👇 

```java
Spring MVC Auto-configuration
// Spring Boot为Spring MVC提供了自动配置，它可以很好地与大多数应用程序一起工作。
Spring Boot provides auto-configuration for Spring MVC that works well with most applications.
// 自动配置在Spring默认设置的基础上添加了以下功能：
The auto-configuration adds the following features on top of Spring’s defaults:
// 包含视图解析器
Inclusion of ContentNegotiatingViewResolver and BeanNameViewResolver beans.
// 支持静态资源文件夹的路径，以及webjars
Support for serving static resources, including support for WebJars 
// 自动注册了Converter：
// 转换器，这就是我们网页提交数据到后台自动封装成为对象的东西，比如把"1"字符串自动转换为int类型
// Formatter：【格式化器，比如页面给我们了一个2019-8-10，它会给我们自动格式化为Date对象】
Automatic registration of Converter, GenericConverter, and Formatter beans.
// HttpMessageConverters
// SpringMVC用来转换Http请求和响应的的，比如我们要把一个User对象转换为JSON字符串，可以去看官网文档解释；
Support for HttpMessageConverters (covered later in this document).
// 定义错误代码生成规则的
Automatic registration of MessageCodesResolver (covered later in this document).
// 首页定制
Static index.html support.
// 图标定制
Custom Favicon support (covered later in this document).
// 初始化数据绑定器：帮我们把请求数据绑定到JavaBean中！
Automatic use of a ConfigurableWebBindingInitializer bean (covered later in this document).

/*
如果您希望保留Spring Boot MVC功能，并且希望添加其他MVC配置（拦截器、格式化程序、视图控制器和其他功能），则可以添加自己
的@configuration类，类型为webmvcconfiguer，但不添加@EnableWebMvc。如果希望提供
RequestMappingHandlerMapping、RequestMappingHandlerAdapter或ExceptionHandlerExceptionResolver的自定义
实例，则可以声明WebMVCregistrationAdapter实例来提供此类组件。
*/
If you want to keep Spring Boot MVC features and you want to add additional MVC configuration 
(interceptors, formatters, view controllers, and other features), you can add your own 
@Configuration class of type WebMvcConfigurer but without @EnableWebMvc. If you wish to provide 
custom instances of RequestMappingHandlerMapping, RequestMappingHandlerAdapter, or 
ExceptionHandlerExceptionResolver, you can declare a WebMvcRegistrationsAdapter instance to provide such components.

// 如果您想完全控制Spring MVC，可以添加自己的@Configuration，并用@EnableWebMvc进行注释。
If you want to take complete control of Spring MVC, you can add your own @Configuration annotated with @EnableWebMvc.
```

我们来仔细对照，看一下它怎么实现的，它告诉我们 SpringBoot 已经帮我们自动配置好了 SpringMVC，然后自动配置了哪些东西呢？

### ① ContentNegotiatingViewResolver 内容协商视图解析器

自动配置了 `ViewResolver`，就是我们之前学习的 SpringMVC 的视图解析器；

即根据方法的返回值取得视图对象（View），然后由视图对象决定如何渲染（转发，重定向）。

我们去看看这里的源码：我们找到 `WebMvcAutoConfiguration `， 然后搜索 `ContentNegotiatingViewResolver`。找到如下方法：

```java
@Bean
@ConditionalOnBean(ViewResolver.class)
@ConditionalOnMissingBean(name = "viewResolver", value = ContentNegotiatingViewResolver.class)
public ContentNegotiatingViewResolver viewResolver(BeanFactory beanFactory) {
    ContentNegotiatingViewResolver resolver = new ContentNegotiatingViewResolver();
    resolver.setContentNegotiationManager(beanFactory.getBean(ContentNegotiationManager.class));
    // ContentNegotiatingViewResolver使用所有其他视图解析器来定位视图，因此它应该具有较高的优先级
    resolver.setOrder(Ordered.HIGHEST_PRECEDENCE);
    return resolver;
}
```

我们可以点进 `ContentNegotiatingViewResolver` 类看看！找到对应的解析视图 `resolveViewName` 的代码: 

```java
@Nullable // 注解说明：@Nullable 即参数可为null
public View resolveViewName(String viewName, Locale locale) throws Exception {
    RequestAttributes attrs = RequestContextHolder.getRequestAttributes();
    Assert.state(attrs instanceof ServletRequestAttributes, "No current ServletRequestAttributes");
    List<MediaType> requestedMediaTypes = this.getMediaTypes(((ServletRequestAttributes)attrs).getRequest());
    if (requestedMediaTypes != null) {
        // 获取候选的视图对象
        List<View> candidateViews = this.getCandidateViews(viewName, locale, requestedMediaTypes);
        // 选择一个最适合的视图对象，然后把这个对象返回
        View bestView = this.getBestView(candidateViews, requestedMediaTypes, attrs);
        if (bestView != null) {
            return bestView;
        }
    }
    // .....
}
```

我们继续点进去 `getCandidateViews`，他是怎么获得候选的视图的呢？

可以看到他是把所有的视图解析器拿来，进行 `while` 循环，挨个解析

![](https://gitee.com/veal98/images/raw/master/img/20200703155430.png)

所以得出结论：**`ContentNegotiatingViewResolver` 这个视图解析器就是用来组合所有的视图解析器的** 

我们再去研究下`ContentNegotiatingViewResolver` 的组合逻辑，看到有个属性`viewResolvers`，看看它是在哪里进行赋值的：

![](https://gitee.com/veal98/images/raw/master/img/20200703155736.png)

```java
protected void initServletContext(ServletContext servletContext) {
    // 这里它是从beanFactory工具中获取容器中的所有视图解析器
    // ViewRescolver.class 把所有的视图解析器来组合的
    Collection<ViewResolver> matchingBeans = BeanFactoryUtils.beansOfTypeIncludingAncestors(this.obtainApplicationContext(), ViewResolver.class).values();
    ViewResolver viewResolver;
    if (this.viewResolvers == null) {
        this.viewResolvers = new ArrayList(matchingBeans.size());
    }
    // ...............
}
```

### ② 扩展SpringMVC

⭐⭐⭐ **SpringBoot 在自动配置很多组件的时候，先看容器中有没有用户自己配置的（如果用户自己配置 `@bean`），如果有就用用户配置的，如果没有就用默认的自动配置的；如果有些组件可以存在多个，比如我们的视图解析器，就将用户配置的和自己默认的组合起来.**

📑 **扩展使用 SpringMVC**  官方文档如下：

If you want to keep Spring Boot MVC features and you want to add additional MVC configuration (interceptors, formatters, view controllers, and other features), you can add your own @Configuration class of type WebMvcConfigurer but without @EnableWebMvc. If you wish to provide custom instances of RequestMappingHandlerMapping, RequestMappingHandlerAdapter, or ExceptionHandlerExceptionResolver, you can declare a WebMvcRegistrationsAdapter instance to provide such components.

**我们要做的就是编写一个`@Configuration`注解类，并且类型要为`WebMvcConfigurer`，还不能标注`@EnableWebMvc`注解。**

我们去自己写一个，新建一个包 `config`，写一个类 `MyMvcConfig`：

```java
// 应为类型要求为 WebMvcConfigurer，所以我们实现其接口
// 可以使用自定义类扩展MVC的功能
@Configuration
public class MyMvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 浏览器发送/test ， 就会跳转到test页面；
        registry.addViewController("/test").setViewName("test");
    }
}
```

这样我们就可以通过 `localhost:8080/test` 访问 `test.html` 界面

🚩 **原理**：

- `WebMvcAutoConfiguration `是 SpringMVC 的自动配置类，里面有一个类`WebMvcAutoConfigurationAdapter`

- 这个类上有一个注解，在做其他自动配置时会导入：`@Import(EnableWebMvcConfiguration.class)`

  ```java
  @Configuration
  public static class EnableWebMvcConfiguration extends DelegatingWebMvcConfiguration {
  }
  ```

- `EnableWebMvcConfiguration `继承了一个父类：`DelegatingWebMvcConfiguration`

  这个父类中有这样一段代码：

  ```java
  public class DelegatingWebMvcConfiguration extends WebMvcConfigurationSupport {
      private final WebMvcConfigurerComposite configurers = new WebMvcConfigurerComposite();
      
    // 从容器中获取所有的webmvcConfigurer
      @Autowired(required = false)
      public void setConfigurers(List<WebMvcConfigurer> configurers) {
          if (!CollectionUtils.isEmpty(configurers)) {
              this.configurers.addWebMvcConfigurers(configurers);
          }
      }
  }
  ```

- 我们可以在这个类中去寻找一个我们刚才设置的 `viewController `当做参考，发现它调用了一个

  ```java
  protected void addViewControllers(ViewControllerRegistry registry) {
      this.configurers.addViewControllers(registry);
  }
  ```

  点进去看一下：

  ```java
  
  public void addViewControllers(ViewControllerRegistry registry) {
      Iterator var2 = this.delegates.iterator();
  
      while(var2.hasNext()) {
          // 将所有的WebMvcConfigurer相关配置来一起调用！包括我们自己配置的和Spring给我们配置的
          WebMvcConfigurer delegate = (WebMvcConfigurer)var2.next();
          delegate.addViewControllers(registry);
      }
  
  }
  ```

  ⭐ 所以得出结论：**所有的 `WebMvcConfiguration `都会被作用，不止Spring自己的配置类，我们自己的配置类当然也会被调用**

### ③ 全面接管 SpringMVC

官方文档：

> If you want to take complete control of Spring MVC
>
> you can add your own @Configuration annotated with @EnableWebMvc.

**全面接管即：SpringBoot 对 SpringMVC 的自动配置不需要了，所有都是我们自己去配置**

只需在我们的配置类中要加一个`@EnableWebMvc`即可：

```java
// 使用WebMvcConfigurerAdapter可以来扩展SpringMVC的功能
@EnableWebMvc
@Configuration
public class MyMvcConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
       // super.addViewControllers(registry);
        //浏览器发送 /test 请求来到 test 界面
        registry.addViewController("/test").setViewName("test");
    }
}
```

> ![](https://gitee.com/veal98/images/raw/master/img/20200703162107.png)

🚩 **原理**：为什么 `@EnableWebMvc` 自动配置就失效了；

- @EnableWebMvc的核心

  ```java
  @Import(DelegatingWebMvcConfiguration.class)
  public @interface EnableWebMvc {
  ```

- 它继承了一个父类 `WebMvcConfigurationSupport`

  ```java
  @Configuration
  public class DelegatingWebMvcConfiguration extends WebMvcConfigurationSupport {
  ```

- 我们来回顾一下 Webmvc 自动配置类

  ```java
  @Configuration
  @ConditionalOnWebApplication
  @ConditionalOnClass({ Servlet.class, DispatcherServlet.class,
  		WebMvcConfigurerAdapter.class })
  // 容器中没有这个组件的时候，这个自动配置类才生效
  @ConditionalOnMissingBean(WebMvcConfigurationSupport.class)
  @AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE + 10)
  @AutoConfigureAfter({ DispatcherServletAutoConfiguration.class,
  		ValidationAutoConfiguration.class })
  public class WebMvcAutoConfiguration {
  ```

  ⭐ `@EnableWebMvc` 将 `WebMvcConfigurationSupport` 组件导入进来了，而导入的 `WebMvcConfigurationSupport `只是 SpringMVC 最基本的功能。



## 📚 References

- [视频 - SpringBoot_权威教程_雷丰阳_尚硅谷](https://www.bilibili.com/video/BV1Et411Y7tQ)

- [狂神说 SpringBoot](https://mp.weixin.qq.com/mp/homepage?__biz=Mzg2NTAzMTExNg==&hid=1&sn=3247dca1433a891523d9e4176c90c499)