# 🙃 微服务与 Spring Cloud

---

## 1. 什么是微服务

微服务架构是一种架构模式，它提倡将 **单一应用程序划分成一组小的服务即微服务** `Microservices`（通俗来说，一个个由 SpringBoot 开发的模块就是一个个的微服务），每个服务都围绕着具体业务进行构建，并且能够被独立不是到生产环境中。**服务之间互相协调配合**，采用轻量级的通信机制互相协作（Dubbo 采用 `RPC`，Spring Cloud 采用基于 `HTTP` 协议的 `RESTful API`）。

另外，应当尽量避免统一的，集中式的服务管理机制。对具体的一个服务而言，应根据上下文，选择何时的语言、工具对其进行构建。

<img src="https://gitee.com/veal98/images/raw/master/img/20201126211510.png" style="zoom: 50%;" />

⭐ 一个分布式微服务架构的系统，最起码需要包含如下组件：

<img src="https://gitee.com/veal98/images/raw/master/img/20201126212835.png" style="zoom:67%;" />

## 2. 什么是 Spring Cloud

Spring Cloud = **分布式微服务架构的一站式解决方案，是多种微服务架构落地技术的集合体，俗称微服务全家桶**

简单来说，Spring Cloud 就是一些列微服务**技术的组合**

<img src="https://gitee.com/veal98/images/raw/master/img/20201126212711.png" style="zoom:67%;" />

Spring Cloud 集成/包含的相关技术：

<img src="https://gitee.com/veal98/images/raw/master/img/20201126213643.png" style="zoom: 67%;" />

<img src="https://gitee.com/veal98/images/raw/master/img/20201126213704.png" style="zoom:67%;" />

## 3. 什么是 Spring Cloud Netflix / Alibaba

**Spring Cloud 本身其实只是一套微服务规范，并不是一个拿来即可用的框架，Spring Cloud Netflix 和 Spring Cloud Alibaba 是为开发者提供了这套规范的实现方式**。

> 🚨 **Spring Cloud Netflix** 2018年12月12日进入维护模式（Maintenance Mode），且其内置组件/中间件大部分都已停更或出现更好的替代组件，所以不太适合长期再使用。

Dubbo + Zookeeper 其实也是一种微服务架构的解决方案，但是并非是一站式解决方案，还需要整合其他组件。

## 📚 References

- [Bilibili - 尚硅谷2020最新版 SpringCloud(H版&alibaba) 框架开发教程全套完整版从入门到精通](https://www.bilibili.com/video/BV18E411x7eT?p=2)
- [Github - Advanced Java](https://doocs.gitee.io/advanced-java/#/./docs/distributed-system/distributed-system-interview)
- [Github - JavaGuide](https://snailclimb.gitee.io/javaguide/#/docs/system-design/distributed-system/分布式?id=二-分布式事务)