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
 * @class TableColumnViewerLabelProvider
 * @extends gara.jsface.viewers.WrappedViewerLabelProvider
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
$class("TableColumnViewerLabelProvider", {
	$extends : gara.jsface.viewers.WrappedViewerLabelProvider,

	$constructor : function(labelProvider) {
		this.$base(labelProvider);

		if ($class.instanceOf(labelProvider, gara.jsface.viewers.ITableLabelProvider)) {
			this._tableLabelProvider = labelProvider;
		}
	},

	update : function(cell) {
		if (!$class.instanceOf(cell, gara.jsface.viewers.ViewerCell)) {
			throw new TypeError("cell is not instance of gara.jsface.viewers.ViewerCell");
		}

		var element = cell.getElement();
		var index = cell.getColumnIndex();

		if (this._tableLabelProvider == null) {
			cell.setText(this.getLabelProvider().getText(element));
			cell.setImage(this.getLabelProvider().getImage(element));
		} else {
			cell.setText(this._tableLabelProvider.getColumnText(element, index));
			cell.setImage(this._tableLabelProvider.getColumnImage(element, index));
		}
	}
});