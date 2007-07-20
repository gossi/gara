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
var _17=new Namespace({exports:"Namespace",name:"gara"});
$class("EventManager",{_listeners:[],$constructor:function(){
window.addEventListener("unload",this,false);
},addListener:function(_18,_19,_1a){
_18.addEventListener(_19,_1a,false);
var _1b={domNode:_18,type:_19,listener:_1a};
this._listeners.push(_1b);
return _1b;
},handleEvent:function(e){
if(e.type=="unload"){
this._unregisterAllEvents();
}
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
gara.eventManager=new EventManager();
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
var _24=new gara.Namespace({name:"jswt",exports:"Widget,Control,List,Tree,Item,ListItem,TreeItem,FocusListener,SelectionListener",imports:"gara"});
eval(_24.imports);
$interface("FocusListener",{focusGained:function(){
},focusLost:function(){
},toString:function(){
return "[gara.jswt.FocusListener]";
}});
$interface("SelectionListener",{widgetSelected:function(_25){
},toString:function(){
return "[gara.jswt.SelectionListener]";
}});
function strReplace(_26,_27,_28){
output=""+_26;
while(output.indexOf(_27)>-1){
pos=output.indexOf(_27);
output=""+(output.substring(0,pos)+_28+output.substring((pos+_27.length),output.length));
}
return output;
}
$class("Widget",{domref:null,$constructor:function(){
this._className="";
this._baseClass="";
this._listener={};
},addClassName:function(_29){
this._className+=" "+_29;
this._changed=true;
},addListener:function(_2a,_2b){
if(!this._listener.hasOwnProperty(_2a)){
this._listener[_2a]=new Array();
}
this._listener[_2a].push(_2b);
this.registerListener(_2a,_2b);
},getClassName:function(){
return this._className;
},registerListener:$abstract(function(_2c,_2d){
}),removeClassName:function(_2e){
this._className=strReplace(this._className,_2e,"");
this._changed=true;
},removeListener:function(_2f,_30){
this._listener[_2f].remove(_30);
},setClassName:function(_31){
this._className=_31;
this._changed=true;
},toString:function(){
return "[gara.jswt.Widget]";
}});
$class("Control",{$extends:Widget,$constructor:function(){
this.$base();
this._focusListener=[];
this._hasFocus=false;
_32.addControl(this);
this.addFocusListener(_32);
},addFocusListener:function(_33){
if(!$class.implementationOf(_33,gara.jswt.FocusListener)){
throw new TypeError("listener is not a gara.jswt.FocusListener");
}
this._focusListener.push(_33);
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
},removeFocusListener:function(_39){
if(!_39.$class.implementsInterface(gara.jswt.FocusListener)){
throw new TypeError("listener is not a gara.jswt.FocusListener");
}
if(this._focusListener.contains(_39)){
this._focusListener.remove(_39);
}
},toString:function(){
return "[gara.jswt.Control";
},update:$abstract(function(){
})});
$class("List",{$extends:Control,$constructor:function(_3a){
this.$base();
this._items=[];
this._selection=[];
this._selectionListener=[];
this._activeItem=null;
this._shiftItem=null;
this._parentNode=_3a;
this._className=this._baseClass="jsWTList";
},_activateItem:function(_3b){
if(!$class.instanceOf(_3b,gara.jswt.ListItem)){
throw new TypeError("item is not type of gara.jswt.ListItem");
}
if(this._activeItem!=null){
this._activeItem.setActive(false);
}
this._activeItem=_3b;
this._activeItem.setActive(true);
this.update();
},addItem:function(_3c){
if(!$class.instanceOf(_3c,gara.jswt.ListItem)){
throw new TypeError("item is not type of gara.jswt.ListItem");
}
this._items.push(_3c);
},addSelectionListener:function(_3d){
if(!$class.instanceOf(_3d,gara.jswt.SelectionListener)){
throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
}
this._selectionListener.push(_3d);
},deselect:function(_3e){
if(!$class.instanceOf(_3e,gara.jswt.ListItem)){
throw new TypeError("item not instance of gara.jswt.ListItem");
}
if(this._selection.contains(_3e)){
this._selection.remove(_3e);
this.notifySelectionListener();
_3e.setUnselected();
this._shiftItem=_3e;
this._activateItem(_3e);
}
},deselectAll:function(){
for(var i=0,len=this._items.length;i<len;++i){
this.deselect(this._items[i]);
}
this.update();
},getItem:function(_41){
if(_41>=this._items.length){
throw new OutOfBoundsException("Your item lives outside of this list");
}
return this._items[_41];
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
var _44=obj;
if(!e.ctrlKey&&!e.shiftKey){
this.select(_44,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_44,true);
}else{
if(e.shiftKey){
this.selectRange(_44,false);
}else{
if(e.ctrlKey){
if(this._selection.contains(_44)){
this.deselect(_44);
}else{
this.select(_44,true);
}
}else{
this.select(_44);
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
var _46=false;
var _47=this.indexOf(this._activeItem);
if(_47!=0){
_46=this._items[_47-1];
}
if(_46){
if(!e.ctrlKey&&!e.shiftKey){
this.select(_46,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_46,true);
}else{
if(e.shiftKey){
this.selectRange(_46,false);
}else{
if(e.ctrlKey){
this._activateItem(_46);
}
}
}
}
}
break;
case 40:
var _48=false;
var _47=this.indexOf(this._activeItem);
if(_47!=this._items.length-1){
_48=this._items[_47+1];
}
if(_48){
if(!e.ctrlKey&&!e.shiftKey){
this.select(_48,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_48,true);
}else{
if(e.shiftKey){
this.selectRange(_48,false);
}else{
if(e.ctrlKey){
this._activateItem(_48);
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
var _49=this._items.length-1;
if(!e.ctrlKey&&!e.shiftKey){
this.select(this._items[_49],false);
}else{
if(e.shiftKey){
this.selectRange(this._items[_49],false);
}else{
if(e.ctrlKey){
this._activateItem(this._items[_49]);
}
}
}
break;
}
},indexOf:function(_4a){
if(!$class.instanceOf(_4a,gara.jswt.ListItem)){
throw new TypeError("item not instance of gara.jswt.ListItem");
}
if(!this._items.contains(_4a)){
throw new gara.jswt.ItemNotExistsException("item ["+_4a+"] does not exists in this list");
return;
}
return this._items.indexOf(_4a);
},notifySelectionListener:function(){
for(var i=0,len=this._selectionListener.length;i<len;++i){
this._selectionListeners[i].widgetSelected(this);
}
},registerListener:function(_4d,_4e){
if(this.domref!=null){
gara.eventManager.addListener(this.domref,_4d,_4e);
}
},removeSelectionListener:function(_4f){
if(!$class.instanceOf(_4f,gara.jswt.SelectionListener)){
throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
}
if(this._selectionListener.contains(_4f)){
this._selectionListener.remove(_4f);
}
},select:function(_50,_51){
if(!$class.instanceOf(_50,gara.jswt.ListItem)){
throw new TypeError("item not instance of gara.jswt.ListItem");
}
if(!_51){
while(this._selection.length){
this._selection.pop().setUnselected();
}
}
if(!this._selection.contains(_50)){
this._selection.push(_50);
_50.setSelected();
this._shiftItem=_50;
this._activateItem(_50);
this.notifySelectionListener();
}
},selectAll:function(){
for(var i=0,len=this._items.length;i<len;++i){
this.select(this._items[i],true);
}
this.update();
},selectRange:function(_54,_55){
if(!$class.instanceOf(_54,gara.jswt.ListItem)){
throw new TypeError("item not instance of gara.jswt.ListItem");
}
if(!_55){
while(this._selection.length){
this._selection.pop().setUnselected();
}
}
var _56=this.indexOf(this._shiftItem);
var _57=this.indexOf(_54);
var _58=_56>_57?_57:_56;
var to=_56<_57?_57:_56;
for(var i=_58;i<=to;++i){
this._selection.push(this._items[i]);
this._items[i].setSelected();
}
this.notifySelectionListener();
this._activateItem(_54);
},toString:function(){
return "[gara.jswt.List]";
},update:function(){
if(this.domref==null){
this.domref=document.createElement("ul");
this.domref.obj=this;
this.domref.control=this;
var _5b={};
for(var _5c in this._listener){
_5b[_5c]=this._listener[_5c].concat([]);
}
this.addListener("mousedown",this);
for(var _5c in _5b){
_5b[_5c].forEach(function(_5d,_5e,arr){
this.registerListener(_5c,_5d);
},this);
}
this._parentNode.appendChild(this.domref);
}
this.domref.className=this._className;
this._items.forEach(function(_60,_61,arr){
if(!_60.isCreated()){
node=_60.create();
this.domref.appendChild(node);
}
if(_60.hasChanged()){
_60.update();
_60.releaseChange();
}
},this);
}});
$class("Tree",{$extends:Control,$constructor:function(_63){
this.$base();
this._showLines=true;
this._shiftItem=null;
this._activeItem=null;
this._parentNode=_63;
this._className=this._baseClass="jsWTTree";
this._selection=[];
this._items=[];
this._firstLevelItems=[];
},_activateItem:function(_64){
if(this._activeItem!=null){
this._activeItem.setActive(false);
}
this._activeItem=_64;
this._activeItem.setActive(true);
this.update();
},_addFirstLevelItem:function(_65){
if(!$class.instanceOf(_65,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
this._firstLevelItems.push(_65);
},_addItem:function(_66){
if(!$class.instanceOf(_66,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
var _67=_66.getParent();
if(_67==this){
this._items.push(_66);
}else{
var _68=this._items.indexOf(_67)+getDescendents(_67)+1;
this._items.splice(_68,0,_66);
}
function getDescendents(_69){
var _6a=0;
if(_69.hasChilds()){
_69.getItems().forEach(function(_6b,_6c,arr){
if(_6b.hasChilds()){
_6a+=getDescendents(_6b);
}
_6a++;
},this);
}
return _6a;
}
},deselect:function(_6e){
if(!$class.instanceOf(_6e,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(this._selection.contains(_6e)&&_6e.getTree()==this){
this._selection.remove(_6e);
this.notifySelectionListener();
_6e.setUnselected();
this._shiftItem=_6e;
this._activateItem(_6e);
}
},deselectAll:function(){
for(var i=this._selection.length;i>=0;--i){
this.deselect(this._selection[i]);
}
this.update();
},handleEvent:function(e){
var obj=e.target.obj||null;
switch(e.type){
case "mousedown":
if(!this._hasFocus){
this.forceFocus();
}
if($class.instanceOf(obj,gara.jswt.TreeItem)){
var _72=obj;
if(e.ctrlKey&&!e.shiftKey){
if(this._selection.contains(_72)){
this.deselect(_72);
}else{
this.select(_72,true);
}
}else{
if(!e.ctrlKey&&e.shiftKey){
this.selectRange(_72,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_72,true);
}else{
this.select(_72,false);
}
}
}
}
break;
case "dblclick":
if($class.instanceOf(obj,gara.jswt.TreeItem)){
var _72=obj;
_72.toggleChilds();
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
var _74;
var _75;
if(this._activeItem==this._items[0]){
_74=false;
}else{
var _76=this._activeItem.getParent();
if(_76==this){
_75=this._firstLevelItems;
}else{
_75=_76.getItems();
}
var _77=_75.indexOf(this._activeItem);
if(_77==0){
_74=_76;
}else{
var _78=_75[_77-1];
_74=getLastItem(_78);
}
}
if(_74){
if(!e.ctrlKey&&!e.shiftKey){
this.select(_74,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_74,true);
}else{
if(e.shiftKey){
this.selectRange(_74,false);
}else{
if(e.ctrlKey){
this._activateItem(_74);
}
}
}
}
}
break;
case 40:
var _79;
var _75;
if(this._activeItem==this._items[this._items.length-1]){
_79=false;
}else{
var _76=this._activeItem.getParent();
if(_76==this){
_75=this._firstLevelItems;
}else{
_75=_76.getItems();
}
var _77=_75.indexOf(this._activeItem);
if(this._activeItem.hasChilds()&&this._activeItem.isExpanded()){
_79=this._activeItem.getItems()[0];
}else{
if(this._activeItem.hasChilds()&&!this._activeItem.isExpanded()){
_79=this._items[this._items.indexOf(this._activeItem)+countItems(this._activeItem)+1];
}else{
_79=this._items[this._items.indexOf(this._activeItem)+1];
}
}
}
if(_79){
if(!e.ctrlKey&&!e.shiftKey){
this.select(_79,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_79,true);
}else{
if(e.shiftKey){
this.selectRange(_79,false);
}else{
if(e.ctrlKey){
this._activateItem(_79);
}
}
}
}
}
break;
case 37:
var _7a=this._activeItem;
this._activeItem.collapse();
this._activateItem(_7a);
this.update();
break;
case 39:
this._activeItem.expand();
this.update();
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
if(!e.ctrlKey&&!e.shiftKey){
this.select(this._items[this._items.length-1],false);
}else{
if(e.shiftKey){
this.selectRange(this._items[this._items.length-1],false);
}else{
if(e.ctrlKey){
this._activateItem(this._items[this._items.length-1]);
}
}
}
break;
}
function getLastItem(_7b){
if(_7b.isExpanded()&&_7b.hasChilds()){
return getLastItem(_7b.getItems()[_7b.getItems().length-1]);
}else{
return _7b;
}
}
function countItems(_7c){
var _7d=0;
var _7e=_7c.getItems();
for(var i=0;i<_7e.length;++i){
_7d++;
if(_7e[i].hasChilds()){
_7d+=countItems(_7e[i]);
}
}
return _7d;
}
},indexOf:function(_80){
if(!$class.instanceOf(_80,gara.jswt.TreeItem)){
throw new TypeError("item not instance of gara.jswt.TreeItem");
}
if(!this._items.contains(_80)){
console.log("des item gibts hier ned: "+_80.getText());
return;
}
return this._items.indexOf(_80);
},notifySelectionListener:function(){
},registerListener:function(_81,_82){
if(this.domref!=null){
gara.eventManager.addListener(this.domref,_81,_82);
}
},select:function(_83,_84){
if(!$class.instanceOf(_83,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(!_84){
while(this._selection.length){
this._selection.pop().setUnselected();
}
}
if(!this._selection.contains(_83)&&_83.getTree()==this){
this._selection.push(_83);
_83.setSelected();
this._shiftItem=_83;
this._activateItem(_83);
this.notifySelectionListener();
}
},selectAll:function(){
this._items.forEach(function(_85,_86,arr){
this.select(_85,true);
},this);
this.update();
},selectRange:function(_88,_89){
if(!$class.instanceOf(_88,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(!_89){
while(this._selection.length){
this._selection.pop().setUnselected();
}
}
var _8a=this.indexOf(this._shiftItem);
var _8b=this.indexOf(_88);
var _8c=_8a>_8b?_8b:_8a;
var to=_8a<_8b?_8b:_8a;
for(var i=_8c;i<=to;++i){
this._selection.push(this._items[i]);
this._items[i].setSelected();
}
this._activateItem(_88);
this.notifySelectionListener();
},toString:function(){
return "[gara.jswt.Tree]";
},update:function(){
if(this.domref==null){
this.domref=document.createElement("ul");
this.domref.obj=this;
this.domref.control=this;
var _8f={};
for(var _90 in this._listener){
_8f[_90]=this._listener[_90].concat([]);
}
this.addListener("mousedown",this);
this.addListener("dblclick",this);
for(var _90 in _8f){
_8f[_90].forEach(function(_91,_92,arr){
this.registerListener(_90,_91);
},this);
}
this._parentNode.appendChild(this.domref);
}
this.removeClassName("jsWTTreeNoLines");
this.removeClassName("jsWTTreeLines");
if(this._showLines){
this.addClassName("jsWTTreeLines");
}else{
this.addClassName("jsWTTreeNoLines");
}
this.domref.className=this._className;
this._updateItems(this._firstLevelItems,this.domref);
},_updateItems:function(_94,_95){
var _96=_94.length;
_94.forEach(function(_97,_98,arr){
var _9a=(_98+1)==_96;
if(!_97.isCreated()){
_97.create(_9a);
_95.appendChild(_97.domref);
}
if(_97.hasChanged()){
_97.update();
_97.releaseChange();
}
if(_97.hasChilds()){
var _9b=_97._getChildContainer();
this._updateItems(_97.getItems(),_9b);
}
if(_9a&&_97.getClassName().indexOf("bottom")==-1){
_97.addClassName("bottom");
if(_97.hasChilds()){
var cc=_97.getChildContainer();
cc.className="bottom";
}
}else{
if(!_9a&&_97.getClassName().indexOf("bottom")!=-1){
_97.removeClassName("bottom");
if(_97.hasChilds()){
var cc=_97.getChildContainer();
cc.className=null;
}
}
}
},this);
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
},setActive:function(_9d){
this._active=_9d;
if(_9d){
this.addClassName("active");
}else{
this.removeClassName("active");
}
this._changed=true;
},setImage:function(_9e){
if(!$class.instanceOf(_9e,Image)){
throw new TypeError("image not instance of Image");
}
this._image=_9e;
this._changed=true;
},setSelected:function(){
this.addClassName("selected");
},setText:function(_9f){
this._text=_9f;
this._changed=true;
},setUnselected:function(){
this.removeClassName("selected");
},toString:function(){
return "[gara.jswt.Item]";
}});
$class("ListItem",{$extends:Item,$constructor:function(_a0){
if(!$class.instanceOf(_a0,gara.jswt.List)){
throw new TypeError("list is not type of gara.jswt.List");
}
this.$base();
this._list=_a0;
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
for(var _a1 in this._listener){
this._listener[_a1].forEach(function(_a2,_a3,arr){
this.registerListener(_a1,_a2);
},this);
}
return this.domref;
},registerListener:function(_a5,_a6){
if(this._img!=null){
gara.eventManager.addListener(this._img,_a5,_a6);
}
if(this._span!=null){
gara.eventManager.addListener(this._span,_a5,_a6);
}
},toString:function(){
return "[gara.jswt.ListItem]";
},update:function(){
if(this.image!=null&&this._img==null){
this._img=document.createElement("img");
this._img.obj=this;
this._img.control=this._list;
this._img.alt=this.sText;
this._img.src=this.image.src;
this.domref.insertBefore(this._img,this._span);
for(var _a7 in this._listener){
this._listener[_a7].forEach(function(_a8,_a9,arr){
this.registerListener(this._img,_a7,_a8);
},this);
}
}else{
if(this.image!=null){
this._img.src=this.image.src;
this._img.alt=this._text;
}else{
if(this._img!=null&&this.image==null){
this.domref.removeChild(this._img);
this._img=null;
for(var _a7 in this._listener){
this._listener[_a7].forEach(function(_ab,_ac,arr){
gara.eventManager.removeListener({domNode:this._img,type:_a7,listener:_ab});
},this);
}
}
}
}
this._spanText.value=this._text;
this.domref.className=this._className;
}});
$class("TreeItem",{$extends:Item,$constructor:function(_ae){
this.$base();
if(!($class.instanceOf(_ae,gara.jswt.Tree)||$class.instanceOf(_ae,gara.jswt.TreeItem))){
throw new TypeError("parentWidget is neither a gara.jswt.Tree or gara.jswt.TreeItem");
}
this._childs=new Array();
this._isExpanded=true;
this._changed=false;
this._childContainer=null;
this._parent=_ae;
this._tree=null;
if($class.instanceOf(_ae,gara.jswt.Tree)){
this._tree=_ae;
this._tree._addFirstLevelItem(this);
}else{
if($class.instanceOf(_ae,gara.jswt.TreeItem)){
this._tree=_ae.getTree();
this._tree._addItem(this);
}
}
_ae._addItem(this);
this._img=null;
this._toggler=null;
this._span=null;
this._spanText=null;
},_addItem:function(_af){
if(!$class.instanceOf(_af,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
this._childs.push(_af);
},collapse:function(){
if(this._childContainer!=null){
this._childContainer.style.display="none";
}
this._deselectChilds();
this._isExpanded=false;
this._changed=true;
},create:function(_b0){
if(_b0){
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
this._toggler.className+=this.hasChilds()?(this.isExpanded()?" togglerExpanded":" togglerCollapsed"):"";
this.domref.appendChild(this._toggler);
if(this._image!=null){
this._img=document.createElement("img");
this._img.obj=this;
this._img.src=this._image.src;
this._img.control=this._tree;
this.domref.appendChild(this._img);
}
this.domref.appendChild(this._span);
if(this.hasChilds()){
this._createChildContainer();
}
},_createChildContainer:function(){
this._childContainer=document.createElement("ul");
if(this.getClassName().indexOf("bottom")!=-1){
this._childContainer.className="bottom";
}
if(this.isExpanded()){
this._childContainer.style.display="block";
}else{
this._childContainer.style.display="none";
}
this.domref.appendChild(this._childContainer);
},_deselectChilds:function(){
this._childs.forEach(function(_b1,_b2,arr){
if(_b1.hasChilds()){
_b1._deselectChilds();
}
this._tree.deselect(_b1);
},this);
},expand:function(){
if(this._childContainer!=null){
this._childContainer.style.display="block";
}
this._isExpanded=true;
this._changed=true;
},_getChildContainer:function(){
if(this._childContainer==null){
this._createChildContainer();
}
return this._childContainer;
},getItemCount:function(){
return this._childs.length;
},getItems:function(){
return this._childs;
},getParent:function(){
return this._parent;
},getTree:function(){
return this._tree;
},hasChilds:function(){
return this._childs.length>0;
},isExpanded:function(){
return this._isExpanded;
},registerListener:function(_b4,_b5){
if(this._img!=null){
gara.eventManager.addListener(this._img,_b4,_b5);
}
if(this._span!=null){
gara.eventManager.addListener(this._span,_b4,_b5);
}
},setActive:function(_b6){
this._active=_b6;
if(_b6){
this._span.className+=" active";
}else{
this._span.className=this._span.className.replace(/ *active/,"");
}
this._changed=true;
},setChildContainer:function(_b7){
this._childContainer=_b7;
},setSelected:function(){
if((this._parent!=this._tree&&this._parent.isExpanded())||this._parent==this._tree){
this._span.className="text selected";
}
},setUnselected:function(){
this._span.className="text";
},toggleChilds:function(){
if(this.isExpanded()){
this.collapse();
}else{
this.expand();
}
if(!this._tree.isFocusControl()){
this._tree.forceFocus();
}
this._tree.update();
},toString:function(){
return "[gara.jswt.TreeItem]";
},update:function(){
if(this.hasChilds()){
this._toggler.className=strReplace(this._toggler.className," togglerCollapsed","");
this._toggler.className=strReplace(this._toggler.className," togglerExpanded","");
if(this.isExpanded()){
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
if(this.hasChilds()&&this._childContainer==null){
this._createChildContainer();
}else{
if(!this.hasChilds()&&this._childContainer!=null){
this.domref.removeChild(this._childContainer);
this._childContainer=null;
}
}
this.domref.className=this._className;
}});
$class("ControlManager",{$implements:FocusListener,$constructor:function(){
this._activeControl=null;
this._controls=[];
gara.eventManager.addListener(window,"keydown",this);
gara.eventManager.addListener(window,"mousedown",this);
},addControl:function(_b8){
if(!this._controls.contains(_b8)){
this._controls.push(_b8);
}
},focusGained:function(_b9){
if(!$class.instanceOf(_b9,gara.jswt.Control)){
throw new TypeError("control is not a gara.jswt.Control");
}
this._activeControl=_b9;
},focusLost:function(_ba){
if(!$class.instanceOf(_ba,gara.jswt.Control)){
throw new TypeError("control is not a gara.jswt.Control");
}
if(this._activeControl==_ba){
this._activeControl=null;
}
},handleEvent:function(e){
if(e.type=="keydown"){
if(this._activeControl!=null&&this._activeControl._handleKeyEvent){
this._activeControl._handleKeyEvent(e);
}
}
if(e.type=="mousedown"){
if(this._activeControl!=null&&e.target.control&&e.target.control!=this._activeControl){
this._activeControl.looseFocus();
this._activeControl=null;
}
}
},removeControl:function(_bc){
if(!$class.instanceOf(_bc,gara.jswt.Control)){
throw new TypeError("control is not a gara.jswt.Control");
}
if(this._controls.contains(_bc)){
if(this._activeControl==_bc){
this._activeControl=null;
}
this._controls.remove(_bc);
}
},toString:function(){
return "[gara.jswt.ControlManager]";
}});
var _32=new ControlManager();
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
delete Tree;
delete ListItem;
delete TreeItem;
delete SelectionListener;
delete Widget;

