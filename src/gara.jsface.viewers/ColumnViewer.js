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

gara.provide("gara.jsface.viewers.ColumnViewer", "gara.jsface.viewers.StructuredViewer");

gara.use("gara.jsface.viewers.ViewerCell");
gara.use("gara.jsface.viewers.CellLabelProvider");
gara.use("gara.jsface.viewers.ViewerColumn");
//gara.use("gara.jsface.viewers.ILabelProvider");
//gara.use("gara.jsface.viewers.ITableLabelProvider");

/**
 * @class ColumnViewer
 * @extends gara.jsface.viewers.StructuredViewer
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
  */
gara.Class("gara.jsface.viewers.ColumnViewer", function () { return {
	$extends : gara.jsface.viewers.StructuredViewer,

	/**
	 * @field
	 *
	 * @private
	 * @type {gara.jsface.viewers.ViewerCell}
	 */
	cell : null,

	/**
	 * @constructor
	 */
	$constructor : function () {
		this.cell = new gara.jsface.viewers.ViewerCell(null, 0, null);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	createViewerColumn : function (columnOwner, labelProvider) {
		if (!(labelProvider instanceof gara.jsface.viewers.CellLabelProvider)) {
			throw new TypeError("labelProvider not instance of gara.jsface.viewers.CellLabelProvider");
		}

		var column = new gara.jsface.viewers.ViewerColumn(this, columnOwner);
		column.setLabelProvider(labelProvider, false);
		return column;
	},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	getColumnViewerOwner : function (columnIndex) {},

	/**
	 * @method
	 *
	 * @private
	 */
	getViewerColumn : function (columnIndex) {
		var columnOwner = this.getColumnViewerOwner(columnIndex);

		if (columnOwner === null) {
			return null;
		}

		var viewer = columnOwner.getData(gara.jsface.viewers.ViewerColumn.COLUMN_VIEWER_KEY);

		if (viewer === null) {
			viewer = this.createViewerColumn(columnOwner, gara.jsface.viewers.CellLabelProvider.createViewerLabelProvider(this.getLabelProvider()));
		}

		return viewer;
	},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	getViewerRowFromItem : function (item) {},

	/**
	 * @method
	 *
	 * @param {gara.jsface.viewers.ITableLabelProvider|gara.jsface.viewers.ILabelProbider|gara.jsface.viewers.CellLabelProbider} labelProvider
	 */
	setLabelProvider : function (labelProvider) {
//		if (!($class.instanceOf(labelProvider, gara.jsface.viewers.ITableLabelProvider)
//			|| $class.instanceOf(labelProvider, gara.jsface.viewers.ILabelProvider)
//			|| $class.instanceOf(labelProvider, gara.jsface.viewers.CellLabelProvider))) {
//			throw new TypeError("labelProvider is not instance of either gara.jsface.viewers.ITableLabelProvider, gara.jsface.viewers.ILabelProvider or gara.jsface.viewers.CellLabelProvider");
//		}

		this.updateColumnParts(labelProvider);

		this.$super(labelProvider);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	updateCell : function (rowItem, column, element) {
		this.cell.update(rowItem, column, element);
		return this.cell;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	updateColumnParts : function (labelProvider) {
		var column, i = 0;

		while ((column = this.getViewerColumn(i++)) !== null) {
			column.setLabelProvider(gara.jsface.viewers.CellLabelProvider
					.createViewerLabelProvider(labelProvider), false);
		}
	}
};});