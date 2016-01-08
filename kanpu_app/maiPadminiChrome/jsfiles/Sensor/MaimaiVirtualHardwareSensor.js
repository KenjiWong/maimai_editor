//=======================
//  MaimaiVirtualHardwareSensorクラス
//=======================

function MaimaiVirtualHardWareSensor(virtualScreenSize, setting, players, playerNumber) { 
	//設定
	this.setting = setting; 
	//プレイヤー数
	this.players = players;

	//センサーの中心軸
	this.centerAxis = new PointF(virtualScreenSize.width / 2.0, virtualScreenSize.height / 2.0 / players + (virtualScreenSize.height / players * playerNumber));
	//中円センサーの半径
	this.centerRadius = this.getSensorSpaceCenter(); //384 / 2 > getOuterAxis()になる必要あり;
	//内周センサーの半径
	this.innerRadius = this.centerRadius + this.getSensorSpaceInner();
	//外周センサーの半径
	this.outerRadius = this.innerRadius + this.getSensorSpaceOuter();
	
	//円上の点位置半径
	//内周円上の点位置半径の定義
	var clossExLines = CircleCalculator.linesIntersect_st(this.getOuterPieceAxis(0), this.getOuterPieceAxis(3), this.getOuterPieceAxis(6), this.getOuterPieceAxis(2)); //1-4と7-3の交点
	this.sensor_axis_inner = CircleCalculator.pointToPointDistance_st(this.centerAxis, clossExLines); //中心から交点までの距離を内周円上点の半径とする
	
	//センサーを作る
	//センサーピース 0が中円、1～8が内周、9～16が外周、
	this.sensorPieces = [MaimaiVirtualHardWareSensor.NUMBER_OF_CENTER_SENSOR + MaimaiVirtualHardWareSensor.NUMBER_OF_INNER_SENSOR + MaimaiVirtualHardWareSensor.NUMBER_OF_OUTER_SENSOR];
	this.sensorPieces[0] = new MaimaiVirtualHardWareSensorPiece_p(this.getCenterPieceAxis(), SensorSide.CENTER, false);
	var sp;
	for (var i = 0; i < MaimaiVirtualHardWareSensor.NUMBER_OF_INNER_SENSOR; i++) {
		sp = new MaimaiVirtualHardWareSensorPiece_p(this.getInnerPieceAxis(i), SensorSide.INNER, false);
		this.sensorPieces[i + MaimaiVirtualHardWareSensor.NUMBER_OF_CENTER_SENSOR] = sp;
	}
	for (var i = 0; i < MaimaiVirtualHardWareSensor.NUMBER_OF_OUTER_SENSOR; i++) {
		sp = new MaimaiVirtualHardWareSensorPiece_p(this.getOuterPieceAxis(i), SensorSide.OUTER, true);
		this.sensorPieces[i + MaimaiVirtualHardWareSensor.NUMBER_OF_INNER_SENSOR + MaimaiVirtualHardWareSensor.NUMBER_OF_CENTER_SENSOR] = sp;
	}
	sp = null;
	
	
}

//中円センサーの数
MaimaiVirtualHardWareSensor.NUMBER_OF_CENTER_SENSOR = 1;
//内周センサーの数
MaimaiVirtualHardWareSensor.NUMBER_OF_INNER_SENSOR = 8;
//外周センサーの数
MaimaiVirtualHardWareSensor.NUMBER_OF_OUTER_SENSOR = 8;

//周の間隔
MaimaiVirtualHardWareSensor.SENSOR_SPACE_CENTER = 37;
MaimaiVirtualHardWareSensor.SENSOR_SPACE_INNER = 72;
MaimaiVirtualHardWareSensor.SENSOR_SPACE_OUTER = 107;
MaimaiVirtualHardWareSensor.prototype.getSensorSpaceCenter = function() { return ((1.0 / this.players) * MaimaiVirtualHardWareSensor.SENSOR_SPACE_CENTER); }
MaimaiVirtualHardWareSensor.prototype.getSensorSpaceInner = function() { return ((1.0 / this.players) * MaimaiVirtualHardWareSensor.SENSOR_SPACE_INNER); }
MaimaiVirtualHardWareSensor.prototype.getSensorSpaceOuter = function() { return ((1.0 / this.players) * MaimaiVirtualHardWareSensor.SENSOR_SPACE_OUTER); }

//円上の点位置半径
MaimaiVirtualHardWareSensor.SENSOR_AXIS_OUTER = 170;

//旧式：円で判定
//円の大きさ
MaimaiVirtualHardWareSensor.OLD_TYPE_RADIUS = 70.0;
//何かを基準にしてOLD_TYPE_RADIUSを返す。
MaimaiVirtualHardWareSensor.prototype.getOldTypeRadius = function() { return (1.0 / this.players) * MaimaiVirtualHardWareSensor.OLD_TYPE_RADIUS; }

//内周センサーのノート基準値
MaimaiVirtualHardWareSensor.prototype.getInnerAxis = function() {
	return this.sensor_axis_inner;
}

//内周センサーと中円センサーの中心 (内周の中心位置)
MaimaiVirtualHardWareSensor.prototype.getInnerSensorCenterAxis = function() {
	return this.centerRadius + ((this.innerRadius - this.centerRadius) / 2.0);
}

//外周センサーのノート基準値
MaimaiVirtualHardWareSensor.prototype.getOuterAxis = function() {
	return ((1.0 / this.players) * MaimaiVirtualHardWareSensor.SENSOR_AXIS_OUTER);
}

//外周センサーと内周センサーの中心 (外周の中心位置)
MaimaiVirtualHardWareSensor.prototype.getOuterSensorCenterAxis = function() {
	return this.innerRadius + ((this.outerRadius - this.innerRadius) / 2.0);
}

//中円センサーピース位置
MaimaiVirtualHardWareSensor.prototype.getCenterPieceAxis = function() {
	return new PointF(this.centerAxis.x, this.centerAxis.y);
}

//中心からみたセンサーピースの角度 (上が0度)
MaimaiVirtualHardWareSensor.prototype.getPieceDegree = function(button, numberOfSensor) {
	return (360.0 / numberOfSensor) * button + (360.0 / numberOfSensor / 2.0);
}

//内周センサーピース位置
MaimaiVirtualHardWareSensor.prototype.getInnerPieceAxis = function(button) {
	return CircleCalculator.pointOnCircle_prd(this.centerAxis, this.getInnerAxis(), this.getPieceDegree(button, MaimaiVirtualHardWareSensor.NUMBER_OF_INNER_SENSOR));
}

//外周センサーピース位置
MaimaiVirtualHardWareSensor.prototype.getOuterPieceAxis = function(button) {
	return CircleCalculator.pointOnCircle_prd(this.centerAxis, this.getOuterAxis(), this.getPieceDegree(button, MaimaiVirtualHardWareSensor.NUMBER_OF_OUTER_SENSOR));
}

//中円センサーピースの取得
MaimaiVirtualHardWareSensor.prototype.getCenterSensorPiece = function() {
	return this.sensorPieces[0];
}

//内周センサーピースの取得
MaimaiVirtualHardWareSensor.prototype.getInnerSensorPiece = function(no) {
	while (no < 0) no += MaimaiVirtualHardWareSensor.NUMBER_OF_INNER_SENSOR;
	no %= MaimaiVirtualHardWareSensor.NUMBER_OF_INNER_SENSOR;
	return this.sensorPieces[no + MaimaiVirtualHardWareSensor.NUMBER_OF_CENTER_SENSOR];
}

//外周センサーピースの取得
MaimaiVirtualHardWareSensor.prototype.getOuterSensorPiece = function(no) {
	while (no < 0) no += MaimaiVirtualHardWareSensor.NUMBER_OF_OUTER_SENSOR;
	no %= MaimaiVirtualHardWareSensor.NUMBER_OF_OUTER_SENSOR;
	return this.sensorPieces[no + MaimaiVirtualHardWareSensor.NUMBER_OF_INNER_SENSOR + MaimaiVirtualHardWareSensor.NUMBER_OF_CENTER_SENSOR];
}

MaimaiVirtualHardWareSensor.prototype.getCenterRadius = function() { return this.centerRadius; }
MaimaiVirtualHardWareSensor.prototype.getInnerRadius = function() { return this.innerRadius; }
MaimaiVirtualHardWareSensor.prototype.getOuterRadius = function() { return this.outerRadius; }

MaimaiVirtualHardWareSensor.prototype.draw_inDrawableSensor = function(canvas, color, fade, drawablePiece, drawableSensor, oldtype) {
	canvas.save();
	canvas.globalAlpha = 1;
	var b_pointsize = 4;
	if (drawableSensor) { //オプションで表示切替する。色は全部青で統一とかしたい
		if (!oldtype) {
			this.drawPushing(canvas, fade);
			this.drawInner(canvas, b_pointsize, fade);
			this.drawCenter(canvas, b_pointsize, fade);
			this.drawRanges(canvas, fade);
			this.drawBorder(canvas, fade);
		}
		else {
			this.drawOldType(canvas, fade);
		}
	}
	this.drawOuter(canvas, b_pointsize, color, fade, drawablePiece);
	canvas.restore();
}

MaimaiVirtualHardWareSensor.prototype.draw = function(canvas, color, fade, drawablePiece) { 
	this.draw_inDrawableSensor(canvas, color, fade, drawablePiece, this.setting.isDrawableSensors(), this.setting.isOldTypeSensor());
}

MaimaiVirtualHardWareSensor.prototype.drawOuter = function(canvas, b_pointsize, color, fade, drawablePiece) {
	canvas.save();
	canvas.strokeStyle = (new ColorFromAlphaAndColor(fade, color)).toContextString();
	canvas.lineWidth = 2;
	
	//外周センサー中点位置
	if (drawablePiece) {
		this.drawOuterPiece(canvas, b_pointsize, color, fade);
	}

	//外周
	canvas.beginPath();
				//x, y, radius, startarc, endarc, reverseClockTurn
	canvas.arc(this.centerAxis.x, this.centerAxis.y, this.getOuterAxis(), CircleCalculator.toRadian(0), CircleCalculator.toRadian(360), false);
	canvas.stroke();
	canvas.restore();
}

MaimaiVirtualHardWareSensor.prototype.drawOuterPiece = function(canvas, b_pointsize, color, fade) {
	canvas.save();
	
	//外周センサー中点位置
	canvas.fillStyle = (new ColorFromAlphaAndColor(fade, color)).toContextString();
	for (var i = 0; i < 8; i++) {
		var p = this.getOuterSensorPiece(i);
		canvas.beginPath();
		canvas.arc(p.getX(), p.getY(), b_pointsize, CircleCalculator.toRadian(0), CircleCalculator.toRadian(360), false);
		canvas.fill();
	}
	
	canvas.restore();
}

MaimaiVirtualHardWareSensor.prototype.drawInner = function(canvas, b_pointsize, fade) {
	canvas.save();
	canvas.strokeStyle = (new Color(0, 128, 255, (128.0 * (fade / 255.0)))).toContextString();
	canvas.fillStyle = canvas.strokeStyle;
	canvas.lineWidth = 2;

	//内周センサー中点位置
	for (var i = 0; i < 8; i++) {
		var p = this.getInnerSensorPiece(i);
		canvas.beginPath();
		canvas.arc(p.getX(), p.getY(), b_pointsize, CircleCalculator.toRadian(0), CircleCalculator.toRadian(360), false);
		canvas.fill();
	}

	//内周
	canvas.beginPath();
				//x, y, radius, startarc, endarc, reverseClockTurn
	canvas.arc(this.centerAxis.x, this.centerAxis.y, this.getInnerAxis(), CircleCalculator.toRadian(0), CircleCalculator.toRadian(360), false);
	canvas.stroke();
	
	canvas.restore();
}

MaimaiVirtualHardWareSensor.prototype.drawCenter = function(canvas, b_pointsize, fade) {
	//中点
	canvas.save();
	canvas.fillStyle = (new Color(0, 128, 255, (128.0 * (fade / 255.0)))).toContextString();
	canvas.beginPath();
	canvas.arc(this.centerAxis.x, this.centerAxis.y, b_pointsize, CircleCalculator.toRadian(0), CircleCalculator.toRadian(360), false);
	canvas.fill();
	canvas.restore();
}

MaimaiVirtualHardWareSensor.prototype.drawRanges = function(canvas, fade) {
	canvas.save();
	canvas.strokeStyle = (new Color(0, 128, 255, (128.0 * (fade / 255.0)))).toContextString();
	canvas.lineWidth = 1;
	
	//外周範囲
	canvas.save();
	canvas.beginPath();
	canvas.arc(this.centerAxis.x, this.centerAxis.y, this.outerRadius, CircleCalculator.toRadian(0), CircleCalculator.toRadian(360), false);
	canvas.stroke();
	canvas.restore();
	
	//内周範囲
	canvas.save();
	canvas.beginPath();
	canvas.arc(this.centerAxis.x, this.centerAxis.y, this.innerRadius, CircleCalculator.toRadian(0), CircleCalculator.toRadian(360), false);
	canvas.stroke();
	canvas.restore();
	
	//中円範囲
	canvas.save();
	canvas.beginPath();
	canvas.arc(this.centerAxis.x, this.centerAxis.y, this.centerRadius, CircleCalculator.toRadian(0), CircleCalculator.toRadian(360), false);
	canvas.stroke();
	canvas.restore();
	
	canvas.restore();
}

MaimaiVirtualHardWareSensor.prototype.drawBorder = function(canvas, fade) {
	//センサーの境目
	canvas.save();
	canvas.strokeStyle = (new Color(0, 128, 255, (128.0 * (fade / 255.0)))).toContextString();
	canvas.lineWidth = 1;
	for (var i = 0; i < 8; i++) {
		var start = CircleCalculator.pointOnCircle_prd(this.centerAxis, this.centerRadius, 45.0 * i);
		var end = CircleCalculator.pointOnCircle_prd(this.centerAxis, this.outerRadius, 45.0 * i);
		canvas.beginPath();
		canvas.moveTo(start.x, start.y);
		canvas.lineTo(end.x, end.y);
		canvas.closePath();
		canvas.stroke();
	}
	canvas.restore();
}

MaimaiVirtualHardWareSensor.prototype.drawOldType = function(canvas, fade) {
	//センサーの境目
	canvas.save();
	canvas.strokeStyle = (new Color(0, 128, 255, (128.0 * (fade / 255.0)))).toContextString();
	canvas.lineWidth = 1;

	for (var i = 0; i < this.sensorPieces.length; i++) {
		canvas.beginPath();
		canvas.arc(this.sensorPieces[i].getX(), this.sensorPieces[i].getY(), this.getOldTypeRadius(), CircleCalculator.toRadian(0), CircleCalculator.toRadian(360), false);
		canvas.stroke();
	}
	canvas.restore();
}

MaimaiVirtualHardWareSensor.prototype.drawPushing = function(canvas, fade) { }
MaimaiVirtualHardWareSensor.prototype.check = function() { }
MaimaiVirtualHardWareSensor.prototype.updateButtonPushEffect = function() { }
MaimaiVirtualHardWareSensor.prototype.drawButtonPushEffect = function(canvas) { }



