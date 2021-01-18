# 🎃 Logistic 回归

---

**Logistic 回归** 或者叫**逻辑回归** ，虽然名字有回归，但是它是用来做分类的。

<u>假设现在有一些数据点，我们用一条直线对这些点进行拟合（该线称为最佳拟合直线 ），这个拟合过程就称为回归。</u>

Logistic 回归进行分类的**主要思想**是：根据现有数据对分类边界线建立回归公式，以此进行分类。训练分类器时的做法就是寻找最佳拟合参数，使用的是**最优化算法**（下面我们会介绍：基本的梯度上升法、改进的随机梯度上升法）。

> 其实我们生活中遇到过很多最优化问题，比如如何在最短时间内从 A 到达 B。

**Logistic 回归 开发流程：**

- 收集数据: 采用任意方法收集数据
- 准备数据: 由于需要进行距离计算，因此要求数据类型为数值型。另外，结构化数据格式则最佳。
- 分析数据: 采用任意方法对数据进行分析。
- **训练算法: 大部分时间将用于训练，训练的目的是为了找到最佳的分类回归系数**。
- 测试算法: 一旦训练步骤完成，分类将会很快。
- 使用算法: 首先，我们需要输入一些数据，并将其转换成对应的结构化数值；接着，基于训练好的回归系数就可以对这些数值进行简单的回归计算，判定它们属于哪个类别；在这之后，我们就可以在输出的类别上做一些其他分析工作。

## 1. Logistic Regression 基本原理

Logistic Regression和Linear Regression的原理是相似的，可以简单的描述为这样的过程：

- 找一个合适的**预测函数**（Andrew Ng 的公开课中称为 `hypothesis`），一般表示为 **h(x)** 函数（有些书中 将其表示为 **f(x)** 函数），该函数就是我们需要找的分类函数，**它用来预测输入数据的判断结果**。这个过程时非常关键的，需要对数据有一定的了解或分析，知道或者猜测预测函数的“大概”形式，比如是线性函数还是非线性函数。

- 构造一个 **Cost 函数（代价/损失函数）**，该函数表示**预测的输出（h）与训练数据类别（y）之间的偏差**，可以是二者之间的差（**h-y**）或者是其他的形式（比如均方误差）。综合考虑所有训练数据的“损失”，将 Cost 求和或者求平均，记为**J(θ)**函数，表示所有训练数据预测值与实际类别的偏差。

- 显然，**J(θ)**函数的值越小表示预测函数越准确（即**h**函数越准确），所以这一步需要做的是找到**J(θ)**函数的最小值。找函数的最小值有不同的方法，Logistic Regression 实现时有的是梯度下降法（Gradient Descent）或梯度上升法 Gradient Ascent。

## 2. 基于 Logistic 回归和 Sigmoid 函数的分类

<img src="https://gitee.com/veal98/images/raw/master/img/20200710142548.png" style="zoom:80%;" />

Sigmoid 函数具体的计算公式如下:

<img src="https://gitee.com/veal98/images/raw/master/img/20200710142711.png" style="zoom:80%;" />

下图给出了 Sigmoid 函数在不同坐标尺度下的两条曲线图。当 x 为 0 时，Sigmoid 函数值为 0.5 。随着 x 的增大，对应的 Sigmoid 值将逼近于 1 ; 而随着 x 的减小， Sigmoid 值将逼近于 0 。如果横坐标刻度足够大， Sigmoid 函数看起来很像一个阶跃函数。

<img src="https://gitee.com/veal98/images/raw/master/img/20200710142730.png" style="zoom: 67%;" />

⭐ 因此，**为了实现 Logistic 回归分类器，我们可以在每个特征上都乘以一个回归系数，然后把所有结果值相加，将这个总和代入 Sigmoid 函数中，进而得到一个范围在 0~1 之间的数值。任何大于 0.5 的数据被分入 1 类，小于 0.5 即被归入 0 类。**所以，Logistic 回归也可以被看成是一种概率估计。

## 3. 基于最优化方法的最佳回归系数

Sigmoid 函数的输入记为 z ，由下面公式得到:

⭐ <img src="https://gitee.com/veal98/images/raw/master/img/20200710142947.png" style="zoom:80%;" />（x0 一般置为 1）

如果采用向量的写法，上述公式可以写成 $z = w^T x$，它表示将这两个数值向量对应元素相乘然后全部加起来即得到 z 值。其中的向量组 x 是分类器的输入数据，**向量组 w 也就是我们要找到的最佳参数（系数）**，从而使得分类器尽可能地精确。

![](https://gitee.com/veal98/images/raw/master/img/20200710154606.png)

**为了寻找该最佳参数**，需要用到最优化理论的一些知识。**我们这里使用的是——梯度上升法（Gradient Ascent）**。

### ① 梯度上升法 Gradient Ascent

#### Ⅰ 梯度的介绍

- 向量 = 值 + 方向  
- 梯度 = 向量
- 梯度 = 梯度值 + 梯度方向

#### Ⅱ 梯度上升法的思想

**要找到某函数的最大值，最好的方法是沿着该函数的梯度方向探寻**。如果梯度记为 ▽ ，则函数 f(x, y) 的梯度由下式表示：

<img src="https://gitee.com/veal98/images/raw/master/img/20200710144343.png" style="zoom:80%;" />

这个梯度意味着要沿 x 的方向移动 <img src="https://gitee.com/veal98/images/raw/master/img/20200710144436.png" style="zoom:80%;" /> ，沿 y 的方向移动 <img src="https://gitee.com/veal98/images/raw/master/img/20200710144457.png" style="zoom:80%;" /> 。其中，函数 f(x, y) 必须要在待计算的点上有定义并且可微。下图是一个具体的例子。

<img src="https://gitee.com/veal98/images/raw/master/img/20200710144537.png" style="zoom: 67%;" />

上图中的梯度上升算法沿梯度方向移动了一步。可以看到，梯度算子总是指向函数值增长最快的方向。这里所说的是移动方向，而未提到移动量的大小。该量值称为步长，记作 α 。用向量来表示的话，**梯度上升算法的参数迭代公式如下**:

<img src="https://gitee.com/veal98/images/raw/master/img/20200710144737.png" style="zoom:80%;" />

该公式将一直被迭代执行，直至达到某个停止条件为止，比如迭代次数达到某个指定值或者算法达到某个可以允许的误差范围。

#### Ⅲ 梯度上升和梯度下降 Gradient Decent

其实这个两个方法在此情况下本质上是相同的。关键在于代价函数（cost function）或者叫目标函数（objective function）。如果目标函数是损失函数，那就是**最小化损失函数来求函数的最小值，就用梯度下降**。 如果目标函数是似然函数（Likelihood function），就是要**最大化似然函数来求函数的最大值，那就用梯度上升**。在逻辑回归中， 损失函数和似然函数无非就是互为正负关系。

只需要在迭代公式中的加法变成减法。因此，对应的公式可以写成

![](https://gitee.com/veal98/images/raw/master/img/20200710145710.png)

<u>对于参数的迭代公式，可以用通过向量化进行简化 👇</u>

####   Ⅳ 梯度下降(上升)过程向量化 vectorization

先给出 **vectorization** 的结果为（公式为梯度下降，梯度上升只需要改为 `+`）：

<img src="https://gitee.com/veal98/images/raw/master/img/20200710155709.png" style="zoom:80%;" />

下面进行推导：

约定训练数据的矩阵形式如下，x 的每一行为一条训练样本，而每一列为不同的特称取值：

<img src="https://gitee.com/veal98/images/raw/master/img/20200710155415.png" style="zoom:80%;" />

约定待求的参数**θ**（w）的矩阵形式为：

<img src="https://gitee.com/veal98/images/raw/master/img/20200710155427.png" style="zoom: 80%;" />

先求 `x*θ`（`x*w`）并记为 A：

<img src="https://gitee.com/veal98/images/raw/master/img/20200710155354.png" style="zoom:80%;" />

求 **hθ(x)-y** 并记为**E**（error）：

<img src="https://gitee.com/veal98/images/raw/master/img/20200710155542.png" style="zoom:80%;" />

g(A) 的参数 A 为一列向量，所以实现 g 函数时要支持列向量作为参数，并返回列向量。由上式可知 hθ(x)-y 可以由 g(A)-y 一次计算求得。

再来看一下vectorization 的**θ**更新过程，当 j=0 时：

<img src="https://gitee.com/veal98/images/raw/master/img/20200710155818.png" style="zoom:80%;" />

同样的可以写出**θj**：

<img src="https://gitee.com/veal98/images/raw/master/img/20200710155902.png" style="zoom:80%;" />

综合起来就是：

<img src="https://gitee.com/veal98/images/raw/master/img/20200710155926.png" style="zoom:80%;" />

综上所述，vectorization 后θ更新的步骤如下：

- 求 `A = x*θ`：每个特征上都乘以一个回归系数

- 求`E = g(A)-y`：A 代入 sigmoid 函数求出预测值，E 表示预测值和实际值的误差

- 求`θ:=θ-α.x'.E`，`x'` 表示矩阵 x 的转置：最佳回归系数（参数）向量

也可以综合起来写成：

<img src="https://gitee.com/veal98/images/raw/master/img/20200710160501.png" style="zoom:80%;" />

**1/m 是可以省略的**。

### ② 训练算法：使用梯度上升找出最佳参数

梯度上升法的伪代码如下：

```python
每个回归系数初始化为 1
重复 R 次:
    计算整个数据集的梯度
    使用 步长 x 梯度 更新回归系数的向量
返回回归系数
```

我们的数据集如下：100 行，3 列

<img src="https://gitee.com/veal98/images/raw/master/img/20200710150458.png" style="zoom: 80%;" />

Python 具体实现：

```python
import numpy as np

def loadDataSet():
    dataMat = [] # 数据集
    labelMat = [] # 标签集
    fr = open('testSet.txt')
    for line in fr.readlines():
        lineArr = line.strip().split()
        # 为了方便计算，我们将 X0 的值设为 1.0 ，也就是在每一行的开头添加一个 1.0 作为 X0
        dataMat.append([1.0, float(lineArr[0]), float(lineArr[1])])  # 数据的第一列和第二列 100 x 3
        labelMat.append(int(lineArr[2])) # 标签 1 x 100 行向量
    return dataMat, labelMat

def sigmoid(inX):
    return 1.0 / (1 + np.exp(-inX))

def gradAscent(dataMatIn, classLabels):
    """
    第一个参数==> dataMatIn 是一个3维NumPy数组，每列分别代表每个不同的特征，每行则代表每个训练样本。
    第二个参数==> classLabels 是类别标签，它是一个 1*100 的行向量。
                  为了便于矩阵计算，需要将该行向量转换为列向量，做法是将原向量转置，再将它赋值给labelMat。
    """
    dataMatrix = np.mat(dataMatIn) # 转换未 Numpy 矩阵数据类型 matrix
    labelMat = np.mat(classLabels).transpose() # transpose 转置成列向量
    m,n = np.shape(dataMatrix) # dataMatrix 100 x 3：m->数据量(样本数)  100、 n->特征数 3(x0 x1 x2)
    alpha = 0.001 # alpha代表向目标移动的步长
    maxCycles = 500  # 迭代次数
    weights = np.ones((n,1)) # 生成一个长度和特征数相同的矩阵，此处n为3 -> [[1],[1],[1]]
    # weights 代表回归系数， 此处的 ones((n,1)) 创建一个长度和特征数相同的矩阵，其中的数全部都是 1
    for k in range(maxCycles):
        h = sigmoid(dataMatrix * weights) # 参数 * 回归系数 作为 z 代入 sigmoid 函数
        error = labelMat - h # 向量相减 误差
        weights = weights + alpha * dataMatrix.transpose() * error # 向量化，见上文讲解
    return weights
```

![](https://gitee.com/veal98/images/raw/master/img/20200710195646.png)

> `h = sigmoid(dataMatrix * weights)` 这行代码用来计算假设函数的值（0，1），变量 h 不是一个数而是一个列向量，dataMatrix：100 x 3，weights：3 x 1，也就是说，每次循环，该行代码都包含了 300 次的乘积计算 😰。

### ③ 分析数据：画出决策边界

```python
# 画出数据集和最佳拟合直线
def plotBestFit(weights):
    '''
        Desc:
            将我们得到的数据可视化展示出来
        Args:
            weights:回归系数
        Returns:
            None
    '''
    
    import matplotlib.pyplot as plt
    dataMat, labelMat = loadDataSet()
    dataArr = np.array(dataMat) # 1000 x 3
    n = np.shape(dataArr)[0] # 1000
    xcord1 = []; ycord1 = []
    xcord2 = []; ycord2 = []
    for i in range(n):
        if int(labelMat[i]) == 1:
            xcord1.append(dataArr[i, 1]) # 第一列数据（第0列数据是 x0 = 1，我们之前手动添加的)
            ycord1.append(dataArr[i, 2]) # 第二列数据
        else:
            xcord2.append(dataArr[i, 1])
            ycord2.append(dataArr[i, 2])
            
    fig = plt.figure()
    ax = fig.add_subplot(111) # 表示1行1列第1个位置  
    ax.scatter(xcord1, ycord1, s=30, c='red', marker='s')
    ax.scatter(xcord2, ycord2, s=30, c='green')
    x = np.arange(-3.0, 3.0, 0.1) # (start, end, step)
    y = (-weights[0]-weights[1]*x)/weights[2] # 见下文解释
    ax.plot(x, y)
    plt.xlabel('X1'); plt.ylabel('X2')
    plt.show()
```

💡 解释一下 `y = (-weights[0]-weights[1]*x)/weights[2]` 这行代码：对于 sigmoid 函数来说，x = 0 是两个分类（类别 1 和类别 0）的分界处。因此，我们 设定 $w_0x_0 + w_1x_1 + w_2x_2 = 0$，$x_0$ 我们已经默认设为 1了，$x_2$ 用 $y$ 来代替，即  $w_0 + w_1x_1 + w_2y = 0$ ，推出 $y = \frac{-w_0-w_1*x}{w_2}$。

🏃‍ 运行该代码：

![](https://gitee.com/veal98/images/raw/master/img/20200710203520.png)

> 🚨 如果直接调用 `plotBestFit(weights)`会报错：
>
> ![](https://gitee.com/veal98/images/raw/master/img/20200710204056.png)
>
> ❓ 为啥要将 `weights `转换成数组呢？
>
> 因为 x 是数组，`x = arange(-3.0, 3.0, 0.1)`，那么，$len(x) = [3-(-3)] / 0.1 = 60 $
>
> 而 `weights `(w) 是矩阵， $y = \frac{-w_0-w_1*x}{w_2}$，**len(y) = 1**，有 60 个 x，只有一个 y，这样画不了线 。
>
> 如果 `weights` 是数组的话，则 **len(y) = 60**

可以看到，分类效果很不错，但是尽管例子简单且数据集很小，这个方法仍然需要大量的计算。下一节将对算法进行改进。👇  

### ④ 改进算法：随机梯度上升

梯度上升算法在每次更新回归系数时都需要遍历整个数据集，该方法在处理小数量的数据集时还可以，但是在大数据特征计算时改方法的复杂度就太高了。

#### Ⅰ 随机梯度上升算法

一种改进方法就是**一次仅利用一个样本点来更新回归系数**，该方法称为**随机梯度上升算法**。由于可以<u>在新样本到来时对分类器进行增量式更新，因而称该算法是一个**在线学习算法**。</u>

> 💡 与在线学习相对应的就是一次性处理所有数据的**批处理** 

随机梯度上升算法的伪代码如下：

```python
所有回归系数初始化为 1
对数据集中每个样本
    计算该样本的梯度
    使用 alpha x gradient 更新回归系数值
返回回归系数值
```

Python 实现：

```python
# 随机梯度上升算法
def stocGradAscent0(dataMatrix, classLabels):
    m, n = np.shape(dataMatrix)
    alpha = 0.01
    weights = np.ones(n)   # 初始化长度为n的数组，元素全部为 1
    for i in range(m): # 迭代 100 次
         # sum(dataMatrix[i]*weights)求假设函数的值， h(x)=a1*x1+b2*x2+..+nn*xn,此处求出的 h 是一个具体的数值，而不是一个矩阵
        h = sigmoid(sum(dataMatrix[i]*weights))
        error = classLabels[i] - h  # 计算真实类别与预测类别之间的差值，然后按照该差值调整回归系数
        weights = weights + alpha * error * dataMatrix[i]
    return weights
```

> 梯度上升算法：
>
> ```python
> def gradAscent(dataMatIn, classLabels):
>     dataMatrix = np.mat(dataMatIn) 
>     labelMat = np.mat(classLabels).transpose() 
>     m,n = np.shape(dataMatrix)
>     alpha = 0.001
>     maxCycles = 500 
>     weights = np.ones((n,1)) 
>     for k in range(maxCycles):
>         h = sigmoid(dataMatrix * weights)
>         error = labelMat - h
>         weights = weights + alpha * dataMatrix.transpose() * error 
>     return weights
> ```
>
> 💡 可以看到，随机梯度上升算法和梯度上升算法有一些区别：
>
> - 梯度上升假设函数的值 h 和 误差 error 都是 **向量**
>
>   随机梯度上升假设函数的值 h 和 误差 error 都是 **数值**
>
> - 随机梯度上升没有矩阵的转换过程，所有变量的数据类型都是 Numpy 数组

运行代码：

![](https://gitee.com/veal98/images/raw/master/img/20200710211221.png)

⭐ **判断优化算法优劣的可靠方法是看它是否收敛，也就是说参数是否达到了稳定值，是否还会不断地变化**？下图展示了随机梯度上升算法在 200 次迭代过程中回归系数的变化情况。其中的系数 X2 只经过了 50 次迭代就达到了稳定值，但 😔 <u>系数 1 和 0 则需要大量次数的迭代才能达到稳定值，并且仍然有局部波动现象</u>。如下图所示：

![](https://gitee.com/veal98/images/raw/master/img/20200710211517.png)

#### Ⅱ 改进的随机梯度上升算法

对于上图存在的问题，我们改进一下随机梯度上升算法：

```python
# 改进的随机梯度上升算法
def stocGradAscent1(dataMatrix, classLabels, numIter=150):
    m, n = np.shape(dataMatrix)
    weights = np.ones(n)   #initialize to all ones
    for j in range(numIter): # 迭代 150 次
        dataIndex = list(range(m)) # 样本下标列表，从该列表中随机选取样本下标
        for i in range(m):
            alpha = 4/(1.0+j+i)+0.0001    # 随着i和j的不断增大，alpha（学习率）的值不断减少，但是不为 0
            # 随机产生一个 0～len()之间的一个值
            # random.uniform(x, y) 方法将随机生成下一个实数，它在[x,y]范围内,x是这个范围内的最小值，y是这个范围内的最大值。
            randIndex = int(np.random.uniform(0, len(dataIndex)))# 随机选取样本来更新回归系数
            h = sigmoid(sum(dataMatrix[randIndex]*weights))
            error = classLabels[randIndex] - h
            weights = weights + alpha * error * dataMatrix[randIndex]
            del(dataIndex[randIndex]) # 从样本下标列表中剔除已经使用过的样本下标
    return weights
```

👍 改进的地方有 2 处：

- 一方面，alpha 学习率在每次迭代的时候都会调整，这可以换解数据波动或者高频波动问题。虽然 alpha 随着迭代次数的增加而不断减小，但是永远不会到 0。这样做的原因是保证在多次迭代后新数据仍然具有一定的影响。
- 第二方面，通过随机选取样本来更新回归系数。每次从随机从列表中选出一个值，然后从列表中删除该值进行下一次迭代。这种方法将减少周期性的波动。
- 此外，算法海增加了迭代次数作为第 3 个参数

改进后的随机梯度上升算法的每次迭代时各个回归系数的变化情况：

<img src="https://gitee.com/veal98/images/raw/master/img/20200710212750.png" style="zoom: 67%;" />

🏃‍ 该代码的分类效果：

![](https://gitee.com/veal98/images/raw/master/img/20200710212904.png)

## 4. 示例：从疝气病症预测病马的死亡率

**项目概述**：

使用 Logistic 回归来预测患有疝病的马的存活问题。疝病是描述马胃肠痛的术语。然而，这种病不一定源自马的胃肠问题，其他问题也可能引发马疝病。**这个数据集中包含了医院检测马疝病的一些指标**，有的指标比较主观，有的指标难以测量，例如马的疼痛级别。

**开发流程**：

- 收集数据: 给定数据文件
- 准备数据: 用 Python 解析文本文件并填充缺失值
- 分析数据: 可视化并观察数据
- 训练算法: 使用优化算法，找到最佳的系数
- 测试算法: 为了量化回归的效果，需要观察错误率。根据错误率决定是否回退到训练阶段，通过改变迭代的次数和步长的参数来得到更好的回归系数
- 使用算法: 实现一个简单的命令行程序来收集马的症状并输出预测结果并非难事，这可以作为留给大家的一道习题

### ① 准备数据：处理数据中的缺失值

我们有两个数据集 `horseColicTest.txt` 测试集 和 `horseColicTraining.txt` 训练集 ，该数据存在一个问题，有 30% 的值是缺失的。首先，我们得处理数据中的缺失值。

下面给出了一些可选的做法:

- 使用可用特征的均值来填补缺失值；
- 使用特殊值来填补缺失值，如 -1；
- 忽略有缺失值的样本；
- 使用有相似样本的均值添补缺失值；
- 使用另外的机器学习算法预测缺失值。

这里我们采用**使用实数 0 来替换所有缺失值**，这样做的原因在于，我们需要的是一个在更新时不会影响系数的值。回归系数的更新公式如下:

`weights = weights + alpha * error * dataMatrix[randIndex]`

如果 dataMatrix 的某个特征对应值为 0，那么该特征的系数将不做更新，即 :

`weights = weights`

另外，由于 Sigmoid(0) = 0.5 ，即它对结果的预测不具有任何倾向性，因此我们上述做法也不会对误差造成任何影响。基于上述原因，将缺失值用 0 代替既可以保留现有数据，也不需要对优化算法进行修改。此外，该数据集中的特征取值一般不为 0，因此在某种意义上说它也满足 “特殊值” 这个要求。

另外，**如果在测试数据集中发现了一条数据的类别标签已经缺失，那么我们的简单做法是将该条数据丢弃。**这是因为类别标签与特征不同，很难确定采用某个合适的值来替换。<u>采用 Logistic 回归进行分类时这种做法是合理的，而如果采用类似 kNN 的方法，则保留该条数据显得更加合理</u>。

这就是我们预处理数据时所需要做的两件事。处理后的数据集部分如下：

![](https://gitee.com/veal98/images/raw/master/img/20200711201630.png)

OK，现在我们有了一个 “干净” 的数据。

### ② 测试算法：用 Logistic 回归进行分类

```python
# 假设函数 Sigmoid，用于预测最终结果
def classifyVector(inX, weights):
    '''
    Desc: 
        最终的分类函数，根据回归系数和特征向量来计算 Sigmoid 的值，大于0.5函数返回1，否则返回0
    Args:
        inX -- 特征向量，features
        weights -- 根据梯度下降/随机梯度下降 计算得到的回归系数
    Returns:
        如果 prob 计算大于 0.5 函数返回 1
        否则返回 0
    '''
    prob = sigmoid(sum(inX*weights))
    if prob > 0.5:
        return 1.0
    else:
        return 0.0

def colicTest():
    frTrain = open('horseColicTraining.txt')
    frTest = open('horseColicTest.txt')
    trainingSet = [] # 训练集特征
    trainingLabels = [] # 训练集标签
    for line in frTrain.readlines():
        currLine = line.strip().split('\t')
        lineArr = [] # 存储训练集特征
        for i in range(21): # 一共 21 列特征数据，第 22 列是标签
            lineArr.append(float(currLine[i]))
        trainingSet.append(lineArr)
        trainingLabels.append(float(currLine[21])) 
    trainWeights = stocGradAscent1(np.array(trainingSet), trainingLabels, 1000) # 训练参数
    
    errorCount = 0
    numTestVec = 0.0
    for line in frTest.readlines(): # 测试数据
        numTestVec += 1.0 # 数据行的个数（行数 ）
        currLine = line.strip().split('\t')
        lineArr = []
        for i in range(21):
            lineArr.append(float(currLine[i]))
        if int(classifyVector(np.array(lineArr), trainWeights)) != int(currLine[21]):
            errorCount += 1
    errorRate = (float(errorCount) / numTestVec)
    print("the error rate of this test is: %f" % errorRate)
    return errorRate

# 调用colicTest函数10次，求 平均值
def multiTest():
    numTests = 10; errorSum = 0.0
    for k in range(numTests):
        errorSum += colicTest()
    print("after %d iterations the average error rate is: %f" % (numTests, errorSum/float(numTests)))
```

![](https://gitee.com/veal98/images/raw/master/img/20200711204657.png)

从上面的结果可以看出，10 次迭代之后的平均错误率为 37%，而且这还是在 30% 数据缺失的情况下。

## ✅ End

Logistic 回归的目的是寻找一个非线性函数 Sigmoid 的最佳拟合参数，求解过程可以使用最优化算法来完成，最常用的就是梯度上升算法，而梯度上升算法又可以简化为随机梯度上升算法。

下一章将介绍另一种分类算法：支持向量机，它被认为是目前最好的算法之一。

## 📚 References

- 《Machine Learning in Action》

  <img src="https://gitee.com/veal98/images/raw/master/img/20200804111716.png" style="zoom:80%;" />

- [Github - AiLearning](https://github.com/apachecn/AiLearning/)

- [【机器学习笔记1】Logistic回归总结](https://blog.csdn.net/achuo/article/details/51160101)

- [《机器学习实战笔记--第一部分 分类算法：logistic回归1》](https://blog.csdn.net/qq_41635352/article/details/80625370)

