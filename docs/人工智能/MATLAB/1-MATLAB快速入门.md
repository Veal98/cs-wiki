# 🚀 MATLAB 快速入门

---

> 🔊 本篇文章仅用于小白快速入门，知识点并不全。需要深入请继续关注本博或参阅其他资料

🔔 关于安装就不说了，可以查看一下你们学校有没有购买相关资源，本篇文档是基于 **R2020a** 版本的。

关于 [ MATLAB 字体颜色定制 ] 可参考该篇文章  👉 [MATLAB编辑器风格定制](https://blog.csdn.net/lafengxiaoyu/article/details/72866982)

## 1. 桌面基础知识

启动 MATLAB 时，桌面会以默认布局显示：

<img src="https://gitee.com/veal98/images/raw/master/img/20201022094413.png" style="zoom:50%;" />

桌面包括下列面板：

- **当前文件夹** - 访问您的文件。
- **命令行窗口** - 在命令行中输入命令（由提示符 (`>>`) 表示）。
- **工作区** - 浏览您创建或从文件导入的数据。

使用 MATLAB 时，可发出创建变量和调用函数的命令。例如，通过在命令行中键入以下语句来创建名为 `a` 的变量：

```matlab
a = 1
```

MATLAB 将变量 `a` 添加到工作区，并在命令行窗口中显示结果。

<img src="https://gitee.com/veal98/images/raw/master/img/20201022094444.png" style="zoom: 80%;" />

创建更多变量。

```matlab
b = 2
b = 

     2
     
c = a + b

c = 

     3
     
d = cos(a)

d = 

    0.5403
```

如果未指定输出变量，MATLAB 将使用变量 `ans`（*answer* 的缩略形式）来存储计算结果。

```matlab
cos(a)
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022094519.png" style="zoom: 80%;" />

**如果语句以分号结束，MATLAB 会执行计算，但不在命令行窗口中显示输出**。

```matlab
c = a * b;
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022094618.png" style="zoom: 80%;" />

按向上 (↑) 和向下箭头键 (↓) 可以重新调用以前的命令。在空白命令行中或在键入命令的前几个字符之后按箭头键。例如，要重新调用命令 `b = 2`，请键入 `b`，然后按向上箭头键：

<img src="https://gitee.com/veal98/images/raw/master/img/20201022094701.png" style="zoom:80%;" />

## 2. 矩阵和数组

*MATLAB* 是 `matrix laboratory` 的缩写形式。**MATLAB 主要用于处理整个的矩阵和数组，而其他编程语言大多逐个处理数值**。

⭐ **所有 MATLAB 变量都是多维数组，与数据类型无关。<u>矩阵 是指通常用来进行线性代数运算的二维数组</u>。**

### ① 矩阵/数组 创建

您可以采用多种不同方法在 MATLAB 中输入矩阵：

- 输入元素明确的列表。
- 从外部数据文件加载矩阵。
- 使用内置函数生成矩阵。
- 使用您自己的函数创建矩阵，并将其保存在文件中。

#### Ⅰ 输入元素明确的列表

要创建每行包含四个元素的数组/矩阵，请**使用逗号 (`,`) 或空格分隔各元素**。

```matlab
a = [1 2 3 4] % a = [1, 2, 3, 4]
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022095011.png" style="zoom:80%;" />

这种数组为**行向量**。

要创建包含多行的矩阵，请**使用分号 `;` 分隔各行**。

```matlab
a = [1 2 3; 4 5 6; 7 8 9]
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022095048.png" style="zoom:80%;" />

> 💡 如果语句无法容纳在一行中，请使用省略号（三个句点）`...` 后换行。例如，
>
> ```matlab
> a = [1 2 3; 
> 	4 5 6; 
> 	7 8 9]
> ```

#### Ⅱ 使用内置函数生成矩阵/数组

MATLAB 软件提供了四个用于生成基本矩阵/数组的函数。

| [`zeros`](https://ww2.mathworks.cn/help/matlab/ref/zeros.html) | 全部为零           |
| ------------------------------------------------------------ | ------------------ |
| [`ones`](https://ww2.mathworks.cn/help/matlab/ref/ones.html) | 全部为 1           |
| [`rand`](https://ww2.mathworks.cn/help/matlab/ref/rand.html) | 均匀分布的随机元素 |
| [`randn`](https://ww2.mathworks.cn/help/matlab/ref/randn.html) | 正态分布的随机元素 |

例如：

<img src="https://gitee.com/veal98/images/raw/master/img/20201022095256.png" style="zoom:80%;" />

### ② 矩阵和数组运算

#### Ⅰ 矩阵运算符

**MATLAB 允许您使用单一的算术运算符或函数来处理矩阵中的所有值**。

<img src="https://gitee.com/veal98/images/raw/master/img/20201022095510.png" style="zoom:80%;" />

要**转置**矩阵，请使用单引号 (`'`)：

<img src="https://gitee.com/veal98/images/raw/master/img/20201022095609.png" style="zoom:80%;" />

您可以使用 `*` 运算符执行标准矩阵乘法，这将计算行与列之间的内积。例如，矩阵乘以其逆矩阵 `inv` （**只有方阵才有逆矩阵**）可返回单位矩阵：

<img src="https://gitee.com/veal98/images/raw/master/img/20201022101832.png" style="zoom:80%;" />

请注意，`p` 不是整数值矩阵。MATLAB 将数字存储为浮点值，算术运算可以区分实际值与其浮点表示之间的细微差别。**使用 `format` 命令可以显示更多小数位数**：

<img src="https://gitee.com/veal98/images/raw/master/img/20201022102122.png" style="zoom:80%;" />

使用以下命令将显示内容重置为更短格式

```matlab
format short
```

**`format` 仅影响数字显示，而不影响 MATLAB 对数字的计算或保存方式**。

#### Ⅱ 数组运算符

如果矩阵不用于线性代数运算，则成为二维数值数组。数组的算术运算**按元素执行**。这意味着，加法和减法运算对数组和矩阵都是相同的，但乘法运算不相同。MATLAB 的乘法数组运算表示法中包含点 `.`。

运算符列表包括

| `+`  | 加法           |
| ---- | -------------- |
| `-`  | 减法           |
| `.*` | 逐元素乘法     |
| `./` | 逐元素除法     |
| `.\` | 逐元素左除     |
| `.^` | 逐元素幂       |
| `.'` | 非共轭数组转置 |

<img src="https://gitee.com/veal98/images/raw/master/img/20201022102432.png" style="zoom:80%;" />

##### 构建表

数组运算对构建表非常有用。假定 `n` 为列向量

```matlab
n = (0:9)'; # 0~9 步长为 1 的列向量
```

然后，

```matlab
pows = [n  n.^2  2.^n]
```

构建一个平方 以及 2 次幂的表：

```matlab
pows =
     0     0     1
     1     1     2
     2     4     4
     3     9     8
     4    16    16
     5    25    32
     6    36    64
     7    49   128
     8    64   256
     9    81   512
```

初等数学函数逐元素处理数组元素。因此

```matlab
format short g
x = (1:0.1:2)';
logs = [x log10(x)]
```

构建一个对数表：

```
 logs =
      1.0            0 
      1.1      0.04139
      1.2      0.07918
      1.3      0.11394
      1.4      0.14613
      1.5      0.17609
      1.6      0.20412
      1.7      0.23045
      1.8      0.25527
      1.9      0.27875
      2.0      0.30103
```

### ③ 串联

**串联是连接数组以便形成更大数组的过程**。实际上，第一个数组是通过将其各个元素串联起来而构成的。成对的方括号 `[]` 即为串联运算符。

使用逗号 `,` 将彼此相邻的数组串联起来称为**水平串联**。每个数组必须具有相同的行数：

```matlab
a = [1 2 3; 4 5 6; 7 8 10]

a = 

     1     2     3
     4     5     6
     7     8    10
     
A = [a,a]

A = 

     1     2     3     1     2     3
     4     5     6     4     5     6
     7     8    10     7     8    10
```

同样，如果各数组具有相同的列数，则可以使用分号 `;` **垂直串联**。

```matlab
A = [a; a]

A = 

     1     2     3
     4     5     6
     7     8    10
     1     2     3
     4     5     6
     7     8    10
```

### ④ 复数 Complex

复数包含实部和虚部，虚数单位是 `-1` 的平方根。

```matlab
sqrt(-1)
ans = 0.0000 + 1.0000i
```

要表示复数的虚部，请使用 `i` 或 `j`。

```matlab
c = [3+4i, 4+3j; -i, 10j]
c = 

   3.0000 + 4.0000i   4.0000 + 3.0000i
   0.0000 - 1.0000i   0.0000 +10.0000i
```

### ⑤ 幻方矩阵

首先解释一下幻方矩阵的概念：

```matlab
A = 
    16     3     2    13
     5    10    11     8
     9     6     7    12
     4    15    14     1
```

**幻方矩阵：如果沿任何行或列求和，或者沿两条主对角线中的任意一条求和，您将始终得到相同数字**

```matlab
sum(A) % 每列的和
ans =
    34    34    34    34
    
sum(A, 2) % 每行的和
ans =
    34
    34
    34
    34
    
diag(A) % 输出主对角线元素
ans =
    16
    10
     7
     1
     
sum(diag(A)) % 主对角线和
ans =
    34
    
% 从数学上讲，另一条对角线（即所谓的反对角线）并不是十分重要，因此 MATLAB 没有对此提供现成的函数。但原本用于图形的函数 fliplr 可以从左往右地翻转矩阵：

sum(diag(fliplr(A)))
ans =
    34
```

MATLAB 实际包含一个内置函数 `magic`，该函数可创建几乎任意大小的幻方矩阵：

```matlab
B = magic(4)
B = 
    16     2     3    13
     5    11    10     8
     9     7     6    12
     4    14    15     1
```



## 3. 索引

**MATLAB 中的每个变量都是一个可包含许多数字的数组**。如果要访问数组的选定元素，请使用索引。

以 4×4 幻方矩阵 `A` 为例：

```matlab
A = magic(4)
A = 

    16     2     3    13
     5    11    10     8
     9     7     6    12
     4    14    15     1
```

### ① 指定行和列下标

引用数组中的特定元素有两种方法。最常见的方法是指定行和列下标（🚨 **从 1 开始**），例如

```matlab
A(4,2)
ans = 14
```

### ② 线性索引

另一种方法不太常用，但有时非常有用，即**使用单一下标按顺序向下遍历每一列**：

```matlab
A(8)
ans = 14
```

使用单一下标引用数组中特定元素的方法称为**线性索引**。

### ③ 索引超出矩阵维度

如果尝试在赋值语句右侧引用数组外部元素，MATLAB 会引发错误。

```matlab
test = A(4,5)
Index exceeds matrix dimensions.
```

👍 **不过，您可以在赋值语句左侧指定当前维外部的元素。数组大小会增大以便容纳新元素**。

```matlab
A(4,5) = 17
A = 4×5

    16     2     3    13     0
     5    11    10     8     0
     9     7     6    12     0
     4    14    15     1    17
```

### ⑤ 冒号运算符

要引用多个数组元素，请使用冒号运算符，这使您可以指定一个格式为 `start:end` 的范围（**左闭右闭**）。例如，列出 `A` 前三行及第二列中的元素：

```matlab
A(1:3,2)
ans = 3×1

     2
    11
     7
```

**单独的冒号（没有起始值或结束值）指定该维中的所有元素**。例如，选择 `A` 第三行中的所有列：

```matlab
A(3,:)
ans = 1×5

     9     7     6    12     0
```

此外，**冒号运算符还允许您使用较通用的格式 `start:step:end` 创建等距向量值**。

```matlab
B = 0:10:100
B = 

     0    10    20    30    40    50    60    70    80    90   100
```

**如果省略中间的步骤（如 `start:end` 中），MATLAB 会使用默认步长值 `1`**：

```matlab
B = 0:2
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022103539.png" style="zoom:80%;" />

我们还可以使用冒号运算符交换某矩阵的列：

```matlab
B = magic(4)
B = 
    16     2     3    13
     5    11    10     8
     9     7     6    12
     4    14    15     1
     
A = B(:, [1 3 2 4])
A = 
    16     3     2    13
     5    10    11     8
     9     6     7    12
     4    15    14     1
```

### ⑥ 删除行和列

只需使用一对方括号即可从矩阵中删除行和列。首先

```matlab
X = A;
```

然后，要删除 `X` 的第二列，请使用

```matlab
X(:,2) = []
```

这会将 `X` 更改为

```matlab
X =
    16     2    13
     5    11     8 
     9     7    12
     4    14     1
```

**如果您删除矩阵中的单个元素，结果将不再是矩阵。因此，以下类似表达式将会导致错误**：

```matlab
X(1,2) = []
```

但是，使用单一下标可以删除一个元素或元素序列，并将其余元素重构为一个行向量。因此

```matlab
X(2:2:10) = []
```

生成

```matlab
X =
    16     9     2     7    13    12     1
```

### ⑦ 逻辑索引

根据逻辑和关系运算创建的逻辑向量可用于引用子数组。⭐ **假定 `X` 是一个普通矩阵，`L` 是一个由某个逻辑运算生成的同等大小的矩阵。那么，`X(L)` 指定 `X` 的元素，其中 `L` 的元素为非零**。

通过将逻辑运算指定为下标表达式，可以在一个步骤中完成这种下标。假定您具有以下数据集：

```matlab
x = [2.1 1.7 1.6 1.5 NaN 1.9 1.8 1.5 5.1 1.8 1.4 2.2 1.6 1.8];
```

[`NaN`](https://ww2.mathworks.cn/help/matlab/ref/nan.html) 是用于缺少的观测值的标记，例如，无法响应问卷中的某个项。要使用逻辑索引删除缺少的数据，请**使用 `isfinite(x)`，对于所有有限数值，该函数为 true；对于 `NaN` 和 `Inf`，该函数为 false**：

```matlab
x = x(isfinite(x))
x =
  2.1 1.7 1.6 1.5 1.9 1.8 1.5 5.1 1.8 1.4 2.2 1.6 1.8 % NaN 被去除了
```

现在，存在一个似乎与其他项很不一样的观测值，即 `5.1`。这是一个*离群值*。下面的语句可删除离群值，在本示例中，即比均值大三倍标准差的元素：

```matlab
x = x(abs(x-mean(x)) <= 3*std(x))
x =
  2.1 1.7 1.6 1.5 1.9 1.8 1.5 1.8 1.4 2.2 1.6 1.8 % NaN 和 5.1 被去除了
```

再比如使用逻辑索引将非质数设置为 0，以便高亮显示幻方矩阵中的质数的位置：

```matlab
A(~isprime(A)) = 0

A =
     0     3     2    13
     5     0    11     0
     0     0     7     0
     0     0     0     0
```

### ⑧ find 函数

[`find`](https://ww2.mathworks.cn/help/matlab/ref/find.html) 函数可用于确定与指定逻辑条件相符的数组元素的**索引**。`find` 以最简单的形式返回索引的列向量。转置该向量以便获取索引的行向量。例如，再次从幻方矩阵 A 开始：

```matlab
k = find(isprime(A))'
```

使用一维索引选取幻方矩阵中的质数的位置：

```matlab
k =
     2     5     9    10    11    13
```

使用以下命令按 `k` 确定的顺序将这些质数显示为行向量

```matlab
A(k)

ans =
     5     3     2    11     7    13
```

将 `k` 用作赋值语句的左侧索引时，会保留矩阵结构：

```matlab
A(k) = NaN

A =
    16   NaN   NaN   NaN
   NaN    10   NaN     8
     9     6   NaN    12
     4    15    14     1
```

## 4. 工作区变量

*工作区*包含在 MATLAB 中创建或从数据文件或其他程序导入的变量。使用 `whos` 可以查看工作区的内容：

<img src="https://gitee.com/veal98/images/raw/master/img/20201022103851.png" style="zoom:80%;" />           

此外，桌面上的“工作区”窗格也会显示变量：

<img src="https://gitee.com/veal98/images/raw/master/img/20201022103906.png" style="zoom:80%;" />

退出 MATLAB 后，工作区变量不会保留。使用 `save` 命令保存数据以供将来使用，

```matlab
save myfile.mat
```

通过保存，系统会使用 `.mat` 扩展名将工作区保存在当前工作文件夹中一个名为 MAT 文件的压缩文件中。

要清除工作区中的所有变量，请使用 `clear` 命令。

使用 `load` 将 MAT 文件中的数据还原到工作区。

```matlab
load myfile.mat
```

## 5. 文本和字符

### ① 字符串数组中的文本

当您处理文本时，将字符序列括在双引号中。可以将文本赋给变量。

```matlab
t = "Hello, world";
```

**如果文本包含双引号，请在定义中使用两个双引号**。

```matlab
q = "Something ""quoted"" and something else."
q = 

    "Something "quoted" and something else."
```

与所有 MATLAB 变量一样，`t` 和 `q` 为数组。它们的类或数据类型是 `string`。

```matlab
whos t
  Name        Size            Bytes  Class     Attributes
  t           1x1               174  string   
```

要将文本添加到字符串的末尾，请使用加号运算符 `+`。

```matlab
f = 71;
c = (f-32)/1.8;
tempText = "Temperature is " + c + "C"
tempText = 
"Temperature is 21.6667C"
```

与数值数组类似，字符串数组可以有多个元素。使用 `strlength` 函数求数组中每个字符串的长度。

```matlab
A = ["a","bb","ccc"; "dddd","eeeeee","fffffff"]
A = 
  
    "a"       "bb"        "ccc"    
    "dddd"    "eeeeee"    "fffffff"
    
strlength(A)
ans =

     1     2     3
     4     6     7
```

### ② 字符数组中的数据

有时，字符表示的数据并不对应到文本，例如 DNA 序列。您可以将此类数据存储在数据类型为 `char` 的字符数组中。**字符数组使用单引号**。

```matlab
seq = 'GCTAGAATCC';
whos seq
  Name      Size            Bytes  Class    Attributes
  seq       1x10               20  char               
```

**字符在内部作为数字存储**，而不会采用浮点格式存储。语句

```matlab
a = double(s)
```

将字符数组转换为数值矩阵，该矩阵包含每个字符的 ASCII 代码的浮点表示。结果为

```matlab
a =
    72    101    108    108    111
```

语句

```matlab
s = char(a)
```

是刚才转换的逆转换。

数组的每个元素都包含单个字符，可使用下标进行索引（从 1 开始）。

```matlab
seq(4)
ans = 
    'A'
```

使用方括号串联字符数组，就像串联数值数组一样：

<img src="https://gitee.com/veal98/images/raw/master/img/20201022110302.png" style="zoom:70%;" />

在字符串数组引入之前编写的程序中，字符数组很常见。接受 `string` 数据的所有 MATLAB 函数都能接受 `char` 数据，反之亦然。

## 6. 调用函数

MATLAB 提供了大量执行计算任务的函数。在其他编程语言中，函数等同于子例程或方法。

要调用函数，例如 `max`，请将其输入参数括在圆括号中：

```matlab
A = [1 3 5];
max(A)
ans = 5
```

如果存在多个输入参数，请使用逗号加以分隔：

```matlab
B = [10 6 4];
max(A, B)
ans = 1×3

    10     6     5
```

通过将函数赋值给变量，返回该函数的输出：

```matlab
maxA = max(A)
maxA = 5
```

如果存在多个输出参数，请将其括在方括号中：

```matlab
[maxA1, maxA2] = max(A)
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022111127.png" style="zoom: 67%;" />

**将任何字符输入括在单引号中**：

```matlab
disp('hello world')
hello world
```

**要调用不需要任何输入且不会返回任何输出的函数，请只键入函数名称**：

```matlab
clc
```

`clc` 函数清空命令行窗口。

## 7. 二维图和三维图

### ① 线图 plot

要创建二维线图，请使用 `plot` 函数。例如，绘制从 0 到 2*π* 之间的正弦函数值：

```matlab
x = 0:pi/100:2*pi;
y = sin(x);
plot(x,y)
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022111542.png" style="zoom: 50%;" />

可以标记轴并添加标题。

```matlab
xlabel('x')
ylabel('sin(x)')
title('Plot of the Sine Function')
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022111837.png" style="zoom: 67%;" />

通过向 `plot` 函数添加第三个输入参数，您可以使用红色虚线绘制相同的变量。

```matlab
plot(x,y,'r--')
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022111916.png" style="zoom:67%;" />

`'r--'` 为*线条设定*。每个设定可包含表示线条颜色、样式和标记的字符。标记是在绘制的每个数据点上显示的符号，例如，`+`、`o` 或 `*`。例如，`'g:*'` 请求绘制使用 `*` 标记的绿色点线：

<img src="https://gitee.com/veal98/images/raw/master/img/20201022112059.png" style="zoom:67%;" />

请注意，为第一幅绘图定义的标题和标签不再被用于当前的*图窗*窗口中。**默认情况下，每次调用绘图函数、重置坐标区及其他元素以准备新绘图时，MATLAB 都会清空图窗**。

**要将绘图添加到现有图窗中，请使用 `hold on`。在使用 `hold off` 或关闭窗口之前，当前图窗窗口中会显示所有绘图。**

```matlab
x = 0:pi/100:2*pi;
y = sin(x);
plot(x,y)

hold on

y2 = cos(x);
plot(x,y2,':')
legend('sin','cos')

hold off
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022112347.png" style="zoom:67%;" />

### ② 三维绘图 surf

三维图通常显示一个由带两个变量的函数（即 *z = f (x,y*)）定义的曲面图。

要计算 *z*，请首先使用 `meshgrid` 在此函数的域中创建一组 (*x,y*) 点。

```matlab
[X,Y] = meshgrid(-2:.2:2);                                
Z = X .* exp(-X.^2 - Y.^2);
```

然后，创建曲面图。

```matlab
surf(X,Y,Z)
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022112851.png" style="zoom: 67%;" />

`surf` 函数及其伴随函数 `mesh` 以三维形式显示曲面图。**`surf` 使用颜色显示曲面图的连接线和面。`mesh` 生成仅以颜色标记连接定义点的线条的线框曲面图**。

### ③ 子图 subplot

使用 `subplot` 函数可以在同一窗口的不同子区域显示多个绘图。

`subplot` 的前两个输入表示每行和每列中的绘图数。第三个输入指定绘图是否处于活动状态。例如，在图窗窗口的 2×2 网格中创建四个绘图。

```matlab
t = 0 : pi/10 : 2*pi;
[X,Y,Z] = cylinder(4*cos(t));
subplot(2,2,1); mesh(X); title('X');
subplot(2,2,2); mesh(Y); title('Y');
subplot(2,2,3); mesh(Z); title('Z');
subplot(2,2,4); mesh(X,Y,Z); title('X,Y,Z');
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022113342.png" style="zoom:67%;" />

## 8. 编程和脚本

*脚本*是最简单的一种 MATLAB 程序。**脚本是一个包含多行连续的 MATLAB 命令和函数调用的文件。在命令行中键入脚本名称即可运行该脚本**。

### ① 脚本

要创建脚本，请使用 `edit` 命令。

```
edit mysphere
```

该命令会打开一个名为 `mysphere.m` 的空白文件：

<img src="https://gitee.com/veal98/images/raw/master/img/20201022114907.png" style="zoom:67%;" />

输入代码，以创建一个单位球、将半径加倍并绘制结果图，**使用百分比 (`%`) 符号添加注释**：

```matlab
% Create and plot a sphere with radius r.
[x,y,z] = sphere;       % Create a unit sphere.
r = 2;
surf(x*r,y*r,z*r)       % Adjust each dimension and plot.
axis equal              % Use the same scale for each axis. 
 
% Find the surface area and volume.
A = 4*pi*r^2;
V = (4/3)*pi*r^3;
```

将文件保存在当前文件夹中。要运行脚本，请在命令行中键入脚本名称：

```matlab
mysphere
```

<img src="https://gitee.com/veal98/images/raw/master/img/20201022115103.png" style="zoom:67%;" />

还可以从编辑器使用**运行**按钮运行脚本：

<img src="https://gitee.com/veal98/images/raw/master/img/20201022115229.png" style="zoom: 67%;" />

### ② 实时脚本

您可以使用*实时脚本*中的格式设置选项来增强代码，而不是以纯文本编写代码和注释。**实时脚本有助于您查看代码和输出并与之交互，还可以包含格式化文本、方程和图像**。

例如，通过选择**另存为**并将文件类型更改为 MATLAB 实时代码文件 (`*.mlx`)，将 `mysphere` 转换为实时脚本。

<img src="https://gitee.com/veal98/images/raw/master/img/20201022115452.png" style="zoom: 67%;" />

然后，用格式化文本替换代码注释。例如：

- 将注释行转换为文本。选择以百分比符号开头的每一行，然后选择**文本**。删除百分比符号。

  <img src="https://gitee.com/veal98/images/raw/master/img/20201022115717.png" style="zoom: 67%;" />

- 重写文本以替换代码行末尾的注释。要将等宽字体应用于文本中的函数名，请选择 ![](https://gitee.com/veal98/images/raw/master/img/20201022115747.png)。要添加方程，请在**插入**选项卡上选择**方程**。

  <img src="https://gitee.com/veal98/images/raw/master/img/20201022115940.png" style="zoom:80%;" />

💡 要使用 `edit` 命令创建新的实时脚本，请在文件名中包含 `.mlx` 扩展名：

```matlab
edit newfile.mlx
```

### ③ 循环及条件语句

在任何脚本中，您都可以定义按循环重复执行或按条件执行的代码段。循环使用 `for` 或 `while` 关键字，条件语句使用 `if` 或 `switch`。**循环结束后需要使用 `end` 标明**

循环在创建序列时很有用。例如，创建一个名为 `fibseq` 的脚本，该脚本使用 `for` 循环来计算斐波那契数列的前 100 个数。在这个序列中，最开始的两个数是 1，随后的每个数是前面两个数的和，即 Fn = Fn-1 + Fn-2。

```matlab
N = 100;
f(1) = 1;
f(2) = 1;

for n = 3:N
    f(n) = f(n-1) + f(n-2);
end
f(1:10)
```

运行该脚本时，`for` 语句定义一个名为 `n` 的计数器，该计数器从 3 开始。然后，该循环重复为 `f(n)` 赋值，`n` 在每次执行中递增，直至达到 100。脚本中的最后一条命令 `f(1:10)` 显示 `f` 的前 10 个元素。

```matlab
ans =
     1     1     2     3     5     8    13    21    34    55 
```

条件语句仅在给定表达式为 true 时执行。例如，根据随机数的大小为变量赋值：`'low'`、`'medium'` 或 `'high'`。在本例中，随机数是在 1 和 100 之间的一个整数。

```matlab
num = randi(100)
if num < 34
   sz = 'low'
elseif num < 67
   sz = 'medium'
else
   sz = 'high'
end
```

### ④ 脚本位置

MATLAB 在特定位置中查找脚本及其他文件。要运行脚本，该文件必须位于当前文件夹或*搜索路径*中的某个文件夹内。

默认情况下，MATLAB 安装程序创建的 `MATLAB` 文件夹位于此搜索路径中。如果要将程序存储在其他文件夹，或者要运行其他文件夹中的程序，请将其添加到此搜索路径。在当前文件夹浏览器中选中相应的文件夹，右键点击，然后选择**添加到路径**。

## 9. 帮助和文档

所有 MATLAB® 函数都有辅助文档，这些文档包含一些示例，并介绍函数输入、输出和调用语法。从命令行访问此信息有多种方法：

- 使用 `doc` 命令在单独的窗口中打开函数文档。

  ```matlab
  doc mean
  ```

- 在键入函数输入参数的左括号之后暂停，此时命令行窗口中会显示相应函数的提示（函数文档的语法部分）。

  ```matlab
  mean(
  ```

  <img src="https://gitee.com/veal98/images/raw/master/img/20201022203850.png" style="zoom: 67%;" />

- 使用 `help` 命令可在命令行窗口中查看相应函数的简明文档。

  ```matlab
  help mean
  ```



## 📚 References

- [MATLAB R2020a 官方文档](https://ww2.mathworks.cn/help/matlab/index.html)