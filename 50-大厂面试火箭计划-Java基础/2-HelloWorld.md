# 🧀 Java小白成长记 · 第 2 篇《HelloWorld》

---

## 0. 前言

这是一个技术疯狂迭代的时代，各种框架层出不穷，然而底层基础才是核心竞争力。博主（小牛肉）在现有的知识基础上，以上帝视角对 Java 语言基础进行复盘，汇总《Java 小白成长记》系列，力争从 0 到 1，全文无坑。

## 1. 区分 JDK 和 JRE

在写下第一个 Java 程序之前，大家先把 Java 的环境安装好，网络上到处都是，此处就不讲了。

在安装过程中我们会看见 JDK 和 JRE 这两个名词，它们到底是什么呢？

首先，我们需要知道 Java 程序其实是运行在JVM (Java虚拟机) 上的，使用 Java 编译器编译 Java 程序时，生成的是与平台无关的字节码，这些字节码只面向 JVM。不同平台的 JVM 都是不同的，但它们都提供了相同的接口，这也正是 Java 跨平台的原因。其和 JDK、JRE 的关系如下图所示：

<img src="https://gitee.com/veal98/images/raw/master/img/20210106175047.png" style="zoom:67%;" />

### ① JDK

**JDK（Java Development Kit）**：是 Java 的标准开发工具包（**普通用户只需要安装 JRE 来运行 Java 程序。而程序开发者必须安装 JDK 来编译、调试程序**）。它提供了编译、运行 Java 程序所需的各种工具和资源，包括 Java 编译器、Java 运行环境 JRE，以及常用的 Java 基础类库等，是整个 Java 的核心

下图是 Java 8 中 JDK 的安装目录

<img src="https://gitee.com/veal98/images/raw/master/img/20210106175401.png" style="zoom: 67%;" />

- `bin` 文件里面存放了JDK的各种开发工具的可执行文件，主要的是编译器 (`javac.exe`)
- `db` 文件是一个先进的全事务处理的基于 Java 技术的数据库（jdk 自带数据库 db 的使用）
- `include` 文件里面是 Java 和 JVM 交互用的头文件 
- `jre` 为 Java 运行环境
- `lib` 文件存放的是 JDK 工具命令的实际执行程序

### ② JRE

**JRE（Java runtime environment）**： 是运行基于 Java 语言编写的程序所不可缺少的运行环境，用于解释执行 Java 的字节码文件。

也是通过它，Java 的开发者才得以将自己开发的程序发布到用户手中，让用户使用。JRE 中包含了 Java virtual machine（JVM），runtime class libraries 和 Java application launcher，这些是运行 Java 程序的必要组件。与大家熟知的 JDK 不同，JRE 是 Java 运行环境，并不是一个开发环境，所以没有包含任何开发工具（如编译器和调试器），只是针对于使用 Java 程序的用户。

下图是Java 8中 JRE 的安装目录，里面有两个文件夹 `bin` 和 `lib`。你可以认为 bin 里的就是 JVM，lib 中则是 JVM 工作所需要的类库，而 JVM 和 lib 和起来就称为 JRE

<img src="https://gitee.com/veal98/images/raw/master/img/20210106175608.png" style="zoom:67%;" />

## 2. Hello World

下面看一个最简单的 Java 应用程序：

```java
public class FirstSample{
    public static void main(String[] args){
        System.out.println("Hello World!")
    }
}
```

这个程序虽然很简单， 但所有的 Java 应用程序都具有这种结构， 还是值得花一些时间来研究。

## 3. 命名可见性

在 Java 中，文件中的每个类都具有唯一标识符。这样，Java 语言可以防止名称冲突。即**源代码的文件名必须与文件中公共类 `public class` 的名字相同**。因此，存储这段源代码的文件名必须为 `FirstSample.java`  (再次提醒大家注意，大小写是非常重要的， 千万不能写成 `firstsample.java`) 

## 4. 导入其他组件

`import` 指示编译器导入一个包，也就是一个类库：

```java
import java.util.ArrayList;
```

上例可以告诉编译器使用位于标准库 `util` 下的 `ArrayList `类。`util` 中包含许多类，我们可以使用通配符 `*` 来导入所有类，而无需显式得逐一声明这些类。代码示例：

```java
import java.util.*;
```

## 5. static 关键字

> 💡 该关键字后续我们还会重新总结，此处只做粗略了解

根据 Java 语言规范， **`main` 方法必须声明为 `public static`。** 下面讨论一下 `static（静态）` 修饰符的含义：

**当我们说某个事物是静态时，就意味着该字段或方法不依赖于任何特定的对象实例 。 即使我们从未创建过该类的对象，也可以调用其静态方法或访问其静态字段**。相反，对于普通的非静态字段和方法，我们必须要先创建一个对象并使用该对象来访问字段或方法，因为非静态字段和方法必须与特定对象关联。

我们可以在类的字段或方法前添加 `static` 关键字来表示这是一个静态字段或静态方法。 代码示例：

```java
class StaticTest {
    static int i = 47;
}
```

现在，即使你创建了两个 `StaticTest` 对象，但是静态变量 `i` 仍只占一份存储空间。两个对象都会**共享**相同的变量 `i`。 代码示例：

```java
StaticTest st1 = new StaticTest();
StaticTest st2 = new StaticTest();
```

`st1.i` 和 `st2.i` 指向同一块存储空间，因此它们的值都是 47。引用静态变量有两种方法。在前面的示例中，我们通过一个对象来定位它，例如 `st2.i`。我们也可以通过类名直接引用它（这种方式对于非静态成员则不可行）：

```java
StaticTest.i++;
```

`++` 运算符将会使变量结果 + 1。此时 `st1.i` 和 `st2.i` 的值都变成了 48。

**使用类名直接引用静态变量是首选方法，因为它强调了变量的静态属性**。

类似的逻辑也适用于静态方法。我们可以通过对象引用静态方法，就像使用任何方法一样，也可以通过特殊的语法方式 `Classname.method()` 来直接调用静态字段或方法。 代码示例：

```java
class Incrementable {
    static void increment() { 
      	StaticTest.i++; 
    }
}
```

上例中，`Incrementable` 的 `increment()` 方法通过 `++` 运算符将静态数据 `i` 加 1。我们依然可以先实例化对象再调用该方法。 代码示例：

```java
Incrementable sf = new Incrementable();
sf.increment();
```

当然了，首选的方法是直接通过类来调用它。代码示例：

```java
Incrementable.increment();
```

相比非静态的对象，`static` 属性改变了数据创建的方式。同样，**当 `static` 关键字修饰方法时，它允许我们无需创建对象就可以直接通过类的引用来调用该方法。正如我们所知，`static` 关键字的这些特性对于应用程序入口点的 `main()` 方法尤为重要。**

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