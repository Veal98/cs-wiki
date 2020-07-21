# 🎪 lambda 表达式

---

现在来学习 lambda 表达式， 这是这些年来 Java 语言最让人激动的一个变化。你会了解如何使用 lambda 表达式采用一种简洁的语法定义代码块， 以及如何编写处理 lambda 表达式的代码。

## 1. 为什么引入 lambda 表达式

到目前为止，在 Java 中传递一个代码段并不容易， 不能直接传递代码段。Java 是一种面向对象语言，所以必须构造一个对象，这个对象的类需要有一个方法能包含所需的代码。

而 **lambda 表达式就是一个可传递的代码块， 可以在以后执行一次或多次**。

## 2. lambda 表达式的语法

考虑这个例子：

```java
class LengthComparator implements Comparator<String>{
	public int compare(String first, String second){
		return first.length() - second.length();
	}
}

String[] friends = { "Peter", "Paul", "Mary" };
Arrays.sort(friends, new LengthComparator());
```

我们传入代码来检查一个字符串是否比另一个字符串短。这里要计算： 

```java
first.length() - second.length()
```

 `first` 和 `second `是什么？ 它们都是字符串。Java 是一种强类型语言，所以我们还要指定它们的类型： 

```java
(String first, String second) 
	-> first.length() - second.length()
```

这就是你看到的第一个 lambda 表达式。**lambda 表达式就是一个代码块， 以及必须传入代码的变量规范**。

> 📜 为什么起这个名字呢？ 很多年前，那时还没有计算机，逻辑学家 Alonzo Church 想要形式化地表示能有效计算的数学函数。（奇怪的是， 有些函数已经知道是存在的，但是没有人知道该如何计算这些函数的值） 他使用了希腊字母 lambda ( λ ) 来标记参数。
>
> ![](https://gitee.com/veal98/images/raw/master/img/20200620164816.png)

你已经见过 Java 中的一种 lambda 表达式形式：**参数， 箭头（->) 以及一个表达式。如果代码要完成的计算无法放在一个表达式中，就可以像写方法一样，把这些代码放在 `{ }`中， 并包含显式的 `return`语句。**例如：

```java
(String first, String second) ->{
    if(first.length() < second.length())
        return -1;
    else if(first.length() > second.length())
        return 1;
    else
        return 0;
}
```

⭐ **即使 lambda 表达式没有参数， 仍然要提供空括号**，就像无参数方法一样：

```java
() -> { 
	for (int i = 100; i >= 0; i++) 
        System.out.println(i); 
}
```

⭐ **如果可以推导出一个 lambda 表达式的参数类型，则可以忽略其类型**。例如：

```java
Comparator<String> comp = (first,second) ->{
    first.length() - second.length();
}
```

在这里， 编译器可以推导出 first 和 second 必然是字符串，因为这个 lambda 表达式将赋给一个字符串比较器。（下一节会更详细地分析这个赋值） 

**如果方法只有一个参数， 而且这个参数的类型可以推导得出，那么甚至还可以省略小括号：**

```java
ActionListener listener = event ->
	System.out.println("The time is " + new Date());
```

⭐ **无需指定 lambda 表达式的返回类型。lambda 表达式的返回类型总是会由上下文推导得出**。例如，下面的表达式：

```java
(String first, String second) 
	-> first.length() - second.length()
```

 可以在需要 `int` 类型结果的上下文中使用。

> 📜 **如果一个 lambda 表达式只在某些分支返回一个值， 而在另外一些分支不返回值， 这是不合法的**。例如：
>
> ```java
> (int x)-> { 
>  if(x >= 0) 
>      return 1; 
> } 
> ```
>
> 就不合法。

## 3. 函数式接口

**对于只有一个抽象方法的接口**， 需要这种接口的对象时， **就可以提供一个 lambda 表达式**。这种接口称为**函数式接口 （ functional interface )**。例如：

```java
// 函数式接口
class LengthComparator implements Comparator<String>{
	public int compare(String first, String second){
		return first.length() - second.length();
	}
}

String[] friends = { "Peter", "Paul", "Mary" };
Arrays.sort(friends, new LengthComparator());
```

lambda 表达式：

```java
String[] friends = { "Peter", "Paul", "Mary" };
Arrays.sort(friends, (String first, String second) -> {
	first.length() - second.length();
});
```

## 4. 方法引用

有时， 可能已经有现成的方法可以完成你想要传递到其他代码的某个动作。

例如， 假设你希望只要出现一个定时器事件就打印这个事件对象。 当然，为此也可以调用:

```java
Timer t = new Timer(1000, event -> System.out.println(event));
```

但是，如果直接把 `println `方法传递到 `Timer `构造器就更好了。具体做法如下：

```java
Timer t = new Timer(1000, System.out::println);
```

**`System.out::println` 是一个方法引用（ method reference ), 它等价于 lambda 表达式 `x -> System.out.println(x)`** 

再来看一个例子， 假设你想对字符串排序， 而不考虑字母的大小写。可以传递以下方法表达式： 

```java
Arrays.sort(strings, String::compareToIgnoreCase)
```

从这些例子可以看出， 要用：: 操作符分隔方法名与对象或类名。主要有 3 种情况：

- `object::instanceMethod`
- `Class::staticMethod`
- `Class/.instanceMethod`

在前 2 种情况中，方法引用等价于提供方法参数的 lambda 表达式。前面已经提到，`System.out::println` 等价于 `x -> System.out.println(x)` 。类似地，`Math::pow` 等价于`（x，y) -> Math.pow(x, y)`。

对于第 3 种情况， 第 1 个参数会成为方法的目标。例如, `String::compareToIgnoreCase` 等同于` (x, y) -> x.compareToIgnoreCase(y)` 

## 5. 构造器引用

构造器引用与方法引用很类似，只不过方法名为 `new`。例如，`Person::new` 是 `Person `构造器的一个引用。哪一个构造器呢？ 这取决于上下文。

```java
ArratList<String> names = .....;
Stream<Person> stream = names.stream().map(Person::new);
```

可以用数组类型建立构造器引用。例如， `int[]::new` 是一个构造器引用，它有一个参数： 即数组的长度。这等价于 lambda 表达式 `x -> new int[x];`

## 6. 变量作用域

通常， **你可能希望能够在 lambda 表达式中访问外围方法或类中的变量**。考虑下面这个例子：

```java
public static void repeatMessage(String text, int delay){
    ActionListener listener = event ->{
        System.out.println(text);
        Toolkit.getDefaultToolkit().beep();
    };
    new Timer(delay, listener).start();
}

repeatMessage("Hello", 1000); // Prints Hello every 1,000 milliseconds
```

现在来看 lambda 表达式中的变量 `text`。注意这个变量并不是在这个 lambda 表达式中定义的。实际上，这是 `repeatMessage `方法的一个参数变量。 

如果再想想看， 这里好像会有问题。lambda 表达式的代码可能会在 `repeatMessage `调用返回很久以后才运行，而那时这个参数变量已经不存在了。 ❓ 如何保留 `text `变量呢？ 

要了解到底会发生什么，下面来巩固我们对 lambda 表达式的理解。⭐ **lambda 表达式有 3 个部分**： 

- 1 ) 一个代码块； 
- 2 ) 参数; 
- 3 ) 自由变量的值， 这是指非参数而且不在代码中定义的变量。

在我们的例子中， 这个 lambda 表达式有 1 个自由变量 `text`。表示 lambda 表达式的数据结构必须存储自由变量的值，在这里就是字符串 `"Hello"`。我们说它**被 lambda 表达式捕获 captured**

> 📜 关于代码块以及自由变量值有一个术语： **闭包 closure**

可以看到，lambda 表达式可以捕获外围作用域中变量的值。 在 Java 中，**要确保所捕获的值是明确定义的**，这里有一个重要的限制。在 lambda 表达式中， **只能引用值不会改变的变量**。例如， 下面的做法是不合法的：

```java
public static void countDown(int start, int delay){
    ActionListener listener = event ->{
        start-- ; // Error: Can't mutate captured variable
        System.out.println(start);
    };
    new Timer(delay, listener).start();
}
```

之所以有这个限制是有原因的。如果在 lambda 表达式中改变变量， 并发执行多个动作时就会不安全。

另外**如果在 lambda 表达式中引用变量， 而这个变量可能在外部改变，这也是不合法的**。 例如，下面就是不合法的：

```java
public static void repeat(String text, int count){
    for (int i = 1; i <= count; i++){
        ActionListener listener = event ->{
            System.out.println(i + ": " + text);
            // Error: Cannot refer to changing i
        };
        new Timer(1000, listener).start();
    }
}
```

这里有一条规则：**lambda 表达式中捕获的变量必须实际上是最终变量 ( effectively final)** 。实际上的最终变量是指， **这个变量初始化之后就不会再为它赋新值**。在这里，text 总是指同一个 String 对象，所以捕获这个变量是合法的。不过，i  的值会改变，因此不能捕获。

lambda 表达式的体与嵌套块有相同的作用域。这里同样适用命名冲突和遮蔽的有关规则。**在 lambda 表达式中声明与一个局部变量同名的参数或局部变量是不合法的**。

```java
Path first = Paths.get("usr/bin");
Comparator<String> comp = (first, second) -> first.length() - second.length();
// Error: Variable first already defined
```

**在一个 lambda 表达式中使用 `this `关键字时， 是指创建这个 lambda 表达式的方法的 `this `参数**。 例如，考虑下面的代码：

```java
public class Application(){
    public void init(){
        ActionListener listener = evenet ->{
            System.out.println(this.toString());
        }
    }
}
```

**表达式 `this.toString()` 会调用 `Application `对象的 `toString`方法， 而不是 `ActionListener `实 例的方法**。在 lambda 表达式中， `this` 的使用并没有任何特殊之处。lambda 表达式的作用域嵌套在 `init `方法中，与出现在这个方法中的其他位置一样， lambda 表达式中 `this `的含义并没有 变化。

## 7. 处理 lambda 表达式

到目前为止， 我们已经了解了如何生成 lambda 表达式， 以及如何把 lambda 表达式传递到需要一个函数式接口的方法。下面来看如何编写方法处理 lambda 表达式。

**使用 lambda 表达式的重点是延迟执行 deferred execution 。** 毕竟， 如果想立即执行代码，完全可以直接执行， 而无需把它包装在一个 lambda 表达式中。之所以希望以后再执行代码， 这有很多原因， 如： 

- 在一个单独的线程中运行代码； 
- 多次运行代码； 
- 在算法的适当位置运行代码（例如， 排序中的比较操作) ；
- 发生某种情况时执行代码（如， 点击了一个按钮， 数据到达， 等等) ；
- 只在必要时才运行代码。

下面来看一个简单的例子。假设你想要重复一个动作 n 次。 将这个动作和重复次数传递到一个 `repeat `方法： 

```java
repeat(10, 0 -> System.out.println("Hello, World!"));
```

要接受这个 lambda 表达式， 需要选择（偶尔可能需要提供）一个函数式接口。 表 6-1 列出了 Java API 中提供的最重要的函数式接口。在这里， 我们可以使用 `Runnable `接口：

```java
public static void repeat(int n, Runnable action){
	for (int i = 0; i < n; i++) 
		action.run();
}
```

需要说明，调用 `action.run()` 时会执行这个 lambda 表达式的主体。

![](https://gitee.com/veal98/images/raw/master/img/20200620195206.png)

现在让这个例子更复杂一些。我们希望告诉这个动作它出现在哪一次迭代中。 为此，需要选择一个合适的函数式接口，其中要包含一个方法， 这个方法有一个 `int `参数而且返回类型为 `void`。处理 `int ` 值的标准接口如下：

```java
public interface IntConsumer{
    void accept(int value);
}
```

下面给出 `repeat `方法的改进版本：

```java
public statci void repeat(int n, IntConsumer action){
	for(int i = 0; i < n; i++)
		action.accept(i);
}
```

可以如下调用它：

```java
repeat(10,i -> System.out.println("Countdown:" + (9-i)));
```

表 6-2 列出了基本类型 `int`、 `long `和 `double `的 34 个可能的规范。 **最好使用这些特殊化规范来减少自动装箱。出于这个原因， 上面的例子中使用了 `IntConsumer `而不是 `Consumer<Integer>`** 。

![](https://gitee.com/veal98/images/raw/master/img/20200620200016.png)

## 📚 References

- 《Java 核心技术 - 卷 1 基础知识 - 第 10 版》
- 《Thinking In Java（Java 编程思想）- 第 4 版》