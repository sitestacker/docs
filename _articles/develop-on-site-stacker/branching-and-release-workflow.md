---
title: Branching and Release Workflow
category: Develop on Site Stacker
date: 2016-02-17 00:00:00
tags: development,model,strategy
readtime: 12
---

Site Stacker Branching and Release Workflow is a simple, git-based workflow that takes full advantage of git branches and tags. This guide explains how Site Stacker Workflow works and how to use it.

You should be familiar with git branches and tags (see [3. Git Branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) and [2.6 Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging) in the [Pro Git book](http://git-scm.com/book/en/v2)).

The Site Stacker Workflow is designed to be very simple, so any developer can pick it up easily. There are two types of branches: development and release branches.

![Site Stacker Branching Model](https://git.sitestacker.com/sitestacker/docs/uploads/a638975eebbc47daef16787b5593f21d/SS_Branching_Model.jpg)

## Development branches

- `master` *(default, required)*
- `cool-feature` *(optional)*
- ...

When you're working on Site Stacker, you're usually adding a new feature or functionality or fixing some bugs - some of which are ready to go, and others which are not.

In every case, you should create a branch (based on `master` usually) that is called development branch. Changes you make on a branch don't affect the other branches, so you're free to experiment and commit changes, safe in the knowledge that your branch won't be merged until it's ready to be reviewed by someone you're collaborating with. You can also push any of these branches to the same named branch on the server.

<note>
Sometimes the changes are very simple and creating a development branch is overkill. In these situations you can commit directly on <code>master</code>, but make sure your changes are ready to be released at any time (see the master branch below).
</note>

Except `master`, development branches are usually short-lived, but **are always temporary**, because eventually they will get deleted, after the changes have been merged or discarded. Keep in mind that the longer a development branch lives without getting merged in for a release, the greater risk for merge conflicts and challenges for deployment. Short lived branches merge and deploy cleaner.

<important>
<title>Rules</title>
<ul>
  <li>You should never create releases on a development branch</li>
  <li>You should not include development branches in System Manager <i>Branch Filter</i></li>
  <li>You should keep development branches for as little as possible</li>
</ul>
</important>

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

Usually after merging in the changes, you can delete a development branch. This is almost always the case when merging into `master`, but if you merge into a release branch, you may want to keep the development branch for longer to be merged into `master` at a later time (see the `new-processor` branch in the diagram above).

This is the case because `master` gets often merged into other release branches (e.g. at tag `oscorp-1.1.2` in the diagram above), however a release branch doesn't get merged into `master`, so keeping the branch for later makes sense.

## Release branches

- `release` *(required)*
- `oscorp` *(optional)*
- ...

Release branches are used only for merging in development branches and creating releases from these merges.

The main release branch is `release`, but other release branches can be created as well, mainly with the purpose of providing a different release stream for a client. For example the `release` branch contains releases that most clients get (e.g. `2.1.3`), but other clients might need specially tailored releases (e.g. `oscorp-1.3.2`), so a different release branch needs to be created.

Also multiple release branches can be used for an installation, e.g. a test and a production branch. The test branch acts as a "gateway" before production, where every change is tested first and once ready a new tag is created and the branch will be merged into production.

Release branches are usually long-lived, but it's also possible to delete a release branch if it's no longer needed, thus changing the release stream for that client back to the `release` branch.

<important>
<title>Rules</title>
<ul>
  <li>Release branches should never be merged into development branches</li>
  <li>You should never work on a release branch, instead merge in development branches that contain your changes (see <a href="#working-directly-on-a-release-branch">exception</a>)</li>
</ul>
</important>

<note>
If the <code>release</code> branch doesn't exist for a repository, you need to <a href="#creating-a-release-branch">create it</a>.
</note>

### Release branch naming convention

Release branches should be named as simple as possible, usually using the client name (e.g. `oscorp`).

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

<important>
Releases should only be created on release branches, <b>NEVER</b> on development branches.
</important>

Also please note that you should not create releases just for testing the changes on a server - use branches for that (see [System Manager - Deploy branches](#deploy-branches)).

### Release naming convention

The naming convention for releases is pretty simple, however it's different for releases on the `release` branch and releases on other release branches.

#### Releases on `release` branch

These are considered the "main" releases that regular clients get and should follow the [semver](http://semver.org/) rules. In short, releases are 3-digit version numbers in the format `MAJOR.MINOR.PATCH` (e.g. `1.0.1`). For complete details see [semver](http://semver.org/).

#### Releases on other release branches

These are usually created for specific clients and can be named in any way that's best suited for the client. However take into account these simple rules:

- should not be named as the `release` branch releases (e.g. as a version number only)
- it's recommended they all include a prefix, maybe the branch name (e.g. `oscorp-1.0.1` or `oscorp-1.0`)

<note>
Note that git tags are unique, so no matter on what branch you are you cannot have two tags with the same name.
</note>

### Creating a release

See [Create release](release-and-qa-process#create-release) in the [Release and QA Process](release-and-qa-process) guide.

## System Manager

In System Manager you can update an installation to any branch or tag (we'll call these *updates*). The only restriction is that System Manager will not show updates that have incompatible database migrations, and will warn you if an update contains database migrations, thus preventing a rollback.

By default, System Manager shows **all available tags** and no branches. This is not normally what you want on an installation, so you should configure this in the *Settings* window in System Manager, accessible from the bottom right gear icon.

![System Manager Settings](https://git.sitestacker.com/sitestacker/docs/uploads/68794abc8c650820073fd2230932bfef/image.png)

### Branch Filter

<note>
Tags are tightly coupled with branches, so to limit which tags are available on an installation you need to filter the branches that the tags are accessible from.
</note>

You can filter the branches in the **Branch Filter** section of the *Settings* screen in System Manager. The page is pretty self-explanatory.

<important>
An installation should be configured to <b>receive updates from exactly one release branch</b>, and no other branches.
</important>

#### Default installation filter

A default installation should get updates from the `release` branch:

```
. = refs/remotes/origin/release
packages/** = refs/remotes/origin/release
```

This means the Site Stacker core repo (`.`) is filtered to use the `release` remote branch and all other subrepos in `packages/` (including components, templates and themes) are using their `release` branches as well.

#### Custom client installation filter

A custom client installation might be configured to get its Site Stacker core updates from a client-specific release branch (e.g. `oscorp`), while all other subrepos use their `release` branches. This is very common because subrepos usually only have a `release` branch, since a subrepo is already client-specific. The filters for such installation look like this:

```
. = refs/remotes/origin/oscorp
packages/** = refs/remotes/origin/release
```

### Deploy branches

On a sandbox installation, it's very common you want to deploy branches instead of tags, so you can quickly test things out without needing to make an official release (a tag). To enable this simply toggle the **Is Sandbox?** button in the System Manager *Settings* screen, and make sure your branch is added in the **Branch Filter** field.

<important>
<title>Deploying development branches</title>
You should only deploy development branches if you understand the implications. You <b>SHOULD NOT</b> create releases from these branches. Instead, a developer needs to merge them into a release branch before creating a release.
</important>

[In the example above](#custom-client-installation-filter), we can deploy `cool-feature` for the Site Stacker core repository by adding one new line in the branch filter field:

```
. = refs/remotes/origin/oscorp
packages/** = refs/remotes/origin/release
. = refs/remotes/origin/cool-feature
```

If you use development branches in this way, as soon as you're done testing the changes you should remove the branches from the Branch Filter and rollback the installation to the release branch, to prevent anyone from creating a release from a development branch.

## Appendix

### Working directly on a release branch

*This is a more advanced workflow.*

It's recommended you only work on development branches. However consider the following scenario:

```
                release
                   |
            test   * <- unreleased change
              |    |
              |    * <- 1.0.0 (HEAD)
big change -> *   /|
             /|  / |
            / | /  |
           /  *    |
```

There are 2 release branches (`test` and `release`) and the installation is currently at `1.0.0`. If a bug is found that needs to be fixed and deployed immediately, and the development branches and the `test` branch have big changes that are not yet ready to be deployed, you can:

- create a temporary branch (`urgent-fix`) from the tag the installation is on (e.g. `git checkout -b urgent-fix 1.0.0`)
- make your changes on the new branch
- create a release pointing at the new branch after testing the changes (e.g. `git tag 1.0.1 -a -m "Fix urgent bug"`)
- use [cherry-pick](https://git-scm.com/docs/git-cherry-pick) to manually bring the commits into a development branch (e.g. `git checkout master && git cherry-pick 1.0.0..urgent-fix`)
- merge the branch back into `release` (e.g. `git checkout release && git merge urgent-fix`)
- delete the temporary branch (e.g. `git branch -d urgent-fix`)

```
                  release
                     |
                     *     urgent-fix
                     |\_ _ _  |
                     |       \|
unreleased change -> *        * <- 1.0.1
                     |        |
              test   | _ _ _ /
                |    |/
                |    * <- 1.0.0 (HEAD)
  big change -> *   /|
               /|  / |
              / | /  |
             /  *    |
```

### Merge into release branch without checkout

To merge your development branch into a release branch, you need to switch to the target branch and then do the merge. This can become a drag, especially when having an unclean working tree.

You can configure a special git alias that will allow you to do the merge without checking out the release branch. Note that this **only works when the merge can be done automatically**. It doesn't work for merges that require conflict resolution.

If you do attempt a merge that requires conflict resolution, `git release` will abort the merge and leave your working directory clean, UNLESS the branch you're merging to is the current branch, in which case it will leave the merge in the working directory for you to resolve the conflict and commit, just like `git merge`.

<important>
You should have at least Git 2.0. Check your current Git version by running <code>git --version</code> in a shell.
</important>

To configure the alias run the following command in your shell:

==Block:PowerShell==

```powershell
git config --global alias.release '!sh -c ''set -e; targetBranch() { if [ $# -eq 1 ]; then echo $1; else echo $2; fi; }; sourceBranch() { if [ $# -eq 1 ]; then echo $(git symbolic-ref -q --short HEAD); else echo $1; fi; }; targetRemote() { u=$(git rev-parse --abbrev-ref --symbolic-full-name $(targetBranch $@)@{u} 2>/dev/null) || true; if [ $u ]; then echo ${u%/*}; else echo; fi; }; if [ $# -eq 0 ]; then echo error: no target branch given >&2; exit 1; fi; if ! git forward-merge -h &>/dev/null; then bindir=$(dirname $(which git)); echo installing git-forward-merge in $bindir; curloutput=$(curl -vo $bindir/git-forward-merge https://cdn.rawgit.com/schuyler1d/git-forward-merge/master/git-forward-merge.sh); fi; if ! git forward-merge -h &>/dev/null; then echo error: git-forward-merge failed to install >&2; echo $curloutput >&2 ; exit 1; fi; if ! git show-ref --verify --quiet refs/heads/$(targetBranch $@); then echo error: $(targetBranch $@) does not exist locally >&2; exit 1; fi; tr=$(targetRemote $@); if [ $tr ]; then echo pull $tr/$(targetBranch $@); git fetch $tr $(targetBranch $@):$(targetBranch $@); fi; echo merge $(sourceBranch $@) into $(targetBranch $@); git forward-merge $(sourceBranch $@) $(targetBranch $@); if [ $tr ]; then echo push $(targetBranch $@); git push $tr $(targetBranch $@) || echo after fixing the problem run: git push $tr $(targetBranch $@); fi;'' -'
```

==/Block:PowerShell==

==Block:Bash==

```sh
git config --global alias.release '!sh -c '"'"'set -e; targetBranch() { if [ $# -eq 1 ]; then echo $1; else echo $2; fi; }; sourceBranch() { if [ $# -eq 1 ]; then echo $(git symbolic-ref -q --short HEAD); else echo $1; fi; }; targetRemote() { u=$(git rev-parse --abbrev-ref --symbolic-full-name $(targetBranch $@)@{u} 2>/dev/null) || true; if [ $u ]; then echo ${u%/*}; else echo; fi; }; if [ $# -eq 0 ]; then echo error: no target branch given >&2; exit 1; fi; if ! git forward-merge -h &>/dev/null; then bindir=$(dirname $(which git)); echo installing git-forward-merge in $bindir; curloutput=$(curl -vo $bindir/git-forward-merge https://cdn.rawgit.com/schuyler1d/git-forward-merge/master/git-forward-merge.sh); fi; if ! git forward-merge -h &>/dev/null; then echo error: git-forward-merge failed to install >&2; echo $curloutput >&2 ; exit 1; fi; if ! git show-ref --verify --quiet refs/heads/$(targetBranch $@); then echo error: $(targetBranch $@) does not exist locally >&2; exit 1; fi; tr=$(targetRemote $@); if [ $tr ]; then echo pull $tr/$(targetBranch $@); git fetch $tr $(targetBranch $@):$(targetBranch $@); fi; echo merge $(sourceBranch $@) into $(targetBranch $@); git forward-merge $(sourceBranch $@) $(targetBranch $@); if [ $tr ]; then echo push $(targetBranch $@); git push $tr $(targetBranch $@) || echo after fixing the problem run: git push $tr $(targetBranch $@); fi;'"'"' -'
```

==/Block:Bash==

#### Usage

```sh
git release target-branch # uses the current branch as source branch
git release source-branch target-branch
```

#### Test if it's working

You can test if it's working by merging a branch into itself:

```sh
git release <branch> <branch>
```

If you get errors like `error: git-forward-merge failed to install` (probably you're on Windows), you'll need to install [git-forward-merge](https://github.com/schuyler1d/git-forward-merge) manually. To easiest method is to download [git-forward-merge.sh](https://cdn.rawgit.com/schuyler1d/git-forward-merge/master/git-forward-merge.sh) and place it somewhere in your PATH, e.g. `C:\Windows\System32\git-forward-merge`. **Make sure you remove the `.sh` extension!**
