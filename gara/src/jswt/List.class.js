/**
 * @class List
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends Control
 */
$class("List", {
	$extends : Control,

	_selection : [],
	_selectionListener : [],
	_items : [],
	_parentNode : null,
	_activeItem : null,
	_shiftItem : null,

	$constructor : function(parentNode) {
		this.$base();
		this._parentNode = parentNode;
		this._className = this._baseClass = "jsWTList";
	},

	_activateItem : function(item) {
		// set a previous active item inactive
		if (this._activeItem != null) {
			this._activeItem.setActive(false);
		}

		this._activeItem = item;
		this._activeItem.setActive(true);
		this.update();
	},

	addItem : function(item) {
		if (!$class.instanceOf(item, ListItem)) {
			throw new TypeError("item is not type of ListItem");
		}
		this._items.push(item);
	},

	/**
	 * Adds a selection listener on the list
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the desired listener to be added to this list
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @returns {void}
	 */
	addSelectionListener : function(listener) {
		if (!$class.instanceOf(listener, SelectionListener)) {
			throw new TypeError("listener is not instance of SelectionListener");
		}

		this._selectionListener.push(listener);
	},

	deselect : function(item) {
		if (!$class.instanceOf(item, ListItem)) {
			throw new TypeError("item not instance of ListItem");
		}

		if (this._selection.contains(item)) {
			this._selection.remove(item);
			this.notifySelectionListener();
			item.setUnselected();
			this._shiftItem = item;
			this._activateItem(item);
		}
	},

	deselectAll : function() {
		for (var i = 0, len = this._items.length; i < len; ++i) {
			this.deselect(this._items[i], true);
		}
		this.update();
	},

	/**
	 * Gets a specified item with a zero-related index
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {gara.OutOfBoundsException} if the index does not live within this list
	 * @returns {gara.jswt.ListItem} the item
	 */
	getItem : function(index) {
		if (index >= this._items.length) {
			throw new OutOfBoundsException("Your item lives outside of this list");
		}
	
		return this._items[index];
	},

	/**
	 * Returns the amount of the items in the list
	 * 
	 * @author Thomas Gossmann
	 * @returns {int} the amount
	 */
	getItemCount : function() {
		return this._items.length;
	},

	/**
	 * Returns an array with all the items in the list
	 * 
	 * @author Thomas Gossmann
	 * @returns {gara.jswt.ListItem[]} the array with the items
	 */
	getItems : function() {
		return this._items;
	},

	/**
	 * Returns an array with the items which are currently selected in the list
	 * 
	 * @author Thomas Gossmann
	 * @returns {gara.jswt.ListItem[]} an array with items
	 */
	getSelection : function() {
		return this._selection;
	},

	/**
	 * Returns the amount of the selected items in the tree
	 * 
	 * @author Thomas Gossmann
	 * @returns {int} the amount
	 */
	getSelectionCount : function() {
		return this._selection.length;
	},

	handleEvent : function(e) {
		// special events for the list
		var obj = e.target.obj || null;
		switch (e.type) {
			case "mousedown":
//				if (!this.isFocusControl()) {
//					console.log("force focus");
					this.forceFocus();
//				}

				if ($class.instanceOf(obj, ListItem)) {
					var item = obj;

					if (!e.ctrlKey && !e.shiftKey) {
						this.select(item, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this.selectRange(item, true);
					} else if (e.shiftKey) {
						this.selectRange(item, false);
					} else if (e.ctrlKey) {
						if (this._selection.contains(item)) {
							this.deselect(item);
						} else {
							this.select(item, true);
						}
					} else {
						this.select(item);
					}
				}
				console.log("List.handleEvent: mousedown => " + e.target.obj + " " + e.target.control);
				break;
			
//			case "mouseup":
//				if (!this.isFocusControl()) {
//					console.log("force focus");
//					this.forceFocus();
//				}
//				break;

			case "keydown":
				this._handleKeyEvent(e);
				break;
		}

//		e.stopPropagation();
//		e.preventDefault();
	},

	_handleKeyEvent : function(e) {
	
	//	window.status = "keycode: " + e.keyCode;
		if (this._activeItem == null) {
			return;
		}

		switch (e.keyCode) {
			case 38 : // up
				// determine previous item
				var prev = false;
				var activeIndex = this.indexOf(this._activeItem);
				
				if (activeIndex != 0) {
					prev = this._items[activeIndex - 1];
				}

				if (prev) {
					if (!e.ctrlKey && !e.shiftKey) {
						//this.deselect(this._activeItem);
						this.select(prev, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this.selectRange(prev, true);
					} else if (e.shiftKey) {
						this.selectRange(prev, false);
					} else if (e.ctrlKey) {
						this._activateItem(prev);
					}
				}
				break;

			case 40 : // down
				// determine next item
				var next = false;
				var activeIndex = this.indexOf(this._activeItem);
				
				// item is last;
				if (activeIndex != this._items.length - 1) {
					next = this._items[activeIndex + 1];
				}

				if (next) {
					if (!e.ctrlKey && !e.shiftKey) {
						//this.deselect(this.activeItem);
						this.select(next, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this.selectRange(next, true);
					} else if (e.shiftKey) {
						this.selectRange(next, false);
					} else if (e.ctrlKey) {
						this._activateItem(next);
					}
				}
				break;
				
			case 32 : // space
				if (this._selection.contains(this._activeItem) && e.ctrlKey) {
					this.deselect(this._activeItem);
				} else {
					this.select(this._activeItem, true);
				}
				break;
				
			case 36 : // home
				if (!e.ctrlKey && !e.shiftKey) {
					this.select(this._items[0], false);
				} else if (e.shiftKey) {
					this.selectRange(this._items[0], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[0]);
				}
				break;
				
			case 35 : // end
				var lastOffset = this._items.length - 1;
				if (!e.ctrlKey && !e.shiftKey) {
					this.select(this._items[lastOffset], false);
				} else if (e.shiftKey) {
					this.selectRange(this._items[lastOffset], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[lastOffset]);
				}
				break;
		}
	},

	/**
	 * Looks for the index of a specified item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item for the index
	 * @throws {gara.jswt.ItemNotExistsException} if the item does not exist in this list
	 * @returns {int} the index of the specified item
	 */
	indexOf : function(item) {
		if (!$class.instanceOf(item, ListItem)) {
			throw new TypeError("item not instance of ListItem (List.indexOf)");
		}
	
		if (!this._items.contains(item)) {
			// TODO: ItemNotExistsException
			throw new ItemNotExistsException("item [" + item + "] does not exists in this list");
			return;
		}
	
		return this._items.indexOf(item);
	},

	notifySelectionListener : function() {
		for (var i = 0, len = this._selectionListener.length; i < len; ++i) {
			this._selectionListeners[i].widgetSelected(this);
		}
	},
	
	registerListener : function(eventType, listener) {
		gara.eventManager.addListener(this.domref, eventType, listener);
	},

	/**
	 * Removes a selection listener from this list
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the listener to remove from this list
	 * @returns {void}
	 */
	removeSelectionListener : function(listener) {
		if (this._selectionListener.contains(listener)) {
			this._selectionListener.remove(listener);
		}
	},
	
	select : function(item, _add) {
		if (!$class.instanceOf(item, ListItem)) {
			throw new TypeError("item not instance of ListItem");
		}
	
		if (!_add) {
			while (this._selection.length) {
				this._selection.pop().setUnselected();
			}
		}
		
		if (!this._selection.contains(item)) {
			this._selection.push(item);
			item.setSelected();
			this._shiftItem = item;
			this._activateItem(item);
			this.notifySelectionListener();
		}
	},
	
	/**
	 * Select all items in the list
	 * 
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	selectAll : function() {
		for (var i = 0, len = this._items.length; i < len; ++i) {
			this.select(this._items[i], true);
		}
		this.update();
	},

	selectRange : function(item, bAdd) {
		if (!bAdd) {
			while (this._selection.length) {
				this._selection.pop().setUnselected();
			}
		}
		
		var indexShift = this.indexOf(this._shiftItem);
		var indexItem = this.indexOf(item);
		var from = indexShift > indexItem ? indexItem : indexShift;
		var to = indexShift < indexItem ? indexItem : indexShift;
	
		for (var i = from; i <= to; ++i) {
			this._selection.push(this._items[i]);
			this._items[i].setSelected();
		}
	
		this.notifySelectionListener();
		this._activateItem(item);
	},
	
	update : function() {
		// create widget if domref equals null
		if (this.domref == null) {
			this.domref = document.createElement("ul");
			this.domref.obj = this;
			this.domref.control = this;

			// for keeping track of the focus on the tree widget
			this._focushack = document.createElement("input");
			this._focushack.obj = this;
			this._focushack.control = this;
			this._focushack.style.position = "absolute";
			this._focushack.style.left = "-9999px";
			this.domref.appendChild(this._focushack);
			
			var em = gara.eventManager;
			var list = this;

			/* special list event listener */
			em.addListener(this._focushack, "focus", function(e) {
				list.onFocus(e);
			});
			
			em.addListener(this._focushack, "blur", function(e) {
				list.onBlur(e);
			});

			/* user-defined event listener */
			for (var type in this._listener) {
				this._listener[type].forEach(function(elem, index, arr) {
					gara.eventManager.addListener(this.domref, type, elem);
				}, this);
			}

			/* list event listener */
			this.addListener("mousedown", this);
			this.addListener("mouseup", this);
			this.addListener("keydown", this);
		}

		this.domref.className = this._className;
		this._updateItems();
	},

	_updateItems : function() {
		for (var i = 0, items = this._items.length; i < items; ++i) {
			var item = this._items[i];
	
			// create item ...
			if (!item.isCreated()) {
				node = item.create();
				this.domref.appendChild(node);
				this._parentNode.appendChild(this.domref);
			}

			// ... or update it
			if (item.hasChanged()) {
				item.update();
				item.releaseChange();
			}
		}
	}
});