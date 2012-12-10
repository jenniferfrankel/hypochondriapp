require.config({
	baseUrl: "../",
	// Cache buster to make sure we have the latest version at all times
	urlArgs: 'cb=' + Math.random(),
	paths: {
		jasmine: 'lib/jasmine-1.3.1/jasmine',
		'jasmine-html': 'lib/jasmine-1.3.1//jasmine-html',
		'durationUtils': 'app/durationUtils',
		'underscore': 'lib/lodash',
		spec: 'test/spec/'
	},
	shim: {
		jasmine: {
			exports: 'jasmine'
		},
		'jasmine-html': {
			deps: ['jasmine'],
			exports: 'jasmine'
		}
	}
});

require(['jasmine-html'], function(jasmine){
 
	var jasmineEnv = jasmine.getEnv();
	jasmineEnv.updateInterval = 1000;
 
	var htmlReporter = new jasmine.HtmlReporter();
	jasmineEnv.addReporter(htmlReporter);
 
	jasmineEnv.specFilter = function(spec) {
		return htmlReporter.specFilter(spec);
	};
 
	var specs = ['spec/DurationUtilsSpec'];
 
	require(specs, function(){
		jasmineEnv.execute();
	});
});