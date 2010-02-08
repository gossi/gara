/*	$Id: IframeDialog.class.js 182 2009-08-02 22:34:06Z tgossmann $

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

gara.provide("gara.jswt.widgets.IframeDialog");

gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.DialogManager");

gara.require("gara.jswt.widgets.Dialog");

/**
 * @class MessageBox
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Dialog
 * @namespace gara.jswt.widgets
 */
gara.Class("gara.jswt.widgets.IframeDialog", {
	$extends : gara.jswt.widgets.Dialog,

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

		this._composite;
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
	_createContents : function(parent, src) {
		// css
		this.addClass("jsWTIframeDialog");

		this._composite = parent;
		this._overlay = document.createElement("div");
		this._overlay.style.position = "absolute";
		this._overlay.style.left = "0";
		this._overlay.style.right = "0";
		this._overlay.style.top = "0";
		this._overlay.style.bottom = "0";

		this._iframe = document.createElement("iframe");
		this._iframe.src = src;
		this._iframe.style.width = "100%";
		this._iframe.style.height = "100%";
		parent.handle.appendChild(this._iframe);

		if ((this._style & gara.jswt.JSWT.ICON_WORKING) == gara.jswt.JSWT.ICON_WORKING) {
			this._overlay.className = "loading";
			this._showOverlay();
		}

		this.handle.style.width = this._width + "px";
		parent.handle.style.height = this._height + "px";
		parent.handle.style.position = "relative";

		gara.EventManager.addListener(this._iframe, "load", this);

		this._dialogBarTitle.appendChild(document.createTextNode(this._title));
		this._dialogBarTitle.style.width = (this._width - 40) + "px";

		// position
		var left = this._getViewportWidth() / 2 - this.handle.clientWidth/2;
		var top = this._getViewportHeight() / 2 - this.handle.clientHeight/2;

		this.handle.style.left = left + "px";
		this.handle.style.top = top + "px";
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
//				var iWin = null;
//				try {
//					iWin = this._iframe.contentWindow; // W3C
//				} catch (e) {
//					try {
//						iWin = this._iframe.document; // IE (6?)
//					} catch (e) {}
//				}
//
//				if (iWin != null) {
//					try {
//						this.setText(iWin.title);
//					} catch(e) {}
//				}

				if ((this._style & gara.jswt.JSWT.ICON_WORKING) == gara.jswt.JSWT.ICON_WORKING) {
					this._overlay.className = "";
					this._hideOverlay();
				}
				break;

			case "mousedown":
				this._parentWindow.gara.jswt.widgets.DialogManager.getInstance().activate(this);
				if (e.target == this._dialogBar ||
					e.target == this._dialogBarTitle ||
					e.target == this._dialogBarButtons) {

					this._parentWindow.gara.jswt.widgets.DialogManager.getInstance().getDialogs().forEach(function(diag, index, arr) {
						if (gara.typeOf(diag) == "gara.jswt.widgets.IframeDialog") {
							diag._showOverlay();
						}
					}, this);
				}
				break;

			case "mouseup":
				this._parentWindow.gara.jswt.widgets.DialogManager.getInstance().getDialogs().forEach(function(diag, index, arr) {
					if (gara.typeOf(diag) == "gara.jswt.widgets.IframeDialog") {
						diag._hideOverlay();
					}
				}, this);
				break;
		}
	},

	_hideOverlay : function() {
		this._composite.handle.removeChild(this._overlay);
	},

	open: function(src) {
		this._createContents(this._create(), src);
	},

	_showOverlay : function() {
		this._composite.handle.appendChild(this._overlay);
	},

	setHeight : function(height) {
		this._height = height;
	},

	setTitle : function(title) {
		this._title = title;
	},

	setWidth : function(width) {
		this._width = width;
	}
});