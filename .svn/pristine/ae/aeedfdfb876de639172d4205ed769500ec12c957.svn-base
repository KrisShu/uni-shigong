<!-- 整改页面 -->
<template>
    <view class="page abarbeitung-page">
        <view class="pd-header common-cap">
            <!-- 示例：返回按钮 -->
            <view class="pd-back common-back" @click="Back"> </view>
            <text class="pd-title common-title">{{ $t('staff.mine.key_YQYJ') }}</text>
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
                    <view class="project-id">{{ item.batchno }}</view>
                    <view class="project-title">{{ item.name }} </view>

                    <view class="project-desc-wrap">
                        <view class="desc-item car">
                            <text class="label">{{ $t('common.pro.key_car') }}：</text>
                            <text class="value">{{ item.hardwareNames }}</text>
                        </view>
                        <view class="desc-item people flex">
                            <text class="label">{{ $t('staff.pro.key_person') }}：</text>
                            <view class="people-list flex">
                                <!-- 人员列表的第一个为项目发起人 -->
                                <view
                                    v-for="(people, p) in item.workerNameArr"
                                    class="people-item"
                                    :class="p === 0 ? 'leader' : ''"
                                >
                                    {{ people }}
                                </view>
                            </view>
                        </view>
                        <view class="desc-item time">
                            <text class="label">{{ $t('common.pro.key_date') }}：</text>
                            <text class="value">{{ item.period }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script lang="ts" setup>
    import { ref, nextTick } from 'vue';
    import { onLoad } from '@dcloudio/uni-app';
    import EmptyBox from '@/components/EmptyBox/index.vue';
    import { i18n } from '@/main';
    import { navigateTo, switchTab } from '@/utils/navigate';

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
            const res = await API.EMP_getDelayWarningList({
                pageNo: page.value,
            });
            const newData = res.data.list || [];

            newData.map((item: any) => {
                item.workerNameArr = item.workerNames.split(',');
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
            .loading-box {
                height: 600rpx;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .project-card {
                background: #fff;
                border-radius: 24rpx;
                padding: 24rpx;
                margin-bottom: 24rpx;
                position: relative;
                overflow: hidden;
                .project-id {
                    font-weight: 600;
                    font-size: 32rpx;
                    color: #303133;
                    line-height: 32rpx;
                    margin-bottom: 26rpx;
                }
                .project-title {
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #303133;
                    line-height: 32rpx;
                }
                .project-desc-wrap {
                    margin-top: 24rpx;
                    background: #f4f6f8;
                    border-radius: 24rpx;
                    padding: 24rpx;
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #909399;
                    .desc-item {
                        & ~ .desc-item {
                            margin-top: 28rpx;
                        }
                        .label {
                            flex-shrink: 0;
                        }
                        .people-list {
                            gap: 8rpx;
                            flex-wrap: wrap;
                            .people-item {
                                height: 40rpx;
                                padding: 0 8rpx;
                                background: #ffffff;
                                border-radius: 8rpx;
                                &.leader {
                                    &::before {
                                        content: '';
                                        display: inline-block;
                                        width: 22rpx;
                                        height: 22rpx;
                                        background: url('../../assets/images/leader.png');
                                        background-size: cover;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
