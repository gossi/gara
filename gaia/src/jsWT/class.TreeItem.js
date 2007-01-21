function TreeItem(parentNode) {
	if ((!parentNode instanceof(Tree)) || (!parentNode instanceof(TreeItem))) {
		throw new WrongObjectException('Passed parent is neither a Tree nor a TreeItem', 'TreeItem', 'TreeItem');
	}
	this.listeners = new Object();
	Item.prototype.constructor.call(this);

	this.aChilds = new Array();
	this.bIsExpanded = true;
	this.childContainer = null;
	this.parentItem = null;
	this.tree = null;
	


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

	// domNode references
	this.img = null;
	this.toggler = null;
	this.textSpan = null;
	this.textSpanBox = null;
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


/**
 * Internal method for creating a node representing an item. This is used for
 * creating a new item or put updated content to an existing node of an earlier
 * painted item.
 * 
 * @author Thomas Gossmann
 * @private
 * @param {boolean} wether this item is at the bottom position or not
 * @return the created or updated node
 * @type HTMLElement
 */
TreeItem.prototype.create = function(bottom) {
	/*
	 * DOM of created item:
	 * 
	 * <li>
	 *  <span class="toggler [togglerExpanded] [togglerCollapsed]"></span>
	 *  <span class="textBox">
	 *   [<img src=""/>]
	 *   <span class="text"></span>
	 *  </span>
	 * </li>
	 */

	if (bottom) {
		this.addClassName("bottom");
	}

	// create events
	var em = gaia.getEventManager();
	var toggleChildsEventListeners = new Array();
	var selectHandlerEventListeners = new Array();
	var toggleChildsEvent = new EventListener();
	var selectHandlerEvent = new EventListener();

	// parametrize and add events
	toggleChildsEvent.setTarget(this);
	toggleChildsEvent.setMethod("toggleChilds");

	selectHandlerEvent.setTarget(this.tree);
	selectHandlerEvent.setMethod("selectHandler");

	// create item node
	this.domref = document.createElement("li");
	this.domref.className = this.getClassName();
	this.domref.obj = this;

	// create item nodes
	this.img = null;
	this.toggler = document.createElement("span");
	this.toggler.obj = this;
	this.textSpanBox = document.createElement("span");
	this.textSpanBox.obj = this;
	this.textSpan = document.createElement("span");
	this.textSpan.obj = this;

	// set this.toggler
	this.toggler.className = "toggler";
	this.toggler.className += this.hasChilds() 
		? (this.isExpanded()
			? " togglerExpanded"
			: " togglerCollapsed")
		: "";
	this.domref.appendChild(this.toggler);

	// set image
	if (this.image != null) {
		this.img = document.createElement("img");
		this.img.obj = this;
		this.img.src = this.image.src;
		this.img.alt = this.sText;

		// add event listener
		toggleChildsEventListeners.push(
			em.addEventListener(this.img, "dblclick", toggleChildsEvent));
		selectHandlerEventListeners.push(
			em.addEventListener(this.img, "mousedown", selectHandlerEvent));

		// put the image into the dom
		this.textSpanBox.appendChild(this.img);
	}

	// set text
	this.textSpan.className = "text";
	this.textSpan['innerHTML'] = this.sText;

	// set box
	this.textSpanBox.className = "textBox";
	this.textSpanBox.appendChild(this.textSpan);
	this.domref.appendChild(this.textSpanBox);
	
	// if childs are available, create container for them
	if (this.hasChilds()) {
		this.childContainer = document.createElement('ul');
		if (bottom) {
			this.childContainer.className = "bottom";
		}

		if (this.isExpanded()) {
			this.childContainer.style.display = "block";
		} else {
			this.childContainer.style.display = "none";
		}
		
		this.domref.appendChild(this.childContainer);
	}

	// add Events
	em.addEventListener(this.toggler, "click", toggleChildsEvent);
	
	toggleChildsEventListeners.push(
		em.addEventListener(this.textSpan, "dblclick", toggleChildsEvent));
	selectHandlerEventListeners.push(
		em.addEventListener(this.textSpan, "mousedown", selectHandlerEvent));

	// add Events, previously added before the item was created
	for (var eventType in this.listeners) {
		for (var i = 0; i < this.listeners[eventType].length; ++i) {
			var listener = this.listeners[eventType][i];
			var evs = this.registerListener(eventType, listener);
			listener.events = evs;
		}
	}

	// add internal events to the listeners object (for updating purposes)
	if (!this.listeners.hasOwnProperty("dblclick")) {
		this.listeners.dblclick = new Array();
	}

	if (!this.listeners.hasOwnProperty("mousedown")) {
		this.listeners.mousedown = new Array();
	}

	toggleChildsEvent.events = toggleChildsEventListeners;
	selectHandlerEvent.events = selectHandlerEventListeners;
	this.listeners.dblclick.push(toggleChildsEvent);
	this.listeners.mousedown.push(selectHandlerEvent);

	return this.domref;
}

TreeItem.prototype.createChildContainer = function() {
	this.childContainer = document.createElement('ul');

	if (this.getClassName().indexOf("bottom") != -1) { // bottom
		this.childContainer.className = "bottom";
	}

	if (this.isExpanded()) {
		this.childContainer.style.display = "block";
	} else {
		this.childContainer.style.display = "none";
	}
	
	this.domref.appendChild(this.childContainer);
}

TreeItem.prototype.deselectChilds = function() {
	for (var i = 0; i < this.aChilds.length; ++i) {
		if (this.aChilds[i].hasChilds()) {
			this.aChilds[i].deselectChilds();
		}
		this.tree.deselect(this.aChilds[i]);
	}
}

TreeItem.prototype.expand = function() {
	if (this.childContainer != null) {
		this.childContainer.style.display = "block";
	}
	this.bIsExpanded = true;
	this.bChanged = true;
}

TreeItem.prototype.getChildContainer = function() {
	if (this.childContainer == null) {
		this.createChildContainer();
	}
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

TreeItem.prototype.registerListener = function(eventType, listener) {
	var em = gaia.getEventManager();
	var evs = [];
	if (this.img != null) {
		evs.push(em.addEventListener(this.img, eventType, listener));
	}

	evs.push(em.addEventListener(this.textSpan, eventType, listener));
	return evs;
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
	var htmlNode = this.domref.getElementsByTagName("span")[1].getElementsByTagName("span")[0];

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
		var span = this.domref.getElementsByTagName("span")[1].getElementsByTagName("span")[0];
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
	//TODO: Respect selection flag from tree	
	var span = this.domref.getElementsByTagName("span")[1].getElementsByTagName("span")[0];
	span.className = "text";
}

TreeItem.prototype.toggleChilds = function() {
	if (this.isExpanded()) {
		this.collapse();
	} else {
		this.expand();
	}
	
	if (!this.tree.isFocusControl()) {
		this.tree.forceFocus();
	}

	this.tree.update();
}

TreeItem.prototype.toString = function() {
	return "[object TreeItem]";
}

TreeItem.prototype.update = function() {
	if (this.hasChilds()) {
		this.toggler.className = strReplace(this.toggler.className, " togglerCollapsed", "");
		this.toggler.className = strReplace(this.toggler.className, " togglerExpanded", "");

		if (this.isExpanded()) {
			this.toggler.className += " togglerExpanded";
		} else {
			this.toggler.className += " togglerCollapsed";
		}
	}

	if (this.image != null && this.img == null) {
		// create image
		this.img = document.createElement("img");
		this.img.obj = this;
		this.img.alt = this.sText;
		this.img.src = this.image.src;
		this.textSpanBox.insertBefore(this.img, this.textSpan);
		
		// adding event listeners
		var em = gaia.getEventManager();
		for (var eventType in this.listeners) {
			for (var i = 0; i < this.listeners[eventType].length; ++i) {
				var listener = this.listeners[eventType][i];
				var event = em.addEventListener(this.img, eventType, listener);
				listener.events.push(event);
			}
		}
	} else if (this.image != null) {
		// simply update image information
		this.img.src = this.image.src;
		this.img.alt = this.sText;
	} else if (this.img != null && this.image == null) {
		// delete image
		
		// deregister all listeners on the image
		var em = gaia.getEventManager();
		for (var eventType in this.listeners) {
			for (var i = 0; i < this.listeners[eventType].length; ++i) {
				var listener = this.listeners[eventType][i];
				var events = listener.events;
				for (var j = 0; j < events.length; ++j) {
					var event = events[j];
					if (event.domNode == this.img) {
						em.removeEventListener(event);
						events.remove(j);
					}
				}
			}
		}

		// remove from dom
		this.textSpanBox.removeChild(this.img);
		this.img = null;
	}
	
	// if childs are available, create container for them
	if (this.hasChilds() && this.childContainer == null) {
		this.createChildContainer();
	} else if (!this.hasChilds() && this.childContainer != null) {
		// delete childContainer
		this.domref.removeChild(this.childContainer);
		this.childContainer = null;
	}

	this.domref.className = this.getClassName();
}