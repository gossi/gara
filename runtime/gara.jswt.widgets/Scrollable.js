gara.provide("gara.jswt.widgets.Scrollable");gara.parent("gara.jswt.widgets.Control",function(){gara.Class("gara.jswt.widgets.Scrollable",{$extends:gara.jswt.widgets.Control,$constructor:function(a,b){this.$super(a,b)},getClientArea:function(){return this.scrolledHandle()},getHorizontalScrollbar:function(){return this.scrolledHandle().clientWidth<this.scrolledHandle().scrollWidth&&this.scrolledHandle().style.overflowX!="hidden"},getVerticalScrollbar:function(){return this.scrolledHandle().clientHeight<this.scrolledHandle().scrollHeight&&this.scrolledHandle().style.overflowY!="hidden"},handleEvent:function(a){this.$super(a)},scrolledHandle:function(){return this.handle}})});