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

xcopy tools\macro sakura\macro /Y /I /Q
xcopy tools\sakura.ini sakura /Y /Q



echo exotools�̃_�E�����[�h���J�n
if not exist .\download\exotools.zip @bitsadmin /transfer exotools�̃_�E�����[�h /PRIORITY FOREGROUND https://github.com/suzune25254649/exotools/archive/refs/heads/master.zip %~dp0\download\exotools.zip
if not exist .\download\exotools.zip @bitsadmin /transfer exotools�̃_�E�����[�h /PRIORITY FOREGROUND https://github.com/suzune25254649/exotools/archive/refs/heads/master.zip %~dp0\download\exotools.zip

if not exist .\download\exotools.zip (
	echo ERROR
	echo �_�E�����[�h�Ɏ��s���܂����B
	echo ���X���s���邱�Ƃ�����悤�Ȃ̂ŁA���x������Ă݂Ă��������B
	pause
	exit
)
if not exist .\exotools-master powershell -NoProfile -ExecutionPolicy Unrestricted .\tools\unzip.ps1 download\exotools.zip .



echo nuget�̃_�E�����[�h���J�n
if not exist .\download\nuget.exe @bitsadmin /transfer nuget�̃_�E�����[�h /PRIORITY FOREGROUND https://dist.nuget.org/win-x86-commandline/latest/nuget.exe %~dp0\download\nuget.exe
if not exist .\download\nuget.exe (
	echo ERROR: �_�E�����[�h�Ɏ��s���܂����B���X���s���邱�Ƃ�����悤�Ȃ̂ŁA���x������Ă݂Ă��������B
	pause
	exit
)

echo nuget�ɂ��Friendly�̃_�E�����[�h���J�n
download\nuget.exe install Codeer.Friendly -version 2.6.1 -OutputDirectory download
if %ERRORLEVEL% neq 0 (
	rmdir /s /q "download\Codeer.Friendly.2.6.1"
	echo ERROR: �_�E�����[�h�Ɏ��s���܂����B���X���s���邱�Ƃ�����悤�Ȃ̂ŁA���x������Ă݂Ă��������B
	pause
	exit
)

download\nuget.exe install Codeer.Friendly.Windows -version 2.15.0 -OutputDirectory download
if %ERRORLEVEL% neq 0 (
	rmdir /s /q "download\Codeer.Friendly.Windows.2.15.0"
	echo ERROR: �_�E�����[�h�Ɏ��s���܂����B���X���s���邱�Ƃ�����悤�Ȃ̂ŁA���x������Ă݂Ă��������B
	pause
	exit
)

download\nuget.exe install Codeer.Friendly.Windows.Grasp -version 2.14.0 -OutputDirectory download
if %ERRORLEVEL% neq 0 (
	rmdir /s /q "download\Codeer.Friendly.Windows.Grasp.2.14.0"
	echo ERROR: �_�E�����[�h�Ɏ��s���܂����B���X���s���邱�Ƃ�����悤�Ȃ̂ŁA���x������Ă݂Ă��������B
	pause
	exit
)

download\nuget.exe install Codeer.Friendly.Windows.NativeStandardControls -version 2.16.6 -OutputDirectory download
if %ERRORLEVEL% neq 0 (
	rmdir /s /q "download\Codeer.Friendly.Windows.NativeStandardControls.2.16.6"
	echo ERROR: �_�E�����[�h�Ɏ��s���܂����B���X���s���邱�Ƃ�����悤�Ȃ̂ŁA���x������Ă݂Ă��������B
	pause
	exit
)

download\nuget.exe install Codeer.TestAssistant.GeneratorToolKit -version 3.11.0 -OutputDirectory download
if %ERRORLEVEL% neq 0 (
	rmdir /s /q "download\Codeer.TestAssistant.GeneratorToolKit.3.11.0"
	echo ERROR: �_�E�����[�h�Ɏ��s���܂����B���X���s���邱�Ƃ�����悤�Ȃ̂ŁA���x������Ă݂Ă��������B
	pause
	exit
)

download\nuget.exe install RM.Friendly.WPFStandardControls -version 1.51.1 -OutputDirectory download
if %ERRORLEVEL% neq 0 (
	rmdir /s /q "download\RM.Friendly.WPFStandardControls.1.51.1"
	echo ERROR: �_�E�����[�h�Ɏ��s���܂����B���X���s���邱�Ƃ�����悤�Ȃ̂ŁA���x������Ă݂Ă��������B
	pause
	exit
)

xcopy "download\Codeer.Friendly.2.6.1\lib\net40\Codeer.Friendly.dll" "sakura\macro\" /Y /Q
xcopy "download\Codeer.Friendly.2.6.1\lib\net40\Codeer.Friendly.Dynamic.dll" "sakura\macro\" /Y /Q
xcopy "download\Codeer.Friendly.Windows.2.15.0\lib\net20\Codeer.Friendly.Windows.dll" "sakura\macro\" /Y /Q
xcopy "download\Codeer.Friendly.Windows.Grasp.2.14.0\lib\net35\Codeer.Friendly.Windows.Grasp.2.0.dll" "sakura\macro\" /Y /Q
xcopy "download\Codeer.Friendly.Windows.Grasp.2.14.0\lib\net35\Codeer.Friendly.Windows.Grasp.3.5.dll" "sakura\macro\" /Y /Q
xcopy "download\Codeer.Friendly.Windows.NativeStandardControls.2.16.6\lib\net40\Codeer.Friendly.Windows.NativeStandardControls.4.0.dll" "sakura\macro\" /Y /Q
xcopy "download\Codeer.Friendly.Windows.NativeStandardControls.2.16.6\lib\net40\Codeer.Friendly.Windows.NativeStandardControls.dll" "sakura\macro\" /Y /Q
xcopy "download\Codeer.Friendly.Windows.NativeStandardControls.2.16.6\lib\net40\Codeer.Friendly.Windows.NativeStandardControls.Generator.dll" "sakura\macro\" /Y /Q
xcopy "download\Codeer.TestAssistant.GeneratorToolKit.3.11.0\lib\net20\Codeer.TestAssistant.GeneratorToolKit.dll" "sakura\macro\" /Y /Q
xcopy "download\RM.Friendly.WPFStandardControls.1.51.1\lib\net40\RM.Friendly.WPFStandardControls.3.0.dll" "sakura\macro\" /Y /Q
xcopy "download\RM.Friendly.WPFStandardControls.1.51.1\lib\net40\RM.Friendly.WPFStandardControls.3.0.Generator.dll" "sakura\macro\" /Y /Q
xcopy "download\RM.Friendly.WPFStandardControls.1.51.1\lib\net40\RM.Friendly.WPFStandardControls.3.5.dll" "sakura\macro\" /Y /Q
xcopy "download\RM.Friendly.WPFStandardControls.1.51.1\lib\net40\RM.Friendly.WPFStandardControls.4.0.dll" "sakura\macro\" /Y /Q
xcopy "download\RM.Friendly.WPFStandardControls.1.51.1\lib\net40\RM.Friendly.WPFStandardControls.4.0.Generator.dll" "sakura\macro\" /Y /Q

echo SUCCEEDED
echo �Z�b�g�A�b�v������Ɋ������܂����I
pause
exit