<template>
    <scroll-view
        class="pd-accept-scroll-area"
        scroll-y
        :show-scrollbar="false"
        :enhanced="true"
        :enable-back-to-top="true"
    >
        <view class="accept-template" v-for="value in 5" :key="value">
            <view class="accept-warp">
                <view class="flex j-between a-center">
                    <text class="time">2025-07-09</text>
                    <text class="name">Jey</text>
                </view>

                <view class="status-text">
                    {{ getAcceptStatus(value) }}
                </view>
                <view v-show="value != 1" class="status-desc flex">
                    <text class="label">{{ $t('staff.pro.check.key_YSMX') }}：</text>
                    <text class="value">还剩余了渣土未清理完毕还剩余了渣土未清理完毕</text>
                </view>
                <view v-show="value != 1" class="status-images">图片占位</view>
            </view>
        </view>
    </scroll-view>
</template>

<script lang="ts" setup>
    import { i18n } from '@/main';
    const getAcceptStatus = (status: number) => {
        switch (status) {
            case 1:
                return i18n.global.t('common.pro.check_state_TJYS');
            case 2:
                return i18n.global.t('common.pro.check_state_JY');
            case 3:
                return i18n.global.t('common.pro.check_state_JN');
            case 4:
                return i18n.global.t('common.pro.check_state_YY');
            case 5:
                return i18n.global.t('common.pro.check_state_YN');
        }
    };
</script>

<style lang="scss" scoped>
    .pd-accept-scroll-area {
        height: 100%;
        overflow: auto;
        box-sizing: border-box;
        .accept-template {
            position: relative;
            padding-left: 42rpx;
            &::before {
                content: '';
                display: block;
                width: 32rpx;
                height: 32rpx;
                border-radius: 50%;
                background-color: #fff;
                border: 8rpx solid #303133;
                position: absolute;
                left: 0;
                top: 0;
                box-sizing: border-box;
            }
            &::after {
                content: '';
                display: block;
                height: 80%;
                width: 1rpx;
                background-color: #909399;
                position: absolute;
                left: 15rpx;
                top: 42rpx;
            }
            &:last-of-type {
                &::after {
                    background-color: transparent;
                }
            }
            & ~ .accept-template {
                margin-top: 24rpx;
            }
        }
        .accept-warp {
            background: #ffffff;
            border-radius: 24rpx;
            padding: 24rpx;

            .time {
                font-weight: 600;
                font-size: 28rpx;
                color: #303133;
                line-height: 28rpx;
            }
            .name {
                font-weight: 400;
                font-size: 24rpx;
                color: #909399;
            }
            .status-text {
                font-weight: 400;
                font-size: 28rpx;
                color: #909399;
                line-height: 28rpx;
                margin-bottom: 24rpx;
                margin-top: 24rpx;
            }
            .status-desc {
                font-weight: 400;
                font-size: 28rpx;
                color: #909399;
                margin-bottom: 24rpx;
                .label {
                    flex-shrink: 0;
                }
            }
        }
    }
</style>
