<template>
    <view class="wrap-01">
        <view class="pd-card__title">3#3武侯区锦城大道600号打地基</view>
        <view class="pd-card__address">武侯区锦城大道600号打地基</view>
        <!-- 项目卡片 -->
        <view class="pd-card">
            <!-- 使用车辆 -->
            <view class="pd-field">
                <view class="pd-field__label">使用车辆：</view>
                <view class="pd-field__chips">
                    <view class="pd-chip">叉车</view>
                    <view class="pd-chip">挖掘机</view>
                    <view class="pd-chip">运输车运输车运输车运输车运输车运输车</view>
                </view>
            </view>

            <!-- 预计工期 -->
            <view class="pd-field">
                <view class="pd-field__label">预计工期：</view>
                <view class="pd-field__value">0.5 天</view>
            </view>

            <!-- 项目勘察图 -->
            <view class="pd-field">
                <view class="pd-field__label">项目勘察图：</view>
                <view class="pd-images">
                    <view class="pd-image-box">
                        <image class="pd-image" src="" mode="aspectFill"></image>
                    </view>
                    <view class="pd-image-box">
                        <image class="pd-image" src="" mode="aspectFill"></image>
                    </view>
                </view>
            </view>
        </view>
        <!-- 安全注意事项 -->
        <view class="pd-card2">
            <view class="pd-card__title">{{ $t('common.pro.key_tip') }}</view>

            <view class="pd-list">
                <view class="pd-list__item">注意两侧下管道</view>
                <view class="pd-list__item">注意高压线</view>
                <view class="pd-list__item">注意桩孔深度</view>
            </view>
        </view>

        <!-- 确认启动项目 -->
        <view @click="sureNext" class="progress-btn">
            {{ $t('staff.pro.start_step_1_btn') }}
        </view>
    </view>
</template>

<script lang="ts" setup>
    const emits = defineEmits(['next']);
    const sureNext = () => {
        emits('next');
    };
</script>

<style lang="scss">
    .wrap-01 {
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
            &::before {
                content: '';
                display: inline-block;
                width: 30rpx;
                height: 36rpx;
                background-image: url('../../../../assets/images/location.png');
                background-size: 100% 100%;
                margin-right: 14rpx;
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
                        flex-shrink: 0;
                    }
                }
                .pd-images {
                    display: flex;
                    gap: 16rpx;
                    flex-wrap: wrap;
                    .pd-image-box {
                        width: 154rpx;
                        height: 154rpx;
                        border-radius: 8rpx;
                        background-color: saddlebrown;
                        position: relative;
                        &::before {
                            content: '';
                            display: block;
                            width: 24rpx;
                            height: 24rpx;
                            position: absolute;
                            top: 6rpx;
                            right: 6rpx;
                            background-image: url('../../../../assets/images/view.png');
                            background-size: 100% 100%;
                        }
                    }
                    .pd-image {
                        width: 100%;
                        height: 100%;
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
                    & ~ .pd-list__item {
                        margin-top: 24rpx;
                    }
                }
            }
        }

        .progress-btn {
            width: 90%;
            background: #f7931e;
            border-radius: 24rpx;
            height: 88rpx;
            line-height: 88rpx;
            text-align: center;
            font-weight: 600;
            font-size: 28rpx;
            color: #ffffff;
            position: absolute;
            bottom: 32rpx;
        }
    }
</style>
