<!-- LockButton.vue -->
<template>
    <button :style="style" class="lock-button" :disabled="loading" @click="run">
        <slot>
            {{ loading ? '处理中...' : '保存' }}
        </slot>
    </button>
</template>

<script setup>
    import { useLock } from '@/hooks/useLock';

    const props = defineProps({
        onClick: {
            type: Function,
            default: () => Promise.resolve(),
        },
        isDisable: {
            type: Boolean,
            default: false,
        },
        style: {
            type: Object,
            default: () => ({
                backgroundColor: '#F7931E',
                color: '#fff',
                border: 'none',
                height: '80rpx',
                borderRadius: '24rpx',
                lineHeight: '80rpx',
            }),
        },
    });

    const { loading, run } = useLock(props.onClick);
</script>

<style lang="scss" scoped>
    .lock-button {
        &::after {
            border: none;
        }
        // background-color: #007aff;
        border-radius: 0;
        line-height: normal;
        padding: 0;
        font-size: 32rpx;
    }
</style>
