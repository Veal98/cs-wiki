# 🚀 Pytroch 简介

---

## 1. 什么是 Pytorch

**PyTorch 是帮助和促进我们构建深度学习项目的一个库**。它强调灵活性并允许我们使用熟悉的 Python 格式来表达深度学习模型。PyTorch 的易用性使得其很早便被研究社区所接纳，并且在官方发布后的这几年里，它已发展成为适用于广泛应用的最杰出的深度学习工具之一。

PyTorch 提供了一个核心数据结构 —— **Tensor**，一个与 NumPy 数组非常相似的多维数组。在此基础上，为了轻松实现并运行一个项目，或者设计和训练一个新的神经网络结构，Tensor 内部实现了一系列功能。Tensor 可用于加速数学运算（需要软硬件搭配得当），并且 PyTorch 内置了可用于分布式训练、高效数据加载的函数包，以及大量常用的深度学习函数。

正如 Python 用于编程一样，PyTorch 不仅是一个极好的入门深度学习的工具，也是一个在专业环境下用于现实世界中高水平作业的工具。

Pytorch 的官方文档 👉 [https://pytorch.org/docs/stable/](https://pytorch.org/docs/stable/)

## 2. 为什么使用 Pytorch

**PyTorch 由于其简单性因此很容易被推荐**。许多研究员和从业者都认为 PyTorch 易于学习、使用、扩展功能和调试。尽管 PyTorch 有一些注意事项（和任何复杂的领域一样），但是对于任何有过 Python 编程经验的开发的者来说，使用 PyTorch 会有种非常熟悉的感觉。

对于那些熟悉 NumPy 数组的使用者，PyTorch 中的 Tensor 类会变得非常相似。**PyTorch 感觉就像是能够在 GPU 上运行并且带有自动求导功能的 NumPy，这使得 PyTorch 非常适合于深度学习中的反向传播**。

Tensor API 使得与深度学习相关类的其他功能不那么引人注目；用户大多可以假装这些功能不存在，直到需要它们为止。

PyTorch的设计理念是强大的表达能力，它允许开发人员在实现复杂模型的同时避免增加不必要的复杂性，**PyTorch库（library）并不是框架（framework）！**在深度学习领域，PyTorch 可以说是最容易将想法无缝翻译为Python代码的深度学习库。因此，PyTorch 已经广泛应用于各种研究，国际会议的高引用率证明了这一点。

PyTorch也能很好的完成从研发到生产这一过程。尽管 **PyTorch 最初专注于学术研究领域**，但它也配备了高性能的C++运行引擎以至于用户可以不必依赖 Python 来部署模型，并且可以在摆脱 Python 运行机制的限制下保留PyTorch的大部分灵活性。

## 3. Pytorch 包含的组件

首先，**虽然“PyTorch”包含“Python”中的"Py"，但PyTorch中有很多非Python代码**。由于性能原因，大多数PyTorch都是用C++和 CUDA 编写的，**CUDA是NVIDIA提供的类似C++的语言，可以将其编译然后在 NVIDIA GPU 上大规模并行运行**。大多数情况下，你将基于Python来运行PyTorch，构建和训练模型，并使用训练后的模型来解决问题。根据给定的性能实际要求和规模要求，**纯Python代码的方案足以将模型投入生产**。

> 💡 **CUDA（Compute Unified Device Architecture）**，是显卡厂商[NVIDIA](https://baike.baidu.com/item/NVIDIA)推出的运算平台。 CUDA™是一种由NVIDIA推出的通用[并行计算](https://baike.baidu.com/item/并行计算/113443)架构，该架构使[GPU](https://baike.baidu.com/item/GPU)能够解决复杂的计算问题。 它包含了CUDA[指令集架构](https://baike.baidu.com/item/指令集架构)（[ISA](https://baike.baidu.com/item/ISA)）以及GPU内部的并行计算引擎。 （以上解释来自百度词条）

实际上，就可用性和与广泛的Python生态系统的集成性而言，Python API就是PyTorch的亮点。接下来，我们来探究下PyTorch的内置模块。

PyTorch的核心是**提供多维数组的库**，在PyTorch术语中这些多维数组称为**张量（tensor）**，而`torch`模块则提供了可对其进行扩展操作的库。张量和相关操作都可以在CPU或GPU上运行。相比于CPU，在GPU上运行可以显著的提高速度，而且使用PyTorch最多需要一到两个额外的函数来调用GPU。

PyTorch提供的第二个核心功能是**允许张量跟踪对其所执行的操作，并通过反向传播来计算输出相对于其任何输入的导数**。此功能由张量自身提供，并通过`torch.autograd`进一步扩展完善。

🤖 **PyTorch 提供了构建和训练神经网络所需的所有模块**。下图展示了一个标准流程：加载数据，训练模型，然后将该模型部署到生产环境中：

<img src="https://gitee.com/veal98/images/raw/master/img/20201018104104.png" style="zoom: 50%;" />

**PyTorch中用于构建神经网络的核心模块位于`torch.nn`中**，该模块提供了常见的神经网络层和其他架构组件。全连接层、卷积层、激活函数和损失函数都能在该模块找到。这些组件可用于构建和初始化上图中心部分所展示的未训练模型

为了训练该模型，你需要以下几点（除了循环本身以外，循环可直接采用标准的 Python for 循环）：

- 训练数据的资源
- 使模型能够适应训练数据的优化器以及将模型和数据导入硬件中的方法
- 该硬件将执行训练模型所需的计算

`torch.util.data`模块能够找到适用于数据加载和处理的工具。需要用到的两个主要的类是`Dataset`和`DataLoader`。`Dataset`承担了你的自定义的数据（可以是任何一种格式）与标准PyTorch张量之间的转换任务。`DataLoader`可以在后台生成子进程来从`Dataset`中加载数据，使数据准备就绪并在循环可以使用后立即等待训练循环。

在最简单的情况下，模型将在本地CPU或单个GPU上运行所需的计算。因此，当训练循环获取到数据时就能够立即开始运算。然而更常见的情形是使用专用的硬件（例如多个GPU）或利用多台计算机的资源来训练模型。在这些情况下，可以通过`torch.nn.DataParallel`和`torch.distributed`来使用其他的可用硬件。

当模型根据训练数据得到输出结果后，`torch.optim`提供了更新模型的标准方法，从而使输出更接近于训练数据中的标签。

**PyTorch 的默认运行方式为即时执行（eager mode）**。每当 Python 解释器执行到包含 PyTorch 的指令时，相应的操作就会立即通过底层的C++或CUDA来执行。 

**为了避开Python解释器所带来的成本，以及使模型能够独立于Python而运行，PyTorch 还提供了一个名为TorchScript 的延迟执行模块。**借助 TorchScript，PyTorch 可以序列化一组独立于Python而被调用的指令集。你可以将这个模型看作是具有针对张量操作的有限指令集的虚拟机。除了不产生调用Python的开销外，这种执行模式还使得PyTorch能够实时（Just in Time, JIT）将已知操作序列转换为更有效的混合操作。这些功能是PyTorch产品部署能力的基础。

## 4. 环境配置

先查看一下我们的电脑能够支持的最大 CUDA 版本 👇 

<img src="https://gitee.com/veal98/images/raw/master/img/20201018105936.png" style="zoom: 67%;" />

进入 [PyTorch官网](https://pytorch.org/)，选择稳定版 1.6 ，依次选择你电脑的配置（这里我的电脑已经安装好了 [Anaconda](https://www.anaconda.com/download/)）：

<img src="https://gitee.com/veal98/images/raw/master/img/20201018112618.png" style="zoom:67%;" />

**拷贝给出的命令在 cmd 下运行**：

<img src="https://gitee.com/veal98/images/raw/master/img/20201018112822.png" style="zoom: 67%;" />

测试安装是否成功（打开 Jupyter Notebook）：

<img src="https://gitee.com/veal98/images/raw/master/img/20201018115147.png" style="zoom:67%;" />

🎉 至此，Pytorch 1.6 以及 CUDA 10.2 安装成功

🚀 接下来我们的开发环境都使用 Anaconda + Jupyter Notebook

## 📚 References

- [DL-with-PyTorch-Chinese](https://tangshusen.me/Deep-Learning-with-PyTorch-Chinese/#/)

  <img src="https://gitee.com/veal98/images/raw/master/img/20201018102139.png" style="zoom:25%;" />
  
- [PyTorch 官方教程中文版](http://pytorch123.com/)

- [Pytorch 官方文档](https://pytorch.org/docs/stable/)