//================================
// MaimaiNotesCommonInfo
//================================
var NoteType = {
	CIRCLETAP: 0,
	HOLDHEAD: 1,
	HOLDFOOT: 2,
	STARTAP: 3,
	SLIDE: 4,
	BREAK: 5,
	SLIDEPATTERN: 6,
};

function MaimaiNotesCommonInfo(judgeTimer, sensor, guideSpeed, markerSize, slideMarkerSizeAdaptation, starRotation, angulatedHold, autoDeleteSlideMarker, timeOffset, firstBPM) {
	this.sensor = sensor;
	this.guideSpeed = guideSpeed;
	this.markerSize = markerSize;
	this.slideMarkerSizeAdaptation = slideMarkerSizeAdaptation;
	this.judgeTimer = judgeTimer;
	this.starRotation = starRotation;
	this.angulatedHold = angulatedHold;
	this.timeOffset = timeOffset;
	this.gameStartTime = (60.0 / firstBPM) * 4.0 + RhythmActionJudgeNote.START_COUNT_START_TIME;
	this.autoDeleteSlideMarker = autoDeleteSlideMarker;
	this.setting = null;
	this.config = null;
}

//円の中心から描画開始位置までの距離
MaimaiNotesCommonInfo.NOTES_DRAW_STARTPOINT_TO_CENTER = 50.0 //適当に決める
MaimaiNotesCommonInfo.prototype.notesDrawStartPointToCenterDistance = function() { return MaimaiNotesCommonInfo.NOTES_DRAW_STARTPOINT_TO_CENTER; }

MaimaiNotesCommonInfo.prototype.getSensor = function() { return this.sensor; }
MaimaiNotesCommonInfo.prototype.getGuideSpeed = function() { return this.setting != null ? this.setting.getGuideSpeed() : this.guideSpeed; }
MaimaiNotesCommonInfo.prototype.getMarkerSize = function() { return this.setting != null ? this.setting.getMarkerSize() : this.markerSize; }
MaimaiNotesCommonInfo.prototype.getSlideMarkerSizeAdaptation = function() { return this.setting != null ? this.setting.isSlideMarkerSizeAdaptation() : this.slideMarkerSizeAdaptation; }
MaimaiNotesCommonInfo.prototype.getJudgeTimer = function() { return this.judgeTimer; }
MaimaiNotesCommonInfo.prototype.getStarRotation = function() { return this.setting != null ? this.setting.getStarRotation() : this.starRotation; }
MaimaiNotesCommonInfo.prototype.getAngulatedHold = function() { return this.setting != null ? this.setting.isAngulatedHold() : this.angulatedHold; }
MaimaiNotesCommonInfo.prototype.getTimeOffset = function() { return this.config != null ? this.config.getAnswerSoundOffset() : this.timeOffset; }
MaimaiNotesCommonInfo.prototype.getGameStartTime = function() { return this.gameStartTime; }
MaimaiNotesCommonInfo.prototype.isAutoDeleteSlideMarker = function() { return this.setting != null ? this.setting.isSlideMarkerAutoDelete() : this.autoDeleteSlideMarker; }

function MaimaiNotesCommonInfoC2(judgeTimer, sensor, config, setting, firstBPM) {
	this.sensor = sensor;
	this.judgeTimer = judgeTimer;
	this.gameStartTime = (60.0 / firstBPM) * 4.0 + RhythmActionJudgeNote.START_COUNT_START_TIME;
	this.setting = setting;
	this.config = config;
}
MaimaiNotesCommonInfoC2.prototype = new MaimaiNotesCommonInfo(null, null, 0, 0, false, false, false, false, 0, 0);

MaimaiNotesCommonInfo.prototype.release = function() {
	this.judgeTimer = null;
	this.sensor = null;
	this.config = null;
	this.setting = null;
}
