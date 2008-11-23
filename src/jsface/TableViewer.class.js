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
 * @class TableViewer
 * @extends gara.jsface.StructuredViewer
 * @namespace gara.jsface
 * @author Thomas Gossmann
 */
$class("TableViewer", {
	$extends : gara.jsface.AbstractTableViewer,
	
	$constructor : function(parent, style) {
		if ($class.instanceOf(parent, gara.jswt.Table)) {
			this._table = parent;
		} else {
			this._table = new gara.jswt.Table(parent, style);
		}
		this._hookControl(this._table);
	},
	
	_doClear : function(index) {
		this._table.clear(index);
	},

	_doGetColumn : function(index) {
		return this._table.getColumn(index);
	},

	_doGetColumnCount : function() {
		return this._table.getColumnCount();
	},
	
	_doGetItems : function() {
		return this._table.getItems();
	},
	
	_doGetSelection : function() {
		return this._table.getSelection();
	},
	
	_doRemoveRange : function(from, to) {
		this._table.removeRange(from, to);
	},

	getControl : function() {
		return this._table;
	},

	getTable : function() {
		return this._table;
	},

	_getViewerRowFromItem : function(item) {
		if (this._cachedRow == null) {
			this._cachedRow = new gara.jsface.TableViewerRow(item);
		} else {
			this._cachedRow.setItem(item);
		}

		return this._cachedRow;
	},
	
	_internalCreateNewRowPart : function(style, rowIndex) {
		var item;

		if (rowIndex >= 0) {
			item = new gara.jswt.TableItem(this._table, style, rowIndex);
		} else {
			item = new gara.jswt.TableItem(this._table, style);
		}

		return this._getViewerRowFromItem(item);
	},

//	_internalRefresh : function() {
//		this._table.update();
//	},

	refresh : function(element) {
		if (typeof(element) == "undefined") {
			element = null;
		}
		this._internalRefresh(element);
	},

	_tableRemoveAll : function() {
		this._table.removeAll();
	}
	
});
