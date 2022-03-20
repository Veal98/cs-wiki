# 🍨 Transport 详解

---

## 1. 概述

**在网络中传递的数据总是具有相同的类型：字节**。 这些字节流动的细节取决于网络传输，它是一个帮我们抽象底层数据传输机制的概念，我们不需要关心字节流动的细节，只需要确保字节被可靠的接收和发送。

当我们使用 Java 网络编程时，可能会接触到多种不同的网络 IO 模型，如 NIO，BIO (OIO: Old IO)，AIO 等，我们可能因为使用这些不同的 API 而遇到问题。 **Netty 则为这些不同的 IO 模型实现了一个通用的 API**，<u>我们使用这个通用的 API 比直接使用 JDK 提供的 API 要简单的多，且避免了由于使用不同 API 而带来的问题，大大提高了代码的可读性</u>。 在传输这一部分，我们将主要学习这个通用的 API，以及它与 JDK 之间的对比。

## 2. 传输 API — Channel

### ① 概述

传输 API 的核心是 `Channel` 接口 (`io.netty.Channel`，而非 java nio 的 `Channel`) ，它被用于所有的 IO 操作。

`Channel` 结构层次：

![](https://gitee.com/veal98/images/raw/master/img/20201211162421.png)

**每个`Channel`都会被分配一个`ChannelPipeline`和`ChannelConfig`：**

- `ChannelConfig`包含了该`Channel`的所有配置，并允许在运行期间更新它们。

- `ChannelPipeline `存储了所有用于处理出站和入站数据的 `ChannelHandler`， 我们可以在运行时根据自己的需求添加或删除`ChannelPipeline`中的`ChannelHandler`。

此外，`Channel` 还有以下方法值得留意：

|     方法名      |                             描述                             |
| :-------------: | :----------------------------------------------------------: |
|   `eventLoop`   |               返回当前Channel注册到的EventLoop               |
|   `pipeline`    |              返回分配给Channel的ChannelPipeline              |
|   `isActive`    | 判断当前Channel是活动的，如果是则返回true。 此处活动的意义依赖于底层的传输，如果底层传输是TCP Socket，那么客户端与服务端保持连接便是活动的；如果底层传输是UDP Datagram，那么Datagram传输被打开就是活动的。 |
| `localAddress`  |                    返回本地SocketAddress                     |
| `remoteAddress` |                   返回远程的SocketAddress                    |
|     `write`     |     将数据写入远程主机，数据将会通过ChannelPipeline传输      |
|     `flush`     |                将之前写入的数据刷新到底层传输                |
|  `writeFlush`   |       等同于调用 write 写入数据后再调用 flush 刷新数据       |

举个例子：写数据到远程已连接客户端可以调用 `Channel.write()` 方法，如下代码：

```java
Channel channel = ....; // 获取 channel 的引用
// 创建 ByteBuf 保存写的数据
ByteBuf buf = Unpooled.copiedBuffer("your data", CharsetUtil.UTF_8);
// 写数据，并刷新
ChannelFuture cf = channel.writeAndFlush(buf);

// 添加 ChannelFutureListener 监听，即可在写操作完成后收到通知，
cf.addListener(new ChannelFutureListener() {
    @Override
    public void operationComplete(ChannelFuture future) {
        if (future.isSuccess()) { // 写操作顺利完成
            System.out.println("Write successful");
        } else { // 写操作完成时出现错误
            System.err.println("Write error"); 
            future.cause().printStackTrace();
        }
    }
});
```

**`Channel` 是线程安全(thread-safe)的，它可以被多个不同的线程安全的操作**，在多线程环境下，所有的方法都是安全的。正因为 `Channel `是安全的，我们存储对`Channel`的引用，并在学习的时候使用它写入数据到远程已连接的客户端，使用多线程也是如此。下面的代码是一个简单的**多线程**例子：

```java
final Channel channel = ...; // 获取channel的引用
// 创建一个 ByteBuf 保存写的数据
final ByteBuf buf = Unpooled.copiedBuffer("your data", CharsetUtil.UTF_8).retain();
// 创建 Runnable 用于写数据到 channel
Runnable writer = new Runnable() { 
    @Override
    public void run() {
        channel.writeAndFlush(buf.duplicate());
    }
};
// 获取 Executor 的引用使用线程来执行任务
Executor executor = Executors.newCachedThreadPool();

// 写进一个线程
executor.execute(writer);

//写进另外一个线程
executor.execute(writer);
```

### ② 直观感受 Netty 统一的传输 API

**Netty 使用相同的 API 来实现每个传输，它并不关心你使用什么来实现**。Netty 通过操作接口 `Channel `、`ChannelPipeline `和 `ChannelHandler`来实现。

下面我们通过直观的例子来感受下，Netty 只需要简单的修改就可以将 BIO 改为 NIO 👇

#### Ⅰ Netty BIO 版本

下面代码是使用 Netty 作为网络框架编写的一个阻塞 IO 例子：

```java
public class NettyOioServer {

    public void server(int port) throws Exception {
        final ByteBuf buf = Unpooled.unreleasableBuffer(
                Unpooled.copiedBuffer("Hi!\r\n", Charset.forName("UTF-8")));
        EventLoopGroup group = new OioEventLoopGroup();
        try {
            // 创建一个引导类 ServerBootstrap
            ServerBootstrap b = new ServerBootstrap();

            b.group(group)
             // 使用 OioEventLoopGroup 允许阻塞模式（Old-IO 即 BIO）
             .channel(OioServerSocketChannel.class) 
             .localAddress(new InetSocketAddress(port))
             // 指定 ChannelInitializer 将给每个接受的连接调用
             .childHandler(new ChannelInitializer<SocketChannel>() {
                 @Override
                 public void initChannel(SocketChannel ch) throws Exception {
                     // 添加 ChannelHandler 拦截事件，并允许他们作出反应
                     ch.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                         @Override
                         public void channelActive(ChannelHandlerContext ctx) throws Exception{
                             // 写信息到客户端，并添加监听：一旦消息写入就关闭连接
                             ctx.writeAndFlush(buf.duplicate()).
                                 addListener(ChannelFutureListener.CLOSE);
                         }
                     });
                 }
             });
            // 绑定服务器来接受连接
            ChannelFuture f = b.bind().sync();
            f.channel().closeFuture().sync();
        } finally {
            // 释放所有资源
            group.shutdownGracefully().sync();
        }
    }
}
```

下面代码是使用 Netty NIO 实现 👇

#### Ⅱ Netty NIO 版本

下面是 Netty NIO 的代码，👍 只是将 `OioEventLoopGroup` 变成了 `NioEventLoopGroup`，将 `OioServerSocketChannel` 变成了 `NioServerSocketChannel`，就从 BIO (OIO) 传输 切换到了 NIO。

```java
public class NettyNioServer {

    public void server(int port) throws Exception {
        final ByteBuf buf = Unpooled.unreleasableBuffer(
                Unpooled.copiedBuffer("Hi!\r\n", Charset.forName("UTF-8")));
        NioEventLoopGroup group = new NioEventLoopGroup();
        try {
            // 创建一个引导类 ServerBootstrap
            ServerBootstrap b = new ServerBootstrap();
            b.group(new NioEventLoopGroup(), new NioEventLoopGroup())
             // 使用 NioEventLoopGroup 允许NIO模式
             .channel(NioServerSocketChannel.class)
             .localAddress(new InetSocketAddress(port))
             // 指定 ChannelInitializer 将给每个接受的连接调用
             .childHandler(new ChannelInitializer<SocketChannel>() {
                 @Override
                 public void initChannel(SocketChannel ch) 
                     throws Exception {
                     // 添加 ChannelHandler 拦截事件，并允许他们作出反应
                     ch.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                         @Override
                         public void channelActive(ChannelHandlerContext ctx) throws Exception{
                             // 写信息到客户端，并添加监听：一旦消息写入就关闭连接
                             ctx.writeAndFlush(buf.duplicate())
                                .addListener(ChannelFutureListener.CLOSE);
                         }
                     });
                 }
             });
            // 绑定服务器来接受连接
            ChannelFuture f = b.bind().sync(); 
            f.channel().closeFuture().sync();
        } finally {
            // 释放所有资源
            group.shutdownGracefully().sync();
        }
    }
}
```



## 3. Netty 自带的传输方式/协议

Netty 自带了一些传输协议的实现，虽然没有支持所有的传输协议，但是其自带的已足够我们来使用。Netty 应用程序的传输协议依赖于底层协议。

Netty内置`Channel`接口层次：

![](https://gitee.com/veal98/images/raw/master/img/20201211162629.png)

Netty 中的传输方式有如下几种：

|    名称     |             包              | 描述                                                         |
| :---------: | :-------------------------: | :----------------------------------------------------------- |
|     NIO     | io.netty.channel.socket.nio | `NioChannel`基于java.nio.channels，其io模型为IO多路复用      |
|    Epoll    |   io.netty.channel.epoll    | `EpollChannel`基于操作系统的epoll函数，其io模型为IO多路复用，不过Epoll模型只支持在Linux上的多种特性，比NIO性能更好 |
|   KQueue    |   io.netty.channel.kqueue   | `KQueue `与 Epoll 相似，它主要被用于 FreeBSD 系统上，如Mac等 |
| OIO(Old Io) | io.netty.channel.socket.oio | `OioChannel`基于 java.net 包，其 io 模型是阻塞的，且此传输被 Netty 标记为 deprecated，故不推荐使用，最好使用 NIO / EPOLL / KQUEUE 等传输 |
|    Local    |   io.netty.channel.local    | `LocalChannel `可以在 JVM 虚拟机内部进行本地通信             |
|  Embedded   |  io.netty.channel.embedded  | `EmbeddedChannel`允许在没有真正的网络传输中使用ChannelHandler，可以非常有用的测试 ChannelHandler |

## 4. 零拷贝

### ① 什么是零拷贝

**零拷贝(Zero-Copy)**是一种目前只有在使用`NIO`和`Epoll`传输时才可使用的特性。 在之前的 IO 模型中，所有的 IO 的数据都是从内核复制到用户应用进程，再由用户应用进程处理。 而**零拷贝则可以快速地将数据从源文件移动到目标文件，无需经过用户空间**。

在学习零拷贝技术之前先回顾一下普通的 IO 拷贝过程吧， 这里举个栗子： 我要使用一个程序将一个目录下的文件复制到另一个目录下， 在普通的 IO 中，其过程如下：

![](https://gitee.com/veal98/images/raw/master/img/20201211162947.png)

- 应用程序启动后，向内核发出 `read` 调用（用户态切换到内核态）
- 操作系统收到调用请求后， 会检查文件是否已经缓存过了:
  - 如果缓存过了，就将数据从缓冲区（直接内存）拷贝到用户应用进程（内核态切换到用户态）
  - 如果是第一次访问这个文件，则系统先将数据先拷贝到缓冲区（直接内存），然后CPU将数据从缓冲区拷贝到应用进程内（内核态切换到用户态）
- 应用进程收到内核的数据后发起 `write` 调用，将数据拷贝到目标文件相关的堆栈内存（用户态切换到内核态）， 最后再从缓存拷贝到目标文件。

根据上面普通拷贝的过程我们知道了其缺点主要有：

1. 用户态与内核态之间的上下文切换次数较多（用户态发送系统调用与内核态将数据拷贝到用户空间）。
2. 拷贝次数较多，每次 IO 都需要 DMA 和 CPU 拷贝。

**而零拷贝正是针对普通拷贝的缺点做了很大改进，使得其拷贝速度在处理大数据的时候很是出色**。

### ② 如何实现零拷贝

零拷贝主要有两种实现技术：

1. 内存映射
2. 文件传输

#### Ⅰ 内存映射 Memory Mapped

内存映射对应 JAVA NIO 的 API 为 `FileChannel.map`。

当用户程序发起 `mmp` 系统调用后，操作系统会将文件的数据直接映射到内核缓冲区中， 且**缓冲区会与用户空间共享这一块内存**，这样就无需将数据从内核拷贝到用户空间了，用户程序接着发起 `write` 调用，操作系统直接将内核缓冲区的数据拷贝到目标文件的缓冲区，最后再将数据从缓冲区拷贝到目标文件。

其过程如下：

![](https://gitee.com/veal98/images/raw/master/img/20201211171022.png)

**内存映射由原来的四次拷贝减少到了三次，且拷贝过程都在内核空间，这在很大程度上提高了 IO 效率**。

但是 `mmp` 也有缺点： 当我们使用 `mmp` 调用映射一个文件到内存后，如果另一个进程同时对这个文件阶段或是做出写的操作， 那么系统如果此时正在将数据 `write` 到目标文件，用户程序可能会因为访问非法地址而产生一个错误的信号从而终止。

试想一种情况：我们的服务器接收一个客户端的下载请求，客户端请求的是一个超大的文件，服务端开启一个线程 使用 `mmp` 和 `write` 将文件拷贝到 Socket 进行响应，如果此时又有一个客户端请求对这个文件做出修改， 由于这个文件先前已经被第一个线程 `mmp` 了，可能第一个线程会因此出现异常，客户端也会请求失败。

解决这个问题的最简单的一种方法就对这个文件加读写锁，当一个线程对这个文件进行读或写时，其他线程不能操作此文件， 不过这样处理并发的能力可能就大打折扣了。

```java
import io.netty.channel.EventLoop;

import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

/**
 * @description 零拷贝测试
 */
public class ZeroCopyTest{
    public static void main(String[] args) throws Exception{
		mmp();
    }

    /**
     * mmp 测试
     */
    public static void mmp() throws IOException{
        // 读文件通道
        FileChannel fileChannelIn = FileChannel.open(Path.of("/home/images/图片/壁纸/SC01C25.jpg"), StandardOpenOption.READ);
        // 写文件通道
        FileChannel fileChannelTo = FileChannel.open(Path.of("/home/images/a.jpg"),StandardOpenOption.WRITE);
        // 内存映射
        MappedByteBuffer mappedByteBuffer = fileChannelIn.map(FileChannel.MapMode.READ_ONLY, 0, fileChannelIn.size());
        fileChannelTo.write(mappedByteBuffer);

        // 如果是处理网络请求
	   // SocketChannel socketChannel = SocketChannel.open();
	   // SocketChannel.write(mappedByteBuffer);

        fileChannelIn.close();
        fileChannelTo.close();
    }
}
```

#### Ⅱ 文件传输 Send File

文件传输对应 JAVA NIO 的 API 为 `FileChannel.transferFrom/transferTo`

在了解文件传输之前，先来看一下它的函数原型（linux 系统的同学可以使用 man sendfile 查看）：

```text
#include<sys/sendfile.h>

ssize_t 

sendfile(int out_fd,
        int in_fd,
        off_t *offset,
        size_t count);
```

**`sendfile` 在代表输入文件的文件描述符 `in_fd` 和 输出文件的文件描述符 `out_fd` 之间传输文件内容**， 这个传输过程完全是在内核之中进行的，程序只需要把输入文件的描述符和输出文件的描述符传递给 `sendfile` 调用，系统自然会完成拷贝。 当然，`sendfile` 和 `mmp` 一样都有相同的缺点，在传输过程中， 如果有其他进程截断了这个文件的话，用户程序仍然会被终止。

`sendfile` 传输过程如下：

![](https://gitee.com/veal98/images/raw/master/img/20201211171751.png)

它的拷贝次数与 mmp 一样，但是 **sendfile 的拷贝过程只在内核空间进行**，无需像 mmp 一样与用户进程共享内存。

```java
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

/**
 * @description 零拷贝测试
 */
public class ZeroCopyTest{
    public static void main(String[] args) throws Exception{
		sendFile();
    }

    /**
     * sendfile测试
     */
    public static void sendFile() throws IOException
    {
        // 读文件通道
        FileChannel fileChannelIn = FileChannel.open(Path.of("/home/images/图片/壁纸/SC01C25.jpg"), StandardOpenOption.READ);
        // 写文件通道
        FileChannel fileChannelTo = FileChannel.open(Path.of("/home/images/a.jpg"), StandardOpenOption.WRITE);
        // fileChannelIn ——> fileChannelTo（sendfile)
        fileChannelIn.transferTo(0,fileChannelIn.size(), fileChannelTo);

        fileChannelIn.close();
        fileChannelTo.close();
    }

}
```

## 📚 References

- [Essential Netty in Action 《Netty 实战(精髓)》](https://waylau.com/essential-netty-in-action/GETTING%20STARTED/A%20Closer%20Look%20at%20ChannelHandlers.html)
- [framework-learning](https://qsjzwithguang19forever.gitee.io/framework-learning/gitbook_doc/netty-learning/ByteBuf%E5%AE%B9%E5%99%A8.html)