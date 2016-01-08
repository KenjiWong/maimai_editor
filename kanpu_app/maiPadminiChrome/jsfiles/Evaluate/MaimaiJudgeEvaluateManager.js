//=======================
//  MaimaiJudgeEvaluateManager
//=======================
function MaimaiJudgeEvaluateManager(_judgeTimer, _notes, _sensor, _config, _setting, _seManager, _firstBPM) {
	RhythmActionJudgeNote.call(this, _judgeTimer, _notes, _firstBPM);
	this.config = _config;
	this.setting = _setting;
	this.seManager = _seManager;

	this.combo = 0;
	this.maxCombo = 0;
	this.achievementScore = 0; //SSスコア
	this.notesCount = 0;
	this.theoreticalScore = 0; //理論値
	this.pcombo = 0; //パーフェクトのつなぎ
	this.bpcombo = 0; //理論値のつなぎ
	
	//毎拍処理メソッド用変数群。
	this.bpm = _firstBPM;
	this.beatCnt = 0; //譜面再生前からカウントアップ
	this.beatCntAfterStartPosition = 0; //譜面再生開始直後からカウントアップ
	this.nBuOnp = 4; //何分音符毎に呼ぶか
	this.startBeatSoundEnabled = true; //falseで鳴らさないようにする
	
	//ノートコメント描画用ノート
	this.drawableCommentNote = null;;

	//スライドアンサーサウンド用リストとサーチャー
	this.searchFromIndexInSlideStartTimesOfTiming;
	this.slideNotesList = [];

	//スライドパターンを更新したいセット
	this.nextSlidePatternUpdateSet = [];

	//スライドとスライドパターン判定用リスト
	this.searchFromIndexInJustTimesForSlideAndPattern;
	this.slideAndPatternNotes = [];

	//オートモード用インデックス
	this.djAutoIndex = 0;
	
	
	this.createSlideNoteList();
	this.createSlideAndPatternNotes();
	this.resetSearchIndex();
	
	this.drawableEvaluate = []; 
	for (var i = 0; i < 50; i++) { // 適当に50個用意した。使いまわす。
		this.drawableEvaluate[i] = new DrawableEvaluate(_sensor, this.setting);
	}
	this.drawableEvaluateIndex = 0;
	this.maimaiJudgeEvaluateTap = new MaimaiJudgeEvaluateTap(this, 500, 400, 250,
		0.15, 0.125, 0.09, 0.2, MaimaiJudgeEvaluateManager.missTimeBank(NoteType.CIRCLETAP));
	this.maimaiJudgeEvaluateHoldHead = new MaimaiJudgeEvaluateHoldHead(this, this.setting, 1000, 800, 500,
		0.15, 0.125, 0.09, 0.2, MaimaiJudgeEvaluateManager.missTimeBank(NoteType.HOLDHEAD));
	this.maimaiJudgeEvaluateHoldFoot = new MaimaiJudgeEvaluateHoldFoot(this, this.maimaiJudgeEvaluateHoldHead,
		0.2);
	this.maimaiJudgeEvaluateSlide = new MaimaiJudgeEvaluateSlide(this, this.maimaiJudgeEvaluateTap, 1500, 1200, 750,
		0.425, 0.25, 0.425, MaimaiJudgeEvaluateManager.missTimeBank(NoteType.SLIDE));
	this.maimaiJudgeEvaluateSlidePattern = new MaimaiJudgeEvaluateSlidePattern(this, this.maimaiJudgeEvaluateSlide);
	this.maimaiJudgeEvaluateBreak = new MaimaiJudgeEvaluateBreak(this, 2600, 2550, 2500, 2000, 1500, 1250, 1000,
		//	InP1000FastTime, InP1250FastTime, InP1500FastTime, InP2000FastTime, InP2500FastTime, InP2550FastTime, InP2600Time, InP2550LateTime, InP2500LateTime, InP2000LateTime, InP1500LateTime, InP1250LateTime, InP1000LateTime
		0.15, 0.1375, 0.125, 0.1125, 0.09, 0.063, 0.036, 0.063, 0.09, 0.15, 0.2, 0.25, MaimaiJudgeEvaluateManager.missTimeBank(NoteType.BREAK));
	
}
MaimaiJudgeEvaluateManager.prototype = new RhythmActionJudgeNote(this.judgeTimer, this.notes, this.firstBPM);

MaimaiJudgeEvaluateManager.prototype.getConfig = function() { return this.config; }
MaimaiJudgeEvaluateManager.prototype.getSetting = function() { return this.setting; }
MaimaiJudgeEvaluateManager.prototype.getSeManager = function() { return this.seManager; }

MaimaiJudgeEvaluateManager.START_SOUND_BEAT_MAX = 4; //最初の何拍だけカウント音を鳴らすか
MaimaiJudgeEvaluateManager.prototype.startBeatSoundOff = function() { this.startBeatSoundEnabled = false; } //鳴らさないようにする
MaimaiJudgeEvaluateManager.prototype.setSearchFromIndexInSlideStartTimesOfTiming = function(setIndex) { this.searchFromIndexInSlideStartTimesOfTiming = setIndex; }
MaimaiJudgeEvaluateManager.prototype.setDrawableCommentNote = function(note) { this.drawableCommentNote = note; }
MaimaiJudgeEvaluateManager.prototype.getBeatCount = function() { return this.beatCnt; }
MaimaiJudgeEvaluateManager.prototype.getBeatCountAfterStartPosition = function() { return this.beatCntAfterStartPosition; }

MaimaiJudgeEvaluateManager.missTimeBank = function(type) {
	if (type == NoteType.CIRCLETAP ||
		type == NoteType.STARTAP)
		return 0.3;
	else if (type == NoteType.HOLDHEAD)
		return 0.3;
	else if (type == NoteType.HOLDFOOT) //押しっぱなしgood時間
		return 0.3;
	else if (type == NoteType.SLIDE)
		return 0.6;
	else if (type == NoteType.BREAK)
		return 0.3;
	return 0.0;
}

//評価の本質
MaimaiJudgeEvaluateManager.prototype.timingEvaluate = function(timing, note) {
	var mNote = note;
	if (mNote.getNoteType() == NoteType.CIRCLETAP ||
		mNote.getNoteType() == NoteType.STARTAP) {
		this.maimaiJudgeEvaluateTap.evaluate(timing, mNote);
	}
	else if (mNote.getNoteType() == NoteType.HOLDHEAD) {
		this.maimaiJudgeEvaluateHoldHead.evaluate(timing, mNote);
	}
	else if (mNote.getNoteType() == NoteType.HOLDFOOT) {
		this.maimaiJudgeEvaluateHoldFoot.evaluate(timing, mNote);
	}
	else if (mNote.getNoteType() == NoteType.SLIDE) {
		this.maimaiJudgeEvaluateSlide.evaluate(timing, mNote);
	}
	else if (mNote.getNoteType() == NoteType.SLIDEPATTERN) {
		this.maimaiJudgeEvaluateSlidePattern.evaluate(timing, mNote);
	}
	else if (mNote.getNoteType() == NoteType.BREAK) {
		this.maimaiJudgeEvaluateBreak.evaluate(timing, mNote);
	}
}

//ミスだったときの自動処理
MaimaiJudgeEvaluateManager.prototype.missProc = function(note) {
	RhythmActionJudgeNote.prototype.missProc.call(this, note);
	var mNote = note;
	if (mNote.getNoteType() == NoteType.CIRCLETAP ||
		mNote.getNoteType() == NoteType.STARTAP ||
		mNote.getNoteType() == NoteType.BREAK) {
		this.maimaiJudgeEvaluateTap.missCallBack(mNote);
	}
	else if (mNote.getNoteType() == NoteType.SLIDE) {
		//スライドは5つのうち4つ判定できてたらMISSではなくLateGood。
		var sNote = mNote;
		if (!sNote.isEvaluated()) {
			if (sNote.isLateGood()) {
				this.maimaiJudgeEvaluateSlide.lateGoodCallBack(mNote, true);
			}
			else {
				this.maimaiJudgeEvaluateSlide.missCallBack(mNote);
			}
		}
	}
	else if (mNote.getNoteType() == NoteType.SLIDEPATTERN) {
		//スライドヘッドが既に評価済みであれば評価しない
		var spNote = mNote;
		if (!spNote.getParent().isEvaluated()) {
			if (spNote.getParent().isLateGood()) {
				this.maimaiJudgeEvaluateSlide.lateGoodCallBack(mNote, true);
			}
			else {
				this.maimaiJudgeEvaluateSlide.missCallBack(mNote);
			}
		}
	}
	else if (mNote.getNoteType() == NoteType.HOLDFOOT) {
		//ホールドフットはミスにならない。
		if (mNote.getRelativeNote().pushed) { //ヘッドが押せていればグドる。
			this.maimaiJudgeEvaluateHoldFoot.lateCallBack(mNote);
		}
	}
	else if (mNote.getNoteType() == NoteType.HOLDHEAD) {
		//ホールドヘッドのミスはすぐに非表示にする。（他のノートは消さずに過ぎ去ればそのうち消える(消す処理を入れてる)。）
		this.maimaiJudgeEvaluateHoldHead.missCallBack(mNote);
	}
}

//判定時間ピッタリに行うこと
MaimaiJudgeEvaluateManager.prototype.justTimingProc = function(note) {
	var mNote = note;
	if (mNote.getNoteType() != NoteType.SLIDE && mNote.getNoteType() != NoteType.SLIDEPATTERN) {
		//AnswerSoundがBasisまたはBasis+なら、ANSWERSOUNDを鳴らす。
		if (this.getConfig().getAnswerSoundEnabled() == AnswerSoundInfomation.BASIS ||
			this.getConfig().getAnswerSoundEnabled() == AnswerSoundInfomation.BASISPLUS) {
			this.getSeManager().play(SEName.ANSWERSOUND);
		}
		//SpecialまたはSpecial+なら、ノートタイプによって音を分ける
		else if (this.getConfig().getAnswerSoundEnabled() == AnswerSoundInfomation.SPECIAL ||
				 this.getConfig().getAnswerSoundEnabled() == AnswerSoundInfomation.SPECIALPLUS) {
			if (mNote.getNoteType() == NoteType.CIRCLETAP ||
				mNote.getNoteType() == NoteType.HOLDHEAD ||
				mNote.getNoteType() == NoteType.STARTAP) {
				this.getSeManager().play(SEName.SIMAI_TAP);
			}
			else if (mNote.getNoteType() == NoteType.HOLDFOOT) {
				this.getSeManager().play(SEName.SIMAI_HOLDFOOT);
			}
			else if (mNote.getNoteType() == NoteType.BREAK) {
				this.getSeManager().play(SEName.SIMAI_BREAK);
			}
		}
	}
}

//毎拍のタイミングで何か処理したいときに、毎ループ呼び出す。
MaimaiJudgeEvaluateManager.prototype.autoBeatTimningProc = function()
{
	if (this.getJudgeTimer().getGameTime() >= (60.0 / this.bpm * (4.0 / this.nBuOnp)) * this.beatCnt + RhythmActionJudgeNote.START_COUNT_START_TIME) { 
		this.beatTimingProc();
		this.beatCnt++;
		if (this.getJudgeTimer().getGameTime() >= this.getGameStartTime()) {
			this.beatCntAfterStartPosition++;
		}
	}
}

//毎拍呼び出されるメソッド
MaimaiJudgeEvaluateManager.prototype.beatTimingProc = function()
{
	//最初の4拍だけカウント音を鳴らす
	if (this.getBeatCount() < MaimaiJudgeEvaluateManager.START_SOUND_BEAT_MAX) {
		if (this.startBeatSoundEnabled && this.getConfig().getStartCountEnabled()) {
			this.getSeManager().play(SEName.STARTCOUNT);
		}
	}
}

//AnswerSoundのBasis+やSpecial+を追加するにあたって、スライドノートのリストが必要になった。ので作る。
MaimaiJudgeEvaluateManager.prototype.createSlideNoteList = function() {
	var creatableSlideNotesList = [];
	var notesLength = this.getNotesLength();
	for (var i = 0; i < notesLength; i++) {
		var mNote = this.getNote(i);
		if (mNote.getNoteType() == NoteType.SLIDE) {
			creatableSlideNotesList.push(mNote);
		}
	}
	this.slideNotesList = creatableSlideNotesList;
}

//スライドとスライドパターンの判定用リスト
MaimaiJudgeEvaluateManager.prototype.createSlideAndPatternNotes = function() {
	var creatableSlideNotesList = [];
	var notesLength = this.getNotesLength();
	for (var i = 0; i < notesLength; i++) {
		var mNote = this.getNote(i);
		if (mNote.getNoteType() == NoteType.SLIDE || mNote.getNoteType() == NoteType.SLIDEPATTERN) {
			creatableSlideNotesList.push(mNote);
		}
	}
	this.slideAndPatternNotes = creatableSlideNotesList;
}

MaimaiJudgeEvaluateManager.prototype.autoSlideStartTimingProc = function() {
	var notesLength = this.slideNotesList.length;
	while (this.searchFromIndexInSlideStartTimesOfTiming < notesLength) {
		var slNote = this.slideNotesList[this.searchFromIndexInSlideStartTimesOfTiming];
		if (this.getJudgeTimer().getGameTime() >= slNote.getSlideStartSoundTime() + this.getGameStartTime()) {
			this.slideStartTimingProc(slNote);
		}
		else {
			break;
		}
		this.searchFromIndexInSlideStartTimesOfTiming++;
	}
}

MaimaiJudgeEvaluateManager.prototype.slideStartTimingProc = function(note) {
	//BASIS+かSPECIAL+なら、鳴らす。
	if (this.getConfig().getAnswerSoundEnabled() == AnswerSoundInfomation.BASISPLUS ||
		this.getConfig().getAnswerSoundEnabled() == AnswerSoundInfomation.SPECIALPLUS) {
		this.getSeManager().play(SEName.SIMAI_SLIDE);
	}
}

//評価の描画をスタートさせて次の評価描画インスタンスで待機する
MaimaiJudgeEvaluateManager.prototype.showEvaluate_TapHold = function(drawableEvaluateType, ButtonID) {
	this.drawableEvaluate[this.drawableEvaluateIndex].start_taphold(drawableEvaluateType, ButtonID);
	this.drawableEvaluateIndex++;
	this.drawableEvaluateIndex %= this.drawableEvaluate.length;
}
MaimaiJudgeEvaluateManager.prototype.showEvaluate_Slide = function(drawableEvaluateType, location, deg) {
	this.drawableEvaluate[this.drawableEvaluateIndex].start_slide(drawableEvaluateType, location, deg);
	this.drawableEvaluateIndex++;
	this.drawableEvaluateIndex %= this.drawableEvaluate.length;
}
MaimaiJudgeEvaluateManager.prototype.showEvaluate_Break = function(drawableEvaluateType, ButtonID) {
	this.drawableEvaluate[this.drawableEvaluateIndex].start_break(drawableEvaluateType, ButtonID);
	this.drawableEvaluateIndex++;
	this.drawableEvaluateIndex %= this.drawableEvaluate.length;
}
//ホールドヘッドのエフェクト。ボタンを離したり押しっぱなしGOODなんかでエフェクトを止める必要があるので、所持できるようにする
MaimaiJudgeEvaluateManager.prototype.showHoldHeadEffect = function(drawableEvaluateType, ButtonID) {
	var ret = this.drawableEvaluate[this.drawableEvaluateIndex];
	ret.holdHeadEffectStart(drawableEvaluateType, ButtonID);
	this.drawableEvaluateIndex++;
	this.drawableEvaluateIndex %= this.drawableEvaluate.length;
	return ret;
}
//ノートのコメント描画 まぁユーザーデバッグ用なので適当に。
//drawableCommentNoteがnullでない限り、ずっと描画する。一定時間経ったら消すとかやりたいなら、その処理を入れた物の中でこれを使えばいいと思う。
MaimaiJudgeEvaluateManager.prototype.drawNoteComment = function(canvas, x, y, font, color) {
	var comment = "--";
	var row = "--";
	if (this.drawableCommentNote != null) {
		comment = this.drawableCommentNote.comment;
		row = this.drawableCommentNote.row;
	}
	canvas.save();
	canvas.font = font;
	canvas.fillStyle = color.toContextString();
	canvas.fillText("TEXT CAMMA:" + comment, x, y);
	canvas.fillText("TEXT ROW:" + row, x, y + 14);
	canvas.restore();
}

//判定描画情報更新
MaimaiJudgeEvaluateManager.prototype.updateDrawableEvaluate = function() {
	for (var i = 0; i < this.drawableEvaluate.length; i++) {
		this.drawableEvaluate[i].resume();
		this.drawableEvaluate[i].update();
	}
}

//スライドパターンを更新したいセットに追加する
MaimaiJudgeEvaluateManager.prototype.nextSlidePatternUpdateSetAdd = function(note) {
	this.nextSlidePatternUpdateSet.push(note);
}
//スライドパターンを更新する(インスタンス作成元でスライドノートをチェックした後に呼び出す)
MaimaiJudgeEvaluateManager.prototype.nextSlidePatternUpdate = function() {
	for (var i = 0; i < this.nextSlidePatternUpdateSet.length; i++) {
		this.nextSlidePatternUpdateSet[i].nextSensor();
		this.nextSlidePatternUpdateSet[i] = null;
	}
	this.nextSlidePatternUpdateSet = [];
}

MaimaiJudgeEvaluateManager.prototype.pauseDrawEvaluate = function() {
	for (var i = 0; i < this.drawableEvaluate.length; i++) {
		this.drawableEvaluate[i].pause();
	}
}

//判定描画
MaimaiJudgeEvaluateManager.prototype.drawEvaluate = function(canvas) {
	//timingEvaluate()でストップウォッチをスタートし、
	//このメソッドで一定時間経ったらストップウォッチをストップしてリセットする。
	//ストップウォッチが動いていたら描画し、そうでなければ描画しない。
	for (var i = 0; i < this.drawableEvaluate.length; i++) {
		this.drawableEvaluate[i].draw(canvas);
	}
}

//画面上部の判定描画
MaimaiJudgeEvaluateManager.prototype.drawEvaluateUpScreen = function(canvas) {
	for (var i = 0; i < this.drawableEvaluate.length; i++) {
		this.drawableEvaluate[i].drawUpScreenCircle(canvas);
	}
}

MaimaiJudgeEvaluateManager.prototype.getPerfectCount = function()
{
	return this.maimaiJudgeEvaluateTap.getPerfectCount() +
		this.maimaiJudgeEvaluateHoldHead.getPerfectCount() +
		this.maimaiJudgeEvaluateSlide.getPerfectCount() +
		this.maimaiJudgeEvaluateBreak.getPerfectCount();
}

MaimaiJudgeEvaluateManager.prototype.getGreatCount = function()
{
	return this.maimaiJudgeEvaluateTap.getGreatCount() +
		this.maimaiJudgeEvaluateHoldHead.getGreatCount() +
		this.maimaiJudgeEvaluateSlide.getGreatCount() +
		this.maimaiJudgeEvaluateBreak.getGreatCount();
}

MaimaiJudgeEvaluateManager.prototype.getGoodCount = function()
{
	return this.maimaiJudgeEvaluateTap.getGoodCount() +
		this.maimaiJudgeEvaluateHoldHead.getGoodCount() +
		this.maimaiJudgeEvaluateSlide.getGoodCount() +
		this.maimaiJudgeEvaluateBreak.getGoodCount();
}

MaimaiJudgeEvaluateManager.prototype.getMissCount = function()
{
	return this.maimaiJudgeEvaluateTap.getMissCount() +
		this.maimaiJudgeEvaluateHoldHead.getMissCount() +
		this.maimaiJudgeEvaluateSlide.getMissCount() +
		this.maimaiJudgeEvaluateBreak.getMissCount();
}

MaimaiJudgeEvaluateManager.prototype.getScore = function() { return this.getTapScore() + this.getHoldScore() + this.getSlideScore() + this.getBreakScore(); }
MaimaiJudgeEvaluateManager.prototype.getTapScore = function() { return this.maimaiJudgeEvaluateTap.getPerfectScore() + this.maimaiJudgeEvaluateTap.getGreatScore() + this.maimaiJudgeEvaluateTap.getGoodScore(); }
MaimaiJudgeEvaluateManager.prototype.getHoldScore = function() { return this.maimaiJudgeEvaluateHoldHead.getPerfectScore() + this.maimaiJudgeEvaluateHoldHead.getGreatScore() + this.maimaiJudgeEvaluateHoldHead.getGoodScore(); }
MaimaiJudgeEvaluateManager.prototype.getSlideScore = function() { return this.maimaiJudgeEvaluateSlide.getPerfectScore() + this.maimaiJudgeEvaluateSlide.getGreatScore() + this.maimaiJudgeEvaluateSlide.getGoodScore(); }
MaimaiJudgeEvaluateManager.prototype.getBreakScore = function() { return this.maimaiJudgeEvaluateBreak.getPerfectScore() + this.maimaiJudgeEvaluateBreak.getGreatScore() + this.maimaiJudgeEvaluateBreak.getGoodScore(); }

MaimaiJudgeEvaluateManager.prototype.getFullScore = function() { return this.maimaiJudgeEvaluateTap.getFullScore() + this.maimaiJudgeEvaluateHoldHead.getFullScore() + this.maimaiJudgeEvaluateSlide.getFullScore() + this.maimaiJudgeEvaluateBreak.getFullScore(); }
MaimaiJudgeEvaluateManager.prototype.getBFullScore = function() { return this.maimaiJudgeEvaluateTap.getFullScore() + this.maimaiJudgeEvaluateHoldHead.getFullScore() + this.maimaiJudgeEvaluateSlide.getFullScore() + this.maimaiJudgeEvaluateBreak.getBFullScore(); }

MaimaiJudgeEvaluateManager.prototype.addCombo = function() {
	this.combo++;
	if (this.combo > this.maxCombo)
		this.maxCombo = this.combo;
}

MaimaiJudgeEvaluateManager.prototype.addPCombo = function() {
	this.pcombo++;
}

MaimaiJudgeEvaluateManager.prototype.addBPCombo = function() {
	this.bpcombo++;
}

MaimaiJudgeEvaluateManager.prototype.resetCombo = function() {
	this.combo = 0;
}

MaimaiJudgeEvaluateManager.prototype.resetPCombo = function() {
	this.pcombo = 0;
}

MaimaiJudgeEvaluateManager.prototype.resetBPCombo = function() {
	this.bpcombo = 0;
}

MaimaiJudgeEvaluateManager.prototype.getCombo = function() { return this.combo; }
MaimaiJudgeEvaluateManager.prototype.getMaxCombo = function() { return this.maxCombo; }
MaimaiJudgeEvaluateManager.prototype.getPCombo = function() { return this.pcombo; }
MaimaiJudgeEvaluateManager.prototype.getBPCombo = function() { return this.bpcombo; }

//AchievementScoreを取得するためには、まずすべての点数獲得対象ノートから得点を計算してやる必要がある。
MaimaiJudgeEvaluateManager.prototype.setAchievementScore = function(notes) {
	this.achievementScore = 0;
	if (notes == null) return;
	var tapcount = this.maimaiJudgeEvaluateTap.perfect.count;
	var slidecount = this.maimaiJudgeEvaluateSlide.perfect.count;
	var breakcount = this.maimaiJudgeEvaluateBreak.p2500.count;
	var breakcount2 = this.maimaiJudgeEvaluateBreak.p2600.count;
	var breakcount3 = this.maimaiJudgeEvaluateBreak.p2550.count;
	var holdcount = this.maimaiJudgeEvaluateHoldHead.perfect.count;
	
	this.maimaiJudgeEvaluateTap.perfect.count = 0;
	this.maimaiJudgeEvaluateSlide.perfect.count = 0;
	this.maimaiJudgeEvaluateBreak.p2500.count = 0;
	this.maimaiJudgeEvaluateBreak.p2600.count = 0;
	this.maimaiJudgeEvaluateBreak.p2550.count = 0;
	this.maimaiJudgeEvaluateHoldHead.perfect.count = 0;
	for (var i = 0; i < notes.length; i++) {
		if (notes[i].getNoteType() == NoteType.CIRCLETAP ||
			notes[i].getNoteType() == NoteType.STARTAP)
			this.maimaiJudgeEvaluateTap.perfect.count++;
		else if (notes[i].getNoteType() == NoteType.HOLDHEAD)
			this.maimaiJudgeEvaluateHoldHead.perfect.count++;
		else if (notes[i].getNoteType() == NoteType.SLIDE)
			this.maimaiJudgeEvaluateSlide.perfect.count++;
		else if (notes[i].getNoteType() == NoteType.BREAK)
			this.maimaiJudgeEvaluateBreak.p2500.count++;
	}
	this.achievementScore = this.maimaiJudgeEvaluateTap.getPerfectScore() + this.maimaiJudgeEvaluateHoldHead.getPerfectScore() +
							this.maimaiJudgeEvaluateSlide.getPerfectScore() + this.maimaiJudgeEvaluateBreak.getPerfectScore();
	this.notesCount = this.maimaiJudgeEvaluateTap.getPerfectCount() + this.maimaiJudgeEvaluateHoldHead.getPerfectCount() +
							this.maimaiJudgeEvaluateSlide.getPerfectCount() + this.maimaiJudgeEvaluateBreak.getPerfectCount();
	
	this.maimaiJudgeEvaluateBreak.p2600.count = this.maimaiJudgeEvaluateBreak.p2500.count;
	this.maimaiJudgeEvaluateBreak.p2500.count = 0;
	this.theoreticalScore = this.maimaiJudgeEvaluateTap.getPerfectScore() + this.maimaiJudgeEvaluateHoldHead.getPerfectScore() +
							this.maimaiJudgeEvaluateSlide.getPerfectScore() + this.maimaiJudgeEvaluateBreak.getPerfectScore();
	
	this.maimaiJudgeEvaluateTap.perfect.count = tapcount;
	this.maimaiJudgeEvaluateSlide.perfect.count = slidecount;
	this.maimaiJudgeEvaluateBreak.p2500.count = breakcount;
	this.maimaiJudgeEvaluateBreak.p2600.count = breakcount2;
	this.maimaiJudgeEvaluateBreak.p2550.count = breakcount3;
	this.maimaiJudgeEvaluateHoldHead.perfect.count = holdcount;
}

//AP Achievement
//--Normal
MaimaiJudgeEvaluateManager.prototype.getAchievementScore = function() { return this.achievementScore; }
MaimaiJudgeEvaluateManager.prototype.getAchievement = function() {
	if (this.getAchievementScore() == 0)
		return 0;
	return (this.getScore() / this.getAchievementScore()) * 100.00;
}
//--Pace
MaimaiJudgeEvaluateManager.prototype.getPaceAchievement = function() {
	if (this.getAchievementScore() == 0)
		return 0;
	var fs = this.getFullScore();
	if (fs > 0) return (this.getScore() / fs) * 100.00;
	else return 0;
}
//--Hazard
MaimaiJudgeEvaluateManager.prototype.getHazardAchievement = function() {
	if (this.getAchievementScore() == 0)
		return 0;
	var lost = this.maimaiJudgeEvaluateTap.getLostScore() + this.maimaiJudgeEvaluateHoldHead.getLostScore() +
				this.maimaiJudgeEvaluateSlide.getLostScore() + this.maimaiJudgeEvaluateBreak.getBLostScore();
	return ((this.getTheoreticalScore() - lost) / this.getAchievementScore()) * 100.00;
}

//FullAP Achievement
//--Normal
MaimaiJudgeEvaluateManager.prototype.getTheoreticalScore = function() { return this.theoreticalScore; }
MaimaiJudgeEvaluateManager.prototype.getTheoreticalAchievement = function() {
	if (this.getTheoreticalScore() == 0)
		return 0;
	return (this.getScore() / this.getTheoreticalScore()) * 100.00;
}
//--Pace
MaimaiJudgeEvaluateManager.prototype.getTheoreticalPaceAchievement = function() {
	if (this.getTheoreticalScore() == 0)
		return 0;
	var fs = this.getBFullScore();
	if (fs > 0) return (this.getScore() / fs) * 100.00;
	else return 0;
}
//--Hazard
MaimaiJudgeEvaluateManager.prototype.getTheoreticalHazardAchievement = function() {
	if (this.getTheoreticalScore() == 0)
		return 0;
	var lost = this.maimaiJudgeEvaluateTap.getLostScore() + this.maimaiJudgeEvaluateHoldHead.getLostScore() +
				this.maimaiJudgeEvaluateSlide.getLostScore() + this.maimaiJudgeEvaluateBreak.getBLostScore();
	return ((this.getTheoreticalScore() - lost) / this.getTheoreticalScore()) * 100.00;
}

MaimaiJudgeEvaluateManager.prototype.isAllPerfect = function() {
	return this.notesCount == this.getPerfectCount();
}

MaimaiJudgeEvaluateManager.prototype.isFullCombo = function() {
	return this.notesCount == this.getPerfectCount() + this.getGreatCount() + this.getGoodCount();
}

MaimaiJudgeEvaluateManager.prototype.SePlay = function(seName) {
	if (this.getSetting().getSoundEffectEnabled() == SoundEffectInfomation.ON ||
		(this.getSetting().getSoundEffectEnabled() == SoundEffectInfomation.BREAKONLY && seName == SEName.BREAK2600)) {
		this.getSeManager().play(seName);
	}
}

//スライドノートおよびスライドパターンノートの判定
//すべてのノートから予め上記2種のノートを抽出しておいてjustTime順に並ばせ、
//判定がまだ、って信号が来るまで検索する
MaimaiJudgeEvaluateManager.prototype.slideActionTimingResult = function(nowtime, actionID) {
	//スライドノートが存在しない場合だってあるから、あるとき。
	if (this.slideAndPatternNotes.length > 0) {
		//まずは『ここから調べる』を求める。
		//ミスの処理なんかで判定済みになっていたら、判定が終わっていない部分まで飛ぶ。
		if (this.slideAndPatternNotes[this.searchFromIndexInJustTimesForSlideAndPattern].isJudged()) {
			for (var i = this.searchFromIndexInJustTimesForSlideAndPattern + 1; i < this.slideAndPatternNotes.length; i++) {
				if (!this.slideAndPatternNotes[i].isJudged()) {
					this.searchFromIndexInJustTimesForSlideAndPattern = i;
					break;
				}
			}
		}
		for (var i = this.searchFromIndexInJustTimesForSlideAndPattern; i < this.slideAndPatternNotes.Length; i++) {
			//ノートが、調べていい時間に達していたら、調べる
			var note = this.slideAndPatternNotes[i];
			//未判定で、アクションが一致したら調べていいノートである。
			if (actionID == note.getActionID() && !note.isJudged()) {
				var timing = nowtime - this.getGameStartTime() - note.getJustTime();
				if (note.getNoteType() == NoteType.SLIDE) {
					var sNote = note;
					if (this.maimaiJudgeEvaluateSlide.isEvaluateStartTime(timing, sNote)) {
						this.timingEvaluate(timing, sNote);
					}
					else { //時間がまだ調べていい時間になっていないならループを抜ける
						break;
					}
				}
				else if (note.getNoteType() == NoteType.SLIDEPATTERN) {
					var spNote = note;
					if (this.maimaiJudgeEvaluateSlidePattern.isEvaluateStartTime(timing, spNote)) {
						this.timingEvaluate(timing, spNote);
					}
					else { //時間がまだ調べていい時間になっていないならループを抜ける
						break;
					}
				}
			}
		}
	}
}
MaimaiJudgeEvaluateManager.prototype.slideActionTimingResult_withoutTime = function(actionID) {
	this.slideActionTimingResult(this.getJudgeTimer().getGameTime(), actionID);
}

//オートモードで何か処理したいときに、毎ループ呼び出す。
MaimaiJudgeEvaluateManager.prototype.djAutoProc = function() {
	var notesLength = this.getNotesLength();
	while (this.djAutoIndex < notesLength) {
		var note = this.getNote(this.djAutoIndex);
		if (this.getJudgeTimer().getGameTime() >= note.getAutoJustTime() + this.getGameStartTime()) {
			if (note.getNoteType() == NoteType.SLIDE) {
				var slNote = note;
				if (!slNote.isJudged()) {
					this.timingEvaluate(0, slNote);
					this.nextSlidePatternUpdate();
				}
				var pattern = slNote.getPattern();
				for (var i = 0; i < pattern.length; i++) {
					var spNote = pattern[i];
					if (!spNote.isJudged()) {
						this.timingEvaluate(0, spNote);
						this.nextSlidePatternUpdate();
					}
				}
			}
			else if (note.getNoteType() != NoteType.SLIDEPATTERN) {
				if (!note.isJudged()) {
					this.timingEvaluate(0, note);
				}
			}
		}
		else {
			break;
		}
		this.djAutoIndex++;
	}
}

//インデックスをセットしてそのインデックスのノートをパーフェクト扱いにして得点を加算する
MaimaiJudgeEvaluateManager.prototype.setDjAutoIndexAndSetPerfect = function(setIndex) {
	this.djAutoIndex = setIndex;
	var note = this.getNote(this.djAutoIndex);
	if (note.getNoteType() == NoteType.CIRCLETAP ||
		note.getNoteType() == NoteType.STARTAP) {
		this.maimaiJudgeEvaluateTap.perfect.count++;
		this.addCombo();
		this.addPCombo();
		this.addBPCombo();
	}
	else if (note.getNoteType() == NoteType.HOLDHEAD) {
		this.maimaiJudgeEvaluateHoldHead.perfect.count++;
		this.addCombo();
		this.addPCombo();
		this.addBPCombo();
	}
	else if (note.getNoteType() == NoteType.SLIDE) {
		this.maimaiJudgeEvaluateSlide.perfect.count++;
		this.addCombo();
		this.addPCombo();
		this.addBPCombo();
	}
	else if (note.getNoteType() == NoteType.BREAK) {
		this.maimaiJudgeEvaluateBreak.p2600.count++;
		this.addCombo();
		this.addPCombo();
		this.addBPCombo();
	}
}

MaimaiJudgeEvaluateManager.prototype.resetSearchIndex = function() {
	RhythmActionJudgeNote.prototype.resetSearchIndex.call(this);
	this.searchFromIndexInJustTimesForSlideAndPattern = 0;
	this.searchFromIndexInSlideStartTimesOfTiming = 0;
	this.djAutoIndex = 0;
}

MaimaiJudgeEvaluateManager.prototype.release = function() {
	RhythmActionJudgeNote.prototype.release.call(this);

	this.drawableCommentNote = null;
	if (this.slideNotesList != null) {
		for (var i = 0; i < this.slideNotesList.length; i++) {
			this.slideNotesList[i] = null;
		}
	}
	if (this.slideAndPatternNotes != null) {
		for (var i = 0; i < this.slideAndPatternNotes.length; i++) {
			this.slideAndPatternNotes[i] = null;
		}
	}
	if (this.nextSlidePatternUpdateSet != null) {
		for (var i = 0; i < this.nextSlidePatternUpdateSet.length; i++) {
			this.nextSlidePatternUpdateSet[i] = null;
		}
		this.nextSlidePatternUpdateSet = null;
	}
	this.maimaiJudgeEvaluateTap = null;
	this.config = null;
	this.seManager = null;
	this.maimaiJudgeEvaluateTap = null;
	this.maimaiJudgeEvaluateHoldHead = null;
	this.maimaiJudgeEvaluateHoldFoot = null;
	this.maimaiJudgeEvaluateSlide = null;
	this.maimaiJudgeEvaluateSlidePattern = null;
	this.maimaiJudgeEvaluateBreak = null;

	if (this.drawableEvaluate != null) {
		for (var i = 0; i < this.drawableEvaluate.length; i++) {
			if (this.drawableEvaluate[i] != null) {
				this.drawableEvaluate[i].destroy();
				this.drawableEvaluate[i] = null;
			}
		}
		this.drawableEvaluate = null;
	}
}

