/*	$Id: TabItem.class.js 181 2009-08-02 20:51:16Z tgossmann $

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

gara.provide("gara.jswt.widgets.TabItem");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.Control");
gara.use("gara.jswt.widgets.Menu");
gara.use("gara.jswt.widgets.MenuItem");

gara.require("gara.jswt.widgets.Item");
gara.require("gara.jswt.widgets.TabFolder");

/**
 * gara TreeItem
 *
 * @class TabItem
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Item
 */
gara.Class("gara.jswt.widgets.TabItem", {
	$extends : gara.jswt.widgets.Item,

	$constructor : function(parent, style) {

		if (!gara.instanceOf(parent, gara.jswt.widgets.TabFolder)) {
			throw new TypeError("parentWidget is neither a gara.jswt.widgets.TabFolder");
		}

		this.$base(parent, style);

		// content and flags
		this._active = false;
		this._content = null;
		this._control = null;
		this._toolTipText = null;
		this._menuItem = null;

		// content & control changed flags
		this._contentChanged = false;
		this._controlChanged = false;

		// nodes
		this._span = null;
		this._img = null;
		this._clientArea = null;

		this._create();
		this._parent._addItem(this);
	},

	/**
	 * @method
	 * Contstructs the dom for this tabitem
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {HTMLElement} the created node
	 */
	_create : function() {
		this.handle = document.createElement("li");
		this.handle.className = this._classes.join(" ");
		this.handle.id = this.getId();
		this.handle.widget = this;
		this.handle.control = this._parent;
		if (this._toolTipText != null) {
			this.handle.title = this._toolTipText;
		}
		this._parent._getTabbar().appendChild(this.handle);

		base2.DOM.Event(this.handle);
		this.handle.setAttribute("role", "tab");
		this.handle.setAttribute("aria-controls", this.getId()+"-panel");
		this.handle.setAttribute("aria-owns", this.getId()+"-panel");
		this.handle.setAttribute("aria-selected", this._active);
		this.handle.setAttribute("aria-labelledby", this.getId()+"-label");

		this._door = document.createElement("span");
		this._door.widget = this;
		this._door.control = this._parent;
		this._door.className = "door";
		this.handle.appendChild(this._door);

		base2.DOM.Event(this._door);
		this._door.setAttribute("role", "presentation");

		// create image node
		this._img = document.createElement("img");
		this._img.id = this.getId() + "-image";
		this._img.widget = this;
		this._img.control = this._tree;
		base2.DOM.Event(this._img);
		this._img.setAttribute("role", "presentation");

		// set image
		if (this._image != null) {
			this._img.src = this._image.src;
		} else {
			this._img.style.display = "none";
		}

		this._spanText = document.createTextNode(this._text);
		this._span = document.createElement("span");
		this._span.id = this.getId()+"-label";
		this._span.widget = this;
		this._span.control = this._parent;
		this._span.className = "text";
		this._span.appendChild(this._spanText);
		base2.DOM.Event(this._span);
		this._span.setAttribute("role", "presentation");

		this._door.appendChild(this._img);
		this._door.appendChild(this._span);

		this._clientArea = document.createElement("div");
		this._clientArea.style.display = this._active ? "block" : "none";
		this._clientArea.id = this.getId()+"-panel";
		this._parent.getClientArea().appendChild(this._clientArea);

		base2.DOM.Event(this._clientArea);
		this._clientArea.setAttribute("role", "tabpanel");
		this._clientArea.setAttribute("aria-hidden", !this._active);
		this._clientArea.setAttribute("aria-labelledby", this.getId()+"-label");

		if (this._control) {
			this._clientArea.appendChild(this._control.handle);
		}

		// register listener
		for (var eventType in this._listener) {
			this._listener[eventType].forEach(function(elem, index, arr) {
				this.registerListener(eventType, elem);
			}, this);
		}
		this._changed = false;

		// create menu-item
		if (this._parent._getDropDownMenu()) {
			this._menuItem = new gara.jswt.widgets.MenuItem(this._parent._getDropDownMenu());
			this._menuItem.setText(this._text);
			this._menuItem.setImage(this._image);
			this._menuItem.setVisible(false);
			this._menuItem.setData("gara__tabItem", this);
			this._menuItem.update();
			this.setData("gara__menuItem", this._menuItem);
		}
	},

	dispose : function() {
		this.$base();

		if (this._img != null) {
			this.handle.removeChild(this._img);
			delete this._img;
			this._image = null;
		}

		this.handle.removeChild(this._span);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.handle);
		}

		if (this._control != null) {
			this._control.dispose();
		}

		delete this._span;
		delete this.handle;
	},

	getClientArea : function() {
		return this._clientArea;
	},

	/**
	 * @method
	 * Returns the content for this item
	 *
	 * @author Thomas Gossmann
	 * @return {string} the content;
	 */
	getContent : function() {
		this.checkWidget();
		return this._content;
	},

	/**
	 * @method
	 * Returns the content control for this item
	 *
	 * @author Thomas Gossmann
	 * @return {gara.jswt.Control} the control
	 */
	getControl : function() {
		this.checkWidget();
		return this._control;
	},

	/**
	 * @method
	 * Returns the tooltip text for this item
	 *
	 * @author Thomas Gossmann
	 * @return {string} the tooltip text
	 */
	getToolTipText : function() {
		this.checkWidget();
		return this._toolTipText;
	},

	/**
	 * @method
	 * Event handler for this item. Its main use is to pass through keyboard events
	 * to all listeners.
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} e DOMEvent
	 * @return {void}
	 */
	handleEvent : function(e) {
		this.checkWidget();

		switch (e.type) {
			case "keyup":
			case "keydown":
			case "keypress":
				this._notifyExternalKeyboardListener(e, this, this._parent);
				break;
		}
	},

	/**
	 * @method
	 * Widget implementation to register listener
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_registerListener : function(eventType, listener) {
		if (this.handle != null) {
			gara.EventManager.addListener(this.handle, eventType, listener);
		}
	},

	/**
	 * @method
	 * Set a new active state for this item
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {boolean} active the new active state
	 * @return {void}
	 */
	_setActive : function(active) {
		this.checkWidget();
		this._active = active;
		this.setClass("active", this._active);
		if (this.handle) {
			this.handle.setAttribute("aria-selected", this._active);
			this._clientArea.setAttribute("aria-hidden", !this._active);
			this._clientArea.style.display = this._active ? "block" : "none";

			if (active) {
				this._clientArea.style.height = this._parent.getClientArea().clientHeight + "px";
			}
		}
	},

	/**
	 * @method
	 * Sets a control for that appears in the client area of the TabFolder when this item is activated
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.Control} control the control
	 * @throws {TypeError} when that is not a gara.jswt.Control
	 * @return {gara.jswt.widgets.TabItem}
	 */
	setControl : function(control) {
		this.checkWidget();
		if (!gara.instanceOf(control, gara.jswt.widgets.Control)) {
			throw new TypeError("control is not instance of gara.jswt.widgets.Control");
		}

		this._control = control;
		this._control.setHeight(this._parent.getClientArea().clientHeight);
		this._control.setWidth(this._parent.getClientArea().clientWidth);

		if (this._clientArea) {
			this._clientArea.innerHTML = "";
			this._clientArea.appendChild(this._control.handle);
		}
		return this;
	},

	/**
	 * @method
	 * Sets the image for the item
	 *
	 * @author Thomas Gossmann
	 * @param {Image} image the new image
	 * @return {gara.jswt.widgets.TabItem}
	 */
	setImage: function(image) {
		this.$base(image);
		if (this._menuItem != null) {
			this._menuItem.setImage(this._image);
			this._menuItem.update();
		}

		if (this.handle) {
			// update image
			if (image != null) {
				this._img.src = image.src;
				this._img.style.display = "";
			}

			// hide image
			else {
				this._img.src = "";
				this._img.style.display = "none";
			}
		}

		return this;
	},

	/**
	 * @method
	 * Sets the text for the item
	 *
	 * @author Thomas Gossmann
	 * @param {String} text the new text
	 * @return {gara.jswt.widgets.TabItem}
	 */
	setText: function(text) {
		this.$base(text);
		if (this._menuItem != null) {
			this._menuItem.setText(this._text);
			this._menuItem.update();
		}
		if (this.handle) {
			this._spanText.nodeValue = this._text;
		}
		return this;
	},

	/**
	 * @method
	 * Sets the ToolTip text for this item
	 *
	 * @author Thomas Gossmann
	 * @param {string} text the tooltip text
	 * @return {void}
	 */
	setToolTipText : function(text) {
		this._toolTipText = text;
		if (this.handle) {
			this.handle.title = this._toolTipText;
		}
		return this;
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_unregisterListener : function(eventType, listener) {
		if (this.handle != null) {
			gara.EventManager.removeListener(this.handle, eventType, listener);
		}
	},

	/**
	 * @method
	 * Update this item
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function() {
		this.checkWidget();

		// update ClientArea content
		if (this._control != null) {
			this._control.update();
		}
	}
});