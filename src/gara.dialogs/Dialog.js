/*

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://garathekit.org

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

"use strict";

gara.provide("gara.dialogs.Dialog", "gara.window.Window");

gara.use("gara.widgets.Composite");
gara.use("gara.widgets.Button");

/**
 * @class gara.dialogs.Dialog
 */
gara.Class("gara.dialogs.Dialog", function () { return /** @lends gara.dialogs.Dialog# */ {
	$extends: gara.window.Window,
	
	OK_ID : gara.$static(0),
	CANCEL_ID : gara.$static(1),
	

	/**
	 * @constructs
	 * @extends gara.window.Window
	 */
	$constructor : function(parentShell) {
		this.$super(parentShell);
		this.buttons = {};
		this.buttonBar = null;
		this.dialogArea = null;
	},
	
	buttonPressed : function (id) {
		if (id === gara.dialogs.Dialog.OK_ID) {
			this.okPressed();
		} else if (id === gara.dialogs.Dialog.CANCEL_ID) {
			this.cancelPressed();
		}
	},
	
	cancelPressed : function () {
		this.setReturnValue(gara.CANCEL);
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
	
//	create : function () {
//		this.$super();
//		this.shell.handle.style.left = "-5000px";
//		this.shell.handle.style.top = "-5000px";
//		console.log("diag.create");
//	},
	
	createButton : function (parent, id, label, defaultButton) {
		var shell, self = this,
		button = new gara.widgets.Button(parent);
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
		var composite = new gara.widgets.Composite(parent).addClass("garaDialogButtonBar");
		this.createButtonsForButtonBar(composite);
		return composite;
	},

	createButtonsForButtonBar : function (parent) {
		this.createButton(parent, gara.dialogs.Dialog.OK_ID, gara.l10n("gara.ok"), true);
		this.createButton(parent, gara.dialogs.Dialog.CANCEL_ID, gara.l10n("gara.cancel"), false);
	},

	createContents : function (parent) {
		console.log("dialog.createContents begin");
		var composite = new gara.widgets.Composite(parent);
		console.log("dialog.createContents composite done");
		
		
		this.dialogArea = this.createDialogArea(composite);
		console.log("dialog.createContents mid");
		this.buttonBar = this.createButtonBar(composite);
		
		console.log("dialog.createContents end");
		
		return composite;
	},

	createDialogArea : function (parent) {
		return new gara.widgets.Composite(parent).addClass("garaDialogArea");
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
		return null;
	},
	
//	open : function (callback, context) {
//		this.initializeBounds();
//		this.$super(callback, context);
//	},
	
	okPressed : function () {
		this.setReturnValue(gara.OK);
		this.close();
	}
};});