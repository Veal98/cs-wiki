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

## 2. 核心概念

我们先对 OpenAI 的 gym 库的几个核心概念作个简单介绍。

想象一下你在玩贪吃蛇，你需要分析当前游戏的`状态(State)`，例如你所处的位置，周围的障碍物等，才能够决定下一步的`动作(Action)`，上下左右。那你每走一步，就会得到一个`奖励(Reward)`。这个奖励可能是正向奖励(Positive Reward)，也可能是负向奖励(Negative Reward)，比如撞到了障碍物。重复N次这样的过程，直到游戏`结束(Done)`。

从整个例子中，可以总结出几个重要的概念，接下来的示例将会使用 OpenAI gym 库提供的 **CartPole Game** 环境，一起来熟悉CartPole 游戏中的这几个概念的含义吧。先直接给一个可以运行看效果的示例，这个示例中，Action 是随机选择的。

`Gym` 的核心接口是 `Env`，这是统一的环境接口。

```python
# try_gym.py
# https://geektutu.com
import gym  # 0.12.5
import random
import time

env = gym.make("CartPole-v0")  # 加载游戏环境

state = env.reset() # 重置环境的状态
score = 0
while True:
    time.sleep(0.1)
    env.render()   # 显示画面(渲染环境的一帧)
    action = random.randint(0, 1)  # 随机选择一个动作 0 或 1
    state, reward, done, _ = env.step(action)  # 执行这个动作
    score += reward     # 每回合的得分
    if done:       # 游戏结束
        print('score: ', score)  # 打印分数
        break
env.close()
```

| 概念   | 解释                                         | 示例                  |
| :----- | :------------------------------------------- | :-------------------- |
| State  | list：状态，[车位置, 车速度, 杆角度, 杆速度] | 0.02,0.95,-0.07,-1.53 |
| Action | int：动作(0向左/1向右)                       | 1                     |
| Reward | float：奖励(每走一步得1分)                   | 1.0                   |
| Done   | bool：是否结束(True/False)，上限200回合      | False                 |

游戏上限是200回合，但是如果是随机选择 Action，就只得了14分，游戏就结束了。

## 📚 References

