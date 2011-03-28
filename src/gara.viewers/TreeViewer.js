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

gara.provide("gara.viewers.TreeViewer","gara.viewers.AbstractTreeViewer");

gara.use("gara.viewers.TreeViewerRow");
gara.use("gara.widgets.Tree");
gara.use("gara.widgets.TreeItem");

/**
 * @class TreeViewer
 * @extends gara.viewers.AbstractTreeViewer
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.TreeViewer", function () { return {
	$extends : gara.viewers.AbstractTreeViewer,

	$constructor : function (parent, style) {
		this.$super();
		if (parent instanceof gara.widgets.Tree) {
			this.tree = parent;
		} else {
			this.tree = new gara.widgets.Tree(parent, style);
		}
		this.hookControl(this.tree);
		this.cachedRow = null;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	createNewRowPart : function (parent, style, rowIndex) {
		if (parent === null) {
			if (rowIndex >= 0) {
				return this.getViewerRowFromItem(new gara.widgets.TreeItem(this.tree, style, rowIndex));
			}
			return this.getViewerRowFromItem(new gara.widgets.TreeItem(this.tree, style));
		}

		if (rowIndex >= 0) {
			return this.getViewerRowFromItem(new gara.widgets.TreeItem(parent.getItem(), gara.NONE, rowIndex));
		}

		return this.getViewerRowFromItem(new gara.widgets.TreeItem(parent.getItem(), gara.NONE));
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getColumnViewerOwner : function (columnIndex) {
		if (columnIndex < 0 || (columnIndex > 0 && columnIndex >= this.tree.getColumnCount())) {
			return null;
		}

		if (this.tree.getColumnCount() === 0) {
			return this.tree;
		}

		return this.tree.getColumn(columnIndex);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	doGetColumnCount : function () {
		return this.tree.getColumnCount();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	doGetSelection : function () {
		return this.tree.getSelection();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getChildren : function (widget) {
		if (widget instanceof gara.widgets.TreeItem
				|| widget instanceof gara.widgets.Tree) {
			return widget.getItems().concat([]);
		}
		return null;
	},

	getControl : function () {
		return this.tree;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getExpanded : function (item) {
		return item.getExpanded();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getViewerRowFromItem : function (item) {
		if( this.cachedRow === null ) {
			this.cachedRow = new gara.viewers.TreeViewerRow(item);
		} else {
			this.cachedRow.setItem(item);
		}

		return this.cachedRow;
	},

	getTree : function () {
		return this.tree;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	newItem : function (parent, style, index) {
		var item;

		if (parent instanceof gara.widgets.TreeItem) {
			item = this.createNewRowPart(this.getViewerRowFromItem(parent),
					style, index).getItem();
		} else {
			item = this.createNewRowPart(null, style, index).getItem();
		}

		return item;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	setExpanded : function (item, expanded) {
		item.setExpanded(expanded);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	treeRemoveAll : function () {
		this.tree.removeAll();
	}
};});