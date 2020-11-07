# 💫 策略梯度 Policy Gradient

---

> 💡 **Policy Gradient** 属于 Value-Free、Policy-Based

对比起以值为基础的方法, Policy Gradients 根据概率直接输出动作的最大好处就是, **它能在一个连续区间内挑选动作**, 而 Value-Based 的比如 Q-learning 无法很好的处理连续动作

## 1. Policy Gradient 核心思想

如图所示, 观测的信息通过神经网络分析, 选出了左边的行为, 我们直接进行反向传递, 使之下次被选的可能性增加, 但是奖惩信息却告诉我们, 这次的行为是不好的, 那我们的动作可能性增加的幅度 随之被减低. 这样就能**靠奖励来左右我们的神经网络反向传递**. 

![](https://gitee.com/veal98/images/raw/master/img/20201102094845.png)

假如这次的观测信息让神经网络选择了右边的行为, 右边的行为随之想要进行反向传递, 使右边的行为下次被多选一点, 这时, 奖惩信息也来了, 告诉我们这是好行为, 那我们就在这次反向传递的时候加大力度, 让它下次被多选的幅度更猛烈。这就是 Policy Gradients 的核心思想.

> 💡 反映到代码上其实就是给损失函数加权重：`loss = discount_reward * loss`。对于累加期望大的动作，可以放大 `loss` 的值，而对于累加期望小的动作，那么就减小 loss 的值。这样神经网络就能快速朝着累加期望大的方向优化了。
>

Policy gradient 同样也要接受环境信息 (observation), **不同的是他要输出不是 action 的 value, 而是具体的那一个 action**, 这样 policy gradient 就跳过了 value 这个阶段

<u>也就是说 Policy Gradient 网络的输入也是状态(State)，输出是每个动作的概率，例如 `[0.7, 0.3]` ，这意味着有70% 的几率会选择动作 0，30% 的几率选择动作 1</u>

## 2. Policy Gradient 整体算法

我们介绍的 policy gradient 的基础算法是一种基于 **整条回合数据** 的更新, 也叫 **REINFORCE** 方法. 这种方法是 policy gradient 的最基本方法

θ 就是我们需要不断更新的神经网络参数

![](https://gitee.com/veal98/images/raw/master/img/20201102095848.png)

> 💡 $\pi$ 表示 Policy，$\pi(s,a)$ 表示在状态 s 下选择动作 a 的概率 
>
> **`Policy` 输出某个状态下所有可能动作的执行概率，它其实是一个函数，把输入的状态变成行为**。假设你是用 deep learning 的技术来做 reinforcement learning 的话，**`policy` 就是一个神经网络**，神经网络里面有一堆参数， <u>我们用 θ 来代表 π 的参数</u>：
>
> <img src="https://gitee.com/veal98/images/raw/master/img/20201026173154.png" style="zoom:40%;" />

<img src="https://gitee.com/veal98/images/raw/master/img/20201102095924.png" style="zoom:67%;" /> 表示在 状态 `s` 对所选动作 `a` 的吃惊度, 如果 $\pi(s,a)$ 概率越小, 反向的 $log\pi(s,a)$ 反而越大. 如果在 $\pi(s,a)$ 很小的情况下, 拿到了一个大的 `R`, 也就是 大的 `V`, 那 $log\pi(s,a)V$ 就更大, 表示更吃惊

👍 **通俗来说，我选了一个不常选的动作（概率小）, 却发现原来它能得到了一个好的 reward, 那我就得对这次的参数进行一个大幅修改. 这就是吃惊度的物理意义**

## 3. 基于 CartPole-v0 的代码实现

**CartPole-v0** 的几个重要概念：

| 概念   | 解释                                   | 示例                     |
| :----- | :------------------------------------- | :----------------------- |
| State  | 状态，[车位置, 车速度, 杆角度, 杆速度] | 0.02, 0.95, -0.07, -1.53 |
| Action | 动作(0向左/1向右)                      | 1                        |
| Reward | 奖励(每走一步得1分)                    | 1.0                      |

关于 CartPole 的详细文档请参见 [https://gym.openai.com/envs/#classic_control](https://gym.openai.com/envs/#classic_control)

### ① 构建神经网络模型

```python
import matplotlib.pyplot as plt
import gym
import numpy as np
import tensorflow as tf # tensorflow 2.x
from tensorflow import keras
```

```python
env = gym.make('CartPole-v0')

STATE_DIM = 4 # 4 个状态（输入层）
ACTION_DIM = 2 # 2 个动作（输出层）

# 构建模型

# 设置层
model = keras.Sequential([
    # 输入层为4，输出层为2，隐藏层为100
    keras.layers.Dense(100, input_dim = STATE_DIM, activation = 'relu'),
    keras.layers.Dropout(0.1), # 随机忘记10%的权重
    keras.layers.Dense(ACTION_DIM, activation = 'softmax')
])

# 编译模型
model.compile(loss='mean_squared_error',
              optimizer='adam')
```

我们的神经网络很简单，输入层为4，输出层为2，隐藏层为100。`Dropout(0.1)` 的含义是，随机忘记 10% 的权重。学习初期，一开始的数据质量不高，随着学习的进行，质量才逐步高了起来，一开始容易陷入**局部最优**和**过拟合**，使用 Dropout 可以有效避免。

Policy Gradient 网络的输入是状态(State)，输出是每个动作的概率，例如 `[0.7, 0.3]` ，这意味着有 70% 的几率会选择动作 0，30% 的几率选择动作 1。使用 `np.random.choice` 根据概率随机选取动作：

```python
# 在状态 s 下选择动作 action（使用模型进行预测）
def choose_action(s):
    # 即使是单个数据，predict 也必须传入列表
    # predictions 表示在状态 s 下选择各个动作的概率
    predictions = model.predict(np.array([s]))[0]
    # 从 len(predictions) 中以概率 predictions 随机选择一个值（动作的下标）
    return np.random.choice(len(predictions), p = predictions)
```

> 💡 `numpy.random.choice(a, size=None, replace=True, p=None)`
>
> Generates a random sample from a given 1-D array
>
> Parameters:	
>
> - `a`: 1-D array-like or int
>   If an ndarray, a random sample is generated from its elements. If an int, the random sample is generated as if a were np.arange(a)
>
> - `size `: int or tuple of ints, optional
>   Output shape. If the given shape is, e.g., (m, n, k), then m * n * k samples are drawn. Default is None, in which case a single value is returned.
>
> - `replace `: boolean, optional
>   Whether the sample is with or without replacement
>
> - `p` : 1-D array-like, optional
> The probabilities associated with each entry in a. If not given the sample assumes a uniform distribution over all entries in a.

### ② 优化策略

![](https://gitee.com/veal98/images/raw/master/img/20201105144617.png)

#### Ⅰ 衰减的累加期望

同 Q-Learning 一样，我们引入 **折扣系数/衰减因子 γ**

⭐ `discount_reward[i] = reward[i] + gamma * discount_reward[i+1]`

某一步的累加期望等于下一步的累加期望乘衰减系数`gamma`，加上`reward`。

手工算一算。

```
最后一步：1
倒数第二步：1 + 0.95 * 1 = 1.95
倒数第三步：1 + 0.95 * 1.95 = 2.8525
倒数第四步：1 + 0.95 * 2.8525 = 3.709875
```

假设某个回合只得了10分，那么这个回合的每一步的累加期望都不会高。假设得到了满分200分，那么回合中的大部分步骤的累加期望很会很高，越是前面的步骤，累加期望越高。

代码实现就很简单了，唯一的不同是最后加了中心化和标准化的处理。这样处理的目的是希望得到相同尺度的数据，避免因为数值相差过大而导致网络无法收敛。

```python
# 计算某个动作衰减的累加期望reward ，并中心化和标准化处理
def discount_rewards(rewards, gamma = 0.95):
    prior = 0
    out = np.zeros_like(rewards)
    for i in reversed(range(len(rewards))):
        prior = prior * gamma + rewards[i]
        out[i] = prior
    return out / np.std(out - np.mean(out))
```

#### Ⅱ 给 loss 加权重

**一个动作的`累加期望 reward`很高，自然希望该动作出现的概率变大，这就是学习的目的**。

我们可以通过改变**损失函数(loss function)**达到目的。对于累加期望大的动作，可以放大`loss`的值，而对于累加期望小的动作，那么就减小loss的值。这样呢？神经网络就能快速朝着累加期望大的方向优化了。最简单的方法，给`loss`加一个权重。

所以我们的最终的损失函数就变成了：

`loss = discount_reward * loss`

> 💡 这个地方可能有些不好理解，为什么好的动作还增大损失函数的值，损失函数不是代表真实情况与预测情况的差吗，两者越接近，损失函数值越小。
>
> 其实这里面的损失可以理解为梯度，采用**梯度下降**的方法，找到最快的优化方向（使损失函数最小），调整参数值。也就是说如果该动作的累加期望大，我们就迈一大步进行梯度下降，如果该动作的累加期望小，我们就迈一小步进行梯度下降
>
> ![](https://gitee.com/veal98/images/raw/master/img/20201105143446.png)

在**TensorFlow 1.x**的版本中，搭建一个自定义loss的网络很复杂，而使用**TensorFlow 2.0**，借助`Keras`，我们可以写出非常简洁的代码。

```python
# 给 loss 加权重 并训练模型
def train(records):
    # records 存储每一个状态对应的动作以及奖励 record[state,action,reward]
    state_batch = np.array([record[0] for record in records]) # 所有的状态
    action_batch = np.array([[1 if record[1] == i else 0 for i in range(ACTION_DIM)]
                            for record in records]) # 将 action 映射成 0 或 1
    # 假设predict的概率是 [0.3, 0.7]，选择的动作是 [0, 1]
    # 则动作[0, 1]的概率等于 [0, 0.7] = [0.3, 0.7] * [0, 1]
    prediction_batch = model.predict(state_batch) * action_batch
    reward_batch = discount_rewards([record[2] for record in records])
    
    # 设置参数 sample_weight，即给loss设权重 loss = discount_reward * loss
    model.fit(state_batch, prediction_batch, sample_weight = reward_batch, verbose = 2)
```

### ③ 主循环 / 训练模型

接下来，把 OpenAI gym 的代码融入进来并进行训练模型：

```python
episodes = 2000  # 至多循环 2000 次
score_list = []  # 记录所有分数

for i in range(episodes):
    s = env.reset() # 重置环境的状态
    score = 0
    replay_records = []
    
    while True:
        a = choose_action(s)
        next_s, r, done, _ = env.step(a)
        replay_records.append((s, a, r))

        score += r
        s = next_s
        if done:
            train(replay_records)
            score_list.append(score)
            print('episode:', i, 'score:', score, 'max:', max(score_list))
            break
    # 最后10次的平均分大于 195 时，停止并保存模型
    if np.mean(score_list[-10:]) > 195:
        model.save('CartPole-v0-pg.h5')
        break
env.close()
```

将我们训练好的模型保存为 `CartPole-v0-pg.h5`

<img src="https://gitee.com/veal98/images/raw/master/img/20201105145334.png" style="zoom: 67%;" />

### ④ 使用训练好的模型进行测试

新建一个文件，测试训练好的模型 `CartPole-v0-pg.h5`

```python
import time
import gym
import numpy as np
import tensorflow as tf
from tensorflow import keras

saved_model = keras.models.load_model('CartPole-v0-pg.h5') # 加载训练好的模型
env = gym.make("CartPole-v0")

for i in range(10):
    s = env.reset()
    score = 0
    while True:
        time.sleep(0.01)
        env.render()
        predictions = saved_model.predict(np.array([s]))[0]
        a = np.random.choice(len(predictions), p=predictions) # 根据概率随机选取动作
        s, r, done, _ = env.step(a)
        score += r
        if done:
            print('using policy gradient, score: ', score)  # 打印分数
            break
env.close()
```

效果如下

![Geektutu Policy Gradient Success](https://geektutu.com/post/tensorflow2-gym-pg/pg_success.gif)

## 📚 References

- [Bilibili - 李宏毅《深度强化学习》](https://www.bilibili.com/video/BV1MW411w79n)
- [Github - LeeDeepRL - Notes](https://datawhalechina.github.io/leedeeprl-notes/)
- [CSDN - 李宏毅深度强化学习笔记 - jessie](https://blog.csdn.net/cindy_1102/article/details/87904928)
- [极客兔兔 - TensorFlow 2.0 (九) - 强化学习 70行代码实战 Policy Gradient](https://geektutu.com/post/tensorflow2-gym-pg.html#CartPole-%E7%AE%80%E4%BB%8B)