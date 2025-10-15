<template>
    <view class="pp-wrap">
        <!-- 右上角状态角标（如：延期） -->
        <view v-if="systemProgress > workerProgress" class="pp-badge">{{ $t('staff.pro.delay') }}</view>

        <view class="progress-bar" :style="{ width: barWidth }">
            <!-- 底层进度条（进度较快的） -->
            <view
                class="bar"
                :style="{
                    width: animatedFastProgress + '%',
                    background: fastColor,
                    zIndex: 1,
                }"
            >
                <view
                    class="pp-pill fast-fill"
                    :style="{
                        backgroundImage: `url(${fastBG})`,
                    }"
                    >{{ fastProgress }}%</view
                >
            </view>
            <!-- 顶层进度条（进度较慢的） -->
            <view
                class="bar"
                :style="{
                    width: animatedSlowProgress + '%',
                    background: slowColor,
                    zIndex: 2,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }"
            >
                <view
                    class="pp-pill slow-fill"
                    :style="{
                        backgroundImage: `url(${slowBG})`,
                    }"
                    >{{ slowProgress }}%</view
                >
            </view>
        </view>
        <!-- 图例 -->
        <view class="pp-legend">
            <view class="pp-legend__item">
                <view class="pp-dot pp-dot--actual"></view>
                <text>实际施工进度</text>
            </view>
            <view class="pp-legend__item">
                <view class="pp-dot pp-dot--plan"></view>
                <text>计划施工进度</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { computed, ref, watch, onMounted } from 'vue';
    import sysfillbg from '@/assets/images/sys-fill-bg.png';
    import workerfillbg from '@/assets/images/worker-fill-bg.png';

    const props = defineProps<{
        systemProgress: number; // 0-100
        workerProgress: number; // 0-100
        barWidth?: string;
    }>();

    const barWidth = props.barWidth || '100%';

    const fastProgress = computed(() => Math.max(props.systemProgress, props.workerProgress));
    const slowProgress = computed(() => Math.min(props.systemProgress, props.workerProgress));
    const systemColor = '#F5CEA0'; //计划施工进度颜色
    const workerColor = '#F7931E'; // 实际施工进度颜色
    const fastBG = computed(() => (props.systemProgress >= props.workerProgress ? sysfillbg : workerfillbg));
    const slowBG = computed(() => (props.systemProgress < props.workerProgress ? sysfillbg : workerfillbg));
    const fastColor = computed(() => (props.systemProgress >= props.workerProgress ? systemColor : workerColor)); // 蓝色或绿色
    const slowColor = computed(() => (props.systemProgress < props.workerProgress ? systemColor : workerColor));

    // 动画进度
    const animatedFastProgress = ref(0);
    const animatedSlowProgress = ref(0);

    const animateProgress = (target: number, animated: typeof animatedFastProgress) => {
        animated.value = 0;
        const step = () => {
            if (animated.value < target) {
                animated.value += Math.max(1, Math.floor(target / 30));
                if (animated.value > target) animated.value = target;
                setTimeout(step, 16);
            }
        };
        step();
    };

    onMounted(() => {
        animateProgress(fastProgress.value, animatedFastProgress);
        setTimeout(() => {
            animateProgress(slowProgress.value, animatedSlowProgress);
        }, 200); // 慢的稍后一点出现更有层次感
    });

    // 监听props变化时重新动画
    watch([fastProgress, slowProgress], ([newFast, newSlow]) => {
        animateProgress(newFast, animatedFastProgress);
        setTimeout(() => {
            animateProgress(newSlow, animatedSlowProgress);
        }, 200);
    });
</script>

<style scoped lang="scss">
    .progress-bar {
        position: relative;
        height: 24rpx;
        background: #e5e7eb;
        border-radius: 12rpx;
        margin: 16rpx 0;
        // overflow: hidden;
    }
    .bar {
        height: 100%;
        border-radius: 12rpx;
        transition: width 0.3s;
        position: relative;
    }
    /* 容器：你页面的橙色卡片由外层决定，这里只做进度区域 */
    .pp-wrap {
        position: relative;
        padding-top: 20rpx;
    }

    /* 角标（右上） */
    .pp-badge {
        position: absolute;
        right: 10rpx;
        top: 0rpx; /* 胶囊在轨道之上（按UI） */
        font-size: 22rpx;
        line-height: 1;
        background-image: url('../../assets/images/delay-bg.png');
        background-size: cover;
        width: 56rpx;
        height: 38rpx;
        line-height: 38rpx;
        color: #fff;
        text-align: center;
        font-weight: 400;
        font-size: 20rpx;
        color: #ffffff;
    }

    .pp-bars {
        margin-top: 12rpx;
    }

    /* 百分比胶囊 */
    .pp-pill {
        position: absolute;
        top: -40rpx; /* 胶囊在轨道之上（按UI） */
        line-height: 38rpx;
        height: 38rpx;
        width: 56rpx;
        background-size: cover;
        text-align: center;
        color: #fff;
        font-size: 20rpx;
        &.fast-fill {
            right: 0rpx;
        }
        &.slow-fill {
            left: 50%;
            transform: translateX(-50%);
        }
    }

    .pp-pill--actual {
        background: #f59e0b;
        color: #fff;
        border-color: #fff;
    }
    .pp-pill--plan {
        background: #e5e7eb;
        color: #555;
    }

    /* 图例 */
    .pp-legend {
        display: flex;
        gap: 100rpx;
        align-items: center;
        margin-top: 24rpx;
        .pp-legend__item {
            display: flex;
            align-items: center;
            gap: 12rpx;

            font-weight: 400;
            font-size: 20rpx;
            color: #909399;
        }
        .pp-dot {
            width: 20rpx;
            height: 20rpx;
            border-radius: 4rpx;
        }
        .pp-dot--actual {
            background: #f7931e;
        }
        .pp-dot--plan {
            background: #f5cea0;
        }
    }
</style>
