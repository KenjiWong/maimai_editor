//==================
// MaimaiStyleDesigner
//==================
function MaimaiStyleDesigner() {
}

//レベル別カラー設定
MaimaiStyleDesigner.levelColor = function(difficulty) {
	var ret;
	if (difficulty == 0)
		ret = new Color(0,0,255,255); //Color.Blue;
	else if (difficulty == 1)
		ret = new Color(0,140,0,255); //Color.FromArgb(0, 140, 0);
	else if (difficulty == 2)
		ret = new Color(255,128,0,255); //Color.FromArgb(255, 128, 0);
	else if (difficulty == 3)
		ret = new Color(255,0,0,255); //Color.Red;
	else if (difficulty == 4)
		ret = new Color(117,21,234,255); //Color.FromArgb(117, 21, 234);
	else
		ret = new Color(128,128,128,255); //Color.Gray;
	return ret;
}

//達成率別カラー設定
MaimaiStyleDesigner.achievementColor = function(percent) {
	if (percent >= 100.0)
		return new Color(254,237,176,255); //Color.FromArgb(0xFE, 0xED, 0xB0); //白金 FEEDB0
	else if (percent >= 94.0) //if (percent >= 85.0f)
		return new Color(230,180,34,255); //Color.FromArgb(0xE6, 0xB4, 0x22); //金 e6b422
	else if (percent >= 80.0) //if (percent >= 55.0f)
		return new Color(192,192,192,255); //Color.FromArgb(0xC0, 0xC0, 0xC0); //銀
	else
		return new Color(184,115,51,255); //Color.FromArgb(0xB8, 0x73, 0x33); //銅 b87333
}

//シンク度別カラー設定
MaimaiStyleDesigner.syncRateColor = function(syncRate) {
	if (syncRate >= 100)
		return new Color(254,237,176,255); //Color.FromArgb(0xFE, 0xED, 0xB0); //白金 FEEDB0
	else if (syncRate >= 90) //if (percent >= 85.0f)
		return new Color(230,180,34,255); //Color.FromArgb(0xE6, 0xB4, 0x22); //金 e6b422
	else if (syncRate >= 70) //if (percent >= 55.0f)
		return new Color(192,192,192,255); //Color.FromArgb(0xC0, 0xC0, 0xC0); //銀
	else
		return new Color(184,115,51,255); //Color.FromArgb(0xB8, 0x73, 0x33); //銅 b87333
}

//スコア文字のカラー
MaimaiStyleDesigner.scoreColor = function() {
	return new Color(15,200,10,255); //Color.FromArgb(15, 200, 10);
}

//ランク文字列
MaimaiStyleDesigner.rankString = function(achievement) {
	if (achievement < 20.0)
		return "D";
	else if (achievement < 55.0)
		return "C";
	else if (achievement < 65.0)
		return "B-";
	else if (achievement < 75.0)
		return "B";
	else if (achievement < 80.0)
		return "B+";
	else if (achievement < 85.0)
		return "A-";
	else if (achievement < 90.0)
		return "A";
	else if (achievement < 94.0)
		return "A+";
	else if (achievement < 97.0)
		return "AA";
	else if (achievement < 100.0)
		return "S";
	else
		return "SS";
}

//シンクランク文字列
MaimaiStyleDesigner.syncRankString = function(syncRate) {
	if (syncRate < 30)
		return "BAD";
	else if (syncRate < 50)
		return "AVERAGE";
	else if (syncRate < 70)
		return "GOOD";
	else if (syncRate < 80)
		return "GREAT";
	else if (syncRate < 90)
		return "EXCELLENT";
	else if (syncRate < 95)
		return "AMAZING";
	else if (syncRate < 97)
		return "MIRACLE";
	else if (syncRate < 100)
		return "ULTIMATE";
	else
		return "PERFECT";
}
