enyo.kind({
	name:"entity",
	style:"background-color: grey;",
	published:{
		entitySet: "",
		elements: ""
	},
	events:{
		onElementSelected: "",
		onBack: ""
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
		enyo.forEach(
			this.elements.results, 
			enyo.bind(this, this.addElementButton)
		);
		this.render();
	},
	
	addElementButton : function(element) {
		var refProperty = this.findRefProperty(this.entitySet);
		var content = '';
		enyo.forEach(
			refProperty, 
			function (refProperty) {
				content = content + refProperty.name + ': ' + element[refProperty.name] + ' ' 
			},
			this
		);
		this.createComponent({
			kind: 'onyx.Button',
			container: this.$[this.entitySet.name],
			content: content,
			detail: element,
			identification: content,
			ontap: "elementSelected",
			style: "background-color: purple; color: #F1F1F1; margin: 10px;"
		});
		this.$[this.entitySet.name].render();
	},
	
	findRefProperty : function(entitySet) {
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
	},
	
	elementSelected:function(inSender,inEvent){
		this.doElementSelected({element: inEvent.originator});
	},
	
	goBack:function(inSender,inEvent){
		this.doBack();
	}

});