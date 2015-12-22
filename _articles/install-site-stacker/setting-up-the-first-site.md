---
title: Setting up the first site
category: Install Site Stacker
date: 2015-12-23 00:00:00
---

This guide will show you how to set up the first site on a **SiteStacker 2** installation.

### 1. Creating a Language
1. Open the Language component by clicking on the Language icon.
2. Click on the `Add` button *(top left corner)*.
3. Select the language that you want from the `Language` drop down.
4. Add a `Name` and a `Title` for your language. The `Name` and `Title` can be anything you want or can be the same as the Language name.
5. Click on the `Save & Close` button

### 2. Creating a Template
1. Open the Templates component by clicking on the Templates icon.
2. Click on the `Add` button *(top left corner)*.
3. Add a `Name` to your template.
4. Select an existing template from the `Alias` drop down. This drop down will load all the templates created in SiteStacker 2 installation that were not yet created in Templates component.
5. Click on the `Save & Close` button

### 3. Setting up the Workflows
In order to be able to `add`/`edit`/`delete` content in Site Planner component you need to create some Workflows. The workflows and workflow stages are meant to control the front end visibility of a content item as well as who can access it in admin and make changes on it.

#### 3.1 Creating a workflow
1. Open the Workflows component by clicking on the Workflows icon.
2. Click on the `Add` button *(top left corner)*.
3. Add a `Name` and a `Description` to your workflow. A good example of a workflow name is **Default**.
4. Click on the `Save & Close` button.

> Repeat step 3.1 for each workflow you want to add

#### 3.2 Managing workflow stages
1. Right click the new created workflow in step 3.1 and click on the `Manage stages` option.
2. Click on the `Add` button *(top left corner)*.
3. Add a `Name` to your workflow stage. Some good examples of stage names are **Published** and **Unpublished**.
4. Select one or more of the available checkboxes according to what this stage will do.
5. Click on the `Save & Close` button.

> Repeat step 3.2 for each stage you have in the current workflow

#### 3.3 Assigning users on the workflow stages
1. Right click on any stage created in step 3.2 and click on the `Assign Users` option.
2. Click on the `Add` button *(top left corner)*.
3. Select the user that you want to assign to this stage from the `User` drop down. This drop down has a search functionality so that you can quickly search for a user.
4. Click on the `Save & Close` button.

> Repeat step 3.3 for each user that you want to assign and for each stage.

### 4. Setting up the Site and Site Channel

#### 4.1 Create a Site Collection
1. Open the Sites component by clicking on the Sites icon.
2. Click on `New Collection` button *(top left corner)*.
3. Add a `Name` to your collection for example **WMtek Sites**.
4. Click on the `Save & Close` button.

#### 4.2 Create a Site
1. Right click on the site collection created in step 4.1 and click on the `Add Site` option.
2. Add a `Name` to your site for example **WMtek Main**.
3. Click on the `Save & Close` button.

##### Options description
Name | Description
-------|------------
Name | The name of the site used more in admin side.
Authenticate | If true only authentication will be required to access this site.

#### 4.3 Create a Site Channel
1. Right click on the site created in step 4.2 and click on the `Add Channel` option.
2. Add a `Name` and a `Title` to your site channel for example **Desktop** or **Mobile**.
3. Fill up all the other fields according to your needs.
4. Click on the `Save & Close` button.

##### Options description
Name | Description
-------|------------
Name | The name of the site channel used more in admin side.
Title | Used as the default meta title for all the site channel pages.
Date Format | Default date format to be used in front end dates formatting.
Time Format | Default time format to be used in front end time formatting.
Timezone | Set the site channel timezone.
Force Primary | If this option is checked, any of the available site channel domains will redirect the request to the default one.
Mobile | Not used. No implementation yet.
Template | Set the template to be used by this site channel.
Language | Set the language to be used by this site channel.
Session Timeout | Set the lifetime of the session.
Session Timeout | If true the session will be forced to expire when the browser is closed.
Restricted Access | If true the access to this site channel will be according to the users ACL setting.
Show Captcha | Set the number of failed login attempts before a captcha will be displayed.

#### 4.4 Bind links to the Site Channel
1. Right click on the site channel created in step 4.3 and click on the `Manage Domains` option.
2. Click on the `Add` button *(top left corner)*.
3. Add the `Domain` that you want to be connected to this site channel.
4. Click on the `Save & Close` button.

##### Options description
Name | Description
-------|------------
Primary | Set the current domain as the site channel primary domain.
CDN | Set this domain to be used as a CDN.
Allow Wildcards | Set the domain to accept wildcards. For example if the domain is wmtek.com this option will make test.wmtel.com to work as well.

### 5. Adding the Index page

#### 5.1 Adding a global wrapper for all the pages.
1. Open the Site Planner component by clicking on the Site Planner icon.
2. Expand the right side tree until you reach the desired Site Channel.
3. Right click on the site channel and click on the `Add Folder` option.
4. Add a `Name` to the folder, for example **All Pages** and leave the `Alias` field empty. The reason of doing this is because all our site pages will be placed in this folder so we can add inherited items.
5. Click on the `Save & Close` button.

#### 5.2 Adding the index page
1. Right click on the folder created in step 5.1 and click on the `Add Page` option.
2. Fill the available options. For the `Alias` field use the **index** word.
3. Click on the `Save & Close` button.

##### Options description
Name | Description
-------|------------
Name | The name of the site channel used more in admin side.
Title | Used for the meta title page tag.
Alias | Used to generate a front end link. For example if the alias value is **my-page** than the front end URL will be wmtek.com/my-page.
Secure | Force the page to use SSL connection.
Authenticate | If true authentication will be required to access this page in front end.
Keyword | Used for the meta keywords page tag.
Description | Used for the meta description page tag.
Paging | Options to customize the ordering and limit of the items of a published folder.