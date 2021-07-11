# 从头捋了一遍 Java 代理机制，收获颇丰

---

前文提到，动态代理机制使用了反射，Spring 中的 AOP 由于使用了动态代理，所以也相当于使用了反射机制。那么，代理是什么？动态代理又是什么？动态代理中是如何使用反射的？全文脉络思维导图如下：

![](https://gitee.com/veal98/images/raw/master/img/20210221224531.png)

## 1. 常规编码方式

在学习代理之前，先回顾以下我们的常规编码方式：所有 `interface` 类型的变量总是通过向上转型并指向某个实例的。

1）首先，定义一个接口：

```java
public interface SmsService {
    String send(String message);
}
```

2）然后编写其实现类：

```java
public class SmsServicseImpl implements SmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}
```

3）最后创建该实现类的实例，转型为接口并调用：

```java
SmsService s = new SmsServicseImpl();
s.send("Java");
```

上述这种方式就是我们通常编写代码的方式。而代理模式和这种方式有很大的区别，且看下文。

## 2. 代理模式概述

简单来说，代理模式就是 **使用代理对象来代替对真实对象的访问，这样就可以在不修改原目标对象的前提下，提供额外的功能操作，扩展目标对象的功能。**

代理模式大致有三种角色：

- Real Subject：真实类，也就是被代理类、委托类。用来真正完成业务服务功能；
- Proxy：代理类。将自身的请求用 Real Subject 对应的功能来实现，代理类对象并不真正的去实现其业务功能；
- Subject：定义 RealSubject 和 Proxy 角色都应该实现的接口。

![](https://gitee.com/veal98/images/raw/master/img/20210221222746.png)

通俗来说，**代理模式的主要作用是扩展目标对象的功能，比如说在目标对象的某个方法执行前后你可以增加一些额外的操作，并且不用修改这个方法的原有代码**。如果大家学过 Spring 的 AOP，一定能够很好的理解这句话。

举个例子：你找了小红来帮你向小绿问话，小红就看作是代理我的代理类 Proxy，而你是 Real Subject，因为小红要传达的话其实是你说的。那么你和小红都需要实现的接口（Subject）就是说话，由于你俩都能说话，在外界看来你俩就是一样的（滑稽，大家理解就好，不用较真）

![](https://gitee.com/veal98/images/raw/master/img/20210221155754.png)

看到这里，不知道大家能不能理解了为什么委托类和代理类都需要实现相同的接口？

那是为了保持行为的一致性，在访问者看来两者之间就没有区别。这样，通过代理类这个中间层，很好地隐藏和保护了委托类对象，能**有效屏蔽外界对委托类对象的直接访问**。同时，也可以在代理类上加上额外的操作，比如**小红在说话之前会跳一段舞，外界就会觉得你在说话前会跳一段舞，所以，这就实现了委托类的功能增强**。

代理模式有静态代理和动态代理两种实现方式。

## 3. 静态代理

### 什么是静态代理

先来看静态代理的实现步骤：

1）定义一个接口（Subject）

2）创建一个委托类（Real Subject）实现这个接口

3）创建一个代理类（Proxy）同样实现这个接口

4）**将委托类 Real Subject 注入进代理类 Proxy**，在代理类的方法中调用 Real Subject 中的对应方法。这样的话，我们就可以通过代理类屏蔽对目标对象的访问，并且可以在目标方法执行前后做一些自己想做的事情。

从实现和应用角度来说，静态代理中，我们对目标对象的每个方法的增强都是手动完成的，非常不灵活（比如接口一旦新增加方法，目标对象和代理对象都要进行修改）且麻烦（需要对每个目标类都单独写一个代理类）。 实际应用场景非常非常少，日常开发几乎看不到使用静态代理的场景。

从 JVM 层面来说， **静态代理在编译时就将接口、委托类、代理类这些都变成了一个个实际的 `.class` 文件。**

### 代码示例

1）定义发送短信的接口

```java
public interface SmsService {
    String send(String message);
}
```

2）创建一个委托类（Real Subject）实现这个接口

```java
public class SmsServiceImpl implements SmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}
```

3）创建一个代理类（Proxy）同样实现这个接口

4）将委托类 Real Subject 注入进代理类 Proxy，在代理类的方法中调用 Real Subject 中的对应方法。这样的话，我们就可以通过代理类屏蔽对目标对象的访问，并且可以在目标方法执行前后做一些自己想做的事情。

```java
public class SmsProxy implements SmsService {

    // 将委托类注入进代理类
    private final SmsService smsService;

    public SmsProxy(SmsService smsService) {
        this.smsService = smsService;
    }

    @Override
    public String send(String message) {
        // 调用委托类方法之前，我们可以添加自己的操作
        System.out.println("before method send()");
        // 调用委托类方法
        smsService.send(message); 
        // 调用委托类方法之后，我们同样可以添加自己的操作
        System.out.println("after method send()");
        return null;
    }
}
```

那么，如何使用这个被增强的 `send` 方法呢？

```java
public class Main {
    public static void main(String[] args) {
        SmsService smsService = new SmsServiceImpl();
        SmsProxy smsProxy = new SmsProxy(smsService);
        smsProxy.send("Java");
    }
}
```

运行上述代码之后，控制台打印出：

```bash
before method send()
send message:java
after method send()
```

从输出结果可以看出，我们已经增强了委托类 `SmsServiceImpl`  的 `send()` 方法。

当然，从上述代码我们也能看出来，静态代理存在一定的弊端。假如说我们现在新增了一个委托类实现了 `SmsService` 接口，如果我们想要对这个委托类进行增强，就需要重新写一个代理类，然后注入这个新的委托类，非常不灵活。也就是说静态代理是一个委托了对应一个代理类，能不能**将代理类做成一个通用的**呢？为此，动态代理应用而生。

## 4. Java 字节码生成框架

在讲解动态之前，我们有必要详细说一下 `.class` 字节码文件这个东西。动态代理机制和 Java 字节码生成框架息息相关。

在上文反射中我们提到，一个 `Class` 类对应一个 `.class` 字节码文件，也就说字节码文件中存储了一个类的全部信息。字节码其实是二进制文件，内容是只有 JVM 能够识别的机器码。

解析过程这样的：JVM 读取 ` .class` 字节码文件，取出二进制数据，加载到内存中，解析字节码文件内的信息，生成对应的 `Class` 类对象：

![](https://gitee.com/veal98/images/raw/master/img/20210221223435.png)

显然，上述这个过程是在编译期就发生的。

那么，由于JVM 是通过 `.class` 字节码文件（也就是二进制信息）加载类的，如果我们在运行期遵循 Java 编译系统组织 `.class` 字节码文件的格式和结构，生成相应的二进制数据，然后再把这个二进制数据加载转换成对应的类。这样，我们不就完成了在运行时动态的创建一个类。这个思想其实也就是动态代理的思想。

![](https://gitee.com/veal98/images/raw/master/img/20210221223847.png)

在运行时期按照 JVM 规范对 `.class` 字节码文件的组织规则，生成对应的二进制数据。当前有很多开源框架可以完成这个功能，如

- ASM
- CGLIB
- Javassist
- ......

需要注意的是，**CGLIB 是基于 ASM 的**。 这里简单对比一下 ASM 和 Javassist：

- Javassist 源代码级 API 比 ASM 中实际的字节码操作更容易使用
- Javassist 在复杂的字节码级操作上提供了更高级别的抽象层。Javassist 源代码级 API 只需要很少的字节码知识，甚至不需要任何实际字节码知识，因此实现起来更容易、更快。
- Javassist 使用反射机制，这使得它比 ASM 慢。

**总的来说 ASM 比 Javassist 快得多，并且提供了更好的性能，但是 Javassist 相对来说更容易使用**，两者各有千秋。

以 Javassist 为例，我们来看看这些框架在运行时生成 `.class` 字节码文件的强大能力。

正常来说，我们创建一个类的代码是这样的：

```java
package com.samples;

public class Programmer {
    public void code(){
        System.out.println("I'm a Programmer,Just Coding.....");
    }
}
```

下面通过 Javassist 创建和上面一模一样的 `Programmer` 类的字节码：

```java
import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;
import javassist.CtNewMethod;

public class MyGenerator {
    public static void main(String[] args) throws Exception {
        ClassPool pool = ClassPool.getDefault();
          // 创建 Programmer 类        
        CtClass cc= pool.makeClass("com.samples.Programmer");
        // 定义方法
        CtMethod method = CtNewMethod.make("public void code(){}", cc);
        // 插入方法代码
        method.insertBefore("System.out.println(\"I'm a Programmer,Just Coding.....\");");
        cc.addMethod(method);
        // 保存生成的字节码
        cc.writeFile("d://temp");
    }
}
```

通过反编译工具打开 `Programmer.class` 可以看到以下代码：

![](https://gitee.com/veal98/images/raw/master/img/20210221214349.png)

恐怖如斯！

## 5. 什么是动态代理

OK，了解了 Java 字节码生成框架，可以开始学习动态代理（Dynamic Proxy）了。

回顾一下静态代理，我们把静态代理的执行过程抽象为下图：

![](https://gitee.com/veal98/images/raw/master/img/20210221165344.png)

可以看见，代理类无非是在调用委托类方法的前后增加了一些操作。委托类的不同，也就导致代理类的不同。

那么为了做一个通用性的代理类出来，我们把调用委托类方法的这个动作抽取出来，把它封装成一个通用性的处理类，于是就有了动态代理中的 `InvocationHandler` 角色（处理类）。

于是，在代理类和委托类之间就多了一个处理类的角色，这个角色主要是**对代理类调用委托类方法的这个动作进行统一的调用**，也就是由 `InvocationHandler` 来统一处理代理类调用委托类方法这个操作。看下图：

![](https://gitee.com/veal98/images/raw/master/img/20210221165429.png)

**从 JVM 角度来说，动态代理是在运行时动态生成 `.class` 字节码文件 ，并加载到 JVM 中的**。这个我们在 Java 字节码生成框架中已经提到过。

虽然动态代理在我们日常开发中使用的相对较少，但是在框架中的几乎是必用的一门技术。学会了动态代理之后，对于我们理解和学习各种框架的原理也非常有帮助，**Spring AOP、RPC 等框架的实现都依赖了动态代理**。

就 Java 来说，动态代理的实现方式有很多种，比如：

- JDK 动态代理
- CGLIB 动态代理
- Javassit 动态代理
- ......

下面详细讲解这三种动态代理机制。

## 6. JDK 动态代理机制

### 使用步骤

先来看下 JDK 动态代理机制的使用步骤：

1）定义一个接口（Subject）

2）创建一个委托类（Real Subject）实现这个接口

3）创建一个处理类并实现 `InvocationHandler` 接口，重写其 `invoke` 方法（在 `invoke` 方法中利用反射机制调用委托类的方法，并自定义一些处理逻辑），并将委托类注入处理类

![](https://gitee.com/veal98/images/raw/master/img/20210221171412.png)

该方法有下面三个参数：

- proxy：代理类对象（见下一步）

- method：还记得我们在上篇文章反射中讲到的 `Method.invoke` 吗？就是这个，我们可以通过它来调用委托类的方法（反射）
  
  ![](https://gitee.com/veal98/images/raw/master/img/20210220210903.png)

- args：传给委托类方法的参数列表

4）创建代理对象（Proxy）：通过 `Proxy.newProxyInstance()` 创建委托类对象的代理对象

![](https://gitee.com/veal98/images/raw/master/img/20210221171150.png)

这个方法需要 3 个参数：

- 类加载器 ClassLoader
- 委托类实现的接口数组，至少需要传入一个接口进去
- 调用的 `InvocationHandler` 实例处理接口方法（也就是第 3 步我们创建的类的实例）

也就是说：我们在通过 `Proxy` 类的 `newProxyInstance()` 创建的代理对象在调用方法的时候，实际会调用到实现了 `InvocationHandler` 接口的处理类的 `invoke() `方法，可以在 `invoke()` 方法中自定义处理逻辑，比如在方法执行前后做什么事情。

### 代码示例

1）定义一个接口（Subject）

```java
public interface SmsService {
    String send(String message);
}
```

2）创建一个委托类（Real Subject）实现这个接口

```java
public class SmsServiceImpl implements SmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}
```

3）创建一个处理类并实现 `InvocationHandler` 接口，重写其 `invoke` 方法（在 `invoke` 方法中利用反射机制调用委托类的方法，并自定义一些处理逻辑），并将委托类注入处理类

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class DebugInvocationHandler implements InvocationHandler {

    // 将委托类注入处理类（这里我们用 Object 代替，方便扩展）
    private final Object target;

    public DebugInvocationHandler(Object target) {
        this.target = target;
    }

    // 重写 invoke 方法
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws InvocationTargetException, IllegalAccessException {
        //调用方法之前，我们可以添加自己的操作
        System.out.println("before method " + method.getName());
        Object result = method.invoke(target, args);
        //调用方法之后，我们同样可以添加自己的操作
        System.out.println("after method " + method.getName());
        return result;
    }
}
```

4）定义一个创建代理对象（Proxy）的工厂类：通过 `Proxy.newProxyInstance()` 创建委托类对象的代理对象

```java
public class JdkProxyFactory {
    public static Object getProxy(Object target) {
        return Proxy.newProxyInstance(
                target.getClass().getClassLoader(),
                target.getClass().getInterfaces(),
                new DebugInvocationHandler(target)
        );
    }
}
```

5）实际使用

```java
SmsService smsService = (SmsService) JdkProxyFactory.getProxy(new SmsServiceImpl());
smsService.send("Java");
```

运行上述代码之后，控制台打印出：

```
before method send
send message:Java
after method send
```

## 7. CGLIB 动态代理机制

### 使用步骤

**JDK 动态代理有一个最致命的问题是它只能代理实现了某个接口的实现类，并且代理类也只能代理接口中实现的方法，要是实现类中有自己私有的方法，而接口中没有的话，该方法不能进行代理调用**。

为了解决这个问题，我们可以用 CGLIB 动态代理机制。

上文也提到过，CGLIB（Code Generation Library）是一个基于 ASM 的 Java 字节码生成框架，它允许我们在运行时对字节码进行修改和动态生成。原理就是**通过字节码技术生成一个子类，并在子类中拦截父类方法的调用，织入额外的业务逻辑**。关键词大家注意到没有，拦截！CGLIB 引入一个新的角色就是**方法拦截器** `MethodInterceptor`。和 JDK 中的处理类 `InvocationHandler` 差不多，也是用来实现方法的统一调用的。看下图：

![](https://gitee.com/veal98/images/raw/master/img/20210221204715.png)

另外由于 CGLIB 采用**继承**的方式，所以被代理的类不能被 `final` 修饰。

很多知名的开源框架都使用到了 CGLIB， 例如 **Spring 中的 AOP 模块中：如果目标对象实现了接口，则默认采用 JDK 动态代理，否则采用 CGLIB 动态代理**。

来看 CGLIB 动态代理的使用步骤：

1）首先创建一个委托类（Real Subject）

2）创建一个方法拦截器实现接口 `MethodInterceptor`，并重写 `intercept` 方法。`intercept` 用于拦截并增强委托类的方法（和 JDK 动态代理 `InvocationHandler` 中的 `invoke` 方法类似）

![](https://gitee.com/veal98/images/raw/master/img/20210221202434.png)

该方法拥有四个参数：

- Object var1：委托类对象

- Method var2：被拦截的方法（委托类中需要增强的方法）

- Object[] var3：方法入参

- MethodProxy var4：用于调用委托类的原始方法（底层也是通过反射机制，不过不是 `Method.invoke` 了，而是使用 `MethodProxy.invokeSuper` 方法）
  
  ![](https://gitee.com/veal98/images/raw/master/img/20210221202913.png)

3）创建代理对象（Proxy）：通过 `Enhancer.create()` 创建委托类对象的代理对象

![](https://gitee.com/veal98/images/raw/master/img/20210221203102.png)

也就是说：我们在通过 `Enhancer` 类的 `create()` 创建的代理对象在调用方法的时候，实际会调用到实现了 `MethodInterceptor` 接口的处理类的 `intercept() `方法，可以在 `intercept()` 方法中自定义处理逻辑，比如在方法执行前后做什么事情。

> 可以发现，CGLIB 动态代理机制和 JDK 动态代理机制的步骤差不多，CGLIB 动态代理的核心是方法拦截器 `MethodInterceptor` 和 `Enhancer`，而 JDK 动态代理的核心是处理类 `InvocationHandler` 和 `Proxy`。

### 代码示例

不同于 JDK 动态代理不需要额外的依赖。CGLIB 是一个开源项目，如果你要使用它的话，需要手动添加相关依赖。

```xml
<dependency>
  <groupId>cglib</groupId>
  <artifactId>cglib</artifactId>
  <version>3.3.0</version>
</dependency>
```

1）首先创建一个委托类（Real Subject）

```java
public class AliSmsService {
    public String send(String message) {
        System.out.println("send message:" + message);
        return message;
    }
}
```

2）创建一个方法拦截器实现接口 `MethodInterceptor`，并重写 `intercept` 方法

```java
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;
import java.lang.reflect.Method;

public class DebugMethodInterceptor implements MethodInterceptor {

    @Override
    public Object intercept(Object o, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        // 调用方法之前，我们可以添加自己的操作
        System.out.println("before method " + method.getName());
        // 通过反射调用委托类的方法
        Object object = methodProxy.invokeSuper(o, args);
        // 调用方法之后，我们同样可以添加自己的操作
        System.out.println("after method " + method.getName());
        return object;
    }

}
```

3）创建代理对象（Proxy）：通过 `Enhancer.create()` 创建委托类对象的代理对象

```java
import net.sf.cglib.proxy.Enhancer;

public class CglibProxyFactory {
    public static Object getProxy(Class<?> clazz) {
        // 创建动态代理增强类
        Enhancer enhancer = new Enhancer();
        // 设置类加载器
        enhancer.setClassLoader(clazz.getClassLoader());
        // 设置委托类（设置父类）
        enhancer.setSuperclass(clazz);
        // 设置方法拦截器
        enhancer.setCallback(new DebugMethodInterceptor());
        // 创建代理类
        return enhancer.create();
    }
}
```

> 从 `setSuperclass` 我们就能看出，为什么说 CGLIB 是基于继承的。

4）实际使用

```java
AliSmsService aliSmsService = 
    (AliSmsService) CglibProxyFactory.getProxy(AliSmsService.class);
aliSmsService.send("Java");
```

运行上述代码之后，控制台打印出：

```bash
before method send
send message:Java
after method send
```

### JDK 动态代理和 CGLIB 动态代理对比

1）JDK 动态代理是基于实现了接口的委托类，通过接口实现代理；而 CGLIB 动态代理是基于继承了委托类的子类，通过子类实现代理。

2）JDK 动态代理只能代理实现了接口的类，且只能增强接口中现有的方法；而 CGLIB 可以代理未实现任何接口的类。

3）就二者的效率来说，大部分情况都是 JDK 动态代理的效率更高，随着 JDK 版本的升级，这个优势更加明显。

> 提一嘴，常见的还有 **Javassist 动态代理机制**。和 CGLIB 一样，作为一个 Java 字节码生成框架，Javassist 天生就拥有在运行时动态创建一个类的能力，实现动态代理自然不在话下。 Dubbo 就是默认使用 Javassit 来进行动态代理的。

## 8. 什么情况下使用动态代理

1）设计模式中有一个设计原则是**开闭原则**，即**对修改关闭，对扩展开放**，我们在工作中有时会接手很多前人的代码，里面代码逻辑让人摸不着头脑，就很难去下手修改代码，那么这时我们就可以通过代理对类进行增强。

2）我们在使用 **RPC 框架**的时候，框架本身并不能提前知道各个业务方要调用哪些接口的哪些方法 。那么这个时候，就可用通过动态代理的方式来建立一个中间人给客户端使用，也方便框架进行搭建逻辑，某种程度上也是客户端代码和框架松耦合的一种表现。

3）**Spring 的 AOP** 机制同样也是采用了动态代理，此处不做详细讨论。

## 9. 静态代理和动态代理对比

1）**灵活性** ：动态代理更加灵活，不需要必须实现接口，可以直接代理实现类，并且可以不需要针对每个目标类都创建一个代理类。另外，静态代理中，接口一旦新增加方法，目标对象和代理对象都要进行修改，这是非常麻烦的

2）**JVM 层面** ：静态代理在编译时就将接口、实现类、代理类这些都变成了一个个实际的 `.class` 字节码文件。而动态代理是在运行时动态生成类字节码，并加载到 JVM 中的。

## 10. 总结

全部捋一遍下来还是收获蛮多的，我感觉只要理解了字节码在编译期生成还是在运行期生成，就差不多能够把握住静态代理和动态代理了。总结一下静态代理和动态代理中的角色：

静态代理：

- Subject：公共接口
- Real Subject：委托类
- Proxy：代理类

JDK 动态代理：

- Subject：公共接口
- Real Subject：委托类
- Proxy：代理类
- **InvocationHandler**：处理类，统一调用方法

CGLIB 动态代理：

- Subject：公共接口
- Real Subject：委托类
- Proxy：代理类
- **MethodInterceptor**：方法拦截器，统一调用方法

## 参考资料

- 《Java 核心技术 - 卷 1 基础知识 - 第 10 版》
- 《Thinking In Java（Java 编程思想）- 第 4 版》
- JavaGuide：https://snailclimb.gitee.io/javaguide
- 亦山 — Java动态代理机制详解（JDK 和CGLIB，Javassist，ASM）：https://blog.csdn.net/luanlouis/article/details/24589193