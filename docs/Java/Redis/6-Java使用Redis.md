#  🍣 Java 使用 Redis — Jedis

---

**Jedis** 是 Redis 官方推荐的 Java 连接开发工具， 使用 Java 操作 Redis 的中间件。

## 1. 连接到 Redis

首先需要导入 Jedis 的 maven 依赖：

```xml
<!--导入jedis的包-->
<dependencies>
    <!-- https://mvnrepository.com/artifact/redis.clients/jedis -->
    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
        <version>3.2.0</version>
    </dependency>
    <!--fastjson-->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.62</version>
    </dependency>
</dependencies>

```



## 📚 References

- [【狂神说Java】Redis最新超详细版教程通俗易懂](https://www.bilibili.com/video/BV1S54y1R7SB?from=search&seid=3325634079268895938)