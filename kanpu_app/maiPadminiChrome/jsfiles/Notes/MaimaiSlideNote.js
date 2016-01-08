//==================
// MaimaiSlideNote
//==================

function MaimaiSlideNote(NotesInfo, UniqueId, JustTime, MissTime, ActionID, ButtonID, RelativeNote, JustTimeForMove, OnStarMoveStartTimeFromStarJustTime) {
	MaimaiNoteB.call(this, NotesInfo, UniqueId, JustTime, MissTime, ActionID, ButtonID);
	this.relativeNote = null;
    this.setRelativeNotes(RelativeNote);
	this.syncNote = null;
	this.syncEvaluate = SyncEvaluate.NONE;
	this.syncEvaluated = false;
	this.onStarImage = ImageItem.getSlideOnStarSingle(); //スライド上の星の画像
	this.onStarLocation = new PointF(-100, -100); //スライド上の星の表示位置
	this.onStarAlphaPercent = 0;  //スライド上の星のフェード%値。0～1。
	this.onStarScalePercent = 0; //スライド上の星のスケール%値。0～1。
	this.onStarMovedDistance = 0; //スライド上の星の移動で使用するパターンIndex
	this.eachNote = null;
	this.justTimeForMove = JustTimeForMove; //移動用JUSTTIME
	this.onStarMoveStartTimeFromStarJustTime = OnStarMoveStartTimeFromStarJustTime; //スライド開始時間(relativeNote.justTimeとの相対時間)
	this.pattern = [];
	this.markerImage = ImageItem.getSlideMarkerSingle();
	this.totalDistance = 0;
	this.progress = -1; //スライド操作の進捗
	this.nextPattern = this; //次に押すべきノート
	this.evaluated = false; //評価済みフラグ(パターンはたくさんあるから、たとえばミスしたときたくさんミス増えてほしくない。1つでいい。)
	this.scalePercent = 1;
	this.resetNextPattern();
	
}

MaimaiSlideNote.prototype = new MaimaiNoteB(this.notesInfo, this.uniqueId, this.justTime, this.missTime, this.actionID, this.buttonID);

MaimaiSlideNote.prototype.getNoteType = function() { return NoteType.SLIDE; }

MaimaiSlideNote.prototype.getRelativeNote = function() { return this.relativeNote; }
MaimaiSlideNote.prototype.getEachNote = function() { return this.eachNote; }

MaimaiSlideNote.prototype.getSlideStartTime = function() { return this.getRelativeNote().getJustTime() + this.onStarMoveStartTimeFromStarJustTime; }
MaimaiSlideNote.prototype.getSlideStartSoundTime = function() { return this.getRelativeNote().getSoundTime() + this.onStarMoveStartTimeFromStarJustTime; }

//(画像の)回転度合
MaimaiSlideNote.prototype.getImageDegree = function() { return 45.0 * this.getRelativeNote().getButtonID() + 22.5; }

MaimaiSlideNote.prototype.getAutoJustTime = function() { return this.justTimeForMove + this.getTimeOffset(); }

//スライドマーカーの間隔
MaimaiSlideNote.MARKER_TO_SENSOR_MARGIN_HEAD = 17.0;
MaimaiSlideNote.MARKER_TO_SENSOR_MARGIN_FOOT = 10.0;
MaimaiSlideNote.MARKER_TO_MARKER_MARGIN = 18.0;
MaimaiSlideNote.prototype.getMarkerToSensorMarginHead = function() { return MaimaiSlideNote.MARKER_TO_SENSOR_MARGIN_HEAD; }
MaimaiSlideNote.prototype.getMarkerToSensorMarginFoot = function() { return MaimaiSlideNote.MARKER_TO_SENSOR_MARGIN_FOOT; }
MaimaiSlideNote.prototype.getMarkerToMarkerMargin = function() { return MaimaiSlideNote.MARKER_TO_MARKER_MARGIN; }

//判定クラスで… 判定したら一度これを行ってみて、もしnullなら評価する。nullでなければnextSensorを使用するリストに入れる。
//なぜこんなことを？→スライドを1ループで一気に判定させないため。チェック途中で変わっちゃったら都合が悪い。
MaimaiSlideNote.prototype.preNextSensor = function() {
	var prgrs = this.progress + 1;
	if (this.pattern.length > prgrs) {
		return this.pattern[prgrs];
	}
	return null; //nullが返ったら判定する
}

MaimaiSlideNote.prototype.nextSensor = function() {
	this.progress++;
	if (this.pattern.length > this.progress) {
		this.nextPattern = this.pattern[this.progress];
	}
}

//パターンのセット 楽譜作成時に使用
MaimaiSlideNote.prototype.setPattern = function(factory) { this.pattern = factory.getPattern(); }
MaimaiSlideNote.prototype.getPattern = function() { return this.pattern; }
//合計距離のセット 楽譜作成時に使用
MaimaiSlideNote.prototype.setTotalDistance = function() {
	var spNote = this.getLastPattern();
	if (!spNote.isCurve())
		this.totalDistance = spNote.getTotalDistance() + Math.abs(CircleCalculator.pointToPointDistance_st(spNote.getStartDrawPlace(), spNote.getTargetDrawPlace()));
	else {
		var radius = spNote.isOuterCurve() ? this.getSensor().getOuterAxis() : this.getSensor().getInnerAxis();
		this.totalDistance = spNote.getTotalDistance() + Math.abs(CircleCalculator.arcDistance(radius, 45.0));
	}
}

//次に押すべきノートの取得
MaimaiSlideNote.prototype.getNextPattern = function() { return this.nextPattern; }
//次に押すべきノートを初期化
MaimaiSlideNote.prototype.resetNextPattern = function() { this.nextPattern = this; this.progress = -1; }
//最後のパターンノートの取得
MaimaiSlideNote.prototype.getLastPattern = function() { return this.pattern[this.pattern.length - 1]; }
//最後のパターンノートは判定したのか
MaimaiSlideNote.prototype.isLastPatternJudged = function() { return this.getLastPattern().isJudged(); }
//評価済みフラグの操作と取得
MaimaiSlideNote.prototype.isEvaluated = function() { return this.evaluated; }
MaimaiSlideNote.prototype.setEvaluated = function(evaluated) { this.evaluated = evaluated; }

//スライド操作がひとつ前で終わったならTooLateではなく緑Late
MaimaiSlideNote.prototype.isLateGood = function() {
	if (this.pattern.length > 1) { return this.progress == this.pattern.length - 1; }
	return false; //スライドパターンが1つしかない(始点と終点の間のセンサーは無い)場合はTooLateにする
}

//1つめのスライドパターンノートであればサウンドエフェクトを鳴らす必要がある だから取得できるようにする
MaimaiSlideNote.prototype.getFirstPattern = function() { return this.pattern[0]; }

//リレーティブノート後入れ関連
MaimaiSlideNote.prototype.setRelativeNote1 = function(RelativeNote) { this.relativeNote = RelativeNote; }
MaimaiSlideNote.prototype.setRelativeNote2 = function() { if (this.relativeNote != null) this.relativeNote.setRelativeNote1(this); }
MaimaiSlideNote.prototype.setRelativeNotes = function(RelativeNote) { this.setRelativeNote1(RelativeNote); this.setRelativeNote2(); }

MaimaiSlideNote.prototype.isEach = function() {
	return this.eachNote != null;
}

//eachノートを設定。すでにeachが設定されてある場合はfalseを返す
MaimaiSlideNote.prototype.setEach = function(note) {
	if (this.eachNote == null) {
		this.eachNote = note;
		this.onStarImage = ImageItem.getSlideOnStarEach();
		this.markerImage = ImageItem.getSlideMarkerEach();
		return true;
	}
	return false;
}

MaimaiSlideNote.prototype.getSyncEvaluate = function() { return this.syncEvaluate; }
MaimaiSlideNote.prototype.setSyncEvaluate = function(value) { this.syncEvaluate = value; }
MaimaiSlideNote.prototype.setSyncNote = function(note) { this.syncNote = note; }
MaimaiSlideNote.prototype.getSyncNote = function() { return this.syncNote; }
MaimaiSlideNote.prototype.isSyncEvaluated = function() { return this.syncEvaluated; }
MaimaiSlideNote.prototype.setSyncEvaluated = function(value) { this.syncEvaluated = value; }

MaimaiSlideNote.prototype.checkSync = function() {
	var ret = false;
	if (this.getSyncEvaluate() == SyncEvaluate.FASTGREAT) {
		if (this.getSyncNote().getSyncEvaluate() == SyncEvaluate.FASTGOOD ||
			this.getSyncNote().getSyncEvaluate() == SyncEvaluate.FASTGREAT || 
			this.getSyncNote().getSyncEvaluate() == SyncEvaluate.PERFECT ) {
			ret = true;
		}
	}
	else if (this.getSyncEvaluate() == SyncEvaluate.PERFECT) {
		if (this.getSyncNote().getSyncEvaluate() == SyncEvaluate.FASTGREAT ||
			this.getSyncNote().getSyncEvaluate() == SyncEvaluate.PERFECT || 
			this.getSyncNote().getSyncEvaluate() == SyncEvaluate.LATEGREAT ) {
			ret = true;
		}
	}
	else if (this.getSyncEvaluate() == SyncEvaluate.LATEGREAT) {
		if (this.getSyncNote().getSyncEvaluate() == SyncEvaluate.PERFECT ||
			this.getSyncNote().getSyncEvaluate() == SyncEvaluate.LATEGREAT || 
			this.getSyncNote().getSyncEvaluate() == SyncEvaluate.LATEGOOD ) {
			ret = true;
		}
	}
	this.setSyncEvaluated(true);
	this.getSyncNote().setSyncEvaluated(true);
	return ret;
}

MaimaiSlideNote.prototype.fadeOnStarAndMarker = function() {
	//スタータップの移動状況を取得し、スライドマーカーをフェードインする
	//フェード開始時間
	var fadeStartTime = this.getRelativeNote().getJustTime() + this.getGameStartTime() - this.getGuideSpeed();
	//開始時間から終了時間の間のどれくらいの時間にいるかを求める（割合）
	var fadeTimeParcent = (this.getJudgeTimer().getGameTime() - fadeStartTime) / this.getGuideSpeed();
	if (fadeTimeParcent > 1) fadeTimeParcent = 1;
	if (fadeTimeParcent < 0) fadeTimeParcent = 0;
	//フェードイン
	this.alphaPercent = fadeTimeParcent;

	//スライド上のスター描画処理
	//拡大・不透明化に要する時間
	var starGuideSpeedFade = 0.15; //適当に決める。
	//フェード開始時間
	var fadeStartTime2 = this.getRelativeNote().getJustTime() + this.getGameStartTime() - starGuideSpeedFade;
	//開始時間から終了時間の間のどれくらいの時間にいるかを求める（割合）
	var fadeTimeParcent2 = (this.getJudgeTimer().getGameTime() - fadeStartTime2) / starGuideSpeedFade;
	var fadeTimeParcent2over1 = false;
	if (fadeTimeParcent2 < 0)
		fadeTimeParcent2 = 0;
	else if (fadeTimeParcent2 > 1) {
		fadeTimeParcent2 = 1;
		fadeTimeParcent2over1 = true;
	}
	//フェードイン
	this.onStarAlphaPercent = fadeTimeParcent2over1 ? 1.0 : //☆を動かす時間になっているのなら、必ず完全不透明。
							  fadeTimeParcent2 * 1.0 ; //適当に調節する
	//スケール
	this.onStarScalePercent = fadeTimeParcent * 1.5; //適当に調節する
}

MaimaiSlideNote.prototype.moveOnStar = function() {
	//移動に要する時間
	var timeRange = this.justTimeForMove + this.getTimeOffset() - this.getSlideStartTime(); //時間範囲
	//移動開始時間
	var moveStartTime = this.getSlideStartTime();
	//経過時間％
	var moveTimeParcent = (this.getJudgeTimer().getGameTime() - this.getGameStartTime() - moveStartTime) / timeRange;
	if (moveTimeParcent < 0.0) moveTimeParcent = 0.0;
	else if (moveTimeParcent > 1.0) moveTimeParcent = 1.0;

	var distance = this.totalDistance * moveTimeParcent; //始点から今まで移動した距離
	this.onStarMovedDistance = distance;

	var ptn = 0; //どのパターンを使うべきか
	while (ptn < this.pattern.length - 1 && distance >= this.pattern[ptn + 1].getTotalDistance()) { 
		//必要な合計距離を越えていたら、それを使う。
		ptn++;
	}
	
	var sp = this.pattern[ptn];
	var pDistance = distance - sp.getTotalDistance(); //パターンからの距離

	var newloc;
	if (!sp.isCurve()) {
		//直線
		//2点間の角度を求めて距離を半径にして移動する
		newloc = CircleCalculator.pointToPointMovePoint(sp.getStartDrawPlace(), sp.getTargetDrawPlace(), pDistance);
	}
	else { //曲線
		//円の中心(getCenterAxis())、外周/内周の半径(getOuterAxis()/getInnerAxis())、方向(sp.vec)、開始角度 から、pDistance角度まで移動して、その地点
		//newloc = //円の中心と周の半径と開始角度は引数、pDistanceと方向は掛けてひとつの引数。
		var radius = sp.isOuterCurve() ? this.getSensor().getOuterAxis() : this.getSensor().getInnerAxis();
		newloc = CircleCalculator.pointOnCircle_prd(this.getSensor().getCenterPieceAxis(), radius, sp.getStartDegree() + CircleCalculator.arcDegreeFromArcDistance(radius, pDistance) * sp.getVector());
	}
	this.onStarLocation = newloc;
		
	//☆と共にスライドマーカーを消すオプションなら、MISS判定より前に消しちゃいたい
	if (this.isAutoDeleteSlideMarker() && moveStartTime + timeRange + this.getGameStartTime() + 0.5 < this.getJudgeTimer().getGameTime()) 
		this.visible = false;
}

MaimaiSlideNote.prototype.drawMarker = function(canvas, fade) { 
	var drawloc;
	//画像の大きさ変更に伴う距離の変更のためのスケールサイズ取得
	var scale = this.getSlideMarkerSizeAdaptation() ? this.getMarkerSize() : 1.0;
	//スライドマーカーを☆の移動に合わせて消す
	var autoMarkerDeleteDistance = 0;
	if (this.isAutoDeleteSlideMarker()) {
		autoMarkerDeleteDistance = this.onStarMovedDistance;
	}
	
	//スライド先の方から描画
	var distance = this.totalDistance - this.getMarkerToSensorMarginHead() * scale;
	for (var i = this.pattern.length - 1; i >= this.progress && i >= 0; i--) {
		var sp = this.pattern[i];
		
		var onStarToTotalDistance = autoMarkerDeleteDistance - sp.getTotalDistance(); //スライドマーカーを☆の移動に合わせて消す
		if (onStarToTotalDistance < 0) onStarToTotalDistance = 0;

		while (distance >= sp.getTotalDistance() + onStarToTotalDistance) {
			if (i == 0 && distance < sp.getTotalDistance() + this.getMarkerToSensorMarginFoot() * scale) {
				//始点でマージン以下なら描くのやめる
				break;
			}
			var pDistance = distance - sp.getTotalDistance(); //パターンからの距離
			if (!sp.isCurve()) { 
				//直線
				//2点間の角度を求めて距離を半径にして移動する
				drawloc = CircleCalculator.pointToPointMovePoint(sp.getStartDrawPlace(), sp.getTargetDrawPlace(), pDistance);
				var args = [this.markerImage];
				TechnicalDraw.scaleDraw_ps(canvas, drawloc, scale, function() {
					TechnicalDraw.rotateDrawBitmap_xy(canvas, args[0], 0, 0, sp.getImageDegree() - 90.0, fade);
				});
			}
			else { 
				//曲線
				//円の中心(getCenterAxis())、外周/内周の半径(getOuterAxis()/getInnerAxis())、方向(sp.vec)、開始角度 から、pDistance角度まで移動して、その地点
				//drawloc = //円の中心と周の半径と開始角度は引数、pDistanceと方向は掛けてひとつの引数。
				//drawlocの位置にsp.dStartDeg回転して(0度のとき右向きなので-90度回転は必要ない)、vecが-1なら反転して(180度回転でもいいかも)、描画。
				var radius = sp.isOuterCurve() ? this.getSensor().getOuterAxis() : this.getSensor().getInnerAxis();
				var pDeg = CircleCalculator.arcDegreeFromArcDistance(radius, pDistance);
				drawloc = CircleCalculator.pointOnCircle_prd(this.getSensor().getCenterPieceAxis(), radius, sp.getStartDegree() + pDeg * sp.getVector());
				var args = [this.markerImage];
				TechnicalDraw.scaleDraw_ps(canvas, drawloc, scale, function() {
					TechnicalDraw.rotateDrawBitmap_xy(canvas, args[0], 0, 0, sp.getStartDegree() + pDeg * sp.getVector() + (sp.getVector() == 1 ? 0 : 180), fade);
				});
			}
			distance -= this.getMarkerToMarkerMargin() * scale;
		}
	}
}

MaimaiSlideNote.prototype.moveNote = function() {
	if (this.visible) { 
		//フェード
		this.fadeOnStarAndMarker();
		//スライド上スターを移動
		this.moveOnStar();
	}
}

MaimaiSlideNote.prototype.drawNote = function(canvas) {
	if (this.visible) {
		//スタータップの移動状況を取得し、スライドマーカーをフェードインする
		//スライドマーカーを描画する
		this.drawMarker(canvas, this.alphaPercent);
		//スライド上のスターを描画する
		var args = [this.onStarImage, this.getImageDegree(), this.onStarAlphaPercent];
		TechnicalDraw.scaleDraw_ps(canvas, this.onStarLocation, this.onStarScalePercent * this.getMarkerSize(), function() {
			TechnicalDraw.rotateDrawBitmap_xy(canvas, args[0], 0, 0, args[1], args[2]);
		});
	}
}

MaimaiSlideNote.prototype.release = function() {
	MaimaiNoteB.prototype.release.apply(this);
	this.relativeNote = null;
	this.syncNote = null;
	this.onStarImage = null;
	this.eachNote = null;
	if (this.pattern != null) {
		for (var i = 0; i < this.pattern.length; i++) {
			this.pattern[i] = null;
		}
	}
	this.markerImage = null;
	this.nextPattern = null;
	this.onStarLocation = null;
}

MaimaiSlideNote.prototype.getSoundTime = function() {
	//移動スピード
	var moveSpeed = this.calcMoveSpeed();
	//センサーに侵入する距離差分
	var subsensor = MaimaiVirtualHardWareSensor.OLD_TYPE_RADIUS;
	//移動スピードでセンサーに侵入した時間
	var sensorTime = (this.totalDistance - subsensor) / moveSpeed;
	//時間オフセットを足して返す
	return this.getSlideStartSoundTime() + sensorTime;
}

MaimaiSlideNote.prototype.getJustTime = function() {
	return this.getSoundTime() + this.getTimeOffset();
}

MaimaiSlideNote.prototype.calcMoveSpeed = function() {
	//移動に要する時間
	var timeRange = this.justTimeForMove + this.getTimeOffset() - this.getSlideStartTime();
	//移動スピード
	return this.totalDistance / timeRange;
}

MaimaiSlideNote.prototype.getMissTime = function() {
	//スライドは、AutoJustTimeよりJustTimeの方が早いので、差分をMissTimeに加算しておく。
	return MaimaiNoteB.prototype.getMissTime.apply(this) + (this.getAutoJustTime() - this.getJustTime());
}

