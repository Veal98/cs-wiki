# 🍷 使用 ElementUI 优化前端界面

---

> 🔊 本篇主要实现使用 ElementUI 对前端界面进行美化

## 1. 安装 Element

使用 VSCode 打开项目，在终端输入以下命令安装 Element：

```powershell
npm i element-ui -S
```

![](https://gitee.com/veal98/images/raw/master/img/20200727120827.png)

## 2. 在 Vue 项目中引入 Element

在 main.js 中写入以下内容：

```js
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200727121110.png" style="zoom:67%;" />

## 3. 修改 Login.vue

参考官方文档：[ElementUI — Form 表单](https://element.eleme.cn/#/zh-CN/component/form)

直接根据官网的例子来改进行了，下面给出我的代码 👇 

```vue
<template>
  <body class = "bg_login">
    <div class="login-container">
      <el-form  :model="loginForm" :status-icon="true" :rules="rules" ref="loginForm" label-width="80px"  
        :hide-required-asterisk="true" class="demo-loginForm">
          <h3 class="login_title">登 录</h3>
          <el-form-item prop="username">
            <el-input placeholder = "用户名" v-model="loginForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder = "密码" type="password" v-model="loginForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <br>
          <el-form-item >
            <el-button  type="primary" v-on:click="login">提交</el-button>
            <el-button  @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
      </el-form>
    </div>
  </body>
</template>

<script>

  export default {
    name: 'Login',
    data () {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        responseResult: [],
        rules:{
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      login() {
        this.$axios
          .post('/login', {
            username: this.loginForm.username,
            password: this.loginForm.password
          })
          .then(successResponse => {
            if (successResponse.data.code === 200) {
                this.$router.replace({path: '/index'})
            } else{
              this.$alert('用户名或者密码错误', '提示', {
                confirmButtonText: '确定'
              })
            }
          })
          .catch(failResponse => {
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style>
  .login-container {
    border-radius: 20px;
    background-clip: padding-box;
    margin: 150px auto;
    width: 400px;
    padding: 35px 65px 15px 0px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px rgb(20, 85, 105);
  }
  
  .login_title {
    margin: 0px 0px 40px 75px;
    text-align: center;
    color: #505458;
    font-size: 22px;
  }
   /* 背景图片 */
  .bg_login{
    background:url("../assets/bg_login.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;

  }
  body{
    margin: 0px;
  }

</style>
```

涉及到的部分 Element 表单属性如下：

**Form Attributes**：

| 参数                   | 说明                                                         | 类型    | 可选值         | 默认值 |
| :--------------------- | :----------------------------------------------------------- | :------ | :------------- | :----- |
| model                  | 表单数据对象                                                 | object  | —              | —      |
| rules                  | 表单验证规则                                                 | object  | —              | —      |
| label-position         | 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 `label-width` | string  | right/left/top | right  |
| label-width            | 表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 `auto`。 | string  | —              | —      |
| hide-required-asterisk | 是否显示必填字段的标签旁边的红色星号                         | boolean | —              | false  |
| status-icon            | 是否在输入框中显示校验结果反馈图标                           | boolean | —              | false  |

**Form Methods**：

| 方法名      | 说明                                                       | 参数 |
| :---------- | :--------------------------------------------------------- | :--- |
| resetFields | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果 | —    |

**Form-Item Attributes**：

| 参数        | 说明                                                         | 类型    | 可选值                            | 默认值 |
| :---------- | :----------------------------------------------------------- | :------ | :-------------------------------- | :----- |
| prop        | 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的 | string  | 传入 Form 组件的 `model` 中的字段 | —      |
| label       | 标签文本                                                     | string  | —                                 | —      |
| label-width | 表单域标签的的宽度，例如 '50px'。支持 `auto`。               | string  | —                                 | —      |
| required    | 是否必填，如不设置，则会根据校验规则自动生成                 | boolean | —                                 | false  |
| rules       | 表单验证规则                                                 | object  | —                                 | —      |

注意去除 `App.vue` 中自带的 nav 样式

```vue
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>

```

<img src="https://gitee.com/veal98/images/raw/master/img/20200727152035.png" style="zoom:67%;" />

## 4. 效果

![](https://gitee.com/veal98/images/raw/master/img/20200727134241.png)

## ⛵ Next

至此，登录页面的开发似乎已经较为完善了，但其实还没有完，因为这个登录页面其实没有用，别人直接输入首页的网址，就可以绕过登录页面。为了让它发挥作用，我们还需要开发一个**拦截器**。

## 📚 References

- [Vue + Spring Boot 项目实战 — 白卷](https://blog.csdn.net/Neuf_Soleil/article/details/88925013)
- [ElementUI 官网](https://element.eleme.cn/#/zh-CN/component/)