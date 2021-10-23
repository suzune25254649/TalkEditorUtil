eval((new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile(Editor.ExpandParameter('$M').split("\\").reverse().slice(1).reverse().join("\\") + "\\functions.js",1).ReadAll());

(function() {
	if (0 != DefineConstVar()) {
		return;
	}

	//	åªç›ÇÃâÔòbçsÇíäèoÇ∑ÇÈ
	var nowtalk = GetCurrentTalk();
	if (!nowtalk[0]) {
		return false;
	}

	var talker = nowtalk[1];

	var text = talker + 'ÅÑ' + ConvertToEditorText(nowtalk[2]);

	var processName = GetTalkerProcessName(talker);

	RunRemoteTalkEditor("TransferString.exe -t RemoteTalkEditor64 -e RemoteTalkEditor64.exe " + (EDITOR | PLAY | TEXT | CONFIG) + " \"" + TOOL_VERSION + "\t" + processName + "\t" + text + "\t" + DEFINE_CONFIG + "\"");
})();
