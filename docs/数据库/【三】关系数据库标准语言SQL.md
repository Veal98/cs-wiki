# 一、数据定义

关系数据库系统支持三级模式结构，其模式，外模式，内模式中的基本对象有模式、表、视图和索引，所以SQL的数据定义功能包括模式定义、表定义、视图和索引的定义

## 1. 模式的定义与删除

### ① 模式定义

```sql
create schema 模式名 authorization 用户名;
```

**示例：**

为用户WANG定义一个 学生-课程 模式 S-T

```sql
create schema "S-T" authorization WANG;
```



定义模式实际上就是定义了一个命名空间，可以在这个空间的基础上进一步定义数据库对象，基本表，视图，索引等

**示例：**

为用户 ZHANG 创建一个模式 TEST，并且在其中定义一个表 table1

```sql
create schema "TEST" authorization ZHANG
create table table1(col1 smallint,
                   col2 int,
                   col3 char(20)
                   );
```

### ② 删除模式

```sql
drop schema 模式名 CASCADE | RESTRICT
```

CASCADE | RESTRICT 必选其一

- `CASCADE `表示删除模式的同时会删除该模式下的所有数据库对象
- `RESTRICT` 表示若该模式下存在数据库对象，则拒绝执行删除操作

## 2. 基本表的定义、删除、修改

> 数据库的创建和使用：
>
> CREATE DATABASE test;
> USE test;

### ① 定义基本表 CREATE

![](https://gitee.com/veal98/images/raw/master/img/20200417172352.png)

**示例：**

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

### ② 修改基本表 ALTER

![](https://gitee.com/veal98/images/raw/master/img/20200417172557.png)

**示例：**

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

### ③ 删除基本表

```sql
DROP TABLE 表名 [RESTRICT | CASCADE];
```

默认是 RESTRICT

## 3. 索引的建立和删除

### ① 建议索引

```sql
create [unique][cluster] index 索引名
on 表名 (列名[次序]，列名[次序]...)
```

unique 表示此索引的每一个索引值只对应唯一的数据记录

cluster 表示该索引是聚集索引，详见 后序 **面试指南 - 索引** 章节相关内容

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

## 4. 数据字典

数据字典是关系数据库管理系统内部的一组系统表，它**记录了数据库中所有的定义信息**，包括关系模式定义、视图定义、索引定义、完整性约束定义、各类用户对数据库的操作权限、统计信息等。**关系数据库管理系统在执行SQL的数据定义语句时，实际上就是在更新数据字典中的相应信息**

<br>



# 二、数据查询

**select 语句的一般格式：**

![](https://gitee.com/veal98/images/raw/master/img/20200417173332.png)

> 以下所有示例全都使用下述三个表
>
> - Student(Sno,Sname, Sage, SDept) 学生表
> - Cource (Cno, Cname) 课程表
> - SC(Sno,Cno,Grade) 选修表

## 1. 单表查询

单表查询是指仅涉及一个表的查询

### ① 查询表中的若干列

查询全体学生的学号和姓名

```sql
select Sno, Sname
from Student;
```

目标列表达式 也可以是表达式

```sql
select Sname, 2020 - age
from Student;
```

用户可以为查询的列定义别名

```sql
select Sname, 2020 - age Birthday
from Student;
```

### ② 选择表中的若干元组

#### 消除取值重复的行 distinct

使用 distinct 关键字 去除重复记录

```sql
select distinct Sno
from SC;
```

#### 查询满足条件的行

使用 where 子句，常用的查询条件如下：

![](https://gitee.com/veal98/images/raw/master/img/20200417174019.png)

- **比较**

  ```sql
  select sname
  from student
  where age <= 20;
  ```

- **确定范围**

  ```sql
  # 查询年龄在20-33岁之间的学生姓名和年龄
  select sname,age
  from student
  where age between 20 and 33;
  ```
  
- **确定集合**

  ```sql
  # 查询计算机系和数据系的学生姓名和性别
  select sname,gender
  from student
  where dept in ('CS','Math');
  ```

- **字符匹配**

  ![](https://gitee.com/veal98/images/raw/master/img/20200417174828.png)

  ```sql
  # 查询姓欧阳且全名为三个汉字的学生的姓名
  select sname 
  from student
  where sname like '欧阳_';
  ```

- **涉及空值的查询**

  ```sql
  # 查询所有有成绩的学生姓名
  select sname
  from student
  where grade is not null;
  ```

- **多重条件查询**

  and 和 or 可用来连接多个查询条件，and 的优先级高于 or，不过可以用 括号来改变优先级

  ```sql
  # 查询计算机系年龄20以下的学生姓名
  select sname 
  from student
  where sdept = 'CS' and sage < 20;
  ```

### ③ order by 子句

- desc 降序 
- asc 升序 默认

```sql
# 院系按升序排，年龄按降序排
select *
from student
order by sdept,sage desc;
```

### ④ top

```sql
# 查询成绩第一的学生姓名
select Sname
from Student
where Sgrade = (
	select top 1 Sgrade 
    from Student
    order by Sgrade desc
);
```

```sql
# 查询第21-30行的数据，id主键自增，但可能不连续
# 先查询出前20行的数据，后查询去除这20行的10行数据
select top 10 *
from student
where id not in(
	select top 20 id
    from student
    order by id
)
order by id;
```



### ⑤ 聚集函数

| 函数名 |    功能    |
| :----: | :--------: |
| COUNT  | 对元组计数 |
| TOTAL  |   求总和   |
|  MAX   |  求最大值  |
|  MIN   |  求最小值  |
|  AVG   |  求平均值  |



示例：

```sql
# 查询学生总人数
select count(*)
from student;

# 查询选修了课程的学生人数(学生每选一门可都会在选修表中有记录)
select count(distinct Sno) as numbers
from sc;
```

> 🚨 起别名 as 可写可不写

### ⑥ group by 子句

group by 分组：把具有相同的数据值的行放在同一组中。

**分组后聚集函数将作用于每一组，即每一组都有一个聚集函数值**

**示例：**

```sql
# 求各个课程号及相应的选课人数
select Cno, count(Sno)
from sc
group by Cno;
```

如果分组后还需要对这些组进行过滤，则使用 `HAVING` 短语

```sql
# 查询选修了三门以上课程的学生学号
select Sno
from sc
group by sno
having count(*) > 3;
```

```sql
# 有两个表Study(sno,cno)和Student(sno,sname)，查询选修了2或3门课的学生
select * from Student s
where s.sno in(
	select stu.sno from Studty stu
    group by stu.sno 
    having count(*) >= 2
);
```

<br>



**`WHERE` 过滤行，`HAVING` 过滤分组，行过滤应当先于分组过滤。**

> having 与 where 功能、用法相同，**执行时机不同**。
>
> where 在开始时执行检测数据，对原数据进行过滤。
>
> **having 对筛选出的结果再次进行过滤**。
>
> having 字段必须是查询出来的，where 字段必须是数据表存在的。
>
> **where 不可以使用字段的别名，having 可以。因为执行 WHERE 代码时，可能尚未确定列值。**
>
> where 不可以使用聚集函数。一般需用聚集函数才会用 having
>
> SQL标准要求`HAVING 必须引用 GROUP BY 子句中的列或用于合计函数中的列`。



⚠ **GROUP BY 子句出现在 WHERE 子句之后，ORDER BY 子句之前**

```sql
SELECT col, COUNT(*) AS num
FROM mytable
where col > 2
GROUP BY col
ORDER BY num;
```

## 2. 连接查询

若一个查询同时涉及两个以上的表，则称为连接查询

### ① 等值与非等值连接查询

![](https://gitee.com/veal98/images/raw/master/img/20200417180939.png)

**示例：**

```sql
# 查序每个学生及选修课的情况
select Student.*, SC.*
from Student, SC
where Student.sno = SC.sno;

# 查询选修2号课程且成绩在90分以上的所有学生的学号和姓名
select Student.sno,sname
from Student,SC
where Student.sno = SC.sno and
	SC.cno = 2 and
	SC.grade > 90;
```

### ② 自身连接

一个表与自己进行连接

**示例：**

![](https://gitee.com/veal98/images/raw/master/img/20200417181712.png)

```sql
select FIRST.Cno,SECOND.Cpno
from Cource FIRST, Cource Second
where FIRST.Cpno = SECOND.Cno;
```

### ③ 外连接

保存悬浮元组（即不满足条件的元组也保存下来）上一节已经讲过

- OUTER JOIN
- LEFT OUTER JOIN
- RIGHT OUTER JOIN

### ④ 多表连接

两个以上的表进行连接

```sql
# 查询每个学生的学号，姓名，选修的课程名即成绩
select Student.Sno,Sname,Cname,Grade
from Student,Cource,SC
where Student.Sno = SC.Sno AND
	SC.Cno = Cource.Cno;
```

## 3. 嵌套查询

在 SQL 语言中，一个 select-from-where 语句称为一个查询块。

将一个查询块套在另一个查询块的 where 子句或 HAVING 短语的条件中的查询称为嵌套查询

### ① 带有 in 谓词的子查询

```sql
# 查找与小明所在同一个系的学生
select Sno,Sname,Sdept
from  Student
where Sdept in
	(Select Sdept
	From Student
	Where Sname = "小明");
```

### ② 带有比较运算符的子查询

```sql
# 找出每个学生超过他自己选修课程平均成绩的课程号
select Sno,Cno
from SC x
where grade >= (select AVG(grade)
               from Sc y
               where y.Sno = x.Sno);
```

### ③ 带有 ANY(SOME)或 ALL 谓词的子查询 

子查询返回单值时可以用比较运算符，但返回多值时要用 ANY（有的系统用SOME）或 ALL 谓词修饰符。而使用ANY 或 ALL谓词时必须同时使用比较运算符。

![](https://gitee.com/veal98/images/raw/master/img/20200417195212.png)

**示例：**

```sql
# 查询非计算机科学系中比计算机科学系任意一个学生年龄小的学生姓名和年龄
select Sname,Sage
from Student
where Sage < ANY(select Sage
                from Student
                where Sdept = 'CS')
      and 
      Sdept <> ‘CS';
```

### ④ 带有 EXISTS 谓词的子查询

`EXISTS` 代表存在，带有该谓词的子查询不返回任何数据，只产生逻辑真值 true 或逻辑假值 false

- exists 引导的内层查询如果 能查出数据，则继续外层查询

- not exists 引导的内层查询如果 查不出数据，则继续外层查询

> **exists 的查询步骤是顺序执行，并不会先做子查询**，与 in 相反。
>
> 顺序执行，如果exists 的查询结果为真，则将最外层的查询结果添加进最终结果集。对外表进行循环

**示例：**

```sql
# 查询所有选修了1号课程的学生姓名
select Sname
from Student
where exists(
	select *
    from SC
    where Sno = Student.Sno
    and Cno = 1
);
```

由exists引出的子查询，其目标列表达式通常都用 * ，因为该子查询只返回 true 或 false，给出列名无实际意义

```sql
# 查询选修了全部课程的学生姓名
select Sname
from Student
where not exists(
    # 首先我们要直到一共有哪些课程
	select *
	from Cource 
	where not exists(
        # 其次，我们需要统计选修了所有课程的学生号
		select * 
		from SC
		where Sno = Student.Sno
		and
		Cno = Cource.Cno
	)
);
```

由于没有全程量词，可将题目的意思转化为 没有一门课程是他不选修的

exists 可以理解为一个循环

```cpp
for(循环从Student表拿一行学生数据){
　　for(循环从Course表拿一行课程信息){
　　　　for(循环在SC表拿一行进行比对){
　　　　　　SC表中的这条数据判断：
　　　　　   SC.Sno == Student.Sno ， SC.Cno == Course.Cno;
　　　　　　/*是否SC表中的学号 = Student表中的学号 且
　　　　　　　SC表中的Cno = Course表中的Cno*/
　　　　}
　　}
}
```



```sql
# 查询至少选修了学生001选修的全部课程的学生号码
select distinct Sno
# 代表学生X的表
from SC SCX
where not exists(
	select *
    from SC SCY
    where SCY.Sno = '001'
    and
    not exists(
    	select * 
        from SC SCZ
        # 匹配学号
        where SCZ.Sno = SCX.Sno
        and
        # 001选修了该课程
        SCZ.Cno = SCY.Cno
    )
);
```

翻译为：不存在这样的课程y，001选修了，而学生x没有选修

> exists 和 in 的区别：
>
> 例如：
>
> select * from A
> where id in(select id from B)
>
> **exists()适合B表比A表数据大的情况**
>
> **当A表数据与B表数据一样大时, in与exists效率差不多,可任选一个使用.**
>
> 详细可参考：👉 [SQL语句中exists和in的区别](https://www.cnblogs.com/emilyyoucan/p/7833769.html)

## 4. 集合查询

select 语句的查询结果是元组的集合，所以多个select语句的结果可进行集合操作。集合操作主要包括

- `并 UNION`
- `交 INTERSECT`
- `差 EXCEPT`

参加集合操作的各查询结果的列数必须相同；对应项的数据类型也必须相同

```sql
# 查询计算机系的学生及年龄不大于19的学生
select *
from Student
where Sdept = 'CS'
UNION
select *
from Student
where Sage <= 19;

# 也可以用INTERSECT
select *
from Student
where Sdept = 'CS'
INTERSECT
select *
from Student
where Sage <= 19;

# 也可以用EXCEPT
select *
from Student
where Sdept = 'CS'
EXCEPT
select *
from Student
where Sage > 19;
```

## 5. 基于派生表的查询

子查询不仅可以出现在where子句中，还可以出现在子句中，这时子查询生成的临时派生表成为主查询的查询对象 (必须为派生关系置顶一个别名)

```sql
# 找出每个学生超过自己选修课程平均成绩的课程号
select Sno,Cno
from SC,(select Sno,AVG(Grade) from SC group by Sno)
		as Avg_SC(avg_sno,avg_grade);
```

<br>



# 三、数据更新

## 1. 插入数据

### ① 插入元组

```sql
insert into Student(Sno,Sname,Sgender,Sdept,Sage)
values('123','小红','男','CS',20);
```

若不指出要添加的属性，则需要添加表中的所有属性

### ② 插入子查询结果

```sql
# 对每一个系，求学生的平均年龄，并把结果存入表 Dept_age
insert into Dept_age(Sdept,Avg_age)
select Sdept,AVG(Sage)
from Student
group by Sdept;
```

## 2. 修改数据

### ① 修改某个元组的值

```sql
# 修改学号001的年龄
update Student
set Sage = 15
where Sno = '001';
```

### ② 修改多个元组的值

```sql
# 将所有学生年龄加1岁
update Stduent
set Sage = Sage + 1;
```

### ③ 带子查询的修改语句

```sql
# 将计算机系全体学生成绩置0
update Student
set Sgrade = 0
where Sno in(
	select Sno
    from Student
    where Sdept = 'CS'
);
```

## 3. 删除数据

### ① 删除某个元组

```sql
# 删除学号001学生记录
delete 
from Student
where Sno = '001';
```

### ② 删除多个元组

```sql
# 删除所有学生记录
delete 
from student;
```

### ③ 带子查询的删除语句

```sql
# 删除计算机系所有学生的选课记录
delete 
from SC
where Sno in(
	select Sno
    from Student
    where Sdept = 'CS'
);
```

```sql
# 删除重复数据，只保留一条记录（除id以外，其余全部相同）
-- ② 删除除了分组中最小id以外的所有值，即重复数据 --
delete from Student
where id not in(
	select id from(
		-- ① 按照除id以外的任意属性就行分组排列，并选出每个分组中的最小id -- 
		select MIN(id) from Student
    	group by Sname
    )temp
);
```

> 🚨 注意： 
>
> ```sql
> delete from test 
> where id not in(
> 	select Min(id) from test 
>     group by name
> );
> ```
>
> 这样写在 MySQL 中会报错，
>
> `You can't specify target table for update in FROM clause`
>
> **不允许使用同一表中查询的数据作为同一表的更新数据。**
>
> 我们需要在select外面套上一层，让数据库认为我们不是使用同一个表的查询数据作为更新数据

<br>



# 四、空值的处理

## 1. 空值的产生

比如：插入语句中没有赋值的属性，其值为空值

```sql
insert into Student(Sno,Cno)
values('123','323');
# 除了Sno,Cno 外其余属性就是空值
```

## 2. 空值的判断

**IS NULL / IS NOT NULL**

```sql
# 查询漏填信息的学生
select *
from Student
where Sname is null or Sgender is null or Sage is null or Sdept is null;
```

## 3. 空值的约束条件

- 属性定义中有 **NOT NULL** 约束条件时不能取空值

- 加了 **UNIQUE** 限制的属性不能取空值

- **主键**不能取空值

<br>



# 五、视图

视图是从一个或几个基本表（或视图）导出的表。

它与基本表不同，是一个虚表。

**数据库中只存放视图的定义，不存放视图对应的数据，这些数据任然存放在原来的基本表中。所以一旦基本表中的数据变化，那么视图中的数据也会相应变化。**

其实视图就好像一个窗口，透过它可以看到自己想要看到的数据及其变化

##  1. 建立视图

![](https://gitee.com/veal98/images/raw/master/img/20200418095518.png)

### ① 建立在单个表上的视图

```sql
# 建立计算机系学生视图，并要求插入/修改/删除操作时，保证该视图只有计算机系学生
create view CS_Student
as
select *
from Student
where Sdept = 'CS'
with check option;
```

由于加上了 with check option 子句，以后对视图进行 修改 / 添加 / 删除 操作时，DBMS都会自动加上 Sdept = 'CS' 这个条件

<br>

若一个视图是从单个基本表导出的，并且只是去掉了某些行某些列，但保留了主键，则称这类视图为 **行列子集视图**。 上述视图 CS_Student 就是一个行列子集视图

### ② 建立在多个表上的视图

```sql
# 建立计算机系选修了1号课程的学生的视图（包括学号，姓名，成绩）
create view CS_S1(View_Sno,View_Sname,View_Grade)
as
select Student.Sno,Sname,Grade
from Student,SC
where Student.Sno = SC.Sno and
	  Sdept = 'CS' and
	  SC.Cno = '1';
```

由于视图的属性列中包含了两个表的同名列 Sno，所以必须在视图名后面说明视图的各个属性列名

### ③ 建立在视图上的视图

```sql
# 建立计算机系选修了1号课程 且 成绩在90分以上的学生的视图
create view CS_S2
as
select View_Sno,View_Sname,View_Grade
from CS_S1
where View_Grade >= 90;
```

## 2. 删除视图

```sql
drop view 视图名；
```

若该视图上还导出了一个视图，则删除视图操作拒绝执行

或者可以使用 `CASCADE `进行级联删除，删除该视图和由它导出的所有视图

```sql
drop view 视图名 CASCADE; 
```

## 3. 查询视图

视图的查询和表的查询是一样的

```sql
# 建立计算机系学生视图，并要求插入/修改/删除操作时，保证该视图只有计算机系学生
create view CS_Student
as
select *
from Student
where Sdept = 'CS'
with check option;

# 查询选修了1号课程的计算机系学生
select CS_Student.Sno,Sname
from CS_Student,SC
where CS_Student.Sno = SC.Sno and
	  SC.Cno = '1';
```

## 4. 更新视图

更新视图和更新表操作基本一致，不过有些时候视图是不允许更新的

![](https://gitee.com/veal98/images/raw/master/img/20200418102146.png)

## 5. 视图的优点

- **视图能够简化用户的操作**

- **视图使用户能以多种角度看待同一数据**

- **视图对重构数据库提供了一定数据的逻辑独立性**

  数据的逻辑独立性是指当数据库数据库构造时，如增加新的关系或对原来关系增加新的字段等，用户的应用程序不会受到影响

- **视图能够对机密数据提供安全保护**

- **适当利用视图可以更清晰的表达查询**

## 6. 视图的缺点

- 查询视图时，必须把对视图的查询转化为对基本表的查询。如果这个视图是由一个复杂的多表查询所定义，那么即使是视图的一个简单查询，数据库也把它变成一个复杂的结合体，需要花费一定的时间。
- 当用户试图修改视图的某些行时，数据库必须把它转化为对基本表的某些行的修改，如果视图涉及多个表的话，由于完整性约束，可能是无法修改的

<br>



# 六、SQL语句综合习题

有如下四个表：

- 供应商表 S（Sno,Sname, Status, City） 
- 零件表 P （Pno,Pname,Color,Weight）
- 工程项目表 J (Jno,Jname,City)
- 供应情况表 SPJ (Sno,Pno,Jno,Qty)

![](https://gitee.com/veal98/images/raw/master/img/20200418113215.png)

![](https://gitee.com/veal98/images/raw/master/img/20200417155118.png)

- 找出所有供应商姓名和所在城市

  ```sql
  select Sname,City 
  from S;
  ```

- 找出所有零件的名称、颜色、重量

  ```sql
  select Pname,Color,Weight
  from P;
  ```

- 找出使用供应商S1所供应零件的工程号码

  ```sql
  select distinct Jno
  from SPJ
  where Sno = 'S1';
  ```

- 找出工程项目J2使用的各种零件的名称及其数量

  ```sql
  select P.Pname,SPJ.QTY
  from SPJ,P
  where SPJ.Pno = P.Pno and 
  	  SPJ.Jno = 'J2';
  ```

- 找出上海厂商供应的所有零件号码

  ```sql
  select Pno 
  from SPJ,S
  where SPJ.Sno = S.Sno and
  	  S.City = '上海';
  ```

- 找出使用上海产的零件的工程名称

  ```sql
  select Jname
  from SPJ,S,J
  where S.Sno = SPJ.Sno and
  	  J.Jno = SPJ.Jno and
  	  S.City = '上海';
  ```

- 找出没有使用天津产的零件的工程号码

  ```sql
  select distinct Jno
  from SPJ
  where Jno not in(
  	select distinct Jno 
      from SPJ,S
      where SPJ.Sno = S.Sno and 
      S.City = '天津'
  );	
  ```

- 把全部红色零件的颜色改成蓝色

  ```sql
  update P
  set Color = '蓝色'
  where Color = '红色';
  ```

- 由S5供给J4的零件P6改为由S3供应

  ```sql
  Update SPJ
  set Sno = 'S3'
  where Sno = 'S5' and
  	  Jno = 'J4' and
  	  Pno = 'P6';
  ```

- 从供应商中删除供应商号是S2的记录，并从供应关系中删除相应的记录

  ```sql
  delete from S
  where Sno = 'S2';
  
  delete from SPJ
  where Sno = 'S2';
  ```

- 请将(S2，J6，P4，200)插入供应情况关系

  ```sql
  insert into SPJ
  values(S2,J6,P4,200);
  ```




