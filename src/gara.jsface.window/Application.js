/*	$Id: Dialog.class.js 182 2009-08-02 22:34:06Z tgossmann $

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
gara.provide("gara.jsface.window.Application", "gara.jsface.window.ApplicationWindow");

/**
 * @class Window
 * @author Thomas Gossmann
 * @namespace gara.jsface.window
 */
gara.Class("gara.jsface.window.Application", function () { return {

	$extends : gara.jsface.window.ApplicationWindow,
	
	/**
	 * @constructor
	 */
	$constructor : function (parentShell) {
		this.$super(parentShell);
	},

	configureShell : function (newShell) {
		newShell.setFullScreen(true);
	}
}});