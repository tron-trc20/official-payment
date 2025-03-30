@echo off
chcp 65001 > nul
color 0A
title TRON主网授权网站

echo ===================================================
echo           TRON主网授权网站启动工具
echo ===================================================
echo.
echo 此脚本将启动主网版USDT授权网站，用于：
echo  - TronLink钱包连接
echo  - 用户授权USDT给合约
echo.

REM 检查Node.js
where node > nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请安装Node.js后再运行此脚本。
    goto end
)

REM 安装HTTP服务器依赖
echo 检查HTTP服务器...
call npm list -g http-server > nul 2>&1
if %errorlevel% neq 0 (
    echo 未找到http-server，正在安装...
    call npm install -g http-server
    if %errorlevel% neq 0 (
        echo 安装http-server失败，请手动安装后再试。
        goto end
    )
    echo http-server安装成功！
) else (
    echo 已安装http-server。
)

REM 获取本机IP地址
echo 获取本机IP地址...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    set IP=!IP:~1!
    goto :breakloop
)
:breakloop

echo.
echo -----------------------------------------------------
echo 静态网站将在以下地址启动:
echo.
echo - 本地访问: http://localhost:8080
if defined IP (
    echo - 局域网访问: http://%IP%:8080
)
echo.
echo 如需使用手机访问，请使用TronLink钱包内置浏览器
echo 访问上述地址。
echo -----------------------------------------------------
echo.

REM 启动服务器
echo 正在启动网站，正在打开浏览器...
start http://localhost:8080

cd /d "%~dp0"
http-server -p 8080 --cors

:end
echo.
echo 按任意键退出...
pause > nul 