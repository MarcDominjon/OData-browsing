enyo.kind({
	name: 'request',
	published:{
		method: '',
		uri: '',
		data: '',
		successCallback: '',
		errorCallback: ''
	},
	request: '',
	header: '',
	results: '',
	create: function() {
		this.inherited(arguments);
		this.log(this);
		/*this.request = {headers: this.header, requestUri: this.uri, data: this.data};
		this.header = {"DataServiceVersion": "2.0"};
		if (this.method == 'PUT' || this.method == 'MERGE'|| this.method == 'DELETE') {
			this.header['X-HTTP-Method'] = this.method;
			this.request['method'] = 'POST';
			OData.read(
				this.uri,
				enyo.bind(
					this, 
					function (data) {
						if (data.results) {
							if (data.results[0].__metadata.etag) {
								this.header['If-Match'] = '*';
							}
						} else if (data.__metadata.etag) {
							this.header['If-Match'] = '*';
						}	
					}
				),
				enyo.bind(this,"processError")
			);
		} else {
			this.request['method'] = this.method;
		}
		this.request['headers'] = this.header;
		this.log('Request: ', this.request);
		OData.request(
			this.request,
			function (data) { 
				enyo.log('data', data);
			}
		);*/
		
		
		var header = {"DataServiceVersion": "1.0", 'MaxDataServiceVersion':'2.0', 'accept': 'application/json;'};
		
		
		var that = this;
		
		if (this.method == 'PUT' || this.method == 'MERGE'|| this.method == 'DELETE') {
			var ajaxPreRequest = new enyo.Ajax({
				url: this.uri,
				method: 'GET',
				handleAs: "json",
				headers: header,
				contentType: 'application/json'
			});
			ajaxPreRequest.go();
			var ifMatch = ajaxPreRequest.response(
				function(inAsync, inValue){
					if (inValue.d.results) {
						if (inValue.d.results[0].__metadata.etag) {
							return true;
						}
					} else if (inValue.d.__metadata.etag) {
						return true;
					}
				}
			);
			if(ifMatch) {
				header['If-Match'] = '*';
			}
			ajaxPreRequest.error(
				function(inAsync, inValue){
					this.log(inAsync, inValue);
				}
			);
			/*var lol = new request({
				uri: this.uri,
				method: 'GET',
				successCallback: enyo.bind(
					that,
					function(inAsync, inValue) {
						if (inValue.d.results) {
							if (inValue.d.results[0].__metadata.etag) {
								header['If-Match'] = '*';
							}
						} else if (inValue.d.__metadata.etag) {
							header['If-Match'] = '*';
						}
						return inValue;
					}
				)
			});
			this.log(lol);*/
			header['X-HTTP-Method'] = this.method;
			var method = 'POST';
			var postBody = this.data;
		} else {
			var method = this.method;
			if (this.method == 'POST') {
				var postBody = this.data;
			}
		}
		
		var ajaxRequest = new enyo.Ajax({
			url: this.uri,
			method: method,
			handleAs: "json",
			headers: header,
			contentType: 'application/json',
			postBody: postBody
		});
		ajaxRequest.go();
		ajaxRequest.response(
			function(inAsync, inValue){
				if (this.successCallback) {
					this.successCallback(inAsync, inValue);
				} else {
					this.log(inAsync, inValue);
					this.results = inValue;
				}
			}
		);
		ajaxRequest.error(
			function(inAsync, inValue){
				if (this.errorCallback) {
					this.errorCallback(inAsync, inValue);
				} else {
					this.log(inAsync, inValue);
				}
			}
		);
	},
	
	processError: function(err) {
		this.log(err);
	}
});