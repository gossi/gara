var il, il1, il2, il3, il4, il5;
var wl, wl1, wl2, wl3, wl4, wl5;

function main() {
	var itemTester = new ItemTester();
	
	il = new gara.jswt.List(document.getElementById("itemTest"));
	
	il1 = new gara.jswt.ListItem(il);
	il1.setText("Mousedown on me");
	il1.addListener('mousedown', itemTester);
	
	il2 = new gara.jswt.ListItem(il);
	il2.setText("Mouseup on me");
	il2.addListener('mouseup', itemTester);
	
	il3 = new gara.jswt.ListItem(il);
	il3.setText("Click me");
	il3.addListener('click', itemTester);
	
	il4 = new gara.jswt.ListItem(il);
	il4.setText("DblClick me");
	il4.addListener('dblclick', itemTester);
	
	il5 = new gara.jswt.ListItem(il);
	il5.setText("Keydown on me");
	il5.addListener('keydown', itemTester);
	
	il.update();
	
	var widgetTester = new WidgetTester();
	
	wl = new gara.jswt.List(document.getElementById("widgetTest"));

	wl1 = new gara.jswt.ListItem(wl);
	wl1.setText("Mousedown on me");

	wl2 = new gara.jswt.ListItem(wl);
	wl2.setText("Mouseup on me");

	wl3 = new gara.jswt.ListItem(wl);
	wl3.setText("Click me");

	wl4 = new gara.jswt.ListItem(wl);
	wl4.setText("DblClick me");

	wl5 = new gara.jswt.ListItem(wl);
	wl5.setText("Keydown on me");

	wl.addListener('mousedown', widgetTester);
	wl.addListener('mouseup', widgetTester);
	wl.addListener('click', widgetTester);
	wl.addListener('dblclick', widgetTester);
	wl.addListener('keydown', widgetTester);

	wl.update();
}

$class("EventTest", {
	$constructor : function() {
		
	},
	
	handleEvent : function(e) {
		var itemText = this.getItemText(e);
		var testNumber = this.getTestNumber(e);
		
		var tr = document.getElementById(testNumber);
		var tdItemText = tr.getElementsByTagName("td")[1];
		var tdPassed = tr.getElementsByTagName("td")[2];
		
		tdItemText.innerHTML = itemText;
		tdPassed.style.backgroundColor = "#080";
		tdPassed.style.color = "#FFF";
		tdPassed.innerHTML = "Passed";
	},
	
	getItemText : $abstract(function(e) {}),
	getTestNumber : $abstract(function(e) {})
});

$class("ItemTester", {
	$extends : EventTest,

	testNumbers : {
		'mousedown' : 'A1',
		'mouseup' : 'A2',
		'click' : 'A3',
		'dblclick' : 'A4',
		'keydown' : 'A5'
	},

	$constructor : function() {
		
	},

	getItemText : function(e) {
		return e.target.obj.getText();
	},

	getTestNumber : function(e) {
		if (this.testNumbers.hasOwnProperty(e.type)) {
			return this.testNumbers[e.type];
		} else {
			return "undefined";
		}
	}
});

$class("WidgetTester", {
	$extends : EventTest,

	testNumbers : {
		'mousedown' : 'B1',
		'mouseup' : 'B2',
		'click' : 'B3',
		'dblclick' : 'B4',
		'keydown' : 'B5'
	},

	$constructor : function(e) {
		
	},

	getItemText : function(e) {
		return e.target.control.getSelection()[0].getText();
	},

	getTestNumber : function(e) {
		if (this.testNumbers.hasOwnProperty(e.type)) {
			return this.testNumbers[e.type];
		} else {
			return "undefined";
		}
	}
});

main();