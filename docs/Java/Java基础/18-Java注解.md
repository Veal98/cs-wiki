# 🧙‍♂️ Java 注解

---

## 1. 注解的定义

Java 注解 **Annotation** 是从 Java5 开始添加到 Java 的。注解也是一种类的类型，他是用的修饰符为 `@interface`

我们新建一个注解 `MyTestAnnotation`

```csharp
public @interface MyTestAnnotation {

}
```

接着我们就可以在**类或者方法上**作用我们刚刚新建的注解

```java
@MyTestAnnotation
public class test {
   @MyTestAnnotation
   public static void main(String[] args){
   }
}
```

以上我们只是了解了注解的写法，但是我们定义的注解中还没写任何代码，现在这个注解毫无意义，要如何使注解工作呢？接下来我们接着了解元注解。

## 2. 元注解

**元注解顾名思义我们可以理解为注解的注解，它可以作用在注解上，方便我们使用注解实现想要的功能**。元注解分别有 `@Retention`、 `@Target`、 `@Document`、 `@Inherited` 和 `@Repeatable`（JDK1.8加入）五种。

### ① @Retention

`Retention` 英文意思有保留、保持的意思，它表示注解存在阶段是保留在源码（编译期），字节码（类加载）或者运行期（JVM中运行）。在 `@Retention` 注解中使用枚举 `RetentionPolicy` 来表示注解保留时期

- `@Retention(RetentionPolicy.SOURCE)`，注解仅存在于源码中，在 class 字节码文件中不包含
- `@Retention(RetentionPolicy.CLASS)`， 默认的保留策略，注解会在 class 字节码文件中存在，但运行时无法获得
- `@Retention(RetentionPolicy.RUNTIME)`， 注解会在 class 字节码文件中存在，在运行时可以通过反射获取到

我们自定义的注解如果只是存在源码中或者字节码文件中就无法发挥作用，而在运行期间能获取到注解才能实现我们目的，⭐ 所以**自定义注解中肯定是使用 `@Retention(RetentionPolicy.RUNTIME)`**

```css
@Retention(RetentionPolicy.RUNTIME)
public @interface MyTestAnnotation {

}
```

### ② @Target

`Target` 的英文意思是目标，这也很容易理解，使用 `@Target` 元注解表示我们的注解作用的范围（可以是类，方法，方法参数变量等），同样也是通过枚举类ElementType表达作用类型

- `@Target(ElementType.TYPE)` 作用接口、类、枚举、注解（常用）
- `@Target(ElementType.FIELD)` 作用属性字段、枚举的常量
- `@Target(ElementType.METHOD)` 作用方法
- `@Target(ElementType.PARAMETER)` 作用方法参数
- `@Target(ElementType.CONSTRUCTOR)` 作用构造函数
- `@Target(ElementType.LOCAL_VARIABLE)` 作用局部变量
- `@Target(ElementType.ANNOTATION_TYPE)` 作用于注解（`@Retention` 注解中就使用该属性）
- `@Target(ElementType.PACKAGE)` 作用于包
- `@Target(ElementType.TYPE_PARAMETER)` 作用于类型泛型，即泛型方法、泛型类、泛型接口 （jdk1.8加入）
- `@Target(ElementType.TYPE_USE)` 可以用于标注任意类型除了 class （jdk1.8加入）

```kotlin
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface MyTestAnnotation {

}
```

### ③ @Documented

`Document` 的英文意思是文档。它的作用是能够将注解中的元素包含到 Javadoc 中去。

### ④ @Inherited

`Inherited` 的英文意思是继承，但是这个继承和我们平时理解的继承大同小异，**一个被 `@Inherited` 注解了的注解修饰了一个父类，如果他的子类没有被其他注解修饰，则它的子类也继承了父类的注解**。

```java
/*
* 自定义注解
*/
@Documented
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface MyTestAnnotation {
    
}

------------------------------------------

/*
* 父类标注自定义注解
*/
@MyTestAnnotation
public class Father {
}

------------------------------------------

/*
* 子类
*/
public class Son extends Father {
}


------------------------------------------
    
/*
* 测试子类获取父类自定义注解
*/
public class test {
   public static void main(String[] args){

      // 获取Son的class对象
       Class<Son> sonClass = Son.class;
      // 获取 Son 类上的注解 MyTestAnnotation
      MyTestAnnotation annotation = sonClass.getAnnotation(MyTestAnnotation.class);
   }
}
```

### ⑤ @Repeatable

`Repeatable` 的英文意思是可重复的。顾名思义说明**被这个元注解修饰的注解可以同时作用一个对象多次，但是每次作用注解又可以代表不同的含义**。

举个例子：我们定义一个 People 的注解，该注解的属性即喜欢玩的游戏 Game 的集合，一个 Game 注解，该注解的属性即游戏名称
```kotlin
/**玩家注解*/
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface People {
    Game[] value() ;
}

/**游戏注解*/
@Repeatable(People.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Game {
    String value() default "";
}

/**玩游戏类*/
@Game(value = "LOL")
@Game(value = "PUBG")
@Game(value = "NFS")
@Game(value = "Dirt4")
public class PlayGame {
}
```

通过上面的例子，你可能会有一个疑问，注解中 `value()` 是啥，其实这和注解中定义的属性对应。接下来我们继续学习注解的属性。

## 3. 注解的属性

### ① 概述

注解的属性其实和类中定义的变量有异曲同工之处，只是**注解中的变量都是成员变量（属性），并且注解中是没有方法的，只有成员变量**。注解的属性类型可以有以下列出的类型

- 基本数据类型
- String
- 枚举类型
- 注解类型
- Class 类型
- 以上类型的一维数组类型

比如我们定义：

```java
public @interface People {
    String value();
    int index();
}
```

那么我们使用该注解的时候就是：

```java
@People(value = "hello", index = 1)
public class xxx{
    
}
```

再举个例子， `@Repeatable` 注解中的变量是类型对应 `Annotation`（接口）的泛型 Class：

```dart
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Repeatable {
    /**
     * Indicates the <em>containing annotation type</em> for the
     * repeatable annotation type.
     * @return the containing annotation type
     */
    Class<? extends Annotation> value();
}
```

读到这大 🔥 肯定有个疑问，既然注解中的变量都是成员变量（属性），那为啥后面还有括号呢 `String value()`？👇

### ② 注解的本质

其实注解的本质就是一个 `Annotation` 接口

```csharp
/*
* Annotation 接口源码
*/
public interface Annotation {
    boolean equals(Object obj);
    int hashCode();
    Class<? extends Annotation> annotationType();
}
```

注解本身就是 `Annotation` 接口的子接口，**也就是说注解中其实是可以有属性和方法，但是接口中的属性都是 `static final` 的，对于注解来说没什么意义，我们定义注解的属性就相当于定义接口的方法，这就是为什么成员变量会有括号**，不同于接口我们可以在注解的括号中给成员变量赋值。

### ③ 获取注解属性

前面我们说了很多注解如何定义，放在哪，现在我们可以开始学习注解属性的提取了，这才是使用注解的关键，**获取属性的值才是使用注解的目的**。

⭐ **使用反射获取注解属性**，主要有三个基本的方法：

```php
/**是否存在对应 Annotation 对象*/
public boolean isAnnotationPresent(Class<? extends Annotation> annotationClass) {
    return GenericDeclaration.super.isAnnotationPresent(annotationClass);
}

/**获取 Annotation 对象*/
public <A extends Annotation> A getAnnotation(Class<A> annotationClass) {
    Objects.requireNonNull(annotationClass);

    return (A) annotationData().annotations.get(annotationClass);
}
/**获取所有 Annotation 对象数组*/   
public Annotation[] getAnnotations() {
    return AnnotationParser.toArray(annotationData().annotations);
}    
```

下面结合前面的例子，我们来获取一下注解属性，再强调一下，我们自定义的注解必须使用元注解 `@Retention(RetentionPolicy.RUNTIME)`

```kotlin
public class test {
   public static void main(String[] args) throws NoSuchMethodException {

        Class<Father> fatherClass = Father.class;
        boolean annotationPresent = fatherClass.isAnnotationPresent(MyTestAnnotation.class);
        if(annotationPresent){
            // 获取注解
            MyTestAnnotation annotation = fatherClass.getAnnotation(MyTestAnnotation.class);
            System.out.println(annotation.name());
            System.out.println(annotation.age());
        }
    }
}
```

## 4. JDK 提供的注解

| 注解                | 作用                                                         | 注意事项                                                     |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `@Override`         | 它是用来描述当前方法是一个重写的方法，在编译阶段对方法进行检查 | jdk1.5 中它只能描述继承中的重写，jdk1.6 中它可以描述接口实现的重写, 也能描述类的继承的重写 |
| `@Deprecated`       | 它是用于描述当前方法是一个过时的方法                         | 无                                                           |
| `@SuppressWarnings` | 对程序中的警告去除。                                         | 无                                                           |

## 📚 References

- [苦 | 寒 — Java 注解完全解析](https://www.jianshu.com/p/9471d6bcf4cf)