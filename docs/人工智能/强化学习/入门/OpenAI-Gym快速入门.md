# 🚀 OpenAI Gym 快速入门

---

## 1. 安装

管理员身份打开 Anaconda Promt，进入 tensorflow 环境：

<img src="https://gitee.com/veal98/images/raw/master/img/20201102203831.png" style="zoom: 80%;" />

在配置好的 tensorflow 环境下安装 gym：

> TensorFlow 环境安装参见这篇文档 👉 [TensorFlow 2 快速入门](https://veal98.gitee.io/cs-wiki/#/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0/TensorFlow2/TensorFlow2%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8)

```shell
pip install gym
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201102113908.png" style="zoom:67%;" />

## 2. 基础

在强化学习中有两个基本概念：环境（即外部世界）和 agent（即您正在编写的算法）。 代理将操作发送到环境，竝且环境以观察和奖励（即得分）进行响应。

`Gym` 的核心接口是 `Env`，这是统一的环境接口。 没有 agent 的接口。 那部分留给你。 以下是您应该知道的 Env 方法：

- ``reset（self）`：重置环境的状态。 返回观察值。

  步骤（自我，行动）：一步一步地完成环境的调整。 返回观察，奖励，完成，信息。

- `render（self，mode ='human'）`：渲染环境的一帧。 默认模式将执行一些人性化的操作，例如弹出一个窗口。

## 📚 References

