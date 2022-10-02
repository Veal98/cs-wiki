# 🛸 Keras 网络层

---

```python
import tensorflow
from tensorflow import keras
```

## 1. Dense 全连接层

```python
keras.layers.Dense(units, activation=None, use_bias=True, kernel_initializer='glorot_uniform', bias_initializer='zeros', kernel_regularizer=None, bias_regularizer=None, activity_regularizer=None, kernel_constraint=None, bias_constraint=None)
```

就是你常用的的全连接层。

`Dense` 实现以下操作：`output = activation(dot(input, kernel) + bias)` 其中 `activation` 是按逐个元素计算的激活函数，`kernel` 是由网络层创建的权值矩阵，以及 `bias` 是其创建的偏置向量 (只在 `use_bias` 为 `True` 时才有用)。

- **注意**: 如果该层的输入的秩大于 2，那么它首先被展平然后 再计算与 `kernel` 的点乘。

**示例**

```python
# 作为 Sequential 模型的第一层
model = keras.model.Sequential()
model.add(keras.layers.Dense(32, input_shape=(16,)))
# 现在模型就会以尺寸为 (*, 16) 的数组作为输入，
# 其输出数组的尺寸为 (*, 32)

# 在第一层之后，你就不再需要指定输入的尺寸了：
model.add(keras.layers.Dense(32))
```

**参数**

- **units**: 正整数，输出空间维度。
- **activation**: 激活函数 (详见 [activations](https://keras-zh.readthedocs.io/activations/))。 若不指定，则不使用激活函数 (即，线性激活: `a(x) = x`)。
- **use_bias**: 布尔值，该层是否使用偏置向量。
- **kernel_initializer**: `kernel` 权值矩阵的初始化器 (详见 [initializers](https://keras-zh.readthedocs.io/initializers/))。
- **bias_initializer**: 偏置向量的初始化器 (详见 [initializers](https://keras-zh.readthedocs.io/initializers/))。
- **kernel_regularizer**: 运用到 `kernel` 权值矩阵的正则化函数 (详见 [regularizer](https://keras-zh.readthedocs.io/regularizers/))。
- **bias_regularizer**: 运用到偏置向量的的正则化函数 (详见 [regularizer](https://keras-zh.readthedocs.io/regularizers/))。
- **activity_regularizer**: 运用到层的输出的正则化函数 (它的 "activation")。 (详见 [regularizer](https://keras-zh.readthedocs.io/regularizers/))。
- **kernel_constraint**: 运用到 `kernel` 权值矩阵的约束函数 (详见 [constraints](https://keras-zh.readthedocs.io/constraints/))。
- **bias_constraint**: 运用到偏置向量的约束函数 (详见 [constraints](https://keras-zh.readthedocs.io/constraints/))。

**输入尺寸**

nD 张量，尺寸: `(batch_size, ..., input_dim)`。 最常见的情况是一个尺寸为 `(batch_size, input_dim)` 的 2D 输入。

**输出尺寸**

nD 张量，尺寸: `(batch_size, ..., units)`。 例如，对于尺寸为 `(batch_size, input_dim)` 的 2D 输入， 输出的尺寸为 `(batch_size, units)`。

## 2. Activation

```python
keras.layers.Activation(activation)
```

将激活函数应用于输出。

**参数**

- **activation**: 要使用的激活函数的名称 (比如 `softmax, relu, tanh`, 详见: [activations](https://keras-zh.readthedocs.io/activations/))

**输入尺寸**

任意尺寸。 当使用此层作为模型中的第一层时， 使用参数 `input_shape` （整数元组，不包括样本数的轴）。

**输出尺寸**

与输入相同。

**示例**

```python
keras.layers.Activation('softmax')
```

> 💡 相比于这种写法，可以直接使用**高级激活层**:
>
> ```python
> keras.layers.Softmax()
> ```

## 3. Dropout

```python
keras.layers.Dropout(rate, noise_shape=None, seed=None)
```

将 Dropout 应用于输入。

<u>Dropout 包括在训练中每次更新时， 将输入单元的按比率随机设置为 0（即随机舍弃一定比例的权重/参数）， 这有助于防止过拟合。</u>

**参数**

- **rate**: 在 0 和 1 之间浮动。需要丢弃的输入比例。
- **noise_shape**: 1D 整数张量， 表示将与输入相乘的二进制 dropout 掩层的形状。 例如，如果你的输入尺寸为 `(batch_size, timesteps, features)`，然后 你希望 dropout 掩层在所有时间步都是一样的， 你可以使用 `noise_shape=(batch_size, 1, features)`。
- **seed**: 一个作为随机种子的 Python 整数。

## 4. Flatten

```python
keras.layers.Flatten(data_format=None)
```

将输入展平。不影响批量大小。

**参数**

- **data_format**：一个字符串，其值为 `channels_last`（默认值）或者 `channels_first`。它表明输入的维度的顺序。此参数的目的是当模型从一种数据格式切换到另一种数据格式时保留权重顺序。`channels_last` 对应着尺寸为 `(batch, ..., channels)` 的输入，而 `channels_first` 对应着尺寸为 `(batch, channels, ...)` 的输入。默认为 `image_data_format` 的值，你可以在 Keras 的配置文件 `~/.keras/keras.json` 中找到它。如果你从未设置过它，那么它将是 `channels_last`

**示例**

```python
model = keras.model.Sequential()
model.add(Conv2D(64, (3, 3),
                 input_shape=(3, 32, 32), padding='same',))
# 现在：model.output_shape == (None, 64, 32, 32)

model.add(Flatten())
# 现在：model.output_shape == (None, 65536)
```

## 5. Input

```python
keras.layers.Input()
```

`Input()` 用于实例化 Keras 张量。

Keras 张量是底层后端(Theano, TensorFlow 或 CNTK) 的张量对象，我们增加了一些特性，使得能够通过了解模型的输入 和输出来构建 Keras 模型。

例如，如果 a, b 和 c 都是 Keras 张量， 那么以下操作是可行的： `model = Model(input=[a, b], output=c)`

添加的 Keras 属性是：

- **`_keras_shape`**: 通过 Keras端的尺寸推理 进行传播的整数尺寸元组。
- **`_keras_history`**: 应用于张量的最后一层。 整个网络层计算图可以递归地从该层中检索。

**参数**

- **shape**: 一个尺寸元组（整数），不包含批量大小。 例如，`shape=(32,)` 表明期望的输入是按批次的 32 维向量。
- **batch_shape**: 一个尺寸元组（整数），包含批量大小。 例如，`batch_shape=(10, 32)` 表明期望的输入是 10 个 32 维向量。 `batch_shape=(None, 32)` 表明任意批次大小的 32 维向量。
- **name**: 一个可选的层的名称的字符串。 在一个模型中应该是唯一的（不可以重用一个名字两次）。 如未提供，将自动生成。
- **dtype**: 输入所期望的数据类型，字符串表示 (`float32`, `float64`, `int32`...)
- **sparse**: 一个布尔值，指明需要创建的占位符是否是稀疏的。
- **tensor**: 可选的可封装到 `Input` 层的现有张量。 如果设定了，那么这个层将不会创建占位符张量。

**返回**

一个张量。

**示例**

```python
# 这是 Keras 中的一个逻辑回归
x = keras.layers.Input(shape=(32,))
y = keras.layers.Dense(16, activation='softmax')(x)
model = Model(x, y)
```

## 6. Lambda

```python
keras.layers.Lambda(function, output_shape=None, mask=None, arguments=None)
```

<u>将任意表达式封装为 `Layer` 对象</u>。

**示例**

```python
# 添加一个 x -> x^2 层
keras.model.add(Lambda(lambda x: x ** 2))
# 添加一个网络层，返回输入的正数部分
# 与负数部分的反面的连接

def antirectifier(x):
    x -= K.mean(x, axis=1, keepdims=True)
    x = K.l2_normalize(x, axis=1)
    pos = K.relu(x)
    neg = K.relu(-x)
    return K.concatenate([pos, neg], axis=1)

def antirectifier_output_shape(input_shape):
    shape = list(input_shape)
    assert len(shape) == 2  # only valid for 2D tensors
    shape[-1] *= 2
    return tuple(shape)

model.add(Lambda(antirectifier,
                 output_shape=antirectifier_output_shape))
# 添加一个返回 hadamard 乘积和两个输入张量之和的层

def hadamard_product_sum(tensors):
    out1 = tensors[0] * tensors[1]
    out2 = K.sum(out1, axis=-1)
    return [out1, out2]

def hadamard_product_sum_output_shape(input_shapes):
    shape1 = list(input_shapes[0])
    shape2 = list(input_shapes[1])
    assert shape1 == shape2  # 否则无法得到 hadamard 乘积
    return [tuple(shape1), tuple(shape2[:-1])]

x1 = keras.layers.Dense(32)(input_1)
x2 = keras.layers.Dense(32)(input_2)
layer = keras.layers.Lambda(hadamard_product_sum, hadamard_product_sum_output_shape)
x_hadamard, x_sum = layer([x1, x2])
```

**参数**

- **function**: 需要封装的函数。 将输入张量或张量序列作为第一个参数。
- **output_shape**: 预期的函数输出尺寸。 只在使用 Theano 时有意义。 可以是元组或者函数。 如果是元组，它只指定第一个维度； 样本维度假设与输入相同： `output_shape = (input_shape[0], ) + output_shape` 或者，输入是 `None` 且样本维度也是 `None`： `output_shape = (None, ) + output_shape` 如果是函数，它指定整个尺寸为输入尺寸的一个函数： `output_shape = f(input_shape)`
- **mask**: 要么是 None (表示无 masking)，要么是一个张量表示用于 Embedding 的输入 mask。
- **arguments**: 可选的需要传递给函数的关键字参数。

**输入尺寸**

任意。当使用此层作为模型中的第一层时， 使用参数 `input_shape` （整数元组，不包括样本数的轴）。

**输出尺寸**

由 `output_shape` 参数指定 (或者在使用 TensorFlow 时，自动推理得到)。

## 7. 卷积层 Convolutional Layers

### ① Conv1D

```python
keras.layers.Conv1D(filters, kernel_size, strides=1, padding='valid', data_format='channels_last', dilation_rate=1, activation=None, use_bias=True, kernel_initializer='glorot_uniform', bias_initializer='zeros', kernel_regularizer=None, bias_regularizer=None, activity_regularizer=None, kernel_constraint=None, bias_constraint=None)
```

1D 卷积层 (例如时序卷积)。

<u>该层创建了一个卷积核，该卷积核以 单个空间（或时间）维上的层输入进行卷积， 以生成输出张量</u>。 如果 `use_bias` 为 True， 则会创建一个偏置向量并将其添加到输出中。 最后，如果 `activation` 不是 `None`，它也会应用于输出。

<u>当使用该层作为模型第一层时，需要提供 `input_shape` 参数</u>（整数元组或 `None`，不包含 batch 轴）， 例如，`input_shape=(10, 128)` 在 `data_format="channels_last"` 时表示 10 个 128 维的向量组成的向量序列， `(None, 128)` 表示每步 128 维的向量组成的变长序列。

**参数**

- **filters**: 整数，输出空间的维度 （即卷积中滤波器的输出数量）。
- **kernel_size**: 一个整数，或者单个整数表示的元组或列表， 指明 1D 卷积窗口的长度。
- **strides**: 一个整数，或者单个整数表示的元组或列表， 指明卷积的步长。 指定任何 stride 值 != 1 与指定 `dilation_rate` 值 != 1 两者不兼容。
- **padding**: `"valid"`, `"causal"` 或 `"same"` 之一 (大小写敏感) `"valid"` 表示「不填充」。 `"same"` 表示填充输入以使输出具有与原始输入相同的长度。 `"causal"` 表示因果（膨胀）卷积， 例如，`output[t]` 不依赖于 `input[t+1:]`， 在模型不应违反时间顺序的时间数据建模时非常有用。 
- **data_format**: 字符串, `"channels_last"` (默认) 或 `"channels_first"` 之一。输入的各个维度顺序。 `"channels_last"` 对应输入尺寸为 `(batch, steps, channels)` (Keras 中时序数据的默认格式) 而 `"channels_first"` 对应输入尺寸为 `(batch, channels, steps)`。
- **dilation_rate**: 一个整数，或者单个整数表示的元组或列表，指定用于膨胀卷积的膨胀率。 当前，指定任何 `dilation_rate` 值 != 1 与指定 stride 值 != 1 两者不兼容。
- **activation**: 要使用的激活函数 (详见 [activations](https://keras-zh.readthedocs.io/activations/))。 如未指定，则不使用激活函数 (即线性激活： `a(x) = x`)。
- **use_bias**: 布尔值，该层是否使用偏置向量。
- **kernel_initializer**: `kernel` 权值矩阵的初始化器 (详见 [initializers](https://keras-zh.readthedocs.io/initializers/))。
- **bias_initializer**: 偏置向量的初始化器 (详见 [initializers](https://keras-zh.readthedocs.io/initializers/))。
- **kernel_regularizer**: 运用到 `kernel` 权值矩阵的正则化函数 (详见 [regularizer](https://keras-zh.readthedocs.io/regularizers/))。
- **bias_regularizer**: 运用到偏置向量的正则化函数 (详见 [regularizer](https://keras-zh.readthedocs.io/regularizers/))。
- **activity_regularizer**: 运用到层输出（它的激活值）的正则化函数 (详见 [regularizer](https://keras-zh.readthedocs.io/regularizers/))。
- **kernel_constraint**: 运用到 `kernel` 权值矩阵的约束函数 (详见 [constraints](https://keras-zh.readthedocs.io/constraints/))。
- **bias_constraint**: 运用到偏置向量的约束函数 (详见 [constraints](https://keras-zh.readthedocs.io/constraints/))。

**输入尺寸**

3D 张量 ，尺寸为 `(batch_size, steps, input_dim)`。

**输出尺寸**

3D 张量，尺寸为 `(batch_size, new_steps, filters)`。 由于填充或窗口按步长滑动，`steps` 值可能已更改。

### ② Conv2D

```python
keras.layers.Conv2D(filters, kernel_size, strides=(1, 1), padding='valid', data_format=None, dilation_rate=(1, 1), activation=None, use_bias=True, kernel_initializer='glorot_uniform', bias_initializer='zeros', kernel_regularizer=None, bias_regularizer=None, activity_regularizer=None, kernel_constraint=None, bias_constraint=None)
```

2D 卷积层 (例如对图像的空间卷积)。

<u>该层创建了一个卷积核， 该卷积核对层输入进行卷积， 以生成输出张量</u>。 如果 `use_bias` 为 True， 则会创建一个偏置向量并将其添加到输出中。 最后，如果 `activation` 不是 `None`，它也会应用于输出。

<u>当使用该层作为模型第一层时，需要提供 `input_shape` 参数</u> （整数元组，不包含 batch 轴），例如， `input_shape=(128, 128, 3)` 表示 128x128 RGB 图像， 在 `data_format="channels_last"` 时。

**参数**

- **filters**: 整数，输出空间的维度 （即卷积中滤波器的输出数量）。
- **kernel_size**: 一个整数，或者 2 个整数表示的元组或列表， 指明 2D 卷积窗口的宽度和高度。 可以是一个整数，为所有空间维度指定相同的值。
- **strides**: 一个整数，或者 2 个整数表示的元组或列表， 指明卷积沿宽度和高度方向的步长。 可以是一个整数，为所有空间维度指定相同的值。 指定任何 stride 值 != 1 与指定 `dilation_rate` 值 != 1 两者不兼容。
- **padding**: `"valid"` 或 `"same"` (大小写敏感)。
- **data_format**: 字符串， `channels_last` (默认) 或 `channels_first` 之一，表示输入中维度的顺序。 `channels_last` 对应输入尺寸为 `(batch, height, width, channels)`， `channels_first` 对应输入尺寸为 `(batch, channels, height, width)`。 它默认为从 Keras 配置文件 `~/.keras/keras.json` 中 找到的 `image_data_format` 值。 如果你从未设置它，将使用 `channels_last`。
- **dilation_rate**: 一个整数或 2 个整数的元组或列表， 指定膨胀卷积的膨胀率。 可以是一个整数，为所有空间维度指定相同的值。 当前，指定任何 `dilation_rate` 值 != 1 与 指定 stride 值 != 1 两者不兼容。
- **activation**: 要使用的激活函数 (详见 [activations](https://keras-zh.readthedocs.io/activations/))。 如果你不指定，则不使用激活函数 (即线性激活： `a(x) = x`)。
- **use_bias**: 布尔值，该层是否使用偏置向量。
- **kernel_initializer**: `kernel` 权值矩阵的初始化器 (详见 [initializers](https://keras-zh.readthedocs.io/initializers/))。
- **bias_initializer**: 偏置向量的初始化器 (详见 [initializers](https://keras-zh.readthedocs.io/initializers/))。
- **kernel_regularizer**: 运用到 `kernel` 权值矩阵的正则化函数 (详见 [regularizer](https://keras-zh.readthedocs.io/regularizers/))。
- **bias_regularizer**: 运用到偏置向量的正则化函数 (详见 [regularizer](https://keras-zh.readthedocs.io/regularizers/))。
- **activity_regularizer**: 运用到层输出（它的激活值）的正则化函数 (详见 [regularizer](https://keras-zh.readthedocs.io/regularizers/))。
- **kernel_constraint**: 运用到 `kernel` 权值矩阵的约束函数 (详见 [constraints](https://keras-zh.readthedocs.io/constraints/))。
- **bias_constraint**: 运用到偏置向量的约束函数 (详见 [constraints](https://keras-zh.readthedocs.io/constraints/))。

**输入尺寸**

- 如果 data_format='channels_first'， 输入 4D 张量，尺寸为 `(samples, channels, rows, cols)`。
- 如果 data_format='channels_last'， 输入 4D 张量，尺寸为 `(samples, rows, cols, channels)`。

**输出尺寸**

- 如果 data_format='channels_first'， 输出 4D 张量，尺寸为 `(samples, filters, new_rows, new_cols)`。
- 如果 data_format='channels_last'， 输出 4D 张量，尺寸为 `(samples, new_rows, new_cols, filters)`。

由于填充的原因，`rows` 和 `cols` 值可能已更改。

## 8. 池化层 Pooling Layers

### ① 最大池化

#### MaxPooling1D

```python
keras.layers.MaxPooling1D(pool_size=2, strides=None, padding='valid', data_format='channels_last')
```

对于**时序数据**的最大池化。

**参数**

- **pool_size**: 整数，最大池化的窗口大小。
- **strides**: 整数，或者是 `None`。作为缩小比例的因数。 例如，2 会使得输入张量缩小一半。 如果是 `None`，那么默认值是 `pool_size`。
- **padding**: `"valid"` 或者 `"same"` （区分大小写）。
- **data_format**: 字符串，`channels_last` (默认)或 `channels_first` 之一。 表示输入各维度的顺序。 `channels_last` 对应输入尺寸为 `(batch, steps, features)`， `channels_first` 对应输入尺寸为 `(batch, features, steps)`。

**输入尺寸**

- 如果 `data_format='channels_last'`， 输入为 3D 张量，尺寸为： `(batch_size, steps, features)`
- 如果`data_format='channels_first'`， 输入为 3D 张量，尺寸为： `(batch_size, features, steps)`

**输出尺寸**

- 如果 `data_format='channels_last'`， 输出为 3D 张量，尺寸为： `(batch_size, downsampled_steps, features)`
- 如果 `data_format='channels_first'`， 输出为 3D 张量，尺寸为： `(batch_size, features, downsampled_steps)`

#### MaxPooling2D

```python
keras.layers.MaxPooling2D(pool_size=(2, 2), strides=None, padding='valid', data_format=None)
```

对于**空间数据**的最大池化。

**参数**

- **pool_size**: 整数，或者 2 个整数表示的元组， 沿（垂直，水平）方向缩小比例的因数。 （2，2）会把输入张量的两个维度都缩小一半。 如果只使用一个整数，那么两个维度都会使用同样的窗口长度。
- **strides**: 整数，2 个整数表示的元组，或者是 `None`。 表示步长值。 如果是 `None`，那么默认值是 `pool_size`。
- **padding**: `"valid"` 或者 `"same"` （区分大小写）。
- **data_format**: 字符串，`channels_last` (默认)或 `channels_first` 之一。 表示输入各维度的顺序。 `channels_last` 代表尺寸是 `(batch, height, width, channels)` 的输入张量， 而 `channels_first` 代表尺寸是 `(batch, channels, height, width)` 的输入张量。 默认值根据 Keras 配置文件 `~/.keras/keras.json` 中的 `image_data_format` 值来设置。 如果还没有设置过，那么默认值就是 "channels_last"。

**输入尺寸**

- 如果 `data_format='channels_last'`: 尺寸是 `(batch_size, rows, cols, channels)` 的 4D 张量
- 如果 `data_format='channels_first'`: 尺寸是 `(batch_size, channels, rows, cols)` 的 4D 张量

**输出尺寸**

- 如果 `data_format='channels_last'`: 尺寸是 `(batch_size, pooled_rows, pooled_cols, channels)` 的 4D 张量
- 如果 `data_format='channels_first'`: 尺寸是 `(batch_size, channels, pooled_rows, pooled_cols)` 的 4D 张量

#### MaxPooling3D

```python
keras.layers.MaxPooling3D(pool_size=(2, 2, 2), strides=None, padding='valid', data_format=None)
```

对于 **3D（空间，或时空间）**数据的最大池化。

**参数**

- **pool_size**: 3 个整数表示的元组，缩小（dim1，dim2，dim3）比例的因数。 (2, 2, 2) 会把 3D 输入张量的每个维度缩小一半。
- **strides**: 3 个整数表示的元组，或者是 `None`。步长值。
- **padding**: `"valid"` 或者 `"same"`（区分大小写）。
- **data_format**: 字符串，`channels_last` (默认)或 `channels_first` 之一。 表示输入各维度的顺序。 `channels_last` 代表尺寸是 `(batch, spatial_dim1, spatial_dim2, spatial_dim3, channels)` 的输入张量， 而 `channels_first` 代表尺寸是 `(batch, channels, spatial_dim1, spatial_dim2, spatial_dim3)` 的输入张量。 默认值根据 Keras 配置文件 `~/.keras/keras.json` 中的 `image_data_format` 值来设置。 如果还没有设置过，那么默认值就是 "channels_last"。

**输入尺寸**

- 如果 `data_format='channels_last'`: 尺寸是 `(batch_size, spatial_dim1, spatial_dim2, spatial_dim3, channels)` 的 5D 张量
- 如果 `data_format='channels_first'`: 尺寸是 `(batch_size, channels, spatial_dim1, spatial_dim2, spatial_dim3)` 的 5D 张量

**输出尺寸**

- 如果 `data_format='channels_last'`: 尺寸是 `(batch_size, pooled_dim1, pooled_dim2, pooled_dim3, channels)` 的 5D 张量
- 如果 `data_format='channels_first'`: 尺寸是 `(batch_size, channels, pooled_dim1, pooled_dim2, pooled_dim3)` 的 5D 张量

### ② 平均池化

#### AveragePooling1D

```python
keras.layers.AveragePooling1D(pool_size=2, strides=None, padding='valid', data_format='channels_last')
```

对于时序数据的平均池化。

**参数**

- **pool_size**: 整数，平均池化的窗口大小。
- **strides**: 整数，或者是 `None`。作为缩小比例的因数。 例如，2 会使得输入张量缩小一半。 如果是 `None`，那么默认值是 `pool_size`。
- **padding**: `"valid"` 或者 `"same"` （区分大小写）。
- **data_format**: 字符串，`channels_last` (默认)或 `channels_first` 之一。 表示输入各维度的顺序。 `channels_last` 对应输入尺寸为 `(batch, steps, features)`， `channels_first` 对应输入尺寸为 `(batch, features, steps)`。

**输入尺寸**

- 如果 `data_format='channels_last'`， 输入为 3D 张量，尺寸为： `(batch_size, steps, features)`
- 如果`data_format='channels_first'`， 输入为 3D 张量，尺寸为： `(batch_size, features, steps)`

**输出尺寸**

- 如果 `data_format='channels_last'`， 输出为 3D 张量，尺寸为： `(batch_size, downsampled_steps, features)`
- 如果 `data_format='channels_first'`， 输出为 3D 张量，尺寸为： `(batch_size, features, downsampled_steps)`

#### AveragePooling2D

```python
keras.layers.AveragePooling2D(pool_size=(2, 2), strides=None, padding='valid', data_format=None)
```

对于空间数据的平均池化。

**参数**

- **pool_size**: 整数，或者 2 个整数表示的元组， 沿（垂直，水平）方向缩小比例的因数。 （2，2）会把输入张量的两个维度都缩小一半。 如果只使用一个整数，那么两个维度都会使用同样的窗口长度。
- **strides**: 整数，2 个整数表示的元组，或者是 `None`。 表示步长值。 如果是 `None`，那么默认值是 `pool_size`。
- **padding**: `"valid"` 或者 `"same"` （区分大小写）。
- **data_format**: 字符串，`channels_last` (默认)或 `channels_first` 之一。 表示输入各维度的顺序。 `channels_last` 代表尺寸是 `(batch, height, width, channels)` 的输入张量， 而 `channels_first` 代表尺寸是 `(batch, channels, height, width)` 的输入张量。 默认值根据 Keras 配置文件 `~/.keras/keras.json` 中的 `image_data_format` 值来设置。 如果还没有设置过，那么默认值就是 "channels_last"。

**输入尺寸**

- 如果 `data_format='channels_last'`: 尺寸是 `(batch_size, rows, cols, channels)` 的 4D 张量
- 如果 `data_format='channels_first'`: 尺寸是 `(batch_size, channels, rows, cols)` 的 4D 张量

**输出尺寸**

- 如果 `data_format='channels_last'`: 尺寸是 `(batch_size, pooled_rows, pooled_cols, channels)` 的 4D 张量
- 如果 `data_format='channels_first'`: 尺寸是 `(batch_size, channels, pooled_rows, pooled_cols)` 的 4D 张量

#### AveragePooling3D

```python
keras.layers.AveragePooling3D(pool_size=(2, 2, 2), strides=None, padding='valid', data_format=None)
```

对于 3D （空间，或者时空间）数据的平均池化。

**参数**

- **pool_size**: 3 个整数表示的元组，缩小（dim1，dim2，dim3）比例的因数。 (2, 2, 2) 会把 3D 输入张量的每个维度缩小一半。
- **strides**: 3 个整数表示的元组，或者是 `None`。步长值。
- **padding**: `"valid"` 或者 `"same"`（区分大小写）。
- **data_format**: 字符串，`channels_last` (默认)或 `channels_first` 之一。 表示输入各维度的顺序。 `channels_last` 代表尺寸是 `(batch, spatial_dim1, spatial_dim2, spatial_dim3, channels)` 的输入张量， 而 `channels_first` 代表尺寸是 `(batch, channels, spatial_dim1, spatial_dim2, spatial_dim3)` 的输入张量。 默认值根据 Keras 配置文件 `~/.keras/keras.json` 中的 `image_data_format` 值来设置。 如果还没有设置过，那么默认值就是 "channels_last"。

**输入尺寸**

- 如果 `data_format='channels_last'`: 尺寸是 `(batch_size, spatial_dim1, spatial_dim2, spatial_dim3, channels)` 的 5D 张量
- 如果 `data_format='channels_first'`: 尺寸是 `(batch_size, channels, spatial_dim1, spatial_dim2, spatial_dim3)` 的 5D 张量

**输出尺寸**

- 如果 `data_format='channels_last'`: 尺寸是 `(batch_size, pooled_dim1, pooled_dim2, pooled_dim3, channels)` 的 5D 张量
- 如果 `data_format='channels_first'`: 尺寸是 `(batch_size, channels, pooled_dim1, pooled_dim2, pooled_dim3)` 的 5D 张量

### ③ 全局最大池化

#### GlobalMaxPooling1D

```python
keras.layers.GlobalMaxPooling1D(data_format='channels_last')
```

对于时序数据的全局最大池化。

**参数**

- **data_format**: 字符串，`channels_last` (默认)或 `channels_first` 之一。 表示输入各维度的顺序。 `channels_last` 对应输入尺寸为 `(batch, steps, features)`， `channels_first` 对应输入尺寸为 `(batch, features, steps)`。

**输入尺寸**

尺寸是 `(batch_size, steps, features)` 的 3D 张量。

**输出尺寸**

尺寸是 `(batch_size, features)` 的 2D 张量。

#### GlobalMaxPooling2D

```python
keras.layers.GlobalMaxPooling2D(data_format=None)
```

对于空域数据的全局最大池化。

**参数**

- **data_format**: 字符串，`channels_last` (默认)或 `channels_first` 之一。 表示输入各维度的顺序。 `channels_last` 代表尺寸是 `(batch, height, width, channels)` 的输入张量， 而 `channels_first` 代表尺寸是 `(batch, channels, height, width)` 的输入张量。 默认值根据 Keras 配置文件 `~/.keras/keras.json` 中的 `image_data_format` 值来设置。 如果还没有设置过，那么默认值就是 "channels_last"。

**输入尺寸**

- 如果 `data_format='channels_last'`: 尺寸是 `(batch_size, rows, cols, channels)` 的 4D 张量
- 如果 `data_format='channels_first'`: 尺寸是 `(batch_size, channels, rows, cols)` 的 4D 张量

**输出尺寸**

尺寸是 `(batch_size, channels)` 的 2D 张量

#### GlobalMaxPooling3D

```python
keras.layers.GlobalMaxPooling3D(data_format=None)
```

对于 3D 数据的全局最大池化。

**参数**

- **data_format**: 字符串，`channels_last` (默认)或 `channels_first` 之一。 表示输入各维度的顺序。 `channels_last` 代表尺寸是 `(batch, spatial_dim1, spatial_dim2, spatial_dim3, channels)` 的输入张量， 而 `channels_first` 代表尺寸是 `(batch, channels, spatial_dim1, spatial_dim2, spatial_dim3)` 的输入张量。 默认值根据 Keras 配置文件 `~/.keras/keras.json` 中的 `image_data_format` 值来设置。 如果还没有设置过，那么默认值就是 "channels_last"。

**输入尺寸**

- 如果 `data_format='channels_last'`: 尺寸是 `(batch_size, spatial_dim1, spatial_dim2, spatial_dim3, channels)` 的 5D 张量
- 如果 `data_format='channels_first'`: 尺寸是 `(batch_size, channels, spatial_dim1, spatial_dim2, spatial_dim3)` 的 5D 张量

**输出尺寸**

尺寸是 `(batch_size, channels)` 的 2D 张量

### ④ 全局平均池化

#### GlobalAveragePooling1D

```python
keras.layers.GlobalAveragePooling1D()
```

对于时序数据的全局平均池化。

**输入尺寸**

- 如果 `data_format='channels_last'`， 输入为 3D 张量，尺寸为： `(batch_size, steps, features)`
- 如果`data_format='channels_first'`， 输入为 3D 张量，尺寸为： `(batch_size, features, steps)`

**输出尺寸**

尺寸是 `(batch_size, features)` 的 2D 张量。

#### GlobalAveragePooling2D

```
keras.layers.GlobalAveragePooling2D(data_format=None)
```

对于空域数据的全局平均池化。

**参数**

- **data_format**: 一个字符串，`channels_last` （默认值）或者 `channels_first`。 输入张量中的维度顺序。 `channels_last` 代表尺寸是 `(batch, height, width, channels)` 的输入张量，而 `channels_first` 代表尺寸是 `(batch, channels, height, width)` 的输入张量。 默认值根据 Keras 配置文件 `~/.keras/keras.json` 中的 `image_data_format` 值来设置。 如果还没有设置过，那么默认值就是 "channels_last"。

**输入尺寸**

- 如果 `data_format='channels_last'`: 尺寸是 `(batch_size, rows, cols, channels)` 的 4D 张量
- 如果 `data_format='channels_first'`: 尺寸是 `(batch_size, channels, rows, cols)` 的 4D 张量

**输出尺寸**

尺寸是 `(batch_size, channels)` 的 2D 张量

#### GlobalAveragePooling3D

```
keras.layers.GlobalAveragePooling3D(data_format=None)
```

对于 3D 数据的全局平均池化。

**参数**

- **data_format**: 字符串，`channels_last` (默认)或 `channels_first` 之一。 表示输入各维度的顺序。 `channels_last` 代表尺寸是 `(batch, spatial_dim1, spatial_dim2, spatial_dim3, channels)` 的输入张量， 而 `channels_first` 代表尺寸是 `(batch, channels, spatial_dim1, spatial_dim2, spatial_dim3)` 的输入张量。 默认值根据 Keras 配置文件 `~/.keras/keras.json` 中的 `image_data_format` 值来设置。 如果还没有设置过，那么默认值就是 "channels_last"。

**输入尺寸**

- 如果 `data_format='channels_last'`: 尺寸是 `(batch_size, spatial_dim1, spatial_dim2, spatial_dim3, channels)` 的 5D 张量
- 如果 `data_format='channels_first'`: 尺寸是 `(batch_size, channels, spatial_dim1, spatial_dim2, spatial_dim3)` 的 5D 张量

**输出尺寸**

尺寸是 `(batch_size, channels)` 的 2D 张量

## 9. 嵌入层 Embedding Layers

```python
keras.layers.Embedding(input_dim, output_dim, embeddings_initializer='uniform', embeddings_regularizer=None, activity_regularizer=None, embeddings_constraint=None, mask_zero=False, input_length=None)
```

将正整数（索引值）转换为固定尺寸的稠密向量。 例如： `[[4], [20]] -> [[0.25, 0.1], [0.6, -0.2]]`

<u>该层只能用作模型中的第一层</u>。

**示例**

```python
model = keras.model.Sequential()
model.add(keras.layers.Embedding(1000, 64, input_length=10))
# 模型将输入一个大小为 (batch, input_length) 的整数矩阵。
# 输入中最大的整数（即词索引）不应该大于 999 （词汇表大小）
# 现在 model.output_shape == (None, 10, 64)，其中 None 是 batch 的维度。

input_array = np.random.randint(1000, size=(32, 10))

model.compile('rmsprop', 'mse')
output_array = model.predict(input_array)
assert output_array.shape == (32, 10, 64)
```

**参数**

- **input_dim**: int > 0。词汇表大小， 即，最大整数 index + 1。
- **output_dim**: int >= 0。词向量的维度。
- **embeddings_initializer**: `embeddings` 矩阵的初始化方法 (详见 [initializers](https://keras-zh.readthedocs.io/initializers/))。
- **embeddings_regularizer**: `embeddings` matrix 的正则化方法 (详见 [regularizer](https://keras-zh.readthedocs.io/regularizers/))。
- **activity_regularizer**: 应用到层输出的正则化函数 (它的 "activation")。 (详见 [regularizer](https://keras-zh.readthedocs.io/regularizers/))。
- **embeddings_constraint**: `embeddings` matrix 的约束函数 (详见 [constraints](https://keras-zh.readthedocs.io/constraints/))。
- **mask_zero**: 是否把 0 看作为一个应该被遮蔽的特殊的 "padding" 值。 这对于可变长的[循环神经网络层](https://keras-zh.readthedocs.io/layers/recurrent/) 十分有用。 如果设定为 `True`，那么接下来的所有层都必须支持 masking，否则就会抛出异常。 如果 mask_zero 为 `True`，作为结果，索引 0 就不能被用于词汇表中 （input_dim 应该与 vocabulary + 1 大小相同）。
- **input_length**: 输入序列的长度，当它是固定的时。 如果你需要连接 `Flatten` 和 `Dense` 层，则这个参数是必须的 （没有它，dense 层的输出尺寸就无法计算）。

**输入尺寸**

尺寸为 `(batch_size, sequence_length)` 的 2D 张量。

**输出尺寸**

尺寸为 `(batch_size, sequence_length, output_dim)` 的 3D 张量。

## 10. 高级激活层

### Softmax

```python
keras.layers.Softmax(axis=-1)
```

Softmax 激活函数。

**输入尺寸**

可以是任意的。<u>如果将这一层作为模型的第一层， 则需要指定 `input_shape` 参数</u> （整数元组，不包含样本数量的维度）。

**输出尺寸**

与输入相同。

**参数**

- **axis**: 整数，应用 softmax 标准化的轴。

### ReLU

```python
keras.layers.ReLU(max_value=None, negative_slope=0.0, threshold=0.0)
```

ReLU 激活函数。

使用默认值时，它返回逐个元素的 `max(x，0)`。

否则：

- 如果 `x >= max_value`，返回 `f(x) = max_value`，
- 如果 `threshold <= x < max_value`，返回 `f(x) = x`,
- 否则，返回 `f(x) = negative_slope * (x - threshold)`。

**输入尺寸**

可以是任意的。<u>如果将这一层作为模型的第一层， 则需要指定 `input_shape` 参数</u> （整数元组，不包含样本数量的维度）。

**输出尺寸**

与输入相同。

**参数**

- **max_value**: 浮点数，最大的输出值。
- **negative_slope**: float >= 0. 负斜率系数。
- **threshold**: float。"thresholded activation" 的阈值。

## 📚 References

- [TensorFlow 2 官方文档](https://tensorflow.google.cn/tutorials/keras/classification?hl=zh_cn)
- [Keras 官方文档](https://keras-zh.readthedocs.io/models/model/)
- [TensorFlow 2 官方指南](https://tensorflow.google.cn/guide/tensor?hl=zh_cn#%E6%93%8D%E4%BD%9C%E5%BD%A2%E7%8A%B6)