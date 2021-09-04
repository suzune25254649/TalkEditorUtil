
(function() {
	if (0 != DefineConstVar()) {
		return;
	}

	var filename;
	if ('undefined' == typeof DEFINE_OUTPUT) {
		//	保存場所ダイアログ
		var filename = FileSaveDialog('', '*.txt', 1024);
		if (filename.length < 4) {
			return;
		}
		filename = filename.substr(0, filename.length - 4);
	}
	else {
		filename = DEFINE_OUTPUT;
	}
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var path_output_dir = filename.split("\\").reverse().slice(1).reverse().join("\\");
	var path_output_filename = filename.split("\\").reverse()[0];
	var path_output_temp_dir = path_output_dir + "\\__temp__";
	var path_output_temp_filename = path_output_dir + "\\__temp__\\" + path_output_filename;
	if (!fs.FolderExists(path_output_dir)) {
		var result = MessageBox("出力先に指定されたフォルダが存在しません。\n\n" + path_output_dir + "\n\nフォルダを生成して出力を続けますか？", 0x34);
		if (0x7 == result) {
			return;
		}
		fs.CreateFolder(path_output_dir);
	}

	var fromline = Editor.GetSelectLineFrom();
	var toline = Editor.GetSelectLineTo();
	if (0 == fromline) {
		fromline = Number(Editor.ExpandParameter('$y'));
		toline = Number(Editor.ExpandParameter('$y'));
	}

	//	開始行を含む、話者定義行を探す（テキストを上方向にさかのぼって探す）
	while (1 <= fromline) {
		if (IsTalkerLine(fromline)) {
			break;
		}
		--fromline;
	}
	if (0 == fromline && 0 == Editor.GetSelectLineFrom()) {
		//	非範囲選択モードで、カーソル位置がセリフ範囲に含まれていなかった場合はエラー
		ErrorMsg("カーソル位置にセリフがありません。");
		return;
	}
	if (0 == fromline) {
		//	範囲選択モードで、開始位置よりも下に初セリフがあるパターン
		fromline = 1;
		while (fromline <= toline) {
			if (IsTalkerLine(fromline)) {
				break;
			}
			++fromline;
		}
	}
	if (toline < fromline) {
		ErrorMsg("選択範囲内にセリフがありません。");
		return;
	}

	//	終了行を含むセリフの、末尾行を探す（テキストを下方向にくだって探す）
	if (IsTalkerLine(toline)) {
		++toline;
	}
	while (toline <= Editor.GetLineCount(0)) {
		if (IsTalkerLine(toline)) {
			--toline;
			break;
		}
		++toline;
	}

	//	テキスト先頭から、開始行に至るまでの間に、いくつセリフが存在するかをカウントする
	var talkno = 0;
	for (var i = 1; i < fromline; ++i) {
		if (IsTalkerLine(i)) {
			++talkno;
		}
	}

	var last = toline;
	var dic = {};
	var all_talkers = [];
	var all_texts = [];
	var talker = '';
	var param = '';
	var text = '';
	for (var lineno = fromline; lineno <= last; ++lineno) {

		var is_talkerline = IsTalkerLine(lineno);
		if (!is_talkerline) {
			text += GetLineText(lineno).replace(/(^\s+)|(\s+$)/g, "") + "\n";
		}
		if (is_talkerline || lineno == last) {
			if ('' != talker) {
				processName = GetTalkerProcessName(talker);
				if ('undefined' == typeof dic[processName]) {
					dic[processName] = {
						"talkers":[],
						"params":[],
						"texts":[],
						"talknos":[]
					};
				}
				text = text.replace(/(^\s+)|(\s+$)/g, "");
				all_talkers.push(talker);
				all_texts.push(text);
				dic[processName].talkers.push(talker);
				dic[processName].params.push(param);
				dic[processName].texts.push(text);
				dic[processName].talknos.push(talkno);
				++talkno;
				text = '';
			}
			if (is_talkerline) {
				talker = GetTalker(lineno);
				param = GetTalkerParam(lineno);

				if (lineno == last) {
					//	最終行が話者指定行である場合は、空テキストが出力されるべき
					processName = GetTalkerProcessName(talker);
					if ('undefined' == typeof dic[processName]) {
						dic[processName] = {
							"talkers":[],
							"params":[],
							"texts":[],
							"talknos":[]
						};
					}
					all_talkers.push(talker);
					all_texts.push(text);
					dic[processName].talkers.push(talker);
					dic[processName].params.push(param);
					dic[processName].texts.push(text);
					dic[processName].talknos.push(talkno);
					++talkno;
					text = '';
				}
			}
		}
	}

	//	一時フォルダの作成
	if (fs.FolderExists(path_output_temp_dir)) {
		fs.DeleteFolder(path_output_temp_dir);
	}
	fs.CreateFolder(path_output_temp_dir);

	var code = (0 == GetCharCode()) ? 0 : -1;

	var pathMacroFile = Editor.ExpandParameter('$M');
	var pathMacroDir = pathMacroFile.split("\\").reverse().slice(1).reverse().join("\\") + "\\";
	shell = new ActiveXObject('wscript.shell');
	shell.CurrentDirectory = pathMacroDir

	var PLAY = 1;
	var TEXT = 2;
	var SAVE = 4;
	var SAVEALL = 8;
	var SYNC = 16;
	for (var processName in dic) {
		var talkers = dic[processName].talkers;
		var params = dic[processName].params;
		var texts = dic[processName].texts;
		var talknos = dic[processName].talknos;

		var outputName = path_output_temp_filename + "__temp__" + processName;

		var ls = [];
		var n = texts.length;
		for (var i = 0; i < n; ++i) {
			ls.push(talkers[i] + "＞" + ConvertToEditorText(texts[i]));
		}
		var textAll = ls.join("<endtalk>\n");
		var result = RunRemoteTalkEditor("TransferString.exe -t RemoteTalkEditor64 -e RemoteTalkEditor64.exe " + (TEXT | SAVEALL | SYNC) + " \"" + processName + "\t" + textAll + "\t" + outputName + "\t<endtalk>\"");
		if (0 != result) {
			//	一時フォルダの削除
			if (fs.FolderExists(path_output_temp_dir)) {
				fs.DeleteFolder(path_output_temp_dir);
			}
			MessageBox(processName + "での出力にてエラーが発生しました。", 0x1010);
			return;
		}

		for (var i = 0; i < talkers.length; ++i) {
			var from = outputName + '-' + i + '.wav';
			var to = filename + '-' + talknos[i] + '.wav';
			while (!fs.FileExists(from)) {
			}
			if (fs.FileExists(to)) {
				fs.DeleteFile(to);
			}
			//	エディタが出力した不要txtを削除
			if (fs.FileExists(outputName + '-' + i + ".txt")) {
				fs.DeleteFile(outputName + '-' + i + ".txt");
			}

			//	終末ポーズを追加する
			var addSilence = GetAddSilence(processName);
			if ("SofTalk" == processName && 44 == fs.GetFile(from).Size)
			{
				//  44byteとは、長さが0のWAVファイルのサイズ。空テキストをSofTalkに生成させると生まれる。
				//  500とは、SofTalkで文章を読ませた時に挿入される、末尾の無音長さ(500ms)。これが空テキストを生成させた時のみ挿入されないため、ここで挿入してあげる。
				addSilence += 500;
			}
			if (0 != addSilence)
			{
				var command = 'AddSilence.exe ' + addSilence + ' "' + from + '"';
				shell.Run(command, 0, true);
			}

			//	ファイルを最終的な名前にmoveする
			fs.MoveFile(from, to);

			//	字幕作成
			var file = fs.OpenTextFile(filename + '-' + talknos[i] + '.txt', 2, true, code);
			file.Write(talkers[i] + "＞" + ConvertToJimakuText(texts[i]));
			file.Close();

			//	パラメータファイル作成
			var file = fs.OpenTextFile(filename + '-' + talknos[i] + '.param.txt', 2, true, code);
			file.Write(params[i]);
			file.Close();
		}

		if ("CeVIO Creative Studio" == processName || "CeVIO AI" == processName) {
			var bat = fs.OpenTextFile(filename + '_' + processName + '_rename.bat', 2, true, 0);
			var file = fs.OpenTextFile(filename + '_' + processName + '.txt', 2, true, code);
			for (var i = 0; i < n; ++i) {
				file.Write(GetName(talkers[i]) + "," + ConvertToEditorText(texts[i]).replace(",", ".") + "\n");

				if (i < 10) {
					bat.Write('move /y "トーク１\\0' + i + '_*.wav" "' + filename + '-' + talknos[i] + '.wav"\r\n');
				}
				else {
					bat.Write('move /y "トーク１\\' + i + '_*.wav" "' + filename + '-' + talknos[i] + '.wav"\r\n');
				}
			}
			file.Close();
			bat.Write('rd /s /q "トーク１"\r\n');
			bat.Write("pause");
			bat.Close();
		}
	}
	//	一時フォルダの削除
	if (fs.FolderExists(path_output_temp_dir)) {
		fs.DeleteFolder(path_output_temp_dir);
	}
//	MessageBox("出力完了", 0x1000);
})();

function DefineConstVar() {
	var error_count = 0;
	var last = Editor.GetLineCount(0);
	for (var lineno = 1; lineno < last; ++lineno) {
		var str = Editor.GetLineStr(lineno);
		var ch = str.charAt(0);
		if ('$' == ch) {
			str = str.substr(1);
			var index = str.indexOf('=');
			if (-1 == index) {
				ErrorMsg("= が見つかりません。\n\n" + Editor.GetLineStr(lineno));
				++error_count;
			}
			else {
				var name = str.substr(0, index).replace(/(^\s+)|(\s+$)/g, "");
				var value = str.substr(index + 1).replace(/(^\s+)|(\s+$)/g, "");

				if ('OUTPUT' == name) {
					if (':' == value.indexOf(1) || '\\' == value.indexOf(0)) {
						//	絶対パス
						DEFINE_OUTPUT = value;
					}
					else {
						//	相対パス
						DEFINE_OUTPUT = Editor.ExpandParameter('$F').split("\\").reverse().slice(1).reverse().join("\\") + "\\" + value;
					}
					DEFINE_OUTPUT = DEFINE_OUTPUT.replace('/', '\\');
				}
				else {
					ErrorMsg('定義名 "' + name + '" は不明です。');
					++error_count;
				}
			}
		}
		else if ('@' == ch) {
			return error_count;
		}
	}
	return error_count;
}

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

function GetTalker(lineno) {
	if (!IsTalkerLine(lineno)) {
		return '';
	}
	var str = GetLineText(lineno).substr(1);
	var n = str.indexOf('/');
	if (-1 == n) {
		return str.replace(/(^\s+)|(\s+$)/g, "");
	}
	return str.substr(0, n).replace(/(^\s+)|(\s+$)/g, "");
}

function GetTalkerParam(lineno) {
	if (!IsTalkerLine(lineno)) {
		return '';
	}
	var str = GetLineText(lineno).substr(1);
	var n = str.indexOf('/');
	if (-1 == n) {
		return '';
	}
	return str.substr(n + 1).replace(/[\r\n]+/g, "");
}

function GetName(talker) {
	var index = talker.indexOf('-');
	if (-1 == index) {
		return talker.replace(/(^\s+)|(\s+$)/g, "");
	}
	else {
		return talker.substr(0, index).replace(/(^\s+)|(\s+$)/g, "");
	}
}

function ConvertToEditorText(text) {
	text = text.replace(/\s/g, '');
	text = text.replace(/{([^}]*?)\|(.*?)}/g, "$1");
	text = text.replace(/([^{]){([^{]+?)}/g, "$1$2");
	text = text.replace(/{{/g, "{");
	text = text.replace(/}}/g, "}");
	return text;
}

function ConvertToJimakuText(text) {
	text = text.replace(/{([^}]*?)\|(.*?)}/g, "$2");
	text = text.replace(/([^{]){([^{]+?)}/g, "$1");
	text = text.replace(/{{/g, "{");
	text = text.replace(/}}/g, "}");
	text = text.replace(/(^\s+)|(\s+$)/g, "");
	return text;
}

function GetTalkerProcessName(talker) {
	if ('undefined' == typeof TALKERS_SETTING) {
		var pathMacroFile = Editor.ExpandParameter('$M');
		var pathMacroDir = pathMacroFile.split("\\").reverse().slice(1).reverse().join("\\") + "\\";

		TALKERS_SETTING = {};
		var fs = new ActiveXObject("Scripting.FileSystemObject");
		var file = fs.OpenTextFile(pathMacroDir + 'talkers.txt', 1, false, 0);
		while (!file.AtEndOfStream) {
			var line = file.ReadLine().replace(/(^\s+)|(\s+$)/g, "");
			if (0 < line.length && '#' == line.charAt(0)) {
				continue;
			}
			var tokens = line.split('=');
			if (2 != tokens.length) {
				continue;
			}
			TALKERS_SETTING[tokens[0].replace(/(^\s+)|(\s+$)/g, "")] = tokens[1].replace(/(^\s+)|(\s+$)/g, "");
		}
		file.Close();
	}
	var processName = TALKERS_SETTING["default"];
	for (var key in TALKERS_SETTING)
	{
		if (0 == talker.indexOf(key))
		{
			processName = TALKERS_SETTING[key];
			break;
		}
	}
	return processName;
}

function GetAddSilence(processName) {
	if ('undefined' == typeof ADD_SILENCE) {
		var pathMacroFile = Editor.ExpandParameter('$M');
		var pathMacroDir = pathMacroFile.split("\\").reverse().slice(1).reverse().join("\\") + "\\";

		ADD_SILENCE = {};
		var fs = new ActiveXObject("Scripting.FileSystemObject");
		var file = fs.OpenTextFile(pathMacroDir + 'addsilence.txt', 1, false, 0);
		while (!file.AtEndOfStream) {
			var line = file.ReadLine().replace(/(^\s+)|(\s+$)/g, "");
			if (0 < line.length && '#' == line.charAt(0)) {
				continue;
			}
			var tokens = line.split('=');
			if (2 != tokens.length) {
				continue;
			}
			ADD_SILENCE[tokens[0].replace(/(^\s+)|(\s+$)/g, "")] = tokens[1].replace(/(^\s+)|(\s+$)/g, "");
		}
		file.Close();
	}
	if ('undefined' == typeof ADD_SILENCE[processName]) {
		return 0;
	}
	else
	{
		return Number(ADD_SILENCE[processName]);
	}
}

function RunRemoteTalkEditor(command) {
	var pathMacroFile = Editor.ExpandParameter('$M');
	var pathMacroDir = pathMacroFile.split("\\").reverse().slice(1).reverse().join("\\") + "\\";
	shell = new ActiveXObject('wscript.shell');
	shell.CurrentDirectory = pathMacroDir
	var result = shell.Run(command, 0, true);
	if (-1 == result) {
		shell.Run("RemoteTalkEditor64.exe", 8, false);
		for (var i = 0; i < 3; ++i) {
			shell.Run("timeout 1", 0, true);
			result = shell.Run(command, 0, true);
			if (-1 != result) {
				break;
			}
		}
	}
	return result;
}
