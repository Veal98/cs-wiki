## 🍪【三】关系数据库标准语言SQL

> 数据字典：数据字典是关系数据库管理系统内部的一组系统表，它记录了数据库中所有的定义信息，包括关系模式定义、视图定义、索引定义、完整性约束定义、各类用户对数据库的操作权限、统计信息等。关系数据库管理系统在执行SQL的数据定义语句时，实际上就是在更新数据字典中的相应信息

## 1. 数据库创建与使用 CREATE / US

```sql
CREATE DATABASE test;
USE test;
```

## 2. 创建表 CREATE

```sql
CREATE TABLE mytable (
  # int 类型，不为空，自增
  id INT NOT NULL AUTO_INCREMENT,
  # int 类型，不可为空，默认值为 1，不为空
  col1 INT NOT NULL DEFAULT 1,
  # 变长字符串类型，最长为 45 个字符，可以为空
  col2 VARCHAR(45) NULL,
  # 日期类型，可为空
  col3 DATE NULL,
  # 设置主键为 id
  PRIMARY KEY (`id`)
  # 定义外键,被参照表是mytable2
  FOREIGN KEY(col1) REFERENCES mytable2(col1)
);
```

SQL标准支持多种数据类型：

![](https://gitee.com/veal98/images/raw/master/img/20200417164206.png)

## 3. 修改基本表 ALTER

```sql
# 添加列
ALTER TABLE mytable
ADD col CHAR(20);

# 删除列
ALTER TABLE mytable
DROP COLUMN col [CASCADE | RESTRICT];
# CASCADE表示级联删除
# RESTRICT表示如果被其他对象引用，则拒绝执行该操作

# 删除表
DROP TABLE mytable;
```

示例：

- 向Student表中添加入学时间列

  ```sql
  alter table student add entrance_date DATE;
  ```
  
- 将年龄的数据类型由字符型转为整数
  
  ```sql
  alter table student alter column age INT;
  ```
  
- 增加课程名称必须取唯一值的约束条件

  ```sql
  alter table student add unique(cname);
  ```


## 4. 插入 INSERT INTO

```sql
# 普通插入
INSERT INTO mytable(col1, col2)
VALUES(val1, val2);

# 插入检索出来的数据
INSERT INTO mytable1(col1, col2)
SELECT col1, col2
FROM mytable2;

# 将一个表的内容插入到一个新表
CREATE TABLE newtable AS
SELECT * FROM mytable;
```

## 5. 更新 UPDATE

```sql
UPDATE mytable
SET col = val
WHERE id = 1;
```

## 6. 删除 DELETE

```sql
DELETE FROM mytable
WHERE id = 1;

# TRUNCATE TABLE 可以清空表，也就是删除所有行。
TRUNCATE TABLE mytable;
```

## 7. 查询 SELECT

```sql
select [all | distinct] 目标列名1，目标列名2...
from 表名或视图名1，表名或视图名2... | select语句 as 别名
[where 条件表达式]
[group by 列名 [having 条件表达式]]
[oeder by 列名 [asc | desc]];
```

### DISTINCT 去除重复记录

相同值只会出现一次。它作用于所有列，也就是说所有列的值都相同才算相同。

```sql
SELECT DISTINCT col1, col2
FROM mytable;
```

### LIMIT 限制结果数量子句

限制返回的行数。可以有两个参数，第一个参数为起始行，`从 0 开始`；第二个参数为返回的总行数。

```sql
# 返回前 5 行：
SELECT *
FROM mytable
LIMIT 5;

SELECT *
FROM mytable
LIMIT 0, 5;

# 返回第 3 ~ 5 行：
SELECT *
FROM mytable
LIMIT 2, 3;
```

## 8. 排序 ORDER BY

- `ASC` ：升序（默认）
- `DESC` ：降序



可以按多个列进行排序，并且为每个列指定不同的排序方式：

```sql
SELECT *
FROM mytable
ORDER BY col1 DESC, col2 ASC;
```

## 9. 通配符 Like

通配符也是用在过滤语句中，但它只能用于文本字段。

- `% 匹配 >=0 个任意字符`；
- `_ 匹配 ==1 个任意字符`；
- `[ ] 可以匹配集合内的字符`，例如 [ab] 将匹配字符 a 或者 b。
- `用脱字符 ^ 可以对其进行否定`，也就是不匹配集合内的字符。



使用 `Like`来进行通配符匹配。

```sql
SELECT *
FROM mytable
WHERE col LIKE '[^AB]%'; -- 不以 A 和 B 开头的任意文本
Copy to clipboardErrorCopied
```



不要滥用通配符，通配符位于开头处匹配会非常慢。

## 10. 计算字段

在数据库服务器上完成数据的转换和格式化的工作往往比客户端上快得多，并且转换和格式化后的数据量更少的话可以减少网络通信量。



**计算字段通常需要使用 `AS` 来取别名，否则输出的时候字段名为计算表达式。**



```sql
SELECT col1 * col2 AS alias
FROM mytable;
```



`CONCAT()`用于连接两个字段。

许多数据库会使用空格把一个值填充为列宽，因此连接的结果会出现一些不必要的空格，

使用 `TRIM()` 可以去除首尾空格。



```sql
SELECT CONCAT(TRIM(col1), '(', TRIM(col2), ')') AS concat_col
FROM mytable;
```

## 11. 聚集函数

各个 DBMS 的函数都是不相同的，因此不可移植，以下主要是 MySQL 的函数。

![](https://gitee.com/veal98/images/raw/master/img/20200417154133.png)



使用 DISTINCT 可以汇总不同的值。

```sql
SELECT AVG(DISTINCT col1) AS avg_col
FROM mytable;
```

## 12. 分组 GROUP BY，HAVING

分组：把具有相同的数据值的行放在同一组中。

可以对同一分组数据使用汇总函数进行处理，例如求分组数据的平均值等。

指定的分组字段除了能按该字段进行分组，也会自动按该字段进行排序。

```sql
SELECT col, COUNT(*) AS num
FROM mytable
GROUP BY col;
```



**`GROUP BY` 自动按分组字段进行排序，`ORDER BY` 也可以按汇总字段来进行排序。**

> - **GROUP BY 子句出现在 WHERE 子句之后，ORDER BY 子句之前**;
> - 除了汇总字段外，`SELECT 语句中的每一字段都必须在 GROUP BY 子句中给出`；
> - NULL 的行会单独分为一组；



```sql
SELECT col, COUNT(*) AS num
FROM mytable
where col > 2
GROUP BY col
ORDER BY num;
```



**`WHERE` 过滤行，`HAVING` 过滤分组，行过滤应当先于分组过滤。**

> having 与 where 功能、用法相同，**执行时机不同**。
>
> where 在开始时执行检测数据，对原数据进行过滤。
>
> **having 对筛选出的结果再次进行过滤**。
>
> having 字段必须是查询出来的，where 字段必须是数据表存在的。
>
> **where 不可以使用字段的别名，having 可以。因为执行WHERE代码时，可能尚未确定列值。**
>
> where 不可以使用合计函数。一般需用合计函数才会用 having
>
> SQL标准要求`HAVING必须引用GROUP BY子句中的列或用于合计函数中的列`。



```sql
SELECT col, COUNT(*) AS num
FROM mytable
WHERE col > 2
GROUP BY col
HAVING num >= 2;
```

## 13. 子查询

**子查询需用括号包裹。**



下面的语句可以检索出客户的订单数量，子查询语句会对第一个查询检索出的每个客户执行一次：



```sql
SELECT cust_name, (SELECT COUNT(*)
                   FROM Orders
                   WHERE Orders.cust_id = Customers.cust_id)
                   AS orders_num
FROM Customers
ORDER BY cust_name;
```



### FROM  型

- `from子查询返回一个表，表型子查询`。
- **from后要求是一个表，必须给子查询结果取个别名**。
- 简化每个查询内的条件。
- from型需将结果生成一个临时表格，可用以原表的锁定的释放。

```sql
select * from (select * from tb where id>0) as subfrom where id>1;
```



### WHERE 型

- `where子查询返回一个值，标量子查询`。
- 不需要给子查询取别名。
- where子查询内的表，不能直接用以更新。



```sql
select * from tb where money = (select max(money) from tb);
```



1. **列子查询**

- 如果**子查询结果返回的是一列**，使用 `in 或 not in`  将子查询的结果作为 WHRER 语句的过滤条件

- `exists 和 not exists` 条件，如果子查询返回数据，则返回1或0。常用于判断条件。

```sql
SELECT * FROM mytable1
WHERE col1 IN (SELECT col2 FROM mytable2);

select column1 from t1 where exists (select * from t2);
```



2. **行子查询**
   **查询条件是一个行**。
   行构造符：(col1, col2, ...) 或 ROW(col1, col2, ...)
   行构造符通常用于与对能返回两个或两个以上列的子查询进行比较。

```sql
select * from t1 where (id, gender) in (select id, gender from t2);
```

## 14. 连接 JOIN ON

连接用于连接多个表，使用 `JOIN` 关键字，并且条件语句使用 `ON` 而不是 WHERE。



连接可以替换子查询，并且比子查询的效率一般会更快。



可以用 AS 给列名、计算字段和表名取别名，给表名取别名是为了简化 SQL 语句以及连接相同表。



### 内连接 INNER JOIN

内连接又称等值连接，使用 INNER JOIN 关键字。

```sql
SELECT A.value, B.value
FROM tablea AS A INNER JOIN tableb AS B
ON A.key = B.key;
```



等同于

```sql
SELECT A.value, B.value
FROM tablea AS A, tableb AS B
WHERE A.key = B.key;
```



### 自连接 INNER JOIN

**自连接可以看成内连接的一种，只是连接的表是自身而已。**



一张员工表，包含员工姓名和员工所属部门，要找出与 Jim 处在同一部门的所有员工姓名。



- 子查询版本

```sql
SELECT name FROM employee
WHERE department = (
      SELECT department
      FROM employee
      WHERE name = "Jim");
```



- 自连接版本

```sql
SELECT e1.name
FROM employee AS e1 INNER JOIN employee AS e2
ON e1.department = e2.department
      AND e2.name = "Jim";
```



### 外连接 LEFT/RIGHT OUTER JOIN

外连接保留了没有关联的那些行。

- 左外连接（保留左表所有行）
- 右外连接
- 全外连接



检索所有顾客的订单信息，包括还没有订单信息的顾客。

```sql
SELECT Customers.cust_id, Orders.order_num
FROM Customers LEFT OUTER JOIN Orders
ON Customers.cust_id = Orders.cust_id;
```



<img src="https://cdn.nlark.com/yuque/0/2020/png/1237282/1586069461911-316fd9a7-ed70-47d7-a017-b2bae13c9947.png" alt="img" style="zoom:67%;" />

## 15. 组合查询 UNION

- **使用 UNION 来组合两个查询，如果第一个查询返回 M 行，第二个查询返回 N 行，那么组合查询的结果一般为 M+N 行。**
- 每个查询必须包含相同的列、表达式和聚集函数。
- 默认会去除相同行，如果需要保留相同行，使用 UNION ALL。
- 只能包含一个 ORDER BY 子句，并且必须位于语句的最后。



```sql
SELECT col FROM mytable WHERE col = 1
UNION
SELECT col FROM mytable WHERE col =2;
```

## 16.  视图 VIEW

视图是**虚拟的表**，本身不包含数据，也就**不能对其进行索引操作**。



对视图的操作和对普通表的操作一样。



视图具有如下好处：

- 简化复杂的 SQL 操作，比如复杂的连接；
- **只使用实际表的一部分数据；**
- **通过只给用户访问视图的权限，保证数据的安全性；**
- 更改数据格式和表示。



```sql
CREATE VIEW myview AS
SELECT Concat(col1, col2) AS concat_col, col3*col4 AS compute_col
FROM mytable
WHERE col5 = val;
```

## 17. 存储过程 PROCEDURE

存储过程可以看成是对一系列 SQL 操作的批处理。



使用存储过程的好处：

- 代码封装，保证了一定的安全性；
- 代码复用；
- 由于是预先编译，因此具有很高的性能。



### 不带参数的存储过程

```sql
create procedure GetUsers()
begin
  select * from users;
end;
```



调用:

```sql
call GetUsers();
```



删除:

```sql
drop procedure if exists GetUsers;
```



### 带参数的存储过程

命令行中创建存储过程需要使用 `delimeter` 自定义分隔符，因为命令行是以 ; 为结束符，而存储过程中也包含了分号，因此会错误把这部分分号当成是结束符，造成语法错误。



包含 in、out 和 inout 三种参数。

- `IN`   	 输入：在调用过程中，将数据输入到过程体内部的参数
- `OUT`    输出：在调用过程中，将过程体处理完的结果返回到客户端
- `INOUT`  输入输出：既可输入，也可输出



给变量赋值都需要用 `select into` 语句。



**每次只能给一个变量赋值，不支持集合的操作。**



示例：输入一个用户ID，返回该用户的名字

```sql
# 自定义结束符号
delimiter // 

create  procedure  GetNameByID(
    in userID  int
    out  userName  varchar(200))
begin
    select name from user
    where  id = userID
    into  userName;
end //

# 修改结束符号为原来的分号
delimiter ;
```



调用：MySQL 中变量都必须以 @ 开始

```sql
call  GetNameByID(1,@userName)
select  @userName;
```



## 18. 游标

游标是SQL 的一种数据访问机制 ，游标是一种处理数据的方法。众所周知，使用SQL的select查询操作返回的结果是一个包含一行或者是多行的数据集，如果我们要**对查询的结果再进行查询**，比如（查看结果的第一行、下一行、最后一行、前十行等等操作）简单的通过select语句是无法完成的，因为这时候索要查询的结果不是数据表，而是已经查询出来的结果集。游标就是针对这种情况而出现的。


在存储过程中**使用游标可以对一个结果集进行移动遍历。**

游标主要用于交互式应用，其中用户需要对数据集中的任意行进行浏览和修改。



使用游标的四个步骤：

声明游标—>打开游标—>读取数据—>关闭游标

- 声明游标，这个过程没有实际检索出数据

  `declare 游标名 cursor for SQL语句`

- 打开游标

  `Open 游标名`

- 取出数据

  `Fetch.........From`

- 关闭游标

  `Close 游标名`



实例1 ：创建一个简单的游标，从商品表goods中读取第一行数据：

商品表属性：id，name，num

```sql
--自定义结束符号为 //
delimiter //
create procedure myprocedure(out ret int)
    begin
        /*定义三个变量用于存放商品id,商品名称，商品库存量*/
  		declare row_id int ; 
  		declare row_name varchar(20);
  		declare row_num int;
  		declare getgoods_cursor cursor for select id,name,num from goods;  --定义游标
  		open getgoods_cursor; --打开游标
  		fetch getgoods_cursor into row_id,row_name,row_num;--从游标中取值
  		select row_name,row_num; --显示取出来的数据
  		close getgoods_cursor; --关闭游标
    end //
 delimiter ;
 -- 修改自定义符号为原来的分号
```



实例2 ： 循环读取所有数据

- 使用计数器来循环

```sql
delimiter //
create procedure p14()
	begin 
          declare cnt int default 0;
          declare i int default 0;
          declare row_id int ;
          declare row_name varchar(20);
          declare row_num int;
          declare getgoods_cursor cursor for select id,name,num from goods;
          select count(*) into cnt from goods;
          open getgoods_cursor;
          repeat 
            fetch getgoods_cursor into row_id,row_name,row_num;
          select row_name,row_num;
          set i:= i+1;
          until i >= cnt end repeat;
          close getgoods_cursor;
	end //
delimiter ;
```



- 使用越界标志来控制循环

  在mysql cursor中，可以声明`declare continue handler`来操作1个越界标志

  语法：`declare continue handler for NOT FOUND statement;`

```sql
create procedure p15()
begin
      declare row_gid int ;
      declare row_name varchar(20);
      declare row_num int;
      declare have int default 1;
      declare getgoods cursor for select gid,name,num from goods;
      declare continue handler for NOT FOUND set have:= 0;
      open getgoods;
      repeat 
        fetch getgoods into row_gid,row_name,row_num;
      select row_name,row_num;
      until have = 0 end repeat;
      close getgoods;
end //
```



## 19. 触发器 TRIGGER

触发器是用户定义在关系表上的一类由事件驱动的特殊过程

### 创建触发器

触发器仅限于数据库中增 删 改三种操作

触发器定义如下：

```sql
create trigger 触发器名 
	before/after 触发事件 /*指明触发器的激活时间*/
	on 表名 /*触发器只能定义在基本表上，不能定义在视图上*/
	[referencing 引用名] 可选的
	for each row/statement /*定义触发器的类型，指明动作体执行的频率*/
	when SQL语句
	动作
```

**before/after**：触发器必须指定在语句执行之前还是之后自动执行，之前执行使用 BEFORE 关键字，之后执行使用 AFTER 关键字。`BEFORE` 用于数据验证和净化，`AFTER` 用于审计跟踪，将修改记录到另外一张表中。

**触发事件**：

- `insert`：触发器包含一个名为 NEW 的虚拟表。

- `delete` ：触发器包含一个名为 OLD 的虚拟表，并且是只读的。

- `update`：触发器包含一个名为 NEW 和一个名为 OLD 的虚拟表，其中 NEW 是可以被修改的，而 OLD 是只读的。

  也可以是 `update of < 触发列名1，触发列名2 ... >`

**引用名：**

> 触发器事件既然是数据库更新操作，这些操作的执行势必会引起数据库中某些值的改变，即由旧值变成新值，这些新旧值称为过渡值。在触发器的条件和动作中可以引用这些过渡值

- `OLD【ROW】AS 旧元组别名` （row旧元组名是可选的）
- `NEW【ROW】AS 新元组别名`
- `OLD TABLE AS 旧表别名`
- `NEW TABLE AS 旧表别名`

**触发器类型：**

- for each row：行级触发器

- for each statement : 语句级触发器

  > 比如修改一个Teacher表中的deptno字段（一共1000条记录）
  >
  > update teacher set deptno = 5;
  >
  > 若是行级触发器，update后触发动作执行一次
  >
  > 若是语句级触发器，触发动作将执行1000次

**示例：**

如果cource表中删除一个元组，若该元组的主键是sc表中的外键，则卷回删除该元组的操作。

```sql
CREATE TRIGGER mytrigger 
BEFORE DELETE ON cource  
referencing old as o 
for each row
when (exists (select * from sc
             where cno = o.cno))
ROLLBACK;
```

### 删除触发器

```sql
DROP TRIGGER 触发器名
```

### 触发器实现参照完整性

**比如有三个表：student（学生表），cource（课程表），sc（选修表），其中sc定义了两个外键sno和cno以及其完整性约束，试写出触发器实现该参照完整性约束的规则**

首先分析：有哪些操作会影响到本例的完整性约束

- sc 表的 insert 操作
- cource 表的 delete 操作
- student 表的 delete 操作
- sc 表的 update（sno, cno) 操作
- cource 表的 update（cno) 操作
- student 表的 update（sno) 操作

对上述6中操作分别定义6条规则，实现参照完整性约束

**规则1：**

```sql
create trigger referential_integrity_check
before insert on sc
referencing new as n
when (not(exists(select * from student
                where sno = n.sno)
         and
         exists(select * from cource
               where cno = n.cno)
         )
     )
rollback;
```

如果 sc 表中插入元组，其外键在student 和 cource 表中均不存在，则卷会插入该元组操作

**规则2：**

```sql
create trigger cource_delete
before delete on cource
referencing old as o
for each row
when (exists(select * from sc
            where o.cno = sc.cno)
     )
rollback;
```

如果 cource 表中删除一个元组，若该元组是 sc 表中的外键，则卷会删除该元组的操作（此处我们假定在sc表的定义中，外键 cno 使用了 restrict 选项）

**规则3：**

```sql
create trigger student_delete
before delete on student
referencing old as o
for each row
when(exists(select * from sc
           where sc.sno = o.sno)
    )
delete from sc
where sc.sno = o.sno;
```

假设在 sc 表的定义中，外键 sno 的定义中采用了 cascade 选项，即当在 student 表中删除一个元组的时候，则在 sc 表中删除引用该元组主键作为外键的所有元组

**规则4：**

```sql
create trigger sc_fk_update
before update of sno,cno on sc
referencing new as n
for each row
when(not(exists(select * from student
               where sno = n.sno)
        and
        exists(select * from cource
              where cno = n.cno)
        )
    )
rollback;
```

对于 sc 表的更新操作，若更新的外键sno或者cno在student和cource表中无相应的主键供其引用，则卷会更新该元组的操作

**规则5：**

```sql
create trigger cource_cno_update
before update of cno on cource
referencing old as o
for each row
when(exists(select * from sc
               where sc.cno = o.cno)
     )
    
rollback;
```

对于 cource 表的 更新操作，在修改主键cno的同时，如果sc表中有元组正引用修改前的cno值作为外键，则卷会该操作

**规则6：**

```sql
create trigger student_sno_update
before update of sno of student
referencing old as o
for each row
when (exists(select * from sc
            where sc.sno = o.sno)
     )
rollback;
```

对于 student 表的更新操作，在修改主键sno的同时，如果sc表中有元组正引用修改前的sno值作为外键，则卷会该操作

## 20. 索引的创建和删除

### ① 建议索引

```sql
create [unique][cluster] index 索引名
on 表名 (列名[次序]，列名[次序]...)
```

unique 表示此索引的每一个索引值只对应唯一的数据记录

cluster 表示该索引是聚集索引，详见 后序 **索引详解** 章节相关内容

示例：

```sql
create unique index sno_index on student(sno);
create unique index cno_index on cource(cno);
# sc表按学号升序和课程号降序建立唯一索引
create unique index sc_index on sc(sno asc, cno desc);
```

### ② 修改索引

```sql
alter index 旧索引名 rename to 新索引名
```

### ③ 删除索引

```sql
drop index 索引名
```

