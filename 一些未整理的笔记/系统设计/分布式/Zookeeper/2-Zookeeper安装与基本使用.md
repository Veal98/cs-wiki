# 💜 Zookeeper 安装与基本使用

---

## 1. Zookeeper 安装

参见 👉 [Zookeeper 安装配置 | 菜鸟教程 (runoob.com)](https://www.runoob.com/w3cnote/zookeeper-setup.html)

注意下载的一定是 **bin**.tar.gz 文件，不然会出错

连接 Zookeeper 服务：运行 `zkServer.cmd`

再运行客户端 `zkCli.cmd`，可在 `zkCli.cmd` 输入命令

## 2. Zookeeper 常用命令

### 查看 ZooKeeper  常用命令 (help)

通过 `help` 命令查看 ZooKeeper 常用命令

### 创建节点 (create)

通过 `create` 命令在根目录创建了 node1 节点，与它关联的字符串是 "hello"

```shell
[zk: 127.0.0.1:2181(CONNECTED) 34] create /node1 “hello”
```

通过 `create` 命令在根目录创建了 node1 节点，与它关联的内容是数字 123

```shell
[zk: 127.0.0.1:2181(CONNECTED) 1] create /node1/node1.1 123
Created /node1/node1.1
```

### 更新节点数据内容 (set)

```shell
[zk: 127.0.0.1:2181(CONNECTED) 11] set /node1 "good"
```

### 获取节点的数据 (get)

`get` 命令可以获取指定节点的数据内容和节点的状态,可以看出我们通过 `set` 命令已经将节点数据内容改为 "good"。

```shell
good
cZxid = 0x47
ctime = Sun Jan 20 10:22:59 CST 2019
mZxid = 0x4b
mtime = Sun Jan 20 10:41:10 CST 2019
pZxid = 0x4a
cversion = 1
dataVersion = 1
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 9
numChildren = 1
```

### 查看某个目录下的子节点 (ls)

通过 `ls` 命令查看根目录下的节点

```shell
[zk: 127.0.0.1:2181(CONNECTED) 37] ls /
[dubbo, ZooKeeper, node1]
```

通过 `ls` 命令查看 node1 目录下的节点

```shell
[zk: 127.0.0.1:2181(CONNECTED) 5] ls /node1
[node1.1]
```

ZooKeeper 中的 ls 命令和 linux 命令中的 ls 类似， 这个命令将列出绝对路径 path 下的所有子节点信息（列出 1 级，并不递归）

### 查看节点状态 (stat)

通过 `stat` 命令查看节点状态

```shell
[zk: 127.0.0.1:2181(CONNECTED) 10] stat /node1
cZxid = 0x47
ctime = Sun Jan 20 10:22:59 CST 2019
mZxid = 0x47
mtime = Sun Jan 20 10:22:59 CST 2019
pZxid = 0x4a
cversion = 1
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 11
numChildren = 1
```

### 查看节点状态和子节点列表 (ls2)

`ls2` 命令更像是 `ls` 命令和 `stat` 命令的结合。 `ls2` 命令返回的信息包括 2 部分：

1. 子节点列表
2. 当前节点的 stat 信息。

```shell
[zk: 127.0.0.1:2181(CONNECTED) 7] ls2 /node1
[node1.1]
cZxid = 0x47
ctime = Sun Jan 20 10:22:59 CST 2019
mZxid = 0x47
mtime = Sun Jan 20 10:22:59 CST 2019
pZxid = 0x4a
cversion = 1
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 11
numChildren = 1
```

### 删除节点 (delete)

这个命令很简单，但是需要注意的一点是如果你要删除某一个节点，那么这个节点必须无子节点才行。

```shell
[zk: 127.0.0.1:2181(CONNECTED) 3] delete /node1/node1.1
```

## 3. ZooKeeper Java 客户端 Curator 简单使用

> 💡 Zookeeper 客户端提供了基本的操作，比如，创建会话、创建节点、读取节点、更新数据、删除节点和检查节点是否存在等。但对于开发人员来说，Zookeeper 提供的基本操纵还是有一些不足之处。接下来我们就介绍一下 Zookeeper 客户端的两款开源框架 **ZKClient** 和 **Curator**。

Curator 是 Netflix 公司开源的一套 ZooKeeper Java 客户端框架，**相比于 Zookeeper 自带的客户端 zookeeper 来说，Curator 的封装更加完善，各种 API 都可以比较方便地使用**。

Curator 4.0+版本对 ZooKeeper 3.5.x 支持比较好。开始之前，请先将下面的依赖添加进你的项目。

```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-framework</artifactId>
    <version>4.2.0</version>
</dependency>
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>4.2.0</version>
</dependency>
```

### ① 连接 ZooKeeper 客户端

通过 `CuratorFrameworkFactory` 创建 `CuratorFramework` 对象，然后再调用 `CuratorFramework` 对象的 `start()` 方法即可

```java
private static final int BASE_SLEEP_TIME = 1000; // 重试之间等待的初始时间
private static final int MAX_RETRIES = 3; // 最大重试次数

// Retry strategy. Retry 3 times, and will increase the sleep time between retries.
RetryPolicy retryPolicy = new ExponentialBackoffRetry(BASE_SLEEP_TIME, MAX_RETRIES);
CuratorFramework zkClient = CuratorFrameworkFactory.builder()
     // 要连接的服务器列表
    .connectString("127.0.0.1:2181")
    // 重试策略
    .retryPolicy(retryPolicy)
    .build();
zkClient.start();
```

对于一些基本参数的说明：

- `baseSleepTimeMs`：重试之间等待的初始时间
- `maxRetries` ：最大重试次数
- `connectString` ：要连接的服务器列表
- `retryPolicy` ：重试策略

### ② 数据节点的增删改查

#### 创建节点

上章我们提到过，通常是将 znode 分为 4 大类：

- **持久（PERSISTENT）节点** ：一旦创建就一直存在即使 ZooKeeper 集群宕机，直到将其删除。
- **临时（EPHEMERAL）节点** ：临时节点的生命周期是与 **客户端会话（session）** 绑定的，**会话消失则节点消失** 。并且，临时节点 **只能做叶子节点** ，不能创建子节点。
- **持久顺序（PERSISTENT_SEQUENTIAL）节点** ：除了具有持久（PERSISTENT）节点的特性之外， 子节点的名称还具有顺序性。比如 `/node1/app0000000001` 、`/node1/app0000000002` 。
- **临时顺序（EPHEMERAL_SEQUENTIAL）节点** ：除了具备临时（EPHEMERAL）节点的特性之外，子节点的名称还具有顺序性。

其实在使用的ZooKeeper 的时候，会发现 `CreateMode` 类中实际有 7种 znode 类型 ，但是用的最多的还是上面介绍的 4 种。

🔸 **a.创建持久化节点**

你可以通过下面两种方式创建持久化的节点。

```java
//注意:下面的代码会报错，下文说了具体原因
zkClient.create().forPath("/node1/00001");
zkClient.create().withMode(CreateMode.PERSISTENT).forPath("/node1/00002");
```

但是，你运行上面的代码会报错，这是因为的父节点`node1`还未创建。

你可以先创建父节点 `node1` ，然后再执行上面的代码就不会报错了。

```java
zkClient.create().forPath("/node1");
```

更推荐的方式是通过下面这行代码， **`creatingParentsIfNeeded()` 可以保证父节点不存在的时候自动创建父节点，这是非常有用的。**

```java
zkClient.create().creatingParentsIfNeeded().withMode(CreateMode.PERSISTENT).forPath("/node1/00001");
```

🔸 **b.创建临时节点**

```java
zkClient.create().creatingParentsIfNeeded().withMode(CreateMode.EPHEMERAL).forPath("/node1/00001");
```

🔸 **c.创建节点并指定数据内容**

```java
zkClient.create().creatingParentsIfNeeded().withMode(CreateMode.EPHEMERAL).forPath("/node1/00001", "java".getBytes());
zkClient.getData().forPath("/node1/00001");// 获取节点的数据内容，获取到的是 byte 数组
```

🔸 **d.检测节点是否创建成功**

```java
zkClient.checkExists().forPath("/node1/00001");// 不为 null 的话，说明节点创建成功
```

#### 删除节点

🔸 **a.删除一个子节点**

```java
zkClient.delete().forPath("/node1/00001");
```

🔸 **b.删除一个节点以及其下的所有子节点**

```java
zkClient.delete().deletingChildrenIfNeeded().forPath("/node1");
```

#### 获取/更新节点数据内容

```java
zkClient.create().creatingParentsIfNeeded().withMode(CreateMode.EPHEMERAL).forPath("/node1/00001","java".getBytes());
zkClient.getData().forPath("/node1/00001");//获取节点的数据内容
zkClient.setData().forPath("/node1/00001","c++".getBytes());//更新节点数据内容
```

#### 获取某个节点的所有子节点路径

```java
List<String> childrenPaths = zkClient.getChildren().forPath("/node1");
```

## 4. Zookeeper Java 客户端 ZkClient 简单使用

[ZkClient](https://github.com/sgroschupf/zkclient) 简单、高效的 Zookeeper Java客户端。

- 让 Zookeeper API 使用起来更简单
- 非常方便订阅各种事件并自动重新绑定事件（会话建立、节点修改、节点删除、子节点变更等）
- session 过期自动重连、机制

开始之前，请先将下面的依赖添加进你的项目：

```xml
<dependency>
    <groupId>com.101tec</groupId>
    <artifactId>zkclient</artifactId>
    <version>0.10</version>
</dependency>
```

### ① 连接 ZooKeeper 客户端

在使用 ZkClient 操作 Zookeeper 时，**基本的操作都封装在 `ZkClient` 类中**，使用时直接创建 `ZkClient` 对象，调用其相应的方法即可。

在 `ZkClient` 的构造函数中指定连接参数，完成对象创建后，与 ZooKeeper 的连接也就已经创建好。`ZkClient` 中提供了以下几个构造函数：

```java
public ZkClient(String serverstring)

public ZkClient(String zkServers, int connectionTimeout)

public ZkClient(String zkServers, int sessionTimeout, int connectionTimeout)

public ZkClient(String zkServers, int sessionTimeout, int connectionTimeout, ZkSerializer zkSerializer)

public ZkClient(final String zkServers, final int sessionTimeout, final int connectionTimeout, final ZkSerializer zkSerializer, final long operationRetryTimeout)

public ZkClient(IZkConnection connection)

public ZkClient(IZkConnection connection, int connectionTimeout)

public ZkClient(IZkConnection zkConnection, int connectionTimeout, ZkSerializer zkSerializer)

public ZkClient(final IZkConnection zkConnection, final int connectionTimeout, final ZkSerializer zkSerializer, final long operationRetryTimeout)
```

构造器参数的含义如下：

- `serverstring`：指定单个或多个服务器地址
- `connectionTimeout`，`sessionTimeout`：连接超时时间和会话超时时间。单位都是毫秒，其中会话默认是 30000 毫秒，也就是 30 秒。
- `connection`：`IZkConnection` 的接口实现类
- `zkSerializer`：自定义的序列化器
- `operationRetryTimeout`：在与服务连接断开后，进行重试操作的最长时间。也就是说，如果断开时间未超过``operationRetryTimeout`，则所有操作进行重试。`operationRetryTimeout` 单位也是毫秒，如果传入小于 0 的值，则一直进行操作重试，直至与服务的连接恢复

举个例子：

```java
public class TestZkClient {
    public static void main(String[] args) {
        ZkClient zkClient = new ZkClient("127.0.0.1:2181", 5000);
        System.out.println("成功建立连接");
    }
}
```

### ② 数据节点的增删改查

#### 创建节点

```java
public void createPersistent(String path)

public void createPersistent(String path, boolean createParents)

public void createPersistent(String path, boolean createParents, List<ACL> acl)

public void createPersistent(String path, Object data)

public void createPersistent(String path, Object data, List<ACL> acl)

public String createPersistentSequential(String path, Object data)

public String createPersistentSequential(String path, Object data, List<ACL> acl) 

public void createEphemeral(final String path)

public void createEphemeral(final String path, final List<ACL> acl)

public String create(final String path, Object data, final CreateMode mode)

public String create(final String path, Object data, final List<ACL> acl, final CreateMode mode) 

public void createEphemeral(final String path, final Object data)

public void createEphemeral(final String path, final Object data, final List<ACL> acl)

public String createEphemeralSequential(final String path, final Object data)

public String createEphemeralSequential(final String path, final Object data, final List<ACL> acl)
```

`createParents` 参数决定了是否**递归创建父节点**。`true` 表示递归创建，`false` 表示不使用递归创建。所以说 ZkClient 帮开发人员省去了不少繁琐的检查和创建父节点的过程。

#### 删除节点

删除节点提供了以下方法：

```java
public boolean delete(final String path)

public boolean delete(final String path, final int version)

public boolean deleteRecursive(String path)12345
```

删除 API 其实很简单，重点说一下 `deleteRecursive` 接口，这个接口提供了**递归删除**的功能。在原生 API 中，如果一个节点存在子节点，那么它将无法直接删除，必须一层层遍历先删除全部子节点，然后才能将目标节点删除。

#### 获取/更新节点数据内容

🔸 **获取节点内容**：

```java
public <T extends Object> T readData(String path)

public <T extends Object> T readData(String path, boolean returnNullIfPathNotExists)

public <T extends Object> T readData(String path, Stat stat)12345
```

通过方法返回参数的定义，就可以得知，**返回的结果（节点的内容）已经被反序列化成对象了**。

🔸**更新节点内容**：

更新操作可以通过以下接口来实现：

```java
public void writeData(String path, Object object)

public void writeData(final String path, Object datat, final int expectedVersion)

public Stat writeDataReturnStat(final String path, Object datat, final int expectedVersion)
```

#### 监测节点是否存在

此 API 比较简单，调用以下方法即可：

```java
protected boolean exists(final String path, final boolean watch)
```

#### 获取某个节点的所有子节点路径

```java
public List<String> getChildren(String path)1
```

此接口返回子节点的相对路径列表。比如节点路径为 `/test/a1` 和 `/test/a2`，那么当 path 为 `/test` 时，返回的结果为 `[a1,a2]`。

## 📚 References

- [程序新视界 - Zookeeper 之开源客户端 ZkClient](https://blog.csdn.net/wo541075754/article/details/68929512)
- [JavaGuide](https://snailclimb.gitee.io/javaguide/#/docs/system-design/distributed-system/zookeeper/zookeeper-in-action?id=_3-zookeeper-java客户端-curator简单使用)
- [Github - ZKClient](https://github.com/sgroschupf/zkclient)
- [adyliu / ZKClient 快速指南](https://github.com/adyliu/zkclient/wiki/tutorial)