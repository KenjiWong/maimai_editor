//==================
// MaimaiJudgeEvaluate
//==================

function MaimaiJudgeEvaluate(Manager) {
	this.manager = Manager;
}

MaimaiJudgeEvaluate.prototype.getManager = function() { return this.manager; }
MaimaiJudgeEvaluate.prototype.evaluate = function(timing, note) { dp("evaluate Method is Abstract"); };
MaimaiJudgeEvaluate.prototype.getPerfectCount = function() { dp("getPerfectCount Method is Abstract"); };
MaimaiJudgeEvaluate.prototype.getPerfectScore = function() { dp("getPerfectScore Method is Abstract"); };
MaimaiJudgeEvaluate.prototype.getGreatCount = function() { dp("getGreatCount Method is Abstract"); };
MaimaiJudgeEvaluate.prototype.getGreatScore = function() { dp("getGreatScore Method is Abstract"); };
MaimaiJudgeEvaluate.prototype.getGoodCount = function() { dp("getGoodCount Method is Abstract"); };
MaimaiJudgeEvaluate.prototype.getGoodScore = function() { dp("getGoodScore Method is Abstract"); };
MaimaiJudgeEvaluate.prototype.getMissCount = function() { dp("getPerfectCount Method is Abstract"); };

