//==================
// MaimaiJudgeEvaluateInfo
//==================

function MaimaiJudgeEvaluateInfo(Rate) {
	this.count = 0;
	this.rate = Rate;
}

MaimaiJudgeEvaluateInfo.prototype.score = function() { return this.count * this.rate; }
