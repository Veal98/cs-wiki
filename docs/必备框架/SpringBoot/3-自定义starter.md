# 🎨 自定义 starter

---

> 💡 分析完了源码以及自动装配的过程，我们可以尝试自定义一个启动器

## 1. 说明

启动器模块是一个 空 jar 文件，只用来做依赖导入，我们需要专门来写一个自动配置模块，启动器依赖自动配置。使用时只需要引入启动器 starter 即可。

**命名归约：**

官方命名：

- 前缀：`spring-boot-starter-xxx`
- 比如：`spring-boot-starter-web....`

自定义命名：

- `xxx-spring-boot-starter`
- 比如：`mybatis-spring-boot-starter`

##  2. 编写启动器

**1）在IDEA中新建一个空项目 spring-boot-starter-mydiy**  

<img src="https://gitee.com/veal98/images/raw/master/img/20200711105910.png" style="zoom:80%;" />

**2）在该项目中新建一个普通 Maven 模块：`smallbeef-spring-boot-starter` 启动器模块**

<img src="https://gitee.com/veal98/images/raw/master/img/20200711110125.png" style="zoom:80%;" />



<img src="https://gitee.com/veal98/images/raw/master/img/20200711103454.png" style="zoom:80%;" />

<img src="https://gitee.com/veal98/images/raw/master/img/20200711103531.png" style="zoom:80%;" />

**3）然后，再在该项目中新建一个 Springboot 模块：`smallbeef-spring-boot-starter-autoconfigure` 自动配置模块**

<img src="https://gitee.com/veal98/images/raw/master/img/20200711103728.png" style="zoom:80%;" />

<img src="https://gitee.com/veal98/images/raw/master/img/20200711110442.png" style="zoom:80%;" />

**4）点击 Apply，基本结构如下：**

<img src="https://gitee.com/veal98/images/raw/master/img/20200711110605.png" style="zoom:80%;" />

![](https://gitee.com/veal98/images/raw/master/img/20200711110638.png)

**5）在启动器 starter 模块中自动配置autoconfigure 模块的依赖**：

![](https://gitee.com/veal98/images/raw/master/img/20200711110712.png)

```xml
<!-- 启动器 -->
<dependencies>
    <!--  引入自动配置模块 -->
    <dependency>
        <groupId>com.smallbeef</groupId>
        <artifactId>smallbeef-spring-boot-starter-autoconfigure</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </dependency>
</dependencies>
```

**6）将 autoconfigure 项目下多余的文件都删掉（包括 test 文件夹、配置文件、启动类等），pom.xml 中只留下一个 starter，这是所有的启动器基本配置**：

![](https://gitee.com/veal98/images/raw/master/img/20200711104800.png)

![](https://gitee.com/veal98/images/raw/master/img/20200711104922.png)

**7）在 autoconfigure 中编写一个自己的服务**：

```java
package com.smallbeef;

public class HelloService {

    HelloProperties helloProperties;

    public HelloProperties getHelloProperties() {
        return helloProperties;
    }

    public void setHelloProperties(HelloProperties helloProperties) {
        this.helloProperties = helloProperties;
    }

    public String sayHello(String name){
        return helloProperties.getPrefix() + name + helloProperties.getSuffix();
    }

}
```

**8）编写 HelloProperties 配置类**

```java
package com.smallbeef;

import org.springframework.boot.context.properties.ConfigurationProperties;

// 前缀 smallbeef.hello
@ConfigurationProperties(prefix = "smallbeef.hello") // 绑定相关配置
public class HelloProperties {

    private String prefix;
    private String suffix;

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }
}
```

> 该文件有个警告
>
> ![](https://gitee.com/veal98/images/raw/master/img/20200711114538.png)
>
> 不碍事~

**9）编写自动配置类并注入bean**

```java
package com.smallbeef;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnWebApplication // 如果时 web 应用则配置生效
@EnableConfigurationProperties(HelloProperties.class) // 使得 HelloProperties 生效
public class HelloServiceAutoConfiguration {

    @Autowired
    HelloProperties helloProperties;

    @Bean
    public HelloService helloService(){
        HelloService service = new HelloService();
        service.setHelloProperties(helloProperties);
        return service;
    }

}
```

**10）自动配置类若要能加载，则必须配置在 resources 文件夹下的 `META-INF\spring.factories` 文件中**

```factories
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.smallbeef.HelloServiceAutoConfiguration
```

**11）编写完成后，安装到 maven 仓库中：**

> 🚨 注意先安装 autocongifure，因为启动器 starter 依赖于 autoconfigure

<img src="https://gitee.com/veal98/images/raw/master/img/20200711111606.png"  />

## 3. 测试自定义启动器

1）新建一个SpringBoot 项目，注意需要导入 Web 模块，因为我们在自动配置类中配置了 `@ConditionalOnWebApplication` 只有在 Web 应用中配置类才生效 

2）导入我们自己写的启动器

```xml
<dependency>
    <groupId>com.smallbeef</groupId>
    <artifactId>smallbeef-spring-boot-starter</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

3）编写一个 HelloController  测试我们自己的写的接口：

```java
package com.smallbeef.controller;

@RestController
public class HelloController {

    @Autowired
    HelloService helloService;

    @RequestMapping("/hello")
    public String hello(){
        return helloService.sayHello("小牛肉");
    }

}
```

4）编写配置文件 application.properties

```properties
smallbeef.hello.prefix="ppp"
smallbeef.hello.suffix="sss"
```

5）启动项目进行测试：

<img src="https://gitee.com/veal98/images/raw/master/img/20200711115905.png" style="zoom:80%;" />

## 📚 References

- [视频 - SpringBoot_权威教程_雷丰阳_尚硅谷](https://www.bilibili.com/video/BV1Et411Y7tQ)

- [狂神说 SpringBoot](https://mp.weixin.qq.com/mp/homepage?__biz=Mzg2NTAzMTExNg==&hid=1&sn=3247dca1433a891523d9e4176c90c499)