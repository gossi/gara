gara.provide("gara.viewers.ListViewer","gara.viewers.AbstractListViewer");gara.use("gara.widgets.List");gara.use("gara.widgets.ListItem");gara.Class("gara.viewers.ListViewer",function(){return{$extends:gara.viewers.AbstractListViewer,$constructor:function(a,c){if(a instanceof gara.widgets.List){this.list=a}else{this.list=new gara.widgets.List(a,c)}this.hookControl(this.list)},createListItem:function(a,c,d){var b=new gara.widgets.ListItem(this.list,c,d);b.setText(this.getLabelProviderText(this.getLabelProvider(),a));if(this.getLabelProvider().getImage){b.setImage(this.getLabelProvider().getImage(a))}b.setData(a);return b},doGetSelection:function(){return this.list.getSelection()},getControl:function(){return this.list},getList:function(){return this.list},listRemoveAll:function(){this.list.removeAll()}}});