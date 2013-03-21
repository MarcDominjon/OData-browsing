enyo.kind({
	name: "App",
	kind: "FittableRows",
	classes: "enyo-fit",
	published: {request : ''},
	handlers: {
		onEntitySelectedApp:"addUriEntity",
		onElementSelectedApp:"addUriElement",
		onLinkSelectedApp:"addUriLink",
		onUriSelectedApp: "addUriRoot",
		onBack:"goBack"
	},
	components: [
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "requestInput", placeholder: "Request in construction here.", style: " color: black; width: 100%;", type: "url"}
			], style: "margin: 10px;  background-color: white; width: 95%;"},
		]},
		{kind: "odataPanel", name: "browsing", style: "width: 100%; height: 100%"}
	],
	
	create : function() {
		this.inherited(arguments);	
		this.render();
	},
	
	addUriRoot: function(inSender, inEvent) {
		this.request = inEvent.uri;
		this.$.requestInput.setValue(this.request);
		this.$.requestInput.render();
	},
	
	addUriEntity: function(inSender, inEvent) {
		this.request = this.request + '/' + inEvent.entityType.name;
		this.$.requestInput.setValue(this.request);
		this.$.requestInput.render();
	},
	
	addUriElement: function(inSender, inEvent) {
		var str = inEvent.element.identification;
		var table = str.split("");
		table.pop();
		str = table.join("");
		this.request = this.request + '(' + str + ')';
		this.$.requestInput.setValue(this.request);
		this.$.requestInput.render();
	},
	
	addUriLink: function(inSender, inEvent) {
		this.request = this.request + '/' + inEvent.element.content;
		this.$.requestInput.setValue(this.request);
		this.$.requestInput.render();
	},
	
	delUriRoot: function(inSender, inEvent) {
		this.request = ""
		this.$.requestInput.setValue(this.request);
		this.$.requestInput.render();
	},
	
	delUriEntity: function(inSender, inEvent) {
		var uriTable = this.request.split('/');
		uriTable = uriTable.pop();
		this.request = uriTable.join('/');
		this.$.requestInput.setValue(this.request);
		this.$.requestInput.render();
	},
	
	delUriElement: function(inSender, inEvent) {
		var patt = /\((.*?)\)/g;
		var str = this.request;
		var matches = str.match(patt);
		while (matches.length > 1){
			matches.shift();
		}
		this.request = str.slice(start, str.search(matches[0]));
		this.$.requestInput.setValue(this.request);
		this.$.requestInput.render();
	},
	
	delUriLink: function(inSender, inEvent) {
		this.delUriElement();
		this.delUriEntity();
	},
});