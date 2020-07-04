# ☕ Java 的基本程序设计结构

## 1. HelloWorld

下面看一个最简单的 Java 应用程序：

```java
public class FirstSample{
    public static void main(String[] args){
        System.out.println("Hello World!")
    }
}
```

这个程序虽然很简单， 但所有的 Java 应用程序都具有这种结构， 还是值得花一些时间来研究。

🚨 **源代码的文件名必须与公共类的名字相同**，并用 ` .java` 作为扩展名。因此，存储这段源代码的文件名必须为 `FirstSample.java`  (再次提醒大家注意，大小写是非常重要的， 千万不能写成 `firstsample.java`) 

运行已编译的程序时，Java 虚拟机将从指定类中的 main 方法开始执行（这里的“ 方法” 就是 Java 中所说的“ 函数”），因此为了代码能够执行，在类的源文件中必须包含一个 main 方法。

> 📜 根据 Java 语言规范， **`main` 方法必须声明为 `public`** 

> 📜 Java 的类与 C++ 的类很相似， 但还是有些差异会使人感到困惑。 例如， **Java 中的所有函数都属于某个类的方法**（标准术语将其称为方法， 而不是成员函数）。因此，J**ava 中的 main 方法必须有一个外壳类**。 读者有可能对 C++ 中的静态成员函数（ static member functions) 十分熟悉。这些成员函数定义在类的内部， 并且不对对象进行操作。**Java 中的 `main `方法必须是静态的**。 最后， 与 C/C++ —样， 关键字 void 表示这个方法没有返回值， 所不同的是 **main 方法没有为操作系统返回“ 退出代码” .  如果 main 方法正常退出， 那么 Java 应用程序的退出代码为 0, 表示成功地运行了程序**。如果希望在终止程序时返回其他的代码， 那就需要调用 `System.exit` 方法。

> 💡  `System.out` 还有一个 `print`方法， 它在输出之后不换行。

## 2. 注释

在 Java 中，有 3 种标记注释的方式。

- 最常用的方式是使用 `//`，其注释内容从 `//` 开始到本行结尾
- 当需要长篇的注释时， 既可以在每行的注释前面标记 /，/ 也可以使用 `/*` 和 `*/ `将一段比较长的注释括起来
- 最后，第 3 种注释可以用来自动地生成文档。这种注释以 `/ **` 开始， 以 `*/` 结束。

<img src="https://gitee.com/veal98/images/raw/master/img/20200616201042.png" style="zoom: 80%;" />

> 🚨 在 Java 中，`/* */ `注释不能嵌套 „ 也就是说， 不能简单地把代码用 `/*` 和 `*/` 括起来 作为注释， 因为这段代码本身可能也包含一个  `*/` ,

## 3. 数据类型

**Java 是一种强类型语言。这就意味着必须为每一个变量声明一种类型**（Python 就是弱类型语言）。在 Java 中， 共有 8 种基本类型（ primitive type ),  其中有 4 种整型、2  种浮点类型、 1  种用于表示 Unicode 编码的字符单元的字符类型 char  和 1 种用于表示真值的 boolean 类型。

> 📜  Java 有一个**能够表示任意精度的算术包**， 通常称为 `大数值（ bignumber)` ，虽然被称为大数值，但**它并不是一种新的 Java 类型，而是一个 Java 对象**。 本章稍后将会详细地介绍它的用法。

### ① 整形 int / short / long / byte

整型用于表示没有小数部分的数值， 它允许是负数。Java 提供了 4 种整型，具体内容如 表 3-1 所示：

![](https://gitee.com/veal98/images/raw/master/img/20200616201712.png)

👍 **在 Java 中， 整型的范围与运行 Java 代码的机器无关（平台无关性）。**这就解决了软件从一个平台移植到另一个平台，或者在同一个平台中的不同操作系统之间进行移植给程序员带来的诸多问题。与 此相反，C 和 C++ 程序需要针对不同的处理器选择最为高效的整型， 这样就有可能造成一个在 32 位处理器上运行很好的 C 程序在 16 位系统上运行却发生整数溢出。**由于 Java 程序必须保证在所有机器上都能够得到相同的运行结果， 所以各种数据类型的取值范围必须固定。**同样的，由于这个原因 ，**Java 中也没有 `sizeof`**。

长整型数值有一个后缀 L 或 1 ( 如 4000000000L) 。十六进制数值有一个前缀 0x 或 0X (如 0xCAFEL 八进制有一个前缀 0 , 例如， 010 对应八进制中的 8。 <u>很显然， 八进制表示法比较容易混淆， 所以建议最好不要使用八进制常数。</u> 

从 Java 7 开始， 加上前缀 0b 或 0B 就可以写二进制数。例如，0b1001 就是 9。 另外，同样是 从 Java 7 开始，还**可以为数字字面量加下划线**，如用 1_000_000 表示一百万。**这些下划线只是为了提高可读性，Java 编译器会去除这些下划线**。

> 📜 **在 C 和 C++ 中， int 和 long 等类型的大小与目标平台相关**。在 8086 这样的 16 位处理器上整型数值占 2 字节；不过， 在 32 位处理器（比如 Pentium 或 SPARC) 上， 整型数值则为 4 字节。 类似地， 在 32 位处理器上 long 值为 4 字节， 在 64 位处理器上则 为 8 字节。由于存在这些差别， 这对编写跨平台程序带来了很大难度。 **在 Java 中， 所有的数值类型所占据的字节数量与平台无关。** 
>
> 注意， **Java 没有任何无符号（unsigned) 形式的 int、 long、short 或 byte 类型**。

### ② 浮点类型 float / double

浮点类型用于表示有小数部分的数值。在 Java 中有两种浮点类型，具体内容如表 3-2 所示：

![](https://gitee.com/veal98/images/raw/master/img/20200616202411.png)

`double `表示这种类型的数值精度是 `float `类型的两倍（有人称之为双精度数值)。绝大部分应用程序都采用 `double `类型。在很多情况下，`float` 类型的精度很难满足需求。实际上，只有很少的情况适合使用 `float` 类型，例如，需要单精度数据的库， 或者需要存储大量数据。 

`float `类型的数值有一个后缀 F 或 f (例如，3.14F) 。**没有后缀 F 的浮点数值（如 3.14 ) 默认为 `double `类型**。当然，也可以在浮点数值后面添加后缀 D 或 d (例如，3.14D) 。

所有的浮点数值计算都遵循 IEEE 754 规范。具体来说，<u>下面是用于表示溢出和出错情况的三个特殊的浮点数值：</u> 

- 正无穷大  `Double_POSITIVE_INFINITY`
- 负无穷大  `Double.NEGATIVEJNFINITY`
- NaN (不是一个数字）  `Double.NaN`

例如， 一个正整数除以 0 的结果为正无穷大。计算 0/0 或者负数的平方根结果为 NaN

🚨 特别要说明的是， **不能**这样检测一个特定值是否等于` Double.NaN`: 

```java
if (x == Double.NaN) // is never true
```

 所有“ 非数值” 的值都认为是不相同的。然而，可以使用 `Double.isNaN` 方法：

```java
if(Double.isNaN(x))
```

> 🚨 **浮点数值不适用于无法接受舍入误差的金融计算中**。 例如，命令 `System.out.println ( 2.0-1.1 ) `将打印出 0.8999999999999999, 而不是人们想象的 0.9。<u>这种舍入误差的主要原因是浮点数值采用二进制系统表示， 而在二进制系统中无法精确地表示分数 1/10</u>。这 就好像十进制无法精确地表示分数 1/3 —样。**如果在数值计算中不允许有任何舍入误差， 就应该使用 `BigDecimal` 类**， 本章稍后将介绍这个类。

### ③ char 类型

**`char `类型的字面量值要用<u>单引号</u>括起来**。例如：`'A'` 是编码值为 65 所对应的字符常量。它与 `"A"` 不同，`"A"` 是包含一个字符 A 的字符串,  `char` 类型的值可以表示为十六进制值，其范围从 `\u0000` 到 `\Uffff`。

除了转义序列 `\u` 之外， 还有一些用于表示特殊字符的转义序列， 请参看表 3-3：

![](https://gitee.com/veal98/images/raw/master/img/20200616203659.png)

### ④ Unicode 和 char 类型

要想弄清 `char `类型， 就必须了解 Unicode 编码机制。Unicode 打破了传统字符编码机制 的限制。 在 Unicode 出现之前， 已经有许多种不同的标准：美国的 ASCII、 西欧语言中的 ISO 8859-1 俄罗斯的 KOI-8、 中国的 GB 18030 和 BIG-5 等。这样就产生了下面两个问题： 一个是对于任意给定的代码值，在不同的编码方案下有可能对应不同的字母；二是采用大字 符集的语言其编码长度有可能不同。例如，有些常用的字符采用单字节编码， 而另一些字符则需要两个或更多个字节。 

设计 Unicode 编码的目的就是要解决这些问题。在 20 世纪 80 年代开始启动设计工作时， 人们认为两个字节的代码宽度足以对世界上各种语言的所有字符进行编码， 并有足够的空间 留给未来的扩展。在 1991 年发布了 Unicode 1.0, 当时仅占用 65 536 个代码值中不到一半的 部分。在设计 Java 时决定采用 16 位的 Unicode 字符集，这样会比使用 8 位字符集的程序设 计语言有很大的改进。 

十分遗憾， 经过一段时间， 不可避免的事情发生了。Unicode 字符超过了 65 536 个，其 主要原因是增加了大量的汉语、 日语和韩语中的表意文字。现在，16 位的 `char `类型已经不能满足描述所有 Unicode 字符的需要了。

![](https://gitee.com/veal98/images/raw/master/img/20200616204221.png)

**强烈建议不要在程序中使用 char 类型，除非确实需要处理 UTF-16 代码单元。最好将字符串作为抽象数据类型处理。**

### ⑤ boolean 类型

boolean (布尔）类型有两个值：`false` 和 `true`, 用来判定逻辑条件。🚨 **整型值和布尔值之间不能进行相互转换**。

> 📜 **在 C++ 中， 数值甚至指针可以代替 boolean 值。值 0 相当于布尔值 false, 非 0 值相当于布尔值 true, 在 Java 中则不是这样**。 因此， Java 程序员不会遇到下述麻烦： 
>
> ```java
> if (x = 0) // oops... meant x = 0 
> ```
>
> 在 C++ 中这个测试可以编译运行， 其结果总是 false；
>
> 而在 Java 中， 这个测试将不 能通过编译， 其原因是**整数表达式 x = 0 不能转换为布尔值**。

## 4. 变量

```java
double salary;
int vacationDays;
long earthPopulations;
boolean done;
```

**变量名对大小写敏感**， 例如，`hireday` 和 `hireDay `是两个不同的变量名 , ,在对两个不同的变量进行命名时， 最好不要只存在大小写上的差异。

### ① 变量初始化

声明一个变量之后，必须用赋值语句对变量进行显式初始化， **千万不要使用未初始化的变量**。

例如， Java 编译器认为下面的语句序列是错误的：

```java
int a;
System.out.println(a);
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200616204933.png" style="zoom:80%;" />

正确做法：

```java
int a = 10
// 或者
int b;
b = 10;
```

> 📜 **C 和 C++ 区分变量的声明与定义**。
>
> 例如： `int i = 10;` 是一个定义， 而 `extern int i; ` 是一个声明。
>
> **在 Java 中， 不区分变量的声明与定义**。

### ② 常量 final

在 Java 中， 利用关键字 `final` 指示常量。例如：

```java
public class Demo{

    public static void main(String[] args) {
        final double ABC = 2.54;
        double b = 8.5;
        double c = 11;
        System.out.println("ABC + b + c = " + (ABC+b+c));      
    }
}
```

**关键字 `final` 表示这个变量只能被赋值一次。一旦被赋值之后，就不能够再更改了。习惯上, 常量名使用全大写。**

```java
final int A = 1;
// A = 2;  // cannot assign value to final variable 'A'
```

在 Java 中，经常希望某个常量可以在一个类中的多个方法中使用，通常将这些常量称为 **类常量**。可以使用关键字 `static final` 设置一个类常量。 下面是使用类常量的示例：

```java
public class Demo{
    
    public static final double ABC = 2.54;
    
    public static void main(String[] args) {
        double b = 8.5;
        double c = 11;
        System.out.println("ABC + b + c = " + (ABC+b+c));
        
    }
}
```

需要注意， 类常量的定义位于 `main `方法的外部。因此，在同一个类的其他方法中也可以使用这个常量。而且，如果一个常量被声明为 `public`，那么其他类的方法也可以使用这个常量。

> 📜 `const` 是 Java 保留的关键字，但目前并没有使用。**在 Java 中， 必须使用 `final` 定义常量**。

## 5. 运算符

在 Java 中，使用算术运算符 ``+ 、-、 * 、/`` 表示加、减、 乘、除运算。 **当参与 `/ `运算的两个操作数都是整数时， 表示整数除法；否则， 表示浮点除法。** 整数的求余操作（有时称为取模) 用 `％` 表示。

🚨 需要注意， **整数被 0 除将会产生一个异常， 而浮点数被 0 除将会得到无穷大或 NaN 结果**

### ① 数学函数与常量

在 `Math `类中，包含了各种各样的数学函数。在编写不同类别的程序时，可能需要的函数也不同。 

- 要想计算一个数值的**平方根**， 可以使用 `sqrt` 方法：

    ```java
    double y = Math.sqrt(4);
    ```

- 在 Java中，没有**幂运算**， 因此需要借助于 `Math `类的 `pow` 方法

    ```java
    double y = Math.pow(4,2) // y = 4^2 = 16
    ```

- Math 类提供了一些常用的三角函数

  - `Math.sin`

  - `Math.cos`

  - `Math.tan`

  - `Math.atan`

  - `Math.atan2`

- 还有指数函数以及它的反函数 — 自然对数以及以 10 为底的对数
  
  - `Math.exp`
  
  - `Math.log`
  
  - `Math.log10`

- 最后，Java 还提供了两个用于表示 π 和 e 常量的近似值:

  - `Math.PI`

  - `Math.E`

> 🚩 不必在数学方法名和常量名前添加前缀 “ `Math`”， 只要在源文件的顶部加上下面这行代码就可以了：
>
> ```java
> import static java.lang.Math.*;
> ```
>
> 例如：
>
> ```java
> System.out.println(sqrt(PI));
> ```
>
> 在<u>第 2 章 对象与类</u> 中将讨论**静态导入**。

### ② 数值类型之间的转换

经常需要将一种数值类型转换为另一种数值类型。图 3-1 给出了数值类型之间的合法转换。

![](https://gitee.com/veal98/images/raw/master/img/20200616211518.png)

**在图 3-1 中有 6 个实心箭头，表示无信息丢失的转换；有 3 个虚箭头， 表示可能有精度损失的转换**。 

例如，123 456 789 是一个大整数 int， 它所包含的位数比 float 类型所能够表达的 位数多。 当将这个整型数值转换为 float 类型时， 将会得到同样大小的结果，但却失去了一定的精度。

```java
public static void main(String[] args) {
        int n = 123456789;
        float f = n;
        System.out.println(f); // 1.23456792E8
    }
```

当使用上面两个数值进行二元操作时（例如 n + f，n 是整数， f 是浮点数)， **先要将两个操作数转换为同一种类型，然后再进行计算**。

- **如果两个操作数中有一个是 double 类型， 另一个操作数就会转换为 double 类型**。 
- **否则**，如果其中一个操作数是 **float** 类型，另一个操作数将会转换为 float 类型。 
- **否则**， 如果其中一个操作数是 **long** 类型， 另一个操作数将会转换为 long 类型。 
- **否则**， 两个操作数都将被转换为 **int** 类型。

### ③ 强制类型转换

在上一小节中看到， 在必要的时候， `int `类型的值将会自动地转换为 `double `类型。但另 一方面，有时也需要将 `double `转换成 `int`。 在 Java 中， 允许进行这种数值之间的类型转换。 当然， 有可能会丢失一些信息。在这种情况下，需要通过**强制类型转换（cast )**  实现这个操 作。强制类型转换的语法格式是在圆括号中给出想要转换的目标类型，后面紧跟待转换的变量名。例如：

```java
double x = 9.997
int nx = (int) x; // nx = 9
```

这样， 变量 nx 的值为 9。**强制类型转换通过截断小数部分将浮点值转换为整型**。

如果想对浮点数进行舍人运算， 以便得到最接近的整数（在很多情况下， 这种操作更有 用，) 那就需要使用 `Math_ round` 方法：

```java
double x = 9.997;
int nx = (int) Math.round(x); // nx = 10
```

现在， 变量 nx 的值为 10。 **当调用 `round `的时候， 仍然需要使用强制类型转换 。其原因是 `round `方法返回的结果为 `long `类型**，由于存在信息丢失的可能性，所以只有使用显式的强制类型转换才能够将 `long `类型转换成 `int `类型。

### ④ 结合赋值和运算符

```java
int x = 1;
x += 4 // 等价于 x = x + 4
```

**如果运算符得到一个值， 其类型与左侧操作数的类型不同， 就会发生强制类型转换**。 

例如：

```java
int x = 1;
x += 3.5; // 等价于 x = (int)(x+3.5)
```

### ⑤ 自增与自减运算符

在 Java 中， 借鉴了 C 和 C++ 的做法，也提供了自增、 自减运算符：` n++ `将变量 n 的当前值加 1, `n--` 则将 n 的值减 1。例如， 以下代码： 

```java
int n = 12; 
n++; // n =13
```

**由于这些运算符会改变变量的值，所以它们的操作数不能是数值。例如， `4++` 就不是一个合法的语句**。

实际上， 这些运算符有两种形式；上面介绍的是运算符放在操作数后面的“ 后缀” 形式。 还有一种“ 前缀” 形式：`++n`。后缀和前缀形式都会使变量值加 1 或减 1。但用在表达式中时， 二者就有区别了。**前缀形式会先完成加 1;  而后缀形式会使用变量原来的值**。

```java
int m = 7;
int n = 7;
int a = 2 * ++m // a = 16 m = 8
int b = 2 * n++ // b = 14 n = 8
```

👍 <u>建议不要在表达式中使用` ++`, 因为这样的代码很容易让人困惑，而且会带来烦人的 bug。</u>

### ⑥ 关系和 boolean 运算符

常用的关系运算符：

- `==`

- `!=`

- `> / <`

- `>= / <=`

- `&&` 逻辑与

- `||` 逻辑或

  `&&` 和`|| `运算符具有**短路特性**： 如果第一个操作数已经能够确定表达式的值，第二个操作数就不必计算了。如果用 && 运算符合并两个表达式， `expressioni && expression`， 而且已经计算得到第一个表达式的真值为 false, 那么结果就不可能为 true。因此， 第二个表达式就不必计算了。可以利用这一点来避免错误。

- `! `逻辑非

- 三元操作符 `? : ,` 

### ⑦ 位运算符

处理整型类型时，可以直接对组成整型数值的各个位完成操作。这意味着可以使用掩码技术得到整数中的各个位。位运算符包括：

- `&` and
- `|` or
- `^` xor
- `~` not

另外，还有 `>>` 和 `<<` 运算符将位模式左移或右移。

最后，`>>>` 运算符会用 0 填充高位，这与`>>`不同，它会用符号位填充高位。不存在`<<< `运算符。

### ⑧ 括号与运算符级别

表 3-4 给出了运算符的优先级。 如果不使用圆括号， 就按照给出的运算符优先级次序进行计算。同一个级别的运算符按照从左到右的次序进行计算（除了表中给出的从右向左结合运算符外）。

![](https://gitee.com/veal98/images/raw/master/img/20200616213544.png)

例如，由于 `&&` 的优先级比 `|| `的优先级高， 所以表达式

`a && b || c` = `(a && b) || c`

又因为 `+=` 是右结合运算符， 所以表达式

`a += b += c` = `a += (b += c)`

## 6. 枚举类型 enum

有时候，变量的取值只在一个有限的集合内。例如： 销售的服装或比萨饼只有小、中、 大和超大这四种尺寸。当然， 可以将这些尺寸分别编码为 1、2、3、4 或 S、 M、 L、X。但 这样存在着一定的隐患。在变量中很可能保存的是一个错误的值（如 0 或 m)。 针对这种情况， 可以自定义枚举类型。枚举类型包括有限个命名的值。 例如：

```java
public enum Size{SMALL, MEDIUM, LARGE, EXTRA_LARGE};
```

现在，可以声明这种类型的变量：

```java
size = Size.MEDIUM;
```

Size 类型的变量只能存储这个类型声明中给定的某个枚举值，或者 null 值，**null 表示这个变量没有设置任何值**。

<u>实际上， 这个声明定义的类型是一个类， 它刚好有 4 个实例， 在此尽量不要构造新对象</u>。 

因此，**在比较两个枚举类型的值时， 永远不需要调用 `equals`, 而直接使用“ `==`” 就可以了**。

如果需要的话， 可以在枚举类型中添加一些构造器、 方法和域。当然，构造器只是在构造枚举常量的时候被调用。下面是一个示例：

```java
public enum Size{
    SMALL("S"), MEDIUM("M"), LARGE("L"), EXTRA_LARGE("XL");
    
    private String abbreviation;
    
    private Size(String abbreviation) { 
        this.abbreviation = abbreviation; 
    }
    
    public String getAbbreviation() { 
        return abbreviation; 
    }
}
```

所有的枚举类型都是 `Enum `类的子类。它们继承了这个类的许多方法。其中最有用的一个是 `toString`， 这个方法能够返回枚举常量名。例如， `Size.SMALL.toString()` 将返回字符串 `“SMALL”`。

`toString`  的逆方法是静态方法 `valueOf`。例如， 语句：

```java
Size s = Enum.valueOf(Size.class, "SMALL");
```

将 s 设置成 `Size.SMALL`。

每个枚举类型都有一个静态的 `values` 方法， 它将返回一个包含全部枚举值的数组。 例如，如下调用 

```java
Size[] values = Size.values(); 
```

返回包含元素 `Size.SMALL, SizeMEDIUM, SizeLARGE, SizeEXTRA_LARGE` 的数组。 

`ordinal` 方 法 返 冋 enum 声 明 中 枚 举 常 量 的 位 置， 位 置 从 0 开始计数。 例如：

```java
Size.MEDIUM.ordinal() // 1
```

>  📜 如同 Class 类一样， 鉴于简化的考虑， <u>Enum 类省略了一个类型参数</u>。 例如， 实际上，应该将枚举类型 Size 扩展为 `Enum<Size>` 。

👇 API 如下：

![](https://gitee.com/veal98/images/raw/master/img/20200619185301.png)

## 7. 不可变字符串 String

### ① 概述

从概念上讲， Java 字符串就是 Unicode 字符序列。 例如， 串 `“Java\u2122” ` 由 5 个 Unicode 字符 J、a、 v、a 和™。**Java 没有内置的字符串类型**， 而是在标准 Java 类库中提供了 一个**预定义类** `String`。每个用**双引号括起来的字符串都是 String 类的一个实例**：

```java
String e = ""; // 空串
String a = "hello";
```

**在 Java 8 中，String 内部使用 char 数组存储数据**。

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
}
```

**在 Java 9 之后，String 类的实现改用 byte 数组存储字符串**，同时使用 `coder` 来标识使用了哪种编码。

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final byte[] value;

    /** The identifier of the encoding used to encode the bytes in {@code value}. */
    private final byte coder;
}Copy to clipboardErrorCopied
```

`value` 数组被声明为 `final`，这意味着 `value `数组初始化之后就不能再引用其它数组。并且 `String `内部没有改变 `value` 数组的方法，因此可以保证 **`String `不可变**。

### ② 字串 substring

`String `类的 `substring `方法可以从一个较大的字符串提取出一个子串。例如：

```java
String a = "hello";
String s = a.substring(0,3); // 从下标 0 开始 到 下标 3 为止，不包含 3。 左闭右开
```

`substring `的工作方式有一个优点：**容易计算子串的长度**：字符串 `s.substring(a, b)` 的长度 为 b-a。

### ③ 拼接 +

Java语言允许使用 `+` 号连接（拼接）两个字符串。

```java
String a = "hello";
String b = "world";
String c = a + b; // c = "helloworld"
```

**当将一个字符串与一个非字符串的值进行拼接时，后者被转换成字符串**（<u>任何一个 Java 对象都可以转换成字符串</u>）。例如：

```java
int age = 13;
String rating = "PG" + age; // rating = "PG13"
```

这种特性通常用在输出语句中。例如：

```java
int a = 12;
System.out.println("a = " + a);
```

**如果需要把多个字符串放在一起， 用一个定界符分隔，可以使用静态 `join` 方法**：

```java
String all = String.join("/","S","M","L"); // all = "S/M/L"
```

### ④ 不可变字符串

`String `类没有提供用于直接修改字符串的方法。首先提取需要的字符， 然后再拼接上替换的字符串：

```java
String a = "hello";
a = a.substring(0,3) + "ab"; // a = "helab"
```

⭐ 由于不能修改 Java 字符串中的字符， 所以在 **Java 文档中将 String 类对象称为不可变字符串**， 如同数字 3 永远是数字 3 —样，**字符串“ hello” 永远包含字符 h、 e、1、 1 和 o 的代码单元序列， 而不能修改其中的任何一个字符。当然， 可以修改字符串变量 a， 让它引用另外一个字符串**， 这就如同可以将存放 3 的数值变量改成存放 4 一样。

通过拼接“ hel” 和“ ab ” 来创建一个新字符串的效率确实不高。但是，不可变字符串却有一个优点：**编译器可以让字符串共享**。

可以想象将各种字符串存放在公共的存储池中。字符串变量指向存储池中相应的位置。如果复制一个字符串变量， 原始字符串与复制的字符串共享相同的字符。

> 📜 C++ 字符串是可修改的， 也就是说，可以修改字符串中的单个字符。

### ⑤ 检测字符串是否相等 equals

可以使用 `equals `方法检测两个字符串是否相等。

对于表达式： `s.equals(t)`， 如果字符串 s 与字符串 t 相等， 则返回 true ; 否则， 返回 false。

需要注意，s 与 t 可以是字符串变量， 也可以是字符串字面量。 例如， 下列表达式是合法的：

```java
String a = "hello";
"hello".equals(a); // true
```

要想检测两个字符串是否相等，而**不区分大小写**， 可以使用 `equalsIgnoreCase` 方法：

```java
"Hello".equals(a); // true
```

⭐ **一定不要使用 `==` 运算符检测两个字符串是否相等！ 这个运算符只能够确定两个字符串是否放置在同一个位置上。**当然， 如果字符串放置在同一个位置上， 它们必然相等。但是， 完全有可能将内容相同的多个字符串的拷贝放置在不同的位置上。

```java
public class Demo{
    public static void main(String[] args) {
        String a = "hello";
        if(a == "hello") // true
            System.out.println("a == hello is true");
        else
            System.out.println("a == hello is false");
        if(a.substring(0,3) == "hel") // false
            System.out.println("a.substring(0,3) == \"hel\"");
        else
            System.out.println("a.substring(0,3) == \"hel\" is false");
    }
}
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200617094812.png" style="zoom:80%;" />

> 📜 C++ 的 `string `类重载了 `==` 运算符以便检测字符串内容的相等性。 可惜 Java 没有采用这种方式， 它的字符串“ 看起来、 感觉起来” 与数值一样， 但进行相等性测试时， 其操作方式又类似于指针。

### ⑥ 空串与 Null 串

空串 `""` 是长度为 0 的字符串。可以调用以下代码检查一个字符串是否为空：

```java
if(str.length() == 0){
    // todo
}
```

或者

```java
if(str.equals("")){
	// todo
}
```

**空串是一个 Java 对象， 有自己的串长度（ 0 ) 和内容（空）**。

不过， `String `变量还可以存放一个特殊的值， 名为 `null`, 这表示目前没有任何对象与该变量关联。要检查一个字符串是否为 `null`, 要使用以下条件：

```java
if(str == null){
    // todo
}
```

有时要检查一个字符串既不是 `null `也不为空串，这种情况下就需要使用以下条件：

```java
if(str != null && str.length() != 0){
    // todo
}
```

**首先要检查 str 不为 `null`。如果在一个 `null `值上调用方法， 会出现错误**。

### ⑦ 码点与代码单元

Java 字符串由 `char `值序列组成。从 3.3.3 节“ char 类型” 已经看到， char 数据类型是一 个采用 UTF-16 编码表示 Unicode 码点的代码单元。大多数的常用 Unicode 字符使用一个代码单元就可以表示，而辅助字符需要一对代码单元表示。

`length` 方法将返回采用 UTF-16 编码表示的给定字符串所需要的代码单元数量。例如：

```java
String a = "hello";
int len = a.length(); // len = 5
```

要想得到实际的长度，即码点数量，可以调用：

```java
int cpCount = a.codePointCount(0, len); // 5
```

**调用 `s.charAt(n) ` 将返回位置 n 的代码单元**，n 介于 0 ~ s.length() - 1之间。例如：

```java
char last = a.charAt(4); // "o"
```

要想得到第 i 个码点，应该使用下列语句：

```java
int index = a.offsetByCodePoints(0, 2); // 2
int cp = a.codePointAt(index); // 108
```

###  ⑧ String API

Java 中的 `String `类包含了 50 多个方法。令人惊讶的是绝大多数都很有用， 可以设想使用的频率非常高。下面的 API 注释汇总了一部分最常用的方法：

> 📜 这里还列出了所给类的版本号。
>
> 👉 更多方法请参见：[String 官方联机文档  https://docs.oracle.com/javase/8/docs/api/](https://docs.oracle.com/javase/8/docs/api/)

- `java.lang.String`

  ![](https://gitee.com/veal98/images/raw/master/img/20200617100840.png)

  ![](https://gitee.com/veal98/images/raw/master/img/20200617100736.png)

  ![](https://gitee.com/veal98/images/raw/master/img/20200617100811.png)

> 📜 在 API 注释中， 有一些 `CharSequence` 类型的参数这是一种**接口类型**， **所有字符串都属于这个接口** ，只需要知道只要看到 一个 `CharSequence` 形参， 完全可以传入 `String `类型的实参。

### ⑨ StringBuilder 可变字符串

#### Ⅰ String 字符串拼接问题

有些时候， 需要由较短的字符串构建字符串， 例如， 按键或来自文件中的单词。采用字符串连接的方式达到此目的效率比较低。⭐ **由于String类的对象内容不可改变，所以每当进行字符串拼接时，总是会在内存中创建一个新的对象。**既耗时， 又浪费空间。例如：

```java
public class StringDemo {
    public static void main(String[] args) {
        String s = "Hello";
        s += "World";
        System.out.println(s);
    }
}
```

这段代码其实总共产生了三个字符串，即`"Hello"`、`"World"`和`"HelloWorld"`。引用变量 s 首先指向`Hello`对象，最终指向拼接出来的新字符串对象，即`HelloWord` 。

👍 使用 `StringBuilder/ StringBuffer` 类就可以避免这个问题的发生。

#### Ⅱ StringBuilder 初始化

> 📜 在 JDK5.0 中引入 `StringBuilder` 类。 这个类的前身是 `StringBuffer`, `StringBuffer`效率稍有些低， 但允许采用**多线程**的方式执行添加或删除字符的操作。如果所有字符串在一个单线程中编辑 （通常都是这样) ， 则应该用 `StringBuilder` 替代它。 **这两个类的 API 是相同的**。

**`StringBuiler `不能像 `String `那样直接用字符串赋值，所以也不能那样初始化。它<u>需要通过构造方法来初始化</u>**

如果需要用许多小段的字符串构建一个字符串， 那么应该按照下列步骤进行。 首先， 构建一个空的字符串构建器：

```java
StringBuilder builder = new StringBuilder();
```

当每次需要添加一部分内容时， 就调用 `append` 方法：

```java
char ch = 'a';
builder.append(a);

String str = "ert"
builder.append(str);
```

在需要构建字符串时就凋用  `toString` 方法， 将可以得到一个 `String `对象， 其中包含了构建器中的字符序列。

```java
String mystr = builder.toString();
```

#### Ⅲ StringBuiler API

下面的 API 注释包含了 StringBuilder 类中的重要方法：（StringBuffer 和 StringBuilder API 相同）

- `java.lang.StringBuilder`

  ![](https://gitee.com/veal98/images/raw/master/img/20200617104211.png)

#### Ⅳ String、StringBuffer、StringBuilder 比较

**可变性**

- `String `不可变
- `StringBuffer `和 `StringBuilder` 可变

**线程安全**

- `String `不可变，因此是线程安全的
- `StringBuilder `不是线程安全的，效率较高
- `StringBuffer `是线程安全的，内部使用 `synchronized `进行同步，效率较低

### ⑩ 字符串常量池 String Pool

**字符串常量池**（String Pool）保存着所有字符串字面量（literal strings），这些字面量在编译时期就确定。不仅如此，还**可以使用 String 的 `intern() `方法在运行过程中将字符串添加到 String Pool 中**。

**当一个字符串调用 intern() 方法时，如果 String Pool 中已经存在一个字符串和该字符串值相等（使用 equals() 方法进行确定），那么就会返回 String Pool 中字符串的引用**；否则，就会在 String Pool 中添加一个新的字符串，并返回这个新字符串的引用。

下面示例中，s1 和 s2 采用 **构造函数 new String() **的方式新建了两个不同字符串，而 s3 和 s4 是通过 `s1.intern()` 方法取得一个字符串引用。**intern() 首先把 s1 引用的字符串放到 String Pool 中，然后返回这个字符串引用**。因此 s3 和 s4 引用的是同一个字符串。

```java
String s1 = new String("aaa");
String s2 = new String("aaa");
System.out.println(s1 == s2);           // false
String s3 = s1.intern();
String s4 = s1.intern();
System.out.println(s3 == s4);           // true
```

如果是采用 "bbb" 这种**字面量的形式**直接创建字符串，**会自动地将字符串放入 String Pool 中**。

```java
String s5 = "bbb";
String s6 = "bbb";
System.out.println(s5 == s6);  // true
```

🚩 **总结：**

- `String str = "i"` 的方式，java 虚拟机会自动将其分配到常量池中；

- `String str = new String(“i”) ` 则会被分到堆内存中。可通过 intern 方法手动加入常量池

### ⑪ new String("abc") 创建了几个字符串对象

使用这种方式一共会创建两个字符串对象（前提是 String Pool 中还没有 "abc" 字符串对象）。

- "abc" 属于字符串字面量，因此**编译时期会在 <u>String Pool</u> 中创建一个字符串对象**，指向这个 "abc" 字符串字面量；
- 而**使用 `new `的方式会在<u>堆</u>中创建一个字符串对象**。

## 8. 输入输出

### ① 读取输入 Scanner

前面已经看到，打印输出到“ 标准输出流”（即控制台窗口）是一件非常容易的事情，只要 调用 `System.out.println` 即可。然而，读取“ 标准输人流” `System.in` 就没有那么简单了。要想通过控制台进行输人，首先需要构造一个 `Scanner` 对象，并与“ 标准输人流” `System.in` 关联。

> 📜 Scanner 类定义在 `java.util.Scanner` 包中。当使用的类不是定义在基本 java.lang 包中时，一定要使用 import 指示字将相应的包加载进来。

```java
Scanner in = Scanner(System.in);
```

现在，就可以使用 Scanner 类的各种方法实现输入操作了。例如， `nextLine` 方法将输入一行。

```java
System.out.println("input");
String name = in.nextLine();
```

使用 `nextLine` 方法是因为可以保留输入行中的空格。要想读取一个单词（以空白符作为分隔符) ，就调用

```java
String name = in.next();
```

要想读取一个整数， 就调用 `nextlnt` 方法。

```java
int age = in.nextInt()
```

与此类似，要想读取一个浮点数， 就调用 `nextDouble` 方法。

👇 API 如下：

![](https://gitee.com/veal98/images/raw/master/img/20200617112448.png)

### ② 格式化输出 printf

在早期的 Java 版本中，格式化数值曾引起过一些争议。庆幸的是，Java SE 5.0 沿用了 C 语言库函数中的 `printf` 方法。例如，调用

```java
double x = 10000.0 / 3.0;
System.out.printf("%8.2f",x); // 3333.33
```

可以用 8 个字符的宽度和小数点后两个字符的精度打印 x。也就是说，打印输出一个空格和 7 个字符。

在 printf 中，可以使用多个参数， 例如：

```java
System.out.printf("Hello,%s,Next year, you will be %d",name,age);
```

### ③ 文件输入与输出

要想对文件进行**读取**，就需要一个用 File 对象构造一个 Scanner 对象，如下所示：

```java
Scanner in = new Scanner(Paths.get("myfile.txt"),"UTF-8");
```

**如果文件名中包含反斜杠符号，就要记住在每个反斜杠之前再加一个额外的反斜杠**：`c:\\docs\\file.txt`

现在，就可以利用前面介绍的任何一个 Scanner 方法对文件进行读取。 要想**写入**文件， 就需要构造一个 `PrintWriter` 对象。在构造器中，只需要提供文件名：

```java
PrintWriter out = new PrintWriter("file.txt","UTF-8");
```

如果文件不存在，则创建该文件。 可以像输出到 System.out—样使用 print、 println 以及 printf 命令。

👇 API 如下：

![](https://gitee.com/veal98/images/raw/master/img/20200617113401.png)

## 9. 控制流程

> 📜 Java 的控制流程结构与 C 和 C++ 的控制流程结构一样， 只有很少的例外情 况。没有 goto 语句，但 break 语句可以带标签， 可以利用它实现从内层循环跳出的目的 (这种情况 C 语言采用 goto 语句实现) 。另外，还有一种变形的 for 循环， 在 C 或 C++ 中 没有这类循环。它有点类似于 C# 中的 foreach 循环。

### ① 块作用域

在深入学习控制结构之前， 需要了解块（block) 的概念。

块（即复合语句）是指由一对大括号括起来的若干条简单的 Java 语句。**块确定了变量的作用域**。一个块可以嵌套在另一个块中。下面就是在 main方法块中嵌套另一个语句块的示例。

```java
public static void main(String[] args) {
    int n;
    {
        int k;
    }
}
```

但是，**不能在嵌套的两个块中声明同名的变量**。例如，下面的代码就有错误，而无法通过编译

```java
public static void main(String[] args) {
    int n;
    {
        int n;
    }
}
```

> 📜 <u>在 C++ 中， 可以在嵌套的块中重定义一个变量</u>。在内层定义的变量会覆盖在外层定义的变量。这样，有可能会导致程序设计错误， 因此在 **Java 中不允许这样做**。

### ② 条件语句 if / else

```java
if(a >= b){
	// todo
}
else{
	// todo
}
```

else 子句与最邻近的 if 构成一组。

```java
if(condition1){
	// todo
}
else if(condition2){
	// todo
}
else if(condition3){
	// todo
}
else{
	// todo
}
```

### ③ 循环 while

```java
while(conditon){
	// todo
}
```

如果开始循环条件的值就为 false, 则 while 循环体一次也不执行

while 循环语句首先检测循环条件。因此， 循环体中的代码有可能不被执行。如果希望循环体至少执行一次， 则应该将检测条件放在最后。 使用 `do/while` 循环语句可以实现这种操作方式。它的语法格式为：

```java
do{
	// todo
}while(conditon);
```

### ④ 确定循环 for

for 循环语句是支持迭代的一种通用结构， 利用每次迭代之后更新的计数器或类似的变量 来控制迭代次数。

```java
for(int i = 0; i < 10;i ++)
	System.out.println(i);
```

### ⑤ 多重选择（开关）：switch

```java
import java.util.*;
public class Demo{
    int n = 0;
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        System.out.println("select an option (1,2,3,4)");
        int choice = in.nextInt();
        switch(choice){
            case 1:
                System.out.println("1");
                break;
            case 2:
                System.out.println("2");
                break;
            case 3:
                System.out.println("3");
                break;
            case 4:
                System.out.println("4");
                break;
            default:
                System.out.println("-1");
                break;    
        }
    }
}
```

case 标签可以是： 

- 类型为 char、byte、 short 或 int 的常量表达式。 
- 枚举常量。 
- 从 Java SE 7开始， case 标签还可以是字符串字面量。

> 🚨 有可能触发多个 case 分支。 **如果在 case 分支语句的末尾没有 break 语句， 那么就会接着执行下一个 case 分支语句**。这种情况相当危险， 常常会引发错误。 为此，我们在 程序中很少使用 switch 语句

### ⑥ 中断控制流程语句 break / continue

- **不带标签的 break**

  ```java
  while (years <= 100){
  	balance += payment;
  	double interest = balance * interestRate / 100;
  	balance += interest;
  	if (balance >= goal ) 
          break;
  	years++ ;
  }
  ```

  在循环开始时， 如果 years > 100, 或者在循环体中 balance >= goal , 则退出循环语句。

- **带标签的 break**

  Java 还提供了一种带标签的 break语句，用于跳出多重嵌套的循环语句。 有时候，在嵌套很深的循环语句中会发生一些不可预料的事情。此时可能更加希望跳到嵌套的所有循环语句之外。通过添加一些额外的条件判断实现各层循环的检测很不方便。 

  这里有一个示例说明了 break 语句的工作状态。请注意，**标签必须放在希望跳出的最外层循环之前， 并且必须紧跟一个冒号。**

  ```java
  Scanner in = new Scanner(System.in);
  int n;
  read_data:
  while (. . .){ // this loop statement is tagged with the label
  	for (. . .){ // this inner loop is not labeled
  		Systen.out.print("Enter a number >= 0: ");
  		n = in.nextlnt();
  		if (n < 0) // should never happen-can’t go on
  			break read.data;
  			// break out of readjata loop
  	}
  }
  // this statement is executed immediately after the labeled break
  if (n < 0){ // check for bad situation
  	// deal with bad situation
  }
  else{
  	// carry out normal processing
  }
  ```

  **如果输入有误，通过执行带标签的 break 跳转到带标签的语句块末尾**。对于任何使用 break语句的代码都需要检测循环是正常结束， 还是由 break 跳出。

- **continue**

  最后，还有一个 continue 语句。与 break 语句一样， 它将中断正常的控制流程。**continue 语句将控制转移到最内层循环的首部**。

  ```java
  Scanner in = new Scanner(System.in);
  while (sum < goal ){
      System.out.print("Enter a number: ")；
  	n = in.nextlntO；
  	if (n < 0) 
          continue;
  	sum += n; // not executed if n < 0
  }
  ```

  如果 n < 0, 则 continue 语句越过了当前循环体的剩余部分， 立刻跳到循环首部。

  <u>如果将 continue 语句用于 for 循环中， 就可以跳到 for 循环的“ 更新” 部分</u>。例如， 下面这个循环：

  ```java
  for (count = 1; count <= 100; count++){
  	System.out.print("Enter a number, -1 to quit: ");
  	n = in.nextlntO；
  	if (n < 0) 
  		continue;
  	sum += n; // not executed if n < 0
  }
  ```

  **如果 n < 0, 则 continue 语句跳到 count++ 语句**。

## 10. 大数类 BigInteger / BigDecimal

如果基本的整数和浮点数精度不能够满足需求， 那么可以使用 `java.math` 包中的两个很有用的类：`Biglnteger` 和 `BigDecimal` 这两个类可以处理包含任意长度数字序列的数值。 **`Biglnteger` 类实现了任意精度的整数运算，` BigDecimal` 实现了任意精度的浮点数运算。**

<u>使用静态的 `valueOf` 方法可以将普通的数值转换为大数值</u>：

```java
BigInteger a = BigInteger.valueOf(100);
```

遗憾的是，不能使用人们熟悉的算术运算符（如：`+` 和 `*`) 处理大数值。 而需要使用大数类中的 add 和 multiply 方法。

```java
Biglnteger c = a.add(b); // c = a + b
Biglnteger d = c.multiply(b.add(Biglnteger.valueOf(2))); // d = c * (b + 2)
```

> 📜 **与 C++ 不同， Java 没有提供运算符重载功能**。 程序员无法重定义 `+` 和 `*` 运算 符， 使其应用于 BigInteger 类的 add 和 multiply 运算。Java 语言的设计者确实为字符串的连接重载了 + 运算符，但没有重载其他的运算符，也没有给 Java 程序员在自己的类中重载运算符的机会 ，

👇 API 如下：

![](https://gitee.com/veal98/images/raw/master/img/20200617142617.png)

## 11. 数组

### ① 概述

```java
int[] a = new int[100]
```

这条语句创建了一个可以存储 100 个整数的数组。

> 📜 可以使用下面两种形式声明数组 ：
>
> `int[] a;`
>
> 或 
>
> `int a[];` 
>
> 大多数 Java 应用程序员喜欢使用第一种风格， 因为它将类型 `int[] `( 整型数组）与变量名分开了。

创建一个数字数组时， 所有元素都初始化为 0。`boolean `数组的元素会初始化为 `false`， **对象数组的元素则初始化为一个特殊值 `null`, 这表示这些元素（还）未存放任何对象**。例如：

```java
String[] news = new String[10];
```

会创建一个包含 10 个字符串的数组， 所有字符串都为 null。

要想获得数组中的元素个数，可以使用 `array.length`：

```java
System.out.println(a.length);
```

> 🚨 注意区别于 String 类的 `length()` 方法，此处用的是属性`length`

**一旦创建了数组， 就不能再改变它的大小**（尽管可以改变每一个数组元素）。**如果经常需要在运行过程中扩展数组的大小， 就应该使用另一种数据结构 — `ArrayList`** 。

### ② for each 循环

Java 有一种功能很强的循环结构， 可以用来依次处理数组中的每个元素（其他类型的元素集合亦可）而**不必为指定下标值而分心**。 这种**增强的 for 循环**的语句格式为：

```java
for(variable:collection){
    // todo
}
```

**collection 这一集合表达式必须是一个数组或者是一个实现了 `Iterable `接口的类对象**（例如 `ArrayList`)。

```java
int[] a = new int[100];
for(int i = 0; i < 100; i++)
    a[i] = i;

for(int element: a)
    System.out.println(element);
```

> 📜 for each 循环语句的循环变量将会遍历数组中的每个元素， 而不需要使用下标值。

>  🚩 **有个更加简单的方式打印数组中的所有值**， 即利用 `Arrays` 类的 `toString` 方法。 调用 `Arrays.toString(a)`, 返回一个包含数组元素的字符串，这些元素被放置在括号内， 并用逗号分隔， 例如，“ [2,3,5,7,11,13] ” ，要想打印数组，可以调用 
>
> ```java
> System.out.println(Arrays.toString(a));
> ```

### ③ 数组初始化以及匿名数组

在 Java中， 提供了一种创建数组对象并同时赋予初始值的简化书写形式。下面是例子： 

```java
int[] smallPrimes = { 2, 3, 5, 7, 11, 13 };
```

 请注意， 在使用这种语句时，不需要调用 new。 

甚至还可以初始化一个**匿名的数组**： 

```java
new int[] { 17, 19, 23, 29, 31, 37 } 
```

这种表示法将创建一个新数组并利用括号中提供的值进行初始化，数组的大小就是初始值的 个数。 **使用这种语法形式可以在不创建新变量的情况下重新初始化一个数组**。例如： 

```java
smallPrimes = new int[] { 17, 19, 23, 29, 31, 37 };
```

> 📜 在 Java 中， 允许数组长度为 0。**在编写一个结果为数组的方法时， 如果碰巧结果为空， 则这种语法形式就显得非常有用**。此时可以创建一个长度为 0 的数组： 
>
> ```java
> new elementType[0] 
> ```
>
> 注意， 数组长度为 0 与 null 不同

### ④ 数组拷贝

在 Java 中，允许**将一个数组变量拷贝给另一个数组变量。这时， 两个变量将引用同一个数组**：

```java
int[] a = {1,2,3,4,5};
int[] b = a;
b[1] = 10; // a[1] 也变成 10
```

**如果希望将一个数组的所有值拷贝到一个新的数组中去， 就要使用 `Arrays` 类的 `copyOf` 方法**：

```java
int[] c = Arrays.copyOf(a, 2 * a.length());
```

💡 **第 2 个参数是新数组的长度。这个方法通常用来增加数组的大小**：<u>如果数组元素是数值型，那么多余的元素将被赋值为 0 ; 如果数组元素是布尔型，则将赋值为 false。相反，如果长度小于原始数组的长度，则只拷贝最前面的数据元素。</u>

### ⑤ 命令行参数

前面已经看到多个使用 Java 数组的示例。 每一个 Java 应用程序都有一个带 `String[] args `参数的 main 方法。**这个参数表明 `main `方法将接收一个字符串数组， 也就是命令行参数**。

```java
public class Demo {
    public static void main(String[] args){
        if (args.length == 0 || args[0].equals("-h"))
            System.out.print("Hello,");
        else if (args[0].equals("-g"))
            System.out.print("Goodbye,");
        // print the other command-line arguments
        for (int i = 1; i < args.length; i ++)
            System.out.print(" " + args[i]);
        System.out.println("!");
    }
}
```

<img src="https://gitee.com/veal98/images/raw/master/img/20200617145407.png" style="zoom:80%;" />

> 📜 在 Java 应用程序的 main 方法中， `程序名并没有存储在 args 数组中`。例如, 当使用下列命令运行程序时 :
>
> `java Demo-h world`， 
>
> `args[0]` 是 `-h`， 而不是“ Demo” 或“ java”

### ⑥ 数组排序 Arrays.sort()

要想对数值型数组进行排序， 可以使用 `Arrays `类中的 `sort` 方法：

```java
int[] a = new int[1000];
...
Arrays.sort(a);
```

**这个方法使用了优化的快速排序算法**。

之所以能够利用 `Arrays.sort()` 对这个对象数组排序，前提是这个对象是实现了 `Comparable `接口的类的实例。`Array.sort` 还能传入一个比较器参数，详细请参见 <u>4-接口</u>

👇 Arrays 类还提供了几个使用很便捷的方法，API 如下：

![](https://gitee.com/veal98/images/raw/master/img/20200617150457.png)

### ⑦ 多维数组

在 Java 中， 声明一个二维数组相当简单。例如： 

```java
double[][] a;
```

 **与一维数组一样， 在调用 new 对多维数组进行初始化之前不能使用它**。 在这里可以这样初始化：

```java
a = new double[2][3]:
```

另外， 如果知道数组元素， 就可以不调用 new， 而直接使用简化的书写形式对多维数组 进行初始化。例如：

```java
int[][] a = { 
    {16, 3, 2, 13}， 
    {5, 10, 11, 8}, 
    {9, 6, 7, 12}, 
    {4, 15, 14, 1} 
};
```

 一旦数组被初始化， 就可以利用两个方括号访问每个元素， 例如， `a[i][j]`。

> 📜  **for each 循环语句不能自动处理二维数组的每一个元素。它是按照行， 也就是一维数组处理的。要想访问二维数组 a 的所有元素， 需要使用两个嵌套的循环**， 如下所示：
>
> ```java
> public class Demo {
>     public static void main(String[] args){
>         int[][] a = { 
>             {16, 3, 2, 13},
>             {5, 10, 11, 8}, 
>             {9, 6, 7, 12}, 
>             {4, 15, 14, 1} 
>         };
>         for(int[] row : a)
>             for(int value : row)
>                 System.out.println(row + " " + value);
>     }
> }
> ```
> <img src="https://gitee.com/veal98/images/raw/master/img/20200617151555.png" style="zoom:80%;" />

> 💡 要想**快速地打印一个二维数组的数据元素列表**， 可以调用 `Arrays.deepToString` ：
>
> ```java
> System.out.println(Arrays.deepToString(a));
> // [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]]
> ```

### ⑧ 不规则数组

到目前为止，读者所看到的数组与其他程序设计语言中提供的数组没有多大区别。但实际存在着一些细微的差异， 而这正是 Java 的优势所在：**Java 实际上没有多维数组，只有一维数组**。多维数组被解释为“ **数组的数组**”。

<img src="https://gitee.com/veal98/images/raw/master/img/20200617153937.png" style="zoom: 67%;" />

由于可以单独地存取数组的某一行， 所以可以让两行交换。

```java
int[] temp = a[1];
a[1] = a[2];
a[2] = temp;
```

还可以方便地构造一个**“ 不规则” 数组**， 即**数组的每一行有不同的长度**。下面是一个典型的示例。

```java
import java.util.Arrays;

public class Demo {
    public static void main(String[] args){
        int[][] odds = new int[6][];
        for(int i = 0; i < 6; i++)
            odds[i] = new int[i+1]; // 二维数组的每行都增加一个元素
        for(int i = 0; i < odds.length; i++){
            for(int j = 0; j < odds[i].length; j++){
                odds[i][j] = i + 1;
            }
        }
        System.out.println(Arrays.deepToString(odds)); 
        // [[1], [2, 2], [3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5, 5], [6, 6, 6, 6, 6, 6]]
    }
}
```

---

# 📚 References

- 《Java 核心技术 - 卷 1 基础知识 - 第 10 版》
- 《Thinking In Java（Java 编程思想）- 第 4 版》
- 🐤 [CS-Notes](https://cyc2018.github.io/CS-Notes)
- 💜 [java经验总结-208道面试题](https://www.zhihu.com/question/27858692/answer/787505434)
- 😈 [我没有三颗心脏-Java面试知识点](https://www.cnblogs.com/wmyskxz/tag/Java面试知识点/)