var MATCH_SERVER = "http://localhost:4175/";
var API_SERVER = "http://localhost:4176/";

var get = function(server, path, callback) {
	fetch(server + path).then(function(response) {
		if (response.headers.get("Content-Type") == "text/json") {
			response.json().then(function(text) {
				callback(true, text);
			});
		} else {
			response.text().then(function(text) {
				callback(true, text);
			});
		}
	});
};

export default {
	server: {
		match: MATCH_SERVER,
		api: API_SERVER
	},

	get: get
};
