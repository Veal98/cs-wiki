# 思维导图

![](https://cdn.nlark.com/yuque/0/2020/png/1237282/1586271263838-ee97211d-0900-4441-8e27-aea55165a3b0.png#align=left&display=inline&height=1025&originHeight=1025&originWidth=1702&size=0&status=done&style=none&width=1702)<br />

# 一、Spring 概述

## 1. Spring是什么

我们常说的 Spring 实际上 是指 `SpringFramework` ，而 SpringFramework 只是 Spring 家族的的一个分支而已。<br />
<br />Spring是分层的 Java SE/EE应用 full-stack 轻量级开源框架，**以 IOC（Inverse Of Control： 反转控制）和 AOP（Aspect Oriented Programming：面向切面编程）为内核**，提供了展现层 Spring MVC 和持久层 Spring JDBC 以及业务层事务管理等众多的企业级应用技术，还能整合开源世界众多 著名的第三方框架和类库，逐渐成为使用最多的Java EE 企业应用开源框架。<br />

> - 在软件业，AOP为Aspect Oriented Programming的缩写，意为：面向切面编程，可以通过预编译方式和运行期动态代理实现在**不修改源代码的情况下给程序动态统一添加功能的一种技术**。AOP是OOP的延续，是软件开发中的一个热点，也是Spring框架中的一个重要内容，是函数式编程的一种衍生范型。利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。
> - 针对业务处理过程中的切面进行提取，它所面对的是**处理过程中的某个步骤或阶段**，以获得逻辑过程中各部分之间**低耦合**性的隔离效果


<br />需要主要掌握 Spring 四个方面的功能：<br />

- IOC / DI
- AOP
- 事务
- JDBCTemplate



## 2. Spring体系结构

![](https://cdn.nlark.com/yuque/0/2020/png/1237282/1586271263818-ebdb96c6-2377-4803-aa3f-e127ca9e7221.png#align=left&display=inline&height=600&originHeight=600&originWidth=864&size=0&status=done&style=none&width=864)<br />ORM: 对象关系映射（Object Relational Mapping，简称ORM）是通过使用描述**对象和数据库之间映射**的元数据，**将面向对象语言程序中的对象自动持久化到关系数据库中**。本质上就是将数据从一种形式转换到另外一种形式。<br />


## 3. Spring的优势


- **方便解耦，简化开发**<br />
通过 Spring提供的 IoC容器，可以将对象间的依赖关系交由 Spring进行控制，避免硬编码所造 成的过度程序耦合。用户也不必再为单例模式类、属性文件解析等这些很底层的需求编写代码，可 以更专注于上层的应用。
- **AOP编程的支持**<br />
通过 Spring的 AOP 功能，方便进行面向切面的编程，许多不容易用传统OOP(面向对象编程) 实现的功能可以通过 AOP 轻松应付。
- **声明式事务的支持**<br />
可以将我们从单调烦闷的事务管理代码中解脱出来，通过声明式方式灵活的进行事务的管理， 提高开发效率和质量。
- **方便程序的测试**<br />
可以用非容器依赖的编程方式进行几乎所有的测试工作，测试不再是昂贵的操作，而是随手可 做的事情。
- **方便集成各种优秀框架**<br />
Spring可以降低各种框架的使用难度，提供了对各种优秀框架（Struts、Hibernate、Hessian、Quartz 等）的直接支持。
- **降低 JavaEE API的使用难度**<br />
Spring对 JavaEE API（如 JDBC、JavaMail、远程调用等）进行了薄薄的封装层，使这些 API 的 使用难度大为降低。

---

<a name="b59bad20"></a>
# 二、IOC 的概念和作用

## 1. 程序的耦合


- 类之间的依赖
- 方法间的依赖
<br />解耦：降低程序间的依赖关系
<br />实际开发中应该做到，**编译期不依赖，运行时才依赖**



> 我们在开发中，有些依赖关系是必须的，有些依赖关系可以通过优化代码来解除的。

```java
// 账户的业务层实现类  
 public class AccountServiceImpl implements IAccountService {  
 	private IAccountDao accountDao = new AccountDaoImpl(); 
 }
```
> 上面的代码表示： 业务层调用持久层，并且此时业务层在依赖持久层的接口和实现类。如果此时没有持久层实现类，编译将不能通过。这种编译期依赖关系，应该在我们开发中杜绝。我们需要优化代码解决。
> 

> 再比如：

```java
DriverManager.registerDriver(new com.mysql.jdbc.Driver())
改为
Class.forName("com.mysql.jdbc.Driver");
```
> 原因就是：  我们的类依赖了数据库的具体驱动类（MySQL），如果这时候更换了数据库品牌（比> 如 Oracle），需要 修改源码来重新数据库驱动。这显然不是我们想要的。



## 2. 解耦的思路

使用`反射`来创建对象，而避免使用new关键字<br />

<a name="cdc152ec"></a>
## 3. 简单工厂模式解耦

### 简单工厂模式中的问题


1. 通过 Idea 创建 maven 项目
1. 编写接口及实现类



- IAccountDao
```java
  /**
   * 账户的持久层接口
   */
  public interface IAccountDao {
  
      /**
       * 模拟保存账户
       */
      void saveAccount();
  }
```

- IAccountService
```java
  /**
   * 账户业务层的接口
   */
  public interface IAccountService {
  
      /**
       * 模拟保存账户
       */
      void saveAccount();
  }
```

- AccountDaoImpl
```java
  /**
   * 账户的持久层实现类
   */
  public class AccountDaoImpl implements IAccountDao {
  
      public  void saveAccount(){
  
          System.out.println("保存了账户");
      }
  }
```

- AccountServiceImpl
```java
  /**
   * 账户的业务层实现类
   */
  public class AccountServiceImpl implements IAccountService {
  
      private IAccountDao accountDao = new AccountDaoImpl();
  
      public void  saveAccount(){
          accountDao.saveAccount();
      }
  }
```

- 模拟一个表现层（工厂），用于调用业务层 `ui/Client`
> 工厂角色负责实现创建所有实例的内部逻辑 (决定调用哪个类来创建实例)

```java
public class Client {
  public static void main(String[] args) {
      IAccountService as = new AccountServiceImpl();
      as.saveAccount();
  }
}
```

<br />**耦合性太高，所有文件缺一不可**



### 解耦（多例）

`Bean`: 可重用组件<br />
<br />`javaBean`: 用java语言编写的可重用组件。 **javaBean > 实体类**<br />
<br />解耦方法：<br />

- **需要一个配置文件（xml/properties）来配置我们的service和dao**
  - 配置的内容：唯一标识 = 全限定类名
<br />`resource/bean.properties`
```java
accountService = com.smallbeef.service.impl.AccountServiceImpl;
accountDao = com.smallbeef.service.impl.AccountDaoImpl;
```

  - 通过过读取配置文件中内容，**反射**创建对象(用简单工厂模式创建对象)
<br />`bean/BeanFactory.java`
```java
// 一个创建Bean对象的工厂
public class BeanFactory{
 //定义一个properties对象
 private static Properties props;
 //使用静态代码块为Properties对象赋值
 static{
     //实例化对象
     props = new Properties();
     //获取properties文件的流对象
     InputStream in = BeanFactory.class.getClassLoader().getResourceAsStream("bean.properties");
     try {
         props.load(in);
     } catch (IOException e) {
         e.printStackTrace();
     }
 }
 public static Object getBean(String beanName){
     Object bean = null;
     String beanPath = props.getProperty(beanName);
     try {
         // 通过反射new一个对象
         //newInstance每次都会调用默认构造函数创建对象
         bean = Class.forName(beanPath).newInstance();
     } catch (InstantiationException e) {
         e.printStackTrace();
     } catch (IllegalAccessException e) {
         e.printStackTrace();
     } catch (ClassNotFoundException e) {
         e.printStackTrace();
     }
     return bean;
 }
}
```
<br />修改创建对象的方式
```java
public class Client {
  	public static void main(String[] args) {
 //        IAccountService as = new AccountServiceImpl();
      	IAccountService as = (IAccountService) BeanFactory.getBean("accountService");
      	as.saveAccount();
  	}
  }
```
```java
public class AccountServiceImpl implements IAccountService {
//    private IAccountDao accountDao = new AccountDaoImpl();
	 private IAccountDao accountDao = (IAccountDao) BeanFactory.getBean("accountDao");
	 public void  saveAccount(){
    	 accountDao.saveAccount();
 	}
}
```
<br />`即使缺少 serviceimpl 或 daoimpl 文件代码在编译时并不会报错`<br />![](https://cdn.nlark.com/yuque/0/2020/png/1237282/1586271263831-fd5a6917-713f-487c-a6bb-1cb3ca6eb1ac.png#align=left&display=inline&height=271&originHeight=271&originWidth=778&size=0&status=done&style=none&width=778)<br />

<a name="13f83048"></a>
### 简单工厂模式解耦升级版（单例）

利用容器存储每次new出来的对象<br />

```java
// 一个创建Bean对象的工厂
public class BeanFactory{
    
    //定义一个properties对象
    private static Properties props;
    
    // 定义一个Map,用于存放我们要创建的对象，我们把它称之为容器
   	private static Map<String, Object> beans;
    
    //使用静态代码块为Properties对象赋值
    static{
        //实例化对象
        props = new Properties();
        //获取properties文件的流对象
        InputStream in = BeanFactory.class.getClassLoader().getResourceAsStream("bean.properties");
        try {
            props.load(in);
            
            //实例化容器
            beans = new HashMap<String,Object>();
            //取出配置文件中所有的key
            Enumeration keys = props.keys();
            //遍历枚举
            while(keys.hasMoreElements()){
                //取出每个key
                String key = keys.nextElement().toString();
                //根据key获取value
                String beanPath = props.getProperty(key);
                //反射创建对象
                Object value = Class.forName(beanPath).newInstance();
                //把key和value存入容器中
                beans.put(key,value);
                
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
	 /**
     * 根据Bean的名称获取对象 单例
     * @param beanName
     * @return
     */
     public static Object getBean(String beanName){
         return beans.get(beanName);
     }
    
    /**
     * 根据Bean的名称获取bean对象 多例
     * @param beanName
     * @return
     */
//    public static Object getBean(String beanName){
//        Object bean = null;
//        String beanPath = props.getProperty(beanName);
//        try {
//            // 通过反射new一个对象
//            //newInstance每次都会调用默认构造函数创建对象
//            bean = Class.forName(beanPath).newInstance();
//        } catch (InstantiationException e) {
//            e.printStackTrace();
//        } catch (IllegalAccessException e) {
//            e.printStackTrace();
//        } catch (ClassNotFoundException e) {
//            e.printStackTrace();
//        }
//        return bean;
//    }
}
```



## 4. IoC的概念

`IOC = 控制反转 = Inversion of Control`	实际上就是指对一个对象控制权的转换。<br />比如：<br />

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

<br />在这种情况下，Book 对象的控制权在 User 对象里面（**主动**），Book 和 User 高度耦合，如果其他对象需要使用 Book 对象，得重新创建，也就是说，对象的创建、初始化、销毁等操作，都要由开发者来完成。<br />
<br />如果能将这些操作交给容器来管理，开发者就可以极大的从对象的创建中解放出来。<br />
<br />使用 Spring 之后，我们可以将以上这些操作交给容器来管理。在项目启动时，将所有的 Bean 都注册到 Spring 容器中取，然后如果有其他 Bean 需要使用到这个 Bean ，则不需要自己去 new ，而是直接去 Spring 容器中去要（**被动**）。<br />
<br />**这种由主动创建对象到被动创建对象的改变就叫做控制反转 IoC**<br />
<br />**IoC 只能解决程序间的依赖关系，别的事情都干不了**


# 三、使用 Spring的 IoC解决程序耦合

## 1. 案例


- 建立`Maven`工程
- 导入`springframework`依赖
```java
 <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.2.2.RELEASE</version>
        </dependency>
    </dependencies>
```

- 创建配置文件`bean.xml`
```java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!--把对象的创建交割spring来管理-->
    <bean id = "accountService" class = "com.smallbeef.service.impl.AccountServiceImpl"></bean>
    <bean id = "accountDao" class = "com.smallbeef.dao.impl.AccountDaoImpl"></bean>
</beans>
```

<br />ioc容器根据 id 唯一获取对象
- 测试
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
<br />![](https://cdn.nlark.com/yuque/0/2020/png/1237282/1586271263880-60a99f96-fdf6-4d69-9336-2b8f78194563.png#align=left&display=inline&height=77&originHeight=77&originWidth=787&size=0&status=done&style=none&width=787)


## 2. ApplicationContext 的三个常用实现类


- `ClassPathXmlApplicationContext`

  它可以加载**类路径下**的配置文件，要求配置文件必须在类路径下。
    ```java
  ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
    ```

- `FileSystemXmlApplicationContext`

  它可以加载磁盘**任意路径下**的配置文件（必须有访问权限）
    ```java
  ApplicationContext ac = new FileSystemXmlApplicationContext("E:\\Codes\\Spring-Programs\\spring01\\src\\main\\resources\\bean.xml");
    ```

- `AnnotationConfigApplicationContext`

  它是用于读取注解创建容器的，见后续博客



## 3. BeanFactory和 ApplicationContext 的区别


- `ApplicationContext`	单例对象适用 （一般采用此接口，Spring可根据配置文件智能决定创建对象的方式）
它在创建容器时，创建对象采取的策略是采用**立即加载**的方式，也就是说，：只要一读取配置文件，默认情况下就马上会创建对象。
`ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");`
执行完这条语句即读取配置文件之后对象就被创建了
- `BeanFactory`	多例对象适用
它在创建容器时，创建对象采取的策略是采用**延迟加载**的方式，也就是说，什么时候根据id获取对象了，什么时候才真正创建对象
```java
//--------------BeanFactory-----------------
        Resource resource =  new ClassPathResource("bean.xml");
        BeanFactory factory = new XmlBeanFactory(resource);
        IAccountService aService = (IAccountService) factory.getBean("accountService");
        System.out.println(aService);
```



执行到`IAccountService aService = (IAccountService) factory.getBean("accountService");`这条语句，即对象需要被使用的时候对象才会被创建



# 四、IOC 中 bean 标签和管理对象细节

## 1. 创建bean的三种方式


- **第一种**：使用**默认无参构造函数**创建
在spring的配置文件中使用bean标签，配以id和class属性后，且没有其他属性和标签时。采用的就是默认构造函数创建bean对象，此时_如果 bean（类） 中没有**默认无参构造函数**，将会创建失败_
  
    > bean标签：
    > 作用：  用于配置对象让 spring 来创建的。  默认情况下它调用的是类中的无参构造函数。如果没有无参构造函数则不能创建成功。
    > 属性：
    > id：给对象在容器中提供一个唯一标识。用于获取对象。
    > class：指定类的全限定类名。用于反射创建对象。默认情况下调用无参构造函数。
    > scope：指定对象的作用范围。   （见bean的生命周期）
  
  ```xml
  <bean id = "accountService" class = "com.smallbeef.service.impl.AccountServiceImpl"></bean>
  ```
  
- **第二种**：Spring管理简单工厂- 使用简单工厂模式的方法创建对象(使用某个类中的方法创建对象，并存入 Spring 容器)

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



先把工厂的创建交给 spring 来管理。   然后在使用工厂的 bean 来调用里面的方法

`id` 属性：指定 bean 的 id，用于从容器中获取

`factory-bean` 属性：用于指定实例工厂 bean 的 id。

`factory-method` 属性：用于指定实例工厂中创建对象的方法。

- **第三种**：spring管理静态工厂-使用静态工厂的方法创建对象 (使用某个类中的**静态方法**创建对象，并存入Spring容器)
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



## 2. bean对象的作用范围

在 XML 或者 Java 配置（见下文） 注册的 bean ，如果多次获取，获取到的对象是否是同一个?

```java
public class Client {

    public static void main(String[] args) {
       
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        IAccountService aService1 = (IAccountService) ac.getBean("accountService");
        IAccountService aService2 = (IAccountService) ac.getBean("accountService");
        System.out.println(aService1 == aService2); 
    }
}
```



bean标签的`scope`属性：
	作用：指定bean的作用范围

​	取值：

- **singleton** : 默认值，单例的.    （bean对象默认是单例模式）
- **prototype** : 多例的.
- request : 作用于web应用的请求范围。WEB 项目中,Spring 创建一个 Bean 的对象,将对象存入到 request 域中.
- session : 作用于web应用的会话范围。WEB 项目中,Spring 创建一个 Bean 的对象,将对象存入到 session 域中.
- global-session :作用于集群环境的会话范围。WEB 项目中,应用在 Portlet（集群） 环境.如果没有 Portlet 环境那么 globalSession 相当于 session.



> 全局session![](https://cdn.nlark.com/yuque/0/2020/png/1237282/1586271263898-9a5ada68-c124-4f9b-b5a5-06a3bfcdeaff.png#align=left&display=inline&height=410&originHeight=410&originWidth=865&size=0&status=done&style=none&width=865)




## 3. bean对象的生命周期


> `bean` 标签：
>
> `init-method`：指定类中的初始化方法名称。
>
> `destroy-method`：指定类中销毁方法名称。



- **单例对象：scope="singleton"**

​	 一个应用只有一个对象的实例。它的作用范围就是整个引用。

​	生命周期：

- 对象出生：当应用加载，创建容器时，对象就被创建了。
- 对象活着：只要容器在，对象一直活着。
- 对象死亡：当应用卸载，销毁容器时，对象就被销毁了。



总结： **单例对象的生命周期和容器相同**


- **多例对象：scope="prototype"**

​	每次访问对象时，都会重新创建对象实例。

​	生命周期：

- 对象出生：当使用对象时，创建新的对象实例。
- 对象活着：只要对象在使用中，就一直活着。
- 对象死亡：**当对象长时间不用，且没有别的对象引用时，由 java 的垃圾回收器进行回收。**


# 五、spring的依赖注入 DI

## 1. 什么是依赖注入


> 依赖注入：`Dependency Injection`。它是 Spring 框架核心 ioc 的具体实现。
> 我们的程序在编写时，通过控制反转，把对象的创建交给了 spring，但是代码中不可能出现没有依赖的情况。 ioc 解耦只是降低他们的依赖关系，但不会消除。
> 例如：我们的业务层仍会调用持久层的方法。 那这种业务层和持久层的依赖关系，在使用 spring 之后，就让 spring 来维护了。
> 简单的说，**就是坐等框架把持久层对象传入业务层，而不用我们自己去获取。**



- **IOC的作用：**<br />
  降低程序间的耦合（依赖关系）

- **依赖关系的管理：**<br />
  都交给spring来管理。<br />
  在当前类需要用到其他类的对象，由spring为我们提供，我们只需要在配置文件中说明

- `依赖关系的维护：就称之为依赖注入`

- **依赖注入：**
	
  a. 能注入的数据有三类：
  
  - 基本类型和String
  - 其他bean类型（在配置文件中或者注解配置过的bean)
  - 复杂类型/集合类型<br />
  
  b. 注入的方式有三种：
  
    - 使用构造函数提供
    - 使用set方法提供
    - 使用注解提供（见后续博客）



## 2. 构造函数注入

顾名思义，就是使用类中的构造函数，给成员变量赋值。注意，赋值的操作不是我们自己做的，而是通过配置的方式，让 spring 框架来为我们注入。<br />

- 构造函数注入：<br />
	使用的便签：`constructor-arg`<br />
	标签出现的位置：bean标签的内部
- 标签中的属性：
  - `index`:指定要注入的数据在构造函数参数列表的索引位置 ，从0开始
  - `type`: 用于指定要注入的数据的数据类型，该数据类型也是构造函数中某个或某些参数的类型
  - `name`:用于给构造函数中指定名称的参数赋值
  - value:它能赋的值是基本数据类型和 String 类型
  - ref:它能赋的值是其他 bean 类型，也就是说，必须得是在配置文件中或者注解中配置过的 bean




具体代码如下：<br />

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


```java
public class Client {

    /**
     * 获取spring的Ioc容器，并根据id获取对象
     * @param args
     */
    public static void main(String[] args) {
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        IAccountService aService = (IAccountService) ac.getBean("accountService");
        aService.saveAccount();

    }
}
```


- 构造函数的优点：<br />
在获取bean对象时，注入数据是必须的操作，否则对象无法创建成功
- 缺点：<br />
改变了bean对象的实例化方式，使我们在创建对象时，**即使用不到这些数据时，也得给他们都赋值**



## 2. set方法注入 常用

顾名思义，就是在类中提供需要注入成员的 set 方法。<br />

- 涉及的标签：`property`
- 出现的位置：bean标签的内部
- 标签的属性：
  - `name`: 指定注入时所调用的set方法名称
  - `value`: 它能赋的值是基本数据类型和 String 类型
  - `ref`:它能赋的值是其他 bean 类型，也就是说，必须得是在配置文件中或者注解中配置过的 bean


<br />具体代码如下：<br />

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


- set注入的优势：<br />
	创建对象时没有明确的限制，可以直接使用默认构造函数
- 缺点：<br />
	如果某个成员必须有值，则获取对象时有可能set方法没有执行



## 3. 集合类型的注入(本质还是set)

用于给list结构集合注入数据的标签：list、array、set

用于给Map结构集合注入数据的标签 : map、props

**结构相同，标签可以互换**<br />

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

