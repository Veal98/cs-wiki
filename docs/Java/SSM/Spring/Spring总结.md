

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