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
 * @class AbstractTableViewer
 * @extends gara.jsface.ColumnViewer
 * @namespace gara.jsface
 * @author Thomas Gossmann
 */
$class("AbstractTableViewer", {
	$extends : gara.jsface.ColumnViewer,

	$constructor : function() {
		this.$base();
	},

	_createItem : function(element, index) {
		this._updateItem(this._internalCreateNewRowPart(gara.jswt.JSWT.NONE, index).getItem(), element);
	},

	/* Method declared on StructuredViewer. */
	_doFindInputItem : function(element) {
		// compare with root
		var root = this._getRoot();
		if (root == null) {
			return null;
		}

		if (root == element) {
			return this.getControl();
		}
		return null;
	},

	_doClear : $abstract(function(index) {}),

	_doGetColumn : $abstract(function() {}),

	_doGetColumnCount : $abstract(function() {}),

	_doGetItems : $abstract(function() {}),

	_doGetSelection : $abstract(function() {}),

	_doRemoveRange : $abstract(function(from, to) {}),

	_doUpdateItem : function(widget, element) {
		if ($class.instanceOf(widget, gara.jswt.Item)) {
			var item = widget;

			if (item.isDisposed()) {
				this._unmapElement(element, item);
				return;
			}

			var data = item.getData();
			if (data != null) {
				this._unmapElement(data, item);
			}
			item.setData(element);
			this._mapElement(element, item);

			var columnCount = this._doGetColumnCount();
			if (columnCount == 0) {
				columnCount = 1;// If there are no columns do the first one
			}

			var viewerRowFromItem = this._getViewerRowFromItem(item);

			for (var column = 0; column < columnCount || column == 0; column++) {
				var columnViewer = this._getViewerColumn(column);
				var cellToUpdate = this._updateCell(viewerRowFromItem, column, element);

				columnViewer.refresh(cellToUpdate);
			}
		}
	},

	_getColumnViewerOwner : function(columnIndex) {
		var columnCount = this._doGetColumnCount();

		if (columnIndex < 0
				|| (columnIndex > 0 && columnIndex >= columnCount)) {
			return null;
		}

		if (columnCount == 0) {
			return this.getControl();
		}

		return this._doGetColumn(columnIndex);
	},

	_getSelectionFromWidget : function() {
		var items = this._doGetSelection();
		var list = [];
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var e = item.getData();
			if (e != null) {
				list.push(e);
			}
		}
		return list;
	},

	inputChanged : function(input, oldInput) {
		this._internalRefresh();
	},

	_internalCreateNewRowPart : $abstract(function(style, index){}),

	_internalRefresh : function(element, updateLabels) {
		if (element == null || element == this._getRoot()) {
			this._internalRefreshAll(updateLabels);
		} else {
			var w = this._findItem(element);
			if (w != null) {
				this._updateItem(w, element);
			}
			this.getControl().update();
		}
	},

	_internalRefreshAll : function(updateLabels) {
		// save selected elements
		var selected = [];
		var selection = this.getControl().getSelection();
		for (var i = 0; i < selection.length; ++i) {
			selected.push(selection[i].getData());
		}

		var children = this._getSortedChildren(this._getRoot());
		var items = this._doGetItems();
		var min = Math.min(children.length, items.length);

		for (var i = 0; i < min; ++i) {
			var item = items[i];

			if (children[i] == item.getData()) {
				if (updateLabels) {
					this._updateItem(item, children[i]);
				} else {
					this._associate(children[i], item);
				}
			} else {
				this._disassociate(item);
				this._doClear(i);
			}
		}

		// dispose all items beyond the end of the current elements
		if (min < items.length) {
			for (var i = min; i < items.length; ++i) {
				this._disassociate(items[i]);
			}

			this._doRemoveRange(min, items.length - 1);
		}

		// update disassociated items
		for (var i = 0; i < min; ++i) {

//			if (item.isDisposed()) {
//				console.log("AbstractTableViewer.internalRefreshAll 2. run: disposed item: " + item.getText(0));
//			}

			var item = items[i];
			if (item.getData() == null) {
				this._updateItem(item, children[i]);
			}
		}

		// add any remaining elements
		for (var i = min; i < children.length; ++i) {
			this._createItem(children[i], i);
		}

		// restore selection
		selection = [];
		selected.forEach(function(elem, i, arr) {
			var item = this._getItemFromElementMap(elem);
			if (item != null) {
				selection.push(item);
			}
		}, this);
		this.getControl().update();
		this.getControl().setSelection(selection);
		this.getControl().update();
		// TODO: any better solution for this instead of firing update 2 times?
	}

});