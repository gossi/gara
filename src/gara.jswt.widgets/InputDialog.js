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

gara.provide("gara.jswt.widgets.InputDialog");
gara.use("gara.jswt.widgets.Button");
gara.use("gara.jswt.widgets.Label");
gara.use("gara.jswt.widgets.Text");

gara.require("gara.jswt.JSWT");
gara.require("gara.jswt.widgets.Dialog");

/**
 * @class MessageBox
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Dialog
 * @namespace gara.jswt.widgets
 */
gara.Class("gara.jswt.widgets.InputDialog", {
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
		this._style |= gara.jswt.JSWT.APPLICATION_MODAL;

		this._input;
		this._btnOk;
		this._btnCancel;

		this.addClass("jsWTInputDialog");
	},

	/**
	 * @method
	 *
	 * Creates the frame for the dialog. Content is populated by a
	 * specialised subclass.
	 *
	 * @private
	 * @param {gara.jswt.widgets.Composite} parent container for the content
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_createContents : function(parent) {
		new gara.jswt.widgets.Label(parent).setText(this._message).addClass("jsWTInputDialogContentText");

		this._input = new gara.jswt.widgets.Text(parent).setText(this._value).addModifyListener(new gara.Class({
			$implements : gara.jswt.events.ModifyListener,
			modifyText : function(e) {
				if (e.type == "keydown") {
					switch(e.keyCode) {
						case gara.jswt.JSWT.ENTER:	this._doOk();		break;
						case gara.jswt.JSWT.ESC:	this._doCancel();	break;
					}
				}
			}
		}));

//		var text = document.createElement("div");
//		text.className = "jsWTInputDialogContentText";
//		text.appendChild(document.createTextNode(this._message));

//		this._input = document.createElement("input");
//		this._input.type = "text";
//		this._input.value = this._value;
//		base2.DOM.EventTarget(this._input);
//		gara.EventManager.addListener(this._input, "keydown", this);
//
//		text.appendChild(this._input);
//		this._dialogContent.appendChild(text);
		var buttonHandler = new gara.Class({
			$implements : gara.jswt.events.SelectionListener,
			widgetSelected : function(e) {
				switch (e.widget) {
				case this._btnOk:		this._doOk();		break;
				case this._btnCancel:	this._doCancel();	break;
				}
			}
		});

		var buttons = new gara.jswt.widgets.Composite(parent).addClass("jsWTInputDialogButtonBar");
		this._btnOk = new gara.jswt.widgets.Button(buttons).setText(gara.i18n.get("gara.ok")).addSelectionListener(buttonHandler);
		this._btnCancel = new gara.jswt.widgets.Button(buttons).setText(gara.i18n.get("gara.cancel")).addSelectionListener(buttonHandler);

		this._input.forceFocus();

		// position
		var left = this._getViewportWidth() / 2 - this.handle.clientWidth/2;
		var top = this._getViewportHeight() / 2 - this.handle.clientHeight/2;

		this.handle.style.left = left + "px";
		this.handle.style.top = top + "px";
	},

	_doOk : function() {

	},

	_doCancel : function() {

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
		this._createContents(this._create());
		this._callback = callback;
		this._context = context || window;
	},

	setMessage : function(message) {
		this._message = message;
	},

	setValue : function(value) {
		this._value = value;
	}
});