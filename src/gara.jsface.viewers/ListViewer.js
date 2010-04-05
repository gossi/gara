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

gara.provide("gara.jsface.viewers.ListViewer", "gara.jsface.viewers.AbstractListViewer");

gara.use("gara.jswt.widgets.List");
gara.use("gara.jswt.widgets.ListItem");

/**
 * @class ListViewer
 * @extends gara.jsface.viewers.AbstractListViewer
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.jsface.viewers.ListViewer", function () { return {
	$extends : gara.jsface.viewers.AbstractListViewer,

	$constructor : function (parent, style) {
		if (parent instanceof gara.jswt.widgets.List) {
			this.list = parent;
		} else {
			this.list = new gara.jswt.widgets.List(parent, style);
		}
		this.hookControl(this.list);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	createListItem : function (el, style, index) {
		var item = new gara.jswt.widgets.ListItem(this.list, style, index);
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