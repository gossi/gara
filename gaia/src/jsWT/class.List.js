/**
 * List control.
 * 
 * @author Thomas Gossmann
 * @class List
 * @constructor
 * @extends Control
 * @throws WrongObjectException if the parentElement is not a valid HTMLElement
 */
function List(parentElement) {
	if (!parentElement instanceof(HTMLElement)) {
		throw new WrongObjectException("parentElement ist not a HTMLElement", "List", "List");
	}
	Control.prototype.constructor.call(this);

	this.list = null;
	this.aSelection = new Array();
	this.aSelectionListeners = new Array();
	this.sClassName = 'jsWTList';
	this.parentElement = parentElement
}
List.inheritsFrom(Control);

/**
 * Adds an item to the list. This is automatically done by instantiating a new item.
 * 
 * @author Thomas Gossmann
 * @param {ListItem} newItem the new item to be added
 * @type void
 */
List.prototype.addItem = function(newItem) {
	
	if (!newItem instanceof ListItem) {
		throw new WrongObjectException("New item is not instance of ListItem", "List", "addItem");
	}

	this.aItems.push(newItem);
}

/**
 * Adds a selection listener on the list
 * 
 * @author Thomas Gossmann
 * @param {ISelectionListener} the desired listener to be added to this list
 * @throws DefectInterfaceImplementation if the listener misses some methods
 * @type void
 */
List.prototype.addSelectionListener = function(listener) {
	try {
		jsRIA.getInterfaceTester().isSelectionListener(listener);
	} catch(e) {
		jsRIA.getExceptionHandler().exceptionRaised(e);
	}

	this.aSelectionListeners.push(listener);
}

/**
 * Internal method for creating a node representing an item. This is used for creating
 * a new item or put updated content to an existing node of an earlier painted item.
 * 
 * @author Thomas Gossmann
 * @private
 * @param {ListItem} the item
 * @param {HTMLElement} a node, that should be updated (optional)
 * @return the created or updated node
 * @type HTMLElement
 */
List.prototype.createItem = function(item, node) {
	var img;	
	if (typeof(node) == "undefined") {
		node = document.createElement('li');
	}
	node['innerHTML'] = item.getText();
	node.className = item.getClassName();
	if (img = item.getImage()) {
		node.style.backgroundImage = "url('"+img.src+"')";
	}

	return node;
}

/**
 * Deselect a specific item, a range of items or an array with indices of items to 
 * deselect. Therefore here is what the parameters are for:
 * 
 * One parameter:
 * 
 * int means a zero-relative index to deselect
 * int[] means an array with indices to deselect
 * 
 * Two parameters:
 * 
 * Two parameters are for range selections. The first one is the start where the
 * second parameter determines the end of the range
 * 
 * @author Thomas Gossmann
 * @param first see description
 * @param second see description
 * @throws OutOfBoundsException if the index is not in the list
 * @type void
 */
List.prototype.deselect = function(first, second) {

	// one argument
	if (typeof(second) == "undefined") {

		// argument == array
		if (first instanceof(Array)) {
			for (var i = 0; i < first.length; ++i) {
				try {
					this.deselect(first[i]);
				} catch(e) {
					throw(e);
				}
			}
		}

		// argument == index
		else if (typeof(first) == "number") {

			try {
				var item = this.getItem(first);
			} catch(e) {
				throw e;
			}

			if (this.aSelection.contains(first)) {
				item.removeClassName("selected");
				this.aSelection.remove(this.aSelection.getKey(first));
				this.notifySelectionListener();
			}
		}
	}

	// two arguments (from - to)
	else {

		var range = new Array();
		for (var i = first; i <= second; ++i) {
			range.push(i);
		}

		try {
			this.deselect(range);
		} catch(e) {
			throw(e);
		}
	}
}

/**
 * Select all items in the list
 * 
 * @author Thomas Gossmann
 * @type void
 */
List.prototype.deselectAll = function() {
	try {
		this.deselect(0, this.aItems.length - 1);
		this.update();
	} catch(e) {
		throw(e);
	}
}

/**
 * Gets a specifiy item with a zero-related index
 * 
 * @author Thomas Gossmann
 * @param {int} index the zero-related index
 * @throws OutOfBoundsException if the index does not live within this list
 * @return the item
 * @type ListItem
 */
List.prototype.getItem = function(index) {
	if (index >= this.aItems.length) {
		throw new OutOfBoundsException("Your item lives outside of this list", "List", "getItem");
	}
	
	return this.aItems[index];
}

/**
 * Returns the amount of the items in the list
 * 
 * @author Thomas Gossmann
 * @return the amount
 * @type int
 */
List.prototype.getItemCount = function() {
	return this.aItems.length;
}

/**
 * Returns an array with all the items in the list
 * 
 * @author Thomas Gossmann
 * @return the array with the items
 * @type Array
 */
List.prototype.getItems = function() {
	return this.aItems;
}

/**
 * Returns an array with the items which are currently selected in the list
 * 
 * @author Thomas Gossmann
 * @throws OutOfBoundsException if an index is removed form the list (should never happen!)
 * @return an array with items
 * @type Array
 */
List.prototype.getSelection = function() {
	var returnArray = new Array();
	
	for (var i = 0; i < this.aSelection.length; ++i) {
		try {
			var index = this.aSelection[i];
			var item = this.getItem(index);
			returnArray.push(item);
		} catch(e) {
			throw e;
		}
	}
	
	return returnArray;
}

/**
 * Returns the amount of the selected items in the list
 * 
 * @author Thomas Gossmann
 * @return the amount
 * @type int
 */
List.prototype.getSelectionCount = function() {
	return this.aSelection.length;
}

/**
 * Returns a zero-relative index of the item which is currently
 * selected or -1 if no item is selected
 * 
 * @author Thomas Gossmann
 * @return a zero-relative index of the currently selected item or -1 if no item is selected
 * @type int
 */
List.prototype.getSelectionIndex = function() {
	if (this.aSelection.length > 0) {
		return this.aSelection[0];
	} else {
		return -1;
	}
}

/**
 * Returns an array with zero-relative indices of the selection
 * 
 * @author Thomas Gossmann
 * @return an array with zero-relative indices of the selection
 * @type Array
 */
List.prototype.getSelectionIndices = function() {
	return this.aSelection;
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
List.prototype.indexOf = function(item) {
	if (!item instanceof(ListItem)) {
		throw new WrongObjectException("item not instance of ListItem", "List", "indexOf");
	}

	if (!this.aItems.contains(item)) {
		throw new ItemNotExistsException(item.getText(), "List", "indexOf");
	}

	return this.aItems.getKey(item);
}

/**
 * Tests if a zero-related index is selected
 * 
 * @author Thomas Gossmann
 * @param {int} index the zero-related index to test
 * @return true if selected or false if not
 * @type boolean
 */
List.prototype.isSelected = function(index) {
	return this.aSelection.contains(index);
}

/**
 * Notifies all listeners if selection has changed
 * 
 * @author Thomas Gossmann
 * @type void
 * @private
 */
List.prototype.notifySelectionListener = function() {
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
List.prototype.removeSelectionListener = function(listener) {
	if (this.aSelectionListeners.contains(listener)) {
		var iOffset = this.aSelectionListeners.getKey(listener);
		this.aSelectionListeners.remove(iOffset);
	}
}

/**
 * Select a specific item, a range of items or an array with indices of items to 
 * select. Therefore here is what the parameters are for:
 * 
 * One parameter:
 * 
 * int means a zero-relative index to select
 * int[] means an array with indices to select
 * 
 * Two parameters:
 * 
 * Two parameters are for range selections. The first one is the start where the
 * second parameter determines the end of the range
 * 
 * @author Thomas Gossmann
 * @param first see description
 * @param second see description
 * @throws OutOfBoundsException if the index is not in the list
 * @type void
 */
List.prototype.select = function(first, second) {

	// one argument
	if (typeof(second) == "undefined") {
		
		// argument == array
		if (first instanceof(Array)) {
			
			for (var i = 0; i < first.length; ++i) {
				try {
					this.select(first[i]);
				} catch(e) {
					throw(e);
				}
			}
		}

		// argument == index
		else if (typeof(first) == "number") {
			try {
				var item = this.getItem(first);
			} catch(e) {
				throw e;
			}

			if (!this.aSelection.contains(first)) {
				item.addClassName("selected");
				this.aSelection.push(first);
				this.notifySelectionListener();
			}
		}
	}

	// two arguments (from - to)
	else {

		var range = new Array();
		for (var i = first; i <= second; ++i) {
			range.push(i);
		}

		try {
			this.select(range);
		} catch(e) {
			throw(e);
		}
	}
}

/**
 * Select all items in the list
 * 
 * @author Thomas Gossmann
 * @type void
 */
List.prototype.selectAll = function() {
	try {
		this.select(0, this.aItems.length - 1);
		this.update();
	} catch(e) {
		throw(e);
	}
}

/**
 * Set a item at a specified index
 * 
 * @author Thomas Gossmann
 * @param {int} zero-related index
 * @param {ListItem} the item to put at the index
 * @throws WrongObjectException if item is not a ListItem
 * @throws OutOfBoundsException if the index is not yet assigned
 * @type void
 */
List.prototype.setItem = function(index, item) {
	if (!item instanceof(ListItem)) {
		throw new WrongObjectException("item not instance of ListItem", "List", "setItem");
	}

	if (index >= this.aItems.length) {
		throw new OutOfBoundsException("index not assigned", "List", "setItem");
	}

	this.aItems[index] = item;
}

/**
 * Sets the items of this list
 * 
 * @author Thomas Gossmann
 * @param {Array} a list of new items
 * @type void
 */
List.prototype.setItems = function(aItems) {
	this.aItems = aItems;
}

/**
 * 
 * @throws OutOfBoundsException
 */
List.prototype.toggleSelection = function(input) {
	var iIndex;
	if (typeof(input) == "object") {
		try {
			iIndex = this.indexOf(input);
		} catch(e) {
			throw e;
		}
	} else if (typeof(input) == "number") {
		iIndex = input;
	}

	if (this.aSelection.contains(iIndex)) {
		this.deselect(iIndex);
	} else {
		this.select(iIndex);
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
List.prototype.update = function() {
	
	if (this.list == null) {
		this.list = document.createElement('ul');
		this.list.className = this.sClassName;
	}

	for (var i = 0; i < this.aItems.length; ++i) {
		var item = this.aItems[i];

		// paint item ...
		if (!item.isPainted()) {
			node = this.createItem(item);
			this.list.appendChild(node);
			item.setPainted(true);
			item.setHtmlNode(node);

			// add Event Handler			
			var p = new ParamSet();
			p.addParam(item);

			item.addEventHandler("click", this, "toggleSelection", p);
		}

		// ... or update it
		else if (item.hasChanged()) {
			this.createItem(item, item.getHtmlNode());
			item.releaseChange();
		}
	}

	this.parentElement.appendChild(this.list);
}