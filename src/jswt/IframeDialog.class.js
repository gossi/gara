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

/**
 * @class MessageBox
 * @author Thomas Gossmann
 * @extends gara.jswt.Dialog
 * @namespace gara.jswt
 */
$class("IframeDialog", {
	$extends : gara.jswt.Dialog,

	/**
	 * @constructor
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);

		this._width = 0;
		this._height = 0;
		this._title = "";
		this._iframe;
		this._overlay;
		this._iDoc = null;
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
	_create : function(src) {
		this.$base();

		this._overlay = document.createElement("div");
		this._overlay.style.position = "absolute";
		this._overlay.style.left = "0";
		this._overlay.style.right = "0";
		this._overlay.style.top = "0";
		this._overlay.style.bottom = "0";

		this.domref.className += " jsWTIframeDialog";
		this._iframe = document.createElement("iframe");
		this._iframe.src = src;
		this._iframe.style.width = "100%";
		this._iframe.style.height = "100%";
		this._dialogContent.appendChild(this._iframe);

		if ((this._style & gara.jswt.JSWT.ICON_WORKING) == gara.jswt.JSWT.ICON_WORKING) {
			this._overlay.className = "loading";
			this._showOverlay();
		}

		this.domref.style.width = this._width + "px";
		this._dialogContent.style.height = this._height + "px";
		this._dialogContent.style.position = "relative";

		base2.DOM.EventTarget(this._iframe);
		base2.DOM.EventTarget(this._dialogContent);

		gara.EventManager.addListener(this._iframe, "load", this);

		this._dialogBarText.appendChild(document.createTextNode(this._title));
		this._dialogBarText.style.width = (this._width - 40) + "px";

		// position
		var left = this._getViewportWidth() / 2 - this.domref.clientWidth/2;
		var top = this._getViewportHeight() / 2 - this.domref.clientHeight/2;

		this.domref.style.left = left + "px";
		this.domref.style.top = top + "px";
	},

	getHeight : function() {
		return this._height;
	},

	getTitle : function() {
		return this._title;
	},

	getWidth : function() {
		return this._width;
	},

	handleEvent : function(e) {
		this.$base(e);

		switch (e.type) {
			case "load":
				if (this._iDoc == null) {
					try {
						this._iDoc = this._iframe.contentDocument; // W3C
					} catch (e) {
						try {
							this._iDoc = this._iframe.document; // IE (6?)
						} catch (e) {}
					}
				}

				if (this._iDoc != null) {
					try {
						this._iDoc.obj = this;
						base2.DOM.EventTarget(this._iDoc);
						this._parentWindow.gara.EventManager.addListener(this._iDoc, "mousedown", this);
					} catch(e) {}
				}

				if ((this._style & gara.jswt.JSWT.ICON_WORKING) == gara.jswt.JSWT.ICON_WORKING) {
					this._overlay.className = "";
					this._hideOverlay();
				}
				break;

			case "mousedown":
				this._parentWindow.gara.jswt.DialogManager.getInstance().activate(this);
				if (e.target == this._dialogBar ||
					e.target == this._dialogBarText ||
					e.target == this._dialogBarButtons) {

					this._parentWindow.gara.jswt.DialogManager.getInstance().getDialogs().forEach(function(diag, index, arr) {
						if ($class.typeOf(diag) == "gara.jswt.IframeDialog") {
							diag._showOverlay();
						}
					}, this);
				}
				break;

			case "mouseup":
				this._parentWindow.gara.jswt.DialogManager.getInstance().getDialogs().forEach(function(diag, index, arr) {
					if ($class.typeOf(diag) == "gara.jswt.IframeDialog") {
						diag._hideOverlay();
					}
				}, this);
				break;
		}
	},

	_hideOverlay : function() {
		this._dialogContent.removeChild(this._overlay);
	},

	open: function(src) {
		this._create(src);
	},

	_showOverlay : function() {
		this._dialogContent.appendChild(this._overlay);
	},

	setHeight : function(height) {
		this._height = height;
	},

	setTitle : function(title) {
		this._title = title;
	},

	setWidth : function(width) {
		this._width = width;
	},

	toString : function() {
		return "[gara.jswt.IframeDialog]";
	}
});