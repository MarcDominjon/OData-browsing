enyo.kind({
	name: "autoComplete",
	handlers: {
		onReturnPressed: 'returnPressed',
		onEscPressed: 'escPressed',
		onUpPressed: 'upPressed',
		onDownPressed: 'downPressed',
		onInsertSuggestion: 'insertSuggestion'
	},
	published: {
		bases: null
	},
	fit: false,
	
	create: function() {
		this.inherited(arguments);
		this.createComponent({
			kind: "autoCompleteInput",
			bases: this.bases
		});
		this.createComponent({
			kind: 'autoCompletePopup',
			name: 'popup'
		});
	},
	
	returnPressed: function(inSender, inEvent) {
		this.$.popup.keyReturn();
		return true;
	},
	
	escPressed: function(inSender, inEvent) {
		this.$.popup.keyEscape();
		return true;
	},
	
	upPressed: function(inSender, inEvent) {
		this.$.popup.cursorUp();
		return true;
	},
	
	downPressed: function(inSender, inEvent) {
		this.$.popup.cursorDown();
		return true;
	},
	
	insertSuggestion: function(inSender, inEvent) {
		this.$.autoCompleteInput.completeInput(inEvent.suggestion);
		return true;
	}
});

enyo.kind({
	name: "autoCompleteInput",
	events: {
		onReturnPressed: '',
		onEscPressed: '',
		onUpPressed: '',
		onDownPressed: ''
	},
	
	published: {
		bases: []
	},
	
	components: [
		{kind: "onyx.InputDecorator", name: 'decorator', components: [
			{kind: "onyx.Input", name: "autoInput", disabled: false, placeholder: "Request in construction here.", 
			ontap: 'inputTapped',oninput: 'autoCompleteProcess', onkeydown: 'keyPressed', style: "width: 100%"}
		], style: "margin: 10px; background-color: white; width: 90%;"},
		{name: "invisibleInput", classes: 'enyo-input onyx.input', style: 'display:inline-block; visibility: hidden; margin: 0px; border: 0px; padding: 0px;'}
	],
	
	suggestions: [],
	
	previousCursor: 0,
	
	create: function() {
		this.inherited(arguments);
		this.render();
	},
	
	keyPressed: function (inSender, inEvent) {
		var key = inEvent.keyIdentifier;
		if (this.owner.$.popup.popupShown) {
			if(key == 'Enter' || key == 'Up' || key == 'Down' || key == 'U+001B') {
				inEvent.preventDefault();
			}
			switch (key) {
				case 'Enter':
					this.doReturnPressed();
					break;
				case 'Up':
					this.doUpPressed();
					break;
				case 'Down':
					this.doDownPressed();
					break;
				case 'U+001B':
					this.doEscPressed();
					break;
			}
			if (key == 'U+0020' && inEvent.ctrlKey === true) {
				inEvent.preventDefault();
				this.doEscPressed();
			} else if (key == 'Left' || key == 'Right' || key == 'End' || key == 'Home' || key == 'PageUp' || key == 'PageDown') {
				this.doEscPressed();
			}
			return true;
		} else {
			if (key == 'U+0020' && inEvent.ctrlKey === true) {
				inEvent.preventDefault();
				this.autoCompleteProcess(inSender, inEvent);
			}
		}
	},
	
	autoCompleteProcess: function(inSender, inEvent) {
		this.suggestions = [];
		
		var asyncCall = new enyo.Async();
		asyncCall.go();
		
		asyncCall.response(enyo.bind(this,function(inSender, inResponse) {
			var textInput = this.$.autoInput.getValue();
			var cursorIndex = this.$.autoInput.hasNode().selectionStart;
			this.previousCursor = cursorIndex;
			
			if (textInput.charAt(cursorIndex-1) != ' ' && textInput.length && (textInput.charAt(cursorIndex) == ' ' || textInput.charAt(cursorIndex) === '')) {
				var lastSpaceIndex = textInput.slice(0, cursorIndex).lastIndexOf(' ');
				var partial = textInput.slice(lastSpaceIndex + 1, cursorIndex+1).trim();
				var regexp = new RegExp(partial, 'i');
				enyo.forEach(
					this.bases,
					function (element) {
						if (element.notation.search(regexp) === 0) {
							this.suggestions.push(element);
						}
					},
					this
				);
			}
			
			if (this.suggestions != []) {
				this.$.invisibleInput.setContent(textInput.substring(0, cursorIndex));
				
				var offsetToCaret = this.$.invisibleInput.node.offsetWidth;
				var decoratorBounds = this.$.decorator.getBounds();
				var posParent = enyo.dom.calcNodePosition(this.owner.hasNode());
				var posDecorator = enyo.dom.calcNodePosition(this.$.decorator.hasNode());
				
				this.owner.$.popup.setProperty('posX', posParent.left + offsetToCaret);
				this.owner.$.popup.setProperty('posY', posParent.top + this.$.autoInput.hasNode().offsetHeight + this.$.autoInput.hasNode().size + 10);
				this.owner.$.popup.setProperty('suggestions', this.suggestions);
				
				var popupWidth = this.owner.$.popup.node.clientWidth;
				
				if ( offsetToCaret > (decoratorBounds.width - popupWidth)) {
					this.owner.$.popup.setProperty('suggestions', []);
					this.doEscPressed();
					this.owner.$.popup.setProperty('posX', posDecorator.left + (decoratorBounds.width - popupWidth));
					this.owner.$.popup.setProperty('posY', posParent.top + this.$.autoInput.hasNode().clientHeight + this.$.autoInput.hasNode().size + 10);
					this.owner.$.popup.setProperty('suggestions', this.suggestions);
				}
			}
		}));
		
		
	},
	
	completeInput: function(suggestion) {
		var input = this.$.autoInput;
		var textInput = input.getValue();
		var lastSpace = textInput.slice(0, this.previousCursor).lastIndexOf(' ');
		var insertion;
		if (lastSpace == -1) {
			insertion = suggestion + ' ' + textInput.slice(this.previousCursor);
		} else {
			insertion = textInput.slice(0, lastSpace+1) + suggestion + ' ' + textInput.slice(this.previousCursor);
		}
		input.setValue(insertion);
		input.hasNode().selectionStart = (lastSpace + 2 + suggestion.length);
		input.hasNode().selectionEnd= (lastSpace + 2 + suggestion.length);
	},
	
	inputTapped: function(inSender, inEvent) {
		var input = this.$.autoInput;
		if (input.hasNode().selectionStart != this.previousCursor) {
			this.doEscPressed();
		}
	}
});

enyo.kind({
	name : "autoCompletePopup",
	kind : "onyx.Popup",
	centered : false,
	floating : true,
	autoDismiss : false,
	modal : false,
	published: {
		suggestions: null,
		posX: null,
		posY: null
	},
	components : [ {
		kind : "Select",
		name : "autocompleteSelect",
		attributes : {
			size : 1
		},
		onchange : "autocompleteChanged",
		components : [
			// options elements will be populated programmatically
		]
	} ],
	events: {
		onInsertSuggestion: ''
	},
	handlers: {
		onHide: "hideAutocompletePopup"
	},
	popupShown: false,
	
	
	create: function() {
		this.inherited(arguments);
	},
	
	suggestionsChanged: function() {
		var select = this.$.autocompleteSelect;
		select.destroyComponents();
		enyo.forEach(this.suggestions, function(item) {
			var name = item.name;
			select.createComponent({content: name});
		}, this);
		this.showAutocompletePopup();
	},
	
	showAutocompletePopup: function() {
		var select = this.$.autocompleteSelect;
		select.nbEntries = select.controls.length;
		if (select.nbEntries > 0) {
			var size = Math.max(2, Math.min(select.nbEntries, 10));
			select.setAttribute("size", size);
			select.setSelected(0);
			select.render();
			
			// Position the autocomplete popup
			this.applyStyle("top", this.posY + "px");
			this.applyStyle("left", this.posX + "px");
			this.show();
			this.popupShown = true;
		} else {
			this.hideAutocompletePopup();
		}
	},
	
	hideAutocompletePopup: function() {
		this.popupShown = false;
		this.hide();
		return true;
	},
	
	cursorUp: function() {
		if (this.popupShown) {
			var select = this.$.autocompleteSelect;
			var selected = select.getSelected() - 1;
			if (selected < 0) { selected = select.nbEntries - 1;}
			select.setSelected(selected);
		}
	},

	cursorDown: function() {
		if (this.popupShown) {
			var select = this.$.autocompleteSelect;
			var selected = (select.getSelected() + 1) % select.nbEntries;
			select.setSelected(selected);
		}
	},

	keyEscape: function() {
		this.hideAutocompletePopup();
	},

	keyReturn: function() {
		if (this.popupShown) {
			this.autocompleteChanged();
			this.hideAutocompletePopup();
		}
	},
	
	autocompleteChanged: function() {
		this.hide();
		var indexSelected = this.$.autocompleteSelect.getSelected();
		this.doInsertSuggestion({suggestion: this.suggestions[indexSelected].notation});
	}
});