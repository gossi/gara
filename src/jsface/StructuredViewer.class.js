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
		
		this._elementMap = {};
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
	
	_getSortedChildren : function(parent) {
		return this._getRawChildren(parent);
	},

	_getRoot : function() {
		return this._input;
	},

	_internalRefresh : $abstract(function(element) {}),

	_mapElement : function(element, item) {
		if (this._elementMap.hasOwnProperty(element)) {
			this._elementMap[element] = item;
		}
	},

	refresh : function(first, second) {
		var element, updateLabels;
		if (typeof(first) == "boolean") {
			updateLabels = first;
		} else if (typeof(first) == "Object") {
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
		this._map.clear();
		this._items.clear();
	},

	_unmapElement : function(element, item) {
		if ($class.instanceOf(item, Array)) {
			this._elementMap[element] = item;
		} else {
			delete this._elementMap[element];
		}
	},

	_updateItem : function(widget, element) {
		this._doUpdateItem(widget, element);
	}, 
});