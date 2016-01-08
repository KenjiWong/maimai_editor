//=======================
//  SEManagerクラス
//=======================

var SEName = {
	ANSWERSOUND: 0,
	DECIDE: 1,
	SELECT: 2,
	TAPPERFECT: 3,
	TAPGREAT: 4,
	TAPGOOD: 5,
	BREAK2600: 6,
	BREAK2500: 7,
	BREAKNONPERFECT: 8,
	SLIDE: 9,
	STARTCOUNT: 10,
	VOICE_AP: 11,
	VOICE_FC: 12,
	VOICE_SELECTMUSIC: 13,
	VOICE_RESULT: 14,
	VOICE_NEWRECORD: 15,
	SIMAI_TAP: 16,
	SIMAI_HOLDFOOT: 17,
	SIMAI_BREAK: 18,
	SIMAI_SLIDE: 19,
	VOICE_100SYNC: 20,
	MAX: 21,
};

function SEManager() {
	this.bfIndex = [];
	this.bfIndexMax = 8;
	
	this.seBuffer = [];
	for (var i = 0; i < SEName.MAX; i++) {
		this.bfIndex[i] = 0;
		this.seBuffer[i] = [];
		var res = null;
		for (var j = 0; j < this.bfIndexMax; j++) {
			if (i == SEName.STARTCOUNT) res = document.getElementById("se_startcount" + j);
			if (i == SEName.SIMAI_TAP) res = document.getElementById("se_simai_tap" + j);
			else if (i == SEName.SIMAI_HOLDFOOT) res = document.getElementById("se_simai_holdfoot" + j);
			else if (i == SEName.SIMAI_SLIDE) res = document.getElementById("se_simai_slide" + j);
			else if (i == SEName.SIMAI_BREAK) res = document.getElementById("se_simai_break" + j);
			this.seBuffer[i][j] = res;
		}
	}
}

SEManager.prototype.play = function(seName) {
	var sound = this.seBuffer[seName][this.bfIndex[seName]];
	if (sound != null) {
		sound.play();
		this.bfIndex[seName]++;
		this.bfIndex[seName] %= this.bfIndexMax;
	}
}

SEManager.prototype.stop = function(seName) {
	var sound = this.seBuffer[seName][this.bfIndex[seName]];
	if (sound != null) {
		sound.pause();
	}
}

SEManager.prototype.destroy = function() {
	if (this.soundobj != null) {
		for (var i = 0; i < this.soundobj.length; i++) {
			this.soundobj[i] = null;
		}
	}
	this.soundobj = null;
}
