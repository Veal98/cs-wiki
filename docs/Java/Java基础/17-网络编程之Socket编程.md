# ⛵ Java 网络编程 — Socket 编程

---

## 1. 什么是网络编程

**网络编程是指编写运行在多个设备（计算机）的程序，这些设备都通过网络连接起来**。

`java.net` 包中 J2SE 的 API 包含有类和接口，它们提供低层次的通信细节。你可以直接使用这些类和接口，来专注于解决问题，而不用关注通信细节。

`java.net` 包中提供了两种常见的网络协议的支持：**TCP** 和 **UDP**

本篇主要讲解网络编程中的 **Socket 编程**，这是使用最广泛的网络概念。

## 2. 什么是 Socket

Socket 起源于 Unix，Socket 的原意是“**插座**”，在计算机通信领域，Socket 被翻译为“**套接字**”，它是计算机之间进行通信的一种**约定**或一种方式。**通过 Socket 这种约定，一台计算机可以接收其他计算机的数据，也可以向其他计算机发送数据**。

![](https://gitee.com/veal98/images/raw/master/img/20201205112439.png)

**Socket 套接字是通信的基石**，是支持 TCP/IP 协议的网络通信的基本操作单元。它是网络通信过程中端点的抽象表示，包含进行网络通信必须的五种信息：<u>连接使用的协议，本地主机的 IP 地址，本地进程的协议端口，远地主机的 IP 地址，远地进程的协议端口</u>。

Socket 是应用层与 TCP/IP 协议族通信的中间**软件抽象层**，本质是**编程接口(API)**，**对 TCP/IP 进行封装**。它<u>把复杂的 TCP/IP 协议族隐藏在 Socket 接口后面</u>。对用户来说，只要通过一组简单的API就可以实现网络的连接

<img src="https://gitee.com/veal98/images/raw/master/img/20201205110430.png" style="zoom: 67%;" />

## 3. Socket 原理（基于 TCP）

Socket 实质上提供了进程通信的**端点**，网络之间的两个进程在通信之前，双方首先必须各自创建一个端点，否则是没有办法建立联系并相互通信的。

介绍一下 Linux 中几个简单的 Socket 接口函数：

- socket：创建一个 Socket

- bind：把一个地址赋给 Socket。

- listen / connect：如果作为一个服务器，在调用 socket()、bind() 之后就会调用 listen() 来监听这个Socket，如果客户端这时调用 connect() 发出连接请求，服务器端就会接收到这个请求。

  通常服务器在启动的时候都会绑定一个地址（如 IP 地址 + 端口号），用于提供服务，客户端就可以通过它来接连服务器；而客户端不用指定，系统会自动分配一个端口号和自身的 IP 地址组合。这就是为什么通常服务器端在 listen 之前会调用 bind，而客户端就不会调用，因为它在 connect 时系统会随机生成一个。

- accept：接收请求

- read / write：读写操作

- close：关闭 Socket

下图是基于 TCP 协议的 Socket 之间的连接过程：

![](https://gitee.com/veal98/images/raw/master/img/20201205112802.png)

基于 UDP：

![图片](https://mmbiz.qpic.cn/mmbiz_png/J0g14CUwaZckxn1SzJ697nE1m1wJzmPQBPkAQtrMGEBnwgtyn48Gy4jGuU8PRzxGLWGDVTEUqDKtqXE7UNG7icg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 4. ServerSocket 类的方法

⭐ **`ServerSocket` 常用于服务端**

`ServerSocket` 对应 TCP 协议。**服务器**应用程序通过使用 `java.net.ServerSocket` 类以获取一个端口,并且侦听客户端请求。

`ServerSocket ` 类有四个构造方法：

| **序号** | **方法描述**                                                 |
| -------- | ------------------------------------------------------------ |
| 1        | **public `ServerSocket(int port)` throws IOException** 创建绑定到特定端口的服务器套接字。 |
| 2        | **public ServerSocket(int port, int backlog) throws IOException** 利用指定的 backlog 创建服务器套接字并将其绑定到指定的本地端口号。 |
| 3        | **public ServerSocket(int port, int backlog, InetAddress address) throws IOException** 使用指定的端口、侦听 backlog 和要绑定到的本地 IP 地址创建服务器。 |
| 4        | **public ServerSocket() throws IOException** 创建非绑定服务器套接字。 |

创建非绑定服务器套接字。 如果 `ServerSocket `构造方法没有抛出异常，就意味着你的应用程序已经成功绑定到指定的端口，并且侦听客户端请求。

这里有一些 `ServerSocket `类的常用方法：

| **序号** | **方法描述**                                                 |
| -------- | ------------------------------------------------------------ |
| 1        | **public int getLocalPort()**  返回此套接字在其上侦听的端口。 |
| 2        | **public Socket `accept()` throws IOException** 侦听并接受到此套接字的连接。 |
| 3        | **public void setSoTimeout(int timeout)**  通过指定超时值启用/禁用 SO_TIMEOUT，以毫秒为单位。 |
| 4        | **public void `bind`(SocketAddress host, int backlog)** 将 ServerSocket 绑定到特定地址（IP 地址和端口号）。 |

------

## 5. Socket 类的方法

**⭐ `Socket` 常用于客户端**

`java.net.Socket` 类代表客户端和服务器都用来互相沟通的套接字。**客户端**要获取一个 `Socket` 对象通过实例化 ，而服务器则通过 `ServerSocket.accept()` 方法的返回值获得一个 `ServerSocket` 对象。

`Socket` 类有五个构造方法.

| **序号** | **方法描述**                                                 |
| -------- | ------------------------------------------------------------ |
| 1        | **public `Socket`(String host, int port) throws UnknownHostException, IOException.** 创建一个流套接字并将其连接到指定主机上的指定端口号。 |
| 2        | **public Socket(InetAddress host, int port) throws IOException** 创建一个流套接字并将其连接到指定 IP 地址的指定端口号。 |
| 3        | **public Socket(String host, int port, InetAddress localAddress, int localPort) throws IOException.** 创建一个套接字并将其连接到指定远程主机上的指定远程端口。 |
| 4        | **public Socket(InetAddress host, int port, InetAddress localAddress, int localPort) throws IOException.** 创建一个套接字并将其连接到指定远程地址上的指定远程端口。 |
| 5        | **public Socket()** 通过系统默认类型的 SocketImpl 创建未连接套接字 |

当 Socket 构造方法返回，并没有简单的实例化了一个 Socket 对象，它实际上会尝试连接到指定的服务器和端口。

下面列出了一些感兴趣的方法，注意客户端和服务器端都有一个 Socket 对象，所以无论客户端还是服务端都能够调用这些方法。

| **序号** | **方法描述**                                                 |
| -------- | ------------------------------------------------------------ |
| 1        | **public void `connect`(SocketAddress host, int timeout) throws IOException** 将此套接字连接到服务器，并指定一个超时值。 |
| 2        | **public InetAddress getInetAddress()**  返回套接字连接的地址。 |
| 3        | **public int getPort()** 返回此套接字连接到的远程端口。      |
| 4        | **public int getLocalPort()** 返回此套接字绑定到的本地端口。 |
| 5        | **public SocketAddress getRemoteSocketAddress()** 返回此套接字连接远程端点的地址，如果未连接则返回 null。 |
| 6        | **public InputStream `getInputStream()` throws IOException** 返回此套接字的输入流。 |
| 7        | **public OutputStream `getOutputStream()` throws IOException** 返回此套接字的输出流。 |
| 8        | **public void `close`() throws IOException** 关闭此套接字。  |

------

## 6. InetAddress 类的方法

这个类表示互联网协议(IP)地址。下面列出了 Socket 编程时比较有用的方法：

| **序号** | **方法描述**                                                 |
| -------- | ------------------------------------------------------------ |
| 1        | **static InetAddress getByAddress(byte[] addr)** 在给定原始 IP 地址的情况下，返回 InetAddress 对象。 |
| 2        | **static InetAddress getByAddress(String host, byte[] addr)** 根据提供的主机名和 IP 地址创建 InetAddress。 |
| 3        | **static InetAddress getByName(String host)** 在给定主机名的情况下确定主机的 IP 地址。 |
| 4        | **String getHostAddress()**  返回 IP 地址字符串（以文本表现形式）。 |
| 5        | **String getHostName()**   获取此 IP 地址的主机名。          |
| 6        | **static InetAddress getLocalHost()** 返回本地主机。         |
| 7        | **String toString()** 将此 IP 地址转换为 String。            |

## 7. 基于 TCP 的 Socket 实现



### ① 基本流程

对于一个功能齐全的 Socket，都要包含以下基本结构，其工作过程包含以下四个基本的步骤：

- 创建 Socket；
- 打开连接到 Socket 的输入/出流；
- 按照一定的协议（TCP 或 UDP）对 Socket 进行读/写操作；
- 关闭 Socket。

对应到具体的 Java 语言上，**两台计算机之间使用套接字建立 TCP 连接**时的过程如下：

- **服务器端：**
1. 创建 `ServerSocket` 对象（如果是 UDP 协议则对应 `DatagramSocket`）并且绑定地址（ip）和端口号(port)：`server.bind(new InetSocketAddress(host, port))`
  2. 通过 `accept()`方法监听客户端请求
  3. 连接建立后，通过输入流读取客户端发送的请求信息
  4. 通过输出流向客户端发送响应信息
  5. 关闭相关资源


- **客户端：**
1. 创建`Socket` 对象并且连接指定的服务器的地址（ip）和端口号(port)：`socket.connect(inetSocketAddress)`
  2. 连接建立后，通过输出流向服务器端发送请求信息
  3. 通过输入流获取服务器响应的信息
  4. 关闭相关资源

![](https://gitee.com/veal98/images/raw/master/img/20201205112802.png)

### ② Socket 客户端

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
}
```

### ③ Socket 服务端

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
}
```

**首先运行服务端，然后再运行客户端，控制台输出如下：**

<img src="https://gitee.com/veal98/images/raw/master/img/20201205153954.png" style="zoom: 67%;" />

<img src="https://gitee.com/veal98/images/raw/master/img/20201205154024.png" style="zoom:67%;" />

### ④ 代码中存在的问题

`ServerSocket` 的 `accept()` 方法是阻塞方法，也就是说  **`ServerSocket`  在调用 `accept()`等待客户端的连接请求时会阻塞，直到收到客户端发送的连接请求才会继续往下执行代码**。

很明显，上面演示的代码片段有一个很严重的问题：**只能同时处理一个客户端的连接，如果需要管理多个客户端的话，就需要为我们请求的客户端单独创建一个线程。** 如下图所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20201205154226.png" style="zoom:67%;" />

对应的Java代码可能是下面这样的：

```java
new Thread(() -> {
   // 创建 socket 连接
}).start();
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
 });
```

**但是，即使你再怎么优化和改变。也改变不了它的底层仍然是同步阻塞的 BIO 模型的事实，因此无法从根本上解决问题。**

**为了解决上述的问题，Java 1.4 中引入了 NIO ，一种同步非阻塞的 I/O 模型。**  由于使用同步非阻塞的 I/O 模型 **NIO** 来进行网络编程真的太麻烦了。你可以使用基于 NIO 的网络编程框架 **Netty** ，👍 它将是你最好的选择

## 📚 References

- [Java网络编程之Socket编程_skyWalker_ONLY-CSDN博客](https://blog.csdn.net/skywalker_only/article/details/23876469?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1.not_use_machine_learn_pai&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1.not_use_machine_learn_pai)
- [Java 网络编程 | 菜鸟教程 (runoob.com)](https://www.runoob.com/java/java-networking.html)