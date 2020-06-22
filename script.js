/*
 * Based on a jquery script discussed at stackoverflow.com:
 * https://stackoverflow.com/questions/4054211/jquery-hide-show-list-items-after-nth-item
 * Requires: jQuery
 *
 */

jQuery.fn.foldlist = function(settings) {

    collapse = this.closest('foldablelist').attr('collapse_after'); // get closest parent of type foldablelist and read its config setting
    console.log( $(this) );
    if ( typeof collapse !== "undefined" && collapse) {
        // variable is set and isnt falsish so it can be used;
        settings = jQuery.extend({
            collapse_after: collapse
        }, settings);
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
};


jQuery(function(){
    /**
     * TODO:
     * - implement a more general way using .children().length so this would work with ol or lots of ul as well
     * - add a number to each foldablelist to overwrite general "collapse-after" settings
     * - make toggle button styleable
     */

    /**
    * read general settings from config
    */
    let settings = {collapse_after: JSINFO['plugin_foldablelist']['collapse_after']};

    jQuery("div.foldablelist ul").foldlist(settings);
});
