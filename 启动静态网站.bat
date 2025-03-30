@echo off
chcp 65001 >nul
echo 正在启动USDT静态网站...
echo.

:: 设置错误日志文件
set log_file=error.log

:: 清除旧的日志
if exist %log_file% del /q %log_file%

:: 检查Python是否安装
where python >nul 2>nul
if %errorlevel% neq 0 (
    where python3 >nul 2>nul
    if %errorlevel% neq 0 (
        echo 错误: 未找到Python，将使用简单的方式打开网站。
        echo 为了更好的体验，请安装Python。
        
        :: 直接打开HTML
        start "" "index.html"
        goto end
    ) else (
        set python_cmd=python3
    )
) else (
    set python_cmd=python
)

:: 使用Python启动HTTP服务器
echo 正在端口8000上启动HTTP服务器...
echo 请使用浏览器访问: http://localhost:8000
echo.
echo 如需通过TronLink钱包访问，请使用TronLink内置浏览器打开
echo 如果遇到问题，请查看控制台日志
echo.
start "" http://localhost:8000
%python_cmd% -m http.server 8000 2>%log_file%

:end
echo.
echo 按任意键退出...
pause > nul 