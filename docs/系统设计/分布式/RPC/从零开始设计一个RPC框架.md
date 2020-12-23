# 🏆 从零开始设计一个轻量级分布式 RPC 框架

---

## 💌 写在前面

本项目基于 Spring + Netty + Zookeeper + Protostuff 从零开始设计实现一个轻量级的分布式 RPC 框架，内含详细设计思路以及开发教程，**通过造轮子的方式来学习**，深入理解 RPC 框架的底层原理。相比简历上一律的 xxxx 系统，造轮子很显然更能赢得面试官的青睐 💖

当然，大家在实际项目中少造轮子，尽量去用现成的优秀框架

## 🍉 实现一个最基本的 RPC 框架需要哪些东西

RPC 框架领域的集大成者 **Dubbo** 的架构如下图所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20201216210433.png" style="zoom:80%;" />

🔸 节点说明：

| 节点         | 角色说明                               |
| ------------ | -------------------------------------- |
| `Deployer`   | 自动部署服务的本地代理                 |
| `Repository` | 仓库用于存储服务应用发布包             |
| `Scheduler`  | 调度中心基于访问压力自动增减服务提供者 |
| `Admin`      | 统一管理控制台                         |
| `Registry`   | 服务注册与发现的注册中心               |
| `Monitor`    | 统计服务的调用次数和调用时间的监控中心 |

🔸 调用关系说明：

1. 服务容器负责启动，加载，运行服务提供者。
2. **服务提供者在启动时，向注册中心注册自己提供的服务**。
3. **服务消费者在启动时，向注册中心订阅自己所需的服务**。
4. 注册中心返回**服务提供者地址列表**给消费者，如果有变更，注册中心将基于长连接推送变更数据给消费者。
5. 服务消费者 从提供者地址列表中 基于软负载均衡算法 选一台提供者进行调用，如果调用失败，再选另一台调用。
6. **服务消费者和提供者**，在内存中累计调用次数和调用时间，**定时每分钟发送一次统计数据到监控中心**。

参考 Dubbo ，我们说一下设计一个最基本的 RPC 框架的思路或者说实现一个最基本的 RPC 框架需要哪些东西：

### 1. 注册中心

**服务注册与发现的注册中心 Registry 负责服务地址的注册与查找，相当于目录服务。** 服务端启动的时候将服务名称及其对应的地址 (ip+port) 注册到注册中心，服务消费端根据服务名称找到对应的服务地址。有了服务地址之后，服务消费端就可以通过网络请求服务端了。

👍 推荐使用 **Zookeeper** 作为注册中心：

ZooKeeper 为我们提供了高可用、高性能、稳定的分布式数据一致性解决方案，通常被用于实现诸如数据发布/订阅、负载均衡、命名服务、分布式协调/通知、集群管理、Master 选举、分布式锁和分布式队列等功能。并且，**ZooKeeper 将数据保存在内存中，性能是非常棒的**。 在“读”多于“写”的应用程序中尤其地高性能，因为“写”会导致所有的服务器间同步状态。（“读”多于“写”是协调服务的典型场景）。

### 2. 网络传输

**既然我们要调用远程的方法，那必然需要发送网络请求来传递目标类和方法的信息以及方法的参数等数据到服务提供端。**

网络传输具体实现可以使用 Socket 、NIO、Netty：

- **Socket**：Java 中最原始、最基础的网络通信方式。但是Socket 是阻塞 IO、性能低并且功能单一
- **NIO**：同步非阻塞的 I/O 模型，但是用它来进行网络编程真的太麻烦了
- **Netty**：基于 NIO 的 client-server(客户端服务器)框架，使用它可以快速简单地开发网络应用程序。极大地简化并简化了 TCP 和 UDP 套接字服务器等网络编程, 并且性能以及安全性等很多方面甚至都要更好。支持多种协议如 FTP，SMTP，HTTP 以及各种二进制和基于文本的传统协议。

👍 推荐使用 **Netty**

### 3. 序列化和反序列化

要在网络传输数据就必然涉及到**序列化和反序列化**

因为网络传输的数据必须是二进制的。因此，我们的 Java 对象没办法直接在网络中传输。为了能够让 Java 对象在网络中传输我们需要将其**序列化**为二进制的数据。我们最终需要的还是目标 Java 对象，因此我们还要将二进制的数据 “解析” 为目标 Java 对象，也就是对二进制数据再进行一次**反序列化**。

另外，不仅网络传输的时候需要用到序列化和反序列化，将对象存储到文件、数据库等场景都需要用到序列化和反序列化。

![](https://gitee.com/veal98/images/raw/master/img/20201216211648.png)

JDK 自带的序列化，只需实现 `java.io.Serializable`接口即可，不过这种方式不推荐，因为不支持跨语言调用并且性能比较差。

比较常见的序列化框架：Kryo、hessian、protostuff 等

### 4. 动态代理

我们知道代理模式就是： 我们给某一个对象提供一个代理对象，并由代理对象来代替真实对象做一些事情。你可以把代理对象理解为一个幕后的工具人。 举个例子：我们真实对象调用方法的时候，我们可以通过代理对象去做一些事情比如安全校验、日志打印等等。但是，这个过程是完全对真实对象屏蔽的。

讲完了代理模式，再来说动态代理在 RPC 框架中的作用。

RPC 的主要目的就是让我们调用远程方法像调用本地方法一样简单，我们不需要关心远程方法调用的细节比如网络传输。

**怎样才能屏蔽程方法调用的底层细节呢？答案就是动态代理**

动态代理机制包括 JDK 动态代理、CGLIB 动态代理、Javassist 动态代理等

### 5. 负载均衡

当我们的系统中的某个服务的访问量特别大的时候，假设我们将这个服务部署在了多台服务器上，当客户端发起请求的时候，多台服务器都可以处理这个请求。那么，如何正确选择处理该请求的服务器就很关键。

**负载均衡就是为了避免单个服务器响应同一请求，容易造成服务器宕机、崩溃等问题**。

### 6. 传输/通信协议

我们还需要设计一个私有的 RPC 协议（通信/传输协议），这个协议是客户端（服务消费方）和服务端（服务提供方）交流的基础。

简单来说：**通过设计传输协议，我们定义需要传输哪些类型的数据， 并且还会规定每一种类型的数据应该占多少字节。这样我们在接收到二级制数据之后，就可以正确的解析出我们需要的数据。**

通常一些标准的 RPC 协议包含下面这些内容：

- **魔数** ： 通常是 4 个字节。这个魔数主要是为了筛选来到服务端的数据包，有了这个魔数之后，服务端首先取出前面四个字节进行比对，能够在第一时间识别出这个数据包并非是遵循自定义协议的，也就是无效数据包，为了安全考虑可以直接关闭连接以节省资源。
- **序列化器编号** ：标识序列化的方式，比如是使用 Java 自带的序列化，还是 json，kyro 等序列化方式。
- **消息体长度** ： 运行时计算出来。
- ..........

## 🔮 需要的技术储备

本项目基于 Netty + Protostuff + Spring + Zookeeper 实现，学习本项目，你需要下面这些技术储备：

- 🔸 **Java 基础**

  相关教程见 [CS Wiki - Java 基础](https://veal98.gitee.io/cs-wiki/#/README?id=java-%e5%9f%ba%e7%a1%80)

  - 动态代理机制
  - Java I/O 系统
  - 序列化机制以及序列化框架（Kryo ......）的基本使用
  - Java 网络编程（Socket 编程）
  - Java 并发/多线程
  - Java 反射
  - Java 注解
  - ..........

- 🔸 **Netty 4.x**：使 NIO 编程更加容易，屏蔽了 Java 底层的 NIO 细节

  相关教程见 [CS Wiki - Netty 4.x](https://veal98.gitee.io/cs-wiki/#/README?id=%e2%91%a2-netty-4x)

- 🔸 **Zookeeper**：提供服务注册与发现功能，开发分布式系统的必备选择，具备天生的集群能力

  相关教程见 [CS Wiki - 分布式协调服务 Zookeeper](https://veal98.gitee.io/cs-wiki/#/README?id=%e2%91%a4-%e5%88%86%e5%b8%83%e5%bc%8f%e5%8d%8f%e8%b0%83%e6%9c%8d%e5%8a%a1-zookeeper)

- 🔸 **Spring Framework（Spring）**：最强大的依赖注入框架，业界的权威标准

## 🎁 项目地址 | 拥抱开源

不得不说，开源真的大幅提高了我们的生产力和学习力（最起码对于我来说是这样）

项目源码地址：

- 😺 Github：[https://github.com/Veal98/RPC-FromScratch](https://github.com/Veal98/RPC-FromScratch)
- 🐯 Gitee：[https://gitee.com/veal98/RPC-FromScratch](https://gitee.com/veal98/RPC-FromScratch)

## ✅ 功能列表

欢迎有兴趣的小伙伴提 PR 😊 ~

- [x] 🍎 使用 Spring 提供依赖注入与参数配置
- [ ] 🍎 集成 Spring 通过注解注册服务
- [ ] 🍎 集成 Spring 通过注解消费服务
- [x] 🍎 使用 Netty 进行网络传输
  - [x] 🍑 基于 开源的序列化框架 Protostuff 实现消息对象的序列化/反序列化
    - [ ] 🍋 可优化：用户通过配置文件指定序列化方式，避免硬编码
  - [x] 🍑 自定义编解码器
  - [x] 🍑 TCP 心跳机制
    - [ ] 🍋 可优化：自定义应用层的 Netty 心跳机制
  - [x] 🍑 使用 JDK 动态代理机制调用远程方法
    - [x] 🍋 可优化：使用 CGLIB 动态代理调用远程方法
- [x] 🍎 使用 Zookeeper（ZkClient 客户端）实现服务注册和发现
  - [ ] 🍋 可优化：用户通过配置文件指定注册与发现中心的实现方式，避免硬编码
  - [x] 🍑 客户端调用远程服务的时候进行负载均衡 ：调用服务的时候，从很多服务地址中根据相应的负载均衡策略选取一个服务地址。目前使用的策略为随机负载均衡

## 🎃 项目模块概览

<img src="https://gitee.com/veal98/images/raw/master/img/20201223205427.png" style="zoom:67%;" />

💧 **本框架的核心功能模块**：

- `rpc-common`：包含封装 <u>RPC 请求与响应</u>（网络传输）的实体类/消息体 `entity`，Netty 编解码器 `codec` 以及序列化/反序列 `serialize`
- `rpc-server`：Netty / RPC 服务端，处理并响应客户端的请求 / 消息体）
- `rpc-client`：Netty / RPC 客户端，向服务端发送请求 / 消息体 + 接收服务端的响应
- `rpc-registry`：定义服务注册与发现行为的接口，以及接口的实现（基于 Zookeeper 及其客户端 ZkClient 实现服务的注册与发现）

💧 **下述这三个模块展示了如何使用本框架**：

- `rpc-sample-api`：定义服务接口（RPC 接口）
- `rpc-sample-server`：实现服务接口（RPC 接口），启动 / 发布 RPC 服务
- `rpc-sample-client`：调用 RPC 服务（使用动态代理调用远程方法）

## 📑 框架使用说明

🚨 **框架的使用样例代码存放在 `rpc-sample-xxx` 包中**。

要想使用这个框架，我们需要该框架的服务注册组件和 RPC 服务器注入进服务端包 **rpc-sample-server** 中，将服务发现组件和 RPC 客户端（代理）注入进客户端 **rpc-sample-client** 包中，下面详细讲解一下本框架的基本使用：

### 1. 定义 RPC 接口

👉 参见 **rpc-sample-api** 模块

```java
package com.cswiki.rpc.sample.api;

public interface HelloService {

    String hello(String name);
}
```

**将该模块打成 jar 包供其他项目使用**，点击右边的 Maven 然后选择 **install** ，这样 jar 包就打好了：

<img src="https://gitee.com/veal98/images/raw/master/img/20201217170949.png" style="zoom:67%;" />

需要将 RPC 接口与 RPC 实现分别存放在不同的模块中

### 2. 发布 RPC 服务

👉 参见 **rpc-sample-server** 模块

#### ① 添加依赖

```xml
<dependencies>
    <!--RPC 接口所在模块的依赖-->
    <dependency>
        <groupId>com.cswiki</groupId>
        <artifactId>rpc-sample-api</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>

    <!--RPC 服务端框架的依赖-->
    <dependency>
        <groupId>com.cswiki</groupId>
        <artifactId>rpc-server</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>

    <!--注册中心所在模块的依赖-->
    <dependency>
        <groupId>com.cswiki</groupId>
        <artifactId>rpc-registry-zookeeper</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
    
    <!--Spring-->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.3.1</version>
        <scope>compile</scope>
    </dependency>
</dependencies>
```

#### ② 实现 RPC 接口

实现该接口：

```java
@RpcService(interfaceName = HelloService.class) // 指定暴露服务的接口类型
public class HelloServiceImple implements HelloService {
    
    @Override
    public String hello(String name) {
        return "Hello! " + name;
    }
}
```

使用 `RpcService` 注解定义在服务接口的实现类上表示暴露该服务

> 💡 这里的**服务**其实指的就是**被暴露的实现类**，大 🔥 别被这点名词整懵了

🚨 若 RPC 接口拥有多个实现类，则需要在 RpcService 注解中指定 version 属性加以区分

```java
/**
 * HelloService 接口实现类 2（暴露该服务，需要指明 serviceVersion）
 */
@RpcService(interfaceName = HelloService.class, serviceVersion = "helloServiceImpl2") // 指定暴露服务的接口类型和版本
public class HelloServiceImpl2 implements HelloService {
    @Override
    public String hello(String name) {
        return "Hello! " + name + ", I am helloServiceImpl2";
    }
}
```

#### ③ 配置 RPC 服务端

##### Ⅰ spring.xml

通过 Spring 注册相关组件：**sping.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd">

    <!--对 rpc.sample.server 这个包进行扫描-->
    <context:component-scan base-package="com.cswiki.rpc.sample.server"></context:component-scan>

    <!--服务器配置参数-->
    <context:property-placeholder location="classpath:rpc.properties"></context:property-placeholder>

    <!--配置服务注册组件 Zookeeper-->
    <bean id = "serviceRegistry" class="com.cswiki.rpc.registry.zookeeper.ZookeeperServiceRegistry">
        <!--注册中心地址 127.0.0.1:2181-->
        <constructor-arg name="zkAddress" value="${rpc.registry_address}"></constructor-arg>
    </bean>

    <!--配置 RPC 服务器-->
    <bean id = "rpcServer" class="com.cswiki.rpc.server.RpcServer">
        <!--服务地址 127.0.0.1:8000-->
        <constructor-arg name = "serviceAddress" value="${rpc.service_address}"></constructor-arg>
        <!--注册中心 Zookeeper-->
        <constructor-arg name= "serviceRegistry" ref = "serviceRegistry"></constructor-arg>
    </bean>

</beans>
```

- `serviceRegistry`：用于服务注册（使用 ZooKeeper 实现），需提供 ZooKeeper 地址、系统名、实例号

  注册到 ZooKeeper 中的 ZNode 路径为：`registry/service/address`，前 2 个节点是持久的，最后 1 个节点是临时的

- `rpcServer`：用于发布 RPC 服务，需要提供服务器端口

##### Ⅱ rpc.properties

以下配置表明：连接本地的 ZooKeeper 服务器，并在 8000 端口上发布 RPC 服务

```properties
# ZooKeeper 服务器(注册中心）
rpc.registry_address = 127.0.0.1:2181

# RPC 服务端
rpc.service_address = 127.0.0.1:8000
```

#### ④ 启动/发布 RPC 服务

运行 `RpcBootstrap` 类，将对外发布 RPC 服务，同时进行服务注册（其实就是加载 Spring 配置文件）

```java
package com.cswiki.rpc.sample.server;

import org.springframework.context.support.ClassPathXmlApplicationContext;


/**
 * 启动服务器并发布服务（其实就是加载 spring 配置文件）
 */
public class RpcBootstrap {

    public static void main(String[] args) {
        // 加载 Spring 配置文件
        new ClassPathXmlApplicationContext("spring.xml");
    }
}

```

### 3. 调用 RPC 服务

👉 参见 **rpc-sample-client** 模块

#### ① 添加依赖

```xml
<dependencies>
    <!--RPC 客户端框架的依赖-->
    <dependency>
        <groupId>com.cswiki</groupId>
        <artifactId>rpc-client</artifactId>
        <version>1.0-SNAPSHOT</version>
        <scope>compile</scope>
    </dependency>
    
    <!--RPC 接口所在模块的依赖-->
    <dependency>
        <groupId>com.cswiki</groupId>
        <artifactId>rpc-sample-api</artifactId>
        <version>1.0-SNAPSHOT</version>
        <scope>compile</scope>
    </dependency>
    
    <!--注册中心所在模块的依赖-->
    <dependency>
        <groupId>com.cswiki</groupId>
        <artifactId>rpc-registry-zookeeper</artifactId>
        <version>1.0-SNAPSHOT</version>
        <scope>compile</scope>
    </dependency>
    
    <!--Spring-->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.3.1</version>
        <scope>compile</scope>
    </dependency>
</dependencies>
```

#### ② 配置 RPC 客户端

##### Ⅰ spring.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd">

    <context:property-placeholder location="classpath:rpc.properties"/>

    <!--服务发现组件-->
    <bean id="serviceDiscovery" class="com.cswiki.rpc.registry.zookeeper.ZookeeperServiceDiscovery">
        <constructor-arg name="zkAddress" value="${rpc.registry_address}"/>
    </bean>

    <!--RPC 客户端动态代理-->
    <bean id="rpcProxy" class="com.cswiki.rpc.client.RpcProxy">
        <constructor-arg name="serviceDiscovery" ref="serviceDiscovery"/>
    </bean>

</beans>
```

- `serviceDiscovery`：用于服务发现（使用 ZooKeeper 实现），需提供 ZooKeeper 地址
- `rpcProxy`：用于获取 RPC 代理接口

##### Ⅱ rpc.properties

```properties
# ZooKeeper 服务器的地址（IP 地址与端口）
rpc.registry_address=127.0.0.1:2181
```

#### ③ 调用 RPC 服务

```java
package com.cswiki.rpc.sample.client;

import com.cswiki.rpc.client.RpcProxy;
import com.cswiki.rpc.sample.api.HelloService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class HelloClient {

    public static void main(String[] args) throws Exception {
        // 加载 Spring 配置文件
        ApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
        // 获取 RpcProxy 动态代理对象
        RpcProxy rpcProxy = context.getBean(RpcProxy.class);

        /**
         * 测试 HelloService 接口的实现类 1
         */
        // 调用 RpcProxy 对象的 create 方法来创建 RPC 代理接口
        HelloService helloService = rpcProxy.create(HelloService.class);
        // 调用 RPC 代理接口的方法(调用远程接口方法就像调用本地方法一样简单）
        String result = helloService.hello("World");
        System.out.println(result);


        /**
         * 测试 HelloService 接口的实现类 2
         */
        HelloService helloServiceImpl2 = rpcProxy.create(HelloService.class, "helloServiceImpl2");
        String result2 = helloServiceImpl2.hello("Java");
        System.out.println(result2);


        System.exit(0);
    }
}
```

## 🎨 完整教程

**小白专属**，大佬勿喷，逻辑并不难，对 Netty 和 RPC 较熟悉的大 🔥 直接上手撸代码就行

关于本框架的详细教程放在 CSDN 的专栏里，**从零开始，手把手教你如何开发本框架**。

<img src="https://gitee.com/veal98/images/raw/master/img/20201219223230.png" style="zoom:67%;" />

🔗 地址在此：<u>[飞天小牛肉 - 👊 从零开始设计一个轻量级的分布式 RPC 框架 - CSDN 专栏 ](https://blog.csdn.net/qq_41133986/category_10674495.html)</u>

🔗 地址在此：<u>[飞天小牛肉 - 👊 从零开始设计一个轻量级的分布式 RPC 框架 - CSDN 专栏 ](https://blog.csdn.net/qq_41133986/category_10674495.html)</u>

🔗 地址在此：<u>[飞天小牛肉 - 👊 从零开始设计一个轻量级的分布式 RPC 框架 - CSDN 专栏 ](https://blog.csdn.net/qq_41133986/category_10674495.html)</u>

📋 整个教程的目录大致如下，按顺序阅读即可。**目前尚在更新中**：

> 🔊 其实各个模块的知识点远不止这些，比如 Java I/O 和 Netty，它们属于一个非常庞大的知识体系，如果真要细致入微的去讲解每个细节，😆 真的写不完，大 🔥 看完本专栏后还有不熟悉的可以去我的学习笔记网站 [🎪 CS-Wiki（Gitee 推荐项目）](https://gitee.com/veal98/CS-Wiki) 做进一步的学习。不需要看知识点的各位可直接看框架代码分析部分的文章。

🚨 **RPC 原理是重中之重**，大家在编码的时候一定要记住并清楚 RPC 原理，整个框架的逻辑都围绕它来展开

- [x] 📖 前置知识点：什么是 RPC 及其原理
- [x] 📖 前置知识点：Dubbo 架构及工作原理
- [x] 📖 前置知识点：SpringBoot + Dubbo + Zookeeper 搭建一个简单的分布式服务
- [x] 📖 前置知识点：Zookeeper 重要概念详解
- [x] 📖 前置知识点：Zookeeper 安装与基本使用
- [x] 🌈 框架代码分析：Zookeeper 实现服务注册与发现
- [x] 📖 前置知识点：Java 反射
- [x] 📖 前置知识点：序列化介绍以及常见序列化协议对比
- [x] 📖 前置知识点：序列化协议 Protostuff 详解
- [x] 🌈 框架代码分析：网络传输实体类与序列化
- [x] 📖 前置知识点：Java 网络编程（Socket 编程）
- [x] 📖 前置知识点：从 BIO、NIO 到 Netty
- [x] 📖 前置知识点：Netty 实战之实现聊天功能
- [x] 📖 前置知识点：Netty 是如何实现 TCP 心跳机制的
- [x] 📖 前置知识点：Spring (Framework) 之 IoC 详解
- [x] 📖 前置知识点：Java 注解
- [x] 🌈 框架代码分析：Netty / RPC 服务端
- [x] 📖 前置知识点：静态代理 + JDK / CGLIB / Javassit 动态代理
- [x] 🌈 框架代码分析：Netty / RPC 客户端

## 📚 参考资料

- [黄勇 / rpc](https://gitee.com/huangyong/rpc)
- [SnailClimb / guide-rpc-framework](https://gitee.com/SnailClimb/guide-rpc-framework)