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

gara.provide("gara.viewers.TableViewerRow", "gara.viewers.ViewerRow");

gara.use("gara.widgets.TableItem");

/**
 * @class TableViewerRow
 * @extends gara.viewers.ViewerRow
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.TableViewerRow", function () { return {
	$extends : gara.viewers.ViewerRow,

	$constructor : function (item) {
		if (!(item instanceof gara.widgets.TableItem)) {
			throw new TypeError("item is not instance of gara.widgets.TableItem");
		}
		this.item = item;
	},

	getItem : function () {
		return this.item;
	},

	getColumnCount : function () {
		return this.item.getParent().getColumnCount();
	},

	getImage : function (columnIndex) {
		return this.item.getImage(columnIndex);
	},

	getText : function (columnIndex) {
		return this.item.getText(columnIndex);
	},

	getElement : function () {
		return this.item.getData();
	},

	getControl : function () {
		return this.item.getParent();
	},

	setText : function (columnIndex, text) {
		this.item.setText(columnIndex, text === null ? "" : text);
	},

	setImage : function (columnIndex, image) {
		var oldImage = this.item.getImage(columnIndex);
		if (oldImage !== image) {
			this.item.setImage(columnIndex, image);
		}
	},

	setItem : function (item) {
		if (!(item instanceof gara.widgets.TableItem)) {
			throw new TypeError("item is not instance of gara.widgets.TableItem");
		}
		this.item = item;
	}
};});