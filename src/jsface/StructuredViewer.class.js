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
	$extends : gara.jsface.ContentViewer,

	/**
	 * @constructor
	 */
	$constructor : function() {
		this._map = [];
		this._items = [];
		
		this._elementMap = null;
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

		return (result != null) ? result : [0];
	},
	
	_getItemFromElementMap : function(element) {
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

	_getSortedChildren : function(parent) {
		return this._getRawChildren(parent);
	},

	_getRoot : function() {
		return this._input;
	},

	_internalRefresh : $abstract(function(element, updateLabels) {}),

	_mapElement : function(element, item) {
		if (this._elementMap == null) {
			this._elementMap = {};
		}
		
		// generating hash (unique-id)
		var d = new Date();
		var id = d.valueOf();

		if (typeof(element) == "object" 
				&&!element.hasOwnProperty("__garaUID")) {
			element.__garaUID = id;
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

	setInput : function(input) {
		this._unmapAllElements();
		this.$base(input);
	},

	_unmapAllElements : function() {
		this._elementMap = {};
	},

	_unmapElement : function(element, item) {
		if (this._elementMap == null 
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
	}
});