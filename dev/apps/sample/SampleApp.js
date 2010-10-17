gara.provide("sample.SampleApp", "gara.window.Application");

gara.use("gara.layout.ColumnLayout");
gara.use("gara.widgets.TabFolder");
gara.use("gara.widgets.Table");
gara.use("gara.widgets.TableColumn");
gara.use("gara.widgets.Tree");
gara.use("gara.widgets.List");

gara.Class("sample.SampleApp", function () { return {

	$extends : gara.window.Application,

	/**
	 * @constructor
	 */
	$constructor : function (parentShell) {
		this.$super(parentShell);
	},
	
	createAppContents : function (parent) {
		var tab, tree, list, table;
		parent.setLayout(new gara.layout.ColumnLayout(gara.LAYOUT_LOOSY));

		// Images
		var imgInfo = new Image();
		imgInfo.src = "../../css/themes/sand/icon_information.png";

		var imgError = new Image();
		imgError.src = '../../css/themes/sand/icon_error.png';

		var imgWarning = new Image();
		imgWarning.src = '../../css/themes/sand/icon_warning.png';
		
//		list = new gara.widgets.List(parent).addClass("w50");
//		
//		for (var i = 1; i <= 10; i++) {
//			new gara.widgets.ListItem(list).setText("List Item " + i);
//		}
		
		// left
		// Init TabFolder
		tab = new gara.widgets.TabFolder(parent, gara.DROP_DOWN).addClass("w50");

		// Tree Widget
		tree = new gara.widgets.Tree(tab, gara.CHECK | gara.FULL_SELECTION);

		var treeItem = new gara.widgets.TreeItem(tree).setText("Item 1").setImage(imgInfo);
		new gara.widgets.TreeItem(tree).setText("Item 1a");
		new gara.widgets.TreeItem(tree).setText("Item 1b");
		new gara.widgets.TreeItem(tree).setText("Item 1c");
		new gara.widgets.TreeItem(tree).setText("Item 1d");
		new gara.widgets.TreeItem(tree).setText("Item 1e");
		var i2 = new gara.widgets.TreeItem(tree).setText("Item 2");
		var i3 = new gara.widgets.TreeItem(i2).setText("Item 3");
		new gara.widgets.TreeItem(i3).setText("Item 4");
		new gara.widgets.TreeItem(i3).setText("Item 5");
		var i6 = new gara.widgets.TreeItem(i2).setText("Item 6");
		var i7 = new gara.widgets.TreeItem(i6).setText("Item 7");
		var i7a = new gara.widgets.TreeItem(i7).setText("Item 7a");
		var i7b = new gara.widgets.TreeItem(i7a).setText("Item 7b");
		new gara.widgets.TreeItem(i7b).setText("Item 7c");
		new gara.widgets.TreeItem(tree).setText("Item 8");


		// List Widget
		list = new gara.widgets.List(tab, gara.CHECK | gara.MULTI  | gara.FULL_SELECTION); //

		new gara.widgets.ListItem(list).setText("Item 1");
		new gara.widgets.ListItem(list).setText("Item 2").setImage(imgInfo);
		new gara.widgets.ListItem(list).setText("Item 3");
		new gara.widgets.ListItem(list).setText("Item 4").setImage(imgWarning);
		new gara.widgets.ListItem(list).setText("Item 5");
		new gara.widgets.ListItem(list).setText("Item 6");
		new gara.widgets.ListItem(list).setText("Item 7");
		
		// Table Widget
		table = new gara.widgets.Table(tab, gara.SINGLE | gara.FULL_SELECTION); // | gara.CHECK  
		table.setHeaderVisible(true);
		table.setLinesVisible(false);

		new gara.widgets.TableColumn(table, gara.DEFAULT).setText("col 1");
		new gara.widgets.TableColumn(table, gara.DEFAULT).setText("col 2");
		new gara.widgets.TableColumn(table, gara.DEFAULT).setText("col 3");

		new gara.widgets.TableItem(table).setText(["Item1, 1", "i1, 2", "i1, 3"]);
		new gara.widgets.TableItem(table).setText(["Item2, 1", "i2, 2", "i2, 3"]).setImage([imgInfo]);
		new gara.widgets.TableItem(table).setText(["Item3, 1", "i3, 2", "i3, 3"]);
		new gara.widgets.TableItem(table).setText(["Item4, 1", "i4, 2", "i4, 3"]).setImage([imgWarning]);
		new gara.widgets.TableItem(table).setText(["Item5, 1", "i5, 2", "i5, 3"]);
		new gara.widgets.TableItem(table).setText(["Item6, 1", "i6, 2", "i6, 3"]);

		// TabItems
		new gara.widgets.TabItem(tab).setText("List Widget").setControl(list);
		new gara.widgets.TabItem(tab).setText("Tree Widget").setControl(tree);
		new gara.widgets.TabItem(tab).setText("Table Widget").setControl(table);
	}
};});