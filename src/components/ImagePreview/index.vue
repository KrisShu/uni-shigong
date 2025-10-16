<template>
    <view class="images-box">
        <view class="image-box" v-for="(img, index) in newsimages" :key="index" @click="preview(index)">
            <img class="image" :src="img" mode="aspectFill"></img>
            <!-- <image class="image" :src="img" mode="aspectFill"></image> -->
        </view>
    </view>
</template>

<script lang="ts" setup>
    import { computed, watch } from 'vue';
    const props = defineProps<{
        images: string | string[];
    }>();
    const newsimages = computed(() => {
        if (Array.isArray(props.images)) {
            return props.images;
        }
        return [props.images];
    });
    const preview = (index: number) => {
        uni.previewImage({
            urls: newsimages.value,
            current: index,
        });
    };

    watch(
        () => props.images,
        val => {
            console.log('images更新了:', val);
        },
        { immediate: true, deep: true },
    );
</script>

<style lang="scss" scoped>
    .images-box {
        display: flex;
        gap: 16rpx;
        flex-wrap: wrap;
        .image-box {
            width: 154rpx;
            height: 154rpx;
            border-radius: 8rpx;
            background-color: saddlebrown;
            position: relative;
            overflow: hidden;
            &::before {
                content: '';
                display: block;
                width: 24rpx;
                height: 24rpx;
                position: absolute;
                top: 6rpx;
                right: 6rpx;
                background-image: url('../../assets/images/view.png');
                background-size: 100% 100%;
            }
        }
        .image {
            width: 100%;
            height: 100%;
        }
    }
</style>
