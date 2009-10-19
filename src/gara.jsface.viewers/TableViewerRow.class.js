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
 * @class TableViewerRow
 * @extends gara.jsface.viewers.ViewerRow
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
$class("TableViewerRow", {
	$extends : gara.jsface.viewers.ViewerRow,

	$constructor : function(item) {
		if (!$class.instanceOf(item, gara.jswt.widgets.TableItem)) {
			throw new TypeError("item is not instance of gara.jswt.widgets.TableItem");
		}
		this._item = item;
	},

	getItem : function() {
		return this._item;
	},

	getColumnCount : function() {
		return this._item.getParent().getColumnCount();
	},

	getImage : function(columnIndex) {
		return this._item.getImage(columnIndex);
	},

	getText : function(columnIndex) {
		return this._item.getText(columnIndex);
	},

	getElement : function() {
		return this._item.getData();
	},

	getControl : function() {
		return this._item.getParent();
	},

	setText : function(columnIndex, text) {
		this._item.setText(columnIndex, text == null ? "" : text);
	},

	setImage : function(columnIndex, image) {
		var oldImage = this._item.getImage(columnIndex);
		if (oldImage != image) {
			this._item.setImage(columnIndex, image);
		}
	},

	setItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.widgets.TableItem)) {
			throw new TypeError("item is not instance of gara.jswt.widgets.TableItem");
		}
		this._item = item;
	}
});