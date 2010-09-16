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

gara.provide("gara.jsface.dialogs.Dialog", "gara.jsface.window.Window");

gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.Composite");
gara.use("gara.jswt.widgets.Button");

/**
 * @class Dialog
 * @namespace gara.jsface.dialogs
 */
gara.Class("gara.jsface.dialogs.Dialog", function () { return {
	$extends: gara.jsface.window.Window,
	
	OK_ID : gara.$static(0),
	CANCEL_ID : gara.$static(1),
	

	/**
	 * @constructor
	 */
	$constructor : function(parentShell) {
		this.$super(parentShell);
		this.buttons = {};
		this.buttonBar = null;
		this.dialogArea = null;
	},
	
	buttonPressed : function (id) {
		if (id === gara.jsface.dialogs.Dialog.OK_ID) {
			this.okPressed();
		} else if (id === gara.jsface.dialogs.Dialog.CANCEL_ID) {
			this.cancelPressed();
		}
	},
	
	cancelPressed : function () {
		this.setReturnValue(gara.jswt.JSWT.CANCEL);
		this.close();
	},
	
	configureShell : function (shell) {
		shell.addClass("garaDialog");
	},
	
	close : function () {
		this.buttons = {};
		this.buttonBar = null;
		this.dialogArea = null;
		this.$super();
	},
	
	createButton : function (parent, id, label, defaultButton) {
		var shell, self = this,
		button = new gara.jswt.widgets.Button(parent);
		button.setText(label);
		button.setData(id);
		button.addSelectionListener({
			widgetSelected : function (e) {
				self.buttonPressed(e.widget.getData());
			}
		});
		
		if (defaultButton) {
			shell = parent.getShell();
			if (shell !== null) {
				shell.setDefaultButton(button);
			}
		}
		
		this.buttons[id] = button;
		return button;
	},

	createButtonBar : function (parent) {
		var composite = new gara.jswt.widgets.Composite(parent).addClass("garaDialogButtonBar");
		this.createButtonsForButtonBar(composite);
		return composite;
	},

	createButtonsForButtonBar : function (parent) {
		this.createButton(parent, gara.jsface.dialogs.Dialog.OK_ID, gara.l10n("gara.ok"), true);
		this.createButton(parent, gara.jsface.dialogs.Dialog.CANCEL_ID, gara.l10n("gara.cancel"), false);
	},

	createContents : function (parent) {
		var composite = new gara.jswt.widgets.Composite(parent);

		this.dialogArea = this.createDialogArea(composite);
		this.buttonBar = this.createButtonBar(composite);
		
		return composite;
	},

	createDialogArea : function (parent) {
		return new gara.jswt.widgets.Composite(parent).addClass("garaDialogArea");
	},
	
	getButton : function (id) {
		if (Object.prototype.hasOwnProperty.call(this.buttons, id)) {
			return this.buttons[id];
		}
		return null;
	},
	
	getButtonBar : function () {
		return this.buttonBar;
	},
	
	getDialogArea : function () {
		return this.dialogArea;
	},
	
	getInitialLocation : function () {
		return null;
	},
	
	getInitialSize : function () {
		return {x:null,y:null};
	},
	
	okPressed : function () {
		this.setReturnValue(gara.jswt.JSWT.OK);
		this.close();
	}
};});