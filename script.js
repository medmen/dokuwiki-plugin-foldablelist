/*
 * DokuWiki Plugin foldablelist (Syntax Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  medmen <med-men@gmx.net>
 *
 * Based on a jquery script discussed at stackoverflow.com:
 * https://stackoverflow.com/questions/4054211/jquery-hide-show-list-items-after-nth-item
 * Requires: jQuery
 *
 */

jQuery.fn.foldbylength = function(settings) {
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

jQuery.fn.foldbylevel = function(settings) {
    // same for collapse_level
    let new_collpase_level = jQuery(this).parents('div.foldablelist').attr('data-collapse_level');
    if (new_collpase_level != undefined) {
        settings.collapse_level = new_collpase_level;
    }

    function isPositiveInt(str) {
        var n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n > 0;
    }

    return this.each(function() {
        // define a button with start value
        var $bt = jQuery('<input type="button" class="toggle_foldablelist" />');
        $bt.attr('style', settings.button_css);
        $bt.val(settings.button_up_value);

        var $list = jQuery(this);

        // handle collapse after nth level
        if (isPositiveInt(settings.collapse_level)) {
            var $level_search_pattern = 'ul,ol '.repeat(settings.collapse_level);
            // $list.find($level_search_pattern).css("background", "red"); // uncomment for easier debugging
            $max_visible_level = $list.find($level_search_pattern);
            $max_visible_level.toggle();
            $max_visible_level.parent().children('div').append($bt); // add button to list

            // handle button clicks
            var $act_bt = $list.parent().find('.toggle_foldablelist');
            $act_bt.click(function() {
                $max_visible_level.toggle();
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
    jQuery('div.foldablelist > ul,ol').each(function(){
        jQuery(this).foldbylength(settings);
        jQuery(this).foldbylevel(settings);
    });
});