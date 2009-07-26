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
 * gara TabFolder Widget
 * 
 * @class TabFolder
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends gara.jswt.Composite
 */
$class("TabFolder", {
	$extends : gara.jswt.Composite,

	/**
	 * @constructor
	 * @param {gara.jswt.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);

		// TabFolder default style
		if (this._style == JSWT.DEFAULT) {
			this._style = JSWT.TOP;
		}

		this._items = [];
		this._activeItem = null;
		this._selectionListener = [];
		this._selection = [];
		this._event = null;

		this._tabbar = null;
		this._clientArea = null;
		this._className = this._baseClass = "jsWTTabFolder";
		this._className += " jsWTTabFolderInactive";
	},

	/**
	 * @method
	 * Adds an item to this tabfolder
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TabItem} item the item to be added
	 * @throws {TypeError} if the item is not type of gara.jswt.TabItem
	 * @return {void}
	 */
	_addItem : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TabItem)) {
			throw new TypeError("item is not type of gara.jswt.TabItem");
		}

		item._setClientArea(this._clientArea);
		this._items.push(item);
	},

	/**
	 * @method
	 * Adds a selection listener on the tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the desired listener to be added to this tabfolder
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function(listener) {
		this.checkWidget();
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
		}

		this._selectionListener.push(listener);
	},

	/**
	 * @method
	 * Activates an item and notifies the selection listener
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TabItem} item the item to be activated
	 * @throws {TypeError} if the item is not type of gara.jswt.TabItem
	 * @return {void}
	 */
	_activateItem : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TabItem)) {
			throw new TypeError("item is not type of gara.jswt.TabItem");
		}
		
		if (this._activeItem != null) {
			this._activeItem._setActive(false);
		}
		
		this._activeItem = item;
		this._activeItem._setActive(true);

		// clean up client area
		/*for (var i = 0, len = this._clientArea.childNodes.length; i < len; ++i) {
			this._clientArea.removeChild(this._clientArea.childNodes[i]);
		}

		// show new content
		if(item.getControl() != null) {
			item.getControl().update();
			this._clientArea.appendChild(item.getControl().domref);
		} else {
			if (typeof(item.getContent()) == "string") {
				this._clientArea.appendChild(document.createTextNode(item.getContent()));
			} else {
				this._clientArea.appendChild(item.getContent());
			}
		}*/

		this.update();

		this._selection = [];
		this._selection.push(item);
		this._notifySelectionListener();
	},
	
	_create : function() {
		this.domref = document.createElement("div");
		this.domref.obj = this;
		this.domref.control = this;
		base2.DOM.EventTarget(this.domref);

		this._tabbar = document.createElement("ul");
		this._tabbar.obj = this;
		this._tabbar.control = this;
		this._tabbar.className = "jsWTTabbar";
		base2.DOM.EventTarget(this._tabbar);

		this._clientArea = document.createElement("div");
		this._clientArea.className = "jsWTTabClientArea"
		base2.DOM.EventTarget(this._clientArea);

		if (this._style == JSWT.TOP) {
			this.domref.appendChild(this._tabbar);
			this.domref.appendChild(this._clientArea);
			this.addClassName("jsWTTabFolderTopbar");
		} else {
			this.domref.appendChild(this._clientArea);
			this.domref.appendChild(this._tabbar);
			this.addClassName("jsWTTabFolderBottombar");
		}

		/* buffer unregistered user-defined listeners */
		var unregisteredListener = {};			
		for (var eventType in this._listener) {
			unregisteredListener[eventType] = this._listener[eventType].concat([]);
		}

		/* List event listener */
		this.addListener("mousedown", this);

		/* register user-defined listeners */
		for (var eventType in unregisteredListener) {
			unregisteredListener[eventType].forEach(function(elem, index, arr) {
				this.registerListener(eventType, elem);
			}, this);
		}

		/* If parent is not a composite then it *must* be a HTMLElement
		 * but because of IE there is no cross-browser check. Or no one I know of.
		 */
		if (!$class.instanceOf(this._parent, gara.jswt.Composite)) {
			this._parentNode = this._parent;
		}

		if (this._parentNode != null) {
			this._parentNode.appendChild(this.domref);
		}
	},
	
	dispose : function() {
		this.$base();

		this._items.forEach(function(item, index, arr) {
			item.dispose();
		}, this);

		this.domref.removeChild(this._tabbar);
		this.domref.removeChild(this._clientArea);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.domref);
		}
		
		delete this._tabbar;
		delete this._clientArea;
		delete this.domref;
	},

	/**
	 * @method
	 * Returns the client area off that tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @return {HTMLElement} the client area node
	 */
	getClientArea : function() {
		return this._clientArea;
	},
	
	/**
	 * @method
	 * Gets a specified item with a zero-related index
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {gara.OutOfBoundsException} if the index does not live within this tabfolder
	 * @return {gara.jswt.TabItem} the item
	 */
	getItem : function(index) {
		this.checkWidget();
		if (index >= this._items.length) {
			throw new gara.OutOfBoundsException("Your item lives outside of this tabfolder");
		}
	
		return this._items[index];
	},

	/**
	 * @method
	 * Returns the amount of the items in the tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @return {int} the amount
	 */
	getItemCount : function() {
		return this._items.length;
	},

	/**
	 * @method
	 * Returns an array with all the items in the tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @return {gara.jswt.TabItem[]} the array with the items
	 */
	getItems : function() {
		return this._items;
	},

	/**
	 * @method
	 * Returns an array with the items which are currently selected in the tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @return {gara.jswt.TabItem[]} an array with items
	 */
	getSelection : function() {
		this.checkWidget();
		return this._selection;
	},
	
	/**
	 * @method
	 * Returns the zero-related index of the selected item or -1 if there is no item selected
	 * 
	 * @author Thomas Gossmann
	 * @return {int} the index of the selected item
	 */
	getSelectionIndex : function() {
		this.checkWidget();
		if (this._selection.length) {
			return this._items.indexOf(this._selection[0]);
		} else {
			return -1;
		}
	},

	/**
	 * @method
	 * Handles events for this tabfolder
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	handleEvent : function(e) {
		this.checkWidget();
		var obj = e.target.obj || null;
		
		if (obj && $class.instanceOf(obj, gara.jswt.TabItem)) {
			e.item = obj;
		}
		e.widget = this;
		this._event = e;

		switch (e.type) {
			case "mousedown":
				if (!this._hasFocus) {
					this.forceFocus();
				}

				if ($class.instanceOf(obj, gara.jswt.TabItem)) {
					var item = obj;

					this._activateItem(item);
				}
				break;
			
						
			case "keyup":
			case "keydown":
			case "keypress":
			
				if (this._activeItem != null) {
					this._activeItem.handleEvent(e);
				}

				this._notifyExternalKeyboardListener(e, this, this);
				
				break;
		}
		
		this.handleContextMenu(e);

		if (e.target != this.domref) {
			e.stopPropagation();
		}
		
		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},
	
	/**
	 * @method
	 * Looks for the index of a specified item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TabItem} item the item for the index
	 * @throws {gara.jswt.ItemNotExistsException} if the item does not exist in this tabfolder
	 * @throws {TypeError} if the item is not a TabItem
	 * @return {int} the index of the specified item
	 */
	indexOf : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.TabItem)) {
			throw new TypeError("item not instance of gara.jswt.TabItem");
		}
	
		if (!this._items.contains(item)) {
			throw new gara.jswt.ItemNotExistsException("item [" + item + "] does not exists in this list");
		}

		return this._items.indexOf(item);
	},

	/**
	 * @method
	 * Notifies selection listener about the changed selection within the List
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_notifySelectionListener : function() {
		for (var i = 0, len = this._selectionListener.length; i < len; ++i) {
			this._selectionListener[i].widgetSelected(this._event);
		}
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.Widget
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_registerListener : function(eventType, listener) {
		if (this.domref != null) {
			gara.EventManager.addListener(this.domref, eventType, listener);
		}
	},

	/**
	 * @method
	 * Removes a selection listener from this tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the listener to remove from this tabfolder
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function(listener) {
		this.checkWidget();
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
		}

		if (this._selectionListener.contains(listener)) {
			this._selectionListener.remove(listener);
		}
	},
	
	/**
	 * @method
	 * Selects the item at the given zero-related index in the tabfolder.
	 * Sets the tabfolders selection the the given array.
	 * Depends on the parameter
	 * 
	 * @author Thomas Gossmann
	 * @param {mixed} arg the given zero-related index or the given array
	 * @throws {gara.OutOfBoundsException} when there is no item for the given index
	 * @return {void}
	 */
	setSelection : function(arg) {
		this.checkWidget();
		if (typeof(arg) == 'number') {
			if (arg >= this._items.length) {
				throw new gara.OutOfBoundsException("Your item lives outside of this tabfolder");
			}
			this._activateItem(this._items[arg]);
		} else if ($class.instanceOf(arg, Array)) {
			if (arg.length) {
				this._activateItem(arg[0]);
			}
		}
	},
	
	/**
	 * @method
	 * Shows off the content for the client area from the passed item
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TabItem} item the item with the content
	 * @return {void}
	 */
	_showContent : function(item) {
		
	},
	
	toString : function() {
		return "[gara.jswt.TabFolder]";
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
		if (this.domref != null) {
			gara.EventManager.removeListener(this.domref, eventType, listener);
		}
	},

	/**
	 * @method
	 * updates this tabfolder
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function() {
		this.checkWidget();
		if (this.domref == null) {
			this._create();
		}

		this.domref.className = this._className;
		this.domref.style.width = this._width != null ? this._width + "px" : "auto";
		this.domref.style.height = this._height != null ? this._height + "px" : "auto";

		this._tabbar.style.width = this._width != null ? this._width + "px" : "auto"
		this._tabbar.style.width = this._width != null ? this._width + "px" : "auto";

		if (this._height != null) {
			this._clientArea.style.height = (this._height 
				- (this._tabbar.offsetHeight
					+ parseInt(gara.Utils.getStyle(this._tabbar, "margin-top"))
					+ parseInt(gara.Utils.getStyle(this._tabbar, "margin-bottom")))
				- parseInt(gara.Utils.getStyle(this._clientArea, "margin-top"))
				- parseInt(gara.Utils.getStyle(this._clientArea, "border-top-width"))
				- parseInt(gara.Utils.getStyle(this._clientArea, "border-bottom-width"))
				- parseInt(gara.Utils.getStyle(this._clientArea, "margin-bottom"))
				) + "px";
		}

		if (this._width != null) {
			this._clientArea.style.width = this._width
				- parseInt(gara.Utils.getStyle(this._clientArea, "margin-left"))
				- parseInt(gara.Utils.getStyle(this._clientArea, "border-left-width"))
				- parseInt(gara.Utils.getStyle(this._clientArea, "border-right-width"))
				- parseInt(gara.Utils.getStyle(this._clientArea, "margin-right"))
			+ "px";	
		}

		// update items
		this._items.forEach(function(item, index, arr) {
			item._setClientArea(this._clientArea);
			
			// create item ...
			if (!item.isCreated()) {
				node = item._create();
				this._tabbar.appendChild(node);
			}

			// ... or update it
			if (item.hasChanged()) {
				item.update();
				item.releaseChange();
			}
		}, this);
		
		if (this._activeItem == null && this._items.length) {
			this._activateItem(this._items[0]);
		}
	}
});