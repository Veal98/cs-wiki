# 🔒 SpringBoot + Spring Security 一篇文章快速入门

---

## 1. SpringSecurity 简介

Spring Security 是针对Spring项目的安全框架，也是Spring Boot底层安全模块默认的技术选型，他可以实现强大的Web安全控制，对于安全控制，我们仅需要引入 `spring-boot-starter-security` 模块，进行少量的配置，即可实现强大的安全管理。

记住几个类：

- `WebSecurityConfigurerAdapter`：自定义 Security 策略
- `AuthenticationManagerBuilder`：自定义认证策略
- `@EnableWebSecurity`：开启 WebSecurity 模式

Spring Security的两个主要目标是 “认证” 和 “授权”（访问控制）。

**“认证”（Authentication）**

身份验证是关于验证您的凭据，如用户名/用户ID和密码，以验证您的身份。

身份验证通常通过用户名和密码完成，有时与身份验证因素结合使用。

 **“授权” （Authorization）**

授权发生在系统成功验证您的身份后，最终会授予您访问资源（如信息，文件，数据库，资金，位置，几乎任何内容）的完全权限。

这个概念是通用的，而不是只在Spring Security 中存在。

## 2. 实例测试

> 😊 代码比较简单，就不贴源码了，坑的地方都指出来了，跟着一步步来就没问题，前端素材放在下面了

### ① 环境搭建

1）创建 SpringBoot 项目，导入 Web 和 Thymeleaf 模块；

2）导入静态资源：

链接：[https://pan.baidu.com/s/1D9N9V-lAmKVR0mwhHuOW2w](https://pan.baidu.com/s/1D9N9V-lAmKVR0mwhHuOW2w ) 

提取码：rhl8

![](https://gitee.com/veal98/images/raw/master/img/20200711150850.png)

新建一个 controller 控制界面跳转：

```java
@Controller
public class RouterController {

    @RequestMapping({"/","/index"})
    public String index(){
        return "index";
    }

    @RequestMapping("/toLogin")
    public String toLogin(){
        return "views/login";
    }

    @RequestMapping("/level1/{id}")
    public String level1(@PathVariable("id") int id){
        return "views/level1/"+id;
    }

    @RequestMapping("/level2/{id}")
    public String level2(@PathVariable("id") int id){
        return "views/level2/"+id;
    }

    @RequestMapping("/level3/{id}")
    public String level3(@PathVariable("id") int id){
        return "views/level3/"+id;
    }

}
```

![](https://gitee.com/veal98/images/raw/master/img/20200711150910.png)

> 🚨 注意先别导入 SpringSecurity 模块，否则会直接跳转到 Login 界面~

### ② 认证和授权

目前，我们的测试环境，是谁都可以访问的，我们使用 Spring Security 增加上认证 `configure(AuthenticationManagerBuilder auth)` 和授权 `configure(HttpSecurity http)` 的功能

#### Ⅰ 授权

**引入 Spring Security 模块**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

**编写 Spring Security 配置类**

参考官网 [Example 81. OAuth2 Login Configuration](https://docs.spring.io/spring-security/site/docs/5.3.0.RELEASE/reference/html5/#oauth2login-provide-websecurityconfigureradapter) 登录配置的例子：

![](https://gitee.com/veal98/images/raw/master/img/20200711152242.png)

新建一个基础配置类：

```java
@EnableWebSecurity // 开启WebSecurity模式
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {

    }
}
```

**定制请求的<u>授权规则</u>** `configure(HttpSecurity http)`

```java
@EnableWebSecurity // 开启WebSecurity模式
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    // 授权规则
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 首页所有人可以访问
        // 其他界面只有对应的角色（权限）才可以访问
        http.authorizeRequests().antMatchers("/").permitAll()
                .antMatchers("/level1/**").hasRole("vip1")
                .antMatchers("/level2/**").hasRole("vip2")
                .antMatchers("/level3/**").hasRole("vip3");
    }

}
```

OK，测试一下，我们只能访问首页了，如果点击其他界面，会报错 403 Forbidden：

![](https://gitee.com/veal98/images/raw/master/img/20200711153154.png)

**在 `configure(HttpSecurity http)` 方法中加入以下配置，开启自动配置的登录功能**：

```java
@EnableWebSecurity // 开启WebSecurity模式
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    // 授权规则
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 首页所有人可以访问
        // 其他界面只有对应的角色（权限）才可以访问
        http.authorizeRequests().antMatchers("/").permitAll()
                .antMatchers("/level1/**").hasRole("vip1")
                .antMatchers("/level2/**").hasRole("vip2")
                .antMatchers("/level3/**").hasRole("vip3");

        // 开启自动配置的登录功能
        // 如果没有权限则跳转到 /login 登录页
        // /login?error 重定向到这里表示登录失败
        http.formLogin();
    }

}
```

测试一下：发现，没有权限的时候，会跳转到登录的页面：

<img src="https://gitee.com/veal98/images/raw/master/img/20200711153530.png" style="zoom: 67%;" />

> 🚩 注意，这个登录界面是 Spring Security 自带的默认登录界面` /login`， 不是我们自己的

#### Ⅱ 认证

**接下来我们可以定义<u>认证规则</u>，重写 `configure(AuthenticationManagerBuilder auth)` 方法**：

```java
package com.smallbeef.security.config;

import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity // 开启WebSecurity模式
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    // 认证规则
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
         //  内存数据库
        auth.inMemoryAuthentication()
                .withUser("smallbeef").password("12345").roles("vip1")
                .and()
                .withUser("user").password("123").roles("vip2","vip3")
                .and()
                .withUser("root").password("root").roles("vip1","vip2","vip3");
    }
	
    // 授权规则
    @Override
    protected void configure(HttpSecurity http) throws Exception {
       ......
    }

}
```

❓ 测试之后会报错：

![](https://gitee.com/veal98/images/raw/master/img/20200711154400.png)

![](https://gitee.com/veal98/images/raw/master/img/20200711154416.png)

💡 **原因就是我们要将前端传过来的密码进行某种方式加密，否则就无法登录。Spring security 官方推荐的是使用 `bcrypt` 加密方式。**：

```java
@EnableWebSecurity // 开启WebSecurity模式
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    // 认证规则
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        //在内存中定义，也可以在jdbc中去拿
        auth.inMemoryAuthentication().passwordEncoder(new BCryptPasswordEncoder())
                .withUser("smallbeef").password(new BCryptPasswordEncoder().encode("12345")).roles("vip1")
                .and()
                .withUser("user").password(new BCryptPasswordEncoder().encode("123")).roles("vip2","vip3")
                .and()
                .withUser("root").password(new BCryptPasswordEncoder().encode("root")).roles("vip1","vip2","vip3");
    }
	
    // 授权规则
    @Override
    protected void configure(HttpSecurity http) throws Exception {
 		......
    }

}
```

OK，接下来就可以对应角色权限成功访问了~

### ③ 权限注销和对应权限的界面显示

#### Ⅰ 权限注销

**开启自动配置的注销的功能**：

```java
//定制请求的授权规则
@Override
protected void configure(HttpSecurity http) throws Exception {
   ....
       
   //开启自动配置的注销的功能
   // /logout 注销请求
   http.logout();
}
```

**在前端，增加一个注销的按钮**：

```html
<!--登录注销-->
<div class="right menu">
    <!--未登录-->
    <a class="item" th:href="@{/login}">
        <i class="address card icon"></i> 登录
    </a>
    
    <a class="item" th:href="@{/logout}">
        <i class="address card icon"></i> 注销
    </a>
</div>
```

> ![](https://gitee.com/veal98/images/raw/master/img/20200711161315.png)
>
> 跳转的` /login` 和 `/logout` 界面都是 Spring Security 自带的默认界面。

![](https://gitee.com/veal98/images/raw/master/img/20200711160348.png)

<img src="https://gitee.com/veal98/images/raw/master/img/20200711160502.png" style="zoom:67%;" />

登录成功后点击注销，注销完毕会跳转到登录页面。

❓ 如果我们想让**他注销成功后，依旧可以跳转到首页**，该怎么处理呢？

```java
// .logoutSuccessUrl("/"); 注销成功来到首页
http.logout().logoutSuccessUrl("/");
```

#### Ⅱ 对应权限的界面显示

接下来，我们的需求就是：📃 <u>用户没有登录的时候，导航栏上只显示登录按钮，用户登录之后，导航栏上显示登录的用户信息及注销按钮。以及，比如 smallbeef 这个用户，它只有 vip1 功能，那么登录则只显示这 1 个功能，而 vip2 vip3 的功能菜单不显示</u>。这个就是真实的网站情况了~

**我们需要结合 thymeleaf 中的一些功能**：导入 `thymeleaf-extras-springsecurity5`

```xml
<!-- https://mvnrepository.com/artifact/org.thymeleaf.extras/thymeleaf-extras-springsecurity4 -->
<dependency>
   <groupId>org.thymeleaf.extras</groupId>
   <artifactId>thymeleaf-extras-springsecurity5</artifactId>
   <version>3.0.4.RELEASE</version>
</dependency>
```

🔨 修改前端页面：

导入命名空间：

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org" xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity5">
```

```html
<div class="right menu">
    <!--如果未登录-->
    <div sec:authorize="!isAuthenticated()">
        <a class="item" th:href="@{/login}">
            <i class="address card icon"></i> 登录
        </a>
    </div>

    <!--如果已登录-->
    <div sec:authorize="isAuthenticated()">
        <a class="item">
            <i class="address card icon"></i>
            用户名：<span sec:authentication="principal.username"></span>
            角色：<span sec:authentication="principal.authorities"></span>
        </a>
    </div>

    <div sec:authorize="isAuthenticated()">
        <a class="item" th:href="@{/logout}">
            <i class="address card icon"></i> 注销
        </a>
    </div>
</div>
```

![](https://gitee.com/veal98/images/raw/master/img/20200711161832.png)

OK，我们继续将下面的角色功能块认证完成：

🚩 **即在每个需要对应权限才能访问的模块上添加属性`sec:authorize="hasRole('vip1')"`**

```html
<div class="column" sec:authorize="hasRole('vip1')">
   <div class="ui raised segment">
       <div class="ui">
           <div class="content">
               <h5 class="content">Level 1</h5>
               <hr>
               <div><a th:href="@{/level1/1}"><i class="bullhorn icon"></i> Level-1-1</a></div>
               <div><a th:href="@{/level1/2}"><i class="bullhorn icon"></i> Level-1-2</a></div>
               <div><a th:href="@{/level1/3}"><i class="bullhorn icon"></i> Level-1-3</a></div>
           </div>
       </div>
   </div>
</div>

<div class="column" sec:authorize="hasRole('vip2')">
   <div class="ui raised segment">
       <div class="ui">
           <div class="content">
               <h5 class="content">Level 2</h5>
               <hr>
               <div><a th:href="@{/level2/1}"><i class="bullhorn icon"></i> Level-2-1</a></div>
               <div><a th:href="@{/level2/2}"><i class="bullhorn icon"></i> Level-2-2</a></div>
               <div><a th:href="@{/level2/3}"><i class="bullhorn icon"></i> Level-2-3</a></div>
           </div>
       </div>
   </div>
</div>

<div class="column" sec:authorize="hasRole('vip3')">
   <div class="ui raised segment">
       <div class="ui">
           <div class="content">
               <h5 class="content">Level 3</h5>
               <hr>
               <div><a th:href="@{/level3/1}"><i class="bullhorn icon"></i> Level-3-1</a></div>
               <div><a th:href="@{/level3/2}"><i class="bullhorn icon"></i> Level-3-2</a></div>
               <div><a th:href="@{/level3/3}"><i class="bullhorn icon"></i> Level-3-3</a></div>
           </div>
       </div>
   </div>
</div>
```

🏃‍ 运行代码：

![](https://gitee.com/veal98/images/raw/master/img/20200711162435.png)

### ④ Remember me

现在的情况，我们只要登录之后，关闭浏览器，再登录，就会让我们重新登录，但是很多网站有一个记住密码的功能，这个该如何实现呢？很简单：

```java
// 授权规则
@Override
protected void configure(HttpSecurity http) throws Exception {
   ......
       
   //记住我
   http.rememberMe();
}
```

我们再次启动项目测试一下，发现登录页多了一个记住我功能：

<img src="https://gitee.com/veal98/images/raw/master/img/20200711162724.png" style="zoom: 67%;" />

> ⚠ 注意，这个记住我功能是基于 Spring Security 的默认登录界面的，如果是自定义登录界面，需要另行配置，详见下文。

登录之后关闭浏览器，然后重新打开浏览器访问，用户依旧存在。

我们可以查看浏览器的 cookie，默认保留 14 天：

<img src="https://gitee.com/veal98/images/raw/master/img/20200711162938.png" style="zoom:80%;" />

点击注销的时候，Spring security 删除了这个 cookie。

### ⑤ 定制登录页

#### Ⅰ 自定义登录页跳转

现在这个登录页面都是 Spring security 默认的，怎么样可以使用我们自己写的 Login 界面呢？

首先，在刚才的登录页配置后面指定 `loginpage`：

```java
// 授权规则
@Override
protected void configure(HttpSecurity http) throws Exception {
  
    ......
        
    http.formLogin().loginPage("/toLogin");

    ......
}
```

前端也需要指向我们自己定义的 `login` 请求

```html
<a class="item" th:href="@{/toLogin}">
   <i class="address card icon"></i> 登录
</a>
```

`login.html` 配置提交请求及方式，方式必须为 `post`：

```html
<form th:action="@{/login}" method="post">
   <div class="field">
       <label>Username</label>
       <div class="ui left icon input">
           <input type="text" placeholder="Username" name="username">
           <i class="user icon"></i>
       </div>
   </div>
   <div class="field">
       <label>Password</label>
       <div class="ui left icon input">
           <input type="password" name="password">
           <i class="lock icon"></i>
       </div>
   </div>
   <input type="submit" class="ui blue submit button"/>
</form>
```

这个请求提交上来，我们还需要验证处理，配置接收登录的用户名和密码的参数：

```java
http.formLogin()
  .usernameParameter("username")
  .passwordParameter("password")
  .loginPage("/toLogin")
  .loginProcessingUrl("/login"); // 登陆表单提交请求
```

#### Ⅱ Remember me

在登录页增加记住我的多选框：

```html
<input type="checkbox" name="remember"> 记住我
```

后端验证处理：

```java
// 授权规则
@Override
protected void configure(HttpSecurity http) throws Exception {

    ......

    //记住我
    http.rememberMe().rememberMeParameter("remember");
}
```

运行代码：

![](https://gitee.com/veal98/images/raw/master/img/20200711165504.png)

![](https://gitee.com/veal98/images/raw/master/img/20200711165520.png)

#### Ⅲ 解决注销后 404

如果注销后出现 404 了，就是因为它默认防止 csrf 跨站请求伪造，因为会产生安全问题，我们可以将请求改为 post 表单提交，或者在 Spring security 中关闭 csrf 功能。在授权配置中增加 `http.csrf().disable();`

```java
// 授权规则
@Override
protected void configure(HttpSecurity http) throws Exception {
   
   ......

    http.csrf().disable(); // 关闭 csrf 功能:跨站请求伪造,默认只能通过post方式提交logout请求
}
```

OK，万事大吉 🎉

## 📚 References

- [【狂神说Java】SpringBoot 最新教程IDEA版通俗易懂](https://www.bilibili.com/video/BV1PE411i7CV?p=26)