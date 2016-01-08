//==================
// MaimaiNoteB
//==================
function MaimaiNoteB(NotesInfo, UniqueId, JustTime, MissTime, ActionID, ButtonID) {
	MaimaiNote.call(this, NotesInfo, UniqueId, JustTime, MissTime, ActionID);
	this.buttonID = ButtonID;
}

MaimaiNoteB.prototype = new MaimaiNote(this.notesInfo, this.uniqueId, this.justTime, this.missTime, this.actionID);

MaimaiNote.prototype.getButtonID = function() { return this.buttonID; }
