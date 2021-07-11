# 🔋 Java 内存区域与内存溢出异常

---

## 1. 概述

JVM 是 Java Virtual Machine 的缩写，它是一个虚构出来的计算机，一种规范。通过在实际的计算机上仿真模拟各类计算机功能实现···

通俗来说 JVM 其实就类似于一台小电脑运行在 windows 或者 linux 这些操作系统环境下。它直接和操作系统进行交互，与硬件不直接交互，由操作系统帮我们完成和硬件进行交互的工作。

![](https://gitee.com/veal98/images/raw/master/img/20200907144606.png)

对于 C、Ｃ++ 来说，开发人员既拥有每一个对象的所有权，又担负着每一个对象生命开始到终结的维护责任。

对于 Java 来说，在虚拟机自动内存管理机制的帮助下，不再需要为每一个 `new` 操作去写相应的 `delete/free` 代码，不容易出现内存泄漏和内存溢出问题。

## 2. 运行时数据区域

**JVM（Java 虚拟机）在执行 Java 程序过程中会把它所管理的内存划分为若干个不同的数据区域**：

<img src="https://gitee.com/veal98/images/raw/master/img/20200906104939.png" style="zoom: 67%;" />

### ① 程序计数器

**程序计数器（Program Counter Register）**是很小的一块内存区域，可以看做是当前线程所执行字节码的行号指示器。

在虚拟机的概念模型中，字节码解释器工作时就是通过改变程序计数器的值来选取下一条需要执行的字节码指令，分支，循环，跳转，异常处理，线程恢复等基础功能均依赖于程序计数器。

在多线程中，**每个线程都有一个独立的程序计数器**，每个线程的程序计数器之间互不影响，即“**线程私有**”。同时，程序计数器是java虚拟机规范中唯一一个没有规定 `OutOfMemoryError` 的区域。

### ② 虚拟机栈

**虚拟机栈（Virtual Machine Stacks）**描述的是 Java 方法执行的内存模型，每个方法在执行时候都会创建一个**栈帧（Stack Frame）**用于<u>存储局部变量表，操作数栈，动态链接，方法出口</u>等信息。

```java
public int getName(){ // getName() 方法存放在栈中
   	int a = 1; // a 存放在栈中
    return a;
}
```

**每个方法从被调用执行到执行完成的过程，就对应着一个栈帧在虚拟机栈中从入栈到出栈的过程**。

<img src="https://gitee.com/veal98/images/raw/master/img/20200906152345.png" style="zoom: 80%;" />

虚拟机栈也是线程私有的。在 Java 虚拟机规范中，虚拟机栈有两种异常状况：

- （1）线程请求的栈深度大于虚拟机栈所允许的深度，将抛出 `StackOverflowError` 异常；

- （2）如果虚拟机栈可以动态扩展，但扩展时无法申请到足够的内存，或者在创建新线程时候没有足够的内存去创建虚拟机栈，就会抛出 `OutOfMemoryError` （**OOM**）异常。

### ③ 本地方法栈

**本地方法栈（Native Method Stack）**区别是： **虚拟机栈为虚拟机执行 Java 方法 （也就是字节码）服务，而本地方法栈则为虚拟机使用到的 Native 方法服务。** 在 HotSpot 虚拟机中，本地方法栈和 Java 虚拟机栈合二为一。本地方法栈的异常情况与 Java 虚拟机栈的内存一致，即：

- （1）线程请求的栈深度大于本地方法栈所允许的深度，将抛出 `StackOverflowError` 异常；

- （2）如果本地方法栈可以动态扩展，但扩展时无法申请到足够的内存，或者在创建新线程时候没有足够的内存去创建本地方法栈，就会抛出 `OutOfMemoryError` 异常。

本地方法一般是用其它语言（C、C++ 或汇编语言等）编写的，并且被编译为基于本机硬件和操作系统的程序，对待这些方法需要特别处理。

<img src="https://gitee.com/veal98/images/raw/master/img/20200906151512.png" style="zoom:67%;" />

### ④ 堆

<u>**堆（Java Heap）**是 Java 虚拟机所管理的内存中最大的一块</u>，它是被**所有线程共享**的内存区域，在虚拟机启动时候创建。**Java 堆的唯一目的就是存放对象实例（new 出来的对象都放在堆里）**，几乎所有的对象实例都在这里分配内存。

```java
public User getName(){
	User user = new User("aaa"); // user 存放在堆中
    return user;
}
```

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

💡 字符串常量池的详细知识可以参考 👉  [https://veal98.gitee.io/cs-wiki/#/Java/Java基础/8-字符串?id=⑨-字符串常量池-string-pool](https://veal98.gitee.io/cs-wiki/#/Java/Java基础/8-字符串?id=⑨-字符串常量池-string-pool)

```java
String a = "aaa"; // 存放在字符串常量池中
String b = new String("bbb"); // 存放在堆中
String s3 = s1.intern(); // s3 存放在字符串常量池中
```



### ⑦ 直接内存

<u>**直接内存（Direct Memory）**并不是虚拟机运行时数据区的一部分</u>，也不是 Java 虚拟机规范中定义的内存区域。但是这部分内存也被频繁的使用，而且也可能导致 `OutOfMemoryError` 异常。

<img src="https://gitee.com/veal98/images/raw/master/img/20200906115653.png" style="zoom: 80%;" />

在 JDK 1.4 中新引入了 NIO 类，它可以使用 Native 函数库直接分配堆外内存，然后通过 Java 堆里的 `DirectByteBuffer` 对象作为这块内存的引用进行操作。这样能在一些场景中显著提高性能，因为避免了在堆内存和堆外内存来回拷贝数据。

## 3. 简单的代码例子

一个简单的学生类：

```java
public class Student{
    public String name;
    
    public Student(String name){
        this.name = name;
    }
    
    public void sayName(){
        System.out.println("student's name is " + name);
    }
}
```

一个 `main` 方法：

```java
public class App {
    public static void main(String[] args){
        Student student = new Student("Jack");
        student.sayName();
    }
}
```

⭐ 执行 `main` 方法的步骤如下:

- 编译好 App.java 得到 App.class 后，执行 App.class，系统会启动一个 JVM 进程，从 classpath 路径中找到一个名为 App.class 的二进制文件，将 App 的类信息加载到运行时数据区的方法区内，这个过程叫做 App 类的加载
- JVM 找到 App 的主程序入口，执行 `main` 方法
- 这个 `main` 中的第一条语句为 `Student student = new Student("tellUrDream")` ，就是让 JVM 创建一个`Student` 对象，但是这个时候方法区中是没有 `Student` 类的信息的，所以 JVM 马上加载 `Student` 类，把 `Student` 类的信息放到方法区中
- 加载完 `Student `类后，JVM 在堆中为一个新的 `Student `实例分配内存，然后调用构造函数初始化 `Student `实例，这个 `Student ` 实例持有 **指向方法区中的 `Student` 类的类型信息** 的引用
- 执行 `student.sayName();` 时，JVM 根据 `student `的引用找到 `student `对象，然后根据 `student `对象持有的引用定位到方法区中 `student `类的类型信息的方法表，获得 `sayName()` 的字节码地址。
- 执行 `sayName()`




## 4. HotSpot 虚拟机对象探秘

通过上面的介绍我们大概知道了虚拟机的内存情况，下面我们来详细的了解一下 HotSpot 虚拟机在 Java 堆中对象分配、布局和访问的全过程。

### ① 对象的创建

下图便是 Java 对象的创建过程：

<img src="https://gitee.com/veal98/images/raw/master/img/20200907142925.png" style="zoom:80%;" />

- 📋 **Step1: 类加载检查**：

  虚拟机遇到一条 `new  `指令时，首先将去检查这个指令的参数是否能在常量池中定位到这个类的符号引用，并且检查这个符号引用代表的类是否已被加载过、解析和初始化过。如果没有，那必须先执行相应的类加载过程。

- 📋 **Step2:分配内存**：

  在类加载检查通过后，接下来虚拟机将为新生对象分配内存。对象所需的内存大小在类加载完成后便可确定，为对象分配空间的任务等同于把一块确定大小的内存从 Java 堆中划分出来。**分配方式有 “指针碰撞” 和 “空闲列表” 两种**，选择哪种分配方式由 Java 堆是否规整决定，而 Java 堆是否规整又由所采用的垃圾收集器是否带有压缩整理功能决定。

  **内存分配的两种方式**：👇

  ![](https://gitee.com/veal98/images/raw/master/img/20200907142222.png)

  选择以上两种方式中的哪一种，取决于 Java 堆内存是否规整。而 Java 堆内存是否规整，取决于 GC 收集器的算法是"标记-清除"，还是"标记-整理"（也称作"标记-压缩"），值得注意的是，复制算法内存也是规整的

  ❓ **内存分配并发问题**：

  在创建对象的时候有一个很重要的问题，就是线程安全，因为在实际开发过程中，创建对象是很频繁的事情，作为虚拟机来说，必须要保证线程是安全的，通常来讲，<u>虚拟机采用两种方式来保证线程安全</u>：

  - **CAS+失败重试**： CAS 是乐观锁的一种实现方式。所谓乐观锁就是，每次不加锁而是假设没有冲突而去完成某项操作，如果因为冲突失败就重试，直到成功为止。虚拟机采用 CAS 配上失败重试的方式保证更新操作的原子性。
  - **TLAB**： 为每一个线程预先在 Eden 区分配一块内存，JVM 在给线程中的对象分配内存时，首先在 TLAB 分配，当对象大于 TLAB 中的剩余内存或 TLAB 的内存已用尽时，再采用上述的 CAS 进行内存分配

- 📋**Step3:初始化零值**：

  内存分配完成后，虚拟机需要将分配到的内存空间都初始化为零值（不包括对象头），这一步操作保证了对象的实例字段在 Java 代码中可以不赋初始值就直接使用，程序能访问到这些字段的数据类型所对应的零值。

- 📋**Step4:设置对象头**：

  初始化零值完成之后，虚拟机要对对象进行必要的设置，例如这个对象是哪个类的实例、如何才能找到类的元数据信息、对象的哈希码、对象的 GC 分代年龄等信息。 这些信息存放在对象头中。 另外，根据虚拟机当前运行状态的不同，如是否启用偏向锁等，对象头会有不同的设置方式。

- 📋 **Step5:执行 `init` 方法**：

  在上面工作都完成之后，从虚拟机的视角来看，一个新的对象已经产生了，但从 Java 程序的视角来看，对象创建才刚开始，`<init>` 方法还没有执行，所有的字段都还为零。所以一般来说，执行 `new ` 指令之后会接着执行 `<init>` 方法，把对象按照程序员的意愿进行初始化，这样一个真正可用的对象才算完全产生出来。

### ② 对象的内存布局

在 Hotspot 虚拟机中，对象在内存中的布局可以分为 3 块区域：**对象头**、**实例数据** 和 **对齐填充**。

**Hotspot 虚拟机的对象头包括两部分信息**，**第一部分用于存储对象自身的运行时数据**（哈希码、GC 分代年龄、锁状态标志等等），**另一部分是类型指针**，即对象指向它的类元数据的指针，虚拟机通过这个指针来确定这个对象是哪个类的实例。

**实例数据部分是对象真正存储的有效信息**，也是在程序中所定义的各种类型的字段内容。

**对齐填充部分不是必然存在的，也没有什么特别的含义，仅仅起占位作用。** 因为 Hotspot 虚拟机的自动内存管理系统要求对象起始地址必须是 8 字节的整数倍，换句话说就是对象的大小必须是 8 字节的整数倍。而对象头部分正好是 8 字节的倍数（1 倍或 2 倍），因此，当对象实例数据部分没有对齐时，就需要通过对齐填充来补全。

### ③ 对象的访问定位

建立对象就是为了使用对象，我们的 Java 程序通过栈上的 `reference `数据来操作堆上的具体对象。对象的访问方式由虚拟机实现而定，目前主流的访问方式有 **使用句柄** 和 **直接指针**两种：

- **句柄：** 如果使用句柄的话，那么 Java 堆中将会划分出一块内存来作为句柄池，<u>`reference `中存储的就是对象的句柄地址，而句柄中包含了对象实例数据与类型数据各自的具体地址信息</u>；

  <img src="https://gitee.com/veal98/images/raw/master/img/20200907143326.png" style="zoom: 50%;" />

- **直接指针**： 如果使用直接指针访问，那么 Java 堆对象的布局中就必须考虑如何放置访问类型数据的相关信息，而 `reference `中存储的直接就是对象的地址。

  ![](https://gitee.com/veal98/images/raw/master/img/20200907143455.png)

这两种对象访问方式各有优势。使用句柄来访问的最大好处是 `reference `中存储的是稳定的句柄地址，在对象被移动时只会改变句柄中的实例数据指针，而 `reference `本身不需要修改。使用直接指针访问方式最大的好处就是速度快，它节省了一次指针定位的时间开销。





## 📚 References

- 《深入理解 Java 虚拟机 — 周志明 第 2 版》
- [CS-Notes](https://cyc2018.github.io/CS-Notes)
- [JavaGuide — Github](https://snailclimb.gitee.io/javaguide/#/?id=jvm)
- [JVM堆内存(heap)详解](https://blog.csdn.net/lingbo229/article/details/82586822)
- [大白话带你认识 JVM](https://juejin.im/post/5e1505d0f265da5d5d744050#heading-28)