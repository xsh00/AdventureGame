# 部署修复脚本

## 问题分析
游戏资源文件(CSS/JS)返回404错误,原因是之前构建时使用了绝对路径,在iframe环境中无法正确加载。

## 已修复
- ✅ 配置vite使用相对路径 (`base: './'`)
- ✅ 重新构建生成正确的资源路径
- ✅ HTML中现在使用 `./assets/` 相对路径

## 重新部署步骤

### 1. 检查构建产物
```bash
cd E:\code\AdventureGame
ls -la dist/
```
应该看到:
- index.html
- assets/index-CKcDSxbv.js
- assets/index-CZ1ipTsr.css

### 2. 复制文件到Reverie
将 `E:\code\AdventureGame\dist\` 目录下的所有文件复制到:
```
e:\code\Reverie\public\games\adventure-game-vue\
```

确保目录结构是:
```
e:\code\Reverie\public\games\adventure-game-vue\
├── index.html
└── assets\
    ├── index-CKcDSxbv.js
    └── index-CZ1ipTsr.css
```

### 3. 验证数据库配置
确认games表中的记录:
```sql
SELECT * FROM games WHERE id = 'adventure-game-vue';
```

`game_url` 应该是: `/games/adventure-game-vue/index.html`

### 4. 清除浏览器缓存
- 硬刷新页面 (Ctrl+Shift+R)
- 或清除浏览器缓存

## 预期结果
修复后,游戏应该能正常加载,5秒后显示:
- "已切换到离线模式,游戏可以正常进行!"
- 游戏标题: "神秘森林冒险"
- 状态栏显示: 生命值、金币、经验等
- 四个选择按钮: 探索森林、寻找村庄、询问AI、保存进度

## 如果问题仍然存在
请检查:
1. 文件是否完全复制到正确位置
2. Web服务器是否能访问到这些文件
3. 浏览器开发者工具Network选项卡,查看具体哪些资源404

## 测试命令
```bash
# 1. 构建最新版本
cd E:\code\AdventureGame
npm run build

# 2. 检查构建产物
cat dist/index.html | grep assets

# 应该看到类似输出:
# <script type="module" crossorigin src="./assets/index-CKcDSxbv.js"></script>
# <link rel="stylesheet" crossorigin href="./assets/index-CZ1ipTsr.css">
```

## 常见问题

**Q: 为什么会出现这个问题?**
A: Vite默认构建时假设应用部署在根目录,使用绝对路径。但在Reverie的iframe环境中,游戏在子目录中,需要相对路径。

**Q: 修复后会影响本地开发吗?**
A: 不会。`npm run dev` 仍然正常工作,只影响生产构建。

**Q: 如何验证修复是否生效?**
A: 游戏加载后应该立即显示游戏界面,而不是"正在加载游戏"的状态。

---

**重新部署后,游戏应该能正常运行!** 🎮✨