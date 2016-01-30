$(document).ready(function() {

    var getCodeStart = function($el) {
        return $el.children('pre').children('code[data-lang=sh], code[data-lang=bash], code[data-lang=PowerShell]');
    }

    var $markdownBody = $('article.markdown-body');

    var $els = $();
    $els = $els.add($markdownBody.find('p').children('mark:contains(Windows), mark:contains(Mac), mark:contains(Linux), mark:contains(Block:)').not('mark:contains(/)').parent());
    $els = $els.add(getCodeStart($markdownBody.find('div.highlight')).parent().parent());

    var getOpt = function(txt) {
        txt = txt.replace('Block:', '');
        switch (txt) {
            case 'PowerShell': return 'Windows';
            case 'bash': return 'Mac';
            case 'sh': return 'Unix';
            default: return txt;
        }
    }

    var os = [],
        osEls = [],
        $optEls,
        $btn,
        text,
        state = 0; // 1 means mark els, 2 means code els

    while ($els.length) {
        $el = $els.first();
        $els = $els.not($el);

        if ((state==0 || state==1) && $el.is('p')) {

            state = 1;
            text = $el.children('mark:first').text();
            $optEls = $el.nextUntil('p:has(> mark:contains(\'/'+text+'\'))');
            $els = $els.not($optEls);
            $el.remove();
            $el = $optEls.last().next().next();
            $optEls.last().next().remove();
            os.push(getOpt(text));
            osEls.push($optEls);

        } else if ((state==0 || state==2) && $el.is('div')) {

            text = $el.children('pre:first').children('code:first').data('lang');
            if (($tmp = getCodeStart($el.next())).length
                    && text != $tmp.data('lang')
                || ($tmp = getCodeStart($el.prev())).length
                    && text != $tmp.data('lang')) {

                state = 2;
                os.push(getOpt(text));
                osEls.push($el);
                $el = $el.next();
            }

        }

        if (!$el.length || !$els.length || !$els.filter($el).length) {
            state = 0;
            if (os.length > 1) {
                // create the button
                $btn = $('<div/>').addClass('ui basic buttons').insertBefore(osEls[0].first());
                for (var i=0; i<os.length; i++) {
                    var $b = $('<div/>').addClass('ui button').html(os[i]).on('click', function() {
                        $(this).data('shows').show();
                        $(this).data('hides').hide();
                        $(this).siblings().removeClass('active');
                        $(this).addClass('active');
                    }).appendTo($btn);
                    var hides = $();
                    var shows = $();
                    for (var j=0; j<os.length; j++) {
                        if (j == i) {
                            shows = shows.add(osEls[j])
                        } else {
                            hides = hides.add(osEls[j])
                        }
                    }
                    $b.data('hides', hides);
                    $b.data('shows', shows);
                }
                $btn.children(':first').click();
            }
            os = []; osEls = [];
        }
    }

});