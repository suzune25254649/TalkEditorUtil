
(function() {
	var fs = new ActiveXObject("Scripting.FileSystemObject");

	var fromline = Number(Editor.ExpandParameter('$y'));
	for (var lineno = fromline + 1; lineno <= Editor.GetLineCount(0); ++lineno) {
		if (IsTalkerLine(lineno)) {
			MoveCursor(lineno + 10, 1, 0);
			MoveCursor(lineno, 1, 0);
			GoLineEnd();
			break;
		}
	}
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
