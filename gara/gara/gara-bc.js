if(!Array.prototype.contains){
Array.prototype.contains=function(_1){
return Array2.contains(this,_1);
};
}
if(!Array.prototype.forEach){
Array.prototype.forEach=function(_2,_3){
return Array2.forEach(this,_2,_3);
};
}
if(!Array.prototype.indexOf){
Array.prototype.indexOf=function(_4,_5){
return Array2.indexOf(this,_4,_5);
};
}
if(!Array.prototype.insertAt){
Array.prototype.insertAt=function(_6,_7){
return Array2.insertAt(this,_6,_7);
};
}
if(!Array.prototype.insertBefore){
Array.prototype.insertBefore=function(_8,_9){
return Array2.insertBefore(this,_8,_9);
};
}
if(!Array.prototype.lastIndexOf){
Array.prototype.lastIndexOf=function(_a,_b){
return Array2.lastIndexOf(this,_a,_b);
};
}
if(!Array.prototype.remove){
Array.prototype.remove=function(_c){
return Array2.remove(this,_c);
};
}
if(!Array.prototype.removeAt){
Array.prototype.removeAt=function(_d){
return Array2.removeAt(this,_d);
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
var _f="gara,"+this.imports.split(",");
this.imports="";
forEach(_f,function(v,k,_12){
if(gara[v]){
this.imports+=gara[v].namespace;
}
},this);
var _13=this.exports.split(",");
this.exports="";
forEach(_13,function(v,k,_16){
this.exports+=this.name+"."+v+"="+v+";";
this.namespace+="var "+v+"="+this.name+"."+v+";";
},this);
}});
var _17=new Namespace({exports:"onDOMLoaded,Namespace",name:"gara"});
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
}});
gara.eventManager=new EventManager();
$class("OutOfBoundsException",{$extends:Exception,$constructor:function(_1f){
this.message=String(_1f);
this.name=$class.typeOf(this);
}});
var _20=function(f){
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
};
gara.jswt={};
new function(){
var _24=new gara.Namespace({name:"jswt",exports:"Widget,Control,List,Item,ListItem",imports:"gara"});
eval(_24.imports);
$interface("FocusListener",{focusGained:function(){
},focusLost:function(){
}});
$interface("SelectionListener",{widgetSelected:function(_25){
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
}});
$class("Control",{$extends:Widget,$constructor:function(){
this.$base();
this._focusListener=[];
this._hasFocus=false;
_32.addControl(this);
this.addFocusListener(_32);
},addFocusListener:function(_33){
if(!$class.implementationOf(_33,FocusListener)){
throw new TypeError("listener is not a FocusListener");
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
if(!_39.$class.implementsInterface(FocusListener)){
throw new TypeError("listener is not a FocusListener");
}
if(this._focusListener.contains(_39)){
this._focusListener.remove(_39);
}
},update:$abstract(function(){
})});
$class("List",{$extends:Control,$constructor:function(_3a){
this.$base();
this._list=null;
this._items=[];
this._selection=[];
this._selectionListener=[];
this._activeItem=null;
this._shiftItem=null;
this._parentNode=_3a;
this._className=this._baseClass="jsWTList";
},_activateItem:function(_3b){
if(!$class.instanceOf(_3b,ListItem)){
throw new TypeError("item is not type of ListItem");
}
if(this._activeItem!=null){
this._activeItem.setActive(false);
}
this._activeItem=_3b;
this._activeItem.setActive(true);
this.update();
},addItem:function(_3c){
if(!$class.instanceOf(_3c,ListItem)){
throw new TypeError("item is not type of ListItem");
}
this._items.push(_3c);
},addSelectionListener:function(_3d){
if(!$class.instanceOf(_3d,SelectionListener)){
throw new TypeError("listener is not instance of SelectionListener");
}
this._selectionListener.push(_3d);
},deselect:function(_3e){
if(!$class.instanceOf(_3e,ListItem)){
throw new TypeError("item not instance of ListItem");
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
if($class.instanceOf(obj,ListItem)){
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
if(!$class.instanceOf(_4a,ListItem)){
throw new TypeError("item not instance of ListItem (List.indexOf)");
}
if(!this._items.contains(_4a)){
throw new ItemNotExistsException("item ["+_4a+"] does not exists in this list");
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
if(this._selectionListener.contains(_4f)){
this._selectionListener.remove(_4f);
}
},select:function(_50,_51){
if(!$class.instanceOf(_50,ListItem)){
throw new TypeError("item not instance of ListItem");
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
if(!$class.instanceOf(_54,ListItem)){
throw new TypeError("item not instance of ListItem");
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
},setActive:function(_63){
this._active=_63;
if(_63){
this.addClassName("active");
}else{
this.removeClassName("active");
}
this._changed=true;
},setImage:function(_64){
if(!$class.instanceOf(_64,Image)){
throw new TypeError("image not instance of Image");
}
this._image=_64;
this._changed=true;
},setSelected:function(){
this.addClassName("selected");
},setText:function(_65){
this._text=_65;
this._changed=true;
},setUnselected:function(){
this.removeClassName("selected");
}});
$class("ListItem",{$extends:Item,$constructor:function(_66){
if(!$class.instanceOf(_66,List)){
throw new TypeError("list is not type of List");
}
this.$base();
this._list=_66;
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
for(var _67 in this._listener){
this._listener[_67].forEach(function(_68,_69,arr){
this.registerListener(_67,_68);
},this);
}
return this.domref;
},registerListener:function(_6b,_6c){
if(this._img!=null){
gara.eventManager.addListener(this._img,_6b,_6c);
}
if(this._span!=null){
gara.eventManager.addListener(this._span,_6b,_6c);
}
},update:function(){
if(this.image!=null&&this._img==null){
this._img=document.createElement("img");
this._img.obj=this;
this._img.control=this._list;
this._img.alt=this.sText;
this._img.src=this.image.src;
this.domref.insertBefore(this._img,this._span);
for(var _6d in this._listener){
this._listener[_6d].forEach(function(_6e,_6f,arr){
this.registerListener(this._img,_6d,_6e);
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
for(var _6d in this._listener){
this._listener[_6d].forEach(function(_71,_72,arr){
gara.eventManager.removeListener({domNode:this._img,type:_6d,listener:_71});
},this);
}
}
}
}
this._spanText.value=this._text;
this.domref.className=this._className;
}});
$class("ControlManager",{$implements:FocusListener,$constructor:function(){
this._activeControl=null;
this._controls=[];
gara.eventManager.addListener(window,"keydown",this);
gara.eventManager.addListener(window,"mousedown",this);
},addControl:function(_74){
if(!this._controls.contains(_74)){
this._controls.push(_74);
}
},focusGained:function(_75){
if(!$class.instanceOf(_75,Control)){
throw new TypeError("control is not a Control");
}
this._activeControl=_75;
},focusLost:function(_76){
if(!$class.instanceOf(_76,Control)){
throw new TypeError("control is not a Control");
}
if(this._activeControl==_76){
this._activeControl=null;
}
},handleEvent:function(e){
if(e.type=="keydown"){
if(this._activeControl!=null&&this._activeControl._handleKeyEvent){
this._activeControl._handleKeyEvent(e);
}
}
if(e.type=="mousedown"){
if(this._activeControl!=null||(e.target.control&&e.target.control!=this._activeControl)){
this._activeControl.looseFocus();
this._activeControl=null;
}
}
},removeControl:function(_78){
if(this._controls.contains(_78)){
if(this._activeControl==_78){
this._activeControl=null;
}
this._controls.remove(_78);
}
}});
var _32=new ControlManager();
eval(_24.exports);
gara.jswt.namespace=_24.namespace;
};

