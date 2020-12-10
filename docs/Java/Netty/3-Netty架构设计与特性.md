# 🌸 Netty 架构设计与核心组件详解

---

本章从功能特性、模块组件、运作过程来介绍 Netty 的架构设计

## 1. Netty 功能特性

![](https://gitee.com/veal98/images/raw/master/img/20201210212218.png)

- 传输服务 支持 BIO 和 NIO
- 容器集成 支持 OSGI、JBossMC、Spring、Guice 容器
- 协议支持 HTTP、Protobuf、二进制、文本、WebSocket 等一系列常见协议都支持。 还支持通过实行编码解码逻辑来实现自定义协议
- 核心：可扩展事件模型、通用通信API、支持零拷贝的 ByteBuf 缓冲对象

## 📚 References

- [netty-4-user-guide](https://waylau.com/netty-4-user-guide/Architectural%20Overview/Architectural%20Overview.html)