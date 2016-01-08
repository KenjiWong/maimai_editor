//==================
// MaimaiJudgeEvaluateSlide
//==================

//情報はスライド(これ)が持ち、判定するのはスライドパターンの方

function MaimaiJudgeEvaluateSlide(Manager, JudgeEvaluateStarTap, PerfectRate, GreatRate, GoodRate,
								InEarlyGreatTime, InPerfectTime, InLateGreatTime, InLateGoodTime) { 
	MaimaiJudgeEvaluateB.call(this, Manager);
	this.perfect = new MaimaiJudgeEvaluateInfo(PerfectRate);
	this.great = new MaimaiJudgeEvaluateInfo(GreatRate);
	this.good = new MaimaiJudgeEvaluateInfo(GoodRate);
	this.inPerfectTime = Math.abs(InPerfectTime);
	this.inEarlyGreatTime = Math.abs(InEarlyGreatTime);
	this.inLateGreatTime = Math.abs(InLateGreatTime);
	this.maimaiJudgeEvaluateStarTap = JudgeEvaluateStarTap;
	this.inLateGoodTime = Math.abs(InLateGoodTime);
}

MaimaiJudgeEvaluateSlide.prototype = new MaimaiJudgeEvaluateB(this.manager);

MaimaiJudgeEvaluateSlide.prototype.getMaimaiJudgeEvaluateStarTap = function() { return this.maimaiJudgeEvaluateStarTap; }

MaimaiJudgeEvaluateSlide.prototype.getInPerfectTime = function() { return this.inPerfectTime; }
MaimaiJudgeEvaluateSlide.prototype.getInEarlyGreatTime = function() { return this.inEarlyGreatTime; }
MaimaiJudgeEvaluateSlide.prototype.getInLateGreatTime = function() { return this.inLateGreatTime; }
MaimaiJudgeEvaluateSlide.prototype.getInLateGoodTime = function() { return this.getMaimaiJudgeEvaluateStarTap().getInLateGoodTime(); }

//評価していい時間になっているか。
MaimaiJudgeEvaluateSlide.prototype.isEvaluateStartTime = function(timing, sNote) {
	//スライドのFastGOOD判定は☆の早GOOD判定から有効 というかスライドのなぞる部分も早GOODから。
	return timing >= (sNote.getRelativeNote().getJustTime() - this.getInLateGoodTime() - sNote.getJustTime());
}

MaimaiJudgeEvaluateSlide.prototype.evaluate = function(timing, note) {
	var sNote = note;
	if (this.isEvaluateStartTime(timing, sNote)) {
		//スライドノートは始点なので、さっさとnextSensor更新リストに入れる
		note.setJudged(true);
		this.getManager().nextSlidePatternUpdateSetAdd(sNote);
	}
}

MaimaiJudgeEvaluateSlide.prototype.fastGoodCallBack = function(note) {
	var spNote = note;
	this.sendEvaluate(DrawableEvaluateSlideType.FASTGOOD, spNote);
	this.good.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	spNote.getParent().visible = false;
	spNote.getParent().setEvaluated(true);
	spNote.getParent().setSyncEvaluate(SyncEvaluate.FASTGOOD);
}

MaimaiJudgeEvaluateSlide.prototype.fastGreatCallBack = function(note) {
	var spNote = note;
	this.sendEvaluate(DrawableEvaluateSlideType.FASTGREAT, spNote);
	this.great.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	spNote.getParent().visible = false;
	spNote.getParent().setEvaluated(true);
	spNote.getParent().setSyncEvaluate(SyncEvaluate.FASTGREAT);
}

MaimaiJudgeEvaluateSlide.prototype.perfectCallBack = function(note) {
	var spNote = note;
	this.sendEvaluate(DrawableEvaluateSlideType.JUST, spNote);
	this.perfect.count++;
	this.getManager().addCombo();
	this.getManager().addPCombo();
	this.getManager().addBPCombo();
	note.setJudged(true);
	note.visible = false;
	spNote.getParent().visible = false;
	spNote.getParent().setEvaluated(true);
	spNote.getParent().setSyncEvaluate(SyncEvaluate.PERFECT);
}

MaimaiJudgeEvaluateSlide.prototype.lateGreatCallBack = function(note) {
	var spNote = note;
	this.sendEvaluate(DrawableEvaluateSlideType.LATEGREAT, spNote);
	this.great.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	spNote.getParent().visible = false;
	spNote.getParent().setEvaluated(true);
	spNote.getParent().setSyncEvaluate(SyncEvaluate.LATEGREAT);
}

MaimaiJudgeEvaluateSlide.prototype.lateGoodCallBack = function(note, missCall) {
	var sNote = null;
	if (note.getNoteType() == NoteType.SLIDEPATTERN) {
		var spNote = note;
		sNote = spNote.getParent();
	}
	else if (note.getNoteType() == NoteType.SLIDE)
		sNote = note;

	if (sNote != null) {
		var lastSpNote = sNote.getLastPattern();
		this.sendEvaluate(DrawableEvaluateSlideType.LATEGOOD, lastSpNote);
		this.good.count++; 
		this.getManager().addCombo(); 
		this.getManager().resetPCombo();
		this.getManager().resetBPCombo();
		var pattern = sNote.getPattern();
		for (var i = 0; i < pattern.length; i++) {
			var sp = pattern[i];
			sp.setJudged(true); 
			sp.visible = false; 
		}
		sNote.visible = false;
		sNote.setEvaluated(true);
		if (missCall) sNote.setSyncEvaluate(SyncEvaluate.MISS);
		else sNote.setSyncEvaluate(SyncEvaluate.LATEGOOD);
	}
}

MaimaiJudgeEvaluateSlide.prototype.missCallBack = function(note) { 
	var sNote = null;
	if (note.getNoteType() == NoteType.SLIDEPATTERN) {
		var spNote = note;
		sNote = spNote.getParent();
	}
	else if (note.getNoteType() == NoteType.SLIDE)
		sNote = note;

	if (sNote != null) {
		var lastSpNote = sNote.getLastPattern();
		this.sendEvaluate(DrawableEvaluateSlideType.TOOLATE, lastSpNote);
		this.miss.count++; 
		this.getManager().resetCombo(); 
		this.getManager().resetPCombo(); 
		this.getManager().resetBPCombo();
		var pattern = sNote.getPattern();
		for (var i = 0; i < pattern.length; i++) {
			var sp = pattern[i];
			sp.setJudged(true); 
			sp.visible = false; 
		}
		sNote.visible = false;
		sNote.setEvaluated(true);
		sNote.setSyncEvaluate(SyncEvaluate.MISS);
	}
}

MaimaiJudgeEvaluateSlide.prototype.sendEvaluate = function(evaluate, lastSpNote)
{
	if (!lastSpNote.isCurve()) {
		this.getManager().showEvaluate_Slide(evaluate, lastSpNote.getTargetDrawPlace(), lastSpNote.getImageDegree() - 90.0);
	}
	else {
		var radius = lastSpNote.isOuterCurve() ? lastSpNote.getSensor().getOuterAxis() : lastSpNote.getSensor().getInnerAxis();
		var deg = lastSpNote.getStartDegree() + CircleCalculator.arcDegreeFromArcDistance(radius, lastSpNote.getDistanceDegree()) * lastSpNote.getVector();
		var location = CircleCalculator.pointOnCircle_prd(lastSpNote.getSensor().getCenterPieceAxis(), radius, deg);
		var imgdeg = CircleCalculator.pointToDegree_st(
			CircleCalculator.pointOnCircle_prd(lastSpNote.getSensor().getCenterPieceAxis(), radius, lastSpNote.getStartDegree()), //lastSpNoteの始点
			CircleCalculator.pointOnCircle_prd(lastSpNote.getSensor().getCenterPieceAxis(), radius, deg)) //lastSpNoteの終点
			- 90.0;
		this.getManager().showEvaluate_Slide(evaluate, location, imgdeg);
	}
}

MaimaiJudgeEvaluateSlide.prototype.getPerfectCount = function() { return this.perfect.count; }
MaimaiJudgeEvaluateSlide.prototype.getPerfectScore = function() { return this.perfect.score(); }
MaimaiJudgeEvaluateSlide.prototype.getGreatCount = function() { return this.great.count; }
MaimaiJudgeEvaluateSlide.prototype.getGreatScore = function() { return this.great.score(); }
MaimaiJudgeEvaluateSlide.prototype.getGoodCount = function() { return this.good.count; }
MaimaiJudgeEvaluateSlide.prototype.getGoodScore = function() { return this.good.score(); }

MaimaiJudgeEvaluateSlide.prototype.getFullScore = function() {
	return (this.getPerfectCount() + this.getGreatCount() + this.getGoodCount() + this.getMissCount()) * this.perfect.rate;
}

MaimaiJudgeEvaluateSlide.prototype.getLostScore = function() {
	return  (this.perfect.rate - this.great.rate) * this.getGreatCount() + 
			(this.perfect.rate - this.good.rate) * this.getGoodCount() + 
			(this.perfect.rate - this.miss.rate) * this.getMissCount();
}
