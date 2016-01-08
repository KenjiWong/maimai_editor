//=======================
//  MaimaiVirtualHardWareSensorPieceクラス
//=======================

var SensorSide = {
	CENTER: 0, 
	INNER: 1, 
	OUTER: 2
};

function MaimaiVirtualHardWareSensorPiece() {
}

MaimaiVirtualHardWareSensorPiece.prototype.getX = function() { return this.location.x; }
MaimaiVirtualHardWareSensorPiece.prototype.getY = function() { return this.location.y; }
MaimaiVirtualHardWareSensorPiece.prototype.getLocation = function() { return new PointF(this.getX(), this.getY()); }
MaimaiVirtualHardWareSensorPiece.prototype.getSide = function() { return this.side; }

function MaimaiVirtualHardWareSensorPiece_xy(_x, _y, _side, _detailCheck) {
	MaimaiVirtualHardWareSensorPiece.call(this);
	this.location = new PointF(_x, _y);
	this.side = _side;
}
MaimaiVirtualHardWareSensorPiece_xy.prototype = new MaimaiVirtualHardWareSensorPiece();

function MaimaiVirtualHardWareSensorPiece_p(_p, _side, _detailCheck) {
	MaimaiVirtualHardWareSensorPiece.call(this);
	this.location = new PointF(_p.x, _p.y);
	this.side = _side;
}
MaimaiVirtualHardWareSensorPiece_p.prototype = new MaimaiVirtualHardWareSensorPiece();

