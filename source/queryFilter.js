enyo.kind({
	name: 'queryFilter',
	kind: "enyo.FittableColumns",
	style: "background-color: grey;",
	fit: true,
	events: {onAddToQuery: ""},
	published: {propertyTable: [], associationTable: [], complexTypeTable: [], entityTypeTable: [], option: ''},
	components: [
		{name: "propertyList", kind: "enyo.List", multiSelect: false, style : "min-width: 20%; height: 240px; background-color: white;", onSetupItem: "setupItemProperty", components: [
			{name: "itemProperty", classes: "list-sample-item enyo-border-box", ontap: "propertySelected", components: [
				{name: "property"}
			]}
		]},
		{name: "operatorList", kind: "enyo.List", multiSelect: false, style : "min-width: 20%; height: 240px; background-color: white;", onSetupItem: "setupItemOperator", components: [
			{name: "itemOperator", classes: "list-sample-item enyo-border-box", ontap: "operatorSelected", components: [
				{name: "operator",notation: ''}
			]}
		]},
		{name: "functionList", kind: "enyo.List", multiSelect: false, style : "min-width: 20%; height: 240px; background-color: white;", onSetupItem: "setupItemFunction", components: [
			{name: "itemFunction", classes: "list-sample-item enyo-border-box", ontap: "functionSelected", components: [
				{name: "functions",notation: ''}
			]}
		]}
	],
	
	operatorTable: [
		{notation: 'eq', name: 'Equal'},
		{notation: 'ne', name: 'Not equal'},
		{notation: 'gt', name: 'Greater than'}, 
		{notation: 'ge', name: 'Greater than or equal'},
		{notation: 'lt', name: 'Less than'},
		{notation: 'le', name: 'Less than or equal'},
		{notation: 'and', name: 'Logical and'},
		{notation: 'or', name: 'Logical or'},
		{notation: 'not', name: 'Logical negation'},
		{notation: 'add', name: 'Addition'},
		{notation: 'sub', name: 'Subtraction'},
		{notation: 'mul', name: 'Multiplication'},
		{notation: 'div', name: 'Division'},
		{notation: 'mod', name: 'Modulo'},
		{notation: '(', name: 'Open parentheses'},
		{notation: ')', name: 'Close parentheses'},
	],
	
	functionTable: [
		{notation: 'substringof(', name: 'bool substringof(string po, string p1))'},
		{notation: 'endswith(', name: 'bool endswith(string p0, string p1)'},
		{notation: 'startswith(', name: 'bool startswith(string p0, string p1)'},
		{notation: 'length(', name: 'int length(string p0)'},
		{notation: 'indexof(', name: 'int indexof(string p0, string p1)'},
		{notation: 'replace(', name: 'string replace(string p0, string find, string replace)'},
		{notation: 'substring(', name: 'string substring(string p0, int pos)'},
		{notation: 'substring(', name: 'string substring(string p0, int pos, int length)'},
		{notation: 'tolower(', name: 'string tolower(string p0)'},
		{notation: 'toupper(', name: 'string toupper(string p0)'},
		{notation: 'trim(', name: 'string trim(string p0)'},
		{notation: 'concat(', name: 'string concat(string p0, string p1)'},
		{notation: 'day(', name: 'int day(DateTime p0)'},
		{notation: 'hour(', name: 'int hour(DateTime p0)'},
		{notation: 'minute(', name: 'int minute(DateTime p0)'},
		{notation: 'month(', name: 'int month(DateTime p0)'},
		{notation: 'second(', name: 'int second(DateTime p0)'},
		{notation: 'year(', name: 'int year(DateTime p0)'},
		{notation: 'round(', name: 'double round(double p0)'},
		{notation: 'round(', name: 'decimal round(decimal p0)'},
		{notation: 'floor(', name: 'double floor(double p0)'},
		{notation: 'floor(', name: 'decimal floor(decimal p0)'},
		{notation: 'ceiling(', name: 'double ceiling(double p0)'},
		{notation: 'ceiling(', name: 'decimal ceiling(decimal p0)'},
		{notation: 'IsOf(', name: 'bool IsOf(type p0)'},
		{notation: 'IsOf(', name: 'bool IsOf(expression p0, type p1)'}
	],
	
	create: function() {
		this.inherited(arguments);
		this.$.propertyList.setCount(this.propertyTable.length+this.associationTable.length+this.complexTypeTable.length+this.entityTypeTable.length);
		this.$.propertyList.refresh();
		this.$.operatorList.setCount(this.operatorTable.length);
		this.$.operatorList.refresh();
		this.$.functionList.setCount(this.functionTable.length);
		this.$.functionList.refresh();
		this.createComponent({
			kind: "onyx.InputDecorator", 
			components: [
				{kind: "onyx.Input", name: "queryElementInput", disabled: false ,placeholder: "Query element.", style: "color: black; width: 100%;", type: "text"}
			], 
			style: "margin: 10px;  background-color: white; width: 30%; height: 30px; margin: 10px;"
		});
		if (this.option == '$expand') {
			this.createComponent({
				kind: "onyx.Button", 
				name:"addComa",
				content: "Add a slash", 
				showing:true, 
				ontap:"addSlash",
				style: "background-color: cyan; color: purple; height: 30px; margin: 10px;"
			});
		}
		this.createComponent({
			kind: "onyx.Button", 
			name:"addElementQuery",
			content: "Add element to query.", 
			showing:true, 
			ontap:"addElementQuery",
			style: "background-color: cyan; color: purple; height: 30px; margin: 5px;"
		});
	},
	
	setupItemProperty: function(inSender, inEvent) {
		this.$.propertyList.getControls();
		var i = inEvent.index;
		if (i < this.propertyTable.length) {
			var n = this.propertyTable[i].name;
		} else if (i < this.propertyTable.length+this.associationTable.length) {
			var n = this.associationTable[i-this.propertyTable.length].name;
		} else if (i < this.propertyTable.length+this.associationTable.length+this.complexTypeTable.length) {
			var n = this.complexTypeTable[i-this.propertyTable.length-this.associationTable.length].name;
		} else {
			var n = this.entityTypeTable[i-this.propertyTable.length-this.associationTable.length-this.complexTypeTable.length].name;
		}
		this.$.itemProperty.addRemoveClass("list-sample-selected", inSender.isSelected(i));
		this.$.property.setContent(n);
	},
	
	setupItemOperator: function(inSender, inEvent) {
		this.$.operatorList.getControls();
		var i = inEvent.index;
		var n = this.operatorTable[i].name;
		this.$.itemOperator.addRemoveClass("list-sample-selected", inSender.isSelected(i));
		this.$.operator.setContent(n);
		this.$.operator.setProperty('notation', this.operatorTable[i].notation);
	},
	
	setupItemFunction: function(inSender, inEvent) {
		this.$.functionList.getControls();
		var i = inEvent.index;
		var n = this.functionTable[i].name;
		this.$.itemFunction.addRemoveClass("list-sample-selected", inSender.isSelected(i));
		this.$.functions.setContent(n);
		this.$.functions.setProperty('notation', this.functionTable[i].notation);
	},
	
	propertySelected: function(inSender, inEvent) {
		var i = inEvent.index;
		if (i < this.propertyTable.length) {
			var n = this.propertyTable[i].name;
		} else if (i < this.propertyTable.length+this.associationTable.length) {
			var n = this.associationTable[i-this.propertyTable.length].name;
		} else if (i < this.propertyTable.length+this.associationTable.length+this.complexTypeTable.length) {
			var n = this.complexTypeTable[i-this.propertyTable.length-this.associationTable.length].name;
		} else {
			var n = this.entityTypeTable[i-this.propertyTable.length-this.associationTable.length-this.complexTypeTable.length].name;
		}
		
		if (this.$.queryElementInput.getValue() == '') {
			this.$.queryElementInput.setValue(this.$.queryElementInput.getValue() + n);
		} else {
			this.$.queryElementInput.setValue(this.$.queryElementInput.getValue() + ' ' + n);
		}
		this.$.queryElementInput.render();
	},
	
	operatorSelected: function(inSender, inEvent) {
		if (this.$.queryElementInput.getValue() == '') {
			this.$.queryElementInput.setValue(this.$.queryElementInput.getValue() + this.operatorTable[inEvent.index].notation);
		} else {
			this.$.queryElementInput.setValue(this.$.queryElementInput.getValue() + ' ' + this.operatorTable[inEvent.index].notation);
		}
		this.$.queryElementInput.render();
	},
	
	functionSelected: function(inSender, inEvent) {
		if (this.$.queryElementInput.getValue() == '') {
			this.$.queryElementInput.setValue(this.$.queryElementInput.getValue() + this.functionTable[inEvent.index].notation);
		} else {
			this.$.queryElementInput.setValue(this.$.queryElementInput.getValue() + ' ' + this.functionTable[inEvent.index].notation);
		}
		
		this.$.queryElementInput.render();
	},
	
	addElementQuery: function(inSender, inEvent) {
		if (this.$.queryElementInput.getValue() != '') {
			this.doAddToQuery({element: this.option + '=' + this.$.queryElementInput.getValue()});
			this.destroy();
		} else {
			alert('The query element is empty.');
		}
	}
});