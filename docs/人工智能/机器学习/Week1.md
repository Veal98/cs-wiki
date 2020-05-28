# 一、Introduction

## 1. 什么是机器学习 Machine Learning

### ① 定义

🔵 **Arthur Samuel (1959)**：Machine Learning : Field of study that gives computers the ability to learn without being explicitly programmed. 在没有明确设置的情况下，使计算机具有学习能力的研究领域。

🔴 **Tom Mitchell (1998)**：Well-posed Learning Problem：A computer program is said to learn from experience E with respect to some task T and some performance measure P，if its performance on T，as measured by P，improves with experience E. 一个适当的学习问题定义如下：计算机程序从经验 E （程序与自己下上万次跳棋）中学习，解决某一任务 T （玩跳棋），进行某一性能度量 P （与新对手玩跳棋时赢的概率），通过 P 测定在 T 上的表现因经验 E 而提高。

### ② 每节小问

❓ <u>基于 Tom Mitchell 对于机器学习的定义，提出一个问题：</u>

Suppose your email program watches which emails you do or do not mark as spam（垃圾邮件），and based on that learns how to better filter spam. What is the task T in this setting? 假设你的邮箱正在观察你将哪些邮件标记为垃圾邮件，并基于此学习如何更好的过滤邮件，那么在这里任务 T 是什么？

- ✅ Classifying emails as spam or not spam 把邮件分类为垃圾邮件和非垃圾邮件：这是任务 T

- ❌ Watching you label email as spam or not spam 是否把邮件标记为垃圾邮件：这是经验 E

- ❌ The number(or fraction) of eamils correctly classified as spam/not spam：正确归类邮件的数量/比例：这是性能度量 P

即**任务 T 在得到经验 E 之后会提高性能度量 P**

### ③ 机器学习算法概览

📜 **Machine Learning algorithms**：

- **Supervised  learning** 监督学习：我们教计算机学习

- **Unsupervised learning** 无监督学习：计算机自己学习

Others：`Reinforcement learning` 强化学习，`recommender systems` 推荐系统

> 🔖 Also talk about : Practical advice for applying for applying learning algorithms 本课程中还会讲到应用学习算法时的实际建议 

---



## 2. 监督学习 Supervised Learning

### ① 定义

🔴 **Supervised learning**：We give the algorithm a data set，in which the "right answers" were given，and the task of the algorithm was to just produce more of these right answers. **我们给算法一个数据集，其中包含了正确答案，算法的目的就是给出更多的正确答案。**

### ② 回归问题 Regression

💬 举例来说，比如有个人想要卖房子，他需要结合自己房子的大小来评估房子能卖多少钱。此时我们已经有了一些正确的数据集（房子大小和房价的对应关系），如下图所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20200525222706.png" style="zoom: 50%;" />

那么学习算法能做到的一件事情就是用一条直线或者二次函数来拟合数据，从而预测出房子能卖多少钱。后面我们要讨论的问题就是选择使用直线拟合数据还是选用二次函数来拟合数据。

<img src="https://gitee.com/veal98/images/raw/master/img/20200525222851.png" style="zoom:50%;" />



🔴 用更专业的术语来定义，它也被称为**回归问题 Regression**：**回归的目标就是** Predict continuous valued output **预测连续的数值输出**

### ③ 分类问题 Classification

💬 我们来看下一个例子：比如我们要预测乳腺癌是恶性的还是良性的，假设此时我们已有一些正确的数据集（肿瘤的大小 tumor size 和肿瘤良/恶性 malignant 的对应关系），如下图所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20200525223553.png" style="zoom:50%;" />

那么机器学习的目标就是根据肿瘤的大小估计出肿瘤是良性还是恶性的概率。用更专业的术语来讲，这就是**一个分类问题 Classification Problem**。

🔴 **分类**是指：我们设法预测一个离散值输出，0 或 1 （良性 或 恶性），有时你也有两个以上的可能的输出值，因此，你可能要设法预测离散值0、1、2...。即**分类的目的就是预测离散值输出**

在分类问题中，有另一种方法来绘制这些数据，如下图所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20200525224714.png" style="zoom:50%;" />

在这个例子中，我们只使用了一个特征或者说属性，即肿瘤的大小，来预测肿瘤是恶性的还是良性的。

在其他的机器学习问题中，我们会有多个特征、多个属性，如下例所示：

💬 假设我们不仅知道肿瘤的大小，还知道病人的年纪，我们所拥有的数据集用下图所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20200525225228.png" style="zoom:50%;" />

学习算法所需要做的就是在数据上拟合出一条直线将恶性肿瘤和良性肿瘤分隔开来，如下图所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20200525225345.png" style="zoom:50%;" />

显然，在现实生活中，我们所需要处理的特征远不止一个两个。对于某些学习问题来说，我们想要的不是使用三个还是五个特征，而是无穷多的特征、无穷多的属性，因此我们的学习算法需要使用很多的属性或特征或线索来做预测，那么如何来处理无穷多的特征呢？如何在计算机中存储无穷多数量的事物呢？

### ④ 每节小问

❓ <u>基于本节的学习，提出一个问题：</u>

判断下面两种情况属于分类问题还是回归问题：

- **Problem1**：You have a large inventory of identical items. You want to predict how many of these items will sell over the next 3 months. 你有很多同一件货物的库存，假设你有几千件相同的货物要卖，你想预测在接下来的三个月内，你能卖出多少件。

  👉 Regression Problem 回归问题：把要卖的货物数量看成一个连续的值

- **Problem2**：You'd like software to examine individual customer accounts, adn for each account decide if it has been hacked/compromise. 你有很多用户，你想要写一个软件，来检查每一个客户的账户，判断这个账户是否被入侵或破坏

  👉  Classification Problem 分类问题：设置预测的值为 0 表示账户没有被入侵，1 表示被入侵

---



## 3. 无监督学习 Unsupervised Learning

### ① 定义

在监督学习中，每个样本都被标明为（labled）阳性样本或者阴性样本，我们已被清除的告知了什么是正确答案（即肿瘤是良性还是恶性）。

<img src="https://gitee.com/veal98/images/raw/master/img/20200526101702.png" style="zoom:50%;" />

而**对于无监督学习来说，我们的数据集没有任何标签**，或者说都具有相同的标签或者没有标签，即我们不知道什么是正确答案。我们拿到这个数据集，不知道要拿它做什么，也不知道每个数据点究竟是什么，我们只被告知这里有一个数据集，你能在其中找到某种结构吗？

<img src="https://gitee.com/veal98/images/raw/master/img/20200526101925.png" style="zoom:50%;" />

### ② 聚类算法 Clustering 

对于给定的数据集，无监督学习算法可能将该数据集分成两个不同的簇，这就是**聚类算法 clustering algorithm**

<img src="https://gitee.com/veal98/images/raw/master/img/20200526102330.png" style="zoom:50%;" />

💬 一个应用聚类算法的典型例子就是谷歌新闻，谷歌新闻会搜索成千上万的新闻，然后自动的对它们进行分簇，有关同一主题的新闻被分在同一类，比如关于新冠病毒的新闻放在同一类。

起始聚类算法和无监督学习算法也可以被用于许多其他的问题，这里我们举个它在基因组学中的应用：

💬 下图是一个 DNA 微阵列数据，基本思想是给定一组不同的个体，对于每个个体，检测它们是否拥有某个特定的基因，也就是要检测，特定基因的表达程度。这些颜色红、绿、灰等展示了不同的个体拥有特定基因的程度。然后我们所能做的就是运行一个聚类算法，把不同的个体，归入不同的类，或归入不同类型的人。

<img src="https://gitee.com/veal98/images/raw/master/img/20200526103404.png" style="zoom:50%;" />

💬 聚类算法还被广泛应用于如下场合：

<img src="https://gitee.com/veal98/images/raw/master/img/20200526104043.png" style="zoom: 50%;" />

聚类只是无监督学习的一种，现在我们来介绍下一种：鸡尾酒会算法

### ③ 鸡尾酒会算法 Cocktail party

首先介绍以下鸡尾酒会问题 Cocktail party problem：有一个宴会，一屋子的人，因为有许多人在同时说话，有许多声音混杂在一起，你几乎很难听清你面前的人说的话。假设一个鸡尾酒会只有两个人，同时说话，我们将两个麦克风放在房间里，且这两个麦克风与两个人的距离不同，每个麦克风记录了来自两人声音的不同组合。我们能做的就是把这两个录音交给一种无监督学习算法，称为 "**鸡尾酒会算法 cocktail party algorithm**"，让算法帮你找出数据的结构，该算法就会**分离出这两个被混叠在一起的声音**。

<img src="https://gitee.com/veal98/images/raw/master/img/20200526105754.png" style="zoom:50%;" />

鸡尾酒会算法的 Matlab 实现：

<img src="https://gitee.com/veal98/images/raw/master/img/20200526110514.png" style="zoom: 40%;" />

### ④ 每节小问

Of the following examples, which would you address using an <u>unsupervised learning</u> algorithm? 判断下面哪些是无监督学习算法：

- ❌ Given email labeled as spam/not spam, learn a spam filter. 垃圾邮件
- ✅ Given a set of news articles found on the web, group them into set of articles about the same story. 新闻归类
- ✅  Given a database of customer data, automatically discover market segments and group customers into different market segments. 市场划分
- ❌ Given a database of patients diagnosed as either having diabetes (糖尿病) or not, learn to classify new patients as having diabetes or not. 糖尿病预测

## ✍ Quiz

### ① 第 1 题

A computer program is said to learn from experience E with respect to some task T and some **performance measure P** if its performance on T, as measured by P, improves with experience E. Suppose we feed a learning algorithm a lot of historical weather data, and have it learn to **predict weather**. What would be a reasonable choice for P? 一个计算机程序从经验E中学习任务T，并用P来衡量表现。并且，T的表现P随着经验E的增加而提高。 假设我们给一个学习算法输入了很多历史天气的数据，让它学会预测天气。什么是P的合理选择？

- The process of the algorithm examining a large amount of historical weather data. 计算大量历史气象数据的过程

- ✅ The probability of it correctly predicting a future date's weather. 正确预测未来日期天气的概率

- None of these.

- The weather prediction task.  天气预报任务

### ② 第 2 题

Suppose you are working on **weather prediction**, and your weather station makes one of three predictions for each day's weather: Sunny, Cloudy or Rainy. You'd like to use a learning algorithm to predict tomorrow's weather. Would you treat this as a classification or a regression problem? 假设你正在做天气预报，并使用算法预测明天气温（摄氏度/华氏度），你会把这当作一个分类问题还是一个回归问题？

- Regression

- ✅ Classification

### ③ 第 3 题

Suppose you are working on **stock market prediction**, and you would like to predict the price of a particular stock tomorrow (measured in dollars). You want to use a learning algorithm for this. Would you treat this as a classification or a regression problem? 假设你在做股市预测。你想预测某家公司是否会在未来7天内宣布破产（通过对之前面临破产风险的类似公司的数据进行训练）。你会把这当作一个分类问题还是一个回归问题？

- Classification

- ✅ Regression

### ④ 第 4 题

Some of the problems below are best addressed using a supervised learning algorithm, and the others with an unsupervised learning algorithm. Which of the following would you apply **supervised learning** to? (Select all that apply.) In each case, assume some appropriate dataset is available for your algorithm to learn from. 下面的一些问题最好使用有监督的学习算法来解决，而其他问题则应该使用无监督的学习算法来解决。以下哪一项你会使用监督学习？（选择所有适用的选项）在每种情况下，假设有适当的数据集可供算法学习。

- ✅ In farming, given data on crop yields over the last 50 years, learn to predict next year's crop yields. 在农业领域，根据过去50年作物产量的数据，学会预测明年的作物产量。

- Given a large dataset of medical records from patients suffering from heart disease, try to learn whether there might be different clusters of such patients for which we might tailor separate treatments. 鉴于心脏病患者的医疗记录量很大，请尝试了解是否存在不同的此类患者群，我们可以针对这些患者进行单独治疗。

- ✅ Given data on how 1000 medical patients respond to an experimental drug (such as effectiveness of the treatment, side effects, etc.), discover whether there are different categories or "types" of patients in terms of how they respond to the drug, and if so what these categories are. 给定 1000 名医疗患者对实验药物（如治疗效果、副作用等）的反应数据，发现患者在药物反应方面是否有不同类别或"类型"，如果是，这些类别是什么。

- ✅ Examine a web page, and classify whether the content on the web page should be considered "child friendly" (e.g., non-pornographic, etc.) or "adult."  检查网页，并分类网页上的内容是否应被视为"儿童友好"（例如，非色情等）或"成人"。

### ⑤ 第 5 题

Which of these is a reasonable definition of machine learning?

- Machine learning is the science of programming computers. 机器学习是计算机编程的科学。

- ✅ Machine learning is the field of study that gives computers the ability to learn without being explicitly programmed. 机器学习是使计算机无需明确编程即可学习的研究领域。

- Machine learning is the field of allowing robots to act intelligently. 机器学习是允许机器人智能行动的领域。

- Machine learning learns from labeled data. 机器学习从标记的数据中学习。



---



# 二、单变量线性回归 Linear Regression with One Variable

## 1. 模型表示

在监督学习里，我们有一个数据集，他被称为训练集，

✍ 我们需要使用一些符号：

- m：表示训练样本的数量 Number of training examples
- x：输入变量 / 特征 input variable / features
- y：输出变量 / 目标变量 output variable / target variable
- (x，y)：一个训练样本 one training example
- ($x^(i)$，$y^(i)$)：第 i 个训练样本
- h 代表学习算法的解决方案或函数也称为假设（**hypothesis**）

<img src="https://gitee.com/veal98/images/raw/master/img/20200526114539.png" style="zoom: 60%;" />

OK，如何给训练集下定义呢？我们先来了解监督学习算法是怎样工作的：

<img src="https://gitee.com/veal98/images/raw/master/img/20200526115120.png" style="zoom: 67%;" />

我们怎么表示我们的**假设函数 hypothesis**呢？这里我们选择最初的假设函数作为我们接下来的函数：

🔢 $h_θ(x) = θ_0 + θ_1*x$

如果我们已有数据集输入数据 x 和输出数据 y，那么假设函数的作用就是预测 y 是关于 x 的线性函数

<img src="https://gitee.com/veal98/images/raw/master/img/20200526120027.png" style="zoom: 67%;" />

🔴 这种模型也被称为**线性回归 linear regression，即拟合出一条直线最佳匹配我们所拥有的数据**。上面这个例子是一元线性回归，即单变量 x 的函数，也称**单变量 one variable 线性回归**

## 2. 代价函数 Cost function

对于假设函数：$h_θ(x) = θ_0 + θ_1*x$

θi 我们称之为模型参数，我们接下来要讲解的就是如何选择两个参数值 $θ_0$ 和 $θ_1$ 

我们会得到不同的假设，不同的假设函数

<img src="https://gitee.com/veal98/images/raw/master/img/20200526142215.png" style="zoom: 50%;" />

我们所要做的，就是求出参数值 $θ_0$ 和 $θ_1$ ，来让假设函数表示的直线最大程度的拟合我们的数据

🔴 我们给出标准的定义：在线性回归中，我们要解决的就是一个**最小化问题 minimization**，希望找到参数值 $θ_0$ 和 $θ_1$ 使得 $h_θ(x) - y$ 尽可能的小，那么我们需要做的事情就是**尽量减少假设的输出与实际输出之间的差的平方**。

我们对所有样本进行求和，即对 i = 1 到 i = m (训练集的样本容量) 的样本，将对假设得到的预测值和实际值所得的差的平方进行相加得到总和。函数如下：

<img src="https://gitee.com/veal98/images/raw/master/img/20200526143754.png" style="zoom:67%;" />

1/2m 是为了使得我们的数据更加直观，**minimize θ0θ1 指关于 $θ_0$ 和 $θ_1$ 的最小化问题**，即找到参数值 $θ_0$ 和 $θ_1$ 使得所有 $h_θ(x) - y$ 的平方和的 1/2m 尽可能的小。这便是线性回归的整体目标函数。

为了让它更明确一点，我们来改写这个函数：

🚩 定义一个**代价函数**：$J(θ_0,θ_1) = \frac{1}{2m}\sum_{i=1}^{m}(h_θ(x^(i)) - y^(i))^2$

即 $minimize_{θ0θ1} J(θ_0,θ_1)$

**我们的目标便是选择出可以使得误差的平方和能够最小的模型参数，即使得代价函数最小。**

我们绘制一个等高线图，三个坐标分别为 $θ_0$ 和 $θ_1$ 和 $J(θ_0,θ_1)$：

<img src="https://gitee.com/veal98/images/raw/master/img/20200526203123.png" style="zoom:67%;" />

则可以看出在三维空间中存在一个使得 $J(θ_0,θ_1)$ 最小的点。

$J(θ_0,θ_1)$ 就是代价函数 cost function，也称为**平方误差函数 squared error function**，对于大多数问题，特别是回归问题，都是一个合理的选择。还有其他的代价函数也能很好地发挥作用，但是平方误差代价函数可能是解决回归问题最常用的手段了。

也许这个函数 $J(θ_0,θ_1)$ 有点抽象，可能你仍然不知道它的内涵，在接下来的几个视频里，我们要更进一步解释代价函数 J 的工作原理，并更直观地解释它在计算什么，以及我们使用它的目的。

## 3. 代价函数的直观理解 Ⅰ 

在上一节中，我们给出了代价函数一个数学上的定义。在这个视频里，让我们通过一些例子来获取一些直观的感受，看看代价函数到底是在干什么。

<img src="https://gitee.com/veal98/images/raw/master/img/20200526203852.png" style="zoom: 67%;" />

为了更好地使代价函数 J 可视化，我们使用一个简化的假设函数：$h_θ(x) = θ_1*x$，代价函数和之前相同。

<img src="https://gitee.com/veal98/images/raw/master/img/20200526204201.png" style="zoom: 67%;" />

基于上述简化的假设函数，我们来解释**假设函数和代价函数之间的关系**：

- 对于假设函数 h：它是关于 x 的函数

- 对于代价函数 J：它是关于 $θ_1$ 的函数

每一个代价函数都对应一个假设函数，每一个不同的 θ1 ，我们都可以得到一个不同的 J(θ1) 的值

<img src="https://gitee.com/veal98/images/raw/master/img/20200526213110.png" style="zoom: 67%;" />

🎯 **学习算法的优化目标，就是通过选择 θ1 的值，获得最小的 J(θ1)** 。在上面的曲线中，当 θ1 = 1时，J(θ1) 最小，$h_{θ1}(x)$ 也确实是最佳匹配所有数据的直线。

下面我们将讨论带两个参数 θ0 和 θ1 时的图形

## 4. 代价函数的直观理解 Ⅱ 

我们保留全部参数 θ0 和 θ1 进行讨论：

<img src="https://gitee.com/veal98/images/raw/master/img/20200526214546.png" style="zoom: 50%;" />

我们的代价函数图形最终会如下所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20200526214915.png" style="zoom:50%;" />

为了使这个图形显得直观，我们使用等高线图 contour plots 或者称为等高图像 contour figures 来表示，则可以看出在三维空间中存在一个使得 $J(θ_0,θ_1)$  最小的点。

![](https://gitee.com/veal98/images/raw/master/img/20200526220039.png)

通过这些图形，我希望你能更好地理解这些代价函数 J 所表达的值是什么样的，它们对应的假设是什么样的，以及什么样的假设对应的点，更接近于代价函数 J 的最小值。

**当然，我们真正需要的是一种有效的算法，能够自动地找出这些使代价函数取最小值的参数和来。**

我们也不希望编个程序把这些点画出来，然后人工的方法来读出这些点的数值，这很明显不是一个好办法。我们会遇到更复杂、更高维度、更多参数的情况，而这些情况是很难画出图的，因此更无法将其可视化，因此我们真正需要的是编写程序来找出这些最小化代价函数的 θ0 和 θ1 的值，在下一节中，我们将介绍一种算法，能够自动地找出能使代价函数 J 最小化的参数 θ0 和 θ1 的值。

## 5. 梯度下降 Gradient descent

梯度下降是一个用来求函数最小值的算法，我们将使用梯度下降算法来求出代价函数 $J(θ_0,θ_1)$ 的最小值。

💡 梯度下降的思想 **Outline**：

- Start with some θ0，θ1  开始时我们随机选择一个参数的组合（θ0,θ1......θn），计算代价函数

- Keep changing  θ0，θ1  to reduce $J(θ_0,θ_1)$ 

  until we hopefully end up at a minimum

  然后我们不断地改变参数组合的值，使得 J 的值减小。我们持续这么做直到到到一个**局部最小值（local minimum）**，因为我们并没有尝试完所有的参数组合，所以**不能确定**我们得到的局部最小值是否便是**全局最小值（global minimum）**，选择不同的初始参数组合，可能会找到不同的局部最小值。

![](https://gitee.com/veal98/images/raw/master/img/20200526222712.png)

💭 想象一下你正站立在山的这一点上，站立在你想象的公园这座红色山上，在梯度下降算法中，我们要做的就是旋转 360 度，看看我们的周围，并问自己要在某个方向上，用小碎步尽快下山。这些小碎步需要朝什么方向？如果我们站在山坡上的这一点，你看一下周围，你会发现最佳的下山方向，你再看看周围，然后再一次想想，我应该从什么方向迈着小碎步下山？然后你按照自己的判断又迈出一步，重复上面的步骤，从这个新的点，你环顾四周，并决定从什么方向将会最快下山，然后又迈进了一小步，并依此类推，直到你接近局部最低点的位置。

🔴 **批量梯度下降（batch gradient descent）**算法的公式为：

![](https://gitee.com/veal98/images/raw/master/img/20200526222841.png)

> `:=` 这个符号表示赋值，这是一个赋值运算符 assignment operator
>
> 比如：a := b 表示将 b 的值赋给 a。
>
> 对于 `=` ，a = b 这是一个真假判定 truth assertion

其中 **α** 是**学习率（learning rate）**，它决定了梯度下降时迈出的步子有多大。如果 α 很大，那么梯度下降就很迅速。在批量梯度下降中，我们每一次都同时让所有的参数减去学习速率乘以代价函数的导数。

在梯度下降算法中，还有一个更微妙的问题，梯度下降中，我们要更新 θ0 和 θ1，当 j = 0和 j = 1 时，会产生更新，所以你将更新 J(θ0) 和 J(θ1)。实现梯度下降算法的微妙之处是，在这个表达式中，如果你要更新这个等式，你需要**同时更新 simultaneously update θ0 和 θ1**，我的意思是在这个等式中，我们要这样更新：

🚩 **θ0 := θ0 减去某项 ，并同时更新 θ1 := θ1 减去某项**

实现方法是：应该先计算公式右边的部分并存储起来，通过那一部分计算出 θ0 和 θ1 的值，同时更新  θ0 和 θ1。

<img src="https://gitee.com/veal98/images/raw/master/img/20200526224446.png"  />

❌ 错误的做法：非同步更新，如果不同步更新，那么temp1 使用的 θ0 就是已经更新过的 θ0

<img src="https://gitee.com/veal98/images/raw/master/img/20200526224530.png" style="zoom:67%;" />

同步更新是更自然的实现方法。<u>当人们谈到梯度下降时，他们的意思就是同步更新</u>。

在接下来的视频中，我们要进入批量梯度下降公式中的微分项 $α\frac{\partial}{\partial θ_j}J(θ_0,θ_1)$ 的细节之中

## 6. 梯度下降的直观理解

对于微分项 $α\frac{\partial}{\partial θ_j}J(θ_0,θ_1)$，首先，我们来讲解**偏导数  $\frac{\partial}{\partial θ_j}J(θ_0,θ_1)$**的作用 

<img src="https://gitee.com/veal98/images/raw/master/img/20200528103819.png" style="zoom:50%;" />

⭐ 显然，**偏导数项的作用就是使得 J(θ1) 不断趋向于最小值，即控制梯度下降的方向**

接下来，再解释一下学习速率 α 

![](https://gitee.com/veal98/images/raw/master/img/20200528104812.png)

- If α is too small, gradient descent can be slow
- If α is too large, gradient descent can overshoot the minimum （越过最小值）. It may fail to converge（收敛）, or even diverge（发散）. 如果 α 太大，它会导致无法收敛，甚至发散

⭐ 显然，**学习率 α 的作用就是控制梯度下降的速度**

<br>

❓ 那么，**如果我们预先把 θ1 放在一个局部的最低点，下一步梯度下降法会怎样工作？**

假设你将 θ1 初始化在局部最低点，在这儿，它已经在一个局部的最优处或局部最低点。结果是局部最优点的导数将等于零，因为它是那条切线的斜率。这意味着你已经在局部最优点，它使得不再改变，也就是新的  θ1  等于原来的  θ1 ，因此，如果你的参数已经处于局部最低点，那么梯度下降法更新其实什么都没做，它不会改变参数的值。**这也解释了为什么即使学习速率 α 保持不变时，梯度下降也可以收敛到局部最低点**。

<img src="https://gitee.com/veal98/images/raw/master/img/20200528105934.png" style="zoom: 50%;" />

我们来看一个例子，这是代价函数 J(θ)：

<img src="https://gitee.com/veal98/images/raw/master/img/20200528105841.png" style="zoom: 50%;" />

随着导数的越来越小，梯度下降的步伐也越来越小。

⭐ **在梯度下降法中，当我们接近局部最低点时，梯度下降法会自动采取更小的幅度**，这是因为在局部最低时导数等于零，所以当我们接近局部最低时，导数值会自动变得越来越小，所以梯度下降将自动采取较小的幅度，这就是梯度下降的做法。**所以实际上没有必要再另外减小 α** 。

这就是梯度下降算法，你可以用它来最小化任何代价函数 J，不只是线性回归中的代价函数 J。

接下来，我们要用代价函数 J，回到它的本质，线性回归中的代价函数。也就是我们前面得出的平方误差函数，结合梯度下降法，以及平方代价函数，我们会得出第一个机器学习算法，即**线性回归算法**。

## 7. 梯度下降的线性回归 Gradient descent for linear regression

<img src="https://gitee.com/veal98/images/raw/master/img/20200528110555.png" style="zoom:50%;" />

推导过程：求出代价函数的偏导数

<img src="https://gitee.com/veal98/images/raw/master/img/20200528111926.png" style="zoom: 50%;" />

将我们求出的偏导数代入梯度下降算法：

<img src="https://gitee.com/veal98/images/raw/master/img/20200528112411.png" style="zoom: 50%;" />

下面我们通过一个动态图来直观感受<u>梯度下降是如何影响代价函数的</u>

![gif](https://gitee.com/veal98/images/raw/master/img/20200528113141.gif)

对于上述算法，我们也称为**批量梯度下降 Batch Gradient descent** 。**" 批量" 指的是在梯度下降的每一步中，我们都用到了所有的训练样本**，在梯度下降中，在计算微分求导项时，我们需要进行求和运算。因此，批量梯度下降法这个名字说明了我们需要考虑所有这一"批"训练样本，而事实上，有时也有其他类型的梯度下降法，不是这种"批量"型的，不考虑整个的训练集，而是每次只关注训练集中的一些小的子集。在后面的课程中，我们也将介绍这些方法。

现在我们已经掌握了梯度下降，我们可以在不同的环境中使用梯度下降法，我们还将在不同的机器学习问题中大量地使用它。所以，🎉 **祝贺大家成功学会你的第一个机器学习算法**。

在接下来的课程中，我们将学习<u>泛化的梯度下降算法</u>，这将使梯度下降更加强大。

## ✍ Quiz

### ① 第 1 题

Consider the problem of predicting how well a student does in her second year of college/university, given how well she did in her first year.

Specifically, let x be equal to the number of "A" grades (including A-. A and A+ grades) that a student receives in their first year of college (freshmen year). We would like to predict the value of y, which we define as the number of "A" grades they get in their second year (sophomore year).

Refer to the following training set of a small sample of different students' performances (note that this training set may also be referenced in other questions in this quiz). Here each row is one training example. Recall that in linear regression, our hypothesis is **hθ(x)=θ0+θ1x**, and we use m to denote the number of training examples.

<img src="https://gitee.com/veal98/images/raw/master/img/20200528151422.png" style="zoom: 67%;" />

For the training set given above, what is the value of m? 对于上面给出的训练集，m的值是多少？

- ✅ m = 4

### ② 第 2 题

for this question, assume that we are using the training set from Q1. Recall our definition of the cost function was $J(\theta_0,\theta_1)=\frac{1}{2m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})^2$

What is J(0, 1) ? 

对于这个问题，假设我们使用第一题中的训练集。并且，我们对代价函数的定义是 $J(\theta_0,\theta_1)=\frac{1}{2m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})^2$ ，求 J(0,1)

- ✅ 已知   **hθ(x)=θ0+θ1x**，$J(\theta_0,\theta_1)=\frac{1}{2m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})^2$

  θ0 = 0，θ1 = 1，代入即可：

  $J(0,1)=\frac{1}{2*4}\left((3-2)^2+(1-2)^2+(0-1)^2+(4-3)^2 \right)=0.5$

### ③ 第 3 题

Suppose we set $\theta_0 = -1$,  $\theta_1 = 0.5$ . What is  $h_{\theta}(4)$ ?

- ✅  $h_{\theta}(4)=-1+0.5*4=1$

### ④ 第 4 题

In the given figure, the cost function $ J(\theta_0,\theta_1)$ has been plotted against  $\theta_0$ and $\theta_1$, as shown in 'Plot 2'. The contour plot for the same cost function is given in 'Plot 1'. Based on the figure, choose the correct options (check all that apply). 代价函数J(θ0,θ1)与θ0,θ1的关系如图2所示。“图1”中给出了相同代价函数的等高线图。根据图示，选择正确的选项（选出所有正确项）

![](https://gitee.com/veal98/images/raw/master/img/20200528195552.png)

- If we start from point B, gradient descent with a well-chosen learning rate will eventually help us reach at or near point A, as the value of cost function $J(\theta_0,\theta_1$) is maximum at point A.  从B点开始，学习率合适的梯度下降算法会最终帮助我们到达或者接近A点，即代价函数J(θ0,θ1)在A点有最大值

- ✅ Point P (the global minimum of plot 2) corresponds to point A of Plot 1. 点P（图2的全局最小值）对应于图1的点A

- Point P (The global minimum of plot 2) corresponds to point C of Plot 1. 点P（图2的全局最小值）对应于图1的点C

- ✅ If we start from point B, gradient descent with a well-chosen learning rate will eventually help us reach at or near point A, as the value of cost function $J(\theta_0,\theta_1)$  is minimum at A. 从B点开始，学习率合适的梯度下降算法会最终帮助我们到达或者接近A点，即代价函数J(θ0,θ1)在A点有最小值

- If we start from point B, gradient descent with a well-chosen learning rate will eventually help us reach at or near point C, as the value of cost function $J(\theta_0,\theta_1)$ is minimum at point C.  从B点开始，学习率合适的梯度下降算法会最终帮助我们到达或者接近C点，即代价函数J(θ0,θ1)在C点有最小值

### ⑤ 第 5 题

Suppose that for some linear regression problem (say, predicting housing prices as in the lecture), we have some training set, and for our training set we managed to find some $\theta_0, \theta_1 $such that$ J(\theta_0, \theta_1)=0$.

Which of the statements below must then be true? (Check all that apply.)

假设对于某个线性回归问题（比如预测房价），我们有一些训练集，对于我们的训练集，我们能够找到一些θ0,θ1，使得J(θ0,θ1)=0。 以下哪项陈述是正确的？（选出所有正确项）

- 为了实现这一点，我们必须有θ0=0,θ1=0，这样才能使J(θ0,θ1)=0

- ✅ 对于满足J(θ0,θ1)=0的θ0,θ1的值，其对于每个训练例子(x(i),y(i))，都有hθ(x(i))=y(i)

- 这是不可能的：通过J(θ0,θ1)=0的定义，不可能存在θ0,θ1使得J(θ0,θ1)=0

- 即使对于我们还没有看到的新例子，我们也可以完美地预测y的值（例如，我们可以完美地预测我们尚未见过的新房的价格）

---



# 三、线性代数回顾(Linear Algebra Review)

---

## 1. 矩阵和向量
## 2. 加法和标量乘法
## 3. 矩阵向量乘法

## 4. 矩阵乘法

## 5. 矩阵乘法的性质

## 6. 逆、转置





---



# 📚 References

- 🤖 [吴恩达机器学习经典名课【中英字幕】](https://www.bilibili.com/video/BV164411S78V?p=2)

- 💠 [黄海广 - 斯坦福大学2014机器学习教程中文笔记](http://www.ai-start.com/ml2014/)

- 🍧 [90题细品吴恩达《机器学习》，感受被刷题支配的恐惧](https://www.kesci.com/home/project/5e0f01282823a10036b280a7)