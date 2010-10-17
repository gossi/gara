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

gara.provide("gara.widgets.ListItem", "gara.widgets.Item");

gara.use("gara.widgets.List");

/**
 * @summary
 * gara ListItem for List Widget
 *
 * @description
 *
 * @class ListItem
 * @author Thomas Gossmann
 * @namespace gara.widgets
 * @extends gara.widgets.Item
 */
gara.Class("gara.widgets.ListItem", function () { return {
	$extends : gara.widgets.Item,

	/**
	 * Holds the dom reference for the span node
	 * @private
	 */
	span : null,

	/**
	 * Holds the dom reference for the spanText node
	 * @private
	 */
	spanText : null,

	/**
	 * Holds the dom reference for the span img
	 * @private
	 */
	img : null,

	/**
	 * Holds the dom reference for the checkbox node
	 * @private
	 */
	checkbox : null,

	/**
	 * Holds the selected state
	 * @private
	 */
	selected : false,

	/**
	 * Holds the grayed state
	 * @private
	 */
	grayed : false,

	/**
	 * Holds the checked state
	 * @private
	 */
	checked : false,

	/**
	 * @constructor
	 * Constructor
	 *
	 * @author Thomas Gossmann
	 * @param {gara.widgets.List} parent the List Widget for this item
	 * @param {int} style the style for this item
	 * @param {int} index index to insert the item at
	 * @throws {TypeError} if the list is not a List widget
	 * @return {gara.widgets.ListItem}
	 */
	$constructor : function (parent, style, index) {
		if (!(parent instanceof gara.widgets.List)) {
			throw new TypeError("parent is not type of gara.widgets.List");
		}

		this.grayed = false;
		this.checked = false;
		this.selected = false;

		this.$super(parent, style);

		this.list = parent;
		this.parentNode = this.list.addItem(this, index);
		this.createWidget();
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.img, eventType, listener);
		gara.addEventListener(this.span, eventType, listener);
	},

	/**
	 * @method
	 * Internal creation process of this item
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	createWidget : function () {
		var items = this.parent.getItems(),
			index = items.indexOf(this),
			nextNode;

		// handle
		this.handle = document.createElement("li");
		this.handle.widget = this;
		this.handle.control = this.list;
		this.handle.setAttribute("id", this.getId());
		this.handle.setAttribute("role", "option");
		this.handle.setAttribute("aria-selected", this.selected);
		this.handle.setAttribute("aria-labelledby", this.getId()+"-label");

		// checkbox
		if ((this.list.getStyle() & gara.CHECK) === gara.CHECK) {
			this.checkbox = document.createElement("span");
			this.checkbox.id = this.getId() + "-checkbox";
			this.checkbox.widget = this;
			this.checkbox.control = this.tree;
			this.checkbox.setAttribute("role", "presentation");

			this.setCheckboxClass();

			this.handle.appendChild(this.checkbox);
			this.handle.setAttribute("aria-checked", this.checked);
		}

		// create image node
		this.img = document.createElement("img");
		this.img.id = this.getId() + "-image";
		this.img.className = "garaListItemImage garaItemImage";
		this.img.widget = this;
		this.img.control = this.list;
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
		this.span.className = "garaListItemText garaItemText";
		this.span.widget = this;
		this.span.control = this.list;
		this.span.appendChild(this.spanText);
		this.span.setAttribute("role", "presentation");

		this.handle.appendChild(this.img);
		this.handle.appendChild(this.span);
		
		// CSS
		this.addClass("garaListItem");

		// append to dom
		if (index === items.length - 1) {
			this.parentNode.appendChild(this.handle);
		} else {
			nextNode = index === 0
				? this.parentNode.firstChild
				: items[index - 1].handle.nextSibling;
			this.parentNode.insertBefore(this.handle, nextNode);
		}

	},

	destroyWidget : function () {
		this.parent.releaseItem(this);

		this.img = null;
		this.span = null;
		this.spanText = null;
		this.list = null;
		
		this.$super();
	},

	getChecked : function () {
		this.checkWidget();
		return this.checked;
	},

	getGrayed : function () {
		this.checkWidget();
		return this.grayed;
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
	handleEvent : function (e) {
		this.checkWidget();

		if ((e.target === this.checkbox	&& e.type === "mousedown")
				|| (e.target === this.checkbox	&& e.type === "mouseup")
				|| (e.type === "keydown" && e.keyCode === gara.SPACE)) {

			e.info = gara.CHECK;
			if (e.type === "mouseup") {
				this.setChecked(!this.checked);
			}
		}
		
//		this.$super(e);
	},

	/**
	 * @private
	 */
	setCheckboxClass : function () {
		if (!this.checkbox) {
			return;
		}

		this.checkbox.className = "garaCheckbox";
		if (this.checked && this.grayed) {
			this.checkbox.className += " garaCheckboxGrayedChecked";
		} else if (this.grayed) {
			this.checkbox.className += " garaCheckboxGrayed";
		} else if (this.checked) {
			this.checkbox.className += " garaCheckboxChecked";
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
	setChecked : function (checked) {
		this.checkWidget();
		if (!this.grayed) {
			this.checked = checked;
			this.handle.setAttribute("aria-checked", this.checked);
			this.setCheckboxClass();
		}
		return this;
	},

	setGrayed : function (grayed) {
		this.checkWidget();
		this.grayed = grayed;
		if (this.checkbox) {
			this.checkbox.setAttribute("aria-disabled", this.grayed);
			this.setCheckboxClass();
		}
		return this;
	},

	setImage : function (image) {
		this.$super(image);

		// update image
		if (this.image !== null) {
			this.img.src = this.image.src;
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
	 *
	 * @private
	 */
	setSelected : function (selected) {
		this.checkWidget();
		this.selected = selected;
		this.handle.setAttribute('aria-selected', this.selected);
		return this;
	},

	setText : function (text) {
		this.$super(text);
		this.spanText.nodeValue = this.text;
		return this;
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	unbindListener : function (eventType, listener) {
		if (this.img !== null) {
			gara.removeEventListener(this.img, eventType, listener);
		}

		if (this.span !== null) {
			gara.removeEventListener(this.span, eventType, listener);
		}
	}
};});