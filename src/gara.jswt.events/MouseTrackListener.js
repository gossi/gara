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

gara.provide("gara.jswt.events.MouseTrackListener");

/**
 * @interface MouseTrackListener
 * 
 * @summary
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
 * @namespace gara.jswt.events
 */

gara.Class("gara.jswt.events.MouseTrackListener", {

	/**
	 * @method
	 * Sent when the mouse pointer passes into the area of the screen covered by a control. 
	 *
	 * @param {Event} e an event containing information about the mouse enter
	 * @return {void}
	 */
	mouseEnter : function(e) {},

	/**
	 * @method
	 * Sent when the mouse pointer passes out of the area of the screen covered by a control. 
	 *
	 * @param {Event} e an event containing information about the mouse exit
	 * @return {void}
	 */
	mouseExit : function(e) {},

	/**
	 * @method
	 * Sent when the mouse pointer hovers over a control. 
	 *
	 * @param {Event} e an event containing information about the hover
	 * @return {void}
	 */
	mouseHover : function(e) {}
});