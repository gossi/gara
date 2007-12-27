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
 * @class ListViewer
 * @extends gara.jsface.AbstractListViewer
 * @namespace gara.jsface
 * @author Thomas Gossmann
 */
$class("ListViewer", {
	$extends : gara.jsface.AbstractListViewer,
	
	$constructor : function(parent, style) {
		this._list = new gara.jswt.List(parent, style);
	},
	
	_createListItem : function(el, index) {
		var item = new gara.jswt.ListItem(this._list, gara.jswt.JSWT.DEFAULT, index);
		item.setText(this._getLabelProviderText(this.getLabelProvider(), el));
		item.setImage(this.getLabelProvider().getImage(el));
		item.setData(el);
		
		return item;
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