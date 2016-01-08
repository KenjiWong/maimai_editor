//==================
// GameSetting
//==================

function GameSetting(uniqueId) { 
	this.uniqueId = uniqueId;
	this.soundEffectEnabled = new SoundEffectInfomation(); //サウンドエフェクトオプション
	this.mirrorCustom = false; //スコア反転オプション
	this.turnCustom = 0; //スコア回転オプション
	this.guideSpeed = 0.50; //ガイドスピードオプション
	this.starRotation = true; //スターローテーションオプション
	this.markerSize = 0.75; //マーカーサイズオプション
	this.angulatedHold = true; //ホールドの先端を角ばらせる
	this.slideMarkerSizeAdaptation = false; //スライドマーカーにマーカーサイズオプションを適応する
	this.bgInfo = new BackGroundInfomation(); //画面中央の表示タイプオプション
	this.usAchvInfo = new UpScreenAchievementInfomation(); //上画面の達成率表示タイプ
	this.setBgInfo(BackGroundInfomation.COMBO);
	this.holdViewerEnabled = false; //ホールドをミスしても終点まで表示するオプション
	this.showTapFastSlow = false; //タップ系のグレ・グドの早い遅いを表示するオプション
	this.rawButtonPushEffectEnabled = false; //ボタンをプッシュしたときのエフェクト描画オプション
	this.drawableSensors = true; //センサーを描画する
	this.oldTypeSensor = false; //旧式センサー(円で判定)
	this.slideMarkerAutoDelete = true; //スライドマーカーを☆の動きに合わせて消すオプション
	this.evaluateVisible = true; //判定を表示する
	this.autoPlay = true; //オートプレーオプション
	this.narration = false; //声ONOFFオプション
}

GameSetting.prototype.getSoundEffectEnabled = function() { return this.soundEffectEnabled.Get(); }
GameSetting.prototype.getMirrorCustom = function() { return this.mirrorCustom; }
GameSetting.prototype.getTurnCustom = function() { return this.turnCustom; } 
GameSetting.prototype.getGuideSpeed = function() { return this.guideSpeed > 0 ? this.guideSpeed : 0.8; } 
GameSetting.prototype.getBgInfo = function() { return this.bgInfo.Get(); }
GameSetting.prototype.getUsAchvInfo = function() { return this.usAchvInfo.Get(); }
GameSetting.prototype.getUsAchvInfoName = function() { return this.usAchvInfo.ToString(); }
GameSetting.prototype.getStarRotation = function() { return this.starRotation; } 
GameSetting.prototype.getMarkerSize = function() { return this.markerSize; } 
GameSetting.prototype.isAngulatedHold = function() { return this.angulatedHold; } 
GameSetting.prototype.isHoldViewerEnabled = function() { return this.holdViewerEnabled; }
GameSetting.prototype.isShowTapFastSlow = function() { return this.showTapFastSlow; } 
GameSetting.prototype.isDrawButtonPushEffectEnabled = function() { return this.drawButtonPushEffectEnabled; } 
GameSetting.prototype.isDrawableSensors = function() { return this.drawableSensors; }
GameSetting.prototype.isSlideMarkerSizeAdaptation = function() { return this.slideMarkerSizeAdaptation; }
GameSetting.prototype.isOldTypeSensor = function() { return this.oldTypeSensor; } 
GameSetting.prototype.isSlideMarkerAutoDelete = function() { return this.slideMarkerAutoDelete; }
GameSetting.prototype.isEvaluateVisible = function() { return this.evaluateVisible; }
GameSetting.prototype.isAutoPlay = function() { return this.autoPlay; }
GameSetting.prototype.isNarration = function() { return this.narration; }

GameSetting.prototype.setSoundEffectEnabled = function(value) { this.soundEffectEnabled.Set(value); }
GameSetting.prototype.setMirrorCustom = function(value) { this.mirrorCustom = value; }
GameSetting.prototype.setTurnCustom = function(value) { this.turnCustom = value; } 
GameSetting.prototype.setGuideSpeed = function(value) { this.guideSpeed = value; } 
GameSetting.prototype.setBgInfo = function(value) { this.bgInfo.Set(value); }
GameSetting.prototype.setUsAchvInfo = function(value) { this.usAchvInfo.Set(value); }
GameSetting.prototype.setStarRotation = function(value) { this.starRotation = value; } 
GameSetting.prototype.setMarkerSize = function(value) { this.markerSize = value; } 
GameSetting.prototype.setAngulatedHold = function(value) { this.angulatedHold = value; } 
GameSetting.prototype.setHoldViewerEnabled = function(value) { this.holdViewerEnabled = value; }
GameSetting.prototype.setShowTapFastSlow = function(value) { this.showTapFastSlow = value; } 
GameSetting.prototype.setDrawButtonPushEffectEnabled = function(value) { this.drawButtonPushEffectEnabled = value; } 
GameSetting.prototype.setDrawableSensors = function(value) { this.drawableSensors = value; } 
GameSetting.prototype.setSlideMarkerSizeAdaptation = function(value) { this.slideMarkerSizeAdaptation = value; } 
GameSetting.prototype.setOldTypeSensor = function(value) { this.oldTypeSensor = value; }
GameSetting.prototype.setSlideMarkerAutoDelete = function(value) { this.slideMarkerAutoDelete = value; }
GameSetting.prototype.setEvaluateVisible = function(value) { this.evaluateVisible = value; }
GameSetting.prototype.setAutoPlay = function(value) { this.autoPlay = value; }
GameSetting.prototype.setNarration = function(value) { this.narration = value; }

GameSetting.prototype.reverseMirrorCustom = function() { this.mirrorCustom = !this.mirrorCustom; }
GameSetting.prototype.reverseStarRotation = function() { this.starRotation = !this.starRotation; } 
GameSetting.prototype.reverseAngulatedHold = function() { this.angulatedHold = !this.angulatedHold; } 
GameSetting.prototype.reverseHoldViewerEnabled = function() { this.holdViewerEnabled = !this.holdViewerEnabled; }
GameSetting.prototype.reverseShowTapFastSlow = function() { this.showTapFastSlow = !this.showTapFastSlow; } 
GameSetting.prototype.reverseDrawButtonPushEffectEnabled = function() { this.drawButtonPushEffectEnabled = !this.drawButtonPushEffectEnabled; } 
GameSetting.prototype.reverseDrawableSensors = function() { this.drawableSensors = !this.drawableSensors; } 
GameSetting.prototype.reverseSlideMarkerSizeAdaption = function() { this.slideMarkerSizeAdaptation = !this.slideMarkerSizeAdaptation; }
GameSetting.prototype.reverseOldTypeSensor = function() { this.oldTypeSensor = !this.oldTypeSensor; } 
GameSetting.prototype.reverseSlideMarkerAutoDelete = function() { this.slideMarkerAutoDelete = !this.slideMarkerAutoDelete; }
GameSetting.prototype.reverseEvaluateVisible = function() { this.evaluateVisible = !this.evaluateVisible; }
GameSetting.prototype.reverseAutoPlay = function() { this.autoPlay = !this.autoPlay; }
GameSetting.prototype.reverseNarration = function() { this.narration = !this.narration; }

GameSetting.prototype.nextSoundEffectEnabled = function() { this.soundEffectEnabled.Next(); } 
GameSetting.prototype.nextBgInfo = function() { this.bgInfo.Next(); }
GameSetting.prototype.nextUsAchvInfo = function() { this.usAchvInfo.Next(); }
GameSetting.prototype.nextTurnCustom = function() {
	this.turnCustom++;
	this.turnCustom %= 8;
}
GameSetting.prototype.nextGuideSpeed = function() {
	if (Math.floor(this.getGuideSpeed() * 100) + 1 < 100) {
		this.guideSpeed += 0.01;
	}
} 
GameSetting.prototype.nextMarkerSize = function() {
	if (Math.floor(this.getMarkerSize() * 100) + 1 < 200) {
		this.markerSize += 0.01;
	}
}
GameSetting.prototype.prevSoundEffectEnabled = function() { this.soundEffectEnabled.Prev(); } 
GameSetting.prototype.prevBgInfo = function() { this.bgInfo.Prev(); }
GameSetting.prototype.prevUsAchvInfo = function() { this.usAchvInfo.Prev(); }
GameSetting.prototype.prevTurnCustom = function() {
	this.turnCustom += 7;
	this.turnCustom %= 8;
}
GameSetting.prototype.prevGuideSpeed = function() {
	if (Math.floor(this.getGuideSpeed() * 100) - 1 > 0) {
		this.guideSpeed -= 0.01;
	}
} 
GameSetting.prototype.prevMarkerSize = function() {
	if (Math.floor(this.getMarkerSize() * 100) - 1 > 0) {
		this.markerSize -= 0.01;
	}
}

GameSetting.prototype.loadSettingFile = function(res) {
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

	this.mirrorCustom = DirectFileIO.parseBoolean(macroret[0], false);
	this.turnCustom = DirectFileIO.parseNumber(macroret[1], 0);
	this.guideSpeed = DirectFileIO.parseNumber(macroret[2], 0.8);
	this.bgInfo.Set(DirectFileIO.parseNumber(macroret[3], BackGroundInfomation.NONE));
	this.starRotation = DirectFileIO.parseBoolean(macroret[4], false);
	var msm = DirectFileIO.parseNumber(macroret[5], 1);
	this.markerSize = msm > 0 && msm <= 2 ? msm : 1;
	this.holdViewerEnabled = DirectFileIO.parseBoolean(macroret[6], false);
	this.showTapFastSlow = DirectFileIO.parseBoolean(macroret[7], false);
	this.drawButtonPushEffectEnabled = DirectFileIO.parseBoolean(macroret[8], false);
	this.angulatedHold = DirectFileIO.parseBoolean(macroret[9], false);
	this.drawableSensors = DirectFileIO.parseBoolean(macroret[10], false);
	this.slideMarkerSizeAdaptation = DirectFileIO.parseBoolean(macroret[11], false);
	this.oldTypeSensor = DirectFileIO.parseBoolean(macroret[12], false);
	this.slideMarkerAutoDelete = DirectFileIO.parseBoolean(macroret[13], false);
	this.evaluateVisible = DirectFileIO.parseBoolean(macroret[14], true);
	this.autoPlay = DirectFileIO.parseBoolean(macroret[15], false);			
	this.soundEffectEnabled.Set(DirectFileIO.parseNumber(macroret[16], SoundEffectInfomation.OFF));
	this.usAchvInfo.Set(DirectFileIO.parseNumber(macroret[17], UpScreenAchievementInfomation.STANDARD));
	this.narration = DirectFileIO.parseBoolean(macroret[18], true);
}

GameSetting.prototype.getSaveSettingMacroName = function() {
	var ret = [
		"mirrorcustom", "turncustom", "guidespeed", "bginfo",
		"starrotation", "markersize", "holdfullview", "showtapfastslow",
		"buttonseffect", "angulatedhold", "drawablesensors", "slidemarkersizeadaption", 
		"oldtypesensor", "slidemarkerautodelete", "evaluatevisible", "autoplay", "soundeffect", 
		"usachvinfo", "narration", 
	];
	for (var i in ret) {
		ret[i] = "&" + ret[i] + this.uniqueId + "=";
	}
	return ret;
}

// Sound Effect Infomation

function SoundEffectInfomation() {
	this.value = SoundEffectInfomation.OFF;
}
SoundEffectInfomation.OFF = 0;
SoundEffectInfomation.ON = 1;
SoundEffectInfomation.BREAKONLY = 2;
SoundEffectInfomation.MAX = 3;
SoundEffectInfomation.prototype.Next = function() {
	this.value++;
	this.value %= SoundEffectInfomation.MAX;
}
SoundEffectInfomation.prototype.Prev = function() {
	this.value += SoundEffectInfomation.MAX - 1;
	this.value %= SoundEffectInfomation.MAX;
}
SoundEffectInfomation.prototype.Get = function() {
	return this.value;
}
SoundEffectInfomation.prototype.Set = function(value) {
	this.value = value;
}
SoundEffectInfomation.prototype.ToString = function() {
	return
		this.value == SoundEffectInfomation.OFF ? "OFF" :
		this.value == SoundEffectInfomation.ON ? "ON" :
		this.value == SoundEffectInfomation.BREAKONLY ? "2600 ONLY" :
		"OFF";
}


// Back Ground Infomation

function BackGroundInfomation() {
	this.value = BackGroundInfomation.COMBO;
}
BackGroundInfomation.NONE = 0;
BackGroundInfomation.COMBO = 1;
BackGroundInfomation.ACHIEVEMENT = 2;
BackGroundInfomation.SCORE = 3;
BackGroundInfomation.PCOMBO = 4;
BackGroundInfomation.BPCOMBO = 5;
BackGroundInfomation.PACHIEVEMENT = 6;
BackGroundInfomation.HACHIEVEMENT = 7;
BackGroundInfomation.TACHIEVEMENT = 8;
BackGroundInfomation.TPACHIEVEMENT = 9;
BackGroundInfomation.THACHIEVEMENT = 10;
BackGroundInfomation.MAX = 11;
BackGroundInfomation.prototype.Next = function() {
	this.value++;
	this.value %= BackGroundInfomation.MAX;
}
BackGroundInfomation.prototype.Prev = function() {
	this.value += BackGroundInfomation.MAX - 1;
	this.value %= BackGroundInfomation.MAX;
}
BackGroundInfomation.prototype.Get = function() {
	return this.value;
}
BackGroundInfomation.prototype.Set = function(value) {
	this.value = value;
}

BackGroundInfomation.prototype.ToString = function() {
	var t = 
		this.value == BackGroundInfomation.NONE ? "NONE" :
		this.value == BackGroundInfomation.COMBO ? "COMBO" :
		this.value == BackGroundInfomation.ACHIEVEMENT ? "ACHIEVEMENT" :
		this.value == BackGroundInfomation.SCORE ? "SCORE" :
		this.value == BackGroundInfomation.PCOMBO ? "PCOMBO" :
		this.value == BackGroundInfomation.BPCOMBO ? "BPCOMBO" :
		this.value == BackGroundInfomation.PACHIEVEMENT ? "PACE ACHIEVEMENT" :
		this.value == BackGroundInfomation.HACHIEVEMENT ? "HAZARD ACHIEVEMENT" :
		this.value == BackGroundInfomation.TACHIEVEMENT ? "THEOR ACHIEVEMENT" :
		this.value == BackGroundInfomation.TPACHIEVEMENT ? "THEOR PACE ACHIEVEMENT" :
		this.value == BackGroundInfomation.THACHIEVEMENT ? "THEOR HAZARD ACHIEVEMENT" :
		"COMBO";
	return t;
}

// Up Screen Achievement Infomation

function UpScreenAchievementInfomation() {
	this.value = UpScreenAchievementInfomation.STANDARD;
}
UpScreenAchievementInfomation.NONE = 0;
UpScreenAchievementInfomation.STANDARD = 1;
UpScreenAchievementInfomation.PACE = 2;
UpScreenAchievementInfomation.HAZARD = 3;
UpScreenAchievementInfomation.THEOR_STANDARD = 4;
UpScreenAchievementInfomation.THEOR_PACE = 5;
UpScreenAchievementInfomation.THEOR_HAZARD = 6;
UpScreenAchievementInfomation.MAX = 7;
UpScreenAchievementInfomation.prototype.Next = function() {
	this.value++;
	this.value %= UpScreenAchievementInfomation.MAX;
}
UpScreenAchievementInfomation.prototype.Prev = function() {
	this.value += UpScreenAchievementInfomation.MAX - 1;
	this.value %= UpScreenAchievementInfomation.MAX;
}
UpScreenAchievementInfomation.prototype.Get = function() {
	return this.value;
}
UpScreenAchievementInfomation.prototype.Set = function(value) {
	this.value = value;
}

UpScreenAchievementInfomation.prototype.ToString = function() {
	var t = 
		this.value == UpScreenAchievementInfomation.NONE ? "NONE" :
		this.value == UpScreenAchievementInfomation.STANDARD ? "STANDARD ACHV" :
		this.value == UpScreenAchievementInfomation.PACE ? "PACE ACHV" :
		this.value == UpScreenAchievementInfomation.HAZARD ? "HAZARD ACHV" :
		this.value == UpScreenAchievementInfomation.THEOR_STANDARD ? "THEOR STANDARD ACHV" :
		this.value == UpScreenAchievementInfomation.THEOR_PACE ? "THEOR PACE ACHV" :
		this.value == UpScreenAchievementInfomation.THEOR_HAZARD ? "THEOR HAZARD ACHV" :
		"ACHIEVEMENT";
	return t;
}



