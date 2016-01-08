//=======================
//  RhythmActionJudgeTimerクラス
//=======================

//どのタイマーを使うかのセクション定義
var JudgeTimerSenction = {
	BEFORE_MUSIC_START: 0, //音楽再生前 (待機状態)
	PLAYING_MUSIC: 1, 		//音楽再生中/音楽停止後
	AFTER_MUSIC_END: 2,	//音楽が無い、またはiniTimeが音楽時間を超えている
};

function RhythmActionJudgeTimer(soundManager, _config) {
//function RhythmActionJudgeTimer(_config) {
	this.beforeTimer = new StopWatch(); //音楽再生前のタイマー
	this.detailTimer = new StopWatch(); //音楽再生中、0.3ずつしかCurrentPositionが動かないのでその間の詳細タイマー
	this.afterTimer = new StopWatch(); //音楽再生終了後のタイマー
	this.music = soundManager; //音楽マネージャ
	this.config = _config;
	this.musicLoaded = false; //音楽をロードしたのか
	this.musicPlayed = false; //音楽を再生開始はしたのか
	this.section = JudgeTimerSenction.BEFORE_MUSIC_START; //どのタイマーを使うか
	
	this.seek = 0;					//音楽ファイルの初期シーク (1で1秒)
	this.wait = 0;					//音楽ファイルの再生開始待ち時間 (1で1秒)
	this.oldCurrentPosition = 0;  //音楽ファイルの再生位置保持
	//時間指定
	this.iniTime = 0;				//ゲーム時間のシーク
	this.finishTime = 0;			//ゲーム時間の終了時間
	//総合保持
	this.gameTime = 0;				//ゲーム内時間
	//フラグ
	this.finish = false;				//ゲーム終了時間に達した
	this.pauseflg = false;				//ポーズ中である
	this.onceReseted = false;		//ボタン押したときに初期化終わってないと落ちるから、リセットを一回でもやったか確認フラグ
}

RhythmActionJudgeTimer.prototype.reset = function(_useMusic, _seek, _wait, _iniTime, _finishTime) {
	this.section = JudgeTimerSenction.BEFORE_MUSIC_START;
	this.finish = false;
	this.musicLoaded = false;
	this.musicPlayed = false;
	this.pauseflg = false;
	this.seek = _seek;
	this.wait = _wait + RhythmActionJudgeNote.START_COUNT_START_TIME + this.config.getAnswerSoundOffset();
	this.iniTime = _iniTime;
	this.finishTime = _finishTime;
	this.oldCurrentPosition = -1.0;
	this.gameTime = 0;
	this.beforeTimer.stop();
	this.beforeTimer.reset();
	this.detailTimer.stop();
	this.detailTimer.reset();
	this.afterTimer.stop();
	this.afterTimer.reset();
	
	if (this.iniTime >= this.finishTime) this.finish = true; //iniTimeがfinishTime以上なら
	if (_useMusic) { //musicがあるなら
		this.musicLoaded = true;
		if (this.iniTime >= this.wait) this.section = JudgeTimerSenction.PLAYING_MUSIC; //iniTimeがwait以上なら
		if (this.iniTime >= this.music.getDuration()) { //iniTimeがmusicの合計時間以上なら
			this.section = JudgeTimerSenction.AFTER_MUSIC_END;
			if (this.music.isPlaying()) this.music.pause(); //曲を止める
		}
		else {
			if (!this.music.isPlaying()) this.music.play();
			//try { while (!music.isPlaying()) {} } catch(Exception e) { System.out.println(e); } //なんか怒られるのでまぁ初期化だしたいした時間の影響はないってことでtrycatch。
			//try { Thread.sleep(1); } catch (InterruptedException e) { e.printStackTrace(); }
			if (this.music.isPlaying()) this.music.pause();
			this.music.seek(this.seek + this.iniTime); //musicはseek+iniTimeでシークしておく。
		}
	}
	else this.section = JudgeTimerSenction.AFTER_MUSIC_END;
	
	this.onceReseted = true;
}
	
RhythmActionJudgeTimer.prototype.getTime = function() {
	if (this.section == JudgeTimerSenction.BEFORE_MUSIC_START) {
		//wait秒から始まる
		if (this.beforeTimer.now() + this.iniTime >= this.wait) { 
			this.section = JudgeTimerSenction.PLAYING_MUSIC;
		}
		else {
			if (!this.beforeTimer.isRunning()) this.beforeTimer.start();
			//タイマーから時間を求める
			return this.beforeTimer.now() + this.iniTime;
		}
	}
	if (this.section == JudgeTimerSenction.PLAYING_MUSIC) {
		//曲を再生する
		if (this.musicLoaded && !this.musicPlayed && !this.music.isPlaying()) { this.music.play(); this.musicPlayed = true; }
		//音楽前タイマーを止める
		if (this.beforeTimer.isRunning()) this.beforeTimer.stop();
		//音楽から時間を求める
		var cp = this.music.currentPosition();
		//音楽だけだと詳しい時間がわからないからdetailTimerを使う
		var detailTime = 0.0;
		if (cp == this.oldCurrentPosition) {
			if (!this.detailTimer.isRunning()) this.detailTimer.start();
			detailTime = this.detailTimer.now();
		}
		else {
			this.detailTimer.restart();
		}
		this.oldCurrentPosition = cp;
		//音楽の時間と詳しい時間からリターンする値を決定
		var ret = cp - this.seek + this.wait + detailTime;
		//ゲームが先に終わるか、ゲームと音楽が同時に終わるなら、
		if (ret >= this.finishTime) {
			this.finish = true;
			//一応止める。
			if (this.musicLoaded && this.musicPlayed && this.music.isPlaying()) this.music.pause();
			return ret;
		}
		else {
			return ret;
		}
	}
	if (this.section == JudgeTimerSenction.AFTER_MUSIC_END) {
		//止めてからきているはずではあるが、一応音楽を止める。
		if (this.musicLoaded && this.musicPlayed && this.music.isPlaying()) this.music.pause();
		//音楽再生終了後タイマー作動
		this.afterTimer.start();
		//ゲーム時間を超していた(あるいは同じ)なら、ゲーム終了
		var ret = this.afterTimer.now() + this.iniTime;
		if (ret >= this.finishTime) {
			this.finish = true;
		}
		return ret;
	}
	return 0;
}
	
RhythmActionJudgeTimer.prototype.pause = function() { 
	this.pauseflg = !this.pauseflg;
	if (this.pauseflg) {
		if (this.section == JudgeTimerSenction.BEFORE_MUSIC_START) {
			this.beforeTimer.stop();
		}
		else if (this.section == JudgeTimerSenction.PLAYING_MUSIC) {
			this.music.pause();
			this.detailTimer.stop();
		}
		else {
			this.afterTimer.stop();
		}
	}
	else {
		if (this.section == JudgeTimerSenction.BEFORE_MUSIC_START) {
			this.beforeTimer.start();
		}
		else if (this.section == JudgeTimerSenction.PLAYING_MUSIC) {
			this.music.play();
			this.detailTimer.start();
		}
		else {
			this.afterTimer.start();
		}
	}
}

//保持時間を更新
RhythmActionJudgeTimer.prototype.updateNowtime = function() { 
	this.gameTime = this.getTime();
}

//外部ゲッター
RhythmActionJudgeTimer.prototype.getGameTime = function() { return this.gameTime; }
RhythmActionJudgeTimer.prototype.isFinished = function() { return this.finish; } 
RhythmActionJudgeTimer.prototype.getOnceReseted = function() { return this.onceReseted; } 

RhythmActionJudgeTimer.prototype.dispose = function() {
	this.music = null;
}
