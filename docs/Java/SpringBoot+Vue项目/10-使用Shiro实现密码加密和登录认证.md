# 🍰 使用 Shiro 实现密码加密和登录认证

---

 😊本项目使用 Shiro 作为安全组件

## 1. 对用户注册的密码进行加密

对用户密码进行**加盐 + 多次加密**。具体来说就是：

- 当某个用户进行注册的时候，自动生成一个随机盐，将这个盐和用户输入的密码组合在一起，并使用加密算法进行多次加密。**将这个随机盐和加密后的密码存储进数据库中**。
- 当用户登录的时候，通过用户输入的用户名，从数据库中获取对应的盐，然后对用户输入的密码（明文）进行上述同样的操作，如果和数据库中存储的加密密码一样，则登录成功。

## 2. 具体代码

### ① 添加 salt 字段

首先，我们要在数据库的 user 表中添加 salt 字段，并相应地在实体类 User 中添加 salt 属性与 get、set 方法：

```java
String salt;

public String getSalt() {
    return salt;
}

public void setSalt(String salt) {
    this.salt = salt;
}
```

### ② 添加 Shiro 依赖

添加 Shiro 的依赖：

```xml
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring</artifactId>
    <version>1.4.0</version>
</dependency>
```

### ③ 修改注册逻辑

接着，修改 `register` 方法：

```java
import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.SimpleHash;

......
    
@RestController
public class RegisterController {

    @Autowired
    UserService userService;

    @PostMapping("api/register")
    public Result register(@RequestBody User user){
        String username = user.getUsername();
        String password = user.getPassword();
        boolean exist = userService.isExist(username); // 判断数据库中是否存在
        if(exist){
            System.out.println("用户名已被使用");
            return new Result(400);
        }

        // 生成随机盐，默认长度 16 位
        String salt = new SecureRandomNumberGenerator().nextBytes().toString();
        int times = 2; // 定义多次加密次数
        String encodedPassword = new SimpleHash("md5", password, salt, times).toString(); // 加密后的算法

        // 更新用户信息，包括 salt 与加密后的算法
        user.setSalt(salt);
        user.setPassword(password);

        // 存储用户信息
        userService.add(user);

        // 返回状态码
        return new Result(200);
    }
}
```

这样就完成了注册时的加密。

![](https://gitee.com/veal98/images/raw/master/img/20200822100132.png)

当然，我们还需要对用户登录认证的逻辑进行相应的修改 👇 

## 2. 使用 Shiro 进行登录认证

🚨 登录认证完成后，之前注册的用户无法登录，需要将之前注册的用户信息删除

🚨 **注意：下面很多类的导包，需要导的是 shiro 下面的包，别导错了**

### ① 自定义 Realm

新建 `realm/myRealm` ：

```java
public class MyRealm extends AuthorizingRealm {

    @Autowired
    private UserService userService;

    // 获取授权信息
    // PrincipalCollection 身份集合
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        return simpleAuthorizationInfo;
    }


    // 获取身份认证信息
    // authenticationToken 主体传过来的认证信息
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        // 1. 从主体传过来的认证信息中，获得用户名
        String username = authenticationToken.getPrincipal().toString();
        // 2. 通过用户名到数据库获取密码
        User user =  userService.getByName(username);
        String password = user.getPassword();
        String salt = user.getSalt();
        SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(
                username,password, ByteSource.Util.bytes(salt),getName()
        );
        return simpleAuthenticationInfo;
    }
}
```

### ② Shiro 配置类

新建 `config/shiroConfig`：

```java
@Configuration
public class ShiroConfig {


    @Bean
    public SecurityManager securityManager(){
        DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();
        defaultWebSecurityManager.setRealm(getMyRealm());
        return defaultWebSecurityManager;
    }


    // 密码匹配器
    @Bean
    public HashedCredentialsMatcher hashedCredentialsMatcher(){
        HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
        hashedCredentialsMatcher.setHashAlgorithmName("md5"); // 散列算法
        hashedCredentialsMatcher.setHashIterations(2); // 散列次数
        return hashedCredentialsMatcher;
    }

    @Bean
    public Realm getMyRealm() {
        MyRealm myRealm = new MyRealm();
        myRealm.setCredentialsMatcher(hashedCredentialsMatcher());
        return myRealm;
    }

    // 过滤器
    @Bean
    public ShiroFilterFactoryBean shiroFilter(SecurityManager securityManager){
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        shiroFilterFactoryBean.setSecurityManager(securityManager);
        return shiroFilterFactoryBean;
    }

    // 开启 Shiro 对 aop 注解的支持
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(SecurityManager securityManager){
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);
        return authorizationAttributeSourceAdvisor;
    }
}
```

### ③ 修改登录逻辑

```java
@Controller
public class LoginController {

    @Autowired
    UserService userService;

    @PostMapping(value = "api/login")
    @ResponseBody
    public Result login(@RequestBody User requestUser, HttpSession session) {
        String username = requestUser.getUsername();
        String password = requestUser.getPassword(); // 注意数据库中的密码是已经加密过的
        System.out.println(username + ": " + password);
        UsernamePasswordToken usernamePasswordToken = new UsernamePasswordToken(username, password);
        Subject subject = SecurityUtils.getSubject();
        try{
            subject.login(usernamePasswordToken);
            System.out.println("登录成功");
            return new Result(200); // 登录成功
        } catch(AuthenticationException e){
            System.out.println("登录失败");
            return new Result(400); // 登录失败
        }

    }
}
```

## 📚 References

- [Vue + Spring Boot 项目实战 — 白卷](https://blog.csdn.net/Neuf_Soleil/article/details/88925013)