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
 * @class AbstractListViewer
 * @extends gara.jsface.StructuredViewer
 * @namespace gara.jsface
 * @author Thomas Gossmann
 */
$class("AbstractListViewer", {
	$extends : gara.jsface.StructuredViewer,

	/**
	 * @constructor
	 * Top Constructor von die AbstractListViewer
	 */
	$constructor : function() {
	},
	
	_createListItem : $abstract(function(element) {}),
	
	getControl : $abstract(function() {}),

	_getLabelProviderText : function(labelProvider, element) {
		var text = labelProvider.getText(element);
		if (text == null) {
			text = "";
		}

		return text;
	},
	
	inputChanged : function(input, oldInput) {
		this._listRemoveAll();
		
		var children = this._getRawChildren(this._getRoot());

		/*
		 * This is what the original jface code looks like. Well.. due to easier
		 * image management on websites, we can make this also a little easier
		 * here :-)
		 */
//		var labels = new Array();
//		
//		for (var i = 0; i < children.length; ++i) {
//			var el = children[i];
//			labels.push(this._getLabelProviderText(this.getLabelProvider(), el));
//			this._listMap.push(el);
//		}
//
//		this._listSetItems(labels);
		
		for (var i = 0; i < children.length; ++i) {
			var el = children[i];
			this._createListItem(el);
		}
		
		this.refresh();
	},
	
	_internalRefresh : function() {
		this.getControl().update();
	},
	
	_listRemoveAll : $abstract(function() {}),
	
	_listSetItems : $abstract(function() {})	
});