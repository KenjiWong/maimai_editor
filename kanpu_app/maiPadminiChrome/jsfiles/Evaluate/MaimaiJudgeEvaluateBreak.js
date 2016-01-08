//==================
// MaimaiJudgeEvaluateBreak
//==================

function MaimaiJudgeEvaluateBreak(Manager,
								P2600Rate, P2550Rate, P2500Rate, P2000Rate, P1500Rate, P1250Rate, P1000Rate,
								//絶対値で入れる。
								InP1000FastTime, InP1250FastTime, InP1500FastTime, InP2000FastTime, InP2500FastTime, InP2550FastTime, InP2600Time,
								InP2550LateTime, InP2500LateTime, InP2000LateTime, InP1500LateTime, InP1250LateTime, InP1000LateTime) {
	MaimaiJudgeEvaluateB.call(this, Manager);
	this.p2600 = new MaimaiJudgeEvaluateInfo(P2600Rate);
	this.p2550 = new MaimaiJudgeEvaluateInfo(P2550Rate);
	this.p2500 = new MaimaiJudgeEvaluateInfo(P2500Rate);
	this.p2000 = new MaimaiJudgeEvaluateInfo(P2000Rate);
	this.p1500 = new MaimaiJudgeEvaluateInfo(P1500Rate);
	this.p1250 = new MaimaiJudgeEvaluateInfo(P1250Rate);
	this.p1000 = new MaimaiJudgeEvaluateInfo(P1000Rate);
	this.inP2600Time = Math.abs(InP2600Time);
	this.inP2550FastTime = Math.abs(InP2550FastTime);
	this.inP2550LateTime = Math.abs(InP2550LateTime);
	this.inP2500FastTime = Math.abs(InP2500FastTime);
	this.inP2500LateTime = Math.abs(InP2500LateTime);
	this.inP2000FastTime = Math.abs(InP2000FastTime);
	this.inP2000LateTime = Math.abs(InP2000LateTime);
	this.inP1500FastTime = Math.abs(InP1500FastTime);
	this.inP1500LateTime = Math.abs(InP1500LateTime);
	this.inP1250FastTime = Math.abs(InP1250FastTime);
	this.inP1250LateTime = Math.abs(InP1250LateTime);
	this.inP1000FastTime = Math.abs(InP1000FastTime);
	this.inP1000LateTime = Math.abs(InP1000LateTime);
}

MaimaiJudgeEvaluateBreak.prototype = new MaimaiJudgeEvaluateB(this.manager);

MaimaiJudgeEvaluateBreak.prototype.evaluate = function(timing, note) {
	if (timing >= -this.inP1000FastTime && timing < -this.inP1250FastTime) {
		this.p1000FastCallBack(note);
	}
	else if (timing >= -this.inP1250FastTime && timing < -this.inP1500FastTime) {
		this.p1250FastCallBack(note);
	}
	else if (timing >= -this.inP1500FastTime && timing < -this.inP2000FastTime) {
		this.p1500FastCallBack(note);
	}
	else if (timing >= -this.inP2000FastTime && timing < -this.inP2500FastTime) {
		this.p2000FastCallBack(note);
	}
	else if (timing >= -this.inP2500FastTime && timing < -this.inP2550FastTime) {
		this.p2500FastCallBack(note);
	}
	else if (timing >= -this.inP2550FastTime && timing < -this.inP2600Time) {
		this.p2550FastCallBack(note);
	}
	else if (timing >= -this.inP2600Time && timing <= this.inP2600Time) {
		this.p2600CallBack(note);
	}
	else if (timing > this.inP2600Time && timing <= this.inP2550LateTime) {
		this.p2550LateCallBack(note);
	}
	else if (timing > this.inP2550LateTime && timing <= this.inP2500LateTime) {
		this.p2500LateCallBack(note);
	}
	else if (timing > this.inP2500LateTime && timing <= this.inP2000LateTime) {
		this.p2000LateCallBack(note);
	}
	else if (timing > this.inP2000LateTime && timing <= this.inP1500LateTime) {
		this.p1500LateCallBack(note);
	}
	else if (timing > this.inP1500LateTime && timing <= this.inP1250LateTime) {
		this.p1250LateCallBack(note);
	}
	else if (timing > this.inP1250LateTime && timing <= this.inP1000LateTime) {
		this.p1000LateCallBack(note);
	}
}

MaimaiJudgeEvaluateBreak.prototype.p1000FastCallBack = function(note) {
	this.getManager().SePlay(SEName.BREAKNONPERFECT);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P1000F, note.getButtonID());
	this.p1000.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.FASTGOOD);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateBreak.prototype.p1250FastCallBack = function(note) {
	this.getManager().SePlay(SEName.BREAKNONPERFECT);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P1250F, note.getButtonID());
	this.p1250.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.FASTGREAT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateBreak.prototype.p1500FastCallBack = function(note) {
	this.getManager().SePlay(SEName.BREAKNONPERFECT);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P1500F, note.getButtonID());
	this.p1500.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.FASTGREAT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateBreak.prototype.p2000FastCallBack = function(note) {
	this.getManager().SePlay(SEName.BREAKNONPERFECT);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P2000F, note.getButtonID());
	this.p2000.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.FASTGREAT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateBreak.prototype.p2500FastCallBack = function(note) {
	this.getManager().SePlay(SEName.BREAK2500);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P2500F, note.getButtonID());
	this.p2500.count++;
	this.getManager().addCombo();
	this.getManager().addPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.PERFECT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateBreak.prototype.p2550FastCallBack = function(note) {
	this.getManager().SePlay(SEName.BREAK2500);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P2550F, note.getButtonID());
	this.p2550.count++;
	this.getManager().addCombo();
	this.getManager().addPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.PERFECT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateBreak.prototype.p2600CallBack = function(note) {
	this.getManager().SePlay(SEName.BREAK2600);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P2600, note.getButtonID());
	this.p2600.count++;
	this.getManager().addCombo();
	this.getManager().addPCombo();
	this.getManager().addBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.PERFECT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateBreak.prototype.p2550LateCallBack = function(note) {
	this.getManager().SePlay(SEName.BREAK2500);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P2550L, note.getButtonID());
	this.p2550.count++;
	this.getManager().addCombo();
	this.getManager().addPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.PERFECT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateBreak.prototype.p2500LateCallBack = function(note) {
	this.getManager().SePlay(SEName.BREAK2500);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P2500L, note.getButtonID());
	this.p2500.count++;
	this.getManager().addCombo();
	this.getManager().addPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.PERFECT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateBreak.prototype.p2000LateCallBack = function(note) {
	this.getManager().SePlay(SEName.BREAKNONPERFECT);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P2000L, note.getButtonID());
	this.p2000.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.LATEGREAT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateBreak.prototype.p1500LateCallBack = function(note) {
	this.getManager().SePlay(SEName.BREAKNONPERFECT);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P1500L, note.getButtonID());
	this.p1500.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.LATEGREAT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateBreak.prototype.p1250LateCallBack = function(note) {
	this.getManager().SePlay(SEName.BREAKNONPERFECT);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P1250L, note.getButtonID());
	this.p1250.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.LATEGREAT);
	this.getManager().setDrawableCommentNote(note);
}

MaimaiJudgeEvaluateBreak.prototype.p1000LateCallBack = function(note) {
	this.getManager().SePlay(SEName.BREAKNONPERFECT);
	this.getManager().showEvaluate_Break(DrawableEvaluateBreakType.P1000L, note.getButtonID());
	this.p1000.count++;
	this.getManager().addCombo();
	this.getManager().resetPCombo();
	this.getManager().resetBPCombo();
	note.setJudged(true);
	note.visible = false;
	note.setSyncEvaluate(SyncEvaluate.LATEGOOD);
	this.getManager().setDrawableCommentNote(note);
}


MaimaiJudgeEvaluateBreak.prototype.getPerfectCount = function() { return this.p2600.count + this.p2550.count + this.p2500.count; }

MaimaiJudgeEvaluateBreak.prototype.getPerfectScore = function() { return this.p2600.score() + this.p2550.score() + this.p2500.score(); }

MaimaiJudgeEvaluateBreak.prototype.getGreatCount = function() { return this.p2000.count + this.p1500.count + this.p1250.count; }

MaimaiJudgeEvaluateBreak.prototype.getGreatScore = function() { return this.p2000.score() + this.p1500.score() + this.p1250.score(); }

MaimaiJudgeEvaluateBreak.prototype.getGoodCount = function() { return this.p1000.count; }

MaimaiJudgeEvaluateBreak.prototype.getGoodScore = function() { return this.p1000.score(); }

MaimaiJudgeEvaluateBreak.prototype.getFullScore = function() {
	return (this.getPerfectCount() + this.getGreatCount() + this.getGoodCount() + this.getMissCount()) * this.p2500.rate;
}

MaimaiJudgeEvaluateBreak.prototype.getBFullScore = function() {
	return (this.getPerfectCount() + this.getGreatCount() + this.getGoodCount() + this.getMissCount()) * this.p2600.rate;
}

MaimaiJudgeEvaluateBreak.prototype.getLostScore = function() {
	return  (this.p2500.rate - this.p2550.rate) * this.p2550.count + 
			(this.p2500.rate - this.p2500.rate) * this.p2550.count + 
			(this.p2500.rate - this.p2000.rate) * this.p2000.count + 
			(this.p2500.rate - this.p1500.rate) * this.p1500.count + 
			(this.p2500.rate - this.p1250.rate) * this.p1250.count + 
			(this.p2500.rate - this.p1000.rate) * this.p1000.count + 
			(this.p2500.rate - this.miss.rate) * this.getMissCount();
}

MaimaiJudgeEvaluateBreak.prototype.getBLostScore = function() {
	return  (this.p2600.rate - this.p2550.rate) * this.p2550.count + 
			(this.p2600.rate - this.p2500.rate) * this.p2550.count + 
			(this.p2600.rate - this.p2000.rate) * this.p2000.count + 
			(this.p2600.rate - this.p1500.rate) * this.p1500.count + 
			(this.p2600.rate - this.p1250.rate) * this.p1250.count + 
			(this.p2600.rate - this.p1000.rate) * this.p1000.count + 
			(this.p2600.rate - this.miss.rate) * this.getMissCount();
}
