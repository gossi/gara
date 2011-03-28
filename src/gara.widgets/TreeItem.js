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

gara.provide("gara.widgets.TreeItem", "gara.widgets.Item");

gara.require("gara.widgets.Tree");

/**
 * gara TreeItem
 *
 * @class gara.widgets.TreeItem
 * @extends gara.widgets.Item
 */
gara.Class("gara.widgets.TreeItem", function () { return /** @lends gara.widgets.TreeItem# */ {
	$extends : gara.widgets.Item,

	/**
	 * DOM reference of the checkbox.
	 *
	 * @privte
	 * @type {HTMLElement}
	 */
	checkbox : null,

	/**
	 * Holds the checked state.
	 *
	 * @private
	 * @type {boolean}
	 */
	checked : false,

	/**
	 * DOM reference of the child container.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	childContainer : null,

	/**
	 * Holds the expanded state.
	 *
	 * @private
	 * @type {boolean}
	 */
	expanded : true,

	/**
	 * Holds the grayed state.
	 *
	 * @private
	 * @type {boolean}
	 */
	grayed : false,

	/**
	 * Contains the images for each column.
	 *
	 * @private
	 * @type {Image[]}
	 */
	images : [],

	/**
	 * DOM reference of the image.
	 *
	 * @private
	 * @type {}
	 */
	img : null,

	/**
	 * Contains the sub items.
	 *
	 * @private
	 * @type {gara.widgets.TreeItem[]}
	 */
	items : [],

	/**
	 * Holds the selected state.
	 *
	 * @private
	 * @type {boolean}
	 */
	selected : false,

	/**
	 * DOM reference of the span.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	span : null,

	/**
	 * DOM reference of the span's text.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	spanText : null,

	/**
	 * Contains the text for each column.
	 *
	 * @private
	 * @type {String[]}
	 */
	texts : [],

	/**
	 * DOM reference of the toggler.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	toggleNode : null,

	/**
	 * Contains the assigned <code>Tree</code>.
	 *
	 * @private
	 * @type {gara.widgets.Tree}
	 */
	tree : null,

	/**
	 * Creates a new TreeItem
	 * 
	 * @constructs
	 * @extends gara.widgets.Item
	 * 
	 * @param {gara.widgets.Tree|gara.widgets.TreeItem} parent a composite control which will be the parent of the new instance (cannot be null)
	 * @param {int} style the style for the new <code>TreeItem</code> (optional)
	 * @param {int} index the zero-relative index to store the receiver in its parent (optional) 
	 */
	$constructor : function (parent, style, index) {
		if (!(parent instanceof gara.widgets.Tree || parent instanceof gara.widgets.TreeItem)) {
			throw new TypeError("parent is neither a gara.widgets.Tree nor gara.widgets.TreeItem");
		}

		this.$super(parent, style);
		this.parent = parent;
		this.items = [];
		this.texts = [];
		this.images = [];

		// states
		this.selected = false;
		this.checked = false;
		this.grayed = false;
		this.expanded = true;

		if (parent instanceof gara.widgets.Tree) {
			this.tree = parent;
			this.parentNode = this.tree.addItem(this, index);
		} else if (parent instanceof gara.widgets.TreeItem) {
			this.parentNode = parent.addItem(this, index);
			this.tree = parent.getParent();
			this.tree.addItem(this, index);
		}

		this.createWidget();
	},

	/**
	 * Adds an item to the receiver.
	 *
	 * @private
	 * @param {gara.widgets.TreeItem} item the item to be added
	 * @throws {TypeError} when the item is not type of a TreeItem
	 * @returns {HTMLElement} the parent dom node for the newly added item
	 */
	addItem : function (item, index) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.widgets.TreeItem");
		}

		if (typeof(index) !== "undefined") {
			this.items.insertAt(index, item);
		} else {
			this.items.add(item);
		}

		if (this.items.length) {
			this.childContainer.style.display = this.expanded ? "block" : "none";
			this.setClass("garaTreeItemExpanded", this.expanded);
			this.setClass("garaTreeItemCollapsed", !this.expanded);
		}

		return this.childContainer;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.img, eventType, listener);
		gara.addEventListener(this.span, eventType, listener);
	},

	/**
	 * Internal method for creating a node representing an item. This is used for
	 * creating a new item or put updated content to an existing node of an earlier
	 * painted item.
	 *
	 * @private
	 * @returns {void}
	 */
	createWidget : function () {
		var parentItems, eventType, items, index, nextNode,
			level = 1,
			parent = this;

		// get item level
		while (parent.getParentItem() !== null) {
			level++;
			parent = parent.getParentItem();
		}

		// create item node
		this.handle = document.createElement("li");
		this.handle.widget = this;
		this.handle.control = this.tree;
		this.handle.setAttribute("id", this.getId());
		this.handle.setAttribute("role", "treeitem");
		this.handle.setAttribute("aria-selected", this.selected);
		this.handle.setAttribute("aria-expanded", this.expanded);
		this.handle.setAttribute("aria-level", level);
		this.handle.setAttribute("aria-labelledby", this.getId()+"-label");

		// toggler
		this.toggleNode = document.createElement("span");
		this.toggleNode.widget = this;
		this.toggleNode.control = this.tree;
		this.toggleNode.className = "garaTreeItemToggler";
		this.toggleNode.setAttribute("role", "presentation");
		this.handle.appendChild(this.toggleNode);

		// checkbox
		if ((this.tree.getStyle() & gara.CHECK) !== 0) {
			this.checkbox = document.createElement("span");
			this.checkbox.id = this.getId() + "-checkbox";
			this.checkbox.widget = this;
			this.checkbox.control = this.tree;
			this.checkbox.setAttribute("role", "presentation");

			this.handle.appendChild(this.checkbox);
			this.handle.setAttribute("aria-checked", this.checked);
			this.setCheckboxClass();
		}

		// create image node
		this.img = document.createElement("img");
		this.img.id = this.getId() + "-image";
		this.img.widget = this;
		this.img.control = this.tree;
		this.img.className = "garaItemImage garaTreeItemImage";
		this.img.setAttribute("role", "presentation");
		this.handle.appendChild(this.img);

		// set image
		if (this.image !== null) {
			this.img.src = this.image.src;
		} else {
			this.img.style.display = "none";
		}

		// span and text
		this.spanText = document.createTextNode(this.getText());
		this.span = document.createElement("span");
		this.span.id = this.getId()+"-label";
		this.span.widget = this;
		this.span.control = this.tree;
		this.span.className = "garaItemText garaTreeItemText";
		this.span.appendChild(this.spanText);
		this.span.setAttribute("role", "presentation");
		this.handle.appendChild(this.span);

		// child container
		this.childContainer = document.createElement('ul');
		this.childContainer.className = "garaTreeItemChildContainer";
		this.childContainer.setAttribute("role", "group");
		this.childContainer.style.display = "none";
		this.handle.appendChild(this.childContainer);
		
		// css
		this.addClass("garaTreeItem");

		// append to dom
		items = this.parent.getItems();
		index = items.indexOf(this);
		nextNode = index === 0
			? this.parentNode.firstChild
			: items[index - 1].handle.nextSibling;

		if (!nextNode) {
			this.parentNode.appendChild(this.handle);
		} else {
			this.parentNode.insertBefore(this.handle, nextNode);
		}

		// update bottom style
		parentItems = this.parent.getItems();
		if (parentItems.length > 1) {
			parentItems[parentItems.length - 2].update();
		}

		// bottom
		if (parentItems.indexOf(this) === parentItems.length - 1) {
//			this.childContainer.className = "bottom";
			this.addClass("garaLastTreeItem");
		}
	},

	/**
	 * Deselect all child items
	 *
	 * @private
	 * @returns {void}
	 */
	deselectItems : function () {
		this.checkWidget();
		this.items.forEach(function (child, index, arr) {
			if (child.getItemCount()) {
				child.deselectItems();
			}
			this.tree.deselect(child);
		}, this);
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	destroyWidget : function () {
		this.tree.releaseItem(this);
		this.parent.releaseItem(this);

		this.items.forEach(function (item) {
			item.release();
		}, this);
		
		this.items = null;
		this.texts = null;
		this.images = null;
		this.tree = null;

		this.$super();
	},

	/**
	 * Returns <code>true</code> if the receiver is checked, and <code>false</code> otherwise. 
	 *
	 * @returns {boolean} the checked state
	 */
	getChecked : function () {
		this.checkWidget();
		return this.checked;
	},

	/**
	 * Returns <code>true</code> if the receiver is expanded, and <code>false</code> otherwise.
	 *
	 * @returns {boolean} the expanded state
	 */
	getExpanded : function () {
		this.checkWidget();
		return this.expanded;
	},

	/**
	 * Returns <code>true</code> if the receiver is grayed, and <code>false</code> otherwise.
	 *
	 * @returns {boolean} the grayed state
	 */
	getGrayed : function () {
		this.checkWidget();
		return this.grayed;
	},

	/**
	 * Returns the receiver's image if it has one, or null if it does not.
	 * 
	 * @param {int} columnIndex a given column index, to return the image stored for the given column (optional)
	 * @returns {Image} the image
	 */
	getImage : function (columnIndex) {
		this.checkWidget();
		columnIndex = columnIndex || 0;
		return this.images[columnIndex];
	},

	/**
	 * Returns a specific item at a given zero-related index
	 *
	 * @param {int} index the zero-related index
	 * @throws {RangeError} when there is no item at the given index
	 * @returns {gara.widgets.TreeItem} the item
	 */
	getItem : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) === "undefined") {
			throw new RangeError("There is no item for the given index");
		}

		return this.items[index];
	},

	/**
	 * Returns the number of items in the receiver.
	 *
	 * @returns {int} the number of items.
	 */
	getItemCount : function () {
		return this.items.length;
	},

	/**
	 * Returns a (possibly empty) array of TreeItems which are the direct item children of the receiver. 
	 *
	 * @return {gara.widgets.TreeItem[]} the receiver's items.
	 */
	getItems : function () {
		return this.items;
	},

	/**
	 * Returns the receiver's parent, which must be a <code>Tree</code>
	 *
	 * @return {gara.widgets.Tree} the receiver's parent
	 */
	getParent : function () {
		return this.tree;
	},

	/**
	 * Returns the receiver's parent item, which must be a <code>TreeItem</code> or null when the 
	 * receiver is a root. 
	 *
	 * @return {gara.widgets.TreeItem} the receiver's parent item
	 */
	getParentItem : function () {
		if (this.parent === this.tree) {
			return null;
		} else {
			return this.parent;
		}
	},

	/**
	 * Returns the receiver's text if it has one, or null if it does not.
	 * 
	 * @param {int} columnIndex a given column index, to return the text stored for the given column (optional)
	 * @returns {String} the text
	 */
	getText : function (columnIndex) {
		this.checkWidget();
		columnIndex = columnIndex || 0;
		return this.texts[columnIndex];
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	handleEvent : function (e) {
		this.checkWidget();

		// hitting checkbox
		if ((e.target === this.checkbox	&& e.type === "mousedown")
				|| (e.target === this.checkbox	&& e.type === "mouseup")
				|| (e.type === "keydown" && e.keyCode === gara.SPACE)) {

			e.info = gara.CHECK;
			if (e.type === "mouseup") {
				this.setChecked(!this.checked);
			}
		}

		switch (e.type) {
		case "mousedown":
			if (e.target === this.toggleNode) {
				this.setExpanded(!this.expanded);
			}
			break;
			
		case "contextmenu":
			e.preventDefault();
			break;
		}
	},

	/**
	 * Searches the receiver's list starting at the first item (index 0) until an item is found 
	 * that is equal to the argument, and returns the index of that item. If no item is found, 
	 * returns -1. 
	 *
	 * @param {gara.widgets.TreeItem} item the search item
	 * @throws {TypeError} if the item is not a <code>TreeItem</code>
	 * @returns {int} the index of the item
	 */
	indexOf : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.widgets.TreeItem");
		}

		return this.items.indexOf(item);
	},
	
	/**
	 * Releases an item from the receiver.
	 *
	 * @private
	 * @param {gara.widgets.TreeItem} item the item that should removed from the receiver
	 * @returns {void}
	 */
	releaseItem : function (item) {
		if (this.items.contains(item)) {
			this.childContainer.removeChild(item.handle);
			this.items.remove(item);

			if (this.items.length === 0) {
				this.childContainer.style.display = "none";
				this.removeClass("garaTreeItemExpanded");
				this.removeClass("garaTreeItemCollapsed");
			}
		}
	},

	/**
	 * Removes an item from the receiver.
	 *
	 * @private
	 * @param {int} index the index of the item
	 * @returns {void}
	 */
	remove : function (index) {
		var item;
		this.checkWidget();

		item = this.items.removeAt(index)[0];
		this.tree.removeItem(item);

		if (!item.isDisposed()) {
			item.dispose();
		}

		if (!this.items.length && this.childContainer.style.display === "block") {
			this.childContainer.style.display = "none";
			this.toggleNode.className = "garaTreeItemToggler";
		}
	},

	/**
	 * Removes all items from the receiver.
	 *
	 * @returns {void}
	 */
	removeAll : function () {
		this.checkWidget();
		while (this.items.length) {
			this.remove(this.indexOf(this.items.pop()));
		}
	},

	/**
	 * Removes items which indices are passed as an array.
	 *
	 * @param {int[]} inidices the array with the indices
	 * @returns {void}
	 */
	removeArray : function (indices) {
		this.checkWidget();
		indices.forEach(function (index) {
			this.remove(index);
		}, this);
	},

	/**
	 * Removes items within an indices range.
	 *
	 * @param {int} start start index
	 * @param {int} end end index
	 * @returns {void}
	 */
	removeRange : function (start, end) {
		var i;
		this.checkWidget();

		for (i = start; i <= end; ++i) {
			this.remove(i);
		}
	},
//
//	/**
//	 * Sets the item active or inactive
//	 *
//	 * @private
//	 * @param {boolean} active true for active and false for inactive
//	 * @return {void}
//	 */
//	setActive : function (active) {
//		this.checkWidget();
//		this.active = active;
////		@TODO V 2.0
////		this.setClass("active", this.active);
//		if (this.span && this.active && this.span.className.indexOf("active") === -1) {
//			this.span.className += " active";
//		} else if (this.span && !this.active) {
//			this.span.className = this.span.className.replace(/active/g, "").trim();
//		}
//	},

	/**
	 * Sets the receiver's css class based on the grayed and checked state.
	 *
	 * @private
	 * @returns {void}
	 */
	setCheckboxClass : function () {
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
	 * Sets the receiver's checked state.
	 *
	 * @param {boolean} checked <code>true</code> for checked, <code>false</code> otherwise
	 * @returns {gara.widgets.TreeItem} this
	 */
	setChecked : function (checked) {
		if (!this.grayed) {
			this.checked = checked;
			this.handle.setAttribute("aria-checked", this.checked);
			if ((this.tree.getStyle() & gara.CHECK) !== 0) {
				this.setCheckboxClass();
			}
		}
		return this;
	},

	/**
	 * Sets the receiver's expanded state.
	 *
	 * @param {boolean} expanded <code>true</code> for expanded, <code>false</code> otherwise
	 * @returns {gara.widgets.TreeItem} this {void}
	 */
	setExpanded : function (expanded) {
		this.checkWidget();
		if (this.tree.notifyTreeListener(expanded ? "treeExpanded" : "treeCollapsed", this)) {
			this.expanded = expanded;
			this.handle.setAttribute("aria-expanded", this.expanded);
	
			if (!expanded) {
				this.deselectItems();
			}
			
			if (this.items.length) {
				this.setClass("garaTreeItemExpanded", this.expanded);
				this.setClass("garaTreeItemCollapsed", !this.expanded);
			} else {
				this.removeClass("garaTreeItemExpanded");
				this.removeClass("garaTreeItemCollapsed");
			}

			// update child container
			this.childContainer.style.display = this.expanded ? "block" : "none";
		}
		return this;
	},

	/**
	 * Sets the receiver's grayed state.
	 * 
	 * @param {boolean} grayed <code>true</code> for checked, <code>false</code> otherwise
	 * @returns {gara.widgets.TreeItem} this
	 */
	setGrayed : function (grayed) {
		this.grayed = grayed;
		this.checkbox.setAttribute("aria-disabled", this.grayed);
		this.setCheckboxClass();
		return this;
	},

	/**
	 * Sets the receiver's image to the argument, which may be null indicating that no image should 
	 * be displayed.
	 * 
	 * @param {int} columnIndex an index to set the new image for a column (optional)
	 * @param {Image} image the new image
	 * @returns {gara.widgets.TreeItem} this
	 */
	setImage : function (columnIndex, image) {
		if (typeof(image) === "undefined") {
			image = columnIndex;
			columnIndex = 0;
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

		this.images[columnIndex] = image;
		return this;
	},

	/**
	 * Sets the receiver's selected state.
	 * 
	 * @private
	 * @param {boolean} selected <code>true</code> for selected, <code>false</code> otherwise
	 * @returns {gara.widgets.TreeItem} this
	 */
	setSelected : function (selected) {
		this.checkWidget();
		this.selected = selected;
		this.handle.setAttribute("aria-selected", this.selected);
	},

	/**
	 * Sets the receiver's text.
	 * 
	 * @param {int} columnIndex an index to set the new text for a column (optional)
	 * @param {String} text the new text
	 * @returns {gara.widgets.TreeItem} this
	 */
	setText : function (columnIndex, text) {
		if (typeof(columnIndex) === "string") {
			text = columnIndex;
			columnIndex = 0;
		}

		this.texts[columnIndex] = text;
		this.spanText.nodeValue = text;
		return this;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	unindListener : function (eventType, listener) {
		gara.removeEventListener(this.img, eventType, listener);
		gara.removeEventListener(this.span, eventType, listener);
	},

	/**
	 * Updates this item.
	 *
	 * @private
	 * @returns {void}
	 */
	update : function () {
		var i, len, parentItems, bottom, item;
		this.checkWidget();

		// update items
		i = 0;
		len = this.items.length;
		while (i < len) {
			item = this.items[i];
			if (item.isDisposed()) {
				this.remove(i);
				len--;
			} else {
				item.update();
				i++;
			}
		}

		// check for bottom style
		parentItems = this.parent.getItems();
		bottom = parentItems.indexOf(this) === parentItems.length - 1;
		this.setClass("garaLastTreeItem", bottom);
//		this.childContainer.className = bottom ? "bottom" : "";
	}
};});