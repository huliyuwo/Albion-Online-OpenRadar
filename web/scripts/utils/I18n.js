// I18n.js - UI language switching (zh-CN / en)
//
// The radar UI is server-rendered in English. Rather than rewriting every Go
// template, translations are applied on the client by mapping the English text
// of known UI nodes to Chinese. Anything missing from the dictionary simply
// stays English, so the dictionary can grow incrementally.
//
// Translation targets:
//   - text nodes (element text, <option> labels, <th>, table cells, ...)
//   - placeholder / title / aria-label / alt / data-tip attributes
//   - the document title and the mobile page header ("OpenRadar - Radar")
//   - canvas HUD labels through window.__radarI18nTranslate() (see translate())
//
// The choice is persisted in localStorage and re-applied after every HTMX swap
// (the sidebar/pages are swapped in place) and after dynamic settings render.

const STORAGE_KEY = 'radarUiLanguage';

const ZH = {
    // ---------------------------------------------------------------------
    // Page titles (document.title / mobile header) and navigation
    // ---------------------------------------------------------------------
    'OpenRadar - Radar': 'OpenRadar - 雷达',
    'OpenRadar - Players': 'OpenRadar - 玩家',
    'OpenRadar - Resources': 'OpenRadar - 资源',
    'OpenRadar - Enemies': 'OpenRadar - 敌人',
    'OpenRadar - Chests': 'OpenRadar - 箱子',
    'OpenRadar - Ignore List': 'OpenRadar - 忽略列表',
    'OpenRadar - Settings': 'OpenRadar - 设置',
    'Radar': '雷达',
    'Players': '玩家',
    'Resources': '资源',
    'Enemies': '敌人',
    'Chests': '箱子',
    'Ignore List': '忽略列表',
    'Settings': '设置',
    'Language': '语言',
    'English': 'English',
    'Chinese': '中文',

    // ---------------------------------------------------------------------
    // Header / connection / fullscreen / picture-in-picture
    // ---------------------------------------------------------------------
    'Fullscreen': '全屏',
    'PiP Mode': '画中画',
    'PiP': '画中画',
    'Exit PiP': '退出画中画',
    'Connecting...': '连接中…',
    'Connected': '已连接',
    'Disconnected': '已断开',
    'Reload Page': '刷新页面',
    'Continue Anyway': '继续使用',
    'Database Loading Failed': '数据库加载失败',
    'Unable to load': '无法加载',
    'database.': '数据库。',
    'Expand sidebar': '展开侧栏',
    'Collapse sidebar': '折叠侧栏',

    // ---------------------------------------------------------------------
    // Common words shared by several pages
    // ---------------------------------------------------------------------
    'Display': '显示',
    'Alerts': '提醒',
    'Alert': '提醒',
    'Network': '网络',
    'Logging': '日志',
    'Debug': '调试',
    'UI': '界面',
    'General': '通用',
    'Advanced': '高级',
    'Output': '输出',
    'View': '视图',
    'Type': '类型',
    'Special': '特殊',
    'Group': '队伍',
    'Solo': '单人',
    'Duo': '双人',
    'Normal': '普通',
    'Champion': '冠军',
    'Mini-Boss': '小首领',
    'Boss': '首领',
    'Passive': '被动',
    'Faction': '阵营',
    'Hostile': '敌对',
    'Hostiles': '敌对玩家',
    'Mounted': '骑乘',
    'No Guild': '无公会',
    'Remove': '移除',
    'Add name': '添加名称',
    'Ignored names': '忽略的名称',
    'The ignore list is empty': '忽略列表为空',
    'Player, guild or alliance name': '玩家、公会或联盟名称',
    'Sound': '声音',
    'Volume': '音量',
    'Cooldown': '冷却时间',
    'Screen': '屏幕',
    'Maximum Players Displayed': '最大显示玩家数',
    'Minimum HP': '最低生命值',
    'Min nodes per cluster': '每个聚类最少节点数',
    'Cluster radius (m)': '聚类半径（米）',
    'Max size': '最大尺寸',
    'Icon size': '图标大小',
    'Icon Size': '图标大小',
    'Zoom': '缩放',
    'Fit to screen': '适应屏幕',
    'Map background': '地图背景',
    'Zone info box': '区域信息框',
    'Stats box': '统计框',
    'Players beside radar': '玩家列表置于雷达旁',
    'Keep screen awake': '保持屏幕常亮',
    'Resource count': '资源数量',
    'Resource distance': '资源距离',
    'Resource tier color badges': '资源等级颜色角标',
    'Resource clusters': '资源聚类',
    'Radar settings': '雷达设置',
    'Detected Players': '已检测玩家',
    'No players detected yet': '尚未检测到玩家',
    'Scanning...': '扫描中…',
    'Show Health Bars': '显示血条',
    'Show Equipment': '显示装备',
    'Show Spells': '显示法术',
    'Show Guild Name': '显示公会名称',
    'Show Total IP': '显示总 IP',
    'Show Mounted Status': '显示骑乘状态',
    'Show Fishing Pools': '显示钓鱼点',
    'Detect players': '检测玩家',
    'Screen Flash': '屏幕闪烁',
    'Sound Alert': '声音提醒',
    'Pulsating Border While Hostile Nearby': '附近有敌对玩家时边框脉冲',
    'Player Types': '玩家类型',
    'Limits': '限制',
    'Enchant Level': '附魔等级',
    'Show Wisp Cages': '显示 Wisp 笼子',
    'Wisp signs (pre-portal)': 'Wisp 标记（传送门前）',
    'Show Knightfall Abbey': '显示 Knightfall Abbey',
    'Chests & Dungeons': '箱子与地下城',
    'Experimental features': '实验性功能',
    'Experimental': '实验性',
    'Not validated yet': '尚未验证',
    'Corrupted': '腐化',
    'Hellgate': 'Hellgate',
    'Green': '绿色',
    'Blue': '蓝色',
    'Purple': '紫色',
    'Yellow': '黄色',
    'All': '全选',
    'Clear': '清空',

    // ---------------------------------------------------------------------
    // Debug / logging settings labels
    // ---------------------------------------------------------------------
    'Show ID': '显示 ID',
    'Show Tier': '显示等级',
    'Show Name': '显示名称',
    'Show Category Badge': '显示类别角标',
    'Show DB Name': '显示数据库名称',
    'Show Player IDs': '显示玩家 ID',
    'Show unidentified enemies': '显示未识别敌人',
    'Show wisp ID (debug)': '显示 Wisp ID（调试）',
    'Merge entity updates per frame': '每帧合并实体更新',
    'Record Network Capture (pcap)': '录制网络抓包（pcap）',
    'Save backend logs': '保存后端日志',
    'Save browser logs': '保存浏览器日志',
    'Browser Console (F12)': '浏览器控制台（F12）',
    'Log Level': '日志级别',
    'Category Filters': '类别过滤',
    '(applies to DEBUG & INFO only)': '（仅适用于 DEBUG 和 INFO）',
    'System': '系统',
    'Map': '地图',
    'Mobs': '怪物',
    'Harvestables': '采集物',
    'Dungeons': '地下城',
    'Fishing': '钓鱼',
    'Network traffic': '网络流量',
    'Backend logs': '后端日志',
    'Danger Zone': '危险区域',
    'Reset All Settings': '重置所有设置',
    'Reset Settings': '重置设置',
    'Cancel': '取消',
    'close': '关闭',
    'Export Debug Data': '导出调试数据',
    'Loading network configuration…': '正在加载网络配置…',
    'Only the PC running the radar can change this.': '只有运行雷达的电脑才能修改此设置。',
    'Logs land in': '日志保存在',
    '. Backend errors are always saved to': '。后端错误始终保存到',
    '. Browser errors are saved only while this browser sends its logs (Settings > Logging > "Save browser logs").':
        '。仅当此浏览器上传日志时才会保存浏览器错误（设置 > 日志 > “保存浏览器日志”）。',
    'OFF - No logs': 'OFF - 不记录日志',
    'ERROR - Errors only': 'ERROR - 仅错误',
    'WARN - Warnings & Errors': 'WARN - 警告与错误',
    'INFO - Info, Warnings & Errors': 'INFO - 信息、警告与错误',
    'DEBUG - Everything': 'DEBUG - 全部内容',
    'Resets every radar setting and layout preference in this browser to its default, then reloads. Your ignore list is kept. Capture interfaces, backend logs and pcap recording are saved on the radar PC and are not changed.':
        '将此浏览器中的所有雷达设置和布局偏好重置为默认值，然后重新加载。忽略列表会保留。抓包网卡、后端日志和 pcap 录制保存在运行雷达的电脑上，不会被更改。',
    'Downloads registry settings, UI state and backend logging values as JSON. The ignore list is not included.':
        '以 JSON 下载设置注册表、界面状态和后端日志配置。不包含忽略列表。',

    // ---------------------------------------------------------------------
    // Long tooltips / descriptions (radar, players, enemies, chests, settings)
    // ---------------------------------------------------------------------
    'Width and height in pixels, shrunk on small windows. Ignored while Fit to screen is on.':
        '以像素为单位的宽和高，小窗口时会缩小。开启“适应屏幕”时忽略此项。',
    'Largest square that fits the window, up to 1200 px, next to the player list when the list sits beside. Overrides Max size.':
        '尽可能填满窗口的最大正方形（最大 1200 px）；玩家列表在侧边时会放在其旁边。会覆盖“最大尺寸”。',
    'Top-left box with the zone name, tier and a PvP marker.':
        '左上角信息框，显示区域名称、等级和 PvP 标记。',
    'Top-right box: resource and mob counts, plus player count when detection is on.':
        '右上角信息框：资源和怪物数量；开启检测时还会显示玩家数。',
    'Shows the player list to the right of the radar when the window is wide enough.':
        '窗口足够宽时，将玩家列表显示在雷达右侧。',
    'Stops the screen from sleeping while the radar page is open. Uses more battery on phones.':
        '雷达页面打开时阻止屏幕休眠。在手机上会更耗电。',
    'Estimated count from size/tier, bonuses excluded. Fishing shows spawned/total fish.':
        '根据大小/等级估算的数量，不含加成。钓鱼点显示已生成/总鱼数。',
    'Distance in meters: hidden under 2 m, green under 10 m, yellow 10-19 m, orange 20 m+.':
        '距离（米）：小于 2 米不显示，小于 10 米绿色，10-19 米黄色，20 米以上橙色。',
    'Colored squares by type instead of icons, with tier. Living creatures get a gold border.':
        '用按类型着色的方块代替图标，并显示等级。活体生物会带金色边框。',
    'Circles groups of nearby same-type nodes, with count and distance. Only nodes your filters show are grouped.':
        '圈出附近同类型节点的聚类，并显示数量和距离。只对过滤器显示出的节点聚类。',
    'Groups same-type, same-tier resources within this range. Default 30 m.':
        '在此范围内对同类型、同等级的采集物进行聚类。默认 30 米。',
    'Smallest group drawn as a cluster. Default: 2.':
        '绘制为聚类的最小数量。默认：2。',
    'Tracks players in range. Off: no player list, no player counts, no flash, border or sound.':
        '追踪范围内的玩家。关闭后：不显示玩家列表和数量，也没有闪烁、边框或声音。',
    'Flashes on threats: hostile players in yellow/red, anyone in black. Ignored names excluded.':
        '出现威胁时闪烁：敌对玩家为黄色/红色，黑区任何人都会触发。忽略名单中的名字除外。',
    'Pulses a red border around the radar while a threat is in range. Ignored names do not count.':
        '威胁在范围内时，雷达周围会红色边框脉冲。忽略名单中的名字不计入。',
    'Plays the alert sound on the radar PC, same trigger rule as Screen Flash. Ignored names never trigger it.':
        '在运行雷达的电脑上播放提醒音，触发规则与“屏幕闪烁”相同。忽略名单中的名字永远不会触发。',
    'Average item power of the gear the player wears.': '玩家所穿装备的平均物品强度。',
    'Shows health bar on player cards when health data is available.':
        '有生命值数据时，在玩家卡片上显示血条。',
    'Show players who are not flagged for PvP.': '显示未开启 PvP 标记的玩家。',
    'Show players flagged for faction warfare.': '显示已开启阵营战标记的玩家。',
    'Players flagged hostile, meaning everyone in black zones. Does not affect alerts.':
        '标记为敌对的玩家，即黑区内的所有人。不影响提醒。',
    'Maximum number of players to display (1-100). Default: 50':
        '最多显示的玩家数量（1-100）。默认：50',
    'Minimum delay between two alert sounds. At zero, every alert plays.':
        '两次提醒音之间的最小间隔。为 0 时每次提醒都会播放。',
    'Play the selected alert sound': '播放所选提醒音',
    'Decrease volume': '降低音量',
    'Increase volume': '提高音量',
    'Reset volume': '重置音量',
    'Decrease cooldown': '降低冷却',
    'Increase cooldown': '提高冷却',
    'Reset cooldown': '重置冷却',
    'Champion mobs, and solo mobs in random dungeons.':
        '冠军怪，以及随机地下城中的单人怪物。',
    'Hides enemies whose max HP is below the minimum, unidentified ones included. Drones, Mists bosses, events and living resources are exempt.':
        '隐藏最大生命值低于阈值的敌人（包括未识别的）。无人机、迷雾首领、活动怪和活资源怪不受影响。',
    'Not detected yet: no mob is classified as this type today.':
        '尚未检测到：目前没有怪物被归类为此类型。',
    'Display health bar on living resources (mobs).': '在活资源怪（生物）上显示血条。',
    'Corrupted dungeon entrances (PvP)': '腐化地下城入口（PvP）',
    'Hellgate portals (PvP)': 'Hellgate 传送门（PvP）',
    'Select which chest rarities to display on the radar.':
        '选择要在雷达上显示的箱子稀有度。',
    'Chests detection is still a work in progress. Some elements may not display correctly or at all.':
        '箱子检测仍在开发中，部分元素可能显示不正确或完全不显示。',
    'Configure chest, mist, and dungeon detection settings.':
        '配置箱子、迷雾和地下城检测设置。',
    'Configure enemy and mob detection settings.': '配置敌人和怪物检测设置。',
    'The lowest level shown, though DEBUG and INFO also need their category on. OFF disables all logging.':
        '显示的最低日志级别，但 DEBUG 和 INFO 还需要开启对应类别。OFF 会禁用所有日志。',
    'Keep DEBUG and INFO entries of this area. WARN and above ignore this filter.':
        '保留此区域的 DEBUG 和 INFO 记录。WARN 及以上级别不受此过滤影响。',
    'Saves filtered entries on the radar PC in logs/debug/. Errors are also copied to logs/errors/.':
        '将过滤后的记录保存在运行雷达的电脑的 logs/debug/ 中。错误也会复制到 logs/errors/。',
    'Logs one line per game event to logs/sessions/. Only changeable on the radar PC.':
        '将每个游戏事件记录为 logs/sessions/ 中的一行。只能在运行雷达的电脑上修改。',
    'Records UDP 5056 traffic to logs/captures/, one file per interface. PC-only setting.':
        '将 UDP 5056 流量录制到 logs/captures/，每个网卡一个文件。仅限电脑端设置。',
    'Keeps only the latest move, health and regen update per entity each frame.':
        '每帧只为每个实体保留最新的移动、生命值和回复更新。',
    'Shows enemies missing from mob data, usually new post-update mobs. Type filters skip them.':
        '显示怪物数据中缺失的敌人，通常是更新后新增的怪物。类型过滤会跳过它们。',
    'Draws the internal type ID on resource nodes and living resources (debug).':
        '在资源节点和活资源怪上绘制内部类型 ID（调试）。',
    'Shows the DB name mapped from the wire type ID (debug, for offset verification).':
        '显示由网络类型 ID 映射得到的数据库名称（调试，用于校验偏移）。',

    // ---------------------------------------------------------------------
    // Radar page (labels, increments, tooltips)
    // ---------------------------------------------------------------------
    'Decrease zoom': '缩小',
    'Increase zoom': '放大',
    'Reset zoom': '重置缩放',
    'Decrease max size': '减小最大尺寸',
    'Increase max size': '增大最大尺寸',
    'Reset max size': '重置最大尺寸',
    'Decrease icon size': '减小图标尺寸',
    'Increase icon size': '增大图标尺寸',
    'Reset icon size': '重置图标尺寸',

    // ---------------------------------------------------------------------
    // Players page
    // ---------------------------------------------------------------------
    'Configure player detection and display settings.': '配置玩家检测与显示设置。',
    "Why can't I see players on the radar?": '为什么雷达上看不到玩家？',
    'The game only sends player names, not their positions. We can detect who enters your zone but cannot display them on the map.':
        '游戏只发送玩家名称，不发送位置。我们可以检测到谁进入了你的区域，但无法在地图上显示他们。',
    'Learn more': '了解更多',

    // ---------------------------------------------------------------------
    // Resources page / resource categories + tier matrix
    // ---------------------------------------------------------------------
    'Configure which resources to display on the radar.': '设置雷达上要显示的资源。',
    'Fiber': '纤维',
    'Hide': '兽皮',
    'Wood': '木材',
    'Ore': '矿石',
    'Rock': '石头',
    'Other': '其他',
    'Living': '活体',
    'Static': '静态',
    'Resource': '资源',
    'Living Fiber': '活体纤维',
    'Living Hide': '活体兽皮',
    'Living Wood': '活体木材',
    'Living Ore': '活体矿石',
    'Living Rock': '活体石头',
    'Static Fiber': '静态纤维',
    'Static Hide': '静态兽皮',
    'Static Wood': '静态木材',
    'Static Ore': '静态矿石',
    'Static Rock': '静态石头',
    'Living resources': '活资源怪',
    'Static resources': '静态资源',

    // ---------------------------------------------------------------------
    // Enemies page
    // ---------------------------------------------------------------------
    'Classic Enemies': '经典敌人',
    'Mists Bosses': '迷雾首领',
    'Other Enemies': '其他敌人',
    'Event Enemies': '活动敌人',
    'Show enemies with minimum HP': '只显示生命值不低于阈值的敌人',
    'Logging options in': '日志选项位于',
    'Settings > Logging': '设置 > 日志',
    ', debug options in': '，调试选项位于',
    'Settings > Debug': '设置 > 调试',

    // ---------------------------------------------------------------------
    // Ignore list page
    // ---------------------------------------------------------------------
    'Names on this list never trigger the alert sound, the screen flash or the red border. Ignored players still appear in the player list.':
        '此列表中的名字永远不会触发提醒音、屏幕闪烁或红色边框。被忽略的玩家仍会出现在玩家列表中。',

    // ---------------------------------------------------------------------
    // Settings page
    // ---------------------------------------------------------------------
    'Logging, debug, network and reset options.': '日志、调试、网络与重置选项。',
    'Mists': '迷雾',

    // ---------------------------------------------------------------------
    // Network settings (dynamically rendered by NetworkSettingsHandler)
    // ---------------------------------------------------------------------
    'Failed to load network configuration.': '加载网络配置失败。',
    'Capture interfaces': '抓包网卡',
    'Captured packets are merged across all checked interfaces. Tick at least one to start capture.':
        '抓到的数据包会合并所有勾选的网卡。至少勾选一个网卡才能开始抓包。',
    'Refresh list': '刷新列表',
    'Apply changes': '应用更改',
    'LAN access': '局域网访问',
    'Reachable from devices on the same local network. Independent of the capture interfaces above.':
        '可从同一局域网内的设备访问，与上方抓包网卡无关。',
    'No LAN address detected.': '未检测到局域网地址。',
    'Using ExitLag?': '正在使用 ExitLag？',
    'Open': '打开',
    'and select': '并选择',
    'ExitLag → Settings → Advanced Options → Redirection method':
        'ExitLag → 设置 → 高级选项 → 重定向方式',
    'NDIS (legacy)': 'NDIS（旧版）',
    "The default WFP mode hides Albion's traffic from packet capture; the radar will see no packets.":
        '默认的 WFP 模式会让抓包看不到 Albion 的流量；雷达将收不到任何数据包。',
    '(unavailable)': '（不可用）',
    '⚠ Capture not running. Pick at least one interface below to start.':
        '⚠ 未在抓包。请在下方至少选择一个网卡以开始。',
    '🛜 WiFi': '🛜 WiFi',
    '🔌 Ethernet': '🔌 以太网',
    '🚀 ExitLag': '🚀 ExitLag',
    '🔒 VPN': '🔒 VPN',
    '🧪 Virtual': '🧪 虚拟',
    '• Other': '• 其他',

    // ---------------------------------------------------------------------
    // Runtime messages (toasts, database overlay)
    // ---------------------------------------------------------------------
    'Failed to initialize radar': '雷达初始化失败',
    'Connected to radar backend': '已连接到雷达后端',
    'Connection lost': '连接已断开',
    'Settings reset successfully': '设置已重置',
    'Capture interfaces updated.': '抓包网卡已更新。',
    'Refresh failed.': '刷新失败。',
    'Radar backend unreachable': '雷达后端无法连接',
    'Threat sound unavailable. The machine running the radar could not play it.':
        '威胁提示音不可用，运行雷达的电脑无法播放。',

    // ---------------------------------------------------------------------
    // Alert sound option labels
    // ---------------------------------------------------------------------
    'Default': '默认',
    'Brass': '铜管',
    'Buzzer': '蜂鸣',
    'Coin': '金币',
    'Drums': '鼓',
    'Piano': '钢琴',
    'Pop': '弹响',
    'Vibraphone': '颤音琴',

    // ---------------------------------------------------------------------
    // Canvas HUD labels (drawn through translate())
    // ---------------------------------------------------------------------
    'players': '玩家',
    'resources': '资源',
    'mobs': '怪物',
    'stacks': '堆'
};

// Dynamic messages that contain interpolated values cannot be dictionary keys.
// Each rule receives the regex match and returns the localized text.
const DATABASE_NAMES = {
    Items: '物品',
    Spells: '法术',
    Harvestables: '采集物',
    Mobs: '怪物',
    Zones: '区域'
};

const PAGE_NAMES = {
    radar: '雷达',
    players: '玩家',
    resources: '资源',
    enemies: '敌人',
    chests: '箱子',
    ignorelist: '忽略列表',
    settings: '设置'
};

const PATTERNS = [
    [/^Failed to load (.+) database$/, match => {
        const name = DATABASE_NAMES[match[1]] ?? match[1];
        return DATABASE_NAMES[match[1]] ? `无法加载${name}数据库` : `无法加载 ${name} 数据库`;
    }],
    [/^Failed to initialize (.+) page$/, match => {
        const page = PAGE_NAMES[match[1]] ?? match[1];
        return PAGE_NAMES[match[1]] ? `初始化${page}页面失败` : `初始化 ${page} 页面失败`;
    }],
    [/^Apply failed: ([\s\S]+)$/, match => `应用失败：${match[1]}`],
    [/^Network error: ([\s\S]+)$/, match => `网络错误：${match[1]}`],
    [/^Refresh error: ([\s\S]+)$/, match => `刷新错误：${match[1]}`],
    [/^✓ Capturing on (\d+) interfaces?\.$/, match => `✓ 正在抓包：${match[1]} 个网卡。`]
];

// Attributes that carry user-visible English copy.
const TRANSLATED_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt', 'data-tip'];
const ATTRIBUTE_SELECTOR = TRANSLATED_ATTRIBUTES.map(attr => `[${attr}]`).join(',');
const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE']);

const enCache = new WeakMap(); // element -> {attribute: englishText}

function getLang() {
    try {
        return localStorage.getItem(STORAGE_KEY) === 'zh' ? 'zh' : 'en';
    } catch (e) {
        return 'en';
    }
}

/**
 * Looks up a translation for an exact English string.
 * Returns null when the string is not part of the dictionary.
 */
function lookup(text) {
    if (!text) return null;
    if (Object.prototype.hasOwnProperty.call(ZH, text)) return ZH[text];
    for (const [pattern, render] of PATTERNS) {
        const match = pattern.exec(text);
        if (match) return render(match);
    }
    return null;
}

/**
 * Translates a single string for the current language.
 * Used by code that draws text itself (canvas HUD, cluster info box).
 */
function translate(text) {
    if (getLang() !== 'zh') return text;
    const translated = lookup(text);
    return translated === null ? text : translated;
}

function translateTextNode(node) {
    const raw = node.nodeValue;
    if (!raw) return;
    const trimmed = raw.trim();
    if (!trimmed) return;

    // Remember the English original; also refresh it when the app rewrites the
    // node with a new translatable string (connection status, counters, ...).
    const translated = lookup(trimmed);
    if (translated !== null) node.__i18nEn = trimmed;

    const source = node.__i18nEn;
    if (!source) return;

    const zhText = lookup(source) ?? source;
    const current = getLang() === 'zh' ? zhText : source;

    // An unrelated runtime value replaced our node (error text, user data, ...):
    // forget the cached original instead of overwriting it.
    if (trimmed !== current && trimmed !== (getLang() === 'zh' ? source : zhText)) {
        delete node.__i18nEn;
        return;
    }

    if (current === trimmed) return;

    const start = raw.indexOf(trimmed);
    node.nodeValue = raw.slice(0, start) + current + raw.slice(start + trimmed.length);
}

function walkTextNodes(root, visit) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
        visit(root);
        return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE
        && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
        return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            const parent = node.parentElement;
            if (parent && SKIPPED_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    let node = walker.nextNode();
    while (node) {
        visit(node);
        node = walker.nextNode();
    }
}

function translateAttributes(root) {
    if (!root || typeof root.querySelectorAll !== 'function') return;

    const lang = getLang();
    const elements = [];
    if (root.nodeType === Node.ELEMENT_NODE && root.matches(ATTRIBUTE_SELECTOR)) elements.push(root);
    elements.push(...root.querySelectorAll(ATTRIBUTE_SELECTOR));

    for (const el of elements) {
        for (const attr of TRANSLATED_ATTRIBUTES) {
            const current = el.getAttribute(attr);
            if (!current) continue;

            let stored = enCache.get(el);
            if (!stored) {
                stored = Object.create(null);
                enCache.set(el, stored);
            }

            // Remember the English original; refresh it when the app rewrites the
            // attribute with a new translatable string.
            const hit = lookup(current);
            if (hit !== null) stored[attr] = current;

            const source = stored[attr];
            if (!source) continue;

            const zhText = lookup(source) ?? source;
            const target = lang === 'zh' ? zhText : source;
            const other = lang === 'zh' ? source : zhText;

            // An unrelated runtime value replaced the attribute: forget the
            // cached original instead of overwriting it.
            if (current !== target && current !== other) {
                delete stored[attr];
                continue;
            }

            if (current !== target) el.setAttribute(attr, target);
        }
    }
}

function applyI18n(root) {
    if (!root) return;

    const lang = getLang();

    // This also covers <title> ("OpenRadar - Radar"): the document title is the
    // text of that element, so no separate handling is needed.
    walkTextNodes(root, translateTextNode);
    translateAttributes(root);

    // Toggle button label reflects the *other* language (what you switch to)
    const toggleText = document.getElementById('langToggleText');

    if (toggleText) {
        const target = lang === 'zh' ? 'EN' : '中文';
        if (toggleText.textContent !== target) toggleText.textContent = target;
    }

    const html = document.documentElement;
    if (html) {
        html.setAttribute('data-ui-lang', lang);
        html.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    }
}

function setLang(lang) {
    const next = lang === 'zh' ? 'zh' : 'en';
    try {
        localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
        // ignore storage failures (private mode)
    }
    applyI18n(document);
    document.dispatchEvent(new CustomEvent('uiLanguageChanged', {detail: {lang: next}}));
}

function ensureToggle() {
    const btn = document.getElementById('langToggleBtn');

    if (!btn || btn.dataset.bound === '1') {
        return;
    }

    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
        setLang(getLang() === 'zh' ? 'en' : 'zh');
    });
}

let scheduled = false;

function scheduleApply() {
    if (scheduled) {
        return;
    }

    scheduled = true;
    requestAnimationFrame(() => {
        scheduled = false;
        ensureToggle();
        applyI18n(document);
    });
}

function init() {
    ensureToggle();
    applyI18n(document);

    // htmx swaps sidebar pages in place; re-apply after each settle.
    document.body.addEventListener('htmx:afterSettle', scheduleApply);

    // Dynamic content (settings controls, player cards, toasts, network panel)
    // is rendered asynchronously, so watch the DOM. Only childList is observed:
    // translations rewrite text nodes (characterData) and attributes, which keeps
    // this observer from feeding itself.
    const observer = new MutationObserver(scheduleApply);
    observer.observe(document.documentElement, {childList: true, subtree: true});
}

// Canvas renderers (RadarRenderer, DrawingUtils) call this for HUD labels.
if (typeof window !== 'undefined') {
    window.__radarI18nTranslate = translate;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export {applyI18n, setLang, getLang, translate, ZH};
