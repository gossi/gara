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

gara.provide("gara.viewers.TableViewer", "gara.viewers.AbstractTableViewer");

gara.use("gara.viewers.TableViewerRow");
gara.use("gara.widgets.Table");
gara.use("gara.widgets.TableItem");

/**
 * @class TableViewer
 * @extends gara.viewers.AbstractTableViewer
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.TableViewer", function () { return {
	$extends : gara.viewers.AbstractTableViewer,

	/**
	 * @field
	 *
	 * @private
	 * @type {gara.viewers.TableViewerRow}
	 */
	cachedRow : null,

	$constructor : function (parent, style) {
		this.$super();
		if (parent instanceof gara.widgets.Table) {
			this.table = parent;
		} else {
			this.table = new gara.widgets.Table(parent, style);
		}
		this.cachedRow = null;
		this.hookControl(this.table);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	doClear : function (index) {
		this.table.clear(index);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	doGetColumn : function (index) {
		return this.table.getColumn(index);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	doGetColumnCount : function () {
		return this.table.getColumnCount();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	doGetItems : function () {
		return this.table.getItems();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	doGetSelection : function () {
		return this.table.getSelection();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	doRemoveRange : function (from, to) {
		this.table.removeRange(from, to);
	},

	getControl : function () {
		return this.table;
	},

	getTable : function () {
		return this.table;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getViewerRowFromItem : function (item) {
		if (this.cachedRow === null) {
			this.cachedRow = new gara.viewers.TableViewerRow(item);
		} else {
			this.cachedRow.setItem(item);
		}

		return this.cachedRow;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	internalCreateNewRowPart : function (style, rowIndex) {
		var item;

		if (rowIndex >= 0) {
			item = new gara.widgets.TableItem(this.table, style, rowIndex);
		} else {
			item = new gara.widgets.TableItem(this.table, style);
		}

		return this.getViewerRowFromItem(item);
	},

	refresh : function (element, updateLabels) {
		this.internalRefresh(element || null, updateLabels || true);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	tableRemoveAll : function () {
		this.table.removeAll();
	}

};});