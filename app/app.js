// Sets the require.js configuration for your application.
require.config( {
	// 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
	
	urlArgs: 'cb=' + Math.random(),
	paths: {
		// Core Libraries
		"jquery": "../lib/jquery-1.8.3",
		"jquery.serializeobject": "./serializeObject",
		"jquery.flot": "../lib/jquery.flot",
		"jquery.flot.time": "../lib/jquery.flot.time",
		"underscore": "../lib/lodash",
		"parse": "../lib/parse-1.1.13",
		"moment": "../lib/moment",
		"bootstrap": "../lib/bootstrap",
		"spin": "../lib/spin",
		"spinhelper": "../lib/spin.helper",
		"ratchet": "../lib/ratchet",
		"queryhelper": "./QueryHelper"
	},

	// Sets the configuration for your third party scripts that are not AMD compatible
	shim: {
		"parse": {
			"deps": [ "underscore", "jquery" ],
			"exports": "Parse"  //attaches "Parse" to the window object
		},
		"jquery.flot": ['jquery'],
		"jquery.flot.time": ['jquery', 'jquery.flot'],
		"jquery.serializeobject": ['jquery'],
		"bootstrap": ['jquery'],
		"spin": ['jquery'],
		"spinhelper": ['jquery', 'spin']
	} // end Shim Configuration
});

require(["parse", "./Workspace", "bootstrap", "ratchet"], function(Parse, Workspace, bootstrap, ratchet) {
	// Override console.log and stuff to do serversid logging
	if (document.location.port === 80) {
		var oldError = console.error;
		var oldWarn = console.warn;
		var oldLog = console.log;
		var sendLogToServer = function(type, args) {
			try {
				var message;
				if (Parse.User.current()) {
					message = type +" ["+Parse.User.current().getUsername()+"]: "+args[0];
				} else {
					message = type +" [anonymous]: "+args[0];
				}
				$.post("logger.php", { log: message } );
			} catch (e) {
				// Do nothing.
			}
		};
		console.log = function() {
			sendLogToServer("log", arguments);
			oldLog.apply(console, arguments);
		};
		console.warn = function() {
			sendLogToServer("warn", arguments);
			oldWarn.apply(console, arguments);
		};
		console.error = function() {
			sendLogToServer("error", arguments);
			oldError.apply(console, arguments);
		};
	}
	console.log("Starting app...");

	$(document).ready(function() {
		// Initialize Parse libraries with my app ID and javascript API key
		Parse.initialize("M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e", "NllvdChHyabrLUTVo2AoAxqO5pQRonDw0FL6jgDN");

		// Create a workspace for the app. This will partly be responsible for
		// routing the app to the right place, but also hold any state or
		// caches that we might need. It will create views, objects and collections
		// as neccessary when routing.
		new Workspace();
	});
});