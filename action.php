<?php
/**
 * DokuWiki Plugin foldablelist
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 *
 * @author medmen <med-men@gmx.net>
 */

if(!defined('DOKU_INC')) die();  // no Dokuwiki, no go

class action_plugin_foldablelist extends DokuWiki_Action_Plugin
{
    /**
     * Register the handle function in the controller
     *
     * @param Doku_event_handler $controller The event controller
     */
    function register(Doku_Event_Handler $controller)
    {
        $controller->register_hook('DOKUWIKI_STARTED', 'AFTER', $this, 'addconfig2js');
    }


    /**
     * @param $event
     * @param $params
     */
    function addconfig2js ($event, $params) {
        global $JSINFO;
        global $conf;
        $this->loadConfig();
        $JSINFO['plugin_foldablelist'] = $conf['plugin']['foldablelist'];
    }
}