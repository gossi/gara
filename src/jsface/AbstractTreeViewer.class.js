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
 * @class AbstractTreeViewer
 * @extends gara.jsface.ColumnViewer
 * @namespace gara.jsface
 * @author Thomas Gossmann
 */
$class("AbstractTreeViewer", {
	$extends : gara.jsface.ColumnViewer,

	/**
	 * @constructor
	 * Top Constructor von die AbstractListViewer
	 */
	$constructor : function() {
	},
	
	_createTreeItem : $abstract(function(element) {}),
	
	_doUpdateItem : function(widget, element) {

	},
	
	getControl : $abstract(function() {}),

	_getLabelProviderText : function(labelProvider, element) {
		var text = labelProvider.getText(element);
		if (text == null) {
			text = "";
		}

		return text;
	},

	inputChanged : function(input, oldInput) {
		this._treeRemoveAll();

		var children = this._getRawChildren(this._getRoot());

		for (var i = 0; i < children.length; ++i) {
			var el = children[i];
			this._createTreeItem(this.getControl(), el, i);
		}

		this._internalRefresh();
	},

	_internalRefresh : function() {
		this.getControl().update();
	},

	_treeRemoveAll : $abstract(function() {}),
	
	refresh : function() {
		var children = this._getRawChildren(this._getRoot());
		var handledChildren = [];

		// adding and updating recursively
		this._refreshItems(children, handledChildren);		

		// delete loop
		var tmpMap = this._map.concat([]);
		for (var i = 0, len = tmpMap.length; i < len; ++i) {
			var el = tmpMap[i];

			// delete item in the widget
			if (!handledChildren.contains(el)) {
				var item = this._items[tmpMap.indexOf(el)];
				var parent = item.getParentItem();
				if (parent == null) {
					parent = item.getParent();
				}
				parent.remove(parent.indexOf(item));
				this._unmapElement(el);
			}
		}

		delete handledChildren;
		delete tmpMap;

		this._internalRefresh();
	},

	// @TODO: instead of refreshItems => refresh(parentNode)
	_refreshItems : function(children, handledCollector) {
		for (var i = 0, len = children.length; i < len; ++i) {
			var el = children[i];

			// add item
			if (!this._map.contains(el)) {
				var parent = this.getContentProvider().getParent(el);
				var item = this._items[this._map.indexOf(parent)];
				this._createTreeItem(item, el, i);
			}
			// update
			else {
				var item = this._items[this._map.indexOf(el)];
				item.setText(this._getLabelProviderText(this.getLabelProvider(), el));
				item.setImage(this.getLabelProvider().getImage(el));
			}
			handledCollector.push(el);

			// refresh childs
			if (this.getContentProvider().hasChildren(el)) {
				this._refreshItems(this.getContentProvider().getChildren(el), handledCollector);
			}
		}
	},

	setContentProvider : function(contentProvider) {
		if (!$class.instanceOf(contentProvider, gara.jsface.ITreeContentProvider)) {
			throw new TypeError("contentProvider is not type of gara.jsface.ITreeContentProvider");
		}
		this._contentProvider = contentProvider;
	}
});