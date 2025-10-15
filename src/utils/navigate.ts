/**
 * 通用参数类型定义
 */
interface RouterParam {
    url: string;
    query?: Record<string, any>;
    success?: (res: any) => void;
    fail?: (res: any) => void;
    complete?: (res: any) => void;
    events?: Record<string, any>;
    delta?: number;
}

/**
 * 跳转到 tabBar 页面（关闭其他页面）
 */
export function switchTab(param: RouterParam): void {
    uni.switchTab({
        url: param.url,
        success: param.success,
        fail: param.fail,
        complete: param.complete,
    });
}

/**
 * 关闭所有页面，重新打开指定页面
 */
export function reLaunch(param: RouterParam): void {
    uni.reLaunch({
        url: param.url + formatUrl(param.url, param.query),
        success: param.success,
        fail: param.fail,
        complete: param.complete,
    });
}

/**
 * 关闭当前页面并跳转（不能跳到 tabbar 页面）
 */
export function redirectTo(param: RouterParam): void {
    uni.redirectTo({
        url: param.url + formatUrl(param.url, param.query),
        success: param.success,
        fail: param.fail,
        complete: param.complete,
    });
}

/**
 * 保留当前页面并跳转（不能跳到 tabbar 页面）
 */
export function navigateTo(param: RouterParam): void {
    const pages = getCurrentPages();
    console.log(pages, 'navigateTo');

    if (pages.length >= 10) {
        redirectTo(param);
        return;
    }

    uni.navigateTo({
        url: param.url + formatUrl(param.url, param.query),
        events: param.events,
        success: param.success,
        fail: param.fail,
        complete: param.complete,
    });
}

/**
 * 返回上一页或多级页面
 */
export function navigateBack(param: RouterParam = { url: '', delta: 1 }): void {
    uni.navigateBack({
        delta: param.delta,
        success: param.success,
        fail: param.fail,
        complete: param.complete,
    });
}

/**
 * 格式化 URL 参数
 * { a: 1, b: 2 } => ?a=1&b=2
 */
function formatUrl(initUrl = '', query: Record<string, any> = {}): string {
    let firstCode = '?';
    if (initUrl.includes('?')) {
        firstCode = initUrl.endsWith('&') ? '' : '&';
    }

    const queryKeys = Object.keys(query);
    if (!queryKeys.length) return '';

    return firstCode + queryKeys.map(key => `${key}=${encodeURIComponent(query[key])}`).join('&');
}

export default {
    switchTab,
    reLaunch,
    redirectTo,
    navigateTo,
    navigateBack,
};
