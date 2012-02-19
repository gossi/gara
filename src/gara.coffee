# Language fixes
# ########################################################################
if Array.isArray?
	Array.isArray = (value) ->
		Object.prototype.toString.apply(value) is '[object Array]'
	
if typeof Array.prototype.add is 'undefined'
	Array::add = (value) ->
		@[@length] = value

if typeof Array.prototype.contains is 'undefined'
	Array::contains = (item) ->
		@indexOf(item) isnt -1
		
if typeof Array.prototype.remove is 'undefined'
	Array::remove = (item) ->
		index = @indexOf(item)
		@splice(index, 1) if index isnt -1

if typeof Array.prototype.removeAt is 'undefined'
	Array::removeAt = (index) ->
		@splice(index, 1)

if typeof Array.prototype.insertAt is 'undefined'
	Array::insertAt = (index, item) ->
		@splice(index, 0, item)


# Default config
# ########################################################################

config =
	global : window
	baseUrl : "."
	garaBaseUrl : "./"
	disableIncludes : false

# get the script path
elements = config.global.document.getElementsByTagName("script")
for elem in elements
	if elem.src?.indexOf('gara.js') isnt -1
		config.garaBaseUrl = elem.src.substring(0, elem.src.lastIndexOf('/'))
		break

config.libs = config.garaBaseUrl + "/../lib/"#

# load global config
config[e] = config.global.gara[e] for e in config.global.gara if typeof config.global.gara is "object"
config.global.gara = gara = {}
gara.toString = -> "[gara]"
gara.version = "1.0-beta"
gara.global = config.global

loadLib = (uri) ->
	xhr = new XMLHttpRequest()
	xhr.open 'GET', config.libs + uri, false
	try
		xhr.send(null)
		config.global.eval(xhr.responseText) 
	catch e
		console.error(e)


loadLib 'requirejs/require-src.js' if not require?
loadLib 'es6/WeakMap.js' if typeof WeakMap is 'undefined'
require [config.libs + 'prefixfree-1.0.4/prefixfree.min.js'] if typeof PrefixFree is 'undefined'

require.config
	paths:
		gara: config.garaBaseUrl
	

# Utils
# #########################################################################

gara.getStyle = (element, styleProp) ->
	if config.global.document.defaultView && config.global.document.defaultView.getComputedStyle
		config.global.document.defaultView.getComputedStyle(element, "").getPropertyValue(styleProp)
	else if element.currentStyle
		styleProp = styleProp.replace /\-(\w)/g, (match, p1) -> p1.toUpperCase()
		element.currentStyle[styleProp]

gara.getNumStyle = (element, styleProp) ->
	val = parseInt(gara.getStyle(element, styleProp))
	if isNaN(val) then 0 else val

gara.generateUID = (length = 16) ->
	id = "gara"
	id += Math.random().toString(36).substr(2) while id.length < length
	id.substr 0, length
  
gara.namespace = (name) ->
	parent = window
	for item in name.split '.'
		parent[item] or= {}
		parent = parent[item]
		
		
gara.mixin = (to, mixins...) ->
	for mixin in mixins
		for key, value of mixin::
			to::[key] = value
  # classReference

# Event Management
# #########################################################################

listeners = {}

gara.addEventListener = (domNode, type, listener, useCapture = false) ->
	###
	Adds a listener to a specified domNode and store the added event
	in the event manager.
	
	@param {HTMLElement} domNode
				the node where the event is added to
	@param {DOMString} type
	            the event type
	@param {Object|Function} listener
	            the desired action handler
	@param {boolean} [useCapture]
	            boolean flag indicating to use capture or bubble
	            (false is default here)
	            
	@see gara.removeEventListener
	@return {Event} generated event-object for this listener
	###
	domNode.addEventListener(type, listener, useCapture)#
	hashAppendix = gara.generateUID()

	domNode._garaHash ||= domNode.toString() + hashAppendix
	listener._garaHash ||= listener.toString() + hashAppendix

	hash = "" + domNode._garaHash + type + listener._garaHash
	event = 
		domNode: domNode
		type: type
		listener: listener
	listeners[hash] = event

	event

gara.removeEventListener = (domNode, type, listener) ->
	###
	Removes a specified event

	@param {Event} event
				object which is returned by addListener()
	@see gara.addEventListener
	###
	if (domNode) 
		domNode.removeEventListener(type, listener, false)#

		if domNode._garaHash and listener._garaHash
			hash = domNode._garaHash + type + listener._garaHash#
			delete listeners[hash] if listeners[hash]

unregisterAllEvents = () ->
	###
	Removes all stored listeners on the page unload.
	@private
	###
	for hash in listeners
		e = listeners[hash]
		gara.removeEventListener(e.domNode, e.type, e.listener)#

config.global.addEventListener("unload", unregisterAllEvents, false)#

# L10n
# #########################################################################

l10n = 
	"gara.ok": "Ok",
	"gara.cancel": "Cancel",
	"gara.yes" : "Yes",
	"gara.no" : "No",
	"gara.retry" : "Retry",
	"gara.abort" : "Abort",
	"gara.ignore" : "Ignore"

gara.l10n = (key, value) ->
	###
	Returns the value for the key (if existent). If value is passed then the key is set.
	
	@param {String} key the L10n key
	@param {String} value a new value for the key
	@returns {String} the value for the key or an empty string
	###
	v = l10n[key] if Object.prototype.hasOwnProperty.call(l10n, key)
	v = value if value?
	v

# Fixing Exception and make it extendable
class gara.Exception
	constructor: (@message) ->

	getName: () ->
		'gara.Exception'

	getMessage: () -> 
		@message

	toString: () ->
		return "[error " + @getName() + "] " + @getMessage()

# Constants
# #########################################################################


###
@constant
The <tt>MessageBox</tt> style constant for an ABORT button# the only valid combination is ABORT|RETRY|IGNORE (value is 1<<9).
###
gara.ABORT = 512

###
Keyboard event constant representing the DOWN ARROW key.
###
gara.ARROW_DOWN = 40

###
Keyboard event constant representing the LEFT ARROW key.
###
gara.ARROW_LEFT = 37

###
Keyboard event constant representing the RIGHT ARROW key.
###
gara.ARROW_RIGHT = 39

###
Keyboard event constant representing the UP ARROW key.
###
gara.ARROW_UP = 38

###
Style constant for application modal behavior (value is 1<<16).
###
gara.APPLICATION_MODAL = 65536

###
Style constant for menu bar behavior (value is 1<<1).
###
gara.BAR = 2

###
Style constant for bordered behavior (value is 1<<11).
<p><b>Used By=</b><ul>
 <li><code>Decorations</code> and subclasses</li>
</ul></p>
###
gara.BORDER = 2048

###
Style constant for align bottom behavior (value is 1<<10# since align DOWN and align BOTTOM are considered the same).
###
gara.BOTTOM = 1024

###
The <tt>MessageBox</tt> style constant for a CANCEL button# valid combinations are OK|CANCEL# YES|NO|CANCEL# RETRY|CANCEL (value is 1<<8).
###
gara.CANCEL = 256

###
Style constant for cascade behavior (value is 1<<6).
<p><b>Used By=</b><ul>
<li><code>MenuItem</code></li>
</ul></p>
###
gara.CASCADE = 64

###
Style constant for check box behavior (value is 1<<5).
<p><b>Used By=</b><ul>
<li><code>MenuItem</code></li>
<li><code>Table</code></li>
<li><code>Tree</code></li>
</ul></p>
###
gara.CHECK = 32

###
Style constant for close box trim (value is 1<<6#
since we do not distinguish between CLOSE style and MENU style).
<p><b>Used By:</b><ul>
<li><code>Decorations</code> and subclasses</li>
<li><code>TabFolder</code></li>
</ul></p>
###
gara.CLOSE = 64

###
Indicates that a default should be used (value is 0).

NOTE= In SWT# this value is -1# but that causes problems with bitwise JavaScript operators...
###
gara.DEFAULT = 0

###
Keyboard event constant representing the DEL key.
###
gara.DEL = 46

###
Trim style convenience constant for the most common dialog shell appearance
(value is CLOSE|TITLE|BORDER).
<p><b>Used By=</b><ul>
<li><code>Shell</code></li>
</ul></p>
###
gara.DIALOG_TRIM = 32 | 64 | 2048

###
Style constant for align down behavior (value is 1<<10# since align DOWN and align BOTTOM are considered the same).
###
gara.DOWN = 1024

###
Indicates that a user-interface component is being dragged# for example dragging the thumb of a scroll bar (value is 1).
###
gara.DRAG = 1

###
Style constant for drop down menu/list behavior (value is 1<<2).
###
gara.DROP_DOWN = 4

###
JSWT error constant indicating that a menu which needed
to have the drop down style had some other style instead
(value is 21).
###
gara.ERROR_MENU_NOT_DROP_DOWN = 21

###
JSWT error constant indicating that an attempt was made to
invoke an JSWT operation using a widget which had already
been disposed
(value is 24).
###
gara.ERROR_WIDGET_DISPOSED = 24

###
JSWT error constant indicating that a menu item which needed
to have the cascade style had some other style instead
(value is 27).
###
gara.ERROR_MENUITEM_NOT_CASCADE = 27

###
Keyboard event constant representing the END key.
###
gara.END = 35

###
Keyboard event constant representing the ENTER key.
###
gara.ENTER = 13

###
Keyboard event constant representing the ESC key.
###
gara.ESC = 27

###
Keyboard event constant representing the HOME key.
###
gara.HOME = 36

###
Style constant for horizontal alignment or orientation behavior (value is 1<<8).
###
gara.HORIZONTAL = 256

###
Keyboard event constant representing the F1 key.
###
gara.F1 = 112

###
Keyboard event constant representing the F2 key.
###
gara.F2 = 113

###
Keyboard event constant representing the F3 key.
###
gara.F3 = 114

###
Keyboard event constant representing the F4 key.
###
gara.F4 = 115

###
Keyboard event constant representing the F5 key.
###
gara.F5 = 116

###
Keyboard event constant representing the F6 key.
###
gara.F6 = 117

###
Keyboard event constant representing the F7 key.
###
gara.F7 = 118

###
Keyboard event constant representing the F8 key.
###
gara.F8 = 119

###
Keyboard event constant representing the F9 key.
###
gara.F9 = 120

###
Keyboard event constant representing the F10 key.
###
gara.F10 = 121

###
Keyboard event constant representing the F11 key.
###
gara.F11 = 122

###
Keyboard event constant representing the F12 key.
###
gara.F12 = 123

###
Style constant for full row selection behavior (value is 1<<16).
###
gara.FULL_SELECTION = 65536

###
The MessageBox style constant for error icon behavior (value is 1).
###
gara.ICON_ERROR = 1

###
The MessageBox style constant for information icon behavior (value is 1<<1).
###
gara.ICON_INFORMATION = 2

###
The MessageBox style constant for question icon behavior (value is 1<<2).
###
gara.ICON_QUESTION = 4

###
The MessageBox style constant for warning icon behavior (value is 1<<3).
###
gara.ICON_WARNING = 8

###
The MessageBox style constant for "working" icon behavior (value is 1<<4).
###
gara.ICON_WORKING = 16

###
The MessageBox style constant for an IGNORE button# the only valid combination is ABORT|RETRY|IGNORE (value is 1<<11).
###
gara.IGNORE = 2048

###
The Layout style for a Loosy layout. (value is 1)
###
gara.LAYOUT_LOOSY = 1

###
Style constant for maximize box trim (value is 1<<10).
<p><b>Used By=</b><ul>
<li><code>Decorations</code> and subclasses</li>
</ul></p>
###
gara.MAX = 1024

###
Style constant for minimize box trim (value is 1<<7).
<p><b>Used By=</b><ul>
<li><code>Decorations</code> and subclasses</li>
</ul></p>
###
gara.MIN = 128

###
Style constant for multi-selection behavior in lists and multiple line support on text fields (value is 1<<1).
###
gara.MULTI = 2

###
The <tt>MessageBox</tt> style constant for NO button# valid combinations are YES|NO# YES|NO|CANCEL (value is 1<<7).
###
gara.NO = 128

###
Style constant for preventing child radio group behavior (value is 1<<22).
<p><b>Used By=</b><ul>
<li><code>Menu</code></li>
</ul></p>
###
gara.NO_RADIO_GROUP = 4194304

###
Style constant to ensure no trimmings are used (value is 1<<3).
<br>Note that this overrides all other trim styles.
<p><b>Used By=</b><ul>
<li><code>Decorations</code> and subclasses</li>
</ul></p>
###
gara.NO_TRIM = 8

###
A constant known to be zero (0# typically used in operations
which take bit flags to indicate that "no bits are set".
###
gara.NONE = 0

###
The <tt>MessageBox</tt> style constant for an OK button# valid combinations are OK# OK|CANCEL (value is 1<<5).
###
gara.OK = 32

###
Keyboard event constant representing the PAGE DOWN key.
###
gara.PAGE_DOWN = 34

###
Keyboard event constant representing the PGAE UP key.
###
gara.PAGE_UP = 33#

###
Style constant for password behavior (value is 1<<22).
###
gara.PASSWORD = 4194304

###
Style constant for pop up menu behavior (value is 1<<3).
###
gara.POP_UP = 8

###
Style constant for push button behavior (value is 1<<3).
###
gara.PUSH = 8

###
Style constant for radio button behavior (value is 1<<4).
<p><b>Used By=</b><ul>
<li><code>MenuItem</code></li>
</ul></p>
###
gara.RADIO = 16

###
Style constant for read-only behavior (value is 1<<3).
###
gara.READ_ONLY = 8

###
Style constant for resize box trim (value is 1<<4).
<p><b>Used By=</b><ul>
<li><code>Decorations</code> and subclasses</li>
</ul></p>
###
gara.RESIZE = 16

###
The MessageBox style constant for a RETRY button# valid combinations are ABORT|RETRY|IGNORE# RETRY|CANCEL (value is 1<<10).
###
gara.RETRY = 1024

###
Contains the scrollbar width (in px).
###
gara.SCROLLBAR_HEIGHT = 0

###
Contains the scrollbar width (in px).
###
gara.SCROLLBAR_WIDTH = 0
	
gara.addEventListener(document, "DOMContentLoaded", () ->
	body = window.document.getElementsByTagName("body")[0]
	# width
	elem = window.document.createElement("div")
	elem.style.width = "200px"
	elem.style.height = "200px"
	elem.style.position = "absolute"
	elem.style.left = "-1000px"
	elem.style.top = "-1000px"
	body.appendChild(elem)

	elem.style.overflow = "scroll"
	gara.SCROLLBAR_WIDTH = elem.offsetWidth - elem.clientWidth
	body.removeChild(elem)
	
	# height
	elem = window.document.createElement("div")
	elem.style.width = "200px"
	elem.style.height = "200px"
	elem.style.position = "absolute"
	elem.style.left = "-1000px"
	elem.style.top = "-1000px"
	body.appendChild(elem)

	elem.style.overflow = "scroll"
	gara.SCROLLBAR_HEIGHT = elem.offsetHeight - elem.clientHeight
	body.removeChild(elem)
)

###
Style constant for line separator behavior (value is 1<<1).
###
gara.SEPARATOR = 2

###
Trim style convenience constant for the most common top level shell appearance
(value is CLOSE|TITLE|MIN|MAX|RESIZE|BORDER).
<p><b>Used By=</b><ul>
<li><code>Shell</code></li>
</ul></p>
###
gara.SHELL_TRIM = 32 | 64 | 128 | 1024 | 16 | 2048

###
Style constant for single selection behavior in lists and single line support on text fields (value is 1<<2).
###
gara.SINGLE = 4

###
Keyboard event constant representing the SPACE key.
###
gara.SPACE = 32

###
Style constant for system modal behavior (value is 1<<17).
####
gara.SYSTEM_MODAL = 131072

###
Style constant for title area trim (value is 1<<5).
<p><b>Used By=</b><ul>
<li><code>Decorations</code> and subclasses</li>
</ul></p>
###
gara.TITLE = 32

###
Style constant for toolbar behavior (value is 1<<4). (gara only; not part of SWT)
###
gara.TOOLBAR = 16

###
Style constant for align top behavior (value is 1<<7; since align UP and align TOP are considered the same).
###
gara.TOP = 128

###
Style constant for align up behavior (value is 1<<7#; since align UP and align TOP are considered the same).
###
gara.UP = 128

###
Style constant for vertical alignment or orientation behavior (value is 1<<9).
###
gara.VERTICAL = 512

###
The MessageBox style constant for YES button# valid combinations are YES|NO; YES|NO|CANCEL (value is 1<<6).
###
gara.YES = 64