# 四、多变量线性回归 Linear Regression with Multiple Variables

## 1. 多维特征 Multiple Features

目前为止，我们探讨了单变量/特征的回归模型，现在我们对房价模型增加更多的特征，例如房间数、楼层等，构成一个**含有多个变量的模型**，模型中的特征为 $(x1,x2,x3...xn)$ 。

<img src="https://gitee.com/veal98/images/raw/master/img/20200529192118.png" style="zoom:67%;" />

增添更多特征后，我们引入一系列新的注释：

- n 代表特征的数量

  如上图 n = 4

- $x^{(i)}$ 代表第 i 个训练实例，即特征矩阵中的第 i 行，是一个**向量**（**vector**）

  比如上图的 $x^{(2)} = \begin{bmatrix} 1416 \\ 3 \\ 2 \\ 40 \\ 232\end{bmatrix}$

- $x^{(i)}_j$ 代表特征矩阵中第 i 行的第 j 个特征，也就是第 i 个训练实例的第 j 个特征

  比如上图的 $x^{(2)}_2$ = 3 ，$x^{(2)}_3$ = 2

支持多变量的假设 表示为：$h_θ(x) = θ_0 + θ_1x_1 + θ_2x_2 + ... + + θ_nx_n $ 

这个公式中有个参数和个变量，为了使得公式能够简化一些，**引入 x0 = 1**，则公式转化为：⭐  $h_θ(x) = θ_0x_0 + θ_1x_1 + θ_2x_2 + ... + + θ_nx_n $ 

<img src="https://gitee.com/veal98/images/raw/master/img/20200529194323.png" style="zoom: 50%;" />

➡  $x = \begin{bmatrix} x_0 \\ x_1 \\ x_2 \\ ... \\ x_n\end{bmatrix}$，$θ = \begin{bmatrix} θ_0 \\ θ_1 \\ θ_2 \\ ... \\ θ_n\end{bmatrix}$，此时模型中的参数是一个 n+1 维的向量，任何一个训练实例也都是 n+1 维的向量

🚩 $h_θ(x) = θ_0x_0 + θ_1x_1 + θ_2x_2 + ... + + θ_nx_n $  =  $\begin{bmatrix} θ_0 & θ_1 & θ_2 & ... & θ_n\end{bmatrix}$  $\begin{bmatrix} x_0 \\ x_1 \\ x_2 \\ ... \\ x_n\end{bmatrix}$ = $θ^Tx$

## 2. 多变量梯度下降 Gradient Descent for Multiple Variables

与单变量线性回归类似，在多变量线性回归中，我们也构建一个代价函数，则这个代价函数是所有建模误差的平方和，即：$J(θ_0,θ_1,...θ_n) = \frac{1}{2m}\sum_{i=1}^{m}(h_θ(x^(i)) - y^(i))^2$  ，

其中：$h_θ(x) = θ_0x_0 + θ_1x_1 + θ_2x_2 + ... + + θ_nx_n $  = $θ^Tx$ （x0 = 1）

我们的目标和单变量线性回归问题中一样，**是要找出使得代价函数最小的一系列参数**。 多变量线性回归的批量梯度下降算法为：

![](https://gitee.com/veal98/images/raw/master/img/20200529200443.png)

💬 代码示例：

$J(θ_0,θ_1,...θ_n) = \frac{1}{2m}\sum_{i=1}^{m}(h_θ(x^(i)) - y^(i))^2$  ，

其中：$h_θ(x) = θ_0x_0 + θ_1x_1 + θ_2x_2 + ... + + θ_nx_n $  = $θ^Tx$ 

**Python** 代码：

```python
def computeCost(X, y, theta):
    inner = np.power(((X * theta.T) - y), 2)
    return np.sum(inner) / (2 * len(X))
```

## 3. 梯度下降法实践1-特征缩放 Gradient Descent in Practice I - Feature Scaling

在我们面对多维特征问题的时候，我们要保证这些特征都在小范围内波动，这将帮助梯度下降算法更快地收敛。

以房价问题为例，假设我们使用两个特征，房屋的尺寸和房间的数量，尺寸的值为 0-2000平方英尺，而房间数量的值则是0-5，以两个参数分别为横纵坐标，绘制代价函数的等高线图，看出图像会显得很扁，梯度下降算法需要非常多次的迭代才能收敛。

<img src="https://gitee.com/veal98/images/raw/master/img/20200529202038.png" style="zoom:50%;" />

解决的方法是尝试**将所有特征的尺度都尽量缩放到 -1 到 +1 之间**。这样我们的梯度下降算法将会更快的收敛 converge much faster ，如图：

<img src="https://gitee.com/veal98/images/raw/master/img/20200529202339.png" style="zoom:50%;" />

🔴 **Feature Scaling**：Get every feature into approximately a -**1 ≤ xi ≤ 1** range.

接近 （-1，1）的范围，不过大或者过小，都可以认为是合理的范围

<img src="https://gitee.com/veal98/images/raw/master/img/20200529203703.png" style="zoom: 40%;" />

🔴 **Mean normalization 均值归一化**：Replace xi with xi - μi to make features have approximately zero mean (Do not apply to x0 = 1)

最简单的缩小特征值的方法就是令：$x_n = \frac{x_n - μ_n}c$，其中 $μ_n$ 是平均值，$s_n$ 是标准差

<img src="https://gitee.com/veal98/images/raw/master/img/20200529204702.png" style="zoom: 50%;" />



🚩 总结：**通过使用特征缩放这个简单的方法就可以使得梯度下降的速度变快，收敛所需的迭代次数更少**

## 4. 梯度下降法实践2-学习率 Gradient Descent in Practice II - Learning Rate

**<u>❓ How to make sure gradient descent is working correctly</u>**

梯度下降算法收敛所需要的迭代次数根据模型的不同而不同，我们不能提前预知，我们可以绘制迭代次数和代价函数的图表来观测算法在何时趋于收敛。

<img src="https://gitee.com/veal98/images/raw/master/img/20200529205530.png" style="zoom: 67%;" />

如果梯度下降是正确的话，那么每次迭代后代价函数都会减小。不同的情况代价函数趋向于收敛所需要的迭代次数也各不相同

![](https://gitee.com/veal98/images/raw/master/img/20200529211027.png)

**<u>❓ How to choose learning rate α</u>** 

梯度下降算法的每次迭代受到学习率的影响：

- 如果学习率 α 过小，则达到收敛所需的迭代次数会非常高；
- 如果学习率 α 过大，每次迭代可能不会减小代价函数，可能会越过局部最小值导致无法收敛。

通常可以考虑尝试些学习率：α = 0.01，0.03，0.1，0.3，1，3，10（每隔10倍取值）

## 5. 特征和多项式回归 Features and Polynomial Regression

多项式回归使得我们能够使用线性回归的方法来拟合非常复杂的函数，甚至是非线性函数。

💬 以房价预测问题为例，假设我们拥有两个特征：拥有的土地的宽度 frontage 以及 房子的深度 depth

$h_θ(x) = θ_0 + θ_1 * frontage + θ_2 * depth$ 

其实我们可以自己创造特征 define new features：比如 特征 area (面积) = frontage x depth，则 $h_θ(x) = θ_0 + θ_1 * area$ 

<img src="https://gitee.com/veal98/images/raw/master/img/20200529213031.png" style="zoom:50%;" />

线性回归并不适用于所有数据，有时我们需要曲线来适应我们的数据，比如一个二次方模型，其中：$h_θ(x) = θ_0x_0 + θ_1x_1 + θ_2x_2^2$  或者三次方模型： $h_θ(x) = θ_0x_0 + θ_1x_1 + θ_2x_2^2 + θ_3x_3^3$

**二次函数可能并不是最好的模型，因为二次函数曲线会下降，我们可以选择采用三次函数模型**：

<img src="https://gitee.com/veal98/images/raw/master/img/20200529213507.png" style="zoom: 50%;" />

我们可以令： $x_2 = x_2^2, x3 = x_3^3$，从而**将模型转化为线性回归模型**，如下：

<img src="https://gitee.com/veal98/images/raw/master/img/20200529213954.png" style="zoom:50%;" />

🚨 显然：**如果我们采用多项式回归模型，在运行梯度下降算法前，特征缩放非常有必要。**

<br>

特征的抉择可能有点困难，有这么多不同的特征，我们到底该决定使用什么特征，**在之后的课程中，我们会学习一些算法，它们能够自动选择要使用什么特征**，因此，我们可以让算法观察给出的数据，并自动选择，到底该选择一个二次函数，三次函数还是其他别的函数

🚩 OK，本节我们需要知道的就是我们可以自由选择使用什么特征，并且通过设计不同的特征，我们能够用更复杂的函数拟合数据，而不是只用一条直线去拟合

## 6. 正规方程 Normal Equation (区别于迭代方法的直接解法)

到目前为止，我们都在使用梯度下降算法（经过很多次迭代来收敛到全局最小值），但是对于某些线性回归问题，正规方程方法是更好的解决方案。

🔴 **Normal equation**：Method to solve fro θ analytically **一次性求出参数 θ 的最优值**

💬 举个例子来解释一下：

假设我们有一个代价函数 $J(θ) = aθ^2 + bθ + c，θ ∈ R$

<img src="https://gitee.com/veal98/images/raw/master/img/20200529215700.png" style="zoom:50%;" />

当 θ 为实数 real number的时候，我们<u>获取该二次函数的最小值（最小化该函数）</u>的方法就是对其进行求导并将导数置零，求得 θ 的值并带入 J(θ) 即可求得 J(θ) 的最小值

如果 θ 不是实数，而是一个 n+1 维的参数向量，而代价函数是 $J(θ_0,θ_1,...θ_n) = \frac{1}{2m}\sum_{i=1}^{m}(h_θ(x^(i)) - y^(i))^2$  ，我们最小化这个代价函数 J 的方法就是**逐个对参数 $θ_i$ 求 J 的偏导数，并将它们全部置零**。显然，这是非常麻烦的。  

🔵 运用**正规方程方法 $θ = (X^TX)^{-1}X^Ty$** 求解参数 θ 举例如下：

<img src="https://gitee.com/veal98/images/raw/master/img/20200529220642.png" style="zoom: 50%;" />

> 注：对于那些**不可逆的矩阵**（通常是因为特征之间不独立，如同时包含英尺为单位的尺寸和米为单位的尺寸两个特征，也有可能是特征数量大于训练集的数量），**正规方程方法是不能用的**。



在 **Octave** 中，正规方程写作：

```
pinv(X'*X)*X'*y
```

正规方程的**python**实现：

```python
import numpy as np

def normalEqn(X, y):
    #X.T@X等价于X.T.dot(X)
    theta = np.linalg.inv(X.T@X)@X.T@y 
    return theta
```



🚨 **如果你采用正规方程，那么就不需要特征缩放**

⭐ 梯度下降与正规方程的比较：

| 梯度下降                   | 正规方程                                                     |
| :------------------------- | :----------------------------------------------------------- |
| 需要选择学习率 α           | 不需要                                                       |
| 需要多次迭代               | 一次运算得出                                                 |
| 当特征数量大时也能较好适用 | 需要计算，如果特征数量n较大则运算代价大，因为矩阵逆的计算时间复杂度为，通常来说当小于10000 时还是可以接受的 |
| 适用于各种类型的模型       | 只适用于线性模型，不适合逻辑回归模型等其他模型               |

👍 总结一下，**只要特征变量的数目并不大，正规方程是一个很好的计算参数的替代方法**。具体地说，只要特征变量数量小于一万，我通常使用正规方程法，而不使用梯度下降法。

随着我们要讲的学习算法越来越复杂，例如，当我们讲到分类算法，像逻辑回归算法，我们会看到，实际上对于那些算法，并不能使用标准方程法。对于那些更复杂的学习算法，我们将不得不仍然使用梯度下降法。因此，梯度下降法是一个非常有用的算法，可以用在有大量特征变量的线性回归问题。或者我们以后在课程中，会讲到的一些其他的算法，因为正规方程法不适合或者不能用在它们上。但对于这个特定的线性回归模型，正规方程法是一个比梯度下降法更快的替代算法。所以，根据具体的问题，以及你的特征变量的数量，这两种算法都是值得学习的。



---



# 📚 References

- 🤖 [吴恩达机器学习经典名课【中英字幕】](https://www.bilibili.com/video/BV164411S78V?p=2)

- 💠 [黄海广 - 斯坦福大学2014机器学习教程中文笔记](http://www.ai-start.com/ml2014/)

- 🍧 [90题细品吴恩达《机器学习》，感受被刷题支配的恐惧](https://www.kesci.com/home/project/5e0f01282823a10036b280a7)