/*	$Id $

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

gara.provide("gara.viewers.StructuredViewer", "gara.viewers.ContentViewer");

gara.use("gara.viewers.ViewerFilter");
gara.use("gara.viewers.ViewerSorter");
gara.use("gara.viewers.SelectionChangedEvent");
//gara.use("gara.events.SelectionListener");
gara.use("gara.widgets.Widget");

/**
 * @class StructuredViewer
 * @extends gara.viewers.ContentViewer
 * @namespace gara.viewers
 * @author Thomas Gossmann
  */
gara.Class("gara.viewers.StructuredViewer", function () { return {
	$extends : gara.viewers.ContentViewer,

	/**
	 * @field
	 *
	 * @private
	 * @type {Object[]}
	 */
	map : [],

	/**
	 * @field
	 *
	 * @private
	 * @type {gara.widgets.Item[]}
	 */
	items : [],

	/**
	 * @field
	 *
	 * @private
	 * @type {gara.viewers.ViewerSorter}
	 */
	sorter : null,

	/**
	 * @field
	 *
	 * @private
	 * @type {gara.viewers.ViewerFilter[]}
	 */
	filters : [],

	/**
	 * @field
	 *
	 * @private
	 * @type {}
	 */
	elementMap : null,

	/**
	 * @field
	 *
	 * @private
	 * @type {gara.events.SelectionListener}
	 */
	selectionListener : null,

	/**
	 * @constructor
	 */
	$constructor : function () {
		var self = this;

		this.map = [];
		this.items = [];

		this.sorter = null;
		this.filters = [];

		this.elementMap = null;

		this.selectionListener = {
			widgetSelected : function (e) {
				self.handleSelect(e);
			}
		};
	},

	addFilter : function (filter) {
		if (!(filter instanceof gara.viewers.ViewerFilter)) {
			throw new TypeError("filter not instance of gara.viewers.ViewerFilter");
		}

		if (!this.filters.contains(filter)) {
			this.filters.push(filter);
		}
		this.refresh();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	associate : function (element, item) {
		var data = item.getData();
		if (data !== element) {
			if (data !== null) {
				this.disassociate(item);
			}
			item.setData(element);
		}

		this.mapElement(element, item);
	},

	/**
	 * Disassociates the given item from its corresponding element. Sets the
	 * item's data to <code>null</code> and removes the element from the
	 * element map (if enabled).
	 *
	 * @param item
	 *            the widget
	 */
	disassociate : function (item) {
		var element = item.getData();

		this.unmapElement(element, item);
		item.setData(null);
	},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	doUpdateItem : function (widget, element){},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	doFindInputItem : function (element){},

	/**
	 * @method
	 *
	 * @private
	 * @final
	 */
	findItem : function (element) {
		var results = this.findItems(element);
		return results.length === 0 ? null : results[0];
	},

	/**
	 * @method
	 *
	 * @private
	 * @final
	 */
	findItems : function (element) {
		if (!Object.prototype.hasOwnProperty(element, "__garaUID")) {
			return [];
		}
		var result = this.doFindInputItem(element);
		if (result !== null) {
			return [result];
		}

		if (this.usingElementMap()) {
			var widgetOrWidgets = null;
			if (Object.prototype.hasOwnProperty(element, "__garaUID")
					&& Object.prototype.hasOwnProperty(this.elementMap, element.__garaUID)) {
				widgetOrWidgets = this.elementMap[element.__garaUID];
			}

			if (widgetOrWidgets === null) {
				return [];
			} else if (widgetOrWidgets instanceof gara.widgets.Widget) {
				return [widgetOrWidgets];
			} else {
				return widgetOrWidgets;
			}
		}

		return [];
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getRawChildren : function (parent) {
		var result = null, cp;
		if (parent !== null) {
			cp = this.getContentProvider();
			if (cp !== null && cp.getElements) {
				result = cp.getElements(parent);
			}
		}

		return (result !== null && Array.isArray(result)) ? result : [];
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getItemFromElementMap : function (element) {
		var id;
		if (element === null) {
			return null;
		}

		if (typeof(element) === "object" && Object.prototype.hasOwnProperty(element, "__garaUID")) {
			id = element.__garaUID;
		} else {
			id = element;
		}

		if (this.elementMap.hasOwnProperty(id)) {
			return this.elementMap[id];
		}

		return null;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getFilteredChildren : function (parent) {
		var children = this.getRawChildren(parent);
		this.filters.forEach(function (f) {
			children = f.filter(this, parent, children);
		}, this);
		return children;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getSelection : function () {
		var control = this.getControl();
		if (control === null || control.isDisposed()) {
			return [];
		}
		return this.getSelectionFromWidget();
	},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	getSelectionFromWidget : function () {},

	/**
	 * @method
	 *
	 * @private
	 */
	getSortedChildren : function (parent) {
		var children = this.getFilteredChildren(parent);
		if (this.sorter !== null) {
			children = this.sorter.sort(this, children);
		}
		return children;
	},

	getSorter : function () {
		return this.sorter;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getRoot : function () {
		return this.input;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	hookControl : function (control) {
		var self = this;
		control.addSelectionListener({
			widgetSelected : function (e) {
				self.handleSelect(e);
			}
		});
	},

	/**
	 * @method
	 *
	 * @private
	 */
	handleSelect : function (event) {
		control = this.getControl();
		if (control !== null && !control.isDisposed()) {
			this.updateSelection(this.getSelection());
		}
	},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	internalRefresh : function (element, updateLabels) {},

	/**
	 * @method
	 *
	 * @private
	 */
	mapElement : function (element, item) {
		var id = gara.generateUID();
		if (this.elementMap === null) {
			this.elementMap = {};
		}

		if (typeof(element) === "object") {
			if (!element.hasOwnProperty("__garaUID")) {
				element._garaUID = id;
			} else {
				id = element._garaUID;
			}
		} else {
			id = element;
		}

		this.elementMap[id] = item;
	},

	refresh : function (first, second) {
		var element, updateLabels;
		if (typeof(first) === "boolean") {
			updateLabels = first;
		} else if (typeof(first) === "object") {
			element = first;
		}

		if (typeof(second) === "boolean") {
			updateLabels = second;
		}

		this.internalRefresh(element, updateLabels);
	},

	/**
	 * @method
	 *
	 * @param {gara.viewers.ViewerFilter[]} filters
	 */
	setFilters : function (filters) {
		if (filters.length === 0) {
			this.filters = [];
		} else {
			filters.forEach(function (filter){
				this.addFilter(filter);
			}, this);
		}
	},

	setInput : function (input) {
		this.unmapAllElements();
		this.$super(input);
	},

	setSorter : function (sorter) {
		if (sorter !== null && !(sorter instanceof gara.viewers.ViewerSorter)) {
			throw new TypeError("sorter not instance of gara.viewers.ViewerSorter");
		}

		this.sorter = sorter;
		this.refresh();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	unmapAllElements : function () {
		this.elementMap = {};
	},

	/**
	 * @method
	 *
	 * @private
	 */
	unmapElement : function (element, item) {
		var id;
		if (this.elementMap === null || element === null
				|| !(typeof(element) === "object" && element.hasOwnProperty("__garaUID"))) {
			return;
		}

		if (typeof(element) === "object" && element.hasOwnProperty("__garaUID")) {
			id = element._garaUID;
		} else {
			id = element;
		}

		if ($class.instanceOf(item, Array)) {
			this.elementMap[id] = item;
		} else {
			delete this.elementMap[id];
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	updateItem : function (widget, element) {
		this.doUpdateItem(widget, element);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	usingElementMap : function () {
		return this.elementMap !== null;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	updateSelection : function (selection) {
		var event = new gara.viewers.SelectionChangedEvent(this, selection);
		this.fireSelectionChanged(event);
	}
};});