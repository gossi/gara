/*	$Id: MenuItem.class.js 181 2009-08-02 20:51:16Z tgossmann $

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

gara.provide("gara.jswt.widgets.MenuItem", "gara.jswt.widgets.Item");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");
//gara.use("gara.jswt.widgets.Menu");

/**
 * @summary
 * gara MenuItem Widget
 *
 * @description
 * long description for the MenuItem Widget...
 *
 * @class MenuItem
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Item
 */
gara.Class("gara.jswt.widgets.MenuItem", function() { return {
	$extends : gara.jswt.widgets.Item,

	/**
	 * @field
	 * Holds the enabled state.
	 *
	 * @private
	 * @type {boolean}
	 */
	enabled : true,

	/**
	 * @field
	 * Seperator DOM reference
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	hr : null,

	/**
	 * @field
	 * Image DOM reference
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	img : null,

	/**
	 * @field
	 * Contains a submenu.
	 *
	 * @private
	 * @type {gara.jswt.widgets.Menu}
	 */
	menu : null,

	/**
	 * @field
	 * Holds the selected state.
	 *
	 * @private
	 * @type {boolean}
	 */
	selected : false,

	/**
	 * @field
	 * Contains a collection of selection listeners, that will be notified
	 * when the selection changes
	 *
	 * @private
	 * @type {gara.jswt.events.SelectionListener[]}
	 */
	selectionListeners : [],

	/**
	 * @field
	 * Span DOM reference
	 *
	 * @private
	 * @type {}
	 */
	span : null,

	/**
	 * @field
	 * Span text DOM reference
	 *
	 * @private
	 * @type {}
	 */
	spanText : null,

	/**
	 * @field
	 * Holds the visibility state.
	 *
	 * @private
	 * @type {boolean}
	 */
	visible : true,

	$constructor : function (parent, style, index) {
		if (!(parent instanceof gara.jswt.widgets.Menu)) {
			throw new TypeError("parent is not type of gara.jswt.widgets.Menu");
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

		this.createWidget();
	},

	/**
	 * @method
	 * Adds a selection listener on the MenuItem
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the desired listener to be added to this menuitem
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function (listener) {
		this.checkWidget();
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListeners.push(listener);
		}
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.Widget
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
		if ((this.style & gara.jswt.JSWT.SEPARATOR) === gara.jswt.JSWT.SEPARATOR) {
			this.handle.className = "jsWTMenuItemSeparator";
			if ((this.parent.getStyle() & gara.jswt.JSWT.BAR) !== gara.jswt.JSWT.BAR) {
				this.hr = document.createElement("hr");
				this.handle.appendChild(this.hr);
				this.handle.setAttribute("aria-disabled", true);
			}
		} else {
			if ((this.style & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO) {
				this.handle.setAttribute("role", "menuitemradio");
			}

			if ((this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK) {
				this.handle.setAttribute("role", "menuitemcheckbox");
			}

			if ((this.style & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO
					|| (this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK) {
				this.handle.setAttribute("aria-checked", this.selected);
			}

			button = document.createElement("span");
			button.className = "button";
			button.widget = this;
			button.control = this.parent;
			button.setAttribute("role", "presentation");

			door = document.createElement("span");
			door.className = "door";
			door.widget = this;
			door.control = this.parent;
			door.setAttribute("role", "presentation");

			// create image node
			this.img = document.createElement("img");
			this.img.id = this.getId() + "-image";
			this.img.widget = this;
			this.img.control = this.parent;
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
			this.span.className = "text";
			this.span.appendChild(this.spanText);
			this.span.setAttribute("role", "presentation");

			door.appendChild(this.img);
			door.appendChild(this.span);
			button.appendChild(door);

			this.handle.appendChild(button);
			this.handle.setAttribute("aria-haspopup", ((this.style & gara.jswt.JSWT.CASCADE) === gara.jswt.JSWT.CASCADE) && this.menu !== null);

			// css
			this.setClass("jsWTMenuItemCascade", ((this.style & gara.jswt.JSWT.CASCADE) === gara.jswt.JSWT.CASCADE) && this.menu !== null);
			this.setClass("jsWTMenuItemCheck", (this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK);
			this.setClass("jsWTMenuItemRadio", (this.style & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO);
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

	getEnabled : function () {
		return this.enabled;
	},

	getMenu : function () {
		return this.menu;
	},

	getParent : function () {
		return this.parent;
	},

	getSelection : function () {
		return this.selected;
	},

	getVisible : function () {
		return this.visible;
	},

	handleEvent : function (e) {
		if ((this.style & gara.jswt.JSWT.SEPARATOR) !== gara.jswt.JSWT.SEPARATOR) {
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
	 * @method
	 * Removes a selection listener from this MenuItem
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the listener to remove from this menuitem
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function (listener) {
		this.checkWidget();
		this.selectionListeners.remove(listener);
	},

	setEnabled : function (enabled) {
		this.enabled = enabled;
		if (this.handle !== null) {
			this.handle.setAttribute("aria-disabled", !this.enabled);
		}

		return this;
	},

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

	setMenu : function (menu) {
		this.checkWidget();
		if (!(menu instanceof gara.jswt.widgets.Menu)) {
			throw new TypeError("menu is not instance of gara.jswt.widgets.Menu");
		}

		this.menu = menu;
		this.setClass("jsWTMenuItemCascade", ((this.style & gara.jswt.JSWT.CASCADE) === gara.jswt.JSWT.CASCADE) && this.menu !== null);
		this.menu.update();
		this.handle.setAttribute("aria-haspopup", ((this.style & gara.jswt.JSWT.CASCADE) === gara.jswt.JSWT.CASCADE) && this.menu !== null);

		return this;
	},

	setSelection : function (selected) {
		// select when enabled and either radio or check type
		if (this.enabled) {
			var e = {
				item : this,
				widget : this.parent
			};

			if (((this.style & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO
					|| (this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK)) {
				this.selected = selected;
				this.handle.setAttribute("aria-checked", this.selected);
			}

			if ((this.style & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO) {
				if (!this.parent.managingRadioChecks) {
					this.parent.managingRadioChecks = true;
					var pos = this.parent.indexOf(this);

					// removing selection upwards
					var i = pos - 1;
					while (i >= 0 && (this.parent.getItem(i).getStyle() & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO) {
						this.parent.getItem(i--).setSelection(false);
					}

					// removing selection downwards
					i = pos + 1;
					while (i < this.parent.getItems().length && (this.parent.getItem(i).getStyle() & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO) {
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

	setText : function (text) {
		this.$super(text);

		if (this.handle && (this.style & gara.jswt.JSWT.SEPARATOR) !== gara.jswt.JSWT.SEPARATOR) {
			this.spanText.nodeValue = this.text;
		}
		return this;
	},

	setVisible : function (visible) {
		this.visible = visible;
		this.changed = true;
		this.handle.style.display = this.visible ? "block" : "none";

		return this;
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.widgets.Widget
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
			this.createWidget();
		}

		// update sub menu
		if (this.menu !== null) {
			this.menu.update();
		}
	}
};});