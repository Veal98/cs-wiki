# 💓 Netty 核心组件总览

---

## 1. 核心组件概述

下面枚举所有的 Netty 应用程序的基本构建模块（核心组件），包括客户端和服务器：

- `Bytebuf`（字节容器）
- `Bootstrap `和 `ServerBootstrap `（启动引导类）
- `Channel`（网络操作抽象类）
- `EventLoop `（事件循环）
- `ChannelHandler `（消息处理器）和 `ChannelPipeline `（ChannelHandler 对象链表）
- `ChannelFuture`（操作执行结果）

通过下面这张图你可以将我提到的这些 Netty 核心组件串联起来：

![](https://gitee.com/veal98/images/raw/master/img/20201210152621.png)

## 2. Bytebuf 字节容器

**网络通信最终都是通过字节流进行传输的**。 **Netty 使用自建的 buffer API，而不是使用 NIO 的 `ByteBuffer` 来存储连续的字节序列**。与 `ByteBuffer `相比这种方式拥有明显的优势。Netty 使用新的 buffer 类型 `ByteBuf`，被设计为一个可从底层解决 `ByteBuffer `问题，并可满足日常网络应用开发需要的缓冲类型。这些很酷的特性包括：

- 如果需要，允许使用自定义的缓冲类型。
- 复合缓冲类型中内置的透明的零拷贝实现。
- 开箱即用的动态缓冲类型，具有像 `StringBuffer `一样的动态缓冲能力。
- 不再需要调用的 `flip()` 方法。
- 正常情况下具有比 `ByteBuffer `更快的响应速度。

## 3. Bootstrap 和 ServerBootstrap（启动引导类）

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

## 4. Channel（网络操作抽象类）

在我们使用某种语言，如 c/c++,java,go 等，进行网络编程的时候，我们通常会使用到 `Socket`， `Socket `是对底层操作系统网络 IO 操作(如 `read`,`write`,`bind`,`connect`等)的封装， 因此我们必须去学习 `Socket `才能完成网络编程，而 `Socket `的操作其实是比较复杂的，想要使用好它有一定难度， 所以 Netty 提供了`Channel`(注意是 `io.netty.Channel`，而非 Java NIO 的 `Channel`)，更加方便我们处理 IO 事件。

`Channel` 接口是 Netty 对网络操作抽象类。通过 `Channel` 我们可以进行 I/O 操作。`Channel `为用户提供：

- 当前网络连接的通道的状态（例如是否打开？是否已连接？）
- 网络连接的配置参数 （例如接收缓冲区大小）
- 提供异步的网络 I/O 操作 (如建立连接，读写，绑定端口)，异步调用意味着任何 I/O调用都将立即返回，并且不保证在调用结束时所请求的 I/O 操作已完成。调用后立即返回一个 `ChannelFuture` 实例，通过注册监听器到`ChannelFuture` 上，可以在 I/O操作成功、失败或取消时回调通知调用方。
- 支持关联 I/O 操作与对应的处理程序

一旦客户端成功连接服务端，就会新建一个 `Channel` 同该用户端进行绑定，示例代码如下：

```java
   // 通过 Bootstrap 的 connect 方法连接到服务端
   public Channel doConnect(InetSocketAddress inetSocketAddress) {
        CompletableFuture<Channel> completableFuture = new CompletableFuture<>();
        bootstrap.connect(inetSocketAddress).addListener((ChannelFutureListener) future -> {
            if (future.isSuccess()) {
                completableFuture.complete(future.channel());
            } else {
                throw new IllegalStateException();
            }
        });
        return completableFuture.get();
    }
```

比较常用的`Channel`接口实现类是 ：

- `NioServerSocketChannel`（服务端）
- `NioSocketChannel`（客户端）

这两个 `Channel` 可以和 BIO 编程模型中的 `ServerSocket`以及`Socket`两个概念对应上。

## 5. EventLoop（事件循环）

### ① EventLoop 概述

`EventLoop`（事件循环）接口可以说是 Netty 中最核心的概念了！

`EventLoop` 定义了 Netty 的核心抽象，用于处理连接的生命周期中所发生的事件。

是不是很难理解？说白了，**`EventLoop` 的主要作用实际就是责监听网络事件并调用事件处理器进行相关 I/O 操作（读写）的处理。**

### ② Channel 和 EventLoop 的关系

那 `Channel` 和 `EventLoop` 直接有啥联系呢？

**`Channel` 为 Netty 网络操作(读写等操作)抽象类，`EventLoop` 负责处理注册到其上的`Channel` 的 I/O 操作，两者配合进行 I/O 操作。**

### ③ EventloopGroup 和 EventLoop 的关系

`EventLoopGroup` 包含多个 `EventLoop`（每一个 `EventLoop` 通常内部包含一个线程），它管理着所有的 `EventLoop` 的生命周期。

并且，**`EventLoop` 处理的 I/O 事件都将在它专有的 `Thread` 上被处理，即 `Thread` 和 `EventLoop` 属于 1 : 1 的关系，从而保证线程安全。**

下图是 Netty **NIO** 模型对应的 `EventLoop` 模型。通过这个图应该可以将 `EventloopGroup`、`EventLoop`、 `Channel` 三者联系起来：

![](https://gitee.com/veal98/images/raw/master/img/20201210213439.png)

## 6. ChannelHandler（消息处理器）和 ChannelPipeline（ChannelHandler 对象链表）

### ① ChannelHandler

我们知道 Netty 是一个款基于事件驱动的网络框架，当特定事件触发时，我们能够按照自定义的逻辑去处理数据。 **`ChannelHandler `则正是用于处理入站（接收）和出站（发送）数据钩子**，它可以处理几乎所有类型的动作，所以 `ChannelHandler` 会是 我们开发者更为关注的一个接口。

💡 通俗来说，**`ChannelHandler` 是消息的具体处理器，主要负责处理客户端/服务端接收和发送的数据。**

`ChannelHandler` 主要分为处理入站数据的 `ChannelInboundHandler` 和出站数据的 `ChannelOutboundHandler `接口。

![](https://gitee.com/veal98/images/raw/master/img/20201210222527.png)

Netty 以**适配器**的形式提供了大量默认的 `ChannelHandler` 实现，主要目的是为了简化程序开发的过程，我们只需要 重写我们关注的事件和方法就可以了。 通常我们会**以继承的方式使用以下适配器和抽象**:

- `ChannelHandlerAdapter`
- `ChannelInboundHandlerAdapter`
- `ChannelDuplexHandler`
- `ChannelOutboundHandlerAdapter`

### ② ChannelPipeline

**当 `Channel` 被创建时，它会被自动地分配到它专属的 `ChannelPipeline`。 一个 `Channel` 包含一个 `ChannelPipeline`。 `ChannelPipeline` 为 `ChannelHandler` 的链，一个 pipeline 上可以有多个 `ChannelHandler`。**

我们可以在 `ChannelPipeline` 上通过 `addLast()` 方法添加一个或者多个`ChannelHandler` （*一个数据或者事件可能会被多个 Handler 处理*） 。**当一个 `ChannelHandler` 处理完之后就将数据交给下一个 `ChannelHandler` ：**

```java
        b.group(eventLoopGroup)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ch.pipeline().addLast(new NettyKryoDecoder(kryoSerializer, RpcResponse.class));
                        ch.pipeline().addLast(new NettyKryoEncoder(kryoSerializer, RpcRequest.class));
                        ch.pipeline().addLast(new KryoClientHandler());
                    }
                });
```

### ③ 入站事件和出站事件的流向

从服务端角度来看，如果一个事件的运动方向是从客户端到服务端，那么这个事件是入站的，如果事件运动的方向 是从服务端到客户端，那么这个事件是出站的。

![](https://gitee.com/veal98/images/raw/master/img/20201210222844.png)

上图是 Netty 事件入站和出站的大致流向，入站和出站的 `ChannelHandler` 可以被安装到一个`ChannelPipeline`中， 如果一个消息或其他的入站事件被[读取]，那么它会从`ChannelPipeline`的头部开始流动，并传递给第一个`ChannelInboundHandler `，这个`ChannelHandler`的行为取决于它的具体功能，不一定会修改消息。 在经历过第一个`ChannelInboundHandler`之后， 消息会被传递给这条`ChannelHandler`链的下一个`ChannelHandler`，最终消息会到达`ChannelPipeline`尾端，消息的读取也就结束了。

数据的出站 (发送) 流程与入站是相似的，在出站过程中，消息从`ChannelOutboundHandler`链的尾端开始流动， 直到到达它的头部为止，在这之后，消息会到达网络传输层进行后续传输。

鉴于入站操作和出站操作是不同的，可能有同学会疑惑：❓ **为什么`入站 ChannelHandler`和`出站 ChannelHandler`的数据 不会窜流呢(为什么 入站 的数据不会到出站 `ChannelHandler` 链中)？** 

因为Netty可以区分`ChannelInboundHandler`和 `ChannelOutboundHandler`的实现，并确保数据只在两个相同类型的`ChannelHandler`直接传递，即数据要么在 `ChannelInboundHandler`链之间流动，要么在`ChannelOutboundHandler`链之间流动。

当`ChannelHandler`被添加到`ChannelPipeline`中后，它会被分配一个`ChannelHandlerContext`， 它代表了`ChannelHandler`和`ChannelPipeline`之间的绑定。 `ChannelPipeline` 通过 `ChannelHandlerContext`来间接管理 `ChannelHandler` 。

![](https://gitee.com/veal98/images/raw/master/img/20201210220033.png)

### ④ 编码器、解码器

当我们通过 Netty 发送(出站)或接收(入站)一个消息时，就会发生一次数据的转换，因为数据在网络中总是通过字节传输的， 所以**当数据入站时，Netty 会解码数据，即把数据从字节转为为另一种格式 (通常是一个 Java 对象)， 当数据出站时，Netty 会编码数据，即把数据从它当前格式转为为字节**。

Netty 为编码器和解码器提供了不同类型的抽象，**这些编码器和解码器其实都是`ChannelHandler`的实现**， 它们的名称通常是 `ByteToMessageDecoder` 和 `MessageToByteEncoder`。

对于入站数据来说，解码其实是解码器通过重写 `ChannelHanler` 的`read`事件（`channelRead`），然后调用它们自己的 `decode`方法完成的。 对于出站数据来说，编码则是编码器通过重写`ChannelHanler`的`write`事件，然后调用它们自己的 `encode`方法完成的。

### ⑤ SimpleChannelInboundHandler

最常见的处理器是接收到解码后的消息并应用一些业务逻辑到这些数据，非常简单的一种方式 是扩展`SimpleChannelInboundHandler<T>`，T 是我们需要处理消息的类型。 继承 `SimpleChannelInboundHandler` 后，我们只需要重写其中一个或多个方法就可以完成我们的逻辑。

## 7. ChannelFuture（操作执行结果）

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
ChannelFuture f = b.connect(host, port).addListener(future -> {
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

## 📚 References

- [Essential Netty in Action 《Netty 实战(精髓)》](https://waylau.com/essential-netty-in-action/GETTING%20STARTED/A%20Closer%20Look%20at%20ChannelHandlers.html)