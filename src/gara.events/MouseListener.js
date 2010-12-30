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

gara.provide("gara.events.MouseListener");

/**
 * Classes which implement this interface provide methods that deal with the events that are 
 * generated as mouse buttons are pressed. 
 * 
 * @description
 * After creating an instance of a class that implements this interface it can be added to a 
 * control using the <code>addMouseListener</code> method and removed using the 
 * <code>removeMouseListener</code> method. When a mouse button is pressed or released, the 
 * appropriate method will be invoked. 
 * 
 * @interface gara.events.MouseListener
 * @name gara.events.MouseListener
 * @class
 * 
 * TODO: Remove class in favor of interface
 */

gara.Class("gara.events.MouseListener", /** @lends gara.events.MouseListener# */ {

	/**
	 * Sent when a mouse button is pressed twice within the (operating system
	 * specified) double click period.
	 *
	 * @param {Event} e an event containing information about the mouse double click
	 * @returns {void}
	 */
	mouseDoubleClick : function (e) {},

	/**
	 * Sent when a mouse button is pressed.
	 *
	 * @param {Event} e an event containing information about the mouse button press
	 * @returns {void}
	 */
	mouseDown : function (e) {},

	/**
	 * Sent when a mouse button is released.
	 *
	 * @param {Event} e an event containing information about the mouse button release
	 * @returns {void}
	 */
	mouseUp : function (e) {}
});