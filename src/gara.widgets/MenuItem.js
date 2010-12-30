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

gara.provide("gara.widgets.MenuItem", "gara.widgets.Item");

gara.use("gara.widgets.Menu");

/**
 * gara MenuItem Widget
 *
 * @class gara.widgets.MenuItem
 * @extends gara.widgets.Item
 */
gara.Class("gara.widgets.MenuItem", function() { return /** @lends gara.widgets.MenuItem# */ {
	$extends : gara.widgets.Item,

	/**
	 * Holds the enabled state.
	 *
	 * @private
	 * @type {boolean}
	 */
	enabled : true,

	/**
	 * Seperator DOM reference
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	hr : null,

	/**
	 * Image DOM reference
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	img : null,

	/**
	 * Contains a submenu.
	 *
	 * @private
	 * @type {gara.widgets.Menu}
	 */
	menu : null,

	/**
	 * Holds the selected state.
	 *
	 * @private
	 * @type {boolean}
	 */
	selected : false,

	/**
	 * Contains a collection of selection listeners, that will be notified
	 * when the selection changes
	 *
	 * @private
	 * @type {gara.events.SelectionListener[]}
	 */
	selectionListeners : [],

	/**
	 * Span DOM reference
	 *
	 * @private
	 * @type {}
	 */
	span : null,

	/**
	 * Span text DOM reference
	 *
	 * @private
	 * @type {}
	 */
	spanText : null,

	/**
	 * Holds the visibility state.
	 *
	 * @private
	 * @type {boolean}
	 */
	visible : true,

	/**
	 * Creates a new menu item.
	 * @constructs
	 * @extends gara.widgets.Item
	 * @param {gara.widgets.Menu} parent
	 * @param {int} style the style for the menu item (optional)
	 * @param {int} index the index at where to insert this item (optional)
	 */
	$constructor : function (parent, style, index) {
		var w, h;
		if (!(parent instanceof gara.widgets.Menu)) {
			throw new TypeError("parent is not type of gara.widgets.Menu");
		}
		this.$super(parent, style);
		this.parentNode = this.parent.addItem(this, index);

		this.span = null;
		this.spanText = null;
		this.img = null;
		this.hr = null;

		this.selectionListeners = [];

		this.menu = null;
		this.enabled = true;
		this.visible = true;
		this.selected = false;

//		w = this.parent.handle.offsetWidth;
//		h = this.parent.handle.offsetHeight;
		
		this.createWidget();
		
//		console.log("MenuItem() h: " + h + " " + this.parent.handle.offsetHeight);
//		if (w !== this.parent.handle.offsetWidth || h !== this.parent.handle.offsetHeight) {
//			this.parent.notifyResizeListener();
//		}
	},

	/**
	 * Adds the listener to the collection of listeners who will be notified 
	 * when the user changes the receiver's selection, by sending it one of 
	 * the messages defined in the <code>SelectionListener</code> interface. 
	 *
	 * @param {gara.events.SelectionListener} listener the listener which should be notified when the user changes the receiver's selection 
	 * @returns {gara.widgets.MenuItem} this
	 */
	addSelectionListener : function (listener) {
		this.checkWidget();
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListeners.add(listener);
		}
		return this;
	},

	/**
	 * Register listeners for this widget. Implementation for gara.Widget
	 *
	 * @private
	 * @returns {void}
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	/**
	 * Creates the HTML.
	 *
	 * @private
	 */
	createWidget : function () {
		var index, nextNode, button, door;

		this.handle = document.createElement("li");
		this.handle.widget = this;
		this.handle.control = this.parent;
		this.handle.className = this.classes.join(" ");
		this.handle.style.display = this.visible ? "block" : "none";
		this.handle.setAttribute("id", this.getId());
		this.handle.setAttribute("role", "menuitem");
		this.handle.setAttribute("aria-disabled", !this.enabled);
		this.handle.setAttribute("aria-labelledby", this.getId() + "-label");
		this.addClass("garaMenuItem");
		
		if ((this.style & gara.SEPARATOR) === gara.SEPARATOR) {
			this.addClass("garaMenuItemSeparator");
			if ((this.parent.getStyle() & gara.BAR) !== gara.BAR) {
				this.hr = document.createElement("hr");
				this.hr.className = "garaMenuItemSeparatorLine";
				this.handle.appendChild(this.hr);
				this.handle.setAttribute("aria-disabled", true);
			}
		} else {
			if ((this.style & gara.RADIO) === gara.RADIO) {
				this.handle.setAttribute("role", "menuitemradio");
			}

			if ((this.style & gara.CHECK) === gara.CHECK) {
				this.handle.setAttribute("role", "menuitemcheckbox");
			}

			if ((this.style & gara.RADIO) === gara.RADIO
					|| (this.style & gara.CHECK) === gara.CHECK) {
				this.handle.setAttribute("aria-checked", this.selected);
			}

			button = document.createElement("span");
			button.className = "garaMenuItemButton";
			button.widget = this;
			button.control = this.parent;
			button.setAttribute("role", "presentation");

			door = document.createElement("span");
			door.className = "garaMenuItemDoor";
			door.widget = this;
			door.control = this.parent;
			door.setAttribute("role", "presentation");

			// create image node
			this.img = document.createElement("img");
			this.img.id = this.getId() + "-image";
			this.img.widget = this;
			this.img.control = this.parent;
			this.img.className = "garaMenuItemImage garaItemImage";
			this.img.setAttribute("role", "presentation");

			// set image
			if (this.image !== null) {
				this.img.src = this.image.src;
			} else {
				this.img.style.display = "none";
			}

			// create text node
			this.spanText = document.createTextNode(this.text);
			this.span = document.createElement("span");
			this.span.id = this.getId() + "-label";
			this.span.role = "presentation";
			this.span.widget = this;
			this.span.control = this.parent;
			this.span.className = "garaMenuItemText garaItemText";
			this.span.appendChild(this.spanText);
			this.span.setAttribute("role", "presentation");

			door.appendChild(this.img);
			door.appendChild(this.span);
			button.appendChild(door);

			this.handle.appendChild(button);
			this.handle.setAttribute("aria-haspopup", ((this.style & gara.CASCADE) === gara.CASCADE) && this.menu !== null);

			// css
			this.setClass("garaMenuItemCascade", ((this.style & gara.CASCADE) === gara.CASCADE) && this.menu !== null);
			this.setClass("garaMenuItemCheck", (this.style & gara.CHECK) === gara.CHECK);
			this.setClass("garaMenuItemRadio", (this.style & gara.RADIO) === gara.RADIO);
		}

		// add to dom tree
		index = this.parent.indexOf(this);
		nextNode = index === 0
			? this.parentNode.firstChild
			: this.parent.getItems()[index - 1].handle.nextSibling;

		if (!nextNode) {
			this.parentNode.appendChild(this.handle);
		} else {
			this.parentNode.insertBefore(this.handle, nextNode);
		}
	},

	/**
	 * Destroys the menu item.
	 * 
	 * @private
	 * @returns {void}
	 */
	destroyWidget: function () {
		this.parent.releaseItem(this);
		
		if (this.menu !== null) {
			this.menu.release();
		}
		
		this.span = null;
		this.spanText = null;
		this.img = null;
		this.hr = null;
		this.menu = null;
		this.selectionListeners = null;
		
		this.$super();
	},

	/**
	 * Returns <code>true</code> if the receiver is enabled, and <code>false</code> otherwise.
	 *
	 * @returns {boolean} the receiver's enabled state
	 */
	getEnabled : function () {
		return this.enabled;
	},

	/**
	 * Returns a submenu for this menu item or <code>null</code> if it has none.
	 * 
	 * @returns {gara.widgets.Menu} the item's submenu 
	 */
	getMenu : function () {
		return this.menu;
	},

//	getParent : function () {
//		return this.parent;
//	},

	/**
	 * Returns <code>true</code> if the receiver is selected, and <code>false</code> otherwise.
	 *
	 * @returns {boolean} the receiver's selection state
	 */
	getSelection : function () {
		return this.selected;
	},

	/**
	 * Returns the receiver's visibility.
	 * 
	 * @returns {boolean} true if visible
	 */
	getVisible : function () {
		return this.visible;
	},

	/**
	 * Handles events for the menu item.
	 * @param {Event} e
	 * @returns {void}
	 */
	handleEvent : function (e) {
		if ((this.style & gara.SEPARATOR) !== gara.SEPARATOR) {
			switch (e.type) {
			case "mousedown":
				this.handle.setAttribute("aria-pressed", true);
				break;
			case "mouseup":
				this.handle.setAttribute("aria-pressed", false);
				break;
			}
//			if (this.menu !== null && this.menu.getVisible()) {
//				this.menu.handleEvent(e);
//			}
		}
	},

	/**
	 * 
	 * Removes the listener from the collection of listeners who will be notified 
	 * when the user changes the receiver's selection. 
	 *
	 * @param {gara.widgets.SelectionListener} listener the listener which should no longer be notified 
	 * @return {gara.widgets.MenuItem} this
	 */
	removeSelectionListener : function (listener) {
		this.checkWidget();
		this.selectionListeners.remove(listener);
		return this;
	},

	/**
	 * Sets the receiver's enabled state.
	 *
	 * @param {boolean} enabled true for enabled and false for disabled state
	 * @returns {gara.widgets.MenuItem} this
	 */
	setEnabled : function (enabled) {
		this.enabled = enabled;
		if (this.handle !== null) {
			this.handle.setAttribute("aria-disabled", !this.enabled);
		}

		return this;
	},

	/**
	 * Sets the image for the item.
	 *
	 * @param {Image} image the new image
	 * @returns {gara.widgets.MenuItem} this
	 */
	setImage : function (image) {
		this.$super(image);

		// update image
		if (image !== null) {
			this.img.src = image.src;
			this.img.style.display = "";
		}

		// hide image
		else {
			this.img.src = "";
			this.img.style.display = "none";
		}
		return this;
	},

	/**
	 * Sets a submenu for the menu item.
	 * 
	 * @param {gara.widgets.Menu} menu the new submenu
	 * @returns {gara.widgets.MenuItem} this
	 */
	setMenu : function (menu) {
		this.checkWidget();
		if (!(menu instanceof gara.widgets.Menu)) {
			throw new TypeError("menu is not instance of gara.widgets.Menu");
		}

		this.menu = menu;
		this.setClass("garaMenuItemCascade", ((this.style & gara.CASCADE) === gara.CASCADE) && this.menu !== null);
		this.menu.update();
		this.handle.setAttribute("aria-haspopup", ((this.style & gara.CASCADE) === gara.CASCADE) && this.menu !== null);

		return this;
	},

	/**
	 * Sets the receiver's selected state.
	 * 
	 * @param {boolean} selected <code>true</code> for selected and <code>false</code> otherwise
	 */
	setSelection : function (selected) {
		// select when enabled and either radio or check type
		if (this.enabled) {
			var e = {
				item : this,
				widget : this.parent
			}, pos, i;

			if (((this.style & gara.RADIO) === gara.RADIO
					|| (this.style & gara.CHECK) === gara.CHECK)) {
				this.selected = selected;
				this.handle.setAttribute("aria-checked", this.selected);
			}

			if ((this.style & gara.RADIO) === gara.RADIO) {
				if (!this.parent.managingRadioChecks) {
					this.parent.managingRadioChecks = true;
					pos = this.parent.indexOf(this);

					// removing selection upwards
					i = pos - 1;
					while (i >= 0 && (this.parent.getItem(i).getStyle() & gara.RADIO) === gara.RADIO) {
						this.parent.getItem(i--).setSelection(false);
					}

					// removing selection downwards
					i = pos + 1;
					while (i < this.parent.getItems().length && (this.parent.getItem(i).getStyle() & gara.RADIO) === gara.RADIO) {
						this.parent.getItem(i++).setSelection(false);
					}
					this.parent.managingRadioChecks = false;
				}
			}

			// notify selection listener
			this.selectionListeners.forEach(function (listener, index, arr) {
				if (listener.widgetSelected) {
					listener.widgetSelected(e);
				}
			}, this);
		}

		return this;
	},

	/**
	 * Sets the text for the item.
	 *
	 * @param {String} text the new text
	 * @returns {gara.widgets.MenuItem} this
	 */
	setText : function (text) {
		this.$super(text);

		if (this.handle && (this.style & gara.SEPARATOR) !== gara.SEPARATOR) {
			this.spanText.nodeValue = this.text;
		}
		return this;
	},

	/**
	 * Sets the receiver's visibility.
	 * 
	 * @param {boolean} visible <code>true</code> for visible or <code>false</code> for invisible
	 * @returns {gara.widgets.MenuItem} this
	 */
	setVisible : function (visible) {
		this.visible = visible;
		this.changed = true;
		this.handle.style.display = this.visible ? "block" : "none";

		return this;
	},

	/**
	 * 
	 * Unregister listeners for this widget. Implementation for gara.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
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
			this.createWidget();
		}

		// update sub menu
		if (this.menu !== null) {
			this.menu.update();
		}
	}
};});