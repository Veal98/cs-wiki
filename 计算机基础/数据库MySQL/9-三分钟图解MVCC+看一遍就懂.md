# 三分钟图解 MVCC，看一遍就懂

前文我们介绍了 InnoDB 存储引擎在事务隔离级别 **READ COMMITTED 和 REPEATABLE READ**（默认）下会开启一致性非锁定读，简单回顾下：所谓一致性非锁定读就是每行记录可能存在多个历史版本，多版本之间串联起来形成了一条版本链，这样不同时刻启动的事务可以**无锁**地访问到不同版本的数据。

## undo log 版本链

一致性非锁定读是通过 **MVCC（Multi Version Concurrency Control，多版本并发控制）** 来实现的。事实上，MVCC 没有一个统一的实现标准，所以各个存储引擎的实现机制不尽相同。

InnoDB 存储引擎中 MVCC 的实现是通过 **undo log** 来完成的，undo log 是啥？

简单理解，**undo log 就是每次操作的反向操作**，比如比如当前事务执行了一个插入 id = 100 的记录的操作，那么 undo log 中存储的就是删除 id = 100 的记录的操作。

所以，这里用多版本来形容并不是非常准确，因为 InnoDB 并不会真正地去开辟空间存储多个版本的行记录，只是借助 undo log 记录每次写操作的反向操作。

也就是说，B+ 索引树上对应的记录只会有一个最新版本，只不过 InnoDB 可以**根据 undo log 得到数据的历史版本**，从而实现多版本控制。

![](https://gitee.com/veal98/images/raw/master/img/20210920224337.png)

那么，还有个问题，undo log 是如何和某条行记录产生联系的呢？换句话说，我怎么能通过这条行记录找到它拥有的 undo log 呢？

具体来说，**InnoDB 存储引擎中每条行记录其实都拥有两个隐藏的字段：`trx_id` 和 `roll_pointer`**。

从名字也能看出来，`trx_id` 就是最近更新这条行记录的事务 ID，`roll_pointer` 就是指向之前生成的 undo log。

掏出我们的 user 表，来举个例子，假设 id = 100 的事务 A 插入一条行记录（id = 1, username = "Jack", age = 18），那么，这行记录的两个隐藏字段 `trx_id = 100`  和 `roll_pointer` 指向一个空的 undo log，因为在这之前并没有事务操作 id = 1 的这行记录。如图所示：

![](https://gitee.com/veal98/images/raw/master/img/20210923234807.png)

然后，id = 200 的事务 B 修改了这条行记录，把 age 从 18 修改成了 20，于是，这条行记录的 `trx_id` 就变成了 200，`rooll_pointer` 就指向事务 A 生成的 undo log ：

![](https://gitee.com/veal98/images/raw/master/img/20210924000838.png)

接着，id = 300 的事务 C 再次修改了这条行记录，把 age 从 20 修改成了 30，如下图：

![](https://gitee.com/veal98/images/raw/master/img/20210924000726.png)

可以看到，每次修改行记录都会更新 trx_id 和 roll_pointer 这两个隐藏字段，之前的多个数据快照对应的 undo log 会通过 roll_pointer 指针串联起来，从而形成一个**版本链**。

需要注意的是，**select 查询操作不会生成 undo log**！在 InnoDB 存储引擎中，undo log 只分为两种：

- insert undo log：在 insert 操作中产生的 undo log
- update undo log：对 delete 和 update 操作产生的 undo log

事实上，由于事务隔离性的要求，insert 操作的记录，只对事务本身可见，对其他事务不可见，对吧，所以也就不存在并发情况下的问题。所以，也就是说，**MVCC 这个机制，其实就是靠 update undo log 实现的**，和 insert undo log 基本上没啥关系，我们上面说的 undo log 版本链上的其实就是 update undo log。

## ReadView 机制

说到 MVCC，说到 undo log 版本链，如果你自己不往下说的话，八九不离十面试官都会问你下 ReadView 这个机制。

咱也不卖官子，直接说吧，**ReadView 机制就是用来判断当前事务能够看见哪些版本的**，一个 ReadView 主要包含如下几个部分：

- `m_ids`：生成 ReadView 时有哪些事务在执行但是还没提交的（称为 ”**活跃事务**“），这些活跃事务的 id 就存在这个字段里
- `min_trx_id`：m_ids 里最小的值
- `max_trx_id`：生成 ReadView 时 InnoDB 将分配给下一个事务的 ID 的值（事务 ID 是递增分配的，越后面申请的事务 ID 越大）
- `creator_trx_id`：当前创建 ReadView 事务的 ID

接下来，再掏出 user 表，通过一个例子来理解下 ReaView 机制是如何做到判断当前事务能够看见哪些版本的：

假设表中已经被之前的事务 A（id = 100）插入了一条行记录（id = 1, username = "Jack", age = 18），如图所示：

![](https://gitee.com/veal98/images/raw/master/img/20210923234807.png)

接下来，有两个事务 B（id = 200） 和 C（id = 300）过来**并发执行**，事务 B 想要更新（update）这行 id = 1 的记录，而事务 C（select）想要查询这行数据，这两个事务都执行了相应的操作但是还没有进行提交：

![](https://gitee.com/veal98/images/raw/master/img/20210924183516.png)

如果现在事务 B 开启了一个 ReadView，在这个 ReadView 里面：

- `m_ids` 就包含了当前的活跃事务的 id，即事务 B 和事务 C 这两个 id，200 和 300
- `min_trx_id` 就是 200
- `max_trx_id` 是下一个能够分配的事务的 id，那就是 301
- `creator_trx_id` 是当前创建 ReadView 事务 B 的 id 200

![](https://gitee.com/veal98/images/raw/master/img/20210924183529.png)

现在事务 B 进行第一次查询（上面说过 select 操作不会生成 undo log 的哈），会**把这行记录的隐藏字段 `trx_id` 和 ReadView 的 `min_trx_id` 进行下判断**，此时，发现 trx_id 是 100，小于 ReadView 里的 `min_trx_id`（200），这说明在事务 B 开始之前，修改这行记录的事务 A 已经提交了，所以**开始于事务 A 提交之后的事务 B、是可以查到事务 A 对这行记录的更新的**。

```java
row.trx_id < ReadView.min_trx_id
```

![](https://gitee.com/veal98/images/raw/master/img/20210924183655.png)

接着事务 C 过来修改这行记录，把 age = 18 改成了 age = 20，所以这行记录的 `trx_id` 就变成了 300，同时 `roll_pointer` 指向了事务 C 修改之前生成的 undo log：

![](https://gitee.com/veal98/images/raw/master/img/20210924183846.png)

那这个时候事务 B 再次进行查询操作，会发现**这行记录的 `trx_id`（300）大于 ReadView 的 `min_trx_id`（200），并且小于 `max_trx_id`（301）**。

```java
row.trx_id > ReadView.min_trx_id && row.trx_id < max_trx_id
```

这说明一个问题，就是更新这行记录的事务很有可能也存在于 ReadView 的 m_ids（活跃事务）中。所以事务 B 会去判断下 ReadView 的 m_ids 里面是否存在 `trx_id = 300` 的事务，显然是存在的，这就表示这个 id = 300 的事务是跟自己（事务 B）在同一时间段并发执行的事务，也就说明这行 age = 20 的记录事务 B 是不能查询到的。

![](https://gitee.com/veal98/images/raw/master/img/20210924201851.png)

既然无法查询，那该咋整？事务 B 这次的查询操作能够查到啥呢？

没错，undo log 版本链！

这时事务 B 就会顺着这行记录的 roll_pointer 指针往下找，就会找到最近的一条 `trx_id = 100` 的 undo log，而自己的 id 是 200，即说明这个 trx_id = 100 的 undo log 版本必然是在事务 B 开启之前就已经提交的了。所以事务 B 的这次查询操作读到的就是这个版本的数据即 age = 18。

通过上述的例子，我们得出的结论是，**通过 undo log 版本链和 ReadView 机制，可以保证一个事务不会读到并发执行的另一个事务的更新**。

<br>

那自己修改的值，自己能不能读到呢？

这当然是废话，肯定可以读到呀。不过上面的例子我们只涉及到了 ReadView 中的前三个字段，而 `creator_trx_id` 就与自己读自己的修改有关，所以这里还是图解出来让大家更进一步理解下 ReadView 机制：

假设事务 C 的修改已经提交了，然后事务 B 更新了这行记录，把 age = 20 改成了 age = 66，如下图所示：

![](https://gitee.com/veal98/images/raw/master/img/20210924203315.png)

然后，事务 B 再来查询这条记录，发现 `trx_id = 200` 与 ReadView 里的 `creator_trx_id = 200` 一样，这就说明这是我自己刚刚修改的啊，当然可以被查询到。

```java
row.trx_id = ReadView.creator_trx_id
```

![](https://gitee.com/veal98/images/raw/master/img/20210924203635.png)

那如果在事务 B 的执行期间，突然开了一个 id = 400 的事务 D，然后更新了这行记录的 age = 88 并且还提交了，然后事务 B 再去读这行记录，能读到吗？

![](https://gitee.com/veal98/images/raw/master/img/20210924205057.png)

答案是不能的。

因为这个时候事务 B 再去查询这行记录，就会发现 `trx_id = 500` 大于 ReadView 中的 `max_trx_id = 301`，这说明事务 B 执行期间，有另外一个事务更新了数据，所以不能查询到另外一个事务的更新。

```java
row.trx_id > ReadView.max_trx_id
```

![](https://gitee.com/veal98/images/raw/master/img/20210924205212.png)

那通过上述的例子，我们得出的结论是，**通过 undo log 版本链和 ReadView 机制，可以保证一个事务只可以读到该事务自己修改的数据或该事务开始之前的数据**。

## 小结

总结下，通过 undo log 版本链和 ReadView 机制：

- 可以保证一个事务不会读到并发执行的另一个事务的更新
- 可以保证一个事务只可以读到该事务自己修改的数据或该事务开始之前的数据

另外，前文说过，一致性非锁定读（或者直接说 MVCC 吧，毕竟一致性非锁定读也是靠 MVCC 实现的）只在事务隔离级别 READ COMMITTED 和 REPEATABLE READ（默认）下才会开启，那对于这两个隔离级别，其实最根本的不同之处，就在于它们**生成 ReadView 的时机不同**，这个我们留在下文解释~



