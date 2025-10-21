<template>
    <view class="page">
        <!-- 页面主体内容 -->
        <!-- …… -->

        <!-- 自定义 TabBar 固定底部 -->
        <ClientTabBar />
    </view>
</template>

<script setup lang="ts">
    import ClientTabBar from '@/components/ClientTabBar/index.vue';
</script>

<style scoped>
    .page {
        padding-bottom: 120rpx; /* 给自定义tabbar留出空间 */
    }
</style>
