enyo.kind({
	name:"element",
	style:"background-color: grey;",
	published:{
		properties:"",
		identification: ""
	},
	events:{
		onLinkSelected: "",
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
		this.$.title.setContent(this.identification);
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
			uri: value.__deferred.uri,
			ontap: "linkSelected",
			style: "background-color: orange; margin: 10px;"
		});
		this.$.details.render();
	},
	
	linkSelected:function(inSender,inEvent){
		this.doLinkSelected({element: inEvent.originator});
	},

	goBack:function(inSender,inEvent){
		this.doBack();
	}

});