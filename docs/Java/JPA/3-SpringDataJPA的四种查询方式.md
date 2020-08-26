# 🎃 Spring Data JPA 的四种查询方式详解

---

前几篇文章已经了解了如何将数据库表和实体类建立映射关系，接下来我们要做的当然就是对数据库进行 CRUD，首先我们学习最常用的查询操作。

以实体类 `User` 为例：

```java
@Entity 
@Table(name = "user") 
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    private String username; 
    private String password;
    private String salt;

    public User() {
    }

    public User(int id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    // Getter And Setter
}
```

## 1. 调用接口

### ① JpaRepository

写一个Dao（Repository） 层接口继承 Spring Data JPA 规定的接口 `JpaRepository<T,ID>`，其中，泛型参数 `T` 表示对哪个实体类进行操作，参数 `ID` 表示操作对象的主键类型

```java
@Repository
public interface UserDao extends JpaRepository<User,Integer> {
}
```

我们自定义的接口中啥也不用写，`JpaRepository` 这个接口已经帮我们定义好了一些基本方法：

```java
@NoRepositoryBean
public interface JpaRepository<T, ID> extends PagingAndSortingRepository<T, ID>, QueryByExampleExecutor<T> {
    List<T> findAll();

    List<T> findAll(Sort var1);

    List<T> findAllById(Iterable<ID> var1);

    <S extends T> List<S> saveAll(Iterable<S> var1);

    void flush();

    <S extends T> S saveAndFlush(S var1);

    void deleteInBatch(Iterable<T> var1);

    void deleteAllInBatch();

    T getOne(ID var1);

    <S extends T> List<S> findAll(Example<S> var1);

    <S extends T> List<S> findAll(Example<S> var1, Sort var2);
}

```

这些方法可以直接拿来用：

```java
@Autowired
UserDao userDao;
@Test
void test(){
    // 测试 findAll
    List<User> users = userDao.findAll();
    for(User user: users){
        System.out.println(user);
    }

    // 测试 findAllById
    List<Integer> ids = new ArrayList<>();
    ids.add(1);
    ids.add(2);
    List<User> userList = userDao.findAllById(ids);
}
```

### ② JpaSpecificationExecutor

`JpaSpecificationExecutor<T>` 这个接口可以帮助我们完成一些复杂查询，泛型 `T` 表示对哪个实体类进行操作

```java
@Repository
public interface UserDao extends JpaRepository<User,Integer>, JpaSpecificationExecutor<User> {

}
```

该接口包含的方法：

```java
public interface JpaSpecificationExecutor<T> {
    Optional<T> findOne(@Nullable Specification<T> var1);

    List<T> findAll(@Nullable Specification<T> var1);

    Page<T> findAll(@Nullable Specification<T> var1, Pageable var2);

    List<T> findAll(@Nullable Specification<T> var1, Sort var2);

    long count(@Nullable Specification<T> var1);
}
```

需要注意的是：`JpaSpecificationExecutor` 中的 `findOne` 方法 和 `JpaRepository` 中的 `getOne` 方法的作用是相同的，但它们两个本质上却有一定的差别

- `findOne()` 底层调用了 `find()` 方法，当我们调用这个方法的时候直接为我们查出结果
- `getOne()` 底层调用了 `getReference()` 方法，是一种**懒加载**的模式，使用动态代理的方式为我们创建一个动态代理对象，当我们调用查询结果时才会发送 sql 语句，查询出我们需要的结果

## 2. 使用 Spring Data JPA 规定的方法名称

顾名思义，这种方法就是使用 Spring Data JPA 规定的方法名称进行查询，这种方式不需要我们写 jpql 或者 sql 语句，Spring Data JPA 会解析方法名帮我们自动创建查询。

📃 命名规则如下：

| Keyword             | Sample                                                       | JPQL snippet                                                 |
| :------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `And`               | `findByLastnameAndFirstname`                                 | `… where x.lastname = ?1 and x.firstname = ?2`               |
| `Or`                | `findByLastnameOrFirstname`                                  | `… where x.lastname = ?1 or x.firstname = ?2`                |
| `Is,Equals`         | `findByFirstname`,`findByFirstnameIs`,`findByFirstnameEquals` | `… where x.firstname = ?1`                                   |
| `Between`           | `findByStartDateBetween`                                     | `… where x.startDate between ?1 and ?2`                      |
| `LessThan`          | `findByAgeLessThan`                                          | `… where x.age < ?1`                                         |
| `LessThanEqual`     | `findByAgeLessThanEqual`                                     | `… where x.age <= ?1`                                        |
| `GreaterThan`       | `findByAgeGreaterThan`                                       | `… where x.age > ?1`                                         |
| `GreaterThanEqual`  | `findByAgeGreaterThanEqual`                                  | `… where x.age >= ?1`                                        |
| `After`             | `findByStartDateAfter`                                       | `… where x.startDate > ?1`                                   |
| `Before`            | `findByStartDateBefore`                                      | `… where x.startDate < ?1`                                   |
| `IsNull`            | `findByAgeIsNull`                                            | `… where x.age is null`                                      |
| `IsNotNull,NotNull` | `findByAge(Is)NotNull`                                       | `… where x.age not null`                                     |
| `Like`              | `findByFirstnameLike`                                        | `… where x.firstname like ?1`                                |
| `NotLike`           | `findByFirstnameNotLike`                                     | `… where x.firstname not like ?1`                            |
| `StartingWith`      | `findByFirstnameStartingWith`                                | `… where x.firstname like ?1` (parameter bound with appended `%`) |
| `EndingWith`        | `findByFirstnameEndingWith`                                  | `… where x.firstname like ?1` (parameter bound with prepended `%`) |
| `Containing`        | `findByFirstnameContaining`                                  | `… where x.firstname like ?1` (parameter bound wrapped in `%`) |
| `OrderBy`           | `findByAgeOrderByLastnameDesc`                               | `… where x.age = ?1 order by x.lastname desc`                |
| `Not`               | `findByLastnameNot`                                          | `… where x.lastname <> ?1`                                   |
| `In`                | `findByAgeIn(Collection ages)`                               | `… where x.age in ?1`                                        |
| `NotIn`             | `findByAgeNotIn(Collection ages)`                            | `… where x.age not in ?1`                                    |
| `True`              | `findByActiveTrue()`                                         | `… where x.active = true`                                    |
| `False`             | `findByActiveFalse()`                                        | `… where x.active = false`                                   |
| `IgnoreCase`        | `findByFirstnameIgnoreCase`                                  | `… where UPPER(x.firstame) = UPPER(?1)`                      |

可以看到，查询方法以 `findBy` 开头，条件的属性用条件关键字进行连接。

**注意：条件属性首字母需大写。**

比如说：

```java
@Repository
public interface UserDao extends JpaRepository<User,Integer>, JpaSpecificationExecutor<User> {
	// 根据 id 集合进行查询
    List<User> findAllByUsernameIn(List<Integer> usernames);
    // findByUsernameIn = findAllByUsernameIn （加不加 All 没啥区别，一般加上 All 更容易理解）
}
```

> 💡 个人总结：**如果参数是集合，则在方法名后面加上 `In`；如果返回类型是集合，则用 `findAllxxx`**

测试一下：

```java
@Autowired
UserDao userDao;
@Test
void test(){
    // 测试 findAllByUsernameIn
    List<Integer> usernames = new ArrayList<>();
    usernames.add("jack");
    usernames.add("tom");
    List<User> userList = userDao.findAllByUsernameIn(usernames);
}
```

## 3. JPQL

**JPQL** 即 JPA Query Language，⭐ **JPQL 是针对实体类进行的操作，SQL 是直接对数据库表的操作**，所以 JPQL 里只是将 SQL 里数据库表名、列名等信息替换为实体类属性而已

例如：

- SQL 语句的查询：`select * from tbl_user where user_name = ?`

- JPQL 语句的查询：`from User where userName = ?`

由于是自定义的方法，所以这里需要使用 `@Query` 注解，`value` 是 JPQL 语句：

```java
@Repository
public interface UserDao extends JpaRepository<User,Integer>, JpaSpecificationExecutor<User> {
	
    // 根据用户 id 和 username 查询
    @Query(value = "from User where id = ?2 and username = ?1")
    User findUserByIdAndName(String username, int id);
}
```

你可能注意到了，每个问号后面都带了一个数字，**这个数字就表示该属性对应方法内形参的位置**，这样我们就可以不按照属性的顺序进行赋值了。

🏃‍ 测试一下：

```java
@Test
public void testJpql1(){
  User user = userDao.findUserByIdAndName("jack", 1);
  System.out.println(user);
}
```

## 4. 原生 SQL 语句

同样也是自定义的方法，与 JPQL 不同的是，这种方法是对数据库表字段进行查询，且需要加上 `nativeQuery=true` 来声明这是一个原生的 SQL 查询：

```java
@Repository
public interface UserDao extends JpaRepository<User,Integer>, JpaSpecificationExecutor<User> {
	
    // 根据 username 进行模糊查询
    @Query(value = "select * from user where username like ?", nativeQuery = true)
	List<User> sqlFindByName(String username);
}
```

🏃‍ 测试一下：

```java
@Test
public void testSql2(){
  List<User> users = userDao.sqlFindByName("%张%");
  for (User user : users) {
    System.out.println(user);
  }
}
```

## 📚 References

- [Spring Data Jpa的四种查询方式详解](https://www.jb51.net/article/175679.htm)

- [Spring Data JPA - Reference Documentation](https://docs.spring.io/spring-data/jpa/docs/2.3.3.RELEASE/reference/html/#query-by-example)

  