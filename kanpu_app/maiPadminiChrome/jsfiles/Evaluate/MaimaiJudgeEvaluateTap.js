//==================
// MaimaiJudgeEvaluateTap
//==================

function MaimaiJudgeEvaluateTap(Manager, PerfectRate, GreatRate, GoodRate,
								//絶対値で入れる。
								InEarlyGoodTime, InEarlyGreatTime, InPerfectTime, InLateGreatTime, InLateGoodTime) { 
	MaimaiJudgeEvaluateB.call(this, Manager);
	this.perfect = new MaimaiJudgeEvaluateInfo(PerfectRate);
	this.great = new MaimaiJudgeEvaluateInfo(GreatRate);
	this.good = new MaimaiJudgeEvaluateInfo(GoodRate);
	this.inPerfectTime = Math.abs(InPerfectTime);
	this.inEarlyGreatTime = Math.abs(InEarlyGreatTime);
	this.inLateGreatTime = Math.abs(InLateGreatTime);
	this.inEarlyGoodTime = Math.abs(InEarlyGoodTime);
	this.inLateGoodTime = Math.abs(InLateGoodTime);
}

MaimaiJudgeEvaluateTap.prototype = new MaimaiJudgeEvaluateB(this.manager);

MaimaiJudgeEvaluateTap.prototype.evaluate = function(timing, note) { 
if (timing >= -this.inEarlyGoodTime && timing < -this.inEarlyGreatTime) {
		this.fastGoodCallBack(note);
	}
	else if (timing >= -this.inEarlyGreatTime && timing < -this.inPerfectTime) {
		this.fastGreatCallBack(note);
	}
	else if (timing >= -this.inPerfectTime && timing <= this.inPerfectTime) {
		this.perfectCallBack(note);
	}
	else if (timing > this.inPerfectTime && timing <= this.inLateGreatTime) {
		this.lateGreatCallBack(note);
	}
	else if (timing > this.inLateGreatTime && timing <= this.inLateGoodTime) {
		this.lateGoodCallBack(note);
	}
}

MaimaiJudgeEvaluateTap.prototype.fastGoodCallBack = function(note) {
	this.getManager().SePlay(SEName.TAPGOOD);
	this.getManager().showEvaluate_TapHold(DrawableEvaluateTapType.FASTGOOD, note.getButtonID());
	this.good.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.FASTGOOD);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateTap.prototype.fastGreatCallBack = function(note) {
	this.getManager().SePlay(SEName.TAPGREAT);
	this.getManager().showEvaluate_TapHold(DrawableEvaluateTapType.FASTGREAT, note.getButtonID());
	this.great.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.FASTGREAT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateTap.prototype.perfectCallBack = function(note) {
	this.getManager().SePlay(SEName.TAPPERFECT);
	this.getManager().showEvaluate_TapHold(DrawableEvaluateTapType.PERFECT, note.getButtonID());
	this.perfect.count++;
	this.getManager().addCombo();
	this.getManager().addPCombo();
	this.getManager().addBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.PERFECT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateTap.prototype.lateGreatCallBack = function(note) {
	this.getManager().SePlay(SEName.TAPGREAT);
	this.getManager().showEvaluate_TapHold(DrawableEvaluateTapType.LATEGREAT, note.getButtonID());
	this.great.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.LATEGREAT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateTap.prototype.lateGoodCallBack = function(note) {
	this.getManager().SePlay(SEName.TAPGOOD);
	this.getManager().showEvaluate_TapHold(DrawableEvaluateTapType.LATEGOOD, note.getButtonID());
	this.good.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.LATEGOOD);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateTap.prototype.missCallBack = function(note) {
	MaimaiJudgeEvaluateB.prototype.missCallBack(note);
	note.setSyncEvaluate(SyncEvaluate.MISS);
}

MaimaiJudgeEvaluateTap.prototype.getPerfectCount = function() { return this.perfect.count; }
MaimaiJudgeEvaluateTap.prototype.getPerfectScore = function() { return this.perfect.score(); }
MaimaiJudgeEvaluateTap.prototype.getGreatCount = function() { return this.great.count; }
MaimaiJudgeEvaluateTap.prototype.getGreatScore = function() { return this.great.score(); }
MaimaiJudgeEvaluateTap.prototype.getGoodCount = function() { return this.good.count; }
MaimaiJudgeEvaluateTap.prototype.getGoodScore = function() { return this.good.score(); }

MaimaiJudgeEvaluateTap.prototype.getFullScore = function() {
	return (this.getPerfectCount() + this.getGreatCount() + this.getGoodCount() + this.getMissCount()) * this.perfect.rate;
}

MaimaiJudgeEvaluateTap.prototype.getLostScore = function() {
	return  (this.perfect.rate - this.great.rate) * this.getGreatCount() + 
			(this.perfect.rate - this.good.rate) * this.getGoodCount() + 
			(this.perfect.rate - this.miss.rate) * this.getMissCount();
			
}

//スライドで、判定開始に必要になった。
//使い方：if (timing >= (スライドノート.relativeNote.justTime - getInLateGoodTime() - スライドノート.justTime) && timing < -inEarlyGreatTime)
MaimaiJudgeEvaluateTap.prototype.getInLateGoodTime = function() { return this.inEarlyGoodTime; }


