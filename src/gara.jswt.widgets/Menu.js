/*	$Id: Menu.class.js 181 2009-08-02 20:51:16Z tgossmann $

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

gara.provide("gara.jswt.widgets.Menu");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");
//gara.use("gara.jswt.widgets.Control");
//gara.use("gara.jswt.widgets.MenuItem");

gara.parent("gara.jswt.widgets.Composite",

/**
 * @summary gara Menu Widget
 *
 * @description long description for the Menu Widget...
 *
 * @class Menu
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Widget
 */
function() {gara.Class("gara.jswt.widgets.Menu", {
	$extends : gara.jswt.widgets.Composite,

	// private members


	/**
	 * @field
	 * Contains the current active item.
	 *
	 * @private
	 * @type {gara.jswt.widgets.MenuItem}
	 */
	activeItem : null,

	/**
	 * @field
	 * Holds the enabled state.
	 *
	 * @private
	 * @type {boolean}
	 */
	enabled : false,

	/**
	 * @field
	 * Contains the <code>MenuItem</code>s.
	 *
	 * @private
	 * @type {gara.jswt.widgets.MenuItem[]}
	 */
	items : [],

	/**
	 * @field
	 * A reminder, if the a drop down menu of a menu bar is shown.
	 *
	 * @private
	 * @type {boolean}
	 */
	menuBarDropDownShown : false,

	/**
	 * @field
	 * Contains a collection of listeners, that will be notified when the
	 * visibility of the <code>Menu</code> changes.
	 *
	 * @private
	 * @type {}
	 */
	menuListeners : [],

	/**
	 * @field
	 * Holds the visibility state.
	 *
	 * @private
	 * @type {}
	 */
	visible : false, // bar : true

	/**
	 * @field
	 * X position of the location.
	 *
	 * @private
	 * @type {int}
	 */
	x : 0,

	/**
	 * @field
	 * Y position of the location.
	 *
	 * @private
	 * @type {int}
	 */
	y : 0,

	$constructor : function (parent, style) {
		// style
		if (parent instanceof gara.jswt.widgets.MenuItem
				&& (parent.getStyle() & gara.jswt.JSWT.CASCADE) !== gara.jswt.JSWT.CASCADE) {
			throw new TypeError("parent has no gara.jswt.JSWT.CASCADE style!");
		}

		if (parent instanceof gara.jswt.widgets.Control) {
			style |= gara.jswt.JSWT.POP_UP;
		}

		if (parent instanceof gara.jswt.widgets.MenuItem) {
			style |= gara.jswt.JSWT.DROP_DOWN;
		}

		if (((style & gara.jswt.JSWT.POP_UP) !== gara.jswt.JSWT.POP_UP
				&& (style & gara.jswt.JSWT.DROP_DOWN) !== gara.jswt.JSWT.DROP_DOWN)
				|| (style & gara.jswt.JSWT.TOOLBAR) === gara.jswt.JSWT.TOOLBAR) {
			style |= gara.jswt.JSWT.BAR;
		}

		// private members
		this.items = [];
		this.menuListener = [];
		this.activeItem = null;

		// location
		this.x = 0;
		this.y = 0;

		// flags
		this.enabled = false;
		this.visible = (style & gara.jswt.JSWT.BAR) === gara.jswt.JSWT.BAR; // bar = true
		this.menuBarDropDownShown = false;

		this.$super(parent, style);
	},


	/**
	 * @method Register listeners for this widget. Implementation for
	 *         gara.jswt.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	bindListener : function (eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	activateItem : function (item) {
		var menu;
		if (this.activeItem === item) {
			return;
		}

		if (this.activeItem !== null) {
			this.activeItem.setActive(false);
			if (this.activeItem.getMenu() !== null) {
				this.activeItem.getMenu().setVisible(false);
			}
		}

		this.activeItem = item;
		if ((this.activeItem.getParent().getStyle() & gara.jswt.JSWT.TOOLBAR) !== gara.jswt.JSWT.TOOLBAR
				|| (this.event !== null && this.event.type && (
					this.event.type === "keydown" || this.event.type === "keyup"
					|| this.event.type === "keypress" || this.event.type === "focus"))) {
			this.activeItem.setActive(true);
		}

		menu = this.activeItem.getMenu();
		if (this.menuBarDropDownShown && menu !== null) {
			menu.setVisible(true);
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	addItem : function (item, index) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.MenuItem)) {
			throw new TypeError("item is not instance of gara.jswt.widgets.MenuItem");
		}

		index = index || this.items.length;
		this.items.insertAt(index, item);

		return this.handle;
	},

	addMenuListener : function (listener) {
		this.checkWidget();
		if (!this.menuListener.contains(listener)) {
			this.menuListener.push(listener);
		}

		return this;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	createWidget : function () {
		this.createHandle("ul", true);
		this.handle.style.display = this.visible ? "block" : "none";
		this.handle.setAttribute("id", this.getId());
		this.handle.setAttribute("role", "menu");

		// css
		this.addClass("jsWTMenu");

		// listener
		if (!(this.parent instanceof gara.jswt.widgets.MenuItem)) {
			this.addListener("mouseover", this);
			this.addListener("mouseout", this);
			this.addListener("mouseup", this);
			this.addListener("mousedown", this);
		}

		if ((this.style & gara.jswt.JSWT.BAR) === gara.jswt.JSWT.BAR) {
			this.addClass("jsWTMenuBar");
			this.parentNode = this.parent;
			this.handle.setAttribute("role", "menubar");

			gara.EventManager.addListener(document, "mousedown", this);
			//gara.EventManager.addListener(document, "mouseup", this);

			if ((this.style & gara.jswt.JSWT.TOOLBAR) === gara.jswt.JSWT.TOOLBAR) {
				this.addClass("jsWTToolbar");
			}

			if (this.parent instanceof gara.jswt.widgets.Composite) {
				this.parentNode = this.parent.handle;
			}
		}

		if ((this.style & gara.jswt.JSWT.POP_UP) === gara.jswt.JSWT.POP_UP) {
			this.addClass("jsWTMenuPopUp");
			this.handle.tabIndex = -1;
			this.handle.style.position = "absolute";
			this.handle.style.top = this.y + "px";
			this.handle.style.left = this.x + "px";
			this.parentNode = document.getElementsByTagName("body")[0];
		}

		if ((this.style & gara.jswt.JSWT.DROP_DOWN) === gara.jswt.JSWT.DROP_DOWN) {
			this.addClass("jsWTMenuDropDown");
			this.handle.tabIndex = -1;
			this.handle.style.position = "absolute";
			this.parentNode = this.parent.handle;
		}

		this.parentNode.appendChild(this.handle);
	},

	dispose : function () {
		this.$super();

		this.items.forEach(function (item, index, arr) {
			item.dispose();
		}, this);

		this.parentNode.removeChild(this.handle);
		delete this.handle;
	},

	focusGained : function (e) {
		this.event = e;
		if (this.items.length && this.activeItem === null) {
			if (e.target.widget && e.target.widget instanceof gara.jswt.widgets.MenuItem
					&& e.target.widget.getParent() === this) {
				this.activateItem(e.target.widget);
			} else {
				this.activateItem(this.items[0]);
			}
		}

		this.$super(e);
	},

	focusLost : function (e) {
		this.event = e;
		if (this.activeItem) {
			if (this.activeItem.getMenu() !== null
					&& this.activeItem.getMenu().getVisible()) {
				this.activeItem.getMenu().setVisible(false);
			}
			this.activeItem.setActive(false);
			this.activeItem = null;
		}

		this.$super(e);
	},

	getItem : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) == "undefined") {
			throw new RangeError("There is no item for the given index");
		}

		return this.items[index];
	},

	getItemCount : function () {
		return this.items.length;
	},

	getItems : function () {
		return this.items;
	},

	getParent : function () {
		return this.parent;
	},

	getParentItem : function () {
		return this.parent;
	},

	getVisible : function () {
		return this.visible;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	handleEvent : function (e) {
		var item, invokeItem, activeItem;
		this.checkWidget();
		e.widget = this;
		this.event = e;
		invokeItem = function (item) {
			var parent = item;
			item.setSelection((item.getStyle() & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO ? true : !item.getSelection());

			// setting child menus invisible
			while (parent.getParent() !== null
					&& (
						(parent.getParent() instanceof gara.jswt.widgets.Menu
							&& (parent.getParent().getStyle() & gara.jswt.JSWT.BAR) !== gara.jswt.JSWT.BAR)
						|| parent.getParent() instanceof gara.jswt.widgets.MenuItem
					)) {
				parent = parent.getParent();

				if (parent instanceof gara.jswt.widgets.Menu) {
					parent.setVisible(false);
				}
			}

			if (parent.getParent() !== null
					&& parent.getParent() instanceof gara.jswt.widgets.Menu
					&& (parent.getParent().getStyle() & gara.jswt.JSWT.BAR) === gara.jswt.JSWT.BAR) {
				parent.getParent().hideMenuBarDropDown();
			}

			// blurring menubar
			if (item.getParent() !== null
					&& (item.getParent().getStyle() & gara.jswt.JSWT.BAR) === gara.jswt.JSWT.BAR
					&& item.getParent() === this
					&& this.hasFocus) {
				item.getParent().handle.blur();
			}
		};

		switch (e.type) {
		case "mousedown":
			if (e.target.widget
					&& e.target.widget instanceof gara.jswt.widgets.MenuItem
					&& e.target.widget.getParent() === this
					&& (this.getStyle() & gara.jswt.JSWT.BAR) === gara.jswt.JSWT.BAR) {
				this.activateItem(e.target.widget);
			}

			// focus lost on pop up
			if ((e.target.widget ? e.target.widget !== this : true)
					&& (this.getStyle() & gara.jswt.JSWT.POP_UP) === gara.jswt.JSWT.POP_UP
					&& !(e.target.widget instanceof gara.jswt.widgets.MenuItem)) {
				this.setVisible(false);
			}

			// focus lost on bar
			else if ((e.target.widget ? e.target.widget !== this
						&& e.target.widget.getParent() !== this : true)
					&& (this.getStyle() & gara.jswt.JSWT.BAR) === gara.jswt.JSWT.BAR) {
				var parent, invokedSubitem;
				if (this.activeItem) {
					if (e.target.widget
							&& (e.target.widget instanceof gara.jswt.widgets.Menu
								|| e.target.widget instanceof gara.jswt.widgets.MenuItem)) {
						parent = e.target.widget;

						while (parent.getParent() !== null
								&& (parent.getParent() instanceof gara.jswt.widgets.Menu
									|| parent.getParent() instanceof gara.jswt.widgets.MenuItem)
								&& parent !== this) {
							parent = parent.getParent();
						}
					}
					invokedSubitem = parent === this;

					if (this.activeItem.getMenu() !== null
							&& this.activeItem.getMenu().getVisible()
							&& !invokedSubitem) {
						this.activeItem.getMenu().setVisible(false);
					}
					this.activeItem.setActive(false);
					this.activeItem = null;
				}

			}
			break;

		case "mouseup":
			if ((e.target.widget
					&& (e.target.widget instanceof gara.jswt.widgets.MenuItem
						|| e.target.widget instanceof gara.jswt.widgets.Menu
						|| this.activeItem !== null))) {

				activeItem = e.target.widget instanceof gara.jswt.widgets.MenuItem
					? e.target.widget
					: (e.target.widget.activeItem !== null
						? e.target.widget.activeItem
						: this.activeItem);

				if (activeItem !== null) {
					invokeItem(activeItem);
				}
			}
			break;

		case "mouseover":
			if (e.target.widget
					&& e.target.widget instanceof gara.jswt.widgets.MenuItem
					&& (e.target.widget.getStyle() & gara.jswt.JSWT.SEPARATOR) !== gara.jswt.JSWT.SEPARATOR) {
				item = e.target.widget;
				if (item.getParent() === this && item.getEnabled()) {
					this.activateItem(e.target.widget);
					if (this.activeItem.getMenu() !== null
							&& ((this.style & gara.jswt.JSWT.BAR) === gara.jswt.JSWT.BAR ? this.hasFocus : true)) {
						this.activeItem.getMenu().setVisible(true);
					}
				} else if (this.activeItem
						&& this.activeItem.getMenu() !== null
						&& this.activeItem.getMenu().getVisible()) {
					this.activeItem.getMenu().handleEvent(e);
				}
			}
			else if (e.target.widget && e.target.widget === this && this.activeItem !== null) {
				this.activeItem.setActive(false);
				this.activeItem = null;
			}
			break;

		case "mouseout":
			if (e.target.widget && (e.target.widget === this || e.target.widget.getParent() === this)
					&& !this.hasFocus
					&& this.activeItem !== null) {
				this.activeItem.setActive(false);
				this.activeItem = null;
			}
			break;

		case "keydown":
			if (this.activeItem
					&& this.activeItem.getMenu() !== null
					&& this.activeItem.getMenu().getVisible()) {
				this.activeItem.getMenu().handleEvent(e);
			} else {
				if (e.keyCode === gara.jswt.JSWT.ENTER) {
					invokeItem(this.activeItem);
				}
				this.handleKeyNavigation(e);
				this.preventScrolling(e);
			}
			break;
		}

		this.$super(e);

		// pass on the event to active Item
		if (this.activeItem) {
			this.activeItem.handleEvent(e);
		}
		e.stopPropagation();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	handleKeyNavigation : function (e) {
		var goPrev = function () {
				var prevIndex = this.indexOf(this.activeItem) - 1;

				while (prevIndex >= 0 && (
						!this.items[prevIndex].getEnabled()
						|| !this.items[prevIndex].getVisible()
						|| (this.items[prevIndex].getStyle() & gara.jswt.JSWT.SEPARATOR) === gara.jswt.JSWT.SEPARATOR)) {
					prevIndex--;
				}

				if (prevIndex >= 0) {
					this.activateItem(this.items[prevIndex]);
				}
			},

			goNext = function () {
				var nextIndex = this.indexOf(this.activeItem) + 1;

				while (nextIndex < this.items.length && (
						!this.items[nextIndex].getEnabled()
						|| !this.items[nextIndex].getVisible()
						|| (this.items[nextIndex].getStyle() & gara.jswt.JSWT.SEPARATOR) === gara.jswt.JSWT.SEPARATOR)) {
					nextIndex++;
				}

				if (nextIndex < this.items.length) {
					this.activateItem(this.items[nextIndex]);
				}
			},

			hasParentMenu = function () {
				return this.getParent() !== null
					&& this.getParent().getParent() !== null
					&& this.getParent().getParent() instanceof gara.jswt.widgets.Menu;
			};

		// MenuBar Navigation
		if ((this.style & gara.jswt.JSWT.BAR) === gara.jswt.JSWT.BAR) {

			switch (e.keyCode) {

				// left
				case gara.jswt.JSWT.ARROW_LEFT:
					goPrev.call(this);
					break;

				// right
				case gara.jswt.JSWT.ARROW_RIGHT:
					goNext.call(this);
					break;

				// down
				case gara.jswt.JSWT.ARROW_DOWN:
					if (this.activeItem && this.activeItem.getMenu() !== null) {
						this.menuBarDropDownShown = true;
						this.activeItem.getMenu().setVisible(true);
					}
					break;
			}
		}

		// Others
		else {
			switch (e.keyCode) {

				// up
				case gara.jswt.JSWT.ARROW_UP:
					goPrev.call(this);
					break;

				// down
				case gara.jswt.JSWT.ARROW_DOWN:
					goNext.call(this);
					break;

				// esc
				case gara.jswt.JSWT.ESC:
					this.setVisible(false);

					if (hasParentMenu.call(this) && (this.getParent().getParent().getStyle() & gara.jswt.JSWT.BAR) === gara.jswt.JSWT.BAR) {
						this.getParent().getParent().hideMenuBarDropDown();
					}
					break;

				// left
				case gara.jswt.JSWT.ARROW_LEFT:
					if (hasParentMenu.call(this) && (this.getParent().getParent().getStyle() & gara.jswt.JSWT.BAR) === gara.jswt.JSWT.BAR) {
						this.getParent().getParent().handleKeyNavigation(e);
					} else if (hasParentMenu.call(this)
							&& (this.getParent().getParent().getStyle() & gara.jswt.JSWT.BAR) !== gara.jswt.JSWT.BAR) {
						this.setVisible(false);
					}
					break;

				// right
				case gara.jswt.JSWT.ARROW_RIGHT:
					if (this.activeItem.getMenu() !== null) {
						this.activeItem.getMenu().setVisible(true);
					} else if(hasParentMenu.call(this) && (this.getParent().getParent().getStyle() & gara.jswt.JSWT.BAR) === gara.jswt.JSWT.BAR) {
						this.getParent().getParent().handleKeyNavigation(e);
					}
					break;
			}
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	hideMenuBarDropDown : function () {
		this.menuBarDropDownShown = false;
	},

	indexOf : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.MenuItem)) {
			throw new TypeError("item is not instance of gara.jswt.widgets.MenuItem");
		}

		return this.items.indexOf(item);
	},

	isVisible : function () {
		return this.visible;
	},

	removeMenuListener : function (listener) {
		this.checkWidget();
		this.menuListener.remove(listener);
	},

	setEnabled : function (enabled) {
		this.$super(enabled);
		this.handle.tabIndex = this.enabled && (style & gara.jswt.JSWT.BAR) === gara.jswt.JSWT.BAR ? 0 : -1;
		return this;
	},

	setLocation : function (x, y) {
		this.x = x;
		this.y = y;
		this.handle.style.top = this.y + "px";
		this.handle.style.left = this.x + "px";
		return this;
	},

	setVisible : function (visible, event) {
		this.checkWidget();
		this.visible = visible;
		this.handle.style.display = this.visible ? "block" : "none";

		if (visible) {
			if ((this.style & gara.jswt.JSWT.BAR) !== gara.jswt.JSWT.BAR) {
				if (this.items.length) {
					this.activateItem(this.items[0]);
				}
			}

			if ((this.style & gara.jswt.JSWT.POP_UP) === gara.jswt.JSWT.POP_UP) {
				gara.EventManager.addListener(document, "mousedown", this);
				if (this.parent instanceof gara.jswt.widgets.Control) {
					this.parent.addListener("mousedown", this);
				}
			}

			this.menuListeners.forEach(function (listener, index, arr) {
				if (listener.menuShown) {
					listener.menuShown(this);
				}
			}, this);
		} else {
			if ((this.style & gara.jswt.JSWT.POP_UP) === gara.jswt.JSWT.POP_UP) {
				gara.EventManager.removeListener(document, "mousedown", this);
				if (this.parent instanceof gara.jswt.widgets.Control) {
					this.parent.removeListener("mousedown", this);
				}
			}

			this.items.forEach(function (item) {
				if (item.getMenu() !== null) {
					item.getMenu().setVisible(false);
				}
			}, this);

			this.menuListeners.forEach(function (listener, index, arr) {
				if (listener.menuHidden) {
					listener.menuHidden(this);
				}
			}, this);
		}

		return this;
	},

	/**
	 * @method Unregister listeners for this widget. Implementation for
	 *         gara.jswt.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	unbindListener : function (eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	},

	update : function () {
		this.checkWidget();

		if (!this.handle) {
			this.create();
		}

		// update items
		this.items.forEach(function (item) {
			item.update();
		}, this);
	}
})});