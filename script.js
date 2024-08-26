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

    console.group('fold');
    console.time();

    function isPositiveInt(str) {
        let isPosInt= false;
        if( Number.isInteger(Number(str)) && Number(str) > 0 && Number(str) < 10) {
            isPosInt = true;
        }
        console.log('given Number ' + str + ' is positive.int ' + isPosInt);
        return isPosInt;
    }

    function addToggleButton(list, settings) {
        console.group('ToggleButton');
        const bt = jQuery('<input type="button" class="toggle_foldablelist_level" />');
        bt.attr('style', settings.button_css);
        bt.val(settings.button_up_value);
        bt.on ("click", function() {
            console.dir(list);
            list.find('.foldablelist_toggle').toggle();

            // using val() function sanitizes values, so we dont get XSS'ed
            if(settings.button_down_value == bt.val()) {
                bt.val(settings.button_up_value)
            } else {
                bt.val(settings.button_down_value)
            }
        });
        console.log('prepending button');
        list.closest('div.foldablelist').prepend(bt);
        console.groupEnd('ToggleButton');
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
        console.group('toggleByLevel');
        console.log('toggeling at Level:' + n);
        if(n == undefined) {
            return;
        }
        // Select all list items

        // console.dir({list});
        console.log('LIST-Parent: ' + list.parents('div').eq(0).attr('class'));

        const listItems = list.find('ol li, ul li');
        console.dir({listItems});
        nthLevelItems = listItems.filter(function() {
            level = jQuery(this).parents('ol, ul').length-1;
            console.log('Level:' + level);
            if (level == n) {
                console.log('Level ist at targt' + n);
            }

            return level == n;
        });
        // Toggle the visibility of the nth level items
        console.dir({nthLevelItems});
        // nthLevelItems.toggle();
        nthLevelItems.addClass('foldablelist_toggle');

        console.groupEnd('toggleByLevel');
    }

    function toggleNthChild(list, n) {
        console.group('toggleAfterChildren');
        console.log('toggeling after ' + n + 'Chilren');

        if(n == undefined) {
            console.error('n is undef, cannot continue');
            return;
        }
        console.log('While toggleNthChild, list is:');
        console.dir({list});

        const colors = Array('red', 'green', 'yellow', 'blue', 'purple', 'magenta', 'white');

        // find parent div
        list.closest('div.foldablelist').find("ul, ol").each(function() {
            const colr = colors[Math.floor(Math.random() * colors.length)];
            jQuery(this).css('border', '1 px solid' + colr);
            jQuery(this).append( "<span>" + n + "</span>" );
            hideChildren = jQuery(this).children('li').slice(n);
            hideChildren.css('background', colr);
            hideChildren.addClass('foldablelist_toggle');
        });

        console.groupEnd('toggleAfterChildren');
  }

    /**
     * ########## Main part ###############
     */

    return this.each(function() {
        list = jQuery(this);
        console.dir(list);

        console.log('LIST-Parent: ' + list.parents('div').eq(0).attr('class'));
        console.log('LIST-class: ' + list.attr('class'));

        /**
         *  checks first: see if values given by plugin settings are positive integers
         */
        // see if default settings contain positive numbers, otherwise delete them from settings object
        if (isPositiveInt(settings.collapse_after) == false) {
            console.log('settings.collapse_after is not positive, deleting ..');
            delete (settings.collapse_after);
        }
        if (isPositiveInt(settings.collapse_level) == false) {
            console.log('settings.collapse_level is not positive, deleting ..');
            delete (settings.collapse_level);
        }

        /**
         * see if separate settings for collapsing are set via div
         */

        const setCollapseNthChild = jQuery(this).closest('div.foldablelist').attr('data-collapse_after');
        if (setCollapseNthChild !== undefined) {
            if (isPositiveInt(setCollapseNthChild)) {
                console.log('settings.collapse_after in div is  positive, updating value ..');
                settings.collapse_after = setCollapseNthChild;
                toggleNthChild(list, settings.collapse_after);
            } else {
                console.log('settings.collapse_after in div is negative or zero, unsetting ..');
                delete (settings.collapse_after);
            }
        }

        const setCollapseLevel = jQuery(this).closest('div.foldablelist').attr('data-collapse_level');
        if (setCollapseLevel !== undefined) {
            if (isPositiveInt(setCollapseLevel)) {
                console.log('settings.collapse_level in div is  positive, updating value ..');
                settings.collapse_level = setCollapseLevel;
                toggleNthLevel(list, settings.collapse_level);
            } else {
                console.log('settings.collapse_level in div is negative or zero, unsetting ..');
                delete (settings.collapse_level);
            }
        }

        console.log('actual collapse_level: ' + settings.collapse_level + ' and collapse_after: ' + settings.collapse_after);

        /**
         * only add toggle button if at least 1 setting is positive int
         */
        if (settings.collapse_level !== undefined || settings.collapse_after !== undefined) {
            addToggleButton(list, settings);
        }

        console.timeEnd();
        console.groupEnd('fold');
    });
};

jQuery(function(){
    // read settings from config
    const settings = JSINFO['plugin_foldablelist'];
    console.log('native settings: ' + JSON.stringify(settings,null, 4));

    jQuery('div.foldablelist').fold(settings);
});