@echo off
echo 正在修复并重新部署 AdventureGame...

cd /d "E:\code\AdventureGame"

echo.
echo [1/4] 重新构建项目...
call npm run build
if errorlevel 1 (
    echo 构建失败!
    pause
    exit /b 1
)

echo.
echo [2/4] 检查构建产物...
if not exist "dist\index.html" (
    echo 错误: dist\index.html 不存在!
    pause
    exit /b 1
)

if not exist "dist\assets" (
    echo 错误: dist\assets 目录不存在!
    pause
    exit /b 1
)

echo.
echo [3/4] 复制文件到 Reverie 游戏目录...
set DEST_DIR="e:\code\Reverie\public\games\adventure-game-vue"

if not exist %DEST_DIR% (
    echo 创建目标目录: %DEST_DIR%
    mkdir %DEST_DIR%
)

echo 复制 index.html...
copy "dist\index.html" %DEST_DIR%\ >nul

echo 复制 assets 目录...
if exist "%DEST_DIR%\assets" rmdir /s /q "%DEST_DIR%\assets"
mkdir "%DEST_DIR%\assets"
copy "dist\assets\*" "%DEST_DIR%\assets\" >nul

echo.
echo [4/4] 验证部署结果...
if exist "%DEST_DIR%\index.html" (
    echo ✓ index.html 部署成功
) else (
    echo ✗ index.html 部署失败
)

if exist "%DEST_DIR%\assets\*.js" (
    echo ✓ JavaScript 文件部署成功
) else (
    echo ✗ JavaScript 文件部署失败
)

if exist "%DEST_DIR%\assets\*.css" (
    echo ✓ CSS 文件部署成功
) else (
    echo ✗ CSS 文件部署失败
)

echo.
echo 🎉 部署完成!
echo.
echo 请执行以下步骤:
echo 1. 刷新 Reverie 页面 (Ctrl+Shift+R 硬刷新)
echo 2. 重新点击进入游戏
echo 3. 游戏应该在5秒内加载完成并显示游戏界面
echo.
echo 如果仍有问题,请查看浏览器控制台错误信息。

pause