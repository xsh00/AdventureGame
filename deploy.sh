#!/bin/bash
# AdventureGame 自动部署脚本

echo "🚀 开始构建 AdventureGame..."

# 清理旧的构建产物
echo "🧹 清理旧的构建产物..."
rm -rf dist

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"

    # 复制到 Reverie 游戏目录
    echo "📦 部署到 Reverie..."
    cp dist/index.html ../Reverie/public/games/adventure-game-vue/index.html

    # 清理 Reverie 中的旧 assets 目录
    rm -rf ../Reverie/public/games/adventure-game-vue/assets

    echo "🎉 部署完成！"
    echo "📄 游戏已打包为单一HTML文件: $(du -h dist/index.html | cut -f1)"
    echo "📁 已复制到: ../Reverie/public/games/adventure-game-vue/index.html"
else
    echo "❌ 构建失败！"
    exit 1
fi