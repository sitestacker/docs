---
title: Release Process
category: Develop on Site Stacker
date: 2016-05-06 00:00:00
readtime: 5
---

This guide is for developers and non-technical users alike who are involved in the Release Process and explains:

- what a typical Site Stacker setup looks like
- how changes flow from development to release branches
- how changes are pushed to a sandbox environment
- how to create releases and add information for the client
- how to install and test new releases on a test environment
- how to edit the release notes for an existing release

## Prerequisites

First of all, you should be familiar with the [Branching and Release Workflow](branching-and-release-workflow) guide. Also this guide assumes all repositories and servers involved were properly configured by a developer. This includes:

- all repositories have at least one release branch (e.g. `2.5`)
- System Manager is configured correctly to track a release branch and **Is Sandbox** is ON *only* on the development server

## A typical Site Stacker setup

A typical Site Stacker setup includes 3 servers:

1. Development (Sandbox) Server
2. Test (Staging) Server *(optional)*
3. Production Server

In this guide we'll assume the latest release branch is `2.5`, however it can be replaced verbatim with any other release branch.

All servers use the `2.5` branch to get the updates from, in System Manager. So the Branch Filter looks like this:

![System Manager Settings](https://git.sitestacker.com/sitestacker/docs/uploads/e4c099dc0aa22073d183ce6fbdb73922/image.png)

The only difference is the development server, which has **Is Sandbox** turned ON.

### Changes Flow

The following image shows how changes get from development branches (e.g. `master`) into release branches:

![SS Branching Flow](https://git.sitestacker.com/sitestacker/docs/uploads/e2baf71cb633fe3c357feee84e511cb6/branch-flow.jpg)

## Development (Sandbox) Server

Developers are responsible for making available the changes they work on by merging in development branches into release branches. In our example, development branches are merged into `master` as features are ready for production and `master` is merged into `2.5` to make the changes available.

After the changes are pushed into a release branch, they become available immediately on the development server.

![Dev Update](https://git.sitestacker.com/sitestacker/docs/uploads/7ad609a2188e9930159cf07628670642/image.png)

### Create release

Once you're satisfied with the changes, you can create a release. The easiest way is from System Manager on the development server, using the **Create release** button:

![Create Release](https://git.sitestacker.com/sitestacker/docs/uploads/625cf92fae65929ef4b9291c26ff0316/create-release.png)

> Note: When you create a release in this way, you can be sure that the release will only contain the changes that were already installed on this server, and nothing else.

If you don't use the **Create release** button from System Manager, you'll have to enter the commit hash manually in the *Create from* field in GitLab, which will require a developer to do this.

#### Create a release in GitLab

After clicking on **Create Release** button in System Manager, you'll be taken to the **New Tag** screen in GitLab where you should enter:

- **Tag name** (see [Release naming convention](branching-and-release-workflow#release-naming-convention))
- **Message** (see below)

![New Tag](https://git.sitestacker.com/sitestacker/docs/uploads/104e0d42e3e0b2183568090bcff15817/image.png)

Note that the *Release notes* section is ignored because that information is only stored in GitLab's database.

#### Release message

The release message is [what the client sees](#test-and-production-servers) when they update to a release. It should contain all the information relevant to that release, including major changes and fixes, references to any external materials, etc. so the client knows what to expect when updating. This information should begin at the previous release (tag).

To find out what the major changes and fixes are, the easiest way is to use the button next to **Create release** in System Manager:

![View Diff](https://git.sitestacker.com/sitestacker/docs/uploads/ec251c4487a07e1c33a3351a4f96f9e9/view-diff.png)

You'll be taken to the **Compare** view in GitLab where you can see all the commits and the files that were changed since the previous tag. You might want to *Switch base of comparison* to see changes that will be removed from the release (if any):

![Switch Comp Base](https://git.sitestacker.com/sitestacker/docs/uploads/dc21e46719434003a364b08d7ef4dbb2/switch-comp-base.png)

*Note that this is an advanced tool and you should understand how it works in order to perform correct comparisons.*

## Test and Production Servers

Once a release is created, it will become available on the test (staging) and production servers.

![Update on Test](https://git.sitestacker.com/sitestacker/docs/uploads/51775d2f7094fd15614099f62e934251/image.png)

At this point the release can be tested on the test server and, if everything is ok, the production server can be updated. If issues are found, the developers should fix them and the release process will restart.

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
