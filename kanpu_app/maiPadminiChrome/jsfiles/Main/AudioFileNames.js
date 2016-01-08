//===============================
//  SEファイル一覧
//===============================
if (!(navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0)) {
	for (var i = 0; i < 8; i++) {
		document.write('<audio id="se_startcount' + i + '" preload="auto"><source src="audios/se_startcount.wav" type="audio/wav"></audio>');
		document.write('<audio id="se_simai_tap' + i + '" preload="auto"><source src="audios/se_simai_tap.wav" type="audio/wav"></audio>');
		document.write('<audio id="se_simai_holdfoot' + i + '" preload="auto"><source src="audios/se_simai_holdfoot.wav" type="audio/wav"></audio>');
		document.write('<audio id="se_simai_slide' + i + '" preload="auto"><source src="audios/se_simai_slide.wav" type="audio/wav"></audio>');
		document.write('<audio id="se_simai_break' + i + '" preload="auto"><source src="audios/se_simai_break.wav" type="audio/wav"></audio>');
	}
}
