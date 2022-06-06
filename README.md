# dokuwiki-plugin-foldablelist
plugin that makes an unordered list invisible after n items

## how to use?
simply wrap an unordered list into the tags

```
<foldablelist>  
  * list item 1
  * list item 2
  * list item 3 
</foldablelist>
```
this list can be generated via markup or dokuwiki plugins like the tag-plugin.

#### Advanced use
```
<foldablelist>  
{{topic>ns1:sub-ns?tag}}
</foldablelist>
```
uses the tag plugin (topic component) to generate the list from all pages in the namespace ns1/sub-ns tagged with "tag" 

## configuration
this plugin can be configured via dokuwikis admin config page
So far there are 4 items to configure:

`collapse_after: 5` the number of list items to be displayed before hiding the rest of the list, default value: 5

`button_css: 'padding: 0.2em;'` css to style your button, feel free to colorize of move it around

`button_up_value: ▲` the value shown in the button when clicking will collapse the list

`button_down_value: ▼` the value shown in the button when clicking will unfold the list

#### new in 2020: 
you can pass the config to every single instance: 

```
<foldablelist collapse_after=2>
  * list item 1
  * list item 2
  * list item 3 
</foldablelist>
```
this will show only the first 2 items

#### new in 2022:

added config-options for CSS and separate Button-Up and Button-Down

foldablelist will now work with ordered lists (ol) too ;-)


## why use?
people like to put "important stuff" on startpage and the department i work in is not different.
Things considered "important" get written on startpage, usually as lists (upcoming meetings, changes in workflow, new orders by the boss ...)
and each list naturally grows as new items are added on top but older items remain important enough to keep them..

Our startpage has grown to a length of 4 screen-pages by now because of that, so sooner
or later my boss asked me to reduce the visible number of items on those lists to
a certain minimum.    

This plugin adresses the issue in a quick and cosmetic way: 
all information is still available, but (hopefully) less important stuff gets hidden by default.      

## great but i miss feature X 
Feel free to improve, share and debug!

* send me feature requests
* found a bug? please report at github
* you are a programmer and want to improve the plugin? 
Go ahead --> fork, rewrite, enhance and extend..   
