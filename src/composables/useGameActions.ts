import { useGameStore } from '@/stores/game'
import type { Enemy, GameEvent } from '@/types/game'
import { reverieSDK } from '@/utils/reverieSDK'

export function useGameActions() {
  const gameStore = useGameStore()

  // 处理选择
  const handleChoice = async (action: string) => {
    switch (action) {
      case 'explore_forest':
        await exploreForest()
        break
      case 'find_village':
        findVillage()
        break
      case 'ask_ai':
        await askAI()
        break
      case 'save':
        await saveGame()
        break
      case 'attack':
        await playerAttack()
        break
      case 'use_item':
        useItemInCombat()
        break
      case 'try_flee':
        await tryFlee()
        break
      case 'ask_ai_combat':
        await askAICombat()
        break
      case 'enter_shop':
        enterShop()
        break
      case 'rest_inn':
        restInn()
        break
      case 'visit_library':
        visitLibrary()
        break
      case 'buy_potion':
        buyItem('生命药水', 30)
        break
      case 'buy_bread':
        buyItem('面包', 10)
        break
      case 'buy_sword':
        buyItem('铁剑', 50)
        break
      case 'buy_armor':
        buyItem('皮甲', 40)
        break
      case 'learn_healing':
        learnSkill('治疗术', 50, '战斗中可以自动恢复少量生命值')
        break
      case 'learn_sword':
        learnSkill('剑术精通', 80, '提升所有攻击的伤害')
        break
      case 'learn_defense':
        learnSkill('防御精通', 70, '减少受到的所有伤害')
        break
      case 'learn_scout':
        learnSkill('侦察术', 60, '更容易发现宝藏和稀有物品')
        break
      default:
        console.warn('未知的选择:', action)
    }
  }

  // 探索森林
  const exploreForest = async () => {
    gameStore.setStoryText('🌲 你深入森林,周围的树木越来越茂密...')

    const events: GameEvent[] = [
      {
        type: 'treasure',
        text: '你发现了一个闪闪发光的宝箱!',
        gold: 20,
        exp: 10,
        item: '金币袋'
      },
      {
        type: 'enemy',
        text: '一只野生的史莱姆出现了!',
        enemy: 'slime'
      },
      {
        type: 'loot',
        text: '你找到了一些野生浆果。',
        item: '浆果',
        health: 10
      },
      {
        type: 'enemy',
        text: '一只凶猛的野狼挡住了你的去路!',
        enemy: 'wolf'
      },
      {
        type: 'shop',
        text: '你发现了一个神秘的商人!',
        shop: true
      },
      {
        type: 'rest',
        text: '你找到了一个安全的休息点。',
        rest: true
      }
    ]

    const randomEvent = events[Math.floor(Math.random() * events.length)]

    setTimeout(() => {
      gameStore.setStoryText(`🌲 森林探索结果:\n\n${randomEvent.text}\n\n你想要做什么?`)

      if (randomEvent.type === 'treasure') {
        gameStore.updatePlayerStats({
          gold: gameStore.gameData.playerStats.gold + (randomEvent.gold || 0),
          experience: gameStore.gameData.playerStats.experience + (randomEvent.exp || 0)
        })
        if (randomEvent.item) {
          gameStore.addItem(randomEvent.item)
        }
        gameStore.setChoices([
          { text: '🗡️ 继续冒险', action: 'explore_forest' },
          { text: '🤖 询问AI下一步建议', action: 'ask_ai' },
          { text: '💾 保存进度', action: 'save' },
          { text: '🏠 回到村庄', action: 'find_village' }
        ])
      } else if (randomEvent.type === 'enemy') {
        const enemies: Record<string, Enemy> = {
          slime: {
            name: '史莱姆',
            health: 30,
            maxHealth: 30,
            attack: 8,
            defense: 2,
            exp: 15,
            gold: 10
          },
          wolf: {
            name: '野狼',
            health: 50,
            maxHealth: 50,
            attack: 12,
            defense: 3,
            exp: 25,
            gold: 20
          }
        }
        const enemy = enemies[randomEvent.enemy!]
        startCombat(enemy)
      } else if (randomEvent.type === 'loot') {
        if (randomEvent.item) {
          gameStore.addItem(randomEvent.item)
        }
        if (randomEvent.health) {
          const newHealth = Math.min(
            gameStore.gameData.playerStats.maxHealth,
            gameStore.gameData.playerStats.health + randomEvent.health
          )
          gameStore.updatePlayerStats({ health: newHealth })
        }
        gameStore.setChoices([
          { text: '🔍 继续探索', action: 'explore_forest' },
          { text: '🏠 回到村庄', action: 'find_village' },
          { text: '🤖 询问AI', action: 'ask_ai' }
        ])
      } else if (randomEvent.type === 'shop') {
        findMerchant()
      } else if (randomEvent.type === 'rest') {
        restInForest()
      }
    }, 1500)
  }

  // 寻找村庄
  const findVillage = () => {
    gameStore.setStoryText(`
      🏠 你找到了一个小村庄!

      村民们看起来很友善,这里有:
      - 🏪 商店(可以买卖物品)
      - 🏨 旅馆(可以恢复生命值)
      - 📚 图书馆(可以学习新技能)

      当前金币: ${gameStore.gameData.playerStats.gold}
    `)

    gameStore.setChoices([
      { text: '🏪 进入商店', action: 'enter_shop' },
      { text: '🏨 去旅馆休息', action: 'rest_inn' },
      { text: '📚 参观图书馆', action: 'visit_library' },
      { text: '🌲 离开村庄', action: 'explore_forest' }
    ])
  }

  // 发现商人
  const findMerchant = () => {
    gameStore.setStoryText(`
      🧙‍♂️ 你遇到了一个神秘的商人!

      他有很多有趣的物品可以出售:
      - ⚗️ 生命药水 (30金币)
      - 🗡️ 铁剑 (50金币)
      - 🛡️ 皮甲 (40金币)
      - 🍞 面包 (10金币)

      当前金币: ${gameStore.gameData.playerStats.gold}
    `)

    gameStore.setChoices([
      { text: '⚗️ 购买生命药水', action: 'buy_potion' },
      { text: '🗡️ 购买铁剑', action: 'buy_sword' },
      { text: '🛡️ 购买皮甲', action: 'buy_armor' },
      { text: '🍞 购买面包', action: 'buy_bread' },
      { text: '❌ 离开', action: 'explore_forest' }
    ])
  }

  // 在森林中休息
  const restInForest = () => {
    const healAmount = Math.floor(gameStore.gameData.playerStats.maxHealth * 0.3)
    const newHealth = Math.min(
      gameStore.gameData.playerStats.maxHealth,
      gameStore.gameData.playerStats.health + healAmount
    )
    gameStore.updatePlayerStats({ health: newHealth })

    gameStore.setStoryText(`🌿 你在安全的休息点恢复了 ${healAmount} 点生命值!`)

    gameStore.setChoices([
      { text: '🔍 继续探索', action: 'explore_forest' },
      { text: '🏠 回到村庄', action: 'find_village' },
      { text: '🤖 询问AI', action: 'ask_ai' }
    ])
  }

  // 开始战斗
  const startCombat = (enemy: Enemy) => {
    gameStore.startCombat(enemy)
    gameStore.setStoryText(`⚔️ 战斗开始!你遇到了 ${enemy.name}!`)

    setTimeout(() => {
      showCombatInterface()
    }, 1000)
  }

  // 显示战斗界面
  const showCombatInterface = () => {
    const enemy = gameStore.gameData.currentEnemy!
    gameStore.setStoryText(`
      ⚔️ 战斗进行中!

      敌人: ${enemy.name}
      💚 生命值: ${enemy.health}/${enemy.maxHealth}

      你的生命值: ${gameStore.gameData.playerStats.health}/${gameStore.gameData.playerStats.maxHealth}
    `)

    gameStore.setChoices([
      { text: '⚔️ 攻击', action: 'attack' },
      { text: '🛡️ 使用物品', action: 'use_item' },
      { text: '🏃 尝试逃跑', action: 'try_flee' },
      { text: '🤖 询问AI战斗建议', action: 'ask_ai_combat' }
    ])
  }

  // 玩家攻击
  const playerAttack = async () => {
    const enemy = gameStore.gameData.currentEnemy!
    const playerDamage = Math.max(1, 15 - enemy.defense + Math.floor(Math.random() * 10))
    enemy.health = Math.max(0, enemy.health - playerDamage)

    gameStore.setStoryText(`⚔️ 你攻击了 ${enemy.name},造成 ${playerDamage} 点伤害!`)

    if (enemy.health <= 0) {
      setTimeout(() => winCombat(), 1500)
    } else {
      setTimeout(() => enemyAttack(), 1500)
    }
  }

  // 敌人攻击
  const enemyAttack = () => {
    const enemy = gameStore.gameData.currentEnemy!
    const enemyDamage = Math.max(1, enemy.attack + Math.floor(Math.random() * 8) - 2)
    const newHealth = Math.max(0, gameStore.gameData.playerStats.health - enemyDamage)
    gameStore.updatePlayerStats({ health: newHealth })

    gameStore.setStoryText(`💥 ${enemy.name} 攻击了你,造成 ${enemyDamage} 点伤害!`)

    if (newHealth <= 0) {
      setTimeout(() => loseCombat(), 1500)
    } else {
      setTimeout(() => showCombatInterface(), 1500)
    }
  }

  // 战斗胜利
  const winCombat = () => {
    const enemy = gameStore.gameData.currentEnemy!
    gameStore.updatePlayerStats({
      gold: gameStore.gameData.playerStats.gold + enemy.gold,
      experience: gameStore.gameData.playerStats.experience + enemy.exp
    })

    const leveledUp = gameStore.checkLevelUp()

    gameStore.endCombat()

    let text = `🏆 你击败了 ${enemy.name}!\n\n获得 ${enemy.gold} 金币和 ${enemy.exp} 经验值!`
    if (leveledUp) {
      text += `\n\n⭐ 恭喜升级!你现在是等级 ${gameStore.gameData.playerStats.level}!`
    }

    gameStore.setStoryText(text)

    gameStore.setChoices([
      { text: '🔍 继续探索', action: 'explore_forest' },
      { text: '🏠 回到村庄', action: 'find_village' },
      { text: '🤖 询问AI下一步建议', action: 'ask_ai' }
    ])
  }

  // 战斗失败
  const loseCombat = () => {
    gameStore.setStoryText('💀 你被击败了!失去了一些金币...')

    const newGold = Math.max(0, gameStore.gameData.playerStats.gold - 20)
    const newHealth = Math.floor(gameStore.gameData.playerStats.maxHealth * 0.5)
    gameStore.updatePlayerStats({
      gold: newGold,
      health: newHealth
    })

    gameStore.endCombat()

    gameStore.setChoices([
      { text: '🏠 回到村庄', action: 'find_village' },
      { text: '💾 保存游戏', action: 'save' }
    ])
  }

  // 尝试逃跑
  const tryFlee = async () => {
    const success = Math.random() > 0.3

    if (success) {
      gameStore.endCombat()
      gameStore.setStoryText('🏃 你成功逃跑了!')

      gameStore.setChoices([
        { text: '🌲 继续探索', action: 'explore_forest' },
        { text: '🏠 回到村庄', action: 'find_village' }
      ])
    } else {
      gameStore.setStoryText('🏃 逃跑失败!')
      setTimeout(() => enemyAttack(), 1000)
    }
  }

  // 战斗中使用物品
  const useItemInCombat = () => {
    const usableItems = gameStore.gameData.inventory.filter((item) =>
      ['浆果', '面包', '生命药水'].includes(item)
    )

    if (usableItems.length === 0) {
      gameStore.setStoryText('❌ 你没有可用的物品!')
      setTimeout(() => showCombatInterface(), 1000)
      return
    }

    gameStore.setStoryText(`🎒 可用物品:${usableItems.join(', ')}\n\n选择要使用的物品:`)

    // 简化处理 - 使用第一个可用物品
    const item = usableItems[0]
    const healAmount = item === '生命药水' ? 50 : item === '面包' ? 25 : 15

    const newHealth = Math.min(
      gameStore.gameData.playerStats.maxHealth,
      gameStore.gameData.playerStats.health + healAmount
    )
    gameStore.updatePlayerStats({ health: newHealth })
    gameStore.removeItem(item)

    gameStore.setStoryText(`🧪 你使用了${item},恢复了 ${healAmount} 点生命值!`)

    setTimeout(() => enemyAttack(), 1000)
  }

  // 进入商店
  const enterShop = () => {
    gameStore.setStoryText(`
      🏪 欢迎来到村庄商店!

      店主:冒险者,你需要什么?

      可购买物品:
      - ⚗️ 生命药水 (30金币) - 恢复50点生命值
      - 🍞 面包 (10金币) - 恢复25点生命值
      - 🔥 铁剑 (50金币) - 提升攻击力
      - 🛡️ 皮甲 (40金币) - 提升防御力

      当前金币: ${gameStore.gameData.playerStats.gold}
    `)

    gameStore.setChoices([
      { text: '⚗️ 购买生命药水', action: 'buy_potion' },
      { text: '🍞 购买面包', action: 'buy_bread' },
      { text: '🗡️ 购买铁剑', action: 'buy_sword' },
      { text: '🛡️ 购买皮甲', action: 'buy_armor' },
      { text: '❌ 离开商店', action: 'find_village' }
    ])
  }

  // 购买物品
  const buyItem = (itemName: string, price: number) => {
    if (gameStore.gameData.playerStats.gold >= price) {
      gameStore.updatePlayerStats({
        gold: gameStore.gameData.playerStats.gold - price
      })
      gameStore.addItem(itemName)

      let message = `✅ 成功购买 ${itemName}!`
      if (itemName.includes('剑')) {
        message += '\n🗡️ 你的攻击力提升了!'
      } else if (itemName.includes('甲')) {
        message += '\n🛡️ 你的防御力提升了!'
      }

      gameStore.setStoryText(message)

      gameStore.setChoices([
        { text: '💰 继续购物', action: 'enter_shop' },
        { text: '🏠 回到村庄', action: 'find_village' }
      ])
    } else {
      gameStore.setStoryText('❌ 金币不足!')
      gameStore.setChoices([
        { text: '💰 继续购物', action: 'enter_shop' },
        { text: '🏠 回到村庄', action: 'find_village' }
      ])
    }
  }

  // 在旅馆休息
  const restInn = () => {
    const cost = 20

    if (gameStore.gameData.playerStats.gold >= cost) {
      gameStore.updatePlayerStats({
        gold: gameStore.gameData.playerStats.gold - cost,
        health: gameStore.gameData.playerStats.maxHealth
      })

      gameStore.setStoryText(`🏨 你在旅馆休息了一夜,完全恢复了生命值!\n\n花费: ${cost} 金币`)

      gameStore.setChoices([
        { text: '🌲 继续冒险', action: 'explore_forest' },
        { text: '🏠 留在村庄', action: 'find_village' }
      ])
    } else {
      gameStore.setStoryText(
        `❌ 住宿需要 ${cost} 金币,但你只有 ${gameStore.gameData.playerStats.gold} 金币。`
      )

      gameStore.setChoices([
        { text: '💰 继续赚钱', action: 'explore_forest' },
        { text: '🏠 回到村庄', action: 'find_village' }
      ])
    }
  }

  // 参观图书馆
  const visitLibrary = () => {
    gameStore.setStoryText(`
      📚 欢迎来到村庄图书馆!

      图书管理员:这里有一些技能书籍可以学习:

      可学习技能:
      - 📖 治疗术 (50经验) - 自动恢复生命值
      - ⚔️ 剑术精通 (80经验) - 提升攻击伤害
      - 🛡️ 防御精通 (70经验) - 减少受到的伤害
      - 🔍 侦察术 (60经验) - 发现更多宝藏

      当前经验: ${gameStore.gameData.playerStats.experience}
      已学技能: ${gameStore.gameData.skills.length > 0 ? gameStore.gameData.skills.join(', ') : '无'}
    `)

    gameStore.setChoices([
      { text: '📖 学习治疗术', action: 'learn_healing' },
      { text: '⚔️ 学习剑术精通', action: 'learn_sword' },
      { text: '🛡️ 学习防御精通', action: 'learn_defense' },
      { text: '🔍 学习侦察术', action: 'learn_scout' },
      { text: '❌ 离开图书馆', action: 'find_village' }
    ])
  }

  // 学习技能
  const learnSkill = (skillName: string, cost: number, description: string) => {
    if (
      gameStore.gameData.playerStats.experience >= cost &&
      !gameStore.hasSkill(skillName)
    ) {
      gameStore.updatePlayerStats({
        experience: gameStore.gameData.playerStats.experience - cost
      })
      gameStore.addSkill(skillName)

      gameStore.setStoryText(`✅ 你学会了 ${skillName}!\n\n${description}`)

      gameStore.setChoices([
        { text: '📚 继续学习', action: 'visit_library' },
        { text: '🌲 继续冒险', action: 'explore_forest' }
      ])
    } else if (gameStore.hasSkill(skillName)) {
      gameStore.setStoryText('❌ 你已经学会了这个技能!')
      gameStore.setChoices([
        { text: '📚 继续学习', action: 'visit_library' },
        { text: '🌲 继续冒险', action: 'explore_forest' }
      ])
    } else {
      gameStore.setStoryText(`❌ 经验不足!需要 ${cost} 经验值。`)
      gameStore.setChoices([
        { text: '📚 继续学习', action: 'visit_library' },
        { text: '🌲 继续冒险', action: 'explore_forest' }
      ])
    }
  }

  // 询问AI
  const askAI = async () => {
    gameStore.aiStatus = '思考中...'
    gameStore.setStoryText('🤖 正在咨询AI助手,请稍候...')

    // 离线模式
    if (gameStore.offlineMode) {
      setTimeout(() => {
        handleOfflineAI()
      }, 1500)
      return
    }

    try {
      const response = await reverieSDK.callLLM({
        messages: [
          {
            role: 'system',
            content: '你是一个文字冒险游戏的AI助手,为玩家提供有趣和有用的建议。请用简洁但富有想象力的语言回应。'
          },
          {
            role: 'user',
            content: `我在玩一个森林冒险游戏。当前状态:
            生命值: ${gameStore.gameData.playerStats.health}/${gameStore.gameData.playerStats.maxHealth}
            金币: ${gameStore.gameData.playerStats.gold}
            经验: ${gameStore.gameData.playerStats.experience} (等级 ${gameStore.gameData.playerStats.level})
            物品: ${gameStore.gameData.inventory.join(', ')}

            我现在应该做什么?请给我一些建议。`
          }
        ],
        temperature: 0.8,
        maxTokens: 200
      })

      gameStore.aiStatus = '就绪'

      if (response.success && response.data) {
        const aiMessage = response.data.choices[0].message.content
        gameStore.setStoryText(`🤖 AI助手的建议:\n\n${aiMessage}`)

        gameStore.setChoices([
          { text: '🌲 继续探索森林', action: 'explore_forest' },
          { text: '🏠 寻找村庄', action: 'find_village' },
          { text: '💾 保存游戏', action: 'save' }
        ])
      }
    } catch (error: any) {
      gameStore.aiStatus = '就绪'
      gameStore.showError('AI咨询失败: ' + error.message)

      // 切换到离线模式
      handleOfflineAI()
    }
  }

  // 离线AI建议
  const handleOfflineAI = () => {
    gameStore.aiStatus = '就绪'

    const healthPercent =
      (gameStore.gameData.playerStats.health / gameStore.gameData.playerStats.maxHealth) * 100
    const offlineSuggestions = []

    if (healthPercent < 30) {
      offlineSuggestions.push('💊 你的生命值很低,建议先购买一些恢复物品。')
    }
    if (gameStore.gameData.playerStats.gold < 20) {
      offlineSuggestions.push('💰 你的金币不多,可以去探索森林寻找宝藏。')
    }
    if (gameStore.gameData.playerStats.experience < 50) {
      offlineSuggestions.push('⚔️ 建议多参与战斗来获取经验值。')
    }
    if (!gameStore.hasItem('生命药水')) {
      offlineSuggestions.push('🧪 生命药水在战斗中很有用,建议购买一些。')
    }

    if (offlineSuggestions.length === 0) {
      offlineSuggestions.push('🌟 你的状态看起来不错!继续探索森林,寻找更多冒险吧!')
      offlineSuggestions.push('🏠 也可以去村庄休息或学习新技能。')
    }

    const suggestionText = offlineSuggestions.join('\n\n')
    gameStore.setStoryText(`🤖 离线AI助手建议:\n\n${suggestionText}`)

    gameStore.setChoices([
      { text: '🌲 继续探索森林', action: 'explore_forest' },
      { text: '🏠 寻找村庄', action: 'find_village' },
      { text: '💾 保存游戏', action: 'save' }
    ])
  }

  // 战斗AI建议
  const askAICombat = async () => {
    gameStore.aiStatus = '思考中...'
    gameStore.setStoryText('🤖 正在咨询AI战斗策略,请稍候...')

    // 离线模式
    if (gameStore.offlineMode) {
      setTimeout(() => {
        handleOfflineCombatAI()
      }, 1500)
      return
    }

    try {
      const enemy = gameStore.gameData.currentEnemy!
      const response = await reverieSDK.callLLM({
        messages: [
          {
            role: 'system',
            content: '你是一个文字冒险游戏的AI战斗顾问,为玩家提供战斗策略建议。'
          },
          {
            role: 'user',
            content: `我在战斗中遇到了 ${enemy.name}。敌人生命值: ${enemy.health}/${enemy.maxHealth},攻击力: ${enemy.attack}。

            我的状态:
            生命值: ${gameStore.gameData.playerStats.health}/${gameStore.gameData.playerStats.maxHealth}
            物品: ${gameStore.gameData.inventory.join(', ')}

            我应该采取什么战斗策略?请给出简洁的建议。`
          }
        ],
        temperature: 0.7,
        maxTokens: 150
      })

      gameStore.aiStatus = '就绪'

      if (response.success && response.data) {
        const aiMessage = response.data.choices[0].message.content
        gameStore.setStoryText(`🤖 AI战斗建议:\n\n${aiMessage}`)

        gameStore.setChoices([
          { text: '⚔️ 攻击', action: 'attack' },
          { text: '🛡️ 使用物品', action: 'use_item' },
          { text: '🏃 逃跑', action: 'try_flee' }
        ])
      }
    } catch (error: any) {
      gameStore.aiStatus = '就绪'
      handleOfflineCombatAI()
    }
  }

  // 离线战斗AI建议
  const handleOfflineCombatAI = () => {
    gameStore.aiStatus = '就绪'

    const enemy = gameStore.gameData.currentEnemy!
    const healthPercent =
      (gameStore.gameData.playerStats.health / gameStore.gameData.playerStats.maxHealth) * 100
    const combatSuggestions = []

    if (healthPercent < 25) {
      combatSuggestions.push('🚨 你的生命值很低!建议立即使用生命药水或逃跑!')
    } else if (enemy.health < 30) {
      combatSuggestions.push('⚔️ 敌人生命值很低了,继续攻击就可以获胜!')
    } else if (gameStore.hasItem('生命药水')) {
      combatSuggestions.push('🧪 建议在适当时机使用生命药水来恢复生命值。')
    } else {
      combatSuggestions.push('⚔️ 继续攻击,保持警惕!')
    }

    if (enemy.name === '史莱姆') {
      combatSuggestions.push('💡 史莱姆比较弱,但要注意它的反击!')
    } else if (enemy.name === '野狼') {
      combatSuggestions.push('🐺 野狼速度很快,要准备好应对连续攻击!')
    }

    const suggestionText = combatSuggestions.join('\n\n')
    gameStore.setStoryText(`🤖 离线战斗AI建议:\n\n${suggestionText}`)

    gameStore.setChoices([
      { text: '⚔️ 继续攻击', action: 'attack' },
      { text: '🛡️ 使用物品', action: 'use_item' },
      { text: '🏃 逃跑', action: 'try_flee' }
    ])
  }

  // 保存游戏
  const saveGame = async () => {
    gameStore.saveStatus = '保存中...'

    // 将Vue响应式对象转换为普通对象，避免序列化问题
    const saveData = {
      gameData: JSON.parse(JSON.stringify(gameStore.gameData)),
      timestamp: new Date().toISOString(),
      version: '1.0'
    }

    try {
      await reverieSDK.saveGame({
        saveKey: 'main_save',
        saveData: saveData
      })

      gameStore.saveStatus = '已保存'
      gameStore.showSuccess('游戏进度已保存!')
    } catch (error: any) {
      gameStore.saveStatus = '保存失败'
      gameStore.showError('保存失败: ' + error.message)
      throw error
    }
  }

  // 加载游戏
  const loadGame = async () => {
    gameStore.saveStatus = '加载中...'

    try {
      const response = await reverieSDK.loadGame({
        saveKey: 'main_save'
      })

      if (response.success && response.saveData) {
        gameStore.gameData = response.saveData.gameData
        gameStore.saveStatus = '已加载'

        if (gameStore.gameData.inCombat) {
          showCombatInterface()
        } else {
          showCurrentStatus()
        }
      } else {
        gameStore.saveStatus = '加载失败'
        throw new Error('没有找到存档')
      }
    } catch (error: any) {
      gameStore.saveStatus = '加载失败'
      throw error
    }
  }

  // 显示当前状态
  const showCurrentStatus = () => {
    gameStore.setStoryText(`
      当前状态:
      💚 生命值: ${gameStore.gameData.playerStats.health}/${gameStore.gameData.playerStats.maxHealth}
      💰 金币: ${gameStore.gameData.playerStats.gold}
      ⭐ 经验: ${gameStore.gameData.playerStats.experience} (等级 ${gameStore.gameData.playerStats.level})
      🎒 物品: ${gameStore.gameData.inventory.join(', ')}
      ${gameStore.gameData.skills.length > 0 ? '🔮 技能: ' + gameStore.gameData.skills.join(', ') : ''}
    `)

    gameStore.setChoices([
      { text: '🌲 继续探索', action: 'explore_forest' },
      { text: '🏠 回到村庄', action: 'find_village' },
      { text: '🤖 询问AI', action: 'ask_ai' }
    ])
  }

  // 检查积分
  const checkCredits = async () => {
    try {
      const response = await reverieSDK.checkCredits({
        creditCost: 0.1,
        purpose: 'llm'
      })

      return response
    } catch (error: any) {
      throw error
    }
  }

  return {
    handleChoice,
    saveGame,
    loadGame,
    checkCredits
  }
}
