# 🚀 TensorFlow 2 快速入门教程

---

## 1. TensorFlow 安装与环境配置

此处给出如何在 Windows 下安装 **TensorFlow 2** 以及如何将 TensorFlow 环境 添加进 Jupyter Notebook

安装 Python 环境。此处建议安装 [Anaconda](https://www.anaconda.com/) 的 Python 3.7 64 位版本（后文均以此为准），这是一个开源的 Python 发行版本，提供了一个完整的科学计算环境，包括 NumPy、SciPy 等常用科学计算库。当然，你有权选择自己喜欢的 Python 环境。Anaconda 的安装包可在 [这里](https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/) 获得。

使用 Anaconda 自带的 conda 包管理器建立一个 Conda 虚拟环境，并进入该虚拟环境。在命令行下输入（**Anaconda Prompt**）：

```shell
conda create --name tensorflow python=3.7      # “tensorflow”是你建立的conda虚拟环境的名字
conda activate tensorflow                      # 进入名为“tensorflow”的conda虚拟环境
```

在 tensorflow 环境下 使用 Python 包管理器 pip 安装 TensorFlow。在命令行下输入：

```shell
pip install tensorflow -i https://pypi.tuna.tsinghua.edu.cn/simple/
```

OK，这样安装成功后，我们**需要将 TensorFlow 添加进 Jupyter Notebook**，打开 **【Anaconda Navigator】**，搜索 `Jupyter ` 进行安装（numpy，Spyder ，ipython 等同理）：

<img src="https://gitee.com/veal98/images/raw/master/img/20201031195918.png" style="zoom:80%;" />

安装完成后，在这个环境下打开 Jupyter：

<img src="https://gitee.com/veal98/images/raw/master/img/20201031200136.png" style="zoom:67%;" />

验证下导入 tensorflow 是否报错：

```python
import tensorflow as tf
```

若不报错则大功告成 🎉

查看 tensorflow 版本：

```python
tf.__version__
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201031213605.png" style="zoom:75%;" />

## 2. 张量 Tensor

### ① 什么是张量

首先，你应该知道什么是向量和矩阵。我们把 1 维的数组称之为向量， 2 维的数组称之为矩阵。那么，现在告诉你**张量其实代表着更大的范围，你也可以把其看作是 N 维数组**。

所以，如果现在重新描述向量和矩阵，就可以是：**零阶张量是标量，一阶张量是向量，二阶张量是矩阵，N 阶张量是 N 维数组**。

<img src="https://gitee.com/veal98/images/raw/master/img/20201031205724.png" style="zoom: 55%;" />

后面将学习到的大多数深度学习框架都会使用张量的概念，这样做的好处是统一对数据的定义。NumPy 中，数据都使用 Ndarray 多维数组进行定义，TensorFlow 中，数据都会用张量进行表述。

下面就来学习 TensorFlow 中对张量的定义。在 TensorFlow 中，每一个 Tensor 都具备两个基础属性：数据类型 `dtype`（默认：float32）和形状 `shape`。

其中，数据类型大致如下表所示：

![](https://gitee.com/veal98/images/raw/master/img/20201031213342.png)

另外，TensorFlow 通过三种符号约定来描述张量维度：阶，形状和维数。三者之间的关系如下：

![](https://gitee.com/veal98/images/raw/master/img/20201031213356.png)

### ② 张量类型

根据不同的用途，TensorFlow 中主要有 2 种张量类型，分别是：

- `tf.Variable` ：变量 Tensor，需要指定初始值，常用于定义可变参数，例如神经网络的权重。

- `tf.Constant` ：常量 Tensor，需要指定初始值，定义不变化的张量。

我们可以通过传入列表或 NumPy 数组来新建变量和常量类型的张量：

💬 变量示例：

```python
v = tf.Variable([[1, 2], [3, 4]])  # 形状为 (2, 2) 的二维变量
v
```

输出

```python
<tf.Variable 'Variable:0' shape=(2, 2) dtype=int32, numpy=
array([[1, 2],
       [3, 4]], dtype=int32)>
```

💬 常量示例：

```python
c = tf.constant([[1, 2], [3, 4]])  # 形状为 (2, 2) 的二维常量
c
```

输出

```python
<tf.Tensor: id=9, shape=(2, 2), dtype=int32, numpy=
array([[1, 2],
       [3, 4]], dtype=int32)>
```

仔细观察，你会发现输出包含了张量的 3 部分属性，分别是形状 shape，数据类型 dtype，以及对应的 NumPy 数组。

你还可以直接通过 `.numpy()` 输出张量的 NumPy 数组。

```python
c.numpy()
```

输出

```python
array([[1, 2],
       [3, 4]], dtype=int32)
```

### ③ 常用新建特殊常量张量的方法

上面我们已经介绍了常量张量，这里再列举几个经常会用到的新建特殊**常量张量**的方法：

- `tf.zeros`：新建指定形状且全为 0 的常量 Tensor

  ```python
  c = tf.zeros([3, 3])  # 3x3 全为 0 的常量 Tensor
  c
  <tf.Tensor: id=12, shape=(3, 3), dtype=float32, numpy=
  array([[0., 0., 0.],
         [0., 0., 0.],
         [0., 0., 0.]], dtype=float32)>
  ```

- `tf.zeros_like`：参考某种形状，新建全为 0 的常量 Tensor

- `tf.ones`：新建指定形状且全为 1 的常量 Tensor

- `tf.ones_like`：参考某种形状，新建全为 1 的常量 Tensor

  ```python
  tf.ones_like(c)  # 与 c 形状一致全为 1 的常量 Tensor
  <tf.Tensor: id=15, shape=(3, 3), dtype=float32, numpy=
  array([[1., 1., 1.],
         [1., 1., 1.],
         [1., 1., 1.]], dtype=float32)>
  ```

- `tf.fill`：新建一个指定形状且全为某个标量值的常量 Tensor

  ```python
  tf.fill([2, 3], 6)  # 2x3 全为 6 的常量 Tensor
  <tf.Tensor: id=18, shape=(2, 3), dtype=int32, numpy=
  array([[6, 6, 6],
         [6, 6, 6]], dtype=int32)>
  ```

除此之外，我们还可以创建一些序列，例如：

- `tf.linspace`：创建一个等间隔序列。

  ```python
  # [1,10] 中等间隔选取 5 个数
  tf.linspace(1.0, 10.0, 5, name="linspace")
  <tf.Tensor: id=22, shape=(5,), dtype=float32, numpy=array([ 1.  ,  3.25,  5.5 ,  7.75, 10.  ], dtype=float32)>
  ```

- `tf.range`：创建一个数字序列。

  ```python
  #[1,10] 每隔 2 选取一个数
  tf.range(start=1, limit=10, delta=2)
  <tf.Tensor: id=26, shape=(5,), dtype=int32, numpy=array([1, 3, 5, 7, 9], dtype=int32)>
  ```

实际上，如果你熟悉 NumPy 的话，你会发现这与 NumPy 中创建各式各样的多维数组方法大同小异。数据类型是一切的基础，了解完张量我们就可以继续学习张量的运算了。

## 3. Eager Execution

**TensorFlow 2 带来的最大改变之一是将 1.x 的 Graph Execution（图与会话机制）更改为 Eager Execution（动态图机制）**。在 1.x 版本中，低级别 TensorFlow API 首先需要定义数据流图，然后再创建 TensorFlow 会话（Session），这一点在 2.0 中被完全舍弃。**TensorFlow 2 中的 Eager Execution 是一种命令式编程环境，可立即评估操作，无需构建图**。

所以说，**TensorFlow 的张量运算过程可以像 NumPy 一样直观且自然了**。接下来，我们以最简单的加法运算为例：

```python
c + c  # 加法计算
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201031215706.png" style="zoom: 80%;" />

如果你接触过 1.x 版本的 TensorFlow，你要知道一个加法运算过程十分复杂。我们需要初始化全局变量 → 建立会话 → 执行计算，最终才能打印出张量的运算结果。

```python
init_op = tf.global_variables_initializer()  # 初始化全局变量
with tf.Session() as sess:  # 启动会话
    sess.run(init_op)
    print(sess.run(c + c))  # 执行计算
```

Eager Execution 带来的好处显而易见，其进一步降低了 TensorFlow 的入门门槛。之前的 Graph Execution 模式，实际上让很多人在入门时都很郁闷，因为完全不符合正常思维习惯。

TensorFlow 中提供的数学计算，包括线性代数计算方面 `linalg` 的方法也是应有尽有，十分丰富。下面，我们再列举一个示例。

```python
a = tf.constant([1., 2., 3., 4., 5., 6.], shape=[2, 3])
b = tf.constant([7., 8., 9., 10., 11., 12.], shape=[3, 2])

c = tf.linalg.matmul(a, b)  # 矩阵乘法
c
<tf.Tensor: id=34, shape=(2, 2), dtype=float32, numpy=
array([[ 58.,  64.],
       [139., 154.]], dtype=float32)>

tf.linalg.matrix_transpose(c)  # 转置矩阵
<tf.Tensor: id=36, shape=(2, 2), dtype=float32, numpy=
array([[ 58., 139.],
       [ 64., 154.]], dtype=float32)>
```

你应该能够感觉到，这些常用 API 都能在 NumPy 中找到对应的方法，这也就是课程需要你预先熟悉 NumPy 的原因。由于函数实在太多太多。一般来讲，除了自己经常使用到的，都会在需要某种运算的时候，查阅官方文档。

所以说，**你可以把 TensorFlow 理解成为 TensorFlow 式的 NumPy + 为搭建神经网络而生的 API**。

## 4. 自动微分

在数学中，微分是对函数的局部变化率的一种线性描述。虽然微分和导数是两个不同的概念。但是，对一元函数来说，可微与可导是完全等价的。如果你熟悉神经网络的搭建过程，应该明白梯度的重要性。而对于复杂函数的微分过程是及其麻烦的，为了提高应用效率，大部分深度学习框架都有自动微分机制。

TensorFlow 中，你可以使用 `tf.GradientTape` 跟踪全部运算过程，以便在必要的时候计算梯度。

```python
w = tf.Variable([1.0])  # 新建变量张量

with tf.GradientTape() as tape:  # 追踪梯度
    loss = w * w

grad = tape.gradient(loss, w)  # 计算梯度
grad
```

输出

```python
<tf.Tensor: id=52, shape=(1,), dtype=float32, numpy=array([2.], dtype=float32)>
```

上面，我们演示了一个自动微分过程，它的数学求导过程如下：

![](https://gitee.com/veal98/images/raw/master/img/20201031220048.png)

所以，当 w 等于 1 时，计算结果为 2。

⭐ **`tf.GradientTape` 会像磁带一样记录下计算图中的梯度信息，然后使用 `.gradient` 即可回溯计算出任意梯度**，这对于使用 TensorFlow 低阶 API 构建神经网络时更新参数非常重要。

## 5. 常用模块

上面，我们已经学习了 TensorFlow 核心知识，接下来将对 TensorFlow API 中的常用模块进行简单的功能介绍。对于框架的使用，实际上就是灵活运用各种封装好的类和函数。由于 TensorFlow API 数量太多，迭代太快，所以大家要养成随时 查阅官方文档 的习惯。

- `tf.`：包含了张量定义，变换等常用函数和类。
- `tf.data`：输入数据处理模块，提供了像 `tf.data.Dataset` 等类用于封装输入数据，指定批量大小等。
- `tf.image`：图像处理模块，提供了像图像裁剪，变换，编码，解码等类。
- `tf.keras`：原 Keras 框架高阶 API。包含原 `tf.layers` 中高阶神经网络层。
- `tf.linalg`：线性代数模块，提供了大量线性代数计算方法和类。
- `tf.losses`：损失函数模块，用于方便神经网络定义损失函数。
- `tf.math`：数学计算模块，提供了大量数学计算函数。
- `tf.saved_model`：模型保存模块，可用于模型的保存和恢复。
- `tf.train`：提供用于训练的组件，例如优化器，学习率衰减策略等。
- `tf.nn`：提供用于构建神经网络的底层函数，以帮助实现深度神经网络各类功能层。
- `tf.estimator`：高阶 API，提供了预创建的 Estimator 或自定义组件。

在构建深度神经网络时，TensorFlow 可以说提供了你一切想要的组件，从不同形状的张量、激活函数、神经网络层，到优化器、数据集等，一应俱全。

## 6. Keras 

Keras 是一个用于构建和训练深度学习模型的高阶 API。它可用于快速设计原型、高级研究和生产。

keras 的 3 个优点： 方便用户使用、模块化和可组合、易于扩展

tensorflow 2 推荐使用 keras 构建网络，常见的神经网络都包含在 `keras.layer` 中(最新的 `tf.keras` 的版本可能和 `keras` 不同)

```python
import tensorflow as tf
from tensorflow.keras import layers
print(tf.__version__)
print(tf.keras.__version__)
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201102214336.png" style="zoom:75%;" />

### ① 构建简单模型

最常见的模型类型是层的堆叠：`tf.keras.Sequential` 模型

```python
model = tf.keras.Sequential()
model.add(layers.Dense(32, activation='relu'))
model.add(layers.Dense(32, activation='relu'))
model.add(layers.Dense(10, activation='softmax'))
```

- 🔹 `layers.Dense `：全连接层。相当于添加一个层

- 🔹 `layers.Flatten`：Convolution 卷积层之后是无法直接连接 Dense 全连接层的，需要把 Convolution 层的数据压平（Flatten），然后就可以直接加 Dense 层了。

- 🔹 `layers.Dropout`：dropout 是指在深度学习网络的训练过程中，对于神经网络单元，按照一定的概率将其暂时从网络中丢弃，可以用来防止过拟合。

`tf.keras.layers` 中网络配置：

- `activation`：设置层的激活函数。此参数由内置函数的名称指定，或指定为可调用对象。默认情况下，系统不会应用任何激活函数。

- `kernel_initializer` 和 `bias_initializer`：创建层权重（核和偏差）的初始化方案。此参数是一个名称或可调用对象，默认为 "Glorot uniform" 初始化器。

- `kernel_regularizer` 和 `bias_regularizer`：应用层权重（核和偏差）的正则化方案，例如 L1 或 L2 正则化。默认情况下，系统不会应用正则化函数。

```python
layers.Dense(32, activation='sigmoid')
layers.Dense(32, activation=tf.sigmoid)
layers.Dense(32, kernel_initializer='orthogonal')
layers.Dense(32, kernel_initializer=tf.keras.initializers.glorot_normal)
layers.Dense(32, kernel_regularizer=tf.keras.regularizers.l2(0.01))
layers.Dense(32, kernel_regularizer=tf.keras.regularizers.l1(0.01))
```

### ② 训练和评估

构建好模型后，通过调用 `compile` 方法配置该模型的学习流程：

```python
model = tf.keras.Sequential()
model.add(layers.Dense(32, activation='relu'))
model.add(layers.Dense(32, activation='relu'))
model.add(layers.Dense(10, activation='softmax'))
model.compile(optimizer=tf.keras.optimizers.Adam(0.001), # 优化器
             loss=tf.keras.losses.categorical_crossentropy, # 损失函数
             metrics=[tf.keras.metrics.categorical_accuracy]) # 评价函数
```

**训练模型 `model.fit`**：

```python
import numpy as np

train_x = np.random.random((1000, 72))
train_y = np.random.random((1000, 10))

val_x = np.random.random((200, 72))
val_y = np.random.random((200, 10))

model.fit(train_x, train_y, epochs=10, batch_size=100,
          validation_data=(val_x, val_y))
```

`model.fit` 参数：

- `x`: 训练数据的 Numpy 数组（如果模型只有一个输入）， 或者是 Numpy 数组的列表（如果模型有多个输入）。 如果模型中的输入层被命名，你也可以传递一个字典，将输入层名称映射到 Numpy 数组。 如果从本地框架张量馈送（例如 TensorFlow 数据张量）数据，x 可以是 None（默认）。

- `y`: 目标（标签）数据的 Numpy 数组（如果模型只有一个输出）， 或者是 Numpy 数组的列表（如果模型有多个输出）。 如果模型中的输出层被命名，你也可以传递一个字典，将输出层名称映射到 Numpy 数组。 如果从本地框架张量馈送（例如 TensorFlow 数据张量）数据，y 可以是 None（默认）。

- `batch_size`: 整数或 `None`。每次梯度更新的样本数。如果未指定，默认为 32。

- `epochs`: 训练模型迭代轮次（整数）。一个轮次是在整个 x 和 y 上的一轮迭代。 请注意，与 initial_epoch 一起，epochs 被理解为 「最终轮次」。**模型并不是训练了 epochs 轮，而是到第 epochs 轮停止训练**。

- `validation_data`: 元组  `(x_val，y_val)` 或元组 `(x_val，y_val，val_sample_weights)`， **用来评估损失**，以及在每轮结束时的任何模型度量指标。 模型将不会在这个数据上进行训练。这个参数会覆盖 `validation_split`。

### ③ 图片分类实例

载入并准备好 [MNIST 数据集](http://yann.lecun.com/exdb/mnist/)。将样本从整数转换为浮点数：

> 💡 [MNIST 数据集](http://yann.lecun.com/exdb/mnist/) 常被用作计算机视觉机器学习程序的 “Hello, World”。MNIST 数据集包含手写数字（0、1、2 等）的图像

```python
mnist = tf.keras.datasets.mnist

(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0
```

将模型的各层堆叠起来，以搭建 [`tf.keras.Sequential`](https://tensorflow.google.cn/api_docs/python/tf/keras/Sequential?hl=zh_cn) 模型。为训练选择优化器和损失函数：

```python
model = tf.keras.models.Sequential([
  tf.keras.layers.Flatten(input_shape=(28, 28)),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam', # 优化器
              loss='sparse_categorical_crossentropy', # 损失函数
              metrics=['accuracy']) # 评价指标
```

训练并验证模型：

```python
model.fit(x_train, y_train, epochs=5)
model.evaluate(x_test,  y_test, verbose=2)
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201102223621.png" style="zoom:80%;" />

现在，这个照片分类器的准确度已经达到 98%

## 📚 References

- [《纯小白 》win10 安装 tensorflow，并运行在 jupyter notebook 上](https://blog.csdn.net/weixin_41640583/article/details/86534358?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.add_param_isCf&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.add_param_isCf)
- [TensorFlow 2 快速教程，初学者入门必备](https://zhuanlan.zhihu.com/p/88829655)