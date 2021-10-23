eval((new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile(Editor.ExpandParameter('$M').split("\\").reverse().slice(1).reverse().join("\\") + "\\functions.js",1).ReadAll());

(function() {
	var fromline = Number(Editor.ExpandParameter('$y'));
	for (var lineno = fromline - 1; 1 <= lineno; --lineno) {
		if (IsTalkerLine(lineno)) {
			MoveCursor(lineno, 1, 0);
			GoLineEnd();
			break;
		}
	}
})();
