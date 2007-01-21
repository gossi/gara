function main() {
	var myc = new MyClass();
	var box = document.getElementById("box");
	
	var em = jsRIA.getEventManager();
	var e = em.newEvent();
	
	//e.target = myc;
	//e.method = "test";
//	e.fnc = function() {
//		alert("buhuu aus function");		
//	}
	e.addEventListener(box, "click");
}

function MyClass() {
		
}

MyClass.prototype.test = function(evt) {
	alert("buuhuu class test " + evt.source);
}

main();