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
gara.provide("gara.window.ApplicationWindow", "gara.window.Window");

gara.use("gara.widgets.Display");
gara.use("gara.widgets.Shell");
gara.use("gara.action.MenuManager");

/**
 * @class ApplicationWindow
 * @author Thomas Gossmann
 * @namespace gara.window
 */
gara.Class("gara.window.ApplicationWindow", function () { return {

	$extends : gara.window.Window,
	
	actions : null,
	
	showMenuBar : false,
	
	/**
	 * @field
	 * The application's menubar manager
	 * 
	 * @private
	 * @type {gara.action.MenuManager}
	 */
	menuBarManager : null,
	
	showToolBar : false,
	
	toolBarControl : null,
	
	/**
	 * @field
	 * The application's toolbar manager
	 * 
	 * @private
	 * @type {gara.action.MenuManager}
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
		
		this.showMenuBar = false;
		this.showToolBar = false;
		
		this.actions = {};
	},
	
	close : function () {
		this.preWindowShellClose();
		if (this.menuBarManager !== null) {
            this.menuBarManager.dispose();
            this.menuBarManager = null;
        }
        if (this.toolBarManager !== null) {
        	this.toolBarManager.dispose();
            this.toolBarManager = null;
        }
//        if (this.statusLineManager !== null) {
//            this.statusLineManager.dispose();
//            this.statusLineManager = null;
//        }
        this.$super();
        this.postWindowClose();
	},

	/**
	 * @method
	 * Creates and returns the contents of the application window.
	 * 
	 * @param {gara.widgets.Composite} parent 
	 * 			the parent composite for the controls in this window. The type
	 * 			of layout used is determined by getLayout() 
	 * @returns {gara.widgets.Control}
	 */
	createContents : function (parent) {
		var composite;
		if (!(parent instanceof gara.widgets.Composite)) {
			throw new TypeError("parent not instance of gara.widgets.Composite");
		}
		
		if (this.showMenuBar) {
			this.menuBarManager = this.createMenuManager();
		}
		
		if (this.showToolBar) {
			this.toolBarManager = this.createToolBarManager();
		}
		
		this.fillActionBars();
		
		if (this.menuBarManager !== null) {
        	this.shell.setMenuBar(this.menuBarManager.createMenuBar(parent));
            this.menuBarManager.update();
        }
		
				
		this.createToolBarControl(parent);
		
		
		composite = this.createPageComposite(parent);
		this.createWindowContents(composite);

		return composite;
	},
	
	createMenuManager : function () {
		return new gara.action.MenuManager();
	},
	
	createPageComposite : function (parent) {
		return new gara.widgets.Composite(parent);
	},

	createToolBarControl : function (parent) {
		if (this.toolBarManager !== null) {
			this.toolBarControl = this.toolBarManager.createToolBar(parent);
		}
	},
	
	createToolBarManager : function () {
		return new gara.action.MenuManager();
	},
	
	/**
	 * @method
	 * Creates the contents of the application. Subclasses should override this.
	 * 
	 * @param {gara.widgets.Shell} parent
	 * @return
	 */
	createWindowContents : function (parent) {
		
	},
	
	fillActionBars : function () {
		this.makeActions();

		if (this.showMenuBar) {
			this.fillMenuBar(this.menuBarManager);
		}
		
		if (this.showToolBar) {
			this.fillToolBar(this.toolBarManager);
		}
	},
	
	fillMenuBar : function (menuManager) {
		
	},
	
	fillToolBar : function (toolBarManager) {
		
	},
	
	/**
	 * Returns the action with the given id, or <code>null</code> if not found.
	 * 
	 * @param {String} id the action id
	 * @return the action with the given id, or <code>null</code> if not found
	 */
	getAction : function (id) {
		if (Object.prototype.hasOwnProperty.call(this.actions, id)) {
			return this.actions[id];
		}
		return null;
	},

	getMenuBarManager : function () {
		return this.menuBarManager;
	},
	
	getShellStyle : function () {
		return gara.BORDER;
	},
	
	getToolBarManager : function () {
		return this.toolBarManager;
	},
	
	makeActions : function () {
		
	},
	
	open : function (callback, context) {
		this.preWindowOpen();
		if (this.shell == null || this.shell.isDisposed()) {
			this.shell = null;
			this.create();
			this.postWindowCreate();
		}
		this.callback = callback || this.callback;
		this.context = context || this.context;
		this.shell.open();
		this.shell.layout();
		this.postWindowOpen();
	},
	
	preWindowOpen : function () {
		
	},
	
	preWindowShellClose : function () {
		
	},
	
	postWindowClose : function () {
		
	},
	
	postWindowCreate : function () {
		
	},
	
	postWindowOpen : function () {
		
	},
	
	register : function (action) {
		if (!action.getId) {
			throw new TypeError("action is not implementing IAction, getId is missing");
		}
		var id = action.getId();
		if (id === null) {
			throw new Error("action.getId must not null");
		}
		this.actions[id] = action;
	},
	
	setShowMenuBar : function (show) {
		this.showMenuBar = show;
	},
	
	setShowToolBar : function (show) {
		this.showToolBar = show;
	}
};});