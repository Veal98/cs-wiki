# 🚀 实例：Netty 实现聊天功能

---

> 🔊 关于 Netty 的 TCP 粘包/拆包以及 TCP 心跳机制在本代码中有相关体现，大家先按照代码敲下来或者直接去掉就行，并不影响整体逻辑，后续文章会详细解释。先做个项目对于后续内容大家才能更直观感受

本项目基于：

- Java 8
- IDEA 2020
- Netty 4.1.42

## 1. 新建项目并导入依赖

新建一个 Maven 项目并导入 Netty 4 依赖：

```xml
<dependencies>
    <dependency>
        <groupId>io.netty</groupId>
        <artifactId>netty-all</artifactId>
        <version>4.1.42.Final</version>
    </dependency>
</dependencies>
```

## 2. 服务端

### ① 结构总览

服务端包含三个文件：

<img src="https://gitee.com/veal98/images/raw/master/img/20201214210723.png" style="zoom:67%;" />

- `SimpleChatServer`：用于绑定端口启动服务端
- `SimpleChatServerHandler`：用于处理服务端的 I/O 事件。包括：
  - 当客户端连接时该怎么处理
  - 当客户端连接断开时该怎么处理
  - 当客户端连接出现异常时该怎么处理
  - 当接收到客户端发过来的消息时怎么处理
  - 监听客户端是否在线，分别做如何处理
- `SimpleChatServerInitializer`：用来增加多个 Handler 处理类到 ChannelPipeline 上，包括编解码以及自定义的 Handler。相当于所有的 Handler 在此处汇总。这样引导启动的时候直接指定这个类即可

### ② SimpleChatServerHandler

`SimpleChatServerHandler` 是我们自定义的处理类，继承了 `SimpleChannelInboundHandler`。

其中以下三个方法即 `ChannelHandler `的生命周期：

- `handlerAdded`：当把 ChannelHandler 添加到 ChannelPipeline 中时调用此方法
- `handlerRemoved`：当把 ChannelHandler 从 ChannelPipeline 中移除的时候会调用此方法
- `exceptionCaught`：当 ChannelHandler 在处理数据的过程中发生异常时会调用此方法

其中以下三个方法即 `ChannelInboundHandler`的生命周期：

- `channelActive`：当 Channel 已经连接到远程节点(或者已绑定本地address)且处于活动状态时会调用此方法。即服务器监听到客户端活动

- `channelInactive`：当 Channel 与远程节点断开，不再处于活动状态时调用此方法。即服务器监听到客户端不活动

- `channelRead`：当 Channel 有数据可读时调用此方法

  > 💡 **`SimpleChannelInboundHandler`** 继承了 `ChannelInboundHandlerAdapter`，且已经实现了与业务无关的资源管理，我们不需要手动管理资源。我们只需要覆盖它的`channelRead0`方法来完成我们的逻辑就够了

```java
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.concurrent.GlobalEventExecutor;

/**
 * 服务端 ChannelHandler: 处理服务端 I/O 事件
 *
 * SimpleChannelInboundHandler<String> 中的泛型表示要处理的进站数据的类型
 */
public class SimpleChatServerHandler extends SimpleChannelInboundHandler<String> {

    public static ChannelGroup channelGroup = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

    /**
     * 当把 ChannelHandler 添加到 ChannelPipeline 中时调用此方法
     * 即每当从服务端收到新的客户端连接时 ↓
     * 将客户端的 Channel 存入 ChannelGroup 列表中，并通知列表中的其他客户端 Channel
     * @param context
     */
    @Override
    public void handlerAdded(ChannelHandlerContext context){
        // 获取当前连接的客户端的 channel
        Channel incoming = context.channel();
        // 将客户端的 Channel 存入 ChannelGroup 列表中
        channelGroup.add(incoming);
        // 通知列表中的其他客户端 Channel
        channelGroup.writeAndFlush("[Server] - " + incoming.remoteAddress() + " 加入\n");
    }

    /**
     * 当把 ChannelHandler 从 ChannelPipeline 中移除的时候会调用此方法
     * 即 每当从服务端收到客户端断开时 ↓
     * 客户端的 Channel 自动从 ChannelGroup 列表中移除，并通知列表中的其他客户端 Channel
     * @param context
     */
    @Override
    public void handlerRemoved(ChannelHandlerContext context){
        // 获取当前连接的客户端的 channel
        Channel incoming = context.channel();
        // 当客户端断开时,客户端的 Channel 自动从 ChannelGroup 列表中移除, 所以下面这行代码可以不写
        // channelGroup.remove(incoming);

        // 通知列表中的其他客户端 Channel
        channelGroup.writeAndFlush("[Server] - " + incoming.remoteAddress() + " 离开\n");
    }

    /**
     * 当 ChannelHandler 在处理数据的过程中发生异常时会调用此方法
     * 在大部分情况下，捕获的异常应该被记录下来并且把关联的 channel 给关闭掉。
     * @param context
     * @param cause
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext context, Throwable cause){
        // 获取当前连接的客户端的 channel
        Channel incoming = context.channel();
        System.out.println("SimpleChatClient: "+ incoming.remoteAddress() + " 异常");
        cause.printStackTrace();
        // 关闭连接
        context.close();
    }

    /**
     * 每当从服务端读到客户端写入信息时，
     * 将信息转发给其他客户端的 Channel
     * @param context
     * @param s 客户端发过来的信息
     * @throws Exception
     */
    @Override
    protected void channelRead0(ChannelHandlerContext context, String s) throws Exception {
        // 获取当前连接的客户端 Channel
        Channel incoming = context.channel();
        for(Channel channel : channelGroup){ // 对于 channelGroup 中的每一个 channel
            // 将信息转发给其他客户端的 Channel
            if(channel != incoming){
                channel.writeAndFlush("[" + incoming.remoteAddress() + "] " + s + "\n");
            }
            // 消息来源于自己
            else{
                channel.writeAndFlush("[you] " + s + "\n");
            }
        }
    }

    /**
     * 当 Channel 已经连接到远程节点(或者已绑定本地 address)且处于活动状态时会调用此方法
     * 即 服务端监听到客户端活动
     * @param context
     */
    @Override
    public void channelActive(ChannelHandlerContext context){
        Channel incoming = context.channel();
        System.out.println("SimpleChatClient: " + incoming.remoteAddress() + " 在线");
    }

    /**
     * 当 Channel与远程节点断开，不再处于活动状态时调用此方法
     * 即 服务端监听到客户端不活动
     * @param context
     */
    @Override
    public void channelInactive(ChannelHandlerContext context){
        Channel incoming = context.channel();
        System.out.println("SimpleChatClient: " + incoming.remoteAddress() + " 离线");
    }

}

```

### ③ SimpleChatServerInitializer

`ChannelInitializer`这个类中，我们注意到有一个泛型参数 `SocketChannel`，这个类就是 Netty 对 NIO 类型的连接的抽象

```java
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.codec.Delimiters;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;

/**
 * 服务端 ChannelInitializer
 * 用来增加多个 Handler 处理类到 ChannelPipeline 上，包括编码、解码、SimpleChatServerHandler 等。
 */
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

### ④ SimpleChatServer

绑定端口接收客户端连接，对应 `bind` 函数

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;

/**
 * 启动服务端
 */
public class SimpleChatServer {

    private int port;

    public SimpleChatServer(int port){
        this.port = port;
    }

    public void run() throws InterruptedException {
        // 接收连接
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        // 处理已经被接收的连接
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            // 服务端引导类 ServerBootstrap
            ServerBootstrap serverBootstrap = new ServerBootstrap();
            serverBootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new SimpleChatServerInitializer())
                    .option(ChannelOption.SO_BACKLOG, 128)
                    // 使用 TCP 协议层面的 keepalive 机制（心跳检测）
                    .childOption(ChannelOption.SO_KEEPALIVE, true); 
            System.out.println("SimpleChatServer 已启动");

            // 绑定端口，开始接收客户端连接
            ChannelFuture channelFuture = serverBootstrap.bind(port).sync();
		   // 等待服务端监听端口关闭
            channelFuture.channel().closeFuture().sync();
        }
        finally {
            workerGroup.shutdownGracefully();
            bossGroup.shutdownGracefully();
            System.out.println("SimpleChatServer 已关闭");
        }
    }

    /**
     * 启动服务
     * @param args
     * @throws InterruptedException
     */
    public static void main(String[] args) throws InterruptedException {
        new SimpleChatServer(8080).run();
    }
}

```

#### 👍 服务端启动流程详解

- 首先看到，我们创建了两个`NioEventLoopGroup`，这两个对象可以看做是传统IO编程模型的两大线程组，`bossGroup`表示监听端口并接收新连接的线程组，`workerGroup`表示处理每一条连接的数据读写的线程组。用生活中的例子来讲就是，一个工厂要运作，必然要有一个老板负责从外面接活，然后有很多员工，负责具体干活，老板就是`bossGroup`，员工们就是`workerGroup`，`bossGroup`接收完连接，扔给`workerGroup`去处理。
- 接下来 我们创建了一个引导类 `ServerBootstrap`，这个类将引导我们进行服务端的启动工作
- 我们通过`.group(bossGroup, workerGroup)`给引导类配置两大线程组，这个引导类的线程模型也就定型了。
- 然后，我们指定我们服务端的 IO 模型为`NIO`，我们通过`.channel(NioServerSocketChannel.class)`来指定 IO 模型，当然，这里也有其他的选择，如果你想指定 IO 模型为 BIO，那么这里配置上`OioServerSocketChannel.class`类型即可，当然通常我们也不会这么做，因为 Netty 的优势就在于NIO。
- 接着，我们调用`childHandler()`方法，给这个引导类创建一个`ChannelInitializer`，这里主要就是定义后续每条连接的数据读写，业务处理逻辑。

以上服务端启动还包含其他方法：

- **`childOption()` 方法**

  ```java
  serverBootstrap
          .childOption(ChannelOption.SO_KEEPALIVE, true)
          .childOption(ChannelOption.TCP_NODELAY, true)
  ```

  `childOption()`可以给每条连接设置一些 TCP 底层相关的属性，比如上面，我们设置了两种TCP属性，其中

  - `ChannelOption.SO_KEEPALIVE` 表示是否开启TCP底层心跳机制，true为开启
  - `ChannelOption.TCP_NODELAY` 表示是否开启Nagle算法，true表示关闭，false表示开启，通俗地说，如果要求高实时性，有数据发送时就马上发送，就关闭，如果需要减少发送次数减少网络交互，就开启。

  其他的参数这里就不一一讲解，有兴趣的同学可以去这个类里面自行研究。=

- **`option()` 方法**

  除了给每个连接设置这一系列属性之外，我们还可以给服务端 channel 设置一些属性，最常见的就是so_backlog，如下设置

  ```java
  serverBootstrap.option(ChannelOption.SO_BACKLOG, 1024)
  ```

  表示系统用于临时存放已完成三次握手的请求的队列的最大长度，如果连接建立频繁，服务器处理创建新连接较慢，可以适当调大这个参数

- **`attr()` 方法**

  ```java
  serverBootstrap.attr(AttributeKey.newInstance("serverName"), "nettyServer")
  ```

  `attr()`方法可以给服务端的 channel，也就是`NioServerSocketChannel`指定一些自定义属性，然后我们可以通过`channel.attr()`取出这个属性，比如，上面的代码我们指定我们服务端channel的一个`serverName`属性，属性值为`nettyServer`，其实说白了就是给`NioServerSocketChannel`维护一个 map 而已，通常情况下，我们也用不上这个方法。

  那么，当然，除了可以给服务端 channel `NioServerSocketChannel`指定一些自定义属性之外，我们还可以给每一条连接指定自定义属性

- **`childAttr()` 方法**

  ```java
  serverBootstrap.childAttr(AttributeKey.newInstance("clientKey"), "clientValue")
  ```

  上面的`childAttr`可以给每一条连接指定自定义属性，然后后续我们可以通过`channel.attr()`取出该属性。

## 3. 客户端

### ① 结构总览

客户端同样包含三个文件：

<img src="https://gitee.com/veal98/images/raw/master/img/20201214214106.png" style="zoom:67%;" />

- `SimpleChatClient`：用于绑定端口启动客户端
- `SimpleChatClientHandler`：用于处理客户端的 I/O 事件。客户端的处理比较简单，只需要将读到的信息打印出来即可
- `SimpleChatClientInitializer`：同服务端。用来增加多个 Handler 处理类到 ChannelPipeline 上，包括编解码以及自定义的 Handler。相当于所有的 Handler 在此处汇总。这样引导启动的时候直接指定这个类即可

### ② SimpleChatClientHandler

```java
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;

/**
 * 客户端 ChannelHandler：处理服务端 I/O 事件
 * 客户端的处理类比较简单，只需要将读到的信息打印出来即可
 */
public class SimpleChatClientHandler extends SimpleChannelInboundHandler<String> {
    @Override
    protected void channelRead0(ChannelHandlerContext channelHandlerContext, String s) throws Exception {
        System.out.println(s);
    }
}
```

### ③ SimpleChatClientInitializer

同服务端：

```java
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.codec.Delimiters;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;

/**
 * 客户端 ChannelInitializer
 * 用来增加多个 Handler 处理类到 ChannelPipeline 上，包括编码、解码、SimpleChatServerHandler 等。
 */
public class SimpleChatClientInitializer extends ChannelInitializer<SocketChannel> {

    @Override
    protected void initChannel(SocketChannel socketChannel) throws Exception {
        ChannelPipeline pipeline = socketChannel.pipeline();
        // DelimiterBasedFrameDecoder 分隔符解码器，解决 TCP 粘包/拆包问题
        pipeline.addLast("framer", new DelimiterBasedFrameDecoder(8192, Delimiters.lineDelimiter()));
        // 将前一步解码得到的数据转码为字符串
        pipeline.addLast("decoder", new StringDecoder());
        // 编码器
        pipeline.addLast("encoder", new StringEncoder());
        // Handler 最终的数据处理
        pipeline.addLast("handler", new SimpleChatClientHandler());
    }
}
```

### ④ SimpleChatClient

启动客户端，使用指定端口连接服务端，对应 `connect` 函数

```java
package client;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * 启动客户端
 */
public class SimpleChatClient {

    private String host;
    private int port;

    public SimpleChatClient(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public void run() throws InterruptedException {
        NioEventLoopGroup group = new NioEventLoopGroup();
        try{
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(group)
                .channel(NioSocketChannel.class)
                .handler(new SimpleChatClientInitializer());
            Channel channel = bootstrap.connect(host, port).sync().channel();
            // 获取用户输入
            BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
            while (true){
                // 客户端在每条信息的末尾使用固定的分隔符 比如 \r\n, 防止 TCP 粘包/拆包
                channel.writeAndFlush(in.readLine() + "\r\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            group.shutdownGracefully();
        }
    }

    /**
     * 启动客户端
     * @param args
     */
    public static void main(String[] args) throws InterruptedException {
        new SimpleChatClient("localhost", 8080).run();
    }
}
```

## 4. 测试效果

先启动服务端，再启动多个客户端。

🚨 注意，为了允许客户端的多次运行，需要进行如下设置：

<img src="https://gitee.com/veal98/images/raw/master/img/20201214205648.png" style="zoom:80%;" />

服务端：

<img src="https://gitee.com/veal98/images/raw/master/img/20201214210012.png" style="zoom:67%;" />

客户端 1：

<img src="https://gitee.com/veal98/images/raw/master/img/20201214205843.png" style="zoom:67%;" />

客户端 2：

<img src="https://gitee.com/veal98/images/raw/master/img/20201214205854.png" style="zoom:67%;" />

## 📚 References

- [Netty 4.x User Guide 中文翻译《Netty 4.x 用户指南》](https://waylau.com/netty-4-user-guide/)