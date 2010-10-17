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
gara.provide("gara.window.Application", "gara.window.ApplicationWindow");

/**
 * @class Window
 * @author Thomas Gossmann
 * @namespace gara.window
 */
gara.Class("gara.window.Application", function () { return {

	$extends : gara.window.ApplicationWindow,
	
	/**
	 * @constructor
	 */
	$constructor : function (parentShell) {
		this.$super(parentShell);
	},

	configureShell : function (newShell) {
		newShell.setFullScreen(true);
	},
	
	getInitialSize : function () {
		return {x:null,y:null};
	},
	
	getInitialLocation : function () {
		return {x:0,y:0};
	},
	
	open : function (callback, context) {
		this.$super(callback, context);
		console.log("App.open");
		this.shell.layout();
	}
};});