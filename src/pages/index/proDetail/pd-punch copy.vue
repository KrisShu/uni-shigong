<!-- 打卡tab页 -->
<template>
    <view class="pd-punch">
        <view class="pd-punch-wrap">
            <!-- 签到 -->
            <view class="punch-wrap" :class="{ disabled: signIned }" @click="handleSignIn">
                <view class="title-text">{{ $t('staff.pro.clock_in.key_SGQD') }}</view>
                <view class="clock-time"> （{{ signInTime }}）</view>
                <view class="punch-btn">
                    {{ signIned ? $t('staff.pro.clock_in.key_YQD') : $t('staff.pro.clock_in.key_QD') }}
                </view>
            </view>
            <!-- 签退 -->
            <view class="punch-wrap" :class="{ disabled: signOuted }" @click="handleSignOut">
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
            <scroll-view
                class="history-wrap common-scroll-area"
                scroll-y
                :show-scrollbar="false"
                :enhanced="true"
                :enable-back-to-top="true"
                @scrolltolower="onLoadMore"
            >
                <!-- 加载中 -->
                <view v-if="loading && page === 1" class="loading-box">
                    <text class="loading-icon">⏳</text>
                    <text class="loading-text">{{ $t('common.loading') }}</text>
                </view>

                <!-- 数据为空 -->

                <EmptyBox v-else-if="!loading && historyList.length === 0" />
                <view v-else class="pd-punch-history__item" v-for="(item, index) in historyList" :key="index">
                    <view class="flex j-between a-center">
                        <view class="pd-punch-history__time">{{ item.clockDate }}</view>
                        <view class="pd-punch-history__people">
                            {{ $t('common.pro.clock_in.key_DKR') }}：{{ item.workerName }}
                        </view>
                    </view>
                    <view class="flex j-between punch-images">
                        <view class="punch-image" v-for="(his, i) in item.workerRecordsList" :key="i">
                            <text class="label" v-show="his.imgPath">
                                {{
                                    his.type == 0
                                        ? $t('common.pro.clock_in.key_SGQD')
                                        : $t('common.pro.clock_in.key_SGQT')
                                }}：
                            </text>
                            <view class="pd-images" v-if="his.imgPath">
                                <view class="pd-image-box">
                                    <ImagePreview :images="BASEURL + his.imgPath" />
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <!-- <view class="history-wrap"> </view> -->
        </view>
    </view>
</template>

<script lang="ts" setup>
    import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';
    import API from '@/apis/index';
    import { i18n } from '@/main';
    import { takePhoto, validateImage } from '@/utils/takePhoto';
    import { uploadOne } from '@/utils/uploader';
    import ImagePreview from '@/components/ImagePreview/index.vue';
    import EmptyBox from '@/components/EmptyBox/index.vue';

    const BASEURL = import.meta.env.VITE_IMAGE_BASEURL;

    const props = defineProps<{
        projectId: string | number;
        projectStatus?: number;
    }>();

    const recordData = reactive({});

    // 打卡相关
    const busy = ref(false);
    const signIned = ref(false);
    const signOuted = ref(false);
    const signInTime = ref('--:--:--');
    const signInTime_compelete = ref('');
    const signOutTime = ref('--:--:--');
    const signOutTime_compelete = ref('');

    // 获取打卡记录回显数据
    const fetchRecord = async () => {
        try {
            const res = await API.EMP_ProjectClockRecord({
                id: props.projectId,
            });
            Object.assign(recordData, res.data);
            signIned.value = res.data.clockIn;
            signOuted.value = res.data.clockOut;
            if (res.data.clockIn) {
                // 如果已签到 那么显示签到时间
                signInTime.value = res.data.clockInTime;
            }
            if (res.data.clockOut) {
                // 如果已签退 那么显示签退时间
                signOutTime.value = res.data.clockOutTime;
            }

            console.log('打卡记录res', res);
        } catch (error) {
            console.log('error', error);
        }
    };

    const loadingText = ref('');
    const page = ref(1);
    const loading = ref(false); //
    const hasMore = ref(true); // 新增：是否还有更多数据
    const historyList = ref<any[]>([]);
    // 获取历史打卡记录
    const fetchHistory = async (reset = false) => {
        if (loading.value) return; // ✅ 防止重复加载
        loading.value = true;
        loadingText.value = i18n.global.t('common.loading');
        if (reset) {
            page.value = 1;
            historyList.value = [];
            hasMore.value = true; // 重置时认为还有更多，直到服务端返回判断
        }

        try {
            const res = await API.EMP_ProjectHistorySignInRecordList({
                id: props.projectId,
                pageNo: page.value,
            });
            const newData = res.data.list || [];

            if (newData.length < res.data.pageSize) {
                console.log('没有更多数据了');
                hasMore.value = false;
                loadingText.value = i18n.global.t('common.no-more');
            } else {
                console.log('上拉加载更多');
                hasMore.value = true;
                loadingText.value = i18n.global.t('common.release');
            }
            if (reset) {
                historyList.value = newData;
            } else {
                historyList.value.push(...newData);
            }

            console.log('历史打卡记录res', res);
        } catch (error) {
            console.log('error', error);
        } finally {
            loading.value = false;
        }
    };
    const onLoadMore = () => {
        if (!hasMore.value || loading.value) return;
        page.value++;
        fetchHistory();
    };

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

    const handleSignIn = async () => {
        console.log('handleSignIn---signIned', signIned.value);
        console.log('handleSignIn---busy', busy.value);
        if (signIned.value || busy.value) return;

        busy.value = true;
        try {
            // 1) 拍照
            const photo = await takePhoto({ compressed: true });
            console.log('photo======', photo);
            if (!photo) {
                // 用户取消/无文件 —— 直接结束（finally 会复位 busy）
                return;
            }

            // 2) 校验
            // validateImage(photo, { acceptExt: ['png', 'jpg', 'jpeg', 'webp'], maxMB: 10 });

            // 3) 上传
            uni.showLoading({ title: i18n.global.t('common.text.SCZ'), mask: true });
            const remoteUrl = await uploadOne(photo.path); // 如需自定义 headers 等，传第二个参数
            uni.hideLoading();
            console.log('remoteUrl---------', remoteUrl);

            // 4) 业务提交
            const clockShort = getNowTimeStr('HH:mm:ss');
            const clockFull = getNowTimeStr();
            await API.EMP_ProjectConstructionSignIn({
                id: props.projectId,
                clockTime: clockFull,
                imgPath: remoteUrl,
            });

            // 5)本地状态
            signIned.value = true;
            signInTime.value = clockShort;
            signInTime_compelete.value = clockFull;
            uni.showToast({ title: i18n.global.t('staff.pro.clock_in.key_QDSUCCESS'), icon: 'success' });
            fetchHistory(true);
        } catch (error) {
            console.log('error', error);
            uni.hideLoading();
            signIned.value = false;
        } finally {
            busy.value = false;
        }

        console.log('signIned', signInTime.value, signInTime_compelete.value);
    };

    const handleSignOut = async () => {
        if (signOuted.value || busy.value) return;
        busy.value = true;

        try {
            // 1) 拍照
            const photo = await takePhoto({ compressed: true });
            if (!photo) {
                // 用户取消/无文件 —— 直接结束（finally 会复位 busy）
                return;
            }

            // 2) 校验
            // validateImage(photo, { acceptExt: ['png', 'jpg', 'jpeg', 'webp'], maxMB: 10 });

            // 3) 上传
            uni.showLoading({ title: i18n.global.t('common.text.SCZ'), mask: true });
            const remoteUrl = await uploadOne(photo.path); // 如需自定义 headers 等，传第二个参数
            uni.hideLoading();
            console.log('remoteUrl---------', remoteUrl);

            // 4) 业务提交
            const clockShort = getNowTimeStr('HH:mm:ss');
            const clockFull = getNowTimeStr();
            await API.EMP_ProjectConstructionSignOut({
                id: props.projectId,
                clockTime: clockFull,
                imgPath: remoteUrl,
            });

            // 5)本地状态
            signOuted.value = true;
            signOutTime.value = clockShort;
            signOutTime_compelete.value = clockFull;
            uni.showToast({ title: i18n.global.t('staff.pro.clock_in.key_QTSUCCESS'), icon: 'success' });
            fetchHistory(true);
        } catch (error) {
            console.log('error', error);
            uni.hideLoading();
            signIned.value = false;
        } finally {
            busy.value = false;
        }
    };

    watch(
        () => props.projectStatus,
        newVal => {
            if (newVal != 0) {
                //当状态不为0是代表项目已启动，就可以获取打卡记录了
                fetchRecord();

                fetchHistory();
                updateClock();
                timer = setInterval(updateClock, 1000);
            }
        },
    );

    onUnmounted(() => {
        clearInterval(timer);
    });
</script>

<style lang="scss">
    .pd-punch {
        display: flex;
        flex-direction: column;
        height: 100%;
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
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;

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
                box-sizing: border-box;
                flex: 1;
                overflow: auto;

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
