# 一、Object类通用方法

## 1. 概述

`java.lang.Object`类是Java语言中的根类，即所有类的父类。它中描述的所有方法子类都可以使用。在对象实例化的时候，最终找的父类就是Object。

如果一个类没有特别指定父类， 那么默认则继承自Object类。例如：

```java
public class MyClass /*extends Object*/ {
  	// ...
}
```

根据JDK源代码及Object类的API文档，Object类当中包含的方法有11个。今天我们主要学习其中的2个：

- `public String toString()`：返回该对象的字符串表示。
- `public boolean equals(Object obj)`：指示其他某个对象是否与此对象“相等”。

## 2. toString()

**方法摘要**：

- `public String toString()`：返回该对象的字符串表示。

toString方法返回该对象的字符串表示，其实该字符串内容就是对象的类型+@+内存地址值。

由于toString方法返回的结果是内存地址，而在开发中，经常需要按照对象的属性得到相应的字符串表现形式，因此也需要重写它。

**覆盖重写**：

如果不希望使用toString方法的默认行为，则可以对它进行覆盖重写。例如自定义的Person类：

```java
public class Person {  
    private String name;
    private int age;

    @Override
    public String toString() {
        return "Person{" + "name='" + name + '\'' + ", age=" + age + '}';
    }

    // 省略构造器与Getter Setter
}
```

> 小贴士： 在我们直接使用输出语句输出对象名的时候,其实通过该对象调用了其toString()方法。

## 3. equals()

**方法摘要**：

- `public boolean equals(Object obj)`：指示其他某个对象是否与此对象“相等”。

调用成员方法equals并指定参数为另一个对象，则可以判断这两个对象是否是相同的。这里的“相同”有默认和自定义两种方式。

**默认地址比较**：

如果没有覆盖重写equals方法，那么Object类中默认进行`==`运算符的对象地址比较，只要不是同一个对象，结果必然为false。

**对象内容比较**：

如果希望进行对象的内容比较，即所有或指定的部分成员变量相同就判定两个对象相同，则可以覆盖重写equals方法。例如：

```java
import java.util.Objects;

public class Person {	
	private String name;
	private int age;
	
    @Override
    public boolean equals(Object o) {
        // 如果对象地址一样，则认为相同
        if (this == o)
            return true;
        // 如果参数为空，或者类型信息不一样，则认为不同
        if (o == null || getClass() != o.getClass())
            return false;
        // 转换为当前类型
        Person person = (Person) o;
        // 要求基本类型相等，并且将引用类型交给java.util.Objects类的equals静态方法取用结果
        return age == person.age && Objects.equals(name, person.name);
    }
}
```

🚩 **equals 和 == 比较：**

`·`equals`: 它的作用是**判断两个对象的地址是不是相等**。即，判断两个对象是不是同一个对象。(基本数据类型 == 比较的是值，引用数据类型 == 比较的是内存地址)

`equals()` : 它的作用也是判断两个对象是否相等。但它一般有两种使用情况：

- 情况1：类没有覆盖 equals() 方法。则通过 equals() 比较该类的两个对象时，等价于通过“==”比较这两个对象。

- 情况2：类覆盖了 equals() 方法。一般，我们都覆盖 equals() 方法来两个对象的内容相等；若它们的内容相等，则返回 true (即，认为这两个对象相等)。

举个例子：

```java
public class test1 {
    public static void main(String[] args) {
        String a = new String("ab"); // a 为一个引用
        String b = new String("ab"); // b为另一个引用,对象的内容一样
        String aa = "ab"; // 放在常量池中
        String bb = "ab"; // 从常量池中查找
        if (aa == bb) // true
            System.out.println("aa==bb");
        if (a == b) // false，非同一对象
            System.out.println("a==b");
        if (a.equals(b)) // true String的 equals方法是被重写过的
            System.out.println("aEQb");
        if (42 == 42.0) { // true
            System.out.println("true");
        }
    }
}
```

**说明：**

- **String中的equals方法是被重写过的，因为object的equals方法是比较的对象的内存地址，而String的equals方法比较的是对象的值。**
- 当创建String类型的对象时，虚拟机会在常量池中查找有没有已经存在的值和要创建的值相同的对象，如果有就把它赋给当前引用。如果没有就在常量池中重新创建一个String对象。（详细见下文 String类）
  

## 4. hashCode()

hashCode() 返回散列值，这个散列值的作用是确定该对象在哈希表中的索引位置。

**等价（equals）的两个对象散列值一定相同，但是散列值相同的两个对象不一定等价**。

**在覆盖 equals() 方法时，也应当覆盖 hashCode() 方法，保证等价的两个对象散列值也相等。**

下面的代码中，新建了两个等价的对象，并将它们添加到 HashSet 中。**我们希望将这两个对象当成一样的，只在集合中添加一个对象**，但是因为 EqualExample 没有实现 hasCode() 方法，因此这两个对象的散列值是不同的，最终导致集合添加了两个等价的对象。

```java
EqualExample e1 = new EqualExample(1, 1, 1);
EqualExample e2 = new EqualExample(1, 1, 1);
System.out.println(e1.equals(e2)); // true
HashSet<EqualExample> set = new HashSet<>();
set.add(e1);
set.add(e2);
System.out.println(set.size());   // 2
```

<br>



# 二、Arrays 类

Arrays 类 在`java.util.Arrays`包中

## 1. 作用

此类包含**用来操作数组**的各种方法，比如排序和搜索等。
其所有方法均为静态方法，调用起来非常简单。

## 2. 操作数组的方法

- `public static String toString(int[] a)`：返回指定数组内容的字符串表示形式。

  ```java
  int [] arr = {2,3,4,34,21};
  String s = Arrays.toString(arr);
  ```

- `public static void sort(int[] a)` ：对指定的 int 型数组按数字升序进行排序。

  ```java
  int [] arr = {2,3,4,34,21};
  Arrays.sort(arr);
  String s = Arrays.toString(arr);
  ```

<br>



# 三、ArrayList 类

ArrayList 类 在`java.util.ArrayList `包中

## 1. 作用
**动态数组**，存储在内的数据称为元素。此类提供一些方法来操作内部存储 的元素。 ArrayList 中可不断的添加元素，其大小也自动增长。（类似于C++中的 `vector` ）

## 2. 构造方法
`public ArrayList() ` ：构造一个内容为空的集合。

基本格式：

```java
ArrayList<String> list = new ArrayList<String>();
```

在JDK 7后,右侧泛型的尖括号之内可以留空，但是<>仍然要写：

```java
ArrayList<String> list = new ArrayList<>();
```

## 3. 成员函数
- `public boolean add(E e) ` ： 将指定的元素添加到此集合的尾部。 参数 E e ，在构造ArrayList对象时， <E> 指定了什么数据类型，那么 add(E e) 方法中，只能添加什么数据 类型的对象。
- `public E remove(int index) `：移除此集合中指定位置上的元素。<u>返回被删除的元素</u>。  
- `public E get(int index) `：返回此集合中指定位置上的元素。返回获取的元素。
- `public int size() `：返回此集合中的元素数。遍历集合时，可以控制索引范围，防止越界。 

## 4. 实例

```java
public class Demo{
    public static void main(String[] args){
        ArrayList<String> list = new ArrayList<>();
        list.add("hello");
        list.add("world");
        System.out.println(list.get(0));
        System.out.println(list.size());
        System.out.println(list.remove(1));
        for(int i = 0; i<list.size(); i++)
            System.out.println(list.get(i));
    }
}
```

## 5. 如何存储基本数据类型 
**ArrayList对象不能存储基本类型，只能存储引用类型的数据**。类似 `< int >` 不能写，但是存储基本数据类型对应的包装类型是可以的。所以，**想要存储基本类型数据，必须转换成包装类才能编写**

```java
ArrayList<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
System.out.println(list);
```

<br>



# 四、String 类

## 1. 概述

String 在`java.lang.String`包中，所有 java.lang 包的下类都无须进行导包

**String 被声明为 final，因此它不可被继承**。

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

value 数组被声明为 final，这意味着 value 数组初始化之后就不能再引用其它数组。并且 String 内部没有改变 value 数组的方法，因此可以保证 String 不可变。

## 2. String 成员函数

**判断**

- `public boolean equals (Object anObject)` ：将此字符串与指定对象进行比较。 
- `public boolean equalsIgnoreCase (String anotherString)` ：将此字符串与指定对象进行比较，忽略大小 写。 

**获取**
- `public int length ()` ：返回此字符串的长度。 
- `public String concat (String str) `：将指定的字符串连接到该字符串的末尾。 
- `public char charAt (int index)` ：返回指定索引处的 char值。 
- `public int indexOf (String str) `：返回指定子字符串第一次出现在该字符串内的索引。 
- `public String substring (int beginIndex)` ：返回一个子字符串，从beginIndex开始截取字符串到字符 串结尾。 
- `public String substring (int beginIndex, int endIndex) `：返回一个子字符串，从beginIndex到 endIndex截取字符串。含beginIndex，不含endIndex。

**转换**
- `public char[] toCharArray () `：将此字符串转换为新的字符数组。 
- `public byte[] getBytes ()` ：使用平台的默认字符集将该 String编码转换为新的字节数组。 
- `public String replace (CharSequence target, CharSequence replacement)` ：将与target匹配的字符串使 用replacement字符串替换。

**分割**

- `public String[] split(String regex) `：将此字符串按照给定的regex（规则）拆分为字符串数组。

  ```java
  public class Split_demo{
      public static void main(String args[]){
          String s = 'aa\bb\cc';
          String [] strArray = s.split("\");
          for(int i = 0; i < strArray.length; i++)
             System.out.println(strArray[i]);
      }
  }
  ```

## 3. StringBuffer

### ① String 字符串拼接问题

由于String类的对象内容不可改变，所以每当进行字符串拼接时，总是会在内存中创建一个新的对象。例如：

~~~java
public class StringDemo {
    public static void main(String[] args) {
        String s = "Hello";
        s += "World";
        System.out.println(s);
    }
}
~~~

在API中对String类有这样的描述：字符串是常量，它们的值在创建后不能被更改。

根据这句话分析我们的代码，其实总共产生了三个字符串，即`"Hello"`、`"World"`和`"HelloWorld"`。引用变量s首先指向`Hello`对象，最终指向拼接出来的新字符串对象，即`HelloWord` 。

由此可知，如果对字符串进行拼接操作，每次拼接，都会构建一个新的String对象，既耗时，又浪费空间。

而**StringBuffer / StringBuilder对象是可以改变它的内容的**

### ② StringBuffer 初始化

StringBuffer不能像String那样直接用字符串赋值，所以也不能那样初始化。**它需要通过构造方法来初始化**，一共有4个构造方法：

```java
public StringBuffer()

public StringBuffer(CharSequence seq)

public StringBuffer(int capacity)

public StringBuffer(String str)
```

### ③ StringBuffer 成员函数

以下是 StringBuffer 类支持的主要方法：

| 序号 | 方法描述                                                     |
| :--- | :----------------------------------------------------------- |
| 1    | public StringBuffer append(String s) 将指定的字符串追加到此字符序列。 |
| 2    | public StringBuffer reverse()  将此字符序列用其反转形式取代。 |
| 3    | public delete(int start, int end) 移除此序列的子字符串中的字符。 |
| 4    | public insert(int offset, int i) 将 `int` 参数的字符串表示形式插入此序列中。 |
| 5    | replace(int start, int end, String str) 使用给定 `String` 中的字符替换此序列的子字符串中的字符。 |

```java
public class Test{
  public static void main(String args[]){
    StringBuffer sBuffer = new StringBuffer("123：");
    sBuffer.append("www");
    sBuffer.append(".312");
    sBuffer.append(".com");
    System.out.println(sBuffer);  
  }
}
```

## 4. StringBuilder

StringBuilder 类在 Java 5 中被提出，它和 StringBuffer 之间的最大不同在于 **StringBuilder 的方法不是线程安全的（不能同步访问）。**

由于 **StringBuilder 相较于 StringBuffer 有速度优势**，所以多数情况下建议使用 StringBuilder 类。然而在应用程序要求线程安全的情况下，则必须使用 StringBuffer 类。

### ① StringBuilder 初始化

同样是需要构造函数

- `public StringBuilder()`：构造一个空的StringBuilder容器。
- `public StringBuilder(String str)`：构造一个StringBuilder容器，并将字符串添加进去。

```java
public class StringBuilderDemo {
    public static void main(String[] args) {
        StringBuilder sb1 = new StringBuilder();
        System.out.println(sb1); // (空白)
        // 使用带参构造
        StringBuilder sb2 = new StringBuilder("itcast");
        System.out.println(sb2); // itcast
    }
}
```

### ② StringBuilder 成员函数

- `public StringBuilder append(...)`：添加任意类型数据的字符串形式，并返回当前对象自身。
- `public String toString()`：将当前StringBuilder对象转换为String对象。

**append 方法**：

append方法具有多种重载形式，**可以接收任意类型的参数**。**任何数据作为参数都会将对应的字符串内容添加到StringBuilder中**。例如：

```java
public class Demo02StringBuilder {
	public static void main(String[] args) {
		//创建对象
		StringBuilder builder = new StringBuilder();
		//public StringBuilder append(任意类型)
		StringBuilder builder2 = builder.append("hello");
		//对比一下
		System.out.println("builder:"+builder);
		System.out.println("builder2:"+builder2);
		System.out.println(builder == builder2); //true
	    // 可以添加 任何类型
		builder.append("hello");
		builder.append("world");
		builder.append(true);
		builder.append(100);
		// 在我们开发中，会遇到调用一个方法后，返回一个对象的情况。然后使用返回的对象继续调用方法。
        // 这种时候，我们就可以把代码现在一起，如append方法一样，代码如下
		//链式编程
		builder.append("hello").append("world").append(true).append(100);
		System.out.println("builder:"+builder);
	}
}
```

**toString 方法**：

通过 toString 方法，**StringBuilder对象将会转换为不可变的String对象**。如：

```java
public class Demo16StringBuilder {
    public static void main(String[] args) {
        // 链式创建
        StringBuilder sb = new StringBuilder("Hello").append("World").append("Java");
        // 调用方法
        String str = sb.toString();
        System.out.println(str); // HelloWorldJava
    }
}
```

## 5. String、StringBuffer、StringBuilder 比较

**可变性**

- String 不可变
- StringBuffer 和 StringBuilder 可变

**线程安全**

- String 不可变，因此是线程安全的
- StringBuilder 不是线程安全的
- StringBuffer 是线程安全的，内部使用 synchronized 进行同步

## 6. 字符串常量池 String Pool

**字符串常量池**（String Pool）保存着所有字符串字面量（literal strings），这些字面量在编译时期就确定。不仅如此，还可以使用 String 的 `intern() `方法在运行过程中将字符串添加到 String Pool 中。

当一个字符串调用 intern() 方法时，如果 String Pool 中已经存在一个字符串和该字符串值相等（使用 equals() 方法进行确定），那么就会返回 String Pool 中字符串的引用；否则，就会在 String Pool 中添加一个新的字符串，并返回这个新字符串的引用。

下面示例中，s1 和 s2 采用 **构造函数 new String() **的方式新建了两个不同字符串，而 s3 和 s4 是通过 s1.intern() 方法取得一个字符串引用。**intern() 首先把 s1 引用的字符串放到 String Pool 中，然后返回这个字符串引用**。因此 s3 和 s4 引用的是同一个字符串。

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

- `String str = "i"` 的方式，java 虚拟机会将其分配到常量池中；

- `String str = new String(“i”) ` 则会被分到堆内存中。可通过 intern 方法 手动加入常量池

## 7. new String(“xyz”) 创建了几个字符串对象

使用这种方式一共会创建两个字符串对象（前提是 String Pool 中还没有 "abc" 字符串对象）。

- "abc" 属于字符串字面量，因此编译时期会在 String Pool 中创建一个字符串对象，指向这个 "abc" 字符串字面量；
- 而使用 new 的方式会在堆中创建一个字符串对象。