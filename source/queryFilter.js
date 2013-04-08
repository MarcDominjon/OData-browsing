enyo.kind({
	name: 'queryFilter',
	kind: "enyo.FittableColumns",
	style: "background-color: grey;",
	fit: true,
	events: {onAddToQuery: ""},
	published: {propertyTable: [], associationTable: [], complexTypeTable: [], entityTypeTable: [], option: ''},
	components: [		
		{kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
			{kind: "enyo.FittableRows", components: [
				{content: "Premade Items", style: 'padding: 10px;'},
				{kind: "enyo.FittableColumns",components: [
					{kind: "onyx.MenuDecorator", selectable: true, onSelect: "metadataSelected", components: [
						{content: "Metadatas"},
						{kind: "onyx.Menu", name: "metadataMenu"}
					]},
					{kind: "onyx.MenuDecorator", selectable: true, onSelect: "itemSelected", components: [
						{content: "Operators"},
						{kind: "onyx.Menu", name: "operatorMenu"}
					]},
					{kind: "onyx.MenuDecorator", selectable: true, onSelect: "itemSelected", components: [
						{content: "Functions"},
						{kind: "onyx.Menu", name: "functionMenu"}
					]}
				]}
			]}
		]}
	],
	
	tables : [
		{name: 'metadata', types: ['Properties', 'Associations', 'Entity Types', 'Complex Types']},
		{name: 'operator', types: ['Logical Operators', 'Arithmetic Operators']},
		{name: 'function', types: ['String Functions', 'Date Functions', 'Math Functions', 'Type Functions']}
	],	

	metadataTable: {
		'Properties': [],
		'Associations': [],
		'Entity Types': [],
		'Complex Types': []
	},
	
	operatorTable: {
		'Logical Operators': [
			{notation: 'eq', name: 'Equal'},
			{notation: 'ne', name: 'Not equal'},
			{notation: 'gt', name: 'Greater than'}, 
			{notation: 'ge', name: 'Greater than or equal'},
			{notation: 'lt', name: 'Less than'},
			{notation: 'le', name: 'Less than or equal'},
			{notation: 'and', name: 'Logical and'},
			{notation: 'or', name: 'Logical or'},
			{notation: 'not', name: 'Logical negation'}
		],
		'Arithmetic Operators': [
			{notation: 'add', name: 'Addition'},
			{notation: 'sub', name: 'Subtraction'},
			{notation: 'mul', name: 'Multiplication'},
			{notation: 'div', name: 'Division'},
			{notation: 'mod', name: 'Modulo'}
		]
	},

	functionTable: {
		'String Functions': [
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
			{notation: 'concat(', name: 'string concat(string p0, string p1)'}
		],
		'Date Functions': [
			{notation: 'day(', name: 'int day(DateTime p0)'},
			{notation: 'hour(', name: 'int hour(DateTime p0)'},
			{notation: 'minute(', name: 'int minute(DateTime p0)'},
			{notation: 'month(', name: 'int month(DateTime p0)'},
			{notation: 'second(', name: 'int second(DateTime p0)'},
			{notation: 'year(', name: 'int year(DateTime p0)'}
		],
		'Math Functions': [
			{notation: 'round(', name: 'double round(double p0)'},
			{notation: 'round(', name: 'decimal round(decimal p0)'},
			{notation: 'floor(', name: 'double floor(double p0)'},
			{notation: 'floor(', name: 'decimal floor(decimal p0)'},
			{notation: 'ceiling(', name: 'double ceiling(double p0)'},
			{notation: 'ceiling(', name: 'decimal ceiling(decimal p0)'}
		],
		'Type Functions': [
			{notation: 'IsOf(', name: 'bool IsOf(type p0)'},
			{notation: 'IsOf(', name: 'bool IsOf(expression p0, type p1)'}
		]
	},
	
	create: function() {
		this.inherited(arguments);
		
		this.metadataTable['Properties'] = this.propertyTable;
		this.metadataTable['Associations'] = this.associationTable;
		this.metadataTable['Entity Types'] = this.entityTypeTable;
		this.metadataTable['Complex Types'] = this.complexTypeTable;

		enyo.forEach(
			this.tables,
			function(table) {
				var tableName = table.name+'Table';
				enyo.forEach(
					table.types,
					function (type) {
						this.createComponent({
							kind: 'enyo.Control',
							name: type,
							ontap: 'openDrawer',
							content: type,
							container: this.$[table.name+'Menu'],
							style: 'padding: 10px;'
						});
						this.createComponent({
							name: type+"Drawer", 
							orient: "v", 
							kind: "onyx.Drawer", 
							container: this.$[table.name+'Menu'],
							open: false
						});
						this.createComponent({
							classes: "onyx-menu-divider",
							container: this.$[table.name+'Menu']
						});
						enyo.forEach(
							this[tableName][type],
							function (element) {
								this.createComponent({
									kind: 'onyx.MenuItem',
									container: this.$[type+"Drawer"],
									content: element.name,
									notation: element.notation
								});
							},
							this
						);
					},
					this
				);
			},
			this
		);
		
		/*this.createComponent({
			kind: "onyx.InputDecorator", 
			components: [
				{kind: "onyx.Input", name: "queryElementInput", disabled: false ,placeholder: "Query element.", style: "color: black; width: 100%;", type: "text"}
			], 
			style: "margin: 10px;  background-color: white; width: 30%; height: 30px; margin: 10px;"
		});*/
		var bases = [];
		enyo.forEach(
			this.tables,
			function(table) {
				var tableName = table.name+'Table';
				enyo.forEach(
					table.types,
					function (type) {
						enyo.forEach(
							this[tableName][type],
							function (element) {
								if (table.name == 'metadata') {
									bases.push({name: type + ': ' + element.name, notation: element.name});
								} else {
									bases.push({name: type + ': ' + element.name, notation: element.notation});
								}
							},
							this
						);
					},
					this
				);
			},
			this
		);
		
		bases.sort();
		this.log(bases);
		
		this.createComponent({
			kind: "autoComplete", 
			name: 'autocompleteInput',
			bases: bases,
			style: 'width: 25%;'
		});
		this.createComponent({
			kind: "onyx.Button", 
			name:"addElementQuery",
			content: "Add element to query.", 
			showing:true, 
			ontap:"addElementQuery",
			style: "background-color: cyan; color: purple; height: 30px; margin: 10px !important;"
		});
	},
	
	metadataSelected: function(inSender, inEvent) {
		this.log(this);
		this.log(this.$.autocompleteInput.$.autoCompleteInput.$.autoInput);
		if (this.$.autocompleteInput.$.autoCompleteInput.$.autoInput.getValue() == '') {
			this.$.autocompleteInput.$.autoCompleteInput.$.autoInput.setValue(inEvent.originator.content);
		} else {
			this.$.autocompleteInput.$.autoCompleteInput.$.autoInput.setValue(
				this.$.autocompleteInput.$.autoCompleteInput.$.autoInput.getValue() + ' ' + inEvent.originator.content);
		}
		this.$.autocompleteInput.$.autoCompleteInput.$.autoInput.render();
	},
	
	itemSelected: function(inSender, inEvent) {
		if (this.$.autocompleteInput.$.autoCompleteInput.$.autoInput.getValue() == '') {
			this.$.autocompleteInput.$.autoCompleteInput.$.autoInput.setValue(inEvent.originator.notation);
		} else {
			this.$.autocompleteInput.$.autoCompleteInput.$.autoInput.setValue(
				this.$.autocompleteInput.$.autoCompleteInput.$.autoInput.getValue() + ' ' + inEvent.originator.notation);
		}
		this.$.autocompleteInput.$.autoCompleteInput.$.autoInput.render();
	},
	
	openDrawer:  function(inSender, inEvent) {
		this.$[inSender.name+'Drawer'].setOpen(!this.$[inSender.name+'Drawer'].open);
	},
	
	addElementQuery: function(inSender, inEvent) {
		if (this.$.autocompleteInput.$.autoCompleteInput.$.autoInput.getValue() != '') {
			this.doAddToQuery({element: this.option + '=' + this.$.autocompleteInput.$.autoCompleteInput.$.autoInput.getValue()});
			this.destroy();
		} else {
			alert('The query element is empty.');
		}
	}
});