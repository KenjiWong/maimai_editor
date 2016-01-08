//==================
// MaimaiBreakNote
//==================
function MaimaiBreakNote(NotesInfo, UniqueId, JustTime, MissTime, ActionID, ButtonID) {
	MaimaiTapNote.apply(this, arguments);
	this.image = ImageItem.getCircleBreak();
}

MaimaiBreakNote.prototype = new MaimaiTapNote(this.notesInfo, this.uniqueId, this.justTime, this.missTime, this.actionID, this.buttonID);

MaimaiBreakNote.prototype.getNoteType = function() { return NoteType.BREAK; }

MaimaiBreakNote.prototype.checkSync = function() {
	var ret = false;
	if (this.getSyncEvaluate() == SyncEvaluate.FASTGOOD) {
		if (this.getSyncNote().getSyncEvaluate() == SyncEvaluate.FASTGOOD) {
			ret = true;
		}
	}
	else if (this.getSyncEvaluate() == SyncEvaluate.FASTGREAT) {
		if (this.getSyncNote().getSyncEvaluate() == SyncEvaluate.FASTGREAT) {
			ret = true;
		}
	}
	else if (this.getSyncEvaluate() == SyncEvaluate.PERFECT) {
		if (this.getSyncNote().getSyncEvaluate() == SyncEvaluate.PERFECT) {
			ret = true;
		}
	}
	else if (this.getSyncEvaluate() == SyncEvaluate.LATEGREAT) {
		if (this.getSyncNote().getSyncEvaluate() == SyncEvaluate.LATEGREAT) {
			ret = true;
		}
	}
	else if (this.getSyncEvaluate() == SyncEvaluate.LATEGOOD) {
		if (this.getSyncNote().getSyncEvaluate() == SyncEvaluate.LATEGOOD) {
			ret = true;
		}
	}
	this.setSyncEvaluated(true);
	this.getSyncNote().setSyncEvaluated(true);
	return ret;
}

//イーチノート後入れ関連
MaimaiBreakNote.prototype.setEach = function(note) {
	if (this.eachNote == null) {
		this.eachNote = note;
		return true;
	}
	return false;
}