/*
 * Based on a jquery script discussed at stackoverflow.com:
 * https://stackoverflow.com/questions/4054211/jquery-hide-show-list-items-after-nth-item
 * Requires: jQuery
 *
 */

jQuery.fn.foldlist = function(settings) {
    // get the next parent div with class foldablelist, see if it holds a parameter to override global settings
    let new_setting = jQuery(this).parents('div.foldablelist').attr('data-collapse_after');
    if (new_setting != undefined) {
        settings.collapse_after = new_setting;
    }

    return this.each(function(){
        var $bt = jQuery('<input type="button" class="toggle_foldablelist" />');
        $bt.attr('style', settings.button_css);
        $bt.val(settings.button_up_value);

        var $list = jQuery(this);
        if($list.children().length > settings.collapse_after) {
            $list.children().slice(settings.collapse_after).toggle();
            $bt.val(settings.button_down_value);

            $list.parent().append($bt);
            var $act_bt = $list.parent().find('.toggle_foldablelist');
            $act_bt.click(function() {
                $list.children().slice(settings.collapse_after).toggle();
                if(settings.button_down_value == $act_bt.val()) {
                    $act_bt.val(settings.button_up_value)
                } else {
                    $act_bt.val(settings.button_down_value)
                }
            });
        }
    });
};


jQuery(function(){
    // read settings from config
    let settings = JSINFO['plugin_foldablelist'];
    jQuery('div.foldablelist ul,ol').each(function(){
        jQuery(this).foldlist(settings);
    });
});
