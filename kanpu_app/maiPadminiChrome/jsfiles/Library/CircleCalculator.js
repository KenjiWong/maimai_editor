//==================
// CircleCalculator
//==================
function CircleCalculator() {
}

//ラジアン角に変換
CircleCalculator.toRadian = function(degree) {
	if (degree == 360) {
		return ((0-90+360)%360 +360) * Math.PI / 180.0; //360を指定したら上0度から1周ってことにしたいので特別処理
	}
	degree -= 90.0;
	while (degree < 0) degree += 360;
	degree %= 360;
	return degree * Math.PI / 180.0;
}
//ディグリー角に変換 (上が0度)
CircleCalculator.toDegree = function(radian) {
	var ret = (radian / (Math.PI / 180.0)) - 90.0;
	while (ret < 0) ret += 360;
	ret %= 360;
	return ret;
}

//原点から見て目標点の角度はいくつか
CircleCalculator.pointToDegree_xy = function(x, y){
	var rad = Math.atan2(y, x);
	var deg = CircleCalculator.toDegree(rad);
	while (deg < 0) deg += 360;
	deg %= 360;
	return deg;
}
CircleCalculator.pointToDegree_p = function(p) { return CircleCalculator.pointToDegree_xy(p.x, p.y); }
CircleCalculator.pointToDegree_st = function(start, target) { return CircleCalculator.pointToDegree_xy(start.x - target.x, start.y - target.y); }

//中心から指定した角度で指定した半径分移動したとき、どこに行くか
CircleCalculator.pointOnCircle_xyrd = function(centerX, centerY, radius, degree) {
	var x = radius * Math.cos(CircleCalculator.toRadian(degree)) + centerX;  // X座標
	var y = radius * Math.sin(CircleCalculator.toRadian(degree)) + centerY;  // Y座標
	return new PointF(x, y);
}
CircleCalculator.pointOnCircle_prd = function(center, radius, degree) { return CircleCalculator.pointOnCircle_xyrd(center.x, center.y, radius, degree); }

//始点から終点まで、distanceだけ移動したときの位置
CircleCalculator.pointToPointMovePoint = function(start, target, distance) { return CircleCalculator.pointOnCircle_prd(start, distance, CircleCalculator.pointToDegree_st(start, target)); }

//始点から終点までの距離
CircleCalculator.pointToPointDistance_xy = function(sx, sy, tx, ty) {
    var x = sx - tx;
    var y = sy - ty;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
CircleCalculator.pointToPointDistance_st = function(start, target) {
    return CircleCalculator.pointToPointDistance_xy(start.x, start.y, target.x, target.y);
}

//円の中心座標、円の半径、円の開始角度、円の角度の大きさ、タッチ座標、タッチの許容範囲、判定しない穴半径
CircleCalculator.arcIntersect_p = function(center, cRadius, startAngle, sweepAngle, touchPoint, tpRadius, holeRadius) {
	return CircleCalculator.arcIntersect_xy(center.x, center.y, cRadius, startAngle, sweepAngle, touchPoint.x, touchPoint.y, tpRadius, holeRadius);
}

CircleCalculator.arcIntersect_xy = function(cx, cy, cr, startAngle, sweepAngle, px, py, pr, hole)
{
	var dx, dy, fAlpha, fBeta, fDelta, ar, fDistSqr, vx1, vy1, vx2, vy2;

	dx = px - cx;
	dy = py - cy;
	fDistSqr = dx * dx + dy * dy;

	var dsqrt = Math.sqrt(fDistSqr); //点pと点cの長さ

	//ドーナツ穴内のタッチは無効。
	//つまり、タッチ円が完全に穴の内部にあったら、タッチされていない。
	if (dsqrt < hole - pr) {
		return false;
	}
	else if (dsqrt < pr) {
		return true;
	}
	else {
		vx1 = Math.cos(CircleCalculator.toRadian(startAngle));
		vy1 = Math.sin(CircleCalculator.toRadian(startAngle));
		vx2 = Math.cos(CircleCalculator.toRadian(startAngle + sweepAngle));
		vy2 = Math.sin(CircleCalculator.toRadian(startAngle + sweepAngle));
		fDelta = vx1 * vy2 - vx2 * vy1;
		fAlpha = (dx * vy2 - dy * vx2) / fDelta;
		fBeta = (-dx * vy1 + dy * vx1) / fDelta;
		if ((fAlpha >= 0.0) && (fBeta >= 0.0)) {
			ar = cr + pr;
			if (fDistSqr <= ar * ar) {
				return true;
			}
		}
		else {
		    //円と線の当たり判定 (扇形なので2本)
		    var ret = lineAndCircleIntersect(px, py, pr, hole * vx1 + cx, hole * vy1 + cy, cr * vx1 + cx, cr * vy1 + cy);
		    if (ret) return true;
		    return lineAndCircleIntersect(px, py, pr, hole * vx2 + cx, hole * vy2 + cy, cr * vx2 + cx, cr * vy2 + cy);
		}
	}
	return false;
}

//円と線の当たり判定
CircleCalculator.lineAndCircleIntersect = function(cx, cy, cr, startX, startY, targetX, targetY) {
	var dx = targetX - startX;
	var dy = targetY - startY;
	if ((dx * (cx - startX) + dy * (cy - startY)) <= 0) {
		//始点を通る、線分に垂直な線を置いたとき、円の中心が線分の範囲外にあったとき
		//「線分の始点から円の中心までの距離の2乗」と「円の半径の二乗」との比較
		return Math.pow(cr, 2) >= Math.pow(cx - startX, 2) + Math.pow(cy - startY, 2);
	}
	else if (((-dx) * (cx - (startX + dx)) + (-dy) * (cy - (startY + dy))) <= 0) {
		//終点を通る、線分に垂直な線を置いたとき、円の中心が線分の範囲外にあったとき
		//「線分の終点から円の中心までの距離の2乗」と「円の半径の二乗」との比較
		return Math.pow(cr, 2) >= Math.pow(cx - (startX + dx), 2) + Math.pow(cy - (startY + dy), 2);
	}
	else {
		//線分の始点終点に垂線を引っ張ったとき、円の中心がその範囲内にあったとき
		var e = Math.sqrt(Math.Pow(dx, 2) + Math.pow(dy, 2)); //これでx,y成分を割れば単ベクトルになる
		var c2 = Math.pow(cx - startX, 2) + Math.pow(cy - startY, 2);
		var b = (cx - startX) * (dx / e) + (cy - startY) * (dy / e); //内責で算出した、隣辺の長さ
		return Math.pow(cr, 2) >= c2 - Math.pow(b, 2);
	}
}

CircleCalculator.circleIntersect = function(AX, AY, AR, BX, BY, BR)
{
	if (((BX - AX) * (BX - AX) + (BY - AY) * (BY - AY)) < ((AR + BR) * (AR + BR)))
		return true; //当たり
	else return false; //ハズレ
}

//線と線の交点
CircleCalculator.linesIntersect_xy = function(sx1, sy1, tx1, ty1, sx2, sy2, tx2, ty2)
{
	var s1 = ((tx2 - sx2) * (sy1 - sy2) - (ty2 - sy2) * (sx1 - sx2)) / 2;
	var s2 = ((tx2 - sx2) * (sy2 - ty1) - (ty2 - sy2) * (sx2 - tx1)) / 2;
	var x = sx1 + (tx1 - sx1) * s1 / (s1 + s2);
	var y = sy1 + (ty1 - sy1) * s1 / (s1 + s2);
	return new PointF(x, y);
}
CircleCalculator.linesIntersect_st = function(start1, target1, start2, target2)
{
	return CircleCalculator.linesIntersect_xy(start1.x, start1.y, target1.x, target1.y, start2.x, start2.y, target2.x, target2.y);
}

//円弧の距離
CircleCalculator.arcDistance = function(radius, degree)
{
	return 2 * Math.PI * radius * (degree / 360.0);
}

//円弧上の距離から角度を求める
CircleCalculator.arcDegreeFromArcDistance = function(radius, distance)
{
	//距離 = 2*PI*radius * deg/360;
	//距離*360 = 2*PI*radius * deg;
	//距離*360/2/PI/radius = deg;
	return distance * 360 / 2 / Math.PI / radius;
}

//円から四角形を求める
/*
CircleCalculator.circleToRect = function(cx, cy, radius)
{
	return new RectangleF(
		cx - radius,
		cy - radius,
		radius * 2,
		radius * 2);
}
*/


