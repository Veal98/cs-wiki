# 👒 使用Shiro实现登出和登录拦截

---

## 1. 登出

### ① 前端

首先在 `NavBar` 中添加一个登出按钮：

```vue
<el-menu-item index="5" class = "logoutButton">
  	<i class="el-icon-switch-button" v-on:click="logout" style="float:right;font-size: 40px;color: #222;padding: 10px"></i>
</el-menu-item>
```

调整样式：

```css
<style scoped>
  .logoutButton{
    position: absolute;
    right: 0.5%;
  }
</style>
```

![](https://gitee.com/veal98/images/raw/master/img/20200822100437.png)

在 methods 中编写 `logout()` 方法：

```js
methods: {
  logout(){
    var _this = this
    this.$axios.get('/logout').then(resp => {
      if(resp.data.code == 200){
        this.$alert('退出成功', '提示', {
          confirmButtonText: '确定'
        })
        // 收到后端返回的成功代码时，触发 store 中的 logout() 方法
        _this.$store.commit('logout')
        _this.$router.replace('/login')
      }
    })  
  }
}
```

在 `store` 中定义 `logout` 方法：

```js
mutations: {
    // 触发这个方法时可以为我们的用户对象赋值
    login(state, user) {
      ......
    },
    // 触发这个方法时可以移除该用户
    logout(state){
      state.user = []
      window.localStorage.removeItem("user")
    }
}
```

OK，这样登出功能就完成了

### ② 后端 LogoutController

```java
@Controller
public class LogoutController {

    @ResponseBody
    @GetMapping("api/logout")
    public Result logout(){
        Subject subject = SecurityUtils.getSubject();
        subject.logout();
        System.out.println("退出登录");
        return new Result(200);
    }
}
```

## 2. 使用 Shiro 实现登录拦截

之前实现登录拦截的时候，我们采用的方法是前端实现拦截器，判断的依据是 `localStorage` 中是否存有用户信息。这种信息我们完全可以伪造，比如在控制台输入：

```js
window.localStorage.setItem('user', JSON.stringify({"username":"hello", "password":"123"}));
```

的命令来绕过前端的 “全局前置守卫”（`router.beforeEach`）。

输入完毕后，我们无须登录，可以直接访问任意 url。

所以**要想真正实现登录拦截，必须在后端也判断用户是否登录以及登录的是哪个用户，而这就需要前端向后端发送用户信息**。

### ① 认证方案

先说最简单的认证方法，即前端在每次请求时都加上用户名和密码，交由后端验证。这种方法的弊端有两个：

- 需要频繁查询数据库，导致服务器压力较大
- 安全性，如果信息被截取，攻击者就可以 **一直** 利用用户名密码登录（注意不是因为明文不安全，是由于无法控制时效性）

为了**在某种程度上**解决上述两个问题，有两种改进的方案 —— session 与 token。

#### ⅠSession 会话

利用 Session，我们可以**管理用户状态**，比如控制会话存在时间，在会话中保存属性等。其作用方式**通常**如下：

- 服务器接收到第一个请求时，生成 Session 对象，并通过响应头告诉客户端在 cookie 中放入 sessionId
- 客户端之后发送请求时，会带上包含 sessionId 的 cookie
- 服务器通过 sessionId 获取 session ，进而得到当前用户的状态（是否登录）等信息

也就是说，**客户端只需要在登录的时候发送一次用户名密码，<u>此后只需要在发送请求时带上 sessionId</u>，服务器就可以验证用户是否登录了**。

session 存储在内存中，在用户量较少时访问效率较高，但如果一个服务器保存了几十几百万个 session 就十分难顶了。

<u>🚨 **Shiro 的安全管理实际上是基于 Session 实现的，所以我们没得选，用 Session 方案就可以了。**</u>

#### Ⅱ Token 令牌

虽然 session 能够比较全面地管理用户状态，但这种方式毕竟占用了较多服务器资源，所以有人想出了一种无需在服务器端保存用户状态（称为 **“无状态”**）的方案，即使用 **token**（令牌）来做验证。

简单来说，一个真正的 token 本身是携带了一些信息的，比如用户 id、过期时间等，这些信息通过**签名算法**防止伪造，也可以使用加密算法进一步提高安全性，但一般没有人会在 token 里存储密码，所以不加密也无所谓，反正被截获了结果都一样。（一般会用 base64 编个码，方便传输）

在 web 领域最常见的 token 解决方案是 **JWT**（JSON Web Token），其具体实现可以参照官方文档，这里不再赘述。

token 的安全性类似 session 方案，与明文密码的差异主要在于过期时间。其作用流程也与 session 类似：

- 用户使用用户名密码登录，服务器验证通过后，根据用户名（或用户 id 等），按照预先设置的算法生成 token，其中也可以封装其它信息，并将 token 返回给客户端（可以设置到客户端的 cookie 中，也可以作为 response body）
- 客户端接收到 token，并在之后发送请求时带上它（利用 cookie、作为请求头或作为参数均可）
- 服务器对 token 进行解密、验证

最后再强调一下：⭐ **token 的优势是无需服务器存储！！！**

不要再犯把 token 存储到 session 或是数据库中这样的错误了。

### ② 客户端存储方案（cookie、localStorage、sessionStorage）

接下来说一下认证信息在 **客户端** 存储的方式。首先明确，无论是明文用户名密码，还是 sessionId 和 token，都可以用三种方式存储，即 cookie、localStorage 和 sessionStorage。

但 cookie 和 local/session Storage 分工又有所不同，cookie 可以作为传递的参数，并可通过后端进行控制，local/session Storage 则主要用于在客户端中保存数据，其传输需要借助 cookie 或其它方式完成。

下面是三种方式的对比（参考文章 [JS 详解 Cookie、 LocalStorage 与 SessionStorage](https://www.cnblogs.com/minigrasshopper/p/8064367.html) ）

| 特性     | cookie                                                       | localStorage                                       | sessionStorage                               |
| -------- | ------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------------- |
| 生命周期 | 一般由服务器生成，可设置失效时间。如果在浏览器端生成cookie，默认是关闭浏览器后失效 | 除非被清除，否则永久保存                           | 仅在当前会话下有效，关闭页面或浏览器后被清除 |
| 数据大小 | 4K左右                                                       | 一般为5MB                                          | 一般为5MB                                    |
| 通信方式 | 每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题 | 仅在客户端（即浏览器）中保存，不参与和服务器的通信 | 同 localStorage                              |

通常来说，在可以使用 cookie 的场景下，**作为验证用途进行传输的用户名密码、sessionId、token 直接放在 cookie 里即可。而后端传来的其它信息则可以根据需要放在 local/session Storage 中，作为全局变量之类进行处理。**

### ③ 具体代码

上面说过前端实现的拦截很容易被绕过。要想实现靠谱的拦截，必须由后端验证用户登录状态。这个思路并不难，就是前端带上 sesisonId 发送请求交由后端 认证，同时注意前后端分离情况下的跨域问题。

默认的情况下，跨域的 cookie 是被禁止的，后端不能设置，前端也不能发送，所以两边都要设置。

#### Ⅰ 后端登录拦截

首先编写后端拦截器 `intercepter/LoginInterceptor`，继承 `HandlerIntercepter`，重写 `preHandle` 方法：

🚨 前后端分离项目中，由于跨域，会导致复杂请求，即此时普通的 GET、POST 等请求会变成 **preflighted request**，这样会导致在GET／POST等请求之前会先发一个 **OPTIONS请求**，但 OPTIONS 请求并不带 Shiro 的 'Authorization' 字段（Shiro 的 Session），即 OPTIONS 请求不能通过 Shiro 验证，会返回未认证的信息。

💡 解决方法：在拦截器中放行 OPTIONS 请求

```java
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle (HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {

        // 跨域情况下前端会先发出一个 options 请求试探
        // 放行 options 请求，否则无法让前端带上自定义的 header 信息，导致 sessionID 改变，shiro 验证失败
        if(HttpMethod.OPTIONS.toString().equals(httpServletRequest.getMethod())){
            httpServletResponse.setStatus(HttpStatus.NO_CONTENT.value());
        }

        Subject subject = SecurityUtils.getSubject();
        // 使用 shiro 验证
        if(!subject.isAuthenticated()){
            return false;
        }
        return true;
    }

}
```

之后，为了允许跨域的 cookie，我们需要在配置类 `MyWebConfigurer` 做一些修改，主要是配置拦截路径以及处理跨域问题：

```java
@Configuration
public class MyWebConfig implements WebMvcConfigurer {

    @Bean
    public LoginInterceptor getLoginIntercepter(){
        return new LoginInterceptor();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 所有请求都允许跨域
        // 允许跨域使用 cookie 的情况下，allowedOrigins() 不能使用通配符 *，这也是出于安全上的考虑。
        registry.addMapping("/**")
                .allowCredentials(true)
                .allowedOrigins("*")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
	
    // 配置拦截路径
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(getLoginIntercepter())
                .addPathPatterns("/**")
                .excludePathPatterns("/api/login")
                .excludePathPatterns("/api/logout")
                .excludePathPatterns("/api/register");
    }

}

```

#### Ⅱ 前端修改全局前置守卫

为了让前端能够带上 cookie，我们需要通过 axios 主动开启 `withCredentials` 功能，即在 `main.js` 中添加一行

```js
axios.defaults.withCredentials = true
```

这样，前端每次发送请求时就会带上 sessionId，shiro 就可以通过 sessionId 获取登录状态并执行是否登录的判断。

<u>现在还存在一个问题，即后端接口的拦截是实现了，但页面的拦截并没有实现，仍然可以通过伪造参数，绕过前端的路由限制，访问本来需要登录才能访问的页面</u>。为了解决这个问题，我们可以修改 `router.beforeEach` 方法：

```js
// 为了让前端能够带上 cookie，我们需要通过 axios 主动开启 withCredentials 功能
axios.defaults.withCredentials = true

// router.beforeEach 在访问每一个路由前调用
router.beforeEach((to, from, next) => {
  // 判断该路径是否需要进行拦截
    if (to.meta.requireAuth) {
      if (store.state.user) { // 判断 store 里有没有存储 user 的信息
        // 每访问一个页面就向后端发送一个请求，目的是经由厚度按拦截器验证服务器端的登录状态，防止伪造参数绕过全局前置守卫
        axios.get('/authentication').then(resp => {
          if(resp.data)
            next() // 放行
          else{
            // 否则跳转到登录界面, 并存储访问的页面路径（以便在登录后跳转到访问页）
            next({
              path: "login",
              query:{
                redirect: to.fullPath
              }
            })
          }
        })
      } 
      else {
        // 跳转到登录页面，并存储访问的页面路径（以便在登录后跳转到访问页）
        next({
          path: 'login',
          query: {redirect: to.fullPath}
        })
      }
    } else {
      next()
    }
  }
)
```

即**每访问一个页面就向后端发送一个请求，目的是经由拦截器验证服务器端的登录状态**，防止伪造参数情况的发生。后端这个接口可以暂时写成空的：

```java
@Controller
public class AuthenticationController {

    @ResponseBody
    @GetMapping("api/authentication")
    public String authentication(){
        System.out.println("身份认证");
        return "身份认证";
    }
}
```

## 📚 References

- [Vue + Spring Boot 项目实战 — 白卷](https://blog.csdn.net/Neuf_Soleil/article/details/88925013)