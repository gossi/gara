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
		if ($class.instanceOf(parent, gara.jswt.Tree)) {
			this._tree = parent;
		} else {
			this._tree = new gara.jswt.Tree(parent, style);
		}
		this._hookControl(this._tree);
		this._cachedRow = null;
	},
	
	_createNewRowPart : function(parent, style, rowIndex) {
		if (parent == null) {
			if (rowIndex >= 0) {
				return this._getViewerRowFromItem(new gara.jswt.TreeItem(this._tree, style, rowIndex));
			}
			return this._getViewerRowFromItem(new gara.jswt.TreeItem(this._tree, style));
		}

		if (rowIndex >= 0) {
			return this._getViewerRowFromItem(new gara.jswt.TreeItem(parent.getItem(), gara.jswt.JSWT.NONE, rowIndex));
		}

		return this._getViewerRowFromItem(new gara.jswt.TreeItem(parent.getItem(), gara.jswt.JSWT.NONE));
	},

	_getColumnViewerOwner : function(columnIndex) {
		if (columnIndex < 0 || (columnIndex > 0 && columnIndex >= this._tree.getColumnCount())) {
			return null;
		}

		if (this._tree.getColumnCount() == 0)// Hang it off the table if it
			return this._tree;

		return this._tree.getColumn(columnIndex);
	},
	
	doGetColumnCount : function() {
		return this._tree.getColumnCount();
	},
	
	_doGetSelection : function() {
		return this._tree.getSelection();
	},
	
	_getChildren : function(widget) {
		if ($class.instanceOf(widget, gara.jswt.TreeItem)
				|| $class.instanceOf(widget, gara.jswt.Tree)) {
			return widget.getItems().concat([]);
		}
		return null;
	},

	getControl : function() {
		return this._tree;
	},
	
	_getExpanded : function(item) {
		return item.getExpanded();
	},
	
	_getViewerRowFromItem : function(item) {
		if( this._cachedRow == null ) {
			this._cachedRow = new gara.jsface.TreeViewerRow(item);
		} else {
			this._cachedRow.setItem(item);
		}
		
		return this._cachedRow;
	},

	getTree : function() {
		return this._tree;
	},
	
	_newItem : function(parent, style, index) {
		var item;

		if ($class.instanceOf(parent, gara.jswt.TreeItem)) {
			item = this._createNewRowPart(this._getViewerRowFromItem(parent),
					style, index).getItem();
		} else {
			item = this._createNewRowPart(null, style, index).getItem();
		}

		return item;
	},
	
	_setExpanded : function(item, expanded) {
		item.setExpanded(expanded);
	},

	_treeRemoveAll : function() {
		this._tree.removeAll();
	}
});