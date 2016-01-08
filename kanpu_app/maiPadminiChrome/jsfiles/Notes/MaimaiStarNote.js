//==================
// MaimaiStarNote
//==================
function MaimaiStarNote(NotesInfo, UniqueId, JustTime, MissTime, ActionID, ButtonID) {
	MaimaiTapNote.apply(this, arguments);
	this.relativeNote = null;
	this.image = ImageItem.getSlideOnStarSingle();
	this.rotated = 0;  //☆の回転度合
}

MaimaiStarNote.prototype = new MaimaiTapNote(this.notesInfo, this.uniqueId, this.justTime, this.missTime, this.actionID, this.buttonID);

MaimaiStarNote.prototype.getNoteType = function() { return NoteType.STARTAP; }
MaimaiStarNote.prototype.getRelativeNote = function() { return this.relativeNote; }

//リレーティブノート後入れ関連
MaimaiStarNote.prototype.setRelativeNote1 = function(RelativeNote) { this.relativeNote = RelativeNote; }
MaimaiStarNote.prototype.setRelativeNote2 = function() { this.relativeNote.setRelativeNote1(this); }
MaimaiStarNote.prototype.setRelativeNotes = function(RelativeNote) { this.setRelativeNote1(RelativeNote); this.setRelativeNote2(); }

MaimaiStarNote.prototype.getImageDegree = function() { return MaimaiTapNote.prototype.getImageDegree.call(this) + this.rotated; }

MaimaiStarNote.prototype.moveNote = function() { 
	if (this.getStarRotation()) {
		//回転量を求めて加算する
		var rotateTime = 1.0 / this.relativeNote.calcMoveSpeed();
		this.rotated += 360.0 / rotateTime;
	}
	else {
		this.rotated = 0;
	}
	MaimaiTapNote.prototype.moveNote.call(this);
}

MaimaiStarNote.prototype.setEach = function(note) { 
	if (this.eachNote == null) {
		this.eachNote = note;
		this.image = ImageItem.getSlideOnStarEach();
		//イーチノートがスターであれば、そのスライドマーカーを黄色にする。
		if (note.getNoteType() == NoteType.STARTAP) {
			var starNote = note;
			return this.relativeNote.setEach(starNote.relativeNote);
		}
		return true;
	}
	return false;
}

MaimaiStarNote.prototype.release = function() {
	MaimaiTapNote.prototype.release.apply();
	this.relativeNote = null;
}

