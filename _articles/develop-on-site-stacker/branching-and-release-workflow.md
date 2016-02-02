---
title: Branching and Release Workflow
category: Develop on Site Stacker
date: 2016-01-14 00:00:00
tags: development, model, strategy
readtime: 12
---

Site Stacker Branching and Release Workflow is a simple, git-based workflow that takes full advantage of git branches and tags. This guide explains how Site Stacker Workflow works and how to use it.

You should be familiar with git branches and tags (see [3. Git Branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) and [2.6 Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging) in the [Pro Git book](http://git-scm.com/book/en/v2)).

The Site Stacker Workflow is designed to be very simple, so any developer can pick it up easily. There are two types of branches: development and release branches.

![Site Stacker Branching Model](https://git.sitestacker.com/sitestacker/docs/uploads/a50ff7bcfb018e3148392ae00409c35c/ss-branching-model.png)

## Development branches

- `master` *(default, required)*
- `cool-feature` *(optional)*
- ...

When you're working on Site Stacker, you're usually adding a new feature or functionality or fixing some bugs - some of which are ready to go, and others which are not.

In every case, you should create a branch (based on `master`) that is called development branch. Changes you make on a branch don't affect the other branches, so you're free to experiment and commit changes, safe in the knowledge that your branch won't be merged until it's ready to be reviewed by someone you're collaborating with. You can also push any of these branches to the same named branch on the server.

<note>
Sometimes the changes are very simple and creating a development branch is overkill. In these situations you can commit directly on <code>master</code>, but make sure your changes are ready to be released at any time (and follow the same commit rules as below).
</note>

Except `master`, development branches are usually short-lived, but **are always temporary**, because eventually they will get deleted, after the changes have been merged or discarded. Keep in mind that the longer a development branch lives without getting merged in for a release, the greater risk for merge conflicts and challenges for deployment. Short lived branches merge and deploy cleaner.

### The `master` branch

`master` is a special development branch that has one very important rule: **anything in the `master` branch is always deployable**. This means, although the releases are made from [release branches](#release-branches), any code that lands in `master` needs to be deployable at any time, because the person who creates the release must assume this.

If you have changes that are not ready to be deployed, keep them in a development branch.

### Development branch naming convention

Development branch names should be descriptive (e.g. `refactor-authentication`, `user-content-cache-key`, `make-retina-avatars`), so others can see what is being worked on.

### Adding commits

Once your branch has been created, it's time to start making changes. Whenever you add, edit, or delete a file, you're making a commit, and adding them to your branch. This process of adding commits keeps track of your progress as you work on a development branch.

Commits also create a transparent history of your work that others can follow to understand what you've done and why. Each commit has an associated commit message, which is a description explaining why a particular change was made. Furthermore, **each commit is considered a separate unit of change**. This lets you roll back changes if a bug is found, or if you decide to head in a different direction.

<tip>
Commit messages are important, especially since Git tracks your changes and then displays them as commits once they're pushed to the server. By writing clear commit messages, you can make it easier for other people to follow along and provide feedback. See <a href="https://github.com/clns/node-commit-msg/blob/master/GUIDELINES.md">Commit Guidelines</a>.
</tip>

When working in a development branch, is also common to commit often and not necessarily following the above rules. That's perfectly fine as long as you [squash the commits](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Squashing-Commits) when you're merging in the branch. Also since this is a temporary branch you're free to [rewrite the history](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) as you feel appropriate, while notifying any co-worker that may be working on the same branch.

### Merging in the changes

When the changes are ready and tested, you can merge the branch into `master` (or other release branch), while making sure you maintain a clean history and follow the commit rules from above, [rewriting history](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) if necessary.

If you need to initiate a discussion about the changes before merging, you can [open a merge request](#open-a-merge-request) on GitLab. Or if you need to test your changes in production before merging, you can even [deploy the development branch](#deploy-branches) on a server.

#### Open a Merge Request

A merge request allows you to initiate a discussion about the commits in a branch. Because they're tightly integrated with the underlying Git repository, anyone can see exactly what changes would be merged if they accept your request.

You can open a Merge Request at any point during the development process: when you have little or no code but want to share some screenshots or general ideas, when you're stuck and need help or advice, or when you're ready for someone to review your work. By using GitLab's @mention system in your Merge Request message, you can ask for feedback from specific people or teams, whether they're down the hall or ten time zones away.

![Open Merge Request](https://git.sitestacker.com/sitestacker/docs/uploads/aa5fed38ff6a4cdf2a68f7e7d31c67c3/image.png)

Then in the next screen the **Source branch** is the branch you want to merge in (your development branch), and the **Target Branch** is where you want to merge it.

![New Merge Request](https://git.sitestacker.com/sitestacker/docs/uploads/02993d90736bd7f7ac08da586fc45c0d/image.png)

Once the Merge Request has been opened, the person or team reviewing your changes may have questions or comments. Perhaps the coding style doesn't match project guidelines, the change is missing unit tests, or maybe everything looks great and props are in order. Merge Requests are designed to encourage and capture this type of conversation.

You can also continue to push to your branch in light of discussion and feedback about your commits. If someone comments that you forgot to do something or if there is a bug in the code, you can fix it in your branch and push up the change. GitLab will show your new commits and any additional feedback you may receive in the unified Merge Request view.

### Deleting a development branch

Usually after merging in the changes, you can delete a development branch. This is almost always the case when merging into `master`, but if you merge into another release branch, you may want to keep the development branch for longer to be merged into `master` at a later time (see the `new-processor` branch in the diagram above).

This is the case because `master` gets often merged into other release branches (e.g. tag `wycliffe-1.1.2` in the diagram above), however a release branch doesn't get merged into `master` (except in rare cases when it is no longer necessary), so keeping the branch for later makes sense.

## Release branches

- `release` *(required)*
- `<client>` *(optional)*
- ...

Release branches are used only for merging in development branches and creating releases. They never contain any normal commits and **you should never commit on release branches**.

The main release branch is `release`, but other release branches can be created as well, mainly with the purpose of providing a different release stream for a particular client. For example the `release` branch contains releases that most clients get (e.g. `2.1.3`), but other clients might need specially tailored releases (e.g. `wycliffe-1.3.2`), so a different release branch needs to be created.

Release branches are usually long-lived, but it's also possible to delete a release branch if it's no longer needed, thus changing the release stream for that client back to the `release` branch.

<note>
If the <code>release</code> branch doesn't exist, you need to <a href="#creating-a-release-branch">create it</a>.
</note>

### Release branch naming convention

Release branches should be named as simple as possible, usually using the
client name (e.g. `wycliffe`).

### Creating a release branch

Release branches are always created from `master`. To create a new release branch, you need to make an empty commit first, and then simply merge other development branches, as desired (check the diagram above).

The following cli commands create the `release` branch and push it to the server:

```sh
git checkout -b release
git commit --allow-empty -m "Create 'release' branch"
git push -u origin release
```

### Deleting a release branch

If a release branch is no longer needed, you can simply delete it, but if for some reasons it contains changes that you need to merge into `master`, it's very important to **delete any tags created for that branch**, so they won't show up in `master` and pollute it. Deleting these releases won't affect the client's installation.

## Releases

Releases are git tags that mark a specific point in history and add information about what that release contains and other relevant information. The information should be suited for clients to read and understand what changed.

Releases should only be created on release branches, not on development branches. Also you should not create releases just for testing the changes on a server - use branches for that (see [System Manager - Deploy branches](#deploy-branches)).

### Release naming convention

The naming convention for releases is pretty simple, however it's different for releases on the `release` branch and releases on other release branches.

#### Releases on `release` branch

These are considered the "main" releases that regular clients get and should follow the [semver](http://semver.org/) rules. In short, releases are 3-digit version numbers in the format `MAJOR.MINOR.PATCH` (e.g. `1.0.1`). For complete details see [semver](http://semver.org/).

#### Releases on other release branches

These are usually created for specific clients and can be named in any way that's best suited for the client. However take into account these simple rules:

- should not be named as the `release` branch releases (e.g. as a version number only)
- it's recommended they all include a prefix, maybe the branch name (e.g. `wycliffe-1.0.1` or `wycliffe-1.0`)

<note>
Note that git tags are unique, so no matter on what branch you are you cannot have two tags with the same name.
</note>

### Creating a release

The easiest way to create a release is from GitLab. The [New Tag](https://git.sitestacker.com/sitestacker/sitestacker/tags/new) interface allows a non-developer to create a release very easily. However this is not possible at the moment because the interface doesn't allow multi line message for the tag, so we cannot add release-specific information like what changes are included. This is tracked at [gitlab-org/gitlab-ce#3690](https://gitlab.com/gitlab-org/gitlab-ce/issues/3690).

Until this issue is resolved, the only way to create a release is from the command line (using `git tag -a`) or from a GUI program (e.g. PhpStorm).

## System Manager

In System Manager you can update an installation to **any** branch or tag you desire (we'll call these *updates*). The only restriction is that System Manager will not show updates that have incompatible database migrations, and will warn you if an update contains database migrations, thus preventing a roll back.

By default, System Manager shows all available tags and no branches. This is not normally what you want on a test or production server, so you can configure this in the *Settings* window in System Manager, accessible from the bottom right gear icon.

![System Manager Settings](https://git.sitestacker.com/sitestacker/docs/uploads/69c202d4f13ccb9db595a25a2b248762/image.png)

### Filter branches

<note>
Tags are tightly coupled with branches, so to limit which tags are available on an installation you need to filter the branches that <b>the tags are accessible from</b>.
</note>

You can filter the branches in the **Branch Filter** section of the *Settings* screen in System Manager. The page is pretty self-explanatory.

#### Default installation filter

A default installation that gets its updates from the `release` branch looks like this:

```
. = refs/remotes/origin/release
packages/** = refs/remotes/origin/release
```

This means the Site Stacker core repo (`.`) is filtered to use the `release` remote branch (refs/remotes/origin/) and all other subrepos in `packages/` (including components, templates and themes) are using their `release` branches as well.

#### Custom client installation filter

A custom client installation might be configured to get its Site Stacker core updates from the `wycliffe` branch, while all other subrepos will use their `release` branches. This is very common because any subrepos will probably only have a `release` branch. The filters for such installation look like this:

```
. = refs/remotes/origin/wycliffe
packages/** = refs/remotes/origin/release
```

### Deploy branches

On a sandbox installation, it's very common you want to deploy branches instead of tags, so you can quickly test things out without needing to make an official release. To enable this simply toggle the **Is Sandbox?** button in the System Manager *Settings* screen, and make sure you have at least one development branch in the **Branch Filter**.

You can deploy any branch by adding the appropriate branch filter. [In the example above](#custom-client-installation-filter), the installation that uses the `wycliffe` branch for updates will also see the `master` and `cool-feature` branches as available updates for the core Site Stacker:

```
. = refs/remotes/origin/wycliffe
packages/** = refs/remotes/origin/release
. = refs/remotes/origin/master
. = refs/remotes/origin/cool-feature
```

## Further Reading

The Site Stacker Workflow is very similar to the [GitHub Flow](https://guides.github.com/introduction/flow/index.html), so you can check that out as well.
