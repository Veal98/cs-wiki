# 💾 LeetCode 数据库部分

---



### [175. 组合两个表](https://leetcode-cn.com/problems/combine-two-tables/)

<img src="https://gitee.com/veal98/images/raw/master/img/20200502172156.png" style="zoom: 80%;" />

编写一个 SQL 查询，满足条件：无论 person 是否有地址信息，都需要基于上述两表提供 person 的以下信息：

>  FirstName, LastName, City, State

<br>

需要保留Person表中未连接的数据

```sql
select FirstName,LastName,City,State
from Person left outer join Address
on Person.PersonId = Address.PersonId;
```

<br>



### [176. 第二高的薪水](https://leetcode-cn.com/problems/second-highest-salary/)

<img src="https://gitee.com/veal98/images/raw/master/img/20200502172636.png" style="zoom: 80%;" />

<br>

方法一：使用聚集函数

```sql
select max(Salary) SecondHighestSalary
from Employee
where Salary < (select max(Salary) from Employee);
```

方法二：使用 `limit`

```sql
select (
    select distinct Salary
    from Employee
    order by Salary desc
    limit 1 offset 1
) as SecondHighestSalary;
```

`limit x offset y `：跳过 y 条数据查询 x 条数据

<br>



### [177. 第N高的薪水](https://leetcode-cn.com/problems/nth-highest-salary/)

<img src="https://gitee.com/veal98/images/raw/master/img/20200502173929.png" style="zoom: 80%;" />

<br>

```sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  set N = N - 1;
  RETURN (
      # Write your MySQL query statement below.
      select distinct Salary from Employee
      order by Salary desc
      limit N,1
  );
END
```

<br>



### [178. 分数排名](https://leetcode-cn.com/problems/rank-scores/)

<img src="https://gitee.com/veal98/images/raw/master/img/20200502174557.png" style="zoom:80%;" />

<br>

我们可以先提取出大于等于X的所有分数集合H，将H去重后的元素个数就是X的排名。比如你考了99分，但最高的就只有99分，那么去重之后集合 H 里就只有99一个元素，个数为1，因此你的Rank为1。

```sql
select s1.Score, count(distinct(s2.Score)) Rank
from Scores s1, Scores s2
where s1.Score<=s2.Score
group by s1.Id
order by Rank;
```

<br>



### [180. 连续出现的数字](https://leetcode-cn.com/problems/consecutive-numbers/)

<img src="https://gitee.com/veal98/images/raw/master/img/20200502180956.png" style="zoom:80%;" />

<br>

至少连续出现三次的数字则必定id连续三次或三次以上

```sql
select distinct a.Num as ConsecutiveNums
from Logs a,Logs b,Logs c
where a.Num=b.Num and b.Num=c.Num and a.id=b.id-1 and b.id=c.id-1;
```

<br>



### [181. 超过经理收入的员工](https://leetcode-cn.com/problems/employees-earning-more-than-their-managers/)

<img src="https://gitee.com/veal98/images/raw/master/img/20200502181827.png" style="zoom:80%;" />

<br>

自连接，第一张表的 Managerid = 第二张表的 id

```sql
select Name as Employee
from Employee as a
where Salary > (select Salary from Employee b 
                where b.id = a.Managerid);
```

<br>



### [182. 查找重复的电子邮箱](https://leetcode-cn.com/problems/duplicate-emails/)

<img src="https://gitee.com/veal98/images/raw/master/img/20200502182635.png" style="zoom:80%;" />

<br>

利用 group by - having

```sql
select Email from Person
group by Email
having count(Email) > 1;
```

<br>



### [183. 从不订购的客户](https://leetcode-cn.com/problems/customers-who-never-order/)

<img src="https://gitee.com/veal98/images/raw/master/img/20200502183527.png" style="zoom:80%;" />

<br>

```sql
select c.Name as Customers from Customers c
where c.Id not in (select distinct o.CustomerId from Orders o);
```

