---
title: Wrappers
category: Templates
date: 2014-11-11 00:00:00
---

#### Wrappers Concept

The wrappers are meant to replace some of the template positions, offering a more flexible way of building a web site.
You can add custom fields per each wrapper, custom CSS classes and custom JS functionality for each individual wrapper.
The old template positions will still be used to define the main sections of the web site, like `Header`, `Content` and `Footer`. The entire `Content` section of the web site will be built using wrappers. In this example we will create 3 wrappers `Column`, `Slider` and `Title and Background`.
The wrappers are treated by the system like any other content type created from Architect. The major difference is that each published wrapper in Site Planner supports child elements. In other words you can publish for example a Article and a Module inside a Wrapper.

#### Creating the Wrapper content type in Architect

Before publishing wrappers in Site Planner you need to create the Wrapper content type. You can create as many wrapper content types you want (Main Wrapper, Secondary Wrapper etc) but in most of the cases you will need only one wrapper content type.
So to create the Wrapper content type follow this steps:
- Open `Architect` component and click the `Add` button.
- Fill up the name and alias fields and check the `Wrapper` checkbox. This will inform the system that this content type needs to be treated as a wrapper. In this guide we will name our wrapper content type `Container` so the content type alias will be also `Container`.
- Save the content type.

> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) Note that after saving a content type as a wrapper you will not be able to uncheck the wrapper option any more.

#### Adding field types to Wrappers

In some cases you would like to have a title or a background image or any other value available on your wrapper content type. To do this, like on any other Architect Content Type, right click the `Container` content type that you created before and click on `Manage Fields`. For this guide we will add 2 fields to our `Container` wrapper. A text field called `Title` and an image field called `Background Image`.

#### Creating the Container Content Items

In order to publish wrapper items on site pages you need to create them on Content Explorer like any other content items. For our example we only need to create one wrapper content items. Let's name it `Basic`. Also fill in the `Title` field and select an image in the `Background Image` field.

#### Config.xml

Like any other content type, you need to declare it in the template `config.xml` file, so the system is able to locate the required views.
Bellow is the declaration of the Wrapper that we just created in Architect.
````PHP
<contentType plugin="Architect" alias="Container">
    <view alias="column" name="Column">
        <class alias="col-1-4" name="1/4 Width Column"/>
        <class alias="col-2-4" name="2/4 Width Column"/>
        <class alias="col-3-4" name="3/4 Width Column"/>
        <class alias="col-4-4" name="960px Container"/>
    </view>
    <view alias="slider" name="Slider"/>
    <view alias="title_and_background" name="Title and Background">
        <class alias="col-1-4" name="1/4 Width Column"/>
        <class alias="col-2-4" name="2/4 Width Column"/>
        <class alias="col-3-4" name="3/4 Width Column"/>
        <class alias="col-4-4" name="960px Container"/>
    </style>
</contentType>
````

According to this declaration we need 3 views in our template folder: `/views/Architect/Container/column.tpl`, `/views/Architect/Container/slider.tpl` and `/views/Architect/Container/title_and_background.tpl`.
As you can see in the config.xml example, a new element is available for the views declaration, the `<class>` tag. This will allow you to specify one or more of this CSS classes, in Site Planner, when an item is published in this view. So using the `Column` view, you can actually create 4 types of containers. To achieve this using the old methods, 4 different positions would be required.

#### Wrapper Views
Like for any other content type, you need to create a view for each declaration present in the config.xml file.
2 new variables are now available in the Smarty views:
- {$viewClass} - will print the additional CSS classes selected in Site Planner
- {$wrapperBody} - will print the rendered child items of a wrapper.
The views need to be created respecting SiteStacker previous template conventions. For more details read the [[Building a Template|Building-a-Template#template-views]] guide.
So let's create the views for our 3 wrappers that we declared in config.xml.

````PHP
// slider.tpl
<div class="tpl-architect-container-slider slide-wrapper-{$content_item_id}">
    {$wrapperBody}
    <div class="clearfix"></div>
</div>

<script type="text/javascript">
    $(document).ready(function(){
        var view = $('.slide-wrapper-' + {$content_item_id});
        // any JS code required to initialize the slider functionality.
    });
</script>
````
> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/note.png) Note the second view class `slide-wrapper-{$content_item_id}`. All the JS code executed on this view needs to be related to this parent element. This will prevent JS errors if the same wrapper is published multiple times on the same site page. In this case the JS code should take care of considering each item from the `{$wrapperBody}` as one slide.


````PHP
// column.tpl
<div class="tpl-architect-container-column {$viewClass}">
    {$wrapperBody}
    <div class="clearfix"></div>
</div>
````
> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/note.png) Note the usage of the `{$viewClass}` variable. This will be one of the classes declared in the `config.xml` for this particular view. So for the column view we could have the following CSS file:
````CSS
.tpl-architect-container-column.col-1-4 {
    width: 25%;
    float: left;
}
.tpl-architect-container-column.col-2-4 {
    width: 50%;
    float: left;
}
.tpl-architect-container-column.col-3-4 {
    width: 75%;
    float: left;
}
.tpl-architect-container-column.col-4-4 {
    width: 100%;
    max-width: 960px;
    margin: auto;
    float: none;
}
````
So using a single wrapper published in the same view we can create a full 960px container or 3 types of column layout.

````PHP
// title_and_background.tpl
<div class="tpl-architect-container-title-and-background background-{$content_item_id} {$viewClass}">
    <style>
    .tpl-architect-container-title-and-background.background-{$content_item_id}   
    {
        background: url('{$background_image}') no-repeat center;
        backgorund-size: cover;
    }
    </style>

    <div class="tpl-title">{$title}</div>
    <div class="tpl-body">{$wrapperBody}</div>
    <div class="clearfix"></div>
</div>
````
> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/note.png) Note the title div and the CSS class declaration directly in the view. This will add the content item image as a background image for this wrapper. Like in the `slider.tpl` view, we are also using here a second class to precisely identify this specific view and prevent applying the background image on all the elements in the page with this class.

#### Publishing the Wrappers in Site Planner.

At this point we have all we need to publish the content on the site page. Using the examples described in this guide so far we will create the following content all published in the template `Content` position:
- Full browser with slider.
- 960 width container.
- 1/4 left column inside the 960 width container.
- 3/4 right column inside the 960 width container.
- 960 width container with title and background image.

To do this publish the following items in Site Planner:

Content Type | Content Item | Position | View | CSS Class | Parent Element
------------ | ------------ | -------- | ---- | --------- | --------------
Container | Basic | Content | Slider | - | Site Page
Container | Basic | Content | Column | 960px Container | Site Page
Container | Basic | - | Column | 1/4 Width Column | 960px Container
Container | Basic | - | Column | 3/4 Width Column | 960px Container
Container | Basic | Content | Title and Background | 960px Container | Site Page

> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/note.png) We just created the equivalent of 5 positions using 1 position and a wrapper. You can now start publishing normal content items in each of this wrappers. Just drag the content items on the wrapper items as you would drag the content items on the site pages.    

> ![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) Wrapper reordering is available in site pages.    
![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) Wrappers inheritance is available. You could publish the wrappers on a folder in Site Planner. Then you will have those wrappers available on all the site pages created in that folder.    
![](https://github.com/sitestacker/sitestacker-wiki/blob/wiki-resources/images/icons/important.png) You can publish wrapper in wrappers to as many levels you want.

> For more examples on how to use the wrappers take a look in the NTM template from the NTM Git Branch.