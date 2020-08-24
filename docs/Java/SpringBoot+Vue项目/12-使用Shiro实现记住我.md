# ✅ 使用 Shiro 实现记住我功能

---

💡 <u>cookie 的生命周期如果未特别设置则与浏览器保持一致。也就是说当我们关闭浏览器之后，sessionId 就会消失，这个用户的状态便失效了，再次重新打开浏览器就需要重新登录</u>。**Shiro 可以帮助我们很方便的实现 Remember me 功能**

## 1. Shiro 配置类启用 rememberMe

在 Shiro 配置类 `ShiroConfig` 中添加两个方法：

```java
.......

@Bean
public SecurityManager securityManager(){
    DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();
    defaultWebSecurityManager.setRealm(getMyRealm());
    defaultWebSecurityManager.setRememberMeManager(rememberMeManager());
    return defaultWebSecurityManager;
}

.......

// cookie
@Bean
public SimpleCookie simpleCookie(){
    // 设置 cookie 名称,对应前端的 checkbox 的 name = rememberMe
    SimpleCookie simpleCookie = new SimpleCookie("rememberMe");
    simpleCookie.setMaxAge(259200); // cookie 保留时间
    return simpleCookie;
}

// 管理 cookie, 记住我功能
public CookieRememberMeManager rememberMeManager(){
    CookieRememberMeManager cookieRememberMeManager = new CookieRememberMeManager();
    cookieRememberMeManager.setCookie(simpleCookie());
    // cookieRememberMeManager.setCipherKey 用来设置加密的Key, 参数类型byte[],字节数组长度要求16
    cookieRememberMeManager.setCipherKey("EVANNIGHTLY_WAOU".getBytes());
    return cookieRememberMeManager;
}
```

## 2. 前端 rememberMe 控件

```vue
<el-form-item>
	<el-checkbox v-model="rememberMe">记住我</el-checkbox>
</el-form-item>

------

<script>
	data () {
          return {
            loginForm: {
              ......
            },
            rememberMe: false, // 默认不开启记住我功能
            ......
          }
        },
     methods: {
      login() {
        var _this = this
        this.$axios
          .post('/login', {
            username: this.loginForm.username,
            password: this.loginForm.password,
            rememberMe: this.rememberMe
          })
          .then(successResponse => {
            ......
      },
</script>
```

![](https://gitee.com/veal98/images/raw/master/img/20200822100305.png)

## 3. 后端接受参数

**在没有传递 `rememberMe` 参数之前，我们是通过 `@RequestBody` 直接使用 `User` 类接收前端传过来的 JSON 数据的**：

```java
public Result login(@RequestBody User requestUser, HttpSession session) {
```

现在<u>前端传过来的参数 `rememberMe`  并不属于 `User` 类的字段</u>，所以我们换个方式进行接收：

```java
@Controller
public class LoginController {

    @Autowired
    UserService userService;

    @PostMapping(value = "api/login")
    @ResponseBody
    public Result login(@RequestBody Map<String,Object> map, HttpSession session) {
        String username = (String) map.get("username"); // 获取前端传过来的参数
        String password = (String) map.get("password");
        Boolean rememberMe = (Boolean) map.get("rememberMe");

        System.out.println(username + ": " + password);
        System.out.println("rememberMe: " + rememberMe);

        UsernamePasswordToken usernamePasswordToken = new UsernamePasswordToken(username, password);
        usernamePasswordToken.setRememberMe(rememberMe); // 记住我
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

💡 关于 SpringBoot 前后端数据交互可以参考这篇文章：[SpringBoot 实现前后端数据交互、json数据交互、Controller 接收参数的几种常用方式](https://blog.csdn.net/qq_20957669/article/details/89227840)

## 4. 修改拦截器逻辑

用户如果关闭并重新打开浏览器，我们应该对该用户是否使用了记住我功能进行判断：

- **如果该用户使用了记住我功能，那么就不进行拦截，用户可以不用登陆，访问任意界面**。
- 如果该用户并未使用记住我功能，那么拦截器需要对此用户进行拦截，强制再次登录：

```java
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle (HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {

        ......
            
	   Subject subject = SecurityUtils.getSubject();

        System.out.println(subject.isAuthenticated()); // 是否通过认证
        System.out.println(subject.isRemembered()); // 是否开启记住我
        
        // 使用 shiro 验证
      	// 用户如果开启了记住我功能就可以免认证
        if(!subject.isAuthenticated() && !subject.isRemembered()){
            return false;
        }
        return true;
    }

}
```

测试一下，当正常登录时，控制台的输出为：

> true
>
> false

关闭浏览器并重新进入任一界面比如 `index`，不会受到拦截：

> false
>
> true

## 📚 References

- [Vue + Spring Boot 项目实战 — 白卷](https://blog.csdn.net/Neuf_Soleil/article/details/88925013)
- [SpringBoot实现前后端数据交互、json数据交互、Controller接收参数的几种常用方式](https://blog.csdn.net/qq_20957669/article/details/89227840)

