# 命令行工具 ssdb-cli

SSDB 的命令行工具 ```ssdb-cli``` 对于 SSDB 的管理非常有用, 你可以用它来执行所有的命令, 监控服务的状态, 清除整个数据库, 等等.

## 连接到 SSDB 服务器

	$ /usr/local/ssdb/ssdb-cli -h 127.0.0.1 -p 8888
    ssdb (cli) - ssdb command line tool.
    Copyright (c) 2012-2013 ideawu.com
    
	'h' or 'help' for help, 'q' to quit.
    
	ssdb 127.0.0.1:8888>

输入 'h', 然后按```回车```查看帮助信息. 下面是操作的演示:

	ssdb 127.0.0.1:8888> set k 1
    ok
    (0.000 sec)
    ssdb 127.0.0.1:8888> get k
    1
    (0.000 sec)
    ssdb 127.0.0.1:8888> del k
    ok
    (0.000 sec)
    ssdb 127.0.0.1:8888> get k
    error: not_found
    (0.000 sec)
    ssdb 127.0.0.1:8888>

### 对于 <span class="label label-info">Windows</span> 用户:

在 ssdb-master 源码的目录时运行

	deps\cpy\cpy tools\ssdb-cli.cpy

需要安装 Python.

## 转义响应中的中文和二进制数据

如果你执行完命令后发现有乱码或者屏幕输出异常, 可以把下面这行命令拷贝进 ssdb-cli 然后按`回车`键:

	: escape

## 监控 SSDB 实例的状态

### info

命令 ```info``` 显示了数据在 SSDB 中的分布情况, 还有 LevelDB 的健康程度.

	ssdb 127.0.0.1:8899> info
	version
	    1.8.0
	links
	    1
	total_calls
	    4
	dbsize
	    1829
	binlogs
        capacity : 10000000
        min_seq  : 1
        max_seq  : 74
	replication
	    client 127.0.0.1:55479
	        type     : sync
	        status   : SYNC
	        last_seq : 73
	replication
	    slaveof 127.0.0.1:8888
	        id         : svc_2
	        type       : sync
	        status     : SYNC
	        last_seq   : 73
	        copy_count : 0
	        sync_count : 44
	leveldb.stats
	                     Compactions
	    Level  Files Size(MB) Time(sec) Read(MB) Write(MB)
	    --------------------------------------------------
	      0        0        0         0        0         0
	      1        1        0         0        0         0
	
	25 result(s) (0.001 sec)

__links__

当前服务器的连接数.

__dbsize__

数据库*预估*的大小, 字节数. 如果服务器开启了压缩, 这个大小是压缩后的大小.

__binlogs__

* capacity: binlog 队列的最大长度
* min_seq: 当前队列中的最小 binlog 序号
* max_seq: 当前队列中的最大 binlog 序号

__replication__

可以有多条记录. 每一条表示一个连接进来的 slave(*client*), 或者一个当前服务器所连接的 master(*slaveof*).

* slaveof|client ip:port, 远端 master/slave 的 ip:port.
* type: 类型, sync 或者 mirror.
* status: 当前同步状态.
* last_seq: 上一条发送或者收到的 binlog 的序号.
* slaveof.id: master 的 id(这是从 slave's 角度来看的, 你永远不需要在 master 上配置它自己的 id).
* slaveof.copy_count: 在全量同步时, 已经复制的 key 的数量.
* slaveof.sync_count: 发送或者收到的 binlog 的数量.

__key\_range.*__

不同数据类型的 key 在 SSDB 中是排序的, 所以这个信息表示不同数据类型的最小 key 和最大 key.

__leveldb.stats__

这个信息显示了 LevelDB 每一层级的文件数量和文件总大小. 越小的层级如果文件越少, 那么数据库就越健康(查询更快速).

### info cmd

	ssdb 127.0.0.1:8899> info cmd
	version
		1.6.7
	cmd.get
		calls: 20000	time_wait: 27	time_proc: 472
	cmd.set
		calls: 267045	time_wait: 7431	time_proc: 7573
	cmd.setx
		calls: 111100	time_wait: 3663	time_proc: 6456
	cmd.del
		calls: 0	time_wait: 0	time_proc: 0

__cmd.*__

* calls: 该命令总共处理了多少次.
* time_wait: 命令在被处理前等待的总共时间(单位毫秒).
* time_proc: 命令处理总共消耗的时间(单位毫秒).

### compact

这个命令强制 SSDB 服务器对数据进行收缩(compaction), 收缩之后, 操作通常会变得更快.

但是, ```compact``` 的过程可能会拖慢正常服务, 特别是是当数据库比较大时. 所以, 建议在空闲时使用.
