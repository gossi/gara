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

gara.provide("gara.jsface.action.Action");

gara.require("gara.jsface.action.IAction");
gara.require("gara.jsface.action.ActionChangedListener");

/**
 * @class Action
 * @namespace gara.jsface.action
 * @author Thomas Gossmann
 */
$class("Action", {
	$implements : [gara.jsface.action.IAction],
	$constructor : function() {
		this._listeners = [];
	},

	addActionChangedListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jsface.action.ActionChangedListener)) {
			throw new TypeError("listener not type of gara.jsface.action.ActionChangedListener");
		}

		if (!this._listeners.contains(listener)) {
			this._listeners.push(listener);
		}
	},

	getText : $abstract(function() {}),
	getImage : $abstract(function() {}),
	getEnabled : $abstract(function() {}),

	notifyActionChangedListener : function() {
		this._listeners.forEach(function(listener){
			listener.actionChanged(this);
		}, this);
	},

	removeActionChangedListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jsface.action.ActionChangedListener)) {
			throw new TypeError("listener not type of gara.jsface.action.ActionChangedListener");
		}

		this._listeners.remove(listener);
	},

	run : $abstract(function() {})
});
