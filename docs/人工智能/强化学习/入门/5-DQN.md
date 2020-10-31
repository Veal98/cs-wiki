# 🌌 Deep Q Network (DQN)

---

今天我们来说说强化学习中的一种强大武器, Deep Q Network 简称为 DQN. Google Deep mind 团队就是靠着这 DQN 使计算机玩电动玩得比我们还厉害.

## 1. 什么是 DQN

之前我们所谈论到的强化学习方法都是比较传统的方式, 而如今, 随着机器学习在日常生活中的各种应用, 各种机器学习方法也在融汇, 合并, 升级. 而 **Deep Q Network 则是融合了神经网络（深度学习）和 Q learning 的方法**. 这种新型结构是为什么被提出来呢? 原来, 传统的表格形式的强化学习有这样一个瓶颈 👇

我们使用表格（Q-Table）来存储每一个状态 state, 和在这个 state 每个行为 action 所拥有的 Q 值. <u>而当今问题实在太复杂, 状态可以多到比天上的星星还多(比如下围棋). 如果全用表格来存储它们, 恐怕我们的计算机有再大的内存都不够, 而且每次在这么大的表格中搜索对应的状态也是一件很耗时的事</u>. 

![](https://gitee.com/veal98/images/raw/master/img/20201031105420.png)

不过, 在机器学习中, 有一种方法对这种事情很在行, 那就是神经网络. **我们可以将状态和动作当成神经网络的输入, 然后经过神经网络分析后得到动作的 Q 值, 这样我们就没必要在表格中记录 Q 值, 而是直接使用神经网络生成 Q 值**. 还有一种形式的是这样, 我们也能**只输入状态值, 输出所有的动作值, 然后按照 Q learning 的原则, 直接选择拥有最大值的动作当做下一步要做的动作**. 我们可以想象, 神经网络接受外部的信息, 相当于眼睛鼻子耳朵收集信息, 然后通过大脑加工输出每种动作的值, 最后通过强化学习的方式选择动作.

接下来我们基于第二种神经网络来分析, 我们知道, 神经网络是要被训练才能预测出准确的值. 那在强化学习中, 神经网络是如何被训练的呢? 首先, 我们需要 a1, a2 正确的Q值, 这个 Q 值我们就用之前在 Q learning 中的 Q 现实来代替. 同样我们还需要一个 Q 估计 来实现神经网络的更新. 所以神经网络的的参数就是老的神经网络 (NN) 参数 加学习率 alpha 乘以 Q 现实 和 Q 估计 的差距. 

![](https://gitee.com/veal98/images/raw/master/img/20201031105621.png)

我们整理一下：

![](https://gitee.com/veal98/images/raw/master/img/20201031105657.png)

我们通过神经网络 (NN) 参数预测出 Q(s2, a1) 和 Q(s2,a2) 的值, 这就是 Q 估计. 然后我们选取 Q 估计中最大值的动作来换取环境中的奖励 reward. 而 Q 现实中也包含从神经网络分析出来的两个 Q 估计值, 不过这个 Q 估计是针对于下一步在 s' 的估计. 最后再通过刚刚所说的算法更新神经网络中的参数. 

## 2. DQN 两大利器

<u>但是这并不是 DQN 会玩电动的根本原因. 还有两大因素支撑着 DQN 使得它变得无比强大. 这两大因素就是 `经验回放 Experience replay` 和 `Fixed Q-targets`</u>.

`Experience replay` 简单来说, DQN 有一个记忆库用于学习之前的经历. 在之前的简介影片中提到过, Q learning 是一种 off-policy 离线学习法, 它能学习当前经历着的, 也能学习过去经历过的, 甚至是学习别人的经历. 所以**每次 DQN 更新的时候, 我们都可以【随机抽取】一些之前的经历进行学习. 随机抽取这种做法打乱了经历之间的相关性, 也使得神经网络更新更有效率**. 

`Fixed Q-targets` 也是一种打乱相关性的机理, 如果使用 fixed Q-targets, 我们就会**在 DQN 中使用到【两个结构相同但参数不同的神经网络】, 预测 Q 估计 的神经网络具备最新的参数, 而预测 Q 现实 的神经网络使用的参数则是很久以前的**. 有了这两种提升手段, DQN 才能在一些游戏中超越人类.

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
- [莫烦 Python — 强化学习](https://mofanpy.com/tutorials/machine-learning/reinforcement-learning/intro-RL-methods/)