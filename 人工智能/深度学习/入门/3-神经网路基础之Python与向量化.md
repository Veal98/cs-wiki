# 🍨 神经网络基础 — Python 与向量化

---

> 🔈 上节课我们主要介绍了逻辑回归，以输出概率的形式来处理二分类问题。我们介绍了逻辑回归的 Cost function 表达式，并使用梯度下降算法来计算最小化 Cost function 时对应的参数 w 和 b。通过计算图的方式来讲述了神经网络的正向传播和反向传播两个过程。本节我们将来探讨 Python 和向量化的相关知识。

## 1.  向量化 Vectorization

深度学习算法中，数据量很大，在程序中应该尽量减少使用 loop 循环语句，而可以使用向量运算来提高程序运行速度。

向量化（Vectorization）就是利用矩阵运算的思想，大大提高运算速度。

在 Python 的 numpy 库中，我们通常使用 `np.dot()` 函数来进行矩阵运算，`dot()` 返回的是两个数组的点积 (dot product)

例如下面所示在 Python 中使用向量化要比使用循环计算速度快得多。

```python
# 循环
import numpy as np
import time

a = np.random.rand(1000000)
b = np.random.rand(1000000)

c = 0
tic = time.time()
for i in range(1000000):
    c += a[i]*b[i]
toc = time.time()

print(c)
print("for loop:" + str(1000*(toc-tic)) + "ms") # 474.29513931274414 ms
```

```python
# 向量化
import numpy as np
import time

a = np.random.rand(1000000)
b = np.random.rand(1000000)

tic = time.time()
c = np.dot(a,b)
toc = time.time()

print(c)
print("Vectorized version:" + str(1000*(toc-tic)) + "ms") # 1.5027523040771484 ms
```

从程序运行结果上来看，该例子使用 for 循环运行时间是使用向量运算运行时间的约 300 倍。因此，深度学习算法中，使用向量化矩阵运算的效率要高得多。

为了加快深度学习神经网络运算速度，可以使用比 CPU 运算能力更强大的 **GPU**。事实上，GPU 和 CPU 都有**并行指令（parallelization instructions）**，称为 **Single Instruction Multiple Data（SIMD）**。SIMD 是单指令多数据流，能够复制多个操作数，并把它们打包在大型寄存器的一组指令集。SIMD 能够大大提高程序运行速度，例如 python 的 numpy 库中的内建函数（built-in function）就是使用了SIMD指令。相比而言，GPU 的 SIMD 要比 CPU 更强大一些。

## 2.  向量化逻辑回归 Vectorizing Logistic Regression

整个训练样本构成的输入矩阵 X 的维度是（ $n_x$，m），权重矩阵 w 的维度是（$n_x$，1），b 是一个常数值，而整个训练样本构成的输出矩阵 Y 的维度为（1，m）。利用向量化的思想，所有 m 个样本的线性输出 Z 可以用矩阵表示：

$Z=w^TX+b$

在 Python 的 numpy 库中可以表示为：

```python
Z = np.dot(w.T,X) + b
A = sigmoid(Z)
```

这样，我们就能够使用向量化矩阵运算代替 for 循环，对所有 m 个样本同时运算，大大提高了运算速度。

## 3.  向量化逻辑回归的梯度计算 Vectorizing Logistic Regression's Gradient

再来看逻辑回归中的梯度下降算法如何转化为向量化的矩阵形式。

对于所有 m 个样本，dZ 的维度是（1，m），可表示为：$dZ=A-Y$

db 可表示为：$db=\frac1m \sum_{i=1}^mdz^{(i)}$，对应的程序为：

```python
db = 1/m * np.sum(dZ)
```

dw 可表示为：$dw=\frac1m X\cdot dZ^T$

```python
dw = 1/m * np.dot(X,dZ.T)
```

这样，我们把整个逻辑回归中的 for 循环尽可能用矩阵运算代替，对于单次迭代，梯度下降算法流程如下所示：

```python
Z = np.dot(w.T,X) + b
A = sigmoid(Z)
dZ = A-Y
dw = 1/m * np.dot(X,dZ.T)
db = 1/m * np.sum(dZ)

w = w - alpha * dw
b = b - alpha * db
```

其中，`alpha `是学习因子，决定`w`和`b`的更新速度。上述代码只是对单次训练更新而言的，外层还需要一个`for`循环，表示迭代次数。

## 4.  Python中的广播机制 Broadcasting

下面介绍使用 python 的另一种技巧：广播（Broadcasting）。python中的广播机制可由下面四条表示：

- **让所有输入数组都向其中 shape 最长的数组看齐，shape 中不足的部分都通过在前面加 1 补齐**
- **输出数组的 shape 是输入数组 shape 的各个轴上的最大值**
- **如果输入数组的某个轴和输出数组的对应轴的长度相同或者其长度为1时，这个数组能够用来计算，否则出错**
- **当输入数组的某个轴的长度为1时，沿着此轴运算时都用此轴上的第一组值**

简而言之，就是<u>python中可以对不同维度的矩阵进行四则混合运算，但至少保证有一个维度是相同的</u>。下面给出几个广播的例子，具体细节可参阅python的相关手册，这里就不赘述了。

<img src="https://gitee.com/veal98/images/raw/master/img/20200921203116.png" style="zoom: 50%;" />

值得一提的是，在 python 程序中为了保证矩阵运算正确，可以使用 `reshape()` 函数来对矩阵设定所需的维度。这是一个很好且有用的习惯：

```python
a = np.random.randn(5,1)
assert(a.shape == (5,1)) # 使用assert语句对向量或数组的维度进行判断
a.reshape((1,5)) # 用reshape函数对数组设定所需的维度
```

## 📚 Reference

- [黄海广 - Coursera 深度学习教程中文笔记](https://github.com/fengdu78/deeplearning_ai_books)
- [红色石头 - 吴恩达 deeplearning.ai 专项课程精炼笔记](https://blog.csdn.net/red_stone1/article/details/80207815)