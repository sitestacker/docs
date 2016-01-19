---
title: Server Errors
category: Install Site Stacker
date: 2016-01-19 00:00:00
---

This article documents server errors encountered in production and provides solutions.

## MariaDB error: 23 Out of resources

> SQLSTATE[HY000]: General error: 23 Out of resources when opening file '/tmp/#sql_559e_0.MYD' (Errcode: 24)

Other errors, from `/var/log/mariadb/mariadb.log`:

> [ERROR] Error in accept: Too many open files  
> [ERROR] mysqld: Can't open file: './db/table.frm' (errno: 24)

This likely means MySQL (or MariaDB) has reached the open files limit. Most of the solutions found on the internet [^out-of-resources] advise to check the `/etc/security/limits.conf` and `/etc/my.cnf` settings using:

```sh
$ sudo -u mysql bash
$ ulimit -a | grep open
open files             (-n) 30000
```

However after changing both files and restarting mysqld:

```sh
# /etc/my.cnf
open-files-limit = 30000

# /etc/security/limits.conf
mysql           soft    nofile          30000
mysql           hard    nofile          30000

# restart the service
$ systemctl restart mariadb
```

the value of `open_files_limit` in MySQL still says `1024`:

```sh
$ mysqladmin var | grep open_files_limit
| open_files_limit                  | 1024
```

This is because `systemd` has its own limit that controls how many files a service can open, regardless of what you configure in `/etc/my.cnf` or `/etc/security/limits.conf` [^increase-open-files-systemd] (at least on RHEL and CentOS 7). To verify this inspect MySQL's `/proc/XXX/limits` and check `Max open files`:

```sh
$ ps aux | grep mysql # find out mysql pid
mysql     6822  0.0  0.0 113252  1624 ?        Ss   05:12   0:00 /bin/sh /usr/bin/mysqld_safe --basedir=/usr
mysql     7443  0.0  1.5 1548996 123676 ?      Sl   05:12   0:01 /usr/libexec/mysqld --basedir=/usr --datadir=/var/lib/mysql --plugin-dir=/usr/lib64/mysql/plugin --log-error=/var/log/mariadb/mariadb.log --open-files-limit=30000 --pid-file=server-03.pid --socket=/var/lib/mysql/mysql.sock --port=3306
root      8544  0.0  0.0 112648   964 pts/1    S+   05:35   0:00 grep --color=auto mysql
$ cat /proc/7443/limits
Limit                     Soft Limit           Hard Limit           Units
Max cpu time              unlimited            unlimited            seconds
Max file size             unlimited            unlimited            bytes
Max data size             unlimited            unlimited            bytes
Max stack size            8388608              unlimited            bytes
Max core file size        0                    unlimited            bytes
Max resident set          unlimited            unlimited            bytes
Max processes             31209                31209                processes
Max open files            1024                 4096                 files
Max locked memory         65536                65536                bytes
Max address space         unlimited            unlimited            bytes
Max file locks            unlimited            unlimited            locks
Max pending signals       31209                31209                signals
Max msgqueue size         819200               819200               bytes
Max nice priority         0                    0
Max realtime priority     0                    0
Max realtime timeout      unlimited            unlimited            us
```

In this case it's set to `1024` and `4096` respectively. To raise this limit, set `LimitNOFILE` as explained in `/usr/lib/systemd/system/mariadb.service`:

```sh
$ cat /usr/lib/systemd/system/mariadb.service
# It's not recommended to modify this file in-place, because it will be
# overwritten during package upgrades.  If you want to customize, the
# best way is to create a file "/etc/systemd/system/mariadb.service",
# containing
#       .include /lib/systemd/system/mariadb.service
#       ...make your changes here...
# or create a file "/etc/systemd/system/mariadb.service.d/foo.conf",
# which doesn't need to include ".include" call and which will be parsed
# after the file mariadb.service itself is parsed.
#
# For more info about custom unit files, see systemd.unit(5) or
# http://fedoraproject.org/wiki/Systemd#How_do_I_customize_a_unit_file.2F_add_a_custom_unit_file.3F

# For example, if you want to increase mariadb's open-files-limit to 10000,
# you need to increase systemd's LimitNOFILE setting, so create a file named
# "/etc/systemd/system/mariadb.service.d/limits.conf" containing:
#       [Service]
#       LimitNOFILE=10000

# Note: /usr/lib/... is recommended in the .include line though /lib/...
# still works.
# Don't forget to reload systemd daemon after you change unit configuration:
# root> systemctl --system daemon-reload

[Unit]
Description=MariaDB database server
After=syslog.target
After=network.target

[Service]
Type=simple
User=mysql
Group=mysql

ExecStartPre=/usr/libexec/mariadb-prepare-db-dir %n
# Note: we set --basedir to prevent probes that might trigger SELinux alarms,
# per bug #547485
ExecStart=/usr/bin/mysqld_safe --basedir=/usr
ExecStartPost=/usr/libexec/mariadb-wait-ready $MAINPID

# Give a reasonable amount of time for the server to start up/shut down
TimeoutSec=300

# Place temp files in a secure directory, not /tmp
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

```sh
mkdir -p /etc/systemd/system/mariadb.service.d/
echo -e "[Service]\nLimitNOFILE=infinity" > /etc/systemd/system/mariadb.service.d/limits.conf

# reload configuration and restart service
systemctl daemon-reload
systemctl restart mariadb
```

You can inspect MySQL's `/proc/XXX/limits` again as above and you should see `Max open files = 65536`, which is what `LimitNOFILE=infinity` translates to.

[^out-of-resources]: [Upgrade to mysql 5.5 - SQLSTATE[HY000]: General error: 23 Out of resources](https://forums.cpanel.net/threads/upgrade-to-mysql-5-5-sqlstate-hy000-general-error-23-out-of-resources.286172/) or [Increasing nproc for processes launched by systemd on CentOS 7](http://serverfault.com/questions/628610/increasing-nproc-for-processes-launched-by-systemd-on-centos-7)
[^increase-open-files-systemd]: [Increase open-files-limit in MariaDB on CentOS 7 with systemd](https://ma.ttias.be/increase-open-files-limit-in-mariadb-on-centos-7-with-systemd/) and [MariaDB on CentOS 7 – “Error in accept: Too many open files”](http://blogs.reliablepenguin.com/2015/08/28/mariadb-on-centos-7-error-in-accept-too-many-open-files)
