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

gara.provide("gara.events.KeyListener");

/**
 * @interface KeyListener
 * @author Thomas Gossmann
 * @namespace gara.events
 */

gara.Class("gara.events.KeyListener", {

	/**
	 * @method
	 * Sent when a key is pressed on the system keyboard.
	 * Notice: This is triggered on an "keydown" event.
	 *
	 * @author Thomas Gossmann
	 * @param {Event} e an event containing information about the key press
	 */
	keyPressed : function(e) {},

	/**
	 * @method
	 * Sent when a key is released on the system keyboard.
	 *
	 * @author Thomas Gossmann
	 * @param {Event} e an event containing information about the key release
	 */
	keyReleased : function(e) {}
});