/* global OData */
enyo.kind({
    name: "enyo.Odata",
    statics: {
        findEntitySet: function (entityName) {
			var meta = OData.defaultMetadata[0];
			var namespace = meta.dataServices.schema[0].namespace;
			var schema, entityContainer, entitySet;
			if (meta.dataServices.schema[0].entityContainer)
			{
				schema = meta.dataServices.schema[0];
				entityContainer = schema.entityContainer[0];
				enyo.forEach(
					entityContainer.entitySet, 
					function (entitySets) {
						if (entitySets.entityType == namespace + '.' + entityName){
							entitySet = entitySets;
						} else if (entitySets.name == entityName) {
							entitySet = entitySets;
						}
					},
					this
				);
			} else if (meta.dataServices.schema[1].entityContainer){
				schema = meta.dataServices.schema[1];
				entityContainer = schema.entityContainer[0];
				enyo.forEach(
					entityContainer.entitySet, 
					function (entitySets) {
						if (entitySets.entityType == namespace + '.' + entityName){
							entitySet = entitySets;
						} else if (entitySets.name == entityName) {
							entitySet = entitySets;
						}
					},
					this
				);
			}
			return entitySet;
		},
		
		findRefProperties : function(entitySet) {
			var refPropertiesTemp = [];
			var refProperties = [];
			var namespace = OData.defaultMetadata[0].dataServices.schema[0].namespace;
			enyo.forEach(
				OData.defaultMetadata[0].dataServices.schema[0].entityType, 
				function (entityType) {
					if (namespace + '.' + entityType.name == entitySet.entityType) {
						refPropertiesTemp = entityType.key.propertyRef;
						enyo.forEach(
							refPropertiesTemp,
							function (refProperty) {
								enyo.forEach(
									entityType.property,
									function (property) {
										if (refProperty.name == property.name) {
											refProperty = property;
										}
									},
									this
								);
								refProperties.push(refProperty);
							},
							this
						);
					}
				},
				this
			);
			return refProperties;
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
		
		/*entryDescription: function (refProperty, element) {
			enyo.log(refProperty, element);
			var content = '';
			enyo.forEach(
				refProperty, 
				function (refProperty) {
					enyo.log(typeof element[refProperty.name]);
					if (typeof element[refProperty.name] == "string") {
						content = content + refProperty.name + '= \'' + element[refProperty.name] + '\' ,' 
					} else {
						content = content + refProperty.name + '=' + element[refProperty.name] + ',';
					}
				},
				this
			);
			return content.slice(0,-1);
		},*/
		
		entryDescription: function (refProperties, element) {
			var description = "";
			var propertiesNum = 0;
			enyo.forEach(
				refProperties, 
				function (refProperty) {
					propertiesNum++;
					var type = refProperty.type.slice(refProperty.type.indexOf('.') + 1).toLowerCase();
					if (type == 'string') {
						description += refProperty.name + '= \'' + element[refProperty.name] + '\' ,';
					} else if (type == 'binary' || type == 'datetime' || type == 'time' || type == 'datetimeoffset' || type == 'guid') {
						description += refProperty.name + '= ' + type + '\'' + element[refProperty.name] + '\' ,';
					} else if (type == 'decimal') {
						description += refProperty.name + '= ' + element[refProperty.name] + 'm ,';
					} else if (type == 'double') {
						description += refProperty.name + '= ' + element[refProperty.name] + 'd ,';
					} else if (type == 'single' || type == 'float') {
						description += refProperty.name + '= ' + element[refProperty.name] + 'f ,';
					} else if (type == 'int64') {
						description += refProperty.name + '= ' + element[refProperty.name] + 'l ,';
					} else {
						description += refProperty.name + '=' + element[refProperty.name] + ' ,';
					}
				},
				this
			);
			return description.slice(0,-2);
		},
		
		findRelationship: function (relationWanted) {
			var meta = OData.defaultMetadata[0];
			var relation;
			enyo.forEach(
				meta.dataServices.schema[0].association, 
				function (association) {
					enyo.forEach (
						association.end,
						function (end) {
							if (end.role == relationWanted.toRole) {
								relation = end;
							}
						},
						this
					);
				},
				this
			);
			return relation;
		},
    }
});