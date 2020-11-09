# 🌌 Deep Q Network (DQN)

---

> 💡 **DQN** 属于 Value-Based、Model-Based、On-Policy

今天我们来说说强化学习中的一种强大武器, Deep Q Network 简称为 DQN. Google Deep mind 团队就是靠着这 DQN 使计算机玩电动玩得比我们还厉害.

## 1. 什么是 DQN

之前我们所谈论到的强化学习方法都是比较传统的方式, 而如今, 随着机器学习在日常生活中的各种应用, 各种机器学习方法也在融汇, 合并, 升级. 而 **Deep Q Network 则是融合了神经网络（深度学习）和 Q learning 的方法**. 

这种新型结构是为什么被提出来呢? 原来, 传统的表格形式的强化学习有这样一个瓶颈 👇

我们使用表格（Q-Table）来存储每一个状态 state, 和在这个 state 每个行为 action 所拥有的 Q 值. <u>而当今问题实在太复杂, 状态可以多到比天上的星星还多(比如下围棋). 如果全用表格来存储它们, 恐怕我们的计算机有再大的内存都不够, 而且每次在这么大的表格中搜索对应的状态也是一件很耗时的事</u>. 

![](https://gitee.com/veal98/images/raw/master/img/20201031105420.png)

不过, 在机器学习中, 有一种方法对这种事情很在行, 那就是神经网络. **我们可以将状态和动作当成神经网络的输入, 然后经过神经网络分析后得到动作的 Q 值, 这样我们就没必要在表格中记录 Q 值, 而是直接使用神经网络生成 Q 值**. 还有一种形式的是这样, 我们也能**只输入状态值, 输出所有的动作值, 然后按照 Q learning 的原则, 直接选择拥有最大值的动作当做下一步要做的动作**. 我们可以想象, 神经网络接受外部的信息, 相当于眼睛鼻子耳朵收集信息, 然后通过大脑加工输出每种动作的值, 最后通过强化学习的方式选择动作.

接下来我们基于第二种神经网络来分析, 我们知道, 神经网络是要被训练才能预测出准确的值. 那在强化学习中, 神经网络是如何被训练的呢? 首先, 我们需要 a1, a2 正确的Q值, 这个 Q 值我们就用之前在 Q learning 中的 Q 现实来代替. 同样我们还需要一个 Q 估计 来实现神经网络的更新. 所以**神经网络的的参数就是老的神经网络 (NN) 参数 加学习率 alpha 乘以 Q 现实 和 Q 估计 的差距**. 

![](https://gitee.com/veal98/images/raw/master/img/20201031105621.png)

我们整理一下：

![](https://gitee.com/veal98/images/raw/master/img/20201031105657.png)

我们通过神经网络 (NN) 参数预测出 Q(s2, a1) 和 Q(s2,a2) 的值, 这就是 Q 估计. 然后我们选取 Q 估计中最大值的动作来换取环境中的奖励 reward. 而 Q 现实中也包含从神经网络分析出来的两个 Q 估计值, 不过这个 Q 估计是针对于下一步在 s' 的估计. 最后再通过刚刚所说的算法更新神经网络中的参数. 

## 2. DQN 两大利器

<u>但是这并不是 DQN 会玩电动的根本原因. 还有两大因素支撑着 DQN 使得它变得无比强大. 这两大因素就是 `经验回放 Experience replay` 和 `Fixed Q-targets`</u>.

`Experience replay` 简单来说, DQN 有一个记忆库用于学习之前的经历. 在之前的简介影片中提到过, Q learning 是一种 off-policy 离线学习法, 它能学习当前经历着的, 也能学习过去经历过的, 甚至是学习别人的经历. 所以**每次 DQN 更新的时候, 我们都可以【随机抽取】一些之前的经历进行学习. 随机抽取这种做法打乱了经历之间的相关性, 也使得神经网络更新更有效率**. 

`Fixed Q-targets` 也是一种打乱相关性的机理, 如果使用 fixed Q-targets, 我们就会**在 DQN 中使用到【两个结构相同但参数不同的神经网络】, 预测 Q 估计（`q_eval`） 也就是根据 Q 值选取动作的神经网络具备最新的参数, 而预测 Q 现实（`q_target`）也就是根据动作计算 Q 值的神经网络使用的参数则是很久以前的**。有了这两种提升手段, DQN 才能在一些游戏中超越人类

## 3. DQN 整体算法

![](https://gitee.com/veal98/images/raw/master/img/20201101111040.png)

整个算法乍看起来很复杂, 其实就是在 Q learning 主框架上加了些装饰，这些装饰包括:

- **记忆库 (用于重复学习)**

  DQN 的精髓部分之一: 记录下所有经历过的步, 这些步可以进行反复的学习, 所以是一种 off-policy 方法, 你甚至可以自己玩, 然后记录下自己玩的经历, 让这个 DQN 学习你是如何通关的.

- **神经网络计算 Q 值**

- **暂时冻结 `q_target` 参数 (切断相关性)**

为了使用 Tensorflow 来实现 DQN, 比较推荐的方式是**搭建两个神经网络**, `target_net` 用于预测 Q 现实 `q_target` , 他不会及时更新参数. `eval_net` 用于预测 Q 估计 `q_eval`, 这个神经网络拥有最新的神经网络参数. 不过这两个神经网络结构是完全一样的, 只是里面的参数不一样. 

⭐ **两个神经网络是为了固定住一个神经网络 (`target_net`) 的参数, `target_net` 是 `eval_net` 的一个历史版本, 拥有 `eval_net` 很久之前的一组参数, 而且这组参数被固定一段时间, 然后再被 `eval_net` 的新参数所替换. 而 `eval_net` 是不断在被提升的, 所以是一个可以被训练的网络 `trainable=True`. 而 `target_net` 的 `trainable=False`**.

> ❓ **DQN 和 Q-learning 有什么不同？**
>
> 整体来说，DQN 与 Q-learning 的目标价值以及价值的更新方式都非常相似，主要的不同点在于：
>
> - DQN 将 Q-learning 与深度学习结合，用深度网络来近似动作价值函数，而 Q-learning 则是采用表格存储；
> - DQN 采用了经验回放的训练方法，从历史数据中随机采样，而 Q-learning 直接采用下一个状态的数据进行学习

## 6. Double DQN

**由于 DQN 是基于 Q-learning 的， Q 值总是基于使得 Q 最大的 action 得出，因此 Q 值会趋向于被高估  (overestimate)，于是引入 double DQN**

<img src="https://gitee.com/veal98/images/raw/master/img/20201101121041.png" style="zoom: 42%;" />

我们知道 DQN 的神经网络部分可以看成一个 `最新的神经网络` + `老神经网络`, 他们有相同的结构, 但内部的参数更新却有时差. 而它的 `Q现实` 部分是这样的:

![](https://gitee.com/veal98/images/raw/master/img/20201101121807.png)

因为我们的神经网络预测 `Qmax` 本来就有误差, 每次也向着最大误差的 `Q现实` 改进神经网络, 就是因为这个 `Qmax` 导致了 overestimate. 所以 Double DQN 的想法就是引入另一个神经网络来打消一些最大误差的影响. 而 DQN 中本来就有两个神经网络, 我们何不利用一下优势呢.：

 **一个 Q-network 用来选择行动 action（Q 估计，最新参数），另外一个 Q-network 用来根据这个 action 计算 Q 值（Q 现实，参数较老）**，我们用 `Q估计` 的神经网络估计 `Q现实` 中 `Qmax(s', a')` 的最大动作值. 然后用这个被 `Q估计` 估计出来的动作来选择 `Q现实` 中的 `Q(s')`. 

![](https://gitee.com/veal98/images/raw/master/img/20201101121725.png)

假设第一个 Q-function 高估了它现在选出来的 action a，那没关系，因为我们并不采用第一个 Q-network 的 Q 值，只要第二个 Q-function Q' 没有高估这个 action a 的 Q 值，那你算出来的就还是正常的值。假设反过来是 Q' 高估了某一个 action 的 Q 值，那也没关系，只要第一个 Q-network 不要选这个 action 就没事了。

## 7. 基于 Mountain Car 的 Double DQN 实现

我们先介绍 Mountain Car 关键的概念：

| 概念   | 解释                                        | 示例        |
| :----- | :------------------------------------------ | :---------- |
| State  | list: 状态，[位置 position，速度 velocity]  | [0.5,-0.01] |
| Action | int: 动作(0向左推，1不动，2向右推)          | 2           |
| Reward | float: 每回合-1分                           | -1          |
| Done   | bool: 是否爬到山顶(True/False)，上限200回合 | -1          |

如果`200回合`还没到达山顶，说明游戏失败，-200是最低分。每个回合得 -1，分数越高，说明尝试回合数越少，意味着越早地到达山顶。比如得分-100分，表示仅经过了 100 回合就到达了山顶。

如果有如下这样一张表，告诉我在某个状态(State)下， 执行每一个动作(Action)产生的价值(Value)，那就可以通过查询表格，选择产生价值最大的动作了。

| State         | Action 0 | Action 1 | Action 2 |
| :------------ | :------- | :------- | :------- |
| [0.2, -0.01]  | 10       | -20      | -30      |
| [-0.3, 0.01]  | 100      | 0        | 0        |
| [-0.1, -0.01] | 0        | -10      | 20       |

价值(Value)怎么计算呢？游戏的最终目标是爬到山顶，爬到山顶前的每一个动作都为最终的目标贡献了价值，因此每一个动作的价值计算，和最终的结果，也就是与未来(Future)有关。这就是强化学习的经典算法 `Q-Learning` 设计的核心。`Q-Learning`中的`Q`，代表的是 **Action-Value**，也可以理解为 **Quality**。而上面这张表，就称之为 `Q表(Q-Table)`。`Q-Learning`的目的是创建`Q-Table`。有了`Q-Table`，自然能知道选择哪一个Action了。

接下来，我们将借助`TensorFlow 2.0`中的`keras`库，搭建深度神经网络(Deep Netural Network, DNN)，替代`Q-Table`，即**深度Q网络(Deep Q-Learning Network, DQN)**，实现Q值的计算。

我们将神经网络比作一个函数，神经网络代替`Q-Table`其实就是在做 **函数拟合**，也可以称为**值函数近似(Value Function Approximation)**。

维基百科上有一个**万能近似定理(Universal approximation theorem)**，[Universal approximation theorem](https://en.wikipedia.org/wiki/Universal_approximation_theorem)定理表明：<u>前馈神经网络，只需具备单层隐含层和有限个神经单元，就能以任意精度拟合任意复杂度的函数</u>。

> 💡 DQN 在比较简单的游戏，比如 **CartPole-v0** 能够取得较好的效果，但在 **MountainCar-v0** 这个游戏中，如果只使用 DQN 很难找到最优解，所以我们使用 Double DQN

### ① 搭建神经网络模型

我们的输入是一维向量 1x2（位置 position，速度 velocity），输出是一维向量  1x3（0 向左推，1 不动，2 向右推）

```python
import tensorflow as tf
from tensorflow import keras # tensorflow 2.x
import gym
import numpy as np
import random
from collections import deque
```

```python
class DQN(object):
    def __init__(self):
        self.step = 0
        self.update_freq = 200  # 模型更新频率
        self.replay_size = 2000  # 训练集大小
        self.replay_queue = deque(maxlen=self.replay_size) # experience buffer
        self.model = self.create_model() # 用于选择 action 的 model，Q 估计，最新参数
        self.target_model = self.create_model() # 用于根据 action 计算 Q 值的 model，Q 现实，参数较老
        
    def create_model(self):
        """创建一个隐藏层为100的神经网络"""
        STATE_DIM = 2
        ACTION_DIM = 3
        model = keras.models.Sequential([
            keras.layers.Dense(100, input_dim = STATE_DIM, activation = 'relu'),
            keras.layers.Dense(ACTION_DIM, activation = 'linear')
        ])
        model.compile(loss = 'mean_squared_error',
                      optimizer = 'adam')
        return model
    
    def act(self, s, epsilon = 0.1):
        """预测动作"""
        # 刚开始时，加一点随机成分，产生更多的状态
        if np.random.uniform() < epsilon - self.step * 0.0002:
            return np.random.choice([0,1,2])
        return np.argmax(self.model.predict(np.array([s]))[0])s
    
    def save_model(self, file_path='MountainCar-v0-dqn.h5'):
        """保存训练好的模型"""
        print('model saved')
        self.model.save(file_path)
```

### ② 经验回放 和 Fixed Q-targets

```python
class DQN(object):    
    
    def remember(self, s, a, next_s, reward):
        """记忆库。当 position >= 0.4 时给额外的reward，快速收敛"""
        if next_s[0] >= 0.4:
            reward += 1
        self.replay_queue.append((s, a, next_s, reward)) # 存入 experience buffer

    def train(self, batch_size=64, alpha = 1, discount_factor=0.95):
        """训练模型"""
        # 当经验库满了后再开始训练
        if len(self.replay_queue) < self.replay_size:
            return
        self.step += 1
        # 每 update_freq = 200 步，target_model 的参数才更新一次（将 model 的权重/参数赋值给 target_model）
        if self.step % self.update_freq == 0:
            self.target_model.set_weights(self.model.get_weights())
        
        # 每次从 experience buffer 中选择 batch_size = 64 个数据进行训练
        replay_batch = random.sample(self.replay_queue, batch_size)
        state_batch = np.array([replay[0] for replay in replay_batch])
        next_state_batch = np.array([replay[2] for replay in replay_batch])

        Q = self.model.predict(state_batch) # Q 估计
        Q_next = self.target_model.predict(next_state_batch) # Q 现实

        # 使用公式更新训练集中的Q值
        for i, replay in enumerate(replay_batch):
            _, a, _, reward = replay
            Q[i][a] = (1 - alpha) * Q[i][a] + alpha * (reward + discount_factor * np.amax(Q_next[i]))
        
        # 传入网络进行训练
        self.model.fit(state_batch, Q, verbose=0)
```

整个结构如下图所示：

![](https://gitee.com/veal98/images/raw/master/img/20201106105915.png)

我们在训练时，是以**batch**为单位进行训练的，也就是说很多训练数据对应的是之前状态的 model，而不是频繁更新值的`model`，因此，我们使用更新频率低的`target_model`来计算`next_s`的Q值。

`target_model`每训练update_freq(200)次，参数才更新一次（将 `model `的权重/参数赋值给 `target_model`）

那为什么在`Q-Table`中，可以用单步的数据来进行更新，但换作了神经网络，就需要以**batch**为单位来进行训练呢？简单说，如果单步训练，即**batch**为1，每次朝着单步的梯度方向修正，横冲直撞各自为政，难以收敛。如果**batch**过大，容易过拟合。而且`DQN`是强化学习算法，前面的训练数据质量较差，随着训练的进行，产生的动作价值越来越高，强化学习更为看重后面的训练数据，所以**batch**也不宜过大。

而这一点，也是`replay_queue`的最大容量设置为**2000**的原因。队列有先进先出的特性，当后面的数据加进来后，如果数据条数超过2000，前面的数据就会从队列中移除。后面的训练数据对于强化学习更重要。

### ③ 可改动的 Reward

代码中还有这么一个细节：

```python
if next_s[0] >= 0.4:
    reward += 1
```

`MountainCar-v0`这个游戏中，`State`由2个值构成 (位置 position, 速度 velocity)。山顶的位置是**0.5**，因此当**position**大于**0.4**时，给`Reward`额外加**1**。这么做，是希望加快神经网络的收敛，更快地达到预期结果。每一步的`Reward`其实都是可以调整的，怎么做会让训练效果更好，可以动动脑，尝试尝试

### ④ 主循环 / 训练模型

```python
env = gym.make('MountainCar-v0')
episodes = 1000  # 训练1000次
score_list = []  # 记录所有分数
agent = DQN()
for i in range(episodes):
    s = env.reset()
    score = 0
    while True:
        a = agent.act(s) # 预测动作
        next_s, reward, done, _ = env.step(a)
        agent.remember(s, a, next_s, reward) # 存入记忆库
        agent.train()
        score += reward
        s = next_s
        if done:
            score_list.append(score)
            print('episode:', i, 'score:', score, 'max:', max(score_list))
            break
    # 最后10次的平均分大于 -160 时，停止并保存模型
    if np.mean(score_list[-10:]) > -160:
        agent.save_model()
        break
env.close()
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201106112210.png" style="zoom: 67%;" />

### ⑤ 使用训练好的模型进行测试

```python
import time
import gym
import numpy as np
import tensorflow as tf
from tensorflow import keras
```

```python
env = gym.make('MountainCar-v0')
model = keras.models.load_model('MountainCar-v0-dqn.h5')
s = env.reset()
score = 0
while True:
    env.render()
    time.sleep(0.01)
    a = np.argmax(model.predict(np.array([s]))[0])
    s, reward, done, _ = env.step(a)
    score += reward
    if done:
        print('score:', score)
        break
env.close()
```

## 8. 优先经验回放 Prioritized Experience Replay

**【优先经验回放】**：简单地说，在训练的过程中，对于在经验 buffer 里面的样本，那些具有更好的 **TD 误差（ Q现实 - Q估计）**的样本会有更高的概率被采样，这样可以加快训练速度。

<img src="https://gitee.com/veal98/images/raw/master/img/20201028213309.png" style="zoom:45%;" />

在这个过程中，参数更新的过程也会有相应的更改。

## 9. Dueling DQN

只要稍稍修改 DQN 中神经网络的结构, 就能大幅提升学习效果, 加速收敛. 这种新方法叫做 Dueling DQN. 用一句话来概括 Dueling DQN 就是. 它将每个动作的 Q 拆分成了 state 的 Value 加上 每个动作的 Advantage.

<img src="https://gitee.com/veal98/images/raw/master/img/20201101122106.png" style="zoom:40%;" />

本来的 DQN 就是直接输出 Q 函数的值。现在这个 dueling 的 DQN，它不直接输出 Q 函数的值，它分成两条 path 去运算，**第一个 path 算出一个标量 $V(s)$ 即每列的平均值**。因为它跟输入 s 是有关系，所以叫做 V(s)。**第二个path 会输出一个向量 $A(s,a)$ 即分别使用每列的数据减去该列的平均值**，该向量具有列零和特征。

把 $V(s)$ 和 $A(S,a)$ 加起来就得到 Q 函数的值

<img src="https://gitee.com/veal98/images/raw/master/img/20201028211522.png" style="zoom: 22%;" />

## 📚 References

- [Bilibili - 李宏毅《深度强化学习》](https://www.bilibili.com/video/BV1MW411w79n)
- [Github - LeeDeepRL - Notes](https://datawhalechina.github.io/leedeeprl-notes/)
- [CSDN - 李宏毅深度强化学习笔记 - jessie](https://blog.csdn.net/cindy_1102/article/details/87904928)
- [强化学习纲要](https://github.com/zhoubolei/introRL)
- [莫烦 Python — 强化学习](https://mofanpy.com/tutorials/machine-learning/reinforcement-learning/intro-RL-methods/)