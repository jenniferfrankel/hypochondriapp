define([], function() {
	return {
		sliderValueToSeconds : function(sliderVal) {
			var duration = 0;
			if (sliderVal < 296) {
				duration = Math.ceil((59/295) * sliderVal);
			}
			else if (sliderVal > 590) {
				duration = Math.ceil((24/288) * (sliderVal - 590));
				duration = duration*3600;
			}
			else {
				duration = Math.ceil((59/295) * (sliderVal-295));
				duration = duration*60;
			}
			return duration;
		},

		secondsToSliderValue : function(seconds) {
			if (seconds < 60) {
				return Math.round(295/59 * seconds);
			}
			if (seconds < 60*60) {
				return Math.round(295 + 295/59 * (seconds/60));
			}
			return Math.round(590 + 288/24 * (seconds/60/60));
		},

		humanizeSeconds : function(seconds) {
			var plural = function(x) { return x == 1 ? '' : 's'; };
			if (seconds < 60) {
				return seconds + " second"+plural(seconds);
			}
			if (seconds < 60*60) {
				return seconds/60 + " minute"+plural(seconds/60);
			}
			return seconds/3600 + " hour"+plural(seconds/3600);
		}
	};
});