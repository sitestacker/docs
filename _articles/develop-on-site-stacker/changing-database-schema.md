---
title: Changing Database Schema
category: Develop on Site Stacker
date: 2019-07-07 00:00:00
tags: development,schema,database
readtime: 3
---

## Schema

Database schemas in Site Stacker are written by hand, as described in the [CakePHP documentation](https://book.cakephp.org/2.0/en/console-and-shells/schema-management-and-migrations.html#writing-cakephp-schema-by-hand).

When creating a new schema in a component, you need two files:

- `Config/Schema/schema.php` which contains the schema (e.g. [packages/components/Export/Config/Schema/schema.php](https://git.sitestacker.com/sitestacker/sitestacker/blob/8dd3c71afcde5fcca327a4da49dba9a76e6d39c3/packages/components/Export/Config/Schema/schema.php))
- `Config/Migration/<plugin_name>_migration_yymmddhhiiss.php` which contains the initial migration, that should be identical to the schema.php (e.g. [packages/components/Export/Config/Migration/export_migration_190520160623.php](https://git.sitestacker.com/sitestacker/sitestacker/blob/8dd3c71afcde5fcca327a4da49dba9a76e6d39c3/packages/components/Export/Config/Migration/export_migration_190520160623.php))

While working in a component with a schema that was never pushed, you can use `App/Console/cake schema create -p <PluginName>` and `App/Console/cake schema update -p <PluginName>` to easily (re)create / update your schema.

**Once the schema has been pushed, any modifications to the `Config/Schema/schema.php` file should be accompanied by a migration file.**

## Migrations

Migrations are necessary every time a schema changes in a component. Site Stacker uses [https://github.com/CakeDC/migrations](https://github.com/CakeDC/migrations) to perform migrations.

### Migration File Name

Migration files reside in `Config/Migration/<migration-file>` and have the following name structure:

```
<component_name>_migration_<datetime>.php
```

Key | Definition | Example
--- | --- | ---
`<component_name>` | The component name, all underscore and "_" separated | HistoricGiving > `historic_giving`
`<datetime>` | The date and time when the migration file was created, in the format `ymdH:i:s` | Jul 7, 2019 2:23:45 pm > `190707142345`

The migration class name inside the file should follow the file name convention. Examples:

Migration file | Migration class
--- | ---
historic_giving_migration_190707142345.php | `HistoricGivingMigration190707142345`
contributions_migration_190702080418.php | `ContributionsMigration190702080418`

Migration files are created manually. For documentation on how to create migration files see [https://github.com/CakeDC/migrations/blob/master/Docs/Documentation/Migrations.md](https://github.com/CakeDC/migrations/blob/master/Docs/Documentation/Migrations.md). Also there are lots of examples in components like Contributions and others.

## Performing Schema Changes

When you need to modify a schema, the following manual steps are required:

1. Make the necessary changes in the schema.php file.
2. Create the migration file containing **only** the changes. E.g. [packages/components/Export/Config/Migration/export_migration_190525103448.php](https://git.sitestacker.com/sitestacker/sitestacker/blob/8dd3c71afcde5fcca327a4da49dba9a76e6d39c3/packages/components/Export/Config/Migration/export_migration_190525103448.php)

**Migration files should always contain the `down` property to rollback the schema, if needed.**

Migration files can be run from /dev, or from the command line using `App/Console/cake Migrations.migration run up -p <Plugin>`.
