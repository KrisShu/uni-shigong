<template>
    <view class="page task-pageAddEdit-page" :style="{ height: contentHeight + 'px' }">
        <view class="top-fixed">
            <view class="pd-header common-cap">
                <!-- 示例：返回按钮 -->
                <view class="pd-back common-back" @click="Back"> </view>
                <text class="pd-title common-title">{{ $t('staff.task.add') }}</text>
            </view>
        </view>
        <scroll-view class="scroll-from" scroll-y>
            <!-- 任务类型 -->
            <view class="form-bg-item">
                <view class="label required">{{ $t('staff.task.add.key_RWLX') }}</view>

                <picker @change="bindPickerTypeChange" :value="typeIndex" :range="typeArray" range-key="name">
                    <view class="uni-input choose-input" :class="form.type !== null ? '' : 'choose-input-placeholder'">
                        {{ form.type !== null ? typeArray[typeIndex].name : $t('common.placeholder_choose') }}
                    </view>
                </picker>
            </view>
            <!-- 关联项目 -->

            <view class="form-bg-item" v-if="form.type === 2">
                <view class="label required">{{ $t('staff.task.add.key_GLXM') }}</view>
                <view class="uni-input choose-input" :class="form.proId ? '' : 'choose-input-placeholder'">
                    {{ form.proId ? form.proId : $t('common.placeholder_choose') }}
                </view>
            </view>

            <!-- 任务日期 -->
            <view class="form-bg-item">
                <view class="label required">{{ $t('staff.task.add.key_RWRQ') }}</view>
                <!-- <view class="uni-input choose-input" :class="form.workId ? '' : 'choose-input-placeholder'">
                    {{ form.workId ? form.workId : $t('common.placeholder_choose') }}
                </view> -->

                <uni-datetime-picker
                    hide-second
                    v-model="form.datetimerange"
                    type="datetimerange"
                    @change="handleDateChange"
                >
                    <view class="uni-input choose-input" v-if="form.startTime"
                        >{{ form.startTime }} - {{ form.endTime }}</view
                    >
                    <view class="uni-input choose-input choose-input-placeholder" v-else>
                        {{ $t('common.placeholder_choose') }}
                    </view>
                </uni-datetime-picker>
            </view>
            <!-- 任务执行人 -->
            <view class="form-bg-item">
                <view class="label required">{{ $t('staff.task.add.key_RWZXR') }}</view>
                <view class="uni-input choose-input" :class="form.workId ? '' : 'choose-input-placeholder'">
                    {{ form.workId ? form.workId : $t('common.placeholder_choose') }}
                </view>
            </view>
            <!-- 任务描述 -->
            <view class="form-bg-item">
                <view class="label required">{{ $t('staff.task.add.key_RWMS') }}</view>
                <textarea
                    placeholder-class="ph"
                    :placeholder="$t('common.placeholder')"
                    class="uni-textarea"
                    v-model="form.taskDescription"
                    maxlength="500"
                ></textarea>
            </view>
        </scroll-view>
        <view>
            <LockButton :onClick="handleSave">{{ $t('staff.task.add.submit') }}</LockButton>
        </view>
    </view>
</template>

<script lang="ts" setup>
    import { ref, reactive } from 'vue';
    import { useContentHeight } from '@/hooks/useContentHeight';
    import LockButton from '@/components/LockButton/index.vue';
    import API from '@/apis/index';
    import { onShow } from '@dcloudio/uni-app';

    const { contentHeight } = useContentHeight(0);

    interface FormData {
        type: number | null;
        proId?: number | null;
        datetimerange: string[];
        startTime: string;
        endTime: string;
        workId: number;
        taskDescription: string;
    }
    const typeIndex = ref(0);
    const typeArray = reactive<any[]>([]);

    const fetchTypeList = async () => {
        const res = await API.EMP_getTaskType();
        console.log('typeList-res', res);
        typeArray.splice(0, typeArray.length, ...res.data.typeList);
    };

    const form = reactive<FormData>({
        type: null,
        proId: null,
        datetimerange: ['', ''],
        startTime: '',
        endTime: '',
        workId: 0,
        taskDescription: '',
    });
    const bindPickerTypeChange = (e: any) => {
        console.log('bindPickerTypeChange', e);
        typeIndex.value = e.detail.value;
        form.type = typeArray[e.detail.value].value;
    };

    const Back = () => {
        // uni.navigateBack();
    };
    const handleDateChange = (val: string[]) => {
        console.log(val);
        form.startTime = val[0];
        form.endTime = val[1];
    };

    const handleSave = async () => {
        // TODO: 提交表单
    };

    onShow(() => {
        fetchTypeList();
    });
</script>
<style lang="scss" scoped>
    .task-pageAddEdit-page {
        display: flex;
        flex-direction: column;

        overflow: hidden; /* 避免外层也滚动 */

        .scroll-from {
            flex: 1;
            flex-shrink: 0;
            min-height: 0;
        }

        .form-bg-item {
            border-radius: 24rpx;
            background-color: #fff;
            padding: 24rpx;
            margin-bottom: 24rpx;
            box-sizing: border-box;
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
                &.choose-input {
                    position: relative;
                    min-height: 24rpx;
                    &.choose-input-placeholder {
                        color: #9ca3af;
                        font-size: 28rpx;
                        font-weight: normal;
                    }
                    &::after {
                        position: absolute;
                        content: '';
                        width: 28rpx;
                        height: 28rpx;
                        background-image: url('@/assets/images/down-icon.png');
                        background-size: cover;
                        right: 0;
                    }
                }
            }
            .uni-textarea {
                font-weight: 600;
                height: 300rpx;
                font-size: 28rpx;
                color: #303133;
                line-height: 28rpx;
                box-sizing: border-box;
            }
        }
    }
</style>
