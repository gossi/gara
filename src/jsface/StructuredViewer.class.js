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

/**
 * @class StructuredViewer
 * @extends gara.jsface.ContentViewer 
 * @namespace gara.jsface
 * @author Thomas Gossmann
  */
$class("StructuredViewer", {
	$implements : [gara.jswt.SelectionListener],
	$extends : gara.jsface.ContentViewer,

	/**
	 * @constructor
	 */
	$constructor : function() {
		this._map = [];
		this._items = [];
		
		this._sorter = null;
		this._filters = [];
		
		this._elementMap = null;
	},
	
	addFilter : function(filter) {
		if (!$class.instanceOf(filter, gara.jsface.ViewerFilter)) {
			throw new TypeError("filter not instance of gara.jsface.ViewerFilter");
		}

		if (!this._filters.contains(filter)) {
			this._filters.push(filter);
		}
		this.refresh();
	},

	_associate : function(element, item) {
		var data = item.getData();
		if (data != element) {
			if (data != null) {
				this._disassociate(item);
			}
			item.setData(element);
		}

		this._mapElement(element, item);
	},

	/**
	 * Disassociates the given item from its corresponding element. Sets the
	 * item's data to <code>null</code> and removes the element from the
	 * element map (if enabled).
	 * 
	 * @param item
	 *            the widget
	 */
	_disassociate : function(item) {
		var element = item.getData();

		this._unmapElement(element, item);
		item.setData(null);
	},

	_doUpdateItem : $abstract(function(widget, element){}),

	_doFindInputItem : $abstract(function(element){}),

	_findItem : $final(function(element) {
		var results = this._findItems(element);
		return results.length == 0 ? null : results[0];
	}),

	_findItems : $final(function(element) {
		if (!element.hasOwnProperty("__garaUID")) {
			return [];
		}
		var result = this._doFindInputItem(element);
		if (result != null) {
			return [result];
		}
		
		if (this._usingElementMap()) {
			var widgetOrWidgets = null;
			if (element.hasOwnProperty("__garaUID")
					&& this._elementMap.hasOwnProperty(element.__garaUID)) {
				widgetOrWidgets = this._elementMap[element.__garaUID];
			}

			if (widgetOrWidgets == null) {
				return [];
			} else if ($class.instanceOf(widgetOrWidgets, gara.jswt.Widget)) {
				return [widgetOrWidgets];
			} else {
				return widgetOrWidgets;
			}
		}

		return [];
	}),

	_getRawChildren : function(parent) {
		var result = null;
		if (parent != null) {
			var cp = this.getContentProvider();
			if (cp != null) {
				result = cp.getElements(parent);
			}
		}

		return (result != null && $class.instanceOf(result, Array)) ? result : [];
	},

	_getItemFromElementMap : function(element) {
		if (element == null) {
			return null;
		}
		
		var id;
		if (typeof(element) == "object" && element.hasOwnProperty("__garaUID")) {
			id = element.__garaUID;
		} else {
			id = element;
		}

		if (this._elementMap.hasOwnProperty(id)) {
			return this._elementMap[id];
		}
		
		return null;
	},
	
	_getFilteredChildren : function(parent) {
		var children = this._getRawChildren(parent);
		this._filters.forEach(function(f, i, a) {
			children = f.filter(this, parent, children);
		}, this);
		return children;
	},
	
	_getSelection : function() {
		var control = this.getControl();
		if (control == null || control.isDisposed()) {
			return [];
		}
		return this._getSelectionFromWidget();
	},
	
	_getSelectionFromWidget : $abstract(function() {}),

	_getSortedChildren : function(parent) {
		var children = this._getFilteredChildren(parent);
		if (this._sorter != null) {
			children = this._sorter.sort(this, children);
		}
		return children;
	},
	
	getSorter : function() {
		if ($class.instanceOf(this._sorter, gara.jsface.ViewerSorter)) 
			return this._sorter;
		return null;
	},

	_getRoot : function() {
		return this._input;
	},
	
	_hookControl : function(control) {
		control.addSelectionListener(this);
	},
	
	_handleSelect : function(event) {
		control = this.getControl();
		if (control != null && !control.isDisposed()) {
			this._updateSelection(this._getSelection());
		}
	},

	_internalRefresh : $abstract(function(element, updateLabels) {}),

	_mapElement : function(element, item) {
		if (this._elementMap == null) {
			this._elementMap = {};
		}
		
		// generating hash (unique-id)
		var d = new Date();
		var id = d.valueOf();

		if (typeof(element) == "object") {
			if (!element.hasOwnProperty("__garaUID")) {
				element.__garaUID = id;
			} else {
				id = element.__garaUID;
			}
		} else {
			id = element;
		}

		this._elementMap[id] = item;
	},

	refresh : function(first, second) {
		var element, updateLabels;
		if (typeof(first) == "boolean") {
			updateLabels = first;
		} else if (typeof(first) == "object") {
			element = first;
		}

		if (typeof(second) == "boolean") {
			updateLabels = second;
		}

		this._internalRefresh(element, updateLabels);
	},
	
	setFilters : function(filters) {
		if (filters.length == 0) {
			this._filters = [];
		} else {
			filters.forEach(function(filter, i, a){
				this.addFilter(filter);
			}, this);
		}
	},

	setInput : function(input) {
		this._unmapAllElements();
		this.$base(input);
	},

	setSorter : function(sorter) {
		if (!$class.instanceOf(sorter, gara.jsface.ViewerSorter)) {
			throw new TypeError("sorter not instance of gara.jsface.ViewerSorter");
		}

		this._sorter = sorter;
		this.refresh();
	},

	_unmapAllElements : function() {
		this._elementMap = {};
	},

	_unmapElement : function(element, item) {
		if (this._elementMap == null || element == null
				|| !(typeof(element) == "object" && element.hasOwnProperty("__garaUID"))) {
			return;
		}
		
		var id;
		if (typeof(element) == "object" && element.hasOwnProperty("__garaUID")) {
			id = element.__garaUID;
		} else {
			id = element;
		}
		
		if ($class.instanceOf(item, Array)) {
			this._elementMap[id] = item;
		} else {
			delete this._elementMap[id];
		}
	},

	_updateItem : function(widget, element) {
		this._doUpdateItem(widget, element);
	},
	
	_usingElementMap : function() {
		return this._elementMap != null;
	},
	
	_updateSelection : function(selection) {
		var event = new gara.jsface.SelectionChangedEvent(this, selection);
		this._fireSelectionChanged(event);
	},
	
	widgetSelected : function(e) {
		this._handleSelect(e);
	}
});