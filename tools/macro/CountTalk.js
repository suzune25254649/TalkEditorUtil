eval((new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile(Editor.ExpandParameter('$M').split("\\").reverse().slice(1).reverse().join("\\") + "\\functions.js",1).ReadAll());

(function() {
	var cnt = 0;
	for (var lineno = 1; lineno <= Editor.GetLineCount(0); ++lineno) {
		if (IsTalkerLine(lineno)) {
			++cnt;
		}
	}
	MessageBox("ƒZƒŠƒt‚Ì” : " + cnt, 0x1000);
})();
