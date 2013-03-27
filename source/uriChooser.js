enyo.kind({
	name: "uriChooser",
	classes: "list-sample enyo-fit",
	events: {onUriSelected: "", onNewUri: "", onUriSelectedApp: ""},
	handlers: {onAddUri: "addUri"},
	components: [
		{name: "uriList", kind: "enyo.List", multiSelect: false, classes: "enyo-fit list-sample-list", onSetupItem: "setupItem", components: [
			{name: "item", classes: "list-sample-item enyo-border-box", ontap: "uriSelected", components: [
				{name: "uri"}
			]}
		]},
		{kind: "onyx.InputDecorator", components: [
				{kind: "onyx.Input", name: "other", placeholder: "Enter URI here", style: "min-width: 300px;"}
		], style: "margin: 10px;"},
		{kind: 'onyx.Button', content: 'Add a new uri',	ontap: "newUri", style: "background-color: brown; color: #F1F1F1; margin: 10px;"}
	],
	uriStandard: [
		"http://services.odata.org/Northwind/Northwind.svc",
		"http://services.odata.org/OData/OData.svc",
		"http://services.odata.org/(S(zxibds3pxh30cejlp1tkkbki))/OData/OData.svc"
	],
	uriString: "http://services.odata.org/Northwind/Northwind.svc,http://services.odata.org/OData/OData.svc,http://services.odata.org/(S(zxibds3pxh30cejlp1tkkbki))/OData/OData.svc",
	uriTable: [],
	create: function() {
		this.inherited(arguments);
		if(typeof(Storage)!=="undefined")
		{
			if (sessionStorage.uris) {
				this.uriString = sessionStorage.uris;
				this.uriTable = this.uriString.split(',');
			} else {
				sessionStorage.uris = this.uriStandard;
				this.uriTable = this.uriStandard;
			}
		} else {
			this.uriTable = this.uriStandard;
		}
		this.$.uriList.setCount(this.uriTable.length);
		this.$.uriList.refresh();
	},
	
	setupItem: function(inSender, inEvent) {
		// this is the row we're setting up	
		this.$.uriList.getControls();
		var i = inEvent.index;
		var n = this.uriTable[i];
		// apply selection style if inSender (the list) indicates that this row is selected.
		this.$.item.addRemoveClass("list-sample-selected", inSender.isSelected(i));
		this.$.uri.setContent(n);
	},
	
	newUri: function(inSender, inEvent) {
		if(typeof(Storage)!=="undefined")
		{
			if (sessionStorage.uris) {
				sessionStorage.uris = this.uriString +',' +this.$.other.getValue();
				this.uriString = sessionStorage.uris;
				this.uriTable = sessionStorage.uris.split(',');
				this.$.uriList.setCount(this.uriTable.length);
				this.$.uriList.refresh();
			} else {
				this.uriString = this.uriString + ',' +this.$.other.getValue();
				this.uriTable = this.uriString.split(',');
				this.$.uriList.setCount(this.uriTable.length);
				this.$.uriList.refresh();				
			}
		}
	},
	
	uriSelected:  function(inSender, inEvent) {
		this.doUriSelected({uri: this.uriTable[inEvent.index]});
		this.doUriSelectedApp({uri: this.uriTable[inEvent.index]});
	}
	
});