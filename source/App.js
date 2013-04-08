enyo.kind({
	name: "App",
	kind: "enyo.Panels",
	draggable: false,
	classes: "enyo-fit",
	published: {request : ''},
	handlers: {
		onQuerySelected:"goQueryMode",
		onRequestSelected:"goRequestMode"
	},
	components: [
		{kind: "requestPanel", name: "requestP", style: "width: 100%; height: 100%"}//,
		//{kind: "queryPanel", name: "query", style: "width: 100%; height: 100%"}
	],
	
	create : function() {
		this.inherited(arguments);	
		this.render();
	},
	
	goQueryMode: function(inSender, inEvent) {
		this.request = inEvent.request;
		//this.$.query.setRequest(this.request);
		this.createComponent({
			kind: "queryPanel",
			name: "query",
			style: "width: 100%; height: 100%",
			request: this.request
		});
		this.$.query.render();
		this.next();
	},
	
	goRequestMode: function(inSender, inEvent) {
		this.$.query.destroy();
		this.request = inEvent.request;
		this.$.requestP.setRequest(this.request);
		this.previous();
	}	
	
});