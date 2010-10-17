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

gara.provide("gara.viewers.ListViewer", "gara.viewers.AbstractListViewer");

gara.use("gara.widgets.List");
gara.use("gara.widgets.ListItem");

/**
 * @class ListViewer
 * @extends gara.viewers.AbstractListViewer
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.ListViewer", function () { return {
	$extends : gara.viewers.AbstractListViewer,

	$constructor : function (parent, style) {
		if (parent instanceof gara.widgets.List) {
			this.list = parent;
		} else {
			this.list = new gara.widgets.List(parent, style);
		}
		this.hookControl(this.list);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	createListItem : function (el, style, index) {
		var item = new gara.widgets.ListItem(this.list, style, index);
		item.setText(this.getLabelProviderText(this.getLabelProvider(), el));
		if (this.getLabelProvider().getImage) {
			item.setImage(this.getLabelProvider().getImage(el));
		}
		item.setData(el);

		return item;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	doGetSelection : function () {
		return this.list.getSelection();
	},

	getControl : function () {
		return this.list;
	},

	getList : function () {
		return this.list;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	listRemoveAll : function () {
		this.list.removeAll();
	}
};});