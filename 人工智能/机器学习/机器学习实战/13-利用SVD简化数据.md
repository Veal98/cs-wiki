# 🏆 利用SVD简化数据

---

## 1. 奇异值分解 SVD 概述

**奇异值分解（SVD, Singular Value Decomposition）** 是一种最常见的**矩阵分解**技术，矩阵分解可以将原始的一个矩阵分解成易于处理的两个或者多个矩阵（去除噪音），就好比把 12 分解成 3x4。可以把 SVD 看成是从噪声数据中抽取相关特征。

⭐ **奇异值分解的定义**如下：

<img src="https://gitee.com/veal98/images/raw/master/img/20200802174615.png" style="zoom:80%;" />

<u>对于任意实矩阵，奇异值分解一定存在</u>

SVD 将原始的数据集矩阵 Data 分解成 3 个矩阵 U、∑、V，如果原始矩阵 $Data_{m*n}$是 m 行 n 列，那么

⭐ 即：$Data_{m*n} = U_{m*m} * ∑_{m*n} * V^T_{n*n}$

<img src="https://gitee.com/veal98/images/raw/master/img/20200802163434.png" style="zoom:80%;" />

🚩 注意：

- SVD 分解构建出的**矩阵 ∑ 只有对角元素，其他元素均为0(近似于0)。∑ 的对角元素是从大到小排列的。这些对角元素称为奇异值**。
- **U 和 V 都可以作为高维转低维的转换矩阵，将原始高维冗余数据转换到一个低维无冗余语义空间中，从而实现数据的降维。**
- 普遍的事实: <u>在某个奇异值的数目 r 个（奇异值的平方和累加到总值的90%以上) 之后，其他的奇异值都置为0(近似于0)。这意味着数据集中仅有 r 个重要特征，而其余特征则都是噪声或冗余特征。</u>

🎮 SVD 的应用：

- **隐性语义分析**

  最早的 SVD 应用之一就是信息检索，我们称利用 SVD 的方法为**隐性语义索引（Latent Semantic Indexing，LSI）**或**隐性语义分析 Latent Semantic Analysis，LSA）**。

  在 LSI 中：**矩阵 = 文档 + 词语**。当我们在该矩阵上应用 SVD 时，就会构建出多个奇异值。这些奇异值代表了文档中的概念或主题，这一特点可以用于更高效的文档搜索。

- **推荐系统**

- **图像压缩**

## 2. 利用 Python 实现 SVD

我们利用 Numpy 的 `linalg` 的线性代数工具箱来实现奇异值分解。

比如说，分解该矩阵：<img src="https://gitee.com/veal98/images/raw/master/img/20200801215237.png" style="zoom:80%;" />

```python
import numpy as np

U,Sigma,VT = np.linalg.svd([[1,1],[7,7]]) # 2x2
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200801220502.png" style="zoom:80%;" />

OK，接下来处理一个稍大的数据集：

```python
def loadExData():
    return[[0, 0, 0, 2, 2],
           [0, 0, 0, 3, 3],
           [0, 0, 0, 1, 1],
           [1, 1, 1, 0, 0],
           [2, 2, 2, 0, 0],
           [5, 5, 5, 0, 0],
           [1, 1, 1, 0, 0]]

Data = loadExData()

U,Sigma,VT = np.linalg.svd(Data)
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200801220821.png" style="zoom:80%;" />

分解出的 5 个奇异值中后 2 个数值比前面小了太多，所以我们就可以将最后两个值去掉了。

这样，利用新的 Σ 对原始数据矩阵进行近似从而实现降维：

![](https://gitee.com/veal98/images/raw/master/img/20200801221221.png)

💡 上述近似计算的示意图如下：

<img src="https://gitee.com/veal98/images/raw/master/img/20200801221818.png" style="zoom:80%;" />

OK，现在我们已经通过 3 个矩阵对原始矩阵进行了近似，下面我们将讨论一个比较流行的 SVD 应用的例子——推荐引擎。

## 3. 基于协同过滤的推荐引擎

有很多方法来实现推荐功能，这里我们只介绍一种称为**协同过滤 collaborative filtering** 的方法。协同过滤就是通过将用户和其他用户的数据进行对比来实现推荐的。这里的数据实际上组织成了矩阵的形式。

当知道了两个用户或两个物品之间的**相似度**，我们就可以利用已有的数据来预测未知用户的喜好。

### ① 相似度计算

💧 计算相似度有以下 3 种方法：

- 欧式距离
- 皮尔逊相关系数 Pearson correlation
- 余弦相似度 cosine similarity

#### Ⅰ 欧式距离

比如说，我们看下面这个用户对菜品的打分矩阵：

<img src="https://gitee.com/veal98/images/raw/master/img/20200802141949.png" style="zoom:80%;" />

手撕猪肉和烤牛肉之间的欧式距离为：<img src="https://gitee.com/veal98/images/raw/master/img/20200802142202.png" style="zoom:80%;" />

而手撕猪肉和鳗鱼饭之间的欧氏距离为：<img src="https://gitee.com/veal98/images/raw/master/img/20200802142246.png" style="zoom:80%;" />

显然，手撕猪肉和烤牛肉更为相似。

一般来说我们希望相似度值在 0 到 1 之间变化，并且物品对越相似，相似度的值越大，得出 `相似度 = 1 / （1 + 欧式距离）`

✍ **Python 实现**：

```python
# 利用欧式距离计算两个向量 inA inB 的相似度
def ecludSim(inA, inB):
    return 1.0 / (1.0 + np.linalg.norm(inA - inB))
```

🏃‍ 运行该代码：

```python
def loadExData():
    return[[0, 0, 0, 2, 2],
           [0, 0, 0, 3, 3],
           [0, 0, 0, 1, 1],
           [1, 1, 1, 0, 0],
           [2, 2, 2, 0, 0],
           [5, 5, 5, 0, 0],
           [1, 1, 1, 0, 0]]

myMat = np.mat(loadExData())
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200802145612.png" style="zoom:80%;" />

<img src="https://gitee.com/veal98/images/raw/master/img/20200802145635.png" style="zoom:80%;" />

#### Ⅱ 皮尔逊相关系数 Pearson correlation

它度量的是两个向量之间的相似度，该方法相比于欧式距离的优势就在于它对用户评级的量级并不敏感。比如说某个激进者对所有物品的评分都是 5 分，而某个忧郁者对所有物品的评分都是 1 分，皮尔逊相关系数会认为这两个向量是相等的。

在 Numpy 中，皮尔逊相关系数的计算是函数 `corrcoef()`，该函数的取值范围从 -1 到 1，同样，我们希望相似度的值处于 0 到 1 之间，得出 `相似度= 0.5 + 0.5 * np.corrcoef() `

✍ **Python 实现**：

```python
# 利用皮尔逊相关系数计算两个向量 inA inB 的相似度
def pearsSim(inA, inB):
    if len(inA) < 3:
        return 1.0
    return 0.5 + 0.5 * np.corrcoef(inA, inB, rowvar=0)[0][1]
```

🏃‍ 运行该代码：

<img src="https://gitee.com/veal98/images/raw/master/img/20200802145821.png" style="zoom:80%;" />

#### Ⅲ 余弦相似度 cosine similarity

它计算的是两个向量夹角的余弦值。如果夹角为 90 度，则相似度为 0，如果两个向量方向相同，即夹角为 0，则相似度为 1。

两个向量 A 和 B 的余弦相似度为 <img src="https://gitee.com/veal98/images/raw/master/img/20200802143523.png" style="zoom:80%;" /> ，$||A||$ 表示向量 A 的 2 范数。比如 向量 $[4,2,2]$ 的 2 范数为：<img src="https://gitee.com/veal98/images/raw/master/img/20200802144014.png" style="zoom:80%;" />，在 Numpy 中，计算 $||A||$ 的函数为 `linalg.norm()`

余弦相似度的取值范围在 -1 到 1 之间，同样要将其归一化到 0 到 1 之间，得出 `相似度= 0.5 + 0.5*( float(A.T*B) / np.linalg.norm(A) * np.linalg.norm(B))`

✍ **Python 实现**：

```python
# 利用余弦计算两个向量 inA inB 的相似度
def cosSim(inA, inB):
    num = float(inA.T * inB)
    denom = np.linalg.norm(inA) * np.linalg.norm(inB)
    return 0.5 + 0.5*(num/denom)
```

🏃‍ 运行该代码：

<img src="https://gitee.com/veal98/images/raw/master/img/20200802145649.png" style="zoom:80%;" />

### ② 基于物品的相似度还是基于用户的相似度？

上面的相似度的计算都是采用了列向量的形式，即**基于物品 item-based 的相似度**。

而采用行向量的形式，即称为**基于用户 user-based 的相似度**。

❓ 那么到底如何选择采用哪种形式来进行计算相似度呢？

- 物品比较少则选择物品相似度
- 用户比较少则选择用户相似度。<u>【矩阵小一点好计算】</u>

### ③ 推荐引擎的评价

可以使用前面多次使用的**交叉测试法**来对推荐引擎进行评价，进将数据集分成训练集和测试集，计算在测试集上的预测值和真实值之间的差异。

通常用于推荐引擎评价的指标是**最小均方根误差 Root Mean Squared  Error，RMSE**：即首先计算均方误差的平均值然后取其平方根。如果评级在 1 星 到 5 星 这个范围内，而我们得到的 RMSE = 1.0，那么就意味着我们的预测值和用户给出的真实评价相差了 1 个星级。

## 4. 示例：餐馆菜肴推荐引擎

Now，我们开始构建一个推荐引擎。假设一个在家决定外出吃饭，但是它并不知道该去哪儿吃饭，该点什么菜，这个推荐系统可以帮助他。

### ① 推荐未尝过的菜肴

**推荐系统的工作过程**：给定一个用户，系统会为此用户返回 N 个最好的推荐菜。

💧 实现流程大致如下:

- 寻找用户没有评级的菜肴，即在用户-物品矩阵中寻找 0 值。

- 在用户没有评级的所有物品中，对每个物品预计一个可能的评级分数。这就是说: 我们认为用户可能会对物品的打分（这就是相似度计算的初衷）。

- 对这些物品的评分从高到低进行排序，返回前N个物品。

✍ **基于物品相似度进行评分**：

```python
# 基于物品相似度进行评分
def standEst(dataMat, user, simMeas, item):
    """standEst(计算某用户未评分物品中，对该物品和其他物品评分的用户的物品相似度，然后进行综合评分)

    Args:
        dataMat         训练数据集
        user            用户编号
        simMeas         相似度计算方法
        item            未评分的物品编号
    Returns:
        ratSimTotal/simTotal     评分（0～5之间的值）
    """
    # 得到数据集中的物品数目
    n = np.shape(dataMat)[1]
    # 初始化两个评分值
    simTotal = 0.0
    ratSimTotal = 0.0
    # 遍历行中的每个物品（对用户评过分的物品进行遍历，并将它与其他物品进行比较）
    for j in range(n):
        userRating = dataMat[user, j]
        # 如果某个物品的评分值为0，则跳过这个物品
        if userRating == 0:
            continue
        # 寻找两个用户都评级的物品
        # 变量 overLap 给出的是两个物品当中已经被评分的那个元素的索引ID
        # logical_and 计算x1和x2元素的真值 逻辑与。
        overLap = np.nonzero(np.logical_and(dataMat[:, item].A > 0, dataMat[:, j].A > 0))[0]
        # 如果两者没有任何重合元素（相似度为0），终止本次循环
        if len(overLap) == 0:
            similarity = 0
        # 如果存在重合的物品，则基于这些重合物重新计算相似度。
        else:
            similarity = simMeas(dataMat[overLap, item], dataMat[overLap, j])
        # print 'the %d and %d similarity is : %f'(iten,j,similarity)
        # 相似度会不断累加，每次计算时还考虑相似度和当前用户评分的乘积
        # similarity  用户相似度，   userRating 用户评分
        simTotal += similarity
        ratSimTotal += similarity * userRating
    if simTotal == 0:
        return 0
    # 通过除以所有的评分总和，对上述相似度评分的乘积进行归一化，使得最后评分在0~5之间，这些评分用来对预测值进行排序
    else:
        return ratSimTotal/simTotal
```

✍ **推荐引擎：产生最高的N个推荐结果**

```python
# recommend()函数，就是推荐引擎，它默认调用standEst()函数，产生了最高的N个推荐结果。
# 如果不指定N的大小，则默认值为3。该函数另外的参数还包括相似度计算方法和估计方法
def recommend(dataMat, user, N=3, simMeas=cosSim, estMethod=standEst):
    # 寻找未评级的物品
    # 对给定的用户建立一个未评分的物品列表
    unratedItems = np.nonzero(dataMat[user, :].A == 0)[1]
    # 如果不存在未评分物品，那么就退出函数
    if len(unratedItems) == 0:
        return 'you rated everything'
    # 物品的编号和评分值
    itemScores = []
    # 在未评分物品上进行循环
    for item in unratedItems:
        estimatedScore = estMethod(dataMat, user, simMeas, item)
        # 寻找前N个未评级物品，调用standEst()来产生该物品的预测得分，该物品的编号和估计值会放在一个元素列表itemScores中
        itemScores.append((item, estimatedScore))
        # 按照估计得分，对该列表进行排序并返回。列表逆排序，第一个值就是最大值
    return sorted(itemScores, key=lambda jj: jj[1], reverse=True)[: N]
```

🏃‍ 运行上述代码：

```python
def loadExData():
    return[[4, 4, 0, 2, 2],
            [4, 0, 0, 3, 3],
            [4, 0, 0, 1, 1],
            [1, 1, 1, 2, 0],
            [2, 2, 2, 0, 0],
            [5, 5, 5, 0, 0],
            [1, 1, 1, 0, 0]]

myMat = np.mat(loadExData())
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200802160333.png" style="zoom:80%;" />

这表明了用户 2（第 3 行） 对物品 2 （第 3 列）的预测评分值为 2.5，对 物品 1 的预测评分值为 2.02

### ② 利用 SVD 提高推荐的效果

实际的数据会比我们上述给出的 myMat 矩阵稀疏得多。下面给出一个真实矩阵的例子：

```python
def loadExData2():
    # 利用SVD提高推荐效果，菜肴矩阵
    """
    行: 代表人
    列: 代表菜肴名词
    值: 代表人对菜肴的评分，0表示未评分
    """
    return[[2, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
           [0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0],
           [3, 3, 4, 0, 3, 0, 0, 2, 2, 0, 0],
           [5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 5, 0, 0, 5, 0],
           [4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 5],
           [0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4],
           [0, 0, 0, 0, 0, 0, 5, 0, 0, 5, 0],
           [0, 0, 0, 3, 0, 0, 0, 0, 4, 5, 0],
           [1, 1, 2, 1, 1, 2, 1, 0, 4, 5, 0]]

myMat = np.mat(loadExData2())
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200802160808.png" style="zoom:80%;" />

我们可以将用户物品评分矩阵进行SVD分解，将原始矩阵降维到一个低维矩阵（其中 U 矩阵可以将物品转换到低维空间，而 V 矩阵可以将用户转换到低维空间），从而减少计算相似度时的计算量，提高效率。在低维空间下，再利用前面的相似度方法来进行推荐。

✍ **基于 SVD 进行评分**：

```python
# 基于SVD的评分估计
# 在recommend() 中，这个函数用于替换对standEst()的调用，该函数对给定用户给定物品构建了一个评分估计值
def svdEst(dataMat, user, simMeas, item):
    """svdEst(计算某用户未评分物品中，对该物品和其他物品评分的用户的物品相似度，然后进行综合评分)

    Args:
        dataMat         训练数据集
        user            用户编号
        simMeas         相似度计算方法
        item            未评分的物品编号
    Returns:
        ratSimTotal/simTotal     评分（0～5之间的值）
    """
    # 物品数目
    n = np.shape(dataMat)[1]
    # 对数据集进行SVD分解
    simTotal = 0.0
    ratSimTotal = 0.0
    # 奇异值分解
    U, Sigma, VT = np.linalg.svd(dataMat)

    # 如果要进行矩阵运算，就必须要用这些奇异值构建出一个对角矩阵
    Sig4 = np.mat(np.eye(4) * Sigma[: 4])
    # 利用U矩阵将物品转换到低维空间中，构建转换后的物品(物品+4个主要的特征)
    xformedItems = dataMat.T * U[:, :4] * Sig4.I
    # 对于给定的用户，for循环在用户对应行的元素上进行遍历，
    # 这和standEst()函数中的for循环的目的一样，只不过这里的相似度计算时在低维空间下进行的。
    for j in range(n):
        userRating = dataMat[user, j]
        if userRating == 0 or j == item:
            continue
        # 相似度的计算方法也会作为一个参数传递给该函数
        similarity = simMeas(xformedItems[item, :].T, xformedItems[j, :].T)
        # for 循环中加入了一条print语句，以便了解相似度计算的进展情况。如果觉得累赘，可以去掉
        print('the %d and %d similarity is: %f' % (item, j, similarity))
        # 对相似度不断累加求和
        simTotal += similarity
        # 对相似度及对应评分值的乘积求和
        ratSimTotal += similarity * userRating
    if simTotal == 0:
        return 0
    else:
        # 计算估计评分
        return ratSimTotal/simTotal
```

🏃‍ 运行该代码：

<img src="https://gitee.com/veal98/images/raw/master/img/20200802162027.png" style="zoom:80%;" />

### ③ 构建推荐系统面临的挑战

❓ 问题：

- 1）在大规模的数据集上，SVD分解会降低程序的速度
- 2）存在其他很多规模扩展性的挑战性问题，比如矩阵的表示方法和计算相似度得分消耗的资源。
- 3）如何在缺乏数据时给出好的推荐 - 这个问题也称为**冷启动 clot-start**【简单说: 用户不会喜欢一个无效的物品，而用户不喜欢的物品又无效】

📝 建议：

- 1）在大型系统中，SVD分解(可以在程序调入时运行一次)每天运行一次或者其频率更低，并且还要离线运行。
- 2）在实际中，另一个普遍的做法就是离线计算并保存相似度得分。(物品相似度可能被用户重复的调用)
- 3）冷启动问题，解决方案就是将推荐看成是搜索问题，通过各种标签／属性特征进行**基于内容的推荐**。

## 📚 References

- 《Machine Learning in Action》

  <img src="https://gitee.com/veal98/images/raw/master/img/20200804111716.png" style="zoom:80%;" />

- 《机器学习 — 周志华》

- [Github - AiLearning](https://github.com/apachecn/AiLearning/)

- [如何让奇异值分解(SVD)变得不“奇异”？](https://redstonewill.com/1529/)

- [机器学习-奇异值分解](https://zhuanlan.zhihu.com/p/100771413)