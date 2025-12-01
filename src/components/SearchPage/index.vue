<template>
    <view class="page search-page" v-if="modelValue">
        <view class="top-fixed">
            <view class="pd-header common-cap">
                <!-- 示例：返回按钮 -->
                <view class="pd-back common-back" @click="Back"> </view>
                <text class="pd-title common-title">搜索</text>
            </view>
        </view>
        <view class="search-input">
            <input
                class="uni-input"
                placeholder-class="ph"
                type="text"
                :placeholder="$t('common.placeholder')"
                :value="inputValue"
                @input="searchInput"
                :focus="true"
            />
            <view v-if="showClearIcon" class="icon-close" @click="clearInput"></view>
        </view>

        <view class="scroll-search-content">
            <view v-if="searchList.length">
                <view class="search-item" v-for="value in searchList" :key="value.id" @click="chooseItem(value)">
                    {{ value.name }}
                </view>
            </view>
            <EmptyBox v-else />
        </view>
    </view>
</template>

<script lang="ts" setup>
    import { reactive, ref } from 'vue';
    import API from '@/apis/index';
    import { debounce } from '@/utils/common';
    import EmptyBox from '@/components/EmptyBox/index.vue';

    const inputValue = ref('');
    const showClearIcon = ref(false);

    const props = withDefaults(
        defineProps<{
            modelValue: boolean;
            searchType: string;
        }>(),
        {
            modelValue: false,
        },
    );
    const emits = defineEmits<{
        (e: 'update:modelValue', v: boolean): void;
        (e: 'chooseData', v: any): void;
    }>();
    const searchList = reactive<any[]>([]);

    const searchInput = debounce(
        async (e: any) => {
            inputValue.value = e.detail.value;
            if (e.detail.value.length > 0) {
                showClearIcon.value = true;
            } else {
                showClearIcon.value = false;
            }
            if (!inputValue.value) return;

            const res = await API.searchAPI({
                keywords: inputValue.value,
                searchType: props.searchType,
            });

            console.log(res);

            searchList.splice(0, searchList.length, ...res.data.list);
        },
        500,
        false,
    );
    const clearInput = () => {
        inputValue.value = '';
        searchList.splice(0, searchList.length);
        showClearIcon.value = false;
    };

    const Back = () => {
        emits('update:modelValue', false);
        clearInput();
    };
    const chooseItem = (item: any) => {
        emits('chooseData', {
            ...item,
            searchType: props.searchType,
        });
        clearInput();
    };
</script>

<style lang="scss" scoped>
    .search-page {
        height: 100%;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 999;
        .search-input {
            border-radius: 24rpx;
            border: 1rpx solid #f7931e;
            height: 88rpx;
            line-height: 88rpx;
            padding: 0 24rpx;
            display: flex;
            align-items: center;
            margin-bottom: 24rpx;
            .uni-input {
                height: 88rpx;
                line-height: 88rpx;
                flex: 1;
                min-width: 0;
                font-weight: 600;
                font-size: 28rpx;
                color: #303133;
                line-height: 28rpx;
            }
            .icon-close {
                width: 29rpx;
                height: 29rpx;
                background: url('@/assets/images/icon-close-pop.png');
                background-size: cover;
            }
        }
        .scroll-search-content {
            flex: 1;
            flex-shrink: 0;
            min-height: 0;
            overflow-y: auto;
            // background-color: antiquewhite;
            .search-item {
                margin-bottom: 40rpx;
                font-weight: 400;
                font-size: 28rpx;
                color: #303133;
                line-height: 40rpx;
            }
        }
    }
</style>
