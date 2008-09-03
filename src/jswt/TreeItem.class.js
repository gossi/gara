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
 * @class TreeItem
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends gara.jswt.Item
 */
$class("TreeItem", {
	$extends : gara.jswt.Item,
	
	toggleNode : null,

	$constructor : function(parent, style, index) {
		
		if (!($class.instanceOf(parent, gara.jswt.Tree) || $class.instanceOf(parent, gara.jswt.TreeItem))) {
			throw new TypeError("parent is neither a gara.jswt.Tree or gara.jswt.TreeItem");
		}
		
		this.$base(parent, style);

		this._images = [];
		this._texts = [];

		this._items = new Array();
		this._expanded = true;
		this._checked = false;
		this._changed = false;
		this._parent = parent;
		this._tree = null;

		if ($class.instanceOf(parent, gara.jswt.Tree)) {
			this._tree = parent;
		} else if ($class.instanceOf(parent, gara.jswt.TreeItem)) {
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
	},

	/**
	 * @method
	 * Adds an item to this item
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TreeItem} item the item to be added
	 * @throws {TypeError} when the item is not type of a TreeItem
	 * @return {void}
	 */
	_addItem : function(item, index) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
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
		/*
		 * DOM of created item:
		 * 
		 * <li>
		 *  <span class="toggler [togglerExpanded] [togglerCollapsed]"></span>
		 *  [<img src=""/>]
		 *  <span class="text"></span>
		 * </li>
		 */

		if ($class.instanceOf(this._parent, gara.jswt.Tree)) {
			this._parentNode = this._parent.domref;
		} else if ($class.instanceOf(this._parent, gara.jswt.TreeItem)) {
			this._parentNode = this._parent._getChildContainer();
		}

		var parentItems = this._parent.getItems();

		this.removeClassName("bottom");
		if (parentItems.indexOf(this) == parentItems.length - 1) {
			// if bottom
			this.addClassName("bottom");
		}

		// create item node
		this.domref = document.createElement("li");
		this.domref.className = this._className;
		this.domref.obj = this;
		this.domref.control = this._tree;
		base2.DOM.EventTarget(this.domref);

		// create item nodes
		this._toggleNode = document.createElement("span");
		this._toggleNode.obj = this;
		this._toggleNode.control = this._tree;
		base2.DOM.EventTarget(this._toggleNode);
		
		this._span = document.createElement("span");
		this._span.obj = this;
		this._span.control = this._tree;
		this._span.className = "text";
		this._spanText = document.createTextNode(this.getText());
		this._span.appendChild(this._spanText);
		base2.DOM.EventTarget(this._span);
	
		// set this.toggler
		this._toggleNode.className = "toggler";
		this._toggleNode.className += this._hasChilds() 
			? (this._expanded
				? " togglerExpanded"
				: " togglerCollapsed")
			: "";
		this.domref.appendChild(this._toggleNode);
	
		// set image
		if (this.getImage() != null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.src = this.getImage().src;
			this._img.control = this._tree;
			base2.DOM.EventTarget(this._img);
	
			// put the image into the dom
			this.domref.appendChild(this._img);
		}

		
		this.domref.appendChild(this._span);
	
		// if childs are available, create container for them
		if (this._hasChilds()) {
			this._createChildContainer();
		}

		/* register user-defined listeners */
		for (var eventType in this._listeners) {
			this._listeners[eventType].forEach(function(elem, index, arr) {
				this._registerListener(eventType, elem);
			}, this);
		}
		
		this._parentNode.appendChild(this.domref);
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
		base2.DOM.EventTarget(this._childContainer);
	
		if (this.getClassName().indexOf("bottom") != -1) { // bottom
			this._childContainer.className = "bottom";
		}
	
		if (this._expanded) {
			this._childContainer.style.display = "block";
		} else {
			this._childContainer.style.display = "none";
		}
		
		this.domref.appendChild(this._childContainer);
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
			this._tree.deselect(child);
		}, this);
	},
	
	dispose : function() {
		this.$base();

		if (this._childContainer != null) {
			this._items.forEach(function(item, index, arr){
				item.dispose();
			}, this);

			this.domref.removeChild(this._childContainer);
			delete this._childContainer;
		}

		if (this._img != null) {
			this.domref.removeChild(this._img);
			delete this._img;
			this._image = null;
		}

		this.domref.removeChild(this._toggleNode);
		this.domref.removeChild(this._span);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.domref);
		}

		delete this._toggleNode;
		delete this._span;
		delete this._spanText;
		delete this.domref;
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
	
	getImage : function(columnIndex) {
		this.checkWidget();
		if (typeof(columnIndex) == "undefined")
			columnIndex = 0;
		return this._images[columnIndex];
	},

	/**
	 * @method
	 * Returns a specifiy item with a zero-related index
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {OutOfBoundsException} if the index does not live within this tree
	 * @return {gara.jswt.TreeItem} the item
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
	 * @return {gara.jswt.TreeItem[]} an array with the items
	 */
	getItems : function() {
		return this._items;
	},

	/**
	 * @method
	 * Returns the widgets parent, which must be a <tt>Tree</tt>
	 * 
	 * @author Thomas Gossmann
	 * @return {gara.jswt.Tree} the parent of this widget
	 */
	getParent : function() {
		return this._tree;
	},

	/**
	 * @method
	 * Returns the item's parent item, which must be a <tt>TreeItem</tt> or null when the item is a root.
	 * 
	 * @author Thomas Gossmann
	 * @return {gara.jswt.TreeItem} the parent item
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
		if (typeof(columnIndex) == "undefined")
			columnIndex = 0;
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
		var obj = e.target.obj || null;

		switch (e.type) {
			case "mousedown":
				if ($class.instanceOf(obj, gara.jswt.TreeItem)) {
					var item = obj;

					if (e.target == this._toggleNode) {
						if (this._expanded) {
							this.setExpanded(false);
						} else {
							this.setExpanded(true);
						}
						this._tree.update();
					}
				}
				break;

			case "dblclick":
				/*if ($class.instanceOf(obj, gara.jswt.TreeItem)) {
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
				this._notifyExternalKeyboardListener(e, this, this._tree);
				break;
		}
	},

	/**
	 * @method
	 * Looks for the index of a specified item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TreeItem} item the item for the index
	 * @throws {gara.jswt.ItemNotExistsException} if the item does not exist in this tree
	 * @throws {TypeError} if the item is not a TreeItem
	 * @return {int} the index of the specified item
	 */
	indexOf : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.TreeItem");
		}

		if (!this._items.contains(item)) {
			throw new gara.jswt.ItemNotExistsException("item [" + item + "] does not exists in this list");
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
		item.dispose();
		delete item;
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
	 * @method
	 * Removes items which indices are passed by an array
	 * 
	 * @author Thomas Gossmann
	 * @param {Array} inidices the array with the indices
	 * @return {void}
	 */
	removeFromArray : function(indices) {
		this.checkWidget();
		indices.forEach(function(item, index, arr) {
			this.remove(index);
		}, this);
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
			var item = this._items.pop();
			this.domref.removeChild(item.domref);
			delete item;
		}
	},

	/**
	 * Sets the item active or inactive
	 * 
	 * @author Thomas Gossmann
	 * @param {boolean} active true for active and false for inactive
	 * @return {void}
	 */
	setActive : function(active) {
		this.checkWidget();
		this._active = active;
	
		if (active) {
			this._span.className += " active";
		} else {
			this._span.className = this._span.className.replace(/ *active/, "");
		}
	
		this._changed = true;
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
		if (checked) {
			this._span.className = "text selected";
		} else {
			this._span.className = "text";
		}
		
		this._checked = checked;
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

		if (!expanded) {
			this._deselectItems();
		}
		
		this._changed = true;
	},
	
	setImage : function(columnIndex, image) {
		if ($class.instanceOf(columnIndex, Image)) {
			image = columnIndex;
			columnIndex = 0;
		}
		
		this._images[columnIndex] = image;
	},
	
	setText : function(columnIndex, text) {
		if (typeof(columnIndex) == "string") {
			text = columnIndex;
			columnIndex = 0;
		}
		
		this._texts[columnIndex] = text;
	},
	
	toString : function() {
		return "[gara.jswt.TreeItem]";
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
		
		if (this.domref == null) {
			this._create();
		} else if (this.hasChanged()) {
			if (this._hasChilds()) {
				this._toggleNode.className = strReplace(this._toggleNode.className, " togglerCollapsed", "");
				this._toggleNode.className = strReplace(this._toggleNode.className, " togglerExpanded", "");
				
				if (this._expanded) {
					this._toggleNode.className += " togglerExpanded";
				}
				else {
					this._toggleNode.className += " togglerCollapsed";
				}
			}

			// create image
			if (this.getImage() != null && this._img == null) {
				this._img = document.createElement("img");
				this._img.obj = this;
				this._img.control = this._tree;
				this._img.alt = this.getText();
				this._img.src = this.getImage().src;
				this.domref.insertBefore(this._img, this._span);
				base2.DOM.EventTarget(this._img);
			}

			// update image information
			else if (this.getImage() != null) {
				this._img.src = this.getImage().src;
				this._img.alt = this._text;
			}

			// delete image
			else if (this._img != null && this.getImage() == null) {
				this.domref.removeChild(this._img);
				this._img = null;
			}

			// if childs are available, create container for them
			if (this._hasChilds() && this._childContainer == null) {
				this._createChildContainer();
			}

			// update expanded state
			if (this._childContainer != null) {
				if (this._expanded) {
					this._childContainer.style.display = "block";
				} else {
					this._childContainer.style.display = "none";
				}
			}
			// delete childContainer
			else if (!this._hasChilds() && this._childContainer != null) {
				this.domref.removeChild(this._childContainer);
				this._childContainer = null;
			}

			// check for bottom style
			var parentItems = this._parent.getItems();
			this.removeClassName("bottom");
			if (parentItems.indexOf(this) == parentItems.length - 1) {
				// if bottom
				this.addClassName("bottom");
			}

			this._spanText.nodeValue = this.getText();
			this.domref.className = this._className;

			this.releaseChange();
		}
		
		// update items
		this._items.forEach(function(item, index, arr) {
			item.update();
		}, this);
	}
});