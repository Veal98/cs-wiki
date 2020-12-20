# 🍣 Dubbo 通信协议与序列化

---

## 1. Dubbo 通信协议

Dubbo支持dubbo、rmi、hessian、http、webservice、thrift、redis等多种协议，**但是Dubbo官网是推荐我们使用Dubbo协议的，默认也是用的dubbo协议**。

- **dubbo 协议** `dubbo://`

  **默认**就是走 dubbo 协议，单一**长连接**，进行的是 **NIO 异步通信**，基于 **hessian** 作为序列化协议。使用的场景是：传输数据量小（每次请求在 100kb 以内），但是并发量很高，以及服务消费者机器数远大于服务提供者机器数的情况。

  为了要支持高并发场景，一般是服务提供者就几台机器，但是服务消费者有上百台，可能每天调用量达到上亿次！此时用长连接是最合适的，就是跟每个服务消费者维持一个长连接就可以，可能总共就 100 个连接。然后后面直接基于长连接 NIO 异步通信，可以支撑高并发请求。

  长连接，通俗点说，就是建立连接过后可以持续发送请求，无须再建立连接。

  <img src="https://gitee.com/veal98/images/raw/master/img/20201204160601.png" style="zoom:50%;" />

  而短连接，每次要发送请求之前，需要先重新建立一次连接。

- **rmi 协议** `rmi://`

  RMI 协议采用 JDK 标准的 `java.rmi.*` 实现，采用阻塞式短连接和 JDK 标准序列化方式。多个短连接，适合消费者和提供者数量差不多的情况，适用于文件的传输，一般较少用。

- **hessian 协议** `hessian://`

  Hessian 1 协议用于集成 Hessian 的服务，Hessian 底层采用 Http 通讯，采用 Servlet 暴露服务，Dubbo 缺省内嵌 Jetty 作为服务器实现。走 hessian 序列化协议，多个短连接，适用于提供者数量比消费者数量还多的情况，适用于文件的传输，一般较少用。

- **http 协议** `http://`

  基于 HTTP 表单的远程调用协议，采用 Spring 的 HttpInvoker 实现。走表单序列化。

- **thrift 协议** `thrift://`

  当前 dubbo 支持的 thrift 协议是对 thrift 原生协议的扩展，在原生协议的基础上添加了一些额外的头信息，比如 service name，magic number 等。

- **webservice** `webservice://`

  基于 WebService 的远程调用协议，基于 Apache CXF 的 frontend-simple 和 transports-http 实现。走 SOAP 文本序列化。

- **memcached 协议** `memcached://`

  基于 memcached 实现的 RPC 协议。

- **redis 协议** `redis://`

  基于 Redis 实现的 RPC 协议。

- **rest 协议** `rest://`

  基于标准的 Java REST API——JAX-RS 2.0（Java API for RESTful Web Services 的简写）实现的 REST 调用支持。

- **gPRC 协议** `grpc://`

  Dubbo 自 2.7.5 版本开始支持 gRPC 协议，对于计划使用 HTTP/2 通信，或者想利用 gRPC 带来的 Stream、反压、Reactive 编程等能力的开发者来说， 都可以考虑启用 gRPC 协议。

## 2. 序列化与反序列化

序列化协议属于 **TCP/IP 五层协议模型的应用层**的一部分。

> 💡 序列化协议属于 **OSI 七层协议模型的表示层**：
>
> <img src="https://gitee.com/veal98/images/raw/master/img/20201220103003.png" style="zoom: 50%;" />

- 序列化： 将数据结构或对象转换成二进制串的过程
- 反序列化：将在序列化过程中所生成的二进制串转换成数据结构或者对象的过程

为什么要序列化？

- **1. 减小内存空间和网络传输的带宽**
- **2. 分布式的可扩展性**
- **3. 通用性，接口可共用**

**因为 Dubbo 调用是需要跨 JVM，需要进行网络通信。这就需要使用到序列化与反序列化**。

在 dubbo 中定义了 `ObjectInput`、`ObjectOutput `与 `Serialization `来进行数据的序列化与反序列化。

### ① Serialization 接口

下面我们来看一下 `Serialization` 的接口定义：

```java
@SPI("hessian2")
public interface Serialization {
 
    byte getContentTypeId();
 
    String getContentType();
 
    @Adaptive
    ObjectOutput serialize(URL url, OutputStream output) throws IOException;
 
    @Adaptive
    ObjectInput deserialize(URL url, InputStream input) throws IOException;
}
```

这个接口里面定义了 4 个方法：

- `getContentTypeId`：获取序列化 ContextType 的 id。
- `getContentType`：获取到序列化的 ContentType。
- `serialize`：创建一个 ObjectOutput (序列化器)，用于把对象转换序列化字节序列.
- `deserialize`：创建一个 ObjectInput (反序列化器)，用于把字节序列恢复成对象.

### ② Dubbo 支持的序列化

下面是 Serialization 的类图：

![](https://gitee.com/veal98/images/raw/master/img/20201204161311.png)

Dubbo序列化支持 java、compactedjava、nativejava、fastjson、dubbo、fst、hessian2、kryo，默认**hessian2**。其中 java、compactedjava、nativejava 属于原生 java 的序列化。

- dubbo 序列化：阿里尚未开发成熟的高效 java 序列化实现，阿里不建议在生产环境使用它。
- **hessian2序列化：hessian 是一种跨语言的高效二进制序列化方式。但这里实际不是原生的 hessian2 序列化，而是阿里修改过的，它是 dubbo RPC 默认启用的序列化方式。**
- json 序列化：目前有两种实现，一种是采用的阿里的 fastjson 库，另一种是采用 dubbo 中自己实现的简单 json 库，但其实现都不是特别成熟，而且 json 这种文本序列化性能一般不如上面两种二进制序列化。
- java 序列化：主要是采用 JDK 自带的 Java 序列化实现，性能很不理想。

最近几年，各种新的高效序列化方式层出不穷，不断刷新序列化性能的上限，最典型的包括：

- 专门针对 Java 语言的：Kryo，FST 等等
- 跨语言的：Protostuff，ProtoBuf，Thrift，Avro，MsgPack等等

<u>这些序列化方式的性能多数都显著优于 hessian2 （甚至包括尚未成熟的 dubbo 序列化）。所以我们可以为 dubbo 引入 Kryo 和 FST 这两种高效 Java 来优化 dubbo 的序列化</u>。

### ③ 常见序列化协议对比

下面提到的都是基于二进制的序列化协议，像 JSON 和 XML这种属于文本类序列化方式。虽然 JSON 和 XML可读性比较好，但是性能较差，一般不会选择。

<u>JDK 自带的序列化方式一般不会用 ，因为序列化效率低并且部分版本有安全漏洞。比较常用的序列化协议有 hessian、kyro、protostuff。</u>

#### Ⅰ JDK 自带的序列化方式

JDK 自带的序列化，只需实现 `java.io.Serializable`接口即可。

```java
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString
public class RpcRequest implements Serializable {
    private static final long serialVersionUID = 1905122041950251207L;
    private String requestId;
    private String interfaceName;
    private String methodName;
    private Object[] parameters;
    private Class<?>[] paramTypes;
    private RpcMessageTypeEnum rpcMessageTypeEnum;
}
```

> 💡 序列化号 `serialVersionUID` 属于版本控制的作用。序列化的时候 `serialVersionUID `也会被写入二级制序列，当反序列化时会检查 `serialVersionUID` 是否和当前类的 `serialVersionUID `一致。如果 `serialVersionUID` 不一致则会抛出 `InvalidClassException` 异常。强烈推荐每个序列化类都手动指定其 `serialVersionUID`，如果不手动指定，那么编译器会动态生成默认的序列化号

我们很少或者说几乎不会直接使用这个序列化方式，主要原因有两个：

- **不支持跨语言调用** : 如果调用的是其他语言开发的服务的时候就不支持了。
- **性能差** ：相比于其他序列化框架性能更低，主要原因是<u>序列化之后的字节数组体积较大，导致传输成本加大</u>。

#### Ⅱ kryo

Kryo 是一个**专门针对 Java 语言**的高性能的序列化/反序列化工具，由于其变长存储特性并使用了字节码生成机制，拥有较高的运行速度和较小的字节码体积。👉 Github 地址：https://github.com/EsotericSoftware/kryo 。

另外，Kryo 已经是一种非常成熟的序列化实现了，已经在Twitter、Groupon、Yahoo以及多个著名开源项目（如Hive、Storm）中广泛的使用。

To use the latest Kryo release in your application, use this dependency entry in your `pom.xml`:

```xml
<dependency>
   <groupId>com.esotericsoftware</groupId>
   <artifactId>kryo</artifactId>
   <version>5.0.2</version>
</dependency>
```

序列化和反序列化相关的示例代码如下：

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

#### Ⅲ Protobuf

👉 Github地址：https://github.com/protocolbuffers/protobuf。

Protobuf 出自于Google，性能还比较优秀，也支持多种语言，同时还是**跨平台**的。就是在使用中过于繁琐，因为你需要自己定义 IDL 文件和生成对应的序列化代码。这样虽然不然灵活，但是，另一方面导致 protobuf 没有序列化漏洞的风险。

> 💡 Protobuf 包含序列化格式的定义、各种语言的库以及一个 IDL 编译器。正常情况下你需要定义proto文件，然后使用IDL编译器编译成你需要的语言

一个简单的 proto 文件如下：

```protobuf
// protobuf 的版本
syntax = "proto3"; 
// SearchRequest会被编译成不同的编程语言的相应对象，比如Java中的class、Go中的struct
message Person {
  //string类型字段
  string name = 1;
  // int 类型字段
  int32 age = 2;
}
```

#### Ⅳ ProtoStuff

👉 Gihub地址：https://github.com/protostuff/protostuff。

由于 Protobuf 的易用性，它的哥哥 Protostuff  诞生了。

protostuff 基于 Google protobuf，但是提供了更多的功能和更简易的用法。虽然更加易用，但是不代表 ProtoStuff 性能更差。

#### Ⅴ hession

hessian 是一个轻量级的,自定义描述的二进制RPC协议。hessian 是一个比较老的序列化实现了，并且同样也是跨语言的。它是 dubbo RPC 默认启用的序列化方式，但这里实际不是原生的 hessian2 序列化，而是阿里修改过的

hessian 是一个比较老的序列化实现了，而且它是**跨语言**的，所以不是单独针对 java 进行优化的。而 **Dubbo 实际上完全是一种 Java to Java 的远程调用，其实没有必要采用跨语言的序列化方式**（当然肯定也不排斥跨语言的序列化）。

## 📚 References

- [Apache Dubbo 官方文档](http://dubbo.apache.org/zh/docs/v2.7/user/preface/requirements/)
- [dubbo-dev-book (gitbooks.io)](https://dubbo.gitbooks.io/dubbo-dev-book/content/design.html)
- [Github - Advanced Java](https://doocs.gitee.io/advanced-java/#/./docs/distributed-system/dubbo-operating-principle)
- [Dubbo通信协议、序列化及反序列化](https://blog.csdn.net/l18848956739/article/details/96316038?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2.not_use_machine_learn_pai&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2.not_use_machine_learn_pai#%E4%BA%8C)