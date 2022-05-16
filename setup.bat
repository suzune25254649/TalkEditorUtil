@echo off
mkdir download > NUL 2>&1

echo sakuraのダウンロードを開始
if not exist .\download\sakura-tag-v2.4.1-build2849-ee8234f-Win32-Release-Exe.zip @bitsadmin /transfer サクラエディタのダウンロード /PRIORITY FOREGROUND https://github.com/sakura-editor/sakura/releases/download/v2.4.1/sakura-tag-v2.4.1-build2849-ee8234f-Win32-Release-Exe.zip %~dp0\download\sakura-tag-v2.4.1-build2849-ee8234f-Win32-Release-Exe.zip
if not exist .\download\sakura-tag-v2.4.1-build2849-ee8234f-Win32-Release-Exe.zip (
	echo ERROR
	echo ダウンロードに失敗しました。
	echo 時々失敗することがあるようなので、何度かやってみてください。
	pause
	exit
)
if not exist .\sakura powershell -NoProfile -ExecutionPolicy Unrestricted .\tools\unzip.ps1 download\sakura-tag-v2.4.1-build2849-ee8234f-Win32-Release-Exe.zip sakura

xcopy tools\macro sakura\macro /Y /I /Q
xcopy tools\sakura.ini sakura /Y /Q



echo exotoolsのダウンロードを開始
if not exist .\download\exotools.zip @bitsadmin /transfer exotoolsのダウンロード /PRIORITY FOREGROUND https://github.com/suzune25254649/exotools/archive/refs/heads/master.zip %~dp0\download\exotools.zip
if not exist .\download\exotools.zip @bitsadmin /transfer exotoolsのダウンロード /PRIORITY FOREGROUND https://github.com/suzune25254649/exotools/archive/refs/heads/master.zip %~dp0\download\exotools.zip

if not exist .\download\exotools.zip (
	echo ERROR
	echo ダウンロードに失敗しました。
	echo 時々失敗することがあるようなので、何度かやってみてください。
	pause
	exit
)
if not exist .\exotools-master powershell -NoProfile -ExecutionPolicy Unrestricted .\tools\unzip.ps1 download\exotools.zip .



echo nugetのダウンロードを開始
if not exist .\download\nuget.exe @bitsadmin /transfer nugetのダウンロード /PRIORITY FOREGROUND https://dist.nuget.org/win-x86-commandline/latest/nuget.exe %~dp0\download\nuget.exe
if not exist .\download\nuget.exe (
	echo ERROR: ダウンロードに失敗しました。時々失敗することがあるようなので、何度かやってみてください。
	pause
	exit
)

echo nugetによるFriendlyのダウンロードを開始
download\nuget.exe install Codeer.Friendly -version 2.6.1 -OutputDirectory download
if %ERRORLEVEL% neq 0 (
	rmdir /s /q "download\Codeer.Friendly.2.6.1"
	echo ERROR: ダウンロードに失敗しました。時々失敗することがあるようなので、何度かやってみてください。
	pause
	exit
)

download\nuget.exe install Codeer.Friendly.Windows -version 2.15.0 -OutputDirectory download
if %ERRORLEVEL% neq 0 (
	rmdir /s /q "download\Codeer.Friendly.Windows.2.15.0"
	echo ERROR: ダウンロードに失敗しました。時々失敗することがあるようなので、何度かやってみてください。
	pause
	exit
)

download\nuget.exe install Codeer.Friendly.Windows.Grasp -version 2.14.0 -OutputDirectory download
if %ERRORLEVEL% neq 0 (
	rmdir /s /q "download\Codeer.Friendly.Windows.Grasp.2.14.0"
	echo ERROR: ダウンロードに失敗しました。時々失敗することがあるようなので、何度かやってみてください。
	pause
	exit
)

download\nuget.exe install Codeer.Friendly.Windows.NativeStandardControls -version 2.16.6 -OutputDirectory download
if %ERRORLEVEL% neq 0 (
	rmdir /s /q "download\Codeer.Friendly.Windows.NativeStandardControls.2.16.6"
	echo ERROR: ダウンロードに失敗しました。時々失敗することがあるようなので、何度かやってみてください。
	pause
	exit
)

download\nuget.exe install Codeer.TestAssistant.GeneratorToolKit -version 3.11.0 -OutputDirectory download
if %ERRORLEVEL% neq 0 (
	rmdir /s /q "download\Codeer.TestAssistant.GeneratorToolKit.3.11.0"
	echo ERROR: ダウンロードに失敗しました。時々失敗することがあるようなので、何度かやってみてください。
	pause
	exit
)

download\nuget.exe install RM.Friendly.WPFStandardControls -version 1.51.1 -OutputDirectory download
if %ERRORLEVEL% neq 0 (
	rmdir /s /q "download\RM.Friendly.WPFStandardControls.1.51.1"
	echo ERROR: ダウンロードに失敗しました。時々失敗することがあるようなので、何度かやってみてください。
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
echo セットアップが正常に完了しました！
pause
exit