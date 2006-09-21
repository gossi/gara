function TreeItem(parentNode) {
	
	this.aChilds = new Array();
	this.tree = null;
	this.parentItem = null;
	
	if (parentNode instanceof(Tree)) {
		this.tree = parentNode;
		parentNode.addTopItem(this);
	} else if (parentNode instanceof(TreeItem)) {
		this.parentItem = parentNode;
		this.tree = parentNode.getTree();
		parentNode.addItem(this);
	} else {
		throw new WrongObjectException('Passed parent is neither a Tree nor a TreeItem', 'TreeItem', 'TreeItem');
	}

	this.tree.addItem(this);
	Item.prototype.constructor.call(this);
	
	this.bIsExpanded = true;
	this.childContainer = null;
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

TreeItem.prototype.setChildContainer = function(container) {
	if (!container instanceof HTMLElement) {
		throw new WrongObjectException("container is not instance of HTMLElement", "TreeItem", "setChildContainer");
	}
	
	this.childContainer = container;
}

TreeItem.prototype.toggleChilds = function() {
	if (this.isExpanded()) {
		this.collapse();
	} else {
		this.expand();
	}
	
	this.tree.update();
}