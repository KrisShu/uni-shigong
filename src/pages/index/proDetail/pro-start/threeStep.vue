<template>
    <view class="wrap-03">
        <view class="required title">{{ $t('staff.pro.start_step_3_key') }}</view>
        <ImageUploader
            v-model="imgs"
            :max-count="6"
            :max-size-mb="5"
            :accept-ext="['png', 'jpg', 'jpeg', 'webp']"
            @error="onError"
        />
    </view>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import ImageUploader from '@/components/ImageUploader/index.vue';
    // 已有图片（编辑态）
    const imgs = ref<string[]>([]);
    async function uploadToServer(localPath: string): Promise<string> {
        console.log('上传中...', localPath);
        // 先直接返回本地临时路径模拟
        return localPath;
    }

    function onError(msg: string) {
        uni.showToast({ title: msg, icon: 'none' });
    }
</script>

<style lang="scss" scoped>
    .wrap-03 {
        .title {
            font-weight: 600;
            font-size: 32rpx;
            color: #303133;
        }
    }
</style>
