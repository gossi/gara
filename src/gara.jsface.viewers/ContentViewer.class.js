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
 * @class ContentViewer
 * @extends gara.jsface.viewers.Viewer
 * @author Thomas Gossmann
 * @namespace gara.jsface.viewers
 */
$class("ContentViewer", {
	$extends : gara.jsface.viewers.Viewer,

	/**
	 * @constructor
	 */
	$constructor : function() {
		this._input = null;
		this._contentProvider = null;
		this._labelProvider = null;
	},

	getContentProvider : function() {
		return this._contentProvider;
	},

	getInput : function() {
		return this._input;
	},

	getLabelProvider : function() {
		return this._labelProvider;
	},

	inputChanged : $abstract(function() {}),

	setContentProvider : function(contentProvider) {
		if (!$class.instanceOf(contentProvider, gara.jsface.viewers.IContentProvider)) {
			throw new TypeError("contentProvider is not type of gara.jsface.viewers.IContentProvider");
		}
		this._contentProvider = contentProvider;
	},

	setInput : function(input) {
		var oldInput = this.getInput();
		this._contentProvider.inputChanged(this, oldInput, input);
		this._input = input;
		this.inputChanged(this._input, oldInput);
	},

	setLabelProvider : function(labelProvider) {
		if (!$class.instanceOf(labelProvider, gara.jsface.viewers.IBaseLabelProvider)) {
			throw new TypeError("labelProvider is not type of gara.jsface.viewers.IBaseLabelProvider");
		}
		this._labelProvider = labelProvider;
	}
});