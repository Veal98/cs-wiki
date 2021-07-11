# 🎳 Java 小白成长记 · 第 3 篇《运算符与控制流》

---

## 0. 前言

这是一个技术疯狂迭代的时代，各种框架层出不穷，然而底层基础才是核心竞争力。博主（小牛肉）在现有的知识基础上，以上帝视角对 Java 语言基础进行复盘，汇总《Java 小白成长记》系列，力争从 0 到 1，全文无坑。

> 🔊 本章你将了解在 Java 中运算符的使用，以及各种程序的控制流程。如果你有其他语言基础的话，本章可以选择性略过

## 1. 运算符

首先，何为运算符？运算符就是用来操纵数据的符号。

![](https://gitee.com/veal98/images/raw/master/img/20210111165424.png)

### ① 算术运算符

在 Java 中，使用算术运算符 ``+ 、-、 * 、/`` 表示加、减、 乘、除运算。 整数的求余操作（有时称为取模) 用 `％` 表示。

> 🚨 注意：
>
> - 整数被 0 除将会产生一个异常， 而浮点数被 0 除将会得到无穷大或 NaN 结果
> - 当参与 `/ `运算的两个操作数都是整数时， 表示整数除法；否则， 表示浮点数除法。 

这几种简单的符号我们就一笔带过了，新手可能会被 `+=、*=、 -=、/=` 搞懵，其实这是一种简写。举个例子：`x += 1` 等价于 `x = x + 1`。其余的同理。

需要注意的是：几乎所有运算符都只能操作基本类型（Primitives）。唯一的例外是 `=（赋值运算符）`、`==（关系运算符）` 和 `!=（关系运算符）`，它们能操作所有对象（这也是令人混淆的一个地方）。

除此以外，`String` 类支持 `+` 和 `+=`（**编译器会将 `+` 和 `+=` 连接的非字符串转换为字符串**）。比如：

```java
public static void main(String[] args) {
    int x = 1;
    System.out.println("x = " + x); // x = 1
}
```

在 `System.out.println()` 语句中使用了 `+` 运算符。 上例中的输出结果说明了 x 被转化成了字符串。

### ② 括号与运算符级别

运算符的优先级决定了存在多个运算符时一个表达式各部分的运算顺序。Java 对运算顺序作出了特别的规定。其中，**最简单的规则就是乘法和除法在加法和减法之前完成**。程序员经常都会忘记其他优先级规则，所以**应该用括号明确规定运算顺序**。代码示例：

```java
public static void main(String[] args) {
    int x = 1, y = 2, z = 3;
    int a = x + y - 2/2 + z;
    int b = x + (y - 2)/(2 + z);
    System.out.println("a = " + a); // a = 5
    System.out.println("b = " + b); // b = 1
}
```

💡 很多书中都会给出运算符优先级表，其实在实际开发中大家都会用括号去显示的定义运算顺序，所以此处就不贴运算符优先级表了，意义并不大，没必要强行死记硬背。

### ③ 赋值

运算符的赋值是由符号 `=` 完成的。它代表着**获取 `=` 右边的值并赋给左边的变量**。右边可以是任何常量、变量或者可产生一个返回值的表达式。但**左边必须是一个明确的、已命名的变量（即常数不能作为左值）**。也就是说，必须要有一个物理的空间来存放右边的值。举个例子来说，可将一个常数赋给一个变量（`A = 4`），但不可将任何未知的东西赋给一个常数（比如不能 `4 = A`）。

#### Ⅰ 基本数据类型的赋值

基本类型的赋值都是直接的，基本类型存储了实际的数值。而不像对象，赋予的只是其内存的引用。举个例子，a = b ，如果 b 是基本类型，那么赋值操作会将 b 的值复制一份给变量 a， 此后若 a 的值发生改变是不会影响到 b 的。作为一名程序员，这应该成为我们的常识。

```java
int x = 1;
x += 4 // 等价于 x = x + 4, x 变为 5
```

代码示例：

```java
int a = 1;
int b = 2;
a = b;
System.out.println(a); // a = 2

a = 3;
System.out.println(a); // a = 3
System.out.println(b); // b = 2
```

`b` 的内容复制给了 `a`。接着又修改了 `a`，但 `b` 并不会受到影响。

另外，**如果运算符得到一个值， 其类型与左侧操作数的类型不同， 就会发生强制类型转换**。 （下文会详细讲解）

例如：

```java
int x = 1;
x += 3.5; // 等价于 x = (int)(x+3.5)
```

#### Ⅱ 对象的赋值

如果是为对象赋值，那么结果就和基本数据类型的赋值不一样了。**对一个对象进行操作时，我们实际上操作的是它的引用**。所以我们将右边的对象赋予给左边时，赋予的只是该对象的引用。**此时，两者指向的内存中的同一个对象**。代码示例：

```java
String str = new String("小牛肉");
String s;
s = str
```

现在，这两个变量 `s` 和 `str` 引用同一个 `String` 对象。

<img src="https://gitee.com/veal98/images/raw/master/img/20210106150330.png"  />



> 关于对象的赋值这个知识点其实在第一篇 [Java小白成长记·第1篇《万物皆对象》](https://mp.weixin.qq.com/s/W3KrCirgCrqrSiOQ8P3tAQ) 中就已经讲过了，第一篇对于小白来说起点确实高了，不过这样才能带着问题学习吧，彻底理解对象的概念

#### Ⅲ 使用 = 操作符时常犯的错误

![](https://gitee.com/veal98/images/raw/master/img/20210111165242.png)

一个特别常见的错误如下：

```java
while(x = y){
	......
}
```

在 C/C++ 中，如果 `y` 是一个非 0 值，那么这种赋值的结果肯定是 `true`，这样便会得到一个无穷循环。

但在 Java 中，由于 Java 不会自动的将 `int  `转换成 `boolean `类型，所以在编译时就会抛出一个编译时错误，从而阻止我们进一步去运行程序。

![](https://gitee.com/veal98/images/raw/master/img/20200718151637.png)

### ④ 自增与自减运算符

在 Java 中， 借鉴了 C 和 C++ 的做法，也提供了自增、 自减运算符：` n++ ` 将变量 n 的当前值加 1, `n--` 则将 n 的值减 1。例如， 以下代码： 

```java
int n = 12; 
n ++; // n =13
```

**由于这些运算符会改变变量的值，所以它们的操作数不能是数值。例如， `4 ++` 就不是一个合法的语句**。

实际上， 这些运算符有两种形式；上面介绍的是运算符放在操作数后面的 “后缀” 形式。 还有一种 “前缀” 形式：`++n`。后缀和前缀形式都会使变量值加 1 或减 1。但用在表达式中时， 二者就有区别了。**前缀形式会先完成加 1;  而后缀形式会使用变量原来的值**。

```java
int m = 7;
int n = 7;
int a = 2 * ++m // m 先自增再参与运算：a = 16 m = 8
int b = 2 * n++ // n 先参与运算后再自增：b = 14 n = 8
```

👍 <u>建议不要在表达式中使用` ++`, 因为这样的代码很容易让人困惑，而且会带来烦人的 bug。</u>

### ⑤ 关系运算符

关系运算符会通过产生一个布尔（`boolean`）结果来表示操作数之间的关系。如果关系为真，则结果为  `true`，如果关系为假，则结果为 `false`。`==` 和 `!=` 可用于所有基本类型，但其他运算符不能用于基本类型 **boolean**，因为布尔值只能表示 **true** 或 **false**，所以比较它们之间的“大于”或“小于”没有意义。

关系运算符包括：

- `==` 等于
- `!=` 不等于
- `>` 大于 、 `<` 小于
- `>=` 大于或等于 、 `<=` 小于或等于

#### 判断对象等价 equals

> 注意，以下这个知识点非常重要

对于 `==` 和 `!=` 这两个关系运算符来说，它们有两种使用场景：

- 作用于基本数据类型： 比较的是值
- 作用于对象： 比较的是内存地址

它们的使用经常困扰 Java 的初学者。下面是代码示例：

```java
public static void main(String[] args) {
    Integer n1 = 47;
    Integer n2 = 47;
    System.out.println(n1 == n2);
    System.out.println(n1 != n2);
}
```

输出结果：

```
true
false
```

尽管对象的内容一样，`n1` 和 `n2` 对象的引用却不一样。

所以输出实际上应该是先输出 `false`，再输出 `true`。不信的话你可以把上面的 47 都改成 128，你就会发现打印的结果变成了 `false true`。那么为什么会这样呢？

⭐ **因为 `Integer` 内部维护着一个 IntegerCache 的缓存，默认缓存范围是 [-128, 127]，所以 [-128, 127] 之间的值用 `==` 和 `!=` 比较也能能到正确的结果，但是不推荐用关系运算符比较**。

那么怎么比较两个对象的内容是否相同呢？你必须使用所有对象（不包括基本类型）中都存在的 `equals()` 方法（所有的类都继承自 `Object` 类，`equals` 方法就是 `Object` 类提供的，后续会详细讲解），**该方法用于判断两个对象是否具有相同的引用（地址）**。代码示例：

```java
public static void main(String[] args) {
    Integer n1 = 128;
    Integer n2 = 128;
    System.out.println(n1.equals(n2)); // true
}
```

上例的结果看起来是我们所期望的。但其实事情并非那么简单。下面我们来创建自己的类：

```java
// 默认的 equals() 方法没有比较内容
class Value {
    int i;
}

public class EqualsMethod2 {
    public static void main(String[] args) {
        Value v1 = new Value();
        Value v2 = new Value();
        v1.i = v2.i = 100;
        System.out.println(v1.equals(v2)); // false
    }
}
```

上例的结果再次令人困惑：结果是 `false`。

原因： **`Object` 类默认的 `equals()` 的行为是比较对象的引用而非具体内容**。虽然 `v1` 和 `v2` 的内容相等，但是它们并不指向同一个地址。因此，除非你在新类中覆写 `equals()` 方法，否则我们将获取不到想要的结果。

所以总结一下 `equals()`的两种使用情况：

- 情况 1：<u>类没有覆盖 `equals()` 方法</u>。则通过 `equals()` 比较该类的两个对象时，等价于通过 “==” 比较这两个对象。
- 情况 2：<u>类覆盖了 `equals()` 方法</u>。一般来说，我们都会覆盖 `equals()` 方法来比较两个对象的内容而不是其引用

### ⑥ 逻辑运算符

逻辑运算符根据参数的逻辑关系生成布尔值 `true` 或 `false`：

- `&&` 逻辑与
- `||` 逻辑或
- `! ` 逻辑非

`&&` 和`|| `运算符具有**短路 （short-circuiting） 特性**： 整个表达式会在运算到可以明确结果时就停止并返回结果，这意味着该逻辑表达式的后半部分不会被执行到

举个例子：如果用 && 运算符合并两个表达式， `expressioni && expression`， 而且已经计算得到第一个表达式的真值为 false, 那么显然结果就不可能为 true 了。因此， 第二个表达式就不必计算了。

所以，运用“短路”可以节省部分不必要的运算，从而提高程序潜在的性能。

### ⑦ 位运算符

位运算符允许我们操作一个整型数字中的单个二进制位。位运算符会对两个整数对应的位执行布尔代数，从而产生结果。位运算符包括：

- `&` and
- `|` or
- `^` xor
- `~` not

另外，还有 `>>` 和 `<<` **移位运算符**，将位模式左移或右移。

最后，`>>>` 运算符会用 0 填充高位，这与`>>`不同，它会用符号位填充高位。不存在`<<< `运算符。

### ⑧ 三元操作符

三元运算符，也称为条件运算符。下面是它的表达式格式：

**布尔表达式 ? 值 1 : 值 2**

若表达式计算为 **true**，则返回结果 **值 1** ；如果表达式的计算为 **false**，则返回结果 **值 2**。

举个例子:

```java
int i = 5;
int x = i < 10 ? i * 100 : i * 10; // x = 500
```

### ⑨ 数值类型之间的转换

“类型转换”（Casting）的作用是“与一个模型匹配”。在适当的时候，Java 会将一种数据类型自动转换成另一种。数据转换分为两种：

- 一是计算机自动的合法转换
- 二是人为的强制转换

#### Ⅰ 合法转换

图 3-1 给出了数值类型之间的合法转换。

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

#### Ⅱ 强制类型转换

在上一小节中看到， 在必要的时候， `int `类型的值将会自动地转换为 `double `类型。但另一方面，有时也需要将 `double ` 转换成  `int`。 在 Java 中， 允许进行这种数值之间的类型转换。 当然， 这种**强制类型转换（cast )**  同样有可能会丢失一些信息。强制类型转换的语法格式是在圆括号中给出想要转换的目标类型，后面紧跟待转换的变量名。例如：

```java
double x = 9.997
int nx = (int) x; // nx = 9
```

这样， 变量 nx 的值为 9。**强制类型转换通过截断小数部分将浮点值转换为整型**。

### ⑩ Java 没有 sizeof

在 C/C++ 中，经常需要用到 `sizeof()` 方法来获取数据项被分配的字节大小。C/C++ 中使用 `sizeof()` 最有说服力的原因是为了移植性，不同数据在不同机器上可能有不同的大小，所以在进行大小敏感的运算时，程序员必须对这些类型有多大做到心中有数。例如，一台计算机可用 32 位来保存整数，而另一台只用 16 位保存。显然，在第一台机器中，程序可保存更大的值。所以，移植是令 C/C++ 程序员颇为头痛的一个问题。

Java 不需要 `sizeof()` 方法来满足这种需求，因为所有类型的大小在不同平台上是相同的。我们不必考虑这个层次的移植问题 —— Java 本身就是一种“与平台无关”的语言。

## 2. 控制流

> 💡 程序必须在执行过程中控制它的世界并做出选择。 在 Java 中，你需要执行控制语句来做出选择。

大多数面向过程编程语言都有共通的某种控制语句。在 Java 中，涉及的关键字包括 **if-else，while，do-while，for，return，break** 和选择语句 **switch**。 Java 并不支持备受诟病的 **goto**（尽管它在某些特殊场景中依然是最行之有效的方法）。

![](https://gitee.com/veal98/images/raw/master/img/20210111165714.png)

### ① 块作用域

在深入学习控制结构之前， 需要了解块（block) 的概念。

块（即复合语句）是指由一对大括号括起来的若干条简单的 Java 语句。**块确定了变量的作用域**。一个块可以嵌套在另一个块中。下面就是在 main 方法块中嵌套另一个语句块的示例。

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

**if-else** 语句是控制程序执行流程最基本的形式。 其中 `else` 是可选的。代码示例：

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

### ③ 循环 while / do-while

```java
while(conditon){
	// todo
}
```

while 执行语句会在每一次循环前，判断布尔表达式返回值是否为 `true`。因此， 循环体中的代码有可能不被执行（如果开始循环条件的值就为 false, 则 while 循环体一次也不执行）。

如果希望循环体至少执行一次， 则应该将检测条件放在最后。 使用 `do/while` 循环语句可以实现这种操作方式。它的语法格式为：

```java
do{
	// todo
} while(conditon);
```

当然，实际应用中，**while** 形式比 **do-while** 更为常用。

### ④ 确定循环 for

for 循环语句是支持迭代的一种通用结构， 利用每次迭代之后更新的计数器或类似的变量 来控制迭代次数。

**for** 循环的形式是：

```java
for(initialization; Boolean-expression; step){
    statement
}
```

初始化 (initialization) 表达式、布尔表达式 (Boolean-expression) ，或者步进 (step) 运算，都可以为空。每次迭代之前都会判断布尔表达式的结果是否成立。一旦计算结果为 `false`，则跳出 **for** 循环体并继续执行后面代码。 每次循环结束时，都会执行一次步进。

**for** 循环通常用于“计数”任务，举个例子：

```java
for(int i = 0; i < 10;i ++)
	System.out.println(i);
```

需要注意以下几点：

- 变量 **i** 是在 **for** 循环执行时才被定义的，并不是在主方法的开头。**i** 的作用域范围仅在 **for** 循环体内。
- 在 Java 中，仅允许 **for** 循环在控制表达式中定义变量。 我们不能将此方法与其他的循环语句和选择语句中一起使用。
- 同时，我们可以看到：无论在初始化还是在步进部分，语句都是顺序执行的。

#### 逗号操作符

在 Java 中逗号运算符（这里并非指我们平常用于分隔定义和方法参数的逗号分隔符）仅有一种用法：在 **for** 循环的初始化和步进控制中定义多个变量。我们可以使用逗号分隔多个语句，并按顺序计算这些语句。**注意**：要求定义的变量类型相同。代码示例：

```java
public static void main(String[] args) {
    for(int i = 1, j = i + 10; i < 5; i++, j = i * 2) {
      System.out.println("i = " + i + " j = " + j);
    }
}
```

上例中 **int** 类型声明包含了 `i` 和 `j`。实际上，在初始化部分我们可以定义任意数量的同类型变量。

### ⑤ 增强 for（for each）

Java 5 引入了更为简洁的“增强版 **for** 循环”语法来操纵**数组**和**集合**。举个例子（更多详细会在后续数组和集合部分的文章进行讲解）

```java
Random rand = new Random(47);
float f[] = new float[10];
for(int i = 0; i < 10; i++)
    f[i] = rand.nextFloat();

for(float x: f){
    System.out.println(x);
}
```

其中：

```java
for(float x : f) {
```

这条语句定义了一个 **float** 类型的变量 `x`，继而将每一个 `f` 的元素赋值给它。

### ⑥ 多重选择（开关）：switch

**switch** 有时也被划归为一种选择语句。根据整数表达式的值，**`switch` 语句可以从一系列代码中选出一段去执行**。它的格式如下：

多说无益，直接上代码，大家一看就懂：

```java
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
- 从 Java SE 7 开始， case 标签还可以是字符串字面量。

> 🚨 有可能触发多个 case 分支。 **如果在 case 分支语句的末尾没有 `break` 语句， 那么就会接着执行下一个 case 分支语句**。这种情况相当危险， 常常会引发错误。 为此，我们在 程序中很少使用 `switch` 语句

### ⑦ 中断控制流程语句 break / continue

在任何迭代语句的主体内，都可以使用 **break** 和 **continue** 来控制循环的流程。 其中，**break** 表示跳出当前循环体。而 **continue** 表示停止本次循环，开始下一次循环。

#### Ⅰ break

break 语句有如下两种形式：

1）**不带标签的 break**

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

2）**带标签的 break**

Java 还提供了一种带标签的 break 语句，用于跳出多重嵌套的循环语句。 有时候，在嵌套很深的循环语句中会发生一些不可预料的事情。此时可能更加希望跳到嵌套的所有循环语句之外。通过添加一些额外的条件判断实现各层循环的检测很不方便。 

> 标签是后面跟有冒号的标识符，比如 `label1:`
>
> 在 Java 中，标签起作用的**唯一**地方就是在循环语句之前。将  `break/continue` 随同标签一起使用，它们就会中断循环，直到标签所在的地方

这里有一个示例说明了 break 语句的工作状态。请注意，**标签必须放在希望跳出的最外层循环之前， 并且必须紧跟一个冒号。**

```java
Scanner in = new Scanner(System.in);
int n;
// 定义标签
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

#### Ⅱ continue

与 break 语句一样， 它将中断正常的控制流程。**continue 语句将控制转移到最内层循环的首部**。

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

**如果 n < 0, 则 continue 语句跳到 `count++` 语句**。

> 💡 其实只要我们记住 **`break `和 `continue `本身都只能中断最内层的循环**这句话，基本上就没啥使用难度了。

## 总结

相信大家学完本章都觉得问题不大吧，没错，这只是大多数编程语言中都有的基本特性，下一章我们将会讲解 Java 编程中的重要问题之一：对象的初始化和清理 🚧