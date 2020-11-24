# SpringBoot + RabbitMQ 简单实例

---

## 1. 使用 Direct 交换机

本实例需要创建 2 个springboot 项目，一个 rabbitmq-provider （生产者），一个rabbitmq-consumer（消费者）。

### ① Provider

首先创建 rabbitmq-provider，pom.xml 里用到的 jar 依赖：

```xml
<!--rabbitmq-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

添加全局配置文件 `application.yml`：

```yml
server:
  port: 8021
spring:
  # 给项目来个名字
  application:
    name: rabbitmq-provider
  # 配置 rabbitMq 服务器
  rabbitmq:
    port: 5672
    # rabbitMq 用户名和密码，默认会有个管理员角色 guest
    username: guest
    password: guest
```

接着我们先使用下 direct exchange(直连型交换机), 创建 `DirectRabbitConfig.java`（对于队列和交换机持久化以及连接使用设置：

```java
package com.smallbeef.rabbitmqprovider.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DirectRabbitConfig {

    // 队列 起名：DirectQueue
    @Bean
    public Queue TestDirectQueue() {

        // public Queue(String name, boolean durable, boolean exclusive, boolean autoDelete)
        //一般设置一下队列的持久化就好,其余两个就是默认false
        return new Queue("DirectQueue",true);
    }

    // Direct交换机 起名：TestDirectExchange
    @Bean
    DirectExchange TestDirectExchange() {
        // public DirectExchange(String name, boolean durable, boolean autoDelete)
        return new DirectExchange("DirectExchange",true,false);
    }

    // 绑定 将队列和交换机绑定, 并设置路由键：RoutingKey
    @Bean
    Binding bindingDirect() {
        return BindingBuilder.bind(TestDirectQueue()).to(TestDirectExchange()).with("RoutingKey");
    }


    @Bean
    DirectExchange lonelyDirectExchange() {
        return new DirectExchange("lonelyDirectExchange");
    }

}
```

其中：

```java
public Queue(String name, boolean durable, boolean exclusive, boolean autoDelete){
    
}
```

- `durable`: 是否持久化,默认是 false

  持久化队列：会被存储在磁盘上，当消息代理重启时仍然存在

  暂存队列：当前连接有效

- `exclusive`: 默认也是 false，只能被当前创建的连接使用，而且当连接关闭后队列即被删除。此参考优先级高于 durable

-  `autoDelete`: 是否自动删除，当没有生产者或者消费者使用此队列，该队列会自动删除。

然后写个简单的接口进行消息推送 `SendMessageController.java`：

```java
@RestController
public class SendMessageController {

    @Autowired
    RabbitTemplate rabbitTemplate;  //使用 RabbitTemplate,这提供了接收/发送等等方法

    @GetMapping("/sendDirectMessage")
    public String sendDirectMessage() {
        String messageId = String.valueOf(UUID.randomUUID());
        String messageData = "test message, hello!";
        String createTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        Map<String,Object> map=new HashMap<>();
        map.put("messageId",messageId);
        map.put("messageData",messageData);
        map.put("createTime",createTime);
        //将消息携带绑定路由键值：RoutingKey 发送到交换机 DirectExchange
        rabbitTemplate.convertAndSend("DirectExchange", "RoutingKey", map);
        return "Send Successfully";
    }

}
```

运行 rabbitmq-provider 项目，并访问 [localhost:8021/sendDirectMessage](http://localhost:8021/sendDirectMessage)

因为我们目前还没弄消费者 rabbitmq-consumer，消息没有被消费的，我们 去 rabbitMq 管理页面看看 [http://localhost:15672/#/](http://localhost:15672/#/)，是否推送成功：

<img src="https://gitee.com/veal98/images/raw/master/img/20201124231653.png" style="zoom:50%;" />

再看看队列：

<img src="https://gitee.com/veal98/images/raw/master/img/20201124231754.png" style="zoom:50%;" />

OK，消息已经推送到 rabbitMq 服务器上面了。

### ② Consumer

接下来，创建 rabbitmq-consumer 项目