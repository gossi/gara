/*	$Id $

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

gara.provide("gara.action.MenuManager");

gara.use("gara.widgets.Control");
gara.use("gara.widgets.Menu");
gara.use("gara.widgets.MenuItem");

/**
 * @class MenuManager
 * @namespace gara.action
 * @author Thomas Gossmann
 */
gara.Class("gara.action.MenuManager", {
	/**
	 * @field
	 * Contains the menu items
	 *
	 * @private
	 * @type {gara.widgets.MenuItem[]}
	 */
	actions : [],

	/**
	 * @field
	 * Contains the delivered menus
	 *
	 * @private
	 * @type {gara.widgets.Menu[]}
	 */
	menus : [],

	/**
	 * @field
	 * Holds the enabled state for this representation
	 *
	 * @private
	 * @type {}
	 */
	enabled : true,

	/**
	 * @field
	 * Contains the text for this representation
	 *
	 * @private
	 * @type {}
	 */
	text : "",

	/**
	 * @field
	 * Holds the image for this representation
	 *
	 * @private
	 * @type {}
	 */
	image : null,

	/**
	 * @field
	 * Is the action changed listener, that will be notified when an action
	 * gets changed and updates the managed menus.
	 *
	 * @private
	 * @type {gara.action.ActionChangedListener}
	 */
	actionListener : null,

	$constructor : function (text, image) {
		var self = this;
		this.actions = [];
		this.menus = [];

		this.enabled = true;
		this.text = text;
		this.image = image || null;

		this.actionListener = {
			actionChanged : function (action) {
				self.updateAction(action);
			}
		};
	},

	add : function(actionOrMngr) {
		if (actionOrMngr instanceof gara.action.MenuManager) {
			this.addMenuManager(actionOrMngr);
		} else {
			this.addAction(actionOrMngr);
		}
	},

	/**
	 * @method
	 *
	 * @param {gara.action.IAction} action
	 */
	addAction : function (action) {
		if (action.addActionChangedListener && !this.actions.contains(action)) {
			action.addActionChangedListener(this.actionListener);
			this.actions.push(action);
		}
	},

	addMenuManager : function (manager) {
		if (!(manager instanceof gara.action.MenuManager)) {
			throw new TypeError("manager not instance of gara.action.MenuManager");
		}

		if (!this.actions.contains(manager)) {
			this.actions.push(manager);
		}
	},

	createContextMenu : function (control) {
		if (!(control instanceof gara.widgets.Control)) {
			throw new TypeError("control ist not instance of gara.widgets.Control");
		}

		var menu = new gara.widgets.Menu(control);
		this.menus.push(menu);
		this.updateMenu(menu);
		control.setMenu(menu);
		return menu;
	},

	createMenuBar : function (parent) {
		var menu = new gara.widgets.Menu(parent, gara.BAR);
		this.menus.push(menu);
		this.updateMenu(menu);
		return menu;
	},

	createToolBar : function (parent) {
		var menu = new gara.widgets.Menu(parent, gara.TOOLBAR);
		this.menus.push(menu);
		this.updateMenu(menu);
		return menu;
	},

	/**
	 * @method
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
				if (event.action instanceof gara.widgets.MenuItem) {
					action = event.action.getData();
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
	 * @method
	 *
	 * @private
	 */
	createSubmenu : function (parent, action) {
		action.submenu = new gara.widgets.Menu(parent);
		parent.setMenu(action.submenu);
		action.fillMenu(action.submenu);
	},

	fillMenu : function (menu) {
		var i;
		if (!(menu instanceof gara.widgets.Menu)) {
			throw new TypeError("menu ist not instance of gara.widgets.Menu");
		}

		if (!this.menus.contains(menu)) {
			this.menus.push(menu);
			// create new
			for (i = 0; i < this.actions.length; i++) {
				this.createMenuItem(menu, this.actions[i]);
			}
		}
	},

	getEnabled : function () {
		return this.enabled;
	},

	getImage : function () {
		return this.image;
	},

	getSize : function () {
		return this.actions.length;
	},

	getText : function () {
		return this.text;
	},

	remove : function(actionOrMngr) {
		if (actionOrMngr instanceof gara.action.MenuManager) {
			this.removeMenuManager(actionOrMngr);
		} else {
			this.removeAction(actionOrMngr);
		}
	},

	/**
	 * @method
	 *
	 * @param {gara.action.IAction} action
	 */
	removeAction : function (action) {
		if (action.removeActionChangedListener) {
			action.removeActionChangedListener(this.actionListener);
			this.actions.remove(action);
		}
	},

	removeMenuManager : function (manager) {
		if (!(manager instanceof gara.action.MenuManager)) {
			throw new TypeError("manager not instance of gara.action.MenuManager");
		}

		this.actions.remove(manager);
	},

	setEnabled : function (enabled) {
		this.enabled = enabled;
	},

	setImage : function (image) {
		this.image = image;
	},

	setText : function (text) {
		this.text = text;
	},

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
