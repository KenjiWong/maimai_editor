//==================
// TechnicalDraw
//==================
function TechnicalDraw() {
}

//======================================
// 【使用上の注意】
// ・Runnableを利用して描画処理を書く際、x,y指定は相対位置で指定すること
//   (基本的には0,0でいい。相対位置であることを意識する必要があるのはclipDrawで使用するrun内部)
//======================================

//画像を回転させて描画する
//canvas : Graphicsインスタンス
//image : 描画する画像
//cx : 回転の中心軸にしたい描画先BitmapのX
//cy : 回転の中心軸にしたい描画先BitmapのY
//degree : 角度
//paint : Paintインスタンス
TechnicalDraw.rotateDrawBitmap_xy = function(canvas, image, cx, cy, degree, fadePercent) {
	var hw = image.width;
	var hh = image.height;
	var r = hw > hh ? hw : hh;
	hw /= 2;
	hh /= 2;
	r /= 2;
	TechnicalDraw.rotateDrawBitmap_xyr(canvas, image, cx, cy, r, degree + 90, fadePercent);
}
TechnicalDraw.rotateDrawBitmap_p = function(canvas, image, cp, degree, fadePercent) {
	TechnicalDraw.rotateDrawBitmap_xy(canvas, image, cp.x, cp.y, degree, fadePercent);
}


//画像を回転させて描画する 半径指定 (直接はあまり使わない)
//canvas : Graphicsインスタンス
//image : 描画する画像
//cx : 回転の中心軸にしたい描画先BitmapのX
//cy : 回転の中心軸にしたい描画先BitmapのY
//radius : 半径
//degree : 角度
//paint : Paintインスタンス
TechnicalDraw.rotateDrawBitmap_xyr = function(canvas, image, cx, cy, radius, degree, fadePercent) {
	TechnicalDraw.rotateDraw_xy(canvas, cx, cy, radius, degree, function() { TechnicalDraw.fadeDrawBitmap(canvas, image, 0, 0, fadePercent); });
}
TechnicalDraw.rotateDrawBitmap_pr = function(canvas, image, cp, radius, degree, fadePercent) {
	TechnicalDraw.rotateDrawBitmap_xyr(canvas, image, cp.x, cp.y, radius, degree, fadePercent);
}

//透過して描画
TechnicalDraw.fadeDrawBitmap = function(canvas, image, cx, cy, alphaPercent) {
	canvas.save();
	canvas.globalAlpha = alphaPercent;
	canvas.drawImage(image, cx, cy);
	canvas.restore();
}

//回転させて描画する
//canvas : Graphicsインスタンス
//cx : 回転の中心軸にしたい描画先BitmapのX
//cy : 回転の中心軸にしたい描画先BitmapのY
//radius : 半径
//degree : 角度
//drawMethod : run()内部に実際の描画処理を書く
TechnicalDraw.rotateDraw_xy = function(canvas, cx, cy, radius, degree, drawMethod) {
	//状態を保存
	canvas.save();
	//※処理とは逆順に書かなアカンらしで
	//描画場所移動
	canvas.translate(cx, cy);
	//回転。↑
	canvas.rotate(CircleCalculator.toRadian(degree));
	//回転の中心位置を左上に持ってきて、↑
	canvas.translate(-radius, -radius);
	//描画 (キャンバスの左上に書く。最終的な描画位置はtranslateしたときに指定済みだから絶対に(0, 0))
	drawMethod();
	//状態を元に戻す
	canvas.restore();
}
TechnicalDraw.rotateDraw_p = function(canvas, cp, radius, degree, drawMethod) {
	TechnicalDraw.rotateDraw_xy(canvas, cp.x, cp.y, radius, degree, drawMethod);
}

//描画範囲を指定して、それの左上を原点とし、はみ出さずに描画する。
//canvas : Graphicsインスタンス
//drawX : 描画先BitmapのX
//drawY : 描画先BitmapのY
//clipWidth : 範囲指定横幅
//clipHeight : 範囲指定縦幅
//drawMethod : run()内部に実際の描画処理を書く
TechnicalDraw.clipDraw_xy = function(canvas, drawX, drawY, clipWidth, clipHegiht, drawMethod) {
	canvas.save();
	canvas.translate(drawX, drawY);
	canvas.beginPath();
	canvas.rect(0, 0, clipWidth, clipHegiht);
	canvas.clip();
	drawMethod();
	canvas.restore();
}
TechnicalDraw.clipDraw_p = function(canvas, drawPoint, clipWidth, clipHegiht, drawMethod) {
	TechnicalDraw.clipDraw(canvas, drawPoint.x, drawPoint.y, clipWidth, clipHegiht, drawMethod);
}

//拡大または縮小して描画する
//canvas : Graphicsインスタンス
//drawX : 描画先BitmapのX
//drawY : 描画先BitmapのY
//scaleX : 範囲指定横幅
//scaleY : 範囲指定縦幅
//drawMethod : run()内部に実際の描画処理を書く
TechnicalDraw.scaleDraw_xy = function(canvas, drawX, drawY, scaleX, scaleY, drawMethod) {
	canvas.save();
	canvas.translate(drawX, drawY);
	canvas.scale(scaleX, scaleY);
	drawMethod();
	canvas.restore();
}
TechnicalDraw.scaleDraw_pxy = function(canvas, drawPoint, scaleX, scaleY, drawMethod) {
	TechnicalDraw.scaleDraw_xy(canvas, drawPoint.x, drawPoint.y, scaleX, scaleY, drawMethod);
}
TechnicalDraw.scaleDraw_ps = function(canvas, drawPoint, scale, drawMethod) {
	TechnicalDraw.scaleDraw_xy(canvas, drawPoint.x, drawPoint.y, scale, scale, drawMethod);
}
TechnicalDraw.scaleDraw_xys = function(canvas, drawX, drawY, scale, drawMethod) {
	TechnicalDraw.scaleDraw_xy(canvas, drawX, drawY, scale, scale, drawMethod);
}

TechnicalDraw.flipDraw_base = function(canvas, drawX, drawY, horizontal, vertical, drawMethod) {
	canvas.save();
	canvas.translate(drawX, drawY);
	canvas.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
	drawMethod();
	canvas.restore();
}
//左右反転
TechnicalDraw.flipHorizontalDraw_xy = function(canvas, drawX, drawY, drawMethod) {
	TechnicalDraw.flipDraw_base(canvas, drawX, drawY, true, false, drawMethod);
}
TechnicalDraw.flipHorizontalDraw_p = function(canvas, drawPoint, drawMethod) {
	TechnicalDraw.flipHorizontalDraw_xy(canvas, drawPoint.x, drawPoint.y, drawMethod);
}
//上下反転
TechnicalDraw.flipVerticalDraw_xy = function(canvas, drawX, drawY, drawMethod) {
	TechnicalDraw.flipDraw_base(canvas, drawX, drawY, false, true, drawMethod);
}
TechnicalDraw.flipVerticalDraw_p = function(canvas, drawPoint, drawMethod) {
	TechnicalDraw.flipVerticalDraw_xy(canvas, drawPoint.x, drawPoint.y, drawMethod);
}
//上下左右反転
TechnicalDraw.flipDualDraw_xy = function(canvas, drawX, drawY, drawMethod) {
	TechnicalDraw.flipDraw_base(canvas, drawX, drawY, true, true, drawMethod);
}
TechnicalDraw.flipDualDraw_p = function(canvas, drawPoint, drawMethod) {
	TechnicalDraw.flipDualDraw_xy(canvas, drawPoint.x, drawPoint.y, drawMethod);
}

//drawableSizeポイントでdrawableStringを描きたいが、sampleSizeポイントでsampleStringが描ける範囲しかないとき、drawableStringは何ポイントで描けばいいのか。
TechnicalDraw.calcDrawableStringFontSize_arg2 = function(canvas, drawableSize, drawableString, sampleSize, sampleString) {
	var fontname = "px 'ＭＳゴシック'";
	var font1;
	var font2 = sampleSize + fontname;
	var s = drawableString;
	var camps = sampleString;
	
	var font1measuretxt;
	var font2measuretxt;
	
	canvas.save();
	
	var charsize = drawableSize;
	do
	{
		font1 = charsize + fontname;
		charsize -= 0.1;
		canvas.font = font1;
		font1measuretxt = canvas.measureText(s);
		canvas.font = font2;
		font2measuretxt = canvas.measureText(s);
	} while (font1measuretxt.width >= font2measuretxt.width && charsize >= 1.0);
	
	canvas.restore();
	
	return charsize;
}
//sampleSizeポイントでdrawableStringを描きたいが、sampleSizeポイントでsampleStringが描ける範囲しかないとき、drawableStringは何ポイントで描けばいいのか。
TechnicalDraw.calcDrawableStringFontSize_arg1 = function(canvas, drawableString, sampleSize, sampleString) {
	return TechnicalDraw.calcDrawableStringFontSize_arg2(canvas, sampleSize, drawableString, sampleSize, sampleString);
}

