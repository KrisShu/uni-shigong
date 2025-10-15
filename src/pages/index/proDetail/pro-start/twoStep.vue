<template>
    <view class="wrap-02">
        <view class="title">{{ $t('staff.pro.start_step_2_title') }}</view>
        <view class="questionList-wrap">
            <view class="question-item" v-for="(item, index) in questionList" :key="index">
                <view class="question-title">{{ index + 1 }}、问题标题</view>
                <view class="question-answer">
                    <view class="answer-item">
                        <radio-group class="radio-group" @change="radioChange">
                            <label v-for="answeritem in item.answerOptions" :key="answeritem.value">
                                <view>
                                    <radio
                                        style="transform: scale(0.6)"
                                        activeBackgroundColor="#303133"
                                        :value="answeritem.value"
                                        :checked="answeritem.value === item.answer"
                                    />
                                </view>
                                <view class="value-text">{{ answeritem.name }}</view>
                            </label>
                        </radio-group>
                    </view>
                    <view class="answer-desc" v-show="item.answer == 2">
                        <textarea
                            class="textarea"
                            placeholder-class="ph"
                            :placeholder="$t('staff.pro.start_step_2_placeholder')"
                        />
                    </view>
                </view>
            </view>
        </view>
        <view class="progress-btn" @click="nextThree">
            {{ $t('staff.pro.start_step_2_btn') }}
        </view>
    </view>
</template>

<script lang="ts" setup>
    import { reactive } from 'vue';
    const questionList = reactive([
        {
            title: '问题标题',
            answerOptions: [
                {
                    name: '正常',
                    value: 1,
                },
                {
                    name: '有问题',
                    value: 2,
                },
            ],
            answer: 1,
        },
        {
            title: '问题标题2',
            answerOptions: [
                {
                    name: '正常',
                    value: 1,
                },
                {
                    name: '有问题',
                    value: 2,
                },
            ],
            answer: 2,
        },
        {
            title: '问题标题2',
            answerOptions: [
                {
                    name: '正常',
                    value: 1,
                },
                {
                    name: '有问题',
                    value: 2,
                },
            ],
            answer: 2,
        },
        {
            title: '问题标题2',
            answerOptions: [
                {
                    name: '正常',
                    value: 1,
                },
                {
                    name: '有问题',
                    value: 2,
                },
            ],
            answer: 2,
        },
        {
            title: '问题标题2',
            answerOptions: [
                {
                    name: '正常',
                    value: 1,
                },
                {
                    name: '有问题',
                    value: 2,
                },
            ],
            answer: 2,
        },
        {
            title: '问题标题2',
            answerOptions: [
                {
                    name: '正常',
                    value: 1,
                },
                {
                    name: '有问题',
                    value: 2,
                },
            ],
            answer: 2,
        },
        {
            title: '问题标题2',
            answerOptions: [
                {
                    name: '正常',
                    value: 1,
                },
                {
                    name: '有问题',
                    value: 2,
                },
            ],
            answer: 2,
        },
    ]);
    const radioChange = (e: any) => {
        console.log(e.detail.value);
    };

    const emits = defineEmits(['next']);
    const nextThree = () => {
        emits('next');
    };
</script>

<style lang="scss" scoped>
    .wrap-02 {
        height: 100%;
        .title {
            font-weight: 600;
            font-size: 32rpx;
            color: #303133;
            line-height: 32rpx;
            margin-bottom: 32rpx;
        }
        .questionList-wrap {
            height: 88%;
            overflow-y: auto;
        }
        .question-item {
            margin-bottom: 48rpx;
            .question-title {
                font-weight: 400;
                font-size: 28rpx;
                color: #303133;
                margin-bottom: 22rpx;
            }

            .radio-group {
                display: flex;
                .uni-label-pointer {
                    display: flex;
                    margin-right: 200rpx;
                }
                .value-text {
                    font-size: 28rpx;
                    color: #909399;
                    padding-top: 4rpx;
                }
            }
            .answer-desc {
                height: 120rpx;
                background: #f4f6f8;
                border-radius: 24rpx;
                font-size: 28rpx;
                padding: 24rpx;
                margin-top: 24rpx;
                .textarea {
                    height: 100%;
                }
            }
        }

        .progress-btn {
            width: 90%;
            background: #f7931e;
            border-radius: 24rpx;
            height: 88rpx;
            line-height: 88rpx;
            text-align: center;
            font-weight: 600;
            font-size: 28rpx;
            color: #ffffff;
            position: absolute;
            bottom: 32rpx;
        }
    }
</style>
