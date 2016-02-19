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

### Configure PhpStorm to run unit tests

#### Set the PHP interpreter

Navigate to Settings / Language & Frameworks / PHP. If you do not have an interpreter selected, either select or add a new one.

![Settings](https://git.sitestacker.com/sitestacker/docs/uploads/d5855c192961c1f333b719bd5b2e0270/settings-php.png)

When adding the interpreter it should automatically detect the PHP executable path, if not, you'll have to manually locate it.

![Interpreters](https://git.sitestacker.com/sitestacker/docs/uploads/93619b245646e2b8ccc8e2416e9db105/interpreters-php.png)

#### PHPUnit Configuration

Navigate to Settings / Language & Frameworks / PHP / PHPUnit and select phpunit.phar from the vendors folder in your SiteStacker installation.

![PHPUnit Path](https://git.sitestacker.com/sitestacker/docs/uploads/ffbe8be319a434efeec3d59d6c8afc88/phpunit.png)

Open the Run/Debug Configurations window by using the dropdown in your toolbar. The position might differ from the one you see here ([Creating and Editing Run/Debug Configurations](https://www.jetbrains.com/phpstorm/help/creating-and-editing-run-debug-configurations.html))

![Edit Configurations Button](https://git.sitestacker.com/sitestacker/docs/uploads/858c04e464e79096cd98d02e37af9230/edit-configurations-button.png)

Set the **Interpreter options** config to `PATH_TO_YOUR_SITESTACKER_INSTALLATION/cakeunit-phpstorm.php`

![Edit Configurations Options](https://git.sitestacker.com/sitestacker/docs/uploads/8b20daa651d33527705d2efbb5959198/edit-configurations-options.png)

SiteStacker is now set up and ready to run unit testing.

### Run unit tests from PhpStorm

From the project tree you either run tests for a single component by right clicking a component (eg. Contributions), or you can run the tests for all components by right clicking the `components` folder.
You have 3 options when running tests:

- Run
- Debug (it enables XDebug and you'll be able to debug your code while testing)
- Run with Coverage (will analyze code coverage for the tests you're running)

![Run Tests](https://git.sitestacker.com/sitestacker/docs/uploads/1e6f8df655550e9e81e3a2ccb668f555/run.png)

When running the tests you will see the progress in the panel below. From there you'll have the option to re-run all tests or re-run only the failed tests

![Test Results](https://git.sitestacker.com/sitestacker/docs/uploads/f6aecea7400e6adf793de2257ba4c914/results.png)

After running a test with coverage you will see what parts of your covered and which were not. This will be indicated by a yellow line (for covered code) or a red line (for uncovered code).
 
![Coverage](https://git.sitestacker.com/sitestacker/docs/uploads/449efa25675d361beec03ef25ad7b170/coverage-code.png)

### Running from command line

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

### Skipping builds

If your commit message contains `[ci skip]`, the builds will be skipped (<http://doc.gitlab.com/ce/ci/yaml/README.html#skipping-builds>).
