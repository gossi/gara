function TreeItem(parentNode) {
	if ((!parentNode instanceof(Tree)) || (!parentNode instanceof(TreeItem))) {
		throw new WrongObjectException('Passed parent is neither a Tree nor a TreeItem', 'TreeItem', 'TreeItem');
	}
	Item.prototype.constructor.call(this);

	this.aChilds = new Array();
	this.tree = null;
	this.parentItem = null;
	this.bIsExpanded = true;
	this.childContainer = null;
	
	if (parentNode instanceof(Tree)) {
		this.parentItem = parentNode;
		this.tree = parentNode;
		this.tree.addItem(this);
		parentNode.addTopItem(this);
	} else if (parentNode instanceof(TreeItem)) {
		this.parentItem = parentNode;
		this.tree = parentNode.getTree();
		this.tree.addItem(this);
		parentNode.addItem(this);
	}
}

TreeItem.inheritsFrom(Item);

TreeItem.prototype.addItem = function(newItem) {
	if (!newItem instanceof TreeItem) {
		throw new WrongObjectException("New item is not instance of TreeItem", "TreeItem", "addItem");
	}

	this.aChilds.push(newItem);
}

TreeItem.prototype.collapse = function() {
	if (this.childContainer != null) {
		this.childContainer.style.display = "none";
	}

	this.deselectChilds();
	this.bIsExpanded = false;
	this.bChanged = true;
}

TreeItem.prototype.expand = function() {
	if (this.childContainer != null) {
		this.childContainer.style.display = "block";
	}
	this.bIsExpanded = true;
	this.bChanged = true;
}

TreeItem.prototype.getChildContainer = function() {
	return this.childContainer;
}

TreeItem.prototype.getItemCount = function() {
	return this.aChilds.length;
}

TreeItem.prototype.getItems = function() {
	return this.aChilds;
}

TreeItem.prototype.getParentItem = function() {
	return this.parentItem;
}

TreeItem.prototype.getParent = function() {
	if (this.parentItem != null) {
		return this.parentItem;
	} else {
		return this.tree;		
	}
}

TreeItem.prototype.getTree = function() {
	return this.tree;
}

TreeItem.prototype.hasChilds = function() {
	return this.aChilds.length > 0;
}

TreeItem.prototype.isExpanded = function() {
	return this.bIsExpanded;
}

/**
 * Sets the item active or inactive (Override from Item)
 * 
 * @author Thomas Gossmann
 * @param {boolean} bActive true for active and false for inactive
 * @type void
 */
TreeItem.prototype.setActive = function(bActive) {
	this.bActive = bActive;

	//TODO Respect selection flag from tree	
	var htmlNode = this.htmlNode.getElementsByTagName("span")[1].getElementsByTagName("span")[0];

	if (bActive) {
		htmlNode.className += " active";
	} else {
		htmlNode.className = htmlNode.className.replace(/ *active/, "");
	}

	this.bChanged = true;
}

TreeItem.prototype.setChildContainer = function(container) {
	if (!container instanceof HTMLElement) {
		throw new WrongObjectException("container is not instance of HTMLElement", "TreeItem", "setChildContainer");
	}

	this.childContainer = container;
}

/**
 * Set this item selected. Respects the trees selection style (jsWT.FULL_SELECTION)
 * or normal selection
 * 
 * @author Thomas Gossmann
 * @private
 * @type void
 */
TreeItem.prototype.setSelected = function() {
	if ((this.parentItem != this.tree && this.parentItem.isExpanded())
			|| this.parentItem == this.tree) {

		//TODO Respect selection flag from tree	
		var span = this.htmlNode.getElementsByTagName("span")[1].getElementsByTagName("span")[0];
		span.className = "text selected";
	}
}

/**
 * Set this item unselected. Respects the trees selection style (jsWT.FULL_SELECTION)
 * or normal selection
 * 
 * @author Thomas Gossmann
 * @private
 * @type void
 */
TreeItem.prototype.setUnselected = function() {
	//TODO Respect selection flag from tree	
	var span = this.htmlNode.getElementsByTagName("span")[1].getElementsByTagName("span")[0];
	span.className = "text";
}

TreeItem.prototype.toggleChilds = function() {
	if (this.isExpanded()) {
		this.collapse();
	} else {
		this.expand();
	}

	this.tree.update();
}

TreeItem.prototype.toString = function() {
	return "[object TreeItem]";
}

TreeItem.prototype.deselectChilds = function() {
	for (var i = 0; i < this.aChilds.length; ++i) {
		if (this.aChilds[i].hasChilds()) {
			this.aChilds[i].deselectChilds();
		}
		this.tree.deselect(this.aChilds[i]);
	}
}