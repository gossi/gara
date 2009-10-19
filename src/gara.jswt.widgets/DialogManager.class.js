/*	$Id: DialogManager.class.js 182 2009-08-02 22:34:06Z tgossmann $

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
 * @namespace gara.jswt.widgets
 * @private
 */
$class("DialogManager", {

	_instance : $static(null),

	$constructor : function() {
		this._activeDialog = null;
		this._dialogs = [];
		this._recents = [];

		gara.EventManager.addListener(document, "keydown", this);
	},

	getInstance : $static(function() {
		if (this._instance == null) {
			this._instance = new gara.jswt.widgets.DialogManager();
		}

		return this._instance;
	}),

	activate : function(dialog) {
//		if (!$class.instanceOf(dialog, gara.jswt.Dialog)) {
//			throw new TypeError("dialog is not a gara.jswt.Dialog");
//		}
		if (!dialog.open) {
			throw new TypeError("dialog is not a gara.jswt.widgets.Dialog");
		}

		if (this._activeDialog != dialog) {
			if (this._activeDialog != null) {
				this._activeDialog.handle.style.zIndex = 600;
			}

			this._activeDialog = dialog;
			this._recents.remove(dialog);
			this._recents.insertAt(0, dialog);

			this._recents.forEach(function(dialog, index) {
				dialog.handle.style.zIndex = 600 + (this._dialogs.length - index);
			}, this);

			if ((this._activeDialog.getStyle() & JSWT.APPLICATION_MODAL) == JSWT.APPLICATION_MODAL) {
				this._activeDialog.handle.style.zIndex = 651;
			}
		}
	},

	addDialog : function(dialog) {
//		if (!$class.instanceOf(dialog, gara.jswt.Dialog)) {
//			throw new TypeError("dialog is not a gara.jswt.Dialog");
//		}
		if (!dialog.open) {
			throw new TypeError("dialog is not a gara.jswt.widgets.Dialog");
		}

		if (!this._dialogs.contains(dialog)) {
			this._dialogs.push(dialog);
			this._recents.push(dialog);
		}
	},

	getActiveDialog : function() {
		if (this._activeDialog != null) {
			return this._activeDialog;
		}
		return null;
	},

	getDialogs : function() {
		return this._dialogs;
	},

	handleEvent : function(e) {
		switch(e.type) {
			case "mousedown":
				if (e.target.obj
						&& dialog.open) {
					this.activate(e.target.obj);
				}
				break;

			case "keydown":
				if (this._activeDialog != null && e.keyCode == 9) {
					return false;
				}
				break;
		}
	},

	removeDialog : function(dialog) {
		if (!dialog.open) {
			throw new TypeError("dialog is not a gara.jswt.widgets.Dialog");
		}

		if (this._dialogs.contains(dialog)) {
			if (this._activeDialog == dialog) {
				this._activeDialog = null;
			}
			this._dialogs.remove(dialog);
		}
	},

	toString : function() {
		return "[gara.jswt.widgets.DialogManager]";
	}
});