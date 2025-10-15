<template>
    <view class="pd-punch">
        <view class="pd-punch-wrap">
            <!-- 签到 -->
            <view class="punch-wrap" :class="{ disabled: signIned }">
                <view class="title-text">{{ $t('staff.pro.clock_in.key_SGQD') }}</view>
                <view class="clock-time"> （{{ signInTime }}）</view>
                <view class="punch-btn">
                    {{ signIned ? $t('staff.pro.clock_in.key_YQD') : $t('staff.pro.clock_in.key_QD') }}
                </view>
            </view>
            <!-- 签退 -->
            <view class="punch-wrap" :class="{ disabled: signOuted }">
                <view class="title-text">{{ $t('staff.pro.clock_in.key_SGQT') }}</view>
                <view class="clock-time"> （{{ signOutTime }}）</view>
                <view class="punch-btn">
                    {{ signOuted ? $t('staff.pro.clock_in.key_YQT') : $t('staff.pro.clock_in.key_QT') }}
                </view>
            </view>
        </view>
        <!-- 历史打卡记录 -->
        <view class="pd-punch-history">
            <view class="cap-title">{{ $t('common.pro.clock_in.key_history') }}</view>
            <view class="history-wrap">
                <view class="pd-punch-history__item" v-for="item in 2" :key="item">
                    <view class="flex j-between a-center">
                        <view class="pd-punch-history__time">2025-07-05</view>
                        <view class="pd-punch-history__people"> {{ $t('common.pro.clock_in.key_DKR') }}：张三 </view>
                    </view>
                    <view class="flex j-between punch-images">
                        <view class="punch-image">
                            <text class="label">{{ $t('common.pro.clock_in.key_SGQD') }}：</text>
                            <view class="pd-images">
                                <view class="pd-image-box">
                                    <image class="pd-image" src="" mode="aspectFill"></image>
                                </view>
                            </view>
                        </view>
                        <view class="punch-image">
                            <text class="label">{{ $t('common.pro.clock_in.key_SGQT') }}：</text>
                            <view class="pd-images">
                                <view class="pd-image-box">
                                    <image class="pd-image" src="" mode="aspectFill"></image>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    // 打卡相关

    const signIned = ref(false);
    const signOuted = ref(false);
    const signInTime = ref('--:--:--');
    const signInTime_compelete = ref('');
    const signOutTime = ref('--:--:--');
    const signOutTime_compelete = ref('');

    let timer: number;

    function getNowTimeStr(type: string = 'yyyy-MM-dd HH:mm:ss'): string {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');

        if (type === 'HH:mm:ss') {
            return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        }
        return (
            `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
            `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
        );
    }

    const updateClock = () => {
        if (!signIned.value) signInTime.value = getNowTimeStr('HH:mm:ss');
        if (!signOuted.value) signOutTime.value = getNowTimeStr('HH:mm:ss');
    };

    const handleSignIn = () => {
        if (signIned.value) return;
        signIned.value = true;
        signInTime.value = getNowTimeStr('HH:mm:ss');
        signInTime_compelete.value = getNowTimeStr();

        console.log('signIned', signInTime.value, signInTime_compelete.value);
    };
    const handleSignOut = () => {
        if (signOuted.value) return;
        signOuted.value = true;
        signOutTime.value = getNowTimeStr('HH:mm:ss');
    };

    onMounted(() => {
        updateClock();
        timer = setInterval(updateClock, 1000);
    });
    onUnmounted(() => {
        clearInterval(timer);
    });
</script>

<style lang="scss">
    .pd-punch {
        .pd-punch-wrap {
            display: flex;
            gap: 24rpx;
            width: 100%;
            box-sizing: border-box;
            .punch-wrap {
                width: 50%;
                background: #ffffff;
                border-radius: 24rpx;
                padding: 32rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-bottom: 32rpx;
                .title-text {
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #909399;
                    line-height: 24rpx;
                    text-align: center;
                    margin-bottom: 24rpx;
                }
                .clock-time {
                    font-weight: 600;
                    font-size: 32rpx;
                    color: #303133;
                    line-height: 32rpx;
                    text-align: center;
                    margin-bottom: 24rpx;
                }
                &.disabled {
                    .punch-btn {
                        background: #e4e4e4;
                    }
                }
                .punch-btn {
                    width: 180rpx;
                    height: 56rpx;
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #ffffff;
                    line-height: 56rpx;
                    text-align: center;
                    border-radius: 16rpx;
                    background: #f7931e;
                }
            }
        }
        .pd-punch-history {
            .cap-title {
                font-weight: 600;
                font-size: 32rpx;
                color: #303133;
                line-height: 45rpx;
                margin-bottom: 24rpx;
            }
            .history-wrap {
                background: #ffffff;
                border-radius: 24rpx;
                padding: 24rpx;
                .pd-punch-history__item {
                    margin-bottom: 48rpx;
                    .pd-punch-history__time {
                        font-weight: 600;
                        font-size: 28rpx;
                        color: #303133;
                        line-height: 28rpx;
                        position: relative;
                        padding-left: 20rpx;
                        &::before {
                            content: ' ';
                            display: block;
                            width: 8rpx;
                            height: 8rpx;
                            background: #303133;
                            border-radius: 50%;
                            margin-right: 30rpx;
                            position: absolute;
                            left: 0;
                            top: 36%;
                        }
                    }
                    .pd-punch-history__people {
                        font-weight: 400;
                        font-size: 24rpx;
                        color: #909399;
                        line-height: 24rpx;
                    }
                    .punch-images {
                        margin-top: 24rpx;
                        .punch-image {
                            display: flex;
                            .label {
                                font-weight: 400;
                                font-size: 24rpx;
                                color: #303133;
                                line-height: 28rpx;
                            }
                            .pd-image-box {
                                width: 154rpx;
                                height: 154rpx;
                                border-radius: 8rpx;
                                overflow: hidden;
                                background: #f4f6f8;
                                .pd-image {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
