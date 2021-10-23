eval((new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile(Editor.ExpandParameter('$M').split("\\").reverse().slice(1).reverse().join("\\") + "\\functions.js",1).ReadAll());

(function() {
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
