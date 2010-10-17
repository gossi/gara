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

gara.provide("gara.events.ShellListener");

/**
 * @interface ShellListener
 * 
 * @summary
 * Classes which implement this interface provide methods that deal with changes in state of Shells.
 * 
 * @description
 * After creating an instance of a class that implements this interface it can be added to a shell 
 * using the <code>addShellListener</code> method and removed using the <code>removeShellListener</code>
 * method. When the state of the shell changes, the appropriate method will be invoked.
 *  
 * @author Thomas Gossmann
 * @namespace gara.events
 */

gara.Class("gara.events.ShellListener", {

	/**
	 * @method shellActivated
	 * Sent when a shell becomes the active window. 
	 * 
	 * @param e {Event} an event containing information about the activation
	 * @returns {boolean} Indicating whether this operation should be allowed
	 */
	shellActivated : function (e) {},
	
	/**
	 * @method shellClosed
	 * Sent when a shell is closed.
	 * 
	 * @param e {Event} an event containing information about the activation
	 * @returns {boolean} Indicating whether this operation should be allowed
	 */
	shellClosed : function (e) {},
	
	/**
	 * @method shellDeactivated
	 * Sent when a shell stops being the active window.
	 * 
	 * @param e {Event} an event containing information about the activation
	 * @returns {boolean} Indicating whether this operation should be allowed
	 */
	shellDeactivated : function (e) {},
	
	/**
	 * @method shellDeiconified
	 * Sent when a shell is un-minimized.
	 * 
	 * @param e {Event} an event containing information about the activation
	 * @returns {boolean} Indicating whether this operation should be allowed
	 */
	shellDeiconified : function (e) {},
	
	/**
	 * @method shellIconified
	 * Sent when a shell is minimized.
	 * 
	 * @param e {Event} an event containing information about the activation
	 * @returns {boolean} Indicating whether this operation should be allowed
	 */
	shellIconified : function (e) {}
});