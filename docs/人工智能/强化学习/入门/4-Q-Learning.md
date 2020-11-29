# 🌄 Q-learning 算法

---

> 💡 **Q-Learning** 属于 Value-Based、Model-Free、单步更新(MC)、Off-Policy

## 1. 行为准则

我们做事情都会有一个自己的行为准则, 比如小时候爸妈常说”不写完作业就不准看电视”. 所以我们在 写作业的这种状态下, 好的行为就是继续写作业, 直到写完它, 我们还可以得到奖励, 不好的行为 就是没写完就跑去看电视了, 被爸妈发现, 后果很严重. 小时候这种事情做多了, 也就变成我们不可磨灭的记忆. Q learning 也是这样一个决策过程

![](https://gitee.com/veal98/images/raw/master/img/20201030163620.png)

假设现在我们处于写作业的状态而且我们以前并没有尝试过写作业时看电视, 所以现在我们有两种选择：1 继续写作业，2 跑去看电视. 因为以前没有被罚过, 所以我选看电视, 然后现在的状态变成了看电视, 我又选了继续看电视, 接着我还是看电视, 最后爸妈回家, 发现我没写完作业就去看电视了, 狠狠地惩罚了我一次, 我也深刻地记下了这一次经历, <u>并在我的脑海中将 “没写完作业就看电视” 这种行为更改为负面行为</u>,  Q learning 就是根据很多这样的经历来做出一次又一次的决策 👇

## 2. Q-Learning 决策

假设我们的行为准则已经学习好了, 现在我们处于状态 s1, 我在写作业, 我有两个行为可供选择 a1, a2, 分别是看电视和写作业, 根据我的经验, 在这种 s1 状态下, a2 写作业 带来的未来奖励要比 a1 看电视高, 这里的未来奖励我们可以用一个有关于 s 和 a 的 Q 表格表示, 在我的记忆 Q 表格中, $Q(s1, a1) = -2$ 要小于 $Q(s1, a2)=1$, 所以我们判断要选择 a2 作为下一个行为. 

>  💡 **Q-Learning 的最终目标就是获取一张有效的 Q-Table**。Q-Table 就是 状态 s 和 动作 a 与 估计的未来奖励 $Q(s,a)$ 之间的映射表

![](https://gitee.com/veal98/images/raw/master/img/20201030164038.png)

现在我们的状态更新成 s2 , 我们还是同样的有两个选择, 重复上面的过程, 在行为准则 Q 表中寻找 Q(s2, a1) 和 Q(s2, a2) 的值, 并比较他们的大小, 选取较大的一个. 接着根据 a2 我们到达 s3 并在此重复上面的决策过程. Q learning 的方法也就是这样决策的. 

接下来我们来研究一下这张行为准则 Q 表是通过什么样的方式进行更新的 👇

## 3. 更新 Q-Table

根据 Q 表的估计, 因为在 s1 中, a2 的值比较大, 通过之前的决策方法, 我们在 s1 采取了 a2, 并到达 s2, 这时我们开始更新用于决策的 Q 表 👇

🚨 **在状态 s2 的时候，我们并没有在实际中采取任何行为, 而是想象自己在 s2 上采取了每种行为, 分别看看两种行为哪一个的 Q 值大，<u>因为我们需要根据 s2 状态的反馈来更新在 s1 状态做出的决策得到的奖励</u>**。比如说 Q(s2, a2) 的值比 Q(s2, a1) 的大, 我们把大的 Q(s2, a2) 乘上一个衰减值 $\gamma $ (比如是0.9) 并加上到达 s2 时所获取的奖励 R , 我们将这个作为现实中 Q(s1, a2) 的值, 而 Q 表中暂未更新的是估计的 Q(s1, a2) 值。所以有了现实和估计值, 我们就能更新 Q(s1, a2) , 根据 估计与现实的差距, 将这个差距乘以一个学习效率  $\alpha$ 累加上老的 Q(s1, a2) 的值 变成新的值. 

![](https://gitee.com/veal98/images/raw/master/img/20201030164659.png)

⭐ <u>时刻记住, 我们虽然用 maxQ(s2) 估算了一下 s2 状态, 但还没有在 s2 做出任何的行为, s2 的行为决策要等到更新完了 $Q(s_1)$ 以后再重新另外做（由于 `ε-greedy` 策略的存在，所以我们的决策并不一定就是 Q 值最大的那个行为，有 `1-ε` 的概率会进行随机选择）</u>。这就是 off-policy 的 Q learning 是如何决策和学习优化决策的过程.

## 4. Q-Learning 整体算法

![](https://gitee.com/veal98/images/raw/master/img/20201030165305.png)

整个算法就是一直不断更新 Q table 里的值, 然后再根据新的值来判断要在某个 state 采取怎样的 action. 

**Qlearning 是一个 off-policy 的算法, 因为里面的 `max` action 让 Q table 的更新可以不基于正在经历的经验(可以是现在学习着很久以前的经验,甚至是学习他人的经验)**. 

下面解释一下这里面出现的一些符号

### ① 折扣系数/衰减因子 γ

 $Q(s_1,a_2)$ 现实的更新过程如下：

![](https://gitee.com/veal98/images/raw/master/img/20201030170158.png)

**可以看出 Q(s1) 是有关于之后所有的奖励**, 但这些奖励由于加入了 **【折扣系数/衰减因子 discount factor $\gamma$】** 正在衰减, 离 s1 越远的状态衰减越严重

💡 γ∈[0,1]，越往后 $\gamma^n$ 就会越小，**越后面的收益对当前价值的影响就会越小，也就是说我们更希望获得即使的收益**。举个股票的例子：

![](https://gitee.com/veal98/images/raw/master/img/20201028100853.png)

### ② 策略改进：ε-greedy

`ε-greedy` 是用在决策上的一种策略改进方法, 有 ε 的概率随机选择行为。比如 epsilon = 0.9 时, 就说明有 90% 的情况会按照 Q 表的最优值选择行为, 10% 的概率随机选择行为。

`ε-greedy` 策略的存在有助于 Agent 去不断的进行探索

<img src="https://gitee.com/veal98/images/raw/master/img/20201110210918.png" style="zoom:50%;" />

### ③ 学习率 α

α 是学习率, 来**决定这次的误差有多少是要被学习的**, α 是一个小于1 的数

### ④ 举例

💬 举个例子：

**Step 1**：初始化Q矩阵，比如都设置为0

<img src="https://gitee.com/veal98/images/raw/master/img/20201110214543.png" style="zoom: 50%;" />

**Step 2**：开始实验。根据当前Q矩阵及$\epsilon-greedy$方法获取动作。比如当前处在状态s1，那么在s1一列每一个Q值都是0，那么这个时候随便选择都可以。

假设我们选择 a2 动作，然后得到的 reward 是 1，并且进入到 s3 状态，接下来我们要根据

<img src="https://gitee.com/veal98/images/raw/master/img/20201110214634.png" style="zoom: 80%;" />

> 🚨 上图中应该是 $Q_{S_{t+1},A_{t+1}}$，懒得改了，兄弟们知道就好

来更新Q值，这里我们假设 $α = 1，λ = 1$，也就是每一次都把目标Q值赋给Q。那么这里公式变成：

<img src="https://gitee.com/veal98/images/raw/master/img/20201110214810.png" style="zoom: 80%;" />

所以在这里，就是

<img src="https://gitee.com/veal98/images/raw/master/img/20201110214940.png" style="zoom:80%;" />

那么对应的s3状态，最大值是0，所以<img src="https://gitee.com/veal98/images/raw/master/img/20201110214954.png" style="zoom:80%;" />,Q表格就变成：

<img src="https://gitee.com/veal98/images/raw/master/img/20201110215009.png" style="zoom:80%;" />

**Step 3**：接下来就是进入下一次动作，这次的状态是s3，假设选择动作a3，然后得到1的reward，状态变成s1，那么我们同样进行更新：

<img src="https://gitee.com/veal98/images/raw/master/img/20201110215027.png" style="zoom:80%;" />

所以Q的表格就变成：

<img src="https://gitee.com/veal98/images/raw/master/img/20201110215043.png" style="zoom:80%;" />

**Step 4**： 反复上面的方法。就是这样，Q值在试验的同时反复更新。直到收敛。

## 5. Q-Learning 代码实例

我们来说一个更具体的例子. 让探索者学会走迷宫. 黄色的是出口 (reward 1), 黑色的墙壁 (reward -1). 

最终效果可参见 👉  https://mofanpy.com/static/results/reinforcement-learning/maze%20q.mp4

首先我们先来编写 Q-Learning 算法的整体步骤， import 两个模块, `maze_env` 是我们的环境模块, 可以不深入研究，使用的是 python 自带的简单 GUI 模块 `tkinter` 来编写虚拟环境（后面我们会讲到使用 Gym 来创建环境）. 而 `RL_brain` 这个模块是 RL 的大脑部分

```python
from maze_env import Maze
from RL_brain import QLearningTable
```

大多数 RL 是由 reward 导向的, 所以定义 reward 是 RL 中比较重要的一点，下面代码存在于环境模块中：

```python
		# reward function
        if s_ == self.canvas.coords(self.oval):
            reward = 1
            done = True
            s_ = 'terminal'
        elif s_ in [self.canvas.coords(self.hell1), self.canvas.coords(self.hell2)]:
            reward = -1
            done = True
            s_ = 'terminal'
        else:
            reward = 0
            done = False

        return s_, reward, done
```

下面的代码, 我们可以根据上面图片中的算法对应起来, 这就是 Qlearning 算法的整体迭代更新的步骤

```python
def update():
    # 学习 100 回合
    for episode in range(100):
        # 初始化 state 的观测值
        observation = env.reset()

        while True:
            # 更新可视化环境
            env.render()

            # RL 大脑根据 state 的观测值挑选 action
            action = RL.choose_action(str(observation))

            # 探索者在环境中实施这个 action, 并得到环境返回的下一个 state 观测值, reward 和 done (是否是掉下地狱或者升上天堂)
            observation_, reward, done = env.step(action)

            # RL 从这个序列 (state, action, reward, state_) 中学习
            RL.learn(str(observation), action, reward, str(observation_))

            # 将下一个 state 的值传到下一次循环
            observation = observation_

            # 如果掉下地狱或者升上天堂, 这回合就结束了
            if done:
                break

    # 结束游戏并关闭窗口
    print('game over')
    env.destroy()

if __name__ == "__main__":
    # 定义环境 env 和 RL 方式
    env = Maze()
    RL = QLearningTable(actions=list(range(env.n_actions)))

    # 开始可视化环境 env
    env.after(100, update)
    env.mainloop()
```

> 💡 **Qlearning 是一个 off-policy 的算法, 因为里面的 `max` action 让 Q table 的更新可以不基于正在经历的经验(可以是现在学习着很久以前的经验,甚至是学习他人的经验)**. 不过这一次的例子, 我们没有运用到 off-policy, 而是把 Qlearning 用在了 on-policy 上, 也就是 agent 边互动边学习, 将现在经历的直接当场学习并运用. 

RL-Brain 就是 Q-Table 的构建以及更新的方法：

我们必须将所有的 Q values (行为值) 放在 `q_table` 中, 更新 `q_table` 也是在更新他的行为准则. `q_table` 的 index 是所有对应的 `state` (探索者位置), columns 是对应的 `action` (探索者行为).

```python
"""
This part of code is the Q learning brain, which is a brain of the agent.
All decisions are made in here.
"""
import numpy as np
import pandas as pd

# Q-Table 的构造和更新方法
class QLearningTable:
    # 初始化
    def __init__(self, actions, learning_rate=0.01, reward_decay=0.9, e_greedy=0.9):
        self.actions = actions  # a list
        self.alpha = learning_rate # 学习率
        self.gamma = reward_decay   # 奖励衰减
        self.epsilon = e_greedy     # 贪婪度
        self.q_table = pd.DataFrame(columns=self.actions, dtype=np.float64)   # 初始 q_table
        
        
    # 选行为
    def choose_action(self, observation):
        self.check_state_exist(observation) # 检测本 state 是否在 q_table 中存在

        # 选择 action（ε-greedy)
        if np.random.uniform() < self.epsilon:  # 选择 Q value 最高的 action
            state_action = self.q_table.loc[observation, :]

            # 同一个 state, 可能会有多个相同的 Q action value, 所以我们乱序一下
            action = np.random.choice(state_action[state_action == np.max(state_action)].index)

        else:   # 随机选择 action
            action = np.random.choice(self.actions)

        return action
    
    # 学习更新参数(s_ 表示下一个状态）
    def learn(self, s, a, r, s_):
        self.check_state_exist(s_)  # 检测 q_table 中是否存在 s_ 
        q_predict = self.q_table.loc[s, a] # q 估计
        if s_ != 'terminal': # 下个 state 不是 终止符
            q_target = r + self.gamma * self.q_table.loc[s_, :].max() # q 现实
        else: # 下个 state 是终止符
            q_target = r  
        self.q_table.loc[s, a] += self.alpha * (q_target - q_predict)  # 更新对应的 state-action 值
    
    # 检测 state 是否存在于 Q-Table 中，如果没有就加入
    def check_state_exist(self, state):
        if state not in self.q_table.index:
            # append new state to q table
            self.q_table = self.q_table.append(
                pd.Series(
                    [0]*len(self.actions),
                    index=self.q_table.columns,
                    name=state,
                )
            )
```

## 📚 References

- [Bilibili - 李宏毅《深度强化学习》](https://www.bilibili.com/video/BV1MW411w79n)
- [Github - LeeDeepRL - Notes](https://datawhalechina.github.io/leedeeprl-notes/)
- [CSDN - 李宏毅深度强化学习笔记 - jessie](https://blog.csdn.net/cindy_1102/article/details/87904928)
- [强化学习纲要](https://github.com/zhoubolei/introRL)
- [莫烦 Python — 强化学习](https://mofanpy.com/tutorials/machine-learning/reinforcement-learning/intro-RL-methods/)

