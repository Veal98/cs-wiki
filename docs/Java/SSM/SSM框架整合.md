# 🚀 SSM 框架整合 — 高级案例

---

**整合说明**：使用 Spring 去整合另外两个框架，选择XML + 注解的方式 

<img src="https://gitee.com/veal98/images/raw/master/img/20200524205211.png" style="zoom:80%;" />

👣 **Outline**：

- Spring 接管 service 层

- Mybatis 接管 Dao 层 和 Bean 层

- SpringMVC 接管 Controller 层

**项目效果**：

项目包含学生信息的增删改查功能以及分页功能，最终效果如下图所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20200527212652.png" style="zoom:80%;" />

![](https://gitee.com/veal98/images/raw/master/img/20200527212729.png)

**项目源码 + 目录结构**

- 项目目录结构如下图所示：

  <img src="https://gitee.com/veal98/images/raw/master/img/20200527212933.png"  />



- 🎪 项目源码存放 Github，需要自取：[https://github.com/Veal98/SSM_StudentManager](https://github.com/Veal98/SSM_StudentManager)

## 一、搭建Spring环境 
### 1. 新建Maven的web工程
main 文件夹下建立 java 和 src 文件夹，并分别设置为 Source root 和 Resources root

![](https://gitee.com/veal98/images/raw/master/img/20200705214940.png)

### 2. pom导入依赖

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <!--版本锁定-->
    <spring.version>5.0.2.RELEASE</spring.version> 
    <slf4j.version>1.6.6</slf4j.version>
    <log4j.version>1.2.12</log4j.version>
    <mysql.version>5.1.6</mysql.version>
    <mybatis.version>3.4.5</mybatis.version>
  </properties>

  <dependencies>

    <!-- spring -->
    <dependency>
      <!--AOP-->
      <groupId>org.aspectj</groupId>
      <artifactId>aspectjweaver</artifactId>
      <version>1.6.8</version>
    </dependency>

    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-aop</artifactId>
      <version>${spring.version}</version>
    </dependency>

    <dependency>
      <!--context容器-->
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>${spring.version}</version>
    </dependency>

    <dependency>
      <!--web相关-->
      <groupId>org.springframework</groupId>
      <artifactId>spring-web</artifactId>
      <version>${spring.version}</version>
    </dependency>

    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>${spring.version}</version>
    </dependency>

    <dependency>
      <!--单元测试-->
      <groupId>org.springframework</groupId>
      <artifactId>spring-test</artifactId>
      <version>${spring.version}</version>
    </dependency>

    <dependency>
      <!--事务控制-->
      <groupId>org.springframework</groupId>
      <artifactId>spring-tx</artifactId>
      <version>${spring.version}</version>
    </dependency>

    <dependency>
      <!--jdbc模板技术-->
      <groupId>org.springframework</groupId>
      <artifactId>spring-jdbc</artifactId>
      <version>${spring.version}</version>
    </dependency>

    <dependency>
      <!--单元测试-->
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <scope>compile</scope>
    </dependency>

    <dependency>
      <!--mysql驱动-->
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>${mysql.version}</version>
    </dependency>

    <dependency>
      <!--servlet-->
      <groupId>javax.servlet</groupId>
      <artifactId>servlet-api</artifactId>
      <version>2.5</version>
      <scope>provided</scope>
    </dependency>

    <dependency>
      <!--jsp-->
      <groupId>javax.servlet.jsp</groupId>
      <artifactId>jsp-api</artifactId>
      <version>2.0</version>
      <scope>provided</scope>
    </dependency>

    <dependency>
      <!--jstl-->
      <groupId>jstl</groupId>
      <artifactId>jstl</artifactId>
      <version>1.2</version>
    </dependency>

    <!-- 日志 -->
    <dependency>
      <groupId>log4j</groupId>
      <artifactId>log4j</artifactId>
      <version>${log4j.version}</version>
    </dependency>

    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-api</artifactId>
      <version>${slf4j.version}</version>
    </dependency>

    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-log4j12</artifactId>
      <version>${slf4j.version}</version>
    </dependency>
    <!-- end -->

    <dependency>
      <!--mybatis-->
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis</artifactId>
      <version>${mybatis.version}</version>
    </dependency>


    <dependency>
      <!--mybatis-spring 整合-->
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis-spring</artifactId>
      <version>1.3.0</version>
    </dependency>

    <dependency>
      <!--连接池-->
      <groupId>c3p0</groupId>
      <artifactId>c3p0</artifactId>
      <version>0.9.1.2</version>
        <type>jar</type>
        <scope>compile</scope>
    </dependency>

  </dependencies>
```

### 3. 创建数据库表

```sql
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `sex` varchar(255) NOT NULL,
  `birthday` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
```

### 4. 编写 Bean + Dao + Service
**Bean** （数据库相关（Bean/Dao 都交给Mybatis管理））

```java
public class Student {

    private int id;
    private int student_id;
    private String name;
    private int age;
    private String sex;
    private Date birthday;

    public Student() {
    }

    public Student(int id, int student_id, String name, int age, String sex, Date birthday) {
        this.id = id;
        this.student_id = student_id;
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.birthday = birthday;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getStudent_id() {
        return student_id;
    }

    public void setStudent_id(int student_id) {
        this.student_id = student_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

}
```



**Dao层无须实现接口，交给Mabatis来做**

```java
@Repository
public interface StudentDao {
    /**
     * 获取学生总数
     * @return
     */
    int getTotal();

    /**
     * 添加一个学生
     * @param student
     */
    void addStudent(Student student);

    /**
     * 根据 id 删除一个人学生
     * @param id
     */
    void deleteStudent(int id);

    /**
     * 修改一个学生信息
     * @param student
     */
    void updateStudent(Student student);

    /**
     * 根据 id 获取一个学生信息
     * @param id
     * @return
     */
    Student getStudent(int id);

    /**
     * 查询从start位置开始的count条数据
     */
    List<Student> list(int start, int count);
}
```



⭐ **Service 需要实现接口**（Service 层由 Spring 管理），在 Service 中注入 Dao 对象

```java
@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    StudentDao studentDao;

    @Override
    public int getTotal() {
        return studentDao.getTotal();
    }

    @Override
    public void addStudent(Student student) {
        studentDao.addStudent(student);
    }

    @Override
    public void deleteStudent(int id) {
        studentDao.deleteStudent(id);
    }

    @Override
    public void updateStudent(Student student) {
        studentDao.updateStudent(student);
    }

    @Override
    public Student getStudent(int id) {
        return studentDao.getStudent(id);
    }

    @Override
    public List<Student> list(int start, int count) {
        return studentDao.list(start, count);
    }
}
```

**Controller**（交给 SpringMVC 管理）

```java
@Controller
public class StudentController {
}
```

### 5. 编写Spring配置文件
在resources文件夹下新建 `spring-mybatis.xml` 文件（我们将 mybatis 的配置也写在该文件中，此处我们只列出 Spring 所需要的配置）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context" xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd">

  <!-- Spring 接管 service, 扫描 service 包下所有使用注解的类型 -->
  <context:component-scan base-package="com.smallbeef.service"/>
```



## 二、搭建Spring+SpringMVC环境
### 1. web.xml 中配置前端控制器、过滤器、监听Spring配置文件，并加载SpringMVC配置文件

```xml
<web-app version="2.4"
         xmlns="http://java.sun.com/xml/ns/j2ee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">

  <!--解决中文乱码的过滤器，一定要放在所有过滤器的前面-->
  <filter>
    <filter-name>characterEncodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
      <param-name>encoding</param-name>
      <param-value>UTF-8</param-value>
    </init-param>
    <init-param>
      <!--强制request编码为utf8-->
      <param-name>forceRequestEncoding</param-name>
      <param-value>true</param-value>
    </init-param>
    <init-param>
      <!--强制response编码为utf8-->
      <param-name>forceResponseEncoding</param-name>
      <param-value>true</param-value>
    </init-param>
  </filter>
  <filter-mapping>
    <filter-name>characterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
  </filter-mapping>

  <!--配置spring的监听器,
  该监听器默认加载WEB-INF目录下的applicationContext.xml的配置文件，所以我们需要自行配置路径-->
  <listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
  </listener>
  <!--配置加载路径的配置文件-->
  <context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:spring-mybatis.xml</param-value>
  </context-param>

  <!--配置前端控制器：服务器启动加载，同时加载进springmvc的配置文件-->
  <servlet>
    <servlet-name>dispatcherServlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <!--配置初始化参数，加载springmvc的配置文件-->
    <init-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>classpath:springmvc.xml</param-value>
    </init-param>
    <!--服务器启动的时候，让DispatcherServlet对象创建-->
    <load-on-startup>1</load-on-startup>
  </servlet>
  <servlet-mapping>
    <servlet-name>dispatcherServlet</servlet-name>
    <!--匹配所有请求-->
    <url-pattern>/</url-pattern>
  </servlet-mapping>
    
  <!--设置启动页为 listStudent.jsp-->
  <servlet-mapping>
    <servlet-name>dispatcherServlet</servlet-name>
    <url-pattern>/listStudent.jsp</url-pattern>
  </servlet-mapping>
  <!--设置启动页-->
  <welcome-file-list>
    <welcome-file>listStudent.jsp</welcome-file>
  </welcome-file-list>
</web-app>
```

> SpringMVC 的默认启动页是 WEB-INF 文件夹下的 index.jsp 文件，此处我们修改默认启动页为 resources 文件夹下的 listStudent.jsp 文件，需要在 web.xml 中添加配置：
>
> ```xml
>  <!--设置启动页为 listStudent.jsp-->
>   <servlet-mapping>
>     <servlet-name>dispatcherServlet</servlet-name>
>     <url-pattern>/listStudent.jsp</url-pattern>
>   </servlet-mapping>
>   <!--设置启动页-->
>   <welcome-file-list>
>     <welcome-file>listStudent.jsp</welcome-file>
>   </welcome-file-list>
> ```

### 2. 编写SpringMVC配置文件

在 resources 文件夹下新建 `springmvc.xml` 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/mvc
       http://www.springframework.org/schema/mvc/spring-mvc-3.0.xsd">

    <!-- SpringMVC接管controller层，扫描web相关的bean -->
    <context:component-scan base-package="com.smallbeef.controller"/>

    <!-- 开启SpringMVC注解模式 -->
    <mvc:annotation-driven/>

    <!--设置静态资源不过滤-->
<!--    <mvc:resources mapping="/css/**" location="/css/"></mvc:resources>-->
<!--    <mvc:resources mapping="/images/**" location="/images/"></mvc:resources>-->
<!--    <mvc:resources mapping="/js/**" location="/js/"></mvc:resources>-->

    <!-- 配置视图解析器 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
        <!--jsp文件所在的目录-->
        <property name="prefix" value="/WEB-INF/pages/"/>
        <!--文件后缀名-->
        <property name="suffix" value=".jsp"/>
    </bean>
</beans>
```

### 3. 编写 Controller

⭐ **在 Controller 中注入 Service 对象**

```java
@Controller
public class StudentController {

    @Autowired
    private StudentService studentService;

    /**
     * 增加一个学生信息
     * @param request
     * @param response
     * @return
     */
    @RequestMapping("/addStudent")
    public String addStudent(HttpServletRequest request, HttpServletResponse response){
        Student student = new Student();

        // 获取前端传值
        int studentId = Integer.parseInt(request.getParameter("student_id"));
        String name = request.getParameter("name");
        int age = Integer.parseInt(request.getParameter("age"));
        String sex = request.getParameter("sex");
        Date birthday = null;
        // 将 String 类型的日期按照 yyyy-MM-dd 的格式转换为 java.util.Date 类
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            birthday = simpleDateFormat.parse(request.getParameter("birthday"));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        student.setStudent_id(studentId);
        student.setName(name);
        student.setAge(age);
        student.setSex(sex);
        student.setBirthday(birthday);

        studentService.addStudent(student);
        return "redirect:listStudent";
    }

    /**
     * 根据 id 删除一个学生信息
     * @param id
     * @return
     */
    @RequestMapping("/deleteStudent")
    public String deleteStudent(int id){
        studentService.deleteStudent(id);
        return "redirect:listStudent";
    }


    /**
     * 修改一个学生信息,进入修改界面editStudent后再调用
     * @param request
     * @param response
     * @return
     */
    @RequestMapping("/updateStudent")
    public String updateStudent(HttpServletRequest request, HttpServletResponse response){
        Student student = new Student();

        // 获取前端传值
        int studentId = Integer.parseInt(request.getParameter("student_id"));
        String name = request.getParameter("name");
        int age = Integer.parseInt(request.getParameter("age"));
        String sex = request.getParameter("sex");
        Date birthday = null;
        // 将 String 类型的日期按照 yyyy-MM-dd 的格式转换为 java.util.Date 类
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            birthday = simpleDateFormat.parse(request.getParameter("birthday"));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        student.setStudent_id(studentId);
        student.setName(name);
        student.setAge(age);
        student.setSex(sex);
        student.setBirthday(birthday);

        studentService.updateStudent(student);
        return "redirect:listStudent";
    }

    /**
     * 分页显示学生信息
     */
    @RequestMapping("/listStudent")
    public String listStudent(HttpServletRequest request, HttpServletResponse response) {

        // 获取分页参数
        int start = 0;
        int count = 6;

        try {
            start = Integer.parseInt(request.getParameter("page.start"));
            count = Integer.parseInt(request.getParameter("page.count"));
        } catch (Exception e) {
        }

        // 创建分页模型
        Page page = new Page(start, count);

        // 按照页码查询学生信息
        List<Student> students = studentService.list(page.getStart(), page.getCount());
        int total = studentService.getTotal();
        page.setTotal(total);

        // 将查询出来的学生信息放在域中
        request.setAttribute("students", students);
        request.setAttribute("page", page);

        return "listStudent";
    }

    /**
     * 用于修改学生信息界面的信息回显
     * @param id
     * @return
     */
    @RequestMapping("/editStudent")
    public ModelAndView editStudent(int id){
        // 创建一个模型视图对象
        ModelAndView mv = new ModelAndView();
        // 查询学生信息
        Student student = studentService.getStudent(id);
        // 将数据放置到 ModelAndView 对象视图中
        mv.addObject("student",student);
        // 放入 jsp 界面
        mv.setViewName("editStudent");
        return mv;
    }
}
```

### 4. 分页模型 Page

在 util 包中 新建文件 Page.java

```java
public class Page {
    int start;      // 开始数据
    int count;      // 每一页的数量
    int total;      // 总共的数据量

    public Page() {
    }

    public Page(int start, int count, int total) {
        this.start = start;
        this.count = count;
        this.total = total;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public Page(int start, int count) {
        super();
        this.start = start;
        this.count = count;
    }
	
    // 是否有上一页
    public boolean isHasPreviouse(){
        if(start==0)
            return false;
        return true;

    }
    //是否有下一页
    public boolean isHasNext(){
        if(start==getLast())
            return false;
        return true;
    }
	//获取总页数
    public int getTotalPage(){
        int totalPage;
        // 假设总数是50，是能够被5整除的，那么就有10页
        if (0 == total % count)
            totalPage = total /count;
            // 假设总数是51，不能够被5整除的，那么就有11页
        else
            totalPage = total / count + 1;

        if(0==totalPage)
            totalPage = 1;
        return totalPage;

    }
	//获取最后一页页数
    public int getLast(){
        int last;
        // 假设总数是50，是能够被5整除的，那么最后一页的开始就是40
        if (0 == total % count)
            last = total - count;
            // 假设总数是51，不能够被5整除的，那么最后一页的开始就是50
        else
            last = total - total % count;

        last = last<0?0:last;
        return last;
    }
}

```



### 4. 前端界面

**listStudent.jsp：学生信息显示 + 增加学生 界面**

```jsp
<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8" language="java"
         pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>

    <%-- 引入JQ和Bootstrap --%>
    <!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
    <script src="https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js"></script>
    <!-- 新 Bootstrap 核心 CSS 文件 -->
    <link href="https://cdn.staticfile.org/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
    <script src="https://cdn.staticfile.org/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <title>学生管理页面 - 首页</title>
</head>

<body>
<div style="width:600px;height: 600px;position: absolute;left:50%;top:50%;margin-left:-300px;margin-top:-300px;">
    <h3 style="text-align: center">SSM整合实例 —— CRUD基本操作</h3>
    <div class="listDIV" >
        <table class="table table-striped table-bordered table-hover">
            <thead>
            <tr class="success">
                <th>学号</th>
                <th>姓名</th>
                <th>年龄</th>
                <th>性别</th>
                <th>出生日期</th>

                <th>编辑</th>
                <th>删除</th>
            </tr>
            </thead>

            <tbody>
            <c:forEach items="${students}" var="s" varStatus="status">
                <tr>
                    <td>${s.student_id}</td>
                    <td>${s.name}</td>
                    <td>${s.age}</td>
                    <td>${s.sex}</td>
                    <td>${s.birthday}</td>
                    <%--修改学生信息--%>
                    <td><a href="/editStudent?id=${s.id}"><span class="glyphicon glyphicon-edit"></span> </a></td>
                    <%--删除学生信息--%>
                    <td><a href="/deleteStudent?id=${s.id}"><span class="glyphicon glyphicon-trash"></span> </a></td>
                </tr>
            </c:forEach>

            </tbody>
        </table>
    </div>

    <nav class="pageDIV" style="text-align: center;">
        <ul class="pagination">
            <li <c:if test="${!page.hasPreviouse}">class="disabled"</c:if>>
                <a href="?page.start=0">
                    <span>«</span>
                </a>
            </li>

            <li <c:if test="${!page.hasPreviouse}">class="disabled"</c:if>>
                <a href="?page.start=${page.start-page.count}">
                    <span>‹</span>
                </a>
            </li>

            <c:forEach begin="0" end="${page.totalPage-1}" varStatus="status">

                <c:if test="${status.count*page.count-page.start<=30 && status.count*page.count-page.start>=-10}">
                    <li <c:if test="${status.index*page.count==page.start}">class="disabled"</c:if>>
                        <a
                                href="?page.start=${status.index*page.count}"
                                <c:if test="${status.index*page.count==page.start}">class="current"</c:if>
                        >${status.count}</a>
                    </li>
                </c:if>
            </c:forEach>

            <li <c:if test="${!page.hasNext}">class="disabled"</c:if>>
                <a href="?page.start=${page.start+page.count}">
                    <span>›</span>
                </a>
            </li>
            <li <c:if test="${!page.hasNext}">class="disabled"</c:if>>
                <a href="?page.start=${page.last}">
                    <span>»</span>
                </a>
            </li>
        </ul>
    </nav>
	
    <div class="addDIV" style="width: 300px;margin: 0 auto;">
        <div class="panel panel-success">
            <div class="panel-heading">
                <h3 class="panel-title">增加学生</h3>
            </div>
            <div class="panel-body">

                <form method="post" action="/addStudent" role="form">
                    <table class="addTable">
                        <tr>
                            <td>学号：</td>
                            <td><input type="text" name="student_id" id="student_id" placeholder="请在这里输入学号"></td>
                        </tr>
                        <tr>
                            <td>姓名：</td>
                            <td><input type="text" name="name" id="name" placeholder="请在这里输入名字"></td>
                        </tr>
                        <tr>
                            <td>年龄：</td>
                            <td><input type="text" name="age" id="age" placeholder="请在这里输入年龄"></td>
                        </tr>
                        <tr>
                            <td>性别：</td>
                            <td><input type="radio" class="radio radio-inline" name="sex" value="男"> 男
                                <input type="radio" class="radio radio-inline" name="sex" value="女"> 女
                            </td>
                        </tr>
                        <tr>
                            <td>出生日期：</td>
                            <td><input type="date" name="birthday" id="birthday" placeholder="请在这里输入出生日期"></td>
                        </tr>
                        <tr class="submitTR">
                            <td colspan="2" align="center">
                                <button type="submit" class="btn btn-success">提 交</button>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>
</div>
</body>
</html>
```



**editStudent.jsp：修改学生信息界面**

修改学生信息界面 和 增加学生信息 基本如出一辙，只不过修改学生界面多了信息回显的功能。在 `input` 框中我们通过 EL 表达式进行信息回显, 比如：

```jsp
value="${student.age}"
```

我们在 controller 的方法 `editStudent` 中 <u>将通过 id 查询到的 student 对象放入 ModelAndView 中</u>，此处我们通过 EL 表达式取出其具体的值

详细代码如下：

```jsp
<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8" language="java"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>

    <%-- 引入JQ和Bootstrap --%>
    <!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
    <script src="https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js"></script>
    <!-- 新 Bootstrap 核心 CSS 文件 -->
    <link href="https://cdn.staticfile.org/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
    <script src="https://cdn.staticfile.org/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>

    <title>学生管理页面 - 编辑页面</title>
</head>

<body>

<div class="editDIV" style="width:300px;margin:0 auto;">

    <div class="panel panel-success">
        <div class="panel-heading">
            <h3 class="panel-title">修改学生</h3>
        </div>
        <div class="panel-body">

            <form method="post" action="/addStudent" role="form">
                <table class="addTable">
                    <tr>
                        <td>学号：</td>
                        <td><input type="text" name="student_id" id="student_id" value="${student.student_id}"></td>
                    </tr>
                    <tr>
                        <td>姓名：</td>
                        <td><input type="text" name="name" id="name" value="${student.name}"></td>
                    </tr>
                    <tr>
                        <td>年龄：</td>
                        <td><input type="text" name="age" id="age" value="${student.age}"></td>
                    </tr>
                    <tr>
                        <td>性别：</td>
                        <td><input type="radio" class="radio radio-inline" name="sex" value="男"> 男
                            <input type="radio" class="radio radio-inline" name="sex" value="女"> 女
                        </td>
                    </tr>
                    <tr>
                        <td>出生日期：</td>
                        <td><input type="date" name="birthday" id="birthday" value="${student.birthday} placeholder="请在这里输入出生日期"></td>
                    </tr>
                    <tr class="submitTR">
                        <td colspan="2" align="center">
                            <%--设置隐藏域，根据 id 进行发送数据--%>
                            <input type="hidden" name = "id" value = ${student.id}>
                            <button type="submit" class="btn btn-success">提 交</button>
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    </div>
</div>

</body>
</html>
```




## 三、搭建Spring+SpringMVC+Mybatis 环境
### 1. 编写Mybatis全局配置文件
对于 Mybatis 的配置，我们将其与 Spring 的配置放在一个文件中：`spring-mybatis.xml`，Spring 接管 MyBatis 的 Session 工厂

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context" xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd">
	
  <!-- Spring 配置 -->
  <!-- Spring接管service, 扫描service包下所有使用注解的类型 -->
  <context:component-scan base-package="com.smallbeef.service"/>

  <!-- Mybatis 配置 -->  
  <!-- 配置数据库相关参数properties的属性：${url} -->
  <context:property-placeholder location="classpath:jdbc.properties"/>

  <!-- c3p0 数据库连接池 -->
  <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
    <property name="driverClass" value="${jdbc.driver}"/>
    <property name="jdbcUrl" value="${jdbc.url}"/>
    <property name="user" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
    <property name="maxPoolSize" value="${c3p0.maxPoolSize}"/>
    <property name="minPoolSize" value="${c3p0.minPoolSize}"/>
    <property name="autoCommitOnClose" value="${c3p0.autoCommitOnClose}"/>
    <property name="checkoutTimeout" value="${c3p0.checkoutTimeout}"/>
    <property name="acquireRetryAttempts" value="${c3p0.acquireRetryAttempts}"/>
  </bean>

  <!-- 配置SqlSessionFactory对象 -->
  <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <!-- 注入数据库连接池 -->
    <property name="dataSource" ref="dataSource"/>
    <!-- Mybaits接管bean层，扫描 bean包 使用别名 -->
    <property name="typeAliasesPackage" value="com.smallbeef.bean"/>
    <!-- 扫描sql配置文件:mapper需要的xml文件 -->
    <property name="mapperLocations" value="classpath:mapper/*.xml"/>
  </bean>

  <!-- Mybatis接管dao层, 配置扫描Dao接口包，动态实现Dao接口，注入到spring容器中 -->
  <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <!-- 注入sqlSessionFactory -->
    <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
    <!-- 给出需要扫描Dao接口包 -->
    <property name="basePackage" value="com.smallbeef.dao"/>
  </bean>

  <!-- 配置事务管理器 -->
  <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <!-- 注入数据库连接池 -->
    <property name="dataSource" ref="dataSource"/>
  </bean>

  <!-- 配置基于注解的声明式事务 -->
  <tx:annotation-driven transaction-manager="transactionManager"/>
</beans>
```

### 2. 配置 c3p0 连接池

在 resources 文件夹下新建 `jdbc.properties`

```properties
jdbc.driver=com.mysql.jdbc.Driver
#数据库地址
jdbc.url=jdbc:mysql://localhost:3306/student?useUnicode=true&characterEncoding=utf8
#用户名
jdbc.username=root
#密码
jdbc.password=root
#最大连接数
c3p0.maxPoolSize=30
#最小连接数
c3p0.minPoolSize=10
#关闭连接后不自动commit
c3p0.autoCommitOnClose=false
#获取连接超时时间
c3p0.checkoutTimeout=10000
#当获取连接失败重试次数
c3p0.acquireRetryAttempts=2
```

### 3. 编写 Mapper 映射文件
在 resources 文件夹下新建 mapper.studentDao.xml 文件：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.smallbeef.dao.StudentDao">

    <!--int getTotal(); 获取学生总个数-->
    <select id="getTotal" resultType="int">
        SELECT COUNT(*) FROM student
    </select>

    <!--void addStudent(Student student); 增加一个学生-->
    <insert id="addStudent" parameterType="Student">
        INSERT INTO student VALUES(NULL, #{student_id}, #{name}, #{age}, #{sex}, #{birthday})
    </insert>

    <!--void deleteStudent(int id); 删除一个学生-->
    <delete id="deleteStudent" parameterType="int">
        DELETE FROM student WHERE id = #{id}
    </delete>

    <!--void updateStudent(Student student); 修改一个学生信息-->
    <update id="updateStudent" parameterType="Student">
        UPDATE student SET student_id = #{student_id}, name = #{name},
        age = #{age}, sex = #{sex}, birthday = #{birthday} WHERE id = #{id}
    </update>

    <!--Student getStudent(int id); 根据 id 查询一个学生信息-->
    <select id="getStudent" resultMap="student" parameterType="int">
        SELECT * FROM student WHERE id = #{id}
    </select>

    <resultMap id="student" type="student">
        <id column="id" property="id"/>
        <result column="student_id" property="student_id"/>
        <result column="name" property="name"/>
        <result column="age" property="age"/>
        <result column="sex" property="sex"/>
        <result column="birthday" property="birthday" javaType="java.sql.Date"/>
    </resultMap>
    <!--List<Student> list(int start, int count); 查询从start位置开始的count条数据-->
    <select id="list" resultMap="student">
        SELECT * FROM student ORDER BY student_id asc limit #{param1}, #{param2}
    </select>
</mapper>
```

## 📚 References

- 😁 [视频 - SpringMVC_黑马](https://www.bilibili.com/video/av47953244/?spm_id_from=333.788.b_636f6d6d656e74.19)

  **课程配套百度网盘资源：**

  链接：https://pan.baidu.com/s/1bH-d1yBugAr0DjGzx7DGIA

  提取码：nsct
  
- 👤 [学生管理系统（SSM简易版）总结](https://www.jianshu.com/p/6a594fbea51d)