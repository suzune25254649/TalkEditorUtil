@echo off
mkdir download > NUL 2>&1

echo sakura�̃_�E�����[�h���J�n
if not exist .\download\sakura-tag-v2.4.1-build2849-ee8234f-Win32-Release-Exe.zip @bitsadmin /transfer �T�N���G�f�B�^�̃_�E�����[�h /PRIORITY FOREGROUND https://github.com/sakura-editor/sakura/releases/download/v2.4.1/sakura-tag-v2.4.1-build2849-ee8234f-Win32-Release-Exe.zip %~dp0\download\sakura-tag-v2.4.1-build2849-ee8234f-Win32-Release-Exe.zip
if not exist .\download\sakura-tag-v2.4.1-build2849-ee8234f-Win32-Release-Exe.zip (
	echo ERROR
	echo �_�E�����[�h�Ɏ��s���܂����B
	echo ���X���s���邱�Ƃ�����悤�Ȃ̂ŁA���x������Ă݂Ă��������B
	pause
	exit
)
if not exist .\sakura powershell -NoProfile -ExecutionPolicy Unrestricted .\tools\unzip.ps1 download\sakura-tag-v2.4.1-build2849-ee8234f-Win32-Release-Exe.zip sakura

xcopy tools\macro sakura\macro /I /Q
xcopy tools\sakura.ini sakura /Y /Q



echo exotools�̃_�E�����[�h���J�n
if not exist .\download\exotools.zip @bitsadmin /transfer myjob /PRIORITY FOREGROUND https://github.com/suzune25254649/exotools/archive/refs/heads/master.zip %~dp0\download\exotools.zip
if not exist .\download\exotools.zip @bitsadmin /transfer myjob /PRIORITY FOREGROUND https://github.com/suzune25254649/exotools/archive/refs/heads/master.zip %~dp0\download\exotools.zip

if not exist .\download\exotools.zip (
	echo ERROR
	echo �_�E�����[�h�Ɏ��s���܂����B
	echo ���X���s���邱�Ƃ�����悤�Ȃ̂ŁA���x������Ă݂Ă��������B
	pause
	exit
)
if not exist .\extools powershell -NoProfile -ExecutionPolicy Unrestricted .\tools\unzip.ps1 download\exotools.zip .



echo SUCCEEDED
echo �Z�b�g�A�b�v������Ɋ������܂����I
pause
exit