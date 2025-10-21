<template>
    <view class="progress-bar" :style="{ width: barWidth + 'px' }">
        <!-- 底层进度条（进度较快的） -->
        <view
            class="bar"
            :style="{
                width: animatedFastProgress + '%',
                background: fastColor,
                zIndex: 1,
            }"
        ></view>
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
        ></view>
    </view>
</template>

<script setup lang="ts">
    import { computed, ref, watch, onMounted } from 'vue';

    const props = defineProps<{
        systemProgress: number; // 0-100
        workerProgress: number; // 0-100
        barWidth?: number;
    }>();

    const barWidth = props.barWidth || 350;

    const fastProgress = computed(() => Math.max(props.systemProgress, props.workerProgress));
    const slowProgress = computed(() => Math.min(props.systemProgress, props.workerProgress));

    const fastColor = computed(() => (props.systemProgress >= props.workerProgress ? '#3b82f6' : '#22c55e')); // 蓝色或绿色
    const slowColor = computed(() => (props.systemProgress < props.workerProgress ? '#3b82f6' : '#22c55e'));

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

<style scoped>
    .progress-bar {
        position: relative;
        height: 18rpx;
        background: #e5e7eb;
        border-radius: 8rpx;
        margin: 16rpx 0;
        overflow: hidden;
    }
    .bar {
        height: 100%;
        border-radius: 8rpx;
        transition: width 0.3s;
    }
</style>
