### ② 初始化对象引用的四种方式

如果想初始化这些引用变量，可以在代码中的下列位置进行：

- 1）**在定义对象的对方**。这意味着它们总是能够在构造器被调用之前被初始化
- 2）**在类的构造器中**
- 3）**在正要使用这些对象之前**，这种方式称为**惰性初始化 delayed initialization**
- 4）**使用实例初始化**

下面是这四种方式的示例：

```java
class Soap{
    private String s;
    Soap(){
        System.out.println("Soap()");
        s = "Constructed"; // 在类的构造函数中初始化
    }

    public String toString(){
        return s;
    }
}

public class Bath {
    private String s1 = "Happy"; // 在定义对象的地方就初始化
    private String s2 = "NewYear";
    private String s3, s4;
    private Soap soap;

    public Bath(){
        System.out.println("Inside Bath()");
        s3 = "Joy"; // 使用实例进行初始化
        soap = new Soap();
    }
    
    public String toString(){
        if(s4 == null)
            s4 = "Jack"; // 惰性初始化
       	return "s1 = " + s1 + "\n" + "s2 = " + s3 + "\n" + ......
    }
}
```

## 