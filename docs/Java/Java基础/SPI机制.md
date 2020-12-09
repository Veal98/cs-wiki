# 🚡 Java 中的 SPI 机制

---

## 1. SPI 的使用场景

我们先说 SPI 的使用场景，接下来的各种描述大家都可以代入这个场景，方便理解 😊

SPI 机制一般使用在 **插件扩展的场景**，比如说你开发了一个给别人使用的开源框架，如果你想让别人自己写个插件，插到你的开源框架里面，从而扩展某个功能，这个时候 SPI 思想就用上了。

## 2. SPI 和 API

🧡 **API  `Application Programming Interface` ：**

大多数情况下，都是 `实现方` 来制定接口并完成对接口的不同实现，`调用方` 仅仅依赖却无权选择不同实现。

- 💦 比如你开发了一个框架，并定义了很多接口及其不同的实现，用户直接调用即可实现某些功能，那么你就是实现方，用户就是调用方

💚 **SPI `Service Provider Interface` ：**是 Java 提供的一套用来被第三方实现或者扩展的 API，是一种服务提供机制，它可以用来启用框架扩展和替换组件

`调用方`来制定接口，`实现方`来针对接口来实现不同的实现。`调用方`来选择自己需要的`实现方`。

- 💦 比如你开发了一个框架，并制定了一些接口供用户自行扩展（此处的接口可以理解为标准），用户实现了接口，即对这个框架开发出了插件，那么用户（插件开发者）就是 `实现方`，你作为 `调用方` 需要根据选择来调用用户实现的接口（开发的插件）

可以这么理解，**框架的拥有者/开发者永远都是接口的制定方**，但是接口的具体实现可以由框架的拥有者/开发者或者用户（插件开发者）来进行实现，那么**谁实现了接口，谁就是 `实现方`。**

如下图所示

<img src="https://gitee.com/veal98/images/raw/master/img/20201209160323.png" style="zoom: 80%;" />

## 3. Java SPI 使用约定

在 **JDK6** 里面引进的一个新的特性 `ServiceLoader`，从官方的文档来说，它主要是用来装载一系列的 service  provider。而且 `ServiceLoader` 可以通过 service provider 的配置文件来装载指定的 service provider。当服务的提供者，提供了服务接口的一种实现之后，我们只需要在 jar 包的 `META-INF/services/` 目录里同时创建一个以**服务接口全限定命名**的文件。**该文件里就是实现该服务接口的具体实现类**。而当外部程序装配这个模块的时候，就能通过该 jar 包 `META-INF/services/` 里的配置文件找到具体的实现类名，并装载实例化，完成模块的注入。

⭐ 总结一下使用 Java SPI 需要遵循的约定：

- 当服务提供者提供了接口的一种具体实现后，在 jar 包的 `META-INF/services` 目录下创建一个以<u>服务接口全限定命名</u>的文件。<u>该文件里就是实现该服务接口的具体实现类</u>
- 接口实现类所在的 jar 包放在主程序的 classpath 中
- 主程序通过 `java.util.ServiceLoder` 动态装载实现模块，它通过扫描 `META-INF/services` 目录下的配置文件找到实现类的全限定名，把类加载到 JVM
- SPI 的实现类必须携带一个不带参数的构造方法

🎉 **通过 SPI 的方式，第三方服务模块实现接口后，在第三方的项目代码的 `META-INF/services` 目录下的配置文件指定实现类的全路径名，源码框架即可找到实现类**

## 4. Java SPI 代码示例

**步骤 1**、定义一组接口 (假设是 `org.foo.demo.IShout`)，并写出接口的一个或多个实现(假设是`org.foo.demo.animal.Dog`、`org.foo.demo.animal.Cat`)。

```java
// 框架开发/拥有者
public interface IShout {
    void shout();
}
```

```java
// 插件开发者
public class Cat implements IShout {
    @Override
    public void shout() {
        System.out.println("miao miao");
    }
}
```

```java
// 插件开发者
public class Dog implements IShout {
    @Override
    public void shout() {
        System.out.println("wang wang");
    }
}
```

**步骤 2**、在 `src/main/resources/` 下建立 `/META-INF/services` 目录， 新增一个以接口全限定命名的文件 (`org.foo.demo.IShout` 文件)，内容是要应用的实现类

文件位置

```
- src
    -main
        -resources
            - META-INF
                - services
                    - org.foo.demo.IShout
```

文件内容

```
org.foo.demo.animal.Dog
org.foo.demo.animal.Cat
```

**步骤 3**、使用 `ServiceLoader` 来加载配置文件中指定的实现。

```java
// 框架开发/拥有者（调用方）调用插件开发者（实现方）不同的接口实现
public class SPIMain {
    public static void main(String[] args) {
        ServiceLoader<IShout> shouts = ServiceLoader.load(IShout.class);
        for (IShout s : shouts) {
            s.shout();
        }
    }
}
```

代码输出：

```
wang wang
miao miao
```

## 5. Java SPI 源码分析

这样做的原理就是 `ServiceLoader` 能够读取 `META-INF/services/` 下的配置文件，获得所有能被实例化的类的名称

从上面的代码我们能看出，`ServiceLoader.load()` 其实就是 Java SPI 入口，我们来看看到底做了什么操作：

![](https://gitee.com/veal98/images/raw/master/img/20201209205520.png)

简单的说就是先找当前线程绑定的 `类加载器 ClassLoader`，如果没有就用 `SystemClassLoader`，然后清除一下缓存，再创建一个 `LazyIterator`。

那现在重点就是 `LazyIterator` 了，上面的示例代码中我们使用了 `Iterator` 来做实例循环。而 `LazyIterator `其实就是 `Iterator `的实现类。我们来看看它到底干了啥：

![](https://gitee.com/veal98/images/raw/master/img/20201209205730.png)

不管进入 `if` 分支还是 `else `分支，重点都在我框出来的代码：

`hasNextService()`：

![](https://gitee.com/veal98/images/raw/master/img/20201209205759.png)

可以看到这个方法其实就是在约定好的地方找到接口对应的文件，然后加载文件并且解析文件里面的内容。

`nextService()`：

![](https://gitee.com/veal98/images/raw/master/img/20201209205856.png)

就是**通过文件里填写的全限定名加载类，并且创建其实例放入缓存之后返回实例**。

整体的 Java SPI 的源码解析已经完毕，其实就是<u>约定一个目录，根据接口名去那个目录找到文件，文件解析得到实现类的全限定名，然后循环加载实现类和创建其实例</u>。

再用一张图来带大家过一遍：

![](https://gitee.com/veal98/images/raw/master/img/20201209205949.png)

## 6. Java SPI 思想的体现

SPI 经典的思想体现，大家平时都在用，比如说 **jdbc**。

**Java 定义了一套 jdbc 的接口，但是 Java 并没有提供 jdbc 的实现类**。我们要**根据自己使用的数据库**，比如 mysql，你就将 `mysql-jdbc-connector.jar` 引入进来；oracle，你就将 `oracle-jdbc-connector.jar` 引入进来。项目实际运行的时候，碰到使用了 jdbc 接口，他就会使用你引入的那个 jar 中提供的具体实现类。

## 7. Java SPI 机制的优缺点

🔸 **优点**：

使用 Java SPI 机制的优势是实现**解耦**，使得第三方服务模块的装配控制的逻辑与调用者的业务代码分离，而不是耦合在一起。应用程序可以根据实际业务情况启用框架扩展或替换框架组件。

相比使用提供接口 jar 包，供第三方服务模块实现接口的方式，SPI 的方式使得源框架不必关心接口的实现类的路径，可以**不用**通过下面的方式获取接口实现类：

- 代码硬编码 `import` 导入实现类
- 指定类全路径反射获取：例如在 JDBC4.0 之前，JDBC 中获取数据库驱动类需要通过`Class.forName("com.mysql.jdbc.Driver")`，类似语句先动态加载数据库相关的驱动，然后再进行获取连接等的操作
- 第三方服务模块把接口实现类实例注册到指定地方，源框架从该处访问实例

**通过 SPI 的方式，第三方服务模块实现接口后，在第三方的项目代码的 `META-INF/services` 目录下的配置文件指定实现类的全路径名，源码框架即可找到实现类**

🔸 **缺点**：

- 虽然 `ServiceLoader` 也算是使用的延迟加载，但是基本只能通过遍历全部获取，也就是接口的实现类全部加载并实例化一遍。如果你并不想用某些实现类，它也被加载并实例化了，这就造成了浪费。获取某个实现类的方式不够灵活，只能通过 `Iterator` 形式获取，不能根据某个参数来获取对应的实现类。
- 多个并发多线程使用 `ServiceLoader` 类的实例是不安全的。

## 📚 References

- [SPI 与 API - 简书 (jianshu.com)](https://www.jianshu.com/p/7e85b8ed00e2)
- [高级开发必须理解的Java中SPI机制 - 简书 (jianshu.com)](https://www.jianshu.com/p/46b42f7f593c)
- [advanced  java - Dubbo 的 SPI 思想是什么](https://doocs.gitee.io/advanced-java/#/./docs/distributed-system/dubbo-spi)
- [阿里面试真题：Dubbo的SPI机制_敖丙-CSDN博客](https://blog.csdn.net/qq_35190492/article/details/108256452)