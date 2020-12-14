# ✍ Codec 编码与解码

---

## 1. 什么是 Codec

从网络传输的角度来讲，数组总是以字节的格式在网络之中进行传输

- 每当源主机发送数据到目标主机时，数据会从本地格式被转换成字节进行传输，这种转换被称为**编码**，编码的逻辑由 **编码器** 处理。 
- 每当目标主机接受来自源主机的数据时，数据会从字节转换为我们需要的格式，这种转换被称为**解码**，解码的逻辑由 **解码器** 处理。

编写一个网络应用程序需要实现某种 **codec (编解码器)，codec 由两部分组成：decoder (解码器) 和 encoder （编码器）**

> 💡 其实就是序列化和反序列化

在Netty中，编码解码器实际上是 `ChannelOutboundHandler` 和 `ChannelInboundHandler` 的实现， 因为编码和解码都属于对数据的处理，由此看来，编码解码器被设计为 `ChannelHandler` 也就无可厚非。

## 2. 解码器

在Netty中，解码器是`ChannelInboundHandler`的实现，即**处理入站数据**。 解码器主要分为两种：

- 将字节解码为`Message`消息： `ByteToMessageDecoder`和`ReplayingDecoder`。
- 将一种消息解码为另一种消息： `MessageToMessageDecoder`。

### ① ByteToMessageDecoder

`ByteToMessageDecoder`用于将字节解码为消息，如果我们想自定义解码器，就需要继承这个类并实现`decode`方法。 **`decode`方法是自定解码器必须实现的方法**，它被调用时会传入一个包含了数据的`ByteBuf`和一个用来添加解码消息的`List`。 对`decode`方法的调用会重复进行，直至确认没有新元素被添加到该`List`或`ByteBuf`没有可读字节为止。最后，如果`List`不为空， 那么它的内容会被传递给`ChannelPipeline`中的下一个`ChannelInboundHandler`。

下面是`ByteToMessageDecoder`的编程模型：

```java
// 自定义解码器，继承 ByteToMessageDecoder
public class ToIntegerDecoder extends ByteToMessageDecoder {  
	
    // 重写 decode 方法
    @Override
    public void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out)
            throws Exception {
        // 检查ByteBuf是否仍有4个字节可读
        if (in.readableBytes() >= 4) {  
            out.add(in.readInt());  // 从ByteBuf读取消息到List中
        }
    }
}
```

上面这种编程模式很简单，但是在读取`ByteBuf`之前验证其是否可读的步骤显得有些多余，所以可以使用`ReplayingDecoder `来解决这个问题。

### ② ReplayingDecoder

`ReplayingDecoder`扩展了`ByteToMessageDecoder`，这使得我们不再需要检查`ByteBuf`，因为`ReplayingDecoder `自定义了`ByteBuf`的实现：`ReplayingDecoderByteBuf`，这个包装后的`ByteBuf`在内部会自动检查是否可读。以下是 `ReplayingDecoderByteBuf`的内部实现：

![](https://gitee.com/veal98/images/raw/master/img/20201214112401.png)

虽然`ReplayingDecoderByteBuf`可以自动检查可读性，但是对于某些操作并不支持，会抛出 `UnsupportedOperationException`异常。其编程模型如下：

```java
// 自定义解码器，继承 ReplayingDecoder
public class ToIntegerDecoder2 extends ReplayingDecoder<Void> {
    @Override
    public void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out)
            throws Exception {
        out.add(in.readInt());// 从ByteBuf读取消息到List中
    }
}
```

### ③ MessageToMessageDecoder

`MessageToMessageDecoder`用于将一种类型的消息解码另一种类型的消息，如从数据传输对象 DTO 转为 Java 对象 POJO。 这是 `MessageToMessageDecoder` 的原型：

```java
public abstract class MessageToMessageDecoder<I> extends ChannelInboundHandlerAdapter
```

**`MessageToMessageDecoder` 的泛型 `I` 定义了我们需要将消息转换成何种类型**。 和`ByteToMessageDecoder`一样，自定义`MessageToMessageDecoder`的解码器也需要实现其`decode`方法。

以下是它的编程模型：

```java
public class IntegerToStringDecoder extends MessageToMessageDecoder<Integer> {

    @Override
    public void decode(ChannelHandlerContext ctx, Integer msg, List<Object> out)
            throws Exception{
        out.add(String.valueOf(msg));
     }
}
```

## 3. 编码器

在Netty中，编码器是`ChannelOutboundHandler`的实现，即**处理出站数据**。 编码器同样分为两种：

- 将消息编码为字节： `MessageToByteEncoder`。
- 将消息编码为消息： `MessageToMessageEncoder`。

### ① MessageToByteEncoder

`MessageToByteEncoder`用于将消息编码为字节，如果我们需要自定编码器，就需要继承它并实现它的`encode`方法。 **`encode`方法是自定义编码器必须实现的方法**，它被调用时会传入相应的数据和一个存储数据的`ByteBuf`。 在`encode`被调用之后，该`ByteBuf`会被传递给`ChannelPipeline`中下一个`ChannelOutboundHandler`。

以下是`MessageToByteEncoder`的编程模型：

```java
// 自定义编码器，继承 MessageToByteEncoder
public class ShortToByteEncoder extends MessageToByteEncoder<Short>{  

    @Override
    public void encode(ChannelHandlerContext ctx , Short data, ByteBuf out)
            throws Exception {
        out.writeShort(data);// 将data写入ByteBuf   
    }
}
```

### ② MessageToMessageEncoder

`MessageToMessageEncoder`用于将一种类型的消息编码另一种类型的消息，其原型和 `MessageToMessageDecoder`相似，所以这里也不再细说。

## 4. 编解码器 Codec

上面的内容讲的是单独的编码器和解码器，编码器处理出站数据，是`ChannelOutboundHandler`的实现， 解码器负责处理入站数据，是`ChannelInboundHandler`的实现。

除了编码器和解码器，Netty还提供了**集编码与解码 于一身的编解码器** `ByteToMessageCodec` 和`MessageToMessageCodec`，它们同时实现了`ChannelInboundHandler`和`ChannelOutboundHandler`，其结构如下：

![](https://gitee.com/veal98/images/raw/master/img/20201214113007.png)

虽然使用编码解码器可以同时编码和解码数据，但这样不利于代码的可重用性。 相反，单独的编码器和解码器最大化了代码的可重用性和可扩展性，所以**我们应该优先考虑分开使用二者**

## 📚 References

- [Gitbook - Essential Netty in Action 《Netty 实战(精髓)》](https://waylau.com/essential-netty-in-action/GETTING%20STARTED/A%20Closer%20Look%20at%20ChannelHandlers.html)
- [Gitbook - framework-learning](https://qsjzwithguang19forever.gitee.io/framework-learning/gitbook_doc/netty-learning/ByteBuf%E5%AE%B9%E5%99%A8.html)