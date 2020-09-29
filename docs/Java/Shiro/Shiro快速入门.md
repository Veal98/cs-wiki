# 🛸 SpringBoot + Shiro 一篇文章快速入门

---

## 1. Shiro 简介

> **Apache Shiro™** is a powerful and easy-to-use Java security framework that performs authentication, authorization, cryptography, and session management. With Shiro’s easy-to-understand API, you can quickly and easily secure any application – from the smallest mobile applications to the largest web and enterprise applications.
>
> **Apache Shiro™**是一个强大且易用的Java安全框架,能够用于身份验证、授权、加密和会话管理。Shiro 拥有易于理解的API,您可以快速、轻松地获得任何应用程序——从最小的移动应用程序到最大的网络和企业应用程序。

简而言之，Apache Shiro 是一个强大灵活的开源安全框架，可以完全处理身份验证、授权、加密和会话管理。

Shiro 到底能做些什么呢？

- 验证用户身份

- 用户访问权限控制，比如：判断用户是否分配了一定的安全角色；判断用户是否被授予完成某个操作的权限

- 在非 Web 或 EJB 容器的环境下可以任意使用 Session API

- 可以响应认证、访问控制，或者 Session 生命周期中发生的事件

- 可将一个或以上用户安全数据源数据组合成一个复合的用户 “view”(视图)

- 支持单点登录(SSO)功能

- 支持提供“Remember Me”服务，获取用户关联信息而无需登录

  ···

### ① 为什么是 Shiro

使用 Shiro 官方给了许多令人信服的原因，因为 Shiro 具有以下几个特点：

- **易于使用**——易用性是项目的最终目标。应用程序安全非常令人困惑和沮丧,被认为是“不可避免的灾难”。如果你让它简化到新手都可以使用它,它就将不再是一种痛苦了。
- **全面**——没有其他安全框架的宽度范围可以同Apache Shiro一样,它可以成为你的“一站式”为您的安全需求提供保障。
- **灵活**——Apache Shiro可以在任何应用程序环境中工作。虽然在网络工作、EJB和IoC环境中可能并不需要它。但Shiro的授权也没有任何规范,甚至没有许多依赖关系。
- **Web 支持**——Apache Shiro拥有令人兴奋的web应用程序支持,允许您基于应用程序的url创建灵活的安全策略和网络协议(例如REST),同时还提供一组JSP库控制页面输出。
- **低耦合**——Shiro 干净的API和设计模式使它容易与许多其他框架和应用程序集成。你会看到Shiro无缝地集成Spring这样的框架, 以及Grails, Wicket, Tapestry, Mule, Apache Camel, Vaadin...等。
- **被广泛支持**——Apache Shiro是Apache软件基金会的一部分。项目开发和用户组都有友好的网民愿意帮助。这样的商业公司如果需要Katasoft还提供专业的支持和服务。

### ② Shiro 基本功能

Apache Shiro 是一个全面的、蕴含丰富功能的安全框架。下图为描述 Shiro 功能的框架图：

![](https://gitee.com/veal98/images/raw/master/img/20200816193331.png)

⭐ <u>Authentication（认证）, Authorization（授权）, Session Management（会话管理）, Cryptography（加密）被 Shiro 框架的开发团队称之为应用安全的四大基石</u>。那么就让我们来看看它们吧：

- **Authentication（认证）：**用户身份识别，通常被称为用户“登录”
- **Authorization（授权）：**访问控制。比如某个用户是否具有某个操作的使用权限。
- **Session Management（会话管理）：**特定于用户的会话管理,甚至在非web 或 EJB 应用程序。
- **Cryptography（加密）：**在对数据源使用加密算法加密的同时，保证易于使用。

还有其他的功能来支持和加强这些不同应用环境下安全领域的关注点。特别是对以下的功能支持：

- **Web支持：**Shiro的Web支持API有助于保护Web应用程序。
- **缓存：**缓存是Apache Shiro API中的第一级，以确保安全操作保持快速和高效。
- **并发性：**Apache Shiro支持具有并发功能的多线程应用程序。
- **测试：**存在测试支持，可帮助您编写单元测试和集成测试，并确保代码按预期得到保障。
- **“运行方式”：**允许用户承担另一个用户的身份(如果允许)的功能，有时在管理方案中很有用。
- **“记住我”：**记住用户在会话中的身份，所以用户只需要强制登录即可。

> 🚨 **注意：** Shiro不会去维护用户、维护权限，这些需要我们自己去设计/提供，然后通过相应的接口注入给Shiro

### ③ Shiro 外部架构

Shiro 的**外部架构**包含三个主要的理念：**Subject**, **SecurityManager** 和 **Realm**。下面的图展示了这些组件如何相互作用，我们将在下面依次对其进行描述。

![](https://gitee.com/veal98/images/raw/master/img/20200816193913.png)

- **Subject：**<u>当前用户</u>，Subject 可以是一个人，但也可以是第三方服务、守护进程帐户、时钟守护任务或者其它–当前和软件交互的任何事件。

- **SecurityManager：**<u>管理所有 Subject</u>，SecurityManager 是 Shiro 架构的核心，配合内部安全组件共同组成安全伞。

- **Realm：域**，Shiro 从 Realm 获取安全数据（如用户、角色、权限）。也就是说 `SecurityManager` 想要验证用户身份，那么它必须从 Realm 获取相应的用户进行比较以确定用户身份是否合法；也需要从 Realm 得到用户相应的角色 / 权限进行验证用户是否能进行操作；可以把 Realm 看成 DataSource，即安全数据源。

  **通俗来说：当应用程序向 Shiro 提供了 账号和密码之后， Shiro 就会问 Realm 这个账号密码是否对， 如果对的话，其所对应的用户拥有哪些角色，哪些权限。**

  所以Realm 是什么？ 其实就是个中介。


### ④ Shiro 内部架构

![](https://gitee.com/veal98/images/raw/master/img/20200817141836.png)

- **Authenticator**：认证器，负责主体认证的，这是一个扩展点，如果用户觉得 Shiro 默认的不好，可以自定义实现；其需要认证策略（Authentication Strategy），即什么情况下算用户认证通过了；

- **Authrizer**：授权器，或者访问控制器，用来决定主体是否有权限进行相应的操作；即控制着用户能访问应用中的哪些功能；

- **SessionManager**：Session 需要有人去管理它的生命周期，这个组件就是 SessionManager；而 Shiro 并不仅仅可以用在 Web 环境，也可以用在如普通的 JavaSE 环境、EJB 等环境；所以 Shiro 就抽象了一个自己的 Session 来管理主体与应用之间交互的数据；这样的话，比如我们在 Web 环境用，刚开始是一台 Web 服务器；接着又上了台 EJB 服务器；这时想把两台服务器的会话数据放到一个地方，这个时候就可以实现自己的分布式会话（如把数据放到 Memcached 服务器）；

- **SessionDAO**：比如我们想把 Session 保存到数据库，那么可以实现自己的 SessionDAO，通过如 JDBC 写到数据库；比如想把 Session 放到 Memcached 中，可以实现自己的 Memcached SessionDAO；另外 SessionDAO 中可以使用 Cache 进行缓存，以提高性能；

- **CacheManager**：缓存控制器，来管理如用户、角色、权限等的缓存的；因为这些数据基本上很少去改变，放到缓存中后可以提高访问的性能

- **Cryptography**：密码模块，Shiro 提高了一些常见的加密组件用于如密码加密 / 解密的。

## 2. Shiro 认证过程

**Shiro 认证流程如下**：

<img src="https://gitee.com/veal98/images/raw/master/img/20200816194910.png" style="zoom: 55%;" />

上图展示了 Shiro 认证的一个重要的过程，为了加深我们的印象，我们来自己动手来写一个例子，来验证一下，首先我们新建一个 Maven 工程，然后在 pom.xml 中引入相关依赖：

```xml
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-core</artifactId>
    <version>1.4.0</version>
</dependency>
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
</dependency>

```

新建一个 `AuthenticationTest` 测试类：

```java
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.realm.SimpleAccountRealm;
import org.apache.shiro.subject.Subject;
import org.junit.Before;
import org.junit.Test;

public class TestShiro {
    SimpleAccountRealm simpleAccountRealm = new SimpleAccountRealm();

    // 在方法开始前添加一个用户(模拟数据库）
    @Before
    public void addUser(){
        simpleAccountRealm.addAccount("test","123456");
    }
	
    
    // 测试认证
    @Test
    public void testAuthentication(){

        // 1. 构建 SecurityManager 环境
        DefaultSecurityManager defaultSecurityManager = new DefaultSecurityManager();
        defaultSecurityManager.setRealm(simpleAccountRealm);

        // 2. 将 SecurityManager实例绑定给SecurityUtils
        SecurityUtils.setSecurityManager(defaultSecurityManager);

        // 3. 获取当前主体 Subject 并创建用户名/密码，得到身份凭证Token
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken("test", "123456");

        // 4. 登录
        subject.login(token); // 将这个 token 和数据库中数据进行比较，如果存在相同的token则登录成功
       // subject.isAuthenticated() 方法返回一个boolean值,用于判断用户是否认证成功
        System.out.println("isAuthenticated:" + subject.isAuthenticated()); // 输出true

        // 5. 登出
        subject.logout();
        System.out.println("isAuthenticated:" + subject.isAuthenticated()); // 输出false
    }

}
```

运行之后可以看到预想中的效果，先输出 `isAuthenticated:true` 表示登录认证成功，然后再输出 `isAuthenticated:false` 表示认证失败退出登录。

![](https://gitee.com/veal98/images/raw/master/img/20200817201952.png)

## 3. Shiro 授权过程

<img src="https://gitee.com/veal98/images/raw/master/img/20200816195619.png" style="zoom: 55%;" />

跟认证过程大致相似，下面我们仍然通过代码来熟悉一下过程：

```java
public class TestShiro {
    SimpleAccountRealm simpleAccountRealm = new SimpleAccountRealm();

    // 在方法开始前添加一个用户(模拟数据库），该用户具备两个角色 admin 和 user
    @Before
    public void addUser(){
        simpleAccountRealm.addAccount("test","123456", "admin", "user");
    }

    // 测试授权
    @Test
    public void testAuthorization(){

        // 1. 构建 SecurityManager 环境
        DefaultSecurityManager defaultSecurityManager = new DefaultSecurityManager();
        defaultSecurityManager.setRealm(simpleAccountRealm);

        // 2. 将 SecurityManager实例绑定给SecurityUtils
        SecurityUtils.setSecurityManager(defaultSecurityManager);

        // 3. 获取当前主体 Subject 并创建用户名/密码，得到身份凭证Token
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken("test", "123456");

        // 4. 登录
        subject.login(token); // 将这个 token 和数据库中数据进行比较，如果存在相同的token则登录成功
       // subject.isAuthenticated() 方法返回一个boolean值,用于判断用户是否认证成功
        System.out.println("isAuthenticated:" + subject.isAuthenticated()); // 输出true
        
        // 判断subject是否具有admin和user两个角色权限,如没有则会报错
        subject.checkRoles("admin","user");
        // subject.checkRole("admin","user"); 报错
    }

}
```

## 4. Realm 详解

⭐ 在认证、授权内部实现机制中都有提到，最终处理都将交给 Realm 进行处理。因为**在 Shiro 中，最终是通过 Realm 来获取应用程序中的用户、角色及权限信息的**。通常情况下，**在 Realm中 会直接从我们的数据源中获取 Shiro 需要的验证信息。可以说，Realm 是专用于安全框架的DAO**。

Shiro 框架内部默认提供了两种 Realm 的实现，一种是查询`.ini`文件的`IniRealm`，另一种是查询数据库的`JdbcRealm`。当然，我们还可以自定义 Realm。接下来进行详细解释：👇

### ① Shiro 默认提供的 Realm

![](https://gitee.com/veal98/images/raw/master/img/20200817151918.png)

⭐ **一般来说当我们自定义 Realm 的时候，继承 `AuthorizingRealm` 即可**；它继承了 `AuthenticatingRealm`（即身份验证），而且也间接继承了 `CachingRealm`（带有缓存实现）。其中主要默认实现如下：

- **org.apache.shiro.realm.text.IniRealm**：`[users]` 指定用户名 / 密码及其角色；`[roles]` 指定角色即权限信息。举例如下：

  ![](https://gitee.com/veal98/images/raw/master/img/20200817152344.png)

- **org.apache.shiro.realm.text.PropertiesRealm**： `user.username=password,role1,role2` 指定用户名 / 密码及其角色；`role.role1=permission1,permission2` 指定角色及权限信息；

- **org.apache.shiro.realm.jdbc.JdbcRealm**：通过 sql 查询相应的信息，如 `select password from users where username = ?` 获取用户密码，`select password, password_salt from users where username = ?` 获取用户密码及盐；`select role_name from user_roles where username = ?` 获取用户角色；`select permission from roles_permissions where role_name = ?` 获取角色对应的权限信息；也可以调用相应的 api 进行自定义 sql

### ② 自定义 Realm

主流是自定义实现的 Realm ：

⭐ **一般来说当我们自定义 Realm 的时候，继承 `AuthorizingRealm` 类并实现默认的两个方法 `获取授权信息 doGetAuthorizationInfo`，`获取身份认证信息 doGetAuthenticationInfo` 即可**：

<img src="https://gitee.com/veal98/images/raw/master/img/20200928211156.png" style="zoom: 67%;" />

```java
/**
 * 自定义 Realm
 */
public class MyRealm extends AuthorizingRealm {

    // 模拟数据库中用户信息（用户名/密码）
    Map<String,String> userMap = new HashMap<>(16);
    {
        userMap.put("test","123456");
        super.setName("myRealm"); // 设置自定义Realm的名称，随便写
    }

    // 模拟从数据库中获取角色信息
    private Set<String> getRolesByUsername(String usename){
        Set<String> roles = new HashSet<>();
        roles.add("admin"); // 角色 admin
        roles.add("user");
        return roles;
    }

    // 模拟从数据库中获取权限信息
    private Set<String> getPermissionsByUserName(String userName) {
        Set<String> permissions = new HashSet<>();
        permissions.add("user:delete"); // 权限 user:delete
        permissions.add("user:add");
        return permissions;
    }

    // 模拟从数据库中获取密码
    private String getPasswordByUsername(String username){
        return userMap.get(username);
    }

    // 获取授权信息
    // PrincipalCollection 身份集合
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        String username = (String) principalCollection.getPrimaryPrincipal(); // 获取用户名
        Set<String> roles = getRolesByUsername(username); // 从数据库中获取角色信息
        Set<String> permissions = getPermissionsByUserName(username); // 从数据中获取权限信息

        // 授权
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        simpleAuthorizationInfo.setStringPermissions(permissions);
        simpleAuthorizationInfo.setRoles(roles);
        return simpleAuthorizationInfo;
    }

    // 获取身份认证信息
    // authenticationToken 主体传过来的认证信息
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        // 1. 从主体传过来的认证信息中，获得用户名
        String username = (String) authenticationToken.getPrincipal();

        // 2. 通过用户名到数据库获取密码
        String password = getPasswordByUsername(username);
        if(password == null)
            return null;
        
		// 3. 将从数据库中查到的信息封装近 SimpleAuthenticationInfo
        SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(username, password, "myRealm");
        return simpleAuthenticationInfo;
    }
}

```

⭐ **我们只需要获取授权和身份信息即可，信息的匹配即认证工作由 Shiro 的 `assertCredentialsMatch` 来做。**

- **doGetAuthorizationInfo 获取授权信息**：

  其中参数`PrincipalCollection` 是一个身份集合，因为我们现在就一个 Realm，所以直接调用 `getPrimaryPrincipal` 得到之前传入的用户名即可；然后根据用户名调用相应方法获取角色及权限信息。

  该方法需要返回一个 `AuthorizationInfo` 类型的参数：

  ![](https://gitee.com/veal98/images/raw/master/img/20200817214325.png)

  <u>`AuthorizationInfo` 用于聚合授权信息</u>：

  ```java
  public interface AuthorizationInfo extends Serializable {
      Collection<String> getRoles(); //获取角色字符串信息
      Collection<String> getStringPermissions(); //获取权限字符串信息
      Collection<Permission> getObjectPermissions(); //获取Permission对象信息
  };
  ```

  当我们使用 `AuthorizingRealm` 时，如果身份验证成功，在进行授权时就通过 `doGetAuthorizationInfo` 方法获取角色 / 权限信息用于授权验证。

  Shiro 提供了一个实现 `SimpleAuthorizationInfo`，大多数时候使用这个即可。

- **doGetAuthenticationInfo 获取身份验证相关信息**：

  其中<u>参数 `AuthenticationToken` 用于收集用户提交的身份（如用户名）及凭据（如密码）</u>：

  ![](https://gitee.com/veal98/images/raw/master/img/20200817213827.png)

  ```java
  public interface AuthenticationToken extends Serializable {
      Object getPrincipal(); //身份
      Object getCredentials(); //凭据
  };
  ```

  该方法需要返回一个 `AuthenticationInfo` 类型的参数：

  ![](https://gitee.com/veal98/images/raw/master/img/20200817214051.png)

  一般返回 `SimpleAuthenticationInfo` 即可。

  `AuthenticationInfo` 有两个作用：

  - 如果 Realm 是 AuthenticatingRealm 子类，则提供给 AuthenticatingRealm 进行凭据验证；（如果没有继承它需要在自己的 Realm 中自己实现验证）；

  - <u>提供给 SecurityManager 来创建 Subject（提供身份信息）</u>；

✍ 接下来我们编写测试类，来验证是否正确：

```java

@Test
public void testCustomRealm(){
    MyRealm myRealm = new MyRealm();

    // 1. 构建 SecurityManager 环境
    DefaultSecurityManager defaultSecurityManager = new DefaultSecurityManager();
    defaultSecurityManager.setRealm(myRealm);

    // 2. 将 SecurityManager实例绑定给SecurityUtils
    SecurityUtils.setSecurityManager(defaultSecurityManager);

    // 3. 获取当前主体 Subject 并创建用户名/密码，得到身份凭证Token
    Subject subject = SecurityUtils.getSubject();
    UsernamePasswordToken token = new UsernamePasswordToken("test", "123456");

    // 4. 登录
    subject.login(token); // 将这个 token 和数据库中数据进行比较，如果存在相同的token则登录成功
    // subject.isAuthenticated() 方法返回一个boolean值,用于判断用户是否认证成功
    System.out.println("isAuthenticated:" + subject.isAuthenticated()); // 输出true

    // 判断subject是否具有admin和user两个角色, 如没有则会报错
    subject.checkRoles("admin","user");

    // 判断subject是否具有user:add权限, 如没有则会报错
    subject.checkPermission("user:add");

}
```

## 5. Shiro 加密

### ① md5 加密

在之前的学习中，我们在数据库中保存的密码都是明文的，一旦数据库数据泄露，那就会造成不可估算的损失，所以我们通常都会使用非对称加密，而 md5 加密算法就是符合这样的一种算法：

![](https://gitee.com/veal98/images/raw/master/img/20200816201916.png)

如上面的 123456 用 Md5 加密后，得到的字符串：**e10adc3949ba59abbe56e057f20f883e**，就无法通过计算还原回 123456，我们把这个加密的字符串保存在数据库中，<u>等下次用户登录时我们把密码通过同样的算法加密后再从数据库中取出这个字符串进行比较，就能够知道密码是否正确了</u>，这样既保留了密码验证的功能又大大增加了安全性，**但是问题是：虽然无法直接通过计算反推回密码，但是我们仍然可以通过计算一些简单的密码加密后的 Md5 值进行比较，推算出原来的密码**

比如我的密码是 123456，你的密码也是，通过 md5 加密之后的字符串一致，所以你也就能知道我的密码了，如果我们把常用的一些密码都做 md5 加密得到一本字典，那么就可以得到相当一部分的人密码，这也就相当于“破解”了一样，所以其实也没有我们想象中的那么“安全”。

### ③ 加盐 + 多次加密

既然相同的密码 md5 一样，那么我们就让我们的**原始密码再加一个随机数**，然后再进行 md5 加密，这个随机数就是我们说的**盐(salt)**，这样处理下来就能得到不同的 Md5 值，当然我们需要**把这个随机数盐也保存进数据库中**，以便我们进行验证。

另外我们可以通过**多次加密**的方法，即使黑客通过一定的技术手段拿到了我们的密码 md5 值，但它并不知道我们到底加密了多少次，所以这也使得破解工作变得艰难。

在 Shiro 框架中，对于这样的操作提供了简单的代码实现：

```java
import org.apache.shiro.crypto.SecureRandomNumberGenerator;

...
    
String password = "123456";
String salt = new SecureRandomNumberGenerator().nextBytes().toString(); // 随机生成盐
int times = 2;  // 定义多次加密次数：2
String alogrithmName = "md5";   // 加密算法

String encodePassword = new SimpleHash(alogrithmName, password, salt, times).toString();

System.out.printf("原始密码是 %s , 盐是： %s, 运算次数是： %d, 运算出来的密文是：%s ",password,salt,times,encodePassword);
```

输出 ：

> 原始密码是 123456 , 盐是： f5GQZsuWjnL9z585JjLrbQ==, 运算次数是： 2, 运算出来的密文是：55fee80f73537cefd6b3c9a920993c25 

## 6. SpringBoot + Shiro 简单实例

通过上面的学习，我们现在来着手搭建一个简单的使用 Shiro + SpringBoot + JPA + Mysql 进行权限验证授权的一个简单系统

### ① 新建SpringBoot项目，添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>5.1.47</scope>
</dependency>
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring</artifactId>
    <version>1.4.0</version>
</dependency>

```

`application.properties` 文件中配置数据库：

```properties
# thymeleaf 配置
spring.thymeleaf.mode=HTML5
spring.thymeleaf.encoding=UTF-8
spring.thymeleaf.servlet.content-type=text/html
# 缓存设置为false, 这样修改之后马上生效，便于调试
spring.thymeleaf.cache=false

# 数据库
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/testshiro?useUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.jpa.properties.hibernate.hbm2ddl.auto=update
# 显示SQL语句
spring.jpa.show-sql=true
# 不加下面这句则不会默认创建InnoDB引擎的数据库
spring.jpa.database-platform=org.hibernate.dialect.MySQL5InnoDBDialect
# 自己重写的配置类，默认使用utf8编码
spring.jpa.properties.hibernate.dialect=com.smallbeef.shiro_demo.config.MySQLConfig
```

### ② 实体类 —— RBAC

⭐ RBAC 是**基于角色的访问控制**（Role-Based Access Control ）。在 RBAC 中，**权限与角色相关联，用户通过成为适当角色的成员而得到这些角色的权限**。这就极大地简化了权限的管理。这样管理都是层级相互依赖的，权限赋予给角色，而把角色又赋予用户，这样的权限设计很清楚，管理起来很方便。

采用 JPA 技术来自动生成基础表格，新建一个 `entity` 包，在下面创建以下实体：

**用户信息 UserInfo**：

```java
@Entity
public class UserInfo {
    @Id
    @GeneratedValue
    private Long id; // 主键.
    @Column(unique = true)
    private String username; // 登录账户,唯一.
    private String name; // 名称(匿名或真实姓名),用于UI显示
    private String password; // 密码.
    private String salt; // 用来加密密码的盐
    @JsonIgnoreProperties(value = {"userInfos"}) // 忽略字段 userInfos 防止多对多的无限循环
    @ManyToMany(fetch = FetchType.EAGER) // 立即从数据库中进行加载数据
    // 生成 sys_user_role 用户角色表（由用户表和角色表的 id 组成)
    @JoinTable(name = "SysUserRole", joinColumns = @JoinColumn(name = "uid"), inverseJoinColumns = @JoinColumn(name = "roleId"))
    private List<SysRole> roles; // 一个用户具有多个角色

    /** getter and setter */
}

```

**角色信息 SysRole**：

```java
@Entity
public class SysRole {
    @Id
    @GeneratedValue
    private Long id; // 主键.
    private String name; // 角色名称,如 admin/user
    private String description; // 角色描述,用于UI显示

    // 角色 -- 权限关系：多对多
    @JsonIgnoreProperties(value = {"roles"})
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "SysRolePermission", joinColumns = {@JoinColumn(name = "roleId")}, inverseJoinColumns = {@JoinColumn(name = "permissionId")})
    private List<SysPermission> permissions;

    // 用户 -- 角色关系：多对多
    @JsonIgnoreProperties(value = {"roles"})
    @ManyToMany
    @JoinTable(name = "SysUserRole", joinColumns = {@JoinColumn(name = "roleId")}, inverseJoinColumns = {@JoinColumn(name = "uid")})
    private List<UserInfo> userInfos;// 一个角色对应多个用户

    /** getter and setter */
}

```

**权限信息 SysPermission**：

```java
@Entity
public class SysPermission {
    @Id
    @GeneratedValue
    private Long id; // 主键.
    private String name; // 权限名称,如 user:select
    private String description; // 权限描述,用于UI显示
    private String url; // 权限地址.
    @JsonIgnoreProperties(value = {"permissions"})
    @ManyToMany
    @JoinTable(name = "SysRolePermission", joinColumns = {@JoinColumn(name = "permissionId")}, inverseJoinColumns = {@JoinColumn(name = "roleId")})
    private List<SysRole> roles; // 一个权限可以被多个角色使用

    /** getter and setter */
}

```

> 🚨 **注意：**这里有一个坑，就是当我们想要使用 RESTful 风格返回给前台 JSON 数据的时候，这里有一个关于多对多无限循环的坑，比如当我们想要返回给前台一个用户信息时，由于一个用户拥有多个角色，一个角色又拥有多个权限，而权限跟角色也是多对多的关系，也就是造成了 查用户→查角色→查权限→查角色→查用户... 这样的无限循环，导致传输错误，所以我们根据这样的逻辑在每一个实体类返回JSON时使用了一个`@JsonIgnoreProperties`注解，来排除自己对自己无线引用的过程，也就是打断这样的无限循环。

最终根据以上的代码会自动生成 user_info（用户信息表）、sys_role（角色表）、sys_permission（权限表）、sys_user_role（用户角色表）、sys_role_permission（角色权限表）这五张表：

![](https://gitee.com/veal98/images/raw/master/img/20200817222817.png)

为了方便测试我们给这五张表插入一些初始化数据：

```sql

// 创建用户 1 小牛肉
INSERT INTO `user_info` (`id`,`name`,`password`,`salt`,`username`) VALUES (1, '小牛肉','123', 'abc', 'smallbeef');

// 创建权限 1 '/userList'
INSERT INTO `sys_permission` (`id`,`description`,`name`,`url`) VALUES (1,'查询用户','userInfo:view','/userList');

// 创建权限 2 '/userAdd'
INSERT INTO `sys_permission` (`id`,`description`,`name`,`url`) VALUES (2,'增加用户','userInfo:add','/userAdd');

// 创建权限 3 '/userDelete'
INSERT INTO `sys_permission` (`id`,`description`,`name`,`url`) VALUES (3,'删除用户','userInfo:delete','/userDelete');

// 创建角色 1 管理员
INSERT INTO `sys_role` (`id`,`description`,`name`) VALUES (1,'管理员','admin');

// 角色 1 管理员 拥有权限 1 '/userList'
INSERT INTO `sys_role_permission` (`permission_id`,`role_id`) VALUES (1,1);

// 角色 1 管理员 拥有权限 2 '/userAdd'
INSERT INTO `sys_role_permission` (`permission_id`,`role_id`) VALUES (2,1);

// 用户 1 小牛肉 拥有角色 1 管理员
INSERT INTO `sys_user_role` (`role_id`,`uid`) VALUES (1,1);

```

### ③ 配置 Shiro

新建一个 `config` 包，在下面创建以下文件：

**MySQLConfig**:

```java
public class MySQLConfig extends MySQL5InnoDBDialect {
    @Override
    public String getTableTypeString() {
        return "ENGINE=InnoDB DEFAULT CHARSET=utf8";
    }
}
```

这个文件关联的是配置文件中最后一个配置，是让 Hibernate 默认创建 InnoDB 引擎并默认使用 utf-8 编码

> 💡 只有 InnoDB 引擎才能使用外键，MyISAM 创建外键会报错

**MyShiroRealm：**

自定义的 Realm ，方法跟上面的认证授权过程一致。编写结束后，注**意将自定义的 Realm 注入到securityManager 中**

```java
public class MyShiroRealm extends AuthorizingRealm {
    @Autowired
    private UserInfoService userInfoService;
	
    
    // 获取授权信息(对已认证用户进行授予权限和角色)
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        // 能进入这里说明用户已经通过验证了
        UserInfo userInfo = (UserInfo) principalCollection.getPrimaryPrincipal();
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        for (SysRole role : userInfo.getRoles()) {
            simpleAuthorizationInfo.addRole(role.getName());
            for (SysPermission permission : role.getPermissions()) {
                simpleAuthorizationInfo.addStringPermission(permission.getName());
            }
        }
        return simpleAuthorizationInfo;
    }
	
    // 获取身份认证信息（认证用户是否存在于数据库中）
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        // 获取用户输入的账户
        String username = (String) authenticationToken.getPrincipal();
        System.out.println(authenticationToken.getPrincipal());
        // 通过username从数据库中查找 UserInfo 对象
        UserInfo userInfo = userInfoService.findByUsername(username);
        if (null == userInfo) {
            return null;
        }

        SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(
                userInfo, // 用户名
                userInfo.getPassword(), // 密码
                ByteSource.Util.bytes(userInfo.getSalt()), // salt=username+salt
                getName() // realm name
        );
        return simpleAuthenticationInfo;
    }
}
```

**ShiroConfig：**

```java

@Configuration
public class ShiroConfig {
    @Bean
    public ShiroFilterFactoryBean shirFilter(SecurityManager securityManager) {
        System.out.println("ShiroConfiguration.shirFilter()");
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        shiroFilterFactoryBean.setSecurityManager(securityManager);

        // 拦截器.
        Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>();

        // 配置不会被拦截的链接 顺序判断
        // <!-- authc:所有url都必须认证通过才可以访问; anon:所有url都都可以匿名访问-->
        filterChainDefinitionMap.put("/static/**", "anon");
        // 配置退出过滤器,其中的具体的退出代码Shiro已经替我们实现了
        filterChainDefinitionMap.put("/logout", "logout");
        // <!-- 过滤链定义，从上向下顺序执行，一般将/**放在最为下边 -->
        filterChainDefinitionMap.put("/**", "authc");

        // 自定义登录链接，如果不设置默认会自动寻找Web工程根目录下的"/login.jsp"页面
        shiroFilterFactoryBean.setLoginUrl("/login");
        // 自定义登录成功后要跳转的链接
        shiroFilterFactoryBean.setSuccessUrl("/index");

        //未授权界面;
        shiroFilterFactoryBean.setUnauthorizedUrl("/403");

        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
        return shiroFilterFactoryBean;
    }

    /**
     * 密码匹配器
     * （密码校验交给Shiro的SimpleAuthenticationInfo进行处理）
     *
     * @return
     */
    @Bean
    public HashedCredentialsMatcher hashedCredentialsMatcher() {
        HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
        hashedCredentialsMatcher.setHashAlgorithmName("md5"); // 散列算法:这里使用MD5算法;
        hashedCredentialsMatcher.setHashIterations(2); // 散列的次数，比如散列两次，相当于 md5(md5(""));
        return hashedCredentialsMatcher;
    }

    @Bean
    public MyShiroRealm myShiroRealm() {
        MyShiroRealm myShiroRealm = new MyShiroRealm();
        myShiroRealm.setCredentialsMatcher(hashedCredentialsMatcher());
        return myShiroRealm;
    }

	// 将自定义的 Realm 注入到securityManager中
    @Bean	
    public SecurityManager securityManager() {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        securityManager.setRealm(myShiroRealm());
        return securityManager;
    }

    /**
     * 开启shiro aop注解支持.
     * 使用代理方式;所以需要开启代码支持;
     *
     * @param securityManager
     * @return
     */
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(SecurityManager securityManager) {
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);
        return authorizationAttributeSourceAdvisor;
    }

   
}

```

**Apache Shiro 的核心通过 Filter 来实现**，就好像 SpringMvc 通过 DispachServlet 来主控制一样。 既然是使用 Filter 一般也就能猜到，是通过URL规则来进行过滤和权限校验，所以我们需要定义一系列关于URL的规则和访问权限。

**过滤器链 Filter Chain** 定义说明：

- 一个URL可以配置多个Filter，使用逗号分隔
- 当设置多个过滤器时，全部验证通过，才视为通过
- 部分过滤器可指定参数，如 `perms`，`roles`

Shiro 内置的过滤器链：

![](https://gitee.com/veal98/images/raw/master/img/20200816211838.png)

- `anon`: 所有url都都可以匿名访问
- `authc`: 需要认证才能进行访问
- `user`: 配置记住我或认证通过可以访问

### ④ DAO 层和 Service 层

新建 `dao` 包，在下面创建 `UserInfoDao` 接口：

```java
public interface UserInfoDao extends JpaRepository<UserInfo, Long> {
    /** 通过username查找用户信息*/
    public UserInfo findByUsername(String username);
}
```

新建 `service` 包，创建 `UserInfoService` 接口：

```java
public interface UserInfoService {
    /** 通过username查找用户信息；*/
    public UserInfo findByUsername(String username);
}
```

并在该包下再新建一个 `impl` 包，新建 `UserInfoServiceImpl` 实现类：

```java
@Service
public class UserInfoServiceImpl implements UserInfoService {

    @Autowired
    UserInfoDao userInfoDao;

    @Override
    public UserInfo findByUsername(String username) {
        return userInfoDao.findByUsername(username);
    }
}
```

> 💡 由于我们的代码逻辑比较简单，所以在此处看来就是简单的调用而已，好像有点多此一举。显然并不，开发规范还是需要遵守~

### ⑤ Controller层

新建 `controller` 包，然后在下面创建以下文件：

**HomeController：**

**登录过程其实只是处理异常的相关信息，具体的登录验证交给 Shiro 来处理**

```java
@Controller
public class HomeController {

    @RequestMapping({"/","/index"})
    public String index(){
        return "index"; // 跳转到 index.html
    }
	
    // 在 ShiroConfig 类中我们配置了登录链接 shiroFilterFactoryBean.setLoginUrl("/login"); 注意与此处保持一致
    @RequestMapping("/login")
    public String login(HttpServletRequest request, Map<String, Object> map) throws Exception{
        System.out.println("HomeController.login()");
        // 登录失败从request中获取shiro处理的异常信息。
        // shiroLoginFailure:就是shiro异常类的全类名.
        String exception = (String) request.getAttribute("shiroLoginFailure");
        System.out.println("exception=" + exception);
        String msg = "";
        if (exception != null) {
            if (UnknownAccountException.class.getName().equals(exception)) {
                System.out.println("UnknownAccountException -- > 账号不存在：");
                msg = "UnknownAccountException -- > 账号不存在：";
            } else if (IncorrectCredentialsException.class.getName().equals(exception)) {
                System.out.println("IncorrectCredentialsException -- > 密码不正确：");
                msg = "IncorrectCredentialsException -- > 密码不正确：";
            } else if ("kaptchaValidateFailed".equals(exception)) {
                System.out.println("kaptchaValidateFailed -- > 验证码错误");
                msg = "kaptchaValidateFailed -- > 验证码错误";
            } else {
                msg = "else >> "+exception;
                System.out.println("else -- >" + exception);
            }
        }
        map.put("msg", msg);
        // 此方法不处理登录成功,由shiro进行处理
        return "login"; // 跳转到 login.html
    }

    @RequestMapping("/403")
    public String unauthorizedRole(){
        System.out.println("------没有权限-------");
        return "403";
    }
}
```

这里边的地址对应我们在 Shiro 配置类 `ShiroConfig` 设置的地址

**UserInfoController：哪里需要权限，哪里写注解 `@RequirePermission` 就行**：

> 这种方式直观，但是，真正项目开发的时候，这种方式就很有局限性了，当权限配置关系发生变化，每次都要修改代码，编译打包重启系统，这肯定是不能够被接受的。最好的方式，就是通过动态配置，给不同的用户配置不同的角色，权限，修改之后立马生效这种方式。 为了实现这个效果，就需要**基于URL配置权限**的方式来做了，详见该系列其他文章

```java
@RestController
public class UserInfoController {

    @Autowired
    UserInfoService userInfoService;

    /**
     * 按username账户从数据库中取出用户信息
     *
     * @param username 账户
     * @return
     */
    @GetMapping("/userList")
    @RequiresPermissions("userInfo:view") // 需要对应权限才能访问该路径
    public UserInfo findUserInfoByUsername(@RequestParam String username) {
        return userInfoService.findByUsername(username);
    }

    /**
     * 简单模拟从数据库添加用户信息成功
     *
     * @return
     */
    @PostMapping("/userAdd")
    @RequiresPermissions("userInfo:add")
    public String addUserInfo() {
        return "addUserInfo success!";
    }

    /**
     * 简单模拟从数据库删除用户成功
     *
     * @return
     */
    @DeleteMapping("/userDelete")
    @RequiresPermissions("userInfo:delete")
    public String deleteUserInfo() {
        return "deleteUserInfo success!";
    }
}
```

### ⑥ 前端页面

**index.html：首页**

```html
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <title>首页</title>
</head>
<body>
index - 首页
</body>
</html>
```

**login.html：登录页**

```html
<!DOCTYPE html>
<html xmlns:th="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <title>登录页</title>
</head>
<body>
错误信息：<h4 th:text="${msg}"></h4>
<form action="" method="post">
    <p>账号：<input type="text" name="username" value="smallbeef"/></p>
    <p>密码：<input type="text" name="password" value="123"/></p>
    <p><input type="submit" value="登录"/></p>
</form>
</body>
</html>
```

**403.html：没有权限的页面**

```html
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <title>403错误页</title>
</head>
<body>
错误页面
</body>
</html>
```

### ⑦ 测试

编写好程序后就可以启动，首先访问 [http://localhost:8080/userList?username=smallbeef](http://localhost:8080/userList?username=smallbeef) 路径，由于没有登录就会跳转到我们配置好的 [http://localhost:8080/login](http://localhost:8080/login) 路径。使用账号 smallbeef 密码 123 登陆之后就会看到正确返回的 JSON 数据，登录的时候会触发 `MyShiroRealm.doGetAuthenticationInfo()` 这个方法，也就是登录认证的方法。

![](https://gitee.com/veal98/images/raw/master/img/20200817222845.png)

登录之后，我们还能访问 [http://localhost:8080/userAdd](http://localhost:8080/userAdd) 页面，因为我们在数据库中提前配置好了权限，能够看到正确返回的数据，但是我们访问 [http://localhost:8080/userDelete](http://localhost:8080/userDelete) 时，由于该用户没有权限就会返回错误页面.

## 📚 References

- [我没有三颗心脏 — Shiro安全框架【快速入门】](https://www.cnblogs.com/wmyskxz/p/10229148.html)
- [shiro框架整合spring boot及登录身份认证源码分析](https://blog.csdn.net/swhuan007/article/details/108442928?utm_medium=distribute.pc_relevant.none-task-blog-title-2&spm=1001.2101.3001.4242)