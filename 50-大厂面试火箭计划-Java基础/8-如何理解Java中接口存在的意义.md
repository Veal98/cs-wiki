# Java小白成长记 · 第 8 篇《如何理解 Java 中接口存在的意义》

---

## 0. 前言

在我自己早期学习编程的时候，对接口存在的意义实在困惑，我自己乱写代码的时候基本上不可能意识到需要去写接口，不知道接口到底有什么用，为什么要定义接口，感觉定义接口只是	提前做了个多余的工作。

这里我先抛出一个形象的解释，大家带着这个解释结合全文来理解接口存在的意义是什么：

我们把电脑主板上的内存插槽，显卡插槽等类比为接口，为什么在主板上搞这么多插槽呢？多浪费机箱空间啊？直接用电烙铁把显卡和内存的引脚一根一根焊到主板上不就得了（手动滑稽）。估计读到这里大伙儿心里也大概明白了接口的大致作用，焊死了后，如果你焊错位置了或者拆电脑的时候，就需要使用电烙铁进行拆装，多愚蠢哦。

全文脉络思维导图如下：

![](https://gitee.com/veal98/images/raw/master/img/20210218151735.png)

## 1. 什么是抽象类

在讲解接口之前，抽象类是绕不过去的一个概念，接口可以认为是一个比抽象类还要抽象的类。

什么是抽象类？**包含一个或多个抽象方法的类就是抽象类，抽象方法即没有方法体的方法**，抽象方法和抽象类都必须声明为 `abstract`。例如：

```java
// 抽象类
public abstract class Person {
    // 抽象方法
	public abstract String getDescription();
}
```

切记！**除了抽象方法之外，抽象类还可以包含具体数据和具体方法**。例如， 抽象类 `Person ` 还保存着姓名和一个返回姓名的具体方法：

```java
public abstract class Person{
    private String name;
    public Person(String name){
    	this.name = name ;
    }
    public abstract String getDescription();
    public String getName(){
    	return name;
    }
}
```

> 许多程序员都会**错误**的认为，在抽象类中不能包含具体方法。其实这也是接口和抽象类的不同之处，接口中是不能包含具体方法的。

**抽象类不能被实例化**。也就是说，如果将一个类声明为 `abstract`, 就不能创建这个类的对象。

```java
new Person("Jack"); // Error
```

可以定义一个抽象类的对象变量， 但是它只能引用非抽象子类的对象。 假设 `Student` 类是 `Person` 的非抽象子类：

```java
Person p = new Student("Jack"); // Right
```

所谓非抽象子类就是说，如果创建一个继承抽象类的子类并为之创建对象，那么就**必须为父类的所有抽象方法提供方法定义**。如果不这么做（可以选择不做），子类仍然是一个抽象类，编译器会强制我们为新类加上 `abstract` 关键字。

下面定义扩展抽象类 `Person ` 的具体子类 `Student`： 

```java
public class Student extends Person { 
    private String major; 
    public Student(String name, String major) { 
        super(name); 
        this.major = major; 
    } 
    @Override
    public String getDescription(){ // 实现父类抽象方法
    	return "a student majoring in " + major; 
    } 
} 
```

在 `Student ` 类中实现了父类中的抽象方法 `getDescription` 。因此，**在 `Student `类中的全部方法都是非抽象的， 这个类不再是抽象类**。

👇 调用如下：

```java
Person p = new Student("Jack","Computer Science");
p.getDescription();
```

<u>由于不能构造抽象类 `Person `的对象， 所以变量 `p` 永远不会引用 `Person` 对象， 而是引用诸如 `Student  `这样的具体子类对象， 而这些对象中都重写了 `getDescription `方法。</u>

## 2. 什么是接口

接口的本质其实也是一个类，而且是一个比抽象类还要抽象的类。怎么说呢？抽象类是能够包含具体方法的，而接口杜绝了这个可能性，**在 Java 8 之前，接口非常纯粹，只能包含抽象方法，也就是没有方法体的方法**。而 Java 8 中接口出现了些许的变化，开始允许接口包含默认方法和静态方法，这个下文会讲解。

Java 使用关键字 `interface` 而不是 `class` 来创建接口。和类一样，通常我们会在关键字 `interface` 前加上 `public` 关键字，否则接口只有包访问权限，只能在接口相同的包下才能使用它。

```java
public interface Concept {
    void idea1();
    void idea2();
}
```

同样的，接口中既然存在抽象方法，那么他就需要被扩展（继承）。使用 `implements` 关键字使一个类扩展某个特定接口（或一组接口），通俗来说：接口只是外形，现在这个扩展子类要说明它是如何工作的。

```java
class Implementation implements Concept {
    @Override
    public void idea1() {
        System.out.println("idea1");
    }
    
    @Override
    public void idea2() {
        System.out.println("idea2");
    }
}
```

这里需要注意的是，你可以选择显式地声明接口中的方法为 `public`，但是**即使你不这么做，它们也是 `public` 的**。所以当实现一个接口时，来自接口中的方法必须被定义为 `public`。否则，它们只有包访问权限，这样在被继承时，它们的可访问权限就被降低了，这是 Java 编译器所不允许的。

另外，接口中是允许出现常量的，与接口中的方法都自动地被设置为 `public `—样，**接口中的域将被自动被设置为 `public static final` 类型**，例如：

```java
public interface Concept {
	void idea1(); // public void idea1();
    // 静态属性
	double item = 95; // a public static final constant
}
```

> 可以将接口方法标记为 `public`，将域标记为 `public static final`。有些程序员出于习惯或提高清晰度的考虑， 愿意这样做。但 Java 语言规范却**建议不要书写这些多余的关键字**。

## 3. 接口的特性

接口和类其中不同的一点就是，我们**无法像类一样使用 `new` 运算符来实例化一个接口**：

```java
x = new Concept(. . .); // ERROR
```

原因也很简单，接口连具体的构造方法都没有，肯定是无法实例化的。

当然， 尽管不能构造接口的对象，声明接口的变量还是可以的：

```java
Concept x; // OK
```

 接口变量必须引用实现了接口的类对象： 

```java
x = new Implementation(. . .); // OK provided Implementation implements Concept
```

接下来， 如同使用 `instanceof` 检查一个对象是否属于某个特定类一样， 也可以使用 `instanceof `检查一个对象是否实现了某个特定的接口：

```java
if(x instanceof Concept){
	...
}
```

另外，与可以建立类的继承关系一样，**接口也可以被继承**：

```java
public interface Concept1 {
    void idea1();
    void idea2();
}

-------------------------------------------
    
public interface Concept2 extends Concept1{
	double idea3();
}
```

当然，读到这里大家可能依然无法理解，既然有了抽象类，为什么 Java 程序设计语言还要不辞辛苦地引入接口这个概念？

很重磅！因为**一个类可以实现多个接口，但是一个类只能继承一个父类**。正是接口的出现打破了 Java 这种单继承的局限，为定义类的行为提供了极大的灵活性。

```java
class Implementation implements Concept1, Concept2 // OK
```

有一条实际经验：在合理的范围内尽可能地抽象。显然，接口比抽象类还要抽象。因此，一般更倾向使用接口而不是抽象类。

## 4. Java 8 接口新特性

上文提过一嘴，**在 Java 8 中，允许在接口中增加静态方法和默认方法**。理论上讲，没有任何理由认为这是不合法的，只是这有违于将接口作为抽象规范的初衷。举个例子：

```java
public interface Concept {
    // 静态方法
	public static void get(String name){
    	System.out.println("hello " + name);
    }
    // 默认方法
    default void idea1(){
        System.out.println("this is idea1");
    };
}
```

用 `default` 修饰符标记的方法就是默认方法，这样子类就不需要去实现这个方法了。

不过，引入默认方法后，就出现了一个**默认方法冲突**的问题。如果先在一个接口 A 中将一个方法 `idea` 定义为默认方法， 然后又在另一个接口 B 或者超类 C 中定义了同样的方法  `idea`，然后类 D 实现了这两个接口 A 和 B（或超类 C）。于是类 D 中就有了方法 `idea` 的两个默认实现，出现了冲突，为此，Java 制定了一套规则来解决这个二义性问题：

1 )  **超类优先**。如果超类提供了一个具体方法，接口中的同名且有相同参数类型的默认方法会被忽略。 

2 )  **接口冲突**。 如果一个父类接口提供了一个默认方法，另一个父类接口也提供了一个同名而且参数类型相同的方法，子类必须覆盖这个方法来解决冲突。例如：

```java
interface A {
	default void idea(){
		System.out.println("this is A");
	}
}

interface B {
	default void idea(){
		System.out.println("this is B");
	}
}

// 需要在 D 类中覆盖 idea 方法
class D implements A, B{
    public void getName(){
    	System.out.println("this is D");
    }
}
```

现在假设 `B`接口没有为 `idea` 提供默认实现：

```java
interface B {
	void idea();
}
```

那么 D 类会直接从 A 接口继承默认方法吗？ 这好像挺有道理， 不过，Java 设计者更强调一致性。两个接口如何冲突并不重要，**只要有一个接口提供了一个默认实现，编译器就会报告错误， 我们就必须解决这个二义性**。

当然，如果两个接口都没有为共享方法提供默认实现， 那么就与 Java 8 之前的情况一样，这里不存在冲突。

## 5. 接口存在的意义

在我自己早期学习编程的时候，对接口存在的意义实在困惑，我自己乱写代码的时候基本上不可能意识到需要去写接口，不知道接口到底有什么用，为什么要定义接口，感觉定义接口只是提前做了个多余的工作。

其实不是，定义接口并非多余，**接口是用来提供公用的方法，规定子类的行为的**。举个例子，让大家直观的感受下接口的作用：

比如有个网站， 需要保存不同客户的信息， 有些客户从 Web 网站来， 有些客户从手机客户端来， 有些客户直接从后台管理系统录入。假设不同来源的客户有不同的处理业务流程， 这个时候我们定义接口来提供一个保存客户信息的方法，然后不同的平台实现我们这个保存客户信息的接口，以后保存客户信息的话， 我们只需要知道这个接口就可以了，具体调用的方法被封装成了黑盒子，这也就是 Java 的多态的体现，**接口帮助我们对这些有相同功能的方法做了统一管理**。

![](https://gitee.com/veal98/images/raw/master/img/20210218152835.png)

再比如说，我们要做一个画板程序，其中里面有一个面板类，主要负责绘画功能，然后你就定义了这个类，可是在不久的将来，你突然发现这个类满足不了你了，然后你又要重新设计这个类，更糟糕是你可能要废弃这个现有的类，那么其他引用这个类的地方也需要做出修改，显然这样非常麻烦。

如果你一开始定义了一个接口，把绘画功能放在这个接口里，然后定义类时实现这个接口，那么你只需要用这个接口去引用实现它的类就行了，以后要修改的话只不过是引用另一个类而已。**接口的使用提高了代码的可维护性和可扩展性**。

另外，从这两个例子我们也能看出，接口不仅**降低了代码的耦合度**，而且仅仅描叙了程序对外的服务，不涉及任何具体的实现细节，这样也就比较**安全**一些。

## 参考资料

- 《Java 核心技术 - 卷 1 基础知识 - 第 10 版》
- 《Thinking In Java（Java 编程思想）- 第 4 版》