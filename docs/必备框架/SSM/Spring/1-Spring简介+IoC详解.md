# 🍧 Spring 简介 + IoC 详解

---

## 1. Spring 简介

**我们一般说 [Spring](https://spring.io/) 框架指的都是 Spring Framework，它是很多模块的集合，使用这些模块可以很方便地协助我们进行开发**。下图对应的是 Spring4.x 版本。目前最新的5.x版本中 Web 模块的 Portlet 组件已经被废弃掉，同时增加了用于异步响应式处理的 WebFlux 组件。

![](https://gitee.com/veal98/images/raw/master/img/20201220215517.png)

- **Spring Core：** 基础,可以说 Spring 其他所有的功能都需要依赖于该类库。主要提供 IoC 依赖注入功能。
- **Spring Aspects** ： 该模块为与 AspectJ 的集成提供支持。
- **Spring AOP** ：提供了面向切面的编程实现。
- **Spring JDBC** : Java 数据库连接。
- **Spring JMS** ：Java 消息服务。
- **Spring ORM** : 用于支持 Hibernate 等 ORM 工具。
- **Spring Web** : 为创建 Web 应用程序提供支持。
- **Spring Test** : 提供了对 JUnit 和 TestNG 测试的支持。

总结来说：Spring 是分层的 Java SE/EE应用 full-stack 轻量级开源框架，**以 IoC（Inverse Of Control： 控制反转）和 AOP（Aspect Oriented Programming：面向切面编程）为内核**，提供了展现层 Spring MVC 和持久层 Spring JDBC 以及业务层事务管理等众多的企业级应用技术，还能整合开源世界众多著名的第三方框架和类库，逐渐成为使用最多的Java EE 企业应用开源框架。

需要主要掌握 Spring 四个方面的功能：

- IoC / DI
- AOP
- 事务
- JDBCTemplate

## 2. 什么是 IoC

IoC（Inverse of Control:控制反转）是一种**设计思想**，就是 **将原本在程序中手动创建对象的控制权，交由Spring框架来管理。** 🚨 IoC 在其他语言中也有应用，并非 Spring 特有。 **IoC 容器是 Spring 用来实现 IoC 的载体， IoC 容器实际上就是个Map（key，value）,Map 中存放的是各种对象。**

将对象之间的相互依赖关系交给 IoC 容器来管理，并由 IoC 容器完成对象的注入。这样可以很大程度上简化应用的开发，把应用从复杂的依赖关系中解放出来。 **IoC 容器就像是一个工厂一样，当我们需要创建一个对象的时候，只需要配置好配置文件/注解即可，完全不用考虑对象是如何被创建出来的。** 在实际项目中一个 Service 类可能有几百甚至上千个类作为它的底层，假如我们需要实例化这个 Service，你可能要每次都要搞清这个 Service 所有底层类的构造函数，这可能会把人逼疯。如果利用 IoC 的话，你只需要配置好，然后在需要的地方引用就行了，这大大增加了项目的可维护性且降低了开发难度。

举个例子：

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

**这种由主动创建对象到被动创建对象的改变就叫做控制反转 IoC**。**IoC 只能解决程序间的依赖关系，别的事情都干不了**

## 3. IoC 初体验

🔸 第一步：建立`Maven`工程并导入`springframework`依赖

```java
<dependencies>
  <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>5.2.2.RELEASE</version>
  </dependency>
</dependencies>Copy to clipboardErrorCopied
```

🔸 第二步：在 resources 目录下创建 Spring 的配置文件 `spring.xml`

> 🔈 接口 `IAccountService, IAccountDao` 及其实现类 `AccountServiceImpl, AccountDaoImpl` 这里就不贴代码了

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.springframework.org/schema/beans
      http://www.springframework.org/schema/beans/spring-beans.xsd">
    
  <!--把对象的创建交给spring来管理-->
  <bean id = "accountServiceImpl" class = "com.smallbeef.service.impl.AccountServiceImpl"></bean>
  <bean id = "accountDaoImpl" class = "com.smallbeef.dao.impl.AccountDaoImpl"></bean>
</beans>
```

IoC 容器根据 id 唯一获取对象（也可以用 name 属性作为 bean 的标记，和 id 的区别不大）

> 💡 **`name `和 `id` 的区别**: `name` 支持取多个, 多个 `name` 之间用 `,` 隔开
>
> ```xml
> <bean name = "accountService1,accountService2,accountService3" class = "com.smallbeef.service.impl.AccountServiceImpl"></bean>
> ```
>
> 此时通过 `accountService1`, `accountService2`, `accountService3` 都能获取到这个 Bean

🔸 第三步：获取 Bean 对象

- **使用 `ApplicationContext` 接口加载配置文件，获取 Spring 容器**

  对于配置文件的加载方式，除了使用 `ClassPathXmlApplicationContext`(去classpath 路径下查找配置文件)，另外也可以使用`FileSystemXmlApplicationContext`（加载磁盘**任意路径下**的配置文件） 和 `AnnotationConfigApplicationContext`（读取注解创建容器）

- **利用 `getBean` 根据 bean 的 id 从容器中获取对象**

```java
public class Client {
    /**
     * 获取spring的Ioc容器，并根据id获取对象
     * @param args
     */
    public static void main(String[] args) {
        // 1.使用 ApplicationContext 接口加载配置文件，获取 spring 容器
        ApplicationContext ac = new ClassPathXmlApplicationContext("spring.xml");
        // 2.利用 getBean 根据 bean 的 id 获取对象
        IAccountService aService = (IAccountService) ac.getBean("accountServiceImpl");
        System.out.println(aService);
        IAccountDao aDao = (IAccountDao) ac.getBean("accountDaoImpl");
        System.out.println(aDao);
    }
}
```

> 💡 Spring 时代我们一般通过 XML 文件来配置 Bean，后来开发人员觉得 XML 文件来配置不太好，于是 SpringBoot 注解配置就慢慢开始流行起来。

## 4. Bean

### ① Bean 的获取

在上一节中，我们通过`ac.getBean`方法来从 Spring 容器中获取 Bean，传入的参数是 Bean 的 name 或者 id 属性。除了这种方式，**也可以直接通过 Class 去获取一个 Bean**。

```java
public class Client {
    public static void main(String[] args) {
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        IAccountService aService = ac.getBean(IAccountService.class);
        System.out.println(aService);
    }
}
```

这种方式存在一个很大的弊端，**如果存在多个实例（多个 Bean），这种方式就不可用**。

所以一般建议通过 name 或者 id 去获取 Bean 的实例

### ② Bean 的创建

#### Ⅰ Xml 配置 - 三种方式

**🔸 第一种：使用默认无参构造函数**

<u>在 Spring 的配置文件中使用 bean 标签，配以 id 和 class 属性后，且没有其他属性和标签时。采用的就是默认构造函数创建 bean 对象</u>，此时如果 bean（类） 中没有**默认无参构造函数**，将会创建失败

```xml
<bean id = "accountService" class = "com.smallbeef.service.impl.AccountServiceImpl">
```

**🔸 第二种：使用简单工厂模式的方法创建**（使用某个类中的方法创建对象，并存入 Spring 容器）

```java
  /** 
   * 模拟一个工厂类
   * 该类可能是存在于jar包中的，我们无法通过修改源码的方式来提供默认构造函数
   * 此工厂创建对象，必须先有工厂实例对象，再调用方法  
   */ 
  public class InstanceFactory {   
      public IAccountService createAccountService(){   
          return new AccountServiceImpl();  
      }
  }
```

```xml
<bean id = "InstanceFactory" class = "com.smallbeef.factory.InstanceFactory"></bean>

<bean id="accountService"  
      factory-bean="InstanceFactory"     
      factory-method="createAccountService">
</bean>
```

**🔸 第三种：使用静态工厂的方法创建对象**（使用某个类中的**静态方法**创建对象，并存入 Spring 容器）

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


#### Ⅱ 注解配置

以下注解的作用和在 XML 配置文件中编写一个 bean 标签实现的功能是一样的 , 用于把当前类对象存入 Spring 容器中

🚨 使用以下注解的时候，需要在 xml 文件中配置如下:（当然，其他的 bean 注册配置就不用写了，配合下面注解这一行就可以了）

```xml
 <!--告知Spirng在创建容器时要扫描的包，配置所需要的标签不是在beans的约束中，而是一个名称为context空间和约束中-->
<context:component-scan base-package="com.smallbeef"></context:component-scan>
```

- `@Component`

  value属性 :  用于指定 bean 的 id 。当我们不写时，他的默认值是当前类名，且首字母小写。

- `@Controller` : 一般用于表现层的注解。

- `@Service` : 一般用于业务层的注解。

- `@Repository `: 一般用于持久层的注解。 

🚨 **上述四个注解可以随意互换, 作用相同,  都是用于用于把当前类对象存入 Spring 容器中, 只不过后面三个注解提供了更具体的语义化罢了**.

```java
// 没有写 value 默认值 'accountServiceImpl'
@Service 
public class AccountServiceImpl implements IAccountService {
 	// doSomething
}
```

> 💡 也可使用配置类 +**`@ComponentScan`** 注解 (详细见下文)

### ③ Bean 的作用范围

从 Spring 容器中多次获取同一个Bean，默认情况下，获取到的实际上是同一个实例，即默认是单例的。当然，我们可以手动配置

#### Ⅰ Xml配置

```xml
<bean class = "com.smallbeef.dao.useDaoImpl" id = "userDao" scope = "prototype"/>
```

bean 标签的 `scope` 属性就是用来指定 bean 的作用范围的

- **singleton** : 默认值，单例的.    （bean对象默认是单例模式）
- **prototype** : 多例的.
- request : 作用于web应用的请求范围。WEB 项目中,Spring 创建一个 Bean 的对象,将对象存入到 request 域中.
- session : 作用于web应用的会话范围。WEB 项目中,Spring 创建一个 Bean 的对象,将对象存入到 session 域中.
- global-session :作用于集群环境的会话范围。WEB 项目中,应用在 Portlet（集群） 环境.如果没有 Portlet 环境那么 globalSession 相当于 session.

#### Ⅱ 注解配置

当然，除了使用 bean 标签在 xml 中进行配置，我们也可以在 Java 代码中使用注解 `@Scope` 来配置Bean的作用范围

```java
@Repository
@Scope("prototype")
public calss UserDao{
    public String hello(){
        return "hello";
    }
}
```

### ④ Bean 的生命周期

🔸 **单例对象：`scope="singleton"`**

一个应用只有一个对象的实例。它的作用范围就是整个引用。

生命周期：

- 对象出生：<u>当应用加载，创建容器时，对象就被创建了</u>。

- 对象活着：只要容器在，对象一直活着。

- 对象死亡：<u>当应用卸载，销毁容器时，对象就被销毁了</u>。


总结： **单例对象的生命周期和容器相同**

🔸 **多例对象：`scope="prototype"`**

每次访问对象时，都会重新创建对象实例。

生命周期：

- 对象出生：<u>当使用对象时，才会创建新的对象实例</u>。

- 对象活着：只要对象在使用中，就一直活着。

- 对象死亡：**当对象长时间不用，且没有别的对象引用时，由 java 的垃圾回收器进行回收。**


#### Ⅰ Xml 配置

`bean` 标签：

- `init-method`：指定类中的初始化方法名称。
- `destroy-method`：指定类中销毁方法名称。

```xml
<bean class = "com.smallbeef.dao.useDaoImpl" id = "userDao" scope = "prototype" init-method = "" destroy-method = ""/>
```

#### Ⅱ 注解配置

- `@PreDestroy`

  作用：  用于指定销毁方法。

- `@PostConstruct `

  作用：  用于指定初始化方法。 

## 5. 依赖注入DI

依赖注入：`Dependency Injection`。它是 Spring 框架核心 IoC 的具体实现。

我们的程序在编写时，通过控制反转，把对象的创建交给了 Spring，但是代码中不可能出现没有依赖的情况。 IoC 解耦只是降低他们的依赖关系，但不会消除。

例如：我们的业务层仍会调用持久层的方法。 那这种业务层和持久层的依赖关系，在使用 Spring 之后，就让 Spring 来维护了。

简单的说，**就是坐等框架把持久层对象传入业务层，而不用我们自己去获取。**

能注入的数据有三类：

- 基本类型和 String
- 其他 bean 类型（在配置文件中或者注解配置过的bean)
- 复杂类型/集合类型

注入的方式有三种：

  - 构造函数
  - set方法
  - 注解

下面详细讲解三种注入方式

### ①  Xml 配置

#### Ⅰ 构造函数注入

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

#### Ⅱ set 方法注入

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

set 注入的优势：

创建对象时没有明确的限制，可以直接使用默认构造函数

#### Ⅲ 集合类型的注入（本质还是set）

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

### ②  注解配置

下面注解的的作用和在 XML 配置文件的 bean 标签中编写一个 property 标签实现的功能是一样的（set方法注入）

#### Ⅰ @Autowired

作用：  自动按照类型注入。

出现位置：变量和方法上都可以

<u>当使用注解注入属性时，set 方法可以省略。</u>它只能注入其他 bean 类型。

在 Spring 容器查找，找到了注入成功。找不到 就报错。 

当有多个类型匹配时，使用要注入的 对象变量名称 作为 bean 的 id

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

#### Ⅱ @Qualifier

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

#### Ⅲ @Resource

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

以上三个注解都只能能注入其他 bean 类型的数据，而基本类型和 String 类型无法使用上述注解实现(用 `@Value` 实现)。

**另外，集合类型的注入只能通过 XML 来实现**

#### Ⅳ @Value

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

## 6. Spring的纯注解配置

以下的注解可替代 xml 配置文件中的对应属性

### ① @Configuration 配置类

**该注解用于替代整个 xml 配置文件**

作用：  **用于指定当前类是一个 Spring 配置类，当创建容器时会从该类上加载注解**。

属性：  value:用于指定配置类的字节码 

细节：当配置类作为 `AnnotationConfigApplicationContext` 对象创建的参数时，该配置类上的 `@Configuration` 注解可以不写

读取配置类：

```java
// 获取容器时需要使用 AnnotationApplicationContext(有 @Configuration 注解的类 .class)。 
ApplicationContext ac = new AnnotationConfigApplicationContext(SpringConfiguration.class);
```

### ② @ComponentScan 自动化扫描

该注解用于代替标签 `<context:component-scan base-package=" "></context:component-scan>`，可以和 `@Comfiguration` 一同放在配置类上面

作用：  **用于指定 Spring 在初始化容器时要扫描的包**。

属性：  `basePackages / value`：用于指定要扫描的包

```java
@Configuration 
@ComponentScan("com.smallbeef") 
public class JDBCConfiguration { 

} 
```

### ③ @Bean 配置方法

该注解可代替标签 `<bean id = " " class = " ">`

作用：  该注解只能写在方法上，**表明把当前方法的返回值作为 bean 对象存入 Spring 容器中。** 

属性：  name：给当前 `@Bean` 注解方法创建的对象指定一个名称(即 bean 的 id）。 默认值是当前方法的名称

细节：**当我们使用注解配置方法时，如果方法有参数，Spring 框架会去容器中查找有没有相匹配的 bean 对象，查找方法和 `AutoWired` 一样。**

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

作用：**用于导入其他配置类**，**有 `@Import` 注解的类就是主配置类**。<u>在引入其他配置类时，其他子配置类可以不用再写 `@Configuration` 注解。当然写上也没问题</u>。 

**属性：**  `value[]`：用于指定其他配置类的字节码。 

举个例子：大的 `SpringConfiguration` 类利用 `@Import` 包含小的 `JDBCConfiguration` 配置类，这样 `AnnotationConfigApplicationContext` 直接加载大的配置类，就会把这些小的配置类也都加载进来

```java
@Configuration //在 AnnotationConfigApplicationContext中做参数时可以不写该注解
@ComponentScan(basePackages = "com.smallbeef.spring") 
@Import({ JdbcConfig.class，xxxxxConfig.class, xxxxConfig.class}) 
public class SpringConfiguration { 

} 
 
public class JdbcConfig{ 

} 

-----------------------------------------------------

// 直接加载大配置类即可
ApplicationContext ac = new AnnotationConfigApplicationContext(SpringConfiguration.class);
 
```

### ⑤ @PropertySource 加载 .pro文件配置

**作用**：用于加载 `.properties` 文件中的配置。例如我们配置数据源时，可以把连接数据库的信息写到 properties 配置文件中，就可以使用此注解指定 properties 配置文件的位置。 

**属性：**  `value[]`：用于指定 properties 文件位置。**如果是在类路径下，需要写上 classpath:** 

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

我们将数据库配置放在 `.properties` 文件中，利用 `@PropertySource` 注解读取该文件，并用 `@Value` 注解传值
`jdbcConfig.properties`

```java
jdbc.driver=com.mysql.jdbc.Driver  
jdbc.url=jdbc:mysql://localhost:3306/day44_ee247_spring 
jdbc.username=root 
jdbc.password=1234
```

利用 `@Value` 取值

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

利用 `@PropertySource` 传入 properties 文件

```java
@Configuration
@ComponentScan(basePackages = "com.smallbeef.spring") 
@Import(JdbcConfig.class) 
@PropertySource("classpath:jdbcConfig.properties")
public class SpringConfiguration { 

} 
```

## 7. IoC 实例

通过下面的一个实例将上述所学的所有知识点串起来，加深对 IoC 的理解和使用

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

上面的例子很好的说明了对象之间相互依赖共同合作的方法，即互相依赖。这些功能交给 Spring 之后管理起来就方便多了，以 xml 的方式为例，需要如下配置：

```xml
<bean id="classMonitor" class="org.smallbeef.controller.ClassMonitor"/>
<bean id="teacher" class="org.smallbeef.controller.Teacher">
     <property name="name" value="王老师"/>
     <property name="major" value="数学"/>
     <property name="classMonitor" ref="classMonitor"/>
</bean>

```

 通过这种配置的方式之后，**实体之间的依赖关系变得一清二楚**。比如 Teacher 的名字，科目，所依赖的班长是哪个，只看配置文件就可以一目了然。但是，当实体变多了之后，可想而知，这个 Xml 配置文件将庞大的不可想象，就更不要提可读性了。

于是 Spring 从 3.0 开始推出了**基于注解的形式，来简化配置**。接下来我们使用 xml + 注解的方式进行演示（也就是说不使用 `@Configuration` 注解完全抛弃配置文件，保留 Spring 配置文件，但是我们只在配置文件中做很少的一部分操作）

首先需要在 xml 文件中开启自动化扫描

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

 通过注解的形式已经减少了大量的 get、set 方法，通过 `@Resource` 注入了依赖的班长，并且通过 `@Value` 注入了老师的姓名和科目。(当然 `@Value` 也可以通过 SpEl 表达式 获取 properties 文件中的值)
