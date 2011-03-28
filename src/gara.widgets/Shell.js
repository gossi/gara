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

gara.provide("gara.widgets.Shell", "gara.widgets.Decorations");

gara.use("gara.widgets.Display");

/**
 * @class gara.widgets.Shell
 * @extends gara.widgets.Decorations
 */
gara.Class("gara.widgets.Shell", function() { return /** @lends gara.widgets.Shell# */ {
	$extends : gara.widgets.Decorations,

	/**
	 * Contains the alpha value of this shell
	 * 
	 * @private
	 * @type {int} 
	 */
	alpha : 100,
	
	/**
	 * Contains the shell listeners
	 * 
	 * @private
	 * @type {gara.events.ShellListener[]}
	 */
	shellListeners : null,
	
	/**
	 * @constructs
	 * @extends gara.widgets.Decorations
	 * @param {gara.widgets.Shell|gara.widgets.Display} parent the parent container for the new shell (optinal)
	 * @param {void} style the style for the new shell (optional)
	 */
	$constructor : function (parent, style) {
		if (!(parent instanceof gara.widgets.Shell) && !(parent instanceof gara.widgets.Display)) {
			style = parent | gara.SHELL_TRIM;
			parent = gara.widgets.Display.getDefault();
		} else {
			style |= gara.DIALOG_TRIM;
		}

		var self = this;
		this.enabled = false;
		this.maximized = false;
		this.minimized = false;
		this.fullScreen = false;
		this.shellListeners = [];
		this.alpha = 100;
		this.resizeListener = {
			handleEvent : function () {
//				window.setTimeout(function() {
					self.adjustWidth(document.documentElement.clientWidth);
					self.adjustHeight(document.documentElement.clientHeight);
					self.layout();
//				}, 100);
			}	
		};
//		this.tabIndexes = [];
//		this.tabIndexElements = [];
//		this.tabbableTags = ["A","BUTTON","TEXTAREA","INPUT","IFRAME","DIV","UL","SPAN"];

		this.$super(parent, gara.widgets.Shell.checkStyle(style));
	},
	
	/**
	 * Adds the listener to the collection of listeners who will be notified when operations are 
	 * performed on the receiver, by sending the listener one of the messages defined in the 
	 * <code>ShellListener</code> interface.
	 * 
	 * @param listener {gara.events.ShellListener} the listener which should be notified
	 * @returns {gara.widgets.Shell} this 
	 */
	addShellListener : function (listener) {
		if (!this.shellListeners.contains(listener)) {
			this.shellListeners.add(listener);
		}
		
		return this;
	},
	
	/*
	 * jsdoc in gara.widgets.Control
	 */
	adjustHeight : function (height) {
		if (this.fullScreen) {
			this.restoreHeight = height;
			return;
		}
		
		this.$super(height);
	},

	/*
	 * jsdoc in gara.widgets.Control
	 */
	adjustWidth : function (width) {
		if (this.fullScreen) {
			this.restoreWidth = width;
			return;
		}
		this.$super(width);
	},

	/**
	 * Checks the consistency of the shell's style.
	 * 
	 * @static
	 * @function
	 * @param {int} style the style
	 * @returns {int} the consistent style
	 */
	checkStyle : gara.$static(function (style) {
		style = gara.widgets.Decorations.checkStyle(style);

		return style;
	}),
	
	/**
	 * Closes the shell.
	 * 
	 * @returns {void}
	 */
	close : function () {
		if (this.notifyShellListener("shellClosed")) {
			this.handle.blur();
			this.setVisible(false);
			this.getDisplay().setActiveShell(null);
		}
	},

	/**
	 * Creates the HTML.
	 * @private
	 */
	createWidget : function () {
		this.$super();
		this.addClass("garaShell");

		this.positionOffsetX = 0;
		this.positionOffsetY = 0;
		this.x = this.y = null;

		this.setVisible(false);
		
		if ((this.style & gara.TITLE) !== 0) {
			this.handle.setAttribute("role", "dialog");
		}

//		this.addListener("keydown", this);
		gara.addEventListener(document, "keydown", this);

		if (this.stub) {
			this.handle.parentNode.removeChild(this.stub);
			delete this.stub;
			this.stub = null;
		}
	},
	
	/**
	 * Destroys the shell.
	 * 
	 * @private
	 * @returns {void}
	 */
	destroyWidget : function () {
		this.shellListeners = [];
		
		this.$super();
	},

//	/**
//	 * Focus the shell and disables tab indexes
//	 *
//	 * Code below taken from subModal {@link http://gabrito.com/files/subModal/}
//	 *
//	 * @private
//	 */
//	focusGained : function (e) {
//		if (this.notifyShellListener("shellActivated")) {
//			// store tab indexes
//			var i = 0, j, k, tagElements;
//			for (j = 0; j < this.tabbableTags.length; j++) {
//				tagElements = document.getElementsByTagName(this.tabbableTags[j]);
//				for (k = 0 ; k < tagElements.length; k++) {
//					this.tabIndexes[i] = tagElements[k].tabIndex;
//					this.tabIndexElements[i] = tagElements[k];
//					tagElements[k].tabIndex = "-1";
//					i++;
//				}
//			}
//	
//			this.$super(e);
//		}
//	},
//	
//	/**
//	 * @method
//	 * Focus of the shell gets lost and tab indexes get restored
//	 *
//	 * Code below taken from subModal {@link http://gabrito.com/files/subModal/}
//	 *
//	 * @private
//	 */
//	focusLost : function (e) {
//		if (this.notifyShellListener("shellDeactivated")) {
//			// restore tab indexes
//			for (var i = 0, len = this.tabIndexElements.length; i < len; ++i) {
//				this.tabIndexElements[i].tabIndex = this.tabIndexes[i];
//			}
//	
//			this.tabIndexes = [];
//			this.tabIndexElements = [];
//	
//			this.$super(e);
//		}
//	},
	
	/**
	 * Forces the receiver to be the active control.
	 * 
	 * @returns {void}
	 */
	forceActive : function () {
		this.handle.setAttribute("data-gara-forceactive", true);
		this.setActivate();
	},

	/**
	 * Returns the receiver's opacity
	 * 
	 * @see gara.widgets.Shell#setAlpha
	 * @returns {int} the alpha value
	 */
	getAlpha : function () {
		return this.alpha;
	},
	
	/**
	 * Returns <code>true</code> when the receiver is in fullscreen else <code>false</code>
	 * 
	 * @see gara.widgets.Shell#setFullScreen
	 * @returns {boolean} <code>true</code> for fullscreen and <code>false</code> otherwise
	 */
	getFullScreen : function () {
		return this.fullScreen;
	},
	
	/**
	 * Returns this.
	 * 
	 * @returns {gara.widgets.Shell} this
	 */
	getShell : function () {
		return this;
	},
	
	/**
	 * Internal event handler
	 * 
	 * @private
	 * @param {Eventl} e
	 * @returns {void}
	 */
	handleEvent : function (e) {
		var propagate = true;
		switch (e.type) {
		case "click":
			if (e.target ===  this.titleCloseButton) {
				this.close();
				propagate = false;
			}
			break;
			
		case "keydown":
			if (e.keyCode === gara.ESC && !e.preventShellClose) {
				this.close();
				propagate = false;
			}
			break;
		}
		
		if (propagate) {
			this.$super(e);
		}
	},
	
	/**
	 * Moves the receiver above the specified control in the drawing order.
	 * 
	 * @description
	 * Moves the receiver above the specified control in the drawing order. If no argument, 
	 * then the receiver is moved to the top of the drawing order. The control at the top of the 
	 * drawing order will not be covered by other controls even if they occupy intersecting areas. 
	 *
	 * @param {gara.widgets.Control} control the sibling control (optional)
	 */
	moveAbove : function (control) {
		var shells = this.getDisplay().getShells();
		shells.remove(this);
		shells.insertAt(control && shells.contains(control) ? shells.indexOf(control) : 0, this);
		shells.forEach(function(shell, index, shells) {
			shell.handle.style.zIndex = 1 + (shells.length - index);
		}, this);
	},
	
	/**
	 * Moves the receiver below the specified control in the drawing order.
	 * 
	 * @description
	 * Moves the receiver below the specified control in the drawing order. If no argument, 
	 * then the receiver is moved to the bottom of the drawing order. The control at the bottom of 
	 * the drawing order will be covered by all other controls which occupy intersecting areas. 
	 *
	 * @param {gara.widgets.Control} control the sibling control (optional)
	 */
	moveBelow : function (control) {
		var shells = this.getDisplay().getShells();
		shells.remove(this);
		shells.insertAt(control && shells.contains(control) ? shells.indexOf(control) + 1 : shells.length, this);
		shells.forEach(function(shell, index, shells) {
			shell.handle.style.zIndex = 1 + (shells.length - index);
		}, this);
	},

	/**
	 * Notifies shell listener, that a specific event happens.
	 * 
	 * @private
	 * @param {String} eventType
	 * @returns {boolean} true if the operation is permitted
	 */
	notifyShellListener : function (eventType) {
		var ret = true, 
			e = this.event || window.event || {};
			e.widget = this;
			e.control = this;
			
		this.shellListeners.forEach(function (listener) {
			var answer;

			if (listener[eventType]) {
				answer = listener[eventType](e);
				if (typeof(answer) !== "undefined") {
					ret = answer;
				}
			}
		}, this);
		return ret;
	},
	
	/**
	 * Opens the receiver.
	 * 
	 * @returns {void}
	 */
	open : function () {
		var x = this.parent instanceof gara.widgets.Display ? document.documentElement.clientWidth : this.parent.getClientArea().clientWidth,
			y = this.parent instanceof gara.widgets.Display ? document.documentElement.clientHeight : this.parent.getClientArea().clientHeight;
//		this.setWidth(Math.floor(x / 2));
//		this.setHeight(Math.floor(y / 2));
		
		this.setVisible(true);
		this.setFocus();
		
		if (this.x === null) {
			this.x = Math.floor(x / 2) - this.handle.offsetWidth / 2;
		}
		if (this.y === null) {
			this.y = Math.floor(y / 2) - this.handle.offsetHeight / 2;
		}
		this.setLocation(this.x, this.y);
		
		this.adjustWidth(this.getWidth());
		this.adjustHeight(this.getHeight());
	},
	
	/**
	 * Removes the listener from the collection of listeners who will be notified when 
	 * operations are performed on the receiver.
	 * 
	 * @param {gara.events.ShellListener} listener the listener which should no longer be notified 
	 * @returns {gara.widgets.Shell} this
	 */
	removeShellListener : function (listener) {
		this.shellListeners.remove(listener);
		return this;
	},
	
	/**
	 * Sets the receiver to be the active shell.
	 * 
	 * @returns {boolean} <code>true</code> when setting the shell active or <code>false</code> if not
	 */
	setActive : function () {
		if (this.getMinimized()) {
			return false;
		}

		var activeShell = this.getDisplay().getActiveShell(), activate;
		
		if (activeShell === this) {
			return true;
		}
		
		// return false, if activeShell can't be deactivated
		if (activeShell !== null && !activeShell.notifyShellListener("shellDeactivated")) {
			return false;
		}
		
		activate = this.notifyShellListener("shellActivated");
		
		if (this.handle.hasAttribute("data-gara-forceactive") || activate) {
			this.getDisplay().setActiveShell(this);
		}
		
		this.handle.removeAttribute("data-gara-forceactive");
		
		return activate;
	},
	
	/**
	 * Sets the shell's transparency value, which must be between 0 (transparent) and 100 (opaque).
	 * 
	 * @see gara.widgets.Shell#getAlpha
	 * @param {int} alpha the alpha value
	 * @returns {gara.widgets.Shell} this
	 */
	setAlpha : function (alpha) {
		this.alpha = alpha;
		this.handle.style.opacity = alpha / 100;
		this.handle.style.filter = "alpha(opacity=" + alpha + ")";

		return this;
	},
	
	/**
	 * Sets the receiver's fullscreen
	 * 
	 * @see gara.widgets.Shell#getFullScreen
	 * @param {boolean} fullScreen <code>true</code> for fullscreen otherwise <code>false</code>
	 * @returns
	 */
	setFullScreen : function (fullScreen) {
		var parent = document.documentElement, 
			id = this.getParent().getId ? this.getParent().getId() : this.getParent().id;

		if (fullScreen) {
			if (this.minimized) {
				gara.widgets.Decorations.minis[id][gara.widgets.Decorations.minis[id].indexOf(this)] = undefined;
			}
			
			if (this.restoreWidth === null) {
				this.restoreWidth = this.handle.offsetWidth;
			}
			if (this.restoreHeight === null) {
				this.restoreHeight = this.handle.offsetHeight;
			}
			
			// hide elements from DIALOG_TRIM:
			// title
			if ((this.style & gara.TITLE) !== 0) {
				this.title.style.display = "none";
			}
			
			// resize
			if ((this.style & gara.RESIZE) !== 0) {
				this.resizeNNW.style.display = "none";
				this.resizeWNW.style.display = "none";
				this.resizeN.style.display = "none";
				this.resizeNNE.style.display = "none";
				this.resizeENE.style.display = "none";
				this.resizeE.style.display = "none";
				this.resizeW.style.display = "none";
				this.resizeSSW.style.display = "none";
				this.resizeWSW.style.display = "none";
				this.resizeS.style.display = "none";
				this.resizeSSE.style.display = "none";
				this.resizeESE.style.display = "none";
			}
			
			// border
			this.setClass("garaBorder", false);
			
			// do measuring
			this.handle.style.left = 0;
			this.handle.style.top = 0;
			this.handle.style.width = parent.clientWidth + "px";
			this.handle.style.height = parent.clientHeight + "px";
			this.clientArea.style.width = parent.clientWidth + "px";
			this.clientArea.style.height = (parent.clientHeight - (this.title ? this.title.clientHeight : 0) - this.menuBarNode.offsetHeight) + "px";
			
			// add listener to keep the fullscreen shell full screen
			gara.addEventListener(window, "resize", this.resizeListener);
		}

		this.fullScreen = fullScreen;
		
		if (!fullScreen) {
			// show elements from DIALOG_TRIM:
			// title
			if ((this.style & gara.TITLE) !== 0) {
				this.title.style.display = "block";
			}
			
			// resize
			if ((this.style & gara.RESIZE) !== 0) {
				this.resizeNNW.style.display = "block";
				this.resizeWNW.style.display = "block";
				this.resizeN.style.display = "block";
				this.resizeNNE.style.display = "block";
				this.resizeENE.style.display = "block";
				this.resizeE.style.display = "block";
				this.resizeW.style.display = "block";
				this.resizeSSW.style.display = "block";
				this.resizeWSW.style.display = "block";
				this.resizeS.style.display = "block";
				this.resizeSSE.style.display = "block";
				this.resizeESE.style.display = "block";
			}
			
			// border
			this.setClass("garaBorder", (this.style & gara.BORDER) !== 0);
			
			// do measuring
			this.handle.style.left = this.x + "px";
			this.handle.style.top = this.y + "px";
			this.adjustWidth(this.restoreWidth);
			this.adjustHeight(this.restoreHeight);
			this.restoreWidth = null;
			this.restoreHeight = null;
			
			gara.removeEventListener(window, "resize", this.resizeListener);
		}
		this.layout();
	},
	
	/* 
	 * jsdoc in gara.widgets.Control 
	 */
	setHeight : function (height) {
		if (this.maximized || this.minimized || this.fullScreen) {
			this.height = height;
		} else {
			this.$super(height);
		}
				
		return this;
	},
	
	/* 
	 * jsdoc in gara.widgets.Control
	 */
	setLocation : function (x, y) {
		if (this.maximized || this.minimized || this.fullScreen) {		
			if (x > 0) {
				this.x = x;
			}
	
			if (y > 0) {
				this.y = y;
			}
		} else {
			this.$super(x, y);
		}

		return this;
	},
	
	/* 
	 * jsdoc in gara.widgets.Control 
	 */
	setWidth : function (width) {
		if (this.maximized || this.minimized || this.fullScreen) {
			this.width = width;
		} else {
			this.$super(width);	
		}

		return this;
	},
	
	/* 
	 * jsdoc in gara.widgets.Decorations 
	 */
	setMaximized : function (maximized) {
		if (this.minimized && !this.notifyShellListener("shellDeiconified")) {
			return this;
		}
		return this.$super(maximized);
	},
	
	/* 
	 * jsdoc in gara.widgets.Decorations 
	 */
	setMinimized : function (minimized) {
		if (!minimized && !this.notifyShellListener("shellDeiconified")) {
			return this;
		}
		if (minimized && !this.notifyShellListener("shellIconified")) {
			return this;
		}
				
		if (minimized) {
			this.getDisplay().setActiveShell(null);
		} else {
			this.getDisplay().setActiveShell(this);
		}
		
		return this.$super(minimized);
	},
	
	update : function () {
		
	}
};});