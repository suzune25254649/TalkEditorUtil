Init();
(function() {
	if (0 != DefineConstVar()) {
		return;
	}

	if (1 != OkCancelBox("���ׂẴZ���t���o�͂��܂��B\n�Z���t�̑����ɉ����Ď��Ԃ�������܂����A�o�͂��J�n���܂����H")) {
		return;
	}

	var filename;
	if ('undefined' == typeof DEFINE_OUTPUT) {
		//	�ۑ��ꏊ�_�C�A���O
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
		var result = MessageBox("�o�͐�Ɏw�肳�ꂽ�t�H���_�����݂��܂���B\n\n" + path_output_dir + "\n\n�t�H���_�𐶐����ďo�͂𑱂��܂����H", 0x34);
		if (0x7 == result) {
			return;
		}
		fs.CreateFolder(path_output_dir);
	}

	var talkno = 0;
	var fromline = 1;
	var last = Editor.GetLineCount(0);
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
					//	�ŏI�s���b�Ҏw��s�ł���ꍇ�́A��e�L�X�g���o�͂����ׂ�
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

	//	�ꎞ�t�H���_�̍쐬
	if (fs.FolderExists(path_output_temp_dir)) {
		fs.DeleteFolder(path_output_temp_dir);
	}
	fs.CreateFolder(path_output_temp_dir);

	var code = (0 == GetCharCode()) ? 0 : -1;

	var pathMacroFile = Editor.ExpandParameter('$M');
	var pathMacroDir = pathMacroFile.split("\\").reverse().slice(1).reverse().join("\\") + "\\";
	shell = new ActiveXObject('wscript.shell');
	shell.CurrentDirectory = pathMacroDir

	for (var processName in dic) {
		var talkers = dic[processName].talkers;
		var params = dic[processName].params;
		var texts = dic[processName].texts;
		var talknos = dic[processName].talknos;

		var outputName = path_output_temp_filename + "__temp__" + processName;

		var ls = [];
		var n = texts.length;
		for (var i = 0; i < n; ++i) {
			ls.push(talkers[i] + "��" + ConvertToEditorText(texts[i]));
		}
		var textAll = ls.join("<endtalk>\n");
		var result = RunRemoteTalkEditor("TransferString.exe -t RemoteTalkEditor64 -e RemoteTalkEditor64.exe " + (EDITOR | TEXT | SAVEALL | SYNC | CONFIG) + " \"" + TOOL_VERSION + "\t" + processName + "\t" + textAll + "\t" + outputName + "\t<endtalk>\t" + DEFINE_CONFIG + "\"");
		if (0 != result) {
			//	�ꎞ�t�H���_�̍폜
			if (fs.FolderExists(path_output_temp_dir)) {
				fs.DeleteFolder(path_output_temp_dir);
			}
			MessageBox(processName + "�ł̏o�͂ɂăG���[���������܂����B", 0x1010);
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
			//	�G�f�B�^���o�͂����s�vtxt���폜
			if (fs.FileExists(outputName + '-' + i + ".txt")) {
				fs.DeleteFile(outputName + '-' + i + ".txt");
			}

			//	�t�@�C�����ŏI�I�Ȗ��O��move����
			fs.MoveFile(from, to);

			//	�����쐬
			var file = fs.OpenTextFile(filename + '-' + talknos[i] + '.txt', 2, true, code);
			file.Write(talkers[i] + "��" + ConvertToJimakuText(texts[i]));
			file.Close();

			//	�p�����[�^�t�@�C���쐬
			var file = fs.OpenTextFile(filename + '-' + talknos[i] + '.param.txt', 2, true, code);
			file.Write(params[i]);
			file.Close();
		}

		if ("CeVIO Creative Studio" == processName || "CeVIO AI" == processName) {
			var bat = fs.OpenTextFile(filename + '_' + processName + '_rename.bat', 2, true, 0);
			var file = fs.OpenTextFile(filename + '_' + processName + '.txt', 2, true, code);
			for (var i = 0; i < n; ++i) {
				file.Write(ParseName(talkers[i]) + "," + ConvertToEditorText(texts[i]).replace(",", ".") + "\n");

				if (i < 10) {
					bat.Write('move /y "�g�[�N�P\\0' + i + '_*.wav" "' + GetBasename(filename) + '-' + talknos[i] + '.wav"\r\n');
				}
				else {
					bat.Write('move /y "�g�[�N�P\\' + i + '_*.wav" "' + GetBasename(filename) + '-' + talknos[i] + '.wav"\r\n');
				}
			}
			file.Close();
			bat.Write('rd /s /q "�g�[�N�P"\r\n');
			bat.Write("pause");
			bat.Close();
		}
	}
	//	�ꎞ�t�H���_�̍폜
	if (fs.FolderExists(path_output_temp_dir)) {
		fs.DeleteFolder(path_output_temp_dir);
	}
	
	//	�S�Ă̑䎌���܂Ƃ߂��e�L�X�g�����i�Q�l�p�j
	var file = fs.OpenTextFile(filename + '_all.txt', 2, true, code);
	for (var i = 0; i < all_texts.length; ++i) {
		file.Write(all_talkers[i] + "��" + ConvertToEditorText(all_texts[i]) + "\n");
	}
	file.Close();

	MessageBox("�o�͊���", 0x1000);
})();

function Init() {
	TOOL_VERSION = "1.1.3"

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
				ErrorMsg("= ��������܂���B\n\n" + Editor.GetLineStr(lineno));
				++error_count;
			}
			else {
				var name = str.substr(0, index).replace(/(^\s+)|(\s+$)/g, "");
				var value = str.substr(index + 1).replace(/(^\s+)|(\s+$)/g, "");

				if ('OUTPUT' == name) {
					if (':' == value.indexOf(1) || '\\' == value.indexOf(0)) {
						//	��΃p�X
						DEFINE_OUTPUT = value;
					}
					else {
						//	���΃p�X
						DEFINE_OUTPUT = Editor.ExpandParameter('$F').split("\\").reverse().slice(1).reverse().join("\\") + "\\" + value;
					}
					DEFINE_OUTPUT = DEFINE_OUTPUT.replace('/', '\\');
				}
				else if ('CONFIG' == name) {
					if (':' == value.indexOf(1) || '\\' == value.indexOf(0)) {
						//	��΃p�X
						DEFINE_CONFIG = value;
					}
					else {
						//	���΃p�X
						DEFINE_CONFIG = Editor.ExpandParameter('$F').split("\\").reverse().slice(1).reverse().join("\\") + "\\" + value;
					}
					DEFINE_CONFIG = DEFINE_CONFIG.replace('/', '\\');
				}
				else {
					ErrorMsg('��`�� "' + name + '" �͕s���ł��B');
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

	//	�b�ҍs
	var talker = GetTalker(line_start);

	//	��b���e
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
