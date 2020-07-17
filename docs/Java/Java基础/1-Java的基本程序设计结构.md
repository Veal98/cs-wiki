# ☕ Java 的基本程序设计结构

---

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

> 📜 Java 的类与 C++ 的类很相似， 但还是有些差异会使人感到困惑。 例如， **Java 中的所有函数都属于某个类的方法**（标准术语将其称为方法， 而不是成员函数）。因此，**Java 中的 main 方法必须有一个外壳类**。 读者有可能对 C++ 中的静态成员函数（ static member functions) 十分熟悉。这些成员函数定义在类的内部， 并且不对对象进行操作。**Java 中的 `main `方法必须是静态的**。 最后， 与 C/C++ —样， 关键字 void 表示这个方法没有返回值， 所不同的是 **main 方法没有为操作系统返回“ 退出代码” .  如果 main 方法正常退出， 那么 Java 应用程序的退出代码为 0, 表示成功地运行了程序**。如果希望在终止程序时返回其他的代码， 那就需要调用 `System.exit` 方法。

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

## 6. 输入输出

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

## 7. 控制流程

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

## 8. 大数类 BigInteger / BigDecimal

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

## 9. 可变参数

在**JDK1.5**之后，如果我们定义一个方法需要接受多个参数，并且**多个参数类型一致**，我们可以对其简化成如下格式：

```java
修饰符 返回值类型 方法名(参数类型... 形参名){  }
```

其实这个书写完全等价与

```java
修饰符 返回值类型 方法名(参数类型[] 形参名){  }
```

只是后面这种定义，在调用时必须传递数组，而前者可以直接传递数据即可。

🚩 **JDK1.5** 以后。出现了简化操作。**`...` 用在参数上，称之为可变参数，它表明这个方法可以接收任意数量的对象。**

**同样是代表数组，但是在调用这个带有可变参数的方法时，不用创建数组(这就是简单之处)，直接将数组中的元素作为实际参数进行传递**，其实编译成的class文件，将这些元素先封装到一个数组中，在进行传递。这些动作都在编译.class文件时，自动完成了。

代码演示：    

```java
public class ChangeArgs {
    public static void main(String[] args) {
        int[] arr = { 1, 4, 62, 431, 2 };
        int sum = getSum(arr);
        System.out.println(sum);
        //  6  7  2  12  2121
        // 求这几个元素和 6  7  2  12  2121
        int sum2 = getSum(6, 7, 2, 12, 2121);
        System.out.println(sum2);
    }

    /*
     * 所有元素的求和的原始写法
     
      public static int getSum(int[] arr){
        int sum = 0;
        for(int a : arr){
            sum += a;
        }
        
        return sum;
      }
    */
    //可变参数写法
    public static int getSum(int... arr) {
        int sum = 0;
        for (int a : arr) {
            sum += a;
        }
        return sum;
    }
}
```

> 🚨 注意：如果在方法书写时，这个方法拥有多参数，参数中包含可变参数，**可变参数一定要写在参数列表的末尾位置。**

## 📚 References

- 《Java 核心技术 - 卷 1 基础知识 - 第 10 版》
- 《Thinking In Java（Java 编程思想）- 第 4 版》
- 🐤 [CS-Notes](https://cyc2018.github.io/CS-Notes)
- 💜 [java经验总结-208道面试题](https://www.zhihu.com/question/27858692/answer/787505434)
- 😈 [我没有三颗心脏-Java面试知识点](https://www.cnblogs.com/wmyskxz/tag/Java面试知识点/)