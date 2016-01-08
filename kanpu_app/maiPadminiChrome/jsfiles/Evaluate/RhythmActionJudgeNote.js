//==================
// RhythmActionJudgeNote
//==================

//鳴らすと決めたところから遅れて鳴る。
//
//音を鳴らす時間を-オフセットするんではなく、判定部分を+オフセットする
//判定がOffset分遅れれば、JustTimeでAnswerSound信号を送っても、鳴ったところで判定できる。
//移動に関しても+オフセット対象
//つまり、JustTimeはJustTimeとして持っておく。
//で、AnswerSound用のJustTime(SoundTime?)を用意し、これはjustTimeそのまま返す。
//判定や移動用のJustTimeは、justTime + AnswerSoundOffsetを使用する

function RhythmActionJudgeNote(_judgeTimer, _notes, _firstBPM) {
	if (!(typeof _notes === "undefined")) { //読込の継承段階で実行されたときは何もしないようにする。
		/// <summary>判定時間計算クラス</summary>
		this.judgeTimer = _judgeTimer;
		/// <summary>譜面</summary>
		this.notes = _notes;
		//第1小節1拍目の時間
		this.gameStartTime = (60.0 / _firstBPM) * 4.0 + RhythmActionJudgeNote.START_COUNT_START_TIME; //ゲームが始まる時間。4拍 + START_COUNT_START_TIME
		
		/// <summary>JUST判定ノート検索時の『ここから調べる』</summary>
		this.searchFromIndexInJustTimes = 0;
		/// <summary>MISS判定ノート検索時の『ここから調べる』</summary>
		this.searchFromIndexInMissTimes = 0;
		/// <summary>JUSTの時間がきたら知らせるための検索時の『ここから調べる』</summary>
		this.searchFromIndexInJustTimesOfTiming = 0;
		
		this.resetSearchIndex();
		
		/// <summary>MISS時間が早い順に並べ替えた譜面アクセサ</summary>
		this.missList = this.notes.slice();
		//MISS時間が早い順に並べ替える
		this.missList.sort(
			function(x, y) {
				var a = x.getJustTime() + x.getMissTime();
				var b = y.getJustTime() + y.getMissTime();
				if( a < b ) return -1;
				if( a > b ) return 1;
				return 0;
			}
		);
		//missTimeが0以下のときは『ミス判定しない』なので、ミス判定するところにindexを動かす
		for (this.searchFromIndexInMissTimes = 0; this.searchFromIndexInMissTimes < this.missList.length; this.searchFromIndexInMissTimes++) {
			if (this.missList[this.searchFromIndexInMissTimes].getMissTime() > 0) break;
		}
		
		/// <summary>アクションID別の、最後のノートのリスト
		//アクションID別の最後のノートのリストを作る
		this.lastNotesFromActionId = this.makeLastNoteFromActionId();
	}
}

//インデックスデータをリセット
RhythmActionJudgeNote.prototype.resetSearchIndex = function() {
	this.searchFromIndexInJustTimes = 0;
	this.searchFromIndexInMissTimes = 0;
	this.searchFromIndexInJustTimesOfTiming = 0;
}

//アンサーサウンドを最初に鳴らすなどのノートのインデックスを指定
RhythmActionJudgeNote.prototype.setSearchFromIndexInJustTimesOfTiming = function(setIndex) {
	this.searchFromIndexInJustTimesOfTiming = setIndex;
}

//スタートカウントが始まる時間
RhythmActionJudgeNote.START_COUNT_START_TIME = 0.5;
RhythmActionJudgeNote.prototype.getGameStartTime = function() { return this.gameStartTime; }

/// <summary>現在時間に一番近い判定時間を持つノートの楽譜インデックスを求める</summary>
/// <returns></returns>
RhythmActionJudgeNote.prototype.indexOfJustNotesNearNowTime = function(actionID, error) { //out boolean error
	var notesLength = this.notes.length;
	if (notesLength == 0) {
		if (error != null)
			error[0] = true;
		return 0;
	}
	//まずは『ここから調べる』を求める。
	//ミスの処理なんかで判定済みになっていたら、判定が終わっていない部分まで飛ぶ。
	if (this.notes[this.searchFromIndexInJustTimes].isJudged()) {
		for (var i = this.searchFromIndexInJustTimes + 1; i < notesLength; i++) {
			if (!this.notes[i].isJudged()) {
				this.searchFromIndexInJustTimes = i;
				break;
			}
		}
	}
	//現在時間に一番近い判定時間を持つノートを探す。
	var neartime = -1.0;
	var errorvalue = -2;
	var ret = errorvalue;
	var neartimeIndex = -1; //判定していいノートのインデックスを覚える
	for (var i = this.searchFromIndexInJustTimes; i < notesLength; i++) {
		//比較物が初期値でなく、前のループで一番近い時間が見つかったら抜ける。
		var sa = Math.abs(this.judgeTimer.getGameTime() - this.getGameStartTime() - this.notes[i].getJustTime());
		if (neartime >= 0 && neartime <= sa) { // 『neartime < sa』だと同時押しに対応できない
			ret = neartimeIndex; //以前のループで見つけた、判定していいノートのインデックスを返す。
			break;
		}
		//未判定で、アクションが一致したら判定していいノートである。
		else if (!this.notes[i].isJudged() && actionID == this.notes[i].getActionID()) {
			neartime = sa;
			neartimeIndex = i;
			
			//アクションIDが一致する中での最後のノートだった時、「前のループで～」が使えないので、ここで抜ける
			for (var j = 0; j < this.lastNotesFromActionId.length; j++) {
				if (this.notes[i] == this.lastNotesFromActionId[j]) {
					ret = neartimeIndex;
					break;
				}
			}
		}
	}
	
	//もしretがerrorvalueなら、処理できるノートが残っていないということ。
	//例えば、全部判定済みとか、引数のactionIDが譜面に全然出てこないとか。
	//あと-1は来ないと思うんだけどどう？
	if (ret == errorvalue) {
		if (error != null)
			error[0] = true;
		return 0;
	}
	else {
		if (error != null)
			error[0] = false;
		return ret; 
	}
}

/// <summary>
/// <para>判定すべきノートと現在時間の差</para>
/// <para>(errorがfalseのとき)0で超ぴったり。+で遅い。-で早い。</para>
/// <para>タイミング評価クラスで使えると思う。</para>
/// </summary>
/// <returns></returns>
//"タッチした瞬間"で調べる
RhythmActionJudgeNote.prototype.actionTimingResult = function(nowtime, actionID, error) { //out boolean error
	var index = this.indexOfJustNotesNearNowTime(actionID, error); //out
	var timing = nowtime - this.getGameStartTime() - this.notes[index].getJustTime() ;
	if (error != null && error[0]) {
		return 0;
	}
	else {
		this.timingEvaluate(timing, this.notes[index]);
	}
	return timing;
}
//ループの"今"で調べる
RhythmActionJudgeNote.prototype.actionTimingResult_loopingTime = function(actionID, error) { //out boolean error
	return this.actionTimingResult(this.judgeTimer.getGameTime(), actionID, error);
}

/// <summary>
/// <para>タイミング評価</para>
/// <para>BEST, GOOD, BADなどの評価をしたいならこれで行う。</para>
/// <para>評価できたら、notes[index].judgedをtrueにする。</para>
/// <para> </para>
/// <para>timingはJUSTからの相対なので、</para>
/// <para>[例] if (timing ＞= -BADTIME && timing ＜ -GOODTIME)</para>
/// <para>これでEARLYBADになる。BADTIMEなどはJUSTからの相対。</para>
/// </summary>
/// <param name="timing"></param>
/// <param name="index"></param>
RhythmActionJudgeNote.prototype.timingEvaluate = function(timing, note) {
	
}

/// <summary>
/// <para>自動ミス判定</para>
/// <para>毎ループ実行してるとミス処理が楽になるはず。</para>
/// </summary>
RhythmActionJudgeNote.prototype.autoMissProc = function() {
	var missListLength = this.missList.length;
	while (this.searchFromIndexInMissTimes < missListLength) {
		var note = this.missList[this.searchFromIndexInMissTimes];
		if (this.judgeTimer.getGameTime() >= note.getJustTime() + note.getMissTime() + this.getGameStartTime()) {
			//判定済みでなく、ミス判定相対は0を超えている時、ミス判定をする
			if (!note.isJudged() && note.getMissTime() > 0) {
				this.missProc(note);
			}
			//this.missProc2(note);
		}
		else {
			break;
		}
		this.searchFromIndexInMissTimes++;
	}
}

/// <summary>
/// <para>ミスが確定した時の処理</para>
/// <para>例えばMISS++;したいとか</para>
/// <para>引数のnoteは、オーバーライド先で例えば「アドリブノートだったらミスにしない」とかやりたいとき設定できるように</para>
/// </summary>
RhythmActionJudgeNote.prototype.missProc = function(note) {
	//判定済みフラグを立てる
	note.setJudged(true);
}

/// <summary>
/// <para>ミスが確定した時の、judgedを頼らない処理</para>
/// <para>例えばミス時間で評価を表示したいとか。</para>
/// <para>judgedにあたるものを確認するifは、オーバーライド先で行う</para>
/// </summary>
//RhythmActionJudgeNote.prototype.missProc2 = function(note) {
//	
//}

/// <summary>
/// <para>JUST判定時間が来たものを検索</para>
/// <para>JUST時間で何らかの処理をしたい場合はこれを毎ループ実行</para>
/// </summary>
RhythmActionJudgeNote.prototype.autoJustTimingProc = function() {
	var notesLength = this.notes.length;
	while (this.searchFromIndexInJustTimesOfTiming < notesLength) {
		var note = this.notes[this.searchFromIndexInJustTimesOfTiming];
		if (this.judgeTimer.getGameTime() >= note.getSoundTime() + this.getGameStartTime()) {
			this.justTimingProc(note);
		}
		else {
			break;
		}
		this.searchFromIndexInJustTimesOfTiming++;
	}
}

/// <summary>
/// <para>JUST時間が来たときの処理</para>
/// <para>JUST時間で何らかの処理をするときはこれをオーバーライドする</para>
/// </summary>
/// <param name="note"></param>
RhythmActionJudgeNote.prototype.justTimingProc = function(note) {
	
}

//アクションID別最後のノートのリスト作成
RhythmActionJudgeNote.prototype.makeLastNoteFromActionId = function() {
	var ret;
	var lastNotesFromActionIdList = [];
	for (var i = 0; i < this.notes.length; i++) {
		var note = this.notes[i];
		var find = false;
		for (var j = 0; j < lastNotesFromActionIdList.length; j++) {
			var checkNote = lastNotesFromActionIdList[j];
			if (checkNote != null) {
				//lastNotesFromActionIdListからnoteのアクションIDと一致するものを探し、
				//見つかったら、justTimeが遅ければlastNotesFromActionIdList[j]にnoteを上書きする。
				//見つからなければ、lastNotesFromActionIdListにnoteを追加する
				if (checkNote.getActionID() == note.getActionID()) {
					find = true;
					if (checkNote.getJustTime() < note.getJustTime()) {
						lastNotesFromActionIdList[j] = note;
					}
					break;
				}
			}
		}
		if (!find) {
			lastNotesFromActionIdList.push(note);
		}
	}
	
	ret = [lastNotesFromActionIdList.length];
	for (var i = 0; i < ret.length; i++) {
		var note = lastNotesFromActionIdList[i];
		if (note != null) {
			ret[i] = note;
		}
	}
	for (var i = 0; i < lastNotesFromActionIdList.length; i++) { lastNotesFromActionIdList[i] = null; }
	lastNotesFromActionIdList = null;
	return ret;
}

RhythmActionJudgeNote.prototype.getJudgeTimer = function() {
	return this.judgeTimer;
}

RhythmActionJudgeNote.prototype.getNote = function(indexForJustTimeNotes) { //JustTime順のノーツから取得する
	return this.notes[indexForJustTimeNotes];
}

RhythmActionJudgeNote.prototype.getNotesLength = function() {
	return this.notes.length;
}

RhythmActionJudgeNote.prototype.release = function() {
	this.judgeTimer = null;
	this.notes = null;
	if (this.missList != null) {
		for (var i = 0; i < this.missList.length; i++) {
			this.missList[i] = null;
		}
		this.missList = null;
	}
	if (this.lastNotesFromActionId != null) {
		for (var i = 0; i < this.lastNotesFromActionId.length; i++) {
			this.lastNotesFromActionId[i] = null;
		}
		this.lastNotesFromActionId = null;
	}
}
