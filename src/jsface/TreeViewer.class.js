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
 * @class TreeViewer
 * @extends gara.jsface.AbstractTreeViewer
 * @namespace gara.jsface
 * @author Thomas Gossmann
 */
$class("TreeViewer", {
	$extends : gara.jsface.AbstractTreeViewer,

	$constructor : function(parent, style) {
		this._tree = new gara.jswt.Tree(parent, style);
	},

	_createTreeItem : function(parent, el, index) {
		var item = new gara.jswt.TreeItem(parent, JSWT.DEFAULT, index);
		item.setText(this._getLabelProviderText(this.getLabelProvider(), el));
		item.setImage(this.getLabelProvider().getImage(el));
		item.setData(el);

		this._mapElement(el, item);

		if (this.getContentProvider().hasChildren(el)) {
			var children = this.getContentProvider().getChildren(el);
			for (var i = 0, len = children.length; i < len; ++i) {
				this._createTreeItem(item, children[i], i);
			}
		}

		return item;
	},

	getControl : function() {
		return this._tree;
	},

	getTree : function() {
		return this._tree;
	},

	_treeRemoveAll : function() {
		this._tree.removeAll();
	}
});