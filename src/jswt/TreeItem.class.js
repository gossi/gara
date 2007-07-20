/*	$Id: $

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
 * @class TreeItem
 * @namespace gara.jswt
 */
$class("TreeItem", {
	$extends : Item,
	
	$constructor : function(parentWidget) {
		this.$base();

		if (!($class.instanceOf(parentWidget, gara.jswt.Tree) || $class.instanceOf(parentWidget, gara.jswt.TreeItem))) {
			throw new TypeError("parentWidget is neither a gara.jswt.Tree or gara.jswt.TreeItem");
		}

		this._childs = new Array();
		this._isExpanded = true;
		this._changed = false;
		this._childContainer = null;
		this._parent = parentWidget;
		this._tree = null;

		if ($class.instanceOf(parentWidget, gara.jswt.Tree)) {
			this._tree = parentWidget;
			this._tree._addFirstLevelItem(this);
		} else if ($class.instanceOf(parentWidget, gara.jswt.TreeItem)) {
			this._tree = parentWidget.getTree();
			this._tree._addItem(this);
		}
		parentWidget._addItem(this);

		// domNode references
		this._img = null;
		this._toggler = null;
		this._span = null;
		this._spanText = null;
	},
	
	_addItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}
	
		this._childs.push(item);
	},
	
	collapse : function() {
		if (this._childContainer != null) {
			this._childContainer.style.display = "none";
		}
	
		this._deselectChilds();
		this._isExpanded = false;
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
	
		// create item nodes
		this._toggler = document.createElement("span");
		this._toggler.obj = this;
		this._toggler.control = this._tree;
		this._span = document.createElement("span");
		this._span.obj = this;
		this._span.control = this._tree;
		this._span.className = "text";
		this._spanText = document.createTextNode(this._text);
		this._span.appendChild(this._spanText);
	
		// set this.toggler
		this._toggler.className = "toggler";
		this._toggler.className += this.hasChilds() 
			? (this.isExpanded()
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
	
			// put the image into the dom
			this.domref.appendChild(this._img);
		}
		
		this.domref.appendChild(this._span);
	
		// if childs are available, create container for them
		if (this.hasChilds()) {
			this._createChildContainer();
		}
	},
	
	_createChildContainer : function() {
		this._childContainer = document.createElement('ul');
	
		if (this.getClassName().indexOf("bottom") != -1) { // bottom
			this._childContainer.className = "bottom";
		}
	
		if (this.isExpanded()) {
			this._childContainer.style.display = "block";
		} else {
			this._childContainer.style.display = "none";
		}
		
		this.domref.appendChild(this._childContainer);
	},
	
	_deselectChilds : function() {
		this._childs.forEach(function(child, index, arr) {
			if (child.hasChilds()) {
				child._deselectChilds();
			}
			this._tree.deselect(child);
		}, this);
	},
	
	expand : function() {
		if (this._childContainer != null) {
			this._childContainer.style.display = "block";
		}
		this._isExpanded = true;
		this._changed = true;
	},
	
	_getChildContainer : function() {
		if (this._childContainer == null) {
			this._createChildContainer();
		}
		return this._childContainer;
	},
	
	getItemCount : function() {
		return this._childs.length;
	},
	
	getItems : function() {
		return this._childs;
	},

	getParent : function() {
		return this._parent;
	},
	
	getTree : function() {
		return this._tree;
	},
	
	hasChilds : function() {
		return this._childs.length > 0;
	},
	
	isExpanded : function() {
		return this._isExpanded;
	},
	
	registerListener : function(eventType, listener) {
		if (this._img != null) {
			gara.eventManager.addListener(this._img, eventType, listener);
		}
	
		if (this._span != null) {
			gara.eventManager.addListener(this._span, eventType, listener);
		}
	},
	
	/**
	 * Sets the item active or inactive (Override from Item)
	 * 
	 * @author Thomas Gossmann
	 * @param {boolean} bActive true for active and false for inactive
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
	
	setChildContainer : function(container) {
//		if (!container instanceof HTMLElement) {
//			throw new WrongObjectException("container is not instance of HTMLElement", "TreeItem", "setChildContainer");
//		}
	
		this._childContainer = container;
	},
	
	/**
	 * Set this item selected. Respects the trees selection style (jsWT.FULL_SELECTION)
	 * or normal selection
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	setSelected : function() {
		if ((this._parent != this._tree && this._parent.isExpanded())
				|| this._parent == this._tree) {
	
			//TODO Respect selection flag from tree	
			this._span.className = "text selected";
		}
	},
	
	/**
	 * Set this item unselected. Respects the trees selection style (jsWT.FULL_SELECTION)
	 * or normal selection
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	setUnselected : function() {
		//TODO: Respect selection flag from tree	
		this._span.className = "text";
	},
	
	toggleChilds : function() {
		if (this.isExpanded()) {
			this.collapse();
		} else {
			this.expand();
		}

		if (!this._tree.isFocusControl()) {
			this._tree.forceFocus();
		}

		this._tree.update();
	},
	
	toString : function() {
		return "[gara.jswt.TreeItem]";
	},
	
	update : function() {
		if (this.hasChilds()) {
			this._toggler.className = strReplace(this._toggler.className, " togglerCollapsed", "");
			this._toggler.className = strReplace(this._toggler.className, " togglerExpanded", "");
	
			if (this.isExpanded()) {
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
			
			// TODO: add event listeners for image in TreeItem
		}
		
		// update image information
		else if (this._image != null) {
			this._img.src = this._image.src;
			this._img.alt = this._text;
		}
		
		// delete image
		else if (this._img != null && this._image == null) {
			
			// TODO: deregister all listeners on the image
	
			// remove from dom
			this.domref.removeChild(this._img);
			this._img = null;
		}
		
		// if childs are available, create container for them
		if (this.hasChilds() && this._childContainer == null) {
			this._createChildContainer();
		}

		// delete childContainer
		else if (!this.hasChilds() && this._childContainer != null) {
			this.domref.removeChild(this._childContainer);
			this._childContainer = null;
		}

		this.domref.className = this._className;
	}
});