/*	$Id: ListItem.class.js 176 2008-11-22 01:27:51Z tgossmann $

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

gara.provide("gara.jswt.widgets.List");

gara.require("gara.jswt.JSWT");
gara.require("gara.jswt.widgets.Item");

/**
 * @summary
 * gara ListItem for List Widget
 *
 * @description
 *
 * @class ListItem
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Item
 */
gara.Class("gara.jswt.widgets.ListItem", {
	$extends : gara.jswt.widgets.Item,

	/**
	 * @constructor
	 * Constructor
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.List} parent the List Widget for this item
	 * @param {int} style the style for this item
	 * @param {int} index index to insert the item at
	 * @throws {TypeError} if the list is not a List widget
	 * @return {gara.jswt.widgets.ListItem}
	 */
	$constructor : function(parent, style, index) {
		// dom references
		this._span = null;
		this._spanText = null;
		this._img = null;
		this._checkbox = null;

		// flags
		this._selected = false;
		this._grayed = false;
		this._checked = false;

		if (!gara.instanceOf(parent, gara.jswt.widgets.List)) {
			throw new TypeError("parent is not type of gara.jswt.widgets.List");
		}
		this.$base(parent, style);
		this._list = parent;
		this.handle = this._list._addItem(this, index);
		this._create();
	},

	/**
	 * @method
	 * Internal creation process of this item
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_create : function() {
		this.handle.className = this._classes.join(" ");
		this.handle.widget = this;
		this.handle.setAttribute("id", this.getId());
		this.handle.setAttribute("role", "option");
		this.handle.setAttribute("aria-selected", this._selected);
		this.handle.setAttribute("aria-labelledby", this.getId()+"-label");

		// checkbox
		if ((this._list.getStyle() & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK) {
			this._checkbox = document.createElement("span");
			this._checkbox.id = this.getId() + "-checkbox";
			this._checkbox.widget = this;
			this._checkbox.control = this._tree;
			this._setCheckboxClass();

			base2.DOM.Event(this._checkbox);
			this._checkbox.setAttribute("role", "presentation");

			this.handle.appendChild(this._checkbox);
			this.handle.setAttribute("aria-checked", this._checked);
		}

		// create image node
		this._img = document.createElement("img");
		this._img.id = this.getId() + "-image";
		this._img.widget = this;
		this._img.control = this._list;

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
		this._span.control = this._list;
		this._span.className = "text";
		this._span.appendChild(this._spanText);
		base2.DOM.Event(this._span);
		this._span.setAttribute("role", "presentation");

		this.handle.appendChild(this._img);
		this.handle.appendChild(this._span);

		// register listener
		for (var eventType in this._listener) {
			this._listener[eventType].forEach(function(elem, index, arr) {
				this._registerListener(eventType, elem);
			}, this);
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

		delete this._span;
		delete this.handle;
	},

	getChecked : function() {
		this.checkWidget();
		return this._checked;
	},

	getGrayed : function() {
		this.checkWidget();
		return this._grayed;
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

		if ((e.target == this._checkbox	&& e.type == "mousedown")
				|| (e.target == this._checkbox	&& e.type == "mouseup")
				|| (e.type == "keydown" && e.keyCode == gara.jswt.JSWT.SPACE)) {

			e.info = gara.jswt.JSWT.CHECK;
			if (e.type == "mouseup") {
				this.setChecked(!this._checked);
			}
		}
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_registerListener : function(eventType, listener) {
		if (this._img != null) {
			gara.EventManager.addListener(this._img, eventType, listener);
		}

		if (this._span != null) {
			gara.EventManager.addListener(this._span, eventType, listener);
		}
	},

	_setCheckboxClass : function() {
		this._checkbox.className = "jsWTCheckbox";
		if (this._checked && this._grayed) {
			this._checkbox.className += " jsWTCheckboxGrayedChecked";
		} else if (this._grayed) {
			this._checkbox.className += " jsWTCheckboxGrayed";
		} else if (this._checked) {
			this._checkbox.className += " jsWTCheckboxChecked";
		}
	},

	/**
	 * @method
	 * Sets the checked state for this item
	 *
	 * @author Thomas Gossmann
	 * @param {boolean} checked the new checked state
	 * @return {void}
	 */
	setChecked : function(checked) {
		this.checkWidget();
		if (!this._grayed) {
			this._checked = checked;
			this.handle.setAttribute("aria-checked", this._checked);
			this._setCheckboxClass();
		}
		return this;
	},

	setGrayed : function(grayed) {
		this.checkWidget();
		this._grayed = grayed;
		this._checkbox.setAttribute("aria-disabled", this._grayed);
		this._setCheckboxClass();
		return this;
	},

	setImage : function(image) {
		this.$base(image);

		// update image
		if (this._image != null) {
			this._img.src = this._image.src;
			this._img.style.display = "";
		}

		// hide image
		else {
			this._img.src = "";
			this._img.style.display = "none";
		}

		return this;
	},

	_setSelected : function(selected) {
		this.checkWidget();
		this._selected = selected;
		this.handle.setAttribute('aria-selected', this._selected);
		return this;
	},

	setText : function(text) {
		this.$base(text);
		this._spanText.nodeValue = this._text;
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
	_unregisterListener : function(eventType, listener) {
		if (this._img != null) {
			gara.EventManager.removeListener(this._img, eventType, listener);
		}

		if (this._span != null) {
			gara.EventManager.removeListener(this._span, eventType, listener);
		}
	},

	/**
	 * @method
	 * Updates the list item
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function() {
		this.checkWidget();
		if (this.handle == null) {
			this._create();
		}
	}
});