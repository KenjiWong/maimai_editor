//==================
// MaimaiTapNote
//==================
function MaimaiTapNote(NotesInfo, UniqueId, JustTime, MissTime, ActionID, ButtonID) {
	MaimaiNoteB.apply(this, arguments);
	this.image = ImageItem.getCircleSingle();
	this.location = new PointF(-100, -100);
	this.eachNote = null;
	this.syncNote = null;
	this.syncEvaluate = SyncEvaluate.NONE;
	this.syncEvaluated = false;
	this.arcRadius = 0;
	this.arcStartDeg = 0;
	this.arcSweepDeg = 0;
	this.arcVisible = false;
	this.setArcVisible(true);
}

MaimaiTapNote.prototype = new MaimaiNoteB(this.notesInfo, this.uniqueId, this.justTime, this.missTime, this.actionID, this.buttonID);

MaimaiTapNote.prototype.getNoteType = function() { return NoteType.CIRCLETAP; }
MaimaiTapNote.prototype.setArcVisible = function(value) { this.arcVisible = value; }
MaimaiTapNote.prototype.getEachArcVisible = function() { return this.arcVisible; }
MaimaiTapNote.prototype.getEachNote = function() { return this.eachNote; }
MaimaiTapNote.prototype.getSyncEvaluate = function() { return this.syncEvaluate; }
MaimaiTapNote.prototype.setSyncEvaluate = function(value) { this.syncEvaluate = value; }
MaimaiTapNote.prototype.setSyncNote = function(note) { this.syncNote = note; }
MaimaiTapNote.prototype.getSyncNote = function() { return this.syncNote; }
MaimaiTapNote.prototype.isSyncEvaluated = function() { return this.syncEvaluated; }
MaimaiTapNote.prototype.setSyncEvaluated = function(value) { this.syncEvaluated = value; }

MaimaiTapNote.prototype.checkSync = function() {
	var ret = false;
	if (this.getSyncEvaluate() == SyncEvaluate.FASTGOOD) {
		if (this.getSyncNote().getSyncEvaluate() == SyncEvaluate.FASTGOOD ||
			this.getSyncNote().getSyncEvaluate() == SyncEvaluate.FASTGREAT) {
				ret = true;
		}
	}
	else if (this.getSyncEvaluate() == SyncEvaluate.FASTGREAT) {
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
	else if (this.getSyncEvaluate() == SyncEvaluate.LATEGOOD) {
		if (this.getSyncNote().getSyncEvaluate() == SyncEvaluate.LATEGREAT ||
			this.getSyncNote().getSyncEvaluate() == SyncEvaluate.LATEGOOD ) {
			ret = true;
		}
	}
	this.setSyncEvaluated(true);
	this.getSyncNote().setSyncEvaluated(true);
	return ret;
}

MaimaiTapNote.prototype.moveNote = function() {
	if (this.visible) {
		//TODO 譜面描画に使う変数の準備
		//拡大・不透明化に要する時間
		var guideSpeedFade = this.getGuideSpeed() * 0.25;
		//移動に要する時間
		var guideSpeedMove = this.getGuideSpeed() * 0.75;
		
		//ボタン番号から角度を求める
		var deg = this.getSensor().getPieceDegree(this.getButtonID(), MaimaiVirtualHardWareSensor.NUMBER_OF_OUTER_SENSOR);
		var rad = CircleCalculator.toRadian(deg);
		
		//TODO 拡大や不透明化の処理
		//フェード開始時間
		var fadeStartTime = this.getJustTime() + this.getGameStartTime() - this.getGuideSpeed();
		//開始時間から終了時間の間のどれくらいの時間にいるかを求める（割合）
		var fadeTimeParcent = (this.getJudgeTimer().getGameTime() - fadeStartTime) / guideSpeedFade;
		if (fadeTimeParcent > 1) fadeTimeParcent = 1;
		//フェードイン%を取得
		this.alphaPercent = fadeTimeParcent;
		//スケール%を取得
		this.scalePercent = fadeTimeParcent;
		
		//TODO ノートを動かす処理
		//円の中心から描画開始位置までの距離
		var drawStartX = this.notesDrawStartPointToCenterDistance();
		
		//移動開始時間
		var moveStartTime = this.getJustTime() + this.getGameStartTime() - guideSpeedMove;
		//開始時間から終了時間の間のどれくらいの時間にいるかを求める（割合）
		var moveTimeParcent = (this.getJudgeTimer().getGameTime() - moveStartTime) / guideSpeedMove;
		//テールを動かす時間になっていないなら、最初の位置のまま動かないでいる。
		if (moveTimeParcent < 0) moveTimeParcent = 0;
		//円の中心から描画開始位置までの距離 + ヘッドであるとき半分ずらす
		var moveStartPlace = drawStartX;
		//移動区間
		var moveSection = this.getSensor().getOuterAxis() - moveStartPlace;
		//時間の割合から現在位置に使う値xを求める。
		var moveNowPlace = moveSection * moveTimeParcent + moveStartPlace;
		//フットの描画
		//半径(中心からの移動量)*サイン及びコサイン+円の中心位置//-画像の中心
		//Cos及びSinに掛けられる値は垂直方向に、単純に加算すると平行方向に伸びる。
		var x = moveNowPlace * Math.cos(rad) + this.getSensor().getCenterSensorPiece().getX();
		var y = moveNowPlace * Math.sin(rad) + this.getSensor().getCenterSensorPiece().getY();
		this.location.set(x, y);
		
		//とりあえず、半径の3倍移動したら次ループの描画処理対象から外す。
		if (moveNowPlace > this.getSensor().getOuterRadius() * 3) this.visible = false;
	}
	
	this.moveArc();
}

MaimaiTapNote.prototype.drawNote = function(canvas) {
	//円弧を描く
	if (this.arcVisible) {
		var color = "rgb(0,0,0)";
		var fade = this.alphaPercent;
		var width = 1;
		
		if (this.getNoteType() == NoteType.BREAK)
			color = "rgba(255,0,0,"+fade+")"; //Color.FromArgb(fade, Color.Red);
		else if (this.isEach()) {
			color = "rgba(255,255,0,"+fade+")"; //Color.FromArgb(fade, Color.Yellow);
			width = 2;
		}
		else if (this.getNoteType() == NoteType.CIRCLETAP || this.getNoteType() == NoteType.HOLDHEAD)
			color = "rgba(255,175,200,"+fade+")"; //Color.FromArgb(fade, 255, 175, 200); //ピンク
		else if (this.getNoteType() == NoteType.STARTAP)
			color = "rgba(0,255,255,"+fade+")"; //Color.FromArgb(fade, Color.Cyan);
		
		canvas.save();
		canvas.strokeStyle = color;
		canvas.lineWidth = width;
		
		//お互いのボタンが近い方の円弧描画
		canvas.beginPath();
		canvas.arc(this.getSensor().getCenterPieceAxis().x, this.getSensor().getCenterPieceAxis().y, this.arcRadius, CircleCalculator.toRadian(this.arcStartDeg), CircleCalculator.toRadian(this.arcStartDeg + this.arcSweepDeg), this.arcSweepDeg < 0);
		canvas.stroke();

		//遠い方のちょっとの円弧を描く
		canvas.lineWidth = 1;
		var arcSweepDeg2 = this.arcSweepDeg > 0 ? -45.0 : 45.0;
		canvas.beginPath();
		canvas.arc(this.getSensor().getCenterPieceAxis().x, this.getSensor().getCenterPieceAxis().y, this.arcRadius, CircleCalculator.toRadian(this.arcStartDeg), CircleCalculator.toRadian(this.arcStartDeg + arcSweepDeg2), this.arcSweepDeg > 0);
		canvas.stroke();
		
		canvas.restore();
	}
	
	if (this.visible) {
		//フェードインする
		//ノートの描画
		var args = [this.location, this.scalePercent * this.getMarkerSize(), this.image, this.getImageDegree(), this.alphaPercent];
		TechnicalDraw.scaleDraw_ps(canvas, args[0], args[1], function() { 
			TechnicalDraw.rotateDrawBitmap_xy(canvas, args[2], 0, 0, args[3], args[4]);
		});
	}
}

MaimaiTapNote.prototype.isEach = function() {
	return this.eachNote != null;
}

//eachノートを設定。すでにeachが設定されてある場合はfalseを返す
MaimaiTapNote.prototype.setEach = function(note) {
	if (this.eachNote == null) {
		this.eachNote = note;
		this.image = ImageItem.getCircleEach();
		return true;
	}
	return false;
}

//円弧エフェクト設定
MaimaiTapNote.prototype.moveArc = function() {
	if (this.arcVisible) { 
		//TODO ノートを動かすのと一緒の下準備
		var guideSpeedMove = this.getGuideSpeed() * 0.75;
		//円の中心から描画開始位置までの距離
		var drawStartX = this.notesDrawStartPointToCenterDistance();
		//移動開始時間
		var moveStartTime = this.getJustTime() + this.getGameStartTime() - guideSpeedMove;
		//開始時間から終了時間の間のどれくらいの時間にいるかを求める（割合）
		var moveTimeParcent = (this.getJudgeTimer().getGameTime() - moveStartTime) / guideSpeedMove;
		//動かす時間になっていないなら、最初の位置のまま動かないでいる。
		if (moveTimeParcent < 0) moveTimeParcent = 0;
		//円の中心から描画開始位置までの距離 + ヘッドであるとき半分ずらす
		var moveStartPlace = drawStartX;
		
		//時間が130%超えたら消す
		if (moveTimeParcent > 1.3) 
			this.arcVisible = false;
		
		this.arcRadius = (this.getSensor().getOuterAxis() - moveStartPlace) * moveTimeParcent + moveStartPlace;
		
		if (this.isEach()) {
			var n0 = this.getButtonID();
			var n1 = this.getEachNote().getButtonID();

			var vec1 = n0;
			while (Math.abs(vec1) % 8 != n1) 
				vec1++; //時計回り

			var vec2 = n0;
			while (Math.abs(vec2 + 8) % 8 != n1) 
				vec2--; //反時計回り

			var vec1z = Math.abs(vec1 - n0);
			var vec2z = Math.abs(vec2 - n0);
			var vec = vec1z < vec2z ? vec1z : //時計回りの方が近い
						vec1z > vec2z ? -vec2z : //反時計回りの方が近い
						vec1z; //同じ距離ならどっちでもいい

			//近い方の円弧を描く
			this.arcStartDeg = this.getSensor().getPieceDegree(n0, MaimaiVirtualHardWareSensor.NUMBER_OF_OUTER_SENSOR);
			this.arcSweepDeg = vec * 45.0;
		}
		else {
			this.arcStartDeg = this.getSensor().getPieceDegree(this.getButtonID(), MaimaiVirtualHardWareSensor.NUMBER_OF_OUTER_SENSOR);
			this.arcSweepDeg = 45.0;
		}
	}
}

MaimaiTapNote.prototype.release = function() {
	MaimaiNoteB.prototype.release.apply(this);
	this.image = null;
	this.eachNote = null;
	this.syncNote = null;
	this.location = null;
}

