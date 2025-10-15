import { ref, onBeforeMount } from 'vue';

// 定义系统信息的类型（可以根据 uni.getSystemInfoSync() 的实际返回值调整）
interface SystemInfo {
    statusBarHeight: number;
    system: string;
}

export default () => {
    // 状态栏高度（px）
    const status = ref<number>(0);
    // 导航栏高度（px）
    const navHeight = ref<number>(0);

    const setNavSize = (): void => {
        const { statusBarHeight, system } = uni.getSystemInfoSync() as SystemInfo;
        status.value = statusBarHeight * 2; // rpx 转 px 的逻辑，假设设计稿是750rpx
        const isIOS = /iOS/i.test(system); // 更健壮的判断方式

        navHeight.value = isIOS ? 88 : 96;
    };

    onBeforeMount(() => {
        setNavSize();
    });

    return {
        status,
        navHeight,
    };
};
