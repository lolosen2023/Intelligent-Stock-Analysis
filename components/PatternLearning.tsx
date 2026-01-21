
import React, { useState } from 'react';
import { PatternVisualizer } from './PatternVisualizer';

// Data Definition matching user image structure
const PATTERN_CATEGORIES = [
  { id: 'kline_combo', name: '🕯️ K线组合', desc: '单日/双日/三日反转' },
  { id: 'reversal', name: '🔄 经典反转', desc: '头部与底部形态' },
  { id: 'continuation', name: '📐 中继整理', desc: '趋势中的休息站' },
  { id: 'special', name: '✨ 特色综合', desc: '缺口与特殊形态' },
];

const PATTERNS_DB = [
  // --- 一、K线组合形态 ---
  
  // 1. 单日反转
  {
    id: 'hammer',
    categoryId: 'kline_combo',
    name: '锤头线 / 吊颈线',
    subtitle: 'Hammer / Hanging Man',
    sentiment: 'Reversal',
    visualType: 'hammer',
    description: '实体小，下影线极长（通常为实体2倍以上）。位置决定意义：在下降趋势末端为锤头线（看涨），在上升趋势末端为吊颈线（看跌）。',
    characteristics: [
      '实体很小，可以是阴线也可以是阳线。',
      '下影线很长，表明盘中曾大幅下跌但被拉回。',
      '上影线极短或没有。',
      '锤头线需要次日阳线确认；吊颈线需要次日阴线确认。'
    ],
    strategy: {
      entry: '锤头线次日放量收阳买入。',
      stop: '跌破锤头线最低点。',
      target: '短期阻力位。'
    },
    example: {
        stock: "贵州茅台 (600519)",
        period: "2018年10月底",
        analysis: "在经历了一波快速下跌后，股价在底部收出一根标准的锤头线，随后几个交易日成交量温和放大，确立了中期底部，随后开启了一波跨年度的上涨行情。",
        visualType: "real_hammer"
    }
  },
  {
    id: 'shooting_star',
    categoryId: 'kline_combo',
    name: '倒锤头 / 射击之星',
    subtitle: 'Inverted Hammer / Shooting Star',
    sentiment: 'Reversal',
    visualType: 'shooting_star',
    description: '实体小，上影线极长。位置决定意义：在下降趋势末端为倒锤头（潜在看涨），在上升趋势末端为射击之星（强烈看跌）。',
    characteristics: [
      '上影线很长，表明多头进攻失败，抛压沉重。',
      '射击之星是明显的见顶信号。',
      '倒锤头表示空头力量衰竭，多头试盘。'
    ],
    strategy: {
      entry: '射击之星出现后，次日跌破低点做空。',
      stop: '突破射击之星最高点。',
      target: '下方支撑位。'
    },
    example: {
        stock: "中信证券 (600030)",
        period: "2020年7月9日",
        analysis: "股价在连续涨停后高位开盘，冲高回落收出一根长上影线的射击之星（伴随天量），次日低开低走，标志着短期情绪见顶，随后进入了长达半年的震荡调整。",
        visualType: "real_shooting_star"
    }
  },

  // 2. 双日反转
  {
    id: 'bullish_engulfing',
    categoryId: 'kline_combo',
    name: '看涨吞没 (底)',
    subtitle: 'Bullish Engulfing',
    sentiment: 'Bullish',
    visualType: 'bullish_engulfing',
    description: '出现在下跌趋势中，后一根阳线实体完全包裹前一根阴线实体。',
    characteristics: [
      '第二根阳线实体包住第一根阴线实体。',
      '表明多头力量一举压倒空头。',
      '伴随成交量放大，信号更强。'
    ],
    strategy: {
      entry: '形态完成次日买入。',
      stop: '跌破阳线最低点。',
      target: '波段反弹目标。'
    },
    example: {
        stock: "比亚迪 (002594)",
        period: "2021年5月",
        analysis: "在调整末期，出现了一根大阳线完全包住了前一天的阴线，且成交量显著放大。这不仅是止跌信号，更是主力资金强势介入的标志，随后股价翻倍。",
        visualType: "real_engulfing_bull"
    }
  },
  {
    id: 'bearish_engulfing',
    categoryId: 'kline_combo',
    name: '看跌吞没 (顶)',
    subtitle: 'Bearish Engulfing',
    sentiment: 'Bearish',
    visualType: 'bearish_engulfing',
    description: '出现在上升趋势中，后一根阴线实体完全包裹前一根阳线实体。',
    characteristics: [
      '第二根阴线实体包住第一根阳线实体。',
      '意味着空头反扑，趋势可能逆转。',
    ],
    strategy: {
      entry: '形态完成次日卖出。',
      stop: '突破阴线最高点。',
      target: '下方支撑。'
    },
    example: {
        stock: "宁德时代 (300750)",
        period: "2021年12月初",
        analysis: "在高位震荡中，一根放量阴线吃掉了前一日的阳线，形成阴包阳形态。市场随后确认了趋势反转，进入了中期下跌通道。",
        visualType: "real_engulfing_bear"
    }
  },
  {
    id: 'piercing_line',
    categoryId: 'kline_combo',
    name: '曙光初现 (底) / 乌云盖顶 (顶)',
    subtitle: 'Piercing Line / Dark Cloud Cover',
    sentiment: 'Reversal',
    visualType: 'piercing_line', // visuals handled by logic inside visualizer to show one, let's use piercing_line for bottom
    description: '底部反转（曙光初现）：先大阴，后大阳切入阴线实体1/2以上。顶部反转（乌云盖顶）：先大阳，后大阴切入阳线实体1/2以下。',
    characteristics: [
      '曙光初现：第二根阳线开盘价低于前日收盘（跳空低开），但强力反弹。',
      '乌云盖顶：第二根阴线开盘价高于前日收盘（跳空高开），但遭遇抛压。',
      '切入程度越深，反转信号越强。'
    ],
    strategy: {
      entry: '曙光初现次日确认后买入；乌云盖顶立即卖出。',
      stop: '形态最低点/最高点。',
      target: '前一波趋势的50%回撤位。'
    },
    example: {
        stock: "万科A (000002)",
        period: "2015年股灾底部",
        analysis: "在连续暴跌后，股价低开高走，收盘价刺入前一日大阴线实体的2/3处，形成标准的曙光初现，预示着恐慌盘出清，反弹即将开始。",
        visualType: "piercing_line"
    }
  },
  {
    id: 'tweezer',
    categoryId: 'kline_combo',
    name: '平顶 / 平底',
    subtitle: 'Tweezer Top / Bottom',
    sentiment: 'Reversal',
    visualType: 'tweezer',
    description: '两根或多根K线的高点（平顶）或低点（平底）几乎相同。',
    characteristics: [
      '形成短期强阻力或强支撑。',
      '通常与其他K线形态（如星线）配合出现。'
    ],
    strategy: {
      entry: '平底不破买入。',
      stop: '跌破平底最低价。',
      target: '箱体上沿。'
    },
    example: {
        stock: "工商银行 (601398)",
        period: "长期盘整区",
        analysis: "作为大盘股，常在箱体底部连续多日最低价几乎分毫不差，形成平底支撑，显示有护盘资金在特定价位坚决吸纳。",
        visualType: "tweezer"
    }
  },

  // 3. 三日反转
  {
    id: 'morning_star',
    categoryId: 'kline_combo',
    name: '早晨之星 (启明星)',
    subtitle: 'Morning Star',
    sentiment: 'Bullish',
    visualType: 'morning_star',
    description: '强底部反转。阴线 -> 星线（跳空） -> 阳线（收盘入第一日实体）。星线实体越小越好。',
    characteristics: [
      '第一根长阴宣泄空头能量。',
      '中间星线代表多空平衡。',
      '第三根长阳确立多头主导。'
    ],
    strategy: {
      entry: '第三根阳线收盘买入。',
      stop: '跌破中间星线低点。',
      target: '趋势反转目标。'
    },
    example: {
        stock: "东方财富 (300059)",
        period: "2019年1月底",
        analysis: "在商誉减值利空出尽后，日线级别走出了标准的早晨之星组合，随后开启了创业板牛市的主升浪。",
        visualType: "real_morning_star"
    }
  },
  {
    id: 'three_white_soldiers',
    categoryId: 'kline_combo',
    name: '红三兵 / 三只乌鸦',
    subtitle: 'Three White Soldiers / Black Crows',
    sentiment: 'Trend',
    visualType: 'three_white_soldiers',
    description: '红三兵：连续三根逐步抬高的阳线，显示买盘稳步推进。三只乌鸦：连续三根逐步降低的阴线，显示卖盘持续涌出。',
    characteristics: [
      '红三兵：每次开盘在前一日实体内，收盘创新高。',
      '三只乌鸦：高位出现，极度危险信号。'
    ],
    strategy: {
      entry: '红三兵回调不破均线买入。',
      stop: '跌破第一根K线起点。',
      target: '趋势延续。'
    },
    example: {
        stock: "隆基绿能 (601012)",
        period: "2020年启动初期",
        analysis: "在底部盘整结束后，连续出现三根小阳线稳步推升，量能温和放大（红三兵），随后股价加速脱离底部区域，确立上涨趋势。",
        visualType: "three_white_soldiers"
    }
  },
  {
    id: 'sandwich',
    categoryId: 'kline_combo',
    name: '两阳夹一阴 / 两阴夹一阳',
    subtitle: 'Sandwich Pattern',
    sentiment: 'Continuation',
    visualType: 'sandwich_bull',
    description: '多方炮（两阳夹一阴）：看涨中继，多方短暂休整后重新主导。空方炮（两阴夹一阳）：看跌中继，空方短暂抵抗后继续打压。',
    characteristics: [
      '中间K线实体较小，成交量萎缩。',
      '第三根K线重新放量突破。'
    ],
    strategy: {
      entry: '第三根阳线突破时跟进。',
      stop: '跌破第一根阳线低点。',
      target: '波段新高。'
    },
    example: {
        stock: "特变电工 (600089)",
        period: "上涨中继",
        analysis: "股价在上涨途中，大阳线后接一根缩量小阴线洗盘，第三天迅速拉出大阳线反包，形成多方炮，随后股价继续创出新高。",
        visualType: "sandwich_bull"
    }
  },

  // --- 二、经典反转形态 ---
  {
    id: 'head_shoulders_top',
    categoryId: 'reversal',
    name: '头肩顶 / 头肩底',
    subtitle: 'Head and Shoulders',
    sentiment: 'Reversal',
    visualType: 'head_shoulders_top',
    description: '最可靠的反转形态之一。左肩-头-右肩结构。跌破/突破颈线确认形态完成。',
    characteristics: [
      '头部最高，两肩较低。',
      '右肩成交量通常萎缩。',
      '颈线被突破是关键交易信号。'
    ],
    strategy: {
      entry: '突破颈线或回踩颈线时交易。',
      stop: '回到肩部上方/下方。',
      target: '头部到颈线的垂直距离。'
    },
    example: {
        stock: "上证指数 (000001)",
        period: "2007年6124点顶部",
        analysis: "经典的头肩顶形态。6124点为头部，左右两侧分别构建了肩膀，跌破颈线后，指数确认见顶，开启了历史性的大熊市。",
        visualType: "real_head_shoulders"
    }
  },
  {
    id: 'double_bottom',
    categoryId: 'reversal',
    name: '双重顶(M头) / 双重底(W底)',
    subtitle: 'Double Top / Bottom',
    sentiment: 'Reversal',
    visualType: 'double_bottom',
    description: '两个相近的高点/低点。多空双方在同一位置反复争夺。',
    characteristics: [
      '第二个低点/高点成交量背离。',
      '必须突破颈线才算形态确立。'
    ],
    strategy: {
      entry: '突破颈线追入。',
      stop: '跌破颈线。',
      target: '形态高度。'
    },
    example: {
        stock: "中国平安 (601318)",
        period: "2014年中期",
        analysis: "股价在底部构筑了长达半年的W底结构，右底明显缩量，突破颈线时放量，确认了长期底部的成立，随后迎来了一波翻倍行情。",
        visualType: "double_bottom"
    }
  },
  {
    id: 'triple_top',
    categoryId: 'reversal',
    name: '三重顶 / 三重底',
    subtitle: 'Triple Top / Bottom',
    sentiment: 'Reversal',
    visualType: 'triple_top',
    description: '三个相近的高点/低点。比双顶/底更稳固，形成时间更长。',
    characteristics: [
      '三次冲击阻力/支撑失败。',
      '颈线一旦被突破，爆发力极强。'
    ],
    strategy: {
      entry: '突破颈线交易。',
      stop: '反向突破颈线。',
      target: '形态高度。'
    },
    example: {
        stock: "紫金矿业 (601899)",
        period: "底部启动前",
        analysis: "在周期底部，股价反复三次探底不破，构筑了坚实的三重底支撑，主力吸筹充分，一旦突破颈线，上涨趋势非常稳健。",
        visualType: "triple_top"
    }
  },
  {
    id: 'round_bottom',
    categoryId: 'reversal',
    name: '圆形顶 / 圆形底',
    subtitle: 'Rounding Top / Bottom',
    sentiment: 'Reversal',
    visualType: 'round_bottom',
    description: '价格呈圆弧状，反映市场情绪潜移默化地转变。趋势缓慢反转。',
    characteristics: [
      '耗时较长，成交量呈凹形（两头高中间低）。',
      '属于主力耐心吸筹或缓慢出货。'
    ],
    strategy: {
      entry: '突破碗口（颈线）时买入。',
      stop: '跌回圆弧内部。',
      target: '圆弧深度。'
    },
    example: {
        stock: "恒瑞医药 (600276)",
        period: "长期慢牛初期",
        analysis: "股价走势极其平滑，呈现完美的圆弧底形态，成交量配合默契，显示长线资金在从容建仓，是典型的白马股底部特征。",
        visualType: "round_bottom"
    }
  },
  {
    id: 'v_reversal',
    categoryId: 'reversal',
    name: 'V形反转 (尖形)',
    subtitle: 'V-Reversal',
    sentiment: 'Reversal',
    visualType: 'v_reversal',
    description: '急速反转，趋势陡直逆转。通常在重大利好/利空消息后出现。',
    characteristics: [
      '下跌和上涨都非常剧烈。',
      '往往伴随巨大的成交量（恐慌盘和抄底盘）。',
      '最难把握的形态，往往来不及反应。'
    ],
    strategy: {
      entry: '突破下跌趋势线或均线金叉时右侧交易。',
      stop: 'V底最低点。',
      target: '前一波跌幅的100%。'
    },
    example: {
        stock: "创业板指 (399006)",
        period: "2018年10月-2019年初",
        analysis: "在政策底出现后，指数从单边急跌直接转为单边急涨，中间几乎没有盘整，形成了凌厉的V型反转，只有反应极快的右侧交易者才能抓住机会。",
        visualType: "v_reversal"
    }
  },
  {
    id: 'island_reversal',
    categoryId: 'reversal',
    name: '岛形反转',
    subtitle: 'Island Reversal',
    sentiment: 'Reversal',
    visualType: 'island_reversal',
    description: '强趋势反转。顶部/底部出现跳空缺口，盘整后再反向跳空，形成价格“孤岛”。',
    characteristics: [
      '左右两个缺口处于同一价格区间。',
      '孤岛部分成交量往往很大。',
      '意味着原有趋势的持有者被完全套牢/踏空。'
    ],
    strategy: {
      entry: '第二个缺口出现时立即顺势交易。',
      stop: '回补缺口。',
      target: '趋势反转。'
    },
    example: {
        stock: "某st股退市前 / 某重组股复牌",
        period: "极端行情",
        analysis: "典型的岛形反转常出现在重大利空（顶部岛形）或重大利好（底部岛形）时，中间的K线如同孤岛，将套牢盘死死锁在山顶，是极强的转势信号。",
        visualType: "island_reversal"
    }
  },

  // --- 三、中继整理形态 ---
  {
    id: 'flag',
    categoryId: 'continuation',
    name: '旗形 (Flag)',
    subtitle: 'Flag Pattern',
    sentiment: 'Continuation',
    visualType: 'flag',
    description: '一段“旗杆”后，进入小型平行四边形整理（旗面）。时间短，突破力度强。',
    characteristics: [
      '旗杆必须是急涨或急跌。',
      '旗面整理量缩。',
      '突破时必须放量。'
    ],
    strategy: {
      entry: '突破旗面上沿买入。',
      stop: '跌破旗面下沿。',
      target: '旗杆长度。'
    },
    example: {
        stock: "赣锋锂业 (002460)",
        period: "主升浪中",
        analysis: "在锂电板块主升浪中，股价经历一波急涨（旗杆）后，缩量回调了5天（旗面），随后放量涨停突破旗形上沿，开启了第二波翻倍攻势（空中加油）。",
        visualType: "flag"
    }
  },
  {
    id: 'rectangle',
    categoryId: 'continuation',
    name: '矩形 (箱体)',
    subtitle: 'Rectangle',
    sentiment: 'Continuation',
    visualType: 'rectangle',
    description: '价格在两条水平线间震荡，是典型的整理平台。突破后延续原趋势。',
    characteristics: [
      '多空平衡，观望气氛浓。',
      '突破箱体上沿开启主升浪。'
    ],
    strategy: {
      entry: '有效突破箱体买入。',
      stop: '跌回箱体内部。',
      target: '箱体高度。'
    },
    example: {
        stock: "招商银行 (600036)",
        period: "2017年上半年",
        analysis: "股价在上涨途中构建了一个长达3个月的箱体震荡平台，消化获利盘。最终放量突破箱体上沿，走出了'慢牛'加速的行情。",
        visualType: "rectangle"
    }
  },
  {
    id: 'cup_handle',
    categoryId: 'continuation',
    name: '杯柄形态',
    subtitle: 'Cup and Handle',
    sentiment: 'Bullish',
    visualType: 'cup_handle',
    description: '看涨中继。杯（U形底部）+ 柄（杯口处小幅回撤）。柄部向上突破是经典买入信号。',
    characteristics: [
      '杯身耗时较长。',
      '杯柄是最后的洗盘。'
    ],
    strategy: {
      entry: '突破杯柄上沿。',
      stop: '跌破杯柄。',
      target: '杯深度。'
    },
    example: {
        stock: "欧普康视 (300595)",
        period: "成长股中期",
        analysis: "典型的欧奈尔杯柄形态。股价经历长时间圆弧修复（杯），在临近前高时缩量微调（柄），随后放量突破，是成长股最经典的买点之一。",
        visualType: "cup_handle"
    }
  },

  // --- 四、特色与综合形态 ---
  {
    id: 'old_duck_head',
    categoryId: 'special',
    name: '老鸭头 (经典庄股)',
    subtitle: 'Old Duck Head',
    sentiment: 'Bullish',
    visualType: 'old_duck_head',
    description: '中国股市特色形态。股价经过一波拉升（鸭脖）后回落整理（鸭头），5日/10日均线死叉后再次金叉，形成“鸭嘴”张开，主升浪开始。',
    characteristics: [
      '鸭鼻孔：5日、10日均线死叉或粘合处，成交量芝麻点（极度萎缩）。',
      '鸭嘴张开：放量大阳线突破，均线多头排列。',
      '是主力控盘极好、洗盘彻底的标志。'
    ],
    strategy: {
      entry: '鸭嘴张开（放量突破鸭头顶）时买入。',
      stop: '跌破鸭鼻孔（均线死叉点）。',
      target: '通常为鸭脖长度的1-2倍。'
    },
    example: {
        stock: "山东黄金 (600547)",
        period: "2019年下半年",
        analysis: "股价第一波拉升后（鸭脖），进行缩量回调（鸭头），均线在低位粘合。随后一根放量大阳线张开鸭嘴，开启了黄金股的主升浪，涨幅惊人。",
        visualType: "real_old_duck"
    }
  },
  {
    id: 'broadening',
    categoryId: 'special',
    name: '扩散形态 (喇叭形)',
    subtitle: 'Broadening Wedge',
    sentiment: 'Volatility',
    visualType: 'broadening',
    description: '波动幅度不断扩大，高点更高，低点更低。反映市场情绪失控和投机狂热，常预示趋势终结（通常为顶部）。',
    characteristics: [
      '成交量极其不规则。',
      '市场缺乏理性，风险极大。'
    ],
    strategy: {
      entry: '不建议在形态内交易，等待破位。',
      stop: '无固定止损。',
      target: '观望为主。'
    },
    example: {
        stock: "前期妖股",
        period: "顶部阶段",
        analysis: "多见于连板妖股的顶部，多空分歧极大，今天跌停明天涨停，波动率急剧放大，最终多头力竭，股价崩盘。",
        visualType: "broadening"
    }
  },
  {
    id: 'diamond',
    categoryId: 'special',
    name: '菱形 (钻石形态)',
    subtitle: 'Diamond Top',
    sentiment: 'Bearish',
    visualType: 'diamond',
    description: '先扩散后收敛，形态复杂且少见。通常是强烈的顶部反转信号。',
    characteristics: [
      '结合了扩散形态和对称三角形。',
      '多空分歧巨大后逐渐衰竭。'
    ],
    strategy: {
      entry: '跌破菱形右下方边界做空。',
      stop: '回到菱形内部。',
      target: '菱形最宽处垂直距离。'
    },
    example: {
        stock: "比特币 (BTC)",
        period: "历史某次大顶",
        analysis: "在加密货币的高波动市场中较常见。价格先大幅震荡（扩散）后波动减小（收敛），形成钻石顶，随后跌破支撑位引发瀑布式下跌。",
        visualType: "diamond"
    }
  },
  {
    id: 'gap_theory',
    categoryId: 'special',
    name: '缺口理论',
    subtitle: 'Gap Theory',
    sentiment: 'Trend',
    visualType: 'gap_theory',
    description: '普通缺口（快速回补）、突破缺口（方向确立）、中继缺口（趋势加速）、衰竭缺口（趋势尾声）。',
    characteristics: [
      '突破缺口不回补是强势特征。',
      '衰竭缺口出现后往往伴随反转。'
    ],
    strategy: {
      entry: '突破缺口出现时顺势交易。',
      stop: '缺口被回补。',
      target: '根据缺口类型判断。'
    },
    example: {
        stock: "上证指数",
        period: "2020年春节后开盘",
        analysis: "受疫情影响，春节后开盘出现千股跌停的向下巨大缺口（衰竭/恐慌），但随后几天快速回补。而在牛市启动时，常出现向上突破缺口，长期不回补，支撑大盘走强。",
        visualType: "gap_theory"
    }
  }
];

export const PatternLearning: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('kline_combo');
  const [selectedPatternId, setSelectedPatternId] = useState('hammer');

  const filteredPatterns = PATTERNS_DB.filter(p => p.categoryId === activeCategory);
  
  // Ensure we have a valid selection when switching categories
  React.useEffect(() => {
     const firstInCat = PATTERNS_DB.find(p => p.categoryId === activeCategory);
     if (firstInCat) setSelectedPatternId(firstInCat.id);
  }, [activeCategory]);

  const selectedPattern = PATTERNS_DB.find(p => p.id === selectedPatternId) || filteredPatterns[0] || PATTERNS_DB[0];

  return (
    <div className="animate-fade-in h-full flex flex-col lg:flex-row gap-4 pb-4">
      
      {/* LEFT COLUMN: Navigation & List - Reduced Width */}
      <div className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0">
         {/* Category Tabs */}
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex gap-2 overflow-x-auto no-scrollbar shadow-lg">
            {PATTERN_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-1 min-w-[80px] py-2 px-1 rounded-xl transition-all whitespace-nowrap flex flex-col items-center justify-center gap-1 ${
                  activeCategory === cat.id 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 transform scale-105' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-sm font-bold">{cat.name}</span>
                <span className="text-[10px] opacity-70 scale-90">{cat.desc}</span>
              </button>
            ))}
         </div>

         {/* Pattern List */}
         <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl min-h-[500px]">
            <div className="p-4 border-b border-slate-800 bg-slate-950/30 backdrop-blur">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {PATTERN_CATEGORIES.find(c => c.id === activeCategory)?.name} ({filteredPatterns.length})
              </span>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 p-2 space-y-2">
               {filteredPatterns.map(pattern => (
                 <button
                   key={pattern.id}
                   onClick={() => setSelectedPatternId(pattern.id)}
                   className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center justify-between group relative overflow-hidden ${
                     selectedPatternId === pattern.id
                       ? 'bg-slate-800 border-emerald-500/50 shadow-md'
                       : 'bg-slate-950/30 border-transparent hover:bg-slate-800 hover:border-slate-700'
                   }`}
                 >
                   {selectedPatternId === pattern.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                   )}
                   <div>
                     <div className={`font-bold text-sm mb-1 ${selectedPatternId === pattern.id ? 'text-emerald-400' : 'text-slate-200'}`}>
                       {pattern.name}
                     </div>
                     <div className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">{pattern.subtitle}</div>
                   </div>
                   <div className={`text-[10px] px-2 py-0.5 rounded-md font-bold font-mono border ${
                      pattern.sentiment === 'Bullish' 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                        : pattern.sentiment === 'Bearish'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                   }`}>
                      {pattern.sentiment === 'Bullish' ? '看涨' : pattern.sentiment === 'Bearish' ? '看跌' : pattern.sentiment === 'Reversal' ? '反转' : '中继'}
                   </div>
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* RIGHT COLUMN: Detail Content - Reduced Padding, Increased Visualizer Height */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>
         
         <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar h-full">
            
            {/* Header Section */}
            <div className="mb-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {selectedPattern.name}
                  </h2>
                  <span className={`self-start md:self-auto text-xs px-3 py-1.5 rounded-full border font-bold uppercase tracking-wide flex items-center gap-2 ${
                       selectedPattern.sentiment === 'Bullish' 
                         ? 'border-rose-500 text-rose-400 bg-rose-500/10' 
                         : selectedPattern.sentiment === 'Bearish'
                         ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                         : 'border-slate-500 text-slate-400 bg-slate-500/10'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        selectedPattern.sentiment === 'Bullish' ? 'bg-rose-400' : 
                        selectedPattern.sentiment === 'Bearish' ? 'bg-emerald-400' : 'bg-slate-400'
                      }`}></span>
                      {selectedPattern.sentiment} SIGNAL
                    </span>
               </div>
               <p className="text-slate-300 text-sm md:text-base leading-relaxed border-l-4 border-slate-700 pl-4">
                 {selectedPattern.description}
               </p>
            </div>

            {/* Visualizer Card - INCREASED HEIGHT */}
            <div className="mb-8 bg-slate-950 rounded-xl border border-slate-800 p-1 shadow-inner relative group overflow-hidden">
               <div className="absolute top-3 right-3 z-10 opacity-60 text-[9px] text-emerald-500 font-mono border border-emerald-500/30 px-1.5 py-0.5 rounded bg-slate-900/80">
                 DYNAMIC VISUALIZATION
               </div>
               {/* Height increased from h-64/80 to h-80/420px */}
               <PatternVisualizer type={selectedPattern.visualType} className="w-full h-80 md:h-[420px] bg-slate-950 rounded-lg" />
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
               
               {/* Characteristics */}
               <div className="bg-slate-800/20 rounded-xl p-5 border border-slate-700/50 hover:bg-slate-800/40 transition-colors">
                  <h3 className="text-base font-bold text-sky-400 mb-3 flex items-center gap-2 border-b border-slate-700/50 pb-2">
                    <span className="text-lg">💡</span> 关键特征与识别要点
                  </h3>
                  <ul className="space-y-2">
                     {selectedPattern.characteristics.map((char, idx) => (
                       <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.6)] flex-shrink-0"></span>
                          <span className="leading-relaxed">{char}</span>
                       </li>
                     ))}
                  </ul>
               </div>

               {/* Trading Strategy */}
               <div className="bg-slate-800/20 rounded-xl p-5 border border-slate-700/50 hover:bg-slate-800/40 transition-colors">
                  <h3 className="text-base font-bold text-amber-400 mb-3 flex items-center gap-2 border-b border-slate-700/50 pb-2">
                    <span className="text-lg">🛡️</span> 核心操盘策略
                  </h3>
                  <div className="space-y-3">
                     <div className="group">
                        <span className="block text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-0.5 group-hover:text-emerald-400 transition-colors">买卖点 (Entry)</span>
                        <div className="text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border-l-2 border-emerald-500 text-sm">
                          {selectedPattern.strategy.entry}
                        </div>
                     </div>
                     <div className="group">
                        <span className="block text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-0.5 group-hover:text-rose-400 transition-colors">止损 (Stop Loss)</span>
                        <div className="text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border-l-2 border-rose-500 text-sm">
                          {selectedPattern.strategy.stop}
                        </div>
                     </div>
                     <div className="group">
                        <span className="block text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-0.5 group-hover:text-amber-400 transition-colors">目标 (Target)</span>
                        <div className="text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border-l-2 border-amber-500 text-sm">
                          {selectedPattern.strategy.target}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Real World Example Section - New */}
            {selectedPattern.example && (
                <div className="bg-indigo-950/20 rounded-xl p-5 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                    <h3 className="text-base font-bold text-indigo-300 mb-3 flex items-center gap-2 border-b border-indigo-500/20 pb-2">
                    <span className="text-lg">🏛️</span> 历史实战案例 (Case Study)
                    </h3>
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex-shrink-0 md:w-1/3">
                            {selectedPattern.example.visualType && (
                                <div className="mb-3 border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
                                   <PatternVisualizer type={selectedPattern.example.visualType} className="w-full h-32" />
                                </div>
                            )}
                            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                                <div className="text-xl font-black text-white mb-0.5">{selectedPattern.example.stock.split(' ')[0]}</div>
                                <div className="text-[10px] text-slate-500 font-mono mb-2">{selectedPattern.example.stock.split(' ')[1]}</div>
                                <div className="inline-block px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-bold">
                                    {selectedPattern.example.period}
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center">
                            <p className="text-slate-300 text-sm leading-7">
                                {selectedPattern.example.analysis}
                            </p>
                        </div>
                    </div>
                </div>
            )}

         </div>
      </div>
    </div>
  );
};
