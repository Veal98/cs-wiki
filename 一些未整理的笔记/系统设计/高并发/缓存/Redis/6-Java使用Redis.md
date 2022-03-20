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

接下来进行测试是否能够正确访问到 Redis 服务：

```java
import redis.clients.jedis.Jedis;
public class TestPing {
    public static void main(String[] args) {
        // 1、 new Jedis 对象即可
        Jedis jedis = new Jedis("127.0.0.1",6379);
        // jedis 所有的命令就是我们之前学习的所有指令！所以之前的指令学习很重要
        System.out.println(jedis.ping());
    }
}
```

> 😒 非常尴尬的是，尽管我百度了各种方法，仍然是无法访问Linux上 Redis 的端口，迫不得已转向了 Windows 的 Redis，啥也没配置，就直接连上去了。。。。。。

## 2. 常用 API

所有的 api 命令，就是我们对应的上面学习的指令，一个都没有变化：

- `String `
- `List `
- `Set `
- `Hash `
- `Zset`

### ① String(字符串) 实例

```java
public class RedisStringJava {
    public static void main(String[] args) {
        //连接本地的 Redis 服务
        Jedis jedis = new Jedis("localhost");
        //设置 redis 字符串数据
        jedis.set("name","smallbeef");
        // 获取存储的数据并输出
        System.out.println("redis 存储的字符串为：" + jedis.get("name"));
    }
}
```

### ② List(列表) 实例

```java
public class RedisListJava {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("127.0.0.1",6379);
        // 存入列表
        jedis.lpush("mylist","one");
        jedis.lpush("mylist","two");
        jedis.lpush("mylist","three");
        // 获取数据
        List<String> mylist = jedis.lrange("mylist", 0, 2);
        for(int i=0; i<mylist.size(); i++) {
            System.out.println("列表项为: "+mylist.get(i));
    }
}
```

### ③ keys 实例

```java
public class RedisKeysJava {
    public static void main(String[] args) {
		Jedis jedis = new Jedis("127.0.0.1",6379);
        Set<String> keys = jedis.keys("*");
        Iterator<String> iterator = keys.iterator();
        while(iterator.hasNext()){
            String key = iterator.next();
            System.out.println(key); // name mylist
        }
    }
}
```

### ④ 事务实例

```java
public class TestTX {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("127.0.0.1",6379);
        jedis.flushDB();

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("hello","world");
        jsonObject.put("name","smallbeef");
        // 开启事务
        Transaction multi = jedis.multi();
        String s = jsonObject.toJSONString();
        // jedis watch
        try{
            multi.set("user1", s);
            multi.set("user2", s);
            int i = 1/0 ; // 抛出异常，执行失败
            multi.exec();
        } catch (Exception e){
            multi.discard(); // 放弃事务
            e.printStackTrace();
        } finally {
            System.out.println(jedis.get("user1")); // null
            System.out.println(jedis.get("user2")); // null
            jedis.close(); // 关闭连接
        }
    }
}
```



## 📚 References

- [【狂神说Java】Redis最新超详细版教程通俗易懂](https://www.bilibili.com/video/BV1S54y1R7SB?from=search&seid=3325634079268895938)
- [菜鸟教程 — Java 使用 Redis](https://www.runoob.com/redis/redis-java.html)