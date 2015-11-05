---
title: Creating Cron Jobs
category: Cron Jobs
date: 2015-03-21 00:00:00
---

For Cron Jobs to be working a system wide (unique) cron job must run *every minute* on the server.

On Windows, the command to run is `Console\cake.bat` and the parameter to be sent is `Cron.Cron pulse`.  
On Linux, the command to run is `Console\cake` and the parameter to be sent is `Cron.Cron pulse`.

Usually the cron job should be set to trigger every 2 minutes or 5 minutes.  
If required, you can either set it to be run to the lowest cron set up in Cron Management (Cron admin desktop icon).

For an example on how to set it all up on Windows, see [Setting up Cron on Windows](Setting-up-Cron-on-Windows).

## Cron Job Configuration example

Here is an example Configuration for a Cron Job in config.php

```php
<?php
return array(
    'Cron'=>array(
        array(
            'action'=>'delayedMessage',
            'expression' => '* * * * * *'
        )
    )
)
```

Cron Jobs themselves are instances of Cake Shell and should be located in the `Console/Command` dir of a plugin (component).  
The naming Convention is to use the component name suffixed by "CronShell", eg. `UsersCronShell`.

Here's an example of a cronjob for the configuration presented earlier.

```php
<?php
// Users/Console/Command/UsersCronShell.php

App::uses('AppShell', 'Console/Command');

class SystemMessagesCronShell extends AppShell {

    public function delayedMessage(){
        //send your delayed message here.
    }
}
```

Expressions are linux-based crontab expressions. Expressions like @daily, @monthly also work. See [Cron](http://en.wikipedia.org/wiki/Cron) for reference.

![](img/cron/working_with_crons.png)