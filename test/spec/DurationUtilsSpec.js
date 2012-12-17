define(['jasmine-html', 'durationUtils', 'lib/lodash'], function(jasmine, utils, _) {
	describe('Duration Utils', function() {
		describe('Value to seconds conversion', function() {
			it('No value should be no seconds', function() {
				expect(utils.sliderValueToSeconds(0)).toEqual(0);
			});
			it('Less than 296 should map to seconds', function() {
				expect(utils.sliderValueToSeconds(1)).toEqual(1);
				expect(utils.sliderValueToSeconds(295/2)).toEqual(30);
				expect(utils.sliderValueToSeconds(295)).toEqual(59);
			});
			it('Over 295 & under 591 should map to minutes', function() {
				expect(utils.sliderValueToSeconds(296)).toEqual(1*60);
				expect(utils.sliderValueToSeconds((296+590)/2)).toEqual(30*60);
				expect(utils.sliderValueToSeconds(590)).toEqual(59*60);
			});
			it('Over 590 should map to hours', function() {
				expect(utils.sliderValueToSeconds(591)).toEqual(1*60*60);
				expect(utils.sliderValueToSeconds((590+878)/2)).toEqual(12*60*60);
				expect(utils.sliderValueToSeconds(878)).toEqual(24*60*60);
			});
		});
		describe('Seconds to value conversion', function() {
			it('No seconds should be no value', function() {
				expect(utils.sliderValueToSeconds(0)).toEqual(0);
			});
			it('Less than 60 seconds should map to 0-295', function() {
				expect(utils.secondsToSliderValue(1)).toBeLessThan(6);
				expect(utils.secondsToSliderValue(30)).toEqual(150);
				expect(utils.secondsToSliderValue(59)).toBeGreaterThan(294);
			});
			it('Less than 60 minutes should map to 296-590', function() {
				expect(utils.secondsToSliderValue(1*60)).toBeLessThan(306);
				expect(utils.secondsToSliderValue(30*60)).toEqual(445);
				expect(utils.secondsToSliderValue(59*60)).toBeGreaterThan(548);
			});
			it('1-24 hours should map to 591-878', function() {
				expect(utils.secondsToSliderValue(1*60*60)).toBeLessThan(603);
				expect(utils.secondsToSliderValue(12*60*60)).toEqual(734);
				expect(utils.secondsToSliderValue(24*60*60)).toBeGreaterThan(875);
			});
		});
		describe('Humanize seconds', function(){
			it('Seconds conversion', function(){
				expect(utils.humanizeSeconds(1)).toEqual('1 second');
				expect(utils.humanizeSeconds(2)).toEqual('2 seconds');
			});
			it('Minutes conversion', function(){
				expect(utils.humanizeSeconds(1*60)).toEqual('1 minute');
				expect(utils.humanizeSeconds(2*60)).toEqual('2 minutes');
			});
			it('Hours conversion', function(){
				expect(utils.humanizeSeconds(1*60*60)).toEqual('1 hour');
				expect(utils.humanizeSeconds(2*60*60)).toEqual('2 hours');
			});
		});
		describe('Tuducken', function(){
			it('Roundtrip 28 min', function(){
				var a = utils.secondsToSliderValue(28*60);
				var b = utils.sliderValueToSeconds(a);
				var c = utils.humanizeSeconds(b);
				expect(c).toEqual('28 minutes');
			});
			it('Roundtrip 5 min', function(){
				for (var i = 2; i < 59; i+=1) {
					var a = utils.secondsToSliderValue(i*60);
					var b = utils.sliderValueToSeconds(a);
					var c = utils.humanizeSeconds(b);
					expect(c).toEqual(i+' minutes');
				}
				
			});
		});
	});
});
