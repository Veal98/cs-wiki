



# 五、JdbcTemplate

---



JdbcTemplate 是 Spring 利用 AOP 思想封装的 JDBC  操作工具

## 1. 导入依赖和约束

```xml
<dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.6</version>
        </dependency>
    </dependencies>
```

## 2. 注解配置

首先需要创建数据库表和实体类

配置文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--配置JdbcTemplate-->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!-- 配置数据源-->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"></property>
        <property name="url" value="jdbc:mysql://localhost:3306/eesy"></property>
        <property name="username" value="root"></property>
        <property name="password" value="1234"></property>
    </bean>
</beans>
```

## 3. CRUD 操作

```java
/**
 * JdbcTemplate的CRUD操作
 */
public class JdbcTemplateDemo3 {

    public static void main(String[] args) {
        //1.加载配置文件，获取容器
        ApplicationContext ac = new ClassPathXmlApplicationContext("bean.xml");
        //2.获取对象
        JdbcTemplate jt = ac.getBean("jdbcTemplate",JdbcTemplate.class);
        //3.执行操作
        //保存
		jt.update("insert into account(name,money)values(?,?)","eee",3333f);
        //更新
		jt.update("update account set name=?,money=? where id=?","test",4567,7);
        //删除
		jt.update("delete from account where id=?",8);
        //查询所有
		List<Account> accounts = jt.query("select * from account where money > ?",new BeanPropertyRowMapper<Account>(Account.class),1000f);
		for(Account account : accounts){
	           System.out.println(account);
        }
        //查询一个（查询id=1）
		List<Account> accounts = jt.query("select * from account where id = ?",new BeanPropertyRowMapper<Account>(Account.class),1);
		//get(0)表示获得第一个
		System.out.println(accounts.isEmpty()?"没有内容":accounts.get(0));

        //查询返回一行一列（使用聚合函数，但不加group by子句）
        //第二个参数指定方法的返回类型
        Long count = jt.queryForObject("select count(*) from account where money > ?",Long.class,1000f);
        System.out.println(count);


    }
}
```

在查询时，如果使用了 `BeanPropertyRowMapper`，要求查出来的字段必须和 Bean 的属性名一一对应。



<br>



# 六、事务控制

---



Spring 中的事务主要是利用 AOP 思想，简化事务的配置，可以通过 XML 配置也可以通过注解配置

## 1. Xml 配置

### ① 导入依赖和约束

```xml
<dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>

        // 事务控制
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>

        // 事务控制是基于 AOP 的
        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>1.8.7</version>
        </dependency>
</dependencies>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">
</beans>
```

### ② 配置事务管理器 DataSourceTransactionManager

```java
<!-- 配置事务管理器 -->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <!-- 注入 DataSource --> 
    <property name="dataSource" ref="dataSource"></property>
</bean>
```

### ③ 配置事务的通知

使用 `tx:advice` 标签配置事务通知
属性：

- id：给事务通知起一个唯一标识
- transaction-manager：给事务通知提供一个事务管理器引用

```xml
<!-- 事务的配置 --> 
<tx:advice id="txAdvice" transaction-manager="transactionManager"> 
</tx:advice> 
```

### ④ 配置事务要处理的方法 

在 tx:advice 标签**内部** 配置事务要处理的方法

```xml
<!-- 配置事务的通知-->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <tx:method name="*" />
            <tx:method name="find*"/>
        </tx:attributes>
</tx:advice>
```

注意：一旦配置了方法名称规则后，service 中的方法一定要按照这里的名称规则来，否则事务配置不会生效

### ⑤ 配置 AOP

```xml
<!-- 配置aop-->
<aop:config>
    <!-- 配置切入点表达式-->
    <aop:pointcut id="pt1" expression="execution(* com.smallbeef.service.impl.*.*(..))" />
    <!--建立切入点表达式和事务通知的对应关系 -->
    <aop:advisor advice-ref="txAdvice" pointcut-ref="pt1" />
</aop:config>
```

## 2. 注解配置

- 在 xml 配置文件中开启 Spring 对注解事务的支持 （替代xml配置事务管理）

    ```xml
    <!-- 开启spring对注解事务的支持-->
    <tx:annotation-driven transaction-manager="transactionManager"></tx:annotation-driven>
    ```
    
    也可以在配置类中用注解 `@EnableTransactionManagement` 替换
    
- 在需要事务支持的地方（业务层）使用 `@Transactional` 注解 （替代xml配置事务的通知和事务要处理的方法）

    ```java
    @Service
    @Transactional(propagation= Propagation.SUPPORTS,readOnly=true)//只读型事务的配置
    public class AccountServiceImpl implements IAccountService{
    
        @Autowired
        private IAccountDao accountDao;
    
        @Override
        public Account findAccountById(Integer accountId) {
            return accountDao.findAccountById(accountId);
    
        }
    
        //读写型事务配置
        @Transactional(propagation= Propagation.REQUIRED,readOnly=false)
        @Override
        public void transfer(String sourceName, String targetName, Float money) {
            System.out.println("transfer....");
                //2.1根据名称查询转出账户
                Account source = accountDao.findAccountByName(sourceName);
                //2.2根据名称查询转入账户
                Account target = accountDao.findAccountByName(targetName);
                //2.3转出账户减钱
                source.setMoney(source.getMoney()-money);
                //2.4转入账户加钱
                target.setMoney(target.getMoney()+money);
                //2.5更新转出账户
                accountDao.updateAccount(source);
        }
    }
    ```

    该注解的属性和 xml 中的属性含义一致。

    该注解可以出现在接口上，类上和方法上。 

    - 出现接口上，表示该接口的所有实现类都有事务支持。 
    - 出现在类上，表示类中所有方法有事务支持 
    - 出现在方法上，表示该方法有事务支持。 

    以上三个位置的优先级：方法 > 类 > 接口 

<br>



# 📚 References

---



- 🐴 [视频 - Spring教程IDEA版-4天-2018黑马SSM-02](https://www.bilibili.com/video/BV1Sb411s7vP?from=search&seid=8030889577744089220)

  **课程配套百度网盘资源：**

  链接：https://pan.baidu.com/s/1BYSLOwvioeqm2RU38BZ9PA

  提取码：3z59

- 🥝 公众号 江南一点雨 相关教程
- 🍬 [Spring中@Value标签的使用详解](https://www.cnblogs.com/kingszelda/p/7261156.html)