
(function() {
	var fs = new ActiveXObject("Scripting.FileSystemObject");

	var cnt = 0;
	for (var lineno = 1; lineno <= Editor.GetLineCount(0); ++lineno) {
		if (IsTalkerLine(lineno)) {
			++cnt;
		}
	}
	MessageBox("ƒZƒŠƒt‚Ì” : " + cnt, 0x1000);
})();

function GetLineText(lineno) {
	var str = Editor.GetLineStr(lineno);
	var ch = str.charAt(0);
	if ('#' == ch || '$' == ch) {
		return '';
	}
	return str;
}

function IsTalkerLine(lineno) {
	return ('@' == GetLineText(lineno).charAt(0));
}
