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

gara.provide("gara.viewers.ColumnViewer", "gara.viewers.StructuredViewer");

gara.use("gara.viewers.ViewerCell");
gara.use("gara.viewers.CellLabelProvider");
gara.use("gara.viewers.ViewerColumn");
//gara.use("gara.viewers.ILabelProvider");
//gara.use("gara.viewers.ITableLabelProvider");

/**
 * @class ColumnViewer
 * @extends gara.viewers.StructuredViewer
 * @namespace gara.viewers
 * @author Thomas Gossmann
  */
gara.Class("gara.viewers.ColumnViewer", function () { return {
	$extends : gara.viewers.StructuredViewer,

	/**
	 * @field
	 *
	 * @private
	 * @type {gara.viewers.ViewerCell}
	 */
	cell : null,

	/**
	 * @constructor
	 */
	$constructor : function () {
		this.cell = new gara.viewers.ViewerCell(null, 0, null);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	createViewerColumn : function (columnOwner, labelProvider) {
		if (!(labelProvider instanceof gara.viewers.CellLabelProvider)) {
			throw new TypeError("labelProvider not instance of gara.viewers.CellLabelProvider");
		}

		var column = new gara.viewers.ViewerColumn(this, columnOwner);
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

		var viewer = columnOwner.getData(gara.viewers.ViewerColumn.COLUMN_VIEWER_KEY);

		if (viewer === null) {
			viewer = this.createViewerColumn(columnOwner, gara.viewers.CellLabelProvider.createViewerLabelProvider(this.getLabelProvider()));
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
	 * @param {gara.viewers.ITableLabelProvider|gara.viewers.ILabelProbider|gara.viewers.CellLabelProbider} labelProvider
	 */
	setLabelProvider : function (labelProvider) {
//		if (!($class.instanceOf(labelProvider, gara.viewers.ITableLabelProvider)
//			|| $class.instanceOf(labelProvider, gara.viewers.ILabelProvider)
//			|| $class.instanceOf(labelProvider, gara.viewers.CellLabelProvider))) {
//			throw new TypeError("labelProvider is not instance of either gara.viewers.ITableLabelProvider, gara.viewers.ILabelProvider or gara.viewers.CellLabelProvider");
//		}
		this.$super(labelProvider);
		
		this.updateColumnParts(labelProvider);
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
			column.setLabelProvider(gara.viewers.CellLabelProvider.createViewerLabelProvider(labelProvider), false);
		}
	}
};});