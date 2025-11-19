<template>
    <view class="iu-wrap">
        <!-- 已上传图片 -->
        <view v-for="(item, i) in innerList" :key="item.url + i" class="iu-item" @tap="onPreview(i)">
            <image class="iu-img" :src="item.url" mode="aspectFill" />
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
    import { i18n } from '@/main';
    import { useGlobalStore } from '@/stores/index';
    import { refreshTokenWay } from '@/utils/request';

    const store = useGlobalStore();

    // type UploadFn = (localPath: string) => Promise<string>; // 需返回线上URL或可用路径

    // 统一把相对路径转绝对（若后端返回相对地址）
    const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASEURL || '';
    // 自定义额外表单字段（可按需传）
    const extraFormData = {
        /* bizType: 'emp', ... */
        fileType: 1,
    };

    // / ===== 上传实现 =====
    function uploadOne(localPath: string, onProgress?: (p: number) => void): Promise<any> {
        const doUpload = (token: string) =>
            new Promise<any>((resolve, reject) => {
                const task = uni.uploadFile({
                    url: UPLOAD_URL,
                    filePath: localPath,
                    name: 'file',
                    formData: extraFormData,
                    header: {
                        Accept: 'application/json',
                        token: token || '',
                    },
                    success: res => {
                        if (res.statusCode !== 200) return reject(`HTTP ${res.statusCode}`);
                        try {
                            const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                            resolve(data);
                        } catch (e) {
                            reject('返回解析失败');
                        }
                    },
                    fail: err => reject(err?.errMsg || '上传失败'),
                });

                task?.onProgressUpdate?.(prog => onProgress?.(prog.progress));
            });

        return new Promise(async (resolve, reject) => {
            try {
                const currentToken = uni.getStorageSync('token') || store?.token || '';
                let data: any = await doUpload(currentToken);

                // 成功
                if (data?.code === 2000) {
                    const raw1 = data.data.filePath;
                    const finalUrl = String(raw1 || '').startsWith('http') ? raw1 : IMAGE_BASE + raw1;
                    if (!finalUrl) return reject('上传成功但未返回地址');
                    return resolve({ path: raw1, url: finalUrl });
                }

                // token 过期 -> 调用共享刷新逻辑并重试一次
                if (data?.code === 1010) {
                    console.log('============刷新 token=========');
                    try {
                        const refreshToken = uni.getStorageSync('refreshToken') || '';
                        const newToken = await refreshTokenWay(refreshToken);
                        // 重试上传
                        data = await doUpload(newToken);
                        if (data?.code === 2000) {
                            const raw2 = data.data.filePath;
                            const finalUrl = String(raw2 || '').startsWith('http') ? raw2 : IMAGE_BASE + raw2;
                            if (!finalUrl) return reject('上传成功但未返回地址');
                            return resolve({ path: raw2, url: finalUrl });
                        } else {
                            return reject(data?.msg || '上传失败');
                        }
                    } catch (err: any) {
                        console.error('上传图片组件的上传失败===', err);
                        return reject(err?.message || String(err) || '刷新 token 失败');
                    }
                }

                // 其它错误
                reject(data?.msg || '上传失败');
            } catch (err: any) {
                reject(err?.message || String(err) || '上传失败');
            }
        });
    }

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
        /** 可选平台 客户端 员工端 */
        platform?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        modelValue: () => [],
        maxCount: 10,
        maxSizeMB: 5,
        // acceptExt: () => ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'],
        acceptExt: () => ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'heic', 'heif'],
        disabled: false,
        deletable: true,
        addText: i18n.global.t('common.text.uploadImage'),
        platform: 'emp',
    });

    const UPLOAD_URL =
        props.platform === 'emp'
            ? `${import.meta.env.VITE_SERVER_BASEURL.replace(/\/+$/, '')}/emp/common/fileUpload`
            : `${import.meta.env.VITE_SERVER_BASEURL.replace(/\/+$/, '')}/cus/common/fileUpload`;

    const emit = defineEmits<{
        (e: 'update:modelValue', v: string[]): void;
        (e: 'change', v: string[]): void;
        (e: 'exceed', payload: { over: number; max: number }): void;
        (e: 'error', msg: string): void;
        (e: 'uploading', v: boolean): void; // 新增：通知父组件“正在上传”
        (e: 'idle'): void; // 新增：通知父组件“上传已空闲”
    }>();

    const uploadingCount = ref(0); // 新增
    const isUploading = computed(() => uploadingCount.value > 0); // 新增

    function waitForIdle(): Promise<void> {
        if (!isUploading.value) return Promise.resolve();
        return new Promise(resolve => {
            const stop = watch(isUploading, v => {
                if (!v) {
                    stop();
                    resolve();
                }
            });
        });
    }
    defineExpose({ waitForIdle, isUploading });
    watch(isUploading, v => {
        v ? emit('uploading', true) : emit('idle');
    });

    const innerList = ref<any[]>([...props.modelValue]);

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

        const chooseFn = () =>
            new Promise<any>((resolve, reject) => {
                if (typeof (uni as any).chooseFile === 'function') {
                    uni.chooseFile({
                        count: remain,
                        type: 'image',
                        success: resolve,
                        fail: reject,
                    });
                } else {
                    uni.chooseImage({
                        count: remain,
                        sizeType: ['compressed'],
                        sourceType: ['album', 'camera'],
                        success: resolve,
                        fail: reject,
                    } as any);
                }
            });

        try {
            const res = await chooseFn();

            // 兼容 chooseFile/chooseImage 返回结构
            let tempFiles: any[] = [];
            if (Array.isArray(res.tempFiles)) tempFiles = res.tempFiles;
            else if (Array.isArray(res.tempFilePaths))
                tempFiles = (res.tempFilePaths as string[]).map(p => ({ path: p }));
            else if (res.tempFiles) tempFiles = [res.tempFiles];

            const files = tempFiles.slice(0, remain);
            for (const f of files) {
                const localPath = (f as any).path || (f as any).tempFilePath || (f as any).uri || '';
                const size = typeof (f as any).size === 'number' ? (f as any).size : 0;
                const mime = (f as any).type || (f as any).mime || '';
                const ext = getExtByPath(localPath).toLowerCase();

                // 类型校验（支持 heic/heif via acceptExt）
                if (!isImageFile(ext, mime)) {
                    uni.showToast({ title: i18n.global.t('common.upload.image.tip2'), icon: 'none' });
                    emit('error', `仅支持图片类型：${props.acceptExt.join('/')}`);
                    continue;
                }
                if (size > maxBytes.value) {
                    uni.showToast({
                        title: `${i18n.global.t('common.upload.image.tip1')} ${props.maxSizeMB}MB`,
                        icon: 'none',
                    });
                    emit('error', `单个文件不能超过 ${props.maxSizeMB}MB`);
                    continue;
                }

                uploadingCount.value++;
                try {
                    const remoteUrlObj = await uploadOne(localPath, p => {
                        // 进度回调（可选）
                    });
                    innerList.value.push(remoteUrlObj);
                } catch (err: any) {
                    emit('error', err?.message || String(err) || '上传失败');
                } finally {
                    uploadingCount.value--;
                }
            }

            emit('update:modelValue', innerList.value);
            emit('change', innerList.value);
        } catch (err: any) {
            console.error('选取图片 fail', err);
            emit('error', err?.message || String(err) || '选取失败');
        }
    }

    function onRemove(i: number) {
        innerList.value.splice(i, 1);
        emit('update:modelValue', innerList.value);
        emit('change', innerList.value);
    }

    function onPreview(i: number) {
        const urls = innerList.value.map(x => x.url);
        uni.previewImage({
            urls: urls,
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
