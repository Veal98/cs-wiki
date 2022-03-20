# ⛪ Python 基础

---

## 一、Python 环境安装

推荐安装 **Anaconda**，这是一个基于Python的数据处理和科学计算平台，它已经内置了许多非常有用的第三方库，我们装上Anaconda，就相当于把数十个第三方模块自动安装好了，非常简单易用。

要在Windows上运行，先下载[Anaconda安装包](https://www.anaconda.com/download/)。跟随Anaconda下载页面的Windows安装指导进行安装即可。

现在，来确认设置是否正确。打开命令行窗口（`cmd.exe`），输入`python`以打开Python解释器。可以看到类似下面的Anaconda版本的输出：

![](https://gitee.com/veal98/images/raw/master/img/20200607093744.png)

## 二、第一个 Python 程序

### 1. Hello World

```python
print(100 + 200 + 300)
print('hello world')
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200530195723.png" style="zoom: 80%;" />

### 2. 输入和输出

#### ① 输出

用`print()`在括号中加上字符串，就可以向屏幕上输出指定的文字。比如输出 `'hello, world'`，用代码实现如下：

```python
print('hello, world','jumps over', 'the lazy dog')
```

`print()`会依次打印每个字符串，**遇到逗号 `,`会输出一个空格**，因此，输出的字符串是这样拼起来的：

> hello, world jumps over the lazy dog

`print()`也可以打印整数，或者计算结果：

```python
print(300)
print(‘100 + 200 = ’,100 + 200) # 输出 100 + 200 = 300
```

#### ② 输入

Python提供了一个`input()`，可以让用户输入字符串，并存放到一个变量里。比如输入用户的名字：

```python
print('Input your name: ')
name = input()
print('Hello! ',name)
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200530200335.png" style="zoom:80%;" />

我们也可以直接在 input 中显示一个字符串

```python
name = input('Input your name: ')
print('Hello! ',name)
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200530200811.png" style="zoom:80%;" />



## 三、Python 基础

Python的语法比较简单，采用缩进方式，写出来的代码就像下面的样子：

```python
# print absolute value of an integer:
a = 100
if a >= 0:
    print(a)
else:
    print(-a)
```

缩进有利有弊。好处是强迫你写出格式化的代码，但没有规定缩进是几个空格还是Tab。按照约定俗成的惯例，**应该始终坚持使用 4 个空格的缩进。**

缩进的另一个好处是强迫你写出缩进较少的代码，你会倾向于把一段很长的代码拆分成若干函数，从而得到缩进较少的代码。

缩进的坏处就是“复制－粘贴”功能失效了，这是最坑爹的地方。当你重构代码时，粘贴过去的代码必须重新检查缩进是否正确。此外，IDE很难像格式化Java代码那样格式化Python代码。

最后，请务必注意，Python程序是**大小写敏感**的，如果写错了大小写，程序会报错。

### 1. 数据类型

Python中，能够直接处理的数据类型有以下几种：

- 整数
- 浮点数
- 字符串
- 布尔值 True / False
- 空值 None
- 列表 list/ tuple
- 字典 dict / set
- 自定义数据类型

#### ① 整数

Python可以处理任意大小的整数，当然包括负整数。

例如：`1`，`100`，`-8080`，`0`，等等。

#### ② 浮点数

浮点数也就是小数，之所以称为浮点数，是因为按照科学记数法表示时，一个浮点数的小数点位置是可变的，比如，1.23x109和12.3x108是完全相等的。浮点数可以用数学写法，如`1.23`，`3.14`，`-9.01`，等等。但是对于很大或很小的浮点数，就必须用科学计数法表示，把10用e替代，1.23x109就是`1.23e9`，或者`12.3e8`，0.000012可以写成`1.2e-5`，等等。

🚨 整数和浮点数在计算机内部存储的方式是不同的，**整数运算永远是精确的**（除法难道也是精确的？是的！），**而浮点数运算则可能会有四舍五入的误差。**

> 在Python中，有两种除法，一种除法是`/`：
>
> ```python
> print(10 / 3)
> # 输出 3.3333333333333335
> ```
>
> **`/`除法计算结果是浮点数，即使是两个整数恰好整除，结果也是浮点数：**
>
> ```python
> print(9 / 3)
> # 输出 3.0
> ```
>
> **还有一种除法是`//`，称为地板除，两个整数的除法仍然是整数**：
>
> ```python
> print(10 // 3)
> # 输出 3
> ```
>
> 你没有看错，整数的地板除`//`永远是整数，即使除不尽。要做精确的除法，使用`/`就可以。
>
> 因为`//`除法只取结果的整数部分，所以Python还提供一个余数运算，可以得到两个整数相除的余数：
>
> ```python
> print(10 % 3)
> # 输出 1
> ```
>
> 无论整数做`//`除法还是取余数，结果永远是整数，所以，整数运算结果永远是精确的。

#### ③ 字符串

字符串是以单引号`'`或双引号`"`括起来的任意文本，比如`'abc'`，`"xyz" `等等。

如果`'`本身也是一个字符，那就可以用`""`括起来，比如`"I'm OK"`包含的字符是`I`，`'`，`m`，空格，`O`，`K`这 6 个字符。

如果字符串内部既包含`'`又包含`"`怎么办？可以用转义字符`\`来标识，比如：

```python
'I\'m \"OK\"!'
```

表示的字符串内容是：

>  I'm "OK"!

转义字符`\`可以转义很多字符，比如`\n`表示换行，`\t`表示制表符，字符`\`本身也要转义，所以`\\`表示的字符就是`\`

💬 示例代码：

```python
print('\\\t\\')
# 输出：\       \
print(r'\\\t\\')
# 输出：\\\t\\
```

#### ④ 布尔值

在Python中，可以直接用`True`、`False`表示布尔值（请注意大小写），也可以通过布尔运算计算出来：

```python
print(3 > 2)
print(True)
```

布尔值可以用 `and`、`or` 和 `not` 运算：

```python
print(True and True) # True
print(True and False) # False
print(5 > 3 and 3 > 1) # True

print(not True) # False
print(not 1 > 3) # True

print(True or False) # True
print(5 > 13 or 1 > 3) # False
```

#### ⑤ 空值

空值是Python里一个特殊的值，用`None`表示。`None`不能理解为`0`，因为`0`是有意义的，而`None`是一个特殊的空值。

此外，Python还提供了列表、字典等多种数据类型，还允许创建自定义数据类型，我们后面会继续讲到。

#### ⑥ 列表

##### Ⅰ 可变的有序列表 list  [ ]

list是一种有序的集合，可以随时添加和删除其中的元素。

- **创建**

  比如，列出班里所有同学的名字，就可以用一个list表示：

  ```python
  classmates = ['Jack','Bod','Track']
  print(classmates) # 输出 ['Jack', 'Bod', 'Track']
  ```

  用`len()`函数可以获得 list 元素的个数：

  ```python
  print(len(classmates)) # 3
  ```

  🚩 list 里面的元素的数据类型可以不同，比如：

  ```python
  L = ['Apple', 123, True]
  ```

  list 元素也可以是 另一个 list，比如：

  ```python
  s = ['python', 'java', ['asp', 'php'], 'scheme']
  print(len(s)) # 4
  ```

  要注意`s`只有4个元素，其中`s[2]`又是一个list，如果拆开写就更容易理解了：

  ```python
  p = ['asp', 'php']
  s = ['python', 'java', p, 'scheme']
  ```

  要拿到`'php'`可以写`p[1]`或者`s[2][1]`，因此`s`可以看成是一个二维数组，类似的还有三维、四维……数组，不过很少用到。

  如果一个 list 中一个元素也没有，就是一个空的 list，它的长度为0：

  ```python
  L = []
  print(len(L)) # 0
  ```


- **访问**

  用索引来访问 list 中每一个位置的元素，记得索引是从 `0` 开始的：

  ```python
  print(classmates[0]) # Jack
  ```

  当索引超出了范围时，Python会报一个`IndexError`错误

  🚩 如果要取最后一个元素，除了计算索引位置外，还可以用`-1`做索引，直接获取最后一个元素：

  ```python
  print(classmates[-1]) # Track
  ```

  以此类推，可以获取倒数第2个、倒数第3个：

  ```python
  print(classmates[-1]) # Track
  print(classmates[-2]) # Bod
  print(classmates[-3]) # Jack
  ```

- **插入**

  list 是一个可变的有序表，所以，可以利用 `append` 往 list 中追加元素到末尾：

  ```python
  classmates.append('Admin')
  ```

  也可以利用 `insert` 把元素插入到指定的位置，比如索引号为`1`的位置：

  ```python
  classmates.insert(1,'Michael')
  ```

- **删除**

  要删除list末尾的元素，用`pop()`方法：

  ```python
  classmates.pop()
  ```

  要删除指定位置的元素，用`pop(i)`方法，其中`i`是索引位置：

  ```python
  classmates.pop(1)
  ```

- **替换**

  要把某个元素替换成别的元素，可以直接赋值给对应的索引位置：

  ```python
  classmates[1] = 'Sarah'
  ```

  

##### Ⅱ 不可变有序列表 - 元组 tuple ( )

tuple 和 list 非常类似，但是 tuple 一旦初始化就不能修改，比如同样是列出同学的名字：

```python
classmates = ('Michael', 'Bob', 'Tracy')
```

现在，classmates 这个 tuple 不能变了，它也没有 append()，insert() 这样的方法。其他获取元素的方法和list是一样的，你可以正常地使用`classmates[0]`，`classmates[-1]`，但不能赋值成另外的元素。

不可变的 tuple 有什么意义？因为 tuple 不可变，所以代码更安全。如果可能，能用 tuple 代替 list 就尽量用 tuple。

🚨 **tuple的陷阱**：当你定义一个tuple时，在定义的时候，tuple的元素就必须被确定下来，比如：

```python
t = (1, 2)
print(t) # (1, 2)
```

如果要定义一个空的tuple，可以写成`()`：

```python
t = ()
print(t) # ()
```

但是，要定义一个只有1个元素的tuple，如果你这么定义：

```python
t = (1)
print(t) # 1
```

定义的不是 tuple，是`1`这个数！这是因为括号`()`既可以表示 tuple，又可以表示数学公式中的小括号，这就产生了歧义，因此，**Python规定，这种情况下，按小括号进行计算**，计算结果自然是`1`。

所以，**只有 1 个元素的 tuple 定义时必须加一个逗号`,`，来消除歧义**：

```python
t = (1,)
print(t) # (1,)
```

<br>

最后来看一个 **“可变的”tuple** ：

```python
t = ('a', 'b', ['A', 'B'])
t[2][0] = 'X'
t[2][1] = 'Y'
print(t) # ('a', 'b', ['X', 'Y'])
```

这个tuple定义的时候有3个元素，分别是`'a'`，`'b'`和一个list。不是说tuple一旦定义后就不可变了吗？怎么后来又变了？

我们先看看定义的时候 tuple 包含的3个元素：

![](https://gitee.com/veal98/images/raw/master/img/20200530215046.png)

当我们把list的元素`'A'`和`'B'`修改为`'X'`和`'Y'`后，tuple变为：

![](https://gitee.com/veal98/images/raw/master/img/20200530215101.png)

表面上看，tuple的元素确实变了，但其实变的不是tuple的元素，而是list的元素。tuple一开始指向的list并没有改成别的list，所以，⭐ **tuple所谓的“不变”是说，tuple的每个元素，指向永远不变。即指向`'a'`，就不能改成指向`'b'`，指向一个list，就不能改成指向其他对象，但指向的这个list本身是可变的！**

理解了“指向不变”后，要创建一个内容也不变的tuple怎么做？那就必须保证tuple的每一个元素本身也不能变。

#### ⑦ 字典

##### Ⅰ dict（key-value）  { }

dict 全称 dictionary，<u>在其他语言中也称为 map</u>，使用 键-值（key-value）存储，具有极快的查找速度。

- **创建**

  示例代码：学生姓名和成绩

  ```python
  d = {'Michale':92, 'Bod':91, 'Jack':100}
  print(d) # {'Michale': 92, 'Bod': 91, 'Jack': 100}
  print(d['Michale']) # 92
  
  print(d[0]) # KeyError: 0
  ```

  把数据放入dict的方法，除了初始化时指定外，还可以通过key放入：

  ```python
  d['Adam'] = 88
  print(d) # {'Michale': 92, 'Bod': 91, 'Jack': 100, 'Adam': 88}
  ```

  请务必注意，dict内部存放的顺序和key放入的顺序是没有关系的。

- **判断 value 是否存在**

  由于一个 key 只能对应一个value，所以，**多次对一个 key 放入 value，后面的值会把前面的值冲掉**

  如果key不存在，dict就会报错：`KeyError`。要避免key不存在的错误，有两种办法，一是通过`in`判断 key 是否存在：

  ```python
  print('Thomas' in d) # False
  ```

  二是通过dict提供的 `get()` 方法，如果key不存在，可以返回`None`，或者自己指定的 value：

  ```python
  print(d.get('Thomas')) # None
  print(d.get('Thomas', -1) # -1
  ```

- **删除**

  要删除一个key，用`pop(key)`方法，对应的value也会从dict中删除：

  ```python
  d.pop('Bod')
  ```

<br>

⭐ 和 list 比较，dict有以下几个特点：

- 查找和插入的速度极快，不会随着 key 的增加而变慢；

- 需要占用大量的内存，内存浪费多。

而 list 相反：

- 查找和插入的时间随着元素的增加而增加；

- 占用空间小，浪费内存很少。

所以，dict 是用空间来换取时间的一种方法。

dict可以用在需要高速查找的很多地方，在Python代码中几乎无处不在，正确使用dict非常重要，需要牢记的第一条就是dict的key必须是**不可变对象**。

##### Ⅱ  set（key，且key不可重复） ([ ])

set和dict类似，也是一组key的集合，但不存储value。由于key不能重复，所以，在set中，没有重复的key。

set和dict的唯一区别仅在于没有存储对应的value，但是，set的原理和dict一样，所以，同样**不可以放入可变对象**，因为无法判断两个可变对象是否相等，也就无法保证set内部“不会有重复元素”。

- **创建**

  要创建一个set，需要提供一个 list 作为输入集合：

  ```python
  s = set([1, 2, 3])
  print(s) # {1, 2, 3}
  ```

  注意，传入的参数`[1, 2, 3]`是一个 list，而显示的`{1, 2, 3}`只是告诉你这个 set 内部有1，2，3 这3个元素，显示的顺序也不表示set是有序的。

  **重复元素在set中自动被过滤：**

  ```python
  s = set([1, 1, 2, 2, 3, 3])
  print(s) # {1, 2, 3}
  ```

- **添加**

  通过`add(key)`方法可以添加元素到set中，可以重复添加，但不会有效果：

  ```python
  s.add(4)
  print(s) # {1, 2, 3, 4}
  s.add(4)
  print(s) # {1, 2, 3, 4}
  ```

- **删除**

  通过`remove(key)`方法可以删除元素：

  ```python
  s.remove(4)
  print(s) # {1, 2, 3}
  ```

- **并集、交集操作**

  set 可以看成数学意义上的无序和无重复元素的集合，因此，两个set可以做数学意义上的交集、并集等操作：

  ```python
  s1 = set([1, 2, 3])
  s2 = set([2, 3, 4])
  print(s1 & s2) # {2, 3}
  print((s1 | s2) # {1, 2, 3, 4}
  ```

### 2. 不可变对象详解

上面我们讲了，**str / None 是不变对象，而 list 是可变对象**。

对于可变对象，比如 list，对 list 进行操作，list 内部的内容是会变化的，比如：

```python
a = ['c', 'b', 'a']
a.sort()
# a = ['a', 'b', 'c']
```

而对于不可变对象，比如str，对str进行操作呢：

```python
a = 'abc'
print(a.replace('a', 'A')) # 'Abc'
print(a) # 'abc'
```

虽然字符串有个`replace()`方法，也确实变出了`'Abc'`，但变量`a`最后仍是`'abc'`，应该怎么理解呢？

我们先把代码改成下面这样：

```python
a = 'abc'
b = a.replace('a', 'A')
print(b) # 'Abc'
print(a) # 'abc'
```

要始终牢记的是，`a`是变量，而`'abc'`才是字符串对象！有些时候，我们经常说，对象`a`的内容是`'abc'`，但其实是指，`a`本身是一个变量，它指向的对象的内容才是`'abc'`：

![](https://gitee.com/veal98/images/raw/master/img/20200530223254.png)

当我们调用`a.replace('a', 'A')`时，实际上调用方法`replace`是作用在字符串对象`'abc'`上的，而这个方法虽然名字叫`replace`，但却没有改变字符串`'abc'`的内容。相反，`replace`方法创建了一个新字符串`'Abc'`并返回，如果我们用变量`b`指向该新字符串，就容易理解了，变量`a`仍指向原有的字符串`'abc'`，但变量`b`却指向新字符串`'Abc'`了：

![](https://gitee.com/veal98/images/raw/master/img/20200530223307.png)

所以，对于不变对象来说，调用对象自身的任意方法，也不会改变该对象自身的内容。相反，这些方法会创建新的对象并返回，这样，就保证了不可变对象本身永远是不可变的。

### 3. 变量和常量

#### ① 变量

变量名必须是大小写英文、数字和 `_ `的组合，且不能用数字开头

在Python中，等号`=`是赋值语句，可以把任意数据类型赋值给变量，同一个变量可以反复赋值，而且可以是不同类型的变量，例如：

```python
a = 123 # a是整数
print(a)
a = 'ABC' # a变为字符串
print(a)
```

🚩 这种变量本身类型不固定的语言称之为 **动态语言 (Python、......)**，与之对应的是 **静态语言（Java、C++、......）**。静态语言在定义变量时必须指定变量类型，如果赋值的时候类型不匹配，就会报错。

理解变量在计算机内存中的表示也非常重要。当我们写：

```python
a = 'ABC'
```

时，Python解释器干了两件事情：

- 在内存中创建了一个`'ABC'`的字符串；

- 在内存中创建了一个名为`a`的变量，并把它指向`'ABC'`。

🔥 也可以把一个变量`a`赋值给另一个变量`b`，这个操作实际上是把变量`b`指向变量`a`所指向的数据，例如下面的代码：

```python
a = 'ABC'
b = a
a = 'XYZ'
print(b) # 输出 ABC
```

让我们一行一行地执行代码，就可以看到到底发生了什么事：

- 执行`a = 'ABC'`，解释器创建了字符串`'ABC'`和变量`a`，并把`a`指向`'ABC'`：

  ![](https://gitee.com/veal98/images/raw/master/img/20200530203840.png)

- 执行`b = a`，解释器创建了变量`b`，并把`b`指向`a`指向的字符串`'ABC'`：

  ![](https://gitee.com/veal98/images/raw/master/img/20200530203944.png)

- 执行`a = 'XYZ'`，解释器创建了字符串'XYZ'，并把`a`的指向改为`'XYZ'`，但`b`并没有更改：

  ![](https://gitee.com/veal98/images/raw/master/img/20200530203924.png)

- 所以，最后打印变量`b`的结果自然是`'ABC'`了。

#### ② 常量

在Python中，通常用**全部大写**的变量名表示常量：

```python
PI = 3.14159265359
```

但事实上`PI`仍然是一个变量，Python根本没有任何机制保证`PI`不会被改变，所以，🚨 **用全部大写的变量名表示常量只是一个习惯上的用法，如果你一定要改变变量`PI`的值，也没人能拦住你。**

### 4. 字符串和编码

#### ① 字符串编码问题

我们已经讲过了，字符串也是一种数据类型，但是，字符串比较特殊的是还有一个编码问题。

因为计算机只能处理数字，如果要处理文本，就必须先把文本转换为数字才能处理。最早的计算机在设计时采用8个比特（bit）作为一个字节（byte），所以，一个字节能表示的最大的整数就是255（二进制11111111=十进制255），如果要表示更大的整数，就必须用更多的字节。比如两个字节可以表示的最大整数是`65535`，4个字节可以表示的最大整数是`4294967295`。

由于计算机是美国人发明的，因此，最早只有127个字符被编码到计算机里，也就是大小写英文字母、数字和一些符号，这个编码表被称为`ASCII`编码，比如大写字母`A`的编码是`65`，小写字母`z`的编码是`122`。

但是要处理中文显然一个字节是不够的，至少需要两个字节，而且还不能和ASCII编码冲突，所以，中国制定了`GB2312`编码，用来把中文编进去。

你可以想得到的是，全世界有上百种语言，日本把日文编到`Shift_JIS`里，韩国把韩文编到`Euc-kr`里，各国有各国的标准，就会不可避免地出现冲突，结果就是，在多语言混合的文本中，显示出来会有乱码。

![](https://gitee.com/veal98/images/raw/master/img/20200530204516.png)

因此，Unicode应运而生。**Unicode把所有语言都统一到一套编码里，这样就不会再有乱码问题了。**

Unicode标准也在不断发展，但最常用的是用两个字节表示一个字符（如果要用到非常偏僻的字符，就需要4个字节）。现代操作系统和大多数编程语言都直接支持Unicode。

🚩 现在，捋一捋ASCII编码和Unicode编码的区别：**ASCII编码是1个字节，而Unicode编码通常是2个字节。**

- 字母`A`用ASCII编码是十进制的`65`，二进制的`01000001`；

- 字符`0`用ASCII编码是十进制的`48`，二进制的`00110000`，注意字符`'0'`和整数`0`是不同的；

- 汉字`中`已经超出了ASCII编码的范围，用Unicode编码是十进制的`20013`，二进制的`01001110 00101101`。

你可以猜测，如果把ASCII编码的`A`用Unicode编码，只需要在前面补0就可以，因此，`A`的Unicode编码是`00000000 01000001`。

新的问题又出现了：如果统一成Unicode编码，乱码问题从此消失了。但是，如果你写的文本基本上全部是英文的话，用Unicode编码比ASCII编码需要多一倍的存储空间，在存储和传输上就十分不划算。

所以，本着节约的精神，又出现了**把 Unicode 编码转化为“可变长编码”的`UTF-8`编码**。UTF-8编码把一个 Unicode 字符根据不同的数字大小编码成1-6个字节，**常用的英文字母被编码成 1 个字节，汉字通常是3个字节，只有很生僻的字符才会被编码成 4-6 个字节**。如果你要传输的文本包含大量英文字符，用 UTF-8 编码就能节省空间：

![](https://gitee.com/veal98/images/raw/master/img/20200530204736.png)

从上面的表格还可以发现，UTF-8编码有一个额外的好处，就是ASCII编码实际上可以被看成是UTF-8编码的一部分，所以，大量只支持ASCII编码的历史遗留软件可以在UTF-8编码下继续工作。

搞清楚了ASCII、Unicode和UTF-8的关系，我们就可以总结一下现在计算机系统通用的字符编码工作方式：

🚩 **在计算机内存中，统一使用 Unicode 编码，当需要保存到硬盘或者需要传输的时候，就转换为 UTF-8 编码。**

用记事本编辑的时候，从文件读取的 UTF-8 字符被转换为 Unicode 字符到内存里，编辑完成后，保存的时候再把 Unicode 转换为 UTF-8 保存到文件：

![](https://gitee.com/veal98/images/raw/master/img/20200530204845.png)

浏览网页的时候，服务器会把动态生成的 Unicode 内容转换为 UTF-8 再传输到浏览器：

![](https://gitee.com/veal98/images/raw/master/img/20200530204915.png)

所以你看到很多网页的源码上会有类似 `<meta charset="UTF-8" />` 的信息，表示该网页正是用的 UTF-8 编码。

#### ② 字符串详解

在最新的Python 3版本中，字符串是以 Unicode 编码的，也就是说，**Python 的字符串支持多语言**，例如：

```python
print('包含中文的str')
# 输出：包含中文的str
```

##### Ⅰ ord() 和 chr()

对于单个字符的编码，Python提供了<u>`ord()`函数获取字符的整数表示，`chr()`函数把编码转换为对应的字符：</u>

```python
ord('A') # 65
ord('中') # 20013
chr(66) # 'B'
chr(25991) # '文'
```

##### Ⅱ encode() 和 decode() 

由于Python的字符串类型是`str`，在内存中以 Unicode 表示，一个字符对应若干个字节。**如果要在网络上传输，或者保存到磁盘上，就需要把`str`变为以字节为单位的`bytes`。**

Python对`bytes`类型的数据用带`b`前缀的单引号或双引号表示：

```python
x = b'ABC'
```

要注意区分`'ABC'`和`b'ABC'`，前者是`str`，后者虽然内容显示得和前者一样，但`bytes`的每个字符都只占用一个字节。

以Unicode表示的`str`通过`encode()`方法可以编码为指定的`bytes`，例如：

```python
print('ABC'.encode('ascii'))
print('中文'.encode('utf-8'))
```

![](https://gitee.com/veal98/images/raw/master/img/20200530210116.png)

纯英文的`str`可以用`ASCII`编码为`bytes`，内容是一样的，含有中文的`str`可以用`UTF-8`编码为`bytes`。**含有中文的`str`无法用`ASCII`编码**，因为中文编码的范围超过了`ASCII`编码的范围，Python会报错。

反过来，如果我们从网络或磁盘上读取了字节流，那么读到的数据就是`bytes`。要把`bytes`变为`str`，就需要用`decode()`方法：

```python
print(b'ABC'.decode('ascii'))
print(b'\xe4\xb8\xad\xe6\x96\x87'.decode('utf-8'))
```

##### Ⅲ len()

要计算`str`包含多少个字符，可以用`len()`函数：

```python
print(len('ABC')) # 3
print(len('中文')) # 2
```

`len()`函数计算的是`str`的字符数，如果换成`bytes`，`len()`函数就计算字节数：

```python
print(len(b'ABC')) # 3
print(len(b'\xe4\xb8\xad\xe6\x96\x87')) # 6
print(len('中文'.encode('utf-8'))) # 6
```

可见，1 个中文字符经过 UTF-8 编码后通常会占用 3 个字节，而 1 个英文字符只占用 1 个字节。

> 🚨 在操作字符串时，我们经常遇到`str`和`bytes`的互相转换。为了避免乱码问题，应当始终坚持使用UTF-8编码对`str`和`bytes`进行转换。
>
> 由于Python源代码也是一个文本文件，所以，当你的源代码中包含中文的时候，**在保存源代码时，就需要务必指定保存为UTF-8编码**。当Python解释器读取源代码时，为了让它按UTF-8编码读取，我们通常在文件开头写上这两行：
>
> ```
> #!/usr/bin/env python3
> # -*- coding: utf-8 -*-
> ```
>
> 第一行注释是为了告诉Linux/OS X系统，这是一个Python可执行程序，Windows系统会忽略这个注释；
>
> 第二行注释是为了告诉Python解释器，按照UTF-8编码读取源代码，否则，你在源代码中写的中文输出可能会有乱码。

##### Ⅳ 占位符 %

`%`运算符就是用来格式化字符串的。在字符串内部，`%s`表示用字符串替换，`%d`表示用整数替换，有几个`%?`占位符，后面就跟几个变量或者值，顺序要对应好。如果只有一个`%?`，括号可以省略。

```python
print('Hello, %s' % 'world')
# 输出：Hello, world
print('Hello, %s, you have %d money' %('Jack',100))
# 输出：Hello, Jack, you have 100 money
```

常见的占位符有：

![](https://gitee.com/veal98/images/raw/master/img/20200530211547.png)

👍 如果你不太确定应该用什么，`%s`永远起作用，它会把任何数据类型转换为字符串：

```python
print('Age: %s Gender: %s' % (25, True))
# 输出：Age: 25 Gender: True
```

有些时候，字符串里面的`%`是一个普通字符怎么办？这个时候就需要转义，用`%%`来表示一个`%`：

```python
print(‘growth rate: %d %%' % 7)
# 输出：'growth rate: 7 %'
```

##### Ⅴ format()

另一种格式化字符串的方法是使用字符串的`format()`方法，它会用传入的参数依次替换字符串内的占位符`{0}`、`{1}`……，不过这种方式写起来比%要麻烦得多：

```python
print('Hello, {0}, 成绩提升了 {1:.1f}%'.format('小明', 17.125))
# 输出：Hello, 小明, 成绩提升了 17.1%
```

### 5. 条件判断

直接上代码：

示例1：

```python
age = 3
if age >= 18:
    print('your age is', age)
    print('adult')
else:
    print('your age is', age)
    print('teenager')
```

示例2：

```python
age = 3
if age >= 18:
    print('adult')
elif age >= 6:
    print('teenager')
else:
    print('kid')
```

`elif`是`else if`的缩写，完全可以有多个`elif`，所以`if`语句的完整形式就是：

```python
if <条件判断1>:
    <执行1>
elif <条件判断2>:
    <执行2>
elif <条件判断3>:
    <执行3>
else:
    <执行4>
```

⭐ `if`语句执行有个特点，它是从上往下判断，如果在某个判断上是`True`，把该判断对应的语句执行后，就忽略掉剩下的`elif`和`else`，所以，下面的程序打印的是`teenager`：

```python
age = 20
if age >= 6:
    print('teenager')
elif age >= 18:
    print('adult')
else:
    print('kid')
```

<br>

🚩 最后看一个有问题的条件判断：

```python
birth = input('birth: ')
if birth < 2000:
    print('00前')
else:
    print('00后')
```

输入`1982`，结果报错：

```python
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: unorderable types: str() > int()
```

**这是因为`input()`返回的数据类型是`str`，`str`不能直接和整数比较，必须先把`str`转换成整数**。Python提供了`int()`函数来完成这件事情：

```python
s = input('birth: ')
birth = int(s)
if birth < 2000:
    print('00前')
else:
    print('00后')
```

再次运行，就可以得到正确地结果。但是，如果输入`abc`呢？又会得到一个错误信息：

```python
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: invalid literal for int() with base 10: 'abc'
```

原来`int()`函数发现一个字符串并不是合法的数字时就会报错，程序就退出了。

如何检查并捕获程序运行期的错误呢？后面的错误和调试会讲到。

### 6. 循环

#### ① for ...in 循环

Python的循环有两种，一种是 `for...in` 循环，依次把 list 或 tuple 中的每个元素迭代出来，看例子：

```python
names = ['Michael', 'Bob', 'Tracy']
for name in names:
    print(name)
```

执行这段代码，会依次打印`names`的每一个元素：

> Michael
> Bob
> Tracy




再比如我们想计算1-10的整数之和，可以用一个`sum`变量做累加：

```python
sum = 0
for x in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]:
    sum = sum + x
print(sum)
```

如果要计算1-100的整数之和，从1写到100有点困难，幸好Python提供一个`range()`函数，可以生成一个整数序列，再通过`list()`函数可以转换为 list。比如`range(5)`生成的序列是从0开始小于5的整数：

```python
a = list(range(5))
print(a) # [0, 1, 2, 3, 4]
```

range(101)就可以生成0-100的整数序列，计算如下：

```python
sum = 0
for x in range(101):
    sum = sum + x
print(sum) # 5050
```

#### ② while 循环

第二种循环是while循环，只要条件满足，就不断循环，条件不满足时退出循环。

示例代码：

```python
sum = 0
n = 99
while n > 0:
    sum = sum + n
    n = n - 2
print(sum)
```

#### ③ break

在循环中，`break`语句可以提前退出循环。例如，本来要循环打印1～100的数字：

```python
n = 1
while n <= 100:
    print(n)
    n = n + 1
print('END')
```

如果要提前结束循环，可以用`break`语句：

```python
n = 1
while n <= 100:
    if n > 10: # 当n = 11时，条件满足，执行break语句
        break # break语句会结束当前循环
    print(n)
    n = n + 1
print('END')
```

执行上面的代码可以看到，打印出1~10后，紧接着打印`END`，程序结束。

可见`break`的作用是提前结束循环。

#### ④ continue

在循环过程中，也可以通过`continue`语句，跳过当前的这次循环，直接开始下一次循环。

```python
n = 0
while n < 10:
    n = n + 1
    print(n)
```

上面的程序可以打印出1～10。但是，如果我们想只打印奇数，可以用`continue`语句跳过某些循环：

```python
n = 0
while n < 10:
    n = n + 1
    if n % 2 == 0: # 如果n是偶数，执行continue语句
        continue # continue语句会直接继续下一轮循环，后续的print()语句不会执行
    print(n)
```

执行上面的代码可以看到，打印的不再是1～10，而是 1，3，5，7，9。

可见`continue`的作用是提前结束本轮循环，并直接开始下一轮循环。 

---

# 📚 References

<br>

- [廖雪峰 - Python3.x 教程](https://www.liaoxuefeng.com/wiki/1016959663602400/1016966022717728)