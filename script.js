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

    function isPositiveInt(str) {
        let isPosInt= false;
        if( Number.isInteger(Number(str)) && Number(str) > 0 && Number(str) < 10) {
            isPosInt = true;
        }
        return isPosInt;
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

        /**
        * see if default settings contain positive numbers, otherwise delete them from settings object
        */

        if (isPositiveInt(settings.collapse_after) == false) {
            delete (settings.collapse_after);
        }
        if (isPositiveInt(settings.collapse_level) == false) {
            delete (settings.collapse_level);
        }

        /**
         * see if separate settings for collapsing are set via div
         */

        const setCollapseNthChild = parentDiv.attr('data-collapse_after');
        if (setCollapseNthChild !== undefined) {
            if (isPositiveInt(setCollapseNthChild)) {
                settings.collapse_after = setCollapseNthChild;
                toggleNthChild(list, settings.collapse_after);
            } else {
                delete (settings.collapse_after);
            }
        }

        const setCollapseLevel = parentDiv.attr('data-collapse_level');
        if (setCollapseLevel !== undefined) {
            if (isPositiveInt(setCollapseLevel)) {
                settings.collapse_level = setCollapseLevel;
                toggleNthLevel(list, settings.collapse_level);
            } else {
                delete (settings.collapse_level);
            }
        }

        // console.log('actual collapse_level: ' + settings.collapse_level + ' and collapse_after: ' + settings.collapse_after);

        /**
         * only add toggle button if at least 1 setting is positive int
         */
        if (settings.collapse_level !== undefined || settings.collapse_after !== undefined) {
            addToggleButton(list, settings);
        }

    });
};

jQuery(function(){
    // read settings from config
    const settings = JSINFO['plugin_foldablelist'];
    jQuery('div.foldablelist').fold(settings);
});