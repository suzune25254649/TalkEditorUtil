eval((new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile(Editor.ExpandParameter('$M').split("\\").reverse().slice(1).reverse().join("\\") + "\\functions.js",1).ReadAll());

(function() {
	if (0 != DefineConstVar()) {
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
	var fromline = Editor.GetSelectLineFrom();
	var toline = Editor.GetSelectLineTo();
	if (0 == fromline) {
		fromline = Number(Editor.ExpandParameter('$y'));
		toline = Number(Editor.ExpandParameter('$y'));
	}

	//	�J�n�s���܂ށA�b�Ғ�`�s��T���i�e�L�X�g��������ɂ����̂ڂ��ĒT���j
	while (1 <= fromline) {
		if (IsTalkerLine(fromline)) {
			break;
		}
		--fromline;
	}
	if (0 == fromline && 0 == Editor.GetSelectLineFrom()) {
		//	��͈͑I�����[�h�ŁA�J�[�\���ʒu���Z���t�͈͂Ɋ܂܂�Ă��Ȃ������ꍇ�̓G���[
		ErrorMsg("�J�[�\���ʒu�ɃZ���t������܂���B");
		return;
	}
	if (0 == fromline) {
		//	�͈͑I�����[�h�ŁA�J�n�ʒu�������ɏ��Z���t������p�^�[��
		fromline = 1;
		while (fromline <= toline) {
			if (IsTalkerLine(fromline)) {
				break;
			}
			++fromline;
		}
	}
	if (toline < fromline) {
		ErrorMsg("�I��͈͓��ɃZ���t������܂���B");
		return;
	}

	//	�I���s���܂ރZ���t�́A�����s��T���i�e�L�X�g���������ɂ������ĒT���j
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

	//	�e�L�X�g�擪����A�J�n�s�Ɏ���܂ł̊ԂɁA�����Z���t�����݂��邩���J�E���g����
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
//	MessageBox("�o�͊���", 0x1000);
})();
