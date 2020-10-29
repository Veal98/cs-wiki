# 🌄 Q-learning

---

## 1. Critic 

**Q-learning 是 `value-based` 的方法。在 value based 的方法里面，我们 learn 的不是策略 policy，我们要 learn 的是一个 `critic`。** <u>【Critic 并不直接采取行为，它想要做的事情是评价现在的行为有多好或是有多不好】</u> 假设有一个 actor 中 policy 的参数是 π ，critic 就是来评价这个 π 好还是不好，即 `Policy Evaluation(策略评估)`。

critic 分两种：

<img src="https://gitee.com/veal98/images/raw/master/img/20201027214935.png" style="zoom:55%;" />

## 2. State-Value Function 状态价值函数

### ① 相关概念

有一种 critic 叫做 `state value function`。**我们用 $V^{\pi}(s)$ 表示这个价值函数： actor $\pi$ 到达状态 $s$ 后，期望得到的累计收益 `accumulated reward` 是 $V^{\pi}(s)$**

<img src="https://gitee.com/veal98/images/raw/master/img/20201028100545.png" style="zoom:67%;" />

上式中的 $G_t$ 表示加入**【折扣系数/衰减因子 discount factor $\gamma$】**后的期望总收益：

<img src="https://gitee.com/veal98/images/raw/master/img/20201028100709.png" style="zoom:67%;" />

💡 γ∈[0,1]，越往后 $\gamma^n$ 就会越小，**越后面的收益对当前价值的影响就会越小，也就是说我们更希望获得即使的收益**。举个股票的例子：

![](https://gitee.com/veal98/images/raw/master/img/20201028100853.png)

显然 `state value function` 依赖于你的 actor。当 actor 变的时候，`state value function` 的输出也会跟着发生改变。

### ② 计算状态价值函数 V

**怎么计算这个 `state value function`  $V^{\pi}(s)$ 呢？**有两种不同的做法：**基于蒙特卡洛的方法 Monte-Carlo (MC)** 和 **基于时序分差的方法 Temporal-difference (TD)**。

#### Ⅰ MC-based

**基于蒙特卡洛的方法**：critic 观察 π 进行游戏的整个过程, 直到该**游戏回合结束**再计算累积收益

- actor 如果看到 state $s_a$，从该状态直到游戏结束的期望累计收益 accumulated reward （记为 $G_a$）会有多大。
- actor 如果看到 state $s_b$，从该状态直到游戏结束的期望累计收益 accumulated reward （记为 $G_b$）会有多大。
- ..........

显然，你不可能把所有的 state 通通都扫过。**$V^{\pi}(s)$ 实际上是一个网络**。对一个网络来说，就算输入的状态 s 是从来都没有看过的，它也可以想办法估测一个 value 的值：

<img src="https://gitee.com/veal98/images/raw/master/img/20201027212613.png" style="zoom:22%;" />

**这个网络输出的 期望累计收益 和 实际累计收益 越近越好**，根据这一点我们来训练这个网络，其实就是一个回归问题 regression problem。

#### Ⅱ TD-based

**基于时序分差的方法**：对于 MC-based 来说，**有时一个游戏回合可能会很长，等到游戏回合结束再计算收益的方法训练起来会很慢**，因此引入另外一种方法 Temporal-difference（TD）。时序分差算法计算的是**两个状态之间的收益差**。

TD based 的方法不需要把游戏玩到底，只要在游戏的某一个状态 $s_t$  的时候，采取动作 $a_t$ 得到 reward $r_t$ ，并转移到状态 $s_{t+1}$，就可以应用 TD 的方法

<img src="https://gitee.com/veal98/images/raw/master/img/20201027214020.png" style="zoom:60%;" />

这个网络输出的 期望累计收益 和 下一状态的期望累计收益 之间的 差值 与 实际差值 越近越好，根据这一点我们来训练这个网络。

<img src="https://gitee.com/veal98/images/raw/master/img/20201027214055.png" style="zoom:20%;" />

#### Ⅲ MC vs. TD

由于从游戏中获取的收益是一个随机变量，而 MC 方法是各状态下收益的加总，相对而言，MC 方法得到的累积收益 G 的**方差会很大**.

相比较而言，TD只考虑状态之间的收益差，因此方差较小，但是由于没有从整体收益进行考虑，因此该方法的准确性不能得到保证

## 3. State-Action Value Function 状态动作价值函数

💡 <u>还有另外一种 critic，这种 critic 叫做 `Q-function`，又叫做 `state-action value function`</u>。

- `state value function` 的输入是一个状态 s，根据状态 s 计算出期望得到的累计收益 `accumulated reward`

- **`state-action value function` 的输入是一个状态 s 跟动作 a，它的意思是说，在某一个状态 s 采取某一个动作 a，假设我们都使用 actor π ，得到的期望累计收益有多大，记作 $Q^{\pi}(s,a)$ 。**

  <img src="https://gitee.com/veal98/images/raw/master/img/20201028101309.png" style="zoom:80%;" />

有一个需要注意的问题是，这个 actorπ，在看到状态 s 的时候，它实际上采取的动作不一定是 a。但是 **state-action value function 假设在状态 s 下【强制】采取动作 a**。

Q-function 有两种写法：

- input 是 state 跟 action，output 就是一个标量 $Q^{\pi}(s,a)$；
- input 只有一个 state s，output 就是多个值，即考虑该状态下的所有动作 $Q^{\pi}(s,a)$。

<img src="https://gitee.com/veal98/images/raw/master/img/20201027215750.png" style="zoom:22%;" />

<u>同样的，对于 Q-Function 的计算可以使用 MC-based 和 TD-based</u>

## 4. Q-Table

⭐ **Q-Learning 的最终目标就是获取一张有效的 Q-Table**。

👉 Q-Table 就是 状态 s - 动作 a 与 估计的未来奖励 $Q^{\pi}(s,a)$ 之间的映射表，如下图所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20201025112152.png" style="zoom: 60%;" />

- Q-Table 的行表示状态
- Q-Table 的列表示动作

**为了获取 Q-Table 中的数据，我们可以使用 Q-Learning 算法** 👇

## 5. Q-Learning

### ① 概念

Q-Learning 的步骤如下：

- 🔸 使用一个初始的 actor π 与环境进行互动

- 🔸 学习该 actor 对应的 `Q function / state-action value function`

- 🔸 一定存在另外一个表现更好的 actor π ′  , 用这个**【更好的 actor π ′ 】**来替代原来的 actor π

  更好的 π ′ 的含义是，对于所有的状态 s，一定有 “ 采取 π ′ 获得的状态价值函数不小于 π 得到的状态价值函数 ”，那么 π ′  就是由对 Q 求 argmax 返回的 actor：

  <img src="https://gitee.com/veal98/images/raw/master/img/20201027220833.png" style="zoom:40%;" />

- 🔸 重复上述步骤

<img src="https://gitee.com/veal98/images/raw/master/img/20201027220349.png" style="zoom: 40%;" />

🚨 **Tips:**

- π ′ 不包含额外的参数，它只取决于 Q
- **对于连续的动作不适用**（下文会讲解如何解决该问题）

### ② Target Network

计算 Q 函数的时候也可以使用 TD 方法，也就是说在 $s_t$采取 $a_t$ 以后，你得到 reward $ r_t$ ，然后跳到 $s_{t+1}$：

<img src="https://gitee.com/veal98/images/raw/master/img/20201028102430.png" style="zoom:60%;" />

跟 V 函数的计算差不多，但是，在训练的过程中，由 $s_t$ 和 $s_{t+1}$ 生成的值是不固定的，在这种情况下训练会比较困难。

因此，在训练的时候，用来计算 的网络会被固定 $s_{t+1}$ ，称为固定网络，于是，目标问题就变成了一个回归问题。
如下图，当前时间 t 网络生成的 Q 值与下一个时间网络生成的 Q 值（固定）之间应该只相差 $r_t$，因此需要用真实的 $r_t$ 与模型计算出来的 $r_t$ 进行回归逼近。

<img src="https://gitee.com/veal98/images/raw/master/img/20201028102708.png" style="zoom:20%;" />

举个例子说明一下为什么需要固定 Target Network：

猫是 `Q estimation`，老鼠是 `Q target`。一开始的话，猫离老鼠很远，所以我们想让这个猫追上老鼠。因为 Q target 也是跟模型参数相关的，所以每次优化后，Q target 也会动。这就导致一个问题，猫和老鼠都在动。

<img src="https://gitee.com/veal98/images/raw/master/img/20201028105946.png" style="zoom:40%;" />

然后它们就会在优化空间里面到处乱动，就会产生非常奇怪的优化轨迹，这就使得训练过程十分不稳定。所以我们可以固定 Q target，让老鼠动得不是那么频繁，可能让它每 5 步动一次，猫则是每一步都在动。如果老鼠每 5 次动一步的话，猫就有足够的时间来接近老鼠。然后它们之间的距离会随着优化过程越来越小，最后它们就可以拟合，拟合过后就可以得到一个最好的 Q-network。

### ③ Exploration

对于 Q 方程，它是 policy 的基础，这会导致 actor 每次都会选择具有更大 Q 值的行动 action，对于收集数据而言是一个弊端

<img src="https://gitee.com/veal98/images/raw/master/img/20201028114314.png" style="zoom:50%;" />

这就是我们在第一章说过的 `探索-利用窘境(Exploration-Exploitation dilemma)` 。可以采用以下方法解决：

- **Epsilon Greedy** (在训练的过程中 ϵ 的值会逐渐减小)

  下述公式的含义是，在采取 action 的时候，actor 会有 1 − ϵ 的概率选择使得 Q 值最大的 a，随着训练时间变长，ϵ 的值逐渐减小，在后期 actor 选择最大 Q 值对应的 a 才会变大

  ![](https://gitee.com/veal98/images/raw/master/img/20201028114005.png)

- **Boltzmann Exploration** (和 policy gradient 类似, 根据一个概率分布来进行采样)

  ![](https://gitee.com/veal98/images/raw/master/img/20201028114109.png)

### ④ 经验回放 Experience Replay

Experience Replay 会构建一个 `Replay Buffer`，Replay Buffer 又被称为 `Replay Memory`。我们会把所有的数据放到 buffer 里面。每一笔数据的意思就是我们之前在某一个状态 $s_t$，采取某一个动作 $a_t$，得到了奖励 $r_t$，然后跳到另一个状态  $s_{t+1}$。当 Buffer 满的时候，去除旧的数据。

![](https://gitee.com/veal98/images/raw/master/img/20201028115653.png)

**利用 Buffer 中的数据去学习 Q 函数**。当我们这么做的时候， 它变成了一个 `off-policy` 的做法。

🚨 要注意 **replay buffer 里面的数据可能是来自于不同的 policy**

## 6. Deep Q-network (DQN)

DQN 是指基于深度学习的 Q-learning 算法，主要结合了`价值函数近似(Value Function Approximation)`与神经网络技术，并采用了目标网络和经历回放的方法进行网络的训练。

在 Q-learning 中，我们使用 Q-Table 来存储每个状态 s 下采取动作 a 获得的奖励，即状态-动作值函数 Q(s,a)。然而，这种方法在状态量巨大甚至是连续的任务中，会遇到维度灾难问题，往往是不可行的。因此，DQN 采用了价值函数近似的表示方法。

<img src="https://gitee.com/veal98/images/raw/master/img/20201028115617.png" style="zoom:50%;" />

❓ **DQN 和 Q-learning 有什么不同？**

整体来说，DQN 与 Q-learning 的目标价值以及价值的更新方式都非常相似，主要的不同点在于：

- DQN 将 Q-learning 与深度学习结合，用深度网络来近似动作价值函数，而 Q-learning 则是采用表格存储；
- DQN 采用了经验回放的训练方法，从历史数据中随机采样，而 Q-learning 直接采用下一个状态的数据进行学习

## 7. 关于 Q-Learning 的几点建议

### ① Double DQN

由于 Q 值总是基于使得 Q 最大的 action 得出的，因此会趋向于被高估，于是引入 double DQN

![](https://gitee.com/veal98/images/raw/master/img/20201028204819.png)

❓ **为什么 Q 经常被高估**

因为目标值 $r_t+maxQ(s_{t+1}, a)$ 总是倾向于选择被高估的行动 action

**double DQN 是如何工作的？**

使用两个 Q function（因此称为 double）, **一个 Q-network 用来选择行动 action（即该 action 能够获得做大的 Q 值），另外一个 Q-network 用来根据这个 action 计算 Q 值**，<u>通常会选择 target  network 来作为另外一个用于计算 Q 值的 Q’ function</u>

<img src="https://gitee.com/veal98/images/raw/master/img/20201028205738.png" style="zoom: 90%;" />

假设第一个 Q-function 高估了它现在选出来的 action a，那没关系，因为我们并不采用第一个 Q-network 的 Q 值，只要第二个 Q-function Q' 没有高估这个 action a 的 Q 值，那你算出来的就还是正常的值。假设反过来是 Q' 高估了某一个 action 的 Q 值，那也没关系，只要第一个 Q-network 不要选这个 action 就没事了。

### ② Dueling DQN

相较于原来的 DQN，**它唯一的差别是改了网络的架构**。

![](https://gitee.com/veal98/images/raw/master/img/20201028211024.png)

本来的 DQN 就是直接输出 Q 函数的值。现在这个 dueling 的 DQN，它不直接输出 Q 函数的值，它分成两条 path 去运算，**第一个 path 算出一个标量 $V(s)$ 即每列的平均值**。因为它跟输入 s 是有关系，所以叫做 V(s)。**第二个path 会输出一个向量 $A(s,a)$ 即分别使用每列的数据减去该列的平均值**，该向量具有列零和特征。

把 $V(s)$ 和 $A(S,a)$ 加起来就得到 Q 函数的值

<img src="https://gitee.com/veal98/images/raw/master/img/20201028211522.png" style="zoom: 22%;" />

### ③ 优先经验回放 Prioritized Experience Replay

**【优先经验回放】**：简单地说，在训练的过程中，对于在经验 buffer 里面的样本，那些具有更好的TD 误差的样本会有更高的概率被采样，这样可以加快训练速度。

<img src="https://gitee.com/veal98/images/raw/master/img/20201028213309.png" style="zoom:45%;" />

在这个过程中，参数更新的过程也会有相应的更改。

### ④ Balance between MC and TD

MC 跟 TD 的方法各自有各自的优劣，怎么在 MC 跟 TD 里面取得一个平衡呢？

我们的做法是这样，模型学习**多步累积起来的回报 reward**，，也就是说将 MC 和 TD 进行了折中，同时引入了一个超参数，即累积 reward 的步长 N

<img src="https://gitee.com/veal98/images/raw/master/img/20201028214645.png" style="zoom: 22%;" />

### ⑤ Noisy Net

Epsilon Greedy 这样的 exploration 是在 action 上面加噪声 noise，**但是有一个更好的方法叫做`Noisy Net`，它是在参数上面加噪声。**

<img src="https://gitee.com/veal98/images/raw/master/img/20201028214816.png" style="zoom: 22%;" />

### ⑥ Distributional Q-function

状态-行动价值函数 $Q^\pi(s,a)$  是累积收益的期望值，也就是说是价值分布的均值。然而，有的时候不同的分布得到的均值可能一样，但我们并不知道实际的分布是什么。

Distributional Q-function 认为可以输出Q值的分布，当具有相同的均值时，选择具有较小方差（风险）的那一个
但实际上，这个方法很难付诸实践。

<img src="https://gitee.com/veal98/images/raw/master/img/20201028215926.png" style="zoom: 22%;" />

### ⑦ Rainbow

**把刚才所有的方法都综合起来就变成 rainbow 。**给刚才每一个方法赋予一种自己的颜色，把所有的颜色通通都合起来，就变成 rainbow，它把原来的 DQN 也算是一种方法，故有 7 色。

![](https://gitee.com/veal98/images/raw/master/img/20201028220108.png)

## 8. 连续动作下的 Q-Learning

**连续动作：**

在某些情况下，action 是一个**连续向量**。在这种情况下，Q-Learning 并不是一个用来寻找最佳 action 的好方法

我们玩 Atari 的游戏，你的 agent 只需要决定比如说上下左右，这种 action 是分离（discrete）的 。但很多时候你的 action 是连续（continuous）的。举例来说假设你的 agent 要做的事情是开自驾车，它要决定方向盘要左转几度， 右转几度，这是连续的。再比如假设 agent 是一个机器人，它身上有 50 个 关节，它的每一个 action 就对应到它身上的这 50 个关节的角度。而那些角度也是连续的。

如果 action 是连续的，做 Q-learning 就会有困难。因为在做 Q-learning 里面一个很重要的一步是你要能够解这个 最优化问题。你评估出 Q-function Q(s,a) 以后，必须要找到一个 a，它可以让 Q(s,a) 最大。假设 a 是分离的，那 a 的可能性都是有限的。但假如 a 是连续的，你无法穷举所有可能的动作。

**解决方式一：**

因为 a 是没有办法穷举的。我们**抽样**出 N 个 可能的 a，一个一个带到 Q-function 里面，看谁能获得最大的 Q 值

**解决方式二：**

把 a 当作是 parameter，我们的目的是要找一组 a 去最大化 Q-function，可以使用**梯度上升**不断更新 a 的值（具有较高的计算成本）

**解决方式三：**

设计一个网络来使得这个优化过程更简单

<img src="https://gitee.com/veal98/images/raw/master/img/20201029111242.png" style="zoom: 22%;" />

**解决方式四：**

**第 4 招就是不要用 Q-learning。**用 Q-learning 处理 continuous action 还是比较麻烦。

我们讲了 policy-based 的方法 PPO 和 value-based 的方法 Q-learning，这两者其实是可以结合在一起的， 也就是 **Actor-Critic** 的方法。见下一章 👇

## 📚 References

- [Bilibili - 李宏毅《深度强化学习》](https://www.bilibili.com/video/BV1MW411w79n)
- [Github - LeeDeepRL - Notes](https://datawhalechina.github.io/leedeeprl-notes/)
- [CSDN - 李宏毅深度强化学习笔记 - jessie](https://blog.csdn.net/cindy_1102/article/details/87904928)
- [强化学习纲要](https://github.com/zhoubolei/introRL)