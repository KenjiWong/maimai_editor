//==================
// MaimaiJudgeEvaluateHoldHead
//==================

function MaimaiJudgeEvaluateHoldHead(Manager, setting, PerfectRate, GreatRate, GoodRate,
									 InEarlyGoodTime, InEarlyGreatTime, InPerfectTime, InLateGreatTime, InLateGoodTime) { 
	MaimaiJudgeEvaluateTap.call(this, Manager, PerfectRate, GreatRate, GoodRate, InEarlyGoodTime, InEarlyGreatTime, InPerfectTime, InLateGreatTime, InLateGoodTime);
	this.holdViewEnabled = setting.isHoldViewerEnabled();
}

MaimaiJudgeEvaluateHoldHead.prototype = new MaimaiJudgeEvaluateTap(this.manager);

MaimaiJudgeEvaluateHoldHead.prototype.fastGoodCallBack = function(note) {
	this.getManager().SePlay(SEName.TAPGOOD);
	var hNote = note;
	hNote.evaluate = DrawableEvaluateTapType.FASTGOOD;
	hNote.pushed = true;
	hNote.effectInstance = this.getManager().showHoldHeadEffect(hNote.evaluate, hNote.getButtonID());
	note.setJudged(true);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateHoldHead.prototype.fastGreatCallBack = function(note) {
	this.getManager().SePlay(SEName.TAPGREAT);
	var hNote = note;
	hNote.evaluate = DrawableEvaluateTapType.FASTGREAT;
	hNote.pushed = true;
	hNote.effectInstance = this.getManager().showHoldHeadEffect(hNote.evaluate, hNote.getButtonID());
	note.setJudged(true);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateHoldHead.prototype.perfectCallBack = function(note) {
	this.getManager().SePlay(SEName.TAPPERFECT);
	var hNote = note;
	hNote.evaluate = DrawableEvaluateTapType.PERFECT;
	hNote.pushed = true;
	hNote.effectInstance = this.getManager().showHoldHeadEffect(hNote.evaluate, hNote.getButtonID());
	note.setJudged(true);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateHoldHead.prototype.lateGreatCallBack = function(note) {
	this.getManager().SePlay(SEName.TAPGREAT);
	var hNote = note;
	hNote.evaluate = DrawableEvaluateTapType.LATEGREAT;
	hNote.pushed = true;
	hNote.effectInstance = this.getManager().showHoldHeadEffect(hNote.evaluate, hNote.getButtonID());
	note.setJudged(true);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateHoldHead.prototype.lateGoodCallBack = function(note) {
	this.getManager().SePlay(SEName.TAPGOOD);
	var hNote = note;
	hNote.evaluate = DrawableEvaluateTapType.LATEGOOD;
	hNote.pushed = true;
	hNote.effectInstance = this.getManager().showHoldHeadEffect(hNote.evaluate, hNote.getButtonID());
	note.setJudged(true);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateHoldHead.prototype.missCallBack = function(note) {
	this.this.getManager().showEvaluate_TapHold(DrawableEvaluateTapType.MISS, note.getButtonID());
	miss.count++;
	this.getManager().resetCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	if (!holdViewEnabled) //ミスしたけど表示は消したくないオプションを追加した。trueで消さない処理をする。
		note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.MISS);
	note.getRelativeNote().setJudged(true);
}







