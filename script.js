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

jQuery.fn.fold = function(settings) {
    function isPositiveInt(string) {
        const number = Number(string);
        const isInteger = Number.isInteger(number);
        const isPositive = number > 0;
        const isLessThan10 = number < 10;
        return isInteger && isPositive && isLessThan10;
    }

    function addToggleButton(list, settings) {
        const bt = jQuery('<input type="button" class="toggle_foldablelist_level" />');
        bt.attr('style', settings.button_css);
        bt.val(settings.button_up_value);
        bt.on ("click", function() {
            list.find('.foldablelist_toggle').toggle();

            // using val() function sanitizes values, so we dont get XSS'ed
            if(settings.button_down_value == bt.val()) {
                bt.val(settings.button_up_value)
            } else {
                bt.val(settings.button_down_value)
            }
        });
        list.closest('div.foldablelist').prepend(bt);
    }

    /**
     * toggleNthLevel - this is a generic jQuery function which should
     * basically work outside DW too.
     * There ist a simpler solution: DW inserts a class=levelX to each li element
     * so you could just use
     * jQuery('list li.classX').toggle()
     * @param list the jQuery list we want to parse
     * @param n integer telling at which depth to hide
     */
    function toggleNthLevel(list, n) {
        if(n == undefined) {
            return;
        }
        const listItems = list.find('ol li, ul li');
        const nthLevelItems = listItems.filter(function() {
            const level = jQuery(this).parents('ol, ul').length-1;
            return level === n;
        });
        // Toggle the visibility of the nth level items
        nthLevelItems.addClass('foldablelist_toggle');
    }

    function toggleNthChild(list, n) {
        if(n == undefined) {
            console.error('n is undef, cannot continue');
            return;
        }

        // find parent div
        const parentDiv = list.closest('div.foldablelist');
        parentDiv.find("ul, ol").each(function() {
            const hideChildren = jQuery(this).children('li').slice(n);
            hideChildren.addClass('foldablelist_toggle');
        });
    }

    /**
     * ########## Main part ###############
     */

    return this.each(function() {
        const list = jQuery(this);
        const parentDiv = list.closest('div.foldablelist');
        let show_button = false;
        /**
         * override defaults if set via div
         * but ONLY if checks pass!
         * @TODO; add further checks as you like (e.g. limit max )
         */

        const setCollapseNthChild = parentDiv.attr('data-collapse_after');
        if (setCollapseNthChild !== undefined && isPositiveInt(setCollapseNthChild)) {
                settings.collapse_after = setCollapseNthChild;
        }

        const setCollapseLevel = parentDiv.attr('data-collapse_level');
        if (setCollapseLevel !== undefined && isPositiveInt(setCollapseLevel)) {
                settings.collapse_level = setCollapseLevel;
        }

        // console.log('actual collapse_level: ' + settings.collapse_level + ' and collapse_after: ' + settings.collapse_after);

        /**
         * fold list only if final setting is positive int
         */
        if(isPositiveInt(settings.collapse_after)) {
            show_button = true;
            toggleNthChild(list, settings.collapse_after);
        }

        if(isPositiveInt(settings.collapse_level)) {
            show_button = true;
            toggleNthLevel(list, settings.collapse_level);
        }

        /**
         * only add toggle button if at least 1 setting is positive int
         */
        if (show_button === true) {
            list.find('.foldablelist_toggle').toggle();
            addToggleButton(list, settings);
        }
    });
};

jQuery(function(){
    // read settings from config
    const settings = JSINFO['plugin_foldablelist'];
    jQuery('div.foldablelist').fold(settings);
});