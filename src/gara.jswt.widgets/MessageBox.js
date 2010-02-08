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
gara.use("gara.jswt.events.KeyListener");
gara.use("gara.jswt.events.SelectionListener");

gara.use("gara.jswt.widgets.Composite");
gara.use("gara.jswt.widgets.Button");
gara.use("gara.jswt.widgets.Label");

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
		this._callback = null;
		this._context = window;
		this._message = "";
		this._style |= gara.jswt.JSWT.APPLICATION_MODAL;

		this._msg;
		this._buttonBar;
		this._buttons = {};

		this.$base(parent, style);
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
	_createContents : function(parent) {
		// css
		this.addClass("jsWTMessageBox");

		this.handle.role = "alertdialog";
		this.handle.setAttribute("aria-describedby", this.getId()+"-message");

		// ICON_ERROR, ICON_INFORMATION, ICON_QUESTION, ICON_WARNING, ICON_WORKING
		var iconClass = "";
		var iconClasses = {
			"jsWTIconError" : gara.jswt.JSWT.ICON_ERROR,
			"jsWTIconInformation" : gara.jswt.JSWT.ICON_INFORMATION,
			"jsWTIconQuestion" : gara.jswt.JSWT.ICON_QUESTION,
			"jsWTIconWarning" : gara.jswt.JSWT.ICON_WARNING,
			"jsWTIconWorking" : gara.jswt.JSWT.ICON_WORKING
		};
		for (var className in iconClasses) {
			var flag = iconClasses[className];
			if ((this._style & flag) == flag) {
				iconClass = className;
			}
		}

		// message
		this._msg = new gara.jswt.widgets.Label(parent).setText(this._message)
			.addClasses(["jsWTMessageBoxContentText", iconClass]);

		// buttons
		var self = this;
		var buttonHandler = new gara.Class({
			$implements : [gara.jswt.events.SelectionListener, gara.jswt.events.KeyListener],
			keyPressed : function(e) {
				if (e.keyCode == gara.jswt.JSWT.ESC) {
					self.dispose();
					if (self._callback != null) {
						self._callback.call(self._context, gara.jswt.JSWT.CANCEL);
					}
				}
			},
			keyReleased : function(e) {},
			widgetSelected : function(e) {
				self.dispose();
				if (self._callback != null) {
					self._callback.call(self._context, e.widget.id);
				}
			}
		});

		this._buttonBar = new gara.jswt.widgets.Composite(parent).addClass("jsWTMessageBoxButtonBar");
		var buttons = {
			"gara.ok" : gara.jswt.JSWT.OK,
			"gara.yes" : gara.jswt.JSWT.YES,
			"gara.no" : gara.jswt.JSWT.NO,
			"gara.abort" : gara.jswt.JSWT.ABORT,
			"gara.retry" : gara.jswt.JSWT.RETRY,
			"gara.ignore" : gara.jswt.JSWT.IGNORE,
			"gara.cancel" : gara.jswt.JSWT.CANCEL
		};

		var focused = false;
		for (var button in buttons) {
			var buttonId = buttons[button];
			if ((this._style & buttonId) == buttonId) {
				this._buttons[buttonId] = new gara.jswt.widgets.Button(this._buttonBar).setText(gara.i18n.get(button));
				this._buttons[buttonId].id = buttonId;
				this._buttons[buttonId].addSelectionListener(buttonHandler);
				this._buttons[buttonId].addKeyListener(buttonHandler);
				if (!focused) {
					this._buttons[buttonId].forceFocus();
					focused = true;
				}
			}
		}

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
	},

	open: function(callback, context){
		this._createContents(this._create());
		this._callback = callback || null;
		this._context = context || window;
	},

	setMessage : function(message) {
		this._message = message;
	}
});