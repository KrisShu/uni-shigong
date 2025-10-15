import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
    state: () => ({
        userInfo: null,
        token: '',
        locale: 'zh-Hans',
    }),
    actions: {
        setUserInfo(info: any) {
            this.userInfo = info;
        },
        setToken(token: string) {
            this.token = token;
        },
        setLocale(locale: string) {
            this.locale = locale;
        },
        loginOut() {
            this.setUserInfo(null);
            this.setToken('');
            uni.removeStorageSync('userInfo');
            uni.removeStorageSync('token');
            // 关闭所有页面，跳转到登录页
            uni.reLaunch({
                url: '/pages/login/index',
            });
        },
    },
    /**
     * 类似于组件的computed，用来封装计算属性,有缓存的功能
     */
    getters: {
        getToken(): any {
            return this.token || uni.getStorageSync('token') || '';
        },
    },
    persist: true,
});
