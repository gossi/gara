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
 * @extends gara.jsface.StructuredViewer 
 * @namespace gara.jsface
 * @author Thomas Gossmann
  */
$class("ColumnViewer", {
	$extends : gara.jsface.StructuredViewer,

	/**
	 * @constructor
	 */
	$constructor : function() {
		this._cell = new gara.jsface.ViewerCell(null, 0, null);
	},

	_createViewerColumn : function(columnOwner, labelProvider) {
		if (!$class.instanceOf(columnOwner, gara.jswt.TableColumn)) {
			throw new TypeError("columnOwner not instance of gara.jswt.TableColumn");
		}

		if (!$class.instanceOf(labelProvider, gara.jsface.CellLabelProvider)) {
			throw new TypeError("labelProvider not instance of gara.jsface.CellLabelProvider");
		}

		var column = new gara.jsface.ViewerColumn(this, columnOwner);
		column.setLabelProvider(labelProvider, false);
		return column;
	},

	_getViewerColumn : function(columnIndex) {
		var viewer;
		var columnOwner = this._getColumnViewerOwner(columnIndex);

		if (columnOwner == null) {
			return null;
		}

		viewer = columnOwner.getData(gara.jsface.ViewerColumn.COLUMN_VIEWER_KEY);

		if (viewer == null) {
			viewer = this._createViewerColumn(columnOwner, gara.jsface.CellLabelProvider
					.createViewerLabelProvider(this.getLabelProvider()));
		}

		return viewer;
	},

	_getViewerRowFromItem : $abstract(function(item) {}),

	setLabelProvider : function(labelProvider) {
		if (!($class.instanceOf(labelProvider, gara.jsface.ITableLabelProvider)
			|| $class.instanceOf(labelProvider, gara.jsface.ILabelProvider)
			|| $class.instanceOf(labelProvider, gara.jsface.CellLabelProvider))) {
			throw new TypeError("labelProvider is not instance of either gara.jsface.ITableLabelProvider, gara.jsface.ILabelProvider or gara.jsface.CellLabelProvider");
		}
		
		this._updateColumnParts(labelProvider);

		this.$base(labelProvider);
	},

	toString : function() {
		return "[gara.jsface.ColumnViewer]";
	},

	_updateColumnParts : function(labelProvider) {
		var column, i = 0;

		while ((column = this._getViewerColumn(i++)) != null) {
			column.setLabelProvider(gara.jsface.CellLabelProvider
					.createViewerLabelProvider(labelProvider), false);
		}
	}
});