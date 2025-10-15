<template>
    <view class="page project-detail-page">
        <view class="top-fixed">
            <view class="pd-header common-cap">
                <!-- 示例：返回按钮 -->
                <view class="pd-back common-back" @click="Back"> </view>
                <text class="pd-title common-title">3#3 武侯区锦城大道666号</text>
            </view>

            <!-- 项目整体进度卡片 -->
            <view class="pd-progress-card">
                <view class="pd-progress-card__title">项目整体进度</view>
                <view class="pd-progress-card2">
                    <ProgressBar :system-progress="50" :worker-progress="60" />

                    <view class="pd-progress-actions">
                        <!-- 启动项目 -->
                        <button @click="handelStart" class="pd-btn pd-btn--primary-light">
                            {{ $t('staff.pro.start') }}
                        </button>
                        <!-- 更新进度 -->
                        <button @click="updateProgress" class="pd-btn pd-btn--primary-light">
                            {{ $t('staff.pro.updateProgress') }}
                        </button>
                        <!-- 施工结束 -->
                        <button @click="buildCompleted" class="pd-btn pd-btn--primary-light">
                            {{ $t('staff.pro.end') }}
                        </button>
                    </view>
                </view>

                <!-- 状态角标（示例：延期） -->
                <!-- <view class="pd-progress-badge">延期</view> -->

                <!-- 操作按钮 -->
            </view>

            <!-- Tabs 切换 -->
            <view class="pd-tabs">
                <view
                    @click="changeTab(item)"
                    :class="['pd-tab', item.value === activeTab ? 'is-active' : '']"
                    v-for="item in tabs"
                    :key="item.value"
                >
                    <text class="pd-tab__text">{{ item.name }}</text>
                </view>
            </view>
        </view>

        <view class="bottom-area">
            <!-- Tab 内容：项目信息 -->

            <PdInfo v-show="activeTab === tabs[0].value" />

            <!-- Tab 内容：打卡 -->

            <PdPunch v-show="activeTab === tabs[1].value" />

            <!-- Tab 内容：施工 -->
            <PdConstruct v-show="activeTab === tabs[2].value" />

            <!-- Tab 内容：验收 -->
            <PdAccept v-show="activeTab === tabs[3].value" />
        </view>

        <!-- 更新进度弹窗 -->
        <uni-popup
            @touchmove.stop.prevent
            :animation="true"
            ref="moreAddressRef"
            type="bottom"
            border-radius="10px 10px 0 0"
        >
            <view class="update_progress_popup bottom-popup">
                <view class="close-popup" @click="closePop"></view>
                <view class="popup_title">{{ $t('staff.pro.updateProgress_title') }}</view>
                <view class="tip-wrap">
                    <text class="label">{{ $t('staff.pro.updateProgress_tip_label') }}</text>
                    <text class="value">{{ $t('staff.pro.updateProgress_tip_value') }}</text>
                </view>
                <view class="flex j-between progress">
                    <view class="progress-box history">
                        <text class="num">34%</text>
                        <text class="text">{{ $t('staff.pro.updateProgress_key_history') }}</text>
                    </view>
                    <!-- 当前项目进度 -->
                    <view class="progress-box curr">
                        <view class="num-input flex a-center">
                            <input
                                placeholder-class="ph"
                                :placeholder="$t('common.placeholder')"
                                v-model="currProgress"
                                class="uni-input"
                                type="number"
                            />
                            <text class="unit">%</text>
                        </view>
                        <text class="text">{{ $t('staff.pro.updateProgress_key_current') }}</text>
                    </view>
                </view>
                <LockButton :onClick="submitUpdateProgress">{{ $t('common.save') }}</LockButton>
            </view>
        </uni-popup>
        <!-- 施工结束 -->
        <uni-popup
            @touchmove.stop.prevent
            :animation="true"
            ref="buildCompletedRef"
            type="bottom"
            border-radius="10px 10px 0 0"
        >
            <view class="build-completed-popup bottom-popup">
                <view class="close-popup" @click="closePop"></view>
                <view class="popup_title">{{ $t('staff.pro.end_title') }}</view>
                <view class="build-completed-item">
                    <view class="label required">{{ $t('staff.pro.end_key_image') }}</view>
                </view>
                <view class="build-completed-item">
                    <view class="label">{{ $t('staff.pro.end_key_desc') }}</view>
                    <textarea
                        placeholder-class="ph"
                        :placeholder="$t('common.placeholder')"
                        class="uni-textarea"
                    ></textarea>
                </view>
                <LockButton :onClick="submitUpdateProgress">{{ $t('common.save') }}</LockButton>
            </view>
        </uni-popup>
    </view>
</template>

<script lang="ts" setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import { i18n } from '@/main';
    import ProgressBar from '@/components/ProgressBar/index.vue';
    import PdInfo from './pd-info.vue';
    import PdPunch from './pd-punch.vue';
    import PdConstruct from './pd-construct.vue';
    import PdAccept from './pd-accept.vue';
    import LockButton from '@/components/LockButton/index.vue';
    const Back = () => {
        uni.navigateBack();
    };

    const handelStart = () => {
        uni.navigateTo({ url: '/pages/index/proDetail/pro-start/index' });
    };

    const tabs = [
        {
            name: i18n.global.t('common.pro.info'),
            value: 1,
        },
        {
            name: i18n.global.t('common.pro.clock_in'),
            value: 2,
        },
        {
            name: i18n.global.t('common.pro.work'),
            value: 3,
        },
        {
            name: i18n.global.t('common.pro.check'),
            value: 4,
        },
    ];
    const activeTab = ref(tabs[0].value);
    const changeTab = (item: any) => {
        activeTab.value = item.value;
    };

    const currProgress = ref<number | string>('');
    const moreAddressRef = ref<any>(null);

    const updateProgress = () => {
        moreAddressRef.value.open();
    };
    const submitUpdateProgress = () => {
        moreAddressRef.value.close();
    };
    const closePop = () => {
        moreAddressRef.value.close();
    };

    const buildCompletedRef = ref<any>(null);
    const buildCompleted = () => {
        buildCompletedRef.value.open();
    };
</script>

<style lang="scss" scoped>
    /* 页面的根容器：用 flex 切成“上固定 + 下滚动” */
    .project-detail-page {
        display: flex;
        flex-direction: column;
        height: 100vh; /* 让页面占满可视高度 */
        overflow: hidden; /* 避免外层也滚动 */
    }

    /* 顶部固定区：高度自适应，不滚动 */
    .top-fixed {
        position: sticky;
        top: 0;
        z-index: 10;
    }
    .pd-progress-card {
        width: 100%;
        box-sizing: border-box;
        background: #f7931e;
        border-radius: 24rpx;
        padding: 24rpx;
        margin-bottom: 32rpx;

        .pd-progress-card__title {
            font-weight: 600;
            font-size: 32rpx;
            color: #ffffff;
            line-height: 32rpx;
            margin-bottom: 24rpx;
        }
        .pd-progress-card2 {
            background: #ffffff;
            border-radius: 24rpx;
            padding: 24rpx;
            width: 100%;
            box-sizing: border-box;
            .pd-progress-actions {
                display: flex;
                justify-content: space-between;
                gap: 24rpx;
                margin-top: 40rpx;
                .pd-btn {
                    height: 56rpx;
                    border-radius: 16rpx;
                    border: 1rpx solid #f7931e;
                    background-color: transparent;
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #f7931e;
                    line-height: 50rpx;
                    &::after {
                        border: none;
                    }
                }
            }
        }
    }
    .pd-tabs {
        display: flex;
        gap: 48rpx;
        .pd-tab {
            width: fit-content;
            font-weight: 400;
            font-size: 32rpx;
            color: #909399;
            line-height: 32rpx;
            position: relative;
            .pd-tab__text {
                position: relative;
                z-index: 2;
            }
            &.is-active {
                font-weight: 600;
                font-size: 32rpx;
                color: #303133;

                &::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 8rpx;
                    background: #f7931e;
                    border-radius: 5rpx;
                    position: absolute;
                    bottom: 1rpx;
                    z-index: 1;
                }
            }
        }
    }

    /* 下部固定区：flex:1 + min-height:0 是关键 */
    .bottom-area {
        flex: 1; /* 占满剩余空间 */
        min-height: 0; /* 允许在 flex 容器里滚动（防止高度被撑死） */
        /* 可选：iOS 惯性滚动更顺滑 */
        // -webkit-overflow-scrolling: touch; // H5 中有效
        padding-top: 32rpx;
    }

    .update_progress_popup {
        .tip-wrap {
            background: #f4f6f8;
            border-radius: 8rpx;
            width: 100%;
            height: 56rpx;
            margin-bottom: 32rpx;
            padding: 0 24rpx;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            .label {
                font-weight: 600;
                font-size: 24rpx;
                color: #303133;
                line-height: 32rpx;
            }
            .value {
                font-size: 24rpx;
                color: #303133;
                line-height: 32rpx;
            }
        }
        .progress {
            gap: 24rpx;
            margin-bottom: 48rpx;
            .progress-box {
                flex: 1;
                flex-shrink: 0;
                height: 183rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-radius: 24rpx;
                border: 1rpx solid #c8c7cc;
                .text {
                    font-size: 24rpx;
                    line-height: 33rpx;
                    margin-top: 24rpx;
                }
                &.history {
                    background: #f4f6f8;
                    border-color: #f4f6f8;
                    .text {
                        color: #909399;
                    }
                    .num {
                        font-size: 36rpx;
                        color: #303133;
                    }
                }
                &.curr {
                    border-color: #303133;
                    background-color: #fff;
                    .num-input {
                        .uni-input {
                            width: 100rpx;
                            font-size: 36rpx;
                            color: #303133;
                        }
                    }
                    .unit {
                        font-weight: 600;
                        font-size: 36rpx;
                        color: #303133;
                    }
                    .text {
                        color: #303133;
                    }
                }
            }
        }
    }
    .build-completed-popup {
        .build-completed-item {
            width: 100%;
            border-radius: 24rpx;
            border: 1rpx solid #e4e4e4;
            padding: 24rpx;
            margin-bottom: 24rpx;
            box-sizing: border-box;
            &:last-child {
                margin-bottom: 48rpx;
            }
            .label {
                font-weight: 400;
                font-size: 24rpx;
                color: #909399;
                line-height: 24rpx;
                position: relative;
            }
            .uni-textarea {
                height: 200rpx;
                font-size: 28rpx;
                color: #909399;
                line-height: 28rpx;
                padding: 24rpx 0rpx;
                box-sizing: border-box;
            }
        }
    }
</style>
