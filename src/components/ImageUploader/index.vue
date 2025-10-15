<template>
    <view class="iu-wrap">
        <!-- 已上传图片 -->
        <view v-for="(url, i) in innerList" :key="url + i" class="iu-item" @tap="onPreview(i)">
            <image class="iu-img" :src="url" mode="aspectFill" />
            <view v-if="!disabled && deletable" class="iu-del" @tap.stop="onRemove(i)">×</view>
        </view>

        <!-- 上传入口：若未达上限 -->
        <view v-if="!disabled && innerList.length < maxCount" class="iu-add" @tap="onChoose">
            <view class="iu-add-icon"></view>
            <text class="iu-add-text">{{ addText }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from 'vue';

    // type UploadFn = (localPath: string) => Promise<string>; // 需返回线上URL或可用路径

    interface Props {
        /** v-model 已上传图片URL列表 */
        modelValue: string[];
        /** 数量上限 */
        maxCount?: number;
        /** 单文件大小上限(MB) */
        maxSizeMB?: number;
        /** 允许的图片扩展名 */
        acceptExt?: string[]; // ['png','jpg','jpeg','webp','gif','bmp']
        /** 自定义上传函数（如果不传，则直接使用本地临时路径） */
        // uploadFn?: UploadFn;
        /** 禁用 */
        disabled?: boolean;
        /** 可删除 */
        deletable?: boolean;
        /** 上传按钮文案 */
        addText?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        modelValue: () => [],
        maxCount: 10,
        maxSizeMB: 5,
        acceptExt: () => ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'],
        disabled: false,
        deletable: true,
        addText: '上传图片',
    });

    const emit = defineEmits<{
        (e: 'update:modelValue', v: string[]): void;
        (e: 'change', v: string[]): void;
        (e: 'exceed', payload: { over: number; max: number }): void;
        (e: 'error', msg: string): void;
    }>();

    const innerList = ref<string[]>([...props.modelValue]);

    watch(
        () => props.modelValue,
        v => (innerList.value = [...v]),
    );

    const maxBytes = computed(() => props.maxSizeMB * 1024 * 1024);

    function isImageFile(ext?: string, mime?: string) {
        if (mime && mime.startsWith('image/')) return true;
        if (!ext) return false;
        return props.acceptExt.map(x => x.toLowerCase()).includes(ext.toLowerCase());
    }

    function getExtByPath(path: string) {
        const m = path?.split('?')[0]?.match(/\.([a-zA-Z0-9]+)$/);
        return m ? m[1] : '';
    }

    async function onChoose() {
        if (props.disabled) return;
        const remain = props.maxCount - innerList.value.length;
        if (remain <= 0) {
            emit('exceed', { over: 0, max: props.maxCount });
            return;
        }

        uni.chooseImage({
            count: remain,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: async res => {
                type ImgFile = UniApp.ChooseImageSuccessCallbackResultFile | File;

                // 统一成数组
                const temp: ImgFile[] = Array.isArray(res.tempFiles)
                    ? (res.tempFiles as ImgFile[])
                    : res.tempFiles
                    ? [res.tempFiles as ImgFile]
                    : [];

                const files = temp.slice(0, remain);

                for (const f of files) {
                    const localPath = (f as any).path || (f as any).tempFilePath || '';
                    const size = (f as any).size ?? 0;
                    const mime = (f as any).type as string | undefined;
                    const ext = getExtByPath(localPath);

                    // 类型校验
                    if (!isImageFile(ext, mime)) {
                        emit('error', `仅支持图片类型：${props.acceptExt.join('/')}`);
                        continue;
                    }
                    // 大小校验
                    if (size > maxBytes.value) {
                        emit('error', `单个文件不能超过 ${props.maxSizeMB}MB`);
                        continue;
                    }

                    try {
                        let url = localPath;
                        //    这里写上传的逻辑

                        innerList.value.push(url);
                    } catch (e: any) {
                        emit('error', e?.message || '上传失败');
                    }
                }

                emit('update:modelValue', innerList.value);
                emit('change', innerList.value);
            },
            fail: err => emit('error', err?.errMsg || '选择图片失败'),
        });
    }

    function onRemove(i: number) {
        innerList.value.splice(i, 1);
        emit('update:modelValue', innerList.value);
        emit('change', innerList.value);
    }

    function onPreview(i: number) {
        uni.previewImage({
            urls: innerList.value,
            current: i,
        });
    }
</script>

<style scoped lang="scss">
    /* 容器：九宫格/流式排列 */
    .iu-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 16rpx;
    }

    /* 项目方按设计可把尺寸调成一致值 */
    $size: 154rpx;

    .iu-item,
    .iu-add {
        width: $size;
        height: $size;
        border-radius: 8rpx;
        overflow: hidden;
        position: relative;
        background: #f5f7fb;
    }

    /* 已上传图片 */
    .iu-img {
        width: 100%;
        height: 100%;
        display: block;
    }

    /* 删除按钮 */
    .iu-del {
        position: absolute;
        right: 6rpx;
        top: 6rpx;
        width: 24rpx;
        height: 24rpx;
        border-radius: 50%;
        background: #8a8a8a;
        color: #fff;
        font-size: 20rpx;
        line-height: 24rpx;
        text-align: center;
    }

    /* 上传入口 */
    .iu-add {
        border: 2rpx dashed #d8dbe3;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #909399;
    }
    .iu-add-icon {
        width: 44rpx;
        height: 44rpx;
        background-image: url('../../assets/images/Upload-image.png');
        background-size: cover;
        margin-bottom: 12rpx;
    }
    .iu-add-text {
        font-weight: 400;
        font-size: 24rpx;
        color: #909399;
    }
</style>
