enyo.kind({
	name:"element",
	style:"background-color: grey;",
	published:{
		properties:"",
		entityType:"",
		identification: ""
	},
	events:{
		onLinkSelected: "",
		onLinkSelectedApp: "",
		onBackElement:"d",
		onBack:""
	},
	components:[
		{kind:"onyx.Toolbar", name: 'elementToolbar', components:[
				{kind: "onyx.Button", name:"backbutton",content: "Back", showing:true, ontap:"goBack", style: "background-color: green; color: #F1F1F1;"},
				{content: '', name: 'title'}
			]
		},
		{tag: "div", name: 'details', style: 'background-color: grey;'}
	],
	
	create: function(){
		this.inherited(arguments);
		if (this.identification == "") {
			var refProperty = this.findRefProperty(this.entityType);
			var content = '';
			enyo.forEach(
				refProperty, 
				function (refProperty) {
					content = content + refProperty.name + '=' + this.properties[refProperty.name] + ',' 
				},
				this
			);
			this.identification = content;
		}
		this.$.title.setContent(this.entityType.name + ': ' + this.identification.slice(0,-1));
		for (var key in this.properties) {
			if (this.properties[key] == null) {
				this.addDetail(key, 'ND');
			} else if (this.properties[key].__deferred) {
				this.addLink(key, this.properties[key]);
			} else if (key == '__metadata') {
			} else if (typeof(this.properties[key]) == 'object') {
				this.addDetail(key, enyo.json.stringify(this.properties[key]));
			} else {
				this.addDetail(key, this.properties[key]);
			}
		}	
		this.render();
	},
	
	addDetail : function(propertyName, value) {
		this.createComponent({
			tag: 'p',
			container: this.$.details,
			content: propertyName + ' : ' + value,
			style: "background-color: blue; color: #F1F1F1; margin: 10px;"
		});
		this.$.details.render();
	},
	
	addLink : function(propertyName, value) {
		this.createComponent({
			kind: 'onyx.Button',
			container: this.$.details,
			content: propertyName,
			entityType: this.findEntitySet(propertyName),
			uri: value.__deferred.uri,
			ontap: "linkSelected",
			style: "background-color: orange; margin: 10px;"
		});
		this.$.details.render();
	},
	
	findEntitySet: function(entityName) {
		var metadata = OData.defaultMetadata[0];
		var namespace = OData.defaultMetadata[0].dataServices.schema[0].namespace;
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
	
	linkSelected:function(inSender,inEvent){
		this.doLinkSelected({element: inEvent.originator});
		this.doLinkSelectedApp({element: inEvent.originator});
	},

	goBack:function(inSender,inEvent){
		this.doBackElement();
		this.doBack();
	}

});