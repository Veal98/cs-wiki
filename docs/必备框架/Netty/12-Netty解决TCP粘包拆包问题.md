# ⏰ Netty 是如何解决 TCP 粘包/拆包问题的

---

## 1. 什么是 TCP 粘包/拆包

在 RPC 框架中，TCP 粘包和拆包问题是必须解决一个问题，因为 RPC 框架中，各个微服务相互之间都是维系了一个 **TCP 长连接**，比如 Dubbo 就是一个全双工的长连接。由于微服务往对方发送信息的时候，所有的请求都是使用的同一个连接，这样就会产生粘包和拆包的问题。

产生 TCP 粘包和拆包问题的主要原因是，操作系统在发送 TCP 数据的时候，底层会有一个缓冲区，例如 1024 个字节大小：

- 如果一次请求发送的数据量比较小，没达到缓冲区大小，**TCP 则会将多个请求合并为同一个请求进行发送**，这就形成了粘包问题；
- 如果一次请求发送的数据量比较大，超过了缓冲区大小，**TCP 就会将其拆分为多次发送**，这就是拆包，也就是将一个大的包拆分为多个小包进行发送。

如下图展示了 TCP 粘包和拆包的一个示意图：

<img src="https://gitee.com/veal98/images/raw/master/img/20201215103019.png" style="zoom: 40%;" />

上图中演示了 TCP 粘包和拆包的三种情况：

- A 和 B 两个包都刚好满足 TCP 缓冲区的大小，或者说其等待时间已经达到 TCP 等待时长，从而还是使用两个独立的包进行发送；
- A 和 B 两次请求间隔时间内较短，并且数据包较小，因而合并为同一个包发送给服务端；
- B 包比较大，因而将其拆分为两个包 B_1 和 B_2 进行发送，而这里由于拆分后的 B_2 比较小，其又与 A 合并在一起发送。

## 2. 常见解决方案

对于粘包和拆包问题，常见的解决方案有四种：

- ① 客户端在发送数据包的时候，每个包都固定长度，比如 1024 个字节大小，如果客户端发送的数据长度不足 1024 个字节，则**通过补充空格的方式补全到指定长度**；
- ② **客户端在每个包的末尾使用固定的分隔符**，例如 `\r\n`，如果一个包被拆分了，则等待下一个包发送过来之后找到其中的 `\r\n`，然后对其拆分后的头部部分与前一个包的剩余部分进行合并，这样就得到了一个完整的包；
- ③ **将消息分为头部和消息体，在头部中保存有当前整个消息的长度，只有在读取到足够长度的消息之后才算是读到了一个完整的消息**；
- ④ 通过**自定义协议**进行粘包和拆包的处理。

## 3. Netty 解决方案

Netty 针对以上四个常见的解决方案，均有对应的解码器：

- （1）通过 `FixedLengthFrameDecoder` 基于固定长度消息进行粘包拆包处理

- （2）通过 `LineBasedFrameDecoder` / `DelimiterBasedFrameDecoder` 基于以回车换行符 / 特殊分隔符作为消息结束符（消息边界）进行粘包拆包处理

- （3）通过 `LengthFieldBasedFrameDecoder` 和 `LengthFieldPrepender` 基于消息头指定消息长度进行消息粘包拆包处理
- （4）自定义粘包/拆包器

### ① FixedLengthFrameDecoder

#### Ⅰ 概述

对于使用固定长度的粘包和拆包场景，可以使用 `FixedLengthFrameDecoder`，**该解码器会每次读取固定长度的消息，如果当前读取到的消息不足指定长度，那么就会等待下一个消息到达后进行补足**。

其使用也比较简单，只需要在构造函数中指定每个消息的长度即可。这里需要注意的是，**`FixedLengthFrameDecoder`只是解码器，Netty 并未提供与之对应的编码器**，这是因为对于解码是需要等待下一个消息包的进行补全的，代码相对复杂，而**对于编码器，用户可以自行编写，因为编码时只需要将不足指定长度的部分进行补全即可**。

#### Ⅱ 代码示例

下面的示例中展示了如何使用 `FixedLengthFrameDecoder` 来进行粘包和拆包处理

```java
// 服务端启动类
public class EchoServer {

    public void bind(int port) throws InterruptedException {
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
            .channel(NioServerSocketChannel.class)
            .option(ChannelOption.SO_BACKLOG, 1024)
            .handler(new LoggingHandler(LogLevel.INFO))
            .childHandler(new ChannelInitializer<SocketChannel>() {
                @Override
                protected void initChannel(SocketChannel ch) throws Exception {
                    // 这里将 FixedLengthFrameDecoder 添加到 pipeline 中，指定长度为20
                    ch.pipeline().addLast(new FixedLengthFrameDecoder(20));
                    // 将前一步解码得到的数据转码为字符串
                    ch.pipeline().addLast(new StringDecoder());
                    // 这里FixedLengthFrameEncoder是我们自定义的，用于将长度不足20的消息补全空格
                    ch.pipeline().addLast(new FixedLengthFrameEncoder(20));
                    // 最终的数据处理
                    ch.pipeline().addLast(new EchoServerHandler());
        		}
        	});
            ChannelFuture future = bootstrap.bind(port).sync();
            future.channel().closeFuture().sync();
        } 
        finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }

    public static void main(String[] args) throws InterruptedException {
    	new EchoServer().bind(8080);
    }

}
```

上面的 pipeline 中，对于入栈数据，这里主要添加了两个解码器 `FixedLengthFrameDecoder` 和 `StringDecoder`，前面一个用于处理固定长度的消息的粘包和拆包问题，第二个则是将处理之后的消息转换为字符串。转换完成后，将处理得到的数据交由自定义的编码器 `FixedLengthFrameEncoder` 处理，该编码器是我们自定义的实现，主要作用是将长度不足 20 的消息进行空格补全。最后由 `EchoServerHandler` 处理最终得到的数据（这个 Handler 的代码就不贴了）

下面是自定义编码器 `FixedLengthFrameEncoder` 的实现代码：

```java
public class FixedLengthFrameEncoder extends MessageToByteEncoder<String> {

    private int length;

    public FixedLengthFrameEncoder(int length) {
    	this.length = length;
    }

    @Override
    protected void encode(ChannelHandlerContext ctx, String msg, ByteBuf out) throws Exception {
        // 对于超过指定长度的消息，这里直接抛出异常
        if (msg.length() > length) {
            throw new UnsupportedOperationException("message length is too large, it's limited " + length);
        }

        // 如果长度不足，则进行补全
        if (msg.length() < length) {
        	msg = addSpace(msg);
        }
        ctx.writeAndFlush(Unpooled.wrappedBuffer(msg.getBytes()));
    }

    // 进行空格补全
    private String addSpace(String msg) {
        StringBuilder builder = new StringBuilder(msg);
        for (int i = 0; i < length - msg.length(); i++) {
        	builder.append(" ");
        }
        return builder.toString();
    }

}
```

这里 `FixedLengthFrameEncoder` 继承了 `MessageToByteEncoder` 并实现了 `encode()` 方法，在该方法中，主要是将消息长度不足20的消息进行空格补全。

以上是服务端代码，客户端的实现方式基本与服务端的使用方式类似，只是在最后的消息处理与服务端的处理方式不同。

### ② LineBasedFrameDecoder 与 DelimiterBasedFrameDecoder

#### Ⅰ 概述

对于通过分隔符进行粘包和拆包问题的处理，Netty 提供了两个编解码的类，`LineBasedFrameDecoder`和`DelimiterBasedFrameDecoder`。

- `LineBasedFrameDecoder`的作用主要是通过**换行符**，即`\n`或者`\r\n`对数据进行处理；
- `DelimiterBasedFrameDecoder`的作用则是通过**用户指定的分隔符**对数据进行粘包和拆包处理。

同样的，这两个类都是解码器类，而对于数据的编码，也即在每个数据包最后添加换行符或者指定分割符的部分需要用户自行进行处理。

#### Ⅱ 代码示例

这里以`DelimiterBasedFrameDecoder`为例进行讲解：

```java
// 服务端启动类
public class EchoServer {

    public void bind(int port) throws InterruptedException {
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
            .channel(NioServerSocketChannel.class)
            .option(ChannelOption.SO_BACKLOG, 1024)
            .handler(new LoggingHandler(LogLevel.INFO))
            .childHandler(new ChannelInitializer<SocketChannel>() {
                @Override
                protected void initChannel(SocketChannel ch) throws Exception {
                    // 将delimiter设置到DelimiterBasedFrameDecoder中，经过该解码器进行处理之后，源数据将会被按照_$进行分隔
                    String delimiter = "_$";
                    // 这里1024指的是分隔的最大长度，即当读取到1024个字节的数据之后，若还是未读取到分隔符，则舍弃当前数据段，因为其很有可能是由于码流紊乱造成的
                    ch.pipeline().addLast(new DelimiterBasedFrameDecoder(1024,
                    Unpooled.wrappedBuffer(delimiter.getBytes())));
                    // 将分隔之后的字节数据转换为字符串数据
                    ch.pipeline().addLast(new StringDecoder());
                    // 这是我们自定义的一个编码器，主要作用是在返回的响应数据最后添加分隔符
                    ch.pipeline().addLast(new DelimiterBasedFrameEncoder(delimiter));
                    // 最终处理数据并且返回响应的handler
                    ch.pipeline().addLast(new EchoServerHandler());
                }
        	});
            ChannelFuture future = bootstrap.bind(port).sync();
            future.channel().closeFuture().sync();
        } 
        finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }

    public static void main(String[] args) throws InterruptedException {
    	new EchoServer().bind(8080);
    }

}
```

上面 pipeline 的设置中，添加的解码器主要有`DelimiterBasedFrameDecoder`和`StringDecoder`，经过这两个处理器处理之后，接收到的字节流就会被分隔，并且转换为字符串数据，最终交由`EchoServerHandler`处理。这里`DelimiterBasedFrameEncoder`是我们自定义的编码器，其主要作用是在返回的响应数据之后添加分隔符：

```java
public class DelimiterBasedFrameEncoder extends MessageToByteEncoder<String> {

    private String delimiter;

    public DelimiterBasedFrameEncoder(String delimiter) {
    	this.delimiter = delimiter;
    }

    @Override
    protected void encode(ChannelHandlerContext ctx, String msg, ByteBuf out) throws Exception {
        // 在响应的数据后面添加分隔符
        ctx.writeAndFlush(Unpooled.wrappedBuffer((msg + delimiter).getBytes())\);
    }

}
```

以上是服务端代码，客户端的实现方式基本与服务端的使用方式类似，只是在最后的消息处理与服务端的处理方式不同。（下一章的<u>实例：Netty 实现聊天功能</u> 大家会有直观感受）

### ③ LengthFieldBasedFrameDecoder 与 LengthFieldPrepender

#### Ⅰ 概述

 `LengthFieldBasedFrameDecoder`与`LengthFieldPrepender`需要配合起来使用，本质上来讲，这两者一个是解码器，一个是编码器。它们处理粘拆包的主要思想是**在生成的数据包中添加一个长度字段（消息头），用于记录当前数据包的长度**。

- 💧 解码器：`LengthFieldBasedFrameDecoder`会按照参数指定的包长度偏移量数据对接收到的数据进行解码，从而得到目标消息体数据

  <img src="https://gitee.com/veal98/images/raw/master/img/20201215110849.png" style="zoom:50%;" />

  `LengthFieldBasedFrameDecoder` 的构造函数包含 5 个参数：

  - `maxFrameLength`：指定了每个包所能传递的最大数据包大小；
  - `lengthFieldOffset`：指定了长度字段在字节码中的偏移量；
  - `lengthFieldLength`：指定了长度字段所占用的字节长度；
  - `lengthAdjustment`：对一些不仅包含有消息头和消息体的数据进行消息头的长度的调整，这样就可以只得到消息体的数据，<u>这里的 `lengthAdjustment `指定的就是消息头的长度</u>；
  - `initialBytesToStrip`：对于长度字段在消息头中间的情况，可以通过 `initialBytesToStrip` 忽略掉消息头以及长度字段占用的字节。

- 🌞 编码器：`LengthFieldPrepender `则会在响应的数据前面添加指定的字节数据，这个字节数据中保存了当前消息体的整体字节数据长度

  <img src="https://gitee.com/veal98/images/raw/master/img/20201215110919.png" style="zoom:50%;" />

#### Ⅱ 代码示例

这里我们以 JSON 序列化为例对`LengthFieldBasedFrameDecoder`和`LengthFieldPrepender`的使用方式进行讲解。如下是服务端启动类 `EchoServer` 部分代码：

```java
......
    
.childHandler(new ChannelInitializer<SocketChannel>() {
    @Override
    protected void initChannel(SocketChannel ch) throws Exception {
    // 这里将 LengthFieldBasedFrameDecoder 添加到 pipeline 的首位，因为其需要对接收到的数据进行长度字段解码，这里也会对数据进行粘包和拆包处理
        ch.pipeline().addLast(new LengthFieldBasedFrameDecoder(1024, 0, 2, 0, 2));
        // LengthFieldPrepender是一个编码器，主要是在响应字节数据前面添加字节长度字段
        ch.pipeline().addLast(new LengthFieldPrepender(2));
        // 对经过粘包和拆包处理之后的数据进行json反序列化，从而得到Java对象
        ch.pipeline().addLast(new JsonDecoder());
        // 对响应数据进行编码，将Java对象序列化为json对象
        ch.pipeline().addLast(new JsonEncoder());
        // 最后，处理客户端的请求的数据，并且进行响应
        ch.pipeline().addLast(new EchoServerHandler());
    }
});

..........
```

这里 `EchoServer`主要是在pipeline中添加了两个编码器和两个解码器，编码器主要是负责将响应的 Java 对象序列化为json对象，然后在其字节数组前面添加一个长度字段的字节数组；解码主要是对接收到的数据进行长度字段的解码，然后将其反序列化为一个Java对象。

下面是自定义的解码器 `JsonDecoder` 的代码，首先从接收到的数据流中读取字节数组，然后将其反序列化为一个Java 对象（假设是 `User` 对象）：

```java
public class JsonDecoder extends MessageToMessageDecoder<ByteBuf> {

    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf buf, List<Object> out) throws Exception {
        byte[] bytes = new byte[buf.readableBytes()];
        buf.readBytes(bytes);
        User user = JSON.parseObject(new String(bytes, CharsetUtil.UTF_8), User.class);
        out.add(user);
    }
}
```

再看看自定义的编码器 `JsonEncoder` 的代码，将响应得到的 User 对象转换为一个 json 对象，然后写入 `ChannelHandlerContext` 中：

```java
public class JsonEncoder extends MessageToByteEncoder<User> {

    @Override
    protected void encode(ChannelHandlerContext ctx, User user, ByteBuf buf) throws Exception {
        String json = JSON.toJSONString(user);
        ctx.writeAndFlush(Unpooled.wrappedBuffer(json.getBytes()));
    }
}
```

对于客户端，其主要逻辑与服务端的基本类似，这里主要展示其pipeline的添加方式，以及最后发送请求，并且对服务器响应进行处理的过程：

```java
@Override
protected void initChannel(SocketChannel ch) throws Exception {
    ch.pipeline().addLast(new LengthFieldBasedFrameDecoder(1024, 0, 2, 0, 2));
    ch.pipeline().addLast(new LengthFieldPrepender(2));
    ch.pipeline().addLast(new JsonDecoder());
    ch.pipeline().addLast(new JsonEncoder());
    ch.pipeline().addLast(new EchoClientHandler());
}
```

```java
public class EchoClientHandler extends SimpleChannelInboundHandler<User> {

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
    	ctx.write(getUser());
    }

    private User getUser() {
        User user = new User();
        user.setAge(27);
        user.setName("zhangxufeng");
        return user;
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, User user) throws Exception {
    	System.out.println("receive message from server: " + user);
    }
}
```

这里客户端首先会在连接上服务器时，往服务器发送一个 User 对象数据，然后在接收到服务器响应之后，会打印服务器响应的数据。

### ④ 自定义编/解码器

在上文我们已经介绍过自定义的解码器了，其实自定义解码/编码器就是分别继承 `ByteToMessageDecoder  `和 `MessageToByteEncoder `并覆盖响应方法即可：

- **解码器**：

  ```java
  public abstract class ByteToMessageDecoder extends ChannelInboundHandlerAdapter {
  	protected abstract void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception;
  
  }
  ```

  自定义解码器，比如：

  ```java
  public class xxxDecoder extends ByteToMessageDecoder<String> {
  	@Override
      protected abstract void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception{
          ..........
  }
  ```

- **编码器**：

  ```java
  public abstract class MessageToByteEncoder<I> extends ChannelOutboundHandlerAdapter {
      protected abstract void encode(ChannelHandlerContext ctx, I msg, ByteBuf out) throws Exception;
  
  }
  ```

  自定义编码器，比如：

  ```java
  public class xxxEncoder extends MessageToByteEncoder<String> {
  	@Override
      protected abstract void encode(ChannelHandlerContext ctx, I msg, ByteBuf out) throws Exception{
          ..........
  }
  ```

  

## 📚 References

- [Netty解决TCP粘包和拆包问题的四种方案 ](https://www.sohu.com/a/302231889_120045139)
- [使用Netty解决TCP粘包和拆包问题过程详解](http://www.3qphp.com/java/Jgrammar/3687.html)