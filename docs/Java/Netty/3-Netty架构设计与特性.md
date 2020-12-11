

# 🌸 Netty 架构设计与功能特性

---

## 1. Netty 架构

![](https://gitee.com/veal98/images/raw/master/img/20201210212218.png)

- 传输服务 支持 BIO 和 NIO
- 容器集成 支持 OSGI、JBossMC、Spring、Guice 容器
- 协议支持 HTTP、Protobuf、二进制、文本、WebSocket 等一系列常见协议都支持。 还支持通过实行编码解码逻辑来实现自定义协议
- 核心：可扩展事件模型、通用通信API、支持零拷贝的 ByteBuf 缓冲对象

## 2. Netty 特性

### ① 丰富的缓冲实现（数据容器）

**Netty 使用自建的 buffer API，而不是使用 NIO 的 `ByteBuffer` 来表示一个连续的字节序列**。与 `ByteBuffer `相比这种方式拥有明显的优势。Netty 使用新的 buffer 类型 `ByteBuf`，被设计为一个可从底层解决 `ByteBuffer `问题，并可满足日常网络应用开发需要的缓冲类型。这些很酷的特性包括：

- 如果需要，允许使用自定义的缓冲类型。
- 复合缓冲类型中内置的透明的零拷贝实现。
- 开箱即用的动态缓冲类型，具有像 `StringBuffer `一样的动态缓冲能力。
- 不再需要调用的 `flip()` 方法。
- 正常情况下具有比 `ByteBuffer `更快的响应速度。

#### Ⅰ Extensibility 可扩展性

`ByteBuf `具有丰富的操作集,可以快速的实现协议的优化。例如，`ByteBuf `提供各种操作用于访问无符号值和字符串，以及在缓冲区搜索一定的字节序列。你也可以扩展或包装现有的缓冲类型用来提供方便的访问。<u>自定义缓冲仍然实现自 `ByteBuf `接口，而不是引入一个不兼容的类型</u>

#### Ⅱ Transparent Zero Copy 透明的零拷贝

举一个网络应用到极致的表现，你需要减少内存拷贝操作次数。你可能有一组缓冲区可以被组合以形成一个完整的消息。网络提供了一种复合缓冲，允许你从现有的任意数的缓冲区创建一个新的缓冲区而无需内存拷贝。例如，一个信息可以由两部分组成；header 和 body。在一个模块化的应用，当消息发送出去时，这两部分可以由不同的模块生产和装配。

```
 +--------+----------+
 | header |   body   |
 +--------+----------+
 
```

如果你使用的是 `ByteBuffer `，你必须要创建一个新的大缓存区用来拷贝这两部分到这个新缓存区中。或者，你可以在 NiO 做一个收集写操作，但限制你将复合缓冲类型作为 `ByteBuffer ` 的数组而不是一个单一的缓冲区，打破了抽象，并且引入了复杂的状态管理。此外，如果你不从 NIO channel 读或写，它是没有用的。

```java
// 复合类型与组件类型不兼容。
ByteBuffer[] message = new ByteBuffer[] { header, body };
```

通过对比， ByteBuf 不会有警告，因为它是完全可扩展并有一个内置的复合缓冲区。

```java
// 复合类型与组件类型是兼容的。
ByteBuf message = Unpooled.wrappedBuffer(header, body);

// 因此，你甚至可以通过混合复合类型与普通缓冲区来创建一个复合类型。
ByteBuf messageWithFooter = Unpooled.wrappedBuffer(message, footer);

// 由于复合类型仍是 ByteBuf，访问其内容很容易，
//并且访问方法的行为就像是访问一个单独的缓冲区，
//即使你想访问的区域是跨多个组件。
//这里的无符号整数读取位于 body 和 footer
messageWithFooter.getUnsignedInt(
     messageWithFooter.readableBytes() - footer.readableBytes() - 1);
```

#### Ⅲ Automatic Capacity Extension 自动容量扩展

在 JDK NIO 中，一旦 `ByteBuffer` 被分配了内存就不能再改变大小，这可能会带来很多不便。 比如我们在创建字符串时可能不确定字符串的长度，这种情况下如果使用 `String` 可能会有多次拼接的消耗， 所以这就是 `StringBuilder` 的作用，同样的，`ByteBuf` 也是如此。

```java
// 一种新的动态缓冲区被创建。在内部，实际缓冲区是被“懒”创建，从而避免潜在的浪费内存空间。
ByteBuf b = Unpooled.buffer(4);

// 当第一个执行写尝试，内部指定初始容量 4 的缓冲区被创建
b.writeByte('1');

b.writeByte('2');
b.writeByte('3');
b.writeByte('4');

// 当写入的字节数超过初始容量 4 时，
// 内部缓冲区自动分配具有较大的容量
b.writeByte('5');
```

#### Ⅳ Better Performance 更好的性能

最频繁使用的缓冲区 `ByteBuf` 的实现是一个非常薄的字节数组包装器（比如，一个字节）。与 `ByteBuffer` 不同，它没有复杂的边界和索引检查补偿，因此对于 JVM 优化缓冲区的访问更加简单。更多复杂的缓冲区实现是用于拆分或者组合缓存，并且比 `ByteBuffer ` 拥有更好的性能。

### ② 统一的异步 I/O API

传统的 Java I/O API 在应对不同的传输协议时需要使用不同的类型和方法。例如：`java.net.Socket`  对应 TCP 协议， `java.net.DatagramSocket` 对应 UDP 协议，它们并不具有相同的超类型，因此，这就需要使用不同的调用方式执行 `Socket `操作。

**这种模式上的不匹配使得在更换一个网络应用的传输协议时变得繁杂和困难**。由于（Java I/O API）缺乏协议间的移植性，当你试图在不修改网络传输层的前提下增加多种协议的支持，这时便会产生问题。并且理论上讲，多种应用层协议可运行在多种传输层协议之上例如 TCP/IP,UDP/IP,SCTP 和串口通信。

让这种情况变得更糟的是，<u>Java 新的 I/O（NIO）API 与原有的阻塞式的 I/O（OIO）API 并不兼容，NIO.2(AIO) 也是如此</u>。由于所有的 API 无论是在其设计上还是性能上的特性都与彼此不同，在进入开发阶段，你常常会被迫的选择一种你需要的 API。

例如，在用户数较小的时候你可能会选择使用传统的 BIO API，毕竟与 NIO 相比使用 BIO 将更加容易一些。然而，当你的业务呈指数增长并且服务器需要同时处理成千上万的客户连接时你便会遇到问题。这种情况下你可能会尝试使用 NIO，但是复杂的 NIO Selector 编程接口又会耗费你大量时间并最终会阻碍你的快速开发。

**Netty 有一个叫做 `Channel` 的统一的异步 I/O 编程接口，这个编程接口抽象了所有点对点的通信操作**。也就是说，<u>如果你的应用是基于 Netty 的某一种传输实现，那么同样的，你的应用也可以运行在 Netty 的另一种传输实现上</u>。

切换不同的传输实现通常只需对代码进行几行的修改调整，例如选择一个不同的 `ChannelFactory` 实现。

### ③ 基于拦截链模式的事件模型

一个定义良好并具有扩展能力的事件模型是事件驱动开发的必要条件。Netty 具有定义良好的 I/O 事件模型。由于严格的层次结构区分了不同的事件类型，因此 **Netty 允许你在不破坏现有代码的情况下实现自己的事件类型**。这是与其他框架相比另一个不同的地方。很多 NIO 框架没有或者仅有有限的事件模型概念；在你试图添加一个新的事件类型的时候常常需要修改已有的代码，或者根本就不允许你进行这种扩展。

在一个 `ChannelPipeline` 内部一个 `ChannelEvent `被一组`ChannelHandler `处理。这个管道是 I**ntercepting Filter (拦截过滤器)模式**的一种高级形式的实现，因此对于一个事件如何被处理以及管道内部处理器间的交互过程，你都将拥有绝对的控制力。例如，你可以定义一个从 socket 读取到数据后的操作：

```java
public class MyReadHandler implements SimpleChannelHandler {
       public void messageReceived(ChannelHandlerContext ctx, MessageEvent evt) {
         Object message = evt.getMessage();
           // Do something with the received message.
            ...

         // And forward the event to the next handler.
         ctx.sendUpstream(evt);
    }
}
```

同时你也可以定义一种操作响应其他处理器的写操作请求：

```java
public class MyWriteHandler implements SimpleChannelHandler {
      public void writeRequested(ChannelHandlerContext ctx, MessageEvent evt) {
        Object message = evt.getMessage();
          // Do something with the message to be written.
            ...

        // And forward the event to the next handler.
        ctx.sendDownstream(evt);
    }
}
```

## 📚 References

- [netty-4-user-guide](https://waylau.com/netty-4-user-guide/Architectural%20Overview/Architectural%20Overview.html)