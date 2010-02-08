/*	$Id: Dialog.class.js 182 2009-08-02 22:34:06Z tgossmann $

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

gara.provide("gara.jswt.widgets.Dialog");

gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.Composite");

gara.require("gara.jswt.widgets.Widget");
gara.require("gara.jswt.widgets.DialogManager");


/**
 * @class Dialog
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 */
gara.Class("gara.jswt.widgets.Dialog", {
	$extends: gara.jswt.widgets.Widget,

	/**
	 * @constructor
	 */
	$constructor : function(parentWindow, style) {
		if (typeof(style) == "undefined") {
			style = parentWindow;
			this._parentWindow = window.top;
		} else {
			this._parentWindow = parentWindow;
		}

		this.$base(this._parentWindow.document.getElementsByTagName("body")[0], style);

		this._disposed = false;
		this._text = " ";

		this.handle = null;
		this._modalLayer = null;
		this._dialogBar;
		this._dialogBarLeft;
		this._dialogBarText;
		this._dialogBarButtons;
		this._dialogContent;
		this._barCancelButton;

		this._dX;
		this._dY;

		this._tabIndexes = [];
		this._tabIndexElements = [];
		this._tabbableTags = ["A","BUTTON","TEXTAREA","INPUT","IFRAME","DIV","UL","SPAN"];

		this._parentWindow.gara.jswt.widgets.DialogManager.getInstance().addDialog(this);

		// css
		this.addClass("jsWTDialog");
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
		if ((this._style & gara.jswt.JSWT.APPLICATION_MODAL) == gara.jswt.JSWT.APPLICATION_MODAL) {
			this._disableTabIndexes();
			var modalLayer;
			if (modalLayer = this._parentWindow.document.getElementById("jsWTModalLayer")) {
				modalLayer.style.display = "block";
			} else {
				modalLayer = this._parentWindow.document.createElement("div");
				modalLayer.id = "jsWTModalLayer";
				this._parent.appendChild(modalLayer);
			}

//			modalLayer.style.width = this._getViewportWidth() + "px";
//			modalLayer.style.height = this._getViewportHeight() + "px";
			modalLayer.style.position = "absolute";
			modalLayer.style.top = "0";
			modalLayer.style.bottom = "0";
			modalLayer.style.left = "0";
			modalLayer.style.right = "0";

			this.addClass("jsWTDialogModal");
		}

		this.handle = document.createElement("div");
		this.handle.className = this._classes.join(" ");
		this.handle.widget = this;
		this.handle.id = this.getId();
		this.handle.role = "dialog";

		base2.DOM.Event(this.handle);
		this.handle.setAttribute("aria-labelledby", this.getId() + "-label");

		// dialog bar
		this._dialogBar = document.createElement("div");
		this._dialogBar.className = "jsWTDialogBar";

		this._dialogBarLeft = document.createElement("div");
		this._dialogBarLeft.className = "jsWTDialogBarLeft";

		this._dialogBarTitle = document.createElement("div");
		this._dialogBarTitle.className = "jsWTDialogBarText";
		this._dialogBarTitle.id = this.getId() + "-label";

		this._dialogBarText = document.createTextNode(this._text);

		this._dialogBarButtons = document.createElement("div");
		this._dialogBarButtons.className = "jsWTDialogBarButtons";

		var clearer = document.createElement("div");
		clearer.className = "jsWTDialogBarClearer";

		this._barCancelButton = document.createElement("span");
		this._barCancelButton.className = "jsWTDialogCancelButton";

		this.handle.appendChild(this._dialogBar);
		this._dialogBar.appendChild(this._dialogBarLeft);
		this._dialogBar.appendChild(this._dialogBarTitle);
		this._dialogBar.appendChild(this._dialogBarButtons);
		this._dialogBarTitle.appendChild(this._dialogBarText);
		this._dialogBarButtons.appendChild(this._barCancelButton);
		this._dialogBar.appendChild(clearer);

		// content
		this._dialogContent = new gara.jswt.widgets.Composite(this.handle).addClass("jsWTDialogContent");

		// append to DOM and DiagMng
		this._parentWindow.gara.EventManager.addListener(this.handle, "mousedown", this);
		this._parentWindow.gara.EventManager.addListener(this._barCancelButton, "mousedown", this);

		this._parent.appendChild(this.handle);
		this._parentWindow.gara.jswt.widgets.DialogManager.getInstance().activate(this);

		return this._dialogContent;
	},

	/**
	 * @method
	 * Disable tab indexes when dialog is opened
	 *
	 * Code below taken from subModal {@link http://gabrito.com/files/subModal/}
	 *
	 * @private
	 */
	_disableTabIndexes : function() {
		var i = 0;
		for (var j = 0; j < this._tabbableTags.length; j++) {
			var tagElements = this._parentWindow.document.getElementsByTagName(this._tabbableTags[j]);
			for (var k = 0 ; k < tagElements.length; k++) {
				this._tabIndexes[i] = tagElements[k].tabIndex;
				this._tabIndexElements[i] = tagElements[k];
				tagElements[k].tabIndex = "-1";
				i++;
			}
		}
	},

	/**
	 * @method
	 * Deletes and destroys the dialog
	 *
	 *  @private
	 *  @author Thomas Gossmann
	 *  @return {void}
	 */
	dispose : function() {
		this.$base();
		this._parentWindow.gara.EventManager.removeListener(this.handle, "mousedown", this);
		this._parentWindow.gara.EventManager.removeListener(this._barCancelButton, "mousedown", this);
		this._parentWindow.gara.EventManager.removeListener(window, "resize", this);

		this._parentWindow.gara.jswt.widgets.DialogManager.getInstance().removeDialog(this);
		this.handle.widget = null;
		this._parent.removeChild(this.handle);

		if ((this._style & gara.jswt.JSWT.APPLICATION_MODAL) == gara.jswt.JSWT.APPLICATION_MODAL) {
			this._parentWindow.document.getElementById("jsWTModalLayer").style.display = "none";
		}

		this._disposed = true;

		if ((this._style & gara.jswt.JSWT.APPLICATION_MODAL) == gara.jswt.JSWT.APPLICATION_MODAL) {
			this._restoreTabIndexes();
		}
	},

	/**
	 * @method
	 * Returns the title text from the Dialog
	 *
	 * @return {String} the title
	 * @author Thomas Gossmann
	 */
	getText : function() {
		return this._text;
	},

	getStyle : function() {
		return this._style;
	},

	/**
	 * @method
	 * Gets height of the viewport
	 *
	 * Code below taken from - http://www.evolt.org/article/document_body_doctype_switching_and_more/17/30655/
	 * Modified 4/22/04 to work with Opera/Moz (by webmaster at subimage dot com)
	 * Gets the full width/height because it's different for most browsers.
	 *
	 * Found on {@link http://gabrito.com/files/subModal/}
	 *
	 * @private
	 * @return {int} viewport height
	 */
	_getViewportHeight : function() {
		if (this._parentWindow.innerHeight!=window.undefined) return this._parentWindow.innerHeight;
		if (this._parentWindow.document.compatMode=='CSS1Compat') return this._parentWindow.document.documentElement.clientHeight;
		if (this._parentWindow.document.body) return this._parentWindow.document.body.clientHeight;
		return window.undefined;
	},

	/**
	 * @method
	 * Gets width of the viewport
	 *
	 * Code below taken from - http://www.evolt.org/article/document_body_doctype_switching_and_more/17/30655/
	 * Modified 4/22/04 to work with Opera/Moz (by webmaster at subimage dot com)
	 * Gets the full width/height because it's different for most browsers.
	 *
	 * Found on {@link http://gabrito.com/files/subModal/}
	 *
	 * @private
	 * @return {int} viewport width
	 */
	_getViewportWidth : function() {
		if (this._parentWindow.innerWidth!=window.undefined) return this._parentWindow.innerWidth;
		if (this._parentWindow.document.compatMode=='CSS1Compat') return this._parentWindow.document.documentElement.clientWidth;
		if (this._parentWindow.document.body) return this._parentWindow.document.body.clientWidth;
		return window.undefined;
	},

	/**
	 * @method
	 * Handling events on the dialog widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} e
	 * @return {void}
	 */
	handleEvent : function(e) {
		switch(e.type) {
			case "mousedown":
				this._parentWindow.gara.jswt.widgets.DialogManager.getInstance().activate(this);
				if (e.target == this._barCancelButton) {
					this.dispose();
				} else if (e.target == this._dialogBar
						|| e.target == this._dialogBarTitle
						|| e.target == this._dialogBarButtons){
					this._parentWindow.gara.EventManager.addListener(this._parentWindow.document, "mousemove", this);
					this._parentWindow.gara.EventManager.addListener(this._dialogBar, "mouseup", this);
					this._dX = e.clientX - this.handle.offsetLeft;
					this._dY = e.clientY - this.handle.offsetTop;
				}
				break;

			case "mouseup":
				this._parentWindow.gara.EventManager.removeListener(this._parentWindow.document, "mousemove", this);
				this._parentWindow.gara.EventManager.removeListener(this._dialogBar, "mouseup", this);
				break;

			case "mousemove":
				this.handle.style.left = (e.clientX - this._dX) + "px";
				this.handle.style.top = (e.clientY - this._dY) + "px";
				break;

			case "resize":
//				if (modalLayer = this._parent.document.getElementById("jsWTModalLayer")) {
//					modalLayer.style.width = this._getViewportWidth() + "px";
//					modalLayer.style.height = this._getViewportHeight() + "px";
//				}
				break;
		}
	},

	isDisposed : function() {
		return this._disposed;
	},

	open : gara.abstract(function() {}),

	_registerListener : function() {},

	/**
	 * @method
	 * Restores tab indexes when dialog is closed
	 *
	 * Code below taken from subModal {@link http://gabrito.com/files/subModal/}
	 *
	 * @private
	 */
	_restoreTabIndexes : function() {
		for (var i = 0, len = this._tabIndexElements.length; i < len; ++i) {
			this._tabIndexElements[i].tabIndex = this._tabIndexes[i];
		}

		this._tabIndexes = [];
		this._tabIndexElements = [];
	},

	/**
	 * @method
	 * Set the title text
	 * @param {String} text the new title
	 * @return {void}
	 */
	setText : function(text) {
		this._text = text;
		if (this._dialogBarText) {
			this._dialogBarText.nodeValue = text;
		}
	},

	_unregisterListener : function() {}
});