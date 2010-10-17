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

gara.provide("gara.viewers.ViewerColumn");

gara.use("gara.viewers.ColumnViewer");
//gara.use("gara.viewers.ViewerCell");
gara.use("gara.viewers.CellLabelProvider");
gara.use("gara.widgets.Widget");

/**
 * @class ViewerColumn
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.ViewerColumn", {

	COLUMN_VIEWER_KEY : gara.$static("gara.viewers.columnViewer"),

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
	$constructor : function (viewer, columnOwner) {
		if (!(viewer instanceof gara.viewers.ColumnViewer)) {
			throw new TypeError("viewer not instance of gara.viewers.ColumnViewer");
		}

		if (!(columnOwner instanceof gara.widgets.Widget)) {
			throw new TypeError("columnOwner not instance of gara.widgets.Widget");
		}

		columnOwner.setData(gara.viewers.ViewerColumn.COLUMN_VIEWER_KEY, this);
		this.labelProvider = null;
	},

	/**
	 * @method
	 * Return the label provider for the receiver.
	 *
	 * @return {gara.viewers.CellLabelProvider}
	 */
	getLabelProvider : function () {
		return this.labelProvider;
	},

	/**
	 * @method
	 * Set the label provider for the column. Subclasses may extend but must
	 * call the super implementation.
	 *
	 * @param {gara.viewers.CellLabelProvider} labelProvider
	 *            the new CellLabelProvider
	 * @param {bool} registerListener
	 *            wether a listener should registered on the labelProvider or not
	 */
	setLabelProvider : function (labelProvider, registerListener) {
		if (!(labelProvider instanceof gara.viewers.CellLabelProvider)) {
			throw new TypeError("labelProvider not instance of gara.viewers.CellLabelProvider");
		}
		this.labelProvider = labelProvider;
	},

	/**
	 * @method
	 * Refresh the cell
	 *
	 * @param {gara.viewers.ViewerCell} cell
	 */
	refresh : function (cell) {
		if (!(cell instanceof gara.viewers.ViewerCell)) {
			throw new TypeError("cell not instance of gara.viewers.ViewerCell");
		}

		this.getLabelProvider().update(cell);
	}
});