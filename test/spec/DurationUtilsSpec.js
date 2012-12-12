define(['jasmine-html', 'durationUtils', 'lib/lodash'], function(jasmine, durationUtils, _) {
	return describe('DurationUtils', function() {
		describe('Value to seconds conversion', function() {
			it('No value should be no seconds', function() {
				expect(durationUtils.sliderValueToSeconds(0)).toEqual(0);
			});
			it('Less than 300 should map to seconds', function() {
				expect(durationUtils.sliderValueToSeconds(1)).toEqual(1);
				expect(durationUtils.sliderValueToSeconds(150)).toEqual(30);
				expect(durationUtils.sliderValueToSeconds(299)).toEqual(59);
			});
			it('Over 300 & under 600 should map to minutes', function() {
				expect(durationUtils.sliderValueToSeconds(300)).toEqual(1*60);
				expect(durationUtils.sliderValueToSeconds(450)).toEqual(30*60);
				expect(durationUtils.sliderValueToSeconds(599)).toEqual(59*60);
			});
			it('Over 600 should map to hours', function() {
				expect(durationUtils.sliderValueToSeconds(600)).toEqual(1*60*60);
				expect(durationUtils.sliderValueToSeconds(750)).toEqual(12*60*60);
				expect(durationUtils.sliderValueToSeconds(900)).toEqual(24*60*60);
			});
		});
		describe('Seconds to value conversion', function() {
			it('No seconds should be no value', function() {
				expect(durationUtils.sliderValueToSeconds(0)).toEqual(0);
			});
			it('Less than 60 seconds should map to 0-299', function() {
				expect(durationUtils.secondsToSliderValue(1)).toBeLessThan(6);
				expect(durationUtils.secondsToSliderValue(30)).toEqual(150);
				expect(durationUtils.secondsToSliderValue(59)).toBeGreaterThan(294);
			});
			it('Less than 60 minutes should map to 300-599', function() {
				expect(durationUtils.secondsToSliderValue(1*60)).toBeLessThan(306);
				expect(durationUtils.secondsToSliderValue(30*60)).toEqual(450);
				expect(durationUtils.secondsToSliderValue(59*60)).toBeGreaterThan(594);
			});
			it('1-24 hours should map to 600-900', function() {
				expect(durationUtils.secondsToSliderValue(1*60*60)).toBeLessThan(613);
				expect(durationUtils.secondsToSliderValue(12*60*60)).toEqual(750);
				expect(durationUtils.secondsToSliderValue(24*60*60)).toBeGreaterThan(894);
			});
		});
	});
});
