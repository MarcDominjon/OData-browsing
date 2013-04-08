enyo.kind({
	name: "uriChooser",
	classes: "list-sample enyo-fit",
	events: {onUriSelected: "", onNewUri: "", onUriSelectedApp: ""},
	handlers: {onAddUri: "addUri"},
	uriOk: false,
	otherUri : '',
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
		this.otherUri = this.$.other.getValue();
		this.testUri();
	},
	
	uriSelected:  function(inSender, inEvent) {
		this.doUriSelected({uri: this.uriTable[inEvent.index]});
		this.doUriSelectedApp({uri: this.uriTable[inEvent.index]});
	},
	
	testUri: function() {
		var metadata = '/$metadata';
		this.log(this.otherUri);
		if (this.otherUri.slice(-1) == '/') {
			this.otherUri = this.otherUri.slice(0,-1);
		}
		OData.read(
			this.otherUri + metadata,
			enyo.bind(this,'correctUri'),
			enyo.bind(this,'isSharepointOrNot'),
			OData.metadataHandler
		);
	},
	
	correctUri: function(data) {
		this.log(data);
		if (!data) {
			this.log('Arnak');
			this.notACorrectUri();
			return;
		}
		
		if(typeof(Storage)!=="undefined")
		{
			if (sessionStorage.uris) {
				sessionStorage.uris = this.uriString + ',' + this.otherUri;
				this.uriString = sessionStorage.uris;
				this.uriTable = sessionStorage.uris.split(',');
			} else {
				this.uriString = this.uriString + ',' + this.otherUri;
				this.uriTable = this.uriString.split(',');				
			}
			this.$.uriList.setCount(this.uriTable.length);
			this.$.uriList.refresh();
		}
	},
	
	isSharepointOrNot: function() {
		var metadata = '/_vti_bin/listdata.svc/$metadata';
		OData.read(
			this.otherUri + metadata,
			enyo.bind(this,'isSharepoint'),
			enyo.bind(this,'notACorrectUri'),
			OData.metadataHandler
		);
	},
	
	isSharepoint: function(data) {
		this.otherUri += '/_vti_bin/listdata.svc';
		this.correctUri(data);
	},
	
	notACorrectUri: function(err) {
		this.log('Not a correct URI yet.');
		var uriSplitted = this.otherUri.split('/');
		if (uriSplitted.length == 1) {
			alert('This URI does not refer to a valid OData service.');
			return;
		} else {
			uriSplitted.pop();
			this.otherUri = uriSplitted.join('/');
		}
		this.testUri();
	},
	
});