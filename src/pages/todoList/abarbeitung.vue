<!-- 整改页面 -->
<template>
    <view class="page abarbeitung-page">
        <view class="pd-header common-cap">
            <!-- 示例：返回按钮 -->
            <view class="pd-back common-back" @click="Back"> </view>
            <text class="pd-title common-title">{{ $t('staff.mine.key_ZGZ') }}</text>
        </view>

        <scroll-view
            class="scroll-content"
            :scroll-y="true"
            :refresher-enabled="true"
            :refresher-triggered="refreshing"
            @refresherrefresh="onRefresh"
            @scrolltolower="onLoadMore"
            @scroll="onScroll"
            refresher-background="transparent"
            :scroll-top="lastScrollTop"
        >
            <!-- 加载中 -->
            <view v-if="loading && page === 1" class="loading-box">
                <text class="loading-icon">⏳</text>
                <text class="loading-text">{{ $t('common.loading') }}</text>
            </view>

            <!-- 数据为空 -->
            <EmptyBox v-else-if="!loading && projectList.length === 0" />

            <view v-else>
                <view @click="goToDetail(item)" v-for="item in projectList" :key="item.id" class="project-card">
                    <view class="project-id">{{ item.batchno }} </view>
                    <view class="item">
                        <view class="label">{{ $t('staff.abarbeitung.key_XMMC') }}：</view>
                        <view class="value">{{ item.name }}</view>
                    </view>
                    <view class="item">
                        <view class="label">{{ $t('staff.abarbeitung.key_XMWZ') }}：</view>
                        <view class="value">{{ item.address }}</view>
                    </view>
                    <view class="item">
                        <view class="label">{{ $t('staff.abarbeitung.key_YSSJ') }}：</view>
                        <view class="value">{{ item.creattime }}</view>
                    </view>
                    <view class="item">
                        <view class="label">{{ $t('staff.abarbeitung.key_YYJG') }}：</view>
                        <view class="value">{{ item.type }}</view>
                    </view>
                    <view class="item">
                        <view class="label">{{ $t('staff.abarbeitung.key_YYSM') }}：</view>
                        <view class="value">{{ item.reason }}</view>
                    </view>
                    <view class="item">
                        <view class="label">{{ $t('staff.abarbeitung.key_YYSMT') }}：</view>
                        <ImagePreview :images="item.acceptancePath" />
                    </view>
                    <view class="btn-box" @click.stop="openPop(item)">
                        <view class="btn">{{ $t('staff.abarbeitung.btn') }}</view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <uni-popup
            @touchmove.stop.prevent
            :animation="true"
            ref="buildCompletedRef"
            type="bottom"
            :is-mask-click="false"
        >
            <view class="build-completed-popup bottom-popup">
                <view class="close-popup" @click="closebuildPop"></view>
                <view class="popup_title">{{ $t('staff.pro.end_title') }}</view>
                <view class="build-completed-item">
                    <view class="label required">{{ $t('staff.pro.end_key_image') }}</view>
                    <ImageUploader v-model="ZG_imgs" />
                </view>
                <view class="build-completed-item">
                    <view class="label">{{ $t('staff.pro.end_key_desc') }}</view>
                    <textarea
                        placeholder-class="ph"
                        :placeholder="$t('common.placeholder')"
                        class="uni-textarea"
                        v-model="ZG_reason"
                    ></textarea>
                </view>
                <LockButton :onClick="submit">{{ $t('common.save') }}</LockButton>
            </view>
        </uni-popup>
    </view>
</template>

<script lang="ts" setup>
    import { ref, nextTick } from 'vue';
    import { onLoad } from '@dcloudio/uni-app';
    import EmptyBox from '@/components/EmptyBox/index.vue';
    import { i18n } from '@/main';
    import { navigateTo, switchTab } from '@/utils/navigate';
    import ImagePreview from '@/components/ImagePreview/index.vue';
    import ImageUploader from '@/components/ImageUploader/index.vue';
    import LockButton from '@/components/LockButton/index.vue';
    import API from '@/apis/index';
    import { useFilterStore } from '@/stores/filter';

    const filterStore = useFilterStore();

    const BASEURL = import.meta.env.VITE_IMAGE_BASEURL;
    const Back = () => {
        switchTab({
            url: '/pages/mine/index',
        });
    };

    const projectList = ref<any[]>([]);
    const page = ref(1);
    const loadingText = ref('');
    const refreshing = ref(false);
    const loading = ref(false); //
    const hasMore = ref(true); // 新增：是否还有更多数据

    const goToDetail = (item: any) => {
        filterStore.set({ ZG_scrollTop: lastScrollTop.value });

        navigateTo({
            url: '/pages/index/proDetail/index',
            query: {
                id: item.id,
                pageType: 'abarbeitung',
            },
        });
    };
    // 加载列表数据
    const fetchProjects = async (reset = false) => {
        if (loading.value) return; // ✅ 防止重复加载
        loading.value = true;
        loadingText.value = i18n.global.t('common.loading');

        if (reset) {
            page.value = 1;
            projectList.value = [];
            hasMore.value = true; // 重置时认为还有更多，直到服务端返回判断
        }

        try {
            const res = await API.EMP_getRectifyList({
                pageNo: page.value,
            });
            const newData = res.data.list || [];

            newData.forEach((item: any) => {
                item.acceptancePath = item.acceptancePath
                    ? item.acceptancePath.split(',').map((item: any) => BASEURL + item)
                    : '';
            });

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
                projectList.value = newData;
            } else {
                projectList.value.push(...newData);
            }

            console.log('列表结果res', res);
        } catch (error) {
            console.log('列表结果error', error);
        } finally {
            refreshing.value = false;
            loading.value = false;
        }
    };

    const onRefresh = async () => {
        refreshing.value = true;
        await fetchProjects(true);
    };

    const onLoadMore = () => {
        if (!hasMore.value || loading.value) return;
        page.value++;
        fetchProjects();
    };
    const onScroll = (e: any) => {
        lastScrollTop.value = e.detail.scrollTop;
    };

    const lastScrollTop = ref(0);

    const buildCompletedRef = ref<any>(null);
    const currProjectId = ref('');
    const openPop = (item: any) => {
        ZG_imgs.value = [];
        ZG_reason.value = '';

        currProjectId.value = item.id;
        buildCompletedRef.value.open();
    };
    const closebuildPop = () => {
        buildCompletedRef.value.close();
    };

    const ZG_imgs = ref<any[]>([]); // 保存施工结束
    const ZG_reason = ref('');
    const submit = async () => {
        if (!ZG_imgs.value.length) {
            uni.showToast({
                title: i18n.global.t('common.text.SCTP'),
                icon: 'none',
            });
            return;
        }
        try {
            const acceptancePathArr = ZG_imgs.value.map(item => item.path);
            const res = await API.EMP_rectifySubmit({
                id: currProjectId.value,
                acceptancePath: acceptancePathArr.join(','),
                reason: ZG_reason.value,
            });
            buildCompletedRef.value.close();
            fetchProjects();
        } catch (error) {
            console.log('error', error);
        }
    };

    async function restoreAndFetch(query: any) {
        // 拉列表（会触发 DOM 生成）
        await fetchProjects(true);

        // 等一帧渲染完成后再恢复滚动
        nextTick(() => {
            // 强制触发变更：先置 -1 再置目标值（同值赋值在 H5 不触发）
            const y = filterStore.ZG_scrollTop || 0;
            lastScrollTop.value = -1;
            requestAnimationFrame(() => (lastScrollTop.value = y));
        });
    }

    // 初始加载

    onLoad((query: any) => {
        restoreAndFetch(query);
    });
</script>

<style lang="scss">
    .abarbeitung-page {
        height: 100vh;
        display: flex;
        flex-direction: column;
        .scroll-content {
            flex: 1;
            min-height: 0;
            overflow: auto;
            box-sizing: border-box;
            .project-card {
                background: #fff;
                padding: 24rpx;
                box-sizing: border-box;
                border-radius: 24rpx;
                overflow: hidden;
                margin-bottom: 24rpx;
                .project-id {
                    font-weight: 600;
                    font-size: 32rpx;
                    color: #303133;
                    line-height: 32rpx;
                }
                .item {
                    display: flex;
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #909399;
                    line-height: 32rpx;
                    margin-top: 24rpx;
                    .label {
                        flex-shrink: 0;
                    }
                }
                .btn-box {
                    border-top: 1rpx solid #e4e4e4;
                    padding-top: 20rpx;
                    margin-top: 30rpx;
                    display: flex;
                    justify-content: center;
                    .btn {
                        font-weight: 400;
                        font-size: 24rpx;
                        color: #303133;
                        line-height: 33rpx;
                        position: relative;
                        padding-left: 40rpx;
                        &::before {
                            content: '';
                            width: 32rpx;
                            height: 32rpx;
                            background-image: url('../../assets/images/zg_icon.png');
                            background-size: cover;
                            margin-right: 8rpx;
                            display: inline-block;
                            position: absolute;
                            left: 0;
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
    }
</style>
