//=======================
//  BGImageManagerクラス
//=======================

function BGImageManager(_config) {
	this.config = _config;
	this.error = false;
	this.backGroundImage = new Image();
	this.backGroundImage.onerror = this.onError;
	this.backGroundImage.src = "bg.jpg";
}

BGImageManager.prototype.getBackGroundImage = function() {
	return this.backGroundImage;
}

BGImageManager.prototype.isExistsBackGroundImage = function() {
	return this.backGroundImage != null && this.error;
}

BGImageManager.prototype.getBrightness = function() {
	return this.config.getBrightness();
}

BGImageManager.prototype.drawBackGroundImage = function(canvas, fade) {
	if (this.isExistsBackGroundImage()) {
		canvas.save();
		canvas.globalAlpha = (this.getBrightness() + fade) / (255.0 * 2);
		canvas.drawImage(this.backGroundImage, 0, 65, 384, 448-65);
		canvas.restore();
	}
}

BGImageManager.prototype.onError = function() {
	this.error = true;
}
