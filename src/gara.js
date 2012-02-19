(function() {

  /*
  
  config =
  	global : window
  	baseUrl : "."
  	garaBaseUrl : "./"
  	disableIncludes : false
  */

  /*
  l10n = 
  	"gara.ok": "Ok",
  	"gara.cancel": "Cancel",
  	"gara.yes" : "Yes",
  	"gara.no" : "No",
  	"gara.retry" : "Retry",
  	"gara.abort" : "Abort",
  	"gara.ignore" : "Ignore"
  
  if Array.isArray?
  	Array.isArray = (value) ->
  		Object.prototype.toString.apply(value) is '[object Array]'
  	
  if Array.prototype.add?
  	Array::add = (value) ->
  		this[@length] = value
  
  if Array.prototype.contains?
  	Array::contains = (item) ->
  		this.indexOf(item) isnt -1
  	
  if Array.prototype.remove?
  	Array::remove = (item) ->
  		if @indexOf(item) !== -1
  	    	this[index, 1]
  	    
  	
  if Array.prototype.removeAt?
  	Array::removeAt = (index) ->
  		this.splice(index, 1)
  	
  if Array.prototype.insertAt?
  	Array::insertAt = (index, item) ->
  		this.splice(index, 0, item)
  */

  var gara;

  window.gara = gara = {};

  /**
   * @function Adds a listener to a specified domNode and store the added event
   *         in the event manager.
   *
   * @param {HTMLElement}
   *            domNode the node where the event is added to
   * @param {DOMString}
   *            type the event type
   * @param {Object|Function}
   *            listener the desired action handler
   * @param {boolean}
   *            [useCapture] boolean flag indicating to use capture or bubble
   *            (false is default here)
   * @return {Event} generated event-object for this listener
  */

  /**
   * @function Removes a specified event
   *
   * @param {Event}
   *            event object which is returned by addListener()
   * @see addListener
  */

  /**
   * @function
   *
   * Removes all stored listeners on the page unload.
   * @private
  */

  /**
   * Returns the value for the key (if existent). If value is passed then the key is set.
   * 
   * @param {String} key the L10n key
   * @param {String} value a new value for the key
   * @returns {String} the value for the key or an empty string
  */

  gara.Exception = (function() {

    function Exception(message) {
      this.message = message;
    }

    Exception.prototype.getName = function() {
      return 'gara.Exception';
    };

    Exception.prototype.getMessage = function() {
      return this.message;
    };

    Exception.prototype.toString = function() {
      return "[error " + this.getName() + "] " + this.getMessage();
    };

    return Exception;

  })();

  /*
  	/**
  	 * @constant
  	 * The <tt>MessageBox</tt> style constant for an ABORT button; the only valid combination is ABORT|RETRY|IGNORE (value is 1&lt;&lt;9).
  	 /
  	gara.ABORT = 512;
  
  	/**
  	 * Keyboard event constant representing the DOWN ARROW key.
  	 /
  	gara.ARROW_DOWN = 40;
  
  	/**
  	 * Keyboard event constant representing the LEFT ARROW key.
  	 /
  	gara.ARROW_LEFT = 37;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the RIGHT ARROW key.
  	 /
  	gara.ARROW_RIGHT = 39;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the UP ARROW key.
  	 /
  	gara.ARROW_UP = 38;
  
  	/**
  	 * 
  	 * Style constant for application modal behavior (value is 1&lt;&lt;16).
  	 /
  	gara.APPLICATION_MODAL = 65536;
  
  	/**
  	 * 
  	 * Style constant for menu bar behavior (value is 1&lt;&lt;1).
  	 /
  	gara.BAR = 2;
  
  	/**
  	 * 
  	 * Style constant for bordered behavior (value is 1&lt;&lt;11).
  	 * <p><b>Used By=</b><ul>
  	 * <li><code>Decorations</code> and subclasses</li>
  	 * </ul></p>
  	 /
  	gara.BORDER = 2048;
  
  	/**
  	 * 
  	 * Style constant for align bottom behavior (value is 1&lt;&lt;10; since align DOWN and align BOTTOM are considered the same).
  	 /
  	gara.BOTTOM = 1024;
  
  	/**
  	 * 
  	 * The <tt>MessageBox</tt> style constant for a CANCEL button; valid combinations are OK|CANCEL; YES|NO|CANCEL; RETRY|CANCEL (value is 1&lt;&lt;8).
  	 /
  	gara.CANCEL = 256;
  
  	/**
  	 * 
  	 * Style constant for cascade behavior (value is 1&lt;&lt;6).
  	 * <p><b>Used By=</b><ul>
  	 * <li><code>MenuItem</code></li>
  	 * </ul></p>
  	 /
  	gara.CASCADE = 64;
  
  	/**
  	 * 
  	 * Style constant for check box behavior (value is 1&lt;&lt;5).
  	 * <p><b>Used By=</b><ul>
  	 * <li><code>MenuItem</code></li>
  	 * <li><code>Table</code></li>
  	 * <li><code>Tree</code></li>
  	 * </ul></p>
  	 /
  	gara.CHECK = 32;
  
  	/**
  	 * Style constant for close box trim (value is 1&lt;&lt;6;
  	 * since we do not distinguish between CLOSE style and MENU style).
  	 * <p><b>Used By:</b><ul>
  	 * <li><code>Decorations</code> and subclasses</li>
  	 * <li><code>TabFolder</code></li>
  	 * </ul></p>
  	 /
  	gara.CLOSE = 64;
  
  	/**
  	 * 
  	 * Indicates that a default should be used (value is 0).
  	 *
  	 * NOTE= In SWT; this value is -1; but that causes problems with bitwise JavaScript operators...
  	 /
  	gara.DEFAULT = 0;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the DEL key.
  	 /
  	gara.DEL = 46;
  
  	/**
  	 * 
  	 * Trim style convenience constant for the most common dialog shell appearance
  	 * (value is CLOSE|TITLE|BORDER).
  	 * <p><b>Used By=</b><ul>
  	 * <li><code>Shell</code></li>
  	 * </ul></p>
  	 /
  	gara.DIALOG_TRIM = 32 | 64 | 2048;
  
  	/**
  	 * 
  	 * Style constant for align down behavior (value is 1&lt;&lt;10; since align DOWN and align BOTTOM are considered the same).
  	 /
  	gara.DOWN = 1024;
  
  	/**
  	 * 
  	 * Indicates that a user-interface component is being dragged; for example dragging the thumb of a scroll bar (value is 1).
  	 /
  	gara.DRAG = 1;
  
  	/**
  	 * 
  	 * Style constant for drop down menu/list behavior (value is 1&lt;&lt;2).
  	 /
  	gara.DROP_DOWN = 4;
  
  	/**
  	 * JSWT error constant indicating that a menu which needed
  	 * to have the drop down style had some other style instead
  	 * (value is 21).
  	 /
  	gara.ERROR_MENU_NOT_DROP_DOWN = 21;
  
  	/**
  	 * JSWT error constant indicating that an attempt was made to
  	 * invoke an JSWT operation using a widget which had already
  	 * been disposed
  	 * (value is 24).
  	 /
  	gara.ERROR_WIDGET_DISPOSED = 24;
  
  	/**
  	 * JSWT error constant indicating that a menu item which needed
  	 * to have the cascade style had some other style instead
  	 * (value is 27).
  	 /
  	gara.ERROR_MENUITEM_NOT_CASCADE = 27;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the END key.
  	 /
  	gara.END = 35;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the ENTER key.
  	 /
  	gara.ENTER = 13;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the ESC key.
  	 /
  	gara.ESC = 27;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the HOME key.
  	 /
  	gara.HOME = 36;
  
  	/**
  	 * 
  	 * Style constant for horizontal alignment or orientation behavior (value is 1&lt;&lt;8).
  	 /
  	gara.HORIZONTAL = 256;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the F1 key.
  	 /
  	gara.F1 = 112;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the F2 key.
  	 /
  	gara.F2 = 113;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the F3 key.
  	 /
  	gara.F3 = 114;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the F4 key.
  	 /
  	gara.F4 = 115;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the F5 key.
  	 /
  	gara.F5 = 116;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the F6 key.
  	 /
  	gara.F6 = 117;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the F7 key.
  	 /
  	gara.F7 = 118;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the F8 key.
  	 /
  	gara.F8 = 119;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the F9 key.
  	 /
  	gara.F9 = 120;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the F10 key.
  	 /
  	gara.F10 = 121;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the F11 key.
  	 /
  	gara.F11 = 122;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the F12 key.
  	 /
  	gara.F12 = 123;
  
  	/**
  	 * 
  	 * Style constant for full row selection behavior (value is 1&lt;&lt;16).
  	 /
  	gara.FULL_SELECTION = 65536;
  
  	/**
  	 * 
  	 * The MessageBox style constant for error icon behavior (value is 1).
  	 /
  	gara.ICON_ERROR = 1;
  
  	/**
  	 * 
  	 * The MessageBox style constant for information icon behavior (value is 1&lt;&lt;1).
  	 /
  	gara.ICON_INFORMATION = 2;
  
  	/**
  	 * 
  	 * The MessageBox style constant for question icon behavior (value is 1&lt;&lt;2).
  	 /
  	gara.ICON_QUESTION = 4;
  
  	/**
  	 * 
  	 * The MessageBox style constant for warning icon behavior (value is 1&lt;&lt;3).
  	 /
  	gara.ICON_WARNING = 8;
  
  	/**
  	 * 
  	 * The MessageBox style constant for "working" icon behavior (value is 1&lt;&lt;4).
  	 /
  	gara.ICON_WORKING = 16;
  
  	/**
  	 * 
  	 * The MessageBox style constant for an IGNORE button; the only valid combination is ABORT|RETRY|IGNORE (value is 1&lt;&lt;11).
  	 /
  	gara.IGNORE = 2048;
  	
  	/**
  	 * 
  	 * The Layout style for a Loosy layout. (value is 1)
  	 /
  	gara.LAYOUT_LOOSY = 1;
  
  	/**
  	 * 
  	 * Style constant for maximize box trim (value is 1&lt;&lt;10).
  	 * <p><b>Used By=</b><ul>
  	 * <li><code>Decorations</code> and subclasses</li>
  	 * </ul></p>
  	 /
  	gara.MAX = 1024;
  
  	/**
  	 * 
  	 * Style constant for minimize box trim (value is 1&lt;&lt;7).
  	 * <p><b>Used By=</b><ul>
  	 * <li><code>Decorations</code> and subclasses</li>
  	 * </ul></p>
  	 /
  	gara.MIN = 128;
  
  	/**
  	 * 
  	 * Style constant for multi-selection behavior in lists and multiple line support on text fields (value is 1&lt;&lt;1).
  	 /
  	gara.MULTI = 2;
  
  	/**
  	 * 
  	 * The <tt>MessageBox</tt> style constant for NO button; valid combinations are YES|NO; YES|NO|CANCEL (value is 1&lt;&lt;7).
  	 /
  	gara.NO = 128;
  
  	/**
  	 * 
  	 * Style constant for preventing child radio group behavior (value is 1&lt;&lt;22).
  	 * <p><b>Used By=</b><ul>
  	 * <li><code>Menu</code></li>
  	 * </ul></p>
  	 /
  	gara.NO_RADIO_GROUP = 4194304;
  
  	/**
  	 * 
  	 * Style constant to ensure no trimmings are used (value is 1&lt;&lt;3).
  	 * <br>Note that this overrides all other trim styles.
  	 * <p><b>Used By=</b><ul>
  	 * <li><code>Decorations</code> and subclasses</li>
  	 * </ul></p>
  	 /
  	gara.NO_TRIM = 8;
  
  	/**
  	 * A constant known to be zero (0; typically used in operations
  	 * which take bit flags to indicate that "no bits are set".
  	 /
  	gara.NONE = 0;
  
  	/**
  	 * 
  	 * The <tt>MessageBox</tt> style constant for an OK button; valid combinations are OK; OK|CANCEL (value is 1&lt;&lt;5).
  	 /
  	gara.OK = 32;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the PAGE DOWN key.
  	 /
  	gara.PAGE_DOWN = 34;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the PGAE UP key.
  	 /
  	gara.PAGE_UP = 33;
  
  	/**
  	 * 
  	 * Style constant for password behavior (value is 1<<22).
  	 /
  	gara.PASSWORD = 4194304;
  
  	/**
  	 * 
  	 * Style constant for pop up menu behavior (value is 1&lt;&lt;3).
  	 /
  	gara.POP_UP = 8;
  
  	/**
  	 * 
  	 * Style constant for push button behavior (value is 1&lt;&lt;3).
  	 /
  	gara.PUSH = 8;
  
  	/**
  	 * Style constant for radio button behavior (value is 1&lt;&lt;4).
  	 * <p><b>Used By=</b><ul>
  	 * <li><code>MenuItem</code></li>
  	 * </ul></p>
  	 /
  	gara.RADIO = 16;
  
  	/**
  	 * 
  	 * Style constant for read-only behavior (value is 1<<3).
  	 /
  	gara.READ_ONLY = 8;
  
  	/**
  	 * 
  	 * Style constant for resize box trim (value is 1&lt;&lt;4).
  	 * <p><b>Used By=</b><ul>
  	 * <li><code>Decorations</code> and subclasses</li>
  	 * </ul></p>
  	 /
  	gara.RESIZE = 16;
  
  	/**
  	 * 
  	 * The MessageBox style constant for a RETRY button; valid combinations are ABORT|RETRY|IGNORE; RETRY|CANCEL (value is 1&lt;&lt;10).
  	 /
  	gara.RETRY = 1024;
  
  	/**
  	 * 
  	 * Contains the scrollbar width (in px).
  	 /
  	gara.SCROLLBAR_HEIGHT = 0;
  	
  	/**
  	 * 
  	 * Contains the scrollbar width (in px).
  	 /
  	gara.SCROLLBAR_WIDTH = 0; 
  		
  	gara.addEventListener(document, "DOMContentLoaded", function () {
  		// width
  		var elem = document.createElement("div");
  		elem.style.width = "200px";
  		elem.style.height = "200px";
  		elem.style.position = "absolute";
  		elem.style.left = "-1000px";
  		elem.style.top = "-1000px";
  		document.getElementsByTagName("body")[0].appendChild(elem);
  
  		elem.style.overflow = "scroll";
  		gara.SCROLLBAR_WIDTH = elem.offsetWidth - elem.clientWidth;
  		document.getElementsByTagName("body")[0].removeChild(elem);
  		
  		// height
  		elem = document.createElement("div");
  		elem.style.width = "200px";
  		elem.style.height = "200px";
  		elem.style.position = "absolute";
  		elem.style.left = "-1000px";
  		elem.style.top = "-1000px";
  		document.getElementsByTagName("body")[0].appendChild(elem);
  
  		elem.style.overflow = "scroll";
  		gara.SCROLLBAR_HEIGHT = elem.offsetHeight - elem.clientHeight;
  		document.getElementsByTagName("body")[0].removeChild(elem);
  	}, false);
  
  	/**
  	 * 
  	 * Style constant for line separator behavior (value is 1&lt;&lt;1).
  	 /
  	gara.SEPARATOR = 2;
  
  	/**
  	 * 
  	 * Trim style convenience constant for the most common top level shell appearance
  	 * (value is CLOSE|TITLE|MIN|MAX|RESIZE|BORDER).
  	 * <p><b>Used By=</b><ul>
  	 * <li><code>Shell</code></li>
  	 * </ul></p>
  	 /
  	gara.SHELL_TRIM = 32 | 64 | 128 | 1024 | 16 | 2048;
  
  	/**
  	 * 
  	 * Style constant for single selection behavior in lists and single line support on text fields (value is 1&lt;&lt;2).
  	 /
  	gara.SINGLE = 4;
  
  	/**
  	 * 
  	 * Keyboard event constant representing the SPACE key.
  	 /
  	gara.SPACE = 32;
  
  	/**
  	 * 
  	 * Style constant for system modal behavior (value is 1&lt;&lt;17).
  	 /
  	gara.SYSTEM_MODAL = 131072;
  
  	/**
  	 * 
  	 * Style constant for title area trim (value is 1&lt;&lt;5).
  	 * <p><b>Used By=</b><ul>
  	 * <li><code>Decorations</code> and subclasses</li>
  	 * </ul></p>
  	 /
  	gara.TITLE = 32;
  
  	/**
  	 * 
  	 * Style constant for toolbar behavior (value is 1&lt;&lt;4). (gara only; not part of SWT)
  	 /
  	gara.TOOLBAR = 16;
  
  	/**
  	 * 
  	 * Style constant for align top behavior (value is 1&lt;&lt;7; since align UP and align TOP are considered the same).
  	 /
  	gara.TOP = 128;
  
  	/**
  	 * 
  	 * Style constant for align up behavior (value is 1&lt;&lt;7; since align UP and align TOP are considered the same).
  	 /
  	gara.UP = 128;
  
  	/**
  	 * 
  	 * Style constant for vertical alignment or orientation behavior (value is 1&lt;&lt;9).
  	 /
  	gara.VERTICAL = 512;
  
  	/**
  	 * 
  	 * The MessageBox style constant for YES button; valid combinations are YES|NO; YES|NO|CANCEL (value is 1&lt;&lt;6).
  	 /
  	gara.YES = 64;
  */

}).call(this);
