/*	$Id: FocusListener.interface.js 91 2007-12-09 18:58:43Z tgossmann $

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

/**
 * @interface MouseListener
 * @author Thomas Gossmann
 * @namespace gara.jswt.events
 */

$interface("MouseListener", {

	/**
	 * @method
	 * Sent when a mouse button is pressed twice within the (operating system
	 * specified) double click period.
	 *
	 * @author Thomas Gossmann
	 * @param {Event} e an event containing information about the mouse double click
	 * @return {void}
	 */
	mouseDoubleClick : function(e) {},

	/**
	 * @method
	 * Sent when a mouse button is pressed.
	 *
	 * @author Thomas Gossmann
	 * @param {Event} e an event containing information about the mouse button press
	 * @return {void}
	 */
	mouseDown : function(e) {},

	/**
	 * @method
	 * Sent when a mouse button is released.
	 *
	 * @author Thomas Gossmann
	 * @param {Event} e an event containing information about the mouse button release
	 * @return {void}
	 */
	mouseUp : function(e) {},

	toString : function() {
		return "[gara.jswt.events.MouseListener]";
	}
});