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
	});
});
