gara.provide("gara.jsface.viewers.ContentViewer");gara.require("gara.jsface.viewers.Viewer");gara.require("gara.jsface.viewers.IContentProvider");gara.require("gara.jsface.viewers.IBaseLabelProvider");$package("gara.jsface.viewers");$class("ContentViewer",{$extends:gara.jsface.viewers.Viewer,$constructor:function(){this._input=null;this._contentProvider=null;this._labelProvider=null},getContentProvider:function(){return this._contentProvider},getInput:function(){return this._input},getLabelProvider:function(){return this._labelProvider},inputChanged:$abstract(function(){}),setContentProvider:function(a){if(!$class.instanceOf(a,gara.jsface.viewers.IContentProvider)){throw new TypeError("contentProvider is not type of gara.jsface.viewers.IContentProvider");}this._contentProvider=a},setInput:function(a){var b=this.getInput();this._contentProvider.inputChanged(this,b,a);this._input=a;this.inputChanged(this._input,b)},setLabelProvider:function(a){if(!$class.instanceOf(a,gara.jsface.viewers.IBaseLabelProvider)){throw new TypeError("labelProvider is not type of gara.jsface.viewers.IBaseLabelProvider");}this._labelProvider=a}});$package("");