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

## 5. 基于注解的IoC



# 三、AOP



# 四、JdbcTemplates



# 五、事务控制

