# 🍪【三】关系数据库标准语言SQL

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

为用户ZHANG创建一个模式TEST，并且在其中定义一个表table1

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

## 4. 数据字典

数据字典是关系数据库管理系统内部的一组系统表，它记录了数据库中所有的定义信息，包括关系模式定义、视图定义、索引定义、完整性约束定义、各类用户对数据库的操作权限、统计信息等。关系数据库管理系统在执行SQL的数据定义语句时，实际上就是在更新数据字典中的相应信息



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

#### 消除取值重复的行

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
- asc升序 默认

```sql
# 院系按升序排，年龄按降序排
select *
from student
order by sdept,sage desc;
```

### ④ 聚集函数

![](https://gitee.com/veal98/images/raw/master/img/20200417154133.png)

示例：

```sql
# 查询学生总人数
select count(*)
from student;

# 查询选修了课程的学生人数(学生每选一门可都会在选修表中有记录)
select count(distinct Sno)
from sc;
```

### ⑤ group by 子句

group by 分组：把具有相同的数据值的行放在同一组中。

分组后聚集函数将作用于每一组，即每一组都有一个函数值

**示例：**

```sql
# 求各个课程号及相应的选课人数
select Cno, count(Sno)
from sc
group by Cno;
```



如果分组后话需要对这些组进行过滤，则使用 `HAVING` 短语

```sql
# 查询选修了三门以上课程的学生学号
select Sno
from sc
group by sno
having count(*) > 3;
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
> where 不可以使用聚集函数。一般需用聚集函数才会用 having
>
> SQL标准要求`HAVING必须引用GROUP BY子句中的列或用于合计函数中的列`。

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

在SQL语言中，一个select-from-where语句称为一个查询块。

将一个查询块套在另一个查询块的where子句或HAVING短语的条件中的查询称为嵌套查询

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

EXISTS代表存在，带有该谓词的子查询不返回任何数据，只产生逻辑真值true或逻辑假值false

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

由exists引出的子查询，其目标列表达式通常都用 * ，因为该子查询只返回true 或 false，给出列名无实际意义

```sql
# 查询选修了全部课程的学生姓名
select Sname
from Student
where not exists(
	select *
	from Cource
	where not exists(
		select * 
		from SC
		where Sno = Student.Sno
		and
		Cno = Cource.Cno
	)
);
```

由于没有全程量词，可将题目的意思转化为 没有一门课程是他不选修的

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



# P125



# 三、数据更新

## 1. 插入数据

## 2. 修改数据

## 3. 删除数据

# 四、空值的处理

# 五、视图

##  1. 定义视图

## 2. 查询视图

## 3. 更新视图

## 4. 视图的作用

