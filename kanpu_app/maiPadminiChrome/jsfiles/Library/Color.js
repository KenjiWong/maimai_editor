//=======================
//  Colorクラス
//=======================

function Color(_r, _g, _b, _a) {
	this.r = _r;
	this.g = _g;
	this.b = _b;
	this.a = _a;
}

Color.prototype.toContextString = function() {
	return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.alphaFrom255To1() + ")";
}

Color.prototype.alphaFrom255To1 = function() {
	var _a = this.a / 255.0;
	if (_a < 0) _a = 0;
	else if (_a > 1) _a = 1;
	return _a;
}

function ColorFromAlphaAndColor(_a, _color) {
	Color.call(this, _color.r, _color.g, _color.b, _a);
}
ColorFromAlphaAndColor.prototype = new Color(this.r, this.g, this.b, this.a);
