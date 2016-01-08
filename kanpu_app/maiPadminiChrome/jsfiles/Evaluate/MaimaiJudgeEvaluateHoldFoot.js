//==================
// MaimaiJudgeEvaluateHoldFoot
//==================

function MaimaiJudgeEvaluateHoldFoot(Manager, HeadEval, InIntrustHeadEvaluateTime) {  
	MaimaiJudgeEvaluate.call(this, Manager);
	this.headEval = HeadEval;
	this.inIntrustHeadEvaluateTime = InIntrustHeadEvaluateTime;
}

MaimaiJudgeEvaluateHoldFoot.prototype = new MaimaiJudgeEvaluate(this.manager);

MaimaiJudgeEvaluateHoldFoot.prototype.evaluate = function(timing, note) {
	if (note.getRelativeNote().pushed) {
		//離すのが早い
		if (timing < -this.inIntrustHeadEvaluateTime) {
			this.earlyPullCallBack(note);
		}
		//タイミングばっちり
		else {
			this.okPullCallBack(note);
		}
		//離すのが遅いのはミス判定に任せる
	}
}

MaimaiJudgeEvaluateHoldFoot.prototype.earlyPullCallBack = function(note)
{
	this.getManager().SePlay(SEName.TAPGOOD);
	this.getManager().showEvaluate_TapHold(DrawableEvaluateTapType.FASTGOOD, note.getButtonID());
	this.headEval.good.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	var fNote = note;
	fNote.getRelativeNote().visible = false;
	//エフェクトが設定されてあれば非表示にする
	if (fNote.getRelativeNote().effectInstance != null) {
		fNote.getRelativeNote().effectInstance.setVisible(false);
		fNote.getRelativeNote().effectInstance = null;
	}
	//シンクはミスにする
	fNote.getRelativeNote().setSyncEvaluate(SyncEvaluate.MISS);
}

MaimaiJudgeEvaluateHoldFoot.prototype.okPullCallBack = function(note)
{
	this.getManager().SePlay(SEName.TAPPERFECT);
	var fNote = note;
	this.getManager().showEvaluate_TapHold(fNote.getRelativeNote().evaluate, note.getButtonID());
	if (fNote.getRelativeNote().evaluate == DrawableEvaluateTapType.PERFECT) {
		this.headEval.perfect.count++;
		this.getManager().addPCombo();
		this.getManager().addBPCombo();
		fNote.getRelativeNote().setSyncEvaluate(SyncEvaluate.PERFECT);
	}
	else if (fNote.getRelativeNote().evaluate == DrawableEvaluateTapType.FASTGREAT || fNote.getRelativeNote().evaluate == DrawableEvaluateTapType.LATEGREAT) {
		this.headEval.great.count++;
		this.getManager().resetPCombo();
		this.getManager().resetBPCombo();
		if (fNote.getRelativeNote().evaluate == DrawableEvaluateTapType.FASTGREAT)
			fNote.getRelativeNote().setSyncEvaluate(SyncEvaluate.FASTGREAT);
		else
			fNote.getRelativeNote().setSyncEvaluate(SyncEvaluate.LATEGREAT);
	}
	else if (fNote.getRelativeNote().evaluate == DrawableEvaluateTapType.FASTGOOD || fNote.getRelativeNote().evaluate == DrawableEvaluateTapType.LATEGOOD) {
		this.headEval.good.count++;
		this.getManager().resetPCombo();
		this.getManager().resetBPCombo();
		if (fNote.getRelativeNote().evaluate == DrawableEvaluateTapType.FASTGOOD)
			fNote.getRelativeNote().setSyncEvaluate(SyncEvaluate.FASTGOOD);
		else
			fNote.getRelativeNote().setSyncEvaluate(SyncEvaluate.LATEGOOD);
	}
	this.getManager().addCombo();
	note.setJudged(true);
	note.visible = false;
	fNote.getRelativeNote().visible = false;
	//エフェクトが設定されてあれば非表示にする
	if (fNote.getRelativeNote().effectInstance != null) {
		fNote.getRelativeNote().effectInstance.setVisible(false);
		fNote.getRelativeNote().effectInstance = null;
	}
}

MaimaiJudgeEvaluateHoldFoot.prototype.lateCallBack = function(note)
{
	this.getManager().SePlay(SEName.TAPGOOD);
	this.getManager().showEvaluate_TapHold(DrawableEvaluateTapType.LATEGOOD, note.getButtonID());
	this.headEval.good.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	var fNote = note;
	fNote.getRelativeNote().visible = false;
	//エフェクトが設定されてあれば非表示にする
	if (fNote.getRelativeNote().effectInstance != null) {
		fNote.getRelativeNote().effectInstance.setVisible(false);
		fNote.getRelativeNote().effectInstance = null;
	}
	//シンクはミスにする
	fNote.getRelativeNote().setSyncEvaluate(SyncEvaluate.MISS);
}


MaimaiJudgeEvaluateHoldFoot.prototype.getPerfectCount = function() { return this.headEval.getPerfectCount(); }

MaimaiJudgeEvaluateHoldFoot.prototype.getPerfectScore = function() { return this.headEval.getPerfectScore(); }

MaimaiJudgeEvaluateHoldFoot.prototype.getGreatCount = function() { return this.headEval.getGreatCount(); }

MaimaiJudgeEvaluateHoldFoot.prototype.getGreatScore = function() { return this.headEval.getGreatScore(); }

MaimaiJudgeEvaluateHoldFoot.prototype.getGoodCount = function() { return this.headEval.getGoodCount(); }

MaimaiJudgeEvaluateHoldFoot.prototype.getGoodScore = function() { return this.headEval.getGoodScore(); }

MaimaiJudgeEvaluateHoldFoot.prototype.getMissCount = function() { return this.headEval.getMissCount(); }


