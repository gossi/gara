function main(modules) {
	// Permissions
	var actionController = new ActionController();
	var actionViewer = gara.jsface.CheckboxListViewer.newCheckList(document.getElementById("actions"), gara.jswt.JSWT.DEFAULT);
	actionViewer.setContentProvider(actionController);
	actionViewer.setLabelProvider(actionController);
	actionViewer.addCheckStateListener(actionController);
	
	var moduleController = new ModuleController();
	moduleController.setActionViewer(actionViewer);

	var moduleViewer = new gara.jsface.ListViewer(document.getElementById("modules"), gara.jswt.JSWT.DEFAULT);
	moduleViewer.setContentProvider(moduleController);
	moduleViewer.setLabelProvider(moduleController);
	moduleViewer.setInput(modules);
	moduleViewer.addSelectionChangedListener(moduleController);
	moduleViewer.getControl().setSelection(0);
	
	// TabFolder
	var folder = new gara.jswt.TabFolder(document.getElementById("main"));

	var generalItem = new gara.jswt.TabItem(folder);
	generalItem.setText("general");
	generalItem.setContent(document.getElementById("main").removeChild(document.getElementById("form")));

	var permItem = new gara.jswt.TabItem(folder);
	permItem.setText("perm");
	permItem.setContent(document.getElementById("main").removeChild(document.getElementById("permissions")));
	
	var pagesItem = new gara.jswt.TabItem(folder);
	pagesItem.setText("pages");
	pagesItem.setContent("Permissions, auf Pages zugreifen zu dürfen");

	var usersItem = new gara.jswt.TabItem(folder);
	usersItem.setText("users");
	usersItem.setContent("Hier kommt ne Liste mit usern drinne, zum added und removen. Aber erst wenn das mit der Useradmin klappt");

	folder.update();
	
	gara.EventManager.addListener(document.getElementById("btnCancel"), "click", function(e) {
		window.parent.gara.jswt.DialogManager.getInstance().getActiveDialog().dispose();
	});
	
	gara.EventManager.addListener(document.getElementById("btnOk"), "click", function(e) {
		var diag = window.parent.gara.jswt.DialogManager.getInstance().getActiveDialog();
		var name = document.getElementById("name").value;
		var active = document.getElementById("active").checked;
		var params = "name="+name;
		if (active) {
			params += "&active=1";
		}

		window.parent.remoteRequest = new window.parent.XHR();
		window.parent.remoteRequest.open("POST", target, true);
		window.parent.remoteRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		window.parent.remoteRequest.onreadystatechange = window.parent.remoteResponder;
		window.parent.remoteRequest.send(params);
		
		diag.dispose();
	});
}

$class("ModuleController", {
	$implements : [gara.jsface.ILabelProvider, gara.jsface.IStructuredContentProvider, gara.jsface.ISelectionChangedListener],

	$constructor : function() {
		this._model = null;
		this._moduleImg = new Image();
		this._moduleImg.src = "modules/Groups/media/images/icons/module.png";
		this._actionViewer;
	},

	getImage : function(element) {
		return this._moduleImg;
	},

	getText : function(element) {
		return element.unixname;
	},

	getElements : function(inputElement) {
		return this._model;
	},
	
	inputChanged : function(viewer, oldInput, newInput) {
		this._model = newInput;
	},
	
	isLabelProperty : function(element, property) {},
	
	setActionViewer : function(viewer) {
		this._actionViewer = viewer;
	},
	
	selectionChanged : function(event) {
		if (event.getSelection().length) {
			var elem = event.getSelection()[0];
			this._actionViewer.setInput(elem.actions);
			
			var checked = [];
			elem.actions.forEach(function(action, index, arr){
				if (action.checked) {
					checked.push(action);
				}
			});
			this._actionViewer.setCheckedElements(checked);
		} else {
			this._actionViewer.setInput([]);
		}
	}
});

$class("ActionController", {
	$implements : [gara.jsface.ILabelProvider, gara.jsface.IStructuredContentProvider, gara.jsface.ICheckStateListener],

	$constructor : function() {
		this._model = null;
		this._actionImg = new Image();
		this._actionImg.src = "modules/Groups/media/images/icons/action.png";
	},
	
	checkStateChanged : function(event) {
		event.getElement().checked = event.getState();
		//console.log("Check State Changed for: " + this.getText(event.getElement()) + ", checked: " + event.getState());
	},

	getImage : function(element) {
		return this._actionImg;
	},

	getText : function(element) {
		return element.name;
	},

	getElements : function(inputElement) {
		return this._model;
	},
	
	inputChanged : function(viewer, oldInput, newInput) {
		this._model = newInput;
	},
	
	isLabelProperty : function(element, property) {}
});
