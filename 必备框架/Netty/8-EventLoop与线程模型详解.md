# ⚡ Netty Reactor 线程模型与 EventLoop 详解

---

> 💡 在学习本章之前，推荐先阅读 👉  [底层：Linux 五种 I/O 模型详解](https://veal98.gitee.io/cs-wiki/#/Java/Java%E5%9F%BA%E7%A1%80/16.1-%E5%BA%95%E5%B1%82-Linux%E4%BA%94%E7%A7%8DIO%E6%A8%A1%E5%9E%8B%E8%AF%A6%E8%A7%A3) 以及 [底层：三种线程模型详解](https://veal98.gitee.io/cs-wiki/#/Java/Java基础/16.2-底层-线程模型详解)

## 1. EventLoop 事件循环

事件循环正如它的名字，处于一个循环之中。我们以前在编写网络程序的时候，会**使我们处理连接的逻辑 处于一个死循环之中，这样可以不断的处理客户端连接**。

下面的代码显示了典型的 `EventLoop` 逻辑：

```java
while (!terminated) {
    // 阻塞直到事件可以运行
    List<Runnable> readyEvents = blockUntilEventsReady();
    for (Runnable ev: readyEvents) {
        // 循环所有事件，并运行他们
        ev.run();
    }
}
```

**在 Netty 中使用 `EventLoop` 接口代表事件循环**，EventLoop 是从`EventExecutor `和 `ScheduledExecutorService `扩展而来，所以可以将任务直接交给 `EventLoop `执行。类关系图如下：

以下是`EventLoop`类层次结构图：

<img src="https://gitee.com/veal98/images/raw/master/img/20201212214912.png" style="zoom: 80%;" />

> 💡 在早期的 Java 多线程编程中，我们使用线程的方式一般都是继承 `Thread` 或者实现`Runnable`以此创建新的`Thread`， 这是一种比较原始且浪费资源的处理线程的方式。JDK5之后引入了`Executor `API，其核心思想是使用池化技术来重用 `Thread`，以此达到提高线程响应速度和降低资源浪费的目的。

在 `EventLoop `模型中，**`EventLoop`将有一个永远不会改变的`Thread`。即Netty会给`EventLoop`分配一个 `Thread`，在`EventLoop`生命周期之中的所有 IO 操作和事件都由这个`Thread`执行**。 根据配置和 CPU 核心的不同， Netty 可以创建多个 `EventLoop`，且单个`EventLoop`可能会服务于多个客户端`Channel`。

在`EventLoop`中，**事件或任务的执行总是以 FIFO 先进先出的顺序执行的，这样可以保证字节总是按正确的顺序被处理，消除潜在的数据损坏的可能性。**

## 2. 任务调度

有时候我们需要在指定的时间之后触发任务或者周期性的执行某一个任务，这都需要使用到任务调度。

本节介绍使用强大的 `EventLoop` 实现任务调度，还会简单介绍 Java API 的任务调度，以方便和 Netty 比较加深理解。

### ① 使用普通的 Java API 调度任务

在 Java 中使用 JDK 提供的 `ScheduledExecutorService` 实现任务调度。使用 `Executors `提供的静态方法创建 `ScheduledExecutorService`，有如下方法

Table 15.1 `java.util.concurrent.Executors`-Static methods to create a ScheduledExecutorService

| 方法                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `newScheduledThreadPool(int corePoolSize)` </br> `newScheduledThreadPool(int corePoolSize,ThreadFactorythreadFactory)` | 新建一个 `ScheduledThreadExecutorService` 用于调度命令来延迟或者周期性的执行。它将使用一个线程来执行调度的任务 |

下面的 `ScheduledExecutorService `调度任务 60 执行一次：

```java
ScheduledExecutorService executor = Executors
        .newScheduledThreadPool(10); // 新建 ScheduledExecutorService 使用10个线程

ScheduledFuture<?> future = executor.schedule(
        new Runnable() { // 新建 runnable 调度执行
            @Override
            public void run() {
                System.out.println("Now it is 60 seconds later");
            }
        }, 60, TimeUnit.SECONDS);  // 调度任务从现在开始 60 秒后执行
// do something
//

executor.shutdown();  // 关闭 ScheduledExecutorService 来释放任务完成的资源
```

### ② 使用 EventLoop 调度任务

**使用 `ScheduledExecutorService` 工作的很好，但是有局限性，比如在一个额外的线程中执行任务。如果需要执行很多任务，资源使用就会很严重**；对于像 Netty 这样的高性能的网络框架来说，严重的资源使用是不能接受的。Netty 对这个问题提供了很好的方法。

**Netty 允许使用 `EventLoop `调度任务分配到通道**，如下面代码：

```java
Channel ch = null; // Get reference to channel
ScheduledFuture<?> future = ch.eventLoop().schedule(
        new Runnable() { // 新建 runnable 用于执行调度
            @Override
            public void run() {
                System.out.println("Now its 60 seconds later");
            }
        }, 60, TimeUnit.SECONDS); // 调度任务从现在开始 60 秒后执行
```

使用 `Channel `获取其对应的 `EventLoop`，然后调用 `schedule `方法给其分配一个 `Runnable `执行。Netty 的任务调度比 JDK 的任务调度性能性能要好，这主要是由于 Netty 底层的线程模型设计的非常优秀（详见下文）。

## 3. 线程管理

Netty 线程模型的卓越性能取决于当前执行任务的 Thread，我们看一张图就明白了：

![](https://gitee.com/veal98/images/raw/master/img/20201212220248.png)

如果处理`Chanel`任务的线程正是支撑`EventLoop`的线程，那么与`Channel`的任务会被直接执行。 否则`EventLoop`会将该任务放入任务队列之中稍后执行。 需要注意的是**每个`EventLoop`都有自己的任务队列，独立于其他`EventLoop`的任务队列**。

## 4. 线程分配

每个`EventLoop`都注册在一个`EventLoopGroup`之中，一个`EventLoopGroup`可以包含多个`EventLoop`，根据不同的传输实现， `EventLoop`的创建和分配方式也不同。

### ① 非阻塞传输

**非阻塞传输 NIO 即一个`EventLoop`处理多个`Channel`，**Netty这样设计的目的就是尽可能的通过少量`Thread`来支撑大量的`Channel`， 而不是每个`Channel`都分配一个`Thread`。

<img src="https://gitee.com/veal98/images/raw/master/img/20201212220457.png" style="zoom:80%;" />

`EventLoopGroup`负责为每个新创建的`Channel`分配一个`EventLoop`，一旦一个`Channel`被分配给`EventLoop`，它将在 整个生命周期中都使用这个`EventLoop`及其`Thread`处理事件和任务。

### ② 阻塞传输

**阻塞传输即 OIO(BIO)，此种传输方式的`EventLoop`只会被分配一个`Channel`，**如下图：

<img src="https://gitee.com/veal98/images/raw/master/img/20201212220637.png" style="zoom:80%;" />

这样带来的会是线程资源的巨大消耗，导致并发量降低。

## 5. Netty 线程模型

**Netty主要靠 `NioEventLoopGroup` 线程池来实现具体的线程模型，不同的设置 `NioEventLoopGroup` 的方式就对应了不同的 Reactor 的线程模型.**

### ① 单 Reactor 单线程模型

单线程模型就是**只指定一个线程执行客户端连接和读写操**作，也就是在一个 `Reactor` 中完成，对应在 Netty 中的实现就是将 `NioEventLoopGroup` 线程数设置为 1，核心代码是：

```java
EventLoopGroup bossGroup = new NioEventLoopGroup(1);
ServerBootstrap b = new ServerBootstrap();
b.group(bossGroup)
 .channel(NioServerSocketChannel.class)
 ...
```

注意, 我们实例化了一个 `NioEventLoopGroup`, **构造器参数是 1, 表示 `NioEventLoopGroup `的线程池大小是 1**. 

然后接着我们调用 `b.group(bossGroup)` 设置了服务器端的 `EventLoopGroup`. 有些朋友可能会有疑惑: 我记得在启动服务器端的 Netty 程序时, 是需要设置 `bossGroup `和 `workerGroup `的, 为什么这里就只有一个 `bossGroup`?
其实很简单, `ServerBootstrap `重写了 `group `方法:

```java
@Override
public ServerBootstrap group(EventLoopGroup group) {
    return group(group, group);
}
```

因此当传入一个 `group` 时, 其实 `bossGroup `和 `workerGroup `就是同一个 `NioEventLoopGroup` 了。这时候因为 `bossGroup `和 `workerGroup `是同一个 `NioEventLoopGroup`, 并且这个 `NioEventLoopGroup `只有一个线程, 这样就会导致 Netty 中的 acceptor 和后续的所有客户端连接的 IO 操作都是在这一个线程中处理的. 那么对应到 Reactor 的线程模型中就相当于 **单 Reactor 单线程模型**.

### ② 单 Reactor 多线程模型

单 Reactor 多线程模型就是在一个单 Reactor 中进行客户端连接处理，然后业务处理交给线程池，核心代码如下：

```java
EventLoopGroup bossGroup = new NioEventLoopGroup(1);
EventLoopGroup workerGroup = new NioEventLoopGroup();
ServerBootstrap b = new ServerBootstrap();
b.group(bossGroup, workerGroup)
 .channel(NioServerSocketChannel.class)
 ...
```

`bossGroup `中只有一个线程, 而 `workerGroup `中的线程数默认是 CPU 核心数乘以 2, 因此对应的到 Reactor 线程模型中就是 **单 Reactor 多线程模型**.

### ③ 主从 Reactor 多线程模型

主从多线程模型是有多个 Reactor 和 线程池，核心代码如下：

```java
EventLoopGroup bossGroup = new NioEventLoopGroup(4);
EventLoopGroup workerGroup = new NioEventLoopGroup();
ServerBootstrap b = new ServerBootstrap();
b.group(bossGroup, workerGroup)
 .channel(NioServerSocketChannel.class)
 ...
```

`bossGroup` 线程池中的线程数我们设置为 4, 而 `workerGroup `中的线程数默认是 CPU 核心数乘以 2, 因此对应的到 Reactor 线程模型中就是 **主从 Reactor 多线程模型**


> 🚨 **注意**：**<u>其实 Netty 的服务器端在 acceptor 阶段并没有使用到多线程, 因此上面的主从 Reactor 多线程模型在 Netty 的服务器端是不存在的</u>**
>
> **服务器端的 `ServerSocketChannel `只绑定到了 `bossGroup` 中的一个线程**, 因此在调用 Java NIO 的 `Selector.select` 处理客户端的连接请求时, 实际上是在一个线程中的, 所以对只有一个服务的应用来说, `bossGroup `设置多个线程是没有什么作用的, 反而还会造成资源浪费.

## 📚 References

- [Gitbook - Essential Netty in Action 《Netty 实战(精髓)》](https://waylau.com/essential-netty-in-action/GETTING%20STARTED/A%20Closer%20Look%20at%20ChannelHandlers.html)
- [Gitbook - framework-learning](https://qsjzwithguang19forever.gitee.io/framework-learning/gitbook_doc/netty-learning/ByteBuf%E5%AE%B9%E5%99%A8.html)
- [知乎 - Netty系列文章之Netty线程模型](https://zhuanlan.zhihu.com/p/87630368)
- [Segmentfault - Netty 源码分析之 三 我就是大名鼎鼎的 EventLoop(一)](https://segmentfault.com/a/1190000007403873)