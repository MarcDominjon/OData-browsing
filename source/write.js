/* global OData, request */
enyo.kind({
	name: 'write',
	published: {
		uri : '',
		properties: '',
		entitySet: '',
		navigation: '',
		serviceRoot: ''
	},
	components:[
		{kind:"onyx.Toolbar", name: 'toolbar', components:[				
				{kind: "onyx.Button", name:"backbutton",content: "Back", showing:true, ontap:"goBack", style: "background-color: green; color: #F1F1F1;"},
				{content: '', name:'title'}
			]
		},
		{kind:"enyo.FittableRows", components:[				
				{name: 'properties', fit: true},
				{kind: 'enyo.FittableColumns', name: 'links', fit: true, style: 'min-height: 180px; display: block;'}
			]
		},
	],
	events: {
		onValidateForm:'',
		onBack: "",
	},
	handlers: {
		onValidateForm:'doValidateForm'
	},
	
	create : function() {
		this.inherited(arguments);
		enyo.forEach(this.navigation, enyo.bind(this, 'navigationProperties'), this);
		this.$.title.setContent('Add a new ' + this.entitySet.name + ' : ');
		enyo.forEach(this.properties, enyo.bind(this, 'inputProperty'), this);
		this.createComponent({
			kind: 'onyx.Button',
			content: 'Add entry',
			container: this,
			ontap: "validateForm",
			style: "background-color: green; color: #F1F1F1; margin: 10px;"
		});
		this.render();
	},
	
	inputProperty  : function (property) {
		if (property.nullable == 'false') {
			this.createComponent({
				kind: 'enyo.Input',
				name: property.name,
				container: this.$.properties,
				placeholder: 'Mandatory : ' + property.name,
				style: "background-color: red; background-opacity: 0.3; color: #F1F1F1; margin: 10px;"
			});
		} else {
			this.createComponent({
				kind: 'enyo.Input',
				name: property.name,
				container: this.$.properties,
				placeholder: property.name,
				style: "background-color: blue; background-opacity: 0.3; color: #F1F1F1; margin: 10px;"
			});
		}
	},
	
	navigationProperties: function (navigation) {
		var navigationEntitySet = enyo.Odata.findEntitySet(navigation.name);
		OData.read(
			this.parent.url + '/' + navigationEntitySet.name,
			enyo.bind(
				this,
				function (data) {
					this.createComponent({
						name: navigation.name+"List", 
						kind: "enyo.List", 
						multiSelect: false,
						onSetupItem: "setupItem",
						container: this.$.links,
						classes: "list_links",
						entries: data,
						refProperties: enyo.Odata.findRefProperties(navigationEntitySet),
						entityName: navigation.name,
						entitySetName: navigationEntitySet.name,
						components: [
							{name: navigation.name+"Item", classes: "list-sample-item enyo-border-box", components: [
								{name: navigation.name+"Entry"}
							]}
						]
					});
					if(enyo.Odata.findRelationship(navigation).multiplicity == '*') {
						this.$[navigation.name+"List"].setMultiSelect(true);
					}
					if (!data.results.length && !data) {
						this.$[navigation.name+"List"].destroy();
					} else if (data.results) {
						this.$[navigation.name+"List"].setCount(data.results.length);
					} else {
						this.$[navigation.name+"List"].setCount(1);
					}
					//this.$[navigationEntitySet.name+"List"].reset();
					/*
					this.createComponent({
						kind: "onyx.MenuDecorator",
						selectable: true,
						components: [
							{content: navigationEntitySet.name},
							{kind: "onyx.Menu", name: navigationEntitySet.name + "Menu"}
						]
					});
					var refProperties = enyo.Odata.findRefProperties(navigationEntitySet);
					if (data.results) {
						enyo.forEach(
							data.results,
							function (result) {
								this.createComponent({
									kind: 'onyx.MenuItem',
									container: this.$[navigationEntitySet.name + "Menu"],
									content: enyo.Odata.entryDescription(refProperties, result)
								});
							},
							this							
						);
					} else {
						this.createComponent({
							kind: 'onyx.MenuItem',
							container: this.$[navigationEntitySet.name + "Menu"],
							content: enyo.Odata.entryDescription(refProperties, data)
						});
					}*/
					if (this.$[navigation.name+"List"]) {
						this.$[navigation.name+"List"].render();
					}
				}
			)
		);
	},
	
	setupItem: function(inSender, inEvent) {
		// this is the row we're setting up	
		this.$[inSender.entityName+"List"].getControls();
		var i = inEvent.index;
		var n = '';
		if (this.$[inSender.entityName+"List"].entries.results[i]) {
			n = enyo.Odata.entryDescription(this.$[inSender.entityName+"List"].refProperties, this.$[inSender.entityName+"List"].entries.results[i]);
		} else if (this.$[inSender.entityName+"List"].entries) {
			n = enyo.Odata.entryDescription(this.$[inSender.entityName+"List"].refProperties, this.$[inSender.entityName+"List"].entries);
		}
		// apply selection style if inSender (the list) indicates that this row is selected.
		this.$[inSender.entityName+'Item'].addRemoveClass("list-sample-selected", inSender.isSelected(i));
		this.$[inSender.entityName+'Entry'].setContent(n);
		return true;
	},
	
	validateForm: function(inSender,inEvent){
		this.doValidateForm({inEvent: inEvent});
	},
	
	doValidateForm: function(inSender){
		var data = {};
		enyo.forEach(
			this.properties, 
			function (property) {
				var name = property.name;
				if (this.$[name].getValue()) {
					data[this.$[name].name] = this.$[name].getValue();
				}
			},
			this
		);
		var links = [];
		enyo.forEach(
			this.navigation,
			function (navigation) {
				if (this.$[navigation.name+"List"]) {
					if (this.$[navigation.name+"List"].entries.results) {
						enyo.forEach(
							enyo.keys(this.$[navigation.name+"List"].getSelection().getSelected()),
							function (key) {
								links.push({navigation: navigation.name, entity: this.$[navigation.name+"List"].entitySetName, refProperties: enyo.Odata.entryDescription(this.$[navigation.name+"List"].refProperties, this.$[navigation.name+"List"].entries.results[key])});
							},
							this
						);
					} else if (this.$[navigation.name+"List"].entries) {
						if (enyo.keys(this.$[navigation.name+"List"].getSelection().getSelected()) === 0) {
							links.push({navigation: navigation.name, entity: this.$[navigation.name+"List"].entitySetName, refProperties: enyo.Odata.entryDescription(this.$[navigation.name+"List"].refProperties, this.$[navigation.name+"List"].entries)});
						}
					}
				}
			},
			this
		);
		
		this.log(links);
		
		//new request({uri: this.uri, method: 'POST', data: data});
		if (links) {
			enyo.forEach(
				links,
				function (link) {
					new request({uri: this.uri+'('+ enyo.Odata.entryDescription(enyo.Odata.findRefProperties(this.entitySet), data) +')'+'/$links'+'/'+link.navigation, method: 'PUT', data: {uri: this.serviceRoot + '/' + link.entity + '(' + link.refProperties + ')'}});
				},
				this
			);
		}
		this.goBack();
	},
	
	goBack:function(inSender,inEvent){
		this.doBack();
	}

});