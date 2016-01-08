//=======================
//  ScenePlayMaimaiクラス
//=======================
function ScenePlayMaimai(gManager) {
	GameScene.apply(this, arguments);
	this.sensor = this.getManager().getSensor();
	this.config = this.getManager().getConfig();
	this.scoreLoader = this.getManager().getScoreLoader();
	this.judgeTimer = this.getManager().getJudgeTimer();
	
	this.wakuImg = ImageItem.getMaimaiBase();
	this.pickUpNotes = [];
	this.pickUpSlideNotes = [];
	this.pauseTenmetsuTimer = new StopWatch();
	this.bgInfoDescViewTimer = new StopWatch(); //bgInfo表示タイマー
	
	this.judgeNote = null; //評価クラス
	this.notes = null; //譜面
	this.searchFromIndexInDrawableTime = 0; //描画対象検索高速化用変数

	this.endOfMusic = false; //曲再生終了フラグ
	this.pause = false; //中断フラグ
	this.pauseVisible = false;
	this.pauseAfterPushing = false; //ポーズ後の長押し判定がしたい

	this.circleColor = new Color(0,0,0,255); //レベル別外周カラー
	this.selectedDifficulty = 0; //リトライ用、選択難易度

	this.musicTitle = ""; //曲名
	this.fmenLevel = ""; //譜面レベル
	this.fmenDifficulty = ""; //難易度

	//コンボか達成率がbgInfoDescViewTarget以上になったとき、bgInfoDescViewTimer.reset();.start(); bgInfoDescViewTarget += 10;
	this.bgInfoDescViewTarget = 0; //bgInfoの、10コンボごととか10%ごととかにアニメーションするためのカウンタ目標
	
	this.BGINFO_DESC_VIEW_TIME = 1.5; //bgInfoDescViewTimerが何秒になるまで表示するか。
	this.bgInfoCombo = 0; //コンボが切れたとき、bgInfoDescViewTargetの値を修正したいので。
	this.drawingBgInfoDescView = false; //bgInfo描画中フラグ

	this.calledAPFC = false; //オールパーフェクト声及びフルコンボ声を再生した
	this.drawedAPFC = false; //オールパーフェクト及びフルコンボを描くためのタイマーをリセットした

	this.released = false;
	this.retry = false; //リトライならば譜面再読み込み、するためのフラグ
	
	this.seekTime = 0;
}
ScenePlayMaimai.prototype = new GameScene(this.gManager);

ScenePlayMaimai.prototype.init = function() {
	var fp = this.getScoreLoader();
	this.musicTitle = fp.getStrTitle();
	switch (this.selectedDifficulty) {
		case 0:
			this.fmenLevel = fp.getStrLevelEasy();
			this.fmenDifficulty = "EASY";
			break;
		case 1:
			this.fmenLevel = fp.getStrLevelBasic();
			this.fmenDifficulty = "BASIC";
			break;
		case 2:
			this.fmenLevel = fp.getStrLevelAdvanced();
			this.fmenDifficulty = "ADVANCED";
			break;
		case 3:
			this.fmenLevel = fp.getStrLevelExpert();
			this.fmenDifficulty = "EXPERT";
			break;
		case 4:
			this.fmenLevel = fp.getStrLevelMaster();
			this.fmenDifficulty = "MASTER";
			break;
		default:
			this.fmenLevel = "";
			this.fmenDifficulty = "";
			break;
	}

	//リトライの都合もあるので、譜面再読み込み。
	if (this.retry) this.setNotes(this.selectedDifficulty);
	//this.retry = true;
	//リトライ時にゴミが残らないようにリセット
	if (this.pickUpSlideNotes.length > 0) this.pickUpSlideNotes = [];
	if (this.pickUpNotes.length > 0) this.pickUpNotes = [];
	
	this.judgeTimerReset();
	this.pause = false;
	this.endOfMusic = false;

	this.createMaimaiJudgeEvaluateManager();
	this.setJudged(); //時間シーク用追加
	this.searchFromIndexInDrawableTime = 0;

	this.pauseVisible = false;
	this.pauseAfterPushing = false;

	this.calledAPFC = false;
	this.drawedAPFC = false;

	this.pauseTenmetsuTimer.stop();
	this.pauseTenmetsuTimer.reset();

	this.bgInfoDescViewTarget = 10;
	this.bgInfoDescViewTimer.stop();
	this.bgInfoDescViewTimer.reset();
	this.bgInfoCombo = 0;
	this.drawingBgInfoDescView = false;

	//getSensor().setEffectEnabled(true);

	this.released = false;
}

ScenePlayMaimai.prototype.step = function() {
//フルコンボやオールパーフェクトの声を再生。オールパーフェクト優先。
	if (!this.calledAPFC && this.judgeNote.isAllPerfect()) {
		this.callAPVoice();
	}
	else if (!this.calledAPFC && this.judgeNote.isFullCombo()) {
		this.callFCVoice();
	}
	
	if (this.getJudgeTimer().isFinished()) {
		this.onGameFinished();
	}
	else {
		if (!this.pause) {
			this.getJudgeTimer().updateNowtime();
			this.judgeNote.autoBeatTimningProc(); //最初のカウント音を鳴らす
			this.judgeNote.autoJustTimingProc(); //アンサー音を鳴らす。
			this.judgeNote.autoSlideStartTimingProc(); //スライドのアンサー音を鳴らす
			if (this.isAutoMode()) this.judgeNote.djAutoProc(); //オートモードのとき自動操作
			//dp("動画:" + this.judgeTimer.getGameTime() + "秒");

			//オプションの、ボタンの履歴を使用するか否かで、処理を変える。

			if (this.getConfig().getHowToCheckTouch() == HowToCheckTouchInfomation.DETAIL) { //ボタンの履歴を使用する
				//while (this.getManager().getTouchManager().updateTouchesFromNextHistory()) { //タッチ履歴が溜まっている数だけ、処理する。
					this.getSensor().check();
					if (!this.isAutoMode()) this.notesJudge(true);
				//}
			}
			else { //ボタンの履歴を使用しない
				//this.getManager().getTouchManager().updateTouchesFromAllHistory();
				this.getSensor().check();
				if (!this.isAutoMode()) this.notesJudge(false);
			}
			
			this.judgeNote.autoMissProc(); //ミスを判定する。
			this.moveNotes(); //ノートを動かす
			this.judgeNote.updateDrawableEvaluate(); //評価表示用の計算をする
			if (this.pauseTenmetsuTimer.isRunning()) { //ポーズ点滅用タイマーを止める
				this.pauseTenmetsuTimer.stop();
				this.pauseTenmetsuTimer.reset();
			}
			if (this.drawingBgInfoDescView) {
				this.bgInfoDescViewTimer.start();
			}
		}
		else {
			//this.getManager().getTouchManager().updateTouchesFromAllHistory();
			this.judgeNote.pauseDrawEvaluate(); //ポーズ中は評価表示用のタイマーだけ止める
			if (this.drawingBgInfoDescView) {
				this.bgInfoDescViewTimer.stop();
			}
			if (!this.pauseTenmetsuTimer.isRunning()) { //ポーズ点滅用タイマーを開始
				this.pauseTenmetsuTimer.start();
				this.pauseVisible = true;
			}
			else if (this.pauseTenmetsuTimer.now() > 1.2) {
				this.pauseTenmetsuTimer.restart();
				this.pauseVisible = true;
			}
			else if (this.pauseTenmetsuTimer.now() > 0.6) {
				this.pauseVisible = false;
			}
		}
	}
	
	if (!this.released) //画面遷移するとノート情報がなくなるため
	this.bgInfoCounter();
	
	//ボタンエフェクト
	this.getSensor().updateButtonPushEffect();
}

ScenePlayMaimai.prototype.disp = function(canvas) {
	canvas.save();
	
	this.getBgImageManager().drawBackGroundImage(canvas, 255);

	//レベル別カラーで外周表示
	this.getSensor().draw(canvas, this.circleColor, 255, true);
	
	//ボタンエフェクト描画
	if (this.getSetting().isDrawButtonPushEffectEnabled()) this.getSensor().drawButtonPushEffect(canvas);
	
	this.drawBgInfo(canvas);
	
	this.drawNotes(canvas);
	
	if (this.getSetting().isEvaluateVisible())
		this.judgeNote.drawEvaluate(canvas);
	
	if (this.pause)
		this.drawPause(canvas);
	
	//最後に淵を描く。そんで例えばプレイヤーネームとかレベルを上画面に描くならこれの後。
	canvas.drawImage(this.wakuImg, 0, 0);
	
	//画面上
	{
		if (this.getConfig().getUpScreenDrawJudgeEffectEnabeld()) {
			this.judgeNote.drawEvaluateUpScreen(canvas);
		}
		
		canvas.save();
		
		var fontname = "px 'ＭＳ ゴシック'";
		//譜面レベル
		canvas.fillStyle = this.circleColor.toContextString();
		canvas.font = TechnicalDraw.calcDrawableStringFontSize_arg1(canvas, this.fmenLevel, 36, "00") + fontname;
		canvas.fillText(this.fmenLevel, 15, 35);
		//曲名
		//16ポイントで、半角23文字入る範囲はある。
		canvas.font = TechnicalDraw.calcDrawableStringFontSize_arg1(canvas, this.musicTitle, 16, "DO RORO DERODERO ON DO ") + fontname;
		canvas.fillText(this.musicTitle, 70, 20);
		//難易度
		canvas.font = "5" + fontname;
		//canvas.fillText(this.fmenDifficulty, 70, 38);
		
		//達成率
		var usainfo = this.getSetting().getUsAchvInfo();
		if (usainfo != UpScreenAchievementInfomation.NONE) {
			var achiv = 0;
			if (usainfo == UpScreenAchievementInfomation.NORMAL)
				achiv = this.judgeNote.getAchievement();
			else if (usainfo == UpScreenAchievementInfomation.PACE)
				achiv = this.judgeNote.getPaceAchievement();
			else if (usainfo == UpScreenAchievementInfomation.HAZARD)
				achiv = this.judgeNote.getHazardAchievement();
			else if (usainfo == UpScreenAchievementInfomation.THEOR_NORMAL)
				achiv = this.judgeNote.getTheoreticalAchievement();
			else if (usainfo == UpScreenAchievementInfomation.THEOR_PACE)
				achiv = this.judgeNote.getTheoreticalPaceAchievement();
			else if (usainfo == UpScreenAchievementInfomation.THEOR_HAZARD)
				achiv = this.judgeNote.getTheoreticalHazardAchievement();
			var percent = (Math.floor(achiv * 100) / 100).toFixed(2);
			canvas.fillStyle = MaimaiStyleDesigner.achievementColor(percent).toContextString();
			canvas.font = "10" + fontname;
			var t = this.getSetting().getUsAchvInfoName();
			canvas.fillText(t, 70, 38);
			canvas.font = "12" + fontname;
			canvas.fillText(percent + "%", 70, 49);
		}
		
		canvas.restore();

		//楽譜カンマカウント
		if (this.getConfig().getDrawCammaCountEnabled()) {
			this.judgeNote.drawNoteComment(canvas, 176, 34, "10" + fontname, new Color(0,0,0,255));
		}
		
		//ポーズボタン
		this.drawPauseButton(canvas);
	}
	//画面下
	{
		this.drawDetailScore(canvas);
	}
	
	canvas.restore();
}

ScenePlayMaimai.prototype.releaseNotes = function() {
	if (this.notes != null) {
		for (var i = 0; i < this.notes.length; i++) {
			if (this.notes[i] != null) this.notes[i].release();
			this.notes[i] = null;
		}
		this.notes = null;
	}
}

//release系のメソッドは、lockとかsynchronizeとかしないと迂闊にできなさそう。なので、呼び出し側をコメントアウトしておく
ScenePlayMaimai.prototype.release = function() {
	if (this.judgeNote != null) this.judgeNote.release();
	if (this.pickUpNotes != null) { 
		for (var i = 0; i < this.pickUpNotes.length; i++) {
			this.pickUpNotes[i] = null;
		}
	}
	this.pickUpNotes = [];
	if (this.pickUpSlideNotes != null) { 
		for (var i = 0; i < this.pickUpSlideNotes.length; i++) {
			this.pickUpSlideNotes[i] = null;
		}
	}
	this.pickUpSlideNotes = [];
	this.judgeNote = null;
	this.releaseNotes();
	this.released = true;
}

ScenePlayMaimai.prototype.destroy = function() {
	this.release();
	if (this.config != null) {
		this.config = null;
	}
	if (this.sensor != null) {
		this.sensor = null;
	}
	if (this.scoreLoader != null) {
		this.scoreLoader = null;
	}
	this.wakuImg = null;
	this.judgeTimer = null;
	this.pickUpNotes = null;
	this.pickUpSlideNotes = null;
}

ScenePlayMaimai.prototype.getConfig = function() { return this.config; }
ScenePlayMaimai.prototype.getScoreLoader = function() { return this.scoreLoader; }
ScenePlayMaimai.prototype.getJudgeTimer = function() { return this.judgeTimer; }
ScenePlayMaimai.prototype.getSensor = function() { return this.sensor; }
ScenePlayMaimai.prototype.getParentSensor = function() { return this.sensor; }
ScenePlayMaimai.prototype.getSetting = function() { return this.getConfig().getPlayer1Setting(); }
ScenePlayMaimai.prototype.getBgImageManager = function() { return this.getManager().getBgImageManager(); }
ScenePlayMaimai.prototype.isAutoMode = function() { return this.getSetting().isAutoPlay(); } //自動操作モード

//曲を選択したら、難易度選択Initで譜面ファイルをロードしておく。
//難易度を選んだら、この関数を呼んで楽譜をセットする。
//楽譜に不備があるなどしたらreturn false;
ScenePlayMaimai.prototype.setNotes = function(difficulty) { //SelectDifficultyクラスで呼ぶ
	//this.releaseNotes();
	this.notes = this.getScoreLoader().createMaimaiNotes_withDifficulty(difficulty);
	this.circleColor = MaimaiStyleDesigner.levelColor(difficulty);
	this.selectedDifficulty = difficulty;
	this.retry = false;
	return this.notes != null;
}
//譜面を引数にして読む
ScenePlayMaimai.prototype.setNotes_withFmen = function(res) { //SelectDifficultyクラスで呼ぶ
	//this.releaseNotes();
	this.notes = this.getScoreLoader().createMaimaiNotes(res, 0, 0);
	this.circleColor = new Color(0,255,255,255);
	this.selectedDifficulty = 0;
	this.retry = false;
	return this.notes != null;
}
ScenePlayMaimai.prototype.checkNotes = function() { return ""; }
ScenePlayMaimai.prototype.getLastErrorMessage = function() { return this.getScoreLoader().getLastErrorMessage(); }

ScenePlayMaimai.prototype.createMaimaiJudgeEvaluateManager = function() {
	if (this.judgeNote != null) this.judgeNote.release();
	this.judgeNote = new MaimaiJudgeEvaluateManager(this.getJudgeTimer(), this.notes, this.getSensor(), this.getConfig(), this.getSetting(), this.getManager().getSEManager(), this.getScoreLoader().getFirstBPM());
	this.judgeNote.setAchievementScore(this.notes);
}

ScenePlayMaimai.prototype.judgeTimerReset = function() {
	var fp = this.getScoreLoader();
	var seek = fp.getSeek();
	var wait = fp.getWait();
	var finishTime = fp.getFinishTime();
	this.getJudgeTimer().reset(true, seek, wait, this.seekTime, finishTime + 2); //第5引数の終了時間は2秒くらい余裕持たせるか。
}

ScenePlayMaimai.prototype.judgeTimerPause = function() {
	this.getJudgeTimer().pause();
}

ScenePlayMaimai.prototype.restart = function() {
	//this.release();
	this.getManager().changeScene(GameSceneName.PLAYMAIMAI);
}

ScenePlayMaimai.prototype.backSceneSelectMusic = function() {
	//this.release();
	this.getManager().changeScene(GameSceneName.TITLE);
}

//フルコンボやオールパーフェクトの声を再生。オールパーフェクト優先。
ScenePlayMaimai.prototype.callAPVoice = function() {
	if (this.getSetting().isNarration()) {
		this.getManager().getSEManager().play(SEName.VOICE_AP);
	}
	this.calledAPFC = true;
}

ScenePlayMaimai.prototype.callFCVoice = function() {
	if (this.getSetting().isNarration()) {
		this.getManager().getSEManager().play(SEName.VOICE_FC);
	}
	this.calledAPFC = true;
}

ScenePlayMaimai.prototype.onGameFinished = function() {
	//リザルトへ行く
	this.goResult();
	//this.release();
	//UI操作
	onGameFinishedGuiAction();
}

ScenePlayMaimai.prototype.notesJudge = function(detail) {
	
}

ScenePlayMaimai.prototype.iniActionId = function() { return 0x0; }

ScenePlayMaimai.prototype.goResult = function() {
	this.getManager().changeScene(GameSceneName.TITLE);
}

ScenePlayMaimai.prototype.bgInfoCounter = function() {
	if (!this.drawedAPFC && (this.judgeNote.isAllPerfect() || this.judgeNote.isFullCombo())) {
		this.bgInfoDescViewTimer.restart();
		this.drawedAPFC = true;
		this.drawingBgInfoDescView = true;
		return;
	}

	var bgInfoDescViewValue = 0;
	if (this.getSetting().getBgInfo() == BackGroundInfomation.COMBO || this.getSetting().getBgInfo() == BackGroundInfomation.PCOMBO || this.getSetting().getBgInfo() == BackGroundInfomation.BPCOMBO) {
		var nowcombo;
		if (this.getSetting().getBgInfo() == BackGroundInfomation.PCOMBO) nowcombo = this.judgeNote.getPCombo();
		else if (this.getSetting().getBgInfo() == BackGroundInfomation.BPCOMBO) nowcombo = this.judgeNote.getBPCombo();
		else nowcombo = this.judgeNote.getCombo();
		
		//コンボが切れていないか見る
		if (nowcombo < this.bgInfoCombo) {
			//もし切れていたら目標値を修正
			this.bgInfoDescViewTarget = 10;
			this.bgInfoDescViewTimer.stop();
		}
		this.bgInfoCombo = nowcombo;
		
		bgInfoDescViewValue = nowcombo;
	}
	else if (this.getSetting().getBgInfo() == BackGroundInfomation.ACHIEVEMENT || this.getSetting().getBgInfo() == BackGroundInfomation.SCORE) {
		bgInfoDescViewValue = this.judgeNote.getAchievement();
	}

	if (bgInfoDescViewValue >= this.bgInfoDescViewTarget) {
		this.bgInfoDescViewTimer.stop();
		this.bgInfoDescViewTimer.reset();
		this.bgInfoDescViewTimer.start();
		this.drawingBgInfoDescView = true;
		while (bgInfoDescViewValue >= this.bgInfoDescViewTarget)
			this.bgInfoDescViewTarget += 10;
	}
}

ScenePlayMaimai.prototype.moveNotes = function() {
	var notesLength = this.notes.length;
	this.pickUpSlideNotes = [];
	this.pickUpNotes = [];
	
	for (var i = this.searchFromIndexInDrawableTime; i < notesLength; i++) {
		//スライドはスターに依存する。ヘッドはフットに依存する
		//タップだったら描画対象からすぐ外せる
		var note = this.notes[i];
		var type = note.getNoteType();
		if (!note.visible) {
			if ((type == NoteType.CIRCLETAP) ||
				(type == NoteType.BREAK) ||
				(type == NoteType.STARTAP && note.getRelativeNote().evaluated) ||
				(type == NoteType.HOLDHEAD) ||
				(type == NoteType.HOLDFOOT)
				) {
				this.searchFromIndexInDrawableTime = i;
				continue;
			}
		}
		if (type != NoteType.SLIDE && type != NoteType.SLIDEPATTERN) {
			break;
		}
	}
	
	//描画していいノートをピックアップして、後ろから描いていきたい。
	for (var i = this.searchFromIndexInDrawableTime; i < notesLength; i++) {
		var note = this.notes[i];
		if (this.getJudgeTimer().getGameTime() >= note.getJustTime() + note.getGameStartTime() - this.getSetting().getGuideSpeed()) {
			var type = note.getNoteType();
			//スターが出たときからスライドマーカーをフェードインして表示したい
			if (type == NoteType.STARTAP) {
				var sNote = note;
				var slNote = sNote.getRelativeNote();
				if (slNote.visible)
					this.pickUpSlideNotes.push(slNote);
			}
			
			if (type != NoteType.SLIDE && type != NoteType.SLIDEPATTERN) {
				//Eachの円弧を最後まで描き切りたい。
				var eachArcVisible = false;
				if (type == NoteType.CIRCLETAP || type == NoteType.STARTAP ||
					type == NoteType.HOLDHEAD || type == NoteType.BREAK)
				{
					var eNote = note;
					if (eNote.isEach() && eNote.getEachArcVisible()) {
						this.eachArcVisible = true;
					}
				}
				
				if (note.visible || this.eachArcVisible)
					this.pickUpNotes.push(note);
			}
		}
		else {
			break;
		}
	}
	
	//先にスライドの描画を済ませる
	var pickUpSlideNotesLength = this.pickUpSlideNotes.length;
	for (var i = pickUpSlideNotesLength - 1; i >= 0; i--) {
		var note = this.pickUpSlideNotes[i];
		if (note != null) {
			if (note.visible) {
				note.moveNote();
			}
		}
	}

	//スライド以外のマーカーの描画
	var pickUpNotesLength = this.pickUpNotes.length;
	for (var i = pickUpNotesLength - 1; i >= 0; i--) {
		var note = this.pickUpNotes[i];
		if (note != null) {
			if (note.visible) {
				note.moveNote();
			}
		}
	}
}

//MARK マーカー描画
ScenePlayMaimai.prototype.drawNotes = function(canvas) {
	//先にスライドの描画を済ませる
	var pickUpSlideNotesLength = this.pickUpSlideNotes.length;
	for (var i = pickUpSlideNotesLength - 1; i >= 0; i--) {
		var note = this.pickUpSlideNotes[i];
		if (note != null) {
			if (note.visible) {
				note.drawNote(canvas);
			}
		}
	}

	//スライド以外のマーカーの描画
	var pickUpNotesLength = this.pickUpNotes.length;
	for (var i = pickUpNotesLength - 1; i >= 0; i--) {
		var note = this.pickUpNotes[i];
		if (note != null) {
			if (note.visible) {
				note.drawNote(canvas);
			}
		}
	}
}

ScenePlayMaimai.prototype.drawPause = function(canvas) {
	canvas.save();
	canvas.fillStyle = (new Color(0,0,0,200)).toContextString();
	canvas.fillRect(0, 0, 384, 512);
	if (this.pauseVisible) {
		var text = "Pause";
		canvas.font = "20px 'ＭＳ ゴシック'"
		var x = (384 / 2 - canvas.measureText(text).width / 2);
		var y = this.getParentSensor().getCenterSensorPiece().getY() + 6;
		canvas.fillStyle = (new Color(255,255,255,255)).toContextString();
		canvas.fillText(text, x, y);
	}
	canvas.restore();
}

ScenePlayMaimai.prototype.drawPauseButton = function(canvas) {
}

ScenePlayMaimai.prototype.is100PercentSynchronize = function() {
	return false;
}

ScenePlayMaimai.prototype.drawBgInfo = function(canvas) {
	if (this.is100PercentSynchronize()) {
		this.draw100PercentSynchronize(canvas);
	}
	else if (this.judgeNote.isAllPerfect()) {
		this.drawAllPerfect(canvas);
	}
	else if (this.judgeNote.isFullCombo()) {
		this.drawFullCombo(canvas);
	}
	else if (this.getSetting().getBgInfo() == BackGroundInfomation.COMBO) {
		this.drawCombo(canvas);
	}
	else if (this.getSetting().getBgInfo() == BackGroundInfomation.ACHIEVEMENT) {
		this.drawAchievement(canvas);
	}
	else if (this.getSetting().getBgInfo() == BackGroundInfomation.SCORE) {
		this.drawScore(canvas);
	}
	else if (this.getSetting().getBgInfo() == BackGroundInfomation.PCOMBO) {
		this.drawPCombo(canvas);
	}
	else if (this.getSetting().getBgInfo() == BackGroundInfomation.BPCOMBO) {
		this.drawBPCombo(canvas);
	}
	else if (this.getSetting().getBgInfo() == BackGroundInfomation.PACHIEVEMENT) {
		this.drawPaceAchievement(canvas);
	}
	else if (this.getSetting().getBgInfo() == BackGroundInfomation.HACHIEVEMENT) {
		this.drawHazardAchievement(canvas);
	}
	else if (this.getSetting().getBgInfo() == BackGroundInfomation.TACHIEVEMENT) {
		this.drawTheoreticalAchievement(canvas);
	}
	else if (this.getSetting().getBgInfo() == BackGroundInfomation.TPACHIEVEMENT) {
		this.drawTheoreticalPaceAchievement(canvas);
	}
	else if (this.getSetting().getBgInfo() == BackGroundInfomation.THACHIEVEMENT) {
		this.drawTheoreticalHazardAchievement(canvas);
	}
}

ScenePlayMaimai.prototype.draw100PercentSynchronize = function(canvas) {
	var color = MaimaiStyleDesigner.achievementColor(99);
	var font = "32px 'ＭＳ ゴシック'";
	var text = "100% SYNCHRONIZE";
	canvas.save();
	canvas.font = font;
	this.drawBgInfoDesc(canvas, text, font, color, new PointF(384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 8));
	canvas.restore();
}

ScenePlayMaimai.prototype.drawAllPerfect = function(canvas) {
	var color = MaimaiStyleDesigner.achievementColor(99);
	var font = "32px 'ＭＳ ゴシック'";
	var text = "ALL PERFECT";
	canvas.save();
	canvas.font = font;
	this.drawBgInfoDesc(canvas, text, font, color, new PointF(384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 8));
	canvas.restore();
}

ScenePlayMaimai.prototype.drawFullCombo = function(canvas) {
	var color = MaimaiStyleDesigner.achievementColor(99);
	var font = "32px 'ＭＳ ゴシック'";
	var text = "FULL COMBO";
	canvas.save();
	canvas.font = font;
	this.drawBgInfoDesc(canvas, text, font, color, new PointF(384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 8));
	canvas.restore();
}

ScenePlayMaimai.prototype.drawCombo = function(canvas) {
	if (this.judgeNote.getCombo() > 1) {
		var color = new Color(255, 0, 0, 255);
		var font = "40px 'ＭＳ ゴシック'";
		var text = this.judgeNote.getCombo();
		canvas.save();
		canvas.font = font;
		canvas.fillStyle = color.toContextString();
		canvas.fillText(text, 384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 16);
		canvas.restore();
		this.drawBgInfoDesc(canvas, "COMBO", null, color, null);
	}
}

ScenePlayMaimai.prototype.drawPCombo = function(canvas) {
	if (this.judgeNote.getPCombo() > 1) {
		var color = new Color(255, 255, 192, 255);
		var font = "40px 'ＭＳ ゴシック'";
		var text = this.judgeNote.getPCombo();
		canvas.save();
		canvas.font = font;
		canvas.fillStyle = color.toContextString();
		canvas.fillText(text, 384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 16);
		canvas.restore();
		this.drawBgInfoDesc(canvas, "PCOMBO", null, color, null);
	}
}

ScenePlayMaimai.prototype.drawBPCombo = function(canvas) {
	if (this.judgeNote.getBPCombo() > 1) {
		var color = new Color(255, 255, 144, 255);
		var font = "40px 'ＭＳ ゴシック'";
		var text = this.judgeNote.getBPCombo();
		canvas.save();
		canvas.font = font;
		canvas.fillStyle = color.toContextString();
		canvas.fillText(text, 384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 16);
		canvas.restore();
		this.drawBgInfoDesc(canvas, "BPCOMBO", null, color, null);
	}
}

ScenePlayMaimai.prototype.drawAchievement = function(canvas) {
	var percent = (Math.floor(this.judgeNote.getAchievement() * 100) / 100).toFixed(2);
	var font = "32px 'ＭＳ ゴシック'";
	var color = MaimaiStyleDesigner.achievementColor(percent);
	var text = percent;
	canvas.save();
	canvas.font = font;
	canvas.fillStyle = color.toContextString();
	canvas.fillText(text, 384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 16);
	canvas.restore();
	this.drawBgInfoDesc(canvas, "ACHIEVEMENT", null, color, null);
}

ScenePlayMaimai.prototype.drawPaceAchievement = function(canvas) {
	var percent = (Math.floor(this.judgeNote.getPaceAchievement() * 100) / 100).toFixed(2);
	var font = "32px 'ＭＳ ゴシック'";
	var color = MaimaiStyleDesigner.achievementColor(percent);
	var text = percent;
	canvas.save();
	canvas.font = font;
	canvas.fillStyle = color.toContextString();
	canvas.fillText(text, 384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 16);
	canvas.restore();
	this.drawBgInfoDesc(canvas, "PACE ACHIEVEMENT", null, color, null);
}

ScenePlayMaimai.prototype.drawHazardAchievement = function(canvas) {
	var percent = (Math.floor(this.judgeNote.getHazardAchievement() * 100) / 100).toFixed(2);
	var font = "32px 'ＭＳ ゴシック'";
	var color = MaimaiStyleDesigner.achievementColor(percent);
	var text = percent;
	canvas.save();
	canvas.font = font;
	canvas.fillStyle = color.toContextString();
	canvas.fillText(text, 384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 16);
	canvas.restore();
	this.drawBgInfoDesc(canvas, "HAZARD ACHIEVEMENT", null, color, null);
}

ScenePlayMaimai.prototype.drawTheoreticalAchievement = function(canvas) {
	var percent = (Math.floor(this.judgeNote.getTheoreticalAchievement() * 100) / 100).toFixed(2);
	var font = "32px 'ＭＳ ゴシック'";
	var color = MaimaiStyleDesigner.achievementColor(this.judgeNote.getAchievement());
	var text = percent;
	canvas.save();
	canvas.font = font;
	canvas.fillStyle = color.toContextString();
	canvas.fillText(text, 384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 16);
	canvas.restore();
	this.drawBgInfoDesc(canvas, "THEOR ACHIEVEMENT", null, color, null);
}

ScenePlayMaimai.prototype.drawTheoreticalPaceAchievement = function(canvas) {
	var percent = (Math.floor(this.judgeNote.getTheoreticalPaceAchievement() * 100) / 100).toFixed(2);
	var font = "32px 'ＭＳ ゴシック'";
	var color = MaimaiStyleDesigner.achievementColor(this.judgeNote.getPaceAchievement());
	var text = percent;
	canvas.save();
	canvas.font = font;
	canvas.fillStyle = color.toContextString();
	canvas.fillText(text, 384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 16);
	canvas.restore();
	this.drawBgInfoDesc(canvas, "THEOR PACE ACHIEVEMENT", null, color, null);
}

ScenePlayMaimai.prototype.drawTheoreticalHazardAchievement = function(canvas) {
	var percent = (Math.floor(this.judgeNote.getTheoreticalHazardAchievement() * 100) / 100).toFixed(2);
	var font = "32px 'ＭＳ ゴシック'";
	var color = MaimaiStyleDesigner.achievementColor(this.judgeNote.getHazardAchievement());
	var text = percent;
	canvas.save();
	canvas.font = font;
	canvas.fillStyle = color.toContextString();
	canvas.fillText(text, 384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 16);
	canvas.restore();
	this.drawBgInfoDesc(canvas, "THEOR HAZARD ACHIEVEMENT", null, color, null);
}

ScenePlayMaimai.prototype.drawScore = function(canvas) {
	if (this.judgeNote.getScore() > 1) {
		var color = MaimaiStyleDesigner.scoreColor();
		var font = "32px 'ＭＳ ゴシック'";
		var text = this.judgeNote.getScore();
		canvas.save();
		canvas.font = font;
		canvas.fillStyle = color.toContextString();
		canvas.fillText(text, 384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() + 16);
		canvas.restore();
		this.drawBgInfoDesc(canvas, "SCORE", null, color, null);
	}
}

ScenePlayMaimai.prototype.drawBgInfoDesc = function(canvas, text, font, color, point) {
	if (text == null || text == "" || color == null || canvas == null) return;
	if (font == null) {
		font = "32px 'ＭＳ ゴシック'";
	}
	if (point == null) {
		canvas.save();
		canvas.font = font;
		point = new PointF(384 / 2 - canvas.measureText(text).width / 2, this.getParentSensor().getCenterSensorPiece().getY() - 40);
		canvas.restore();
	}
	
	var subtext = "";
	text = " " + text;
	var textlength = text.length;
	if (this.drawingBgInfoDescView) {
		var now = this.bgInfoDescViewTimer.now();
		for (var i = 1; i < textlength; i++) {
			var bgInfoDescViewTime2 = this.BGINFO_DESC_VIEW_TIME / 2;
			if (now < bgInfoDescViewTime2 / textlength * i) {
				subtext = text.substr(0, i);
				break;
			}
		}
		var bgInfoDescViewTime3 = this.drawedAPFC ? this.BGINFO_DESC_VIEW_TIME * 2 : this.BGINFO_DESC_VIEW_TIME;
		if (subtext == "" && now < bgInfoDescViewTime3) {
			subtext = text.substr(0, textlength);
		}
	
		if (subtext != "") {
			if (subtext != " ") {
				subtext = subtext.substr(1, subtext.length - 1);
				canvas.save();
				canvas.fillStyle = color.toContextString();
				canvas.font = font;
				canvas.fillText(subtext, point.x, point.y);
				canvas.restore();
			}
		}
		else {
			this.drawingBgInfoDescView = false;
			this.bgInfoDescViewTimer.stop();
		}
	}
}

//ノートを表示させたりさせなかったりサウンドを鳴らしたり鳴らさなかったり。
ScenePlayMaimai.prototype.setJudged = function() {
	var slidecnt = 0;
	for (var i = 0; i < this.notes.length; i++) {
		if (this.notes[i].getJustTime() + this.getSetting().getGuideSpeed() < this.seekTime) {
			this.notes[i].setJudged(true);
			this.notes[i].visible = false;
			if (this.notes[i].getNoteType() == NoteType.CIRCLETAP || this.notes[i].getNoteType() == NoteType.BREAK ||
				this.notes[i].getNoteType() == NoteType.STARTAP || this.notes[i].getNoteType() == NoteType.HOLDHEAD) {
				this.notes[i].setArcVisible(false);
			}
			if (this.notes[i].getNoteType() == NoteType.SLIDE) {
				this.notes[i].setEvaluated(true);
				slidecnt++;
				this.judgeNote.setSearchFromIndexInSlideStartTimesOfTiming(slidecnt);
			}
			this.judgeNote.setSearchFromIndexInJustTimesOfTiming(i);
			if (this.isAutoMode()) this.judgeNote.setDjAutoIndexAndSetPerfect(i); //オートモード用 途中までパーフェクト入れる
		}
		else {
			this.notes[i].setJudged(false);
			this.notes[i].visible = true;
			if (this.notes[i].getNoteType() == NoteType.CIRCLETAP || this.notes[i].getNoteType() == NoteType.BREAK ||
				this.notes[i].getNoteType() == NoteType.STARTAP || this.notes[i].getNoteType() == NoteType.HOLDHEAD)
			{
				this.notes[i].setArcVisible(true);
			}
			if (this.notes[i].getNoteType() == NoteType.SLIDE) {
				this.notes[i].setEvaluated(false);
				this.notes[i].resetNextPattern();
			}
		}
		if (this.notes[i].getNoteType() == NoteType.HOLDHEAD) {
			this.notes[i].pushed = false;
		}
	}
	if (this.seekTime > 0) {
		//スタートカウント音をオフにする
		this.judgeNote.startBeatSoundOff();
	}
	
	this.pauseVisible = false;
	this.pauseAfterPushing = false;
	
	this.calledAPFC = false;
	this.drawedAPFC = false;
	
	this.pauseTenmetsuTimer.stop();
	this.pauseTenmetsuTimer.reset();
	
	this.bgInfoDescViewTarget = 10;
	this.bgInfoDescViewTimer.stop();
	this.bgInfoDescViewTimer.reset();
	this.bgInfoCombo = 0;
	this.drawingBgInfoDescView = false;
}

//画面下にスコア詳細を描く
ScenePlayMaimai.prototype.drawDetailScore = function(canvas) {
	canvas.save();
	canvas.font = "9px 'ＭＳ ゴシック'";
	var yAssist = 447;
	
	if (!this.getConfig().getChangeTapToBreak()) canvas.fillStyle = (new Color(0xE6, 0xB4, 0x22, 0xFF)).toContextString();
	else canvas.fillStyle = (new Color(255, 0, 0, 255)).toContextString();
	canvas.fillText("TAP  ", 16, 19 + yAssist);
	canvas.fillStyle = (new Color(0xE6, 0xB4, 0x22, 0xFF)).toContextString();
	canvas.fillText("HOLD ", 16, 31 + yAssist);
	canvas.fillText("SLIDE", 16, 43 + yAssist);
	if (!this.getConfig().getChangeTapToBreak()) canvas.fillStyle = (new Color(0xE6, 0xB4, 0x22, 0xFF)).toContextString();
	else canvas.fillStyle = (new Color(255, 0, 0, 255)).toContextString();
	canvas.fillText("BREAK", 16, 55 + yAssist);
	canvas.fillStyle = (new Color(255, 255, 0, 255)).toContextString();
	canvas.fillText("PERFECT", 128, 19 + yAssist);
	canvas.fillStyle = (new Color(255, 175, 200, 255)).toContextString();
	canvas.fillText("GREAT  ", 128, 31 + yAssist);
	canvas.fillStyle = (new Color(0, 128, 0, 255)).toContextString();
	canvas.fillText("GOOD   ", 128, 43 + yAssist);
	canvas.fillStyle = (new Color(192, 192, 192, 255)).toContextString();
	canvas.fillText("MISS   ", 128, 55 + yAssist);
	if (this.judgeNote.getScore() == this.judgeNote.getTheoreticalScore()) {
		canvas.fillStyle = (new Color(255, 0, 0, 255)).toContextString();
		canvas.fillText("MAX SCORE!!", 248, 31 + yAssist);
	}
	//canvas.fillStyle = (new Color(255, 255, 255, 255)).toContextString();
	//canvas.fillText("PLAYS  ", 248, 43 + yAssist);
	canvas.fillStyle = (new Color(0xE6, 0xB4, 0x22, 0xFF)).toContextString();
	canvas.fillText("COMBO  ", 248, 55 + yAssist);
	//点数文字
	canvas.fillStyle = (new Color(0xE6, 0xB4, 0x22, 0xFF)).toContextString();
	canvas.fillText(this.judgeNote.getTapScore(), 60, 19 + yAssist);
	canvas.fillText(this.judgeNote.getHoldScore(), 60, 31 + yAssist);
	canvas.fillText(this.judgeNote.getSlideScore(), 60, 43 + yAssist);
	canvas.fillText(this.judgeNote.getBreakScore(), 60, 55 + yAssist);
	canvas.fillStyle = (new Color(255, 255, 0, 255)).toContextString();
	canvas.fillText(this.judgeNote.getPerfectCount(), 188, 19 + yAssist);
	canvas.fillStyle = (new Color(255, 175, 200, 255)).toContextString();
	canvas.fillText(this.judgeNote.getGreatCount(), 188, 31 + yAssist);
	canvas.fillStyle = (new Color(0, 128, 0, 255)).toContextString();
	canvas.fillText(this.judgeNote.getGoodCount(), 188, 43 + yAssist);
	canvas.fillStyle = (new Color(192, 192, 192, 255)).toContextString();
	canvas.fillText(this.judgeNote.getMissCount(), 188, 55 + yAssist);
	//canvas.fillStyle = (new Color(255, 255, 255, 255)).toContextString();
	//canvas.fillText(this.judgeNote.getPlayCount(), 296, 43 + yAssist);
	canvas.fillStyle = (new Color(0xE6, 0xB4, 0x22, 0xFF)).toContextString();
	canvas.fillText(this.judgeNote.getCombo(), 296, 55 + yAssist);
	
	canvas.restore();
}

ScenePlayMaimai.prototype.gamePause = function() {
	if (!this.pause) {
		this.judgeTimerPause();
	}
	this.pause = true;
}

ScenePlayMaimai.prototype.gameResume = function() {
	if (this.pause) {
		this.judgeTimerPause();
	}
	this.pause = false;
}

ScenePlayMaimai.prototype.gamePausingChange = function() {
	this.judgeTimerPause();
	this.pause = !this.pause;
}
