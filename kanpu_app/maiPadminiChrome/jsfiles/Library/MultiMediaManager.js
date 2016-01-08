//=======================
//  MultiMediaManagerクラス
//=======================

function MultiMediaManager() {
	this.audio = document.getElementById("track");
}

MultiMediaManager.prototype.start = function() {
	this.audio.play();
}

MultiMediaManager.prototype.play = function() {
	this.start();
}

MultiMediaManager.prototype.pause = function() {
	this.audio.pause();
}

MultiMediaManager.prototype.stop = function() {
	this.pause();
}

MultiMediaManager.prototype.seek = function(sec) {
	if (this.audio.readyState > 0) {
		this.audio.currentTime = sec;
	}
}

MultiMediaManager.prototype.currentPosition = function() {
	return this.audio.currentTime;
}

MultiMediaManager.prototype.isPlaying = function() {
	return !this.audio.paused;
}

MultiMediaManager.prototype.getDuration = function() {
	if (!isNaN(this.audio.duration)) {
		return this.audio.duration;
	}
	return 0;
}





