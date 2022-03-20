# 🍓 ChannelHandler 与 ChannelPipeline 详解

---

我们在上一章研究的 `bytebuf` 是一个容器用来“包装”数据。在**本章我们将探讨这些容器如何通过应用程序来移动，传入和传出，以及他们的内容是如何处理的**。

本章主要内容

- `Channel`
- `ChannelHandler`
- `ChannePipeline`
- `ChannelHandlerContext`

## 1. ChannelHandler 家族

### ① Channel 生命周期

在 `Channel` 的生命周期中，它的状态与 `ChannelHandler` 是密切相关的，下列是 `Channel` 组件的四个状态：

| 状态                | 描述                                                       |
| :------------------ | :--------------------------------------------------------- |
| ChannelUnregistered | Channel 没有注册到 EventLoop                               |
| ChannelRegistered   | Channel 被注册到了 EventLoop                               |
| ChannelActive       | Channel 已经连接到它的远程节点，处于活动状态，可以收发数据 |
| ChannelInactive     | Channel 与远程节点断开不再处于活动状态                     |

Channel 的生命周期如下图所示，**当这些状态发生改变时，将会生成对应的事件，`ChannelPipeline `中的`ChannelHandler `就可以及时做出处理**：

<img src="https://gitee.com/veal98/images/raw/master/img/20201212112100.png" style="zoom: 80%;" />

### ② ChannelHandler 生命周期

`ChannelHandler` 接口定义了其生命周期中的操作，当`ChanelHandler`被添加到`ChannelPipeline `或从`ChannelPipeline`中移除时，会调用这些操作，`ChannelHandler`的生命周期如下：

| 方法              | 描述                                                         |
| :---------------- | :----------------------------------------------------------- |
| `handlerAdded`    | 当把 ChannelHandler 添加到 ChannelPipeline 中时调用此方法    |
| `handlerRemoved`  | 当把 ChannelHandler 从 ChannelPipeline 中移除的时候会调用此方法 |
| `exceptionCaught` | 当 ChannelHandler 在处理数据的过程中发生异常时会调用此方法   |

### ③  ChannelHanler 子接口

Netty 提供2个重要的 ChannelHandler 子接口：

- `ChannelInboundHandler` - 处理进站数据，并且所有状态都更改
- `ChannelOutboundHandler `- 处理出站数据，允许拦截各种操作

#### Ⅰ ChannelInboundHandler 接口

`ChannelInboundHandler`会在接受数据或者其对应的`Channel`状态发生改变时调用其生命周期的方法， `ChannelInboundHandler`的生命周期和`Channel`的生命周期其实是密切相关的。 以下是`ChannelInboundHandler`的生命周期方法：

| 方法                      | 描述                                                         |
| :------------------------ | :----------------------------------------------------------- |
| ChannelRegistered         | 当Channel被注册到EventLoop且能够处理IO事件时会调用此方法     |
| ChannelUnregistered       | 当Channel从EventLoop注销且无法处理任何IO事件时会调用此方法   |
| `ChannelActive`           | 当Channel已经连接到远程节点(或者已绑定本地address)且处于活动状态时会调用此方法 |
| `ChannelInactive`         | 当Channel与远程节点断开，不再处于活动状态时调用此方法        |
| ChannelReadComplete       | 当Channel的某一个读操作完成时调用此方法                      |
| `ChannelRead`             | 当Channel有数据可读时调用此方法                              |
| ChannelWritabilityChanged | 当Channel的可写状态发生改变时调用此方法，可以调用Channel的isWritable方法检测Channel的可写性，还可以通过ChannelConfig来配置write操作相关的属性 |
| userEventTriggered        | 当ChannelInboundHandler的fireUserEventTriggered方法被调用时才调用此方法。 |

**这里有一个细节一定需要注意：当我们实现`ChannelInboundHandler`的`channelRead`方法时，请一定要记住 使用`ReferenceCountUtil`的`release`方法释放`ByteBuf`，这样可以减少内存的消耗，所以我们可以实现一个 `ChannelHandler`来完成对`ByteBuf`的释放，就像下面这样：**

![](https://gitee.com/veal98/images/raw/master/img/20201212113602.png)

**由于手工管理资源会很繁琐,您可以通过使用 `SimpleChannelInboundHandler` 简化问题**，因为`SimpleChannelInboundHandler`已经帮我们 把与业务无关的逻辑在`ChannelRead`方法实现了，**我们只需要实现它的`channelRead0`方法来完成我们的逻辑就够了**：

```java
@ChannelHandler.Sharable
// 继承 SimpleChannelInboundHandler
public class SimpleDiscardHandler extends SimpleChannelInboundHandler<Object> {

    @Override
    public void channelRead0(ChannelHandlerContext ctx, Object msg) {
        // 不需做特别的释放资源的动作
    }

}
```

💡 注意：**`SimpleChannelInboundHandler<Object>` 中的泛型表示要处理的入站数据的类型**

##### ChannelInitializer

回顾一下我们在第一个 Netty 应用章节的服务端代码：

```java
public final class HelloServer {

    ......

    private void start() throws InterruptedException {
        // 1.bossGroup 线程用于接收连接，workerGroup 线程用于具体的处理
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            // 2.创建服务端启动引导/辅助类：ServerBootstrap
            ServerBootstrap b = new ServerBootstrap();
            // 3.给引导类配置两大线程组,确定了线程模型
            b.group(bossGroup, workerGroup)
                    // (非必备)打印日志
                    .handler(new LoggingHandler(LogLevel.INFO))
                    // 4.指定 IO 模型为 NIO
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch) {
                            ChannelPipeline p = ch.pipeline();
                            // 5.可以自定义客户端消息的业务处理逻辑
                            p.addLast(new HelloServerHandler());
                        }
                    });
            ......
        }
    }
    ......

}
```

其中加入 `ServerBootstrap` 中处理的 channel 是一个 `ChannelInitializer `，这是怎么回事呢，不是应该相应的`ChannelHandler` 吗？我们来看一下`Channelnitializer`源代码：

```java
public abstract class ChannelInitializer<C extends Channel> extends ChannelInboundHandlerAdapter {
 
    private static final InternalLogger logger = InternalLoggerFactory.getInstance(ChannelInitializer.class);
 
    /**
     * 这个方法会在Channle被注册时候调用，在方法返回之后，这个实例会在Channel对应的ChannelPipeline中删除
     *
     * @param ch            the {@link Channel} which was registered.
     * @throws Exception    is thrown if an error occurs. In that case the {@link Channel} will be closed.
     */
    protected abstract void initChannel(C ch) throws Exception;
 
    @SuppressWarnings("unchecked")
    @Override
    public final void channelRegistered(ChannelHandlerContext ctx)
            throws Exception {
        boolean removed = false;
        boolean success = false;
        try {
            initChannel((C) ctx.channel());
            ctx.pipeline().remove(this);
            removed = true;
            ctx.fireChannelRegistered();
            success = true;
        } catch (Throwable t) {
            logger.warn("Failed to initialize a channel. Closing: " + ctx.channel(), t);
        } finally {
            if (!removed) {
                ctx.pipeline().remove(this);
            }
            if (!success) {
                ctx.close();
            }
        }
    }
}
```

从上面可以看出**`ChannelInitializer`其实也是一个`ChannelHandler`**，只是`ChannelInitializer`的主要任务不是对IO进行处理，而更多的负责对注册到`EventGroup`的`Channel`进行 init 处理，其中大多是进行加入 Handler 的处理

#### Ⅱ ChannelOutboundHandler接口

出站数据将由`ChannelOutboundHandler`处理，它的方法将被`Channel`，`ChannelPipeline`以及`ChannelHandlerContext`调用 （`Channel`，`ChannelPipeline`，`ChannelHandlerContext`都拥有`write`操作），以下是`ChannelOutboundHandler`的主要方法：

| 状态       | 描述                                          |
| :--------- | :-------------------------------------------- |
| bind       | 当Channel绑定到本地address时会调用此方法      |
| connect    | 当Channel连接到远程节点时会调用此方法         |
| disconnect | 当Channel和远程节点断开时会调用此方法         |
| close      | 当关闭Channel时会调用此方法                   |
| deregister | 当Channel从它的EventLoop注销时会调用此方法    |
| read       | 当从Channel读取数据时会调用此方法             |
| flush      | 当Channel将数据冲刷到远程节点时调用此方法     |
| write      | 当通过Channel将数据写入到远程节点时调用此方法 |

**几乎所有的方法都将 `ChannelPromise `作为参数**, 一旦请求结束要通过 `ChannelPipeline `转发的时候，必须通知此参数。

**ChannelPromise vs. ChannelFuture**：

- `ChannelPromise `是 特殊的 `ChannelFuture` **（`ChannelPromise `扩展了 `ChannelFuture`）**。任何时候调用例如 `Channel.write(...)` 一个新的 `ChannelPromise`将会创建并且通过 `ChannelPipeline`传递。这次写操作本身将会返回 `ChannelFuture`， 这样只允许你得到一次操作完成的通知。Netty 本身使用 `ChannelPromise `作为返回的 `ChannelFuture` 的通知，事实上在大多数时候就是 `ChannelPromise `自身

### ④ 资源管理

**当我们使用`ChannelInboundHandler`的`read`或`ChannelOutboundHandler`的`write`操作时，我们都需要保证 没有任何资源泄露并尽可能的减少资源耗费。**

之前已经介绍过了`ReferenceCount`引用计数用于处理池化的 `ByteBuf`资源。 为了帮助我们诊断潜在的的资源泄露问题，Netty提供了`ResourceLeakDetector`，它将 对我们的Netty程序的已分配的缓冲区做大约 1% 的采样用以检测内存泄露，Netty 目前定义了4种泄露检测级别，如下

| 级别     | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| Disabled | 禁用泄露检测。我们应当在详细测试之后才应该使用此级别。       |
| SIMPLE   | 使用1%的默认采样率检测并报告任何发现的泄露，这是默认的检测级别。 |
| ADVANCED | 使用默认的采样率，报告任何发现的泄露以及对应的消息的位置。   |
| PARANOID | 类似于ADVANCED，但是每次都会对消息的访问进行采样，此级别可能会对程序的性能造成影响，应该用于调试阶段。 |

我们可以通过 JVM 启动参数来设置`leakDetector`的级别：

```text
java -Dio.netty.leakDetectionLevel=ADVANCED
```

## 2. ChannelPipeline

在 Netty 组件中也介绍过了，`ChannelPipeline`是一系列`ChannelHandler`组成的拦截链，每一个新创建的`Channel `都会被分配一个新的`ChannelPipeline`，`Channel`和`ChannelPipeline`之间的关联是持久的，无需我们干涉它们 之间的关系。

### ① ChannelPipeline 相对论

Netty 总是将`ChannelPipeline`的入站口作为头部，出站口作为尾部，当我们通过`ChannelPipeline`的`add`方法 将入站处理器和出站处理器混合添加到`ChannelPipeline`后，`ChannelHandler`的顺序如下：

![](https://gitee.com/veal98/images/raw/master/img/20201212140609.png)

一个入站事件将从`ChannelPipeline`的头部（左侧）向尾部（右侧）开始传播，出站事件的传播则是与入站的传播方向相反。当`ChannelPipeline`在`ChannelHandler`之间传播事件的时候，它会判断下一个`ChannelHandler`的类型是否与当前`ChannelHandler`的类型相同（通过 `ChannelHandlerContext`），如果相同则说明它们是一个方向的事件， 如果不同则跳过该`ChannelHandler`并前进到下一个`ChannelHandler`，直到它找到相同类型的`ChannelHandler`。

### ② 修改ChannelPipeline

`ChannelPipeline`可以通过添加，删除和修改`ChannelHandler`来修改它自身的布局，这是它最基本的能力， 一下列举了`ChannelPipeline`的一些修改方法：

| 名称                                | 描述                                           |
| ----------------------------------- | ---------------------------------------------- |
| addFirst addBefore addAfter addLast | 添加 ChannelHandler 到 ChannelPipeline.        |
| Remove                              | 从 ChannelPipeline 移除 ChannelHandler.        |
| Replace                             | 在 ChannelPipeline 替换另外一个 ChannelHandler |

### ③ ChannelHandler的执行和阻塞

通常`ChannelPipeline`中的每个`ChannelHandler`都是通过它（`ChannelPipeline`）的`EventLoop`线程来处理 传递给他的数据的，所以我们不能去阻塞这个线程，否则会对整体的 IO 操作产生负面影响。 但有时候不得已 需要使用阻塞的 API 来完成逻辑处理，对于这种情况，`ChannelPipeline`的某些方法支持接受一个`EventLoopGroup `类型的参数，我们可以通过自定义`EventLoopGroup`的方式，使`ChannelHandler`在我们的`EventLoopGroup`内处理数据。 这样一来，就可以避免阻塞线程的影响了。

### ④ 触发事件

`ChannelPipeline`的API不仅有对`ChannelHandler`的增删改操作，还有对入站和出站操作的附加方法，如下：

`ChannelPipeline`的入站方法：

| 方法                          | 描述                                                         |
| :---------------------------- | :----------------------------------------------------------- |
| fireChannelRegistered         | 调用ChannelPipeline中下一个ChannelInboundHandler的channelRegistered方法 |
| fireChannelUnregistered       | 调用ChannelPipeline中下一个ChannelInboundHandler的channelUnregistered方法 |
| fireChannelActive             | 调用ChannelPipeline中下一个ChannelInboundHandler的channelActive方法 |
| fireChannelInactive           | 调用ChannelPipeline中下一个ChannelInboundHandler的channelInactive方法 |
| fireExceptionCaught           | 调用ChannelPipeline中下一个ChannelInboundHandler的exceptionCaught方法 |
| fireUserEventTriggered        | 调用ChannelPipeline中下一个ChannelInboundHandler的userEventTriggered方法 |
| fireChannelRead               | 调用ChannelPipeline中下一个ChannelInboundHandler的channelRead方法 |
| fireChannelReadComplete       | 调用ChannelPipeline中下一个ChannelInboundHandler的channelReadComplete方法 |
| fireChannelWritabilityChanged | 调用ChannelPipeline中下一个ChannelInboundHandler的channelWritabilityChanged方法 |

`ChannelPipeline`的出站方法：

| 方法          | 描述                                                         |
| :------------ | :----------------------------------------------------------- |
| bind          | 调用ChannelPipeline中下一个ChannelOutboundHandler的bind方法，将Channel与本地地址绑定 |
| connect       | 调用ChannelPipeline中下一个ChannelOutboundHandler的connect方法，将Channel连接到远程节点 |
| disconnect    | 调用ChannelPipeline中下一个ChannelOutboundHandler的disconnect方法，将Channel与远程连接断开 |
| close         | 调用ChannelPipeline中下一个ChannelOutboundHandler的close方法，将Channel关闭 |
| deregister    | 调用ChannelPipeline中下一个ChannelOutboundHandler的deregister方法，将Channel从其对应的EventLoop注销 |
| flush         | 调用ChannelPipeline中下一个ChannelOutboundHandler的flush方法，将Channel的数据冲刷到远程节点 |
| write         | 调用ChannelPipeline中下一个ChannelOutboundHandler的write方法，将数据写入Channel |
| writeAndFlush | 先调用write方法，然后调用flush方法，将数据写入并刷回远程节点 |
| read          | 调用ChannelPipeline中下一个ChannelOutboundHandler的read方法，从Channel中读取数据 |

## 3. ChannelHandlerContext

`ChannelHandlerContext`代表的是`ChannelHandler`和`ChannelPipeline`之间的关联，每当有`ChannelHandler `添加到`ChannelPipeline`中时，都会创建`ChannelHandlerContext`。**`ChannelHandlerContext`的主要功能是 管理它所关联的`ChannelHandler`与同一个`ChannelPipeline`中的其他`ChannelHandler`之间的交互**：

![](https://gitee.com/veal98/images/raw/master/img/20201212141047.png)

`ChannelHandlerContext`的大部分方法和`Channel`和`ChannelPipeline`相似，但有一个重要的区别是： 调用`Channel`或`ChannelPipeline`的方法其影响是会沿着整个 `ChannelPipeline` 进行传播：

```java
//使用Chanel write
Channel channel = ctx.channel();
ctx.write(xxx);

//使用Pipeline write
ChannelPipeline pipeline = ctx.pipeline();
pipeline.write(xxx);
```

![](https://gitee.com/veal98/images/raw/master/img/20201212141409.png)

而调用 `ChannelHandlerContext` 的方法则是从其关联的 `ChannelHandler` 开始，并且只会传播给位于该`ChannelPipeline`中的下一个能够处理该事件的 `ChannelHandler`：

```JAVA
//使用ChannelContext write
ChannelHandlerContext ctx = context;
ctx.write(xxx);
```

![](https://gitee.com/veal98/images/raw/master/img/20201212141511.png)

下面是一些比较重要的方法，有些和`ChannelPipeline`功能相似的方法就不再罗列了，各位同学可以直接查看原API。

| 方法     | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| alloc    | 获取与当前ChannelHandlerContext所关联的Channel的ByteBufAllocator |
| handler  | 返回与当前ChannelHandlerContext绑定的ChannelHandler          |
| pipeline | 返回与当前ChannelHandlerContext关联的ChannelPipeline         |
| ...      | ...                                                          |

### ChannelHandlerContext 的高级用法

有时候我们需要在多个`ChannelPipeline`之间共享一个`ChannelHandler`，以此实现**跨管道处理（获取）数据** 的功能，此时的`ChannelHandler`属于多个`ChannelPipeline`，且会绑定到不同的`ChannelHandlerContext`上。 

**在多个`ChannelPipeline`之间共享`ChannelHandler`我们需要使用 `@Sharable` 注解**，这代表着它是一个共享的 `ChannelHandler`，如果一个`ChannelHandler`没有使用`@Sharable`注解却被用于多个`ChannelPipeline`，那么 将会触发异常。 还有非常重要的一点：**一个`ChannelHandler`被用于多个`ChannelPipeline`肯定涉及到多线程 数据共享的问题，因此我们需要保证`ChannelHandler`的方法同步。** 下面是一个很好的例子：

```java
@ChannelHandler.Sharable    
public class UnsafeSharableChannelHandler extends ChannelInboundHandlerAdapter{
    private int count;

    @Override
    public void channelRead(ChannelHandlerContext ctx,Object msg){
        count++;
        System.out.println("count : " + count);
        ctx.fireChannelRead(msg);
    }
}
```

上面这个`ChannelHandler`标识了`@Sharable`注解，这代表它需要被用于多个`ChannelPipeline`之间

**这段代码的问题是它持有状态: 一个实例变量 `count` 保持了方法调用的计数**。将这个类的一个实例添加到 `ChannelPipeline` 并发访问通道时很可能产生错误。一个简单的解决方法就是给修改了`count`的变量的方法 `channelRead` 加`synchronized`关键字，确保即使在多个`ChannelPipeline`之间共享， `ChannelHandler`也能保证数据一致。

## 📚 References

- [Essential Netty in Action 《Netty 实战(精髓)》](https://waylau.com/essential-netty-in-action/GETTING%20STARTED/A%20Closer%20Look%20at%20ChannelHandlers.html)
- [framework-learning](https://qsjzwithguang19forever.gitee.io/framework-learning/gitbook_doc/netty-learning/ByteBuf%E5%AE%B9%E5%99%A8.html)