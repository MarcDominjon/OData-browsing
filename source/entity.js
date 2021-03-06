/* global OData */
enyo.kind({
	name:"entity",
	style:"background-color: grey;",
	published:{
		entitySet: "",
		elements: ""
	},
	events:{
		onElementSelected: "",
		onElementSelectedApp: "",
		onBackEntity:"",
		onBack: "",
		onAddEntry:""
	},
	components:[
		{kind:"onyx.Toolbar", name: 'toolbar', components:[				
				{kind: "onyx.Button", name:"backbutton",content: "Back", showing:true, ontap:"goBack", style: "background-color: green; color: #F1F1F1;"},
				{content: '', name:'title'}
			]
		}
	],
	
	create: function(){
		this.inherited(arguments);
		this.$.title.setContent('Elements of entity: ' + this.entitySet.name);
		this.createComponent({
			tag: 'div',
			container: this,
			name: this.entitySet.name,
			fit: true,
			style: "width:100%; height:100%; background-color: grey;"
		});
		var propertiesEntity = this.findProperties(this.entitySet);
		var navigationEntity = this.findNavigationProperties(this.entitySet);
		this.log(this);
		this.createComponent({
			kind: 'onyx.Button',
			container: this.$[this.entitySet.name],
			content: 'Add new entry',
			uri: this.parent.owner.$.requestInput.getValue(),
			entitySet: this.entitySet,
			properties: propertiesEntity,
			navigation: navigationEntity,
			ontap: "addEntry",
			style: "background-color: yellow; color: green; margin: 10px;"
		});
		if (this.elements.results) {
			enyo.forEach(
				this.elements.results, 
				enyo.bind(this, this.addElementButton)
			);
		} else {
			this.addElementButton(this.elements);
		}
		this.render();
	},
	
	addElementButton : function(element) {
		var refProperty = enyo.Odata.findRefProperties(this.entitySet);
		this.log(refProperty);
		var content = enyo.Odata.entryDescription(refProperty, element);
		this.createComponent({
			kind: 'onyx.Button',
			container: this.$[this.entitySet.name],
			content: content,
			detail: element,
			identification: content,
			entitySet: this.entitySet,
			ontap: "elementSelected",
			style: "background-color: purple; color: #F1F1F1; margin: 10px;"
		});
		this.$[this.entitySet.name].render();
	},
	
	addEntry : function(inSender,inEvent) {
		this.doAddEntry({detail: inEvent.originator});
	},
	
	/*findRefProperty : function(entitySet) {
		var refProperty = [];
		var namespace = OData.defaultMetadata[0].dataServices.schema[0].namespace;
		enyo.forEach(
			OData.defaultMetadata[0].dataServices.schema[0].entityType, 
			function (entityType) {
				if (namespace + '.' + entityType.name == entitySet.entityType) {
					refProperty = entityType.key.propertyRef;
				}
			},
			this
		);
		return refProperty;
	},*/
	
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
	
	findNavigationProperties: function(entitySet) {
		var navigationProperties = [];
		var namespace = OData.defaultMetadata[0].dataServices.schema[0].namespace;
		enyo.forEach(
			OData.defaultMetadata[0].dataServices.schema[0].entityType, 
			function (entityType) {
				if (namespace + '.' + entityType.name == entitySet.entityType) {
					navigationProperties = entityType.navigationProperty;
				}
			},
			this
		);
		return navigationProperties;
	},
	
	
	elementSelected:function(inSender,inEvent){
		this.doElementSelected({element: inEvent.originator});
		this.doElementSelectedApp({element: inEvent.originator});
	},
	
	goBack:function(inSender,inEvent){
		this.doBackEntity();
		this.doBack();
	}

});