# 🍩 八、神经网络：前向传播算法 Neural Networks

## 1. 非线性假设 Non-linear Hypotheses

我们之前学的，**无论是线性回归还是逻辑回归都有这样一个缺点，即：当特征太多时，计算的负荷会非常大**。

下面是一个例子：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604200009.png" style="zoom: 80%;" />

当我们使用 x 的多次项式进行预测时，我们可以应用的很好。 之前我们已经看到过，使用非线性的多项式项，能够帮助我们建立更好的分类模型。假设我们有非常多的特征，例如大于100个变量，我们希望用这100个特征来构建一个非线性的多项式模型，结果将是数量非常惊人的特征组合，即便我们只采用两两特征 $(x_1x_2 + x_1x_3 + x_1x_4 + ... + x_2x_3 + x_2x_4 + ... + x_{99}x_{100})$ 的组合，我们也会有接近5000个组合而成的特征。这对于一般的逻辑回归来说需要计算的特征太多了。

假设我们希望训练一个模型来识别视觉对象（例如识别一张图片上是否是一辆汽车），我们怎样才能这么做呢？一种方法是我们提供一个带标签的样本集，其中一些样本是各类汽车，另一部分不是汽车，将这个样本集输入给学习算法，以训练出一个分类器。然后我们进行测试，输入一幅新的图片，让分类器判定这是什么东西。

<img src="https://gitee.com/veal98/images/raw/master/img/20200604200709.png" style="zoom:50%;" />

假如我们只选用灰度图片，每个像素则只有一个值（而非 **RGB**值），我们可以选取图片上的两个不同位置上的两个像素，然后训练一个逻辑回归算法利用这两个像素的值来判断图片上是否是汽车：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604200812.png" style="zoom:50%;" />

<img src="https://gitee.com/veal98/images/raw/master/img/20200604200855.png" style="zoom: 50%;" />

假使我们采用的都是50x50像素的小图片，并且我们将所有的像素视为特征，则会有 2500个特征，如果我们要进一步将两两特征组合构成一个多项式模型，则会有约 $2500^2 / 2$ 个（接近3百万个）特征。**普通的逻辑回归模型，不能有效地处理这么多的特征，这时候我们就需要神经网络**。

##  2. 神经元和大脑 Neurons and the Brain

神经网络是一种很古老的算法，它最初产生的目的是制造能模拟大脑的机器。

神经网络逐渐兴起于二十世纪八九十年代，应用得非常广泛。但由于各种原因，在90年代的后期应用减少了。但是近几年来，神经网络又东山再起了。其中一个原因是：**神经网络是计算量有些偏大的算法。然而由于近些年计算机的运行速度变快，才足以真正运行起大规模的神经网络**。正是由于这个原因和其他一些我们后面会讨论到的技术因素，如今的神经网络对于许多应用来说是最先进的技术。

我们能学习数学，学着做微积分，而且大脑能处理各种不同的令人惊奇的事情。似乎如果你想要模仿它，你得写很多不同的软件来模拟所有这些五花八门的奇妙的事情。不过能不能假设大脑做所有这些，不同事情的方法，不需要用上千个不同的程序去实现。相反的，大脑处理的方法，只需要一个单一的学习算法就可以了？

![](https://gitee.com/veal98/images/raw/master/img/20200604201846.png)

大脑的这一部分这一小片红色区域是你的听觉皮层，你现在正在理解我的话，这靠的是耳朵。耳朵接收到声音信号，并把声音信号传递给你的听觉皮层，正因如此，你才能明白我的话。

神经系统科学家做了下面这个有趣的实验，把耳朵到听觉皮层的神经切断。在这种情况下，将其重新接到一个动物的大脑上，这样从眼睛到视神经的信号最终将传到听觉皮层。如果这样做了。那么结果表明听觉皮层将会学会“看”。这里的“看”代表了我们所知道的每层含义。所以，如果你对动物这样做，那么动物就可以完成视觉辨别任务，它们可以看图像，并根据图像做出适当的决定。它们正是通过脑组织中的这个部分完成的。

下面再举另一个例子，这块红色的脑组织是你的躯体感觉皮层，这是你用来处理触觉的，如果你做一个和刚才类似的重接实验，那么躯体感觉皮层也能学会“看”。这个实验和其它一些类似的实验，被称为神经重接实验，从这个意义上说，如果人体有同一块脑组织可以处理光、声或触觉信号，那么也许存在一种学习算法，可以同时处理视觉、听觉和触觉，而不是需要运行上千个不同的程序，或者上千个不同的算法来做这些大脑所完成的成千上万的美好事情。也许我们需要做的就是找出一些近似的或实际的大脑学习算法，然后实现它大脑通过自学掌握如何处理这些不同类型的数据。在很大的程度上，可以猜想如果我们把几乎任何一种传感器接入到大脑的几乎任何一个部位的话，大脑就会学会处理它。

下面再举几个例子：

![](https://gitee.com/veal98/images/raw/master/img/20200604201858.png)

这张图是用舌头学会“看”的一个例子。它的原理是：这实际上是一个名为**BrainPort**的系统，它现在正在**FDA** (美国食品和药物管理局)的临床试验阶段，它能帮助失明人士看见事物。它的原理是，你在前额上带一个灰度摄像头，面朝前，它就能获取你面前事物的低分辨率的灰度图像。你连一根线到舌头上安装的电极阵列上，那么每个像素都被映射到你舌头的某个位置上，可能电压值高的点对应一个暗像素电压值低的点。对应于亮像素，即使依靠它现在的功能，使用这种系统就能让你我在几十分钟里就学会用我们的舌头“看”东西。

![](https://gitee.com/veal98/images/raw/master/img/20200604201924.png)

这是第二个例子，关于人体回声定位或者说人体声纳。你有两种方法可以实现：你可以弹响指，或者咂舌头。不过现在有失明人士，确实在学校里接受这样的培训，并学会解读从环境反弹回来的声波模式—这就是声纳。如果你搜索**YouTube**之后，就会发现有些视频讲述了一个令人称奇的孩子，他因为癌症眼球惨遭移除，虽然失去了眼球，但是通过打响指，他可以四处走动而不撞到任何东西，他能滑滑板，他可以将篮球投入篮框中。注意这是一个没有眼球的孩子。

![](https://gitee.com/veal98/images/raw/master/img/20200604201931.png)

第三个例子是触觉皮带，如果你把它戴在腰上，蜂鸣器会响，而且总是朝向北时发出嗡嗡声。它可以使人拥有方向感，用类似于鸟类感知方向的方式。

还有一些离奇的例子：

![](https://gitee.com/veal98/images/raw/master/img/20200604201938.png)

如果你在青蛙身上插入第三只眼，青蛙也能学会使用那只眼睛。因此，这将会非常令人惊奇。如果你能把几乎任何传感器接入到大脑中，大脑的学习算法就能找出学习数据的方法，并处理这些数据。从某种意义上来说，如果我们能找出大脑的学习算法，然后在计算机上执行大脑学习算法或与之相似的算法，也许这将是我们向人工智能迈进做出的最好的尝试。人工智能的梦想就是：有一天能制造出真正的智能机器。

因此在接下来的一些课程中，我们将开始深入到神经网络的技术细节。

## 3. 神经网络模型 — 前向传播算法

为了构建神经网络模型，我们需要首先思考大脑中的神经网络是怎样的？每一个神经元都可以被认为是一个**处理单元/神经核（processing unit/Nucleus）**，它含有许多**输入/树突（input/Dendrite）**，并且有一个**输出/轴突（output/Axon）**。神经网络是大量神经元相互链接并通过电脉冲来交流的一个网络。

<img src="https://gitee.com/veal98/images/raw/master/img/20200604202140.png" style="zoom:50%;" />

上面是一组神经元的示意图，神经元利用微弱的电流进行沟通。这些弱电流也称作动作电位，其实就是一些微弱的电流。所以如果神经元想要传递一个消息，它就会就通过它的轴突，发送一段微弱电流给其他神经元.

<img src="https://gitee.com/veal98/images/raw/master/img/20200604202353.png" style="zoom:50%;" />

**神经网络模型建立在很多神经元之上**，每一个神经元又是一个个学习模型。🚩 <u>这些神经元（也叫激活单元，**activation unit**）采纳一些特征作为输出，并且根据本身的模型提供一个输出</u>。在神经网络中，**参数又可被成为权重（weight）。**下图是一个以逻辑回归模型作为自身学习模型的神经元示例：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604202739.png" style="zoom:50%;" />

我们设计出了类似于神经元的神经网络，效果如下：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604202948.png" style="zoom:50%;" />

其中, x1 x2 x3是**输入单元（input units）**，我们将原始数据输入给它们。 a1 a2 a3 是**中间单元**，它们负责将数据进行处理，然后呈递到下一层。 最后是**输出单元**，它负责计算。

神经网络模型是许多逻辑单元按照不同层级组织起来的网络，每一层的输出变量都是下一层的输入变量。上图为一个3层的神经网络，**第一层成为输入层（Input Layer），最后一层称为输出层（Output Layer），中间一层成为隐藏层（Hidden Layers）**（实际上非输出层和非输入层都称为隐藏层）。我们为每一层都增加一个**偏差单位（bias unit）**：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604203155.png" style="zoom:50%;" />

下面引入一些标记法来帮助描述模型：

- $a_i^{j}$ ：activation of unit i in layer j

  代表第 j 层的第 i 个激活单元（所谓激活单元，就是由一个具体神经元计算并输出的值）

- $θ^{(j)}$：matrix of weight controlling function mapping from layer j to layer j + 1

  **代表从第 j 层映射到第 j+1 层时的权重的矩阵，例如 $θ^{(1)}$ 代表从第一层映射到第二层的权重的矩阵**

  其尺寸为：<u>以第 j+1 层的激活单元数量为行数，以第 j 层的激活单元数加一为列数的矩阵</u>。例如：上图所示的神经网络中 $θ^{(1)}$ 的尺寸为 3*4。
  
  > $θ^{1}$ = $θ = \begin{bmatrix} θ^{(1)}_{10} & θ^{(1)}_{11} & θ^{(1)}_{12} & θ^{(1)}_{13} \\ θ^{(1)}_{20} & θ^{(1)}_{21} & θ^{(1)}_{22} & θ^{(1)}_{23} \\ ...\end{bmatrix}$
  >
  > 🚩 $θ^{(1)}_{12}$ 表示 第 1 层到 第 2 层的映射矩阵中，（第 1 层的第 2 个单元） 到 （第 2 层的 第 1 个单元）的映射。（即下标是反向输出的）

🚩 对于上图所示的模型，激活单元和输出分别表达为：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604203815.png" style="zoom:50%;" />

我们可以知道：每一个 a 都是由上一层所有的 x 和每一个 x 所对应的决定的。（⭐ **我们把这样从左到右的算法称为前向传播算法( FORWARD PROPAGATION )）**

## 4. 神经网络模型 — 前向传播算法进阶

相对于使用循环来编码，利用向量化的方法会使得计算更为简便。以上面的神经网络为例，<u>试着计算第二层的值</u>：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604210600.png" style="zoom:80%;" />

![](https://gitee.com/veal98/images/raw/master/img/20200604210703.png)

<img src="https://gitee.com/veal98/images/raw/master/img/20200621105751.png" style="zoom:80%;" />

这只是针对训练集中一个训练实例所进行的计算。如果我们要对整个训练集进行计算，我们需要将训练集特征矩阵进行转置，使得同一个实例的特征都在同一列里。即： $z^{(2)} = θ^{(1)} * X^T$

为了更好了了解**Neuron Networks**的工作原理，我们先把左半部分遮住：

右半部分其实就是以 a0 a1 a2 a3 按照**Logistic Regression**的方式输出 $h_θ(x)$：

![](https://gitee.com/veal98/images/raw/master/img/20200604210941.png)

🚩 其实神经网络就像是**logistic regression**，只不过我们把**logistic regression**中的输入向量 [x1 ~ x3]变成了中间层的 [ $a_1^{(2)}$ ~ $a_3^{(2)}$], 即: <img src="https://gitee.com/veal98/images/raw/master/img/20200604211127.png" style="zoom:80%;" /> **我们可以把 a0 a1 a2 a3 看成更为高级的特征值，也就是 x0 x1 x2 x3 的进化体**，并且它们是由 x 与 θ 决定的，因为是梯度下降的，所以  a 是变化的，并且变得越来越厉害，所以这些更高级的特征值远比仅仅将 x 次方厉害，也能更好的预测新数据。 这就是神经网络相比于逻辑回归和线性回归的优势。



## 5. 例子和直观理解 Examples and Intuitions

从本质上讲，神经网络能够通过学习得出其自身的一系列特征。在普通的逻辑回归中，我们被限制为使用数据中的原始特征 x1 x2 x3 x4 ... xn，我们虽然可以使用一些二项式项来组合这些特征，但是我们仍然受到这些原始特征的限制。**在神经网络中，原始特征只是输入层，在我们上面三层的神经网络例子中，第三层也就是输出层做出的预测利用的是第二层的特征，而非输入层中的原始特征，我们可以认为第二层中的特征是神经网络通过学习后自己得出的一系列用于预测输出变量的新特征。**

神经网络中，单层神经元（无中间层）的计算可用来表示逻辑运算，比如逻辑与(**AND**)、逻辑或(**OR**)。

### ① 神经网络表示 AND 函数

举例说明：用神经网络表现逻辑与(**AND**)函数；下图中左半部分是神经网络的设计与**output**层表达式，右边上部分是**sigmod**函数，下半部分是真值表。

下图的神经元（三个权重分别为-30，20，20）可以被视为作用同于逻辑与（**AND**）：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604212310.png" style="zoom:50%;" />

### ② 神经网络表示 OR 函数

下图的神经元（三个权重分别为-10，20，20）可以被视为作用等同于逻辑或（**OR**）：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604212510.png" style="zoom:50%;" />

**OR**与**AND**整体一样，区别只在于的取值不同。

### ③ 神经网络表示 NOT 函数 逻辑非

下图的神经元（两个权重分别为 10，-20）可以被视为作用等同于逻辑非（**NOT**）：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604212759.png" style="zoom:50%;" />

### ④ 神经网络表示 XNOR 函数 异或非

<img src="https://gitee.com/veal98/images/raw/master/img/20200604213208.png" style="zoom:80%;" />

首先构造一个能表达 <img src="https://gitee.com/veal98/images/raw/master/img/20200604213326.png" style="zoom:80%;" /> 部分的神经元：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604213340.png" style="zoom:80%;" />

然后将表示<img src="https://gitee.com/veal98/images/raw/master/img/20200604213504.png" style="zoom:80%;" /> 的神经元和表示 <img src="https://gitee.com/veal98/images/raw/master/img/20200604213326.png" style="zoom:80%;" /> 的神经元以及表示 OR 的神经元进行组合：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604213547.png" style="zoom:50%;" />

我们就得到了一个能实现 XNOR 运算符功能的神经网络。

<img src="https://gitee.com/veal98/images/raw/master/img/20200604213655.png" style="zoom:50%;" />

按这种方法我们可以逐渐构造出越来越复杂的函数，也能得到更加厉害的特征值。

这就是神经网络的厉害之处。

## 6. 多类别分类 Multiclass Classification

当我们有不止两种分类时（也就是 y = 1, 2, 3...），比如以下这种情况，该怎么办？如果我们要训练一个神经网络算法来识别路人、汽车、摩托车和卡车，在输出层我们应该有 4 个值。例如，第一个值为 1 或 0 用于预测是否是行人，第二个值用于判断是否为汽车。

输入向量 x 有三个维度，两个中间层，输出层 4 个神经元分别用来表示4类，也就是每一个数据在输出层都会出现 $[a b c d]^T$，且 a b c d 中仅有一个为 1，表示当前类。下面是该神经网络的可能结构示例：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604214226.png" style="zoom:50%;" />

神经网络算法的输出结果为四种可能情形之一：

<img src="https://gitee.com/veal98/images/raw/master/img/20200604214346.png" style="zoom:50%;" />



## ✍ Quiz

### ① 第 1 题

以下哪项陈述是正确的？选择所有正确项

- ✅ 神经网络中隐藏单元的激活值，在应用了sigmoid函数之后，总是在（0，1）范围内

- ✅ 在二进制值（0或1）上的逻辑函数可以（近似）用一些神经网络来表示

- 两层（一个输入层，一个输出层，没有隐藏层）神经网络可以表示异或函数

- 假设有一个三个类的多类分类问题，使用三层网络进行训练。设 $a^{(3)}_1 = (h_\Theta(x))_1$ 为第一输出单元的激活，并且类似地，有 $a^{(3)}_2 = (h_\Theta(x))_2$ 和 $a^{(3)}_3 = (h_\Theta(x))_3$。那么对于任何输入 x，必须有 $a^{(3)}_1 + a^{(3)}_2 + a^{(3)}_3 = 1$

### ② 第 2 题

考虑以下两个二值输入 x1,x2∈{0,1} 和输出 hΘ(x) 的神经网络。它（近似）计算了下列哪一个逻辑函数？

![](https://gitee.com/veal98/images/raw/master/img/20200604215107.png)

- ✅ OR 
- AND 
- NAND (与非) 
- XOR (异或)

### ③ 第 3 题

考虑下面给出的神经网络。下列哪个方程正确地计算了 $a_1^{(3)}$ 的激活？注：g(z) 是 sigmoid 激活函数

![](https://gitee.com/veal98/images/raw/master/img/20200604215223.png)

- ✅ $a_1^{(3)} = g(\Theta_{1,0}^{(2)}a_0^{(2)} + \Theta_{1,1}^{(2)}a_1^{(2)} + \Theta_{1,2}^{(2)}a_2^{(2)})$
- $a_1^{(3)} = g(\Theta_{1,0}^{(1)}a_0^{(1)} + \Theta_{1,1}^{(1)}a_1^{(1)} + \Theta_{1,2}^{(1)}a_2^{(1)})$
- $a_1^{(3)} = g(\Theta_{1,0}^{(1)}a_0^{(2)} + \Theta_{1,1}^{(1)}a_1^{(2)} + \Theta_{1,2}^{(1)}a_2^{(2)})$
-  此网络中不存在激活 $a_1^{(3)}$

### ④ 第 4 题

你有以下神经网络：

![](https://gitee.com/veal98/images/raw/master/img/20200604215356.png)

你想计算隐藏层 $a^{(2)}∈R^3$ 的激活，一种方法是使用以下 Octave 代码：

![](https://gitee.com/veal98/images/raw/master/img/20200604215448.png)

您需要一个矢量化的实现（即，一个不用循环的实现）。下列哪个实现正确计算 $a^{(2)}$ ？选出所有正确项

- ✅ z = Theta1 * x; a2 = sigmoid (z) 
- a2 = sigmoid (x * Theta1) 
- a2 = sigmoid (Theta2 * x) 
- z = sigmoid(x); a2 = sigmoid (Theta1 * z)

### ⑤ 第 5 题

![](https://gitee.com/veal98/images/raw/master/img/20200604220945.png)

- ✅ 不变
- 变大
- 变小
- 可能变大也可能变小

原因很简单，原本是 $a_1^{(2)} * -0.2 + a_2^{(2)} * -1.7$，而变化以后，变成了 $a_1^{(2)} * -1.7 + a_2^{(2)} * -0.2$，不过 $a_1^{(2)}$ 和 $a_2^{(2)}$ 也交换了值，所以，结果还是一样的，没有任何改变。

---

# 💻  编程作业  - 多类别逻辑回归 + 神经网络

## 1. 多类分类

这个部分需要实现手写数字（0到9）的识别。我们将扩展我们在上一节编程作业中写的 logistic 回归的实现，并将其应用于一对多的分类（不止两个类别）。

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.io import loadmat
```

### ① 数据集 DataSet

首先，加载数据集。这里的数据为MATLAB的格式，所以要使用`SciPy.io`的`loadmat`函数。

这个 MATLAB 格式的 `.mat` 文件，包含 5000 个 20*20 像素的手写字体图像，以及他对应的数字。另外，数字0 的 y 值，对应的是10

```python
def load_data(path):
    data = loadmat(path)
    X = data['X']
    y = data['y']
    return X,y

X,y = load_data('ex3/ex3data1.mat')
print(np.unique(y))  # 看下有几类标签 [ 1  2  3  4  5  6  7  8  9 10]
X.shape, y.shape  # (5000, 400), (5000, 1))
```

其中有5000个训练样本，每个样本是20*20像素的数字的灰度图像。每个像素代表一个浮点数，表示该位置的灰度强度。20×20 的像素网格被展开成一个 400 维的向量。在我们的数据矩阵X中，每一个样本都变成了一行，这给了我们一个 5000×400 矩阵 X，每一行都是一个手写数字图像的训练样本。

<img src="https://gitee.com/veal98/images/raw/master/img/20200621114035.png" style="zoom:80%;" />

### ② 数据可视化

```python
def plot_an_image(X):
    # 随机打印一个数字
    pick_one = np.random.randint(0,5000)
    image = X[pick_one,:]
    fig,ax = plt.subplots(figsize = (1,1))
    ax.matshow(image.reshape((20,20)),cmap = 'gray_r')
    plt.show()
    print('this should be {}'.format(y[pick_one]))

plot_an_image(X)
```

![](https://gitee.com/veal98/images/raw/master/img/20200621114530.png)

```python
def plot_100_image(X):
    # 随机找出 100 张图片
    sample_idx =np.random.choice(np.arange(X.shape[0]),100) # 随机选 100 个样本
    sample_images = X[sample_idx,:] # (100,400)
    fig,ax_array = plt.subplots(nrows = 10, ncols = 10, sharey = True, sharex = True, figsize = (8,8))
    
    for row in range(10):
        for column in range(10):
            ax_array[row,column].matshow(sample_images[10*row + column].reshape((20,20)),cmap = 'gray_r')
          
    plt.xticks([]) # 去除刻度，美观
    plt.yticks([])        
    plt.show()
    
plot_100_image(X)
```

![](https://gitee.com/veal98/images/raw/master/img/20200621115348.png)

### ③ 向量化逻辑回归 Vectorizing

你将用多分类逻辑回归做一个分类器。因为现在有10个数字类别，所以你需要训练10个不同的逻辑回归分类器。为了让训练效率更高，**将逻辑回归向量化**是非常重要的，不要用循环。

<u>在本节中，我们将实现一个不使用任何for循环的向量化的logistic回归版本</u>。

#### Ⅰ 向量化代价函数

首先写出向量化的代价函数。

回想正则化的logistic回归的代价函数是：

![](https://gitee.com/veal98/images/raw/master/img/20200621115706.png)

事实上我们可以对所有的样本用矩阵乘法来快速的计算。让我们如下来定义 X 和 θ ：

<img src="https://gitee.com/veal98/images/raw/master/img/20200621115845.png" style="zoom:80%;" />

🚩 如果 a 和 b 都是向量，那么 $a^Tb = b^Ta$，则：

<img src="https://gitee.com/veal98/images/raw/master/img/20200621120015.png" style="zoom:80%;" />

```python
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def regularized_cost(theta, X, y, l):
    """
    args:
        X: feature matrix, (m, n+1) # 插入了x0=1
        y: target vector, (m, )
        l: lambda constant for regularization
    """
    thetaReg = theta[1:] # theta_0 不需要正则化
    first = (-y*np.log(sigmoid(X@theta))) + (y-1)*np.log(1-sigmoid(X@theta))
    reg = (thetaReg@thetaReg)*l / (2*len(X))
    return np.mean(first) + reg
```

#### Ⅱ 向量化梯度

回顾正则化logistic回归代价函数的梯度下降法如下表示，因为不惩罚 $\theta_0$，所以分为两种情况：

![](https://gitee.com/veal98/images/raw/master/img/20200603215413.png)

令 $(h_\theta(x^{(i)})-y^{(i)}) = β_i$  同理：

<img src="https://gitee.com/veal98/images/raw/master/img/20200621141545.png" style="zoom:80%;" />

所以其中的梯度表示如下：

```python
def regularized_gradient(theta, X, y, l):
    """
    don't penalize theta_0
    args:
        l: lambda constant
    return:
        a vector of gradient
    """
    thetaReg = theta[1:]
    first = (1 / len(X)) * X.T @ (sigmoid(X @ theta) - y)
    
    # 这里人为插入一维0，使得对theta_0不惩罚，方便计算
    reg = np.concatenate([np.array([0]), (l / len(X)) * thetaReg])
    return first + reg
```

> 💡 `concatenate((a1, a2, …), axis=0)` 数组拼接函数 
>
> 参数: 
>
> - a1, a2 ……为要拼接的数组 
> - axis 为在哪个维度上进行拼接，默认为 0

### ④ 一对多分类器 One-vs-all Classification

现在我们已经定义了代价函数和梯度函数，现在是构建分类器的时候了。 对于这个任务，我们有10个可能的类，并且由于逻辑回归只能一次在 2 个类之间进行分类，我们需要多类分类的策略。 在本练习中，我们的任务是实现一对一全分类方法，其中**具有 k 个不同类的标签就有 k 个分类器，每个分类器在 “类别 i” 和 “不是 i” 之间决定**。 我们将把分类器训练包含在一个函数中，该函数计算 10 个分类器中的每个分类器的最终权重，并将权重返回为 `k * (n + 1)` 数组，其中 n 是参数数量。

这里需要注意的几点：

- 首先，我们为X添加了一列常数项 1 ，以计算截距项（常数项）。 
- 其次，我们将 y 从类标签转换为每个分类器的二进制值（要么是类 i，要么不是类 i）。 
- 最后，我们使用 `SciPy` 的较新优化API来最小化每个分类器的代价函数。 如果指定的话，API 将采用目标函数，初始参数集，优化方法和`jacobian`（渐变）函数。 然后将优化程序找到的参数分配给参数数组。

```python
from scipy.optimize import minimize

def one_vs_all(X, y, l, K):
    """generalized logistic regression
    args:
        X: feature matrix, (m, n+1) # with incercept x0=1
        y: target vector, (m, )
        l: lambda constant for regularization
        K: numbel of labels
    return: trained parameters
    """
    all_theta = np.zeros((K, X.shape[1]))  # (10, 401)
    
    for i in range(1, K+1):
        theta = np.zeros(X.shape[1])
        y_i = np.array([1 if label == i else 0 for label in y])
    
        ret = minimize(fun=regularized_cost, x0=theta, args=(X, y_i, l), method='TNC',
                        jac=regularized_gradient, options={'disp': True})
        all_theta[i-1,:] = ret.x
                         
    return all_theta
```



> 💡 `scipy.optimize.minimize`函数详解：(`minimize` 是局部最优的解法 )
>
> ```python
> scipy.optimize.minimize(fun, x0, args=(), method=None, jac=None, hess=None, hessp=None, bounds=None, constraints=(), tol=None,  callback=None, options=None)
> ```
>
> - `fun `:  求最小值的目标函数 
>
> - `x0`: 变量的初始猜测值，如果有多个变量，需要给每个变量一个初始猜测值。
>
> - `args`: 常数值，fun 中没有数字，都以变量的形式表示，对于常数项，需要在这里给值 
>
> - `method`: 求极值的方法，官方文档给了很多种。一般使用默认 
>
>   ![](https://gitee.com/veal98/images/raw/master/img/20200621143625.png)
>
> - `jac`：渐变函数
>
> - `constraints `: 约束条件，针对fun中为参数的部分进行约束限制

实现向量化代码的一个更具挑战性的部分是正确地写入所有的矩阵，保证维度正确。

```python
def predict_all(X, all_theta):
    # compute the class probability for each class on each training instance   
    h = sigmoid(X @ all_theta.T)  # 注意的这里的all_theta需要转置
    
    # create array of the index with the maximum probability
    # Returns the indices of the maximum values along an axis.
    h_argmax = np.argmax(h, axis=1)
    
    # because our array was zero-indexed we need to add one for the true label prediction
    h_argmax = h_argmax + 1
    
    return h_argmax
```

这里的`h`共5000行，10列，每行代表一个样本，每列是预测对应数字的概率。我**们取概率最大对应的`index`加 1 就是我们分类器最终预测出来的类别**。返回的`h_argmax`是一个array，包含5000个样本对应的预测值。

```python
raw_X, raw_y = load_data('ex3data1.mat')
X = np.insert(raw_X, 0, 1, axis=1) # (5000, 401)
y = raw_y.flatten()  # 这里消除了一个维度变成一维数组，方便后面的计算 or .reshape(-1) （5000，）


all_theta = one_vs_all(X, y, 1, 10)
all_theta  # 每一行是一个分类器的一组参数
```

> 💡 `numpy.ndarray.flatten` 函数：
>
> 返回一个折叠成一维的数组。但是该函数只能适用于numpy对象，即array或者mat，普通的list列表是不行的。

![](https://gitee.com/veal98/images/raw/master/img/20200621151149.png)

```python
y_pred = predict_all(X, all_theta)
accuracy = np.mean(y_pred == y)
print ('accuracy = {0}%'.format(accuracy * 100))
```

![](https://gitee.com/veal98/images/raw/master/img/20200621151214.png)

## 2. 神经网络

上面使用了多类logistic回归，然而logistic回归不能形成更复杂的假设，因为它只是一个线性分类器。

接下来我们用神经网络来尝试下，神经网络可以实现非常复杂的非线性的模型。我们将利用已经训练好了的权重进行预测。

### ① 模型表达

<img src="https://gitee.com/veal98/images/raw/master/img/20200621151250.png" style="zoom:80%;" />

输入是图片的像素值，20*20像素的图片有400个输入层单元，不包括需要额外添加的加上常数项。 材料已经提供了训练好的神经网络的参数Θ(1),Θ(2)，有25个隐层单元和10个输出单元（10个输出）

### ② 前馈神经网络和预测

你需要实现前馈神经网络预测手写数字的功能。和之前的一对多分类一样，神经网络的预测会把$(h_\theta(x))_k$中值最大的，作为预测输出

```python
def load_weight(path):
    data = loadmat(path)
    return data['Theta1'], data['Theta2']

theta1, theta2 = load_weight('ex3/ex3weights.mat')
theta1.shape, theta2.shape # ((25, 401), (10, 26))
```

插入常数项

```python
X, y = load_data('ex3/ex3data1.mat')
y = y.flatten()  # 将 y 转成一维数组，便于计算
X = np.insert(X, 0, values=np.ones(X.shape[0]), axis=1)  # 插入常数项

X.shape, y.shape # ((5000, 401), (5000,))
```

按照上面的模型表示：

```python
a1 = X
z2 = a1 @ theta1.T
z2.shape
```

```python
z2 = np.insert(z2, 0, 1, axis=1)
z2.shape # (5000, 26)
```

```python
a2 = sigmoid(z2)
a2.shape # (5000, 26)
```

```python
z3 = a2 @ theta2.T
z3.shape # (5000, 10)
```

```python
a3 = sigmoid(z3)
a3.shape # (5000, 10)
```

评估准确度：

```python
y_pred = np.argmax(a3, axis=1) + 1 
accuracy = np.mean(y_pred == y)
print ('accuracy = {0}%'.format(accuracy * 100))  # accuracy = 97.52%
```

![](https://gitee.com/veal98/images/raw/master/img/20200621152626.png)

虽然人工神经网络是非常强大的模型，但训练数据的准确性有可能无法完美预测实际数据，很容易过拟合。

---

# 📚 References

- 🤖 [吴恩达机器学习经典名课【中英字幕】](https://www.bilibili.com/video/BV164411S78V?p=2)
- 💠 [黄海广 - 斯坦福大学2014机器学习教程中文笔记](http://www.ai-start.com/ml2014/)
- 🍧 [90题细品吴恩达《机器学习》，感受被刷题支配的恐惧](https://www.kesci.com/home/project/5e0f01282823a10036b280a7)
- 🎰 [Coursera机器学习-Week 4-测验:Neural Networks: Representation](https://blog.csdn.net/f_zyj/article/details/80961867?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase)
- 🥩 [吴恩达机器学习 课后实验 python实现](https://www.kesci.com/home/project/5da16a37037db3002d441810)
- 🍦 [吴恩达机器学习与深度学习作业目录](https://blog.csdn.net/Cowry5/article/details/83302646)

- 👱‍♀️ [numpy中的concatenate函数](https://blog.csdn.net/qq_34840129/article/details/87207839)

- 🥗 [python 非线性规划（scipy.optimize.minimize）](https://blog.csdn.net/sinat_17697111/article/details/81534935?utm_source=blogxgwz2)