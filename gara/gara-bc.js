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
(function(){
$package("gara");
$class("Package",{exports:"",namespace:"",name:"",version:"",$constructor:function(_e){
this.name=_e.name||"gara";
this.imports=_e.imports||"";
this.exports=_e.exports||"";
if(this.name!="gara"){
gara.namespace+="var "+this.name+"=gara."+this.name;
this.name="gara."+this.name;
}
var _f=this.exports.split(",");
_f.forEach(function(v,k,arr){
this.namespace+="var "+v+"="+this.name+"."+v+";";
},this);
}});
$class("EventManager",{_instance:$static(null),$constructor:function(){
this._listeners=[];
base2.DOM.EventTarget(window);
window.addEventListener("unload",this,false);
},getInstance:$static(function(){
if(this._instance==null){
this._instance=new gara.EventManager();
}
return this._instance;
}),addListener:function(_13,_14,_15){
_13.addEventListener(_14,_15,false);
var _16={domNode:_13,type:_14,listener:_15};
this._listeners.push(_16);
return _16;
},handleEvent:function(e){
this._unregisterAllEvents();
},removeListener:function(e){
e.domNode.removeEventListener(e.type,e.listener,false);
if(this._listeners.contains(e)){
this._listeners.remove(e);
}
},_unregisterAllEvents:function(){
while(this._listeners.length>0){
var _19=this._listeners.pop();
this.removeListener(_19);
}
},toString:function(){
return "[gara.EventManager]";
}});
$class("OutOfBoundsException",{$extends:Exception,$constructor:function(_1a){
this.message=String(_1a);
this.name=$class.typeOf(this);
}});
var _1b=gara.onDOMLoaded=function(f){
if(document.addEventListener){
document.addEventListener("DOMContentLoaded",f,false);
}else{
if(window.ActiveX){
document.write("<scr"+"ipt id=__ie_onload defer src=javascript:void(0)></script>");
var _1d=document.getElementById("__ie_onload");
_1d.onreadystatechange=function(){
if(this.readyState=="complete"){
f();
}
};
}else{
if(/WebKit/i.test(navigator.userAgent)){
var _1e=setInterval(function(){
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
var _1f=new gara.Package({exports:"Package,EventManager,OutOfBoundsException",name:"gara"});
gara.namespace=_1f.namespace;
gara.toString=function(){
return "[gara]";
};
$package("");
})();
(function(){
$package("gara.jswt");
$class("JSWT",{ABORT:$static(1<<9),APPLICATION_MODAL:$static(1<<16),BOTTOM:$static(1<<10),CANCEL:$static(1<<8),CLOSE:$static(1<<6),DEFAULT:$static(0),DOWN:$static(1<<10),DRAG:$static(1),FULL_SELECTION:$static(1<<16),IGNORE:$static(1<<11),MENU:$static(1<<6),MULTI:$static(1<<1),NO:$static(1<<7),OK:$static(1<<5),RETRY:$static(1<<10),SINGLE:$static(1<<2),SYSTEM_MODAL:$static(1<<17),TOP:$static(1<<7),UP:$static(1<<7),YES:$static(1<<6),$constructor:function(){
}});
var _20=gara.jswt.JSWT;
$interface("FocusListener",{focusGained:function(){
},focusLost:function(){
},toString:function(){
return "[gara.jswt.FocusListener]";
}});
$interface("SelectionListener",{widgetSelected:function(_21){
},toString:function(){
return "[gara.jswt.SelectionListener]";
}});
$class("ItemNotExistsException",{$extends:gara.jswt.Exception,$constructor:function(_22){
this.message=String(_22);
this.name=$class.typeOf(this);
}});
function strReplace(_23,_24,_25){
output=""+_23;
while(output.indexOf(_24)>-1){
pos=output.indexOf(_24);
output=""+(output.substring(0,pos)+_25+output.substring((pos+_24.length),output.length));
}
return output;
}
$class("Widget",{domref:null,$constructor:function(){
this.domref=null;
this._className="";
this._baseClass="";
this._listener={};
},addClassName:function(_26){
this._className+=" "+_26;
this._changed=true;
},addListener:function(_27,_28){
if(!this._listener.hasOwnProperty(_27)){
this._listener[_27]=new Array();
}
this._listener[_27].push(_28);
this.registerListener(_27,_28);
},getClassName:function(){
return this._className;
},hasClassName:function(_29){
return this._className.indexOf(_29)!=-1;
},_notifyExternalKeyboardListener:function(e,obj,_2c){
if(this._listener.hasOwnProperty(e.type)){
var _2d=this._listener[e.type];
_2d.forEach(function(_2e,_2f,arr){
e.target.obj=obj;
e.target.control=_2c;
if(typeof (_2e)=="object"&&_2e.handleEvent){
_2e.handleEvent(e);
}else{
if(typeof (_2e)=="function"){
eval(_2e+"()");
}
}
});
}
},registerListener:$abstract(function(_31,_32){
}),removeClassName:function(_33){
this._className=strReplace(this._className,_33,"");
this._changed=true;
},removeListener:function(_34,_35){
this._listener[_34].remove(_35);
},toString:function(){
return "[gara.jswt.Widget]";
}});
$class("Control",{$extends:gara.jswt.Widget,$constructor:function(_36,_37){
this.$base();
this._parent=_36;
this._style=typeof (_37)=="undefined"?gara.jswt.DEFAULT:_37;
this._focusListener=[];
this._hasFocus=false;
gara.jswt.ControlManager.getInstance().addControl(this);
this.addFocusListener(gara.jswt.ControlManager.getInstance());
},addFocusListener:function(_38){
if(!$class.implementationOf(_38,gara.jswt.FocusListener)){
throw new TypeError("listener is not a gara.jswt.FocusListener");
}
this._focusListener.push(_38);
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
},removeFocusListener:function(_3e){
if(!_3e.$class.implementsInterface(gara.jswt.FocusListener)){
throw new TypeError("listener is not a gara.jswt.FocusListener");
}
if(this._focusListener.contains(_3e)){
this._focusListener.remove(_3e);
}
},toString:function(){
return "[gara.jswt.Control";
},update:$abstract(function(){
})});
$class("Composite",{$extends:gara.jswt.Control,$constructor:function(_3f,_40){
this.$base(_3f,_40);
}});
$class("List",{$extends:gara.jswt.Control,$constructor:function(_41,_42){
this.$base(_41,_42);
if(this._style==_20.DEFAULT){
this._style=_20.SINGLE;
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
case "keyup":
case "keydown":
case "keypress":
this._items.forEach(function(_4d,_4e,arr){
_4d.handleEvent(e);
});
this._notifyExternalKeyboardListener(e,this,this);
if(e.type=="keydown"){
this._handleKeyEvent(e);
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
var _51=false;
var _52=this.indexOf(this._activeItem);
if(_52!=0){
_51=this._items[_52-1];
}
if(_51){
if(!e.ctrlKey&&!e.shiftKey){
this.select(_51,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_51,true);
}else{
if(e.shiftKey){
this.selectRange(_51,false);
}else{
if(e.ctrlKey){
this._activateItem(_51);
}
}
}
}
}
break;
case 40:
var _53=false;
var _52=this.indexOf(this._activeItem);
if(_52!=this._items.length-1){
_53=this._items[_52+1];
}
if(_53){
if(!e.ctrlKey&&!e.shiftKey){
this.select(_53,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_53,true);
}else{
if(e.shiftKey){
this.selectRange(_53,false);
}else{
if(e.ctrlKey){
this._activateItem(_53);
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
var _54=this._items.length-1;
if(!e.ctrlKey&&!e.shiftKey){
this.select(this._items[_54],false);
}else{
if(e.shiftKey){
this.selectRange(this._items[_54],false);
}else{
if(e.ctrlKey){
this._activateItem(this._items[_54]);
}
}
}
break;
}
},indexOf:function(_55){
if(!$class.instanceOf(_55,gara.jswt.ListItem)){
throw new TypeError("item not instance of gara.jswt.ListItem");
}
if(!this._items.contains(_55)){
throw new gara.jswt.ItemNotExistsException("item ["+_55+"] does not exists in this list");
return;
}
return this._items.indexOf(_55);
},notifySelectionListener:function(){
for(var i=0,len=this._selectionListener.length;i<len;++i){
this._selectionListener[i].widgetSelected(this);
}
},registerListener:function(_58,_59){
if(this.domref!=null){
gara.EventManager.getInstance().addListener(this.domref,_58,_59);
}
},removeSelectionListener:function(_5a){
if(!$class.instanceOf(_5a,gara.jswt.SelectionListener)){
throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
}
if(this._selectionListener.contains(_5a)){
this._selectionListener.remove(_5a);
}
},select:function(_5b,_5c){
if(!$class.instanceOf(_5b,gara.jswt.ListItem)){
throw new TypeError("item not instance of gara.jswt.ListItem");
}
if(!_5c||(this._style&gara.jswt.SINGLE)==gara.jswt.SINGLE){
while(this._selection.length){
this._selection.pop().setUnselected();
}
}
if(!this._selection.contains(_5b)){
this._selection.push(_5b);
_5b.setSelected();
this._shiftItem=_5b;
this._activateItem(_5b);
this.notifySelectionListener();
}
},selectAll:function(){
for(var i=0,len=this._items.length;i<len;++i){
this.select(this._items[i],true);
}
this.update();
},selectRange:function(_5f,_60){
if(!$class.instanceOf(_5f,gara.jswt.ListItem)){
throw new TypeError("item not instance of gara.jswt.ListItem");
}
if(!_60){
while(this._selection.length){
this._selection.pop().setUnselected();
}
}
if((this._style&_20.MULTI)==_20.MULTI){
var _61=this.indexOf(this._shiftItem);
var _62=this.indexOf(_5f);
var _63=_61>_62?_62:_61;
var to=_61<_62?_62:_61;
for(var i=_63;i<=to;++i){
this._selection.push(this._items[i]);
this._items[i].setSelected();
}
this._activateItem(_5f);
this.notifySelectionListener();
}else{
this.select(_5f);
}
},toString:function(){
return "[gara.jswt.List]";
},update:function(){
if(this.domref==null){
this.domref=document.createElement("ul");
this.domref.obj=this;
this.domref.control=this;
base2.DOM.EventTarget(this.domref);
var _66={};
for(var _67 in this._listener){
_66[_67]=this._listener[_67].concat([]);
}
this.addListener("mousedown",this);
for(var _67 in _66){
_66[_67].forEach(function(_68,_69,arr){
this.registerListener(_67,_68);
},this);
}
if(!$class.instanceOf(this._parent,gara.jswt.Composite)){
this._parent.appendChild(this.domref);
}
}
this.removeClassName("jsWTListFullSelection");
if((this._style&_20.FULL_SELECTION)==_20.FULL_SELECTION){
this.addClassName("jsWTListFullSelection");
}
this.domref.className=this._className;
this._items.forEach(function(_6b,_6c,arr){
if(!_6b.isCreated()){
node=_6b.create();
this.domref.appendChild(node);
}
if(_6b.hasChanged()){
_6b.update();
_6b.releaseChange();
}
},this);
}});
$class("Tree",{$extends:gara.jswt.Composite,$constructor:function(_6e,_6f){
this.$base(_6e,_6f);
if(this._style==_20.DEFAULT){
this._style=_20.SINGLE;
}
this._showLines=true;
this._shiftItem=null;
this._activeItem=null;
this._className=this._baseClass="jsWTTree";
this._selection=[];
this._selectionListeners=[];
this._items=[];
this._firstLevelItems=[];
},_activateItem:function(_70){
if(!$class.instanceOf(_70,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(this._activeItem!=null){
this._activeItem.setActive(false);
}
this._activeItem=_70;
this._activeItem.setActive(true);
this.update();
},_addItem:function(_71){
if(!$class.instanceOf(_71,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
var _72=_71.getParentItem();
if(_72==null){
this._items.push(_71);
this._firstLevelItems.push(_71);
}else{
var _73=this._items.indexOf(_72)+getDescendents(_72)+1;
this._items.splice(_73,0,_71);
}
function getDescendents(_74){
var _75=0;
if(_74.getItemCount()>0){
_74.getItems().forEach(function(_76,_77,arr){
if(_76.getItemCount()>0){
_75+=getDescendents(_76);
}
_75++;
},this);
}
return _75;
}
},addSelectionListener:function(_79){
if(!$class.instanceOf(item,gara.jswt.SelectionListener)){
throw new TypeError("listener is not type of gara.jswt.SelectionListener");
}
if(!this._selectionListeners.contains(_79)){
this._selectionListeners.push(_79);
}
},deselect:function(_7a){
if(!$class.instanceOf(_7a,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(this._selection.contains(_7a)&&_7a.getParent()==this){
this._selection.remove(_7a);
this._notifySelectionListener();
_7a.setChecked(false);
this._shiftItem=_7a;
this._activateItem(_7a);
}
},deselectAll:function(){
for(var i=this._selection.length;i>=0;--i){
this.deselect(this._selection[i]);
}
this.update();
},getItem:function(_7c){
if(_7c>=this._items.length){
throw new gara.OutOfBoundsException("Your item lives outside of this Tree");
}
return this._items[_7c];
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
var _7f=null;
if($class.instanceOf(obj,gara.jswt.TreeItem)){
_7f=obj;
}
switch(e.type){
case "mousedown":
if(!this._hasFocus){
this.forceFocus();
}
if(_7f!=null){
if(e.ctrlKey&&!e.shiftKey){
if(this._selection.contains(_7f)){
this.deselect(_7f);
}else{
this._select(_7f,true);
}
}else{
if(!e.ctrlKey&&e.shiftKey){
this._selectShift(_7f,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this._selectShift(_7f,true);
}else{
this._select(_7f,false);
}
}
}
}
break;
case "dblclick":
break;
case "keyup":
case "keydown":
case "keypress":
this._items.forEach(function(_80,_81,arr){
_80.handleEvent(e);
});
this._notifyExternalKeyboardListener(e,this,this);
if(e.type=="keydown"){
this._handleKeyEvent(e);
}
break;
}
if(_7f!=null){
_7f.handleEvent(e);
}
e.stopPropagation();
},_handleKeyEvent:function(e){
if(this._activeItem==null){
return;
}
switch(e.keyCode){
case 38:
var _84;
if(this._activeItem==this._items[0]){
_84=false;
}else{
var _85;
var _86=this._activeItem.getParentItem();
if(_86==null){
_85=this._firstLevelItems;
}else{
_85=_86.getItems();
}
var _87=_85.indexOf(this._activeItem);
if(_87==0){
_84=_86;
}else{
var _88=_85[_87-1];
_84=getLastItem(_88);
}
}
if(_84){
if(!e.ctrlKey&&!e.shiftKey){
this._select(_84,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this._selectShift(_84,true);
}else{
if(e.shiftKey){
this._selectShift(_84,false);
}else{
if(e.ctrlKey){
this._activateItem(_84);
}
}
}
}
}
break;
case 40:
var _89;
var _85;
if(this._activeItem==this._items[this._items.length-1]){
_89=false;
}else{
var _86=this._activeItem.getParentItem();
if(_86==null){
_85=this._firstLevelItems;
}else{
_85=_86.getItems();
}
var _87=_85.indexOf(this._activeItem);
if(this._activeItem.getItemCount()>0&&this._activeItem.getExpanded()){
_89=this._activeItem.getItems()[0];
}else{
if(this._activeItem.getItemCount()>0&&!this._activeItem.getExpanded()){
_89=this._items[this._items.indexOf(this._activeItem)+countItems(this._activeItem)+1];
}else{
_89=this._items[this._items.indexOf(this._activeItem)+1];
}
}
}
if(_89){
if(!e.ctrlKey&&!e.shiftKey){
this._select(_89,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this._selectShift(_89,true);
}else{
if(e.shiftKey){
this._selectShift(_89,false);
}else{
if(e.ctrlKey){
this._activateItem(_89);
}
}
}
}
}
break;
case 37:
var _8a=this._activeItem;
this._activeItem.setExpanded(false);
this._activateItem(_8a);
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
function getLastItem(_8b){
if(_8b.getExpanded()&&_8b.getItemCount()>0){
return getLastItem(_8b.getItems()[_8b.getItemCount()-1]);
}else{
return _8b;
}
}
function countItems(_8c){
var _8d=0;
var _8e=_8c.getItems();
for(var i=0;i<_8e.length;++i){
_8d++;
if(_8e[i].getItemCount()>0){
_8d+=countItems(_8e[i]);
}
}
return _8d;
}
},indexOf:function(_90){
if(!$class.instanceOf(_90,gara.jswt.TreeItem)){
throw new TypeError("item not instance of gara.jswt.TreeItem");
}
if(!this._items.contains(_90)){
throw new gara.jswt.ItemNotExistsException("item ["+_90+"] does not exists in this list");
console.log("des item gibts hier ned: "+_90.getText());
return;
}
return this._items.indexOf(_90);
},_notifySelectionListener:function(){
this._selectionListeners.forEach(function(_91,_92,arr){
_91.widgetSelected(this);
},this);
},registerListener:function(_94,_95){
if(this.domref!=null){
gara.EventManager.getInstance().addListener(this.domref,_94,_95);
}
},removeSelectionListener:function(_96){
if(!$class.instanceOf(item,gara.jswt.SelectionListener)){
throw new TypeError("item is not type of gara.jswt.SelectionListener");
}
if(this._selectionListeners.contains(_96)){
this._selectionListeners.remove(_96);
}
},_select:function(_97,_98){
if(!$class.instanceOf(_97,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(!_98||(this._style&_20.SINGLE)==_20.SINGLE){
while(this._selection.length){
this._selection.pop().setChecked(false);
}
}
if(!this._selection.contains(_97)&&_97.getParent()==this){
this._selection.push(_97);
_97.setChecked(true);
this._shiftItem=_97;
this._activateItem(_97);
this._notifySelectionListener();
}
},selectAll:function(){
this._items.forEach(function(_99,_9a,arr){
this._select(_99,true);
},this);
this.update();
},_selectShift:function(_9c,_9d){
if(!$class.instanceOf(_9c,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(!_9d){
while(this._selection.length){
this._selection.pop().setChecked(false);
}
}
if((this._style&_20.MULTI)==_20.MULTI){
var _9e=this.indexOf(this._shiftItem);
var _9f=this.indexOf(_9c);
var _a0=_9e>_9f?_9f:_9e;
var to=_9e<_9f?_9f:_9e;
for(var i=_a0;i<=to;++i){
this._selection.push(this._items[i]);
this._items[i].setChecked(true);
}
this._activateItem(_9c);
this._notifySelectionListener();
}else{
this._select(_9c);
}
},setLinesVisible:function(_a3){
this._showLines=_a3;
},toString:function(){
return "[gara.jswt.Tree]";
},update:function(){
if(this.domref==null){
this.domref=document.createElement("ul");
this.domref.obj=this;
this.domref.control=this;
base2.DOM.EventTarget(this._domref);
var _a4={};
for(var _a5 in this._listener){
_a4[_a5]=this._listener[_a5].concat([]);
}
this.addListener("mousedown",this);
this.addListener("dblclick",this);
for(var _a5 in _a4){
_a4[_a5].forEach(function(_a6,_a7,arr){
this.registerListener(_a5,_a6);
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
if((this._style&_20.FULL_SELECTION)==_20.FULL_SELECTION){
this.addClassName("jsWTTreeFullSelection");
}
this.domref.className=this._className;
this._updateItems(this._firstLevelItems,this.domref);
},_updateItems:function(_a9,_aa){
var _ab=_a9.length;
_a9.forEach(function(_ac,_ad,arr){
var _af=(_ad+1)==_ab;
if(!_ac.isCreated()){
_ac.create(_af);
_aa.appendChild(_ac.domref);
}
if(_ac.hasChanged()){
_ac.update();
_ac.releaseChange();
}
if(_ac.getItemCount()>0){
var _b0=_ac._getChildContainer();
this._updateItems(_ac.getItems(),_b0);
}
if(_af&&_ac.getClassName().indexOf("bottom")==-1){
_ac.addClassName("bottom");
if(_ac.getItemCount()>0){
var cc=_ac._getChildContainer();
cc.className="bottom";
}
}else{
if(!_af&&_ac.getClassName().indexOf("bottom")!=-1){
_ac.removeClassName("bottom");
if(_ac.getItemCount()>0){
var cc=_ac._getChildContainer();
cc.className=null;
}
}
}
},this);
}});
$class("TabFolder",{$extends:gara.jswt.Composite,$constructor:function(_b2,_b3){
this.$base(_b2,_b3);
if(this._style==_20.DEFAULT){
this._style=_20.TOP;
}
this._items=[];
this._activeItem=null;
this._selectionListener=[];
this._selection=[];
this._tabbar=null;
this._clientArea=null;
this._className=this._baseClass="jsWTTabFolder";
},_addItem:function(_b4){
if(!$class.instanceOf(_b4,gara.jswt.TabItem)){
throw new TypeError("item is not type of gara.jswt.TabItem");
}
var _b5=this.getItemCount();
this._items.push(_b4);
},addSelectionListener:function(_b6){
if(!$class.instanceOf(_b6,gara.jswt.SelectionListener)){
throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
}
this._selectionListener.push(_b6);
},_activateItem:function(_b7){
if(!$class.instanceOf(_b7,gara.jswt.TabItem)){
throw new TypeError("item is not type of gara.jswt.TabItem");
}
if(this._activeItem!=null){
this._activeItem.setActive(false);
}
this._activeItem=_b7;
_b7._setActive(true);
for(var i=0,len=this._clientArea.childNodes.length;i<len;++i){
this._clientArea.removeChild(this._clientArea.childNodes[i]);
}
if(_b7.getControl()!=null){
_b7.getControl().update();
this._clientArea.appendChild(_b7.getControl().domref);
}else{
if(typeof (_b7.getContent())=="string"){
this._clientArea.appendChild(document.createTextNode(_b7.getContent()));
}else{
this._clientArea.appendChild(_b7.getContent());
}
}
this.update();
this._selection=[];
this._selection.push(_b7);
this._notifySelectionListener();
},getClientArea:function(){
return this._clientArea;
},getItem:function(_ba){
if(_ba>=this._items.length){
throw new gara.OutOfBoundsException("Your item lives outside of this tabfolder");
}
return this._items[_ba];
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
var _bd=obj;
this._activateItem(_bd);
}
break;
case "keyup":
case "keydown":
case "keypress":
this._items.forEach(function(_be,_bf,arr){
_be.handleEvent(e);
});
this._notifyExternalKeyboardListener(e,this,this);
break;
}
if(e.target!=this.domref){
e.stopPropagation();
}
},indexOf:function(_c1){
if(!$class.instanceOf(_c1,gara.jswt.TabItem)){
throw new TypeError("item not instance of gara.jswt.TabItem");
}
if(!this._items.contains(_c1)){
throw new gara.jswt.ItemNotExistsException("item ["+_c1+"] does not exists in this list");
}
return this._items.indexOf(_c1);
},_notifySelectionListener:function(){
for(var i=0,len=this._selectionListener.length;i<len;++i){
this._selectionListener[i].widgetSelected(this);
}
},registerListener:function(_c4,_c5){
if(this.domref!=null){
gara.EventManager.getInstance().addListener(this.domref,_c4,_c5);
}
},removeSelectionListener:function(_c6){
if(!$class.instanceOf(_c6,gara.jswt.SelectionListener)){
throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
}
if(this._selectionListener.contains(_c6)){
this._selectionListener.remove(_c6);
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
},_showContent:function(_c8){
},toString:function(){
return "[gara.jswt.TabFolder]";
},update:function(){
var _c9=false;
if(this.domref==null){
this.domref=document.createElement("div");
this.domref.obj=this;
this.domref.control=this;
base2.DOM.EventTarget(this.domref);
this._tabbar=document.createElement("ul");
this._tabbar.obj=this;
this._tabbar.control=this;
base2.DOM.EventTarget(this._tabbar);
this._clientArea=document.createElement("div");
this._clientArea.className="jsWTTabClientArea";
base2.DOM.EventTarget(this._clientArea);
if(this._style==_20.TOP){
this.domref.appendChild(this._tabbar);
this.domref.appendChild(this._clientArea);
this._tabbar.className="jsWTTabbar jsWTTabbarTop";
}else{
this.domref.appendChild(this._clientArea);
this.domref.appendChild(this._tabbar);
this._tabbar.className="jsWTTabbar jsWTTabbarBottom";
}
var _ca={};
for(var _cb in this._listener){
_ca[_cb]=this._listener[_cb].concat([]);
}
this.addListener("mousedown",this);
for(var _cb in _ca){
_ca[_cb].forEach(function(_cc,_cd,arr){
this.registerListener(_cb,_cc);
},this);
}
if(!$class.instanceOf(this._parent,gara.jswt.Composite)){
this._parent.appendChild(this.domref);
}
_c9=true;
}
this.domref.className=this._className;
this._items.forEach(function(_cf,_d0,arr){
if(!_cf.isCreated()){
node=_cf._create();
this._tabbar.appendChild(node);
}
if(_cf.hasChanged()){
_cf.update();
_cf.releaseChange();
}
},this);
if(_c9&&this._items.length){
this._activateItem(this._items[0]);
}
}});
$class("Item",{$extends:gara.jswt.Widget,$constructor:function(){
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
},setActive:function(_d2){
this._active=_d2;
if(_d2){
this.addClassName("active");
}else{
this.removeClassName("active");
}
this._changed=true;
},setImage:function(_d3){
this._image=_d3;
this._changed=true;
},setSelected:function(){
this.addClassName("selected");
},setText:function(_d4){
this._text=_d4;
this._changed=true;
},setUnselected:function(){
this.removeClassName("selected");
},toString:function(){
return "[gara.jswt.Item]";
}});
$class("ListItem",{$extends:gara.jswt.Item,$constructor:function(_d5){
if(!$class.instanceOf(_d5,gara.jswt.List)){
throw new TypeError("list is not type of gara.jswt.List");
}
this.$base();
this._list=_d5;
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
base2.DOM.EventTarget(this.domref);
base2.DOM.EventTarget(this._span);
for(var _d6 in this._listener){
this._listener[_d6].forEach(function(_d7,_d8,arr){
this.registerListener(_d6,_d7);
},this);
}
this._changed=false;
return this.domref;
},handleEvent:function(e){
switch(e.type){
case "keyup":
case "keydown":
case "keypress":
this._notifyExternalKeyboardListener(e,this,this._list);
break;
}
},registerListener:function(_db,_dc){
if(this._img!=null){
gara.EventManager.getInstance().addListener(this._img,_db,_dc);
}
if(this._span!=null){
gara.EventManager.getInstance().addListener(this._span,_db,_dc);
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
base2.DOM.EventTarget(this._img);
for(var _dd in this._listener){
this._listener[_dd].forEach(function(_de,_df,arr){
this.registerListener(this._img,_dd,_de);
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
for(var _dd in this._listener){
this._listener[_dd].forEach(function(_e1,_e2,arr){
gara.EventManager.getInstance().removeListener({domNode:this._img,type:_dd,listener:_e1});
},this);
}
}
}
}
this._spanText.nodeValue=this._text;
this.domref.className=this._className;
}});
$class("TreeItem",{$extends:gara.jswt.Item,$constructor:function(_e4){
this.$base();
if(!($class.instanceOf(_e4,gara.jswt.Tree)||$class.instanceOf(_e4,gara.jswt.TreeItem))){
throw new TypeError("parentWidget is neither a gara.jswt.Tree or gara.jswt.TreeItem");
}
this._items=new Array();
this._expanded=true;
this._checked=false;
this._changed=false;
this._childContainer=null;
this._parent=_e4;
this._tree=null;
if($class.instanceOf(_e4,gara.jswt.Tree)){
this._tree=_e4;
}else{
if($class.instanceOf(_e4,gara.jswt.TreeItem)){
this._tree=_e4.getParent();
_e4._addItem(this);
}
}
this._tree._addItem(this);
this._img=null;
this._toggler=null;
this._span=null;
this._spanText=null;
},_addItem:function(_e5){
if(!$class.instanceOf(_e5,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
this._items.push(_e5);
},create:function(_e6){
if(_e6){
this.addClassName("bottom");
}
this.domref=document.createElement("li");
this.domref.className=this._className;
this.domref.obj=this;
this.domref.control=this._tree;
base2.DOM.EventTarget(this.domref);
this._toggler=document.createElement("span");
this._toggler.obj=this;
this._toggler.control=this._tree;
base2.DOM.EventTarget(this._toggler);
this._span=document.createElement("span");
this._span.obj=this;
this._span.control=this._tree;
this._span.className="text";
this._spanText=document.createTextNode(this._text);
this._span.appendChild(this._spanText);
base2.DOM.EventTarget(this._span);
this._toggler.className="toggler";
this._toggler.className+=this._hasChilds()?(this._expanded?" togglerExpanded":" togglerCollapsed"):"";
this.domref.appendChild(this._toggler);
if(this._image!=null){
this._img=document.createElement("img");
this._img.obj=this;
this._img.src=this._image.src;
this._img.control=this._tree;
base2.DOM.EventTarget(this._img);
this.domref.appendChild(this._img);
}
this.domref.appendChild(this._span);
if(this._hasChilds()){
this._createChildContainer();
}
for(var _e7 in this._listeners){
this._listeners[_e7].forEach(function(_e8,_e9,arr){
this.registerListener(_e7,_e8);
},this);
}
},_createChildContainer:function(){
this._childContainer=document.createElement("ul");
base2.DOM.EventTarget(this._childContainer);
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
this._items.forEach(function(_eb,_ec,arr){
if(_eb._hasChilds()){
_eb._deselectItems();
}
this._tree.deselect(_eb);
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
},getItem:function(_ee){
if(_ee>=this._items.length){
throw new gara.OutOfBoundsException("Your item lives outside of this Tree");
}
return this._items[_ee];
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
var _f1=obj;
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
var _f1=obj;
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
case "keyup":
case "keydown":
case "keypress":
this._notifyExternalKeyboardListener(e,this,this._tree);
break;
}
},indexOf:function(_f2){
if(!$class.instanceOf(_f2,gara.jswt.TreeItem)){
throw new TypeError("item not instance of gara.jswt.TreeItem");
}
if(!this._items.contains(_f2)){
throw new gara.jswt.ItemNotExistsException("item ["+_f2+"] does not exists in this list");
return;
}
return this._items.indexOf(_f2);
},registerListener:function(_f3,_f4){
if(this._img!=null){
gara.EventManager.getInstance().addListener(this._img,_f3,_f4);
}
if(this._span!=null){
gara.EventManager.getInstance().addListener(this._span,_f3,_f4);
}
},removeAll:function(){
this._items=[];
},setActive:function(_f5){
this._active=_f5;
if(_f5){
this._span.className+=" active";
}else{
this._span.className=this._span.className.replace(/ *active/,"");
}
this._changed=true;
},setChecked:function(_f6){
if(_f6){
this._span.className="text selected";
}else{
this._span.className="text";
}
this._checked=_f6;
},setExpanded:function(_f7){
this._expanded=_f7;
if(!_f7){
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
base2.DOM.EventTarget(this._img);
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
$class("TabItem",{$extends:gara.jswt.Item,$constructor:function(_f8){
this.$base();
if(!$class.instanceOf(_f8,gara.jswt.TabFolder)){
throw new TypeError("parentWidget is neither a gara.jswt.TabFolder");
}
this._parent=_f8;
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
if(this._toolTipText!=null){
this.domref.title=this._toolTipText;
}
base2.DOM.EventTarget(this.domref);
if(this.image!=null){
this._img=document.createElement("img");
this._img.obj=this;
this._img.control=this._parent;
this._img.src=this.image.src;
this._img.alt=this._text;
base2.DOM.EventTarget(this._img);
this.domref.appendChild(this._img);
}
this._spanText=document.createTextNode(this._text);
this._span=document.createElement("span");
this._span.obj=this;
this._span.control=this._parent;
this._span.appendChild(this._spanText);
this.domref.appendChild(this._span);
base2.DOM.EventTarget(this._span);
for(var _f9 in this._listener){
this._listener[_f9].forEach(function(_fa,_fb,arr){
this.registerListener(_f9,_fa);
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
},handleEvent:function(e){
switch(e.type){
case "keyup":
case "keydown":
case "keypress":
this._notifyExternalKeyboardListener(e,this,this._parent);
break;
}
},registerListener:function(){
if(this.domref!=null){
gara.EventManager.getInstance().addListener(this.domref,eventType,listener);
}
},_setActive:function(_fe){
this._active=_fe;
if(_fe){
this._className+=" active";
}else{
this._className=this._className.replace(/ *active/,"");
}
this._changed=true;
},setContent:function(_ff){
this._content=_ff;
this._changed=true;
},setControl:function(_100){
if(!$class.instanceOf(_100,gara.jswt.Control)){
throw new TypeError("control is not instance of gara.jswt.Control");
}
this._control=_100;
},setToolTipText:function(text){
this._toolTipText=text;
this._changed=true;
},update:function(){
if(this._image!=null&&this._img==null){
this._img=document.createElement("img");
this._img.obj=this;
this._img.control=this._parent;
this._img.alt=this._text;
this._img.src=this._image.src;
this.domref.insertBefore(this._img,this._span);
base2.DOM.EventTarget(this._img);
for(var _102 in this._listener){
this._listener[_102].forEach(function(elem,_104,arr){
this.registerListener(this._img,_102,elem);
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
for(var _102 in this._listener){
this._listener[_102].forEach(function(elem,_107,arr){
gara.EventManager.getInstance().removeListener({domNode:this._img,type:_102,listener:elem});
},this);
}
}
}
}
this._spanText.nodeValue=this._text;
this.domref.className=this._className;
if(this._toolTipText!=null){
this.domref.title=this._toolTipText;
}
}});
$class("ControlManager",{$implements:gara.jswt.FocusListener,_instance:$static(null),$constructor:function(){
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
}),addControl:function(_109){
if(!this._controls.contains(_109)){
this._controls.push(_109);
}
},focusGained:function(_10a){
if(!$class.instanceOf(_10a,gara.jswt.Control)){
throw new TypeError("control is not a gara.jswt.Control");
}
if(this._activeControl!=null&&this._activeControl!=_10a){
this._activeControl.looseFocus();
}
this._activeControl=_10a;
},focusLost:function(_10b){
if(!$class.instanceOf(_10b,gara.jswt.Control)){
throw new TypeError("control is not a gara.jswt.Control");
}
if(this._activeControl==_10b){
this._activeControl=null;
}
},handleEvent:function(e){
if(e.type=="keydown"){
if(this._activeControl!=null&&this._activeControl.handleEvent){
this._activeControl.handleEvent(e);
}
}
if(e.type=="mousedown"){
if(this._activeControl!=null&&(e.target.control?e.target.control!=this._activeControl:true)){
this._activeControl.looseFocus();
this._activeControl=null;
}
}
},removeControl:function(_10d){
if(!$class.instanceOf(_10d,gara.jswt.Control)){
throw new TypeError("control is not a gara.jswt.Control");
}
if(this._controls.contains(_10d)){
if(this._activeControl==_10d){
this._activeControl=null;
}
this._controls.remove(_10d);
}
},toString:function(){
return "[gara.jswt.ControlManager]";
}});
var _10e=new gara.Package({name:"jswt",exports:"JSWT,ControlManager,Widget,Control,Composite,Item,List,ListItem,Tree,TreeItem,TabFolder,TabItem,FocusListener,SelectionListener",});
gara.jswt.namespace=_10e.namespace;
gara.jswt.toString=function(){
return "[gara.jswt]";
};
$package("");
})();

