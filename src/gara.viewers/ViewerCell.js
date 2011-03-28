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

gara.provide("gara.viewers.ViewerCell");

/**
 * @class ViewerCell
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.ViewerCell", {

	$constructor : function (rowItem, columnIndex, element) {
		this.row = rowItem;
		this.columnIndex = columnIndex;
		this.element = element;
	},

	getColumnIndex : function () {
		return this.columnIndex;
	},

	getControl : function () {
		return this.row.getControl();
	},

	getElement : function () {
		if (this.element !== null) {
			return this.element;
		}
		return this.row.getElement();
	},

	getText : function () {
		return this.row.getText(columnIndex);
	},

	getImage : function () {
		return this.row.getImage(columnIndex);
	},

	getItem : function () {
		return this.row.getItem();
	},

	getViewerRow : function () {
		return this.row;
	},

	setText : function (text) {
		this.row.setText(this.columnIndex, text);
	},

	setImage : function (image) {
		this.row.setImage(this.columnIndex, image);
	},

	setColumn : function (columnIndex) {
		this.columnIndex = columnIndex;
	},

	update : function (rowItem, columnIndex, element) {
		this.row = rowItem;
		this.columnIndex = columnIndex;
		this.element = element;
	}
});