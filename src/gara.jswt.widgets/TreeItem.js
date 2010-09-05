/*	$Id: TreeItem.class.js 181 2009-08-02 20:51:16Z tgossmann $

		gara - Javascript Toolkit
	================================================================================================================

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

	================================================================================================================
*/

gara.provide("gara.jswt.widgets.TreeItem", "gara.jswt.widgets.Item");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");
//gara.require("gara.jswt.widgets.Tree");

/**
 * gara TreeItem
 *
 * @class TreeItem
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Item
 */
gara.Class("gara.jswt.widgets.TreeItem", function () { return {
	$extends : gara.jswt.widgets.Item,

	/**
	 * @field
	 * DOM reference of the checkbox.
	 *
	 * @privte
	 * @type {HTMLElement}
	 */
	checkbox : null,

	/**
	 * @field
	 * Holds the checked state.
	 *
	 * @private
	 * @type {boolean}
	 */
	checked : false,

	/**
	 * @field
	 * DOM reference of the child container.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	childContainer : null,

	/**
	 * @field
	 * Holds the expanded state.
	 *
	 * @private
	 * @type {boolean}
	 */
	expanded : true,

	/**
	 * @field
	 * Holds the grayed state.
	 *
	 * @private
	 * @type {boolean}
	 */
	grayed : false,

	/**
	 * @field
	 * Contains the images for each column.
	 *
	 * @private
	 * @type {Image[]}
	 */
	images : [],

	/**
	 * @field
	 * DOM reference of the image.
	 *
	 * @private
	 * @type {}
	 */
	img : null,

	/**
	 * @field
	 * Contains the sub items.
	 *
	 * @private
	 * @type {gara.jswt.widgets.TreeItem[]}
	 */
	items : [],

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
	 * DOM reference of the span.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	span : null,

	/**
	 * @field
	 * DOM reference of the span's text.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	spanText : null,

	/**
	 * @field
	 * Contains the text for each column.
	 *
	 * @private
	 * @type {String[]}
	 */
	texts : [],

	/**
	 * @field
	 * DOM reference of the toggler.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	toggleNode : null,

	/**
	 * @field
	 * Contains the assigned <code>Tree</code>.
	 *
	 * @private
	 * @type {gara.jswt.widgets.Tree}
	 */
	tree : null,

	$constructor : function (parent, style, index) {
		if (!(parent instanceof gara.jswt.widgets.Tree || parent instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("parent is neither a gara.jswt.widgets.Tree nor gara.jswt.widgets.TreeItem");
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

		if (parent instanceof gara.jswt.widgets.Tree) {
			this.tree = parent;
			this.parentNode = this.tree.addItem(this, index);
		} else if (parent instanceof gara.jswt.widgets.TreeItem) {
			this.parentNode = parent.addItem(this, index);
			this.tree = parent.getParent();
			this.tree.addItem(this, index);
		}

		this.createWidget();
	},

	/**
	 * @method
	 * Adds an item to this item
	 *
	 * @private
	 * @param {gara.jswt.widgets.TreeItem} item the item to be added
	 * @throws {TypeError} when the item is not type of a TreeItem
	 * @return {void}
	 */
	addItem : function (item, index) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TreeItem");
		}

		if (typeof(index) !== "undefined") {
			this.items.insertAt(index, item);
		} else {
			this.items.add(item);
		}

		if (this.items.length) {
			this.childContainer.style.display = this.expanded ? "block" : "none";
			this.toggleNode.className = "toggler " + (this.expanded ? "togglerExpanded" : "togglerCollapsed");
		}

		return this.childContainer;
	},

	/**
	 * @method
	 * Registers Listener for this widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {String} eventType the event type
	 * @param {Object} listener the listener
	 * @return {void}
	 */
	bindListener : function (eventType, listener) {
		gara.EventManager.addListener(this.img, eventType, listener);
		gara.EventManager.addListener(this.span, eventType, listener);
	},

	/**
	 * Internal method for creating a node representing an item. This is used for
	 * creating a new item or put updated content to an existing node of an earlier
	 * painted item.
	 *
	 * @private
	 * @param {boolean} wether this item is at the bottom position or not
	 * @return {void}
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
		this.handle.className = this.classes.join(" ");
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
		this.toggleNode.className = "toggler";
		this.toggleNode.setAttribute("role", "presentation");
		this.handle.appendChild(this.toggleNode);

		// checkbox
		if ((this.tree.getStyle() & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK) {
			this.checkbox = document.createElement("span");
			this.checkbox.id = this.getId() + "-checkbox";
			this.checkbox.widget = this;
			this.checkbox.control = this.tree;
			this.checkbox.setAttribute("role", "presentation");

			this.handle.appendChild(this.checkbox);
			this.handle.setAttribute("aria-checked", this.checked);
		}

		// create image node
		this.img = document.createElement("img");
		this.img.id = this.getId() + "-image";
		this.img.widget = this;
		this.img.control = this.tree;
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
		this.span.className = "text";
		this.span.appendChild(this.spanText);
		this.span.setAttribute("role", "presentation");
		this.handle.appendChild(this.span);

		// child container
		this.childContainer = document.createElement('ul');
		this.childContainer.setAttribute("role", "group");
		this.childContainer.style.display = "none";
		this.handle.appendChild(this.childContainer);

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
			this.childContainer.className = "bottom";
			this.addClass("bottom");
		}
	},

	/**
	 * @method
	 * Deselect all child items
	 *
	 * @private
	 * @return {void}
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
	 * @method
	 * Returns the checked state for this item
	 *
	 * @return {boolean} the checked state
	 */
	getChecked : function () {
		this.checkWidget();
		return this.checked;
	},

	/**
	 * @method
	 * Returns the expanded state for this item
	 *
	 * @return {boolean} the expanded state
	 */
	getExpanded : function () {
		this.checkWidget();
		return this.expanded;
	},

	getGrayed : function () {
		this.checkWidget();
		return this.grayed;
	},

	getImage : function (columnIndex) {
		this.checkWidget();
		columnIndex = columnIndex || 0;
		return this.images[columnIndex];
	},

	/**
	 * @method
	 * Returns a specifiy item with a zero-related index
	 *
	 * @param {int} index the zero-related index
	 * @throws {RangeError} when there is no item at the given index
	 * @return {gara.jswt.widgets.TreeItem} the item
	 */
	getItem : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) == "undefined") {
			throw new RangeError("There is no item for the given index");
		}

		return this.items[index];
	},

	/**
	 * @method
	 * Returns the amount of the items in the tree
	 *
	 * @return {int} the amount
	 */
	getItemCount : function () {
		return this.items.length;
	},

	/**
	 * @method
	 * Returns an array with all the items in the tree
	 *
	 * @return {gara.jswt.widgets.TreeItem[]} an array with the items
	 */
	getItems : function () {
		return this.items;
	},

	/**
	 * @method
	 * Returns the widgets parent, which must be a <tt>Tree</tt>
	 *
	 * @return {gara.jswt.widgets.Tree} the parent of this widget
	 */
	getParent : function () {
		return this.tree;
	},

	/**
	 * @method
	 * Returns the item's parent item, which must be a <tt>TreeItem</tt> or null when the item is a root.
	 *
	 * @return {gara.jswt.widgets.TreeItem} the parent item
	 */
	getParentItem : function () {
		if (this.parent === this.tree) {
			return null;
		} else {
			return this.parent;
		}
	},

	getText : function (columnIndex) {
		this.checkWidget();
		columnIndex = columnIndex || 0;
		return this.texts[columnIndex];
	},

	/**
	 * @method
	 * Internal event handler
	 *
	 * @private
	 * @param {Event} e W3C event
	 * @return {void}
	 */
	handleEvent : function (e) {
		this.checkWidget();

		// hitting checkbox
		if ((e.target === this.checkbox	&& e.type === "mousedown")
				|| (e.target === this.checkbox	&& e.type === "mouseup")
				|| (e.type === "keydown" && e.keyCode === gara.jswt.JSWT.SPACE)) {

			e.info = gara.jswt.gara.jswt.JSWT.CHECK;
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
		}
	},

	/**
	 * @method
	 * Looks for the index of a specified item
	 *
	 * @param {gara.jswt.widgets.TreeItem} item the item for the index
	 * @throws {TypeError} if the item is not a TreeItem
	 * @return {int} the index of the specified item or -1 if it does not exist
	 */
	indexOf : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TreeItem");
		}

		return this.items.indexOf(item);
	},
	
	
	/**
	 * @method
	 * Releases an item from the receiver
	 *
	 * @private
	 * @param {gara.jswt.widgets.TreeItem} item the item that should removed from the receiver
	 * @return {void}
	 */
	releaseItem : function (item) {
		if (this.items.contains(item)) {
			this.childContainer.removeChild(item.handle);
			this.items.remove(item);
		}
	},


	/**
	 * @method
	 * Removes an item from the tree-item
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the index of the item
	 * @return {void}
	 */
	remove : function (index) {
		var item;
		this.checkWidget();

		item = this.items.removeAt(index)[0];
		this.tree.removeItem(item);

		if (!item.isDisposed()) {
			item.dispose();
		}
		delete item;

		if (!this.items.length && this.childContainer.style.display === "block") {
			this.childContainer.style.display = "none";
			this.toggleNode.className = "toggler";
		}
	},

	/**
	 * @method
	 * Removes all items from the tree-item
	 *
	 * @return {void}
	 */
	removeAll : function () {
		this.checkWidget();
		while (this.items.length) {
			this.remove(this.indexOf(this.items.pop()));
		}
	},

	/**
	 * @method
	 * Removes items which indices are passed by an array
	 *
	 * @param {int[]} inidices the array with the indices
	 * @return {void}
	 */
	removeArray : function (indices) {
		this.checkWidget();
		indices.forEach(function (index) {
			this.remove(index);
		}, this);
	},

	/**
	 * @method
	 * Removes items within an indices range
	 *
	 * @param {int} start start index
	 * @param {int} end end index
	 * @return {void}
	 */
	removeRange : function (start, end) {
		var i;
		this.checkWidget();

		for (i = start; i <= end; ++i) {
			this.remove(i);
		}
	},

	/**
	 * Sets the item active or inactive
	 *
	 * @private
	 * @param {boolean} active true for active and false for inactive
	 * @return {void}
	 */
	setActive : function (active) {
		this.checkWidget();
		this.active = active;
//		@TODO V 2.0
//		this.setClass("active", this.active);
		if (this.span && this.active && this.span.className.indexOf("active") === -1) {
			this.span.className += " active";
		} else if (this.span && !this.active) {
			this.span.className = this.span.className.replace(/active/g, "").trim();
		}
	},

	/**
	 * @private
	 */
	setCheckboxClass : function () {
		this.checkbox.className = "jsWTCheckbox";
		if (this.checked && this.grayed) {
			this.checkbox.className += " jsWTCheckboxGrayedChecked";
		} else if (this.grayed) {
			this.checkbox.className += " jsWTCheckboxGrayed";
		} else if (this.checked) {
			this.checkbox.className += " jsWTCheckboxChecked";
		}
	},

	/**
	 * @method
	 * Sets the checked state for this item
	 *
	 * @param {boolean} checked the new checked state
	 * @return {void}
	 */
	setChecked : function (checked) {
		if (!this.grayed) {
			this.checked = checked;
			this.handle.setAttribute("aria-checked", this.checked);
			this.setCheckboxClass();
		}
		return this;
	},

	/**
	 * @method
	 * Sets a new expanded state for the item
	 *
	 * @author Thomas Gossmann
	 * @param {boolean} expanded the new expanded state
	 * @return {void}
	 */
	setExpanded : function (expanded) {
		this.checkWidget();
		if (this.tree.notifyTreeListener(expanded ? "treeExpanded" : "treeCollapsed", this)) {
			this.expanded = expanded;
			this.handle.setAttribute("aria-expanded", this.expanded);
	
			if (!expanded) {
				this.deselectItems();
			}
	
			this.toggleNode.className = "toggler" + (this.items.length
				? (this.expanded ? " togglerExpanded" : " togglerCollapsed")
				: "");
	
			// update child container
			this.childContainer.style.display = this.expanded ? "block" : "none";
		}
		return this;
	},

	setGrayed : function (grayed) {
		this.grayed = grayed;
		this.checkbox.setAttribute("aria-disabled", this.grayed);
		this.setCheckboxClass();
		return this;
	},

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
	 * @private
	 */
	setSelected : function (selected) {
		this.checkWidget();
		this.selected = selected;
		this.handle.setAttribute("aria-selected", this.selected);
	},

	setText : function (columnIndex, text) {
		if (typeof(columnIndex) === "string") {
			text = columnIndex;
			columnIndex = 0;
		}

		this.texts[columnIndex] = text;
		this.spanText.nodeValue = text;
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
	unindListener : function (eventType, listener) {
		gara.EventManager.removeListener(this.img, eventType, listener);
		gara.EventManager.removeListener(this.span, eventType, listener);
	},

	/**
	 * @method
	 * Updates this item
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function () {
		var i, len, parentItems, bottom;
		this.checkWidget();

		// update items
		i = 0;
		len = this.items.length;
		while (i < len) {
			var item = this.items[i];
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
		this.setClass("bottom", bottom);
		this.childContainer.className = bottom ? "bottom" : "";
	}
};});