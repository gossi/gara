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
gara.provide("gara.jsface.window.WindowManager");

gara.use("gara.jsface.window.Window");

/**
 * @class WindowManager
 * @author Thomas Gossmann
 * @namespace gara.jsface.window
 */
gara.Class("gara.jsface.window.WindowManager", {

	/**
	 * @field
	 * The contained windows
	 * 
	 * @private
	 * @type {gara.jswt.widgets.Window[]}
	 */
	windows : null,
	
	/**
	 * @field
	 * All submanagers
	 * 
	 * @private
	 * @type {gara.jswt.widgets.WindowManager[]}
	 */
	subManagers : null,

	/**
	 * @constructor
	 */
	$constructor : function(parent) {
		if (parent) {
			if (!(parent instanceof gara.jsface.window.WindowManager)) {
				throw new TypeError("parent not instance of gara.jsface.window.WindowManager");
			}
			parent.addWindowManager(this);
		}
		this.windows = [];
		this.subManagers = null;
	},
	
	add : function (window) {
		if (!(window instanceof gara.jsface.window.Window)) {
			throw new TypeError("window not instance of gara.jsface.window.Window");
		}
		
		if (!this.windows.contains(window)) {
			this.windows[this.windows.length] = window;
			window.setWindowManager(this);
		}
	},
	
	addWindowManager : function (manager) {
		if (!(manager instanceof gara.jsface.window.WindowManager)) {
			throw new TypeError("parent not instance of gara.jsface.window.WindowManager");
		}
		
		if (this.subManagers === null) {
			this.subManagers = [];
		}
		
		if (!this.subManagers.contains(manager)) {
			this.subManagers[this.subManagers.length] = manager;
		}
	},
	
	close : function () {
		this.windows.forEach(function (window) {
			window.close();
		}, this);
		
		if (this.subManagers !== null) {
			this.subManagers.forEach(function (manager) {
				manager.close();
			}, this);	
		}
	},
	
	getWindows : function () {
		return this.windows;
	},
	
	getWindowCount : function () {
		return this.windows.length;
	},
	
	remove : function (window) {
		if (!(window instanceof gara.jsface.window.Window)) {
			throw new TypeError("window not instance of gara.jsface.window.Window");
		}

		if (this.windows.contains(window)) {
			this.windows.remove(window);
			window.setWindowManager(null);
		}
	}
});