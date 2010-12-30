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

gara.provide("gara.action.MenuManager");

gara.use("gara.widgets.Control");
gara.use("gara.widgets.Menu");
gara.use("gara.widgets.MenuItem");

/**
 * @class gara.action.MenuManager
 * @implements gara.action.IAction
 */
gara.Class("gara.action.MenuManager", /** @lends gara.action.MenuManager# */ {
	
	/**
	 * Contains the menu items
	 *
	 * @private
	 * @type {gara.widgets.MenuItem[]}
	 */
	actions : [],

	/**
	 * Contains the delivered menus
	 *
	 * @private
	 * @type {gara.widgets.Menu[]}
	 */
	menus : [],

	/**
	 * Holds the enabled state for this representation
	 *
	 * @private
	 * @type {boolean}
	 */
	enabled : true,

	/**
	 * Contains the id for this representation
	 *
	 * @private
	 * @type {String}
	 */
	id : null,
	
	/**
	 * Contains the text for this representation
	 *
	 * @private
	 * @type {String}
	 */
	text : "",

	/**
	 * Holds the image for this representation
	 *
	 * @private
	 * @type {Image}
	 */
	image : null,

	/**
	 * Is the action changed listener, that will be notified when an action
	 * gets changed and updates the managed menus.
	 *
	 * @private
	 * @type {gara.action.ActionChangedListener}
	 */
	actionListener : null,

	/**
	 * Creates a menu manager with the given text, image, and id. Typically used for creating 
	 * a sub-menu, where it needs to be referred to by id.
	 *  
	 * @constructs
	 * @param {String} text the text for the menu, or <code>null</code> if none (optional)
	 * @param {Image} image the image for the menu, or <code>null</code> if none (optional)
	 * @param {String} id the menu id, or <code>null</code> if it is to have no id (optional)
	 */
	$constructor : function (text, image, id) {
		var self = this;
		this.actions = [];
		this.menus = [];

		this.enabled = true;
		this.text = text || null;
		this.image = image || null;
		this.id = id || image || null;

		this.actionListener = {
			actionChanged : function (action) {
				self.updateAction(action);
			}
		};
	},

	/**
	 * Adds an action or menu manager as a contribution item to this manager.
	 * 
	 * @see gara.action.MenuManager#addAction
	 * @see gara.action.MenuManager#addMenuManager
	 * @param {gara.action.IAction|gara.action.MenuManager} actionOrMngr
	 */
	add : function(actionOrMngr) {
		if (actionOrMngr instanceof gara.action.MenuManager) {
			this.addMenuManager(actionOrMngr);
		} else {
			this.addAction(actionOrMngr);
		}
	},

	/**
	 * Adds an action as a contribution item to this manager.
	 * @param {gara.action.IAction} action
	 */
	addAction : function (action) {
		if (action.addActionChangedListener && !this.actions.contains(action)) {
			action.addActionChangedListener(this.actionListener);
			this.actions.push(action);
		}
	},

	/**
	 * Adds a menu manager as a contribution item to this manager.
	 * @param {gara.action.MenuManager} manager
	 */
	addMenuManager : function (manager) {
		if (!(manager instanceof gara.action.MenuManager)) {
			throw new TypeError("manager not instance of gara.action.MenuManager");
		}

		if (!this.actions.contains(manager)) {
			this.actions.push(manager);
		}
	},

	/**
	 * Creates and returns a context menu control for this menu, and installs all registered 
	 * contributions.
	 * 
	 * @param {gara.widget.Control} control the parent control
	 * @returns {gara.widgets.Menu} the menu control
	 */
	createContextMenu : function (parent) {
		if (!(parent instanceof gara.widgets.Control)) {
			throw new TypeError("control ist not instance of gara.widgets.Control");
		}

		var menu = new gara.widgets.Menu(parent);
		this.menus.push(menu);
		this.updateMenu(menu);
		parent.setMenu(menu);
		return menu;
	},

	/**
	 * Creates and returns a menu bar control for this menu, for use in the given 
	 * Decorations, and installs all registered contributions.
	 * 
	 * @description
	 * Creates and returns a menu bar control for this menu, for use in the given 
	 * Decorations, and installs all registered contributions. Does not create a new control if 
	 * one already exists.
	 *  
	 * @param {gara.widgets.Decorations} parent the parent decorations
	 * @returns {gara.widgets.Menu} the menu control
	 */
	createMenuBar : function (parent) {
		var menu = new gara.widgets.Menu(parent, gara.BAR);
		this.menus.push(menu);
		this.updateMenu(menu);
		return menu;
	},

	/**
	 * Creates and returns a tool bar control for this menu, for use in the given 
	 * Decorations, and installs all registered contributions.
	 * 
	 * @description
	 * Creates and returns a tool bar control for this menu, for use in the given 
	 * Decorations, and installs all registered contributions. Does not create a new control if 
	 * one already exists.
	 *  
	 * @param {gara.widgets.Decorations} parent the parent decorations
	 * @returns {gara.widgets.Menu} the menu control
	 */
	createToolBar : function (parent) {
		var menu = new gara.widgets.Menu(parent, gara.TOOLBAR);
		this.menus.push(menu);
		this.updateMenu(menu);
		return menu;
	},

	/**
	 * 
	 *
	 * @private
	 */
	createMenuItem : function (menu, action) {
		var item = new gara.widgets.MenuItem(menu, gara.CASCADE);
		if (action.getText) {
			item.setText(action.getText());
		}

		if (action.getImage) {
			item.setImage(action.getImage());
		}

		if (action.getEnabled) {
			item.setEnabled(action.getEnabled());
		}
		item.setData(action);
		item.addSelectionListener({
			widgetSelected : function (event) {
				var action;
				if (event.item instanceof gara.widgets.MenuItem) {
					action = event.item.getData();
					if (action.run) {
						action.run();
					}
				}
			}
		});

		if (action instanceof gara.action.MenuManager && action.getSize()) {
			this.createSubmenu(item, action);
		}
	},

	/**
	 * 
	 *
	 * @private
	 */
	createSubmenu : function (parent, action) {
		action.submenu = new gara.widgets.Menu(parent);
		parent.setMenu(action.submenu);
		action.fillMenu(action.submenu);
	},
	
	/**
	 * Disposes of this menu manager and frees all allocated resources.
	 * 
	 * @returns {void}
	 */
	dispose : function () {
		this.menus.forEach(function (menu) {
			menu.dispose();
		}, this);
		this.menus = null;
		
		this.actions.forEach(function (action) {
			action.dispose();
		}, this);
	},

	/**
	 * Fills the given menu with controls representing this contribution item.
	 * 
	 * @param {gara.widgets.Menu} parent the parent menu
	 */
	fillMenu : function (parent) {
		var i;
		if (!(parent instanceof gara.widgets.Menu)) {
			throw new TypeError("menu ist not instance of gara.widgets.Menu");
		}

		if (!this.menus.contains(parent)) {
			this.menus.push(parent);
			// create new
			for (i = 0; i < this.actions.length; i++) {
				this.createMenuItem(parent, this.actions[i]);
			}
		}
	},
	
	/**
	 * Fills the given menu with controls representing this contribution item.
	 * 
	 * @param {gara.widgets.Menu} parent the parent menu
	 */
	fillToolBar : function (parent) {
		return this.fillMenu(parent);
	},

	/**
	 * Returns whether this contribution is enabled.
	 * 
	 * @returns {boolean} <code>true</code> if enabled, and <code>false</code> if disabled
	 */
	getEnabled : function () {
		return this.enabled;
	},
	
	/**
	 * Returns a unique identifier for this contribution, or <code>null</code> if it has
	 * none.
	 *
	 * @returns {String} the contribution id, or <code>null</code> if none
	 */
	getId : function () {
		return this.id;
	},

	/**
	 * Returns the image for this contribution.
	 * 
	 * @returns {Image} the image
	 */
	getImage : function () {
		return this.image;
	},

	/**
	 * Return the number of contributions in this manager. 
	 * 
	 * @returns {int} the number of contributions in this manager
	 */
	getSize : function () {
		return this.actions.length;
	},

	/**
	 * Returns the text for this contribution.
	 * 
	 * @returns {String} the text
	 */
	getText : function () {
		return this.text;
	},

	/**
	 * Removes the given action or menu manager as a contribution item from this manager.
	 * 
	 * @see gara.action.MenuManager#removeAction
	 * @see gara.action.MenuManager#removeMenuManager
	 * @param {gara.action.IAction|gara.action.MenuManager} actionOrMngr
	 * @returns {void}
	 */
	remove : function(actionOrMngr) {
		if (actionOrMngr instanceof gara.action.MenuManager) {
			this.removeMenuManager(actionOrMngr);
		} else {
			this.removeAction(actionOrMngr);
		}
	},

	/**
	 * Removes the given action as a contribution item from this manager.
	 * 
	 * @param {gara.action.IAction} action the action 
	 * @returns {void}
	 */
	removeAction : function (action) {
		if (action.removeActionChangedListener) {
			action.removeActionChangedListener(this.actionListener);
			this.actions.remove(action);
		}
	},

	/**
	 * Removes the given menu manager as a contribution item from this manager.
	 * 
	 * @param {gara.action.MenuManager} manager the menu manager 
	 * @returns {void}
	 */
	removeMenuManager : function (manager) {
		if (!(manager instanceof gara.action.MenuManager)) {
			throw new TypeError("manager not instance of gara.action.MenuManager");
		}

		this.actions.remove(manager);
	},

	/**
	 * Sets the enabled state of this contribution.
	 * 
	 * @param {boolean} <code>true</code> for enabled and <code>false</code>for disabled
	 */
	setEnabled : function (enabled) {
		this.enabled = enabled;
	},
	
	/**
	 * Sets the id for this contribution.
	 * 
	 * @param {String} the id
	 */
	setId : function (id) {
		this.id = id;
	},

	/**
	 * Sets the image for this contribution.
	 * 
	 * @param {Image} the image
	 */
	setImage : function (image) {
		this.image = image;
	},

	/**
	 * Sets the text for this contribution.
	 * 
	 * @param {String} the text
	 */
	setText : function (text) {
		this.text = text;
	},

	/**
	 * Incrementally builds the menu from the contribution items, and does so recursively for 
	 * all submenus. Either for the specified menu respectively action. If the parameter is omitted,
	 * everything gets updated.
	 * 
	 * @see gara.action.MenuManager#updateMenu
	 * @see gara.action.MenuManager#updateAction
	 * @param {gara.widgets.Menu|gara.action.IAction} ma menu or action (optional)
	 */
	update : function (ma) {
		if (ma instanceof gara.widgets.Menu) {
			this.updateMenu(ma);
		}

		else if (ma && ma.addActionChangedListener) {
			this.updateAction(ma);
		}

		else {
			this.menus.forEach(function (menu) {
				this.updateMenu(menu);
			}, this);
		}
	},

	/**
	 * Updates all menus that are affected by an update of the specified action.
	 *  
	 * @param {gara.action.IAction} action
	 */
	updateAction : function (action) {
		this.menus.forEach(function (menu) {
			menu.getItems().forEach(function (item) {
				if (item.getData() === action) {
					item.setText(action.getText());
					item.setImage(action.getImage());
					item.setEnabled(action.getEnabled());
					menu.update();
				}
			}, this);
		}, this);
	},

	/**
	 * Incrementally builds the menu from the contribution items, and does so 
	 * recursively for all submenus.
	 *  
	 * @param {gara.widgets.Menu} menu
	 */
	updateMenu : function (menu) {
		var items = menu.getItems(),
			itemCount = items.length,
			min = Math.min(itemCount, this.actions.length),
			item, action, i;

		// update available items
		for (i = 0; i < min; i++) {
			action = this.actions[i];
			item = items[i];
			if (action.getText) {
				item.setText(action.getText());
			}

			if (action.getImage) {
				item.setImage(action.getImage());
			}

			if (action.getEnabled) {
				item.setEnabled(action.getEnabled());
			}
			item.setData(action);

			if (action instanceof gara.action.MenuManager) {
				if (action.submenu) {
					action.update(action.submenu);
				} else {
					this.createSubmenu(item, action);
				}
			}
		}

		// remove obsolete
		for (i = min; i < itemCount; i++) {
			item = items[i];
			item.setData(null);
			item.removeSelectionListener(this);
			item.dispose();
		}

		// create new
		for (i = min; i < this.actions.length; i++) {
			this.createMenuItem(menu, this.actions[i]);
		}

		menu.update();
	}
});
