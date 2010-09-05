/*	$Id: InputDialog.class.js 182 2009-08-02 22:34:06Z tgossmann $

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

gara.provide("gara.jsface.dialogs.InputDialog", "gara.jsface.dialogs.Dialog");

gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.Composite");
gara.use("gara.jswt.widgets.Button");
gara.use("gara.jswt.widgets.Label");
gara.use("gara.jswt.widgets.Text");

/**
 * @class InputDialog
 * @extends gara.jsface.dialogs.Dialog
 * @namespace gara.jsface.dialogs
 */
gara.Class("gara.jsface.dialogs.InputDialog", function() { return {
	$extends : gara.jsface.dialogs.Dialog,

	/**
	 * @constructor
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
		if (buttonId === gara.jsface.dialogs.Dialog.OK_ID) {
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
		shell.addClass("jsWTInputDialog");
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
			new gara.jswt.widgets.Label(composite).setText(this.message);
		}
		this.text = new gara.jswt.widgets.Text(composite).setWidth(300);
		this.text.addKeyListener({
			keyPressed : function (e) {
				if (e.keyCode === gara.jswt.JSWT.ENTER) {
					self.buttonPressed(gara.jsface.dialogs.Dialog.OK_ID);
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