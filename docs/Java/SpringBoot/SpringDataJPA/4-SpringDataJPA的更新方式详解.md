# ⏫ Spring Data JPA 的更新方式详解更新

---

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

## 1. 添加

### ① 调用接口

#### ⅠJpaRepository

`JpaRepository` 中关于添加的方法：

```java
@NoRepositoryBean
public interface JpaRepository<T, ID> extends PagingAndSortingRepository<T, ID>, QueryByExampleExecutor<T> {

    <S extends T> List<S> saveAll(Iterable<S> var1);

    <S extends T> S saveAndFlush(S var1);
}
```

#### Ⅱ CrudRepository

可以继承 `CrudRepository<T, ID>`，其中已经包含了基本的 CRUD 方法：

```java
@NoRepositoryBean
public interface CrudRepository<T, ID> extends Repository<T, ID> {
    <S extends T> S save(S var1);

    <S extends T> Iterable<S> saveAll(Iterable<S> var1);

    Optional<T> findById(ID var1);

    boolean existsById(ID var1);

    Iterable<T> findAll();

    Iterable<T> findAllById(Iterable<ID> var1);

    long count();

    void deleteById(ID var1);

    void delete(T var1);

    void deleteAll(Iterable<? extends T> var1);

    void deleteAll();
}
```

可以直接方便的利用 `save` 方法进行插入，`saveAll` 进行批量插入

注意：``JpaRepository` 其实也继承了 `CrudRepository`，所以我们直接对接口继承 `JpaRepository`  也可使用 `save` 方法

<img src="https://gitee.com/veal98/images/raw/master/img/20200925121457.png" style="zoom:50%;" />

### ② 原生 SQL 语句

🚨 **JPQL 只支持 `select` 语句**，所以我们只能使用原生 SQL 语句进行更新操作。

**需要添加 `@Modifying` 注解来表示这是一个更新操作**（添加，修改，删除）

**还需要添加 `@Transactional` 注解（`org.springframework.transaction.annotation.Transactional`）来表明这个事务并非是只读的，可以对其进行操作**：

<img src="https://gitee.com/veal98/images/raw/master/img/20200826211320.png"  />

由上可见 `@Transactional` 注解的 `readOnly` 默认的属性的 `false`，即非只读，只有当一个事务是非只读事务的时候，我们才可以进行操作。

💬 举个例子：

```java
@Repository
public interface UserDao extends JpaRepository<User,Integer> {
    @Transactional
    @Modifying
    @Query(value = "insert into user(id,username,password) values(?1, ?2, ?3)", nativeQuery = true)
    int insert(int id, String username, String password);
}
```

## 2. 修改

### ① 调用接口

所谓修改，**对数据库中已存在数据的保存（添加）就是修改**。

所以接口中的 `save` 等方法可以进行添加操作，也能进行修改操作。

### ② 原生 SQL 语句

```java
@Repository
public interface UserDao extends JpaRepository<User,Integer> {
    @Transactional
    @Modifying
    @Query(value = "update user set username = ?2 where id = ?1", nativeQuery = true)
    int updateUsernameById(int id, String username);
}
```

## 3. 删除

### ① 调用接口

```java
@NoRepositoryBean
public interface JpaRepository<T, ID> extends PagingAndSortingRepository<T, ID>, QueryByExampleExecutor<T> {

    void deleteInBatch(Iterable<T> var1);

    void deleteAllInBatch();
}
```

### ② 原生 SQL 语句

```java
@Repository
public interface UserDao extends JpaRepository<User,Integer> {
    @Transactional
    @Modifying
    @Query(value = "delete from user where id = ?1", nativeQuery = true)
    void deleteById(int id);
}
```

## 📚 References

- [Spring Data JPA 中自定义的插入、更新、删除方法时需要添加 @Modifying 注解和 @Transactional 注解](https://blog.csdn.net/qq_43313914/article/details/105256647)
- [Spring Data JPA 更新和删除](https://blog.csdn.net/laokaizzz/article/details/81742524)