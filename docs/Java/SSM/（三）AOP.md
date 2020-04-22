

# 一、案例分析

```java
/**
 * 账户的业务层实现类
 *
 * 事务控制应该都是在业务层
 */
public class AccountServiceImpl implements IAccountService{

    private IAccountDao accountDao;

    public void setAccountDao(IAccountDao accountDao) {
        this.accountDao = accountDao;
    }

    @Override
    public List<Account> findAllAccount() {
       return accountDao.findAllAccount();
    }

    @Override
    public Account findAccountById(Integer accountId) {
        return accountDao.findAccountById(accountId);

    }

    @Override
    public void saveAccount(Account account) {
        accountDao.saveAccount(account);
    }

    @Override
    public void updateAccount(Account account) {
        accountDao.updateAccount(account);
    }

    @Override
    public void deleteAccount(Integer acccountId) {
        accountDao.deleteAccount(acccountId);
    }
}
```
## 1. 存在的问题
问题就是：  事务被自动控制了。换言之，我们使用了 connection 对象的 `setAutoCommit(true)`  此方式控制事务，如果我们每次都执行一条 sql 语句，没有问题，**但是如果业务方法一次要执行多条 sql 语句，这种方式就无法实现功能了。** 

请看下面的示例：  我们在业务层中多加入一个方法。 
```java
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

			int i=1/0; //此语句出错

            //2.6更新转入账户
            accountDao.updateAccount(target);
    }
```

`ini i = 1/0` 这条语句是错误的，无法执行，则 2.6 也无法执行，转账失败。
但是因为我们是每次执行持久层方法都是独立事务，导致无法实现事务控制（**不符合事务的一致性**） 

## 2. 解决问题
解决办法：  让业务层来控制事务的提交和回滚

```java

/**
 * 账户的业务层实现类
 *
 * 事务控制应该都是在业务层
 */
public class AccountServiceImpl_OLD implements IAccountService{

    private IAccountDao accountDao;
    private TransactionManager txManager;

    public void setTxManager(TransactionManager txManager) {
        this.txManager = txManager;
    }

    public void setAccountDao(IAccountDao accountDao) {
        this.accountDao = accountDao;
    }

    @Override
    public List<Account> findAllAccount() {
        try {
            //1.开启事务
            txManager.beginTransaction();
            //2.执行操作
            List<Account> accounts = accountDao.findAllAccount();
            //3.提交事务
            txManager.commit();
            //4.返回结果
            return accounts;
        }catch (Exception e){
            //5.回滚操作
            txManager.rollback();
            throw new RuntimeException(e);
        }finally {
            //6.释放连接
            txManager.release();
        }

    }

    @Override
    public Account findAccountById(Integer accountId) {
        try {
            //1.开启事务
            txManager.beginTransaction();
            //2.执行操作
            Account account = accountDao.findAccountById(accountId);
            //3.提交事务
            txManager.commit();
            //4.返回结果
            return account;
        }catch (Exception e){
            //5.回滚操作
            txManager.rollback();
            throw new RuntimeException(e);
        }finally {
            //6.释放连接
            txManager.release();
        }
    }

    @Override
    public void saveAccount(Account account) {
        try {
            //1.开启事务
            txManager.beginTransaction();
            //2.执行操作
            accountDao.saveAccount(account);
            //3.提交事务
            txManager.commit();
        }catch (Exception e){
            //4.回滚操作
            txManager.rollback();
        }finally {
            //5.释放连接
            txManager.release();
        }

    }

    @Override
    public void updateAccount(Account account) {
        try {
            //1.开启事务
            txManager.beginTransaction();
            //2.执行操作
            accountDao.updateAccount(account);
            //3.提交事务
            txManager.commit();
        }catch (Exception e){
            //4.回滚操作
            txManager.rollback();
        }finally {
            //5.释放连接
            txManager.release();
        }

    }

    @Override
    public void deleteAccount(Integer acccountId) {
        try {
            //1.开启事务
            txManager.beginTransaction();
            //2.执行操作
            accountDao.deleteAccount(acccountId);
            //3.提交事务
            txManager.commit();
        }catch (Exception e){
            //4.回滚操作
            txManager.rollback();
        }finally {
            //5.释放连接
            txManager.release();
        }

    }

    @Override
    public void transfer(String sourceName, String targetName, Float money) {
        try {
            //1.开启事务
            txManager.beginTransaction();
            //2.执行操作

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

            int i=1/0;

            //2.6更新转入账户
            accountDao.updateAccount(target);
            //3.提交事务
            txManager.commit();

        }catch (Exception e){
            //4.回滚操作
            txManager.rollback();
            e.printStackTrace();
        }finally {
            //5.释放连接
            txManager.release();
        }


    }
}

```

`TransActionManager`
```java
/**
 * 和事务管理相关的工具类，它包含了，开启事务，提交事务，回滚事务和释放连接
 */
public class TransactionManager {

    private ConnectionUtils connectionUtils;

    public void setConnectionUtils(ConnectionUtils connectionUtils) {
        this.connectionUtils = connectionUtils;
    }

    /**
     * 开启事务
     */
    public  void beginTransaction(){
        try {
            connectionUtils.getThreadConnection().setAutoCommit(false);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    /**
     * 提交事务
     */
    public  void commit(){
        try {
            connectionUtils.getThreadConnection().commit();
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    /**
     * 回滚事务
     */
    public  void rollback(){
        try {
            connectionUtils.getThreadConnection().rollback();
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    /**
     * 释放连接
     */
    public  void release(){
        try {
            connectionUtils.getThreadConnection().close();//还回连接池中
            connectionUtils.removeConnection();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
```

## 3. 新的问题
上面通过对业务层的改造，已经可以实现事务控制了，但是由于我们添加了事务控制，也产生了一个新的问题： **业务层方法变得臃肿了，里面充斥着很多重复代码**。并且业务层方法和事务控制方法耦合了。 
试想一下，如果我们此时提交，回滚，释放资源中任何一个方法名变更，都需要修改业务层的代码，况且这还只是一个业务层实现类，而实际的项目中这种业务层实现类可能有十几个甚至几十个。 

## 4. 解决问题 - 动态代理
使用 `动态代理` 技术解决
> 动态代理解析参见此篇博客：[Java - 反射/动态代理](https://blog.csdn.net/qq_41133986/article/details/104714488)

## 5. 动态代理的特点

 字节码随用随创建，随用随加载。  
 它与 静态代理 的区别也在于此。因为 静态代理 是字节码一上来就创建好，并完成加载。  
 **装饰者模式** 就是 静态代理 的一种体现。 

## 6. 动态代理常用的有两种方式
 1. **使用 JDK 官方的 Proxy 类创建代理对象**

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

2. 使用 CGLib 的 Enhancer 类创建代理对象 
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200316171140991.png)

## 7. 解决案例中的问题
```java
/**
 * 用于创建Service的代理对象的工厂
 */
public class BeanFactory {

    private IAccountService accountService;

    private TransactionManager txManager;

    public void setTxManager(TransactionManager txManager) {
        this.txManager = txManager;
    }


    public final void setAccountService(IAccountService accountService) {
        this.accountService = accountService;
    }

    /**
     * 获取Service代理对象
     * @return
     */
    public IAccountService getAccountService() {
        return (IAccountService)Proxy.newProxyInstance(accountService.getClass().getClassLoader(),
                accountService.getClass().getInterfaces(),
                new InvocationHandler() {
                    /**
                     * 添加事务的支持
                     *
                     * @param proxy
                     * @param method
                     * @param args
                     * @return
                     * @throws Throwable
                     */
                    @Override
                    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {

                        if("test".equals(method.getName())){
                            return method.invoke(accountService,args);
                        }

                        Object rtValue = null;
                        try {
                            //1.开启事务
                            txManager.beginTransaction();
                            //2.执行操作
                            rtValue = method.invoke(accountService, args);
                            //3.提交事务
                            txManager.commit();
                            //4.返回结果
                            return rtValue;
                        } catch (Exception e) {
                            //5.回滚操作
                            txManager.rollback();
                            throw new RuntimeException(e);
                        } finally {
                            //6.释放连接
                            txManager.release();
                        }
                    }
                });

    }
}
```

---
#  二、Spring 中的 AOP
## 1. 什么是 AOP
`Aspect Oriented Programming: 面向切面编程`。通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术。降低耦合，提高程序的可重用性，同时提高开发效率。

简单的说：就是把程序中重复的代码抽取出来，在需要执行的时候，使用动态代理的技术，在不修改源码的基础上，对我们的已有方法进行增强。
## 2. AOP 的作用和优势
- 降低耦合
- 减少重复代码
- 提高开发效率
- 维护方便
## 3. AOP 的实现方式
**动态代理**

<br>

# 三、基于 XML 的 AOP 配置

## 1. 代码准备
```java
/**
 * 账户的业务层接口
 */
public interface IAccountService {

    /**
     * 模拟保存账户
     */
   void saveAccount();

    /**
     * 模拟更新账户
     * @param i
     */
   void updateAccount(int i);

    /**
     * 删除账户
     * @return
     */
   int  deleteAccount();
}
```
```java
/**
 * 用于记录日志的工具类，它里面提供了公共的代码
 */
public class Logger {

    /**
     * 用于打印日志：计划让其在切入点方法执行之前执行（切入点方法就是业务层方法）
     */
    public  void printLog(){
        System.out.println("Logger类中的pringLog方法开始记录日志了。。。");
    }
}
```

利用 AOP 实现每次调用 service 的方法之前都调用 printLog 方法

## 2. 具体配置步骤
### a. 导入约束和依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
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
### b. 配置 Spring 的 IoC
```xml
<!-- 配置srping的Ioc,把service对象配置进来-->
<bean id="accountService" class="com.smallbeef.service.impl.AccountServiceImpl"></bean>

<!-- 配置Logger类 -->
<bean id="logger" class="com.smallbeef.utils.Logger"></bean>
```

### c. 配置 AOP
- 使用 `aop:config` 标签表明开始 AOP 的配置

- 使用 `aop:aspect` 标签表明配置切面

     - id 属性：是给切面提供一个唯一标识

     - ref 属性：是指定通知类 bean 的 id。

- 在 `aop:aspect` 标签的内部使用对应标签来配置**通知的类型**（四种常用的通知类型 见下文）

     - method 属性：用于指定Logger类中哪个方法是前置通知

     - pointcut 属性：用于指定 **切入点表达式**，该表达式用于指定对哪些方法进行增强    

**切入点表达式的写法：**

关键字：`execution` (表达式)

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
                       参数列表：
                可以直接写数据类型：
                    
                    基本类型直接写名称，比如 int
                
               引用类型写 <u>包名.类名</u> 的方式   java.lang.String
            
            可以使用通配符表示任意类型，但是必须有参数
            
            **可以使用 ` .. ` 表示有无参数均可，有参数可以是任意类型**
            
            全通配写法：`*..*.*(..)`

- 实际开发中切入点表达式的通常写法：切到业务层实现类下的所有方法

​		`* com.smallbeef.service.impl.*.*(..)`

```xml
 <!--配置AOP-->
    <aop:config>
        <!--配置切面 -->
        <aop:aspect id="logAdvice" ref="logger">
            <!-- 配置通知的类型，并且建立通知方法和切入点方法的关联-->
            <aop:before method="printLog" pointcut="execution(* com.smallbeef.service.impl.*.*(..))"></aop:before>
        </aop:aspect>
    </aop:config>
```

## 3. 通用化切入点表达式
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

## 4. 四种常用的通知类型 
```java
	<aop:aspect id="logAdvice" ref="logger">
            <!-- 配置前置通知：在切入点方法执行之前执行
            <aop:before method="beforePrintLog" pointcut-ref="pt1" ></aop:before>-->

            <!-- 配置后置通知：在切入点方法正常执行之后值。它和异常通知永远只能执行一个
            <aop:after-returning method="afterReturningPrintLog" pointcut-ref="pt1"></aop:after-returning>-->

            <!-- 配置异常通知：在切入点方法执行产生异常之后执行。它和后置通知永远只能执行一个
            <aop:after-throwing method="afterThrowingPrintLog" pointcut-ref="pt1"></aop:after-throwing>-->

            <!-- 配置最终通知：无论切入点方法是否正常执行它都会在其后面执行
            <aop:after method="afterPrintLog" pointcut-ref="pt1"></aop:after>-->

	 </aop:aspect>
```

```java
/**
 * 用于记录日志的工具类，它里面提供了公共的代码
 */
public class Logger {

    /**
     * 前置通知
     */
    public  void beforePrintLog(){
        System.out.println("前置通知Logger类中的beforePrintLog方法开始记录日志了。。。");
    }

    /**
     * 后置通知
     */
    public  void afterReturningPrintLog(){
        System.out.println("后置通知Logger类中的afterReturningPrintLog方法开始记录日志了。。。");
    }
    /**
     * 异常通知
     */
    public  void afterThrowingPrintLog(){
        System.out.println("异常通知Logger类中的afterThrowingPrintLog方法开始记录日志了。。。");
    }

    /**
     * 最终通知
     */
    public  void afterPrintLog(){
        System.out.println("最终通知Logger类中的afterPrintLog方法开始记录日志了。。。");
    }
}
```

## 5. 环绕通知
```java
			<!-- 配置环绕通知 -->
            <aop:around method="aroundPringLog" pointcut-ref="pt1"></aop:around>
```

-   **问题：**
  
   当我们配置了环绕通知之后，切入点方法没有执行，而通知方法执行了。
   
-  **分析：**
  
    通过对比动态代理中的环绕通知代码，发现动态代理的环绕通知有明确的切入点方法调用，而我们的代码中没有。
   
- **解决：**
  
  Spring框架为我们提供了一个接口：`ProceedingJoinPoint`。该接口有一个方法 `proceed()`，此方法就相当于**明确调用切入点方法。**
  
  该接口可以作为环绕通知的方法参数，在程序执行时，Spring 框架会为我们提供该接口的实现类供我们使用。
  
- Spring中的环绕通知：
  
    **它是 Spring 框架为我们提供的一种可以在代码中手动控制增强方法何时执行的方式。**
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

---
# 四、基于注解的 AOP 配置

## 1. XML 配置
```java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 配置spring创建容器时要扫描的包-->
    <context:component-scan base-package="com.smallbeef"></context:component-scan>

    <!-- 配置spring开启注解AOP的支持 -->
    <aop:aspectj-autoproxy></aop:aspectj-autoproxy>
</beans>
```
### 不使用 xml 的配置方式
`@ComponentScan(basePackages="com.smallbeef")` 等价于
	【<context:component-scan base-package="com.smallbeef">< /context:component-scan>】

**`@EnableAspectJAutoProxy`** 等价于 【< aop:aspectj-autoproxy>< /aop:aspectj-autoproxy >】

```java
@Configuration 
@ComponentScan(basePackages="com.smallbeef") 
@EnableAspectJAutoProxy 
public class SpringConfiguration { 

}
```

## 2. 注解替代原先 xml 中 IoC 和 AOP 的配置

`@Aspect` 	表示当前类是一个切面类 = *< aop:aspect >* 标签


`@Pointcut` 配置切入点表达式
```java 
@Pointcut("execution(* com.smallbeef.service.impl.*.*(..))")
    private void pt1(){} 
```

`@Before("pt1()") ` 前置通知

`@AfterReturning("pt1()")` 后置通知

`@AfterThrowing("pt1()")` 异常通知

`@After("pt1()")` 最终通知

`@Around("pt1()")` 环绕通知

```java
/**
 * 用于记录日志的工具类，它里面提供了公共的代码
 */
@Component("logger")
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

```java
/**
 * 账户的业务层实现类
 */
@Service("accountService")
public class AccountServiceImpl implements IAccountService{

    @Override
    public void saveAccount() {
        System.out.println("执行了保存");
        int i=1/0;
    }

    @Override
    public void updateAccount(int i) {
        System.out.println("执行了更新"+i);

    }

    @Override
    public int deleteAccount() {
        System.out.println("执行了删除");
        return 0;
    }
}
```
