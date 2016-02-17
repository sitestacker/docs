---
title: Release and QA Process
category: Develop on Site Stacker
date: 2016-02-17 00:00:00
readtime: 5
---

This guide is for both developers and non-technical users who are involved in the Release and Quality Assurance Process. It explains:

- what a typical Site Stacker setup looks like
- how changes flow from development to release branches
- how changes are pushed to a development environment
- how to create releases and add information for the client
- how to install and test new releases on a test environment
- how to edit the release notes for an existing release
- how to push releases to production

## Prerequisites

This guide assumes all repositories and servers involved were properly configured by a developer. This includes:

- repositories have at least one release branch available (e.g. `release`, a client-specific branch)
- System Manager *Settings* are configured to track **only one release branch** and no other branches in *Branch Filter* and *Is Sandbox* is ON only on the development server

Detailed information about this is available in the [Branching and Release Workflow](branching-and-release-workflow) guide.

*Make sure these prerequisites are met before continuing.*

## A typical Site Stacker setup

A typical Site Stacker setup includes 3 servers:

1. Development (Sandbox) Server
2. Test (Staging) Server *(optional)*
3. Production Server

and 2 release branches:

1. `release-test` *(optional)*
2. `release`

In this guide we'll assume our release branch is called `release`, however it can be replaced verbatim with any other client-specific release branch.

The development and test servers should be configured to use the `release-test` branch and the production server should use `release`. If `release-test` doesn't exist, all servers should use `release`.

![SS Branching Flow](https://git.sitestacker.com/sitestacker/docs/uploads/56f5d9bc7e64b8a6bc4a021485f2b0a4/SS_Branching_Flow.jpg)

The above image shows how changes flow from development branches (e.g. `master`) to the two release branches we have.

## Development (Sandbox) Server

Developers are responsible for making available the changes they work on by merging in development branches into release branches. In our example, development branches are usually merged into `master` and `master` is periodically merged into `release-test`.

After new changes are pushed into a release branch, the development server can be updated by QA people right away.

![Dev Update](https://git.sitestacker.com/sitestacker/docs/uploads/7ad609a2188e9930159cf07628670642/image.png)

### Create release

Once you're satisfied with the changes, you can create a release.

<important>
Before creating a release, make sure you're not on a development branch. The easiest way is to check the <b>Branch Filter</b> field in System Manager <i>Settings</i>. If you're unsure, ask a developer.
</important>

The easiest way to create a release is from System Manager on the development server, using the *Create release* button:

![Create Release](https://git.sitestacker.com/sitestacker/docs/uploads/625cf92fae65929ef4b9291c26ff0316/create-release.png)

<note>
When you create a release in this way, you can be sure that the release will only contain the changes that were already updated on this server, and nothing else.
</note>

If you don't use the *Create release* button in System Manager you'll have to enter the commit hash manually in the *Create from* field in GitLab, which will require a developer to do this.

#### New Tag

![New Tag](https://git.sitestacker.com/sitestacker/docs/uploads/104e0d42e3e0b2183568090bcff15817/image.png)

You'll be taken to the *New Tag* screen in GitLab where you should enter:

- the **Tag name** (see [Release naming convention](branching-and-release-workflow#release-naming-convention))
- the **Message** (see below)

Note that the *Release notes* section is ignored because that information is only stored in GitLab's database.

#### Release message

The release message is [what the client sees](#test-staging-server) when they update to a release. It should contain all the information relevant to that release, including major changes and fixes, references to any external materials, etc. so the client knows what to expect when updating. This information should begin at the previous release (tag).

To find out what the major changes and fixes are, the easiest way is to use the button next to *Create release* in System Manager:

![View Diff](https://git.sitestacker.com/sitestacker/docs/uploads/ec251c4487a07e1c33a3351a4f96f9e9/view-diff.png)

You'll be taken to the *Compare* view in GitLab where you can see all the commits and the files that were changed. You might want to *Switch base of comparison* as well to see changes that will be removed from the release:

![Switch Comp Base](https://git.sitestacker.com/sitestacker/docs/uploads/dc21e46719434003a364b08d7ef4dbb2/switch-comp-base.png)

*Note that this is an advanced tool and you should understand how it works in order to perform correct comparisons.*

## Test (Staging) Server

Once a release is created, it will become available on the test server.

![Update on Test](https://git.sitestacker.com/sitestacker/docs/uploads/51775d2f7094fd15614099f62e934251/image.png)

After the changes are tested on this server, there are three things that can happen:

1. Everything works fine but you want to [edit the release notes](#edit-release) before releasing to production.
2. There are new bugs found that require additional work before releasing to production. In this case the job goes back to the developers.
3. Everything is good and you want to [release to production](#release-to-production).

### Edit release

To edit an existing release, you need to delete the tag and create a new one in place.

#### Find existing tag

You first need to find it. You can either use the *View release* button in System Manager or you can search for it on GitLab.

![View Release](https://git.sitestacker.com/sitestacker/docs/uploads/dc25ccf9ba54471d87c1a364da438ba2/view-release.png)

#### Add a new tag in place

After you find the tag, you should click on the commit hash and copy it to clipboard as follows:

![View Commit](https://git.sitestacker.com/sitestacker/docs/uploads/c8e34d44a86157b3471d781f3f02b14e/view-commit.png)

![Copy Commit](https://git.sitestacker.com/sitestacker/docs/uploads/f03b0fe30a482219f8d58913496248d9/copy-commit.png)

Now that you have the commit hash copied to clipboard, you can create the new tag using the GitLab interface:

![New Tag](https://git.sitestacker.com/sitestacker/docs/uploads/970302efa41df71e70ac2e2c2c8e9374/new-tag.png)

Paste the copied commit hash in the *Commit from* field and then follow the steps for [creating a release](#new-tag). You might want to also copy the message from the [existing tag](#find-existing-tag).

#### Delete existing tag

Back to the [existing tag](#find-existing-tag), you can now safely delete it from GitLab:

![Delete Tag](https://git.sitestacker.com/sitestacker/docs/uploads/0806acfd7b2278ebc028a340bfc6a51f/delete-tag.png)

### Release to production

After all QA User Tests have passed on the test server and the release notes include all the necessary information for the client, the release can be deployed to production.

Releasing to production is done by merging the `release-test` branch into `release`, thus making the newly created tag available on production servers. This should be done by a developer.
