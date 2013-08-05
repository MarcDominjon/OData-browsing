enyo.kind({
	name: "requestPanel",
	kind: "FittableRows",
	classes: "enyo-fit",
	draggable: false,
	fit: true,
	published: {request : ''},
	handlers: {
		onEntitySelectedApp:"addUriEntity",
		onElementSelectedApp:"addUriElement",
		onLinkSelectedApp:"addUriLink",
		onUriSelectedApp: "addUriRoot",
		onBackElement:"delUriElement",
		onBackEntity:"delUriEntity",
		onBackRoot:"delUriRoot",
	},
	events:{onQuerySelected:""},
	components: [
		{kind: "onyx.Toolbar", components: [
			{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "requestInput", placeholder: "Request in construction here.", style: " color: black; width: 100%;", type: "url"}
			], style: "margin: 10px;  background-color: white; width: 85%;"},
			{kind: "onyx.Button", name:"queryMode",content: "Query Mode", showing:false, ontap:"goQuery", style: "background-color: cyan; color: purple;"}
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
		if (this.request.slice(-1) == "/") {
			this.request = this.request + inEvent.entityType.name;
		} else {
			this.request = this.request + '/' + inEvent.entityType.name;
		}
		this.$.requestInput.setValue(this.request);
		this.$.requestInput.render();
	},
	
	addUriElement: function(inSender, inEvent) {
		var str = inEvent.element.identification;
		if (str.split("=").length - 1 == 1) {
			str = str.split("=")[1];
		}
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
		uriTable.pop();
		this.request = uriTable.join('/');
		this.$.requestInput.setValue(this.request);
		this.$.requestInput.render();
	},
	
	delUriElement: function(inSender, inEvent) {
		var str = this.request;
		if (str.split('').pop() == ')'){
			var patt = /\((.*?)\)/g;
			var match= "";
			var matches = "";
			while (matches = patt.exec(str)) {
				match = matches.index;
			}
			this.request = str.slice(0, match);
			this.$.requestInput.setValue(this.request);
			this.$.requestInput.render();
		} else {
			this.delUriEntity();
		}
	},
	
	goQuery: function(inSender, inEvent) {
		this.doQuerySelected({request: this.$.requestInput.getValue()});
	}
});