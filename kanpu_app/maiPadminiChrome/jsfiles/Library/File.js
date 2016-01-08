//=====================
// ファイル読み込みクラス
//=====================
var loaderFunction;
function File(loaderFunc_withText) {
	loaderFunction = loaderFunc_withText;
}

File.prototype.dochange = function(event) {
	var file = event.target.files[0];
	if (file) {
		this.readfile(file);
	}
}

File.prototype.readfile = function(file) {
	var reader = new FileReader();
	reader.addEventListener('load', this.onFileLoaded);
	reader.addEventListener('error', this.onFileLoadError);
	reader.readAsText(file,"utf-8");
}

File.prototype.onFileLoaded = function(event) {
	var text = event.target.result;
	if (loaderFunction != null) {
		loaderFunction(text);
		console.log("ファイル読み込み完了");
	}
	else {
		console.log("読み込みクラスが設定されていない");
	}
}

File.prototype.onFileLoadError = function(event) {
	if (event.target.error.code == event.target.error.NOT_READABLE_ERR) {
		alert("ファイルの読み込みに失敗しました");
	} else {
		alert("エラーが発生しました\r\n" + event.target.error.code);
	}
}
