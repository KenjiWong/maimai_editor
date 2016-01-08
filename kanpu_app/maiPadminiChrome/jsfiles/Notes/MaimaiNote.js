//==================
// MaimaiNote
//==================
function MaimaiNote(NotesInfo, UniqueId, JustTime, MissTime, ActionID) {
	RhythmActionNote.call(this, UniqueId, JustTime, MissTime, ActionID);
	this.visible = true;
	this.alphaPercent = 0.0;
	this.scalePercent = 0.0;
	this.comment = "";
	this.row = 0;
	this.notesInfo = NotesInfo;
}

MaimaiNote.prototype = new RhythmActionNote(this.uniqueId, this.justTime, this.missTime, this.actionID);

MaimaiNote.prototype.getSensor = function() { return this.notesInfo.getSensor(); }
MaimaiNote.prototype.getGuideSpeed = function() { return this.notesInfo.getGuideSpeed(); }
MaimaiNote.prototype.getMarkerSize = function() { return this.notesInfo.getMarkerSize(); }
MaimaiNote.prototype.getSlideMarkerSizeAdaptation = function() { return this.notesInfo.getSlideMarkerSizeAdaptation(); }
MaimaiNote.prototype.getJudgeTimer = function() { return this.notesInfo.getJudgeTimer(); }
MaimaiNote.prototype.getStarRotation = function() { return this.notesInfo.getStarRotation(); }
MaimaiNote.prototype.getAngulatedHold = function() { return this.notesInfo.getAngulatedHold(); }
MaimaiNote.prototype.getTimeOffset = function() { return this.notesInfo.getTimeOffset(); }
MaimaiNote.prototype.getGameStartTime = function() { return this.notesInfo.getGameStartTime(); }
MaimaiNote.prototype.notesDrawStartPointToCenterDistance = function() { return this.notesInfo.notesDrawStartPointToCenterDistance(); }
MaimaiNote.prototype.isAutoDeleteSlideMarker = function() { return this.notesInfo.isAutoDeleteSlideMarker(); }

MaimaiNote.prototype.getNoteType = function() { dp("getNoteType Method is abstract"); }
MaimaiNote.prototype.getVisible = function() { return this.visible; }
MaimaiNote.prototype.getButtonID = function() { dp("getButtonID Method is abstract"); }

//(画像の)回転度合
MaimaiNote.prototype.getImageDegree = function() { return 45.0 * this.getButtonID() + 22.5; }

MaimaiNote.prototype.getAutoJustTime = function() { return this.getJustTime(); }

MaimaiNote.prototype.moveNote = function() { dp("getButtonID Method is abstract"); }
MaimaiNote.prototype.drawNote = function(canvas) { dp("getButtonID Method is abstract"); }
MaimaiNote.prototype.release = function() { 
	if (this.notesInfo != null) this.notesInfo.release();
	this.notesInfo = null; 
}

