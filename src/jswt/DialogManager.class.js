/*	$Id: $

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
 * @class DialogManager
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @private
 */
$class("DialogManager", {

	_instance : $static(null),

	$constructor : function() {
		this._activeDialog = null;
		this._dialogs = [];
		
		base2.DOM.EventTarget(document);
		gara.EventManager.getInstance().addListener(document, "keydown", this);
	},

	getInstance : $static(function() {
		if (this._instance == null) {
			this._instance = new gara.jswt.DialogManager();
		}

		return this._instance;
	}),

	activate : function(dialog) {
		if (!$class.instanceOf(dialog, gara.jswt.Dialog)) {
			throw new TypeError("dialog is not a gara.jswt.Dialog");
		}

		if (this._activeDialog != dialog) {
			if (this._activeDialog != null) {
				this._activeDialog.domref.style.zIndex = 600;
			}
			
			this._activeDialog = dialog;
			this._activeDialog.domref.style.zIndex = 601;
		}
	},

	addDialog : function(dialog) {
		if (!$class.instanceOf(dialog, gara.jswt.Dialog)) {
			throw new TypeError("dialog is not a gara.jswt.Dialog");
		}

		if (!this._dialogs.contains(dialog)) {
			this._dialogs.push(dialog);
		}
	},

	handleEvent : function(e) {
		switch(e.type) {
			case "keydown":
				if (this._activeDialog != null && e.keyCode == 9) {
					return false;
				} 
				break;
		}

	},

	removeDialog : function(dialog) {
		if (!$class.instanceOf(dialog, gara.jswt.Dialog)) {
			throw new TypeError("dialog is not a gara.jswt.Dialog");
		}

		if (this._dialogs.contains(dialog)) {
			if (this._activeDialog == dialog) {
				this._activeDialog = null;
			}
			this._dialogs.remove(dialog);
		}
	},

	toString : function() {
		return "[gara.jswt.DialogManager]";
	}
});