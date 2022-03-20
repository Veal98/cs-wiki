# 🔋 Buffer 详解

---

正如我们先前所指出的，**网络数据的基本单位永远是 byte(字节)**。Java NIO 提供 `ByteBuffer` 作为字节的容器，但这个类是过于复杂，有点难以使用。

Netty 中 `ByteBuffer ` 的替代是 `ByteBuf`，一个强大的实现，解决 JDK 的 API 的限制，以及为网络应用程序开发者一个更好的工具。 但 `ByteBuf `并不仅仅暴露操作一个字节序列的方法; 这也是专门的 Netty 的 `ChannelPipeline ` 的语义设计。

在本章中，我们会说明相比于 JDK 的 API，`ByteBuf` 所提供的卓越的功能和灵活性。这也将使我们能够更好地理解了 Netty 的数据处理。

## 1. Buffer API

主要包括

- `ByteBuf`
- `ByteBufHolder`

Netty 使用 **reference-counting (引用计数)** 来判断何时可以释放 `ByteBuf `或 `ByteBufHolder `和其他相关资源，从而可以利用池和其他技巧来提高性能和降低内存的消耗。这一点上不需要开发人员做任何事情，但是**在开发 Netty 应用程序时，尤其是使用 `ByteBuf `和 `ByteBufHolder `时，你应该尽可能早地释放池资源**。 

> 💡 **引用计数**：学习过 JVM 的小伙伴应该知道垃圾回收有<u>引用计数法</u>和<u>可达性分析</u>这两种算法判断对象是否存活，Netty 就使用了 引用计数法来优化内存的使用。引用计数确保了当对象的引用计数大于 1 时，对象就不会被释放，当计数减少至 0 时， 对象就会被释放，如果程序访问一个已被释放的引用计数对象，那么将会导致一个  `IllegalReferenceCountException` 异常。 在 Netty 中，`ByteBuf` 和 `ByteBufHolder` 都实现了 `ReferenceCounted` 接口。

Netty 的 `Buffer` API 提供了几个优势：

- 可以自定义缓冲类型
- 通过一个内置的复合缓冲类型实现零拷贝
- 扩展性好，比如 `StringBuilder`
- 不需要调用 `flip()` 来切换读/写模式
- 读取和写入索引分开
- 方法链
- 引用计数
- Pooling (池)

## 2. ByteBuf — Netty 字节数据的容器

`ByteBuf` 是一个很好的经过优化的数据容器，我们可以将字节数据有效的添加到 `ByteBuf` 中或从 `ByteBuf` 中获取数据。`ByteBuf` 有 2 部分：一个用于读，一个用于写。我们可以按顺序的读取数据，也可以通过调整读取数据的索引或者直接将读取位置索引作为参数传递给 get 方法来重复读取数据。

### ① ByteBuf 如何在工作

**`ByteBuf` 维护了两个不同的索引：一个是用于读取的 `readerIndex `， 一个是用于写入的 `writerIndex`。**

写入数据到 `ByteBuf` 后，`writerIndex`（写入索引）增加。开始读字节后，`readerIndex`（读取索引）增加。你可以读取字节，**直到写入索引和读取索引处在相同的位置，`ByteBuf ` 变为不可读**。当访问数据超过数组的最后位，则会抛出 `IndexOutOfBoundsException`。

⭐ 调用 `ByteBuf `的 "`read`" 或 "`write`" 开头的任何方法都会提升 相应的索引。另一方面，<u>"`set`" 、 "`get`"操作字节将不会移动索引位置，他们只会操作相关的通过参数传入方法的相对索引</u>。

可以给 `ByteBuf` 指定一个最大容量值，这个值限制着 `ByteBuf` 的容量。任何尝试将写入索引超过这个值的行为都将导致抛出异常。`ByteBuf` 的默认最大容量限制是 `Integer.MAX_VALUE`。

`ByteBuf `类似于一个字节数组，最大的区别是读和写的索引可以用来控制对缓冲区数据的访问。下图显示了一个容量为16的空的 `ByteBuf ` 的布局和状态，`writerIndex ` 和 `readerIndex ` 都在索引位置 0 ：

![](https://gitee.com/veal98/images/raw/master/img/20201211212110.png)

### ② ByteBuf 使用模式

`ByteBuf` 有多种使用模式，我们可以根据需求构建不同使用模式的 `ByteBuf`。

#### Ⅰ HEAP BUFFER (堆缓冲区)

**最常用的模式是 `ByteBuf` 将数据存储在 JVM 的堆空间，实际上是通过数组存储数据， 所以这种模式被称为支撑数组（Backing Array ）**。堆缓冲区可以在没有使用池化的情况下快速分配和释放，非常适合用来处理遗留数据的。它还提供了直接访问数组的方法，通过 `ByteBuf.array()` 来获取 `byte[]` 数据。 

![](https://gitee.com/veal98/images/raw/master/img/20201211212321.png)

#### Ⅱ DIRECT BUFFER (直接缓冲区)

在 Java 中，我们创建的对象大部分都是存储在堆区之中的，但这不是绝对的。

在 NIO 的 API 中， **允许 Buffer 分配直接内存，即操作系统的内存**。

这样做的**好处**非常明显： 前面在传输章节介绍过的零拷贝技术的 特点之一就是规避了多次 IO 拷贝。现在数据直接就在直接内存中，而不是在JVM应用进程中，这不仅减少了拷贝次数， 还减少了用户态与内核态的上下文切换。 

直接缓冲区的**缺点**也比较明显： <u>直接内存的分配和释放都较为昂贵，而且因为直接缓冲区的数据不是在堆区的，所以我们在某些时候可能需要将直接缓冲区的数据先拷贝一个副本到堆区， 再对这个副本进行操作</u>。 与支撑数组相比，直接缓冲区的工作可能更多，所以**如果事先知道数据会作为一个数组来被访问，那么我们应该使用堆内存**。

![](https://gitee.com/veal98/images/raw/master/img/20201211212809.png)

#### Ⅲ COMPOSITE BUFFER (复合缓冲区)

最后一种模式是复合缓冲区，我们可以创建多个不同的 `ByteBuf`，然后提供一个这些 `ByteBuf` 组合的视图 `CompositeByteBuf`。我们可以动态的向 `CompositeByteBuf` 中添加和删除其中的 `ByteBuf` 实例，JDK 的 `ByteBuffer` 没有这样的功能。

⚠ 警告：`CompositeByteBuf.hasArray()` 总是返回 false，因为它可能既包含堆缓冲区，也包含直接缓冲区

例如，一条消息由 header 和 body 两部分组成，将 header 和 body 组装成一条消息发送出去，可能 body 相同，只是 header 不同，使用 `CompositeByteBuf` 就不用每次都重新分配一个新的缓冲区。下图显示`CompositeByteBuf `组成 header 和 body：

![](https://gitee.com/veal98/images/raw/master/img/20201211213241.png)

下面代码显示了使用 **JDK 的 `ByteBuffer` 的一个实现**。两个 `ByteBuffer `的数组创建保存消息的组件，第三个创建用于保存所有数据的副本。

```java
// 使用数组保存消息的各个部分
ByteBuffer[] message = { header, body };

// 使用副本来合并这两个部分
ByteBuffer message2 = ByteBuffer.allocate(
        header.remaining() + body.remaining());
message2.put(header);
message2.put(body);
message2.flip();
```

这种做法显然是低效的，分配和复制操作不是最优的方法，操纵数组使代码显得很笨拙。

下面看使用 `CompositeByteBuf` 的改进版本：

```java
ByteBuf headerBuf = ...; // 可以是堆缓冲区或直接缓冲区
ByteBuf bodyBuf = ...; // 可以是堆缓冲区或直接缓冲区
// 追加 ByteBuf 实例的 CompositeByteBuf
CompositeByteBuf messageBuf = ...;
messageBuf.addComponents(headerBuf, bodyBuf);
// ....
messageBuf.removeComponent(0); // 移除头

// 遍历所有 ByteBuf 实例
for (int i = 0; i < messageBuf.numComponents(); i++) {                        //3
    System.out.println(messageBuf.component(i).toString());
}
```

## 3. 字节级别的操作

除了基本的读写操作， `ByteBuf` 还提供了它所包含的数据的修改方法。

### ① 随机访问索引

`ByteBuf `使用从 0 开始的索引，第一个字节的索引是 0，最后一个字节的索引是 `ByteBuf `的 capacity - 1，下面代码是遍历 `ByteBuf` 的所有字节：

```java
ByteBuf buffer = ...;
for (int i = 0; i < buffer.capacity(); i++) {
    byte b = buffer.getByte(i);
    System.out.println((char) b);
}
```

⚠ 注意：通过索引访问时不会自动推进 `readerIndex` （读索引）和 `writerIndex`（写索引），当然我们可以通过 `ByteBuf ` 的 `readerIndex(index)` 或 `writerIndex(index) `来分别推进读索引或写索引

JDK 的 `ByteBuffer` 只有一个索引 position，所以当 `ByteBuffer` 在读和写模式之间切换时，需要使用 `flip` 方法。 而 `ByteBuf` 同时具有读索引和写索引，则无需切换模式，在 `ByteBuf` 内部，其索引满足：

```text
0 <= readerIndex <= writerIndex <= capacity
```

当使用`readerIndex`读取字节，或使用`writerIndex`写入字节时，`ByteBuf `内部的分段大致如下：

<img src="https://gitee.com/veal98/images/raw/master/img/20201211214409.png" style="zoom: 55%;" />

### ② ByteBuf 内部分段

上图介绍了在`ByteBuf`内部大致有3个分段，接下来我们就详细的介绍下这三个分段。

#### Ⅰ 可丢弃字节 Discardable Bytes

当`readerIndex`读取一部分字节后，之前读过的字节就属于已读字节，可以被丢弃了，通过调用 `ByteBuf`的`discardReadBytes`方法我们可以丢弃这个分段，**丢弃这个分段实际上是删除这个分段的已读字节， 然后回收这部分空间加入可写入字节**：

<img src="https://gitee.com/veal98/images/raw/master/img/20201211214652.png" style="zoom:50%;" />

#### Ⅱ 可读取字节 Readable Bytes

`ByteBuf`的可读字节分段存储了尚未读取的字节，我们可以使用`readBytes`等方法来读取这部分数据，如果我们读取的范围超过了可读字节分段，那么`ByteBuf`会抛出`IndexOutOfBoundsException`异常，所以**在读取数据之前，我们 需要使用`isReadable`方法判断是否仍然有可读字节分段**。

#### Ⅲ 可写入字节 Writable Bytes

可写字节分段即没有被写入数据的区域，我们可以使用`writeBytes`等方法向可写字节分段写入数据，如果我们写入 的字节超过了`ByteBuf`的容量，那么`ByteBuf`也会抛出`IndexOutOfBoundsException`异常。

### ③ 索引管理

我们可以通过`markReaderIndex`，`markWriterIndex`方法来标记当前`readerIndex`和`writerIndex`的位置， 然后使用`resetReaderIndex`，`resetWriterIndex`方法来将`readerIndex`和`writerIndex`重置为之前标记过的 位置。

<u>我们还可以使用`clear`方法来将`readerIndex`和`writerIndex`重置为0，但是`clear`方法并不会清空`ByteBuf`的内容</u>，下面`clear`方法的实现：

![](https://gitee.com/veal98/images/raw/master/img/20201211215131.png)

其过程是这样的：

<img src="https://gitee.com/veal98/images/raw/master/img/20201211215154.png" style="zoom:50%;" />

由于调用clear后，数据并没有被清空，但整个`ByteBuf`仍然是可写的，这比`discardReadBytes`轻量的多， `DiscardReadBytes`还要回收已读字节空间。

### ④ 查找操作

在`ByteBuf`中，有多种可以确定值的索引的方法，最简单的方法是使用`ByteBuf`的`indexOf`方法。 

较为复杂的查找可以通过`ByteBuf`的`forEachByte`方法，`forEachByte`方法所需的参数是`ByteProcessor`， 但我们无需去实现`ByteProcessor`，因为`ByteProcessor`已经为我们定义好了两个易用的实现。

下面例子展示了寻找一个回车符，`\ r`的一个例子：

```java
ByteBuf buffer = ...;
int index = buffer.forEachByte(ByteBufProcessor.FIND_CR);
```

### ⑤ 衍生缓冲区

衍生缓冲区是专门展示`ByteBuf`内部数据的视图，这种视图是由 `duplicate()`, `slice()`, `slice(int, int)`,`readOnly()`, 和 `order(ByteOrder)` 方法创建的

🚨 这些方法都将以源`ByteBuf`创建一个新的`ByteBuf`视图，所以源`ByteBuf`内部的索引和数据都与视图一样， 但这也意味着修改了视图的内容，也会修改源`ByteBuf`的内容。即**源 `ByteBuf` 和视图数据共享**。举个例子，若需要操作某段数据，使用 `slice(int, int)`：

```java
Charset utf8 = Charset.forName("UTF-8");
// 创建一个 ByteBuf 保存特定字节串
ByteBuf buf = Unpooled.copiedBuffer("Netty in Action rocks!", utf8); //1

// 创建从索引 0 开始，并在 14 结束的新 ByteBuf 视图
ByteBuf sliced = buf.slice(0, 14);
System.out.println(sliced.toString(utf8));

// 更新源 Bytebuf 索引 0 的字节
buf.setByte(0, (byte) 'J');

// true：源 Bytebuf 更新，视图也会更新
assert buf.getByte(0) == sliced.getByte(0);
```

如果我们需要一个真实的`ByteBuf`的副本， 我们应该使用`copy`方法来创建，`copy`方法创建的副本拥有独立的内存，不会影响到源`ByteBuf`：

```java
Charset utf8 = Charset.forName("UTF-8");
// 创建一个 ByteBuf 保存特定字节串
ByteBuf buf = Unpooled.copiedBuffer("Netty in Action rocks!", utf8);     //1

// 创建从索引 0 开始，并在 14 结束的新 ByteBuf 拷贝
ByteBuf copy = buf.copy(0, 14); 
System.out.println(copy.toString(utf8));

// 更新源 Bytebuf 索引 0 的字节
buf.setByte(0, (byte) 'J');

// false：源 Bytebuf 和拷贝副本互不影响
assert buf.getByte(0) != copy.getByte(0);
```

### ⑥ 读/写操作

读/写操作主要由2类：

- `get()/set()` 操作从给定的索引开始，保持不变
- `read()/write()` 操作从给定的索引开始，与字节访问的数量来适用，递增当前的写索引或读索引

#### Ⅰ get/set

`ByteBuf `的各种读写方法或其他一些检查方法可以看 ByteBuf 的 API，下面是常见的 `get()` 操作：

| 方法名称                                    | 描述                                  |
| ------------------------------------------- | ------------------------------------- |
| `getBoolean(int)`                           | 返回当前索引的 Boolean 值             |
| `getByte(int)` , `getUnsignedByte(int)`     | 返回当前索引的(无符号)字节            |
| `getMedium(int)` , `getUnsignedMedium(int)` | 返回当前索引的 (无符号) 24-bit 中间值 |
| `getInt(int)` , `getUnsignedInt(int)`       | 返回当前索引的(无符号) 整型           |
| `getLong(int)`, `getUnsignedLong(int)`      | 返回当前索引的 (无符号) Long 型       |
| `getShort(int)` , `getUnsignedShort(int)`   | 返回当前索引的 (无符号) Short 型      |
| `getBytes(int, ...)`                        | 字节                                  |

常见 `set()` 操作如下：

| 方法名称                   | 描述                                |
| -------------------------- | ----------------------------------- |
| `setBoolean(int, boolean)` | 在指定的索引位置设置 Boolean 值     |
| `setByte(int, int)`        | 在指定的索引位置设置 byte 值        |
| `setMedium(int, int)`      | 在指定的索引位置设置 24-bit 中间 值 |
| `setInt(int, int)`         | 在指定的索引位置设置 int 值         |
| `setLong(int, long)`       | 在指定的索引位置设置 long 值        |
| `setShort(int, int)`       | 在指定的索引位置设置 short 值       |

下面是用法：

```java
Charset utf8 = Charset.forName("UTF-8");
// 创建一个新的 ByteBuf 给指定 String 保存字节
ByteBuf buf = Unpooled.copiedBuffer("Netty in Action rocks!", utf8);
// 打印的第一个字符，`N`
System.out.println((char)buf.getByte(0));

// 存储当前 readerIndex 和 writerIndex
int readerIndex = buf.readerIndex(); 
int writerIndex = buf.writerIndex();

// 更新索引 0 的字符 `B`
buf.setByte(0, (byte)'B');

// 打印出的第一个字符，现在是 `B`
System.out.println((char)buf.getByte(0));

// 断言成功，因为setByte 和 getByte 永远不会改变索引
assert readerIndex == buf.readerIndex();
assert writerIndex ==  buf.writerIndex();
```

#### Ⅱ read/write

现在，让我们来看看 `read()` 操作，对当前 `readerIndex `或 `writerIndex `进行操作。这些用于从 `ByteBuf `读取就好像它是一个流。下面展示了常见的 `read()` 方法：

| 方法名称                                | 描述                                                         |
| --------------------------------------- | ------------------------------------------------------------ |
| `readBoolean()`                         | Reads the Boolean value at the current readerIndex and increases the readerIndex by 1. |
| `readByte()　`, `readUnsignedByte()`    | Reads the (unsigned) byte value at the current readerIndex and increases　the readerIndex by 1. |
| `readMedium()`,　`readUnsignedMedium()` | Reads the (unsigned) 24-bit medium value at the current readerIndex and　increases the readerIndex by 3. |
| `readInt()`,　`readUnsignedInt()`       | Reads the (unsigned) int value at the current readerIndex and increases　the readerIndex by 4. |
| `readLong()`,　`readUnsignedLong()`     | Reads the (unsigned) int value at the current readerIndex and increases　the readerIndex by 8. |
| `readShort()`,　`readUnsignedShort()`   | Reads the (unsigned) int value at the current readerIndex and increases　the readerIndex by 2. |
| `readBytes(int,int, ...)`               | Reads the value on the current readerIndex for the given length into the　given object. Also increases the readerIndex by the length. |

每个 `read()` 方法都对应一个`write()`。下面展示了常见的 `write()` 方法：

| 方法名称                | 描述                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `writeBoolean(boolean)` | Writes the Boolean value on the current writerIndex and increases the　writerIndex by 1. |
| `writeByte(int)`        | Writes the byte value on the current writerIndex and increases the　writerIndex by 1. |
| `writeMedium(int)`      | Writes the medium value on the current writerIndex and increases the　writerIndex by 3. |
| `writeInt(int)`         | Writes the int value on the current writerIndex and increases the　writerIndex by 4. |
| `writeLong(long)`       | Writes the long value on the current writerIndex and increases the　writerIndex by 8. |
| `writeShort(int)`       | Writes the short value on the current writerIndex and increases thewriterIndex by 2. |
| `writeBytes(int，...）` | Transfers the bytes on the current writerIndex from given resources. |

下面是用法：

```java
Charset utf8 = Charset.forName("UTF-8");
// 创建一个新的 ByteBuf 保存给定 String 的字节。
ByteBuf buf = Unpooled.copiedBuffer("Netty in Action rocks!", utf8);
// 打印的第一个字符，`N`
System.out.println((char)buf.readByte());

// 存储当前的 readerIndex 和 writerIndex
int readerIndex = buf.readerIndex();
int writerIndex = buf.writerIndex();

// 更新索引 0 的字符 `B`
buf.writeByte((byte)'?');

// 断言成功，因为 writeByte() 移动了 writerIndex
assert readerIndex == buf.readerIndex();
assert writerIndex != buf.writerIndex();
```

## 4. ByteBufHolder

从表面理解起来，**`ByteBufHolder`是`ByteBuf`的持有者**，的确没有错。 

**`ByteBuf`几乎唯一的作用就是存储数据，但在实际的数据传输中，除了数据，我们可能还需要存储各种属性值**，Http便是一个很好的例子。 除了Http Content，还包括状态码，cookie等等属性，总不能把这些属性与Content存储在一个ByteBuf中吧， 所以Netty提供了`ByteBufHolder`。`ByteBufHolder`为Netty提供了高级特性的支持，如缓冲区持化，使得可以从池中借用`ByteBuf`，并且在需要的时候自动释放。

以下是`ByteBufHolder`常见的方法：

- `content`: 返回这个`ByteBufHolder`所持有的`ByteBuf`。
- `copy`： 返回`ByteBufHolder`的深拷贝，连它持有的`ByteBuf`也拷贝。

## 5. ByteBuf 分配

前面介绍了ByteBuf的一些基本操作和原理，但却并未说明如何分配一个`ByteBuf`，这里将讲解`ByteBuf`的分配方式。

### ① ByteBufAllocator

为了减少分配和释放内存的开销，Netty通过 `ByteBufAllocator `实现了`ByteBuf`的**池化**。以下是`ByteBufAllocator `的常见方法。

- `buffer`: 返回一个基于堆或直接内存的ByteBuf，具体取决于实现。
- `heapBuffer`： 返回一个基于堆内存的ByteBuf。
- `directBuffer`： 返回一个基于直接内存的ByteBuf。
- `compositeBuffer`： 返回一个组合ByteBuf。
- `ioBuffer`： 返回一个用于套接字的ByteBuf。

我们可以通过`Channel`或`ChannelHandlerContext`的`alloc`方法获取到一个`ByteBufAllocator`

![](https://gitee.com/veal98/images/raw/master/img/20201211222412.png)

Netty提供了两种`ByteBufAllocator`的实现： `PooledByteBufAllocator`和`UnpooledByteBufAllocator`。 `PooledByteBufAllocator`池化了`ByteBuf`的实例以提高性能并最大限度的减少内存碎片，此实现的分配内存的方法 是使用 [jemalloc](https://people.freebsd.org/~jasone/jemalloc/bsdcan2006/jemalloc.pdf)，此种 方法分配内存的效率非常高，已被大量现代操作系统采用。 `UnpooledByteBufAllocator`则不会池化`ByteBuf`， Netty默认使用的是`PooledByteBufALlocator`。

### ② Unpooled 非池化

当`Channel`或`ChannelHandlerContext`未引用`ByteBufAllocator`时，就无法使用`ByteBufAllocator`来分配 `ByteBUf`，对于这种情况，Netty提供了`Unpooled`工具类，它提供了一系列的**静态方法**来分配**未池化**的`ByteBuf`。

### ③ ByteBufUtil

`ByteBufUtil`是`ByteBuf`的一个工具类，它提供大量操作`ByteBuf`的方法，，其中非常重要的一个方法就是 `hexDump`，这个方法会以16进制的形式来表示`ByteBuf`的内容。另一个很重要的方法是`equals`，它被用于判断 `ByteBuf`之间的相等性。

## 📚 References

- [Essential Netty in Action 《Netty 实战(精髓)》](https://waylau.com/essential-netty-in-action/GETTING%20STARTED/A%20Closer%20Look%20at%20ChannelHandlers.html)
- [framework-learning](https://qsjzwithguang19forever.gitee.io/framework-learning/gitbook_doc/netty-learning/ByteBuf%E5%AE%B9%E5%99%A8.html)

