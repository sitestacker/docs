---
title: Release Process
category: Develop on Site Stacker
date: 2016-05-23 00:00:00
readtime: 5
---

This guide is for developers and non-technical users alike who are involved in the Release Process and explains:

- what a typical Site Stacker setup looks like
- how changes become available on a sandbox environment
- how to create releases and add information for the client
- how to install and test new releases on a test environment
- how to edit the release notes for an existing release

## Prerequisites

First of all, you should be familiar with the [Branching and Release Workflow](branching-and-release-workflow) guide. Also this guide assumes all repositories and servers involved were properly configured by a developer. This includes:

- all repositories have one stable release branch (e.g. `2.x`) and one "next" release branch (e.g. `2.next`)
- System Manager is configured correctly to track a release branch and **Is Sandbox** is ON *only* on the development server

## A typical Site Stacker setup

A typical Site Stacker setup includes 3 servers:

1. Development (Sandbox) Server
2. Test (Staging) Server *(optional)*
3. Production Server

In System Manager, the three servers are configured as follows:

Server | Branch Filter | Is Sandbox
---|---|:---:
Development (Sandbox) | `2.x` `2.next` | :heavy_check_mark:
Test (Staging) | `2.x` `2.next` |
Production | `2.x` |

## Development (Sandbox) Server

Developers are responsible for making available the changes they work on by merging in development branches into release branches. In our example, development branches are merged into `next` as features are ready to be released at the next release cycle and `next` is merged into `2.next` to make the changes available.

After the changes are pushed into a release branch, they become available immediately on the development server, without needing to create a tag.

![Dev Update](https://git.sitestacker.com/sitestacker/docs/uploads/a6f4ff4398b5e93f4b78623396e07513/image.png)

### Create release

Once you're satisfied with the changes, you can create a release. The easiest way is from System Manager on the development server, using the **Create release** button:

![Create Release](https://git.sitestacker.com/sitestacker/docs/uploads/625cf92fae65929ef4b9291c26ff0316/create-release.png)

> Note: When you create a release in this way, you can be sure that the release will only contain the changes that were already installed on this server, and nothing else.

If you don't use the **Create release** button from System Manager, you'll have to enter the commit hash manually in the *Create from* field in GitLab.

#### Create a tag in GitLab

After clicking on **Create Release** button in System Manager, you'll be taken to the **New Tag** screen in GitLab where you should enter:

- **Tag name** (see [Release naming convention](branching-and-release-workflow#release-naming-convention))
- **Message** (see below)

![New Tag](https://git.sitestacker.com/sitestacker/docs/uploads/104e0d42e3e0b2183568090bcff15817/image.png)

Note that the *Release notes* section is ignored because that information is only stored in GitLab's database.

#### Tag message

The tag message is optional and can contain additional information that the [client will see when updating in System Manager](#test-server). There's no need to reiterate here all the changes in the release, because this is done automatically based on commit messages, as explained in the [Changelog](branching-and-release-workflow#changelog).

The tag message can contain references to any external materials, etc. so the client knows what to expect when updating.

## Test Server

Once a tag is created, it will become available on the installations that have that release branch configured in System Manager. In our example, it will become available on the development and test servers.

![Update on Test](https://git.sitestacker.com/sitestacker/docs/uploads/51775d2f7094fd15614099f62e934251/image.png)

At this point the release can be tested on the test server and, if everything is ok, the production server can be updated when the release lands in the stable release branch (e.g. `2.x`). If issues are found, the developers should fix them and the release process will restart.

## Production Server

Once the "next" release branch (`2.next`) is merged into the stable release branch (`2.x`) at each [release cycle](branching-and-release-workflow#release-cycle), the releases become available on the production server.

## Edit release

To edit an existing release, you need to delete the tag and create a new one in place.

### Find existing tag

You first need to find it. You can use the **View release** button in System Manager on the development server or you can search for it on GitLab.

![View Release](https://git.sitestacker.com/sitestacker/docs/uploads/dc25ccf9ba54471d87c1a364da438ba2/view-release.png)

### Add a new tag in place

After you find the tag, you should click on the commit hash and copy it to clipboard as follows:

![View Commit](https://git.sitestacker.com/sitestacker/docs/uploads/c8e34d44a86157b3471d781f3f02b14e/view-commit.png)

![Copy Commit](https://git.sitestacker.com/sitestacker/docs/uploads/f03b0fe30a482219f8d58913496248d9/copy-commit.png)

Now that you have the commit hash copied to clipboard, you can create the new tag using the GitLab interface:

![New Tag](https://git.sitestacker.com/sitestacker/docs/uploads/970302efa41df71e70ac2e2c2c8e9374/new-tag.png)

Paste the copied commit hash in the *Commit from* field and then follow the steps for [creating a release in GitLab](#create-a-release-in-gitlab). You might want to also copy the message from the existing tag.

### Delete existing tag

Back to the existing tag, you can now safely delete it from GitLab:

![Delete Tag](https://git.sitestacker.com/sitestacker/docs/uploads/0806acfd7b2278ebc028a340bfc6a51f/delete-tag.png)
