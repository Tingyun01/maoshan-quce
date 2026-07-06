// ============================================================
// 🏮 场景问答引擎 — Scenario Q&A Engine
// 分支叙事 × 沉浸选择 × 多结局
// 每次选择都影响你的"道心"属性，最终汇成一个独特的你
// 一个场景有多条分支，分支之间相互交错，形成千变万化的体验
// ============================================================

/**
 * 场景冒险数据结构
 * {
 *   id: 'scenario_id',
 *   title: '场景标题',
 *   desc: '场景描述（吸引点击）',
 *   icon: '🎭',
 *   cover: 'cloud://...',      // 可选封面图
 *   startNode: 'node_id',      // 起始节点
 *   nodes: {                    // 节点映射
 *     'node_id': {
 *       story: '叙事文字...',   // 支持 {name} 占位符
 *       mood: 'dark|bright|tense|peaceful...',  // 可选的氛围标签
 *       choices: [
 *         { text: '选项文字', next: '下个节点', effects: { 属性: +/-分数 } }
 *       ]
 *     }
 *   },
 *   dims: ['道心','侠义',...],  // 本场景追踪的属性维度
 *   resultMapping: (effects) => 'typeCode',  // 属性→结果类型映射
 *   results: {                  // 各种结局
 *     'typeCode': { title, brief, rank, tagline, ... }
 *   }
 * }
 */


// ============================================================
// 场景库
// ============================================================

// 卡片珍藏图基础路径（用于结果页展示道教人物）
const CARD_BASE = 'cloud://cloudbase-d1gyu646q859d40e1.636c-cloudbase-d1gyu646q859d40e1-1447170647/cards/';

const SCENARIOS = {

  // ============ 场景一：鬼市奇遇 ============
  ghost_market: {
    id: 'ghost_market',
    title: '鬼市奇遇',
    desc: '深夜荒庙，阴风阵阵——你推开了那扇门，发现里面灯火通明...',
    icon: '👻',
    startNode: 'intro',
    dims: ['道心', '侠义', '慧根', '胆魄'],
    dimLabels: { '道心': '道心', '侠义': '侠义', '慧根': '慧根', '胆魄': '胆魄' },

    nodes: {
      intro: {
        story: '子时三刻，你路过一座荒废的山神庙。庙门半掩，里面却透出幽幽的绿光。\n\n一阵似哭似笑的声响从门缝中飘出。你的罗盘指针疯狂乱转——这庙里，"不干净"。',
        mood: 'dark',
        choices: [
          { text: '🔥 推开庙门，直面里面的东西', next: 'enter_temple', effects: { '胆魄': 3, '道心': 1 } },
          { text: '🧧 先在门框上贴一道镇鬼符，再推门', next: 'talisman_first', effects: { '道心': 2, '慧根': 1 } },
          { text: '👀 绕到侧面，从破窗偷看里面的情况', next: 'peek_window', effects: { '慧根': 2, '胆魄': -1 } }
        ]
      },

      enter_temple: {
        story: '你一脚踹开庙门——\n\n庙里竟摆着七八张方桌，一群"人"正在喝茶打牌。听到动静，他们齐刷刷转过头来。\n\n一个老妪开口："天师大人来得正好，三缺一，坐不坐？"\n\n你注意到，他们的脚——都离地三寸。',
        mood: 'tense',
        choices: [
          { text: '😤 "妖孽！贫道今日替天行道！"——直接开打', next: 'fight_ghosts', effects: { '胆魄': 3, '侠义': 2 } },
          { text: '😏 "行啊，输了可不许耍赖。"——坐下陪他们打牌', next: 'play_cards', effects: { '慧根': 3, '胆魄': 2 } },
          { text: '🤔 "在下路过此地，不知诸位有何冤情？"——先问清来路', next: 'ask_story', effects: { '道心': 3, '侠义': 1 } }
        ]
      },

      talisman_first: {
        story: '符纸贴上的瞬间，庙里传出一声闷哼。\n\n你推开门——里面七八个鬼魂正捂着头，看起来被你的符咒震得不轻。\n\n一个老妪揉着太阳穴："天师大人好狠的手，老身这把年纪，经不起这么折腾……"\n\n她看起来并无恶意，只是面色委屈。',
        mood: 'peaceful',
        choices: [
          { text: '🙏 "是在下鲁莽了——诸位因何滞留此地？"', next: 'ask_story', effects: { '道心': 3, '侠义': 1 } },
          { text: '😏 "谁让你们大半夜吓人——不过既然没事，陪你们喝杯茶？"', next: 'play_cards', effects: { '慧根': 2, '胆魄': 1 } },
          { text: '😤 "既然不是恶鬼，限你们三日内离开此庙！"', next: 'fight_ghosts', effects: { '侠义': -1, '胆魄': 2 } }
        ]
      },

      peek_window: {
        story: '你从破窗望进去——\n\n庙里一群鬼魂正在哭诉。老妪说："我孙女病重在床，我却连最后一面都见不到……"\n\n一个书生鬼叹道："我欠的债还没还，怎能安心去投胎？"\n\n他们在开"鬼魂互助会"——讨论各自的未了心愿。',
        mood: 'bright',
        choices: [
          { text: '🙏 推门进去："诸位的心愿，或许贫道能帮上忙"', next: 'ask_story', effects: { '侠义': 3, '道心': 2 } },
          { text: '😏 翻窗进去，坐在角落里默默旁听', next: 'play_cards', effects: { '慧根': 2, '胆魄': 1 } },
          { text: '🤔 继续偷听——多了解一点再决定怎么办', next: 'ask_story', effects: { '慧根': 1, '道心': 1 } }
        ]
      },

      ask_story: {
        story: '老妪叹了口气："老身姓刘，三年前病逝于此。我有个孙女，今年该出嫁了——老身答应过要送她一副银镯子……"\n\n书生鬼接着说："小生赶考途中遇匪，一命呜呼。家中老母还在等我，我连句告别都没来得及说。"\n\n他们不是恶鬼，只是一群——放心不下的普通人。',
        mood: 'peaceful',
        choices: [
          { text: '💍 "刘婆婆，银镯子的事我帮您办。"——成全他们的心愿', next: 'help_spirits', effects: { '侠义': 3, '道心': 2 } },
          { text: '📜 "诸位的冤情，我为你们写一份超度表文，送入地府"', next: 'transcend', effects: { '道心': 3, '慧根': 2 } },
          { text: '🤝 "这样吧——你们说的事我都记下，能办的先办，不能办的给你们烧纸带话"', next: 'help_spirits', effects: { '侠义': 1, '慧根': 2, '道心': 1 } }
        ]
      },

      play_cards: {
        story: '你坐下来跟鬼魂们打了一夜牌。\n\n老妪赢了你的铜钱，笑眯眯地说："天师大人牌品不错，老身就不为难你了。"\n\n书生鬼给你倒了杯茶（你假装喝了），说道："其实我们就是想找人聊聊天，太久没人来了。"\n\n天亮时分，他们起身告辞。老妪临走前塞给你一个香囊："这是老身孙女绣的，给天师大人留个念想。"',
        mood: 'bright',
        choices: [
          { text: '🎁 "多谢婆婆——诸位放心，你们的事我会记在心里"', next: 'help_spirits', effects: { '侠义': 2, '道心': 1 } },
          { text: '📿 为他们念一段往生咒，送他们最后一程', next: 'transcend', effects: { '道心': 3, '慧根': 1 } }
        ]
      },

      fight_ghosts: {
        story: '你一声怒喝，祭出法器——\n\n但奇怪的是，鬼魂们没有反击。他们只是躲闪着、哀嚎着、求饶着。\n\n老妪挡在书生鬼前面："天师要收就收老身，这些孩子都是可怜人！"\n\n你举着法器的右手，忽然僵在了半空中。',
        mood: 'tense',
        choices: [
          { text: '😔 放下法器："……说吧，你们到底有什么苦衷"', next: 'ask_story', effects: { '道心': 2, '侠义': 1 } },
          { text: '😤 "留你们一命可以，但必须离开此地，不得再扰凡人"', next: 'transcend', effects: { '侠义': -1, '胆魄': 2 } },
          { text: '🙏 收法入鞘，深深一揖："贫道冲动了，请诸位见谅"', next: 'help_spirits', effects: { '道心': 3, '侠义': 2 } }
        ]
      },

      help_spirits: {
        story: '你花了三天时间——\n\n帮刘婆婆的孙女送去银镯子（那姑娘哭得稀里哗啦），给书生鬼的老母带去一封家书，还帮其他几个鬼魂了了心愿。\n\n最后一天，鬼魂们在庙前向你告别。\n\n刘婆婆说："天师大人，你是好人。老身在地府也会替你祈福的。"\n\n他们化作点点萤光，消散在晨雾中。',
        mood: 'peaceful',
        choices: []  // 终章
      },

      transcend: {
        story: '你铺开黄纸，研墨挥毫——\n\n一篇超度表文写得情真意切："……诸魂虽为鬼类，心存善念，可悯可敬。愿冥府明察，许其早归轮回，再世为人。"\n\n念完最后一句咒语，庙中阴气尽散。阳光破窗而入。\n\n你低头——香案上不知何时多了一朵白色的小花。',
        mood: 'bright',
        choices: []  // 终章
      }
    },

    // 终章节点判定
    isEndNode(nodeId) {
      return nodeId === 'help_spirits' || nodeId === 'transcend';
    },

    // 属性→结局映射
    resultMapping(effects) {
      const daoxin = effects['道心'] || 0;
      const xiayi = effects['侠义'] || 0;
      const huigen = effects['慧根'] || 0;

      if (xiayi >= 6) return 'merciful';
      if (huigen >= 6) return 'wise';
      if (daoxin >= 6) return 'righteous';
      return 'balanced';
    },

    results: {
      merciful: {
        title: '慈悲天师',
        sum: '以善渡人，以心感化',
        brief: '你不是那种见了鬼就砍的天师。你相信世间万物皆有因果，与其消灭不如化解。你有一颗温柔的"道心"，这份慈悲，比法器更厉害。',
        rank: '大善·慈航真人',
        tagline: '别人降妖靠法力，我降妖靠——跟它讲道理',
        ratings: { '道心': 8, '侠义': 9, '慧根': 7, '胆魄': 5 },
        imageUrl: CARD_BASE + 'resized-40 山神福德正神.jpg'
      },
      wise: {
        title: '智谋天师',
        sum: '洞察一切，算无遗策',
        brief: '你不是那种上来就干的天师。你总是先观察、先判断、先看透。你相信真正的道行不是法术多强，而是能不能一眼看出鬼魂的"病根"。',
        rank: '上品·洞明真人',
        tagline: '我不打鬼——我先问它，你哪里不舒服',
        ratings: { '道心': 7, '侠义': 6, '慧根': 9, '胆魄': 6 },
        imageUrl: CARD_BASE + 'resized-39 太白金星.jpg'
      },
      righteous: {
        title: '正道天师',
        sum: '道心坚定，不可动摇',
        brief: '你把"道"字刻在骨子里。不偏不倚，不卑不亢。鬼魂怕你，凡人敬你。但这不意味着你不近人情——你只是知道什么时候该严，什么时候该宽。',
        rank: '一品·真人',
        tagline: '我不欺负好人，也不怕恶鬼——道心在此，万邪不侵',
        ratings: { '道心': 9, '侠义': 5, '慧根': 6, '胆魄': 8 },
        imageUrl: CARD_BASE + 'resized-37 钟馗天师.jpg'
      },
      balanced: {
        title: '逍遥天师',
        sum: '道法自然，随心而行',
        brief: '你大概是天师里最"佛系"的那个。遇到鬼——先喝杯茶再说。你说不清自己属于哪一派，但好像哪一派都跟你有点关系。也许这才是最高境界？',
        rank: '奇品·逍遥散人',
        tagline: '遇鬼喝茶，逢妖下棋——这届天师的休闲人生',
        ratings: { '道心': 6, '侠义': 6, '慧根': 6, '胆魄': 6 },
        imageUrl: CARD_BASE + 'resized-35 三茅真君.jpg'
      }
    }
  },

  // ============ 场景二：仙门考核 ============
  immortal_exam: {
    id: 'immortal_exam',
    title: '仙门考核',
    desc: '你终于等到了入仙门的机会——但考核的方式，远超你的想象...',
    icon: '🏔️',
    startNode: 'gate',
    dims: ['根骨', '悟性', '心性', '机缘'],
    dimLabels: { '根骨': '根骨', '悟性': '悟性', '心性': '心性', '机缘': '机缘' },

    nodes: {
      gate: {
        story: '你在大雪中跪了三天三夜，仙门终于开了。\n\n出来的是一位白胡子老道："想入仙门？先过三关。但——你只能选一关挑战，选错的话，这辈子别想再踏入修仙路。"\n\n他指了指身后三道门：\n· 第一道门，铁锈斑驳，门内传来金属碰撞声\n· 第二道门，藤蔓缠绕，门缝中透出书香\n· 第三道门，空无一物，只是一扇普通的木门',
        mood: 'tense',
        choices: [
          { text: '⚔️ 走铁门——实力说话，打就完了', next: 'iron_gate', effects: { '根骨': 3 } },
          { text: '📚 走藤门——智慧才是真正的修为', next: 'vine_gate', effects: { '悟性': 3 } },
          { text: '🚪 走木门——最简单的往往是最难的', next: 'wood_gate', effects: { '心性': 2, '机缘': 1 } }
        ]
      },

      iron_gate: {
        story: '门后是一个巨大的演武场。\n\n一个金甲巨人端坐中央，声如洪钟："击败我，你就是仙门弟子。但我提醒你——我在这里守了一千年，还没有人赢过。"\n\n他站起身来，足有三丈高。每走一步，大地都在颤。',
        mood: 'dark',
        choices: [
          { text: '💪 "打就打！"——正面硬刚', next: 'fight_giant', effects: { '根骨': 3, '心性': 1 } },
          { text: '🤔 "阁下守了一千年，想必功力深厚——但，你累了吧？"——心理战', next: 'talk_giant', effects: { '悟性': 2, '机缘': 1 } },
          { text: '🙏 "贫道不是来打架的——请问阁下，这一千年你寂寞吗？"', next: 'talk_giant', effects: { '心性': 3 } }
        ]
      },

      vine_gate: {
        story: '门后是一座漂浮在星海中的书阁。\n\n一位青衫书生正伏案疾书。抬头看你："来了？这里有九万卷书，每卷一个问题。你只需答出其中三卷——但你要自己找出，哪三卷才是考题。"\n\n九万卷书在书架间飞舞，如漫天星辰。',
        mood: 'peaceful',
        choices: [
          { text: '📖 "既然来了，我先全看一遍"——用笨办法', next: 'read_all', effects: { '悟性': 2, '根骨': 1 } },
          { text: '🔍 "考题必有规律——敢问先生，题目之间有何联系？"', next: 'find_pattern', effects: { '悟性': 3, '心性': 1 } },
          { text: '🌌 "我不找题——我闭上眼睛，凭直觉选三本"', next: 'intuition_pick', effects: { '机缘': 3, '悟性': 1 } }
        ]
      },

      wood_gate: {
        story: '推开木门，你发现——\n\n只是一间空屋子。四面白墙，一扇窗，一张蒲团。\n\n墙角贴着一张纸条："仙门考核第三关：在这间屋子里坐七天。不吃饭不喝水，不动不说话。你受得了吗？"',
        mood: 'peaceful',
        choices: [
          { text: '🧘 "区区七天而已"——盘腿坐下，入定', next: 'meditate', effects: { '心性': 3, '根骨': 1 } },
          { text: '🤔 "这考核有诈——七天不喝水会死的，一定另有玄机"——探索房间', next: 'explore_room', effects: { '悟性': 2, '机缘': 1 } },
          { text: '😏 "不出声不动可以——但我可以先看看窗外吧？"——靠近窗口', next: 'explore_room', effects: { '机缘': 2, '心性': 1 } }
        ]
      },

      fight_giant: {
        story: '你使尽浑身解数，跟金甲巨人大战三百回合。\n\n"有意思！"巨人收回拳头，"一千年了，你是第一个接住我三招的凡人。叫什么名字？"\n\n"我还没输，接着来！"你咬牙站起来。\n\n巨人哈哈大笑："不用了——你过关了。勇气和斗志，比胜负更重要。"',
        mood: 'bright',
        choices: [] // 终章
      },

      talk_giant: {
        story: '巨人沉默了很久。\n\n"一千年了……你是第一个问我累不累的人。"\n\n他坐了下来，从三丈高的巨人，缩小成了一个寻常身形的老者。\n\n"你说得对，我累了。谢谢你——让我终于可以放下了。"\n\n他化作点点金光，消散在风中。你看到地上留着一块金牌——"仙门考核·完成"。',
        mood: 'bright',
        choices: [] // 终章
      },

      read_all: {
        story: '你花了不知多少个日夜，终于把九万卷书通读了一遍。\n\n等你合上最后一本，青衫书生已不知去向。桌上留着一张纸条："九九八十一日为限，你花了八十一日读完。考试已结束——你已通过。"\n\n原来考核的从来不是"答对"，而是"愿意去读"。',
        mood: 'bright',
        choices: [] // 终章
      },

      find_pattern: {
        story: '你发现每本书的第一页第一个字连起来是一句话：\n\n"道可道，非常道。名可名，非常名。无名天地之始……"\n\n你微微一笑——这不就是《道德经》吗？你把所有书按这个顺序排好，从中抽出了三本：天、地、人。\n\n青衫书生抚掌大笑："聪明！你看出题中之题了。"',
        mood: 'bright',
        choices: [] // 终章
      },

      intuition_pick: {
        story: '你闭上眼，随手一指——\n\n抽中的第一本书，居然只有一张白纸。\n\n你愣住了。翻了翻另外两本，也都是白纸。\n\n青衫书生走过来："你选了最难的考题——空。现在，请在这三张白纸上，写出你的答案。"\n\n你沉默片刻，提笔写下一行字……',
        mood: 'bright',
        choices: [] // 终章
      },

      meditate: {
        story: '七天、六天、五天……\n\n你在蒲团上纹丝不动。饿了、渴了、困了——你都不理会。\n\n第七天清晨，阳光从窗口照进来，照在你脸上。\n\n门开了。白胡子老道站在门口："你通过了。修仙之路上，最难的不是法力，是耐得住寂寞。"',
        mood: 'bright',
        choices: [] // 终章
      },

      explore_room: {
        story: '你仔细检查了房间。墙上、地上、蒲团下……\n\n最后，你在窗台上发现了一条极淡的刻痕："真正的考核不在房间里——推开窗，你就过了。"\n\n你推开窗。窗外不是悬崖，而是——一个全新的世界。\n\n白胡子老道的声音从天际传来："仙门不在山中，仙门在——你愿不愿意走出去。"',
        mood: 'bright',
        choices: [] // 终章
      }
    },

    isEndNode(nodeId) {
      const ends = ['fight_giant', 'talk_giant', 'read_all', 'find_pattern', 'intuition_pick', 'meditate', 'explore_room'];
      return ends.includes(nodeId);
    },

    resultMapping(effects) {
      const gengu = effects['根骨'] || 0;
      const wuxing = effects['悟性'] || 0;
      const xin_xing = effects['心性'] || 0;
      const jiyuan = effects['机缘'] || 0;

      if (gengu >= 5) return 'warrior';
      if (wuxing >= 5) return 'sage';
      if (xin_xing >= 5) return 'ascetic';
      if (jiyuan >= 5) return 'destined';
      return 'balanced';
    },

    results: {
      warrior: {
        title: '战修仙尊',
        sum: '以力证道，武道通神',
        brief: '你的修仙路是"打"出来的。不相信捷径，只相信实力。在万千修仙者中，你是最硬核的那一类——不需要花里胡哨，一拳就够了。',
        rank: '武仙·斗战尊者',
        tagline: '修仙？不是打坐就行吗——哦我打架就是修炼',
        ratings: { '根骨': 9, '悟性': 5, '心性': 7, '机缘': 4 },
        imageUrl: CARD_BASE + 'resized-28 老子神像.jpg'
      },
      sage: {
        title: '智修仙君',
        sum: '以智求道，书中自有天地',
        brief: '你的修仙路是"想"出来的。比法术更重要的是思路，比丹药更重要的是配方。你大概是所有修仙者里最不像"修仙"的——像个研究员。',
        rank: '文仙·万卷真人',
        tagline: '别人修仙靠打坐，我修仙靠——阅读理解和逻辑推理',
        ratings: { '根骨': 4, '悟性': 9, '心性': 6, '机缘': 6 },
        imageUrl: CARD_BASE + 'resized-38 老子道德天尊.jpg'
      },
      ascetic: {
        title: '苦修仙人',
        sum: '以心证道，万法归心',
        brief: '你走的是最难的修仙路——向内求。不需要什么天材地宝，你相信自己足矣。这份定力，就是最大的天赋。',
        rank: '禅仙·不动尊者',
        tagline: '给我一个蒲团，我能坐到飞升',
        ratings: { '根骨': 6, '悟性': 6, '心性': 9, '机缘': 4 },
        imageUrl: CARD_BASE + 'resized-29 华阳洞.jpg'
      },
      destined: {
        title: '天命修仙',
        sum: '机缘巧合，天选之人',
        brief: '你大概是修仙小说里的主角模板——运气好到离谱。当然，运气也是一种实力，而且是最不讲道理的实力。',
        rank: '奇仙·天选之子',
        tagline: '我也不知道怎么过的——可能是因为运气比较好？',
        ratings: { '根骨': 5, '悟性': 5, '心性': 5, '机缘': 9 },
        imageUrl: CARD_BASE + 'resized-30 顶峰封神台.jpg'
      },
      balanced: {
        title: '逍遥散仙',
        sum: '随心所欲，不滞于物',
        brief: '你没走任何一条传统的修仙路——你走了自己的路。不强求、不执著，但奇怪的是，你走得比谁都远。',
        rank: '散仙·逍遥子',
        tagline: '我没有门派——我自己就是一个门派',
        ratings: { '根骨': 6, '悟性': 6, '心性': 6, '机缘': 6 },
        imageUrl: CARD_BASE + 'resized-35 三茅真君.jpg'
      }
    }
  },

  // ============ 场景三：妖界判官 ============
  demon_judge: {
    id: 'demon_judge',
    title: '妖界判官',
    desc: '一只狐狸精被押上公堂，众人喊打喊杀——但你觉得事情没那么简单...',
    icon: '🦊',
    startNode: 'courtroom',
    dims: ['正义', '怜悯', '洞察', '魄力'],
    dimLabels: { '正义': '正义', '怜悯': '怜悯', '洞察': '洞察', '魄力': '魄力' },

    nodes: {
      courtroom: {
        story: '你被请去妖界断一桩公案。\n\n被告是一只白狐精，修为不过三百年。原告是人类的村长，告她"魅惑村民、偷吃家禽、引发瘟疫"。\n\n围观者群情激愤："烧死她！""狐狸精没一个好东西！"\n\n白狐低着头，一言不发。但你看她的眼睛——那不是害怕，是绝望。',
        mood: 'tense',
        choices: [
          { text: '⚖️ "都给我住嘴！本官先审案，再审人——不对，审妖"', next: 'interrogate', effects: { '正义': 2, '魄力': 2 } },
          { text: '🦊 "白狐，抬起头来——你为何不说话？"', next: 'talk_to_fox', effects: { '怜悯': 2, '洞察': 1 } },
          { text: '🔍 "本官要去现场看看——带路！"', next: 'investigate', effects: { '洞察': 3 } }
        ]
      },

      interrogate: {
        story: '你一拍惊堂木："白狐，本官问你——是否魅惑村民？"\n\n白狐终于开口，声音很轻："我没有……我是来报恩的。那个人类村长——他三年前在山中救了我，我是来还他恩情的。"\n\n"偷吃家禽呢？"\n\n"我没偷——是他家的鸡自己跑来的。我帮他把鸡赶回去，他不信……"\n\n村长涨红了脸："你胡说！"',
        mood: 'tense',
        choices: [
          { text: '🤔 "村长，你可有三年前救狐的证据？"', next: 'talk_to_fox', effects: { '洞察': 2, '正义': 1 } },
          { text: '🦊 "白狐，你说的可有人证？"', next: 'investigate', effects: { '正义': 1, '洞察': 1 } },
          { text: '😤 "村长，你嘴里说的和狐狸说的——怎么差这么多？到底谁在撒谎！"', next: 'investigate', effects: { '魄力': 2, '正义': 1 } }
        ]
      },

      talk_to_fox: {
        story: '白狐抬起头，眼泪在眼眶里打转。\n\n"三年前，村长进山采药摔断了腿。是我每天给他找吃的，帮他包扎，陪了他整整一冬。他自己说的——以后会报答我。"\n\n"可今年瘟疫爆发，他怕村民怪他引来狐狸——就反过来诬陷我。"\n\n人群安静了。村长脸色越来越白。',
        mood: 'peaceful',
        choices: [
          { text: '⚖️ "村长——你可有话说？"——让他当面对质', next: 'interrogate', effects: { '正义': 2, '魄力': 1 } },
          { text: '🙏 "白狐不必害怕——本官在此，没人能冤枉你"', next: 'investigate', effects: { '怜悯': 2, '魄力': 2 } },
          { text: '🦊 "你说的那件事——有没有证物？"', next: 'investigate', effects: { '洞察': 2, '正义': 1 } }
        ]
      },

      investigate: {
        story: '你亲自去了山中。\n\n在山洞里找到了白狐的窝——破旧但干净。角落里，有一件人类的外衣，叠得整整齐齐。衣襟上绣着一个"李"字——正是村长的姓。\n\n你又去查了所谓"偷吃的家禽"——那些鸡根本就是村长自己杀的，用来栽赃。\n\n瘟疫的源头是一口被污染的井——跟狐狸毫无关系。',
        mood: 'dark',
        choices: [
          { text: '⚖️ 带着证据回去，当众揭穿村长', next: 'reveal_truth', effects: { '正义': 3, '魄力': 2 } },
          { text: '🤫 私下找村长谈话："你自己认罪，我可以不公开。"', next: 'private_talk', effects: { '怜悯': 2, '洞察': 2 } },
          { text: '🦊 先把白狐放了，让她避避风头再说', next: 'free_fox', effects: { '怜悯': 3, '正义': 1 } }
        ]
      },

      reveal_truth: {
        story: '你回到公堂，把证据一样样摆出来。\n\n"外衣——你三年前落在山洞的，还记得吗？井水——你家的井是你自己下的毒。鸡——刀口是你家厨房那把刀。"\n\n村长瘫坐在地上。\n\n"本官判你——诬陷无辜、毒害乡里，发配南疆苦役十年！"\n\n白狐跪在你面前，磕了三个头："大人大恩，白狐永世不忘。"',
        mood: 'bright',
        choices: [] // 终章
      },

      private_talk: {
        story: '你把村长叫到没人的地方。\n\n"我知道你是因为害怕才撒谎。我给你两条路——一，自己去跟村民认错，我可以从轻发落。二，继续嘴硬，本官公事公办。"\n\n村长沉默了很久——然后点了点头。\n\n第二天，他在全村人面前向白狐道歉。白狐原谅了他。\n\n后来有人说——那个村子再也没闹过瘟疫。',
        mood: 'bright',
        choices: [] // 终章
      },

      free_fox: {
        story: '你悄悄把白狐放了。"走吧，去没人的山里——别再回来了。"\n\n白狐看了你一眼，转身跑进了密林。\n\n你回到公堂，说白狐"畏罪潜逃"——此案就此了结。\n\n……几个月后，你收到一个包裹。打开一看，里面是一株千年灵芝。附着一张纸条，上面只有一个爪印。',
        mood: 'bright',
        choices: [] // 终章
      }
    },

    isEndNode(nodeId) {
      return ['reveal_truth', 'private_talk', 'free_fox'].includes(nodeId);
    },

    resultMapping(effects) {
      const zhengyi = effects['正义'] || 0;
      const lianmin = effects['怜悯'] || 0;
      const dongcha = effects['洞察'] || 0;
      const poli = effects['魄力'] || 0;

      if (zhengyi >= 5) return 'judge';
      if (lianmin >= 5) return 'savior';
      if (dongcha >= 5) return 'detective';
      if (poli >= 5) return 'reformer';
      return 'balanced';
    },

    results: {
      judge: {
        title: '铁面判官',
        sum: '是非分明，绝不妥协',
        brief: '你对公正有着近乎偏执的追求。错就是错，对就是对，没有中间地带。你这种"不近人情"的公正，恰恰是这个世界上最需要的东西。',
        rank: '正法·青天判官',
        tagline: '我不是不近人情——我是不近"假人情"',
        ratings: { '正义': 9, '怜悯': 5, '洞察': 7, '魄力': 8 },
        imageUrl: CARD_BASE + 'resized-37 钟馗天师.jpg'
      },
      savior: {
        title: '慈悲渡者',
        sum: '以善为本，以心渡人',
        brief: '你始终相信——每个人都值得第二次机会。这份慈悲有时候看起来"软弱"，但实际需要更大的勇气。原谅比惩罚难得多。',
        rank: '善法·大悲尊者',
        tagline: '能原谅就不判罪，能渡人就不杀人',
        ratings: { '正义': 6, '怜悯': 9, '洞察': 7, '魄力': 5 },
        imageUrl: CARD_BASE + 'resized-40 山神福德正神.jpg'
      },
      detective: {
        title: '明察秋官',
        sum: '洞察真相，无所遁形',
        brief: '你相信证据，不相信眼泪。在别人被情绪左右的时候，你已经默默地把线索都串起来了。你是那种"不看表面看本质"的狠人。',
        rank: '智法·洞明神探',
        tagline: '别跟我演戏——我已经知道了。现在聊聊吧',
        ratings: { '正义': 7, '怜悯': 5, '洞察': 9, '魄力': 6 },
        imageUrl: CARD_BASE + 'resized-39 太白金星.jpg'
      },
      reformer: {
        title: '变革先锋',
        sum: '打破旧的，建立新的',
        brief: '你觉得这世界的规则本身就有问题——所以你不只是"依法判案"，你想改变这个"法"本身。你这种魄力，在任何一个时代都是稀缺品。',
        rank: '变法·破旧真人',
        tagline: '规则是死的，人是活的——不好的规则就该改',
        ratings: { '正义': 6, '洞察': 7, '怜悯': 5, '魄力': 9 },
        imageUrl: CARD_BASE + 'resized-38 老子道德天尊.jpg'
      },
      balanced: {
        title: '中庸知事',
        sum: '刚柔并济，不偏不倚',
        brief: '你不站任何一边——你站在"道理"那边。该严的时候不手软，该宽的时候不苛责。你的判断总是让人无话可说。',
        rank: '中正·和光真人',
        tagline: '一边倒的判官我不当——我只当"对的那边"',
        ratings: { '正义': 6, '洞察': 6, '怜悯': 6, '魄力': 6 },
        imageUrl: CARD_BASE + 'resized-35 三茅真君.jpg'
      }
    }
  }
};

// ============================================================
// 场景冒险引擎
// ============================================================

/**
 * 创建一次新的场景冒险会话
 * @param {string} scenarioId - 场景ID
 * @returns {object|null} 会话对象
 */
function createSession(scenarioId) {
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) return null;

  return {
    scenarioId,
    currentNode: scenario.startNode,
    effects: {},          // { 属性名: 累计分值 }
    history: [],          // [{ nodeId, choiceIdx, choiceText }]
    totalSteps: 0
  };
}

/**
 * 获取当前节点数据
 * @param {object} session - 会话对象
 * @returns {object|null} 节点数据 { story, mood, choices, isEnd }
 */
function getCurrentNode(session) {
  const scenario = SCENARIOS[session.scenarioId];
  if (!scenario) return null;

  const node = scenario.nodes[session.currentNode];
  if (!node) return null;

  return {
    story: node.story,
    mood: node.mood || 'peaceful',
    choices: node.choices || [],
    isEnd: node.choices.length === 0 || (scenario.isEndNode && scenario.isEndNode(session.currentNode))
  };
}

/**
 * 做一个选择并推进到下一个节点
 * @param {object} session - 会话对象
 * @param {number} choiceIdx - 选项索引
 * @returns {object} { ok, nextNode, effects, isEnd }
 */
function makeChoice(session, choiceIdx) {
  const scenario = SCENARIOS[session.scenarioId];
  if (!scenario) return { ok: false };

  const node = scenario.nodes[session.currentNode];
  if (!node) return { ok: false };

  const choices = node.choices || [];
  if (choiceIdx < 0 || choiceIdx >= choices.length) return { ok: false };

  const choice = choices[choiceIdx];

  // 应用效果
  if (choice.effects) {
    Object.keys(choice.effects).forEach(dim => {
      session.effects[dim] = (session.effects[dim] || 0) + choice.effects[dim];
    });
  }

  // 记录历史
  session.history.push({
    nodeId: session.currentNode,
    choiceIdx,
    choiceText: choice.text
  });

  // 推进到下一个节点
  session.currentNode = choice.next;
  session.totalSteps++;

  const nextNode = scenario.nodes[session.currentNode];
  const isEnd = !nextNode || nextNode.choices.length === 0 ||
    (scenario.isEndNode && scenario.isEndNode(session.currentNode));

  return { ok: true, nextNode: session.currentNode, effects: { ...session.effects }, isEnd };
}

/**
 * 获取最终结果
 * @param {object} session - 会话对象
 * @returns {object|null} 结果对象
 */
function getFinalResult(session) {
  const scenario = SCENARIOS[session.scenarioId];
  if (!scenario) return null;

  const typeCode = scenario.resultMapping(session.effects);
  const result = scenario.results[typeCode];
  if (!result) return null;

  return {
    ...result,
    typeCode,
    scenarioTitle: scenario.title,
    scenarioIcon: scenario.icon,
    dims: scenario.dims,
    dimLabels: scenario.dimLabels || {},
    effects: session.effects,
    steps: session.totalSteps
  };
}

/**
 * 获取所有可用场景列表
 */
function getScenarioList() {
  return Object.keys(SCENARIOS).map(id => {
    const s = SCENARIOS[id];
    return {
      id: s.id,
      title: s.title,
      desc: s.desc,
      icon: s.icon
    };
  });
}

module.exports = {
  SCENARIOS,
  createSession,
  getCurrentNode,
  makeChoice,
  getFinalResult,
  getScenarioList
};
