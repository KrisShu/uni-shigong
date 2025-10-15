import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

/**
 * useContentHeight - 获取减去底部 tabBar 后的内容区域高度
 * @param tabBarHeight 底部 tabBar 高度，默认 50
 * @returns { contentHeight } 响应式高度
 */
export function useContentHeight(tabBarHeight: number = 50): { contentHeight: Ref<number> } {
    const contentHeight = ref(0);

    const updateHeight = () => {
        let height = 0;

        // H5 平台
        // #ifdef H5
        height = window.innerHeight - tabBarHeight;
        // #endif

        // App / 微信小程序 / 支付宝小程序 / QQ小程序
        // #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-QQ
        const systemInfo = uni.getSystemInfoSync();
        height = systemInfo.windowHeight - tabBarHeight;
        // #endif

        contentHeight.value = height;
    };

    onMounted(() => {
        updateHeight();
        // H5 监听窗口变化
        // #ifdef H5
        window.addEventListener('resize', updateHeight);
        // #endif
    });

    onUnmounted(() => {
        // H5 移除监听
        // #ifdef H5
        window.removeEventListener('resize', updateHeight);
        // #endif
    });

    return {
        contentHeight,
    };
}
