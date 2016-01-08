//=========================
// RhythmActionNote
//=========================
function RhythmActionNote(UniqueID, JustTime, MissTime, ActionID) {
	//ノートのユニークID
	this.uniqueId = UniqueID;
	//JUSTの判定時間
	this.justTime = JustTime;
	//MISSの判定時間。justTimeからの相対値。0以下でミス判定しない。
	this.missTime = MissTime;
	//判定済みフラグ
	this.judged = false;
	//成功判定になるためのアクション
	this.actionID = ActionID;
}

//アンサーサウンドが鳴る時間
RhythmActionNote.prototype.getSoundTime = function() {
	return this.justTime;
}

//判定や移動完了の時間
RhythmActionNote.prototype.getJustTime = function() {
	return this.justTime + this.getTimeOffset();
}

RhythmActionNote.prototype.getMissTime = function() {
	return this.missTime;
}

RhythmActionNote.prototype.isJudged = function() {
	return this.judged;
}

RhythmActionNote.prototype.setJudged = function(value) {
	this.judged = value;
}

RhythmActionNote.prototype.getActionID = function() {
	return this.actionID;
}

RhythmActionNote.prototype.getUniqueID = function() {
	return this.uniqueId;
}

//アンサーサウンドなどによるタイミングオフセット オーバーライドで指定する
RhythmActionNote.prototype.getTimeOffset = function() {
	return 0.0;
}

