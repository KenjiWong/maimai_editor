//==================
// SlidePatternFactory
//==================

var Circumference = {
	OUTER: 0,
	INNER: 1,
	CENTER: 2,
};

var SlideVector = {
	STRAIGHT: 0,
	CURVE_CLOCK: 1,
	CURVE_REVERSE_CLOCK: 2,
};

//楽譜生成時に、まずはスライドノートを作って、アクションIDに始点を入れる。
//その次にパターンファクトリのインスタンスを作成して、this.setPatternを呼び出す。そのとき改めて始点と、それと次点を使う。
//例えば#A1^4^7[x:y]で、A1のアクションIDでスライドノートを作った後、パターンファクトリの(略)、this.setPatternでA1とA4を使う。

function SlidePatternFactory(info, parent, uniqueId, iniActId) {
	this.info = info;
	this.parent = parent;
	this.pattern = [];
	this.totalDistance = 0;
	this.errorMessage = "";
	this.initActionId = iniActId;
	this.uniqueId = uniqueId;
}

SlidePatternFactory.UN_USE_PARAM = -1;

SlidePatternFactory.prototype.getErrorMessage = function() { return this.errorMessage; }
SlidePatternFactory.prototype.getPattern = function() { return this.pattern; }

//楽譜生成時に、これに情報を入れてパターンを作っていく。falseが返ってきたら何らかのエラーがあったということ
SlidePatternFactory.prototype.setPattern = function(S, T, start, target, slideVector) {
	while (start < 0) start += 8;
	start %= 8;
	while (target < 0) target += 8;
	target %= 8;
	//全部に言えるけど、カーブだったら再帰する必要がある。現状、1^4を認識しない(1-4と認識している)
	if (S == Circumference.OUTER) {
		if (T == Circumference.OUTER) { 
			//Ax->Ay
			//進み方によって分岐する
			if (slideVector == SlideVector.STRAIGHT) {
				//同じボタンだからエラー
				if (target == (start + 0) % 8) { 
					this.setError(1);
				}
				//隣のボタンなら確定
				else if (target == (start + 1) % 8 || target == (start + 7) % 8 ||
						 target == (start + 2) % 8 || target == (start + 6) % 8) {
					this.addPattern(S, T, start, target, slideVector);
				}
				else if (target == (start + 3) % 8) {
					//再帰 例：A1-A4
					if (this.setPattern(S, Circumference.INNER, start, (start + 1) % 8, slideVector)) { 
						//例：A1-B2
						this.setPattern(Circumference.INNER, T, (start + 1) % 8, target, slideVector); //例：B2-A4
					}
				}
				else if (target == (start + 4) % 8) { 
					//再帰 例：A1-A5
					if (this.setPattern(S, Circumference.INNER, start, start, slideVector)) { 
						//例：A1-B1
						this.setPattern(Circumference.INNER, T, start, target, slideVector); //例：B1-A5
					}
				}
				else if (target == (start + 5) % 8) {
					//再帰 例：A1-A6
					if (this.setPattern(S, Circumference.INNER, start, (start + 7) % 8, slideVector)) { 
						//例：A1-B8
						this.setPattern(Circumference.INNER, T, (start + 7) % 8, target, slideVector); //例：B8-A6
					}
				}
			}
			else { 
				if (slideVector == SlideVector.CURVE_CLOCK) { 
					//進行方向隣なら確定
					if (target == (start + 1) % 8) { 
						this.addPattern(S, T, start, target, slideVector);
					}
					//曲線 時計回り 再帰 例：A1^4
					else if (this.setPattern(S, T, start, (start + 1) % 8, slideVector)) { 
						//例：A1^2
						this.setPattern(S, T, (start + 1) % 8, target, slideVector); //例：A2^4
					}
				}
				else if (slideVector == SlideVector.CURVE_REVERSE_CLOCK) { 
					//進行方向隣なら確定
					if (target == (start + 7) % 8) { 
						this.addPattern(S, T, start, target, slideVector);
					}
					//曲線 反時計回り 再帰 例：A1^6
					else if (this.setPattern(S, T, start, (start + 7) % 8, slideVector)) { 
						//例：A1^8
						this.setPattern(S, T, (start + 7) % 8, target, slideVector); //例：A8^6
					}
				}
			}
		}
		else if (T == Circumference.INNER) { 
			//Ax->By
			//直線でのみ移動可
			if (slideVector == SlideVector.STRAIGHT) { 
				//隣接しているなら直で行ける
				//または通過点が無い場合も直で行く
				if (target == (start + 0) % 8 || target == (start + 1) % 8 || target == (start + 7) % 8 ||
					target == (start + 3) % 8 || target == (start + 5) % 8) { 
					this.addPattern(S, T, start, target, slideVector);
				}
				//通過点がある場合は分岐する
				else if (target == (start + 2) % 8) { 
					//再帰 例：A1-B3
					if (this.setPattern(S, Circumference.INNER, start, (start + 1) % 8, slideVector)) { 
						//例：A1-B2
						this.setPattern(Circumference.INNER, T, (start + 1) % 8, target, slideVector); //例：B2-B3
					}
				}
				else if (target == (start + 4) % 8) { 
					//再帰 例：A1-B5
					if (this.setPattern(S, Circumference.INNER, start, start, slideVector)) { 
						//例：A1-B1
						this.setPattern(Circumference.INNER, T, start, target, slideVector); //例：B1-B5
					}
				}
				else if (target == (start + 6) % 8) { 
					//再帰 例：A1-B7
					if (this.setPattern(S, Circumference.INNER, start, (start + 7) % 8, slideVector)) { 
						//例：A1-B8
						this.setPattern(Circumference.INNER, T, (start + 7) % 8, target, slideVector); //例：B8-B7
					}
				}
			}
			else {
				this.setError(5); //曲線で別周侵入禁止
			}
		}
		else if (T == Circumference.CENTER) { 
			//再帰
			if (slideVector == SlideVector.STRAIGHT) { 
				//例：A1-C
				if (this.setPattern(S, Circumference.INNER, start, start, slideVector)) { 
					//例：A1-B1
					this.setPattern(Circumference.INNER, T, start, SlidePatternFactory.UN_USE_PARAM, slideVector); //例：B1-C
				}
			}
			else { 
				this.setError(5); //曲線で別周侵入禁止
			}
		}
	}
	else if (S == Circumference.INNER) { 
		if (T == Circumference.OUTER) { 
			//Bx->Ay
			//直線でのみ移動可
			if (slideVector == SlideVector.STRAIGHT) { 
				//隣接しているなら直で行ける
				//または通過点が無い場合も直で行く
				if (target == (start + 0) % 8 || target == (start + 1) % 8 || target == (start + 7) % 8 || 
					target == (start + 3) % 8 || target == (start + 5) % 8) { 
					this.addPattern(S, T, start, target, slideVector);
				}
				//通過点がある場合は分岐する
				else if (target == (start + 2) % 8) { 
					//再帰 例：B1-A3
					if (this.setPattern(S, Circumference.INNER, start, (start + 1) % 8, slideVector)) { 
						//例：B1-B2
						this.setPattern(Circumference.INNER, T, (start + 1) % 8, target, slideVector); //例：B2-A3
					}
				}
				else if (target == (start + 4) % 8) { 
					//再帰 例：B1-A5
					if (this.setPattern(S, Circumference.CENTER, start, SlidePatternFactory.UN_USE_PARAM, slideVector)) { 
						//例：B1-C
						this.setPattern(Circumference.CENTER, T, SlidePatternFactory.UN_USE_PARAM, target, slideVector); //例：C-A5
					}
				}
				else if (target == (start + 6) % 8) { 
					//再帰 例：B1-A7
					if (this.setPattern(S, Circumference.INNER, start, (start + 7) % 8, slideVector)) { 
						//例：B1-B8
						this.setPattern(Circumference.INNER, T, (start + 7) % 8, target, slideVector); //例：B8-A7
					}
				}
			}
			else {
				this.setError(5); //曲線で別周侵入禁止
			}
		}
		else if (T == Circumference.INNER) { 
			//Bx->By
			//進み方によって分岐する
			if (slideVector == SlideVector.STRAIGHT) { 
				//同じボタンだからエラー
				if (target == (start + 0) % 8) { 
					this.setError(1); //同じボタン
				}
				if (target == (start + 4) % 8) { 
					//例：B1-B5
					if (this.setPattern(S, Circumference.CENTER, start, SlidePatternFactory.UN_USE_PARAM, slideVector)) { 
						//例：B1-C
						this.setPattern(Circumference.CENTER, T, SlidePatternFactory.UN_USE_PARAM, target, slideVector); //例：C-B5
					}
				}
				else {
					this.addPattern(S, T, start, target, slideVector);
				}
			}
			else {
				if (slideVector == SlideVector.CURVE_CLOCK) { 
					//進行方向隣なら確定
					if (target == (start + 1) % 8) { 
						this.addPattern(S, T, start, target, slideVector);
					}
					//曲線 時計回り 再帰 例：A1^4
					else if (this.setPattern(S, T, start, (start + 1) % 8, slideVector)) { 
						//例：B1^2
						this.setPattern(S, T, (start + 1) % 8, target, slideVector); //例：B2^4
					}
				}
				else if (slideVector == SlideVector.CURVE_REVERSE_CLOCK) { 
					//進行方向隣なら確定
					if (target == (start + 7) % 8) { 
						this.addPattern(S, T, start, target, slideVector);
					}
					//曲線 反時計回り 再帰 例：A1^6
					else if (this.setPattern(S, T, start, (start + 7) % 8, slideVector)) { 
						//例：B1^8
						this.setPattern(S, T, (start + 7) % 8, target, slideVector); //例：B8^6
					}
				}
			}
		}
		else if (T == Circumference.CENTER) { 
			//Bx->C
			if (slideVector == SlideVector.STRAIGHT) { 
				//Bx->C
				this.addPattern(S, T, start, SlidePatternFactory.UN_USE_PARAM, slideVector);
			}
			else {
				this.setError(5); //曲線で別周侵入禁止
			}
		}
	}
	else if (S == Circumference.CENTER) { 
		if (T == Circumference.OUTER) { 
			//再帰
			if (slideVector == SlideVector.STRAIGHT) { 
				//例：C-A5
				if (this.setPattern(S, Circumference.INNER, SlidePatternFactory.UN_USE_PARAM, target, slideVector)) { 
					//例：C-B5
					this.setPattern(Circumference.INNER, T, target, target, slideVector); //例：B5-A5
				}
			}
			else { 
				this.setError(5); //曲線で別周侵入禁止
			}
		}
		else if (T == Circumference.INNER) { 
			if (slideVector == SlideVector.STRAIGHT) { 
				//C ->By
				this.addPattern(S, T, SlidePatternFactory.UN_USE_PARAM, target, slideVector);
			}
			else { 
				this.setError(5); //曲線で別周侵入禁止
			}
		}
		else if (T == Circumference.CENTER) { 
			this.setError(1); //同じボタン
		}
	}
	return !this.checkError();
}

SlidePatternFactory.prototype.addPattern = function(S, T, start, target, vec) {
	if (vec == SlideVector.STRAIGHT) { 
		this.addStraightPattern(S, T, start, target);
	}
	else if (S != Circumference.CENTER && S == T) { 
		this.addCurvePattern(S, start, target, vec);
	}
	else {
		this.setError(5); //曲線で別周侵入禁止
	}
}

SlidePatternFactory.prototype.addStraightPattern = function(S, T, start, target) {
	//初回ならstartの値を確認。
	if (this.pattern.length == 0) { 
		if (S == Circumference.INNER || S == Circumference.CENTER) { 
			this.setError(3); //スライドはAから始める
		}
	}
	
	var start_p = new PointF(); //Sのstartのセンサー位置
	var target_p = new PointF(); //Tのtargetのセンサー位置
	var distance = 0; //SのstartからTのtargetまでの距離
	var stotdeg = 0; //start_pからtarget_pを見た方向(degree);
	var bunkatsu = 1; //スライドを何分割するか (互換、分割することがないなら常に1でいい)
	var go_p = new PointF(); //stotdegの角度で、distance / bunkatsu * 0した距離を進んだ位置; 増える
	var to_p = new PointF(); //stotdegの角度で、distance / bunkatsu * 1した距離を進んだ位置; 増える
	
	if (S == Circumference.OUTER) start_p = this.info.getSensor().getOuterSensorPiece(start).getLocation();
	else if (S == Circumference.INNER) start_p = this.info.getSensor().getInnerSensorPiece(start).getLocation();
	else if (S == Circumference.CENTER) start_p = this.info.getSensor().getCenterSensorPiece().getLocation();
	if (T == Circumference.OUTER) target_p = this.info.getSensor().getOuterSensorPiece(target).getLocation();
	else if (T == Circumference.INNER) target_p = this.info.getSensor().getInnerSensorPiece(target).getLocation();
	else if (T == Circumference.CENTER) target_p = this.info.getSensor().getCenterSensorPiece().getLocation();
	distance = CircleCalculator.pointToPointDistance_st(start_p, target_p);
	stotdeg = CircleCalculator.pointToDegree_st(start_p, target_p);
	
	go_p = CircleCalculator.pointToPointMovePoint(start_p, target_p, distance / bunkatsu * 0.0);
	to_p = CircleCalculator.pointToPointMovePoint(start_p, target_p, distance / bunkatsu * 1.0);
	this.pattern.push(new MaimaiSlideStraightPatternNote(this.parent, this.info, this.uniqueId, this.calcActionId(T, target), go_p, to_p, stotdeg, this.totalDistance));
	this.uniqueId++;
	this.totalDistance += Math.abs(distance / bunkatsu);
}

SlidePatternFactory.prototype.addCurvePattern = function(c, start, target, vec) {
	//初回ならstartの値を確認。
	if (this.pattern.length == 0) { 
		if (c == Circumference.INNER || c == Circumference.CENTER) { 
			this.setError(3); //スライドはAから始める
		}
	}
	
	var distance; //SのstartからTのtargetまでの距離
	var radius = c == Circumference.OUTER ? this.info.getSensor().getOuterAxis() :
				   c == Circumference.INNER ? this.info.getSensor().getInnerAxis() :
				   0;
	
	//曲線
	if (vec == SlideVector.CURVE_CLOCK) {
		distance = CircleCalculator.arcDistance(radius, 45.0);
		this.pattern.push(new MaimaiSlideCurvePatternNote(this.parent, this.info, this.uniqueId, this.calcActionId(c, target), this.info.getSensor().getPieceDegree(start, 8), distance, c == Circumference.OUTER, 1, this.totalDistance));
		this.uniqueId++;
		this.totalDistance += Math.abs(distance);
	}
	else {
		distance = CircleCalculator.arcDistance(radius, 45.0);
		this.pattern.push(new MaimaiSlideCurvePatternNote(this.parent, this.info, this.uniqueId, this.calcActionId(c, target), this.info.getSensor().getPieceDegree(start, 8), distance, c == Circumference.OUTER, -1, this.totalDistance));
		this.uniqueId++;
		this.totalDistance += Math.abs(distance);
	}
}

SlidePatternFactory.prototype.setError = function(index) {
	switch (index) {
		case 1: this.errorMessage = "連続して同じセンサー番号は許可されていません。"; break;
		case 2: this.errorMessage = "曲線スライドで対角線上のセンサーは、方向を求めることができないため禁止です。"; break; //未使用
		case 3: this.errorMessage = "スライドは必ずAのセンサーから始めてください。"; break;
		case 4: this.errorMessage = "プログラムエラーです。アプリ開発者に問い合わせてください。"; break; //真ん中に1ボタンだけがあるわけではないらしい
		case 5: this.errorMessage = "曲線スライドで別の周に進むことはできません。"; break;
		default: this.errorMessage = ""; break;
	}
}

SlidePatternFactory.prototype.checkError = function() { 
	return !this.errorMessage == "";
}

SlidePatternFactory.prototype.calcActionId = function(circ, button) { 
	//アクションIDは、0x10 + センサー番号。中円は0、内周は1～8、外周は9～16
	var cic = circ == Circumference.CENTER ? 0 : circ == Circumference.INNER ? 1 : 9;
	if (circ == Circumference.CENTER) button = 0;
	return this.initActionId + 0x10 + cic + button;
}

SlidePatternFactory.prototype.release = function() {
	this.pattern = null;
	this.info = null;
	this.parent = null;
}


