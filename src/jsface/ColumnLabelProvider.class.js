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
 * @class ColumnLabelProvider
 * @extends gara.jsface.CellLabelProvider
 * @namespace gara.jsface
 * @author Thomas Gossmann
 */
$class("ColumnLabelProvider", {
	$extends : gara.jsface.CellLabelProvider,
	$implements : [gara.jsface.ILabelProvider],

	$constructor : function() {
		this.$base();
	},

	getImage : function(element) {
		return null;
	},

	getText : function(element) {
		return element == null ? "" : element.toString();
	},
	
	update : function(cell) {
		if (!$class.instanceOf(cell, gara.jsface.ViewerCell)) {
			throw new TypeError("cell is not instance of gara.jsface.ViewerCell");
		}
		
		var element = cell.getElement();
		cell.setText(this.getText(element));
		cell.setImage(this.getImage(element));
	}
});