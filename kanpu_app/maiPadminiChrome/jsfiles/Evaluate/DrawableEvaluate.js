//==================
// DrawableEvaluate
//==================

var DrawableEvaluateTapType = {
	PERFECT: 0, 
	FASTGREAT: 1, 
	LATEGREAT: 2, 
	FASTGOOD: 3, 
	LATEGOOD: 4, 
	MISS: 5,
};

var DrawableEvaluateSlideType = {
	JUST: 0, 
	FASTGREAT: 1, 
	LATEGREAT: 2, 
	FASTGOOD: 3, 
	LATEGOOD: 4, 
	TOOLATE: 5,
};

var DrawableEvaluateBreakType = {
	P2600: 0, 
	P2550F: 1, 
	P2550L: 2, 
	P2500F: 3, 
	P2500L: 4, 
	P2000F: 5, 
	P2000L: 6, 
	P1500F: 7, 
	P1500L: 8, 
	P1250F: 9, 
	P1250L: 10, 
	P1000F: 11, 
	P1000L: 12, 
	MISS: 13,
};

function DrawableEvaluate(sensor, setting) {
	this.sensor = sensor;
	this.setting = setting;
	this.judgeTapPerfect = ImageItem.getJudgeTapPerfect();
	this.judgeTapGreat = ImageItem.getJudgeTapGreat();
	this.judgeTapGood = ImageItem.getJudgeTapGood();
	this.judgeTapMiss = ImageItem.getJudgeTapMiss();
	this.judgeBreakP2600 = ImageItem.getJudgeBreakP2600();
	this.judgeBreakP2550 = ImageItem.getJudgeBreakP2550();
	this.judgeBreakP2500 = ImageItem.getJudgeBreakP2500();
	this.judgeBreakP2000 = ImageItem.getJudgeBreakP2000();
	this.judgeBreakP1500 = ImageItem.getJudgeBreakP1500();
	this.judgeBreakP1250 = ImageItem.getJudgeBreakP1250();
	this.judgeBreakP1000 = ImageItem.getJudgeBreakP1000();
	this.judgeSlideJust = ImageItem.getJudgeSlideJust();
	this.judgeSlideFastGreat = ImageItem.getJudgeSlideFastGreat();
	this.judgeSlideFastGood = ImageItem.getJudgeSlideFastGood();
	this.judgeSlideLateGreat = ImageItem.getJudgeSlideLateGreat();
	this.judgeSlideLateGood = ImageItem.getJudgeSlideLateGood();
	this.judgeSlideTooLate = ImageItem.getJudgeSlideTooLate();

	this.location = new PointF(-100, -100);
	this.effectLocate = new PointF(-100, -100);
	this.COLOR_PERFECT = new Color(255,255,0,255);
	this.COLOR_GREAT = new Color(255,175,200,255);
	this.COLOR_GOOD = new Color(0,128,0,255);
	this.COLOR_FAST = new Color(0,162,232,255);
	this.COLOR_LATE = new Color(255,0,0,255);
	this.COLOR_BLACK = new Color(0,0,0,255);

	this.timer = new StopWatch();;
	this.started = false;
	this.visible = false;
	this.buttonID = 0;
	this.image = null;
	this.slide = false;
	this.holdheadEffect = false;

	this.effectColor = "";
	this.effectScalePercent = 0;
	this.effectScaleTime = 0.6;
	this.holdheadEffectScaletime = 0.3;

	this.visibleTime = 0.8; //評価の表示時間
	this.scalingTime = 0.15; //はじめに大きくなる時間
	this.fadeoutTime = 0.2; //フェードアウトする時間
	this.scalePercent = 0; //大きくなってる%
	this.fadeoutPercent = 0; //フェードアウト%

	this.slideDeg = 0;
};

DrawableEvaluate.prototype.getSensor = function() { return this.sensor; }
DrawableEvaluate.prototype.getSetting = function() { return this.setting; }

DrawableEvaluate.prototype.start_common = function(ButtonID) {
	this.buttonID = ButtonID;
	this.scalePercent = 0;
	this.fadeoutPercent = 0;
	this.effectScalePercent = 0;
	slideDeg = 0;
	this.visible = true;
	this.timer.stop();
	this.timer.reset();
	this.started = true;
	this.timer.start();
}

DrawableEvaluate.prototype.start_taphold = function(drawableEvaluateType, ButtonID) {
	if (drawableEvaluateType == DrawableEvaluateTapType.PERFECT) {
		this.image = this.judgeTapPerfect; this.effectColor = this.COLOR_PERFECT;
	}
	else if (drawableEvaluateType == DrawableEvaluateTapType.FASTGREAT) {
		this.image = this.judgeTapGreat; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GREAT : this.COLOR_FAST;
	}
	else if (drawableEvaluateType == DrawableEvaluateTapType.LATEGREAT) {
		this.image = this.judgeTapGreat; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GREAT : this.COLOR_LATE;
	}
	else if (drawableEvaluateType == DrawableEvaluateTapType.FASTGOOD) {
		this.image = this.judgeTapGood; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GOOD : this.COLOR_FAST;
	}
	else if (drawableEvaluateType == DrawableEvaluateTapType.LATEGOOD) {
		this.image = this.judgeTapGood; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GOOD : this.COLOR_LATE;
	}
	else if (drawableEvaluateType == DrawableEvaluateTapType.MISS) {
		this.image = this.judgeTapMiss; this.effectColor = this.COLOR_BLACK;
	}
	this.slide = false;
	this.holdheadEffect = false;
	this.start_common(ButtonID);
}

DrawableEvaluate.prototype.start_slide = function(drawableEvaluateType, target, deg) {
	if (drawableEvaluateType == DrawableEvaluateSlideType.JUST) {
		this.image = this.judgeSlideJust;
	}
	else if (drawableEvaluateType == DrawableEvaluateSlideType.FASTGREAT) {
		this.image = this.judgeSlideFastGreat;
	}
	else if (drawableEvaluateType == DrawableEvaluateSlideType.LATEGREAT) {
		this.image = this.judgeSlideLateGreat;
	}
	else if (drawableEvaluateType == DrawableEvaluateSlideType.FASTGOOD) {
		this.image = this.judgeSlideFastGood;
	}
	else if (drawableEvaluateType == DrawableEvaluateSlideType.LATEGOOD) {
		this.image = this.judgeSlideLateGood;
	}
	else if (drawableEvaluateType == DrawableEvaluateSlideType.TOOLATE) {
		this.image = this.judgeSlideTooLate;
	}
	this.slide = true;
	this.holdheadEffect = false;
	this.start_common(0);
	this.location = new PointF(target.x, target.y);
	this.slideDeg = deg;
	this.effectColor = this.COLOR_BLACK;
}

DrawableEvaluate.prototype.start_break = function(drawableEvaluateType, ButtonID) {
	if (drawableEvaluateType == DrawableEvaluateBreakType.P2600) {
		this.image = this.judgeBreakP2600; this.effectColor = this.COLOR_PERFECT;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.P2550F) {
		this.image = this.judgeBreakP2550; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_PERFECT : this.COLOR_FAST;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.P2500F) {
		this.image = this.judgeBreakP2500; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_PERFECT : this.COLOR_FAST;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.P2000F) {
		this.image = this.judgeBreakP2000; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GREAT : this.COLOR_FAST;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.P1500F) {
		this.image = this.judgeBreakP1500; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GREAT : this.COLOR_FAST; ;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.P1250F) {
		this.image = this.judgeBreakP1250; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GREAT : this.COLOR_FAST; ;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.P1000F) {
		this.image = this.judgeBreakP1000; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GOOD : this.COLOR_FAST; ;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.P2550L) {
		this.image = this.judgeBreakP2550; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_PERFECT : this.COLOR_LATE;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.P2500L) {
		this.image = this.judgeBreakP2500; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_PERFECT : this.COLOR_LATE;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.P2000L) {
		this.image = this.judgeBreakP2000; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GREAT : this.COLOR_LATE;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.P1500L) {
		this.image = this.judgeBreakP1500; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GREAT : this.COLOR_LATE;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.P1250L) {
		this.image = this.judgeBreakP1250; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GREAT : this.COLOR_LATE;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.P1000L) {
		this.image = this.judgeBreakP1000; this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GOOD : this.COLOR_LATE;
	}
	else if (drawableEvaluateType == DrawableEvaluateBreakType.MISS) {
		this.image = this.judgeTapMiss; this.effectColor = this.COLOR_BLACK;
	}
	this.slide = false;
	this.holdheadEffect = false;
	this.start_common(ButtonID);
}

DrawableEvaluate.prototype.pause = function() { //ポーズ中、タイマーだけ止める
	if (this.started && this.timer.isRunning()) {
		this.timer.stop();
	}
}

DrawableEvaluate.prototype.resume = function() { //ポーズ解除したら、タイマーだけスタートする
	if (this.started && !this.timer.isRunning()) {
		this.timer.start();
	}
}

//ボタンを離す、または押しっぱなしGOODがでたらエフェクトの描画を終了したいので、フラグを立てられるようにする
DrawableEvaluate.prototype.setVisible = function(flag) {
	this.visible = flag;
}

DrawableEvaluate.prototype.holdHeadEffectStart = function(drawableEvaluateType, ButtonID) {
	if (drawableEvaluateType == DrawableEvaluateTapType.PERFECT) {
		this.effectColor = this.COLOR_PERFECT;
	}
	else if (drawableEvaluateType == DrawableEvaluateTapType.FASTGREAT) {
		this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GREAT : this.COLOR_FAST;
	}
	else if (drawableEvaluateType == DrawableEvaluateTapType.LATEGREAT) {
		this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GREAT : this.COLOR_LATE;
	}
	else if (drawableEvaluateType == DrawableEvaluateTapType.FASTGOOD) {
		this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GOOD : this.COLOR_FAST;
	}
	else if (drawableEvaluateType == DrawableEvaluateTapType.LATEGOOD) {
		this.effectColor = !this.getSetting().isShowTapFastSlow() ? this.COLOR_GOOD : this.COLOR_LATE;
	}
	this.slide = false;
	this.holdheadEffect = true;
	this.start_common(ButtonID);
}

DrawableEvaluate.prototype.update = function() {
	var now = this.timer.now();
	if (!this.holdheadEffect) {
		if (now > this.visibleTime) { //とりあえず表示時間1秒で。
			this.visible = false;
			this.timer.stop();
			this.timer.reset();
			this.started = false;
		}
		else if (this.timer.isRunning()) {
			this.visible = true;
			if (!this.slide) {
				//ボタン番号から角度を求める
				var deg = this.getSensor().getPieceDegree(this.buttonID, MaimaiVirtualHardWareSensor.NUMBER_OF_OUTER_SENSOR);
				var rad = CircleCalculator.toRadian(deg);
				var radiusChosetsu = -50;
				//判定画像の中心x,y
				var cx = (this.getSensor().getOuterAxis() + radiusChosetsu) * Math.cos(rad) + this.getSensor().getCenterSensorPiece().getX();
				var cy = (this.getSensor().getOuterAxis() + radiusChosetsu) * Math.sin(rad) + this.getSensor().getCenterSensorPiece().getY();
				this.location = new PointF(cx, cy);
				//スケールの指定
				this.scalePercent = now / this.scalingTime;
				if (this.scalePercent < 0) this.scalePercent = 0;
				else if (this.scalePercent > 1) this.scalePercent = 1;
				//エフェクト円の中心x,y
				var sp = this.getSensor().getOuterSensorPiece(this.buttonID);
				cx = sp.getX();
				cy = sp.getY();
				this.effectLocate = new PointF(cx, cy);
				//エフェクトのスケールの指定
				this.effectScalePercent = now / this.effectScaleTime;
				if (this.effectScalePercent < 0) this.effectScalePercent = 0;
				else if (this.effectScalePercent > 1) this.effectScalePercent = 1;
			}
			else {
				this.scalePercent = 1;
			}
			
			//フェードアウトの指定
			this.fadeoutPercent = (now - this.visibleTime + this.fadeoutTime) / this.fadeoutTime;
			if (this.fadeoutPercent < 0) this.fadeoutPercent = 0;
			else if (this.fadeoutPercent > 1) this.fadeoutPercent = 1;
		}
		else {
			if (!this.started)
				this.visible = false;
		}
	}
	else { //ホールドエフェクトの計算
		if (this.visible) {
			//エフェクト円の中心x,y
			var sp = this.getSensor().getOuterSensorPiece(this.buttonID);
			var cx = sp.getX();
			var cy = sp.getY();
			this.effectLocate = new PointF(cx, cy);
			//エフェクトのスケールの指定
			this.effectScalePercent = now / this.holdheadEffectScaletime;
			if (this.effectScalePercent < 0) this.effectScalePercent = 0;
			else if (this.effectScalePercent > 1) {
				this.effectScalePercent = 1;
				//次回のnowを0近くに戻して、またエフェクトが大きくなるようにする
				this.timer.stop();
				this.timer.reset();
				this.timer.start();
			}
		}
		else {
			this.timer.stop();
			this.timer.reset();
			this.started = false;
		}
	}
}

DrawableEvaluate.prototype.draw = function(canvas) {
	if (this.visible) {
		if (!this.holdheadEffect) {
			if (this.image != null) {
				if (!this.slide) {
					if (this.effectColor != this.COLOR_BLACK) {
						canvas.save();
						canvas.strokeStyle = (new ColorFromAlphaAndColor(255.0 * (1.0 - this.fadeoutPercent), this.effectColor)).toContextString();
						canvas.lineWidth = 3;
						canvas.beginPath();
						canvas.arc(this.effectLocate.x, this.effectLocate.y, 32 * this.effectScalePercent, CircleCalculator.toRadian(0), CircleCalculator.toRadian(360), false);
						canvas.stroke();
						canvas.restore();
					}
					TechnicalDraw.rotateDrawBitmap_p(canvas, this.image, this.location, this.getSensor().getPieceDegree(this.buttonID, MaimaiVirtualHardWareSensor.NUMBER_OF_OUTER_SENSOR), 1.0 - this.fadeoutPercent);
				}
				else {
					var imgw = this.image.width;
					var imgh = this.image.height;
					//状態を保存
					canvas.save();
					//※処理とは逆順に書かなアカンらしで
					//描画場所移動
					canvas.translate(this.location.x, this.location.y);
					//回転。↑
					canvas.rotate(CircleCalculator.toRadian(this.slideDeg + 90));
					//回転の中心位置を左上に持ってきて、↑
					canvas.translate(-imgw, -imgh / 2);
					//描画 (キャンバスの左上に書く。最終的な描画位置はtranslateしたときに指定済みだから絶対に(0, 0))
					TechnicalDraw.fadeDrawBitmap(canvas, this.image, 0, 0, (1.0 - this.fadeoutPercent));
					//状態を元に戻す
					canvas.restore();
				}
			}
		}
		else { //ホールドエフェクト描画
			if (this.effectColor != this.COLOR_BLACK) {
				canvas.save();
				canvas.strokeStyle = this.effectColor.toContextString();
				canvas.lineWidth = 1;
				canvas.beginPath();
				canvas.arc(this.effectLocate.x, this.effectLocate.y, 48 * this.effectScalePercent, CircleCalculator.toRadian(0), CircleCalculator.toRadian(360), false);
				canvas.stroke();
				canvas.restore();
			}
		}
	}
}

DrawableEvaluate.prototype.drawUpScreenCircle = function(canvas){
	if (this.visible){
		if (!this.holdheadEffect){
			if (this.image != null){
				if (this.effectColor != this.COLOR_BLACK){
					var args = [new ColorFromAlphaAndColor(255.0 * (1.0 - this.fadeoutPercent), this.effectColor), this.effectScalePercent];
					TechnicalDraw.clipDraw_xy(canvas, 2, 2, 380, 60, function(){
						canvas.save();
						canvas.strokeStyle = args[0].toContextString();
						canvas.lineWidth = 1;
						canvas.beginPath();
						canvas.arc(380 / 2, 60 / 2, (380 - 10) * args[1], CircleCalculator.toRadian(0), CircleCalculator.toRadian(360), false);
						canvas.stroke();
						canvas.restore();
					});
				}
			}
		}
	}
}

DrawableEvaluate.prototype.destroy = function() {
	this.judgeTapPerfect = null;
	this.judgeTapGreat = null;
	this.judgeTapGood = null;
	this.judgeTapMiss = null;
	this.judgeBreakP2600 = null;
	this.judgeBreakP2550 = null;
	this.judgeBreakP2500 = null;
	this.judgeBreakP2000 = null;
	this.judgeBreakP1500 = null;
	this.judgeBreakP1250 = null;
	this.judgeBreakP1000 = null;
	this.judgeSlideJust = null;
	this.judgeSlideFastGreat = null;
	this.judgeSlideFastGood = null;
	this.judgeSlideLateGreat = null;
	this.judgeSlideLateGood = null;
	this.judgeSlideTooLate = null;
}

