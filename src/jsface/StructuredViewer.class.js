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
	},

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

	_getRoot : function() {
		return this._input;
	},

	_internalRefresh : function() {},

	_mapElement : function(el, item) {
		this._map.push(el);
		this._items.push(item);
	},

	refresh : function(updateLabels) {
		this._internalRefresh();
	},

	setInput : function(input) {
		this._unmapAllElements();
		this.$base(input);
	},

	_unmapAllElements : function() {
		this._map.clear();
		this._items.clear();
	},

	_unmapElement : function(el) {
		var index = this._map.indexOf(el);
		this._items.removeAt(index);
		this._map.removeAt(index);
	}
});