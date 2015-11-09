$(document).ready(function(){
    var $markdownBody = $('.markdown-body');
    var $anchors = $markdownBody.find('h1, h2, h3');

    var navButtonHtml = '<i class="content icon"></i><span class="text">Press (.)</span>';

    var $stickyButton = $('<div/>').addClass('ui black big show-nav right attached button').html(navButtonHtml).prependTo('.pusher');

    var $sideBar = $('<div/>').addClass('ui vertical sidebar inverted menu left nav-panel borderless').prependTo('body');

    $('<div/>').addClass('item').html('<h4 class="ui header inverted">Quick Nav</h4>').appendTo($sideBar);
    var $sideBarMenu = $('<div/>').addClass('menu').appendTo($sideBar);

    $anchors.each(function(index, anchor){
        if(index > 0){
            var $anchor = $(anchor);
            $('<a/>').addClass('item').html($anchor.html()).attr('href', '#'+$anchor.attr('id')).appendTo($sideBarMenu);
        }
    });

    $sideBar.sidebar({
        dimPage: false,
        transition: 'overlay',
        mobileTransition: 'uncover'
    });

    $sideBar.sidebar('attach events', '.show-nav');

    $(document).on('keydown', function(e) {
        if(e.which == 190){
            $sideBar.sidebar('toggle');
        }

    });
});