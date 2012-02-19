gara.provide("gara.viewers.CheckboxListViewer","gara.viewers.ListViewer");gara.use("gara.viewers.CheckStateChangedEvent");gara.use("gara.widgets.List");gara.Class("gara.viewers.CheckboxListViewer",function(){return{$extends:gara.viewers.ListViewer,checkStateListener:[],$constructor:function(a){if(!(a instanceof gara.widgets.List)){throw new TypeError("list not instance of gara.widgets.List");}this.checkStateListener=[];this.$super(a)},newCheckList:gara.$static(function(a,b){var c=new gara.widgets.List(a,b|gara.CHECK);return new gara.viewers.CheckboxListViewer(c)}),fireCheckStateChanged:function(d){this.checkStateListener.forEach(function(a,b,c){if(a.checkStateChanged){a.checkStateChanged(d)}})},addCheckStateListener:function(a){if(!this.checkStateListener.contains(a)){this.checkStateListener.push(a)}},getChecked:function(a){var b=this.getItemFromElementMap(a);if(b!==null){return b.getChecked()}return null},getCheckedElements:function(){var d=this.list.getItems();var e=[];d.forEach(function(a,b,c){if(a.getChecked()){e.push(a.getData())}},this);return e},getGrayed:function(a){var b=this.getItemFromElementMap(a);if(b!==null){return b.getGrayed()}return null},getGrayedElements:function(){var d=this.list.getItems();var e=[];d.forEach(function(a,b,c){if(a.getGrayed()){e.push(a.getData())}},this);return e},handleSelect:function(a){this.$super(a);if(a.garaDetail&&a.garaDetail===gara.CHECK){var b=a.item;var c=b.getData();if(c!==null){this.fireCheckStateChanged(new gara.viewers.CheckStateChangedEvent(this,c,!b.getChecked()))}}},removeCheckStateListener:function(a){this.checkStateListener.remove(a)},setAllChecked:function(d){var e=this.list.getItems();e.forEach(function(a,b,c){a.setChecked(d)},this)},setAllGrayed:function(d){var e=this.list.getItems();e.forEach(function(a,b,c){a.setGrayed(d)},this)},setChecked:function(a,b){var c=this.getItemFromElementMap(a);if(c!==null){c.setChecked(b);return true}return false},setCheckedElements:function(f){var g=this.list.getItems();g.forEach(function(a,b,c){var d=a.getData();if(d!==null){var e=f.contains(d);if(a.getChecked()!==e){a.setChecked(e)}}})},setGrayed:function(a,b){var c=this.getItemFromElementMap(a);if(c!==null){c.setGrayed(b);return true}return false},setGrayedElements:function(f){var g=this.list.getItems();g.forEach(function(a,b,c){var d=a.getData();if(typeof(d)!=="undefined"&&d!==null){var e=f.contains(d);if(a.getGrayed()!==e){a.setGrayed(e)}}})}}});