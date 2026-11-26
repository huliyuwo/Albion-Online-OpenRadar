// I18n.js - UI language switching (zh-CN / en)
//
// The radar UI is server-rendered in English. Rather than rewriting every Go
// template, translations are applied on the client by mapping the English text
// of known UI nodes to Chinese. Anything missing from the dictionary simply
// stays English, so the dictionary can grow incrementally.
//
// The choice is persisted in localStorage and re-applied after every HTMX swap
// (the sidebar/pages are swapped in place) and after dynamic settings render.

const STORAGE_KEY = 'radarUiLanguage';

const ZH = {
    // Navigation
    'Radar': '雷达',
    'Players': '玩家',
    'Resources': '资源',
    'Enemies': '敌人',
    'Chests': '箱子',
    'Ignore List': '忽略列表',
    'Settings': '设置',

    // Page headers / subtitles
    'Configure which resources to display on the radar.': '设置雷达上要显示的资源。',
    'Configure which enemies to display on the radar.': '设置雷达上要显示的敌人。',
    'Configure which chests to display on the radar.': '设置雷达上要显示的箱子。',
    'Configure which players to display on the radar.': '设置雷达上要显示的玩家。',
    'Manage players that should never be shown on the radar.': '管理永远不在雷达上显示的玩家。',
    'Configure the radar, network capture and alerts.': '配置雷达、抓包与提醒。',

    // Resource groups
    'Fiber': '纤维',
    'Hide': '皮',
    'Wood': '木材',
    'Ore': '矿物',
    'Rock': '石头',
    'Other': '其他',
    'Display': '显示',
    'Show Fishing Pools': '显示钓鱼点',
    'Show Health Bars': '显示血条',

    // Header / buttons
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

    // Common settings labels
    'Icon Size': '图标大小',
    'Resource tier color badges': '资源等级颜色角标',
    'Resource count': '资源数量',
    'Resource distance': '资源距离',
    'Resource clusters': '资源聚类',
    'Cluster radius': '聚类半径',
    'Cluster min size': '聚类最小数量',
    'Show Players': '显示玩家',
    'Show player health bars': '显示玩家血条',
    'Show guild': '显示公会',
    'Show mounted': '显示骑乘',
    'Show equipment': '显示装备',
    'Show spells': '显示法术',
    'Max displayed players': '最大显示玩家数',
    'Passive players': '被动玩家',
    'Faction players': '阵营玩家',
    'Hostile players': '敌对玩家',
    'Living resources': '活的资源怪',
    'Static resources': '静态资源',
    'Living Fiber': '活纤维怪',
    'Living Hide': '活皮怪',
    'Living Wood': '活木怪',
    'Living Ore': '活矿怪',
    'Living Rock': '活石怪',
    'Static Fiber': '静态纤维',
    'Static Hide': '静态皮',
    'Static Wood': '静态木',
    'Static Ore': '静态矿',
    'Static Rock': '静态石',

    // Alerts
    'Alerts': '提醒',
    'Alert flash': '提醒闪烁',
    'Play sound': '播放声音',
    'Alert sound': '提醒声音',

    // Network / logging
    'Network': '网络',
    'Capture interfaces': '抓包网卡',
    'Server logs': '服务端日志',
    'PCAP recording': 'PCAP 录制',
    'Logging': '日志',
    'Debug': '调试',
    'UI': '界面',
    'General': '通用',

    // Language control itself
    'Language': '语言',
    'English': 'English',
    'Chinese': '中文'
};

const EN_TO_ZH = ZH;

function getLang() {
    try {
        return localStorage.getItem(STORAGE_KEY) === 'zh' ? 'zh' : 'en';
    } catch (e) {
        return 'en';
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

/**
 * Translates the current UI tree.
 * English originals are cached on each node (`data-i18n-en`) so switching back
 * to English restores the exact source text.
 */
function applyI18n(root) {
    if (!root) {
        return;
    }

    const lang = getLang();
    const elements = root.querySelectorAll(
        '#desktop-nav a span, #mobile-nav a span, header h1, header span, ' +
        'h1, h2, h3, .collapse-title span, [data-setting-label], ' +
        'button span, label span, p.text-base-content\\/60, .card-body p'
    );

    elements.forEach(el => {
        if (el.children.length > 0) {
            return;
        }

        const text = el.textContent.trim();

        if (!text) {
            return;
        }

        if (!el.dataset.i18nEn) {
            el.dataset.i18nEn = text;
        }

        const source = el.dataset.i18nEn;
        const translated = EN_TO_ZH[source];

        if (!translated) {
            return;
        }

        const target = lang === 'zh' ? translated : source;

        if (el.textContent !== target) {
            el.textContent = target;
        }
    });

    // Toggle button label reflects the *other* language (what you switch to)
    const toggleText = document.getElementById('langToggleText');

    if (toggleText) {
        toggleText.textContent = lang === 'zh' ? 'EN' : '中文';
    }

    document.documentElement.setAttribute('data-ui-lang', lang);
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

    // SettingControls render toggles/sliders asynchronously, so watch the DOM.
    const observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, {childList: true, subtree: true});
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export {applyI18n, setLang, getLang, ZH};
