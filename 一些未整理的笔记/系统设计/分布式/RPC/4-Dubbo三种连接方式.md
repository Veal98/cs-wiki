# 🍤 Dubbo 的三种连接方式

---

## 1. 使用注册中心

<img src="https://gitee.com/veal98/images/raw/master/img/20201204170204.png" style="zoom:67%;" />

参见 [SpringBoot + Dubbo + Zookeeper 搭建一个简单的分布式服务](https://veal98.gitee.io/cs-wiki/#/系统设计/分布式/RPC/3-SpringBoot+Dubbo+Zookeeper搭建一个简单的分布式服务)

服务端：

```properties
# 当前服务/应用名称
spring.dubbo.application.name = dubbo-provider

# 注册中心的地址
spring.dubbo.registry.address = zookeeper://127.0.0.1:2181

# 指定通信协议
spring.dubbo.protocol.name = dubbo
# 指定通信端口，把服务暴露在 dubbo 的 20880 端口
spring.dubbo.protocol.port = 20880
```

消费端直接 `@Reference` 注解获取暴露的服务接口即可

## 2. 通过广播的方式

服务端：

```properties
# 无注册中心
spring.dubbo.registry.address = multicast://xxx.5x.x.x:1234
```

## 3. 无注册中心，采用 Dubbo 直连的方式

注册中心负责服务地址的注册与查找，相当于目录服务，<u>服务提供者和消费者只在启动时与注册中心交互，注册中心不转发请求，压力较小。所以，我们可以完全可以绕过注册中心</u>——采用 **dubbo 直连** ，即在服务消费方配置服务提供方的位置信息。

服务端：

```properties
# 无注册中心
spring.dubbo.registry.address = N/A

# 指定通信协议
spring.dubbo.protocol.name = dubbo
# 指定通信端口，把服务暴露在 dubbo 的 20880 端口
spring.dubbo.protocol.port = 20880
```

消费端：直连的方式使用时，消费者引用的 url 要配置成本地的

```java
@Reference(url = "dubbo://127.0.0.1:20880")
```

## 📚 References