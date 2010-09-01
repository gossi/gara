/*	$Id: TabFolder.class.js 181 2009-08-02 20:51:16Z tgossmann $

		gara - Javascript Toolkit
	================================================================================================================

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

	================================================================================================================
*/

gara.provide("gara.jswt.widgets.TabFolder", "gara.jswt.widgets.Composite");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.TabItem");
gara.use("gara.jswt.widgets.Menu");
gara.use("gara.jswt.widgets.MenuItem");

/**
 * gara TabFolder Widget
 *
 * @class TabFolder
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Composite
 */
gara.Class("gara.jswt.widgets.TabFolder", function () { return {
	$extends : gara.jswt.widgets.Composite,

	/**
	 * @field
	 * The <code>TabFolder</code>'s items.
	 *
	 * @private
	 * @type {gara.jswt.widgets.TabItem[]}
	 */
	items : [],

	/**
	 * @field
	 * The recent activated items.
	 *
	 * @private
	 * @type {gara.jswt.widgets.TabItem[]}
	 */
	recents : [],

	/**
	 * @field
	 * Contains the active item.
	 *
	 * @private
	 * @type {gara.jswt.widgets.TabItem}
	 */
	activeItem : null,

	/**
	 * @field
	 * Contains a collection of selection listeners, that will be notified
	 * when selection changes.
	 *
	 * @private
	 * @type {gara.jswt.events.SelectionListener[]}
	 */
	selectionListeners : [],

	/**
	 * @field
	 * Contains the current selection.
	 *
	 * @private
	 * @type {gara.jswt.widgets.TabItem[]}
	 */
	selection : [],

	/**
	 * @field
	 * A queue of images which are currently being loaded and which size is
	 * calculated afterwards.
	 * (Safari workaround, width and height are not available after an image's
	 * src is added)
	 *
	 * @private
	 * @type {Image[]}
	 */
	imageQueue : [],

	/**
	 * @field
	 * Contains the <code>Menu</code> for invisible <code>TabItem</code>'s.
	 *
	 * @private
	 * @type {}
	 */
	dropDownMenu : null,

	/**
	 * @field
	 * More's DOM reference.
	 *
	 * @private
	 * @type {}
	 */
	more : null,

	/**
	 * @field
	 * More's text DOM reference.
	 *
	 * @private
	 * @type {}
	 */
	moreText : null,

	/**
	 * @field
	 * Tabbar's DOM reference.
	 *
	 * @private
	 * @type {}
	 */
	tabbar : null,

	/**
	 * @field
	 * ClientArea's DOM reference.
	 *
	 * @private
	 * @type {}
	 */
	clientArea : null,

	/**
	 * @constructor
	 * @param {gara.jswt.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 */
	$constructor : function (parent, style) {
		this.items = [];
		this.recents = [];
		this.activeItem = null;
		this.selectionListeners = [];
		this.tabFolderListeners = [];
		this.selection = [];
		this.imageQueue = [];
		this.event = null;
		this.dropDownMenu = null;

		this.more = null;
		this.moreText = null;
		this.tabbar = null;
		this.clientArea = null;

		// style
		style = style || gara.jswt.JSWT.TOP | gara.jswt.JSWT.DROP_DOWN;
		if (!((style & gara.jswt.JSWT.TOP) === gara.jswt.JSWT.TOP) &&
				!((style & gara.jswt.JSWT.BOTTOM) === gara.jswt.JSWT.BOTTOM)) {
			style |= gara.jswt.JSWT.TOP;
		}

		if (!((style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI) &&
				!((style & gara.jswt.JSWT.DROP_DOWN) === gara.jswt.JSWT.DROP_DOWN)) {
			style |= gara.jswt.JSWT.DROP_DOWN;
		}

		this.$super(parent, style);
	},

	/**
	 * @method
	 * Adds an item to this <code>TabFolder</code>
	 *
	 * @private
	 * @param {gara.jswt.widgets.TabItem} item the item to be added
	 * @throws {TypeError} if the item is not type of gara.jswt.widgets.TabItem
	 * @return {void}
	 */
	addItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TabItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TabItem");
		}

		this.items.push(item);
		this.recents.push(item);

		if (this.activeItem === null) {
			this.activeItem = item;
			this.activeItem.setActive(true);
			this.selection = [this.activeItem];
		}

		return this.tabbar;
	},

	/**
	 * @method
	 * Adds a selection listener on the tabfolder
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the desired listener to be added to this tabfolder
	 * @return {gara.jswt.widgets.TabFolder} this
	 */
	addSelectionListener : function (listener) {
		this.checkWidget();
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListeners[this.selectionListeners.length] = listener;
		}
		
		return this;
	},
	
	/**
	 * @method
	 * Adds a TabFolder listener on the tabfolder
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.TabFolderListener} listener the desired listener to be added to this tabfolder
	 * @return {gara.jswt.widgets.TabFolder} this
	 */
	addTabFolderListener : function (listener) {
		this.checkWidget();
		if (!this.tabFolderListeners.contains(listener)) {
			this.tabFolderListeners[this.tabFolderListeners.length] = listener;
		}
		
		return this;
	},

	/**
	 * @method
	 * Activates an item and notifies the selection listener
	 *
	 * @private
	 * @param {gara.jswt.widgets.TabItem} item the item to be activated
	 * @throws {TypeError} if the item is not type of gara.jswt.widgets.TabItem
	 * @return {void}
	 */
	activateItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TabItem)) {
			throw new TypeError("item is not type of gara.jswt.widgets.TabItem");
		}
		
		if (this.activeItem !== null && !this.activeItem.isDisposed()) {
			this.activeItem.setActive(false);
		}

		this.recents.remove(item);
		this.recents.insertAt(0, item);
		
		this.activeItem = item;
		this.activeItem.setActive(true);
		this.tabbar.setAttribute("aria-activedescendant", this.activeItem.getId());

		this.updateMeasurements();
		
		if (this.activeItem.getControl() !== null
				&& this.activeItem.getControl() instanceof gara.jswt.widgets.Scrollable) {
			this.activeItem.getControl().setHeight(this.clientArea.clientHeight - gara.getNumStyle(this.clientArea, "padding-top") - gara.getNumStyle(this.clientArea, "padding-bottom"));
			this.activeItem.getControl().setWidth(this.clientArea.clientWidth - gara.getNumStyle(this.clientArea, "padding-left") - gara.getNumStyle(this.clientArea, "padding-right"));
		}

		this.selection = [item];
		this.notifySelectionListener();
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	bindListener : function (eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	createWidget : function () {
		var self = this;
		this.createHandle("div");

		// css
		this.addClass("jsWTTabFolder");

		// listener
		this.addListener("mousedown", this);

		// nodes
		this.tabbar = document.createElement("ul");
		this.tabbar.id = this.getId() + "-tablist";
		this.tabbar.widget = this;
		this.tabbar.control = this;
		this.tabbar.className = "jsWTTabFolderBar";
		this.tabbar.setAttribute("role", "tablist");

		this.clientArea = document.createElement("div");
		this.clientArea.className = "jsWTTabClientArea";

		if ((this.style & gara.jswt.JSWT.TOP) === gara.jswt.JSWT.TOP) {
			this.handle.appendChild(this.tabbar);
			this.handle.appendChild(this.clientArea);
			this.addClass("jsWTTabFolderTopbar");
		} else {
			this.handle.appendChild(this.clientArea);
			this.handle.appendChild(this.tabbar);
			this.addClass("jsWTTabFolderBottombar");
		}

		// drop down initializer for "more" option
		if ((this.style & gara.jswt.JSWT.DROP_DOWN) === gara.jswt.JSWT.DROP_DOWN) {
			this.more = document.createElement("span");
			this.moreText = document.createTextNode("");
			this.more.className = "more";
			this.more.style.display = "none";
			this.handle.appendChild(this.more);
			this.more.appendChild(this.moreText);

			gara.EventManager.addListener(this.more, "mousedown", this);
			this.dropDownMenu = new gara.jswt.widgets.Menu(this, gara.jswt.JSWT.DROP_DOWN);
			this.dropDownMenu.addMenuListener({
				menuHidden : function () {
					self.handle.style.overflow = "auto";
				}
			});
		}
	},
	
	destroyWidget : function () {
		this.items = null;
		this.recents = null;
		this.activeItem = null;
		this.selectionListeners = null;
		this.tabFolderListeners = null;
		this.selection = null;
		this.imageQueue = null;
		
		this.$super();
	},

	/**
	 * @method
	 * Returns the client area off the active TabItem. Takes an TabItem as
	 * argument to retrieve the client area of that one.
	 *
	 * @author Thomas Gossmann
	 * @return {HTMLElement} the client area HTML element
	 */
	getClientArea : function () {
		return this.clientArea;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getDropDownMenu : function () {
		return this.dropDownMenu;
	},

	/**
	 * @method
	 * Gets a specified item with a zero-related index
	 *
	 * @param {int} index the zero-related index
	 * @throws {RangeError} when there is no item at the given index
	 * @return {gara.jswt.widgets.TabItem} the item
	 */
	getItem : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) == "undefined") {
			throw new RangeError("There is no item for the given index");
		}

		return this.items[index];
	},

	/**
	 * @method
	 * Returns the amount of the items in the tabfolder
	 *
	 * @author Thomas Gossmann
	 * @return {int} the amount
	 */
	getItemCount : function () {
		return this.items.length;
	},

	/**
	 * @method
	 * Returns an array with all the items in the tabfolder
	 *
	 * @return {gara.jswt.TabItem[]} the array with the items
	 */
	getItems : function () {
		return this.items;
	},

	/**
	 * @method
	 * Returns an array with the items which are currently selected in the tabfolder
	 *
	 * @return {gara.jswt.TabItem[]} an array with items
	 */
	getSelection : function () {
		this.checkWidget();
		return this.selection;
	},

	/**
	 * @method
	 * Returns the zero-related index of the selected item or -1 if there is no item selected
	 *
	 * @return {int} the index of the selected item
	 */
	getSelectionIndex : function () {
		this.checkWidget();
		if (this.selection.length) {
			return this.items.indexOf(this.selection[0]);
		} else {
			return -1;
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getTabbar : function () {
		return this.tabbar;
	},

	/**
	 * @method
	 * Handles events for this tabfolder
	 *
	 * @private
	 * @return {void}
	 */
	handleEvent : function (e) {
		this.checkWidget();
		
		// special events for the list
		var widget = e.target.widget || null;
		e.item = widget && widget instanceof gara.jswt.widgets.TabItem ? widget : this.activeItem;
		e.widget = this;
		this.event = e;

		this.handleMouseEvents(e);
		if (this.menu !== null && this.menu.isVisible()) {
			this.menu.handleEvent(e);
		} else {
			this.handleKeyEvents(e);
			this.handleMenu(e);
		}

		this.$super(e);

		if (e.item !== null) {
			e.item.handleEvent(e);
		}

		e.stopPropagation();
		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	handleMouseEvents : function (e) {
		switch (e.type) {
		case "mousedown":
			if (e.target === this.more) {
				this.handle.style.overflow = "visible";
				this.dropDownMenu.setLocation(this.more.offsetLeft, this.more.offsetTop + this.more.offsetHeight + 1);
				this.dropDownMenu.setVisible(true);
			} else {
				this.activateItem(e.item);
			}

//			if (e.target.widget instanceof gara.jswt.widgets.MenuItem) {
//				this.dropDownMenu.setVisible(false);
//				this.activateItem(e.target.widget.getData("gara__tabItem"));
//			}
			break;
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	handleKeyEvents : function (e) {
		switch (e.type) {
			case "keydown":
				this.handleKeyNavigation(e);
				break;
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	handleKeyNavigation : function (e) {
		var nextIndex, prevIndex;
		switch (e.keyCode) {
		// left
		case gara.jswt.JSWT.ARROW_LEFT:
			if (this.activeItem !== null) {
				prevIndex = this.indexOf(this.activeItem) - 1;
				if (prevIndex >= 0) {
					this.activateItem(this.items[prevIndex]);
				}
			}
			break;

		// right
		case gara.jswt.JSWT.ARROW_RIGHT:
			if (this.activeItem !== null) {
				nextIndex = this.indexOf(this.activeItem) + 1;
				if (nextIndex < this.items.length) {
					this.activateItem(this.items[nextIndex]);
				}
			}
			break;

		// home
		case gara.jswt.JSWT.HOME:
			if (this.items.length) {
				this.activateItem(this.items[0]);
			}
			break;

		// end
		case gara.jswt.JSWT.END:
			if (this.items.length) {
				this.activateItem(this.items[this.items.length - 1]);
			}
			break;
		}
	},

	/**
	 * @method
	 * Looks for the index of a specified item
	 *
	 * @param {gara.jswt.widgets.TabItem} item the item for the index
	 * @throws {TypeError} if the item is not a gara.jswt.widgets.TabItem
	 * @return {int} the index of the specified item
	 */
	indexOf : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TabItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TabItem");
		}

		return this.items.indexOf(item);
	},

	/**
	 * @method
	 * Notifies selection listener about the changed selection within the List
	 *
	 * @private
	 * @return {void}
	 */
	notifySelectionListener : function () {
		this.selectionListeners.forEach(function (listener) {
			if (listener.widgetSelected) {
				listener.widgetSelected(this.event);
			}
		}, this);
	},
	

	/**
	 * @method
	 * 
	 * @private
	 * @param eventType
	 * @returns {boolean} true if the operation is permitted
	 */
	notifyTabFolderListener : function (eventType) {
		var ret = true;
		this.tabFolderListeners.forEach(function (listener) {
			var answer, e = this.event || window.event || {};
			e.widget = this;
			e.control = this;

			if (listener[eventType]) {
				answer = listener[eventType](e);
				if (typeof(answer) !== "undefined" && !answer) {
					ret = false;
				}
			}
		}, this);
		return ret;
	},
	
	
	/**
	 * @method
	 * Releases all children from the receiver
	 *
	 * @private
	 * @return {void}
	 */
	releaseChildren : function () {
		this.items.forEach(function (item) {
			item.release();
		}, this);
		
		this.$super();
	},
	
	/**
	 * @method
	 * Releases an item from the receiver
	 *
	 * @private
	 * @param {gara.jswt.widgets.TableItem} item the item that should removed from the receiver
	 * @return {void}
	 */
	releaseItem : function (item) {
		if (this.items.contains(item)) {
			this.tabbar.removeChild(item.handle);
			this.clientArea.removeChild(item.getClientArea());
			this.items.remove(item);
			this.recents.remove(item);
			
			// set last recent item active
			if (this.activeItem === item) {
				this.activateItem(this.recents[0]);
			}
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	remeasureItems : function (item) {
		item.width += item.getImage().width;
		this.imageQueue.remove(item);
		if (!this.imageQueue.length) {
			this.updateMeasurements();
		}
	},

	/**
	 * @method
	 * Removes an item from the <code>TabFolder</code>
	 *
	 * @param {gara.jswt.widgets.TabItem} item the item to remove
	 * @return {void}
	 */
	remove : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.jswt.widgets.TabItem)) {
			throw new TypeError("item not instance of gara.jswt.widgets.TabItem");
		}

		this.items.remove(item);
		if (this.selection.contains(item)) {
			this.selection.remove(item);
		}
		item.dispose();
		delete item;
	},

	/**
	 * @method
	 * Removes an item from the <code>TabFolder</code>
	 *
	 * @param {int} index the index of the item
	 * @throws {RangeError} when there is no item at the given index
	 * @return {void}
	 */
	removeIndex : function (index) {
		var item;
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) == "undefined") {
			throw new RangeError("There is no item for the given index");
		}
		item = this.items.removeAt(index)[0];
		if (this.selection.contains(item)) {
			this.selection.remove(item);
		}
		item.dispose();
		delete item;
	},

	/**
	 * @method
	 * Removes items within an indices range
	 *
	 * @param {int} start start index
	 * @param {int} end end index
	 * @return {void}
	 */
	removeRange : function (start, end) {
		for (var i = start; i <= end; ++i) {
			this.removeIndex(i);
		}
	},

	/**
	 * @method
	 * Removes items which indices are passed by an array
	 *
	 * @param {Array} inidices the array with the indices
	 * @return {void}
	 */
	removeFromArray : function (indices) {
		indices.forEach(function (index) {
			this.removeIndex(index);
		}, this);
	},

	/**
	 * @method
	 * Removes all items from the tree
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	removeAll : function () {
		this.checkWidget();
		while (this.items.length) {
			this.removeIndex(0);
		}
	},

	/**
	 * @method
	 * Removes a selection listener from this tabfolder
	 *
	 * @param {gara.jswt.events.SelectionListener} listener the listener to remove from this tabfolder
	 * @return {gara.jswt.widgets.TabFolder} this
	 */
	removeSelectionListener : function (listener) {
		this.checkWidget();
		this.selectionListeners.remove(listener);
		return this;
	},
	
	/**
	 * @method
	 * Removes a TabFolder listener from this tabfolder
	 *
	 * @param {gara.jswt.events.SelectionListener} listener the listener to remove from this tabfolder
	 * @return {gara.jswt.widgets.TabFolder} this
	 */
	removeTabFolderListener : function (listener) {
		this.checkWidget();
		this.tabFolderListeners.remove(listener);
		return this;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	scrolledHandle : function () {
		return this.clientArea;
	},

	setHeight : function (height) {
		var clientHeight;
		this.$super(height);
//		console.log("TabFolder.setHeight: " + height);
		this.updateMeasurements();
		if (this.activeItem !== null && this.activeItem.getControl() !== null
				&& this.activeItem.getControl() instanceof gara.jswt.widgets.Scrollable) {
			clientHeight = this.clientArea.offsetHeight - gara.getNumStyle(this.clientArea, "border-top-width") - gara.getNumStyle(this.clientArea, "border-bottom-width") - gara.getNumStyle(this.clientArea, "padding-top") - gara.getNumStyle(this.clientArea, "padding-bottom");
			this.activeItem.getClientArea().style.height = clientHeight + "px";
			this.activeItem.getControl().setHeight(clientHeight);
		}
		return this;
	},

	/**
	 * @method
	 * Selects the item in the TabFolder.
	 *
	 * @param {gara.jswt.TabItem} item the item to select
	 * @throws {RangeError} when there is no item at the given index
	 * @return {void}
	 */
	setSelectionItem : function (item) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) == "undefined") {
			throw new RangeError("There is no item for the given index");
		}
		this.activateItem(this.items[index]);
		return this;
	},

	/**
	 * @method
	 * Selects the item at the given zero-related index in the TabFolder.
	 *
	 * @param {mixed} arg the given zero-related index or the given array
	 * @throws {RangeError} when there is no item at the given index
	 * @return {void}
	 */
	setSelectionIndex : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) == "undefined") {
			throw new RangeError("There is no item for the given index");
		}
		this.activateItem(this.items[index]);
		return this;
	},

	/**
	 * @method
	 * Selects the item at the given zero-related index in the TabFolder.
	 * Takes an array as argument, though the first element within is selected (indices[0])
	 *
	 * @param {int[]} indices an array with zero-related indices
	 * @return {void}
	 */
	setSelectionFromArray : function (indices) {
		this.checkWidget();
		if (indices.length) {
			this.activateItem(indices[0]);
		}
		return this;
	},

	setWidth : function (width) {
		var clientWidth;
		this.$super(width);
		this.updateMeasurements();
		if (this.activeItem !== null) {
			var clientWidth = this.clientArea.offsetWidth - gara.getNumStyle(this.clientArea, "border-left-width") - gara.getNumStyle(this.clientArea, "border-right-width") - gara.getNumStyle(this.clientArea, "padding-left") - gara.getNumStyle(this.clientArea, "padding-right");
			this.activeItem.getClientArea().style.width = clientWidth + "px";
			if (this.activeItem.getControl() !== null
					&& this.activeItem.getControl() instanceof gara.jswt.widgets.Scrollable) {
				this.activeItem.getControl().setWidth(clientWidth);
			}
		}
		return this;
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.Widget
	 *
	 * @private
	 * @return {void}
	 */
	unbindListener : function (eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	},

	/**
	 * @method
	 * updates this tabfolder
	 *
	 * @return {void}
	 */
	update : function () {
		this.checkWidget();

		this.updateMeasurements();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	updateMeasurements : function () {
		var width, itemsWidth = 0, rows = 1, more = 0, hasImages = false, itemLoop,
			visible;

		// class name and some measurement adjustments
		this.handle.style.width = this.width !== null ? this.width + "px" : "auto";
		this.handle.style.height = this.height !== null ? this.height + "px" : "auto";
		this.tabbar.style.width = this.width !== null ? this.width + "px" : "auto";

		// update items
		width = this.width !== null ? this.width : this.handle.clientWidth;
		itemLoop = (this.style & gara.jswt.JSWT.DROP_DOWN) === gara.jswt.JSWT.DROP_DOWN ? this.recents : this.items;

		if ((this.style & gara.jswt.JSWT.DROP_DOWN) === gara.jswt.JSWT.DROP_DOWN) {
			visible = this.more.style.display;
			this.more.style.display = "block";
			width = this.more.offsetLeft - gara.getNumStyle(this.more, "margin-left");
			this.more.style.display = visible;
		}

		itemLoop.forEach(function (item) {
			var self = this;
			if (item.isDisposed()) {
				this.remove(index);
			} else {
				item.handle.style.display = "block";
				item.update();
				item.width = item.handle.offsetWidth;


				if (!item.width) {
					if (item.getImage() !== null && navigator.userAgent.toLowerCase().indexOf("webkit") !== -1) {
						this.imageQueue.push(item);
						// kinda crappy with the .onload but listener wasn't working
						item.getImage().onload = function () {
							self.remeasureItems(item);
						}
					}
				}

				if ((this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI) {
					if (itemsWidth + item.handle.offsetWidth > width) {
						rows++;
						itemsWidth = item.handle.offsetWidth;
					} else {
						itemsWidth += item.handle.offsetWidth;
					}
				}

				if ((this.style & gara.jswt.JSWT.DROP_DOWN) === gara.jswt.JSWT.DROP_DOWN) {
					if (itemsWidth + item.width > width) {
						more++;
					}
					itemsWidth += item.width;

					if (more) {
						item.handle.style.display = "none";
						item.getData("gara__menuItem").setVisible(true);
					} else {
						item.handle.style.display = "block";
						item.getData("gara__menuItem").setVisible(false);
					}
				}
			}
		}, this);

		if ((this.style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI && rows > 1) {
			this.tabbar.style.height = ((this.items[0].handle.offsetHeight * rows) - 1) + "px";
		}

		if ((this.style & gara.jswt.JSWT.DROP_DOWN) === gara.jswt.JSWT.DROP_DOWN && more) {
			this.moreText.nodeValue = more;
			this.more.style.display = "block";
		} else if ((this.style & gara.jswt.JSWT.DROP_DOWN) === gara.jswt.JSWT.DROP_DOWN && !more) {
			this.more.style.display = "none";
		}

		// more measurement adjustments
		if (this.height !== null) {
			this.clientArea.style.height = (this.height
				- (this.tabbar.offsetHeight
					+ gara.getNumStyle(this.tabbar, "margin-top")
					+ gara.getNumStyle(this.tabbar, "margin-bottom"))
				- gara.getNumStyle(this.clientArea, "margin-top")
				- gara.getNumStyle(this.clientArea, "border-top-width")
				- gara.getNumStyle(this.clientArea, "border-bottom-width")
				- gara.getNumStyle(this.clientArea, "margin-bottom")
				) + "px";
		}

		if (this.width !== null) {
			this.clientArea.style.width = this.width
				- gara.getNumStyle(this.clientArea, "margin-left")
				- gara.getNumStyle(this.clientArea, "border-left-width")
				- gara.getNumStyle(this.clientArea, "border-right-width")
				- gara.getNumStyle(this.clientArea, "margin-right")
			+ "px";
		}
	}
};});