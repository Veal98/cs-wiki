# 📞 分布式 Session (集群下的 Session 管理)

---

**在使用负载均衡的集群环境中，负载均衡服务器可能会将请求发送到集群的任何一台应用服务器上，由于该服务器没有用户的 Session 信息，那么该用户就需要重新进行登录等操作**。所以保证每次请求依然能够获取正确的 Session 比单机时要复杂的多。

集群环境下，Session 管理主要有以下几种手段（**分布式 Session 的几种实现方式**）：

## 1. Session 复制（Session Replication）

早期方案，在服务器之间进行 Session 同步操作，**每个服务器都存储所有用户的 Session 信息**，因此用户可以向任何一个服务器进行请求。

<img src="https://gitee.com/veal98/images/raw/master/img/20201124111359.png" style="zoom:50%;" />

缺点：

- 占用过多内存；
- 同步过程占用网络带宽以及服务器处理器时间。

## 2. Session 绑定（Sticky Session）

`Session 绑定 `也称 `会话黏滞 Sticky Session`。利用负载均衡的源地址 Hash 算法实现，负载均衡服务器总是将来源于同一 IP 的请求分发到同一台服务器。这样**在整个会话期间，用户所有的请求都在同一台服务器上处理**，即 Session 被绑定在某台特定的服务器上。

<img src="https://gitee.com/veal98/images/raw/master/img/20201124111834.png" style="zoom:50%;" />

## 3. 利用 Cookie 记录 Session

<img src="https://gitee.com/veal98/images/raw/master/img/20201124112943.png" style="zoom:50%;" />

## 4. Session 服务器（Session Server）

**使用一个单独的服务器（集群）存储 Session 数据**，可以使用传统的 MySQL，也使用 Redis 或者 Memcached 这种内存型数据库。

<img src="https://gitee.com/veal98/images/raw/master/img/20201124113034.png" style="zoom:50%;" />

优点：

- 为了使得大型网站具有伸缩性，集群中的应用服务器通常需要保持无状态，那么应用服务器不能存储用户的会话信息。Session Server 将用户的会话信息单独进行存储，从而保证了应用服务器的无状态。

缺点：

- 需要去实现存取 Session 的代码。

## 📚 References

- [Github - Advanced Java](https://doocs.gitee.io/advanced-java/#/./docs/distributed-system/distributed-system-interview)
- [Github - CS-Notes](http://cyc2018.gitee.io/cs-notes/#/notes/分布式?id=一、分布式锁)
- [Github - JavaGuide](https://snailclimb.gitee.io/javaguide/#/docs/system-design/distributed-system/分布式?id=二-分布式事务)
- 《大型网站技术架构：核心原理与案例分析》