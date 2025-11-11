<template>
    <view class="page" :style="{ height: contentHeight + 'px' }">
        <!-- 顶部固定区域 -->

        <view class="common-cap">
            <!-- 示例：返回按钮 -->
            <view class="common-back" @click="Back"> </view>
            <view class="page-title">{{ $t('cus.requirement.key_GLXM') }}</view>
        </view>

        <!-- 滚动内容区域 -->
        <scroll-view class="scroll-content common-scroll-area" :scroll-y="true" :refresher-enabled="false">
            <!-- 加载中 -->
            <view v-if="loading && page === 1" class="loading-box">
                <text class="loading-icon">⏳</text>
                <text class="loading-text">{{ $t('common.loading') }}</text>
            </view>

            <!-- 数据为空 -->
            <EmptyBox v-else-if="!loading && projectList.length === 0" />

            <!-- 项目列表 -->
            <view v-else>
                <view @click="goToDetail(item)" v-for="item in projectList" :key="item.id" class="project-card">
                    <view class="project-id">
                        {{ item.batchno }}
                        <text class="special-id" v-show="item.demanBatchno">{{ item.demanBatchno }}</text>
                    </view>
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
                        <view class="desc-item time">
                            <text class="label">{{ $t('common.pro.key_date') }}：</text>
                            <text class="value">{{ item.period }} {{ $t('common.unit.day') }}</text>
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
    import { navigateTo } from '@/utils/navigate';
    import API from '@/apis/index';
    import { onLoad } from '@dcloudio/uni-app';
    import EmptyBox from '@/components/EmptyBox/index.vue';
    import { aesDecrypt } from '@/utils/crypt';
    import { useContentHeight } from '@/hooks/useContentHeight';
    import { useSmartBack } from '@/hooks/useSmartBack';

    const { contentHeight } = useContentHeight(0); // 可自定义 tabBar 高度
    const { smartBack } = useSmartBack();
    const Back = () => {
        let fallback = '/pages/packageCustomer/requirement/index';
        smartBack(fallback);
    };

    const projectList = ref<any[]>([]);
    const page = ref(1);
    const loadingText = ref('');
    const refreshing = ref(false);
    const loading = ref(false); //
    const hasMore = ref(true); // 新增：是否还有更多数据
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
            const res = await API.CUS_ViewProject({
                projectIds: projectIds.value,
            });
            const newData = res.data.list || [];
            projectList.value = newData;
            loadingText.value = i18n.global.t('common.no-more');

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

    const goToDetail = (item: any) => {
        navigateTo({
            url: '/pages/packageCustomer/index/proDetail/index',
            query: {
                id: item.id,
                pageType: 'associatedPro',
            },
        });
    };

    // 初始加载

    const projectIds = ref<string>('');
    onLoad((options: any) => {
        projectIds.value = aesDecrypt(options.projectIds);
        fetchProjects();
    });
</script>

<style lang="scss" scoped>
    .page {
        padding-bottom: 120rpx; /* 给自定义tabbar留出空间 */
        height: 100vh;
        overflow: hidden;
        box-sizing: border-box;
    }
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
            height: 30rpx;
            padding-left: 10rpx;
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
        .project-card {
            .project-id {
                .special-id {
                    background: #ffffff;
                    border-radius: 8rpx;
                    border: 1rpx solid #f7931e;
                    height: 40rpx;
                    display: inline-block;
                    line-height: 40rpx;
                    border-left: 8rpx solid #f7931e;
                    padding: 0rpx 8rpx;
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #f7931e;
                }
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
                background-image: url('@/assets/images/index-state-bg.png');
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
        }
    }
</style>
