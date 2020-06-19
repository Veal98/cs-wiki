# 🍟 四、多变量线性回归 Linear Regression with Multiple Variables

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

<u>支持多变量的假设 表示为：$h_θ(x) = θ_0 + θ_1x_1 + θ_2x_2 + ... + + θ_nx_n $</u> 

这个公式中有个参数和个变量，为了使得公式能够简化一些，**引入 x0 = 1**，则公式转化为：

⭐  $h_θ(x) = θ_0x_0 + θ_1x_1 + θ_2x_2 + ... + + θ_nx_n $ 

<img src="https://gitee.com/veal98/images/raw/master/img/20200529194323.png" style="zoom: 50%;" />

➡  $x = \begin{bmatrix} x_0 \\ x_1 \\ x_2 \\ ... \\ x_n\end{bmatrix}$，$θ = \begin{bmatrix} θ_0 \\ θ_1 \\ θ_2 \\ ... \\ θ_n\end{bmatrix}$，此时模型中的参数是一个 n+1 维的向量，任何一个训练实例也都是 n+1 维的向量

⭐ $h_θ(x) = θ_0x_0 + θ_1x_1 + θ_2x_2 + ... + + θ_nx_n $  =  $\begin{bmatrix} θ_0 & θ_1 & θ_2 & ... & θ_n\end{bmatrix}$  $\begin{bmatrix} x_0 \\ x_1 \\ x_2 \\ ... \\ x_n\end{bmatrix}$ = $θ^Tx$

## 2. 多变量梯度下降 Gradient Descent for Multiple Variables

与单变量线性回归类似，在多变量线性回归中，我们也构建一个**代价函数**，则这个代价函数是所有建模误差的平方和，即：$J(θ_0,θ_1,...θ_n) = \frac{1}{2m}\sum_{i=1}^{m}(h_θ(x^{(i)}) - y^{(i)})^2$  ，

其中：$h_θ(x) = θ_0x_0 + θ_1x_1 + θ_2x_2 + ... + + θ_nx_n $  = $θ^Tx$ （x0 = 1）

我们的目标和单变量线性回归问题中一样，**是要找出使得代价函数最小的一系列参数**。 多变量线性回归的批量梯度下降算法为：

![](https://gitee.com/veal98/images/raw/master/img/20200529200443.png)

💬 代码示例：

$J(θ_0,θ_1,...θ_n) = \frac{1}{2m}\sum_{i=1}^{m}(h_θ(x^{(i)}) - y^{(i)})^2$    ，

其中：$h_θ(x) = θ_0x_0 + θ_1x_1 + θ_2x_2 + ... + + θ_nx_n $  = $θ^Tx$ 

**Python** 代码：

```python
def computeCost(X, y, theta):
    inner = np.power(((X * theta.T) - y), 2)
    return np.sum(inner) / (2 * len(X))
```

## 3. 梯度下降法实践1-特征缩放 Gradient Descent in Practice I - Feature Scaling

**在我们面对多维特征问题的时候，我们要保证这些特征都在<u>小范围内波动</u>，这将帮助梯度下降算法更快地收敛。**

以房价问题为例，假设我们使用两个特征，房屋的尺寸和房间的数量，尺寸的值为 0-2000平方英尺，而房间数量的值则是0-5，以两个参数分别为横纵坐标，绘制代价函数的等高线图，看出图像会显得很扁，梯度下降算法需要非常多次的迭代才能收敛。

<img src="https://gitee.com/veal98/images/raw/master/img/20200529202038.png" style="zoom:50%;" />

解决的方法是尝试**将所有特征的尺度都尽量缩放到 -1 到 +1 之间**。这样我们的梯度下降算法将会更快的收敛 converge much faster ，如图：

<img src="https://gitee.com/veal98/images/raw/master/img/20200529202339.png" style="zoom:50%;" />

🔴 **Feature Scaling**：Get every feature into approximately a -**1 ≤ xi ≤ 1** range.

接近 （-1，1）的范围，不过大或者过小，都可以认为是合理的范围

<img src="https://gitee.com/veal98/images/raw/master/img/20200529203703.png" style="zoom: 40%;" />

⭐ **Mean normalization 均值归一化**：Replace xi with xi - μi to make features have approximately zero mean (Do not apply to x0 = 1)

**最简单的缩小特征值的方法就是均值归一化：令 $x_n = \frac{x_n - μ_n}c$，其中 $μ_n$ 是平均值，$s_n$ 是标准差**

<img src="https://gitee.com/veal98/images/raw/master/img/20200529204702.png" style="zoom: 50%;" />



🚩 总结：**通过使用特征缩放这个简单的方法就可以使得梯度下降的速度变快，收敛所需的迭代次数更少**

## 4. 梯度下降法实践2-学习率 Gradient Descent in Practice II - Learning Rate

**<u>❓ How to make sure gradient descent is working correctly</u>**

梯度下降算法收敛所需要的迭代次数根据模型的不同而不同，我们不能提前预知，我们可以绘制迭代次数和代价函数的图表来观测算法在何时趋于收敛。

<img src="https://gitee.com/veal98/images/raw/master/img/20200529205530.png" style="zoom: 67%;" />

**如果梯度下降是正确的话，那么每次迭代后代价函数都会减小**。不同的情况代价函数趋向于收敛所需要的迭代次数也各不相同

![](https://gitee.com/veal98/images/raw/master/img/20200529211027.png)

**<u>❓ How to choose learning rate α</u>** 

梯度下降算法的每次迭代受到学习率的影响：

- 如果学习率 α 过小，则达到收敛所需的迭代次数会非常高；
- 如果学习率 α 过大，每次迭代可能不会减小代价函数，可能会越过局部最小值导致无法收敛。

通常可以考虑尝试些学习率：α = 0.01，0.03，0.1，0.3，1，3，10（每隔10倍取值）

## 5. 特征和多项式回归 Features and Polynomial Regression

<u>**多项式回归**使得我们能够使用线性回归的方法来拟合非常复杂的函数，甚至是非线性函数</u>。

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

💡 <u>到目前为止，我们都在使用梯度下降算法（经过很多次迭代来收敛到全局最小值），但是对于某些线性回归问题，正规方程方法是更好的解决方案。</u>

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
    # X.T@X等价于X.T.dot(X)
    theta = np.linalg.inv(X.T@X)@X.T@y  # nplinalg.inv 求逆
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

## ⭐ 小结

> 回顾一下单变量线性回归的知识点：
>
> - **假设函数 **：预测 y 关于 x 的直线 - $h_θ(x) = θ_0 + θ_1*x$
>
> - **代价函数**：当代价函数取得最小值时（取决于 θ），假设函数将最佳拟合数据集 - $J(θ_0,θ_1) = \frac{1}{2m}\sum_{i=1}^{m}(h_θ(x^{(i)}) - y^{(i)})^2$
>
> - **（批量）梯度下降**：使用梯度下降算法来求出代价函数 $J(θ_0,θ_1)$ 的最小值 - ![](https://gitee.com/veal98/images/raw/master/img/20200526222841.png)

总结一下多变量线性回归的知识点：

- **假设函数 **：预测 y 关于 x 的曲线 -  $h_θ(x) = θ_0x_0 + θ_1x_1 + θ_2x_2 + ... + + θ_nx_n （x_0 = 1）$  =  $\begin{bmatrix} θ_0 & θ_1 & θ_2 & ... & θ_n\end{bmatrix}$  $\begin{bmatrix} x_0 \\ x_1 \\ x_2 \\ ... \\ x_n\end{bmatrix}$ = $θ^Tx$

- **代价函数**：当代价函数取得最小值时（取决于 θ），假设函数将最佳拟合数据集 - $J(θ_0,θ_1,...θ_n) = \frac{1}{2m}\sum_{i=1}^{m}(h_θ(x^{(i)}) - y^{(i)})^2$  

- **（批量）梯度下降**：使用梯度下降算法来求出代价函数 $J(θ_0,θ_1)$ 的最小值 - ![](https://gitee.com/veal98/images/raw/master/img/20200529200443.png)

  如果梯度下降是正确的话，那么每次迭代后代价函数都会减小

- **特征缩放**：在我们面对多维特征问题的时候，我们要保证这些特征都在小范围内波动（-1 ~ 1 之间），这将帮助梯度下降算法更快地收敛。最简单的缩小特征值的方法就是**均值归一化**：令 $x_n = \frac{x_n - μ_n}c$，其中 $μ_n$ 是平均值，$s_n$ 是标准差

- **学习率 α**：梯度下降算法的每次迭代受到学习率的影响：
  - 如果学习率 α 过小，则达到收敛所需的迭代次数会非常高；
  - 如果学习率 α 过大，每次迭代可能不会减小代价函数，可能会越过局部最小值导致无法收敛

- **正规方程**：一次性求出参数 θ 的最优值 -  $θ = (X^TX)^{-1}X^Ty$

## ✍ Quiz

### ① 第 1 题

假设 m = 4 个学生上了一节课，有期中考试和期末考试。你已经收集了他们在两次考试中的分数数据集，如下所示：

| 期中得分 | (期中得分)^2 | 期末得分 |
| :------- | :----------- | :------- |
| 89       | 7921         | 96       |
| 72       | 5184         | 74       |
| 94       | 8836         | 87       |
| 69       | 4761         | 78       |

你想用多项式回归来预测一个学生的期中考试成绩。具体地说，假设你想拟合一个 hθ(x)=θ0+θ1x1+θ2x2 的模型，其中 x1 是期中得分，x2 是（期中得分）^2。此外，你计划同时使用特征缩放（除以特征的 “最大值 - 最小值” 或范围）和均值归一化。

标准化后的$x_2^{(4)}$特征值是多少？（提示：期中 = 89，期末 = 96是训练示例1）

- ✅ 均值归一化：$x_2^{(4)} = \frac{x_2^{(4)} - μ_2}{s_2}$，

  $μ_2$ 表示 平均值 = $\frac{x_2^{1} + x_2^{2} + x_2^{3} + x_2^{4}}{4} = \frac{7921+5184+8835+4761}{4} = 6675.5$，

  $s_2$ 表示标准差 = max - min  = 8836 - 4761 = 4075，得出 $x_2^{(4)} = \frac{4761 - 6675.5}{4075} ≈ -0.47$

### ② 第 2 题

用 α = 0.3 进行 15 次梯度下降迭代，每次迭代后计算 J(θ)。你会发现 J(θ) 的值下降缓慢，并且在 15 次迭代后仍在下降。基于此，以下哪个结论似乎最可信？

- α = 0.3 是学习率的有效选择

- 与其使用 α 当前值，不如尝试更小的 α 值（比如α = 0.1）

- ✅ 与其使用 α 当前值，不如尝试更大的 α 值（比如α = 1.0）

  > 迭代 15 次后迭代下降速度缓慢，那么 α=0.3 自然不是合适的值，需要调大一些才好。

### ③ 第 3 题

假设您有 m = 14 个训练示例，有 n = 3 个特征（不包括需要另外添加的恒为 1 的截距项 $x_0$），正规方程是 $θ=(X^TX)^{−1}X^Ty$ 。对于给定 m 和n 的值，这个方程中 θ, X, y 的维数分别是多少？

- X ：14×3,  y ：14×1,  θ ：3×3 
- ✅ X ：14×4,  y ：14×1,  θ ：4×1 
- X ：14×3,  y ：14×1,  θ ：3×1 
- X ：14×4,  y ：14×4,  θ ：4×4

### ④ 第 4 题

假设您有一个数据集，每个示例有 m = 100,0000 个示例和 n = 20,0000 个特征。你想用多元线性回归来拟合参数 θ 到我们的数据。你更应该用梯度下降还是正规方程？

- ✅ 梯度下降，因为正规方程中$θ=(X^TX)^{−1}$中计算非常慢

- 正规方程，因为它提供了一种直接求解的有效方法

- 梯度下降，因为它总是收敛到最优 θ

- 正规方程，因为梯度下降可能无法找到最优θ

### ⑤ 第 5 题

以下哪些是使用特征缩放的原因？

- 它可以防止梯度下降陷入局部最优
- 它通过降低梯度下降的每次迭代的计算成本来加速梯度下降
- ✅ 它通过减少迭代次数来获得一个好的解，从而加快了梯度下降的速度
- 它防止矩阵$X^TX$（用于正规方程）不可逆（奇异/退化）

---

# 💻  编程作业  - Python 实现  

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
```

### 1. 简单练习

输出一个 `5*5` 的单位矩阵

```python
np.eye(5)
```

![](https://gitee.com/veal98/images/raw/master/img/20200615153229.png)

### 2. 单变量线性回归

在本部分的练习中，您将使用一个变量实现线性回归，以预测食品卡车的利润。假设你是一家餐馆的首席执行官，正在**考虑不同的城市开设一个新的分店**。该连锁店已经在各个城市拥有卡车，而且你有来自城市的利润和人口数据。
您希望**使用这些数据来帮助您选择将哪个城市扩展到下一个城市**。

> 整个 2 的部分需要根据城市人口数量，预测开小吃店的利润 数据在 ex1 / ex1data1.txt 里，第一列是城市人口数量，第二列是该城市小吃店利润。
>
> 💡 **ex1data1.txt**：
>
> 6.1101,17.592
>
> 5.5277,9.1302
>
> 8.5186,13.662
>
> 7.0032,11.854
>
> 5.8598,6.8233
>
> 8.3829,11.886
>
> 7.4764,4.3483
>
> 8.5781,12

#### 2.1 展示数据

读入数据，然后展示数据

```python
path = 'ex1/ex1data1.txt'
data = pd.read_csv(path,names = ['Population','Profit']) # 读取数据并赋予列名
data.plot(kind='scatter', x='Population', y='Profit'，figsize=(8,5)) # scatter 表示散点图
```

![](https://gitee.com/veal98/images/raw/master/img/20200615155158.png)

#### 2.2 梯度下降

现在让我们使用梯度下降来实现线性回归，以最小化成本函数。 

- **公式**

  首先，我们将创建一个以参数θ为特征函数的代价函数

  ![](https://gitee.com/veal98/images/raw/master/img/20200615155938.png)

  计算代价函数 J(θ)：

  ```python
  def computeCost(X, y, theta):
      inner = np.power(((X*theta.T)-y),2)
      return np.sum(inner) / (2*len(X))
  ```

- **实现**

  数据前面已经读取完毕，我们要为加入一列 x，用于更新 θ0（即添加 $x_0 = 1$），然后我们将 θ 初始化为 0，学习率初始化为 0.01，迭代次数为 1500 次

  ```python
  data.insert(0, 'Ones', 1)
  ```

  ![](https://gitee.com/veal98/images/raw/master/img/20200615163040.png)

  现在我们来做一些变量初始化：

  ```python
  # 初始化 X 和 y
  cols = data.shape[1]  # 列数
  X = data.iloc[:,0:cols-1]  # 取前cols-1列，即输入向量 / 特征
  y = data.iloc[:,cols-1:cols] # 取最后一列，即输出向量
  ```

  ![](https://gitee.com/veal98/images/raw/master/img/20200615163506.png)

  ![](https://gitee.com/veal98/images/raw/master/img/20200615163453.png)

  

  代价函数是应该是numpy矩阵，所以我们需要转换X和Y，然后才能使用它们。 我们还需要初始化theta：

  ```python
  X = np.matrix(X.values)
  y = np.matrix(y.values)
  theta = np.matrix(np.array([0,0])) # theta 是一个(1,2)矩阵
  ```

  > 🚨 这里我使用的是 matix 而不是 array，两者基本通用。
  >
  > 但是matrix的优势就是相对简单的运算符号，比如两个矩阵相乘，就是用符号 `*`，但是array相乘不能这么用，得用方法 `.dot()`
  > array的优势就是不仅仅表示二维，还能表示3、4、5…维，而且在大部分Python程序里，array也是更常用的。
  >
  > 💭 两者区别：
  >
  > - 对应元素相乘：matrix 可以用 `np.multiply(X2,X1)`，array直接 `X1*X2`
  > - 点乘：matrix 直接 `X1*X2`，array可以 `X1@X2 `或 `X1.dot(X2)` 或 `np.dot(X1, X2)`

  ![](https://gitee.com/veal98/images/raw/master/img/20200615163752.png)

  看下维度，确保计算没问题：

  ```python
  X.shape, theta.shape, y.shape
  # ((97, 2), (1, 2), (97, 1))
  ```

- **计算J(θ)**

  计算代价函数 (theta初始值为0)，答案应该是32.07

  ```python
  computeCost(X, y, theta) # 32.072733877455676
  ```

- **梯度下降**

  ![](https://gitee.com/veal98/images/raw/master/img/20200615164558.png)

  > ⭐ 记住J(θ)的变量是θ，而不是X和y，意思是说，我们变化θ的值来使J(θ)变化，而不是变化X和y的值。 **一个检查梯度下降是不是在正常运作的方式，是打印出每一步J(θ)的值，看他是不是一直都在减小，并且最后收敛至一个稳定的值。** θ 最后的结果会用来预测小吃店在35000及70000人城市规模的利润。

  使用 **vectorization 向量化** 同时更新所有的 θ，可以大大提高效率

  ```python
  # 梯度下降
  def gradientDescent(X,y,theta,alpha,iters): # iters 表示迭代次数
      temp = np.matrix(np.zeros(theta.shape)) # 初始化 θ 的临时矩阵（1，2）
      parameters = int(theta.ravel().shape[1]) # 参数 θ 的数量
      cost = np.zeros(iters) # 初始化一个ndarray，包含每次迭代后代价函数的值
      m = X.shape[0] # 样本数量
      
      for i in range(iters):
          temp = theta - (alpha / m) * (X * theta.T - y).T * X
          theta = temp 
          cost[i] = computeCost(X,y,theta) # 输出每次迭代后代价函数的值
      return theta,cost
  ```

  初始化一些附加变量 - 学习速率α和要执行的迭代次数，2.2.2中已经提到：

  ```python
  alpha = 0.01
  iters = 1500
  ```

  现在让我们运行梯度下降算法来将我们的参数θ适合于训练集：

  ```python
  final_theta, cost = gradientDescent(X, y, theta, alpha, iters)
  ```

  ![](https://gitee.com/veal98/images/raw/master/img/20200615170111.png)

  最后，我们可以使用我们拟合的参数计算训练模型的代价函数（误差）：

  ```python
  computeCost(X, y, final_theta) # 4.483388256587726
  ```

  

  现在我们来绘制线性模型以及数据，直观地看出它的拟合。

  `np.linspace()` 在指定的间隔内返回均匀间隔的数字。

  ```python
  x = np.linspace(data.Population.min(), data.Population.max(), 100)  # 横坐标
  f = final_theta[0, 0] + (final_theta[0, 1] * x)  # 纵坐标，利润
  
  fig = plt.figure()
  ax = fig.add_subplot(1,1,1)
  ax.plot(x, f, 'r', label='Prediction')
  ax.scatter(data['Population'], data.Profit, label='Traning Data')
  ax.legend(loc=2)  # 2表示在左上角
  ax.set_xlabel('Population')
  ax.set_ylabel('Profit')
  ax.set_title('Predicted Profit vs. Population Size')
  ```

  <img src="https://gitee.com/veal98/images/raw/master/img/20200615171050.png" style="zoom:80%;" />

  由于梯度方程式函数在每个训练迭代中输出了代价函数的值，所以我们也可以绘制。 请注意，线性回归中的代价函数总是降低的 - 这是凸优化问题的一个例子。

  ```python
  fig, ax = plt.subplots(figsize=(6,4))
  ax.plot(np.arange(iters), cost, 'r')  # np.arange()返回等差数组
  ax.set_xlabel('Iterations')
  ax.set_ylabel('Cost')
  ax.set_title('Error vs. Training Epoch')
  ```

  <img src="https://gitee.com/veal98/images/raw/master/img/20200615172057.png" style="zoom:80%;" />



### 3. 多变量线性回归

ex1data2.txt 里的数据，第一列是房屋大小，第二列是卧室数量，第三列是房屋售价

**根据已有数据，建立模型，预测房屋的售价**

> 💡 **ex1data2.txt**
>
> 2104,3,399900
> 
> 1600,3,329900
> 
> 2400,3,369000
> 
> 1416,2,232000
> 
> 3000,4,539900
> 
> 1985,4,299900
> 
> 1534,3,314900
> 
> 1427,3,198999
> 
> 1380,3,212000

```python
data2 = pd.read_csv('ex1/ex1data2.txt', names=['Size','Bedrooms','Price'])
```

![](https://gitee.com/veal98/images/raw/master/img/20200615172627.png)



#### 3.1 特征归一化

观察数据发现，size变量是bedrooms变量的1000倍大小,**统一量级会让梯度下降收敛的更快**。做法就是**均值归一化**：将每类特征减去他的平均值后除以标准差

```python
data2 = (data2 - data2.mean()) / data2.std()
```

![](https://gitee.com/veal98/images/raw/master/img/20200615172845.png)

#### 3.2 梯度下降

现在我们重复单变量线性回归中的预处理步骤，并对新数据集运行线性回归程序。

```python
# add ones column
data2.insert(0, 'Ones', 1)

# set X (training data) and y (target variable)
cols = data2.shape[1]
X2 = data2.iloc[:,0:cols-1]
y2 = data2.iloc[:,cols-1:cols]

# convert to matrices and initialize theta
X2 = np.matrix(X2.values)
y2 = np.matrix(y2.values)
theta2 = np.matrix(np.array([0,0,0]))

# perform linear regression on the data set
g2, cost2 = gradientDescent(X2, y2, theta2, alpha, iters)

# get the cost (error) of the model
computeCost(X2, y2, g2), g2
```

![](https://gitee.com/veal98/images/raw/master/img/20200615173109.png)

查看 J(θ) 是否在不断减小并趋于固定值：

```python
fig, ax = plt.subplots(figsize=(6,4))
ax.plot(np.arange(iters), cost2, 'r')
ax.set_xlabel('Iterations')
ax.set_ylabel('Cost')
ax.set_title('Error vs. Training Epoch')
```

![](https://gitee.com/veal98/images/raw/master/img/20200615173307.png)

#### 3.3 正规方程

正规方程是通过求解下面的方程来找出使得代价函数最小的参数的：$\frac{\partial }{\partial {{\theta }_{j}}}J\left( {{\theta }_{j}} \right)=0$ 。 假设我们的训练集特征矩阵为 X（包含了x0=1）并且我们的训练集结果为向量 y，则利用正规方程解出向量 $\theta ={{\left( {{X}^{T}}X \right)}^{-1}}{{X}^{T}}y$。 上标T代表矩阵转置，上标-1 代表矩阵的逆。设矩阵 $A=X^TX$，则：${{\left( {{X}^{T}}X \right)}^{-1}}={{A}^{-1}}$

梯度下降与正规方程的比较：

- **梯度下降**：<u>需要选择学习率α，需要多次迭代</u>，当特征数量n大时也能较好适用，适用于各种类型的模型

- **正规方程**：不需要选择学习率α，一次计算得出，需要计算${{\left( {{X}^{T}}X \right)}^{-1}}$，如果特征数量n较大则运算代价大，因为矩阵逆的计算时间复杂度为O(n^3)，通常来说当n小于10000 时还是可以接受的，只适用于线性模型，不适合逻辑回归模型等其他模型

```python
# 正规方程
def normalEqn(X, y):
    theta = np.linalg.inv(X.T@X)@X.T@y # np.linalg.inv 求逆；X.T@X等价于X.T.dot(X)
    return theta
```

```python
final_theta2=normalEqn(X, y) # 和批量梯度下降的theta的值有点差距
```

![](https://gitee.com/veal98/images/raw/master/img/20200615173928.png)



---

# 📚 References

- 🤖 [吴恩达机器学习经典名课【中英字幕】](https://www.bilibili.com/video/BV164411S78V?p=2)
- 💠 [黄海广 - 斯坦福大学2014机器学习教程中文笔记](http://www.ai-start.com/ml2014/)
- 🍧 [90题细品吴恩达《机器学习》，感受被刷题支配的恐惧](https://www.kesci.com/home/project/5e0f01282823a10036b280a7)
- 🥩 [吴恩达机器学习 课后实验 python实现](https://www.kesci.com/home/project/5da16a37037db3002d441810)