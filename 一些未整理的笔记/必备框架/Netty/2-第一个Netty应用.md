# ⛲ 第一个 Netty 应用

---

在本节中，我们将构建一个完整的的 Netty 客户端和服务器。

下图显示了连接到服务器的多个并发的客户端。在理论上，客户端可以支持的连接数只受限于使用的 JDK 版本中的制约：

<img src="https://gitee.com/veal98/images/raw/master/img/20201210132102.png" style="zoom:67%;" />

## 1. 导入 Netty 依赖

新建一个 Maven 项目，并导入 Netty 4.x 依赖：

```xml
<dependencies>
    <dependency>
        <groupId>io.netty</groupId>
        <artifactId>netty-all</artifactId>
        <version>4.1.42.Final</version>
    </dependency>
</dependencies>
```

详细可见官网 👉 [https://netty.io/downloads.html](https://netty.io/downloads.html)

## 2. 服务端

我们可以通过 `ServerBootstrap` 来引导我们启动一个简单的 Netty 服务端，为此，你必须要为其指定下面三类属性：

1. **线程组**（*一般需要两个线程组，一个负责处理客户端的连接，一个负责具体的 IO 处理*）
2. **IO 模型**（*BIO/NIO*）
3. **自定义 `ChannelHandler`** （*处理客户端发过来的数据并返回数据给客户端*）

### ① 创建服务端

```java
public final class HelloServer {

    private  final int port;

    public HelloServer(int port) {
        this.port = port;
    }

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
            // 6.绑定端口,调用 sync 方法阻塞直到绑定完成
            ChannelFuture f = b.bind(port).sync();
            // 7.阻塞等待直到服务器Channel关闭 (closeFuture()方法获取Channel 的CloseFuture对象,然后调用sync()方法)
            f.channel().closeFuture().sync();
        } finally {
            // 8.优雅关闭相关线程组资源
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
    public static void main(String[] args) throws InterruptedException {
        new HelloServer(8080).start();
    }

}
```

简单解析一下服务端的创建过程具体是怎样的：

**1. 创建了两个 `NioEventLoopGroup` 对象实例：`bossGroup` 和 `workerGroup`。**

- `bossGroup` : 用于处理客户端的 TCP 连接请求。
- `workerGroup` ： 负责每一条连接的具体读写数据的处理逻辑，真正负责 I/O 读写操作，交由对应的 Handler 处理。

举个例子：我们把公司的老板当做 `bossGroup`，员工当做 `workerGroup`，`bossGroup `在外面接完活之后，扔给 `workerGroup `去处理。一般情况下我们会指定 `bossGroup `的 线程数为 1（并发连接量不大的时候） ，`workGroup `的线程数量为 **CPU 核心数 \*2** 。另外，根据源码来看，使用 `NioEventLoopGroup` 类的无参构造函数设置线程数量的默认值就是 **CPU 核心数 \*2** 。

**2. 创建一个服务端启动引导/辅助类： `ServerBootstrap`，这个类将引导我们进行服务端的启动工作。**

**3. 通过 `.group()` 方法给引导类 `ServerBootstrap` 配置两大线程组，确定了线程模型。**

```java
    EventLoopGroup bossGroup = new NioEventLoopGroup(1);
    EventLoopGroup workerGroup = new NioEventLoopGroup();
```

**4. 通过`channel()`方法给引导类 `ServerBootstrap`指定了 IO 模型为 `NIO`**

- `NioServerSocketChannel` ：指定服务端的 IO 模型为 NIO，与 BIO 编程模型中的 `ServerSocket` 对应
- `NioSocketChannel` : 指定客户端的 IO 模型为 NIO， 与 BIO 编程模型中的 `Socket` 对应

**5. 通过 `.childHandler()`给引导类创建一个`ChannelInitializer` ，然后指定了服务端消息的业务处理逻辑也就是自定义的`ChannelHandler` 对象**

**6. 调用 `ServerBootstrap` 类的 `bind()`方法绑定端口** 。

```java
// bind()是异步的，但是，你可以通过 `sync()`方法将其变为同步。
ChannelFuture f = b.bind(port).sync();
```

### ② 自定义服务端 ChannelHandler 处理消息

`HelloServerHandler.java`：

```java
@Sharable
public class HelloServerHandler extends ChannelInboundHandlerAdapter {
	
    // 服务端接收客户端发送的数据并响应
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        try {
            ByteBuf in = (ByteBuf) msg;
            System.out.println("message from Client:" + in.toString(CharsetUtil.UTF_8));
            // 发送消息给客户端
            ctx.writeAndFlush(Unpooled.copiedBuffer("Hello from Server", CharsetUtil.UTF_8));
        } finally {
            ReferenceCountUtil.release(msg);
        }
    }
	
    // 处理客户端消息发生异常
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        // Close the connection when an exception is raised.
        cause.printStackTrace();
        ctx.close();
    }
}
```

这个逻辑处理器继承自`ChannelInboundHandlerAdapter` 并重写了下面 2 个方法：

1. `channelRead()` ：服务端接收客户端发送数据调用的方法
2. `exceptionCaught()` ：处理客户端消息发生异常的时候被调用

## 3. 客户端

### ① 创建客户端

```java
public final class HelloClient {

    private final String host;
    private final int port;
    private final String message;

    public HelloClient(String host, int port, String message) {
        this.host = host;
        this.port = port;
        this.message = message;
    }

    private void start() throws InterruptedException {
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
    }
    public static void main(String[] args) throws Exception {
        new HelloClient("127.0.0.1",8080, "Hello from Client").start();
    }
}
```

继续分析一下客户端的创建流程：

**1. 创建一个 `NioEventLoopGroup` 对象实例** （*服务端创建了两个 `NioEventLoopGroup` 对象*）

**2. 创建客户端启动的引导类是 `Bootstrap`**

**3. 通过 `.group()` 方法给引导类 `Bootstrap` 配置一个线程组**

**4. 通过`channel()`方法给引导类 `Bootstrap`指定了 IO 模型为`NIO`**

**5. 通过 `.childHandler()`给引导类创建一个`ChannelInitializer` ，然后指定了客户端消息的业务处理逻辑也就是自定义的`ChannelHandler` 对象**

**6. 调用 `Bootstrap` 类的 `connect()`方法连接服务端，这个方法需要指定两个参数：**

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

`connect` 方法返回的是一个 `Future` 类型的对象

```java
public interface ChannelFuture extends Future<Void> {
  ......
}
```

也就是说这个方法是异步的，<u>我们通过 `addListener` 方法可以监听到连接是否成功</u>，进而打印出连接信息。具体做法很简单，只需要对代码进行以下改动：

```java
ChannelFuture f = b.connect(host, port).addListener(future -> {
  if (future.isSuccess()) {
    System.out.println("连接成功!");
  } else {
    System.err.println("连接失败!");
  }
}).sync();
```

### ② 自定义客户端 ChannelHandler 处理消息

`HelloClientHandler.java`：

```java

@Sharable
public class HelloClientHandler extends ChannelInboundHandlerAdapter {

    private final String message;

    public HelloClientHandler(String message) {
        this.message = message;
    }
	
    // 客户端和服务端的连接建立之后就会被调用
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println("Client send msg to Server: " + message);
        ctx.writeAndFlush(Unpooled.copiedBuffer(message, CharsetUtil.UTF_8));
    }
	
    // 客户端接收服务端发送的数据
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf in = (ByteBuf) msg;
        try {
            System.out.println("Client receive msg from Server: " + in.toString(CharsetUtil.UTF_8));
        } finally {
            ReferenceCountUtil.release(msg);
        }
    }
	
    // 处理消息发生异常
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }
}
```

这个逻辑处理器继承自 `ChannelInboundHandlerAdapter`，并且覆盖了下面三个方法：

1. `channelActive()` : 客户端和服务端的连接建立之后就会被调用
2. `channelRead` : 客户端接收服务端发送数据调用的方法
3. `exceptionCaught` : 处理消息发生异常的时候被调用

## 4. 运行程序

**首先运行服务端 ，然后再运行客户端**。

服务端控制台打印出：

```
message from Client: Hello from Client
```

客户端控制台打印出：

```
Client send msg to Server: Hello from Client
Client receive msg from Server: Hello from Server
```

## 📚 References

- [netty-4-user-guide](https://waylau.com/netty-4-user-guide/Architectural%20Overview/Architectural%20Overview.html)
- [Essential Netty in Action 《Netty 实战(精髓)》](https://waylau.com/essential-netty-in-action/index.html)
- [Github - netty-practical-tutorial](https://github.com/Snailclimb/netty-practical-tutorial)