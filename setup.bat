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

xcopy tools\macro sakura\macro /I /Q
xcopy tools\sakura.ini sakura /Y /Q



echo exotoolsのダウンロードを開始
if not exist .\download\exotools.zip @bitsadmin /transfer myjob /PRIORITY FOREGROUND https://github.com/suzune25254649/exotools/archive/refs/heads/master.zip %~dp0\download\exotools.zip
if not exist .\download\exotools.zip @bitsadmin /transfer myjob /PRIORITY FOREGROUND https://github.com/suzune25254649/exotools/archive/refs/heads/master.zip %~dp0\download\exotools.zip

if not exist .\download\exotools.zip (
	echo ERROR
	echo ダウンロードに失敗しました。
	echo 時々失敗することがあるようなので、何度かやってみてください。
	pause
	exit
)
if not exist .\extools powershell -NoProfile -ExecutionPolicy Unrestricted .\tools\unzip.ps1 download\exotools.zip .



echo SUCCEEDED
echo セットアップが正常に完了しました！
pause
exit