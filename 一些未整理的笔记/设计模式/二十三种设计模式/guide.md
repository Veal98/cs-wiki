# 🚢 二十三种设计模式

---

## 1. 创建型模式 Creational Pattern

✨ 创建型模式对类的实例化过程进行了抽象，能够**将软件模块中对象的创建和对象的使用分离**。为了使软件的结构更加清晰，外界对于这些对象只需要知道它们共同的接口，而不清楚其具体的实现细节，使整个系统的设计更加符合单一职责原则。

| 序号 |                             图稿                             |                             模式                             | 🏆 重要性 |
| :--: | :----------------------------------------------------------: | :----------------------------------------------------------: | :------: |
|      |                                                              | [简单工厂模式 (Simple Factory) / 静态工厂方法模式 (Static Factory Method)](设计模式/二十三种设计模式/创建型模式/0-简单工厂模式.md) |    4     |
|  1   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206212655.png" alt="img" style="zoom:80%;" /> | [工厂方法模式 (Factory Method) / 工厂模式 (Factory)](设计模式/二十三种设计模式/创建型模式/1-工厂方法模式.md) |    5     |
|  2   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206212930.png" alt="img" style="zoom:80%;" /> | [抽象工厂模式 (Abstract Factory)](设计模式/二十三种设计模式/创建型模式/2-抽象工厂模式.md) |    5     |
|  3   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206212713.png" alt="img" style="zoom:80%;" /> | [建造者模式 / 生成器模式 (Builder)](设计模式/二十三种设计模式/创建型模式/3-建造者模式.md) |    2     |
|  4   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206212723.png" alt="img" style="zoom:80%;" /> | [原型模式 (Prototype)](设计模式/二十三种设计模式/创建型模式/4-原型模式.md) |    1     |
|  5   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206212734.png" alt="img" style="zoom:80%;" /> | [单例模式 (Singleton)](设计模式/二十三种设计模式/创建型模式/5-单例模式.md) |    4     |

## 2. 结构型模式 Structural Pattern

✨ 结构型模式描述如何**将类或者对象结合在一起形成更大的结构**，就像搭积木，可以通过简单积木的组合形成复杂的、功能更为强大的结构。

结构型模式可以分为类结构型模式和对象结构型模式：

**类结构型模式**：关心类的组合，由多个类可以组合成一个更大的系统，在类结构型模式中一般只存在继承关系和实现关系。

**对象结构型模式**：关心类与对象的组合，通过关联关系使得在一 个类中定义另一个类的实例对象，然后通过该对象调用其方法。 根据“合成复用原则”，在系统中尽量使用关联关系来替代继承关系，因此大部分结构型模式都是对象结构型模式。

| 序号 |                             图稿                             |         模式         | 🏆 重要性 |
| :--: | :----------------------------------------------------------: | :------------------: | :------: |
|  1   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214000.png" alt="img" style="zoom:67%;" /> | 适配器模式 (Adapter) |    4     |
|  2   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214020.png" alt="img" style="zoom:80%;" /> |  桥接模式 (Bridge)   |    3     |
|  3   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214031.png" alt="img" style="zoom:80%;" /> | 组合模式 (Composite) |    4     |
|  4   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214051.png" alt="img" style="zoom:80%;" /> | 装饰模式 (Decorator) |    3     |
|  5   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214107.png" alt="img" style="zoom:80%;" /> |  外观模式 (Facade)   |    5     |
|  6   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214116.png" alt="img" style="zoom:80%;" /> | 享元模式 (Flyweight) |    1     |
|  7   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214125.png" alt="img" style="zoom:80%;" /> |   代理模式 (Proxy)   |    4     |

## 3. 行为型模式 Behavioral Pattern

✨ 行为型模式是对**在不同的对象之间划分责任和算法**的抽象化。不仅仅关注类和对象的结构，而且重点关注类和对象之间的相互作用。

行为型模式分为类行为型模式和对象行为型模式两种：

**类行为型模式**：类的行为型模式使用继承关系在几个类之间分配行为，类行为型模式主要通过多态等方式来分配父类与子类的职责。

**对象行为型模式**：对象的行为型模式则使用对象的聚合关联关系来分配行为，对象行为型模式主要是通过对象关联等方式来分配两个或多个类的职责。根据“合成复用原则”，系统中要尽量使用关联关系来取代继承关系，因此大部分行为型设计模式都属于对象行为型设计模式。

| 序号 |                             图稿                             |                 模式                 | 🏆 重要性 |
| :--: | :----------------------------------------------------------: | :----------------------------------: | :------: |
|  1   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214241.png" alt="img" style="zoom:80%;" /> | 职责链模式 (Chain of Responsibility) |    3     |
|  2   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214249.png" alt="img" style="zoom:80%;" /> |          命令模式 (Command)          |    4     |
|  3   |                                                              |       解释器模式 (Interpreter)       |    1     |
|  4   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214316.png" alt="img" style="zoom:80%;" /> |        迭代器模式 (Iterator)         |    5     |
|  5   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214327.png" alt="img" style="zoom:80%;" /> |        中介者模式 (Mediator)         |    2     |
|  6   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214340.png" alt="img" style="zoom:80%;" /> |         备忘录模式 (Memento)         |    2     |
|  7   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214348.png" alt="img" style="zoom:80%;" /> |        观察者模式 (Observer)         |    5     |
|  8   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214407.png" alt="img" style="zoom:80%;" /> |           状态模式 (State)           |    3     |
|  9   | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214416.png" alt="img" style="zoom:80%;" /> |         策略模式 (Strategy)          |    4     |
|  10  | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214426.png" alt="img" style="zoom:80%;" /> |    模板方法模式 (Template Method)    |    3     |
|  11  | <img src="https://gitee.com/veal98/images/raw/master/img/20201206214437.png" alt="img" style="zoom:80%;" /> |         访问者模式 (Visitor)         |    1     |

## 📚 References

- [Design-Patterns](https://design-patterns.readthedocs.io/zh_CN/latest/index.html)
- [菜鸟教程 RUNNOOB.COM](https://www.runoob.com/design-pattern/design-pattern-tutorial.html)
- [Gitbook - framework-learning](https://qsjzwithguang19forever.gitee.io/framework-learning/gitbook_doc/design_pattern/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E7%AE%80%E4%BB%8B.html)
- [Gitbook - bugstack](http://book.bugstack.cn/#s/6AneBuNA)
- [Github - CS-Notes](https://cyc2018.github.io/CS-Notes/#/notes/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F)
- [Java 最常见的 208 道面试题](https://mp.weixin.qq.com/s/Wahq4TnCm4Pzb6VshWma1Q)
- [shusheng007 - 秒懂设计模式之建造者模式 - 知乎](https://zhuanlan.zhihu.com/p/58093669)