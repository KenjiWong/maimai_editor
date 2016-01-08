//==================
// MaimaiHoldFootNote
//==================
function MaimaiHoldFootNote(NotesInfo, UniqueId, JustTime, MissTime, ActionID, RelativeNote) {
	MaimaiNote.call(this, NotesInfo, UniqueId, JustTime, MissTime, ActionID);
	this.setRelativeNotes(RelativeNote);
}

MaimaiHoldFootNote.prototype = new MaimaiNote(this.notesInfo, this.uniqueId, this.justTime, this.missTime, this.actionID);

MaimaiHoldFootNote.prototype.getNoteType = function() { return NoteType.HOLDFOOT; }

MaimaiHoldFootNote.prototype.getRelativeNote = function() { return this.relativeNote; }

//リレーティブノート後入れ関連
MaimaiHoldFootNote.prototype.setRelativeNote1 = function(RelativeNote) { this.relativeNote = RelativeNote; }
MaimaiHoldFootNote.prototype.setRelativeNote2 = function() { if (this.relativeNote != null) this.relativeNote.setRelativeNote1(this); }
MaimaiHoldFootNote.prototype.setRelativeNotes = function(RelativeNote) { this.setRelativeNote1(RelativeNote); this.setRelativeNote2(); }

MaimaiHoldFootNote.prototype.getButtonID = function() {
	if (this.relativeNote != null) return this.getRelativeNote().getButtonID();
	return -1;
}

MaimaiHoldFootNote.prototype.moveNote = function() {
	//ホールドフットでは描画しないのでフラグを立てとく。(ホールドヘッドに任せてる)
	this.visible = false;
}

MaimaiHoldFootNote.prototype.drawNote = function(canvas) {
	//ホールドフットは特に何もしない。(ホールドヘッドに任せてる)
}

MaimaiHoldFootNote.prototype.release = function() {
	MaimaiNote.prototype.release.apply(this);
	this.relativeNote = null;
}

