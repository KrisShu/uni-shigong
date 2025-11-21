<template>
    <view class="pd-section pd-info">
        <!-- <view class="pd-card__title">{{ projectDetails.name }}</view> -->

        <view class="pd-card">
            <view class="pd-address">{{ projectDetails.address }}</view>
            <view class="pd-company pd-infos" v-if="projectDetails.companyName">
                <view class="pd-infos-label">{{ $t('common.pro.Key_company') }}:</view>
                <view class="pd-infos-value">{{ projectDetails.companyName }}</view>
            </view>
            <view class="pd-contact pd-infos" v-if="projectDetails.companyName">
                <view class="pd-infos-label">{{ $t('common.pro.Key_contact') }}:</view>
                <view class="pd-infos-value">{{ projectDetails.companyName }}</view>
            </view>
            <view class="pd-phone pd-infos" v-if="projectDetails.companyName">
                <view class="pd-infos-label">{{ $t('common.pro.Key_phone') }}:</view>
                <view class="pd-infos-value">{{ projectDetails.companyName }}</view>
            </view>
        </view>
        <!-- 项目卡片 -->
        <view class="pd-card">
            <view class="bg-wrap">
                <!-- 使用车辆 -->
                <view class="pd-field">
                    <view class="pd-field__label">{{ $t('common.pro.key_car') }}：</view>
                    <view class="pd-field__chips">
                        <view class="pd-chip">{{ projectDetails.hardwareNames }}</view>
                    </view>
                </view>
                <!-- 参与人 -->
                <view class="pd-field" style="flex-direction: column">
                    <view class="pd-field__label">{{ $t('staff.pro.key_person') }}：</view>

                    <view class="people-list">
                        <view v-for="(people, p) in workerNameArr" class="people-item">
                            <image class="people-item__avatar" :src="people.avatar" mode="aspectFill"></image>
                            <view class="people-item__name">{{ people }}</view>
                        </view>
                    </view>
                </view>
                <!-- 开工时间 -->
                <view class="pd-field">
                    <view class="pd-field__label">{{ $t('common.pro.Key_KGSJ') }}：</view>
                    <view class="pd-field__value">{{ projectDetails.period }}</view>
                </view>
                <!-- 预计工期 -->
                <view class="pd-field">
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
                    <view class="pd-list__item">{{ projectDetails.security }}</view>
                </view>
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

    const workerNameArr = computed(() => {
        if (props.projectDetails.workerNames) {
            return props.projectDetails.workerNames.split(',');
        } else {
            return [];
        }
    });
</script>

<style lang="scss" scoped>
    .pd-info {
        // background: #ffffff;
        // border-radius: 24rpx;
        // padding: 24rpx;
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
        .pd-address {
            font-weight: 600;
            font-size: 32rpx;
            color: #303133;
            line-height: 32rpx;
            display: flex;
            align-items: center;

            padding-left: 50rpx;
            position: relative;
            &::before {
                content: '';
                display: block;
                width: 30rpx;
                height: 36rpx;
                background-image: url('../../../assets/images/location.png');
                background-size: 100%;
                position: absolute;
                left: 0rpx;
            }
        }
        .pd-infos {
            display: flex;
            align-items: center;
            font-weight: 400;
            font-size: 28rpx;
            color: #909399;
            line-height: 32rpx;
            margin-top: 22rpx;

            &.pd-company {
                margin-top: 30rpx;
            }
        }

        .pd-card {
            background: #ffffff;
            border-radius: 24rpx;
            padding: 24rpx;
            .bg-wrap {
                background: #f4f6f8;
                border-radius: 24rpx;
                padding: 24rpx;
            }
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
                }

                .people-list {
                    gap: 8rpx;
                    flex-wrap: wrap;
                    .people-item {
                        display: flex;
                        align-items: center;
                        margin-top: 16rpx;

                        .people-item__avatar {
                            width: 96rpx;
                            height: 96rpx;
                            border-radius: 50%;
                            overflow: hidden;
                            margin-right: 12rpx;
                            background: #4790d9;
                        }
                        .people-item__name {
                            font-weight: 400;
                            font-size: 24rpx;
                            color: #909399;
                            line-height: 24rpx;
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
                    background-image: url('../../../assets/images/iconfont-warning.png');
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
