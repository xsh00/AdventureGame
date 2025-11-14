# 神秘森林冒险 - Adventure Game

一个基于Vue 3 + TypeScript开发的AI驱动文字冒险游戏,完全兼容Reverie游戏平台。

## 功能特性

### 🎮 核心游戏玩法
- **森林探索** - 随机遭遇各种事件(宝藏、敌人、商人、休息点)
- **战斗系统** - 回合制战斗,包含攻击、使用物品、逃跑选项
- **村庄系统** - 商店购物、旅馆休息、图书馆学习技能
- **角色成长** - 经验升级、学习技能、收集装备

### 🤖 AI集成
- **Reverie平台集成** - 完全支持Reverie游戏区API
- **AI助手** - 为冒险和战斗提供智能建议
- **离线模式** - 无需AI也能畅玩游戏

### 💾 数据管理
- **自动存档** - 支持游戏进度保存和加载
- **状态同步** - 实时显示玩家状态(生命、金币、经验)
- **物品管理** - 完整的背包和技能系统

### 📱 响应式设计
- **全屏适配** - 完美适配PC、平板、手机
- **优雅动画** - 流畅的过渡效果
- **友好UI** - 清晰的视觉反馈

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全
- **Pinia** - 状态管理
- **Vite** - 快速构建工具
- **Reverie SDK** - 游戏平台集成

## 项目结构

```
AdventureGame/
├── src/
│   ├── components/          # Vue组件
│   │   ├── StatusBar.vue   # 状态栏
│   │   ├── StoryArea.vue   # 故事区域
│   │   └── ControlBar.vue  # 控制栏
│   ├── composables/         # 组合式函数
│   │   └── useGameActions.ts  # 游戏核心逻辑
│   ├── stores/              # Pinia状态管理
│   │   └── game.ts          # 游戏状态
│   ├── types/               # TypeScript类型定义
│   │   └── game.ts          # 游戏类型
│   ├── utils/               # 工具函数
│   │   └── reverieSDK.ts   # Reverie SDK封装
│   ├── App.vue              # 主应用组件
│   └── main.ts              # 入口文件
├── index.html               # HTML模板
├── package.json             # 项目配置
├── vite.config.ts          # Vite配置
└── tsconfig.json           # TypeScript配置
```

## 快速开始

### 安装依赖

```bash
cd E:\code\AdventureGame
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
```

构建产物在 `dist/` 目录

### 预览构建

```bash
npm run preview
```

## 游戏说明

### 基础操作

- **探索森林** - 发现随机事件和战利品
- **寻找村庄** - 购买物品、休息恢复、学习技能
- **询问AI** - 获取智能游戏建议
- **保存/加载** - 管理游戏进度

### 战斗系统

遇到敌人时进入战斗:
- **攻击** - 对敌人造成伤害
- **使用物品** - 恢复生命值
- **逃跑** - 尝试逃离战斗
- **询问AI** - 获取战斗策略建议

### 角色成长

- **经验升级** - 击败敌人获得经验值,每100经验升1级
- **学习技能** - 在图书馆用经验学习新技能
- **购买装备** - 在商店购买武器和防具提升能力

### 物品系统

- **生命药水** - 恢复50点生命值
- **面包** - 恢复25点生命值
- **浆果** - 恢复15点生命值
- **铁剑** - 提升攻击力
- **皮甲** - 提升防御力

## Reverie平台集成

### 游戏部署到Reverie

1. 构建生产版本:
```bash
npm run build
```

2. 将 `dist/` 目录上传到Reverie游戏目录

3. 在Reverie数据库注册游戏:
```sql
INSERT INTO games (id, name, description, cover_image, game_url, credits_per_play, is_active)
VALUES (
    'adventure-game-vue',
    '神秘森林冒险(Vue版)',
    '一个AI驱动的文字冒险游戏',
    '/images/game-covers/adventure-game.jpg',
    '/games/adventure-game-vue/index.html',
    0,
    true
);
```

### API集成说明

游戏使用以下Reverie API:

- **LLM调用** - `POST /api/game/llm-proxy` - AI对话
- **保存数据** - `POST /api/game/save-data` - 存档保存
- **加载数据** - `POST /api/game/load-data` - 存档加载
- **检查积分** - `POST /api/user/check-credits` - 积分查询

详见 [Reverie游戏开发文档](../Reverie/docs/Game/game-development-guide.md)

## 开发指南

### 添加新事件

在 `src/composables/useGameActions.ts` 的 `exploreForest()` 函数中添加新的 `GameEvent`:

```typescript
const events: GameEvent[] = [
  // 现有事件...
  {
    type: 'treasure',
    text: '你发现了新宝藏!',
    gold: 30,
    exp: 20,
    item: '新物品'
  }
]
```

### 添加新敌人

在 `startCombat()` 函数的 `enemies` 对象中添加:

```typescript
const enemies: Record<string, Enemy> = {
  // 现有敌人...
  dragon: {
    name: '巨龙',
    health: 100,
    maxHealth: 100,
    attack: 20,
    defense: 5,
    exp: 50,
    gold: 100
  }
}
```

### 添加新技能

在 `visitLibrary()` 中添加新选项:

```typescript
gameStore.setChoices([
  // 现有技能...
  { text: '🔮 学习新技能', action: 'learn_new_skill' }
])
```

## 游戏特色

### 🌟 完善的游戏循环
- 探索 → 战斗 → 升级 → 购物 → 探索

### 🎨 精美的UI设计
- 渐变配色方案
- 流畅动画效果
- 响应式布局

### 🧠 智能AI助手
- 根据游戏状态提供建议
- 战斗策略分析
- 离线模式兜底

### 💡 开发亮点

- **TypeScript** - 完整的类型安全
- **Composable模式** - 可复用的游戏逻辑
- **Pinia状态管理** - 清晰的数据流
- **响应式设计** - 移动端友好

## 调试技巧

### 查看游戏状态

打开浏览器控制台:
```javascript
// 查看Pinia store
$pinia.state.value.game

// 查看SDK状态
reverieSDK.getConnectionStatus()
```

### 启用详细日志

SDK自动记录所有postMessage通信:
- 🎮 发送消息
- 📨 接收消息
- ✅ 连接成功
- ❌ 错误信息

## 常见问题

### Q: 游戏无法连接到Reverie?
A: 游戏会在5秒后自动切换到离线模式,可以正常游玩。

### Q: 如何重置游戏?
A: 点击"🔄 重新开始"按钮即可重置游戏。

### Q: 存档保存在哪里?
A: 存档保存在Reverie平台的数据库中,通过API同步。

### Q: 可以添加更多敌人和物品吗?
A: 可以!参考开发指南部分的说明进行扩展。

## 待优化项

- [ ] 添加更多敌人类型
- [ ] 实现更复杂的技能系统
- [ ] 添加成就系统
- [ ] 增加背景音效
- [ ] 支持多语言
- [ ] 添加剧情任务线

## 贡献

欢迎提交Issue和Pull Request!

## 许可证

MIT License

## 联系方式

- 项目地址: E:\code\AdventureGame
- 参考文档: docs\Game\game-development-guide.md

---

**祝你在神秘森林中冒险愉快!** 🗡️🌲✨
