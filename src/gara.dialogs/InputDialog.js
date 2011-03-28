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
gara.provide("gara.dialogs.InputDialog", "gara.dialogs.Dialog");

gara.use("gara.widgets.Composite");
gara.use("gara.widgets.Button");
gara.use("gara.widgets.Label");
gara.use("gara.widgets.Text");

/**
 * @class gara.dialogs.InputDialog
 * @extends gara.dialogs.Dialog
 */
gara.Class("gara.dialogs.InputDialog", function() { return /** @lends gara.dialogs.InputDialog# */ {
	$extends : gara.dialogs.Dialog,

	/**
	 * @constructs
	 * @extends gara.dialogs.Dialog
	 */
	$constructor : function (parentShell, dialogTitle, dialogMessage, initialValue) {
		var self = this;
		this.$super(parentShell || undefined);
		this.title = dialogTitle || null;
		this.message = dialogMessage || null;
		this.value = initialValue || null;
		this.text = null;
		this.listener = {
			activate : function () {
				self.text.setFocus();
				self.text.selectAll();
			},
			focusGained : function () {
				this.activate();
			},
			mouseUp : function () {
				this.activate();
			}
		};
	},
	
	buttonPressed : function (buttonId) {
		if (buttonId === gara.dialogs.Dialog.OK_ID) {
			this.setReturnValue(true);
        	this.value = this.text.getText();
        } else {
        	this.setReturnValue(false);
        	this.value = null;
        }
        this.close();
    },

	configureShell : function (shell) {
		this.$super(shell);
		shell.addClass("garaInputDialog");
		if (this.title !== null) {
			shell.setText(this.title);
		}

		shell.addFocusListener(this.listener);
	},

    createDialogArea : function (parent) {
        // create composite
		var self = this, 
			composite = this.$super(parent);
		
		parent.addMouseListener(this.listener);
		
		if (this.message !== null) {
			new gara.widgets.Label(composite).setText(this.message);
		}
		this.text = new gara.widgets.Text(composite).setWidth(300);
		this.text.addKeyListener({
			keyPressed : function (e) {
				if (e.keyCode === gara.ENTER) {
					self.buttonPressed(gara.dialogs.Dialog.OK_ID);
				}
			}
		});
		if (this.value !== null) {
			this.text.setText(this.value);
		}

        return composite;
    },

	getValue : function() {
		return this.value;
	}
};});