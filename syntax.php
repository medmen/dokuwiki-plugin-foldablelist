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

    protected $special_pattern = '<foldablelist(\b[^>\r\n]*?)>';
    protected $entry_pattern   = '<foldablelist\b.*?>(?=.*?</foldablelist>)';
    protected $exit_pattern    = '</foldablelist>';


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
        $this->Lexer->addSpecialPattern($this->special_pattern, $mode, 'plugin_foldablelist');
        $this->Lexer->addEntryPattern($this->entry_pattern, $mode, 'plugin_foldablelist');
    }

    public function postConnect() {
        $this->Lexer->addExitPattern($this->exit_pattern, 'plugin_foldablelist');
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
        switch ($state) {
            case DOKU_LEXER_SPECIAL:
                $parameters = explode(' ', (trim($match[1])));
                foreach($parameters as $parameter) {
                    list($key, $val) = explode('=', $parameter);
                    $key = strtolower(trim(htmlspecialchars($key)));
                    $val = strtolower(trim(htmlspecialchars($val)));
                    if(in_array($key, $this->conf)) {
                        $this->conf[$key] = $val; // overrride config
                    }
                }
                break;
            default:
                return array($state, $match);
        }
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
        if (empty($data)) return false;

        list($state, $match) = $data;

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

        $renderer->doc .= var_export($data, true); // might be helpful when debugging
        return true;
    }
}

// vim:ts=4:sw=4:et: