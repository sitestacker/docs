---
title: GitLab Labels
category: Develop on Site Stacker
date: 2016-04-21 00:00:00
readtime: 2
---

Site Stacker uses several [label categories](https://git.sitestacker.com/admin/labels) to triage incoming issues and merge requests in the [Site Stacker GitLab issue tracker](https://git.sitestacker.com/sitestacker/sitestacker/issues?scope=all&sort=id_desc&state=all). Labels are used to sort issues by type, priority, value, status, changes involved.

## Label Categories

### Type

Most of the work can be categorized into 3 main types, which are described by the type labels.

#### `type:feature`

The issue is a request for new functionality including changes, enhancements, refactors, etc.

#### `type:bug`

The issue documents broken, incorrect, or confusing behavior.

#### `type:question`

The issue is more of a question than a request for new features or a report of broken features, but can sometimes lead to further discussion or changes of confusing or incongruous behavior or documentation.

### Priority

Priority labels specify the priority an issue should be handled by. There are just 3 priority types.

#### `priority:critical`

The issue should be fixed right now.

#### `priority:high`

The issue should be fixed asap.

#### `priority:low`

The issue is not a high priority one and can be handled later. This label allows issues to be documented without the need of working on them immediately.

### Value

Value labels describe who's benefiting from the issue. This helps scheduling issues better.

#### `value:client`

The issue will benefit the client.

#### `value:admin`

The issue will benefit admin users. Sometimes admin users are not necessarily the client.

#### `value:developer`

The issue will benefit developers.

### Change

These labels offer a rough estimate on the change involved.

#### `change:minor(<2hrs)`

The issue usually takes a couple of hours or less.

#### `change:medium(<1day)`

The issue takes less than a day, but it's not a quick fix.

#### `change:major(>1day)`

The issue involves major changes and takes more than 1 day.

### Misc

These are very important labels that should be used as needed.

#### `needs-discussion`

The issue needs further discussion in order to get resolved. This label can be paired with any other label(s).

We query everything that has this label as often as possible and discuss it with the involved parties. Once we’re done discussing we usually remove the label, but sometimes we couldn’t decide whatever we wanted to decide and so we leave the label there, pushing the item to the next meeting.

It’s helpful to use `needs-discussion` liberally. It might be for some big things, like we add a ticket “Decide who our target market is” — that’s kind of a big deal, and we might keep adding notes over the course of weeks. But it might just be a small issue where there seems to be some confusion.

#### `in-progress`

The issue is being worked on right now. This label tells the person who's working on the issue (the person who assigned the label) and prevents other people from starting on the same issue.

#### `duplicate`

The issue is a duplicate of another feature request or bug report. Should generally be closed with a reference to the original issue.

The issue can simply be closed, but this label makes the issue creator aware that he didn't research enough to find the original issue.

## References

- [quora.com: What is the best way to name GitHub issue labels?](https://www.quora.com/What-is-the-best-way-to-name-GitHub-issue-labels)
- [stackexchange.com: How to manage github issues for (priority, etc)? [closed]](http://programmers.stackexchange.com/questions/129714/how-to-manage-github-issues-for-priority-etc)
- [docs.saltstack.com: GITHUB LABELS AND MILESTONES](https://docs.saltstack.com/en/latest/topics/development/labels.html)
- [ianbicking.org: How We Use GitHub Issues To Organize a Project](http://www.ianbicking.org/blog/2014/03/use-github-issues-to-organize-a-project.html)
- [modeling-languages.com: Usage of issue labels in GitHub: some facts](http://modeling-languages.com/use-of-issue-labels-in-github/)
