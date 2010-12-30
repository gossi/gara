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

gara.provide("gara.jswt.events.MouseTrackListener");

/**
 * Classes which implement this interface provide methods that deal with the events that are 
 * generated as the mouse pointer passes (or hovers) over controls.
 * 
 * @description
 * After creating an instance of a class that implements this interface it can be added to a 
 * control using the <code>addMouseTrackListener</code> method and removed using the 
 * <code>removeMouseTrackListener</code> method. When the mouse pointer passes into or out of 
 * the area of the screen covered by a control or pauses while over a control, the appropriate 
 * method will be invoked.
 *
 * @interface gara.events.MouseTrackListener
 * @name gara.events.MouseTrackListener
 * @class
 * 
 * TODO: Remove class in favor of interface
 */

gara.Class("gara.jswt.events.MouseTrackListener", /** @lends gara.events.MouseTrackListener# */ {

	/**
	 * Sent when the mouse pointer passes into the area of the screen covered by a control. 
	 *
	 * @param {Event} e an event containing information about the mouse enter
	 * @returns {void}
	 */
	mouseEnter : function (e) {},

	/**
	 * Sent when the mouse pointer passes out of the area of the screen covered by a control. 
	 *
	 * @param {Event} e an event containing information about the mouse exit
	 * @returns {void}
	 */
	mouseExit : function (e) {},

	/**
	 * Sent when the mouse pointer hovers over a control. 
	 *
	 * @param {Event} e an event containing information about the hover
	 * @returns {void}
	 */
	mouseHover : function (e) {}
});