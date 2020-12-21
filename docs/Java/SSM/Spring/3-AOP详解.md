# 🐸 Spring AOP 详解

---

## 1. 什么是 AOP

`AOP 即 Aspect-Oriented Programming: 面向切面编程` 能够 **将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来**，便于**减少系统的重复代码**，**降低模块间的耦合度**，并**有利于未来的可拓展性和可维护性**。

AOP 实现的关键在于 AOP 框架自动创建的 AOP 代理，AOP 代理主要分为静态代理和动态代理：

- 以 **AspectJ** 为代表的静态代理
- 以 **Spring AOP** 为代表的动态代理

> 💡 **Spring AOP 属于运行时增强，而 AspectJ 是编译时增强。** Spring AOP 基于代理(Proxying)，而 AspectJ 基于字节码操作(Bytecode Manipulation)。
>
> **Spring AOP 已经集成了 AspectJ** ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。AspectJ 相比于 Spring AOP 功能更加强大，但是 Spring AOP 相对来说更简单
>
> 如果我们的切面比较少，那么两者性能差异不大。但是，**当切面太多的话，最好选择 AspectJ ，它比 Spring AOP 快很多**。

⭐ **Spring AOP 是基于动态代理的**，如果要代理的对象，实现了某个接口，那么Spring AOP会使用 **JDK 动态代理机制** 去创建代理对象。而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 **Cglib 动态代理机制** 生成一个被代理对象的子类来作为代理

> 🔗 关于 Java 代理可参见这篇文章 [CS-Wiki — 👦 静态代理 + JDK/CGLIB/Javassit 动态代理](https://veal98.gitee.io/cs-wiki/#/Java/Java%E5%9F%BA%E7%A1%80/10-%E4%BB%A3%E7%90%86)

如下图所示：

![](https://gitee.com/veal98/images/raw/master/img/20201221101337.png)

🚨 **AOP 和 IoC 一样，都不是 Spring 独有的，Spring 只是支持 AOP / IoC 的框架之一**

## 2. AOP 相关术语

- 🔸 **连接点（Joinpoint)** 程序执行的某个特定位置，如某个方法调用前，调用后，方法抛出异常后，这些代码中的特定点称为连接点。<u>简单来说，就是在哪加入你的逻辑增强</u>

- 🔸 **通知（Advice）** 增强是织入到目标类连接点上的一段程序代码。在 Spring 中还可为增强代码指定方位信息：

  - **前置通知(before)**:在执行业务代码前做些操作，比如获取连接对象
  - **后置通知(after)**:在执行业务代码后做些操作，无论是否发生异常，它都会执行，比如关闭连接对象
  - **异常通知（afterThrowing）**:在执行业务代码后出现异常，需要做的操作，比如回滚事务
  - **返回通知(afterReturning)**,在执行业务代码后无异常，会执行的操作
  - **环绕通知(around)**，这个目前跟我们谈论的事务没有对应的操作，所以暂时不谈

- 🔸 **切点/切入点（PointCut）** 就是<u>带有通知的连接点，在程序中主要体现为书写切入点表达式</u>

- 🔸 **目标对象（Target）** 需要被加强的业务对象

- 🔸 **织入（Weaving）** 织入就是将增强添加到对目标类具体连接点上的过程。

  织入是一个形象的说法，具体来说，就是生成代理对象并将切面内容融入到业务流程的过程。

- 🔸 **代理类（Proxy）** <u>一个类被 AOP 织入增强后，就产生了一个代理类</u>。

- 🔸 **切面（Aspect）** 切面由切点和增强组成，它既包括了横切逻辑的定义，也包括了连接点的定义，SpringAOP 就是将切面所定义的横切逻辑织入到切面所制定的连接点中。**通常来说切面是一个类（切面类），即对该类的某个方法进行增强**

<img src="https://gitee.com/veal98/images/raw/master/img/20201221102543.png" style="zoom:75%;" />

## 4. 切入点表达式

### ① 切入点表达式的作用

切入点表达式的作用是：指明要对业务层中哪些方法增强

### ② 切入点表达式的写法

**标准的表达式写法**：访问修饰符 返回值 包名.包名.包名...类名.方法名(参数列表)

 ```xml
public void com.smallbeef.service.impl.AccountServiceImpl.saveAccount()
 ```

**访问修饰符可以省略**

```xml
 void com.smallbeef.service.impl.AccountServiceImpl.saveAccount()
```

**可以使用通配符 `*`，表示任意或所有***。

对于参数列表 可以直接写数据类型：

- 基本类型直接写名称，比如 int
- 引用类型写 <u>包名.类名</u> 的方式   java.lang.String
- 可以使用通配符表示任意参数类型，但是该方法必须有参数
- 可以使用 ` .. ` 表示有无参数均可，有参数可以是任意类型

**实际开发中切入点表达式的通常写法：切到业务层实现类下的所有方法**：`* com.smallbeef.service.impl.*.*(..)`

### ③ 通用化切入点表达式

配置切入点表达式，方便代码书写

`id` 属性用于指定表达式的唯一标识。`expression` 属性用于指定表达式内容

此标签写在 `aop:aspect` 标签 **内部** 只能当前切面使用。

它还可以写在 `aop:aspect` **外面**，此时就变成了所有切面可用

**注：该标签必须写在切面之前**

```java
<aop:pointcut id="pt1" expression="execution(* com.smallbeef.service.impl.*.*(..))"></aop:pointcut>
```

通过 `point-ref` 属性引用切入点表达式（通知 + 切入点表达式 = 切入点）

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

### ② 配置 Spring 的 IoC

比如：

```xml
<!-- 配置srping的Ioc,把service对象配置进来-->
<bean id="accountService" class="com.smallbeef.service.impl.AccountServiceImpl"></bean>
```

当然也可以用 `<component-scan>` + `@Component` 或者纯注解配置 IoC

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

## 7. 注解配置 AOP

导入依赖和约束以及 IoC 配置同 xml 配置

首先：如果我们希望使用注解配置 AOP，则需要在 xml 文件中配置 Spring 开启 对注解 AOP 的支持

```xml
<!-- 配置spring开启注解AOP的支持 -->
<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
```

当然，上面的这个标签等同于注解 `@EnableAspectJAutoProxy`，可在配置类中配合 `@Configuration` + `@ComponentScan` 使用

- `@Aspect` 	表示当前类是一个切面类 = `<aop:aspect>` 标签

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
@Aspect // 表示当前类是一个切面类
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

