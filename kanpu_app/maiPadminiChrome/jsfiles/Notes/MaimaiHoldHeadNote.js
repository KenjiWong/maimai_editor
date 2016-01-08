//==================
// MaimaiHoldHeadNote
//==================
function MaimaiHoldHeadNote(NotesInfo, UniqueId, JustTime, MissTime, ActionID, ButtonID) {
	MaimaiTapNote.apply(this, arguments);
	this.headImage = ImageItem.getHoldHeadSingle(this.getAngulatedHold());
	this.footImage = ImageItem.getHoldFootSingle(this.getAngulatedHold());
	this.bodyImage = ImageItem.getHoldBodySingle();
	this.headLocation = new PointF(-100, -100);
	this.footLocation = new PointF(-100, -100);
	this.bodyLocation = new PointF(-100, -100);
	this.bodyScale = 0;
	this.relativeNote = null;
	
	//評価用
	this.evaluate = 0; //ヘッドでの評価を記憶する（点数に反映されるのはフットのとき）
	this.pushed = false; //ボタンを押したフラグ
	this.effectInstance = null; //ボタンを押してから、離すか押しっぱなしミスになるまで表示されるエフェクトのインスタンス
	
}

MaimaiHoldHeadNote.prototype = new MaimaiTapNote(this.notesInfo, this.uniqueId, this.justTime, this.missTime, this.actionID, this.buttonID);

MaimaiHoldHeadNote.prototype.getNoteType = function() { return NoteType.HOLDHEAD; }

MaimaiHoldHeadNote.prototype.getRelativeNote = function() { return this.relativeNote; }

//リレーティブノート後入れ関連
MaimaiHoldHeadNote.prototype.setRelativeNote1 = function(RelativeNote) { this.relativeNote = RelativeNote; }
MaimaiHoldHeadNote.prototype.setRelativeNote2 = function() { this.relativeNote.setRelativeNote1(this); }
MaimaiHoldHeadNote.prototype.setRelativeNotes = function(RelativeNote) { this.setRelativeNote1(RelativeNote); this.setRelativeNote2(); }

//イーチノート後入れ関連
MaimaiHoldHeadNote.prototype.setEach = function(note) { 
	if (this.eachNote == null) {
		this.eachNote = note;
		this.headImage = ImageItem.getHoldHeadEach(this.getAngulatedHold());
		this.footImage = ImageItem.getHoldFootEach(this.getAngulatedHold());
		this.bodyImage = ImageItem.getHoldBodyEach();
		return true;
	}
	return false;
}

MaimaiHoldHeadNote.prototype.moveNote = function() { 
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
		
		//フットを動かす
		//移動開始時間
		var footMoveStartTime = this.relativeNote.getJustTime() + this.getGameStartTime() - guideSpeedMove;
		//開始時間から終了時間の間のどれくらいの時間にいるかを求める（割合）
		var footMoveTimeParcent = (this.getJudgeTimer().getGameTime() - footMoveStartTime) / guideSpeedMove;
		//フットを動かす時間になっていないなら、最初の位置のまま動かないでいる。
		if (footMoveTimeParcent < 0) footMoveTimeParcent = 0;
		//円の中心から描画開始位置までの距離
		var moveStartPlace = drawStartX;
		//移動区間
		var moveSection = this.getSensor().getOuterAxis() - moveStartPlace;
		//時間の割合から現在位置に使う値xを求める。
		var footMoveNowPlace = moveSection * footMoveTimeParcent + moveStartPlace;
		//フットの描画
		//半径(中心からの移動量)*サイン及びコサイン+円の中心位置
		//cos及びsinに掛けられる値は垂直方向に、単純に加算すると平行方向に伸びる。
		var x = footMoveNowPlace * Math.cos(rad) + this.getSensor().getCenterSensorPiece().getX();
		var y = footMoveNowPlace * Math.sin(rad) + this.getSensor().getCenterSensorPiece().getY();
		this.footLocation.set(x, y);
		
		//ヘッドを動かす
		//移動開始時間
		var headMoveStartTime = this.getJustTime() + this.getGameStartTime() - guideSpeedMove;
		//開始時間から終了時間の間のどれくらいの時間にいるかを求める（割合）
		var headMoveTimeParcent = (this.getJudgeTimer().getGameTime() - headMoveStartTime) / guideSpeedMove;
		//ヘッドを動かす時間になっていないなら、最初の位置のまま動かないでいる。
		if (headMoveTimeParcent < 0) headMoveTimeParcent = 0;
		//ホールドヘッドのとき、ヘッドが目標値まで動き切って、フットがまだ目標値まで動き切ってなければヘッドを目標値で止める。
		if (headMoveTimeParcent > 1) { 
			if (footMoveTimeParcent < 1)
				headMoveTimeParcent = 1;
			//テールが目標値まで動き切ったら、マーカーの元の形(円)になるようにする。
			else
				headMoveTimeParcent = footMoveTimeParcent;
		}
		//時間の割合から現在位置に使う値xを求める。
		var headMoveNowPlace = moveSection * headMoveTimeParcent + moveStartPlace;
		//ヘッドの描画
		//半径(中心からの移動量)*サイン及びコサイン+円の中心位置\
		//cos及びsinに掛けられる値は垂直方向に、単純に加算すると平行方向に伸びる。
		x = headMoveNowPlace * Math.cos(rad) + this.getSensor().getCenterSensorPiece().getX();
		y = headMoveNowPlace * Math.sin(rad) + this.getSensor().getCenterSensorPiece().getY();
		this.headLocation.set(x, y);

		//ボディーを作って動かす
		var halfHeight = ImageItem.NOTE_SIZE / 2;
		var noteImgFootHeight = halfHeight - 1 * 2;
		var noteImgHeadHeight = ImageItem.NOTE_SIZE - noteImgFootHeight;

		//ボディーを作って描画情報を入れる
		//ボディー描画位置yとボディーの長さを決める
		var bodyY = footMoveNowPlace + noteImgFootHeight;
		var bodyHeight = Math.floor(headMoveNowPlace - footMoveNowPlace + noteImgHeadHeight - noteImgFootHeight); //ヘッドとフットの大きさはちょうど半分ではないのでその差分(ズレ)を加算する

		//縮小すると(ホールドヘッド/フットと伸ばし棒の間に)スキマが必要になるので、調節する (拡大すると長すぎるから縮める)
		var zure = 0; //1超過なら+1,1未満なら-1
		if (this.scalePercent * this.getMarkerSize() > 1.0) zure = 1;
		else if (this.scalePercent * this.getMarkerSize() < 1.0) zure = -1;
		var bodyOffset = (ImageItem.NOTE_SIZE - (ImageItem.NOTE_SIZE * this.scalePercent * this.getMarkerSize())) / 2.0 + zure;
		bodyY = bodyY - bodyOffset;
		bodyHeight = Math.floor(bodyHeight / (this.scalePercent * this.getMarkerSize()));
		x = (((bodyY - 1) * Math.cos(rad) + this.getSensor().getCenterSensorPiece().getX()));
		y = (((bodyY - 1) * Math.sin(rad) + this.getSensor().getCenterSensorPiece().getY()));
		this.bodyLocation.set(x, y);
		this.bodyScale = bodyHeight / ImageItem.NOTE_SIZE; //長さは、ImageItem.NOTE_SIZEが1として、bodyHeightとの割合を求める
		
		//とりあえず、半径の3倍移動したら次ループの描画処理対象から外す。
		if (footMoveNowPlace > this.getSensor().getOuterAxis() * 3) this.visible = false;
	}
	this.moveArc();
}

MaimaiHoldHeadNote.prototype.drawNote = function(canvas) { 
	//円弧を描く
	if (this.arcVisible) {
		var color = "rgb(0,0,0)";
		var fade = this.alphaPercent;
		var width = 1;
		
		if (this.getNoteType() == NoteType.BREAK)
			color = "rgba(255,0,0,"+fade+")"; //Color.FromArgb(fade, Color.Red);
		else if (this.isEach()) {
			color = "rgba(255,255,0,"+fade+")"; //Color.FromArgb(fade, Color.yellow);
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
		
		var args = [this.headImage, this.footImage, this.bodyImage, this.getImageDegree(), this.alphaPercent, this.bodyScale];
		
		var sp_ms_multi = this.scalePercent * this.getMarkerSize();
		
		//ヘッド描画
		TechnicalDraw.scaleDraw_ps(canvas, this.headLocation, sp_ms_multi, function() {
			TechnicalDraw.rotateDrawBitmap_xy(canvas, args[0], 0, 0, args[3], args[4]);
		});

		//フット描画
		TechnicalDraw.scaleDraw_ps(canvas, this.footLocation, sp_ms_multi, function() {
			TechnicalDraw.rotateDrawBitmap_xy(canvas, args[1], 0, 0, args[3], args[4]);
		});
		
		//ボディーの長さが1以上あれば描画する。
		if (this.bodyScale > 0) { 
			TechnicalDraw.scaleDraw_ps(canvas, this.bodyLocation, sp_ms_multi, function() {
				TechnicalDraw.rotateDraw_xy(canvas, 0, 0, args[2].height / 2, args[3] + 180 + 90, function() { //角度に180を足すのは、やらないと上から下に伸びるから。下から上に伸びたいので、180回転で反転っぽくした。90度足してるのはJavascript限定
					TechnicalDraw.scaleDraw_xy(canvas, 0, 0, 1, args[5], function() { //HeadからFootの位置まで、画像を引き伸ばす。
						TechnicalDraw.fadeDrawBitmap(canvas, args[2], 0, 0, args[4]); //C#のとき、xとyに1,1を与えないとずれる。それ以外の言語なら0,0でいい。
					});
				});
			});
		}
	}
}

//円弧エフェクト設定
MaimaiHoldHeadNote.prototype.moveArc = function() {
	if (this.arcVisible) { 
		//TODO ノートを動かすのと一緒の下準備
		var guideSpeedMove = this.getGuideSpeed() * 0.75;
		
		//フットを動かす
		//円の中心から描画開始位置までの距離
		var drawStartX = this.notesDrawStartPointToCenterDistance();
		//移動開始時間
		var footMoveStartTime = this.relativeNote.getJustTime() + this.getGameStartTime() - guideSpeedMove;
		//開始時間から終了時間の間のどれくらいの時間にいるかを求める（割合）
		var footMoveTimeParcent = (this.getJudgeTimer().getGameTime() - footMoveStartTime) / guideSpeedMove;
		//フットを動かす時間になっていないなら、最初の位置のまま動かないでいる。
		if (footMoveTimeParcent < 0) footMoveTimeParcent = 0;
		//円の中心から描画開始位置までの距離
		var moveStartPlace = drawStartX;
		
		//ヘッドを動かす
		//移動開始時間
		var headMoveStartTime = this.getJustTime() + this.getGameStartTime() - guideSpeedMove;
		//開始時間から終了時間の間のどれくらいの時間にいるかを求める（割合）
		var headMoveTimeParcent = (this.getJudgeTimer().getGameTime() - headMoveStartTime) / guideSpeedMove;
		//ヘッドを動かす時間になっていないなら、最初の位置のまま動かないでいる。
		if (headMoveTimeParcent < 0) headMoveTimeParcent = 0;
		//ホールドヘッドのとき、ヘッドが目標値まで動き切って、フットがまだ目標値まで動き切ってなければヘッドを目標値で止める。
		if (headMoveTimeParcent > 1) {
			if (footMoveTimeParcent < 1)
				headMoveTimeParcent = 1;
			//テールが目標値まで動き切ったら、マーカーの元の形(円)になるようにする。
			else
				headMoveTimeParcent = footMoveTimeParcent;
		}
		
		//時間が130%超えたら消す
		if (footMoveTimeParcent > 1.3) 
			this.arcVisible = false;
		
		this.arcRadius = (this.getSensor().getOuterAxis() - moveStartPlace) * headMoveTimeParcent + moveStartPlace;
		
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

MaimaiHoldHeadNote.prototype.release = function() {
	MaimaiTapNote.prototype.release.apply(this);
	this.headImage = null;
	this.footImage = null;
	this.bodyImage = null;
	this.relativeNote = null;
	this.headLocation = null;
	this.footLocation = null;
	this.bodyLocation = null;
	this.effectInstance = null;
}
