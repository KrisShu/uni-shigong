<template>
    <view class="boot">
        <!-- 背景粒子 -->
        <view class="bg">
            <view class="dot" v-for="n in 12" :key="n" :style="{ '--i': n }"></view>
        </view>

        <!-- 中央卡片 -->
        <view class="card">
            <!-- 霓虹光圈 -->
            <view class="ring"></view>

            <!-- Logo / App 名称 -->
            <view class="brand">
                <!-- 替换成你的 logo 路径 -->
                <image class="logo" src="../../assets/images/login-img.png" mode="aspectFit" />
                <text class="title">Project Dashboard</text>
            </view>

            <!-- 进度条 -->
            <view class="progress">
                <view class="bar">
                    <view class="fill" :style="{ width: progress + '%' }"></view>
                </view>
                <view class="percent">{{ progress }}%</view>
            </view>

            <!-- 小提示（淡入淡出轮播） -->
            <view class="tips">
                <text v-for="(t, i) in tips" :key="t" class="tip" :class="{ show: tipIndex === i }">
                    {{ t }}
                </text>
            </view>

            <!-- 细提示 -->
            <view class="sub">Initializing, please wait…</view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { onLoad } from '@dcloudio/uni-app';
    import { ref, onUnmounted } from 'vue';
    import { useGlobalStore } from '@/stores';

    /** 进度条动画：先自动到 90%，初始化完成后补到 100% */
    const progress = ref(0);
    let progTimer: number | null = null;

    /** 小提示轮播 */
    const tips = ['Syncing your workspace', 'Checking login status', 'Preparing resources'];
    const tipIndex = ref(0);
    let tipTimer: number | null = null;

    function startProgress() {
        stopProgress();
        progTimer = window.setInterval(() => {
            if (progress.value < 90) {
                progress.value += 1;
            } else {
                // 等初始化完成再到 100
                clearInterval(progTimer!);
                progTimer = null;
            }
        }, 18);
    }
    function stopProgress() {
        if (progTimer) {
            clearInterval(progTimer);
            progTimer = null;
        }
    }
    function startTips() {
        stopTips();
        tipTimer = window.setInterval(() => {
            tipIndex.value = (tipIndex.value + 1) % tips.length;
        }, 1600);
    }
    function stopTips() {
        if (tipTimer) {
            clearInterval(tipTimer);
            tipTimer = null;
        }
    }

    const safeParse = (val: any) => {
        if (val == null) return {};
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            } catch {
                return {};
            }
        }
        if (typeof val === 'object') return val;
        return {};
    };

    /** 路由分流 */
    function routeByIdentity() {
        const token = uni.getStorageSync('token');
        if (!token) {
            uni.reLaunch({ url: '/pages/login/index' });
            return;
        }

        const store = useGlobalStore();
        const raw = uni.getStorageSync('global');
        const fromStorage = safeParse(raw);
        const identity = store.userInfo?.identityType ?? fromStorage?.userInfo?.identityType ?? '';
        const idNum = Number(identity);

        if (idNum === 0) {
            uni.switchTab({ url: '/pages/index/index' }); // 员工
        } else if (idNum === 1) {
            uni.reLaunch({ url: '/pages/packageCustomer/index/index' }); // 客户
        } else {
            // 没识别到身份：给个兜底
            uni.reLaunch({ url: '/pages/login/index' });
        }
    }

    onLoad(async () => {
        // 1) 启动动画
        startProgress();
        startTips();

        // 2) 等一帧，确保 storage/pinia 就绪（避免生产环境时机过早）
        await new Promise(r => setTimeout(r, 120));

        // 3) 如需要，这里也可以做一次“尝试刷新 token”
        // await tryRefreshTokenIfNeeded()

        // 4) 完成：补到 100 再分流
        progress.value = 100;
        setTimeout(() => {
            routeByIdentity();
        }, 180);
    });

    onUnmounted(() => {
        stopProgress();
        stopTips();
    });
</script>

<style lang="scss" scoped>
    .boot {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        background: radial-gradient(1200rpx 800rpx at 20% -10%, #fdf2e9 0%, transparent 60%),
            radial-gradient(900rpx 700rpx at 110% 10%, #eef6ff 0%, transparent 60%),
            linear-gradient(135deg, #f7f8fc 0%, #f4f6fb 100%);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* 背景粒子 */
    .bg {
        position: absolute;
        inset: 0;
        pointer-events: none;
        .dot {
            --i: 1;
            position: absolute;
            top: calc((var(--i) * 7%) + 4%);
            left: calc((var(--i) * 8%) + 3%);
            width: 10rpx;
            height: 10rpx;
            border-radius: 50%;
            background: rgba(247, 147, 30, 0.18);
            filter: blur(1px);
            animation: float 6s ease-in-out infinite;
            animation-delay: calc(var(--i) * 0.18s);
        }
    }
    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10rpx);
        }
    }

    /* 中央卡片 */
    .card {
        width: 600rpx;
        max-width: 86vw;
        padding: 56rpx 40rpx 46rpx;
        border-radius: 28rpx;
        background: #fff;
        box-shadow: 0 20rpx 80rpx rgba(23, 32, 90, 0.08), 0 8rpx 24rpx rgba(23, 32, 90, 0.06);
        position: relative;
        backdrop-filter: blur(2px);
    }

    /* 霓虹光圈 */
    .ring {
        position: absolute;
        inset: -2rpx;
        border-radius: 30rpx;
        background: conic-gradient(from 0deg, #f7931e, #ffcb79, #7aa9ff, #f7931e);
        filter: blur(20rpx) opacity(0.25);
        z-index: 0;
    }

    /* 品牌区 */
    .brand {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 18rpx;
        .logo {
            width: 120rpx;
            height: 120rpx;
            animation: pulse 2.4s ease-in-out infinite;
        }
        .title {
            font-weight: 700;
            font-size: 34rpx;
            color: #303133;
            letter-spacing: 1rpx;
        }
    }
    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
            filter: drop-shadow(0 0 0 rgba(247, 147, 30, 0));
        }
        50% {
            transform: scale(1.04);
            filter: drop-shadow(0 0 10rpx rgba(247, 147, 30, 0.35));
        }
    }

    /* 进度条 */
    .progress {
        margin-top: 40rpx;
        position: relative;
        z-index: 1;
        .bar {
            width: 100%;
            height: 16rpx;
            border-radius: 999rpx;
            background: #f2f3f5;
            overflow: hidden;
            position: relative;
        }
        .fill {
            height: 100%;
            border-radius: 999rpx;
            background: linear-gradient(90deg, #fbb040, #f7931e);
            width: 0;
            transition: width 0.3s ease;
            position: relative;
        }
        .percent {
            text-align: right;
            margin-top: 10rpx;
            font-size: 22rpx;
            color: #909399;
        }
    }

    /* 提示轮播 */
    .tips {
        height: 40rpx;
        margin-top: 26rpx;
        position: relative;
        z-index: 1;
        .tip {
            position: absolute;
            inset: 0;
            opacity: 0;
            transform: translateY(6rpx);
            transition: all 0.4s ease;
            text-align: center;
            color: #606266;
            font-size: 24rpx;
        }
        .tip.show {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .sub {
        margin-top: 16rpx;
        text-align: center;
        color: #a0a3a8;
        font-size: 22rpx;
    }
</style>
