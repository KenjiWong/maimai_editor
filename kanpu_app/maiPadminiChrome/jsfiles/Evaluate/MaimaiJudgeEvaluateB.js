//==================
// MaimaiJudgeEvaluateB
//==================

function MaimaiJudgeEvaluateB(Manager) {
	MaimaiJudgeEvaluate.call(this, Manager);
	this.miss = new MaimaiJudgeEvaluateInfo(0);
}

MaimaiJudgeEvaluateB.prototype = new MaimaiJudgeEvaluate(this.manager);

MaimaiJudgeEvaluateB.prototype.getMissCount = function() { return this.miss.count; }

MaimaiJudgeEvaluateB.prototype.missCallBack = function(note) {
	this.getManager().showEvaluate(DrawableEvaluateTapType.MISS, note.getButtonID());
	this.miss.count++;
	this.getManager().resetCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
}