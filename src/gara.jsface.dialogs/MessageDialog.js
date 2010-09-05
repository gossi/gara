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

gara.provide("gara.jsface.dialogs.MessageDialog", "gara.jsface.dialogs.Dialog");

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
gara.Class("gara.jsface.dialogs.MessageDialog", function() { return {
	$extends : gara.jsface.dialogs.Dialog,

	NONE : gara.$static(0),
	ERROR : gara.$static(1),
	INFORMATION : gara.$static(2),
	QUESTION : gara.$static(3),
	WARNING : gara.$static(4),
	CONFIRM : gara.$static(5),
	QUESTION_WITH_CANCEL  : gara.$static(6),
	
	/**
	 * @constructor
	 * 
	 * @param {gara.jswt.widgets.Shell} parentShell
	 * @param {String} dialogTitle
	 * @param {Image} dialogTitleImage
	 * @param {String} dialogMessage
	 * @param {int} dialogImageType
	 * @param {String[]} dialogButtonLabels
	 * @param {int} defaultIndex
	 */
	$constructor : function (parentShell, dialogTitle,
            dialogTitleImage, dialogMessage, dialogImageType,
            dialogButtonLabels, defaultIndex) {
	
		this.$super(parentShell || undefined);
	    this.title = dialogTitle || "";
	    this.titleImage = dialogTitleImage || null;
	    this.message = dialogMessage || "";
	    this.image = null;
	
	    switch (dialogImageType) {
	    case gara.jsface.dialogs.MessageDialog.ERROR:
	        this.image = "jsWTIconError";
	        break;

	    case gara.jsface.dialogs.MessageDialog.INFORMATION:
	        this.image = "jsWTIconInformation";
	        break;

	    case gara.jsface.dialogs.MessageDialog.QUESTION:
	    case gara.jsface.dialogs.MessageDialog.QUESTION_WITH_CANCEL:
	    case gara.jsface.dialogs.MessageDialog.CONFIRM:
	        this.image = "jsWTIconQuestion";
	        break;
	        
	    case gara.jsface.dialogs.MessageDialog.WARNING:
	        this.image = "jsWTIconWarning";
	        break;
	    
	    }
	    this.buttonLabels = dialogButtonLabels;
	    this.defaultButtonIndex = defaultIndex;
	},
	
	buttonPressed : function (buttonId) {
        this.setReturnValue(buttonId);
        this.close();
    },

    configureShell : function (shell) {
        this.$super(shell);
        shell.addClass("jsWTMessageDialog");
        if (this.title !== null) {
			shell.setText(this.title);
		}
        if (this.titleImage !== null) {
			shell.setImage(this.titleImage);
		}
    },
    
    createButtonsForButtonBar : function (parent) {
        var i, buttons = [], label, len = this.buttonLabels.length;
        for (i = 0; i < len; i++) {
            this.buttons[i] = this.createButton(parent, i, this.buttonLabels[i], this.defaultButtonIndex === i);
        }
    },
    
	/**
	 * Creates and returns the contents of an area of the dialog which appears
	 * below the message and above the button bar.
	 * <p>
	 * The default implementation of this framework method returns
	 * <code>null</code>. Subclasses may override.
	 * </p>
	 * 
	 * @param {gara.jswt.widgets.Composite} parent
	 *            parent composite to contain the custom area
	 * @return {gara.jswt.widgets.Control} the custom area control, or <code>null</code>
	 */
	createCustomArea : function (parent) {
	    return null;
	},
    
	/**
	 * @method
	 * This implementation of the <code>Dialog</code> framework method creates
	 * and lays out a composite and calls <code>createMessageArea</code> and
	 * <code>createCustomArea</code> to populate it. Subclasses should
	 * override <code>createCustomArea</code> to add contents below the
	 * message.
	 * 
	 * @param {gara.jswt.widgets.Composite} parent
	 *            parent composite to contain the dialog area
	 */
	createDialogArea : function (parent) {
		// create the top level composite for the dialog area
		var composite = new gara.jswt.widgets.Composite(parent).addClass("jsWTDialogArea");
		// create message area
		this.createMessageArea(composite);
		// allow subclasses to add custom controls
		this.customArea = this.createCustomArea(composite);
		// If it is null create a dummy label for spacing purposes
		return composite;
	},
	
	/**
	 * @method
	 * Create the area the message will be shown in.
	 * <p>
	 * The parent composite is assumed to use GridLayout as its layout manager,
	 * since the parent is typically the composite created in
	 * {@link Dialog#createDialogArea}.
	 * </p>
	 * <p>
	 * <strong>Note:</strong> Clients are expected to call this method, otherwise
	 * neither the icon nor the message will appear.
	 * </p>
	 * 
	 * @param composite
	 *            The composite to parent from.
	 * @return Control
	 */
	createMessageArea : function (composite) {
		// create composite
		// create image
		if (this.image !== null) {
			new gara.jswt.widgets.Label(composite).addClass(this.image);
		}
		// create message
		if (this.message !== null) {
			new gara.jswt.widgets.Label(composite).setText(this.message);
		}
		return composite;
	},
    
	/**
	 * @method
	 * Gets a button in this dialog's button bar.
	 * 
	 * @param {int} index
	 *            the index of the button in the dialog's button bar
	 * @return {gara.jswt.widgets.Button} a button in the dialog's button bar, or <code>null</code> if there's no button with that index
	 */
	getButton : function (index) {
    	if (this.buttons === null || index < 0 || index >= this.buttons.length)
    		return null;
    	return this.buttons[index];
	},


	/**
	 * @method
	 * An accessor for the labels to use on the buttons.
	 * 
	 * @return The button labels to used; never <code>null</code>.
	 */
	getButtonLabels : function () {
    	return this.buttonLabels;
	},
	
    getButtonLabels : gara.$static(function (kind) {
		var dialogButtonLabels = [];
		switch (kind) {
		case gara.jsface.dialogs.MessageDialog.ERROR:
		case gara.jsface.dialogs.MessageDialog.INFORMATION:
		case gara.jsface.dialogs.MessageDialog.WARNING:
			dialogButtonLabels = [gara.l10n("gara.ok")];
			break;
		
		case gara.jsface.dialogs.MessageDialog.CONFIRM: 
			dialogButtonLabels = [gara.l10n("gara.ok"), gara.l10n("gara.cancel")];
			break;
		
		case gara.jsface.dialogs.MessageDialog.QUESTION: 
			dialogButtonLabels = [gara.l10n("gara.yes"), gara.l10n("gara.no")];
			break;
		
		case gara.jsface.dialogs.MessageDialog.QUESTION_WITH_CANCEL:
			dialogButtonLabels = [gara.l10n("gara.yes"), gara.l10n("gara.no"), gara.l10n("gara.cancel")];
			break;
		}
		return dialogButtonLabels;
	}),

	
	/**
	 * @method
	 * An accessor for the index of the default button in the button array.
	 * 
	 * @return The default button index.
	 */
	getDefaultButtonIndex : function () {
		return this.defaultButtonIndex;
	},
   
	open : gara.$static(function (kind, parent, title, message, callback, context) {
		var dialog = new gara.jsface.dialogs.MessageDialog(parent, title, null, message,
				kind, gara.jsface.dialogs.MessageDialog.getButtonLabels(kind), 0);
		
		dialog.open(callback, context);
		return dialog;
	}),

	/**
	 * @method
	 * Convenience method to open a simple confirm (OK/Cancel) dialog.
	 * 
	 * @param parent
	 *            the parent shell of the dialog, or <code>null</code> if none
	 * @param title
	 *            the dialog's title, or <code>null</code> if none
	 * @param message
	 *            the message
	 * @return {gara.jsface.dialogs.MessageDialog} the dialog
	 */
    openConfirm : gara.$static(function (parent, title, message, callback, context) {
    	return gara.jsface.dialogs.MessageDialog.open(gara.jsface.dialogs.MessageDialog.CONFIRM, parent, title, message, callback, context);
	}),

	/**
	 * @method
	 * Convenience method to open a standard error dialog.
	 * 
	 * @param parent
	 *            the parent shell of the dialog, or <code>null</code> if none
	 * @param title
	 *            the dialog's title, or <code>null</code> if none
	 * @param message
	 *            the message
	 */
	openError : gara.$static(function (parent, title, message, callback, context) {
		return gara.jsface.dialogs.MessageDialog.open(gara.jsface.dialogs.MessageDialog.ERROR, parent, title, message, callback, context);
	}),

	/**
	 * @method
	 * Convenience method to open a standard information dialog.
	 * 
	 * @param parent
	 *            the parent shell of the dialog, or <code>null</code> if none
	 * @param title
	 *            the dialog's title, or <code>null</code> if none
	 * @param message
	 *            the message
	 */
	openInformation : gara.$static(function (parent, title, message, callback, context) {
		return gara.jsface.dialogs.MessageDialog.open(gara.jsface.dialogs.MessageDialog.INFORMATION, parent, title, message, callback, context);
	}),

	/**
	 * @method
	 * Convenience method to open a simple Yes/No question dialog.
	 * 
	 * @param parent
	 *            the parent shell of the dialog, or <code>null</code> if none
	 * @param title
	 *            the dialog's title, or <code>null</code> if none
	 * @param message
	 *            the message
	 * @return <code>true</code> if the user presses the Yes button,
	 *         <code>false</code> otherwise
	 */
	openQuestion : gara.$static(function (parent, title, message, callback, context) {
		return gara.jsface.dialogs.MessageDialog.open(gara.jsface.dialogs.MessageDialog.QUESTION, parent, title, message, callback, context);
	}),

	/**
	 * @method
	 * Convenience method to open a standard warning dialog.
	 * 
	 * @param parent
	 *            the parent shell of the dialog, or <code>null</code> if none
	 * @param title
	 *            the dialog's title, or <code>null</code> if none
	 * @param message
	 *            the message
	 */
	openWarning : gara.$static(function (parent, title, message, callback, context) {
		return gara.jsface.dialogs.MessageDialog.open(gara.jsface.dialogs.MessageDialog.WARNING, parent, title, message, callback, context);
	}),

	/**
	 * A mutator for the array of buttons in the button bar.
	 * 
	 * @param buttons
	 *            The buttons in the button bar; must not be <code>null</code>.
	 */
	setButtons : function (buttons) {
	    this.buttons = buttons;
	},

	/**
	 * A mutator for the button labels.
	 * 
	 * @param buttonLabels
	 *            The button labels to use; must not be <code>null</code>.
	 */
	setButtonLabels : function (buttonLabels) {
		this.buttonLabels = buttonLabels;
	}
};});