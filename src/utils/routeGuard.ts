import { useGlobalStore } from '@/stores/index';

/**
 * 注册全局路由守卫
 */
export function setupRouteGuard() {
    const GlobalStore = useGlobalStore();

    // 拦截 navigateTo
    uni.addInterceptor('navigateTo', {
        invoke(e) {
            // 如果不是登录页且未登录
            if (!GlobalStore.token && !e.url.includes('/pages/login/index')) {
                uni.reLaunch({ url: '/pages/login/index' });
                return false; // 阻止继续跳转
            }
        },
    });

    // 拦截 switchTab
    uni.addInterceptor('switchTab', {
        invoke(e) {
            if (!GlobalStore.token && !e.url.includes('/pages/login/index')) {
                uni.reLaunch({ url: '/pages/login/index' });
                return false;
            }
        },
    });

    // 拦截 reLaunch
    uni.addInterceptor('reLaunch', {
        invoke(e) {
            if (!GlobalStore.token && !e.url.includes('/pages/login/index')) {
                uni.reLaunch({ url: '/pages/login/index' });
                return false;
            }
        },
    });
}
