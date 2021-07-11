# 📋 Redis主从复制

---

## 1. 概念

⚪ 主从复制，是指将一台Redis服务器的数据，复制到其他的Redis服务器。前者称为**主节点(master/leader)**，后者称为**从节点(slave/follower)**

**数据的复制是单向的，只能由主节点到从节点。**

Master以写为主，Slave 以读为主。

默认情况下，每台 Redis 服务器都是主节点；且**一个主节点可以有多个从节点(或没有从节点)，但一个从节点只能有一个主节点**。

🚩 **主从复制的作用**主要包括：

- 数据冗余：主从复制实现了数据的热备份，是持久化之外的一种数据冗余方式。
- 故障恢复：当主节点出现问题时，可以由从节点提供服务，实现快速的故障恢复；实际上是一种服务的冗余。
- 负载均衡：在主从复制的基础上，配合读写分离，可以由主节点提供写服务，由从节点提供读服务（即写Redis数据时应用连接主节点，读Redis数据时应用连接从节点），分担服务器负载；尤其是在写少读多的场景下，通过多个从节点分担读负载，可以大大提高Redis服务器的并发量。
- 高可用（集群）基石：除了上述作用以外，主从复制还是哨兵和集群能够实施的基础，因此说主从复制是 Redis 高可用的基础。

一般来说，要将Redis运用于工程项目中，只使用一台Redis是万万不能的（宕机），原因如下：

- 从结构上，单个Redis服务器会发生单点故障，并且一台服务器需要处理所有的请求负载，压力较大

- 从容量上，单个Redis服务器内存容量有限，就算一台Redis服务器内存容量为256G，也不能将所有内存用作Redis存储内存，一般来说，单台Redis最大使用内存不应该超过20G。

电商网站上的商品，一般都是一次上传，无数次浏览的，说专业点也就是"多读少写"。对于这种场景，我们可以使用如下架构：

![](https://gitee.com/veal98/images/raw/master/img/20200724121112.png)

主从复制，读写分离。其实在 80% 的情况下都是在进行读操作，一般使用一主二从来减缓服务器的压力。

## 2. Windows 下环境配置

由于上次 Jedis 无法连接到 ubuntu 上的 Redis 后，我就安装了一个 Windows 版本的 Redis，为了避免接下来不可知的错误，本次使用 Windows 下的 Redis。具体配置如下：👇

只需要配置从节点，不需要配置主节点。

- 查看主节点的信息：

  ```powershell
  127.0.0.1:6379> info replication # 查看当前库的信息
  # Replication
  role:master # 角色 master
  connected_slaves:0 # 没有从机
  master
  _
  replid:b63c90e6c501143759cb0e7f450bd1eb0c70882a
  master
  _
  replid2:0000000000000000000000000000000000000000
  master
  _
  repl
  _offset:0
  second_
  repl
  _offset:-1
  repl
  _backlog_active:0
  repl
  _backlog_size:1048576
  repl
  _backlog_
  first_byte_offset:0
  repl
  _backlog_
  histlen:0
  ```

- 首先复制两份一样的文件夹在主节点（就是我们原先装的 Redis，port 6380）的同级目录下

  ![](https://gitee.com/veal98/images/raw/master/img/20200724123944.png)

- 修改两份文件夹的配置文件 `redis.windows.conf`：

  ```xmkl
  port 6380 # 修改端口
  
  # slaveof <masterip> <masterport>
  slaveof 127.0.0.1 6379 # 配置主从关系
  
  pidfile /var/run/redis6380.pid # 修改 dump.rdb 文件名。
  ```

  ```xml
  port 6381
  slaveof 127.0.0.1 6379
  pidfile /var/run/redis6381.pid
  ```

  > 也可以登陆后再利用命令行 `slaveof 127.0.0.1 6379` 设置主从关系。不过利用命令行设置的主从关系会在重启或关机后失效。

- 接下来，首先启动主节点，再启动从节点（从节点修改配置后需要按如下方式加载配置）

  ![](https://gitee.com/veal98/images/raw/master/img/20200724123732.png)

- OK，接下来进入主节点 `info replication` 查看主从复制信息：

  ![](https://gitee.com/veal98/images/raw/master/img/20200724144613.png)

- 登录从节点 6380 和 6381 

  ![](https://gitee.com/veal98/images/raw/master/img/20200724145114.png)

OK，一主二从的环境配置结束，接下来进行测试 👇

## 3. 一主二从

### ① 测试

⭐ **主机可以写，从机不能写只能读。主机中的所有信息和数据，都会自动被从机保存。**

比如说，我们在主机添加数据：

<img src="https://gitee.com/veal98/images/raw/master/img/20200724145645.png" style="zoom:80%;" />

从机可以读取主机上的数据，但不能进行写操作：

<img src="https://gitee.com/veal98/images/raw/master/img/20200724145751.png" style="zoom:80%;" />

如果主机挂掉，丛机原地待命，主机回来依然照旧：

![](https://gitee.com/veal98/images/raw/master/img/20200724151255.png)

### ② 复制原理

Slave 启动成功连接到 master 后会发送一个 `sync `同步命令，Master 接到命令，启动后台的存盘进程，同时收集所有接收到的用于修改数据集的命令，在后台进程执行完毕之后，master 将传送整个数据文件到 slave，并完成一次完全同步。

**全量复制**：slave 服务在接收到数据库文件数据后，将其存盘并加载到内存中。

**增量复制**：Master 继续将新的所有收集到的修改命令依次传给 slave，完成同步

注意：只要是重新连接 master，将自动执行全量复制。 

### ③ 薪火相传

上一个 Slave （记为 A）可以是下一个 slave 的 Master（注意 A 在它的主节点面前仍然是从节点），A 同样可以接收其他 slaves 的连接和同步请求，那么 A 作为了链条中下一个的 master, 可以有效减轻 master 的写压力。

![](https://gitee.com/veal98/images/raw/master/img/20200724152501.png)

### ④ 反客为主

从节点可以使用 `slaveof no one` 升级成为主节点。

## 4. 哨兵模式 sentinel

### ① 概述

主从切换技术的方法是：当主服务器宕机后，需要手动把一台从服务器切换为主服务器，这就需要人工干预，费事费力，还会造成一段时间内服务不可用。这不是一种推荐的方式，更多时候，我们优先考虑哨兵模式。Redis 从 2.8开始正式提供了 **Sentinel（哨兵）** 架构来解决这个问题。

反客为主的自动版，能够**后台监控主机是否故障，如果故障了根据投票数自动将从库转换为主库**。

哨兵模式是一种特殊的模式，首先 Redis 提供了哨兵的命令，**哨兵是一个独立的进程**，作为进程，它会独立运行。其原理是哨兵通过发送命令，等待 Redis 服务器响应，从而监控运行的多个 Redis 实例。

![](https://gitee.com/veal98/images/raw/master/img/20200724153208.png)

这里的哨兵有两个作用：

- 通过发送命令，让 Redis 服务器返回监控其运行状态，包括主服务器和从服务器。
- 当哨兵监测到 master 宕机，会自动将 slave 切换成 master，然后**通过发布订阅模式通知其他的从服务器，修改配置文件，让它们切换主机**。

然而一个哨兵进程对 Redis 服务器进行监控，可能会出现问题，为此，我们可以使用多个哨兵进行监控。各个哨兵之间还会互相进行监控，这样就形成了**多哨兵模式**。

![](https://gitee.com/veal98/images/raw/master/img/20200724153322.png)

假设主服务器宕机，哨兵1先检测到这个结果，系统并不会马上进行 **failover** 过程，仅仅是哨兵1主观的认为主服务器不可用，这个现象成为**主观下线**。

当后面的哨兵也检测到主服务器不可用，并且数量达到一定值时，那么哨兵之间就会进行一次投票，投票的结果由一个哨兵发起，进行 **failover[故障转移]** 操作。切换成功后，就会通过发布订阅模式，让各个哨兵把自己监控的从服务器实现切换主机，这个过程称为**客观下线**。

### ② 测试

首先需要在主机 Redis 的目录下新建 `sentinel.conf` 文件

<img src="https://gitee.com/veal98/images/raw/master/img/20200724162151.png" style="zoom:80%;" />

文件内容如下

- `sentinel monitor host6379 127.0.0.1 6379 1`

后面的这个数字 1，代表主机挂了后 slave 进行投票看让谁接替成为主机，得票数多少后（此处为 1 票）就会成为主机

启动哨兵：

```powershell
redis-server.exe sentinel.conf --sentinel
```

![](https://gitee.com/veal98/images/raw/master/img/20200724155009.png)

关闭主机服务后，哨兵将自动选取新的主机，**哨兵日志**如下：

![](https://gitee.com/veal98/images/raw/master/img/20200724155349.png)

OK，可以看到，哨兵选择了 6380 为新的主机：

![](https://gitee.com/veal98/images/raw/master/img/20200724155604.png)

🚩 **如果此时主机重新开启了，只能归并到新的主机下，当做从机**，这就是哨兵模式的规则

### ③ 哨兵模式优缺点

优点：

- 哨兵集群，基于主从复制模式，所有的主从复制优点，它全有

- 主从可以切换，故障可以转移，系统的可用性就会更好

- 哨兵模式就是主从模式的升级，手动到自动，更加健壮

缺点：

- Redis 不易于在线扩容，集群容量一旦到达上限，在线扩容就十分麻烦
- 实现哨兵模式的配置其实是很麻烦的，里面有很多选择

## 📚 References

- [【狂神说Java】Redis最新超详细版教程通俗易懂](https://www.bilibili.com/video/BV1S54y1R7SB?from=search&seid=3325634079268895938)
- [Redis 设计与实现（第一版）](https://redisbook.readthedocs.io/en/latest/index.html)
- [Redis 主从复制](https://blog.csdn.net/qq_36135928/article/details/79121147)
- [最简单的在windows上搭建redis集群（哨兵模式Redis-Sentinel）](https://blog.csdn.net/ITLTX1024/article/details/100665452)