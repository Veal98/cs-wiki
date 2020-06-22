# 🎳 神经网络：反向传播算法 Neural Networks

## 1. 代价函数 Cost Function 

首先引入一些便于稍后讨论的新标记方法：

假设神经网络的训练样本有 m 个，每个包含一组输入 x 和一组输出信号 y ，**L 表示神经网络层数，$S_l$ 表示每层的神经元个数（比如 $S_1$ 表示第一层神经元的个数），$S_L$代表最后一层（输出层）中处理单元的个数。**

将神经网络的分类定义为两种情况：二类分类和多类分类：

- 二类分类：$S_L = 1$ 

- K 类分类：$S_L = K (K ≥ 3)$ 

<img src="https://gitee.com/veal98/images/raw/master/img/20200605204514.png" style="zoom:50%;" />

我们回顾逻辑回归问题中我们的代价函数为：

<img src="https://gitee.com/veal98/images/raw/master/img/20200605205040.png"  />

在逻辑回归中，我们只有一个输出变量，又称标量（**scalar**），也只有一个因变量 y ，但是在神经网络中，我们可以有很多输出变量，我们的 $h_θ(x)$ 是一个维度为 K 的向量，并且我们训练集中的因变量也是同样维度的一个向量，因此我们的代价函数会比逻辑回归更加复杂一些，为：

⭐ <img src="https://gitee.com/veal98/images/raw/master/img/20200605205228.png"  />

这个看起来复杂很多的代价函数背后的思想还是一样的，我们希望通过代价函数来观察算法预测的结果与真实情况的误差有多大，唯一不同的是，对于每一行特征，我们都会给出 K 个预测。🚩 **我们可以利用循环，对每一行特征都预测 K 个不同结果，然后在利用循环在 K 个预测中选择可能性最高的一个，将其与 y 中的实际数据进行比较。**

## 2. 反向传播算法 Backpropagation Algorithm

🔴 接下来我们学习一种**让代价函数最小化的算法：反向传播算法**

之前我们在计算神经网络预测结果的时候我们采用了一种<u>前向传播方法，我们从第一层开始正向一层一层进行计算，直到最后一层的 $h_θ(x)$。</u>

现在，为了计算代价函数的偏导数 <img src="https://gitee.com/veal98/images/raw/master/img/20200605210016.png"  />，我们需要采用一种反向传播算法，也就是 🔴 **首先计算最后一层的误差，然后再一层一层反向求出各层的误差，直到倒数第二层**。 以一个例子来说明反向传播算法：

**假设我们的训练集只有一个样本 （x , y）**，我们的神经网络是一个四层的神经网络，其中 K = 4，$S_L = 4$，L = 4：

- **前向传播算法**：

  <img src="https://gitee.com/veal98/images/raw/master/img/20200605210157.png" style="zoom:50%;" />

- **反向传播算法**：

  我们从最后一层的误差开始计算，误差是激活单元的预测（$a^{(4)}$）与实际值（$y^k$）之间的误差 x。 我们用 `δ` 来表示误差，则： <img src="https://gitee.com/veal98/images/raw/master/img/20200605212154.png"  /> 

  我们利用这个误差值来计算前一层的误差：<img src="https://gitee.com/veal98/images/raw/master/img/20200605212213.png"  />  其中<img src="https://gitee.com/veal98/images/raw/master/img/20200605212308.png"  /> 是 Sigmod 函数的导数，<img src="https://gitee.com/veal98/images/raw/master/img/20200605212329.png"  />。而 <img src="https://gitee.com/veal98/images/raw/master/img/20200605212346.png"  /> 则是权重导致的误差的和。

  下一步是继续计算第二层的误差： <img src="C:\Users\19124\AppData\Roaming\Typora\typora-user-images\image-20200605212407324.png" alt="image-20200605212407324"  />

  因为第一层是输入变量，不存在误差。我们有了所有的误差的表达式后，便可以计算代价函数的偏导数了，假设，即我们不做任何正则化处理时有：

   ![](https://gitee.com/veal98/images/raw/master/img/20200605212428.png)

  重要的是清楚地知道上面式子中上下标的含义：

  - `l` 代表目前所计算的是第几层。

  - `j` 代表目前计算层中的激活单元的下标，也将是下一层的第 `j` 个输入变量的下标。

  - `i` 代表下一层中误差单元的下标，是受到权重矩阵中第 `i` 行影响的下一层中的误差单元的下标。

在上面的特殊情况中（只有一个训练集），我们需要计算每一层的误差单元来计算代价函数的偏导数。现在 🚩 **我们将其推广到具有 m 个训练集的情况**：我们同样需要计算每一层的误差单元，但是我们需要为整个训练集计算误差单元，此时的误差单元也是一个矩阵，我们用 $△_{ij}^{(l)}$ 来表示这个误差矩阵。第 `l` 层的第 `i `个激活单元受到第 `j `个参数影响而导致的误差。

我们的算法表示为：

<img src="https://gitee.com/veal98/images/raw/master/img/20200605213248.png" style="zoom:50%;" />

⭐ 即**首先用正向传播方法计算出每一层的激活单元，利用训练集的结果与神经网络预测的结果求出最后一层的误差，然后利用该误差运用反向传播法计算出直至第二层的所有误差。**

在求出了 $△_{ij}^{(l)}$ 之后，我们便可以计算 ⭐ **代价函数的偏导数**了，计算方法如下：

<img src="https://gitee.com/veal98/images/raw/master/img/20200605213406.png"  />



## 3. BP算法的直观理解 Backpropagation Intuition

为了更好地理解反向传播算法，我们再来仔细研究一下前向传播的原理：

前向传播算法：

<img src="https://gitee.com/veal98/images/raw/master/img/20200606144914.png" style="zoom:50%;" />

反向传播算法：

<img src="https://gitee.com/veal98/images/raw/master/img/20200606145652.png" style="zoom:50%;" />



## 4. BP算法的实现细节：展开参数 Implementation Note_ Unrolling Parameters

在上一段视频中，我们谈到了怎样使用反向传播算法计算代价函数的导数。在这段视频中，我想快速地向你介绍一个细节的实现过程，**怎样把你的参数从矩阵展开成向量**，以便我们在高级最优化步骤中的使用需要。

![](https://gitee.com/veal98/images/raw/master/img/20200606150641.png)

![](https://gitee.com/veal98/images/raw/master/img/20200606150656.png)

![](https://gitee.com/veal98/images/raw/master/img/20200606150707.png)

## 5. 梯度检验 Gradient Checking

当我们对一个较为复杂的模型（例如神经网络）使用梯度下降算法时，可能会存在一些不容易察觉的错误，意味着，**虽然代价看上去在不断减小，但最终的结果可能并不是最优解**。（<u>大部分原因都是 BP 算法自身的 Bug</u>）

为了避免这样的问题，我们采取一种叫做梯度的数值检验（**Numerical Gradient Checking**）方法。这种方法的思想是**通过估计梯度值来检验我们计算的导数值是否真的是我们要求的**。

对梯度的估计采用的方法是在代价函数上沿着切线的方向选择离两个非常近的点然后计算两个点的平均值用以估计梯度。即对于某个特定的 θ，我们计算出在 θ-ε 处和 θ+ε  的代价值（ε 是一个非常小的值，通常选取 0.0001），然后求两个代价的平均，用以估计在 θ 处的代价值。

<img src="https://gitee.com/veal98/images/raw/master/img/20200606151736.png" style="zoom:50%;" />

当是一个向量时，我们则需要对偏导数进行检验。因为代价函数的偏导数检验只针对一个参数的改变进行检验：

<img src="https://gitee.com/veal98/images/raw/master/img/20200606152115.png" style="zoom:50%;" />



🚨  **在运行你的代码进行学习或者说训练网络之前，务必关掉梯度检验**。因为梯度检验的代码是一个计算量非常大的，也是非常慢的计算导数的程序。而 BP 算法是一个高性能的计算导数的方法，一旦你通过梯度校验证明反向传播的实现是正确的，就应该关掉梯度校验。

## 6. 随机初始化 Random Initialization

任何优化算法都需要一些初始的参数。到目前为止我们都是初始所有参数为0，这样的初始方法对于逻辑回归来说是可行的，但是对于神经网络来说是不可行的。**如果我们令所有的初始参数都为 0，这将意味着我们第二层的所有激活单元都会有相同的值。同理，如果我们初始所有的参数都为同一个非 0 的数，结果也是一样的。**

🚩 我们通常初始参数为正负 ε （这里的 ε 和梯度校验的 ε 没有任何关系 ）之间的随机值，假设我们要随机初始一个尺寸为 10×11 的参数矩阵，代码如下：

<img src="https://gitee.com/veal98/images/raw/master/img/20200606153226.png" style="zoom: 50%;" />

## 7. 小结 Putting It Together

总结一下使用神经网络时的步骤：

- **第一件要做的事是选择网络结构**，即决定选择多少层以及决定每层分别有多少个单元。

  <img src="https://gitee.com/veal98/images/raw/master/img/20200606153649.png" style="zoom:50%;" />

  第一层的单元数即我们训练集的特征数量。

  最后一层的单元数是我们训练集的结果的类的数量。

  如果隐藏层数大于1，确保每个隐藏层的单元个数相同，通常情况下隐藏层单元的个数越多越好。

- 接下来就是**训练神经网络**：

  - 参数的随机初始化

  - 利用正向传播方法计算所有的 $h_θ(x)$

  - 编写计算代价函数 J 的代码

  - 利用反向传播方法计算所有偏导数

  - 利用梯度检验方法检验这些偏导数

  - 使用优化算法（比如梯度下降算法或者更高级的优化方法）来最小化代价函数
  
    🚨 神经网络中的代价函数是非凸函数，也就是说梯度下降算法或者其他更高级的优化方法得到的都有可能只是局部最小值，<u>但这不是个大问题</u>，因为这些算法在一般情况下都能得到一个比较小的局部最小值，尽管它可能不是全局最小值

## ✍ Quiz

### ① 第 1 题

您正在训练一个三层神经网络，希望使用反向传播来计算代价函数的梯度。 在反向传播算法中，其中一个步骤是更新 $\Delta^{(2)}_{ij} := \Delta^{(2)}_{ij} +  \delta^{(3)}_i * (a^{(2)})_j$ 对于每个i，j，下面哪一个是这个步骤的正确矢量化？

- $\Delta^{(2)} := \Delta^{(2)} +  (a^{(2)})^T * \delta^{(3)}$

- $\Delta^{(2)} := \Delta^{(2)} + (a^{(3)})^T * \delta^{(2)}$

- ✅ $\Delta^{(2)} := \Delta^{(2)} +  \delta^{(3)} * (a^{(2)})^T$

- $\Delta^{(2)} := \Delta^{(2)} +  \delta^{(3)} * (a^{(3)})^T$

### ② 第 2 题

假设`Theta1`是一个 5x3 矩阵，`Theta2`是一个 4x6 矩阵。令`thetaVec=[Theta1(;);Theta2(:)]`。下列哪一项可以正确地还原`Theta2`？

- ✅ `reshape(thetaVec(16:39),4,6)` 

  5x3 + 4x6 = 39

- `reshape(thetaVec(15:38),4,6)` 

- `reshape(thetaVec(16:24),4,6)` 

-  `reshape(thetaVec(15:39),4,6)` 

-   `reshape(thetaVec(16:39),6,4)`

### ③ 第 3 题

<img src="https://gitee.com/veal98/images/raw/master/img/20200606161058.png"  />

- 8 
-  6 
-  5.9998 
- ✅ 6.0002

### ④ 第 4 题

以下哪项陈述是正确的？选择所有正确项

- 使用较大的 λ 值不会影响神经网络的性能；我们不将 λ 设置为太大的唯一原因是避免数值问题

- 如果我们使用梯度下降作为优化算法，梯度检查是有用的。然而，如果我们使用一种先进的优化方法（例如在fminunc中），它没有多大用处

- ✅ 使用梯度检查可以帮助验证反向传播的实现是否没有 bug

- ✅ 如果我们的神经网络过拟合训练集，一个合理的步骤是增加正则化参数 λ

### ⑤ 第 5 题

以下哪项陈述是正确的？选择所有正确项

- 假设参数$Θ^{(1)}$是一个方矩阵（即行数等于列数）。如果我们用它的转置代${Θ^{(1)}}^T$替$Θ^{(1)}$，那么我们并没有改变网络正在计算的功能。
- ✅ 假设我们有一个正确的反向传播实现，并且正在使用梯度下降训练一个神经网络。假设我们将 J(Θ) 绘制为迭代次数的函数，并且发现它是递增的而不是递减的。一个可能的原因是学习率 α 太大。
- 假设我们使用学习率为 α 的梯度下降。对于逻辑回归和线性回归，J(Θ) 是一个凸优化问题，因此我们不想选择过大的学习率 α。 然而，对于神经网络，J(Θ)可能不是凸的，因此选择一个非常大的 α 值只能加快收敛速度。
- ✅ 如果我们使用梯度下降训练一个神经网络，一个合理的调试步骤是将 J(Θ) 绘制为迭代次数的函数，并确保每次迭代后它是递减的（或至少是不递增的）。

---

# 💻  编程作业  - 反向传播神经网络

## 1. 神经网络

在这个练习中，你将实现**反向传播算法来学习神经网络的参数**。依旧是上次预测手写数数字的例子。

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.io import loadmat
```

### ① 可视化数据

这部分我们随机选取100个样本并可视化。训练集共有5000个训练样本，每个样本是20*20像素的数字的灰度图像。每个像素代表一个浮点数，表示该位置的灰度强度。20×20的像素网格被展开成一个400维的向量。在我们的数据矩阵X中，每一个样本都变成了一行，这给了我们一个 5000×400 矩阵X，每一行都是一个手写数字图像的训练样本。

```python
def load_mat(path):
    # 读取数据
    data = loadmat(path)
    X = data['X']
    y = data['y'].flatten()
    return X,y
```

```python
def plot_100_images(X):
    """随机画100个数字"""
    index = np.random.choice(range(5000), 100)
    images = X[index]
    fig, ax_array = plt.subplots(10, 10, sharey=True, sharex=True, figsize=(8, 8))
    for r in range(10):
        for c in range(10):
            ax_array[r, c].matshow(images[r*10 + c].reshape(20,20), cmap='gray_r')
    plt.xticks([])
    plt.yticks([])
    plt.show()
```

```python
X,y = load_mat('ex4/ex4data1.mat')
plot_100_images(X)
```

![](https://gitee.com/veal98/images/raw/master/img/20200622144244.png)

### ② 模型展示

我们的网络有三层，输入层，隐藏层，输出层。我们的输入是数字图像的像素值，因为每个数字的图像大小为20*20，所以我们输入层有400个单元（这里不包括总是输出要加一个偏置单元）。

![](https://gitee.com/veal98/images/raw/master/img/20200622144522.png)

#### Ⅰ 读取数据

首先我们要**将标签值（1，2，3，4，…，10）转化成非线性相关的向量**，向量对应位置（`y[i-1]`）上的值等于1，例如 `y[0]=6` 转化为 `y[0]=[0,0,0,0,0,1,0,0,0,0]`。

```python
def expand_y(y):
    result = []
    
    for i in y:
        y_array = np.zeros(10)
        y_array[i-1] = 1
        result.append(y_array)
        
    return np.array(result)
```

获取训练数据集，以及对训练集做相应的处理，得到我们的 input X，lables y：

```python
raw_X, raw_y = load_mat('ex4/ex4data1.mat')
X = np.insert(raw_X, 0, 1, axis = 1) # 插入偏置项 1
y = expand_y(raw_y) # 将标签值转换成向量
X.shape,y.shape # ((5000, 401), (5000, 10))
```

#### Ⅱ 读取权重

`ex4weights.mat` 文件中已经提供了训练好的参数 θ1 和 θ2。这些参数的维度由神经网络的大小决定，第二层有 25 个单元，输出层有 10 个单元(对应10个数字类/标签)。

```python
def load_weight(path):
    data = loadmat(path)
    return data['Theta1'],data['Theta2']
```

```python
t1,t2 = load_weight('ex4/ex4weights.mat')
t1.shape,t2.shape # ((25, 401), (10, 26))
```

#### Ⅲ 展开参数

当我们使用高级优化方法来优化神经网络时，我们需要**将多个参数矩阵展开成向量**，才能传入优化函数，然后再恢复形状。

```python
def serialize(a,b):
    # 展开参数
    return np.r_[a.flatten(),b.flatten()]

theta = serialize(t1,t2) # 扁平化参数，25*401+10*26=10285
theta.shape # (10285,)
```

```python
def deserialize(seq):
    '''提取参数'''
    return seq[:25*401].reshape(25, 401), seq[25*401:].reshape(10, 26)
```

> 💡 `numpy.r_`：按列连接两个矩阵。就是把两矩阵上下相加，要求列数相等。
>
> `np.c_`：按行连接两个矩阵。就是把两矩阵左右相加，要求行数相等。
>
> 举例如下：
>
> ```python
> a = np.array([[1, 2, 3],[7,8,9]])
>  
> b=np.array([[4,5,6],[1,2,3]])
>  
> a
> Out[4]: 
> array([[1, 2, 3],
>        [7, 8, 9]])
>  
> b
> Out[5]: 
> array([[4, 5, 6],
>        [1, 2, 3]])
>  
> c=np.c_[a,b]
>  
> c
> Out[7]: 
> array([[1, 2, 3, 4, 5, 6],
>        [7, 8, 9, 1, 2, 3]])
>  
>  
>  
> d= np.array([7,8,9])
>  
> e=np.array([1, 2, 3])
>  
> f=np.c_[d,e]
>  
> f
> Out[12]: 
> array([[7, 1],
>        [8, 2],
>        [9, 3]])
> ```

### ③ 前馈和代价函数 Feedforward and cost function

#### Ⅰ 前馈

确保每层的单元数，注意输出时加一个偏置单元，s(1)=400+1，s(2)=25+1，s(3)=10。

![](https://gitee.com/veal98/images/raw/master/img/20200622150846.png)

```python
def sigmoid(z):
    return 1 / (1 + np.exp(-z))
```

```python
def feed_forward(theta,X,):
    '''得到每层的输入和输出'''
    t1, t2 = deserialize(theta)
    # 前面已经插入过偏置单元，这里就不用插入了
    a1 = X
    z2 = a1 @ t1.T
    a2 = np.insert(sigmoid(z2),0,1,axis = 1)
    z3 = a2 @ t2.T
    a3 = sigmoid(z3)
    
    return a1,z2,a2,z3,a3
```

```python
a1, z2, a2, z3, h = feed_forward(theta, X)
```

![](https://gitee.com/veal98/images/raw/master/img/20200622151351.png)

#### Ⅱ 代价函数

回顾下神经网络的代价函数（不带正则化项）

![](https://gitee.com/veal98/images/raw/master/img/20200622151435.png)

输出层输出的是对样本的预测，包含5000个数据，每个数据对应了一个包含10个元素的向量，代表了结果有10类。在公式中，每个元素与log项对应相乘。

最后我们使用提供训练好的参数θ，算出的cost应该为0.287629

```python
def cost(theta, X, y):
    a1, z2, a2, z3, h = feed_forward(theta, X)
    J = 0
    for i in range(len(X)):
        first = -y[i] * np.log(h[i])
        second = (1 - y[i]) * np.log(1 - h[i])
        J = J + np.sum(first - second)
    J = J / len(X)
    return J
```

![](https://gitee.com/veal98/images/raw/master/img/20200622151942.png)

### ④ 正则化代价函数

![](https://gitee.com/veal98/images/raw/master/img/20200622152204.png)



**注意不要将每层的偏置项正则化。**

```python
def regularized_cost(theta, X, y, l = 1):
    '''正则化时忽略每层的偏置项，也就是参数矩阵的第一列'''
    t1,t2 = deserialize(theta)
    reg = np.sum(t1[:,1:] ** 2) + np.sum(t2[:,1:] ** 2)
    return 1 / (2 * len(X)) * reg + cost(theta, X, y)
```

![](https://gitee.com/veal98/images/raw/master/img/20200622152749.png)

## 2. 反向传播算法

### ① sigmoid 梯度

你需要实现sigmoid函数的梯度（导数），公式如下：

![](https://gitee.com/veal98/images/raw/master/img/20200622153858.png)

```python
def sigmoid_gradient(z):
    return sigmoid(z) * (1 - sigmoid(z))
```

### ② 随机初始化 Random initialization

当我们训练神经网络时，随机初始化参数是很重要的，可以打破数据的对称性。一个有效的策略是在均匀分布**(−e，e)**中随机选择值，我们可以选择 **e = 0.12** 这个范围的值来确保参数足够小，使得训练更有效率。

```python
def random_init(size):
    '''从服从的均匀分布的范围中随机返回size大小的值'''
    return np.random.uniform(-0.12,0.12, size)
```

### ③ 反向传播 Backpropagation

![](https://gitee.com/veal98/images/raw/master/img/20200622155034.png)

![](https://gitee.com/veal98/images/raw/master/img/20200622154115.png)

目标：获取整个网络代价函数的梯度。以便在优化算法中求解。

首先明确各个参数的维度：

```python
print('a1', a1.shape,'t1', t1.shape)
print('z2', z2.shape)
print('a2', a2.shape, 't2', t2.shape)
print('z3', z3.shape)
print('a3', h.shape)
```

![](https://gitee.com/veal98/images/raw/master/img/20200622154316.png)

```python
def gradient(theta, X, y):
    t1,t2 = deserialize(theta)
    a1, z2, a2, z3, h = feed_forward(theta, X)
    d3 = h - y # 实际输出和预计输出的误差
    d2 = d3 @ t2[:,1:] * sigmoid_gradient(z2)
    D2 = d3.T @ a2
    D1 = d2.T @ a1
    D = (1 / len(X)) * serialize(D1,D2)
    
    return D
```

### ④ 梯度校验

![](https://gitee.com/veal98/images/raw/master/img/20200622155301.png)

<img src="https://gitee.com/veal98/images/raw/master/img/20200622155723.png" style="zoom:80%;" />

如果你的反向传播计算正确，那你得出的这个数字应该**小于10e-9**

```python
def gradient_checking(theta, X, y, e):
    def a_numeric_grad(plus, minus):
        """
        对每个参数theta_i计算数值梯度，即理论梯度。
        """
        return (regularized_cost(plus, X, y) - regularized_cost(minus, X, y)) / (e * 2)
   
    numeric_grad = [] 
    for i in range(len(theta)):
        plus = theta.copy()  # deep copy otherwise you will change the raw theta
        minus = theta.copy()
        plus[i] = plus[i] + e
        minus[i] = minus[i] - e
        grad_i = a_numeric_grad(plus, minus)
        numeric_grad.append(grad_i)
    
    numeric_grad = np.array(numeric_grad)
    analytic_grad = regularized_gradient(theta, X, y)
    diff = np.linalg.norm(numeric_grad - analytic_grad) / np.linalg.norm(numeric_grad + analytic_grad)
 
gradient_checking(theta, X, y, epsilon= 0.0001) # 这个运行很慢，谨慎运行
```

### ⑤ 正则化神经网络

梯度下降中加入正则项：

<img src="https://gitee.com/veal98/images/raw/master/img/20200622160921.png" style="zoom:80%;" />

其中：$△_{ij}^{(l)}$ 表示误差矩阵

```python
def regularized_gradient(theta,X, y, l = 1):
    """不惩罚偏置单元的参数"""
    a1, z2, a2, z3, h = feed_forward(theta, X)
    D1,D2 = deserialize(gradient(theta,X,y)) # D1,D2 表示非正则化计算出来的梯度
    t1,t2 = deserialize(theta)
    t1[:,0] = 0
    t2[:,0] = 0
    reg_D1 = D1 + (l / len(X)) * t1
    reg_D2 = D2 + (l / len(X)) * t2
    
    return serialize(reg_D1,reg_D2)
```

### ⑥ 使用工具库计算参数最优解

```python
import scipy.optimize as opt
from scipy.optimize import minimize

def nn_training(X, y):
    init_theta = random_init(10285)  # 25*401 + 10*26

    res = opt.minimize(fun=regularized_cost,
                       x0=init_theta,
                       args=(X, y, 1),
                       method='TNC',
                       jac=regularized_gradient,
                       options={'maxiter': 400})
    return res
```

```python
res = nn_training(X, y)
res
```

> 训练误差已经够低了，不明白为啥还是False 😒

![](https://gitee.com/veal98/images/raw/master/img/20200622164638.png)

最后，我们可以计算准确度，看看我们训练完毕的神经网络效果怎么样。

```python
# 预测值与实际值比较
from sklearn.metrics import classification_report #这个包是评价报告

def accuracy(theta, X, y):
    a1, z2, a2, z3, h = feed_forward(res.x, X)
    y_pred = np.argmax(h, axis=1) + 1
    print(classification_report(y, y_pred))
```

![](https://gitee.com/veal98/images/raw/master/img/20200622161939.png)

### ⑦ 可视化隐藏层

理解神经网络是如何学习的一个很好的办法是，可视化隐藏层单元所捕获的内容。通俗的说，对于一个隐藏层单元，可视化它所计算的内容的方法是：找到一个输入x，x可以激活这个单元（也就是说有一个激活值 $a^{(l)}_i$ 接近与1）。对于我们所训练的网络，注意到 θ1 中每一行都是一个 401 维的向量，代表每个隐藏层单元的参数。<u>如果我们忽略偏置项，我们就能得到400维的向量，这个向量代表每个样本输入到每个隐层单元的像素的权重。**因此可视化的一个方法是，reshape 这个400维的向量为（20，20）的图像然后输出**。</u>

```python
def plot_hidden(theta):
    t1, t2 = deserialize(theta)
    t1 = t1[:, 1:] # 忽略偏置项
    fig,ax_array = plt.subplots(5, 5, sharex=True, sharey=True, figsize=(6,6))
    for r in range(5):
        for c in range(5):
            ax_array[r, c].matshow(t1[r * 5 + c].reshape(20, 20), cmap='gray_r')
            plt.xticks([])
            plt.yticks([])
    plt.show()
```

![](https://gitee.com/veal98/images/raw/master/img/20200622162306.png)

---

# 📚 References

- 🤖 [吴恩达机器学习经典名课【中英字幕】](https://www.bilibili.com/video/BV164411S78V?p=2)
- 💠 [黄海广 - 斯坦福大学2014机器学习教程中文笔记](http://www.ai-start.com/ml2014/)
- 🍧 [90题细品吴恩达《机器学习》，感受被刷题支配的恐惧](https://www.kesci.com/home/project/5e0f01282823a10036b280a7)
- 🥩 [吴恩达机器学习 课后实验 python实现](https://www.kesci.com/home/project/5da16a37037db3002d441810)
- 🍦 [吴恩达机器学习与深度学习作业目录](https://blog.csdn.net/Cowry5/article/details/83302646)

- 🚧 [np.c_和 np.r_ 的用法解析](https://blog.csdn.net/weixin_41797117/article/details/80048688)