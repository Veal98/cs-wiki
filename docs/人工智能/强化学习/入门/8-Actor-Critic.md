# 🎭 演员-评论员算法 Actor-Critic

---

⭐ 今天我们来说说强化学习中的一种结合体 Actor Critic (演员评判家), **它合并了 以值为基础 (比如 Q learning) 和 以动作概率为基础 (比如 Policy Gradients) 两类强化学习算法**.

## 1. Actor-Critic 方法（AC）

<img src="https://gitee.com/veal98/images/raw/master/img/20201113160456.png" style="zoom:50%;" />

- 💛 **策略网络** - Actor-Critic 中的 **【Actor】** ：前身是 Policy Gradients, 这能让它毫不费力地在连续动作中选取合适的动作.

  对于 Actor 网络 $𝜋_𝜃$，目标是最大化回报期望，通过 $𝜕𝐽(𝜃) / 𝜕𝜃$ 偏导数来更新策略网络的参数 𝜃：

  <img src="https://gitee.com/veal98/images/raw/master/img/20201113160646.png" style="zoom: 50%;" />

- 💛 **价值网络** - Actor Critic 中的 **【Critic】** ：前身是 Q-learning 或者其他的 Value-Based 的学习法 , 用于评估当前状态的好坏。能进行单步更新, 而传统的 Policy Gradients 则是回合更新, 这降低了学习效率.

  对于 Critic 网络 $𝑉_𝜙^𝜋$，目标是在通过 MC 方法或者 TD 方法获得准确的 $𝑉_𝜙^𝜋(𝑠𝑡)$ 值函数估计：

  <img src="https://gitee.com/veal98/images/raw/master/img/20201113160851.png" style="zoom:50%;" />

🔸 **一句话概括 Actor Critic 方法**:

结合了 Policy Gradient (Actor) 和 值函数近似 Function Approximation (Critic) 的方法. ⭐ **`Actor` 基于概率选行为, `Critic` 基于 `Actor` 的行为评判行为的得分, `Actor` 根据 `Critic` 的评分修改选行为的概率**.

> 💡 **`Actor` 修改行为时就像蒙着眼睛一直向前开车, `Critic` 就是那个扶方向盘改变 `Actor` 开车方向的.**
>
> 或者说详细点, 就是 `Actor` 在运用 Policy Gradient 的方法进行 Gradient ascent 的时候, 由 `Critic` 来告诉他, 这次的 Gradient ascent 是不是一次正确的 ascent, 如果这次的得分不好, 那么就不要 ascent 那么多.

🔸 **Actor Critic 方法的优势**: 可以进行单步更新, 比传统的 Policy Gradient 要快.

🔸 **Actor Critic 方法的劣势**: 取决于 Critic 的价值判断, 但是 Critic 难收敛, 再加上 Actor 的更新, 就更难收敛. 为了解决收敛问题, Google Deepmind 提出了 `Actor Critic` 升级版 `Deep Deterministic Policy Gradient`. 后者融合了 DQN 的优势, 解决了收敛难的问题. 我们之后也会要讲到 Deep Deterministic Policy Gradient. 

## 2. Advantage AC 算法（A2C）

上面介绍的通过计算优势值函数 $𝐴^𝜋(𝑠, 𝑎)$ 的 Actor Critic 算法称为 `Advantage Actor-Critic 算法`，它是目前使用 Actor Critic 思想的主流算法之一

<img src="https://gitee.com/veal98/images/raw/master/img/20201113161620.png" style="zoom:50%;" />

> 📜 其实 Actor Critic 系列算法不一定要使用优势值函数 $𝐴^𝜋(𝑠, 𝑎)$，还可以有其它变种

## 3. Asynchronous Advantage AC 算法（A3C）

Reinforcement learning 有一个问题就是它很慢。那怎么增加训练的速度呢？就是 `Asynchronous(异步的) Advantage Actor-Critic` 

A3C 是 DeepMind 基于 Advantage Actor-Critic，A2C 算法提出来的异步版本，**将 Actor-Critic 网络部署在多个线程中同时进行训练，并通过全局网络来同步参数。这种异步训练的模式大大提升了训练效率，训练速度更快，并且算法性能也更好**。

<img src="https://gitee.com/veal98/images/raw/master/img/20201113162317.png" style="zoom: 62%;" />

方法步骤：

- **每个 worker 都会 copy 全局参数**
- 每个 worker 都与环境进行互动，并得到 sample data
- 计算梯度
- 更新全局参数





## 📚 References

- [Bilibili - 李宏毅《深度强化学习》](https://www.bilibili.com/video/BV1MW411w79n)
- [Github - LeeDeepRL - Notes](https://datawhalechina.github.io/leedeeprl-notes/)
- [CSDN - 李宏毅深度强化学习笔记 - jessie](https://blog.csdn.net/cindy_1102/article/details/87904928)
- 👍 [Github - Deep-Learning-with-TensorFlow-book](https://github.com/dragen1860/Deep-Learning-with-TensorFlow-book)
- [Github - DeepRL-TensorFlow2](https://github.com/marload/DeepRL-TensorFlow2) - 🐋 Simple implementations of various popular Deep Reinforcement Learning algorithms using TensorFlow2