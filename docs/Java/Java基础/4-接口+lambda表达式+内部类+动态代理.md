# 4 - 接口、lambda 表达式、内部类、动态代理

---

## 1. 接口 interface

### ① 接口概念

**在 Java 程序设计语言中， 接口不是类，而是对类的一组需求描述，这些类要遵从接口描 述的统一格式进行定义。**

下面给出一个具体的示例。Arrays 类中的 sort 方法可以对对象数组进行排序，但要求满足下列前提：对象所属的类必须实现了 `Comparable` 接口。 下面是 Comparable 接口的代码：

```java
public interface Comparable{
	int compareTo(Object other);
}
```

这就是说，任何实现 `Comparable` 接口的类都需要包含 `compareTo` 方法，并且这个方法的参数必须是一个 `Object` 对象，返回一个整型数值。

> 📜 **在 JavaSE 5.0 中，`Comparable` 接口已经改进为泛型类型**。 
>
> ```java
> public interface Comparable { 
> 	int compareTo(T other) ; // parameter has type T 
> } 
> ```

**接口中的所有方法自动地属于 `public`。 因此，在接口中声明方法时，不必提供关键字 `public`**

现在， 假设希望使用 `Arrays` 类的 `sort `方法对` Employee` 对象数组进行排序， `Employee` 类就必须实现 `Comparable` 接口。 为了让类实现一个接口， 通常需要下面两个步骤： 

- 1 ) 将类声明为实现给定的接口。 

- 2 ) 对接口中的所有方法进行定义。 

要将类声明为实现某个接口， 需要使用关键字 `implements`:

```java
class Employee implements Comparable{
	...
    public int compareTo(Object otherObject){
        Employee other = (Employee) otherObject;
        return Double.compare(salary,other.salary);
    }
    ...
}
```

💡 在这里，我们使用了静态 `Double.compare` 方法，如果第一个参数小于第二个参数， 它会返回 一个负值；如果二者相等则返回 0; 否则返回一个正值。

> 🚨 在接口声明中，没有将 `compareTo` 方法声明为 `public`, 这是因为在接口中的所有方法都自动地是 `public`。不过，在实现接口时， 必须把方法声明为 `public`; 否则， 编译器将认为这个方法的访问属性是包可见性， 即类的默认访问属性，之后编译器就会给出试图提供更严格的访问权限的警告信息。

我们可以做得更好一些。可以为泛型 `Comparable` 接口提供一个类型参数。

```java
class Employee implements Comparable<Employee>{
	...
    public int compareTo(Employee otherObject){
        Employee other = (Employee) otherObject;
        return Double.compare(salary,other.salary);
    }
    ...
}
```

> 🚩 `Comparable` 接口中的 `compareTo` 方法将返回一个整型数值。如果两个对象不相等， 则返回一个正值或者一个负值。在对两个整数域进行比较时，这点非常有用。

现在， 我们已经看到，要让一个类使用排序服务必须让它实现 `compareTo` 方法。这是理所当然的， 因为要向 `sort` 方法提供对象的比较方式。❓ 但是为什么不能在 `Employee` 类直接提 供一个 `compareTo `方法，而必须实现 `Comparable `接口呢？

主要原因在于 Java 程序设计语言是一种强类型 （ strongly typed ) 语言。在调用方法的时候， 编译器将会检查这个方法是否存在。在 `sort `方法中可能存在下面这样的语句：

```java
if(a[i].compareTo(a[j]) > 0){
	...
}
```

为此， 编译器必须确认 `a[i]` —定有 `compareTo `方法。如果 a 是一个 `Comparable `对象的数组， 就可 以确保拥有 `compareTo `方法，因为每个实现 `Comparable `接口的类都必须提供这个方法的定义。

部分 API 如下：

![](https://gitee.com/veal98/images/raw/master/img/20200620152808.png)

### ② 接口的特性

接口不是类，尤其**不能使用 `new` 运算符实例化一个接口**：

```java
x = new Comparable(. . .); // ERROR
```

然而， 尽管不能构造接口的对象，却能声明接口的变量：

```java
Comparable x; // OK
```

 接口变量必须引用实现了接口的类对象： 

```java
x = new Employee(. . .); // OK provided Employee implements Comparable
```

接下来， 如同使用 `instanceof`检查一个对象是否属于某个特定类一样， 也可以使用 `instanceof `检查一个对象是否实现了某个特定的接口：

```java
if(x instanceof Comparable){
	...
}
```

与可以建立类的继承关系一样，**接口也可以被扩展**：

```java
public interface Moveable{
	void move(double x, double y);
}

public interface Powerd extends Moveable{
	double milesPerGallon();
}
```

虽然在**接口中不能包含实例域或静态方法，但却可以包含常量**。例如：

```java
public interface Powered extends Moveable{
	double milesPerGallon();
	double SPEED_LIMIT = 95; // a public static final constant
}
```

与接口中的方法都自动地被设置为 `public `—样，**接口中的域将被自动设为 `public static final`**

> 📜 可以将接口方法标记为 `public`, 将域标记为 `public static final`。有些程序员出于习惯或提高清晰度的考虑， 愿意这样做。但 Java 语言规范却建议不要书写这些多余的关键字

尽管**每个类只能够拥有一个超类， 但却可以实现多个接口**。这就为定义类的行为提供了极大的灵活性。

### ③ 接口与抽象类

❓ 既然有了抽象类，为什么 Java 程序设计语言还要不辞辛苦地引入接口概念？ 为什么不将 `Comparable` 直接设计成如下所示的抽象类。

```java
abstract class Comparable {
	public abstract int compareTo(Object other);
}
```

然后，`Employee `类再直接扩展这个抽象类， 并提供 `compareTo `方法的实现：

```java
class Employee extends Comparable{ 
	public int compareTo(Object other) { 
        . . . 
    } 
}
```

非常遗憾，使用抽象类表示通用属性存在这样一个问题： 每个类只能扩展于一个类。假设 `Employee` 类已经扩展于一个类， 例如 `Person`, 它就不能再像下面这样扩展第二个类了： 

```java
class Employee extends Person, Comparable // Error 
```

但每个类可以像下面这样实现多个接口： 

```java
class Employee extends Person implements Comparable // OK
```

有些程序设计语言允许一个类有多个超类， 例如 C++。我们将此特性称为<u>多重继承 ( multiple inheritance)</u> 。而 **Java 的设计者选择了不支持多继承，其主要原因是多继承会让语言本身变得非常复杂**（如同 C++) ，效率也会降低。实际上，接口可以提供多重继承的大多数好处，同时还能避免多重继承的复杂性和低效性。

### ④ 静态方法

**在 Java SE 8 中，允许在接口中增加静态方法**。<u>理论上讲，没有任何理由认为这是不合法的。只是这有违于将接口作为抽象规范的初衷。</u>

下面来看 Paths 类， 其中只包含两个工厂方法。可以由一个字符串序列构造一个文件或 目录的路径， 如 `Paths.get`("jdk1.8.0", "jre", "bin") 。在 Java SE 8 中， 可以为 `Path ` 接口增加以下方法：

```java
public interface Path{
    public static Path get(String first, String... more){
    	return FileSystems.getDefault().getPath(first, more); 
    }
}
```

这样一来， `Paths` 类就不再是必要的了。

### ⑤ 默认方法 default

**可以为接口方法提供一个默认实现**。 必须用 `default` 修饰符标记这样一个方法。

```java
public interface Comparable<T>{
    default int compareTo(T other) { 
        return 0; 
    } 
} 
```

### ⑥ 解决默认方法冲突

如果先在一个接口中将一个方法定义为默认方法， 然后又在超类或另一个接口中定义了同样的方法， 会发生什么情况？Java 规则如下：

- 1 ) ⭐ **超类优先**。如果超类提供了一个具体方法，同名而且有相同参数类型的默认方法会被忽略。 

- 2 ) **接口冲突**。 如果一个超接口提供了一个默认方法，另一个接口提供了一个同名而且参数类型（不论是否是默认参数）相同的方法， 必须覆盖这个方法来解决冲突。

  例如：

  ```java
  interface Named{
  	default String getName(){
  		return getClass().getName() + "_" + hashCode();
  	}
  }
  
  interface Person{
  	default String getName(){
  		return getClass().getName();
  	}
  }
  
  // 需要在 Student 类中提供一个 getName 方法。在这个方法中，可以选择两个冲突方法中的一个
  class Stduent implements Person, Named{
      public String getName(){
          return Person.super.getName();
      }
  }
  ```

  现在假设 `Named `接口没有为 `getName `提供默认实现：

  ```java
  interface Named{
  	String getName();
  }
  ```

  ❓ Student 类会从 Person 接口继承默认方法吗？ 这好像挺有道理， 不过，Java 设计者更强调一致性。两个接口如何冲突并不重要。**如果至少有一个接口提供了一个实现，编译器就会报告错误， 而程序员就必须解决这个二义性。**

  > 📜 当然，**如果两个接口都没有为共享方法提供默认实现， 那么就与 Java SE 8 之前的 情况一样，这里不存在冲突**。 实现类可以有两个选择：实现这个方法，或者干脆不实现。 如果是后一种情况，这个类本身就是抽象的。

### ⑦ Comparator 接口

我们已经了解了如何对一个对象数组排序，前提是这些对象是实现了 `Comparable `接口的类的实例, 例如， 可以对一个字符串数组排序， 因为 `String `类实现了 `Comparable`, 而 且 `String.compareTo` 方法可以按字典顺序比较字符串。

现在假设我们希望按长度递增的顺序对字符串进行排序，而不是按字典顺序进行排序。 肯定不能让 `String` 类用两种不同的方式实现 `compareTo `方法 —— 更何况，`String `类也不应由 我们来修改。 

要处理这种情况，`Arrays.sort` 方法还有第二个版本， 有一个数组和一个**比较器 ( comparator )**作为参数， **比较器是实现了 `Comparator `接口的类的实例**。

```java
public interface Compare<T>{
	int compare(T first, T second);
}
```

要按长度比较字符串，可以如下定义一个实现 `Comparator<String>`的类： 

```java
class LengthComparator implements Comparator<String>{
	public int compare(String first, String second){
		return first.length() - second.length();
	}
}
```

具体完成比较时，需要建立一个实例：

```java
Comparator<String> comp = new LengthComparator();
if(comp.compare(words[i],words[j]) > 0){
    ...
}
```

将这个调用与 `words[i].compareTo(words[j])` 做比较。这个 `compare` 方法要在比较器对象上调用，而不是在字符串本身上调用。

> 📜 尽管 `LengthComparator `对象没有状态， 不过还是需要建立这个对象的一个实例。 我们需要这个实例来调用 `compare `方法 它不是一个静态方法。

⭐ 要对一个数组排序， 需要为` Arrays.sort` 方法传入一个 `LengthComparator `对象：

```java
String[] friends = { "Peter", "Paul", "Mary" };
Arrays.sort(friends, new LengthComparator());
```

在下一节中我们会了解， 利用 lambda 表达式可以更容易地使用 `Comparator`。

## 2. lambda 表达式

现在可以来学习 lambda 表达式， 这是这些年来 Java 语言最让人激动的一个变化。你会了解如何使用 lambda 表达式采用一种简洁的语法定义代码块， 以及如何编写处理 lambda 表达式的代码。

### ① 为什么引入 lambda 表达式

到目前为止，在 Java 中传递一个代码段并不容易， 不能直接传递代码段。Java 是一种面向对象语言，所以必须构造一个对象，这个对象的类需要有一个方法能包含所需的代码。

而 **lambda 表达式就是一个可传递的代码块， 可以在以后执行一次或多次**。

### ② lambda 表达式的语法

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
>     if(x >= 0) 
>         return 1; 
> } 
> ```
>
> 就不合法。

### ③ 函数式接口

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

### ④ 方法引用

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

### ⑤ 构造器引用

构造器引用与方法引用很类似，只不过方法名为 `new`。例如，`Person::new` 是 `Person `构造器的一个引用。哪一个构造器呢？ 这取决于上下文。

```java
ArratList<String> names = .....;
Stream<Person> stream = names.stream().map(Person::new);
```

可以用数组类型建立构造器引用。例如， `int[]::new` 是一个构造器引用，它有一个参数： 即数组的长度。这等价于 lambda 表达式 `x -> new int[x];`

### ⑥ 变量作用域

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

### ⑦ 处理 lambda 表达式

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

### ⑧ 再谈 Comparator

`Comparator `接口包含很多方便的静态方法来创建比较器。 这些方法可以用于 lambda 表达式或方法引用。 

**静态 `comparing `方法取一个“ 键提取器” 函数， 它将类型 T 映射为一个可比较的类型 ( 如 String )。对要比较的对象应用这个函数， 然后对返回的键完成比较**。例如，假设有一个 `Person `对象数组，可以如下按名字对这些对象排序： 

```java
Arrays.sort(people, Comparator.comparing(Person::getName));
```

可以把比较器与 `thenComparing `方法串起来。例如：

```java
Arrays.sort(people,
Comparator.comparing(Person::getLastName)
.thenComparing(Person::getFirstName));
```

如果两个人的 LastName 相同， 就会使用第二个比较器。

## 3. 内部类

内部类（inner class) 是定义在另一个类中的类。为什么需要使用内部类呢？ 其主要原因有以下三点： 

- 内部类方法可以访问该类定义所在的作用域中的数据， 包括私有的数据。 
- 内部类可以对同一个包中的其他类隐藏起来。 
- **当想要定义一个回调函数且不想编写大量代码时，使用匿名 （anonymous) 内部类比较便捷**。

### ① 使用内部类访问对象状态

```java
public class TalkingClock{
    private int interval:
    private boolean beep;
    
    public TalkingClock(int interval, boolean beep) {}
    public void start(){}
    
    // inner class
    public class TimePrinter implements ActionListener{ 
        public void actionPerformed(ActionEvent event){
			System.out.println("At the tone, the time is " + new Date);
			if (beep) 
                Toolkit.getDefaultToolkit().beep();
		}
    }
}
```

`TimePrinter `类没有实例域或者名为 `beep `的变量，取而代之的是 `beep `引用了创建 `TimePrinter `的 `TalkingClock `对象的域。 这是一种创新的想法。从传统意义上讲，一个方法可以引用调用这个方法的对象数据域。**内部类既可以访问自身的数据域，也可以访问创建它的外围类对象的数据域。**

**内部类的对象总有一个隐式引用， 它指向了创建它的外部类对象**。

![](https://gitee.com/veal98/images/raw/master/img/20200620201802.png)

> 📜 如果 `TimePrinter`  类声明为 `private`。这样一来， 只有 `TalkingClock `的方法才能够构造 `TimePrinter `对象。只有内部类可以是私有类，而常规类只可以具有包可见性，或公有可见性。

### ② 内部类的特殊语法规则

可以使用 `OuterClass.this` 更清晰的表示外围类的引用，例如：

```java
public class TalkingClock{
    ...
    private boolean beep;
    ...
    public class TimePrinter implements ActionListener{ 
        public void actionPerformed(ActionEvent event){
            System.out.println("At the tone, the time is " + new Date);
            if (TalkingClock.this.beep) 
                Toolkit.getDefaultToolkit().beep();
        }
    }
}
```

使用 `OuterObject.new InnerClass(construction parameters)` 更清晰的编写内部对象的构造函数，例如：

```java
TalkingClock jabberer = new TalkingClock(1000,true);
TalkingClock.TimePrinter listener = jabberer.new TimePrinter();

// 等同于 ActionListener listener = new TimePrinter();
```

在外围类的作用域之外，可以这样引用内部类： `OuterClass.InnerClass`

> 📜 **内部类中声明的所有静态域都必须是 `final`**。原因很简单。我们希望一个静态域只有一个实例， 不过对于每个外部对象， 会分别有一个单独的内部类实例。如果这个域不是 `final `, 它可能就不是唯一的。 
>
> **内部类不能有 `static `方法**。Java 语言规范对这个限制没有做任何解释。也可以允许有静态方法，但只能访问外围类的静态域和方法。显然，Java 设计者认为相对于这种复杂性来说， 它带来的好处有些得不偿失。

### ③ 局部内部类

示例代码如下：`TimePrinter` 这个类只能在 start 方法中使用

```java
public class TalkingClock{
    private int interval:
    private boolean beep;
    
    public TalkingClock(int interval, boolean beep) {}
    
    public void start(){
        class TimePrinter implements ActionListener{
            public void actionPerformed(ActionEvent event){
                System.out.println("At the tone, the time is " + new Date);
                if (beep) 
                    Toolkit.getDefaultToolkit().beep();
            }
        }

        ActionListener listener = new TimePrinter();
        Timer t = new Timer(interval, listener);
        t.start();
    }
}
```

**局部类不能用 `public `或 `private `访问说明符进行声明。它的作用域被限定在声明这个局部类的块中。** 

局部类有一个优势， 即对外部世界可以完全地隐藏起来。 即使 `TalkingClock `类中的其他 代码也不能访问它。除 `start `方法之外， 没有任何方法知道 `TimePrinter `类的存在。

### ④ 由外部方法访问变量

与其他内部类相比较，局部类还有一个优点。**它们不仅能够访问包含它们的外部类， 还可以访问局部变量。不过，那些局部变量必须事实上为 `final`**。这说明， 它们一旦赋值就绝不会改变。

下面是一个典型的示例。这里， 将 `TalkingClock `构造器的参数 `interval `和 `beep `移至 `start `方法中：

```java
public class TalkingClock{
    private int interval:
    private final boolean beep;
    
    public TalkingClock(int interval, boolean beep) {}
    
    public void start(int interval, boolean beep){
        class TimePrinter implements ActionListener{
            public void actionPerformed(ActionEvent event){
                System.out.println("At the tone, the time is " + new Date);
                if (beep) 
                    Toolkit.getDefaultToolkit().beep();
            }
        }

        ActionListener listener = new TimePrinter();
        Timer t = new Timer(interval, listener);
        t.start();
    }
}
```

`TalkingClock `类不再需要存储实例变量 `beep `了，它只是引用 `start `方法中的 `beep `参数变量。

> 📜 **在 JavaSE 8 之前**， 必须把从局部类访问的局部变量声明为 `final`。 例如， `start `方法原本就应当这样声明 ，从而使内部类能够访问 beep 参数：
>
> ```java
> public void start(int interval, final boolean beep)
> ```

💡 有时，`final `限制显得并不太方便。例如，假设想更新在一个封闭作用域内的计数器。这里想要统计一下在排序过程中调用 `compareTo `方法的次数。

```java
int counter = 0;
Date[] dates = new Date[100];
for(int i = 0; i < dates.length; i++){
    datesp[i] = new Date(){
        public int compareTo(Date other){
            counter ++; // Error
            return super.compareTo(other);
        }
    };
}
Arrays.sort(dates);
System.out.println(counter + " comparisons.")
```

由于 `counter `需要更新， 所以不能将 `counter `声明为 `final`。  `Integer `对象是不可变的， 所以也不能用 `Integer `代替它。**补救的方法是使用一个长度为 1 的数组**：

```java
int[] counter = new int[1];
Date[] dates = new Date[100];
for(int i = 0; i < dates.length; i++){
    datesp[i] = new Date(){
        public int compareTo(Date other){
            counter[0] ++; 
            return super.compareTo(other);
        }
    };
}
Arrays.sort(dates);
System.out.println(counter + " comparisons.")
```



### ⑤ 匿名内部类

将局部内部类的使用再深人一步。 **假如只创建这个类的一个对象，就不必命名了。这种类被称为匿名内部类（anonymous inner class)**。

```java
public void start(int interval, boolean beep){
    ActionListener listener = new ActionListener{
        public void actionPerformed(ActionEvent event){
            System.out.println("At the tone, the time is " + new Date);
            if (beep) 
                Toolkit.getDefaultToolkit().beep();
        }
    };
    Timer t = new Timer(interval, listener);
    t.start();
}
```

它的含义是：创建一个实现 `ActionListener `接口的类的新对象，需要实现的方法 `actionPerformed `定义在括号内。

由于构造器的名字必须与类名相同， 而匿名类没有类名，所以，**匿名类不能有构造器**。 取而代之的是，**将构造器参数传递给超类（superclass) 构造器**。尤其是在内**部类实现接口的时候， 不能有任何构造参数。不仅如此，还要像下面这样提供一组括号**：

![](https://gitee.com/veal98/images/raw/master/img/20200620205642.png)

> 📜 多年来，Java 程序员习惯的做法是用匿名内部类实现事件监听器和其他回调。👍 如今**最好还是使用 lambda 表达式**。例如， 上面给出的 `start `方法用 lambda 表达式来写会简洁得多， 如下所示：
>
> ```java
> public void start(int interval, boolean beep){
>     Timer t = new Timer(interval, event ->{
>         System.out.println("At the tone, the time is " + new Date);
>         if (beep) 
>             Toolkit.getDefaultToolkit().beep();
>     });
>     t.start();
> }
> ```

### ⑥ 静态内部类

有时候， 使用内部类只是为了把一个类隐藏在另外一个类的内部，并不需要内部类引用外围类对象。为此，可以将内部类声明为 `static`, 以便取消产生的引用。

💬 下面是一个使用静态内部类的典型例子。考虑一下计算数组中最小值和最大值的问题。 当然， 可以编写两个方法， 一个方法用于计算最小值，另一个方法用于计算最大值。**在调用这两个方法的时候，数组被遍历两次。如果只遍历数组一次， 并能够同时计算出最小值和最大值，那么就可以大大地提高效率了。**

```java
double min = Double.POSITIVE_INFINITY;
double max = Double.NEGATIVE_INFINITY;
for(double v : values){
	if(min > v) min = v;
	if(max < v) max = v;
}
```

然而， 这个方法必须返冋两个数值， 为此， **可以定义一个包含两个值的类 Pair**:

```java
class Pair{
    private double first;
    private double second;
	public Pair(double f, double s){
        first = f;
       	second = s;
    }
    public double getFirtst(){
        return first;
    }
    public double getSecond(){
        return second;
    }
}
```

`minmax `方法可以返回一个 Pair 类型的对象。

```java
class ArrayAlg{
    public static Pair minmax(double[] values){
        ...
    	return new Pair(min, max);
    }
}
```

这个方法的调用者可以使用 `getFirst `和 `getSecond `方法获得答案： 

```java
Pair p = ArrayAlg.minmax(d); 
System.out.println("min = " + p.getFirst()); 
System.out.println("max = " + p.getSecond());
```

当然， `Pair` 是一个十分大众化的名字。在大型项目中， 除了定义包含一对字符串的 `Pair `类之外， 其他程序员也很可能使用这个名字。这样就会产生名字冲突。解决这个问题的办法 是将 `Pair `定义为 `ArrayAlg `的内部公有类。此后， 通过 `ArrayAlg.Pair` 访问它：

```java
ArrayAlg.Pair p = ArrayAlg.minmax(d);
```

不过，与前面例子中所使用的内部类不同， 在 `Pair `对象中不需要引用任何其他的对象， 为此，可以将这个内部类声明为 `static`:

```java
class ArrayAlg{
	class static Pair{
        private double first;
        private double second;
        public Pair(double f, double s){
            first = f;
            second = s;
        }
        public double getFirtst(){
            return first;
        }
        public double getSecond(){
            return second;
        }
	}
    public static Pair minmax(double[] values){
        ...
    	return new Pair(min, max); 
    }
}
```

当然， 只有内部类可以声明为 `static`。静态内部类的对象除了没有对生成它的外围类对象的引用特权外， 与其他所有内部类完全一样。**在我们列举的示例中， 必须使用静态内部类， 这是由于内部类对象是在静态方法中构造的**： 

```java
public static Pair minmax(double[] values){
    ...
    return new Pair(min, max); 
}
```

 如果没有将 `Pair `类声明为 `static`, 那么编译器将会给出错误报告： <u>没有可用的隐式 `ArrayAlg ` 类型对象初始化内部类对象。</u>

## 4. 代理

**利用代理可以在运行时创建一个实现了一组给定接口的新类。这种功能只有在编译时无法确定需要实现哪个接口时才有必要使用。**

当想要给实现了某个接口的类中的方法，加一些额外的处理。比如说加日志，加事务等。

可以给这个类创建一个代理，**故名思议就是创建一个新的类，这个类不仅包含原来类方法的功能，而且还在原来的基础上添加了额外处理的新类**。这个代理类并不是定义好的，是动态生成的。具有解耦意义，灵活，扩展性强。可以在运行期动态创建某个interface的实例。

**动态代理的应用：**

- Spring的AOP
- 加事务
- 加权限
- 加日志

### ① 何时使用代理

❓ **假设有一个表示接口的 Class 对象（有可能只包含一个接口) ，它的确切类型在编译时无法知道**。这确实有些难度。<u>要想构造一个实现这些接口的类，就需要使用 `newlnstance `方法或反射找出这个类的构造器。但是，不能实例化一个接口，需要在程序处于运行状态时定义一个新类。</u> 

为了解决这个问题， 有些程序将会生成代码；将这些代码放置在一个文件中；调用编译器；然后再加载结果类文件。很自然， 这样做的速度会比较慢，并且需要将编译器与程序放在一起。

而代理机制则是一种更好的解决方案。**代理类可以在运行时创建全新的类。这样的代理类能够实现指定的接口。尤其是，它具有下列方法**： 

- 指定接口所需要的全部方法。 

- Object 类中的全部方法， 例如， `toString`、 `equals `等。 

然而，**不能在运行时定义这些方法的新代码。而是要提供一个调用处理器（ invocation handler )。调用处理器是实现了 `InvocationHandler `接口的类对象**。在这个接口中只有一个方法： 

```java
Object invoke(Object proxy, Method method, Object[] args)
```

<u>无论何时调用代理对象的方法，调用处理器的 `invoke `方法都会被调用， 并向其传递 `Method `对象和原始的调用参数。 调用处理器必须给出处理调用的方式。</u>

### ② 创建代理对象

要想创建一个代理对象， 需要使用 `Proxy `类的 `newProxylnstance `方法。 这个方法有三个参数： 

- 一个类加载器（class loader) 。作为 Java 安全模型的一部分， 对于系统类和从因特网上下载下来的类，可以使用不同的类加载器。用 `null `表示使用默认的类加载器。 
- 一个 Class 对象数组， 每个元素都是需要实现的接口。 
- 一个调用处理器。

```java
class TraceHandler implements IncovationHandler{
    private Object target;
    
    public TraceHandler(Object t){
        target = t;
    }
    
    public Object invoke(Object proxy, Method m, Object[] args) throws Throwable{
        return m.invoke(target, args);
    }
}
```

下面说明如何构造用于跟踪方法调用的代理对象。

```java
Object value = ...;
InvocationHandler handler = new TraceHandler(value);
Class[] interfaces = new Class[]{Comparable.class};
Object proxy = Proxy.newProxyInstance(null,interfaces,handler);
```

### ③ 动态代理实例

```java
/**
 * 定义一个接口
 */
interface Hello{
    void morning(String name);
}

/**
 * 动态代理创建接口实例
 */
public class dynamic_proxy{
    public static void main(String[] args) {
        InvocationHandler handler = new InvocationHandler(){
        
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                System.out.println(method);
                if(method.getName().equals("morning")){
                    System.out.println("Good Morning," + args[0]);
                }
                return null;
            }
        };
        Hello hello = (Hello) Proxy.newProxyInstance(Hello.class.getClassLoader(), new Class[]{Hello.class}, handler);
        hello.morning("Jack");
        

    }
}
```

在运行期动态创建一个interface实例的方法如下：

- 首先必须定义一个接口 Hello（被代理）
- 定义一个 `InvocationHandler` 实例，它负责实现接口方法 morning 的调用；
- 通过 `Proxy.newProxyInstance()` 创建接口 Hello 实例的代理对象，它需要3个参数：
  - 使用的 `ClassLoader` 类加载器。通常就是接口类的 ClassLoader；(因为代理的是 Hello，所以用加载 Hello 的类加载器。)
  - 需要实现的接口数组，至少需要传入一个接口进去；
  - 用来处理接口方法调用的 InvocationHandler 实例。

- 将返回的 Object 强制转型为接口。



---

# 📚 References

- 《Java 核心技术 - 卷 1 基础知识 - 第 10 版》
- [java经验总结-208道面试题](https://www.zhihu.com/question/27858692/answer/787505434)