/*

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://garathekit.org

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

"use strict";

gara.provide("gara.widgets.TabFolder", "gara.widgets.Composite");

gara.use("gara.widgets.TabItem");
gara.use("gara.widgets.Menu");
gara.use("gara.widgets.MenuItem");

/**
 * gara TabFolder Widget
 *
 * @class gara.widgets.TabFolder
 * @extends gara.widgets.Composite
 */
gara.Class("gara.widgets.TabFolder", function () { return /** @lends gara.widgets.TabFolder# */ {
	$extends : gara.widgets.Composite,

	/**
	 * The <code>TabFolder</code>'s items.
	 *
	 * @private
	 * @type {gara.widgets.TabItem[]}
	 */
	items : [],

	/**
	 * The recent activated items.
	 *
	 * @private
	 * @type {gara.widgets.TabItem[]}
	 */
	recents : [],

	/**
	 * Contains the active item.
	 *
	 * @private
	 * @type {gara.widgets.TabItem}
	 */
	activeItem : null,

	/**
	 * Contains a collection of selection listeners, that will be notified
	 * when selection changes.
	 *
	 * @private
	 * @type {gara.events.SelectionListener[]}
	 */
	selectionListeners : [],

	/**
	 * Contains the current selection.
	 *
	 * @private
	 * @type {gara.widgets.TabItem[]}
	 */
	selection : [],

	/**
	 * A queue of images which are currently being loaded and which size is
	 * calculated afterwards.
	 * (Webkit workaround, width and height are not available after an image's
	 * src is added)
	 *
	 * @private
	 * @type {Image[]}
	 */
	imageQueue : [],

	/**
	 * Contains the <code>Menu</code> for invisible <code>TabItem</code>'s.
	 *
	 * @private
	 * @type {}
	 */
	dropDownMenu : null,

	/**
	 * More's DOM reference.
	 *
	 * @private
	 * @type {}
	 */
	more : null,

	/**
	 * More's text DOM reference.
	 *
	 * @private
	 * @type {}
	 */
	moreText : null,

	/**
	 * Tabbar's DOM reference.
	 *
	 * @private
	 * @type {}
	 */
	tabbar : null,

	/**
	 * ClientArea's DOM reference.
	 *
	 * @private
	 * @type {}
	 */
	clientArea : null,

	/**
	 * @constructs
	 * @extends gara.widgets.Composite
	 * @param {gara.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the tabfolder (optional)
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
		
		this.adjustedWidth = null;
		this.adjustedHeight = null;

		// style
		style = style || gara.TOP | gara.DROP_DOWN;
		if ((style & gara.TOP) === 0 &&
				(style & gara.BOTTOM) === 0) {
			style |= gara.TOP;
		}

		if ((style & gara.MULTI) === 0 &&
				(style & gara.DROP_DOWN) === 0) {
			style |= gara.DROP_DOWN;
		}

		this.$super(parent, style);
	},

	/**
	 * Adds an item to this <code>TabFolder</code>
	 *
	 * @private
	 * @param {gara.widgets.TabItem} item the item to be added
	 * @throws {TypeError} if the item is not type of gara.widgets.TabItem
	 * @returns {void}
	 */
	addItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TabItem)) {
			throw new TypeError("item is not type of gara.widgets.TabItem");
		}

		this.items.add(item);
		this.recents.add(item);

		if (this.activeItem === null) {
			this.activeItem = item;
			this.activeItem.setActive(true);
			this.selection = [this.activeItem];
		}

		return this.tabbar;
	},

	/**
	 * Adds the listener to the collection of listeners who will be notified 
	 * when the user changes the receiver's selection, by sending it one of 
	 * the messages defined in the <code>SelectionListener</code> interface. 
	 *
	 * @param {gara.events.SelectionListener} listener the listener which should be notified when the user changes the receiver's selection 
	 * @returns {gara.widgets.TabFolder} this
	 */
	addSelectionListener : function (listener) {
		this.checkWidget();
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListeners.add(listener);
		}
		return this;
	},
	
	/**
	 * Adds the listener to the collection of listeners who will be notified 
	 * by sending it one of the messages defined in the 
	 * <code>TabFolderListener</code> interface
	 *
	 * @param {gara.events.TabFolderListener} listener the listener which should be notified 
	 * @returns {gara.widgets.TabFolder} this
	 */
	addTabFolderListener : function (listener) {
		this.checkWidget();
		if (!this.tabFolderListeners.contains(listener)) {
			this.tabFolderListeners.add(listener);
		}
		return this;
	},

	/*
	 * jsdoc in gara.widgets.Control
	 */
	adjustHeight : function (height) {
		var clientHeight;
		this.$super(height);
		this.adjustedHeight = height;
		this.updateMeasurements();
		
//		if (this.activeItem !== null) {
//			clientHeight = this.clientArea.offsetHeight - gara.getNumStyle(this.clientArea, "padding-top") - gara.getNumStyle(this.clientArea, "padding-bottom") - gara.getNumStyle(this.clientArea, "border-top-width") - gara.getNumStyle(this.clientArea, "border-bottom-width");
////			this.activeItem.getClientArea().style.height = clientHeight + "px";
//			
//			if (this.activeItem.getControl() !== null
//				&& this.activeItem.getControl() instanceof gara.widgets.Scrollable) {
//				this.activeItem.getControl().setHeight(clientHeight);
//			}
//		}
		return this;
	},
	
	/*
	 * jsdoc in gara.widgets.Control
	 */
	adjustWidth : function (width) {
		var clientWidth;
		this.$super(width);
		this.adjustedWidth = width;
		this.updateMeasurements();
		
//		if (this.activeItem !== null) {
//			clientWidth = this.clientArea.offsetWidth - gara.getNumStyle(this.clientArea, "padding-left") - gara.getNumStyle(this.clientArea, "padding-right") - gara.getNumStyle(this.clientArea, "border-left-width") - gara.getNumStyle(this.clientArea, "border-right-width");
////			this.activeItem.getClientArea().style.width = clientWidth + "px";
//			if (this.activeItem.getControl() !== null
//					&& this.activeItem.getControl() instanceof gara.widgets.Scrollable) {
//				this.activeItem.getControl().setWidth(clientWidth);
//			}
//		}
		return this;
	},
	
	/**
	 * Activates an item and notifies the selection listener
	 *
	 * @private
	 * @param {gara.widgets.TabItem} item the item to be activated
	 * @throws {TypeError} if the item is not type of gara.widgets.TabItem
	 * @returns {void}
	 */
	activateItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TabItem)) {
			throw new TypeError("item is not type of gara.widgets.TabItem");
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
				&& this.activeItem.getControl() instanceof gara.widgets.Scrollable) {
			this.activeItem.getControl().setHeight(this.clientArea.clientHeight - gara.getNumStyle(this.clientArea, "padding-top") - gara.getNumStyle(this.clientArea, "padding-bottom"));
			this.activeItem.getControl().setWidth(this.clientArea.clientWidth - gara.getNumStyle(this.clientArea, "padding-left") - gara.getNumStyle(this.clientArea, "padding-right"));
		}

		this.selection = [item];
		this.notifySelectionListener();
	},

	/**
	 * Register listeners for this widget. Implementation for gara.widgets.Widget
	 *
	 * @private
	 * @returns {void}
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	/**
	 * Creates the HTML
	 * @private
	 */
	createWidget : function () {
		var self = this;
		this.createHandle("div");

		// css
		this.addClass("garaTabFolder");

		// listener
		this.addListener("mousedown", this);
		this.addListener("contextmenu", this);

		// nodes
		this.tabbar = document.createElement("ul");
		this.tabbar.id = this.getId() + "-tablist";
		this.tabbar.widget = this;
		this.tabbar.control = this;
		this.tabbar.className = "garaTabFolderBar";
		this.tabbar.setAttribute("role", "tablist");

		this.clientArea = document.createElement("div");
		this.clientArea.className = "garaTabClientArea";

		if ((this.style & gara.TOP) === gara.TOP) {
			this.handle.appendChild(this.tabbar);
			this.handle.appendChild(this.clientArea);
			this.addClass("garaTabFolderTopbar");
		} else {
			this.handle.appendChild(this.clientArea);
			this.handle.appendChild(this.tabbar);
			this.addClass("garaTabFolderBottombar");
		}

		// drop down initializer for "more" option
		if ((this.style & gara.DROP_DOWN) === gara.DROP_DOWN) {
			this.more = document.createElement("span");
			this.moreText = document.createTextNode("");
			this.more.className = "garaTabFolderMore";
			this.more.style.display = "none";
			this.handle.appendChild(this.more);
			this.more.appendChild(this.moreText);

			gara.addEventListener(this.more, "mousedown", this);
			this.dropDownMenu = new gara.widgets.Menu(this, gara.DROP_DOWN);
			this.dropDownMenu.addMenuListener({
				menuHidden : function () {
					self.handle.style.overflow = "auto";
				}
			});
		}
	},
	
	/*
	 * jsdoc in gara.widgets.Widget
	 */
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
	 * Returns the client area off the active TabItem. Takes an TabItem as
	 * argument to retrieve the client area of that one.
	 *
	 * @returns {HTMLElement} the client area HTML element
	 */
	getClientArea : function () {
		return this.clientArea;
	},

	/**
	 * 
	 * @private
	 * @returns {gara.widgets.Menu}
	 */
	getDropDownMenu : function () {
		return this.dropDownMenu;
	},

	/**
	 * Gets a specified item with a zero-related index
	 *
	 * @param {int} index the zero-related index
	 * @throws {RangeError} when there is no item at the given index
	 * @returns {gara.widgets.TabItem} the item
	 */
	getItem : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) === "undefined") {
			throw new RangeError("There is no item for the given index");
		}

		return this.items[index];
	},

	/**
	 * Returns the receiver's number of items.
	 *
	 * @author Thomas Gossmann
	 * @returns {int} the number of items
	 */
	getItemCount : function () {
		return this.items.length;
	},

	/**
	 * Returns the receiver's items as an array.
	 *
	 * @returns {gara.widgets.TabItem[]} the array with the items
	 */
	getItems : function () {
		return this.items;
	},

	/**
	 * Returns the receiver's selected items as an array.
	 *
	 * @returns {gara.widgets.TabItem[]} the array with the selected items
	 */
	getSelection : function () {
		this.checkWidget();
		return this.selection;
	},

	/**
	 * Returns the zero-related index of the selected item or -1 if there is no item selected
	 *
	 * @returns {int} the index of the selected item
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
	 * Returns the tabbar handle
	 * @private
	 * @returns {HTMLElement}
	 */
	getTabbar : function () {
		return this.tabbar;
	},

	/**
	 * Handles events for this tabfolder
	 *
	 * @private
	 * @returns {void}
	 */
	handleEvent : function (e) {
		this.checkWidget();
		
		// special events for the list
		var widget = e.target.widget || null;
		e.item = widget && widget instanceof gara.widgets.TabItem ? widget : this.activeItem;
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
		
		if (e.target === this.tabbar && e.type === "contextmenu") {
			e.preventDefault();
		}

		e.stopPropagation();
		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},

	/**
	 *
	 * @private
	 */
	handleMouseEvents : function (e) {
		if (e.type === "mousedown") {
			if (e.target === this.more) {
				var left = 0, top = 0, obj = this.more;
				if (this.dropDownMenu.getVisible()) {
					this.dropDownMenu.setVisible(false);
					return false;
				}
				
				if (!this.dropDownMenu.offsetWidth) {
					this.dropDownMenu.setLocation(-1000, -1000);
					this.dropDownMenu.setVisible(true);
					this.dropDownMenu.offsetWidth = this.dropDownMenu.handle.offsetWidth;
				}

				// find position
				if (obj.offsetParent) {
					do {
						left += obj.offsetLeft - obj.scrollLeft;
						top += obj.offsetTop - obj.scrollTop;
					} while (obj = obj.offsetParent);
				}
				
//				this.dropDownMenu.setLocation(left - this.dropDownMenu.offsetWidth + this.more.offsetWidth, top + this.more.offsetHeight + 2);
//				this.dropDownMenu.setVisible(true);
				
//				e.stopPropagation();
						
				this.dropDownMenu.setLocation(left, top + this.more.offsetHeight + 2);
				this.dropDownMenu.setVisible(true);
			} else {
				this.activateItem(e.item);
			}

//			if (e.target.widget instanceof gara.widgets.MenuItem) {
//				this.dropDownMenu.setVisible(false);
//				this.activateItem(e.target.widget.getData("gara__tabItem"));
//			}
		}
	},

	/**
	 * 
	 * @private
	 */
	handleKeyEvents : function (e) {
		if (e.type === "keydown") {
			this.handleKeyNavigation(e);
		}
	},

	/**
	 * 
	 * @private
	 */
	handleKeyNavigation : function (e) {
		var nextIndex, prevIndex;
		switch (e.keyCode) {
		// left
		case gara.ARROW_LEFT:
			if (this.activeItem !== null) {
				prevIndex = this.indexOf(this.activeItem) - 1;
				if (prevIndex >= 0) {
					this.activateItem(this.items[prevIndex]);
				}
			}
			break;

		// right
		case gara.ARROW_RIGHT:
			if (this.activeItem !== null) {
				nextIndex = this.indexOf(this.activeItem) + 1;
				if (nextIndex < this.items.length) {
					this.activateItem(this.items[nextIndex]);
				}
			}
			break;

		// home
		case gara.HOME:
			if (this.items.length) {
				this.activateItem(this.items[0]);
			}
			break;

		// end
		case gara.END:
			if (this.items.length) {
				this.activateItem(this.items[this.items.length - 1]);
			}
			break;
		}
	},

	/**
	 * Looks for the index of a specified item
	 *
	 * @param {gara.widgets.TabItem} item the item for the index
	 * @throws {TypeError} if the item is not a <code>gara.widgets.TabItem</code>
	 * @returns {int} the index of the specified item
	 */
	indexOf : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TabItem)) {
			throw new TypeError("item not instance of gara.widgets.TabItem");
		}

		return this.items.indexOf(item);
	},

	/**
	 * Notifies selection listener about the changed selection within the List
	 *
	 * @private
	 * @returns {void}
	 */
	notifySelectionListener : function () {
		this.selectionListeners.forEach(function (listener) {
			if (listener.widgetSelected) {
				listener.widgetSelected(this.event);
			}
		}, this);
	},
	

	/**
	 * 
	 * @private
	 * @param {String} eventType
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
				if (typeof(answer) !== "undefined") {
					ret = answer;
				}
			}
		}, this);
		return ret;
	},
	
	
	/*
	 * jsdoc in gara.widgets.Widget
	 */
	releaseChildren : function () {
		this.items.forEach(function (item) {
			item.release();
		}, this);
		
		this.$super();
	},
	
	/**
	 * Releases an item from the receiver.
	 *
	 * @private
	 * @param {gara.widgets.TableItem} item the item that should removed from the receiver
	 * @returns {void}
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
	 * Removes an item from the receiver.
	 *
	 * @param {gara.widgets.TabItem} item the item to remove
	 * @returns {void}
	 */
	remove : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TabItem)) {
			throw new TypeError("item not instance of gara.widgets.TabItem");
		}

		this.items.remove(item);
		if (this.selection.contains(item)) {
			this.selection.remove(item);
		}
		item.dispose();
	},

	/**
	 * Removes an item at a given zero-related index from the receiver.
	 *
	 * @param {int} index the index of the item
	 * @throws {RangeError} when there is no item at the given index
	 * @returns {void}
	 */
	removeIndex : function (index) {
		var item;
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) === "undefined") {
			throw new RangeError("There is no item for the given index");
		}
		item = this.items.removeAt(index)[0];
		if (this.selection.contains(item)) {
			this.selection.remove(item);
		}
		item.dispose();
	},

	/**
	 * Removes items within an indices range
	 *
	 * @param {int} start start index
	 * @param {int} end end index
	 * @returns {void}
	 */
	removeRange : function (start, end) {
		for (var i = start; i <= end; ++i) {
			this.removeIndex(i);
		}
	},

	/**
	 * Removes items which indices are passed by an array
	 *
	 * @param {int[]} inidices the array with the indices
	 * @returns {void}
	 */
	removeFromArray : function (indices) {
		indices.forEach(function (index) {
			this.removeIndex(index);
		}, this);
	},

	/**
	 * Removes all items from the tree
	 *
	 * @returns {void}
	 */
	removeAll : function () {
		this.checkWidget();
		while (this.items.length) {
			this.removeIndex(0);
		}
	},

	/**
	 * Removes the listener from the collection of listeners who will no longer be notified 
	 * when the user changes the receiver's selection. 
	 *
	 * @param {gara.widgets.SelectionListener} listener the listener which should no longer be notified 
	 * @returns {gara.widgets.TabFolder} this
	 */
	removeSelectionListener : function (listener) {
		this.checkWidget();
		this.selectionListeners.remove(listener);
		return this;
	},
	
	/**
	 * Removes the listener the listener from the receiver.
	 *
	 * @param {gara.events.TabFolderListener} listener the listener which should be notified 
	 * @returns {gara.widgets.TabFolder} this
	 */
	removeTabFolderListener : function (listener) {
		this.checkWidget();
		this.tabFolderListeners.remove(listener);
		return this;
	},

	/*
	 * jsdoc in gara.widgets.Scrollable
	 */
	scrolledHandle : function () {
		return this.clientArea;
	},

	/**
	 * Selects an item in the receiver.
	 *
	 * @param {gara.widgets.TabItem} item the item to select
	 * @returns {gara.widgets.TabFolder} this
	 */
	setSelectionItem : function (item) {
		this.checkWidget();
		if (!(item instanceof gara.widgets.TabItem)) {
			throw new RangeError("item is no gara.widgets.TabItem");
		}
		this.activateItem(item);
		return this;
	},

	/**
	 * Selects the item at the given zero-related index in the TabFolder.
	 *
	 * @param {int} index the given zero-related index or the given array
	 * @throws {RangeError} when there is no item at the given index
	 * @returns {gara.widgets.TabFolder} this
	 */
	setSelectionIndex : function (index) {
		this.checkWidget();
		if (typeof(this.items.indexOf(index)) === "undefined") {
			throw new RangeError("There is no item for the given index");
		}
		this.activateItem(this.items[index]);
		return this;
	},

	/**
	 * Selects the item at the given zero-related index in the receiver.
	 * 
	 * @description
	 * Selects the item at the given zero-related index in the receiver.
	 * Takes an array as argument, though the first element within is selected (indices[0])
	 *
	 * @param {int[]} indices an array with zero-related indices
	 * @returns {gara.widgets.TabFolder} this
	 */
	setSelectionFromArray : function (indices) {
		this.checkWidget();
		if (indices.length) {
			this.activateItem(indices[0]);
		}
		return this;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	unbindListener : function (eventType, listener) {
		gara.removeEventListener(this.handle, eventType, listener);
	},

	/*
	 * jsdoc in gara.widgets.Control
	 */
	update : function () {
		this.checkWidget();
		this.updateMeasurements();
	},

	/**
	 * 
	 * @private
	 */
	updateMeasurements : function () {
		var width, height, clientWidth, clientHeight, tabsWidth, 
			itemsWidth = 0, rows = 1, more = 0, hasImages = false, itemLoop, visible;
		
		// class name and some measurement adjustments
		if (this.adjustedWidth !== null) {
			this.handle.style.width =  this.adjustedWidth + "px";
			this.tabbar.style.width = this.adjustedWidth + "px";
		}
		
		if (this.adjustedHeight !== null) {
			this.handle.style.height = this.adjustedHeight + "px";
		}
		

		// update items
		width = this.adjustedWidth !== null ? this.adjustedWidth : this.handle.clientWidth;
		height = this.adjustedHeight !== null ? this.adjustedHeight : this.handle.clientHeight;
		itemLoop = (this.style & gara.DROP_DOWN) === gara.DROP_DOWN ? this.recents : this.items;
		tabsWidth = width;

		if ((this.style & gara.DROP_DOWN) === gara.DROP_DOWN) {
			visible = this.more.style.display;
			this.more.style.display = "block";
			tabsWidth -= (this.more.offsetWidth + gara.getNumStyle(this.more, "margin-left"));
			this.more.style.display = visible;
		}

		itemLoop.forEach(function (item) {
			var self = this;
			if (item.isDisposed()) {
				this.remove(item);
			} else {
				item.handle.style.display = "block";
				item.update();
				item.width = item.handle.offsetWidth;


				if (!item.width) {
					// eeek - wooot browser sniffing? 
					if (item.getImage() !== null && navigator.userAgent.toLowerCase().indexOf("webkit") !== -1) {
						this.imageQueue.push(item);
						// kinda crappy with the .onload but listener wasn't working
						item.getImage().onload = function () {
							self.remeasureItems(item);
						};
					}
				}

				if ((this.style & gara.MULTI) === gara.MULTI) {
					if (itemsWidth + item.handle.offsetWidth > tabsWidth) {
						rows++;
						itemsWidth = item.handle.offsetWidth;
					} else {
						itemsWidth += item.handle.offsetWidth;
					}
				}

				if ((this.style & gara.DROP_DOWN) === gara.DROP_DOWN) {
					if (itemsWidth + item.width > tabsWidth) {
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

		if ((this.style & gara.MULTI) === gara.MULTI && rows > 1) {
			this.tabbar.style.height = ((this.items[0].handle.offsetHeight * rows) - 1) + "px";
		}

		if ((this.style & gara.DROP_DOWN) === gara.DROP_DOWN && more) {
			this.moreText.nodeValue = more;
			this.more.style.display = "block";
		} else if ((this.style & gara.DROP_DOWN) === gara.DROP_DOWN && !more) {
			this.more.style.display = "none";
		}

		// more measurement adjustments
		clientHeight = height
			- (this.tabbar.offsetHeight
				+ gara.getNumStyle(this.tabbar, "margin-top")
				+ gara.getNumStyle(this.tabbar, "margin-bottom"))
			- gara.getNumStyle(this.clientArea, "margin-top")
			- gara.getNumStyle(this.clientArea, "border-top-width")
			- gara.getNumStyle(this.clientArea, "border-bottom-width")
			- gara.getNumStyle(this.clientArea, "margin-bottom");
		this.clientArea.style.height = clientHeight	+ "px";
		
		if (this.activeItem !== null) {
			clientHeight -= gara.getNumStyle(this.clientArea, "padding-top") - gara.getNumStyle(this.clientArea, "padding-bottom");
			this.activeItem.getClientArea().style.height = clientHeight + "px";
			if (this.activeItem.getControl() !== null
					&& this.activeItem.getControl() instanceof gara.widgets.Scrollable) {
				this.activeItem.getControl().setHeight(clientHeight);
			}
		}

		clientWidth = width
			- gara.getNumStyle(this.clientArea, "margin-left")
			- gara.getNumStyle(this.clientArea, "border-left-width")
			- gara.getNumStyle(this.clientArea, "border-right-width")
			- gara.getNumStyle(this.clientArea, "margin-right");
		this.clientArea.style.width = clientWidth + "px";
		
		if (this.activeItem !== null) {
			clientWidth -= gara.getNumStyle(this.clientArea, "padding-left") - gara.getNumStyle(this.clientArea, "padding-right");
			this.activeItem.getClientArea(clientWidth);
			if (this.activeItem.getControl() !== null
					&& this.activeItem.getControl() instanceof gara.widgets.Scrollable) {
				this.activeItem.getControl().setWidth(clientWidth);
			}
		}
	}
};});