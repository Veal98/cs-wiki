# 🏈 Sarsa 算法

---

> 💡 **Sarsa** 属于 Value-Based、Model-Free、单步更新(MC)、On-Policy
>
> 和 Q-Learning 的不同之处就是 Sarsa 是在线学习的，而 Q-Learning 是离线学习

## 1. Sarsa 决策

![](https://gitee.com/veal98/images/raw/master/img/20201031092605.png)

**Sarsa 的决策部分和 Q learning 一模一样**, 因为我们使用的是 Q 表的形式决策, 所以我们会在 Q 表中挑选值较大的动作值施加在环境中来换取奖惩. 但是**不同的地方在于 Sarsa 的更新方式是不一样的** 👇

## 2. 更新 Q-Table

同样, 我们会经历正在写作业的状态 s1, 然后再挑选一个带来最大潜在奖励的动作 a2, 这样我们就到达了 继续写作业状态 s2, 而在这一步, **如果你用的是 Q learning, 你会观看一下在 s2 上选取哪一个动作会带来最大的奖励 Q 值, 但是在真正要做决定时, 却不一定会选取到那个带来最大奖励的动作（由于 `ε-greedy` 策略的存在，所以我们的决策并不一定就是 Q 值最大的那个行为，有 `1-ε` 的概率会进行随机选择）**, Q-learning 在这一步只是估计了一下接下来的动作值. 

**而 Sarsa 是实践派, 他说到做到, 在 s2 这一步估算的动作也是接下来要做的动作（估算的时候就会使用 `ε-greedy` 策略，而不是直接根据最大 Q 值）**. 所以 Q(s1, a2) 现实的计算值, 我们也会稍稍改动, 去掉maxQ, 取而代之的是在 s2 上我们实实在在选取的 a2 的 Q 值. 最后像 Q learning 一样, 求出现实和估计的差距 并更新 Q 表里的 Q(s1, a2).

![](https://gitee.com/veal98/images/raw/master/img/20201031092648.png)

也就是说，Qlearning 的下一个 状态下的 action 在算法更新的时候都还是不确定的 (off-policy). 而 Sarsa 的下一个 状态下的 action 在这次算法更新的时候已经确定好了 (on-policy).

## 3. Sarsa 整体算法

![](https://gitee.com/veal98/images/raw/master/img/20201031094353.png)

从算法来看, 这就是他们两最大的不同之处了. 因为 Sarsa 是说到做到型, 所以我们也叫他 on-policy, 在线学习, 学着自己在做的事情. 而 Q learning 是说到但并不一定做到, 所以它也叫作 Off-policy, 离线学习. 

而因为有了 maxQ, Q-learning 也是一个特别勇敢的算法。因为 Q learning 机器人 永远都会选择最近的一条通往成功的道路, 不管这条路会有多危险. 而 Sarsa 则是相当保守, 他会选择离危险远远的, 拿到宝藏是次要的, 保住自己的小命才是王道. 这就是使用 Sarsa 方法的不同之处.

![](https://gitee.com/veal98/images/raw/master/img/20201031100809.png)

## 4. Sarsa 实例

以上次 Q-Learning 的迷宫问题为例，环境模块我们不变，首先编写算法的整体框架：

```python
from maze_env import Maze
from RL_brain import SarsaTable

def update():
    for episode in range(100):
        # 初始化环境
        observation = env.reset()

        # Sarsa 根据 state 观测选择行为
        action = RL.choose_action(str(observation))

        while True:
            # 刷新环境
            env.render()

            # 在环境中采取行为, 获得下一个 state_ (obervation_), reward, 和是否终止
            observation_, reward, done = env.step(action)

            # 根据下一个 state (obervation_) 选取下一个 action_
            action_ = RL.choose_action(str(observation_))

            # 从 (s, a, r, s, a) 中学习, 更新 Q_tabel 的参数 ==> Sarsa
            RL.learn(str(observation), action, reward, str(observation_), action_)

            # 将下一个当成下一步的 state (observation) and action
            observation = observation_
            action = action_

            # 终止时跳出循环
            if done:
                break

    # 大循环完毕
    print('game over')
    env.destroy()

if __name__ == "__main__":
    env = Maze()
    RL = SarsaTable(actions=list(range(env.n_actions)))

    env.after(100, update)
    env.mainloop()
```

其实和 Q-Learning 的差别只有下面这几行：

```python
------------------Sarsa-----------------------------
# 从 (当前状态 s, 在该状态下选择的 action,该 action 获得的 reward, 下一个状态 state_, 在下一个状态下选择的 action_) 中学习, 更新 Q_tabel 的参数 ==> Sarsa
RL.learn(str(observation), action, reward, str(observation_), action_)

# 将下一个当成下一步的 state (observation) and action
observation = observation_
action = action_
            
------------------Q-Learning-----------------------------
 # RL 从这个序列 (当前状态 state, 在该状态下选择的 action, 该 action 获得的 reward, 下一个状态 state_) 中学习
RL.learn(str(observation), action, reward, str(observation_))

# 将下一个 state 的值传到下一次循环
observation = observation_
```

接下来我们定义 Q-Table 的构造以及更新方法。和之前定义 Qlearning 中的 `QLearningTable` 差不多

```python
class SarsaTable:
    # 初始化 (与之前一样)
    def __init__(self, actions, learning_rate=0.01, reward_decay=0.9, e_greedy=0.9):

    # 选行为 (与之前一样)
    def choose_action(self, observation):

    # 学习更新参数 (有改变)
    def learn(self, s, a, r, s_):

    # 检测 state 是否存在 (与之前一样)
    def check_state_exist(self, state):
```

我们可以定义一个 父类 `RL`, 然后将 `QLearningTable` 和 `SarsaTable` 作为 `RL` 的衍生, 我们将之前的 `__init__`, `check_state_exist`, `choose_action`, `learn` 全部都放在这个主结构中, 之后根据不同的算法更改对应的内容就好了. 

```python
import numpy as np
import pandas as pd


class RL(object):
    def __init__(self, action_space, learning_rate=0.01, reward_decay=0.9, e_greedy=0.9):
        ... # 和 QLearningTable 中的代码一样

    def check_state_exist(self, state):
        ... # 和 QLearningTable 中的代码一样

    def choose_action(self, observation):
        ... # 和 QLearningTable 中的代码一样

    def learn(self, *args):
        pass # 每种的都有点不同, 所以用 pass
```

> 💡 如果是这样定义父类的 `RL` class, 通过继承关系, 那之子类 `QLearningTable` class 就能简化成这样:
>
> ```python
> class QLearningTable(RL):   # 继承了父类 RL
>     def __init__(self, actions, learning_rate=0.01, reward_decay=0.9, e_greedy=0.9):
>         super(QLearningTable, self).__init__(actions, learning_rate, reward_decay, e_greedy)    # 表示继承关系
> 
>     def learn(self, s, a, r, s_):   # learn 的方法在每种类型中有不一样, 需重新定义
>         self.check_state_exist(s_)
>         q_predict = self.q_table.loc[s, a]
>         if s_ != 'terminal':
>             q_target = r + self.gamma * self.q_table.loc[s_, :].max()
>         else:
>             q_target = r
>         self.q_table.loc[s, a] += self.lr * (q_target - q_predict)
> ```

有了父类的 `RL`, 我们这次的编写就很简单, 只需要编写 `SarsaTable` 中 `learn` 这个功能就完成了. 因为其他功能都和父类是一样的. 这就是我们所有的 `SarsaTable` 于父类 `RL` 不同之处的代码 👇

```python
class SarsaTable(RL):   # 继承 RL class

    def __init__(self, actions, learning_rate=0.01, reward_decay=0.9, e_greedy=0.9):
        super(SarsaTable, self).__init__(actions, learning_rate, reward_decay, e_greedy)    # 表示继承关系

    def learn(self, s, a, r, s_, a_):
        self.check_state_exist(s_)
        q_predict = self.q_table.loc[s, a]
        if s_ != 'terminal':
            q_target = r + self.gamma * self.q_table.loc[s_, a_]  # q_target 基于选好的 a_ 而不是 Q(s_) 的最大值
        else:
            q_target = r  # 如果 s_ 是终止符
        self.q_table.loc[s, a] += self.lr * (q_target - q_predict)  # 更新 q_table
```

## 📚 References

- [Bilibili - 李宏毅《深度强化学习》](https://www.bilibili.com/video/BV1MW411w79n)
- [Github - LeeDeepRL - Notes](https://datawhalechina.github.io/leedeeprl-notes/)
- [CSDN - 李宏毅深度强化学习笔记 - jessie](https://blog.csdn.net/cindy_1102/article/details/87904928)
- [强化学习纲要](https://github.com/zhoubolei/introRL)
- [莫烦 Python — 强化学习](https://mofanpy.com/tutorials/machine-learning/reinforcement-learning/intro-RL-methods/)