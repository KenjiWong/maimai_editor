//==================
// Start Methods
//==================

var gActived;
var glPause;
var settingFile;
function start() {
	gActived = true;
	glPause = false;
	var canvas = document.getElementById("mainCanvas");
	expandCanvas(canvas);
	new MainActivity(canvas);
	settingFile = new File(settingFileLoad);
}

function expandCanvas(in_canvas){
	var b = document.body;
	var d = document.documentElement;
	//画面の大きさに合わせたキャンバスオートリサイズ（ウインドウのリサイズイベントは知らぬ）
	//in_canvas.width = Math.max(b.clientWidth , b.scrollWidth, d.scrollWidth, d.clientWidth);
	//in_canvas.height = Math.max(b.clientHeight , b.scrollHeight, d.scrollHeight, d.clientHeight);
	//上記を起こしているとデバッグめんどいので仮の大きさ
	in_canvas.width = 384;
	in_canvas.height = 512;
}

function playButton_Click() {
	var mActivity = mainActivity;
	var gManager = mActivity.gManager;
	var scenePlayMaimai = mActivity.gManager.getScenePlayMaimai();
	chengeOption();
	var button1 = document.getElementById("play");
	var button2 = document.getElementById("pause");
	var cursorStartOptionCheckBox = document.getElementById("cursorStartOption");
	var textArea = document.scoreform.notes;
	var fmen = textArea.value;
	var difficulty = Number(document.getElementById("difficultyinput").value) - 1;
	if (isNaN(difficulty) || difficulty < 0 || difficulty > 4) {
		window.alert("Play for &inote_ に1～5を入力してください。");
		return;
	}
	if (!glPause) {
		//gManager.getUserTrackManager().setFileName(gManager.getScoreLoader().getStrTrackFileName());
		gManager.getScoreLoader().FileLoad(fmen);
		if (scenePlayMaimai.setNotes(difficulty)) {
			if (cursorStartOptionCheckBox.checked) {
				var iniTime = gManager.getScoreLoader().timeOfTextCursorPlace(fmen, difficulty, textArea.selectionStart);
				if (iniTime < 0) {
					scenePlayMaimai.seekTime = 0;
					window.alert("カーソルが &inote_" + (difficulty + 1) + " より外側に存在するためシークできません。\r\n最初から再生します。");
				}
				else {
					scenePlayMaimai.seekTime = iniTime;
				}
			}
			else {
				scenePlayMaimai.seekTime = 0;
			}
			gManager.changeScene(GameSceneName.PLAYMAIMAI);
			
			button1.value = "STOP";
			button2.value = "PAUSE";
			glPause = !glPause;
		}
		else {
			window.alert(gManager.getScoreLoader().getLastErrorMessage());
		}
	}
	else
	{
		mActivity.gManager.changeScene(GameSceneName.TITLE);
		mActivity.gManager.getScenePlayMaimai().seekTime = 0;
		mActivity.gManager.getSoundManager().pause();
		
		button1.value = "PLAY";
		button2.value = "PAUSE";
		glPause = !glPause;
	}
	button2.disabled = !glPause;
	
}

function onGameFinishedGuiAction() {
	var button1 = document.getElementById("play");
	var button2 = document.getElementById("pause");
	button1.value = "PLAY";
	button2.value = "RESUME";
	mainActivity.gManager.getScenePlayMaimai().seekTime = 0;
	glPause = false;
	button2.disabled = !glPause;
	mainActivity.gManager.getSoundManager().pause();
}

function pauseButton_Click() {
	var mActivity = mainActivity;
	if (mActivity.gManager.getNowScene() == mActivity.gManager.getScenePlayMaimai()) {
		mActivity.gManager.getScenePlayMaimai().gamePausingChange();
	}
	var button2 = document.getElementById("pause");
	if (mActivity.gManager.getScenePlayMaimai().pause) button2.value = "RESUME";
	else button2.value = "PAUSE";
	chengeOption();
}

function chengeOption() {
	//オプションの反映
	//ガイドスピード
	var guideSpeed = Number(document.getElementById("guidespeedinput").value);
	if (!isNaN(guideSpeed)) {
		mainActivity.gManager.getConfig().getPlayer1Setting().setGuideSpeed(guideSpeed);
	}
	else {
		mainActivity.gManager.getConfig().getPlayer1Setting().setGuideSpeed(0.5);
	}
	//マーカーサイズ
	var markerSize = Number(document.getElementById("markersizeinput").value);
	if (!isNaN(guideSpeed)) {
		mainActivity.gManager.getConfig().getPlayer1Setting().setMarkerSize(markerSize);
	}
	else {
		mainActivity.gManager.getConfig().getPlayer1Setting().setMarkerSize(0.75);
	}
	//センサー描画
	var drawableSensor = document.getElementById("drawsensoroption").checked;
	mainActivity.gManager.getConfig().getPlayer1Setting().setDrawableSensors(drawableSensor);
}

function saveMaidata() {
	var textArea = document.scoreform.notes;
	var data = textArea.value;
	
	//ファイルを作成
	var b = new Blob([data],{type:"text/plain"});
	
	//a要素を作る
	var a = document.createElement('a');
	//ダウンロードする名前をセット
	a.download = "maidata.txt";
	//ダウンロードするファイルをセット
	a.href = window.URL.createObjectURL(b);
	
	//イベントを作る
	var e = document.createEvent('MouseEvent');
	e.initEvent("click",true,true);
	//a要素をクリック
	a.dispatchEvent(e);
}

function settingFileLoad(res) {
	//ファイルの情報をセット
	mainActivity.gManager.getConfig().loadSettingFile(res);
	//オプションからの反映
	//ガイドスピード
	document.getElementById("guidespeedinput").value = mainActivity.gManager.getConfig().getPlayer1Setting().getGuideSpeed();
	//マーカーサイズ
	document.getElementById("markersizeinput").value = mainActivity.gManager.getConfig().getPlayer1Setting().getMarkerSize();
	//センサー描画
	document.getElementById("drawsensoroption").checked = mainActivity.gManager.getConfig().getPlayer1Setting().isDrawableSensors();
}
