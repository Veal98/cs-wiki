# 🌌 Deep Q Network (DQN)

---

> 💡 **DQN** 属于 Value-Based、Model-Based、On-Policy

今天我们来说说强化学习中的一种强大武器, Deep Q Network 简称为 DQN. Google Deep mind 团队就是靠着这 DQN 使计算机玩电动玩得比我们还厉害.

## 1. 深度强化学习 DRL

之前我们所谈论到的强化学习方法都是比较传统的方式, 而如今, 随着机器学习在日常生活中的各种应用, 各种机器学习方法也在融汇, 合并, 升级.  **Deep Q Network 就是融合了神经网络（深度学习）和强化学习中 Q learning 的方法**. 

> 💡`深度强化学习 DRL`：将深度学习技术引入强化学习的框架中，使深度学习的抽象感知能力与强化学习的决策控制能力完美结合，实现了从原始高维数据的抽象感知到直接控制输出的**端到端 End-to-End** 系统框架
>
> <img src="https://gitee.com/veal98/images/raw/master/img/20201119110824.png" style="zoom:60%;" />

这种新型结构是为什么被提出来呢? 原来, 传统的表格形式的强化学习有这样一个瓶颈：**【维度灾难】** 👇

我们使用表格（Q-Table）来存储每一个状态 state, 和在这个 state 每个行为 action 所拥有的 Q 值. <u>而当今问题实在太复杂, 如围棋的状态数共有约 $10^{170}$ 之多。如果全用表格来存储它们, 恐怕我们的计算机有再大的内存都不够, 而且每次在这么大的表格中搜索对应的状态也是一件很耗时的事</u>. 

![](https://gitee.com/veal98/images/raw/master/img/20201031105420.png)

所以我们有必要对状态的维度进行压缩，解决办法就是 **价值函数近似 Value Function Approximation** 👇

什么是价值函数近似呢？说起来很简单，就是用一个函数来表示Q(s,a)。即

<img src="https://gitee.com/veal98/images/raw/master/img/20201110220825.png" style="zoom:80%;" />

f可以是任意类型的函数，比如线性函数：

<img src="https://gitee.com/veal98/images/raw/master/img/20201110220838.png" style="zoom:80%;" />

 其中 $w_1, w_2, b$ 是函数 f 的参数。

<u>通过函数表示，我们就可以无所谓 s 到底是多大的维度，反正最后都通过矩阵运算降维输出为单值的 Q。这就是价值函数近似的基本思路。</u>

如果我们用 w 来统一表示函数f的参数，那么就有

<img src="https://gitee.com/veal98/images/raw/master/img/20201110221013.png" style="zoom:80%;" />

为什么叫近似，因为我们并不知道Q值的实际分布情况，本质上就是用一个函数来近似Q值的分布，所以，也可以说是

<img src="https://gitee.com/veal98/images/raw/master/img/20201110221028.png" style="zoom:80%;" />

**DQN 就是将 Q-Learning 和神经网络相结合，用一个深度神经网络来表示这个函数 f（即 Q 函数的近似）**



## 2. DQN 算法

我们知道，神经网络的训练是一个最优化问题，最优化一个损失函数 loss function，也就是标签和网络输出的偏差，目标是让损失函数最小化。为此，我们需要有样本，巨量的有标签数据，然后通过反向传播使用梯度下降的方法来更新神经网络的参数。

所以，要训练 Q 网络，我们要能够为 Q 网络提供有标签的样本。

所以，问题变成：如何为 Q 网络提供有标签的样本？

大家回想一下 Q-Learning 算法，Q 值的更新依靠什么？依靠的是利用 Reward 和 Q 计算出来的目标 Q 值 / Q 现实：

<img src="https://gitee.com/veal98/images/raw/master/img/20201110221728.png" style="zoom: 50%;" />

因此，我们把目标Q值 / Q 现实 作为标签不就完了？我们的目标不就是让Q估计值趋近于目标Q值/Q现实值吗？

因此，DQN 的损失函数就是

<img src="https://gitee.com/veal98/images/raw/master/img/20201110222021.png" style="zoom:67%;" />

> 💡 $s'，a'$ 即下一个状态和动作。这里用了David Silver的表示方式，看起来比较清晰。

## 3. DQN 两大利器

<u>以上并不是 DQN 会玩电动的根本原因. 还有两大因素支撑着 DQN 使得它变得无比强大. 这两大因素就是 `经验回放 Experience replay` 和 `冻结目标网络 Fixed Target Newtwork`</u>.

### ① 经验回放 Experienced Replay

`Experience replay` 简单来说, DQN 有一个记忆库用于学习之前的经历. **每次训练时，将最新策略产生的数据对 $(s,a,r,s')$ 存入记忆库**。（之前提到过, Q learning 是一种 off-policy 离线学习法, 它能学习当前经历着的, 也能学习过去经历过的, 甚至是学习别人的经历. ）**每次 DQN 更新的时候, 我们从记忆库中【随机抽取】一些之前的经历进行学习，这个过程称为经验回放。** 

经验回放池技术打破了经验数据间的强相关性，使样本近乎满足独立同分布的特性，同时极大地提高了数据的使用效率。

#### 优先经验回放 Prioritized Experience Replay

**【优先经验回放 `Prioritized Experience Replay`】**：在训练的过程中，对于在经验 buffer 里面的样本，那些具有更好的 **TD 误差（ Q现实 - Q估计）**的样本会有更高的概率被采样，这样可以加快训练速度。

<img src="https://gitee.com/veal98/images/raw/master/img/20201028213309.png" style="zoom:45%;" />

在这个过程中，参数更新的过程也会有相应的更改。

### ② 冻结目标网络 Fixed Target Newtwork

`Fixed Target Newtwork` 也是一种打乱相关性的机理, **计算 Q 现实的目标网络 $Q(s')$ 和计算 Q 估计的网络 $Q(s)$ 都来自同一网络，但是计算 Q 估计的神经网络具备最新的参数, 而计算 Q 现实 / 目标 Q 值的神经网络使用的参数则是很久以前的，相当于在 $Q(s')$ 未更新时处于冻结状态**。

目标网络（Q 现实）参数实际上是对 Q 估计网络参数的复制，每隔一定的时长就用 Q 现实网络参数更新目标网络参数

> 💡 一般我们称计算 Q 现实的网络为目标网络，计算 Q 估计的网络为 Q 网络。

目标网络的使用提高了算法的稳定性，加快了网络训练的速度。

## 4. DQN 整体算法

<img src="https://gitee.com/veal98/images/raw/master/img/20201110222224.png" style="zoom: 50%;" />

为了使用 Tensorflow 来实现 DQN, 比较推荐的方式是**搭建两个神经网络**, 一个用于预测 Q 现实 , 他不会及时更新参数. 另一个用于预测 Q 估计, 这个神经网络拥有最新的神经网络参数. 不过这两个神经网络结构是完全一样的, 只是里面的参数不一样. 

⭐ **两个神经网络是为了固定住一个神经网络 (Q 现实) 的参数, Q 现实 是 Q 估计 的一个历史版本, 拥有 Q 估计 很久之前的一组参数, 而且这组参数被固定一段时间, 然后再被 Q 估计 的新参数所替换. 而 Q 估计 的参数是不断在更新的**.

> ❓ **DQN 和 Q-learning 有什么不同？**
>
> 整体来说，DQN 与 Q-learning 的目标价值以及价值的更新方式都非常相似，主要的不同点在于：
>
> - DQN 将 Q-learning 与深度学习结合，用深度网络来近似动作价值函数，而 Q-learning 则是采用表格存储；
> - DQN 采用了经验回放的训练方法，从历史数据中随机采样，而 Q-learning 直接采用下一个状态的数据进行学习

## 5. Double DQN

**由于 DQN 是基于 Q-learning 的， Q 值总是基于使得 Q 最大的 action 得出，因此 Q 值会趋向于被高估  (overestimate)，于是引入 double DQN**

<img src="https://gitee.com/veal98/images/raw/master/img/20201101121041.png" style="zoom: 42%;" />

我们知道 DQN 的神经网络部分可以看成一个 `最新的神经网络` + `老神经网络`, 他们有相同的结构, 但内部的参数更新却有时差. 它的 `Q现实/目标Q值` 部分是这样的:

![](https://gitee.com/veal98/images/raw/master/img/20201101121807.png)

因为我们的神经网络预测 `Qmax` 本来就有误差, 每次也向着最大误差的 `Q现实` 改进神经网络, 就是因为这个 `Qmax` 导致了 overestimate.

Double DQN 的想法就是引入另一个神经网络来打消一些最大误差的影响. 而 DQN 中本来就有两个神经网络, 我们何不利用一下优势呢.：

 **一个 Q-network（$\hat Q$） 用来计算 Q 估计（最新参数），另外一个 Q-network 用来计算 Q 现实（参数较老）**，我们用 `Q估计` 的神经网络估计 `Q现实` 中 `Qmax(s', a')` 的最大动作值. 然后用这个被 `Q估计` 估计出来的动作来选择 `Q现实` 中的 `Q(s')`. 

<img src="https://gitee.com/veal98/images/raw/master/img/20201111093036.png" style="zoom:67%;" />

即 Double DQN 的损失函数为：

<img src="https://gitee.com/veal98/images/raw/master/img/20201111092624.png" style="zoom:50%;" />

## 6. Dueling DQN

只要稍稍修改 DQN 中神经网络的结构, 就能大幅提升学习效果, 加速收敛. 这种新方法叫做 Dueling DQN. 用一句话来概括 Dueling DQN 就是. 它将每个动作的 Q 拆分成了 state 的 Value 加上 每个动作的 Advantage.

<img src="https://gitee.com/veal98/images/raw/master/img/20201101122106.png" style="zoom:40%;" />

本来的 DQN 就是直接输出 Q 函数的值。现在这个 dueling 的 DQN，它不直接输出 Q 函数的值，它分成两条 path 去运算，**第一个 path 算出一个标量 $V(s)$ 即每列的平均值**。因为它跟输入 s 是有关系，所以叫做 V(s)。**第二个path 会输出一个向量 $A(s,a)$ 即分别使用每列的数据减去该列的平均值**，该向量具有列零和特征。

把 $V(s)$ 和 $A(S,a)$ 加起来就得到 Q 函数的值

<img src="https://gitee.com/veal98/images/raw/master/img/20201028211522.png" style="zoom: 22%;" />

## 7. 基于 CartPole 的 DQN 实现

```python
import tensorflow
from tensorflow import keras
import wandb # 在线模型可视化工具
import gym
import argparse # argparse是一个Python模块：命令行选项、参数和子命令解析器。
import numpy as np
from collections import deque
import random
```

> 💡 wandb 是一款在线模型可视化工具，参见 [wandb.com](https://www.wandb.com/)

```python
wandb.init(name='DQN', project="rl_tf2")
```

> 💡 `argparse `是一个Python模块：命令行选项、参数和子命令解析器. <u>我们可以利用该模块定义常用参数, 使程序易读</u>

```python
parser = argparse.ArgumentParser()

parser.add_argument('--gamma', type = float, default = 0.95) # 折扣系数
parser.add_argument('--lr', type = float, default = 0.005) # 学习率
parser.add_argument('--batch_size', type=int, default = 32) # 每次训练/采样的数据量
parser.add_argument('--buffer_limit', type=int, default = 10000) # 经验回放池存储的最大数据量
parser.add_argument('--epsilon', type=float, default = 1.0) # ε-greedy
# epsilon 概率会从 100% 到 1% 衰减，越到后面越使用 Q 值最大的动作
parser.add_argument('--epsilon_decay', type=float, default = 0.995) # ε的衰减速率
parser.add_argument('--epsilon_min', type=float, default = 0.01) # ε最小值

args = parser.parse_known_args()[0] # 获取参数
# parser.parse_args() 出错了，不知道为啥
```



```python
# 经验回放池
class ReplayBuffer:
    def __init__(self):
        # 双向队列,利用 ReplayBuffer 类中的 Deque 对象来实现经验回放池的功能
        self.buffer = deque(maxlen = args.buffer_limit)
        
    # 将最新数据(s,a,r,s',done)存入回放池
    # done 表示游戏是否结束
    def put(self, state, action, reward, next_state, done):
        self.buffer.append([ state, action, reward, next_state, done])
    
    # 从回放池中随机抽样
    def sample(self):
        # 从回放池随机采样 batch_size = 32 个 5 元组
        sample = random.sample(self.buffer, args.batch_size)
        states, actions, rewards, next_states, done = map(np.asarray, zip(*sample))
        states = np.array(states).reshape(args.batch_size, -1)
        next_states = np.array(next_states).reshape(args.batch_size, -1)
        return states, actions, rewards, next_states, done
    
    # 回放池中的数据量
    def size(self):
        return len(self.buffer)
```





```python
# 构建模型
class Model:
    def __init__(self, state_dim, action_dim):
        self.state_dim  = state_dim
        self.action_dim = action_dim
        self.epsilon = args.epsilon
        self.model = self.create_model() # 构建模型
    
    # 构建模型
    def create_model(self):
        model = keras.models.Sequential([
            keras.layers.Input((self.state_dim, )), # 输入层
            keras.layers.Dense(32, activation = 'relu'), # 隐藏层
            keras.layers.Dense(16, activation = 'relu'), # 隐藏层
            keras.layers.Dense(self.action_dim) # 输出层
        ])
        model.compile(loss='mse', optimizer = keras.optimizers.Adam(args.lr))
        return model
    
    # 预测(输出的是当前状态下对应每个动作的Q值）
    def predict(self, state):
        return self.model.predict(state)
    
    # 根据当前状态下的最大 Q 值选取动作（ε-greedy)
    def get_action(self, state):
        state = np.reshape(state, [1, self.state_dim])
        self.epsilon *= args.epsilon_decay # epsilon 不断衰减
        self.epsilon = max(self.epsilon, args.epsilon_min)
        q_value = self.predict(state)[0] 
        if np.random.random() < self.epsilon:
            # 有 epsilon 的概率随机选择动作
            return random.randint(0, self.action_dim - 1)
        return np.argmax(q_value)
    
    # 训练模型（利用 Q 现实来训练网络)
    def train(self, states, targets):
        self.model.fit(states, targets, epochs = 1, verbose = 0)
```



```python
class Agent:
    def __init__(self, env):
        self.env = env
        self.state_dim = self.env.observation_space.shape[0] # 状态表示，神经网络的输入个数
        self.action_dim = self.env.action_space.n # 动作个数，神经网络的输出个数
        
        self.model = Model(self.state_dim, self.action_dim) # Q 估计
        self.target_model = Model(self.state_dim, self.action_dim) # Q 现实
        self.target_update() # 将 Q 估计网络的参数赋给 Q 现实）
        
        self.buffer = ReplayBuffer()
    
    # 将 Q 估计网络的参数赋给 Q 现实
    def target_update(self):
        weights = self.model.model.get_weights()
        self.target_model.model.set_weights(weights)
    
    # 训练网络 ，更新 Q 估计参数
    def replay(self):
        for _ in range(10):
            states, actions, rewards, next_states, done = self.buffer.sample() # 从回放池采样
            targets = self.target_model.predict(states) # Q 估计
            next_q_values = self.target_model.predict(next_states).max(axis=1) 
            targets[range(args.batch_size), actions] = rewards + (1-done) * args.gamma * next_q_values  # Q 现实
            self.model.train(states, targets)
    
    def train(self, max_episodes=1000):
        # 最多训练 1000 次
        for episode in range(max_episodes):
            done, total_reward = False, 0
            state = self.env.reset()
            while not done:
                action = self.model.get_action(state)
                next_state, reward, done, _ = self.env.step(action)
                self.buffer.put(state, action, reward*0.01, next_state, done)
                total_reward += reward
                state = next_state
                
            # 当经验池中大于 32 条数据时再进行训练
            if self.buffer.size() >= args.batch_size:
                self.replay()
                
            self.target_update() # 将 Q 估计网络的参数赋给 Q 现实
            
            print('Episode{} EpisodeReward={}'.format(episode, total_reward))
            wandb.log({'Reward': total_reward})
            
```

运行程序：

```python
def main():
    env = gym.make('CartPole-v1')
    agent = Agent(env)
    agent.train(max_episodes=1000)

if __name__ == "__main__":
    main()
```



## 📚 References

- [Bilibili - 李宏毅《深度强化学习》](https://www.bilibili.com/video/BV1MW411w79n)
- [Github - LeeDeepRL - Notes](https://datawhalechina.github.io/leedeeprl-notes/)
- [CSDN - 李宏毅深度强化学习笔记 - jessie](https://blog.csdn.net/cindy_1102/article/details/87904928)
- [强化学习纲要](https://github.com/zhoubolei/introRL)
- [莫烦 Python — 强化学习](https://mofanpy.com/tutorials/machine-learning/reinforcement-learning/intro-RL-methods/)
- [DQN从入门到放弃5 深度解读DQN算法](https://zhuanlan.zhihu.com/p/21421729)
- 👍 [Github - Deep-Learning-with-TensorFlow-book](https://github.com/dragen1860/Deep-Learning-with-TensorFlow-book)
- [Github - DeepRL-TensorFlow2](https://github.com/marload/DeepRL-TensorFlow2) - 🐋 Simple implementations of various popular Deep Reinforcement Learning algorithms using TensorFlow2