<template>
    <view class="page project-detail-page">
        <view class="top-fixed">
            <view class="pd-header common-cap">
                <!-- 示例：返回按钮 -->
                <view class="pd-back common-back" @click="Back"> </view>
                <text class="pd-title common-title">{{ projectDetails.name }}</text>
            </view>

            <!-- 项目整体进度卡片 -->
            <view class="pd-progress-card">
                <view class="pd-progress-card__title">项目整体进度</view>
                <view class="pd-progress-card2">
                    <ProgressBar
                        :system-progress="projectDetails.scheduleProgress"
                        :worker-progress="projectDetails.actualProgress"
                    />

                    <view class="pd-progress-actions" v-show="projectDetails.isTeamLeader">
                        <!-- 启动项目 -->
                        <button
                            @click="handelStart"
                            class="pd-btn pd-btn--primary-light"
                            :class="projectDetails.status != 0 ? 'disabled' : ''"
                        >
                            {{ $t('staff.pro.start') }}
                        </button>
                        <!-- 更新进度 -->
                        <button
                            v-show="projectDetails.status != 0"
                            @click="updateProgress"
                            class="pd-btn pd-btn--primary-light"
                            :class="
                                projectDetails.status == 3 || projectDetails.status == 4 || projectDetails.status == 5
                                    ? 'disabled'
                                    : ''
                            "
                        >
                            {{ $t('staff.pro.updateProgress') }}
                        </button>
                        <!-- 施工结束 -->
                        <button
                            v-show="projectDetails.status != 0"
                            @click="buildCompleted"
                            class="pd-btn pd-btn--primary-light"
                            :class="
                                projectDetails.status == 3 || projectDetails.status == 4 || projectDetails.status == 5
                                    ? 'disabled'
                                    : ''
                            "
                        >
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

            <PdInfo :projectDetails="projectDetails" v-show="activeTab === tabs[0].value" />

            <!-- Tab 内容：打卡 -->

            <PdPunch v-show="projectDetails.status != 0 && activeTab === tabs[1].value" :projectId="currProjectId" />

            <!-- Tab 内容：施工 -->
            <PdConstruct
                v-show="projectDetails.status != 0 && activeTab === tabs[2].value"
                :projectId="currProjectId"
            />

            <!-- Tab 内容：验收 -->
            <PdAccept v-show="projectDetails.status != 0 && activeTab === tabs[3].value" />
        </view>

        <!-- 更新进度弹窗 -->
        <uni-popup @touchmove.stop.prevent :animation="true" ref="moreAddressRef" type="bottom" :is-mask-click="false">
            <view class="update_progress_popup bottom-popup">
                <view class="close-popup" @click="closePop"></view>
                <view class="popup_title">{{ $t('staff.pro.updateProgress_title') }}</view>
                <view class="tip-wrap">
                    <text class="label">{{ $t('staff.pro.updateProgress_tip_label') }}</text>
                    <text class="value">{{ $t('staff.pro.updateProgress_tip_value') }}</text>
                </view>
                <view class="flex j-between progress">
                    <view class="progress-box history">
                        <text class="num">{{ projectDetails.actualProgress }}%</text>
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
                                @blur="checkProgress"
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
            :is-mask-click="false"
        >
            <view class="build-completed-popup bottom-popup">
                <view class="close-popup" @click="closePop"></view>
                <view class="popup_title">{{ $t('staff.pro.end_title') }}</view>
                <view class="build-completed-item">
                    <view class="label required">{{ $t('staff.pro.end_key_image') }}</view>
                    <ImageUploader v-model="END_imgs" @error="onError" />
                </view>
                <view class="build-completed-item">
                    <view class="label">{{ $t('staff.pro.end_key_desc') }}</view>
                    <textarea
                        placeholder-class="ph"
                        :placeholder="$t('common.placeholder')"
                        class="uni-textarea"
                        v-model="end_reason"
                    ></textarea>
                </view>
                <LockButton :onClick="submitEnd">{{ $t('common.save') }}</LockButton>
            </view>
        </uni-popup>

        <!-- 温馨提示  弹窗 -->
        <uni-popup @touchmove.stop.prevent :animation="true" ref="tipsRef" type="center" :is-mask-click="false">
            <view class="tips-popup">
                <view class="close-popup" @click="closePop">222</view>
                <view class="title">{{ $t('staff.pro.updateProgress_tip_label') }}</view>
                <view class="text">{{ tipText }}</view>

                <view class="btn" @click="sureTip">{{ $t('common.btn.YZX') }}</view>
            </view>
        </uni-popup>
    </view>
</template>

<script lang="ts" setup>
    import { ref, onMounted, onUnmounted, reactive } from 'vue';
    import { i18n } from '@/main';
    import ProgressBar from '@/components/ProgressBar/index.vue';
    import PdInfo from './pd-info.vue';
    import PdPunch from './pd-punch.vue';
    import PdConstruct from './pd-construct.vue';
    import PdAccept from './pd-accept.vue';
    import LockButton from '@/components/LockButton/index.vue';
    import API from '@/apis/index';
    import { onLoad } from '@dcloudio/uni-app';
    import { navigateTo } from '@/utils/navigate';
    import ImageUploader from '@/components/ImageUploader/index.vue';

    const tabs = reactive([
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
    ]);
    const Back = () => {
        uni.navigateBack();
    };
    const currProjectId = ref<string | number>('');
    onLoad((options: any) => {
        console.log('接收参数', options);
        currProjectId.value = Number(options.id);
        fetchProjectDetails();
        // fetchProjectSafeguardRead();
    });

    const projectDetails = reactive<any>({});
    const fetchProjectDetails = async () => {
        try {
            const res = await API.EMP_ProjectDetail({
                id: currProjectId.value,
            });
            console.log('res', res);
            Object.assign(projectDetails, res.data, {}); // ✅ 更新对象内部

            if (res.data.status === 0) {
                //未启动项目，tabs只显示项目信息
                tabs.splice(1, 3);
                console.log('tabs', tabs);
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    const handelStart = () => {
        if (projectDetails.status !== 0) return;
        navigateTo({
            url: '/pages/index/proDetail/pro-start/index',
            query: {
                id: currProjectId.value,
                title: projectDetails.name,
            },
        });
    };

    const activeTab = ref(tabs[0].value);
    const changeTab = (item: any) => {
        activeTab.value = item.value;
    };

    const currProgress = ref<number | null>(null);
    const moreAddressRef = ref<any>(null);
    function checkProgress() {
        let val = Number(currProgress.value);

        // 不是数字或小于等于0都清空
        if (isNaN(val) || val <= 0) {
            currProgress.value = null;
            return;
        }

        // 大于100则强制为100
        if (val > 100) val = 100;

        // 转成整数（可选）
        currProgress.value = Math.floor(val);
    }

    const updateProgress = () => {
        // status等于3,4,5代表施工结束进入下个阶段 改按钮不可使用
        if (projectDetails.status == 3 || projectDetails.status == 4 || projectDetails.status == 5) return;
        currProgress.value = null;
        moreAddressRef.value.open();
    };
    // 更新整体项目进度保存
    const submitUpdateProgress = async () => {
        if (!currProgress.value) {
            uni.showToast({
                title: i18n.global.t('common.placeholder'),
                icon: 'none',
            });
            return;
        }
        try {
            const res = await API.EMP_ProjectUpdateProgress({
                id: currProjectId.value,
                actualProgress: currProgress.value,
            });
            fetchProjectDetails();
        } catch (error) {
            console.log('error', error);
        } finally {
            moreAddressRef.value.close();
        }
    };
    const closePop = () => {
        moreAddressRef.value.close();
    };

    const buildCompletedRef = ref<any>(null);

    const tipText = ref('');
    const tipsRef = ref<any>(null);
    const buildCompleted = () => {
        // status等于3,4,5代表施工结束进入下个阶段 改按钮不可使用
        if (projectDetails.status == 3 || projectDetails.status == 4 || projectDetails.status == 5) return;
        if (projectDetails.actualProgress < 100) {
            tipText.value = i18n.global.t('staff.pro.end_tip');
            tipsRef.value.open();
            return;
        }
        buildCompletedRef.value.open();
    };
    const sureTip = () => {
        tipsRef.value.close();
    };
    const END_imgs = ref<any[]>([]); // 保存施工结束
    const end_reason = ref('');
    const onError = (err: any) => {
        console.log('err', err);
    };
    const submitEnd = async () => {
        if (!END_imgs.value.length) {
            uni.showToast({
                title: i18n.global.t('common.text.SCTP'),
                icon: 'none',
            });
            return;
        }
        try {
            const acceptancePathArr = END_imgs.value.map(item => item.path);
            const res = await API.EMP_ProjectConstructionEndSave({
                id: currProjectId.value,
                acceptancePath: acceptancePathArr.join(','),
                reason: end_reason.value,
            });
            buildCompletedRef.value.close();
            fetchProjectDetails();
        } catch (error) {
            console.log('error', error);
        }
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
                    &.disabled {
                        color: #e4e4e4;
                        border-color: #e4e4e4;
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
                margin-bottom: 24rpx;
            }
            .uni-textarea {
                height: 200rpx;
                font-size: 28rpx;
                color: #303133;
                line-height: 28rpx;
                padding: 24rpx 0rpx;
                box-sizing: border-box;
                font-weight: 600;
            }
        }
    }

    .tips-popup {
        background: #ffffff;
        border-radius: 24rpx;
        overflow: hidden;
        padding: 48rpx 32rpx;
        position: relative;
        width: 80%;
        margin: auto;
        .close-popup {
            position: absolute;
            width: 40rpx;
            height: 40rpx;
            background-image: url('@/assets/images/icon-close-pop.png');
            background-size: cover;
            right: 32rpx;
            top: -72rpx;
        }
        .title {
            font-weight: 600;
            font-size: 32rpx;
            color: #303133;
            line-height: 32rpx;
            margin-bottom: 48rpx;
            text-align: center;
        }
        .text {
            font-weight: 400;
            font-size: 28rpx;
            color: #909399;
        }
        .btn {
            width: 288rpx;
            height: 88rpx;
            background: #f7931e;
            border-radius: 24rpx;
            text-align: center;
            line-height: 88rpx;
            color: #ffffff;
            margin: auto;
            margin-top: 48rpx;
        }
    }
</style>
