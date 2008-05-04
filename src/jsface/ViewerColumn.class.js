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
 * @class ViewerColumn
 * @namespace gara.jsface
 * @author Thomas Gossmann
 */
$class("ViewerColumn", {

	COLUMN_VIEWER_KEY : $static("jsface.columnViewer"),

	/**
	 * @constructor
	 * Create a new instance of the receiver at columnIndex.
	 * 
	 * @param viewer
	 *            the viewer the column is part of
	 * @param columnOwner
	 *            the widget owning the viewer in case the widget has no columns
	 *            this could be the widget itself
	 */
	$constructor : function(viewer, columnOwner) {
		if (!$class.instanceOf(viewer, gara.jsface.ColumnViewer)) {
			throw new TypeError("viewer not instance of gara.jsface.ColumnViewer");
		}
		
		if (!$class.instanceOf(columnOwner, gara.jswt.Widget)) {
			throw new TypeError("columnOwner not instance of gara.jswt.Widget");
		}

		columnOwner.setData(this.COLUMN_VIEWER_KEY, this);
		this._labelProvider = null;
	},

	/**
	 * @method
	 * Return the label provider for the receiver.
	 * 
	 * @return {gara.jsface.CellLabelProvider}
	 */
	getLabelProvider : function() {
		return this._labelProvider;
	},

	/**
	 * @method
	 * Set the label provider for the column. Subclasses may extend but must
	 * call the super implementation.
	 * 
	 * @param {gara.jsface.CellLabelProvider} labelProvider
	 *            the new CellLabelProvider
	 * @param {bool} registerListener
	 *            wether a listener should registered on the labelProvider or not
	 */
	setLabelProvider : function(labelProvider, registerListener) {
		if (!$class.instanceOf(labelProvider, gara.jsface.CellLabelProvider)) {
			throw new TypeError("labelProvider not instance of gara.jsface.CellLabelProvider");
		}
		this._labelProvider = labelProvider;
	},

	/**
	 * @method
	 * Refresh the cell
	 * 
	 * @param {gara.jsface.ViewerCell} cell
	 */
	refresh : function(cell) {
		if (!$class.instanceOf(cell, gara.jsface.ViewerCell)) {
			throw new TypeError("cell not instance of gara.jsface.ViewerCell");
		}

		this.getLabelProvider().update(cell);
	}
});