gara.provide("gara.jswt.widgets.Label");gara.parent("gara.jswt.widgets.Control",function(){gara.Class("gara.jswt.widgets.Label",{$extends:gara.jswt.widgets.Control,imgNode:null,txtNode:null,image:null,text:"",$constructor:function(a,b){this.imgNode=null;this.txtNode=null;this.image=null;this.text="";this.$super(a,b||0)},bindListener:function(a,b){gara.EventManager.addListener(this.handle,a,b)},createWidget:function(){this.createHandle("span");this.handle.tabIndex=-1;this.addClass("jsWTLabel");this.imgNode=document.createElement("img");this.imgNode.widget=this;this.imgNode.control=this;this.imgNode.style.display="none";this.handle.appendChild(this.imgNode);this.txtNode=document.createTextNode(this.text);this.handle.appendChild(this.txtNode)},getImage:function(){return this.image},getText:function(){return this.text},setImage:function(a){this.image=a;if(a){this.imgNode.src=a.src;this.imgNode.style.display=""}else{this.imgNode.style.display="none"}return this},setText:function(a){this.text=a;this.txtNode.nodeValue=a;return this},unbindListener:function(a,b){gara.EventManager.removeListener(this.handle,a,b)},update:function(){}})});