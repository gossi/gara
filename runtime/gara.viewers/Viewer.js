gara.provide("gara.viewers.Viewer");gara.Class("gara.viewers.Viewer",{selectionChangedListeners:[],$constructor:function(){this.selectionChangedListeners=[]},addSelectionChangedListener:function(a){if(!this.selectionChangedListeners.contains(a)){this.selectionChangedListeners.push(a)}},fireSelectionChanged:function(b){this.selectionChangedListeners.forEach(function(a){if(a.selectionChanged){a.selectionChanged(b)}})},getControl:function(){},getInput:function(){},inputChange:function(a,b){},refresh:function(){},removeSelectionChangedListener:function(a){this.selectionChangedListeners.remove(a)},setInput:function(a){}});