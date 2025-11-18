import { ref } from 'vue';
import { throttle } from '@/utils/common';

interface UseScrollListenerOptions {
    /** 离开顶部的阈值，超过这个距离视为“离开顶部” */
    topLeave?: number;
    /** 滚动节流时间 */
    throttleMs?: number;
    /** 顶部状态变化回调：true = 在顶部；false = 离开顶部 */
    onTopChange?: (isAtTop: boolean) => void;
}
export function useScrollListener(options: UseScrollListenerOptions = {}) {
    const { topLeave = 200, throttleMs = 80, onTopChange } = options;

    // 供 <scroll-view> 绑定的 scroll-top
    const scrollTop = ref(0);

    // 当前是否“在顶部”：true = 顶部（显示卡片），false = 离开顶部（隐藏卡片）
    let lastState = true;

    // 切 Tab / 强制顶部 时，忽略接下来一次 scroll 事件，避免惯性滚动把状态改回去
    let ignoreNextScroll = false;

    /** 重置到顶部：内部用 0 / 1 抖一下，兼容 uni-app 的 scroll-top 刷新机制 */
    const resetToTop = () => {
        scrollTop.value = scrollTop.value === 0 ? 1 : 0;
        // 同时认为回到了顶部，通知外部
        if (!lastState) {
            lastState = true;
            onTopChange && onTopChange(true);
        }
    };
    /** 强制视为“回到顶部”：重置 scrollTop + 状态 + 忽略一次滚动 */
    const forceTop = () => {
        // 触发 scroll-view 回到顶部（0/1 抖一下是 uni 的老毛病）
        scrollTop.value = scrollTop.value === 0 ? 1 : 0;

        lastState = true;
        ignoreNextScroll = true;
        onTopChange && onTopChange(true);
    };

    /** 滚动中：只负责“离开顶部” */
    const onScroll = throttle((e: any) => {
        // 如果刚 forceTop 过，忽略本次 scroll，防止惯性滚动把状态又改成 false
        if (ignoreNextScroll) {
            ignoreNextScroll = false;
            return;
        }

        const raw = e?.detail?.scrollTop ?? 0;
        const current = Math.max(0, Math.round(raw));

        // 只有在当前是顶部 && 滚动超过阈值，才认为离开顶部
        if (lastState && current > topLeave) {
            lastState = false;
            onTopChange && onTopChange(false);
        }
    }, throttleMs);

    /** 滚到顶部：只负责“回到顶部” */
    const onScrollToUpper = () => {
        if (!lastState) {
            lastState = true;
            onTopChange && onTopChange(true);
        }
    };

    return {
        scrollTop,

        onScroll,
        onScrollToUpper,
        // resetToTop,
        forceTop,
    };
}

export default useScrollListener;
