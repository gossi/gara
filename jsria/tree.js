function main() {
	jsRIA.getConsole().printOpenBox();
	
	l = new TreeListener();
	t = new Tree(document.getElementsByTagName("body")[0]);
	t.addSelectionListener(l);
	
	var i1 = new TreeItem(t);
	i1.setText("item1");
	var i2 = new TreeItem(t);
	i2.setText("item2");
	
	var i3 = new TreeItem(i2);
	i3.setText("item3");
	
	var i4 = new TreeItem(t);
	i4.setText("item4");
	
	var i5 = new TreeItem(i3);
	i5.setText("item5");
	
	var i6 = new TreeItem(i2);
	i6.setText("item6");
	
	var i7 = new TreeItem(i6)
	i7.setText("item7");
	
	var i8 = new TreeItem(i1);
	i8.setText("item8");
	
	var i9img = new Image();
	i9img.src = "jsRIA/res/images/error.png";
	var i9 = new TreeItem(i4);
	i9.setText("item9");
	i9.setImage(i9img);
	
	t.update();
}

function selectAll() {
	t.selectAll();
}

function deselectAll() {
	t.deselectAll();
}

function showLines() {
	t.setLinesVisible(true);
	t.update();
}

function hideLines() {
	t.setLinesVisible(false);
	t.update();
}

function addItem() {
	var parentItem = document.getElementById("parentList").value;
	
	if (parentItem == "tree") {
		parentItem = t;
	} else {
		parentItem = l.getItem(parentItem);
	}

	var sName = document.getElementById("itemName").value == "" ? "N/A" : document.getElementById("itemName").value;
	var i = new TreeItem(parentItem);
	i.setText(sName);

	jsRIA.getLog().addMessage("item added: " + i.getText());
	t.update();
}

function TreeListener() {
	this.items = new Array();
	this.widgetSelected = function(tree) {
		this.items = null;
		this.items = tree.getSelection();
		
		var list = document.getElementById("parentList");

		// clear list
		for (var i = 1; i < list.options.length; ++i) {
			list.options[i] = null;
		}
		
		// refill list
		for (var i = 0; i < this.items.length; ++i) {
			list.options[i + 1] = new Option(this.items[i].getText());
			list.options[i + 1].value = i;
		}
	}
	
	this.getItem = function(iOffset) {
		return this.items[iOffset];
	}
}

main();