//===========================
//
//  MainActivity
//
//===========================
var mainActivity;
function MainActivity(in_canvas) {
	mainActivity = this;
	this.gManager = new GameManager(in_canvas);
	setInterval("mainActivity.gManager.gameloop()", 1000 / 60);
	/*
	in_canvas.addEventListener("click", this.onClick, false);
	in_canvas.addEventListener("touchstart", this.onTouchStart, false);
	in_canvas.addEventListener("touchmove", this.onTouchMove, false);
	in_canvas.addEventListener("touchend", this.onTouchEnd, false);
	in_canvas.addEventListener("touchcancel", this.onTouchCancel, false);
	*/
}
//クリックアクション
MainActivity.prototype.onClick = function(e) {
	//ほんとはクリックの状況からステップで移動するんだかんね。gManagerに干渉しちゃだめ。
	//仮に移動してみる
	//gManager.changeScene(SceneName.SAMPLE3);
	//mainActivity.gManager.nowScene.testClick();
}
//タッチアクション
MainActivity.prototype.onTouchStart = function(e) {
	//キャンバスの絶対座標を取得する。
	var rect = e.target.getBoundingClientRect();
	//キャンバスでのタッチ座標を取得する。
	for (var i = 0; i < e.touches.length; i++) {
		var p = new Point(e.touches[i].pageX - rect.left, e.touches[i].pageY - rect.top);
		//タッチ位置を保存し、タッチフラグをtrueにする。あと瞬間フラグを立てる
	}
	//画面スクロールさせない
	e.preventDefault();
}
MainActivity.prototype.onTouchMove = function(e) {
	this.onTouchStart(e);
}
MainActivity.prototype.onTouchEnd = function(e) {
	//キャンバスの絶対座標を取得する。
	var rect = e.target.getBoundingClientRect();
	//キャンバスでのタッチ座標を取得する。
	for (var i = 0; i < e.touches.length; i++) {
		var p = new Point(e.touches[i].pageX - rect.left, e.touches[i].pageY - rect.top);
		//タッチ位置を保存し、タッチフラグをfalseにする。あと瞬間フラグを立てる
	}
	//画面スクロールさせない
	e.preventDefault();
	
}
MainActivity.prototype.onTouchCancel = function(e) {
	onTouchEnd(e);
}

//===========================
//
//  GameManager
//
//===========================
var GameSceneName = {
	TITLE: 0, 
	PLAYMAIMAI: 1,
};
function GameManager(in_canvas) {
	this.canvas = in_canvas;
	//仮想画面サイズ
	this.virtualScreenSize = new Size(384, 512);
	
	//コンフィグデータ作成
	this.config = new GameConfig();
	//画像データ読み込み
	ImageItem.createImageItems();
	//背景マネージャ作成
	this.bgImageManager = new BGImageManager(this.config);
	//センサー作成
	this.sensor = new MaimaiVirtualHardWareSensor(this.virtualScreenSize, this.config.getPlayer1Setting(), 1, 0);
	//音楽マネージャ作成
	this.soundManager = new MultiMediaManager();
	//判定用タイマー作成
	this.judgeTimer = new RhythmActionJudgeTimer(this.soundManager, this.config);
	//this.judgeTimer = new RhythmActionJudgeTimer(this.config);
	//音楽系作成
	this.seManager = new SEManager();
	//譜面ローダー作成
	this.scoreLoader = new MaimaiFmenLoad(this.judgeTimer, this.sensor, this.config);
	
	//キャンバスの大きさ設定と中央揃え
	var context = this.canvas.getContext("2d");
	var scaleX = this.canvas.width / this.virtualScreenSize.width;
	var scaleY = this.canvas.height / this.virtualScreenSize.height;
	var YbiggerX = scaleX < scaleY;
	var centering;
	if (YbiggerX) { 
		centering = (this.canvas.height - this.virtualScreenSize.height * scaleX) / 2;
		context.translate(0, centering);
		context.scale(scaleX, scaleX);
		context.beginPath();
		context.rect(0, 0, this.virtualScreenSize.width, this.virtualScreenSize.height);
		context.clip();
	}
	else {
		centering = (this.canvas.width - this.virtualScreenSize.width * scaleY) / 2;
		context.translate(centering, 0);
		context.scale(scaleY, scaleY);
		context.beginPath();
		context.rect(0, 0, this.virtualScreenSize.width, this.virtualScreenSize.height);
		context.clip();
	}
	
	this.scenes = [new SceneTitle(this), new ScenePlayMaimai(this)];
	this.changeScene(GameSceneName.TITLE);
	
	window.onbeforeunload = this.destroy;
}
GameManager.prototype.gameloop = function() {
	if (ImageItem.allCompleted) { //画像読み込みが完了したか確認
		if (gActived) {
			this.init();
			this.disp();
			this.step();
		}
		else {
			//ゲームを中断する
			if (this.getNowScene() == this.getScenePlayMaimai()) {
				this.getScenePlayMaimai().gamePause();
				var button2 = document.getElementById("pause");
				button2.value = "RESUME";
			}
		}
	}
	else {
		//画像の読み込み具合をチェックする
		ImageItem.checkAllCompleted();
	}
}
GameManager.prototype.init = function() {
	if (this.initFlag) {
		this.nowScene.init();
		this.initFlag = false;
	}
}
GameManager.prototype.step = function() {
	this.nowScene.step();
}
GameManager.prototype.disp = function() {
	//描画コンテキストの取得
	if (this.canvas != null) {
		if (this.canvas.getContext) {
			
			var context = this.canvas.getContext("2d");
			
			context.save();
			
			//キャンバスクリア
			context.clearRect(0, 0, this.virtualScreenSize.width, this.virtualScreenSize.height);
			
			//DEBUG::キャンバスサイズ描画
			if (true) {
				context.strokeStyle = "rgb(128, 0, 0)";
				context.strokeRect(0, 0, this.virtualScreenSize.width, this.virtualScreenSize.height);
			}
			
			//描画する
			this.nowScene.disp(context);
			
			context.restore();
		}
	}
}

//リソースデータ破棄
GameManager.destroy = function() {
	for (var i = 0; i < this.scenes.length; i++) {
		if (this.scenes[i] != null) {
			this.scenes[i].destroy();
		}
	}
	ImageItem.destroy();
	if (this.judgeTimer != null) {
		this.judgeTimer.dispose();
	}
}


GameManager.prototype.getScoreLoader = function() { return this.scoreLoader; }
GameManager.prototype.getSensor = function() { return this.sensor; }
GameManager.prototype.getSoundManager = function() { return this.soundManager; }
GameManager.prototype.getSEManager = function() { return this.seManager; }
GameManager.prototype.getConfig = function() { return this.config; }
GameManager.prototype.getJudgeTimer = function() { return this.judgeTimer; }
GameManager.prototype.getBgImageManager = function() { return this.bgImageManager; }


GameManager.prototype.changeScene = function(sceneName) {
	this.nowScene = this.scenes[sceneName];
	this.initFlag = true;
}
GameManager.prototype.getGameScene = function(sceneName) {
	return this.scenes[sceneName];
}
GameManager.prototype.getScenePlayMaimai = function() {
	return this.getGameScene(GameSceneName.PLAYMAIMAI);
}
GameManager.prototype.getSceneTitle = function() {
	return this.getGameScene(GameSceneName.TITLE);
}
GameManager.prototype.getNowScene = function() {
	return this.nowScene;
}
