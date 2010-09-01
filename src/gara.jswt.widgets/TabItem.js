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

gara.provide("gara.jswt.widgets.TabItem", "gara.jswt.widgets.Item");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.Control");
gara.use("gara.jswt.widgets.Menu");
gara.use("gara.jswt.widgets.MenuItem");
gara.use("gara.jswt.widgets.TabFolder");

/**
 * gara TreeItem
 *
 * @class TabItem
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Item
 */
gara.Class("gara.jswt.widgets.TabItem", function () { return {
	$extends : gara.jswt.widgets.Item,

	// content and flags
	/**
	 * @field
	 * Holds the active state.
	 *
	 * @private
	 * @type {boolean}
	 */
	active : false,

	/**
	 * @field
	 * Contains the <code>Control</code>.
	 *
	 * @private
	 * @type {gara.jswt.widgets.Control}
	 */
	control : null,

	/**
	 * @field
	 * Contains the tooltip text.
	 *
	 * @private
	 * @type {String}
	 */
	toolTipText : null,

	/**
	 * @field
	 * Bridged menu item, when DROP_DOWN style is used on the <code>TabFolder</code>.
	 *
	 * @private
	 * @type {gara.jswt.widgets.MenuItem}
	 */
	menuItem : null,

	// nodes
	/**
	 * @field
	 * Span's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	span : null,

	/**
	 * @field
	 * Img's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	img : null,

	/**
	 * @field
	 * ClientArea's DOM Reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	clientArea : null,

	$constructor : function (parent, style) {

		if (!(parent instanceof gara.jswt.widgets.TabFolder)) {
			throw new TypeError("parentWidget is neither a gara.jswt.widgets.TabFolder");
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

	/**
	 * @method
	 * Widget implementation to register listener
	 *
	 * @private
	 * @return {void}
	 */
	bindListener : function (eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
	},

	close : function () {
		if (this.parent.notifyTabFolderListener("close")) {
			this.dispose();
		}
	},

	/**
	 * @method
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
		this.door.className = "door";
		this.door.setAttribute("role", "presentation");
		this.handle.appendChild(this.door);

		// create image node
		this.img = document.createElement("img");
		this.img.id = this.getId() + "-image";
		this.img.widget = this;
		this.img.control = this.tree;
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
		this.span.className = "text";
		this.span.appendChild(this.spanText);
		this.span.setAttribute("role", "presentation");

		// close
		if ((this.style & gara.jswt.JSWT.CLOSE) !== 0) {
			this.closeButton = document.createElement("span");
			this.closeButton.className = "jsWTDecorationsCloseButton";
			this.closeButton.widget = this;
			this.door.appendChild(this.closeButton);
		}
		
		this.door.appendChild(this.img);
		this.door.appendChild(this.span);
		
		

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
			this.menuItem = new gara.jswt.widgets.MenuItem(this.parent.getDropDownMenu());
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
	 * @method
	 *
	 * @private
	 */
	getClientArea : function () {
		return this.clientArea;
	},

	/**
	 * @method
	 * Returns the content control for this item
	 *
	 * @return {gara.jswt.Control} the control
	 */
	getControl : function () {
		this.checkWidget();
		return this.control;
	},

	/**
	 * @method
	 * Returns the tooltip text for this item
	 *
	 * @return {string} the tooltip text
	 */
	getToolTipText : function () {
		this.checkWidget();
		return this.toolTipText;
	},

	/**
	 * @method
	 * Event handler for this item. Its main use is to pass through keyboard events
	 * to all listeners.
	 *
	 * @private
	 * @param {Event} e DOMEvent
	 * @return {void}
	 */
	handleEvent : function (e) {
		this.checkWidget();

		if (e.type === "mousedown" && e.target === this.closeButton) {
			this.close();
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
	setActive : function (active) {
		this.checkWidget();
		this.active = active;
		this.setClass("active", this.active);
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
	 * @method
	 * Sets a control for that appears in the client area of the TabFolder when this item is activated
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.Control} control the control
	 * @throws {TypeError} when that is not a gara.jswt.Control
	 * @return {gara.jswt.widgets.TabItem}
	 */
	setControl : function (control) {
		this.checkWidget();
		if (!(control instanceof gara.jswt.widgets.Control)) {
			throw new TypeError("control is not instance of gara.jswt.widgets.Control");
		}

		this.control = control;
		if (control instanceof gara.jswt.widgets.Scrollable) {
			this.control.setHeight(this.parent.getClientArea().clientHeight);
			this.control.setWidth(this.parent.getClientArea().clientWidth);
		}

		if (this.clientArea) {
			this.clientArea.innerHTML = "";
			this.clientArea.appendChild(this.control.handle);
		}
		return this;
	},

	/**
	 * @method
	 * Sets the image for the item
	 *
	 * @param {Image} image the new image
	 * @return {gara.jswt.widgets.TabItem}
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

	/**
	 * @method
	 * Sets the text for the item
	 *
	 * @param {String} text the new text
	 * @return {gara.jswt.widgets.TabItem}
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
	 * @method
	 * Sets the ToolTip text for this item
	 *
	 * @param {string} text the tooltip text
	 * @return {void}
	 */
	setToolTipText : function (text) {
		this.toolTipText = text;
		if (text !== "" || text !== null) {
			this.handle.title = this.toolTipText;
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
	unbindListener : function (eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	},

	/**
	 * @method
	 * Update this item
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function () {
		this.checkWidget();

		// update ClientArea content
		if (this.control !== null) {
			this.control.update();
		}
	}
};});