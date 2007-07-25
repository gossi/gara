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
this._selectionListeners=[];
this._items=[];
this._firstLevelItems=[];
},_activateItem:function(_64){
if(!$class.instanceOf(_64,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(this._activeItem!=null){
this._activeItem.setActive(false);
}
this._activeItem=_64;
this._activeItem.setActive(true);
this.update();
},_addItem:function(_65){
if(!$class.instanceOf(_65,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
var _66=_65.getParentItem();
if(_66==null){
this._items.push(_65);
this._firstLevelItems.push(_65);
}else{
var _67=this._items.indexOf(_66)+getDescendents(_66)+1;
this._items.splice(_67,0,_65);
}
function getDescendents(_68){
var _69=0;
if(_68.getItemCount()>0){
_68.getItems().forEach(function(_6a,_6b,arr){
if(_6a.getItemCount()>0){
_69+=getDescendents(_6a);
}
_69++;
},this);
}
return _69;
}
},addSelectionListener:function(_6d){
if(!$class.instanceOf(item,gara.jswt.SelectionListener)){
throw new TypeError("listener is not type of gara.jswt.SelectionListener");
}
if(!this._selectionListeners.contains(_6d)){
this._selectionListeners.push(_6d);
}
},deselect:function(_6e){
if(!$class.instanceOf(_6e,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(this._selection.contains(_6e)&&_6e.getParent()==this){
this._selection.remove(_6e);
this._notifySelectionListener();
_6e.setChecked(false);
this._shiftItem=_6e;
this._activateItem(_6e);
}
},deselectAll:function(){
for(var i=this._selection.length;i>=0;--i){
this.deselect(this._selection[i]);
}
this.update();
},getItem:function(_70){
if(_70>=this._items.length){
throw new gara.OutOfBoundsException("Your item lives outside of this Tree");
}
return this._items[_70];
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
var _73=null;
if($class.instanceOf(obj,gara.jswt.TreeItem)){
_73=obj;
}
switch(e.type){
case "mousedown":
if(!this._hasFocus){
this.forceFocus();
}
if(_73!=null){
if(e.ctrlKey&&!e.shiftKey){
if(this._selection.contains(_73)){
this.deselect(_73);
}else{
this._select(_73,true);
}
}else{
if(!e.ctrlKey&&e.shiftKey){
this._selectShift(_73,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this._selectShift(_73,true);
}else{
this._select(_73,false);
}
}
}
}
break;
case "dblclick":
break;
}
if(_73!=null){
_73.handleEvent(e);
}
e.stopPropagation();
},_handleKeyEvent:function(e){
if(this._activeItem==null){
return;
}
switch(e.keyCode){
case 38:
var _75;
if(this._activeItem==this._items[0]){
_75=false;
}else{
var _76;
var _77=this._activeItem.getParentItem();
if(_77==null){
_76=this._firstLevelItems;
}else{
_76=_77.getItems();
}
var _78=_76.indexOf(this._activeItem);
if(_78==0){
_75=_77;
}else{
var _79=_76[_78-1];
_75=getLastItem(_79);
}
}
if(_75){
if(!e.ctrlKey&&!e.shiftKey){
this._select(_75,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this._selectShift(_75,true);
}else{
if(e.shiftKey){
this._selectShift(_75,false);
}else{
if(e.ctrlKey){
this._activateItem(_75);
}
}
}
}
}
break;
case 40:
var _7a;
var _76;
if(this._activeItem==this._items[this._items.length-1]){
_7a=false;
}else{
var _77=this._activeItem.getParentItem();
if(_77==null){
_76=this._firstLevelItems;
}else{
_76=_77.getItems();
}
var _78=_76.indexOf(this._activeItem);
if(this._activeItem.getItemCount()>0&&this._activeItem.getExpanded()){
_7a=this._activeItem.getItems()[0];
}else{
if(this._activeItem.getItemCount()>0&&!this._activeItem.getExpanded()){
_7a=this._items[this._items.indexOf(this._activeItem)+countItems(this._activeItem)+1];
}else{
_7a=this._items[this._items.indexOf(this._activeItem)+1];
}
}
}
if(_7a){
if(!e.ctrlKey&&!e.shiftKey){
this._select(_7a,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this._selectShift(_7a,true);
}else{
if(e.shiftKey){
this._selectShift(_7a,false);
}else{
if(e.ctrlKey){
this._activateItem(_7a);
}
}
}
}
}
break;
case 37:
var _7b=this._activeItem;
this._activeItem.setExpanded(false);
this._activateItem(_7b);
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
function getLastItem(_7c){
if(_7c.getExpanded()&&_7c.getItemCount()>0){
return getLastItem(_7c.getItems()[_7c.getItemCount()-1]);
}else{
return _7c;
}
}
function countItems(_7d){
var _7e=0;
var _7f=_7d.getItems();
for(var i=0;i<_7f.length;++i){
_7e++;
if(_7f[i].getItemCount()>0){
_7e+=countItems(_7f[i]);
}
}
return _7e;
}
},indexOf:function(_81){
if(!$class.instanceOf(_81,gara.jswt.TreeItem)){
throw new TypeError("item not instance of gara.jswt.TreeItem");
}
if(!this._items.contains(_81)){
throw new gara.jswt.ItemNotExistsException("item ["+_81+"] does not exists in this list");
console.log("des item gibts hier ned: "+_81.getText());
return;
}
return this._items.indexOf(_81);
},_notifySelectionListener:function(){
this._selectionListeners.forEach(function(_82,_83,arr){
_82.widgetSelected(this);
},this);
},registerListener:function(_85,_86){
if(this.domref!=null){
gara.eventManager.addListener(this.domref,_85,_86);
}
},removeSelectionListener:function(_87){
if(!$class.instanceOf(item,gara.jswt.SelectionListener)){
throw new TypeError("item is not type of gara.jswt.SelectionListener");
}
if(this._selectionListeners.contains(_87)){
this._selectionListeners.remove(_87);
}
},_select:function(_88,_89){
if(!$class.instanceOf(_88,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(!_89){
while(this._selection.length){
this._selection.pop().setChecked(false);
}
}
if(!this._selection.contains(_88)&&_88.getParent()==this){
this._selection.push(_88);
_88.setChecked(true);
this._shiftItem=_88;
this._activateItem(_88);
this._notifySelectionListener();
}
},selectAll:function(){
this._items.forEach(function(_8a,_8b,arr){
this._select(_8a,true);
},this);
this.update();
},_selectShift:function(_8d,_8e){
if(!$class.instanceOf(_8d,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
if(!_8e){
while(this._selection.length){
this._selection.pop().setChecked(false);
}
}
var _8f=this.indexOf(this._shiftItem);
var _90=this.indexOf(_8d);
var _91=_8f>_90?_90:_8f;
var to=_8f<_90?_90:_8f;
for(var i=_91;i<=to;++i){
this._selection.push(this._items[i]);
this._items[i].setChecked(true);
}
this._activateItem(_8d);
this._notifySelectionListener();
},setLinesVisible:function(_94){
this._showLines=_94;
},toString:function(){
return "[gara.jswt.Tree]";
},update:function(){
if(this.domref==null){
this.domref=document.createElement("ul");
this.domref.obj=this;
this.domref.control=this;
var _95={};
for(var _96 in this._listener){
_95[_96]=this._listener[_96].concat([]);
}
this.addListener("mousedown",this);
this.addListener("dblclick",this);
for(var _96 in _95){
_95[_96].forEach(function(_97,_98,arr){
this.registerListener(_96,_97);
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
},_updateItems:function(_9a,_9b){
var _9c=_9a.length;
_9a.forEach(function(_9d,_9e,arr){
var _a0=(_9e+1)==_9c;
if(!_9d.isCreated()){
_9d.create(_a0);
_9b.appendChild(_9d.domref);
}
if(_9d.hasChanged()){
_9d.update();
_9d.releaseChange();
}
if(_9d.getItemCount()>0){
var _a1=_9d._getChildContainer();
this._updateItems(_9d.getItems(),_a1);
}
if(_a0&&_9d.getClassName().indexOf("bottom")==-1){
_9d.addClassName("bottom");
if(_9d.getItemCount()>0){
var cc=_9d._getChildContainer();
cc.className="bottom";
}
}else{
if(!_a0&&_9d.getClassName().indexOf("bottom")!=-1){
_9d.removeClassName("bottom");
if(_9d.getItemCount()>0){
var cc=_9d._getChildContainer();
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
},setActive:function(_a3){
this._active=_a3;
if(_a3){
this.addClassName("active");
}else{
this.removeClassName("active");
}
this._changed=true;
},setImage:function(_a4){
if(!$class.instanceOf(_a4,Image)){
throw new TypeError("image not instance of Image");
}
this._image=_a4;
this._changed=true;
},setSelected:function(){
this.addClassName("selected");
},setText:function(_a5){
this._text=_a5;
this._changed=true;
},setUnselected:function(){
this.removeClassName("selected");
},toString:function(){
return "[gara.jswt.Item]";
}});
$class("ListItem",{$extends:Item,$constructor:function(_a6){
if(!$class.instanceOf(_a6,gara.jswt.List)){
throw new TypeError("list is not type of gara.jswt.List");
}
this.$base();
this._list=_a6;
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
for(var _a7 in this._listener){
this._listener[_a7].forEach(function(_a8,_a9,arr){
this.registerListener(_a7,_a8);
},this);
}
return this.domref;
},registerListener:function(_ab,_ac){
if(this._img!=null){
gara.eventManager.addListener(this._img,_ab,_ac);
}
if(this._span!=null){
gara.eventManager.addListener(this._span,_ab,_ac);
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
for(var _ad in this._listener){
this._listener[_ad].forEach(function(_ae,_af,arr){
this.registerListener(this._img,_ad,_ae);
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
for(var _ad in this._listener){
this._listener[_ad].forEach(function(_b1,_b2,arr){
gara.eventManager.removeListener({domNode:this._img,type:_ad,listener:_b1});
},this);
}
}
}
}
this._spanText.value=this._text;
this.domref.className=this._className;
}});
$class("TreeItem",{$extends:Item,$constructor:function(_b4){
this.$base();
if(!($class.instanceOf(_b4,gara.jswt.Tree)||$class.instanceOf(_b4,gara.jswt.TreeItem))){
throw new TypeError("parentWidget is neither a gara.jswt.Tree or gara.jswt.TreeItem");
}
this._items=new Array();
this._expanded=true;
this._checked=false;
this._changed=false;
this._childContainer=null;
this._parent=_b4;
this._tree=null;
if($class.instanceOf(_b4,gara.jswt.Tree)){
this._tree=_b4;
}else{
if($class.instanceOf(_b4,gara.jswt.TreeItem)){
this._tree=_b4.getParent();
_b4._addItem(this);
}
}
this._tree._addItem(this);
this._img=null;
this._toggler=null;
this._span=null;
this._spanText=null;
},_addItem:function(_b5){
if(!$class.instanceOf(_b5,gara.jswt.TreeItem)){
throw new TypeError("item is not type of gara.jswt.TreeItem");
}
this._items.push(_b5);
},create:function(_b6){
if(_b6){
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
for(var _b7 in this._listeners){
this._listeners[_b7].forEach(function(_b8,_b9,arr){
this.registerListener(_b7,_b8);
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
this._items.forEach(function(_bb,_bc,arr){
if(_bb._hasChilds()){
_bb._deselectItems();
}
this._tree.deselect(_bb);
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
},getItem:function(_be){
if(_be>=this._items.length){
throw new gara.OutOfBoundsException("Your item lives outside of this Tree");
}
return this._items[_be];
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
var _c1=obj;
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
var _c1=obj;
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
},indexOf:function(_c2){
if(!$class.instanceOf(_c2,gara.jswt.TreeItem)){
throw new TypeError("item not instance of gara.jswt.TreeItem");
}
if(!this._items.contains(_c2)){
throw new gara.jswt.ItemNotExistsException("item ["+_c2+"] does not exists in this list");
console.log("des item gibts hier ned: "+_c2.getText());
return;
}
return this._items.indexOf(_c2);
},registerListener:function(_c3,_c4){
if(this._img!=null){
gara.eventManager.addListener(this._img,_c3,_c4);
}
if(this._span!=null){
gara.eventManager.addListener(this._span,_c3,_c4);
}
},removeAll:function(){
this._items=[];
},setActive:function(_c5){
this._active=_c5;
if(_c5){
this._span.className+=" active";
}else{
this._span.className=this._span.className.replace(/ *active/,"");
}
this._changed=true;
},setChecked:function(_c6){
if(_c6){
this._span.className="text selected";
}else{
this._span.className="text";
}
this._checked=_c6;
},setExpanded:function(_c7){
this._expanded=_c7;
if(!_c7){
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
this.domref.className=this._className;
}});
$class("ControlManager",{$implements:FocusListener,$constructor:function(){
this._activeControl=null;
this._controls=[];
gara.eventManager.addListener(window,"keydown",this);
gara.eventManager.addListener(window,"mousedown",this);
},addControl:function(_c8){
if(!this._controls.contains(_c8)){
this._controls.push(_c8);
}
},focusGained:function(_c9){
if(!$class.instanceOf(_c9,gara.jswt.Control)){
throw new TypeError("control is not a gara.jswt.Control");
}
this._activeControl=_c9;
},focusLost:function(_ca){
if(!$class.instanceOf(_ca,gara.jswt.Control)){
throw new TypeError("control is not a gara.jswt.Control");
}
if(this._activeControl==_ca){
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
},removeControl:function(_cc){
if(!$class.instanceOf(_cc,gara.jswt.Control)){
throw new TypeError("control is not a gara.jswt.Control");
}
if(this._controls.contains(_cc)){
if(this._activeControl==_cc){
this._activeControl=null;
}
this._controls.remove(_cc);
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

