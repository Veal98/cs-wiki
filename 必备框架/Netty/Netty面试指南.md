# 🎯 Netty 面试指南

---

## 1. Netty 是什么

- Netty 是一个 **基于 NIO** 的 Client-Server(客户端服务器)框架，使用它可以快速简单地开发网络应用程序。
- 它极大地简化并优化了 TCP 和 UDP 套接字服务器等网络编程, 并且性能以及安全性等很多方面甚至都要更好。
- **支持多种协议** 如 FTP，SMTP，HTTP 以及各种二进制和基于文本的传统协议。

很多开源项目比如我们常用的 Dubbo、RocketMQ、Elasticsearch、gRPC 等等都用到了 Netty。

## 2. 为什么要用 Netty

详细可见 👉 [从 BIO、NIO 到 Netty](https://veal98.gitee.io/cs-wiki/#/Java/Netty/1-从BIONIO到Netty?id=⌛-从-bio、nio-到-netty)

- 传统的同步阻塞式通信 **BIO** 只能同时处理一个客户端的连接，如果需要管理多个客户端的话，就需要为我们请求的客户端单独创建一个线程，这样会造成资源浪费。虽然我们可以使用线程池，但是也改变不了它底层仍然是同步阻塞的 BIO 模型的事实，因此无法从根本上解决问题。
- 为了解决上述的问题，Java 1.4 中引入了 **NIO** ，一种同步非阻塞的 I/O 模型。但是使用 NIO 编写代码太复杂
- 为此，**Netty** 应用而生。Netty 是一个 NIO 客户端服务器框架，使用它可以快速简单地开发网络应用程序。优点如下：
  - 统一的 API，支持多种传输类型，阻塞和非阻塞的。
  - 简单而强大的线程模型。
  - 自带编解码器解决 TCP 粘包/拆包问题。
  - 自带各种协议栈。
  - 真正的无连接数据包套接字支持。
  - 比直接使用 Java 核心 API 有更高的吞吐量、更低的延迟、更低的资源消耗和更少的内存复制。
  - 安全性不错，有完整的 SSL/TLS 以及 StartTLS 支持。
  - 社区活跃
  - 成熟稳定，经历了大型项目的使用和考验，而且很多开源项目都使用到了 Netty， 比如我们经常接触的 Dubbo、RocketMQ 等等。
  - ......

## 3. Netty 的应用场景

Netty 主要用来做**网络通信** :

1. **作为 RPC 框架的网络通信工具** ：我们在分布式系统中，不同服务节点之间经常需要相互调用，这个时候就需要 RPC 框架了。不同服务节点之间的通信就可以使用 Netty 来做。
2. **实现一个自己的 HTTP 服务器** ：通过 Netty 我们可以自己实现一个简单的 HTTP 服务器（常用的 HTTP 服务器比如 Tomcat）。一个最基本的 HTTP 服务器可要以处理常见的 HTTP Method 的请求，比如 POST 请求、GET 请求等等。
3. **实现一个即时通讯系统** ：使用 Netty 我们可以实现一个可以聊天类似微信的即时通讯系统，这方面的开源项目还蛮多的，可以自行去 Github 找一找。
4. **实现消息推送系统** ：市面上有很多消息推送系统都是基于 Netty 来做的。
5. ......

## 4. Netty 核心组件有哪些？分别有什么作用？

- `Bytebuf`（字节容器）
- `Bootstrap `和 `ServerBootstrap `（启动引导类）
- `Channel`（网络操作抽象类）
- `EventLoop `（事件循环）
- `ChannelHandler `（消息处理器）和 `ChannelPipeline `（ChannelHandler 对象链表）
- `ChannelFuture`（操作执行结果）

通过下面这张图你可以将我提到的这些 Netty 核心组件串联起来：

![](https://gitee.com/veal98/images/raw/master/img/20201210152621.png)

### ① Bytebuf 字节容器

**网络通信最终都是通过字节流进行传输的**。 **Netty 使用自建的 buffer API，而不是使用 NIO 的 `ByteBuffer` 来存储连续的字节序列**。与 `ByteBuffer `相比这种方式拥有明显的优势。Netty 使用新的 buffer 类型 `ByteBuf`，被设计为一个可从底层解决 `ByteBuffer `问题，并可满足日常网络应用开发需要的缓冲类型。这些很酷的特性包括：

- 如果需要，允许使用自定义的缓冲类型。
- 复合缓冲类型中内置的透明的零拷贝实现。
- 开箱即用的动态缓冲类型，具有像 `StringBuffer `一样的动态缓冲能力。
- 不再需要调用的 `flip()` 方法。
- 正常情况下具有比 `ByteBuffer `更快的响应速度。

### ② Bootstrap 和 ServerBootstrap（启动引导类）

**`Bootstrap` 是客户端的启动引导类/辅助类**，不管程序使用哪种协议，无论是创建一个客户端还是服务器都需要使用“引导”。具体使用方法如下：

```java
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            //创建客户端启动引导/辅助类：Bootstrap
            Bootstrap b = new Bootstrap();
            //指定线程模型
            b.group(group).
                    ......
            // 尝试建立连接
            ChannelFuture f = b.connect(host, port).sync();
            f.channel().closeFuture().sync();
        } finally {
            // 优雅关闭相关线程组资源
            group.shutdownGracefully();
        }
```

**`ServerBootstrap` 客户端的启动引导类/辅助类**，具体使用方法如下：

```java
        // 1.bossGroup 用于接收连接，workerGroup 用于具体的处理
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            // 2.创建服务端启动引导/辅助类：ServerBootstrap
            ServerBootstrap b = new ServerBootstrap();
            // 3.给引导类配置两大线程组,确定了线程模型
            b.group(bossGroup, workerGroup).
                   ......
            // 6.绑定端口
            ChannelFuture f = b.bind(port).sync();
            // 等待连接关闭
            f.channel().closeFuture().sync();
        } finally {
            // 7.优雅关闭相关线程组资源
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
```

从上面的示例中，我们可以看出：

![](https://gitee.com/veal98/images/raw/master/img/20201210221726.png)

1. `Bootstrap` 通常使用 `connet()` 方法连接到远程的主机和端口，作为一个 Netty **TCP** 协议通信中的客户端。另外，`Bootstrap` 也可以通过 `bind()` 方法绑定本地的一个端口，作为 **UDP** 协议通信中的一端。
2. `ServerBootstrap`通常使用 `bind()` 方法绑定本地的端口上，然后等待客户端的连接。
3. `Bootstrap` 只需要配置一个线程组 `EventLoopGroup` , 而  `ServerBootstrap` 需要配置两个线程组— `EventLoopGroup` ，一个用于接收连接，一个用于具体的 IO 处理。

### ③ Channel（网络操作抽象类）

在我们使用某种语言，如 c/c++,java,go 等，进行网络编程的时候，我们通常会使用到 `Socket`， `Socket `是对底层操作系统网络 IO 操作(如 `read`,`write`,`bind`,`connect`等)的封装， 因此我们必须去学习 `Socket `才能完成网络编程，而 `Socket `的操作其实是比较复杂的，想要使用好它有一定难度， 所以 Netty 提供了`Channel`(注意是 `io.netty.Channel`，而非 Java NIO 的 `Channel`)，更加方便我们处理 IO 事件。

`Channel` 接口是 Netty 对**网络操作抽象类**。通过 `Channel` 我们可以进行 I/O 操作。`Channel `为用户提供：

- 当前网络连接的通道的状态（例如是否打开？是否已连接？）
- 网络连接的配置参数 （例如接收缓冲区大小）
- 提供异步的网络 I/O 操作 (如建立连接，读写，绑定端口)，异步调用意味着任何 I/O调用都将立即返回，并且不保证在调用结束时所请求的 I/O 操作已完成。调用后立即返回一个 `ChannelFuture` 实例，通过注册监听器到`ChannelFuture` 上，可以在 I/O操作成功、失败或取消时回调通知调用方。
- 支持关联 I/O 操作与对应的处理程序

一旦客户端成功连接服务端，就会新建一个 `Channel` 同该用户端进行绑定

比较常用的`Channel`接口实现类是 ：

- `NioServerSocketChannel`（服务端）
- `NioSocketChannel`（客户端）

这两个 `Channel` 可以和 BIO 编程模型中的 `ServerSocket`以及`Socket`两个概念对应上。

### ④ EventLoop（事件循环）

`EventLoop`（事件循环）接口可以说是 Netty 中最核心的概念了！

`EventLoop` 定义了 Netty 的核心抽象，用于处理连接的生命周期中所发生的事件。

是不是很难理解？说白了，**`EventLoop` 的主要作用实际就是责监听网络事件并调用事件处理器进行相关 I/O 操作（读写）的处理。**

#### Channel 和 EventLoop 的关系

那 `Channel` 和 `EventLoop` 直接有啥联系呢？

**`Channel` 为 Netty 网络操作(读写等操作)抽象类，`EventLoop` 负责处理注册到其上的 `Channel` 的 I/O 操作，两者配合进行 I/O 操作。**

#### EventloopGroup 和 EventLoop 的关系

`EventLoopGroup` 包含多个 `EventLoop`（每一个 `EventLoop` 通常内部包含一个线程），它管理着所有的 `EventLoop` 的生命周期。

并且，**`EventLoop` 处理的 I/O 事件都将在它专有的 `Thread` 上被处理，即 `Thread` 和 `EventLoop` 属于 1 : 1 的关系，从而保证线程安全。**

下图是 Netty **NIO** 模型对应的 `EventLoop` 模型。通过这个图应该可以将 `EventloopGroup`、`EventLoop`、 `Channel` 三者联系起来：

![](https://gitee.com/veal98/images/raw/master/img/20201210213439.png)

#### NioEventLoopGroup 默认的构造函数会起多少线程

```java
EventLoopGroup bossGroup = new NioEventLoopGroup(1);
EventLoopGroup workerGroup = new NioEventLoopGroup();
```

为了搞清楚`NioEventLoopGroup` 默认的构造函数 到底创建了多少个线程，我们来看一下它的源码。

```java
    /**
     * 无参构造函数。
     * nThreads:0
     */
    public NioEventLoopGroup() {
        //调用下一个构造方法
        this(0);
    }

    /**
     * Executor：null
     */
    public NioEventLoopGroup(int nThreads) {
        //继续调用下一个构造方法
        this(nThreads, (Executor) null);
    }

    //中间省略部分构造函数

    /**
     * RejectedExecutionHandler（）：RejectedExecutionHandlers.reject()
     */
    public NioEventLoopGroup(int nThreads, Executor executor, final SelectorProvider selectorProvider,final SelectStrategyFactory selectStrategyFactory) {
       //开始调用父类的构造函数
        super(nThreads, executor, selectorProvider, selectStrategyFactory, RejectedExecutionHandlers.reject());
    }
```

一直向下走下去的话，你会发现在 `MultithreadEventLoopGroup` 类中有相关的指定线程数的代码，如下：

```java
    // 从1，系统属性，CPU核心数*2 这三个值中取出一个最大的
    //可以得出 DEFAULT_EVENT_LOOP_THREADS 的值为CPU核心数*2
    private static final int DEFAULT_EVENT_LOOP_THREADS = Math.max(1, SystemPropertyUtil.getInt("io.netty.eventLoopThreads", NettyRuntime.availableProcessors() * 2));

    // 被调用的父类构造函数，NioEventLoopGroup 默认的构造函数会起多少线程的秘密所在
    // 当指定的线程数nThreads为0时，使用默认的线程数DEFAULT_EVENT_LOOP_THREADS
    protected MultithreadEventLoopGroup(int nThreads, ThreadFactory threadFactory, Object... args) {
        super(nThreads == 0 ? DEFAULT_EVENT_LOOP_THREADS : nThreads, threadFactory, args);
    }
```

综上，我们发现 `NioEventLoopGroup` 默认的构造函数实际会起的线程数为 **`CPU核心数 * 2`**。

另外，如果你继续深入下去看构造函数的话，你会发现每个`NioEventLoopGroup`对象内部都会分配一组`NioEventLoop`，其大小是 `nThreads`, 这样就构成了一个线程池， 一个`NIOEventLoop` 和一个线程相对应，这和我们上面说的 `EventloopGroup` 和 `EventLoop`关系这部分内容相对应。

### ⑤ ChannelHandler（消息处理器）和 ChannelPipeline（ChannelHandler 对象链表）

```java
public class SimpleChatServerInitializer extends ChannelInitializer<SocketChannel> {
    @Override
    protected void initChannel(SocketChannel socketChannel) throws Exception {
        ChannelPipeline pipeline = socketChannel.pipeline();
        // DelimiterBasedFrameDecoder 分隔符解码器，解决 TCP 粘包/拆包问题
        pipeline.addLast("framer", new DelimiterBasedFrameDecoder(8192, Delimiters.lineDelimiter()));
        // 解码器 将前一步解码得到的数据转码为字符串
        pipeline.addLast("decoder", new StringDecoder());
        // 编码器
        pipeline.addLast("encoder", new StringEncoder());
        // Handler 最终的数据处理
        pipeline.addLast("handler", new SimpleChatServerHandler());

        System.out.println("SimpleChatClient: " + socketChannel.remoteAddress() + " 已连接");
    }
}

```

`ChannelHandler` 是**消息的具体处理器**。他负责处理读写操作、客户端连接等事情。

`ChannelPipeline` 为 `ChannelHandler` 的链，提供了一个容器并定义了用于沿着链传播入站和出站事件流的 API 。当 `Channel` 被创建时，它会被自动地分配到它专属的 `ChannelPipeline`。

我们可以在 `ChannelPipeline` 上通过 `addLast()` 方法添加一个或者多个`ChannelHandler` ，因为一个数据或者事件可能会被多个 Handler 处理。**当一个 `ChannelHandler` 处理完之后就将数据交给下一个 `ChannelHandler` 。**

### ⑥ ChannelFuture（操作执行结果）

```java
public interface ChannelFuture extends Future<Void> {
    Channel channel();

    ChannelFuture addListener(GenericFutureListener<? extends Future<? super Void>> var1);
     ......

    ChannelFuture sync() throws InterruptedException;
}
```

**Netty 是异步非阻塞的**，所有的 I/O 操作都为异步的。

**因此，我们不能立刻得到操作是否执行成功**，但是，你可以通过 `ChannelFuture` 接口的 `addListener()` 方法**注册一个监听** `ChannelFutureListener`，当操作执行成功或者失败时，监听就会自动触发返回结果。

```java
ChannelFuture f = serverBootstrap.connect(host, port).addListener(future -> {
  if (future.isSuccess()) {
    System.out.println("连接成功!");
  } else {
    System.err.println("连接失败!");
  }
}).sync();
```

并且，你还可以通过`ChannelFuture` 的 `channel()` 方法获取连接相关联的`Channel` 。

```java
Channel channel = f.channel();
```

另外，我们还可以通过 `ChannelFuture` 接口的 `sync()`方法让异步的操作编程同步的。

```java
// bind()是异步的，但是，你可以通过 `sync()`方法将其变为同步。
ChannelFuture f = b.bind(port).sync();
```

## 5. Netty 线程模型

**Netty 主要靠 `NioEventLoopGroup` 线程池来实现具体的线程模型，不同的设置 `NioEventLoopGroup` 的方式就对应了不同的 Reactor 的线程模型.**

> **Reactor 模式**，是指将一个或多个输入同时传递给服务处理器 ServiceHandler 的服务请求的事件驱动处理模式。 **服务端程序将请求同步的分派给对应的处理线程**。
>
> ![img](https://gitee.com/veal98/images/raw/master/img/20201212204229.png)
>
> Reactor 模式也叫 Dispatcher 模式，是编写高性能网络服务器的必备技术之一
>
> 从结构上，这有点类似生产者消费者模式，即有一个或多个生产者将事件放入一个 Queue 中，而一个或多个消费者主动的从这个 Queue 中 Poll 事件来处理；**而 Reactor 模式则并没有 Queue 来做缓冲，每当一个 Event 输入到ServiceHandler之后，该 ServiceHandler 会立刻根据不同的 Event 类型将其分发给对应的 EventHandler 来处理**。
>
> Reactor 模式中有 2 个关键组成：
>
> - **Reactor**
>
>   <u>Reactor 在单独的线程中运行，负责监听和分发事件</u>，分发给适当的处理程序来对 IO 事件做出反应。 它就像公司的电话接线员，它接听来自客户的电话并将线路转移到适当的联系人
>
> - **Handlers**
>
>   <u>Handlers 即处理程序，执行 I/O 事件要完成的实际事件</u>，类似于客户想要与之交谈的公司中的实际官员。Reactor 通过调度适当的处理程序来响应 I/O 事件，处理程序执行非阻塞操作

我们实现服务端的时候，一般会初始化两个线程组：

1. **`bossGroup`** : 接收连接。
2. **`workerGroup`** ：负责具体的处理，交由对应的 Handler 处理。

### ① 单 Reactor 单线程模型

单线程模型就是**只指定一个线程执行客户端连接和读写操**作，也就是在一个 `Reactor` 中完成，对应在 Netty 中的实现就是将 `NioEventLoopGroup` 线程数设置为 1，核心代码是：

```java
// bossGroup 既用于处理客户端连接，又负责具体的处理
EventLoopGroup bossGroup = new NioEventLoopGroup(1);
ServerBootstrap b = new ServerBootstrap();
b.group(bossGroup)
 .channel(NioServerSocketChannel.class)
 ...
```

注意, 我们实例化了一个 `NioEventLoopGroup`, **构造器参数是 1, 表示 `NioEventLoopGroup `的线程池大小是 1**.

然后接着我们调用 `b.group(bossGroup)` 设置了服务器端的 `EventLoopGroup`. 有些朋友可能会有疑惑: 我记得在启动服务器端的 Netty 程序时, 是需要设置 `bossGroup `和 `workerGroup `的, 为什么这里就只有一个 `bossGroup`? 其实很简单, `ServerBootstrap `重写了 `group `方法:

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

`bossGroup` 线程池中的线程数我们设置为 4（大于 1 就行，或者直接使用无参构造函数）, 而 `workerGroup `中的线程数默认是 CPU 核心数乘以 2, 因此对应的到 Reactor 线程模型中就是 **主从 Reactor 多线程模型**

> 🚨 **注意**：**其实 Netty 的服务器端在 acceptor 阶段并没有使用到多线程, 因此上面的主从 Reactor 多线程模型在 Netty 的服务器端是不存在的**
>
> **服务器端的 `ServerSocketChannel `只绑定到了 `bossGroup` 中的一个线程**, 因此在调用 Java NIO 的 `Selector.select` 处理客户端的连接请求时, 实际上是在一个线程中的, 所以对只有一个服务的应用来说, `bossGroup `设置多个线程是没有什么作用的, 反而还会造成资源浪费.

## 6. Netty 服务端和客户端的启动过程

### 服务端

```java
        // 1.bossGroup 用于接收连接，workerGroup 用于具体的处理
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            // 2.创建服务端启动引导/辅助类：ServerBootstrap
            ServerBootstrap b = new ServerBootstrap();
            // 3.给引导类配置两大线程组,确定了线程模型
            b.group(bossGroup, workerGroup)
                    // (非必备)打印日志
                    .handler(new LoggingHandler(LogLevel.INFO))
                    // 4.指定 IO 模型
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch) {
                            ChannelPipeline p = ch.pipeline();
                            // 解码器 将前一步解码得到的数据转码为字符串
                            pipeline.addLast("decoder", new StringDecoder());
                            // 编码器
                            pipeline.addLast("encoder", new StringEncoder());
                            // 5.可以自定义客户端消息的业务处理逻辑
                            p.addLast(new HelloServerHandler());
                        }
                    });
            // 6.绑定端口,调用 sync 方法阻塞直到绑定完成
            ChannelFuture f = b.bind(port).sync();
            // 7.阻塞等待直到服务器Channel关闭(closeFuture()方法获取Channel 的CloseFuture对象,然后调用sync()方法)
            f.channel().closeFuture().sync();
        } finally {
            // 8.优雅关闭相关线程组资源
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
```

简单解析一下服务端的创建过程具体是怎样的：

🔸 1.首先你创建了两个 `NioEventLoopGroup` 对象实例：`bossGroup` 和 `workerGroup`。

- `bossGroup` : 用于处理客户端的 TCP 连接请求。
- `workerGroup` ：负责每一条连接的具体读写数据的处理逻辑，真正负责 I/O 读写操作，交由对应的 Handler 处理。

🔸 2.接下来 我们创建了一个服务端启动引导/辅助类：`ServerBootstrap`，这个类将引导我们进行服务端的启动工作。

🔸 3.通过 `.group()` 方法给引导类 `ServerBootstrap` 配置两大线程组，确定了线程模型。

🔸 4.通过`channel()`方法给引导类 `ServerBootstrap`指定了 IO 模型为`NIO`

- `NioServerSocketChannel` ：指定**服务端**的 IO 模型为 NIO，与 BIO 编程模型中的`ServerSocket`对应

- `NioSocketChannel` : 指定**客户端**的 IO 模型为 NIO， 与 BIO 编程模型中的`Socket`对应

🔸 5.通过 `.childHandler()`给引导类创建一个`ChannelInitializer` ，加入编解码器（可选），然后指定服务端消息的业务处理逻辑

🔸 6.调用 `ServerBootstrap` 类的 `bind()`方法绑定端口

### 客户端

```java
        // 1.创建一个 NioEventLoopGroup 对象实例
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            // 2.创建客户端启动引导/辅助类：Bootstrap
            Bootstrap b = new Bootstrap();
            // 3.指定线程组
            b.group(group)
                    // 4.指定 IO 模型
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch) throws Exception {
                            ChannelPipeline p = ch.pipeline();
                            // 解码器
                            pipeline.addLast("decoder", new StringEncoder());
                            // 编码器
                            pipeline.addLast("encoder", new StringDeEncoder());
                            // 5.这里可以自定义消息的业务处理逻辑
                            p.addLast(new HelloClientHandler(message));
                        }
                    });
            // 6.尝试建立连接
            ChannelFuture f = b.connect(host, port).sync();
            // 7.等待连接关闭（阻塞，直到Channel关闭）
            f.channel().closeFuture().sync();
        } finally {
            group.shutdownGracefully();
        }
```

继续分析一下客户端的创建流程：

🔸 1.创建一个 `NioEventLoopGroup` 对象实例

🔸 2.创建客户端启动的引导类是 `Bootstrap`

🔸 3.通过 `.group()` 方法给引导类 `Bootstrap` 配置一个线程组

🔸 4.通过`channel()`方法给引导类 `Bootstrap`指定了 IO 模型为`NIO`

🔸 5.通过 `.childHandler()`给引导类创建一个`ChannelInitializer` ，添加编解码器（可选），然后指定客户端消息的业务处理逻辑

🔸 6.调用 `Bootstrap` 类的 `connect()`方法进行连接，这个方法需要指定两个参数：

- `inetHost` : ip 地址
- `inetPort` : 端口号

```java
    public ChannelFuture connect(String inetHost, int inetPort) {
        return this.connect(InetSocketAddress.createUnresolved(inetHost, inetPort));
    }
    public ChannelFuture connect(SocketAddress remoteAddress) {
        ObjectUtil.checkNotNull(remoteAddress, "remoteAddress");
        this.validate();
        return this.doResolveAndConnect(remoteAddress, this.config.localAddress());
    }
```

`connect` 方法返回的是一个 `Future` 类型的对象 `ChannelFuture`

```java
public interface ChannelFuture extends Future<Void> {
  ......
}
```

也就是说这个方法是异步的，我们通过 `addListener` 方法可以监听到连接是否成功，进而打印出连接信息。具体做法很简单，只需要对代码进行以下改动：

```java
ChannelFuture f = b.connect(host, port).addListener(future -> {
  if (future.isSuccess()) {
    System.out.println("连接成功!");
  } else {
    System.err.println("连接失败!");
  }
}).sync();
```

## 7. 什么是 TCP 粘包/拆包? Netty 的解决方法

👉 参见 [⏰ Netty 是如何解决 TCP 粘包/拆包问题的](https://veal98.gitee.io/cs-wiki/#/Java/Netty/12-Netty解决TCP粘包拆包问题?id=⏰-netty-是如何解决-tcp-粘包拆包问题的)

## 8. Netty 长连接、心跳机制

### ① TCP 长连接和短连接

TCP 在进行读写之前，server 与 client 之间必须提前建立一个连接。建立连接的过程，需要我们常说的三次握手，释放/关闭连接的话需要四次挥手。这个过程是比较消耗网络资源并且有时间延迟的。

所谓**短连接**说的就是 server 端 与 client 端建立连接之后，<u>读写完成之后就关闭掉连接，如果下一次再要互相发送消息，就要重新连接</u>。短连接的有点很明显，就是管理和实现都比较简单，缺点也很明显，每一次的读写都要建立连接必然会带来大量网络资源的消耗，并且连接的建立也需要耗费时间。

**长连接**说的就是 client 向 server 双方建立连接之后，<u>即使 client 与 server 完成一次读写，它们之间的连接并不会主动关闭，后续的读写操作会继续使用这个连接</u>。长连接的可以省去较多的 TCP 建立和关闭的操作，降低对网络资源的依赖，节约时间。对于频繁请求资源的客户来说，非常适用长连接。

### ② 为什么需要心跳机制？Netty 心跳机制

<u>在 TCP 保持长连接的过程中，可能会出现断网等网络异常出现，异常发生的时候， client 与 server 之间如果没有交互的话，它们是无法发现对方已经掉线的</u>。为了解决这个问题, 我们就需要引入 **心跳机制** 。

心跳机制的工作原理是: 在 client 与 server 之间在一定时间内没有数据交互时, 即处于 idle 状态时, 客户端或服务器就会发送一个特殊的数据包给对方, 当接收方收到这个数据报文后, 也立即发送一个特殊的数据报文, 回应发送方, 此即一个 `PING-PONG` 交互。所以, 当某一端收到心跳消息后, 就知道了对方仍然在线, 这就确保 TCP 连接的有效性.

TCP 实际上自带的就有长连接选项，本身是也有心跳包机制，也就是 TCP 的选项：`SO_KEEPALIVE`。但是，TCP 协议层面的长连接灵活性不够。所以，一般情况下我们都是在应用层协议上实现自定义心跳机制的，也就是在 Netty 层面通过编码实现。通过 Netty 实现心跳机制的话，核心类是 `IdleStateHandler` 。

通过 Netty 实现心跳机制详见 [💓 Netty 是如何实现 TCP 心跳机制与断线重连的](https://veal98.gitee.io/cs-wiki/#/Java/Netty/13-Netty实现心跳机制?id=💓-netty-是如何实现-tcp-心跳机制与断线重连的)

## 9. Netty 的零拷贝

### ① 什么是零拷贝

**零拷贝(Zero-Copy)** 是一种目前只有在使用`NIO`和`Epoll`传输时才可使用的特性。在之前的 IO 模型中，所有的 IO 的数据都是从内核复制到用户应用进程，再由用户应用进程处理。 而零拷贝则可以快速地将数据从源文件移动到目标文件，无需经过用户空间。

在学习零拷贝技术之前先回顾一下普通的 IO 拷贝过程吧， 这里举个栗子： 我要使用一个程序将一个目录下的文件复制到另一个目录下， 在普通的 IO 中，其过程如下：

![img](https://gitee.com/veal98/images/raw/master/img/20201211162947.png)

- 应用程序启动后，向内核发出 `read` 调用（用户态切换到内核态）
- 操作系统收到调用请求后， 会检查文件是否已经缓存过了:
  - 如果缓存过了，就将数据从缓冲区（直接内存）拷贝到用户应用进程（内核态切换到用户态）
  - 如果是第一次访问这个文件，则系统先将数据先拷贝到缓冲区（直接内存），然后CPU将数据从缓冲区拷贝到应用进程内（内核态切换到用户态）
- 应用进程收到内核的数据后发起 `write` 调用，将数据拷贝到目标文件相关的堆栈内存（用户态切换到内核态）， 最后再从缓存拷贝到目标文件。

根据上面普通拷贝的过程我们知道了其缺点主要有：

1. 用户态与内核态之间的上下文切换次数较多（用户态发送系统调用与内核态将数据拷贝到用户空间）。
2. 拷贝次数较多，每次 IO 都需要 DMA 和 CPU 拷贝。

**而零拷贝正是针对普通拷贝的缺点做了很大改进，使得其拷贝速度在处理大数据的时候很是出色**。

### ③ Netty 中的零拷贝

⭐ **在 OS 层面上的 `Zero-copy` 通常指避免在 `用户态(User-space)` 与 `内核态(Kernel-space)` 之间来回拷贝数据。而在 Netty 层面 ，零拷贝主要体现在对于数据操作的优化**。

Netty 中的零拷贝体现在以下几个方面：

1. 使用 Netty 提供的 `CompositeByteBuf` 类, 可以将多个`ByteBuf` 合并为一个逻辑上的 `ByteBuf`, 避免了各个 `ByteBuf` 之间的拷贝。
2. `ByteBuf` 支持 slice 操作, 因此可以将 ByteBuf 分解为多个共享同一个存储区域的 `ByteBuf`, 避免了内存的拷贝。
3. 通过 `FileRegion` 包装的`FileChannel.tranferTo` 实现文件传输, 可以直接将文件缓冲区的数据发送到目标 `Channel`, 避免了传统通过循环 write 方式导致的内存拷贝问题.

## 📚 References

- [你要的Netty常见面试题总结，敖丙搞来了](https://mp.weixin.qq.com/s/eJ-dAtOYsxylGL7pBv7VVA)