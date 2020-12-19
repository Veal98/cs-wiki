# 💪 实例：Netty + Kryo 序列化传输对象

---

## 1. Kryo 简介及基本使用

### ① 概述

Kryo 是一个快速高效的 Java 对象图形**序列化框架**，主要特点是性能、高效和易用。**该项目用来序列化对象到文件、数据库或者网络**。

To use the latest Kryo release in your application, use this dependency entry in your `pom.xml`:

```xml
<dependency>
   <groupId>com.esotericsoftware</groupId>
   <artifactId>kryo</artifactId>
   <version>5.0.3</version>
</dependency>
```

### ② 快速入门

示例代码：

```java
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;
import java.io.*;

public class HelloKryo {
   static public void main (String[] args) throws Exception {
      Kryo kryo = new Kryo();
      kryo.register(SomeClass.class);

      SomeClass object = new SomeClass();
      object.value = "Hello Kryo!";
	 
      // 序列化
      Output output = new Output(new FileOutputStream("file.bin"));
      kryo.writeObject(output, object);
      output.close();
	 
      // 反序列化
      Input input = new Input(new FileInputStream("file.bin"));
      SomeClass object2 = kryo.readObject(input, SomeClass.class);
      input.close();   
   }
   static public class SomeClass {
      String value;
   }
}
```

### ③ 三种读写方式

Kryo 共支持三种读写方式

**1. 如果知道 class 字节码，并且对象不为空**

```java
  kryo.writeObject(output, someObject);
    // ...
    SomeClass someObject = kryo.readObject(input, SomeClass.class);
```

快速入门中的序列化/反序列化的方式便是这一种。而 Kryo 考虑到 someObject 可能为null，也会导致返回的结果为null，所以提供了第二套读写方式。

**2. 如果知道 class 字节码，并且对象可能为空**

```java
  kryo.writeObjectOrNull(output, someObject);
    // ...
    SomeClass someObject = kryo.readObjectOrNull(input, SomeClass.class);
```

但这两种方法似乎都不能满足我们的需求，在 RPC 调用中，序列化和反序列化分布在不同的端点，对象的类型确定，我们不想依赖于手动指定参数，**最好是将字节码的信息直接存放到序列化结果中，在反序列化时自行读取字节码信息**。Kryo 考虑到了这一点，于是提供了第三种方式。

**3. 如果实现类的字节码未知，并且对象可能为 null**

```java
  kryo.writeClassAndObject(output, object);
    // ...
    Object object = kryo.readClassAndObject(input);
    if (object instanceof SomeClass) {
       // ...
    }
```

我们牺牲了一些空间一些性能去存放字节码信息，但这种方式是我们在 RPC 中应当使用的方式。

### ④ 支持的序列化类型

![](https://gitee.com/veal98/images/raw/master/img/20201215214220.png)

这都是其默认支持的。

```java
Kryo kryo = new Kryo();
kryo.addDefaultSerializer(SomeClass.class, SomeSerializer.class);
```

这样的方式，也可以为一个 Kryo 实例扩展序列化器。

总体而言，Kryo支持以下的类型：

- 枚举
- 集合、数组
- 子类/多态
- 循环引用
- 内部类
- 泛型

但需要注意的是，**Kryo不支持Bean中增删字段**。如果使用Kryo序列化了一个类，存入了Redis，对类进行了修改，会导致反序列化的异常。

另外需要注意的一点是使用反射创建的一些类序列化的支持。如使用`Arrays.asList();`创建的 `List` 对象，会引起序列化异常。

```text
Exception in thread "main" com.esotericsoftware.kryo.KryoException: Class cannot be created (missing no-arg constructor): java.util.Arrays$ArrayList
```

但`new ArrayList()`创建的`List`对象则不会，使用时需要注意，可以使用第三方库对 Kryo 进行序列化类型的扩展。如[https://github.com/magro/kryo-serializers](https://link.zhihu.com/?target=https%3A//github.com/magro/kryo-serializers)所提供的。

**不支持包含无参构造器类的反序列化**，尝试反序列化一个不包含无参构造器的类将会得到以下的异常：

```text
Exception in thread "main" com.esotericsoftware.kryo.KryoException: Class cannot be created (missing no-arg constructor): moe.cnkirito.Xxx
```

**保证每个类具有无参构造器是应当遵守的编程规范**，但实际开发中一些第三库的相关类不包含无参构造，的确是有点麻烦。

### ⑤ 线程安全

Kryo是线程不安全的，意味着每当需要序列化和反序列化时都需要实例化一次，或者借助`ThreadLocal`来维护以保证其线程安全。

```java
private static final ThreadLocal<Kryo> KryoThreadLocal = new ThreadLocal<Kryo>() {
    protected Kryo initialValue() {
        Kryo kryo = new Kryo();
        // configure kryo instance, customize settings
        return kryo;
    };
};

// Somewhere else, use Kryo
Kryo k = KryoThreadLocal.get();
...
```

### ⑥ Kryo 相关配置参数详解

每个 Kryo 实例都可以拥有两个配置参数

```java
kryo.setRegistrationRequired(false); // 关闭注册行为(默认)
kryo.setReferences(true); // 支持循环引用
```

当 **kryo 写一个对象的实例的时候，默认需要将类的完全限定名称写入**。将类名一同写入序列化数据中是比较低效的，所以 kryo 支持通过类注册进行优化。如

```java
Kryo kryo = new Kryo();
kryo.register(SomeClass.class);
// ...
Output output = ...
SomeClass someObject = ...
kryo.writeObject(output, someObject);
```

这会赋予该 Class 一个从 0 开始的编号，但 Kryo 使用注册行为最大的问题在于，其**不保证同一个 Class 每一次注册的号码相同，这与注册的顺序有关**，也就意味着在不同的机器、同一个机器重启前后都有可能拥有不同的编号，这会导致序列化产生问题，**所以在分布式项目中，一般关闭注册行为**。

第二个注意点在于循环引用，Kryo 为了追求高性能，可以关闭循环引用的支持。不过我并不认为关闭它是一件好的选择，大多数情况下，请保持 `kryo.setReferences(true)`。

### ⑦ 常用 Kryo 工具类

```java
public class KryoSerializer {
    public byte[] serialize(Object obj) {
        Kryo kryo = KryoThreadLocal.get();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Output output = new Output(byteArrayOutputStream);//<1>
        kryo.writeClassAndObject(output, obj);//<2>
        output.close();
        return byteArrayOutputStream.toByteArray();
    }

    public <T> T deserialize(byte[] bytes) {
        Kryo kryo = KryoThreadLocal.get();
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
        Input input = new Input(byteArrayInputStream);// <1>
        input.close();
        return (T) kryo.readClassAndObject(input);//<2>
    }

    private static final ThreadLocal<Kryo> KryoThreadLocal = new ThreadLocal<Kryo>() {//<3>
        @Override
        protected Kryo initialValue() {
            Kryo kryo = new Kryo();
            kryo.setReferences(true); // 默认值为true
            kryo.setRegistrationRequired(false); //默认值为 false
            return kryo;
        }
    };

}
```

- <1> Kryo的`Input`和`Output`接收一个`InputStream`和`OutputStream`，Kryo通常完成字节数组和对象的转换，所以常用的输入输出流实现为`ByteArrayInputStream`/`ByteArrayOutputStream`。

- <2> **记录类型信息**的 `writeClassAndObject`和`readClassAndObject `配对使用在分布式场景下是最常见的，这算是 kryo 的一个特点，**可以把对象信息直接写到序列化数据里，反序列化的时候可以精确地找到原始类信息，不会出错，这意味着在写 `readxxx` 方法时，无需传入 Class 或 Type 类信息**。

- <3> 使用`ThreadLocal`维护Kryo实例，这样减少了每次使用都实例化一次 Kryo 的开销又可以保证其线程安全。

## 2. 导入依赖

新建 Maven 项目并导入 Netty、Kryo 以及 Slf4j 日志框架：

```xml
<dependencies>
        <dependency>
            <groupId>io.netty</groupId>
            <artifactId>netty-all</artifactId>
            <version>4.1.42.Final</version>
        </dependency>
    
        <dependency>
            <groupId>com.esotericsoftware</groupId>
            <artifactId>kryo</artifactId>
            <version>5.0.3</version>
        </dependency>
    
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.25</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>1.7.25</version>
        </dependency>
    
    </dependencies>
```

## 3. 传输实体类

**我们首先定义两个对象，这两个对象是客户端与服务端进行交互的实体类。** 客户端将 `RequestMessage` 类型的对象发送到服务端，服务端进行相应的处理之后将得到结果 `ResponseMessage` 对象返回给客户端。

<img src="https://gitee.com/veal98/images/raw/master/img/20201216192813.png" style="zoom:80%;" />

### ① 客户端请求

`RequestMessage.java` :客户端请求实体类

```java
/**
 * 客户端请求实体类
 */
public class RequestMessage {

    private String interfaceName;
    private String methodName;

    public RequestMessage() {
    }

    public RequestMessage(String interfaceName, String methodName) {
        this.interfaceName = interfaceName;
        this.methodName = methodName;
    }

    public String getInterfaceName() {
        return interfaceName;
    }

    public void setInterfaceName(String interfaceName) {
        this.interfaceName = interfaceName;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    @Override
    public String toString() {
        return "RequestMessage{" +
                "interfaceName='" + interfaceName + '\'' +
                ", methodName='" + methodName + '\'' +
                '}';
    }
}
```

### ② 服务端响应

`ResponseMessage.java` ：服务端响应实体类

```java
/**
 * 服务端响应实体类
 */
public class ResponseMessage {

    private String message;

    public ResponseMessage() {
    }

    public ResponseMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "ResponseMessage{" +
                "message='" + message + '\'' +
                '}';
    }
}
```

## 4. 序列化与反序列

<img src="https://gitee.com/veal98/images/raw/master/img/20201216192837.png" style="zoom:80%;" />

### ① 自定义序列化接口

`Serializer` 接口主要有两个方法一个用于序列化，一个用户反序列化。

```java
public interface  Serializer {

    /**
     * 序列化
     *
     * @param obj 要序列化的对象
     * @return 字节数组
     */
    byte[] serialize(Object obj);

    /**
     * 反序列化
     *
     * @param bytes 序列化后的字节数组
     * @param clazz 类
     * @param <T>
     * @return 反序列化的对象
     */
    <T> T deserialize(byte[] bytes, Class<T> clazz);
}

```

### ② 实现序列化接口

下面是自定义 kryo 序列化实现类：

```java
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;
import entity.RequestMessage;
import entity.ResponseMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

/**
 * 自定义 kryo 序列化实现类
 */
public class KryoSerializer implements Serializer {

    // slf4j 日志框架
    Logger log = LoggerFactory.getLogger(getClass());

    /**
     * 由于 Kryo 不是线程安全的。每个线程都应该有自己的 Kryo，Input 或 Output 实例。
     * 所以，使用 ThreadLocal 存放 Kryo 对象
     * 这样减少了每次使用都实例化一次 Kryo 的开销又可以保证其线程安全
     */
    private static final ThreadLocal<Kryo> KryoThreadLocal = ThreadLocal.withInitial(() -> {
        Kryo kryo = new Kryo();
        kryo.register(ResponseMessage.class);
        kryo.register(RequestMessage.class);
        return kryo;
    });

    /**
     * 序列化
     * @param obj 要序列化的对象
     * @return
     */
    @Override
    public byte[] serialize(Object obj) {
        try{
            Kryo kryo = KryoThreadLocal.get();
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            Output output = new Output(byteArrayOutputStream);
            // Object->byte: 将对象序列化为 byte 数组
            kryo.writeObject(output, obj);
            KryoThreadLocal.remove();
            log.info("序列化成功");
            return output.toBytes();
        } catch (Exception e) {
            throw new RuntimeException("序列化失败");
        }
    }


    /**
     * 反序列化
     * @param bytes 序列化后的字节数组
     * @param clazz 类 将字节数组反序列化成该类型的对象
     * @param <T>
     * @return
     */
    @Override
    public <T> T deserialize(byte[] bytes, Class<T> clazz) {
        try {
            Kryo kryo = KryoThreadLocal.get();
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
            Input input = new Input(byteArrayInputStream);
            // byte->Object: 从 byte 数组中反序列化出对象
            Object o = kryo.readObject(input, clazz);
            KryoThreadLocal.remove();
            log.info("反序列化成功");
            return clazz.cast(o);
        } catch (Exception e) {
            throw new RuntimeException("反序列化失败");
        }
    }

}
```

## 5. 自定义编解码器

<img src="https://gitee.com/veal98/images/raw/master/img/20201216193242.png" style="zoom:80%;" />

在自定义的编解码器中，我们需要注意**设计一个传输/通信协议**，定义需要传输哪些类型的数据， 并且还会规定每一种类型的数据应该占多少字节。这样我们在接收到二级制数据之后，就可以正确的解析出我们需要的数据。

在此**我们就简单的将消息体的长度放在消息头中进行传输，如果可读字节数小于消息长度的话，说明是不完整的消息**

### ① 编码器

**`NettyKryoEncoder` 是我们自定义的编码器。它负责处理"出站"消息，利用序列化将消息格式转换为字节数组然后写入到字节数据的容器 `ByteBuf` 对象中。**

```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToByteEncoder;
import serialize.Serializer;

/**
 * 自定义编码器
 * 负责处理"出站"消息，将消息格式转换为字节数组然后写入到字节数据的容器 ByteBuf 对象中
 */
public class NettyKryoEncoder extends MessageToByteEncoder {

    private final Serializer serializer;
    private final Class<?> genericClass; // 待编码的对象

    public NettyKryoEncoder(Serializer serializer, Class<?> genericClass) {
        this.serializer = serializer;
        this.genericClass = genericClass;
    }

    /**
     * 将对象转换为字节码然后写入到 ByteBuf 对象中
     */
    @Override
    protected void encode(ChannelHandlerContext channelHandlerContext, Object o, ByteBuf byteBuf) throws Exception {
        if(genericClass.isInstance(o)){
            // 1. 将对象转换为byte
            byte[] body = serializer.serialize(o);
            // 2. 读取消息的长度
            int dataLength = body.length;
            // 3.写入消息对应的字节数组长度, writerIndex 加 4
            byteBuf.writeInt(dataLength);
            //4.将字节数组写入 ByteBuf 对象中
            byteBuf.writeBytes(body);
        }
    }
}

```

### ② 解码器

**`NettyKryoDecoder`是我们自定义的解码器。它负责处理"入站"消息，它会从 `ByteBuf` 中读取到业务对象对应的字节序列，然后利用反序列化将字节序列转换为我们的业务对象。**

```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.ByteToMessageDecoder;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import serialize.Serializer;

import java.util.List;

/**
 * 自定义解码器
 * 负责处理"入站"消息，它会从 ByteBuf 中读取到业务对象对应的字节序列，然后再将字节序列转换为我们的业务对象
 */
public class NettyKryoDecoder extends ByteToMessageDecoder {

    // slf4j 日志框架
    Logger log = LoggerFactory.getLogger(getClass());

    private final Serializer serializer;
    private final Class<?> genericClass; // 字节序列反序列化成该类型的对象

    public NettyKryoDecoder(Serializer serializer, Class<?> genericClass) {
        this.serializer = serializer;
        this.genericClass = genericClass;
    }

    /**
     * Netty传输的消息长度也就是对象序列化后对应的字节数组的大小，存储在 ByteBuf 头部
     */
    private static final int BODY_LENGTH = 4;

    /**
     * 解码 ByteBuf 对象
     *
     * @param ctx 解码器关联的 ChannelHandlerContext 对象
     * @param in  "入站"数据，也就是 ByteBuf 对象
     * @param out 解码之后的数据对象需要添加到 out 对象里面
     */
    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) {

        // 1.byteBuf 中写入的消息长度所占的字节数已经是 4 了，所以 byteBuf 的可读字节必须大于 4
        if (in.readableBytes() >= BODY_LENGTH) {
            // 2.标记当前readIndex的位置，以便后面重置readIndex 的时候使用
            in.markReaderIndex();
            // 3.读取消息的长度
            // 注意： 消息长度是encode的时候我们自己写入的，参见 NettyKryoEncoder 的encode方法
            int dataLength = in.readInt();
            // 4.遇到不合理的情况直接 return
            if (dataLength < 0 || in.readableBytes() < 0) {
                log.error("data length or byteBuf readableBytes is not valid");
                return;
            }
            // 5.如果可读字节数小于消息长度的话，说明是不完整的消息，重置readIndex
            if (in.readableBytes() < dataLength) {
                in.resetReaderIndex();
                return;
            }
            // 6.走到这里说明没什么问题了，可以序列化了
            byte[] body = new byte[dataLength];
            in.readBytes(body);
            // 将 bytes 数组转换为我们需要的对象
            Object obj = serializer.deserialize(body, genericClass);
            out.add(obj);
            log.info("successful decode ByteBuf to Object");
        }
    }
}

```

## 6. 服务端

<img src="https://gitee.com/veal98/images/raw/master/img/20201216202216.png" style="zoom:80%;" />

### ① 自定义 ChannelHandler 处理客户端消息

`NettyServerHandler` 用于接收客户端发送过来的消息并返回结果给客户端

```java
import entity.RequestMessage;
import entity.ResponseMessage;
import io.netty.channel.*;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.concurrent.GlobalEventExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * 服务端 ChannelHandler: 处理服务端 I/O 事件
 *
 * SimpleChannelInboundHandler<String> 中的泛型表示要处理的进站数据的类型
 */
public class NettyServerHandler extends SimpleChannelInboundHandler<Object> {

    // slf4j 日志框架
    Logger log = LoggerFactory.getLogger(getClass());

    // 记录服务端接收客户端请求消息的次数
    private static final AtomicInteger atomicInteger = new AtomicInteger(1);

    /**
     * 当 ChannelHandler 在处理数据的过程中发生异常时会调用此方法
     * 在大部分情况下，捕获的异常应该被记录下来并且把关联的 channel 给关闭掉。
     * @param context
     * @param cause
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext context, Throwable cause){
        log.error("server catch exception",cause);
        // 关闭连接
        context.close();
    }


    /**
     * 每当从服务端读到客户端发送过来的请求信息时，调用此方法
     *
     * @param channelHandlerContext
     * @param o 客户端发过来的消息对象
     * @throws Exception
     */
    @Override
    protected void channelRead0(ChannelHandlerContext channelHandlerContext, Object o) throws Exception {
        RequestMessage requestMessage = (RequestMessage) o;
        log.info("Server receive msg: [{}] , times:[{}]", requestMessage, atomicInteger.getAndIncrement());
        // 服务端响应消息
        ResponseMessage messageFromServer = new ResponseMessage("message from server");
        ChannelFuture channelFuture = channelHandlerContext.writeAndFlush(messageFromServer);
        channelFuture.addListener(ChannelFutureListener.CLOSE);
    }
}
```

### ② ChannelInitializer

ChannelInitializer 用来增加多个 Handler 处理类到 ChannelPipeline 上，包括编码、解码、自定义 Handler 等

```java
import codec.NettyKryoDecoder;
import codec.NettyKryoEncoder;
import entity.RequestMessage;
import entity.ResponseMessage;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import serialize.KryoSerializer;

/**
 * 服务端 ChannelInitializer
 * 用来增加多个 Handler 处理类到 ChannelPipeline 上，包括编码、解码、SimpleChatServerHandler 等。
 */
public class NettyServerInitializer extends ChannelInitializer<SocketChannel> {

    // slf4j 日志框架
    Logger log = LoggerFactory.getLogger(getClass());

    KryoSerializer kryoSerializer = new KryoSerializer();

    @Override
    protected void initChannel(SocketChannel socketChannel) throws Exception {
        ChannelPipeline pipeline = socketChannel.pipeline();
        // 解码器（服务端对客户端的请求消息进行解码）
        pipeline.addLast("decoder", new NettyKryoDecoder(kryoSerializer, RequestMessage.class));
        // 编码器（服务端对自己向客户端的响应消息进行编码）
        pipeline.addLast("encoder", new NettyKryoEncoder(kryoSerializer, ResponseMessage.class));
        // Handler
        pipeline.addLast("handler", new NettyServerHandler());

        log.info("Client: " + socketChannel.remoteAddress() + " 已连接");
    }
}

```

### ③ 服务端启动类

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 启动服务端
 */
public class NettyServer {

    // slf4j 日志框架
    Logger log = LoggerFactory.getLogger(getClass());

    private int port;

    public NettyServer(int port){
        this.port = port;
    }

    public void run() throws InterruptedException {
        // 接收连接
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        // 处理已经被接收的连接
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap serverBootstrap = new ServerBootstrap();
            serverBootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new NettyServerInitializer())
                    // 表示系统用于临时存放已完成三次握手的请求的队列的最大长度,
                    // 如果连接建立频繁，服务器处理创建新连接较慢，可以适当调大这个参数
                    .option(ChannelOption.SO_BACKLOG, 128)
                    // TCP默认开启了 Nagle 算法，该算法的作用是尽可能的发送大数据快，减少网络传输。TCP_NODELAY 参数的作用就是控制是否启用 Nagle 算法。
                    .childOption(ChannelOption.TCP_NODELAY, true)
                    // 开启 TCP 协议的心跳机制
                    .childOption(ChannelOption.SO_KEEPALIVE, true);
            log.info("Server 已启动");

            // 绑定端口，开始接收客户端连接
            ChannelFuture channelFuture = serverBootstrap.bind(port).sync();
            // 等待服务端监听端口关闭
            channelFuture.channel().closeFuture().sync();
        }
        catch (InterruptedException e) {
            log.error("occur exception when start server:", e);
        }
        finally {
            workerGroup.shutdownGracefully();
            bossGroup.shutdownGracefully();
            log.info("Server 已关闭");
        }
    }

    /**
     * 启动服务
     * @param args
     * @throws InterruptedException
     */
    public static void main(String[] args) throws InterruptedException {
        new NettyServer(8080).run();
    }
}
```

## 7. 客户端

<img src="https://gitee.com/veal98/images/raw/master/img/20201216202205.png" style="zoom:80%;" />

### ① 自定义 ChannelHandler 处理服务端消息

```java
package client;

import entity.ResponseMessage;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.util.AttributeKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 客户端 ChannelHandler：处理服务端 I/O 事件
 */
public class NettyClientHandler extends SimpleChannelInboundHandler<Object> {

    // slf4j 日志框架
    Logger log = LoggerFactory.getLogger(getClass());

    /**
     *
     * @param channelHandlerContext
     * @param msg 服务端响应的消息体
     * @throws Exception
     */
    @Override
    protected void channelRead0(ChannelHandlerContext channelHandlerContext, Object msg) throws Exception {

        ResponseMessage responseMessage = (ResponseMessage) msg;
        log.info("Client receive msg: [{}]", responseMessage.toString());
        // 将服务端的返回结果保存到 AttributeMap 上，AttributeMap 可以看作是一个Channel的共享数据源
        // AttributeMap的 key 是AttributeKey，value 是Attribute
        AttributeKey<ResponseMessage> key = AttributeKey.valueOf("ResponseMessage"); 
        channelHandlerContext.channel().attr(key).set(responseMessage); 
        channelHandlerContext.channel().close();

    }

    @Override
    public void exceptionCaught(ChannelHandlerContext channelHandlerContext, Throwable cause) {
        log.error("Client caught exception", cause);
        channelHandlerContext.close();
    }
}

```

客户端对于服务端的消息处理逻辑非常简单，只要接收服务端响应的消息体 `ResponseMessage` 然后存入 `AttributeMap` 中即可。`AttributeMap` 是一个接口，但是类似于 `Map` 的数据结构 `AttributeKey-Attribute`，**可以看作是一个`Channel`的共享数据源**

```java
package io.netty.util;

public interface AttributeMap {
    <T> Attribute<T> attr(AttributeKey<T> var1);

    <T> boolean hasAttr(AttributeKey<T> var1);
}
```

`Channel` 实现了 `AttributeMap` 接口，这样也就表明它存在了`AttributeMap` 相关的属性：

```java
public interface Channel extends AttributeMap, ChannelOutboundInvoker, Comparable<Channel>
```

这样的话，我们就能通过 Channel 设置 `AttributeMap` 中的 key 和 Attribute：

```java
AttributeKey<ResponseMessage> key = AttributeKey.valueOf("ResponseMessage"); 
channelHandlerContext.channel().attr(key).set(responseMessage); // 设置 key 和 Attribute
```

`set` 方法是 `Attribute` 的方法：

<img src="https://gitee.com/veal98/images/raw/master/img/20201216200752.png" style="zoom:67%;" />

当然，我们也能够通过 Channel 和 key 将数据读取出来：

```java
AttributeKey<RpcResponse> key = AttributeKey.valueOf("ResponseMessage");
channel.attr(key).get(); // 获取 AttributeMap 中的 value
```

### ② ChannelInitializer

ChannelInitializer 用来增加多个 Handler 处理类到 ChannelPipeline 上，包括编码、解码、自定义 Handler 等

```java
import codec.NettyKryoDecoder;
import codec.NettyKryoEncoder;
import entity.RequestMessage;
import entity.ResponseMessage;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import serialize.KryoSerializer;

/**
 * 客户端 ChannelInitializer
 * 用来增加多个 Handler 处理类到 ChannelPipeline 上，包括编码、解码、自定义 Handler 等。
 */
public class NettyClientInitializer extends ChannelInitializer<SocketChannel> {

    KryoSerializer kryoSerializer = new KryoSerializer();

    @Override
    protected void initChannel(SocketChannel socketChannel) throws Exception {
        ChannelPipeline pipeline = socketChannel.pipeline();
        // 解码器（客户端对服务端的响应消息进行解码）
        pipeline.addLast("decoder", new NettyKryoDecoder(kryoSerializer, ResponseMessage.class));
        // 编码器（客户端对自己向服务端的请求消息进行编码）
        pipeline.addLast("encoder", new NettyKryoEncoder(kryoSerializer, RequestMessage.class));
        // Handler
        pipeline.addLast("handler", new NettyClientHandler());
    }
}
```

### ③ 客户端启动类

**客户端中主要有一个用于向服务端发送消息的 `sendMessage()`方法，通过这个方法你可以将请求消息也就是`RequestMessage` 对象发送到服务端，并且你可以同步获取到服务端返回的结果也就是`ResponseMessage` 对象。**

```java
import entity.RequestMessage;
import entity.ResponseMessage;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.util.AttributeKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * 启动客户端
 */
public class NettyClient {

    // slf4j 日志框架
    Logger log = LoggerFactory.getLogger(getClass());

    private String host;
    private int port;

    public NettyClient(String host, int port) {
        this.host = host;
        this.port = port;
    }

    private static Bootstrap bootstrap;

    static {
        NioEventLoopGroup group = new NioEventLoopGroup();
        bootstrap = new Bootstrap();
        bootstrap.group(group)
                .channel(NioSocketChannel.class)
                .handler(new NettyClientInitializer());
    }

    /**
     * 客户端发送消息给服务端
     * @param  requestMessage 客户端发送的消息体
     * @return 服务端返回的数据/消息
     */
    public ResponseMessage sendMessage(RequestMessage requestMessage){
        try {
            ChannelFuture channelFuture = bootstrap.connect(host, port).sync();
            log.info("client connect  {}", host + ":" + port);

            Channel channel = channelFuture.channel();
            if(channel != null){
                // 客户端发送消息
                channel.writeAndFlush(requestMessage);
                // 添加 监听事件（TCP 连接是否断开）
                channelFuture.addListener(new ChannelFutureListener() {
                    @Override
                    public void operationComplete(ChannelFuture futureListener) throws Exception {
                        if(futureListener.isSuccess()){
                            log.info("client send message: [{}]", requestMessage.toString());
                        }
                        else{
                            log.error("Send failed:", futureListener.cause());
                        }
                    }
                });
                // 阻塞等待 ，直到Channel关闭
                channel.closeFuture().sync();
                // 将服务端返回的数据也就是ResponseMessage对象取出
                AttributeKey<ResponseMessage> responseMessage = AttributeKey.valueOf("ResponseMessage");
                return channel.attr(responseMessage).get();
            }

        } catch (InterruptedException e) {
            log.error("occur exception when connect server:", e);
        }

        return null;

    }


    /**
     * 启动客户端
     * @param args
     */
    public static void main(String[] args) throws InterruptedException {
        // 客户端向服务端的请求消息
        RequestMessage requestMessage = new RequestMessage("interface", "hello");
        // 启动客户端
        NettyClient nettyClient = new NettyClient("localhost", 8080);
        // 客户端发送 3 次消息给服务端
        for (int i = 0; i < 3; i++) {
            nettyClient.sendMessage(requestMessage);
        }
        // 再发送 1 次
        ResponseMessage message = nettyClient.sendMessage(requestMessage);
        System.out.println(message.toString());
    }
}
```

## 8. 测试效果

先启动服务端，再启动客户端。

服务端：

![](https://gitee.com/veal98/images/raw/master/img/20201216192514.png)

客户端（客户端发送 4 次消息给服务端）：

![](https://gitee.com/veal98/images/raw/master/img/20201216192450.png)

