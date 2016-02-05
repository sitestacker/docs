---
title: Testing
category: Develop on Site Stacker
date: 2016-01-18 00:00:00
tags:
  - skip build
readtime: 2
---

<note>
Tests can only run on CakePHP 2.6+, so this means you cannot run tests on <code>master</code> <a href="https://git.sitestacker.com/sitestacker/sitestacker/merge_requests/1">until `cakephp-2.6` is merged in</a>. Testing is only possible on branches that diverged from <code>cakephp-2.6</code>.
</note>

## Prerequisites

To be able to run tests locally, you need to:

- [Install PHPUnit 3.7.x](http://book.cakephp.org/2.0/en/development/testing.html#install-via-phar-package) via .phar
    - place `phpunit.phar` in `vendors/`
- [Create the test database](http://book.cakephp.org/2.0/en/development/testing.html#test-database-setup)

## Running Tests

You can run tests using the `cake test` command, e.g.:

```sh
App/Console/cake test core AllConfigure --debug
```

Don't forget to use the `--debug` flag.

## Writing Tests

For comprehensive information on how to write tests see [Testing](http://book.cakephp.org/2.0/en/development/testing.html) in the CakePHP 2.x Cookbook.

Remember: tests should be simple and at the point, so that anyone can understand and change them when needed.

## Continuous Integration

Continuous Integration is enabled in [GitLab](https://git.sitestacker.com/sitestacker/sitestacker/builds?scope=all) so tests run automatically after every push.

To enable CI, a [`.gitlab-ci.yml`](http://doc.gitlab.com/ce/ci/yaml/README.html) file needs to exist in the root of the project, specifying the jobs that will run. An example file looks like this:

```yaml
Contributions:
  script:
  - App/Console/cake test Contributions AllContributions --debug

PaymentProcessors:
  script:
  - App/Console/cake test PaymentProcessors PaymentProcessor --debug
  - App/Console/cake test PaymentProcessors PaymentProcessorTransaction --debug


# DON'T EDIT BELOW THIS LINE

before_script:
- prepare.sh

variables:
  # Configure mysql service (https://hub.docker.com/_/mysql/)
  MYSQL_DATABASE: "sitestacker-test"
  MYSQL_ALLOW_EMPTY_PASSWORD: "1"
```

This example creates two [jobs](http://doc.gitlab.com/ce/ci/yaml/README.html#jobs) (`Contributions` and `PaymentProcessors`), each one using the `App/Console/cake test` command to run tests. Everything below these lines is required and can be ignored. You can specify as many jobs as you need, which can run one or more shell scripts.

### `.gitlab-ci.yml` best practices

TODO

*This section documents best practices for writing jobs in a `.gitlab-ci.yml` file and running scripts inside these jobs. This is a work in progress, taking into account that each job and script per job has a significant overhead on the build time, so fewer jobs and a single script per job looks to be the way to go. But we're not sure yet how to group the jobs.*
