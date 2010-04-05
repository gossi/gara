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

gara.provide("gara.jsface.viewers.TreeViewerRow", "gara.jsface.viewers.ViewerRow");

gara.use("gara.jswt.widgets.TreeItem");

/**
 * @class TreeViewerRow
 * @extends gara.jsface.viewers.ViewerRow
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.jsface.viewers.TreeViewerRow", function () { return {
	$extends : gara.jsface.viewers.ViewerRow,

	$constructor : function ( item) {
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not instance of gara.jswt.widgets.TreeItem");
		}
		this.item = item;
	},

	getItem : function ( ) {
		return this.item;
	},

	getColumnCount : function ( ) {
		return this.item.getParent().getColumnCount();
	},

	getImage : function ( columnIndex) {
		return this.item.getImage(columnIndex);
	},

	getText : function ( columnIndex) {
		return this.item.getText(columnIndex);
	},

	getElement : function ( ) {
		return this.item.getData();
	},

	getControl : function ( ) {
		return this.item.getParent();
	},

	setText : function ( columnIndex, text) {
		this.item.setText(columnIndex, text === null ? "" : text);
	},

	setImage : function ( columnIndex, image) {
		var oldImage = this.item.getImage(columnIndex);
		if (oldImage !== image) {
			this.item.setImage(columnIndex, image);
		}
	},

	setItem : function ( item) {
		if (!(item instanceof gara.jswt.widgets.TreeItem)) {
			throw new TypeError("item is not instance of gara.jswt.widgets.TreeItem");
		}
		this.item = item;
	}
};});