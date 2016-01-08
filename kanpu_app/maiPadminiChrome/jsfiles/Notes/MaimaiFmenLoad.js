//=======================
//  MaimaiFmenLoad
//=======================
function MaimaiFmenLoad(_judgeTimer, _sensor, _setting) {
	this.config = _setting;
	this.judgeTimer = _judgeTimer;
	this.sensor = _sensor;
	this.fmenEasy = "";
	this.fmenBasic = "";
	this.fmenAdvanced = "";
	this.fmenExpert = "";
	this.fmenMaster = "";
	this.lastErrorMessage = "";
	
	this.title = "";
	this.freemsg = "";
	this.wholebpm = "";
	this.elements = ""; //使わないかも
	this.first = ""; //使わないかも
	this.levelEasy = "";
	this.levelBasic = "";
	this.levelAdvanced = "";
	this.levelExpert = "";
	this.levelMaster = "";
	this.fmenEasy = "";
	this.fmenBasic = "";
	this.fmenAdvanced = "";
	this.fmenExpert = "";
	this.fmenMaster = "";
	this.fmenFirstRow = [];
	for (var i = 0; i < 5; i++) this.fmenFirstRow[i] = 0;
	this.bgImageFileName = "";
	this.musicFileName = "";
	this.seek = "";
	this.wait = "";
	this.finishTime = "";
	this.calcedFinishTime = ""; //譜面のカンマとかから求めた終了時間
	this.firstBPM = "";
}

//[]内時間入力形式
var ArmHoldingTimeInputType = {
	GROBAL_BPM: 0,
	LOCAL_BPM: 1,
	DIRECT: 2
}

//[]内時間入力情報格納
function ArmHoldingTimeInfo() {
	this.type = ArmHoldingTimeInputType.GROBAL_BPM;
	//GROBAL_BPM、LOCAL_BPMで使用
	this.basisBeat = 0;
	this.lengthBeat = 0;
	//LOCAL_BPMで使用
	this.armBPM = 0;
	//DIRECTで使用
	this.directTime = 0;
	
	//スライドで使用
	//待ち時間の時間入力タイプ
	this.waittype = ArmHoldingTimeInputType.GROBAL_BPM;
	//typeによって変わるが、いくら待つのか。GROBAL_BPMなら不使用または現在のBPMが入る
	this.wait = 0;
}

MaimaiFmenLoad.prototype.getLastErrorMessage = function() { return this.lastErrorMessage; }
MaimaiFmenLoad.prototype.createLastErrorMessage_withCammaAndRow = function(errorCode, cammaCount, row) {
	this.lastErrorMessage = (cammaCount + 1) + "ノート目 (" + (row + 1) + "行):\r\n譜面エラーコード" + errorCode + "\r\n" + this.errorMessages(errorCode);
}
MaimaiFmenLoad.prototype.createLastErrorMessage_withECode = function(errorCode) {
	this.lastErrorMessage = "譜面エラーコード" + errorCode + "\r\n" + this.errorMessages(errorCode);
}
MaimaiFmenLoad.prototype.createLastErrorMessage_withSFactory = function(factory, cammaCount, row) {
	this.lastErrorMessage = (cammaCount + 1) + "ノート目 (" + (row + 1) + "行):\r\n譜面エラーコード35\r\n" + this.errorMessages(35) + "\r\n" + factory.getErrorMessage();
}
MaimaiFmenLoad.prototype.errorMessages = function(code) {
	var msg = [
		"エラーはありません。",
		"譜面の定義が存在しません。", 
		"(BPM)の値が異常です。",
		"{beat}より前に(BPM)がありません。",
		"{beat}の値が異常です。",
		"ノートを入れる前に(BPM)及び{beat}が必要です。",
		"ボタン番号に異常があります。",
		"Bh[#x]のxの値が異常です。",
		"Bh[x:y]のxの値が異常です。",
		"Bh[x:y]のyの値が異常です。",
		"Bh[x:y]の書式に異常があります。",
		"Bh[x:y]の書式に異常があります。",
		"Bh[x:y]の書式に異常があります。",
		"F-E[x:y]などスライドの書式のEの値が異常です。",
		"F-E[#x]などスライドの書式のxの値が異常です。",
		"F-E[x:y]などスライドの書式のxの値が異常です。",
		"F-E[x:y]などスライドの書式のyの値が異常です。",
		"F-E[x:y]などスライドの書式に異常があります。",
		"F-E[x:y]などスライドの書式に異常があります。",
		"F-E[x:y]などスライドの書式に異常があります。",
		"F-E[x:y]などスライドの書式に異常があります。",
		"F-E[x:y]などスライドの書式に異常があります。",
		"/を使用していない、TapのEachのボタン番号に異常があります。",
		"Bh[x:y]のxの値に0以下は受け付けません。",
		"F-E[x:y]またはF^E[x:y]のxの値に0以下は受け付けません。",
		"スライドの終点の値が異常です。F^E[x:y]のEは、Fから4ボタン番号離すとカーブする方向を定めることができないため禁止です。",
		"Eachのボタンを3つ以上指定しています。ボタンは2つにしてください。",
		"Eachのボタンを3つ以上指定しています。ボタンは2つにしてください。",
		"Eachのボタン番号が一致しています。重複しないボタン番号を入れてください。",
		"(BPM)の値に0以下は受け付けません。",
		"{beat}の値に0以下は受け付けません。",
		"#指定をする前に(BPM)が必要です。",
		"スライドの終点の値が異常です。F^E[x:y]のEは、Fより3ボタン番号または5ボタン番号離してください。",
		"ノートがひとつも存在しません。",
		"終了時間が早すぎるため、やりかけのホールドかスライドが存在しています。",
		"スライド作成エラー",
		"スライド直接入力時のエラーです。入力が中途半端です。",
		"スライド直接入力時のエラーです。始点以外見つかりません。",
		"スライド直接入力時のエラーです。Aの前に-か^が存在しません。",
		"スライド直接入力時のエラーです。Bの前に-か^が存在しません。",
		"スライド直接入力時のエラーです。Cの前に-が存在しません。",
		"スライド直接入力時のエラーです。ボタン番号の前に-か^かAかBが存在しません。",
		"スライド直接入力時のエラーです。-の後はA・B・C、または、^の後はA・B・ボタン番号を入力してください。",
		"スライド直接入力時のエラーです。-の前にボタン番号が存在しません。",
		"スライド直接入力時のエラーです。^の前にボタン番号が存在しません。",
		"スライド直接入力時のエラーです。#の後はAまたはボタン番号を入力してください。",
		"スライド直接入力時のエラーです。>の前にボタン番号が存在しません。",
		"スライド直接入力時のエラーです。<の前にボタン番号が存在しません。",
		"Bh[(t)x:y]のtの値が異常です。",
		"F-E[(t)x:y]などスライドの書式のtの値が異常です。",
		"F-E[(t)x:y]などスライドの書式のxの値が異常です。",
		"F-E[(t)x:y]などスライドの書式のyの値が異常です。",
		"F-E[w/x:y]などスライドの書式のwの値が異常です。",
	];
	return msg[code];
}

MaimaiFmenLoad.prototype.getFirstBPM = function() { return this.firstBPM; } //makeMaimaiNotesした後に最初のBPMが入る。
MaimaiFmenLoad.prototype.getSeek = function() {
	if (this.seek == "") return 0;
	if (!isNaN(this.seek)) return Number(this.seek);
	dp("seek文字列が異常=" + this.seek + "->MaimaiFmenLoad::getSeek");
	return 0;
}
MaimaiFmenLoad.prototype.getWait = function() {
	if (this.wait == "") return 0;
	if (!isNaN(this.wait)) return Number(this.wait);
	dp("wait文字列が異常=" + this.wait + "->MaimaiFmenLoad::getWait");
	return 0;
}
MaimaiFmenLoad.prototype.getFinishTime = function() {
	if (this.finishTime == "") return this.calcedFinishTime;
	if (!isNaN(this.finishTime)) return Number(this.finishTime);
	dp("finishTime文字列が異常=" + this.finishTime + "->MaimaiFmenLoad::getFinishTime");
	return this.calcedFinishTime;
}

MaimaiFmenLoad.prototype.getStrTitle = function() { return this.title; }
MaimaiFmenLoad.prototype.getStrFreeMessage = function() { return this.freemsg; }
MaimaiFmenLoad.prototype.getStrWholeBPM = function() { return this.wholebpm; }
MaimaiFmenLoad.prototype.getStrElements = function() { return this.elements; }
MaimaiFmenLoad.prototype.getStrFirst = function() { return this.first; }
MaimaiFmenLoad.prototype.getStrLevelEasy = function() { return this.levelEasy; }
MaimaiFmenLoad.prototype.getStrLevelBasic = function() { return this.levelBasic; }
MaimaiFmenLoad.prototype.getStrLevelAdvanced = function() { return this.levelAdvanced; }
MaimaiFmenLoad.prototype.getStrLevelExpert = function() { return this.levelExpert; }
MaimaiFmenLoad.prototype.getStrLevelMaster = function() { return this.levelMaster; }
MaimaiFmenLoad.prototype.getStrBackGroundImageFileName = function() { return this.bgImageFileName; }
MaimaiFmenLoad.prototype.getStrTrackFileName = function() { return this.musicFileName; }

//楽譜の内容を受け取って、楽譜を読む
MaimaiFmenLoad.prototype.FileLoad = function(res) {
	this.fmenEasy = "";
	this.fmenBasic = "";
	this.fmenAdvanced = "";
	this.fmenExpert = "";
	this.fmenMaster = "";
	var row = 0;
	var frow = 0; //inote系マクロが書かれてある行
	for (var i = 0; i < 5; i++) this.fmenFirstRow[i] = 0;
	var textIndex = 0;
	var textLength = res.length;
	var sub = "";
	var macros = [
		"title", "freemsg", "wholebpm", "elements", "first",
		"lv_1", "lv_2", "lv_3", "lv_4", "lv_5",
		"bg", "track", "seek", "wait", "finish", 
	];
	var notemacros = ["inote_1", "inote_2", "inote_3", "inote_4", "inote_5"];
	var macroret = [];
	for (var m = 0; m < macros.length; m++) macroret[m] = "";
	var READMODE_CHAOS = 0;
	var READMODE_KEY = 1;
	var READMODE_VALUE = 2;
	var READMODE_NOTES = 3;
	var READMODE_CHAOS_COMMENT = 4;
	var READMODE_NOTES_COMMENT = 5;
	var READMODE_NOTES_COMMENT_BLOCK = 6;
	var readMode = 0;
	var readNoteLevel = 0;
	while (textIndex < textLength) {
		isub = res.substr(textIndex, 1);
		if (isub == "\n") { //改行があったら行カウントする
			row++;
			//コメントモードだったらコメントモード解除
			if (readMode == READMODE_CHAOS_COMMENT) {
				readMode = READMODE_CHAOS;
				textIndex++;
				continue;
			}
			else if (readMode == READMODE_NOTES_COMMENT) {
				readMode = READMODE_NOTES;
				textIndex++;
				continue;
			}
		}
		if (readMode == READMODE_CHAOS) { //混沌モード(モード選択モード)
			if (isub == "&") { //&が存在したらマクロキー読み込みモードへ
				readMode = READMODE_KEY;
			}
			else if (textIndex + 1 < textLength) { //コメントモード移行判定
				var comtxt = res.substr(textIndex, 2);
				if (comtxt == ">>" || comtxt == "//") {
					readMode = READMODE_CHAOS_COMMENT;
				}
			}
		}
		else if (readMode == READMODE_KEY) { //マクロキー読み込みモード
			if (isub == "=") {
				var subl = sub.toLowerCase();
				for (var m = 0; m < notemacros.length; m++) { //ノートマクロの場合
					if (subl == notemacros[m].toLowerCase()) {
						readMode = READMODE_NOTES;
						readNoteLevel = m;
						frow = row;
						sub = "";
						break;
					}
				}
				for (var m = 0; m < macros.length; m++) { //その他のマクロの場合
					if (subl == macros[m].toLowerCase()) {
						readMode = READMODE_VALUE;
						sub = "";
						break;
					}
				}
			}
			//変な文字列があっても、改行したら無視されるように。
			else if (isub == "\r" || isub == "\n") {
				readMode = READMODE_CHAOS;
				sub = "";
			}
			else {
				sub += isub;
			}
		}
		else if (readMode == READMODE_NOTES) { //ノートマクロ値読み込みモード
			if (isub == "E" || isub == "&") { //終了マークまたは次のマクロ読み込み開始ならば、ノートをまとめる
				if (readNoteLevel == 0) { this.fmenEasy = sub; }
				else if (readNoteLevel == 1) { this.fmenBasic = sub; }
				else if (readNoteLevel == 2) { this.fmenAdvanced = sub; }
				else if (readNoteLevel == 3) { this.fmenExpert = sub; }
				else if (readNoteLevel == 4) { this.fmenMaster = sub; }
				this.fmenFirstRow[readNoteLevel] = frow;
				sub = "";
				readMode = READMODE_CHAOS;
				
				//Eではなく&で終了する場合、その&はもう一度読めるようにする
				if (isub == "&") {
					textIndex--;
				}
			}
			else {
				var comtxt = "";
				if (textIndex + 1 < textLength) {
					var comtxt = res.substr(textIndex, 2);
					if (comtxt == ">>" || comtxt == "//") {
						readMode = READMODE_NOTES_COMMENT;
					}
					else if (comtxt == "/*") {
						readMode = READMODE_NOTES_COMMENT_BLOCK;
					}
				}
				if (readMode == READMODE_NOTES) {
					if (isub == "0" || isub == "1" || isub == "2" || isub == "3" || isub == "4" ||
						isub == "5" || isub == "6" || isub == "7" || isub == "8" || isub == "9" ||
						isub == "," || isub == "[" || isub == "]" || isub == "{" || isub == "}" ||
						isub == "(" || isub == ")" || isub == "h" || isub == "b" || isub == "." ||
						isub == "#" || isub == "-" || isub == "^" || isub == ":" || isub == "/" ||
						isub == "\n" ||
						//スライド直接指定
						isub == "A" || isub == "B" || isub == "C" ||
						//simai式GreeNPLUS追加スライド
						isub == ">" || isub == "<" || isub == "v" || isub == "q" || isub == "p" || isub == "s" || isub == "z")
					{
						sub += isub;
						isub = "";
					}
				}
			}
		}
		else if (readMode == READMODE_NOTES_COMMENT_BLOCK) { //ノートマクロのブロックコメントモード
			if (textIndex + 1 < textLength) {
				var comtxt = res.substr(textIndex, 2);
				if (comtxt == "*/") {
					readMode = READMODE_NOTES;
				}
			}
		}
		else if (readMode == READMODE_VALUE) { //その他のマクロ値読み込みモード
			if (isub == "\n") {
				macroret[m] = sub;
				readMode = READMODE_CHAOS;
				sub = "";
			}
			else {
				var comtxt = "";
				if (textIndex + 1 < textLength) comtxt = res.substr(textIndex, 2);
				if (isub == "\r" || comtxt == ">>" || comtxt == "//") { 
					macroret[m] = sub;
					readMode = READMODE_CHAOS_COMMENT;
					sub = "";
				}
				else {
					sub += isub;
				}
			}
		}
		
		textIndex++;
	}
	
	this.title = macroret[0];
	this.freemsg = macroret[1];
	this.wholebpm = macroret[2];
	this.elements = macroret[3];
	this.first = Number(macroret[4]);
	this.levelEasy = macroret[5];
	this.levelBasic = macroret[6];
	this.levelAdvanced = macroret[7];
	this.levelExpert = macroret[8];
	this.levelMaster = macroret[9];
	this.bgImageFileName = macroret[10];
	this.musicFileName = macroret[11];
	this.seek = Number(macroret[12]);
	this.wait = Number(macroret[13]);
	this.finishTime = Number(macroret[14]);
}

//difficulty 0がEasy、4がMasterとして、読み込んだ譜面ファイルからノーツを作成する
MaimaiFmenLoad.prototype.createMaimaiNotes_withDifficultyAndOption = function(difficulty, option) {
	switch (difficulty) {
		case 0: return this.createMaimaiNotes(this.fmenEasy, difficulty, option);
		case 1: return this.createMaimaiNotes(this.fmenBasic, difficulty, option);
		case 2: return this.createMaimaiNotes(this.fmenAdvanced, difficulty, option);
		case 3: return this.createMaimaiNotes(this.fmenExpert, difficulty, option);
		case 4: return this.createMaimaiNotes(this.fmenMaster, difficulty, option);
		default: return null;
	}
}
MaimaiFmenLoad.prototype.createMaimaiNotes_withDifficulty = function(difficulty) {
	return this.createMaimaiNotes_withDifficultyAndOption(difficulty, 0);
}

//譜面からノーツ生成。失敗したらnullが返る
MaimaiFmenLoad.prototype.createMaimaiNotes = function(fmenText, difficulty, option) {
	var info = null;
	var iniActId = option * 0x30; //2PのアクションIDは0x30から
	var setting = option == 0 ? this.config.getPlayer1Setting() : this.config.getPlayer2Setting();
	
	var uniqueId = 0;
	
	this.lastErrorMessage = "";
	this.firstBPM = 0.0;
	var cammaCount = 0; //「,」区切りの数を数える。譜面が編集しやすくなるように。
	var notes = [];
	if (notes.length > 0) notes.clear();
	var fmenlength = fmenText.length;
	var time = 0;
	var bpm = -1;
	var beat = -1;
	var nsub = "";
	var directbpm = false; //BPMの特殊な書き方フラグ(直接秒数入力)
	var directbpmValue = 0.0;
	var row = this.fmenFirstRow[difficulty];
	var settedNote = false; //ノートを1つでもセットしたか
	var armBpmInputing = false; //()がグローバルBPMでないときのフラグ
	
	if (fmenlength == 0) { //何も書かれていなければエラーを出す。
		this.createLastErrorMessage_withECode(1);
		dp("&inote_x=が無いか、その文字以降が無いか。->MaimaiFmenLoad::createMaimaiNotes");
		return null;
	}
	
	var tapToBreak = this.config.getChangeTapToBreak();
	
	for (var i = 0; i < fmenlength; i++) {
		var sub = fmenText.substr(i, 1);
		//行カウント
		if (sub == "\n") {
			row++;
		}
		//(がグローバルBPM指定でないフラグを立てる
		else if (sub == "[") {
			armBpmInputing = true;
			nsub += sub;
		}
		//(がグローバルBPM指定でないフラグを折る
		else if (sub == "]") {
			armBpmInputing = false;
			nsub += sub;
		}
		//(BPM)
		else if (sub == "(" && !armBpmInputing) {
			i++;
			var bpmWriteCnt = 0;
			var sub2 = "";
			while (i < fmenlength) {
				sub = fmenText.substr(i, 1);
				if (bpmWriteCnt == 0) {
					if (sub == "#") {
						if (this.firstBPM > 0) {
							directbpm = true;
							i++;
							sub = fmenText.substr(i, 1);
						}
						else {
							this.createLastErrorMessage_withECode(31);
							dp("#BPMの前にBPMが必要->MaimaiFmenLoad::createMaimaiNotes");
							return null;
						}
					}
					else {
						directbpm = false;
					}
				}
				if (sub != ")") {
					sub2 += sub;
				}
				else {
					var bpml = Number(sub2);
					if (!isNaN(bpml)) {
						if (!(bpml > 0)) {
							this.createLastErrorMessage_withCammaAndRow(29, cammaCount, row);
							dp("BPMがうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
							return null;
						}
						if (bpm < 0) {
							//最初のBPMだったら、それも使ってノート共通情報を作成する。
							this.firstBPM = bpml;
							info = new MaimaiNotesCommonInfoC2(this.judgeTimer, this.sensor, this.config, setting, this.firstBPM);
						}
						if (!directbpm) bpm = bpml;
						else directbpmValue = bpml;
					}
					else {
						this.createLastErrorMessage_withCammaAndRow(2, cammaCount, row);
						dp("BPMがうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
						return null;
					}
					break;
				}
				i++;
				bpmWriteCnt++;
			}
		}
		//{beat}
		else if (sub == "{") {
			//BPMが設定されていなければ失敗
			if (bpm <= 0) {
				this.createLastErrorMessage_withCammaAndRow(3, cammaCount, row);
				dp("beatを入れようとしたがBPMが異常->MaimaiFmenLoad::createMaimaiNotes");
				return null;
			}
			
			i++;
			var sub2 = "";
			while (i < fmenlength) {
				sub = fmenText.substr(i, 1);
				if (sub != "}") {
					sub2 += sub;
				}
				else {
					beat = Number(sub2);
					if (!isNaN(beat)) {
						if (beat < 1) {
							this.createLastErrorMessage_withCammaAndRow(30, cammaCount, row);
							dp("Beatがうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
							return null;
						}
					}
					else {
						this.createLastErrorMessage_withCammaAndRow(4, cammaCount, row);
						dp("Beatがうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
						return null;
					}
					break;
				}
				i++;
			}
		}
		//確定したノート
		else if (sub == ",") {
			//BPMやbeatが設定されていなければ失敗
			if ((bpm < 1 || beat < 1) && !directbpm) {
				this.createLastErrorMessage_withCammaAndRow(5, cammaCount, row);
				dp("ノートを作ろうとしたがBPMかbeatが異常->MaimaiFmenLoad::createMaimaiNotes");
				return null;
			}
			//休符でないならノートを入れる。(このif別にいらないけど、あったらあったでほんのちょっと高速化するから入れとく。)
			if (nsub.length > 0) {
				//共通
				var buttonId = [ -1, -1 ];
				var type;
				if (!tapToBreak) type = [NoteType.CIRCLETAP, NoteType.CIRCLETAP];
				else type = [NoteType.BREAK, NoteType.BREAK];
				//slide用
				var slideButtonId = [-1, -1]; //スライド先のボタン
				var slidePtnTxt = ["-", "-"];
				//var slideUseArc = [false, false];
				//関連ノート時間情報用
				var armHoldingTime = [new ArmHoldingTimeInfo(), new ArmHoldingTimeInfo()];
				//Each用 上記、Maimaiだから2つって決まってるけど増やしたいときはListにすべきだね。
				var useEachIndex = 0;
				//maimaiGreenPlus拡張スライド用
				var InExtendSlide = [null, null];
				
				//スライド方向定義
				var STRAIGHT = 2;
				var CLOCK_CURVE = 1;
				var REVERSE_CLOCK_CURVE = -1;
				var INCOMPREHENSIBLE_CURVE = 0;
				
				var nsublength = nsub.length;
				for (var c = 0; c < nsublength; c++) {
					var nsub1 = nsub.substr(c, 1);
					if (nsub1 == "1" || nsub1 == "2" || nsub1 == "3" || nsub1 == "4" ||
						nsub1 == "5" || nsub1 == "6" || nsub1 == "7" || nsub1 == "8")
					{
						if (!isNaN(nsub1)) {
							buttonId[useEachIndex] = Number(nsub1) - 1;
						}
						else {
							this.createLastErrorMessage_withCammaAndRow(6, cammaCount, row);
							dp("ボタンIDがうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
							return null;
						}
						c++;
						if (c < nsublength) {
							nsub1 = nsub.substr(c, 1);
							//ホールド
							if (nsub1 == "h") {
								type[useEachIndex] = NoteType.HOLDHEAD;
								c++;//『h』の次の文字へ
								if (c < nsublength) {
									nsub1 = nsub.substr(c, 1);
									if (nsub1 == "[") {
										c++;//『[』の次の文字へ
										var nsub2 = "";
										if (c < nsublength) {
											nsub1 = nsub.substr(c, 1);
											if (nsub1 == "#") { //ホールドの長さを直接入力
												armHoldingTime[useEachIndex].type = ArmHoldingTimeInputType.DIRECT;
												c++; //『#』の次の文字へ
												var nsub3 = "";
												while (c < nsublength) {
													nsub1 = nsub.substr(c, 1);
													if (nsub1 != "]") {
														nsub3 += nsub1;
													}
													else {
														if (!isNaN(nsub3)) {
															armHoldingTime[useEachIndex].directTime = Number(nsub3);
														}
														else {
															this.createLastErrorMessage_withCammaAndRow(7, cammaCount, row);
															dp("ホールドの長さの直接入力がうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
															return null;
														}
														break;
													}
													c++;
												}
											}
											else { //直接入力はしないでBPMを使う
												if (nsub1 == "(") { //一時的BPMの指定があるとき
													armHoldingTime[useEachIndex].type = ArmHoldingTimeInputType.LOCAL_BPM;
													c++; //『(』の次の文字へ
													var nsub3 = "";
													while (c < nsublength) {
														nsub1 = nsub.substr(c, 1);
														if (nsub1 != ")") {
															nsub3 += nsub1;
														}
														else {
															var bpml = Number(nsub3);
															if (!isNaN(bpml)) {
																if (!(bpml > 0)) {
																	this.createLastErrorMessage_withCammaAndRow(29, cammaCount, row);
																	dp("ホールドの一時的BPMに0を入れようとした->MaimaiFmenLoad::createMaimaiNotes");
																	return null;
																}
																armHoldingTime[useEachIndex].armBPM = bpml;
															}
															else {
																this.createLastErrorMessage_withCammaAndRow(48, cammaCount, row);
																dp("ホールドの一時的BPM入力がうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
																return null;
															}
															c++; //『)』の次の文字へ
															break;
														}
														c++;
													}
												}
												while (c < nsublength) {
													nsub1 = nsub.substr(c, 1);
													if (nsub1 != ":") {
														nsub2 += nsub1;
													}
													else {
														break;
													}
													c++;
												}
												if (!isNaN(nsub2)) {
													armHoldingTime[useEachIndex].basisBeat = Number(nsub2);
												}
												else {
													this.createLastErrorMessage_withCammaAndRow(8, cammaCount, row);
													dp("ホールドフットの『何分音符が何個分の長さ』の前者がうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
													return null;
												}
												c++; //『:』の次の文字へ
												nsub2 = "";
												while (c < nsublength) {
													nsub1 = nsub.substr(c, 1);
													if (nsub1 != "]") {
														nsub2 += nsub1;
													}
													else {
														break;
													}
													c++;
												}
												if (!isNaN(nsub2)) {
													armHoldingTime[useEachIndex].lengthBeat = Number(nsub2);
												}
												else {
													this.createLastErrorMessage_withCammaAndRow(9, cammaCount, row);
													dp("ホールドフットの『何分音符が何個分の長さ』の後者がうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
													return null;
												}
											}
										}
										else {
											this.createLastErrorMessage_withCammaAndRow(10, cammaCount, row);
											dp("ホールドの書式指定が中途半端。[の後が無い->MaimaiFmenLoad::createMaimaiNotes");
											return null;
										}
									}
									else {
										this.createLastErrorMessage_withCammaAndRow(11, cammaCount, row);
										dp("hの次が[じゃない->MaimaiFmenLoad::createMaimaiNotes");
										return null;
									}
								}
								else {
									this.createLastErrorMessage_withCammaAndRow(12, cammaCount, row);
									dp("ホールドの書式指定が中途半端->MaimaiFmenLoad::createMaimaiNotes");
									return null;
								}
							}
							//ブレーク
							else if (nsub1 == "b") { type[useEachIndex] = NoteType.BREAK; }
							//スライド
							else if (nsub1 == "-" || nsub1 == "^" || nsub1 == ">" || nsub1 == "<" ||
									nsub1 == "v" || nsub1 == "q" || nsub1 == "p" || nsub1 == "s" || nsub1 == "z")
							{
								type[useEachIndex] = NoteType.STARTAP;
								slidePtnTxt[useEachIndex] = nsub1;
								c++; //『-』か『^』の次の文字へ
								if (c < nsublength)
								{
									nsub1 = nsub.substr(c, 1);
									if (nsub1 == "1" || nsub1 == "2" || nsub1 == "3" || nsub1 == "4" ||
										nsub1 == "5" || nsub1 == "6" || nsub1 == "7" || nsub1 == "8")
									{
										if (!isNaN(nsub1)) {
											slideButtonId[useEachIndex] = Number(nsub1) - 1;
										}
										else {
											this.createLastErrorMessage_withCammaAndRow(13, cammaCount, row);
											dp("スライドのボタンIDがうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
											return null;
										}
										c++; //スライドのボタンIDの次の文字へ
										if (c < nsublength) {
											nsub1 = nsub.substr(c, 1);
											if (nsub1 == ("[")) {
												c++;//『[』の次の文字へ
												var nsub2 = "";
												var sn_direct = false;
												var sn_value = 0;
												while (c < nsublength) {
													nsub1 = nsub.substr(c, 1);
													if (nsub1 == "#") { //直接入力フラグ
														sn_direct = true;
													}
													else if (nsub1 == ":") {
														if (!sn_direct) {
															var cc = 0;
															var nsub2len = nsub2.length;
															if (nsub2.substr(cc, 1) == "(") { //一時的BPM指定
																armHoldingTime[useEachIndex].type = ArmHoldingTimeInputType.LOCAL_BPM;
																var nsub3 = "";
																while (cc < nsub2len) {
																	cc++;
																	var nsub4 = nsub2.substr(cc, 1);
																	if (nsub4 != ")") {
																		nsub3 += nsub4;
																	}
																	else {
																		if (!isNaN(nsub3)) {
																			var bpml = Number(nsub3);
																			if (bpml > 0) {
																				armHoldingTime[useEachIndex].armBPM = bpml;
																				cc++;
																				break;
																			}
																			else {
																				this.createLastErrorMessage_withCammaAndRow(29, cammaCount, row);
																				dp("スライドの一時的BPMに0を入れようとした->MaimaiFmenLoad::createMaimaiNotes");
																				return null;
																			}
																		}
																		else {
																			this.createLastErrorMessage_withCammaAndRow(49, cammaCount, row);
																			dp("スライドの[(BPM)x:y]のBPMが異常->MaimaiFmenLoad::createMaimaiNotes"); 
																			return null;
																		}
																	}
																}
															}
															if (cc < nsub2len) {
																var nsub5 = nsub2.substr(cc);
																if (!isNaN(nsub5)) {
																	sn_value = Number(nsub5);
																	nsub2 = "";
																}
																else {
																	this.createLastErrorMessage_withCammaAndRow(50, cammaCount, row);
																	dp("スライドの[(BPM)x:y]のxが異常->MaimaiFmenLoad::createMaimaiNotes"); 
																	return null;
																}
															}
															else {
																this.createLastErrorMessage_withCammaAndRow(17, cammaCount, row);
																dp("スライドの書式指定が中途半端。->MaimaiFmenLoad::createMaimaiNotes"); 
																return null;
															}
														}
														else {
															this.createLastErrorMessage_withCammaAndRow(17, cammaCount, row);
															dp("スライドの書式指定が中途半端。#使ったのに:使ってる。->MaimaiFmenLoad::createMaimaiNotes"); 
															return null;
														}
													}
													else if (nsub1 == "/") { //待ち時間指定
														if (sn_direct) {
															armHoldingTime[useEachIndex].waittype = ArmHoldingTimeInputType.DIRECT;
															sn_direct = false;
														}
														else {
															armHoldingTime[useEachIndex].waittype = ArmHoldingTimeInputType.LOCAL_BPM;
														}
														if (!isNaN(nsub2)) {
															var bpml = Number(nsub2);
															if (bpml > 0) {
																armHoldingTime[useEachIndex].wait = bpml;
																nsub2 = "";
															}
															else {
																this.createLastErrorMessage_withCammaAndRow(29, cammaCount, row);
																dp("スライドの待ち時間BPMに0を入れようとした->MaimaiFmenLoad::createMaimaiNotes");
																return null;
															}
														}
														else {
															this.createLastErrorMessage_withCammaAndRow(52, cammaCount, row);
															dp("スライドの[待ち時間/x:y]の待ち時間が異常->MaimaiFmenLoad::createMaimaiNotes"); 
															return null;
														}
													}
													else if (nsub1 == "]") { //値の確定
														if (sn_direct) {
															armHoldingTime[useEachIndex].type = ArmHoldingTimeInputType.DIRECT;
															if (!isNaN(nsub2)) {
																armHoldingTime[useEachIndex].directTime = Number(nsub2);
																nsub2 = "";
															}
															else {
																this.createLastErrorMessage_withCammaAndRow(14, cammaCount, row);
																dp("スライドの[#x]のxが異常->MaimaiFmenLoad::createMaimaiNotes"); 
																return null;
															}
														}
														else {
															armHoldingTime[useEachIndex].basisBeat = sn_value;
															if (!isNaN(nsub2)) {
																armHoldingTime[useEachIndex].lengthBeat = Number(nsub2);
																nsub2 = "";
																break;
															}
															else {
																this.createLastErrorMessage_withCammaAndRow(51, cammaCount, row);
																dp("スライドの[(BPM)x:y]のyが異常->MaimaiFmenLoad::createMaimaiNotes"); 
																return null;
															}
														}
													}
													else { //文字溜め
														nsub2 += nsub1;
													}
													c++;
												}
											}
											else
											{
												this.createLastErrorMessage_withCammaAndRow(18, cammaCount, row);
												dp("スライドのボタンIDの次が[じゃない->MaimaiFmenLoad::createMaimaiNotes");
												return null;
											}
										}
										else
										{
											this.createLastErrorMessage_withCammaAndRow(19, cammaCount, row);
											dp("スライドの書式指定が中途半端->MaimaiFmenLoad::createMaimaiNotes"); 
											return null;
										}
									}
									else
									{
										this.createLastErrorMessage_withCammaAndRow(20, cammaCount, row);
										dp("スライドの宛先が異常->MaimaiFmenLoad::createMaimaiNotes");
										return null;
									}
								}
								else
								{
									this.createLastErrorMessage_withCammaAndRow(21, cammaCount, row);
									dp("スライドの書式指定が中途半端->MaimaiFmenLoad::createMaimaiNotes"); 
									return null;
								}
							}
							//Tap同士のEachは/で区切る必要がないので2文字目に数値が来ていたら2つめのタップ。
							else if (nsub1 == "1" || nsub1 == "2" || nsub1 == "3" || nsub1 == "4" ||
									 nsub1 == "5" || nsub1 == "6" || nsub1 == "7" || nsub1 == "8")
							{
								useEachIndex++;
								if (!isNaN(nsub1)) {
									buttonId[useEachIndex] = Number(nsub1) - 1;
								}
								else {
									this.createLastErrorMessage_withCammaAndRow(22, cammaCount, row);
									dp("スラッシュ無しのイーチタップがうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
									return null;
								}
								break;
							}
							//buttonIdが既に入っていて、まだEachが入ってなければEachを使う
							else if (nsub1 == "/" && useEachIndex < 1 && buttonId[useEachIndex] > -1) {
								useEachIndex++;
								//スラッシュがいくつもあってイーチノートがたくさん設定されてあっても、
								//一つ目と最後のノートしか反映されないから平気。
							}
						}
					}
					//buttonIdが既に入っていて、まだEachが入ってなければEachを使う
					else if (nsub1 == "/" && useEachIndex < 1 && buttonId[useEachIndex] > -1) {
						useEachIndex++;
						//スラッシュがいくつもあってイーチノートがたくさん設定されてあっても、
						//一つ目と最後のノートしか反映されないから平気。
					}
					//Ver.1.20 スライド直接指定 
					else if (nsub1 == "#") {
						//InExtendSlide[useEachIndex]にスターノートを保存しておいて、直接指定スライドノートはスターノートに関連付けておく。
						//ボタンはgetCustomButtonId()を通すのを忘れずに。
						
						//#の次の文字へ
						c++;
						if (c < nsublength) {
							//#の次の場所を覚えておくためcはとっておく。
							var c2 = c;
							
							//ルール1：
							//先に[まで読み進めて時間を決めておく。で、#の次まで戻る
							//#の次はA または数字
							nsub1 = nsub.substr(c2, 1);
							//#の次はAである
							if (nsub1 == "A") {
								//Aの次の文字へ
								c2++;
								if (c2 < nsublength) {
									nsub1 = nsub.substr(c2, 1);
								}
								else {
									this.createLastErrorMessage_withCammaAndRow(36, cammaCount, row);
									dp("スライド直接入力:入力が中途半端->MaimaiFmenLoad::createMaimaiNotes");
									return null;
								}
							}
							//#の次はボタンである
							if (nsub1 == "1" || nsub1 == "2" || nsub1 == "3" || nsub1 == "4" ||
								nsub1 == "5" || nsub1 == "6" || nsub1 == "7" || nsub1 == "8")
							{
								if (!isNaN(nsub1)) {
									type[useEachIndex] = NoteType.STARTAP;
									buttonId[useEachIndex] = Number(nsub1) - 1;
								}
								else {
									this.createLastErrorMessage_withCammaAndRow(13, cammaCount, row);
									dp("スライドのボタンIDがうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
									return null;
								}
							}
							else {
								this.createLastErrorMessage_withCammaAndRow(45, cammaCount, row);
								dp("スライド直接入力:スライドが外周から始まってない->MaimaiFmenLoad::createMaimaiNotes");
								return null;
							}
							
							//この時点で、スライドの始点のボタンIDが決まる。
							//次は、時間を読む。[までシークする
							var find1 = false;
							while (c2 < nsublength) {
								nsub1 = nsub.substr(c2, 1);
								if (nsub1 != "[") {
									c2++;
								}
								else {
									find1 = true;
									break;
								}
							}
							if (find1) {
								c2++;//『[』の次の文字へ
								var nsub2 = "";
								if (c2 < nsublength) {
									var sn_direct = false;
									var sn_value = 0;
									while (c2 < nsublength) {
										nsub1 = nsub.substr(c2, 1);
										if (nsub1 == "#") { //直接入力フラグ
											sn_direct = true;
										}
										else if (nsub1 == ":") {
											if (!sn_direct) {
												var cc = 0;
												var nsub2len = nsub2.length;
												if (nsub2.substr(cc, 1) == "(") { //一時的BPM指定
													armHoldingTime[useEachIndex].type = ArmHoldingTimeInputType.LOCAL_BPM;
													var nsub3 = "";
													while (cc < nsub2len) {
														cc++;
														var nsub4 = nsub2.substr(cc, 1);
														if (nsub4 != ")") {
															nsub3 += nsub4;
														}
														else {
															if (!isNaN(nsub3)) {
																var bpml = Number(nsub3);
																if (bpml > 0) {
																	armHoldingTime[useEachIndex].armBPM = bpml;
																	cc++;
																	break;
																}
																else {
																	this.createLastErrorMessage_withCammaAndRow(29, cammaCount, row);
																	dp("スライドの一時的BPMに0を入れようとした->MaimaiFmenLoad::createMaimaiNotes");
																	return null;
																}
															}
															else {
																this.createLastErrorMessage_withCammaAndRow(49, cammaCount, row);
																dp("スライドの[(BPM)x:y]のBPMが異常->MaimaiFmenLoad::createMaimaiNotes"); 
																return null;
															}
														}
													}
												}
												if (cc < nsub2len) {
													var nsub5 = nsub2.substr(cc);
													if (!isNaN(nsub5)) {
														sn_value = Number(nsub5);
														nsub2 = "";
													}
													else {
														this.createLastErrorMessage_withCammaAndRow(50, cammaCount, row);
														dp("スライドの[(BPM)x:y]のxが異常->MaimaiFmenLoad::createMaimaiNotes"); 
														return null;
													}
												}
												else {
													this.createLastErrorMessage_withCammaAndRow(17, cammaCount, row);
													dp("スライドの書式指定が中途半端。->MaimaiFmenLoad::createMaimaiNotes"); 
													return null;
												}
											}
											else {
												this.createLastErrorMessage_withCammaAndRow(17, cammaCount, row);
												dp("スライドの書式指定が中途半端。#使ったのに:使ってる。->MaimaiFmenLoad::createMaimaiNotes"); 
												return null;
											}
										}
										else if (nsub1 == "/") { //待ち時間指定
											if (sn_direct) {
												armHoldingTime[useEachIndex].waittype = ArmHoldingTimeInputType.DIRECT;
												sn_direct = false;
											}
											else {
												armHoldingTime[useEachIndex].waittype = ArmHoldingTimeInputType.LOCAL_BPM;
											}
											if (!isNaN(nsub2)) {
												var bpml = Number(nsub2);
												if (bpml > 0) {
													armHoldingTime[useEachIndex].wait = bpml;
													nsub2 = "";
												}
												else {
													this.createLastErrorMessage_withCammaAndRow(29, cammaCount, row);
													dp("スライドの待ち時間BPMに0を入れようとした->MaimaiFmenLoad::createMaimaiNotes");
													return null;
												}
											}
											else {
												this.createLastErrorMessage_withCammaAndRow(52, cammaCount, row);
												dp("スライドの[待ち時間/x:y]の待ち時間が異常->MaimaiFmenLoad::createMaimaiNotes"); 
												return null;
											}
										}
										else if (nsub1 == "]") { //値の確定
											if (sn_direct) {
												armHoldingTime[useEachIndex].type = ArmHoldingTimeInputType.DIRECT;
												if (!isNaN(nsub2)) {
													armHoldingTime[useEachIndex].directTime = Number(nsub2);
													nsub2 = "";
												}
												else {
													this.createLastErrorMessage_withCammaAndRow(14, cammaCount, row);
													dp("スライドの[#x]のxが異常->MaimaiFmenLoad::createMaimaiNotes"); 
													return null;
												}
											}
											else {
												armHoldingTime[useEachIndex].basisBeat = sn_value;
												if (!isNaN(nsub2)) {
													armHoldingTime[useEachIndex].lengthBeat = Number(nsub2);
													nsub2 = "";
													break;
												}
												else {
													this.createLastErrorMessage_withCammaAndRow(51, cammaCount, row);
													dp("スライドの[(BPM)x:y]のyが異常->MaimaiFmenLoad::createMaimaiNotes"); 
													return null;
												}
											}
										}
										else { //文字溜め
											nsub2 += nsub1;
										}
										c2++;
									}
									
									//時間が決まったので、まずはスターノートとスライドノートを作る
									var start = this.getCustomButtonId(buttonId[useEachIndex], setting);
									var actid = start + iniActId;
									var stNote = new MaimaiStarNote(info, uniqueId, time, MaimaiJudgeEvaluateManager.missTimeBank(type[useEachIndex]), actid, start);
									uniqueId++;
									//スライドのjusttimeを計算
									var rbpm = armHoldingTime[useEachIndex].type == ArmHoldingTimeInputType.LOCAL_BPM ? armHoldingTime[useEachIndex].armBPM : bpm;
									var slideStartTimeSetting;
									if (armHoldingTime[useEachIndex].waittype == ArmHoldingTimeInputType.DIRECT)
										slideStartTimeSetting = armHoldingTime[useEachIndex].wait;
									else if (armHoldingTime[useEachIndex].waittype == ArmHoldingTimeInputType.LOCAL_BPM)
										slideStartTimeSetting = 60.0 / armHoldingTime[useEachIndex].wait;
									else 
										slideStartTimeSetting = 60.0 / bpm;
									var relativeTime;
									var relativeMovementTime;
									if (armHoldingTime[useEachIndex].type != ArmHoldingTimeInputType.DIRECT) {
										if (armHoldingTime[useEachIndex].basisBeat > 0) {
											relativeMovementTime = time + 60.0 / rbpm * (4.0 / armHoldingTime[useEachIndex].basisBeat) * armHoldingTime[useEachIndex].lengthBeat + slideStartTimeSetting;
											relativeTime = time + (60.0 / rbpm * (4.0 / armHoldingTime[useEachIndex].basisBeat) * armHoldingTime[useEachIndex].lengthBeat + slideStartTimeSetting) * 0.85;
										}
										else {
											this.createLastErrorMessage_withCammaAndRow(24, cammaCount, row);
											dp("basisBeat[e]が0なので割れない。->MaimaiFmenLoad::createMaimaiNotes");
											return null;
										}
									}
									else {
										relativeMovementTime = time + armHoldingTime[useEachIndex].directTime + slideStartTimeSetting;
										relativeTime = time + slideStartTimeSetting + (armHoldingTime[useEachIndex].directTime * 0.85); // 1拍 + スライド時間 * (12 / 14);
									}
									//☆が来てから1拍後にスライド上の☆移動スタート。
									var onStarMoveStartTimeFromStarJustTime;
									if (armHoldingTime[useEachIndex].waittype == ArmHoldingTimeInputType.DIRECT)
										onStarMoveStartTimeFromStarJustTime = armHoldingTime[useEachIndex].wait;
									else if (armHoldingTime[useEachIndex].waittype == ArmHoldingTimeInputType.LOCAL_BPM)
										onStarMoveStartTimeFromStarJustTime = 60.0 / armHoldingTime[useEachIndex].wait * 1.0;
									else 
										onStarMoveStartTimeFromStarJustTime = 60.0 / bpm * 1.0;
									var firstActionId = 0x10 + 9 + actid; //スライドノートの、アクションIDは始点。ボタンIDはどうしようもないが使わないので適当に0でも入れとく
									var slNote = new MaimaiSlideNote(info, uniqueId, relativeTime, MaimaiJudgeEvaluateManager.missTimeBank(NoteType.SLIDE), firstActionId, 0, stNote, relativeMovementTime, onStarMoveStartTimeFromStarJustTime);
									uniqueId++;
									
									//スライドパターンファクトリーのインスタンス作成
									var factory = new SlidePatternFactory(info, slNote, uniqueId, iniActId);
									
									//で、文字列読込を再開すると。
									
									
									var cics = [Circumference.OUTER, Circumference.OUTER];
									var centerprevcic = Circumference.OUTER; //中円より前の周を保存する
									var btns = [-2, -2];
									//cが#の次の場所を記憶している。
									nsub1 = nsub.substr(c, 1);
									//ルール2：
									//A、B、^→1、2、3、4、5、6、7、8
									//1、2、3、4、5、6、7、8→[、-、^
									//-→A、B、C
									//C→[、-
									//A1、でノート確定。C、でノート確定。^1、でノート確定。-なら続けて、[なら終わる
									//[がきたら終了。
									var slidevector = STRAIGHT; //2で直線、1で時計回り曲線、-1で反時計回り曲線、0で場所依存方向曲線
									var continued = true; //ボタンの後、-か^があったフラグ。ただし最初は#であるため、例外的に-や^が直前に無くても周とボタンを入れることができるからtrue
									while (true) {
										if (nsub1 == "A") {
											if (continued) {
												cics[1] = Circumference.OUTER;
											}
											else {
												this.createLastErrorMessage_withCammaAndRow(38, cammaCount, row);
												dp("スライド直接入力:Aの前に-か^が無い->MaimaiFmenLoad::createMaimaiNotes");
												return null;
											}
										}
										else if (nsub1 == "B") {
											if (continued) {
												cics[1] = Circumference.INNER;
											}
											else {
												this.createLastErrorMessage_withCammaAndRow(39, cammaCount, row);
												dp("スライド直接入力:Bの前に-か^が無い->MaimaiFmenLoad::createMaimaiNotes");
												return null;
											}
										}
										else if (nsub1 == "C") {
											if (continued && slidevector == STRAIGHT) {
												cics[0] = cics[1];
												centerprevcic = cics[0]; //A1-C-2とか来たとき2はAだよと教える必要があるから保存
												cics[1] = Circumference.CENTER;
												btns[0] = btns[1];
												btns[1] = SlidePatternFactory.UN_USE_PARAM;
												//始点と終点が決まっていたら、パターンノートを作る
												if (btns[0] >= -1) {
													if (!factory.setPattern(cics[0], cics[1], this.getCustomButtonId(btns[0], setting), this.getCustomButtonId(btns[1], setting), SlideVector.STRAIGHT)) {
														this.createLastErrorMessage_withSFactory(factory, cammaCount, row);
														dp("スライドパターン作成時のエラー->MaimaiFmenLoad::createMaimaiNotes");
														return null;
													}
													continued = false;
												}
											}
											else {
												this.createLastErrorMessage_withCammaAndRow(40, cammaCount, row);
												dp("スライド直接入力:Cの前に-が無い->MaimaiFmenLoad::createMaimaiNotes");
												return null;
											}
										}
										else if (nsub1 == "-") {
											if (btns[1] >= -1)
											{
												continued = true;
												slidevector = STRAIGHT;
												cics[0] = cics[1];
											}
											else {
												this.createLastErrorMessage_withCammaAndRow(43, cammaCount, row);
												dp("スライド直接入力:-の前にボタン番号が存在しない->MaimaiFmenLoad::createMaimaiNotes");
												return null;
											}
										}
										else if (nsub1 == "^") {
											if (btns[1] >= -1) {
												continued = true;
												slidevector = INCOMPREHENSIBLE_CURVE;
												cics[0] = cics[1];
											}
											else {
												this.createLastErrorMessage_withCammaAndRow(44, cammaCount, row);
												dp("スライド直接入力:^の前にボタン番号が存在しない->MaimaiFmenLoad::createMaimaiNotes");
												return null;
											}
										}
										else if (nsub1 == ">") {
											if (btns[1] >= -1) {
												continued = true;
												if (btns[1] == 2 || btns[1] == 3 || btns[1] == 4 || btns[1] == 5) {
													slidevector = REVERSE_CLOCK_CURVE;
												}
												else {
													slidevector = CLOCK_CURVE;
												}
												cics[0] = cics[1];
											}
											else {
												this.createLastErrorMessage_withCammaAndRow(46, cammaCount, row);
												dp("スライド直接入力:>の前にボタン番号が存在しない->MaimaiFmenLoad::createMaimaiNotes");
												return null;
											}
										}
										else if (nsub1 == "<") {
											if (btns[1] >= -1) {
												continued = true;
												if (btns[1] == 2 || btns[1] == 3 || btns[1] == 4 || btns[1] == 5) {
													slidevector = CLOCK_CURVE;
												}
												else {
													slidevector = REVERSE_CLOCK_CURVE;
												}
												cics[0] = cics[1];
											}
											else {
												this.createLastErrorMessage_withCammaAndRow(47, cammaCount, row);
												dp("スライド直接入力:<の前にボタン番号が存在しない->MaimaiFmenLoad::createMaimaiNotes");
												return null;
											}
										}
										else if (nsub1 == "1" || nsub1 == "2" || nsub1 == "3" || nsub1 == "4" ||
												 nsub1 == "5" || nsub1 == "6" || nsub1 == "7" || nsub1 == "8")
										{
											if (continued) {
												if (cics[1] != Circumference.OUTER && cics[1] != Circumference.INNER) {
													cics[1] = centerprevcic; //A1-C-2とか来たとき2はAだよと教える必要がある
												}
												if (!isNaN(nsub1)) {
													btns[0] = btns[1];
													btns[1] = Number(nsub1) - 1;
												}
												else {
													this.createLastErrorMessage_withCammaAndRow(13, cammaCount, row);
													dp("スライドのボタンIDがうまく入らなかった->MaimaiFmenLoad::createMaimaiNotes");
													return null;
												}
												//始点と終点が決まっていたら、パターンノートを作る
												if (btns[0] >= -1) {
													var svec;
													var btn1 = this.getCustomButtonId(btns[0], setting);
													var btn2 = this.getCustomButtonId(btns[1], setting);
													if (slidevector == STRAIGHT) svec = SlideVector.STRAIGHT;
													else if (slidevector == CLOCK_CURVE) svec = SlideVector.CURVE_CLOCK;
													else if (slidevector == REVERSE_CLOCK_CURVE) svec = SlideVector.CURVE_REVERSE_CLOCK;
													else {
														var cvec = this.vectorOfCurveFromPlace(btn1, btn2);
														if (cvec == CLOCK_CURVE) svec = SlideVector.CURVE_CLOCK;
														else if (cvec == REVERSE_CLOCK_CURVE) svec = SlideVector.CURVE_REVERSE_CLOCK;
														else {
															this.createLastErrorMessage_withCammaAndRow(25, cammaCount, row);
															dp("^指定で、対角線上だった->MaimaiFmenLoad::createMaimaiNotes");
															return null;
														}
													}
													
													if (!factory.setPattern(cics[0], cics[1], btn1, btn2, svec)) {
														this.createLastErrorMessage_withSFactory(factory, cammaCount, row);
														dp("スライドパターン作成時のエラー->MaimaiFmenLoad::createMaimaiNotes");
														return null;
													}
													continued = false;
												}
											}
											else {
												this.createLastErrorMessage_withCammaAndRow(41, cammaCount, row);
												dp("スライド直接入力:ボタン番号の前に-か^が無い->MaimaiFmenLoad::createMaimaiNotes");
												return null;
											}
										}
										else if (nsub1 == "[") {
											if (!continued) {
												break; //スライドパターン作成終了
											}
											else {
												this.createLastErrorMessage_withCammaAndRow(42, cammaCount, row);
												dp("スライド直接入力:-や^の後に[が来てる->MaimaiFmenLoad::createMaimaiNotes");
												return null;
											}
										}
										
										//ループの最後に次の文字を読むようにする
										c++;
										if (c < nsublength)
										{
											nsub1 = nsub.substr(c, 1);
										}
										else
										{
											this.createLastErrorMessage_withECode(36);
											dp("スライド直接入力:スライドの入力が中途半端->MaimaiFmenLoad::createMaimaiNotes");
											return null;
										}
									}
									
									//スライドパターンが入っていなかった
									if (factory.getPattern().length == 0) {
										this.createLastErrorMessage_withCammaAndRow(37, cammaCount, row);
										dp("スライド直接入力:始点以外見つからない->MaimaiFmenLoad::createMaimaiNotes");
										return null;
									}
									
									//最後にスライドパターンをセットして、
									slNote.setPattern(factory);
									slNote.setTotalDistance();
									//スターノートを覚える
									InExtendSlide[useEachIndex] = stNote;
									//スライドパターンの数だけユニークID移動
									uniqueId += slNote.getPattern().length;
									
									factory.release();
									c += (c2 - c);
								}
								else {
									this.createLastErrorMessage_withCammaAndRow(17, cammaCount, row);
									dp("スライドの書式指定が中途半端。[の後が無い->MaimaiFmenLoad::createMaimaiNotes"); 
									return null;
								}
							}
							else {
								this.createLastErrorMessage_withCammaAndRow(36, cammaCount, row);
								dp("スライド直接入力:[が見つからない->MaimaiFmenLoad::createMaimaiNotes");
								return null;
							}
						}
						else {
							this.createLastErrorMessage_withCammaAndRow(36, cammaCount, row);
							dp("スライド直接入力:入力が中途半端->MaimaiFmenLoad::createMaimaiNotes");
							return null;
						}
					}
				}
				//ノート情報を基に作る。
				if (buttonId[useEachIndex] > -1) {
					var note0 = null;
					var note1 = null;
					for (var e = 0; e < useEachIndex + 1; e++) {
						var note = null;
						var relativeNote = null;
						var patternNotes = null;
						var rbpm = armHoldingTime[e].type == ArmHoldingTimeInputType.LOCAL_BPM ? armHoldingTime[e].armBPM : bpm;
						if (type[e] == NoteType.CIRCLETAP) {
							var btnid = this.getCustomButtonId(buttonId[e], setting);
							var actid = btnid + iniActId;
							var tNote = new MaimaiTapNote(info, uniqueId, time, MaimaiJudgeEvaluateManager.missTimeBank(type[e]), actid, btnid);
							uniqueId++;
							note = tNote;
						}
						else if (type[e] == NoteType.BREAK) {
							var btnid = this.getCustomButtonId(buttonId[e], setting);
							var actid = btnid + iniActId;
							var bNote = new MaimaiBreakNote(info, uniqueId, time, MaimaiJudgeEvaluateManager.missTimeBank(type[e]), actid, btnid);
							uniqueId++;
							note = bNote;
						}
						else if (type[e] == NoteType.HOLDHEAD) {
							var btnid = this.getCustomButtonId(buttonId[e], setting);
							var actid = btnid + iniActId;
							var hNote = new MaimaiHoldHeadNote(info, uniqueId, time, MaimaiJudgeEvaluateManager.missTimeBank(type[e]), actid, btnid);
							uniqueId++;
							//ホールドフットのjusttimeを計算
							var relativeTime;
							if (armHoldingTime[e].type != ArmHoldingTimeInputType.DIRECT) {
								if (armHoldingTime[e].basisBeat > 0)
									relativeTime = time + 60.0 / rbpm * (4.0 / armHoldingTime[e].basisBeat) * armHoldingTime[e].lengthBeat;
								else {
									this.createLastErrorMessage_withCammaAndRow(23, cammaCount, row);
									dp("basisBeat[e]が0なので割れない。->MaimaiFmenLoad::createMaimaiNotes");
									return null;
								}
							}
							else
								relativeTime = time + armHoldingTime[e].directTime;
							actid = btnid + 8 + iniActId; ;
							var fNote = new MaimaiHoldFootNote(info, uniqueId, relativeTime, MaimaiJudgeEvaluateManager.missTimeBank(NoteType.HOLDFOOT), actid, hNote);
							uniqueId++;
							
							note = hNote;
							relativeNote = fNote;
						}
						else if (type[e] == NoteType.STARTAP) {
							if (InExtendSlide[e] == null) {
								var start = this.getCustomButtonId(buttonId[e], setting);
								var actid = start + iniActId; ;
								var stNote = new MaimaiStarNote(info, uniqueId, time, MaimaiJudgeEvaluateManager.missTimeBank(type[e]), actid, start);
								uniqueId++;
								//スライドのjusttimeを計算
								var slideStartTimeSetting;
								if (armHoldingTime[e].waittype == ArmHoldingTimeInputType.DIRECT)
									slideStartTimeSetting = armHoldingTime[e].wait;
								else if (armHoldingTime[e].waittype == ArmHoldingTimeInputType.LOCAL_BPM)
									slideStartTimeSetting = 60.0 / armHoldingTime[e].wait;
								else 
									slideStartTimeSetting = 60.0 / bpm;
								var relativeTime;
								var relativeMovementTime;
								if (armHoldingTime[e].type != ArmHoldingTimeInputType.DIRECT) {
									if (armHoldingTime[e].basisBeat > 0) {
										relativeMovementTime = time + 60.0 / rbpm * (4.0 / armHoldingTime[e].basisBeat) * armHoldingTime[e].lengthBeat + slideStartTimeSetting;
										relativeTime = time + (60.0 / rbpm * (4.0 / armHoldingTime[e].basisBeat) * armHoldingTime[e].lengthBeat + slideStartTimeSetting) * 0.85;
									}
									else {
										this.createLastErrorMessage_withCammaAndRow(24, cammaCount, row);
										dp("basisBeat[e]が0なので割れない。->MaimaiFmenLoad::createMaimaiNotes");
										return null;
									}
								}
								else {
									relativeMovementTime = time + armHoldingTime[e].directTime + slideStartTimeSetting;
									relativeTime = time + slideStartTimeSetting + (armHoldingTime[e].directTime * 0.85); // 1拍 + スライド時間 * (12 / 14);
								}
								//スライドのボタンIDを取得
								var target = this.getCustomButtonId(slideButtonId[e], setting);
								//☆が来てから1拍後にスライド上の☆移動スタート。
								var onStarMoveStartTimeFromStarJustTime;
								if (armHoldingTime[e].waittype == ArmHoldingTimeInputType.DIRECT)
									onStarMoveStartTimeFromStarJustTime = armHoldingTime[e].wait;
								else if (armHoldingTime[e].waittype == ArmHoldingTimeInputType.LOCAL_BPM)
									onStarMoveStartTimeFromStarJustTime = 60.0 / armHoldingTime[e].wait * 1.0;
								else 
									onStarMoveStartTimeFromStarJustTime = 60.0 / bpm * 1.0;
								var firstActionId = 0x10 + 9 + actid; //スライドノートの、アクションIDは始点、ボタンIDは互換性のために終点を入れる
								var slNote = new MaimaiSlideNote(info, uniqueId, relativeTime, MaimaiJudgeEvaluateManager.missTimeBank(NoteType.SLIDE), firstActionId, target, stNote, relativeMovementTime, onStarMoveStartTimeFromStarJustTime);
								uniqueId++;
								
								var factory = new SlidePatternFactory(info, slNote, uniqueId, iniActId);
								var failed = false;
								if (slidePtnTxt[e] == "-") {
									if (!factory.setPattern(Circumference.OUTER, Circumference.OUTER, start, target, SlideVector.STRAIGHT)) {
										failed = true;
									}
								}
								else if (slidePtnTxt[e] == "^") {
									var svec;
									var cvec = this.vectorOfCurveFromPlace(start, target);
									if (cvec == CLOCK_CURVE) svec = SlideVector.CURVE_CLOCK;
									else if (cvec == REVERSE_CLOCK_CURVE) svec = SlideVector.CURVE_REVERSE_CLOCK;
									else {
										this.createLastErrorMessage_withCammaAndRow(25, cammaCount, row);
										dp("^指定で、対角線上だった->MaimaiFmenLoad::createMaimaiNotes");
										return null;
									}
									if (!factory.setPattern(Circumference.OUTER, Circumference.OUTER, start, target, svec)) {
										failed = true;
									}
								}
								else if (slidePtnTxt[e] == ">") {
									var sv;
									if (buttonId[e] == 2 || buttonId[e] == 3 || buttonId[e] == 4 || buttonId[e] == 5) {
										sv = SlideVector.CURVE_REVERSE_CLOCK;
									}
									else {
										sv = SlideVector.CURVE_CLOCK;
									}
									if (!factory.setPattern(Circumference.OUTER, Circumference.OUTER, start, target, sv)) {
										failed = true;
									}
								}
								else if (slidePtnTxt[e] == "<") {
									if (buttonId[e] == 2 || buttonId[e] == 3 || buttonId[e] == 4 || buttonId[e] == 5) {
										sv = SlideVector.CURVE_CLOCK;
									}
									else {
										sv = SlideVector.CURVE_REVERSE_CLOCK;
									}
									if (!factory.setPattern(Circumference.OUTER, Circumference.OUTER, start, target, sv)) {
										failed = true;
									}
								}
								else if (slidePtnTxt[e] == "v") {
									//As-Bs-C-Bt-At
									if (factory.setPattern(Circumference.OUTER, Circumference.CENTER, start, SlidePatternFactory.UN_USE_PARAM, SlideVector.STRAIGHT)) {
										if (!factory.setPattern(Circumference.CENTER, Circumference.OUTER, SlidePatternFactory.UN_USE_PARAM, target, SlideVector.STRAIGHT)) {
											failed = true;
										}
									}
									else {
										failed = true;
									}
								}
								else if (slidePtnTxt[e] == "q") {
									//if (t==(s+4)%8) As-B((s+2)%8)-At
									//else As-B((s+2)%8)>B((t+6)%8)-At
									if (factory.setPattern(Circumference.OUTER, Circumference.INNER, start, start + 2, SlideVector.STRAIGHT)) {
										if (target == (start + 4) % 8) {
											if (!factory.setPattern(Circumference.INNER, Circumference.OUTER, start + 2, target, SlideVector.STRAIGHT)) {
												failed = true;
											}
										}
										else {
											if (factory.setPattern(Circumference.INNER, Circumference.INNER, start + 2, target - 2, SlideVector.CURVE_CLOCK)) {
												if (!factory.setPattern(Circumference.INNER, Circumference.OUTER, target - 2, target, SlideVector.STRAIGHT)) {
													failed = true;
												}
											}
											else {
												failed = true;
											}
										}
									}
									else {
										failed = true;
									}
								}
								else if (slidePtnTxt[e] == "p") {
									//if (t==(s+4)%8) As-B((s+6)%8)-At
									//else As-B((s+6)%8)<B((t+2)%8)-At
									if (factory.setPattern(Circumference.OUTER, Circumference.INNER, start, start - 2, SlideVector.STRAIGHT)) {
										if (target == (start + 4) % 8) {
											if (!factory.setPattern(Circumference.INNER, Circumference.OUTER, start - 2, target, SlideVector.STRAIGHT)) {
												failed = true;
											}
										}
										else {
											if (factory.setPattern(Circumference.INNER, Circumference.INNER, start - 2, target + 2, SlideVector.CURVE_REVERSE_CLOCK)) {
												if (!factory.setPattern(Circumference.INNER, Circumference.OUTER, target + 2, target, SlideVector.STRAIGHT)) {
													failed = true;
												}
											}
											else {
												failed = true;
											}
										}
									}
									else {
										failed = true;
									}
								}
								else if (slidePtnTxt[e] == "z") {
									//As-B((s+2)%8)-C-B((t+2)%8)-At
									if (factory.setPattern(Circumference.OUTER, Circumference.INNER, start, start + 2, SlideVector.STRAIGHT)) {
										if (factory.setPattern(Circumference.INNER, Circumference.INNER, start + 2, target + 2, SlideVector.STRAIGHT)) {
											if (!factory.setPattern(Circumference.INNER, Circumference.OUTER, target + 2, target, SlideVector.STRAIGHT)) {
												failed = true;
											}
										}
										else {
											failed = true;
										}
									}
									else {
										failed = true;
									}
								}
								else if (slidePtnTxt[e] == "s") {
									//As-B((s+6)%8)-C-B((t+2)%8)-At
									if (factory.setPattern(Circumference.OUTER, Circumference.INNER, start, start - 2, SlideVector.STRAIGHT)) {
										if (factory.setPattern(Circumference.INNER, Circumference.INNER, start - 2, target - 2, SlideVector.STRAIGHT)) {
											if (!factory.setPattern(Circumference.INNER, Circumference.OUTER, target - 2, target, SlideVector.STRAIGHT)) {
												failed = true;
											}
										}
										else {
											failed = true;
										}
									}
									else {
										failed = true;
									}
								}
								if (failed) {
									this.createLastErrorMessage_withSFactory(factory, cammaCount, row);
									dp("スライドパターン作成時のエラー->MaimaiFmenLoad::createMaimaiNotes");
									return null;
								}
								slNote.setPattern(factory);
								slNote.setTotalDistance();
								uniqueId += slNote.getPattern().length;
								
								note = stNote;
								relativeNote = slNote;
								patternNotes = factory.getPattern();
								
								factory.release();
							}
							else { //拡張スライドが入ってたら、すでにノートは作ってある
								note = InExtendSlide[e];
								relativeNote = InExtendSlide[e].getRelativeNote();
								patternNotes = InExtendSlide[e].getRelativeNote().getPattern();
							}
						}
						note.comment = (cammaCount + 1);
						note.row = row;
						notes.push(note);
						if (!settedNote) settedNote = true;
						if (relativeNote != null) {
							relativeNote.comment = (cammaCount + 1);
							relativeNote.row = row;
							notes.push(relativeNote);
						}
						if (patternNotes != null) {
							for (var pp = 0; pp < patternNotes.length; pp++) {
								var sp = patternNotes[pp];
								sp.comment = (cammaCount + 1);
								sp.row = row;
								notes.push(sp);
							}
						}
						//Eachの設定
						if (e == 0) {
							note0 = note;
						}
						else if (e == 1) {
							note1 = note;
							if (note0 != null) {
								var error0 = !note0.setEach(note1);
								var error1 = !note1.setEach(note0);
								if (error0) {
									this.createLastErrorMessage_withCammaAndRow(26, cammaCount, row);
									dp("note0のEachを二重定義しようとした->MaimaiFmenLoad::createMaimaiNotes");
									return null;
								}
								if (error1) {
									this.createLastErrorMessage_withCammaAndRow(27, cammaCount, row);
									dp("note1のEachを二重定義しようとした->MaimaiFmenLoad::createMaimaiNotes");
									return null;
								}
								if (!error0 && !error1) {
									if (note0.getButtonID() == note1.getButtonID()) {
										this.createLastErrorMessage_withCammaAndRow(28, cammaCount, row);
										dp("Eachのボタンが一緒である->MaimaiFmenLoad::createMaimaiNotes");
										return null;
									}
								}
							}
						}
					}
				}
			}
			
			if (!directbpm)
				time += 60.0 / bpm * (4.0 / beat);
			else
				time += directbpmValue;
			nsub = "";
			
			cammaCount++;
		}
		//ノート読込中
		else {
			nsub += sub;
		}
	
	}
	
	this.calcedFinishTime = time; //譜面の最後の(休符を含む)ノートの時間
	
	if (!settedNote) {
		this.createLastErrorMessage_withECode(33);
		dp("ノートが一つも作られなかった->MaimaiFmenLoad::createMaimaiNotes");
		return null;
	}
	
	var retNotes = notes;
	
	//JustTimeが小さい順に並べ替え
	retNotes.sort(
		function(x, y) {
			var a = x.getJustTime();
			var b = y.getJustTime();
			if( a < b ) return -1;
			if( a > b ) return 1;
			return 0;
		}
	);
	
	if (retNotes[retNotes.length - 1].getJustTime() > time)
	{
		this.createLastErrorMessage_withECode(34);
		dp("終了時間が早すぎて、やりかけのノートが存在する->MaimaiFmenLoad::createMaimaiNotes");
		return null;
	}
	
	return retNotes;
}

MaimaiFmenLoad.prototype.getCustomButtonId = function(buttonId, setting) {
	var b = (buttonId + setting.getTurnCustom()) % 8;
	if (setting.getMirrorCustom())
		return 7 - b;
	return b;
}

MaimaiFmenLoad.prototype.vectorOfCurveFromPlace = function(start, target) {
	while (start < 0) start += 8;
	start %= 8;
	while (target < 0) target += 8;
	target %= 8;

	if (target == (start + 1) % 8 || target == (start + 2) % 8 || target == (start + 3) % 8)
		return 1; // 時計回り
	if (target == (start + 5) % 8 || target == (start + 6) % 8 || target == (start + 7) % 8)
		return -1; // 反時計回り
	return 0; // エラー
}

//カーソルの位置からシーク時間を算出する。返り値が負の数ならカーソル位置は譜面外部
MaimaiFmenLoad.prototype.timeOfTextCursorPlace = function(res, difficulty, cursorPlace) {
	var textIndex = 0;
	var zeroCammaIndex = 0;
	var diff = (difficulty + 1);
	var find = false;
	while (textIndex + 9 < cursorPlace && textIndex + 9 < res.length) {
		if (res.substr(textIndex, 9) == "&inote_" + diff + "=") { //カーソルは譜面定義以降である
			textIndex += 9;
			zeroCammaIndex = textIndex; //0カンマ目
			find = true;
			
			while (textIndex < cursorPlace) {
				var sub1 = res.substr(textIndex, 1);
				//Eか&が見つかったらカーソルは譜面の中には無い
				if (sub1 == "E" || sub1 == "&") {
					find = false;
				}
				textIndex++;
			}
			break;
		}
		textIndex++;
	}
	if (find) {
		var res1 = "";
		//resを譜面で有効なものに絞ってやる
		for (var ii = 0; ii < cursorPlace; ii++) {
			if (ii < zeroCammaIndex) {
				res1 += res.substr(ii, 1);
			}
			else {
				var sub2 = res.substr(ii, 1);
				if (sub2 == "0" || sub2 == "1" || sub2 == "2" || sub2 == "3" || sub2 == "4" ||
					sub2 == "5" || sub2 == "6" || sub2 == "7" || sub2 == "8" || sub2 == "9" ||
					sub2 == "," || sub2 == "[" || sub2 == "]" || sub2 == "{" || sub2 == "}" ||
					sub2 == "(" || sub2 == ")" || sub2 == "h" || sub2 == "b" || sub2 == "." ||
					sub2 == "#" || sub2 == "-" || sub2 == "^" || sub2 == ":" || sub2 == "/" ||
					sub2 == "\n" ||
					//スライド直接指定
					sub2 == "A" || sub2 == "B" || sub2 == "C" ||
					//simai式GreeNPLUS追加スライド
					sub2 == ">" || sub2 == "<" || sub2 == "v" || sub2 == "q" || sub2 == "p" || sub2 == "s" || sub2 == "z")
				{
					res1 += res.substr(ii, 1);
				}
			}
		}
		cursorPlace = res1.length;
		res = res1;
		
		var fmen = "";
		if (difficulty == 0) fmen = this.fmenEasy;
		else if (difficulty == 1) fmen = this.fmenBasic;
		else if (difficulty == 2) fmen = this.fmenAdvanced;
		else if (difficulty == 3) fmen = this.fmenExpert;
		else if (difficulty == 4) fmen = this.fmenMaster;
		cursorPlace -= zeroCammaIndex;
		var sub = "";
		
		var time = 0;
		var bpm = -1;
		var beat = -1;
		var directbpm = false; //BPMの特殊な書き方フラグ(直接秒数入力)
		var directbpmValue = 0.0;
		var armBpmInputing = false;
		for (var i = 0; i < cursorPlace; i++) {
			sub = fmen.substr(i, 1);
			if (sub == "[") {
				armBpmInputing = true;
			}
			else if (sub == "]") {
				armBpmInputing = false;
			}
			//(BPM)
			else if (sub == "(" && !armBpmInputing) {
				i++;
				var bpmWriteCnt = 0;
				var sub2 = "";
				while (i < cursorPlace) {
					sub = fmen.substr(i, 1);
					if (bpmWriteCnt == 0) {
						if (sub == "#") {
							if (firstBPM > 0) {
								directbpm = true;
							}
						}
						else {
							directbpm = false;
						}
					}
					if (sub != ")") {
						sub2 += sub;
					}
					else {
						var bpml = Number(sub2);
						if (!directbpm) bpm = bpml;
						else directbpmValue = bpml;
						break;
					}
					i++;
					bpmWriteCnt++;
				}
			}
			//{beat}
			else if (sub == "{") {
				i++;
				var sub2 = "";
				while (i < cursorPlace) {
					sub = fmen.substr(i, 1);
					if (sub != "}") {
						sub2 += sub;
					}
					else {
						beat = Number(sub2);
						break;
					}
					i++;
				}
			}
			//確定したノート
			else if (sub == ",") {
				if (!directbpm)
					time += 60.0 / bpm * (4.0 / beat);
				else
					time += bpm;
			}
		}
		return time;
	}
	return -1;
}

