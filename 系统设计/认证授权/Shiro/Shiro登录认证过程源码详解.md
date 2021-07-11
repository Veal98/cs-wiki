# 📋 Shiro 登录认证过程源码详解

---

## 1. Shiro 获取前端传值

先给出登录的代码：

```java
@RestController
public class LoginController {


    @CrossOrigin
    @PostMapping(value = "api/login")
    public String login(@RequestBody UserInfo requestUserInfo) {
        // 获取前端传值
        String username = requestUserInfo.getUsername();
        String password = requestUserInfo.getPassword();

        UsernamePasswordToken usernamePasswordToken = new UsernamePasswordToken(username, password);
        Subject subject = SecurityUtils.getSubject();
        if (usernamePasswordToken == null) {
            return "账号或密码错误";
        } else {
            subject.login(usernamePasswordToken);
            return "登录成功";
        }
    }
}
```

可以看到首先获取到了前端传值 username 和 password ，为了接下来的认证过程，我们需要获取 Subject 对象，也就是代表当前登录用户，并且要将 username 和 password 两个变量设置到 `UsernamePasswordToken` 对象的 token 中， 调用 `SecurityUtils.getSubject().login(token)` 方法，将 token 传入。

点进 `login `方法，发现是 Subject 接口的方法：

<img src="https://gitee.com/veal98/images/raw/master/img/20200930195637.png" style="zoom:67%;" />

💡 我们来看看该接口方法的到底在哪里实现了（在 `login` 方法上右键）：

<img src="https://gitee.com/veal98/images/raw/master/img/20200930210255.png" style="zoom: 67%;" />

实际上是进入了 `Subject` 接口的实现类 `DelegatingSubject` 中：

```java
public class DelegatingSubject implements Subject {
    
    protected transient SecurityManager securityManager;
    
    ..........
        
	public void login(AuthenticationToken token) throws AuthenticationException {
        this.clearRunAsIdentitiesInternal();
        Subject subject = this.securityManager.login(this, token);
        String host = null;
        PrincipalCollection principals;
        if (subject instanceof DelegatingSubject) {
            DelegatingSubject delegating = (DelegatingSubject)subject;
            principals = delegating.principals;
            host = delegating.host;
        } else {
            principals = subject.getPrincipals();
        }

        if (principals != null && !principals.isEmpty()) {
            this.principals = principals;
            this.authenticated = true;
            if (token instanceof HostAuthenticationToken) {
                host = ((HostAuthenticationToken)token).getHost();
            }

            if (host != null) {
                this.host = host;
            }

            Session session = subject.getSession(false);
            if (session != null) {
                this.session = this.decorate(session);
            } else {
                this.session = null;
            }

        } else {
            String msg = "Principals returned from securityManager.login( token ) returned a null or empty value.  This value must be non null and populated with one or more elements.";
            throw new IllegalStateException(msg);
        }
    }
    
}
```

注意这行 `Subject subject = this.securityManager.login(this, token);` 显然，主要还是用到了 `SecurityManager ` 安全管理器。点进 `login` 之后仍然是一个接口方法：

<img src="https://gitee.com/veal98/images/raw/master/img/20200930210534.png" style="zoom:67%;" />

按照上面同样的操作，进入该方法的具体实现：

 `SecurityManager ` 的子类 `DefaultSecurityManager` 实现了其 `login` 方法（虚线表示实现接口，实线表示继承）：

![](https://gitee.com/veal98/images/raw/master/img/20200930202824.png)

```java
public class DefaultSecurityManager extends SessionsSecurityManager {
    
    ..........
        
    public Subject login(Subject subject, AuthenticationToken token) throws AuthenticationException {
        AuthenticationInfo info;
        try {
            info = this.authenticate(token);
        } catch (AuthenticationException var7) {
            AuthenticationException ae = var7;

            try {
                this.onFailedLogin(token, ae, subject);
            } catch (Exception var6) {
                if (log.isInfoEnabled()) {
                    log.info("onFailedLogin method threw an exception.  Logging and propagating original AuthenticationException.", var6);
                }
            }

            throw var7;
        }

        Subject loggedIn = this.createSubject(token, info, subject);
        this.onSuccessfulLogin(token, info, loggedIn);
        return loggedIn;
    }
    
}
```

注意这行 `info = this.authenticate(token)`，**定义了 `AuthenticationInfo` 对象来接受从 `Realm` 传来的认证信息 token**。点进 `authenticate` 方法：

```java
public abstract class AuthenticatingSecurityManager extends RealmSecurityManager {	
    
    private Authenticator authenticator = new ModularRealmAuthenticator();

    public Authenticator getAuthenticator() {
        return this.authenticator;
    }
    
    ..........
        
    public AuthenticationInfo authenticate(AuthenticationToken token) throws AuthenticationException {
        return this.authenticator.authenticate(token);
    }
    
}
```

利用一个 `ModularRealmAuthenticator` 类型的 `authenticator ` 来实现：

```java
public class ModularRealmAuthenticator extends AbstractAuthenticator {
    
    ..........
        
    protected AuthenticationInfo doAuthenticate(AuthenticationToken authenticationToken) throws AuthenticationException {
        this.assertRealmsConfigured(); // 判断 realm 是否存在
        Collection<Realm> realms = this.getRealms();
        return realms.size() == 1 ? this.doSingleRealmAuthentication((Realm)realms.iterator().next(), authenticationToken) : this.doMultiRealmAuthentication(realms, authenticationToken);
    }
    
}
```

在这里才是刚才上面的那个 `authenticator` 方法的真正实现，从上述代码可以看出，根据 realms 集合是单个还是多个做了分别处理，我们分别点进去看看：

<img src="https://gitee.com/veal98/images/raw/master/img/20200930202141.png" style="zoom: 50%;" />

<img src="https://gitee.com/veal98/images/raw/master/img/20200930202247.png" style="zoom:50%;" />

显然，殊途同归，最终形式都是这样：

```java
AuthenticationInfo info = realm.getAuthenticationInfo(token);
```

点进 `getAuthenticationInfo`  方法，发现属于 Realm 接口：

<img src="https://gitee.com/veal98/images/raw/master/img/20200930205403.png" style="zoom:50%;" />

按照前面说过的同样的方法查看该接口方法的具体实现：

**`Realm` 的子类 `AuthenticatingRealm` 实现了 `getAuthenticationInfo` 方法**：

<img src="https://gitee.com/veal98/images/raw/master/img/20200930211131.png" style="zoom:55%;" />

```java
public abstract class AuthenticatingRealm extends CachingRealm implements Initializable {
    
    ..........
        
    public final AuthenticationInfo getAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        AuthenticationInfo info = this.getCachedAuthenticationInfo(token);
        if (info == null) {
            info = this.doGetAuthenticationInfo(token); // 调用自定义 Realm 的 doGetAuthenticationInfo 方法
            log.debug("Looked up AuthenticationInfo [{}] from doGetAuthenticationInfo", info);
            if (token != null && info != null) {
                this.cacheAuthenticationInfoIfPossible(token, info);
            }
        } else {
            log.debug("Using cached authentication info [{}] to perform credentials matching.", info);
        }

        if (info != null) {
            this.assertCredentialsMatch(token, info);
        } else {
            log.debug("No AuthenticationInfo found for submitted AuthenticationToken [{}].  Returning null.", token);
        }

        return info;
    }
 
}
```

注意，重点来了 `info = this.doGetAuthenticationInfo(token)`，我们查看该方法的具体实现：

<img src="https://gitee.com/veal98/images/raw/master/img/20200930211318.png" style="zoom: 67%;" />

其中就有我们自定义的 Realm。调用我们自定义 Realm 的 `getAuthenticationInfo` 方法（获取身份认证信息）：

```java
public class MyRealm extends AuthorizingRealm {

    @Autowired
    UserInfoService userInfoService;
    
	...........	

    // 获取身份认证信息（用于判断该信息是否存在于数据库中)
    // authenticationToken 主体传过来的认证信息
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        // 从主体传过来的认证信息中，获取用户名
        String username = authenticationToken.getPrincipal().toString();
        // 通过用户名获取数据库中的密码和盐
        UserInfo userInfo = userInfoService.getByUsername(username);
        String password = userInfo.getPassword();
        String salt = userInfo.getSalt();

        // 将从数据库中查到的信息封装近 SimpleAuthenticationInfo
        SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(
                username, // 用户名
                password, // 密码
                ByteSource.Util.bytes(salt), // salt
                getName() // realm name
        );
        return simpleAuthenticationInfo;
    }
}
```

所以 ，上边的 `doGetAuthorizationInfo` 是执行的我们自定义 realm 中重写的 `doGetAuthorizationInfo` 这个方法。这个方法就会从数据库中读取我们所需要的信息，最后封装成 `SimpleAuthenticationInfo` 返回去。

OK，现在 Shiro 获取到用户信息了，接下来就是 Shiro 怎么去进行认证

## 2. Shiro 认证用户信息

我们返回去看 `AuthenticatingRealm`：

<img src="https://gitee.com/veal98/images/raw/master/img/20200930205829.png" style="zoom: 50%;" />

进入 `assertCredentialsMatch` 方法进行密码匹配：

```java
protected void assertCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) throws AuthenticationException {
    // 首先获取一个CredentialsMatcher对象，译为凭证匹配器，这个类的主要作用就是将用户输入的密码以某种计算加密。
    CredentialsMatcher cm = this.getCredentialsMatcher();
    if (cm != null) {
        if (!cm.doCredentialsMatch(token, info)) {
            String msg = "Submitted credentials for token [" + token + "] did not match the expected credentials.";
            throw new IncorrectCredentialsException(msg);
        }
    } else {
        throw new AuthenticationException("A CredentialsMatcher must be configured in order to verify credentials during authentication.  If you do not wish for credentials to be examined, you can configure an " + AllowAllCredentialsMatcher.class.getName() + " instance.");
    }
}
```

再看一下上述代码中的 `cm.doCredentialsMatch(token,info)`，点击去之后是一个接口：

```java
public interface CredentialsMatcher {
    boolean doCredentialsMatch(AuthenticationToken var1, AuthenticationInfo var2);
}
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200930210125.png" style="zoom:50%;" />

```java
public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
    Object tokenHashedCredentials = this.hashProvidedCredentials(token, info);
    Object accountCredentials = this.getCredentials(info);
    return this.equals(tokenHashedCredentials, accountCredentials);
}
```

利用 `equals` 方法对前端传过来的 token 中加密的密码和从数据库中取出来的 info 中的密码进行对比，如果认证相同就返回 true，失败就返回 false，并抛出 `AuthenticationException`，将 info 返回到 `DefaultSecurityManager` 中，到此认证过程结束。

## 📚 References

- [shiro 登录认证过程讲解](https://blog.csdn.net/caoyang0105/article/details/82769293?biz_id=102&utm_term=shiro登录认证原理&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-0-82769293&spm=1018.2118.3001.4187)
- [shiro 登录验证原理](https://blog.csdn.net/csdn13257081409/article/details/105808986/?biz_id=102&utm_term=shiro%E7%99%BB%E5%BD%95%E8%AE%A4%E8%AF%81%E5%8E%9F%E7%90%86&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-3-105808986&spm=1018.2118.3001.4187)

