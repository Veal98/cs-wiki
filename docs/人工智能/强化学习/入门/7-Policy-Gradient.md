# 💫 策略梯度 Policy Gradient

---

> 💡 **Policy Gradient** 属于 Value-Free、Policy-Based

对比起以值为基础的方法, Policy Gradients 根据概率直接输出动作的最大好处就是, **它能在一个连续区间内挑选动作**, 而 Value-Based 的比如 Q-learning 无法很好的处理连续动作

🚨 基于策略梯度的方法，根据策略是随机策略还是确定性策略，分为经典的 `策略梯度方法（Policy Gradient,PG）` 与 `确定性策略梯度方法（Deterministic Policy Gradient, DPG）`。

本节只介绍 PG 👇

## 1. Policy Gradient 核心思想

如图所示, 观测的信息通过神经网络分析, 选出了左边的行为, 我们直接进行反向传递, 使之下次被选的可能性增加, 但是奖惩信息却告诉我们, 这次的行为是不好的, 那我们的动作可能性增加的幅度 随之被减低. 这样就能**靠奖励来左右我们的神经网络反向传递**. 

![](https://gitee.com/veal98/images/raw/master/img/20201102094845.png)

⭐ 假如这次的观测信息让神经网络选择了右边的行为, 右边的行为随之想要进行反向传递, 使右边的行为下次被多选一点, 这时, 奖惩信息也来了, 告诉我们这是好行为, 那我们就在这次反向传递的时候加大力度, 让它下次被多选的幅度更猛烈。这就是 Policy Gradients 的核心思想。

<u>Policy Gradient 网络的输入也是状态(State)，输出的不是 action 的 value, 而是每个动作的概率，例如 `[0.7, 0.3]` ，这意味着有70% 的几率会选择动作 0，30% 的几率选择动作 1</u>

<img src="https://gitee.com/veal98/images/raw/master/img/20201108210740.png" style="zoom:80%;" />

## 2. 梯度更新

**策略梯度算法的目标是找到某个最优策略 $𝜋_𝜃(𝑎|𝑠)$ 使得期望回报 $𝐽(𝜋_𝜃)$ 最大**，这类优化问题和有监督学习类似，需要求解期望回报对网络参数 𝜃 的偏导数 $𝜕𝐽 / 𝜕𝜃$，并采用梯度上升算法更新网络参数即可：

⭐ $𝜃′= 𝜃 + α * \frac{𝜕𝐽}{𝜕𝜃}$，其中 α 为学习率

很遗憾的是，总回报期望 $𝐽(𝜋_𝜃)$ 是由游戏环境给出的，如果无法得知环境模型，那么 $𝜕𝐽(𝜃) / 𝜕𝜃$ 是不能通过自动微分计算的。那么即使 $𝐽(𝜋_𝜃)$ 表达式未知，能不能直接求解偏导数 $𝜕𝐽(𝜋_𝜃)/𝜕𝜃$ 呢？答案是肯定的。我们这里直接给出 $𝜕𝐽(𝜋_𝜃)/𝜕𝜃$ 的推导结果：

<img src="https://gitee.com/veal98/images/raw/master/img/20201110155709.png" style="zoom:60%;" />

有了上述 $𝜕𝐽/𝜕𝜃$ 的表达式后，我们就可以通过 TensorFlow 的自动微分工具方便地求解出 <img src="https://gitee.com/veal98/images/raw/master/img/20201110160103.png" style="zoom:50%;" />，从而计算出 $𝜕𝐽/𝜕𝜃$，最后利用梯度上升算法更新即可。策略梯度算法的大致流程如图所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20201110160153.png" style="zoom: 62%;" />

## 3. REINFORCE 算法

policy gradient 的基础算法是一种基于 **整条回合数据** 的更新, 即 **蒙特卡罗策略梯度算法**，也称为 **Reinforce 算法**。 这种方法是 policy gradient 的最基本方法。也就是说<u>当我们选择一个动作以后，其实并不知道动作的优劣，而只有最终游戏结束得到结果的时候，若这一系列行为导致了好的结果，则这一系列行为全是好的行为，反之若导致了坏的结果，这这一系列行为全是坏的行为</u>

<img src="https://gitee.com/veal98/images/raw/master/img/20201108212847.png" style="zoom: 50%;" />

<img src="https://gitee.com/veal98/images/raw/master/img/20201110201325.png" style="zoom:50%;" />

⭐ <img src="https://gitee.com/veal98/images/raw/master/img/20201110201523.png" style="zoom: 67%;" /> 表示在 状态 `s` 对所选动作 `a` 的**吃惊度**, 如果 $\pi(s,a)$ 概率越小, 反向的 $log\pi(s,a)$ 反而越大. 如果在 $\pi(s,a)$ 很小的情况下, 拿到了一个大的奖励 `R`, 那 $log\pi(s,a)V$ 就更大, 表示更吃惊

> 💡 通俗来说， **我选了一个不常选的动作（概率小）, 却发现原来它能得到了一个好的 reward, 那我就得对这次的参数进行一个大幅修改. 这就是吃惊度的物理意义**

## 4. REINFROCE 算法改进

**原始的 REINFORCE 算法因为优化轨迹之间的方差很大，收敛速度较慢，训练过程并不足够平滑**。我们可以通过 `方差缩减(Variance Reduction)` 思想从因果性和基准线两个角度进行改进。

- **因果性**：

  <img src="https://gitee.com/veal98/images/raw/master/img/20201110202653.png" style="zoom: 50%;" />

  使用 Q 函数替代 R（$Q(s_t,a_t)$ 函数代表了从状态 $𝑠_𝑡$开始执行 $𝑎_𝑡$ 动作后 $𝜋_𝜃$ 的回报估计值）

  由于只考虑 $𝑎_𝑡$ 开始的轨迹 $𝜏_{𝑡:𝑇}$，$𝑅(𝜏_{𝑡:𝑇})$ 方差变小了

- **基准线 baseline**：

  <img src="https://gitee.com/veal98/images/raw/master/img/20201110203200.png" style="zoom:50%;" />

  基准线 𝑏 可以通过蒙特卡罗方法进行估计（取平均值）：

  <img src="https://gitee.com/veal98/images/raw/master/img/20201110203354.png" style="zoom:50%;" />

  如果考虑因果性，则：

  <img src="https://gitee.com/veal98/images/raw/master/img/20201110203426.png" style="zoom:50%;" />

  

  基准线 𝑏 同样可以采用另一个神经网络来估计，Actor-Critic 方法中会再做介绍，实际上很多策略梯度算法也经常使用神经网络来估计基准线 𝑏。算法可灵活调整，掌握算法思想最重要。

✍ 带基准的 REINFORCE 算法流程如算法 2 所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20201110203749.png" style="zoom:67%;" />

## 📚 References

- [Bilibili - 李宏毅《深度强化学习》](https://www.bilibili.com/video/BV1MW411w79n)
- [Github - LeeDeepRL - Notes](https://datawhalechina.github.io/leedeeprl-notes/)
- [CSDN - 李宏毅深度强化学习笔记 - jessie](https://blog.csdn.net/cindy_1102/article/details/87904928)
- 👍 [Github - Deep-Learning-with-TensorFlow-book](https://github.com/dragen1860/Deep-Learning-with-TensorFlow-book)