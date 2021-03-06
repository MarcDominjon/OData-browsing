/* global OData */
enyo.kind({
	name: 'metadata',
	url : '',
	components: [
		{kind:"onyx.Toolbar",components:[
			{kind: "onyx.Button", name:"backbutton",content: "Back", showing:true, ontap:"goBack", style: "background-color: green; color: #F1F1F1;"},
			{content: '', name: 'title'}
		]},
		{tag: 'div', name: 'metadataOdata', fit: true}
	],
		
	events: {
		onEntitySelected:"",
		onEntitySelectedApp:"",
		onBack: "",
		onBackRoot:""
	},
	
	create : function() {
		var metadata = '/$metadata';
		this.inherited(arguments);
		this.$.title.setContent("Metadata and entitySets of: " + this.url);
		OData.defaultMetadata = [];
		//OData.defaultHttpClient.enableJsonpCallback = true;
		OData.read(
			this.url + metadata, 
			enyo.bind(this,"processResults"), 
			enyo.bind(this,"processError"),
			OData.metadataHandler
		);
	},
	
	processResults : function(data) {
		OData.defaultMetadata.push(data);
		this.parent.parent.$.queryMode.setShowing(true);
		this.metadata = data;
		var text = "var metadata = " + enyo.json.stringify(data,null,'\t') + ";";
		this.createComponent({
			name: 'metadataInfo',
			kind: 'enyo.Scroller',
			container: this.$.metadataOdata,
			fit: true,
			style: 'height:500px;',
			components: [{tag: 'pre', content: text}]
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
		this.log(err);
	},
	
	entitySelected:function(inSender,inEvent){
		this.doEntitySelected({entityType: inEvent.originator.entityTypeInfo});
		this.doEntitySelectedApp({entityType: inEvent.originator.entityTypeInfo});
	},
	
	goBack:function(inSender,inEvent){
		this.doBackRoot();
		this.doBack();
	}

});