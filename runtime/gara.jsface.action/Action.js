gara.provide("gara.jsface.action.Action");gara.require("gara.jsface.action.IAction");gara.require("gara.jsface.action.ActionChangedListener");$class("Action",{$implements:[gara.jsface.action.IAction],$constructor:function(){this._listeners=[]},addActionChangedListener:function(a){if(!$class.instanceOf(a,gara.jsface.action.ActionChangedListener)){throw new TypeError("listener not type of gara.jsface.action.ActionChangedListener");}if(!this._listeners.contains(a)){this._listeners.push(a)}},getText:$abstract(function(){}),getImage:$abstract(function(){}),getEnabled:$abstract(function(){}),notifyActionChangedListener:function(){this._listeners.forEach(function(a){a.actionChanged(this)},this)},removeActionChangedListener:function(a){if(!$class.instanceOf(a,gara.jsface.action.ActionChangedListener)){throw new TypeError("listener not type of gara.jsface.action.ActionChangedListener");}this._listeners.remove(a)},run:$abstract(function(){})});