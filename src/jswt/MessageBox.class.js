/*	$Id$

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

function getStyle(el, styleProp, ieStyleProp)
{
	var x = el;
	if (x.currentStyle)
		var y = x.currentStyle[ieStyleProp];
	else if (window.getComputedStyle)
		var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	return y;
}

/**
 * @class MessageBox
 * @author Thomas Gossmann
 * @extends gara.jswt.Dialog
 * @namespace gara.jswt
 */
$class("MessageBox", {
	$extends : gara.jswt.Dialog, 

	/**
	 * @constructor
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);
		
		this._callback = null;
		this._context = window;
		this._message = "";
		this._style |= JSWT.APPLICATION_MODAL;

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
		
		this.domref.className += " jsWTMessageBox";
		var text = document.createElement("div");
		text.className = "jsWTMessageBoxContentText";
		text.appendChild(document.createTextNode(this._message));
		
		// ICON_ERROR, ICON_INFORMATION, ICON_QUESTION, ICON_WARNING, ICON_WORKING
		if ((this._style & JSWT.ICON_ERROR) == JSWT.ICON_ERROR) {
			text.className += " jsWTIconError";
		}

		if ((this._style & JSWT.ICON_INFORMATION) == JSWT.ICON_INFORMATION) {
			text.className += " jsWTIconInformation";
		}

		if ((this._style & JSWT.ICON_QUESTION) == JSWT.ICON_QUESTION) {
			text.className += " jsWTIconQuestion";
		}

		if ((this._style & JSWT.ICON_WARNING) == JSWT.ICON_WARNING) {
			text.className += " jsWTIconWarning";
		}

		if ((this._style & JSWT.ICON_WORKING) == JSWT.ICON_WORKING) {
			text.className += " jsWTIconWorking";
		}
		
		this._dialogContent.appendChild(text);

		var buttons = document.createElement("div");
		buttons.className = "jsWTMessageBoxButtonBar";
		
		if ((this._style & JSWT.OK) == JSWT.OK) {
			this._btnOk = document.createElement("input");
			this._btnOk.type = "button";
			this._btnOk.value = gara.i18n.get("ok");
			base2.DOM.EventTarget(this._btnOk);
			buttons.appendChild(this._btnOk);
			gara.EventManager.addListener(this._btnOk, "click", this);
		}
		
		if ((this._style & JSWT.YES) == JSWT.YES) {
			this._btnYes = document.createElement("input");
			this._btnYes.type = "button";
			this._btnYes.value = gara.i18n.get("yes");
			base2.DOM.EventTarget(this._btnYes);
			buttons.appendChild(this._btnYes);
			gara.EventManager.addListener(this._btnYes, "click", this);
		}
		
		if ((this._style & JSWT.NO) == JSWT.NO) {
			this._btnNo = document.createElement("input");
			this._btnNo.type = "button";
			this._btnNo.value = gara.i18n.get("no");
			base2.DOM.EventTarget(this._btnNo);
			buttons.appendChild(this._btnNo);
			gara.EventManager.addListener(this._btnNo, "click", this);
		}
		
		if ((this._style & JSWT.ABORT) == JSWT.ABORT) {
			this._btnAbort = document.createElement("input");
			this._btnAbort.type = "button";
			this._btnAbort.value = gara.i18n.get("abort");
			base2.DOM.EventTarget(this._btnAbort);
			buttons.appendChild(this._btnAbort);
			gara.EventManager.addListener(this._btnAbort, "click", this);
		}
		
		if ((this._style & JSWT.RETRY) == JSWT.RETRY) {
			this._btnRetry = document.createElement("input");
			this._btnRetry.type = "button";
			this._btnRetry.value = gara.i18n.get("retry");
			base2.DOM.EventTarget(this._btnRetry);
			buttons.appendChild(this._btnRetry);
			gara.EventManager.addListener(this._btnRetry, "click", this);
		}

		if ((this._style & JSWT.IGNORE) == JSWT.IGNORE) {
			this._btnIgnore = document.createElement("input");
			this._btnIgnore.type = "button";
			this._btnIgnore.value = gara.i18n.get("ignore");
			base2.DOM.EventTarget(this._btnIgnore);
			buttons.appendChild(this._btnIgnore);
			gara.EventManager.addListener(this._btnIgnore, "click", this);
		}

		if ((this._style & JSWT.CANCEL) == JSWT.CANCEL) {
			this._btnCancel = document.createElement("input");
			this._btnCancel.type = "button";
			this._btnCancel.value = gara.i18n.get("cancel");
			base2.DOM.EventTarget(this._btnCancel);
			buttons.appendChild(this._btnCancel);
			gara.EventManager.addListener(this._btnCancel, "click", this);
		}

		this._dialogContent.appendChild(buttons);
		
		// position
		var left = this._getViewportWidth() / 2 - this.domref.clientWidth/2;
		var top = this._getViewportHeight() / 2 - this.domref.clientHeight/2;
		
		this.domref.style.left = left + "px";
		this.domref.style.top = top + "px";
	},

	getMessage : function() {
		return this._message;
	},
	
	handleEvent : function(e) {
		this.$base(e);
		if (this._disposed && this._callback != null) {
			this._callback.call(this._context, JSWT.CANCEL);
		}
		switch(e.type) {
			case "click":
				var response;
				switch(e.target) {
					case this._btnOk:
						response = JSWT.OK;
						break;
					
					case this._btnYes:
						response = JSWT.YES;
						break;
						
					case this._btnNo:
						response = JSWT.NO;
						break;
					
					case this._btnAbort:
						response = JSWT.ABORT;
						break;
					
					case this._btnRetry:
						response = JSWT.RETRY;
						break;
					
					case this._btnIgnore:
						response = JSWT.IGNORE;
						break;
					
					default:
					case this._btnCancel:
						response = JSWT.CANCEL;
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
	},

	toString : function() {
		return "[gara.jswt.MessageBox]";
	}
});	