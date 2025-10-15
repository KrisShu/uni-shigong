<template>
    <view :style="{ height: contentHeight + 'px' }" class="page">
        <!-- 顶部固定区域 -->
        <view class="header">
            <view class="page-title">{{ $t('staff.index.title') }}</view>
            <view class="search-bar">
                <input
                    placeholder-class="ph"
                    type="text"
                    :placeholder="$t('common.pro.placeholder')"
                    v-model="keyword"
                    @confirm="onSearch"
                />
                <image class="search-icon" src="../../assets/images/search.png"></image>
            </view>

            <view class="filter-tabs">
                <view
                    v-for="(item, index) in filterTabs"
                    :key="index"
                    :class="['tab', activeTab === index ? 'active' : '']"
                    @click="switchTab(index)"
                >
                    {{ item.name }}
                </view>
            </view>
        </view>

        <!-- 滚动内容区域 -->
        <scroll-view
            class="scroll-content"
            :scroll-y="true"
            :refresher-enabled="true"
            :refresher-triggered="refreshing"
            @refresherrefresh="onRefresh"
            @scrolltolower="onLoadMore"
        >
            <!-- 加载中 -->
            <view v-if="loading && page === 1" class="loading-box">
                <text class="loading-icon">⏳</text>
                <text class="loading-text">{{ $t('common.loading') }}</text>
            </view>

            <!-- 数据为空 -->
            <view v-else-if="!loading && projectList.length === 0" class="empty-box">
                <text class="empty-text">{{ $t('common.noData') }}</text>
            </view>

            <!-- 项目列表 -->
            <view v-else>
                <view @click="goToDetail(item)" v-for="item in projectList" :key="item.id" class="project-card">
                    <view class="project-id">{{ item.batchno }}</view>
                    <view class="project-title">{{ item.name }} </view>
                    <!-- 项目状态 -->

                    <view class="project-box" :class="getStatusClass(item.status)?.class"></view>
                    <view class="project-status">
                        <text class="project-status-text">{{ getStatusClass(item.status)?.text }}</text>
                    </view>

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

                <!-- 底部加载状态 -->
                <view class="loading-text">{{ loadingText }}</view>
            </view>
        </scroll-view>
    </view>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { i18n } from '@/main';
    import { useContentHeight } from '@/hooks/useContentHeight';
    import { navigateTo } from '@/utils/navigate';
    import API from '@/apis/index';

    const { contentHeight } = useContentHeight(50); // 可自定义 tabBar 高度

    const keyword = ref('');

    const filterTabs = [
        {
            name: i18n.global.t('common.pro.state_0'),
            value: '',
        },
        {
            name: i18n.global.t('common.pro.state_1'),
            value: 0,
        },
        {
            name: i18n.global.t('common.pro.state_2'),
            value: 1,
        },
        {
            name: i18n.global.t('common.pro.state_3'),
            value: 2,
        },
        {
            name: i18n.global.t('common.pro.state_4'),
            value: 3,
        },
    ];
    const activeTab = ref(0);

    const projectList = ref<any[]>([]);
    const page = ref(1);
    const loadingText = ref('');
    const refreshing = ref(false);
    const loading = ref(false); //
    const hasMore = ref(true); // 新增：是否还有更多数据
    // 模拟加载数据
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
            const res = await API.EMP_ProjectList({
                name: keyword.value,
                pageNo: page.value, //page.value
                status: filterTabs[activeTab.value].value,
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

    const getStatusClass = (status: number) => {
        switch (status) {
            case 0:
                return {
                    class: 'status-wait',
                    text: i18n.global.t('common.pro.state_1'),
                }; //未启动
            case 1:
                //施工中
                return {
                    class: 'status-doing',
                    text: i18n.global.t('common.pro.state_2'),
                };
            case 2:
                //施工中（整改）
                return {
                    class: 'status-doing-2',
                    text: `${i18n.global.t('common.pro.state_2')}（${i18n.global.t('common.pro.state_2_ZG')}）`,
                };
            case 3:
                //验收中(甲方)
                return {
                    class: 'status-check-J',
                    text: `${i18n.global.t('common.pro.state_3')}（${i18n.global.t('common.pro.JiaFang')}）`,
                };
            case 4:
                //验收中(乙方)
                return {
                    class: 'status-check-Y',
                    text: `${i18n.global.t('common.pro.state_3')}（${i18n.global.t('common.pro.YiFang')}）`,
                };

            case 5:
                //已完成
                return {
                    class: 'status-done',
                    text: i18n.global.t('common.pro.state_4'),
                };
        }
    };

    const onSearch = () => {
        fetchProjects(true);
    };

    const switchTab = (index: number) => {
        activeTab.value = index;
        fetchProjects(true);
    };

    const onRefresh = () => {
        refreshing.value = true;
        fetchProjects(true);
    };

    const onLoadMore = () => {
        if (!hasMore.value || loading.value) return;
        page.value++;
        fetchProjects();
    };

    const goToDetail = (item: any) => {
        console.log('goToDetail', item);
        navigateTo({
            url: '/pages/index/proDetail/index',
            query: {
                id: item.id,
            },
        });
    };

    // 初始加载
    fetchProjects();
</script>

<style lang="scss" scoped>
    .page-title {
        font-weight: 600;
        font-size: 36rpx;
        color: #303133;
        line-height: 50rpx;
        background: #f4f6f8;
    }

    .header {
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .search-bar {
        width: 100%;
        height: 88rpx;
        background: #ffffff;
        border-radius: 24rpx;
        padding: 24rpx 30rpx 24rpx;
        box-sizing: border-box;
        margin-bottom: 32rpx;
        margin-top: 24rpx;
        display: flex;
        align-items: center;

        input {
            background: #ffffff;
            border-radius: 24rpx;
            font-size: 28rpx;
            flex: 1 0 0;
        }
        .search-icon {
            width: 34rpx;
            height: 34rpx;
            flex-shrink: 0;
            margin-left: 28rpx;
        }
    }
    .filter-tabs::-webkit-scrollbar {
        display: none; /* Chrome/Safari */
    }
    .filter-tabs {
        width: 100%;
        display: flex;
        overflow-x: auto;
        flex-wrap: nowrap;
        align-items: center;
        background-color: #f4f6f8;
        gap: 24rpx;
        scrollbar-width: none; /* Firefox */
        .tab {
            height: 56rpx;
            background: #ffffff;
            border-radius: 16rpx;
            font-size: 28rpx;
            color: #909399;
            padding: 0rpx 32rpx;
            line-height: 56rpx;
            flex-shrink: 0;
            &.active {
                color: #fff;
                background: #f7931e;
            }
        }
    }

    .scroll-content {
        flex: 1;
        overflow: auto;
        padding-top: 32rpx;
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
            .project-box {
                width: 242rpx;
                height: 82rpx;
                background-color: #303133;
                z-index: 1;
                position: absolute;
                top: -4rpx;
                right: -4rpx;
                &.status-wait {
                    background-color: #303133;
                }

                &.status-doing-2 {
                    background-color: #fa2b19;
                }
                &.status-doing,
                &.status-check,
                &.status-check-Y,
                &.status-check-J {
                    background-color: #f7931e;
                }

                &.status-done {
                    background-color: #11a84b;
                }
            }
            .project-status {
                position: absolute;
                top: 0;
                right: 0;
                font-size: 26rpx;
                color: #999;
                width: 260rpx;
                height: 82rpx;
                // background-color: #303133;
                background-image: url('../../assets/images/index-state-bg.png');
                background-size: 100% 100%;
                z-index: 2;

                .project-status-text {
                    display: block;
                    text-align: center;
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #ffffff;
                    margin-top: 6rpx;
                    margin-left: 52rpx;
                }
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

    .loading-text {
        text-align: center;
        color: #888;
        font-size: 26rpx;
        padding: 20rpx 0;
    }
</style>
