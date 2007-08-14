if(!Array.prototype.contains){
Array.prototype.contains=function(_1){
return base2.Array2.contains(this,_1);
};
}
if(!Array.prototype.forEach){
Array.prototype.forEach=function(_2,_3){
return base2.Array2.forEach(this,_2,_3);
};
}
if(!Array.prototype.indexOf){
Array.prototype.indexOf=function(_4,_5){
return base2.Array2.indexOf(this,_4,_5);
};
}
if(!Array.prototype.insertAt){
Array.prototype.insertAt=function(_6,_7){
return base2.Array2.insertAt(this,_6,_7);
};
}
if(!Array.prototype.insertBefore){
Array.prototype.insertBefore=function(_8,_9){
return base2.Array2.insertBefore(this,_8,_9);
};
}
if(!Array.prototype.lastIndexOf){
Array.prototype.lastIndexOf=function(_a,_b){
return base2.Array2.lastIndexOf(this,_a,_b);
};
}
if(!Array.prototype.remove){
Array.prototype.remove=function(_c){
return base2.Array2.remove(this,_c);
};
}
if(!Array.prototype.removeAt){
Array.prototype.removeAt=function(_d){
return base2.Array2.removeAt(this,_d);
};
}
var gara={};
new function(){
$class("Namespace",{imports:"",exports:"",namespace:"",name:"",$constructor:function(_e){
this.name=_e.name||"gara";
this.imports=_e.imports||"";
this.exports=_e.exports||"";
if(this.name!="gara"){
this.name="gara."+this.name;
}
var _f=("gara,"+this.imports).split(",");
this.imports="";
_f.forEach(function(v,k,arr){
if(gara[v]){
this.imports+=gara[v].namespace;
}
},this);
var _13=this.exports.split(",");
this.exports="";
_13.forEach(function(v,k,arr){
this.exports+=this.name+"."+v+"="+v+";";
this.namespace+="var "+v+"="+this.name+"."+v+";";
},this);
}});
var _17=new Namespace({exports:"Namespace,EventManager,OutOfBoundsException",name:"gara"});
$class("EventManager",{_instance:null,$constructor:function(){
this._listeners=[];
base2.DOM.EventTarget(window);
window.addEventListener("unload",this,false);
},getInstance:$static(function(){
if(this._instance==null){
this._instance=new gara.EventManager();
}
return this._instance;
}),addListener:function(_18,_19,_1a){
_18.addEventListener(_19,_1a,false);
var _1b={domNode:_18,type:_19,listener:_1a};
this._listeners.push(_1b);
return _1b;
},handleEvent:function(e){
this._unregisterAllEvents();
},removeListener:function(e){
e.domNode.removeEventListener(e.type,e.listener,false);
if(this._listeners.contains(e)){
this._listeners.remove(e);
}
},_unregisterAllEvents:function(){
while(this._listeners.length>0){
var _1e=this._listeners.pop();
this.removeListener(_1e);
}
},toString:function(){
return "[gara.EventManager]";
}});
$class("OutOfBoundsException",{$extends:Exception,$constructor:function(_1f){
this.message=String(_1f);
this.name=$class.typeOf(this);
}});
var _20=gara.onDOMLoaded=function(f){
if(document.addEventListener){
document.addEventListener("DOMContentLoaded",f,false);
}else{
if(window.ActiveX){
document.write("<scr"+"ipt id=__ie_onload defer src=javascript:void(0)></script>");
var _22=document.getElementById("__ie_onload");
_22.onreadystatechange=function(){
if(this.readyState=="complete"){
f();
}
};
}else{
if(/WebKit/i.test(navigator.userAgent)){
var _23=setInterval(function(){
if(/loaded|complete/.test(document.readyState)){
f();
}
},10);
}else{
window.onload=f;
}
}
}
};
eval(_17.exports);
gara.namespace=_17.namespace;
gara.toString=function(){
return "[gara]";
};
};
delete Namespace;
delete EventManager;
delete OutOfBoundsException;
gara.jswt={};
new function(){
var _24=new gara.Namespace({name:"jswt",exports:"ControlManager,Widget,Control,Composite,Item,List,ListItem,Tree,TreeItem,TabFolder,TabItem,FocusListener,SelectionListener",imports:"gara"});
eval(_24.imports);
gara.jswt.ABORT=1<<9;
gara.jswt.APPLICATION_MODAL=1<<16;
gara.jswt.BOTTOM=1<<10;
gara.jswt.CANCEL=1<<8;
gara.jswt.CLOSE=1<<6;
gara.jswt.DEFAULT=0;
gara.jswt.DOWN=1<<10;
gara.jswt.DRAG=1;
gara.jswt.FULL_SELECTION=1<<16;
gara.jswt.IGNORE=1<<11;
gara.jswt.MENU=1<<6;
gara.jswt.MULTI=1<<1;
gara.jswt.NO=1<<7;
gara.jswt.OK=1<<5;
gara.jswt.RETRY=1<<10;
gara.jswt.SINGLE=1<<2;
gara.jswt.SYSTEM_MODAL=1<<17;
gara.jswt.TOP=1<<7;
gara.jswt.UP=1<<7;
gara.jswt.YES=1<<6;
$interface("FocusListener",{focusGained:function(){
},focusLost:function(){
},toString:function(){
return "[gara.jswt.FocusListener]";
}});
$interface("SelectionListener",{widgetSelected:function(_25){
},toString:function(){
return "[gara.jswt.SelectionListener]";
}});
$class("ItemNotExistsException",{$extends:Exception,$constructor:function(_26){
this.message=String(_26);
this.name=$class.typeOf(this);
}});
function strReplace(_27,_28,_29){
output=""+_27;
while(output.indexOf(_28)>-1){
pos=output.indexOf(_28);
output=""+(output.substring(0,pos)+_29+output.substring((pos+_28.length),output.length));
}
return output;
}
$class("Widget",{domref:null,$constructor:function(){
this.domref=null;
this._className="";
this._baseClass="";
this._listener={};
},addClassName:function(_2a){
this._className+=" "+_2a;
this._changed=true;
},addListener:function(_2b,_2c){
if(!this._listener.hasOwnProperty(_2b)){
this._listener[_2b]=new Array();
}
this._listener[_2b].push(_2c);
this.registerListener(_2b,_2c);
},getClassName:function(){
return this._className;
},hasClassName:function(_2d){
return this._className.indexOf(_2d)!=-1;
},registerListener:$abstract(function(_2e,_2f){
}),removeClassName:function(_30){
this._className=strReplace(this._className,_30,"");
this._changed=true;
},removeListener:function(_31,_32){
this._listener[_31].remove(_32);
},toString:function(){
return "[gara.jswt.Widget]";
}});
$class("Control",{$extends:Widget,$constructor:function(_33,_34){
this.$base();
this._parent=_33;
this._style=typeof (_34)=="undefined"?gara.jswt.DEFAULT:_34;
this._focusListener=[];
this._hasFocus=false;
gara.jswt.ControlManager.getInstance().addControl(this);
this.addFocusListener(gara.jswt.ControlManager.getInstance());
},addFocusListener:function(_35){
if(!$class.implementationOf(_35,gara.jswt.FocusListener)){
throw new TypeError("listener is not a gara.jswt.FocusListener");
}
this._focusListener.push(_35);
},forceFocus:function(){
this._hasFocus=true;
this.removeClassName(this._baseClass+"Inactive");
this.addClassName(this._baseClass+"Active");
this.update();
for(var i=0,len=this._focusListener.length;i<len;++i){
this._focusListener[i].focusGained(this);
}
},handleEvent:$abstract(function(e){
}),isFocusControl:function(){
return this._hasFocus;
},looseFocus:function(){
this._hasFocus=false;
this.removeClassName(this._baseClass+"Active");
this.addClassName(this._baseClass+"Inactive");
this.update();
for(var i=0,len=this._focusListener.length;i<len;++i){
this._focusListener[i].focusLost(this);
}
},removeFocusListener:function(_3b){
if(!_3b.$class.implementsInterface(gara.jswt.FocusListener)){
throw new TypeError("listener is not a gara.jswt.FocusListener");
}
if(this._focusListener.contains(_3b)){
this._focusListener.remove(_3b);
}
},toString:function(){
return "[gara.jswt.Control";
},update:$abstract(function(){
})});
$class("Composite",{$extends:Control,$constructor:function(_3c,_3d){
this.$base(_3c,_3d);
}});
$class("Item",{$extends:Widget,$constructor:function(){
this.$base();
this._changed=false;
this._image=null;
this._text="";
},getImage:function(){
return this._image;
},getText:function(){
return this._text;
},hasChanged:function(){
return this._changed;
},isCreated:function(){
return this.domref!=null;
},releaseChange:function(){
this._changed=false;
},setActive:function(_3e){
this._active=_3e;
if(_3e){
this.addClassName("active");
}else{
this.removeClassName("active");
}
this._changed=true;
},setImage:function(_3f){
this._image=_3f;
this._changed=true;
},setSelected:function(){
this.addClassName("selected");
},setText:function(_40){
this._text=_40;
this._changed=true;
},setUnselected:function(){
this.removeClassName("selected");
},toString:function(){
return "[gara.jswt.Item]";
}});
$class("List",{$extends:Control,$constructor:function(_41,_42){
this.$base(_41,_42);
if(this._style==gara.jswt.DEFAULT){
this._style=gara.jswt.SINGLE;
}
this._items=[];
this._selection=[];
this._selectionListener=[];
this._activeItem=null;
this._shiftItem=null;
this._className=this._baseClass="jsWTList";
},_activateItem:function(_43){
if(!$class.instanceOf(_43,gara.jswt.ListItem)){
throw new TypeError("item is not type of gara.jswt.ListItem");
}
if(this._activeItem!=null){
this._activeItem.setActive(false);
}
this._activeItem=_43;
this._activeItem.setActive(true);
this.update();
},addItem:function(_44){
if(!$class.instanceOf(_44,gara.jswt.ListItem)){
throw new TypeError("item is not type of gara.jswt.ListItem");
}
this._items.push(_44);
},addSelectionListener:function(_45){
if(!$class.instanceOf(_45,gara.jswt.SelectionListener)){
throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
}
this._selectionListener.push(_45);
},deselect:function(_46){
if(!$class.instanceOf(_46,gara.jswt.ListItem)){
throw new TypeError("item not instance of gara.jswt.ListItem");
}
if(this._selection.contains(_46)){
this._selection.remove(_46);
this.notifySelectionListener();
_46.setUnselected();
this._shiftItem=_46;
this._activateItem(_46);
}
},deselectAll:function(){
for(var i=0,len=this._items.length;i<len;++i){
this.deselect(this._items[i]);
}
this.update();
},getItem:function(_49){
if(_49>=this._items.length){
throw new gara.OutOfBoundsException("Your item lives outside of this list");
}
return this._items[_49];
},getItemCount:function(){
return this._items.length;
},getItems:function(){
return this._items;
},getSelection:function(){
return this._selection;
},getSelectionCount:function(){
return this._selection.length;
},handleEvent:function(e){
var obj=e.target.obj||null;
switch(e.type){
case "mousedown":
if(!this._hasFocus){
this.forceFocus();
}
if($class.instanceOf(obj,gara.jswt.ListItem)){
var _4c=obj;
if(!e.ctrlKey&&!e.shiftKey){
this.select(_4c,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_4c,true);
}else{
if(e.shiftKey){
this.selectRange(_4c,false);
}else{
if(e.ctrlKey){
if(this._selection.contains(_4c)){
this.deselect(_4c);
}else{
this.select(_4c,true);
}
}else{
this.select(_4c);
}
}
}
}
}
break;
}
e.stopPropagation();
},_handleKeyEvent:function(e){
if(this._activeItem==null){
return;
}
switch(e.keyCode){
case 38:
var _4e=false;
var _4f=this.indexOf(this._activeItem);
if(_4f!=0){
_4e=this._items[_4f-1];
}
if(_4e){
if(!e.ctrlKey&&!e.shiftKey){
this.select(_4e,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_4e,true);
}else{
if(e.shiftKey){
this.selectRange(_4e,false);
}else{
if(e.ctrlKey){
this._activateItem(_4e);
}
}
}
}
}
break;
case 40:
var _50=false;
var _4f=this.indexOf(this._activeItem);
if(_4f!=this._items.length-1){
_50=this._items[_4f+1];
}
if(_50){
if(!e.ctrlKey&&!e.shiftKey){
this.select(_50,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_50,true);
}else{
if(e.shiftKey){
this.selectRange(_50,false);
}else{
if(e.ctrlKey){
this._activateItem(_50);
}
}
}
}
}
break;
case 32:
if(this._selection.contains(this._activeItem)&&e.ctrlKey){
this.deselect(this._activeItem);
}else{
this.select(this._activeItem,true);
}
break;
case 36:
if(!e.ctrlKey&&!e.shiftKey){
this.select(this._items[0],false);
}else{
if(e.shiftKey){
this.selectRange(this._items[0],false);
}else{
if(e.ctrlKey){
this._activateItem(this._items[0]);
}
}
}
break;
case 35:
var _51=this._items.length-1;
if(!e.ctrlKey&&!e.shiftKey){
this.select(this._items[_51],false);
}else{
if(e.shiftKey){
this.selectRange(this._items[_51],false);
}else{
if(e.ctrlKey){
this._activateItem(this._items[_51]);
}
}
}
break;
}
},indexOf:function(_52){
if(!$class.instanceOf(_52,gara.jswt.ListItem)){
throw new TypeError("item not instance of gara.jswt.ListItem");
}
if(!this._items.contains(_52)){
throw new gara.jswt.ItemNotExistsException("item ["+_52+"] does not exists in this list");
return;
}
return this._items.indexOf(_52);
},notifySelectionListener:function(){
for(var i=0,len=this._selectionListener.length;i<len;++i){
this._selectionListener[i].widgetSelected(this);
}
},registerListener:function(_55,_56){
if(this.domref!=null){
gara.EventManager.getInstance().addListener(this.domref,_55,_56);
}
},removeSelectionListener:function(_57){
if(!$class.instanceOf(_57,gara.jswt.SelectionListener)){
throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
}
if(this._selectionListener.contains(_57)){
this._selectionListener.remove(_57);
}
},select:function(_58,_59){
if(!$class.instanceOf(_58,gara.jswt.ListItem)){
throw new TypeError("item not instance of gara.jswt.ListItem");
}
if(!_59||(this._style&gara.jswt.SINGLE)==gara.jswt.SINGLE){
while(this._selection.length){
this._selection.pop().setUnselected();
}
}
if(!this._selection.contains(_58)){
this._selection.push(_58);
_58.setSelected();
this._shiftItem=_58;
this._activateItem(_58);
this.notifySelectionListener();
}
},selectAll:function(){
for(var i=0,len=this._items.length;i<len;++i){
this.select(this._items[i],true);
}
this.update();
},selectRange:function(_5c,_5d){
if(!$class.instanceOf(_5c,gara.jswt.ListItem)){
throw new TypeError("item not instance of gara.jswt.ListItem");
}
if(!_5d){
while(this._selection.length){
this._selection.pop().setUnselected();
}
}
if((this._style&gara.jswt.MULTI)==gara.jswt.MULTI){
var _5e=this.indexOf(this._shiftItem);
var _5f=this.indexOf(_5c);
var _60=_5e>_5f?_5f:_5e;
var to=_5e<_5f?_5f:_5e;
for(var i=_60;i<=to;++i){
this._selection.push(this._items[i]);
this._items[i].setSelected();
}
this._activateItem(_5c);
this.notifySelectionListener();
}else{
this.select(_5c);
}
},toString:function(){
return "[gara.jswt.List]";
},update:function(){
if(this.domref==null){
this.domref=document.createElement("ul");
this.domref.obj=this;
this.domref.control=this;
base2.DOM.bind(this.domref);
var _63={};
for(var _64 in this._listener){
_63[_64]=this._listener[_64].concat([]);
}
this.addListener("mousedown",this);
for(var _64 in _63){
_63[_64].forEach(function(_65,_66,arr){
this.registerListener(_64,_65);
},this);
}
if(!$class.instanceOf(this._parent,gara.jswt.Composite)){
this._parent.appendChild(this.domref);
}
}
this.removeClassName("jsWTListFullSelection");
if((this._style&gara.jswt.FULL_SELECTION)==gara.jswt.FULL_SELECTION){
this.addClassName("jsWTListFullSelection");
}
this.domref.className=this._className;
this._items.forEach(function(_68,_69,arr){
if(!_68.isCreated()){
node=_68.create();
this.domref.appendChild(node);
}
if(_68.hasChanged()){
_68.update();
_68.releaseChange();
}
},this);
}});
$class("ListItem",{$extends:Item,$constructor:function(_6b){
if(!$class.instanceOf(_6b,gara.jswt.List)){
throw new TypeError("list is not type of gara.jswt.List");
}
this.$base();
this._list=_6b;
this._list.addItem(this);
this._span=null;
this._spanText=null;
this._img=null;
},create:function(){
this.domref=document.createElement("li");
this.domref.className=this._className;
this.domref.obj=this;
this.domref.control=this._list;
this._img=null;
if(this.image!=null){
this._img=document.createElement("img");
this._img.obj=this;
this._img.control=this._list;
this._img.src=this.image.src;
this._img.alt=this._text;
this.domref.appendChild(this._img);
}
this._spanText=document.createTextNode(this._text);
this._span=document.createElement("span");
this._span.obj=this;
this._span.control=this._list;
this._span.appendChild(this._spanText);
this.domref.appendChild(this._span);
base2.DOM.bind(this.domref);
for(var _6c in this._listener){
this._listener[_6c].forEach(function(_6d,_6e,arr){
this.registerListener(_6c,_6d);
},this);
}
this._changed=false;
return this.domref;
},registerListener:function(_70,_71){
if(this._img!=null){
gara.EventManager.getInstance().addListener(this._img,_70,_71);
}
if(this._span!=null){
gara.EventManager.getInstance().addListener(this._span,_70,_71);
}
},toString:function(){
return "[gara.jswt.ListItem]";
},update:function(){
if(this._image!=null&&this._img==null){
this._img=document.createElement("img");
this._img.obj=this;
this._img.control=this._list;
this._img.alt=this._text;
this._img.src=this._image.src;
this.domref.insertBefore(this._img,this._span);
for(var _72 in this._listener){
this._listener[_72].forEach(function(_73,_74,arr){
this.registerListener(this._img,_72,_73);
},this);
}
}else{
if(this._image!=null){
this._img.src=this._image.src;
this._img.alt=this._text;
}else{
if(this._img!=null&&this._image==null){
this.domref.removeChild(this._img);
this._img=null;
for(var _72 in this._listener){
this._listener[_72].forEach(function(_76,_77,arr){
gara.EventManager.getInstance().removeListener({domNode:this._img,type:_72,listener:_76});
},this);
}
}
}
}
this._spanText.nodeValue=this._text;
this.domref.className=this._className;
}});
$class("Tree",{$extends:Composite,$constructor:function(_79,_7a){
this.$base(_79,_7a);
if(this._style==gara.jswt.DEFAULT){
this._style=gara.jswt.SINGLE;
}
this._showLines=true;
this._shiftItem=null;
this._activeItem=null;
this._className=this._baseClass="jsWTTree";
this._selection=[];
this._selectionListeners=[];
this._items=[];
this._firstLevelItems=[];
},_activateItem:function(_7b){
if(!$class.instanceOf(_7b,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(this._activeItem!=null){
this._activeItem.setActive(false);
}
this._activeItem=_7b;
this._activeItem.setActive(true);
this.update();
},_addItem:function(_7c){
if(!$class.instanceOf(_7c,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
var _7d=_7c.getParentItem();
if(_7d==null){
this._items.push(_7c);
this._firstLevelItems.push(_7c);
}else{
var _7e=this._items.indexOf(_7d)+getDescendents(_7d)+1;
this._items.splice(_7e,0,_7c);
}
function getDescendents(_7f){
var _80=0;
if(_7f.getItemCount()>0){
_7f.getItems().forEach(function(_81,_82,arr){
if(_81.getItemCount()>0){
_80+=getDescendents(_81);
}
_80++;
},this);
}
return _80;
}
},addSelectionListener:function(_84){
if(!$class.instanceOf(item,gara.jswt.SelectionListener)){
throw new TypeError("listener is not type of gara.jswt.SelectionListener");
}
if(!this._selectionListeners.contains(_84)){
this._selectionListeners.push(_84);
}
},deselect:function(_85){
if(!$class.instanceOf(_85,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(this._selection.contains(_85)&&_85.getParent()==this){
this._selection.remove(_85);
this._notifySelectionListener();
_85.setChecked(false);
this._shiftItem=_85;
this._activateItem(_85);
}
},deselectAll:function(){
for(var i=this._selection.length;i>=0;--i){
this.deselect(this._selection[i]);
}
this.update();
},getItem:function(_87){
if(_87>=this._items.length){
throw new gara.OutOfBoundsException("Your item lives outside of this Tree");
}
return this._items[_87];
},getItemCount:function(){
return this._items.length;
},getItems:function(){
return this._items;
},getLinesVisible:function(){
return this._showLines;
},getSelection:function(){
return this._selection;
},getSelectionCount:function(){
return this._selection.length;
},handleEvent:function(e){
var obj=e.target.obj||null;
var _8a=null;
if($class.instanceOf(obj,gara.jswt.TreeItem)){
_8a=obj;
}
switch(e.type){
case "mousedown":
if(!this._hasFocus){
this.forceFocus();
}
if(_8a!=null){
if(e.ctrlKey&&!e.shiftKey){
if(this._selection.contains(_8a)){
this.deselect(_8a);
}else{
this._select(_8a,true);
}
}else{
if(!e.ctrlKey&&e.shiftKey){
this._selectShift(_8a,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this._selectShift(_8a,true);
}else{
this._select(_8a,false);
}
}
}
}
break;
case "dblclick":
break;
}
if(_8a!=null){
_8a.handleEvent(e);
}
e.stopPropagation();
},_handleKeyEvent:function(e){
if(this._activeItem==null){
return;
}
switch(e.keyCode){
case 38:
var _8c;
if(this._activeItem==this._items[0]){
_8c=false;
}else{
var _8d;
var _8e=this._activeItem.getParentItem();
if(_8e==null){
_8d=this._firstLevelItems;
}else{
_8d=_8e.getItems();
}
var _8f=_8d.indexOf(this._activeItem);
if(_8f==0){
_8c=_8e;
}else{
var _90=_8d[_8f-1];
_8c=getLastItem(_90);
}
}
if(_8c){
if(!e.ctrlKey&&!e.shiftKey){
this._select(_8c,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this._selectShift(_8c,true);
}else{
if(e.shiftKey){
this._selectShift(_8c,false);
}else{
if(e.ctrlKey){
this._activateItem(_8c);
}
}
}
}
}
break;
case 40:
var _91;
var _8d;
if(this._activeItem==this._items[this._items.length-1]){
_91=false;
}else{
var _8e=this._activeItem.getParentItem();
if(_8e==null){
_8d=this._firstLevelItems;
}else{
_8d=_8e.getItems();
}
var _8f=_8d.indexOf(this._activeItem);
if(this._activeItem.getItemCount()>0&&this._activeItem.getExpanded()){
_91=this._activeItem.getItems()[0];
}else{
if(this._activeItem.getItemCount()>0&&!this._activeItem.getExpanded()){
_91=this._items[this._items.indexOf(this._activeItem)+countItems(this._activeItem)+1];
}else{
_91=this._items[this._items.indexOf(this._activeItem)+1];
}
}
}
if(_91){
if(!e.ctrlKey&&!e.shiftKey){
this._select(_91,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this._selectShift(_91,true);
}else{
if(e.shiftKey){
this._selectShift(_91,false);
}else{
if(e.ctrlKey){
this._activateItem(_91);
}
}
}
}
}
break;
case 37:
var _92=this._activeItem;
this._activeItem.setExpanded(false);
this._activateItem(_92);
this.update();
break;
case 39:
this._activeItem.setExpanded(true);
this.update();
break;
case 32:
if(this._selection.contains(this._activeItem)&&e.ctrlKey){
this.deselect(this._activeItem);
}else{
this._select(this._activeItem,true);
}
break;
case 36:
if(!e.ctrlKey&&!e.shiftKey){
this._select(this._items[0],false);
}else{
if(e.shiftKey){
this._selectShift(this._items[0],false);
}else{
if(e.ctrlKey){
this._activateItem(this._items[0]);
}
}
}
break;
case 35:
if(!e.ctrlKey&&!e.shiftKey){
this._select(this._items[this._items.length-1],false);
}else{
if(e.shiftKey){
this._selectShift(this._items[this._items.length-1],false);
}else{
if(e.ctrlKey){
this._activateItem(this._items[this._items.length-1]);
}
}
}
break;
}
function getLastItem(_93){
if(_93.getExpanded()&&_93.getItemCount()>0){
return getLastItem(_93.getItems()[_93.getItemCount()-1]);
}else{
return _93;
}
}
function countItems(_94){
var _95=0;
var _96=_94.getItems();
for(var i=0;i<_96.length;++i){
_95++;
if(_96[i].getItemCount()>0){
_95+=countItems(_96[i]);
}
}
return _95;
}
},indexOf:function(_98){
if(!$class.instanceOf(_98,gara.jswt.TreeItem)){
throw new TypeError("item not instance of gara.jswt.TreeItem");
}
if(!this._items.contains(_98)){
throw new gara.jswt.ItemNotExistsException("item ["+_98+"] does not exists in this list");
console.log("des item gibts hier ned: "+_98.getText());
return;
}
return this._items.indexOf(_98);
},_notifySelectionListener:function(){
this._selectionListeners.forEach(function(_99,_9a,arr){
_99.widgetSelected(this);
},this);
},registerListener:function(_9c,_9d){
if(this.domref!=null){
gara.EventManager.getInstance().addListener(this.domref,_9c,_9d);
}
},removeSelectionListener:function(_9e){
if(!$class.instanceOf(item,gara.jswt.SelectionListener)){
throw new TypeError("item is not type of gara.jswt.SelectionListener");
}
if(this._selectionListeners.contains(_9e)){
this._selectionListeners.remove(_9e);
}
},_select:function(_9f,_a0){
if(!$class.instanceOf(_9f,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(!_a0||(this._style&gara.jswt.SINGLE)==gara.jswt.SINGLE){
while(this._selection.length){
this._selection.pop().setChecked(false);
}
}
if(!this._selection.contains(_9f)&&_9f.getParent()==this){
this._selection.push(_9f);
_9f.setChecked(true);
this._shiftItem=_9f;
this._activateItem(_9f);
this._notifySelectionListener();
}
},selectAll:function(){
this._items.forEach(function(_a1,_a2,arr){
this._select(_a1,true);
},this);
this.update();
},_selectShift:function(_a4,_a5){
if(!$class.instanceOf(_a4,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(!_a5){
while(this._selection.length){
this._selection.pop().setChecked(false);
}
}
if((this._style&gara.jswt.MULTI)==gara.jswt.MULTI){
var _a6=this.indexOf(this._shiftItem);
var _a7=this.indexOf(_a4);
var _a8=_a6>_a7?_a7:_a6;
var to=_a6<_a7?_a7:_a6;
for(var i=_a8;i<=to;++i){
this._selection.push(this._items[i]);
this._items[i].setChecked(true);
}
this._activateItem(_a4);
this._notifySelectionListener();
}else{
this._select(_a4);
}
},setLinesVisible:function(_ab){
this._showLines=_ab;
},toString:function(){
return "[gara.jswt.Tree]";
},update:function(){
if(this.domref==null){
this.domref=document.createElement("ul");
this.domref.obj=this;
this.domref.control=this;
base2.DOM.bind(this.domref);
var _ac={};
for(var _ad in this._listener){
_ac[_ad]=this._listener[_ad].concat([]);
}
this.addListener("mousedown",this);
this.addListener("dblclick",this);
for(var _ad in _ac){
_ac[_ad].forEach(function(_ae,_af,arr){
this.registerListener(_ad,_ae);
},this);
}
if(!$class.instanceOf(this._parent,gara.jswt.Composite)){
this._parent.appendChild(this.domref);
}
}
this.removeClassName("jsWTTreeNoLines");
this.removeClassName("jsWTTreeLines");
this.removeClassName("jsWTTreeFullSelection");
if(this._showLines){
this.addClassName("jsWTTreeLines");
}else{
this.addClassName("jsWTTreeNoLines");
}
if((this._style&gara.jswt.FULL_SELECTION)==gara.jswt.FULL_SELECTION){
this.addClassName("jsWTTreeFullSelection");
}
this.domref.className=this._className;
this._updateItems(this._firstLevelItems,this.domref);
},_updateItems:function(_b1,_b2){
var _b3=_b1.length;
_b1.forEach(function(_b4,_b5,arr){
var _b7=(_b5+1)==_b3;
if(!_b4.isCreated()){
_b4.create(_b7);
_b2.appendChild(_b4.domref);
}
if(_b4.hasChanged()){
_b4.update();
_b4.releaseChange();
}
if(_b4.getItemCount()>0){
var _b8=_b4._getChildContainer();
this._updateItems(_b4.getItems(),_b8);
}
if(_b7&&_b4.getClassName().indexOf("bottom")==-1){
_b4.addClassName("bottom");
if(_b4.getItemCount()>0){
var cc=_b4._getChildContainer();
cc.className="bottom";
}
}else{
if(!_b7&&_b4.getClassName().indexOf("bottom")!=-1){
_b4.removeClassName("bottom");
if(_b4.getItemCount()>0){
var cc=_b4._getChildContainer();
cc.className=null;
}
}
}
},this);
}});
$class("TreeItem",{$extends:Item,$constructor:function(_ba){
this.$base();
if(!($class.instanceOf(_ba,gara.jswt.Tree)||$class.instanceOf(_ba,gara.jswt.TreeItem))){
throw new TypeError("parentWidget is neither a gara.jswt.Tree or gara.jswt.TreeItem");
}
this._items=new Array();
this._expanded=true;
this._checked=false;
this._changed=false;
this._childContainer=null;
this._parent=_ba;
this._tree=null;
if($class.instanceOf(_ba,gara.jswt.Tree)){
this._tree=_ba;
}else{
if($class.instanceOf(_ba,gara.jswt.TreeItem)){
this._tree=_ba.getParent();
_ba._addItem(this);
}
}
this._tree._addItem(this);
this._img=null;
this._toggler=null;
this._span=null;
this._spanText=null;
},_addItem:function(_bb){
if(!$class.instanceOf(_bb,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
this._items.push(_bb);
},create:function(_bc){
if(_bc){
this.addClassName("bottom");
}
this.domref=document.createElement("li");
this.domref.className=this._className;
this.domref.obj=this;
this.domref.control=this._tree;
this._toggler=document.createElement("span");
this._toggler.obj=this;
this._toggler.control=this._tree;
this._span=document.createElement("span");
this._span.obj=this;
this._span.control=this._tree;
this._span.className="text";
this._spanText=document.createTextNode(this._text);
this._span.appendChild(this._spanText);
this._toggler.className="toggler";
this._toggler.className+=this._hasChilds()?(this._expanded?" togglerExpanded":" togglerCollapsed"):"";
this.domref.appendChild(this._toggler);
if(this._image!=null){
this._img=document.createElement("img");
this._img.obj=this;
this._img.src=this._image.src;
this._img.control=this._tree;
this.domref.appendChild(this._img);
}
this.domref.appendChild(this._span);
if(this._hasChilds()){
this._createChildContainer();
}
base2.DOM.bind(this.domref);
for(var _bd in this._listeners){
this._listeners[_bd].forEach(function(_be,_bf,arr){
this.registerListener(_bd,_be);
},this);
}
},_createChildContainer:function(){
this._childContainer=document.createElement("ul");
if(this.getClassName().indexOf("bottom")!=-1){
this._childContainer.className="bottom";
}
if(this._expanded){
this._childContainer.style.display="block";
}else{
this._childContainer.style.display="none";
}
this.domref.appendChild(this._childContainer);
},_deselectItems:function(){
this._items.forEach(function(_c1,_c2,arr){
if(_c1._hasChilds()){
_c1._deselectItems();
}
this._tree.deselect(_c1);
},this);
},_getChildContainer:function(){
if(this._childContainer==null){
this._createChildContainer();
}
return this._childContainer;
},getChecked:function(){
return this._checked;
},getExpanded:function(){
return this._expanded;
},getItem:function(_c4){
if(_c4>=this._items.length){
throw new gara.OutOfBoundsException("Your item lives outside of this Tree");
}
return this._items[_c4];
},getItemCount:function(){
return this._items.length;
},getItems:function(){
return this._items;
},getParent:function(){
return this._tree;
},getParentItem:function(){
if(this._parent==this._tree){
return null;
}else{
return this._parent;
}
},_hasChilds:function(){
return this._items.length>0;
},handleEvent:function(e){
var obj=e.target.obj||null;
switch(e.type){
case "mousedown":
if($class.instanceOf(obj,gara.jswt.TreeItem)){
var _c7=obj;
if(e.target==this._toggler){
if(this._expanded){
this.setExpanded(false);
}else{
this.setExpanded(true);
}
this._tree.update();
}
}
break;
case "dblclick":
if($class.instanceOf(obj,gara.jswt.TreeItem)){
var _c7=obj;
if(e.target!=this._toggler){
if(this._expanded){
this.setExpanded(false);
}else{
this.setExpanded(true);
}
this._tree.update();
}
}
break;
}
},indexOf:function(_c8){
if(!$class.instanceOf(_c8,gara.jswt.TreeItem)){
throw new TypeError("item not instance of gara.jswt.TreeItem");
}
if(!this._items.contains(_c8)){
throw new gara.jswt.ItemNotExistsException("item ["+_c8+"] does not exists in this list");
console.log("des item gibts hier ned: "+_c8.getText());
return;
}
return this._items.indexOf(_c8);
},registerListener:function(_c9,_ca){
if(this._img!=null){
gara.EventManager.getInstance().addListener(this._img,_c9,_ca);
}
if(this._span!=null){
gara.EventManager.getInstance().addListener(this._span,_c9,_ca);
}
},removeAll:function(){
this._items=[];
},setActive:function(_cb){
this._active=_cb;
if(_cb){
this._span.className+=" active";
}else{
this._span.className=this._span.className.replace(/ *active/,"");
}
this._changed=true;
},setChecked:function(_cc){
if(_cc){
this._span.className="text selected";
}else{
this._span.className="text";
}
this._checked=_cc;
},setExpanded:function(_cd){
this._expanded=_cd;
if(!_cd){
this._deselectItems();
}
this._changed=true;
},toString:function(){
return "[gara.jswt.TreeItem]";
},update:function(){
if(this._hasChilds()){
this._toggler.className=strReplace(this._toggler.className," togglerCollapsed","");
this._toggler.className=strReplace(this._toggler.className," togglerExpanded","");
if(this._expanded){
this._toggler.className+=" togglerExpanded";
}else{
this._toggler.className+=" togglerCollapsed";
}
}
if(this._image!=null&&this._img==null){
this._img=document.createElement("img");
this._img.obj=this;
this._img.control=this._tree;
this._img.alt=this._text;
this._img.src=this._image.src;
this.domref.insertBefore(this._img,this._span);
}else{
if(this._image!=null){
this._img.src=this._image.src;
this._img.alt=this._text;
}else{
if(this._img!=null&&this._image==null){
this.domref.removeChild(this._img);
this._img=null;
}
}
}
if(this._hasChilds()&&this._childContainer==null){
this._createChildContainer();
}
if(this._childContainer!=null){
if(this._expanded){
this._childContainer.style.display="block";
}else{
this._childContainer.style.display="none";
}
}else{
if(!this._hasChilds()&&this._childContainer!=null){
this.domref.removeChild(this._childContainer);
this._childContainer=null;
}
}
this._spanText.nodeValue=this._text;
this.domref.className=this._className;
}});
$class("TabFolder",{$extends:Composite,$constructor:function(_ce,_cf){
this.$base(_ce,_cf);
if(this._style==gara.jswt.DEFAULT){
this._style=gara.jswt.TOP;
}
this._items=[];
this._activeItem=null;
this._selectionListener=[];
this._selection=[];
this._tabbar=null;
this._clientArea=null;
this._className=this._baseClass="jsWTTabFolder";
},_addItem:function(_d0){
if(!$class.instanceOf(_d0,gara.jswt.TabItem)){
throw new TypeError("item is not type of gara.jswt.TabItem");
}
var _d1=this.getItemCount();
this._items.push(_d0);
},addSelectionListener:function(_d2){
if(!$class.instanceOf(_d2,gara.jswt.SelectionListener)){
throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
}
this._selectionListener.push(_d2);
},_activateItem:function(_d3){
if(!$class.instanceOf(_d3,gara.jswt.TabItem)){
throw new TypeError("item is not type of gara.jswt.TabItem");
}
if(this._activeItem!=null){
this._activeItem.setActive(false);
}
this._activeItem=_d3;
_d3._setActive(true);
for(var i=0,len=this._clientArea.childNodes.length;i<len;++i){
this._clientArea.removeChild(this._clientArea.childNodes[i]);
}
if(_d3.getControl()!=null){
_d3.getControl().update();
this._clientArea.appendChild(_d3.getControl().domref);
}else{
if(typeof (_d3.getContent())=="string"){
this._clientArea.appendChild(document.createTextNode(_d3.getContent()));
}else{
this._clientArea.appendChild(_d3.getContent());
}
}
this.update();
this._selection=[];
this._selection.push(_d3);
this._notifySelectionListener();
},getClientArea:function(){
return this._clientArea;
},getItem:function(_d6){
if(_d6>=this._items.length){
throw new gara.OutOfBoundsException("Your item lives outside of this tabfolder");
}
return this._items[_d6];
},getItemCount:function(){
return this._items.length;
},getItems:function(){
return this._items;
},getSelection:function(){
return this._selection;
},getSelectionIndex:function(){
if(this._selection.length){
return this._items.indexOf(this._selection[0]);
}else{
return -1;
}
},handleEvent:function(e){
var obj=e.target.obj||null;
switch(e.type){
case "mousedown":
if(!this._hasFocus){
this.forceFocus();
}
if($class.instanceOf(obj,gara.jswt.TabItem)){
var _d9=obj;
this._activateItem(_d9);
}
break;
}
if(e.target!=this.domref){
e.stopPropagation();
}
},indexOf:function(_da){
if(!$class.instanceOf(_da,gara.jswt.TabItem)){
throw new TypeError("item not instance of gara.jswt.TabItem");
}
if(!this._items.contains(_da)){
throw new gara.jswt.ItemNotExistsException("item ["+_da+"] does not exists in this list");
}
return this._items.indexOf(_da);
},_notifySelectionListener:function(){
for(var i=0,len=this._selectionListener.length;i<len;++i){
this._selectionListener[i].widgetSelected(this);
}
},registerListener:function(_dd,_de){
if(this.domref!=null){
gara.EventManager.getInstance().addListener(this.domref,_dd,_de);
}
},removeSelectionListener:function(_df){
if(!$class.instanceOf(_df,gara.jswt.SelectionListener)){
throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
}
if(this._selectionListener.contains(_df)){
this._selectionListener.remove(_df);
}
},setSelection:function(arg){
if(typeof (arg)=="number"){
if(arg>=this._items.length){
throw new gara.OutOfBoundsException("Your item lives outside of this tabfolder");
}
this._activateItem(this._items[arg]);
}else{
if($class.instanceOf(arg,Array)){
if(arg.length){
this._activateItem(arg[0]);
}
}
}
},_showContent:function(_e1){
},toString:function(){
return "[gara.jswt.TabFolder]";
},update:function(){
var _e2=false;
if(this.domref==null){
this.domref=document.createElement("div");
this.domref.obj=this;
this.domref.control=this;
base2.DOM.bind(this.domref);
this._tabbar=document.createElement("ul");
this._tabbar.obj=this;
this._tabbar.control=this;
this._clientArea=document.createElement("div");
this._clientArea.className="jsWTTabClientArea";
if(this._style==gara.jswt.TOP){
this.domref.appendChild(this._tabbar);
this.domref.appendChild(this._clientArea);
this._tabbar.className="jsWTTabbar jsWTTabbarTop";
}else{
this.domref.appendChild(this._clientArea);
this.domref.appendChild(this._tabbar);
this._tabbar.className="jsWTTabbar jsWTTabbarBottom";
}
var _e3={};
for(var _e4 in this._listener){
_e3[_e4]=this._listener[_e4].concat([]);
}
this.addListener("mousedown",this);
for(var _e4 in _e3){
_e3[_e4].forEach(function(_e5,_e6,arr){
this.registerListener(_e4,_e5);
},this);
}
if(!$class.instanceOf(this._parent,gara.jswt.Composite)){
this._parent.appendChild(this.domref);
}
_e2=true;
}
this.domref.className=this._className;
this._items.forEach(function(_e8,_e9,arr){
if(!_e8.isCreated()){
node=_e8._create();
this._tabbar.appendChild(node);
}
if(_e8.hasChanged()){
_e8.update();
_e8.releaseChange();
}
},this);
if(_e2&&this._items.length){
this._activateItem(this._items[0]);
}
}});
$class("TabItem",{$extends:Item,$constructor:function(_eb){
this.$base();
if(!$class.instanceOf(_eb,gara.jswt.TabFolder)){
throw new TypeError("parentWidget is neither a gara.jswt.TabFolder");
}
this._parent=_eb;
this._active=false;
this._content=null;
this._control=null;
this._toolTipText=null;
this._span=null;
this._img=null;
this._parent._addItem(this);
},_create:function(){
this.domref=document.createElement("li");
this.domref.className=this._className;
this.domref.obj=this;
this.domref.control=this._parent;
this.domref.title=this._toolTipText;
if(this.image!=null){
this._img=document.createElement("img");
this._img.obj=this;
this._img.control=this._parent;
this._img.src=this.image.src;
this._img.alt=this._text;
this.domref.appendChild(this._img);
}
this._spanText=document.createTextNode(this._text);
this._span=document.createElement("span");
this._span.obj=this;
this._span.control=this._parent;
this._span.appendChild(this._spanText);
this.domref.appendChild(this._span);
base2.DOM.bind(this.domref);
for(var _ec in this._listener){
this._listener[_ec].forEach(function(_ed,_ee,arr){
this.registerListener(_ec,_ed);
},this);
}
this._changed=false;
return this.domref;
},getContent:function(){
return this._content;
},getControl:function(){
return this._control;
},getToolTipText:function(){
return this._toolTipText;
},registerListener:function(){
if(this.domref!=null){
gara.EventManager.getInstance().addListener(this.domref,eventType,listener);
}
},_setActive:function(_f0){
this._active=_f0;
if(_f0){
this._className+=" active";
}else{
this._className=this._className.replace(/ *active/,"");
}
this._changed=true;
},setContent:function(_f1){
this._content=_f1;
this._changed=true;
},setControl:function(_f2){
if(!$class.instanceOf(_f2,gara.jswt.Control)){
throw new TypeError("control is not instance of gara.jswt.Control");
}
this._control=_f2;
},setToolTipText:function(_f3){
this._toolTipText=_f3;
this._changed=true;
},update:function(){
if(this._image!=null&&this._img==null){
this._img=document.createElement("img");
this._img.obj=this;
this._img.control=this._parent;
this._img.alt=this._text;
this._img.src=this._image.src;
this.domref.insertBefore(this._img,this._span);
for(var _f4 in this._listener){
this._listener[_f4].forEach(function(_f5,_f6,arr){
this.registerListener(this._img,_f4,_f5);
},this);
}
}else{
if(this._image!=null){
this._img.src=this._image.src;
this._img.alt=this._text;
}else{
if(this._img!=null&&this._image==null){
this.domref.removeChild(this._img);
this._img=null;
for(var _f4 in this._listener){
this._listener[_f4].forEach(function(_f8,_f9,arr){
gara.EventManager.getInstance().removeListener({domNode:this._img,type:_f4,listener:_f8});
},this);
}
}
}
}
this._spanText.nodeValue=this._text;
this.domref.className=this._className;
}});
$class("ControlManager",{$implements:FocusListener,_instance:null,$constructor:function(){
this._activeControl=null;
this._controls=[];
base2.DOM.EventTarget(document);
gara.EventManager.getInstance().addListener(document,"keydown",this);
gara.EventManager.getInstance().addListener(document,"mousedown",this);
},getInstance:$static(function(){
if(this._instance==null){
this._instance=new gara.jswt.ControlManager();
}
return this._instance;
}),addControl:function(_fb){
if(!this._controls.contains(_fb)){
this._controls.push(_fb);
}
},focusGained:function(_fc){
if(!$class.instanceOf(_fc,gara.jswt.Control)){
throw new TypeError("control is not a gara.jswt.Control");
}
this._activeControl=_fc;
},focusLost:function(_fd){
if(!$class.instanceOf(_fd,gara.jswt.Control)){
throw new TypeError("control is not a gara.jswt.Control");
}
if(this._activeControl==_fd){
this._activeControl=null;
}
},handleEvent:function(e){
if(e.type=="keydown"){
if(this._activeControl!=null&&this._activeControl._handleKeyEvent){
this._activeControl._handleKeyEvent(e);
}
}
if(e.type=="mousedown"){
if(this._activeControl!=null&&(e.target.control?e.target.control!=this._activeControl:true)){
this._activeControl.looseFocus();
this._activeControl=null;
}
}
},removeControl:function(_ff){
if(!$class.instanceOf(_ff,gara.jswt.Control)){
throw new TypeError("control is not a gara.jswt.Control");
}
if(this._controls.contains(_ff)){
if(this._activeControl==_ff){
this._activeControl=null;
}
this._controls.remove(_ff);
}
},toString:function(){
return "[gara.jswt.ControlManager]";
}});
eval(_24.exports);
gara.jswt.namespace=_24.namespace;
gara.jswt.toString=function(){
return "[gara.jswt]";
};
};
delete Control;
delete ControlManager;
delete FocusListener;
delete Item;
delete ItemNotExistsException;
delete List;
delete ListItem;
delete Tree;
delete TreeItem;
delete TabFolder;
delete TabItem;
delete SelectionListener;
delete Composite;
delete Widget;

