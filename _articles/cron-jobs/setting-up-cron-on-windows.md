---
title: Setting up Cron on Windows
category: Cron Jobs
date: 2015-05-31 00:00:00
---

The **Cron** component handles all necessary cron jobs for the entire system. It works by configuring only 1 cronjob for an entire installation, and that will search for and run all available cronjobs based on their cron expression.

## Configure the Task

1. Open **Task Scheduler**.
2. In the main menu, select *Action* -> *Create Task*.
3. Under the General tab, enter the following:  
  Name: "Site Stacker Cron"  
  Select "Run whether user is logged on or not" under the *Security options* section.  
  The window should look like this:  
  ![](img/cron/create-task-general.png)
4. Switch to the Triggers tab and hit New. Configure the fields like the following:
  ![](img/cron/create-task-triggers.png)
5. Switch to the Actions tab and hit New. In order to know what to input here, open **cmd** and run the following commands:  
  ```sh
cd \path-to-sitestacker-root\
Console\cake Cron.Cron scheduler
```
  The CLI should display something similar to:  
  ![](img/cron/create-task-cmd.png)  

  Based on this info, configure the action fields which should look similar to:  
  ![](img/cron/create-task-actions.png)
6. Hit OK. Now the task is correctly scheduled to run *every minute*.

## Configure System Jobs

1. In admin, open the **Cron** component.
2. Hit the Add button to add any Cronjob you want. Note that each component that appears in the dropdown exposes one or more jobs that should be configured if you want it to run. You should see something similar to this:
  ![](img/cron/cron-add-jobs.png)
3. All jobs come with pre-existing data. For additional expressions, see [Cron](http://en.wikipedia.org/wiki/Cron).