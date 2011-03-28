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

gara.provide("gara.widgets.Menu", "gara.widgets.Control");

gara.use("gara.widgets.Decorations");
gara.use("gara.widgets.MenuItem");

/**
 * gara Menu Widget
 *
 * @class gara.widgets.Menu
 * @extends gara.widgets.Control
 */
gara.Class("gara.widgets.Menu", function() { return /** @lends gara.widgets.Menu# */ {
	$extends : gara.widgets.Control,


	/**
	 * 
	 * Contains the current active item.
	 *
	 * @private
	 * @type {gara.widgets.MenuItem}
	 */
	activeItem : null,

	/**
	 * 
	 * Holds the enabled state.
	 *
	 * @private
	 * @type {boolean}
	 */
	enabled : false,

	/**
	 * 
	 * Contains the <code>MenuItem</code>s.
	 *
	 * @private
	 * @type {gara.widgets.MenuItem[]}
	 */
	items : [],

	/**
	 * 
	 * A reminder, if the a drop down menu of a menu bar is shown.
	 *
	 * @private
	 * @type {boolean}
	 */
	menuBarDropDownShown : false,
	
	/**
	 * 
	 * A reminder, if the a drop down menu of a tool bar is shown.
	 *
	 * @private
	 * @type {boolean}
	 */
	toolBarDropDownShown : false,

	/**
	 * 
	 * Contains a collection of listeners, that will be notified when the
	 * visibility of the <code>Menu</code> changes.
	 *
	 * @private
	 * @type {}
	 */
	menuListeners : [],

	/**
	 * 
	 * X position of the location.
	 *
	 * @private
	 * @type {int}
	 */
	x : 0,

	/**
	 * 
	 * Y position of the location.
	 *
	 * @private
	 * @type {int}
	 */
	y : 0,

	/**
	 * @constructs
	 * @extends gara.widgets.Control
	 * @param {gara.widgets.Control|gara.widgets.MenuItem|gara.widgets.Composite|HTMLElement} parent
	 * @param {int} style
	 */
	$constructor : function (parent, style) {
		// style
		if (parent instanceof gara.widgets.MenuItem
				&& (parent.getStyle() & gara.CASCADE) !== gara.CASCADE) {
			throw new TypeError("parent has no gara.CASCADE style!");
		}

		if (parent instanceof gara.widgets.Control) {
			style |= gara.POP_UP;
		}

		if (parent instanceof gara.widgets.MenuItem) {
			style |= gara.DROP_DOWN;
		}

		style = gara.widgets.Menu.checkStyle(style);

		// private members
		this.items = [];
		this.menuListeners = [];
		this.activeItem = null;

		// location
		this.x = 0;
		this.y = 0;

		// flags
		this.enabled = false;
		this.menuBarDropDownShown = false;
		this.toolBarDropDownShown = false;

		this.$super(parent, style);
		this.addFocusListener(this);
	},


	/**
	 * Register listeners for this widget. Implementation for gara.Widget.
	 *
	 * @private
	 * @returns {void}
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	/**
	 * Activates a menu item.
	 *
	 * @private
	 * @param {gara.widgets.MenuItem} item
	 * @returns {void}
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
		
//		if (/*(this.activeItem.getParent().getStyle() & gara.TOOLBAR) !== gara.TOOLBAR
//				|| */(this.event !== null && this.event.type && (
//					this.event.type === "keydown" || this.event.type === "keyup"
//					|| this.event.type === "keypress" || this.event.type === "focus"))) {
//			console.log("Menu.activateItem, setActive: " + this.activeItem.getText());
			this.activeItem.setActive(true);
//		}

		menu = this.activeItem.getMenu();
		if ((this.style & gara.TOOLBAR) !== 0 && this.toolBarDropDownShown && menu !== null) {
			menu.setVisible(true);
		}
		
		if ((this.style & gara.TOOLBAR) === 0 
				&& (this.style & gara.BAR) !== 0
				&& this.menuBarDropDownShown 
				&& menu !== null) {
			menu.setVisible(true);
		}
	},

	/**
	 * Adds a menu item to the menu. Optionally at a given index.
	 *
	 * @private
	 * @param {gara.widgets.MenuItem} item
	 * @param {int} index
	 * @returns {HTMLElement} menu handle
	 */
	addItem : function (item, index) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.MenuItem)) {
			throw new TypeError("item is not instance of gara.widgets.MenuItem");
		}

		index = index || this.items.length;
		this.items.insertAt(index, item);

		return this.handle;
	},

	/**
	 * Adds the listener to the collection of listeners who will be notified 
	 * when menus are hidden or shown, by sending it one of the messages defined 
	 * in the <code>MenuListener</code> interface. 
	 * 
	 * @param {gara.events.MenuListener} listener the listener which should be notified 
	 * @returns {gara.widgets.Menu} this
	 */
	addMenuListener : function (listener) {
		this.checkWidget();
		if (!this.menuListeners.contains(listener)) {
			this.menuListeners.add(listener);
		}
		return this;
	},

	/**
	 * Checks the style of the menu and clears inconsistencies.
	 * 
	 * @static
	 * @function
	 * @param {int} style
	 * @returns {int} new style
	 */
	checkStyle : gara.$static(function (style) {
		if ((style & gara.TOOLBAR) !== 0) {
			style |= gara.BAR;
		}

		style = gara.widgets.Widget.checkBits(style, gara.BAR, gara.POP_UP, gara.DROP_DOWN);

		if (style === 0) {
			style = gara.BAR;
		}

		return style;
	}),

	/**
	 * Creates the HTML.
	 * 
	 * @private
	 * @returns {void}
	 */
	createWidget : function () {
		this.visible = (this.style & gara.BAR) !== 0; // bar === true
		this.createHandle("ul", true);
		this.handle.style.display = this.visible ? "block" : "none";
		this.handle.setAttribute("id", this.getId());
		this.handle.setAttribute("role", "menu");

		// css
		this.addClass("garaMenu");

		// listener
		if (!(this.parent instanceof gara.widgets.MenuItem)) {
			this.addListener("mouseover", this);
			this.addListener("mouseout", this);
			this.addListener("mouseup", this);
			this.addListener("mousedown", this);
		}

		if ((this.style & gara.BAR) !== 0) {
			this.addClass("garaMenuBar");
//			this.parentNode = this.parent;
			this.handle.setAttribute("role", "menubar");

			gara.addEventListener(document, "mousedown", this);
			//gara.addEventListener(document, "mouseup", this);

			if ((this.style & gara.TOOLBAR) !== 0) {
				this.addClass("garaToolbar");
			}

//			if (this.parent instanceof gara.widgets.Composite) {
//				this.parentNode = this.parent.handle;
//			}
		}

		if ((this.style & gara.POP_UP) !== 0) {
			this.addClass("garaMenuPopUp");
			this.handle.tabIndex = -1;
			this.handle.style.position = "absolute";
			this.handle.style.top = this.y + "px";
			this.handle.style.left = this.x + "px";
			this.parentNode = document.getElementsByTagName("body")[0];
		}

		if ((this.style & gara.DROP_DOWN) !== 0) {
			this.addClass("garaMenuDropDown");
			this.handle.tabIndex = -1;
			this.handle.style.position = "absolute";
			this.parentNode = this.parent.handle;
		}

		this.parentNode.appendChild(this.handle);
	},
	
	/**
	 * Destroys the menu.
	 *
	 * @private
	 * @returns {void}
	 */
	destroyWidget : function () {
		this.menuListeners = null;
		this.activeItem = null;
		this.items = null;

		this.$super();
	},

	/**
	 * Focus gained handler for this menu.
	 * 
	 * @private
	 * @param {Event} e
	 * @returns {void}
	 */
	focusGained : function (e) {
		this.menuBarDropDownShown = false;
		this.toolBarDropDownShown = false;
		this.event = e;
		if (this.items.length && this.activeItem === null) {
			if (e.target && e.target.widget && e.target.widget instanceof gara.widgets.MenuItem
					&& e.target.widget.getParent() === this) {
				this.activateItem(e.target.widget);
			} else {
				this.activateItem(this.items[0]);
			}
		}
	},

	/**
	 * Focus lost handler for this menu.
	 * 
	 * @private
	 * @param {Event} e
	 * @returns {void}
	 */
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
	},

	/**
	 * Returns the item at the given, zero-relative index in the receiver.
	 * 
	 * @description
	 * Returns the item at the given, zero-relative index in the receiver. 
	 * Throws an exception if the index is out of range. 
	 * 
	 * @param {int} index the index of the item to return
	 * @throws {RangeError} when the given index is out of bounds
	 * @returns {gara.widgets.MenuItem} the item at the given index
	 */
	getItem : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) === "undefined") {
			throw new RangeError("There is no item for the given index");
		}

		return this.items[index];
	},

	/**
	 * Returns the number of items contained in the receiver.
	 * 
	 * @returns {int} the number of items
	 */
	getItemCount : function () {
		return this.items.length;
	},

	/**
	 * Returns a (possibly empty) array of <code>MenuItem</code>s which are the items in the receiver. 
	 * 
	 * @returns {gara.widgets.MenuItem[]} the items in the receiver 
	 */
	getItems : function () {
		return this.items;
	},

	
//	getParent : function () {
//		return this.parent;
//	},

	/**
	 * Returns the receiver's parent item, which must be a <code>MenuItem</code> or <code>null</code>
	 * when the receiver is a root.
	 * 
	 * @returns {gara.widgets.MenuItem} the receiver's parent item
	 */
	getParentItem : function () {
		return this.parent;
	},

	/**
	 * 
	 *
	 * @private
	 */
	handleEvent : function (e) {
		var item, invokeItem, activeItem, parent, invokedSubitem;
		this.checkWidget();
		e.widget = this;
		this.event = e;
		invokeItem = function (item) {
			var parent = item;
			item.setSelection((item.getStyle() & gara.RADIO) === gara.RADIO ? true : !item.getSelection());

			// setting child menus invisible
			while (parent.getParent() !== null
					&& (
						(parent.getParent() instanceof gara.widgets.Menu
							&& (parent.getParent().getStyle() & gara.BAR) !== gara.BAR)
						|| parent.getParent() instanceof gara.widgets.MenuItem
					)) {
				parent = parent.getParent();

				if (parent instanceof gara.widgets.Menu) {
					parent.setVisible(false);
				}
			}

			if (parent.getParent() !== null
					&& parent.getParent() instanceof gara.widgets.Menu
					&& (parent.getParent().getStyle() & gara.BAR) === gara.BAR) {
				parent.getParent().hideMenuBarDropDown();
			}

			// blurring menubar
			if (item.getParent() !== null
					&& (item.getParent().getStyle() & gara.BAR) === gara.BAR
					&& item.getParent() === this
					&& this.isFocusControl()) {
				item.getParent().handle.blur();
			}
		};

		switch (e.type) {
		case "mousedown":
			if (e.target.widget
					&& e.target.widget instanceof gara.widgets.MenuItem
					&& e.target.widget.getParent() === this
					&& (this.getStyle() & gara.BAR) === gara.BAR) {
				this.activateItem(e.target.widget);
				if (e.target.widget.getMenu() !== null) {
					e.target.widget.getMenu().setVisible(true);
				}
			}

			// focus lost on pop up
			if ((e.target.widget ? e.target.widget !== this : true)
					&& (this.getStyle() & gara.POP_UP) === gara.POP_UP
					&& !(e.target.widget instanceof gara.widgets.MenuItem)) {
				this.setVisible(false);
			}

			// focus lost on bar
			else if ((e.target.widget ? e.target.widget !== this
						&& e.target.widget.getParent() !== this : true)
					&& (this.getStyle() & gara.BAR) === gara.BAR) {
				
				if (this.activeItem) {
					if (e.target.widget
							&& (e.target.widget instanceof gara.widgets.Menu
								|| e.target.widget instanceof gara.widgets.MenuItem)) {
						parent = e.target.widget;

						while (parent.getParent() !== null
								&& (parent.getParent() instanceof gara.widgets.Menu
									|| parent.getParent() instanceof gara.widgets.MenuItem)
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
					&& (e.target.widget instanceof gara.widgets.MenuItem
						|| e.target.widget instanceof gara.widgets.Menu
						|| this.activeItem !== null))) {

				activeItem = e.target.widget instanceof gara.widgets.MenuItem
					? e.target.widget
					: (e.target.widget.activeItem !== null
						? e.target.widget.activeItem
						: this.activeItem);

				if (typeof (activeItem) !== "undefined" && activeItem !== null) {
					invokeItem(activeItem);
				}
			}
			break;

		case "mouseover":
			if (e.target.widget
					&& e.target.widget instanceof gara.widgets.MenuItem
					&& (e.target.widget.getStyle() & gara.SEPARATOR) !== gara.SEPARATOR) {
				item = e.target.widget;
				if (item.getParent() === this && item.getEnabled()) {
					this.activateItem(e.target.widget);
					if (this.activeItem.getMenu() !== null
							&& ((this.style & gara.BAR) === gara.BAR ? this.isFocusControl() : true)) {
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
					&& !this.isFocusControl()
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
				if (e.keyCode === gara.ENTER) {
					invokeItem(this.activeItem);
				}
				if (e.keyCode === gara.ESC) {
					e.preventShellClose = true;
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
	 * 
	 *
	 * @private
	 */
	handleKeyNavigation : function (e) {
		var goPrev = function () {
				var prevIndex = this.indexOf(this.activeItem) - 1;

				while (prevIndex >= 0 && (
						!this.items[prevIndex].getEnabled()
						|| !this.items[prevIndex].getVisible()
						|| (this.items[prevIndex].getStyle() & gara.SEPARATOR) === gara.SEPARATOR)) {
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
						|| (this.items[nextIndex].getStyle() & gara.SEPARATOR) === gara.SEPARATOR)) {
					nextIndex++;
				}

				if (nextIndex < this.items.length) {
					this.activateItem(this.items[nextIndex]);
				}
			},

			hasParentMenu = function () {
				return this.getParent() !== null
					&& this.getParent().getParent() !== null
					&& this.getParent().getParent() instanceof gara.widgets.Menu;
			};

		// MenuBar Navigation
		if ((this.style & gara.BAR) === gara.BAR) {

			switch (e.keyCode) {

				// left
				case gara.ARROW_LEFT:
					goPrev.call(this);
					break;

				// right
				case gara.ARROW_RIGHT:
					goNext.call(this);
					break;

				// down
				case gara.ARROW_DOWN:
					if (this.activeItem && this.activeItem.getMenu() !== null) {
						this.menuBarDropDownShown = true;
						this.toolBarDropDownShown = true;
						this.activeItem.getMenu().setVisible(true);
					}
					break;
			}
		}

		// Others
		else {
			switch (e.keyCode) {

				// up
				case gara.ARROW_UP:
					goPrev.call(this);
					break;

				// down
				case gara.ARROW_DOWN:
					goNext.call(this);
					break;

				// esc
				case gara.ESC:
					this.setVisible(false);

					if (hasParentMenu.call(this) && (this.getParent().getParent().getStyle() & gara.BAR) === gara.BAR) {
						this.getParent().getParent().hideMenuBarDropDown();
					}
					break;

				// left
				case gara.ARROW_LEFT:
					if (hasParentMenu.call(this) && (this.getParent().getParent().getStyle() & gara.BAR) === gara.BAR) {
						this.getParent().getParent().handleKeyNavigation(e);
					} else if (hasParentMenu.call(this)
							&& (this.getParent().getParent().getStyle() & gara.BAR) !== gara.BAR) {
						this.setVisible(false);
					}
					break;

				// right
				case gara.ARROW_RIGHT:
					if (this.activeItem.getMenu() !== null) {
						this.activeItem.getMenu().setVisible(true);
					} else if(hasParentMenu.call(this) && (this.getParent().getParent().getStyle() & gara.BAR) === gara.BAR) {
						this.getParent().getParent().handleKeyNavigation(e);
					}
					break;
			}
		}
	},

	/**
	 * 
	 *
	 * @private
	 */
	hideMenuBarDropDown : function () {
		this.menuBarDropDownShown = false;
		this.toolBarDropDownShown = false;
	},

	/**
	 * Searches the receiver's list starting at the first item (index 0) until an item is found 
	 * that is equal to the argument, and returns the index of that item. If no item is 
	 * found, returns -1. 
	 * 
	 * @param {gara.widgets.MenuItem} item the search item
	 * @returns {int} the index of the item
	 */
	indexOf : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.MenuItem)) {
			throw new TypeError("item is not instance of gara.widgets.MenuItem");
		}

		return this.items.indexOf(item);
	},

//	isVisible : function () {
//		return this.visible;
//	},
	
	/**
	 * Releases all children from the receiver
	 *
	 * @private
	 * @returns {void}
	 */
	releaseChildren : function () {
		this.items.forEach(function (item) {
			item.release();
		}, this);
		
		this.$super();
	},
	
	/**
	 * Releases an item from the receiver
	 *
	 * @private
	 * @param {gara.widgets.MenuItem} item the item that should removed from the receiver
	 * @returns {void}
	 */
	releaseItem : function (item) {
		if (this.items.contains(item)) {
			this.handle.removeChild(item.handle);
			this.items.remove(item);
		}
	},

	/**
	 * Removes the listener from the collection of listeners who will be notified when the 
	 * menu events are generated for the control.
	 * 
	 * @param {gara.events.MenuListener} listener the listener which should no longer be notified 
	 * @return {gara.widgets.Menu} this
	 */
	removeMenuListener : function (listener) {
		this.checkWidget();
		this.menuListeners.remove(listener);
		return this;
	},

	/**
	 * Sets the receiver's enabled state.
	 *
	 * @param {boolean} enabled true for enabled and false for disabled state
	 * @returns {gara.widgets.Control} this
	 */
	setEnabled : function (enabled) {
		this.$super(enabled);
		this.handle.tabIndex = this.enabled && (this.style & gara.BAR) !== 0 ? 0 : -1;
		return this;
	},

	/**
	 * Sets the receiver's location.
	 * 
	 * @param {int} x the new left offset
	 * @param {int} y the new top offset
	 * @returns {gara.widgets.Control} this
	 */
	setLocation : function (x, y) {
		this.x = x;
		this.y = y;
		this.handle.style.top = this.y + "px";
		this.handle.style.left = this.x + "px";
		return this;
	},

	/**
	 * Sets the receiver's visibility.
	 * 
	 * @param {boolean} visible true for visible or false for invisible
	 * @returns {gara.widgets.Control} this
	 */
	setVisible : function (visible, event) {
		this.checkWidget();
		this.visible = visible;
		this.handle.style.display = this.visible ? "block" : "none";

		if (visible) {
			if ((this.style & gara.BAR) !== gara.BAR) {
				if (this.items.length) {
					this.activateItem(this.items[0]);
				}
			}

			if ((this.style & gara.POP_UP) === gara.POP_UP) {
				gara.addEventListener(document, "mousedown", this);
				if (this.parent instanceof gara.widgets.Control) {
					this.parent.addListener("mousedown", this);
				}
			}

			this.menuListeners.forEach(function (listener) {
				if (listener.menuShown) {
					listener.menuShown(this);
				}
			}, this);
		} else {
			if ((this.style & gara.POP_UP) === gara.POP_UP) {
				gara.removeEventListener(document, "mousedown", this);
				if (this.parent instanceof gara.widgets.Control) {
					this.parent.removeListener("mousedown", this);
				}
			}

			this.items.forEach(function (item) {
				if (item.getMenu() !== null) {
					item.getMenu().setVisible(false);
				}
			}, this);

			this.menuListeners.forEach(function (listener) {
				if (listener.menuHidden) {
					listener.menuHidden(this);
				}
			}, this);
		}

		return this;
	},

	/**
	 * Unregister listeners for this widget. Implementation for gara.Widget
	 *
	 * @private
	 * @returns {void}
	 */
	unbindListener : function (eventType, listener) {
		gara.removeEventListener(this.handle, eventType, listener);
	},

	/**
	 * Handles outstanding updates.
	 * 
	 * @returns {void}
	 */
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
};});