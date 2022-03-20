# 💼 Dubbo 动态代理 + SPI 机制

---

> 🚨 学习本章前请先了解 **Java 动态代理**和 **Java 中的 SPI 机制**，参见`【Java 基础】`部分

## 1. Dubbo 支持的动态代理机制

在 Dubbo 中，没有使用 CGLib 进行代理，而是使用 JDK 和 Javassist 动态代理机制（**默认使用 Javassist 动态代理机制**，原因很简单，**Javassist 快，且字节码生成方便**。ASM 比 Javassist 更快，但是没有快一个数量级，而Javassist 只需用字符串拼接就可以生成字节码，而 ASM 需要手工生成，成本较高，比较麻烦。）

```xml
<dubbo:provider proxy="jdk" />
```

或

```xml
<dubbo:consumer proxy="jdk" />
```

还可以通过 **SPI 扩展机制**配置自己的动态代理策略。

## 2. Dubbo 中的 SPI 机制

SPI，`service provider interface`，服务发现机制，**Java / JDK 中的 SPI 机制**可见 👉 [高级：Java 中的 SPI 机制](https://veal98.gitee.io/cs-wiki/#/Java/Java基础/SPI机制)

Dubbo 没有使用 JDK SPI，而是对其进行了增强和扩展：

- **JDK SPI 仅通过接口类名获取所有实现**，如果有扩展实现初始化很耗时，但如果没用上也加载，会很浪费资源。**Duboo SPI 可以根据接口类名和 `key` 值获取一个具体实现**
- 可以对扩展类实例的属性进行依赖注入，即IOC
- 可以采用装饰器模式实现 AOP 功能

你可以发现 Dubbo 的源码中有很多地方都用到了 `@SPI` 注解，例如：`Protocol`（通信协议），`LoadBalance`（负载均衡）等。基于 Dubbo SPI，我们可以非常容易的进行拓展。`ExtensionLoader` 是扩展点核心类，用于载入Dubbo 中各种可配置的组件，比如刚刚说的 `Protocol `和 `LoadBalance` 等。那么接下来我们看一下 Dubbo SPI 的示例

## 3. Dubbo SPI 代码示例

首先，我们定义一个接口，名称为 Robot，**在 `Robot` 接口上标注 `@SPI` 注解**，表明使用 SPI 机制：

```java
@SPI
public interface Robot {
    void sayHello();
}
```

接下来定义两个实现类，分别为 `OptimusPrime` 和 `Bumblebee`。

```java
public class OptimusPrime implements Robot {
    
    @Override
    public void sayHello() {
        System.out.println("Hello, I am Optimus Prime.");
    }
}

public class Bumblebee implements Robot {

    @Override
    public void sayHello() {
        System.out.println("Hello, I am Bumblebee.");
    }
}
```

Dubbo SPI 所需的配置文件要放在以下3个目录任意一个中：

- `META-INF/services/`
- `META-INF/dubbo/`
- `META-INF/dubbo/internal/`

名称为 Robot 的全限定名 `org.apache.spi.Robot`，内容如下 **k-v 键值对形式**，Key 是拓展类的 name，Value 是扩展的全限定名实现类：

```fallback
optimusPrime = org.apache.spi.OptimusPrime
bumblebee = org.apache.spi.Bumblebee
```

测试一下：

```java
public class DubboSPITest {

    @Test
    public void sayHello() throws Exception {
        ExtensionLoader<Robot> extensionLoader = 
            ExtensionLoader.getExtensionLoader(Robot.class);
        Robot optimusPrime = extensionLoader.getExtension("optimusPrime");
        optimusPrime.sayHello();
        Robot bumblebee = extensionLoader.getExtension("bumblebee");
        bumblebee.sayHello();
    }
}
```

## 4. Dubbo SPI 源码分析

我们可以看到大致流程就是先通过接口类利用 `ExtensionLoader.getExtensionLoader(Protocol.class)` 找到一个 `ExtensionLoader` ，然后再通过 `ExtensionLoader.getExtension(name)` 得到指定名字的实现类实例。

我们就先看下 `getExtensionLoader()` 做了什么：

 ![](https://gitee.com/veal98/images/raw/master/img/20201209212044.png)

很简单，做了一些判断然后<u>从缓存里面找是否已经存在这个类型的 `ExtensionLoader` ，如果没有就新建一个塞入缓存</u>。最后返回接口类对应的 `ExtensionLoader` 。

我们再来看一下  `getExtension()` 方法，这个方法就是从类对应的 `ExtensionLoader` 中通过名字找到实例化完的实现类：

![](https://gitee.com/veal98/images/raw/master/img/20201209212150.png)

重点就是 **`createExtension()` 通过反射创建实例** 👇

```java
private T createExtension(String name) {
    // 从配置文件中加载所有的拓展类，可得到“配置项名称”到“配置类”的映射关系表
    Class<?> clazz = getExtensionClasses().get(name);
    if (clazz == null) {
        throw findException(name);
    }
    try {
        T instance = (T) EXTENSION_INSTANCES.get(clazz);
        if (instance == null) {
            // 通过反射创建实例
            EXTENSION_INSTANCES.putIfAbsent(clazz, clazz.newInstance());
            instance = (T) EXTENSION_INSTANCES.get(clazz);
        }
        // 向实例中注入依赖
        injectExtension(instance);
        Set<Class<?>> wrapperClasses = cachedWrapperClasses;
        if (wrapperClasses != null && !wrapperClasses.isEmpty()) {
            // 循环创建 Wrapper 实例
            for (Class<?> wrapperClass : wrapperClasses) {
                // 将当前 instance 作为参数传给 Wrapper 的构造方法，并通过反射创建 Wrapper 实例。
                // 然后向 Wrapper 实例中注入依赖，最后将 Wrapper 实例再次赋值给 instance 变量
                instance = injectExtension(
                    (T) wrapperClass.getConstructor(type).newInstance(instance));
            }
        }
        return instance;
    } catch (Throwable t) {
        throw new IllegalStateException("...");
    }
}
```

💧 `createExtension` 方法的逻辑稍复杂一下，包含了如下的步骤：

1. 通过 `getExtensionClasses` 获取所有的拓展类
2. 通过反射创建拓展对象
3. 向拓展对象中注入依赖
4. 将拓展对象包裹在相应的 `Wrapper `对象中

以上步骤中，第一个步骤是加载拓展类的关键，第三和第四个步骤是 Dubbo **IOC** 与 **AOP** 的具体实现（下文会详细详解）

⭐ 到这步为止，画个图帮助大家理解：

<img src="https://gitee.com/veal98/images/raw/master/img/20201209212404.png" style="zoom:80%;" />

那么 `getExtensionClasses()` 是怎么根据 `name` 找到对应类的呢？`injectExtension()` 到底是如何注入的呢（set 方法注入）？为什么需要包装类呢？👇

### getExtensionClasses 获取所有的拓展类

`getExtensionClasses` 就是找出所有拓展类，返回一个 k-v 的 map：

```java
private Map<String, Class<?>> getExtensionClasses() {
    Map<String, Class<?>> classes = cachedClasses.get();
    // 双检锁
    if (classes == null) {
        synchronized (cachedClasses) {
            classes = cachedClasses.get(); // 先去缓存中找
            if (classes == null) {
                // 缓存则调用 loadExtensionClasses
                classes = loadExtensionClasses();
                cachedClasses.set(classes);
            }
        }
    }
    return classes;
}
```

这个方法进去也是先去缓存中找，如果缓存是空的，那么调用 `loadExtensionClasses`，该方法总共做了两件事情，**一是对 SPI 注解进行解析，二是调用 `loadDirectory` 方法加载指定文件夹配置文件**，我们来看下这个方法：

```java
private Map<String, Class<?>> loadExtensionClasses() {
    // 获取 SPI 注解，这里的 type 变量是在调用 getExtensionLoader 方法时传入的
    final SPI defaultAnnotation = type.getAnnotation(SPI.class);
    if (defaultAnnotation != null) {
        String value = defaultAnnotation.value();
        if ((value = value.trim()).length() > 0) {
            // 对 SPI 注解内容进行切分
            String[] names = NAME_SEPARATOR.split(value);
            // 检测 SPI 注解内容是否合法，不合法则抛出异常
            if (names.length > 1) {
                throw new IllegalStateException("more than 1 default extension name on extension...");
            }

            // 设置默认名称，参考 getDefaultExtension 方法
            if (names.length == 1) {
                cachedDefaultName = names[0];
            }
        }
    }

    Map<String, Class<?>> extensionClasses = new HashMap<String, Class<?>>();
    // 加载指定文件夹下的配置文件
    loadDirectory(extensionClasses, DUBBO_INTERNAL_DIRECTORY);
    loadDirectory(extensionClasses, DUBBO_DIRECTORY);
    loadDirectory(extensionClasses, SERVICES_DIRECTORY);
    return extensionClasses;
}
```

`loadDirectory`里面就是根据类名和指定的目录，找到文件先获取所有的资源，然后一个一个去加载类，下面我们来看一下 `loadDirectory` 的源码：

```java
private void loadDirectory(Map<String, Class<?>> extensionClasses, String dir) {
    // fileName = 文件夹路径 + type 全限定名 
    String fileName = dir + type.getName();
    try {
        Enumeration<java.net.URL> urls;
        ClassLoader classLoader = findClassLoader();
        // 根据文件名加载所有的同名文件
        if (classLoader != null) {
            urls = classLoader.getResources(fileName);
        } else {
            urls = ClassLoader.getSystemResources(fileName);
        }
        if (urls != null) {
            while (urls.hasMoreElements()) {
                java.net.URL resourceURL = urls.nextElement();
                // 加载资源
                loadResource(extensionClasses, classLoader, resourceURL);
            }
        }
    } catch (Throwable t) {
        logger.error("...");
    }
}
```

`loadDirectory` 方法先通过 `classLoader `获取所有资源链接，然后再通过 `loadResource `方法加载资源。我们继续跟下去，看一下 `loadResource `方法的实现：

```java
private void loadResource(Map<String, Class<?>> extensionClasses, 
	ClassLoader classLoader, java.net.URL resourceURL) {
    try {
        BufferedReader reader = new BufferedReader(
            new InputStreamReader(resourceURL.openStream(), "utf-8"));
        try {
            String line;
            // 按行读取配置内容
            while ((line = reader.readLine()) != null) {
                // 定位 # 字符
                final int ci = line.indexOf('#');
                if (ci >= 0) {
                    // 截取 # 之前的字符串，# 之后的内容为注释，需要忽略
                    line = line.substring(0, ci);
                }
                line = line.trim();
                if (line.length() > 0) {
                    try {
                        String name = null;
                        int i = line.indexOf('=');
                        if (i > 0) {
                            // 以等于号 = 为界，截取键与值
                            name = line.substring(0, i).trim();
                            line = line.substring(i + 1).trim();
                        }
                        if (line.length() > 0) {
                            // 加载类，并通过 loadClass 方法对类进行缓存
                            loadClass(extensionClasses, resourceURL, 
                                      Class.forName(line, true, classLoader), name);
                        }
                    } catch (Throwable t) {
                        IllegalStateException e = new IllegalStateException("Failed to load extension class...");
                    }
                }
            }
        } finally {
            reader.close();
        }
    } catch (Throwable t) {
        logger.error("Exception when load extension class...");
    }
}
```

`loadResource` 方法用于读取和解析配置文件，并通过反射加载类，最后**调用 `loadClass` 方法操作缓存**，该方法的逻辑如下：

```java
private void loadClass(Map<String, Class<?>> extensionClasses, java.net.URL resourceURL, 
    Class<?> clazz, String name) throws NoSuchMethodException {
    
    if (!type.isAssignableFrom(clazz)) {
        throw new IllegalStateException("...");
    }

    // 检测目标类上是否有 Adaptive 注解
    if (clazz.isAnnotationPresent(Adaptive.class)) {
        if (cachedAdaptiveClass == null) {
            // 设置 cachedAdaptiveClass缓存
            cachedAdaptiveClass = clazz;
        } else if (!cachedAdaptiveClass.equals(clazz)) {
            throw new IllegalStateException("...");
        }
        
    // 检测 clazz 是否是 Wrapper 类型
    } else if (isWrapperClass(clazz)) {
        Set<Class<?>> wrappers = cachedWrapperClasses;
        if (wrappers == null) {
            cachedWrapperClasses = new ConcurrentHashSet<Class<?>>();
            wrappers = cachedWrapperClasses;
        }
        // 存储 clazz 到 cachedWrapperClasses 缓存中
        wrappers.add(clazz);
        
    // 程序进入此分支，表明 clazz 是一个普通的拓展类
    } else {
        // 检测 clazz 是否有默认的构造方法，如果没有，则抛出异常
        clazz.getConstructor();
        if (name == null || name.length() == 0) {
            // 如果 name 为空，则尝试从 Extension 注解中获取 name，或使用小写的类名作为 name
            name = findAnnotationName(clazz);
            if (name.length() == 0) {
                throw new IllegalStateException("...");
            }
        }
        // 切分 name
        String[] names = NAME_SEPARATOR.split(name);
        if (names != null && names.length > 0) {
            Activate activate = clazz.getAnnotation(Activate.class);
            if (activate != null) {
                // 如果类上有 Activate 注解，则使用 names 数组的第一个元素作为键，
                // 存储 name 到 Activate 注解对象的映射关系
                cachedActivates.put(names[0], activate);
            }
            for (String n : names) {
                if (!cachedNames.containsKey(clazz)) {
                    // 存储 Class 到名称的映射关系
                    cachedNames.put(clazz, n);
                }
                Class<?> c = extensionClasses.get(n);
                if (c == null) {
                    // 存储名称到 Class 的映射关系
                    extensionClasses.put(n, clazz);
                } else if (c != clazz) {
                    throw new IllegalStateException("...");
                }
            }
        }
    }
}
```

可以看到，**`loadClass ` 根据类的情况做不同的缓存。分别有 `Adaptive` 、`WrapperClass` 和普通类这三种，普通类又对 `Activate`  进行了判断**。

> 💡 **`Activate` 注解**：拿 Filter 举例，Filter 有很多实现类，在某些场景下需要其中的几个实现类，而某些场景下需要另外几个， `Activate` 注解就是标记这个用的。
>
> 它有三个属性，`group `表示修饰在哪个端，是 provider 还是 consumer，`value` 表示在 URL 参数中出现才会被激活，`order ` 表示实现类的顺序。

⭐ 至此对于**普通类**来说整个 SPI 过程完结了：

![](https://gitee.com/veal98/images/raw/master/img/20201209213223.png)

接下来我们分别看不是普通类的几种东西是干啥用的。

### Adaptive 注解（自适应扩展）

> ✅ 涉及到 **Dubbo SPI 的扩展点自适应机制**，后续会补充

### wrapperClasses（AOP）

包装类是因为**一个扩展接口可能有多个扩展实现类**，而**这些扩展实现类会有一个相同的或者公共的逻辑**，如果每个实现类都写一遍代码就重复了，并且比较不好维护。

因此就搞了个包装类，Dubbo 里帮你自动包装，只**要某个扩展类的构造函数只有一个参数，并且是扩展接口类型，就会被判定为包装类**，然后记录下来，用来包装别的实现类。

![](https://gitee.com/veal98/images/raw/master/img/20201209221730.png)

### injectExtension（IoC)

**Dubbo IOC 目前仅支持 setter 方式注入**。Dubbo 首先会通过反射获取到实例的所有方法，然后再遍历方法列表，检测方法名是否具有 setter 方法特征。若有，则通过 `ObjectFactory` 获取依赖对象，最后通过反射调用 setter 方法将依赖设置到目标对象中。整个过程对应的代码如下：

```java
private T injectExtension(T instance) {
    try {
        if (objectFactory != null) {
            // 遍历目标类的所有方法
            for (Method method : instance.getClass().getMethods()) {
                // 检测方法是否以 set 开头，且方法仅有一个参数，且方法访问级别为 public
                if (method.getName().startsWith("set")
                    && method.getParameterTypes().length == 1
                    && Modifier.isPublic(method.getModifiers())) {
                    // 获取 setter 方法参数类型
                    Class<?> pt = method.getParameterTypes()[0];
                    try {
                        // 获取属性名，比如 setName 方法对应属性名 name
                        String property = method.getName().length() > 3 ? 
                            method.getName().substring(3, 4).toLowerCase() + 
                            	method.getName().substring(4) : "";
                        // 从 ObjectFactory 中获取依赖对象
                        Object object = objectFactory.getExtension(pt, property);
                        if (object != null) {
                            // 通过反射调用 setter 方法设置依赖
                            method.invoke(instance, object);
                        }
                    } catch (Exception e) {
                        logger.error("fail to inject via method...");
                    }
                }
            }
        }
    } catch (Exception e) {
        logger.error(e.getMessage(), e);
    }
    return instance;
}
```

在上面代码中，`objectFactory `变量的类型为 `AdaptiveExtensionFactory`，`AdaptiveExtensionFactory `内部维护了一个 `ExtensionFactory `列表，用于存储其他类型的 `ExtensionFactory`。Dubbo 目前提供了两种 `ExtensionFactory`，分别是 `SpiExtensionFactory `和 `SpringExtensionFactory`。前者用于创建自适应的拓展，后者是用于从 Spring 的 IOC 容器中获取所需的拓展。这两个类的类的代码不是很复杂，这里就不一一分析了。

## 📚 References

- [Dubbo SPI | Apache Dubbo 官方文档](https://dubbo.apache.org/zh/docs/v2.7/dev/source/dubbo-spi/#32-dubbo-ioc)
- [阿里面试真题：Dubbo的SPI机制_敖丙-CSDN博客](https://blog.csdn.net/qq_35190492/article/details/108256452)