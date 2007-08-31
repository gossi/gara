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
 * @extends Item
 */
$class("TreeItem", {
	$extends : gara.jswt.Item,

	$constructor : function(parentWidget) {
		this.$base();

		if (!($class.instanceOf(parentWidget, gara.jswt.Tree) || $class.instanceOf(parentWidget, gara.jswt.TreeItem))) {
			throw new TypeError("parentWidget is neither a gara.jswt.Tree or gara.jswt.TreeItem");
		}

		this._items = new Array();
		this._expanded = true;
		this._checked = false;
		this._changed = false;
		this._childContainer = null;
		this._parent = parentWidget;
		this._tree = null;

		if ($class.instanceOf(parentWidget, gara.jswt.Tree)) {
			this._tree = parentWidget;
		} else if ($class.instanceOf(parentWidget, gara.jswt.TreeItem)) {
			this._tree = parentWidget.getParent();
			parentWidget._addItem(this);
		}
		this._tree._addItem(this);

		// domNode references
		this._img = null;
		this._toggler = null;
		this._span = null;
		this._spanText = null;
	},

	/**
	 * @method
	 * Adds an item to this item
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TreeItem} item the item to be added
	 * @throws {TypeError} when the item is not type of a TreeItem
	 * @returns {void}
	 */
	_addItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}
	
		this._items.push(item);
	},
	
	/**
	 * Internal method for creating a node representing an item. This is used for
	 * creating a new item or put updated content to an existing node of an earlier
	 * painted item.
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {boolean} wether this item is at the bottom position or not
	 * @returns {void}
	 */
	create : function(bottom) {
		/*
		 * DOM of created item:
		 * 
		 * old:
		 * <li>
		 *  <span class="toggler [togglerExpanded] [togglerCollapsed]"></span>
		 *  <span class="textBox">
		 *   [<img src=""/>]
		 *   <span class="text"></span>
		 *  </span>
		 * </li>
		 * 
		 * new:
		 * <li>
		 *  <span class="toggler [togglerExpanded] [togglerCollapsed]"></span>
		 *  [<img src=""/>]
		 *  <span class="text"></span>
		 * </li>
		 */
	
		if (bottom) {
			this.addClassName("bottom");
		}

		// create item node
		this.domref = document.createElement("li");
		this.domref.className = this._className;
		this.domref.obj = this;
		this.domref.control = this._tree;
		base2.DOM.EventTarget(this.domref);
	
		// create item nodes
		this._toggler = document.createElement("span");
		this._toggler.obj = this;
		this._toggler.control = this._tree;
		base2.DOM.EventTarget(this._toggler);
		
		this._span = document.createElement("span");
		this._span.obj = this;
		this._span.control = this._tree;
		this._span.className = "text";
		this._spanText = document.createTextNode(this._text);
		this._span.appendChild(this._spanText);
		base2.DOM.EventTarget(this._span);
	
		// set this.toggler
		this._toggler.className = "toggler";
		this._toggler.className += this._hasChilds() 
			? (this._expanded
				? " togglerExpanded"
				: " togglerCollapsed")
			: "";
		this.domref.appendChild(this._toggler);
	
		// set image
		if (this._image != null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.src = this._image.src;
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
				this.registerListener(eventType, elem);
			}, this);
		}
	},

	/**
	 * @method
	 * Create container for items
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	_createChildContainer : function() {
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
	 * @returns {void}
	 */
	_deselectItems : function() {
		this._items.forEach(function(child, index, arr) {
			if (child._hasChilds()) {
				child._deselectItems();
			}
			this._tree.deselect(child);
		}, this);
	},

	/**
	 * @method
	 * Returns the child container
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {HTMLElement} the child container
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
	 * @returns {boolean} the checked state
	 */
	getChecked : function() {
		return this._checked;
	},
	
	/**
	 * @method
	 * Returns the expanded state for this item
	 * 
	 * @author Thomas Gossmann
	 * @returns {boolean} the expanded state
	 */
	getExpanded : function() {
		return this._expanded;
	},

	/**
	 * @method
	 * Returns a specifiy item with a zero-related index
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {OutOfBoundsException} if the index does not live within this tree
	 * @returns {gara.jswt.TreeItem} the item
	 */
	getItem : function(index) {
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
	 * @returns {int} the amount
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
	 * @returns {gara.jswt.Tree} the parent of this widget
	 */
	getParent : function() {
		return this._tree;
	},

	/**
	 * @method
	 * Returns the item's parent item, which must be a <tt>TreeItem</tt> or null when the item is a root.
	 * 
	 * @author Thomas Gossmann
	 * @returns {gara.jswt.TreeItem} the parent item
	 */
	getParentItem : function() {
		if (this._parent == this._tree) {
			return null;
		} else {
			return this._parent;
		}
	},

	/**
	 * @method
	 * Returns wether there are items or not
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {boolean} true wether there are items or false if there are non
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
	 * @returns {void}
	 */
	handleEvent : function(e) {
		var obj = e.target.obj || null;

		switch (e.type) {
			case "mousedown":
				if ($class.instanceOf(obj, gara.jswt.TreeItem)) {
					var item = obj;

					if (e.target == this._toggler) {
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
				if ($class.instanceOf(obj, gara.jswt.TreeItem)) {
					var item = obj;

					// toggle childs
					if (e.target != this._toggler) {
						if (this._expanded) {
							this.setExpanded(false);
						} else {
							this.setExpanded(true);
						}

						this._tree.update();
					}
				}
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
	 * @returns {int} the index of the specified item
	 */
	indexOf : function(item) {
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
	registerListener : function(eventType, listener) {
		if (this._img != null) {
			gara.EventManager.getInstance().addListener(this._img, eventType, listener);
		}
	
		if (this._span != null) {
			gara.EventManager.getInstance().addListener(this._span, eventType, listener);
		}
	},

	/**
	 * @method
	 * Removes all items from that item
	 * 
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	removeAll : function() {
		this._items = [];
	},

	/**
	 * Sets the item active or inactive
	 * 
	 * @author Thomas Gossmann
	 * @param {boolean} active true for active and false for inactive
	 * @returns {void}
	 */
	setActive : function(active) {
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
	 * @returns {void}
	 */
	setChecked : function(checked) {
		//TODO: Respect selection flag from tree - if this has been done here...
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
	 * @returns {void}
	 */
	setExpanded : function(expanded) {
		this._expanded = expanded;

		if (!expanded) {
			this._deselectItems();
		}
		
		this._changed = true;
	},
	
	toString : function() {
		return "[gara.jswt.TreeItem]";
	},
	
	/**
	 * @method
	 * Updates this item
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	update : function() {
		if (this._hasChilds()) {
			this._toggler.className = strReplace(this._toggler.className, " togglerCollapsed", "");
			this._toggler.className = strReplace(this._toggler.className, " togglerExpanded", "");
	
			if (this._expanded) {
				this._toggler.className += " togglerExpanded";
			} else {
				this._toggler.className += " togglerCollapsed";
			}
		}

		// create image
		if (this._image != null && this._img == null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._tree;
			this._img.alt = this._text;
			this._img.src = this._image.src;
			this.domref.insertBefore(this._img, this._span);
			base2.DOM.EventTarget(this._img);
		}

		// update image information
		else if (this._image != null) {
			this._img.src = this._image.src;
			this._img.alt = this._text;
		}
		
		// delete image
		else if (this._img != null && this._image == null) {
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

		this._spanText.nodeValue = this._text;
		this.domref.className = this._className;
	}
});