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

### HTTP to HTTPS

This rule should be placed inside `<rules>...</rules>` in web.config:

```
<rule name="HTTP to HTTPS redirect" stopProcessing="true">
  <match url="(.*)" />
  <conditions>
    <add input="{HTTPS}" pattern="off" ignoreCase="true" />
  </conditions>
  <action type="Redirect" redirectType="Found" url="https://{HTTP_HOST}/{R:1}" />
</rule>
```

### Non-www to www

This rule should be placed inside `<rules>...</rules>` in web.config:

```
<rule name="CanonicalHostNameRule">
  <match url="(.*)"/>
  <conditions>
    <add input="{HTTP_HOST}" pattern="^www\.example\.com$" negate="true"/>
  </conditions>
  <action type="Redirect" url="https://www.example.com/{R:1}"/>
</rule>
```

:exclamation: Don't forget to replace `example.com` with your own domain.
