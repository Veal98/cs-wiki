# 📑 Redis 配置文件详解

---

Ubuntu 中通过命令 `sudo apt-get install redis-server` 安装的 Redis，默认的配置文件在 `etc/Redis/redis.conf` 中，可以通过 `sudo vim /etc/Redis/redis.conf` 来打开并进行编辑。

该配置文件中的相关配置项如下：👇 

## 1. 网络相关

```xml
bind 127.0.0.1 # 绑定的主机地址，如果需要允许外网访问，需要将此行注释，或者改为 bind 0.0.0.0

protected-mode yes # 保护模式

port 6379 # 指定 Redis 监听端口，默认端口为 6379

timeout 300	# 当客户端闲置多长秒后关闭连接，如果指定为 0 ，表示关闭该功能
```

## 2. 守护进程

```xml
daemonize yes # 以守护进程的方式运行，默认是 no，我们需要自己开启为 yes

# 当 Redis 以守护进程方式运行时，Redis 默认会把 pid 写入 /var/run/redis.pid 文件，可以通过 pidfile 指定
pidfile /var/run/redis.pid
```

## 3. 日志

```xml
# 指定日志记录级别，Redis 总共支持四个级别：debug、verbose、notice、warning，默认为 notice
loglevel notice

logfile "" # 日志的文件位置名

# 日志记录方式，默认为标准输出，如果配置 Redis 为守护进程方式运行，而这里又配置为日志记录方式为标准输出，则日志将会发送给 /dev/null
logfile stdout
```

## 4. RDB 配置

持久化，在规定的时间内，执行了多少次操作，则会持久化到文件 `.rdb. aof`

**redis 是内存数据库，如果没有持久化，那么数据断电及失**

```xml
# 如果900s内，如果至少有一个1 key进行了修改，我们及进行持久化操作
save 900 1

# 如果300s内，如果至少10 key进行了修改，我们就进行持久化操作
save 300 10

# 如果60s内，如果至少10000 key进行了修改，我们就进行持久化操作
save 60 10000

stop-writes-on-bgsave-error yes # 持久化如果出错，是否还需要继续工作

# 指定存储至本地数据库时是否压缩数据，默认为 yes，Redis 采用 LZF 压缩，如果为了节省 CPU 时间，可以关闭该选项，但会导致数据库文件变的巨大
rdbcompression yes 

rdbchecksum yes # 保存rdb文件的时候，进行错误的检查校验

dir ./ # rdb 文件保存的目录
```

## 5. 安全

可以在这里设置redis的密码，默认是没有密码

```powershell
127.0.0.1:6379> ping
PONG
127.0.0.1:6379> config get requirepass # 获取redis的密码
1) "requirepass"
2) ""
127.0.0.1:6379> config set requirepass "123456" # 设置redis的密码
OK
127.0.0.1:6379> config get requirepass # 发现所有的命令都没有权限了
(error) NOAUTH Authentication required.
127.0.0.1:6379> ping
(error) NOAUTH Authentication required.
127.0.0.1:6379> auth 123456 # 使用密码进行登录！
OK
127.0.0.1:6379> config get requirepass
1) "requirepass"
2) "123456"
```

设置密码后可使用如下命令进行登录：

`redis-cli -a 密码`

## 6. 限制

```xml
databases 16 # 数据库的数量，默认是 16 个数据库

# 设置同一时间最大客户端连接数，默认无限制，Redis 可以同时打开的客户端连接数为 Redis 进程可以打开的最大文件描述符数，如果设置 maxclients 0，表示不作限制。当客户端连接数到达限制时，Redis 会关闭新的连接并向客户端返回 max number of clients reached 错误信息
maxclients 10000 

# 指定 Redis 最大内存限制，Redis 在启动时会把数据加载到内存中，达到最大内存后，Redis 会先尝试清除已到期或即将到期的 Key，当此方法处理 后，仍然到达最大内存设置，将无法再进行写入操作，但仍然可以进行读取操作。Redis 新的 vm 机制，会把 Key 存放内存，Value 会存放在 swap 区
maxmemory <bytes> 
```

## 7. AOF 配置

```xml
# 指定是否在每次更新操作后进行日志记录，Redis 在默认情况下是异步的把数据写入磁盘，如果不开启，可能会在断电时导致一段时间内的数据丢失。因为 redis 本身同步数据文件是按上面保存条件来同步的，所以有的数据会在一段时间内只存在于内存中。
# 默认为 no，即默认使用rdb方式持久化的，在大部分所有的情况下，rdb完全够用
appendonly no 

# 指定更新日志文件名（持久化的文件的名字），默认为 appendonly.aof
appendfilename "appendonly.aof" 

# 指定更新日志条件，共有 3 个可选值：
 - no：不执行 sync，表示等操作系统进行数据缓存同步到磁盘（快）
 - always：表示每次更新操作后手动调用 fsync() 将数据写到磁盘（慢，安全）
 - everysec：表示每秒同步一次（折中，默认值），可能会丢失这1s的数据
appendfsync everysec 
```

## 📚 References

- [【狂神说Java】Redis最新超详细版教程通俗易懂](https://www.bilibili.com/video/BV1S54y1R7SB?from=search&seid=3325634079268895938)
- [菜鸟教程 — Redis 配置](https://www.runoob.com/redis/redis-conf.html)