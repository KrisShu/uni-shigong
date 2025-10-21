<!--我的项目列表 -->
<template>
    <view class="content">
        <image class="logo" src="/static/logo.png" />
        <view class="text-area">
            <text class="title">{{ title }}</text>
        </view>
        <view>
            <text>{{ systemLocale }}</text>
        </view>
        <view>
            <text @click="switchLocale('zh-Hans')">{{ $t('locale.zh-hans') }}</text>
            <text>|</text>
            <text @click="switchLocale('en')">{{ $t('locale.en') }}</text>
        </view>

        <view @click="toLogin"> 跳转至登录页 </view>

        <LockButton :onClick="submitPay">确认启动</LockButton>

        <button @click="openCamera">调用相机</button>

        <view class="progress-demo">
            <ProgressBar :system-progress="50" :worker-progress="40" />
            <text>工人进度慢于系统进度（延期）</text>

            <ProgressBar :system-progress="60" :worker-progress="70" />
            <text>工人进度快于系统进度</text>

            <ProgressBar :system-progress="60" :worker-progress="60" />
            <text>工人进度与系统进度一致</text>
        </view>

        <!--  -->
        <view class="clock-row">
            <!-- 施工签到按钮 -->
            <view class="clock-btn" :class="{ disabled: signIned }" @click="handleSignIn">
                <text>今日施工签到</text>
                <text class="clock-time">（{{ signInTime }}）</text>
            </view>
            <!-- 施工签退按钮 -->
            <view class="clock-btn" :class="{ disabled: signOuted }" @click="handleSignOut">
                <text>今日施工签退</text>
                <text class="clock-time">（{{ signOutTime }}）</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import { i18n } from '@/main';
    import { reLaunch } from '@/utils/navigate';
    import LockButton from '@/components/LockButton/index.vue';
    import ProgressBar from '@/components/ProgressBar/index.vue';

    const title = ref('Hello');
    let systemInfo = uni.getSystemInfoSync();
    let systemLocale = uni.getLocale();
    console.log('111', systemInfo, systemLocale);
    // let systemLocale = systemInfo.locale;
    const switchLocale = (locale: string) => {
        i18n.global.locale = locale;
        uni.setLocale(locale);
    };

    const toLogin = () => {
        reLaunch({
            url: '/pages/login/index',
        });
    };

    // 校验按钮多次点击

    const submitPay = async () => {
        uni.showModal({
            title: i18n.global.t('mine.title'),
            content: '这是一个模态弹窗',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            },
        });
        console.log('submitPay');
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, 3000);
        });
    };

    // 调用相机
    const openCamera = () => {
        uni.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success: function (res) {
                console.log(res.tempFilePaths);
            },
        });
    };

    // 打卡相关

    const signIned = ref(false);
    const signOuted = ref(false);
    const signInTime = ref('--:--:--');
    const signInTime_compelete = ref('');
    const signOutTime = ref('--:--:--');
    const signOutTime_compelete = ref('');

    let timer: number;

    function getNowTimeStr(type: string = 'yyyy-MM-dd HH:mm:ss'): string {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');

        if (type === 'HH:mm:ss') {
            return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        }
        if (type === 'yyyy-MM-dd') {
            return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        }
        if (type === 'start') {
            const year = now.getFullYear() - 10;
            return `${year}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        }
        if (type === 'end') {
            const year = now.getFullYear() + 10;
            return `${year}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        }

        return (
            `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
            `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        );
    }

    const updateClock = () => {
        if (!signIned.value) signInTime.value = getNowTimeStr('HH:mm:ss');
        if (!signOuted.value) signOutTime.value = getNowTimeStr('HH:mm:ss');
    };

    const handleSignIn = () => {
        if (signIned.value) return;
        signIned.value = true;
        signInTime.value = getNowTimeStr('HH:mm:ss');
        signInTime_compelete.value = getNowTimeStr();

        console.log('signIned', signInTime.value, signInTime_compelete.value);
    };
    const handleSignOut = () => {
        if (signOuted.value) return;
        signOuted.value = true;
        signOutTime.value = getNowTimeStr('HH:mm:ss');
    };

    onMounted(() => {
        updateClock();
        timer = setInterval(updateClock, 1000);
    });
    onUnmounted(() => {
        clearInterval(timer);
    });
</script>

<style>
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .logo {
        height: 200rpx;
        width: 200rpx;
        margin-top: 200rpx;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 50rpx;
    }

    .text-area {
        display: flex;
        justify-content: center;
    }

    .title {
        font-size: 36rpx;
        color: #8f8f94;
    }

    .progress-demo {
        width: 400px;
        margin: 40px auto;
    }

    .clock-row {
        display: flex;
        justify-content: center;
        gap: 40px;
        margin: 40px 0;
    }
    .clock-btn {
        width: 120px;
        height: 120px;
        border-radius: 60px;
        background: #ccc;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: background 0.3s;
        user-select: none;
    }
    .clock-btn .clock-time {
        font-size: 14px;
        margin-top: 6px;
    }
    .clock-btn.disabled {
        background: #e5e5e5;
        color: #aaa;
        pointer-events: none;
    }
    .clock-btn:not(.disabled):nth-child(2) {
        background: #001a7d;
    }
</style>
