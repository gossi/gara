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
gara.provide("gara.jsface.window.Window");

gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.Display");
gara.use("gara.jswt.widgets.Shell");

/**
 * @class Window
 * @author Thomas Gossmann
 * @namespace gara.jsface.window
 */
gara.Class("gara.jsface.window.Window", {

	/**
	 * @field
	 * The window's shell
	 * 
	 * @private
	 * @type {gara.jswt.widgets.Shell}
	 */
	shell : null,
	
	/**
	 * @field
	 * The window's parent shell
	 * 
	 * @private
	 * @type {gara.jswt.widgets.Shell}
	 */
	parentShell : null,
	
	/**
	 * @field
	 * The window's contents
	 * 
	 * @private
	 * @type {gara.jswt.widgets.Control}
	 */
	contents : null,
	
	/**
	 * @field
	 * The window's windowmanager
	 * 
	 * @private
	 * @type {gara.jsface.window.WindowManager}
	 */
	windowManager : null,

	/**
	 * @constructor
	 */
	$constructor : function(parentShell) {
		if (typeof(parentShell) !== "undefined" && !(parentShell instanceof gara.jswt.widgets.Shell)) {
			throw new TypeError("parentShell not instance of gara.jswt.widgets.Shell");
		}
		this.parent = parentShell || gara.jswt.widgets.Display.getDefault();
		this.contents = null;
		this.shell = null;
		this.windowManager = null;
		this.callback = null;
		this.context = null;
		this.returnValue = null;
	},
	
	/**
	 * Determines if the window should handle the close event or do nothing.
	 * <p>
	 * The default implementation of this framework method returns
	 * <code>true</code>, which will allow the
	 * <code>handleShellCloseEvent</code> method to be called. Subclasses may
	 * extend or reimplement.
	 * </p>
	 * 
	 * @return {boolean} whether the window should handle the close event.
	 */
	canHandleShellCloseEvent : function () {
		return true;
	},
	
	/**
	 * Closes this window, disposes its shell, and removes this window from its
	 * window manager (if it has one).
	 * <p>
	 * Note that in order to prevent recursive calls to this method 
	 * it does not call <code>Shell.close()</code>. As a result <code>ShellListener</code>s 
	 * will not receive a <code>shellClosed</code> event.
	 * </p>
	 */
	close : function () {
		if (this.windowManager !== null) {
			this.windowManager.remove(this);
			this.windowManager = null;
		}
		
		if (this.shell !== null || !this.shell.isDisposed()) {
			this.shell.dispose();
			this.shell = null;
			this.contents = null;
		}
		
		if (this.callback !== null) {
			if (this.context !== null) {
				this.callback.call(this.context, this.getReturnValue());
			} else {
				this["callback"](this.getReturnValue());
			}
		}
	},
	
	configureShell : function (newShell) {
		var layout = this.getLayout();
		if (layout !== null) {
			newShell.setLayout(layout);
		}
	},

	/**
	 * @method
	 * Creates the windows shell and populates it with the default content.
	 * 
	 * @private
	 * @return {void}
	 */
	create : function() {
		this.shell = this.createShell();
		this.contents = this.createContents(this.shell);
		
		this.initializeBounds();
	},

	/**
	 * @method
	 * Creates and returns the contents of the window.
	 * 
	 * @param {gara.jswt.widgets.Composite} parent 
	 * 			the parent composite for the controls in this window. The type
	 * 			of layout used is determined by getLayout() 
	 * @returns {gara.jswt.widgets.Control}
	 */
	createContents : function (parent) {
		if (!(parent instanceof gara.jswt.widgets.Composite)) {
			throw new TypeError("parent not instance of gara.jswt.widgets.Composite");
		}

		return new gara.jswt.widgets.Composite(parent);
	},
	
	createShell : function () {
		var newShell;
		
		newShell = new gara.jswt.widgets.Shell(this.getParentShell(), this.getShellStyle());
		newShell.setData(this);
		this.configureShell(newShell);
		
		return newShell;
	},

	getInitialSize : function () {
		var parent = this.shell.getParent();
		var x = parent instanceof gara.jswt.widgets.Display ? document.documentElement.clientWidth : parent.getClientArea().clientWidth,
			y = parent instanceof gara.jswt.widgets.Display ? document.documentElement.clientHeight : parent.getClientArea().clientHeight;

		return {
			x: Math.floor(x / 2),
			y: Math.floor(y / 2)
		};
	},
	
	getInitialLocation : function (initialSize) {
		var parent = this.shell.getParent();
		var x = parent instanceof gara.jswt.widgets.Display ? document.documentElement.clientWidth : parent.getClientArea().clientWidth,
			y = parent instanceof gara.jswt.widgets.Display ? document.documentElement.clientHeight : parent.getClientArea().clientHeight;

		return {
			x: Math.floor(x / 4),
			y: Math.floor(y / 4)
		};
	},
	
	getLayout : function () {
		return null;
	},
	
	getParentShell : function () {
		return this.parent;
	},
	
	getReturnValue : function () {
		return this.returnValue;
	},
	
	getShell : function () {
		return this.shell;
	},
	
	/**
	 * Returns a shell listener. This shell listener gets registered with this
	 * window's shell.
	 * <p>
	 * The default implementation of this framework method returns a new
	 * listener that makes this window the active window for its window manager
	 * (if it has one) when the shell is activated, and calls the framework
	 * method <code>handleShellCloseEvent</code> when the shell is closed.
	 * Subclasses may extend or reimplement.
	 * </p>
	 * 
	 * @return a shell listener
	 */
	getShellListener : function () {
		var self = this;
		return  {
			shellClosed : function (e) {
				if (self.canHandleShellCloseEvent()) {
					self.handleShellCloseEvent();
				}
			}
		};
	},

	getShellStyle : function() {
		return 0;
	},
	
	getWindowManager : function () {
		return this.windowManager;
	},
	
	/**
	 * Notifies that the window's close button was pressed, the close menu was
	 * selected, or the ESCAPE key pressed.
	 * <p>
	 * The default implementation of this framework method sets the window's
	 * return code to <code>CANCEL</code> and closes the window using
	 * <code>close</code>. Subclasses may extend or reimplement.
	 * </p>
	 */
	handleShellCloseEvent : function () {
		this.setReturnValue(gara.jswt.JSWT.CANCEL);
		this.close();
	},

	initializeBounds : function () {
		var size = this.getInitialSize(),
			location = this.getInitialLocation(size);
		
		this.shell.setSize(size.x, size.y);
		if (location !== null) {
			this.shell.setLocation(location.x, location.y);
		}
	},

	open : function (callback, context) {
		if (this.shell == null || this.shell.isDisposed()) {
			this.shell = null;
			this.create();
		}
		this.callback = callback || this.callback;
		this.context = context || this.context;
		this.shell.open();
	},
	
	setReturnValue : function (value) {
		this.returnValue = value;
	},
	
	setWindowManager : function (manager) {
		var windows, i;
		if (!(manager instanceof gara.jsface.window.WindowManager)) {
			throw new TypeError("manager not instance of gara.jsface.window.WindowManager");
		}
		this.windowManager = manager;
		
		if (manager != null) {
			windows = manager.getWindows();
			for (i = 0; i < windows.length; i++) {
				if (windows[i] == this) {
					return;
				}
			}
			manager.add(this);
		}
	}
});