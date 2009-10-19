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
 * @class ColumnViewer
 * @extends gara.jsface.viewers.StructuredViewer
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
  */
$class("ColumnViewer", {
	$extends : gara.jsface.viewers.StructuredViewer,

	/**
	 * @constructor
	 */
	$constructor : function() {
		this._cell = new gara.jsface.viewers.ViewerCell(null, 0, null);
	},

	_createViewerColumn : function(columnOwner, labelProvider) {
		if (!$class.instanceOf(labelProvider, gara.jsface.viewers.CellLabelProvider)) {
			throw new TypeError("labelProvider not instance of gara.jsface.viewers.CellLabelProvider");
		}

		var column = new gara.jsface.viewers.ViewerColumn(this, columnOwner);
		column.setLabelProvider(labelProvider, false);
		return column;
	},

	_getColumnViewerOwner : $abstract(function(columnIndex) {}),

	_getViewerColumn : function(columnIndex) {
		var columnOwner = this._getColumnViewerOwner(columnIndex);

		if (columnOwner == null) {
			return null;
		}

		var viewer = columnOwner.getData(gara.jsface.viewers.ViewerColumn.COLUMN_VIEWER_KEY);

		if (viewer == null) {
			viewer = this._createViewerColumn(columnOwner, gara.jsface.viewers.CellLabelProvider.createViewerLabelProvider(this.getLabelProvider()));
		}

		return viewer;
	},

	_getViewerRowFromItem : $abstract(function(item) {}),

	setLabelProvider : function(labelProvider) {
		if (!($class.instanceOf(labelProvider, gara.jsface.viewers.ITableLabelProvider)
			|| $class.instanceOf(labelProvider, gara.jsface.viewers.ILabelProvider)
			|| $class.instanceOf(labelProvider, gara.jsface.viewers.CellLabelProvider))) {
			throw new TypeError("labelProvider is not instance of either gara.jsface.viewers.ITableLabelProvider, gara.jsface.viewers.ILabelProvider or gara.jsface.viewers.CellLabelProvider");
		}

		this._updateColumnParts(labelProvider);

		this.$base(labelProvider);
	},

	toString : function() {
		return "[gara.jsface.viewers.ColumnViewer]";
	},

	_updateCell : function(rowItem, column, element) {
		this._cell.update(rowItem, column, element);
		return this._cell;
	},

	_updateColumnParts : function(labelProvider) {
		var column, i = 0;

		while ((column = this._getViewerColumn(i++)) != null) {
			column.setLabelProvider(gara.jsface.viewers.CellLabelProvider
					.createViewerLabelProvider(labelProvider), false);
		}
	}
});