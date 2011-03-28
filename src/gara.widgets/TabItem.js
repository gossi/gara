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

gara.provide("gara.widgets.TabItem", "gara.widgets.Item");

gara.use("gara.widgets.Control");
gara.use("gara.widgets.Menu");
gara.use("gara.widgets.MenuItem");
gara.use("gara.widgets.TabFolder");

/**
 * gara TreeItem
 *
 * @class gara.widgets.TabItem
 * @extends gara.widgets.Item
 */
gara.Class("gara.widgets.TabItem", function () { return /** @lends gara.widgets.TabItem# */ {
	$extends : gara.widgets.Item,

	/**
	 * Holds the active state.
	 *
	 * @private
	 * @type {boolean}
	 */
	active : false,

	/**
	 * Contains the <code>Control</code>.
	 *
	 * @private
	 * @type {gara.widgets.Control}
	 */
	control : null,

	/**
	 * Contains the tooltip text.
	 *
	 * @private
	 * @type {String}
	 */
	toolTipText : null,

	/**
	 * Bridged menu item, when DROP_DOWN style is used on the <code>TabFolder</code>.
	 *
	 * @private
	 * @type {gara.widgets.MenuItem}
	 */
	menuItem : null,

	// nodes
	/**
	 * Span's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	span : null,

	/**
	 * Img's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	img : null,

	/**
	 * ClientArea's DOM Reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	clientArea : null,

	/**
	 * @constructs
	 * @extends gara.widgets.Item
	 * @param {gara.widgets.TabFolder} parent 
	 * @param {int} style
	 */
	$constructor : function (parent, style) {
		if (!(parent instanceof gara.widgets.TabFolder)) {
			throw new TypeError("parentWidget is neither a gara.widgets.TabFolder");
		}

		this.$super(parent, style);

		// content and flags
//		this.disposed = false;
		this.active = false;
		this.control = null;
		this.toolTipText = null;
		this.menuItem = null;

		// nodes
		this.span = null;
		this.img = null;
		this.clientArea = null;

		this.parentNode = this.parent.addItem(this);
		this.createWidget();
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	/**
	 * Closes and disposes the receiver.
	 * 
	 * @returns {void}
	 */
	close : function () {
		if (this.parent.notifyTabFolderListener("close")) {
			this.dispose();
		}
	},

	/**
	 * Contstructs the dom for this tabitem
	 *
	 * @private
	 */
	createWidget : function () {
		var self = this;
		this.handle = document.createElement("li");
		this.handle.className = this.classes.join(" ");
		this.handle.id = this.getId();
		this.handle.widget = this;
		this.handle.control = this.parent;
		this.handle.setAttribute("role", "tab");
		this.handle.setAttribute("aria-controls", this.getId()+"-panel");
		this.handle.setAttribute("aria-owns", this.getId()+"-panel");
		this.handle.setAttribute("aria-selected", this.active);
		this.handle.setAttribute("aria-labelledby", this.getId()+"-label");

		if (this.toolTipText !== null) {
			this.handle.title = this.toolTipText;
		}

		this.door = document.createElement("span");
		this.door.widget = this;
		this.door.control = this.parent;
		this.door.className = "garaTabItemDoor";
		this.door.setAttribute("role", "presentation");
		this.handle.appendChild(this.door);

		// create image node
		this.img = document.createElement("img");
		this.img.id = this.getId() + "-image";
		this.img.widget = this;
		this.img.control = this.tree;
		this.img.className = "garaTabItemImage garaItemImage";
		this.img.setAttribute("role", "presentation");

		// set image
		if (this.image !== null) {
			this.img.src = this.image.src;
		} else {
			this.img.style.display = "none";
		}

		this.spanText = document.createTextNode(this.text);
		this.span = document.createElement("span");
		this.span.id = this.getId()+"-label";
		this.span.widget = this;
		this.span.control = this.parent;
		this.span.className = "garaTabItemText garaItemText";
		this.span.appendChild(this.spanText);
		this.span.setAttribute("role", "presentation");

		// close
		if ((this.style & gara.CLOSE) !== 0) {
			this.closeButton = document.createElement("span");
			this.closeButton.className = "garaDecorationsCloseButton";
			this.closeButton.widget = this;
			this.door.appendChild(this.closeButton);
		}
		
		this.door.appendChild(this.img);
		this.door.appendChild(this.span);
		
		// CSS
		this.addClass("garaTabItem");
		

		// client area
		this.clientArea = document.createElement("div");
		this.clientArea.style.display = this.active ? "block" : "none";
		this.clientArea.id = this.getId()+"-panel";
//		this.clientArea.style.height = this.parent.getClientArea().clientHeight + "px";
//		this.clientArea.style.width = this.parent.getClientArea().clientWidth + "px";
		this.clientArea.setAttribute("aria-hidden", !this.active);
		this.clientArea.setAttribute("role", "tabpanel");
		this.clientArea.setAttribute("aria-labelledby", this.getId()+"-label");
		this.parent.getClientArea().appendChild(this.clientArea);

		if (this.control) {
			this.clientArea.appendChild(this.control.handle);
		}

		// create menu-item
		if (this.parent.getDropDownMenu()) {
			this.menuItem = new gara.widgets.MenuItem(this.parent.getDropDownMenu());
			this.menuItem.setText(this.text);
			this.menuItem.setImage(this.image);
			this.menuItem.setVisible(false);
			this.menuItem.setData("gara__tabItem", this);
			this.menuItem.update();
			this.setData("gara__menuItem", this.menuItem);
			this.menuItem.addSelectionListener({
				widgetSelected : function (e) {
					self.parent.activateItem(self);
				}
			});
		}

		this.parentNode.appendChild(this.handle);
		this.parent.updateMeasurements();
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	destroyWidget : function () {
		this.parent.releaseItem(this);
				
		if (this.control !== null) {
			this.control.release();
		}
		
		this.control = null;
		this.menuItem = null;
		
		this.$super();
	},

	/**
	 * Returns the receiver's client area.
	 * 
	 * @private
	 * @returns {HTMLElement}
	 */
	getClientArea : function () {
		return this.clientArea;
	},

	/**
	 * Returns the receiver's control.
	 *
	 * @see gara.widgets.TabItem#setControl
	 * @returns {gara.widgets.Control} the control
	 */
	getControl : function () {
		this.checkWidget();
		return this.control;
	},

	/**
	 * Returns the receiver's tooltip text.
	 *
	 * @returns {string} the tooltip text
	 */
	getToolTipText : function () {
		this.checkWidget();
		return this.toolTipText;
	},

	/**
	 * Event handler for this item. Its main use is to pass through keyboard events
	 * to all listeners.
	 *
	 * @private
	 * @param {Event} e DOMEvent
	 * @returns {void}
	 */
	handleEvent : function (e) {
		this.checkWidget();

		if (e.type === "mousedown" && e.target === this.closeButton) {
			this.close();
		}
		
		if (e.type === "contextmenu") {
			e.preventDefault();
		}
	},

	/*
	 * jsdoc in gara.widgets.Item
	 */
	setActive : function (active) {
		this.checkWidget();
		this.active = active;
		this.setClass("garaActiveItem", this.active);
		if (this.handle) {
			this.handle.setAttribute("aria-selected", this.active);
			this.clientArea.setAttribute("aria-hidden", !this.active);
			this.clientArea.style.display = this.active ? "block" : "none";

			if (active) {
				this.clientArea.style.height = this.parent.getClientArea().clientHeight + "px";
				this.clientArea.style.width = this.parent.getClientArea().clientWidth + "px";
			}
		}
	},

	/**
	 * Sets the receiver's control, that appears in the client area of the <code>TabFolder</code> when 
	 * the receiver gets activated.
	 *
	 * @see gara.widgets.TabItem#getControl
	 * @param {gara.widgets.Control} control the control
	 * @throws {TypeError} when that is not a gara.widgets.Control
	 * @returns {gara.widgets.TabItem}
	 */
	setControl : function (control) {
		var overflow;
		this.checkWidget();
		if (!(control instanceof gara.widgets.Control)) {
			throw new TypeError("control is not instance of gara.widgets.Control");
		}

		overflow = gara.getStyle(this.getClientArea(), "overflow");
		this.getClientArea().style.overflow = "hidden";
		this.control = control;
		if (control instanceof gara.widgets.Scrollable) {
			this.control.setHeight(this.parent.getClientArea().offsetHeight - gara.getNumStyle(this.parent.getClientArea(), "padding-top") - gara.getNumStyle(this.parent.getClientArea(), "padding-bottom") - gara.getNumStyle(this.parent.getClientArea(), "border-top-width") - gara.getNumStyle(this.parent.getClientArea(), "border-bottom-width"));
			this.control.setWidth(this.parent.getClientArea().offsetWidth - gara.getNumStyle(this.parent.getClientArea(), "padding-left") - gara.getNumStyle(this.parent.getClientArea(), "padding-right") - gara.getNumStyle(this.parent.getClientArea(), "border-left-width") - gara.getNumStyle(this.parent.getClientArea(), "border-right-width"));
		}
		this.getClientArea().style.overflow = overflow;

		if (this.clientArea) {
			this.clientArea.innerHTML = "";
			this.clientArea.appendChild(this.control.handle);
		}
		return this;
	},

	/*
	 * jsdoc in gara.widgets.Item
	 */
	setImage: function (image) {
		this.$super(image);
		if (this.menuItem !== null) {
			this.menuItem.setImage(this.image);
		}

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

	/*
	 * jsdoc in gara.widgets.Item
	 */
	setText: function (text) {
		this.$super(text);
		if (this.menuItem !== null) {
			this.menuItem.setText(this.text);
		}
		this.spanText.nodeValue = this.text;
		return this;
	},

	/**
	 * Sets the receiver's tooltip text.
	 *
	 * @param {string} text the tooltip text
	 * @returns {gara.widgets.TabItem} this
	 */
	setToolTipText : function (text) {
		this.toolTipText = text;
		if (text !== "" || text !== null) {
			this.handle.title = this.toolTipText;
		}
		return this;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	unbindListener : function (eventType, listener) {
		gara.removeEventListener(this.handle, eventType, listener);
	},

	/**
	 * Update the receiver, mostly it's control.
	 *
	 * @private
	 * @returns {void}
	 */
	update : function () {
		this.checkWidget();

		// update ClientArea content
		if (this.control !== null) {
			this.control.update();
		}
	}
};});