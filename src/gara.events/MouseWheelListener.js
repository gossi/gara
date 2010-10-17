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

gara.provide("gara.events.MouseWheelListener");

/**
 * @interface MouseListener
 * 
 * @summary
 * Classes which implement this interface provide a method that deals with the event that is 
 * generated as the mouse wheel is scrolled. 
 * 
 * @description
 * After creating an instance of a class that implements this interface it can be added to a 
 * control using the <code>addMouseWheelListener</code> method and removed using the 
 * <code>removeMouseWheelListener</code> method. When the mouse wheel is scrolled the 
 * mouseScrolled method will be invoked. 
 * 
 * @namespace gara.events
 */
gara.Class("gara.events.MouseWheelListener", {

	/**
	 * @method
	 * Sent when the mouse wheel is scrolled. 
	 *
	 * @author Thomas Gossmann
	 * @param {Event} e an event containing information about the mouse wheel action
	 * @return {void}
	 */
	mouseScrolled : function(e) {}
});