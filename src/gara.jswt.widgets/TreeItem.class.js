/*	$Id: TreeItem.class.js 181 2009-08-02 20:51:16Z tgossmann $

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
 * @class TreeItem
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Item
 */
$class("TreeItem", {
	$extends : gara.jswt.widgets.Item,

	$constructor : function(parent, style, index) {

		if (!($class.instanceOf(parent, gara.jswt.widgets.Tree) || $class.instanceOf(parent, gara.jswt.widgets.TreeItem))) {
			throw new TypeError("parent is neither a gara.jswt.widgets.Tree or gara.jswt.widgets.TreeItem");
		}

		this.$base(parent, style);

		this._images = [];
		this._texts = [];

		this._items = new Array();
		this._expanded = true;
		this._checked = false;
		this._grayed = false;
		this._selected = false;
		this._changed = false;
		this._parent = parent;
		this._tree = null;

		if ($class.instanceOf(parent, gara.jswt.widgets.Tree)) {
			this._tree = parent;
		} else if ($class.instanceOf(parent, gara.jswt.widgets.TreeItem)) {
			this._tree = parent.getParent();
			parent._addItem(this, index);
		}
		this._tree._addItem(this, index);

		// domNode references
		this._img = null;
		this._span = null;
		this._spanText = null;
		this._toggleNode = null;
		this._childContainer = null;
		this._checkbox = null;
	},

	/**
	 * @method
	 * Adds an item to this item
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.TreeItem} item the item to be added
	 * @throws {TypeError} when the item is not type of a TreeItem
	 * @return {void}
	 */
	_addItem : function(item, index) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TreeItem");
		}

		if (typeof(index) != "undefined") {
			this._items.insertAt(index, item);
		} else {
			this._items.push(item);
		}

		this._changed = true;
	},

	/**
	 * Internal method for creating a node representing an item. This is used for
	 * creating a new item or put updated content to an existing node of an earlier
	 * painted item.
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {boolean} wether this item is at the bottom position or not
	 * @return {void}
	 */
	_create : function() {
		// get item level
		var level = 1;
		var parent = this;
		while (parent.getParentItem() != null) {
			level++;
			parent = parent.getParentItem();
		}

		// create item node
		this.handle = document.createElement("li");
		this.handle.className = this._className;
		this.handle.widget = this;
		this.handle.control = this._tree;

		base2.DOM.Event(this.handle);
		this.handle.setAttribute("id", this.getId());
		this.handle.setAttribute("role", "treeitem");
		this.handle.setAttribute("aria-selected", this._selected);
		this.handle.setAttribute("aria-expanded", this._expanded);
		this.handle.setAttribute("aria-level", level);
		this.handle.setAttribute("aria-labelledby", this.getId()+"-label");

		// toggler
		this._toggleNode = document.createElement("span");
		this._toggleNode.widget = this;
		this._toggleNode.control = this._tree;
		this._toggleNode.className = "toggler" + (this._hasChilds()
			? (this._expanded ? " togglerExpanded" : " togglerCollapsed")
			: "");
		this.handle.appendChild(this._toggleNode);

		base2.DOM.Event(this._toggleNode);
		this._toggleNode.setAttribute("role", "presentation");

		// checkbox
		if ((this._tree.getStyle() & JSWT.CHECK) == JSWT.CHECK) {
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
		this._img.control = this._tree;
		base2.DOM.Event(this._img);
		this._img.setAttribute("role", "presentation");

		// set image
		if (this._image != null) {
			this._img.src = this._image.src;
		} else {
			this._img.style.display = "none";
		}

		// span and text
		this._spanText = document.createTextNode(this.getText());
		this._span = document.createElement("span");
		this._span.id = this.getId()+"-label";
		this._span.role = "presentation";
		this._span.widget = this;
		this._span.control = this._tree;
		this._span.className = "text";
		this._span.appendChild(this._spanText);
		base2.DOM.Event(this._span);
		this._span.setAttribute("role", "presentation");

		this.handle.appendChild(this._img);
		this.handle.appendChild(this._span);

		// register user-defined listeners
		for (var eventType in this._listeners) {
			this._listeners[eventType].forEach(function(elem, index, arr) {
				this._registerListener(eventType, elem);
			}, this);
		}

		// add to dom
		if ($class.instanceOf(this._parent, gara.jswt.widgets.Tree)) {
			this._parentNode = this._parent.handle;
		} else if ($class.instanceOf(this._parent, gara.jswt.widgets.TreeItem)) {
			this._parentNode = this._parent._getChildContainer();
		}

		var items = this._parent.getItems();
		var index = items.indexOf(this);
		var nextNode = index == 0
			? this._parentNode.firstChild
			: items[index - 1].handle.nextSibling;

		if (!nextNode) {
			this._parentNode.appendChild(this.handle);
		} else {
			this._parentNode.insertBefore(this.handle, nextNode);
		}

		// if childs are available, create container for them
		if (this._hasChilds()) {
			this._createChildContainer();
		}
	},

	/**
	 * @method
	 * Create container for items
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_createChildContainer : function() {
		this.checkWidget();
		this._childContainer = document.createElement('ul');

		base2.DOM.Event(this._childContainer);
		this._childContainer.setAttribute("role", "group");

		if (this.hasClass("bottom")) { // bottom
			this._childContainer.className = "bottom";
		}

		this._childContainer.style.display = this._expanded ? "block" : "none";
		this.handle.appendChild(this._childContainer);
	},

	/**
	 * @method
	 * Deselect all child items
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_deselectItems : function() {
		this.checkWidget();
		this._items.forEach(function(child, index, arr) {
			if (child._hasChilds()) {
				child._deselectItems();
			}
			this._tree._deselect(child);
		}, this);
	},

	dispose : function() {
		this.$base();

		if (this._childContainer != null) {
			this._items.forEach(function(item, index, arr){
				item.dispose();
			}, this);

			this.handle.removeChild(this._childContainer);
			delete this._childContainer;
		}

		if (this._img != null) {
			this.handle.removeChild(this._img);
			delete this._img;
			this._image = null;
		}


		this.handle.removeChild(this._toggleNode);
		this.handle.removeChild(this._span);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.handle);
		}

		delete this._toggleNode;
		delete this._span;
		delete this._spanText;
		delete this.handle;
	},

	/**
	 * @method
	 * Returns the child container
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {HTMLElement} the child container
	 */
	_getChildContainer : function() {
		if (this._childContainer == null) {
			this._createChildContainer();
		}
		return this._childContainer;
	},

	/**
	 * @method
	 * Returns the checked state for this item
	 *
	 * @author Thomas Gossmann
	 * @return {boolean} the checked state
	 */
	getChecked : function() {
		this.checkWidget();
		return this._checked;
	},

	/**
	 * @method
	 * Returns the expanded state for this item
	 *
	 * @author Thomas Gossmann
	 * @return {boolean} the expanded state
	 */
	getExpanded : function() {
		this.checkWidget();
		return this._expanded;
	},

	getGrayed : function() {
		this.checkWidget();
		return this._grayed;
	},

	getImage : function(columnIndex) {
		this.checkWidget();
		if (typeof(columnIndex) == "undefined"){columnIndex = 0;}
		return this._images[columnIndex];
	},

	/**
	 * @method
	 * Returns a specifiy item with a zero-related index
	 *
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {OutOfBoundsException} if the index does not live within this tree
	 * @return {gara.jswt.widgets.TreeItem} the item
	 */
	getItem : function(index) {
		this.checkWidget();
		if (index >= this._items.length) {
			throw new gara.OutOfBoundsException("Your item lives outside of this Tree");
		}

		return this._items[index];
	},

	/**
	 * @method
	 * Returns the amount of the items in the tree
	 *
	 * @author Thomas Gossmann
	 * @return {int} the amount
	 */
	getItemCount : function() {
		return this._items.length;
	},

	/**
	 * @method
	 * Returns an array with all the items in the tree
	 *
	 * @author Thomas Gossmann
	 * @return {gara.jswt.widgets.TreeItem[]} an array with the items
	 */
	getItems : function() {
		return this._items;
	},

	/**
	 * @method
	 * Returns the widgets parent, which must be a <tt>Tree</tt>
	 *
	 * @author Thomas Gossmann
	 * @return {gara.jswt.widgets.Tree} the parent of this widget
	 */
	getParent : function() {
		return this._tree;
	},

	/**
	 * @method
	 * Returns the item's parent item, which must be a <tt>TreeItem</tt> or null when the item is a root.
	 *
	 * @author Thomas Gossmann
	 * @return {gara.jswt.widgets.TreeItem} the parent item
	 */
	getParentItem : function() {
		if (this._parent == this._tree) {
			return null;
		} else {
			return this._parent;
		}
	},

	getText : function(columnIndex) {
		this.checkWidget();
		if (typeof(columnIndex) == "undefined"){columnIndex = 0;}
		return this._texts[columnIndex];
	},

	/**
	 * @method
	 * Returns wether there are items or not
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {boolean} true wether there are items or false if there are non
	 */
	_hasChilds : function() {
		return this._items.length > 0;
	},

	/**
	 * @method
	 * Internal event handler
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} e W3C event
	 * @return {void}
	 */
	handleEvent : function(e) {
		this.checkWidget();

		// hitting checkbox
		if ((e.target == this._checkbox	&& e.type == "mousedown")
				|| (e.target == this._checkbox	&& e.type == "mouseup")
				|| (e.type == "keydown" && e.keyCode == JSWT.SPACE)) {

			e.info = gara.jswt.JSWT.CHECK;
			if (e.type == "mouseup") {
				this.setChecked(!this._checked);
			}
		}

		switch (e.type) {
			case "mousedown":
				if (e.target == this._toggleNode) {
					this.setExpanded(!this._expanded);
				}
				break;

			case "dblclick":
				/*if ($class.instanceOf(obj, gara.jswt.widgets.TreeItem)) {
					var item = obj;

					// toggle childs
					if (e.target != this._toggleNode) {
						if (this._expanded) {
							this.setExpanded(false);
						} else {
							this.setExpanded(true);
						}

						this._tree.update();
					}
				}*/
				break;

			case "keyup":
			case "keydown":
			case "keypress":
//				this._notifyExternalKeyboardListener(e, this, this._tree);
				break;
		}
	},

	/**
	 * @method
	 * Looks for the index of a specified item
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.TreeItem} item the item for the index
	 * @throws {gara.jswt.widgets.ItemNotExistsException} if the item does not exist in this tree
	 * @throws {TypeError} if the item is not a TreeItem
	 * @return {int} the index of the specified item
	 */
	indexOf : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TreeItem");
		}

		if (!this._items.contains(item)) {
			throw new gara.jswt.widgets.ItemNotExistsException("item [" + item + "] does not exists in this list");
			return;
		}

		return this._items.indexOf(item);
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
	_registerListener : function(eventType, listener) {
		if (this._img != null) {
			gara.EventManager.addListener(this._img, eventType, listener);
		}

		if (this._span != null) {
			gara.EventManager.addListener(this._span, eventType, listener);
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
	remove : function(index) {
		this.checkWidget();
		var item = this._items.removeAt(index)[0];
		this._tree._removeItem(item);

		if (!item.isDisposed()) {
			item.dispose();
		}
		delete item;
	},

	/**
	 * @method
	 * Removes all items from the tree-item
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	removeAll : function() {
		this.checkWidget();
		while (this._items.length) {
			this.remove(this.indexOf(this._items.pop()));
		}
	},

	/**
	 * @method
	 * Removes items which indices are passed by an array
	 *
	 * @author Thomas Gossmann
	 * @param {Array} inidices the array with the indices
	 * @return {void}
	 */
	removeArray : function(indices) {
		this.checkWidget();
		indices.forEach(function(index) {
			this.remove(index);
		}, this);
	},

	/**
	 * @method
	 * Removes items within an indices range
	 *
	 * @author Thomas Gossmann
	 * @param {int} start start index
	 * @param {int} end end index
	 * @return {void}
	 */
	removeRange : function(start, end) {
		this.checkWidget();
		for (var i = start; i <= end; ++i) {
			this.remove(i);
		}
	},

	/**
	 * Sets the item active or inactive
	 *
	 * @author Thomas Gossmann
	 * @param {boolean} active true for active and false for inactive
	 * @return {void}
	 */
	_setActive : function(active) {
		this.checkWidget();
		this._active = active;
//		@TODO V 2.0
//		this.setClass("active", this._active);
		if (this._span && this._active && this._span.className.indexOf("active") == -1) {
			this._span.className += " active";
		} else if (this._span && !this._active) {
			this._span.className = this._span.className.replace(/active/g, "").trim();
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
		if (!this._grayed) {
			this._checked = checked;
			this.handle.setAttribute("aria-checked", this._checked);
			this._setCheckboxClass();
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
	setExpanded : function(expanded) {
		this.checkWidget();
		this._expanded = expanded;
		this.handle.setAttribute("aria-expanded", this._expanded);

		if (!expanded) {
			this._deselectItems();
		}

		this._toggleNode.className = "toggler" + (this._hasChilds()
			? (this._expanded ? " togglerExpanded" : " togglerCollapsed")
			: "");

		// update child container
		if (this._childContainer != null) {
			this._childContainer.style.display = this._expanded ? "block" : "none";
		}
		return this;
	},

	setGrayed : function(grayed) {
		this._grayed = grayed;
		this._checkbox.setAttribute("aria-disabled", this._grayed);
		this._setCheckboxClass();
		return this;
	},

	setImage : function(columnIndex, image) {
		if (typeof(image) == "undefined") {
			image = columnIndex;
			columnIndex = 0;
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

		this._images[columnIndex] = image;
		return this;
	},

	_setSelected : function(selected) {
		this.checkWidget();
		this._selected = selected;
		this.handle.setAttribute("aria-selected", this._selected);
	},

	setText : function(columnIndex, text) {
		if (typeof(columnIndex) == "string") {
			text = columnIndex;
			columnIndex = 0;
		}

		this._texts[columnIndex] = text;

		if (this.handle) {
			this._spanText.nodeValue = this._text;
		}
		return this;
	},

	toString : function() {
		return "[gara.jswt.widgets.TreeItem]";
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
	 * Updates this item
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function() {
		this.checkWidget();

		if (this.handle == null) {
			this._create();
		} else if (this._changed) {
			if (this._hasChilds()) {
				this._toggleNode.className = "toggler " + (this._expanded ? "togglerExpanded" : "togglerCollapsed");
			} else if (!this._hasChilds() && this._childContainer != null) {
				this._toggleNode.className = "toggler";
			}

			// if childs are available, create container for them
			if (this._hasChilds() && this._childContainer == null) {
				this._createChildContainer();
			}

			// delete childContainer
			else if (!this._hasChilds() && this._childContainer != null) {
				this.handle.removeChild(this._childContainer);
				this._childContainer = null;
			}

			this._changed = false;
		}

		// update items
		this._items.forEach(function(item, index) {
			if (item.isDisposed()) {
				this.remove(index);
			} else {
				item.update();
			}
		}, this);

		// check for bottom style
		var parentItems = this._parent.getItems();
		this.setClass("bottom", parentItems.indexOf(this) == parentItems.length - 1)
	}
});