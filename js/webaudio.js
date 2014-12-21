/*
 *	This is our sound object
 */
function Sound(source, level) {
	var constructorName = window.AudioContext || window.webkitAudioContext;
	if (!constructorName) {
		throw new Error("Your browser doesn't currently support the Web Audio API.");
	}

	this.audioContext = new constructorName();

	// Set the audio context to use as many channels as possible.
	// This will allow us to hear whether the browser supports multiple channels.
	this.audioContext.destination.channelCount = this.audioContext.destination.maxChannelCount;
	this.audioContext.destination.channelCountMode = "explicit";
	this.audioContext.destination.channelInterpretation = "discrete";

	var that = this;
	that.source = source;
	that.buffer = null;
	that.isLoaded = false;
	that.volume = this.audioContext.createGain();
	if (!level) {
		that.volume.gain.value = 1;
	}
	else {
		that.volume.gain.value = level;
	}

	var getSound = Base64Binary.decodeArrayBuffer(that.source);
	this.audioContext.decodeAudioData(getSound, function(buffer) {
			that.buffer = buffer;
			that.isLoaded = true;
		}
	);
}

// our play function
// playbackRate allows for changing the speed of playback, mainly for SFX
Sound.prototype.play = function (playbackRate) {
	var playSound;

	if (!playbackRate) {
		playbackRate = 1;
	}
	// if the sound is loaded
	if (this.isLoaded === true) {
		playSound = this.audioContext.createBufferSource();
		playSound.buffer = this.buffer;
		playSound.connect(this.volume);
		playSound.playbackRate.value = playbackRate;
		this.volume.connect(this.audioContext.destination);
		playSound.start(0);
	}

	// return the context so we can work with it later!
	return playSound;
};

Sound.prototype.setVolume = function (level) {
	this.volume.gain.value = level;
};

// pass the returned playSound context
// (from Sound.prototype.play) in order to stop sound playback
Sound.prototype.killSound = function (context) {
	context.stop(0);
};
