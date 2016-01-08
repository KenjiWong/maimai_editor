//==================
// GameConfig
//==================

function GameConfig() { 
	this.player1Setting = new GameSetting(""); //プレイヤー1の設定
	this.player2Setting = new GameSetting("2"); //プレイヤー2の設定
	
	this.answerSoundEnabled = new AnswerSoundInfomation(); //アンサーサウンドオプション
	this.setAnswerSoundEnabled(AnswerSoundInfomation.SPECIALPLUS);
	this.brightness = 128; //ブライトネスオプション
	this.drawCammaCountEnabled = false; //カンマ数表示オプション
	this.changeTapToBreak = false; //タップをブレークへ変えるオプション。スコアはセーブされない。
	this.upScreenDrawJudgeEffectEnabeld = true; //上画面にエフェクトを描画するか
	this.howToCheckTouch = new HowToCheckTouchInfomation(); //タッチのチェック方法オプション
	this.touchAllowableRadius = 10; //タッチの許容範囲
	this.useArmChecker = new UseArmCheckerInfomation(); //腕数チェッカーのモード
	this.lastPlayedMusicIndex = 0; //最後に遊んだ曲インデックス
	this.lastPlayedDifficulty = 0; //最後に遊んだ難易度
	this.answerSoundOffset = 0; //アンサーサウンドの音ズレ補正
	this.practiceSeekTime = 0; //練習モードのシーク時間
	this.practiceJumpTime = 0; //練習モードのジャンプ時間
	this.playMaimaiMode = new PlayMaimaiMode(); //プレーモード選択
	this.startCountEnabled = true; //スタートカウントを鳴らすのを許可
}

GameConfig.prototype.getPlayer1Setting = function() { return this.player1Setting; }
GameConfig.prototype.getPlayer2Setting = function() { return this.player2Setting; }

GameConfig.prototype.getAnswerSoundEnabled = function() { return this.answerSoundEnabled.Get(); } 
GameConfig.prototype.getBrightness = function() { return this.brightness > -1 && this.brightness < 256 ? this.brightness : 255; } 
GameConfig.prototype.getDrawCammaCountEnabled = function() { return this.drawCammaCountEnabled; } 
GameConfig.prototype.getChangeTapToBreak = function() { return this.changeTapToBreak; } 
GameConfig.prototype.getUpScreenDrawJudgeEffectEnabeld = function() { return this.upScreenDrawJudgeEffectEnabeld; }
GameConfig.prototype.getHowToCheckTouch = function() { return this.howToCheckTouch.Get(); } 
GameConfig.prototype.getTouchAllowableRadius = function() { return this.touchAllowableRadius; }
GameConfig.prototype.getUseArmChecker = function() { return this.useArmChecker.Get(); }
GameConfig.prototype.getLastPlayedMusicIndex = function() { return this.lastPlayedMusicIndex; }
GameConfig.prototype.getLastPlayedDifficulty = function() { return this.lastPlayedDifficulty; } 
GameConfig.prototype.getAnswerSoundOffset = function() { return this.answerSoundOffset; } 
GameConfig.prototype.getPracticeSeekTime = function() { return this.practiceSeekTime; }
GameConfig.prototype.getPracticeJumpTime = function() { return this.practiceJumpTime; }
GameConfig.prototype.getPlayMaimaiMode = function() { return this.playMaimaiMode.Get(); }
GameConfig.prototype.getStartCountEnabled = function() { return this.startCountEnabled; }

//互換 1Pのみプレー時のデカイやつ専用
GameConfig.prototype.getDrawButtonPushEffectEnabled_SinglePlay = function() { return this.getPlayer1Setting().isDrawButtonPushEffectEnabled(); }
GameConfig.prototype.getDrawableSensors_SinglePlay = function() { return this.getPlayer1Setting().isDrawableSensors(); }

GameConfig.prototype.setAnswerSoundEnabled = function(value) { this.answerSoundEnabled.Set(value); } 
GameConfig.prototype.setBrightness = function(value) { this.brightness = value; } 
GameConfig.prototype.setDrawCammaCountEnabled = function(value) { this.drawCammaCountEnabled = value; } 
GameConfig.prototype.setChangeTapToBreak = function(value) { this.changeTapToBreak = value; } 
GameConfig.prototype.setUpScreenDrawJudgeEffectEnabeld = function(value) { this.upScreenDrawJudgeEffectEnabeld = value; }
GameConfig.prototype.setHowToCheckTouch = function(value) { this.howToCheckTouch.Set(value); } 
GameConfig.prototype.setTouchAllowableRadius = function(value) { this.touchAllowableRadius = value; }
GameConfig.prototype.setUseArmChecker = function(value) { this.useArmChecker.Set(value); }
GameConfig.prototype.setLastPlayedMusicIndex = function(value) { this.lastPlayedMusicIndex = value; }
GameConfig.prototype.setLastPlayedDifficulty = function(value) { this.lastPlayedDifficulty = value; } 
GameConfig.prototype.setAnswerSoundOffset = function(value) { this.answerSoundOffset = value; }
GameConfig.prototype.setPracticeSeekTime = function(value) { this.practiceSeekTime = value; }
GameConfig.prototype.setPracticeJumpTime = function(value) { this.practiceJumpTime = value; }
GameConfig.prototype.setPlayMaimaiMode = function(value) { this.playMaimaiMode.Set(value); }
GameConfig.prototype.setStartCountEnabled = function(value) { this.startCountEnabled = value; }

GameConfig.prototype.reverseDrawCammaCountEnabled = function() { this.drawCammaCountEnabled = !this.drawCammaCountEnabled; } 
GameConfig.prototype.reverseChangeTapToBreak = function() { this.changeTapToBreak = !this.changeTapToBreak; } 
GameConfig.prototype.reverseUpScreenDrawJudgeEffectEnabeld = function() { this.upScreenDrawJudgeEffectEnabeld = !this.upScreenDrawJudgeEffectEnabeld; }
GameConfig.prototype.reverseStartCountEnabled = function() { this.startCountEnabled = !this.startCountEnabled; }

GameConfig.prototype.nextAnswerSoundEnabled = function() { this.answerSoundEnabled.Next(); } 
GameConfig.prototype.nextHowToCheckTouch = function() { this.howToCheckTouch.Next(); } 
GameConfig.prototype.nextUseArmChecker = function() { this.useArmChecker.Next(); }
GameConfig.prototype.nextPlayMaimaiMode = function() { this.playMaimaiMode.Next(); } 
GameConfig.prototype.nextBrightness = function() {
	if (this.getBrightness() < 255) {
		this.brightness++;
	}
} 
GameConfig.prototype.nextTouchAllowableRadius = function() {
	if (this.getTouchAllowableRadius() < 128) { 
		this.touchAllowableRadius++;
	}
}
GameConfig.prototype.nextAnswerSoundOffset = function() { 
	if (Math.floor(this.getAnswerSoundOffset() * 100) + 1 < 100) {
		this.answerSoundOffset += 0.01;
	}
}

GameConfig.prototype.prevAnswerSoundEnabled = function() { this.answerSoundEnabled.Prev(); } 
GameConfig.prototype.prevHowToCheckTouch = function() { this.howToCheckTouch.Prev(); } 
GameConfig.prototype.prevUseArmChecker = function() { this.useArmChecker.Prev(); }
GameConfig.prototype.prevPlayMaimaiMode = function() { this.playMaimaiMode.Prev(); } 

GameConfig.prototype.prevBrightness = function() {
	if (this.getBrightness() > 0) {
		this.brightness--;
	}
} 
GameConfig.prototype.prevTouchAllowableRadius = function() {
	if (this.getTouchAllowableRadius() > 0) {
		this.touchAllowableRadius--;
	}
}
GameConfig.prototype.prevAnswerSoundOffset = function() { 
	if (Math.floor(this.getAnswerSoundOffset() * 100) - 1 >= 0) {
		this.answerSoundOffset -= 0.01;
	}
}

GameConfig.prototype.loadSettingFile = function(res) {
	if (this.player1Setting != null) {
		this.player1Setting.loadSettingFile(res);
	}
	if (this.player2Setting != null) {
		this.player2Setting.loadSettingFile(res);
	}
	
	var textIndex = 0;
	var textLength = res.length;
	var sub = "";
	var macros = this.getSaveSettingMacroName();
	var macroret = [];
	for (var m = 0; m < macros.length; m++) macroret.push("");
	while (textIndex < textLength) {
		sub += res.substr(textIndex, 1);
		//変な文字列があっても、改行したら無視されるように。
		if (sub.substr(sub.length-1) == "\r") {
			sub = "";
		}
		else if (sub.substr(sub.Length-1) == "\n") {
			sub = "";
		}
		//コメントがあったら改行まで飛ばす
		else if (sub == ">>" || sub == "//") {
			sub = ""; textIndex++;
			while (textIndex < textLength) {
				var sub2 = res.substr(textIndex, 1);
				if (sub2 == "\n") { break; }
				textIndex++;
			}
		}
		else {
			for (var m = 0; m < macros.length; m++) {
				if (sub.toLowerCase() == macros[m].toLowerCase()) {
					sub = ""; textIndex++;
					while (textIndex < textLength) {
						var sub2 = res.substr(textIndex, 1);
						if (sub2 == "\n" || sub2 == "\r") { break; }
						sub += sub2; textIndex++;
					}
					macroret[m] = sub; sub = "";
					break;
				}
			}
		}
	
		textIndex++;
	}

	this.answerSoundEnabled.Set(DirectFileIO.parseNumber(macroret[0], AnswerSoundInfomation.OFF));
	this.brightness = DirectFileIO.parseNumber(macroret[1], 255);
	this.drawCammaCountEnabled = DirectFileIO.parseBoolean(macroret[2], false);
	this.lastPlayedMusicIndex = DirectFileIO.parseNumber(macroret[3], 0);
	this.lastPlayedDifficulty = DirectFileIO.parseNumber(macroret[4], 0);
	this.answerSoundOffset = DirectFileIO.parseNumber(macroret[5], 0.15);
	this.filelistPath = macroret[6] != null ? macroret[6] : "";
	this.changeTapToBreak = DirectFileIO.parseBoolean(macroret[7], false);
	this.howToCheckTouch.Set(DirectFileIO.parseNumber(macroret[8], HowToCheckTouchInfomation.DETAIL));
	this.touchAllowableRadius = DirectFileIO.parseNumber(macroret[9], 10);
	this.useArmChecker.Set(DirectFileIO.parseNumber(macroret[10], UseArmCheckerInfomation.OFF));
	this.upScreenDrawJudgeEffectEnabeld = DirectFileIO.parseBoolean(macroret[11], false);
	this.practiceSeekTime = DirectFileIO.parseNumber(macroret[12], 0);
	this.practiceJumpTime = DirectFileIO.parseNumber(macroret[13], 0);
	this.playMaimaiMode.Set(DirectFileIO.parseNumber(macroret[14], PlayMaimaiMode.SINGLE));
	this.startCountEnabled = DirectFileIO.parseBoolean(macroret[15], true);
}

GameConfig.prototype.getSaveSettingMacroName = function() {
	return [
		"&answersound=", "&brightness=", 
		"&cammacount=", "&lastplayedindex=", "&lastplayeddifficulty=", 
		"&answersoundoffset=", "&filelistpath=", "&changetaptobreak=", 
		"&howtochecktouch=", "&touchallowableradius=", "&usearmcheckermode=", 
		"&upscreendrawjudgeeffect=", "&practiceseektime=", "&practicejumptime=",
		"&playmaimaimode=", "&startcount=",
	];
}

// Answer Sound Infomation
function AnswerSoundInfomation() {
	this.value = AnswerSoundInfomation.SPECIALPLUS;
}
AnswerSoundInfomation.OFF = 0;
AnswerSoundInfomation.BASIS = 1;
AnswerSoundInfomation.BASISPLUS = 2;
AnswerSoundInfomation.SPECIAL = 3;
AnswerSoundInfomation.SPECIALPLUS = 4;
AnswerSoundInfomation.MAX = 5;
AnswerSoundInfomation.prototype.Next = function() {
	this.value++;
	this.value %= AnswerSoundInfomation.MAX;
}
AnswerSoundInfomation.prototype.Prev = function() {
	this.value += AnswerSoundInfomation.MAX - 1;
	this.value %= AnswerSoundInfomation.MAX;
}
AnswerSoundInfomation.prototype.Get = function() {
	return this.value;
}
AnswerSoundInfomation.prototype.Set = function(value) {
	this.value = value;
}
AnswerSoundInfomation.prototype.ToString = function() {
	return
		this.value == AnswerSoundInfomation.OFF ? "OFF" :
		this.value == AnswerSoundInfomation.BASIS ? "BASIS" :
		this.value == AnswerSoundInfomation.BASISPLUS ? "BASISPLUS" :
		this.value == AnswerSoundInfomation.SPECIAL ? "SPECIAL" :
		this.value == AnswerSoundInfomation.SPECIALPLUS ? "SPECIALPLUS" :
		"OFF";
}

// How To Check Touch Infomation
function HowToCheckTouchInfomation() {
	this.value = HowToCheckTouchInfomation.DETAIL;
}
HowToCheckTouchInfomation.SIMPLE = 0;
HowToCheckTouchInfomation.DETAIL = 1;
HowToCheckTouchInfomation.MAX = 2;
HowToCheckTouchInfomation.prototype.Next = function() {
	this.value++;
	this.value %= HowToCheckTouchInfomation.MAX;
}
HowToCheckTouchInfomation.prototype.Prev = function() {
	this.value += HowToCheckTouchInfomation.MAX - 1;
	this.value %= HowToCheckTouchInfomation.MAX;
}
HowToCheckTouchInfomation.prototype.Get = function() {
	return this.value;
}
HowToCheckTouchInfomation.prototype.Set = function(value) {
	this.value = value;
}
HowToCheckTouchInfomation.prototype.ToString = function() {
	return
		this.value == HowToCheckTouchInfomation.SIMPLE ? "SIMPLE" :
		this.value == HowToCheckTouchInfomation.DETAIL ? "DETAIL" :
		"DETAIL";
}

// Use Arm Checker Infomation
function UseArmCheckerInfomation() {
	this.value = UseArmCheckerInfomation.OFF;
}
UseArmCheckerInfomation.OFF = 0;
UseArmCheckerInfomation.STANDARD = 1;
UseArmCheckerInfomation.CRUDESLIDE = 2;
UseArmCheckerInfomation.REALSLIDE = 3;
UseArmCheckerInfomation.SMARTSLIDE = 4;
UseArmCheckerInfomation.MAX = 5;
UseArmCheckerInfomation.prototype.Next = function() {
	this.value++;
	this.value %= UseArmCheckerInfomation.MAX;
}
UseArmCheckerInfomation.prototype.Prev = function() {
	this.value += UseArmCheckerInfomation.MAX - 1;
	this.value %= UseArmCheckerInfomation.MAX;
}
UseArmCheckerInfomation.prototype.Get = function() {
	return this.value;
}
UseArmCheckerInfomation.prototype.Set = function(value) {
	this.value = value;
}
UseArmCheckerInfomation.prototype.ToString = function() {
	return
		this.value == UseArmCheckerInfomation.OFF ? "OFF" :
		this.value == UseArmCheckerInfomation.STANDARD ? "STANDARD" :
		this.value == UseArmCheckerInfomation.CRUDESLIDE ? "CRUDESLIDE" :
		this.value == UseArmCheckerInfomation.REALSLIDE ? "REALSLIDE" :
		this.value == UseArmCheckerInfomation.SMARTSLIDE ? "SMARTSLIDE" :
		"OFF";
}

// Play Maimai Mode Infomation
function PlayMaimaiMode() {
	this.value = PlayMaimaiMode.SINGLE;
}
PlayMaimaiMode.SINGLE = 0;
PlayMaimaiMode.PRACTICE = 1;
PlayMaimaiMode.SYNC = 2;
PlayMaimaiMode.MAX = 3;
PlayMaimaiMode.prototype.Next = function() {
	this.value++;
	this.value %= PlayMaimaiMode.MAX;
}
PlayMaimaiMode.prototype.Prev = function() {
	this.value += PlayMaimaiMode.MAX - 1;
	this.value %= PlayMaimaiMode.MAX;
}
PlayMaimaiMode.prototype.Get = function() {
	return this.value;
}
PlayMaimaiMode.prototype.Set = function(value) {
	this.value = value;
}
PlayMaimaiMode.prototype.ToString = function() {
	return
		this.value == PlayMaimaiMode.SINGLE ? "SINGLE" :
		this.value == PlayMaimaiMode.PRACTICE ? "PRACTICE" :
		this.value == PlayMaimaiMode.SYNC ? "SYNC" :
		"SINGLE";
}
