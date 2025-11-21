<template>
    <view :style="{ height: contentHeight + 'px' }" class="page">
        <!-- 顶部固定区域 -->
        <view class="header">
            <view class="flex j-between">
                <view class="page-title">{{ $t('staff.task.title') }}</view>
                <view class="page-add" @click="handelAdd">{{ $t('staff.task.add') }}</view>
            </view>
            <view class="search-bar">
                <input
                    placeholder-class="ph"
                    type="text"
                    :placeholder="$t('staff.task.placeholder')"
                    v-model="keyword"
                    @confirm="onSearch"
                />
                <image @click="onSearch" class="search-icon" src="../../assets/images/search.png"></image>
            </view>

            <scroll-view class="filter-tabs" scroll-x :scroll-into-view="scrollToId" :show-scrollbar="false">
                <view
                    v-for="(item, index) in filterTabs"
                    :key="index"
                    :id="'tab-' + index"
                    :class="['tab', activeTab === index ? 'active' : '']"
                    @click="switchTab(index)"
                >
                    {{ item.name }}
                </view>
            </scroll-view>
        </view>
        <!-- 滚动内容区域 -->
        <scroll-view
            class="task-scroll-content common-scroll-area"
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
            <EmptyBox v-else-if="!loading && taskList.length === 0" />

            <!-- 项目列表 -->
            <view v-else>
                <view @click="goToEdit(item)" v-for="item in taskList" :key="item.id" class="project-card">
                    <!-- 任务描述 -->
                    <view class="desc">
                        <view class="state-wrap" :class="getStatusClass(item.status)?.class">
                            {{ getStatusClass(item.status)?.text }}
                        </view>
                        {{ item.taskDescription }}
                    </view>
                    <!--地址  -->
                    <view class="address" v-if="item.address">{{ item.address }}</view>
                    <!-- 时间范围 -->
                    <view class="time-range" v-if="item.startTime">{{ item.startTime }}-{{ item.endTime }}</view>
                    <!-- 编辑任务，开启任务 -->
                    <view class="btn-wrap" v-if="item.status === 1 || item.status === 2 || item.status === -2">
                        <view v-if="item.status === 1" class="btn-item">{{ $t('staff.task.list.btn_BJRW') }}</view>
                        <view v-if="item.status === 1" class="btn-item" @click="handelStart(item)">
                            {{ $t('staff.task.list.btn_KQRW') }}
                        </view>
                        <view v-if="item.status === 2 || item.status === -2" class="btn-item" @click="handelEnd(item)">
                            {{ $t('staff.task.list.btn_JSRW') }}
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
    import { ref, nextTick } from 'vue';
    import { i18n } from '@/main';
    import { useContentHeight } from '@/hooks/useContentHeight';
    import { useFilterStore } from '@/stores/filter';
    import API from '@/apis/index';
    import { onLoad, onShow } from '@dcloudio/uni-app';
    import { navigateTo } from '@/utils/navigate';
    import { debounce } from '@/utils/common';

    const { contentHeight } = useContentHeight(50);
    const filterStore = useFilterStore();

    const keyword = ref('');

    const filterTabs = [
        {
            name: i18n.global.t('staff.task.state_0'),
            value: '',
        },
        {
            name: i18n.global.t('staff.task.state_1'),
            value: 1,
        },
        {
            name: i18n.global.t('staff.task.state_2'),
            value: 2,
        },
        {
            name: i18n.global.t('staff.task.state_3'),
            value: -2,
        },
        {
            name: i18n.global.t('staff.task.state_4'),
            value: 3,
        },
    ];
    const activeTab = ref(0);
    const scrollToId = ref('tab-0');

    const onSearch = () => {
        filterStore.set({
            taskKeyword: keyword.value,
            taskPageNo: 1,
        });
        fetchList(true);
    };
    const taskList = ref<any[]>([
        {
            address: '锦城大道666号',
            taskDescription:
                '任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述',
            startTime: '2025-11-21 10:49',
            taskId: 3,
            endTime: '2025-11-21 10:49',
            type: true,
            hardwareName: '钻孔机',
            status: 1,
        },
    ]);
    const page = ref(1);
    const loadingText = ref('');
    const refreshing = ref(false);
    const loading = ref(false); //
    const hasMore = ref(true); // 新增：是否还有更多数据
    // 加载列表数据
    const fetchList = async (reset = false) => {
        if (loading.value) return; // ✅ 防止重复加载
        loading.value = true;
        loadingText.value = i18n.global.t('common.loading');

        if (reset) {
            console.log('重置数据==');
            page.value = 1;
            taskList.value = [];
            hasMore.value = true; // 重置时认为还有更多，直到服务端返回判断
        }

        try {
            const res = await API.EMP_TaskList({
                name: keyword.value,
                pageNo: page.value, //page.value
                status: filterTabs[activeTab.value].value,
            });
            const newData = res.data.list || [];
            if (page.value < res.data.pages) {
                console.log('上拉加载更多');
                hasMore.value = true;
                loadingText.value = i18n.global.t('common.release');
            } else {
                console.log('没有更多数据了');
                hasMore.value = false;
                loadingText.value = i18n.global.t('common.no-more');
            }
            if (reset) {
                taskList.value = newData;
            } else {
                taskList.value.push(...newData);
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
            case 1:
                //未开始
                return {
                    class: 'status-wait',
                    text: i18n.global.t('staff.task.state_1'),
                };
            case 2:
                //进行中
                return {
                    class: 'status-doing',
                    text: i18n.global.t('staff.task.state_2'),
                };
            case -2:
                //进行中(延期)
                return {
                    class: 'status-doing-delay',
                    text: `${i18n.global.t('staff.task.state_2')}（${i18n.global.t('staff.task.state_3')}）`,
                };
            case 3:
                //已完成
                return {
                    class: 'status-ed',
                    text: `${i18n.global.t('staff.task.state_4')}`,
                };
        }
    };

    const switchTab = (index: number) => {
        filterStore.set({ taskActiveTab: index, taskScrollTop: 0, taskPageNo: 1 }); // 记录回到顶部
        lastScrollTop.value = 0;
        activeTab.value = index;
        // 让 scroll-view 滚动到对应 tab
        scrollToId.value = 'tab-' + index;
        fetchList(true);
    };

    const lastScrollTop = ref(0);
    const onScroll = (e: any) => {
        lastScrollTop.value = e.detail.scrollTop;
    };
    const onRefresh = async () => {
        filterStore.set({ taskPageNo: 1 });
        refreshing.value = true;
        await fetchList(true);
    };

    const onLoadMore = () => {
        if (!hasMore.value || loading.value) return;
        page.value++;
        filterStore.set({ taskPageNo: page.value });
        fetchList();
    };

    const goToEdit = (item: any) => {};
    const handelStart = debounce(
        async (item: any) => {
            const res = await API.EMP_startTask({
                taskId: item.taskId,
            });
            if (res.code === 2000) {
                uni.showToast({ title: i18n.global.t('staff.task.list.btn_KQRW_success'), icon: 'success' });
                fetchList(true);
            }
        },
        1000,
        true,
    );
    const handelEnd = debounce(
        async (item: any) => {
            const res = await API.EMP_endTask({
                taskId: item.taskId,
            });
            if (res.code === 2000) {
                uni.showToast({ title: i18n.global.t('staff.task.list.btn_JSRW_success'), icon: 'success' });
                fetchList(true);
            }
        },
        1000,
        true,
    );

    async function restoreAndFetch(reset: boolean) {
        console.log('restoreAndFetch', filterStore.taskKeyword);
        // 先恢复筛选（你的逻辑）
        activeTab.value = Number(filterStore.taskActiveTab) ?? 0;

        keyword.value = filterStore.taskKeyword ?? '';
        page.value = filterStore.taskPageNo ?? 1;
        const pageName = filterStore.pageName || '';

        // 再拉列表（会触发 DOM 生成）
        if (reset || pageName === 'empMine') {
            await fetchList(true);
        }
        filterStore.set({ pageName: '' }); // 清空pageName 避免影响下次判断

        // 确保 filter tabs 可见：设置 scrollToId（等待一帧让 DOM 渲染）
        await nextTick();
        scrollToId.value = 'tab-' + (activeTab.value || 0);

        // 等一帧渲染完成后再恢复滚动
        nextTick(() => {
            // 强制触发变更：先置 -1 再置目标值（同值赋值在 H5 不触发）
            const y = filterStore.taskScrollTop || 0;
            lastScrollTop.value = -1;
            requestAnimationFrame(() => (lastScrollTop.value = y));
        });
    }

    const handelAdd = () => {
        navigateTo({ url: '/pages/task/addEdit' });
    };

    // 初始加载

    onShow(() => {
        console.log('onShow');

        // 来自个人中心并需要恢复/刷新时触发
        if (filterStore.pageName === 'empMine') {
            restoreAndFetch(true);
        }
    });

    onLoad(() => {
        console.log('onLoad - 初次进入或冷启动');
        // 初次加载：恢复筛选并强制拉一次数据（首次进入需要数据）
        restoreAndFetch(true);
    });
</script>

<style lang="scss" scoped>
    .page-title {
        font-weight: 600;
        font-size: 36rpx;
        color: #303133;
        line-height: 50rpx;
        background: #f4f6f8;
    }
    .page-add {
        font-weight: 400;
        font-size: 24rpx;
        color: #303133;
        line-height: 33rpx;
        position: relative;
        padding-left: 44rpx;
        &::after {
            content: '';
            position: absolute;
            width: 34rpx;
            height: 34rpx;
            background-image: url('@/assets/images/task-add.png');
            background-size: cover;
            left: 0;
        }
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
            padding-left: 20rpx;
            height: 30rpx;
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
        overflow-x: auto;
        background-color: #f4f6f8;
        :deep(.uni-scroll-view-content) {
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            gap: 24rpx;
            scrollbar-width: none; /* Firefox */
            -webkit-overflow-scrolling: touch;
        }
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
    .task-scroll-content {
        flex: 1;
        min-height: 0;
        overflow: auto;
        box-sizing: border-box;
        padding-top: 32rpx;
        .project-card {
            background: #fff;
            border-radius: 24rpx;
            padding: 24rpx;
            margin-bottom: 24rpx;
            position: relative;
            overflow: hidden;
            .desc {
                font-weight: 600;
                font-size: 28rpx;
                color: #303133;
                line-height: 42rpx;

                .state-wrap {
                    height: 40rpx;
                    line-height: 40rpx;
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #ffffff;
                    padding: 0 16rpx;
                    border-radius: 20rpx 20rpx 0rpx 20rpx;
                    margin-right: 16rpx;
                    display: inline-block;
                    &.status-wait {
                        background-color: #303133;
                    }
                    &.status-doing {
                        background-color: #f7931e;
                    }
                    &.status-doing-delay {
                        background-color: #fa2b19;
                    }
                    &.status-ed {
                        background-color: #11a84b;
                    }
                }
            }
            .address,
            .time-range {
                font-weight: 400;
                font-size: 28rpx;
                color: #909399;
                line-height: 32rpx;
                padding-left: 48rpx;
                margin-top: 24rpx;
                position: relative;
                &::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);

                    width: 32rpx;
                    height: 32rpx;

                    background-size: cover;
                }
            }
            .address {
                &::before {
                    height: 34rpx;
                    background-image: url('@/assets/images/task-address.png');
                }
            }
            .time-range {
                &::before {
                    background-image: url('@/assets/images/task-time.png');
                }
            }
            .btn-wrap {
                margin-top: 32rpx;
                border-top: 1rpx solid #e4e4e4;
                display: flex;
                padding-top: 26rpx;
                .btn-item {
                    flex: 1;
                    flex-shrink: 0;
                    min-width: 0;
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #303133;
                    line-height: 28rpx;

                    text-align: center;
                    & ~ .btn-item {
                        border-left: 1rpx solid #e4e4e4;
                    }
                }
            }
        }
    }
</style>
