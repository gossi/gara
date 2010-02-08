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

gara.provide("gara.jsface.action.MenuManager");

gara.provide("gara.jsface.action.ActionChangedListener");
gara.provide("gara.jsface.action.IAction");
gara.provide("gara.jswt.JSWT");
gara.provide("gara.jswt.events.SelectionListener");
gara.provide("gara.jswt.widgets.Control");
gara.provide("gara.jswt.widgets.Menu");
gara.provide("gara.jswt.widgets.MenuItem");

/**
 * @class MenuManager
 * @namespace gara.jsface.action
 * @author Thomas Gossmann
 */
gara.Class("MenuManager", {
	$implements : [gara.jswt.events.SelectionListener, gara.jsface.action.ActionChangedListener],

	$constructor : function(text, image) {
		this._items = [];
		this._menus = [];

		this._enabled = true;
		this._text = text;
		this._image = image;
	},

	actionChanged : function(action) {
		this.updateAction(action);
	},

	addAction : function(action) {
		if (!gara.instanceOf(action, gara.jsface.action.IAction)) {
			throw new TypeError("action not instance of gara.jsface.action.IAction");
		}

		if (!this._items.contains(action)) {
			action.addActionChangedListener(this);
			this._items.push(action);
		}
	},

	addMenuManager : function(manager) {
		if (!gara.instanceOf(manager, gara.jsface.action.MenuManager)) {
			throw new TypeError("manager not instance of gara.jsface.action.MenuManager");
		}

		if (!this._items.contains(manager)) {
			this._items.push(manager);
		}
	},

	createContextMenu : function(control) {
		if (!gara.instanceOf(control, gara.jswt.widgets.Control)) {
			throw new TypeError("control ist not instance of gara.jswt.widgets.Control");
		}

		var menu = new gara.jswt.widgets.Menu(control);
		this._menus.push(menu);
		this.updateMenu(menu);
		control.setMenu(menu);
	},

	createMenuBar : function(parent) {
		var menu = new gara.jswt.widgets.Menu(parent);
		this._menus.push(menu);
		this.updateMenu(menu);
	},

	_createMenuItem : function(menu, item) {
		var menuItem = new gara.jswt.widgets.MenuItem(menu, gara.jswt.JSWT.CASCADE);
		menuItem.setText(item.getText());
		menuItem.setImage(item.getImage());
		menuItem.setEnabled(item.getEnabled());
		menuItem.setData(item);
		menuItem.addSelectionListener(this);

		if (gara.instanceOf(item, gara.jsface.action.MenuManager)
				&& item.getSize()) {
			this._createSubmenu(menuItem, item);
		}
	},

	_createSubmenu : function(parent, item) {
		item.submenu = new gara.jswt.widgets.Menu(parent);
		parent.setMenu(item.submenu);
		item.fillMenu(item.submenu);

	},

	fillMenu : function(menu) {
		if (!gara.instanceOf(menu, gara.jswt.widgets.Menu)) {
			throw new TypeError("menu ist not instance of gara.jswt.widgets.Menu");
		}

		if (!this._menus.contains(menu)) {
			this._menus.push(menu);
			// create new
			for (var i = 0; i < this._items.length; i++) {
				this._createMenuItem(menu, this._items[i]);
			}
		}
	},

	getEnabled : function() {
		return this._enabled;
	},

	getImage : function() {
		return this._image;
	},

	getSize : function() {
		return this._items.length;
	},

	getText : function() {
		return this._text;
	},

	removeAction : function(action) {
		if (!gara.instanceOf(action, gara.jsface.action.IAction)) {
			throw new TypeError("action not instance of gara.jsface.action.IAction");
		}

		action.removeActionChangedListener(this);
		this._items.remove(action);
	},

	setEnabled : function(enabled) {
		this._enabled = enabled;
	},

	setImage : function(image) {
		this._image = image;
	},

	setText : function(text) {
		this._text = text;
	},

	update : function(ma) {
		if (gara.instanceOf(ma, gara.jswt.widgets.Menu)) {
			this.updateMenu(ma);
		}

		else if (gara.instanceOf(ma, gara.jsface.action.IAction)) {
			this.updateAction(ma);
		}

		else {
			this._menus.forEach(function(menu) {
				this.updateMenu(menu);
			}, this);
		}
	},

	updateAction : function(action) {
		this._menus.forEach(function(menu) {
			menu.getItems().forEach(function(item) {
				if (item.getData() == action) {
					item.setText(action.getText());
					item.setImage(action.getImage());
					item.setEnabled(action.getEnabled());
					menu.update();
				}
			}, this);
		}, this);
	},

	updateMenu : function(menu) {
		var menuItems = menu.getItems();
		var itemCount = menuItems.length;
		var min = Math.min(itemCount, this._items.length);

		// update available menuItems
		for (var i = 0; i < min; i++) {
			var menuItem = menuItems[i];
			var item = this._items[i];
			menuItem.setText(item.getText());
			menuItem.setImage(item.getImage());
			menuItem.setEnabled(item.getEnabled());
			menuItem.setData(item);

			if (gara.instanceOf(item, gara.jsface.action.MenuManager)) {
				if (item.submenu) {
					item.update(item.submenu);
				} else {
					this._createSubmenu(menuItem, item);
				}
			}
		}

		// remove obsolete
		for (var i = min; i < itemCount; i++) {
			var menuItem = menuItems[i];
			menuItem.setData(null);
			menuItem.removeSelectionListener(this);
			menuItem.dispose();
		}

		// create new
		for (var i = min; i < this._items.length; i++) {
			this._createMenuItem(menu, this._items[i]);
		}

		menu.update();
	},

	widgetSelected : function(event) {
		if (gara.instanceOf(event.item, gara.jswt.widgets.MenuItem)) {
			var action = event.item.getData();
			if (gara.instanceOf(action, gara.jsface.action.IAction)) {
				action.run();
			}
		}
	}
});