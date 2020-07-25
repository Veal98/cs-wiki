# 📠 SpringBoot 与数据访问

---

## 1. SpringData 简介

对于数据访问层，无论是 SQL (关系型数据库) 还是 NoSql (非关系型数据库)，Spring Boot 底层都是采用 **Spring Data** 的方式进行统一处理。

Spring Boot 底层都是采用 Spring Data 的方式进行统一处理各种数据库，Spring Data 也是 Spring 中与 Spring Boot、Spring Cloud 等齐名的知名项目。

Sping Data 官网：[https://spring.io/projects/spring-data](https://spring.io/projects/spring-data)

## 2. 整合 JDBC

### ① 数据源 DataSource

新建一个项目，导入以下模块：

![](https://gitee.com/veal98/images/raw/master/img/20200709122710.png)

项目建好之后，发现自动帮我们导入了如下的启动器：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

编写 yaml 配置文件连接数据库 `springboot-demo`：

```yaml
spring:
  datasource:
    username: root
    password: root
    # ?serverTimezone=UTC解决时区的报错
    url: jdbc:mysql://localhost:3306/springboot-demo?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8
    driver-class-name: com.mysql.cj.jdbc.Driver
```

配置完这一些东西后，我们就可以直接去使用了，因为 SpringBoot 已经默认帮我们进行了自动配置。去测试类测试一下：

```java
@SpringBootTest
class JdbcDemoApplicationTests {

    @Autowired
    DataSource dataSource;

    @Test
    void contextLoads() throws SQLException {
        // 看一下默认数据源
        System.out.println(dataSource.getClass());
        // 获得连接
        Connection connection = dataSource.getConnection();
        System.out.println(connection);
        // 关闭连接
        connection.close();
    }

}
```

![](https://gitee.com/veal98/images/raw/master/img/20200709123650.png)

可以看到他默认给我们配置的数据源为 : `class com.zaxxer.hikari.HikariDataSource` ， 我们并没有手动配置。全局搜索一下 `Hikari`，找到数据源的所有自动配置都在 `DataSourceAutoConfiguration` 文件中：

```java
@Import({Hikari.class, Tomcat.class, Dbcp2.class, Generic.class, DataSourceJmxConfiguration.class})
protected static class PooledDataSourceConfiguration {
    protected PooledDataSourceConfiguration() {
    }
}
```

这里导入的类都在 `DataSourceConfiguration `配置类下：

![](https://gitee.com/veal98/images/raw/master/img/20200709124410.png)

💡 可以看出 **Spring Boot 2.2.5 默认使用 `HikariDataSource ` 数据源**，而以前版本，如 Spring Boot 1.5 默认使用 `org.apache.tomcat.jdbc.pool.DataSource` 作为数据源；

👍 `HikariDataSource `号称 Java WEB 当前速度最快的数据源，相比于传统的 C3P0 、DBCP、Tomcat jdbc 等连接池更加优秀。

> 可以使用 `spring.datasource.type` 指定自定义的数据源类型，值为要使用的连接池实现的完全限定名，关于数据源切换可见下文 **Druid**。

有了数据库连接，显然就可以操作数据库了。但是我们需要先了解一个对象 `JdbcTemplate`

### ② JdbcTemplate

- 有了数据源(`com.zaxxer.hikari.HikariDataSource)`，然后可以拿到数据库连接(`java.sql.Connection`)，有了连接，就可以使用原生的 JDBC 语句来操作数据库；

- <u>即使不使用第三方第数据库操作框架，如 MyBatis等，Spring 本身也对原生的JDBC 做了轻量级的封装，即 `JdbcTemplate`。</u>

- **数据库操作的所有 CRUD 方法都在 `JdbcTemplate` 中**。

- Spring Boot 不仅提供了默认的数据源，同时默认已经配置好了 `JdbcTemplate `放在了容器中，程序员只需自己注入即可使用

- `JdbcTemplate `的自动配置是依赖 `org.springframework.boot.autoconfigure.jdbc` 包下的 `JdbcTemplateConfiguration `类

👇 **JdbcTemplate主要提供以下几类方法：**

- `execute `方法：可以用于执行任何 SQL 语句，一般用于执行 DDL 语句；

- `update `方法及 `batchUpdate `方法：

  <u>`update `方法用于执行新增、修改、删除等语句</u>；

  `batchUpdate `方法用于执行批处理相关语句；

- `query `方法及 `queryForXXX `方法：用于执行查询相关语句；

- `call `方法：用于执行存储过程、函数相关语句。

### ③ 测试

编写一个Controller，注入 jdbcTemplate，编写测试方法进行访问测试：

```java
@Controller
@RequestMapping("/jdbc")
public class JdbcController {

    /**
     * Spring Boot 默认提供了数据源，默认提供了 org.springframework.jdbc.core.JdbcTemplate
     * JdbcTemplate 中会自己注入数据源，用于简化 JDBC操作
     * 还能避免一些常见的错误,使用起来也不用再自己来关闭数据库连接
     */

    @Autowired
    JdbcTemplate jdbcTemplate;

    // 查询 employee 表中所有数据
    // List 中的 1 个 Map 对应数据库的 1 行数据
    // Map 中的 key 对应数据库的字段名，value 对应数据库的字段值
    @RequestMapping("/list")
    @ResponseBody
    public String userList(){
        String sql = "select * from employee";
        List<Map<String,Object>> maps = jdbcTemplate.queryForList(sql);
        System.out.println(maps);
        return "查询成功！";
    }

    // 新增一个用户
    @RequestMapping("/add")
    @ResponseBody
    public String addUser(){
        String sql = "insert into employee(name) values('Javaer')";
        jdbcTemplate.update(sql);
        return "添加成功！";
    }

    // 修改用户信息
    @RequestMapping("/update/{id}")
    @ResponseBody
    public String updateUser(@PathVariable("id") Integer id){
        String sql = "update employee set name = ? where id = " + id;
        jdbcTemplate.update(sql,"麻辣小龙虾");
        return "修改成功！";
    }

    // 删除用户
    @RequestMapping("/delete/{id}")
    @ResponseBody
    public String deleteUser(@PathVariable("id") Integer id){
        String sql = "delete from employee where id = " + id;
        jdbcTemplate.update(sql);
        return "删除成功！";
    }
}

```

✅ Ok，到此，CRUD 的基本操作，使用 JDBC 就搞定了。

## 3. 整合 Druid 数据源

### ① Druid 简介

Java程序很大一部分要操作数据库，为了提高性能操作数据库的时候，又不得不使用数据库连接池。

**Druid** 是阿里巴巴开源平台上一个数据库连接池实现，结合了 C3P0、DBCP 等 DB 池的优点，同时加入了日志监控。

Druid 可以很好的监控 DB 池连接和 SQL 的执行情况，天生就是针对监控而生的 DB 连接池。

Druid 已经在阿里巴巴部署了超过600个应用，经过一年多生产环境大规模部署的严苛考验。

Spring Boot 2.0 以上默认使用 Hikari 数据源，可以说 Hikari 与 Driud 都是当前 Java Web 上最优秀的数据源，我们来重点介绍 Spring Boot 如何集成 Druid 数据源，如何实现数据库监控。

Druid Github地址：https://github.com/alibaba/druid/

`com.alibaba.druid.pool.DruidDataSource` 基本配置参数如下：[来源](https://github.com/alibaba/druid/wiki/DruidDataSource%E9%85%8D%E7%BD%AE%E5%B1%9E%E6%80%A7%E5%88%97%E8%A1%A8)

| 配置                                      | 缺省值             | 说明                                                         |
| ----------------------------------------- | ------------------ | ------------------------------------------------------------ |
| name                                      |                    | 配置这个属性的意义在于，如果存在多个数据源，监控的时候可以通过名字来区分开来。如果没有配置，将会生成一个名字，格式是："DataSource-" + System.identityHashCode(this). 另外配置此属性至少在1.0.5版本中是不起作用的，强行设置name会出错。[详情-点此处](http://blog.csdn.net/lanmo555/article/details/41248763)。 |
| url                                       |                    | 连接数据库的url，不同数据库不一样。例如： mysql : jdbc:mysql://10.20.153.104:3306/druid2 oracle : jdbc:oracle:thin:@10.20.149.85:1521:ocnauto |
| username                                  |                    | 连接数据库的用户名                                           |
| password                                  |                    | 连接数据库的密码。如果你不希望密码直接写在配置文件中，可以使用ConfigFilter。[详细看这里](https://github.com/alibaba/druid/wiki/使用ConfigFilter) |
| driverClassName                           | 根据url自动识别    | 这一项可配可不配，如果不配置druid会根据url自动识别dbType，然后选择相应的driverClassName |
| initialSize                               | 0                  | 初始化时建立物理连接的个数。初始化发生在显示调用init方法，或者第一次getConnection时 |
| maxActive                                 | 8                  | 最大连接池数量                                               |
| maxIdle                                   | 8                  | 已经不再使用，配置了也没效果                                 |
| minIdle                                   |                    | 最小连接池数量                                               |
| maxWait                                   |                    | 获取连接时最大等待时间，单位毫秒。配置了maxWait之后，缺省启用公平锁，并发效率会有所下降，如果需要可以通过配置useUnfairLock属性为true使用非公平锁。 |
| poolPreparedStatements                    | false              | 是否缓存preparedStatement，也就是PSCache。PSCache对支持游标的数据库性能提升巨大，比如说oracle。在mysql下建议关闭。 |
| maxPoolPreparedStatementPerConnectionSize | -1                 | 要启用PSCache，必须配置大于0，当大于0时，poolPreparedStatements自动触发修改为true。在Druid中，不会存在Oracle下PSCache占用内存过多的问题，可以把这个数值配置大一些，比如说100 |
| validationQuery                           |                    | 用来检测连接是否有效的sql，要求是一个查询语句，常用select 'x'。如果validationQuery为null，testOnBorrow、testOnReturn、testWhileIdle都不会起作用。 |
| validationQueryTimeout                    |                    | 单位：秒，检测连接是否有效的超时时间。底层调用jdbc Statement对象的void setQueryTimeout(int seconds)方法 |
| testOnBorrow                              | true               | 申请连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能。 |
| testOnReturn                              | false              | 归还连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能。 |
| testWhileIdle                             | false              | 建议配置为true，不影响性能，并且保证安全性。申请连接的时候检测，如果空闲时间大于timeBetweenEvictionRunsMillis，执行validationQuery检测连接是否有效。 |
| keepAlive                                 | false （1.0.28）   | 连接池中的minIdle数量以内的连接，空闲时间超过minEvictableIdleTimeMillis，则会执行keepAlive操作。 |
| timeBetweenEvictionRunsMillis             | 1分钟（1.0.14）    | 有两个含义： 1) Destroy线程会检测连接的间隔时间，如果连接空闲时间大于等于minEvictableIdleTimeMillis则关闭物理连接。 2) testWhileIdle的判断依据，详细看testWhileIdle属性的说明 |
| numTestsPerEvictionRun                    | 30分钟（1.0.14）   | 不再使用，一个DruidDataSource只支持一个EvictionRun           |
| minEvictableIdleTimeMillis                |                    | 连接保持空闲而不被驱逐的最小时间                             |
| connectionInitSqls                        |                    | 物理连接初始化的时候执行的sql                                |
| exceptionSorter                           | 根据dbType自动识别 | 当数据库抛出一些不可恢复的异常时，抛弃连接                   |
| filters                                   |                    | 属性类型是字符串，通过别名的方式配置扩展插件，常用的插件有： 监控统计用的filter:stat 日志用的filter:log4j 防御sql注入的filter:wall |
| proxyFilters                              |                    | 类型是List<com.alibaba.druid.filter.Filter>，如果同时配置了filters和proxyFilters，是组合关系，并非替换关系 |

### ② 配置 Druid 数据源

首先**添加 Druid 数据源依赖**：

```xml
<dependency>
     <groupId>com.alibaba</groupId>
     <artifactId>druid</artifactId>
     <version>1.1.16</version>
</dependency>
```

**切换数据源**：之前已经说过 Spring Boot 2.0 以上默认使用 `com.zaxxer.hikari.HikariDataSource` 数据源，但可以通过 `spring.datasource.type` 指定数据源。

```yaml
spring:
  datasource:
    username: root
    password: root
    # ?serverTimezone=UTC解决时区的报错
    url: jdbc:mysql://localhost:3306/springboot-demo?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
```

数据源切换之后，在测试类中注入 `DataSource`，然后获取到它，输出一看便知是否成功切换：

```java
@SpringBootTest
class JdbcDemoApplicationTests {

    @Autowired
    DataSource dataSource;


    @Test
    void contextLoads() throws SQLException {
        // 看一下数据源
        System.out.println(dataSource.getClass());
        // 获得连接
        Connection connection = dataSource.getConnection();
        System.out.println(connection);
        // 关闭连接
        connection.close();
    }

}
```

![](https://gitee.com/veal98/images/raw/master/img/20200709153659.png)

OK，数据源成功切换 😊

接下来可以设置数据源连接初始化大小、最大连接数、等待时间、最小连接数 等设置项：

```yaml
spring:
  datasource:
    username: root
    password: root
    # ?serverTimezone=UTC解决时区的报错
    url: jdbc:mysql://localhost:3306/springboot-demo?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource

    #Spring Boot 默认是不注入这些属性值的，需要自己绑定
    #druid 数据源专有配置
    initialSize: 5
    minIdle: 5
    maxActive: 20
    maxWait: 60000
    timeBetweenEvictionRunsMillis: 60000
    minEvictableIdleTimeMillis: 300000
    validationQuery: SELECT 1 FROM DUAL
    testWhileIdle: true
    testOnBorrow: false
    testOnReturn: false
    poolPreparedStatements: true
    # 配置监控统计拦截的filters，stat:监控统计、log4j：日志记录、wall：防御sql注入
    # 如果允许时报错  java.lang.ClassNotFoundException: org.apache.log4j.Priority
    # 则导入 log4j 依赖即可，Maven 地址：https://mvnrepository.com/artifact/log4j/log4j
    filters: stat,wall,log4j
    maxPoolPreparedStatementPerConnectionSize: 20
    useGlobalDataSourceStat: true
    connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500
```

**导入 `Log4j `的依赖**

```xml
<!-- https://mvnrepository.com/artifact/log4j/log4j -->
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```

OK，接下来需要我们自己为 `DruidDataSource ` 绑定全局配置文件中的参数，再添加 `DruidDataSource `组件到容器中，而不再使用 Spring Boot 的自动生成了：

```java
@Configuration
public class DruidConfig {
    @ConfigurationProperties(prefix = "spring.datasource")
    @Bean
    public DataSource druidDataSource(){
        return new DruidDataSource();
    }
}
```

配置完毕后，去测试一下：

```java
@SpringBootTest
class JdbcDemoApplicationTests {

    @Autowired
    DataSource dataSource;


    @Test
    void contextLoads() throws SQLException {
        // 看一下默认数据源
        System.out.println(dataSource.getClass());
        // 获得连接
        Connection connection = dataSource.getConnection();
        System.out.println(connection);

        DruidDataSource druidDataSource = (DruidDataSource) dataSource;
        System.out.println("数据源最大连接数: " + druidDataSource.getMaxActive());
        System.out.println("数据源初始化连接数: " + druidDataSource.getInitStackTrace());

        // 关闭连接
        connection.close();
    }

}
```

![](https://gitee.com/veal98/images/raw/master/img/20200709154902.png)

可见配置参数已经生效~

### ③ 配置 Druid 数据源监控

Druid 数据源具有监控的功能，并提供了一个 web 界面方便用户查看，类似安装路由器时也提供了一个默认的 web 页面。所以第一步需要设置 Druid 的后台管理页面，比如登录账号、密码等。

**配置后台管理**：

```java
@Configuration
public class DruidConfig {
    @ConfigurationProperties(prefix = "spring.datasource")
    @Bean
    public DataSource druidDataSource(){
        return new DruidDataSource();
    }


    // 配置 Druid 监控管理后台的Servlet；
    // 内置 Servlet 容器时没有web.xml文件，所以使用 Spring Boot 的注册 Servlet 方式
    @Bean
    public ServletRegistrationBean statViewServlet() {
        ServletRegistrationBean bean = new ServletRegistrationBean(new StatViewServlet(), "/druid/*");

        // 这些参数可以在 com.alibaba.druid.support.http.StatViewServlet
        // 的父类 com.alibaba.druid.support.http.ResourceServlet 中找到
        Map<String, String> initParams = new HashMap<>();
        initParams.put("loginUsername", "admin"); //后台管理界面的登录账号
        initParams.put("loginPassword", "123456"); //后台管理界面的登录密码

        //后台允许谁可以访问
        //initParams.put("allow", "localhost")：表示只有本机可以访问
        //initParams.put("allow", "")：为空或者为null时，表示允许所有访问
        initParams.put("allow", "");

        //deny：Druid 后台拒绝谁访问
        //initParams.put("smallbeef", "192.168.1.20");表示禁止此ip访问

        //设置初始化参数
        bean.setInitParameters(initParams);
        return bean;
    }
}
```

配置完毕后，我们可以选择访问 ：[http://localhost:8080/druid/login.html](http://localhost:8080/druid/login.html)

<img src="https://gitee.com/veal98/images/raw/master/img/20200709160550.png" style="zoom:80%;" />

![](https://gitee.com/veal98/images/raw/master/img/20200709160605.png)

**配置 Druid web 监控 filter 过滤器：**

```java
// 配置 Druid 监控 之  web 监控的 filter
// WebStatFilter：用于配置Web和Druid数据源之间的管理关联监控统计
@Bean
public FilterRegistrationBean webStatFilter() {
    FilterRegistrationBean bean = new FilterRegistrationBean();
    bean.setFilter(new WebStatFilter());

    //exclusions：设置哪些请求进行过滤排除掉，从而不进行统计
    Map<String, String> initParams = new HashMap<>();
    initParams.put("exclusions", "*.js,*.css,/druid/*,/jdbc/*");
    bean.setInitParameters(initParams);

    //"/*" 表示过滤所有请求
    bean.setUrlPatterns(Arrays.asList("/*"));
    return bean;
}
```

## 4. 整合 MyBatis

📃 官方文档：[http://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/](http://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)

🏠 Maven仓库地址：[https://mvnrepository.com/artifact/org.mybatis.spring.boot/mybatis-spring-boot-starter/2.1.1](https://mvnrepository.com/artifact/org.mybatis.spring.boot/mybatis-spring-boot-starter/2.1.1)

**详细步骤如下**：

- 1）导入 MyBatis 所需要的依赖

- 2）配置数据源相关属性（见上一节 Druid）
- 3）数据库建表
- 4）测试数据库是否连接成功
- 5）创建JavaBean
- 6）创建 mapper 目录以及对应的 Mapper 接口
- 7）编写对应的 Mapper 映射文件（注意相关配置）
- 8）maven 配置资源过滤问题
- 9）编写 Controller 进行测试
- 10）启动项目访问进行测试

👉 **导入 MyBatis 所需要的依赖：**

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.1</version>
</dependency>
```

![](https://gitee.com/veal98/images/raw/master/img/20200709162203.png)

👉 **创建JavaBean**：

> 数据库表和上一节一样

```java
public class Employee {

    private Integer id;
    private String name;

    public Employee() {
    }

    public Employee(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}

```

👉 **创建 mapper 文件夹以及对应的 Mapper 接口**：

```java
//@Mapper : 表示本类是一个 MyBatis 的 Mapper
@Mapper
@Repository
public interface EmployeeMapper {
    // 获取所有员工信息
    List<Employee> getEmployees();

    // 通过 id 获取员工信息
    Employee getEmployee(Integer id);

}
```

👉 **编写对应的 mapper.xml 映射文件**：(放在 `resouces `文件夹下)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.smallbeef.jdbcdemo.Mapper.EmployeeMapper">
    <!--获取所有员工信息 List<Employee> getEmployees();-->
    <!--直接写 resultType="Employee" 是无法识别的，需要在 yaml配置文件中配置别名-->
    <!--或者 resultType="com.smallbeef.jdbcdemo.Bean.Employee"-->
    <select id="getEmployees" resultType="Employee">
        select * from employee;
    </select>

    <!--通过 id 获取员工信息 Employee getEmployee(Integer id);-->
    <select id="getEmployee" resultType="Employee">
        select * from employee where id = #{id};
    </select>
</mapper>
```

![](https://gitee.com/veal98/images/raw/master/img/20200709170324.png)

注意：直接写 `resultType="Employee"` 是无法识别的，需要在全局配置文件中配置别名，或者指定全类名也可：`resultType="com.smallbeef.jdbcdemo.Bean.Employee"`

```yaml
# 整合 Mybatis
mybatis:
  mapper-locations: classpath:mybatis/mapper/*.xml # 指明 mapper.xml 所在位置
  type-aliases-package: com.smallbeef.jdbcdemo.Bean # 配置别名
```

👉 **maven 配置资源过滤问题**：`pom.xml`

```xml
<build>
    
    ......

    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
            <filtering>true</filtering>
        </resource>
    </resources>

</build>
```

👉 **编写 Controller 进行测试**：

```java
@Controller
public class EmployeeController {
    @Autowired
    EmployeeMapper employeeMapper;

    // 查询全部员工
    @RequestMapping("/getemps")
    public void getEmployees(){
        List<Employee> employees = employeeMapper.getEmployees();
        System.out.println(employees);
    }

    @RequestMapping("/getemp/{id}")
    public void getEmployee(@PathVariable("id") Integer id){
        Employee employee = employeeMapper.getEmployee(id);
        System.out.println(employee);
    }

}
```

👉 **启动项目访问进行测试**：

![](https://gitee.com/veal98/images/raw/master/img/20200709170643.png)

## 📚 References

- [【狂神说Java】SpringBoot 最新教程IDEA版通俗易懂](https://www.bilibili.com/video/BV1PE411i7CV?p=26)