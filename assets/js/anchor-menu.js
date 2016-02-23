---
---
$(document).ready(function(){
    var $markdownBody = $('.markdown-body');
    var $anchors = $markdownBody.find('h1[class!="page-title"], h2[class!="page-title"], h3[class!="page-title"]');
	if($anchors.length == 0){
		$anchors = $markdownBody.find('h4[class!="page-title"], h5[class!="page-title"]');
	}

	if($anchors.length == 0){
		return false;
	}

    $(document.body).addClass('sidebar-on');

    var navButtonHtml = '<i class="content icon"></i><span class="text">Quick Nav</span>';

    var $stickyButton = $('<div/>').addClass('ui black big show-nav right attached fixed button hide-on-mobile').html(navButtonHtml).prependTo('body');

    var $btnGroup = $('<div/>').addClass('ui icon secondary big buttons').css({position:'fixed',left:10,bottom:30,zIndex:2}).appendTo('body');
    if (!isMobile()) {
        // $('<a/>').addClass('ui button').attr('href', '{{site.github.url }}/').html('<i class="icon home"></i>').appendTo($btnGroup);
        // $btnGroup.addClass('vertical');
    }
    var $menuOpener = $('<a/>').addClass('ui show-nav button').html('<i class="icon content"></i>').appendTo($btnGroup);

    var $sideBar = $('<div/>').addClass('ui vertical sidebar inverted menu left nav-panel borderless');

    $('<div/>').addClass('item').html('<h4 class="ui header inverted">Quick Nav</h4>').appendTo($sideBar);
    var $sideBarMenu = $('<div/>').addClass('menu').appendTo($sideBar);

    $anchors.each(function(index, anchor){
        var $anchor = $(anchor);
	    var indentClass = '';

	    if($anchor.get(0).localName == 'h1' || $anchor.get(0).localName == 'h4'){ indentClass = ''; }
	    if($anchor.get(0).localName == 'h2' || $anchor.get(0).localName == 'h5'){ indentClass = 'indent-small'; }
	    if($anchor.get(0).localName == 'h3'){ indentClass = 'indent-big'; }

	    $('<a/>').addClass('item ' + indentClass + ' ' + $anchor.attr('id')).html($anchor.html()).attr('href', '#'+$anchor.attr('id')).appendTo($sideBarMenu);
    });

    // var toc = $('<div/>').addClass('toc').prependTo('.full.height');
    // var $sideBar2 = $sideBar.clone().addClass('visible').appendTo(toc);
    var $sideBar2 = $sideBar.clone().addClass('visible toc').prependTo('.pusher');
    $sideBar.prependTo('body');

	// initialize sidebar
    $sideBar.sidebar({
        dimPage: false,
        // transition: 'overlay',
        // mobileTransition: 'overlay',
	    duration: 30,
	    onVisible: function(){
		    //$sideBarMenu.find('a.active').addClass('focused');
            $stickyButton.hide();
            $btnGroup.css('visibility', 'hidden');
	    },
	    onHidden: function(){
		    $sideBarMenu.find('a').removeClass('focused');
            $stickyButton.show();
            $btnGroup.css('visibility', 'visible');
	    }
    });

	// handle events
    $sideBar.sidebar('attach events', '.show-nav');
    $(document).on('keydown', function(e) {
        if (e.which == 36 /* HOME */) {
            window.location = '{{ site.github.url }}/';
            return;
        }
        if(!$sideBar2.is(':visible') && e.which == 190){
            $sideBar.sidebar('toggle');
        }
	    if($sideBar.sidebar('is visible') && e.which == 27){
		    $sideBar.sidebar('hide');
	    }
	    if($sideBar.sidebar('is visible') && e.which == 13){
		    window.location.hash = $sideBarMenu.find('a.focused').attr('href');
		    $('html, body').scrollTop($($sideBarMenu.find('a.focused').attr('href')).offset().top);
            if (!e.shiftKey) {
    		    $sideBar.sidebar('toggle');
            }
	    }
	    if($sideBar.sidebar('is visible') && (e.which == 38 || e.which == 40)){
		    e.preventDefault();

		    var $allItems = $sideBarMenu.find('a');
		    var $currentItem = $allItems.filter('.focused');
		    if(!$currentItem.length){
			    $currentItem = $allItems.filter('.active');
		    }
		    var $nextItem = null;

		    switch(e.which)
		    {
			    case 40:
				    $currentItem.removeClass('focused');
				    if($currentItem.length > 0){
					    if($currentItem.get(0) == $allItems.last().get(0)){
						    $nextItem = $allItems.first();
					    }else{
						    $nextItem = $currentItem.nextAll().first();
					    }
				    }else{
					    $nextItem = $allItems.first();
				    }
				    $nextItem.addClass('focused');
				    break;
			    case 38:
				    $currentItem.removeClass('focused');
				    if($currentItem.length > 0){
					    if($currentItem.get(0) == $allItems.first().get(0)){
						    $nextItem = $allItems.last();
					    }else{
						    $nextItem = $currentItem.prevAll().first();
					    }
				    }else{
					    $nextItem = $allItems.last();
				    }
				    $nextItem.addClass('focused');
				    break;
		    }
	    }
    });

	$(document).on('scroll', function(e) {
		$anchors.each(function (index, anchor) {
			var $anchor = $(anchor);
			if(elementInViewport($anchor)){
				$sideBarMenu.find('a').removeClass('active focused');
				$sideBarMenu.find('a.'+$anchor.attr('id')).addClass('active')

                $sideBar2.find('a').removeClass('active focused');
				$sideBar2.find('a.'+$anchor.attr('id')).addClass('active');
			}
		});
	});

	function elementInViewport(el) {
		var windowScrollTop = $(window).scrollTop();
		var elOffsetTop = el.offset().top;
		if(windowScrollTop + 30 > elOffsetTop){
			return true;
		}
		return false;
	}
});
