# 💫 策略梯度 Policy Gradient

---

## 1. Actor 的主要组成成分

由上一章我们已经直到，强化学习问题中有 3 个成分：`actor / agent`，`environment`，`reward function`

比如说让机器玩 video game 时，

- `actor` 做的事情就是去操控游戏的摇杆， 比如说向左、向右、开火等操作；
- `environment `就是游戏的主机， 负责控制游戏的画面负责控制说，怪物要怎么移动， 你现在要看到什么画面等等；
- `reward function` 就是当你做什么事情，发生什么状况的时候，你可以得到多少分数， 比如说杀一只怪兽得到 20 分等等。

⭐ 对于一个强化学习 Actor ，它有如下组成成分：

- 首先 Actor 有一个 `策略函数 policy function`，**Actor 会用这个函数来选取下一步的动作 Action **。
- 然后它也可能生成一个 `价值函数(value function)`。我们用价值函数来对当前状态进行估价，它就是说你进入现在这个状态，可以对你后面的收益带来多大的影响。当这个价值函数大的时候，说明你进入这个状态越有利。
- 另外一个组成成分是 `模型(model)`。模型表示了 Actor 对这个环境的状态进行了理解，它决定了这个世界是如何进行的。

## 2. Policy of Actor

一般来说，`environment ` 跟 `reward function` 不是你可以控制的，`environment `跟` reward function` 是在开始学习之前，就已经事先给定的。<u>你唯一能做的事情是调整 `actor `里面的 **策略 `policy`**，使得 `actor` 可以得到最大的 `reward`。</u>

**`Policy` 决定了这个 `actor`的下一步的动作，它其实是一个函数，把输入的状态变成行为**。`Policy ` 一般写成 `π`。假设你是用 deep learning 的技术来做 reinforcement learning 的话，**`policy` 就是一个神经网络**，神经网络里面有一堆参数， <u>我们用 θ 来代表 π 的参数</u>：

<img src="https://gitee.com/veal98/images/raw/master/img/20201026173154.png" style="zoom:40%;" />

上图就是具体的例子，

- policy 就是一个神经网络；
- input 就是游戏的画面，它通常是由 pixels 所组成的；
- output 就是看看说有哪些选项是你可以去执行的，即 actor 下一步可能进行的动作。

假设你现在可以做的动作有 3 个，output layer 就有 3 个神经元。每个神经元对应一个可以采取的动作。Input 一个东西后，network 就会给每一个可以采取的动作一个分数。接下来，你把这个分数当作是概率。 actor 就是根据这个机率的分布，决定它要采取的动作。比如说 70% 会走 left，20% 走 right，10% 开火等等。概率分布不同，actor 采取的动作就会不一样。

💬 举个例子：首先 actor 会看到一个游戏画面，我们用 $s_1$ 来表示这个游戏画面，它代表游戏初始的画面。接下来 actor 看到这个游戏的初始画面以后，根据它内部的 network 即 policy 来决定下一步的 action。假设它现在决定的 action 是向右，它决定完 action 以后，它就会得到一个 reward ，代表它采取这个 action 以后得到的分数。

<img src="https://gitee.com/veal98/images/raw/master/img/20201026194851.png" style="zoom:40%;" />

我们把一开始的初始画面记作 $s_1$， 把第一次执行的动作记作 $a_1$，把第一次执行动作完以后得到的 reward 记作 $r_1$（不同的书会有不同的定义，有人会觉得说这边应该要叫做 $r_2$，这个都可以，你自己看得懂就好）。Actor 决定一个的行为以后， 就会看到一个新的游戏画面，这边是 $s_2$。然后把这个 $s_2$ 输入给 actor，这个 actor 决定要开火，然后它可能杀了一只怪，就得到五分。这个 process 就反复地持续下去，直到这个 environment 决定这个游戏结束了。

<img src="https://gitee.com/veal98/images/raw/master/img/20201026195315.png" style="zoom:40%;" />

一场游戏叫做一个 `episode(回合)` 或者 `trial(试验)`。把这个游戏里面，所有得到的 reward 都总合起来，就是 `total reward`，我们称其为 `Return(回报)`，用 R 来表示它。**Actor 要想办法去最大化 maximize 它可以得到的 Return **。

## 3. 轨迹 Trajectory

🌈 在一场游戏里面，我们把 environment 输出的状态 s 跟 actor 输出的行为 a 全部串起来， 叫做一个 `轨迹 Trajectory`，如下式所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20201026200153.png" style="zoom:50%;" />

<u>你可以计算每一个 trajectory 发生的概率</u>。假设 actor 所有的参数是 θ（即 Policy 中的参数）：

<img src="https://gitee.com/veal98/images/raw/master/img/20201026200436.png" style="zoom: 67%;" />

**这个轨迹的概率取决于两部分**：

- 一部分是 `environment` 对于某个动作产生的对应的状态。 $p(s_{t+1}|s_t,a_t)$ 这一项代表的是 environment， environment 这一项通常你是无法控制它的，因为那个是人家写好的。
- 另一部分是 `agent 的行为/动作`。你能控制的是 $p_\theta(a_t|s_t)$。给定一个 $s_t$， actor 要采取什么样的 $a_t$ 取决于 policy 的的参数 θ， 所以这部分是 actor 可以自己控制的。随着 actor 的行为不同，同样的 trajectory 也可能会有不同的出现概率。

## 4. Expected Reward

在 reinforcement learning 里面，除了 environment 跟 actor 以外， 还有`reward function`。Reward function 根据在某一个 state 采取的某一个 action 决定说现在这个行为可以得到多少的分数。 它是一个 function，给它 $s_1$，$a_1$，它告诉你得到 $r_1$。给它 $s_2$ ，$a_2$，它告诉你得到 $r_2$。 把所有的 r 都加起来，我们就得到了 $R(\tau)$ ，代表某一个 trajectory / τ 的 reward。

在某一场游戏里面， 某一个 episode 里面，我们会得到 R。**我们要做的事情就是调整 actor 内部的参数 θ， 使得 R 的值越大越好。** 但实际上 R 并不只是一个标量，**R 其实是一个 random variable**。 因为 actor 在给定同样的 state 会做什么样的行为，这件事情是有随机性的。environment 在给定同样的 observation 要采取什么样的 action，要产生什么样的 observation，本身也是有随机性的。所以**对于 R，你能够计算的是它的【期望值  `Expected Reward` 】**：

<img src="https://gitee.com/veal98/images/raw/master/img/20201026202254.png" style="zoom:40%;" />

我们要做的事情就是 **maximize expected reward** 👇

## 5. 策略梯度 Policy Gradient

怎么 maximize expected reward 呢？我们用的是 `梯度上升 gradient ascent`，因为要让它越大越好，所以是 gradient ascent。<u>Gradient ascent 在更新参数的时候使用加法</u>。

要进行 gradient ascent，我们先要计算 expected reward ($\bar{R}$) 的梯度 gradient ，只有 $p_{\theta}(\tau)$ 是跟 θ 有关，所以 求梯度/偏导运算 就放在 $p_{\theta}(\tau)$ 这个地方：

<img src="https://gitee.com/veal98/images/raw/master/img/20201026202811.png" style="zoom:40%;" />

> 💡 记住这个公式：$∇f(x)=f(x)∇logf(x)$
>
> 我们可以对$ \nabla p_{\theta}(\tau)$ 使用这个公式，然后会得到 $\nabla p_{\theta}(\tau)=p_{\theta}(\tau) \nabla \log p_{\theta}(\tau)$，即：
>
> $\frac{\nabla p_{\theta}(\tau)}{p_{\theta}(\tau)}=\log p_{\theta}(\tau)$

😃 其实你可以非常直观的来理解这个部分：

- 假设你在状态 $s_t$ 下执行了动作 $a_t$，最后发现这一轨迹 τ 的 reward 是正的， 那你就要增加在 $s_t$ 执行 $a_t$t 的概率。
- 反之，在 $s_t$ 执行 $a_t$ 会导致 τ 的 reward 变成负的， 你就要减少这一项的概率。

🚨 **需要注意的是，用于梯度上升的数据是我们从数据集中随机采样出来的，每次更新完你的 model 后，都要重新去随机采样，再重新做更新**：

<img src="https://gitee.com/veal98/images/raw/master/img/20201026204546.png" style="zoom:40%;" />

## 6. Tips

### ① 添加基准线

由于训练过程中采样是随机的，可能会出现某个行动不被采样的情况，这会导致采取该行动的概率下降；另外，由于采取的行动概率和为一，可能存在归一化之后，好的 action 的概率相对下降，坏的 action 概率相对上升的情况，因此需要引入一个基准线 baseline / b .

<img src="https://gitee.com/veal98/images/raw/master/img/20201026205404.png" style="zoom:45%;" />

具体的例子：当 policy 决定采取的三个 action a，b，c 均有正的 reward 时，比如 3,4,5，在计算各个 action 的概率的时候，本来应该给 action c 分配较大的概率，但是归一化之后，a 的概率反而可能上升，c 的概率可能会下降，与对应 reward 应该被分配的概率分布不符。但是引入 baseline 之后，可能 a 的 reward 会变为负，这样的话，采取该行动的概率就会下降。

<img src="https://gitee.com/veal98/images/raw/master/img/20201026205352.png" style="zoom:40%;" />

设置 b 的一个最简单的做法就是， 取 $R(\tau)$ 的期望值：$b≈E[R(τ)]$

### ② 进一步考虑各个时间点的累积收益计算方式

🔸 考虑到在时间 t 采取的行动 action 与 t 时期之前的收益 reward 无关，因此只需要将 t 时刻开始到结束的 reward 进行加总即可：

<img src="https://gitee.com/veal98/images/raw/master/img/20201026210117.png" style="zoom:50%;" />

🔸  并且，由于行动 action 对随后各时间点的 reward 的影响会随着时间的推移而减小，因此加入折旧因子 γ  

> 💡 **折扣系数 $γ$（ discount factor ）**，我们希望**尽可能在短的时间里面得到尽可能多的奖励**。如果我们说十天过后，我给你 100 块钱，跟我现在给你 100 块钱，你肯定更希望我现在就给你 100 块钱，因为你可以把这 100 块钱存在银行里面，你就会有一些利息。也就是说，**越久的回报越不值钱**

这样就得到了一个考虑比较全面，比较完善的梯度计算方式：

<img src="https://gitee.com/veal98/images/raw/master/img/20201026210100.png" style="zoom:50%;" />

## 📚 References

- [Bilibili - 李宏毅《深度强化学习》](https://www.bilibili.com/video/BV1MW411w79n)
- [Github - LeeDeepRL - Notes](https://datawhalechina.github.io/leedeeprl-notes/)
- [CSDN - 李宏毅深度强化学习笔记 - jessie](https://blog.csdn.net/cindy_1102/article/details/87904928)
- [强化学习纲要](https://github.com/zhoubolei/introRL)