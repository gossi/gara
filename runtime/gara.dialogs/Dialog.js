gara.provide("gara.dialogs.Dialog","gara.window.Window");gara.use("gara.widgets.Composite");gara.use("gara.widgets.Button");gara.Class("gara.dialogs.Dialog",function(){return{$extends:gara.window.Window,OK_ID:gara.$static(0),CANCEL_ID:gara.$static(1),$constructor:function(a){this.$super(a);this.buttons={};this.buttonBar=null;this.dialogArea=null},buttonPressed:function(a){if(a===gara.dialogs.Dialog.OK_ID){this.okPressed()}else if(a===gara.dialogs.Dialog.CANCEL_ID){this.cancelPressed()}},cancelPressed:function(){this.setReturnValue(gara.CANCEL);this.close()},configureShell:function(a){a.addClass("garaDialog")},close:function(){this.buttons={};this.buttonBar=null;this.dialogArea=null;this.$super()},createButton:function(b,e,f,g){var d,h=this,c=new gara.widgets.Button(b);c.setText(f);c.setData(e);c.addSelectionListener({widgetSelected:function(a){h.buttonPressed(a.widget.getData())}});if(g){d=b.getShell();if(d!==null){d.setDefaultButton(c)}}this.buttons[e]=c;return c},createButtonBar:function(a){var b=new gara.widgets.Composite(a).addClass("garaDialogButtonBar");this.createButtonsForButtonBar(b);return b},createButtonsForButtonBar:function(a){this.createButton(a,gara.dialogs.Dialog.OK_ID,gara.l10n("gara.ok"),true);this.createButton(a,gara.dialogs.Dialog.CANCEL_ID,gara.l10n("gara.cancel"),false)},createContents:function(a){var b=new gara.widgets.Composite(a);this.dialogArea=this.createDialogArea(b);this.buttonBar=this.createButtonBar(b);return b},createDialogArea:function(a){return new gara.widgets.Composite(a).addClass("garaDialogArea")},getButton:function(a){if(Object.prototype.hasOwnProperty.call(this.buttons,a)){return this.buttons[a]}return null},getButtonBar:function(){return this.buttonBar},getDialogArea:function(){return this.dialogArea},getInitialLocation:function(){return null},getInitialSize:function(){return{x:null,y:null}},okPressed:function(){this.setReturnValue(gara.OK);this.close()}}});