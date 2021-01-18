# 🧀 第 2 章 IPython 和 Jupyter Notebook

## 2.1 Python解释器 

Python是解释性语言。Python解释器同一时间只能运行一个程序的一条语句。标准的交互Python解释器可以在命令行中通过键入`python`命令打开：

```powershell
$ python
Python 3.6.0 | packaged by conda-forge | (default, Jan 13 2017, 23:17:12)
[GCC 4.8.2 20140120 (Red Hat 4.8.2-15)] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> a = 5
>>> print(a)
5
```

`>>>`提示输入代码。要退出Python解释器返回终端，可以输入`exit()`或按Ctrl-D。

运行Python程序只需调用Python的同时，使用一个`.py`文件作为它的第一个参数。假设创建了一个`hello_world.py`文件，它的内容是：

```python
print('Hello world')
```

你可以用下面的命令运行它（`hello_world.py`文件必须位于终端的工作目录）：

```python
$ python hello_world.py
Hello world
```

一些Python程序员总是这样执行Python代码的，从事数据分析和科学计算的人却会使用 **`IPython`，一个强化的 Python 解释器**，或 **`Jupyter notebooks`，一个网页代码笔记本**，它原先是 IPython 的一个子项目。在本章中，我介绍了如何使用IPython和Jupyter，在附录A中有更深入的介绍。当你使用`%run`命令，IPython 会同样执行指定文件中的代码，结束之后，还可以与结果交互：

```shell
$ ipython
Python 3.6.0 | packaged by conda-forge | (default, Jan 13 2017, 23:17:12)
Type "copyright", "credits" or "license" for more information.

IPython 5.1.0 -- An enhanced Interactive Python.
?         -> Introduction and overview of IPython's features.
%quickref -> Quick reference.
help      -> Python's own help system.
object?   -> Details about 'object', use 'object??' for extra details.

In [1]: %run hello_world.py
Hello world

In [2]:
```

IPython默认采用序号的格式`In [2]:`，与标准的`>>>`提示符不同。

## 2.2 IPython基础

在本节中，我们会教你打开运行IPython shell和jupyter notebook，并介绍一些基本概念。

### ① 运行IPython Shell

你可以用`ipython`在命令行打开IPython Shell，就像打开普通的Python解释器：

![](https://gitee.com/veal98/images/raw/master/img/20200607095619.png)

你可以通过输入代码并按Return（或Enter），运行任意Python语句。当你只输入一个变量，它会显示代表的对象：

```python
In [5]: import numpy as np

In [6]: data = {i : np.random.randn() for i in range(7)}

In [7]: data
Out[7]: 
{0: -0.20470765948471295,
 1: 0.47894333805754824,
 2: -0.5194387150567381,
 3: -0.55573030434749,
 4: 1.9657805725027142,
 5: 1.3934058329729904,
 6: 0.09290787674371767}
```

前两行是Python代码语句；第二条语句创建一个名为`data`的变量，它引用一个新创建的Python字典。最后一行打印`data`的值。

许多Python对象被格式化为更易读的形式，或称作`pretty-printed`，它与普通的`print`不同。如果在标准Python解释器中打印上述`data`变量，则可读性要降低：

```python
from numpy.random import randn
data = {i : randn() for i in range(7)}
print(data)
# {0: -1.5948255432744511, 1: 0.10569006472787983, 2: 1.972367135977295,3: 0.15455217573074576, 4: -0.24058577449429575, 5: -1.2904897053651216,6: 0.3308507317325902}
```

IPython还支持执行任意代码块（通过一个华丽的复制-粘贴方法）和整段 Python 脚本的功能。你也可以使用 Jupyter notebook 运行大代码块，接下来就会看到。

### ② 运行Jupyter Notebook

**notebook 是 Jupyter 项目的重要组件之一，它是一个代码、文本（有标记或无标记）、数据可视化或其它输出的交互式文档**。Jupyter Notebook 需要与内核互动，内核是Jupyter与其它编程语言的交互编程协议。**Python的Jupyter内核是使用IPython**。**要启动Jupyter，在命令行中输入`jupyter notebook`**

![](https://gitee.com/veal98/images/raw/master/img/20200607100109.png)

然后Jupyter会自动打开网页`http://localhost:8888/tree`，如下图所示：

![](https://gitee.com/veal98/images/raw/master/img/20200607100205.png)

要新建一个notebook，点击按钮 New，选择“Python3”或“conda\[默认项\]”。输入一行Python代码。然后按**Shift-Enter** 执行。

![](https://gitee.com/veal98/images/raw/master/img/20200607100330.png)

当保存notebook时（File目录下的Save and Checkpoint），会创建一个后缀名为`.ipynb`的文件。这是一个自包含文件格式，包含当前笔记本中的所有内容（包括所有已评估的代码输出）。可以被其它Jupyter用户加载和编辑。要加载存在的notebook，把它放到启动notebook进程的相同目录内。

虽然Jupyter notebook和IPython shell使用起来不同，本章中几乎所有的命令和工具都可以通用。

> ⭐ Jupyter Notebook 的默认文件位置保存在 C 盘，更改保存位置可参考此篇文章：👉 [Jupyter notebook文件默认存储路径以及更改方法](https://www.cnblogs.com/zwt20120701/p/11253297.html)

### ③ Tab补全

从外观上，IPython shell 和标准的 Python 解释器只是看起来不同。IPython shell的进步之一是具备其它IDE和交互计算分析环境都有的tab补全功能。在shell中输入表达式，按下Tab，会搜索已输入变量（对象、函数等等）的命名空间：

```python
In [1]: an_apple = 27

In [2]: an_example = 42

In [3]: an<Tab>
an_apple    and         an_example  any
```

在这个例子中，IPython呈现出了之前两个定义的变量和Python的关键字和内建的函数`any`。当然，你也可以补全任何对象的方法和属性：

```python
In [3]: b = [1, 2, 3]

In [4]: b.<Tab>
b.append  b.count   b.insert  b.reverse
b.clear   b.extend  b.pop     b.sort
b.copy    b.index   b.remove
```

同样也适用于模块：

```python
In [1]: import datetime

In [2]: datetime.<Tab>
datetime.date          datetime.MAXYEAR       datetime.timedelta
datetime.datetime      datetime.MINYEAR       datetime.timezone
datetime.datetime_CAPI datetime.time          datetime.tzinfo
```

在Jupyter notebook和新版的IPython（5.0及以上），自动补全功能是下拉框的形式。

![](https://gitee.com/veal98/images/raw/master/img/20200607101627.png)

> 笔记：注意，默认情况下，IPython会隐藏下划线开头的方法和属性，比如魔术方法和内部的“私有”方法和属性，以避免混乱的显示（和让新手迷惑！）这些也可以tab补全，但是你必须首先键入一个下划线才能看到它们。如果你喜欢总是在tab补全中看到这样的方法，你可以IPython配置中进行设置。可以在IPython文档中查找方法。

除了补全命名、对象和模块属性，Tab还可以补全其它的。当输入看似文件路径时（即使是Python字符串），按下Tab也可以补全电脑上对应的文件信息：

```python
In [7]: datasets/movielens/<Tab>
datasets/movielens/movies.dat    datasets/movielens/README
datasets/movielens/ratings.dat   datasets/movielens/users.dat

In [7]: path = 'datasets/movielens/<Tab>
datasets/movielens/movies.dat    datasets/movielens/README
datasets/movielens/ratings.dat   datasets/movielens/users.dat
```

结合`%run`，tab补全可以节省许多键盘操作。

另外，tab补全可以补全函数的关键词参数（包括等于号=）。见图2-4。

![](https://gitee.com/veal98/images/raw/master/img/20200607101905.png)

后面会仔细地学习函数。

### ④ 自省

🔵 **在变量前后使用问号？，可以显示对象的信息**：

![](https://gitee.com/veal98/images/raw/master/img/20200607102146.png)

这可以作为对象的自省。如果对象是一个函数或实例方法，定义过的文档字符串，也会显示出信息。假设我们写了一个如下的函数：

```python
def add_numbers(a, b):
    """
    Add two numbers together

    Returns
    -------
    the_sum : type of arguments
    """
    return a + b
```

然后使用 ? 符号，就可以显示如下的文档字符串：

```python
In [11]: add_numbers?
Signature: add_numbers(a, b)
Docstring:
Add two numbers together

Returns
-------
the_sum : type of arguments
File:      <ipython-input-9-6a548a216e27>
Type:      function
```

🔵 **使用 `??` 会显示函数的源码**：

```python
In [12]: add_numbers??
Signature: add_numbers(a, b)
Source:
def add_numbers(a, b):
    """
    Add two numbers together

    Returns
    -------
    the_sum : type of arguments
    """
    return a + b
File:      <ipython-input-9-6a548a216e27>
Type:      function
```

? 还有一个用途，就是像Unix或Windows命令行一样搜索IPython的命名空间。字符与通配符结合可以匹配所有的名字。例如，我们可以获得所有包含load的顶级NumPy命名空间：

```python
In [13]: np.*load*?
np.__loader__
np.load
np.loads
np.loadtxt
np.pkgload
```

### ⑤ %run命令

你可以用`%run`命令运行所有的Python程序。假设有一个文件`ipython_script_test.py`：

```python
def f(x, y, z):
    return (x + y) / z

a = 5
b = 6
c = 7.5

result = f(a, b, c)
```

可以如下运行：

```python
In [14]: %run ipython_script_test.py
```

这段脚本运行在空的命名空间（没有import和其它定义的变量），因此结果和普通的运行方式`python script.py`相同。文件中所有定义的变量（import、函数和全局变量，除非抛出异常），都可以在IPython shell中随后访问：

```python
In [15]: c
Out [15]: 7.5

In [16]: result
Out[16]: 1.4666666666666666
```

如果一个Python脚本需要命令行参数（在`sys.argv`中查找），可以在文件路径之后传递，就像在命令行上运行一样。

> Notes：如果想让一个脚本访问IPython已经定义过的变量，可以使用`%run -i`。

在Jupyter notebook中，你也可以使用`%load`，它将脚本导入到一个代码格中：

```python
>>> %load ipython_script_test.py

    def f(x, y, z):
        return (x + y) / z
    a = 5
    b = 6
    c = 7.5

    result = f(a, b, c)
```

### ⑥ 中断运行的代码

代码运行时按 `Ctrl-C`，无论是 %run 或长时间运行命令，都会导致`KeyboardInterrupt`。这会导致几乎所有Python程序立即停止，除非一些特殊情况。

> 🚨 当Python代码调用了一些编译的扩展模块，按 Ctrl-C 不一定将执行的程序立即停止。在这种情况下，你必须等待，直到控制返回Python解释器，或者在更糟糕的情况下强制终止Python进程。

### ⑦ 从剪贴板执行程序

如果使用 Jupyter notebook，你可以将代码复制粘贴到任意代码格执行。

在 IPython shell 中也可以从剪贴板执行。假设在其它应用中复制了如下代码：

```python
x = 5
y = 7
if x > 5:
    x += 1

    y = 8
```

最简单的方法是使用`%paste`和`%cpaste`函数。`%paste`可以直接运行剪贴板中的代码：

```python
In [17]: %paste
x = 5
y = 7
if x > 5:
    x += 1

    y = 8
## -- End pasted text --
```

`%cpaste`功能类似，但会给出一条提示：

```python
In [18]: %cpaste
Pasting code; enter '--' alone on the line to stop or use Ctrl-D.
:x = 5
:y = 7
:if x > 5:
:    x += 1
:
:    y = 8
:--
```

使用`%cpaste`，你可以粘贴任意多的代码再运行。你可能想在运行前，先看看代码。如果粘贴了错误的代码，可以用Ctrl-C中断。

### ⑧ 键盘快捷键

IPython 有许多键盘快捷键进行导航提示（类似Emacs文本编辑器或UNIX bash Shell）和交互shell的历史命令。下表总结了常见的快捷键。图2-5展示了一部分，如移动光标。

![](https://gitee.com/veal98/images/raw/master/img/20200607102815.png)

Jupyter notebooks有另外一套庞大的快捷键。因为它的快捷键比IPython的变化快，建议你参阅Jupyter notebook的帮助文档。

### ⑨ 魔术命令

IPython中 特殊的命令（Python中没有）被称作“魔术”命令。这些命令可以使普通任务更便捷，更容易控制IPython系统。魔术命令是在指令前添加百分号 % 前缀。例如，可以用`%timeit`（这个命令后面会详谈）测量任何 Python 语句，例如矩阵乘法，的执行时间：

```python
In [20]: a = np.random.randn(100, 100)

In [20]: %timeit np.dot(a, a)
10000 loops, best of 3: 20.9 µs per loop
```

魔术命令可以被看做IPython中运行的命令行。许多魔术命令有“命令行”选项，可以通过？查看：

```python
In [21]: %debug?
Docstring:
::

  %debug [--breakpoint FILE:LINE] [statement [statement ...]]

Activate the interactive debugger.

This magic command support two ways of activating debugger.
One is to activate debugger before executing code.  This way, you
can set a break point, to step through the code from the point.
You can use this mode by giving statements to execute and optionally
a breakpoint.

The other one is to activate debugger in post-mortem mode.  You can
activate this mode simply running %debug without any argument.
If an exception has just occurred, this lets you inspect its stack
frames interactively.  Note that this will always work only on the last
traceback that occurred, so you must call this quickly after an
exception that you wish to inspect has fired, because if another one
occurs, it clobbers the previous one.

If you want IPython to automatically do this on every exception, see
the %pdb magic for more details.

positional arguments:
  statement             Code to run in debugger. You can omit this in cell
                        magic mode.

optional arguments:
  --breakpoint <FILE:LINE>, -b <FILE:LINE>
                        Set break point at LINE in FILE.
```

魔术函数默认可以不用百分号，只要没有变量和函数名相同。这个特点被称为“自动魔术”，可以用`%automagic`打开或关闭。

一些魔术函数与Python函数很像，它的结果可以赋值给一个变量：

```python
In [22]: %pwd
Out[22]: '/home/wesm/code/pydata-book

In [23]: foo = %pwd

In [24]: foo
Out[24]: '/home/wesm/code/pydata-book'
```

IPython的文档可以在shell中打开，我建议你用`%quickref`或`%magic`学习下所有特殊命令。表2-2列出了一些可以提高生产率的交互计算和Python开发的IPython指令。

<img src="https://gitee.com/veal98/images/raw/master/img/20200607103251.png" style="zoom:80%;" />

### ⑩ 集成Matplotlib

IPython 在分析计算领域能够流行的原因之一是它非常好的集成了数据可视化和其它用户界面库，比如matplotlib。不用担心以前没用过matplotlib，本书后面会详细介绍。`%matplotlib`魔术函数配置了IPython shell和Jupyter notebook中的matplotlib。这点很重要，其它创建的图不会出现（notebook）或获取session的控制，直到结束（shell）。

在IPython shell中，运行`%matplotlib`可以进行设置，可以创建多个绘图窗口，而不会干扰控制台session：

```python
In [26]: %matplotlib
Using matplotlib backend: Qt4Agg
```

在JUpyter中，命令有所不同（图2-6）：

```python
In [26]: %matplotlib inline
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200607104447.png" style="zoom:80%;" />



---

# 📚 References

- 📕  [《利用Python进行数据分析-第2版-中文译版》](https://www.jianshu.com/p/04d180d90a3f)

  <img src="https://gitee.com/veal98/images/raw/master/img/20200607091609.png" style="zoom:50%;" />

- 🚝 [Gihub《Python数据分析》配套源码](https://github.com/wesm/pydata-book)

- 😋 [Jupyter notebook文件默认存储路径以及更改方法](https://www.cnblogs.com/zwt20120701/p/11253297.html)