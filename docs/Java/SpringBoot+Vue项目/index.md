# 🚀 SpringBoot + Vue 前后端分离项目实战

---

## 1. 总体目标 

按照图书名称进行笔记查找。即允许用户上传某本书的笔记，其他用户可以根据该本书查找到所有用户的笔记内容（可设置为私有）

## 2. 应用架构

![](https://gitee.com/veal98/images/raw/master/img/20200725112109.png)

## 3. 技术栈

![](https://gitee.com/veal98/images/raw/master/img/20200725112139.png)

**前端技术栈：**

- Vue.js
- ElementUI
- axios

**后端技术栈：**

- Spring Boot
- Apache Shiro
- Apache Log4j2
- Spring Data JPA
- Spring Data Redis

**数据库：**

- MySQL
- Redis

## 4. 开发流程

### ① 登录注册

- [1 - 前后端交互测试 / 用户登录](Java/SpringBoot+Vue项目/1-前后端交互测试.md)
- [2 - 引入数据库 MySQL](Java/SpringBoot+Vue项目/2-引入数据库.md)
- [3 - ElementUI优化界面](Java/SpringBoot+Vue项目/3-ElementUI优化界面.md)
- [4 - 登录拦截器](Java/SpringBoot+Vue项目/4-登录拦截器.md)
- [5 - 用户注册](Java/SpringBoot+Vue项目/5-用户注册.md)

### ② 图书馆 / 图书管理

- [6 - 导航栏和图书管理界面](Java/SpringBoot+Vue项目/6-导航栏和图书管理界面.md)
- [7 - 数据库设计与增删改查](Java/SpringBoot+Vue项目/7-数据库设计与增删改查.md)
- [8 - 增删改查的前端界面](Java/SpringBoot+Vue项目/8-增删改查的前端界面.md)
- [9 - 图片上传](Java/SpringBoot+Vue项目/9-图片上传.md)

### ③ 安全模块

- [10 - 使用 Shiro 实现密码加密和登录认证](Java/SpringBoot+Vue项目/10-使用Shiro实现密码加密和登录认证.md)
- [11 - 使用 Shiro 实现登出和登录拦截](Java/SpringBoot+Vue项目/11-使用Shiro实现登出和登录拦截.md)
- [12 - 使用 Shiro 实现记住我](Java/SpringBoot+Vue项目/12-使用Shiro实现记住我.md)