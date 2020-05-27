# Java SE 和 Java EE 的区别

---

## 1.JavaSE（Java Standard Edition）标准版
Java SE 以前称为 J2SE，定位在个人计算机使用，用来开发C/S架构软件。它允许开发和部署在桌面、服务器、嵌入式环境和实时环境中使用的 Java 应用程序。Java SE 包含了支持 Java Web 服务开发的类，并为 Java EE提供基础。

![](https://gitee.com/veal98/images/raw/master/img/20200428122205.png)



## 2.JavaEE(Java Platform Enterprise Edition) 企业版
Java EE,以前称为 J2EE，定位在服务器端应用。企业版本帮助开发和部署可移植、健壮、可伸缩且安全的服务器端 Java 应用程序。Java EE 是在 Java SE 的基础上构建的，它提供 Web 服务、组件模型、管理和通信 API，可以用来实现企业级的面向服务体系结构（service-oriented architecture，SOA）和 Web 2.0 应用程序。 具有一些更加便捷的应用框架，例如我们常说的SSM框架等

> 图片来源: https://www.cnblogs.com/lsgxeva/p/10183606.html

![](https://img-blog.csdnimg.cn/2020041123001830.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FzdGFkeQ==,size_16,color_FFFFFF,t_70)

## 3. Java Web

很多时候，javaweb与javaee是混用的，两者的概念并不能准确区分。**可以粗略地认为JavaWeb就是JavaEE的一部分**

> 图片来源：https://www.cnblogs.com/lsgxeva/p/10183606.html

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200411230216397.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0FzdGFkeQ==,size_16,color_FFFFFF,t_70)

## 4. 三者关系图

<img src="https://gitee.com/veal98/images/raw/master/img/20200428123117.png" style="zoom: 50%;" />

---

# 📚 References

- 🏓 [JavaSE、JavaEE和JavaWeb的区别与联系](https://blog.csdn.net/Astady/article/details/105461846?depth_1-utm_source=distribute.pc_relevant.none-task-blog-OPENSEARCH-2&utm_source=distribute.pc_relevant.none-task-blog-OPENSEARCH-2)