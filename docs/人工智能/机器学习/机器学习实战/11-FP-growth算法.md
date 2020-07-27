# 🚡 使用 FP-growth 算法来高效发现频繁项集

---

在上一章我们已经介绍了用 **Apriori算法**发现**频繁项集**与**关联规则**。

本章将继续关注发现频繁项集这一任务，并使用**FP-growth算法**更有效的挖掘频繁项集。

**FP-growth 算法步骤**：

- 基于数据构建 FP 树
- 从 FP 树种挖掘频繁项集

## 1. FP 树：用于编码数据集的有效方式

**FP-growth算法** 将数据存储在一种称为 FP 树的紧凑数据结构中。FP 代表频繁模式（Frequent Pattern)。FP 树通过链接 link 来连接相似元素，被连起来的元素项可以看成一个链表。下图给出了一个 FP 树的例子：

<img src="https://gitee.com/veal98/images/raw/master/img/20200727200619.png" style="zoom:80%;" />

<img src="https://gitee.com/veal98/images/raw/master/img/20200727200642.png" style="zoom:85%;" />

同搜索树不同，FP 树中一个元素项可以出现多次。FP 树会存储每个项集的出现频率。解释一下：

<img src="https://gitee.com/veal98/images/raw/master/img/20200727201835.png" style="zoom:80%;" />

**FP-growth 算法的工作流程**如下：

- 首先构建 FP 树，然后利用它来挖掘频繁项集
- 为构建 FP 树，需要对原始数据集扫描两遍：第一遍对所有元素项的出现次数进行计数（如果某个元素是非频繁的，那么包含该元素的超集也是非频繁的）；第二遍扫描只考虑那些频繁元素。

<img src="https://gitee.com/veal98/images/raw/master/img/20200727202719.png" style="zoom:86%;" />

## 2. 构建 FP 树

### ① 创建 FP 树的数据结构

创建一个类来保存树的每一个节点：

```python
# FP 树的类定义
class treeNode:
    def __init__(self, nameValue, numOccur, parentNode):
        self.name = nameValue # 节点名字
        self.count = numOccur # 计数值
        self.nodeLink = None # 用于链接相似的元素项
        self.parent = parentNode    # 父节点
        self.children = {}  # 子节点
    
    def inc(self, numOccur): # 增加计数
        self.count += numOccur
        
    def disp(self, ind=1): # 将树以文本形式显示
        print('  '*ind, self.name, ' ', self.count) # 利用缩进表示树的深度
        for child in self.children.values():
            child.disp(ind+1)
```
🏃‍ 运行一下代码:

```python
rootNode = treeNode('pyramid',9,None) # 创建根节点
rootNode.children['eye'] = treeNode('eye',13,None) # 创建rootNode的子节点
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200727204833.png" style="zoom:80%;" />

```python
rootNode.children['phoenix'] = treeNode('phoenix',3,None)
phoenixNode = rootNode.children['phoenix']
phoenixNode.children['leg'] = treeNode('leg',12,None) # 创建 phoenix 的子节点
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200727204925.png" style="zoom:80%;" />

OK，FP 树的数据结构构造完毕，下面开始构建 FP 树 👇 

### ② 构建 FP 树

除了图 12-1 给出的 FP 树之外，还需要一个**头指针表**来**指向给定类型的第一个实例**。即通过头指针表，可以快速访问 FP 树中一个给定类型的所有元素。这里使用字典作为数据结构来保存头指针表。除了存放指针外，头指针表还可以用来**保存 FP 树中每类元素的总数**。

<img src="https://gitee.com/veal98/images/raw/master/img/20200727205512.png" style="zoom:85%;" />

第一次遍历数据集会获得每个元素项的出现频率。接下来，去掉不满足最小支持度的元素项。然后通过该数据集构造 FP 树。在构建时，读入每个项集并将其添加到已经存在的一条路径中。如果该路径不存在，就创建一条新路径。注意，将集合添加到树之前，需要按照出现次数进行排序和过滤：

![](https://gitee.com/veal98/images/raw/master/img/20200727211150.png)

OK，接下来就可以构建 FP 树了。从空集开始，向其中不断添加频繁项集。如果已经存在现有元素，就增加出现次数，如果不存在，就添加树的分支。

<img src="https://gitee.com/veal98/images/raw/master/img/20200727211334.png" style="zoom:90%;" />

✍ 接下来我们通过代码来实现上述过程：

```python
# FP 树构建函数
def createTree(dataSet, minSup=1): 
    """
    Args:
        dataSet：数据集
        minSup：最小支持度
    """
    headerTable = {} # 头指针表，存放每个元素项的出现次数
    
    # 第一遍扫描：记录元素项出现次数
    for trans in dataSet:
        for item in trans:
            headerTable[item] = headerTable.get(item, 0) + dataSet[trans]
            
    headerTableCopy = headerTable.copy()
    # 移除不满足最小支持度的元素项
    for k in headerTableCopy.keys():  
        if headerTable[k] < minSup:
            del(headerTable[k])
    
    freqItemSet = set(headerTable.keys()) # 频繁项集
    if len(freqItemSet) == 0:  # if no items meet min support -->get out
        return None, None  
    for k in headerTable:
        headerTable[k] = [headerTable[k], None] # 头指针表：保存计数值及指向每种类型第一个元素项的指针

    retTree = treeNode('Null Set', 1, None) # 创建只包含空集合的根节点
    # 第 2 遍扫描，根据出现次数对每个元素项进行排序
    for tranSet, count in dataSet.items():  
        localD = {}
        for item in tranSet:  # put transaction items in order
            if item in freqItemSet:
                localD[item] = headerTable[item][0]
        if len(localD) > 0:
            orderedItems = [v[0] for v in sorted(localD.items(), key = lambda p: p[1], reverse=True)]
            updateTree(orderedItems, retTree, headerTable, count) # populate tree with ordered freq itemset
    return retTree, headerTable # return tree and header table

# 使得 FP 树生长
def updateTree(items, inTree, headerTable, count):
    if items[0] in inTree.children: # 首先测试元素项集中的第一个元素是否作为子节点存在，如果存在，则直接计数
        inTree.children[items[0]].inc(count) #incrament count
    else:   # 如果不存在，就新建分支
        inTree.children[items[0]] = treeNode(items[0], count, inTree)
        if headerTable[items[0]][1] == None: # update header table 
            headerTable[items[0]][1] = inTree.children[items[0]]
        else:
            updateHeader(headerTable[items[0]][1], inTree.children[items[0]])
    if len(items) > 1:#call updateTree() with remaining ordered items
        updateTree(items[1::], inTree.children[items[0]], headerTable, count)
    
# 更新头指针表：确保节点链接指向树中该元素项的每一个实例
def updateHeader(nodeToTest, targetNode):   #this version does not use recursion
    while (nodeToTest.nodeLink != None):    #Do not use recursion to traverse a linked list!
        nodeToTest = nodeToTest.nodeLink
    nodeToTest.nodeLink = targetNodea
```

可以看见，构造 FP 树的函数需要的数据集是字典，而不是列表，我们需要写一个函数进行转换：

```python
def loadSimpDat():
    simpDat = [['r', 'z', 'h', 'j', 'p'],
               ['z', 'y', 'x', 'w', 'v', 'u', 't', 's'],
               ['z'],
               ['r', 'x', 'n', 'o', 's'],
               ['y', 'r', 'x', 'z', 'q', 't', 'p'],
               ['y', 'z', 'x', 'e', 'q', 's', 't', 'm']]
    return simpDat

# 将列表转换成字典
def createInitSet(dataSet):
    retDict = {}
    for trans in dataSet:
        retDict[frozenset(trans)] = 1 # 出现字数初始化为 1
    return retDict
```

🏃‍ 运行上述代码：

<img src="https://gitee.com/veal98/images/raw/master/img/20200727220355.png" style="zoom:80%;" />

构造 FP 树：

<img src="https://gitee.com/veal98/images/raw/master/img/20200727220419.png" style="zoom:80%;" />

### ③ 图解构造 FP 树

假设我们有以下数据集：

![](https://gitee.com/veal98/images/raw/master/img/20200727223456.png)

利用该数据集构造 FP 树。

**Step 1**：扫描数据记录，生成频繁项集（假设最小支持度为 2），并按出现次数由多到少排序，如下所示：

![](https://gitee.com/veal98/images/raw/master/img/20200727223544.png)

**Step 2**：再次扫描数据记录，对每条记录中出现在 Step 1 产生的表中的项，按表中的顺序排序。初始时，新建一个根结点，标记为 `null`：

- 1）第一条记录：`{牛奶,面包}`，按 Step 1 表过滤排序得到依然为 `{牛奶,面包}`，新建一个结点，nameValue 为 `{牛奶}`，将其插入到根节点下，并设置 `count `为 1，然后新建一个 `{面包}` 结点，插入到 `{牛奶}` 结点下面，插入后如下所示：

  ![](https://gitee.com/veal98/images/raw/master/img/20200727223910.png)

- 2）第二条记录：`{面包,尿布,啤酒,鸡蛋}`，过滤并排序后为：`{面包,尿布,啤酒}`，发现根结点没有包含`{面包}`的儿子（有一个`{面包}`孙子但不是儿子），因此新建一个`{面包}`结点，插在根结点下面，这样根结点就有了两个孩子，随后新建`{尿布}`结点插在`{面包}`结点下面，新建`{啤酒}`结点插在`{尿布}`下面，插入后如下所示：

  ![](https://gitee.com/veal98/images/raw/master/img/20200727224013.png)

- 3）第三条记录：`{牛奶,尿布,啤酒,可乐}`，过滤并排序后为：`{牛奶,尿布,啤酒}`，这时候发现根结点有儿子`{牛奶}`，因此不需要新建结点，只需将原来的`{牛奶}`结点的 `count` 加 1 即可，往下发现`{牛奶}`结点有一个儿子`{尿布}`，于是新建`{尿布}`结点，并插入到`{牛奶}`结点下面，随后新建`{啤酒}`结点插入到`{尿布}`结点后面。插入后如下图所示：

  ![](https://gitee.com/veal98/images/raw/master/img/20200727224110.png)

- 4）第四条记录：`{面包,牛奶,尿布,啤酒}`，过滤并排序后为：`{牛奶，面包,尿布,啤酒}`，这时候发现根结点有儿子`{牛奶}`，因此不需要新建结点，只需将原来的`{牛奶}`结点的 `count` 加 1 即可，往下发现`{牛奶}`结点有一个儿子`{面包}`，于是也不需要新建`{面包}`结点，只需将原来`{面包}`结点的`count`加1，由于这个`{面包}`结点没有儿子，此时需新建`{尿布}`结点，插在`{面包}`结点下面，随后新建`{啤酒}`结点，插在`{尿布}`结点下面，插入后如下图所示：

  ![](https://gitee.com/veal98/images/raw/master/img/20200727224205.png)

- 5）第五条记录：`{面包,牛奶,尿布,可乐}`，过滤并排序后为：`{牛奶，面包,尿布}`，检查发现根结点有`{牛奶}`儿子，`{牛奶}`结点有`{面包}`儿子，`{面包}`结点有`{尿布}`儿子，本次插入不需要新建结点只需更新`count`即可，示意图如下：

  ![](https://gitee.com/veal98/images/raw/master/img/20200727224252.png)

- 按照上面的步骤，我们已经基本构造了一棵 FpTree，树中每条路径代表一个项集，因为许多项集有公共项，而且出现次数越多的项越可能是公共项，因此按出现次数由多到少的顺序可以节省空间，实现压缩存储，另外我们需要一个表头和对每一个 nameValue 相同的结点做一个线索，方便后面使用，线索的构造也是在建树过程形成的，添加线索和表头的Fptree 如下：

![](https://gitee.com/veal98/images/raw/master/img/20200727224512.png)

​		至此，整个 FpTree 就构造好了 🎉

## 3. 从一棵 FP 树中挖掘频繁项集

从 FP 中抽取频繁项集的三个基本步骤如下：

- 从 FP 树中获得**条件模式基 condition pattern base**

  （条件模式基: 头部链表中的某一点的**前缀路径  prefix path**组合就是条件模式基，条件模式基的值取决于末尾节点的值。简单来说，一条前缀路径就是介于所查找元素项与树根节点之间的所有内容）

- 利用条件模式基，构建一个**条件 FP 树**

  （条件FP树: 以条件模式基为数据集构造的FP树叫做条件FP树）

- 重复上面两个步骤，直到树包含一个元素项为止

### ① 抽取条件模式基

<img src="https://gitee.com/veal98/images/raw/master/img/20200727205512.png" style="zoom:85%;" />

符号 r 的前缀路径是 `{x,s}`、 `{z,x,y}`、 `{z}`。每一条前缀路径的计数值等于每条路径上符号 r 出现的次数。

下表给出了每个频繁项的所有前缀路径：

<img src="https://gitee.com/veal98/images/raw/master/img/20200727222231.png" style="zoom:85%;" />

### ② 创建条件 FP 树

## 📚 References

- 《Machine Learning in Action》
- [Github - AiLearning](https://github.com/apachecn/AiLearning/)
- [FpGrowth 算法](https://www.jianshu.com/p/82940f9463d4)