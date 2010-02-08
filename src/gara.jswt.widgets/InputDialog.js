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

gara.use("gara.jswt.events.KeyListener");
gara.use("gara.jswt.events.ModifyListener");
gara.use("gara.jswt.events.SelectionListener");

gara.use("gara.jswt.widgets.Composite");
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

		this._txt;
		this._buttons;
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
		var self = this;

		this._txt = new gara.jswt.widgets.Label(parent).setText(this._message).addClass("jsWTInputDialogContentText");
		this._input = new gara.jswt.widgets.Text(parent).setText(this._value).addModifyListener(new gara.Class({
			$implements : gara.jswt.events.ModifyListener,
			modifyText : function(e) {
				if (e.type == "keydown") {
					switch(e.keyCode) {
						case gara.jswt.JSWT.ENTER:	self._doOk();		break;
						case gara.jswt.JSWT.ESC:	self._doCancel();	break;
					}
				}
			}
		}))
		this._input.forceFocus();

		var buttonHandler = new gara.Class({
			$implements : [gara.jswt.events.SelectionListener, gara.jswt.events.KeyListener],
			keyPressed : function(e) {
				if (e.keyCode == gara.jswt.JSWT.ESC) {
					self._doCancel();
				}
			},
			keyReleased : function(e) {},
			widgetSelected : function(e) {
				switch (e.widget) {
					case self._btnOk:		self._doOk();		break;
					case self._btnCancel:	self._doCancel();	break;
				}
			}
		});

		this._buttons = new gara.jswt.widgets.Composite(parent).addClass("jsWTInputDialogButtonBar");
		this._btnOk = new gara.jswt.widgets.Button(this._buttons).setText(gara.i18n.get("gara.ok"))
			.addSelectionListener(buttonHandler)
			.addKeyListener(buttonHandler);
		this._btnCancel = new gara.jswt.widgets.Button(this._buttons).setText(gara.i18n.get("gara.cancel"))
			.addSelectionListener(buttonHandler)
			.addKeyListener(buttonHandler);

		// position
		var left = this._getViewportWidth() / 2 - this.handle.clientWidth/2;
		var top = this._getViewportHeight() / 2 - this.handle.clientHeight/2;

		this.handle.style.left = left + "px";
		this.handle.style.top = top + "px";
	},

	dispose : function() {
		this._txt.dispose();
		this._input.dispose();
		this._btnOk.dispose();
		this._btnCancel.dispose();
		this._buttons.dispose();

		delete this._txt;
		delete this._input;
		delete this._btnOk;
		delete this._btnCancel;
		delete this._buttons;

		this.$base();
	},

	_doOk : function() {
		var response = this._input.getText();
		this.dispose();

		if (this._callback != null) {
			this._callback.call(this._context, response);
		}
	},

	_doCancel : function() {
		this.dispose();

		if (this._callback != null) {
			this._callback.call(this._context, null);
		}
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