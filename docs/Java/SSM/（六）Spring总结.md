# ⛵ （六）Spring 总结



# 一、 Spring简介

我们常说的 Spring 实际上 是指 `SpringFramework` ，而 SpringFramework 只是 Spring 家族的的一个分支而已。

Spring是分层的 Java SE/EE应用 full-stack 轻量级开源框架，**以 IOC（Inverse Of Control： 反转控制）和 AOP（Aspect Oriented Programming：面向切面编程）为内核**，提供了展现层 Spring MVC 和持久层 Spring JDBC 以及业务层事务管理等众多的企业级应用技术，还能整合开源世界众多 著名的第三方框架和类库，逐渐成为使用最多的Java EE 企业应用开源框架。



需要主要掌握 Spring 四个方面的功能：

- IOC / DI
- AOP
- 事务
- JDBCTemplate



# 二、 IoC

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
    <!--把对象的创建交割spring来管理-->
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



# 三、IoC 实例

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



# 四、AOP



# 五、JdbcTemplates



# 五、事务控制

