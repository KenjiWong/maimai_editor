//==================
// MaimaiSlidePatternNote
//==================

//parent, info, uniqueId, actionId, startDeg, distanceDeg, outer, vec, totalDistance
function MaimaiSlidePatternNote(parent, info, uniqueId, actionId, curve, totalDistance) {
	MaimaiNote.call(this, info, uniqueId, 0, 0, actionId);
	//共通 common
	this.common_parent = parent;
	this.common_curve = curve;
	this.common_totalDistance = totalDistance;
	//曲線 curve_
	this.curve_dStartDeg = 0; //開始角度
	this.curve_distanceDeg = 0; //距離(45度固定) 
	this.curve_outer = false; //外周か内周か
	this.curve_vec = 0; //時計周り(1)か反時計回り(-1)かの方向
}

MaimaiSlidePatternNote.prototype = new MaimaiNote(this.notesInfo, this.uniqueId, this.justTime, this.missTime, this.actionID);
MaimaiSlidePatternNote.prototype.getNoteType = function() { return NoteType.SLIDEPATTERN; }
MaimaiSlidePatternNote.prototype.getParent = function() { return this.common_parent; }
MaimaiSlidePatternNote.prototype.isCurve = function() { return this.common_curve; }
MaimaiSlidePatternNote.prototype.getTotalDistance = function() { return this.common_totalDistance; }
MaimaiSlidePatternNote.prototype.drawNote = function(canvas) { }
MaimaiSlidePatternNote.prototype.getButtonID = function() { return 0; }
MaimaiSlidePatternNote.prototype.moveNote = function() { this.visible = !this.isJudged(); }
MaimaiSlidePatternNote.prototype.getSoundTime = function() { return this.getParent().getSoundTime(); }
MaimaiSlidePatternNote.prototype.getJustTime = function() { return this.getParent().getJustTime(); }
MaimaiSlidePatternNote.prototype.getMissTime = function() { return this.getParent().getMissTime(); }
MaimaiSlidePatternNote.prototype.release = function() { 
	MaimaiNote.prototype.release.apply(this);
	this.common_parent = null;
}



//==================
// MaimaiSlideStraightPatternNote
//==================
function MaimaiSlideStraightPatternNote(parent, info, uniqueId, actionId, drawStart, drawTarget, imgDeg, totalDistance) {
	MaimaiSlidePatternNote.call(this, parent, info, uniqueId, actionId, false, totalDistance);
	//直線 straight_
	this.straight_dStart = drawStart; //始点位置
	this.straight_dTarget = drawTarget; //終点位置
	this.straight_imgDeg = imgDeg; //マーカー画像の回転角度(始点から、先端を終点方向に向ける)
}

MaimaiSlideStraightPatternNote.prototype = new MaimaiSlidePatternNote(this.common_parent, this.notesInfo, this.uniqueId, this.actionID, false, this.totalDistance);
MaimaiSlideStraightPatternNote.prototype.getStartDrawPlace = function() { return this.straight_dStart; }
MaimaiSlideStraightPatternNote.prototype.getTargetDrawPlace = function() { return this.straight_dTarget; }
MaimaiSlideStraightPatternNote.prototype.getImageDegree = function() { return this.straight_imgDeg; }

//==================
// MaimaiSlideCurvePatternNote
//==================
function MaimaiSlideCurvePatternNote(parent, info, uniqueId, actionId, startDeg, distanceDeg, outer, vec, totalDistance) {
	MaimaiSlidePatternNote.call(this, parent, info, uniqueId, actionId, true, totalDistance);
	//曲線 curve_
	this.curve_dStartDeg = startDeg; //開始角度
	this.curve_distanceDeg = distanceDeg; //距離(45度固定) 
	this.curve_outer = outer; //外周か内周か
	this.curve_vec = vec; //時計周り(1)か反時計回り(-1)かの方向
}

MaimaiSlideCurvePatternNote.prototype = new MaimaiSlidePatternNote(this.common_parent, this.notesInfo, this.uniqueId, this.actionID, true, this.totalDistance);
MaimaiSlideCurvePatternNote.prototype.getStartDegree = function() { return this.curve_dStartDeg; }
MaimaiSlideCurvePatternNote.prototype.getDistanceDegree = function() { return this.curve_distanceDeg; }
MaimaiSlideCurvePatternNote.prototype.isOuterCurve = function() { return this.curve_outer; }
MaimaiSlideCurvePatternNote.prototype.getVector = function() { return this.curve_vec; }





