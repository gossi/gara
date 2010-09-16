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
gara.provide("gara.jsface.window.ApplicationWindow", "gara.jsface.window.Window");

gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.Display");
gara.use("gara.jswt.widgets.Shell");
gara.use("gara.jsface.action.MenuManager");

/**
 * @class ApplicationWindow
 * @author Thomas Gossmann
 * @namespace gara.jsface.window
 */
gara.Class("gara.jsface.window.ApplicationWindow", function () { return {

	$extends : gara.jsface.window.Window,
	
	/**
	 * @field
	 * The application's menubar manager
	 * 
	 * @private
	 * @type {gara.jsface.action.MenuManager}
	 */
	menuBarManager : null,
	
	toolBarControl : null,
	
	/**
	 * @field
	 * The application's toolbar manager
	 * 
	 * @private
	 * @type {gara.jsface.action.MenuManager}
	 */
	toolBarManager : null,

	/**
	 * @constructor
	 */
	$constructor : function (parentShell) {
		this.$super(parentShell);
		this.menuBarManager = null;
		this.toolBarControl = null;
		this.toolBarManager = null;
		
		document.documentElement.setAttribute("role", "application");
	},
	
	addMenuBar : function () {
		if (this.getShell() === null && this.menuBarManager === null) {
			this.menuBarManager = this.createMenuManager();
		} 
	},	

	addToolBar : function () {
		if (this.getShell() === null && this.toolBarManager === null) {
			this.toolBarManager = this.createToolBarManager();
		} 
	},
	
	/**
	 * @method
	 * Creates the contents of the application. Subclasses should override this.
	 * 
	 * @param {gara.jswt.widgets.Shell} parent
	 * @return
	 */
	createAppContents : function (parent) {
		
	},
	
	/**
	 * @method
	 * Creates and returns the contents of the application window.
	 * 
	 * @param {gara.jswt.widgets.Composite} parent 
	 * 			the parent composite for the controls in this window. The type
	 * 			of layout used is determined by getLayout() 
	 * @returns {gara.jswt.widgets.Control}
	 */
	createContents : function (parent) {
		var composite;
		if (!(parent instanceof gara.jswt.widgets.Composite)) {
			throw new TypeError("parent not instance of gara.jswt.widgets.Composite");
		}
		
		if (this.menuBarManager !== null) {
        	this.shell.setMenuBar(this.menuBarManager.createMenuBar(parent));
            this.menuBarManager.update();
        }
		
		this.createToolBarControl(parent);
		this.createAppContents(parent);

		return parent;
	},
	
	createMenuManager : function () {
		return new gara.jsface.action.MenuManager();
	},

	createToolBarControl : function () {
		if (this.toolBarManager !== null) {
			this.toolBarControll = this.toolBarManager.createToolBar(parent);
		}
	},
	
	createToolBarManager : function () {
		return new gara.jsface.action.MenuManager();
	},

	getMenuBarManager : function () {
		return this.menuBarManager;
	},
	
	getToolBarManager : function () {
		return this.toolBarManager;
	}
};});