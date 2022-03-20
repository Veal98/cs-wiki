# 🚀 快速上手 Spring Boot + Spring Data JPA

---

## 1. 什么是 Hibernate

**Hibernate 是一个对象关系映射（ORM）框架**，它对 JDBC 进行了非常轻量级的对象封装，**将 POJO 与数据库表建立映射关系**，是一个全自动的 ORM 框架，<u>Hibernate 可以自动生成SQL语句，自动执行，使得 Java 程序员可以随心所欲的使用对象编程思维来操纵数据库。</u>

> 💡 **对象关系映射（Object Relational Mapping，ORM）**：通过使用描述对象和数据库之间映射的元数据，将程序中的对象自动持久化到关系数据库中。本质就是将数据从一种形式转换到另外一种形式。

## 2. 什么是 JPA

**JPA(Java Persistence API)** 是Sun官方提出的 **Java 持久化 规范**。它为Java开发人员提供了一种对象/关联映射工具来管理Java应用中的关系数据。它的出现主要是为了简化现有的持久化开发工作和整合ORM技术

JPA规范 是在充分吸收了现有 Hibernate、TopLink 等 ORM 框架的基础上发展起来的，结束了现在 Hibernate、TopLink 等 ORM 框架各自为营的局面，具有易于使用，伸缩性强等优点。

🚨 **注意：JPA 是一种规范，不是具体的实现，所以不能直接使用，具体的实现还是各种支持 JPA  规范的 ORM 框架**。比如说下面这些框架都支持 JPA 规范：

- **Hibernate**（通常都使用 Hibernate）
- Batoo JPA
- DataNucleus (formerly JPOX)
- EclipseLink (formerly Oracle TopLink)
- IBM, for WebSphere Application Server
- ..........

🔗 JPA 规范与 ORM 框架的关系如下图： 

![](https://gitee.com/veal98/images/raw/master/img/20200822112719.png)

👍 使用 JPA 规范的优势在于：**开发者面向 JPA 规范的接口，但底层的 JPA 实现可以任意切换**。这样开发者可以避免为使用 Hibernate 学习一套ORM框架，为使用 TopLink 又要再学习一套ORM框架。

## 3. 什么是 Spring Data JPA

虽然 ORM 框架都实现了JPA规范，但是在不同的 ORM 框架之间切换仍然需要编写不同的代码

⚪ **Spring Data JPA 就是在 JPA 规范下提供了 Repository 层的实现**，使用哪一种 ORM 由你自己来决定。通过使用Spring Data JPA 能够方便的在不同 ORM 框架之间进行切换而不要更改代码。

<u>Spring Data JPA 让我们解脱了 DAO 层的操作，基本上所有 CRUD 都可以依赖于它来实现</u>。在实际的项目中，推荐使用 **Spring Data JPA + ORM 框架（如：hibernate）**完成操作，这样在切换不同的ORM框架时提供了极大的方便，同时也使数据库层操作更加简单，方便解耦

🚩 **Spring Boot 中使用的 JPA 实际上就是 Spring Data JPA**

<br>

⭐ 总结一下 **Hibernate、JPA、Spring Data JPA 之间的关系**

- JPA 是一套规范，内部是有接口和抽象类组成的。

- Hibernate 是一套成熟的ORM框架，而且 Hibernate 实现了 JPA 规范，所以也可以称 Hibernate 为JPA的一种实现方式。

  我们使用 JPA 的 API 编程，意味着站在更高的角度上看待问题（面向接口编程）

- Spring Data JPA 是 Spring 提供的一套对 JPA 操作更加高级的封装，是在 JPA 规范下的专门用来进行数据持久化的解决方案。

## 4. SpringBoot + SpringDataJPA + MySQL 简单实例

### ① 环境准备

- JDK 1.8
- Maven 3.x
- MySQL 5.x

### ② 新建项目并添加依赖

新建一个 SpringBoot 的 Web 项目，并添加如下依赖：

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version> <!--注意此处的大版本要和 MySQL 的大版本一致-->
</dependency>

<!-- Spring Data JPA-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

### ③ 全局配置文件

```properties
spring.mvc.view.prefix=/WEB-INF/jsp/
spring.mvc.view.suffix=.jsp
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/testjpa
spring.datasource.username=root
spring.datasource.password=root
# Mysql5.0+ 版本使用 com.mysql.jdbc.Driver
# 如果是8.0+的版本请改成 com.mysql.cj.jdbc.Driver
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
# 表示自动更新表结构，包括创建表（所以不手动新建表也是可以的）
spring.jpa.properties.hibernate.hbm2ddl.auto=update
```

### ④ 实体类 POJO

```java
@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "name")
    private String name;
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
```

- `@Entity` 注解表示这是个实体类
- `@Table(name = "category")` 表示这个类对应的表名是 `category` 
- `@Id` 表明主键
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` 表明自增长方式
- `@Column(name = id)` 表明对应的数据库字段名，如果不写则默认与字段名相同

### ⑤ DAO 层 ⭐ 

```java
public interface CategoryDAO extends JpaRepository<Category,Integer> {
}
```

<u>自定义 `CategoryDAO` 接口继承了 `JpaRepository`，并且提供泛型 `<Category,Integer>` 表示这个是针对 `Category` 类的DAO, `Integer`表示主键是 `Integer` 类型。</u>

JpaRepository 提供了一些基本的数据操作方法，例如保存，更新，删除，分页查询等，开发者也可以在接口中自己声明相关的方法，只需要方法名称符合规范即可，**在 Spring Data 中，只要按照既定的规范命名方法，Spring Data Jpa 就知道你想干嘛，这样就不用我们手动写 SQL 了**，那么规范是什么呢？参考下图：

<img src="https://gitee.com/veal98/images/raw/master/img/20200822114451.png" style="zoom: 50%;" />

当然，这种方法命名主要是针对查询，但是一些特殊需求，可能并不能通过这种方式解决，例如想要查询 id 最大的 Category，这时就需要开发者自定义查询 SQL 了：

```java
public interface CategoryDAO extends JpaRepository<Category,Integer> {
    @Query(value = "select * from category where id = (select max(id) from category)",nativeQuery = true)
    Category maxIdCategory();
}
```

### ⑥ Controller 层

定义完 Dao 之后，接下来就可以将 Dao 注入到 Controller 中进行测试了(**这里为了省事，就没有提供 Service 了，直接将 Dao 注入到 Controller 中**)。

```java
@Controller
public class CategoryController {
    @Autowired
    CategoryDAO categoryDAO;
	
    // 测试 JPA 自带查询
    @GetMapping("/listCategory")
    public String listCategory(Model model) throws Exception {
        List<Category> list = categoryDAO.findAll();
        model.addAttribute("list", list);
        return "listCategory"; //  返回listCategory.jsp 界面
    }
	
    // 测试自定义查询
    @GetMapping("/test")
    public void test() {
        Category category = categoryDAO.maxIdCategory();
        System.out.println(category);
    }
}
```

### ⑦ 前端界面

新建如下目录，并添加 `listCategory.jsp`：

![](https://gitee.com/veal98/images/raw/master/img/20200822120746.png)

```html
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<table align='center' border='1' cellspacing='0'>
    <tr>
        <td>id</td>
        <td>name</td>
    </tr>
    <c:forEach items="${list}" var="c" varStatus="st">
        <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
        </tr>
    </c:forEach>
</table>
```

### ⑧ 启动项目

启动项目之后，数据库表 `category` 会被自动创建，我们插入几条数据：

```sql
insert into category_ values(null,'category 1');
insert into category_ values(null,'category 2');
insert into category_ values(null,'category 3');
insert into category_ values(null,'category 4');
```

访问界面：

![](https://gitee.com/veal98/images/raw/master/img/20200822120950.png)

## 📚 References

- [JPA 和 SpringData JPA 简介](https://blog.csdn.net/android_bar/article/details/81040580)
- [谈 hibernate，jpa 与 spring data jpa 三者之间的关系](https://blog.csdn.net/qq_41300350/article/details/89736649)
- [springBoot+JPA+mysql8.0.15快速入门教程](https://blog.csdn.net/Eknaij/article/details/88864902