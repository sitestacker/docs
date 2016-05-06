---
title: Branching and Release Workflow
category: Develop on Site Stacker
date: 2016-05-06 00:00:00
tags: development,model,strategy
readtime: 12
---

Site Stacker Branching and Release Workflow is a simple, git-based workflow that takes full advantage of git branches and tags. This guide explains how Site Stacker Workflow works and how to use it.

> You should be familiar with git branches and tags (see [3. Git Branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) and [2.6 Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging) in the [Pro Git book](http://git-scm.com/book/en/v2)).

There are two types of branches: **development** and **release** branches. The following diagram shows a visual representation of branches and tags in a Site Stacker repository.

![Site Stacker Branching Model](https://git.sitestacker.com/sitestacker/docs/uploads/ed94ce2ecc2dd05cd64141551b8f4667/ss-branching-model.jpg)

## Development branches

- `master` *(default, required)*
- `cool-feature` *(optional)*
- ...

When you're working on Site Stacker, you're usually adding a new feature or functionality or fixing some bugs - some of which are ready to go, and others which are not.

In every case, you should work on a branch (usually based on `master`) that is called development branch. Changes you make on a branch don't affect the other branches, so you're free to experiment and commit changes, safe in the knowledge that your branch won't be merged until it's ready to be reviewed by someone you're collaborating with. You can also push any of these branches to the same named branch on the server (e.g. `master` -&gt; `origin/master`).

> Note: Sometimes the changes are very simple and creating a development branch is overkill. In these situations you can commit directly on `master`, but make sure your changes are ready to be released at any time (see the master branch below).

Except `master`, development branches are usually short-lived, but **are always temporary**, because eventually they will get deleted, after the changes have been merged or discarded. Keep in mind that the longer a development branch lives without getting merged in for a release, the greater risk for merge conflicts and challenges for deployment. Short lived branches merge and deploy cleaner.

> Important: **Rules**
>
> - You should never create releases (tags) on a development branch
> - You should merge development branches (other than `master`) as soon as possible

### The `master` branch

`master` is the main development branch that has one very important rule: **anything in the `master` branch is always deployable**. This means, although the releases are made from [release branches](#release-branches), any code that lands in `master` should be deployable at any time, because the person who creates the release must assume this.

If you have changes that are not ready to be deployed, keep them in a separate development branch.

> Important: Anything you put in `master` should be ready to be released at any time.

The `master` branch always contains the latest work that is ready for production, thus it gets merged often into the latest release branch.

### Development branch naming convention

Development branch names should be descriptive (e.g. `refactor-authentication`, `user-content-cache-key`, `make-retina-avatars`), so others can see what is being worked on.

The only restriction is that they cannot begin with a version number (e.g. `2.0-my-branch`), because this prefix is reserved for release branches.

### Adding commits

Once your branch has been created, it's time to start making changes. Whenever you add, edit, or delete a file, you're making a commit, and adding them to your branch. This process of adding commits keeps track of your progress as you work on a development branch.

Commits also create a transparent history of your work that others can follow to understand what you've done and why. Each commit has an associated commit message, which is a description explaining why a particular change was made. Furthermore, **each commit is considered a separate unit of change**. This lets you roll back changes if a bug is found, or if you decide to head in a different direction.

> Tip: Commit messages are important, especially since Git tracks your changes and then displays them as commits once they're pushed to the server. By writing clear commit messages, you can make it easier for other people to follow along and provide feedback. See [Commit Guidelines](https://github.com/clns/node-commit-msg/blob/master/GUIDELINES.md).

When working in a development branch, is also common to commit often and not necessarily following the above rules. That's perfectly fine as long as you [squash the commits](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Squashing-Commits) when you're merging in the branch. Also since this is a temporary branch you're free to [rewrite the history](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) as you feel appropriate, while notifying any co-worker that may be working on the same branch.

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

Usually after merging in the changes, you can delete a development branch. This is almost always the case when merging into `master`, but if you merge into a release branch, you may want to keep the development branch for longer to be merged into `master` at a later time (see the `new-processor` branch in the diagram above).

This is the case because `master` gets often merged into other release branches (e.g. at tag `2.0.2-oscorp` in the diagram above), however a release branch cannot be merged into `master`, so keeping the branch for later makes sense.

## Release branches

- `2.0`
- `2.5` *(latest)*
- `2.0-oscorp`
- ...

Release branches provide a stream of updates for a specific version of Site Stacker. They are used for merging in development branches and creating releases (tags) from these merges, and are never merged into other branches, thus keeping them separate.

At least one release branch needs to exist to be able to push changes to Site Stacker installations. A release branch is easily identifiable because it always starts with a version number and, optionally, is followed by letters and hyphens.

There are 2 types of release branches:

1. Default release branches that include only a version number as the name (e.g. `2.0`, `2.5`).
2. Client-specific release branches, that are usually created from a default release branch by appending the client name with a hyphen (e.g. `2.0-oscorp`).

Normally, installations are configured to use a default release branch based on the version number they're using, but in some cases clients need specially tailored releases. In this case we create a client-specific release branch that will be used only for that client.

Release branches are usually long-lived, but it's also possible to delete a release branch if it's no longer needed.

> Important: **Rules**
>
> - Release branches should never be merged into other branches
> - You shouldn't work directly on a release branch (although there are exceptions, see below)
> - Fast-forward merges are not allowed when merging a development branch into a release branch (see [Git - Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging))

### Working with release branches

While working with development branches is trivial, release branches require special attention.

#### Latest release branch

As said before, at least one release branch needs to exist (e.g. `2.5`). This release branch represents the latest version of the system and tracks the changes developed on the `master` branch. This means that you push releases into this branch by merging in `master`, and you should **never commit directly on this branch**.

#### Older release branches

Older release branches can also exist (e.g. `2.0`), and these branches don't track the content in `master` since `master` has evolved and now contains much newer changes. Although new features are only added into the latest version (thus developed in `master`), a bug might arise that needs to be fixed. In this case, you have 2 options:

1. If the fix is very small you can do it directly on the release branch by checking out the branch (e.g. `git checkout 2.0`) (*not recommended*)
2. If the fix involves more work, you can switch to a new branch created from the release branch (e.g. `git checkout -b 2.0-fix-contributions-bug 2.0`) and when you're done merge that branch in (e.g. `git checkout 2.0; git merge 2.0-fix-contributions-bug`) (*recommended method*)

Method #2 is recommended, and there are some things to consider:

- the new branch name should start with a version number, since it's a temporary release branch and **not** a development branch
- **the new branch should not be merged into any other branch except the one that was created from** (release branch rule)
- after you're done with the branch don't forget to delete it

> Important: Branches created from other release branches are always release branches, not development branches.

##### Getting the fixes from older release branches

You often need to get the fixes made on older release branches into other branches, and since you can't merge these branches you need to use [`cherry-pick`](https://git-scm.com/docs/git-cherry-pick).

If you used method #2 as described above, cherry-picking all commits from that new branch is very easy, e.g.: `git cherry-pick 2.0..2.0-fix-contributions-bug`. If you used method #1 you'll have to cherry-pick each commit individually.

### Release branch naming convention

Default release branches are always named as a version number (e.g. `2.0`, `2.5`) and don't contain anything else.

Client release branches are based on a default release branch and contain a client-specific suffix, usually the client's name or an abbreviation (e.g. `2.0-oscorp`).

### Creating a release branch

To make sure fast-forward merges can't happen (release branch rule), when creating a release branch you should add an empty commit, e.g.:

```sh
git checkout -b 2.5
git commit --allow-empty -m "Create '2.5' branch"
git push -u origin 2.5
```

### Deleting a release branch

If a release branch is no longer needed, you can simply delete it. Deleting these branches won't affect the client's installation, but will end the stream of updates coming on that branch.

### Information about release branches

Every repository should include in their README information about each release branch. For example, a template might have 2 release branches (`1.0` and `2.0`) and `1.0` works with Site Stacker `2.0` while `2.0` works only with Site Stacker `2.5`. This needs to be specified in the README. For an example see the [Site Stacker README](https://git.sitestacker.com/sitestacker/sitestacker/blob/master/README.md).

## Releases

Releases are git tags that mark a specific point in history and provide details about the release and other relevant information. The information should be suited for clients to read and understand what changed.

> Important: Tags should only be created on release branches, **never** on development branches.

It's important to understand that once a tag is created, it will be available for update on client installations. If you want to point out that a release is non-production ready, you should append `alpha` or `beta` keywords to its name (e.g. `2.5.1-alpha`, `2.5.1-beta`), according to [semver](http://semver.org).

### Release naming convention

Release names should follow [semver](http://semver.org) and should be named according to the branch they're on. The following table shows valid release names based on the branch:

Branch | Valid release names
------ | -------------------
`2.0` | `2.0.0`, `2.0.1-alpha`, `2.0.1`, `2.0.12`
`2.5` | `2.5.0`, `2.5.1-alpha`, `2.5.1`, `2.5.12`
`2.5-oscorp` | `2.5.0-oscorp`, `2.5.1-beta-oscorp`, `2.5.1-oscorp`

> Note: Git tags are unique, so no matter on what branch you are you cannot have two tags with the same name.

### Creating a release

See [Create release](release-process#create-release) in the [Release Process](release-process) guide.

## System Manager

You can configure System Manager to receive updates from any branch, but you should normally only use release branches, especially on client installations. Note that System Manager will not show updates that have incompatible database migrations, and will warn you if an update contains database migrations, thus preventing a rollback.

> Note: If you don't configure any branch filter, System Manager will show **all tags from all branches**. This is not normally what you want on an installation.

![System Manager Settings](https://git.sitestacker.com/sitestacker/docs/uploads/e4c099dc0aa22073d183ce6fbdb73922/image.png)

### Branch Filter

To limit which tags are available for update on an installation, you need to filter the branches that the tags are accessible from. You can do this in the **Branch Filter** section of the *Settings* screen in System Manager. The page is pretty self-explanatory.

> Important: Normally, an installation should be configured to **receive updates from exactly ONE release branch**, and no other branches.

#### Default branch filter

A default installation should receive updates from the latest release branch. For example, if the latest release branch is `2.5`, the branch filter looks like this:

```
. = refs/remotes/origin/2.5
packages/** = refs/remotes/origin/2.0
```

This means that all repositories on the installation (the Site Stacker core repo `.` and any sub-repositories under `packages/`, including components, templates and themes) are using the `2.5` branch.

#### Client-specific branch filter

If using client-specific release branches, these can be configured as any other branches in System Manager Branch Filter. Usually a client-specific branch only exists in the Site Stacker core, other sub-repositories don't need one because they are specific to that client (e.g. a client-specific template).

```
. = refs/remotes/origin/2.5-oscorp
packages/** = refs/remotes/origin/2.0
```

### Test changes without releasing

The **Is Sandbox** setting allows an installation to see updates as soon as they are pushed to a branch, without having to create a tag first. This option is usually used on a sandbox development installation (not a client sandbox), because it allows testing the changes and eventually creating a release (tag).

For example, to test the [fixes we've made on the `2.0-fix-contributions-bug` release branch above](#older-release-branches), we can configure the branch filter like this:

```
. = refs/remotes/origin/2.0
. = refs/remotes/origin/2.0-fix-contributions-bug
packages/** = refs/remotes/origin/1.0
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
