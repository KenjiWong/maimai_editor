//=======================
//  SceneTitleクラス
//=======================
function SceneTitle(gameManager) {
	this.gManager = gameManager;
	this.wakuImg = ImageItem.getMaimaiBase();
}
SceneTitle.prototype = new GameScene(this.gManager);
SceneTitle.prototype.init = function() {

}
SceneTitle.prototype.disp = function(canvas) {
	canvas.save();
	canvas.fillStyle = (new Color(0, 0, 0, 255)).toContextString();
	canvas.fillRect(0, 0, 384, 512);
	TechnicalDraw.fadeDrawBitmap(canvas, ImageItem.getLogo(), 0, 0, 255);
	this.getManager().getSensor().draw(canvas, new Color(0, 255, 255, 255), 255, this.getManager().getConfig().getPlayer1Setting().isDrawableSensors());
	canvas.drawImage(this.wakuImg, 0, 0);
	canvas.restore();
}
SceneTitle.prototype.step = function() {

}
SceneTitle.prototype.destroy = function() {
	this.wakuImg = null;
}