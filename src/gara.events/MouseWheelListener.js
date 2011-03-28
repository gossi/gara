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

gara.provide("gara.events.MouseWheelListener");

/**
 * Classes which implement this interface provide a method that deals with the event that is 
 * generated as the mouse wheel is scrolled. 
 * 
 * @description
 * After creating an instance of a class that implements this interface it can be added to a 
 * control using the <code>addMouseWheelListener</code> method and removed using the 
 * <code>removeMouseWheelListener</code> method. When the mouse wheel is scrolled the 
 * mouseScrolled method will be invoked. 
 * 
 * @interface gara.events.MouseWheelListener
 * @name gara.events.MouseWheelListener
 * @class
 * 
 * TODO: Remove class in favor of interface
 */
gara.Class("gara.events.MouseWheelListener", /** @lends gara.events.MouseWheelListener# */ {

	/**
	 * Sent when the mouse wheel is scrolled. 
	 *
	 * @param {Event} e an event containing information about the mouse wheel action
	 * @returns {void}
	 */
	mouseScrolled : function (e) {}
});