# 🍖 SpringBoot 集成 Redis（Lettuce）

---

## 1. Jedis 和 Lettuce

**Jedis**  和 **Lettuce** 是 Java 操作 Redis 的客户端。在 Spring Boot 1.x 版本默认使用的是 jedis ，而在 **Spring Boot 2.x 版本默认使用的就是 Lettuce**。关于 Jedis 跟 Lettuce 的区别如下：

- Jedis在实现上是直接连接的 redis server，如果在多线程环境下是非线程安全的，这个时候只有使用连接池，为每个Jedis实例增加物理连接
- Lettuce的连接是基于 Netty 的，连接实例（`StatefulRedisConnection`）可以在多个线程间并发访问，应为`StatefulRedisConnection `是线程安全的，所以一个连接实例就可以满足多线程环境下的并发访问，当然这个也是可伸缩的设计，一个连接实例不够的情况也可以按需增加连接实例。

## 2. RedisTemplate 类

SpringBoot 中用来操作 Redis 的类是 `RedisTemplate `类：

```java
@Bean
@ConditionalOnMissingBean(name = {"redisTemplate"}) // 我们可以自己定义一个 redisTemplate来替换这个默认的
public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) throws UnknownHostException {
    // 默认的 RedisTemplate 没有过多的设置，redis 对象都是需要序列化！
	// 两个泛型都是 Object, Object 的类型，我们使用需要强制转换 <String, Object>
    RedisTemplate<Object, Object> template = new RedisTemplate();
    template.setConnectionFactory(redisConnectionFactory);
    return template;
}

@Bean
@ConditionalOnMissingBean // 由于 String 是redis中最常使用的类型，所以单独提出来了一个bean
public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) throws UnknownHostException {
    StringRedisTemplate template = new StringRedisTemplate();
    template.setConnectionFactory(redisConnectionFactory);
    return template;
}
```

`RedisTemplate `提供了以下方法分别用于对 Redis 的各个数据结构进行操作：

- `opsForValue`： 对应 String（字符串）
- `opsForZSet`： 对应 ZSet（有序集合）
- `opsForHash`： 对应 Hash（哈希）
- `opsForList`： 对应 List（列表）
- `opsForSet`： 对应 Set（集合）
- `opsForGeo`： 对应 GEO（地理位置）

## 3. 整合测试

### ① 导入依赖

![](https://gitee.com/veal98/images/raw/master/img/20200725102121.png)

或者手动导入依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

SpringBoot2.x 底层访问默认使用 Lettuce

### ② 配置文件

```properties
# 配置redis
spring.redis.host=127.0.0.1
spring.redis.port=6379
```

### ③ 测试

```java
@SpringBootTest
class RedisDemoApplicationTests {

    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    void contextLoads() {
        redisTemplate.opsForValue().set("mykey","hello");
        System.out.println(redisTemplate.opsForValue().get("mykey"));
    }

}
```

## 4. 测试对象的保存

我们编写一个实体类 User，测试一下对象的保存：

```java
@Test
void contextLoads() {
    User user = new User("小牛肉","20");
    redisTemplate.opsForValue().set("user",user);
    System.out.println(redisTemplate.opsForValue().get("user"));
}
```

![](https://gitee.com/veal98/images/raw/master/img/20200725105227.png)

🚨 报错：所有的对象都需要序列化。

将实体类序列化：

```java
public class User implements Serializable {
```

OK！

## 5. 自定义 RedisTemplate

![](https://gitee.com/veal98/images/raw/master/img/20200725105703.png)

上示代码中 `RedisTemplate<Object,Object>` 泛型选用的是两个 `Object `类，通常情况下，对于 `key `值我们一般会选用 `String `类型，使得我们每次都要进行强制类型转换。而且 `RedisTemplate `类默认采用的是 jdk 的序列化方式，但在真实的开发中，我们一般使用 Json 来传递对象，接下来我们自定义一个 `RedisTemplate<String,Object>`（新建一个 configuration.`RedisConfig`类）：

```java
@Configuration
public class RedisConfig {
    @Bean
    @SuppressWarnings("all")
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        // 为了开发方便，一般直接使用 <String, Object>
        RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
        template.setConnectionFactory(factory);
        // 默认是的用jdk序列化的，需要改成 Json 序列化
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        // String 的序列化
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        // key采用String的序列化方式
        template.setKeySerializer(stringRedisSerializer);
        // hash的key也采用String的序列化方式
        template.setHashKeySerializer(stringRedisSerializer);
        // value序列化方式采用jackson
        template.setValueSerializer(jackson2JsonRedisSerializer);
        // hash的value序列化方式采用jackson
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }
}
```

```java
public class User {
```

测试：

```java
@Test
void contextLoads() {
    User user = new User("小牛肉","20");
    redisTemplate.opsForValue().set("user",user);
    System.out.println(redisTemplate.opsForValue().get("user"));
}
```

🎉 Successful ！

## 📚 References

- [【狂神说Java】Redis最新超详细版教程通俗易懂](https://www.bilibili.com/video/BV1S54y1R7SB?from=search&seid=3325634079268895938)
- [SpringBoot整合Redis---自定义配置](https://www.cnblogs.com/leeeeemz/p/12766186.html)