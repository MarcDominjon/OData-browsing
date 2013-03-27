enyo.kind({
	name: 'propertiesList',
	kind: "enyo.FittableColumns",
	style: "background-color: grey;",
	fit: true,
	events: {onAddToQuery: ""},
	published: {propertyTable: [], option: ''},
	components: [
		{name: "list", kind: "enyo.List", multiSelect: false,style : "min-width: 20%; min-height: 30px; background-color: white;", onSetupItem: "setupItem", components: [
			{name: "item", classes: "list-sample-item enyo-border-box", ontap: "propertySelected", components: [
				{name: "property"}
			]}
		]}
	],
	
	create: function() {
		this.inherited(arguments);
		if (this.option == '$select') {
			this.propertyTable.unshift({name: '*'});
		}
		this.$.list.setCount(this.propertyTable.length);
		this.$.list.refresh();
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
	
	setupItem: function(inSender, inEvent) {
		this.$.list.getControls();
		var i = inEvent.index;
		var n = this.propertyTable[i].name;
		this.$.item.addRemoveClass("list-sample-selected", inSender.isSelected(i));
		this.$.property.setContent(n);
	},
	
	propertySelected: function(inSender, inEvent) {
		if (this.option == '$orderby') {
			this.$.queryElementInput.setValue(this.propertyTable[inEvent.index].name);
		} else {
			if (this.option == '$select' || this.option == '$expand') {
				if (this.propertyTable[inEvent.index].name == '*' || this.$.queryElementInput.getValue() == '*') {
					this.$.queryElementInput.setValue(this.propertyTable[inEvent.index].name);
				} else if (this.$.queryElementInput.getValue().slice(-1) != '/' && this.$.queryElementInput.getValue() != '') {
					if (this.$.queryElementInput.getValue().indexOf(this.propertyTable[inEvent.index].name) == -1) {
						this.$.queryElementInput.setValue(this.$.queryElementInput.getValue() + ',' + this.propertyTable[inEvent.index].name);
					}
				} else {
					this.$.queryElementInput.setValue(this.$.queryElementInput.getValue()+this.propertyTable[inEvent.index].name);
				}
			}
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
	},
	
	addSlash: function(inSender, inEvent) {
		this.$.queryElementInput.setValue(this.$.queryElementInput.getValue()+'/');
	},
});