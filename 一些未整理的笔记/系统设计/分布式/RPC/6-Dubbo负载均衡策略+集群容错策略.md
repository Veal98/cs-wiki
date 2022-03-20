# 💈 Dubbo 负载均衡策略 + 集群容错策略

---

## 1. Dubbo 的负载均衡策略

### ① Dubbo 提供的负载均衡策略

在集群负载均衡时，Dubbo 提供了多种均衡策略，默认为 `random` 随机调用。可以自行扩展负载均衡策略，参见：[负载均衡扩展](https://dubbo.gitbooks.io/dubbo-dev-book/content/impls/load-balance.html)。

#### Random LoadBalance 基于权重的随机负载均衡机制，默认

**对 provider 不同实例设置不同的权重，按照权重来负载均衡，权重越大分配流量越高**

假设有一组服务器 servers = `[A, B, C]`，他们对应的权重为 weights = `[5, 3, 2]`，权重总和为 10。现在把这些权重值平铺在一维坐标值上，`[0, 5)` 区间属于服务器 A，`[5, 8)` 区间属于服务器 B，`[8, 10)` 区间属于服务器 C。接下来通过随机数生成器生成一个范围在 `[0, 10)` 之间的随机数，然后计算这个随机数会落到哪个区间上。比如数字 3 会落到服务器 A 对应的区间上，此时返回服务器 A 即可。权重越大的机器，在坐标轴上对应的区间范围就越大，因此随机数生成器生成的数字就会有更大的概率落到此区间内。

#### RoundRobin LoadBalance 基于权重的轮询负载均衡机制，不推荐

RoundRobin LoadBalance 根据权重分配负载，权重小的机器分配的负载就小

![](https://gitee.com/veal98/images/raw/master/img/20201127120840.png)

存在慢的提供者累积请求的问题，比如：第二台机器很慢，但没挂，当请求调到第二台时就卡在那，久而久之，所有请求都卡在调到第二台上。

#### LeastActive LoadBalance 最小活跃数负载均衡

最小活跃数负载均衡算法的基本思想是这样的：

每个服务提供者会对应着一个活跃数 active。初始情况下，所有服务提供者的 active 均为 0。**每当收到一个请求，对应的服务提供者的 active 会加 1，处理完请求后，active 会减 1**。所以，**如果服务提供者性能较好，处理请求的效率就越高，那么 active 也会下降的越快。因此可以给这样的服务提供者优先分配请求**。

当然，除了最小活跃数，LeastActive LoadBalance 在实现上还引入了权重值。所以准确的来说，LeastActive  LoadBalance 是基于加权最小活跃数算法实现的。

#### ConsistentHash LoadBalance

一致性 Hash 算法，**相同参数的请求一定分发到一个 provider 上去**，provider 挂掉的时候，会基于虚拟节点均匀分配剩余的流量，抖动不会太大。**如果你需要的不是随机负载均衡**，是要一类请求都到一个节点，那就走这个一致性 Hash 策略。

### ② 配置负载均衡策略

#### xml 方式

服务端服务级别

```java
<dubbo:service interface="..." loadbalance="roundrobin" />
```

客户端服务级别

```java
<dubbo:reference interface="..." loadbalance="roundrobin" />
```

服务端方法级别

```java
<dubbo:service interface="...">
    <dubbo:method name="..." loadbalance="roundrobin"/>
</dubbo:service>
```

客户端方法级别

```java
<dubbo:reference interface="...">
    <dubbo:method name="..." loadbalance="roundrobin"/>
</dubbo:reference>
```

#### 注解方式

消费方基于基于注解的服务端服务级别配置方式：

```java
@Reference(loadbalance = "roundrobin")
HelloService helloService;
```

## 2. Dubbo 的集群容错策略

在集群调用失败时，Dubbo 提供了多种容错方案，默认为 failover 重试。

![](https://gitee.com/veal98/images/raw/master/img/20201205224850.png)

### ① Failover Cluster 模式，默认

**失败自动切换，自动重试其他机器**，**默认**就是这个，常见于读操作。（失败重试其它机器）

可以通过以下几种方式配置重试次数：

```xml
<dubbo:service retries="2" />
```

或者

```xml
<dubbo:reference retries="2" />
```

或者

```xml
<dubbo:reference>
    <dubbo:method name="findFoo" retries="2" />
</dubbo:reference>
```

### ② Failfast Cluster 模式

**一次调用失败就立即失败**，常见于非幂等性的写操作，比如新增一条记录（调用失败就立即失败）

### ③ Failsafe Cluster 模式

**出现异常时忽略掉**，常用于不重要的接口调用，比如记录日志。

配置示例如下：

```xml
<dubbo:service cluster="failsafe" />
```

或者

```xml
<dubbo:reference cluster="failsafe" />
```

### ④ Failback Cluster 模式

**失败了后台自动记录请求，然后定时重发**，比较适合于写消息队列这种。

### ⑤ Forking Cluster 模式

**并行调用多个 provider，只要一个成功就立即返回**。常用于实时性要求比较高的读操作，但是会浪费更多的服务资源，可通过 `forks="2"` 来设置最大并行数。

### ⑥ Broadcast Cluster 模式

**逐个调用所有的 provider。任何一个 provider 出错则报错**（从 `2.1.0` 版本开始支持）。通常用于通知所有提供者更新缓存或日志等本地资源信息。

## 📚 References

- [Apache Dubbo 官方文档](http://dubbo.apache.org/zh/docs/v2.7/user/preface/requirements/)
- [dubbo-dev-book (gitbooks.io)](https://dubbo.gitbooks.io/dubbo-dev-book/content/design.html)
- [Github - Advanced Java](https://doocs.gitee.io/advanced-java/#/./docs/distributed-system/dubbo-operating-principle)