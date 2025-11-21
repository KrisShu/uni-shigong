<template>
    <view>
        <button @click="pickAvatar">选择头像</button>

        <image
            v-if="avatarUrl"
            :src="avatarUrl"
            mode="aspectFill"
            style="width: 150rpx; height: 150rpx; border-radius: 50%"
        />

        <!-- 裁剪弹层 -->
        <AvatarCropper
            v-if="showCropper"
            :src="rawImage"
            :cropWidth="150"
            :cropHeight="150"
            @cancel="showCropper = false"
            @done="handleCropped"
        />
        <AttachmentUploader ref="JD_uploaderRef" v-model="testFiles" @error="onError" />
    </view>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import AvatarCropper from '@/components/AvatarCropper/index.vue';
    import AttachmentUploader from '@/components/AttachmentUploader/index.vue';

    const showCropper = ref(false);
    const rawImage = ref('');
    const avatarUrl = ref<string>('');
    const uploadAvatar = ref<string>('');

    // 选择图片 -> 打开裁剪组件
    const pickAvatar = () => {
        uni.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                const path = res.tempFilePaths?.[0];
                if (!path) return;
                rawImage.value = path;
                showCropper.value = true;
            },
        });
    };

    // 裁剪完成回调
    const handleCropped = (fileObj: { path: string; url: string }) => {
        showCropper.value = false;
        avatarUrl.value = fileObj.url; // url 这里你可以直接展示
        uploadAvatar.value = fileObj.path;
    };

    const testFiles = ref<any[]>([]);

    const onError = (err: any) => {
        console.log(err);
    };
</script>
