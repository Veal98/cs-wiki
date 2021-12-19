# JMM 最最最核心的概念：Happens-before 原则

---

关于 Happens-before，《Java 并发编程的艺术》书中是这样介绍的：

> Happens-before 是 JMM 最核心的概念。对应 Java 程序员来说，理解 Happens-before 是理解 JMM 的关键。

《深入理解 Java 虚拟机 - 第 3 版》书中是这样介绍的：

> Happens-before 是 JMM 的灵魂，它是判断数据是否存在竞争，线程是否安全的非常有用的手段。

我想，这两句话就已经足够表明 Happens-before 原则的重要性。

那为什么 Happens-before 被不约而同的称为 JMM 的核心和灵魂呢？

生来如此。 

## JMM 设计者的难题与完美的解决方案

上篇文章我们学习了 JMM 及其三大性质，事实上，从 JMM 设计者的角度来看，可见性和有序性其实是互相矛盾的两点：

- 一方面，对于程序员来说，我们希望内存模型易于理解、易于编程，为此 JMM 的设计者要为程序员提供足够强的内存可见性保证，专业术语称之为 “**强内存模型**”。
- 而另一方面，编译器和处理器则希望内存模型对它们的束缚越少越好，这样它们就可以做尽可能多的优化（比如重排序）来提高性能，因此 JMM 的设计者对编译器和处理器的限制要尽可能地放松，专业术语称之为 “**弱内存模型**”。

对于这个问题，从 JDK 5 开始，也就是在 JSR-133 内存模型中，终于给出了一套完美的解决方案，那就是 **Happens-before** 原则，Happens-before 直译为 “先行发生”，《JSR-133：Java Memory Model and Thread Specification》对 Happens-before 关系的定义如下：

> 1）如果一个操作 Happens-before 另一个操作，那么第一个操作的执行结果将对第二个操作可见，而且第一个操作的执行顺序排在第二个操作之前。
>
> 2）两个操作之间存在 Happens-before 关系，并不意味着 Java 平台的具体实现必须要按照 Happens-before 关系指定的顺序来执行。如果重排序之后的执行结果，与按 Happens-before 关系来执行的结果一致，那么这种重排序并不非法（也就是说，JMM 允许这种重排序）

并不难理解，第 1 条定义是 JMM 对程序员强内存模型的承诺。从程序员的角度来说，可以这样理解 Happens-before 关系：如果 A Happens-before B，那么 JMM 将向程序员保证 — A 操作的结果将对 B 可见，且 A 的执行顺序排在 B 之前。注意，这只是 Java内存模型向程序员做出的保证！

需要注意的是，不同于 as-if-serial 语义只能作用在单线程，这里提到的两个操作 A 和 B 既可以是在一个线程之内，也可以是在不同线程之间。也就是说，Happens-before 提供**跨线程的内存可见性保证**。

针对这个第 1 条定义，我来举个例子：

```java
// 以下操作在线程 A 中执行
i = 1; // a

// 以下操作在线程 B 中执行
j = i; // b

// 以下操作在线程 C 中执行
i = 2; // c
```

假设线程 A 中的操作 a Happens-before 线程 B 的操作 b，那我们就可以确定操作 b 执行后，变量 j 的值一定是等于 1。

得出这个结论的依据有两个：一是根据 Happens-before 原则，a 操作的结果对 b 可见，即 “i=1” 的结果可以被观察到；二是线程 C 还没运行，线程 A 操作结束之后没有其他线程会修改变量 i 的值。

现在再来考虑线程 C，我们依然保持 a Happens-before b ，而 c 出现在 a 和 b 的操作之间，但是 c 与 b 没有 Happens-before 关系，也就是说 b 并不一定能看到 c 的操作结果。那么 b 操作的结果也就是 j 的值就不确定了，可能是 1 也可能是 2，那这段代码就是线程不安全的。 

<br>

再来看 Happens-before 的第 2 条定义，这是 JMM 对编译器和处理器弱内存模型的保证，在给予充分的可操作空间下，对编译器和处理器的重排序进行一定的约束。也就是说，JMM 其实是在遵循一个基本原则：**只要不改变程序的执行结果（指的是单线程程序和正确同步的多线程程序），编译器和处理器怎么优化都行**。

JMM 这么做的原因是：程序员对于这两个操作是否真的被重排序并不关心，程序员关心的是执行结果不能被改变。

文字可能不是很好理解，我们举个例子，来解释下第 2 条定义：虽然两个操作之间存在 Happens-before 关系，但不意味着 Java 平台的具体实现必须要按照 Happens-before 关系指定的顺序来执行。

```java
int a = 1; 		// A
int b = 2;		// B
int c = a + b;	// C
```

根据 Happens-before 规则（下文会讲），上述代码存在 3 个 Happens-before 关系：

1）A Happens-before B

2）B Happens-before C

3）A Happens-before C

可以看出来，在 3 个 Happens-before 关系中，第 2 个和第 3 个是必需的，但第 1 个是不必要的。

也就是说，虽然 A Happens-before B，但是 A 和 B 之间的重排序完全不会改变程序的执行结果，所以 JMM 是允许编译器和处理器执行这种重排序的。

看下面这张 JMM 的设计图更直观：

![图片来源《Java 并发编程的艺术》](https://gitee.com/veal98/images/raw/master/img/20210508173921.png)

其实，可以这么简单的理解，为了避免 Java 程序员为了理解 JMM 提供的内存可见性保证而去学习复杂的重排序规则以及这些规则的具体实现方法，JMM 就出了这么一个简单易懂的 Happens-before 原则，**一个 Happens-before 规则就对应于一个或多个编译器和处理器的重排序规则**，这样，我们只需要弄明白 Happens-before 就行了。

![图片来源《Java 并发编程的艺术》](https://gitee.com/veal98/images/raw/master/img/20210508171155.png)

## 8 条 Happens-before 规则

《JSR-133:Java Memory Model and Thread Specification》定义了如下 Happens-before 规则， 这些就是 JMM 中“天然的” Happens-before 关系，这些 Happens-before 关系无须任何同步器协助就已经存在，可以在编码中直接使用。如果两个操作之间的关系不在此列，并且无法从下列规则推导出来，则它们就没有顺序性保障，JVM 可以对它们随意地进行重排序：

> 1）**程序次序规则**（Program Order Rule）：在一个线程内，按照控制流顺序，书写在前面的操作先行发生（Happens-before）于书写在后面的操作。注意，这里说的是控制流顺序而不是程序代码顺序，因为要考虑分支、循环等结构。

这个很好理解，符合我们的逻辑思维。比如我们上面举的例子：

```java
int a = 1; 		// A
int b = 2;		// B
int c = a + b;	// C
```

根据程序次序规则，上述代码存在 3 个 Happens-before 关系：

- A Happens-before B
- B Happens-before C
- A Happens-before C

> 2）**管程锁定规则**（Monitor Lock Rule）：一个 unlock 操作先行发生于后面对同一个锁的 lock 操作。这里必须强调的是 “同一个锁”，而 “后面” 是指时间上的先后。

这个规则其实就是针对 synchronized 的。JVM 并没有把 `lock` 和 `unlock` 操作直接开放给用户使用，但是却提供了更高层次的字节码指令 `monitorenter` 和 `monitorexit` 来隐式地使用这两个操作。这两个字节码指令反映到 Java 代码中就是同步块 — `synchronized`。

举个例子：

```java
synchronized (this) { // 此处自动加锁
	if (x > 1) {
        x = 1;
    }      
} // 此处自动解锁
```

根据管程锁定规则，假设 x 的初始值是 10，线程 A 执行完代码块后 x 的值会变成 1，执行完自动释放锁，线程 B 进入代码块时，能够看到线程 A 对 x 的写操作，也就是线程 B 能够看到 x == 1。

> 3）**volatile 变量规则**（Volatile Variable Rule）：对一个 volatile 变量的写操作先行发生于后面对这个变量的读操作，这里的 “后面” 同样是指时间上的先后。

这个规则就是 JDK 1.5 版本对 volatile 语义的增强，其意义之重大，靠着这个规则搞定可见性易如反掌。

举个例子：

![](https://gitee.com/veal98/images/raw/master/img/20210508204833.png)

假设线程 A 执行 writer() 方法之后，线程 B 执行 reader() 方法。

根据根据程序次序规则：1 Happens-before 2；3 Happens-before 4。

根据 volatile 变量规则：2 Happens-before 3。

根据传递性规则：1 Happens-before 3；1 Happens-before 4。

也就是说，如果线程 B 读到了 “flag==true” 或者 “int i = a” 那么线程 A 设置的“a=42”对线程 B 是可见的。

看下图：

![](https://gitee.com/veal98/images/raw/master/img/20210508205815.png)

> 4）**线程启动规则**（Thread Start Rule）：Thread 对象的 start() 方法先行发生于此线程的每一个动作。

比如说主线程 A 启动子线程 B 后，子线程 B 能够看到主线程在启动子线程 B 前的所有操作。

> 5）**线程终止规则**（Thread Termination Rule）：线程中的所有操作都先行发生于对此线程的终止检测，我们可以通过 Thread 对象的 join() 方法是否结束、Thread 对象的 isAlive() 的返回值等手段检测线程是否已经终止执行。

> 6）**线程中断规则**（Thread Interruption Rule）：对线程 interrupt() 方法的调用先行发生于被中断线程的代码检测到中断事件的发生，可以通过 Thread 对象的 interrupted() 方法检测到是否有中断发生。

> 7）**对象终结规则**（Finalizer Rule）：一个对象的初始化完成（构造函数执行结束）先行发生于它的 finalize() 方法的开始。

> 8）**传递性**（Transitivity）：如果操作 A 先行发生于操作 B，操作 B 先行发生于操作 C，那就可以得出操作 A 先行发生于操作 C 的结论。

## “时间上的先发生” 与 “先行发生”

上述 8 种规则中，还不断提到了时间上的先后，那么，“时间上的先发生” 与 “先行发生（Happens-before）” 到底有啥区别？

**一个操作 “时间上的先发生” 是否就代表这个操作会是“先行发生” 呢？一个操作 “先行发生” 是否就能推导出这个操作必定是“时间上的先发生”呢？**

很遗憾，这两个推论都是不成立的。

举两个例子论证一下：

```java
private int value = 0;

// 线程 A 调用
pubilc void setValue(int value){    
    this.value = value;
}

// 线程 B 调用
public int getValue(){
    return value;
}
```

假设存在线程 A 和 B，线程 A 先（时间上的先后）调用了 setValue(1)，然后线程 B 调用了同一个对象的 getValue() ，那么线程 B 收到的返回值是什么？

我们根据上述 Happens-before 的 8 大规则依次分析一下：

由于两个方法分别由线程 A 和 B 调用，不在同一个线程中，所以程序次序规则在这里不适用；

由于没有 `synchronized` 同步块，自然就不会发生 lock 和 unlock 操作，所以管程锁定规则在这里不适用；

同样的，`volatile` 变量规则，线程启动、终止、中断规则和对象终结规则也和这里完全没有关系。

因为没有一个适用的 Happens-before 规则，所以第 8 条规则传递性也无从谈起。

因此我们可以判定，尽管线程 A 在操作时间上来看是先于线程 B 的，但是并不能说 A Happens-before B，也就是 A 线程操作的结果 B 不一定能看到。所以，这段代码是线程不安全的。

想要修复这个问题也很简单？既然不满足 Happens-before 原则，那我修改下让它满足不就行了。比如说把 Getter/Setter 方法都用 `synchronized` 修饰，这样就可以套用管程锁定规则；再比如把 value 定义为 `volatile` 变量，这样就可以套用 volatile 变量规则等。

这个例子，就论证了**一个操作 “时间上的先发生” 不代表这个操作会是 “先行发生（Happens-before）”**。



再来看一个例子：

```java
// 以下操作在同一个线程中执行
int i = 1;
int j = 2;
```

假设这段代码中的两条赋值语句在同一个线程之中，那么根据程序次序规则，“int i = 1” 的操作先行发生（Happens-before）于 “int j = 2”，但是，还记得 Happens-before 的第 2 条定义吗？还记得上文说过 JMM 实际上是遵守这样的一条原则：只要不改变程序的执行结果（指的是单线程程序和正确同步的多线程程序），编译器和处理器怎么优化都行。

所以，“int j=2” 这句代码完全可能优先被处理器执行，因为这并不影响程序的最终运行结果。

那么，这个例子，就论证了**一个操作 “先行发生（Happens-before）” 不代表这个操作一定是“时间上的先发生”**。

这样，综上两例，我们可以得出这样一个结论：Happens-before 原则与时间先后顺序之间基本没有因果关系，所以我们在衡量并发安全问题的时候，尽量不要受时间顺序的干扰，一切必须以 Happens-before 原则为准。

## Happens-before 与 as-if-serial

综上，我觉得其实读懂了下面这句话也就读懂了 Happens-before 了，这句话上文也出现过几次：JMM 其实是在遵循一个基本原则，即只要不改变程序的执行结果（指的是单线程程序和正确同步的多线程程序），编译器和处理器怎么优化都行。

再回顾下 as-if-serial 语义：不管怎么重排序，单线程环境下程序的执行结果不能被改变。

各位发现没有？本质上来说 Happens-before 关系和 as-if-serial 语义是一回事，**都是为了在不改变程序执行结果的前提下，尽可能地提高程序执行的并行度**。只不过后者只能作用在单线程，而前者可以作用在正确同步的多线程环境下：

- as-if-serial 语义保证单线程内程序的执行结果不被改变，Happens-before 关系保证正确同步的多线程程序的执行结果不被改变。
- as-if-serial 语义给编写单线程程序的程序员创造了一个幻境：单线程程序是按程序的顺序来执行的。Happens-before 关系给编写正确同步的多线程程序的程序员创造了一个幻境：正确同步的多线程程序是按 Happens-before 指定的顺序来执行的。

## References

- 《Java 并发编程的艺术》
- 《深入理解 Java 虚拟机 - 第 3 版》

