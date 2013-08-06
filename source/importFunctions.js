enyo.kind({
	name: 'importFunctions',
	kind: "enyo.FittableColumns",
	style: "background-color: grey;",
	fit: true,
	events: {onAddToQuery: ""},
	published: {functionsTable: [], option: ''},
	components: [
		{name: "list", kind: "enyo.List", multiSelect: false, style : "min-width: 20%; min-height: 30px; background-color: white;", onSetupItem: "setupItem", components: [
			{name: "item", classes: "list-sample-item enyo-border-box", ontap: "functionSelected", components: [
				{name: "functions"}
			]}
		]}
	],
	
	selectedFunction: '',
	
	create: function() {
		this.inherited(arguments);
		this.$.list.setCount(this.functionsTable.length);
		this.$.list.refresh();
	},
	
	setupItem: function(inSender, inEvent) {
		this.$.list.getControls();
		var i = inEvent.index;
		var n = this.functionsTable[i].name;
		this.$.item.addRemoveClass("list-sample-selected", inSender.isSelected(i));
		this.$.functions.setContent(n);
		this.$.functions.setAttribute('detail', this.functionsTable[i].detail);
	},
	
	functionSelected: function(inSender, inEvent) {
		this.selectedFunction = this.functionsTable[inEvent.index].detail;
		if (this.$.inputRows) {
			this.$.inputRows.destroy();
		}
		this.createComponent({
			kind: 'enyo.FittableRows',
			name: 'inputRows',
			fit: true
		});
		enyo.forEach(
			this.selectedFunction.parameter,
			function(parameter) {
				this.createComponent({
					kind: "onyx.Toolbar",
					container: this.$.inputRows,
					name: parameter.name+"Toolbar",
					components: [
						{content: parameter.name.slice(0,1).toUpperCase() + parameter.name.slice(1)},
						{kind: "onyx.InputDecorator", components: [
							{kind: "onyx.Input", name: parameter.name+"Input", disabled: false, placeholder: "Enter " + parameter.name + " here."}
						]}
					]
				});
			},
			this
		);
		this.createComponent({
			kind: "onyx.Button", 
			name:"addElementQuery",
			content: "Add element to query.", 
			container: this.$.inputRows,
			showing:true, 
			ontap:"addElementQuery",
			style: "background-color: cyan; color: purple; height: 30px; margin: 5px;"
		});
		this.render();
	},
	
	addElementQuery: function(inSender, inEvent) {
		var parameters = '';
		
		enyo.forEach(
			this.selectedFunction.parameter,
			function(parameter) {
				if (this.$[parameter.name+"Input"].getValue() !== '') {
					if (parameters === '') {
						parameters += '?' + parameter.name + '=' + this.$[parameter.name+"Input"].getValue();
					} else {
						parameters += '&' + parameter.name + '=' + this.$[parameter.name+"Input"].getValue();
					}
				}
			},
			this
		);
		this.doAddToQuery({element: '/' + this.selectedFunction.name + parameters});
		this.destroy();
	}
});