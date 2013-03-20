enyo.kind({
	name: 'metadata',
	published: {url : ''},
	components: [
		{kind:"onyx.Toolbar",components:[
			{content :"Metadata and entitySets"}
		]},
		{tag: 'div', name: 'metadataOdata', fit: true}
	],
		
	events: {onEntitySelected:""},
	
	create : function() {
		var metadata = '/$metadata';
		this.inherited(arguments);
		OData.read(
			this.url + metadata, 
			enyo.bind(this,"processResults"), 
			enyo.bind(this,"processError"),
			OData.metadataHandler
		);
	},
	
	processResults : function(data) {	
		OData.defaultMetadata.push(data);
		this.metadata = data;
		var text = "var metadata = " + enyo.json.stringify(data) + ";";
		this.createComponent({
			name: 'metadataInfo',
			tag: 'p',
			container: this.$.metadataOdata,
			content: text,
			fit: true,
			touch: true,
			style: 'height:300px; overflow:scroll;'
		});
		if (data.dataServices.schema[0].entityContainer)
		{
			enyo.forEach(data.dataServices.schema[0].entityContainer[0].entitySet, this.addEntityButton, this);
		} else if (data.dataServices.schema[1].entityContainer){
			enyo.forEach(data.dataServices.schema[1].entityContainer[0].entitySet, this.addEntityButton, this);
		}
		this.$.metadataOdata.render();
	},
	
	addEntityButton : function(entityType) {
		this.createComponent({
			kind: 'onyx.Button',
			container: this.$.metadataOdata,
			content: entityType.name,
			entityTypeInfo: entityType,
			ontap: "entitySelected",
			style: "background-color: purple; color: #F1F1F1; margin: 10px;"
		});
		this.$.metadataOdata.render();
	},
	
	processError : function(err) {	
		enyo.log(err);
	},
	
	entitySelected:function(inSender,inEvent){
		this.doEntitySelected({entityType: inEvent.originator.entityTypeInfo});
	}

});