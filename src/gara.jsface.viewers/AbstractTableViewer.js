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

gara.provide("gara.jsface.viewers.AbstractTableViewer", "gara.jsface.viewers.ColumnViewer");

gara.use("gara.jswt.widgets.Item");


/**
 * @class AbstractTableViewer
 * @extends gara.jsface.viewers.ColumnViewer
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.jsface.viewers.AbstractTableViewer", function () { return {
	$extends : gara.jsface.viewers.ColumnViewer,

	$constructor : function () {
		this.$super();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	createItem : function (element, index) {
		this.updateItem(this.internalCreateNewRowPart(gara.jswt.JSWT.NONE, index).getItem(), element);
	},

	/* Method declared on StructuredViewer. */
	/**
	 * @method
	 *
	 * @private
	 */
	doFindInputItem : function (element) {
		var root = this.getRoot();
		if (root === null) {
			return null;
		}

		if (root === element) {
			return this.getControl();
		}
		return null;
	},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	doClear : function (index) {},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	doGetColumn : function () {},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	doGetColumnCount : function () {},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	doGetItems : function () {},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	doGetSelection : function () {},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	doRemoveRange : function (from, to) {},

	/**
	 * @method
	 *
	 * @private
	 */
	doUpdateItem : function (widget, element) {
		var item, data, columnCountm, viewerRowFromItem, column, columnViewer, cellToUpdate;
		if (widget instanceof gara.jswt.widgets.Item) {
			item = widget;

			if (item.isDisposed()) {
				this.unmapElement(element, item);
				return;
			}

			data = item.getData();
			if (data !== null) {
				this.unmapElement(data, item);
			}
			item.setData(element);
			this.mapElement(element, item);

			columnCount = this.doGetColumnCount();
			if (columnCount === 0) {
				columnCount = 1;// If there are no columns do the first one
			}

			viewerRowFromItem = this.getViewerRowFromItem(item);

			for (column = 0; column < columnCount || column === 0; column++) {
				columnViewer = this.getViewerColumn(column);
				cellToUpdate = this.updateCell(viewerRowFromItem, column, element);

				columnViewer.refresh(cellToUpdate);
			}
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getColumnViewerOwner : function (columnIndex) {
		var columnCount = this.doGetColumnCount();

		if (columnIndex < 0
				|| (columnIndex > 0 && columnIndex >= columnCount)) {
			return null;
		}

		if (columnCount === 0) {
			return this.getControl();
		}

		return this.doGetColumn(columnIndex);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getSelectionFromWidget : function () {
		var items = this.doGetSelection(),
			list = [], item, i, e;
		for (i = 0; i < items.length; i++) {
			item = items[i];
			e = item.getData();
			if (e !== null) {
				list.push(e);
			}
		}
		return list;
	},

	inputChanged : function (input, oldInput) {
		console.log("AbstractTableViewer.inputChanged");
		this.internalRefresh();
	},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	internalCreateNewRowPart : function (style, index){},

	/**
	 * @method
	 *
	 * @private
	 */
	internalRefresh : function (element, updateLabels) {
		console.log("AbstractTableViewer.internalRefresh");
		var w;
		if (typeof(element) === "undefined" || element === null || element === this.getRoot()) {
			this.internalRefreshAll(updateLabels);
		} else {
			w = this.findItem(element);
			if (w !== null) {
				this.updateItem(w, element);
			}
			this.getControl().update();
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	internalRefreshAll : function (updateLabels) {
		var selected = [], selection = this.getControl().getSelection(), i, items,
			children, min, item;

		// save selected elements
		for (var i = 0; i < selection.length; ++i) {
			selected.push(selection[i].getData());
		}

		children = this.getSortedChildren(this.getRoot());
		items = this.doGetItems();
		min = Math.min(children.length, items.length);

		console.log("AbstractTableViewer.internalRefreshAll children: " + children.length);

		for (i = 0; i < min; ++i) {
			item = items[i];

			if (children[i] === item.getData()) {
				if (updateLabels) {
					this.updateItem(item, children[i]);
				} else {
					this.associate(children[i], item);
				}
			} else {
				this.disassociate(item);
				this.doClear(i);
			}
		}

		// dispose all items beyond the end of the current elements
		if (min < items.length) {
			for (i = min; i < items.length; ++i) {
				this.disassociate(items[i]);
			}

			this.doRemoveRange(min, items.length - 1);
		}

		// update disassociated items
		for (i = 0; i < min; ++i) {
			item = items[i];
			if (item.getData() === null) {
				this.updateItem(item, children[i]);
			}
		}

		// add any remaining elements
		for (i = min; i < children.length; ++i) {
			this.createItem(children[i], i);
		}

		this.getControl().update();

		// restore selection
		selection = [];
		selected.forEach(function (elem) {
			var item = this.getItemFromElementMap(elem);
			if (item !== null) {
				selection.push(item);
			}
		}, this);
		this.getControl().setSelection(selection);
	}
};});