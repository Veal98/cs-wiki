# ⌛ 从 BIO、NIO 到 Netty

---

> 💡 关于 I/O 模型、同步/异步、阻塞/非阻塞等的相关详细解释，大家可以去看 👉 <u>本仓库中 Java基础 部分的 【底层：Linux 五种 I/O 模型详解】</u>

## 1. BIO

### ① 传统的阻塞式通信流程

**早期的 Java 网络相关的 API(`java.net`包) 使用 Socket(套接字)进行网络通信，不过只支持阻塞函数使用。**

要通过互联网进行通信，至少需要一对套接字：

1. 运行于服务器端的 Server Socket。
2. 运行于客户机端的 Client Socket

**Socket 网络通信过程简单来说分为下面 4 步：**

1. 建立服务端并且监听客户端请求
2. 客户端请求，服务端和客户端建立连接
3. 两端之间可以传递数据
4. 关闭资源

对应到服务端和客户端的话，是下面这样的。

**服务器端：**

1. 创建 `ServerSocket` 对象并且绑定地址（ip）和端口号(port)：` server.bind(new InetSocketAddress(host, port))`
2. 通过 `accept()`方法监听客户端请求
3. 连接建立后，通过输入流读取客户端发送的请求信息
4. 通过输出流向客户端发送响应信息
5. 关闭相关资源

**客户端：**

1. 创建`Socket` 对象并且连接指定的服务器的地址（ip）和端口号(port)：`socket.connect(inetSocketAddress)`
2. 连接建立后，通过输出流向服务器端发送请求信息
3. 通过输入流获取服务器响应的信息
4. 关闭相关资源

![img](https://gitee.com/veal98/images/raw/master/img/20201205112802.png)

### ② 代码示例

下面通过 BIO 实现基于 TCP 的 Socket 实现：

#### Socket 客户端

```java
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class HelloClient {

    private Object send(Message message, String host, int port) {

        System.out.println("客户端: " + host + " 请求连接服务器端口: " + port);

        // 创建一个流套接字并将其连接到指定主机上的指定端口号
        try (Socket socket = new Socket(host, port)) {

            // 往输出流中写入数据
            ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
            objectOutputStream.writeObject(message);

            // 从输入流中读取服务器响应的数据
            ObjectInputStream objectInputStream = new ObjectInputStream(socket.getInputStream());
            return objectInputStream.readObject();

        } catch (IOException | ClassNotFoundException e) {
            System.out.println("occur exception: " + e);
        }
        return null;
    }

    public static void main(String[] args) {
        HelloClient helloClient = new HelloClient();
        Message message = (Message) helloClient.send(new Message("content from Client"), "127.0.0.1", 6666);
        System.out.println("client receive message: " + message.getContent());
    }
}
CopyErrorOK!
```

注意，其中 `Message` 是我们自定义的消息体：

```java
import java.io.Serializable;

// 通信消息，序列化
public class Message implements Serializable {

    private String content;

    public Message() {
    }

    public Message(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}CopyErrorOK!
```

#### Socket 服务端

```java
public class HelloServer {

    public void start(int port) {
        // 1.创建 ServerSocket 对象并且绑定一个端口
        try (ServerSocket server = new ServerSocket(port);) {
            Socket socket;
            // 2.通过 accept()方法监听客户端请求
            System.out.println("正在监听客户端请求......");
            while ((socket = server.accept()) != null) {
                System.out.println("客户端 " + socket.getRemoteSocketAddress() + " 连接成功!");
                // 3. 打开 Socket 的输入流和输出流
                try (ObjectInputStream objectInputStream = new ObjectInputStream(socket.getInputStream());
                     ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream())) {

                    // 4.通过输入流读取客户端发送的请求信息
                    Message message = (Message) objectInputStream.readObject();
                    System.out.println("Server receive message: " + message.getContent());

                    // 5.通过输出流向客户端发送响应信息
                    message.setContent("new content from Server");
                    objectOutputStream.writeObject(message);
                    objectOutputStream.flush();
                } catch (IOException | ClassNotFoundException e) {
                    System.out.println("occur exception: " + e);
                }
            }
        } catch (IOException e) {
            System.out.println("occur IOException: " + e);
        }
    }

    public static void main(String[] args) {
        HelloServer helloServer = new HelloServer();
        helloServer.start(6666);
    }
}CopyErrorOK!
```

#### 运行测试

**首先运行服务端，然后再运行客户端，控制台输出如下：**

<img src="https://gitee.com/veal98/images/raw/master/img/20201205153954.png" alt="img" style="zoom:67%;" />

<img src="https://gitee.com/veal98/images/raw/master/img/20201205154024.png" alt="img" style="zoom:67%;" />

#### 代码中存在的问题

`ServerSocket` 的 `accept()` 方法是阻塞方法，也就是说 **`ServerSocket` 在调用 `accept()`等待客户端的连接请求时会阻塞，直到收到客户端发送的连接请求才会继续往下执行代码**。

很明显，上面演示的代码片段有一个很严重的问题：**只能同时处理一个客户端的连接，如果需要管理多个客户端的话，就需要为我们请求的客户端单独创建一个线程。** 如下图所示：

![img](https://gitee.com/veal98/images/raw/master/img/20201205154226.png)

对应的Java代码可能是下面这样的：

```java
new Thread(() -> {
   // 创建 socket 连接
}).start();CopyErrorOK!
```

但是，这样会导致一个很严重的问题：**资源浪费**。

我们知道线程是很宝贵的资源，如果我们为每一次连接都用一个线程处理的话，就会导致可用线程越来越少，达到了极限之后，就无法再创建线程处理请求了。处理的不好的话，甚至可能直接就宕机掉了。

很多人就会问了：那有没有改进的方法呢？

当然有！ 比较简单并且实际的改进方法就是使用**线程池**。线程池还可以让线程的创建和回收成本相对较低，并且我们可以指定线程池的可创建线程的最大数量，这样就不会导致线程创建过多，机器资源被不合理消耗。

```java
ThreadFactory threadFactory = Executors.defaultThreadFactory();
ExecutorService threadPool = new ThreadPoolExecutor(10, 100, 1, TimeUnit.MINUTES, new ArrayBlockingQueue<>(100), threadFactory);
threadPool.execute(() -> {
     // 创建 Socket 连接
 });CopyErrorOK!
```

**但是，即使你再怎么优化和改变。也改变不了它的底层仍然是同步阻塞的 BIO 模型的事实，因此无法从根本上解决问题。**

**为了解决上述的问题，Java 1.4 中引入了 NIO ，一种同步非阻塞的 I/O 模型。** 

## 2. NIO

**Netty 实际上就基于 Java NIO 技术封装完善之后得到一个高性能框架**，熟悉 NIO 的基本概念对于学习和更好地理解 Netty 还是很有必要的！

### ① NIO 概述

**NIO 是一种同步非阻塞的 I/O 模型，在 Java 1.4 中引入了 NIO 框架，对应 `java.nio` 包，提供了 `Channel` , `Selector`，`Buffer `等抽象。**

**NIO 中的 N 可以理解为 Non-blocking**

NIO 支持面向缓冲(Buffer)的，基于通道(Channel)的 I/O 操作方法。

NIO 提供了与传统 BIO 模型中的 `Socket` 和 `ServerSocket` 相对应的 `SocketChannel` 和 `ServerSocketChannel` 两种不同的套接字通道实现,两种通道都支持阻塞和非阻塞两种模式：

1. **阻塞模式** : 基本不会被使用到。使用起来就像传统的网络编程一样，比较简单，但是性能和可靠性都不好。对于低负载、低并发的应用程序，勉强可以用一下以提升开发速率和更好的维护性
2. **非阻塞模式** ： 与阻塞模式正好相反，非阻塞模式对于高负载、高并发的（网络）应用来说非常友好，但是编程麻烦，这个是大部分人诟病的地方。所以， 也就导致了 Netty 的诞生。

### ② NIO 核心组件解读

NIO 包含下面几个核心的组件：

- **Channel**
- **Buffer**
- **Selector**
- **Selection Key**

**这些组件之间的关系是怎么的呢？**

1. NIO 使用 Channel(通道)和 Buffer(缓冲区)传输数据，数据总是从缓冲区写入通道，并从通道读取到缓冲区。**在面向流的 I/O 中，可以将数据直接写入或者将数据直接读到 `Stream` 对象中。在 NIO 库中，所有数据都是通过 `Buffer`(缓冲区)处理的**。 `Channel `可以看作是 Netty 的网络操作抽象类，对应于 JDK 底层的 `Socket`

2. NIO 利用 `Selector `（选择器）来监视多个通道的对象，如数据到达，连接打开等。因此，单线程可以监视多个通道中的数据。

3. 当我们将 `Channel `注册到 `Selector `中的时候, 会返回一个 Selection Key 对象, Selection Key 则表示了一个特定的通道对象和一个特定的选择器对象之间的注册关系。通过 Selection Key 我们可以获取哪些 IO 事件已经就绪了，并且可以通过其获取 `Channel `并对其进行操作。

   **Selector（选择器，也可以理解为多路复用器）是 NIO（非阻塞 IO）实现的关键。它使用了事件通知相关的 API 来实现选择已经就绪也就是能够进行 I/O 相关的操作的任务的能力。**

简单来说，整个过程是这样的：

1. 将 `Channel `注册到 `Selector `中。
2. 调用 `Selector` 的 `select()` 方法，这个方法会阻塞；
3. 到注册在 `Selector `中的某个 `Channel `有新的 TCP 连接或者可读写事件的话，这个 `Channel `就会处于就绪状态，会被 `Selector `轮询出来。
4. 然后通过 SelectionKey 可以获取就绪 `Channel ` 的集合，进行后续的 I/O 操作。

### ③ NIO 为啥更好

**相比于传统的 BIO 模型来说， NIO 模型的最大改进是：**

1. 使用比较少的线程便可以管理多个客户端的连接，提高了并发量并且减少的资源消耗（减少了线程的上下文切换的开销）
2. 在没有 I/O 操作相关的事情的时候，线程可以被安排在其他任务上面，以让线程资源得到充分利用。

### ④ 使用 NIO 编写代码太复杂

一个使用 NIO 编写的 Server 端如下，可以看出还是整体还是比较复杂的，并且代码读起来不是很直观，并且还可能由于 NIO 本身会存在 Bug。

很少使用 NIO，很大情况下也是因为使用 NIO 来创建正确并且安全的应用程序的开发成本和维护成本都比较大。所以，一般情况下我们都会使用 Netty 这个比较成熟的高性能框架来做（Apace Mina 与之类似，但是 Netty 使用的更多一点）。

## 3. Netty 介绍

由于使用同步非阻塞的 I/O 模型 **NIO** 来进行网络编程真的太麻烦，所以 Netty 应用而生

[Netty](http://netty.io/) 是一个提供 asynchronous event-driven （异步事件驱动）的网络应用框架，是一个用以快速开发高性能、可扩展协议的服务器和客户端。也就是说，**Netty 是异步非阻塞的**

换句话说，**Netty 是一个 NIO 客户端服务器框架，使用它可以快速简单地开发网络应用程序**，比如服务器和客户端的协议。Netty 大大简化了网络程序的开发过程比如 TCP 和 UDP 的 Socket 服务的开发。

“快速和简单”并不意味着应用程序会有难维护和性能低的问题，Netty 是一个精心设计的框架，它从许多协议的实现中吸收了很多的经验，**支持 FTP、SMTP、HTTP、许多二进制和基于文本的传统协议**。

因此，Netty 已经成功地找到一个方式,在不失灵活性的前提下来实现开发的简易性，高性能，稳定性。

## 4. Netty 特点

Netty作为一款优秀的网络框架，自然有令人折服的特点：

- **设计**：
  - 针对多种传输类型的同一接口。
  - 简单但更强大的线程模型。
  - 真正的无连接的数据报套接字支持。
  - 链接逻辑复用。
- **性能**： Netty 的高性能是它被广泛使用的一个重要的原因，我们可能都认为 Java 不太适合 编写游戏服务端程序，但 Netty 的到来无疑是消除了这种见解。
  - 较原生 Java API有更好的吞吐量，较低的延时。
  - 资源消耗更少(共享池和重用)。
  - 减少内存拷贝。
- **健壮性**： 原生 NIO 的客户端/服务端程序编写较为麻烦，如果某个地方处理的不好，可能会 导致一些意料之外的异常，如内存溢出，死循环等等，而 Netty 则为我们简化了原生 API 的使用，这使得我们编写出来的程序不那么容易出错。
- **社区**： Netty 快速发展的一个重要的原因就是它的社区非常活跃，这也使得采用它的开发者越来越多。很多开源项目都使用到了 Netty 比如我们经常接触的 Dubbo、RocketMQ 等等。

## 5. 使用 Netty 能做什么

理论上 NIO 可以做的事情 ，使用 Netty 都可以做并且更好。Netty 主要用来做**网络通信** :

1. **作为 RPC 框架的网络通信工具** ： 我们在分布式系统中，不同服务节点之间经常需要相互调用，这个时候就需要 RPC 框架了。不同服务指点的通信可以使用 Netty 来做。
2. **实现一个自己的 HTTP 服务器** ：通过 Netty 我们可以自己实现一个简单的 HTTP 服务器。作为 Java 后端开发，我们一般使用 Tomcat 比较多。一个最基本的 HTTP 服务器可要以处理常见的 HTTP Method 的请求，比如 POST 请求、GET 请求等等。
3. **实现一个即时通讯系统** ： 使用 Netty 我们可以实现一个可以聊天类似微信的即时通讯系统，这方面的开源项目还蛮多的，可以自行去 Github 找一找。
4. **消息推送系统** ：市面上有很多消息推送系统都是基于 Netty 来做的。
5. ......

## 6. 哪些开源项目用到了 Netty

我们平常经常接触的 Dubbo、RocketMQ、Elasticsearch、gRPC 等等都用到了 Netty。

可以说大量的开源项目都用到了 Netty，所以掌握 Netty 有助于你更好的使用这些开源项目并且让你有能力对其进行二次开发。

实际上还有很多很多优秀的项目用到了 Netty,Netty 官方也做了统计，统计结果在这里：[https://netty.io/wiki/related-projects.html](https://netty.io/wiki/related-projects.html)

## 📚 References

- [netty-4-user-guide](https://waylau.com/netty-4-user-guide/Architectural%20Overview/Architectural%20Overview.html)
- [Essential Netty in Action 《Netty 实战(精髓)》](https://waylau.com/essential-netty-in-action/index.html)