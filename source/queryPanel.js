enyo.kind({
	name: "queryPanel",
	kind: "FittableRows",
	classes: "enyo-fit",
	fit: true,
	draggable: false,
	published: {request : '', query: ''},
	handlers: {onAddToQuery: "addToQuery"},
	events:{onRequestSelected:"", onAddToQuery: ""},
	components: [
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "requestInput", disabled: true ,placeholder: "Request in construction here.", style: "color: black; width: 100%;", type: "url"}
			], style: "margin: 10px;  background-color: white; width: 80%;"},
			{kind: "onyx.Button", name:"requestMode",content: "Request Mode", showing:true, ontap:"goRequest", style: "background-color: cyan; color: purple;"}
		]},
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "queryInput", disabled: false ,placeholder: "Additional query in construction here.", onchange: "inputQueryChanged",  style: "color: black; width: 100%;", type: "text"}
			], style: "margin: 10px;  background-color: white; width: 80%;"},
			{kind: "onyx.Button",content: "Add to request", showing:true, ontap:"addToRequest", style: "background-color: cyan; color: purple;"},
			{kind: "onyx.Button",content: "Test request", showing:true, ontap:"testRequest", style: "background-color: purple; color: cyan;"}
		]},
		{kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
			{kind: "onyx.MenuDecorator", selectable: true, /*onSelect: ''"itemSelected",*/ components: [
				{content: "Options Menu"},
				{kind: "onyx.Menu", name: "optionMenu"}
			]}
		]}
	],
	
	options: [
		"count",
		"expand",
		"filter",
		"format",
		"functions",
		"inlinecount",
		"links",
		"metadata",
		"orderby",
		"select",
		"skip",
		"top",
		"value"
	],

	optionParameters: {
		"format": [
			{'name': "Atom"},
			{'name': "Xml"},
			{'name': "Json"}
		],
		"inlinecount": [
			{'name': "allpages"},
			{'name': "none"}
		],
		"links": "",
		"orderby": ""
	},
	
	entitySet: '',
	properties: '',
	associations: '',
	complexTypes: '',
	entityTypes: '',
	importFunctions: '',
	
	create : function() {
		this.inherited(arguments);
		this.$.requestInput.setValue(this.request);
		this.$.requestInput.render();
		
		var last = this.request.split('/').pop();
		if (last.indexOf('(') == -1 ) {
			var entityType = last;
		} else {
			var entityType = last.slice(0,last.indexOf('('));
		}
		
		this.entitySet = this.findEntitySet(entityType);
		this.properties = this.findProperties(this.entitySet);
		this.associations = this.findAssociations(this.entitySet);
		this.complexTypes = this.fetchComplexTypes();
		this.entityTypes = this.fetchEntityTypes();
		this.importFunctions = this.fetchImportFunctions();
		
		this.optionParameters.links = this.associations;
		this.optionParameters.orderby = this.properties;

		enyo.forEach(
			this.options, 
			function (option) {
				if (option == "format" || option == "inlinecount" || option == "links" || option == "orderby") {
					this.createComponent({
						/*kind: 'onyx.MenuItem',
						classes: 'onyx.menu.item',*/
						kind: 'enyo.Control',
						name: option,
						ontap: 'openDrawer',
						content: '$' + option,
						container: this.$.optionMenu,
						style: 'padding: 10px;'
					});
					this.createComponent({
						name: option+"Drawer", 
						orient: "v", 
						kind: "onyx.Drawer", 
						container: this.$.optionMenu,
						open: false
					});
					enyo.forEach(
						this.optionParameters[option],
						function (parameter) {
							this.createComponent({
								kind: 'onyx.MenuItem',
								container: this.$[option+"Drawer"],
								onSelect: 'parameterSelected',
								content: parameter.name,
								option: '$' + option
							});
						},
						this
					);
				} else {
					this.createComponent({
						kind: 'onyx.MenuItem',
						classes: 'onyx.menu.item',
						onSelect: 'itemSelected',
						content: '$' + option,
						container: this.$.optionMenu,
						style: 'padding: 10px;'
					});
				}
				
				this.createComponent({
					classes: "onyx-menu-divider",
					container: this.$.optionMenu
				});
			},
			this
		);
		this.render();
	},
	
	requestChanged: function() {
		this.$.requestInput.setValue(this.request);
		this.$.requestInput.render();
	},
	
	queryChanged: function() {
		this.$.queryInput.setValue(this.query);
		this.$.queryInput.render();
	},
	
	itemSelected: function(inSender, inEvent) {
		var option = inEvent.originator.content;
		
		if (this.query.indexOf(option) == -1 && this.request.indexOf(option) == -1) {
			
			if (option != '$medatata' && option != '$links' && option != '$count' && option != '$value'  && option != '$functions') {
				if (this.query.indexOf("?") == -1 && this.request.indexOf("?") == -1) {
					this.setQuery(this.query + "?");
				}
				
				if (this.query.slice(-1) != "?" && this.query.slice(-1) != "&"
				&& !(this.query == '' && this.request.slice(-1) != "?" && this.request.slice(-1) != "&")){
					this.setQuery(this.query + "&");
				}
			}
		
			if (option == "$count" || option == "$value") {
				this.setQuery(this.query + '/' + option);
			} else {
				if (this.$.optionInput) {
					this.$.optionInput.destroy();
				}
				if (this.$.resultTest) {
					this.$.resultTest.destroy();
				}
				if (option == "$skip" || option == "$top"){
					this.createComponent({
						kind: "enyo.FittableColumns",
						name: 'optionInput',
						style: "background-color: grey;"
					});
					this.createComponent({
						kind: "onyx.Input",
						name: 'queryElementInput',
						placeholder: option + ": Enter number here",
						container: this.$.optionInput,
						option: option,
						style: 'padding: 10px;'
					});	
					this.createComponent({
						kind: "onyx.Button", 
						name:"addElementQuery",
						container: this.$.optionInput,
						content: "Add element to query.", 
						showing:true, 
						ontap:"addElementQuery",
						style: "background-color: cyan; color: purple; height: 30px; margin: 5px;"
					});	
				} else if (option == "$format") {
					this.createComponent({
						kind: "onyx.MenuDecorator", 
						name: 'optionInput',
						onSelect: "optionSelected", 
						components: [
							{content: option},
							{kind: "onyx.Menu", floating: true, components: [
								{content: "Atom", option: option},
								{content: "Xml", option: option},
								{content: "Json", option: option}
							]}
						]
					});
				} else if (option == "$inlinecount") {
					this.createComponent({
						kind: "onyx.MenuDecorator", 
						name: 'optionInput',
						onSelect: "optionSelected", 
						components: [
							{content: option},
							{kind: "onyx.Menu", floating: true, components: [
								{content: "allpages", option: option},
								{content: "none", option: option}
							]}
						]
					});
				} else if (option == "$metadata") {
					this.setQuery('' + '/' + option);
				} else if (option == "$links") {
					this.createComponent({
						kind: "onyx.MenuDecorator", 
						name: 'optionInput',
						onSelect: "linkSelected", 
						components: [
							{content: "$links"},
							{kind: "onyx.Menu", name: "links", floating: true}
						]
					});
					enyo.forEach(
						this.associations,
						function (association) {
							this.createComponent({
								kind: 'onyx.MenuItem',
								container: this.$.links,
								content: association.name,
								option: option
							});
						},
						this
					);
					this.$.links.render();
				} else {
					if (option == "$expand") {
						this.createComponent({
							kind: "propertiesList",
							name: 'optionInput',
							propertyTable: this.associations,
							option: option
						});
					} else if (option == "$filter") {
						this.createComponent({
							kind: "queryFilter",
							name: 'optionInput',
							propertyTable: this.properties,
							associationTable: this.associations,
							complexTypeTable: this.complexTypes,
							entityTypeTable: this.entityTypes,
							option: option
						});
					} else if (option == "$functions") {
						this.createComponent({
							kind: "importFunctions",
							name: 'optionInput',
							functionsTable: this.importFunctions,
							option: option
						});
					} else {
						this.createComponent({
							kind: "propertiesList",
							name: 'optionInput',
							propertyTable: this.properties,
							option: option
						});
					}	
				}
			}
		} else {
			alert('Option already implemented in query');
		}
		this.render();
	},
	
	findEntitySet: function(entityName) {
		var metadata = OData.defaultMetadata[0];
		var namespace = metadata.dataServices.schema[0].namespace;
		var entity = "";
		if (metadata.dataServices.schema[0].entityContainer)
		{
			enyo.forEach(
				metadata.dataServices.schema[0].entityContainer[0].entitySet, 
				function (entitySet) {
					if(entitySet.name == entityName || entitySet.entityType == namespace + '.' + entityName) {
						entity = entitySet;
					}
				},
				this
			);
		} else if (metadata.dataServices.schema[1].entityContainer){
			enyo.forEach(
				metadata.dataServices.schema[1].entityContainer[0].entitySet, 
				function (entitySet) {
					if(entitySet.name == entityName || entitySet.entityType == namespace + '.' + entityName) {
						entity = entitySet;
					}
				}, 
				this
			);
		}
		return entity;
	},
	
	findProperties : function(entitySet) {
		var properties = [];
		var namespace = OData.defaultMetadata[0].dataServices.schema[0].namespace;
		enyo.forEach(
			OData.defaultMetadata[0].dataServices.schema[0].entityType, 
			function (entityType) {
				if (namespace + '.' + entityType.name == entitySet.entityType) {
					properties = entityType.property;
				}
			},
			this
		);
		return properties;
	},
	
	findAssociations: function(entitySet) {
		var associations = [];
		var namespace = OData.defaultMetadata[0].dataServices.schema[0].namespace;
		enyo.forEach(
			OData.defaultMetadata[0].dataServices.schema[0].entityType, 
			function (entityType) {
				if (namespace + '.' + entityType.name == entitySet.entityType) {
					associations = entityType.navigationProperty;
				}
			},
			this
		);
		return associations;
	},
	
	fetchEntityTypes: function() {
		var metadata = OData.defaultMetadata[0];
		var namespace = metadata.dataServices.schema[0].namespace;
		var entityTypes = [];
		var i = 0;
		if (metadata.dataServices.schema[0].entityContainer)
		{
			enyo.forEach(
				metadata.dataServices.schema[0].entityContainer[0].entitySet, 
				function (entitySet) {
					entityTypes[i] = {name: entitySet.entityType};
					i++;
				},
				this
			);
		} else if (metadata.dataServices.schema[1].entityContainer){
			enyo.forEach(
				metadata.dataServices.schema[1].entityContainer[0].entitySet, 
				function (entitySet) {
					entityTypes[i] = {name: entitySet.entityType};
					i++;
				}, 
				this
			);
		}
		return entityTypes;
	},
	
	fetchComplexTypes: function() {
		var metadata = OData.defaultMetadata[0];
		var namespace = metadata.dataServices.schema[0].namespace;
		var complexTypes = [];
		if (metadata.dataServices.schema[0].complexType)
		{
			complexTypes = metadata.dataServices.schema[0].complexType;
		} else if (metadata.dataServices.schema[1]){
			if (metadata.dataServices.schema[1].complexType) {
				complexTypes = metadata.dataServices.schema[1].complexType;
			}
		}
		return complexTypes;
	},
	
	fetchImportFunctions: function() {
		var metadata = OData.defaultMetadata[0];
		var functions = [];
		var i = 0;
		if (metadata.dataServices.schema[0].entityContainer)
		{
			enyo.forEach(
				metadata.dataServices.schema[0].entityContainer[0].functionImport, 
				function (importFunction) {
					functions[i] = {name: importFunction.name, detail: importFunction};
					i++;
				},
				this
			);
		} else if (metadata.dataServices.schema[1].entityContainer){
			enyo.forEach(
				metadata.dataServices.schema[1].entityContainer[0].functionImport, 
				function (entitySet) {
					functions[i] = {name: importFunction.name, detail: importFunction};
					i++;
				}, 
				this
			);
		}
		return functions;
	},
	
	optionSelected: function(inSender, inEvent) {
		if (this.query.indexOf(inEvent.originator.option) == -1) {
			this.setQuery(this.query + inEvent.originator.option + '=' + inEvent.originator.content);
		}
	},
	
	linkSelected: function(inSender, inEvent) {
		this.setQuery('/' + inEvent.originator.option + '/' + inEvent.originator.content);
	},
	
	parameterSelected: function(inSender, inEvent) {
		if (this.query.indexOf(inEvent.originator.option) == -1 && this.request.indexOf(inEvent.originator.option) == -1) {
			if (inEvent.originator.option == '$links') {
				this.setQuery('/' + inEvent.originator.option + '/' + inEvent.originator.content);
			} else {
				this.setQuery(this.query + inEvent.originator.option + '=' + inEvent.originator.content);
			}
		}
	},
	
	inputQueryChanged: function(inSender, inEvent) {
		this.setQuery(this.$.queryInput.getValue());
	},
	
	addElementQuery: function(inSender, inEvent) {
		if (this.$.queryElementInput.getValue() != '' && !isNaN(this.$.queryElementInput.getValue())) {
			this.doAddToQuery({element: this.$.queryElementInput.getProperty('option') + '=' + this.$.queryElementInput.getValue()});
			this.$.optionInput.destroy();
		} else {
			alert('The query element is invalid.');
		}
	},
	
	testRequest: function(inSender, inEvent) {
		if (this.$.optionInput) {
			this.$.optionInput.destroy();
		}
		if (this.$.resultTest) {
			this.$.resultTest.destroy();
		}
		
		var requestToTest = this.request + this.query;
		OData.read(
			requestToTest,
			enyo.bind(
				this,
				function(data) {
					var text = enyo.json.stringify(data,null,'\t');
					this.createComponent({
						kind: 'enyo.Scroller',
						name: 'resultTest',
						fit: true,
						style: 'height: 100%',
						components: [
							{tag: 'pre', content: 'Result from ' + requestToTest + ' : ' + '\n' + text}
						]
					});
					this.$.resultTest.render();
				}				
			), 
			enyo.bind(
				this,	
				function(err) {
					this.log(err);
					var text = err.message + ' : ' + err.response.statusCode + ' , ' + err.response.statusText + '\n' + err.response.body;
					this.createComponent({
						name: 'resultTest',
						tag: 'pre',
						content: 'Error from ' + requestToTest + ' :\n'+ text
					});
					this.$.resultTest.render();
				}
			)
		);
	},
	
	openDrawer:  function(inSender, inEvent) {
		this.$[inSender.name+'Drawer'].setOpen(!this.$[inSender.name+'Drawer'].open);
	},
	
	addToQuery: function(inSender, inEvent) {
		this.setQuery(this.query + inEvent.element);
	},
	
	addToRequest: function(inSender, inEvent) {
		this.setRequest(this.request + this.query);
		this.setQuery('');
	},
	
	goRequest: function(inSender, inEvent) {
		this.doRequestSelected({request:  this.$.requestInput.getValue().slice(0,this.$.requestInput.getValue().indexOf('?')-1)});
	}
});