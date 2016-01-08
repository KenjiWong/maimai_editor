//==================
// DirectFileIO
//==================
function DirectFileIO() {
}

DirectFileIO.parseNumber = function(macro, initializeValue) {
	if (macro != null && macro == "") 
		return initializeValue;
	if (!isNaN(macro)) {
		return Number(macro);
	}
	else {
		return initializeValue;
	}
}

DirectFileIO.parseBoolean = function(macro, initializeValue) {
	if (macro != null && macro == "") 
		return initializeValue;
	var lowm = macro.toLowerCase();
	if (lowm == "true") {
		return true;
	}
	else if (lowm == "false") {
		return false;
	}
	else {
		return initializeValue;
	}
}

