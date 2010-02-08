/*	$Id: MessageBox.class.js 180 2009-07-28 18:28:51Z tgossmann $

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

gara.provide("gara.jswt.widgets.MessageBox");

gara.use("gara.I18n");
gara.use("gara.jswt.widgets.Button");

gara.require("gara.jswt.JSWT");
gara.require("gara.jswt.widgets.Dialog");

/**
 * @class MessageBox
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Dialog
 * @namespace gara.jswt.wigets
 */
gara.Class("gara.jswt.widgets.MessageBox", {
	$extends : gara.jswt.widgets.Dialog,

	/**
	 * @constructor
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);

		this._callback = null;
		this._context = window;
		this._message = "";
		this._style |= gara.jswt.JSWT.APPLICATION_MODAL;

		this._btnOk;
		this._btnYes;
		this._btnNo;
		this._btnAbort;
		this._btnRetry;
		this._btnIgnore;
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

		this.handle.role = "alertdialog";
		this.handle.className += " jsWTMessageBox";
		this.handle.setAttribute("aria-describedby", this.getId()+"-message");

		var text = document.createElement("div");
		text.className = "jsWTMessageBoxContentText";
		text.id = this.getId() + "-message";
		text.appendChild(document.createTextNode(this._message));

		// ICON_ERROR, ICON_INFORMATION, ICON_QUESTION, ICON_WARNING, ICON_WORKING
		if ((this._style & gara.jswt.JSWT.ICON_ERROR) == gara.jswt.JSWT.ICON_ERROR) {
			text.className += " jsWTIconError";
		}

		if ((this._style & gara.jswt.JSWT.ICON_INFORMATION) == gara.jswt.JSWT.ICON_INFORMATION) {
			text.className += " jsWTIconInformation";
		}

		if ((this._style & gara.jswt.JSWT.ICON_QUESTION) == gara.jswt.JSWT.ICON_QUESTION) {
			text.className += " jsWTIconQuestion";
		}

		if ((this._style & gara.jswt.JSWT.ICON_WARNING) == gara.jswt.JSWT.ICON_WARNING) {
			text.className += " jsWTIconWarning";
		}

		if ((this._style & gara.jswt.JSWT.ICON_WORKING) == gara.jswt.JSWT.ICON_WORKING) {
			text.className += " jsWTIconWorking";
		}

		this._dialogContent.appendChild(text);

		var buttons = document.createElement("div");
		buttons.className = "jsWTMessageBoxButtonBar";

		if ((this._style & gara.jswt.JSWT.OK) == gara.jswt.JSWT.OK) {
			this._btnOk = new gara.jswt.widgets.Button(buttons).setText(gara.i18n.get("ok"));
			this._btnOk.addListener("click", this);
//			gara.EventManager.addListener(this._btnOk, "click", this);
		}

		if ((this._style & gara.jswt.JSWT.YES) == gara.jswt.JSWT.YES) {
			this._btnYes = new gara.jswt.widgets.Button(buttons).setText(gara.i18n.get("yes"));
			this._btnYes.addListener("click", this);
//			this._btnYes.type = "button";
//			this._btnYes.value = gara.i18n.get("yes");
//			buttons.appendChild(this._btnYes);
//			gara.EventManager.addListener(this._btnYes, "click", this);
		}

		if ((this._style & gara.jswt.JSWT.NO) == gara.jswt.JSWT.NO) {
			this._btnNo = document.createElement("input");
			this._btnNo.type = "button";
			this._btnNo.value = gara.i18n.get("no");
			buttons.appendChild(this._btnNo);
			gara.EventManager.addListener(this._btnNo, "click", this);
		}

		if ((this._style & gara.jswt.JSWT.ABORT) == gara.jswt.JSWT.ABORT) {
			this._btnAbort = document.createElement("input");
			this._btnAbort.type = "button";
			this._btnAbort.value = gara.i18n.get("abort");
			buttons.appendChild(this._btnAbort);
			gara.EventManager.addListener(this._btnAbort, "click", this);
		}

		if ((this._style & gara.jswt.JSWT.RETRY) == gara.jswt.JSWT.RETRY) {
			this._btnRetry = document.createElement("input");
			this._btnRetry.type = "button";
			this._btnRetry.value = gara.i18n.get("retry");
			buttons.appendChild(this._btnRetry);
			gara.EventManager.addListener(this._btnRetry, "click", this);
		}

		if ((this._style & gara.jswt.JSWT.IGNORE) == gara.jswt.JSWT.IGNORE) {
			this._btnIgnore = document.createElement("input");
			this._btnIgnore.type = "button";
			this._btnIgnore.value = gara.i18n.get("ignore");
			buttons.appendChild(this._btnIgnore);
			gara.EventManager.addListener(this._btnIgnore, "click", this);
		}

		if ((this._style & gara.jswt.JSWT.CANCEL) == gara.jswt.JSWT.CANCEL) {
			this._btnCancel = document.createElement("input");
			this._btnCancel.type = "button";
			this._btnCancel.value = gara.i18n.get("cancel");
			buttons.appendChild(this._btnCancel);
			gara.EventManager.addListener(this._btnCancel, "click", this);
		}

		this._dialogContent.appendChild(buttons);

		// position
		var left = this._getViewportWidth() / 2 - this.handle.clientWidth/2;
		var top = this._getViewportHeight() / 2 - this.handle.clientHeight/2;

		this.handle.style.left = left + "px";
		this.handle.style.top = top + "px";
	},

	getMessage : function() {
		return this._message;
	},

	handleEvent : function(e) {
		this.$base(e);
		if (this._disposed && this._callback != null) {
			this._callback.call(this._context, gara.jswt.JSWT.CANCEL);
		}
		switch(e.type) {
			case "click":
				var response;
				switch(e.target) {
					case this._btnOk:
						response = gara.jswt.JSWT.OK;
						break;

					case this._btnYes:
						response = gara.jswt.JSWT.YES;
						break;

					case this._btnNo:
						response = gara.jswt.JSWT.NO;
						break;

					case this._btnAbort:
						response = gara.jswt.JSWT.ABORT;
						break;

					case this._btnRetry:
						response = gara.jswt.JSWT.RETRY;
						break;

					case this._btnIgnore:
						response = gara.jswt.JSWT.IGNORE;
						break;

					default:
					case this._btnCancel:
						response = gara.jswt.JSWT.CANCEL;
						break;
				}
				this.dispose();
				if (this._callback != null) {
					this._callback.call(this._context, response);
				}
				break;
		}
	},

	open: function(callback, context){
		this._create();
		this._callback = callback || null;
		this._context = context || window;
	},

	setMessage : function(message) {
		this._message = message;
	}
});