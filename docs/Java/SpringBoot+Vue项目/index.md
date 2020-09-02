# 🚀 SpringBoot + Vue 前后端分离项目实战

---

> 🔊 该项目参考大佬的教程： [Vue + Spring Boot 项目实战 — 白卷](https://blog.csdn.net/Neuf_Soleil/article/details/88925013) ，在该基础上对未提到的知识点、项目架构等做出了部分修改和润色，暂时先用着大佬画的架构图，等项目结束之后再做修改~

## 1. 总体目标 

前台为图书馆部分，用户可查阅书籍并发布个人笔记，后台为用户个人中心，基于角色的不同用户的权限不同，管理员可对用户角色进行修改等

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

### ④ 后台管理模块

- [13 - 动态加载后台菜单](Java/SpringBoot+Vue项目/13-动态加载后台菜单.md)
- [14 - 使用 Shiro 实现基于 URL 的动态权限控制](Java/SpringBoot+Vue项目/14-使用Shiro实现基于URL的动态权限控制.md)
- [15 - 后台界面完善](Java/SpringBoot+Vue项目/15-后台界面完善.md)

### ⑤ 博客模块

- [16 - 博客功能开发](Java/SpringBoot+Vue项目/16-博客功能开发.md)