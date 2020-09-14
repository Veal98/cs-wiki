# 🚪 Spring Boot 入门

---

## 1. Spring Boot 简介

开发一个web应用，从最初开始接触Servlet结合Tomcat, 跑出一个Hello Wolrld程序，是要经历特别多的步骤；后来就用了框架Struts，再后来是SpringMVC，到了现在的SpringBoot，过一两年又会有其他web框架出现；

言归正传，什么是SpringBoot呢，就是一个javaweb的开发框架，和SpringMVC类似，对比其他javaweb框架的好处，官方说是简化开发，**约定大于配置，  you can "just run"**，能迅速的开发web应用，几行代码开发一个http接口。

所有的技术框架的发展似乎都遵循了一条主线规律：从一个复杂应用场景 衍生 一种规范框架，人们只需要进行各种配置而不需要自己去实现它，这时候强大的配置功能成了优点；发展到一定程度之后，人们根据实际生产应用情况，选取其中实用功能和设计精华，重构出一些轻量级的框架；之后为了提高开发效率，嫌弃原先的各类配置过于麻烦，于是开始提倡“约定大于配置”，进而衍生出一些一站式的解决方案。

这就是Java企业级应用->J2EE->spring->springboot的过程。

随着 Spring 不断的发展，涉及的领域越来越多，项目整合开发需要配合各种各样的文件，慢慢变得不那么易用简单，违背了最初的理念，甚至人称配置地狱。Spring Boot 正是在这样的一个背景下被抽象出来的开发框架，目的为了让大家更容易的使用 Spring 、更容易的集成各种常用的中间件、开源软件；

Spring Boot 基于 Spring 开发，Spirng Boot 本身并不提供 Spring 框架的核心特性以及扩展功能，只是用于快速、敏捷地开发新一代基于 Spring 框架的应用程序。也就是说，它并不是用来替代 Spring 的解决方案，而是和 Spring 框架紧密结合用于提升 Spring 开发者体验的工具。Spring Boot 以**约定大于配置的核心思想**，默认帮我们进行了很多设置，多数 Spring Boot 应用只需要很少的 Spring 配置。同时它集成了大量常用的第三方库配置（例如 Redis、MongoDB、Jpa、RabbitMQ、Quartz 等等），Spring Boot 应用中这些第三方库几乎可以零配置的开箱即用。

简单来说就是SpringBoot其实不是什么新的框架，它默认配置了很多框架的使用方式，就像maven整合了所有的jar包，spring boot整合了所有的框架 。

Spring Boot 出生名门，从一开始就站在一个比较高的起点，又经过这几年的发展，生态足够完善，Spring Boot 已经当之无愧成为 Java 领域最热门的技术。

**Spring Boot的主要优点：**

- 为所有Spring开发者更快的入门
- **开箱即用**，提供各种默认配置来简化项目配置
- 内嵌式容器简化Web项目
- 没有冗余代码生成和XML配置的要求

![](https://gitee.com/veal98/images/raw/master/img/20200528210455.png)



## 2. 微服务介绍

**微服务**：是一种架构风格（服务微化）

一个应用应该是一组小型服务；可以通过 HTTP 的方式进行互通；

> **单体应用**：ALL IN ONE
>
> ![](https://gitee.com/veal98/images/raw/master/img/20200528211512.png)



**微服务：每一个功能元素最终都是一个可独立替换和独立升级的软件单元：**

<img src="https://gitee.com/veal98/images/raw/master/img/20200528211629.png"  />



## 3. 环境准备

本博客所用环境：

- **jdk 1.8**：Spring Boot 推荐 jdk1.7 及以上；java version "1.8.0_112"

- **maven 3.x**：maven 3.3 以上版本；Apache Maven 3.3.9

- **SpringBoot 2.3.1**

开发工具 ：

- **IDEA 2017**

## 4. HelloWorld

我们将学习如何快速的创建一个Spring Boot应用，并且实现一个简单的Http请求处理。通过这个例子对Spring Boot有一个初步的了解，并体验其结构简单、开发快速的特性。

💬 需求：浏览器发送 hello 请求，服务器接受请求并处理，响应Hello World 字符串。

### ① Spring Initializer 快速创建 Spring Boot 项目

IDE 都支持使用 Spring 的<u>项目创建向导</u>快速创建一个 Spring Boot 项目；

<img src="https://gitee.com/veal98/images/raw/master/img/20200529093821.png" style="zoom:80%;" />

<img src="https://gitee.com/veal98/images/raw/master/img/20200630222558.png" style="zoom: 67%;" />

OK，然后选择我们需要的模块，向导会联网自动创建 Spring Boot 项目；

<img src="https://gitee.com/veal98/images/raw/master/img/20200529093907.png" style="zoom:67%;" />

🎉 默认生成的 Spring Boot 项目目录结构如下：

![](https://gitee.com/veal98/images/raw/master/img/20200529094814.png)

- 程序的**主启动类**

  ```java
  /**
   *  @SpringBootApplication 来标注一个主程序类，说明这是一个Spring Boot应用
   */
  @SpringBootApplication
  public class HelloWorldMainApplication {
  
      public static void main(String[] args) {
  
          // 启动 Spring 应用
          SpringApplication.run(HelloWorldMainApplication.class,args);
      }
  }
  ```

- 一个 测试类

- 一个` pom.xml`

- `resources` 文件夹：

  - `static`：保存所有的静态资源； js / css  / images；
  - `templates`：保存所有的模板页面。（Spring Boot 默认 jar 包使用嵌入式的 Tomcat，<u>默认不支持JSP页面</u>），可以使用模板引擎（freemarker、thymeleaf）；
  - `application.properties`：Spring Boot 应用的配置文件，可以修改一些默认设置；

### ② pom.xml

打开 `pom.xml`，看看 Spring Boot 项目的依赖：

```xml
	<!-- 父依赖 -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.1.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.smallbeef</groupId>
    <artifactId>springboot_helloworld</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>springboot_helloworld</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <!-- web场景启动器 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
		<!-- springboot单元测试 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <!-- 剔除依赖 -->
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- 打包插件 -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
```

### ③ 编写 Controller

在主程序的同级目录下，新建一个 `controller `包，在包中新建一个 `HelloController` 类

```java
@Controller
public class HelloController {

    @ResponseBody
    @RequestMapping("/hello")
    public String hello(){
        return "Hello World!";
    }
}

```

> @ ResponseBody 直接将返回值作为字符串返回给浏览器，而不是作为一个 jsp 界面
>
> ⭐ <u>@Controller + @ResponseBody = @**RestController**</u>。所以也可这样写：
>
> ```java
> @RestController
> public class HelloController {
> 
>     @RequestMapping("/hello")
>     public String hello(){
>         return "Hello World!";
>     }
> }
> ```
>
> 

### ④ 运行 main 函数测试

直接运行 Main 函数即可，[http://localhost:8080/hello](http://localhost:8080/hello)

> 😊 简单几步，就完成了一个 web 接口的开发，SpringBoot 就是这么简单。所以我们常用它来建立我们的微服务项目！

### ⑥ 将项目打成 jar 包

无须在目标服务器安装 Tomcat 环境等等，该 jar 包可直接运行。

```xml
 <!-- 这个插件，可以将应用打包成一个可执行的jar包；-->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
```

打包：

![](https://gitee.com/veal98/images/raw/master/img/20200528220845.png)

成功打包后该 `jar` 包会放在 `target `文件夹下：

![](https://gitee.com/veal98/images/raw/master/img/20200528220933.png)

直接使用 `java -jar 包名` 的命令即可执行该 jar 包。

首先，打开命令行 cd 到该 `jar `包所在文件夹，然后运行以下命令：

```powershell
java -jar spring_boot-01-helloworld-1.0-SNAPSHOT.jar
```

## 5. Hello World探究

### ① POM 文件

#### Ⅰ 父项目 / 父依赖

`pom.xml` 主要是依赖一个父项目，主要管理项目的资源过滤及插件：

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.3.1.RELEASE</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
```

`Ctrl  + 右键`点进 `spring-boot-starter-parent`，发现还有一个父依赖： 👇

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-dependencies</artifactId>
    <version>2.3.1.RELEASE</version>
</parent>
```

这里才是真正管理 SpringBoot 应用里面所有依赖版本的地方，SpringBoot 的版本控制中心。

以后我们导入依赖默认是不需要写版本的。（但是没有在 dependencies 里面管理的依赖需要声明版本号）

#### Ⅱ 启动器 spring-boot-starter

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

- `spring-boot-starter-xxx`：**spring-boot 场景启动器**；

- `spring-boot-starter-web`：帮我们导入了 web 模块正常运行所依赖的组件：

  ![](https://gitee.com/veal98/images/raw/master/img/20200528221854.png)



⭐ Spring Boot将所有的功能场景都抽取出来，做成一个个的 starter（启动器），只需要在项目里面引入这些 starter ，相关场景的所有依赖都会导入进来。要用什么功能就导入什么场景的启动器

![](https://gitee.com/veal98/images/raw/master/img/20200528222416.png)



### ② 主启动类/主程序类

```java
/**
 *  @SpringBootApplication 来标注一个主程序类，说明这是一个Spring Boot应用
 */
@SpringBootApplication
public class HelloWorldMainApplication {

    public static void main(String[] args){
        SpringApplication.run(HelloWorldMainApplication.class,args);
    }
}
```

#### Ⅰ @SpringBootApplication

⭐ `@SpringBootApplication`（Spring Boot应用）：**标注在某个类上说明这个类是 SpringBoot 的主程序类**，SpringBoot 就应该运行这个类的 `main `方法来启动 SpringBoot 应用；

📑 该注解源码如下：

```java
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication {
```

底层由三个注解实现：

- `@SpringBootConfiguration`
- `@EnableAutoConfiguration`
- `@ComponentScan`

接下来进行详细的解析：👇

#### Ⅱ @ComponentScan

Spring 中的注解 ,它对应 XML 配置中的元素。

作用：**自动扫描并加载符合条件的组件或者 bean ， 将这个 bean 定义加载到 IoC 容器中**

#### Ⅲ @SpringBootConfiguration

`@SpringBootConfiguration`: Spring Boot 的配置类。**标注在某个类上，表示这是一个 Spring Boot 的配置类**。

📑 该注解源码如下：

```java
@Configuration
public @interface SpringBootConfiguration {
```

底层是 `@Configuration`: 说明这是一个配置类（配置类就是对应 Spring 的 xml  配置文件）

📑 `@Configuration` 源码如下：

```java
@Component
public @interface Configuration {
```

里面的 `@Component` 这就说明，**启动类本身也是 Spring 中的一个组件而已**，负责启动应用。

#### Ⅳ @EnableAutoConfiguration

`@EnableAutoConfiguration`：**开启自动配置功能**。

以前我们需要配置的东西，Spring Boot 帮我们自动配置；

`@EnableAutoConfiguration`告诉 SpringBoot 开启自动配置功能，这样自动配置才能生效；

📑 该注解的源码如下：

```java
@AutoConfigurationPackage
@Import({AutoConfigurationImportSelector.class})
public @interface EnableAutoConfiguration {
```

- ⭐ `@AutoConfigurationPackage`**：自动配置包，**<u>将主配置类（`@SpringBootApplication`标注的类）的所在包及下面所有子包里面的所有组件扫描到 Spring 容器中</u>

  📑 该注解的源码如下：

  ```java
  @Import({Registrar.class})
  public @interface AutoConfigurationPackage {
  }
  ```

  - `@Import({Registrar.class})`：`@import`是 Spring 中的底层注解，给容器中导入一个组件

  - `Registrar.class` 作用：将主启动类的所在包及包下面所有子包里面的所有组件扫描到 Spring 容器 ；

- `@Import({AutoConfigurationImportSelector.class})`：给容器中导入组件。

  `AutoConfigurationImportSelector`：**自动配置导入选择器**。将所有需要导入的组件以全类名的方式返回；这些组件就会被添加到容器中。

  那么它会导入哪些组件的选择器呢？📑 我们点击去这个类看源码：

  这个类中有一个这样的方法：

  ```java
  // 获得候选的配置
  protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
      // 这里的 getSpringFactoriesLoaderFactoryClass() 方法
      // 返回的就是启动自动导入配置文件的注解类；EnableAutoConfiguration
      List<String> configurations = SpringFactoriesLoader.loadFactoryNames(this.getSpringFactoriesLoaderFactoryClass(), this.getBeanClassLoader());
      Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories. If you are using a custom packaging, make sure that file is correct.");
      return configurations;
  }
  ```

  这个方法又调用了  `SpringFactoriesLoader ` 类的静态方法，我们进入`SpringFactoriesLoader` 类 `loadFactoryNames()` 方法：

  ```java
  public static List<String> loadFactoryNames(Class<?> factoryClass, @Nullable ClassLoader classLoader) {
      String factoryClassName = factoryClass.getName();
      // 这里它又调用了 loadSpringFactories 方法
      return (List)loadSpringFactories(classLoader).getOrDefault(factoryClassName, Collections.emptyList());
  }
  ```

  我们继续点击查看 `loadSpringFactories `方法：

  ```java
  private static Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader) {
      // 获得classLoader ， 我们返回可以看到这里得到的就是EnableAutoConfiguration标注的类本身
      MultiValueMap<String, String> result = (MultiValueMap)cache.get(classLoader);
      if (result != null) {
          return result;
      } else {
          try {
              //去获取一个资源 "META-INF/spring.factories"
              Enumeration<URL> urls = classLoader != null ? classLoader.getResources("META-INF/spring.factories") : ClassLoader.getSystemResources("META-INF/spring.factories");
              LinkedMultiValueMap result = new LinkedMultiValueMap();
  
              //将读取到的资源遍历，封装成为一个Properties
              while(urls.hasMoreElements()) {
                  URL url = (URL)urls.nextElement();
                  UrlResource resource = new UrlResource(url);
                  Properties properties = PropertiesLoaderUtils.loadProperties(resource);
                  Iterator var6 = properties.entrySet().iterator();
  
                  while(var6.hasNext()) {
                      Entry<?, ?> entry = (Entry)var6.next();
                      String factoryClassName = ((String)entry.getKey()).trim();
                      String[] var9 = StringUtils.commaDelimitedListToStringArray((String)entry.getValue());
                      int var10 = var9.length;
  
                      for(int var11 = 0; var11 < var10; ++var11) {
                          String factoryName = var9[var11];
                          result.add(factoryClassName, factoryName.trim());
                      }
                  }
              }
  
              cache.put(classLoader, result);
              return result;
          } catch (IOException var13) {
              throw new IllegalArgumentException("Unable to load factories from location [META-INF/spring.factories]", var13);
          }
      }
  }
  ```

#### Ⅴ spring.factories

⭐ 在上面这段源码中，我们发现了一个多次出现的文件 `spring.factories`，在 <u>External Libraries</u> 中找到它：

<img src="https://gitee.com/veal98/images/raw/master/img/20200701105523.png" style="zoom:80%;" /> 

其中包含了很多自动配置的文件（自动配置类 `xxxAutoConfiguration`），这就是**自动配置的根源所在**！

![](https://gitee.com/veal98/images/raw/master/img/20200701105548.png)

我们在上面的自动配置类随便找一个打开看看，比如 ：`WebMvcAutoConfiguration`

![](https://gitee.com/veal98/images/raw/master/img/20200701105838.png)

可以看到这些一个个的都是JavaConfig 配置类，而且都注入了一些 Bean。

⭐ 所以，自动配置真正实现是从 classpath 中搜寻所有的 `META-INF/spring.factories` 配置文件 ，并将其中对应的  `org.springframework.boot.autoconfigure.` 包下的配置项，通过**反射**实例化为对应标注了 `@Configuration` 的 JavaConfig 形式的 IoC 容器配置类 ， 然后将这些都汇总成为一个实例并加载到 IoC 容器中。

<br>

🚩 小结：

- <u>Spring Boot 在启动的时候从类路径下的 `META-INF/spring.factories` 中获取 `EnableAutoConfiguration `指定的值，将这些值作为自动配置类导入到容器中，自动配置类就生效，帮我们进行自动配置工作</u>。以前我们需要自己配置的东西，自动配置类都帮我们配置好了；
- J2EE 的整体整合解决方案和自动配置都在 `spring-boot-autoconfigure-2.3.1.RELEASE.jar`，它会给容器中导入非常多的自动配置类 （`xxxAutoConfiguration`）, 就是给容器中导入这个场景需要的所有组件 ， 并配置好这些组件 ；
- 有了自动配置类，免去了我们手动编写配置注入功能组件等的工作。

> 😊 现在大概的对 SpringBoot 的自动配置原理有所了解了，后面我们还会深化一次。

### ③ SpringApplication

显然，`main` 不仅仅是运行了一个方法，而是开启了一个服务

```java
@SpringBootApplication
public class SpringbootHelloworldApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootHelloworldApplication.class, args);
    }

}
```

**SpringApplication.run 分析**：该方法主要分两部分，一部分是 `SpringApplication` 的实例化，二是 `run` 方法的执行；

#### Ⅰ SpringApplication

📑 该类源码如下：

```java
public class SpringApplication {
    ......
    private List<ApplicationContextInitializer<?>> initializers;
    private List<ApplicationListener<?>> listeners;
    ......
    public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
        ......
        this.webApplicationType = WebApplicationType.deduceFromClasspath();
   		this.setInitializers(this.getSpringFactoriesInstances(
            						ApplicationContextInitializer.class));
        this.setListeners(this.getSpringFactoriesInstances(ApplicationListener.class));
        this.mainApplicationClass = this.deduceMainApplicationClass();
    }  
  	......
}
```

这个类主要做了以下四件事情：

- 推断应用的类型是普通的项目还是 Web 项目

- 查找并加载所有可用初始化器 ， 设置到 `initializers `属性中

- 找出所有的应用程序监听器，设置到 `listeners` 属性中

- 推断并设置 `main` 方法的定义类，找到运行的主类

#### Ⅱ  run 方法流程分析

> 🔗 图片来源狂神说公众号

![](https://gitee.com/veal98/images/raw/master/img/20200701111258.png)

## 📚 References

- [视频 - SpringBoot_权威教程_雷丰阳_尚硅谷](https://www.bilibili.com/video/BV1Et411Y7tQ)

- [狂神说 SpringBoot](https://mp.weixin.qq.com/mp/homepage?__biz=Mzg2NTAzMTExNg==&hid=1&sn=3247dca1433a891523d9e4176c90c499)

  