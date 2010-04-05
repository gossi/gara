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

gara.provide("gara.jsface.viewers.ColumnLabelProvider", "gara.jsface.viewers.CellLabelProvider");

//gara.use("gara.jsface.viewers.ILabelProvider");
gara.use("gara.jsface.viewers.ViewerCell");

/**
 * @class ColumnLabelProvider
 * @extends gara.jsface.viewers.CellLabelProvider
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.jsface.viewers.ColumnLabelProvider", function () { return {
	$extends : gara.jsface.viewers.CellLabelProvider,
//	$implements : [gara.jsface.viewers.ILabelProvider],

	$constructor : function () {
		this.$super();
	},

//	getImage : function (element) {
//		return null;
//	},

	getText : function (element) {
		return element === null ? "" : element.toString();
	},

//	isLabelProperty : function (element, property) {
//		return true;
//	},

	update : function (cell) {
		if (!(cell instanceof gara.jsface.viewers.ViewerCell)) {
			throw new TypeError("cell is not instance of gara.jsface.viewers.ViewerCell");
		}

		var element = cell.getElement();
		cell.setText(this.getText(element));
		cell.setImage(this.getImage(element));
	}
};});