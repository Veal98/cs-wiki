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

`Fixed Q-targets` 也是一种打乱相关性的机理, 如果使用 fixed Q-targets, 我们就会**在 DQN 中使用到【两个结构相同但参数不同的神经网络】, 预测 Q 估计（`q_eval`） 的神经网络具备最新的参数, 而预测 Q 现实（`q_target`）的神经网络使用的参数则是很久以前的**。有了这两种提升手段, DQN 才能在一些游戏中超越人类

## 3. DQN 整体算法

![](https://gitee.com/veal98/images/raw/master/img/20201101111040.png)

整个算法乍看起来很复杂, 其实就是在 Q learning 主框架上加了些装饰，这些装饰包括:

- **记忆库 (用于重复学习)**

  DQN 的精髓部分之一: 记录下所有经历过的步, 这些步可以进行反复的学习, 所以是一种 off-policy 方法, 你甚至可以自己玩, 然后记录下自己玩的经历, 让这个 DQN 学习你是如何通关的.

- **神经网络计算 Q 值**

- **暂时冻结 `q_target` 参数 (切断相关性)**

为了使用 Tensorflow 来实现 DQN, 比较推荐的方式是**搭建两个神经网络**, `target_net` 用于预测 Q 现实 `q_target` , 他不会及时更新参数. `eval_net` 用于预测 Q 估计 `q_eval`, 这个神经网络拥有最新的神经网络参数. 不过这两个神经网络结构是完全一样的, 只是里面的参数不一样. 

⭐ **两个神经网络是为了固定住一个神经网络 (`target_net`) 的参数, `target_net` 是 `eval_net` 的一个历史版本, 拥有 `eval_net` 很久之前的一组参数, 而且这组参数被固定一段时间, 然后再被 `eval_net` 的新参数所替换. 而 `eval_net` 是不断在被提升的, 所以是一个可以被训练的网络 `trainable=True`. 而 `target_net` 的 `trainable=False`**.

## 6. Deep Q-network (DQN)

DQN 是指基于深度学习的 Q-learning 算法，主要结合了`价值函数近似(Value Function Approximation)`与神经网络技术，并采用了目标网络和经历回放的方法进行网络的训练。

在 Q-learning 中，我们使用 Q-Table 来存储每个状态 s 下采取动作 a 获得的奖励，即状态-动作值函数 Q(s,a)。然而，这种方法在状态量巨大甚至是连续的任务中，会遇到维度灾难问题，往往是不可行的。因此，DQN 采用了价值函数近似的表示方法。

<img src="https://gitee.com/veal98/images/raw/master/img/20201028115617.png" style="zoom:50%;" />

❓ **DQN 和 Q-learning 有什么不同？**

整体来说，DQN 与 Q-learning 的目标价值以及价值的更新方式都非常相似，主要的不同点在于：

- DQN 将 Q-learning 与深度学习结合，用深度网络来近似动作价值函数，而 Q-learning 则是采用表格存储；
- DQN 采用了经验回放的训练方法，从历史数据中随机采样，而 Q-learning 直接采用下一个状态的数据进行学习

## 7. Double DQN

**由于 DQN 是基于 Q-learning 的， Q 值总是基于使得 Q 最大的 action 得出，因此 Q 值会趋向于被高估  (overestimate)，于是引入 double DQN**

<img src="https://gitee.com/veal98/images/raw/master/img/20201101121041.png" style="zoom: 42%;" />

我们知道 DQN 的神经网络部分可以看成一个 `最新的神经网络` + `老神经网络`, 他们有相同的结构, 但内部的参数更新却有时差. 而它的 `Q现实` 部分是这样的:

![](https://gitee.com/veal98/images/raw/master/img/20201101121807.png)

因为我们的神经网络预测 `Qmax` 本来就有误差, 每次也向着最大误差的 `Q现实` 改进神经网络, 就是因为这个 `Qmax` 导致了 overestimate. 所以 Double DQN 的想法就是引入另一个神经网络来打消一些最大误差的影响. 而 DQN 中本来就有两个神经网络, 我们何不利用一下优势呢.：

 **一个 Q-network 用来选择行动 action（Q 估计），另外一个 Q-network 用来根据这个 action 计算 Q 值（Q 现实）**，我们用 `Q估计` 的神经网络估计 `Q现实` 中 `Qmax(s', a')` 的最大动作值. 然后用这个被 `Q估计` 估计出来的动作来选择 `Q现实` 中的 `Q(s')`. 

![](https://gitee.com/veal98/images/raw/master/img/20201101121725.png)

假设第一个 Q-function 高估了它现在选出来的 action a，那没关系，因为我们并不采用第一个 Q-network 的 Q 值，只要第二个 Q-function Q' 没有高估这个 action a 的 Q 值，那你算出来的就还是正常的值。假设反过来是 Q' 高估了某一个 action 的 Q 值，那也没关系，只要第一个 Q-network 不要选这个 action 就没事了。

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