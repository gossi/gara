/*	$Id$

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

/**
 * gara TreeItem
 *
 * @class TabItem
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends gara.jswt.Item
 */
$class("TabItem", {
	$extends : gara.jswt.Item,

	$constructor : function(parent, style) {

		if (!$class.instanceOf(parent, gara.jswt.TabFolder)) {
			throw new TypeError("parentWidget is neither a gara.jswt.TabFolder");
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
		this.domref = document.createElement("li");
		this.domref.className = this._className;
		this.domref.obj = this;
		this.domref.control = this._parent;
		if (this._toolTipText != null) {
			this.domref.title = this._toolTipText;
		}
		base2.DOM.EventTarget(this.domref);
		this._parent._getTabbar().appendChild(this.domref);

		this._span = document.createElement("span");
		this._span.obj = this;
		this._span.control = this._parent;
		this.domref.appendChild(this._span);
		base2.DOM.EventTarget(this._span);

		// set image
		if (this._image != null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._parent;
			this._img.src = this._image.src;
			this._img.alt = this._text;
			base2.DOM.EventTarget(this._img);

			// put the image into the dom
			this._span.appendChild(this._img);
		}

		this._spanText = document.createTextNode(this._text);
		this._span.appendChild(this._spanText);

		this._clientArea = document.createElement("div");
		this._clientArea.style.display = "none";
		this._parent.getClientArea().appendChild(this._clientArea);

		// register listener
		for (var eventType in this._listener) {
			this._listener[eventType].forEach(function(elem, index, arr) {
				this.registerListener(eventType, elem);
			}, this);
		}
		this._changed = false;

		// create menu-item
		if (this._parent._getDropDownMenu()) {
			this._menuItem = new gara.jswt.MenuItem(this._parent._getDropDownMenu());
			this._menuItem.setText(this._text);
			this._menuItem.setImage(this._image);
			this._menuItem.setVisible(false);
			this._menuItem.setData("gara__tabItem", this);
			this.setData("gara__menuItem", this._menuItem);
		}
	},

	dispose : function() {
		this.$base();

		if (this._img != null) {
			this.domref.removeChild(this._img);
			delete this._img;
			this._image = null;
		}

		this.domref.removeChild(this._span);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.domref);
		}

		if (this._control != null) {
			this._control.dispose();
		}

		delete this._span;
		delete this.domref;
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
	_registerListener : function() {
		if (this.domref != null) {
			gara.EventManager.addListener(this.domref, eventType, listener);
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
		this._changed = true;
	},

	/**
	 * @method
	 * Sets content for this item that appears in the client area of the TabFolder when
	 * this item is activated. Use EITHER setContent OR setControl!
	 *
	 * @author Thomas Gossmann
	 * @param {string} content the content
	 * @return {void}
	 */
	setContent : function(content) {
		this.checkWidget();
		this._content = content;
		this._contentChanged = true;
		this._changed = true;
	},

	/**
	 * @method
	 * Sets a control for that appears in the client area of the TabFolder when this item is activated
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.Control} control the control
	 * @throws {TypeError} when that is not a gara.jswt.Control
	 * @return {void}
	 */
	setControl : function(control) {
		this.checkWidget();
		if (!$class.instanceOf(control, gara.jswt.Control)) {
			throw new TypeError("control is not instance of gara.jswt.Control");
		}

		this._control = control;
		this._controlChanged = true;
	},

	/**
	 * @method
	 * Sets the image for the item
	 *
	 * @author Thomas Gossmann
	 * @param {Image} image the new image
	 * @return {void}
	 */
	setImage: function(image) {
		this.$base(image);
		if (this._menuItem != null) {
			this._menuItem.setImage(this._image);
		}
	},

	/**
	 * @method
	 * Sets the text for the item
	 *
	 * @author Thomas Gossmann
	 * @param {String} text the new text
	 * @return {void}
	 */
	setText: function(text) {
		this.$base(text);
		if (this._menuItem != null) {
			this._menuItem.setText(this._text);
		}
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
		this._changed = true;
	},

	toString : function() {
		return "[gara.jswt.TabItem]";
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
		if (this.domref != null) {
			gara.EventManager.removeListener(this.domref, eventType, listener);
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
		if (this.domref == null) {
			this._create();
		} else {
			// create image
			if (this._image != null && this._img == null) {
				this._img = document.createElement("img");
				this._img.obj = this;
				this._img.control = this._parent;
				this._img.alt = this._text;
				this._img.src = this._image.src;
				this._span.insertBefore(this._img, this._spanText);
				base2.DOM.EventTarget(this._img);

				// event listener
				for (var eventType in this._listener) {
					this._listener[eventType].forEach(function(elem, index, arr) {
						this.registerListener(this._img, eventType, elem);
					}, this);
				}
			}

			// simply update image information
			else if (this._image != null) {
				this._img.src = this._image.src;
				this._img.alt = this._text;
			}

			// delete image
			else if (this._img != null && this._image == null) {
				this._span.removeChild(this._img);
				this._img = null;

				// event listener
				for (var eventType in this._listener) {
					this._listener[eventType].forEach(function(elem, index, arr) {
						gara.EventManager.removeListener(this._img, eventType, elem);
					}, this);
				}
			}
		}

		// update ClientArea content
		if (this._control != null) {
			this._control.update();
		}

		if (this._controlChanged) {
			this._controlChanged = false;
			this._clientArea.innerHTML = "";
			this._clientArea.appendChild(this._control.domref);
		}

		if (this._contentChanged) {
			this._contentChanged = false;
			this._clientArea.innerHTML = "";
			if (typeof(this._content) == "string") {
				this._clientArea.appendChild(document.createTextNode(this._content));
			} else {
				this._clientArea.appendChild(this._content);
			}
		}

		this.removeClassName("active");
		if (this._active) {
			this.addClassName("active");
			this._clientArea.style.display = "block";
		} else {
			this._clientArea.style.display = "none";
		}

		this._spanText.nodeValue = this._text;
		this.domref.className = this._className;

		if (this._toolTipText != null) {
			this.domref.title = this._toolTipText;
		}
		this._changed = false;
	}
});