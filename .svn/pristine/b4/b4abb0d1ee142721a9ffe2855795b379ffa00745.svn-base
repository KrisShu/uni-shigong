// src/utils/useSmartBack.ts
const TABBAR_PAGES = ['/pages/index/index', '/pages/mine/index'] as const;

function normalize(url: string) {
    return url.replace(/\?.*$/, ''); // 去掉查询串只比路径
}
function isTabbar(url: string) {
    return TABBAR_PAGES.includes(normalize(url) as any);
}

/**
 * 智能返回：
 * 1) 有页面栈 -> navigateBack
 * 2) H5 history 可退 -> window.history.back()
 * 3) 兜底 -> fallback 是 tabbar 用 switchTab，否则 reLaunch
 */
function smartBackCore(fallback = '/pages/index/index') {
    const pages = getCurrentPages();
    if (pages.length > 1) {
        uni.navigateBack();
        return;
    }
    // @ts-ignore H5 才有 window
    if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
        // @ts-ignore
        window.history.back();
        return;
    }
    if (isTabbar(fallback)) {
        uni.switchTab({ url: fallback });
    } else {
        uni.reLaunch({ url: fallback });
    }
}

export function useSmartBack() {
    return {
        smartBack: smartBackCore,
        isTabbar,
        TABBAR_PAGES,
    };
}
