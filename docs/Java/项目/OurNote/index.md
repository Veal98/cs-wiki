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
- Spring Data JPA
- Spring Data Redis

**数据库：**

- MySQL
- Redis

## 4. 开发流程

- [1 - 登录功能开发 — 不带数据库](Java/项目/OurNote/1-登录(不带数据库))