jQuery.fn.vibrate = function (conf) {
    var config = jQuery.extend({
        speed:        50, 
        duration:    700,  
        spread:       10
    }, conf);

    return this.each(function () {
        var t = jQuery(this);

        var vibrate = function () {
            var topPos    = Math.floor(Math.random() * config.spread) - ((config.spread - 1) / 2);
            var leftPos    = Math.floor(Math.random() * config.spread) - ((config.spread - 1) / 2);
            var rotate    = Math.floor(Math.random() * config.spread) - ((config.spread - 1) / 2);

            t.css({
                MozTransform:       'rotate(' + rotate + 'deg)',
                WebkitTransform:    'rotate(' + rotate + 'deg)',
                OTransform:    'rotate(' + rotate + 'deg)'
            });
        };

        var doVibration = function () {
            var vibrationInterval = setInterval(vibrate, config.speed);

            var stopVibration = function () {
                clearInterval(vibrationInterval);
                t.css({
                    MozTransform:    'rotate(0deg)',
                    WebkitTransform:    'rotate(0deg)',
                    OTransform:    'rotate(0deg)'
                });
            };

            setTimeout(stopVibration, config.duration);
        };
        doVibration();
    });
};

