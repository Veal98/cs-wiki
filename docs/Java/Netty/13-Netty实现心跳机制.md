# 💓 Netty 是如何实现 TCP 心跳机制与断线重连的

---

## 1. 什么是心跳机制 HeartBeat

在 TCP 长连接 `keepAlive` 的应用场景下，client 端一般不会主动关闭它们之间的连接，Client 与 Server 之间的连接如果一直不关闭的话，随着客户端连接越来越多，Server 早晚有扛不住的时候，这时候 Server 端需要采取一些策略，如关闭一些长时间没有读写事件发生的连接，这样可以避免一些恶意连接导致 Server 端服务受损

所谓心跳机制 / 心跳检测, 即在 TCP长连接中 , 客户端每隔一小段时间向服务器发送一个数据包，通知服务器自己仍然在线, 以确保 TCP连接的有效性.

## 2. 如何实现心跳机制

我们可以通过两种方式实现心跳机制:

- 💧 **使用 TCP 协议层面的 keepalive 机制**.

  在 Netty 中使用该策略：

  ```java
  .childOption(ChannelOption.SO_KEEPALIVE, true); 
  ```

- ⭐ **在应用层上实现自定义的心跳机制**.

虽然在 TCP 协议层面上, 提供了 keepalive 保活机制, 但是使用它有几个缺点:

- 它不是 TCP 的标准协议, 并且是默认关闭的.
- TCP keepalive 机制依赖于操作系统的实现, 默认的 keepalive 心跳时间是 **两个小时**, 并且对 keepalive 的修改需要系统调用(或者修改系统配置), 灵活性不够.
- TCP keepalive 与 TCP 协议绑定, 因此如果需要更换为 UDP 协议时, keepalive 机制就失效了.

虽然使用 TCP 层面的 keepalive 机制比自定义的应用层心跳机制节省流量, 但是基于上面的几点缺点, 一般的实践中, 人**们大多数都是选择在应用层上实现自定义的心跳，一般我们自己实现的大致策略是这样的**：

- Client 启动一个定时器，不断向客户端发送心跳

- Server 收到心跳后，做出回应；

- Server 启动一个定时器，判断 Client 是否存在，这里做判断有两种方法：时间差和简单标识。
  
  ① **时间差**：
  
   - 收到一个心跳包之后记录当前时间；
   - 判断定时器到达时间，计算多久没收到心跳时间 = 当前时间 - 上次收到心跳时间。如果该时间大于设定值则认为超时。
	
	② **简单标识**：
	- 收到心跳后设置连接标识为 true
	- 判断定时器到达时间，如果未收到心跳则设置连接标识为false

下面我们来看看基于 Netty 如何实现应用层上的心跳机制 👇

## 3. Netty 实现自定义的心跳机制

Netty 中实现心跳检测依赖于 `IdleStateHandler`，它可以对一个 Channel 的 读/写设置定时器, 当 Channel 在一定事件间隔内没有数据交互时(即处于 IDLE 状态), 就会触发指定的事件

💧 本文要实现的逻辑步骤为：

- 启动服务端，启动客户端

- 客户端向服务端发送 "I am alive"，并 sleep 随机时间，用来模拟空闲。

- 服务端接收客户端消息并返回 "copy that"，若客户端空闲则计数 +1.

  > 💡 服务器收到客户端的 xxxx 消息（PING）时, 发送一个 xxxxx 消息（PONG）作为回复. 一个 PING-PONG 消息对就是一个**心跳交互**.

- 若服务端检测客户端读空闲次数 > 3，则服务端关闭连接。

- 客户端发现连接关闭了，就退出了。

下面我们结合代码来分析 👇

### ① 服务端

服务端启动类：

```java
public class HeartBeatServer {
 
    int port ;
    public HeartBeatServer(int port){
        this.port = port;
    }
 
    public void start(){
        ServerBootstrap bootstrap = new ServerBootstrap();
        EventLoopGroup boss = new NioEventLoopGroup();
        EventLoopGroup worker = new NioEventLoopGroup();
        try{
            bootstrap.group(boss,worker)
                    .handler(new LoggingHandler(LogLevel.INFO))
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new HeartBeatServerInitializer());
 
            ChannelFuture future = bootstrap.bind(port).sync();
            future.channel().closeFuture().sync();
        }catch(Exception e){
            e.printStackTrace();
        }finally {
            worker.shutdownGracefully();
            boss.shutdownGracefully();
        }
    }
    public static void main(String[] args) throws Exception {
        HeartBeatServer server = new HeartBeatServer(8090);
        server.start();
    }
}
```
和我们上一章节的实例几乎一模一样，只需要看 `childHandler(new HeartBeatServerInitializer())` 这一句。`HeartBeatServerInitializer` 就是一个我们自定义的 `ChannelInitializer `. 顾名思义，他就是在初始化 channel 的时做一些事情。我们所需要开发的业务逻辑 Handler 就是在这里添加的。其代码如下：

```java
public class HeartBeatServerInitializer extends ChannelInitializer<Channel> {
 
    @Override
    protected void initChannel(Channel channel) throws Exception {
        ChannelPipeline pipeline = channel.pipeline();
        pipeline.addLast("decoder", new StringDecoder());
        pipeline.addLast("encoder", new StringEncoder());
        pipeline.addLast(new IdleStateHandler(40,0,0, TimeUnit.SECONDS));
        pipeline.addLast(new HeartBeatServerHandler());
    }
}
```

代码很简单，我们先添加了`StringDecoder` 和`StringEncoder` 用于编解码，`IdleStateHandler` 就是心跳检测的核心组件。我们可以看到`IdleStateHandler`的构造函数中接收了4个参数，其定义如下：

```java
public IdleStateHandler(long readerIdleTime, long writerIdleTime, long allIdleTime, TimeUnit unit);

```

- `readerIdleTime`：超过xxx时间客户端没有发生读事件，就会触发一个 `READER_IDLE` 的 **IdleStateEvent** 事件.
- `writerIdleTime`：超过xxx时间客户端没有发生写事件，就会触发一个 `WRITER_IDLE` 的 **IdleStateEvent** 事件.
- `allIdleTime`：超过xxx时间客户端没有发生读或写事件，就会触发一个 `ALL_IDLE` 的 **IdleStateEvent** 事件.
- `unit`：时间参数的格式

我们的例子中设置的是 `new IdleStateHandler(2,2,2, TimeUnit.SECONDS)`，意思就是**客户端 40 秒内没有发生读事件，超时事件就会被触发，具体操作定义在自定义的处理类 `HeartBeatServerHandler.userEventTriggered` 中**。代码如下：

```java
public class HeartBeatServerHandler extends SimpleChannelInboundHandler<String> {
 
    private int readIdleTimes = 0; // 空闲计数
 
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String s) throws Exception {
        System.out.println(" ====== > [server] message received : " + s);
       if("I am alive".equals(s)){
            ctx.channel().writeAndFlush("copy that");
        }else {
           System.out.println(" 其他信息处理 ... ");
       }
    }
 
    // 心跳检测
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        IdleStateEvent event = (IdleStateEvent)evt;
 
        String eventType = null;
        switch (event.state()){
            case READER_IDLE:
                eventType = "读空闲";
                readIdleTimes ++; // 读空闲的计数加1
                break;
            case WRITER_IDLE:
                eventType = "写空闲";
                // 不处理
                break;
            case ALL_IDLE:
                eventType ="读写空闲";
                // 不处理
                break;
        }
        System.out.println(ctx.channel().remoteAddress() + "超时事件：" +eventType);
        if(readIdleTimes > 3){
            System.out.println(" [server]读空闲超过3次，关闭连接");
            ctx.channel().writeAndFlush("you are out");
            ctx.channel().close();
        }
    }
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        System.err.println("=== " + ctx.channel().remoteAddress() + " is active ===");
    }
 
}

```

### ② 客户端

netty的api设计使得编码的模式非常具有通用性，所以客户端代码和服务端的代码几乎一样：启动client端的代码几乎一样，也需要一个`ChannelInitializer`，也需要`Handler`。改动的地方很少，因此本文不对客户端代码进行详细解释。下面给出client端的完整代码：

```java
public class HeartBeatClient  {
 
    private int port;
    private Random random ;
 
    public HeartBeatClient(int port){
        this.port = port;
        random = new Random();
    }
    public static void main(String[] args) throws Exception{
        HeartBeatClient client = new HeartBeatClient(8090);
        client.start();
    }
 
    public void start() {
        EventLoopGroup eventLoopGroup = new NioEventLoopGroup();
        try{
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(eventLoopGroup).channel(NioSocketChannel.class)
                    .handler(new HeartBeatClientInitializer());
            Channel channel = bootstrap.connect(host, port).sync().channel();
            String  text = "I am alive";
            // 客户端每隔一段随机时间发送信息给服务端（模拟空闲）
            while (channel.isActive()){
                sendMsg(text);
            }
        }catch(Exception e){
            // do something
        }finally {
            eventLoopGroup.shutdownGracefully();
        }
    }
 
    public void sendMsg(String text) throws Exception{
        int num = random.nextInt(10);
        Thread.sleep(num * 1000); // 模拟空闲
        channel.writeAndFlush(text);
    }
 
}
```

客户端**不用**加入心跳检测 `IdleStateHandler` ：

```java
public class HeartBeatClientInitializer extends ChannelInitializer<Channel> {
    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast("decoder", new StringDecoder());
        pipeline.addLast("encoder", new StringEncoder());
        pipeline.addLast(new HeartBeatClientHandler());
    }
}
```

```java
public class HeartBeatClientHandler extends SimpleChannelInboundHandler<String> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) throws Exception {
        System.out.println(" client received :" +msg);
        if(msg!= null && msg.equals("you are out")) {
            System.out.println(" server closed connection , so client will close too");
            ctx.channel().closeFuture();
        }
    }
}
```

### ③ 测试效果

在上面的代码写好之后，我们先启动服务端，然后在启动客户端。运行日志如下：

server 端：

```
=== /127.0.0.1:57700 is active ===
 ====== > [server] message received : I am alive
 ====== > [server] message received : I am alive
/127.0.0.1:57700超时事件：写空闲
/127.0.0.1:57700超时事件：读空闲
/127.0.0.1:57700超时事件：读写空闲
/127.0.0.1:57700超时事件：写空闲
/127.0.0.1:57700超时事件：读空闲
/127.0.0.1:57700超时事件：读写空闲
/127.0.0.1:57700超时事件：写空闲
 ====== > [server] message received : I am alive
/127.0.0.1:57700超时事件：写空闲
/127.0.0.1:57700超时事件：读写空闲
/127.0.0.1:57700超时事件：读空闲
/127.0.0.1:57700超时事件：写空闲
/127.0.0.1:57700超时事件：读写空闲
/127.0.0.1:57700超时事件：读空闲
 [server]读空闲超过3次，关闭连接
```

client 端：

```
 client sent msg and sleep 2
 client received :copy that
 client received :copy that
 client sent msg and sleep 6
 client sent msg and sleep 6
 client received :copy that
 client received :you are out
 server closed connection , so client will close too
 
Process finished with exit code 0
```

通过上面的运行日志，我们可以看到：

- 客户端在与服务器成功建立之后，发送了3次'I am alive'，服务端也回应了3次：'copy that'
- 由于客户端超时了多次，服务端关闭了链接。
- 客户端知道服务端抛弃自己之后，也关闭了连接，程序退出。

## 4. 客户端断线重连

客户端连接服务器时

```java
bootstrap.connect(host, port).sync()
```

会返回一个 `ChannelFuture` 的对象，我们可以对这个对象进行监听.

如下，我们抽象出 `doConnect` 方法, 它负责客户端和服务器的 TCP 连接的建立, 并且当 TCP 连接失败时, `doConnect ` 会通过 "`channel().eventLoop().schedule`" 来延时 10s 后尝试重新连接

```java
public class HeartBeatClient  {
 	
    private Channel channel;
    
    .......
 
    public void start() {
        EventLoopGroup eventLoopGroup = new NioEventLoopGroup();
        try{
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(eventLoopGroup).channel(NioSocketChannel.class)
                    .handler(new HeartBeatClientInitializer());
            
            doConnect();
            
            .........
                
        }catch(Exception e){
            // do something
        }finally {
            eventLoopGroup.shutdownGracefully();
        }
    }
 	
    
    protected void doConnect() {
        if (channel != null && channel.isActive()) {
            return;
        }

        ChannelFuture future = bootstrap.connect("127.0.0.1", 12345);

        future.addListener(new ChannelFutureListener() {
            public void operationComplete(ChannelFuture futureListener) throws Exception {
                if (futureListener.isSuccess()) {
                    channel = futureListener.channel();
                    System.out.println("Connect to server successfully!");
                } else {
                    // 断线重连
                    System.out.println("Failed to connect to server, try connect after 10s");
                    futureListener.channel().eventLoop().schedule(new Runnable() {
                        @Override
                        public void run() {
                            doConnect();
                        }
                    }, 10, TimeUnit.SECONDS);
                }
            }
        });
    }
    
    ...........
 
}
```

这还不够，断线重连的关键一点是检测连接是否已经断开. 因此我们需要在 `ClientHandler` 中重写 `channelInactive `方法. **当 TCP 连接断开时, 会回调 `channelInactive `方法, 因此我们在这个方法中调用 `client.doConnect()` 来进行重连**：

```java
public class HeartBeatClientHandler extends SimpleChannelInboundHandler<String> {
    
    private HeartBeatClient heartBeatClient;
    
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) throws Exception {
        System.out.println(" client received :" +msg);
        if(msg!= null && msg.equals("you are out")) {
            System.out.println(" server closed connection , so client will close too");
            ctx.channel().closeFuture();
        }
    }
    
    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
        heartBeatClient.doConnect();
    }
}
```

## 📚 References

- [逃离沙漠 - Netty实现心跳机制](https://www.cnblogs.com/demingblog/p/9957143.html)
- [浅析 Netty 实现心跳机制与断线重连](https://segmentfault.com/a/1190000006931568)
- [Netty 4.0 实现心跳检测和断线重连](https://www.iteye.com/blog/592713711-2277061)