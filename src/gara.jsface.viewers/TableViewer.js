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

gara.provide("gara.jsface.viewers.TableViewer", "gara.jsface.viewers.AbstractTableViewer");

gara.use("gara.jsface.viewers.TableViewerRow");
gara.use("gara.jswt.widgets.Table");
gara.use("gara.jswt.widgets.TableItem");

/**
 * @class TableViewer
 * @extends gara.jsface.viewers.AbstractTableViewer
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.jsface.viewers.TableViewer", function () { return {
	$extends : gara.jsface.viewers.AbstractTableViewer,

	/**
	 * @field
	 *
	 * @private
	 * @type {gara.jsface.viewers.TableViewerRow}
	 */
	cachedRow : null,

	$constructor : function (parent, style) {
		if (parent instanceof gara.jswt.widgets.Table) {
			this.table = parent;
		} else {
			this.table = new gara.jswt.widgets.Table(parent, style);
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
			this.cachedRow = new gara.jsface.viewers.TableViewerRow(item);
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
			item = new gara.jswt.widgets.TableItem(this.table, style, rowIndex);
		} else {
			item = new gara.jswt.widgets.TableItem(this.table, style);
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