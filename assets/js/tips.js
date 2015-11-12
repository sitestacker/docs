$(document).ready(function() {
    var tips = [
        'Search anything, just start typing...',
        'Leave comments at the bottom if any issues'
    ];
    var tipsInterval = 5000;

    if (!isMobile()) {
        tips.push(
            'Type \'.\' to open the Quick Nav menu',
            'Type \'/\' to scroll to top',
            'In Quick Nav, hold Shift ⇧ + Enter ↩ to go to a header',
            'In Quick Nav, use arrow keys ↑ ↓ to navigate'
        );
    } else {
        tips.push(
            'Hit ≡ on the top left to open Quick Nav'
        );
    }

    var currentTip = parseInt(localStorage.getItem('currentTip'));
    var getTip = function() {
        var t;
        do {
            t = getRandomInt(0, tips.length);
        } while (t === currentTip);
        return t;
    }
    var $input = $('.ui.search .prompt');

    var changeTip = function(tip) {
        if (tip === undefined) tip = getTip();
        currentTip = tip;
        localStorage.setItem('currentTip', currentTip);
        $input.attr('placeholder', tips[tip]);
    }

    changeTip();

    var int = setInterval(changeTip, tipsInterval);

    $input.on('focus', function() {
        clearInterval(int);
        changeTip(0);
    });

    $input.on('blur', function() {
        int = setInterval(changeTip, tipsInterval);
    });
})