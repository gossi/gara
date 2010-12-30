/*

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://garathekit.org

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

"use strict";

gara.provide("gara.events.KeyListener");

/**
 * @interface gara.events.KeyListener
 * @name gara.events.KeyListener
 * @class
 * 
 * TODO: Remove class in favor of interface
 */

gara.Class("gara.events.KeyListener", /** @lends gara.events.KeyListener# */ {

	/**
	 * Sent when a key is pressed on the system keyboard.
	 * Notice: This is triggered on an "keydown" event.
	 *
	 * @param {Event} e an event containing information about the key press
	 */
	keyPressed : function (e) {},

	/**
	 * Sent when a key is released on the system keyboard.
	 *
	 * @param {Event} e an event containing information about the key release
	 */
	keyReleased : function (e) {}
});