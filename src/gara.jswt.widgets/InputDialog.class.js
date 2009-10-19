/*	$Id: InputDialog.class.js 182 2009-08-02 22:34:06Z tgossmann $

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
 * @class MessageBox
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Dialog
 * @namespace gara.jswt.widgets
 */
$class("InputDialog", {
	$extends : gara.jswt.widgets.Dialog,

	/**
	 * @constructor
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);

		this._callback = null;
		this._context = window;
		this._message = "";
		this._value = "";
		this._style |= JSWT.APPLICATION_MODAL;

		this._input;
		this._btnOk;
		this._btnCancel;
	},

	/**
	 * @method
	 *
	 * Creates the frame for the dialog. Content is populated by a
	 * specialised subclass.
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_create : function() {
		this.$base();

		this.handle.className += " jsWTInputDialog";
		var text = document.createElement("div");
		text.className = "jsWTInputDialogContentText";
		text.appendChild(document.createTextNode(this._message));


		this._input = document.createElement("input");
		this._input.type = "text";
		this._input.value = this._value;
		base2.DOM.EventTarget(this._input);
		gara.EventManager.addListener(this._input, "keydown", this);

		text.appendChild(this._input);
		this._dialogContent.appendChild(text);

		var buttons = document.createElement("div");
		buttons.className = "jsWTInputDialogButtonBar";

		this._btnOk = document.createElement("input");
		this._btnOk.type = "button";
		this._btnOk.value = gara.i18n.get("ok");
		base2.DOM.EventTarget(this._btnOk);
		buttons.appendChild(this._btnOk);
		gara.EventManager.addListener(this._btnOk, "click", this);

		this._btnCancel = document.createElement("input");
		this._btnCancel.type = "button";
		this._btnCancel.value = gara.i18n.get("cancel");
		base2.DOM.EventTarget(this._btnCancel);
		buttons.appendChild(this._btnCancel);
		gara.EventManager.addListener(this._btnCancel, "click", this);

		this._dialogContent.appendChild(buttons);

		this._input.focus();


		// position
		var left = this._getViewportWidth() / 2 - this.handle.clientWidth/2;
		var top = this._getViewportHeight() / 2 - this.handle.clientHeight/2;

		this.handle.style.left = left + "px";
		this.handle.style.top = top + "px";
	},

	getMessage : function() {
		return this._message;
	},

	getValue : function() {
		return this._value;
	},

	handleEvent : function(e) {
		this.$base(e);
		if (this._disposed && this._callback != null) {
			this._callback.call(this._context, null);
		}
		switch(e.type) {
			case "keydown":
				// ESC
				if (e.target == this._input && e.keyCode == 27) {
					this.dispose();
					this._callback.call(this._context, null);
				}

				// ENTER
				if (e.target == this._input
						&& (e.keyCode == 13 || e.keyCode == 10)
						&& this._callback != null) {
					this.dispose();
					this._callback.call(this._context, this._input.value);
				}
				break;

			case "click":
				var response;
				switch(e.target) {
					case this._btnOk:
						response = this._input.value;
						break;

					default:
					case this._btnCancel:
						response = null;
						break;
				}
				this.dispose();
				if (this._callback != null) {
					this._callback.call(this._context, response);
				}
				break;
		}
	},

	open: function(callback, context) {
		this._create();
		this._callback = callback;
		this._context = context || window;
	},

	setMessage : function(message) {
		this._message = message;
	},

	setValue : function(value) {
		this._value = value;
	},

	toString : function() {
		return "[gara.jswt.widgets.MessageBox]";
	}
});