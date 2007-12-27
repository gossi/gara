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
 * @class AbstractListViewer
 * @extends gara.jsface.StructuredViewer
 * @namespace gara.jsface
 * @author Thomas Gossmann
 */
$class("AbstractListViewer", {
	$extends : gara.jsface.StructuredViewer,

	/**
	 * @constructor
	 * 
	 */
	$constructor : function() {
	},

	_createListItem : $abstract(function(element, index) {}),

	getControl : $abstract(function() {}),

	_getLabelProviderText : function(labelProvider, element) {
		var text = labelProvider.getText(element);
		if (text == null) {
			text = "";
		}

		return text;
	},

	inputChanged : function(input, oldInput) {
		this._listRemoveAll();

		var children = this._getRawChildren(this._getRoot());
		
		for (var i = 0, len = children.length; i < len; ++i) {
			var el = children[i];
			this._mapElement(el, this._createListItem(el));
		}
		
		this._internalRefresh();
	},

	_internalRefresh : function() {
		this.getControl().update();
	},

	_listRemoveAll : $abstract(function() {}),

	_listSetItems : $abstract(function() {}),

	refresh : function() {
		var children = this._getRawChildren(this._getRoot());
		var handledChildren = [];

		for (var i = 0, len = children.length; i < len; ++i) {
			var el = children[i];

			// add item
			if (!this._map.contains(el)) {
				this._mapElement(el, this._createListItem(el, i));
			}
			// update
			else {
				var item = this._items[this._map.indexOf(el)];
				item.setText(this._getLabelProviderText(this.getLabelProvider(), el));
				item.setImage(this.getLabelProvider().getImage(el));
			}
			handledChildren.push(el);
		}

		// delete loop
		for (var i = 0, len = this._map.length; i < len; ++i) {
			var el = this._map[i];

			// delete item in the widget
			if (!handledChildren.contains(el)) {
				this.getControl().remove(i);
				this._unmapElement(el);
			}
		}

		delete handledChildren;

		this._internalRefresh();
	}
});