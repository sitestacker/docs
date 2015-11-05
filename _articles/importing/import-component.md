---
title: Import Component
category: Importing
date: 2015-09-25 00:00:00
---

* [Creating a Content Type Data Map](#creating-a-content-type-data-map)
* [Populating a Data Map](#populating-a-data-map)
* [Importing a Data Map](#importing-a-data-map)

The Import component will allow you to import various system records via predefined Data Maps or custom data maps created for a content type.

## Import View

By default the Import component will display the Import view when first opened. In this grid you will see all of your past imports. This is where you will upload and run new imports and rollback imports.

## Documentation View

The Documentation view will display a list of all the Data Maps that are currently available on your installation. By checking the checkbox next to a Data Map you will be shown details about that particular Data Map in the right side of the component. The documentation for the Data Map will help explain how the data for a particular column should be formatted and if it is required.

## Creating a Content Type Data Map

Before you can import records for a content type you must create a data map for that content type.

1. Create at least one folder for your content type in Site Planner and make note of the Content Item Folder ID
2. Open the "Architect" component
3. Click on the "Data Maps" button in the upper right corner of the component
4. Choose "Add" and fill out the required fields for your content type
 *  **Note:** This folder will act as the default folder for the import, but another folder can be specified in your import CSV later on
5. Save and Close

## Downloading a Data Map

1. To download a Data Map CSV that you will use to import your records click on the Documentation View.
2. Check the checkbox for each of the the Data Maps that you would like to use for your import
3. Click the "Download Selected" button after you have chosen all of your Data Maps that you would like to use

## Populating a Data Map

Make sure to read the documentation for your particular data map before proceeding to populate it with data. Be especially aware of any required fields as these will be needed in order to run your import.

**Note:** When saving your Data Map be sure to retain the number in the file name e.g. "20." This is what the component will use the identify what Data Map to use when running your import.

## Importing a Data Map

You will use the Import view to upload and run your import. If you need to upload multiple Data Maps you can zip them and upload them all at once.

After your file(s) have been successfully uploaded you will right-click on the file(s) and choose "Run Import". The component will then display whether or not your import was successful. **Note:** This may take several minutes depending on how many records you are importing.

If your import is **not successful** you will be notified by a pop up confirmation. Your import will then appear in red text in the Import view grid and you can right-click and choose "Show Errors". You will then be told what caused the error and which line(s) the error appears in.

If your import **is successful** but for whatever reason you need to remove those records you can right-click on the record and choose "Rollback". This will delete all of the records contained in that particular import. The import will then appear in blue text in the Import view grid.