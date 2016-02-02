---
title:  Server Redirects
---

## Apache

These lines need to be placed in the webroot/.htaccess file just below the "RewriteEngine On" line

### Test PHP Syntax

```php
$x = 1;
$arr = array(1, 'test');
print_r($arr);
```

### Redirect http to https

```conf
# Redirect everything to HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Permanent redirect

```
Redirect permanent / https://git.sitestacker.com/
```

### Redirect www to non-www

```conf
# Redirect www to non-www
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ http://%1/$1 [L,R=301]
```

### Redirect non-www to www
    # Redirect non-www to www
    RewriteCond %{HTTP_HOST} ^(?!www\.)(.+) [NC]
    RewriteRule ^(.*) http://www.%1/$1 [L,R=301]
> You cannot use both www redirects. Choose only one according to what you need.

## IIS

_not yet completed_
