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
        settings = {collapse_after: new_setting};
    }

    return this.each(function(){
        var $bt = jQuery('<input type="button" style="padding: 0.2em; text-align: center; font-weight: bolder" class="toggle_foldablelist" value="&vArr;"/>');
        var $list = jQuery(this);
        if($list.children().length > settings.collapse_after) {
            $list.children().slice(settings.collapse_after).toggle();
            $list.parent().append($bt);

            $list.parent().find('.toggle_foldablelist').click(function() {
                $list.children().slice(settings.collapse_after).toggle();
            });
        }
    });

    console.log('done');
};


jQuery(function(){
    /**
     * TODO:
     * - implement a more general way so this would work with ol as well
     * - make toggle button styleable
     */
    let settings = {collapse_after: JSINFO['plugin_foldablelist']['collapse_after']};
    jQuery('div.foldablelist ul').each(function(){
        jQuery(this).foldlist(settings);
    });
});
