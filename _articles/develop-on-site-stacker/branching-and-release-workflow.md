---
title: Branching and Release Workflow
category: Develop on Site Stacker
date: 2016-05-23 00:00:00
tags: development,model,strategy
readtime: 10
---

Site Stacker Branching and Release Workflow is a git-based workflow that takes full advantage of branches and tags. This guide explains how Site Stacker Workflow works and how to use it.

> You should be familiar with git branches and tags (see [3. Git Branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) and [2.6 Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging) in the [Pro Git book](http://git-scm.com/book/en/v2)).

There are two types of branches: **development** and **release** branches. The following diagram shows a visual representation of branches and tags in a Site Stacker repository.

![Site Stacker Branching Model](https://git.sitestacker.com/sitestacker/docs/uploads/74ceaf15a8428bff873d2c5e13484845/new-branching-model.jpg)

## Development branches

- `master` *(default, required)*
- `next` *(common, optional)*
- `cool-feature` *(optional)*
- ...

When you're working on Site Stacker, you're usually adding a new feature or functionality or fixing some bugs - some of which are ready to go, and others which are not. Branching exists to help you manage this workflow.

When you create a branch in your project, you're creating an environment where you can try out new ideas. Changes you make on a branch don't affect the other branches, so you're free to experiment and commit changes, safe in the knowledge that your branch won't be merged until it's ready to be reviewed by someone you're collaborating with. You can also push any of these branches to the same named branch on the server (e.g. `cool-feature` -&gt; `origin/cool-feature`).

Except `master` and `next`, development branches are usually short-lived, but **are always temporary**, because they will eventually get deleted, after the changes have been merged or discarded. Keep in mind that **the longer a development branch lives without getting merged in for a release, the greater risk for merge conflicts and challenges for deployment**. Short lived branches merge and deploy cleaner.

> Important: You should never create releases (git tags) on a development branch.

### The `master` branch

`master` is the main development branch that contains the latest stable code. The only rule is that **anything in the `master` branch is always deployable**. This means that, although the releases are made from [release branches](#release-branches), any code that lands in `master` should be ready to be released at any time, because the person who creates the release must assume this.

Because of this, you should only do urgent bug fixes on the `master` branch (or any other branch created from `master`). For adding new features, see the `next` and feature branches below.

### The `next` branch

`next` is a special development branch that contains **all the new features that will be released at the next [release cycle](#release-cycle)**. Normally, you develop new features in feature branches, but because there is the need to test all these features together, you use the `next` branch to merge these feature branches in.

During development, you'll often merge `master` into `next` to get the latest bug fixes from `master`. At the [release cycle](#release-cycle), `next` gets merged into `master`, thus making all the features available for production.

> Note: If you're working on features that are not ready to be released at the next [release cycle](#release-cycle), keep them in separate branches instead of merging in `next`.

### Other development branches (feature branches)

Best practices are to always use feature branches when developing anything. Since a feature branch should contain an isolated feature started from stable code, you usually create feature branches from `master`.

Sometimes the changes are very simple and creating an extra branch is overkill. In these situations you can commit directly on `master` or `next`, but make sure you adhere to the rules of the branch.

### Development branch naming convention

Development branch names should be descriptive (e.g. `refactor-authentication`, `user-content-cache-key`, `make-retina-avatars`), so others can see what is being worked on.

The only restriction is that they cannot begin with a version number (e.g. `2.0-my-branch`), because this prefix is reserved for release branches.

### Adding commits

Once your branch has been created, it's time to start making changes. Whenever you add, edit, or delete a file, you're making a commit, and adding them to your branch. This process of adding commits keeps track of your progress as you work on a development branch.

Commits also create a transparent history of your work that others can follow to understand what you've done and why. Each commit has an associated commit message, which is a description explaining why a particular change was made. Furthermore, **each commit is considered a separate unit of change**. This lets you roll back changes if a bug is found, or if you decide to head in a different direction.

> Tip: Commit messages are important, especially since Git tracks your changes and then displays them as commits once they're pushed to the server. By writing clear commit messages, you can make it easier for other people to follow along and provide feedback. See [Commit Guidelines](https://github.com/clns/node-commit-msg/blob/master/GUIDELINES.md).

When working in a development branch, is also common to commit often and not necessarily following the above rules. That's perfectly fine as long as you [squash the commits](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Squashing-Commits) when you're merging in the branch. Also since this is a temporary branch you're free to [rewrite the history](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) as you feel appropriate, while notifying any co-worker that may be working on the same branch.

#### CHANGELOG

Stacker doesn't have a [Changelog](https://en.wikipedia.org/wiki/Changelog) file in the root of the repository, instead the Changelog is generated automatically from the commit messages and showed to the client in System Manager.

In order to add information to the Changelog, you need to include a `CHANGELOG` keyword in the commit message, and everything that follows will be part of the Changelog. `CHANGELOG` should be uppercase and should come after a blank line, e.g.:

```
Commit subject

Optional commit body message.

CHANGELOG

- Everything here will be included in the Changelog
- You can enumerate the changes as a list or any
other way you find suited
```

> Note: Not every commit should have a `CHANGELOG`. Also if a feature is comprised of more than 1 commit, you should add the `CHANGELOG` to the last commit.

> Important: The Changelog message should be written from a client point of view, and should be easily understandable by a non-technical person.

Anything that you add *after* the CHANGELOG keyword will be shown to the client, so don't add things that shouldn't be, like the task number. Here's an example of **A WRONG COMMIT MESSAGE**:

```
# THIS IS A WRONG COMMIT MESSAGE !!!

CHANGELOG

- Everything here will be included in the Changelog

Task #15028
```

### Merging in the changes

When the changes are ready and tested, you can merge the branch back into `master` (or into a release branch), while making sure you maintain a clean history and following the commit rules from above, [rewriting history](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) if necessary.

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

Usually after merging in the changes, you can delete a development branch. However, you might want to keep the branch a bit longer for any bug fixes that may be needed, but make sure you eventually delete the branch.

> Note: The creator of a feature branch is responsible for deleting it when it's no longer needed.

## Release branches

- `2.x` *(latest stable)*
- `2.next` *(latest dev)*
- ...

Release branches provide a stream of updates for a specific version of Site Stacker. They are used for merging in development branches and creating releases (tags) from these merges, and are never merged into development branches.

At least one release branch needs to exist to be able to push changes to Site Stacker installations. A release branch is easily identifiable because it always starts with a version number and, optionally, is followed by letters and hyphens.

There is a direct correlation between development branches `master` and `next` and release branches. In order to make the changes in these branches available to Site Stacker installations each one needs a release branch, e.g.:

Development Branch | Release Branch
--- | ---
`master` | `2.x`
`next` | `2.next`

This means that, whenever `master` is merged into `next` or vice versa, the corresponding release branches should also be merged (e.g. at the [release cycle](#release-cycle)).

Other release branches may also exist for previous versions or even for specific clients. Client-specific release branches provide a separate release stream for that client.

Release branches are usually long-lived, but it's also possible to delete a release branch if it's no longer needed.

> Important:
>
> - Release branches should never be merged into development branches
> - You shouldn't work directly on a release branch (although there are exceptions, see below)
> - Fast-forward merges are not allowed when merging a development branch into a release branch (see [Git - Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging))

### Working with release branches

While working with development branches is trivial, release branches require special attention.

#### Current version

The system current version usually has 2 release branches, one for stable releases (e.g. `2.x`) and one for testing new features that will be released soon (e.g. `2.next`). Since these branches correspond to a development branch, any work should be done on the development branches, then merge them.
You should **never commit directly on these release branches**.

#### Older release branches

Older release branches can also exist (e.g. `2.0`), and these branches don't have a corresponding development branch. Although new features are only developed for the current version, a bug might arise that needs to be fixed. In this case, you have 2 options:

1. If the fix is very small you can do it directly on the release branch by checking out the branch (e.g. `git checkout 2.0`) (*not recommended*)
2. If the fix involves more work, you can switch to a new branch created from the release branch (e.g. `git checkout -b 2.0-fix-contributions-bug 2.0`) and when you're done merge that branch in (e.g. `git checkout 2.0; git merge 2.0-fix-contributions-bug`) (*recommended method*)

Method #2 is recommended, and there are some things to consider:

- the new branch name should start with the release branch name, since it's a temporary release branch and **not** a development branch
- **the new branch should not be merged into any other branch except the one that was created from** (release branch rule)

> Important: Branches created from other release branches are always release branches, not development branches.

##### Getting the fixes from older release branches

If you need to get the fixes made on older release branches into other branches you need to use [`cherry-pick`](https://git-scm.com/docs/git-cherry-pick) since you can't merge these branches. If you used method #2 as described above, cherry-picking all commits from that new branch is very easy, e.g.:

```
git cherry-pick 2.0..2.0-fix-contributions-bug
```

If you used method #1 you'll have to cherry-pick each commit individually.

### Release branch naming convention

Release branches always start with a version number and can contain keywords like `x` or `next` (e.g. `2.x`, `2.next`).

Client release branches contain a client-specific suffix, usually the client's name or an abbreviation (e.g. `2.x-oscorp`).

### Creating a release branch

To make sure fast-forward merges can't happen (release branch rule), when creating a release branch you should add an empty commit, e.g.:

```sh
git checkout -b 2.next
git commit --allow-empty -m "Create release branch '2.next'"
git push -u origin 2.next
```

### Deleting a release branch

If a release branch is no longer needed, you can simply delete it. Deleting these branches won't affect the client's installation, but will end the stream of updates coming on that branch.

### Information about release branches

Every repository should include in their README information about each release branch. For example, a template might have 2 release branches (`1.x` and `2.x`) and `1.x` works with Site Stacker `2.0` while `2.x` works only with Site Stacker `2.x`. This needs to be specified in the README. For an example see the [Site Stacker README](https://git.sitestacker.com/sitestacker/sitestacker/blob/master/README.md).

### Release cycle

Site Stacker release cycle is once every month, on the 22th.

At each release cycle, the "next" branches are merged into the latest stable branches as follows:

Branch to be merged | Branch to merge into
---|---
`next` | `master`
`2.next` | `2.x`

## Releases

Releases are simply git tags that mark a specific point in history. A tag can optionally include in its message details about the release and other relevant information. This information should be suited for clients to read.

> Important: Tags should only be created on release branches, **never** on development branches.

It's important to understand that once a tag is created, it will be available for update on client installations. If you want to point out that a release is non-production ready, you should append `alpha` or `beta` keywords to its name (e.g. `2.5.1-alpha`, `2.5.1-beta`), according to [semver](http://semver.org).

### Release naming convention

Release names follow [semver](http://semver.org) and should be named according to the branch they're on. The following table shows valid release names based on the branch:

Branch | Valid release names
------ | -------------------
`2.0` | `2.0.0`, `2.0.1-alpha`, `2.0.1`, `2.0.12`
`2.x` | `2.5.0`, `2.5.1-alpha`, `2.5.1`, `2.5.12`
`2.x-oscorp` | `2.5.0-oscorp`, `2.5.1-beta-oscorp`, `2.5.1-oscorp`

> Note: Git tags are unique, so no matter on what branch you are you cannot have two tags with the same name.

### Creating a release

See [Create release](release-process#create-release) in the [Release Process](release-process) guide.

## System Manager

You can configure System Manager to receive updates from any branch, but you should normally only use release branches, especially on client installations. Note that System Manager will not show updates that have incompatible database migrations.

> Note: If you don't configure any branch filter, System Manager will show **all tags from all branches**. This is not normally what you want on an installation.

![System Manager Settings](https://git.sitestacker.com/sitestacker/docs/uploads/74e6b3ab02ef04d6bb2146d011e55fdf/image.png)

### Branch Filter

To limit which tags are available for update on an installation, you need to filter the branches that the tags are accessible from. You can do this in the **Branch Filter** section of the *Settings* screen in System Manager. The page is pretty self-explanatory.

#### Default branch filter

A default installation should receive updates from the latest stable release branch. For example, if the latest stable release branch is `2.x` for Site Stacker core and `1.x` for all subrepos, the branch filter looks like this:

```
. = refs/remotes/origin/2.x
packages/** = refs/remotes/origin/1.x
```

#### Client-specific branch filter

If using client-specific release branches, these can be configured as any other branches in System Manager Branch Filter. Usually a client-specific branch only exists in the Site Stacker core, other sub-repositories don't need one because they are specific to that client (e.g. a client-specific template).

```
. = refs/remotes/origin/2.x-oscorp
packages/** = refs/remotes/origin/1.x
```

### Is Sandbox

The **Is Sandbox** setting allows an installation to see updates as soon as they are pushed to a branch, without having to create a tag. This option is usually used on a sandbox development installation (not a client sandbox), because it allows testing the changes and eventually creating a release (tag).

For example, to test the [fixes we've made on the `2.0-fix-contributions-bug` release branch above](#older-release-branches), we can add the temporary branch to the branch filter:

```
. = refs/remotes/origin/2.0-fix-contributions-bug
```

> Note: As soon as you're done testing, you should remove the temporary branch from the Branch Filter.

## Appendix

### Helper command to merge without checkout

To merge a development branch into a release branch, you normally need to switch (checkout) to the release branch and merge the development branch in. This can become a drag, especially when having uncommitted changes.

You can configure a special [git alias](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases) that will do the merge without checking out the release branch and push it to the server. Note that this **only works when the merge can be done automatically**. It doesn't work for merges that require conflict resolution.

If you do attempt a merge that requires conflict resolution, the command will abort the merge and leave your working directory clean, UNLESS the branch you're merging to is the current branch, in which case it will leave the merge in the working directory for you to resolve the conflict and commit, just like `git merge`.

> Note: You should have at least Git 2.0. Check your current Git version by running `git --version` in a shell.

To configure the alias run the following command in your shell:

==Block:PowerShell==

```powershell
git config --global alias.merge-to '!sh -c ''set -e; targetBranch() { if [ $# -eq 1 ]; then echo $1; else echo $2; fi; }; sourceBranch() { if [ $# -eq 1 ]; then echo $(git symbolic-ref -q --short HEAD); else echo $1; fi; }; targetRemote() { u=$(git rev-parse --abbrev-ref --symbolic-full-name $(targetBranch $@)@{u} 2>/dev/null) || true; if [ $u ]; then echo ${u%/*}; else echo; fi; }; if [ $# -eq 0 ]; then echo error: no target branch given >&2; exit 1; fi; if ! git forward-merge -h &>/dev/null; then bindir=$(dirname $(which git)); echo installing git-forward-merge in $bindir; curloutput=$(curl -vo $bindir/git-forward-merge https://cdn.rawgit.com/clns/git-forward-merge/master/git-forward-merge.sh); fi; if ! git forward-merge -h &>/dev/null; then echo error: git-forward-merge failed to install >&2; echo $curloutput >&2 ; exit 1; fi; if ! git show-ref --verify --quiet refs/heads/$(targetBranch $@); then echo error: $(targetBranch $@) does not exist locally >&2; exit 1; fi; tr=$(targetRemote $@); if [ $tr ]; then echo pull $tr/$(targetBranch $@); git fetch $tr $(targetBranch $@):$(targetBranch $@); fi; echo merge $(sourceBranch $@) into $(targetBranch $@); git forward-merge $(sourceBranch $@) $(targetBranch $@); if [ $tr ]; then echo push $(targetBranch $@); git push $tr $(targetBranch $@) || echo after fixing the problem run: git push $tr $(targetBranch $@); fi;'' -'
```

==/Block:PowerShell==

==Block:Bash==

```sh
git config --global alias.merge-to '!sh -c '"'"'set -e; targetBranch() { if [ $# -eq 1 ]; then echo $1; else echo $2; fi; }; sourceBranch() { if [ $# -eq 1 ]; then echo $(git symbolic-ref -q --short HEAD); else echo $1; fi; }; targetRemote() { u=$(git rev-parse --abbrev-ref --symbolic-full-name $(targetBranch $@)@{u} 2>/dev/null) || true; if [ $u ]; then echo ${u%/*}; else echo; fi; }; if [ $# -eq 0 ]; then echo error: no target branch given >&2; exit 1; fi; if ! git forward-merge -h &>/dev/null; then bindir=$(dirname $(which git)); echo installing git-forward-merge in $bindir; curloutput=$(curl -vo $bindir/git-forward-merge https://cdn.rawgit.com/clns/git-forward-merge/master/git-forward-merge.sh); fi; if ! git forward-merge -h &>/dev/null; then echo error: git-forward-merge failed to install >&2; echo $curloutput >&2 ; exit 1; fi; if ! git show-ref --verify --quiet refs/heads/$(targetBranch $@); then echo error: $(targetBranch $@) does not exist locally >&2; exit 1; fi; tr=$(targetRemote $@); if [ $tr ]; then echo pull $tr/$(targetBranch $@); git fetch $tr $(targetBranch $@):$(targetBranch $@); fi; echo merge $(sourceBranch $@) into $(targetBranch $@); git forward-merge $(sourceBranch $@) $(targetBranch $@); if [ $tr ]; then echo push $(targetBranch $@); git push $tr $(targetBranch $@) || echo after fixing the problem run: git push $tr $(targetBranch $@); fi;'"'"' -'
```

==/Block:Bash==

#### Usage

```sh
git merge-to <target-branch> # uses the current branch as source branch
git merge-to <source-branch> <target-branch>
```

#### Test if it's working

You can test if it's working by merging a branch into itself:

```sh
git merge-to master master
```

If you get errors like "**error: git-forward-merge failed to install**" (probably you're on Windows), you'll need to install [git-forward-merge](https://github.com/clns/git-forward-merge) manually. To easiest method is to download [git-forward-merge.sh](https://cdn.rawgit.com/clns/git-forward-merge/master/git-forward-merge.sh) and place it somewhere in your PATH, e.g. `C:\Windows\System32\git-forward-merge`. **Make sure you remove the `.sh` extension!**
