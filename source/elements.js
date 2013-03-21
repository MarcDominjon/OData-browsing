enyo.kind({
	name:"elements",
	style:"background-color: grey;",
	kind: 'enyo.Scroller',
	fit: true,
	published:{
		results:""
	},
	events:{
		onLinkSelected: "",
		onLinkSelectedApp: "",
		onBack:""
	},
	
	create: function(){
		this.inherited(arguments);
		this.destroyClientControls();
		if (this.results.results && this.results.results.length > 0) {
			var refProperty = this.findRefProperty(this.results.results[0].__metadata.type);
			enyo.forEach(
			this.results.results,
				function (dataElement) {
					var content = '';
					enyo.forEach(
						refProperty, 
						function (refProperty) {
							content = content + refProperty.name + '=' + dataElement[refProperty.name] + ',' 
						},
						this
					);
					this.createComponent({
						kind: 'element',
						container: this,
						properties: dataElement,
						identification: content
					});
				},
				this
			);
		} else if (this.results.__metadata){	
			var refProperty = this.findRefProperty(this.results.__metadata.type);
			var content = '';
			enyo.forEach(
				refProperty, 
				function (refProperty) {
					content = content + refProperty.name + '=' + this.results[refProperty.name] + ',' 
				},
				this
			);
			this.createComponent({
				kind: 'element',
				container: this,
				properties: this.results,
				identification: content
			});
		}		

		this.render();
	},
	
	findRefProperty : function(entityTypeNamespace) {
		var refProperty = [];
		var namespace = OData.defaultMetadata[0].dataServices.schema[0].namespace;
		enyo.forEach(
			OData.defaultMetadata[0].dataServices.schema[0].entityType, 
			function (entityType) {
				if (namespace + '.' + entityType.name == entityTypeNamespace) {
					refProperty = entityType.key.propertyRef;
				}
			},
			this
		);
		return refProperty;
	},
	
	goBack:function(inSender,inEvent){
		this.doBack();
	}

});