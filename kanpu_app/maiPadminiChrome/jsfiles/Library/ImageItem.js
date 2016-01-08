//=======================
//  ImageItemクラス
//=======================

function ImageItem() {
}

ImageItem.REGULAR_SIZE = 32;
ImageItem.NOTE_SIZE = ImageItem.REGULAR_SIZE * 2;
ImageItem.JUDGE_SIZE = ImageItem.REGULAR_SIZE * 2;
ImageItem.SLIDEJUDGE_SIZE = ImageItem.REGULAR_SIZE * 3;
ImageItem.ICON_SIZE = ImageItem.REGULAR_SIZE;
ImageItem.SLIDEMARKER_SIZE = ImageItem.REGULAR_SIZE;

ImageItem.materialBmp = new Image();
ImageItem.maimaiBase = new Image();
ImageItem.maimaiSyncBase = new Image();
ImageItem.logo = new Image();
ImageItem.touchToStart = new Image();
ImageItem.playerIconSimple = new Image();

ImageItem.upIcon = new Image();
ImageItem.downIcon = new Image();
ImageItem.plusIcon = new Image();
ImageItem.minusIcon = new Image();
ImageItem.circleIcon = new Image();
ImageItem.crossIcon = new Image();
ImageItem.optionIcon = new Image();
ImageItem.fingerCursorIcon = new Image();
ImageItem.player1Icon = new Image();
ImageItem.player2Icon = new Image();

ImageItem.circleSingle = new Image();
ImageItem.circleEach = new Image();
ImageItem.circleBreak = new Image();
ImageItem.circleHoldHeadSingle = new Image();
ImageItem.circleHoldFootSingle = new Image();
ImageItem.circleHoldHeadEach = new Image();
ImageItem.circleHoldFootEach = new Image();
ImageItem.angulateHoldHeadSingle = new Image();
ImageItem.angulateHoldFootSingle = new Image();
ImageItem.angulateHoldHeadEach = new Image();
ImageItem.angulateHoldFootEach = new Image();
ImageItem.holdBodySingle = new Image();
ImageItem.holdBodyEach = new Image();
ImageItem.slideOnStarSingle = new Image();
ImageItem.slideOnStarEach = new Image();
ImageItem.slideMarkerSingle = new Image();
ImageItem.slideMarkerEach = new Image();

ImageItem.judgeTapPerfect = new Image();
ImageItem.judgeTapGreat = new Image();
ImageItem.judgeTapGood = new Image();
ImageItem.judgeTapMiss = new Image();
ImageItem.judgeBreakP2600 = new Image();
ImageItem.judgeBreakP2550 = new Image();
ImageItem.judgeBreakP2500 = new Image();
ImageItem.judgeBreakP2000 = new Image();
ImageItem.judgeBreakP1500 = new Image();
ImageItem.judgeBreakP1250 = new Image();
ImageItem.judgeBreakP1000 = new Image();
ImageItem.judgeSlideJust = new Image();
ImageItem.judgeSlideFastGreat = new Image();
ImageItem.judgeSlideFastGood = new Image();
ImageItem.judgeSlideLateGreat = new Image();
ImageItem.judgeSlideLateGood = new Image();
ImageItem.judgeSlideTooLate = new Image();

ImageItem.getMaimaiBase = function() { return ImageItem.maimaiBase; }
ImageItem.getMaimaiSyncBase = function() { return ImageItem.null; }//maimaiSyncBase; }
ImageItem.getLogo = function() { return ImageItem.logo; }
ImageItem.getTouchToStart = function() { return ImageItem.touchToStart; }
ImageItem.getPlayerIconSimple = function() { return ImageItem.playerIconSimple; }

ImageItem.getUpIcon = function() { return ImageItem.upIcon; }
ImageItem.getDownIcon = function() { return ImageItem.downIcon; }
ImageItem.getPlusIcon = function() { return ImageItem.plusIcon; }
ImageItem.getMinusIcon = function() { return ImageItem.minusIcon; }
ImageItem.getCircleIcon = function() { return ImageItem.circleIcon; }
ImageItem.getCrossIcon = function() { return ImageItem.crossIcon; }
ImageItem.getOptionIcon = function() { return ImageItem.optionIcon; }
ImageItem.getFingerCursorIcon = function() { return ImageItem.fingerCursorIcon; }
ImageItem.getPlayer1Icon = function() { return ImageItem.player1Icon; }
ImageItem.getPlayer2Icon = function() { return ImageItem.player2Icon; }

ImageItem.getCircleSingle = function() { return ImageItem.circleSingle; }
ImageItem.getCircleEach = function() { return ImageItem.circleEach; }
ImageItem.getCircleBreak = function() { return ImageItem.circleBreak; }

ImageItem.getHoldHeadSingle = function(angulatable) { return !angulatable ? ImageItem.circleHoldHeadSingle : ImageItem.angulateHoldHeadSingle; }
ImageItem.getHoldFootSingle = function(angulatable) { return !angulatable ? ImageItem.circleHoldFootSingle : ImageItem.angulateHoldFootSingle; }
ImageItem.getHoldHeadEach = function(angulatable) { return !angulatable ? ImageItem.circleHoldHeadEach : ImageItem.angulateHoldHeadEach; }
ImageItem.getHoldFootEach = function(angulatable) { return !angulatable ? ImageItem.circleHoldFootEach : ImageItem.angulateHoldFootEach; }

ImageItem.getHoldBodySingle = function() { return ImageItem.holdBodySingle; }
ImageItem.getHoldBodyEach = function() { return ImageItem.holdBodyEach; }
ImageItem.getSlideOnStarSingle = function() { return ImageItem.slideOnStarSingle; }
ImageItem.getSlideOnStarEach = function() { return ImageItem.slideOnStarEach; }
ImageItem.getSlideMarkerSingle = function() { return ImageItem.slideMarkerSingle; }
ImageItem.getSlideMarkerEach = function() { return ImageItem.slideMarkerEach; }

ImageItem.getJudgeTapPerfect = function() { return ImageItem.judgeTapPerfect; }
ImageItem.getJudgeTapGreat = function() { return ImageItem.judgeTapGreat; }
ImageItem.getJudgeTapGood = function() { return ImageItem.judgeTapGood; }
ImageItem.getJudgeTapMiss = function() { return ImageItem.judgeTapMiss; }
ImageItem.getJudgeBreakP2600 = function() { return ImageItem.judgeBreakP2600; }
ImageItem.getJudgeBreakP2550 = function() { return ImageItem.judgeBreakP2550; }
ImageItem.getJudgeBreakP2500 = function() { return ImageItem.judgeBreakP2500; }
ImageItem.getJudgeBreakP2000 = function() { return ImageItem.judgeBreakP2000; }
ImageItem.getJudgeBreakP1500 = function() { return ImageItem.judgeBreakP1500; }
ImageItem.getJudgeBreakP1250 = function() { return ImageItem.judgeBreakP1250; }
ImageItem.getJudgeBreakP1000 = function() { return ImageItem.judgeBreakP1000; }
ImageItem.getJudgeSlideJust = function() { return ImageItem.judgeSlideJust; }
ImageItem.getJudgeSlideFastGreat = function() { return ImageItem.judgeSlideFastGreat; }
ImageItem.getJudgeSlideFastGood = function() { return ImageItem.judgeSlideFastGood; }
ImageItem.getJudgeSlideLateGreat = function() { return ImageItem.judgeSlideLateGreat; }
ImageItem.getJudgeSlideLateGood = function() { return ImageItem.judgeSlideLateGood; }
ImageItem.getJudgeSlideTooLate = function() { return ImageItem.judgeSlideTooLate; }

ImageItem.allCompleted = false; //すべての画像ファイルを読み込み終えたかどうかフラグ

ImageItem.createImageItems = function() {
	ImageItem.allCompleted = false;
	
	//パスはhtmlからの相対パス

	ImageItem.materialBmp.src = "images/dammy.png";
	ImageItem.maimaiBase.src = "images/res1.png";
	ImageItem.logo.src = "images/res2.png";
	ImageItem.touchToStart.src = "images/dammy.png";
	ImageItem.playerIconSimple.src = "images/dammy.png";
	ImageItem.maimaiSyncBase.src = "images/dammy.png";
	
	ImageItem.upIcon.src = "images/res5.png";
	ImageItem.downIcon.src = "images/res6.png";
	ImageItem.plusIcon.src = "images/res7.png";
	ImageItem.minusIcon.src = "images/res8.png";
	ImageItem.circleIcon.src = "images/res9.png";
	ImageItem.crossIcon.src = "images/res10.png";
	ImageItem.optionIcon.src = "images/res11.png";
	ImageItem.fingerCursorIcon.src = "images/res12.png";
	ImageItem.player1Icon.src = "images/dammy.png";
	ImageItem.player2Icon.src = "images/dammy.png";

	ImageItem.circleSingle.src = "images/res13.png";
	ImageItem.circleEach.src = "images/res14.png";
	ImageItem.circleBreak.src = "images/res15.png";
	ImageItem.circleHoldHeadSingle.src = "images/res16.png";
	ImageItem.circleHoldFootSingle.src = "images/res17.png";
	ImageItem.circleHoldHeadEach.src = "images/res18.png";
	ImageItem.circleHoldFootEach.src = "images/res19.png";
	ImageItem.angulateHoldHeadSingle.src = "images/res20.png";
	ImageItem.angulateHoldFootSingle.src = "images/res21.png";
	ImageItem.angulateHoldHeadEach.src = "images/res22.png";
	ImageItem.angulateHoldFootEach.src = "images/res23.png";
	ImageItem.holdBodySingle.src = "images/res28.png";
	ImageItem.holdBodyEach.src = "images/res29.png";
	ImageItem.slideOnStarSingle.src = "images/res24.png";
	ImageItem.slideOnStarEach.src = "images/res25.png";
	ImageItem.slideMarkerSingle.src = "images/res26.png";
	ImageItem.slideMarkerEach.src = "images/res27.png";

	ImageItem.judgeTapPerfect.src = "images/res30.png";
	ImageItem.judgeTapGreat.src = "images/res31.png";
	ImageItem.judgeTapGood.src = "images/res32.png";
	ImageItem.judgeTapMiss.src = "images/res33.png";
	ImageItem.judgeBreakP2600.src = "images/res40.png";
	ImageItem.judgeBreakP2550.src = "images/res41.png";
	ImageItem.judgeBreakP2500.src = "images/res42.png";
	ImageItem.judgeBreakP2000.src = "images/res43.png";
	ImageItem.judgeBreakP1500.src = "images/res44.png";
	ImageItem.judgeBreakP1250.src = "images/res45.png";
	ImageItem.judgeBreakP1000.src = "images/res46.png";
	ImageItem.judgeSlideJust.src = "images/res34.png";
	ImageItem.judgeSlideFastGreat.src = "images/res35.png";
	ImageItem.judgeSlideFastGood.src = "images/res36.png";
	ImageItem.judgeSlideLateGreat.src = "images/res37.png";
	ImageItem.judgeSlideLateGood.src = "images/res38.png";
	ImageItem.judgeSlideTooLate.src = "images/res39.png";
}

ImageItem.destroy = function() {
	ImageItem.materialBmp.src = null;
	ImageItem.maimaiBase.src = null;
	ImageItem.maimaiSyncBase.src = null;
	ImageItem.logo.src = null;
	ImageItem.touchToStart.src = null;
	ImageItem.playerIconSimple.src = null;
	ImageItem.upIcon.src = null;
	ImageItem.downIcon.src = null;
	ImageItem.plusIcon.src = null;
	ImageItem.minusIcon.src = null;
	ImageItem.circleIcon.src = null;
	ImageItem.crossIcon.src = null;
	ImageItem.optionIcon.src = null;
	ImageItem.fingerCursorIcon.src = null;
	
	ImageItem.circleSingle.src = null;
	ImageItem.circleEach.src = null;
	ImageItem.circleBreak.src = null;
	ImageItem.circleHoldHeadSingle.src = null;
	ImageItem.circleHoldFootSingle.src = null;
	ImageItem.circleHoldHeadEach.src = null;
	ImageItem.circleHoldFootEach.src = null;
	ImageItem.angulateHoldHeadSingle.src = null;
	ImageItem.angulateHoldFootSingle.src = null;
	ImageItem.angulateHoldHeadEach.src = null;
	ImageItem.angulateHoldFootEach.src = null;
	ImageItem.slideOnStarSingle.src = null;
	ImageItem.slideOnStarEach.src = null;
	ImageItem.slideMarkerSingle.src = null;
	ImageItem.slideMarkerEach.src = null;
	ImageItem.holdBodySingle.src = null;
	ImageItem.holdBodyEach.src = null;
	
	ImageItem.judgeTapPerfect.src = null;
	ImageItem.judgeTapGreat.src = null;
	ImageItem.judgeTapGood.src = null;
	ImageItem.judgeTapMiss.src = null;
	ImageItem.judgeSlideJust.src = null;
	ImageItem.judgeSlideFastGreat.src = null;
	ImageItem.judgeSlideFastGood.src = null;
	ImageItem.judgeSlideLateGreat.src = null;
	ImageItem.judgeSlideLateGood.src = null;
	ImageItem.judgeSlideTooLate.src = null;
	ImageItem.judgeBreakP2600.src = null;
	ImageItem.judgeBreakP2550.src = null;
	ImageItem.judgeBreakP2500.src = null;
	ImageItem.judgeBreakP2000.src = null;
	ImageItem.judgeBreakP1500.src = null;
	ImageItem.judgeBreakP1250.src = null;
	ImageItem.judgeBreakP1000.src = null;

	ImageItem.materialBmp = null;
	ImageItem.maimaiBase = null;
	ImageItem.maimaiSyncBase = null;
	ImageItem.logo = null;
	ImageItem.touchToStart = null;
	ImageItem.playerIconSimple = null;
	ImageItem.upIcon = null;
	ImageItem.downIcon = null;
	ImageItem.plusIcon = null;
	ImageItem.minusIcon = null;
	ImageItem.circleIcon = null;
	ImageItem.crossIcon = null;
	ImageItem.optionIcon = null;
	ImageItem.fingerCursorIcon = null;
	
	ImageItem.circleSingle = null;
	ImageItem.circleEach = null;
	ImageItem.circleBreak = null;
	ImageItem.circleHoldHeadSingle = null;
	ImageItem.circleHoldFootSingle = null;
	ImageItem.circleHoldHeadEach = null;
	ImageItem.circleHoldFootEach = null;
	ImageItem.angulateHoldHeadSingle = null;
	ImageItem.angulateHoldFootSingle = null;
	ImageItem.angulateHoldHeadEach = null;
	ImageItem.angulateHoldFootEach = null;
	ImageItem.slideOnStarSingle = null;
	ImageItem.slideOnStarEach = null;
	ImageItem.slideMarkerSingle = null;
	ImageItem.slideMarkerEach = null;
	ImageItem.holdBodySingle = null;
	ImageItem.holdBodyEach = null;
	
	ImageItem.judgeTapPerfect = null;
	ImageItem.judgeTapGreat = null;
	ImageItem.judgeTapGood = null;
	ImageItem.judgeTapMiss = null;
	ImageItem.judgeSlideJust = null;
	ImageItem.judgeSlideFastGreat = null;
	ImageItem.judgeSlideFastGood = null;
	ImageItem.judgeSlideLateGreat = null;
	ImageItem.judgeSlideLateGood = null;
	ImageItem.judgeSlideTooLate = null;
	ImageItem.judgeBreakP2600 = null;
	ImageItem.judgeBreakP2550 = null;
	ImageItem.judgeBreakP2500 = null;
	ImageItem.judgeBreakP2000 = null;
	ImageItem.judgeBreakP1500 = null;
	ImageItem.judgeBreakP1250 = null;
	ImageItem.judgeBreakP1000 = null;
}

ImageItem.checkAllCompleted = function() {
	var bmps = [
		ImageItem.materialBmp, ImageItem.maimaiBase, ImageItem.maimaiSyncBase, ImageItem.logo, ImageItem.touchToStart, ImageItem.playerIconSimple, ImageItem.upIcon, ImageItem.downIcon, ImageItem.plusIcon, ImageItem.minusIcon, ImageItem.circleIcon, ImageItem.crossIcon, ImageItem.optionIcon, ImageItem.fingerCursorIcon, 
		ImageItem.circleSingle, ImageItem.circleEach, ImageItem.circleBreak, ImageItem.circleHoldHeadSingle, ImageItem.circleHoldFootSingle, ImageItem.circleHoldHeadEach, ImageItem.circleHoldFootEach, ImageItem.angulateHoldHeadSingle, ImageItem.angulateHoldFootSingle, ImageItem.angulateHoldHeadEach, ImageItem.angulateHoldFootEach, ImageItem.slideOnStarSingle, ImageItem.slideOnStarEach, ImageItem.slideMarkerSingle, ImageItem.slideMarkerEach, ImageItem.holdBodySingle, ImageItem.holdBodyEach, 
		ImageItem.judgeTapPerfect, ImageItem.judgeTapGreat, ImageItem.judgeTapGood, ImageItem.judgeTapMiss, ImageItem.judgeSlideJust, ImageItem.judgeSlideFastGreat, ImageItem.judgeSlideFastGood, ImageItem.judgeSlideLateGreat, ImageItem.judgeSlideLateGood, ImageItem.judgeSlideTooLate, ImageItem.judgeBreakP2600, ImageItem.judgeBreakP2550, ImageItem.judgeBreakP2500, ImageItem.judgeBreakP2000, ImageItem.judgeBreakP1500, ImageItem.judgeBreakP1250, ImageItem.judgeBreakP1000, 
	];
	var ret = true;
	for (var i = 0; i < bmps.length; i++) {
		if (!bmps[i].complete) {
			ret = false;
			break;
		}
	}
	ImageItem.allCompleted = ret;
}

