<?php
/**
 * DokuWiki Plugin scrollticker (Syntax Component)
 *
 * @license GPL 2 http://www.gnu.org/licenses/gpl-2.0.html
 * @author  medmen <med-men@gmx.net>
 * @author Michael Bohn <mjbohn@gmail.com>
 */

// must be run within Dokuwiki
if (!defined('DOKU_INC')) die();

class syntax_plugin_foldablelist extends DokuWiki_Syntax_Plugin {
    /**
     * @return string Syntax mode type
     */
    public function getType() {
        return 'protected';
    }

    function getAllowedTypes() {
        return array('container','substition','protected','disabled','formatting','paragraphs');
    }

    /**
     * @return string Paragraph type
     */
    public function getPType() {
        return 'block';
    }
    /**
     * @return int Sort order - Low numbers go before high numbers
     */
    public function getSort() {
        return 201;
    }

    /**
     * Connect lookup pattern to lexer.
     *
     * @param string $mode Parser mode
     */
    public function connectTo($mode) {
        $this->Lexer->addEntryPattern('<foldablelist>(?=.*?</foldablelist>)',$mode,'plugin_foldablelist');
    }

    public function postConnect() {
        $this->Lexer->addExitPattern('</foldablelist>','plugin_foldablelist');
    }


    /**
     * Handle matches of the scrollticker syntax
     *
     * @param string          $match   The match of the syntax
     * @param int             $state   The state of the handler
     * @param int             $pos     The position in the document
     * @param Doku_Handler    $handler The handler
     * @return array Data for the renderer
     */
    public function handle($match, $state, $pos, Doku_Handler $handler){
        private $tag, $flags, $appendix;
        $tag = false;
        $flags = false;      
                                                       
        $appendix = substr($match, 13, -1); // strip <foldablelist  from start and > from end
        if (strlen($appendix) > 2) { //check if parameters are given 
            list($appendix, $flags) = explode('&', $appendix, 2);
            $flags = explode('&', $flags);
            list( , $tag) = explode('?', $appendix);
        }
        
        return array($state, $match, trim($tag), $flags);
        
        // return array($state, $match);
    }

    /**
     * Render xhtml output or metadata
     *
     * @param string         $mode      Renderer mode (supported modes: xhtml)
     * @param Doku_Renderer  $renderer  The renderer
     * @param array          $data      The data from the handler() function
     * @return bool If rendering was successful.
     */
    public function render($mode, Doku_Renderer $renderer, $data) {
        if($mode != 'xhtml') return false;
        
        list($state, $match, $tag, $flags) = $data;
        
        switch ($state) {
            case DOKU_LEXER_ENTER :
                $renderer->doc .= '<div class="foldablelist">';
                break;
            case DOKU_LEXER_UNMATCHED :
                $renderer->doc .= $renderer->_xmlEntities($match);
                break;
            case DOKU_LEXER_EXIT :
                $renderer->doc .= '</div>';
                break;
            default:
                $renderer->doc.= 'MATCH: '.$renderer->_xmlEntities($match);
                $renderer->doc.= 'STATE: '.$renderer->_xmlEntities($state);
        }

        // pass config flags to internal config options
        foreach($flags as $flag) {
                $separator_pos = strpos($flag, '=');
                if ($separator_pos === false) {
                    continue; // no "=" found, skip to next flag
                }

                $conf_name = trim(strtolower(substr($flag, 0 , $separator_pos)));
                $conf_val = trim(strtolower(substr($flag, $separator_pos+1)));

                if(in_array($conf_name, array('collapse_after'))) {
                    $my->conf[$conf_name] = $conf_val; // make sure we only allow predefined options 
                }
        }
        
        // $renderer->doc .= var_export($data, true); // might be helpful when debugging
        return true;
    }
}

// vim:ts=4:sw=4:et:
