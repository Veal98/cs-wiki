# 🎭 演员-评论员算法 Actor-Critic

---

今天我们来说说强化学习中的一种结合体 Actor Critic (演员评判家), **它合并了 以值为基础 (比如 Q learning) 和 以动作概率为基础 (比如 Policy Gradients) 两类强化学习算法**.

## 1. Actor 和 Critic

Actor-Critic 中的 Actor 的前身是 Policy Gradients, 这能让它毫不费力地在连续动作中选取合适的动作.

Actor Critic 中的 Critic 的前身是 Q-learning 或者其他的 Value-Based 的学习法 , 能进行单步更新, 而传统的 Policy Gradients 则是回合更新, 这降低了学习效率.

现在我们有两套不同的体系, Actor 和 Critic, 他们都能用不同的神经网络来代替 . 在 Policy Gradients 中提到过, 现实中的奖惩会左右 Actor 的更新情况. Policy Gradients 也是靠着这个来获取适宜的更新. 那么何时会有奖惩这种信息能不能被学习呢? 这看起来不就是 Value-Based 的强化学习方法做过的事吗. 那我们就拿一个 Critic 去学习这些奖惩机制, 学习完了以后. 由 Actor 来指手画脚, 由 Critic 来告诉 Actor 你的那些指手画脚哪些指得好, 哪些指得差。

![](https://gitee.com/veal98/images/raw/master/img/20201102102021.png)

Critic 通过学习环境和奖励之间的关系, 能看到现在所处状态的潜在奖励, 所以用它来指点 Actor 便能使 Actor 每一步都在更新, **如果使用单纯的 Policy Gradients, Actor 只能等到回合结束才能开始更新**.

## 2. Actor-Critic 核心思想

🔸 **一句话概括 Actor Critic 方法**:

结合了 Policy Gradient (Actor) 和 值函数近似 Function Approximation (Critic) 的方法. ⭐ **`Actor` 基于概率选行为, `Critic` 基于 `Actor` 的行为评判行为的得分, `Actor` 根据 `Critic` 的评分修改选行为的概率**.

> 💡 **`Actor` 修改行为时就像蒙着眼睛一直向前开车, `Critic` 就是那个扶方向盘改变 `Actor` 开车方向的.**
>
> 或者说详细点, 就是 `Actor` 在运用 Policy Gradient 的方法进行 Gradient ascent 的时候, 由 `Critic` 来告诉他, 这次的 Gradient ascent 是不是一次正确的 ascent, 如果这次的得分不好, 那么就不要 ascent 那么多.

🔸 **Actor Critic 方法的优势**: 可以进行单步更新, 比传统的 Policy Gradient 要快.

🔸 **Actor Critic 方法的劣势**: 取决于 Critic 的价值判断, 但是 Critic 难收敛, 再加上 Actor 的更新, 就更难收敛. 为了解决收敛问题, Google Deepmind 提出了 `Actor Critic` 升级版 `Deep Deterministic Policy Gradient`. 后者融合了 DQN 的优势, 解决了收敛难的问题. 我们之后也会要讲到 Deep Deterministic Policy Gradient. 

## 3. Actor-Critic 代码实现

> ✅ TODO

## 4. Deep Deterministic Policy Gradient（DDPG）

Actor-Critic 涉及到了两个神经网络, 而且每次都是在连续状态中更新参数, 每次参数更新前后都存在相关性, 导致神经网络只能片面的看待问题, 甚至导致神经网络学不到东西. Google DeepMind 为了解决这个问题, 修改了 Actor Critic 的算法, **将之前在电动游戏 Atari 上获得成功的 DQN 网络加入进 Actor Critic 系统中**, 这种新算法叫做  `Deep Deterministic Policy Gradient`, 成功的解决的在连续动作预测上的学不到东西问题. 

![](https://gitee.com/veal98/images/raw/master/img/20201102102711.png)

### ① Deep 和 DQN

Deep 顾名思义, 就是走向更深层次, 我们在 DQN 中提到过, 使用一个记忆库和两套结构相同但参数更新频率不同的神经网络能有效促进学习. 那我们也把这种思想运用到 DDPG 当中, 使 DDPG 也具备这种优良形式. 但是 DDPG 的神经网络形式却比 DQN 的要复杂一点点.

![](https://gitee.com/veal98/images/raw/master/img/20201102102811.png)

### ② Deterministic Policy Gradient

Policy gradient 相比其他的强化学习方法, 它能被用来在连续动作上进行动作的筛选 . 而且筛选的时候是根据所学习到的动作分布随机进行筛选, 而 Deterministic 改变了输出动作的过程, 斩钉截铁的只在连续动作上输出一个动作值.

![](https://gitee.com/veal98/images/raw/master/img/20201102105726.png)

### ③ DDPG 神经网络

现在我们来说说 DDPG 中所用到的神经网络. 它其实和我们之前提到的 Actor-Critic 形式差不多, 也需要有基于 策略 Policy 的神经网络 和基于 价值 Value 的神经网络, 但是为了体现 DQN 的思想, 每种神经网络我们都需要再细分为两个：

- Policy Gradient 这边, 我们有估计网络和现实网络, 估计网络用来输出实时的动作, 供 actor 在现实中实行. 而现实网络则是用来更新价值网络系统的. 
- 我们再来看看价值系统这边, 我们也有现实网络和估计网络, 他们都在输出这个状态的价值, 而输入端却有不同, 状态现实网络这边会拿着从动作现实网络来的动作加上状态的观测值加以分析, 而状态估计网络则是拿着当时 Actor 施加的动作当做输入.在实际运用中, DDPG 的这种做法的确带来了更有效的学习过程.

![](https://gitee.com/veal98/images/raw/master/img/20201102110538.png)

⭐ **一句话概括 DDPG:** Google DeepMind 提出的一种使用 `Actor Critic` 结构, 但是输出的不是行为的概率, 而是具体的行为, 用于连续动作 (continuous action) 的预测. `DDPG` 结合了之前获得成功的 `DQN` 结构, 提高了 `Actor Critic` 的稳定性和收敛性.

### ④ 代码实现

> ✅ TODO

## 5. Asynchronous Advantage Actor-Critic (A3C)

Reinforcement learning 有一个问题就是它很慢。那怎么增加训练的速度呢？就是 `Asynchronous(异步的)` Advantage Actor-Critic

> 💡 这个可以讲到火影忍者就是有一次鸣人说，他想要在一周之内打败晓，所以要加快修行的速度，他老师就教他一个方法，这个方法是说你只要用影分身进行同样修行。那两个一起修行的话呢？经验值累积的速度就会变成2倍，所以，鸣人就开了 1000 个影分身，开始修行了。

A3C 这个方法就是同时开很多个 worker，每一个 worker 其实就是一个影分身。最后这些影分身会把所有的经验，通通集合在一起。

我们知道目前的计算机多半是有双核, 4核, 甚至 6核, 8核. 一般的学习方法, 我们只能让机器人在一个核上面玩耍. 但是如果使用 A3C 的方法, 我们可以给他们安排去不同的核, 并行运算. 实验结果就是, 这样的计算方式往往比传统的方式快上好多倍. 

<img src="https://gitee.com/veal98/images/raw/master/img/20201029151111.png" style="zoom:50%;" />

方法步骤：

- **每个 worker 都会 copy 全局参数**
- 每个 worker 都与环境进行互动，并得到 sample data
- 计算梯度
- 更新全局参数

⭐ **一句话概括 A3C:** Google DeepMind 提出的一种解决 `Actor-Critic` 不收敛问题的算法. 它会创建多个并行的环境, 让多个拥有副结构的 agent 同时在这些并行环境上更新主结构中的参数. 并行中的 agent 们互不干扰, 而主结构的参数更新受到副结构提交更新的不连续性干扰, 所以更新的相关性被降低, 收敛性提高.



## 📚 References

- [Bilibili - 李宏毅《深度强化学习》](https://www.bilibili.com/video/BV1MW411w79n)
- [Github - LeeDeepRL - Notes](https://datawhalechina.github.io/leedeeprl-notes/)
- [CSDN - 李宏毅深度强化学习笔记 - jessie](https://blog.csdn.net/cindy_1102/article/details/87904928)
- [强化学习纲要](https://github.com/zhoubolei/introRL)