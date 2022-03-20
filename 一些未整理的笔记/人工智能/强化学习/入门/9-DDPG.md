# 🍨 Deep Deterministic Policy Gradient（DDPG）

---

**Actor-Critic 涉及到了两个神经网络, 而且每次都是在连续状态中更新参数, 每次参数更新前后都存在相关性, 导致神经网络只能片面的看待问题, 甚至导致神经网络学不到东西**. 想想我们之前介绍的DQN是如何解决的这个问题的？就是建立了两个网络，一个Q目标网络，一个Q现实网络，同时使用了经验回放机制。那么如果在 `Actor-Critic` 网络结构中加入这两个机制，就得到了一种新的强化学习模型：`深度确定性策略梯度算法 Deep Deterministic Policy Gradient`，简称`DDPG`。可以说 **Actor-Critic + DQN = DDPG**。

![](https://gitee.com/veal98/images/raw/master/img/20201102102711.png)

## 1. Deep 和 DQN

Deep 顾名思义, 就是通过神经网络走向更深层次

🚩 <u>由于神经网络的训练需要保证输入数据是独立同分布的，而强化学习任务中的数据彼此之间存在很强的马尔科夫关联性，将神经网络作为函数逼近器往往使强化学习算法表现不稳定。DQN 算法使用了经验回放池与独立目标网络的技术解决了这个问题，DDPG 算法也汲取了 DQN 的成功经验，同样使用经验回放池与独立目标网络的技术来提升算法稳定性，加速网络的训练过程。</u>

不过 DDPG 的神经网络形式比 DQN 的要复杂一点点.

![](https://gitee.com/veal98/images/raw/master/img/20201102102811.png)

## 2. Deterministic Policy Gradient

> 🚨 基于策略梯度的方法，根据策略是随机策略还是确定性策略，分为经典的 `策略梯度方法（Policy Gradient,PG）` 与 `确定性策略梯度方法（Deterministic Policy Gradient, DPG）`。

Policy gradient 相比其他的强化学习方法, 它能被用来在连续动作上进行动作的筛选 . 而且筛选的时候是根据所学习到的动作分布随机进行筛选, 而 Deterministic 改变了输出动作的过程, 斩钉截铁的只在连续动作上输出一个动作值.

![](https://gitee.com/veal98/images/raw/master/img/20201102105726.png)

我们看一下 DDPG 关于此的概念定义：

🔸 **确定性行为策略 `μ`** : 定义为一个函数，每一步的行为可以通过 $a_{t} = \mu(s_{t}) $ 计算获得。

🔸 **策略网络**：用一个卷积神经网络对 μ 函数进行模拟，这个网络我们就叫做策略网络，其参数为 $\theta^{\mu}$

🔸 **behavior policy `β`** : 在 RL 训练过程中，我们要兼顾 2 个 e : exploration 和 exploit：

<u>exploration 的目的是探索潜在的更优策略</u>，所以训练过程中，**我们为 action 的决策机制引入随机噪声，将action 的决策从确定性过程变为一个随机过程， 再从这个随机过程中采样得到确定的 action，下达给环境执行**。过程如下图所示：

![](https://gitee.com/veal98/images/raw/master/img/20201113165016.png)

上述这个策略叫做 behavior 策略，用 β 来表示, 这时 RL 的训练方式叫做 off-policy.

这里与 $\epsilon-greedy$ 的思路是类似的。

DDPG 中，使用 [Uhlenbeck-Ornstein随机过程](https://en.wikipedia.org/wiki/Ornstein–Uhlenbeck_process)（下面简称 `UO` 过程），作为引入的随机噪声。UO过程在时序上具备很好的相关性，可以使 agent 很好的探索具备动量属性的环境。

🚨 **注意**：<u>这个 `β` 不是我们想要得到的最优策略，仅仅在训练过程中，生成下达给环境的 action， 从而获得我们想要的数据集，比如状态转换 (transitions)、或者 agent 的行走路径等，然后利用这个数据集去训练策略 `μ` ，以获得最优策略。在测试 test 和评估 evaluation 时，使用 `μ`，不会再使用 `β`。</u>

## 3. DDPG 神经网络

现在我们来说说 DDPG 中所用到的神经网络. 它其实和我们之前提到的 Actor-Critic 形式差不多, 也需要有基于 策略 Policy 的神经网络（`策略网络`） 和基于 价值 Value 的神经网络（`价值网络 / Q 网络`）, 但是为了体现 DQN 的思想, 每种神经网络我们都需要再细分为两个（`online 网络`和 `target 网络`）：

- **【策略网络 Actor】**：同 DQN，由于我们使用了独立目标网络技术，所以我们的策略网络中需要维护两个网络参数：策略网络（online）参数，策略目标网络（target）参数。online 网络具有最新参数，而 target 网络不及时更新
- **【Q 网络 Critic】**：同样的，我们的 Q 网络中需要维护两个网络参数：Q 网络（online）参数，Q 目标网络（target）参数。online 网络具有最新参数，而 target 网络不及时更新

![](https://gitee.com/veal98/images/raw/master/img/20201102110538.png)

⭐ 我们采用了类似 DQN 的双网络结构，同样的我们<u>只需要训练 online 网络的参数，而 target 目标网络的参数则每隔一段时间再进行更新</u>。**不过 DDPG 中目标网络参数的更新不像DQN 算法采用的直接进行参数复制，而是使用了“ `soft update 软更新` ”的策略，以确保 $\theta^{Q'}$ 和 $\theta^{\mu'}$ 渐渐的逼近参数 $\theta^{Q}$ 和 $\theta^{\mu}$**：

<img src="https://gitee.com/veal98/images/raw/master/img/20201113165957.png" style="zoom: 80%;" />

`soft update 软更新算法`：

<img src="https://gitee.com/veal98/images/raw/master/img/20201113170145.png" style="zoom: 80%;" />

## 4. DDPG 整体算法详解

💧 **DDPG 算法过程叙述**：

首先明确由经验回放池统一收集交互产生的经验数据。DDPG 在训练中的每次迭代时，经验回放池中随机采样一个小批量的样本进行经验回放和网络参数更新。训练时，每个 DDPG 都是采用的演员-评论家框架学习对应的子策略，其过程如图所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20201119114532.png" style="zoom: 76%;" />

<u>每个DDPG 的训练过程分为了更新和交互两部分，更新部分进行网络参数的更新，交互部分则负责智能体和环境的交互，每次迭代时，DDPG 先完成交互部分，再完成更新部分。</u> 

- 在交互部分中，演员网络控制智能体与环境进行信息交互，其接收当前环境状态信息并据此输出智能体应该采取的相应动作，环境则先反馈上个动作的回报信息，并在智能体进行动作后跳转状态。整个交互过程的信息作为经验存储到经验回放池中，作为训练样本。 

- 在更新部分中，每个DDPG 首先从经验回放池中随机采样一个小批量的样本集合，以用于网络参数的更新。主网络中的评论家网络先根据 Q 学习理论和最小化损失函数的原则进行网络参数更新，之后演员网络使用策略梯度沿着目标函数值增大的方向更新对应参数。对于目标网络的参数更新，演员目标网络和评论家目标网络均采用“软更新”的方法，以一定的速度逐渐逼近主网络的参数。 

<br>

📜  **DDPG 算法如下**：

![](https://gitee.com/veal98/images/raw/master/img/20201113170644.png)

🚕 初始化 actor / critic 的 online 神经网络参数: $\theta^{Q}$ 和 $\theta^{\mu}$ ； 

🚕 将 online  网络的参数拷贝给对应的 target 网络参数 ： $\theta^{Q{\prime}} \leftarrow \theta^{Q}$, $\theta^{\mu{\prime}} \leftarrow \theta^{\mu} $ ；

🚕 初始化 replay memory buffer R ;

🚕 for each episode:

- 初始化 UO 随机过程；

- for t = 1, T:

  - actor 根据 behavior 策略选择一个 $a_t$ , 下达给环境执行该动作

    <img src="https://gitee.com/veal98/images/raw/master/img/20201113171214.png" style="zoom:80%;" />

    behavior策略是一个根据当前 online 策略 μ 和随机 UO 噪声生成的随机过程, 从这个随机过程采样获得 $a_{t}$ 的值。

  - 环境执行动作 $a_t$ 并产生新的状态 $s_{t+1}$

  - actor 将这个状态转换过程(transition): $(s_{t}, a_{t}, r_{t}，s_{t+1}) $ 存入replay memory buffer R 中，作为训练 online 网络的数据集

  - 从 replay memory buffer R中，随机采样 N 个 transition 数据，作为 online 策略网络、 online Q 网络的一个 mini-batch 训练数据。我们用$(s_{i}, a_{i}, r_{i}，s_{i+1}) $表示 mini-batch 中的单个 transition 数据

  - 计算 online Q网络的梯度 gradient：
    Q 网络的 loss 定义：使用类似于监督式学习的方法，定义 loss为 MSE: mean squared error：

    <img src="https://gitee.com/veal98/images/raw/master/img/20201113171548.png" style="zoom:80%;" />

    其中， $y_{i}$  可以看做"标签"：

    <img src="https://gitee.com/veal98/images/raw/master/img/20201113171622.png" style="zoom:80%;" />

    基于标准的反向传播方法 back-propagation，就可以求得 L 针对  $\theta^{Q}$ 的梯度 gradient：$ \triangledown_{\theta^{Q}} L $ 。

    有两点值得注意：

    ① $y_{i}$  的计算，使用的是 target 策略网络 μ ′   和 target Q 网络 Q ′  。这样做是为了Q网络参数的学习过程更加稳定，易于收敛。

    ② 这个标签本身依赖于我们正在学习的 target 网络，这是区别于监督式学习的地方。
    
  - update online Q： 采用 Adam optimizer 更新  $\theta^{Q}$ 

  - 计算策略网络的策略梯度 policy gradient：
    

  policy gradient的定义：表示 performance objective 的函数J  针对 $\theta^{\mu}$ 的 gradient。 根据 2015 D.Silver 的[DPG 论文](http://xueshu.baidu.com/s?wd=paperuri:(43a8642b81092513eb6bad1f3f5231e2)&filter=sc_long_sign&sc_ks_para=q=Deterministic policy gradient algorithms&sc_us=6855198342873463498&tn=SE_baiduxueshu_c1gjeupa&ie=utf-8)中的数学推导，在采用off-policy的训练方法时，policy gradient算法如下：

  ![](https://gitee.com/veal98/images/raw/master/img/20201113172144.png)

  根据 Monte-carlo 方法，使用 mini-batch 数据代入上述 policy gradient 公式，可以作为对上述期望值的一个无偏差估计 (un-biased estimate), 所以 policy gradient 可以改写为

    <img src="https://gitee.com/veal98/images/raw/master/img/20201113172035.png" style="zoom: 67%;" />

  - 	update online 策略网络：采用 Adam optimizer更新 $\theta^{\mu}$ 
      
  - 	soft update target 网络 μ ′ 和 Q ′ ：
      <img src="https://gitee.com/veal98/images/raw/master/img/20201113170145.png" style="zoom: 80%;" />
      
  - end for time step

- 🚕 end for episode

![](https://gitee.com/veal98/images/raw/master/img/20201113172444.png)

## 5. 代码实现

> ✅ TODO

## 📚 References

- [莫烦 Python — 强化学习](https://mofanpy.com/tutorials/machine-learning/reinforcement-learning/intro-RL-methods/)
- [Github - DeepRL-TensorFlow2](https://github.com/marload/DeepRL-TensorFlow2) - 🐋 Simple implementations of various popular Deep Reinforcement Learning algorithms using TensorFlow2
- [Deep Reinforcement Learning - 1. DDPG原理和算法](https://blog.csdn.net/kenneth_yu/article/details/78478356)
- 《基于集成的多深度确定性策略梯度的无人驾驶策略研究 — 2019 中科院 吴俊塔》