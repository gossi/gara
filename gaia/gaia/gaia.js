Function.prototype.inheritsFrom=function(_1){
if(_1.constructor==Function){
this.prototype=new _1;
this.prototype.constructor=this;
this.prototype.parent=_1.prototype;
}else{
this.prototype=_1;
this.prototype.constructor=this;
this.prototype.parent=_1;
}
return this;
};
function strReplace(_2,_3,_4){
output=""+_2;
while(output.indexOf(_3)>-1){
pos=output.indexOf(_3);
output=""+(output.substring(0,pos)+_4+output.substring((pos+_3.length),output.length));
}
return output;
}
function uniqueId(){
var d=new Date();
var ID=d.getDate()+""+d.getMonth()+1+""+d.getFullYear()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()+""+d.getMilliseconds();
return ID;
}
function error(_7,_8,_9){
alert("Error\n-----\n\n"+_7+"::"+_8+"\n"+_9);
}
Array.prototype.indexOf=function(_a){
var _b=false;
for(var i=0;i<this.length;++i){
if(this[i]==_a){
_b=i;
break;
}
}
return _b;
};
Array.prototype.getKey=Array.prototype.indexOf;
Array.prototype.contains=function(_d){
for(var i=0;i<this.length;++i){
if(this[i]==_d){
return true;
}
}
return false;
};
Array.prototype.remove=function(_f){
if(_f<this.length){
this.splice(_f,1);
}
};
function Exception(_10,_11,_12){
this.sMessage;
this.sErrClass;
this.sErrMethod;
this.sType="Exception";
if(typeof (_10)=="string"){
this.sMessage=_10;
}
if(typeof (_11)=="string"){
this.sErrClass=_11;
}
if(typeof (_12)=="string"){
this.sErrMethod=_12;
}
}
Exception.prototype.getErrClass=function(){
return this.sErrClass;
};
Exception.prototype.getExceptionType=function(){
return this.sType;
};
Exception.prototype.getErrMethod=function(){
return this.sErrMethod;
};
Exception.prototype.getMessage=function(){
return this.sMessage;
};
Exception.prototype.setErrClass=function(_13){
this.sErrClass=_13;
};
Exception.prototype.setErrMethod=function(_14){
this.sErrMethod=_14;
};
Exception.prototype.setMessage=function(_15){
this.sMessage=_15;
};
Exception.prototype.toString=function(){
return "[Exception] "+this.sMessage;
};
function WrongObjectException(_16,_17,_18){
this.sType="WrongObjectException";
Exception.prototype.constructor.call(this,_16,_17,_18);
}
WrongObjectException.inheritsFrom(Exception);
function OutOfBoundsException(_19,_1a,_1b){
this.sType="OutOfBoundsException";
Exception.prototype.constructor.call(this,_19,_1a,_1b);
}
OutOfBoundsException.inheritsFrom(Exception);
function DefectInterfaceImplementationException(_1c,_1d,_1e){
this.aMissingMethods=new Array();
this.sType="DefectInterfaceImplementationException";
Exception.prototype.constructor.call(this,_1c,_1d,_1e);
}
DefectInterfaceImplementationException.inheritsFrom(Exception);
DefectInterfaceImplementationException.prototype.addMissingMethod=function(_1f){
this.aMissingMethods.push(_1f);
};
DefectInterfaceImplementationException.prototype.getMissingMethods=function(){
var _20="";
for(var i=0;i<this.aMissingMethods.length;++i){
_20+=this.aMissingMethods[i]+", ";
}
_20=_20.substring(0,-2);
return _20;
};
DefectInterfaceImplementationException.prototype.toString=function(){
return "[DefectInterfaceImplementationException] "+this.sMessage+"\nMissing Methods: "+this.getMissingMethods();
};
function AbstractList(){
Array.prototype.constructor.call(this);
}
AbstractList.inheritsFrom(Array);
AbstractList.prototype.empty=function(){
return this.length==0;
};
AbstractList.prototype.size=function(){
return this.length;
};
AbstractList.prototype.get=function(_22){
if(_22>this.length){
throw new OutOfBoundsException("[AbstractList] Index ("+_22+") out of bounds");
}else{
return this[_22];
}
};
function Queue(){
AbstractList.prototype.constructor.call(this);
}
Queue.inheritsFrom(AbstractList);
Queue.prototype.peek=function(){
if(this.empty()){
return false;
}else{
return this[0];
}
};
Queue.prototype.pop=function(){
return this.shift();
};
function Stack(){
AbstractList.prototype.constructor.call(this);
}
Stack.inheritsFrom(AbstractList);
Stack.prototype.peek=function(){
if(this.empty()){
return false;
}else{
return this[this.length-1];
}
};
function ExceptionHandler(){
this.ER_ALERT=1;
this.ER_LOG=2;
this.sErrorMessage;
this.sErrorDescription="";
this.log;
this.iErrorReporting=this.ER_ALERT;
}
ExceptionHandler.prototype.setErrorReporting=function(iER){
this.iErrorReporting=iER;
};
ExceptionHandler.prototype.setLog=function(log){
this.log=log;
};
ExceptionHandler.prototype.exceptionRaised=function(e){
this.buildError(e);
switch(this.iErrorReporting){
case this.ER_LOG:
this.Log.addError(this.sErrorMessage,this.sErrorDescription);
break;
case this.ER_ALERT:
default:
alert(this.sErrorMessage+"\n"+this.sErrorDescription);
break;
}
};
ExceptionHandler.prototype.buildError=function(e){
this.sErrorDescription="";
if(e instanceof Exception){
var _27=e.getExceptionType();
this.sErrorMessage="["+_27+"] "+e.getMessage();
if(typeof (e.getErrClass())!="undefined"&&typeof (e.getErrMethod())!="undefined"){
this.sErrorDescription=e.getErrClass()+"::"+e.getErrMethod()+"\n";
}
if(e instanceof (DefectInterfaceImplementationException)){
this.sErrorDescription+="\nMissing Methods: "+e.getMissingMethods();
}
}else{
if(typeof (e)=="string"){
this.sErrorMessage=e;
}else{
this.sErrorMessage=e.toString();
}
}
};
function InterfaceTester(){
}
InterfaceTester.prototype.isIWriter=function(Obj){
var bOk=true;
var e=new DefectInterfaceImplementationException();
if(!Obj.update){
bOk=false;
e.addMissingMethod("update");
}
if(bOk){
delete e;
return true;
}else{
throw e;
}
};
function LogNode(_2b,_2c){
this.sDescription="";
this.parentNode=null;
this.nodes=new Array();
this.setText(_2b);
this.setDescription(_2c);
}
LogNode.prototype.setText=function(_2d){
if(typeof (_2d)!="string"){
_2d="";
}
this.sText=_2d;
};
LogNode.prototype.setDescription=function(_2e){
if(typeof (_2e)!="string"){
_2e="";
}
this.sDescription=_2e;
};
LogNode.prototype.setLog=function(log){
if(log instanceof (Log)){
this.log=log;
}
};
LogNode.prototype.getLog=function(){
return this.log;
};
LogNode.prototype.getText=function(){
return this.sText;
};
LogNode.prototype.getDescription=function(){
return this.sDescription;
};
LogNode.prototype.getImage=function(){
return null;
};
LogNode.prototype.hasNodes=function(){
return this.nodes.length>0;
};
LogNode.prototype.getNodes=function(){
return this.nodes;
};
LogNode.prototype.getNodesCount=function(){
return this.nodes.length;
};
LogNode.prototype.addNode=function(_30){
this.nodes.push(_30);
};
LogNode.prototype.setParent=function(_31){
this.parentNode=_31;
};
LogNode.prototype.getParent=function(){
return this.parentNode;
};
function LogFolderNode(_32,_33){
LogNode.prototype.constructor.call(this,_32,_33);
}
LogFolderNode.inheritsFrom(LogNode);
LogFolderNode.prototype.getImage=function(){
image=new Image();
image.src=gaia.getBaseUrl()+"/res/images/folder.png";
return image;
};
LogFolderNode.prototype.addNode=function(_34){
LogNode.prototype.addNode.call(this,_34);
if(typeof (this.log)!="undefined"){
this.log.notifyWriter(this);
}
};
function LogMessageNode(_35,_36){
LogNode.prototype.constructor.call(this,_35,_36);
}
LogMessageNode.inheritsFrom(LogNode);
LogMessageNode.prototype.getImage=function(){
image=new Image();
image.src=gaia.getBaseUrl()+"/res/images/message.png";
return image;
};
function LogWarningNode(_37,_38){
LogNode.prototype.constructor.call(this,_37,_38);
}
LogWarningNode.inheritsFrom(LogNode);
LogWarningNode.prototype.getImage=function(){
image=new Image();
image.src=jsRIA.getBaseUrl()+"/res/images/warning.png";
return image;
};
function LogErrorNode(_39,_3a){
LogNode.prototype.constructor.call(this,_39,_3a);
}
LogErrorNode.inheritsFrom(LogNode);
LogErrorNode.prototype.getImage=function(){
image=new Image();
image.src=jsRIA.getBaseUrl()+"/res/images/error.png";
return image;
};
function Log(){
this.aWriter=new Array();
this.root=new LogFolderNode();
this.root.setLog(this);
this.folders=new Stack();
this.folders.push(this.root);
this.currentFolder=this.root;
}
Log.prototype.addMessage=function(_3b,_3c){
var _3d=new LogMessageNode(_3b,_3c);
_3d.setLog(this);
this.append(_3d);
};
Log.prototype.addError=function(_3e,_3f){
var _40=new LogErrorNode(_3e,_3f);
_40.setLog(this);
this.append(_40);
};
Log.prototype.createFolder=function(_41,_42){
var _43=new LogFolderNode(_41,_42);
_43.setLog(this);
return _43;
};
Log.prototype.pushLogFolder=function(_44){
if(_44 instanceof (LogFolderNode)){
this.append(_44);
this.folders.push(_44);
this.currentFolder=_44;
}
};
Log.prototype.popLogFolder=function(){
if(this.folders.peek()!=this.root){
var _45=this.folders.pop();
this.currentFolder=this.folders.peek();
this.notifyWriter(-1);
return _45;
}
};
Log.prototype.append=function(_46){
if(_46 instanceof (LogNode)){
_46.setParent(this.currentFolder);
this.currentFolder.addNode(_46);
this.notifyWriter(_46);
}
};
Log.prototype.addWriter=function(_47){
try{
gaia.getInterfaceTester().isIWriter(_47);
}
catch(e){
gaia.getExceptionHandler().exceptionRaised(e);
}
this.aWriter.push(_47);
_47.setRoot(this.root);
};
Log.prototype.notifyWriter=function(_48){
for(var i=0;i<this.aWriter.length;++i){
this.aWriter[i].update(_48);
}
};
function LogWriter(){
this.root=null;
this.builds=new Array();
this.elements=new Object();
this.html=null;
}
LogWriter.prototype.setRoot=function(_4a){
if(_4a instanceof (LogFolderNode)){
this.root=_4a;
this.html=document.createElement("ul");
this.builds.push(this.root);
this.elements[0]=this.html;
}
};
LogWriter.prototype.build=function(){
this.update();
return this.html;
};
LogWriter.prototype.update=function(_4b){
if(typeof (_4b)=="undefined"){
_4b=this.root;
}
if(_4b!=-1&&_4b!=this.root){
_4b=_4b.getParent();
}
this.doUpdate(_4b);
};
LogWriter.prototype.doUpdate=function(_4c){
if(_4c==-1){
return;
}
var _4d=_4c.getNodes();
for(var i=0;i<_4d.length;++i){
var _4f=_4d[i];
if(this.builds.contains(_4f)){
continue;
}
var _4c=_4f.getParent();
var _50=_4c==this.root;
var _51=this.builds.getKey(_4c);
var _52=this.elements[_51];
var _53;
if(_4f instanceof (LogFolderNode)){
var _54=this.createNode(_4f);
_53=document.createElement("ul");
_53.style.listStyleImage="url('"+_4f.getImage().src+"')";
if(i+1<=_4d.length&&this.builds.contains(_4d[i+1])){
_52.insertBefore(_53,_4d[i+1]);
_52.insertBefore(_54,_53);
}else{
_52.appendChild(_54);
_52.appendChild(_53);
}
}else{
_53=this.createNode(_4f);
if(i+1<=_4d.length&&this.builds.contains(_4d[i+1])){
_52.insertBefore(_53,_4d[i+1]);
}else{
_52.appendChild(_53);
}
}
this.builds.push(_4f);
this.elements[this.builds.length-1]=_53;
if(_4f instanceof (LogFolderNode)){
this.doUpdate(_4f);
}
}
};
LogWriter.prototype.createNode=function(_55){
var _56;
_56=document.createElement("li");
_56.appendChild(document.createTextNode(_55.getText()));
_56.style.listStyleImage="url('"+_55.getImage().src+"')";
return _56;
};
function Console(){
LogWriter.prototype.constructor.call(this);
}
Console.inheritsFrom(LogWriter);
Console.prototype.open=function(){
var _57=100;
var _58=screen.width-50-450;
var _59=this.jsRIA.getBaseUrl()+"/res/console.html";
var _5a=window.open(_59,"ConsoleWin","width=450,height=600,top="+_57+",left="+_58+",location=no,menubar=no,status=no,toolbar=no,"+"resizable=yes,scrollbars=yes");
var _5b=this.build();
_5a.onload=function(){
_5a.document.getElementsByTagName("body")[0].appendChild(_5b);
};
};
Console.prototype.printOpenBox=function(){
var _5c=document.getElementsByTagName("body")[0];
var box=document.createElement("div");
box.setAttribute("style","position: absolute; top: 10px; right: 10px; padding: 10px;"+"border: 1px solid #000; background-color: #c0d2ec; width: 100px;");
box["innerHTML"]="<input type=\"button\" style=\"font-family: Verdana; font-size: 10px;\""+"onclick=\"jsRIA.getConsole().open()\" value=\"Open Console\"/>";
_5c.appendChild(box);
};
Console.prototype.toString=function(){
return "Console";
};
function Firebug(){
this.updated=new Array();
this.root=null;
}
Firebug.prototype.setRoot=function(_5e){
this.root=_5e;
};
Firebug.prototype.update=function(_5f){
if(typeof (_5f)=="undefined"){
return;
}else{
if(_5f==-1){
console.groupEnd();
}else{
if(this.updated.contains(_5f)){
return;
}else{
if(_5f instanceof (LogErrorNode)){
console.error(_5f.getText());
}else{
if(_5f instanceof (LogMessageNode)){
console.info(_5f.getText());
}else{
if(_5f instanceof (LogWarningNode)){
console.warn(_5f.getText());
}else{
if(_5f instanceof (LogFolderNode)&&_5f!=this.root){
console.group(_5f.getText());
}else{
if(_5f instanceof (LogNode)){
}
}
}
}
}
}
}
}
this.updated.push(_5f);
};
Firebug.prototype.toString=function(){
return "[object Firebug]";
};
function EventListener(){
this.target=null;
this.method=null;
this.fnct=null;
this.event=null;
}
EventListener.prototype.handleEvent=function(e){
if(e instanceof EventListener){
e=e.event;
}
e=e?e:window.event;
e.source=typeof (e.target)!="undefined"?e.target:e.srcElement;
this.event=e;
if(this.event.stopPropagation){
this.event.stopPropagation();
this.event.preventDefault();
}else{
if(this.event.cancelBubble){
this.event.cancelBubble=true;
this.event.returnValue=false;
}
}
if(this.fnct!=null){
eval("this.fnct(this)");
}else{
var obj=this.target;
eval("obj."+this.method+"(this)");
}
};
EventListener.prototype.setFunction=function(_62){
this.fnct=_62;
};
EventListener.prototype.setManager=function(_63){
this.manager=_63;
};
EventListener.prototype.setMethod=function(_64){
this.method=_64;
};
EventListener.prototype.setTarget=function(_65){
this.target=_65;
};
EventListener.prototype.toString=function(){
return "[object EventListener]";
};
function EventManager(){
this.listeners=new Array();
var _66=new EventListener();
_66.setTarget(this);
_66.setMethod("unregisterAllEvents");
this.addEventListener(window,"unload",_66);
}
EventManager.prototype.addEventListener=function(_67,_68,_69){
var _6a=_69;
if(_67.addEventListener){
_67.addEventListener(_68,_6a,false);
}else{
if(_67.attachEvent){
_6a=function(e){
_69.handleEvent(e);
};
_67.attachEvent("on"+_68,_6a);
}else{
throw new Error("Event registration not supported");
}
}
var _6c={domNode:_67,eventType:_68,listener:_6a};
this.listeners.push(_6c);
return _6c;
};
EventManager.prototype.removeEventListener=function(_6d){
var _6e=_6d.domNode;
if(_6e.removeEventListener){
_6e.removeEventListener(_6d.eventType,_6d.listener,false);
}else{
if(_6e.detachEvent){
_6e.detachEvent("on"+_6d.eventType,_6d.listener);
}
}
if(this.listeners.contains(_6d)){
var _6f=this.listeners.indexOf(_6d);
this.listeners.remove(_6f);
}
};
EventManager.prototype.unregisterAllEvents=function(){
while(this.listeners.length>0){
var _70=this.listeners.pop();
var _71=_70.domNode;
if(_71.removeEventListener){
_71.removeEventListener(_70.eventType,_70.listener,false);
}else{
if(_71.detachEvent){
_71.detachEvent("on"+_70.eventType,_70.listener);
}
}
}
};
gaia={xmlDoc:null,baseUrl:"",bDependsDocLoaded:false,sMainScriptUrl:null,bUseBaseUrl:false,init:function(){
this.getBaseUrl();
this.interfaceTester=new InterfaceTester();
this.console=new Console();
this.log=new Log();
this.exceptionHandler=new ExceptionHandler();
this.exceptionHandler.setLog(this.log);
this.log.addWriter(this.console);
this.exceptionHandler.setErrorReporting(this.exceptionHandler.ER_LOG);
this.eventManager=new EventManager();
},toString:function(){
return "[object Gaia]";
},setBaseUrl:function(_72){
this.baseUrl=_72;
},getBaseUrl:function(){
if(this.baseUrl!=null){
return this.baseUrl;
}
var _73=document.getElementsByTagName("script");
for(var i=0;i<_73.length;++i){
if(_73[i].src&&(_73[i].src.indexOf("gaia.js")!=-1)){
var src=_73[i].src;
src=src.substring(0,src.lastIndexOf("/"));
this.baseUrl=src;
break;
}
}
var _76=document.location.href;
if(_76.indexOf("?")!=-1){
_76=_76.substring(0,_76.indexOf("?"));
}
var _77=_76;
var _76=_76.substring(0,_76.lastIndexOf("/"));
if(this.baseUrl.indexOf("://")==-1&&this.baseUrl.charAt(0)!="/"){
this.baseUrl=_76+"/"+this.baseUrl;
}
return this.baseUrl;
},getExceptionHandler:function(){
return this.exceptionHandler;
},getInterfaceTester:function(){
return this.interfaceTester;
},getEventManager:function(){
return this.eventManager;
},getLog:function(){
return this.log;
},setMainScriptUrl:function(_78,_79){
this.sMainScriptUrl=_78;
if(typeof (_79)=="undefined"){
this.bUseBaseUrl=false;
}
}};
gaia.init();
if(typeof (console)!="undefined"){
gaia.getLog().addWriter(new Firebug());
}
InterfaceTester.prototype.isFocusListener=function(obj){
var bOk=true;
var e=new DefectInterfaceImplementationException();
if(!obj.focusGained){
bOk=false;
e.addMissingMethod("focusGained");
}
if(!obj.focusLost){
bOk=false;
e.addMissingMethod("focusLost");
}
if(bOk){
delete e;
return true;
}else{
throw e;
}
};
InterfaceTester.prototype.isListener=function(obj){
var bOk=true;
var e=new DefectInterfaceImplementationException();
if(!obj.handleEvent){
bOk=false;
e.addMissingMethod("handleEvent");
}
if(bOk){
delete e;
return true;
}else{
throw e;
}
};
InterfaceTester.prototype.isSelectionListener=function(obj){
var bOk=true;
var e=new DefectInterfaceImplementationException();
if(!obj.widgetSelected){
bOk=false;
e.addMissingMethod("widgetSelected");
}
if(bOk){
delete e;
return true;
}else{
throw e;
}
};
function ControlManager(){
this.activeControl=null;
this.controls=new Array();
var _83={controlManager:null,setControlManager:function(cm){
this.controlManager=cm;
},handleEvent:function(e){
e=e?e:window.event;
e.source=e.target?e.target:e.srcElement;
e.x=e.pageX?e.pageX:e.clientX;
e.y=e.pageY?e.pageY:e.clientY;
this.event=e;
var cm=this.controlManager;
eval("cm.handleEvent(this)");
}};
_83.setControlManager(this);
var em=gaia.getEventManager();
em.addEventListener(window,"keydown",_83);
em.addEventListener(window,"mousedown",_83);
}
ControlManager.prototype.addControl=function(_88){
if(!this.controls.contains(_88)){
this.controls.push(_88);
}
};
ControlManager.prototype.focusGained=function(_89){
if(!_89 instanceof Control){
throw new WrongObjectException("control is not instance of Control","ControlManager","focusGained");
}
this.activeControl=_89;
};
ControlManager.prototype.focusLost=function(_8a){
};
ControlManager.prototype.handleEvent=function(e){
if(e.event.type=="keydown"){
if(this.activeControl!=null&&this.activeControl.keyHandler){
this.activeControl.keyHandler(e);
}
}
if(e.event.type=="mousedown"){
if(this.activeControl!=null){
this.activeControl.looseFocus();
this.activeControl=null;
}
}
};
ControlManager.prototype.removeControl=function(_8c){
if(this.controls.contains(_8c)){
if(this.activeControl==_8c){
this.activeControl=null;
}
var _8d=this.controls.indexOf(_8c);
this.controls.remove(_8d);
}
};
ControlManager.prototype.toString=function(){
return "[object ControlManager]";
};
jsWT={controlManager:new ControlManager(),toString:function(){
return "[object jsWT]";
},getControlManager:function(){
return this.controlManager;
}};
function Widget(){
this.domref=null;
}
Widget.prototype.addListener=function(_8e,_8f){
try{
gaia.getInterfaceTester().isListener(_8f);
}
catch(e){
gaia.getExceptionHandler().exceptionRaised(e);
}
var _90=new EventListener();
_90.setTarget(_8f);
_90.setMethod("handleEvent");
if(this.domref!=null){
var _91=this.registerListener(_8e,_90);
_90.events=_91;
}
if(!this.listeners.hasOwnProperty(_8e)){
this.listeners[_8e]=new Array();
}
this.listeners[_8e].push(_90);
};
Widget.prototype.getDomRef=function(){
return this.domref;
};
Widget.prototype.removeListener=function(_92,_93){
if(this.listeners[_92].contains(_93)){
var _94=this.listeners[_92].indexOf(_93);
var _95=this.listeners[_92][_94];
this.listeners[_92].remove(_94);
if(_95.hasOwnProperty("events")){
for(var i=0;i<_95.events.length;++i){
var _97=_95.events[i];
gaia.getEventManager().removeEventListener(_97);
}
}
delete _95;
}
};
Widget.prototype.setDomRef=function(_98){
this.domref=_98;
if(!this.domref.obj){
this.domref.obj=this;
}
};
function Control(){
this.aItems=new Array();
this.sClassName="jsWT";
Widget.prototype.constructor.call(this);
this.focushack=null;
this.bHasFocus=false;
this.aFocusListeners=new Array();
var _99=jsWT.getControlManager();
_99.addControl(this);
this.addFocusListener(_99);
}
Control.inheritsFrom(Widget);
Control.prototype.addClassName=function(_9a){
this.sClassName+=" "+_9a;
};
Control.prototype.addFocusListener=function(_9b){
try{
gaia.getInterfaceTester().isFocusListener(_9b);
}
catch(e){
gaia.getExceptionHandler().exceptionRaised(e);
}
this.aFocusListeners.push(_9b);
};
Control.prototype.addItem=function(_9c){
if(!_9c instanceof Item){
return error("Control","addItem","New Item is not instance of Item");
}
this.aItems.push(_9c);
};
Control.prototype.forceFocus=function(){
this.focushack.focus();
};
Control.prototype.isFocusControl=function(){
return this.bHasFocus;
};
Control.prototype.looseFocus=function(){
this.focushack.blur();
};
Control.prototype.onFocus=function(){
this.bHasFocus=true;
for(var i=0;i<this.aFocusListeners.length;++i){
this.aFocusListeners[i].focusGained(this);
}
};
Control.prototype.onBlur=function(){
this.bHasFocus=false;
for(var i=0;i<this.aFocusListeners.length;++i){
this.aFocusListeners[i].focusLost(this);
}
};
Control.prototype.removeClassName=function(_9f){
this.sClassName=strReplace(this.sClassName," "+_9f,"");
};
Control.prototype.removeFocusListener=function(_a0){
if(this.aFocusListeners.contains(_a0)){
var _a1=this.aFocusListeners.getKey(_a0);
this.aFocusListeners.remove(_a1);
}
};
Control.prototype.setClassName=function(_a2){
this.sClassName=_a2;
};
Control.prototype.update=function(){
this.paint();
};
function ItemNotExistsException(_a3,_a4,_a5){
Exception.prototype.constructor.call(this,_a3,_a4,_a5);
}
ItemNotExistsException.inheritsFrom(Exception);
function Tree(_a6){
this.listeners={};
Control.prototype.constructor.call(this);
this.aSelection=new Array();
this.aSelectionListeners=new Array();
this.bShowLines=true;
this.sClassName="jsWTTree";
this.parentElement=_a6;
this.aTopItems=new Array();
this.activeItem=null;
this.inactiveItem=null;
this.shiftItem=null;
this.addFocusListener(this);
}
Tree.inheritsFrom(Control);
Tree.prototype.activateItem=function(_a7){
if(this.activeItem!=null){
this.activeItem.setActive(false);
}
this.activeItem=_a7;
this.activeItem.setActive(true);
this.update();
};
Tree.prototype.addItem=function(_a8){
if(!_a8 instanceof TreeItem){
throw new WrongObjectException("New item is not instance of TreeItem","Tree","addItem");
}
var _a9=_a8.getParent();
if(_a9==this){
this.aItems.push(_a8);
}else{
var _aa=this.aItems.indexOf(_a9)+getDescendents(_a9)+1;
this.aItems.splice(_aa,0,_a8);
}
function getDescendents(_ab){
var _ac=0;
if(_ab.hasChilds()){
var _ad=_ab.getItems();
for(var i=0;i<_ad.length;++i){
if(_ad[i].hasChilds()){
_ac+=getDescendents(_ad[i]);
}
_ac++;
}
}
return _ac;
}
};
Tree.prototype.addSelectionListener=function(_af){
try{
gaia.getInterfaceTester().isSelectionListener(_af);
}
catch(e){
gaia.getExceptionHandler().exceptionRaised(e);
}
this.aSelectionListeners.push(_af);
};
Tree.prototype.addTopItem=function(_b0){
if(!_b0 instanceof TreeItem){
throw new WrongObjectException("New item is not instance of TreeItem","Tree","addTopItem");
}
this.aTopItems.push(_b0);
};
Tree.prototype.selectHandler=function(e){
var _b2=e.event.source.obj;
if(e.ctrlKey&&!e.shiftKey){
if(this.aSelection.contains(_b2)){
this.deselect(_b2);
}else{
this.select(_b2,true);
}
}else{
if(!e.ctrlKey&&e.shiftKey){
this.selectRange(_b2,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_b2,true);
}else{
this.select(_b2,false);
}
}
}
if(!this.isFocusControl()){
this.forceFocus();
}
};
Tree.prototype.deselect=function(_b3){
if(!_b3 instanceof TreeItem){
throw new WrongObjectException("item not instance of TreeItem","Tree","deselect");
}
if(this.aSelection.contains(_b3)&&_b3.getTree()==this){
this.aSelection.remove(this.aSelection.indexOf(_b3));
this.notifySelectionListener();
_b3.setUnselected();
this.shiftItem=_b3;
this.activateItem(_b3);
}
};
Tree.prototype.deselectAll=function(){
for(var i=this.aSelection.length;i>=0;--i){
this.deselect(this.aSelection[i]);
}
this.update();
};
Tree.prototype.focusGained=function(){
if(this.inactiveItem!=null&&this.activeItem==null){
this.activeItem=this.inactiveItem;
this.inactiveItem=null;
this.activeItem.setActive(true);
this.update();
}
};
Tree.prototype.focusLost=function(){
if(this.activeItem!=null){
this.activeItem.setActive(false);
this.inactiveItem=this.activeItem;
this.activeItem=null;
this.update();
}
};
Tree.prototype.getItem=function(_b5){
if(_b5>=this.aItems.length){
throw new OutOfBoundsException("Your item lives outside of this list","Tree","getItem");
}
return this.aItems[_b5];
};
Tree.prototype.getItemCount=function(){
return this.aItems.length;
};
Tree.prototype.getItems=function(){
return this.aItems;
};
Tree.prototype.getLinesVisible=function(){
return this.bShowLines;
};
Tree.prototype.getSelection=function(){
return this.aSelection;
};
Tree.prototype.getSelectionCount=function(){
return this.aSelection.length;
};
Tree.prototype.indexOf=function(_b6){
if(!_b6 instanceof (TreeItem)){
throw new WrongObjectException("item not instance of TreeItem","Tree","indexOf");
}
if(!this.aItems.contains(_b6)){
throw new ItemNotExistsException(_b6,"Tree","indexOf");
}
return this.aItems.getKey(_b6);
};
Tree.prototype.keyHandler=function(el){
if(this.activeItem==null){
return;
}
var e=el.event;
switch(e.keyCode){
case 38:
var _b9;
var _ba;
if(this.activeItem==this.aItems[0]){
_b9=false;
}else{
var _bb=this.activeItem.getParent();
if(_bb==this){
_ba=this.aTopItems;
}else{
_ba=_bb.getItems();
}
var _bc=_ba.indexOf(this.activeItem);
if(_bc==0){
_b9=_bb;
}else{
var _bd=_ba[_bc-1];
_b9=getLastItem(_bd);
}
}
if(_b9){
if(!e.ctrlKey&&!e.shiftKey){
this.select(_b9,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_b9,true);
}else{
if(e.shiftKey){
this.selectRange(_b9,false);
}else{
if(e.ctrlKey){
this.activateItem(_b9);
}
}
}
}
}
break;
case 40:
var _be;
var _ba;
if(this.activeItem==this.aItems[this.aItems.length-1]){
_be=false;
}else{
var _bb=this.activeItem.getParent();
if(_bb==this){
_ba=this.aTopItems;
}else{
_ba=_bb.getItems();
}
var _bc=_ba.indexOf(this.activeItem);
if(this.activeItem.hasChilds()&&this.activeItem.isExpanded()){
_be=this.activeItem.getItems()[0];
}else{
if(this.activeItem.hasChilds()&&!this.activeItem.isExpanded()){
_be=this.aItems[this.aItems.indexOf(this.activeItem)+countItems(this.activeItem)+1];
}else{
_be=this.aItems[this.aItems.indexOf(this.activeItem)+1];
}
}
}
if(_be){
if(!e.ctrlKey&&!e.shiftKey){
this.select(_be,false);
}else{
if(e.ctrlKey&&e.shiftKey){
this.selectRange(_be,true);
}else{
if(e.shiftKey){
this.selectRange(_be,false);
}else{
if(e.ctrlKey){
this.activateItem(_be);
}
}
}
}
}
break;
case 37:
var _bf=this.activeItem;
this.activeItem.collapse();
this.activateItem(_bf);
this.update();
break;
case 39:
this.activeItem.expand();
this.update();
break;
case 32:
if(this.aSelection.contains(this.activeItem)&&e.ctrlKey){
this.deselect(this.activeItem);
}else{
this.select(this.activeItem,true);
}
break;
case 36:
if(!e.ctrlKey&&!e.shiftKey){
this.select(this.aItems[0],false);
}else{
if(e.shiftKey){
this.selectRange(this.aItems[0],false);
}else{
if(e.ctrlKey){
this.activateItem(this.aItems[0]);
}
}
}
break;
case 35:
if(!e.ctrlKey&&!e.shiftKey){
this.select(this.aItems[this.aItems.length-1],false);
}else{
if(e.shiftKey){
this.selectRange(this.aItems[this.aItems.length-1],false);
}else{
if(e.ctrlKey){
this.activateItem(this.aItems[this.aItems.length-1]);
}
}
}
break;
}
function getLastItem(_c0){
if(_c0.isExpanded()&&_c0.hasChilds()){
return getLastItem(_c0.getItems()[_c0.getItems().length-1]);
}else{
return _c0;
}
}
function countItems(_c1){
var _c2=0;
var _c3=_c1.getItems();
for(var i=0;i<_c3.length;++i){
_c2++;
if(_c3[i].hasChilds()){
_c2+=countItems(_c3[i]);
}
}
return _c2;
}
};
Tree.prototype.notifySelectionListener=function(){
for(var i=0;i<this.aSelectionListeners.length;++i){
this.aSelectionListeners[i].widgetSelected(this);
}
};
Tree.prototype.registerListener=function(_c6,_c7){
var em=gaia.getEventManager();
var evs=[];
evs.push(em.addEventListener(this.domref,_c6,_c7));
return evs;
};
Tree.prototype.removeSelectionListener=function(_ca){
if(this.aSelectionListeners.contains(_ca)){
var _cb=this.aSelectionListeners.getKey(_ca);
this.aSelectionListeners.remove(_cb);
}
};
Tree.prototype.select=function(_cc,_cd){
if(!_cc instanceof TreeItem){
throw new WrongObjectException("item not instance of TreeItem","Tree","select");
}
if(!_cd){
while(this.aSelection.length){
this.aSelection.pop().setUnselected();
}
}
if(!this.aSelection.contains(_cc)&&_cc.getTree()==this){
this.aSelection.push(_cc);
_cc.setSelected();
this.shiftItem=_cc;
this.activateItem(_cc);
this.notifySelectionListener();
}
};
Tree.prototype.selectAll=function(){
for(var i=0;i<this.aItems.length;++i){
this.select(this.aItems[i],true);
}
this.update();
};
Tree.prototype.selectRange=function(_cf,_d0){
if(!_d0){
while(this.aSelection.length){
this.aSelection.pop().setUnselected();
}
}
var _d1=this.indexOf(this.shiftItem);
var _d2=this.indexOf(_cf);
var _d3=_d1>_d2?_d2:_d1;
var iTo=_d1<_d2?_d2:_d1;
for(var i=_d3;i<=iTo;++i){
this.aSelection.push(this.aItems[i]);
this.aItems[i].setSelected();
}
this.notifySelectionListener();
this.activateItem(_cf);
};
Tree.prototype.setLinesVisible=function(_d6){
this.bShowLines=_d6;
};
Tree.prototype.toggleSelection=function(_d7){
if(this.aSelection.contains(_d7)){
this.deselect(_d7);
}else{
this.select(_d7);
}
};
Tree.prototype.toString=function(){
return "[object Tree]";
};
Tree.prototype.update=function(){
if(this.domref==null){
this.setDomRef(document.createElement("ul"));
this.focushack=document.createElement("input");
this.focushack.obj=this;
this.focushack.style.position="absolute";
this.focushack.style.left="-9999px";
this.domref.appendChild(this.focushack);
var em=gaia.getEventManager();
var _d9=new EventListener();
var _da=new EventListener();
var _db=new EventListener();
var _dc=new EventListener();
_dc.setTarget(this);
_dc.setMethod("onFocus");
em.addEventListener(this.focushack,"focus",_dc);
_db.setTarget(this);
_db.setMethod("onBlur");
em.addEventListener(this.focushack,"blur",_db);
_d9.setTarget(this);
_d9.setMethod("keyHandler");
em.addEventListener(this.focushack,"keydown",_d9);
_da.setTarget(this);
_da.setMethod("forceFocus");
this.addListener("mousedown",_da);
}
this.removeClassName("jsWTTreeNoLines");
this.removeClassName("jsWTTreeLines");
if(this.bShowLines){
this.addClassName("jsWTTreeLines");
}else{
this.addClassName("jsWTTreeNoLines");
}
this.domref.className=this.sClassName;
this.updateItems(this.aTopItems,this.domref);
this.parentElement.appendChild(this.domref);
};
Tree.prototype.updateItems=function(_dd,_de){
var _df=_dd.length;
for(var i=0;i<_df;++i){
var _e1=_dd[i];
var _e2=i==(_df-1);
if(!_e1.isCreated()){
node=_e1.create(_e2);
_de.appendChild(node);
var _e3=new EventListener();
_e3.setTarget(this);
_e3.setMethod("keyHandler");
_e1.addListener("keydown",_e3);
}
if(_e1.hasChanged()){
_e1.update();
_e1.releaseChange();
}
if(_e1.hasChilds()){
var _e4=_e1.getChildContainer();
this.updateItems(_e1.getItems(),_e4);
}
if(_e2&&_e1.getClassName().indexOf("bottom")==-1){
_e1.addClassName("bottom");
if(_e1.hasChilds()){
var cc=_e1.getChildContainer();
cc.className="bottom";
}
}else{
if(!_e2&&_e1.getClassName().indexOf("bottom")!=-1){
_e1.removeClassName("bottom");
if(_e1.hasChilds()){
var cc=_e1.getChildContainer();
cc.className=null;
}
}
}
}
};
function Item(){
this.sText="";
this.sClassName="";
this.image=null;
this.bChanged=false;
this.bActive=false;
}
Item.inheritsFrom(Widget);
Item.prototype.addClassName=function(_e6){
this.sClassName+=" "+_e6;
this.bChanged=true;
};
Item.prototype.getClassName=function(){
return this.sClassName;
};
Item.prototype.getHtmlNode=function(){
return this.htmlNode;
};
Item.prototype.getImage=function(){
return this.image;
};
Item.prototype.getText=function(){
return this.sText;
};
Item.prototype.hasChanged=function(){
return this.bChanged;
};
Item.prototype.isCreated=function(){
return this.domref!=null;
};
Item.prototype.releaseChange=function(){
this.bChanged=false;
};
Item.prototype.removeClassName=function(_e7){
this.sClassName=strReplace(this.sClassName,_e7,"");
this.bChanged=true;
};
Item.prototype.setActive=function(_e8){
this.bActive=_e8;
if(_e8){
this.addClassName("active");
}else{
this.removeClassName("active");
}
this.bChanged=true;
};
Item.prototype.setClassName=function(_e9){
this.sClassName=_e9;
this.bChanged=true;
};
Item.prototype.setImage=function(_ea){
this.image=_ea;
this.bChanged=true;
};
Item.prototype.setPainted=function(_eb){
this.bIsPainted=_eb;
if(_eb){
this.bChanged=false;
}
};
Item.prototype.setText=function(_ec){
this.sText=_ec;
this.bChanged=true;
};
Item.prototype.toString=function(){
return "[object Item]";
};
function TreeItem(_ed){
if((!_ed instanceof (Tree))||(!_ed instanceof (TreeItem))){
throw new WrongObjectException("Passed parent is neither a Tree nor a TreeItem","TreeItem","TreeItem");
}
this.listeners=new Object();
Item.prototype.constructor.call(this);
this.aChilds=new Array();
this.bIsExpanded=true;
this.childContainer=null;
this.parentItem=null;
this.tree=null;
if(_ed instanceof (Tree)){
this.parentItem=_ed;
this.tree=_ed;
this.tree.addItem(this);
_ed.addTopItem(this);
}else{
if(_ed instanceof (TreeItem)){
this.parentItem=_ed;
this.tree=_ed.getTree();
this.tree.addItem(this);
_ed.addItem(this);
}
}
this.img=null;
this.toggler=null;
this.textSpan=null;
this.textSpanBox=null;
}
TreeItem.inheritsFrom(Item);
TreeItem.prototype.addItem=function(_ee){
if(!_ee instanceof TreeItem){
throw new WrongObjectException("New item is not instance of TreeItem","TreeItem","addItem");
}
this.aChilds.push(_ee);
};
TreeItem.prototype.collapse=function(){
if(this.childContainer!=null){
this.childContainer.style.display="none";
}
this.deselectChilds();
this.bIsExpanded=false;
this.bChanged=true;
};
TreeItem.prototype.create=function(_ef){
if(_ef){
this.addClassName("bottom");
}
var em=gaia.getEventManager();
var _f1=new Array();
var _f2=new Array();
var _f3=new EventListener();
var _f4=new EventListener();
_f3.setTarget(this);
_f3.setMethod("toggleChilds");
_f4.setTarget(this.tree);
_f4.setMethod("selectHandler");
this.domref=document.createElement("li");
this.domref.className=this.getClassName();
this.domref.obj=this;
this.img=null;
this.toggler=document.createElement("span");
this.toggler.obj=this;
this.textSpanBox=document.createElement("span");
this.textSpanBox.obj=this;
this.textSpan=document.createElement("span");
this.textSpan.obj=this;
this.toggler.className="toggler";
this.toggler.className+=this.hasChilds()?(this.isExpanded()?" togglerExpanded":" togglerCollapsed"):"";
this.domref.appendChild(this.toggler);
if(this.image!=null){
this.img=document.createElement("img");
this.img.obj=this;
this.img.src=this.image.src;
this.img.alt=this.sText;
_f1.push(em.addEventListener(this.img,"dblclick",_f3));
_f2.push(em.addEventListener(this.img,"mousedown",_f4));
this.textSpanBox.appendChild(this.img);
}
this.textSpan.className="text";
this.textSpan["innerHTML"]=this.sText;
this.textSpanBox.className="textBox";
this.textSpanBox.appendChild(this.textSpan);
this.domref.appendChild(this.textSpanBox);
if(this.hasChilds()){
this.childContainer=document.createElement("ul");
if(_ef){
this.childContainer.className="bottom";
}
if(this.isExpanded()){
this.childContainer.style.display="block";
}else{
this.childContainer.style.display="none";
}
this.domref.appendChild(this.childContainer);
}
em.addEventListener(this.toggler,"click",_f3);
_f1.push(em.addEventListener(this.textSpan,"dblclick",_f3));
_f2.push(em.addEventListener(this.textSpan,"mousedown",_f4));
for(var _f5 in this.listeners){
for(var i=0;i<this.listeners[_f5].length;++i){
var _f7=this.listeners[_f5][i];
var evs=this.registerListener(_f5,_f7);
_f7.events=evs;
}
}
if(!this.listeners.hasOwnProperty("dblclick")){
this.listeners.dblclick=new Array();
}
if(!this.listeners.hasOwnProperty("mousedown")){
this.listeners.mousedown=new Array();
}
_f3.events=_f1;
_f4.events=_f2;
this.listeners.dblclick.push(_f3);
this.listeners.mousedown.push(_f4);
return this.domref;
};
TreeItem.prototype.createChildContainer=function(){
this.childContainer=document.createElement("ul");
if(this.getClassName().indexOf("bottom")!=-1){
this.childContainer.className="bottom";
}
if(this.isExpanded()){
this.childContainer.style.display="block";
}else{
this.childContainer.style.display="none";
}
this.domref.appendChild(this.childContainer);
};
TreeItem.prototype.deselectChilds=function(){
for(var i=0;i<this.aChilds.length;++i){
if(this.aChilds[i].hasChilds()){
this.aChilds[i].deselectChilds();
}
this.tree.deselect(this.aChilds[i]);
}
};
TreeItem.prototype.expand=function(){
if(this.childContainer!=null){
this.childContainer.style.display="block";
}
this.bIsExpanded=true;
this.bChanged=true;
};
TreeItem.prototype.getChildContainer=function(){
if(this.childContainer==null){
this.createChildContainer();
}
return this.childContainer;
};
TreeItem.prototype.getItemCount=function(){
return this.aChilds.length;
};
TreeItem.prototype.getItems=function(){
return this.aChilds;
};
TreeItem.prototype.getParentItem=function(){
return this.parentItem;
};
TreeItem.prototype.getParent=function(){
if(this.parentItem!=null){
return this.parentItem;
}else{
return this.tree;
}
};
TreeItem.prototype.getTree=function(){
return this.tree;
};
TreeItem.prototype.hasChilds=function(){
return this.aChilds.length>0;
};
TreeItem.prototype.isExpanded=function(){
return this.bIsExpanded;
};
TreeItem.prototype.registerListener=function(_fa,_fb){
var em=gaia.getEventManager();
var evs=[];
if(this.img!=null){
evs.push(em.addEventListener(this.img,_fa,_fb));
}
evs.push(em.addEventListener(this.textSpan,_fa,_fb));
return evs;
};
TreeItem.prototype.setActive=function(_fe){
this.bActive=_fe;
var _ff=this.domref.getElementsByTagName("span")[1].getElementsByTagName("span")[0];
if(_fe){
_ff.className+=" active";
}else{
_ff.className=_ff.className.replace(/ *active/,"");
}
this.bChanged=true;
};
TreeItem.prototype.setChildContainer=function(_100){
if(!_100 instanceof HTMLElement){
throw new WrongObjectException("container is not instance of HTMLElement","TreeItem","setChildContainer");
}
this.childContainer=_100;
};
TreeItem.prototype.setSelected=function(){
if((this.parentItem!=this.tree&&this.parentItem.isExpanded())||this.parentItem==this.tree){
var span=this.domref.getElementsByTagName("span")[1].getElementsByTagName("span")[0];
span.className="text selected";
}
};
TreeItem.prototype.setUnselected=function(){
var span=this.domref.getElementsByTagName("span")[1].getElementsByTagName("span")[0];
span.className="text";
};
TreeItem.prototype.toggleChilds=function(){
if(this.isExpanded()){
this.collapse();
}else{
this.expand();
}
if(!this.tree.isFocusControl()){
this.tree.forceFocus();
}
this.tree.update();
};
TreeItem.prototype.toString=function(){
return "[object TreeItem]";
};
TreeItem.prototype.update=function(){
if(this.hasChilds()){
this.toggler.className=strReplace(this.toggler.className," togglerCollapsed","");
this.toggler.className=strReplace(this.toggler.className," togglerExpanded","");
if(this.isExpanded()){
this.toggler.className+=" togglerExpanded";
}else{
this.toggler.className+=" togglerCollapsed";
}
}
if(this.image!=null&&this.img==null){
this.img=document.createElement("img");
this.img.obj=this;
this.img.alt=this.sText;
this.img.src=this.image.src;
this.textSpanBox.insertBefore(this.img,this.textSpan);
var em=gaia.getEventManager();
for(var _104 in this.listeners){
for(var i=0;i<this.listeners[_104].length;++i){
var _106=this.listeners[_104][i];
var _107=em.addEventListener(this.img,_104,_106);
_106.events.push(_107);
}
}
}else{
if(this.image!=null){
this.img.src=this.image.src;
this.img.alt=this.sText;
}else{
if(this.img!=null&&this.image==null){
var em=gaia.getEventManager();
for(var _104 in this.listeners){
for(var i=0;i<this.listeners[_104].length;++i){
var _106=this.listeners[_104][i];
var _108=_106.events;
for(var j=0;j<_108.length;++j){
var _107=_108[j];
if(_107.domNode==this.img){
em.removeEventListener(_107);
_108.remove(j);
}
}
}
}
this.textSpanBox.removeChild(this.img);
this.img=null;
}
}
}
if(this.hasChilds()&&this.childContainer==null){
this.createChildContainer();
}else{
if(!this.hasChilds()&&this.childContainer!=null){
this.domref.removeChild(this.childContainer);
this.childContainer=null;
}
}
this.domref.className=this.getClassName();
};
function ListItem(_10a){
if(!_10a instanceof List){
throw new WrongObjectException("Control is not instance of List","ListItem","ListItem");
}
_10a.addItem(this);
Item.prototype.constructor.call(this);
}
ListItem.inheritsFrom(Item);
function List(_10b){
if(!_10b instanceof (HTMLElement)){
throw new WrongObjectException("parentElement ist not a HTMLElement","List","List");
}
Control.prototype.constructor.call(this);
this.list=null;
this.aSelection=new Array();
this.aSelectionListeners=new Array();
this.sClassName="jsWTList";
this.parentElement=_10b;
}
List.inheritsFrom(Control);
List.prototype.addItem=function(_10c){
if(!_10c instanceof ListItem){
throw new WrongObjectException("New item is not instance of ListItem","List","addItem");
}
this.aItems.push(_10c);
};
List.prototype.addSelectionListener=function(_10d){
try{
jsRIA.getInterfaceTester().isSelectionListener(_10d);
}
catch(e){
jsRIA.getExceptionHandler().exceptionRaised(e);
}
this.aSelectionListeners.push(_10d);
};
List.prototype.createItem=function(item,node){
var img;
if(typeof (node)=="undefined"){
node=document.createElement("li");
}
node["innerHTML"]=item.getText();
node.className=item.getClassName();
if(img=item.getImage()){
node.style.backgroundImage="url('"+img.src+"')";
}
return node;
};
List.prototype.deselect=function(_111,_112){
if(typeof (_112)=="undefined"){
if(_111 instanceof (Array)){
for(var i=0;i<_111.length;++i){
try{
this.deselect(_111[i]);
}
catch(e){
throw (e);
}
}
}else{
if(typeof (_111)=="number"){
try{
var item=this.getItem(_111);
}
catch(e){
throw e;
}
if(this.aSelection.contains(_111)){
item.removeClassName("selected");
this.aSelection.remove(this.aSelection.getKey(_111));
this.notifySelectionListener();
}
}
}
}else{
var _115=new Array();
for(var i=_111;i<=_112;++i){
_115.push(i);
}
try{
this.deselect(_115);
}
catch(e){
throw (e);
}
}
};
List.prototype.deselectAll=function(){
try{
this.deselect(0,this.aItems.length-1);
this.update();
}
catch(e){
throw (e);
}
};
List.prototype.getItem=function(_116){
if(_116>=this.aItems.length){
throw new OutOfBoundsException("Your item lives outside of this list","List","getItem");
}
return this.aItems[_116];
};
List.prototype.getItemCount=function(){
return this.aItems.length;
};
List.prototype.getItems=function(){
return this.aItems;
};
List.prototype.getSelection=function(){
var _117=new Array();
for(var i=0;i<this.aSelection.length;++i){
try{
var _119=this.aSelection[i];
var item=this.getItem(_119);
_117.push(item);
}
catch(e){
throw e;
}
}
return _117;
};
List.prototype.getSelectionCount=function(){
return this.aSelection.length;
};
List.prototype.getSelectionIndex=function(){
if(this.aSelection.length>0){
return this.aSelection[0];
}else{
return -1;
}
};
List.prototype.getSelectionIndices=function(){
return this.aSelection;
};
List.prototype.indexOf=function(item){
if(!item instanceof (ListItem)){
throw new WrongObjectException("item not instance of ListItem","List","indexOf");
}
if(!this.aItems.contains(item)){
throw new ItemNotExistsException(item.getText(),"List","indexOf");
}
return this.aItems.getKey(item);
};
List.prototype.isSelected=function(_11c){
return this.aSelection.contains(_11c);
};
List.prototype.notifySelectionListener=function(){
for(var i=0;i<this.aSelectionListeners.length;++i){
this.aSelectionListeners[i].widgetSelected(this);
}
};
List.prototype.removeSelectionListener=function(_11e){
if(this.aSelectionListeners.contains(_11e)){
var _11f=this.aSelectionListeners.getKey(_11e);
this.aSelectionListeners.remove(_11f);
}
};
List.prototype.select=function(_120,_121){
if(typeof (_121)=="undefined"){
if(_120 instanceof (Array)){
for(var i=0;i<_120.length;++i){
try{
this.select(_120[i]);
}
catch(e){
throw (e);
}
}
}else{
if(typeof (_120)=="number"){
try{
var item=this.getItem(_120);
}
catch(e){
throw e;
}
if(!this.aSelection.contains(_120)){
item.addClassName("selected");
this.aSelection.push(_120);
this.notifySelectionListener();
}
}
}
}else{
var _124=new Array();
for(var i=_120;i<=_121;++i){
_124.push(i);
}
try{
this.select(_124);
}
catch(e){
throw (e);
}
}
};
List.prototype.selectAll=function(){
try{
this.select(0,this.aItems.length-1);
this.update();
}
catch(e){
throw (e);
}
};
List.prototype.setItem=function(_125,item){
if(!item instanceof (ListItem)){
throw new WrongObjectException("item not instance of ListItem","List","setItem");
}
if(_125>=this.aItems.length){
throw new OutOfBoundsException("index not assigned","List","setItem");
}
this.aItems[_125]=item;
};
List.prototype.setItems=function(_127){
this.aItems=_127;
};
List.prototype.toggleSelection=function(_128){
var _129;
if(typeof (_128)=="object"){
try{
_129=this.indexOf(_128);
}
catch(e){
throw e;
}
}else{
if(typeof (_128)=="number"){
_129=_128;
}
}
if(this.aSelection.contains(_129)){
this.deselect(_129);
}else{
this.select(_129);
}
this.update();
};
List.prototype.update=function(){
if(this.list==null){
this.list=document.createElement("ul");
this.list.className=this.sClassName;
}
for(var i=0;i<this.aItems.length;++i){
var item=this.aItems[i];
if(!item.isPainted()){
node=this.createItem(item);
this.list.appendChild(node);
item.setPainted(true);
item.setHtmlNode(node);
var p=new ParamSet();
p.addParam(item);
item.addEventHandler("click",this,"toggleSelection",p);
}else{
if(item.hasChanged()){
this.createItem(item,item.getHtmlNode());
item.releaseChange();
}
}
}
this.parentElement.appendChild(this.list);
};

