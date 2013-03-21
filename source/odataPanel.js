enyo.kind({
	name: "odataPanel",
	kind: "enyo.Panels",
	classes:"panels",
	arrangerKind:"CardArranger",
	published: {url : '', count : 0, head: ""},
	handlers: {
		onEntitySelected:"entitySelected",
		onElementSelected:"elementSelected",
		onLinkSelected:"linkSelected",
		onUriSelected: "browseService",
		onBack:"goBack"
	},
	components: [{kind: 'uriChooser', name: 'uri'}],
	
	create : function() {
		this.inherited(arguments);
		/*this.createComponent({
			kind: 'metadata',
			container: this,
			url: this.url
		});
		this.setIndex(this.count++);*/
		this.setIndex(this.count++);
	},
	
	browseService: function(inSender,inEvent){
		this.url = inEvent.uri;
		this.createComponent({
			kind: 'metadata',
			container: this,
			url: inEvent.uri
		});
		this.render();
		this.reflow();
		this.setIndex(this.count++);
	},
	
	entitySelected:function(inSender,inEvent){
		this.fetchEntities(inEvent.entityType);
	},
	
	elementSelected:function(inSender,inEvent){
		this.createComponent({
			kind: 'element',
			container: this,
			properties: inEvent.element.detail,
			identification: inEvent.element.identification
		});
		this.reflow();
		this.setIndex(this.count++);
	},
	
	fetchEntities : function(entityType) {
		entityName = entityType.name;
		OData.read(
			this.url+ "/" + entityName,
			enyo.bind(
				this, 
				function (data) {
					this.createComponent({
						kind: 'entity',
						container: this,
						entitySet: entityType,
						elements: data,
						style: "background-color: grey; width:100%; height:100%;"
					});
					this.reflow();
					this.setIndex(this.count++);
					if (data.results && data.results.length == 0) {
						alert('ND');
						this.goBack();
					}
				}
			),
			enyo.bind(this,"processError")
		);
	},
	
	linkSelected:function(inSender,inEvent){
		OData.read(
			inEvent.element.uri,
			enyo.bind(
				this, 
				function (data) {
					//if (data.results) {
						this.createComponent({
							kind: 'elements',
							container: this,
							results: data
						});
					//}
					/* else {
						this.createComponent({
							kind: 'element',
							container: this,
							properties: data
						});
					}*/
					this.reflow();
					this.setIndex(this.count++);
					if (data.results && data.results.length == 0) {
						alert('ND');
						this.goBack();
					}
				}
			),
			enyo.bind(this,"processError")
		);
	},
	
	goBack:function(inSender,inEvent){
		var actu = this.getActive();
		this.previous();
		if (actu) {
			actu.destroy();
		}
		this.count--;
	},
	
	processError : function(err) {	
		this.log(err);
		alert('Problem with the OData service.');
		this.goBack();
	}
});