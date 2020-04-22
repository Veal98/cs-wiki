

注解配置和 xml 配置要实现的功能都是一样 的，都是要降低程序间的耦合。只是配置的形式不一样。 

回顾以下基于Xml的 IoC 配置
```java
<bean id = "accountService" class = "com.smallbeef.service.impl.AccountServiceImpl"
	scoper = "" init-method = "" destory-method = "">
	<property name = "" / ref = "">
</bean>
```


# 一、Spring 中 IoC 的常用注解
XML配置自动化扫描
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

        <!--告知Spirng在创建容器时要扫描的包，配置所需要的标签不是在beans的约束中，而是一个名称为context空间和约束中-->
        <context:component-scan base-package="com.smallbeef"></context:component-scan>

</beans>
```
## 1. 用于创建对象的
他们的作用和 XML 配置文件中编写一个 bean 标签实现的功能是一样的
### @Component
作用：用于把当前类对象存入 Spring 容器中
属性：
	value:  用于指定 bean 的 id 。**当我们不写时，他的默认值是当前类名，且首字母小写。**

```java
// 没有写value 默认值accountServiceImpl
@Component 
public class AccountServiceImpl implements IAccountService {
 
}
```
```java
public class Client {
    public static void main(String[] args) {
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        IAccountService as = (IAccountService) ac.getBean("accountServiceImpl");
        System.out.println(as);
    }
}
```

### @Controller / @Service / @Repository
这三个注解的作用和属性与Component是一摸一样的，四个注解可以随意互换
**他们只不过是提供了更加明确的语义化。** 

- `@Controller`：一般用于表现层的注解。  
- `@Service`：一般用于业务层的注解。  
- `@Repository`：一般用于持久层的注解。 

## 2. 用于注入数据的
他们的作用和在 XML 配置文件的 bean 标签中编写一个 property 标签实现的功能是一样的（set方法注入）
### @Autowired
作用：  自动按照类型注入。
出现位置：变量和方法上都可以

**当使用注解注入属性时，set方法可以省略**。
**它只能注入其他 bean 类型。**
在 Spring 容器查找，找到了注入成功。找不到 就报错。 

**当有多个 类型匹配时，使用 要注入的对象变量名称 作为 bean 的 id**

```java
@Repository
public class AccountDaoImpl1 implements IAccountDao {

    public  void saveAccount(){

        System.out.println("保存了账户");
    }
}
__________________________________________________________________________

@Repository
public class AccountDaoImpl2 implements IAccountDao {

    public  void saveAccount(){

        System.out.println("222保存了账户");
    }
}

```
```java
@Component
public class AccountServiceImpl implements IAccountService {

    @Autowired
//    private IAccountDao accountDaoImpl1;
    private IAccountDao accountDaoImpl2;

    @Override
    public void saveAccount() {
        accountDaoImpl2.saveAccount();
    }
}
```
```java
public class Client {

    /**
     * 获取spring的Ioc容器，并根据id获取对象
     * @param args
     */
    public static void main(String[] args) {
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        IAccountService as = (IAccountService) ac.getBean("accountServiceImpl");
        System.out.println(as);
        as.saveAccount();
    }
}
```
- **只有一个相符合的bean时，直接匹配数据类型**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200316114613172.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMTMzOTg2,size_16,color_FFFFFF,t_70)

- **有多个相符合的bean时，先匹配数据类型，再将变量名称和bean的id进行匹配**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200316115920895.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMTMzOTg2,size_16,color_FFFFFF,t_70)

当变量名称找不到一样的 bean 的 id 的时候，就会报错。
为解决变量名称和 bean 的 id 不匹配的情况，有了如下注解 `Qualifier`。

### @Qualifier
作用：  在自动按照类型注入的基础之上，再按照 Bean 的 id 注入。
**它在给成员变量注入时不能独立使用，必须和 `@Autowire` 一起使用；但是给方法参数注入时，可以独立使用**
属性：  value：指定 bean 的 id。 

```java
@Component
public class AccountServiceImpl implements IAccountService {

    @Autowired
    @Qualifier("accountDaoImpl1")
    private IAccountDao accountDaoImpl;

    @Override
    public void saveAccount() {
        accountDaoImpl.saveAccount();
    }
}
```

### @Resource
作用：  直接按照 Bean 的 id 注入。**可以独立使用**。它也只能注入其他 bean 类型。
 属性：  **name**：指定 bean 的 id。 

```java
@Component
public class AccountServiceImpl implements IAccountService {

    @Resource(name = "accountDaoImpl2")
    private IAccountDao accountDaoImpl;

    @Override
    public void saveAccount() {
        accountDaoImpl2.saveAccount();
    }
}
```

 

以上三个注解都只能能注入其他bean类型的数据，而基本类型和String类型无法使用上述注解实现(用 `@Value` 实现)。
**另外，集合类型的注入只能通过XML来实现**

### @Value
作用：  **注入基本数据类型和 String 类型的数据**
属性：  value：用于指定值。它可以使用 Spring 中 `SpEL`（也就是spring中的EL表达式, ${表达式}）


## 3. 用于改变作用范围的
作用和在XML配置文件的<bean>标签中使用scope属性实现的功能是一样的
### @Scope
作用：  指定 bean 的作用范围。 
属性：  value：指定范围的值。      
取值：singleton /  prototype / request / session / globalsession 
## 4. 用于改变生命周期的 (了解即可)
他们的作用和在XML配置文件的<bean>标签中使用inti-method和destroy-method属性实现的功能是一样的
### @PreDestroy
作用：  用于指定销毁方法。
### @PostConstruct 
作用：  用于指定初始化方法。 

```java
public class Client {
    /**
     * 获取spring的Ioc容器，并根据id获取对象
     * @param args
     */
    public static void main(String[] args) {
        ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        IAccountService as = (IAccountService) ac.getBean("accountServiceImpl");
        as.saveAccount();
        ac.close(); //单例模式，容器销毁，对象释放，调用destroy方法
    }
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200316121930150.png)

写到此处，基于注解的 IoC 配置已经完成，但是大家都发现了一个问题：我**们依然离不开 spring 的 xml 配 置文件，那么能不能不写这个 bean.xml，所有配置都用注解来实现呢？** 

# 二、Spring 的纯注解配置
我们发现，之所以我们现在离不开 xml 配置文件，是因为我们有一句很关键的配置： 

```java
<!-- 告知spring框架在，读取配置文件，创建容器时，扫描注解，依据注解创建对象，并存入容器中 --> 
<context:component-scan base-package="com.smallbeef"></context:component-scan> 
```

如果他要也能用注解配置，那么我们就离脱离 xml 文件又进了一步。 

另外，数据源和 JdbcTemplate 的配置也需要靠注解来实现。  

```java
<!-- 配置 dbAssit -->  
<bean id="dbAssit" class="com.smallbeef.dbassit.DBAssit"> 
  <property name="dataSource" ref="dataSource"></property>  
</bean>   
  
 <!-- 配置数据源 -->  
 <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource"> 
  <property name="driverClass" value="com.mysql.jdbc.Driver"></property>   
  <property name="jdbcUrl" value="jdbc:mysql:///spring_day2"></property>   
  <property name="user" value="root"></property>   
  <property name="password" value="1234"></property>  
</bean>
```

## @Configuration
作用：  用于指定当前类是一个 Spring 配置类，当创建容器时会从该类上加载注解。
获取容器时需要使用 `AnnotationApplicationContext`(有 `@Configuration` 注解的类 `.class`)。 
属性：  value:用于指定配置类的字节码 

细节：当配置类作为 `AnnotationConfigApplicationContext` 对象创建的参数时，该配置类上的 `@Configuration` 注解可以不写

## @ComponentScan 自动化扫描
作用：  用于指定 Spring 在初始化容器时要扫描的包。
作用和在 Spring 的 xml 配置文件中的： 
`<context:component-scan base-package="com.smallbeef"/>` 是一样的。 
属性：  `basePackages / value`：用于指定要扫描的包。

```java
@Configuration 
@ComponentScan("com.smallbeef") 
public class JDBCConfiguration { 

} 
```
使用这两个注解我们已经配置好了要扫描的包，但是数据源和 JdbcTemplate 对象如何从配置文件中移除呢？  

## @Bean
作用：  该注解只能写在方法上，**表明把当前方法的返回值作为bean对象存入spring 容器中。** 
属性：  name：给当前 `@Bean` 注解方法创建的对象指定一个名称(即 bean 的 id）。 默认值是当前方法的名称

细节：**当我们使用注解配置方法时，如果方法有参数，Spring 框架会去容器中查找有没有相匹配的 bean 对象，查找方法和AutoWired一样。**

```java
/**
 * 连接数据库的配置类  
 */ 
@Configuration 
@ComponentScan("com.smallbeef") 
public class JDBCConfiguration {

    /**
     * 创建一个数据源，并存入 spring 容器中   
     * * @return   
     * */  
    @Bean(name="dataSource")  
    public DataSource createDataSource() {   
        try {    
            ComboPooledDataSource ds = new ComboPooledDataSource();    
            ds.setUser("root");    
            ds.setPassword("1234");    
            ds.setDriverClass("com.mysql.jdbc.Driver");
            ds.setJdbcUrl("jdbc:mysql:///spring_day02");    
            return ds;   
        } catch (Exception e) {    
            throw new RuntimeException(e);   
        }  
    }

    /**
     * 创建一个 QuerryRunner对象，并且也存入 spring 容器中   
     * * @param dataSource   
     * * @return   
     * */  
    @Bean(name="dbAssit")  
    public  DBAssit createDBAssit(DataSource dataSource) {   
        return new  DBAssit(dataSource);  
    }  
} 
```

这样，我们已经把数据源和 DBAssit 从配置文件中移除了，此时可以删除 bean.xml 了。  但是由于没有了配置文件，创建数据源的配置 ` ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");`又都写死在类中了。如何把它们配置出来呢？ 
如下：
```java
        ApplicationContext ac = new AnnotationConfigApplicationContext(SpringConfiguration.class);
```

## @Import
**作用：**  用于导入其他配置类，有 `@Import` 注解的类就是主配置类。在引入其他配置类时，其他子配置类可以不用再写 @Configuration 注解。当然，写上也没问 题。 
**属性：**  value[]：用于指定其他配置类的字节码。 



大的 SpringConfiguration 类利用 @Import 包含小的 JDBCConfiguration 配置类，这样 AnnotationConfigApplicationContext 直接加载大的配置类，就会把这些小的配置类也都加载进来
```java
@Configuration //在 AnnotationConfigApplicationContext中做参数时可以不写该注解
@ComponentScan(basePackages = "com.smallbeef.spring") 
@Import({ JdbcConfig.class，xxxxxConfig.class, xxxxConfig.class}) 
public class SpringConfiguration { 

} 
 
public class JdbcConfig{ 

} 

——————————————————————————————————————————————

 ApplicationContext ac = new AnnotationConfigApplicationContext(SpringConfiguration.class);
 
```

## @PropertySource
**作用**：用于加载 `.properties` 文件中的配置。例如我们配置数据源时，可以把连接数据库的信息写到 properties 配置文件中，就可以使用此注解指定 properties 配置文件的位置。 
**属性：**  value[]：用于指定 properties 文件位置。**如果是在类路径下，需要写上 classpath:** 

可以看到以上数据库的配置是写死的
```java
   @Bean(name="dataSource")  
    public DataSource createDataSource() {   
        try {    
            ComboPooledDataSource ds = new ComboPooledDataSource();    
            ds.setUser("root");    
            ds.setPassword("1234");    
            ds.setDriverClass("com.mysql.jdbc.Driver");
            ds.setJdbcUrl("jdbc:mysql:///spring_day02");    
            return ds;   
        } catch (Exception e) {    
            throw new RuntimeException(e);   
        }  
    }
```
我们将数据库配置放在 `.properties` 文件中，利用 @PropertySource 注解读取该文件，并用 @Value 注解传值
`jdbcConfig.properties`
```java
jdbc.driver=com.mysql.jdbc.Driver  
jdbc.url=jdbc:mysql://localhost:3306/day44_ee247_spring 
jdbc.username=root 
jdbc.password=1234
```

利用 @Value 取值
```java
/**
 * 连接数据库的配置类  
 */ 
@Configuration 
@ComponentScan("com.smallbeef") 
public class JDBCConfiguration {
	@Value("${jdbc.driver}")  //与properties中属性一致
	private Stirng driver;
	
	@Value("${jdbc.url}")
	private String url;
	
	@Value("${jdbc.username}")
	private String username;
	
	@Value("${jdbc.password}")
	private String password;
	
    /**
     * 创建一个数据源，并存入 spring 容器中   
     * * @return   
     * */  
    @Bean(name="dataSource")  
    public DataSource createDataSource() {   
        try {    
            ComboPooledDataSource ds = new ComboPooledDataSource();    
            ds.setUser("username");    
            ds.setPassword("password");    
            ds.setDriverClass("driver");
            ds.setJdbcUrl("url");    
            return ds;   
        } catch (Exception e) {    
            throw new RuntimeException(e);   
        }  
    }

    /**
     * 创建一个 QuerryRunner对象，并且也存入 spring 容器中   
     * * @param dataSource   
     * * @return   
     * */  
    @Bean(name="dbAssit")  
    public  DBAssit createDBAssit(DataSource dataSource) {   
        return new  DBAssit(dataSource);  
    }  
} 
```
利用 @PropertySource 传入 properties 文件

```java
@Configuration
@ComponentScan(basePackages = "com.smallbeef.spring") 
@Import(JdbcConfig.class) 
@PropertySource("classpath:jdbcConfig.properties")
public class SpringConfiguration { 

} 
```

# 三、Spring 整合Junit
**问题：**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200316150735238.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMTMzOTg2,size_16,color_FFFFFF,t_70)
在测试类中，每个测试方法都有以下两行代码： 

```java
ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");  IAccountService as = ac.getBean("accountService",IAccountService.class); 
```

这两行代码的作用是获取容器，如果不写的话，直接会提示空指针异常。所以又不能轻易删掉。 

**Spring整合Junit的配置步骤**
1. 导入 Spring 整合 junit 的 ja r包
```xml
<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-test</artifactId>
	<version>5.0.2.RELEASE</version>
</dependency>

//当我们使用spring5.x版本的时候，要求junit的jar包必须是4.12及以上
<dependency>
	<groupId>junit</groupId>
	<artifactId>junit</artifactId>
	<version>4.12</version>
</dependency>
```
3. 使用 `@RunWith` 替换原有的 main 方法
```java
/** 
 * 测试类  
 */ 
@RunWith(SpringJUnit4ClassRunner.class) 
public class AccountServiceTest { 

} 
```
4. 使用 `@ContextConfiguration` 指定 Spring 配置文件的位置 
 - locations: 指定xml文件的位置，classpath 表示在类路径下
 - classes：指定注解类所在位置
```java
/** 
 * 测试类  
 */ 
@RunWith(SpringJUnit4ClassRunner.class) 
// @ContextConfiguration(locations= {"classpath:bean.xml"}) 
@ContextConfiguration(classes = SpringConfiguration.class)
public class AccountServiceTest { 

} 
```


整合完成后，每个测试方法中的这两行代码：就可以去掉了

```java
ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");  
IAccountService as = ac.getBean("accountService",IAccountService.class); 
```

定义一个成员变量并自动注入即可
```java
@Autowired
private IAccountService as;
```