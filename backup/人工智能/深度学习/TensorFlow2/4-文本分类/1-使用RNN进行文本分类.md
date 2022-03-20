# 🍏 使用循环神经网络 RNN 进行文本分类

---

## 1. RNN 概述

`循环神经网络(Recurrent Neural Network, RNN)` 广泛适用于自然语言处理领域 (Natural Language Processing, NLP)，RNN 有什么显著的特点呢？普通的神经网络，每一层的输出是下一层的输入，每一层之间是相互独立的，没有关系。但是对于语言来说，一句话中的单词顺序不同，整个语义就完全变了。因此自然语言处理往往需要能够更好地处理序列信息的神经网络，RNN 能够满足这个需求。

**RNN 中隐藏层的状态不仅取决于当前输入层的输出，还和上一步隐藏层的状态有关**。

长短期记忆模型(Long short-term memory, LSTM)是一种特殊的RNN，主要是为了解决长序列训练过程中的梯度消失和梯度爆炸问题。简单来说，就是相比普通的RNN，LSTM能够在更长的序列中有更好的表现。

接下来我们使用`tf.keras`提供的 LSTM 网络层搭建 RNN 网络模型，对 IMDB 影评数据进行分类。

## 2. 下载 IMDB 数据集

此文本分类教程将在 [IMDB 大型电影评论数据集](http://ai.stanford.edu/~amaas/data/sentiment/)上训练[循环神经网络](https://developers.google.cn/machine-learning/glossary/?hl=zh_cn#recurrent_neural_network)，IMDB 大型电影评论数据集是一个*二进制分类*数据集——判断某条电影评论是正面评论还是负面评论。

使用 [TFDS](https://tensorflow.google.cn/datasets?hl=zh_cn) 下载数据集。

> 💡 TensorFlow Datasets 提供了一系列可以和 TensorFlow 配合使用的数据集。它负责下载和准备数据，以及构建 [`tf.data.Dataset`](https://tensorflow.google.cn/api_docs/python/tf/data/Dataset?hl=zh_cn)。

```python
import tensorflow_datasets as tfds
import tensorflow as tf
```

```python
dataset, info = tfds.load('imdb_reviews/subwords8k', with_info=True,
                          as_supervised=True)
train_dataset, test_dataset = dataset['train'], dataset['test']
```

数据集 `info` 包括编码器 ([`tfds.features.text.SubwordTextEncoder`](https://tensorflow.google.cn/datasets/api_docs/python/tfds/features/text/SubwordTextEncoder?hl=zh_cn))。

```python
encoder = info.features['text'].encoder
print('Vocabulary size: {}'.format(encoder.vocab_size))
Vocabulary size: 8185 
```

## 3. 准备用于训练的数据

接下来，使用 `padded_batch` 方法将序列填充至批次中最长字符串的长度：

```python
BUFFER_SIZE = 10000
BATCH_SIZE = 64
train_dataset = train_dataset.shuffle(BUFFER_SIZE)
train_dataset = train_dataset.padded_batch(BATCH_SIZE)

test_dataset = test_dataset.padded_batch(BATCH_SIZE)
```

## 4. 创建模型

构建一个 [`tf.keras.Sequential`](https://tensorflow.google.cn/api_docs/python/tf/keras/Sequential?hl=zh_cn) 模型并从嵌入向量层开始。嵌入向量层每个单词存储一个向量。调用时，它会将单词索引序列转换为向量序列。这些向量是可训练的。（在足够的数据上）训练后，具有相似含义的单词通常具有相似的向量。

与通过 [`tf.keras.layers.Dense`](https://tensorflow.google.cn/api_docs/python/tf/keras/layers/Dense?hl=zh_cn) 层传递独热编码向量的等效运算相比，这种索引查找方法要高效得多。

循环神经网络 (RNN) 通过遍历元素来处理序列输入。RNN 将输出从一个时间步骤传递到其输入，然后传递到下一个步骤。

⭐ 我们在 LSTM 层外面套了一个壳 (层封装器, layer wrappers): `tf.keras.layers.Bidirectional`，这是 RNN 的**双向封装器**，用于对序列进行前向和后向计算。

```python
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(encoder.vocab_size, 64),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1)
])
```

> 💡 `Embedding` 可以将高维数据映射到较低维空间来解决稀疏输入数据问题
>
> IMDB 数据集的预处理是按照单词在 encoder 中的下标来处理的，维度(`encoder.vocab_size`)很高也很稀疏，经过 `Embedding `层的转换，将产生大小固定为 64 的向量。而且这个转换是可训练的，经过足够的训练之后，相似语义的句子将产生相似的向量。

**请注意，我们在这里选择 Keras 序贯模型，因为模型中的所有层都只有单个输入并产生单个输出**。如果要使用有状态 RNN 层，则可能需要使用 Keras 函数式 API 或模型子类化来构建模型，以便可以检索和重用 RNN 层状态。有关更多详细信息，请参阅 [Keras RNN 指南](https://tensorflow.google.cn/guide/keras/rnn?hl=zh_cn#rnn_state_reuse)。

编译 Keras 模型以配置训练过程：

```python
model.compile(loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
              optimizer=tf.keras.optimizers.Adam(1e-4),
              metrics=['accuracy'])
```

## 5. 训练模型

```python
history = model.fit(train_dataset, epochs=10,
                    validation_data=test_dataset, 
                    validation_steps=30)

test_loss, test_acc = model.evaluate(test_dataset)
391/391 [==============================] - 17s 43ms/step - loss: 0.4305 - accuracy: 0.8477
```

如果预测 >= 0.5，则为正面评论，否则为负面评论。

```python
def plot_graphs(history, metric):
  plt.plot(history.history[metric])
  plt.plot(history.history['val_'+metric], '')
  plt.xlabel("Epochs")
  plt.ylabel(metric)
  plt.legend([metric, 'val_'+metric])
  plt.show()

plot_graphs(history, 'accuracy')
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201109205410.png" style="zoom:67%;" />

```python
plot_graphs(history, 'loss')
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201109205432.png" style="zoom:67%;" />

## 6. 堆叠两个或更多 LSTM 层

Keras 循环层有两种可用的模式，这些模式由 `return_sequences` 构造函数参数控制：

- 返回每个时间步骤的连续输出的完整序列（形状为 `(batch_size, timesteps, output_features)` 的 3D 张量）。
- 仅返回每个输入序列的最后一个输出（形状为 (batch_size, output_features) 的 2D 张量）。

```python
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(encoder.vocab_size, 64),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64,  return_sequences=True)),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.5), # 随机舍弃 0.5 的权重，防止过拟合
    tf.keras.layers.Dense(1)
])
model.compile(loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
              optimizer=tf.keras.optimizers.Adam(1e-4),
              metrics=['accuracy'])
history = model.fit(train_dataset, epochs=10,
                    validation_data=test_dataset,
                    validation_steps=30)

test_loss, test_acc = model.evaluate(test_dataset)
391/391 [==============================] - 30s 78ms/step - loss: 0.5205 - accuracy: 0.8572

# predict on a sample text without padding.

sample_pred_text = ('The movie was not good. The animation and the graphics '
                    'were terrible. I would not recommend this movie.')
predictions = sample_predict(sample_pred_text, pad=False)
print(predictions)
[[-2.6377363]]
# predict on a sample text with padding

sample_pred_text = ('The movie was not good. The animation and the graphics '
                    'were terrible. I would not recommend this movie.')
predictions = sample_predict(sample_pred_text, pad=True)
print(predictions)
[[-3.0502243]]
plot_graphs(history, 'accuracy')
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201109210626.png" style="zoom:67%;" />

```python
plot_graphs(history, 'loss')
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201109210635.png" style="zoom:67%;" />

## 📚 References

- [TensorFlow 2 官方文档](https://tensorflow.google.cn/tutorials/keras/classification?hl=zh_cn)
- [极客兔兔 - RNN LSTM 文本分类](https://geektutu.com/post/tf2doc-rnn-lstm-text.html#%E6%96%87%E6%9C%AC%E9%A2%84%E5%A4%84%E7%90%86)