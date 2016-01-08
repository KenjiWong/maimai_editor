//==================
// MaimaiJudgeEvaluateSlidePattern
//==================

function MaimaiJudgeEvaluateSlidePattern(Manager, JudgeEvaluateSlide) { 
	MaimaiJudgeEvaluate.call(this, Manager);
	this.maimaiJudgeEvaluateSlide = JudgeEvaluateSlide; //スライドパターンで判定して、情報はスライドが持つ。
}

MaimaiJudgeEvaluateSlidePattern.prototype = new MaimaiJudgeEvaluate(this.manager);

MaimaiJudgeEvaluateSlidePattern.prototype.getMaimaiJudgeEvaluateSlide = function() { return this.maimaiJudgeEvaluateSlide; }

//評価していい時間になっているか。
MaimaiJudgeEvaluateSlidePattern.prototype.isEvaluateStartTime = function(timing, spNote) {
	//スライドのFastGOOD判定は☆の早GOOD判定から有効 というかスライドのなぞる部分も早GOODから。
	return timing >= (spNote.getParent().getRelativeNote().getJustTime() - this.getMaimaiJudgeEvaluateSlide().getInLateGoodTime() - spNote.getParent().getJustTime());
}

MaimaiJudgeEvaluateSlidePattern.prototype.evaluate = function(timing, note) {
	var spNote = note;
	//スライドのFastGOOD判定は☆の早GOOD判定から有効 というかスライドのなぞる部分も早GOODから。
	if (this.isEvaluateStartTime(timing, spNote)) {
		//次に押すべきパターンが、来たノートだったら、
		if (spNote.getParent().getNextPattern() == note) {
			//次に押すべきパターンを次のノートにするが、もし来たノートが最後のノートなら、
			if (spNote.getParent().preNextSensor() == null) {
				//判定する
				if (timing < -this.getMaimaiJudgeEvaluateSlide().getInEarlyGreatTime()) {
					this.getMaimaiJudgeEvaluateSlide().fastGoodCallBack(note);
				}
				else if (timing >= -this.getMaimaiJudgeEvaluateSlide().getInEarlyGreatTime() && timing < -this.getMaimaiJudgeEvaluateSlide().getInPerfectTime())
				{
					this.getMaimaiJudgeEvaluateSlide().fastGreatCallBack(note);
				}
				else if (timing >= -this.getMaimaiJudgeEvaluateSlide().getInPerfectTime() && timing <= this.getMaimaiJudgeEvaluateSlide().getInPerfectTime()) {
					this.getMaimaiJudgeEvaluateSlide().perfectCallBack(note);
				}
				else if (timing > this.getMaimaiJudgeEvaluateSlide().getInPerfectTime() && timing <= this.getMaimaiJudgeEvaluateSlide().getInLateGreatTime()) {
					this.getMaimaiJudgeEvaluateSlide().lateGreatCallBack(note);
				}
				else if (timing > this.getMaimaiJudgeEvaluateSlide().getInLateGreatTime() && timing <= this.getMaimaiJudgeEvaluateSlide().getInLateGoodTime()) {
					this.getMaimaiJudgeEvaluateSlide().lateGoodCallBack(note, false);
				}
			}
			else { 
				//最後のノートでないのなら、nextSensor更新リストに入れる
				note.setJudged(true);
				this.getManager().nextSlidePatternUpdateSetAdd(spNote.getParent());
				
				if (note == spNote.getParent().getFirstPattern()) { 
					//最初のスライドパターンノートであればサウンドエフェクトを鳴らす
					this.getManager().SePlay(SEName.SLIDE);
				}
			}
		}
	}
}

MaimaiJudgeEvaluateSlidePattern.prototype.getPerfectCount = function() { return this.getMaimaiJudgeEvaluateSlide().perfect.count; }
MaimaiJudgeEvaluateSlidePattern.prototype.getPerfectScore = function() { return this.getMaimaiJudgeEvaluateSlide().perfect.score(); }
MaimaiJudgeEvaluateSlidePattern.prototype.getGreatCount = function() { return this.getMaimaiJudgeEvaluateSlide().great.count; }
MaimaiJudgeEvaluateSlidePattern.prototype.getGreatScore = function() { return this.getMaimaiJudgeEvaluateSlide().great.score(); }
MaimaiJudgeEvaluateSlidePattern.prototype.getGoodCount = function() { return this.getMaimaiJudgeEvaluateSlide().good.count; }
MaimaiJudgeEvaluateSlidePattern.prototype.getGoodScore = function() { return this.getMaimaiJudgeEvaluateSlide().good.score(); }
MaimaiJudgeEvaluateSlidePattern.prototype.getMissCount = function() { return this.getMaimaiJudgeEvaluateSlide().miss.score(); }


