@echo off
chcp 65001 >nul
title 电子名片制作器 - 本地服务器
echo.
echo ============================================
echo    电子名片制作器 Card Maker 服务器
echo ============================================
echo.

:: 获取本机局域网IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
)
set IP=%IP: =%

echo  本机访问: http://localhost:8080
echo.
echo  同事访问: http://%IP%:8080
echo.
echo  请把上面的"同事访问"网址发给同事！
echo  同事的手机/电脑连着公司WiFi就能打开！
echo.
echo  关闭此窗口即可停止服务器
echo ============================================
echo.

:: 启动HTTP服务器
python -m http.server 8080 --bind 0.0.0.0 --directory "%~dp0"
