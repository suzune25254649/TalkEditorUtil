Init();
(function() {
	var cnt = 0;
	for (var lineno = 1; lineno <= Editor.GetLineCount(0); ++lineno) {
		if (IsTalkerLine(lineno)) {
			++cnt;
		}
	}
	MessageBox("セリフの数 : " + cnt, 0x1000);
})();

function Init() {
	TOOL_VERSION = "1.1.5"

	EDITOR  = 1;
	PLAY = 2;
	TEXT = 4;
	SAVE = 8;
	SAVEALL = 16;
	SYNC = 32;
	CONFIG = 64;
}

function DefineConstVar() {
	DEFINE_CONFIG = Editor.ExpandParameter('$M').split("\\").reverse().slice(1).reverse().join("\\");

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
				else if ('CONFIG' == name) {
					if (':' == value.indexOf(1) || '\\' == value.indexOf(0)) {
						//	絶対パス
						DEFINE_CONFIG = value;
					}
					else {
						//	相対パス
						DEFINE_CONFIG = Editor.ExpandParameter('$F').split("\\").reverse().slice(1).reverse().join("\\") + "\\" + value;
					}
					DEFINE_CONFIG = DEFINE_CONFIG.replace('/', '\\');
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

function GetCurrentTalk() {
	var line_current = Number(Editor.ExpandParameter('$y'));
	var line_start = line_current;
	var line_end = line_current + 1;
	var last = Editor.GetLineCount(0);
	while (0 < line_start) {
		if (IsTalkerLine(line_start)) {
			break;
		}
		--line_start;
	}
	if (0 == line_start) {
		return [false, "", ""];
	}
	while (line_end <= last) {
		if (IsTalkerLine(line_end)) {
			--line_end;
			break;
		}
		++line_end;
	}
	line_end = Math.min(line_end, last);

	//	話者行
	var talker = GetTalker(line_start);

	//	会話内容
	var texts = [];
	for (var i = line_start + 1; i <= line_end; ++i) {
		texts.push(GetLineText(i).replace(/(^\s+)|(\s+$)/g, ""));
	}
	var text = texts.join("\n");
	return [true, talker, text]
}

function ParseName(talker) {
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
		var filepath = DEFINE_CONFIG + '\\talkers.txt';

		TALKERS_SETTING = {};
		var fs = new ActiveXObject("Scripting.FileSystemObject");
		var file = fs.OpenTextFile(filepath, 1, false, 0);
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

function GetBasename(path) {
	return path.split("\\").reverse()[0];;
}

function GetDirname(path) {
	return path.split("\\").reverse().slice(1).reverse().join("\\");
}
