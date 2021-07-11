# ☕ 序贯/顺序模型 The Sequential model

---

```python
import tensorflow
form tensorflow import keras
```

## 1. Keras 模型概述

在 Keras 中有两类主要的模型：[Sequential 顺序模型](https://keras-zh.readthedocs.io/models/sequential) 和 [使用函数式 API 的 Model 类模型](https://keras-zh.readthedocs.io/models/model)。

这些模型有许多共同的方法和属性：

- `model.layers` 是包含模型网络层的展平列表。
- `model.inputs` 是模型输入张量的列表。
- `model.outputs` 是模型输出张量的列表。
- `model.summary()` 打印出模型概述信息。 它是 [utils.print_summary](https://keras-zh.readthedocs.io/utils/#print_summary) 的简捷调用。
- `model.get_weights()` 返回模型中所有权重张量的列表，类型为 Numpy 数组。
- `model.set_weights(weights)` 从 Numpy 数组中为模型设置权重。列表中的数组必须与 `get_weights()` 返回的权重具有相同的尺寸。
- `model.save_weights(filepath)` 将模型权重存储为 HDF5 文件。
- `model.load_weights(filepath, by_name=False)`: 从 HDF5 文件（由 `save_weights` 创建）中加载权重。默认情况下，模型的结构应该是不变的。 如果想将权重载入不同的模型（部分层相同）， 设置 `by_name=True` 来载入那些名字相同的层的权重。

## 2. 什么时候使用 Sequential

A `Sequential` model is appropriate for **a plain stack of layers** where each layer has **exactly one input tensor and one output tensor**.

Schematically, the following `Sequential` model：

```python
# Define Sequential model with 3 layers
model = keras.Sequential(
    [
        layers.Dense(2, activation="relu", name="layer1"),
        layers.Dense(3, activation="relu", name="layer2"),
        layers.Dense(4, name="layer3"),
    ]
)
# Call model on a test input
x = tf.ones((3, 3))
y = model(x)
```

> 💡 上面的写法等价于下面这个函数 `y = layer3(layer2(layer1(x)))`:
>
> ```python
> # Create 3 layers
> layer1 = layers.Dense(2, activation="relu", name="layer1")
> layer2 = layers.Dense(3, activation="relu", name="layer2")
> layer3 = layers.Dense(4, name="layer3")
> 
> # Call layers on a test input
> x = tf.ones((3, 3))
> y = layer3(layer2(layer1(x)))
> ```

A Sequential model is **not appropriate** when:

- Your model has multiple inputs or multiple outputs
- Any of your layers has multiple inputs or multiple outputs
- You need to do layer sharing
- You want non-linear topology (e.g. a residual connection, a multi-branch model)

## 3. 创建 Sequential 模型

You can create a Sequential model by passing **一个 layes 数组** to the Sequential constructor `keras.Sequential`:

```python
model = keras.Sequential(
    [
        layers.Dense(2, activation="relu"),
        layers.Dense(3, activation="relu"),
        layers.Dense(4),
    ]
)
```

Its layers are accessible via the `layers` attribute:

```python
model.layers
[<tensorflow.python.keras.layers.core.Dense at 0x7f7d1d5c7898>,
 <tensorflow.python.keras.layers.core.Dense at 0x7f7d2f6e0a20>,
 <tensorflow.python.keras.layers.core.Dense at 0x7f7d16beb9b0>]
```

也可通过 `add()` 方法创建 Sequential 模型:

```python
model = keras.Sequential()
model.add(layers.Dense(2, activation="relu"))
model.add(layers.Dense(3, activation="relu"))
model.add(layers.Dense(4))
```

通过 `pop` 方法移除模型中的一层：

```python
model.pop()
print(len(model.layers))  # 2
2
```

你可以通过 `name` 属性为层命名。This is useful to annotate TensorBoard graphs with semantically meaningful names：

```python
model = keras.Sequential(name="my_sequential")
model.add(layers.Dense(2, activation="relu", name="layer1"))
model.add(layers.Dense(3, activation="relu", name="layer2"))
model.add(layers.Dense(4, name="layer3"))
```

## 4. 提前指定输入层形状

### ① weights 何时被创建

Generally, <u>all layers in Keras need to know the shape of their inputs in order to be able to create their 参数/权重 weights</u>. So when you create a layer like this, initially, it has no weights:

```python
layer = layers.Dense(3)
layer.weights  # Empty
[]
```

**第一次在输入上调用时创建权重, 因为参数/权重 weights 的形状 shape 依赖于输入的形状**:

```python
# Call layer on a test input
x = tf.ones((1, 4))
y = layer(x)
layer.weights  # Now it has weights, of shape (4, 3) and (3,)
[<tf.Variable 'dense_6/kernel:0' shape=(4, 3) dtype=float32, numpy=
 array([[-0.06262648,  0.36915624, -0.27826005],
        [-0.6703571 , -0.03467071,  0.80370367],
        [-0.00725174,  0.19120002,  0.34244013],
        [-0.20762473, -0.31104177, -0.26624495]], dtype=float32)>,
 <tf.Variable 'dense_6/bias:0' shape=(3,) dtype=float32, numpy=array([0., 0., 0.], dtype=float32)>]
```

Sequential 模型同样如此. When you instantiate (实例化) a Sequential model without an input shape, it isn't "`built`": it has no weights (and calling `model.weights` results in an error stating just this). ⭐ **The weights are created when the model first sees some input data**：

```python
model = keras.Sequential(
    [
        layers.Dense(2, activation="relu"),
        layers.Dense(3, activation="relu"),
        layers.Dense(4),
    ]
)  # No weights at this stage!

# At this point, you can't do this:
# model.weights

# You also can't do this:
# model.summary()

# Call the model on a test input
x = tf.ones((1, 4))
y = model(x)
print("Number of weights after calling the model:", len(model.weights))  # 6
Number of weights after calling the model: 6
```

<u>Once a model is "`built`", you can call its `summary()` method to display its contents</u>:

```python
model.summary()

Model: "sequential_3"
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
dense_7 (Dense)              (1, 2)                    10        
_________________________________________________________________
dense_8 (Dense)              (1, 3)                    9         
_________________________________________________________________
dense_9 (Dense)              (1, 4)                    16        
=================================================================
Total params: 35
Trainable params: 35
Non-trainable params: 0
_________________________________________________________________
```

### ② 提前指定输入层形状

但是，当逐步构建顺序模型时，能够显示到目前为止的模型摘要（包括当前输出形状）非常有用。 在这种情况下，**您应该通过向模型传递一个 `Input` 对象来启动模型，以便从一开始就知道其输入形状**：

```python
model = keras.Sequential()
model.add(keras.Input(shape=(4,)))
model.add(layers.Dense(2, activation="relu"))

model.summary()
Model: "sequential_4"
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
dense_10 (Dense)             (None, 2)                 10        
=================================================================
Total params: 10
Trainable params: 10
Non-trainable params: 0
_________________________________________________________________
```

🚨 **请注意，``Input` 对象不会显示为“ `model.layers`”的一部分，因为它不是层**:

```python
model.layers
[<tensorflow.python.keras.layers.core.Dense at 0x7f7d16b870f0>]
```

一个更简洁的方法是将 “ `input_shape`”参数传递给您的第一层:

```python
model = keras.Sequential()
model.add(layers.Dense(2, activation="relu", input_shape=(4,))) # (4,) 表示输入的形状

model.summary()
Model: "sequential_5"
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
dense_11 (Dense)             (None, 2)                 10        
=================================================================
Total params: 10
Trainable params: 10
Non-trainable params: 0
_________________________________________________________________
```

使用这样的预定义输入形状构建的模型始终具有权重（甚至在查看任何数据之前），并且始终具有定义的输出形状。

👍 In general, it's a recommended best practice to <u>always specify the input shape of a Sequential model in advance if you know what it is</u>.

## 📚 References

- [TensorFlow 2 官方文档](https://tensorflow.google.cn/tutorials/keras/classification?hl=zh_cn)
- [Keras 官方文档](https://keras-zh.readthedocs.io/models/model/)
- [TensorFlow 2 官方指南](https://tensorflow.google.cn/guide/tensor?hl=zh_cn#%E6%93%8D%E4%BD%9C%E5%BD%A2%E7%8A%B6)