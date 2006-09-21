/**
 * Tree control.
 * 
 * @author Thomas Gossmann
 * @class Tree
 * @constructor
 * @extends Control
 * @throws WrongObjectException if the parentElement is not a valid HTMLElement
 */
function Tree(parentElement) {
	if (!parentElement instanceof(HTMLElement)) {
		throw new WrongObjectException("parentElement ist not a HTMLElement", "Tree", "Tree");
	}
	Control.prototype.constructor.call(this);

	this.tree = null;
	this.aSelection = new Array();
	this.aSelectionListeners = new Array();
	this.bShowLines = true;
	this.sClassName = 'jsWTTree';
	this.parentElement = parentElement
	this.aTopItems = new Array();
}
Tree.inheritsFrom(Control);

/**
 * Adds an item to the tree. This is automatically done by instantiating a new item.
 * 
 * @author Thomas Gossmann
 * @private
 * @param {TreeItem} newItem the new item to be added
 * @type void
 */
Tree.prototype.addItem = function(newItem) {
	if (!newItem instanceof TreeItem) {
		throw new WrongObjectException("New item is not instance of TreeItem", "Tree", "addItem");
	}

	this.aItems.push(newItem);
}

/**
 * Adds a selection listener on the tree
 * 
 * @author Thomas Gossmann
 * @param {ISelectionListener} the desired listener to be added to this tree
 * @throws DefectInterfaceImplementation if the listener misses some methods
 * @type void
 */
Tree.prototype.addSelectionListener = function(listener) {
	try {
		jsRIA.getInterfaceTester().isSelectionListener(listener);
	} catch(e) {
		jsRIA.getExceptionHandler().exceptionRaised(e);
	}

	this.aSelectionListeners.push(listener);
}

/**
 * Adds an item on the top level to this tree. Is automatically done by instantiating a new item.
 * 
 * @author thomas Gossmann
 * @param {TreeItem} item new item for the top level
 * @type void
 */
Tree.prototype.addTopItem = function(item) {
	if (!item instanceof TreeItem) {
		throw new WrongObjectException("New item is not instance of TreeItem", "Tree", "addTopItem");
	}

	this.aTopItems.push(item);
}

/**
 * Internal method for creating a node representing an item. This is used for creating
 * a new item or put updated content to an existing node of an earlier painted item.
 * 
 * @author Thomas Gossmann
 * @private
 * @param {TreeItem} the item
 * @param {HTMLElement} a node, that should be updated (optional)
 * @return the created or updated node
 * @type HTMLElement
 */
Tree.prototype.createItem = function(item, bottom) {
	if (typeof(bottom) == "undefined") {
		bottom = false;
	}

	var img = null;
	var node = document.createElement('li');
	var toggler = document.createElement('span');
	toggler.className = "toggler";
	toggler.handleEvent = function(e) {
		item.handleEvent(e, this);
	}
	item.addEventHandler("click", item, "toggleChilds", null, toggler);

	if (item.hasChilds()) {
		if (item.isExpanded()) {
			toggler.className += " togglerExpanded";
		} else {
			toggler.className += " togglerCollapsed";
		}
	}

	if (item.getImage() != null) {
		img = document.createElement("img");
		img.src = item.getImage().src;
		img.alt = item.getText();
	}
	
	var textSpanBox = document.createElement("span");
	textSpanBox.className = "textBox";

	var textSpan = document.createElement("span");
	textSpan.className = "text";
	textSpan['innerHTML'] = item.getText();
	textSpan.handleEvent = function(e) {
		item.handleEvent(e, this);
	}
	
	
	item.addEventHandler("dblclick", item, "toggleChilds", null, textSpan);
	item.addEventHandler("click", this, "toggleSelection", null, textSpan);

	if (bottom) {
		item.addClassName("bottom");
	}

	node.className = item.getClassName();
	node.appendChild(toggler);

	if (img != null) {
		textSpanBox.appendChild(img);
	}
	textSpanBox.appendChild(textSpan);
	node.appendChild(textSpanBox);
	return node;
}

/**
 * Deselects a specific item
 * 
 * @author Thomas Gossmann
 * @type void
 * @param {TreeItem} the item to deselect
 * @private
 */
Tree.prototype.deselect = function(item) {
	if (!item instanceof TreeItem) {
		throw new WrongObjectException("item not instance of TreeItem", "Tree", "deselect");
	}

	if (this.aSelection.contains(item)
			&& item.getTree() == this) {
		this.aSelection.remove(this.aSelection.getKey(item));
		this.notifySelectionListener();
		var span = item.getHtmlNode().getElementsByTagName("span")[1].getElementsByTagName("span")[0];
		span.className = "text";		
	}
}

/**
 * Deselect all items in the tree
 * 
 * @author Thomas Gossmann
 * @type void
 */
Tree.prototype.deselectAll = function() {
	for (var i = 0; i < this.aItems.length; ++i) {
		this.deselect(this.aItems[i]);
	}
	this.update();
}

/**
 * Gets a specifiy item with a zero-related index
 * 
 * @author Thomas Gossmann
 * @param {int} index the zero-related index
 * @throws OutOfBoundsException if the index does not live within this tree
 * @return the item
 * @type TreeItem
 */
Tree.prototype.getItem = function(index) {
	if (index >= this.aItems.length) {
		throw new OutOfBoundsException("Your item lives outside of this list", "Tree", "getItem");
	}

	return this.aItems[index];
}

/**
 * Returns the amount of the items in the tree
 * 
 * @author Thomas Gossmann
 * @return the amount
 * @type int
 */
Tree.prototype.getItemCount = function() {
	return this.aItems.length;
}

/**
 * Returns an array with all the items in the tree
 * 
 * @author Thomas Gossmann
 * @return the array with the items
 * @type Array
 */
Tree.prototype.getItems = function() {
	return this.aItems;
}

/**
 * Gets whether the Lines of the Tree are Visible or not
 * 
 * @author Thomas Gossmann
 * @return true if the lines are visible and false if they are not
 * @type boolean
 */
Tree.prototype.getLinesVisible = function() {
	return this.bShowLines;
}
/**
 * Returns an array with the items which are currently selected in the tree
 * 
 * @author Thomas Gossmann
 * @return an array with items
 * @type Array
 */
Tree.prototype.getSelection = function() {
	return this.aSelection;
}

/**
 * Returns the amount of the selected items in the tree
 * 
 * @author Thomas Gossmann
 * @return the amount
 * @type int
 */
Tree.prototype.getSelectionCount = function() {
	return this.aSelection.length;
}

/**
 * Looks for the index of an item
 * 
 * @author Thomas Gossmann
 * @param {ListItem} item the item the index is looked up
 * @throws WrongObjectException if item is not instance of ListItem
 * @throws ItemNotExistsException if the item does not exist in this list
 * @type int
 */
Tree.prototype.indexOf = function(item) {
	if (!item instanceof(TreeItem)) {
		throw new WrongObjectException("item not instance of TreeItem", "Tree", "indexOf");
	}

	if (!this.aItems.contains(item)) {
		throw new ItemNotExistsException(item.getText(), "Tree", "indexOf");
	}

	return this.aItems.getKey(item);
}

/**
 * Notifies all listeners if selection has changed
 * 
 * @author Thomas Gossmann
 * @type void
 * @private
 */
Tree.prototype.notifySelectionListener = function() {
	for (var i = 0; i < this.aSelectionListeners.length; ++i) {
		this.aSelectionListeners[i].widgetSelected(this);
	}
}

/**
 * Removes a selection listener from this list
 * 
 * @author Thomas Gossmann
 * @param {ISelectionListener} the listener to remove from this list
 * @type void
 */
Tree.prototype.removeSelectionListener = function(listener) {
	if (this.aSelectionListeners.contains(listener)) {
		var iOffset = this.aSelectionListeners.getKey(listener);
		this.aSelectionListeners.remove(iOffset);
	}
}

/**
 * Selects a specific item
 * 
 * @author Thomas Gossmann
 * @type void
 * @param {TreeItem} the item to select
 */
Tree.prototype.select = function(item) {
	if (!item instanceof TreeItem) {
		throw new WrongObjectException("item not instance of TreeItem", "Tree", "select");
	}
	
	if (!this.aSelection.contains(item)
			&& item.getTree() == this) {
		this.aSelection.push(item);
		this.notifySelectionListener();
		var span = item.getHtmlNode().getElementsByTagName("span")[1].getElementsByTagName("span")[0];
		span.className = "text selected";
	}
}

/**
 * Select all items in the list
 * 
 * @author Thomas Gossmann
 * @type void
 */
Tree.prototype.selectAll = function() {
	for (var i = 0; i < this.aItems.length; ++i) {
		this.select(this.aItems[i]);
	}
	this.update();
}

/**
 * Sets lines visible or invisible.
 * 
 * @author Thomas Gossmann
 * @type void
 * @param {boolean} true if the lines shoulb be visible or false for invisibility
 */
Tree.prototype.setLinesVisible = function(show) {
	this.bShowLines = show;
}
/**
 * Toggles selection of an item.
 * 
 * @author Thomas Gossmann
 * @param {TreeItem} tree item to toggle the selection
 * @type void
 */
Tree.prototype.toggleSelection = function(item) {
	if (this.aSelection.contains(item)) {
		this.deselect(item);
	} else {
		this.select(item);
	}
	this.update();
}

/**
 * Updates the control. All changes to child items are recognized and updated 
 * as well.
 * 
 * @author Thomas Gossmann
 * @type void
 */
Tree.prototype.update = function() {

	if (this.tree == null) {
		this.tree = document.createElement('ul');
	}
	this.removeClassName("jsWTTreeNoLines");
	this.removeClassName("jsWTTreeLines");	

	if (this.bShowLines) {
		this.addClassName("jsWTTreeLines");
	} else {
		this.addClassName("jsWTTreeNoLines");
	}

	this.tree.className = this.sClassName;
	this.updateItems(this.aTopItems, this.tree);
	this.parentElement.appendChild(this.tree);
}

/**
 * Updates an itemList.
 * 
 * Iterates over the item list. If an item is not painted yet, the item would be
 * created and appended to the parent node. Items that needs to be updated
 * will be updated in their correspondenting HTML node.
 * 
 * @author Thomas Gossmann
 * @private
 * @param {Array} itemList with the items to update
 * @param {HTMLElement} the parent node where new items are appended
 * @type void
 */
Tree.prototype.updateItems = function(itemList, parentHtmlNode) {
	var iItemCount = itemList.length
	for (var i = 0; i < iItemCount; ++i) {
		var item = itemList[i];
		var bottom = i == (iItemCount - 1);

		// paint item ...
		if (!item.isPainted()) {
			node = this.createItem(item, bottom);
			parentHtmlNode.appendChild(node);
			item.setPainted(true);
			item.setHtmlNode(node);
		}

		if (item.hasChilds()) {
			if (item.getChildContainer() == null) {
				childContainer = document.createElement('ul');
				if (bottom) {
					childContainer.className = "bottom";
				}
				if (item.isExpanded()) {
					childContainer.style.display = "block";
				} else {
					childContainer.style.display = "none";
				}
				item.setChildContainer(childContainer);
				item.getHtmlNode().appendChild(childContainer);
			} else {
				childContainer = item.getChildContainer();
			}
			this.updateItems(item.getItems(), childContainer);			
		}

		if (bottom && item.getClassName().indexOf("bottom") == -1) {
			item.addClassName("bottom");
			if (item.hasChilds()) {
				var cc = item.getChildContainer();
				cc.className = "bottom";
			}
		} else if (!bottom && item.getClassName().indexOf("bottom") != -1) {
			item.removeClassName("bottom");
			if (item.hasChilds()) {
				var cc = item.getChildContainer();
				cc.className = null;
			}
		}

		// ... or update it
		if (item.hasChanged()) {
			this.updateItemNode(item);
			item.releaseChange();
		}
	}
}

/**
 * Updates an items HTML node.
 * 
 * If the item should be updated in the updateItems() method. This method is called
 * and the HTML node of this item is filled with the new values.
 * 
 * @author Thomas Gossmann
 * @private
 * @param {TreeItem} the item to update.
 * @type void
 */
Tree.prototype.updateItemNode = function(item) {
	
	var itemNode = item.getHtmlNode();
	var togglerNode = itemNode.getElementsByTagName("span")[0];
	var imgNode = itemNode.getElementsByTagName("img")[0];
	var textNode = itemNode.getElementsByTagName("span")[1];
	
	if (item.hasChilds()) {
		togglerNode.className = strReplace(togglerNode.className, " togglerCollapsed", "");
		togglerNode.className = strReplace(togglerNode.className, " togglerExpanded", "");

		if (item.isExpanded()) {
			togglerNode.className += " togglerExpanded";
		} else {
			togglerNode.className += " togglerCollapsed";
		}
	}

	if (item.getImage() != null && imgNode == null) {
		imgNode = document.createElement('img');
		itemNode.insertBefore(imgNode, textNode);
	} else if (item.getImage() != null) {
		imgNode.src = item.getImage().src;
		imgNode.alt = item.getText();
	}

	itemNode.className = item.getClassName();
}