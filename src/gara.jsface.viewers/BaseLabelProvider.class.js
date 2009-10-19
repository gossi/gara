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
 * @class BaseLabelProvider
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
$class("BaseLabelProvider", {
	$implements : [gara.jsface.viewers.IBaseLabelProvider],

	$constructor : function() {
		this.$base();
		this._listener = null;
	},

	addListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jsface.viewers.ILabelProviderListener)) {
			throw new TypeError("listener not type of gara.jsface.viewers.ILabelProviderListener");
		}

		if (this._listener == null) {
			this._listener = [];
		}

		this._listener.add(listener);
	},

	isLabelProperty : function(element, property) {
		return true;
	},

	removeListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jsface.viewers.ILabelProviderListener)) {
			throw new TypeError("listener not type of gara.jsface.viewers.ILabelProviderListener");
		}

		if (this._listener != null && this._listener.contains(listener)) {
			this._listener.remove(listener);
		}
	}
});