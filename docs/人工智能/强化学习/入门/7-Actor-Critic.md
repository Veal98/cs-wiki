# 🎭 演员-评论员算法 Actor-Critic

---

## 1. 概述

在 REINFORCE 算法中，每次需要根据一个策略采集一条完整的轨迹，并计算这条轨迹上的回报。这种采样方式的方差比较大，学习效率也比较低。我们可以借鉴时序差分学习的思想，使用动态规划方法来提高采样的效率，即从状态 s 开始的总回报可以通过当前动作的即时奖励 $r(s,a,s')$ 和下一个状态 s' 的值函数来近似估计。

`演员-评论员算法(Actor-Critic Algorithm)`是一种结合`策略梯度`和`时序差分学习`的强化学习方法，其中：

- 演员(Actor)是指策略函数 $\pi_{\theta}(a|s)$，即学习一个策略来得到尽量高的回报。
- 评论员(Critic)是指值函数 $V^{\pi}(s)$，对当前策略的值函数进行估计，即评估演员的好坏。
- 借助于值函数，演员-评论员算法可以进行单步更新参数，不需要等到回合结束才进行更新。

在 Actor-Critic 算法 里面，最知名的方法就是 `A3C(Asynchronous Advantage Actor-Critic)`。

- 如果去掉前面这 异步 Asynchronous，只有 `Advantage Actor-Critic`，就叫做 `A2C`。
- 如果前面加了 Asynchronous，变成 `Asynchronous Advantage Actor-Critic`，就变成 `A3C`。

## 2. 回顾：Policy Gradient

在 policy gradient（`policy-based`） ，我们在 update policy 的参数 θ 的时候，我们是用了下面这个式子来算出我们的梯度：

<img src="https://gitee.com/veal98/images/raw/master/img/20201029144237.png" style="zoom: 50%;" />

只需要记得几个要点：

- 给定某个 state 采取某个 action 的概率
- 考虑到行动输出的概率和为一，为了保证 reward 越大的有更大的概率被抽样到，需要加上 baseline b
- 考虑到当先 action 对过去的 reward 没有影响，从当前时间点开始进行 reward 的累加
- 考虑到时间越久，当前 action 对后期 reward 的影响越小，添加折扣系数 γ

我们把用 G 来表示累计 reward。但 G 这个值，其实是非常的 unstable 的。因为互动的过程本身是有随机性的，所以在某一个 state s 采取某一个 action a，然后计算 accumulated reward，每次算出来的结果都是不一样的，所以 G 其实是一个 random variable。

<img src="https://gitee.com/veal98/images/raw/master/img/20201029144837.png" style="zoom: 50%;" />

由于无法抽样到到如此多的 G，因此我们引入了 Q-learning 👇

## 3. 回顾：Q-Learning

Q-learning（`value-based`） 部分主要记住以下几个点：

- 状态价值函数 $V^\pi(s)$（state value function，表示当使用某个 actor 时，观察到 state 之后预计会得到的累积 reward）

- 状态行动价值函数 $Q^\pi(s, a)$（state-action value function，当使用某个 actor 与环境互动时，在某个 state 采取某个 action 预计会得到的累积 reward）

<img src="https://gitee.com/veal98/images/raw/master/img/20201029145601.png" style="zoom:40%;" />

## 3. Actor-Critic

在 policy gradient 和 Q-learning 的基础上，我们引入 actor-critic。

将两者结合，即**用 Q-learning 当中的 V 和 Q 来替换 policy gradient 公式里面的累积 reward 和 baseline**

<img src="https://gitee.com/veal98/images/raw/master/img/20201029145750.png" style="zoom:20%;" />

但是，在这个时候我们需要估计两个 network，Q 和 V，这会导致整个模型的结果更加不稳定，因此引入 advantage actor-critic 👇

## 4. Advantage Actor-Critic (A2C)

相比于 Actor-Critic 所介绍的计算 G 的方法，即用 Q 减去 V，这里引入对 G 的另外一个估计，**将 Q 表示为下一个状态的 V 加上当前状态下获得的 reward 变化值 r**，这样做的好处是降低了模型整体方差（类似于 MC 到 TD）

<img src="https://gitee.com/veal98/images/raw/master/img/20201029145958.png" style="zoom: 20%;" />

实验表明，这个方法是对Q值的最好估计。

💧 整个流程是这样子的：先用一个 actor π  与环境做互动，利用 TD 或 MC 的方法学习 V 值，根据学到的 V 值利用下面的式子对 actor 进行更新 π → π ′ ：

<img src="https://gitee.com/veal98/images/raw/master/img/20201029150608.png" style="zoom:50%;" />

替换原来的 π 之后继续与环境互动，重复上述步骤。

## 5. Asynchronous Advantage Actor-Critic (A3C)

Reinforcement learning 有一个问题就是它很慢。那怎么增加训练的速度呢？就是 `Asynchronous(异步的)` Advantage Actor-Critic

> 💡 这个可以讲到火影忍者就是有一次鸣人说，他想要在一周之内打败晓，所以要加快修行的速度，他老师就教他一个方法，这个方法是说你只要用影分身进行同样修行。那两个一起修行的话呢？经验值累积的速度就会变成2倍，所以，鸣人就开了 1000 个影分身，开始修行了。

A3C 这个方法就是同时开很多个 worker，那每一个 worker 其实就是一个影分身。那最后这些影分身会把所有的经验，通通集合在一起。

<img src="https://gitee.com/veal98/images/raw/master/img/20201029151111.png" style="zoom:50%;" />

方法步骤：

- **每个 worker 都会 copy 全局参数**
- 每个 worker 都与环境进行互动，并得到 sample data
- 计算梯度
- 更新全局参数

## 6. Pathwise Derivative Policy Gradient

对于最原始的 `actor-critic`，critic 只会告诉 actor，某个行动是好的还是坏的。而这里引入的 `Pathwise Derivative Policy Gradient` 不仅仅会告诉 actor 某一个 action 的好坏，还会告诉 actor 应该采取哪一个 action（使用以下训练出来的 actor 告知）

即训练一个actor π ，如果给这个 actor 输入 state，会返回一个使得 Q 值最大的 action a

![](https://gitee.com/veal98/images/raw/master/img/20201029151744.png)

将这个 actor 返回的 action 和 state 一起输入到一个固定的 Q 中，计算出来的 Q 值一定会增大，然后使用梯度上升更新 actor，重复上述步骤。

<img src="https://gitee.com/veal98/images/raw/master/img/20201029151822.png" style="zoom: 22%;" />

## 📚 References

- [Bilibili - 李宏毅《深度强化学习》](https://www.bilibili.com/video/BV1MW411w79n)
- [Github - LeeDeepRL - Notes](https://datawhalechina.github.io/leedeeprl-notes/)
- [CSDN - 李宏毅深度强化学习笔记 - jessie](https://blog.csdn.net/cindy_1102/article/details/87904928)
- [强化学习纲要](https://github.com/zhoubolei/introRL)