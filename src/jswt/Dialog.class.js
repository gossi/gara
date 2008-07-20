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
 * @class Dialog
 * @author Thomas Gossmann
 * @namespace gara.jswt
 */
$class("Dialog", {

	/**
	 * @constructor
	 */
	$constructor : function(style) {
		this._style = style;
		this._text;
		
		this.domref = null;
		this._parent;
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
		this._tabbableTags = ["A","BUTTON","TEXTAREA","INPUT","IFRAME"]; 

		gara.jswt.DialogManager.getInstance().addDialog(this);
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
		if ((this._style & JSWT.APPLICATION_MODAL) == JSWT.APPLICATION_MODAL) {
			this._disableTabIndexes();
			var modalLayer;
			if (modalLayer = document.getElementById("jsWTModalLayer")) {
				modalLayer.style.display = "block";
			} else {
				modalLayer = document.createElement("div");
				modalLayer.id = "jsWTModalLayer";
				document.getElementsByTagName("body")[0].appendChild(modalLayer);
			}

			modalLayer.style.width = this._getViewportWidth() + "px";
			modalLayer.style.height = this._getViewportHeight() + "px";
		}

		this._parent = document.getElementsByTagName("body")[0];

		this.domref = document.createElement("div");
		this.domref.className = "jsWTDialog";
		this.domref.obj = this;
		
		this._dialogBar = document.createElement("div");
		this._dialogBar.className = "jsWTDialogBar";
		
		this._dialogContent = document.createElement("div");
		this._dialogContent.className = "jsWTDialogContent";
		
		this._dialogBarLeft = document.createElement("div");
		this._dialogBarLeft.className = "jsWTDialogBarLeft";

		this._dialogBarText = document.createElement("div");
		this._dialogBarText.className = "jsWTDialogBarText";

		this._dialogBarButtons = document.createElement("div");
		this._dialogBarButtons.className = "jsWTDialogBarButtons";

		var clearer = document.createElement("div");
		clearer.className = "jsWTDialogBarClearer";

		this._barCancelButton = document.createElement("span");
		this._barCancelButton.className = "jsWTDialogCancelButton";

		this._dialogContent = document.createElement("div");
		this._dialogContent.className = "jsWTDialogContent";

		this.domref.appendChild(this._dialogBar);
		this.domref.appendChild(this._dialogContent);

		this._dialogBar.appendChild(this._dialogBarLeft);
		this._dialogBar.appendChild(this._dialogBarText);
		this._dialogBar.appendChild(this._dialogBarButtons);
		this._dialogBarText.appendChild(document.createTextNode(this._text));
		this._dialogBarButtons.appendChild(this._barCancelButton);
		this._dialogBar.appendChild(clearer);
		
		base2.DOM.EventTarget(this.domref);
		base2.DOM.EventTarget(this._dialogBar);
		base2.DOM.EventTarget(this._barCancelButton);
		
		gara.EventManager.addListener(this.domref, "mousedown", this);
		gara.EventManager.addListener(this._barCancelButton, "mousedown", this);
		
		this._parent.appendChild(this.domref);
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
		if (document.all) {
			var i = 0;
			for (var j = 0; j < this._tabbableTags.length; j++) {
				var tagElements = document.getElementsByTagName(this._tabbableTags[j]);
				for (var k = 0 ; k < tagElements.length; k++) {
					this._tabIndexes[i] = tagElements[k].tabIndex;
					tagElements[k].tabIndex="-1";
					i++;
				}
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
		if ((this._style & JSWT.APPLICATION_MODAL) == JSWT.APPLICATION_MODAL) {
			this._restoreTabIndexes();
		}
		gara.jswt.DialogManager.getInstance().removeDialog(this);
		this.domref.obj = null;
		this._parent.removeChild(this.domref);
		
		if ((this._style & JSWT.APPLICATION_MODAL) == JSWT.APPLICATION_MODAL) {
			document.getElementById("jsWTModalLayer").style.display = "none";
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
		if (window.innerHeight!=window.undefined) return window.innerHeight;
		if (document.compatMode=='CSS1Compat') return document.documentElement.clientHeight;
		if (document.body) return document.body.clientHeight;
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
		if (window.innerWidth!=window.undefined) return window.innerWidth;
		if (document.compatMode=='CSS1Compat') return document.documentElement.clientWidth;
		if (document.body) return document.body.clientWidth;
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
				gara.jswt.DialogManager.getInstance().activate(this);
				if (e.target == this._barCancelButton) {
					this.dispose();
				} else if (e.target == this._dialogBar 
						|| e.target == this._dialogBarText
						|| e.target == this._dialogBarButtons){
					gara.EventManager.addListener(document, "mousemove", this);
					gara.EventManager.addListener(this._dialogBar, "mouseup", this);
					this._dX = e.clientX - this.domref.offsetLeft;
					this._dY = e.clientY - this.domref.offsetTop;
				}
				break;

			case "mouseup":
				gara.EventManager.removeListener(document, "mousemove", this);
				gara.EventManager.removeListener(this._dialogBar, "mouseup", this);
				break;

			case "mousemove":
				this.domref.style.left = (e.clientX - this._dX) + "px";
				this.domref.style.top = (e.clientY - this._dY) + "px";
				break;

			case "resize":
				if (modalLayer = document.getElementById("jsWTModalLayer")) {
					modalLayer.style.width = this._getViewportWidth() + "px";
					modalLayer.style.height = this._getViewportHeight() + "px";
				}
				break;
		}
	},

	/*open : $abstract(function() {}),*/
	open: function(){this._create()},

	/**
	 * @method
	 * Restores tab indexes when dialog is closed
	 * 
	 * Code below taken from subModal {@link http://gabrito.com/files/subModal/}
	 * 
	 * @private
	 */
	_restoreTabIndexes : function() {
		if (document.all) {
			var i = 0;
			for (var j = 0; j < this._tabbableTags.length; j++) {
				var tagElements = document.getElementsByTagName(this._tabbableTags[j]);
				for (var k = 0 ; k < tagElements.length; k++) {
					tagElements[k].tabIndex = this._tabIndexes[i];
					tagElements[k].tabEnabled = true;
					i++;
				}
			}
		}
	},

	/**
	 * @method
	 * Set the title text
	 * @param {String} text the new title
	 * @return {void}
	 */
	setText : function(text) {
		this._text = text;
	},

	toString : function() {
		return "[gara.jswt.Dialog]";
	}
});	