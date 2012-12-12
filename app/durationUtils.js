define([], function() {
	return {
		sliderValueToSeconds : function(durVal) {
			var duration = 0;
			if (durVal < 300) {
				duration = Math.ceil((59/300) * durVal);
			}
			else if (durVal > 600) {
				duration = Math.ceil((23/300) * (durVal - 599));
				duration = duration*3600;
			}
			else {
				duration = Math.ceil((59/300) * (durVal-299));
				duration = duration*60;
			}
			return duration;
		},

		secondsToSliderValue : function(seconds) {
			if (seconds < 60) {
				return 300/60 * seconds;
			}
			if (seconds < 60*60) {
				return 300 + 300/60 * (seconds/60);
			}
			return 600 + 300/24 * (seconds/60/60);
		}
	};
});