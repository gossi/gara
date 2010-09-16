/*	$Id $

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://gara.creative2.net

		This library is free software;  you  can  redistribute  it  and/or
		modify  it  under  the  terms  of  the   GNU Lesser General Public
		License  as  published  by  the  Free Software Foundation;  either
		version 2.1 of the License, or (at your option) any later version.

		This library is distributed in  the hope  that it  will be useful,
		but WITHOUT ANY WARRANTY; without  even  the  implied  warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
		Lesser General Public License for more details.

	===========================================================================
*/

gara.provide("gara.jswt.JSWT");

/**
 * JSWT class with design constants
 *
 * @class JSWT
 * @author Thomas Gossmann
 * @namespace gara.jswt
 */
gara.Singleton("gara.jswt.JSWT", {
	/**
	 * @field
	 * The <tt>MessageBox</tt> style constant for an ABORT button; the only valid combination is ABORT|RETRY|IGNORE (value is 1&lt;&lt;9).
	 */
	ABORT : 512,

	/**
	 * @field
	 * Keyboard event constant representing the DOWN ARROW key.
	 */
	ARROW_DOWN : 40,

	/**
	 * @field
	 * Keyboard event constant representing the LEFT ARROW key.
	 */
	ARROW_LEFT : 37,

	/**
	 * @field
	 * Keyboard event constant representing the RIGHT ARROW key.
	 */
	ARROW_RIGHT : 39,

	/**
	 * @field
	 * Keyboard event constant representing the UP ARROW key.
	 */
	ARROW_UP : 38,

	/**
	 * @field
	 * Style constant for application modal behavior (value is 1&lt;&lt;16).
	 */
	APPLICATION_MODAL : 65536,

	/**
	 * @field
	 * Style constant for menu bar behavior (value is 1&lt;&lt;1).
	 */
	BAR : 2,

	/**
	 * @field
	 * Style constant for bordered behavior (value is 1&lt;&lt;11).
	 * <p><b>Used By:</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * </ul></p>
	 */
	BORDER : 2048,

	/**
	 * @field
	 * Style constant for align bottom behavior (value is 1&lt;&lt;10, since align DOWN and align BOTTOM are considered the same).
	 */
	BOTTOM : 1024,

	/**
	 * @field
	 * The <tt>MessageBox</tt> style constant for a CANCEL button, valid combinations are OK|CANCEL, YES|NO|CANCEL, RETRY|CANCEL (value is 1&lt;&lt;8).
	 */
	CANCEL : 256,

	/**
	 * @field
	 * Style constant for cascade behavior (value is 1&lt;&lt;6).
	 * <p><b>Used By:</b><ul>
	 * <li><code>MenuItem</code></li>
	 * </ul></p>
	 */
	CASCADE : 64,

	/**
	 * @field
	 * Style constant for check box behavior (value is 1&lt;&lt;5).
	 * <p><b>Used By:</b><ul>
	 * <li><code>MenuItem</code></li>
	 * <li><code>Table</code></li>
	 * <li><code>Tree</code></li>
	 * </ul></p>
	 */
	CHECK : 32,

	/**
	 * Style constant for close box trim (value is 1&lt;&lt;6,
	 * since we do not distinguish between CLOSE style and MENU style).
	 * <p><b>Used By:</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * <li><code>TabFolder</code></li>
	 * </ul></p>
	 */
	CLOSE : 64,

	/**
	 * @field
	 * Indicates that a default should be used (value is 0).
	 *
	 * NOTE: In SWT, this value is -1, but that causes problems with bitwise JavaScript operators...
	 */
	DEFAULT : 0,

	/**
	 * @field
	 * Keyboard event constant representing the DEL key.
	 */
	DEL : 46,

	/**
	 * @field
	 * Trim style convenience constant for the most common dialog shell appearance
	 * (value is CLOSE|TITLE|BORDER).
	 * <p><b>Used By:</b><ul>
	 * <li><code>Shell</code></li>
	 * </ul></p>
	 */
	DIALOG_TRIM : 32 | 64 | 2048,

	/**
	 * @field
	 * Style constant for align down behavior (value is 1&lt;&lt;10, since align DOWN and align BOTTOM are considered the same).
	 */
	DOWN : 1024,

	/**
	 * @field
	 * Indicates that a user-interface component is being dragged, for example dragging the thumb of a scroll bar (value is 1).
	 */
	DRAG : 1,

	/**
	 * @field
	 * Style constant for drop down menu/list behavior (value is 1&lt;&lt;2).
	 */
	DROP_DOWN : 4,

	/**
	 * JSWT error constant indicating that a menu which needed
	 * to have the drop down style had some other style instead
	 * (value is 21).
	 */
	ERROR_MENU_NOT_DROP_DOWN : 21,

	/**
	 * JSWT error constant indicating that an attempt was made to
	 * invoke an JSWT operation using a widget which had already
	 * been disposed
	 * (value is 24).
	 */
	ERROR_WIDGET_DISPOSED : 24,

	/**
	 * JSWT error constant indicating that a menu item which needed
	 * to have the cascade style had some other style instead
	 * (value is 27).
	 */
	ERROR_MENUITEM_NOT_CASCADE : 27,

	/**
	 * @field
	 * Keyboard event constant representing the END key.
	 */
	END : 35,

	/**
	 * @field
	 * Keyboard event constant representing the ENTER key.
	 */
	ENTER : 13,

	/**
	 * @field
	 * Keyboard event constant representing the ESC key.
	 */
	ESC : 27,

	/**
	 * @field
	 * Keyboard event constant representing the HOME key.
	 */
	HOME : 36,

	/**
	 * @field
	 * Style constant for horizontal alignment or orientation behavior (value is 1&lt;&lt;8).
	 */
	HORIZONTAL : 256,

	/**
	 * @field
	 * Keyboard event constant representing the F1 key.
	 */
	F1 : 112,

	/**
	 * @field
	 * Keyboard event constant representing the F2 key.
	 */
	F2 : 113,

	/**
	 * @field
	 * Keyboard event constant representing the F3 key.
	 */
	F3 : 114,

	/**
	 * @field
	 * Keyboard event constant representing the F4 key.
	 */
	F4 : 115,

	/**
	 * @field
	 * Keyboard event constant representing the F5 key.
	 */
	F5 : 116,

	/**
	 * @field
	 * Keyboard event constant representing the F6 key.
	 */
	F6 : 117,

	/**
	 * @field
	 * Keyboard event constant representing the F7 key.
	 */
	F7 : 118,

	/**
	 * @field
	 * Keyboard event constant representing the F8 key.
	 */
	F8 : 119,

	/**
	 * @field
	 * Keyboard event constant representing the F9 key.
	 */
	F9 : 120,

	/**
	 * @field
	 * Keyboard event constant representing the F10 key.
	 */
	F10 : 121,

	/**
	 * @field
	 * Keyboard event constant representing the F11 key.
	 */
	F11 : 122,

	/**
	 * @field
	 * Keyboard event constant representing the F12 key.
	 */
	F12 : 123,

	/**
	 * @field
	 * Style constant for full row selection behavior (value is 1&lt;&lt;16).
	 */
	FULL_SELECTION : 65536,

	/**
	 * @field
	 * The MessageBox style constant for error icon behavior (value is 1).
	 */
	ICON_ERROR : 1,

	/**
	 * @field
	 * The MessageBox style constant for information icon behavior (value is 1&lt;&lt;1).
	 */
	ICON_INFORMATION : 2,

	/**
	 * @field
	 * The MessageBox style constant for question icon behavior (value is 1&lt;&lt;2).
	 */
	ICON_QUESTION : 4,

	/**
	 * @field
	 * The MessageBox style constant for warning icon behavior (value is 1&lt;&lt;3).
	 */
	ICON_WARNING : 8,

	/**
	 * @field
	 * The MessageBox style constant for "working" icon behavior (value is 1&lt;&lt;4).
	 */
	ICON_WORKING : 16,

	/**
	 * @field
	 * The MessageBox style constant for an IGNORE button, the only valid combination is ABORT|RETRY|IGNORE (value is 1&lt;&lt;11).
	 */
	IGNORE : 2048,
	
	/**
	 * @field
	 * The Layout style for a Loosy layout. (value is 1)
	 */
	LAYOUT_LOOSY : 1,

	/**
	 * @field
	 * Style constant for maximize box trim (value is 1&lt;&lt;10).
	 * <p><b>Used By:</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * </ul></p>
	 */
	MAX : 1024,

	/**
	 * @field
	 * Style constant for minimize box trim (value is 1&lt;&lt;7).
	 * <p><b>Used By:</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * </ul></p>
	 */
	MIN : 128,

	/**
	 * @field
	 * Style constant for multi-selection behavior in lists and multiple line support on text fields (value is 1&lt;&lt;1).
	 */
	MULTI : 2,

	/**
	 * @field
	 * The <tt>MessageBox</tt> style constant for NO button, valid combinations are YES|NO, YES|NO|CANCEL (value is 1&lt;&lt;7).
	 */
	NO : 128,

	/**
	 * @field
	 * Style constant for preventing child radio group behavior (value is 1&lt;&lt;22).
	 * <p><b>Used By:</b><ul>
	 * <li><code>Menu</code></li>
	 * </ul></p>
	 */
	NO_RADIO_GROUP : 4194304,

	/**
	 * @field
	 * Style constant to ensure no trimmings are used (value is 1&lt;&lt;3).
	 * <br>Note that this overrides all other trim styles.
	 * <p><b>Used By:</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * </ul></p>
	 */
	NO_TRIM : 8,

	/**
	 * A constant known to be zero (0, typically used in operations
	 * which take bit flags to indicate that "no bits are set".
	 */
	NONE : 0,

	/**
	 * @field
	 * The <tt>MessageBox</tt> style constant for an OK button, valid combinations are OK, OK|CANCEL (value is 1&lt;&lt;5).
	 */
	OK : 32,

	/**
	 * @field
	 * Keyboard event constant representing the PAGE DOWN key.
	 */
	PAGE_DOWN : 34,

	/**
	 * @field
	 * Keyboard event constant representing the PGAE UP key.
	 */
	PAGE_UP : 33,

	/**
	 * @field
	 * Style constant for password behavior (value is 1<<22).
	 */
	PASSWORD : 4194304,

	/**
	 * @field
	 * Style constant for pop up menu behavior (value is 1&lt;&lt;3).
	 */
	POP_UP : 8,

	/**
	 * @field
	 * Style constant for push button behavior (value is 1&lt;&lt;3).
	 */
	PUSH : 8,

	/**
	 * Style constant for radio button behavior (value is 1&lt;&lt;4).
	 * <p><b>Used By:</b><ul>
	 * <li><code>MenuItem</code></li>
	 * </ul></p>
	 */
	RADIO : 16,

	/**
	 * @field
	 * Style constant for read-only behavior (value is 1<<3).
	 */
	READ_ONLY : 8,

	/**
	 * @field
	 * Style constant for resize box trim (value is 1&lt;&lt;4).
	 * <p><b>Used By:</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * </ul></p>
	 */
	RESIZE : 16,

	/**
	 * @field
	 * The MessageBox style constant for a RETRY button, valid combinations are ABORT|RETRY|IGNORE, RETRY|CANCEL (value is 1&lt;&lt;10).
	 */
	RETRY : 1024,

	/**
	 * @field
	 * Contains the scrollbar width (in px).
	 */
	SCROLLBAR_HEIGHT : (function () {
		var elem = document.createElement("div");
		elem.style.width = "200px";
		elem.style.height = "200px";
		elem.style.position = "absolute";
		elem.style.left = "-1000px";
		elem.style.top = "-1000px";
		document.getElementsByTagName("body")[0].appendChild(elem);

		elem.style.overflow = "scroll";
		var width = elem.offsetHeight - elem.clientHeight;
		document.getElementsByTagName("body")[0].removeChild(elem);
		return width;
	})(),
	
	/**
	 * @field
	 * Contains the scrollbar width (in px).
	 */
	SCROLLBAR_WIDTH : (function () {
		var elem = document.createElement("div");
		elem.style.width = "200px";
		elem.style.height = "200px";
		elem.style.position = "absolute";
		elem.style.left = "-1000px";
		elem.style.top = "-1000px";
		document.getElementsByTagName("body")[0].appendChild(elem);

		elem.style.overflow = "scroll";
		var width = elem.offsetWidth - elem.clientWidth;
		document.getElementsByTagName("body")[0].removeChild(elem);
		return width;
	})(),

	/**
	 * @field
	 * Style constant for line separator behavior (value is 1&lt;&lt;1).
	 */
	SEPARATOR : 2,

	/**
	 * @field
	 * Trim style convenience constant for the most common top level shell appearance
	 * (value is CLOSE|TITLE|MIN|MAX|RESIZE|BORDER).
	 * <p><b>Used By:</b><ul>
	 * <li><code>Shell</code></li>
	 * </ul></p>
	 */
	SHELL_TRIM : 32 | 64 | 128 | 1024 | 16 | 2048,

	/**
	 * @field
	 * Style constant for single selection behavior in lists and single line support on text fields (value is 1&lt;&lt;2).
	 */
	SINGLE : 4,

	/**
	 * @field
	 * Keyboard event constant representing the SPACE key.
	 */
	SPACE : 32,

	/**
	 * @field
	 * Style constant for system modal behavior (value is 1&lt;&lt;17).
	 */
	SYSTEM_MODAL : 131072,

	/**
	 * @field
	 * Style constant for title area trim (value is 1&lt;&lt;5).
	 * <p><b>Used By:</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * </ul></p>
	 */
	TITLE : 32,

	/**
	 * @field
	 * Style constant for toolbar behavior (value is 1&lt;&lt;4). (gara only, not part of SWT)
	 */
	TOOLBAR : 16,

	/**
	 * @field
	 * Style constant for align top behavior (value is 1&lt;&lt;7, since align UP and align TOP are considered the same).
	 */
	TOP : 128,

	/**
	 * @field
	 * Style constant for align up behavior (value is 1&lt;&lt;7, since align UP and align TOP are considered the same).
	 */
	UP : 128,

	/**
	 * @field
	 * Style constant for vertical alignment or orientation behavior (value is 1&lt;&lt;9).
	 */
	VERTICAL : 512,

	/**
	 * @field
	 * The MessageBox style constant for YES button, valid combinations are YES|NO, YES|NO|CANCEL (value is 1&lt;&lt;6).
	 */
	YES : 64
});