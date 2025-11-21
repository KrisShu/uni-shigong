<template>
    <view class="iu-wrap">
        <view v-for="(item, i) in innerList" :key="item.url + i" class="iu-item" @tap="onPreview(i)">
            <template v-if="item.type === 'image'">
                <image class="iu-img" :src="item.url" mode="aspectFill" />
            </template>
            <template v-else-if="item.type === 'pdf'">
                <image v-if="item.coverUrl" class="iu-img" :src="item.coverUrl" mode="aspectFill" />
                <view v-else class="iu-file-cover">📄 PDF</view>
            </template>
            <template v-else>
                <view class="iu-file-cover">📁 {{ item.path.split('.').pop() || '文件' }}</view>
            </template>

            <view v-if="!disabled && deletable" class="iu-del" @tap.stop="onRemove(i)">×</view>
        </view>

        <view v-if="!disabled && innerList.length < maxCount" class="iu-add" @tap="onChoose">
            <view class="iu-add-icon"></view>
            <text class="iu-add-text">上传</text>
        </view>
    </view>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from 'vue';
    import { i18n } from '@/main';
    import { useGlobalStore } from '@/stores/index';
    import { refreshTokenWay } from '@/utils/request';
    import { compressImageIfNeeded } from '@/utils/image'; // 路径按你放的位置改
    import PDF_ICON from '@/assets/images/call.png';

    const store = useGlobalStore();

    // 统一把相对路径转绝对（若后端返回相对地址）
    const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASEURL || '';

    // 自定义额外表单字段
    let extraFormData = {
        fileType: 1, // 示例字段
    };

    // PDF 默认封面图标（请替换为您项目中的实际路径）
    // const PDF_ICON = '您项目中PDF图标的URL或本地路径';

    // 附件数据结构定义
    interface AttachmentItem {
        path: string; // 后端返回的相对路径
        url: string; // 完整的绝对路径
        type: 'image' | 'pdf' | 'other'; // 附件类型
        coverUrl?: string; // PDF/其他文件的封面图 URL
    }

    /**
     * H5/Web端：将 blob: URL 或 File 对象转换为可上传的格式。
     * 非H5端：直接返回。
     */
    async function ensureUploadableFile(input: string | File): Promise<string | File> {
        // #ifdef H5
        if (typeof input !== 'string') {
            return input; // 已是 File
        }
        if (input.startsWith('blob:')) {
            const res = await fetch(input);
            const blob = await res.blob();

            // 关键优化：使用通用文件名，并从 blob 获取正确的 MIME type
            const mimeType = blob.type || 'application/octet-stream';
            let defaultExt = '.bin';
            if (mimeType.includes('image/')) defaultExt = '.jpg';
            if (mimeType.includes('pdf')) defaultExt = '.pdf';

            // 尝试从原始URL中获取文件名（可选，但更友好）
            const urlSegments = input.split('/');
            let name = urlSegments[urlSegments.length - 1];
            if (!name.includes('.')) {
                name = `uploaded${defaultExt}`;
            }

            // 返回 File 对象，确保 type 正确
            return new File([blob], name, { type: mimeType });
        }
        // #endif
        return input;
    }

    /**
     * 执行单文件上传的函数，包含 Token 逻辑。
     */
    function uploadOne(localPath: string | File, onProgress?: (p: number) => void): Promise<any> {
        // 统一的“真正上传”函数
        const doUpload = (token: string, filePathForUpload: string | File) => {
            // #ifdef H5
            // H5：如果是 File（Blob），用 XHR + FormData
            if (typeof filePathForUpload !== 'string') {
                return new Promise<any>((resolve, reject) => {
                    const form = new FormData();
                    form.append('file', filePathForUpload as File, (filePathForUpload as File).name || 'file');
                    if (extraFormData) {
                        Object.keys(extraFormData).forEach(k => form.append(k, (extraFormData as any)[k]));
                    }

                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', UPLOAD_URL, true);
                    xhr.setRequestHeader('Accept', 'application/json');
                    if (token) xhr.setRequestHeader('token', token);

                    xhr.upload.onprogress = e => {
                        if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
                    };
                    xhr.onload = () => {
                        try {
                            const data = JSON.parse(xhr.responseText || '{}');
                            resolve(data);
                        } catch {
                            reject('返回解析失败');
                        }
                    };
                    xhr.onerror = () => reject('上传失败');
                    xhr.send(form);
                });
            }
            // #endif

            // 其余端 & H5(string 路径)：走 uni.uploadFile
            return new Promise<any>((resolve, reject) => {
                const task = uni.uploadFile({
                    url: UPLOAD_URL,
                    filePath: filePathForUpload as any, // 必须是字符串路径
                    name: 'file',
                    formData: extraFormData,
                    header: { Accept: 'application/json', token: token || '' },
                    success: res => {
                        if (res.statusCode !== 200) return reject(`HTTP ${res.statusCode}`);
                        try {
                            const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                            resolve(data);
                        } catch {
                            reject('返回解析失败');
                        }
                    },
                    fail: err => reject(err?.errMsg || '上传失败'),
                });
                task?.onProgressUpdate?.(prog => onProgress?.(prog.progress));
            });
        };

        // 封装 Token 刷新和重试逻辑
        return new Promise(async (resolve, reject) => {
            try {
                // 兼容 H5 的 blob:/File
                const filePathForUpload = await ensureUploadableFile(localPath as any);

                const currentToken = uni.getStorageSync('token') || store?.token || '';
                let data: any = await doUpload(currentToken, filePathForUpload);

                if (data?.code === 2000) {
                    const raw1 = data.data.filePath;
                    const finalUrl = String(raw1 || '').startsWith('http') ? raw1 : IMAGE_BASE + raw1;
                    if (!finalUrl) return reject('上传成功但未返回地址');
                    return resolve({ path: raw1, url: finalUrl });
                }

                if (data?.code === 1010) {
                    // Token 过期，尝试刷新
                    try {
                        const refreshToken = uni.getStorageSync('refreshToken') || '';
                        const newToken = await refreshTokenWay(refreshToken);
                        data = await doUpload(newToken, filePathForUpload); // 二次上传
                        if (data?.code === 2000) {
                            const raw2 = data.data.filePath;
                            const finalUrl = String(raw2 || '').startsWith('http') ? raw2 : IMAGE_BASE + raw2;
                            if (!finalUrl) return reject('上传成功但未返回地址');
                            return resolve({ path: raw2, url: finalUrl });
                        } else {
                            return reject(data?.msg || '上传失败');
                        }
                    } catch (err: any) {
                        return reject(err?.message || String(err) || '刷新 token 失败');
                    }
                }

                if (data?.code === 1003 || data?.code === 1009) {
                    // 账号过期
                    console.log('============账号信息过期 请重新登录=========');
                    store.loginOut();
                    return reject('账号信息过期 请重新登录');
                }

                reject(data?.msg || '上传失败');
            } catch (err: any) {
                reject(err?.message || String(err) || '上传失败');
            }
        });
    }

    interface Props {
        /** v-model 已上传附件URL列表 */
        modelValue: AttachmentItem[];
        /** 数量上限 */
        maxCount?: number;
        /** 单文件大小上限(MB) */
        maxSizeMB?: number;
        /** 图片压缩触发阈值(MB)，超过才压缩 */
        compressMaxSizeMB?: number;
        /** 允许的文件扩展名 */
        acceptExt?: string[];
        /** 禁用 */
        disabled?: boolean;
        /** 可删除 */
        deletable?: boolean;
        /** 上传按钮文案 */
        addText?: string;
        /** 可选平台 客户端/员工端 */
        platform?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        modelValue: () => [],
        maxCount: 10,
        maxSizeMB: 50,
        compressMaxSizeMB: 1, // 默认 1MB
        // 默认允许图片和 PDF
        acceptExt: () => ['image/', 'application/pdf'],
        disabled: false,
        deletable: true,
        addText: '上传附件',
        platform: 'emp',
    });

    // 计算上传 URL
    const UPLOAD_URL =
        props.platform === 'emp'
            ? `${import.meta.env.VITE_SERVER_BASEURL.replace(/\/+$/, '')}/emp/common/fileUpload`
            : `${import.meta.env.VITE_SERVER_BASEURL.replace(/\/+$/, '')}/cus/common/fileUpload`;

    const emit = defineEmits<{
        (e: 'update:modelValue', v: AttachmentItem[]): void; // 修改类型
        (e: 'change', v: AttachmentItem[]): void; // 修改类型
        (e: 'exceed', payload: { over: number; max: number }): void;
        (e: 'error', msg: string): void;
        (e: 'uploading', v: boolean): void;
        (e: 'idle'): void;
    }>();

    const uploadingCount = ref(0); // 正在上传的文件数
    const isUploading = computed(() => uploadingCount.value > 0);

    // 暴露给父组件的方法和状态
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

    // 通知父组件上传状态
    watch(isUploading, v => {
        v ? emit('uploading', true) : emit('idle');
    });

    const innerList = ref<AttachmentItem[]>([]);

    watch(
        () => props.modelValue,
        v => (innerList.value = [...v]),
        { immediate: true, deep: true },
    );

    const maxBytes = computed(() => props.maxSizeMB * 1024 * 1024);

    /** 从文件路径中获取扩展名 */
    function getExtByPath(path: string) {
        const m = path?.split('?')[0]?.match(/\.([a-zA-Z0-9]+)$/);
        return m ? m[1]?.toLowerCase() : '';
    }

    /** 检查文件类型是否在允许范围内 */
    function isFileTypeAllowed(ext?: string, mime?: string) {
        const allowedTypes = props.acceptExt.map(x => x.toLowerCase());
        const lowerMime = mime.toLowerCase();
        for (const allowed of allowedTypes) {
            if (allowed.endsWith('/')) {
                // 匹配前缀 (例如 'image/' 匹配 'image/png')
                if (lowerMime.startsWith(allowed)) {
                    return true;
                }
            } else {
                // 匹配完整类型 (例如 'application/pdf' 匹配 'application/pdf')
                if (lowerMime === allowed) {
                    return true;
                }
            }
        }

        // 所有检查均未通过
        return false;
    }

    /**
     * 选择附件
     */
    async function onChoose() {
        if (props.disabled) return;
        const remain = props.maxCount - innerList.value.length;
        if (remain <= 0) {
            emit('exceed', { over: 0, max: props.maxCount });
            return;
        }

        let files: UniApp.ChooseFile[] = [];

        // 使用 uni.chooseMessageFile (微信/H5) 或 uni.chooseFile (App/其他) 来支持所有文件类型
        try {
            console.log('使用 uni.chooseFile 选择文件');
            const res: any = await uni.chooseFile({
                count: remain,
                type: 'all',
            });
            files = res.tempFiles || [];
        } catch (e: any) {
            // 兜底：如果文件选择失败，再尝试图片选择
            console.warn('文件选择 API 失败，尝试回退到 uni.chooseImage', e);
            try {
                const imgRes = await uni.chooseImage({
                    count: remain,
                    sizeType: ['compressed'],
                    sourceType: ['album', 'camera'],
                });
                files = (imgRes.tempFiles as any) || [];
            } catch (err: any) {
                console.error('选择图片失败:', err);
                return;
            }
            console.error('[AttachmentUploader] choose/upload error', err);
            emit('error', err?.message || String(err) || '选取/上传失败');
        }

        if (!files.length) return;

        for (const f of files) {
            const localPath = (f as any).path || (f as any).tempFilePath || '';
            const size = (f as any).size ?? 0;
            const mime = (f as any).type as string | undefined;
            const ext = getExtByPath(localPath);

            console.log('[AttachmentUploader] choose file', localPath, size, mime, ext);

            // 类型和大小校验
            if (!isFileTypeAllowed(ext, mime)) {
                if (!isFileTypeAllowed(ext, mime)) {
                    const typeInfo = mime || ext || '所选'; // 优先 MIME, 其次 Ext, 再次通用词
                    uni.showToast({ title: `不支持 ${typeInfo} 文件`, icon: 'none' });
                    emit('error', `不支持的文件类型：${typeInfo}`);
                    continue; //跳过当前这次循环的剩余代码，并立即开始下一次循环的迭代
                }
            }
            if (size > maxBytes.value) {
                uni.showToast({ title: `文件不能超过 ${props.maxSizeMB}MB`, icon: 'none' });
                emit('error', `单个文件不能超过 ${props.maxSizeMB}MB`);
                continue; //跳过当前这次循环的剩余代码，并立即开始下一次循环的迭代
            }

            let pathForUpload = localPath;
            let attachmentType: AttachmentItem['type'] = 'other';
            let coverUrl: string | undefined = undefined;

            const lowerMime = mime?.toLowerCase() || '';
            const lowerExt = ext?.toLowerCase() || '';

            // --- 类型识别与预处理 ---
            // 1. 检查是否为图片类型 (image/*)
            if (lowerMime.startsWith('image/')) {
                attachmentType = 'image';
                extraFormData.fileType = 1;

                // 压缩图片
                try {
                    pathForUpload = await compressImageIfNeeded(localPath, size, {
                        maxSizeMB: props.compressMaxSizeMB,
                        maxWH: 1600,
                        quality: 0.7,
                    });
                } catch (e) {
                    console.error('图片压缩失败，使用原图路径', e);
                }
            }
            // 2. 检查是否为 PDF 类型
            else if (lowerMime === 'application/pdf' || lowerExt === 'pdf') {
                // 增加 ext === 'pdf' 兜底，以防某些平台或环境未提供完整的 MIME
                attachmentType = 'pdf';
                extraFormData.fileType = 2;
                coverUrl = PDF_ICON; // 指定 PDF 封面图标
            }

            // --- 上传流程 ---
            uploadingCount.value++;
            try {
                const remoteUrlObj: any = await uploadOne(pathForUpload);

                // 组装新的 AttachmentItem 结构
                const newItem: AttachmentItem = {
                    path: remoteUrlObj.path,
                    url: remoteUrlObj.url,
                    type: attachmentType,
                    coverUrl: coverUrl,
                };

                innerList.value.push(newItem);
            } catch (e: any) {
                uni.showToast({ title: e?.message || '上传失败', icon: 'none' });
                emit('error', e?.message || String(e) || '上传失败');
            } finally {
                uploadingCount.value--;
            }
        }

        emit('update:modelValue', innerList.value);
        emit('change', innerList.value);
    }

    /**
     * 预览或打开附件
     */
    function onPreview(i: number) {
        const item = innerList.value[i];
        if (!item) return;

        if (item.type === 'image') {
            // 图片：使用 uni.previewImage
            const urls = innerList.value.filter(x => x.type === 'image').map(x => x.url);
            const current = urls.indexOf(item.url);

            uni.previewImage({
                urls: urls,
                current: current,
            });
        } else {
            // PDF/其他文件：使用 uni.openDocument
            uni.showLoading({ title: '文件加载中...' });
            uni.openDocument({
                filePath: item.url, // 完整的 URL
                // #ifdef MP-WEIXIN || APP-PLUS
                showMenu: true,
                // #endif
                success: () => {
                    uni.hideLoading();
                },
                fail: err => {
                    uni.hideLoading();
                    uni.showToast({ title: '文件打开失败', icon: 'none' });
                    console.error('openDocument failed:', err);
                },
            });
        }
    }

    /**
     * 移除附件
     */
    function onRemove(i: number) {
        innerList.value.splice(i, 1);
        emit('update:modelValue', innerList.value);
        emit('change', innerList.value);
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

    /* 文件/PDF 封面样式 */
    .iu-file-cover {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 20rpx;
        color: #606266;
        background-color: #e6e6e6;
        flex-direction: column;
        padding: 10rpx;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
        z-index: 10;
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
        /* 请替换为实际的图标路径 */
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
