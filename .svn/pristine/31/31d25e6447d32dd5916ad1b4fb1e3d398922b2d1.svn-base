<template>
    <view class="pd-section pd-info">
        <view class="pd-card__title">{{ projectDetails.name }}</view>
        <view class="pd-card__address">{{ projectDetails.address }}</view>
        <!-- 项目卡片 -->
        <view class="pd-card">
            <!-- 使用车辆 -->
            <view class="pd-field" v-if="projectDetails.hardwareNames">
                <view class="pd-field__label">{{ $t('common.pro.key_car') }}：</view>
                <view class="pd-field__chips">
                    <view class="pd-chip">{{ projectDetails.hardwareNames }}</view>
                </view>
            </view>

            <!-- 预计工期 -->
            <view class="pd-field" v-if="projectDetails.period">
                <view class="pd-field__label">{{ $t('common.pro.key_date') }}：</view>
                <view class="pd-field__value">{{ projectDetails.period }}{{ $t('common.unit.day') }}</view>
            </view>

            <!-- 项目勘察图 -->
            <view class="pd-field" v-if="images.length">
                <view class="pd-field__label">{{ $t('common.pro.key_image') }}：</view>
                <ImagePreview :images="images" />
            </view>
        </view>
        <!-- 安全注意事项 -->
        <view class="pd-card2">
            <view class="pd-card__title">{{ $t('common.pro.key_tip') }}</view>

            <view class="pd-list">
                <!-- <view class="pd-list__item">注意两侧下管道</view>
                <view class="pd-list__item">注意高压线</view>
                <view class="pd-list__item">注意桩孔深度</view> -->
                <view class="pd-list__item">{{ projectDetails.security }}</view>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
    import ImagePreview from '@/components/ImagePreview/index.vue';
    import { computed, ref } from 'vue';

    const BASEURL = import.meta.env.VITE_IMAGE_BASEURL;

    const props = defineProps<{
        projectDetails: any;
    }>();

    const images = computed(() => {
        if (props.projectDetails.locationPath) {
            const imagesArr = props.projectDetails.locationPath.split(',');
            return imagesArr.map((item: string) => {
                return BASEURL + item;
            });
        } else {
            return [];
        }
    });
</script>

<style lang="scss" scoped>
    .pd-info {
        background: #ffffff;
        border-radius: 24rpx;
        padding: 24rpx;
        max-height: 100%;
        overflow-y: auto;
        box-sizing: border-box;
        .pd-card__title {
            font-weight: 600;
            font-size: 32rpx;
            color: #303133;
            line-height: 32rpx;
            margin-bottom: 20rpx;
        }
        .pd-card__address {
            font-weight: 400;
            font-size: 28rpx;
            color: #909399;
            line-height: 36rpx;
            display: flex;
            align-items: center;
            margin-bottom: 24rpx;
            padding-left: 50rpx;
            position: relative;
            &::before {
                content: '';
                display: block;
                width: 30rpx;
                height: 36rpx;
                background-image: url('@/assets/images/location.png');
                background-size: 100%;
                position: absolute;
                left: 0rpx;
            }
        }
        .pd-card {
            background: #f4f6f8;
            border-radius: 24rpx;
            padding: 24rpx;
            .pd-field {
                display: flex;
                font-weight: 400;
                font-size: 28rpx;
                color: #909399;
                line-height: 32rpx;
                & ~ .pd-field {
                    margin-top: 24rpx;
                }
                .pd-field__label {
                    flex-shrink: 0;
                }
                .pd-field__chips {
                    display: flex;
                    flex-wrap: wrap;
                    .pd-chip {
                        flex: 1;
                    }

                    &.people-list {
                        gap: 8rpx;
                        flex-wrap: wrap;
                        .people-item {
                            height: 40rpx;
                            line-height: 40rpx;
                            padding: 0 8rpx;
                            background: #ffffff;
                            border-radius: 8rpx;
                            font-size: 24rpx;
                            &.leader {
                                position: relative;
                                padding-left: 38rpx;
                                &::before {
                                    content: '';
                                    display: inline-block;
                                    width: 24rpx;
                                    height: 22rpx;
                                    background: url('../../../../assets/images/leader.png');
                                    background-size: cover;
                                    position: absolute;
                                    left: 8rpx;
                                    top: 50%;
                                    transform: translateY(-50%);
                                }
                            }
                        }
                    }
                }
            }
        }
        .pd-card2 {
            margin-top: 32rpx;
            .pd-card__title {
                font-weight: 600;
                font-size: 28rpx;
                color: #303133;
                line-height: 40rpx;
                display: flex;
                align-items: center;
                &::before {
                    content: '';
                    display: inline-block;
                    width: 30rpx;
                    height: 30rpx;
                    background-image: url('../../../../assets/images/iconfont-warning.png');
                    background-size: cover;
                    margin-right: 10rpx;
                }
            }
            .pd-list {
                font-weight: 400;
                font-size: 24rpx;
                color: #909399;
                line-height: 24rpx;
                .pd-list__item {
                    white-space: pre-line; /* 或 pre-wrap 都可以 */
                }
            }
        }
    }
</style>
