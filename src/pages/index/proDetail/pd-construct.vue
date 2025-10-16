<!-- 施工选项卡 -->
<template>
    <view class="pd-construct">
        <!-- 工单状态切换按钮 -->
        <view class="pd-construct-set-wrap flex j-between a-center">
            <view class="pd-construct-state-btn">
                <view @click="tabChange(null)" class="state-btn" :class="tabType === null ? 'active' : ''">{{
                    $t('common.pro.state_0')
                }}</view>
                <view @click="tabChange(0)" class="state-btn" :class="tabType === 0 ? 'active' : ''">
                    {{ $t('common.pro.work_key_SGJL') }}
                </view>
                <view @click="tabChange(1)" class="state-btn" :class="tabType === 1 ? 'active' : ''">
                    {{ $t('common.pro.work_key_WTFK') }}
                </view>
            </view>
            <view class="pd-construct-add" @click="handelAdd">{{ $t('staff.pro.work_key_TJ') }}</view>
        </view>
        <!-- 工单列表 -->
        <scroll-view
            class="pd-construct-scroll-area"
            scroll-y
            :show-scrollbar="false"
            :enhanced="true"
            :enable-back-to-top="true"
            @scrolltolower="loadMore"
        >
            <!-- 加载中 -->
            <view v-if="loading && page === 1" class="loading-box">
                <text class="loading-icon">⏳</text>
                <text class="loading-text">{{ $t('common.loading') }}</text>
            </view>

            <!-- 数据为空 -->
            <view v-else-if="!loading && constructList.length === 0" class="empty-box">
                <text class="empty-text">{{ $t('common.noData') }}</text>
            </view>
            <view v-else class="pd-construct-card" v-for="item in 3" :key="item">
                <view>
                    <view class="status-box" :class="getStatusClass(1).class"></view>
                    <view class="status-wrap">
                        <text class="status-text"> {{ getStatusClass(1).text }}</text>
                    </view>
                </view>

                <view class="pd-construct-id">T001-挖掘机</view>
                <view class="label-value flex">
                    <text class="label">{{ $t('common.pro.work_key_SGRQ') }}：</text>
                    <view class="value">2022-01-01</view>
                </view>
                <view class="label-value flex">
                    <text class="label">{{ $t('common.pro.work_key_SGSM') }}：</text>
                    <view class="value">说明说明说明说明说明说明说明说明</view>
                </view>
                <view class="label-value flex">
                    <text class="label">{{ $t('common.pro.work_key_SGJZT') }}：</text>
                    <view class="value">图占位</view>
                </view>
                <view class="label-value flex">
                    <text class="label">{{ $t('common.pro.work_key_GXR') }}：</text>
                    <view class="value">你好</view>
                </view>
                <view class="label-value flex">
                    <text class="label">{{ $t('common.pro.work_key_GXSJ') }}：</text>
                    <view class="value">2025-07-04 18:24:48</view>
                </view>
            </view>
        </scroll-view>

        <!-- 添加弹窗 -->
        <uni-popup @touchmove.stop.prevent :animation="true" ref="addRef" type="bottom" :is-mask-click="false">
            <view class="add-popup bottom-popup">
                <view class="close-popup" @click="closePop"></view>
                <view class="tabs-cap">
                    <view class="tab" :class="activeIndex === 0 ? 'active' : ''" @click="tabClick(0)">
                        <text class="tab-text">{{ $t('common.pro.work_key_SGJD') }}</text>
                    </view>
                    <view class="tab" :class="activeIndex === 1 ? 'active' : ''" @click="tabClick(1)">
                        <text class="tab-text">{{ $t('common.pro.work_key_WTFK') }}</text>
                    </view>
                </view>
                <view class="tabs-content">
                    <view class="tab-content1" v-if="activeIndex === 0">
                        <view class="form-item">
                            <view class="label required">{{ $t('common.pro.work_key_SGRQ') }}</view>
                            <picker
                                mode="date"
                                :value="buildDate"
                                :start="startDate"
                                :end="endDate"
                                @change="bindDateChange"
                            >
                                <view class="uni-input">{{ buildDate }}</view>
                            </picker>
                        </view>
                        <view class="form-item">
                            <view class="label required">{{ $t('common.pro.work_key_SGSB') }}</view>
                            <picker
                                @change="DeviceindexChange"
                                range-key="text"
                                :value="Deviceindex"
                                :range="DeviceArray"
                            >
                                <view class="uni-input">{{ DeviceArray[Deviceindex].text }}</view>
                            </picker>
                        </view>
                        <view class="form-item">
                            <view class="label required">{{ $t('common.pro.work_key_SGSM') }}</view>
                            <textarea
                                placeholder-class="ph"
                                :placeholder="$t('common.placeholder')"
                                class="uni-textarea"
                            ></textarea>
                        </view>
                        <view class="form-item">
                            <view class="label">{{ $t('common.pro.work_key_SGJZT') }}</view>
                            <ImageUploader v-model="JD_imgs" />
                        </view>
                        <LockButton :onClick="save">{{ $t('common.save') }}</LockButton>
                    </view>
                    <view class="tab-content2" v-if="activeIndex === 1">
                        <view class="form-item">
                            <view class="label required">{{ $t('common.pro.work_key_SGSM') }}</view>
                            <textarea
                                placeholder-class="ph"
                                :placeholder="$t('common.placeholder')"
                                class="uni-textarea"
                            ></textarea>
                        </view>
                        <view class="form-item">
                            <view class="label">{{ $t('common.pro.work_key_WTT') }}</view>
                            <ImageUploader v-model="WT_imgs" />
                        </view>
                        <LockButton :onClick="save">{{ $t('common.save') }}</LockButton>
                    </view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script lang="ts" setup>
    import API from '@/apis/index';
    import { i18n } from '@/main';
    import { ref, computed, watch, onMounted } from 'vue';
    import { getNowTimeStr } from '@/utils/common';
    import LockButton from '@/components/LockButton/index.vue';
    import ImageUploader from '@/components/ImageUploader/index.vue';

    const props = defineProps<{
        projectId: string | number;
    }>();

    const getStatusClass = (status: number): any => {
        switch (status) {
            case 1:
                return {
                    class: 'status-record',
                    text: i18n.global.t('common.pro.work_key_SGJL'),
                };
            case 2:
                return {
                    class: 'status-problem',
                    text: i18n.global.t('common.pro.work_key_WTFK'),
                };
        }
    };
    const addRef = ref<any>(null);
    const handelAdd = () => {
        addRef.value.open();
    };
    const activeIndex = ref(0);
    const tabClick = (index: number) => {
        activeIndex.value = index;
    };
    const closePop = () => {
        addRef.value.close();
    };
    const currenDate = getNowTimeStr('yyyy-MM-dd');
    const buildDate = ref<any>(currenDate);
    const startDate = getNowTimeStr('start');
    const endDate = getNowTimeStr('end');

    const bindDateChange = (e: any) => {
        buildDate.value = e.detail.value;
    };

    const Deviceindex = ref<any>(0);
    const DeviceArray = [
        {
            text: '设备1',
            value: 0,
        },
        {
            text: '设备2',
            value: 1,
        },
        {
            text: '设备3',
            value: 2,
        },
    ];
    const DeviceindexChange = (e: any) => {
        Deviceindex.value = e.detail.value;
    };
    const JD_imgs = ref<string[]>([]);
    const WT_imgs = ref<string[]>([]);

    const save = () => {};

    const tabType = ref<number | null>(null);
    const constructList = ref<any[]>([]);
    const page = ref(1);
    const loadingText = ref('');
    const refreshing = ref(false);
    const loading = ref(false); //
    const hasMore = ref(true); // 新增：是否还有更多数据
    const tabChange = (index: number | null) => {
        tabType.value = index;
    };
    // 获取施工记录列表
    const fetchData = async () => {
        if (loading.value) return; // ✅ 防止重复加载
        loading.value = true;
        loadingText.value = i18n.global.t('common.loading');
        try {
            const res = await API.EMP_ProjectConstructionList({
                id: props.projectId,
                pageNo: page.value, //page.value
                type: tabType.value,
            });
            const newData = res.data.list || [];

            // newData.map((item: any) => {
            //     item.workerNameArr = item.workerNames.split(',');
            // });

            if (newData.length < res.data.pageSize) {
                console.log('没有更多数据了');
                hasMore.value = false;
                loadingText.value = i18n.global.t('common.no-more');
            } else {
                console.log('上拉加载更多');
                hasMore.value = true;
                loadingText.value = i18n.global.t('common.release');
            }

            constructList.value.push(...newData);

            console.log('列表结果res', res);
        } catch (error) {
            console.log('列表结果error', error);
        } finally {
            refreshing.value = false;
            loading.value = false;
        }
    };
    const loadMore = () => {
        if (!hasMore.value || loading.value) return;
        page.value++;
        fetchData();
    };
    fetchData();
</script>

<style lang="scss" scoped>
    .pd-construct {
        display: flex;
        flex-direction: column;
        height: 100%;
        .pd-construct-set-wrap {
            margin-bottom: 43rpx;
            align-items: center;
            .pd-construct-state-btn {
                display: flex;
                gap: 48rpx;
                .state-btn {
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #909399;
                    &.active {
                        color: #f7931e;
                    }
                }
            }
            .pd-construct-add {
                font-weight: 400;
                font-size: 28rpx;
                color: #303133;
                position: relative;
                padding-left: 46rpx;
                &::before {
                    content: '';
                    display: block;
                    width: 36rpx;
                    height: 36rpx;
                    background-image: url('../../../assets/images/add.png');
                    background-size: cover;
                    // background-color: saddlebrown;
                    position: absolute;
                    left: 0;
                }
            }
        }
        .pd-construct-scroll-area {
            flex: 1;
            overflow: auto;
            box-sizing: border-box;

            .pd-construct-card {
                background: #ffffff;
                border-radius: 24rpx;
                padding: 24rpx;
                position: relative;
                overflow: hidden;
                & ~ .pd-construct-card {
                    margin-top: 24rpx;
                }
                .status-box {
                    position: absolute;
                    top: -4rpx;
                    right: -4rpx;
                    color: #999;
                    width: 242rpx;
                    height: 82rpx;
                    z-index: 1;
                    &.status-record {
                        background-color: #303133;
                    }
                    &.status-problem {
                        background-color: #f7931e;
                    }
                }
                .status-wrap {
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size: 26rpx;
                    color: #999;
                    width: 242rpx;
                    height: 82rpx;
                    // background-color: #303133;
                    background-image: url('../../../assets/images/index-state-bg.png');
                    background-size: 100% 100%;
                    z-index: 2;

                    .status-text {
                        display: block;
                        text-align: center;
                        font-weight: 400;
                        font-size: 28rpx;
                        color: #ffffff;
                        margin-top: 6rpx;
                        margin-left: 40rpx;
                    }
                }
                .pd-construct-id {
                    font-weight: 600;
                    font-size: 32rpx;
                    color: #303133;
                    margin-bottom: 24rpx;
                }
                .label-value {
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #909399;
                    & ~ .label-value {
                        margin-top: 24rpx;
                    }
                    .label {
                        flex-shrink: 0;
                    }
                }
            }
        }

        .add-popup {
            .tabs-cap {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 72rpx;
                margin-bottom: 48rpx;
                .tab {
                    font-weight: 400;
                    font-size: 32rpx;
                    color: #303133;
                    line-height: 32rpx;
                    position: relative;
                    width: fit-content;
                    .tab-text {
                        position: relative;
                        z-index: 2;
                    }
                    &.active {
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
                            bottom: -1rpx;
                            z-index: 1;
                        }
                    }
                }
            }
            .tabs-content {
                .form-item {
                    border-radius: 24rpx;
                    border: 1rpx solid #e4e4e4;
                    padding: 24rpx;
                    margin-bottom: 24rpx;
                    &:last-of-type {
                        margin-bottom: 48rpx;
                    }
                    .label {
                        font-weight: 400;
                        font-size: 24rpx;
                        color: #909399;
                        line-height: 24rpx;
                        margin-bottom: 24rpx;
                    }
                    .uni-input {
                        font-weight: 600;
                        font-size: 28rpx;
                        color: #303133;
                        line-height: 28rpx;
                    }
                    .uni-textarea {
                        font-weight: 600;
                        height: 200rpx;
                        font-size: 28rpx;
                        color: #303133;
                        line-height: 28rpx;
                        box-sizing: border-box;
                    }
                }
            }
        }
    }
</style>
