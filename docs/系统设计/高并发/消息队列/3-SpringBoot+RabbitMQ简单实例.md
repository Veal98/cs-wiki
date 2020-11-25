# 👝 SpringBoot + RabbitMQ 简单实例

---

## 1. 使用 Direct 交换机

💡 `Dierct` 交换机要求 Bindingkey 与 RoutingKey 完全匹配

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

    // 绑定 将队列和交换机绑定, 并设置绑定键：BindingKey
    @Bean
    Binding bindingDirect() {
        return BindingBuilder.bind(TestDirectQueue()).to(TestDirectExchange()).with("key");
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
        // 将消息携带绑定路由键值 key 发送到交换机 DirectExchange
        // Direct 交换机要求路由键与绑定键完全一致
        rabbitTemplate.convertAndSend("DirectExchange", "key", map);
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

接下来，创建 rabbitmq-consumer 项目，添加的依赖同上

全局配置文件，注意修改端口：

```yml
server:
  port: 8022
spring:
  # 给项目来个名字
  application:
    name: rabbitmq-consumer
  # 配置 rabbitMq 服务器
  rabbitmq:
    port: 5672
    # rabbitMq 用户名和密码，默认会有个管理员角色 guest
    username: guest
    password: guest
```

由于消费者只需要使用消息即可，不需要发送消息，所以此处我们就不添加配置类了。

创建**消息接收监听类**：

```java
@Component
@RabbitListener(queues = "DirectQueue") //监听的队列名称 DirectQueue
public class DirectReceiver {
    @RabbitHandler
    public void process(Map message){
        System.out.println("DirectReceiver消费者收到消息  : " + message.toString());
    }
}
```

然后将 rabbitmq-consumer 项目运行起来，可以看到把之前推送的那条消息消费下来了：

![](https://gitee.com/veal98/images/raw/master/img/20201125125112.png)

<img src="https://gitee.com/veal98/images/raw/master/img/20201125125201.png" style="zoom:50%;" />

然后可以再继续调用 rabbitmq-provider 项目的推送消息接口，可以看到消费者即时消费消息

![](https://gitee.com/veal98/images/raw/master/img/20201125130756.png)

既然直连交换机是一对一，那如果配置多台监听绑定到同一个直连交互的同一个队列，会怎么样？

![](https://gitee.com/veal98/images/raw/master/img/20201125130825.png)

可以看到是实现了轮询的方式对消息进行消费，而且不存在重复消费。

## 2. 使用 Topic 交换机

💡 `Topic` 交换机支持 Bindingkey 与 RoutingKey 的模糊匹配

### ① Provider

在 rabbitmq-provider 项目里面创建 `TopicRabbitConfig.java`：

```java
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
 
@Configuration
public class TopicRabbitConfig {
 	
    // 第一个队列
    @Bean
    public Queue firstQueue() {
        return new Queue("Queue1");
    }
    
 	// 第二个队列
    @Bean
    public Queue secondQueue() {
        return new Queue("Queue2");
    }
 	
    // Topic 交换机 起名：topicExchange
    @Bean
    TopicExchange exchange() {
        return new TopicExchange("topicExchange");
    }
 
 
    // 将 firstQueue 和 topicExchange 绑定,而且绑定的键值为 topic.man
    // 这样只有消息携带的路由键是 topic.man, 才会分发到该队列
    @Bean
    Binding bindingExchangeMessage() {
        return BindingBuilder.bind(firstQueue()).to(exchange()).with("topic.man");
    }
 
    // 将 secondQueue 和 topicExchange 绑定,而且绑定的键值为用上通配路由键规则 topic.#
    // 这样只要是消息携带的路由键是以 topic. 开头,都会分发到该队列
    @Bean
    Binding bindingExchangeMessage2() {
        return BindingBuilder.bind(secondQueue()).to(exchange()).with("topic.#");
    }
}
```

- 队列 1：绑定键为 `topic.man`。只有消息携带的路由键是 `topic.man`, 才会分发到该队列
- 队列 2：绑定键为 `topic.#`。只要是消息携带的路由键是以 `topic.` 开头, 都会分发到该队列

然后添加 2 个接口，用于推送消息到主题交换机：

```java
    @GetMapping("/sendTopicMessage1")
    public String sendTopicMessage1() {
        String messageId = String.valueOf(UUID.randomUUID());
        String messageData = "message: M A N ";
        String createTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        Map<String, Object> manMap = new HashMap<>();
        manMap.put("messageId", messageId);
        manMap.put("messageData", messageData);
        manMap.put("createTime", createTime);
        // 推送消息，路由键为 topic.man
        rabbitTemplate.convertAndSend("topicExchange", "topic.man", manMap);
        return "Send Successfully";
    }
 
    @GetMapping("/sendTopicMessage2")
    public String sendTopicMessage2() {
        String messageId = String.valueOf(UUID.randomUUID());
        String messageData = "message: woman is all ";
        String createTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        Map<String, Object> womanMap = new HashMap<>();
        womanMap.put("messageId", messageId);
        womanMap.put("messageData", messageData);
        womanMap.put("createTime", createTime);
        // 推送消息，路由键为 topic.woman
        rabbitTemplate.convertAndSend("topicExchange", "topic.woman", womanMap);
        return "Send Successfully";
    }
}
```

生产者这边已经完事，先不急着运行

### ② Consumer

在 rabbitmq-consumer 项目上，创建 `TopicManReceiver.java`：

```java

@Component
@RabbitListener(queues = "Queu1") // 监听队列 1
public class TopicManReceiver {

    @RabbitHandler
    public void process(Map message) {
        System.out.println("TopicManReceiver消费者收到消息  : " + message.toString());
    }
    
}
```

再创建一个 `TopicTotalReceiver.java`：

```java
@Component
@RabbitListener(queues = "Queue2") // 监听队列 2
public class TopicTotalReceiver {
 
    @RabbitHandler
    public void process(Map message) {
        System.out.println("TopicTotalReceiver消费者收到消息  : " + message.toString());
    }
}

```

然后把 rabbitmq-provider，rabbitmq-consumer 两个项目都跑起来，先调用 `/sendTopicMessage1` 接口，推送消息 `topic.man`。可以看到两个监听消费者 receiver 都成功消费到了消息，因为这两个 recevier 监听的队列的绑定键都能与这条消息携带的路由键匹配上：

![](https://gitee.com/veal98/images/raw/master/img/20201125134624.png)

接下来调用接口 `/sendTopicMessage2`，推送消息 `topic.woman`。可以看到两个监听消费者只有 TopicTotalReceiver 成功消费到了消息：

![](https://gitee.com/veal98/images/raw/master/img/20201125134722.png)

## 3. 使用 Fanout 交换机

💡 `Fanout ` 交换机其实就是广播，无需配置路由键

### ① Provider

同样地，先在 rabbitmq-provider 项目上创建 `FanoutRabbitConfig.java`：

```java
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FanoutRabbitConfig {
 
    /**
     *  创建三个队列 ：fanout.A   fanout.B  fanout.C
     *  将三个队列都绑定在交换机 fanoutExchange 上
     *  因为是扇型交换机, 路由键无需配置,配置也不起作用
     */
    @Bean
    public Queue queueA() {
        return new Queue("fanout.A");
    }
 
    @Bean
    public Queue queueB() {
        return new Queue("fanout.B");
    }
 
    @Bean
    public Queue queueC() {
        return new Queue("fanout.C");
    }
 
    @Bean
    FanoutExchange fanoutExchange() {
        return new FanoutExchange("fanoutExchange");
    }
 
    @Bean
    Binding bindingExchangeA() {
        return BindingBuilder.bind(queueA()).to(fanoutExchange());
    }
 
    @Bean
    Binding bindingExchangeB() {
        return BindingBuilder.bind(queueB()).to(fanoutExchange());
    }
 
    @Bean
    Binding bindingExchangeC() {
        return BindingBuilder.bind(queueC()).to(fanoutExchange());
    }

```

写一个接口用于推送消息：

```java
    @GetMapping("/sendFanoutMessage")
    public String sendFanoutMessage() {
        String messageId = String.valueOf(UUID.randomUUID());
        String messageData = "message: testFanoutMessage ";
        String createTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        Map<String, Object> map = new HashMap<>();
        map.put("messageId", messageId);
        map.put("messageData", messageData);
        map.put("createTime", createTime);
        // 推送消息，无需设置路由键
        rabbitTemplate.convertAndSend("fanoutExchange", null, map);
        return "Send Successfully";
    }
```

### ② Consumer

```java
@Component
@RabbitListener(queues = "fanout.A") // 监听队列 fanout.A
public class FanoutReceiverA {
 
    @RabbitHandler
    public void process(Map message) {
        System.out.println("FanoutReceiverA消费者收到消息  : " +message.toString());
    }
 
}
```

```java
@Component
@RabbitListener(queues = "fanout.B") // 监听队列 fanout.B
public class FanoutReceiverB {
 
    @RabbitHandler
    public void process(Map message) {
        System.out.println("FanoutReceiverB消费者收到消息  : " + message.toString());
    }
 
}
```

```java
@Component
@RabbitListener(queues = "fanout.C") // 监听队列 fanout.C
public class FanoutReceiverC {
 
    @RabbitHandler
    public void process(Map message) {
        System.out.println("FanoutReceiverC消费者收到消息  : " + message.toString());
    }
 
}
```

最后将 rabbitmq-provider 和 rabbitmq-consumer 项目都跑起来，调用下接口 `/sendFanoutMessage` , 看看 rabbitmq-consumer 项目的控制台情况：

![](https://gitee.com/veal98/images/raw/master/img/20201125135257.png)

由于三个队列都绑定这个扇形交换机，所以三个消息接收类都监听到了这条消息。

## 4. 消息确认

以上三个常用的交换机的使用我们已经完毕了，那么接下来我们继续讲讲消息的回调，其实就是**消息确认（生产者推送消息成功，消费者接收消息成功）**。

### ① 生产者推送消息的消息确认机制

首先在 rabbitmq-provider 项目的 `application.yml` 文件上，加上消息确认的配置项：

<img src="https://gitee.com/veal98/images/raw/master/img/20201125140412.png" style="zoom:67%;" />

然后是配置相关的**消息确认回调函数**，`RabbitConfig.java`：

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;


@Configuration
public class RabbitConfig {

    @Bean
    public RabbitTemplate createRabbitTemplate(ConnectionFactory connectionFactory){
        RabbitTemplate rabbitTemplate = new RabbitTemplate();
        rabbitTemplate.setConnectionFactory(connectionFactory);
        // 设置开启 Mandatory,才能触发回调函数,无论消息推送结果怎么样都强制调用回调函数
        rabbitTemplate.setMandatory(true);

        rabbitTemplate.setConfirmCallback(new RabbitTemplate.ConfirmCallback() {
            @Override
            public void confirm(CorrelationData correlationData, boolean ack, String cause) {
                System.out.println("ConfirmCallback:     " + "相关数据：" + correlationData);
                System.out.println("ConfirmCallback:     " + "确认情况：" + ack);
                System.out.println("ConfirmCallback:     " + "原因：" + cause);
            }
        });

        rabbitTemplate.setReturnCallback(new RabbitTemplate.ReturnCallback() {
            @Override
            public void returnedMessage(Message message, int replyCode, String replyText, String exchange, String routingKey) {
                System.out.println("ReturnCallback:     " + "消息："+message);
                System.out.println("ReturnCallback:     " + "回应码："+replyCode);
                System.out.println("ReturnCallback:     " + "回应信息："+replyText);
                System.out.println("ReturnCallback:     " + "交换机："+exchange);
                System.out.println("ReturnCallback:     " + "路由键："+routingKey);
            }
        });

        return rabbitTemplate;
    }

}
```

可以看到上面写了两个回调函数，一个叫 `ConfirmCallback` ，一个叫 `RetrunCallback`；

❓ 那么以上这两种回调函数都是在什么情况会触发呢？

⭐ 先从总体的情况分析，**推送消息存在四种情况**：

- ① 消息推送到 server，但是在 server 里找不到交换机
- ② 消息推送到 server，找到交换机了，但是没找到队列
- ③ 消息推送到 sever，交换机和队列啥都没找到
- ④ 消息推送成功

那么我先写几个接口来分别测试和认证下以上4种情况，消息确认触发回调函数的情况：

#### Ⅰ 消息推送到 server，但是在 server 里找不到交换机

写个测试接口，把消息推送到名为 ‘`non-existent-exchange`’ 的交换机上（**这个交换机是没有创建没有配置的**）：

```java
    @GetMapping("/TestMessageAck")
    public String TestMessageAck() {
        String messageId = String.valueOf(UUID.randomUUID());
        String messageData = "message: non-existent-exchange test message ";
        String createTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        Map<String, Object> map = new HashMap<>();
        map.put("messageId", messageId);
        map.put("messageData", messageData);
        map.put("createTime", createTime);
        rabbitTemplate.convertAndSend("non-existent-exchange", "TestDirectRouting", map);
        return "ok";
    }
```

调用接口，查看 rabbitmq-provider项目的控制台输出情况：

```java
ConfirmCallback:     相关数据：null
ConfirmCallback:     确认情况：false
ConfirmCallback:     原因：channel error; protocol method: #method<channel.close>(reply-code=404, reply-text=NOT_FOUND - no exchange 'non-existent-exchange' in vhost 'JCcccHost', class-id=60, method-id=40)
```

😄 **结论： ① 这种情况触发的是 `ConfirmCallback` 回调函数。**

#### Ⅱ 消息推送到 server，找到交换机了，但是没找到队列 

我们**新增一个交换机，但是不给这个交换机绑定队列**，我来简单地在 DirectRabitConfig 里面新增一个直连交换机，名叫 ‘`lonelyDirectExchange`’，但没给它做任何绑定配置操作：

```java
    @Bean
    DirectExchange lonelyDirectExchange() {
        return new DirectExchange("lonelyDirectExchange");
    }
```

然后写个测试接口，把消息推送到名为‘`lonelyDirectExchange`’的交换机上（这个交换机是没有任何队列配置的）：

```java
    @GetMapping("/TestMessageAck2")
    public String TestMessageAck2() {
        String messageId = String.valueOf(UUID.randomUUID());
        String messageData = "message: lonelyDirectExchange test message ";
        String createTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        Map<String, Object> map = new HashMap<>();
        map.put("messageId", messageId);
        map.put("messageData", messageData);
        map.put("createTime", createTime);
        rabbitTemplate.convertAndSend("lonelyDirectExchange", "TestDirectRouting", map);
        return "ok";
    }
```

调用接口，查看 rabbitmq-provider 项目的控制台输出情况：

```java
ReturnCallback:     回应码：312
ReturnCallback:     回应信息：NO_ROUTE
ReturnCallback:     交换机：lonelyDirectExchange
ReturnCallback:     路由键：TestDirectRouting
    
ConfirmCallback:     相关数据：null
ConfirmCallback:     确认情况：true
ConfirmCallback:     原因：null
```

可以看到这种情况，两个函数都被调用了；

这种情况下，消息是推送成功到服务器了的，所以 `ConfirmCallback` 对消息确认情况是 true；

而在 `RetrunCallback` 回调函数的打印参数里面可以看到，消息是推送到了交换机成功了，但是在路由分发给队列的时候，找不到队列，所以报了错误 NO_ROUTE 。

**😄 结论：② 这种情况触发的是 `ConfirmCallback` 和 `RetrunCallback` 两个回调函数。**

#### Ⅲ 消息推送到 sever，交换机和队列啥都没找到 

这种情况其实一看就觉得跟 ① 很像，没错 ，**③ 和 ① 情况回调是一致的**，所以不做结果说明了。

**😄 结论： ③ 这种情况触发的是 `ConfirmCallback` 回调函数。**

#### Ⅳ 消息推送成功

按照正常调用之前消息推送的接口就行，就调用下 /`sendFanoutMessage` 接口，可以看到控制台输出：

```java
ConfirmCallback:     相关数据：null
ConfirmCallback:     确认情况：true
ConfirmCallback:     原因：null
```

**😄 结论： ④ 这种情况触发的是 `ConfirmCallback` 回调函数。**

### ② 消费者收到消息的消息确认机制

和生产者的消息确认机制不同，因为消息接收本来就是在监听消息，符合条件的消息就会消费下来。所以，消息接收的确认机制主要存在**三种**模式：

- 💥 **自动确认 `AcknowledgeMode.NONE`**， 这也是**默认**的消息确认情况。 

  **RabbitMQ 成功将消息发出后立即认为本次投递已经被正确处理，不管消费者端是否成功处理本次投递。**

  <u>所以这种情况如果消费端消费逻辑抛出异常，也就是消费端没有处理成功这条消息，那么就相当于丢失了消息。一般这种情况我们都是使用 try catch 捕捉异常后，打印日志用于追踪数据，这样找出对应数据再做后续处理。</u>

- 💥 **根据情况确认**， 这个不做介绍

- 💥 **手动确认 `AcknowledgeMode.MANUAL`** ， 这个比较关键，也是我们配置接收消息确认机制时，多数选择的模式。

  消费者收到消息后，手动调用 `basic.ack/basic.nack/basic.reject` ，RabbitMQ 收到这些消息后，才认为本次投递成功。

  - `basic.ack` 用于肯定确认 

  - `basic.nack` 用于否定确认（注意：这是AMQP 0-9-1的RabbitMQ扩展） 

    `channel.basicNack(deliveryTag, false, true)`：

    - 第一个参数依然是当前消息到的数据的唯一 id

    - 第二个参数是指是否针对多条消息；如果是 true，也就是说一次性针对当前通道的消息的 tagID 小于当前这条消息的，都拒绝确认

    - 第三个参数是指是否重新入列，也就是指不确认的消息是否重新丢回到队列里面去。

      **使用拒绝后重新入列这个确认模式要谨**慎，因为一般都是出现异常的时候，catch异常再拒绝入列。如果使用不当会导致一些每次都被你重入列的消息一直 消费-入列-消费-入列 这样循环，会导致消息积压。

  - `basic.reject` 用于否定确认，但与 `basic.nack` 相比有一个限制，即一次只能拒绝单条消息 

    `channel.basicReject(deliveryTag, true)`：拒绝消费当前消息。

    - 如果第二参数传入 true：就是将数据重新丢回队列里，那么下次还会消费这消息

      同样使用拒绝后重新入列这个确认模式要谨慎

    - 如果第二参数设置 false，就是告诉服务器，我已经知道这条消息数据了，因为一些原因拒绝它，而且服务器也把这个消息丢掉就行。 下次不想再消费这条消息了

💧 消费者端以上的 3 个方法都表示消息已经被正确投递，但是**只有 `basic.ack` 表示消息已经被正确处理。而 `basic.nack` , `basic.reject` 表示没有被正确处理**

<br>

接下来我们一起配置下，看看一般的消息接收 手动确认是怎么样的。

在消费者项目里，新建 `MessageListenerConfig.java`，添加相关的配置代码：

```java
import com.elegant.rabbitmqconsumer.receiver.MyAckReceiver;
import org.springframework.amqp.core.AcknowledgeMode;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
 
@Configuration
public class MessageListenerConfig {
 
    @Autowired
    private CachingConnectionFactory connectionFactory;
    @Autowired
    private MyAckReceiver myAckReceiver; //消息接收处理类
 
    @Bean
    public SimpleMessageListenerContainer simpleMessageListenerContainer() {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer(connectionFactory);
        container.setConcurrentConsumers(1);
        container.setMaxConcurrentConsumers(1);
        container.setAcknowledgeMode(AcknowledgeMode.MANUAL); // RabbitMQ 默认是自动确认，这里改为手动确认消息
        // 设置一个队列
        container.setQueueNames("DirectQueue");
        
        container.setMessageListener(myAckReceiver);
 
        return container;
    }
 
 
}
```

其中，对应的**手动确认消息监听类** `MyAckReceiver.java`（手动确认模式需要实现 `ChannelAwareMessageListener`）：

> 🚨 之前的相关监听器可以先注释掉，以免造成多个同类型监听器都监听同一个队列。

这里的获取消息转换，只作参考，如果报数组越界可以自己根据格式去调整

```java
import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.listener.api.ChannelAwareMessageListener;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;
 
@Component
public class MyAckReceiver implements ChannelAwareMessageListener {
 
    @Override
    public void onMessage(Message message, Channel channel) throws Exception {
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        try {
            // 因为传递消息的时候用的map传递,所以将Map从Message内取出需要做些处理
            String msg = message.toString();
            String[] msgArray = msg.split("'");//可以点进Message里面看源码,单引号之间的数据就是我们的map消息数据
            Map<String, String> msgMap = mapStringToMap(msgArray[1].trim(),3);
            String messageId=msgMap.get("messageId");
            String messageData=msgMap.get("messageData");
            String createTime=msgMap.get("createTime");
            System.out.println("  MyAckReceiver  messageId:" + messageId+"  messageData:" + messageData + "  createTime:" + createTime);
            System.out.println("消费的主题消息来自："+message.getMessageProperties().getConsumerQueue());
            channel.basicAck(deliveryTag, true); // 第二个参数，手动确认可以被批处理，当该参数为 true 时，则可以一次性确认 delivery_tag 小于等于传入值的所有消息
//			channel.basicReject(deliveryTag, true);// 第二个参数 true 消息会重新放回队列，所以需要自己根据业务逻辑判断什么时候使用拒绝
        } catch (Exception e) {
            channel.basicReject(deliveryTag, false);
            e.printStackTrace();
        }
    }
 
    // {key=value,key=value,key=value} 格式转换成map
    private Map<String, String> mapStringToMap(String str,int entryNum ) {
        str = str.substring(1, str.length() - 1);
        String[] strs = str.split(",",entryNum);
        Map<String, String> map = new HashMap<String, String>();
        for (String string : strs) {
            String key = string.split("=")[0].trim();
            String value = string.split("=")[1];
            map.put(key, value);
        }
        return map;
    }
}
```

这时，先调用接口` /sendDirectMessage`， 给直连交换机 `DirectExchange` 的队列 `DirectQueue` 推送一条消息，就可以看到监听器正常消费了下来

#### 多队列的手动确认

上述代码中，我们仅仅将直连交换机的队列 DirectQueue 变成手动确认了，接下来我们将多个队列也改成手动确认模式，而且不同队列实现不同的业务处理。

第一步就是往 `SimpleMessageListenerContainer` 里添加多个队列：

```java
// 设置一个队列
// container.setQueueNames("DirectQueue");

// 同时设置多个队列： 前提是队列都是必须已经创建存在的
container.setQueueNames("DirectQueue","DirectQueue2","DirectQueue3");

// 另一种设置多个队列的方法，使用 addQueues
container.setQueues(new Queue("DirectQueue",true));
container.addQueues(new Queue("DirectQueue2",true));
container.addQueues(new Queue("DirectQueue3",true));
```

然后我们的手动确认消息监听类 `MyAckReceiver.java` 就可以同时将上面设置到的队列的消息都消费下来。

**如果我们需要做不同的业务逻辑处理**，那么只需要 **根据消息来自的队列名进行区分处理 **即可，如：

```java
@Component
public class MyAckReceiver implements ChannelAwareMessageListener {
 
    @Override
    public void onMessage(Message message, Channel channel) throws Exception {
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        try {
            ..........
            
            if ("DirectQueue".equals(message.getMessageProperties().getConsumerQueue())){
                System.out.println("消费的消息来自的队列名为："+message.getMessageProperties().getConsumerQueue());
                System.out.println("消息成功消费到  messageId:"+messageId+"  messageData:"+messageData+"  createTime:"+createTime);
                System.out.println("执行DirectQueue中的消息的业务处理流程......");
                
            }
 
            if ("fanout.A".equals(message.getMessageProperties().getConsumerQueue())){
                System.out.println("消费的消息来自的队列名为："+message.getMessageProperties().getConsumerQueue());
                System.out.println("消息成功消费到  messageId:"+messageId+"  messageData:"+messageData+"  createTime:"+createTime);
                System.out.println("执行fanout.A中的消息的业务处理流程......");
 
            }
            
            channel.basicAck(deliveryTag, true);
            
        } catch (Exception e) {
            ..........
        }
    }
 
    // {key=value,key=value,key=value} 格式转换成map
    private Map<String, String> mapStringToMap(String str,int enNum) {
        ......
    }
}
```

OK，我们调用接口 `/sendDirectMessage` 和 `/sendFanoutMessage` 分别往不同队列推送消息，看看效果。

## 📚 References

- [Springboot 整合 RabbitMq ，用心看完这一篇就够了](https://blog.csdn.net/qq_35387940/article/details/100514134)