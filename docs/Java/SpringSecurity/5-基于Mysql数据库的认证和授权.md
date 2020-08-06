# 🥊 基于 Mysql 数据库的身份认证和角色授权

---

只需要添加MySQL数据库的驱动包以及配置好数据源和JPA，代码不必做任何改变，就可以将基于内存数据库的身份认证和角色授权的代码转换为 MySQL 数据库的存储方式

## 1. 添加 MySQL 依赖

在` pom.xml `文件中去掉 **hsqldb** 的依赖，然后添加 **mysql** 的依赖：

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>
```

注意 JPA 中 Hibernate 的版本 与 MySQL 版本对应

<img src="https://gitee.com/veal98/images/raw/master/img/20200806223003.png" style="zoom:80%;" />

## 2. 创建数据库

创建数据库 spring-security 就可以了，啥也不用做

## 3. 添加配置信息

在 `application.properties` 文件中添加配置信息：

```properties
spring.datasource.url = jdbc:mysql://localhost:3306/spring-security
spring.datasource.username = root
spring.datasource.password = root
spring.datasource.driverClassName = com.mysql.jdbc.Driver

# Specify the DBMS  
spring.jpa.database = MYSQL
# Show or not log for each sql query  
spring.jpa.show-sql = true
# Hibernate ddl auto (create, create-drop, update)  
spring.jpa.hibernate.ddl-auto = create-drop
```

## 4. 测试

启动应用程序，成功的话可以看到数据库已经自动添加了以下数据：

![](https://gitee.com/veal98/images/raw/master/img/20200806223407.png)

按照之前的流程测试下，结果是一样的。至此，我们并没有做过多的编码，就轻松的从内存数据库转换到MySQL数据库，这就是框架给我们提供的便利。

## 5. 数据库密码加密保存

到这里基本的流程都是没有问题的，但是我们发现数据库的密码都是明文显示的，，那么数据库的密码怎么加密保存呢？其实也很简单，**在初始化用户信息的时候，就进行加密即可**，具体的操作如下：

### ① 修改 DataInit

修改初始化用户信息类 `DataInit`，注入`PasswordEncoder`，使用 `PasswordEncoder` 的 `encode `方法对密码进行加密：

```java
@Service
public class DataInit {

    @Autowired 
    private UserInfoRepository userInfoRepository;

    @Autowired 
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void dataInit() {

        UserInfo admin = new UserInfo();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("123"));
        admin.setRole(Role.admin);
        userInfoRepository.save(admin);


        UserInfo user = new UserInfo();
        user.setUsername("user");
        user.setPassword(passwordEncoder.encode("123"));
        user.setRole(Role.normal);
        userInfoRepository.save(user);
    }

}
```

### ② 修改 CustomUserDetailService

在添加用户的时候，已经加密了，那么在 `loadUserByUsername `方法中返回的 `UserDetails` 就不需要再加密了，修改为如下：

```java
@Service
public class CustomUserDetailService implements UserDetailsService{
    @Autowired
    private UserInfoService userInfoService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("CustomUserDetailService.loadUserByUsername()");
        //通过username获取用户信息
        UserInfo userInfo = userInfoService.findByUsername(username);
        if(userInfo == null) {
            throw new UsernameNotFoundException("not found");
        }

        // 定义权限列表.
        List<GrantedAuthority> authorities = new ArrayList<>();
        // 用户所拥有的权限 注意：必须"ROLE_"开头
        authorities.add(new SimpleGrantedAuthority("ROLE_"+userInfo.getRole().name()));

        User userDetails = new User(userInfo.getUsername(),userInfo.getPassword(),authorities);
        return userDetails;
    }

}
```

### ③ 测试

 启动应用，查看数据库的用户信息：

![](https://gitee.com/veal98/images/raw/master/img/20200806223801.png)

此时看到的数据库中的密码已经是加密的了，访问下如下的地址：

[http://127.0.0.1:8080/helloUser](http://127.0.0.1:8080/helloUser)

输入账号 user/123 看是否可以正常登录吧。

## 📚 References

- [林祥纤 - Spring Boot+Spring Security 系列](https://www.iteye.com/blog/412887952-qq-com-2441544)