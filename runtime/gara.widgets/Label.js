gara.provide("gara.widgets.Label","gara.widgets.Control");gara.Class("gara.widgets.Label",function(){return{$extends:gara.widgets.Control,imgNode:null,txtNode:null,image:null,text:"",$constructor:function(a,b){this.imgNode=null;this.txtNode=null;this.image=null;this.text="";this.$super(a,b||0)},bindListener:function(a,b){gara.addEventListener(this.handle,a,b)},createWidget:function(){this.createHandle("span");this.handle.tabIndex=-1;this.addClass("garaLabel");this.imgNode=document.createElement("img");this.imgNode.widget=this;this.imgNode.control=this;this.imgNode.style.display="none";this.handle.appendChild(this.imgNode);this.txtNode=document.createTextNode(this.text);this.handle.appendChild(this.txtNode)},destroyWidget:function(){this.imgNode=null;this.txtNode=null;this.image=null;this.text=null},getImage:function(){return this.image},getText:function(){return this.text},setImage:function(a){this.image=a;if(a){this.imgNode.src=a.src;this.imgNode.style.display=""}else{this.imgNode.style.display="none"}return this},setText:function(a){this.text=a;this.txtNode.nodeValue=a;return this},unbindListener:function(a,b){gara.removeEventListener(this.handle,a,b)},update:function(){}}});