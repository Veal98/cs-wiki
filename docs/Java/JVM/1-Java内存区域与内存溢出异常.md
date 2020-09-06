# 🔋 Java 内存区域与内存溢出异常

---

## 1. 概述

对于 C、Ｃ++ 来说，开发人员既拥有每一个对象的所有权，又担负着每一个对象生命开始到终结的维护责任。

对于 Java 来说，在虚拟机自动内存管理机制的帮助下，不再需要为每一个 `new` 操作去写相应的 `delete/free` 代码，不容易出现内存泄漏和内存溢出问题。

## 2. 运行时数据区域

**JVM（Java 虚拟机）在执行 Java 程序过程中会把它所管理的内存划分为若干个不同的数据区域**：

<img src="https://gitee.com/veal98/images/raw/master/img/20200906104939.png" style="zoom: 67%;" />

### ① 程序计数器

**程序计数器（Program Counter Register）**是很小的一块内存区域，可以看做是当前线程所执行字节码的行号指示器。

在虚拟机的概念模型中，字节码解释器工作时就是通过改变程序计数器的值来选取下一条需要执行的字节码指令，分支，循环，跳转，异常处理，线程恢复等基础功能均依赖于程序计数器。

在多线程中，**每个线程都有一个独立的程序计数器**，每个线程的程序计数器之间互不影响，即“**线程私有**”。同时，程序计数器是java虚拟机规范中唯一一个没有规定 `OutOfMemoryError` 的区域。

### ② Java 虚拟机栈

**Java 虚拟机栈（Java Virtual Machine Stacks）**描述的是 Java 方法执行的内存模型，每个方法在执行时候都会创建一个**栈帧（Stack Frame）**用于存储局部变量表，操作数栈，动态链接，方法出口等信息。**每个方法从被调用执行到执行完成的过程，就对应着一个栈帧在虚拟机栈中从入栈到出栈的过程**。

<img src="https://gitee.com/veal98/images/raw/master/img/20200906152345.png" style="zoom: 80%;" />

虚拟机栈也是线程私有的。在 Java 虚拟机规范中，虚拟机栈有两种异常状况：

- （1）线程请求的栈深度大于虚拟机栈所允许的深度，将抛出 `StackOverflowError` 异常；

- （2）如果虚拟机栈可以动态扩展，但扩展时无法申请到足够的内存，或者在创建新线程时候没有足够的内存去创建虚拟机栈，就会抛出 `OutOfMemoryError` （**OOM**）异常。

### ③ 本地方法栈

**本地方法栈（Native Method Stack）**和虚拟机栈的作用类似，区别在于 Java 虚拟机栈支持 Java 方法执行，而本地方法栈则支持 native 方法执行。有些虚拟机直接将 Java 虚拟机栈和本地方法栈合二为一，本地方法栈的异常情况与 Java 虚拟机栈的内存一致，即：

- （1）线程请求的栈深度大于本地方法栈所允许的深度，将抛出 `StackOverflowError` 异常；

- （2）如果本地方法栈可以动态扩展，但扩展时无法申请到足够的内存，或者在创建新线程时候没有足够的内存去创建本地方法栈，就会抛出 `OutOfMemoryError` 异常。

本地方法一般是用其它语言（C、C++ 或汇编语言等）编写的，并且被编译为基于本机硬件和操作系统的程序，对待这些方法需要特别处理。

<img src="https://gitee.com/veal98/images/raw/master/img/20200906151512.png" style="zoom:67%;" />

### ④ Java 堆

<u>**Java 堆（Java Heap）**是 Java 虚拟机所管理的内存中最大的一块</u>，它是被**所有线程共享**的内存区域，在虚拟机启动时候创建。**Java 堆的唯一目的就是存放对象实例（new 出来的对象都放在堆里）**，几乎所有的对象实例都在这里分配内存。

Java 堆是**垃圾收集器管理的主要区域**，因此很多时候也被称为 “**GC堆（Garbage Collected Heap）**”。垃圾收集器就是收集 Java 堆中的这些对象，然后根据 GC 算法回收。

从内存回收的角度来看，由于收集器基本都采用分代收集算法，所以 <u>Java 堆还可以细分为**新生代（Young Gen）**和**老年代（Old Gen）**。</u>新生代又可以继续分为 Eden 空间，From Survivor 空间，To Survivor 空间。详细如下：👇

<img src="https://gitee.com/veal98/images/raw/master/img/20200906153519.png" style="zoom:75%;" />

- JVM 内存划分为堆内存和非堆内存，堆内存分为**年轻代（Young Generation）**、**老年代（Old Generation）**，非堆内存就一个**永久代（Permanent Generation）**。

- 年轻代又分为 Eden 和 Survivor 区。Survivor 区由 FromSpace 和 ToSpace 组成。Eden 区占大容量，Survivor 两个区占小容量，默认比例是 8:1:1。

- 非堆内存用途：永久代，也称为方法区，存储程序运行时长期存活的对象，比如类的元数据、方法、常量、属性等。

  > 🚨 **在 JDK1.8 版本废弃了永久代，替代的是元空间（MetaSpace）**，元空间与永久代上类似，都是方法区的实现，他们最大区别是：**元空间并不在 JVM 中，而是使用本地内存**。

Java 堆的大小可以是固定的，也可以是随着程序执行动态扩展，并在不需要过多空间时候自动收缩。且 **Java 堆所使用的内存不需要保证是连续的**。如果实际所需的堆超过了自动内存管理系统所能提供的最大容量，Java 虚拟机将会抛出一个 `OutOfMemoryError` 异常。

```java
// Java 堆内存溢出异常测试
public class HeapOOM {
    static class OOMObject {
        
    }
    
    public static void main(String[] args) {
        List<OOMObject> list = new ArrayList<OOMObject>();
        while(true){
            list.add(new OOMObject());
        }
    }
}
```

🏃‍ 运行结果：`java.lang.OutOfMemoryError:Java heap sapce`

### ⑤ 方法区

**方法区（Method Area）**和 Java 堆一样，是**所有线程共享**的内存区域。它**存储了每一个类的结构信息**，例如运行时常量池，字段和方法数据，构造函数和普通方法的字节码内容，还包括一些在类，实例，接口初始化时用到的特殊方法。

按照 Java 虚拟机规范，当方法区不能满足内存分配请求时，Java 虚拟机将抛出 `OutOfMemoryError` 异常。

### ⑥ 运行时常量池

<u>**运行时常量池（Runtime Constant Pool）**是方法区的一部分</u>，是 class 文件中每一个类或者接口的常量池表在运行时的表现形式。**在加载类和接口到虚拟机后，就创建对应的运行时常量池**。如果构造运行时常量池所需要的内存空间超过了方法区所能提供的最大值，Java 虚拟机就会抛出一个 `OutOfMemoryError` 异常。

需要特别注意的是，运行时常量池和字符串常量池的区别：

- 在 JDK1.7 之前，运行时常量池逻辑包含字符串常量池存放在方法区。

- 在 JDK1.7 之后，字符串常量池被从方法区拿到了堆中，运行时常量池剩下的东西还在方法区。

  <img src="https://gitee.com/veal98/images/raw/master/img/20200906113117.png" style="zoom: 67%;" />

### ⑦ 直接内存

<u>**直接内存（Direct Memory）**并不是虚拟机运行时数据区的一部分</u>，也不是 Java 虚拟机规范中定义的内存区域。但是这部分内存也被频繁的使用，而且也可能导致 `OutOfMemoryError` 异常。

<img src="https://gitee.com/veal98/images/raw/master/img/20200906115653.png" style="zoom: 80%;" />

在 JDK 1.4 中新引入了 NIO 类，它可以使用 Native 函数库直接分配堆外内存，然后通过 Java 堆里的 `DirectByteBuffer` 对象作为这块内存的引用进行操作。这样能在一些场景中显著提高性能，因为避免了在堆内存和堆外内存来回拷贝数据。

## 📚 References

- 《深入理解 Java 虚拟机 — 周志明 第 2 版》
- [CS-Notes](https://cyc2018.github.io/CS-Notes)
- [JVM堆内存(heap)详解](https://blog.csdn.net/lingbo229/article/details/82586822)