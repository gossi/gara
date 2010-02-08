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
gara.Class("gara.jswt.JSWT", {
	/**
	 * @field
	 * The <tt>MessageBox</tt> style constant for an ABORT button; the only valid combination is ABORT|RETRY|IGNORE (value is 1&lt;&lt;9).
	 */
	ABORT : gara.static(1 << 9),

	/**
	 * @field
	 * Keyboard event constant representing the DOWN ARROW key.
	 */
	ARROW_DOWN : gara.static(40),

	/**
	 * @field
	 * Keyboard event constant representing the LEFT ARROW key.
	 */
	ARROW_LEFT : gara.static(37),

	/**
	 * @field
	 * Keyboard event constant representing the RIGHT ARROW key.
	 */
	ARROW_RIGHT : gara.static(39),

	/**
	 * @field
	 * Keyboard event constant representing the UP ARROW key.
	 */
	ARROW_UP : gara.static(38),

	/**
	 * @field
	 * Style constant for application modal behavior (value is 1&lt;&lt;16).
	 */
	APPLICATION_MODAL : gara.static(1 << 16),

	/**
	 * @field
	 * Style constant for menu bar behavior (value is 1&lt;&lt;1).
	 */
	BAR : gara.static(1 << 1),

	/**
	 * @field
	 * Style constant for align bottom behavior (value is 1&lt;&lt;10, since align DOWN and align BOTTOM are considered the same).
	 */
	BOTTOM : gara.static(1 << 10),

	/**
	 * @field
	 * The <tt>MessageBox</tt> style constant for a CANCEL button, valid combinations are OK|CANCEL, YES|NO|CANCEL, RETRY|CANCEL (value is 1&lt;&lt;8).
	 */
	CANCEL : gara.static(1 << 8),

	/**
	 * @field
	 * Style constant for cascade behavior (value is 1&lt;&lt;6).
	 * <p><b>Used By:</b><ul>
	 * <li><code>MenuItem</code></li>
	 * </ul></p>
	 */
	CASCADE : gara.static(1 << 6),

	/**
	 * @field
	 * Style constant for check box behavior (value is 1&lt;&lt;5).
	 * <p><b>Used By:</b><ul>
	 * <li><code>MenuItem</code></li>
	 * <li><code>Table</code></li>
	 * <li><code>Tree</code></li>
	 * </ul></p>
	 */
	CHECK : gara.static(1 << 5),

	/**
	 * @field
	 * Style constant for close box trim (value is 1&lt;&lt;6, since we do not distinguish between CLOSE style and MENU style).
	 */
	CLOSE : gara.static(1 << 6),

	/**
	 * @field
	 * Indicates that a default should be used (value is 0).
	 *
	 * NOTE: In SWT, this value is -1, but that causes problems with bitwise JavaScript operators...
	 */
	DEFAULT : gara.static(0),

	/**
	 * @field
	 * Keyboard event constant representing the DEL key.
	 */
	DEL : gara.static(46),

	/**
	 * @field
	 * Style constant for align down behavior (value is 1&lt;&lt;10, since align DOWN and align BOTTOM are considered the same).
	 */
	DOWN : gara.static(1 << 10),

	/**
	 * @field
	 * Indicates that a user-interface component is being dragged, for example dragging the thumb of a scroll bar (value is 1).
	 */
	DRAG : gara.static(1),

	/**
	 * @field
	 * Style constant for drop down menu/list behavior (value is 1&lt;&lt;2).
	 */
	DROP_DOWN : gara.static(1 << 2),

	/**
	 * JSWT error constant indicating that a menu which needed
	 * to have the drop down style had some other style instead
	 * (value is 21).
	 */
	ERROR_MENU_NOT_DROP_DOWN : gara.static(21),

	/**
	 * JSWT error constant indicating that an attempt was made to
	 * invoke an JSWT operation using a widget which had already
	 * been disposed
	 * (value is 24).
	 */
	ERROR_WIDGET_DISPOSED : gara.static(24),

	/**
	 * JSWT error constant indicating that a menu item which needed
	 * to have the cascade style had some other style instead
	 * (value is 27).
	 */
	ERROR_MENUITEM_NOT_CASCADE : gara.static(27),

	/**
	 * @field
	 * Keyboard event constant representing the END key.
	 */
	END : gara.static(35),

	/**
	 * @field
	 * Keyboard event constant representing the ENTER key.
	 */
	ENTER : gara.static(13),

	/**
	 * @field
	 * Keyboard event constant representing the ESC key.
	 */
	ESC : gara.static(27),

	/**
	 * @field
	 * Keyboard event constant representing the HOME key.
	 */
	HOME : gara.static(36),

	/**
	 * @field
	 * Keyboard event constant representing the F1 key.
	 */
	F1 : gara.static(112),

	/**
	 * @field
	 * Keyboard event constant representing the F2 key.
	 */
	F2 : gara.static(113),

	/**
	 * @field
	 * Keyboard event constant representing the F3 key.
	 */
	F3 : gara.static(114),

	/**
	 * @field
	 * Keyboard event constant representing the F4 key.
	 */
	F4 : gara.static(115),

	/**
	 * @field
	 * Keyboard event constant representing the F5 key.
	 */
	F5 : gara.static(116),

	/**
	 * @field
	 * Keyboard event constant representing the F6 key.
	 */
	F6 : gara.static(117),

	/**
	 * @field
	 * Keyboard event constant representing the F7 key.
	 */
	F7 : gara.static(118),

	/**
	 * @field
	 * Keyboard event constant representing the F8 key.
	 */
	F8 : gara.static(119),

	/**
	 * @field
	 * Keyboard event constant representing the F9 key.
	 */
	F9 : gara.static(120),

	/**
	 * @field
	 * Keyboard event constant representing the F10 key.
	 */
	F10 : gara.static(121),

	/**
	 * @field
	 * Keyboard event constant representing the F11 key.
	 */
	F11 : gara.static(122),

	/**
	 * @field
	 * Keyboard event constant representing the F12 key.
	 */
	F12 : gara.static(123),

	/**
	 * @field
	 * Style constant for full row selection behavior (value is 1&lt;&lt;16).
	 */
	FULL_SELECTION : gara.static(1 << 16),

	/**
	 * @field
	 * The MessageBox style constant for error icon behavior (value is 1).
	 */
	ICON_ERROR : gara.static(1),

	/**
	 * @field
	 * The MessageBox style constant for information icon behavior (value is 1&lt;&lt;1).
	 */
	ICON_INFORMATION : gara.static(1 << 1),

	/**
	 * @field
	 * The MessageBox style constant for question icon behavior (value is 1&lt;&lt;2).
	 */
	ICON_QUESTION : gara.static(1 << 2),

	/**
	 * @field
	 * The MessageBox style constant for warning icon behavior (value is 1&lt;&lt;3).
	 */
	ICON_WARNING : gara.static(1 << 3),

	/**
	 * @field
	 * The MessageBox style constant for "working" icon behavior (value is 1&lt;&lt;4).
	 */
	ICON_WORKING : gara.static(1 << 4),

	/**
	 * @field
	 * The MessageBox style constant for an IGNORE button, the only valid combination is ABORT|RETRY|IGNORE (value is 1&lt;&lt;11).
	 */
	IGNORE : gara.static(1 << 11),

	/**
	 * @field
	 * Style constant for shell menu trim (value is 1&lt;&lt;6, since we do not distinguish between CLOSE style and MENU style).
	 */
	MENU : gara.static(1 << 6),

	/**
	 * @field
	 * Style constant for multi-selection behavior in lists and multiple line support on text fields (value is 1&lt;&lt;1).
	 */
	MULTI : gara.static(1 << 1),

	/**
	 * @field
	 * The <tt>MessageBox</tt> style constant for NO button, valid combinations are YES|NO, YES|NO|CANCEL (value is 1&lt;&lt;7).
	 */
	NO : gara.static(1 << 7),

	/**
	 * @field
	 * Style constant for preventing child radio group behavior (value is 1&lt;&lt;22).
	 * <p><b>Used By:</b><ul>
	 * <li><code>Menu</code></li>
	 * </ul></p>
	 */
	NO_RADIO_GROUP : gara.static(1 << 22),

	/**
	 * A constant known to be zero (0), typically used in operations
	 * which take bit flags to indicate that "no bits are set".
	 */
	NONE : gara.static(0),

	/**
	 * @field
	 * The <tt>MessageBox</tt> style constant for an OK button, valid combinations are OK, OK|CANCEL (value is 1&lt;&lt;5).
	 */
	OK : gara.static(1 << 5),

	/**
	 * @field
	 * Keyboard event constant representing the PAGE DOWN key.
	 */
	PAGE_DOWN : gara.static(34),

	/**
	 * @field
	 * Keyboard event constant representing the PGAE UP key.
	 */
	PAGE_UP : gara.static(33),

	/**
	 * @field
	 * Style constant for password behavior (value is 1<<22).
	 */
	PASSWORD : gara.static(1 << 22),

	/**
	 * @field
	 * Style constant for pop up menu behavior (value is 1&lt;&lt;3).
	 */
	POP_UP : gara.static(1 << 3),

	/**
	 * @field
	 * Style constant for push button behavior (value is 1&lt;&lt;3).
	 */
	PUSH : gara.static(1 << 3),

	/**
	 * Style constant for radio button behavior (value is 1&lt;&lt;4).
	 * <p><b>Used By:</b><ul>
	 * <li><code>MenuItem</code></li>
	 * </ul></p>
	 */
	RADIO : gara.static(1 << 4),

	/**
	 * @field
	 * Style constant for read-only behavior (value is 1<<3).
	 */
	READ_ONLY : gara.static(1 << 3),

	/**
	 * @field
	 * The MessageBox style constant for a RETRY button, valid combinations are ABORT|RETRY|IGNORE, RETRY|CANCEL (value is 1&lt;&lt;10).
	 */
	RETRY : gara.static(1 << 10),

	/**
	 * @field
	 * Style constant for line separator behavior (value is 1&lt;&lt;1).
	 */
	SEPARATOR : gara.static(1 << 1),

	/**
	 * @field
	 * Style constant for single selection behavior in lists and single line support on text fields (value is 1&lt;&lt;2).
	 */
	SINGLE : gara.static(1 << 2),

	/**
	 * @field
	 * Keyboard event constant representing the SPACE key.
	 */
	SPACE : gara.static(32),

	/**
	 * @field
	 * Style constant for system modal behavior (value is 1&lt;&lt;17).
	 */
	SYSTEM_MODAL : gara.static(1 << 17),

	/**
	 * @field
	 * Style constant for align top behavior (value is 1&lt;&lt;7, since align UP and align TOP are considered the same).
	 */
	TOP : gara.static(1 << 7),

	/**
	 * @field
	 * Style constant for align up behavior (value is 1&lt;&lt;7, since align UP and align TOP are considered the same).
	 */
	UP : gara.static(1 << 7),

	/**
	 * @field
	 * The MessageBox style constant for YES button, valid combinations are YES|NO, YES|NO|CANCEL (value is 1&lt;&lt;6).
	 */
	YES : gara.static(1 << 6),

	$constructor : function() {}
});