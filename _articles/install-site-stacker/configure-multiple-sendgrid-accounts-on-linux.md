---
title: Configure multiple SendGrid accounts on Linux
category: Install Site Stacker
date: 2017-04-14 00:00:00
readtime: 2
---

This guide explains how to configure two or more SendGrid accounts on Linux running Postfix mail server.

To make this work we'll use Postfix's per-sender SASL passwords configuration, which allows switching credentials based on the envelope sender address (this is different from the "From" address, as will be explained below)

Before you begin make sure:
- you have the correct user/password for all SendGrid accounts
- you have SSH access with elevated permissions (login with `root` or use `sudo`)

## Configure Postfix

Edit Postfix main configuration file:

```bash
sudo nano /etc/postfix/main.cf
```

Make sure there are no other SendGrid settings, and add the following at the end of the file:

```apacheconf
relayhost = [smtp.sendgrid.net]:587
smtp_sasl_auth_enable = yes
smtp_sender_dependent_authentication = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_mechanism_filter = plain
smtp_sasl_security_options = noanonymous
smtp_tls_security_level = encrypt
header_size_limit = 4096000
```

Now create the `/etc/postfix/sasl_passwd` passwords file:

```bash
sudo nano /etc/postfix/sasl_passwd
```

In the `sasl_passwd` file is where the domain-credentials binding is done. Consider the following example:

```apacheconf
# Per-sender authentication
@mydomain.com              apikey:SG.[ApiID]-[ApiSecret]
@anotherdomain.com         apikey:SG.[ApiID]-[ApiSecret]
# ...add as many domains as you need...

# Login information for the default relayhost
[smtp.sendgrid.net]:587         apikey:SG.[ApiID]-[ApiSecret]
```

In the above example if the sender address ends in `@mydomain.com` it will use the `my_sendgrid_user` account, if it ends in `@anotherdomain.com` will use the `another_sendgrid_user` account.
If none of these match it will use the `default_sendgrid_user` account.

>Note: The `@domains` can be anything, but is recommended to use something easily identifiable, like the actual domain of the site (example: `@wmtek.com`, `@training.wmtek.com`) These domains are used internally, between PHP and Postfix, so they are different than the actual `From` address that the recipient will see.


## Configure Site Stacker

For each Site Stacker installation that should use a different SendGrid account than the default one, we need to add an additional parameter in the `email.php` config file.

Open the `email.php` config file on each installation:

```bash
sudo nano [sitestacker_root]/App/Config/email.php
```

In the `$default` configuration add the `additionalParameters` option. The following example assumes we're configuring the beforementioned `@mydomain.com` installation:

```php
public $default = array(
    'transport' => 'Mail',
    'from' => array('noreply@sitestacker.com' => 'SiteStacker'),
    'log' => 'email',
    'additionalParameters' => '-fsitestacker@mydomain.com'
);
```
> Note: There is no space between `-f` and `sitestacker`

The value for the `additionalParameters` is where we declare the sender address for the current installation. The most important thing to note is the use of `@mydomain.com`, this is required to match one of the domains declared in the `sasl_passwd` file.
The `sitestacker` part of the sender address can be anything.


## Reload Postfix

All is left is to make the Postfix configuration active:

```bash
sudo postmap /etc/postfix/sasl_passwd
sudo service postfix reload
```

Done. Thank you!
