#  Shiro 实现基于 URL 的动态权限控制

---

## 1. 前言

所谓基于 URL 的动态权限控制就是：**访问 URL 时进行权限匹配**，如果没有权限直接跳到相应的错误页面

之所以要实现这个粒度的访问控制，是因为仅仅对菜单（页面）进行控制是不够的。

举个例子，假设我们不想让 “内容管理员” 角色拥有查看用户列表的权限，简单的让这个角色无法加载用户信息组件是不完美的。**如果该角色知道后台展示用户列表的接口，该角色仍然可以发送请求并获取到所有的用户信息**

显然，涉及到功能级别的权限控制，就需要权限表 `admin_permission` 以及角色-权限信息表 `admin_role_permission`了：

- 权限表 `admin_permission`

  ![](https://gitee.com/veal98/images/raw/master/img/20200828112947.png)

  表中的 `url` 字段是即权限对应的接口，是实现功能控制的关键

- 角色-权限信息表 `admin_role_permission`

  ![](https://gitee.com/veal98/images/raw/master/img/20200828113009.png)

## 2. Service

在上一章实现动态访问后台菜单的时候，我们并没有使用 `AdminRolePermissionService` 和 `AdminPermissionService`，现在来实现它们 👇

### ① AdminRolePermissionService

`AdminRolePermissionService`：实现根据角色 id 查询该角色对应的所有的角色-权限关系 `AdminRolePermission` ：

```java
@Service
public class AdminRolePermissionService {

    @Autowired
    AdminRolePermissionDAO adminRolePermissionDAO;
	
    // 根据角色 id 查询该角色对应的所有的角色-权限关系 
    List<AdminRolePermission> findAllByRid(Integer rid) {
        return adminRolePermissionDAO.findAllByRid(rid);
    }
	
    // 一个角色对应多个权限
    List<AdminRolePermission> findAllByRids(List<Integer> rids){
        return adminRolePermissionDAO.findAllByRidIn(rids);
    }
}
```

### ② AdminPermissionService

`AdminPermissionService` 主要实现查询该用户的所有权限信息以及这些权限能够访问的后端方法接口：

```java
@Service
public class AdminPermissionService {
    @Autowired
    AdminPermissionDAO adminPermissionDAO;
    @Autowired
    AdminUserRoleService adminUserRoleService;
    @Autowired
    AdminRoleService adminRoleService;
    @Autowired
    AdminRolePermissionService adminRolePermissionService;
    @Autowired
    UserService userService;

    public List<AdminPermission> list() {
        return adminPermissionDAO.findAll();
    }

    /**
     * 根据角色 id 查询出该用户对应的详细权限信息 AdminPermission
     * @param rid
     * @return AdminPermission
     */
    public List<AdminPermission> listPermsByRoleId(int rid) {
        List<Integer> pids = new ArrayList<>();
        // 查询出该用户的用户-权限关系
        List<AdminRolePermission> adminRolePermissions = adminRolePermissionService.findAllByRid(rid);
        for(AdminRolePermission adminRolePermission: adminRolePermissions){
            pids.add(adminRolePermission.getPid()); // 获取用户-权限表中的权限 id
        }

        return adminPermissionDAO.findAllById(pids); // 根据权限 id 查询详细权限信息
    }

    /**
     * 根据用户 username 查询出该用户能够访问的后端接口权限
     * @param username
     * @return
     */
    public Set<String> listPermissionURLsByUser(String username) {
        List<Integer> rids = new ArrayList<>();
        // 查询出该用户的详细角色信息 AdminRole
        List<AdminRole> adminRoles = adminRoleService.listRolesByUser(username);
        for(AdminRole adminRole: adminRoles){
            rids.add(adminRole.getId()); // 获取该用户对应的角色 id
        }
        List<Integer> pids = new ArrayList<>();
        // 查询出该用户所拥有的角色对应的角色-权限关系
        List<AdminRolePermission> adminRolePermissions = adminRolePermissionService.findAllByRids(rids);
        for(AdminRolePermission adminRolePermission: adminRolePermissions){
            pids.add(adminRolePermission.getPid()); // 获取该角色拥有的权限 id
        }

        // 根据权限 id 获取详细权限信息
        List<AdminPermission> adminPermissions = adminPermissionDAO.findAllByIdIn(pids);
        Set<String> URLs = new LinkedHashSet<>();
        for(AdminPermission adminPermission: adminPermissions){
            URLs.add(adminPermission.getUrl()); // 获取该权限对应的后端方法接口
        }

        return URLs;
    }
    
    /**
     * 判断用户请求接口的是否在权限列表中。如果没有对应权限，说明不需要维护
     * @param requestAPI API requested by client
     * @return true when requestAPI is found in the DB
     */
    public boolean needFilter(String requestAPI) {
        List<AdminPermission> ps = adminPermissionDAO.findAll();
        for (AdminPermission p: ps) {
            // match prefix
            if (requestAPI.startsWith(p.getUrl())) {
                return true;
            }
        }
        return false;
    }
}
```

## 3. Controller

可以在 `Controller` 中编写一个查询所有用户接口 `/api/admin/user`：

```java
// 查询所有用户
@GetMapping("/api/admin/user")
@ResponseBody
public List<User> listUsers() throws Exception {
    return userService.list();
}
```

根据角色-权限关系表，**内容管理员是没有权限访问该接口的**

## 4. Shiro 自定义过滤器

之前我们在做登录拦截的时候使用了拦截器，即 Interceptor。由于 Shiro 的权限机制要靠它自身提供的过滤器实现，所以我们需要弃用之前的拦截器（上一章节已经删除过了），自定义一个基于 URL 的过滤器。

新建一个 package 命名为 `filter`，编写 `URLPathMatchingFilter` 类继承 `PathMatchingFilter`，实现 `onPreHandler` 方法：

```java
public class URLPathMatchingFilter extends PathMatchingFilter {
    @Autowired
    AdminPermissionService adminPermissionService;

    @Override
    protected boolean onPreHandle(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        // 放行 options 请求
        if (HttpMethod.OPTIONS.toString().equals((httpServletRequest).getMethod())) {
            httpServletResponse.setStatus(HttpStatus.NO_CONTENT.value());
            return true;
        }

        if (null==adminPermissionService) {
            adminPermissionService = SpringContextUtils.getContext().getBean(AdminPermissionService.class);
        }

        String requestAPI = getPathWithinApplication(request);
        System.out.println("访问接口：" + requestAPI);

        Subject subject = SecurityUtils.getSubject();

        if (!subject.isAuthenticated()) {
            System.out.println("未登录用户尝试访问需要登录的接口");
            return false;
        }

        // 判断访问接口是否需要过滤（该接口是否需要一定的权限才能访问）
        boolean needFilter = adminPermissionService.needFilter(requestAPI);
        if (!needFilter) {
            System.out.println("接口：" + requestAPI + "无需权限");
            return true;
        } else {
            System.out.println("验证访问权限：" + requestAPI);
            // 判断当前用户是否有相应权限
            boolean hasPermission = false;
            String username = subject.getPrincipal().toString();
            Set<String> permissionAPIs = adminPermissionService.listPermissionURLsByUser(username);
            for (String api : permissionAPIs) {
                // 匹配前缀
                if (requestAPI.startsWith(api)) {
                    hasPermission = true;
                    break;
                }
            }

            if (hasPermission) {
                System.out.println("用户：" + username + "访问了：" + requestAPI + "接口");
                return true;
            } else {
                System.out.println("当前用户没有权限访问接口" + requestAPI);
                return false;
            }
        }
    }
}
```

这里有一段代码解释一下：

```java
if (null==adminPermissionService) {
    adminPermissionService = SpringContextUtils.getContext().getBean(AdminPermissionService.class);
}
```

🚨 在 Shiro 的配置文件中，**不能把自定义的过滤器用 `@Bean` 被 Spring 管理起来**。 原因是 <u>Shiro 存在 bug, 我们自定义的 `URLPathMatchingFilter` 是过滤器，`ShiroFilterFactoryBean` 也是过滤器，当他们都出现的时候，默认的 `anno`,`authc` 等过滤器就失效了。所以不能把他声明为 `@Bean`。</u>

![](https://gitee.com/veal98/images/raw/master/img/20200828114508.png)

因此，我们无法在 `URLPathMatchingFilter` 中使用 `@Autowired` 注入 `AdminPermissionService` 类，所以**需要借助一个工具类利用 Spring 应用上下文获取 `AdminPermissionService` 的实例** 👇

工具类放在 `utils` 包中，代码如下：

```java
@Component
public class SpringContextUtils implements ApplicationContextAware {
    private static ApplicationContext context;

    public void setApplicationContext(ApplicationContext context) throws BeansException {
        SpringContextUtils.context = context;
    }

    public static ApplicationContext getContext() {
        return context;
    }
}
```

## 4. 修改 Shiro 配置类

接下来在配置类 `ShiroConfig` 中增加获取过滤器的方法，注意这里不能使用 `@Bean` ：

```java
public URLPathMatchingFilter getURLPathMatchingFilter() {
    return new URLPathMatchingFilter();
}
```

然后修改 `ShiroFilterFactoryBean shiroFilter` 方法如下：

```java
// 过滤器
@Bean
public ShiroFilterFactoryBean shiroFilter(SecurityManager securityManager) {
    ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
    shiroFilterFactoryBean.setSecurityManager(securityManager);

    Map<String, String > filterChainDefinitionMap = new LinkedHashMap<String, String>();
    Map<String, Filter> customizedFilter = new HashMap<>();

    // 设置自定义过滤器名称为 url
    customizedFilter.put("url", getURLPathMatchingFilter());

    // 对下列接口的访问启用自定义拦截（url 规则），即执行 URLPathMatchingFilter 中定义的过滤方法
    filterChainDefinitionMap.put("/api/admin/**", "url");
    
    // authc 即 authentication，shiro 自带的过滤器
    // 除了它以外，常用的还有 anon（可匿名访问）、roles（需要角色）、perms（需要权限）等
    filterChainDefinitionMap.put("/api/authentication", "authc");
    
    // 启用自定义过滤器
    shiroFilterFactoryBean.setFilters(customizedFilter);
    
    shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
    
    return shiroFilterFactoryBean;
}
```

## 6. 在 Realm 中配置授权信息

在 `MyRealm` 中重写获取授权信息的方法如下：

```java
public class MyRealm extends AuthorizingRealm {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminPermissionService adminPermissionService;

    // 获取授权信息
    // PrincipalCollection 身份集合
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        // 获取当前用户的所有权限
        String username = principalCollection.getPrimaryPrincipal().toString();
        Set<String> permissions = adminPermissionService.listPermissionURLsByUser(username);

        // 将权限放入授权信息中
        SimpleAuthorizationInfo s = new SimpleAuthorizationInfo();
        s.setStringPermissions(permissions);
        return s;
    }


    ......
}
```

## 7. 处理未授权异常的类

新建一个 `exception/DefaultExceptionHandler` 用于处理未授权异常：

```java
/**
 * 权限认证失败
 */
@ControllerAdvice
public class DefaultExceptionHandler {
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public Result handleAuthorizationException(UnauthorizedException e) {
        return new Result(400);
    }
}
```

## 8. 测试

启动项目测试，用内容管理员账号登录，访问 [http://localhost:8082/api/admin/user](http://localhost:8082/api/admin/user)，后端会显示无权限。

用系统管理员账号登录并访问 [http://localhost:8082/api/admin/user](http://localhost:8082/api/admin/user)，该用户拥有这个 url 的权限，所以能够访问：

![](https://gitee.com/veal98/images/raw/master/img/20200828122712.png)

## 📚 References

- [Vue + Spring Boot 项目实战 — 白卷](https://blog.csdn.net/Neuf_Soleil/article/details/88925013)





