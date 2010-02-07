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

gara.provide("gara.jsface.viewers.ListViewer");

gara.require("gara.jsface.viewers.AbstractListViewer");
gara.require("gara.jswt.widgets.List");

$package("gara.jsface.viewers");

/**
 * @class ListViewer
 * @extends gara.jsface.viewers.AbstractListViewer
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
$class("ListViewer", {
	$extends : gara.jsface.viewers.AbstractListViewer,

	$constructor : function(parent, style) {
		if ($class.instanceOf(parent, gara.jswt.widgets.List)) {
			this._list = parent;
		} else {
			this._list = new gara.jswt.widgets.List(parent, style);
		}
		this._hookControl(this._list);
	},

	_createListItem : function(el, style, index) {
		var item = new gara.jswt.widgets.ListItem(this._list, style, index);
		item.setText(this._getLabelProviderText(this.getLabelProvider(), el));
		item.setImage(this.getLabelProvider().getImage(el));
		item.setData(el);

		return item;
	},

	_doGetSelection : function() {
		return this._list.getSelection();
	},

	getControl : function() {
		return this._list;
	},

	getList : function() {
		return this._list;
	},

	_listRemoveAll : function() {
		this._list.removeAll();
	},

	_listSetItems : function(strings) {
		this._list.setItems(strings);
	}
});
$package("");