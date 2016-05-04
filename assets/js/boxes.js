---
---
$(document).ready(function(){
    var $markdownBody = $('.markdown-body');
    $markdownBody.find('blockquote').each(function(idx, el) {
        var cls = '',
            txt = $(el).text().trim(),
            m = txt.match(/^(important|tip|note):/i),
            prefix = m && (m[1]+'').toLowerCase(),
            cls = prefix;
        cls && (cls = 'box '+ cls);
        $(el).addClass(cls);
    })
});
