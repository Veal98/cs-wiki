# 一、 Spring简介

---

我们常说的 Spring 实际上 是指 `SpringFramework` ，而 SpringFramework 只是 Spring 家族的的一个分支而已。

Spring是分层的 Java SE/EE应用 full-stack 轻量级开源框架，**以 IOC（Inverse Of Control： 反转控制）和 AOP（Aspect Oriented Programming：面向切面编程）为内核**，提供了展现层 Spring MVC 和持久层 Spring JDBC 以及业务层事务管理等众多的企业级应用技术，还能整合开源世界众多 著名的第三方框架和类库，逐渐成为使用最多的Java EE 企业应用开源框架。



需要主要掌握 Spring 四个方面的功能：

- IOC / DI
- AOP
- 事务
- JDBCTemplate

<br>



# 二、 IoC

---



## 1. IoC概念

`IOC = 控制反转 = Inversion of Control`    实际上就是指对一个对象控制权的转换。
比如：

```java
public class Book{
    private Integer id;
    private String name;
    public setId(int bid){
         id = bid;
    }
}
public class User{
    private Interger id;
    private String name;
    public void doSomething(){
        Book book = new Book();
        book.setId(1);
    }
```


在这种情况下，Book 对象的控制权在 User 对象里面（**主动**），Book 和 User 高度耦合，如果其他对象需要使用 Book 对象，得重新创建，也就是说，对象的创建、初始化、销毁等操作，都要由开发者来完成。

如果能将这些操作交给容器来管理，开发者就可以极大的从对象的创建中解放出来。

使用 Spring 之后，我们可以将以上这些操作交给容器来管理。在项目启动时，将所有的 Bean 都注册到 Spring 容器中取，然后如果有其他 Bean 需要使用到这个 Bean ，则不需要自己去 new ，而是直接去 Spring 容器中去要（**被动**）。

**这种由主动创建对象到被动创建对象的改变就叫做控制反转 IoC**

**IoC 只能解决程序间的依赖关系，别的事情都干不了**

下面通过一个简单的例子看下这个过程👇

## 2. IoC初体验

- 建立`Maven`工程

- 导入`springframework`依赖

  ```java
  <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.2.2.RELEASE</version>
        </dependency>
    </dependencies>Copy to clipboardErrorCopied
  ```

- 在resources目录下创建 Spring 的配置文件`bean.xml`

  ```java
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!--把对象的创建交给spring来管理-->
    <bean id = "accountService" class = "com.smallbeef.service.impl.AccountServiceImpl"></bean>
    <bean id = "accountDao" class = "com.smallbeef.dao.impl.AccountDaoImpl"></bean>
  </beans>Copy to clipboardErrorCopied
  ```
  
    ioc容器根据 id 唯一获取对象（也可以用name属性作为bean的标记，和id的区别不大）
  
  > name 和 id 的区别:
  >
  > name 支持取多个.  多个name之间用 , 隔开
  >
  > ```xml
  > <bean name = "accountService1,accountService2,accountService3" class = "com.smallbeef.service.impl.AccountServiceImpl"></bean>
  > ```
  >
  > 此时通过accountService1, accountService2, accountService3 都能获取到这个bean
  
- 获取 Bean 对象

  - 1.使用 `ApplicationContext` 接口加载配置文件，获取 Spring 容器

  - 2.利用 `getBean` 根据 bean 的 id 从容器中获取对象

    ```java
    public class Client {
        /**
         * 获取spring的Ioc容器，并根据id获取对象
         * @param args
         */
        public static void main(String[] args) {
            //1.使用 ApplicationContext 接口，就是在加载配置文件，获取 spring 容器
            ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
            // 2.利用 getBean 根据 bean 的 id 获取对象
            IAccountService aService = (IAccountService) ac.getBean("accountService");
            System.out.println(aService);
            IAccountDao aDao = (IAccountDao) ac.getBean("accountDao");
            System.out.println(aDao);
        }
    }
    ```
  
  
  
  对于配置文件的加载方式，除了使用 `ClassPathXmlApplicationContext`(去classpath 路径下查找配置文件)，另外也可以使用`FileSystemXmlApplicationContext`（加载磁盘**任意路径下**的配置文件） 和 `AnnotationConfigApplicationContext`（读取注解创建容器）

## 3. Bean
### ① Bean的获取

在上一节中，我们通过`ac.getBean`方法来从Spring容器中获取Bean，传入的参数是 Bean 的 name 或者 id 属性。除了这种方式，也可以直接通过 Class 去获取一个 Bean。

```java
public class Client {
    public static void main(String[] args) {
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        IAccountService aService = ac.getBean(IAccountService.class);
        System.out.println(aService);
    }
}
```

这种方式存在一个很大的弊端，如果存在多个实例（多个Bean），这种方式就不可用。

所以一般建议通过name 或者 id 去获取 Bean 的实例

### ② Bean的创建

#### Xml配置 - 三种方式

- **使用默认无参构造函数**

  在spring的配置文件中使用bean标签，配以id和class属性后，且没有其他属性和标签时。采用的就是默认构造函数创建bean对象，此时_如果 bean（类） 中没有**默认无参构造函数**，将会创建失败_

  ```xml
  <bean id = "accountService" class = "com.smallbeef.service.impl.AccountServiceImpl">
  ```

- **使用简单工厂模式的方法创建**（使用某个类中的方法创建对象，并存入 Spring 容器）

  ```java
    /** 
     * 模拟一个工厂类
     * 该类可能是存在于jar包中的，我们无法通过修改源码的方式来提供默认构造函数
     * 此工厂创建对象，必须现有工厂实例对象，再调用方法  
     */ 
    public class InstanceFactory {   
        public IAccountService createAccountService(){   
            return new AccountServiceImpl();  
        }
    }
  ```

  ```xml
   <bean id = "InstanceFactory" 
    		class = "com.smallbeef.factory.InstanceFactory">
    </bean>
    
    <bean id="accountService"  
    		factory-bean="InstanceFactory"     
    	 	factory-method="createAccountService">
    </bean>
  ```

- **使用静态工厂的方法创建对象**（使用某个类中的**静态方法**创建对象，并存入 Spring 容器）

  ```java
  /** 
   * 模拟一个静态工厂类
   * 该类可能是存在于jar包中的，我们无法通过修改源码的方式来提供默认构造函数
   */ 
  public class StaticFactory {   
      public static IAccountService createAccountService(){   
          return new AccountServiceImpl();  
      } 
  }
  ```

  ```xml
  <bean id="accountService"  
     	  class="com.smallbeef.factory.StaticFactory"     
        factory-method="createAccountService">
  </bean>
  ```


#### 注解配置

以下注解的作用和在 XML 配置文件中编写一个 bean 标签实现的功能是一样的 , 用于把当前类对象存入 Spring 容器中

🚨 使用以下注解的时候，需要在 Xml 文件中配置如下:（当然，其他的bean注册配置就不用写了，配合下面注解这一行就可以了）

```xml
 <!--告知Spirng在创建容器时要扫描的包，配置所需要的标签不是在beans的约束中，而是一个名称为context空间和约束中-->
<context:component-scan base-package="com.smallbeef"></context:component-scan>
```

或者使用 配置类 +**`@ComponentScan`** 注解(详细见下文)

- `@Component`

  value属性 :  用于指定 bean 的 id 。当我们不写时，他的默认值是当前类名，且首字母小写。

- `@Controller` : 一般用于表现层的注解。

- `@Service` : 一般用于业务层的注解。

- `@Repository `: 一般用于持久层的注解。 

上述四个注解可以随意互换, 作用相同,  都是用于用于把当前类对象存入 Spring 容器中, 只不过后面三个注解提供了更具体的语义化罢了.

```java
// 没有写value 默认值 'accountServiceImpl'
@Service 
public class AccountServiceImpl implements IAccountService {
 	// doSomething
}
```

### ③ Bean的作用范围

从 Spring 容器中多次获取同一个Bean，默认情况下，获取到的实际上是同一个实例，即默认是单例的。当然，我们可以手动配置

#### Xml配置

```xml
<bean class = "com.smallbeef.dao.useDaoImpl" id = "userDao" scope = "prototype"/>
```

bean 标签的 `scope` 属性就是用来指定 bean 的作用范围的

- **singleton** : 默认值，单例的.    （bean对象默认是单例模式）
- **prototype** : 多例的.
- request : 作用于web应用的请求范围。WEB 项目中,Spring 创建一个 Bean 的对象,将对象存入到 request 域中.
- session : 作用于web应用的会话范围。WEB 项目中,Spring 创建一个 Bean 的对象,将对象存入到 session 域中.
- global-session :作用于集群环境的会话范围。WEB 项目中,应用在 Portlet（集群） 环境.如果没有 Portlet 环境那么 globalSession 相当于 session.

#### 注解配置

当然，除了使用Bean标签在xml中进行配置，我们也可以在Java代码中使用注解 `@Scope` 来配置Bean的作用范围

```java
@Repository
@Scope("prototype")
public calss UserDao{
    public String hello(){
        return "hello";
    }
}
```

### ④ Bean的生命周期

- **单例对象：scope="singleton"**

​	 一个应用只有一个对象的实例。它的作用范围就是整个引用。

​	生命周期：

- 对象出生：<u>当应用加载，创建容器时，对象就被创建了</u>。

- 对象活着：只要容器在，对象一直活着。

- 对象死亡：<u>当应用卸载，销毁容器时，对象就被销毁了</u>。

  

  总结： **单例对象的生命周期和容器相同**




- **多例对象：scope="prototype"**

​	每次访问对象时，都会重新创建对象实例。

​	生命周期：

- 对象出生：<u>当使用对象时，才会创建新的对象实例</u>。

- 对象活着：只要对象在使用中，就一直活着。

- 对象死亡：**当对象长时间不用，且没有别的对象引用时，由 java 的垃圾回收器进行回收。**

  

#### Xml 配置

> `bean` 标签：
>
> - `init-method`：指定类中的初始化方法名称。
>
> - `destroy-method`：指定类中销毁方法名称。

```xml
<bean class = "com.smallbeef.dao.useDaoImpl" id = "userDao" scope = "prototype" init-method = "" destroy-method = ""/>
```

#### 注解配置

- `@PreDestroy`

  作用：  用于指定销毁方法。

- `@PostConstruct `

  作用：  用于指定初始化方法。 

## 4. 依赖注入DI

依赖注入：`Dependency Injection`。它是 Spring 框架核心 ioc 的具体实现。
我们的程序在编写时，通过控制反转，把对象的创建交给了 spring，但是代码中不可能出现没有依赖的情况。 ioc 解耦只是降低他们的依赖关系，但不会消除。
例如：我们的业务层仍会调用持久层的方法。 那这种业务层和持久层的依赖关系，在使用 spring 之后，就让 spring 来维护了。
简单的说，**就是坐等框架把持久层对象传入业务层，而不用我们自己去获取。**



能注入的数据有三类：

- 基本类型和String
- 其他bean类型（在配置文件中或者注解配置过的bean)
- 复杂类型/集合类型

注入的方式有三种：

  - 构造函数
  - set方法
  - 注解

下面详细讲解三种注入方式

### Xml 配置

#### ① 构造函数注入

顾名思义，就是使用类中的<u>有参构造函数</u>，给成员变量赋值

- 构造函数注入：

  使用的便签：`constructor-arg`

  标签出现的位置：bean标签的内部

- 标签中的属性：

  - `index`:指定要注入的数据在构造函数参数列表的索引位置 ，从0开始
  - `type`: 用于指定要注入的数据的数据类型，该数据类型也是构造函数中某个或某些参数的类型
  - `name`:用于给构造函数中指定名称的参数赋值
  - value : 它能赋的值是基本数据类型和 String 类型
  - ref : 它能赋的值是其他 bean 类型，也就是说，必须得是在配置文件中或者注解中配置过的 bean

**示例代码：**

```java
public class AccountServiceImpl implements IAccountService {    
    private String name;  
    private Integer age;  
    private Date birthday;     
    public AccountServiceImpl(String name, Integer age, Date birthday) {   
        this.name = name;   
        this.age = age;   
        this.birthday = birthday;  
    }

    @Override  
    public void saveAccount() {   
        System.out.println(name+","+age+","+birthday);   
    } 
}
```

```xml
	<bean id = "accountService" class = "com.smallbeef.service.impl.AccountServiceImpl">
        <constructor-arg name="name" value="test"></constructor-arg>
        <constructor-arg name = "age" value="20"></constructor-arg>
        <constructor-arg name = "birthday" ref="now"></constructor-arg>
    </bean>

    <!--配置一个日期对象
        读取这个类名通过反射创建对象并存入spring容器中，我们可以通过id来使用它
    -->
    <bean id="now" class="java.util.Date"></bean>
```

此处的 value 也可以在 classpath 目录下新建一个 properties 文件，利用 SPEL 表达式取值，比如：

```
name = test
age = 20
```

```xml
	<bean id = "accountService" class = "com.smallbeef.service.impl.AccountServiceImpl">
        <constructor-arg name="name" value="${name}"></constructor-arg>
        <constructor-arg name = "age" value="${age}"></constructor-arg>
    </bean>
```



🚨 我们在创建对象时，**即使用不到这些数据时，也得给他们都赋值**

#### ② set 方法注入

顾名思义，就是在类中提供需要注入成员的 set 方法

- 涉及的标签：`property`
- 出现的位置：bean标签的内部
- 标签的属性：
  - `name`: 指定注入时所调用的set方法名称
  - `value`: 它能赋的值是基本数据类型和 String 类型
  - `ref`:它能赋的值是其他 bean 类型，也就是说，必须得是在配置文件中或者注解中配置过的 bean

**示例代码：**

```java
public class AccountServiceImpl implements IAccountService {
    private String name;
    private Integer age;
    private Date birthday;

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    @Override
    public void saveAccount() {
        System.out.println(name+","+age+","+birthday);
    }
}
```

```xml
	<bean id = "accountService" class = "com.smallbeef.service.impl.AccountServiceImpl">
        <property name="name" value="test"></property>
        <property name="age" value="20"></property>
        <property name="birthday" ref = "now"></property>
    </bean>

    <bean id="now" class="java.util.Date"></bean>
```

set注入的优势：

创建对象时没有明确的限制，可以直接使用默认构造函数

#### ③ 集合类型的注入（本质还是set）

用于给list结构集合注入数据的标签：list、array、set

用于给Map结构集合注入数据的标签 : map、props

**结构相同，标签可以互换**



示例代码：

```java
public class AccountServiceImpl implements IAccountService {
    private String[] myStrs;
    private List<String> myList;
    private Set<String> mySet;
    private Map<String,String> myMap;
    private Properties myProps;

    public void setMyStrs(String[] myStrs) {
        this.myStrs = myStrs;
    }

    public void setMyList(List<String> myList) {
        this.myList = myList;
    }

    public void setMySet(Set<String> mySet) {
        this.mySet = mySet;
    }

    public void setMyMap(Map<String, String> myMap) {
        this.myMap = myMap;
    }

    public void setMyProps(Properties myProps) {
        this.myProps = myProps;
    }

    @Override
    public void saveAccount() {
        System.out.println(Arrays.toString(myStrs));
        System.out.println(myList);
        System.out.println(mySet);
        System.out.println(myMap);
        System.out.println(myProps);
    }
}
```

```xml
<bean id = "accountService" class = "com.smallbeef.service.impl.AccountServiceImpl">

        <property name="myStrs">
            <array>
                <value>A</value>
                <value>B</value>
                <value>C</value>
            </array>
        </property>

        <property name="myList">
            <list>
                <value>A</value>
                <value>B</value>
                <value>C</value>
            </list>
        </property>

        <property name="mySet">
            <set>
                <value>AAA</value>
                <value>BBB</value>
                <value>CCC</value>
            </set>
        </property>

        <property name="myMap">
            <map>
                <entry key="testA" value="A"></entry>
                <entry key="testB">
                    <value>B</value>
                </entry>
            </map>
        </property>

        <property name="myProps">
            <props>
                <prop key="testC">C</prop>
                <prop key="testD">D</prop>
            </props>
        </property>

    </bean>
```



### 注解配置

下面注解的的作用和在 XML 配置文件的 bean 标签中编写一个 property 标签实现的功能是一样的（set方法注入）

#### ① @Autowired

作用：  自动按照类型注入。
出现位置：变量和方法上都可以

<u>当使用注解注入属性时，set方法可以省略。</u>
它只能注入其他 bean 类型。
在 Spring 容器查找，找到了注入成功。找不到 就报错。 

当有多个 类型匹配时，使用 要注入的对象变量名称 作为 bean 的 id

**示例代码：**

```java
@Component
public class AccountServiceImpl implements IAccountService {

    @Autowired
    private IAccountDao accountDaoImpl;

    @Override
    public void saveAccount() {
        accountDaoImpl.saveAccount();
    }
}
```

- **只有一个相符合的bean时，直接匹配数据类型**

- **有多个相符合的bean时，先匹配数据类型，再将变量名称和bean的id进行匹配**

  当变量名称找不到一样的 bean 的 id 的时候，就会报错。
  为解决变量名称和 bean 的 id 不匹配的情况，有了如下注解 `Qualifier`。

#### ② @Qualifier

作用：  在自动按照类型注入的基础之上，再按照 Bean 的 id 注入。
**它在给成员变量注入时不能独立使用，必须和 `@Autowire` 一起使用；但是给方法参数注入时，可以独立使用**
属性：  value：指定 bean 的 id。 

**示例代码：**

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

#### ③ @Resource

作用：  直接按照 Bean 的 id 注入。**可以独立使用**（相当于Autowired + Qualifier）。它也只能注入其他 bean 类型。
 属性：  **name**：指定 bean 的 id (可不写)。 

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



以上三个注解都只能能注入其他 bean 类型的数据，而基本类型和String类型无法使用上述注解实现(用 `@Value` 实现)。
**另外，集合类型的注入只能通过 XML 来实现**

#### ④ @Value

作用：  **注入基本数据类型和 String 类型的数据** 。和 依赖注入 Xml 配置中的value属性作用相同
属性：  value：用于指定值。它可以使用 Spring 中 `SpEL`（也就是spring中的EL表达式, `${表达式}`）

例如：

```java
@Value("王老师")
private String name;
```

或者在 classpath 目录下新建一个 config.properties 文件

```text
name = 王老师
```

使用 SpEl 表达式取值

```java
@Value("${name}")
private String name;
```

## 5. Spring的纯注解配置

### ① @Comfiguration 配置类

作用：  用于指定当前类是一个 Spring 配置类，当创建容器时会从该类上加载注解。
获取容器时需要使用 `AnnotationApplicationContext`(有 `@Configuration` 注解的类 `.class`)。 
属性：  value:用于指定配置类的字节码 

细节：当配置类作为 `AnnotationConfigApplicationContext` 对象创建的参数时，该配置类上的 `@Configuration` 注解可以不写

读取配置类：

```java
ApplicationContext ac = new AnnotationConfigApplicationContext(SpringConfiguration.class);
```

### ② @ComponentScan 自动化扫描

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

### ③ @Bean 配置方法

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


### ④ @Import 导入其他配置类

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

### ⑤ @PropertySource 加载 .pro文件配置

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

<br>



# 三、IoC 实例

---



通过下面的一个实例将上述所学的所有知识点串起来，加深对IoC的理解和使用

一个简单的学校例子。假设有两种角色，老师和班长

**老师：**

```java
public class Teacher {

    /**
     * 姓名
     */
    private String name = "王老师";

    /**
     * 教授科目
     */
    private String major = "数学";

    /**
     * 教授课程班级的班长
     */
    private ClassMonitor classMonitor = new ClassMonitor();

    /**
     * 老师会上课
     */
    public void teachLesson() {

    }

    /**
     * 老师要收作业，然而老师并不亲自收，而是交给班长收
     */
    public void collectHomework() {
        classMonitor.collectHomework();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public ClassMonitor getClassMonitor() {
        return classMonitor;
    }

    public void setClassMonitor(ClassMonitor classMonitor) {
        this.classMonitor = classMonitor;
    }
}
```

 老师有自己的名字和教授的科目两个属性，这属于老师的静态属性。老师有很多“功能“，比如上课和收作业。上课属于老师可以自己完成的功能，而收作业则需要班长帮忙。**所以老师为了完成自己的工作是不能独立存在的，需要依赖班长。**

**班长：** 这里我们假设班长只有一个功能，就是收作业。

```java
public class ClassMonitor {

    public void collectHomework(){
        System.out.println("开始收作业了！");
        System.out.println("收作业完毕");
    }
}
```

上面的例子很好的说明了对象之间相互依赖共同合作的方法，即互相依赖。这些功能交给 Spring 之后管理起来就方便多了，以 Xml 的方式为例，需要如下配置：

```xml
<bean id="classMonitor" class="org.smallbeef.controller.ClassMonitor"/>
<bean id="teacher" class="org.smallbeef.controller.Teacher">
     <property name="name" value="王老师"/>
     <property name="major" value="数学"/>
     <property name="classMonitor" ref="classMonitor"/>
</bean>

```

 通过这种配置的方式之后，**实体之间的依赖关系变得一清二楚**。比如Teacher的名字，科目，所依赖的班长是哪个，只看配置文件就可以一目了然。但是，当实体变多了之后，可想而知，这个 Xml 配置文件将庞大的不可想象，就更不要提可读性了。

<br>

于是 Spring 从3.0开始推出了基于注解的形式，来简化配置。

首先需要在xml文件中开启自动化扫描

```xml
 <!--告知Spirng在创建容器时要扫描的包，配置所需要的标签不是在beans的约束中，而是一个名称为context空间和约束中-->
<context:component-scan base-package="com.smallbeef"></context:component-scan>
```

**老师：**

```java
@Component
public class Teacher {

    /**
     * 姓名
     */
    @Value("王老师")
    private String name;

    /**
     * 教授科目
     */
    @Value("数学")
    private String major;

    /**
     * 教授课程班级的班长
     */
    @Resource
    private ClassMonitor classMonitor;

    /**
     * 老师会上课
     */
    public void teachLesson() {

    }

    /**
     * 老师要收作业，然而老师并不亲自收，而是交给班长收
     */
    public void collectHomework() {
        classMonitor.collectHomework();
    }
}
```

 通过注解的形式已经减少了大量的get、set方法，通过 @Resource 注入了依赖的班长，并且通过 @Value 注入了老师的姓名和科目。(当然 @Value 也可以通过 SpEl 表达式 获取 properties 文件中的值)

<br>



# 四、AOP

---



## 1. AOP 概念

`Aspect Oriented Programming: 面向切面编程`。通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术。降低耦合，提高程序的可重用性，同时提高开发效率。

简单的说：就是把程序中重复的代码抽取出来，在需要执行的时候，使用动态代理的技术，在不修改源码的基础上，对我们的已有方法进行增强。

AOP常见的使用场景：

- 日志
- 事务
- 数据库操作
- ....

这些操作中，无一例外有很多模板化的代码，而解决模板化的代码，消除臃肿就是 AOP 的强项

## 2. AOP 的优势

- 降低耦合
- 减少重复代码
- 提高开发效率
- 维护方便

## 3. AOP实现 — 动态代理

**动态代理：** 
当想要给<u>实现了某个接口的类中的方法</u>加一些额外的处理。比如说加日志，加事务等。
可以给这个类创建一个代理，**故名思议就是创建一个新的类，这个类不仅包含原来类方法的功能，而且还在原来的基础上添加了额外处理的新类**。

这个代理类并不是定义好的，是动态生成的。具有解耦意义，灵活，扩展性强。可以在运行期动态创建某个interface 的实例。

<br>

**如何实现动态代理？**

:point_right: 详细参照此篇博客 ：[你真的完全了解Java动态代理吗？看这篇就够了](https://www.jianshu.com/p/95970b089360)

Java标准库提供了动态代理功能，允许在运行期动态创建一个接口的实例；

动态代理是通过` Proxy` 创建代理对象，然后将接口方法“代理”给 `InvocationHandler` 完成的。

实例代码如下：
```java
/**
 * 定义一个接口
 */
interface Hello{
    void morning(String name);
}

/**
 * 动态代理创建接口实例
 */
public class dynamic_proxy{
    public static void main(String[] args) {
        InvocationHandler handler = new InvocationHandler(){
        
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                System.out.println(method);
                // 增强moring方法
                if(method.getName().equals("morning")){
                    System.out.println("Good Morning," + args[0]);
                }
                return null;
            }
        };
        
        Hello hello = (Hello) Proxy.newProxyInstance(Hello.class.getClassLoader(), new Class[]{Hello.class}, handler);
        hello.morning("Jack");
        

    }
}
```

在运行期动态创建一个interface实例的方法如下：

1. 首先必须定义一个接口 Hello（被代理）

2. 定义一个 `InvocationHandler` 实例，它负责实现接口方法 morning 的调用；

3. 通过 `Proxy.newProxyInstance()` 创建接口 Hello 实例的代理对象，它需要3个参数：
	- **参数1：**使用的 `ClassLoader` 类加载器。通常就是接口类的ClassLoader；
	
	  (因为代理的是 Hello，所以用加载 Hello 的类加载器。)

	- **参数2：**需要实现的接口数组，至少需要传入一个接口进去；
	- **参数3：**用来处理接口方法调用的 InvocationHandler 实例。
	
4. 将返回的 Object 强制转型为接口。



## 4. 切入点表达式

### ① 切入点表达式的作用

切入点表达式的作用是：指明要对业务层中哪些方法增强

### ② 切入点表达式的写法

表达式：

**访问修饰符  返回值  包名.包名.包名...类名.方法名(参数列表)**
<br>
**标准的表达式写法：**

 ```xml
public void com.smallbeef.service.impl.AccountServiceImpl.saveAccount()
 ```

**访问修饰符可以省略**

```xml
 void com.smallbeef.service.impl.AccountServiceImpl.saveAccount()
```
**返回值可以使用通配符，表示任意返回值**

   * `com.smallbeef.service.impl.AccountServiceImpl.saveAccount()`

     表示任意包。但是有几级包，就需要写几个 `*.`

   * `*.*.*.*.AccountServiceImpl.saveAccount())`

     `..` 表示当前包及其子包

   * `*..AccountServiceImpl.saveAccount()`

     使用 * 来实现通配

   * `*..*.*()`

     可以直接写数据类型：

     基本类型直接写名称，比如 int

     引用类型写 <u>包名.类名</u> 的方式   java.lang.String

     可以使用通配符表示任意类型，但是必须有参数

     **可以使用 ` .. ` 表示有无参数均可，有参数可以是任意类型**

     全通配写法：`*..*.*(..)`

- **实际开发中切入点表达式的通常写法：切到业务层实现类下的所有方法**

​		`* com.smallbeef.service.impl.*.*(..)`

### ③ 通用化切入点表达式

配置切入点表达式，方便代码书写

id属性用于指定表达式的唯一标识。expression属性用于指定表达式内容

此标签写在 `aop:aspect` 标签 **内部** 只能当前切面使用。

它还可以写在 `aop:aspect` **外面**，此时就变成了所有切面可用

**注：该标签必须写在切面之前**

```java
<aop:pointcut id="pt1" expression="execution(* com.smallbeef.service.impl.*.*(..))"></aop:pointcut>
```

通过 `point-ref` 属性引用

```java
<aop:before method="beforePrintLog" pointcut-ref="pt1" ></aop:before>
```

## 5. 五种通知类型

- **前置通知**：在切入点方法执行之前执行
- **后置通知**：在切入点方法正常执行之后值。它和异常通知永远只能执行一个
- **异常通知：**在切入点方法执行产生异常之后执行。它和后置通知永远只能执行一个
- **最终通知**：无论切入点方法是否正常执行它都会在其后执行
- **环绕通知**：它是 Spring 框架为我们提供的一种可以在代码中手动控制增强方法何时执行的方式

### ① 前置通知

```xml
<!-- 配置前置通知：在切入点方法beforePrintLog执行之前执行-->
<aop:before method="beforePribeforePrintLogntLog" pointcut-ref="pt1" ></aop:before>
```

### ② 后置通知

```xml
<!-- 配置最终通知：无论切入点方法afterReturningPrintLog是否正常执行它都会在其后面执行-->
<aop:after-returning method="afterReturningPrintLog" pointcut-ref="pt1"></aop:after>
```

### ③ 异常通知

```xml
 <!-- 配置异常通知：在切入点方法afterThrowingPrintLog执行产生异常之后执行。它和后置通知永远只能执行一个-->
<aop:after-throwing method="afterThrowingPrintLog" pointcut-ref="pt1"></aop:after-throwing>
```

### ④ 最终通知

```xml
<!-- 配置最终通知：无论切入点方法是否正常执行它都会在其后面执行-->
<aop:after method="afterPrintLog" pointcut-ref="pt1"></aop:after>
```

### ⑤ 环绕通知

它是 Spring 框架为我们提供的一种可以在代码中手动控制增强方法何时执行的方式

```xml
<!-- 配置环绕通知 -->
<aop:around method="aroundPringLog" pointcut-ref="pt1"></aop:around>
```

Spring框架为我们提供了一个接口：`ProceedingJoinPoint`。该接口有一个方法 `proceed()`，此方法就相当于**明确调用切入点方法。**

该接口可以作为环绕通知的方法参数，在程序执行时，Spring 框架会为我们提供该接口的实现类供我们使用。

```java
public Object aroundPringLog(ProceedingJoinPoint pjp){
        Object rtValue = null;
        try{
            Object[] args = pjp.getArgs();//得到方法执行所需的参数

            System.out.println("Logger类中的aroundPringLog方法开始记录日志了。。。前置通知");

            rtValue = pjp.proceed(args);//明确调用业务层方法（切入点方法）

            System.out.println("Logger类中的aroundPringLog方法开始记录日志了。。。后置通知");

            return rtValue;
        }catch (Throwable t){
            System.out.println("Logger类中的aroundPringLog方法开始记录日志了。。。异常通知");
            throw new RuntimeException(t);
        }finally {
            System.out.println("Logger类中的aroundPringLog方法开始记录日志了。。。最终通知");
        }
}
```

要增加的方法在 `proceed` 之前调用就是前置通知，在之后调用就是后置通知，

在异常中调用就是异常通知，在 finally 中调用就是最终通知

## 6. XML 配置 AOP

### ① 导入约束和依赖

```xml
?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">
  		
  	<dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>

        <!--负责解析切入点表达式-->
        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>1.8.7</version>
        </dependency>
    </dependencies>
  		
</beans>
```

### ② 配置Spring 的 IoC

比如：

```xml
<!-- 配置srping的Ioc,把service对象配置进来-->
<bean id="accountService" class="com.smallbeef.service.impl.AccountServiceImpl"></bean>
```

当然也可以用 < component-scan > + @Component 或者纯注解配置 IoC

### ③ 配置 AOP

- 使用 `aop:config` 标签表明开始 AOP 的配置

- 使用 `aop:aspect` 标签表明配置切面

  - id 属性：是给切面提供一个唯一标识

  - ref 属性：是指定通知类 bean 的 id。

- 在 `aop:aspect` 标签的内部使用对应标签来配置**通知的类型**（四种常用的通知类型 见下文）

  - method 属性：用于指定Logger类中哪个方法是前置通知

  - pointcut 属性：用于指定 **切入点表达式**，即指定对哪些方法进行增强

    **`execution` + 切入点表达式**



```xml
<!--配置AOP-->
<aop:config>
     <!--配置切面 -->
     <aop:aspect id="logAdvice" ref="logger">
         <!-- 配置通知的类型，并且建立通知方法和切入点方法的关联-->
         <aop:pointcut id="pt1" expression="execution(* com.smallbeef.service.impl.*.*(..))"></aop:pointcut>
         <aop:before method="printLog" pointcut-ref="pt1"></aop:before>
     </aop:aspect>
</aop:config>
```

## 7. 注解配置AOP

导入依赖和约束以及IOC配置同XML配置

首先：如果我们希望使用注解配置AOP，则需要在xml文件中配置 Spring 开启 对注解 AOP 的支持

```xml
<!-- 配置spring开启注解AOP的支持 -->
<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
```

当然，上面的这个标签等同于注解 `@EnableAspectJAutoProxy`，可在配置类中配合 @Configuration + @ComponentScan 使用

<br>

- `@Aspect` 	表示当前类是一个切面类 = < aop:aspect > 标签

- `@Pointcut` 配置切入点表达式

    ```java 
    @Pointcut("execution(* com.smallbeef.service.impl.*.*(..))")
    private void pt1(){} 
    ```

- `@Before("pt1()") ` 前置通知

- `@AfterReturning("pt1()")` 后置通知

- `@AfterThrowing("pt1()")` 异常通知

- `@After("pt1()")` 最终通知

- `@Around("pt1()")` 环绕通知

<br>

**示例:**

```java
/**
 * 用于记录日志的工具类，它里面提供了公共的代码
 */
@Component
@Aspect//表示当前类是一个切面类
public class Logger {
    /**
     * 配置切入点表达式
     */
    @Pointcut("execution(* com.smallbeef.service.impl.*.*(..))")
    private void pt1(){}

    /**
     * 前置通知
     */
    @Before("pt1()")
    public  void beforePrintLog(){
        System.out.println("前置通知Logger类中的beforePrintLog方法开始记录日志了。。。");
    }

    /**
     * 后置通知
     */
    @AfterReturning("pt1()")
    public  void afterReturningPrintLog(){
        System.out.println("后置通知Logger类中的afterReturningPrintLog方法开始记录日志了。。。");
    }
    /**
     * 异常通知
     */
    @AfterThrowing("pt1()")
    public  void afterThrowingPrintLog(){
        System.out.println("异常通知Logger类中的afterThrowingPrintLog方法开始记录日志了。。。");
    }

    /**
     * 最终通知
     */
    @After("pt1()")
    public  void afterPrintLog(){
        System.out.println("最终通知Logger类中的afterPrintLog方法开始记录日志了。。。");
    }
    
	/**
	* 环绕通知和上面四个不能同时存在
	*/
	// @Around("pt1()")
    public Object aroundPringLog(ProceedingJoinPoint pjp){
        Object rtValue = null;
        try{
            Object[] args = pjp.getArgs();//得到方法执行所需的参数

            System.out.println("Logger类中的aroundPringLog方法开始记录日志了。。。前置");

            rtValue = pjp.proceed(args);//明确调用业务层方法（切入点方法）

            System.out.println("Logger类中的aroundPringLog方法开始记录日志了。。。后置");

            return rtValue;
        }catch (Throwable t){
            System.out.println("Logger类中的aroundPringLog方法开始记录日志了。。。异常");
            throw new RuntimeException(t);
        }finally {
            System.out.println("Logger类中的aroundPringLog方法开始记录日志了。。。最终");
        }
    }
}
```

<br>



# 五、JdbcTemplate

---



JdbcTemplate 是 Spring 利用 AOP 思想封装的 JDBC  操作工具

## 1. 导入依赖和约束

```xml
<dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.6</version>
        </dependency>
    </dependencies>
```

## 2. 注解配置

首先需要创建数据库表和实体类

配置文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--配置JdbcTemplate-->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!-- 配置数据源-->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"></property>
        <property name="url" value="jdbc:mysql://localhost:3306/eesy"></property>
        <property name="username" value="root"></property>
        <property name="password" value="1234"></property>
    </bean>
</beans>
```

## 3. CRUD 操作

```java
/**
 * JdbcTemplate的CRUD操作
 */
public class JdbcTemplateDemo3 {

    public static void main(String[] args) {
        //1.加载配置文件，获取容器
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        //2.获取对象
        JdbcTemplate jt = ac.getBean("jdbcTemplate",JdbcTemplate.class);
        //3.执行操作
        //保存
		jt.update("insert into account(name,money)values(?,?)","eee",3333f);
        //更新
		jt.update("update account set name=?,money=? where id=?","test",4567,7);
        //删除
		jt.update("delete from account where id=?",8);
        //查询所有
		List<Account> accounts = jt.query("select * from account where money > ?",new BeanPropertyRowMapper<Account>(Account.class),1000f);
		for(Account account : accounts){
	           System.out.println(account);
        }
        //查询一个（查询id=1）
		List<Account> accounts = jt.query("select * from account where id = ?",new BeanPropertyRowMapper<Account>(Account.class),1);
		//get(0)表示获得第一个
		System.out.println(accounts.isEmpty()?"没有内容":accounts.get(0));

        //查询返回一行一列（使用聚合函数，但不加group by子句）
        //第二个参数指定方法的返回类型
        Long count = jt.queryForObject("select count(*) from account where money > ?",Long.class,1000f);
        System.out.println(count);


    }
}
```

在查询时，如果使用了 `BeanPropertyRowMapper`，要求查出来的字段必须和 Bean 的属性名一一对应。



<br>



# 六、事务控制

---



Spring 中的事务主要是利用 AOP 思想，简化事务的配置，可以通过 XML 配置也可以通过注解配置

## 1. Xml 配置

### ① 导入依赖和约束

```xml
<dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>

        // 事务控制
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>

        // 事务控制是基于 AOP 的
        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>1.8.7</version>
        </dependency>
</dependencies>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">
</beans>
```

### ② 配置事务管理器 DataSourceTransactionManager

```java
<!-- 配置事务管理器 -->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <!-- 注入 DataSource --> 
    <property name="dataSource" ref="dataSource"></property>
</bean>
```

### ③ 配置事务的通知

使用 `tx:advice` 标签配置事务通知
属性：

- id：给事务通知起一个唯一标识
- transaction-manager：给事务通知提供一个事务管理器引用

```xml
<!-- 事务的配置 --> 
<tx:advice id="txAdvice" transaction-manager="transactionManager"> 
</tx:advice> 
```

### ④ 配置事务要处理的方法 

在 tx:advice 标签**内部** 配置事务要处理的方法

```xml
<!-- 配置事务的通知-->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <tx:method name="*" />
            <tx:method name="find*"/>
        </tx:attributes>
</tx:advice>
```

注意：一旦配置了方法名称规则后，service 中的方法一定要按照这里的名称规则来，否则事务配置不会生效

### ⑤ 配置 AOP

```xml
<!-- 配置aop-->
<aop:config>
    <!-- 配置切入点表达式-->
    <aop:pointcut id="pt1" expression="execution(* com.smallbeef.service.impl.*.*(..))" />
    <!--建立切入点表达式和事务通知的对应关系 -->
    <aop:advisor advice-ref="txAdvice" pointcut-ref="pt1" />
</aop:config>
```

## 2. 注解配置

- 在 xml 配置文件中开启 Spring 对注解事务的支持 （替代xml配置事务管理）

    ```xml
    <!-- 开启spring对注解事务的支持-->
    <tx:annotation-driven transaction-manager="transactionManager"></tx:annotation-driven>
    ```
    
    也可以在配置类中用注解 `@EnableTransactionManagement` 替换
    
- 在需要事务支持的地方（业务层）使用 `@Transactional` 注解 （替代xml配置事务的通知和事务要处理的方法）

    ```java
    @Service
    @Transactional(propagation= Propagation.SUPPORTS,readOnly=true)//只读型事务的配置
    public class AccountServiceImpl implements IAccountService{
    
        @Autowired
        private IAccountDao accountDao;
    
        @Override
        public Account findAccountById(Integer accountId) {
            return accountDao.findAccountById(accountId);
    
        }
    
        //读写型事务配置
        @Transactional(propagation= Propagation.REQUIRED,readOnly=false)
        @Override
        public void transfer(String sourceName, String targetName, Float money) {
            System.out.println("transfer....");
                //2.1根据名称查询转出账户
                Account source = accountDao.findAccountByName(sourceName);
                //2.2根据名称查询转入账户
                Account target = accountDao.findAccountByName(targetName);
                //2.3转出账户减钱
                source.setMoney(source.getMoney()-money);
                //2.4转入账户加钱
                target.setMoney(target.getMoney()+money);
                //2.5更新转出账户
                accountDao.updateAccount(source);
        }
    }
    ```

    该注解的属性和 xml 中的属性含义一致。

    该注解可以出现在接口上，类上和方法上。 

    - 出现接口上，表示该接口的所有实现类都有事务支持。 
    - 出现在类上，表示类中所有方法有事务支持 
    - 出现在方法上，表示该方法有事务支持。 

    以上三个位置的优先级：方法 > 类 > 接口 

<br>



# 📚 References

---



- 🐴 [视频 - Spring教程IDEA版-4天-2018黑马SSM-02](https://www.bilibili.com/video/BV1Sb411s7vP?from=search&seid=8030889577744089220)

  **课程配套百度网盘资源：**

  链接：https://pan.baidu.com/s/1BYSLOwvioeqm2RU38BZ9PA

  提取码：3z59

- 🥝 公众号 江南一点雨 相关教程
- 🍬 [Spring中@Value标签的使用详解](https://www.cnblogs.com/kingszelda/p/7261156.html)